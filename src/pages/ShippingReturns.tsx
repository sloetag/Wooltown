import React from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { Truck, RefreshCw, Globe, ShieldAlert } from 'lucide-react';

export function ShippingReturns() {
  return (
    <PageTransition>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-28 md:pt-32 pb-16 md:pb-24 w-full flex-1 bg-[#FAF9F6]">
        {/* Header */}
        <div className="border-b border-slate-200 pb-10 mb-12">
          <span className="text-[10px] font-mono tracking-[0.3em] font-extrabold text-[#705030] uppercase block mb-3">DISPATCH LOGISTICS REGIME</span>
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-slate-950 uppercase">Shipping & Returns</h1>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Quick Pillars Sidebar */}
          <div className="lg:col-span-4 space-y-8 bg-[#EADED2]/10 p-8 border border-slate-200">
            <h3 className="text-xs font-mono font-bold tracking-widest text-slate-950 uppercase border-b border-slate-200/60 pb-4">Logistics Ledger</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-[#705030] flex-shrink-0" />
                <div className="font-mono text-[9px] text-[#705030] uppercase leading-none">
                  <span className="font-bold block mb-1 text-slate-950">COMPLIMENTARY RATES</span>
                  Standard transit is fully absorbed for purchases above $150.
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Globe className="w-5 h-5 text-[#705030] flex-shrink-0" />
                <div className="font-mono text-[9px] text-[#705030] uppercase leading-none">
                  <span className="font-bold block mb-1 text-slate-950">GLOBAL ROUTER</span>
                  Shipments originate from our Copenhagen fulfillment terminal.
                </div>
              </div>

              <div className="flex items-start gap-4">
                <RefreshCw className="w-5 h-5 text-[#705030] flex-shrink-0" />
                <div className="font-mono text-[9px] text-[#705030] uppercase leading-none">
                  <span className="font-bold block mb-1 text-slate-950">CONVENIENT RETURNS</span>
                  Enjoy a seamless 30-day window with pre-printed labels.
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Editorial Policies */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Sec 1 */}
            <div className="space-y-4">
              <h2 className="text-xl font-serif text-slate-950 uppercase tracking-tight">01 / DISPATCH PARAMETERS</h2>
              <p className="text-[#333333] font-light leading-relaxed text-base">
                Each product is packaged in customized protective archival sleeves, completely recycled from low-density organic post-consumer pulp. Shipments processed Monday through Friday at our central transit terminal.
              </p>
              
              <div className="overflow-x-auto pt-4">
                <table className="w-full text-left font-mono text-[10px] tracking-wider uppercase">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400">
                      <th className="pb-3 font-semibold">TRANSIT SYSTEM</th>
                      <th className="pb-3 font-semibold">TIMELINES</th>
                      <th className="pb-3 font-semibold">TARIFFS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-900 font-sans text-xs">
                    <tr>
                      <td className="py-4 font-mono text-[10px] font-bold tracking-widest uppercase">Standard Hub Carrier</td>
                      <td className="py-4 text-slate-500">4 — 7 working intervals</td>
                      <td className="py-4 font-mono font-bold">$15.00 (Comp over $150)</td>
                    </tr>
                    <tr>
                      <td className="py-4 font-mono text-[10px] font-bold tracking-widest uppercase">Priority Cargo Plane</td>
                      <td className="py-4 text-slate-500">2 — 3 working intervals</td>
                      <td className="py-4 font-mono font-bold">$35.00 flat rate</td>
                    </tr>
                    <tr>
                      <td className="py-4 font-mono text-[10px] font-bold tracking-widest uppercase">Bespoke Courier Service</td>
                      <td className="py-4 text-slate-500">Next-day (Select nodes)</td>
                      <td className="py-4 font-mono font-bold">$60.00 flat rate</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sec 2 */}
            <div className="space-y-4 pt-4 border-t border-slate-200/60">
              <h2 className="text-xl font-serif text-slate-950 uppercase tracking-tight">02 / RETURNS & REPLACEMENT PLEDGE</h2>
              <p className="text-[#333333] font-light leading-relaxed text-base">
                Should a product's form or texture fail to meet your architectural standard, you may authorize a replacement within 30 days of receiving your parcel. All returning merchandise must be in its original pristine, unwashed state with tracking tags intact.
              </p>
              <p className="text-[#333333] font-light leading-relaxed text-base">
                To trigger an exchange, pack the items into their shipping container, affix the enclosed prepaid shipping label, and register the parcel at any localized carrier drop box. Refunds are processed back to the original funding account within 5—7 commercial days.
              </p>
            </div>

            {/* Disclaimer box */}
            <div className="border border-slate-200 p-6 flex items-start gap-4 bg-white">
              <ShieldAlert className="w-5 h-5 text-amber-805 text-amber-800 flex-shrink-0 mt-0.5" />
              <div className="font-mono text-[9px] tracking-wide text-slate-500 leading-relaxed uppercase">
                <span className="font-bold block mb-1 text-slate-950">TARIFICATION DISCLAIMER</span>
                Bespoke or low-fired unique studio artworks are non-refundable due to delicate structural integrity in transit. Please contact our concierge desk before processing returns of unique artworks.
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
