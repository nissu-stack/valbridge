"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trimmed = value.trim();
      const current = searchParams.get("q") ?? "";

      if (trimmed === current) {
        return;
      }

      if (!trimmed) {
        router.replace("/search");
        return;
      }

      router.replace(`/search?q=${encodeURIComponent(trimmed)}`);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [router, searchParams, value]);

  return (
    <form
      className="w-full max-w-xl"
      onSubmit={(event) => {
        event.preventDefault();
        const trimmed = value.trim();
        if (!trimmed) {
          router.replace("/search");
          return;
        }
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      }}
    >
      <label className="sr-only" htmlFor="site-search">
        Search products
      </label>
      <input
        id="site-search"
        type="search"
        placeholder="Search products"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="w-full border border-[var(--line)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--cream)] outline-none ring-0 placeholder:text-[var(--mut)] focus:border-[var(--gold)] focus:ring-2 focus:ring-[rgba(201,150,43,0.2)]"
      />
    </form>
  );
}
