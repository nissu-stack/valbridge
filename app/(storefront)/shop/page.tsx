import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { ProductGridWithPagination } from "@/components/product/product-grid-with-pagination";
import { ShopCollectionSelect } from "@/components/product/shop-collection-select";
import { ShopSortSelect } from "@/components/product/shop-sort-select";
import { shopifyClient } from "@/lib/shopify/client";
import { ALL_COLLECTIONS_QUERY, COLLECTION_QUERY, SHOP_PRODUCTS_QUERY } from "@/lib/shopify/queries";
import { searchProducts } from "@/lib/shopify/search";
import type { CollectionQueryData, Product } from "@/lib/shopify/types";

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

const shopPromises = [
  { icon: Sparkles, title: "Kuratierte Qualität", copy: "Aussergewöhnliche Zutaten, sorgfältig ausgewählt." },
  { icon: Truck, title: "Sorgfältige Lieferung", copy: "Verpackt zum Schutz von Aroma und Frische." },
  { icon: ShieldCheck, title: "Sicherer Checkout", copy: "Einfach, geschützt und zuverlässig." },
] as const;

function getProductSortArgs(sort?: string) {
  if (sort === "price-asc") return { sortKey: "PRICE", reverse: false } as const;
  if (sort === "price-desc") return { sortKey: "PRICE", reverse: true } as const;
  if (sort === "title") return { sortKey: "TITLE", reverse: false } as const;
  if (sort === "latest-desc") return { sortKey: "CREATED_AT", reverse: true } as const;
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

  if (sort === "title") {
    return sorted.sort((a, b) => a.title.localeCompare(b.title));
  }

  return sorted;
}

export const metadata: Metadata = {
  title: "Shop",
  description: "Entdecken Sie Trüffel, Safran, Olivenöl und ausgewählte Feinkost von Maison Valbridge.",
};

