import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line-soft)] bg-[var(--coal)] px-4 py-[56px] sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1240px] gap-9 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/logo.png"
              alt="Logo der Valbridge Group"
              width={180}
              height={56}
              className="h-14 w-auto object-contain"
            />
          </Link>
          <p className="mt-4 max-w-[320px] font-serif text-[1rem] italic text-[var(--mist)]">
            Trüffel · Safran · Feinkost. Schweizer Qualität, weltweit geschätzt.
          </p>
        </div>
        <div>
          <h4 className="text-[0.7rem] font-medium uppercase tracking-[0.3em] text-[var(--gold)]">Shop</h4>
          <div className="mt-4 space-y-2 text-[0.86rem] text-[var(--mist)]">
            <Link href="/shop?category=frische-truffel" className="block transition hover:text-[var(--gold-light)]">Frische Trüffel</Link>
            <Link href="/shop?category=truffelprodukte" className="block transition hover:text-[var(--gold-light)]">Trüffelprodukte</Link>
            <Link href="/shop?category=safran" className="block transition hover:text-[var(--gold-light)]">Safran</Link>
            <Link href="/shop" className="block transition hover:text-[var(--gold-light)]">Feinkost</Link>
          </div>
        </div>
        <div>
          <h4 className="text-[0.7rem] font-medium uppercase tracking-[0.3em] text-[var(--gold)]">Unternehmen</h4>
          <div className="mt-4 space-y-2 text-[0.86rem] text-[var(--mist)]">
            <Link href="/about" className="block transition hover:text-[var(--gold-light)]">Über uns</Link>
            <a href="mailto:info@valbridgegroup.com" className="block transition hover:text-[var(--gold-light)]">E-Mail senden</a>
            <Link href="/wholesale" className="block transition hover:text-[var(--gold-light)]">B2B / Grosshandel</Link>
          </div>
        </div>
        <div>
          <h4 className="text-[0.7rem] font-medium uppercase tracking-[0.3em] text-[var(--gold)]">Zahlungsmittel</h4>
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
        <nav aria-label="Rechtliches" className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/legal/imprint">Impressum</Link>
          <Link href="/legal/terms">AGB</Link>
          <Link href="/legal/privacy">Datenschutz</Link>
          <Link href="/legal/shipping">Versand</Link>
          <Link href="/legal/refunds">Rückerstattungen</Link>
        </nav>
      </div>
    </footer>
  );
}
