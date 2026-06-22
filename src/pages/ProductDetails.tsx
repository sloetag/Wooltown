import { useParams, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import { useCurrencyStore } from '../store/currencyStore';
import { Button } from '../components/ui/Button';
import { PageTransition } from '../components/layout/PageTransition';
import { ShieldAlert, Compass, Hammer, Info, X, Plus, Minus, Heart } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { resolveProductImage } from '../lib/mockData';

// Hex mapper for selected color tags
const getColorHex = (colorName: string): string => {
  const mapping: Record<string, string> = {
    "Smoked Amber": "#C29B38",
    "Charcoal Black": "#1E2221",
    "Oatmeal Melange": "#EADED2",
    "Dark Moss": "#3C4B3E",
    "Raw Indigo": "#223E56",
    "Light Blue Sand": "#A0B5C2",
    "Pure Ivory": "#FDFCF7",
    "Ember Scarlet": "#922C3E",
    "Ash Grey": "#AAA7A1",
    "Camel Tan": "#BF926D",
    "Olive Guard": "#64705C",
    "Midnight Sapphire": "#1B2A41",
  };
  return mapping[colorName] || "#CCCCCC";
};

export function ProductDetails() {
  const { id } = useParams();
  const { products } = useProductStore();
  const product = products.find(p => p.id === id);
  const addItem = useCartStore(state => state.addItem);
  const toggleCart = useCartStore(state => state.toggleCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { formatPrice } = useCurrencyStore();
  
  const [selectedSize, setSelectedSize] = useState<string | null>(product?.variants?.size?.[0] || null);
  const [selectedColor, setSelectedColor] = useState<string | null>(product?.variants?.color?.[0] || null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeGuideTab, setSizeGuideTab] = useState<'apparel' | 'pants' | 'footwear' | 'kids'>('apparel');

  // Low stock calculation based on product ID/name to make it deterministic and consistent
  const stockCount = (product && typeof product.inventory !== 'undefined') ? product.inventory : (product ? (product.name.charCodeAt(0) % 6) + 3 : 5);
  const isLowStock = stockCount <= 5;

  useEffect(() => {
    if (!product) return;
    const sub = product.subCategory?.toLowerCase() || '';
    if (product.category === 'Footwear') {
      setSizeGuideTab('footwear');
    } else if (product.category === 'Kids & Youth') {
      setSizeGuideTab('kids');
    } else if (sub.includes('pants') || sub.includes('trousers') || sub.includes('jeans') || sub.includes('chinos') || sub.includes('culottes')) {
      setSizeGuideTab('pants');
    } else {
      setSizeGuideTab('apparel');
    }
  }, [product]);

  if (!product) return <Navigate to="/shop" />;

  const handleAddToCart = () => {
    // Generate a unique compound item identification
    const compositeId = `${product.id}_${selectedSize || 'OS'}_${selectedColor || 'NoColor'}`;
    addItem({
      id: compositeId,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: resolveProductImage(product?.images?.[0]),
      quantity: quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      maxStock: stockCount
    });
    toggleCart();
  };

  return (
    <PageTransition>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-28 md:pt-32 pb-16 md:pb-24 w-full flex-1 bg-[#FAF9F6]">
        
        {/* Breadcrumb Info Tracker */}
        <div className="flex items-center gap-2 mb-10 font-mono text-[9px] tracking-[0.2em] text-slate-400 uppercase select-none">
          <span>CATALOG</span>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-slate-900 font-bold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Image Showcase Column - Clean Sharp Frame */}
          <div className="lg:col-span-7">
            <div className="aspect-[3/4] bg-[#F7F6F2] overflow-hidden relative border border-slate-200 shadow-sm">
              <img 
                src={resolveProductImage(product?.images?.[0])} 
                alt={product.name} 
                className="object-cover w-full h-full filter brightness-[98%]" 
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay Badge expressing high-standard sourcing */}
              <div className="absolute top-6 left-6 bg-slate-900/90 backdrop-blur-md border border-white/10 text-[9px] font-mono tracking-widest text-white px-4 py-2 uppercase font-bold">
                CORE TRACING: AVAILABLE
              </div>
            </div>
          </div>

          {/* Technical Info Column */}
          <div className="lg:col-span-5 flex flex-col pt-2 justify-center">
            
            {/* Header Data */}
            <div className="border-b border-slate-200 pb-8 mb-8">
              <span className="text-[10px] font-mono tracking-[0.3em] font-extrabold text-amber-800 uppercase block mb-3">
                {product.category} COLLECTION
              </span>
              <h1 className="text-2xl md:text-3xl font-serif tracking-tight text-slate-950 uppercase mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-4 mt-6">
                {product.originalPrice && (
                  <span className="text-lg font-mono tracking-tight line-through text-slate-400">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="text-2xl font-mono tracking-tight font-semibold text-[#705030]">
                  {formatPrice(product.price)}
                </span>
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                  {product.originalPrice ? '[ SPECIAL REGISTRY DISCOUNT ]' : '[ SECURE TRANSACTION ]'}
                </span>
              </div>
            </div>

            {/* Description Description */}
            <p className="text-slate-600 mb-8 leading-relaxed text-base font-light">
              {product.description}
            </p>

            {/* Variant - Colors options */}
            {product.variants?.color && (
              <div className="mb-6">
                <div className="flex justify-between items-baseline mb-3">
                  <h3 className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                    SELECTED COLOR: <span className="text-slate-900 font-bold">{selectedColor}</span>
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.color.map(color => {
                    const hex = getColorHex(color);
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`group relative flex items-center gap-2.5 px-4 py-2 bg-white border rounded-none transition-all duration-300 ${
                          isSelected 
                            ? 'border-slate-950 bg-slate-50' 
                            : 'border-slate-200 text-slate-600 hover:border-slate-400'
                        }`}
                      >
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-slate-900/15 block shrink-0 shadow-inner"
                          style={{ backgroundColor: hex }}
                        />
                        <span className="text-[11px] font-semibold tracking-wider font-sans uppercase">
                          {color}
                        </span>
                        {isSelected && (
                          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-amber-800 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Variant - Sizes options */}
            {product.variants?.size && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                    SIZE: <span className="text-slate-900 font-bold">{selectedSize}</span>
                  </h3>
                  <button 
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="group flex items-center gap-1 font-mono text-[9px] text-[#705030] uppercase tracking-widest font-bold hover:text-slate-950 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span className="underline underline-offset-2">Size Manual &amp; Measurements</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.size.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-12 h-12 flex items-center justify-center px-4 border rounded-none text-xs font-mono font-bold transition-all duration-200 ${
                        selectedSize === size 
                          ? 'border-slate-950 bg-slate-950 text-white' 
                          : 'border-slate-200 text-slate-600 bg-white hover:border-slate-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                
                {/* Fit Guide suggestion text based on selected category */}
                <p className="text-[10px] text-slate-450 italic mt-3 font-sans leading-relaxed text-slate-500">
                  {product.category === 'Footwear' 
                    ? "Fits true to traditional dress sizes. For half sizes, we recommend sizing down."
                    : product.category === 'Kids & Youth'
                    ? "Sized by age averages. For fast-growing kids, choose one range larger."
                    : "Comfortable, uncoerced drape. Buy your regular size, or size down for a slimmer tailoring look."}
                </p>
              </div>
            )}

            {/* Quantity Selector + Stock Warning */}
            <div className="mb-8 border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">QUANTITY</h3>
                
                {/* Micro Stock Status Tracker */}
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${stockCount === 0 ? 'bg-red-600' : isLowStock ? 'bg-amber-600 animate-pulse' : 'bg-green-600'}`} />
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    {stockCount === 0 
                      ? "SOLD OUT" 
                      : isLowStock 
                        ? `LIMITED STOCK: ONLY ${stockCount} PIECES LEFT` 
                        : `${stockCount} AVAILABLE CONTINUOUS STOCK`}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                {/* Custom Quantity Buttons */}
                <div className="flex items-center border border-slate-200 bg-white h-14 shrink-0">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={stockCount === 0}
                    className="w-12 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-mono font-bold select-none text-slate-900">
                    {stockCount === 0 ? 0 : quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(prev => Math.min(stockCount, prev + 1))}
                    disabled={stockCount === 0}
                    className="w-12 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex-1 flex gap-2">
                  <Button 
                    size="lg" 
                    disabled={stockCount === 0}
                    className="w-full bg-slate-950 hover:bg-slate-950/95 text-white rounded-none tracking-[0.2em] uppercase font-bold text-xs h-14 transition-all duration-300 shadow-sm flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed" 
                    onClick={handleAddToCart}
                  >
                    {stockCount === 0 ? 'Out of Stock' : `Add ${quantity > 1 ? '(' + quantity + ')' : ''} To Assembly Bag`}
                  </Button>
                  <Button
                    onClick={() => toggleWishlist(product)}
                    className={`h-14 w-14 shrink-0 rounded-none border transition-all duration-300 shadow-sm flex items-center justify-center bg-white ${
                      isInWishlist(product.id) 
                        ? 'border-rose-200 text-rose-500 hover:bg-rose-50' 
                        : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                    aria-label="Toggle Wishlist"
                  >
                    <Heart className="w-5 h-5" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Extended Brand Warranties specs */}
            <div className="border-t border-slate-200 pt-8 grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Hammer className="w-4 h-4 text-[#705030]" />
                <h4 className="text-[9px] font-mono font-bold text-slate-950 uppercase tracking-widest">Warp &amp; Weave</h4>
                <p className="text-[10px] text-slate-500 font-light leading-snug">Double-locked lock stitch seams</p>
              </div>

              <div className="space-y-2">
                <Compass className="w-4 h-4 text-[#705030]" />
                <h4 className="text-[9px] font-mono font-bold text-slate-950 uppercase tracking-widest">Locality</h4>
                <p className="text-[10px] text-slate-500 font-light leading-snug font-sans">Ethically farmed wool mills</p>
              </div>

              <div className="space-y-2">
                <ShieldAlert className="w-4 h-4 text-[#705030]" />
                <h4 className="text-[9px] font-mono font-bold text-slate-950 uppercase tracking-widest">Thermal</h4>
                <p className="text-[10px] text-slate-500 font-light leading-snug">Unlined native breathability</p>
              </div>
            </div>

            {/* Premium Accordions for Luxury Sourcing Info */}
            <div className="border-t border-slate-200 mt-10 pt-8 space-y-4">
              <details className="group border-b border-slate-200 pb-4 cursor-pointer">
                <summary className="flex items-center justify-between font-mono text-[9px] tracking-widest uppercase font-extrabold text-slate-900 list-none outline-none select-none">
                  <span>Sourcing &amp; Traceability</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform duration-300">&#9662;</span>
                </summary>
                <div className="mt-3 text-xs text-slate-500 font-light font-sans leading-relaxed space-y-2">
                  <p>
                    100% trace-monitored raw materials. Sourced from native micro-farms across Gotland and certified high-altitude family ranches, bypassing toxic high-heat chemical scours.
                  </p>
                  <p className="font-mono text-[9px] text-[#705030] uppercase font-bold">
                    FIELD TRACING INDEX: SWE-4122 / SECURE REGISTRY
                  </p>
                </div>
              </details>

              <details className="group border-b border-slate-200 pb-4 cursor-pointer">
                <summary className="flex items-center justify-between font-mono text-[9px] tracking-widest uppercase font-extrabold text-slate-900 list-none outline-none select-none">
                  <span>Care &amp; Wash Manual</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform duration-300">&#9662;</span>
                </summary>
                <div className="mt-3 text-xs text-slate-500 font-light font-sans leading-relaxed space-y-2">
                  <p>
                    Due to uncoerced protein-safe fibres without high-intensity chemical coats, wash seldom. Lay flat to dry on mesh panels. Hand-wash cold with organic hazelnut oil soap base or standard pH-neutral delicate solutions.
                  </p>
                </div>
              </details>
            </div>

          </div>
        </div>

        {/* Size Manual Modal Overlay */}
        {isSizeGuideOpen && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl rounded-none">
              
              {/* Close Button */}
              <button 
                onClick={() => setIsSizeGuideOpen(false)} 
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 transition-colors outline-none"
                id="close-size-guide-modal"
              >
                <X className="w-5 h-5 text-slate-950" />
              </button>

              {/* Title Header */}
              <div className="border-b border-slate-200 pb-5 mb-6">
                <span className="text-[10px] font-mono tracking-[0.3em] text-[#705030] font-bold uppercase block mb-1">MEASUREMENT REGISTRY</span>
                <h2 className="text-2xl font-serif text-slate-950 uppercase tracking-tight">SIZING &amp; FIT GUIDE</h2>
                <p className="text-slate-400 text-xs font-sans font-light mt-1">Precise physical guidelines to align correctly with European tailored standards.</p>
              </div>

              {/* Guide Tabs */}
              <div className="flex border-b border-slate-200 mb-6 font-mono text-[10px] tracking-wider select-none overflow-x-auto whitespace-nowrap">
                <button 
                  onClick={() => setSizeGuideTab('apparel')}
                  className={`py-3 px-4 border-b-2 uppercase font-extrabold transition-all outline-none ${
                    sizeGuideTab === 'apparel' 
                      ? 'border-slate-950 text-slate-950 bg-slate-50/50' 
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Apparel Base
                </button>
                <button 
                  onClick={() => setSizeGuideTab('pants')}
                  className={`py-3 px-4 border-b-2 uppercase font-extrabold transition-all outline-none ${
                    sizeGuideTab === 'pants' 
                      ? 'border-slate-950 text-slate-950 bg-slate-50/50' 
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Trousers &amp; Pants
                </button>
                <button 
                  onClick={() => setSizeGuideTab('footwear')}
                  className={`py-3 px-4 border-b-2 uppercase font-extrabold transition-all outline-none ${
                    sizeGuideTab === 'footwear' 
                      ? 'border-slate-950 text-slate-950 bg-slate-50/50' 
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Handcrafted Footwear
                </button>
                <button 
                  onClick={() => setSizeGuideTab('kids')}
                  className={`py-3 px-4 border-b-2 uppercase font-extrabold transition-all outline-none ${
                    sizeGuideTab === 'kids' 
                      ? 'border-slate-950 text-slate-950 bg-slate-50/50' 
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Kids &amp; Youth
                </button>
              </div>

              {/* Sizing Tables */}
              <div className="mb-8">
                {sizeGuideTab === 'apparel' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 font-sans leading-relaxed">
                      Our classic tops, heavy knit outerwear, and luxury overcoats are designed with an elegant tailored sweep. Check measurements below:
                    </p>
                    <div className="border border-slate-200 overflow-x-auto">
                      <table className="w-full text-left font-mono text-[11px] border-collapse min-w-[500px]">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50">
                            <th className="py-2.5 px-4 font-bold text-slate-500 uppercase tracking-widest text-[9px]">TAG SIZE</th>
                            <th className="py-2.5 px-4 font-bold text-slate-500 uppercase tracking-widest text-[9px]">CHEST GAP (IN / CM)</th>
                            <th className="py-2.5 px-4 font-bold text-slate-500 uppercase tracking-widest text-[9px]">SLEEVE (IN / CM)</th>
                            <th className="py-2.5 px-4 font-bold text-slate-500 uppercase tracking-widest text-[9px]">EU / IT CODE</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="py-3 px-4 font-bold text-slate-950">S</td>
                            <td className="py-3 px-4 text-slate-600">36 - 38" / 91 - 96 cm</td>
                            <td className="py-3 px-4 text-slate-600">33.5" / 85 cm</td>
                            <td className="py-3 px-4 text-slate-600">46 / IT Small</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-bold text-slate-950">M</td>
                            <td className="py-3 px-4 text-slate-600">39 - 41" / 99 - 104 cm</td>
                            <td className="py-3 px-4 text-slate-600">34.5" / 87 cm</td>
                            <td className="py-3 px-4 text-slate-600">48 / IT Medium</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-bold text-slate-950">L</td>
                            <td className="py-3 px-4 text-slate-600">42 - 44" / 107 - 112 cm</td>
                            <td className="py-3 px-4 text-slate-600">35.5" / 90 cm</td>
                            <td className="py-3 px-4 text-slate-600">50 / IT Large</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-bold text-slate-950">XL</td>
                            <td className="py-3 px-4 text-slate-600">45 - 47" / 114 - 119 cm</td>
                            <td className="py-3 px-4 text-slate-600">36.5" / 93 cm</td>
                            <td className="py-3 px-4 text-slate-600">52 / IT Extra Large</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {sizeGuideTab === 'pants' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 font-sans leading-relaxed">
                      Our custom selvedge denim and flannel trousers feature custom waist rises. Measured flat straight around:
                    </p>
                    <div className="border border-slate-200 overflow-x-auto">
                      <table className="w-full text-left font-mono text-[11px] border-collapse min-w-[500px]">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50">
                            <th className="py-2.5 px-4 font-bold text-slate-500 uppercase tracking-widest text-[9px]">TAG SIZE</th>
                            <th className="py-2.5 px-4 font-bold text-slate-500 uppercase tracking-widest text-[9px]">WAIST (IN / CM)</th>
                            <th className="py-2.5 px-4 font-bold text-slate-500 uppercase tracking-widest text-[9px]">INSEAM (IN / CM)</th>
                            <th className="py-2.5 px-4 font-bold text-slate-500 uppercase tracking-widest text-[9px]">EUROPE BOUND</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="py-3 px-4 font-bold text-slate-950">30</td>
                            <td className="py-3 px-4 text-slate-600">30" / 76 cm</td>
                            <td className="py-3 px-4 text-slate-600">32" / 81 cm</td>
                            <td className="py-3 px-4 text-slate-600">EU 46</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-bold text-slate-950">32</td>
                            <td className="py-3 px-4 text-slate-600">32" / 81 cm</td>
                            <td className="py-3 px-4 text-slate-600">32" / 81 cm</td>
                            <td className="py-3 px-4 text-slate-600">EU 48</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-bold text-slate-950">34</td>
                            <td className="py-3 px-4 text-slate-600">34" / 86 cm</td>
                            <td className="py-3 px-4 text-slate-600">32" / 81 cm</td>
                            <td className="py-3 px-4 text-slate-600">EU 50</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-bold text-slate-950">36</td>
                            <td className="py-3 px-4 text-slate-600">36" / 91 cm</td>
                            <td className="py-3 px-4 text-slate-600">32" / 81 cm</td>
                            <td className="py-3 px-4 text-slate-600">EU 52</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {sizeGuideTab === 'footwear' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 font-sans leading-relaxed">
                      Premium whole-grain and cordovan footwear. Sized matching US metrics with international equivalents:
                    </p>
                    <div className="border border-slate-200 overflow-x-auto">
                      <table className="w-full text-left font-mono text-[11px] border-collapse min-w-[500px]">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50">
                            <th className="py-2.5 px-4 font-bold text-slate-500 uppercase tracking-widest text-[9px]">US SIZE</th>
                            <th className="py-2.5 px-4 font-bold text-slate-500 uppercase tracking-widest text-[9px]">EU SIZE</th>
                            <th className="py-2.5 px-4 font-bold text-slate-500 uppercase tracking-widest text-[9px]">UK SIZE</th>
                            <th className="py-2.5 px-4 font-bold text-slate-500 uppercase tracking-widest text-[9px]">FOOT DEPTH (IN / CM)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="py-3 px-4 font-bold text-slate-950">8</td>
                            <td className="py-3 px-4 text-slate-600">41</td>
                            <td className="py-3 px-4 text-slate-600">7</td>
                            <td className="py-3 px-4 text-slate-600">10.0" / 25.4 cm</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-bold text-slate-950">9</td>
                            <td className="py-3 px-4 text-slate-600">42</td>
                            <td className="py-3 px-4 text-slate-600">8</td>
                            <td className="py-3 px-4 text-slate-600">10.3" / 26.2 cm</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-bold text-slate-950">10</td>
                            <td className="py-3 px-4 text-slate-600">43</td>
                            <td className="py-3 px-4 text-slate-600">9</td>
                            <td className="py-3 px-4 text-slate-600">10.6" / 27.0 cm</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-bold text-slate-950">11</td>
                            <td className="py-3 px-4 text-slate-600">44</td>
                            <td className="py-3 px-4 text-slate-600">10</td>
                            <td className="py-3 px-4 text-slate-600">11.0" / 27.9 cm</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-bold text-slate-950">12</td>
                            <td className="py-3 px-4 text-slate-600">45</td>
                            <td className="py-3 px-4 text-slate-600">11</td>
                            <td className="py-3 px-4 text-slate-600">11.3" / 28.7 cm</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {sizeGuideTab === 'kids' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 font-sans leading-relaxed">
                      Sized for comfortable movement. If child is between age groups, select the higher tier:
                    </p>
                    <div className="border border-slate-200 overflow-x-auto">
                      <table className="w-full text-left font-mono text-[11px] border-collapse min-w-[500px]">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50">
                            <th className="py-2.5 px-4 font-bold text-slate-500 uppercase tracking-widest text-[9px]">AGE RANGE</th>
                            <th className="py-2.5 px-4 font-bold text-slate-500 uppercase tracking-widest text-[9px]">HEIGHT (IN / CM)</th>
                            <th className="py-2.5 px-4 font-bold text-slate-500 uppercase tracking-widest text-[9px]">WEIGHT EXP (LBS / KG)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="py-3 px-4 font-bold text-slate-950">3-6m</td>
                            <td className="py-3 px-4 text-slate-600">24" - 26" / 61 - 66 cm</td>
                            <td className="py-3 px-4 text-slate-600">12 - 17 lbs / 5.5 - 7.7 kg</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-bold text-slate-950">6-12m</td>
                            <td className="py-3 px-4 text-slate-600">26" - 29" / 66 - 74 cm</td>
                            <td className="py-3 px-4 text-slate-600">17 - 22 lbs / 7.7 - 10 kg</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-bold text-slate-950">12-18m</td>
                            <td className="py-3 px-4 text-slate-600">29" - 31" / 74 - 79 cm</td>
                            <td className="py-3 px-4 text-slate-600">22 - 27 lbs / 10 - 12.2 kg</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-bold text-slate-950">2T</td>
                            <td className="py-3 px-4 text-slate-600">33" - 35" / 84 - 89 cm</td>
                            <td className="py-3 px-4 text-slate-600">27 - 30 lbs / 12.2 - 13.6 kg</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-bold text-slate-950">3T</td>
                            <td className="py-3 px-4 text-slate-600">35" - 38" / 89 - 97 cm</td>
                            <td className="py-3 px-4 text-slate-600">30 - 33 lbs / 13.6 - 15 kg</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions on how to measure */}
              <div className="bg-[#FAF9F6] border border-slate-200 p-6">
                <span className="text-[9px] font-mono font-extrabold text-[#705030] tracking-widest block mb-2">HOW TO OBTAIN PHYSICAL DIMENSIONS</span>
                <ul className="text-[11px] text-slate-500 font-sans space-y-2.5 list-none p-0 m-0">
                  <li className="flex gap-2">
                    <span className="font-mono text-[#705030] font-bold">[1]</span>
                    <span><strong>CHEST BOUND:</strong> Keep the measure tape loose and flat straight across the widest perimeter of your upper chest.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-mono text-[#705030] font-bold">[2]</span>
                    <span><strong>WAIST ALIGNMENT:</strong> Bend slightly to the side to locate your natural crease, and wrap exactly without binding.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-mono text-[#705030] font-bold">[3]</span>
                    <span><strong>STATIONARY FOOT:</strong> Draw your contour barefoot onto paper. Measure the extreme heel point up to the tip of your tallest toe.</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        )}

      </div>
    </PageTransition>
  );
}
