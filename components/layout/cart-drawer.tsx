"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { X, ArrowRight, ShoppingBag } from "lucide-react";
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

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/45 transition ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
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
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[var(--line)] bg-[var(--panel)] shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--mut)]">Your bag</p>
            <h2 id="cart-panel-title" className="text-lg font-semibold text-[var(--ink)]">Cart</h2>
          </div>
          <button ref={closeButtonRef} type="button" onClick={closeDrawer} className="rounded-full p-2 text-[var(--mut)] transition hover:bg-zinc-100 hover:text-[var(--ink)]" aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!hasItems ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="rounded-full bg-zinc-100 p-4">
              <ShoppingBag className="h-8 w-8 text-zinc-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-950">Your cart is empty</h3>
              <p className="mt-2 text-sm text-zinc-600">Add a few favorites and your selected items will appear here.</p>
            </div>
            <Link href="/shop" onClick={closeDrawer} className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white">
              Continue shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="mb-4 flex items-center justify-between rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm">
                <span className="text-zinc-600">{totalCount} item{totalCount === 1 ? "" : "s"}</span>
                <span className="font-semibold text-zinc-950">{currentCart ? formatMoney(currentCart.cost.totalAmount) : null}</span>
              </div>

              <div className="space-y-3">
                {currentCart?.lines.nodes.map((line) => (
                  <div key={line.id} className="flex gap-3 rounded-2xl border border-[var(--line)] bg-white p-3">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-50">
                      {line.merchandise.image ? (
                        <Image
                          src={line.merchandise.image.url}
                          alt={line.merchandise.image.altText ?? line.merchandise.product.title}
                          width={96}
                          height={96}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">{line.merchandise.product.title}</p>
                        <p className="mt-1 text-sm text-zinc-500">{line.merchandise.title}</p>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-semibold text-zinc-950">{formatMoney({ amount: String(Number(line.merchandise.price.amount) * line.quantity), currencyCode: line.merchandise.price.currencyCode })}</span>
                        <span className="text-sm text-zinc-500">Qty {line.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[var(--line)] bg-white px-5 py-4">
              <div className="mb-3 flex items-center justify-between text-sm text-zinc-600">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-950">{currentCart ? formatMoney(currentCart.cost.subtotalAmount) : null}</span>
              </div>
              <div className="grid gap-3">
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="inline-flex w-full items-center justify-center rounded-full bg-zinc-950 px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[var(--gold)] hover:text-[var(--obsidian)]"
                >
                  View cart
                </Link>
                <a
                  href={currentCart?.checkoutUrl}
                  className="inline-flex w-full items-center justify-center rounded-full bg-zinc-950 px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[var(--gold)] hover:text-[var(--obsidian)]"
                >
                  Checkout
                </a>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
