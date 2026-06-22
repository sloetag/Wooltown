import React, { useState } from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { Button } from '../components/ui/Button';
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Inquiry', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      console.log('Contact inquiry dispatching...', formData);
      setFormSubmitted(true);
      setFormData({ name: '', email: '', subject: 'Inquiry', message: '' });
      setTimeout(() => setFormSubmitted(false), 5000);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-28 md:pt-32 pb-16 md:pb-24 w-full flex-1 bg-[#FAF9F6]">
        {/* Header */}
        <div className="border-b border-slate-200 pb-10 mb-12">
          <span className="text-[10px] font-mono tracking-[0.3em] font-extrabold text-amber-805 text-[#705030] uppercase block mb-3">GLOBAL CONTEXT DESK</span>
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-slate-950 uppercase">Contact Wooltown</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-8">
            <p className="text-lg text-slate-600 font-light leading-relaxed">
              We operate on an uncompromising standard of inquiry tracking. For direct customer consultations, architectural fabric samples, or press coordinates, align below.
            </p>

            <div className="space-y-6 pt-6 border-t border-slate-200/60 font-mono text-xs text-slate-900">
              <div className="flex items-start gap-4">
                <MapPin className="w-4 h-4 text-amber-850 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold tracking-widest uppercase mb-1">HEADQUARTERS NODE</h4>
                  <p className="text-slate-500 font-sans text-sm">74 Archival Way, Suite 400<br />Copenhagen, 1256, Denmark</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-4 h-4 text-amber-850 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold tracking-widest uppercase mb-1">ELECTRONIC COORDINATES</h4>
                  <p className="text-slate-500 font-sans text-sm hover:underline">
                    <a href="mailto:concierge@wooltown.co">concierge@wooltown.co</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-4 h-4 text-amber-850 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold tracking-widest uppercase mb-1">COMMUNICATION PATHWAY</h4>
                  <p className="text-slate-500 font-sans text-sm">+45 88 04 CODES</p>
                </div>
              </div>
            </div>

            {/* Side Aesthetic Image Block */}
            <div className="aspect-[16/10] overflow-hidden border border-slate-200">
              <img 
                src="https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&q=80&w=800" 
                alt="Studio Corner"
                className="w-full h-full object-cover filter brightness-[95%] saturate-[90%]" 
              />
            </div>
          </div>

          {/* Contact Form Desk */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-12 border border-slate-200">
              <h3 className="text-[11px] font-mono font-bold text-slate-950 uppercase tracking-widest border-b border-slate-100 pb-4 mb-6">Dispatch Message Record</h3>
              
              {formSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 bg-amber-50 text-amber-900 border border-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-serif text-slate-950 uppercase">Transmission Successful</h4>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                    Our digital concierge registry has processed your transmission. Typical response latency: &lt; 4 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">Your Full Name *</label>
                    <input 
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-transparent border border-slate-200 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-sm" 
                      placeholder="e.g. Samuel Archival"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">Your Email Pathway *</label>
                    <input 
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-transparent border border-slate-200 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-sm" 
                      placeholder="e.g. samuel@archival.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">Subject Alignment</label>
                    <select 
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-transparent border border-slate-200 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-sm uppercase font-mono tracking-wider"
                    >
                      <option value="Inquiry">General Inquiry</option>
                      <option value="Sourcing">Raw Material Sourcing</option>
                      <option value="Bespoke">Bespoke Fitting & Press</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">Message Body *</label>
                    <textarea 
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-transparent border border-slate-200 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-sm resize-none" 
                      placeholder="Specify your inquiry requirements..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-slate-950 text-white hover:bg-slate-900 rounded-none tracking-widest uppercase text-xs h-14"
                  >
                    DISPATCH STRIPE RECORD
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
