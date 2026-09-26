"use client";

import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

export default function PrabhupadaTribute() {
  return (
    <section
      className="w-full py-10 sm:py-12 lg:py-14 bg-[#0a1628] border-b border-white/5 text-slate-100 overflow-hidden flex items-center"
      id="about"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Acharya Image Container */}
          <div className="lg:col-span-5 flex justify-center">
            <ScrollReveal variant="image-reveal" duration={800} className="w-full flex justify-center">
              <div className="relative max-w-[280px] sm:max-w-[320px] lg:max-w-[340px] w-full">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-[#060d18] border border-white/10">
                  <Image
                    alt="Historical archival portrait of His Divine Grace A.C. Bhaktivedanta Swami Prabhupada"
                    className="w-full aspect-[4/5] object-cover object-top max-h-[380px] sm:max-h-[420px]"
                    src="/prabhupad.jpg"
                    width={400}
                    height={500}
                    priority
                  />
                  <div className="p-3 sm:p-3.5 bg-[#060d18] border-t border-white/10 text-center">
                    <span className="text-[11px] font-semibold text-slate-300 block">
                      His Divine Grace
                    </span>
                    <span className="text-xs text-amber-400 tracking-wider uppercase font-semibold mt-0.5 block">
                      A.C. Bhaktivedanta Swami Prabhupada
                    </span>
                  </div>
                </div>
                {/* Decorative backing offset */}
                <div className="absolute -top-2.5 -left-2.5 w-full h-full rounded-2xl bg-amber-500/10 border border-amber-500/20 -z-10"></div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Biography & Shloka Tribute */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
            <ScrollReveal variant="fade-up" delay={100}>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-amber-400 uppercase mb-1.5">
                <span className="w-2 h-0.5 bg-amber-400"></span>
                <span>Founder-Acharya</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-tight leading-snug">
                The Vision That Became a{" "}
                <span className="italic text-[#fce8b8]">Global Movement</span>
              </h2>
            </ScrollReveal>

            {/* Sacred Shloka Card - High Visibility & Readability */}
            <ScrollReveal variant="fade-up" delay={200}>
              <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-amber-500/10 via-slate-900/80 to-[#0a1628] border-l-4 border-l-amber-400 border border-white/10 shadow-lg space-y-2.5">

                <p className="font-serif text-base sm:text-lg font-medium text-[#fde68a] leading-relaxed tracking-wide">
                  kaler doṣa-nidhe rājann asti hy eko mahān guṇaḥ<br />
                  kīrtanād eva kṛṣṇasya mukta-saṅgaḥ paraṁ vrajet
                </p>

                <p className="text-xs sm:text-sm text-slate-100 font-normal leading-relaxed pt-1 border-t border-white/10">
                  <span className="italic text-slate-300">“My dear King, although Kali-yuga is an ocean of faults, there is still one magnificent quality about this age: simply by chanting the holy names of Lord Kṛṣṇa, one can become free from material bondage and attain the supreme spiritual kingdom.”</span>
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={300}>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                In 1965, at the age of sixty-nine, Srila Prabhupada journeyed alone from India to New York aboard a steamship with only seven dollars and a trunk of translated Vedic literatures. In twelve brief years, he circumnavigated the globe fourteen times, translating dozens of authoritative sacred volumes and establishing over a hundred temples worldwide.
              </p>

            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
