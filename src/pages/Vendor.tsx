import React, { useState } from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { Button } from '../components/ui/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Award, Briefcase, FileCheck, CheckCircle } from 'lucide-react';

const vendorSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  workshopName: z.string().min(2, "Workshop or brand name is required"),
  craftType: z.string().min(1, "Please select your primary craft"),
  portfolioUrl: z.string().url("Please enters a valid portfolio or studio URL").or(z.string().length(0)),
  pitch: z.string().min(15, "Please describe your materials and process in more detail (min 15 chars)"),
});

type VendorForm = z.infer<typeof vendorSchema>;

export function Vendor() {
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<VendorForm>({
    resolver: zodResolver(vendorSchema)
  });

  const onSubmit = async (data: VendorForm) => {
    setIsSubmitting(true);
    console.log("Submitting Sovereign Supplier Proposal...", data);
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSuccess(true);
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-16 md:pb-24 w-full flex-1 bg-[#FAF9F6]">
        
        {/* Header Layout */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 text-amber-950 border border-amber-300 font-mono text-[9px] uppercase tracking-[0.2em] font-bold">
            Sovereign Vendor Registry
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-slate-900 uppercase">
            Make Money with Wooltown
          </h1>
          <p className="text-sm text-slate-600 font-light leading-relaxed max-w-2xl mx-auto">
            Bring your artisanal lifeware, natural fibers, and sensory technology to a global audience of purists. We operate with a strict 90% artisan payout model with zero setup fee structures.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Charter Column */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
            <div className="border border-slate-200 bg-white p-8 space-y-6">
              <h2 className="text-lg font-serif font-bold text-slate-900 uppercase tracking-tight pb-4 border-b border-slate-150">
                The Sovereign Charter
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="p-3 bg-amber-400/5 text-amber-950 border border-amber-100 flex-shrink-0 h-11 w-11 flex items-center justify-center">
                    <Award className="w-5 h-5 text-[#8a5b29]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-1">90% Sovereign Cut</h3>
                    <p className="text-xxs text-slate-500 font-light leading-relaxed uppercase">Artisans earn 90% of every transaction item directly, paid in real-time within 48 hours of dispatch.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 bg-amber-400/5 text-amber-950 border border-amber-100 flex-shrink-0 h-11 w-11 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-[#8a5b29]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-1">Curation Support</h3>
                    <p className="text-xxs text-slate-500 font-light leading-relaxed uppercase">We optimize product trace metadata and photograph approved batches in our Stockholm studio at zero cost.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 bg-amber-400/5 text-amber-950 border border-amber-100 flex-shrink-0 h-11 w-11 flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-[#8a5b29]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-1">No Trace Fees</h3>
                    <p className="text-xxs text-slate-500 font-light leading-relaxed uppercase">You will never have listing limits, renewal fees, transaction tolls, or advertising blackmail loops.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 bg-[#705030]/10 p-6">
              <p className="font-serif text-[#705030] text-xs italic">
                &ldquo;By placing uncompromised control in the hands of global fabricators, Wooltown seeks to establish an enduring network of unhurried design loops.&rdquo;
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 border border-slate-200 bg-white p-8 md:p-12">
            {success ? (
              <div className="text-center py-12 space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center border border-green-200">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-bold uppercase text-slate-900">PROPOSAL RECEIVED</h3>
                <p className="text-xs text-slate-500 font-mono uppercase tracking-widest max-w-md mx-auto">
                  Your entry has been secured in the Sovereign Supplier ledger. Our curation committee will reach out via email to arrange shipping of physical sample lines.
                </p>
                <div className="pt-6">
                  <button 
                    onClick={() => setSuccess(false)}
                    className="px-6 py-3 border border-slate-300 text-slate-700 hover:text-slate-950 hover:border-slate-800 text-xs font-mono font-bold tracking-widest uppercase transition-all duration-300"
                  >
                    Submit Another Line
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900">Artisan Partnership Form</h3>
                  <p className="text-xxs text-slate-400 font-mono uppercase tracking-widest mt-1">Please provide accurate studio and material origin data.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono tracking-widest uppercase font-bold text-slate-920">Your Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Henrik Larssen"
                      {...register("fullName")}
                      className="w-full px-4 py-3 bg-transparent border border-slate-200 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all font-sans text-sm text-slate-900 placeholder-slate-200"
                    />
                    {errors.fullName && <p className="text-red-500 text-[10px] font-mono mt-1">{errors.fullName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono tracking-widest uppercase font-bold text-slate-920">Studio / Workshop Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Larssen Siltworks"
                      {...register("workshopName")}
                      className="w-full px-4 py-3 bg-transparent border border-slate-200 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all font-sans text-sm text-slate-900 placeholder-slate-200"
                    />
                    {errors.workshopName && <p className="text-red-500 text-[10px] font-mono mt-1">{errors.workshopName.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono tracking-widest uppercase font-bold text-slate-920">Primary Craft Specialty</label>
                    <select 
                      {...register("craftType")}
                      className="w-full px-4 py-3 bg-white border border-slate-200 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all font-sans text-sm text-slate-900"
                    >
                      <option value="">Select Specialty...</option>
                      <option value="apparel">Apparel &amp; Hand-spun Wool</option>
                      <option value="knitwear">Knitwear, Weaving &amp; Loom work</option>
                      <option value="leather">Leatherwork, Footwear &amp; Tanning</option>
                      <option value="textile">Natural Plant Dyeing &amp; Textile Art</option>
                    </select>
                    {errors.craftType && <p className="text-red-500 text-[10px] font-mono mt-1">{errors.craftType.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono tracking-widest uppercase font-bold text-slate-920">Studio Portfolio URL (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="https://yourstudio.com"
                      {...register("portfolioUrl")}
                      className="w-full px-4 py-3 bg-transparent border border-slate-200 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all font-sans text-sm text-slate-900 placeholder-slate-200"
                    />
                    {errors.portfolioUrl && <p className="text-red-500 text-[10px] font-mono mt-1">{errors.portfolioUrl.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-mono tracking-widest uppercase font-bold text-slate-920">Material Trace &amp; Process pitch</label>
                  <textarea 
                    rows={4}
                    placeholder="Briefly describe the origin of your materials, raw chemical states, and physical labor cycles used to trace and assemble your creations."
                    {...register("pitch")}
                    className="w-full px-4 py-3 bg-transparent border border-slate-200 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all font-sans text-sm text-slate-900 placeholder-slate-200"
                  />
                  {errors.pitch && <p className="text-red-500 text-[10px] font-mono mt-1">{errors.pitch.message}</p>}
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-slate-950 text-white hover:bg-slate-900 rounded-none tracking-widest uppercase text-xs h-14" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "TOKENIZING APPLICATION..." : "SUBMIT REGISTRY PROPOSAL"}
                </Button>
              </form>
            )}
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
