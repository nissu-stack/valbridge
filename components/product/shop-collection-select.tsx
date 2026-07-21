"use client";

import { ChevronDown, LayoutGrid } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type CollectionOption = {
  handle: string;
  title: string;
};

type ShopCollectionSelectProps = {
  collections: CollectionOption[];
  value?: string;
};

export function ShopCollectionSelect({ collections, value = "" }: ShopCollectionSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="w-full sm:w-[300px]">
      <label htmlFor="collection-filter" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--mut)]">
        Kollektion · {collections.length}
      </label>
      <div className="relative">
        <LayoutGrid className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gold)]" aria-hidden="true" />
        <select
          id="collection-filter"
          value={value}
          onChange={(event) => {
            const query = new URLSearchParams(searchParams.toString());
            query.delete("page");
            query.delete("after");
            query.delete("before");

            if (event.target.value) {
              query.set("category", event.target.value);
            } else {
              query.delete("category");
            }

            const nextQuery = query.toString();
            router.push(`${nextQuery ? `/shop?${nextQuery}` : "/shop"}#collection`);
          }}
          className="h-12 w-full appearance-none border border-[var(--line-soft)] bg-[var(--panel)] py-3 pl-11 pr-10 text-sm text-[var(--cream)] outline-none transition hover:border-[var(--line-bright)] focus:border-[var(--gold)] focus:ring-1 focus:ring-[rgba(201,150,43,0.18)]"
        >
          <option value="" className="bg-[var(--panel)] text-[var(--cream)]">Alle Produkte</option>
          {collections.map((collection) => (
            <option key={collection.handle} value={collection.handle} className="bg-[var(--panel)] text-[var(--cream)]">
              {collection.title}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--mut)]" aria-hidden="true" />
      </div>
    </div>
  );
}
