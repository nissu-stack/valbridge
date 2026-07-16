"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";
import type { Product } from "@/lib/shopify/types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AddToCartButton } from "@/components/product/add-to-cart-button";

type ProductGridProps = {
  products: Product[];
};

function formatPrice(amount: string, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

function getPlainText(value?: string | null) {
  return value ? value.replace(/<[^>]+>/g, "").trim() : "";
}

function getInitialSelections(product: Product) {
  return Object.fromEntries((product.options ?? []).map((option) => [option.name, option.values[0] ?? ""]));
}

export function ProductGrid({ products }: ProductGridProps) {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeProduct) {
      setSelectedVariantId(null);
      return;
    }

    const matchingVariant = activeProduct.variants?.nodes.find((variant) =>
      variant.selectedOptions.every((option) => selectedOptions[option.name] === option.value),
    );

    setSelectedVariantId(matchingVariant?.id ?? null);
  }, [activeProduct, selectedOptions]);

  const handleOpen = (product: Product) => {
    setActiveProduct(product);
    setSelectedOptions(getInitialSelections(product));
    setSelectedVariantId(product.variants?.nodes[0]?.id ?? null);
  };

  const handleClose = () => {
    setActiveProduct(null);
    setSelectedOptions({});
    setSelectedVariantId(null);
  };

  const handleSelectOption = (name: string, value: string) => {
    setSelectedOptions((current) => ({ ...current, [name]: value }));
  };


  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => {
          const price = Number(product.priceRange.minVariantPrice.amount);
          const currency = product.priceRange.minVariantPrice.currencyCode;
          const formattedPrice = formatPrice(product.priceRange.minVariantPrice.amount, currency);

          return (
            <div
              key={product.id}
              className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-[var(--line)] bg-[var(--panel)] transition duration-300 hover:-translate-y-1 hover:border-[var(--line-bright)]"
            >
              <Link href={`/products/${product.handle}`} className="flex h-full flex-col">
                <div className="relative aspect-square overflow-hidden bg-[var(--panel2)]">
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-[var(--cream)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--obsidian)]">
                    New
                  </span>
                  <span className="absolute right-3 top-3 z-10 rounded-full bg-[rgba(11,10,8,0.65)] px-2.5 py-1 text-[11px] font-semibold text-[var(--gold-bright)] backdrop-blur">
                    {formattedPrice}
                  </span>
                  {product.featuredImage ? (
                    <>
                      <Image
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText ?? product.title}
                        width={900}
                        height={1125}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[var(--mut)]">No image</div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="mb-3 text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)]">Maison Valbridge</div>
                    <h2 className="font-display text-[17px] font-semibold leading-tight text-[var(--cream)]">{product.title}</h2>
                  </div>
                  <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--gold)]">
                    View details →
                  </div>
                </div>
              </Link>

              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleOpen(product);
                }}
                className="mx-5 mb-5 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--cream)] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--obsidian)] transition duration-300 hover:bg-gradient-to-r hover:from-[var(--gold-light)] hover:via-[var(--gold)] hover:to-[var(--gold-deep)] hover:text-[var(--obsidian)] hover:shadow-[0_10px_35px_rgba(201,150,43,0.25)]"
              >
                <ShoppingBag className="h-4 w-4" />
                Quick add
              </button>
            </div>
          );
        })}
      </div>

      {activeProduct ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={handleClose}>
          <div className="w-full max-w-2xl rounded-[24px] border border-[var(--line)] bg-[var(--panel)] p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-faint)]">Quick add</p>
                <h3 className="font-display mt-2 text-[24px] font-semibold text-[var(--cream)]">{activeProduct.title}</h3>
              </div>
              <button type="button" onClick={handleClose} className="rounded-full border border-[var(--line)] p-2 text-[var(--mut)] transition hover:border-[var(--gold)] hover:text-[var(--cream)]">
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
                          ? formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)
                          : formatPrice(activeProduct.priceRange.minVariantPrice.amount, activeProduct.priceRange.minVariantPrice.currencyCode);
                      })() : formatPrice(activeProduct.priceRange.minVariantPrice.amount, activeProduct.priceRange.minVariantPrice.currencyCode)}
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
                            return (
                              <button
                                key={value}
                                type="button"
                                onClick={() => handleSelectOption(option.name, value)}
                                className={`rounded-full border px-3 py-2 text-sm transition ${isSelected ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--obsidian)]" : "border-[var(--line)] text-[var(--mut)] hover:border-[var(--gold)] hover:text-[var(--cream)]"}`}
                              >
                                {value}
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
