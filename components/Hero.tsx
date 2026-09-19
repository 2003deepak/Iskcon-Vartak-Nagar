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

  // Auto-play timer (5 seconds)
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
      aria-label="Hero Carousel"
    >
      {/* Background Images Carousel with Smooth Crossfade & Ken Burns Zoom */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${
              isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className={`relative w-full h-full ${isActive ? "animate-ken-burns" : ""}`}>
              <Image
                alt={slide.alt}
                src={slide.image}
                fill
                className="object-cover object-center"
                priority={index === 0}
              />
            </div>
            {/* Subtle Gradient Overlays for optimal contrast and readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060d18] via-black/35 to-black/25 opacity-80" />
            <div className="absolute inset-0 bg-black/15" />
          </div>
        );
      })}

      {/* Dynamic Content Container with Staggered Slide-In Motion */}
      <div
        key={`slide-content-${currentSlide}`}
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center pt-12 sm:pt-16 md:pt-20"
      >
        {/* Eyebrow / Live Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 mb-4 sm:mb-5 shadow-lg animate-hero-fade-up [animation-delay:50ms]">
          <span className="w-2 h-2 rounded-full bg-[#dfb260] animate-pulse shadow-[0_0_8px_#dfb260]" />
          <span className="text-[9.5px] sm:text-xs tracking-[0.18em] sm:tracking-[0.2em] uppercase font-semibold text-[#e6ca85]">
            {slides[currentSlide].eyebrow}
          </span>
        </div>

        {/* Headline with high-contrast drop shadow */}
        <h1 className="font-serif text-[26px] xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.2] sm:leading-[1.15] text-[#fce8b8] max-w-3xl mb-4 sm:mb-5 px-2 [text-shadow:_0_3px_12px_rgba(0,0,0,0.95),_0_1px_4px_rgba(0,0,0,0.9)] animate-hero-fade-up [animation-delay:150ms]">
          {slides[currentSlide].title}
        </h1>

        {/* Subtitle with soft frosted glass pill */}
        <p className="max-w-2xl text-xs sm:text-sm md:text-base text-slate-100 font-normal leading-relaxed mb-6 sm:mb-8 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-black/45 backdrop-blur-md border border-white/10 [text-shadow:_0_1px_4px_rgba(0,0,0,0.9)] animate-hero-fade-up [animation-delay:250ms]">
          {slides[currentSlide].subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto animate-hero-fade-up [animation-delay:350ms]">
          <a
            href={slides[currentSlide].primaryCta.href}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#dfb260] hover:bg-[#cca04b] text-[#060e1b] text-xs sm:text-sm font-bold tracking-wider uppercase shadow-md shadow-black/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-950/40 active:translate-y-0 transition-all duration-200"
          >
            <span>{slides[currentSlide].primaryCta.text}</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>

          <a
            href={slides[currentSlide].secondaryCta.href}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-transparent hover:bg-[#dfb260]/10 border-[1.5px] border-[#dfb260] text-[#dfb260] hover:text-[#fce8b8] text-xs sm:text-sm font-semibold tracking-wider uppercase hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 backdrop-blur-xs"
          >
            <span>{slides[currentSlide].secondaryCta.text}</span>
          </a>
        </div>
      </div>

      {/* Navigation Arrow Left */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-300 group shadow-lg hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Navigation Arrow Right */}
      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-300 group shadow-lg hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Pagination Dots with Smooth Pill-Expansion Transition */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-500 ease-out rounded-full cursor-pointer motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              index === currentSlide
                ? "w-8 h-2.5 bg-[#dfb260] shadow-[0_0_10px_rgba(223,178,96,0.6)]"
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
