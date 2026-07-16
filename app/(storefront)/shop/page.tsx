import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product/product-grid";
import { shopifyClient } from "@/lib/shopify/client";
import { ALL_COLLECTIONS_QUERY, COLLECTION_QUERY, HOMEPAGE_PRODUCTS_QUERY } from "@/lib/shopify/queries";
import { searchProducts } from "@/lib/shopify/search";
import type { CollectionQueryData, Product } from "@/lib/shopify/types";

const siteName = process.env.SITE_NAME ?? "Maison Valbridge";

type ShopPageProductsQueryData = {
  products: {
    nodes: Product[];
  };
};

type ShopPageCollectionsQueryData = {
  collections: {
    nodes: Array<{ handle: string; title: string }>;
  };
};

type RangeOption = {
  label: string;
  value: string;
  query: string;
  collectionHandles?: readonly string[];
};

const rangeOptions: RangeOption[] = [
  { label: "All products", value: "", query: "" },
  { label: "Fresh truffles", value: "frische-truffel", query: "fresh truffles", collectionHandles: ["frische-truffel", "fresh-truffles"] },
  { label: "Plant-based", value: "plant-based", query: "plant based", collectionHandles: ["plant-based"] },
  { label: "Premium olive oil", value: "premium-olive-oil", query: "premium olive oil", collectionHandles: ["premium-olive-oil"] },
  { label: "Saffron", value: "safran", query: "saffron", collectionHandles: ["safran", "saffron"] },
  { label: "Truffle products", value: "truffelprodukte", query: "truffle products", collectionHandles: ["truffelprodukte", "truffle-products"] },
];

const sortOptions = [
  { label: "Relevance", value: "", href: (category: string) => (category ? `/shop?category=${encodeURIComponent(category)}` : "/shop") },
  { label: "Trending", value: "trending-desc", href: (category: string) => (category ? `/shop?category=${encodeURIComponent(category)}&sort=trending-desc` : "/shop?sort=trending-desc") },
  { label: "Latest Arrivals", value: "latest-desc", href: (category: string) => (category ? `/shop?category=${encodeURIComponent(category)}&sort=latest-desc` : "/shop?sort=latest-desc") },
  { label: "Price: Low to High", value: "price-asc", href: (category: string) => (category ? `/shop?category=${encodeURIComponent(category)}&sort=price-asc` : "/shop?sort=price-asc") },
  { label: "Price: High to Low", value: "price-desc", href: (category: string) => (category ? `/shop?category=${encodeURIComponent(category)}&sort=price-desc` : "/shop?sort=price-desc") },
] as const;

function sortProducts(products: Product[], sort?: string) {
  const sorted = [...products];

  if (sort === "price-asc") {
    return sorted.sort((a, b) => Number(a.priceRange.minVariantPrice.amount) - Number(b.priceRange.minVariantPrice.amount));
  }

  if (sort === "price-desc") {
    return sorted.sort((a, b) => Number(b.priceRange.minVariantPrice.amount) - Number(a.priceRange.minVariantPrice.amount));
  }

  return sorted;
}

export const metadata: Metadata = {
  title: `Shop · ${siteName}`,
  description: "Browse the Maison Valbridge edit with timeless objects for a refined home.",
};

export default async function ShopPage({ searchParams }: { searchParams?: Promise<{ category?: string; sort?: string }> }) {
  const params = (await searchParams) ?? {};
  const activeCategory = params.category?.trim();
  const sort = params.sort?.trim();

  const [collectionsData, defaultProductsData] = await Promise.all([
    shopifyClient.request<ShopPageCollectionsQueryData>(ALL_COLLECTIONS_QUERY, { first: 50 }),
    shopifyClient.request<ShopPageProductsQueryData>(HOMEPAGE_PRODUCTS_QUERY, { first: 24 }),
  ]);

  const collections = collectionsData.collections.nodes;
  const activeRange = rangeOptions.find((option) => option.value === activeCategory) ?? rangeOptions[0];
  const collectionHandles = activeRange.collectionHandles ?? [];
  const activeCollection = collections.find((collection) => {
    if (!activeCategory) {
      return false;
    }

    return collection.handle === activeCategory || collectionHandles.includes(collection.handle);
  });

  let products: Product[] = defaultProductsData.products.nodes;
  let selectedTitle = "All products";

  if (activeCollection) {
    const collectionProductsData = await shopifyClient.request<CollectionQueryData>(COLLECTION_QUERY, {
      handle: activeCollection.handle,
      first: 24,
      after: undefined,
      sortKey: sort === "price-desc" ? "PRICE" : sort === "title" ? "TITLE" : "BEST_SELLING",
      reverse: sort === "price-asc" || sort === "price-desc" ? sort === "price-desc" : undefined,
    });

    products = collectionProductsData?.collection?.products.edges.map((edge) => edge.node) ?? [];
    selectedTitle = activeCollection.title;
  } else if (activeCategory) {
    const query = activeRange.query || activeCategory;
    const searchResults = await searchProducts(query);
    products = sortProducts(searchResults, sort);
    selectedTitle = activeRange.label;
  } else {
    products = sortProducts(defaultProductsData.products.nodes, sort);
    selectedTitle = "All products";
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="sticky top-8 self-start rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[0_24px_80px_-30px_rgba(0,0,0,0.45)]">
          <div className="space-y-7">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--gold-l)]">Range</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--mut)]">Choose a range to narrow the catalog instantly.</p>
            </div>

            <div className="rounded-[1.75rem] border border-[rgba(201,150,43,0.16)] bg-[rgba(255,255,255,0.04)] p-4">
              <p className="text-sm font-semibold text-[var(--ink)]">Range</p>
              <div className="mt-4 space-y-2">
                {rangeOptions.map((option) => {
                  const isActive = option.value === activeCategory;
                  return (
                    <Link
                      key={option.value || "all-products"}
                      href={option.value ? `/shop?category=${option.value}` : "/shop"}
                      className={`flex items-center justify-between rounded-[1.5rem] border px-4 py-3 text-sm font-medium transition ${isActive ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold-l)]" : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[var(--ink)] hover:border-[var(--gold)] hover:bg-[rgba(201,150,43,0.08)]"}`}
                    >
                      <span>{option.label}</span>
                      <span className="text-xs text-[var(--mut)]">›</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-[rgba(201,150,43,0.16)] bg-[rgba(255,255,255,0.04)] p-4">
              <div className="flex items-center justify-between text-sm font-medium text-[var(--ink)]">
                <span>Sort by</span>
              </div>
              <div className="mt-4 space-y-3">
                {sortOptions.map((option) => {
                  const isActive = option.value === sort || (!option.value && !sort);
                  return (
                    <Link
                      key={option.label}
                      href={option.href(activeCategory ?? "")}
                      className={`block rounded-full border px-4 py-2 text-sm transition ${isActive ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold-l)]" : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[var(--ink)] hover:border-[var(--gold)] hover:bg-[rgba(201,150,43,0.08)]"}`}
                    >
                      {option.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[0_18px_60px_-35px_rgba(0,0,0,0.55)] sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--gold-l)]">{selectedTitle}</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">{activeCategory ? `Range: ${selectedTitle}` : "Our full collection"}</h1>
              </div>
              <div className="text-sm text-[var(--mut)]">{products.length} items</div>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--mut)]">
              {activeCategory
                ? `Products for ${selectedTitle}. Use the filters to refine the selection.`
                : "Discover the full catalog with refined seasonal staples and signature pantry pieces."}
            </p>
          </div>

          <ProductGrid products={products} />
        </section>
      </div>
    </main>
  );
}
