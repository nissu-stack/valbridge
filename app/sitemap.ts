import type { MetadataRoute } from "next";
import { shopifyClient } from "@/lib/shopify/client";
import { ALL_COLLECTION_HANDLES_QUERY, ALL_PRODUCT_HANDLES_QUERY } from "@/lib/shopify/queries";

type ProductHandlesData = {
  products: {
    nodes: Array<{ handle: string; updatedAt: string }>;
  };
};

type CollectionHandlesData = {
  collections: {
    nodes: Array<{ handle: string; updatedAt: string }>;
  };
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = `https://${process.env.SHOPIFY_STORE_DOMAIN}`;

  const [productsData, collectionsData] = await Promise.all([
    shopifyClient.request<ProductHandlesData>(ALL_PRODUCT_HANDLES_QUERY, { first: 250 }),
    shopifyClient.request<CollectionHandlesData>(ALL_COLLECTION_HANDLES_QUERY),
  ]);

  const productEntries = productsData.products.nodes.map((product) => ({
    url: `${baseUrl}/products/${product.handle}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const collectionEntries = collectionsData.collections.nodes.map((collection) => ({
    url: `${baseUrl}/collections/${collection.handle}`,
    lastModified: new Date(collection.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...productEntries,
    ...collectionEntries,
  ];
}
