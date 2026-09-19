"use client";

import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

export default function PrabhupadaTribute() {
  return (
    <section className="w-full py-20 bg-[#0a1628] border-b border-white/5 text-slate-100 overflow-hidden" id="about">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Acharya Image Container */}
          <div className="lg:col-span-5 flex justify-center">
            <ScrollReveal variant="image-reveal" duration={800} className="w-full flex justify-center">
              <div className="relative max-w-sm w-full">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-[#060d18] border border-white/10">
                  <Image
                    alt="Historical archival portrait of His Divine Grace A.C. Bhaktivedanta Swami Prabhupada"
                    className="w-full aspect-[3/4] object-cover object-top"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuANWrlSG_pA_DFAbQCqUX9BcY4AcgeoYAxv9UUUgcAwVAUtcvC6Qy18tLrxP5NNEnhk6bkKjoaAm7KSGR1bqPIBIR1qBdTPR4U8oi6IfM4SztMCOklqNSYw0pyxRrxInX3sUsaVqh5MGvCjuxh9u4EyJZ0oR5I1a07VgEJ1o_VOPUt64fHI_82S4UeqkqMTjL5IUv5LUpQDoQ9Vtifqcy9sKyShBdyQxl5EhgR4ZCy9xz3ixcZEi38n"
                    width={400}
                    height={533}
                  />
                  <div className="p-4 bg-[#060d18] border-t border-white/10 text-center">
                    <span className="text-xs font-semibold text-white block">
                      His Divine Grace
                    </span>
                    <span className="text-[11px] text-amber-400 tracking-wider uppercase font-medium">
                      A.C. Bhaktivedanta Swami Prabhupada
                    </span>
                  </div>
                </div>
                {/* Decorative backing offset */}
                <div className="absolute -top-3 -left-3 w-full h-full rounded-2xl bg-amber-500/10 border border-amber-500/20 -z-10"></div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Biography & Tribute */}
          <div className="lg:col-span-7 space-y-6">
            <ScrollReveal variant="fade-up" delay={100}>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-amber-400 uppercase mb-3">
                <span className="w-2 h-0.5 bg-amber-400"></span>
                <span>Founder-Acharya</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-white tracking-tight leading-tight">
                The Vision That Became a{" "}
                <span className="italic text-[#fce8b8]">Global Movement</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={200}>
              <blockquote className="p-5 rounded-xl bg-white/[0.04] border-l-2 border-amber-400 text-xs sm:text-sm italic text-slate-200 leading-relaxed backdrop-blur-xs">
                “In this age of quarrel and hypocrisy, the only means of deliverance
                is the chanting of the Holy Names of the Lord. There is no other way,
                no other way, no other way.”
              </blockquote>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={300}>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                In 1965, at the advanced age of sixty-nine, Srila Prabhupada traveled alone
                from India to New York aboard a steamship, carrying nothing more than seven
                dollars and a trunk of translated Vedic literatures. In twelve brief years,
                he circumnavigated the globe fourteen times, translating dozens of volumes of
                authoritative sacred texts and establishing over a hundred temples worldwide.
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-4">
                ISKCON Vartak Nagar stands proudly as an extension of his unconditional
                compassion – bringing the pure tradition of Sanatana Dharma to the residents
                of Thane.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={400} className="pt-2">
              <a
                className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider hover:text-amber-300 transition-colors"
                href="#"
              >
                <span>Discover Srila Prabhupada&apos;s Journey</span>
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </a>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
