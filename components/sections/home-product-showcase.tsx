"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/product/product-grid";
import { HOME_PRODUCT_FILTERS } from "@/lib/content/home";
import type { Product } from "@/lib/shopify/types";

type HomeProductShowcaseProps = {
  products: Product[];
};

export function HomeProductShowcase({ products }: HomeProductShowcaseProps) {
  const [activeFilter, setActiveFilter] = useState(HOME_PRODUCT_FILTERS[0]);

  const filteredProducts = useMemo(() => {
    if (activeFilter.label === "All") {
      return products;
    }

    return products.filter((product) =>
      product.collections?.nodes.some((collection) => activeFilter.collectionHandles.includes(collection.handle)),
    );
  }, [activeFilter, products]);

  return (
    <section className="px-4 py-[clamp(70px,9vw,120px)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-[clamp(38px,6vw,64px)] text-center">
          <span className="eyebrow">Collection 2026</span>
          <h2 className="section-title">Our products</h2>
          <p className="section-lead mx-auto">
            Selected directly from the finest truffle regions and saffron fields of the world.
          </p>
          <div className="bridge-rule justify-center">
            <svg width="46" height="16" viewBox="0 0 46 16" fill="none" aria-hidden="true">
              <path d="M2 13 Q23 -6 44 13" stroke="#C9962B" strokeWidth="1.4" />
              <line x1="13" y1="7" x2="13" y2="13" stroke="#C9962B" />
              <line x1="23" y1="4.5" x2="23" y2="13" stroke="#C9962B" />
              <line x1="33" y1="7" x2="33" y2="13" stroke="#C9962B" />
            </svg>
          </div>
        </div>

        <div className="mb-11 flex flex-wrap justify-center gap-2.5">
          {HOME_PRODUCT_FILTERS.map((filter) => {
            const isActive = filter.label === activeFilter.label;
            return (
              <button
                key={filter.label}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`inline-flex items-center justify-center rounded-full border px-6 py-3 text-[0.72rem] uppercase tracking-[0.24em] transition duration-300 ${
                  isActive
                    ? "border-[var(--gold)] bg-[rgba(201,150,43,0.12)] text-[var(--gold-light)]"
                    : "border-[var(--line-soft)] bg-[rgba(255,255,255,0.03)] text-[var(--mist)] hover:border-[var(--gold)] hover:text-[var(--gold-light)]"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <ProductGrid products={filteredProducts.slice(0, 12)} />

        <div className="mt-12 flex justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full border border-[var(--gold)] bg-[var(--gold)] px-8 py-3 text-[0.82rem] font-semibold uppercase tracking-[0.26em] text-[var(--obsidian)] shadow-[0_16px_40px_rgba(201,150,43,0.18)] transition duration-300 hover:scale-[1.01] hover:bg-[var(--gold-light)]"
          >
            View more products
          </Link>
        </div>
      </div>
    </section>
  );
}
