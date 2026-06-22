import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useCurrencyStore } from '../../store/currencyStore';
import { Button } from '../ui/Button';
import { resolveProductImage } from '../../lib/mockData';

export function CartDrawer() {
  const { isOpen, toggleCart, items, updateQuantity, removeItem } = useCartStore();
  const { formatPrice, getVatRate } = useCurrencyStore();
  const navigate = useNavigate();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vatRate = getVatRate();
  const vatAmount = total * vatRate;
  const grandTotal = total + vatAmount;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Your Cart</h2>
              <button onClick={toggleCart} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                  <p>Your cart is empty.</p>
                  <Button variant="outline" onClick={toggleCart}>Continue Shopping</Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <div className="w-20 h-24 bg-[#F7F6F2] border border-slate-200 overflow-hidden flex-shrink-0">
                       {item.image && <img src={resolveProductImage(item.image)} alt={item.name} className="w-full h-full object-cover filter brightness-[98%]" />}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h3 className="font-serif font-bold text-slate-900 text-sm line-clamp-1 flex-1">{item.name}</h3>
                          <p className="font-mono text-xs text-slate-900 font-semibold">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{formatPrice(item.price)}</p>
                        
                        {(item.size || item.color) && (
                          <div className="flex flex-wrap items-center gap-x-2 text-[10px] font-mono font-medium text-slate-500 uppercase mt-1.5 select-none">
                            {item.size && (
                              <span>Size: <span className="text-slate-900 font-extrabold">{item.size}</span></span>
                            )}
                            {item.size && item.color && <span className="text-slate-300">|</span>}
                            {item.color && (
                              <span>Color: <span className="text-slate-900 font-extrabold">{item.color}</span></span>
                            )}
                          </div>
                        )}
                        {item.maxStock !== undefined && item.maxStock <= 5 && (
                          <div className="text-[9px] font-mono font-bold text-amber-600 uppercase mt-1">
                            Only {item.maxStock} pieces left
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-slate-200 bg-white">
                          <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-1 px-2 hover:bg-slate-50 text-slate-500 transition-colors">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-xs font-mono font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                            disabled={item.maxStock !== undefined && item.quantity >= item.maxStock}
                            className="p-1 px-2 hover:bg-slate-50 text-slate-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-600 transition-colors p-1.5 rounded-full hover:bg-red-50/50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
                <div className="flex justify-between text-slate-900 text-sm">
                  <span className="font-medium text-slate-500">Subtotal</span>
                  <span className="font-bold">{formatPrice(total)}</span>
                </div>
                {vatRate > 0 && (
                  <div className="flex justify-between text-slate-900 text-sm">
                    <span className="font-medium text-slate-500">VAT ({(vatRate * 100).toFixed(1)}%)</span>
                    <span className="font-bold">{formatPrice(vatAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-900 border-t border-slate-200 pt-3">
                  <span className="font-serif font-bold tracking-tight">Total</span>
                  <span className="font-bold text-[#705030]">{formatPrice(grandTotal)}</span>
                </div>
                <p className="text-xs text-slate-500">Shipping calculated at checkout.</p>
                <Button onClick={() => {
                  toggleCart();
                  navigate('/checkout');
                }} className="w-full shrink-0">Proceed to Checkout</Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
