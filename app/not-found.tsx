import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-6 pb-16 pt-28">
      <div className="w-full rounded-[2.5rem] border border-[var(--line)] bg-[var(--panel)] p-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">404</p>
        <h1 className="mt-4 font-display text-3xl text-[var(--gold-pale)]">This page could not be found</h1>
        <p className="mt-4 text-[var(--mist)]">The product or page may have moved, expired, or no longer be available.</p>
        <Link href="/shop" className="site-button site-button--primary mt-8">Browse the shop</Link>
      </div>
    </main>
  );
}
