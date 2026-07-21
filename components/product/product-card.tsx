"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/shopify/types";
import { formatMoneyAmount } from "@/lib/format";

type ProductCardProps = {
  product: Product;
  onQuickAdd: (product: Product, trigger: HTMLButtonElement) => void;
};

export function ProductCard({ product, onQuickAdd }: ProductCardProps) {
  const currency = product.priceRange.minVariantPrice.currencyCode;
  const formattedPrice = formatMoneyAmount(product.priceRange.minVariantPrice.amount, currency);
  const hasPriceRange = product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount;

  return (
    <div className="group flex h-full flex-col border-b border-[var(--line-soft)] pb-5">
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
            <h2 className="font-display text-[16px] font-medium leading-snug tracking-[0.035em] text-[var(--cream)] transition group-hover:text-[var(--gold-pale)]">
              {product.title}
            </h2>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[var(--mut)] transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--gold-light)]" aria-hidden="true" />
          </div>
          <p className="mt-3 text-sm font-medium text-[var(--gold-light)]">
            {hasPriceRange ? "Ab " : ""}{formattedPrice}
          </p>
        </div>
      </Link>

      <button
        type="button"
        disabled={!product.availableForSale}
        onClick={(event) => onQuickAdd(product, event.currentTarget)}
        className="site-button site-button--secondary mt-4 w-full disabled:border-[var(--line-soft)] disabled:text-[var(--text-faint)]"
      >
        <ShoppingBag className="h-4 w-4" aria-hidden="true" />
        {product.availableForSale ? "Schnell hinzufügen" : "Derzeit nicht verfügbar"}
      </button>
    </div>
  );
}
