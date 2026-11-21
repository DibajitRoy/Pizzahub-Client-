import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { jwt } from "better-auth/plugins";
import { MongoClient, ObjectId } from "mongodb";

const g = globalThis as unknown as { _pizzaMongo?: MongoClient };
const client = g._pizzaMongo ?? new MongoClient(process.env.MONGODB_URI!);
if (process.env.NODE_ENV !== "production") g._pizzaMongo = client;
const db = client.db(process.env.MONGODB_DB || "pizzahub");

const siteUrl = (process.env.BETTER_AUTH_URL || "http://localhost:3000").replace(/\/$/, "");

export const auth = betterAuth({
  baseURL: siteUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [siteUrl],
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: true, minPasswordLength: 6 },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    modelName: "users",
    additionalFields: {
      role: { type: "string", required: false, input: true },
      roleSelected: { type: "boolean", required: false, input: false, defaultValue: false },
      isBlocked: { type: "boolean", required: false, input: false, defaultValue: false },
      businessName: { type: "string", required: false, input: true },
      subscriptionPlan: { type: "string", required: false, input: false, defaultValue: "free" },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
    },
  },
  plugins: [
    jwt({
      jwt: {
        issuer: siteUrl,
        audience: siteUrl,
        expirationTime: "30m",
        definePayload: ({ user }) => ({ id: user.id, email: user.email }),
      },
    }),
  ],
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const pw = String(ctx.body?.password ?? "");
        if (pw.length < 6 || !/[A-Z]/.test(pw) || !/[a-z]/.test(pw)) {
          throw new APIError("BAD_REQUEST", {
            message: "Password needs 6+ characters, one uppercase and one lowercase letter",
          });
        }
      }
      if (ctx.path === "/update-user") {
        // Users can never change role / block status / subscription via profile updates
        const allowed = ["name", "image", "businessName"];
        const bad = Object.keys(ctx.body ?? {}).filter((k) => !allowed.includes(k));
        if (bad.length) throw new APIError("FORBIDDEN", { message: "You cannot change these fields" });
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const chose = user.role === "vendor" || user.role === "customer";
          return {
            data: {
              ...user,
              role: chose ? user.role : "customer", // "admin" can never come from public signup
              roleSelected: chose,
              isBlocked: false,
              subscriptionPlan: "free",
            },
          };
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const id = String(session.userId);
          const found = await db
            .collection("users")
            .findOne({ $or: [...(ObjectId.isValid(id) ? [{ _id: new ObjectId(id) }] : []), { _id: id as never }] });
          if (found?.isBlocked) {
            throw new APIError("FORBIDDEN", { message: "Your account has been blocked" });
          }
        },
      },
    },
  },
});