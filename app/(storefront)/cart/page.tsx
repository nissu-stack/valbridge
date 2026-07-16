import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { shopifyClient } from "@/lib/shopify/client";
import { CART_QUERY } from "@/lib/shopify/queries";
import { removeCartLine, updateCartLine } from "@/app/(storefront)/cart/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CartQueryData } from "@/lib/shopify/types";

export const dynamic = "force-dynamic";

async function getCartFromShopify() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  if (!cartId) {
    return null;
  }

  try {
    const data = await shopifyClient.request<CartQueryData>(CART_QUERY, { cartId });
    return data.cart;
  } catch {
    return null;
  }
}

export default async function CartPage() {
  const cart = await getCartFromShopify();

  if (!cart || cart.lines.nodes.length === 0) {
    return (
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <Badge className="bg-zinc-100 text-zinc-700">Your bag</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">Your cart is ready when you are</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-600 sm:text-base">
            Save your favorites and continue shopping whenever you are ready.
          </p>
          <Link href="/collections" className="mt-6 inline-flex">
            <Button>Browse collections</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <Badge className="bg-zinc-100 text-zinc-700">Your bag</Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Your cart</h1>
        <p className="text-sm text-zinc-600 sm:text-base">{cart.totalQuantity} item{cart.totalQuantity === 1 ? "" : "s"} saved for checkout.</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4">
          {cart.lines.nodes.map((line) => (
            <div key={line.id} className="flex flex-col gap-4 rounded-[1.5rem] border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
              <div className="h-24 w-full overflow-hidden rounded-2xl bg-zinc-50 sm:w-24">
                {line.merchandise.image ? (
                  <Image
                    src={line.merchandise.image.url}
                    alt={line.merchandise.image.altText ?? line.merchandise.product.title}
                    width={240}
                    height={240}
                    sizes="96px"
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-medium text-zinc-950">{line.merchandise.product.title}</p>
                    <p className="text-sm text-zinc-500">{line.merchandise.title}</p>
                  </div>
                  <p className="text-sm font-semibold text-zinc-900">{line.merchandise.price.amount} {line.merchandise.price.currencyCode}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <form action={async () => {
                    'use server';
                    const result = await updateCartLine(line.id, line.quantity - 1);
                    if (result.userErrors?.length) {
                      return;
                    }
                    revalidatePath('/cart');
                  }}>
                    <button type="submit" className="rounded-full border border-zinc-300 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50">
                      −
                    </button>
                  </form>
                  <span className="min-w-8 text-center text-sm font-semibold text-zinc-900">{line.quantity}</span>
                  <form action={async () => {
                    'use server';
                    const result = await updateCartLine(line.id, line.quantity + 1);
                    if (result.userErrors?.length) {
                      return;
                    }
                    revalidatePath('/cart');
                  }}>
                    <button type="submit" className="rounded-full border border-zinc-300 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50">
                      +
                    </button>
                  </form>
                  <form action={async () => {
                    'use server';
                    await removeCartLine(line.id);
                    revalidatePath('/cart');
                  }}>
                    <button type="submit" className="rounded-full border border-zinc-200 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50">
                      Remove
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="rounded-[1.75rem] border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-950">Order summary</h2>
          <div className="mt-5 space-y-3 text-sm text-zinc-700">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{cart.cost.subtotalAmount.amount} {cart.cost.subtotalAmount.currencyCode}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Estimated tax</span>
              <span>{cart.cost.totalTaxAmount?.amount ?? "0.00"} {cart.cost.totalTaxAmount?.currencyCode ?? cart.cost.subtotalAmount.currencyCode}</span>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-200 pt-3 text-base font-semibold text-zinc-950">
              <span>Total</span>
              <span>{cart.cost.totalAmount.amount} {cart.cost.totalAmount.currencyCode}</span>
            </div>
          </div>
          <a href={cart.checkoutUrl} className="mt-6 block">
            <Button className="w-full">Checkout securely</Button>
            <p className="mt-2 text-center text-xs uppercase tracking-[0.2em] text-zinc-500">Redirecting to secure checkout</p>
          </a>
        </aside>
      </div>
    </main>
  );
}
