import { PageTransition } from '../components/layout/PageTransition';

export function Privacy() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-6 pt-28 md:pt-36 pb-16 md:pb-24 bg-white text-slate-800">
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-amber-800">LEGAL COMPLIANCE</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-slate-900 mt-2 mb-8 uppercase">Privacy Policy</h1>
        
        <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-10 h-3">Last updated: May 2026</p>
        
        <div className="space-y-8 font-serif text-sm leading-relaxed text-slate-600">
          <p>
            At Wooltown, we are committed to respecting your privacy in accordance with the highest standards of integrity. This Policy describes how your personal credentials, browse metrics, and purchasing logs are securely handled.
          </p>

          <h3 className="font-serif font-bold text-slate-900 text-lg uppercase tracking-tight pt-4">1. Data Selection Elements</h3>
          <p>
            We process minimal data necessary to fulfill your orders and elevate your interactive session. This includes identification data (your registered name, email address, physical layout destination) and payment verification indices processed strictly through secure tokenized channels.
          </p>

          <h3 className="font-serif font-bold text-slate-900 text-lg uppercase tracking-tight pt-4">2. Interactive Cookie Usage</h3>
          <p>
            Our interface utilizes cookies and secure localized storage protocols. These elements allow our systems to save chosen items inside your cart reserve, identify signed-in sessions across restarts, and deliver fluid transitions. You retain full control over these cookies via your browser settings or our persistent Consent Banner.
          </p>

          <h3 className="font-serif font-bold text-slate-900 text-lg uppercase tracking-tight pt-4">3. Absolute Non-Disclosure</h3>
          <p>
            Wooltown does not trade, distribute, lease, or monetize user data under any environment. Your metrics are shared only with logistics carriers directly assigned to transport your physical pieces.
          </p>

          <h3 className="font-serif font-bold text-slate-900 text-lg uppercase tracking-tight pt-4">4. Security Measures</h3>
          <p>
            We deploy strict physical and cryptographic access barriers on all server architectures to protect your credentials. Personal storage elements are managed cleanly through standard TLS encryption.
          </p>

          <h3 className="font-serif font-bold text-slate-900 text-lg uppercase tracking-tight pt-4">5. Contact and Adjustments</h3>
          <p>
            Should you request full eradication or copies of your registered details, contact our specialized legal compliance line at <a href="mailto:privacy@wooltown.com" className="text-slate-950 underline hover:text-amber-800">privacy@wooltown.com</a>.
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
