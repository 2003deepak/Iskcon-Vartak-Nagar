"use client";

import ScrollReveal from "@/components/ScrollReveal";

export default function ExperienceCards() {
  const experiences = [
    {
      icon: "temple_hindu",
      title: "Temple Darshan",
      description:
        "Spend quiet, introspective moments in the peaceful presence of Their Lordships Sri Sri Radha Krishna, beautifully adorned daily.",
      time: "Open Daily",
      timing: "4:30 AM – 8:30 PM",
      tag: "Darshan Timings",
    },
    {
      icon: "music_note",
      title: "Kirtan Meditation",
      description:
        "Experience the uplifting power of congregational singing with mridanga and kartals, melting away worldly anxiety through the holy names.",
      time: "Every Evening",
      timing: "7:00 PM – 8:00 PM",
      tag: "Join Daily Kirtan",
    },
    {
      icon: "menu_book",
      title: "Spiritual Wisdom",
      description:
        "Explore the Bhagavad-gita As It Is and timeless Vedic literatures through daily classes, seminars, and philosophical satsangs.",
      time: "Daily Morning",
      timing: "8:00 AM Discourse",
      tag: "Attend Wisdom Class",
    },
    {
      icon: "celebration",
      title: "Festivals & Celebrations",
      description:
        "Celebrate sacred festivals like Janmashtami, Radhashtami, and Gaura Purnima through elaborate abhishekham, pageantry, and song.",
      time: "Year-Round",
      timing: "Vedic Panchanga",
      tag: "Festival Calendar",
    },
    {
      icon: "restaurant",
      title: "Pure Prasadam",
      description:
        "Honour wholesome, sanctified vegetarian meals prepared in strict cleanliness and offered with selfless devotion at Govinda's hall.",
      time: "Sunday Love Feast",
      timing: "1:00 PM Afternoon",
      tag: "Honour Prasadam",
    },
    {
      icon: "groups",
      title: "Loving Community",
      description:
        "Form sincere, lasting bonds with devotees, cultivate noble character in children, and serve together as a conscious family.",
      time: "Weekly Satsangs",
      timing: "Bhakti Vriksha",
      tag: "Join Devotee Circle",
    },
  ];

  return (
    <section className="w-full py-20 lg:py-28 bg-[#0d1e36] text-slate-100 border-b border-white/5 relative overflow-hidden" id="experiences">
      {/* Subtle ambient golden glows in background */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-xs font-semibold tracking-[0.25em] text-amber-300 uppercase mb-4 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Sacred Experiences</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight">
              Experience the Joy of Devotion
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-light mt-3 leading-relaxed">
              Come as you are. Discover a serene sanctuary for prayer, sacred sound,
              Vedic study, and spiritual fellowship in Thane.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {experiences.map((exp, idx) => (
            <ScrollReveal
              key={idx}
              variant="fade-up"
              delay={idx * 80}
              className="h-full"
            >
              <div className="group h-full p-7 lg:p-8 rounded-2xl lg:rounded-3xl bg-white/[0.035] hover:bg-white/[0.06] border border-white/10 hover:border-amber-400/40 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-amber-950/20 transform hover:-translate-y-1.5 flex flex-col justify-between">
                <div>
                  {/* Top Row: Icon Medallion & Time Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-300 flex items-center justify-center shadow-inner group-hover:scale-105 group-hover:bg-amber-400/20 group-hover:border-amber-400/50 group-hover:text-amber-200 transition-all duration-300">
                      <span className="material-symbols-outlined text-2xl">
                        {exp.icon}
                      </span>
                    </div>

                    <span className="text-xs font-medium text-slate-300 bg-white/5 px-3 py-1 rounded-full border border-white/10 group-hover:border-amber-400/25 transition-colors">
                      {exp.timing}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-white mb-3 group-hover:text-[#fde68a] transition-colors tracking-tight">
                    {exp.title}
                  </h3>
                  <p className="text-sm text-slate-300/85 leading-relaxed font-light mb-6">
                    {exp.description}
                  </p>
                </div>

                {/* Bottom CTA Action Strip */}
                <div className="pt-4 border-t border-white/10 group-hover:border-amber-400/25 transition-colors flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-300 group-hover:text-amber-200 uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors">
                    <span>{exp.tag}</span>
                    <span className="material-symbols-outlined text-sm transform group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400/40 group-hover:bg-amber-400 transition-colors" />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
