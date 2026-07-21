import Link from "next/link";
import { ProductGrid } from "@/components/product/product-grid";
import type { Product } from "@/lib/shopify/types";

type HomeProductShowcaseProps = {
  products: Product[];
};

export function HomeProductShowcase({ products }: HomeProductShowcaseProps) {
  return (
    <section className="px-4 py-[clamp(70px,9vw,120px)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-[clamp(38px,6vw,64px)] text-center">
          <span className="eyebrow">Kollektion 2026</span>
          <h2 className="section-title">Unsere Produkte</h2>
          <p className="section-lead mx-auto">
            Direkt aus den besten Trüffelregionen und Safranfeldern der Welt ausgewählt.
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

        <ProductGrid products={products.slice(0, 12)} />

        <div className="mt-12 flex justify-center">
          <Link
            href="/shop"
            className="site-button site-button--primary"
          >
            Weitere Produkte ansehen
          </Link>
        </div>
      </div>
    </section>
  );
}
