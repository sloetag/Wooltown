import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../lib/mockData';

interface WishlistState {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      toggleWishlist: (product: Product) => {
        const { wishlist } = get();
        const exists = wishlist.find(p => p.id === product.id);
        if (exists) {
          set({ wishlist: wishlist.filter(p => p.id !== product.id) });
        } else {
          set({ wishlist: [...wishlist, product] });
        }
      },
      isInWishlist: (productId: string) => {
        return get().wishlist.some(p => p.id === productId);
      }
    }),
    {
      name: 'wooltown-wishlist-storage',
    }
  )
);
