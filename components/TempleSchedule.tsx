"use client";

import ScrollReveal from "@/components/ScrollReveal";

export default function TempleSchedule() {
  const scheduleItems = [
    {
      time: "04:30 AM",
      badge: "Auspicious",
      badgeClass: "bg-amber-100 text-amber-900 border border-amber-200",
      title: "Mangal Aarti",
      description: "Awakening of the Deities with ghee lamps, conch-shells & kirtan.",
      highlight: false,
    },
    {
      time: "07:15 AM",
      badge: "Darshan",
      badgeClass: "bg-amber-50 text-amber-800 border border-amber-200/80",
      title: "Sringar Darshan & Guru Puja",
      description: "Revealing Deities in new robes and flowers, followed by kirtan.",
      highlight: false,
    },
    {
      time: "08:00 AM",
      badge: "Wisdom",
      badgeClass: "bg-stone-100 text-stone-700 border border-stone-200",
      title: "Srimad Bhagavatam Discourse",
      description: "Philosophical discourse and reflections on devotional science.",
      highlight: false,
    },
    {
      time: "12:30 PM",
      badge: "Offering",
      badgeClass: "bg-amber-100 text-amber-900 border border-amber-200",
      title: "Raj Bhog Aarti",
      description: "Grand noon feast offering. Sanctuary closes for afternoon rest at 1:00 PM.",
      highlight: false,
    },
    {
      time: "04:00 PM",
      badge: "Reopen",
      badgeClass: "bg-stone-100 text-stone-700 border border-stone-200",
      title: "Utthapan Darshan",
      description: "Sanctuary doors reopen for evening prayer and introspection.",
      highlight: false,
    },
    {
      time: "07:00 PM",
      badge: "Popular",
      badgeClass: "bg-amber-600 text-white font-semibold shadow-xs",
      title: "Sandhya Gaura Aarti",
      description: "Grand evening aarti with soul-stirring congregational kirtan.",
      highlight: true,
    },
    {
      time: "07:45 PM",
      badge: "Study",
      badgeClass: "bg-stone-100 text-stone-700 border border-stone-200",
      title: "Bhagavad-gita Katha",
      description: "Practical guidance for navigating modern stress through spiritual clarity.",
      highlight: false,
    },
    {
      time: "08:30 PM",
      badge: "Night",
      badgeClass: "bg-stone-100 text-stone-700 border border-stone-200",
      title: "Sayana Aarti",
      description: "Night resting aarti; altar curtains draw closed at 8:45 PM.",
      highlight: false,
    },
  ];

  return (
    <section className="w-full py-20 lg:py-28 bg-[#faf7f2] border-b border-stone-200/60 text-slate-800" id="schedule">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-amber-800 uppercase mb-3">
                <span className="w-2 h-0.5 bg-amber-700"></span>
                <span>Sacred Daily Rhythm</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900 tracking-tight">
                A Day at the Temple
              </h2>
            </div>
          </div>
        </ScrollReveal>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch">
          {scheduleItems.map((item, idx) => (
            <ScrollReveal
              key={idx}
              variant="fade-up"
              delay={idx * 60}
              className="h-full"
            >
              <div
                className={`h-full p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 shadow-xs hover:-translate-y-1 ${
                  item.highlight
                    ? "bg-gradient-to-br from-amber-50/80 to-white border-amber-300/90 shadow-md ring-1 ring-amber-400/40"
                    : "bg-white border-stone-200/80 hover:border-amber-300/80 hover:shadow-md"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        item.highlight ? "text-amber-800" : "text-slate-700"
                      }`}
                    >
                      {item.time}
                    </span>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${item.badgeClass}`}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-slate-900 mb-1.5 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
