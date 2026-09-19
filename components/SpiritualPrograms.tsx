"use client";

import ScrollReveal from "@/components/ScrollReveal";

export default function SpiritualPrograms() {
  const programs = [
    {
      icon: "psychology",
      category: "Youth Forum (FOLK)",
      title: "Friends of Lord Krishna",
      description:
        "Equipping college youth & young professionals with timeless spiritual values, stress resilience, and deep meaningful friendships.",
      linkText: "Explore FOLK",
      targetAudience: "Ages 18–30",
    },
    {
      icon: "child_care",
      category: "Children Circle",
      title: "Gopal Fun School",
      description:
        "Joyful weekend schooling with Vedic storytelling, shloka chanting, dramas, and value-based character building for young minds.",
      linkText: "Enroll Your Child",
      targetAudience: "Ages 5–14",
    },
    {
      icon: "diversity_1",
      category: "Families & Elders",
      title: "Bhakti Vriksha Cells",
      description:
        "Intimate weekly satsangs held in neighborhood homes across Thane. Grow in devotion together through discussion and prasadam.",
      linkText: "Find Nearest Circle",
      targetAudience: "All Welcome",
    },
    {
      icon: "menu_book",
      category: "Foundations Course",
      title: "Discover Yourself",
      description:
        "Structured 6-session foundation course on Bhagavad-gita As It Is tackling deep existential questions with logical precision.",
      linkText: "Join Next Batch",
      targetAudience: "6-Week Course",
    },
  ];

  return (
    <section className="w-full py-20 lg:py-24 bg-[#0a1628] text-slate-100 border-b border-white/5 relative overflow-hidden" id="programs">
      {/* Decorative ambient radial background accents */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-xs font-semibold tracking-[0.2em] text-amber-300 uppercase mb-4 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Spiritual Growth</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight">
              Programs for Every Stage of Life
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed font-light">
              Whether you are a university student, a young family, or an earnest seeker, we have an encouraging circle for your spiritual journey.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {programs.map((prog, idx) => (
            <ScrollReveal
              key={idx}
              variant="fade-up"
              delay={idx * 100}
              className="h-full"
            >
              <div className="group h-full p-6 lg:p-7 rounded-2xl lg:rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] hover:from-white/[0.09] hover:to-amber-500/[0.04] border border-white/10 hover:border-amber-400/40 transition-all duration-300 shadow-md hover:shadow-2xl hover:shadow-amber-950/30 transform hover:-translate-y-1.5 flex flex-col justify-between">
                <div>
                  {/* Top Category Badge & Audience */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/15 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                      {prog.category}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {prog.targetAudience}
                    </span>
                  </div>

                  {/* Icon Medallion */}
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-500/5 border border-amber-400/30 text-amber-300 flex items-center justify-center mb-4 shadow-inner group-hover:scale-105 group-hover:bg-amber-400/25 group-hover:border-amber-400/60 group-hover:text-amber-200 transition-all duration-300">
                    <span className="material-symbols-outlined text-2xl">
                      {prog.icon}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-serif text-lg font-normal text-white mb-2 group-hover:text-[#fde68a] transition-colors">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light mb-6">
                    {prog.description}
                  </p>
                </div>

                {/* Bottom Discoverable CTA Button */}
                <div className="pt-4 border-t border-white/10 group-hover:border-amber-400/20 transition-colors">
                  <a
                    className="w-full py-2 px-3 rounded-xl bg-white/[0.04] group-hover:bg-amber-500/15 border border-white/10 group-hover:border-amber-400/30 text-xs font-semibold text-amber-300 group-hover:text-amber-200 inline-flex items-center justify-between transition-all"
                    href="#"
                  >
                    <span>{prog.linkText}</span>
                    <span className="material-symbols-outlined text-sm transform group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
