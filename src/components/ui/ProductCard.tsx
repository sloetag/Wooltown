import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Product, resolveProductImage } from '../../lib/mockData';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCurrencyStore } from '../../store/currencyStore';

export function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);
  const { formatPrice } = useCurrencyStore();

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block h-full select-none">
      <div className="h-full flex flex-col border border-slate-100 p-4 transition-all duration-500 hover:border-slate-300 bg-white">
        {/* Aspect 4:5 Image Container with Elegant Zoom */}
        <div className="aspect-[3/4] bg-slate-50 overflow-hidden relative mb-6">
          <img 
            src={resolveProductImage(product?.images?.[0])} 
            alt={product?.name} 
            className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-1000 ease-out" 
          />
          {/* Subtle gradient overlay to add contrast to image corners */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <button
            onClick={handleWishlistClick}
            className={`absolute top-4 left-4 p-2.5 bg-white/95 backdrop-blur-md rounded-full shadow-md border ${isWishlisted ? 'border-rose-300 text-rose-500 opacity-100' : 'border-slate-200 text-slate-500 hover:text-slate-900 opacity-100 hover:opacity-100'} z-10 focus:outline-none focus:ring-0 active:scale-95 transition-all duration-300`}
            aria-label="Toggle Wishlist"
          >
            <Heart className="w-4.5 h-4.5" size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>

          
          {/* Quick Info/CTA Badge */}
          <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out flex justify-between items-center bg-white/95 backdrop-blur-md px-4 py-3 border border-slate-150 shadow-sm">
            <span className="text-[10px] font-mono tracking-widest text-slate-900 font-bold uppercase">Discover Form</span>
            <span className="text-[10px] font-mono tracking-widest text-amber-800 font-extrabold uppercase">+</span>
          </div>

          {/* In Stock Pill */}
          {!product.inStock ? (
            <div className="absolute top-4 right-4 bg-slate-900 text-white text-[9px] font-mono tracking-widest uppercase px-3 py-1.5 font-bold">
              Sold Out
            </div>
          ) : (
             <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-700 border border-slate-200 shadow-sm text-[9px] font-mono tracking-widest uppercase px-3 py-1.5 font-bold">
               {product.inventory || 0} Left
             </div>
          )}
        </div>

        {/* Info Layout */}
        <div className="flex flex-col items-start flex-1">
          <div className="w-full flex justify-between items-baseline mb-2">
            <span className="text-[9px] font-mono tracking-[0.2em] text-slate-400 uppercase font-semibold">
              {product.category}
            </span>
          </div>
          
          <h3 className="text-base font-serif font-bold text-slate-900 tracking-tight leading-snug line-clamp-1 mb-2 group-hover:text-slate-600 transition-colors">
            {product.name}
          </h3>
          
          <div className="w-full flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
            <span className="text-sm font-light text-slate-500">
              {product.originalPrice ? (
                <span className="text-[9px] font-mono uppercase bg-amber-400/90 text-slate-950 px-1.5 py-0.5 tracking-wider font-bold select-none rounded-[1px]">
                  Sale
                </span>
              ) : (
                'Price'
              )}
            </span>
            <div className="flex items-center gap-2">
              {product.originalPrice && (
                <span className="text-[11px] line-through text-slate-400 font-mono">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="text-sm font-semibold font-mono text-slate-900 tracking-tight">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
