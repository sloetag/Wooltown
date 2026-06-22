import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, X } from 'lucide-react';

export function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show after a brief 2 second delay to let the page load gracefully
    const consent = localStorage.getItem('wooltown_cookie_preference');
    if (!consent) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('wooltown_cookie_preference', 'accepted');
    setIsOpen(false);
  };

  const handleDecline = () => {
    localStorage.setItem('wooltown_cookie_preference', 'declined');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="cookie-consent-container"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 180 }}
          className="fixed bottom-6 left-6 right-6 md:right-auto md:max-w-md bg-slate-900 border border-slate-800 text-[#FAF9F6] p-6 shadow-2xl z-50 rounded-none flex flex-col gap-4 font-sans"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-400/10 text-amber-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg tracking-tight uppercase font-medium">Cookie Integrity</h4>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 font-light leading-relaxed tracking-wide">
            We employ organic tracing cookies to optimize your catalog discovery, protect transaction streams, and remember your cart. No toxic advertising networks or surveillance hooks are included in our lines.
          </p>

          <div className="flex gap-3 justify-end pt-2">
            <button
              id="cookie-decline-button"
              onClick={handleDecline}
              className="px-4 py-2 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-xxs font-mono tracking-widest uppercase transition-all duration-300"
            >
              Decline
            </button>
            <button
              id="cookie-accept-button"
              onClick={handleAccept}
              className="px-5 py-2 bg-amber-400 text-slate-950 font-mono tracking-widest uppercase text-xxs font-bold hover:bg-amber-350 active:scale-98 transition-all duration-350"
            >
              Accept All
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
