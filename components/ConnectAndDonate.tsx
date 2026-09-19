"use client";

import { useState } from "react";

export default function ConnectAndDonate() {
  const [email, setEmail] = useState("");
  const [buttonText, setButtonText] = useState("Subscribe");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setButtonText("Subscribed! Hare Krishna");
    setIsSubscribed(true);
  };

  return (
    <section className="w-full py-20 px-6 max-w-7xl mx-auto" id="donate">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Newsletter / Daily Darshan Updates */}
        <div className="lg:col-span-6 p-8 sm:p-10 rounded-2xl bg-surface-container-low flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Stay Connected
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-on-surface mt-2 mb-3">
              Receive Daily Darshan &amp; Festival Updates
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
              Get serene high-resolution Deity darshan images, festival schedules, and
              weekly inspirational Bhagavad-gita verses delivered to your phone or inbox.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                className="flex-1 px-4 py-3 rounded-full bg-surface-container-lowest text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                placeholder="Enter your email address"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className={`px-6 py-3 rounded-full text-on-primary text-xs font-semibold uppercase tracking-wider shadow transition-colors whitespace-nowrap ${isSubscribed
                    ? "bg-tertiary-container hover:bg-[#964400]"
                    : "bg-primary hover:bg-on-primary-fixed-variant"
                  }`}
                type="submit"
              >
                {buttonText}
              </button>
            </form>
            <span className="text-[11px] text-on-surface-variant/70">
              We respect your privacy. Unsubscribe at any time.
            </span>
          </div>
        </div>

        {/* Seva Donation Invitation Card */}
        <div className="lg:col-span-6 p-8 sm:p-10 rounded-2xl bg-[#bd5700] text-on-tertiary-container flex flex-col justify-between shadow-md">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-lowest/20 text-xs font-medium uppercase tracking-wider mb-4">
              <span className="material-symbols-outlined text-sm">
                favorite
              </span>
              Sacred Seva
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-light tracking-tight mb-3">
              Help Us Serve With Love
            </h3>
            <p className="text-xs sm:text-sm text-surface-container-lowest/90 leading-relaxed mb-6">
              Your generous contribution fuels free Annadaan (Food for Life),
              maintenance of temple sanctum, youth values education, and grand
              festival celebrations. All donations eligible for tax exemption under 80G.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-surface-container-lowest text-tertiary-container text-xs font-bold uppercase tracking-wider shadow hover:bg-surface-container-lowest/90 transition-colors"
              href="#"
            >
              <span>Support Temple Seva</span>
              <span className="material-symbols-outlined text-base">
                volunteer_activism
              </span>
            </a>

          </div>
        </div>
      </div>
    </section>
  );
}
