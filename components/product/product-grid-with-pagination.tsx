"use client";

import Link from "next/link";
import { ProductGrid } from "@/components/product/product-grid";
import type { Product } from "@/lib/shopify/types";

type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
};

type ProductGridWithPaginationProps = {
  products: Product[];
  pageInfo: PageInfo;
  previousPageUrl?: string;
  nextPageUrl?: string;
};

export function ProductGridWithPagination({ products, pageInfo, previousPageUrl, nextPageUrl }: ProductGridWithPaginationProps) {
  return (
    <>
      <ProductGrid products={products} />

      {(pageInfo.hasPreviousPage || pageInfo.hasNextPage) && (
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          {pageInfo.hasPreviousPage && previousPageUrl ? (
            <Link
              href={previousPageUrl}
              className="inline-flex items-center justify-center rounded-full border border-[var(--gold)] bg-transparent px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gold-light)] transition hover:bg-[rgba(201,150,43,0.12)]"
            >
              Previous
            </Link>
          ) : null}
          {pageInfo.hasNextPage && nextPageUrl ? (
            <Link
              href={nextPageUrl}
              className="inline-flex items-center justify-center rounded-full bg-[var(--gold)] px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--obsidian)] transition hover:bg-[var(--gold-light)]"
            >
              Next
            </Link>
          ) : null}
        </div>
      )}
    </>
  );
}
