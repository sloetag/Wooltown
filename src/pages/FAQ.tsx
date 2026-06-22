import React, { useState } from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleItem = (key: string) => {
    if (openIndex === key) {
      setOpenIndex(null);
    } else {
      setOpenIndex(key);
    }
  };

  const faqCategories: FAQCategory[] = [
    {
      title: "Material Sourcing & Origin",
      items: [
        {
          question: "Where are Wooltown heritage fibers sourced?",
          answer: "Our ultra-fine merino wool is gathered from historic multi-generational pastures in the Southern Alps of New Zealand. Our rare cashmere down is hand-vetted from sheep in the Altai Highlands of Mongolia. Every fiber is completely documented and authenticated to ensure no carbon-loaded processes."
        },
        {
          question: "How do you define structural sustainability?",
          answer: "We define sustainability by absolute product life cycles. Every weave is reinforced with robust double-locked locking stitches so articles survive generations rather than seasons. We utilize natural, non-toxic dyes and unlined interiors for native, compostable breathability."
        }
      ]
    },
    {
      title: "Warp, Weave & Product Care",
      items: [
        {
          question: "How should I clean my Wooltown merino garment?",
          answer: "Because high-grade raw wool has native resistance qualities to bacteria and humidity, you rarely need to wash it. Simply hang the garment in a fresh air environment to reset. If a wash is absolutely required, hand-wash in chilled water using natural wool soap, dry flat, and never rub the fibers."
        },
        {
          question: "Why do some articles have a subtle organic scent?",
          answer: "Our waxed cotton canvases and untreated wool blends preserve their natural lanolin and organic paraffin coatings, providing full wind protection and high thermal resistance without synthetic polymer sealants. This safe, rustic aroma is a natural indicator of uncompromised material integrity and will gently fade with wear."
        }
      ]
    },
    {
      title: "Commercial & Private Commissions",
      items: [
        {
          question: "Are custom studio artworks returnable?",
          answer: "Low-fired unique ceramic pieces and gestural hand-drawn line artworks are considered one-of-a-kind bespoke creations. To maintain their fragile structural integrity in transit, these pieces cannot be returned. We invite collectors to consult directly with our desk for custom photographs prior to ordering."
        },
        {
          question: "Does Wooltown supply custom commercial tailoring?",
          answer: "Yes. For corporate headquarters, luxury hotel staff, or editorial events, our studio operates a custom commercial tailoring program. We design synchronized aesthetic garments matched to your spatial architecture. Contact our global desk for details."
        }
      ]
    }
  ];

  return (
    <PageTransition>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-28 md:pt-32 pb-16 md:pb-24 w-full flex-1 bg-[#FAF9F6]">
        {/* Header */}
        <div className="border-b border-slate-200 pb-10 mb-12">
          <span className="text-[10px] font-mono tracking-[0.3em] font-extrabold text-[#705030] uppercase block mb-3">CONCIERGE SCHEMA INDEX</span>
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-slate-950 uppercase">Frequently Asked</h1>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Sincere Left Panel introduction */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-lg font-serif italic text-slate-800 font-light">
              Clear answers, absolute transparency.
            </h3>
            <p className="text-slate-500 font-light text-sm leading-relaxed">
              Below, explore the registry of queries most frequently submitted to our concierge desk. If the solution to your contextual need is missing, connect directly via our contact pathways.
            </p>
          </div>

          {/* Interactive Toggle Stack Column */}
          <div className="lg:col-span-8 space-y-12">
            
            {faqCategories.map((cat, catIndex) => (
              <div key={catIndex} className="space-y-4">
                <h3 className="font-mono text-[10px] tracking-[0.25em] text-amber-800 uppercase font-bold border-b border-slate-100 pb-3">
                  {cat.title}
                </h3>
                
                <div className="divide-y divide-slate-200/60 border-b border-slate-200/60">
                  {cat.items.map((item, itemIndex) => {
                    const uniqueKey = `${catIndex}-${itemIndex}`;
                    const isOpen = openIndex === uniqueKey;
                    
                    return (
                      <div key={itemIndex} className="py-5">
                        <button
                          onClick={() => toggleItem(uniqueKey)}
                          className="w-full flex justify-between items-center text-left gap-4 group focus:outline-none"
                        >
                          <span className="font-serif text-base md:text-lg text-slate-950 tracking-tight leading-tight group-hover:text-amber-800 transition-colors">
                            {item.question}
                          </span>
                          <span className="flex-shrink-0 text-slate-400 group-hover:text-slate-950 transition-colors">
                            {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          </span>
                        </button>
                        
                        {/* Animated expanding container */}
                        <div 
                          className={`grid transition-all duration-300 ease-in-out ${
                            isOpen ? "grid-rows-[1fr] opacity-100 pt-4" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <p className="text-[#333333] font-light text-sm md:text-base leading-relaxed max-w-2xl bg-slate-50 p-4 border-l-2 border-slate-900 font-sans">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
