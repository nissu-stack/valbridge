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
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Etwas ist schiefgelaufen</p>
        <h1 className="mt-4 font-display text-3xl text-[var(--gold-pale)]">Diese Seite konnte nicht geladen werden</h1>
        <p className="mt-4 text-[var(--mist)]">Bitte versuchen Sie es erneut. Sollte das Problem weiterhin bestehen, kontaktieren Sie unser Team.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="site-button site-button--primary">Erneut versuchen</button>
          <Link href="/shop" className="site-button site-button--secondary">Zurück zum Shop</Link>
        </div>
      </div>
    </main>
  );
}
