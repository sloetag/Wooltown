import { ShoppingBag, Search, Menu, X, User, Heart, Settings, ShieldAlert, Award, Globe } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { useCurrencyStore, CurrencyCode } from '../../store/currencyStore';
import { useLanguageStore, LanguageCode } from '../../store/languageStore';
import { useProductStore } from '../../store/productStore';
import { resolveProductImage } from '../../lib/mockData';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
// @ts-expect-error - Vite handles asset imports but TypeScript needs a declaration
import wooltownLogo from '../../assets/images/wooltown_logo_1779406601051.png';

export function Navbar() {
  const { products } = useProductStore();
  const { toggleCart, items } = useCartStore();
  const { user, logout } = useAuthStore();
  const { currency, setCurrency } = useCurrencyStore();
  const { language, setLanguage } = useLanguageStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom toast notification state
  const [toast, setToast] = useState<{ message: string; sub: string; type: 'signin' | 'signout' } | null>(null);
  
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const navigate = useNavigate();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const { wishlist } = useWishlistStore();
  const wishlistCount = wishlist.length;
  
  // Track previous auth status to trigger sweet prompt
  const prevUserRef = useRef<any>(user);

  useEffect(() => {
    // Check if auth state changed (and exclude initial landing check)
    if (prevUserRef.current === null && user !== null) {
      const context = sessionStorage.getItem('wooltown_cta_auth_context') || 'default_login';
      sessionStorage.removeItem('wooltown_cta_auth_context');

      let message = 'WELCOME TO WOOLTOWN';
      let sub = `SECURELY REGISTERED AS ${user.name.toUpperCase()}`;

      if (context === 'login_form') {
        message = 'WELCOME BACK';
        sub = `VERIFIED TO PROFILE: ${user.name.toUpperCase()}`;
      } else if (context === 'register_form') {
        message = 'REGISTRY COMPLETE';
        sub = `CREATION OF ${user.name.toUpperCase()} INTEGRITY PROFILE SUCCESSFUL`;
      } else if (context === 'checkout_prompt') {
        message = 'SECURE SIGNIN ACTIVE';
        sub = `DISPATCH GATEWAY AUTHORIZED FOR ${user.name.toUpperCase()}`;
      }

      setToast({ message, sub, type: 'signin' });
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    } else if (prevUserRef.current !== null && user === null) {
      const context = sessionStorage.getItem('wooltown_cta_auth_context') || 'default_logout';
      sessionStorage.removeItem('wooltown_cta_auth_context');

      let message = 'SESSION DISCONNECTED';
      let sub = 'CREDENTIALS AND CART VALUE CONSERVED SECURELY';

      if (context === 'desktop_logout') {
        message = 'DESKTOP DISCONNECTION';
        sub = 'YOUR ENCRYPTED REGISTRY ACCESS PORT WAS SAFELY ENVELOPED';
      } else if (context === 'mobile_logout') {
        message = 'MOBILE CHANNEL CLOSED';
        sub = 'HANDSHAKE TERMINATED. LOCAL CART PERSISTENCE SECURED';
      }

      setToast({ message, sub, type: 'signout' });
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
    prevUserRef.current = user;
  }, [user]);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setShowUserMenu(false);
    setSearchQuery('');
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const matchedProducts = searchQuery.trim()
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 10)
    : [];

  const staticLinks = [
    { name: 'Collection Shop & Catalog', url: '/shop', desc: 'Browse men, women, custom accessories and footwear collections', keywords: 'shop collection buy clothing apparel catalog accessories footwear watches men women classic' },
    { name: 'New Arrivals / Releases', url: '/new-arrivals', desc: 'Sovereign cashmere drafts and fresh tailoring releases', keywords: 'new arrivals arrivals fresh latest sparkling design' },
    { name: 'Contact Concierge / Support', url: '/contact', desc: 'Direct secure link with active Stockholm customer assistance', keywords: 'contact concierge help mail message support email phone text address' },
    { name: 'Our Story & Origin Fields', url: '/about', desc: 'Integrity origin files tracing our carbon-neutral materials, hand looms and pastures', keywords: 'about story wool integrity origin fields sheep stockholm sweden organic fiber alpine meadows' },
    { name: 'Order History & Status Registry', url: '/profile?tab=orders', desc: 'Trace physical tracking credentials and real-time shipment maps of ordered goods', keywords: 'profile orders history account dashboard membership purchases tracker postnord shipping transit' },
    { name: 'Billing Settings & Secure Wallet', url: '/profile?tab=billing', desc: 'Configure saved Stripe instruments, credit cards and billing zip nodes', keywords: 'billing card wallet visa mastercard account settings payment checkout deposit secure stripe' },
    { name: 'Security Profile Details', url: '/profile?tab=profile', desc: 'Update primary membership names, email settings and secure keys', keywords: 'profile setting secure login registration credentials username edit' },
    { name: 'Frequently Asked Questions (FAQ)', url: '/faq', desc: 'Sizing guidance, shipping metrics, wash protocols and general answers', keywords: 'faq ask questions help sizing shipping support answers guide help desk support how to clean washed' },
    { name: 'Shipping & Returns Ledger', url: '/shipping-returns', desc: 'Understand returns window, refund pipelines and global courier integrations', keywords: 'shipping returns package delivery refund tracking policy carrier postnord export customs delivery transit post sweden' },
    { name: 'Become a Partner (Supplier Registry)', url: '/vendor', desc: 'Join Stockholm digital craft ledger to list and sell your artisanal custom items', keywords: 'vendor partner supplier loom sell physical craft wool spinner brand commercial register wholesale application platform merchant' },
    { name: 'Security Account Access (Sign In)', url: '/login', desc: 'Sign into your secure member credentials node', keywords: 'login credentials security key enter register profile authenticate signin card lock gateway' },
    { name: 'Sovereign Account Registration', url: '/register', desc: 'Create your permanent Wooltown registry certificate and access billing', keywords: 'register join profile account create signature membership signup registration security credentials' },
    { name: 'Checkout Terminal & Cart', url: '/checkout', desc: 'Finalize your shopping bag, apply offsets and process via Stripe', keywords: 'checkout click buy complete stripe physical payment order cart parcel bag summary order purchase items buy total pay' }
  ];

  const matchedLinks = searchQuery.trim()
    ? staticLinks.filter(link => 
        link.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        link.desc.toLowerCase().includes(searchQuery.toLowerCase()) || 
        link.keywords.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const topSuggestions = [
    { name: 'Washed Merino', url: '/product/p_2' },
    { name: 'Cashmere Turtleneck', url: '/product/p_9' },
    { name: 'Sovereign Shop', url: '/shop' },
    { name: 'Bespoke Concierge', url: '/contact' },
    { name: 'Wallet & Billing Details', url: '/profile?tab=billing' }
  ];

  return (
    <>
      {/* Top Notification Toast for Login/Logout */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4"
          >
            <div className="bg-white text-slate-900 border border-slate-950 p-4 shadow-xl flex items-start justify-between gap-4 font-mono rounded-none">
              <div className="flex-1 min-w-0 pr-2">
                <span className="text-[8px] font-bold tracking-[0.3em] text-slate-400 block mb-1 uppercase">
                  {toast.type === 'signin' ? 'AUTHENTICATION OK' : 'SECURITY SHIELD'}
                </span>
                <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-slate-950">
                  {toast.message}
                </h4>
                <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-wider leading-relaxed">
                  {toast.sub}
                </p>
              </div>
              <button 
                onClick={() => setToast(null)}
                className="text-slate-400 hover:text-slate-950 p-1 transition-colors self-start"
                aria-label="Close Announcement"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isBannerVisible && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-slate-900 text-white text-xs font-medium text-center py-2 px-4 shadow-sm flex items-center justify-center">
          <span>Complimentary dispatch &amp; 10% discount on all orders over $1,000 USD. Auto-applied on checkout. <Link to="/shop" className="underline hover:text-amber-350">Shop now</Link></span>
          <button onClick={() => setIsBannerVisible(false)} className="absolute right-4 p-1 rounded-full hover:bg-slate-800 transition-colors">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <nav className={`fixed left-0 right-0 z-30 transition-all duration-300 ${isBannerVisible ? 'top-9' : 'top-0'} bg-white/95 backdrop-blur-xl border-b border-slate-100`}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isAdmin && (
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 transition-colors"
                aria-label="Mobile Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <Link to="/" className="flex items-center bg-white px-2 rounded-sm select-none outline-none border-none transition-all">
              <img src={wooltownLogo} alt="Wooltown logo" className="h-10 object-contain mix-blend-multiply select-none [clip-path:inset(12%_6%_12%_6%)] contrast-150 brightness-105" />
            </Link>
          </div>

          {!isAdmin && (
            <div className="hidden lg:flex items-center gap-5 xl:gap-7">
              <Link to="/shop" className="text-xs font-semibold text-slate-600 hover:text-slate-905 transition-colors uppercase tracking-widest">Shop All</Link>
              <Link to="/shop?category=Men" className="text-xs font-semibold text-slate-600 hover:text-slate-905 transition-colors uppercase tracking-widest">Men</Link>
              <Link to="/shop?category=Women" className="text-xs font-semibold text-slate-600 hover:text-slate-905 transition-colors uppercase tracking-widest">Women</Link>
              <Link to="/shop?category=Watches" className="text-xs font-semibold text-slate-600 hover:text-slate-905 transition-colors uppercase tracking-widest">Watches</Link>
              <Link to="/new-arrivals" className="text-xs font-semibold text-slate-900 hover:text-amber-800 transition-colors uppercase tracking-widest border-b border-amber-400 font-bold">New Arrivals</Link>
              <Link to="/shop?category=Sale" className="text-xs font-semibold text-[#8a5b29] hover:text-[#705030] transition-colors uppercase tracking-widest font-bold bg-amber-400/10 px-2 py-0.5 border border-amber-400/20">Sale %</Link>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:flex items-center gap-1 notranslate">
              {/* Language Selector */}
              <div className="relative">
                <button 
                  className="p-2 text-slate-600 hover:text-slate-900 transition-colors flex items-center focus:outline-none h-full"
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  aria-label="Language Selector"
                >
                  <span className="text-[10px] font-mono tracking-widest text-slate-500 font-bold uppercase">
                    {language}
                  </span>
                </button>
                <AnimatePresence>
                  {showLanguageMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-32 bg-white border border-slate-200 shadow-xl py-2 z-50 text-left rounded-none max-h-80 overflow-y-auto"
                    >
                      {([
                        'EN', 'FR', 'ES', 'DE', 'IT', 'PT', 'NL', 'RU', 'JA', 'ZH', 'KO', 'AR', 'HI', 'TR'
                      ] as LanguageCode[]).map((l) => (
                        <button
                          key={l}
                          onClick={() => {
                            setLanguage(l);
                            setShowLanguageMenu(false);
                          }}
                          className={`w-full text-left px-5 py-2.5 text-xs font-mono font-bold tracking-widest uppercase hover:bg-slate-50 transition-colors ${language === l ? 'text-[#705030]' : 'text-slate-600'}`}
                        >
                          {l}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="w-px h-3 bg-slate-200 mx-1"></div>

              {/* Currency Selector */}
              <div className="relative">
                <button 
                  className="p-2 text-slate-600 hover:text-slate-900 transition-colors flex items-center focus:outline-none"
                  onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
                  aria-label="Currency Selector"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-[10px] font-mono tracking-widest text-slate-500 font-bold ml-1.5 uppercase">
                    {currency}
                  </span>
                </button>
                <AnimatePresence>
                  {showCurrencyMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-40 bg-white border border-slate-200 shadow-xl py-2 z-50 text-left rounded-none max-h-80 overflow-y-auto"
                    >
                      {([
                        'USD', 'EUR', 'GBP', 'SEK', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 
                        'HKD', 'NZD', 'INR', 'BRL', 'ZAR', 'MXN', 'NOK', 'SGD', 'KRW', 
                        'TRY', 'RUB', 'AED', 'SAR', 'THB', 'IDR', 'MYR', 'PHP', 'VND', 
                        'PLN', 'ARS', 'CLP', 'COP', 'NGN'
                      ] as CurrencyCode[]).map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            setCurrency(c);
                            setShowCurrencyMenu(false);
                          }}
                          className={`w-full text-left px-5 py-2.5 text-xs font-mono font-bold tracking-widest uppercase hover:bg-slate-50 transition-colors ${currency === c ? 'text-[#705030]' : 'text-slate-600'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>
            
            {!isAdmin && (
              <>
                <div className="relative hidden lg:block">
                  {user ? (
                    <>
                      <button 
                        className="p-2 text-slate-600 hover:text-slate-900 transition-colors flex items-center focus:outline-none"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        aria-label="User Account Options"
                      >
                        <User className="w-5 h-5" />
                        <span className="hidden md:block text-[10px] font-mono tracking-widest text-slate-500 font-bold ml-1.5 uppercase">
                          {user?.name?.split(' ')?.[0] || 'User'}
                        </span>
                      </button>
                      <AnimatePresence>
                        {showUserMenu && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-3 w-60 bg-white border border-slate-200 shadow-2xl py-3 z-50 text-left rounded-none"
                          >
                            <div className="px-5 py-3 border-b border-slate-150 mb-2">
                              <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] font-mono mb-1">MEMBER ACCESS</p>
                              <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono truncate">{user.email}</p>
                            </div>
                            
                            <Link 
                              to="/profile?tab=orders" 
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center justify-between w-full px-5 py-2.5 text-xs text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors uppercase tracking-widest font-mono"
                            >
                              <span>Order History</span>
                              <span className="text-[10px] text-slate-400">&rarr;</span>
                            </Link>
                            
                            <Link 
                              to="/profile?tab=reviews" 
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center justify-between w-full px-5 py-2.5 text-xs text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors uppercase tracking-widest font-mono"
                            >
                              <span>My Reviews</span>
                              <span className="text-[10px] text-slate-400">&rarr;</span>
                            </Link>

                            <Link 
                              to="/profile?tab=profile" 
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center justify-between w-full px-5 py-2.5 text-xs text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors uppercase tracking-widest font-mono"
                            >
                              <span>Profile Settings</span>
                              <span className="text-[10px] text-slate-400">&rarr;</span>
                            </Link>



                            <div className="h-[1px] bg-slate-100 my-2" />
                            
                            <button 
                              onClick={() => {
                                sessionStorage.setItem('wooltown_cta_auth_context', 'desktop_logout');
                                logout();
                                setShowUserMenu(false);
                              }}
                              className="w-full text-left px-5 py-2.5 text-xs text-amber-900 hover:text-white hover:bg-amber-950 transition-all uppercase tracking-widest font-mono font-bold"
                            >
                              Sign Out
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link to="/login" className="p-2 text-slate-600 hover:text-slate-900 transition-colors block focus:outline-none" aria-label="Gain Member Access">
                      <User className="w-5 h-5" />
                    </Link>
                  )}
                </div>

                <Link to="/wishlist" className="hidden lg:block p-2 text-slate-600 hover:text-slate-900 transition-colors relative" aria-label="View Wishlist">
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <button onClick={toggleCart} className="p-2 text-slate-600 hover:text-slate-900 transition-colors relative" aria-label="Open Cart Drawer">
                  <ShoppingBag className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                      {itemCount}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Improved Hamburger Menu for Mobile with Elegant Stagger Options */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="fixed top-0 left-0 h-full w-[310px] bg-white shadow-2xl z-50 flex flex-col lg:hidden border-r border-slate-100"
            >
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
                  <img src={wooltownLogo} alt="Wooltown Logo" className="h-8 object-contain mix-blend-multiply bg-transparent [clip-path:inset(6%)]" />
                  <div className="flex items-center gap-3">
                    <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-600 relative hover:bg-slate-200 rounded-full transition-colors flex items-center justify-center focus:outline-none">
                      <Heart className="w-5 h-5" />
                      {wishlistCount > 0 && (
                        <span className="absolute 0 right-0 top-0 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-slate-50">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                    <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close Menu" className="p-2 hover:bg-slate-200 rounded-full transition-colors focus:outline-none">
                      <X className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </div>

              {/* Scrollable Hamburger Container */}
              <div className="flex-1 overflow-y-auto py-6 px-8 space-y-8">
                {/* Mobile Search Node */}
                <form
                  onSubmit={(e) => {
                    handleSearch(e);
                    setIsMobileMenuOpen(false);
                  }}
                  className="relative group"
                >
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search catalogue..."
                    className="w-full bg-slate-100/80 border border-transparent rounded-none py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-4 ring-slate-100 transition-all font-mono placeholder:text-slate-400"
                  />
                </form>

                <div>
                  <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-slate-400 block mb-4">01 / SHOP COLLECTIONS</span>
                  <nav className="flex flex-col space-y-3.5">
                    <Link to="/shop" className="text-[10px] font-mono font-bold tracking-widest text-slate-800 hover:text-[#705030] transition-colors flex items-center justify-between py-2 border-b border-slate-100 uppercase">
                      <span>Shop All Collections</span>
                      <span className="text-slate-400 font-mono text-[9px]">&rarr;</span>
                    </Link>
                    
                     {/* Consistent Serif Grid for core fields */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-2 pb-2 text-[14px] text-slate-755 font-serif">
                      <Link to="/shop?category=Men" className="hover:text-[#705030] transition-colors">Men's Apparel</Link>
                      <Link to="/shop?category=Women" className="hover:text-[#705030] transition-colors">Women's Line</Link>
                      <Link to="/shop?category=Classic" className="hover:text-[#705030] transition-colors">Classic Core</Link>
                      <Link to="/shop?category=Accessories" className="hover:text-[#705030] transition-colors">Fine Accessories</Link>
                      <Link to="/shop?category=Footwear" className="hover:text-[#705030] transition-colors">Premium Footwear</Link>
                      <Link to="/shop?category=Kids %26 Youth" className="hover:text-[#705030] transition-colors">Kids &amp; Youth</Link>
                    </div>

                    {/* Clean Monospace alignment for special series */}
                    <div className="border-t border-slate-100/80 pt-3 flex flex-col space-y-2 text-[11px] font-mono tracking-widest text-slate-500 uppercase">
                      <Link to="/shop?category=Sportswear" className="hover:text-[#705030] transition-all flex items-center justify-between py-0.5">
                        <span>Sportswear Line</span>
                        <span className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 font-bold tracking-normal rounded-sm">ACTIVE</span>
                      </Link>
                      <Link to="/shop?category=Loungewear" className="hover:text-[#705030] transition-all flex items-center justify-between py-0.5">
                        <span>Loungewear Cozy</span>
                        <span className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 font-bold tracking-normal rounded-sm">COMFORT</span>
                      </Link>
                      <Link to="/shop?category=Heritage" className="hover:text-[#705030] transition-all flex items-center justify-between py-0.5">
                        <span>Heritage Stitches</span>
                        <span className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 font-bold tracking-normal rounded-sm">LOOMED</span>
                      </Link>
                      <Link to="/shop?category=Sale" className="hover:text-amber-900 transition-all flex items-center justify-between py-1 px-2 border border-amber-250 bg-amber-50/40 text-amber-800 font-bold tracking-wider mt-1.5">
                        <span>Archive &amp; Sample Sale</span>
                        <span className="text-[9px] font-mono text-amber-700">% OFF</span>
                      </Link>
                    </div>
                  </nav>
                </div>

                {user && (
                  <div className="pt-4 border-t border-slate-100">
                    <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-slate-400 block mb-4">02 / MEMBER HUB</span>
                    <nav className="flex flex-col space-y-3 font-serif text-base text-slate-700">
                      <Link to="/profile?tab=orders" className="hover:text-slate-950 flex items-center justify-between">
                        <span>Order Transactions</span>
                        <span className="text-xs text-slate-400 font-mono">&rarr;</span>
                      </Link>
                      <Link to="/profile?tab=billing" className="hover:text-slate-950 flex items-center justify-between">
                        <span>Billing Settings &amp; Wallet</span>
                        <span className="text-xs text-slate-400 font-mono">&rarr;</span>
                      </Link>
                      <Link to="/profile?tab=profile" className="hover:text-slate-950 flex items-center justify-between">
                        <span>Account Registry</span>
                        <span className="text-xs text-slate-400 font-mono">&rarr;</span>
                      </Link>

                    </nav>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 notranslate">
                  <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-slate-400 block mb-4">03 / REGION & PREFERENCES</span>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Language Selector */}
                    <div>
                      <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Language</label>
                      <div className="relative">
                        <select 
                          value={language}
                          onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                          className="w-full bg-slate-50 border border-slate-200 text-xs font-mono font-bold tracking-widest uppercase py-2.5 px-3 focus:outline-none focus:border-slate-400 cursor-pointer appearance-none rounded-none pr-8 text-slate-700"
                        >
                          {([
                            'EN', 'FR', 'ES', 'DE', 'IT', 'PT', 'NL', 'RU', 'JA', 'ZH', 'KO', 'AR', 'HI', 'TR'
                          ] as LanguageCode[]).map((l) => (
                            <option key={l} value={l} className="bg-white text-slate-900 font-mono text-xs">{l}</option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] font-mono text-slate-400">&darr;</div>
                      </div>
                    </div>

                    {/* Currency Selector */}
                    <div>
                      <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Currency</label>
                      <div className="relative">
                        <select 
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                          className="w-full bg-slate-50 border border-slate-200 text-xs font-mono font-bold tracking-widest uppercase py-2.5 px-3 focus:outline-none focus:border-slate-400 cursor-pointer appearance-none rounded-none pr-8 text-slate-700"
                        >
                          {([
                            'USD', 'EUR', 'GBP', 'SEK', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 
                            'HKD', 'NZD', 'INR', 'BRL', 'ZAR', 'MXN', 'NOK', 'SGD', 'KRW', 
                            'TRY', 'RUB', 'AED', 'SAR', 'THB', 'IDR', 'MYR', 'PHP', 'VND', 
                            'PLN', 'ARS', 'CLP', 'COP', 'NGN'
                          ] as CurrencyCode[]).map((c) => (
                            <option key={c} value={c} className="bg-white text-slate-900 font-mono text-xs">{c}</option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] font-mono text-slate-400">&darr;</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Portal Panel */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/80 flex flex-col space-y-3">
                {user ? (
                  <>
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                      MEMBERSHIP ACTIVE
                      <span className="font-serif normal-case text-slate-900 block text-sm font-bold mt-1 tracking-normal">{user.name}</span>
                    </div>
                    <button 
                      onClick={() => {
                        sessionStorage.setItem('wooltown_cta_auth_context', 'mobile_logout');
                        logout();
                        setIsMobileMenuOpen(false);
                      }} 
                      className="w-full text-center py-2 bg-amber-950 text-white text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-amber-900 transition-colors"
                    >
                      Sign Out Securely
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="w-full text-center py-3 bg-slate-950 text-white text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-slate-800 transition-colors block"
                  >
                    Authenticate Membership
                  </Link>
                )}
                
                <div className="pt-4 text-center text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                  &copy; {new Date().getFullYear()} Wooltown Studio.
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#FAF9F6] flex flex-col overflow-y-auto"
          >
            {/* Top Close Section */}
            <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 pt-8 flex justify-end">
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-3 bg-white text-slate-900 border border-slate-200 hover:bg-slate-950 hover:text-white transition-all duration-300 focus:outline-none"
                aria-label="Close Search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input Overlay */}
            <div className="max-w-4xl mx-auto w-full px-6 sm:px-8 mt-12 md:mt-16">
              <form onSubmit={handleSearch} className="relative border-b-2 border-slate-300 focus-within:border-slate-950 transition-colors pb-4 flex items-center">
                <Search className="w-8 h-8 text-slate-400 mr-4 flex-shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-2xl md:text-5xl font-serif text-slate-900 placeholder-slate-250 focus:outline-none"
                />
              </form>

              {/* Live search results box */}
              <div className="mt-12 mb-24">
                {!searchQuery.trim() ? (
                  <div>
                    <span className="text-[10px] font-mono tracking-[0.25em] font-extrabold text-[#705030] uppercase block mb-6">SUGGESTED DISPATCH NODES</span>
                    <div className="flex flex-wrap gap-2.5">
                      {topSuggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            navigate(sug.url);
                            setIsSearchOpen(false);
                          }}
                          className="px-4 py-2 border border-slate-200 bg-white text-slate-700 hover:border-slate-800 hover:bg-slate-950 hover:text-white transition-all text-xs font-mono font-medium rounded-none focus:outline-none uppercase tracking-wider"
                        >
                          {sug.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                    
                    {/* Products matches column */}
                    <div className="md:col-span-7 space-y-6">
                      <span className="text-[10px] font-mono tracking-[0.25em] font-extrabold text-[#705030] uppercase block border-b border-slate-200 pb-3">
                        Artisanal Item Matches ({matchedProducts.length})
                      </span>

                      {matchedProducts.length === 0 ? (
                        <p className="text-slate-400 text-sm font-sans italic py-4">No product variants match the active term.</p>
                      ) : (
                        <div className="space-y-4">
                          {matchedProducts.map((prod) => (
                            <div 
                              key={prod.id} 
                              onClick={() => {
                                navigate(`/product/${prod.id}`);
                                setIsSearchOpen(false);
                              }}
                              className="group flex gap-4 bg-white border border-slate-200 hover:border-slate-950 transition-all cursor-pointer p-3 rounded-none select-none"
                            >
                              <div className="w-14 h-18 bg-slate-100 flex-shrink-0 border border-slate-100 overflow-hidden">
                                {prod?.images?.[0] && (
                                  <img 
                                    src={resolveProductImage(prod?.images?.[0])} 
                                    alt={prod.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                                    referrerPolicy="no-referrer"
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <span className="text-[9px] font-mono uppercase text-slate-400 block tracking-widest">{prod.category}</span>
                                <h4 className="font-serif font-bold text-sm text-slate-900 tracking-tight leading-tight group-hover:text-[#705030] transition-colors truncate">
                                  {prod.name}
                                </h4>
                                <span className="font-mono text-xs text-slate-950 mt-1 block">
                                  {useCurrencyStore.getState().formatPrice(prod.price)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Navigation matches column */}
                    <div className="md:col-span-1" />
                    <div className="md:col-span-4 space-y-6">
                      <span className="text-[10px] font-mono tracking-[0.25em] font-extrabold text-[#705030] uppercase block border-b border-slate-200 pb-3">
                        System Links Matches ({matchedLinks.length})
                      </span>

                      {matchedLinks.length === 0 ? (
                        <p className="text-slate-400 text-sm font-sans italic py-4">No navigational indexes match the active term.</p>
                      ) : (
                        <div className="space-y-3">
                          {matchedLinks.map((link, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => {
                                navigate(link.url);
                                setIsSearchOpen(false);
                              }}
                              className="group bg-white p-4 border border-slate-200 hover:border-slate-950 cursor-pointer transition-all rounded-none"
                            >
                              <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900 group-hover:text-[#705030] transition-colors">
                                {link.name}
                              </h5>
                              <p className="text-[10px] text-slate-400 mt-1 lowercase font-sans leading-tight">
                                {link.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
