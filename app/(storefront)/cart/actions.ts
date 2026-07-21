"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { shopifyClient } from "@/lib/shopify/client";
import { CART_CREATE, CART_LINES_ADD, CART_LINES_REMOVE, CART_LINES_UPDATE } from "@/lib/shopify/mutations";
import type { CartMutationPayload, ShopifyUserError } from "@/lib/shopify/types";

const MAX_CART_QUANTITY = 99;
const PRODUCT_VARIANT_ID_PREFIX = "gid://shopify/ProductVariant/";
const CART_LINE_ID_PREFIX = "gid://shopify/CartLine/";

function validationError(message: string) {
  return { cart: null, userErrors: [{ message }] satisfies ShopifyUserError[] };
}

function isShopifyId(value: unknown, prefix: string): value is string {
  return typeof value === "string" && value.startsWith(prefix) && value.length > prefix.length;
}

function isValidQuantity(quantity: unknown, allowZero = false): quantity is number {
  return Number.isInteger(quantity) && Number(quantity) >= (allowZero ? 0 : 1) && Number(quantity) <= MAX_CART_QUANTITY;
}

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

  const createResult = await shopifyClient.request<{ cartCreate: CartMutationPayload }>(CART_CREATE, {
    lines: [],
  });

  if (createResult.cartCreate.userErrors.length > 0 || !createResult.cartCreate.cart?.id) {
    throw new Error(createResult.cartCreate.userErrors[0]?.message ?? "Der Warenkorb konnte nicht erstellt werden.");
  }

  await setCartIdCookie(createResult.cartCreate.cart.id);
  return createResult.cartCreate.cart.id;
}

export async function addToCart(variantId: string, quantity: number) {
  if (!isShopifyId(variantId, PRODUCT_VARIANT_ID_PREFIX)) {
    return validationError("Bitte wählen Sie eine gültige Produktvariante.");
  }

  if (!isValidQuantity(quantity)) {
    return validationError(`Die Menge muss eine ganze Zahl zwischen 1 und ${MAX_CART_QUANTITY} sein.`);
  }

  const cartId = await ensureCart();
  const result = await shopifyClient.request<{ cartLinesAdd: CartMutationPayload }>(CART_LINES_ADD, {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  });

  if (result.cartLinesAdd.userErrors.length > 0) {
    return { cart: null, userErrors: result.cartLinesAdd.userErrors };
  }

  revalidatePath("/cart");
  return { cart: result.cartLinesAdd.cart, userErrors: [] };
}

export async function updateCartLine(lineId: string, quantity: number) {
  if (!isShopifyId(lineId, CART_LINE_ID_PREFIX)) {
    return validationError("Die ausgewählte Warenkorbposition ist ungültig.");
  }

  if (!isValidQuantity(quantity, true)) {
    return validationError(`Die Menge muss eine ganze Zahl zwischen 0 und ${MAX_CART_QUANTITY} sein.`);
  }

  if (quantity === 0) {
    return removeCartLine(lineId);
  }

  const cartId = await getCartIdCookie();
  if (!cartId) {
    return validationError("Der Warenkorb ist leer.");
  }

  const result = await shopifyClient.request<{ cartLinesUpdate: CartMutationPayload }>(CART_LINES_UPDATE, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });

  if (result.cartLinesUpdate.userErrors.length > 0) {
    return { cart: null, userErrors: result.cartLinesUpdate.userErrors };
  }

  revalidatePath("/cart");
  return { cart: result.cartLinesUpdate.cart, userErrors: [] };
}

export async function removeCartLine(lineId: string) {
  if (!isShopifyId(lineId, CART_LINE_ID_PREFIX)) {
    return validationError("Die ausgewählte Warenkorbposition ist ungültig.");
  }

  const cartId = await getCartIdCookie();
  if (!cartId) {
    return validationError("Der Warenkorb ist leer.");
  }

  const result = await shopifyClient.request<{ cartLinesRemove: CartMutationPayload }>(CART_LINES_REMOVE, {
    cartId,
    lineIds: [lineId],
  });

  if (result.cartLinesRemove.userErrors.length > 0) {
    return { cart: null, userErrors: result.cartLinesRemove.userErrors };
  }

  revalidatePath("/cart");
  return { cart: result.cartLinesRemove.cart, userErrors: [] };
}
