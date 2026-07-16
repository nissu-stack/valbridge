import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--panel)] text-[var(--ink)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--gold-l)]">Maison Valbridge</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-[var(--mut)]">
            Curated objects for modern living, designed with warmth, texture, and timeless ease.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[var(--ink)]">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--mut)]">
            <li><Link href="/shop" className="transition hover:text-[var(--gold-l)]">Shop</Link></li>
            <li><Link href="/cart" className="transition hover:text-[var(--gold-l)]">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[var(--ink)]">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--mut)]">
            <li>hello@valbridge.com</li>
            <li>+41 44 123 45 67</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
