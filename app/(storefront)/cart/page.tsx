import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/format";
import type { Metadata } from "next";
import { getCartFromCookies } from "@/lib/shopify/cart";
import { CartLineControls } from "@/components/cart/cart-line-controls";

export const metadata: Metadata = {
  title: "Cart",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cart = await getCartFromCookies();

  if (!cart || cart.lines.nodes.length === 0) {
    return (
      <main id="main-content" className="mx-auto min-h-screen max-w-5xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] border border-[var(--line)] bg-[var(--panel)] p-12 text-center shadow-[0_40px_140px_-90px_rgba(0,0,0,0.65)]">
          <Badge className="mx-auto mb-6 inline-flex border-[var(--gold)] bg-[rgba(201,150,43,0.12)] text-[var(--gold-light)]">Your bag</Badge>
          <h1 className="font-display text-[clamp(2.15rem,4vw,3.4rem)] uppercase tracking-[0.18em] text-[var(--gold-pale)]">Empty cart</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--mist)]">
            Save your favorites for later and return to discover the finest olive oils, truffles, and gourmet pantry essentials.
          </p>
          <Link href="/shop" className="mt-10 inline-flex">
            <Button className="rounded-full bg-[var(--gold)] px-12 py-3 text-[var(--obsidian)] hover:bg-[var(--gold-light)]">Browse shop</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="mx-auto min-h-screen max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <section className="rounded-[2.5rem] border border-[var(--line)] bg-[var(--panel)] p-10 shadow-[0_40px_140px_-90px_rgba(0,0,0,0.65)]">
        <Badge className="inline-flex border-[var(--gold)] bg-[rgba(201,150,43,0.12)] text-[var(--gold-light)]">Your bag</Badge>
        <div className="mt-6 max-w-3xl">
          <h1 className="font-display text-[clamp(2.25rem,4vw,3.75rem)] uppercase tracking-[0.18em] text-[var(--gold-pale)]">Cart</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--mist)]">
            {cart.totalQuantity} item{cart.totalQuantity === 1 ? "" : "s"} waiting for checkout. Review the selection, adjust quantities, and confirm your order before secure payment.
          </p>
        </div>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
        <div className="space-y-5">
          {cart.lines.nodes.map((line) => (
            <div key={line.id} className="overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--panel2)] p-6 shadow-[0_24px_70px_-36px_rgba(0,0,0,0.45)] sm:grid sm:grid-cols-[120px_1fr] sm:gap-6">
              <div className="h-28 w-full overflow-hidden rounded-[1.8rem] bg-[var(--panel)]">
                {line.merchandise.image ? (
                  <Image
                    src={line.merchandise.image.url}
                    alt={line.merchandise.image.altText ?? line.merchandise.product.title}
                    width={240}
                    height={240}
                    sizes="120px"
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <div className="mt-5 flex flex-col justify-between gap-6 sm:mt-0">
                <div>
                  <p className="text-xl font-semibold text-[var(--cream)]">{line.merchandise.product.title}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[var(--gold-light)]">{line.merchandise.title}</p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <CartLineControls lineId={line.id} quantity={line.quantity} />

                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <p className="text-lg font-semibold text-[var(--gold-light)]">{formatMoney({ amount: String(Number(line.merchandise.price.amount) * line.quantity), currencyCode: line.merchandise.price.currencyCode })}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2.5rem] border border-[var(--line)] bg-[var(--panel)] p-8 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.55)]">
            <div className="flex items-center justify-between text-sm uppercase tracking-[0.18em] text-[var(--gold-light)]">
              <span>Your order</span>
              <span>{cart.totalQuantity} item{cart.totalQuantity === 1 ? "" : "s"}</span>
            </div>

            <div className="mt-6 space-y-4 text-sm text-[var(--mist)]">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="text-[var(--cream)]">{formatMoney(cart.cost.subtotalAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Estimated tax</span>
                <span className="text-[var(--cream)]">{formatMoney(cart.cost.totalTaxAmount ?? { amount: "0", currencyCode: cart.cost.subtotalAmount.currencyCode })}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[var(--line)] pt-4 text-xl font-semibold text-[var(--cream)]">
              <span>Total</span>
              <span>{formatMoney(cart.cost.totalAmount)}</span>
            </div>

            <div className="mt-8 grid gap-3">
              <a
                href={cart.checkoutUrl}
                className="inline-flex w-full items-center justify-center rounded-full bg-[var(--gold)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--obsidian)] transition hover:bg-[var(--gold-light)]"
              >
                Checkout securely
              </a>
              <Link href="/shop" className="inline-flex w-full items-center justify-center rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-zinc-50">
                Continue shopping
              </Link>
            </div>

            <p className="mt-4 text-center text-xs uppercase tracking-[0.22em] text-[var(--mut)]">
              Secure payment through Shopify checkout
            </p>
          </div>

          <div className="rounded-[2.5rem] border border-[var(--line)] bg-[rgba(201,150,43,0.06)] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--gold-light)]">Need help?</p>
            <p className="mt-3 text-sm leading-7 text-[var(--cream)]">
              Contact us for gift orders, wholesale support, or bespoke sourcing assistance.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
