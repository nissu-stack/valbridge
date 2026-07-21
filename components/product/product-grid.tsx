"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, ShoppingBag, X } from "lucide-react";
import type { Product } from "@/lib/shopify/types";
import { Skeleton } from "@/components/ui/skeleton";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { findAvailableVariant, getInitialVariantSelection, isOptionValueAvailable } from "@/lib/shopify/variants";
import { formatMoneyAmount } from "@/lib/format";

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const modalCloseRef = useRef<HTMLButtonElement>(null);
  const quickAddTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const selectedVariantId = activeProduct
    ? findAvailableVariant(activeProduct.variants?.nodes ?? [], selectedOptions)?.id ?? null
    : null;
  const selectedVariant = activeProduct?.variants?.nodes.find((variant) => variant.id === selectedVariantId) ?? null;
  const displayOptions = activeProduct?.options?.filter(
    (option) => !(option.name === "Title" && option.values.length === 1 && option.values[0] === "Default Title"),
  ) ?? [];

  useEffect(() => {
    if (!activeProduct) return;

    modalCloseRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveProduct(null);
        return;
      }

      if (event.key === "Tab") {
        const focusable = modalRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
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

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      quickAddTriggerRef.current?.focus();
    };
  }, [activeProduct]);

  const handleOpen = (product: Product, trigger: HTMLButtonElement) => {
    const initial = getInitialVariantSelection(product.variants?.nodes ?? [], product.options ?? []);
    quickAddTriggerRef.current = trigger;
    setActiveProduct(product);
    setSelectedOptions(initial.selections);
  };

  const handleClose = () => {
    setActiveProduct(null);
    setSelectedOptions({});
  };

  const handleSelectOption = (name: string, value: string) => {
    setSelectedOptions((current) => ({ ...current, [name]: value }));
  };


  return (
    <>
      <div className="grid gap-x-4 gap-y-9 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-5 xl:gap-y-12">
        {products.map((product) => {
          const currency = product.priceRange.minVariantPrice.currencyCode;
          const formattedPrice = formatMoneyAmount(product.priceRange.minVariantPrice.amount, currency);
          const hasPriceRange = product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount;

          return (
            <div
              key={product.id}
              className="group flex h-full flex-col border-b border-[var(--line-soft)] pb-5"
            >
              <Link href={`/products/${product.handle}`} className="flex h-full flex-col">
                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--panel2)]">
                  {!product.availableForSale ? (
                    <span className="absolute left-3 top-3 z-10 bg-[rgba(10,10,10,0.86)] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--cream)] backdrop-blur">
                      Ausverkauft
                    </span>
                  ) : null}
                  {product.featuredImage ? (
                    <>
                      <Image
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText ?? product.title}
                        width={900}
                        height={1125}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-70 transition group-hover:opacity-100" />
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[var(--mut)]">Kein Bild</div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-[16px] font-medium leading-snug tracking-[0.035em] text-[var(--cream)] transition group-hover:text-[var(--gold-pale)]">{product.title}</h2>
                    </div>
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[var(--mut)] transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--gold-light)]" aria-hidden="true" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-[var(--gold-light)]">{hasPriceRange ? "Ab " : ""}{formattedPrice}</p>
                </div>
              </Link>

              <button
                type="button"
                disabled={!product.availableForSale}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleOpen(product, event.currentTarget);
                }}
                className="site-button site-button--secondary mt-4 w-full disabled:border-[var(--line-soft)] disabled:text-[var(--text-faint)]"
              >
                <ShoppingBag className="h-4 w-4" />
                {product.availableForSale ? "Schnell hinzufügen" : "Derzeit nicht verfügbar"}
              </button>
            </div>
          );
        })}
      </div>

      {activeProduct ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm sm:p-6" onClick={handleClose}>
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-add-title"
            aria-describedby="quick-add-description"
            className="relative max-h-[calc(100dvh-24px)] w-full max-w-[800px] overflow-y-auto border border-[var(--line)] bg-[var(--panel)] shadow-[0_35px_100px_rgba(0,0,0,0.7)] sm:max-h-[calc(100dvh-48px)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={modalCloseRef}
              type="button"
              onClick={handleClose}
              className="absolute right-0 top-0 z-20 inline-flex h-11 w-11 items-center justify-center border-b border-l border-[var(--line)] bg-[rgba(10,10,10,0.82)] text-[var(--mut)] transition hover:border-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--obsidian)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--gold-light)]"
              aria-label="Schnellauswahl schliessen"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="grid md:grid-cols-[0.92fr_1.08fr]">
              <div className="relative min-h-[220px] overflow-hidden border-b border-[var(--line-soft)] bg-[var(--panel2)] sm:min-h-[260px] md:min-h-[480px] md:border-b-0 md:border-r">
                {activeProduct.featuredImage ? (
                  <Image
                    src={activeProduct.featuredImage.url}
                    alt={activeProduct.featuredImage.altText ?? activeProduct.title}
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
                    {activeProduct.title}
                  </h3>
                  <p id="quick-add-description" className="mt-3 font-display text-xl font-medium text-[var(--gold-light)]">
                    {selectedVariant
                      ? formatMoneyAmount(selectedVariant.price.amount, selectedVariant.price.currencyCode)
                      : formatMoneyAmount(activeProduct.priceRange.minVariantPrice.amount, activeProduct.priceRange.minVariantPrice.currencyCode)}
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
                            const isAvailable = isOptionValueAvailable(
                              activeProduct.variants?.nodes ?? [],
                              selectedOptions,
                              option.name,
                              value,
                            );
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
                  <AddToCartButton selectedVariantId={selectedVariantId} onSuccess={handleClose} />
                  <Link href={`/products/${activeProduct.handle}`} onClick={handleClose} className="group/link inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[var(--line)] px-5 text-[0.68rem] font-medium uppercase tracking-[0.17em] text-[var(--cream)] transition hover:border-[var(--gold)] hover:text-[var(--gold-light)]">
                    Produktdetails ansehen
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" aria-hidden="true" />
                  </Link>
                  <p className="text-center text-[0.68rem] leading-5 text-[var(--mut)]">Sicherer Checkout · Sorgfältig verpackt</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="space-y-4 rounded-[1.75rem] border border-[rgba(201,150,43,0.18)] bg-[var(--panel)] p-4 shadow-[0_18px_60px_-35px_rgba(0,0,0,0.65)]">
          <Skeleton className="aspect-[4/5] rounded-[1.25rem] bg-[var(--panel2)]" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}
