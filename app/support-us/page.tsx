"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DevotionInAction from "@/components/DevotionInAction";

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

  return (
    <>
      <Header />
      <main className="w-full bg-[#0a1628] text-slate-100 min-h-screen">

        <DevotionInAction />

        {/* Section 1: Become our Volunteer */}
        <section id="volunteer" className="py-20 lg:py-28 bg-[#0d1e36] border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-xs font-semibold tracking-[0.25em] text-amber-300 uppercase shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>Join Our Sevaks</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight">
                  Become our Volunteer
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-[1.75] font-light">
                  Are you passionate about serving others, connecting with like-minded individuals, and making a positive impact in your community? Consider volunteering with ISKCON Vartak Nagar and become a valuable member of our dedicated team of sevaks (volunteers) committed to spreading the message of love, compassion, and spiritual wisdom.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
                  <div className="group p-6 rounded-2xl lg:rounded-3xl bg-white/[0.035] hover:bg-white/[0.06] border border-white/10 hover:border-amber-400/40 transition-all duration-300 space-y-3 shadow-lg shadow-black/20">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-300 flex items-center justify-center shadow-inner group-hover:scale-105 group-hover:bg-amber-400/20 group-hover:border-amber-400/50 group-hover:text-amber-200 transition-all duration-300">
                      <span className="material-symbols-outlined text-2xl">soup_kitchen</span>
                    </div>
                    <h3 className="font-serif text-lg font-normal text-white group-hover:text-[#fde68a] transition-colors">Prasadam Distribution</h3>
                    <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed font-light">Help cook, package, and distribute sanctified meals across Thane.</p>
                  </div>

                  <div className="group p-6 rounded-2xl lg:rounded-3xl bg-white/[0.035] hover:bg-white/[0.06] border border-white/10 hover:border-amber-400/40 transition-all duration-300 space-y-3 shadow-lg shadow-black/20">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-300 flex items-center justify-center shadow-inner group-hover:scale-105 group-hover:bg-amber-400/20 group-hover:border-amber-400/50 group-hover:text-amber-200 transition-all duration-300">
                      <span className="material-symbols-outlined text-2xl">event_available</span>
                    </div>
                    <h3 className="font-serif text-lg font-normal text-white group-hover:text-[#fde68a] transition-colors">Festival Support</h3>
                    <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed font-light">Assist in stage management, garland making, and crowd care during grand festivals.</p>
                  </div>

                  <div className="group p-6 rounded-2xl lg:rounded-3xl bg-white/[0.035] hover:bg-white/[0.06] border border-white/10 hover:border-amber-400/40 transition-all duration-300 space-y-3 shadow-lg shadow-black/20">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-300 flex items-center justify-center shadow-inner group-hover:scale-105 group-hover:bg-amber-400/20 group-hover:border-amber-400/50 group-hover:text-amber-200 transition-all duration-300">
                      <span className="material-symbols-outlined text-2xl">auto_stories</span>
                    </div>
                    <h3 className="font-serif text-lg font-normal text-white group-hover:text-[#fde68a] transition-colors">Book Outreach</h3>
                    <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed font-light">Distribute Bhagavad-gita and Vedic literature to inquisitive seekers.</p>
                  </div>

                  <div className="group p-6 rounded-2xl lg:rounded-3xl bg-white/[0.035] hover:bg-white/[0.06] border border-white/10 hover:border-amber-400/40 transition-all duration-300 space-y-3 shadow-lg shadow-black/20">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-300 flex items-center justify-center shadow-inner group-hover:scale-105 group-hover:bg-amber-400/20 group-hover:border-amber-400/50 group-hover:text-amber-200 transition-all duration-300">
                      <span className="material-symbols-outlined text-2xl">photo_camera</span>
                    </div>
                    <h3 className="font-serif text-lg font-normal text-white group-hover:text-[#fde68a] transition-colors">Media &amp; Communications</h3>
                    <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed font-light">Capture temple darshan, produce videos, and manage social media streams.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-gradient-to-br from-[#122846] to-[#0a182e] p-8 sm:p-10 rounded-2xl lg:rounded-3xl border border-amber-500/25 shadow-2xl space-y-6">
                <h3 className="font-serif text-2xl text-[#dfb260] font-normal">Volunteer Signup Inquiry</h3>
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  Fill in your details or reach out to our temple office to get enrolled in active volunteer departments.
                </p>

                <form onSubmit={(e) => { e.preventDefault(); alert("Thank you! Our volunteer coordinator will reach out to you shortly."); }} className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-300/90 font-medium mb-1.5 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/15 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300/90 font-medium mb-1.5 uppercase tracking-wider">Phone / WhatsApp Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/15 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300/90 font-medium mb-1.5 uppercase tracking-wider">Area of Interest</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-[#0d1c31] border border-white/15 text-sm text-slate-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all">
                      <option>Prasadam Distribution</option>
                      <option>Festival Organization</option>
                      <option>Vedic Book Distribution</option>
                      <option>Photography &amp; Media</option>
                      <option>Deity Flower Garlands</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#dfb260] hover:bg-[#cca04b] text-[#060e1b] text-xs font-bold uppercase tracking-wider shadow-md shadow-amber-950/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-950/40 active:translate-y-0 transition-all duration-200 cursor-pointer"
                  >
                    Submit Volunteer Application
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Become ISKCON Life Member */}
        <section className="py-20 lg:py-28 bg-[#0a1628] border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="p-8 sm:p-14 rounded-2xl lg:rounded-3xl bg-gradient-to-r from-[#172c47] via-[#1a3557] to-[#10243e] border border-amber-500/25 shadow-2xl relative overflow-hidden">
              <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-3xl space-y-6 relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-xs font-semibold tracking-[0.25em] text-amber-300 uppercase shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>Lifelong Spiritual Bond</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-slate-50 tracking-tight">
                  Become ISKCON Life Member
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-[1.75] font-light">
                  To become a Life Member of ISKCON, simply fill out the Life Membership application form available at your nearest ISKCON center or temple. Upon completion of the application process and payment of the Life Membership fee, you will receive your Life Membership card and welcome package, marking the beginning of your lifelong journey as a valued member of the ISKCON family.
                </p>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <a
                    href="https://www.iskconvartaknagar.in/event"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#dfb260] hover:bg-[#cca04b] text-[#060e1b] text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md shadow-amber-950/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-950/40 active:translate-y-0 transition-all duration-200"
                  >
                    <span>SEE OUR EVENTS</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </a>

                  <Link
                    href="/#festivals"
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-transparent hover:bg-[#dfb260]/10 border-[1.5px] border-[#dfb260] text-[#dfb260] hover:text-[#fce8b8] text-xs sm:text-sm font-semibold uppercase tracking-wider hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                  >
                    Explore Temple Calendar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Donate Us & Matched Payment Cards */}
        <section id="donate" className="py-20 lg:py-28 bg-[#0d1e36]">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-xs font-semibold tracking-[0.25em] text-amber-300 uppercase shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Sacred Offerings &amp; Seva</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight">
                Donate &amp; Support Us
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                Your direct financial contributions support daily deity worship, Annadanam prasadam distribution, and temple maintenance. All contributions qualify for official receipts.
              </p>
            </div>

            {/* Side-by-Side Payment Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-6xl mx-auto">

              {/* Card 1: Direct Bank Transfer */}
              <div className="rounded-3xl p-[1px] bg-gradient-to-br from-amber-400/50 via-amber-500/10 to-amber-400/50 shadow-2xl relative flex flex-col">
                <div className="rounded-[23px] bg-gradient-to-br from-[#122846] via-[#0d1f36] to-[#081426] p-6 sm:p-8 lg:p-9 relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_inset_0_0_28px_rgba(217,119,6,0.06)] flex flex-col justify-between h-full">

                  {/* Ambient Glows */}
                  <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />

                  {/* Faint Sacred Mandala / Lotus Watermark Texture */}
                  <svg
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 text-amber-300/50 opacity-[0.035] pointer-events-none select-none -rotate-12"
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

                  {/* Card Header */}
                  <div>
                    <div className="flex items-center gap-3.5 sm:gap-4 border-b border-amber-500/20 pb-5 mb-6 relative z-10">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-300 flex items-center justify-center shadow-inner shrink-0">
                        <span className="material-symbols-outlined text-2xl">account_balance</span>
                      </div>
                      <div>
                        <h3 className="font-serif text-lg sm:text-xl text-[#dfb260] font-normal tracking-wide">Official Bank Account Details</h3>
                        <p className="text-[11px] sm:text-xs text-slate-400 font-light mt-0.5">For NEFT / RTGS / IMPS / Wire Transfers</p>
                      </div>
                    </div>

                    {/* Bank Fields Grid */}
                    <div className="space-y-3.5 relative z-10">

                      {/* Bank Name */}
                      <div className="group p-4 sm:p-4.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.055] border border-white/10 hover:border-amber-400/35 transition-all duration-300 shadow-md shadow-black/20 flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-300 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 group-hover:bg-amber-400/20 group-hover:border-amber-400/50 group-hover:text-amber-200 transition-all duration-300">
                          <span className="material-symbols-outlined text-xl">account_balance</span>
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider font-medium block">Bank Name</span>
                          <p className="font-medium text-slate-100 text-sm sm:text-[15px] tracking-wide truncate">{bankDetails.bankName}</p>
                        </div>
                      </div>

                      {/* Account Name */}
                      <div className="group p-4 sm:p-4.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.055] border border-white/10 hover:border-amber-400/35 transition-all duration-300 shadow-md shadow-black/20 flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-300 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 group-hover:bg-amber-400/20 group-hover:border-amber-400/50 group-hover:text-amber-200 transition-all duration-300">
                          <span className="material-symbols-outlined text-xl">person</span>
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider font-medium block">Account Name</span>
                          <p className="font-medium text-slate-100 text-sm sm:text-[15px] tracking-wide truncate">{bankDetails.accountName}</p>
                        </div>
                      </div>

                      {/* Account Number */}
                      <div className="group p-4 sm:p-4.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.055] border border-white/10 hover:border-amber-400/35 transition-all duration-300 shadow-md shadow-black/20 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-300 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 group-hover:bg-amber-400/20 group-hover:border-amber-400/50 group-hover:text-amber-200 transition-all duration-300">
                            <span className="material-symbols-outlined text-xl">tag</span>
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider font-medium block">Account Number</span>
                            <p className="font-mono text-amber-300 font-bold text-sm sm:text-base tracking-wider truncate">{bankDetails.accountNo}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopy(bankDetails.accountNo, "accountNo")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/25 border border-amber-400/20 hover:border-amber-400/40 text-amber-300 hover:text-amber-200 transition-all duration-200 text-xs font-medium cursor-pointer shadow-xs active:scale-95 shrink-0"
                          title="Copy Account Number"
                        >
                          <span className="material-symbols-outlined text-sm">
                            {copiedField === "accountNo" ? "check" : "content_copy"}
                          </span>
                          <span>{copiedField === "accountNo" ? "Copied" : "Copy"}</span>
                        </button>
                      </div>

                      {/* IFSC Code */}
                      <div className="group p-4 sm:p-4.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.055] border border-white/10 hover:border-amber-400/35 transition-all duration-300 shadow-md shadow-black/20 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-300 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 group-hover:bg-amber-400/20 group-hover:border-amber-400/50 group-hover:text-amber-200 transition-all duration-300">
                            <span className="material-symbols-outlined text-xl">code</span>
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider font-medium block">IFSC Code</span>
                            <p className="font-mono text-amber-300 font-bold text-sm sm:text-base tracking-wider truncate">{bankDetails.ifscCode}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopy(bankDetails.ifscCode, "ifscCode")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/25 border border-amber-400/20 hover:border-amber-400/40 text-amber-300 hover:text-amber-200 transition-all duration-200 text-xs font-medium cursor-pointer shadow-xs active:scale-95 shrink-0"
                          title="Copy IFSC Code"
                        >
                          <span className="material-symbols-outlined text-sm">
                            {copiedField === "ifscCode" ? "check" : "content_copy"}
                          </span>
                          <span>{copiedField === "ifscCode" ? "Copied" : "Copy"}</span>
                        </button>
                      </div>

                      {/* Branch */}
                      <div className="group p-4 sm:p-4.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.055] border border-white/10 hover:border-amber-400/35 transition-all duration-300 shadow-md shadow-black/20 flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-300 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 group-hover:bg-amber-400/20 group-hover:border-amber-400/50 group-hover:text-amber-200 transition-all duration-300">
                          <span className="material-symbols-outlined text-xl">location_on</span>
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider font-medium block">Branch</span>
                          <p className="font-medium text-slate-100 text-sm sm:text-[15px] tracking-wide truncate">{bankDetails.branch}</p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Scan & Pay via UPI */}
              <div className="rounded-3xl p-[1px] bg-gradient-to-br from-amber-400/50 via-amber-500/10 to-amber-400/50 shadow-2xl relative flex flex-col">
                <div className="rounded-[23px] bg-gradient-to-br from-[#122846] via-[#0d1f36] to-[#081426] p-6 sm:p-8 lg:p-9 relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_inset_0_0_28px_rgba(217,119,6,0.06)] flex flex-col justify-between h-full">

                  {/* Ambient Glows */}
                  <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />

                  {/* Faint Sacred Mandala / Lotus Watermark Texture */}
                  <svg
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 text-amber-300/50 opacity-[0.035] pointer-events-none select-none -rotate-12"
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

                  {/* Card Header */}
                  <div>
                    <div className="flex items-center gap-3.5 sm:gap-4 border-b border-amber-500/20 pb-5 mb-6 relative z-10">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-300 flex items-center justify-center shadow-inner shrink-0">
                        <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
                      </div>
                      <div>
                        <h3 className="font-serif text-lg sm:text-xl text-[#dfb260] font-normal tracking-wide">Scan &amp; Pay via UPI</h3>
                        <p className="text-[11px] sm:text-xs text-slate-400 font-light mt-0.5">Instant transfer using any UPI app</p>
                      </div>
                    </div>

                    {/* QR Code Presentation Frame */}
                    <div className="flex flex-col items-center justify-center mb-5 relative z-10">
                      <div className="relative p-3.5 sm:p-4 rounded-2xl bg-white border border-amber-400/40 shadow-xl shadow-black/40 group hover:border-amber-400 transition-all duration-300 flex flex-col items-center">

                        {/* Decorative Gold Corner Accents */}
                        <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-amber-500 rounded-tl-sm pointer-events-none" />
                        <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-amber-500 rounded-tr-sm pointer-events-none" />
                        <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-amber-500 rounded-bl-sm pointer-events-none" />
                        <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-amber-500 rounded-br-sm pointer-events-none" />

                        {/* High-Resolution SVG QR Code Representation */}
                        <Image
                          src={"/upi_qr_code.avif"}
                          alt="UPI QR Code"
                          width={100}
                          height={100}
                        />

                        <div className="mt-2 text-[11px] font-semibold text-[#102643] uppercase tracking-wider flex items-center gap-1">
                          <span>Scan with any UPI App</span>
                        </div>
                      </div>
                    </div>

                    {/* UPI ID Field with Copy Button */}
                    <div className="space-y-3 relative z-10">
                      <div className="group p-4 sm:p-4.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.055] border border-white/10 hover:border-amber-400/35 transition-all duration-300 shadow-md shadow-black/20 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-300 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 group-hover:bg-amber-400/20 group-hover:border-amber-400/50 group-hover:text-amber-200 transition-all duration-300">
                            <span className="material-symbols-outlined text-xl">contactless</span>
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider font-medium block">UPI ID / VPA</span>
                            <p className="font-mono text-amber-300 font-bold text-sm sm:text-base tracking-wider truncate">{upiDetails.upiId}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopy(upiDetails.upiId, "upiId")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/25 border border-amber-400/20 hover:border-amber-400/40 text-amber-300 hover:text-amber-200 transition-all duration-200 text-xs font-medium cursor-pointer shadow-xs active:scale-95 shrink-0"
                          title="Copy UPI ID"
                        >
                          <span className="material-symbols-outlined text-sm">
                            {copiedField === "upiId" ? "check" : "content_copy"}
                          </span>
                          <span>{copiedField === "upiId" ? "Copied" : "Copy"}</span>
                        </button>
                      </div>

                      {/* Payee Name Field */}
                      <div className="group p-4 sm:p-4.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.055] border border-white/10 hover:border-amber-400/35 transition-all duration-300 shadow-md shadow-black/20 flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-amber-300 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 group-hover:bg-amber-400/20 group-hover:border-amber-400/50 group-hover:text-amber-200 transition-all duration-300">
                          <span className="material-symbols-outlined text-xl">verified_user</span>
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider font-medium block">Payee Name</span>
                          <p className="font-medium text-slate-100 text-sm sm:text-[15px] tracking-wide truncate">{upiDetails.payeeName}</p>
                        </div>
                      </div>

                      {/* Supported UPI Apps Pills */}
                      <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
                        <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">Google Pay</span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">PhonePe</span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">Paytm</span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">BHIM UPI</span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">Any Banking App</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Trust Badges Strip Below Both Cards */}
            <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.025] border border-amber-500/20 flex items-center gap-3.5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/25 text-amber-300 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">verified</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-100">Secure &amp; Verified Account</h4>
                  <p className="text-xs text-slate-400 font-light mt-0.5">Official ISKCON registered account</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.025] border border-amber-500/20 flex items-center gap-3.5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/25 text-amber-300 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">volunteer_activism</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-100">100% Utilized for Seva</h4>
                  <p className="text-xs text-slate-400 font-light mt-0.5">Deity worship &amp; Annadanam seva</p>
                </div>
              </div>

            </div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
