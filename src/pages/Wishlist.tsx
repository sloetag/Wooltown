import { motion } from 'motion/react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '../store/wishlistStore';
import { ProductCard } from '../components/ui/ProductCard';

export function Wishlist() {
  const { wishlist } = useWishlistStore();

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-12 pb-16 md:pb-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 border-b border-slate-200 pb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight font-medium mb-4 uppercase">
            Curated Wishlist
          </h1>
          <p className="text-sm font-mono text-slate-500 max-w-2xl mx-auto uppercase tracking-widest">
            {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'} Reserved for Future Dispatch
          </p>
        </motion.div>

        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 px-4 mt-8 bg-white border border-slate-200"
          >
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-slate-300" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-serif text-slate-900 tracking-tight mb-2">No Items Wishlisted</h2>
            <p className="text-slate-500 font-sans max-w-md text-center mb-8">
              Your personal curation space is empty. Discover exceptional apparel, footwear, and accessories to build your wishlist.
            </p>
            <Link
              to="/shop"
              className="bg-slate-950 text-white font-mono uppercase tracking-[0.2em] text-[10px] sm:text-xs py-4 px-8 hover:bg-slate-800 transition-colors flex items-center gap-3 font-bold"
            >
              <ShoppingBag className="w-4 h-4" /> Expand Collection
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {wishlist.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
