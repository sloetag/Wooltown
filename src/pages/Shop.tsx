import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockCategories, mockSubCategories } from '../lib/mockData';
import { useProductStore } from '../store/productStore';
import { useCurrencyStore } from '../store/currencyStore';
import { ProductCard } from '../components/ui/ProductCard';
import { PageTransition } from '../components/layout/PageTransition';
import { motion, AnimatePresence } from 'motion/react';

export function Shop() {
  const { products } = useProductStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  const urlCategory = searchParams.get('category');

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>('All');

  // Keep state in sync if URL search param changes
  useEffect(() => {
    if (urlCategory) {
      setCategoryFilter(urlCategory);
      setSubCategoryFilter('All');
    } else {
      setCategoryFilter('All');
      setSubCategoryFilter('All');
    }
  }, [urlCategory]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 24;

  const highestPrice = Math.ceil(Math.max(...products.map((p) => p.price), 0));
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(highestPrice > 0 ? highestPrice : 2000);

  const handleCategoryChange = (cat: string) => {
    setCategoryFilter(cat);
    setSubCategoryFilter('All');
    setCurrentPage(1);
    
    // Update URL parameter
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleSubCategoryChange = (subCat: string) => {
    setSubCategoryFilter(subCat);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, minPrice, maxPrice]);

  const displayedProducts = products.filter(p => {
    // Category match
    const matchesCategory = categoryFilter === 'All' ? true : p.category === categoryFilter;
    
    // Subcategory match
    const matchesSubCategory = subCategoryFilter === 'All' ? true : p.subCategory === subCategoryFilter;
    
    // Search query match
    const matchesSearch = searchQuery 
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
      
    // Price match
    const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
      
    return matchesCategory && matchesSubCategory && matchesSearch && matchesPrice;
  });

  const totalPages = Math.ceil(displayedProducts.length / itemsPerPage);
  const paginatedProducts = displayedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const activeSubCategories = categoryFilter !== 'All' ? mockSubCategories[categoryFilter] || [] : [];

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-12 w-full flex-1 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6 border-b border-slate-100 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-slate-900 uppercase">
              {searchQuery ? 'Search Results' : 'Collection'}
            </h1>
            <p className="text-slate-500 mt-4 uppercase tracking-widest text-xs font-mono">
              {searchQuery ? `Showing results for "${searchQuery}"` : `Explore our curated selection of ${categoryFilter.toLowerCase()} lifeware.`}
            </p>
          </div>
          
          {/* Main Category Filter Row */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => handleCategoryChange('All')}
              className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all duration-300 border ${categoryFilter === 'All' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-transparent border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-400'}`}
            >
              All
            </button>
            {mockCategories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all duration-300 border ${categoryFilter === cat ? 'bg-slate-900 border-slate-900 text-white' : 'bg-transparent border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-400'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Subsection (Subcategory) Filter Row */}
        <AnimatePresence mode="wait">
          {categoryFilter !== 'All' && activeSubCategories.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 mb-10 pb-6 border-b border-dashed border-slate-100 flex-wrap"
            >
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 mr-2">Subsections:</span>
              <button
                onClick={() => handleSubCategoryChange('All')}
                className={`px-3 py-1.5 text-[9px] font-mono tracking-widest uppercase transition-all duration-200 border ${subCategoryFilter === 'All' ? 'bg-amber-100/60 border-amber-300 text-amber-950 font-bold' : 'bg-slate-50/50 border-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                All {categoryFilter}
              </button>
              {activeSubCategories.map(subCat => (
                <button
                  key={subCat}
                  onClick={() => handleSubCategoryChange(subCat)}
                  className={`px-3 py-1.5 text-[9px] font-mono tracking-widest uppercase transition-all duration-200 border ${subCategoryFilter === subCat ? 'bg-amber-100/60 border-amber-300 text-amber-950 font-bold' : 'bg-slate-50/50 border-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                >
                  {subCat}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Price Range Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-dashed border-slate-100 gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">Price Range:</span>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-slate-500">{useCurrencyStore.getState().formatPrice(minPrice)}</span>
              <input 
                type="range" 
                min={minPrice} 
                max={highestPrice > 0 ? highestPrice : 2000} 
                step={5}
                value={maxPrice} 
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-32 md:w-48 h-1 bg-slate-200 rounded-none appearance-none cursor-pointer accent-slate-900"
              />
              <span className="text-[10px] font-mono text-slate-900 font-bold">{useCurrencyStore.getState().formatPrice(maxPrice)}</span>

            </div>
          </div>
          <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest text-right">
            {displayedProducts.length} Items Indexed
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {paginatedProducts.map(product => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {paginatedProducts.length > 0 && totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-2">
            <button
              onClick={() => {
                setCurrentPage(p => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-slate-200 text-[10px] font-mono tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              Prev
            </button>
            <div className="font-mono text-xs text-slate-500 flex items-center px-4">
              PAGE {currentPage} OF {totalPages}
            </div>
            <button
              onClick={() => {
                setCurrentPage(p => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-slate-200 text-[10px] font-mono tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {displayedProducts.length === 0 && (
          <div className="text-center py-20 bg-slate-50/50 border border-dashed border-slate-200/60 my-10">
            <p className="text-slate-400 font-serif text-lg tracking-wide">No products found for this query.</p>
            <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-mono">Select another subsection or category to browse.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