export default async function ShopPage({ searchParams }: { searchParams?: Promise<{ category?: string; sort?: string; page?: string }> }) {
  const params = (await searchParams) ?? {};
  const activeCategory = params.category?.trim();
  const sort = params.sort?.trim();
  const requestedPage = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const pageSize = 24;
  const sortArgs = getProductSortArgs(sort);

  const [collectionsData, defaultProductsData] = await Promise.all([
    shopifyClient.request<ShopPageCollectionsQueryData>(ALL_COLLECTIONS_QUERY, { first: 250 }),
    shopifyClient.request<ShopPageProductsQueryData>(SHOP_PRODUCTS_QUERY, {
      first: 250,
      sortKey: sortArgs.sortKey,
      reverse: sortArgs.reverse,
    }),
  ]);

  const collections = [...collectionsData.collections.nodes].sort((a, b) => a.title.localeCompare(b.title));
  const customerCollections = collections.filter((collection) => !collection.handle.startsWith("hidden-") && !collection.title.toLowerCase().startsWith("hidden:"));
  const activeCollection = activeCategory
    ? collections.find((collection) => collection.handle === activeCategory)
    : undefined;

  let products: Product[] = defaultProductsData.products.nodes;
  let selectedTitle = "Alle Produkte";

  if (activeCollection) {
    const collectionProductsData = await shopifyClient.request<CollectionQueryData>(COLLECTION_QUERY, {
      handle: activeCollection.handle,
      first: 250,
      sortKey: sort === "price-asc" || sort === "price-desc" ? "PRICE" : sort === "latest-desc" ? "CREATED" : "BEST_SELLING",
      reverse: sort === "price-desc" || sort === "latest-desc",
    });

    products = collectionProductsData?.collection?.products.edges.map((edge) => edge.node) ?? [];
    selectedTitle = activeCollection.title;
  } else if (activeCategory) {
    products = sortProducts(await searchProducts(activeCategory), sort);
    selectedTitle = activeCategory.replaceAll("-", " ");
  }

  const totalProducts = products.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / pageSize));
  const currentPage = Math.min(requestedPage, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  products = products.slice(pageStart, pageStart + pageSize);

  const buildShopUrl = (values: { category?: string; sort?: string; page?: number }, anchor = false) => {
    const query = new URLSearchParams();
    if (values.category) query.set("category", values.category);
    if (values.sort) query.set("sort", values.sort);
    if (values.page && values.page > 1) query.set("page", String(values.page));
    const queryString = query.toString();
    return `${queryString ? `/shop?${queryString}` : "/shop"}${anchor ? "#collection" : ""}`;
  };

  const numberedPages = Array.from({ length: totalPages }, (_, index) => ({
    page: index + 1,
    href: buildShopUrl({ category: activeCategory, sort, page: index + 1 }, true),
  }));

  return (
    <main id="main-content" className="min-h-screen pt-[76px]">
      <section className="relative overflow-hidden border-b border-[var(--line-soft)] bg-[var(--panel)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(201,150,43,0.16),transparent_34%),linear-gradient(115deg,rgba(255,255,255,0.025),transparent_55%)]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[1240px] gap-8 px-5 py-9 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-center lg:px-8 lg:py-11">
          <div className="max-w-3xl">
            <p className="eyebrow">Maison Valbridge · Feinkost</p>
            <h1 className="mt-2 font-display text-[clamp(2rem,4vw,3.25rem)] font-medium uppercase leading-[1.08] tracking-[0.08em] text-[var(--gold-pale)]">
              Die Kollektion
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--mist)] sm:text-base">
              Aussergewöhnliche Zutaten für anspruchsvolle Küchen.
            </p>
          </div>

          <div className="lg:border-l lg:border-[var(--line)] lg:pl-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--gold-light)]">Produkte suchen</p>
            <form action="/search" method="get" className="mt-3">
              <label htmlFor="shop-search" className="sr-only">Produkte suchen</label>
              <div className="flex items-center border-b border-[var(--line-bright)] pb-3 transition focus-within:border-[var(--gold-light)]">
                <Search className="mr-3 h-5 w-5 shrink-0 text-[var(--gold)]" aria-hidden="true" />
                <input id="shop-search" name="q" type="search" placeholder="Wonach suchen Sie?" className="min-w-0 flex-1 bg-transparent text-sm text-[var(--cream)] outline-none placeholder:text-[var(--text-faint)]" />
                <button type="submit" className="ml-3 inline-flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--gold)] text-[var(--obsidian)] transition hover:bg-[var(--gold-light)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-light)]" aria-label="Suche absenden">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section id="collection" aria-labelledby="collection-heading" className="mx-auto max-w-[1240px] px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid gap-7 border-y border-[var(--line-soft)] py-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--gold)]">Aktuelle Auswahl</p>
            <h2 id="collection-heading" className="mt-1.5 font-display text-2xl uppercase tracking-[0.07em] text-[var(--gold-pale)] sm:text-3xl">{selectedTitle}</h2>
            <p className="mt-2 text-sm text-[var(--mut)]">
              {totalProducts ? `${pageStart + 1}–${Math.min(pageStart + products.length, totalProducts)} von ${totalProducts} Produkten` : "Keine Produkte in dieser Kollektion"}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <ShopCollectionSelect collections={customerCollections} value={activeCategory} />
            <ShopSortSelect value={sort} />
          </div>
        </div>

        {products.length ? (
          <div className="pt-9 sm:pt-10">
            <ProductGridWithPagination
              products={products}
              currentPage={currentPage}
              pages={numberedPages}
              previousPageUrl={currentPage > 1 ? buildShopUrl({ category: activeCategory, sort, page: currentPage - 1 }, true) : undefined}
              nextPageUrl={currentPage < totalPages ? buildShopUrl({ category: activeCategory, sort, page: currentPage + 1 }, true) : undefined}
            />
          </div>
        ) : (
          <div className="border-y border-[var(--line-soft)] py-16 text-center">
            <h3 className="font-display text-2xl text-[var(--gold-pale)]">Keine Produkte gefunden</h3>
            <p className="mx-auto mt-3 max-w-md text-[var(--mut)]">Diese Kollektion wird derzeit aktualisiert. Entdecken Sie stattdessen das gesamte Sortiment.</p>
            <Link href="/shop#collection" className="mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--gold-light)] hover:text-[var(--gold-pale)]">
              Alle Produkte ansehen <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      <section aria-label="Vorteile beim Einkauf" className="border-y border-[var(--line-soft)] bg-[var(--coal)]">
        <div className="mx-auto grid max-w-[1240px] divide-y divide-[var(--line-soft)] px-5 sm:px-6 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-8">
          {shopPromises.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="flex items-center gap-4 py-7 md:px-6 md:first:pl-0 md:last:pr-0">
              <Icon className="h-5 w-5 shrink-0 text-[var(--gold)]" strokeWidth={1.5} aria-hidden="true" />
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.12em] text-[var(--cream)]">{title}</p>
                <p className="mt-1 text-sm leading-5 text-[var(--mut)]">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
