"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConnectAndDonate from "@/components/ConnectAndDonate";
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
        <section id="volunteer" className="py-20 bg-[#0d1e36] border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
                  <span className="w-6 h-[2px] bg-amber-400" />
                  <span>Join Our Sevaks</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-normal text-slate-100">
                  Become our Volunteer
                </h2>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
                  Are you passionate about serving others, connecting with like-minded individuals, and making a positive impact in your community? Consider volunteering with ISKCON Vartak Nagar and become a valuable member of our dedicated team of sevaks (volunteers) committed to spreading the message of love, compassion, and spiritual wisdom.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-colors">
                    <span className="material-symbols-outlined text-amber-400 text-2xl mb-2">soup_kitchen</span>
                    <h3 className="font-semibold text-slate-200 text-sm mb-1">Prasadam Distribution</h3>
                    <p className="text-xs text-slate-400">Help cook, package, and distribute sanctified meals across Thane.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-colors">
                    <span className="material-symbols-outlined text-amber-400 text-2xl mb-2">event_available</span>
                    <h3 className="font-semibold text-slate-200 text-sm mb-1">Festival Support</h3>
                    <p className="text-xs text-slate-400">Assist in stage management, garland making, and crowd care during grand festivals.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-colors">
                    <span className="material-symbols-outlined text-amber-400 text-2xl mb-2">auto_stories</span>
                    <h3 className="font-semibold text-slate-200 text-sm mb-1">Book Outreach</h3>
                    <p className="text-xs text-slate-400">Distribute Bhagavad-gita and Vedic literature to inquisitive seekers.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-colors">
                    <span className="material-symbols-outlined text-amber-400 text-2xl mb-2">photo_camera</span>
                    <h3 className="font-semibold text-slate-200 text-sm mb-1">Media &amp; Communications</h3>
                    <p className="text-xs text-slate-400">Capture temple darshan, produce videos, and manage social media streams.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-gradient-to-br from-[#162d4d] to-[#10243e] p-8 rounded-2xl border border-amber-500/20 shadow-2xl space-y-6">
                <h3 className="font-serif text-xl text-[#dfb260]">Volunteer Signup Inquiry</h3>
                <p className="text-xs text-slate-300">
                  Fill in your details or reach out to our temple office to get enrolled in active volunteer departments.
                </p>

                <form onSubmit={(e) => { e.preventDefault(); alert("Thank you! Our volunteer coordinator will reach out to you shortly."); }} className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      className="w-full px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Phone / WhatsApp Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Area of Interest</label>
                    <select className="w-full px-4 py-2.5 rounded-lg bg-[#0d1c31] border border-white/10 text-sm text-slate-100 focus:outline-none focus:border-amber-400">
                      <option>Prasadam Distribution</option>
                      <option>Festival Organization</option>
                      <option>Vedic Book Distribution</option>
                      <option>Photography &amp; Media</option>
                      <option>Deity Flower Garlands</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
                  >
                    Submit Volunteer Application
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Become ISKCON Life Member */}
        <section className="py-20 bg-[#0a1628] border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#172c47] via-[#1a3557] to-[#10243e] border border-amber-500/25 shadow-2xl relative overflow-hidden">
              <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-3xl space-y-6 relative z-10">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
                  <span className="w-6 h-[2px] bg-amber-400" />
                  <span>Lifelong Spiritual Bond</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-normal text-slate-50">
                  Become ISKCON Life Member
                </h2>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
                  To become a Life Member of ISKCON, simply fill out the Life Membership application form available at your nearest ISKCON center or temple. Upon completion of the application process and payment of the Life Membership fee, you will receive your Life Membership card and welcome package, marking the beginning of your lifelong journey as a valued member of the ISKCON family.
                </p>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <a
                    href="https://www.iskconvartaknagar.in/event"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#d97706] hover:bg-[#b45309] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-amber-950/60 transition-all transform hover:-translate-y-0.5"
                  >
                    <span>SEE OUR EVENTS</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </a>

                  <Link
                    href="/#festivals"
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors"
                  >
                    Explore Temple Calendar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Donate Us & Bank Details */}
        <section id="donate" className="py-20 bg-[#0d1e36]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
                <span className="w-6 h-[2px] bg-amber-400" />
                <span>Direct Bank Transfer</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-100">
                Donate Us
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-light">
                Your direct financial contributions support daily deity worship, prasadam distribution, and temple maintenance. All contributions qualify for official receipts.
              </p>
            </div>

            {/* Bank Details Card */}
            <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#122846] to-[#0a182e] p-8 sm:p-10 rounded-3xl border border-amber-500/30 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-6 mb-8">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-amber-400 text-3xl">account_balance</span>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#dfb260] font-normal">Official Bank Account Details</h3>
                    <p className="text-xs text-slate-400">For NEFT / RTGS / IMPS / Wire Transfers</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-1">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Bank Name</span>
                  <p className="font-medium text-slate-100 text-base">{bankDetails.bankName}</p>
                </div>

                <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-1">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Account Name</span>
                  <p className="font-medium text-slate-100 text-base">{bankDetails.accountName}</p>
                </div>

                <div className="p-4 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 uppercase tracking-wider">Account Number</span>
                    <p className="font-mono text-amber-300 font-bold text-base sm:text-lg">{bankDetails.accountNo}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(bankDetails.accountNo, "accountNo")}
                    className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors text-xs flex items-center gap-1 shrink-0"
                    title="Copy Account Number"
                  >
                    <span className="material-symbols-outlined text-base">
                      {copiedField === "accountNo" ? "check" : "content_copy"}
                    </span>
                    <span>{copiedField === "accountNo" ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 uppercase tracking-wider">IFSC Code</span>
                    <p className="font-mono text-amber-300 font-bold text-base sm:text-lg">{bankDetails.ifscCode}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(bankDetails.ifscCode, "ifscCode")}
                    className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors text-xs flex items-center gap-1 shrink-0"
                    title="Copy IFSC Code"
                  >
                    <span className="material-symbols-outlined text-base">
                      {copiedField === "ifscCode" ? "check" : "content_copy"}
                    </span>
                    <span>{copiedField === "ifscCode" ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                <div className="sm:col-span-2 p-4 rounded-xl bg-black/20 border border-white/5 space-y-1">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Branch</span>
                  <p className="font-medium text-slate-100 text-base">{bankDetails.branch}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Connect & Donate Component */}
        <ConnectAndDonate />
      </main>
      <Footer />
    </>
  );
}
