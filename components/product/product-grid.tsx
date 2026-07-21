"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShoppingBag, X } from "lucide-react";
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
                      Sold out
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
                    <div className="flex h-full items-center justify-center text-sm text-[var(--mut)]">No image</div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-[16px] font-medium leading-snug tracking-[0.035em] text-[var(--cream)] transition group-hover:text-[var(--gold-pale)]">{product.title}</h2>
                    </div>
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[var(--mut)] transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--gold-light)]" aria-hidden="true" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-[var(--gold-light)]">{hasPriceRange ? "From " : ""}{formattedPrice}</p>
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
                {product.availableForSale ? "Quick add" : "Currently unavailable"}
              </button>
            </div>
          );
        })}
      </div>

      {activeProduct ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={handleClose}>
          <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="quick-add-title" className="w-full max-w-2xl rounded-[24px] border border-[var(--line)] bg-[var(--panel)] p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-faint)]">Quick add</p>
                <h3 id="quick-add-title" className="font-display mt-2 text-[24px] font-semibold text-[var(--cream)]">{activeProduct.title}</h3>
              </div>
              <button ref={modalCloseRef} type="button" onClick={handleClose} className="border border-[var(--line)] p-2 text-[var(--mut)] transition hover:border-[var(--gold)] hover:text-[var(--cream)]" aria-label="Close quick add">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-[0.95fr_1.05fr]">
              <div className="relative overflow-hidden rounded-[18px] border border-[var(--line)] bg-[var(--panel2)]">
                {activeProduct.featuredImage ? (
                  <Image
                    src={activeProduct.featuredImage.url}
                    alt={activeProduct.featuredImage.altText ?? activeProduct.title}
                    width={900}
                    height={1125}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-72 items-center justify-center text-sm text-[var(--mut)]">No image</div>
                )}
              </div>

              <div className="space-y-5">
                <div className="rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.03)] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[var(--cream)]">Selected price</p>
                    <p className="text-sm font-semibold text-[var(--gold-bright)]">
                      {selectedVariantId ? (() => {
                        const selectedVariant = activeProduct.variants?.nodes.find((variant) => variant.id === selectedVariantId);
                        return selectedVariant
                          ? formatMoneyAmount(selectedVariant.price.amount, selectedVariant.price.currencyCode)
                          : formatMoneyAmount(activeProduct.priceRange.minVariantPrice.amount, activeProduct.priceRange.minVariantPrice.currencyCode);
                      })() : formatMoneyAmount(activeProduct.priceRange.minVariantPrice.amount, activeProduct.priceRange.minVariantPrice.currencyCode)}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-[var(--mut)]">
                    {activeProduct.variants?.nodes.some((variant) => variant.id === selectedVariantId && !variant.availableForSale) ? "Currently unavailable" : selectedVariantId ? "Ready to add to cart" : "Choose the available options to continue"}
                  </p>
                  {activeProduct.options?.length ? (
                    <div className="mt-3 text-sm text-[var(--mut)]">
                      <span className="font-semibold text-[var(--cream)]">Selection:</span>{" "}
                      {activeProduct.options.map((option) => selectedOptions[option.name] ? `${option.name}: ${selectedOptions[option.name]}` : `${option.name}: —`).join(" • ")}
                    </div>
                  ) : null}
                </div>

                {activeProduct.options?.length ? (
                  <div className="space-y-4">
                    {activeProduct.options.map((option) => (
                      <div key={option.name}>
                        <p className="mb-2 text-sm font-semibold text-[var(--cream)]">{option.name}</p>
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
                                className={`border px-3 py-2 text-sm transition ${isSelected ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--obsidian)]" : "border-[var(--line)] text-[var(--mut)] hover:border-[var(--gold)] hover:text-[var(--cream)]"} disabled:cursor-not-allowed disabled:opacity-45`}
                              >
                                {value}{!isAvailable ? " (Sold out)" : ""}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="space-y-3">
                  <AddToCartButton selectedVariantId={selectedVariantId} />
                  <Link href={`/products/${activeProduct.handle}`} onClick={handleClose} className="inline-flex text-sm font-semibold uppercase tracking-[0.16em] text-[var(--gold-bright)]">
                    View full product →
                  </Link>
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
