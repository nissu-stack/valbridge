import type { Money } from "@/lib/shopify/types";

export function formatMoney(money: Money, locale = "de-CH") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currencyCode,
    currencyDisplay: "narrowSymbol",
  }).format(Number(money.amount));
}

export function formatMoneyAmount(amount: string, currencyCode: string, locale = "de-CH") {
  return formatMoney({ amount, currencyCode }, locale);
}
