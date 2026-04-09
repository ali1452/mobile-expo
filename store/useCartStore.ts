import { create } from "zustand";
import type { Product } from "@/types/product";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addToCart: (product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find(
        (i) => i.product.product_id === product.product_id,
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.product_id === product.product_id
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          ),
        };
      }
      return { items: [...state.items, { product, quantity }] };
    });
  },

  removeFromCart: (productId) => {
    set((state) => ({
      items: state.items.filter((i) => i.product.product_id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.product.product_id === productId ? { ...i, quantity } : i,
      ),
    }));
  },

  clearCart: () => set({ items: [] }),
}));
