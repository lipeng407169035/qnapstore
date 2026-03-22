'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, User } from '@/types';

interface WishlistItem {
  productId: string;
  product: Product;
  addedAt: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        if (get().isInWishlist(product.id)) return;
        set({ items: [...get().items, { productId: product.id, product, addedAt: new Date().toISOString() }] });
      },
      removeItem: (productId) => {
        set({ items: get().items.filter(i => i.productId !== productId) });
      },
      isInWishlist: (productId) => get().items.some(i => i.productId === productId),
      getCount: () => get().items.length,
    }),
    { name: 'qnap-wishlist' }
  )
);

interface RecentlyViewedStore {
  items: Product[];
  addItem: (product: Product) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const filtered = get().items.filter(i => i.id !== product.id);
        set({ items: [product, ...filtered].slice(0, 12) });
      },
      clear: () => set({ items: [] }),
    }),
    { name: 'qnap-recent' }
  )
);

interface PointsStore {
  points: number;
  history: { amount: number; reason: string; date: string }[];
  addPoints: (amount: number, reason: string) => void;
  deductPoints: (amount: number, reason: string) => boolean;
}

export const usePointsStore = create<PointsStore>()(
  persist(
    (set, get) => ({
      points: 0,
      history: [],
      addPoints: (amount, reason) => {
        set({ points: get().points + amount, history: [{ amount, reason, date: new Date().toISOString() }, ...get().history] });
      },
      deductPoints: (amount, reason) => {
        if (get().points < amount) return false;
        set({ points: get().points - amount, history: [{ amount: -amount, reason, date: new Date().toISOString() }, ...get().history] });
        return true;
      },
    }),
    { name: 'qnap-points' }
  )
);

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find((item) => item.productId === product.id);
        if (existing) {
          set({
            items: items.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: `temp-${Date.now()}`,
                userId: null,
                productId: product.id,
                quantity,
                product,
              },
            ],
          });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.productId !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
        } else {
          set({
            items: get().items.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            ),
          });
        }
      },
      clearCart: () => set({ items: [] }),
      getTotal: () =>
        get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      getCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: 'qnap-cart' }
  )
);

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    { name: 'qnap-user' }
  )
);
