import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { shopifyClient } from "@/lib/shopify/client";
import { COLLECTION_QUERY } from "@/lib/shopify/queries";
import type { CollectionQueryData } from "@/lib/shopify/types";
import { ProductGrid } from "@/components/product/product-grid";

const PAGE_SIZE = 24;
const categories = [
  { label: "All products", href: "/shop" },
  { label: "Home & living", href: "/collections/home-living" },
  { label: "Decor", href: "/collections/decor" },
  { label: "Objects", href: "/collections/objects" },
];

type CollectionPageProps = {
  params: Promise<{ handle: string }>;
  searchParams?: Promise<{ after?: string; sort?: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const data = await shopifyClient.request<CollectionQueryData>(COLLECTION_QUERY, {
    handle,
    first: PAGE_SIZE,
    after: undefined,
  });
  const collection = data.collection;

  if (!collection) {
    return {
      title: "Collection not found",
    };
  }

  return {
    title: collection.title,
    description: collection.descriptionHtml?.replace(/<[^>]+>/g, "").trim() || undefined,
  };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const [{ handle }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const after = resolvedSearchParams?.after;
  const sort = resolvedSearchParams?.sort;

  const sortKey = sort === "price-desc" ? "PRICE" : sort === "title" ? "TITLE" : "BEST_SELLING";
  const reverse = sort === "price-asc" || sort === "price-desc";

  const data = await shopifyClient.request<CollectionQueryData>(COLLECTION_QUERY, {
    handle,
    first: PAGE_SIZE,
    after: after ?? undefined,
    sortKey,
    reverse: sort === "price-asc" ? false : sort === "price-desc" ? true : undefined,
  });

  const collection = data.collection;

  if (!collection) {
    notFound();
  }

  const products = collection.products.edges.map((edge) => edge.node);
  const pageInfo = collection.products.pageInfo;

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <header className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 p-8 text-white shadow-sm">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-zinc-400">Shop the collection</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{collection.title}</h1>
          {collection.descriptionHtml ? (
            <div className="max-w-3xl text-sm leading-7 text-zinc-300" dangerouslySetInnerHTML={{ __html: collection.descriptionHtml }} />
          ) : null}
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="sticky top-8 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.2)]">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500">Sortiment</p>
              <div className="rounded-[1.75rem] border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-sm font-medium text-zinc-900">Browse categories</p>
                <div className="mt-4 space-y-3">
                  {categories.map((category) => {
                    const isActive = category.href === `/collections/${handle}` || (category.label === "All products" && handle === "all");
                    return (
                      <Link
                        key={category.label}
                        href={category.href}
                        className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${isActive ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-white"}`}
                      >
                        <span>{category.label}</span>
                        <span className={`text-xs ${isActive ? "text-zinc-300" : "text-zinc-400"}`}>›</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-zinc-200 bg-zinc-50 p-5">
              <p className="text-sm font-semibold text-zinc-900">Filter by mood</p>
              <div className="mt-4 grid gap-3">
                {['Minimal', 'Warm', 'Modern', 'Textural'].map((tag) => (
                  <button key={tag} type="button" className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100">
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-zinc-200 bg-zinc-950 p-5 text-white">
              <p className="text-sm uppercase tracking-[0.25em] text-zinc-400">Need help choosing?</p>
              <p className="mt-3 text-sm leading-7 text-zinc-200">Our editors are ready to help you match pieces to your space, whether you want a refined table setting or an elevated everyday object.</p>
              <Link href="/contact" className="mt-4 inline-flex rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
                Contact our team
              </Link>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500">{collection.title}</p>
              <div className="text-sm text-zinc-600">{products.length} items · Curated for modern living</div>
            </div>
            <form className="flex flex-col gap-3 sm:flex-row sm:items-center" method="get">
              <label className="text-sm font-medium text-zinc-700" htmlFor="sort">
                Sortieren nach
              </label>
              <select id="sort" name="sort" defaultValue={sort ?? "featured"} className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 shadow-sm">
                <option value="featured">Relevanz</option>
                <option value="price-asc">Preis: Niedrig bis Hoch</option>
                <option value="price-desc">Preis: Hoch bis Niedrig</option>
                <option value="title">Titel: A-Z</option>
              </select>
              <button type="submit" className="inline-flex shrink-0 rounded-full bg-zinc-950 px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-800">
                Anwenden
              </button>
            </form>
          </div>

          <ProductGrid products={products} />

          {pageInfo.hasNextPage ? (
            <div className="flex justify-center">
              <Link
                href={`/collections/${handle}?after=${encodeURIComponent(pageInfo.endCursor ?? "")}`}
                className="inline-flex rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition hover:border-zinc-950 hover:bg-zinc-50"
              >
                Mehr laden
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
