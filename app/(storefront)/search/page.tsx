import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product/product-grid";
import { searchProducts } from "@/lib/shopify/search";

type SearchPageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const params = await searchParams;
  const query = params?.q?.trim() ?? "";

  return {
    title: query ? `Search results for "${query}"` : "Search",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params?.q?.trim() ?? "";

  if (!query) {
    return (
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10 lg:px-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">Search</h1>
          <p className="text-zinc-600">Enter a product name, keyword, or collection term to find what you are looking for.</p>
        </header>
      </main>
    );
  }

  const products = await searchProducts(query);

  if (!products.length) {
    return (
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10 lg:px-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">Search</h1>
          <p className="text-zinc-600">No results for &quot;{query}&quot;.</p>
        </header>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-700">
          Try checking your spelling, or browse our <Link href="/collections" className="font-medium text-zinc-950 underline">collections</Link>.
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Search</h1>
        <p className="text-zinc-600">{products.length} result{products.length === 1 ? "" : "s"} for &quot;{query}&quot;</p>
      </header>
      <ProductGrid products={products} />
    </main>
  );
}
