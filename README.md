# Valbridge Storefront

Headless Shopify storefront for Maison Valbridge, built with Next.js 16, React 19, TypeScript, Tailwind CSS, and Shopify's Storefront GraphQL API.

## Requirements

- Node.js 20.19 or newer
- npm
- A Shopify store with Storefront API access

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Replace every placeholder with the appropriate local or Shopify value.
3. Install dependencies with `npm install`.
4. Start the app with `npm run dev`.

Never commit `.env.local` or expose Storefront/webhook credentials in client-side variables.

## Commands

- `npm run dev` — start local development.
- `npm run typecheck` — run strict TypeScript validation.
- `npm run lint` — run Next.js ESLint rules.
- `npm run test` — run unit tests once.
- `npm run test:watch` — run unit tests in watch mode.
- `npm run test:e2e` — run Playwright storefront and accessibility checks.
- `npm run check` — typecheck, lint, and test.
- `npm run build` — create a production build.
- `npm start` — run the production build.

## Architecture

- `app/` contains App Router pages, metadata routes, APIs, and cart Server Actions.
- `components/` contains layout, product, content, and reusable UI components.
- `lib/shopify/` contains the Storefront client, GraphQL documents, data helpers, types, cart access, and webhook validation.
- `lib/cart/` contains the client cart/drawer store.
- Shopify cart IDs are stored in a secure, HTTP-only, same-site cookie.
- The header fetches the private cart through `/api/cart`, keeping cookie access out of the root layout render path.
- Shopify webhook deliveries invalidate affected catalog routes through `/api/webhooks`.

## Shopify webhooks

Register `/api/webhooks` for these topics:

- `products/create`
- `products/update`
- `products/delete`
- `inventory_levels/update`
- `collections/create`
- `collections/update`
- `collections/delete`

Use the same signing secret in Shopify and `SHOPIFY_WEBHOOK_SECRET`. Test valid, invalid, and malformed deliveries before launch.

## Deployment

Configure every variable from `.env.example` in the hosting environment. `SITE_URL` must be the public custom domain, not the `myshopify.com` API domain. CI additionally requires Shopify secrets and a `SITE_URL` repository variable so the production build can query catalog data.

Before release, run:

```bash
npm ci
npm run check
npm run build
```

Then complete `LAUNCH_CHECKLIST.md`, including a real low-value checkout and refund.

## External approvals still required

- Replace the marked legal-page placeholders with counsel-approved company, privacy, terms, and refund text.
- Confirm shipping, customs, taxes, payment methods, and returns in every target market.
- Configure an email or CRM workflow if a structured wholesale form is preferred over email links.
- Add analytics/error-monitoring credentials only after the tracking and consent requirements are approved.
