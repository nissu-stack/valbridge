import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-6 pb-16 pt-28">
      <div className="w-full rounded-[2.5rem] border border-[var(--line)] bg-[var(--panel)] p-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">404</p>
        <h1 className="mt-4 font-display text-3xl text-[var(--gold-pale)]">Diese Seite wurde nicht gefunden</h1>
        <p className="mt-4 text-[var(--mist)]">Das Produkt oder die Seite wurde möglicherweise verschoben oder ist nicht mehr verfügbar.</p>
        <Link href="/shop" className="site-button site-button--primary mt-8">Shop entdecken</Link>
      </div>
    </main>
  );
}
