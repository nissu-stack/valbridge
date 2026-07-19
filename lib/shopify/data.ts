import "server-only";

import { cache } from "react";
import { shopifyClient } from "@/lib/shopify/client";
import { PRODUCT_QUERY } from "@/lib/shopify/queries";
import type { ProductQueryData } from "@/lib/shopify/types";

export const getProductByHandle = cache(async (handle: string) => {
  const data = await shopifyClient.request<ProductQueryData>(PRODUCT_QUERY, { handle });
  return data.product;
});
