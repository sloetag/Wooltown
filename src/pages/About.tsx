import React, { useState } from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  MapPin, 
  ShieldCheck, 
  Gauge, 
  Compass, 
  Wind, 
  Sparkles, 
  Layers, 
  Flame, 
  Globe2 
} from 'lucide-react';

interface FiberSpec {
  id: string;
  name: string;
  scientificName: string;
  micronRating: string;
  warmthFactor: number; // 1-100
  weightGsm: string;
  elasticity: string;
  carbonFootprint: string;
  description: string;
  sourceRegion: string;
  tactologicalFeel: string;
}

export function About() {
  const [activeFiber, setActiveFiber] = useState<string>('merino');

  const fibers: FiberSpec[] = [
    {
      id: 'merino',
      name: 'Superfine Washed Merino',
      scientificName: 'Ovis aries • 17.5µ',
      micronRating: '17.5 microns (Superfine Grade)',
      warmthFactor: 85,
      weightGsm: '190g/m²',
      elasticity: 'high adaptive bounce',
      carbonFootprint: '-2.4kg CO2e/kg (fully offset)',
      description: 'Hand-scoured and ring-spun Merino sourced from the high-altitude pastures of Jämtland. Highly breathable, soft to the bare chest, with innate hygroscopic thermal adaptation.',
      sourceRegion: 'Central Sweden Highlands',
      tactologicalFeel: 'Silky, cloud-like, zero prickle'
    },
    {
      id: 'boiledwool',
      name: 'Organic Boiled fleece',
      scientificName: 'Gotland Lamb • 26µ',
      micronRating: '26.0 microns (Heavyweight Structure)',
      warmthFactor: 96,
      weightGsm: '420g/m²',
      elasticity: 'compact stability',
      carbonFootprint: '-4.1kg CO2e/kg (negative score)',
      description: 'Densely milled using pure, soft mountain spring water. Felting creates deep air pockets for thermal insulation, locking out wind, rain waves, and mist.',
      sourceRegion: 'Gotland Baltic Meadows',
      tactologicalFeel: 'Dry, robust, protective outer armor'
    },
    {
      id: 'cashmere',
      name: 'Grade-A Mongolian Cashmere',
      scientificName: 'Capra hircus • 14.5µ',
      micronRating: '14.5 microns (Ultra Luxury Grade)',
      warmthFactor: 98,
      weightGsm: '160g/m²',
      elasticity: 'delicate drape',
      carbonFootprint: '-1.8kg CO2e/kg (offset partner)',
      description: 'Slow-combed from the underbelly of Capra goats during spring molting cycles. Exceptionally warm for its weight, with a luxurious, lofty, liquid-like drape.',
      sourceRegion: 'Gobi Desert Highlands',
      tactologicalFeel: 'Velvety, weightless heat, fluid luxury'
    },
    {
      id: 'tweed',
      name: 'Raw Shetland Tweed',
      scientificName: 'Shetland Fleece • 30µ',
      micronRating: '30.0 microns (Rugged Heritage)',
      warmthFactor: 78,
      weightGsm: '340g/m²',
      elasticity: 'firm mechanical retention',
      carbonFootprint: '-3.8kg CO2e/kg (negative score)',
      description: 'Woven with dual-core lock threads for incredible historic abrasion resistance. Holds its shape over decades of severe wear, gaining beautiful patinas.',
      sourceRegion: 'Shetland Isles Heritage Farms',
      tactologicalFeel: 'Highly textured, crisp, traditional'
    }
  ];

  const currentFiber = fibers.find(f => f.id === activeFiber) || fibers[0];

  const timelineMilestones = [
    { year: '1924', title: 'The Wood Loom Inception', desc: 'Craftsman Lars Almgren erects a singular wooden hand-loom powered by Stockholm water channels.' },
    { year: '1976', title: 'The Gotland Sanctuary', desc: 'Establishment of local breeding collectives focusing on unbleached, high-luster grey Baltic wool sheep.' },
    { year: '2012', title: 'Zero Synthetic Mandate', desc: 'Removal of all petrochemical acrylic dilutions from our spinning formulas, dedicating legacy to 100% natural wool.' },
    { year: '2026', title: 'The Sovereign Cloud', desc: 'Marrying medieval physical integrity with carbon-neutral digital logistics, shipping worldwide without footprint marks.' }
  ];

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-16 md:pb-24 bg-white text-slate-800">
        
        {/* Editorial Title Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-amber-800 block">
            MANUAL OF INTEGRITY &bull; OUR ORIGIN
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-light tracking-tight text-slate-900 uppercase">
            Designed for Modern Living, Guided by Ancestor Threads
          </h1>
          <p className="text-sm md:text-base font-serif italic text-slate-500 leading-relaxed max-w-2xl">
            "At Wooltown, we do not fabricate apparel; we archive fibers. Every thread is a physical record of soil quality, rain cycles, and patient wooden-frame rotation."
          </p>
        </div>

        {/* 2-Column Story grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 border-t border-slate-100 pt-12">
          
          <div className="lg:col-span-7 space-y-6 text-sm text-slate-650 leading-relaxed font-serif">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#705030] h-5 mb-2">
              01 / THE STOCKHOLM LOOM ARCHIVES
            </h2>
            <p>
              In an era dominated by hyper-synthetic fast fashion, Wooltown remains stubbornly analog. Founded in Stockholm, Sweden, our label has spent decades centering our products around the natural performance of biological fleece. We believe that synthetic fibers (polyesters, nylons, acrylics) are a temporary deviation in the timeline of human attire.
            </p>
            <p>
              By spinning premium merino, Baltic gotland wool, and organic cashmere fleece, we provide pieces that offer biological intelligence: natural temperature homeostasis, automatic odor resistance, mechanical elasticity, and lifetime soil-biodegradability.
            </p>
            <p>
              Our production pipelines operate fully in-house. We source unwashed raw wool from Swedish smallholding collectives, scour utilizing zero dangerous chlorinated chemicals, card using vintage cast-iron looms, and finish with steam baths fueled by biomass heat. 
            </p>
          </div>

          <div className="lg:col-span-5 bg-slate-50/60 border border-slate-100 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-slate-400 block">
                CRAFT COMPLIANCE AUDIT
              </span>
              <ul className="space-y-3.5 text-xs text-slate-700 font-mono">
                <li className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#705030]" />
                  <span>100% Zero Synthetics Policy</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Globe2 className="w-4 h-4 text-[#705030]" />
                  <span>Carbon-Negative Supply Nodes</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Wind className="w-4 h-4 text-[#705030]" />
                  <span>Biodegradable Circular Shipping</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#705030]" />
                  <span>Authentic Stockholm Spinning Stamp</span>
                </li>
              </ul>
            </div>

            <div className="border-t border-slate-200/60 pt-6 mt-8">
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-[#705030] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold block uppercase">
                    Central Spinning Hub
                  </span>
                  <p className="text-xs text-slate-900 font-bold font-serif leading-tight">
                    Ågatan 14, 116 24 Stockholm, Sweden &bull; Ground Floor
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE FIBER REGISTRY METERS */}
        <div className="bg-[#FAF9F6] border border-slate-200/60 p-6 md:p-8 mb-20 select-none">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4 mb-6">
            <div>
              <span className="text-[10px] font-mono tracking-[0.2em] font-extrabold text-[#705030] uppercase block">
                TACTILE REGISTRY INTERACTIVE SEARCH
              </span>
              <h3 className="font-serif text-lg tracking-tight text-slate-900 font-medium">
                The Fibre Specs &amp; Technical Micron Indices
              </h3>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500 bg-white/80 border border-stone-200 px-2 py-0.5 whitespace-nowrap">
              LIVE MICRO-DATA CHIPPED
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Fibre selector tabs */}
            <div className="lg:col-span-4 flex flex-col gap-2">
              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Select Active Specimen
              </span>
              {fibers.map((fib) => (
                <button
                  key={fib.id}
                  onClick={() => setActiveFiber(fib.id)}
                  className={`w-full text-left p-3 border transition-all flex flex-col justify-center focus:outline-none rounded-none ${activeFiber === fib.id ? 'bg-slate-950 border-slate-950 text-white' : 'bg-white border-slate-200 text-slate-800 hover:border-slate-400'}`}
                >
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${activeFiber === fib.id ? 'text-amber-400' : 'text-[#705030]'}`}>
                    {fib.scientificName}
                  </span>
                  <span className="font-serif text-sm font-bold tracking-tight mt-0.5">
                    {fib.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Specimen dynamic metrics */}
            <div className="lg:col-span-8 bg-white border border-slate-200/80 p-5 md:p-6 space-y-6">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFiber.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-slate-100 pb-3">
                    <h4 className="font-serif text-xl font-bold text-slate-950">
                      {currentFiber.name}
                    </h4>
                    <span className="font-mono text-xs text-[#705030] font-bold">
                      {currentFiber.scientificName}
                    </span>
                  </div>

                  <p className="text-sm font-serif text-slate-600 leading-relaxed italic">
                    "{currentFiber.description}"
                  </p>

                  {/* Scientific specs grid columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-2">
                    
                    {/* Micron gauge slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                        <span>Micron Calibre</span>
                        <span className="text-[#705030]">{currentFiber?.micronRating?.split(' ')?.[0] || 'N/A'}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-none overflow-hidden relative border border-slate-200/40">
                        {/* Shorter micron count = finer luxury fiber */}
                        <div 
                          className="h-full bg-[#705030] transition-all duration-500" 
                          style={{ width: `${Math.max(10, 100 - (parseFloat(currentFiber.micronRating) * 2.8))}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-sans text-slate-400 lowercase block">
                        finer microns deliver higher surface soft cashmere comfort
                      </span>
                    </div>

                    {/* Warmth rating */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                        <span>Warmth Index</span>
                        <span className="text-[#705030]">{currentFiber.warmthFactor}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-none overflow-hidden relative border border-slate-200/40">
                        <div 
                          className="h-full bg-amber-600 transition-all duration-500" 
                          style={{ width: `${currentFiber.warmthFactor}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-sans text-slate-400 lowercase block">
                        represents static air insulation and resistance toBaltic winter loops
                      </span>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">SOURCE PASTURE MEADOW</span>
                      <span className="font-serif text-sm font-bold text-slate-900">{currentFiber.sourceRegion}</span>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">TACTILE GRIP FEEL</span>
                      <span className="font-serif text-sm font-bold text-slate-900">{currentFiber.tactologicalFeel}</span>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">DENSITY / WEIGHT GAUGES</span>
                      <span className="font-serif text-sm font-bold text-slate-900">{currentFiber.weightGsm}</span>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between col-span-1 sm:col-span-2 bg-[#705030]/5 p-2 px-3 border border-[#705030]/10 mt-1">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">CARBON OFFSET DISPATCH INDEX</span>
                      <span className="font-mono text-xs font-bold text-[#705030] tracking-tight">{currentFiber.carbonFootprint}</span>
                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>

            </div>

          </div>
        </div>

        {/* CRITICAL HISTORY TIMELINE STITCH */}
        <div className="space-y-8 mb-16">
          <div>
            <span className="text-[10px] font-mono tracking-[0.25em] font-extrabold text-[#705030] uppercase block mb-2">
              02 / THE HERITAGE STITCH TIMELINE
            </span>
            <h3 className="font-serif text-2xl tracking-normal text-slate-900 font-bold uppercase">
              Wooltown Legacy Milestones
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Horizontal timeline bar for desktop */}
            <div className="absolute top-[16px] left-[10%] right-[10%] h-[1px] bg-slate-200 hidden md:block z-0" />
            
            {timelineMilestones.map((mil, idx) => (
              <div key={idx} className="relative z-10 bg-white border border-slate-100 p-5 flex flex-col justify-between hover:shadow-xs transition-shadow">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-black text-[#705030] tracking-widest block">
                    {mil.year}
                  </span>
                  <h4 className="font-serif text-sm font-bold text-slate-950 uppercase">
                    {mil.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed lowercase">
                    {mil.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Beautiful closure block */}
        <div className="border-t border-slate-200 pt-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="max-w-xl space-y-2">
            <h4 className="font-serif text-lg font-bold text-slate-900 uppercase">
              Have Questions About Fiber Provenance?
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed font-serif">
              Our Stockolm spinning engineers maintains a sovereign transparency record of all lots. You can contact us directly to query exact farms, shearing dates, or ecological offsets of any purchased batch.
            </p>
          </div>
          <a
            href="/contact"
            className="px-6 py-3.5 bg-slate-950 text-white font-mono tracking-widest text-[10px] uppercase font-bold hover:bg-[#705030] transition-colors rounded-none whitespace-nowrap self-start md:self-center"
          >
            Query Fiber Ledger
          </a>
        </div>

      </div>
    </PageTransition>
  );
}
