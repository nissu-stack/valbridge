import "server-only";

import { cache } from "react";
import { shopifyClient } from "@/lib/shopify/client";
import { COLLECTION_QUERY, PRODUCT_QUERY, SHOP_PRODUCTS_QUERY } from "@/lib/shopify/queries";
import type { CollectionQueryData, Product, ProductQueryData } from "@/lib/shopify/types";

type ShopProductsQueryData = {
  products: {
    nodes: Product[];
  };
};

export const getProductByHandle = cache(async (handle: string) => {
  const data = await shopifyClient.request<ProductQueryData>(PRODUCT_QUERY, { handle });
  return data.product;
});

export const getRelatedProducts = cache(async (collectionHandle: string | undefined, currentHandle: string, limit = 4) => {
  const products: Product[] = [];
  const seenHandles = new Set([currentHandle]);

  const addProducts = (candidates: Product[]) => {
    for (const candidate of candidates) {
      if (seenHandles.has(candidate.handle)) continue;
      seenHandles.add(candidate.handle);
      products.push(candidate);
      if (products.length === limit) break;
    }
  };

  if (collectionHandle) {
    try {
      const collectionData = await shopifyClient.request<CollectionQueryData>(COLLECTION_QUERY, {
        handle: collectionHandle,
        first: limit + 4,
        sortKey: "BEST_SELLING",
        reverse: false,
      });
      addProducts(collectionData.collection?.products.edges.map((edge) => edge.node) ?? []);
    } catch {
      // Related products are supplementary; fall back to the broader catalogue.
    }
  }

  if (products.length < limit) {
    try {
      const allProductsData = await shopifyClient.request<ShopProductsQueryData>(SHOP_PRODUCTS_QUERY, {
        first: limit + 5,
        sortKey: "BEST_SELLING",
        reverse: false,
      });
      addProducts(allProductsData.products.nodes);
    } catch {
      // Keep any collection matches already found instead of failing the product page.
    }
  }

  return products.slice(0, limit);
});
