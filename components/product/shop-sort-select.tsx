"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, ChevronDown } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Beliebt", value: "" },
  { label: "Neueste zuerst", value: "latest-desc" },
  { label: "Preis: aufsteigend", value: "price-asc" },
  { label: "Preis: absteigend", value: "price-desc" },
] as const;

export function ShopSortSelect({ value = "" }: { value?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="w-full sm:w-[260px]">
      <label htmlFor="sort" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--mut)]">Produkte sortieren</label>
      <div className="relative">
        <ArrowUpDown className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gold)]" aria-hidden="true" />
        <select
          id="sort"
          value={value}
          onChange={(event) => {
            const query = new URLSearchParams(searchParams.toString());
            query.delete("after");
            query.delete("before");
            query.delete("page");

            if (event.target.value) {
              query.set("sort", event.target.value);
            } else {
              query.delete("sort");
            }

            const nextQuery = query.toString();
            router.push(nextQuery ? `/shop?${nextQuery}` : "/shop");
          }}
          className="h-12 w-full appearance-none border border-[var(--line-soft)] bg-[var(--panel)] py-3 pl-11 pr-10 text-sm text-[var(--cream)] outline-none transition hover:border-[var(--line-bright)] focus:border-[var(--gold)] focus:ring-1 focus:ring-[rgba(201,150,43,0.18)]"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} className="bg-[var(--panel)] text-[var(--cream)]">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--mut)]" aria-hidden="true" />
      </div>
    </div>
  );
}
