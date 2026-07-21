"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import type { Product } from "@/lib/shopify/types";

type ProductGridWithPaginationProps = {
  products: Product[];
  currentPage: number;
  pages: Array<{ page: number; href: string }>;
  previousPageUrl?: string;
  nextPageUrl?: string;
};

export function ProductGridWithPagination({ products, currentPage, pages, previousPageUrl, nextPageUrl }: ProductGridWithPaginationProps) {
  return (
    <>
      <ProductGrid products={products} />

      {pages.length > 1 && (
        <nav aria-label="Product pages" className="mt-14 flex flex-wrap items-center justify-center gap-2 border-t border-[var(--line-soft)] pt-8">
          {previousPageUrl ? (
            <Link
              href={previousPageUrl}
              className="inline-flex h-11 items-center justify-center gap-2 border border-[var(--line-soft)] px-4 text-xs font-medium uppercase tracking-[0.12em] text-[var(--mist)] transition hover:border-[var(--gold)] hover:text-[var(--gold-light)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </Link>
          ) : null}

          {pages.map((item) => {
            const isCurrent = item.page === currentPage;
            return (
              <Link
                key={item.page}
                href={item.href}
                aria-current={isCurrent ? "page" : undefined}
                aria-label={`Page ${item.page}`}
                className={`inline-flex h-11 min-w-11 items-center justify-center border px-3 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)] ${isCurrent ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--obsidian)]" : "border-[var(--line-soft)] text-[var(--mist)] hover:border-[var(--gold)] hover:text-[var(--gold-light)]"}`}
              >
                {item.page}
              </Link>
            );
          })}

          {nextPageUrl ? (
            <Link
              href={nextPageUrl}
              className="inline-flex h-11 items-center justify-center gap-2 border border-[var(--line-soft)] px-4 text-xs font-medium uppercase tracking-[0.12em] text-[var(--mist)] transition hover:border-[var(--gold)] hover:text-[var(--gold-light)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
            >
              Next <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </nav>
      )}
    </>
  );
}
