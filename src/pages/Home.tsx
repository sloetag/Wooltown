import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { PageTransition } from '../components/layout/PageTransition';
import { useProductStore } from '../store/productStore';
import { ProductCard } from '../components/ui/ProductCard';
import { useCurrencyStore } from '../store/currencyStore';
import { motion, AnimatePresence } from 'motion/react';
import { MoveRight, ShieldCheck, RefreshCw, Feather, ChevronLeft, ChevronRight } from 'lucide-react';
// @ts-expect-error - Vite handles asset imports
import heroBg from '../assets/images/wooltown_hero_campaign_1779408081912.png';

interface MaterialSpec {
  id: string;
  name: string;
  latin: string;
  coords: string;
  origin: string;
  rating: number; // thermal rating
  description: string;
  imageUrl: string;
}

export function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeMaterial, setActiveMaterial] = useState<string>("merino");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const { formatPrice } = useCurrencyStore();

  const carouselSlides = [
    {
      category: "FOOTWEAR / ATHLETICS",
      name: "Loomed Merino Runner",
      description: "Seamlessly knitted structural shape fitted with a bio-density foam foundation for high responsiveness.",
      price: 145.00,
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
      link: "/shop?category=Footwear"
    },
    {
      category: "MEN / OUTERWEAR",
      name: "Structured Merino Wool Coat",
      description: "Minimalist, precise overcoat tailored from custom heritage virgin merino wool, offering a clean geometric silhouette.",
      price: 295.00,
      imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800",
      link: "/shop?category=Men"
    },
    {
      category: "WOMEN / SILK",
      name: "Silk Slip Dress",
      description: "An elegant, bias-cut slip dress made from 100% pure silk. Drapes effortlessly and offers exquisite smoothness.",
      price: 185.00,
      imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059f581ce?auto=format&fit=crop&q=80&w=800",
      link: "/shop?category=Women"
    },
    {
      category: "HERITAGE / LOOMED",
      name: "Harris Tweed Field Vest",
      description: "Tailored from robust hand-woven Outer Hebrides tweed, complete with organic horn chest buttons.",
      price: 210.00,
      imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
      link: "/shop?category=Heritage"
    }
  ];

  const materialSpecs: MaterialSpec[] = [
    {
      id: "merino",
      name: "Super-fine Merino",
      latin: "Ovis aries fleece",
      coords: "40.9006° S, 174.8860° E",
      origin: "Southern Alps, New Zealand",
      rating: 94,
      description: "Harvested from heritage herds in pristine high-altitude basins. Capable of active thermal regulation, absorbing body humidity into fiber cores while maintaining structural integrity.",
      imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200"
    },
    {
      id: "cashmere",
      name: "Altai Hill Cashmere",
      latin: "Capra hircus down",
      coords: "47.9188° N, 106.9176° E",
      origin: "Altai Highlands, Mongolia",
      rating: 98,
      description: "Responsibly hand-combed down from premium mountain flocks. Fibers boast a microscopic thickness of under 15 microns, providing weightless insulation and a butter-soft tactile density.",
      imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=1200"
    },
    {
      id: "canvas",
      name: "Waxed Sail Canvas",
      latin: "Cannabis Sativa weave",
      coords: "55.6761° N, 12.5683° E",
      origin: "Copenhagen Weaving Yards",
      rating: 68,
      description: "Heavyweight organic line-linen twisted with long-staple cotton fibers. Finished with an ancient organic paraffin blend for full atmospheric protection without synthetic coatings.",
      imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=1200"
    }
  ];

  const activeSpec = materialSpecs.find(m => m.id === activeMaterial) || materialSpecs[0];

  // Auto-advance Lifestyle Exhibit carousel every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % carouselSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
        }
      });
      tl.from('.hero-elem', {
        y: 35,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2
      });

      gsap.utils.toArray<HTMLElement>('.animate-section').forEach((section) => {
        gsap.from(section.querySelectorAll('.animate-item'), {
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
          },
          y: 35,
          opacity: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'all'
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const { products } = useProductStore();
  const featuredProducts = products.slice(0, 4);

  return (
    <PageTransition>
      <div ref={containerRef} className="flex flex-col flex-1 w-full bg-[#FAF9F6]">
        
        {/* Cinematic Parallax Hero Section */}
        <section className="relative h-screen min-h-[650px] flex items-end justify-start overflow-hidden bg-slate-950">
          <div className="absolute inset-0 z-0 select-none">
            <img 
              src={heroBg} 
              alt="Wooltown Fall Campaign" 
              className="w-full h-full object-cover opacity-75 scale-102 filter brightness-[85%] saturate-[95%]" 
            />
            {/* Ultra premium smooth gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/30" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(12,10,8,0.4)_0%,_transparent_65%)]" />
          </div>

          <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 pb-16 md:pb-32 flex flex-col items-start">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "60px" }}
              transition={{ duration: 1, delay: 0.4 }}
              className="h-[1px] bg-amber-400 mb-6"
            />
            
            <span className="hero-elem text-[11px] font-mono tracking-[0.3em] text-amber-300 uppercase font-bold mb-4">
              [ EDITION NO. 04 / WINTER ]
            </span>
            
            <h1 className="hero-elem text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight text-white mb-6 uppercase leading-[1.05] md:leading-[0.95]">
              The Fall <br className="hidden md:block"/> Collection
            </h1>
            
            <p className="hero-elem text-base md:text-xl text-slate-300 font-light mb-10 max-w-xl leading-relaxed tracking-wide">
              Engineering movement. Uncompromising, raw organic materials, designed with exact geographic integrity.
            </p>
            
            <div className="hero-elem flex flex-col sm:flex-row flex-wrap gap-4 w-full sm:w-auto">
              <Link to="/shop" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-[#FAF9F6] text-slate-950 hover:bg-slate-200 border-none text-xs tracking-[0.2em] font-bold uppercase py-6 px-12 rounded-none transition-all duration-300">
                  Shop Men
                </Button>
              </Link>
              <Link to="/shop" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-transparent border border-white/40 text-white hover:bg-white/10 text-xs tracking-[0.2em] font-bold uppercase py-6 px-12 rounded-none transition-all duration-300">
                  Shop Women
                </Button>
              </Link>
            </div>
          </div>

          {/* Luxury Floating Margin indicators */}
          <div className="absolute right-12 bottom-12 hidden lg:flex flex-col items-end z-10 font-mono text-[9px] tracking-[0.3em] text-slate-400 uppercase select-none">
            <span className="mb-2 text-amber-300 animate-pulse">● ATMOSPHERIC BARRIER</span>
            <span>MODEL 88.04 / ACTIVE</span>
          </div>

          {/* Cinematic Animated Scroll Line Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 text-[9px] font-mono tracking-[0.25em] text-slate-400 select-none">
            <span className="mb-2">EXPLORE ASSEMBLY</span>
            <div className="h-10 w-[1px] bg-slate-800 relative overflow-hidden">
              <motion.div 
                animate={{ y: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-0 right-0 h-4 bg-amber-400"
              />
            </div>
          </div>
        </section>

        {/* Categories Bento Portfolio */}
        <section className="animate-section py-28 bg-[#FAF9F6] border-b border-slate-200/50">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 animate-item gap-4">
              <div>
                <span className="text-[10px] font-mono tracking-[0.3em] font-extrabold text-amber-800 uppercase block mb-3">CURATED SILHOUETTES</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-slate-950 uppercase tracking-tight">THE DIRECTORY</h2>
              </div>
              <p className="text-slate-500 max-w-sm text-sm font-light leading-relaxed">
                Fundamental geometries wrapped in premium organic fiber weaves.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 animate-item">
              {/* Bento 1: Classic Wool Outerwear */}
              <Link to="/shop?q=Blazer" className="md:col-span-8 group relative aspect-[16/10] overflow-hidden bg-slate-900 border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1200" 
                  alt="Outerwear" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-102 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <span className="text-[10px] font-mono text-amber-300 tracking-[0.2em] uppercase font-bold block mb-2">ARCHIVAL SHAPE</span>
                  <h3 className="text-2xl font-serif text-white uppercase tracking-tight">STRUCTURAL WOOLWEAVE</h3>
                </div>
                <div className="absolute top-8 right-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <MoveRight className="w-6 h-6" />
                </div>
              </Link>

              {/* Bento 2: Leather Accessories */}
              <Link to="/shop?q=Leather" className="md:col-span-4 group relative aspect-[4/5] md:aspect-auto overflow-hidden bg-slate-950 border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800" 
                  alt="Accessories" 
                  className="w-full h-full object-cover opacity-75 group-hover:scale-102 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <span className="text-[10px] font-mono text-amber-300 tracking-[0.2em] uppercase font-bold block mb-2">RAW FINISH</span>
                  <h3 className="text-xl font-serif text-white uppercase tracking-tight">ANILINE LEATHERS</h3>
                </div>
              </Link>

              {/* Bento 3: Fine Watches */}
              <Link to="/shop?q=Watch" className="md:col-span-4 group relative aspect-[4/5] md:aspect-auto overflow-hidden bg-slate-950 border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800" 
                  alt="Watches" 
                  className="w-full h-full object-cover opacity-75 group-hover:scale-102 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <span className="text-[10px] font-mono text-amber-300 tracking-[0.2em] uppercase font-bold block mb-2">PRECISION APPARATUS</span>
                  <h3 className="text-xl font-serif text-white uppercase tracking-tight">CHRONOMETRICS</h3>
                </div>
              </Link>

              {/* Bento 4: Cashmere Knitwear */}
              <Link to="/shop?q=Cashmere" className="md:col-span-8 group relative aspect-[16/10] overflow-hidden bg-slate-900 border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&q=80&w=1200" 
                  alt="Knitwear" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-102 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <span className="text-[10px] font-mono text-amber-300 tracking-[0.2em] uppercase font-bold block mb-2">THERMAL MATRIX</span>
                  <h3 className="text-2xl font-serif text-white uppercase tracking-tight">PURE CASHMERE</h3>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Lifestyle Directories Bento Portfolio */}
        <section className="animate-section py-28 bg-[#FAF9F6] border-b border-slate-200/50">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 animate-item gap-4">
              <div>
                <span className="text-[10px] font-mono tracking-[0.3em] font-extrabold text-[#705030] uppercase block mb-3">INTEGRATED LIFEWARE</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-slate-950 uppercase tracking-tight">THE LIFESTYLE ARCHIVE</h2>
              </div>
              <p className="text-slate-500 max-w-sm text-sm font-light leading-relaxed font-sans">
                Expanding our organic fiber paradigm into premium collections built for modern resilience and high sensory performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 animate-item">
              {/* Bento 1: Classic Core */}
              <Link to="/shop?category=Classic" className="md:col-span-4 group relative aspect-[4/5] md:aspect-auto overflow-hidden bg-slate-950 border border-slate-150">
                <img 
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800" 
                  alt="Tailored classic suits" 
                  className="w-full h-full object-cover opacity-75 group-hover:scale-102 transition-transform duration-1000 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <span className="text-[10px] font-mono text-amber-300 tracking-[0.2em] uppercase font-bold block mb-2">CURATION 01 / TAILORING</span>
                  <h3 className="text-xl font-serif text-white uppercase tracking-tight">CLASSIC CORE &amp; SUITS</h3>
                </div>
              </Link>

              {/* Bento 2: Premium Footwear */}
              <Link to="/shop?category=Footwear" className="md:col-span-8 group relative aspect-[16/10] overflow-hidden bg-slate-900 border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=1200" 
                  alt="Premium leather footwear and boots" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-102 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <span className="text-[10px] font-mono text-amber-300 tracking-[0.2em] uppercase font-bold block mb-2">CURATION 02 / MOVEMENT</span>
                  <h3 className="text-2xl font-serif text-white uppercase tracking-tight">HAND-CRAFTED FOOTWEAR</h3>
                </div>
                <div className="absolute top-8 right-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <MoveRight className="w-6 h-6" />
                </div>
              </Link>

              {/* Bento 3: Heritage Knitwear */}
              <Link to="/shop?category=Heritage" className="md:col-span-8 group relative aspect-[16/10] overflow-hidden bg-slate-900 border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=1200" 
                  alt="Heritage spun knits" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-102 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-10">
                  <span className="text-[10px] font-mono text-amber-300 tracking-[0.2em] uppercase font-bold block mb-2">CURATION 03 / SPINNING</span>
                  <h3 className="text-2xl font-serif text-white uppercase tracking-tight">HERITAGE KNITWEAR &amp; LOOM</h3>
                </div>
              </Link>

              {/* Bento 4: Fine Accessories */}
              <Link to="/shop?category=Accessories" className="md:col-span-4 group relative aspect-[4/5] md:aspect-auto overflow-hidden bg-slate-950 border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800" 
                  alt="Fine leather accessories" 
                  className="w-full h-full object-cover opacity-75 group-hover:scale-102 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <span className="text-[10px] font-mono text-amber-300 tracking-[0.2em] uppercase font-bold block mb-2">CURATION 04 / LEATHER WORK</span>
                  <h3 className="text-xl font-serif text-white uppercase tracking-tight">FINE LEATHER ACCESSORIES</h3>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products - Handcrafted Lines */}
        <section className="animate-section py-12 w-full bg-white border-b border-slate-200/50">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 animate-item gap-6">
              <div>
                <span className="text-[10px] font-mono tracking-[0.3em] font-extrabold text-amber-800 uppercase block mb-3">CURATIVE EDITIONS</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight text-slate-950 uppercase">THE ARCHIVAL CORE</h2>
              </div>
              <Link 
                to="/shop" 
                className="group flex items-center gap-3 text-sm font-semibold text-slate-950 hover:text-amber-800 uppercase tracking-widest border-b-2 border-slate-950 hover:border-amber-800 pb-2 transition-all duration-300"
              >
                <span>View Complete Line</span>
                <MoveRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map(product => (
                <div key={product.id} className="animate-item h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Curated Exhibit Slider (Frictionless Touch/Click Sliders & Carousels) */}
        <section className="animate-section py-16 md:py-28 bg-[#181715] text-[#FAF9F6] border-b border-white/5 relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
            
            {/* Header coordinates */}
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 animate-item gap-4">
              <div>
                <span className="text-[10px] font-mono tracking-[0.3em] font-extrabold text-amber-400 uppercase block mb-3">CURATIVE KINETIC TRACK</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif uppercase tracking-tight">THE LIFESTYLE EXHIBIT</h2>
              </div>
              
              {/* Slider Controller buttons */}
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setCarouselIndex(prev => Math.max(0, prev - 1))}
                  disabled={carouselIndex === 0}
                  className={`p-4 border rounded-none transition-all duration-300 ${
                    carouselIndex === 0 
                      ? 'border-white/10 text-slate-600 cursor-not-allowed' 
                      : 'border-white/30 text-[#FAF9F6] hover:border-amber-400 hover:text-amber-300 cursor-pointer'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  type="button"
                  onClick={() => setCarouselIndex(prev => Math.min(carouselSlides.length - 1, prev + 1))}
                  disabled={carouselIndex === carouselSlides.length - 1}
                  className={`p-4 border rounded-none transition-all duration-300 ${
                    carouselIndex === carouselSlides.length - 1 
                      ? 'border-white/10 text-slate-600 cursor-not-allowed' 
                      : 'border-white/30 text-[#FAF9F6] hover:border-amber-400 hover:text-amber-300 cursor-pointer'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Slider track area */}
            <div className="relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Image panel with sliding gesture state */}
                <div className="lg:col-span-7">
                  <div className="aspect-[4/3] bg-neutral-900 overflow-hidden border border-white/10 relative">
                    <AnimatePresence mode="wait">
                      <motion.img 
                        key={carouselIndex}
                        src={carouselSlides[carouselIndex].imageUrl} 
                        alt={carouselSlides[carouselIndex].name} 
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 0.85, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full h-full object-cover filter brightness-[90%]" 
                      />
                    </AnimatePresence>
                    
                    <div className="absolute top-6 left-6 font-mono text-[9px] tracking-widest text-[#181715] bg-amber-300 px-3 py-1 font-bold">
                      ACTIVE EXHIBIT No. {(carouselIndex + 1).toString().padStart(2, '0')}
                    </div>
                  </div>
                </div>

                {/* Details narrative panel */}
                <div className="lg:col-span-5 space-y-6">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={carouselIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <div>
                        <span className="text-[10px] font-mono tracking-[0.25em] text-amber-400 uppercase font-bold block mb-2">
                          {carouselSlides[carouselIndex].category}
                        </span>
                        <h3 className="text-3xl md:text-4xl font-serif uppercase tracking-tight text-[#FAF9F6]">
                          {carouselSlides[carouselIndex].name}
                        </h3>
                      </div>

                      <p className="text-slate-400 font-light text-base md:text-lg leading-relaxed font-sans">
                        {carouselSlides[carouselIndex].description}
                      </p>

                      <div className="flex items-baseline gap-4 pt-4 border-t border-white/5">
                        <span className="text-2xl font-mono text-amber-300 font-semibold">
                          {formatPrice(carouselSlides[carouselIndex].price)}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">[ SECURITY DISPATCH ]</span>
                      </div>

                      <div className="pt-6">
                        <Link to={carouselSlides[carouselIndex].link}>
                          <Button size="lg" className="bg-transparent border border-white/30 text-white hover:bg-white/10 hover:border-amber-400 rounded-none tracking-widest uppercase text-xs h-14 w-full sm:w-auto px-10">
                            Explore Collection
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

              </div>

              {/* Slider Progress bar at the bottom */}
              <div className="mt-12 h-[1px] w-full bg-white/10 relative">
                <motion.div 
                  animate={{ left: `${(carouselIndex / carouselSlides.length) * 100}%` }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  style={{ width: `${100 / carouselSlides.length}%` }}
                  className="absolute top-0 h-[2px] bg-amber-400"
                />
              </div>
            </div>

          </div>
        </section>

        {/* Interactive Material Laboratory (Spectacular Brand Magic) */}
        <section className="animate-section py-16 md:py-36 bg-[#11100E] text-[#FAF9F6] relative overflow-hidden select-none">
          {/* Subtle noise and light leak atmosphere */}
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_right,_rgba(255,255,255,0.7),transparent_50%)] pointer-events-none" />
          
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-center">
              
              {/* Left Column: Sizing and Context Specification */}
              <div className="lg:col-span-5 space-y-6 md:space-y-8 animate-item">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.34em] text-amber-400 uppercase font-bold block mb-4">SENSORY LAB SYSTEM</span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif uppercase tracking-tight leading-tight">MATERIALOLOGY</h2>
                </div>

                <p className="text-slate-400 text-sm md:text-base font-light leading-relaxed max-w-md">
                  We maintain total transparency from pastures to pattern cuts. Trace the origin, microscopic fiber metrics, and thermal insulating rating of our fundamental fibers below.
                </p>

                {/* Sub-selector Menu */}
                <div className="space-y-4 pt-6">
                  {materialSpecs.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveMaterial(item.id)}
                      className={`w-full text-left py-4 px-6 border transition-all duration-500 rounded-none flex items-center justify-between ${
                        activeMaterial === item.id 
                          ? 'bg-[#EADED2]/10 border-amber-400 text-amber-300' 
                          : 'bg-transparent border-white/5 text-slate-400 hover:border-white/10 hover:text-[#FAF9F6]'
                      }`}
                    >
                      <span className="font-serif text-lg tracking-wide uppercase">{item.name}</span>
                      <span className="font-mono text-xs opacity-50">{item?.origin?.split(',')?.[0] || 'Unknown'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Immersive Display with transitions */}
              <div className="lg:col-span-7 animate-item flex flex-col justify-center">
                <div className="bg-[#1C1A17] border border-white/5 p-6 md:p-12 relative">
                  
                  {/* Absolute positioning metrics */}
                  <div className="absolute top-8 right-8 text-right font-mono text-[9px] tracking-[0.2em] text-amber-400/50 uppercase">
                    [ RECORD REGISTRATION ]
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSpec.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-8"
                    >
                      {/* Geometric grid coordinate header */}
                      <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-6">
                        <div>
                          <span className="block font-mono text-[8px] tracking-widest text-slate-500 uppercase mb-1">LATIN SPEC</span>
                          <span className="font-serif italic text-sm text-[#FAF9F6]/80">{activeSpec.latin}</span>
                        </div>
                        <div>
                          <span className="block font-mono text-[8px] tracking-widest text-slate-500 uppercase mb-1">GEOGRAPHIC ANCHOR</span>
                          <span className="font-mono text-xs text-[#FAF9F6]/80 tracking-tight leading-none">{activeSpec.coords}</span>
                        </div>
                      </div>

                      {/* Tactile narrative description */}
                      <p className="text-slate-300 font-light text-base md:text-lg leading-relaxed pt-2">
                        {activeSpec.description}
                      </p>

                      {/* Visual Thermal Insulation performance bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between font-mono text-[9px] tracking-widest text-[#FAF9F6]/60">
                          <span>THERMAL RETENTION SCALE</span>
                          <span className="font-bold text-amber-300">{activeSpec.rating}% EFFECTIVE</span>
                        </div>
                        <div className="h-2 w-full bg-[#11100E] p-[3px] border border-white/5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${activeSpec.rating}%` }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                          />
                        </div>
                      </div>

                      {/* Micro visual thumb details */}
                      <div className="aspect-[21/9] overflow-hidden border border-white/5 select-none relative">
                        <img 
                          src={activeSpec.imageUrl} 
                          alt={activeSpec.name} 
                          className="w-full h-full object-cover filter brightness-[75%] saturate-[90%]" 
                        />
                        <div className="absolute bottom-4 left-4 font-mono text-[8px] tracking-[0.3em] text-white/50 bg-black/60 backdrop-blur-md px-3 py-1 uppercase">
                          Sourced Origin: {activeSpec.origin}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Dynamic Trust Shield Indicator Grid */}
        <section className="animate-section py-12 md:py-20 bg-white border-t border-slate-150">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
              <div className="flex flex-col items-center md:items-start space-y-4">
                <div className="p-4 bg-slate-50 border border-slate-100/50 rounded-none text-slate-900">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-900">SECURE DISPATCH</h3>
                <p className="text-slate-500 text-sm font-light max-w-xs leading-relaxed">
                  Complimentary worldwide delivery on premium transactions over $150. Tracked instantly.
                </p>
              </div>

              <div className="flex flex-col items-center md:items-start space-y-4">
                <div className="p-4 bg-slate-50 border border-slate-100/50 rounded-none text-slate-900">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-900">RETURNS PLEDGE</h3>
                <p className="text-slate-500 text-sm font-light max-w-xs leading-relaxed">
                  Enjoy a seamless 30-day collection replacement paradigm. Pre-printed labels enclosed.
                </p>
              </div>

              <div className="flex flex-col items-center md:items-start space-y-4">
                <div className="p-4 bg-slate-50 border border-slate-100/50 rounded-none text-slate-900">
                  <Feather className="w-6 h-6" />
                </div>
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-900">REPARATIVE CARE</h3>
                <p className="text-slate-500 text-sm font-light max-w-xs leading-relaxed">
                  Every Wooltown garment includes direct lifetime material repair advice and service recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
}
