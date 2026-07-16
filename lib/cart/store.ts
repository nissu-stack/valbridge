import { create } from "zustand";

type CartDrawerStore = {
  isOpen: boolean;
  cartCount: number;
  optimisticQuantity: number;
  openDrawer: () => void;
  closeDrawer: () => void;
  setCartCount: (quantity: number) => void;
  setOptimisticQuantity: (quantity: number) => void;
};

export const useCartDrawerStore = create<CartDrawerStore>((set) => ({
  isOpen: false,
  cartCount: 0,
  optimisticQuantity: 0,
  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),
  setCartCount: (quantity: number) => set({ cartCount: quantity }),
  setOptimisticQuantity: (quantity: number) => set({ optimisticQuantity: quantity }),
}));
