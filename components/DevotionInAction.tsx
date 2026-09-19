"use client";

import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";

export default function DevotionInAction() {
  const initiatives = [
    {
      icon: "soup_kitchen",
      title: "Food for Life",
      description:
        "Distributing nutritious sanctified hot meals daily to underprivileged children and hospital waiting halls in Thane.",
    },
    {
      icon: "auto_stories",
      title: "Vedic Literature",
      description:
        "Circulating authentic translations of Bhagavad-gita and Srimad Bhagavatam across public reading stalls.",
    },
    {
      icon: "campaign",
      title: "Harinama Sankirtan",
      description:
        "Sharing the peace-inducing vibration of the Maha-Mantra weekly around Upvan Lake and Talao Pali.",
    },
    {
      icon: "volunteer_activism",
      title: "Volunteer Seva",
      description:
        "Offer your skills in flower garland making, altar preparation, cooking prasadam, photography, or audio engineering.",
    },
  ];

  return (
    <section className="w-full bg-[#0a1628] text-white py-20 lg:py-28 relative overflow-hidden border-b border-white/5">
      {/* Decorative ambient radial background accents */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-16">
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <ScrollReveal variant="fade-up">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-xs font-semibold tracking-[0.25em] text-amber-300 uppercase mb-4 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Seva &amp; Community Service</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight leading-tight text-white">
                Devotion in Action: <br />
                <span className="italic text-[#dfb260]">
                  Compassion for Every Soul
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300/90 leading-[1.75] font-light mt-4">
                Bhakti becomes truly alive when it radiates outward as loving service
                to society. At ISKCON Vartak Nagar, our volunteers actively feed the hungry,
                distribute timeless wisdom, and uplift humanity through unmotivated compassion.
              </p>
            </ScrollReveal>

            {/* 4 Initiatives Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {initiatives.map((item, idx) => (
                <ScrollReveal key={idx} variant="fade-up" delay={idx * 80}>
                  <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-amber-400/30 transition-all duration-300 space-y-2">
                    <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg text-amber-400">
                        {item.icon}
                      </span>
                      {item.title}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal variant="fade-up" delay={300}>
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#dfb260] hover:bg-[#cca04b] text-[#060e1b] text-xs font-bold uppercase tracking-wider shadow-md shadow-amber-950/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-950/40 active:translate-y-0 transition-all duration-200"
                  href="/support-us#donate"
                >
                  <span>Find Your Seva</span>
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </a>
                <a
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-transparent hover:bg-[#dfb260]/10 border-[1.5px] border-[#dfb260] text-[#dfb260] hover:text-[#fce8b8] text-xs font-semibold uppercase tracking-wider hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                  href="/support-us#volunteer"
                >
                  Become a Volunteer
                </a>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Congregation photo */}
          <div className="lg:col-span-5 relative">
            <ScrollReveal variant="image-reveal" duration={800}>
              <div className="rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  alt="Devotees sitting together singing joyful devotional kirtan with mridanga drum and hand cymbals"
                  className="w-full aspect-[4/3] object-cover object-center"
                  src="/congregation.jpg"
                  width={600}
                  height={450}
                />
              </div>
            </ScrollReveal>
          </div>
        </div>

      </div>
    </section>
  );
}
