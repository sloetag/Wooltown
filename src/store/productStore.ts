import { create } from 'zustand';
import { mockProducts as initialMockProducts, Product } from '../lib/mockData';

interface ProductState {
  products: Product[];
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  resetAll: () => void;
}

export const useProductStore = create<ProductState>((set) => {
  const stored = localStorage.getItem('wooltown_products');
  let initial = initialMockProducts;
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      let needsMigration = false;
      const migrated = parsed.map((p: any) => {
        if (p.id.startsWith('p_gen_') && p.images?.[0]?.startsWith('http')) {
          needsMigration = true;
          const parts = p.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().split(/\s+/);
          const colorPart = (p.variants?.color?.[0] || 'neutral').toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const finalImage = `${parts.join('-')}-${colorPart}-${p.id.split('_').pop() || '0'}.jpg`;
          return { ...p, images: [finalImage] };
        }
        return p;
      });
      if (needsMigration) {
        initial = migrated;
        localStorage.setItem('wooltown_products', JSON.stringify(migrated));
      } else {
        initial = parsed;
      }
    } catch(e) {
      console.error("Failed to parse products from local storage", e);
    }
  }
  
  return {
    products: initial,
    addProduct: (product) => set((state) => {
      const next = [product, ...state.products];
      localStorage.setItem('wooltown_products', JSON.stringify(next));
      return { products: next };
    }),
    deleteProduct: (id) => set((state) => {
      const next = state.products.filter(p => p.id !== id);
      localStorage.setItem('wooltown_products', JSON.stringify(next));
      return { products: next };
    }),
    updateProduct: (id, update) => set((state) => {
      const next = state.products.map(p => p.id === id ? { ...p, ...update } : p);
      localStorage.setItem('wooltown_products', JSON.stringify(next));
      return { products: next };
    }),
    resetAll: () => set(() => {
      localStorage.removeItem('wooltown_products');
      return { products: initialMockProducts };
    })
  };
});
