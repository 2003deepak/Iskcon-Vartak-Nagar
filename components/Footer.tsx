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
    <h3 className="mb-4 text-xs font-semibold tracking-[0.2em] text-amber-400 uppercase">
      {children}
    </h3>
  );
}

function Divider() {
  return (
    <div className="my-6 flex items-center gap-3">
      <span className="h-px flex-1 bg-white/15" />
      <Image
        src="/iskcon_logo.png"
        alt=""
        width={70}
        height={70}
      />
      <span className="h-px flex-1 bg-white/15" />
    </div>
  );
}

function FooterLink({ href = "#", children }: { href?: string, children: React.ReactNode }) {
  const isExternal = href.startsWith("http");
  return (
    <li>
      <Link
        href={href}
        target={isExternal ? "_blank" : undefined}
        className="text-sm text-slate-300 transition-colors hover:text-amber-400 font-light"
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
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-amber-500 hover:text-slate-900 hover:scale-105"
    >
      {children}
    </Link>
  );
}

// ---- Footer ---------------------------------------------------------------

export default function Footer() {
  return (
    <footer className="bg-[#102643] text-white border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr_0.8fr]">
          {/* Brand / about column */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <Image
                src="/logo_white.png"
                alt="ISKCON Vartak Nagar logo"
                width={80}
                height={80}
                className="brightness-110"
              />
              <div>
                <p className="font-serif text-xl font-normal text-white leading-tight">
                  ISKCON Vartak Nagar
                </p>
                <p className="text-[11px] tracking-[0.25em] text-amber-400 uppercase font-semibold mt-0.5">
                  THANE
                </p>
              </div>
            </div>

            <p className="max-w-xs text-sm leading-relaxed text-slate-300/85 font-light">
              A spiritual community in Thane dedicated to sharing Krishna
              consciousness through devotion, wisdom, festivals and loving
              service.
            </p>

            <div className="mt-5 flex items-start gap-2 text-sm text-slate-300/90 font-light">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <span>Vartak Nagar, Thane West, Maharashtra</span>
            </div>
          </div>

          {/* Get in touch column */}
          <div>
            <ColumnHeading>GET IN TOUCH</ColumnHeading>
            <p className="mb-3 text-[15px] font-semibold text-white">
              Temple Office
            </p>

            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-[15px] text-slate-300">
                <Phone className="h-4 w-4 shrink-0 text-amber-500" />
                <a href="tel:+919322881265" className="hover:text-amber-400">
                  +91 93228 81265
                </a>
              </li>
              <li className="flex items-center gap-2 text-[15px] text-slate-300">
                <Mail className="h-4 w-4 shrink-0 text-amber-500" />
                <a
                  href="mailto:info@iskconvartaknagar.com"
                  className="hover:text-amber-400"
                >
                  info@iskconvartaknagar.com
                </a>
              </li>

            </ul>

            <Divider />

            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Temple Timings
                </p>
                <div className="mt-2 space-y-1 text-sm text-slate-300/90 font-light">
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="text-slate-400">Morning:</span>
                    <span>4:30 AM – 12:30 PM</span>
                  </div>
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="text-slate-400">Evening:</span>
                    <span>4:00 PM – 8:30 PM</span>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="#schedule"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors"
            >
              View Full Schedule <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Visit column */}
          <div>
            <ColumnHeading>VISIT</ColumnHeading>
            <ul className="space-y-2.5">
              <FooterLink href="/#schedule">Temple</FooterLink>
              <FooterLink href="/#schedule">Darshan &amp; Aarti</FooterLink>
              <FooterLink href="/#schedule">Temple Timings</FooterLink>
            </ul>

            <div className="mt-8">
              <ColumnHeading>EXPERIENCE</ColumnHeading>
              <ul className="space-y-2.5">
                <FooterLink href="/events">Upcoming Events</FooterLink>
                <FooterLink href="/#calendar">Festivals &amp; Ekadashi</FooterLink>
                <FooterLink href="/#experiences">Kirtan</FooterLink>
                <FooterLink href="/#programs">Bhagavad Gita</FooterLink>
                <FooterLink href="/#experiences">Prasadam</FooterLink>
              </ul>
            </div>
          </div>

          {/* Get involved column */}
          <div>
            <ColumnHeading>GET INVOLVED</ColumnHeading>
            <ul className="space-y-2.5">
              <FooterLink href="/support-us">Support Us</FooterLink>
              <FooterLink href="/support-us#volunteer">Volunteer</FooterLink>
              <FooterLink href="/#programs">Youth Programs</FooterLink>
              <FooterLink href="/#programs">Community</FooterLink>
              <FooterLink href="/support-us#donate">Donate</FooterLink>
            </ul>

            <Divider />

            <ColumnHeading>CONNECT</ColumnHeading>
            <div className="flex items-center gap-3">
              <SocialIcon label="Instagram Handle" href="https://www.instagram.com/iskconvartaknagarthane/">
                <InstagramLogoIcon size={24} />
              </SocialIcon>

              <SocialIcon label="Youtube Handle" href="https://www.youtube.com/@haradascongregation">
                <YoutubeLogoIcon size={24} />
              </SocialIcon>

              <SocialIcon label="Facebook Handle">
                <FacebookLogoIcon size={24} />
              </SocialIcon>

              <SocialIcon label="Whatsapp Handle">
                <WhatsappLogoIcon size={24} />
              </SocialIcon>
            </div>
          </div>

          {/* Mantra column */}
          <div className="lg:text-right">
            <p className="font-serif text-xl font-normal text-white">
              Hare Krishna
            </p>
            <div className="mt-4 space-y-1.5 font-serif text-base italic leading-relaxed text-slate-200/90">
              <p>Hare Krishna Hare Krishna</p>
              <p>Krishna Krishna Hare Hare</p>
              <p>Hare Rama Hare Rama</p>
              <p>Rama Rama Hare Hare</p>
            </div>

            <div className="mt-6 flex items-center gap-3 lg:justify-end">
              <span className="h-px flex-1 bg-white/15 lg:max-w-10" />
              <Image
                src="/lotus-icon.svg"
                alt=""
                width={16}
                height={16}
                className="opacity-70"
              />
              <span className="h-px flex-1 bg-white/15 lg:max-w-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-[#091629]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-6 text-center text-xs text-slate-400 lg:flex-row lg:justify-between lg:px-8 lg:text-left">
          <p>© {new Date().getFullYear()} ISKCON Vartak Nagar. All Rights Reserved.</p>

          <p>
            Founder-Acharya: His Divine Grace A.C. Bhaktivedanta Swami
            Prabhupada
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href="#" className="hover:text-amber-400 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-600">|</span>
            <Link href="#" className="hover:text-amber-400 transition-colors">
              Terms
            </Link>
            <span className="text-slate-600">|</span>
            <Link href="#" className="hover:text-amber-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}