import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// @ts-expect-error - Vite handles asset imports
import wooltownLogo from '../../assets/images/wooltown_logo_1779406601051.png';

gsap.registerPlugin(ScrollTrigger);

const emailSchema = z.string().email("Please enter a valid email address.");

export function Footer() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = footerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const items = container.querySelectorAll('.footer-animate');
      if (items.length > 0) {
        gsap.fromTo(items,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 93%',
              toggleActions: 'play none none none',
            }
          }
        );
      }
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);

    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      setEmailError(validation.error.issues[0]?.message || "Please enter a valid email address.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/marketing/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: validation.data })
      });
      
      if (response.ok) {
        setSubmittedEmail(validation.data);
        setSubscribed(true);
        setEmail('');
      } else {
        const errData = await response.json().catch(() => ({}));
        setEmailError(errData.error || "Subscription failed. Please try again.");
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch (error) {
      console.error("Subscription failed", error);
      setEmailError("Connection error. Please try again later.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubscribed(false);
    setSubmittedEmail('');
    setEmailError(null);
  };

  return (
    <footer ref={footerRef} className="bg-slate-950 text-slate-400 py-12 md:py-16 overflow-hidden">
      {/* Sovereign Ribbon Partner Banner */}
      <div className="border-b border-slate-900 pb-10 mb-12 footer-animate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1 max-w-xl">
            <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-amber-400 font-bold block">PARTNERSHIP DISCOVERY</span>
            <h3 className="text-xl font-serif text-white tracking-tight uppercase font-medium">Make Money with Wooltown</h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed">Are you a physical craftsperson, textile fabricator, or sensory designer? Join our Sovereign Supplier registry to list your lines.</p>
          </div>
          <Link 
            to="/vendor" 
            className="px-6 py-3 bg-white text-slate-950 font-mono tracking-widest text-[10px] uppercase font-bold hover:bg-slate-200 transition-all active:scale-98 shrink-0"
          >
            Become a Partner
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-slate-900">
        <div className="md:pr-8 footer-animate">
          <img src={wooltownLogo} alt="Wooltown" className="h-10 object-contain invert mix-blend-screen opacity-90 mb-4 [clip-path:inset(12%_6%_12%_6%)] contrast-175 brightness-95" />
          <p className="text-sm border-slate-800">Premium apparel and accessories designed for modern living.</p>
        </div>
        <div className="md:px-8 footer-animate">
          <h4 className="text-white font-medium mb-4 tracking-tight">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
            <li><Link to="/shop?category=Men" className="hover:text-white transition-colors">Men's Collection</Link></li>
            <li><Link to="/shop?category=Women" className="hover:text-white transition-colors">Women's Collection</Link></li>
            <li><Link to="/shop?category=Accessories" className="hover:text-white transition-colors">Accessories</Link></li>
          </ul>
        </div>
        <div className="md:px-8 footer-animate">
          <h4 className="text-white font-medium mb-4 tracking-tight">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white transition-colors">Our Story &amp; Origins</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            <li><Link to="/shipping-returns" className="hover:text-white transition-colors">Shipping &amp; Returns</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div className="md:pl-8 min-h-[180px] flex flex-col justify-start footer-animate">
          <h4 className="text-white font-medium mb-3 tracking-tight">Newsletter</h4>
          <p className="text-sm mb-4 text-slate-400">Subscribe to receive updates, access to exclusive deals, and more.</p>
          
          <div className="relative w-full">
            <AnimatePresence mode="wait">
              {!subscribed ? (
                <motion.div
                  key="form-container"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <motion.form 
                    noValidate 
                    className={`flex border rounded-sm overflow-hidden transition-colors bg-slate-950/80 ${emailError ? 'border-rose-500' : 'border-slate-800 focus-within:border-slate-500'}`} 
                    onSubmit={handleSubscribe}
                    animate={shake ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <input 
                      type="email" 
                      placeholder="Email address" 
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(null);
                      }}
                      required
                      className="bg-transparent text-sm text-white px-4 py-2 w-full focus:outline-none placeholder:text-slate-600" 
                    />
                    <motion.button 
                      type="submit" 
                      disabled={loading} 
                      className="bg-white text-slate-950 px-5 text-xs font-mono font-bold tracking-wider uppercase hover:bg-slate-200 transition-colors disabled:opacity-75 disabled:cursor-wait flex items-center gap-1.5"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <Loader2 className="h-3 w-3 animate-spin text-slate-950" />
                      ) : (
                        <>
                          Subscribe
                          <ArrowRight className="h-3 w-3" />
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                  
                  <AnimatePresence>
                    {emailError && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.25 }}
                        className="text-rose-500 text-xs font-mono"
                      >
                        {emailError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="success-container"
                  variants={{
                    hidden: { opacity: 0, scale: 0.95, y: 10 },
                    visible: { 
                      opacity: 1, 
                      scale: 1, 
                      y: 0,
                      transition: {
                        type: "spring",
                        stiffness: 140,
                        damping: 15,
                        staggerChildren: 0.08,
                        delayChildren: 0.05
                      }
                    }
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="bg-slate-900/40 border border-slate-900/80 rounded-sm p-4 flex flex-col items-start gap-2 text-left"
                >
                  <motion.div 
                    variants={{
                      hidden: { scale: 0.8, opacity: 0 },
                      visible: { scale: 1, opacity: 1 }
                    }}
                    className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400 mb-1"
                  >
                    <svg className="h-4 w-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <motion.polyline 
                        points="20 6 9 17 4 12"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
                      />
                    </svg>
                  </motion.div>
                  
                  <motion.h5 
                    variants={{
                      hidden: { opacity: 0, y: 5 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="text-white text-sm font-serif font-medium tracking-tight uppercase"
                  >
                    Welcome to Wooltown
                  </motion.h5>
                  
                  <motion.p 
                    variants={{
                      hidden: { opacity: 0, y: 5 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="text-xs text-slate-400 leading-relaxed max-w-sm"
                  >
                    Confirmation link sent to <span className="text-slate-200 font-mono font-light break-all bg-slate-900/60 px-1 py-0.5 rounded">{submittedEmail}</span>. Read our next craft story in your inbox shortly.
                  </motion.p>
                  
                  <motion.button
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 }
                    }}
                    onClick={handleReset}
                    className="text-[10px] uppercase font-mono tracking-widest text-slate-400 hover:text-white transition-colors underline underline-offset-4 decoration-slate-800 hover:decoration-slate-400 mt-2 cursor-pointer"
                  >
                    Subscribe Another Email
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-12 border-t border-slate-900 flex flex-col items-center footer-animate">
        <div className="w-full text-sm flex flex-col md:flex-row justify-between items-center text-slate-500 mb-12">
          <p>&copy; {new Date().getFullYear()} Wooltown. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
        <img src={wooltownLogo} alt="Wooltown" className="h-24 md:h-32 object-contain invert mix-blend-screen opacity-10" />
      </div>
    </footer>
  );
}
