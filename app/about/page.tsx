import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AboutUsPage() {
  return (
    <>
      <Header />
      <main className="w-full bg-[#faf7f2] text-slate-800">
        {/* Banner Section */}
        <section className="relative w-full py-20 sm:py-28 lg:py-32 bg-[#0a1628] text-white overflow-hidden border-b border-white/5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-xs font-semibold tracking-[0.25em] text-amber-300 uppercase mb-4 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Our Heritage</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#f3e7c4] tracking-tight">
              About Us
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-300 font-light mt-4 leading-relaxed">
              Spreading timeless Vedic wisdom, devotion, and community service under the divine guidance of Srila Prabhupada.
            </p>
          </div>
        </section>

        {/* Core Narrative / Introduction */}
        <section className="w-full py-20 lg:py-28 px-6 sm:px-8 max-w-5xl mx-auto">
          <div className="p-8 sm:p-12 lg:p-14 rounded-2xl lg:rounded-3xl bg-white shadow-sm border border-stone-200/80 text-slate-900 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-amber-800 uppercase">
              <span className="w-2 h-0.5 bg-amber-700"></span>
              <span>Spiritual Sanctuary</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-900 tracking-tight leading-tight">
              Welcome to ISKCON Vartak Nagar
            </h2>
            <p className="text-sm sm:text-base leading-[1.8] text-slate-600 font-light">
              At ISKCON Vartak Nagar, we are dedicated to spreading the timeless wisdom of the Vedic scriptures and fostering a vibrant community of spiritual seekers. Rooted in the teachings of His Divine Grace A.C. Bhaktivedanta Swami Prabhupada, the founder-acharya of the International Society for Krishna Consciousness (ISKCON), our organization is committed to promoting the principles of <strong>bhakti-yoga</strong>, the yoga of devotion, and facilitating the spiritual upliftment of individuals from all walks of life.
            </p>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="w-full py-12 lg:py-16 px-6 sm:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Our Mission */}
            <div className="group p-8 sm:p-10 rounded-2xl lg:rounded-3xl bg-white shadow-sm border border-stone-200/80 hover:border-amber-400/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-700 flex items-center justify-center mb-6 shadow-inner group-hover:scale-105 group-hover:bg-amber-400/20 group-hover:border-amber-400/50 transition-all duration-300">
                  <span className="material-symbols-outlined text-2xl">
                    explore
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-slate-900 mb-3 group-hover:text-amber-900 transition-colors">
                  Our Mission
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-[1.75] font-light">
                  Our mission at ISKCON Vartak Nagar is to provide a nurturing environment where individuals can explore and deepen their understanding of the teachings of Lord Sri Krishna as presented in the Bhagavad Gita and the Srimad Bhagavatam. Through various outreach programs, educational initiatives, and spiritual practices, we aim to cultivate a community of love, compassion, and spiritual harmony, empowering individuals to realize their highest potential and contribute positively to society.
                </p>
              </div>
            </div>

            {/* Our Vision */}
            <div className="group p-8 sm:p-10 rounded-2xl lg:rounded-3xl bg-white shadow-sm border border-stone-200/80 hover:border-amber-400/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-700 flex items-center justify-center mb-6 shadow-inner group-hover:scale-105 group-hover:bg-amber-400/20 group-hover:border-amber-400/50 transition-all duration-300">
                  <span className="material-symbols-outlined text-2xl">
                    self_improvement
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-slate-900 mb-3 group-hover:text-amber-900 transition-colors">
                  Our Vision
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-[1.75] font-light">
                  Our vision at ISKCON Vartak Nagar is to create a world where individuals live in harmony with themselves, with others, and with the divine. We envision a society based on the principles of truth, compassion, and selfless service, where every individual is empowered to realize their innate spiritual potential and contribute positively to the welfare of all sentient beings.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services We Offer */}
        <section className="w-full py-20 lg:py-28 px-6 sm:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-xs font-semibold tracking-[0.25em] text-amber-800 uppercase mb-4 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
              <span>Devotional &amp; Community Offerings</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900 tracking-tight">
              Services We Offer
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-light mt-3 leading-relaxed">
              Engaging activities and educational platforms fostering character, knowledge, and seva.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Spiritual Education */}
            <div className="group p-8 rounded-2xl lg:rounded-3xl bg-white shadow-sm border border-stone-200/80 hover:border-amber-400/40 flex flex-col justify-between space-y-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-700 flex items-center justify-center mb-6 shadow-inner group-hover:scale-105 group-hover:bg-amber-400/20 group-hover:border-amber-400/50 transition-all duration-300">
                  <span className="material-symbols-outlined text-2xl">menu_book</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-slate-900 mb-3 group-hover:text-amber-900 transition-colors">
                  Spiritual Education
                </h3>
                <p className="text-sm text-slate-600 leading-[1.7] font-light">
                  We offer a comprehensive range of classes, workshops, and seminars on various aspects of Vedic philosophy, including the Bhagavad Gita, the Srimad Bhagavatam, and the teachings of Chaitanya Mahaprabhu. Our educational programs are designed to provide participants with practical tools and insights for leading a spiritually fulfilling life in the modern world.
                </p>
              </div>
            </div>

            {/* Community Outreach */}
            <div className="group p-8 rounded-2xl lg:rounded-3xl bg-white shadow-sm border border-stone-200/80 hover:border-amber-400/40 flex flex-col justify-between space-y-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-700 flex items-center justify-center mb-6 shadow-inner group-hover:scale-105 group-hover:bg-amber-400/20 group-hover:border-amber-400/50 transition-all duration-300">
                  <span className="material-symbols-outlined text-2xl">volunteer_activism</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-slate-900 mb-3 group-hover:text-amber-900 transition-colors">
                  Community Outreach
                </h3>
                <p className="text-sm text-slate-600 leading-[1.7] font-light">
                  Through our various outreach initiatives, including food distribution programs, book distribution, and youth empowerment projects, we seek to serve and uplift the broader community. By engaging in acts of selfless service (seva), we aim to alleviate suffering and spread the message of love and compassion to all beings.
                </p>
              </div>
            </div>

            {/* Congregation Preaching */}
            <div className="group p-8 rounded-2xl lg:rounded-3xl bg-white shadow-sm border border-stone-200/80 hover:border-amber-400/40 flex flex-col justify-between space-y-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-700 flex items-center justify-center mb-6 shadow-inner group-hover:scale-105 group-hover:bg-amber-400/20 group-hover:border-amber-400/50 transition-all duration-300">
                  <span className="material-symbols-outlined text-2xl">groups</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-slate-900 mb-3 group-hover:text-amber-900 transition-colors">
                  Congregation Preaching
                </h3>
                <p className="text-sm text-slate-600 leading-[1.7] font-light">
                  We hold regular congregation preaching sessions where devotees and spiritual seekers come together to engage in kirtan (devotional chanting), hear enlightening discourses, and share in the joy of communal worship. These gatherings provide an opportunity for spiritual growth, community bonding, and the glorification of the Supreme Lord.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Join Us Banner Callout */}
        <section className="w-full py-16 px-6 sm:px-8 max-w-7xl mx-auto mb-20">
          <div className="p-10 sm:p-14 lg:p-16 rounded-2xl lg:rounded-3xl bg-gradient-to-r from-[#0a1628] via-[#0d1e36] to-[#0a1628] text-white text-center shadow-2xl border border-amber-500/25 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-3xl mx-auto space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-xs font-semibold tracking-[0.25em] text-amber-300 uppercase shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Spiritual Journey</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#f3e7c4] tracking-tight">
                Join Us
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                Whether you&apos;re new to spirituality or have been on the path for years, we welcome you to join us on this transformative journey of self-discovery and spiritual realization. Together, let us explore the depths of Vedic wisdom, cultivate a deeper connection with the divine, and strive to make the world a better place for ourselves and future generations.
              </p>
              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <Link
                  href="/#visit"
                  className="px-8 py-3.5 rounded-full bg-[#dfb260] hover:bg-[#cca04b] text-[#060e1b] text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md shadow-amber-950/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-950/40 active:translate-y-0 transition-all duration-200"
                >
                  Visit Temple
                </Link>
                <Link
                  href="/support-us#donate"
                  className="px-8 py-3.5 rounded-full bg-transparent hover:bg-[#dfb260]/10 border-[1.5px] border-[#dfb260] text-[#dfb260] hover:text-[#fce8b8] text-xs sm:text-sm font-semibold uppercase tracking-wider hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  Offer Seva
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
