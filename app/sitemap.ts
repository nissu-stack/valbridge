import type { MetadataRoute } from "next";
import { shopifyClient } from "@/lib/shopify/client";
import { ALL_PRODUCT_HANDLES_QUERY } from "@/lib/shopify/queries";
import { SITE_URL } from "@/lib/config/site";

type ProductHandlesData = {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor?: string | null };
    nodes: Array<{ handle: string; updatedAt: string }>;
  };
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products: ProductHandlesData["products"]["nodes"] = [];
  let after: string | undefined;

  do {
    const data = await shopifyClient.request<ProductHandlesData>(ALL_PRODUCT_HANDLES_QUERY, { first: 250, after });
    products.push(...data.products.nodes);
    after = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor ?? undefined : undefined;
  } while (after);

  const productEntries = products.map((product) => ({
    url: `${SITE_URL}/products/${product.handle}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...["/about", "/wholesale", "/legal/imprint", "/legal/terms", "/legal/privacy", "/legal/shipping", "/legal/refunds"].map((path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: "monthly" as const,
      priority: path.startsWith("/legal/") ? 0.3 : 0.6,
    })),
    ...productEntries,
  ];
}
