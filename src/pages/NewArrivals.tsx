import { useProductStore } from '../store/productStore';
import { ProductCard } from '../components/ui/ProductCard';
import { PageTransition } from '../components/layout/PageTransition';
import { motion } from 'motion/react';

export function NewArrivals() {
  const { products } = useProductStore();
  // Filter products by p_add, p_hb, p_gm, p_bk, p_sp or just show some of our exquisite newly released items
  const newItems = products.filter(p => 
    p.id.startsWith('p_add_') || 
    p.id.startsWith('p_hb_') || 
    p.id.startsWith('p_gm_') || 
    p.id.startsWith('p_bk_') || 
    p.id.startsWith('p_sp_')
  ).slice(0, 12); // Show top 12 curated new arrivals

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-16 md:pb-24 w-full flex-1 bg-white">
        
        {/* Editorial Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-150 text-[#705030] border border-amber-200">
            <span className="text-[9px] font-mono tracking-[0.25em] uppercase font-bold">LATEST DISCOVERIES</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-slate-900 uppercase">
            New Arrivals
          </h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest leading-relaxed">
            A meticulous assembly of raw linens, precision sensory gadgets, and structural art designed for the modern purist. Released Summer 2026.
          </p>
        </div>

        {/* Dynamic Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {newItems.map(product => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* Minimalist Editorial Banner */}
        <div className="mt-20 border border-slate-150 p-8 md:p-12 bg-slate-50 text-slate-900 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
              THE DESIGN INTEGRITY
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-950 uppercase tracking-tight">
              Ethical sourcing from field to form.
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-light">
              Every fiber undergoes rigorous trace processing. From loose-weave Peruvian alpaca herds to hand-placed Japanese selvedge shuttle looms, Wooltown products emerge through deep, honest partnerships.
            </p>
          </div>
          <div className="h-64 bg-slate-200 overflow-hidden border border-slate-300">
            <img 
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800"
              alt="Artisanal processing lines"
              className="w-full h-full object-cover grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
