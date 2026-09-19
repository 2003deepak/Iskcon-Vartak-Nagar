import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AboutUsPage() {
  return (
    <>
      <Header />
      <main className="w-full bg-surface">
        {/* Banner Section */}
        <section className="relative w-full py-20 sm:py-28 bg-[#091322] text-white overflow-hidden border-b border-amber-500/10">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/5 opacity-50" />
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#f3e7c4] tracking-tight">
              About Us
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-light mt-4 leading-relaxed">
              Spreading timeless Vedic wisdom, devotion, and community service under the divine guidance of Srila Prabhupada.
            </p>
          </div>
        </section>

        {/* Core Narrative / Introduction */}
        <section className="w-full py-16 sm:py-20 px-6 max-w-5xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-surface-container-lowest shadow-md border border-outline-variant/30 text-on-surface space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-primary">
              Welcome to ISKCON Vartak Nagar
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-on-surface-variant">
              At ISKCON Vartak Nagar, we are dedicated to spreading the timeless wisdom of the Vedic scriptures and fostering a vibrant community of spiritual seekers. Rooted in the teachings of His Divine Grace A.C. Bhaktivedanta Swami Prabhupada, the founder-acharya of the International Society for Krishna Consciousness (ISKCON), our organization is committed to promoting the principles of <strong>bhakti-yoga</strong>, the yoga of devotion, and facilitating the spiritual upliftment of individuals from all walks of life.
            </p>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="w-full py-12 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Our Mission */}
            <div className="p-8 sm:p-10 rounded-3xl bg-surface-container-low shadow-sm border border-outline-variant/20 flex flex-col justify-between space-y-4">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-2xl">flag</span>
                </div>
                <h3 className="font-serif text-2xl font-light text-on-surface mb-3">
                  Our Mission
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Our mission at ISKCON Vartak Nagar is to provide a nurturing environment where individuals can explore and deepen their understanding of the teachings of Lord Sri Krishna as presented in the Bhagavad Gita and the Srimad Bhagavatam. Through various outreach programs, educational initiatives, and spiritual practices, we aim to cultivate a community of love, compassion, and spiritual harmony, empowering individuals to realize their highest potential and contribute positively to society.
                </p>
              </div>
            </div>

            {/* Our Vision */}
            <div className="p-8 sm:p-10 rounded-3xl bg-surface-container-low shadow-sm border border-outline-variant/20 flex flex-col justify-between space-y-4">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-2xl">visibility</span>
                </div>
                <h3 className="font-serif text-2xl font-light text-on-surface mb-3">
                  Our Vision
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Our vision at ISKCON Vartak Nagar is to create a world where individuals live in harmony with themselves, with others, and with the divine. We envision a society based on the principles of truth, compassion, and selfless service, where every individual is empowered to realize their innate spiritual potential and contribute positively to the welfare of all sentient beings.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services We Offer */}
        <section className="w-full py-16 sm:py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold tracking-[0.2em] text-tertiary uppercase">
              Devotional & Community Offerings
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-on-surface tracking-tight mt-1">
              Services We Offer
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Spiritual Education */}
            <div className="p-8 rounded-3xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col space-y-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">menu_book</span>
              </div>
              <h3 className="text-lg font-medium text-on-surface">
                Spiritual Education
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                We offer a comprehensive range of classes, workshops, and seminars on various aspects of Vedic philosophy, including the Bhagavad Gita, the Srimad Bhagavatam, and the teachings of Chaitanya Mahaprabhu. Our educational programs are designed to provide participants with practical tools and insights for leading a spiritually fulfilling life in the modern world.
              </p>
            </div>

            {/* Community Outreach */}
            <div className="p-8 rounded-3xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col space-y-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">volunteer_activism</span>
              </div>
              <h3 className="text-lg font-medium text-on-surface">
                Community Outreach
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Through our various outreach initiatives, including food distribution programs, book distribution, and youth empowerment projects, we seek to serve and uplift the broader community. By engaging in acts of selfless service (seva), we aim to alleviate suffering and spread the message of love and compassion to all beings.
              </p>
            </div>

            {/* Congregation Preaching */}
            <div className="p-8 rounded-3xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col space-y-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">groups</span>
              </div>
              <h3 className="text-lg font-medium text-on-surface">
                Congregation Preaching
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                We hold regular congregation preaching sessions where devotees and spiritual seekers come together to engage in kirtan (devotional chanting), hear enlightening discourses, and share in the joy of communal worship. These gatherings provide an opportunity for spiritual growth, community bonding, and the glorification of the Supreme Lord.
              </p>
            </div>
          </div>
        </section>

        {/* Join Us Banner Callout */}
        <section className="w-full py-16 px-6 max-w-7xl mx-auto mb-10">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-[#091322] to-[#14233c] text-white text-center shadow-xl relative overflow-hidden">
            <div className="max-w-3xl mx-auto space-y-6 relative z-10">
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#f3e7c4]">
                Join Us
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                Whether you&apos;re new to spirituality or have been on the path for years, we welcome you to join us on this transformative journey of self-discovery and spiritual realization. Together, let us explore the depths of Vedic wisdom, cultivate a deeper connection with the divine, and strive to make the world a better place for ourselves and future generations.
              </p>
              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <Link
                  href="/#visit"
                  className="px-6 py-3 rounded-full bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
                >
                  Visit Temple
                </Link>
                <Link
                  href="/#donate"
                  className="px-6 py-3 rounded-full border border-amber-400/40 text-[#dfb260] hover:bg-amber-500/10 text-xs font-semibold uppercase tracking-wider transition-colors"
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
