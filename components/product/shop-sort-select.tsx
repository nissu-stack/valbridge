"use client";

import { useRouter, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { label: "Trending", value: "" },
  { label: "Latest arrivals", value: "latest-desc" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
] as const;

export function ShopSortSelect({ value = "" }: { value?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="w-full sm:w-[240px]">
      <label htmlFor="sort" className="sr-only">Sort products</label>
      <select
        id="sort"
        value={value}
        onChange={(event) => {
          const query = new URLSearchParams(searchParams.toString());
          query.delete("after");
          query.delete("before");

          if (event.target.value) {
            query.set("sort", event.target.value);
          } else {
            query.delete("sort");
          }

          const nextQuery = query.toString();
          router.push(nextQuery ? `/shop?${nextQuery}` : "/shop");
        }}
        className="w-full rounded-full border border-[rgba(255,255,255,0.08)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--cream)] outline-none transition focus:border-[var(--gold)] focus:ring-1 focus:ring-[rgba(201,150,43,0.12)]"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value} className="bg-[var(--panel)] text-[var(--cream)]">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
