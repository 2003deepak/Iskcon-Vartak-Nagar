"use client";

import { useState } from "react";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

interface MediaItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Darshan" | "Festivals" | "Kirtan & Video" | "Community Seva";
  type: "video" | "image";
  src: string;
  videoEmbedUrl?: string;
  duration?: string;
  tag: string;
  aspectSpan: string; // for bento layout classes
}

const mediaItems: MediaItem[] = [
  {
    id: "video-1",
    title: "Maha Sandhya Aarti & Ecstatic Kirtan",
    subtitle: "Immerse in the devotional sound vibration and joyful congregational singing at ISKCON Vartak Nagar.",
    category: "Kirtan & Video",
    type: "video",
    src: "https://img.youtube.com/vi/OGSaFXdssdQ/maxresdefault.jpg",
    videoEmbedUrl: "https://www.youtube.com/embed/OGSaFXdssdQ?autoplay=1&rel=0",
    duration: "Video Highlight",
    tag: "Temple Kirtan",
    aspectSpan: "lg:col-span-8 lg:row-span-2",
  },
  {
    id: "img-1",
    title: "Sri Sri Gaura Nitai Sringar Darshan",
    subtitle: "Daily divine adornment with fresh fragrant flower garlands and silken robes.",
    category: "Darshan",
    type: "image",
    src: "/gaur_nitai.jpeg",
    tag: "Altar Darshan",
    aspectSpan: "lg:col-span-4 lg:row-span-2",
  },
  {
    id: "img-2",
    title: "Grand Janmashtami Celebrations",
    subtitle: "Midnight abhishekham, pageantry, and joyous chanting celebrating the appearance of Lord Krishna.",
    category: "Festivals",
    type: "image",
    src: "https://ik.imagekit.io/9uy2us6yw/LandingPage/download?updatedAt=1752604090619",
    tag: "Sacred Festival",
    aspectSpan: "lg:col-span-4",
  },
  {
    id: "img-3",
    title: "Soulful Congregational Sankirtan",
    subtitle: "Devotees uniting heart and voice in the chanting of the Hare Krishna Maha-Mantra.",
    category: "Kirtan & Video",
    type: "image",
    src: "/congregation.jpg",
    tag: "Harinama",
    aspectSpan: "lg:col-span-4",
  },
  {
    id: "img-4",
    title: "Vedic Literature & Gita Outreach",
    subtitle: "Sharing timeless wisdom and spiritual knowledge with seekers across Thane.",
    category: "Community Seva",
    type: "image",
    src: "/books_distribution.jpg",
    tag: "Seva Outreach",
    aspectSpan: "lg:col-span-4",
  },
];

const categories = ["All", "Darshan", "Festivals", "Kirtan & Video", "Community Seva"] as const;

export default function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);

  const filteredItems = selectedCategory === "All"
    ? mediaItems
    : mediaItems.filter((item) => item.category === selectedCategory);

  return (
    <section className="w-full py-20 lg:py-28 bg-[#faf7f2] border-b border-stone-200/60 text-slate-800 relative overflow-hidden" id="gallery">
      {/* Subtle background ambient warmth */}
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Header Strip */}
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/80 text-amber-900 text-xs font-semibold tracking-[0.25em] uppercase mb-3.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                <span>Devotional Gallery</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900 tracking-tight">
                Divine Moments Captured
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-light mt-3 max-w-2xl leading-relaxed">
                Glimpses of sacred darshan, blissful kirtans, grand Vedic festivals, and selfless community seva in Thane.
              </p>
            </div>

            <a
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-transparent hover:bg-[#dfb260]/10 border-[1.5px] border-[#dfb260] text-amber-900 hover:text-amber-950 text-xs font-semibold uppercase tracking-wider hover:-translate-y-0.5 active:translate-y-0 shadow-xs transition-all duration-200 cursor-pointer self-start md:self-end"
              href="https://www.instagram.com/iskconvartaknagarthane/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>View Full Media Archive</span>
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </a>
          </div>
        </ScrollReveal>

        {/* Category Filter Pills */}
        <ScrollReveal variant="fade-up" delay={80}>
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#0a1628] text-white shadow-md shadow-slate-950/20"
                    : "bg-white text-slate-600 hover:text-slate-900 border border-stone-200/90 hover:border-stone-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Editorial Bento Grid for Desktop / Swipeable Grid for Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
          {filteredItems.map((item, idx) => (
            <ScrollReveal
              key={item.id}
              variant="fade-up"
              delay={idx * 70}
              className={`${
                selectedCategory === "All" ? item.aspectSpan : "lg:col-span-6"
              } h-full min-h-[300px] lg:min-h-[360px]`}
            >
              <div
                onClick={() => setActiveMedia(item)}
                className="group relative h-full w-full rounded-3xl overflow-hidden bg-slate-900 border border-stone-200/80 hover:border-amber-400/50 shadow-md hover:shadow-2xl hover:shadow-amber-950/20 transition-all duration-500 cursor-pointer flex flex-col justify-end"
              >
                {/* Image Media Container with smooth zoom */}
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 66vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Subtle Editorial Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060d18] via-[#060d18]/40 to-black/10 opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Video Play Button Overlay for Videos */}
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-20 h-20 rounded-full bg-amber-500/20 animate-ping opacity-75" />
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/60 text-[#dfb260] flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-[#d97706] group-hover:text-white group-hover:border-white">
                        <svg className="w-7 h-7 translate-x-0.5 fill-current" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top Badge: Category / Duration */}
                <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold uppercase tracking-wider shadow-sm">
                    {item.type === "video" && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                    <span>{item.tag}</span>
                  </span>

                  {item.duration && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-amber-200 text-[11px] font-medium tracking-wide">
                      {item.duration}
                    </span>
                  )}
                </div>

                {/* Bottom Content Pill */}
                <div className="relative z-10 p-6 sm:p-7 text-white space-y-2">
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-white group-hover:text-[#fde68a] transition-colors leading-snug tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200/85 font-light line-clamp-2 leading-relaxed">
                    {item.subtitle}
                  </p>

                  <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300 opacity-90 group-hover:opacity-100 group-hover:text-amber-200 transition-all">
                    <span>{item.type === "video" ? "Watch Video" : "View Moment"}</span>
                    <span className="material-symbols-outlined text-sm transform group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Interactive Lightbox / Video Modal */}
      {activeMedia && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveMedia(null)}
        >
          <div
            className="relative w-full max-w-4xl rounded-3xl overflow-hidden bg-[#060d18] border border-amber-500/30 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
                  {activeMedia.tag}
                </span>
                <span className="text-slate-500">•</span>
                <span className="font-serif text-base sm:text-lg text-white font-normal truncate max-w-xs sm:max-w-md">
                  {activeMedia.title}
                </span>
              </div>

              <button
                onClick={() => setActiveMedia(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Modal Media Body */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
              {activeMedia.type === "video" && activeMedia.videoEmbedUrl ? (
                <iframe
                  className="w-full h-full"
                  src={activeMedia.videoEmbedUrl}
                  title={activeMedia.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <Image
                  src={activeMedia.src}
                  alt={activeMedia.title}
                  fill
                  className="object-contain"
                  priority
                />
              )}
            </div>

            {/* Modal Footer Description */}
            <div className="p-5 sm:p-6 bg-[#091322] border-t border-white/10">
              <h4 className="font-serif text-xl text-white font-normal mb-1">
                {activeMedia.title}
              </h4>
              <p className="text-sm text-slate-300 font-light leading-relaxed">
                {activeMedia.subtitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

