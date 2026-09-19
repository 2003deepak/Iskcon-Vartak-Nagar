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
    <section className="w-full bg-[#263B63] text-surface-container-lowest py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-16">
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <ScrollReveal variant="fade-up">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#ffdbc9] uppercase mb-3">
                <span className="w-2 h-0.5 bg-[#ffdbc9]"></span>
                <span>Seva &amp; Community Service</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-tight text-surface-container-lowest">
                Devotion in Action: <br />
                <span className="italic text-[#ffdbc9]">
                  Compassion for Every Soul
                </span>
              </h2>
              <p className="text-sm sm:text-base text-surface-variant/90 leading-relaxed font-light mt-4">
                Bhakti becomes truly alive when it radiates outward as loving service
                to society. At ISKCON Vartak Nagar, our volunteers actively feed the hungry,
                distribute timeless wisdom, and uplift humanity through unmotivated compassion.
              </p>
            </ScrollReveal>

            {/* 4 Initiatives Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {initiatives.map((item, idx) => (
                <ScrollReveal key={idx} variant="fade-up" delay={idx * 100}>
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-[#ffdbc9] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">
                        {item.icon}
                      </span>
                      {item.title}
                    </span>
                    <p className="text-xs text-surface-variant/80 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal variant="fade-up" delay={300}>
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#bd5700] text-on-tertiary-container text-xs font-medium uppercase tracking-wider shadow hover:bg-[#964400] transition-colors"
                  href="#donate"
                >
                  <span>Find Your Seva</span>
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </a>
                <a
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface-container-lowest/10 text-surface-container-lowest text-xs font-medium uppercase tracking-wider hover:bg-surface-container-lowest/20 transition-colors"
                  href="#volunteer"
                >
                  Become a Volunteer
                </a>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Congregation photo */}
          <div className="lg:col-span-5 relative">
            <ScrollReveal variant="image-reveal" duration={800}>
              <div className="rounded-2xl overflow-hidden shadow-2xl">
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

        {/* Community Impact Strip */}
        <ScrollReveal variant="fade-up" delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 bg-surface-container-lowest/5 rounded-2xl p-8">
            <div className="text-center md:text-left">
              <AnimatedCounter
                target={1200}
                suffix="+"
                className="block text-3xl sm:text-4xl font-light font-serif text-[#ffdbc9]"
              />
              <span className="text-xs uppercase tracking-widest text-surface-variant/80 font-medium">
                Daily Prasadam Meals Distributed
              </span>
            </div>
            <div className="text-center md:text-left">
              <AnimatedCounter
                target={24}
                suffix="+"
                className="block text-3xl sm:text-4xl font-light font-serif text-[#ffdbc9]"
              />
              <span className="text-xs uppercase tracking-widest text-surface-variant/80 font-medium">
                Years of Spiritual Guidance in Thane
              </span>
            </div>
            <div className="text-center md:text-left">
              <AnimatedCounter
                target={150}
                suffix="+"
                className="block text-3xl sm:text-4xl font-light font-serif text-[#ffdbc9]"
              />
              <span className="text-xs uppercase tracking-widest text-surface-variant/80 font-medium">
                Dedicated Seva Volunteers
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
