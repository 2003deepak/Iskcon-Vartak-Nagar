"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Slide {
  id: number;
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: { text: string; href: string };
  secondaryCta: { text: string; href: string };
}

const slides: Slide[] = [
  {
    id: 1,
    image: "/gaur_nitai.jpeg",
    alt: "Deity Darshan Sri Sri Gaura Nitai",
    eyebrow: "WELCOME TO ISKCON VARTAK NAGAR • THANE",
    title: "Welcome to ISKCON Vartak Nagar",
    subtitle: "Experience divine peace, spiritual wisdom, and joyful devotion in the heart of Thane.",
    primaryCta: { text: "Visit Temple", href: "#schedule" },
    secondaryCta: { text: "Explore Events", href: "#festivals" },
  },
  {
    id: 2,
    image: "/gaur_nitia_1.jpeg",
    alt: "Krishna Consciouness",
    eyebrow: "DAILY DARSHAN & AARTI • 4:30 AM – 8:30 PM",
    title: "A Sanctuary for Your Soul",
    subtitle: "Immerse yourself in daily morning & evening Mangala Aarti, Sandhya Aarti and serene meditation.",
    primaryCta: { text: "Temple Timings", href: "#schedule" },
    secondaryCta: { text: "Get Directions", href: "#location" },
  },
  {
    id: 3,
    image: "https://ik.imagekit.io/9uy2us6yw/LandingPage/download?updatedAt=1752604090619",
    alt: "Festivals and Kirtan celebrations",
    eyebrow: "HOLY CHANTING & COMMUNITY",
    title: "Vibrant Kirtans & Grand Festivals",
    subtitle: "Celebrate Janmashtami, Radhastami, Ratha Yatra and weekly Sunday feasts with joyful kirtan.",
    primaryCta: { text: "Upcoming Events", href: "#festivals" },
    secondaryCta: { text: "Join Community", href: "#community" },
  },
  {
    id: 4,
    image: "/books_distribution.jpg",
    alt: "Loving Seva and Prasadam Distribution",
    eyebrow: "BHAGAVAD GITA & DEVOTIONAL SEVA",
    title: "Book Distributions",
    subtitle: "Discover timeless Vedic wisdom, participate in volunteer seva, and relish pure sanctified food.",
    primaryCta: { text: "Offer Seva", href: "#donate" },
    secondaryCta: { text: "Learn More", href: "#about" },
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  return (
    <section
      className="relative w-full h-[90vh] min-h-[580px] max-h-[850px] flex items-center justify-center overflow-hidden bg-[#060d18]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images Carousel */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
        >
          <Image
            alt={slide.alt}
            src={slide.image}
            fill
            className="object-cover object-center"
            priority={index === 0}
          />
          {/* Ultra Subtle Gradient Overlays for maximum background image clarity */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060d18] via-transparent to-black/25 opacity-70" />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      ))}

      {/* Content Container (shifted down slightly for optimal composition) */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center pt-16 sm:pt-20">
        {/* Eyebrow / Live Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 mb-4 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#dfb260] animate-pulse shadow-[0_0_8px_#dfb260]" />
          <span className="text-[11px] sm:text-xs tracking-widest uppercase font-medium text-[#e6ca85]">
            {slides[currentSlide].eyebrow}
          </span>
        </div>

        {/* Headline with high-contrast drop shadow */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight text-[#fce8b8] max-w-3xl mb-4 [text-shadow:_0_3px_12px_rgba(0,0,0,0.95),_0_1px_4px_rgba(0,0,0,0.9)] transition-all duration-700">
          {slides[currentSlide].title}
        </h1>

        {/* Subtitle with soft frosted glass pill for readability over bright images */}
        <p className="max-w-xl text-xs sm:text-sm md:text-base text-slate-100 font-medium leading-relaxed mb-6 px-6 py-2.5 rounded-2xl bg-black/45 backdrop-blur-md border border-white/10 [text-shadow:_0_1px_4px_rgba(0,0,0,0.9)] transition-all duration-700">
          {slides[currentSlide].subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={slides[currentSlide].primaryCta.href}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#d97706] hover:bg-[#b45309] text-white text-xs sm:text-sm font-medium shadow-lg shadow-amber-950/50 hover:scale-105 transition-all duration-200"
          >
            <span>{slides[currentSlide].primaryCta.text}</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>

          <a
            href={slides[currentSlide].secondaryCta.href}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium hover:scale-105 transition-all duration-200"
          >
            <span>{slides[currentSlide].secondaryCta.text}</span>
          </a>
        </div>
      </div>

      {/* Navigation Arrow Left */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200 group shadow-lg hover:scale-110"
      >
        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Navigation Arrow Right */}
      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200 group shadow-lg hover:scale-110"
      >
        <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-300 rounded-full ${index === currentSlide
              ? "w-7 h-2.5 bg-[#dfb260] shadow-[0_0_8px_#dfb260]"
              : "w-2.5 h-2.5 bg-white/40 hover:bg-white/80"
              }`}
          />
        ))}
      </div>
    </section>
  );
}

