import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { formatMoney } from "@/lib/format";
import type { CartLine } from "@/lib/shopify/types";
import { isDefaultVariantTitle } from "@/lib/shopify/variants";

type CartDrawerLineProps = {
  line: CartLine;
  isRemoving: boolean;
  onRemove: (lineId: string) => void;
  onNavigate: () => void;
};

export function CartDrawerLine({ line, isRemoving, onRemove, onNavigate }: CartDrawerLineProps) {
  const lineTotal = {
    amount: String(Number(line.merchandise.price.amount) * line.quantity),
    currencyCode: line.merchandise.price.currencyCode,
  };

  return (
    <article className="relative flex gap-4 border-b border-[var(--line-soft)] px-5 py-5 sm:px-6">
      <button
        type="button"
        onClick={() => onRemove(line.id)}
        disabled={isRemoving}
        className="absolute right-5 top-5 inline-flex h-8 w-8 items-center justify-center border border-[var(--line-soft)] text-[var(--mut)] transition hover:border-[var(--gold)] hover:text-[var(--gold-light)] disabled:cursor-wait disabled:opacity-50 sm:right-6"
        aria-label={`${line.merchandise.product.title} aus dem Warenkorb entfernen`}
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>

      <Link href={`/products/${line.merchandise.product.handle}`} onClick={onNavigate} className="h-24 w-24 shrink-0 overflow-hidden border border-[var(--line-soft)] bg-[var(--panel2)]">
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
          <Link href={`/products/${line.merchandise.product.handle}`} onClick={onNavigate} className="line-clamp-2 font-display text-sm font-medium leading-5 tracking-[0.02em] text-[var(--cream)] transition hover:text-[var(--gold-light)]">
            {line.merchandise.product.title}
          </Link>
          {!isDefaultVariantTitle(line.merchandise.title) ? (
            <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[var(--mut)]">{line.merchandise.title}</p>
          ) : null}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <span className="text-sm font-medium text-[var(--gold-light)]">{formatMoney(lineTotal)}</span>
          <span className="text-xs uppercase tracking-[0.12em] text-[var(--mut)]">Menge {line.quantity}</span>
        </div>
      </div>
    </article>
  );
}
