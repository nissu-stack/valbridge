import { GraphQLClient } from "graphql-request";

const shopDomain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const storefrontApiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION;

if (!shopDomain || !storefrontAccessToken || !storefrontApiVersion) {
  throw new Error("Missing required Shopify environment variables.");
}

const endpoint = `https://${shopDomain}/api/${storefrontApiVersion}/graphql.json`;

export const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
  },
});
