"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";


export default function WelcomeSection() {
  return (
    <section className="w-full py-20 lg:py-28 bg-[#faf7f2] border-b border-stone-200/60 text-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Sacred Detail Image */}

          <div className="lg:col-span-6 relative flex justify-center">
            <ScrollReveal variant="image-reveal" duration={800} className="w-full max-w-2xl lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 bg-stone-100 group transition-all duration-500 hover:shadow-amber-950/15">
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    alt="Sri Sri Gaur Nitai Altar Darshan with sacred daily offerings and festive decorations"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    src="/gaur_nitai_3.jpg"
                    width={800}
                    height={1000}
                    priority
                  />
                </div>
              </div>
              {/* Decorative subtle accent plate */}
              <div className="absolute -bottom-4 -right-4 w-36 h-36 bg-amber-200/50 rounded-3xl -z-10 hidden sm:block border border-amber-300/40"></div>
            </ScrollReveal>
          </div>

          {/* Right Column: Narrative Editorial */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-6">
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