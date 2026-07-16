"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { shopifyClient } from "@/lib/shopify/client";
import { CART_CREATE, CART_LINES_ADD, CART_LINES_REMOVE, CART_LINES_UPDATE } from "@/lib/shopify/mutations";
import { CART_QUERY } from "@/lib/shopify/queries";
import type { CartQueryData } from "@/lib/shopify/types";

async function getCartIdCookie() {
  const cookieStore = await cookies();
  return cookieStore.get("cartId")?.value ?? null;
}

async function setCartIdCookie(cartId: string) {
  const cookieStore = await cookies();
  cookieStore.set("cartId", cartId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

async function ensureCart() {
  const existingCartId = await getCartIdCookie();

  if (existingCartId) {
    return existingCartId;
  }

  const createResult = await shopifyClient.request<{ cartCreate: { cart: { id: string } | null; userErrors: Array<{ field?: string[]; message: string }> } }>(CART_CREATE, {
    lines: [],
  });

  if (createResult.cartCreate.userErrors.length > 0 || !createResult.cartCreate.cart?.id) {
    throw new Error(createResult.cartCreate.userErrors[0]?.message ?? "Unable to create cart.");
  }

  await setCartIdCookie(createResult.cartCreate.cart.id);
  return createResult.cartCreate.cart.id;
}

export async function addToCart(variantId: string, quantity: number) {
  const cartId = await ensureCart();
  const result = await shopifyClient.request<{ cartLinesAdd: { cart: { id: string } | null; userErrors: Array<{ field?: string[]; message: string }> } }>(CART_LINES_ADD, {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  });

  if (result.cartLinesAdd.userErrors.length > 0) {
    return { userErrors: result.cartLinesAdd.userErrors };
  }

  revalidatePath("/cart");
  return { cart: result.cartLinesAdd.cart };
}

export async function updateCartLine(lineId: string, quantity: number) {
  const cartId = await getCartIdCookie();
  if (!cartId) {
    return { userErrors: [{ message: "The cart is empty." }] };
  }

  const result = await shopifyClient.request<{ cartLinesUpdate: { cart: { id: string } | null; userErrors: Array<{ field?: string[]; message: string }> } }>(CART_LINES_UPDATE, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });

  if (result.cartLinesUpdate.userErrors.length > 0) {
    return { userErrors: result.cartLinesUpdate.userErrors };
  }

  revalidatePath("/cart");
  return { cart: result.cartLinesUpdate.cart };
}

export async function removeCartLine(lineId: string) {
  const cartId = await getCartIdCookie();
  if (!cartId) {
    return { userErrors: [{ message: "The cart is empty." }] };
  }

  const result = await shopifyClient.request<{ cartLinesRemove: { cart: { id: string } | null; userErrors: Array<{ field?: string[]; message: string }> } }>(CART_LINES_REMOVE, {
    cartId,
    lineIds: [lineId],
  });

  if (result.cartLinesRemove.userErrors.length > 0) {
    return { userErrors: result.cartLinesRemove.userErrors };
  }

  revalidatePath("/cart");
  return { cart: result.cartLinesRemove.cart };
}
