"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync activeTab with current route
  useEffect(() => {
    if (pathname === "/support-us") {
      setActiveTab("support-us");
    } else if (pathname === "/about") {
      setActiveTab("about");
    } else if (pathname === "/") {
      if (!window.location.hash) {
        setActiveTab("home");
      }
    }
  }, [pathname]);

  const navLinks = [
    { label: "Home", path: "home", href: "/" },
    { label: "Temple", path: "temple", href: "/#schedule" },
    { label: "Events", path: "events", href: "/#festivals" },
    { label: "Programs", path: "programs", href: "/#programs" },
    { label: "About", path: "about", href: "/about" },
    { label: "Media", path: "media", href: "/#gallery", hasDropdown: true },
    { label: "Support Us", path: "support-us", href: "/support-us" },
  ];

  return (
    <header className="sticky top-0 w-full z-50 bg-[#102643] backdrop-blur-md border-b border-amber-500/10 shadow-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

        {/* Brand Logo & Title */}
        <Link href="/" onClick={() => setActiveTab("home")} className="flex items-center gap-3.5 group">
          <div className="relative h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center shrink-0">
            <Image
              src="/logo_white.png"
              alt="ISKCON Vartak Nagar logo"
              width={160}
              height={160}
              unoptimized
              priority
              className="object-contain w-full h-full brightness-110 contrast-125"
            />
          </div>

          {/* Vertical Separator */}
          <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-amber-500/30 to-transparent hidden sm:block" />

          {/* Text Block */}
          <div className="flex flex-col justify-center">
            <div className="flex items-baseline gap-2.5">
              <span className="font-serif text-lg sm:text-xl font-normal tracking-wide text-[#e6ca85] leading-none">
                ISKCON Vartak Nagar, Thane
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] tracking-wide text-slate-300/90 font-light mt-1 leading-tight">
              International Society For Krishna Consciousness
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => {
            const isActive = activeTab === link.path;
            return (
              <Link
                key={link.path}
                href={link.href}
                onClick={() => setActiveTab(link.path)}
                className={`relative py-2 text-[14px] transition-colors flex items-center gap-1 group ${
                  isActive
                    ? "text-[#dfb260] font-semibold"
                    : "text-slate-200 hover:text-[#dfb260] font-normal"
                }`}
              >
                <span>{link.label}</span>
                {link.hasDropdown && (
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isActive ? "text-[#dfb260]" : "text-slate-400 group-hover:text-[#dfb260]"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                )}

                {/* Saffron/Gold Hover & Active Underline Indicator with Glow */}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-[#dfb260] transition-all duration-300 ${
                    isActive
                      ? "w-full shadow-[0_0_8px_#dfb260]"
                      : "w-0 group-hover:w-full group-hover:opacity-90 shadow-[0_0_8px_#dfb260]"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Donate Button (Prominent Saffron Pill with Heart Icon) */}
          <Link
            href="/support-us#donate"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-[#d97706] hover:bg-[#b45309] active:scale-95 text-white text-xs sm:text-[13px] font-semibold shadow-md shadow-amber-950/40 hover:shadow-amber-900/50 hover:scale-105 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>Donate</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#091322] border-t border-amber-500/10 px-6 py-4 flex flex-col gap-2 shadow-2xl">
          {navLinks.map((link) => {
            const isActive = activeTab === link.path;
            return (
              <Link
                key={link.path}
                href={link.href}
                onClick={() => {
                  setActiveTab(link.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2.5 px-3 rounded-lg text-sm transition-colors flex items-center justify-between ${
                  isActive
                    ? "bg-amber-500/15 text-[#dfb260] font-semibold border border-amber-500/30"
                    : "text-slate-200 hover:bg-white/5 hover:text-[#dfb260]"
                }`}
              >
                <span>{link.label}</span>
                {link.hasDropdown && (
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2 sm:hidden">
            <a
              href="#schedule"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-[#c7a45b]/60 text-slate-100 text-sm font-medium hover:bg-amber-500/10"
            >
              <svg
                className="w-4 h-4 text-[#e6ca85]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21v-4m0 0H8.5a2.5 2.5 0 01-2.5-2.5V11m6 6h3.5a2.5 2.5 0 002.5-2.5V11M12 3L2 9h20L12 3zM4 11v8m16-8v8M9 11v4m6-4v4"
                />
              </svg>
              <span>Visit Temple</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

