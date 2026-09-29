"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Envelope as Mail,
  ChatCircle as MessageCircle,
  Clock,
  ArrowRight,
  InstagramLogoIcon,
  YoutubeLogoIcon,
  FacebookLogoIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react";

// ---- Reusable bits -------------------------------------------------------

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-xs font-semibold tracking-[0.2em] text-amber-400 uppercase text-center lg:text-left">
      {children}
    </h3>
  );
}

function Divider() {
  return (
    <div className="my-6 flex items-center justify-center gap-3 w-full max-w-xs mx-auto lg:max-w-none">
      <span className="h-px flex-1 bg-white/15" />
      <Image
        src="/iskcon_logo.png"
        alt="ISKCON Logo mark"
        width={80}
        height={80}
        className="opacity-80"
      />
      <span className="h-px flex-1 bg-white/15" />
    </div>
  );
}

function FooterLink({ href = "#", children }: { href?: string; children: React.ReactNode }) {
  const isExternal = href.startsWith("http");
  return (
    <li className="text-center lg:text-left">
      <Link
        href={href}
        target={isExternal ? "_blank" : undefined}
        className="inline-block py-1 text-sm text-slate-300 transition-colors hover:text-amber-400 font-light"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({
  href = "#",
  label,
  children,
}: {
  href?: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-amber-500 hover:text-slate-900 hover:scale-105 active:scale-95"
    >
      {children}
    </Link>
  );
}

// ---- Footer ---------------------------------------------------------------

export default function Footer() {
  return (
    <footer className="bg-[#102643] text-white border-t border-white/5 w-full overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1.1fr_0.9fr_1.1fr_1fr] gap-10 md:gap-12 lg:gap-8">

          {/* Brand / about column */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="mb-5 flex flex-col sm:flex-row items-center gap-3">
              <Image
                src="/logo_white.png"
                alt="ISKCON Vartak Nagar logo"
                width={60}
                height={60}
                className="brightness-110 w-14 h-14 object-contain shrink-0"
              />
              <div className="text-center sm:text-left">
                <p className="font-serif text-xl font-normal text-white leading-tight">
                  ISKCON Vartak Nagar
                </p>
                <p className="text-[11px] tracking-[0.25em] text-amber-400 uppercase font-semibold mt-0.5">
                  THANE
                </p>
              </div>
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-slate-300/85 font-light">
              A spiritual community in Thane dedicated to sharing Krishna
              consciousness through devotion, wisdom, festivals and loving
              service.
            </p>

            <div className="mt-5 flex items-center lg:items-start justify-center lg:justify-start gap-2 text-sm text-slate-300/90 font-light max-w-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <span>Vartak Nagar, Thane West, Maharashtra</span>
            </div>
          </div>

          {/* Get in touch column */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <ColumnHeading>GET IN TOUCH</ColumnHeading>
            <p className="mb-3 text-[15px] font-semibold text-white">
              Temple Office
            </p>

            <ul className="space-y-3 w-full flex flex-col items-center lg:items-start">
              <li className="flex items-center justify-center lg:justify-start gap-2 text-[15px] text-slate-300">
                <Phone className="h-4 w-4 shrink-0 text-amber-500" />
                <a href="tel:+919322881265" className="hover:text-amber-400 transition-colors">
                  +91 93228 81265
                </a>
              </li>
              <li className="flex items-center justify-center lg:justify-start gap-2 text-[15px] text-slate-300">
                <Mail className="h-4 w-4 shrink-0 text-amber-500" />
                <a
                  href="mailto:iskconvartaknagarthane@gmail.com"
                  className="hover:text-amber-400 transition-colors break-all sm:break-normal"
                >
                  iskconvartaknagarthane@gmail.com
                </a>
              </li>
            </ul>

            <Divider />

            <div className="flex flex-col items-center lg:items-start w-full">
              <div className="flex items-center lg:items-start justify-center lg:justify-start gap-2 mb-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <p className="text-sm font-semibold text-white">
                  Temple Timings
                </p>
              </div>
              <div className="space-y-1 text-sm text-slate-300/90 font-light flex flex-col items-center lg:items-start">
                <div className="flex items-center justify-center lg:justify-start gap-1.5 whitespace-nowrap">
                  <span className="text-slate-400">Morning:</span>
                  <span>4:30 AM – 12:30 PM</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-1.5 whitespace-nowrap">
                  <span className="text-slate-400">Evening:</span>
                  <span>4:00 PM – 8:30 PM</span>
                </div>
              </div>

              <Link
                href="/#schedule"
                className="mt-4 inline-flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors py-1"
              >
                <span>View Full Schedule</span> <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Visit column */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <ColumnHeading>VISIT</ColumnHeading>
            <ul className="space-y-2 flex flex-col items-center lg:items-start w-full">
              <FooterLink href="/#schedule">Temple</FooterLink>
              <FooterLink href="/#schedule">Darshan &amp; Aarti</FooterLink>
              <FooterLink href="/#schedule">Temple Timings</FooterLink>
            </ul>

            <div className="mt-8 flex flex-col items-center lg:items-start w-full">
              <ColumnHeading>EXPERIENCE</ColumnHeading>
              <ul className="space-y-2 flex flex-col items-center lg:items-start w-full">
                <FooterLink href="/events">Upcoming Events</FooterLink>
                <FooterLink href="/#calendar">Festivals &amp; Ekadashi</FooterLink>
                <FooterLink href="/#experiences">Kirtan</FooterLink>
                <FooterLink href="/#programs">Bhagavad Gita</FooterLink>
                <FooterLink href="/#experiences">Prasadam</FooterLink>
              </ul>
            </div>
          </div>

          {/* Get involved column */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <ColumnHeading>GET INVOLVED</ColumnHeading>
            <ul className="space-y-2 flex flex-col items-center lg:items-start w-full">
              <FooterLink href="/support-us">Support Us</FooterLink>
              <FooterLink href="/support-us#volunteer">Volunteer</FooterLink>
              <FooterLink href="/#programs">Youth Programs</FooterLink>
              <FooterLink href="/#programs">Community</FooterLink>
              <FooterLink href="/support-us#donate">Donate</FooterLink>
            </ul>

            <Divider />

            <ColumnHeading>CONNECT</ColumnHeading>
            <div className="flex items-center justify-center lg:justify-start gap-3 flex-wrap">
              <SocialIcon label="Instagram Handle" href="https://www.instagram.com/iskconvartaknagarthane/">
                <InstagramLogoIcon size={22} />
              </SocialIcon>

              <SocialIcon label="Youtube Handle" href="https://www.youtube.com/@haradascongregation">
                <YoutubeLogoIcon size={22} />
              </SocialIcon>

              <SocialIcon label="Facebook Handle">
                <FacebookLogoIcon size={22} />
              </SocialIcon>

              <SocialIcon label="Whatsapp Handle">
                <WhatsappLogoIcon size={22} />
              </SocialIcon>
            </div>
          </div>

          {/* Mantra column */}
          <div className="flex flex-col items-center lg:items-end text-center lg:text-right md:col-span-2 lg:col-span-1">
            <p className="font-serif text-xl font-normal text-white">
              Hare Krishna
            </p>
            <div className="mt-3 space-y-1 font-serif text-base italic leading-relaxed text-slate-200/90">
              <p>Hare Krishna Hare Krishna</p>
              <p>Krishna Krishna Hare Hare</p>
              <p>Hare Rama Hare Rama</p>
              <p>Rama Rama Hare Hare</p>
            </div>

            <Divider />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-[#091629]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-5 py-6 text-center text-xs text-slate-400 lg:flex-row lg:justify-between lg:px-8 lg:text-left">
          <p className="order-1 lg:order-none">© {new Date().getFullYear()} ISKCON Vartak Nagar. All Rights Reserved.</p>

          <p className="order-2 lg:order-none text-slate-400/90 font-light">
            Founder-Acharya: His Divine Grace A.C. Bhaktivedanta Swami Prabhupada
          </p>

          <div className="order-3 lg:order-none flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href="#" className="hover:text-amber-400 transition-colors py-1">
              Privacy Policy
            </Link>
            <span className="text-slate-600">|</span>
            <Link href="#" className="hover:text-amber-400 transition-colors py-1">
              Terms
            </Link>
            <span className="text-slate-600">|</span>
            <Link href="/#visit" className="hover:text-amber-400 transition-colors py-1">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}