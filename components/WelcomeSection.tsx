"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";

export default function WelcomeSection() {
  return (
    <section className="w-full py-20 lg:py-28 bg-[#faf7f2] border-b border-stone-200/60 text-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Sacred Detail Image */}
          <div className="lg:col-span-5 relative">
            <ScrollReveal variant="image-reveal" duration={800}>
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-stone-200 bg-stone-100">
                <Image
                  alt="Altar Darshan with fragrant lotus blossoms, brass bells and glowing ghee lamps in loving offering"
                  className="w-full aspect-[4/5] object-cover object-center"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1VFiZVOf12DJapUelIiEir3VlaRmIKSS4Aq4ouoGELCpqMvKjhDagoOCcfQUzKFGDlf-rVMDuYWLR6N8jVcc4XHpA4BJ8eUkY2l7BvuyIJuCdtbFZ1HCvX02tgj-oc3VpwEN6owDdCz2y7aqhXSuK-WPGipbQ8iOz819RWgyNLQvK8rw2R6-oGGy53-WMN3Dtxz4AlX2qEi2_eRpxZaZwc6k8J4NeU4ynXsYJfeIUcu9zrxPH9NbASVTh8"
                  width={500}
                  height={625}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-6 sm:p-7 text-white">
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-300 font-semibold mb-1">
                    Sri Sri Radha Krishna
                  </p>
                  <p className="font-serif text-base sm:text-lg font-light leading-snug text-slate-100">
                    Altar Darshan &amp; Sacred Daily Offerings
                  </p>
                </div>
              </div>
              {/* Decorative subtle accent plate */}
              <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-amber-200/60 rounded-2xl -z-10 hidden sm:block border border-amber-300/40"></div>
            </ScrollReveal>
          </div>

          {/* Right Column: Narrative Editorial */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            <ScrollReveal variant="fade-up" delay={100}>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-amber-800 uppercase mb-3">
                <span className="w-2 h-0.5 bg-amber-700"></span>
                <span>Welcome to ISKCON Vartak Nagar</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900 tracking-tight leading-[1.2]">
                A Home for Devotion, Community &amp;{" "}
                <span className="italic text-amber-700">Spiritual Growth</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={200}>
              <p className="text-sm sm:text-base text-slate-600 leading-[1.75] font-normal">
                Nestled at the serene foothills near Upvan in Thane West, ISKCON Vartak
                Nagar is a vibrant center for the practice and propagation of Gaudiya
                Vaishnava traditions. We warmly invite seekers, families, youths, and
                pilgrims from all walks of life to experience inner tranquility.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-[1.75] font-normal mt-4">
                Through the timeless wisdom of the Bhagavad-gita, the soul-stirring
                resonance of Maha-Mantra kirtan, and sanctified prasadam distribution,
                we strive to bring sublime joy and spiritual replenishment to modern
                lives.
              </p>
            </ScrollReveal>



            <ScrollReveal variant="fade-up" delay={400} className="pt-3">
              <Link
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-700 hover:text-amber-900 transition-colors uppercase tracking-wider"
                href="/about"
              >
                <span>Learn More About Our Mission</span>
                <span className="material-symbols-outlined text-base">
                  arrow_forward
                </span>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
