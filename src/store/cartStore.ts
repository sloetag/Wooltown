import { create } from 'zustand';

export interface CartItem {
  id: string; // unique composite key: e.g. "product-id_size_color"
  productId: string; // original product ID
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
  maxStock?: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleCart: () => void;
}

// Safely initial load from local storage
const getInitialCart = (): CartItem[] => {
  try {
    const saved = localStorage.getItem('wooltown_cart');
    if (saved) {
      const parsed: CartItem[] = JSON.parse(saved);
      return parsed.map(i => {
        const max = i.maxStock !== undefined ? i.maxStock : Infinity;
        return { ...i, quantity: Math.min(i.quantity, max) };
      });
    }
    return [];
  } catch {
    return [];
  }
};

export const useCartStore = create<CartState>((set) => ({
  items: getInitialCart(),
  isOpen: false,
  addItem: (newItem) => set((state) => {
    const existing = state.items.find(i => i.id === newItem.id);
    let updatedItems;
    if (existing) {
      updatedItems = state.items.map(i => {
        if (i.id === newItem.id) {
          const newQuantity = i.quantity + (newItem.quantity || 1);
          const max = i.maxStock !== undefined ? i.maxStock : Infinity;
          return { ...i, quantity: Math.min(newQuantity, max) };
        }
        return i;
      });
    } else {
      const max = newItem.maxStock !== undefined ? newItem.maxStock : Infinity;
      updatedItems = [...state.items, { ...newItem, quantity: Math.min(newItem.quantity || 1, max) }];
    }
    localStorage.setItem('wooltown_cart', JSON.stringify(updatedItems));
    return { items: updatedItems };
  }),
  removeItem: (id) => set((state) => {
    const updatedItems = state.items.filter(i => i.id !== id);
    localStorage.setItem('wooltown_cart', JSON.stringify(updatedItems));
    return { items: updatedItems };
  }),
  updateQuantity: (id, quantity) => set((state) => {
    const updatedItems = state.items.map(i => {
      if (i.id === id) {
        const max = i.maxStock !== undefined ? i.maxStock : Infinity;
        return { ...i, quantity: Math.min(quantity, max) };
      }
      return i;
    });
    localStorage.setItem('wooltown_cart', JSON.stringify(updatedItems));
    return { items: updatedItems };
  }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
}));
