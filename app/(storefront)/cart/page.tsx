import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { CartLineControls } from "@/components/cart/cart-line-controls";
import { CartRemoveButton } from "@/components/cart/cart-remove-button";
import { formatMoney } from "@/lib/format";
import { getCartFromCookies } from "@/lib/shopify/cart";

export const metadata: Metadata = {
  title: "Warenkorb",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cart = await getCartFromCookies();

  if (!cart || cart.lines.nodes.length === 0) {
    return (
      <main id="main-content" className="min-h-screen pt-[76px]">
        <section className="flex min-h-[calc(100vh-76px)] items-center border-b border-[var(--line-soft)] bg-[var(--panel)] px-5 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Ihre Auswahl</p>
            <h1 className="mt-4 font-display text-[clamp(2.25rem,6vw,4rem)] uppercase tracking-[0.12em] text-[var(--gold-pale)]">Ihr Warenkorb ist leer</h1>
            <p className="mx-auto mt-5 max-w-xl font-serif text-xl leading-8 text-[var(--mist)]">
              Entdecken Sie feine Trüffel, Safran, Olivenöl und ausgewählte Spezialitäten.
            </p>
            <Link href="/shop" className="site-button site-button--primary mt-8">
              Kollektion entdecken <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen pt-[76px]">
      <header className="border-b border-[var(--line-soft)] bg-[var(--panel)]">
        <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-6 sm:py-14 lg:px-8">
          <p className="eyebrow">Ihre Auswahl</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] uppercase tracking-[0.12em] text-[var(--gold-pale)]">Warenkorb</h1>
              <p className="mt-3 text-sm text-[var(--mut)]">
                {cart.totalQuantity} Artikel zur Prüfung
              </p>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--gold-light)] transition hover:text-[var(--gold-pale)]">
              Weiter einkaufen <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1240px] gap-12 px-5 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(310px,0.75fr)] lg:items-start lg:px-8 lg:py-16">
        <div>
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
            <h2 className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--cream)]">Produkte</h2>
            <span className="text-xs uppercase tracking-[0.14em] text-[var(--mut)]">{cart.lines.nodes.length} {cart.lines.nodes.length === 1 ? "Position" : "Positionen"}</span>
          </div>

          <div>
            {cart.lines.nodes.map((line) => (
              <article key={line.id} className="relative grid gap-5 border-b border-[var(--line-soft)] py-6 pr-12 sm:grid-cols-[128px_minmax(0,1fr)] sm:gap-7">
                <CartRemoveButton lineId={line.id} productTitle={line.merchandise.product.title} />
                <Link href={`/products/${line.merchandise.product.handle}`} className="h-32 w-32 overflow-hidden border border-[var(--line-soft)] bg-[var(--panel2)]">
                  {line.merchandise.image ? (
                    <Image
                      src={line.merchandise.image.url}
                      alt={line.merchandise.image.altText ?? line.merchandise.product.title}
                      width={256}
                      height={256}
                      sizes="128px"
                      className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-xs text-[var(--mut)]">Kein Bild</span>
                  )}
                </Link>

                <div className="flex min-w-0 flex-col justify-between gap-6">
                  <div>
                    <Link href={`/products/${line.merchandise.product.handle}`} className="font-display text-lg font-medium leading-7 tracking-[0.025em] text-[var(--cream)] transition hover:text-[var(--gold-light)]">
                      {line.merchandise.product.title}
                    </Link>
                    {line.merchandise.title && line.merchandise.title !== "Default Title" ? (
                      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[var(--mut)]">{line.merchandise.title}</p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <CartLineControls lineId={line.id} quantity={line.quantity} />
                    <div className="sm:text-right">
                      <p className="text-xs uppercase tracking-[0.14em] text-[var(--mut)]">Positionssumme</p>
                      <p className="mt-1 font-display text-lg font-medium text-[var(--gold-light)]">
                        {formatMoney({ amount: String(Number(line.merchandise.price.amount) * line.quantity), currencyCode: line.merchandise.price.currencyCode })}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="border-y border-[var(--line)] bg-[var(--coal)] px-6 py-7 lg:sticky lg:top-28">
          <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-[var(--gold)]">Bestellübersicht</p>

          <div className="mt-6 space-y-4 border-b border-[var(--line-soft)] pb-6 text-sm">
            <div className="flex items-center justify-between text-[var(--mist)]">
              <span>Zwischensumme</span>
              <span className="text-[var(--cream)]">{formatMoney(cart.cost.subtotalAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-[var(--mist)]">
              <span>Geschätzte Steuern</span>
              <span className="text-[var(--cream)]">{formatMoney(cart.cost.totalTaxAmount ?? { amount: "0", currencyCode: cart.cost.subtotalAmount.currencyCode })}</span>
            </div>
            <div className="flex items-center justify-between text-[var(--mist)]">
              <span>Lieferung</span>
              <span className="text-[var(--mut)]">Beim Checkout</span>
            </div>
          </div>

          <div className="flex items-end justify-between py-6">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--cream)]">Gesamt</span>
            <span className="font-display text-2xl font-medium text-[var(--gold-pale)]">{formatMoney(cart.cost.totalAmount)}</span>
          </div>

          <a href={cart.checkoutUrl} className="site-button site-button--primary w-full">
            Sicher zur Kasse
          </a>
          <Link href="/shop" className="site-button site-button--secondary mt-3 w-full">
            Weiter einkaufen
          </Link>

          <div className="mt-6 flex items-start gap-3 border-t border-[var(--line-soft)] pt-5">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-xs leading-5 text-[var(--mut)]">Sichere Zahlung und endgültige Lieferoptionen werden im Shopify-Checkout angezeigt.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
