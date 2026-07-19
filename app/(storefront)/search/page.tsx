import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product/product-grid";
import { searchProducts } from "@/lib/shopify/search";
import { SearchBar } from "@/components/layout/search-bar";
import { Suspense } from "react";

type SearchPageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const params = await searchParams;
  const query = params?.q?.trim() ?? "";

  return {
    title: query ? `Search results for "${query}"` : "Search",
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params?.q?.trim() ?? "";

  if (!query) {
    return (
      <main id="main-content" className="mx-auto flex max-w-5xl flex-col gap-6 px-6 pb-10 pt-28 lg:px-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">Search</h1>
          <p className="text-[var(--mist)]">Enter a product name, keyword, or collection term to find what you are looking for.</p>
        </header>
        <Suspense><SearchBar /></Suspense>
      </main>
    );
  }

  const products = await searchProducts(query);

  if (!products.length) {
    return (
      <main id="main-content" className="mx-auto flex max-w-5xl flex-col gap-8 px-6 pb-10 pt-28 lg:px-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">Search</h1>
          <p className="text-[var(--mist)]">No results for &quot;{query}&quot;.</p>
        </header>
        <Suspense><SearchBar /></Suspense>
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6 text-sm text-[var(--mist)]">
          Try checking your spelling, or browse our <Link href="/shop" className="font-medium text-zinc-950 underline">shop</Link>.
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="mx-auto flex max-w-7xl flex-col gap-8 px-6 pb-10 pt-28 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Search</h1>
        <p className="text-[var(--mist)]">{products.length} result{products.length === 1 ? "" : "s"} for &quot;{query}&quot;</p>
      </header>
      <Suspense><SearchBar /></Suspense>
      <ProductGrid products={products} />
    </main>
  );
}
