"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

export default function VisitUsSection() {
  return (
    <section
      className="relative w-full py-20 lg:py-32 bg-[#060e1b] text-slate-100 overflow-hidden border-t border-b border-amber-500/15"
      id="visit"
    >
      {/* Background Ambient Layers & Subtle Decorative Glows */}
      <div className="absolute inset-0 bg-radial-gradient from-[#11233d] via-[#060e1b] to-[#040811] opacity-90" />
      <div className="absolute -top-40 -right-40 w-[550px] h-[550px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[550px] h-[550px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Background Pattern / Watermark */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#dfb260_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/25 text-xs font-semibold tracking-[0.25em] text-amber-300 uppercase shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#dfb260] animate-pulse shadow-[0_0_8px_#dfb260]" />
              <span>Thane Sanctuary</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-[#fce8b8] tracking-tight leading-tight">
              Visit ISKCON Vartak Nagar
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-slate-200/90 font-light leading-relaxed max-w-2xl mx-auto">
              A sacred oasis of peace, soul-stirring kirtan, and spiritual wisdom nestled near Upvan in Thane West. We warmly welcome you and your family for darshan and blessings.
            </p>
          </div>
        </ScrollReveal>

        {/* Main Grid: Information Showcase + Map & Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Sacred Timings & Address Card */}
          <ScrollReveal variant="fade-up" delay={100} className="lg:col-span-6 h-full flex flex-col">
            <div className="h-full p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-amber-500/20 shadow-2xl backdrop-blur-md flex flex-col justify-between space-y-8">
              <div className="space-y-7">
                {/* Temple Name Block */}
                <div className="border-b border-white/10 pb-5">
                  <span className="text-[20px] font-semibold uppercase tracking-[0.2em] text-[#e6ca85] block mb-1">
                    ISKCON Vartak Nagar
                  </span>

                </div>

                {/* Address Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
                    <span className="material-symbols-outlined text-2xl">location_on</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-300/90 mb-1">
                      Temple Address
                    </h4>
                    <p className="text-sm text-slate-200 leading-relaxed font-light">
                      Dharmveer Anand Dighe Saheb, New Mhadha Colony, Vartak Nagar, Thane West, Thane, Maharashtra 400606
                    </p>
                  </div>
                </div>

                {/* Darshan & Temple Timings Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Temple Schedule */}
                  <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-1">
                    <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1">
                      <span className="material-symbols-outlined text-base">schedule</span>
                      <span>Temple Hours</span>
                    </div>
                    <p className="text-sm font-medium text-white">4:30 AM – 8:30 PM</p>
                    <p className="text-xs text-slate-400 font-light">Open daily for all visitors</p>
                  </div>

                  {/* Darshan Slots */}
                  <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-1">
                    <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1">
                      <span className="material-symbols-outlined text-base">visibility</span>
                      <span>Daily Darshan</span>
                    </div>
                    <p className="text-xs text-slate-200">
                      <strong className="text-white font-medium">Morning:</strong> 4:30 AM – 12:30 PM
                    </p>
                    <p className="text-xs text-slate-200">
                      <strong className="text-white font-medium">Evening:</strong> 4:00 PM – 8:30 PM
                    </p>
                  </div>
                </div>

              </div>

              {/* Action Buttons: Highly Visible Primary CTA + Secondary CTA */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
                <a
                  className="flex-1 inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-full bg-[#dfb260] hover:bg-[#cca04b] text-[#060e1b] text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md shadow-amber-950/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-950/40 active:translate-y-0 transition-all duration-200 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                  href="https://maps.google.com/?q=Vartak+Nagar+ISKCON+CENTER"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined text-lg">directions</span>
                  <span>Get Directions</span>
                </a>

                <Link
                  href="/#schedule"
                  className="flex-1 inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-full bg-transparent hover:bg-[#dfb260]/10 border-[1.5px] border-[#dfb260] text-[#dfb260] hover:text-[#fce8b8] text-xs sm:text-sm font-semibold uppercase tracking-wider hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-center"
                >
                  <span className="material-symbols-outlined text-lg">calendar_month</span>
                  <span>View Temple Timings</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Interactive Map & Temple Visual */}
          <ScrollReveal variant="fade-up" delay={200} className="lg:col-span-6 h-full min-h-[420px] lg:min-h-[500px]">
            <div className="h-full w-full rounded-3xl overflow-hidden shadow-2xl bg-[#060d18] border border-amber-500/25 relative flex flex-col justify-between">
              {/* Interactive Google Map iframe */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3767.578600241133!2d72.96087417934571!3d19.213599400000014!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b9a047a1ad3b%3A0x4c061f8383422c52!2sVartak%20Nagar%20ISKCON%20CENTER!5e0!3m2!1sen!2sin!4v1789189511411!5m2!1sen!2sin"
                className="w-full h-full absolute inset-0 border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="ISKCON Vartak Nagar Location Map"
              />

              {/* Floating Live Indicator Badge in Map */}
              <div className="absolute top-5 left-5 z-10 pointer-events-none">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#060e1b]/90 backdrop-blur-md border border-amber-500/30 text-white text-xs shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                  <span className="font-medium text-[11px] tracking-wide text-slate-100">Open For Darshan</span>
                </div>
              </div>

              {/* Bottom Map Quick Action Bar */}
              <div className="absolute bottom-5 left-5 right-5 z-10">
                <div className="p-4 rounded-2xl bg-[#060e1b]/95 backdrop-blur-md border border-white/15 shadow-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-amber-400/30">
                      <Image
                        src="/logo_white.png"
                        alt="ISKCON Logo"
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">ISKCON Vartak Nagar</p>
                      <p className="text-[11px] text-slate-300 font-light">Thane West, Maharashtra</p>
                    </div>
                  </div>

                  <a
                    href="tel:+919322881265"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-amber-500 hover:text-slate-900 text-slate-200 text-xs font-semibold transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">call</span>
                    <span>Contact</span>
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

