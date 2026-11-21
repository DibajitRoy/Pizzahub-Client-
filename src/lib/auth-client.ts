import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    jwtClient(),
    inferAdditionalFields({
      user: {
        role: { type: "string", required: false },
        roleSelected: { type: "boolean", required: false },
        isBlocked: { type: "boolean", required: false },
        businessName: { type: "string", required: false },
        subscriptionPlan: { type: "string", required: false },
      },
    }),
  ],
});

export const { useSession } = authClient;