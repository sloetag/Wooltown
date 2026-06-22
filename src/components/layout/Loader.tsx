import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
// @ts-expect-error - Vite handles asset imports
import wooltownLogoBrown from '../../assets/wooltown_logo_brown_1779407577528.png';

export function Loader({ onComplete }: { onComplete: () => void; key?: string }) {
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);

  const phases = [
    "01 / MATERIAL COMPOSITION",
    "02 / PATTERN GEOMETRY",
    "03 / KNIT ASSEMBLY",
    "04 / UNCOMPROMISING DETAIL"
  ];

  useEffect(() => {
    // Elegant, non-linear realistic loading effect
    let currentProgress = 0;
    const interval = setInterval(() => {
      // Create organic slow-fast-slow increments
      const increment = currentProgress < 30 
        ? Math.random() * 5 + 2 
        : currentProgress < 75 
          ? Math.random() * 8 + 4 
          : Math.random() * 3 + 1;

      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(Math.floor(currentProgress));

      // Cycle narrative phases
      if (currentProgress < 25) setPhaseIndex(0);
      else if (currentProgress < 50) setPhaseIndex(1);
      else if (currentProgress < 80) setPhaseIndex(2);
      else setPhaseIndex(3);

      if (currentProgress >= 100) {
        clearInterval(interval);
        const exitTimeout = setTimeout(() => {
          onComplete();
        }, 600);
        return () => clearTimeout(exitTimeout);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 1, ease: [0.85, 0, 0.15, 1] }
      }}
      className="fixed inset-0 z-[100] bg-[#FAF9F6] flex flex-col items-center justify-between p-8 md:p-12 pointer-events-auto select-none overflow-hidden"
    >
      {/* Structural Minimalist Grid Accents */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex justify-between px-16 h-full">
        <div className="w-[1px] h-full bg-slate-950" />
        <div className="w-[1px] h-full bg-slate-950 hidden md:block" />
        <div className="w-[1px] h-full bg-slate-950 hidden md:block" />
        <div className="w-[1px] h-full bg-slate-950" />
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex flex-col justify-between py-16 w-full">
        <div className="h-[1px] w-full bg-slate-950" />
        <div className="h-[1px] w-full bg-slate-950" />
      </div>

      {/* Top Header - Brand Manifesto Spec */}
      <div className="w-full max-w-[1400px] flex justify-between items-start z-10 font-mono text-[9px] md:text-[10px] tracking-[0.2em] text-amber-900/60 uppercase">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          WOOLTOWN / EST. 2026
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="text-right"
        >
          [ C O D E : 0F52F8 ]
        </motion.div>
      </div>

      {/* Core Centerpiece - Logo & Premium Revealer */}
      <div className="flex flex-col items-center justify-center flex-1 w-full z-10 relative">
        <div className="relative flex flex-col items-center">
          {/* Subtle slow pulsing radiant aura behind logo */}
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute -inset-10 bg-amber-100/20 blur-2xl rounded-full"
          />

          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-[#FAF9F6] p-2 flex items-center justify-center rounded-sm"
          >
            <img 
              src={wooltownLogoBrown} 
              alt="Wooltown Loader Logo" 
              className="h-28 md:h-36 object-contain mix-blend-multiply [clip-path:inset(12%_6%_12%_6%)] contrast-135 brightness-105" 
            />
          </motion.div>

          {/* Sleek Line Underneath the Logo */}
          <div className="h-[1px] w-24 md:w-32 bg-amber-900/10 mt-6 relative overflow-hidden">
            <motion.div 
              style={{ width: `${progress}%` }}
              className="absolute left-0 top-0 h-full bg-amber-900/40"
            />
          </div>
        </div>
      </div>

      {/* Bottom Footer - Ticker and Phases */}
      <div className="w-full max-w-[1400px] flex flex-col md:flex-row justify-between items-end gap-6 z-10 font-mono">
        <div className="flex flex-col items-start uppercase">
          <span className="text-[9px] tracking-[0.25em] text-amber-900/40 mb-1">SYSTEM STATE</span>
          <div className="h-5 overflow-hidden">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={phaseIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-[10px] md:text-xs tracking-[0.15em] text-amber-900/70 block font-medium"
              >
                {phases[phaseIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Dynamic hand-wound yarn ball that colors-fills on load */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right">
          <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-20 md:h-20 filter drop-shadow-[0_4px_12px_rgba(112,80,48,0.06)] scale-102 transition-transform duration-300">
            <defs>
              <linearGradient id="yarn-fill" x1="0" y1="1" x2="0" y2="0">
                <stop offset={`${progress}%`} stopColor="#705030" />
                <stop offset={`${progress}%`} stopColor="#D8D4C9" />
              </linearGradient>
            </defs>
            {/* Soft inner core backing */}
            <circle cx="50" cy="50" r="39.5" fill="#FAF9F6" />
            
            {/* Outer boundary thread loop */}
            <circle cx="50" cy="50" r="40" fill="none" stroke="url(#yarn-fill)" strokeWidth="3" strokeLinecap="round" />
            
            {/* Curved overlapping wound thread paths */}
            <path d="M 12,50 A 38,38 0 0,0 88,50" fill="none" stroke="url(#yarn-fill)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 16,35 A 36,36 0 0,0 84,65" fill="none" stroke="url(#yarn-fill)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 16,65 A 36,36 0 0,0 84,35" fill="none" stroke="url(#yarn-fill)" strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Vertical wrapped threads */}
            <path d="M 50,12 A 38,38 0 0,1 50,88" fill="none" stroke="url(#yarn-fill)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 35,16 A 36,36 0 0,1 65,84" fill="none" stroke="url(#yarn-fill)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 65,16 A 36,36 0 0,0 35,84" fill="none" stroke="url(#yarn-fill)" strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Oblique wrappings */}
            <path d="M 22,22 A 38,38 0 0,0 78,78" fill="none" stroke="url(#yarn-fill)" strokeWidth="2" strokeLinecap="round" />
            <path d="M 22,78 A 38,38 0 0,1 78,22" fill="none" stroke="url(#yarn-fill)" strokeWidth="2" strokeLinecap="round" />
            
            {/* Overlapping cozy core fibers */}
            <path d="M 30,50 Q 50,25 70,50" fill="none" stroke="url(#yarn-fill)" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 30,50 Q 50,75 70,50" fill="none" stroke="url(#yarn-fill)" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 50,30 Q 25,50 50,70" fill="none" stroke="url(#yarn-fill)" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 50,30 Q 75,50 50,70" fill="none" stroke="url(#yarn-fill)" strokeWidth="1.8" strokeLinecap="round" />

            {/* Spill thread loose end flowing gracefully */}
            <path d="M 12,50 Q -2,65 14,75 T 45,84 T 70,93 T 95,90" fill="none" stroke="url(#yarn-fill)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div className="mt-2.5 font-mono text-[8px] md:text-[9px] tracking-[0.3em] text-amber-900/60 uppercase font-bold">
            WARP &bull; WEFT PROGRESS &bull; {progress}%
          </div>
        </div>
      </div>

      {/* Full screen extremely high end ambient scan lines/noise */}
      <div className="absolute inset-0 z-50 pointer-events-none mix-blend-overlay opacity-[0.015] bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] bg-cover" />
    </motion.div>
  );
}
