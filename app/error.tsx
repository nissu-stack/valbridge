"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-6 pb-16 pt-28">
      <div className="w-full rounded-[2.5rem] border border-[var(--line)] bg-[var(--panel)] p-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Something went wrong</p>
        <h1 className="mt-4 font-display text-3xl text-[var(--gold-pale)]">We could not load this page</h1>
        <p className="mt-4 text-[var(--mist)]">Please try again. If the problem continues, contact our team for assistance.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="site-button site-button--primary">Try again</button>
          <Link href="/shop" className="site-button site-button--secondary">Return to shop</Link>
        </div>
      </div>
    </main>
  );
}
