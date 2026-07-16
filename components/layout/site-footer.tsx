import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line-soft)] bg-[var(--coal)] px-4 py-[56px] sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1240px] gap-9 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/logo.jpeg"
              alt="Valbridge Group logo"
              width={180}
              height={56}
              className="h-14 w-auto object-contain"
            />
          </Link>
          <p className="mt-4 max-w-[320px] font-serif text-[1rem] italic text-[var(--mist)]">
            Truffles · Saffron · Fine Foods. Swiss Quality, Global Excellence.
          </p>
        </div>
        <div>
          <h4 className="text-[0.7rem] font-medium uppercase tracking-[0.3em] text-[var(--gold)]">Shop</h4>
          <div className="mt-4 space-y-2 text-[0.86rem] text-[var(--mist)]">
            <Link href="/shop" className="block transition hover:text-[var(--gold-light)]">Fresh Truffles</Link>
            <Link href="/shop" className="block transition hover:text-[var(--gold-light)]">Truffle Products</Link>
            <Link href="/shop" className="block transition hover:text-[var(--gold-light)]">Saffron</Link>
            <Link href="/shop" className="block transition hover:text-[var(--gold-light)]">Fine Foods</Link>
          </div>
        </div>
        <div>
          <h4 className="text-[0.7rem] font-medium uppercase tracking-[0.3em] text-[var(--gold)]">Company</h4>
          <div className="mt-4 space-y-2 text-[0.86rem] text-[var(--mist)]">
            <Link href="/search" className="block transition hover:text-[var(--gold-light)]">About us</Link>
            <Link href="/search" className="block transition hover:text-[var(--gold-light)]">Contact</Link>
            <Link href="/shop" className="block transition hover:text-[var(--gold-light)]">B2B / Wholesale</Link>
          </div>
        </div>
        <div>
          <h4 className="text-[0.7rem] font-medium uppercase tracking-[0.3em] text-[var(--gold)]">Payments</h4>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="border border-[var(--line)] px-3 py-2 text-[0.62rem] uppercase tracking-[0.14em] text-[var(--gold-light)]">Twint</span>
            <span className="border border-[var(--line)] px-3 py-2 text-[0.62rem] uppercase tracking-[0.14em] text-[var(--gold-light)]">Visa</span>
            <span className="border border-[var(--line)] px-3 py-2 text-[0.62rem] uppercase tracking-[0.14em] text-[var(--gold-light)]">Mastercard</span>
            <span className="border border-[var(--line)] px-3 py-2 text-[0.62rem] uppercase tracking-[0.14em] text-[var(--gold-light)]">Apple Pay</span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1240px] flex-wrap items-center justify-between gap-4 border-t border-[var(--line-soft)] pt-6 text-[0.7rem] uppercase tracking-[0.18em] text-[rgba(245,239,227,0.4)]">
        <p>© 2026 Valbridge Group · www.valbridgegroup.com</p>
        <p>Impressum · AGB · Datenschutz</p>
      </div>
    </footer>
  );
}
