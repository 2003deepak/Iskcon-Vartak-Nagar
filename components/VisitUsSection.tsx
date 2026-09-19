"use client";

import ScrollReveal from "@/components/ScrollReveal";

export default function VisitUsSection() {
  return (
    <section className="w-full py-20 bg-[#0d1e36] text-slate-100" id="visit">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-amber-400 uppercase mb-2">
              <span className="w-2 h-0.5 bg-amber-400"></span>
              <span>Visit Us</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-white tracking-tight">
              Plan Your Temple Visit
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Address & Details Panel */}
          <ScrollReveal variant="fade-up" delay={100} className="lg:col-span-5 h-full">
            <div className="h-full p-8 rounded-3xl bg-white/[0.04] border border-white/10 shadow-xl backdrop-blur-xs flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/25 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-2xl">
                      location_on
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      Address
                    </h3>
                    <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                      Dharmveer Anand Dighe Saheb, New Mhadha Colony, Vartak Nagar, Thane West, Thane, Maharashtra 400606
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/25 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-2xl">
                      schedule
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      Darshan Timings
                    </h3>
                    <div className="text-sm text-slate-300 mt-1 leading-relaxed space-y-1">
                      <p><strong className="font-medium text-white">Morning:</strong> 4:30 AM – 12:30 PM</p>
                      <p><strong className="font-medium text-white">Evening:</strong> 4:00 PM – 8:30 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
                <a
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-full bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md text-center"
                  href="https://maps.google.com/?q=Vartak+Nagar+ISKCON+CENTER"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined text-base">
                    directions
                  </span>
                  Get Directions
                </a>
                <a
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-semibold uppercase tracking-wider transition-colors text-center"
                  href="tel:+912225800000"
                >
                  <span className="material-symbols-outlined text-base">
                    call
                  </span>
                  Contact Us
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Interactive Map Element */}
          <ScrollReveal variant="fade-up" delay={200} className="lg:col-span-7 h-full min-h-[380px] lg:min-h-[420px]">
            <div className="w-full h-full rounded-3xl overflow-hidden shadow-xl min-h-[380px] lg:min-h-[420px] bg-[#060d18] border border-white/10 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3767.578600241133!2d72.96087417934571!3d19.213599400000014!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b9a047a1ad3b%3A0x4c061f8383422c52!2sVartak%20Nagar%20ISKCON%20CENTER!5e0!3m2!1sen!2sin!4v1789189511411!5m2!1sen!2sin"
                className="w-full h-full absolute inset-0 border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
