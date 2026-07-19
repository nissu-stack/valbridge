import { create } from "zustand";
import type { Cart } from "@/lib/shopify/types";

type CartDrawerStore = {
  isOpen: boolean;
  cart: Cart | null;
  cartCount: number;
  openDrawer: () => void;
  closeDrawer: () => void;
  setCart: (cart: Cart | null) => void;
};

export const useCartDrawerStore = create<CartDrawerStore>((set) => ({
  isOpen: false,
  cart: null,
  cartCount: 0,
  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),
  setCart: (cart) => set({ cart, cartCount: cart?.totalQuantity ?? 0 }),
}));
