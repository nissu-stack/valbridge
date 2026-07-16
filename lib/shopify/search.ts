import { shopifyClient } from "@/lib/shopify/client";
import { SEARCH_QUERY } from "@/lib/shopify/queries";
import type { Product } from "@/lib/shopify/types";

type SearchProductsResponse = {
  search: {
    nodes: Array<{ __typename?: string } | Product>;
  };
};

export async function searchProducts(query: string) {
  if (!query.trim()) {
    return [] as Product[];
  }

  const data = await shopifyClient.request<SearchProductsResponse>(SEARCH_QUERY, {
    query,
  });

  return data.search.nodes.filter((item): item is Product => {
    return typeof item === "object" && item !== null && "handle" in item && "title" in item;
  });
}
