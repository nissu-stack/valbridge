# Launch Checklist

## Shopify Admin setup
- Shipping zones are configured for each target market.
- Tax settings are correct for the target markets and storefront.
- Payment gateway is live and not in test mode.
- Refund policy, terms of service, and privacy policy are published and linked in Shopify checkout settings.

## Storefront QA
- Full add-to-cart → checkout → order confirmation flow has been tested end to end.
- A real discount code was tested successfully.
- An out-of-stock variant was tested and surfaces the correct unavailable state.
- Cart persists correctly across a page refresh using the cookie-backed cart ID.
- Deleted or invalid product and collection handles return the expected 404 behavior.

## SEO
- sitemap.xml is reachable and valid.
- Canonical URLs point to the custom domain rather than myshopify.com.
- JSON-LD validates in Google’s Rich Results Test.
- Meta titles and descriptions render correctly on key pages.

## Analytics
- GA4 and Meta Pixel fire on product view, add-to-cart, and page view events.
- Checkout-page conversion tracking is configured separately through Shopify’s own checkout pixel setup.

## Webhooks
- Each registered webhook shows recent successful deliveries in Shopify Admin.
- Webhooks are tested with a live product, inventory, or collection update.

## Legal and company information
- Imprint contains the registered legal entity, address, registration/VAT details, representative, and contact information.
- Terms, privacy, shipping, and refund pages have been approved for every target market.
- Cookie consent and analytics behavior have been reviewed against applicable privacy requirements.

## Engineering quality
- `npm run check` passes in CI.
- `npm run build` passes using production-equivalent environment variables.
- Dependency and secret scans have no unaccepted high or critical findings.
- Mobile navigation, dialogs, keyboard focus, reduced motion, and color contrast have been manually verified.

## Performance
- Lighthouse/PageSpeed Insights was run against a live product and collection page.
- No console errors appear in the production build.
