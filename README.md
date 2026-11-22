# PizzaHub

PizzaHub is a full-stack pizza ordering platform for customers, restaurants, and administrators. Customers can discover local menus, save favorites, and place orders. Vendors manage their restaurant menus and orders, while admins review listings and oversee the platform.

**Live app:** [pizzahub-client-alpha-wine.vercel.app](https://pizzahub-client-alpha-wine.vercel.app/)

## Features

- Email/password and Google authentication with Better Auth.
- Customer and vendor registration, with role-based dashboards and access controls.
- Menu discovery with search, category and location filters, pagination, and price or newest sorting.
- Menu item details, customer favorites, order placement, order status tracking, and pending-order cancellation.
- Vendor tools for menu management, availability, customer orders, and Free/Premium plan status.
- Admin tools for users, menu review, transactions, and platform charts.
- Stripe subscription checkout. Verified Stripe webhooks control Premium activation and expiration.
- ImgBB-hosted menu item uploads and optional profile photos.
- Responsive interface with loading, empty, and error states.

## Technology

| Area | Stack |
| --- | --- |
| Client | Next.js App Router 16, React 19, TypeScript, Tailwind CSS 4 |
| UI | ShadCN-style components, Motion, Recharts, Lucide |
| Authentication | Better Auth with email/password, Google OAuth, and JWT |
| Data | MongoDB |
| API server | Express 5, MongoDB driver, `jose` JWT/JWKS verification |
| Payments | Stripe |
| Image uploads | ImgBB |

## Run locally

### Requirements

- Node.js and npm
- MongoDB connection string
- The PizzaHub Express server project, expected beside this repository at `../pizzahub(server)`
- Optional integrations: Google OAuth, ImgBB, and Stripe

### Install and start

1. Configure the client and server environment variables below.
2. In this repository, install dependencies and start Next.js:

   ```bash
   npm install
   npm run dev
   ```

3. In another terminal, start the Express server:

   ```bash
   cd "../pizzahub(server)"
   npm install
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000). The API server listens on port `5000` by default.

The client forwards browser requests from `/api/...` to the Express API through a same-origin Next.js route handler.

## Environment variables

Create a private `.env` file in each project. Do not commit real credentials, secrets, or production connection strings. Set the production equivalents in the deployment platform's environment settings.

### Client `.env`

| Variable | Purpose | Local value or note |
| --- | --- | --- |
| `MONGODB_URI` | MongoDB connection used by Better Auth and the demo menu seed script | Your MongoDB connection string |
| `MONGODB_DB` | Better Auth database name | Optional; defaults to `pizzahub` |
| `BETTER_AUTH_SECRET` | Better Auth signing secret | Use a long, random secret |
| `BETTER_AUTH_URL` | Public base URL for Better Auth | `http://localhost:3000` locally |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Required for Google sign-in |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Required for Google sign-in |
| `NEXT_PUBLIC_API_URL` | Express API base URL, including `/api` | `http://localhost:5000/api` |
| `IMGBB_API_KEY` | Image upload API key | Required for ImgBB uploads |

### Express server `.env`

| Variable | Purpose | Local value or note |
| --- | --- | --- |
| `MONGODB_URI` | MongoDB connection used by the business API | Your MongoDB connection string |
| `DB_NAME` | Business data database name | Optional; defaults to `pizzahub` |
| `AUTH_URL` | Better Auth/JWKS URL used to verify client tokens | `http://localhost:3000` locally |
| `CLIENT_URL` | Allowed client origins; separate multiple origins with commas | Include `http://localhost:3000` locally; first origin is used for Stripe redirects |
| `PORT` | Express listening port | Optional; defaults to `5000` |
| `STRIPE_SECRET_KEY` | Stripe server secret | Keep server-side only |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature secret | Keep server-side only |
| `PREMIUM_PRICE_CENTS` | Monthly Premium price in cents | Optional; defaults to `999` |

For Google OAuth, add the deployed sign-in callback URL to the Google OAuth client configuration. For production, set `BETTER_AUTH_URL`, `AUTH_URL`, and `CLIENT_URL` to the correct deployed origins.

## Admin account setup

There is no default admin login, and public registration cannot assign the admin role.

1. Create an account through the app using the email address that should become the admin account.
2. From the Express server project, run the server's admin assignment command:

   ```bash
   npm run make-admin -- <email>
   ```

3. Sign in with that email and the password chosen during account creation.

Share working admin credentials only through the private submission channel required by the project. Never put the password in this README, source control, or a public issue.

## Demo menu data

The client includes a demo menu seeding script. It finds the most recently created active vendor account and reports how many sample items could be added without exceeding the vendor's plan limit.

From this repository, preview first:

```bash
node scripts/seed-demo-menu.mjs
```

To insert the sample items into the database configured by the client `MONGODB_URI`, run:

```bash
node scripts/seed-demo-menu.mjs --apply
```

Review the selected vendor and database before using `--apply`. The script inserts approved sample menu items.

## Stripe webhooks

For local webhook testing, use the Stripe CLI to forward these events to the Express server's `/webhook/stripe` endpoint:

- `checkout.session.completed`
- `invoice.paid`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Premium status is updated only by validated webhook events. Do not activate subscriptions based on a browser redirect.

## Security and API behavior

- Browser API calls to `/api/...` pass through `src/app/api/backend/[...path]/route.ts` and are forwarded to the configured Express API.
- The client attaches a Better Auth JWT. Express verifies the token against Better Auth's JWKS endpoint and loads the user from MongoDB.
- Role checks and resource ownership checks are enforced by the API as well as by the dashboard UI.
- Public menu and featured endpoints return approved items only. Vendors can manage only their own items and orders.
- Menu search accepts `search`, `category`, `location`, `sort`, `page`, and `limit`. Supported sort values are `newest`, `price_asc`, and `price_desc`.

## Project links

- Live app: [PizzaHub](https://pizzahub-client-alpha-wine.vercel.app/)
- Client repository: [Pizzahub-Client-](https://github.com/DibajitRoy/Pizzahub-Client-)
- Server repository: [Pizzahub-Server-](https://github.com/DibajitRoy/Pizzahub-Server-)



