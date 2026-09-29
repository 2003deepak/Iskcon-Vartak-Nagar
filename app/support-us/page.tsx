"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DevotionInAction from "@/components/DevotionInAction";
import ScrollReveal from "@/components/ScrollReveal";

export default function SupportUsPage() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const bankDetails = {
    bankName: "HDFC Bank",
    accountNo: "50100366828067",
    accountName: "ISKCON Juhu",
    ifscCode: "HDFC0000321",
    branch: "JVPD Scheme , Juhu",
  };

  const upiDetails = {
    upiId: "iskcon.vartaknagar@hdfcbank",
    payeeName: "ISKCON Juhu",
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Volunteer Form State
  const [volunteerForm, setVolunteerForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    sevaInterest: "Prasadam Distribution (Food for Life)",
    preferredContactMethod: "WhatsApp",
    consent: true,
  });
  const [isSubmittingVolunteer, setIsSubmittingVolunteer] = useState(false);
  const [volunteerError, setVolunteerError] = useState<string | null>(null);
  const [submittedApp, setSubmittedApp] = useState<{
    applicationNumber: string;
    fullName: string;
    sevaInterest: string;
    phone: string;
  } | null>(null);

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVolunteerError(null);

    if (!volunteerForm.consent) {
      setVolunteerError("Please agree to be contacted for seva opportunities.");
      return;
    }

    try {
      setIsSubmittingVolunteer(true);
      const res = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(volunteerForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmittedApp({
          applicationNumber: data.application.applicationNumber,
          fullName: data.application.fullName,
          sevaInterest: data.application.sevaInterest,
          phone: data.application.phone,
        });
        setVolunteerForm({
          fullName: "",
          phone: "",
          email: "",
          sevaInterest: "Prasadam Distribution (Food for Life)",
          preferredContactMethod: "WhatsApp",
          consent: true,
        });
      } else {
        setVolunteerError(data.error || "Failed to submit application. Please try again.");
      }
    } catch (err: any) {
      setVolunteerError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmittingVolunteer(false);
    }
  };

  const volunteerOpportunities = [
    {
      icon: "soup_kitchen",
      title: "Prasadam Distribution",
      description: "Help prepare, pack, and distribute sanctified meals (Annadanam) across Thane communities.",
    },
    {
      icon: "event_available",
      title: "Festival Organization",
      description: "Assist in stage setup, deity decorations, crowd management, and guest reception during grand festivals.",
    },
    {
      icon: "auto_stories",
      title: "Vedic Book Outreach",
      description: "Distribute Bhagavad-gita and Vedic literature to inquisitive seekers at book stalls and sankirtan.",
    },
    {
      icon: "photo_camera",
      title: "Media & Communications",
      description: "Capture darshan photos, edit video reels, design temple creatives, and manage live broadcast streams.",
    },
  ];

  return (
    <>
      <Header />
      <main className="w-full bg-[#faf7f2] min-h-screen">

        {/* =========================================================
            SECTION 1 (DARK): Devotion in Action & Community Seva
        ========================================================= */}
        <DevotionInAction />

        {/* =========================================================
            SECTION 2 (LIGHT): Become our Volunteer (#volunteer)
        ========================================================= */}
        <section id="volunteer" className="py-20 lg:py-28 bg-[#faf7f2] border-b border-stone-200/80 text-slate-800">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Volunteer Intro & Opportunities */}
              <div className="lg:col-span-7 space-y-6">
                <ScrollReveal variant="fade-up">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-xs font-semibold tracking-[0.25em] text-amber-800 uppercase shadow-xs mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                    <span>Join Our Sevaks</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900 tracking-tight leading-tight">
                    Become our Volunteer
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-[1.75] font-light mt-4">
                    Are you passionate about serving others, connecting with like-minded individuals, and making a positive impact in your community? Consider volunteering with ISKCON Vartak Nagar and become a valuable member of our dedicated team of sevaks committed to spreading love, compassion, and spiritual wisdom.
                  </p>
                </ScrollReveal>

                {/* 4 Opportunities Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
                  {volunteerOpportunities.map((item, idx) => (
                    <ScrollReveal key={idx} variant="fade-up" delay={100 + idx * 80}>
                      <div className="group h-full p-6 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 hover:border-amber-400/50 transition-all duration-300 space-y-3 shadow-sm hover:shadow-xl hover:-translate-y-1">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-800 flex items-center justify-center shadow-inner group-hover:scale-105 group-hover:bg-amber-100 group-hover:border-amber-300 transition-all duration-300">
                          <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                        </div>
                        <h3 className="font-serif text-lg font-medium text-slate-900 group-hover:text-amber-900 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                          {item.description}
                        </p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>

              {/* Right Column: Volunteer Signup Card / Success Confirmation */}
              <div className="lg:col-span-5">
                <ScrollReveal variant="fade-up" delay={200}>
                  <div className="bg-white p-8 sm:p-10 rounded-3xl border-2 border-amber-400/40 shadow-xl shadow-stone-300/40 space-y-6 relative overflow-hidden">
                    {/* Decorative Corner Accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full pointer-events-none" />

                    {submittedApp ? (
                      /* Success Confirmation State */
                      <div className="space-y-6 relative z-10 text-center py-2 animate-fadeIn">
                        <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
                          <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
                        </div>

                        <div className="space-y-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                            Application Received
                          </span>
                          <h3 className="font-serif text-2xl sm:text-3xl text-slate-900 font-normal">
                            🙏 Thank You for Volunteering!
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                            Hare Krishna <span className="font-semibold text-slate-900">{submittedApp.fullName}</span>, your seva inquiry has been successfully recorded in our temple registry.
                          </p>
                        </div>

                        {/* Application Reference Badge */}
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300/80 text-left space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800">
                              Application Reference ID
                            </span>
                            <span className="font-mono text-xs font-bold text-amber-900">
                              {submittedApp.applicationNumber}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>Preferred Department:</span>
                            <span className="font-semibold text-slate-800 truncate max-w-[180px]">
                              {submittedApp.sevaInterest}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 font-light leading-relaxed">
                          Our volunteer seva coordinator will contact you shortly on your registered number to discuss upcoming seva schedules.
                        </p>

                        <div className="space-y-3 pt-2">
                          <a
                            href={`https://wa.me/918080808080?text=${encodeURIComponent(
                              `Hare Krishna 🙏 I have submitted a volunteer application with ID: ${submittedApp.applicationNumber} for ${submittedApp.sevaInterest}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-emerald-950/20 hover:shadow-lg transition-all duration-200"
                          >
                            <span>Connect on WhatsApp</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => setSubmittedApp(null)}
                            className="w-full py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer"
                          >
                            Submit Another Application
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Active Volunteer Form */
                      <>
                        <div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-2">
                            Get Involved
                          </div>
                          <h3 className="font-serif text-2xl sm:text-3xl text-slate-900 font-normal">
                            Volunteer Inquiry
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed mt-1">
                            Fill in your details to get enrolled in active temple seva departments.
                          </p>
                        </div>

                        {volunteerError && (
                          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                            <span className="material-symbols-outlined text-base shrink-0">error</span>
                            <span>{volunteerError}</span>
                          </div>
                        )}

                        <form onSubmit={handleVolunteerSubmit} className="space-y-4 relative z-10">
                          <div>
                            <label className="block text-xs text-slate-700 font-semibold mb-1.5 uppercase tracking-wider">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={volunteerForm.fullName}
                              onChange={(e) =>
                                setVolunteerForm({ ...volunteerForm, fullName: e.target.value })
                              }
                              placeholder="Your Name"
                              className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 transition-all"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                              <label className="block text-xs text-slate-700 font-semibold mb-1.5 uppercase tracking-wider">
                                Phone / WhatsApp *
                              </label>
                              <input
                                type="tel"
                                required
                                value={volunteerForm.phone}
                                onChange={(e) =>
                                  setVolunteerForm({ ...volunteerForm, phone: e.target.value })
                                }
                                placeholder="+91 98765 43210"
                                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 transition-all"
                              />
                            </div>

                            <div>
                              <label className="block text-xs text-slate-700 font-semibold mb-1.5 uppercase tracking-wider">
                                Email (Optional)
                              </label>
                              <input
                                type="email"
                                value={volunteerForm.email}
                                onChange={(e) =>
                                  setVolunteerForm({ ...volunteerForm, email: e.target.value })
                                }
                                placeholder="name@email.com"
                                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 transition-all"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs text-slate-700 font-semibold mb-1.5 uppercase tracking-wider">
                              Area of Seva Interest *
                            </label>
                            <select
                              value={volunteerForm.sevaInterest}
                              onChange={(e) =>
                                setVolunteerForm({ ...volunteerForm, sevaInterest: e.target.value })
                              }
                              className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 transition-all"
                            >
                              <option>Prasadam Distribution (Food for Life)</option>
                              <option>Festival Organization &amp; Setup</option>
                              <option>Vedic Book Distribution</option>
                              <option>Photography &amp; Media Production</option>
                              <option>Deity Flower Garlands &amp; Altar Seva</option>
                              <option>Sunday Feast &amp; Guest Reception</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs text-slate-700 font-semibold mb-1.5 uppercase tracking-wider">
                              Preferred Contact Mode
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setVolunteerForm({
                                    ...volunteerForm,
                                    preferredContactMethod: "WhatsApp",
                                  })
                                }
                                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                  volunteerForm.preferredContactMethod === "WhatsApp"
                                    ? "bg-amber-100 border-amber-400 text-amber-900"
                                    : "bg-stone-50 border-stone-200 text-slate-600 hover:bg-stone-100"
                                }`}
                              >
                                <span>💬 WhatsApp</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setVolunteerForm({
                                    ...volunteerForm,
                                    preferredContactMethod: "Phone Call",
                                  })
                                }
                                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                  volunteerForm.preferredContactMethod === "Phone Call"
                                    ? "bg-amber-100 border-amber-400 text-amber-900"
                                    : "bg-stone-50 border-stone-200 text-slate-600 hover:bg-stone-100"
                                }`}
                              >
                                <span>📞 Phone Call</span>
                              </button>
                            </div>
                          </div>

                          {/* Consent Checkbox */}
                          <div className="pt-1">
                            <label className="flex items-start gap-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={volunteerForm.consent}
                                onChange={(e) =>
                                  setVolunteerForm({ ...volunteerForm, consent: e.target.checked })
                                }
                                className="mt-1 w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                              />
                              <span className="text-xs text-slate-600 font-light leading-relaxed">
                                I agree to be contacted by ISKCON Vartak Nagar regarding volunteer seva opportunities.
                              </span>
                            </label>
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmittingVolunteer}
                            className="w-full px-5 py-3.5 rounded-xl bg-[#dfb260] hover:bg-[#cca04b] text-[#060e1b] text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md shadow-amber-950/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-950/30 active:translate-y-0 transition-all duration-200 cursor-pointer disabled:opacity-60 mt-2 text-center leading-normal"
                          >
                            {isSubmittingVolunteer
                              ? "Submitting Application..."
                              : "Submit Volunteer Application"}
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </ScrollReveal>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 3 (DARK): Join ISKCON's Global Family of Devotees (Life Member)
        ========================================================= */}
        <section id="life-member" className="py-20 lg:py-28 bg-[#081426] text-slate-100 border-b border-white/5 relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">

            {/* Main Header & Story Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16">

              {/* Left Column: Heading & Historical Intro */}
              <div className="lg:col-span-7 space-y-6">
                <ScrollReveal variant="fade-up">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-xs font-semibold tracking-[0.25em] text-amber-300 uppercase shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    <span>Life Patron Program</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-slate-50 tracking-tight leading-tight">
                    Join ISKCON’s Global <br />
                    <span className="italic text-[#dfb260]">Family of Devotees</span>
                  </h2>
                  <div className="space-y-4 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                    <p>
                      The Life Patron Program was personally introduced by ISKCON’s Founder-Acharya, <span className="text-amber-200 font-normal">His Divine Grace A.C. Bhaktivedanta Swami Prabhupada</span>, in the early 1970s. It offers a beautiful opportunity for individuals to contribute to Krishna consciousness while continuing their household life.
                    </p>
                    <p>
                      This program welcomes anyone who desires to support ISKCON’s mission but may not be able to become a full-time devotee. As a Life Patron, you become a cherished member of ISKCON’s international family, with access to temple facilities and association with devotees worldwide.
                    </p>
                  </div>
                </ScrollReveal>
              </div>

              {/* Right Column: Life Patron Card Image Showcase */}
              <div className="lg:col-span-5">
                <ScrollReveal variant="image-reveal" delay={150}>
                  <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-br from-amber-400/60 via-amber-500/20 to-amber-400/60 shadow-2xl shadow-black/60 group">
                    <div className="rounded-[22px] overflow-hidden bg-[#0d1f36] p-4 sm:p-5 flex flex-col items-center">
                      <div className="relative w-full rounded-2xl overflow-hidden border border-amber-400/30 shadow-inner bg-[#eaf4e8]">
                        <Image
                          src="/LifeMember.jpg"
                          alt="Official ISKCON Life Membership Card - Be a part of the Worldwide Hare Krishna Family"
                          width={600}
                          height={400}
                          className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-4 text-center">
                        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-amber-300">
                          Worldwide Hare Krishna Family
                        </span>
                        <p className="text-xs text-slate-400 font-light mt-0.5">
                          National Life Patron Card honored across centers globally
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

            </div>

            {/* Benefits of Life Patron Membership Grid */}
            <div className="space-y-6 mb-16">
              <ScrollReveal variant="fade-up">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/90">
                    Spiritual Privileges
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal">
                    Benefits of Life Patron Membership
                  </h3>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">

                {/* Benefit 1 */}
                <ScrollReveal variant="fade-up" delay={80}>
                  <div className="h-full p-6 rounded-2xl bg-white/[0.035] hover:bg-white/[0.06] border border-white/10 hover:border-amber-400/40 transition-all duration-300 space-y-3 shadow-lg shadow-black/20 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-300 flex items-center justify-center shadow-inner mb-4">
                        <span className="material-symbols-outlined text-2xl">hotel</span>
                      </div>
                      <h4 className="font-serif text-lg font-medium text-white mb-2">Accommodation Privilege</h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                        3 days of free stay (with two prasadam meals daily) for Life Members and their family at ISKCON centers across Bharat.*
                      </p>
                    </div>
                    <p className="text-[11px] text-amber-300/70 font-light pt-2 italic">
                      *Room maintenance charges apply.
                    </p>
                  </div>
                </ScrollReveal>

                {/* Benefit 2 */}
                <ScrollReveal variant="fade-up" delay={140}>
                  <div className="h-full p-6 rounded-2xl bg-white/[0.035] hover:bg-white/[0.06] border border-white/10 hover:border-amber-400/40 transition-all duration-300 space-y-3 shadow-lg shadow-black/20 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-300 flex items-center justify-center shadow-inner mb-4">
                        <span className="material-symbols-outlined text-2xl">menu_book</span>
                      </div>
                      <h4 className="font-serif text-lg font-medium text-white mb-2">Spiritual Starter Kit</h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                        A beautiful set of Srila Prabhupada’s books (English or Hindi), Japa mala with bead bag, and a laminated 10”x15” photo of Sri Sri Radha-Krishna.
                      </p>
                    </div>
                    <span className="text-[11px] text-amber-300/80 font-medium pt-2">Complete Devotional Package</span>
                  </div>
                </ScrollReveal>

                {/* Benefit 3 */}
                <ScrollReveal variant="fade-up" delay={200}>
                  <div className="h-full p-6 rounded-2xl bg-white/[0.035] hover:bg-white/[0.06] border border-white/10 hover:border-amber-400/40 transition-all duration-300 space-y-3 shadow-lg shadow-black/20 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-300 flex items-center justify-center shadow-inner mb-4">
                        <span className="material-symbols-outlined text-2xl">badge</span>
                      </div>
                      <h4 className="font-serif text-lg font-medium text-white mb-2">Official Recognition</h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                        Personalized National Life Patron ID card with photo, honored with reverence and hospitality at all ISKCON centers across Bharat.
                      </p>
                    </div>
                    <span className="text-[11px] text-amber-300/80 font-medium pt-2">National Identity Card</span>
                  </div>
                </ScrollReveal>

                {/* Benefit 4 */}
                <ScrollReveal variant="fade-up" delay={260}>
                  <div className="h-full p-6 rounded-2xl bg-white/[0.035] hover:bg-white/[0.06] border border-white/10 hover:border-amber-400/40 transition-all duration-300 space-y-3 shadow-lg shadow-black/20 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-300 flex items-center justify-center shadow-inner mb-4">
                        <span className="material-symbols-outlined text-2xl">receipt_long</span>
                      </div>
                      <h4 className="font-serif text-lg font-medium text-white mb-2">Tax Benefits (80G)</h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                        All membership donations are eligible for 50% tax exemption under Section 80G of the Indian Income Tax Act, 1961.
                      </p>
                    </div>
                    <span className="text-[11px] text-amber-300/80 font-medium pt-2">Section 80G Tax Exemption</span>
                  </div>
                </ScrollReveal>

                {/* Benefit 5 */}
                <ScrollReveal variant="fade-up" delay={320}>
                  <div className="h-full p-6 rounded-2xl bg-white/[0.035] hover:bg-white/[0.06] border border-white/10 hover:border-amber-400/40 transition-all duration-300 space-y-3 shadow-lg shadow-black/20 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-300 flex items-center justify-center shadow-inner mb-4">
                        <span className="material-symbols-outlined text-2xl">volunteer_activism</span>
                      </div>
                      <h4 className="font-serif text-lg font-medium text-white mb-2">Spiritual Contribution</h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                        Your donation directly supports ISKCON’s global preaching, Annadanam prasadam distribution, and spiritual outreach programs across the globe.
                      </p>
                    </div>
                    <span className="text-[11px] text-amber-300/80 font-medium pt-2">Global Mission Support</span>
                  </div>
                </ScrollReveal>

                {/* Benefit 6 */}
                <ScrollReveal variant="fade-up" delay={380}>
                  <div className="h-full p-6 rounded-2xl bg-white/[0.035] hover:bg-white/[0.06] border border-white/10 hover:border-amber-400/40 transition-all duration-300 space-y-3 shadow-lg shadow-black/20 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-300 flex items-center justify-center shadow-inner mb-4">
                        <span className="material-symbols-outlined text-2xl">groups</span>
                      </div>
                      <h4 className="font-serif text-lg font-medium text-white mb-2">Devotee Association</h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                        Connect with an inspiring network of practicing devotees, attend special satsangs, spiritual retreats, and major temple festival celebrations.
                      </p>
                    </div>
                    <span className="text-[11px] text-amber-300/80 font-medium pt-2">Lifelong Devotee Network</span>
                  </div>
                </ScrollReveal>

              </div>
            </div>

            {/* Donation Amount & Enrollment Card */}
            <ScrollReveal variant="fade-up" delay={200}>
              <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#122846] via-[#10243e] to-[#0a182e] border-2 border-amber-400/40 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">

                  {/* Left info */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-xs font-semibold text-amber-300 uppercase tracking-wider">
                      Membership Seva Contribution
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal tracking-tight">
                      Current Donation Amount
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                      Payable by Cash, Cheque, Bank Transfer, Net Banking, Credit or Debit Cards.
                    </p>
                    <p className="text-xs text-amber-200/90 font-light leading-relaxed bg-white/5 border border-amber-400/20 p-3.5 rounded-xl">
                      <span className="font-semibold text-amber-300">Note:</span> This is a sacred donation toward the temple trust corpus and is fully tax exempt under Section 80G of the Income Tax Act.
                    </p>
                  </div>

                  {/* Right Price Pill & Actions */}
                  <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center space-y-5">
                    <div className="text-center lg:text-right">
                      <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold block mb-1">
                        One-Time Contribution
                      </span>
                      <div className="font-serif text-4xl sm:text-5xl font-bold text-[#dfb260] tracking-tight">
                        ₹55,555
                      </div>
                      <span className="text-xs text-slate-300/80 font-light mt-1 block">
                        Lifelong Patron Membership
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <a
                        href="#donate"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#dfb260] hover:bg-[#cca04b] text-[#060e1b] text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md shadow-amber-950/30 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 text-center"
                      >
                        <span>Contribute Online</span>
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </a>


                    </div>
                  </div>

                </div>
              </div>
            </ScrollReveal>

          </div>
        </section>

        {/* =========================================================
            SECTION 4 (LIGHT): Donate & Support Us (#donate)
        ========================================================= */}
        <section id="donate" className="py-20 lg:py-28 bg-[#faf7f2] border-b border-stone-200/80 text-slate-800">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">

            {/* Section Header */}
            <ScrollReveal variant="fade-up">
              <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-xs font-semibold tracking-[0.25em] text-amber-800 uppercase shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                  <span>Sacred Offerings &amp; Seva</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-900 tracking-tight">
                  Donate &amp; Support Us
                </h2>
                <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                  Your direct financial contributions support daily deity worship, Annadanam prasadam distribution, festival celebrations, and temple maintenance. All contributions qualify for official receipts.
                </p>
              </div>
            </ScrollReveal>

            {/* Side-by-Side Payment Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-6xl mx-auto">

              {/* Card 1: Direct Bank Transfer */}
              <ScrollReveal variant="fade-up" delay={100} className="h-full flex flex-col">
                <div className="rounded-3xl p-[1px] bg-gradient-to-br from-amber-400/40 via-amber-200/50 to-amber-500/40 shadow-xl shadow-stone-200/70 relative flex flex-col h-full">
                  <div className="rounded-[23px] bg-white p-6 sm:p-8 lg:p-9 relative overflow-hidden border border-stone-200/80 shadow-sm flex flex-col justify-between h-full">

                    {/* Ambient Warm Glow */}
                    <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

                    {/* Faint Sacred Mandala / Lotus Watermark Texture */}
                    <svg
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 text-amber-800/10 opacity-30 pointer-events-none select-none -rotate-12"
                      viewBox="0 0 200 200"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      aria-hidden="true"
                    >
                      <circle cx="100" cy="100" r="95" strokeDasharray="3 3" />
                      <circle cx="100" cy="100" r="85" />
                      <circle cx="100" cy="100" r="68" />
                      <circle cx="100" cy="100" r="50" strokeDasharray="4 2" />
                      <circle cx="100" cy="100" r="32" />
                      <circle cx="100" cy="100" r="16" fill="currentColor" fillOpacity="0.1" />
                      <circle cx="100" cy="100" r="6" fill="currentColor" />
                      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
                        <g key={angle} transform={`rotate(${angle} 100 100)`}>
                          <path d="M100 32 C112 50 112 70 100 84 C88 70 88 50 100 32 Z" />
                          <path d="M100 15 C118 40 118 70 100 88 C82 70 82 40 100 15 Z" strokeDasharray="2 2" />
                        </g>
                      ))}
                    </svg>

                    {/* Card Content Header */}
                    <div>
                      <div className="flex items-center gap-3.5 sm:gap-4 border-b border-stone-200 pb-5 mb-6 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-300 text-amber-800 flex items-center justify-center shadow-inner shrink-0">
                          <span className="material-symbols-outlined text-2xl">account_balance</span>
                        </div>
                        <div>
                          <h3 className="font-serif text-lg sm:text-xl text-slate-900 font-medium tracking-wide">
                            Official Bank Account Details
                          </h3>
                          <p className="text-[11px] sm:text-xs text-slate-500 font-light mt-0.5">
                            For NEFT / RTGS / IMPS / Wire Transfers
                          </p>
                        </div>
                      </div>

                      {/* Bank Fields Grid */}
                      <div className="space-y-3 relative z-10">

                        {/* Bank Name */}
                        <div className="group p-3.5 sm:p-4 rounded-2xl bg-stone-50/90 hover:bg-amber-50/40 border border-stone-200/90 hover:border-amber-300 transition-all duration-300 flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-amber-100/70 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-xl">account_balance</span>
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <span className="text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Bank Name</span>
                            <p className="font-medium text-slate-900 text-sm sm:text-[15px] tracking-wide truncate">{bankDetails.bankName}</p>
                          </div>
                        </div>

                        {/* Account Name */}
                        <div className="group p-3.5 sm:p-4 rounded-2xl bg-stone-50/90 hover:bg-amber-50/40 border border-stone-200/90 hover:border-amber-300 transition-all duration-300 flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-amber-100/70 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-xl">person</span>
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <span className="text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Account Name</span>
                            <p className="font-medium text-slate-900 text-sm sm:text-[15px] tracking-wide truncate">{bankDetails.accountName}</p>
                          </div>
                        </div>

                        {/* Account Number */}
                        <div className="group p-3.5 sm:p-4 rounded-2xl bg-stone-50/90 hover:bg-amber-50/40 border border-stone-200/90 hover:border-amber-300 transition-all duration-300 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-amber-100/70 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-xl">tag</span>
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <span className="text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Account Number</span>
                              <p className="font-mono text-amber-900 font-bold text-sm sm:text-base tracking-wider truncate">{bankDetails.accountNo}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCopy(bankDetails.accountNo, "accountNo")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300/80 text-amber-900 hover:text-amber-950 transition-all duration-200 text-xs font-semibold cursor-pointer shadow-xs active:scale-95 shrink-0"
                            title="Copy Account Number"
                          >
                            <span className="material-symbols-outlined text-sm">
                              {copiedField === "accountNo" ? "check" : "content_copy"}
                            </span>
                            <span>{copiedField === "accountNo" ? "Copied" : "Copy"}</span>
                          </button>
                        </div>

                        {/* IFSC Code */}
                        <div className="group p-3.5 sm:p-4 rounded-2xl bg-stone-50/90 hover:bg-amber-50/40 border border-stone-200/90 hover:border-amber-300 transition-all duration-300 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-amber-100/70 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-xl">code</span>
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <span className="text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">IFSC Code</span>
                              <p className="font-mono text-amber-900 font-bold text-sm sm:text-base tracking-wider truncate">{bankDetails.ifscCode}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCopy(bankDetails.ifscCode, "ifscCode")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300/80 text-amber-900 hover:text-amber-950 transition-all duration-200 text-xs font-semibold cursor-pointer shadow-xs active:scale-95 shrink-0"
                            title="Copy IFSC Code"
                          >
                            <span className="material-symbols-outlined text-sm">
                              {copiedField === "ifscCode" ? "check" : "content_copy"}
                            </span>
                            <span>{copiedField === "ifscCode" ? "Copied" : "Copy"}</span>
                          </button>
                        </div>

                        {/* Branch */}
                        <div className="group p-3.5 sm:p-4 rounded-2xl bg-stone-50/90 hover:bg-amber-50/40 border border-stone-200/90 hover:border-amber-300 transition-all duration-300 flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-amber-100/70 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-xl">location_on</span>
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <span className="text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Branch</span>
                            <p className="font-medium text-slate-900 text-sm sm:text-[15px] tracking-wide truncate">{bankDetails.branch}</p>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              </ScrollReveal>

              {/* Card 2: Scan & Pay via UPI */}
              <ScrollReveal variant="fade-up" delay={200} className="h-full flex flex-col">
                <div className="rounded-3xl p-[1px] bg-gradient-to-br from-amber-400/40 via-amber-200/50 to-amber-500/40 shadow-xl shadow-stone-200/70 relative flex flex-col h-full">
                  <div className="rounded-[23px] bg-white p-6 sm:p-8 lg:p-9 relative overflow-hidden border border-stone-200/80 shadow-sm flex flex-col justify-between h-full">

                    {/* Ambient Warm Glow */}
                    <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

                    {/* Faint Sacred Mandala / Lotus Watermark Texture */}
                    <svg
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 text-amber-800/10 opacity-30 pointer-events-none select-none -rotate-12"
                      viewBox="0 0 200 200"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      aria-hidden="true"
                    >
                      <circle cx="100" cy="100" r="95" strokeDasharray="3 3" />
                      <circle cx="100" cy="100" r="85" />
                      <circle cx="100" cy="100" r="68" />
                      <circle cx="100" cy="100" r="50" strokeDasharray="4 2" />
                      <circle cx="100" cy="100" r="32" />
                      <circle cx="100" cy="100" r="16" fill="currentColor" fillOpacity="0.1" />
                      <circle cx="100" cy="100" r="6" fill="currentColor" />
                      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
                        <g key={angle} transform={`rotate(${angle} 100 100)`}>
                          <path d="M100 32 C112 50 112 70 100 84 C88 70 88 50 100 32 Z" />
                          <path d="M100 15 C118 40 118 70 100 88 C82 70 82 40 100 15 Z" strokeDasharray="2 2" />
                        </g>
                      ))}
                    </svg>

                    {/* Card Content Header */}
                    <div>
                      <div className="flex items-center gap-3.5 sm:gap-4 border-b border-stone-200 pb-5 mb-6 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-300 text-amber-800 flex items-center justify-center shadow-inner shrink-0">
                          <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
                        </div>
                        <div>
                          <h3 className="font-serif text-lg sm:text-xl text-slate-900 font-medium tracking-wide">
                            Scan &amp; Pay via UPI
                          </h3>
                          <p className="text-[11px] sm:text-xs text-slate-500 font-light mt-0.5">
                            Instant transfer using any UPI app
                          </p>
                        </div>
                      </div>

                      {/* QR Code Presentation Frame */}
                      <div className="flex flex-col items-center justify-center mb-5 relative z-10">
                        <div className="relative p-3.5 sm:p-4 rounded-2xl bg-stone-50 border-2 border-amber-300/80 shadow-md group hover:border-amber-500 transition-all duration-300 flex flex-col items-center">

                          {/* Decorative Gold Corner Accents */}
                          <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-amber-600 rounded-tl-sm pointer-events-none" />
                          <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-amber-600 rounded-tr-sm pointer-events-none" />
                          <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-amber-600 rounded-bl-sm pointer-events-none" />
                          <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-amber-600 rounded-br-sm pointer-events-none" />

                          {/* High-Resolution QR Code */}
                          <Image
                            src={"/upi_qr_code.avif"}
                            alt="UPI QR Code"
                            width={110}
                            height={110}
                            className="w-auto h-auto rounded-lg"
                          />

                          <div className="mt-2 text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-amber-700">center_focus_strong</span>
                            <span>Scan with any UPI App</span>
                          </div>
                        </div>
                      </div>

                      {/* UPI ID Field with Copy Button */}
                      <div className="space-y-3 relative z-10">
                        <div className="group p-3.5 sm:p-4 rounded-2xl bg-stone-50/90 hover:bg-amber-50/40 border border-stone-200/90 hover:border-amber-300 transition-all duration-300 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-amber-100/70 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-xl">contactless</span>
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <span className="text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">UPI ID / VPA</span>
                              <p className="font-mono text-amber-900 font-bold text-sm sm:text-base tracking-wider truncate">{upiDetails.upiId}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCopy(upiDetails.upiId, "upiId")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300/80 text-amber-900 hover:text-amber-950 transition-all duration-200 text-xs font-semibold cursor-pointer shadow-xs active:scale-95 shrink-0"
                            title="Copy UPI ID"
                          >
                            <span className="material-symbols-outlined text-sm">
                              {copiedField === "upiId" ? "check" : "content_copy"}
                            </span>
                            <span>{copiedField === "upiId" ? "Copied" : "Copy"}</span>
                          </button>
                        </div>

                        {/* Payee Name Field */}
                        <div className="group p-3.5 sm:p-4 rounded-2xl bg-stone-50/90 hover:bg-amber-50/40 border border-stone-200/90 hover:border-amber-300 transition-all duration-300 flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-amber-100/70 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-xl">verified_user</span>
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <span className="text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Payee Name</span>
                            <p className="font-medium text-slate-900 text-sm sm:text-[15px] tracking-wide truncate">{upiDetails.payeeName}</p>
                          </div>
                        </div>

                        {/* Supported UPI Apps Pills */}
                        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-600">
                          <span className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 font-medium">Google Pay</span>
                          <span className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 font-medium">PhonePe</span>
                          <span className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 font-medium">Paytm</span>
                          <span className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 font-medium">BHIM UPI</span>
                          <span className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 font-medium">Any Banking App</span>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              </ScrollReveal>

            </div>

            {/* Trust Badges Strip Below Both Cards */}
            <ScrollReveal variant="fade-up" delay={300}>
              <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">

                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl">verified</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Secure &amp; Verified Account</h4>
                    <p className="text-xs text-slate-500 font-light mt-0.5">Official ISKCON registered account</p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl">volunteer_activism</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">100% Utilized for Seva</h4>
                    <p className="text-xs text-slate-500 font-light mt-0.5">Deity worship &amp; Annadanam seva</p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl">receipt_long</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Official Donation Receipt</h4>
                    <p className="text-xs text-slate-500 font-light mt-0.5">Instant confirmation upon request</p>
                  </div>
                </div>

              </div>
            </ScrollReveal>

          </div>
        </section>



      </main>
      <Footer />
    </>
  );
}

