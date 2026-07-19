import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { ProductGridWithPagination } from "@/components/product/product-grid-with-pagination";
import { ShopSortSelect } from "@/components/product/shop-sort-select";
import { shopifyClient } from "@/lib/shopify/client";
import { ALL_COLLECTIONS_QUERY, COLLECTION_QUERY, SHOP_PRODUCTS_QUERY } from "@/lib/shopify/queries";
import { searchProducts } from "@/lib/shopify/search";
import type { CollectionQueryData, Product } from "@/lib/shopify/types";

const siteName = process.env.SITE_NAME ?? "Maison Valbridge";

type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
};

type ShopPageProductsQueryData = {
  products: {
    pageInfo: PageInfo;
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

function getProductSortArgs(sort?: string) {
  if (sort === "price-asc") {
    return { sortKey: "PRICE", reverse: false } as const;
  }

  if (sort === "price-desc") {
    return { sortKey: "PRICE", reverse: true } as const;
  }

  if (sort === "title") {
    return { sortKey: "TITLE", reverse: false } as const;
  }

  if (sort === "latest-desc") {
    return { sortKey: "CREATED_AT", reverse: true } as const;
  }

  return { sortKey: "BEST_SELLING", reverse: false } as const;
}

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

export default async function ShopPage({ searchParams }: { searchParams?: Promise<{ category?: string; sort?: string; after?: string; before?: string }> }) {
  const params = (await searchParams) ?? {};
  const activeCategory = params.category?.trim();
  const sort = params.sort?.trim();
  const after = params.after?.trim();
  const before = params.before?.trim();

  const pageSize = 24;
  const sortArgs = getProductSortArgs(sort);

  const [collectionsData, defaultProductsData] = await Promise.all([
    shopifyClient.request<ShopPageCollectionsQueryData>(ALL_COLLECTIONS_QUERY, { first: 50 }),
    shopifyClient.request<ShopPageProductsQueryData>(SHOP_PRODUCTS_QUERY, {
      first: before ? undefined : pageSize,
      after: before ? undefined : after,
      before: before ?? undefined,
      last: before ? pageSize : undefined,
      sortKey: sortArgs.sortKey,
      reverse: sortArgs.reverse,
    }),
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
  let pageInfo: PageInfo = defaultProductsData.products.pageInfo;

  if (activeCollection) {
    const collectionProductsData = await shopifyClient.request<CollectionQueryData>(COLLECTION_QUERY, {
      handle: activeCollection.handle,
      first: before ? undefined : pageSize,
      after: before ? undefined : after,
      before: before ?? undefined,
      last: before ? pageSize : undefined,
      sortKey: sort === "price-asc" || sort === "price-desc" ? "PRICE" : sort === "latest-desc" ? "CREATED" : "BEST_SELLING",
      reverse: sort === "price-desc" || sort === "latest-desc",
    });

    products = collectionProductsData?.collection?.products.edges.map((edge) => edge.node) ?? [];
    pageInfo = collectionProductsData?.collection?.products.pageInfo ?? pageInfo;
    selectedTitle = activeCollection.title;
  } else if (activeCategory) {
    const query = activeRange.query || activeCategory;
    const searchResults = await searchProducts(query);
    products = sortProducts(searchResults, sort);
    selectedTitle = activeRange.label;
    pageInfo = { hasNextPage: false, hasPreviousPage: false };
  }

  const buildPageUrl = (cursorKey: "after" | "before", cursor: string) => {
    const query = new URLSearchParams();

    if (activeCategory) {
      query.set("category", activeCategory);
    }

    if (sort) {
      query.set("sort", sort);
    }

    query.set(cursorKey, cursor);
    return `/shop?${query.toString()}`;
  };

  return (
    <main id="main-content" className="mx-auto min-h-screen max-w-7xl px-4 pt-24 pb-8 sm:px-6 lg:px-8 lg:pt-28 lg:pb-12">
      <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="sticky top-8 self-start rounded-[2rem] bg-[var(--panel)] p-6 shadow-[0_26px_80px_-34px_rgba(0,0,0,0.5)]">
          <div className="space-y-8">
            <div className="rounded-[1.75rem] bg-[var(--bg)] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-light)]">Search the collection</p>
              <p className="mt-2 text-sm leading-6 text-[var(--mut)]">Search products by name, ingredient, or range.</p>
              <form action="/search" method="get" className="mt-4">
                <label htmlFor="q" className="sr-only">Search products</label>
                <div className="flex items-center gap-3 rounded-full border border-[rgba(255,255,255,0.08)] bg-[var(--panel)] px-4 py-3 transition focus-within:border-[var(--gold)] focus-within:ring-1 focus-within:ring-[rgba(201,150,43,0.14)]">
                  <input
                    id="q"
                    name="q"
                    type="search"
                    placeholder="Search Maison Valbridge"
                    className="w-full min-w-0 bg-transparent text-sm text-[var(--cream)] placeholder:text-[var(--mut)] outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--gold)] text-[var(--obsidian)] transition hover:bg-[var(--gold-light)]"
                    aria-label="Search"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>

            <div className="rounded-[1.75rem] bg-[var(--bg)] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-light)]">Collections</p>
              <div className="mt-4 space-y-2">
                {rangeOptions.map((option) => {
                  const isActive = option.value === activeCategory;
                  return (
                    <Link
                      key={option.value || "all-products"}
                      href={option.value ? `/shop?category=${option.value}` : "/shop"}
                      className={`block rounded-[1.5rem] px-4 py-3 text-sm font-medium transition ${isActive ? "bg-[var(--gold)]/12 text-[var(--gold-light)] shadow-sm" : "bg-[var(--panel)] text-[var(--cream)] hover:bg-[rgba(201,150,43,0.08)]"}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span>{option.label}</span>
                        <span className="text-xs text-[var(--mut)]">›</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>
        </aside>

        <section className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--gold-light)]">Maison Valbridge collection</p>
            <h1 className="mt-2 font-display text-3xl uppercase tracking-[0.12em] text-[var(--gold-pale)]">{selectedTitle}</h1>
            <p className="mt-2 text-sm text-[var(--mut)]">{products.length} product{products.length === 1 ? "" : "s"} on this page</p>
          </div>
          <div className="rounded-[1.75rem] bg-[var(--panel)] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--gold-light)]">Sort</p>
                <p className="mt-2 text-sm text-[var(--mut)]">View by</p>
              </div>
              <ShopSortSelect value={sort} />
            </div>
          </div>

          <ProductGridWithPagination products={products} pageInfo={pageInfo} previousPageUrl={pageInfo.hasPreviousPage ? buildPageUrl("before", pageInfo.startCursor ?? "") : undefined} nextPageUrl={pageInfo.hasNextPage ? buildPageUrl("after", pageInfo.endCursor ?? "") : undefined} />
        </section>
      </div>
    </main>
  );
}
