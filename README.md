# PizzaHub

PizzaHub is a role based pizza ordering and delivery platform. Customers browse local restaurant menus and place orders, vendors manage menu items and incoming orders, and admins review listings and monitor the platform.

## Features

- Email/password and Google sign in with Better Auth; public sign up supports customer and vendor accounts. Admin accounts are assigned with the server's `make-admin` script.
- Public menu search by name and description, category and location filters, pagination, and newest/price sorting.
- Item details, customer favorites, order placement, order status tracking, and cancellation of pending orders.
- Vendor dashboards for menu management, availability, orders, and Free/Premium subscription status.
- Admin dashboards for users, menu review, transactions, charts, and optional user blocking.
- Premium activation and expiration are controlled by verified Stripe webhooks.
- Menu item image uploads use ImgBB. Profile images are optional.
- Responsive pizza themed interface, loading/empty/error states, toast messages, animation, and an order status timeline.
- API requests go through a same-origin Next.js route handler, avoiding browser CORS failures when talking to the Express server.

## Technology

- Client: Next.js App Router 16, React 19, TypeScript, Tailwind CSS 4, ShadCN-style UI components, Motion, Recharts, Lucide.
- Authentication/data: Better Auth, MongoDB.
- Server: Express 5, MongoDB driver, `jose` JWT/JWKS verification, Stripe SDK.
- Image hosting: ImgBB.

## Local development

Requires Node.js and npm. Configure the environment files below before starting either app.

1. Install client dependencies and run Next.js:

   ```bash
   npm install
   npm run dev
   ```

2. In a second terminal, open the server project (currently expected at `../pizzahub(server)`), install dependencies, and run Express:

   ```bash
   cd "../pizzahub(server)"
   npm install
   npm run dev
   ```

3. Open `http://localhost:3000`. The Express API listens on port `5000` by default.

## Environment variables

Create a local `.env` in this client project and a local `.env` in the server project. Never commit either file or put real credentials in an example file.

### Client (`pizza-hub/.env`)

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string used by Better Auth |
| `MONGODB_DB` | Better Auth database name; defaults to `pizzahub` |
| `BETTER_AUTH_SECRET` | Secret used by Better Auth |
| `BETTER_AUTH_URL` | Public base URL for Better Auth; `http://localhost:3000` locally |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_API_URL` | Express API base including `/api`; `http://localhost:5000/api` locally |
| `IMGBB_API_KEY` | ImgBB upload API key |

### Server (`pizzahub(server)/.env`)

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `DB_NAME` | Business data database name; defaults to `pizzahub` |
| `AUTH_URL` | Better Auth/JWKS base URL; `http://localhost:3000` locally |
| `CLIENT_URL` | Allowed client origins, comma separated; first origin is used for Stripe redirects |
| `PORT` | API port; defaults to `5000` |
| `STRIPE_SECRET_KEY` | Server-only Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `PREMIUM_PRICE_CENTS` | Monthly Premium amount in cents; defaults to `999` |

For local Stripe webhook testing, forward `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`, and `customer.subscription.deleted` events to `/webhook/stripe` using the Stripe CLI. Keep the signing secret in the server environment only.

## API and security notes

- Browser API calls to `/api/...` are forwarded by `src/app/api/backend/[...path]/route.ts` to the configured Express API. The frontend attaches the Better Auth JWT; Express verifies it against the Better Auth JWKS endpoint and loads the user from MongoDB.
- Express applies role checks and resource ownership checks to private routes. Customer, vendor, and admin permissions are enforced on the server as well as in the UI.
- Menu search uses `search`, `category`, `location`, `sort`, `page`, and `limit` query parameters. `sort` supports `newest`, `price_asc`, and `price_desc`.
- Only approved menu items are returned by public browse/featured endpoints. Vendors can edit only their own items and orders.
- Never activate Premium from a browser redirect. Only validated Stripe webhook events change the subscription and create paid transaction records.
- Create an admin using `npm run make-admin -- <email>` in the server project after that account exists. Public registration cannot create admins.

## Project and submission links

- Live site: not deployed yet
- Client repository: not published yet
- Server repository: not published yet

Add the final deployment and repository URLs here before submission. Maintain separate client and server repositories as required by the project brief.

## Submission checklist

- Provide working live site and separate public client/server repository links.
- Add a working admin email and password through the submission channel; do not store the password in this repository.
- Verify production OAuth callback URLs, CORS origins, database access, ImgBB uploads, and Stripe webhook delivery.
- Build meaningful client and server commit history during development; do not create placeholder commits just to inflate the count.
