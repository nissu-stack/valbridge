"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { X, ArrowRight, ShoppingBag } from "lucide-react";
import { removeCartLine } from "@/app/(storefront)/cart/actions";
import { useCartDrawerStore } from "@/lib/cart/store";
import type { Cart } from "@/lib/shopify/types";
import { formatMoney } from "@/lib/format";

export function CartDrawer() {
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const isOpen = useCartDrawerStore((state) => state.isOpen);
  const closeDrawer = useCartDrawerStore((state) => state.closeDrawer);
  const currentCart = useCartDrawerStore((state) => state.cart);
  const setCart = useCartDrawerStore((state) => state.setCart);
  const [removingLineId, setRemovingLineId] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/cart", { cache: "no-store", signal: controller.signal })
      .then((response) => response.ok ? response.json() as Promise<{ cart: Cart | null }> : Promise.reject())
      .then((data) => setCart(data.cart))
      .catch(() => undefined);

    return () => controller.abort();
  }, [setCart]);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
        return;
      }

      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, [closeDrawer, isOpen]);

  const totalCount = currentCart?.totalQuantity ?? 0;
  const hasItems = Boolean(currentCart && currentCart.lines.nodes.length > 0);

  const handleRemoveLine = async (lineId: string) => {
    setRemovingLineId(lineId);
    setRemoveError(null);

    try {
      const result = await removeCartLine(lineId);
      if (result.userErrors.length || !result.cart) {
        setRemoveError(result.userErrors[0]?.message ?? "Dieser Artikel konnte nicht entfernt werden.");
        return;
      }

      setCart(result.cart);
    } catch {
      setRemoveError("Dieser Artikel konnte nicht entfernt werden. Bitte versuchen Sie es erneut.");
    } finally {
      setRemovingLineId(null);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-[2px] transition ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <aside
        ref={dialogRef}
        id="cart-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-panel-title"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[460px] flex-col border-l border-[var(--line)] bg-[var(--obsidian)] shadow-[-28px_0_80px_rgba(0,0,0,0.45)] transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex min-h-[92px] items-center justify-between border-b border-[var(--line-soft)] px-5 py-5 sm:px-6">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--gold)]">Ihre Auswahl</p>
            <h2 id="cart-panel-title" className="mt-1 font-display text-xl uppercase tracking-[0.12em] text-[var(--gold-pale)]">Warenkorb</h2>
          </div>
          <button ref={closeButtonRef} type="button" onClick={closeDrawer} className="inline-flex h-11 w-11 items-center justify-center border border-[var(--line)] text-[var(--mut)] transition hover:border-[var(--gold)] hover:text-[var(--gold-light)]" aria-label="Warenkorb schliessen">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!hasItems ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center border border-[var(--line)] bg-[var(--panel)]">
              <ShoppingBag className="h-7 w-7 text-[var(--gold)]" strokeWidth={1.5} />
            </div>
            <h3 className="mt-6 font-display text-xl uppercase tracking-[0.08em] text-[var(--gold-pale)]">Ihr Warenkorb ist leer</h3>
            <p className="mt-3 max-w-xs text-sm leading-6 text-[var(--mut)]">Entdecken Sie die Kollektion und ergänzen Sie Ihre Bestellung um etwas Aussergewöhnliches.</p>
            <Link href="/shop" onClick={closeDrawer} className="site-button site-button--primary mt-7">
              Weiter einkaufen <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-[var(--line-soft)] bg-[var(--coal)] px-5 py-4 text-xs uppercase tracking-[0.16em] sm:px-6">
              <span className="text-[var(--mut)]">{totalCount} Artikel</span>
              <span className="font-medium text-[var(--gold-light)]">{currentCart ? formatMoney(currentCart.cost.totalAmount) : null}</span>
            </div>

            {removeError ? <p className="border-b border-red-400/20 bg-red-950/20 px-5 py-3 text-sm text-red-200 sm:px-6" role="alert">{removeError}</p> : null}

            <div className="flex-1 overflow-y-auto">
              <div>
                {currentCart?.lines.nodes.map((line) => (
                  <article key={line.id} className="relative flex gap-4 border-b border-[var(--line-soft)] px-5 py-5 sm:px-6">
                    <button
                      type="button"
                      onClick={() => handleRemoveLine(line.id)}
                      disabled={removingLineId === line.id}
                      className="absolute right-5 top-5 inline-flex h-8 w-8 items-center justify-center border border-[var(--line-soft)] text-[var(--mut)] transition hover:border-[var(--gold)] hover:text-[var(--gold-light)] disabled:cursor-wait disabled:opacity-50 sm:right-6"
                      aria-label={`${line.merchandise.product.title} aus dem Warenkorb entfernen`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <Link href={`/products/${line.merchandise.product.handle}`} onClick={closeDrawer} className="h-24 w-24 shrink-0 overflow-hidden border border-[var(--line-soft)] bg-[var(--panel2)]">
                      {line.merchandise.image ? (
                        <Image
                          src={line.merchandise.image.url}
                          alt={line.merchandise.image.altText ?? line.merchandise.product.title}
                          width={192}
                          height={192}
                          sizes="96px"
                          className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-xs text-[var(--mut)]">Kein Bild</span>
                      )}
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5 pr-10">
                      <div>
                        <Link href={`/products/${line.merchandise.product.handle}`} onClick={closeDrawer} className="line-clamp-2 font-display text-sm font-medium leading-5 tracking-[0.02em] text-[var(--cream)] transition hover:text-[var(--gold-light)]">
                          {line.merchandise.product.title}
                        </Link>
                        {line.merchandise.title && line.merchandise.title !== "Default Title" ? (
                          <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[var(--mut)]">{line.merchandise.title}</p>
                        ) : null}
                      </div>
                      <div className="mt-4 flex items-end justify-between gap-3">
                        <span className="text-sm font-medium text-[var(--gold-light)]">{formatMoney({ amount: String(Number(line.merchandise.price.amount) * line.quantity), currencyCode: line.merchandise.price.currencyCode })}</span>
                        <span className="text-xs uppercase tracking-[0.12em] text-[var(--mut)]">Menge {line.quantity}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="border-t border-[var(--line)] bg-[var(--coal)] px-5 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.16em] text-[var(--mut)]">Zwischensumme</span>
                <span className="font-display text-lg font-medium text-[var(--gold-pale)]">{currentCart ? formatMoney(currentCart.cost.subtotalAmount) : null}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-[var(--mut)]">Steuern und Lieferung werden beim sicheren Checkout berechnet.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="site-button site-button--secondary w-full"
                >
                  Warenkorb ansehen
                </Link>
                <a
                  href={currentCart?.checkoutUrl}
                  className="site-button site-button--primary w-full"
                >
                  Zur Kasse
                </a>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
