"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { formatMoneyAmount } from "@/lib/format";
import type { Product } from "@/lib/shopify/types";
import { findAvailableVariant, getInitialVariantSelection, getVisibleProductOptions, isOptionValueAvailable } from "@/lib/shopify/variants";

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

type QuickAddDialogProps = {
  product: Product;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
};

export function QuickAddDialog({ product, returnFocusRef, onClose }: QuickAddDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () => getInitialVariantSelection(product.variants?.nodes ?? [], product.options ?? []).selections,
  );
  const selectedVariantId = findAvailableVariant(product.variants?.nodes ?? [], selectedOptions)?.id ?? null;
  const selectedVariant = product.variants?.nodes.find((variant) => variant.id === selectedVariantId) ?? null;
  const displayOptions = getVisibleProductOptions(product.options ?? []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const returnFocusTarget = returnFocusRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
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
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      returnFocusTarget?.focus();
    };
  }, [onClose, returnFocusRef]);

  const handleSelectOption = (name: string, value: string) => {
    setSelectedOptions((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm sm:p-6" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-add-title"
        aria-describedby="quick-add-description"
        className="relative max-h-[calc(100dvh-24px)] w-full max-w-[800px] overflow-y-auto border border-[var(--line)] bg-[var(--panel)] shadow-[0_35px_100px_rgba(0,0,0,0.7)] sm:max-h-[calc(100dvh-48px)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute right-0 top-0 z-20 inline-flex h-11 w-11 items-center justify-center border-b border-l border-[var(--line)] bg-[rgba(10,10,10,0.82)] text-[var(--mut)] transition hover:border-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--obsidian)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--gold-light)]"
          aria-label="Schnellauswahl schliessen"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="grid md:grid-cols-[0.92fr_1.08fr]">
          <div className="relative min-h-[220px] overflow-hidden border-b border-[var(--line-soft)] bg-[var(--panel2)] sm:min-h-[260px] md:min-h-[480px] md:border-b-0 md:border-r">
            {product.featuredImage ? (
              <Image
                src={product.featuredImage.url}
                alt={product.featuredImage.altText ?? product.title}
                width={900}
                height={1125}
                sizes="(max-width: 768px) 100vw, 42vw"
                className="absolute inset-0 h-full w-full object-contain p-4 sm:p-6"
              />
            ) : (
              <div className="flex h-full min-h-[220px] items-center justify-center text-sm text-[var(--mut)] md:min-h-[480px]">Kein Bild</div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" aria-hidden="true" />
            <p className="absolute bottom-4 left-4 text-[0.58rem] font-medium uppercase tracking-[0.22em] text-[var(--cream-dim)]">Valbridge Auswahl</p>
          </div>

          <div className="flex min-w-0 flex-col px-5 pb-5 pt-14 sm:px-7 sm:pb-7 md:px-8 md:pb-8 md:pt-8">
            <div className="border-b border-[var(--line-soft)] pb-5">
              <p className="eyebrow text-[0.58rem] tracking-[0.3em]">Schnellauswahl</p>
              <h3 id="quick-add-title" className="mt-3 font-display text-[clamp(1.05rem,2vw,1.5rem)] font-bold uppercase leading-[1.28] tracking-[0.045em] text-[var(--gold-pale)]">
                {product.title}
              </h3>
              <p id="quick-add-description" className="mt-3 font-display text-xl font-medium text-[var(--gold-light)]">
                {selectedVariant
                  ? formatMoneyAmount(selectedVariant.price.amount, selectedVariant.price.currencyCode)
                  : formatMoneyAmount(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
              </p>
              <div className="mt-3 flex items-center gap-2 text-[0.6rem] font-medium uppercase tracking-[0.15em] text-[var(--cream-dim)]">
                <span className={`h-1.5 w-1.5 ${selectedVariantId ? "bg-[var(--gold)]" : "bg-[var(--mut)]"}`} aria-hidden="true" />
                {selectedVariantId ? "Verfügbar" : "Bitte Optionen auswählen"}
              </div>
            </div>

            {displayOptions.length ? (
              <div className="space-y-4 border-b border-[var(--line-soft)] py-5">
                {displayOptions.map((option) => (
                  <div key={option.name}>
                    <div className="mb-2 flex items-baseline justify-between gap-4">
                      <p className="text-[0.6rem] font-medium uppercase tracking-[0.18em] text-[var(--cream)]">{option.name}</p>
                      <p className="truncate text-xs text-[var(--mut)]">{selectedOptions[option.name] ?? "Nicht gewählt"}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value) => {
                        const isSelected = selectedOptions[option.name] === value;
                        const isAvailable = isOptionValueAvailable(product.variants?.nodes ?? [], selectedOptions, option.name, value);

                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleSelectOption(option.name, value)}
                            disabled={!isAvailable}
                            aria-pressed={isSelected}
                            className={`inline-flex min-h-11 items-center gap-2 border px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] transition ${isSelected ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--obsidian)]" : "border-[var(--line)] text-[var(--cream-dim)] hover:border-[var(--gold)] hover:text-[var(--gold-light)]"} disabled:cursor-not-allowed disabled:border-[var(--line-soft)] disabled:text-[var(--text-faint)]`}
                          >
                            {isSelected ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                            {value}{!isAvailable ? " (Ausverkauft)" : ""}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-auto space-y-3 pt-5">
              <AddToCartButton selectedVariantId={selectedVariantId} onSuccess={onClose} />
              <Link href={`/products/${product.handle}`} onClick={onClose} className="group/link inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[var(--line)] px-5 text-[0.68rem] font-medium uppercase tracking-[0.17em] text-[var(--cream)] transition hover:border-[var(--gold)] hover:text-[var(--gold-light)]">
                Produktdetails ansehen
                <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" aria-hidden="true" />
              </Link>
              <p className="text-center text-[0.68rem] leading-5 text-[var(--mut)]">Sicherer Checkout · Sorgfältig verpackt</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
