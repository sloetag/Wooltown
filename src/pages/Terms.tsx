import { PageTransition } from '../components/layout/PageTransition';

export function Terms() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-6 pt-28 md:pt-36 pb-16 md:pb-24 bg-white text-slate-800">
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-amber-800">LEGAL COMPLIANCE</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-slate-900 mt-2 mb-8 uppercase">Terms of Service</h1>
        
        <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-10 h-3">Last updated: May 2026</p>
        
        <div className="space-y-8 font-serif text-sm leading-relaxed text-slate-600">
          <p>
            Welcome to Wooltown. By accessing our interface and acquiring any lifeware artifacts, you agree to comply with and be bound by the following Terms. Please read them thoroughly before proceeding with your selection.
          </p>

          <h3 className="font-serif font-bold text-slate-900 text-lg uppercase tracking-tight pt-4">1. Acquisition and Ordering</h3>
          <p>
            All coordinates, listing specifications, and prices of lifeware components are subject to correction without prior warning. By finalizing placement, you represent that you possess authentic payment methods and are authorized to authorize payment. We reserve the right to restrict or cancel quantities acquired per client at our discretion.
          </p>

          <h3 className="font-serif font-bold text-slate-900 text-lg uppercase tracking-tight pt-4">2. Interactive Engagement Rules</h3>
          <p>
            You agree not to deploy automated agents, web scrapers, or other dynamic mechanical systems to index our offerings. Users are restricted from uploading malicious structures or injecting unauthorized elements into Wooltown servers.
          </p>

          <h3 className="font-serif font-bold text-slate-900 text-lg uppercase tracking-tight pt-4">3. Custom Product Integrity</h3>
          <p>
            Our artifacts are hand-finished and designed with high-grade organic elements. Subtle variances in texture, coloration gradients, and basalt grains are characteristics of exceptional artisanal production, rather than flaws, and are explicitly celebrated.
          </p>

          <h3 className="font-serif font-bold text-slate-900 text-lg uppercase tracking-tight pt-4">4. Intellectual Property Rights</h3>
          <p>
            The typography systems, layout structures, proprietary vector models, photographs, and the trademark "Wooltown" are the exclusive assets of Wooltown and our direct partners, protected under international copyright protocols.
          </p>

          <h3 className="font-serif font-bold text-slate-900 text-lg uppercase tracking-tight pt-4">5. Reaching Out</h3>
          <p>
            Inquiries regarding our standard user agreements may be forwarded to our legal assistance line at <a href="mailto:terms@wooltown.com" className="text-slate-950 underline hover:text-amber-800">terms@wooltown.com</a>.
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
