"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export interface MediaRecord {
  id: string;
  _id?: string;
  title: string;
  description: string;
  mediaType: "IMAGE" | "YOUTUBE" | "INSTAGRAM_REEL";
  category: "Darshan" | "Yatra" | "Festival" | "Kirtan" | "Community Seva" | string;
  imageUrl: string;
  images?: string[];
  externalUrl?: string | null;
  youtubeVideoId?: string | null;
  eventDate?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  displayOrder?: number;
  location?: string;
  deity?: string;
  yatraName?: string;
}

// Curated devotional fallback items to guarantee the archive is never blank on initial setup
const CURATED_MEDIA_ARCHIVE: MediaRecord[] = [
  {
    id: "curated-1",
    title: "Maha Sandhya Aarti & Ecstatic Kirtan",
    description: "Immerse in the devotional sound vibration, holy names, and joyful congregational singing at ISKCON Vartak Nagar.",
    category: "Kirtan",
    mediaType: "YOUTUBE",
    imageUrl: "https://img.youtube.com/vi/OGSaFXdssdQ/maxresdefault.jpg",
    externalUrl: "https://www.youtube.com/watch?v=OGSaFXdssdQ",
    youtubeVideoId: "OGSaFXdssdQ",
    eventDate: "2026-09-20",
    isFeatured: true,
    location: "Main Temple Hall, Thane",
    deity: "Sri Sri Gaura Nitai",
  },
  {
    id: "curated-2",
    title: "Sri Sri Gaura Nitai Morning Sringar Darshan",
    description: "Daily divine adornment with fresh fragrant lotus garlands, tulasi leaves, and handcrafted silken robes.",
    category: "Darshan",
    mediaType: "IMAGE",
    imageUrl: "/gaur_nitai.jpeg",
    eventDate: "2026-09-28",
    isFeatured: true,
    location: "Sanctum Sanctorum",
    deity: "Sri Sri Gaura Nitai",
  },
  {
    id: "curated-3",
    title: "Vrindavan Dham Parikrama & Holy Sangam",
    description: "Devotees absorbing the eternal pastimes of Sri Radha and Krishna through sacred Yamuna aarti and Govardhan Parikrama.",
    category: "Yatra",
    mediaType: "IMAGE",
    imageUrl: "https://ik.imagekit.io/9uy2us6yw/LandingPage/download?updatedAt=1752604090619",
    eventDate: "2026-06-15",
    isFeatured: true,
    location: "Sri Vrindavan Dham",
    yatraName: "Vrindavan Braj Parikrama",
  },
  {
    id: "curated-4",
    title: "Grand Janmashtami Midnight Abhishekham",
    description: "Celebration of the supreme appearance of Lord Sri Krishna with 108 auspicious kalash offerings, chants, and flowers.",
    category: "Festival",
    mediaType: "IMAGE",
    imageUrl: "https://ik.imagekit.io/9uy2us6yw/LandingPage/download?updatedAt=1752604090619",
    eventDate: "2026-08-25",
    isFeatured: true,
    location: "Temple Courtyard, Thane",
  },
  {
    id: "curated-5",
    title: "Food For Life: Annadanam Prasadam Seva",
    description: "Selfless distribution of sanctified vegetarian meals to underprivileged children and families across Thane city.",
    category: "Community Seva",
    mediaType: "IMAGE",
    imageUrl: "/books_distribution.jpg",
    eventDate: "2026-09-12",
    isFeatured: false,
    location: "Vartak Nagar & Slum Outreach",
  },
  {
    id: "curated-6",
    title: "Soulful Harinama Sankirtan on the Streets",
    description: "Bringing the transcendental peace of the Hare Krishna Maha-Mantra to thousands of commuters and residents.",
    category: "Kirtan",
    mediaType: "IMAGE",
    imageUrl: "/congregation.jpg",
    eventDate: "2026-09-05",
    isFeatured: false,
    location: "Thane West",
  },
  {
    id: "curated-7",
    title: "Sri Jagannath Snana Yatra & Flower Chariot",
    description: "Auspicious holy bathing festival of Lord Jagannath, Baladeva, and Subhadra Maharani accompanied by Vedic stotras.",
    category: "Festival",
    mediaType: "IMAGE",
    imageUrl: "/hero_bg.jpeg",
    eventDate: "2026-07-02",
    isFeatured: false,
    location: "ISKCON Thane",
    deity: "Lord Jagannath",
  },
  {
    id: "curated-8",
    title: "Sri Mayapur Chandrodaya Mandir Pilgrimage",
    description: "Spiritual retreat exploring the birthplace of Sri Chaitanya Mahaprabhu and Navadvipa island parikrama.",
    category: "Yatra",
    mediaType: "IMAGE",
    imageUrl: "https://ik.imagekit.io/9uy2us6yw/LandingPage/download?updatedAt=1752604090619",
    eventDate: "2026-03-10",
    isFeatured: false,
    location: "Sri Mayapur Dham, West Bengal",
    yatraName: "Navadvipa Mandala Parikrama",
  },
  {
    id: "curated-9",
    title: "Sri Sri Radha Vrindavanchandra Evening Aarti",
    description: "Deepa daan lamp offering accompanied by the melodious chanting of the Damodarashtakam prayers.",
    category: "Darshan",
    mediaType: "IMAGE",
    imageUrl: "/gaur_nitai.jpeg",
    eventDate: "2026-08-18",
    isFeatured: false,
    location: "Temple Altar",
    deity: "Sri Sri Radha Krishna",
  },
];

const CATEGORIES = [
  { id: "All", label: "All Memories", icon: "✨" },
  { id: "Darshan", label: "Daily Darshan", icon: "🪷" },
  { id: "Yatra", label: "Yatra Memories", icon: "🚩" },
  { id: "Festival", label: "Festivals", icon: "🎪" },
  { id: "Kirtan", label: "Kirtan & Videos", icon: "🎶" },
  { id: "Community Seva", label: "Community Seva", icon: "🤝" },
];

const YEARS = ["All Years", "2026", "2025", "2024"];

const PAGE_SIZE = 12;

export default function MediaArchivePage() {
  const [mediaList, setMediaList] = useState<MediaRecord[]>(CURATED_MEDIA_ARCHIVE);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All Years");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Lightbox State
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  // Fetch dynamic media records from backend API
  useEffect(() => {
    async function fetchArchive() {
      try {
        setLoading(true);
        const res = await fetch("/api/media?limit=200");
        if (res.ok) {
          const json = await res.json();
          const items = Array.isArray(json.items)
            ? json.items
            : Array.isArray(json.data)
              ? json.data
              : [];
          if (json.success && items.length > 0) {
            setMediaList(items);
          }
        }
      } catch (err) {
        console.error("Failed to load archive media:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchArchive();
  }, []);

  // Filter and search logic
  const filteredList = useMemo(() => {
    return mediaList.filter((item) => {
      // Category filter
      if (selectedCategory !== "All") {
        const itemCat = (item.category || "").toLowerCase();
        const selCat = selectedCategory.toLowerCase();
        if (!itemCat.includes(selCat) && !selCat.includes(itemCat)) {
          return false;
        }
      }

      // Year filter
      if (selectedYear !== "All Years") {
        const itemYear = item.eventDate ? item.eventDate.slice(0, 4) : "";
        if (itemYear !== selectedYear) {
          return false;
        }
      }

      // Media Type filter
      if (selectedType !== "ALL") {
        if (item.mediaType !== selectedType) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = (item.title || "").toLowerCase().includes(q);
        const matchDesc = (item.description || "").toLowerCase().includes(q);
        const matchCat = (item.category || "").toLowerCase().includes(q);
        const matchLoc = (item.location || "").toLowerCase().includes(q);
        const matchDeity = (item.deity || "").toLowerCase().includes(q);
        const matchYatra = (item.yatraName || "").toLowerCase().includes(q);

        if (!matchTitle && !matchDesc && !matchCat && !matchLoc && !matchDeity && !matchYatra) {
          return false;
        }
      }

      return true;
    });
  }, [mediaList, selectedCategory, selectedYear, selectedType, searchQuery]);

  // Featured memories spotlight
  const featuredMemories = useMemo(() => {
    const featured = mediaList.filter((m) => m.isFeatured);
    return featured.length > 0 ? featured.slice(0, 3) : mediaList.slice(0, 3);
  }, [mediaList]);

  // Paginated items
  const visibleItems = useMemo(() => {
    return filteredList.slice(0, visibleCount);
  }, [filteredList, visibleCount]);

  const hasMore = visibleCount < filteredList.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  // Lightbox navigation
  const currentLightboxItem = activeLightboxIndex !== null ? filteredList[activeLightboxIndex] : null;
  const currentPhotos = currentLightboxItem
    ? Array.isArray(currentLightboxItem.images) && currentLightboxItem.images.length > 0
      ? currentLightboxItem.images
      : [currentLightboxItem.imageUrl].filter(Boolean)
    : [];
  const activePhotoUrl = currentPhotos[activePhotoIndex] || currentLightboxItem?.imageUrl;

  const handleOpenLightbox = (indexInFiltered: number, photoIdx = 0) => {
    setActiveLightboxIndex(indexInFiltered);
    setActivePhotoIndex(photoIdx);
  };

  const handleCloseLightbox = () => {
    setActiveLightboxIndex(null);
    setActivePhotoIndex(0);
  };

  const handlePrevLightbox = useCallback(() => {
    if (activeLightboxIndex === null) return;
    if (currentPhotos.length > 1 && activePhotoIndex > 0) {
      setActivePhotoIndex((prev) => prev - 1);
    } else {
      const prevIdx = activeLightboxIndex > 0 ? activeLightboxIndex - 1 : filteredList.length - 1;
      setActiveLightboxIndex(prevIdx);
      setActivePhotoIndex(0);
    }
  }, [activeLightboxIndex, activePhotoIndex, currentPhotos.length, filteredList.length]);

  const handleNextLightbox = useCallback(() => {
    if (activeLightboxIndex === null) return;
    if (currentPhotos.length > 1 && activePhotoIndex < currentPhotos.length - 1) {
      setActivePhotoIndex((prev) => prev + 1);
    } else {
      const nextIdx = activeLightboxIndex < filteredList.length - 1 ? activeLightboxIndex + 1 : 0;
      setActiveLightboxIndex(nextIdx);
      setActivePhotoIndex(0);
    }
  }, [activeLightboxIndex, activePhotoIndex, currentPhotos.length, filteredList.length]);

  // Keyboard accessibility for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === "Escape") handleCloseLightbox();
      if (e.key === "ArrowLeft") handlePrevLightbox();
      if (e.key === "ArrowRight") handleNextLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLightboxIndex, handleNextLightbox, handlePrevLightbox]);

  // Helper date formatter
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Recent Moment";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Group Darshan items by Month/Year when in Darshan category
  const darshanGroups = useMemo(() => {
    if (selectedCategory !== "Darshan") return null;
    const groups: { [key: string]: MediaRecord[] } = {};
    filteredList.forEach((item) => {
      let groupKey = "Recent Darshans";
      if (item.eventDate) {
        try {
          const d = new Date(item.eventDate);
          if (!isNaN(d.getTime())) {
            groupKey = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
          }
        } catch {
          groupKey = "Recent Darshans";
        }
      }
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(item);
    });
    return groups;
  }, [selectedCategory, filteredList]);

  return (
    <>
      <Header />

      <main className="w-full bg-[#faf7f2] min-h-screen text-slate-800 selection:bg-amber-200 selection:text-amber-950">
        {/* Subtle Ambient Background Warmth */}
        <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="fixed bottom-10 left-0 w-[450px] h-[450px] bg-amber-600/5 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* HERO SECTION */}
        <section className="relative pt-12 pb-10 sm:pt-16 sm:pb-14 border-b border-stone-200/70 bg-gradient-to-b from-[#f5ede0]/60 via-[#faf7f2] to-[#faf7f2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-900 text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase mb-4 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
              <span>Devotional Media Archive</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-slate-900 tracking-tight leading-[1.15] mb-4">
              Memories of Devotion
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 font-light max-w-2xl mx-auto leading-relaxed mb-6">
              Explore daily Darshan, sacred Yatra memories, joyful festivals, soulful Kirtans, and moments of community Seva from ISKCON Thane.
            </p>

            {/* Decorative Gold Divider */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#dfb260]" />
              <div className="w-2 h-2 rotate-45 border border-[#dfb260] bg-amber-100" />
              <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#dfb260]" />
            </div>
          </div>
        </section>

        {/* CONTROLS & FILTER TOOLBAR */}
        <section className="sticky top-20 z-30 bg-[#faf7f2]/95 backdrop-blur-md border-b border-stone-200/80 py-4 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
            {/* Top Row: Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setVisibleCount(PAGE_SIZE);
                    }}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shadow-xs ${isActive
                        ? "bg-[#102643] text-white shadow-md shadow-slate-900/10 scale-[1.02]"
                        : "bg-white/90 hover:bg-amber-50 text-slate-700 hover:text-amber-950 border border-stone-200 hover:border-amber-400/60"
                      }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Row: Search Box + Year Filter + Type Pills */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  placeholder="Search memories by deity, festival, yatra..."
                  className="w-full bg-white border border-stone-300/90 rounded-full pl-10 pr-9 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 shadow-inner"
                />
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs">🔍</span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    title="Clear Search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Secondary Filters (Year & Format) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
                {/* Year Select Pills */}
                <div className="flex items-center gap-1 bg-stone-200/50 p-1 rounded-full border border-stone-300/60 text-xs">
                  {YEARS.map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setSelectedYear(yr)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer ${selectedYear === yr
                          ? "bg-[#102643] text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>

                {/* Media Type Filter */}
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-white border border-stone-300 rounded-full px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-amber-600 shadow-xs cursor-pointer"
                >
                  <option value="ALL">All Media Types</option>
                  <option value="IMAGE">🖼️ Photos Only</option>
                  <option value="YOUTUBE">▶️ YouTube Videos</option>
                  <option value="INSTAGRAM_REEL">📱 Instagram Reels</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT CONTAINER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
          {/* 1. FEATURED SPOTLIGHT (Rendered when no search query and 'All' category is active) */}
          {selectedCategory === "All" && !searchQuery && selectedYear === "All Years" && (
            <section className="space-y-6">
              <div className="flex items-end justify-between border-b border-stone-200/70 pb-3">
                <div>
                  <span className="text-[11px] font-bold tracking-widest text-amber-800 uppercase">Highlights</span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-slate-900 mt-0.5">
                    Featured Memories
                  </h2>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Sacred moments from our spiritual journey together.
                </p>
              </div>

              {/* Editorial Featured Grid (1 Large Hero + 2 Stacked) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {featuredMemories[0] && (
                  <div
                    onClick={() => {
                      const idx = filteredList.findIndex((m) => m.id === featuredMemories[0].id);
                      if (idx !== -1) handleOpenLightbox(idx);
                    }}
                    className="lg:col-span-8 group relative min-h-[360px] sm:min-h-[440px] rounded-3xl overflow-hidden bg-slate-950 border border-stone-200 hover:border-amber-400/70 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-end"
                  >
                    <Image
                      src={featuredMemories[0].imageUrl}
                      alt={featuredMemories[0].title}
                      fill
                      unoptimized
                      priority
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060d18] via-[#060d18]/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                    {/* Featured Star Badge */}
                    <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-md">
                        ★ Featured Spotlight
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
                          {featuredMemories[0].category}
                        </span>
                        {Array.isArray(featuredMemories[0].images) && featuredMemories[0].images.length > 1 && (
                          <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-bold shadow-md">
                            📷 {featuredMemories[0].images.length} Photos
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content Block */}
                    <div className="relative z-10 p-6 sm:p-8 text-white space-y-2">
                      <div className="text-xs font-mono text-amber-300">
                        📅 {formatDate(featuredMemories[0].eventDate)} {featuredMemories[0].location && `• 📍 ${featuredMemories[0].location}`}
                      </div>
                      <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white group-hover:text-[#fde68a] transition-colors leading-snug">
                        {featuredMemories[0].title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 font-light line-clamp-2 max-w-2xl leading-relaxed">
                        {featuredMemories[0].description}
                      </p>
                      <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300 group-hover:text-amber-200">
                        <span>{featuredMemories[0].mediaType === "YOUTUBE" ? "Watch Kirtan Video →" : "View Full Memory →"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Secondary Featured Stack */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  {featuredMemories.slice(1, 3).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        const idx = filteredList.findIndex((m) => m.id === item.id);
                        if (idx !== -1) handleOpenLightbox(idx);
                      }}
                      className="group relative flex-1 min-h-[200px] rounded-3xl overflow-hidden bg-slate-950 border border-stone-200 hover:border-amber-400/60 shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col justify-end p-5 text-white"
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060d18] via-[#060d18]/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>

                      <div className="relative z-10 space-y-1">
                        <span className="text-[11px] font-mono text-amber-300">
                          {formatDate(item.eventDate)}
                        </span>
                        <h4 className="font-serif text-lg font-normal text-white group-hover:text-[#fde68a] transition-colors line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-300 font-light line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 2. CHRONOLOGICAL DARSHAN ARCHIVE (When Darshan category is active) */}
          {selectedCategory === "Darshan" && darshanGroups && Object.keys(darshanGroups).length > 0 && (
            <section className="space-y-10">
              <div className="border-b border-stone-200/70 pb-3">
                <span className="text-[11px] font-bold tracking-widest text-amber-800 uppercase">Altar Darshan</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-slate-900 mt-0.5">
                  Chronological Daily Darshan
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Daily divine deity darshan, seasonal sringar, and altar adornment of Sri Sri Gaura Nitai and Sri Sri Radha Krishna.
                </p>
              </div>

              {Object.entries(darshanGroups).map(([monthLabel, groupItems]) => (
                <div key={monthLabel} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-xl text-slate-900 font-normal">{monthLabel}</h3>
                    <div className="h-[1px] flex-1 bg-stone-300/80" />
                    <span className="text-xs font-mono text-slate-500">{groupItems.length} Darshans</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {groupItems.map((item) => {
                      const idx = filteredList.findIndex((m) => m.id === item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleOpenLightbox(idx)}
                          className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200/90 hover:border-amber-500/80 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
                        >
                          <div className="relative aspect-[4/5] w-full bg-slate-950 overflow-hidden">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              unoptimized
                              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#dfb260] text-slate-950 shadow-sm">
                                {item.deity || "Altar Darshan"}
                              </span>
                              {Array.isArray(item.images) && item.images.length > 1 && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-black/70 backdrop-blur-xs border border-white/30 text-white shadow-sm">
                                  📷 {item.images.length} Photos
                                </span>
                              )}
                            </div>

                            <div className="absolute bottom-2.5 left-3 right-3 text-white">
                              <div className="text-[11px] font-mono text-amber-300 font-medium">
                                📅 {formatDate(item.eventDate)}
                              </div>
                            </div>
                          </div>

                          <div className="p-3.5 space-y-1">
                            <h4 className="font-serif text-base font-normal text-slate-900 group-hover:text-amber-800 transition line-clamp-1">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 line-clamp-1 font-light">
                              {item.description || "Darshan of the Supreme Lord"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* 3. DEDICATED YATRA JOURNEYS (When Yatra category is active) */}
          {selectedCategory === "Yatra" && (
            <section className="space-y-8">
              <div className="border-b border-stone-200/70 pb-3">
                <span className="text-[11px] font-bold tracking-widest text-amber-800 uppercase">Sacred Pilgrimages</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-slate-900 mt-0.5">
                  Yatra Journey Stories
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Immerse in the memories of pilgrimage yatras to Vrindavan, Mayapur, Jagannath Puri, and Haridwar with ISKCON Thane devotees.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredList.map((item) => {
                  const idx = filteredList.findIndex((m) => m.id === item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleOpenLightbox(idx)}
                      className="group relative bg-white rounded-3xl overflow-hidden border border-stone-200 hover:border-amber-500/70 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col"
                    >
                      <div className="relative h-60 w-full bg-slate-950 overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-amber-500 text-slate-950 shadow-md">
                            🚩 {item.yatraName || "Pilgrimage Yatra"}
                          </span>
                          {Array.isArray(item.images) && item.images.length > 1 && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-black/70 backdrop-blur-xs border border-white/30 text-white shadow-sm">
                              📷 {item.images.length} Photos
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <span className="text-xs font-mono text-amber-300">
                            📍 {item.location || "Sacred Dham"} • {formatDate(item.eventDate)}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <h3 className="font-serif text-xl font-normal text-slate-900 group-hover:text-amber-800 transition leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-600 font-light line-clamp-3 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-amber-800 group-hover:text-amber-900">
                          <span>Explore Journey Memories →</span>
                          <span className="text-stone-400">✨ Memory</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 4. MAIN ARCHIVE GRID (For all other views or when not in Darshan/Yatra specific view) */}
          {selectedCategory !== "Darshan" && selectedCategory !== "Yatra" && (
            <section className="space-y-6">
              <div className="flex items-end justify-between border-b border-stone-200/70 pb-3">
                <div>
                  <span className="text-[11px] font-bold tracking-widest text-amber-800 uppercase">
                    {selectedCategory === "All" ? "Archive Collection" : `${selectedCategory} Archive`}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-slate-900 mt-0.5">
                    {selectedCategory === "All" ? "All Memories" : `${selectedCategory} Memories`}
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  Showing {visibleItems.length} of {filteredList.length} items
                </span>
              </div>

              {/* SKELETON LOADER */}
              {loading && filteredList.length === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <div key={n} className="bg-stone-200/70 rounded-2xl h-72 flex flex-col justify-end p-4 space-y-2">
                      <div className="h-4 bg-stone-300 rounded w-3/4" />
                      <div className="h-3 bg-stone-300 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              )}

              {/* EMPTY STATE */}
              {!loading && filteredList.length === 0 && (
                <div className="bg-white rounded-3xl border border-stone-200 p-16 text-center shadow-xs max-w-lg mx-auto">
                  <div className="text-5xl mb-3">🪷</div>
                  <h3 className="font-serif text-xl font-normal text-slate-900">No Memories Found</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
                    No devotional memories match your selected filter or search query. New moments of devotion will appear here soon.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSelectedYear("All Years");
                      setSelectedType("ALL");
                      setSearchQuery("");
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#102643] text-white text-xs font-semibold hover:bg-slate-800 transition cursor-pointer shadow-sm"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

              {/* MASONRY / EDITORIAL GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {visibleItems.map((item, index) => {
                  const isVideo = item.mediaType === "YOUTUBE" || item.mediaType === "INSTAGRAM_REEL";
                  return (
                    <div
                      key={item.id || index}
                      onClick={() => handleOpenLightbox(index)}
                      className="group relative bg-white rounded-3xl overflow-hidden border border-stone-200/90 hover:border-amber-400/80 shadow-xs hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col justify-between"
                    >
                      {/* Media Image Canvas */}
                      <div className="relative aspect-[4/3] w-full bg-slate-950 overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          unoptimized
                          loading="lazy"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#060d18] via-[#060d18]/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />

                        {/* Video Play Overlay if video */}
                        {isVideo && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/60 text-[#dfb260] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#d97706] group-hover:text-white transition">
                              <span className="text-lg">▶</span>
                            </div>
                          </div>
                        )}

                        {/* Top Category Badge */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                              {item.category}
                            </span>
                            {Array.isArray(item.images) && item.images.length > 1 && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold shadow-sm">
                                📷 {item.images.length}
                              </span>
                            )}
                          </div>
                          {item.mediaType === "YOUTUBE" ? (
                            <span className="px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-bold">
                              YouTube
                            </span>
                          ) : item.mediaType === "INSTAGRAM_REEL" ? (
                            <span className="px-2 py-0.5 rounded-full bg-purple-600/90 text-white text-[10px] font-bold">
                              Reel
                            </span>
                          ) : null}
                        </div>

                        {/* Bottom Date Overlay */}
                        <div className="absolute bottom-2.5 left-3 text-[11px] font-mono text-amber-300">
                          📅 {formatDate(item.eventDate)}
                        </div>
                      </div>

                      {/* Content Card Body */}
                      <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-serif text-base font-normal text-slate-900 group-hover:text-amber-800 transition line-clamp-2 leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-500 font-light line-clamp-2 mt-1 leading-relaxed">
                            {item.description || "Moments from ISKCON Thane"}
                          </p>
                        </div>

                        <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-amber-800">
                          <span>{isVideo ? "Watch Video →" : "View Memory →"}</span>
                          {item.location && <span className="text-slate-400 font-normal truncate max-w-[110px]">📍 {item.location}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* LOAD MORE BUTTON */}
              {hasMore && (
                <div className="text-center pt-8">
                  <button
                    onClick={handleLoadMore}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-transparent hover:bg-amber-100/60 border-[1.5px] border-[#dfb260] text-amber-950 text-xs font-semibold uppercase tracking-wider hover:-translate-y-0.5 active:translate-y-0 shadow-xs transition-all duration-200 cursor-pointer"
                  >
                    <span>Load More Memories ({filteredList.length - visibleCount} remaining)</span>
                    <span className="text-sm">↓</span>
                  </button>
                </div>
              )}
            </section>
          )}
        </div>

        {/* FULLSCREEN LIGHTBOX & MEDIA MODAL */}
        {currentLightboxItem && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn"
            onClick={handleCloseLightbox}
          >
            <div
              className="relative w-full max-w-5xl rounded-3xl overflow-hidden bg-[#060d18] border border-amber-500/30 shadow-2xl flex flex-col max-h-[92vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Header Bar */}
              <div className="p-4 sm:p-5 flex items-center justify-between border-b border-stone-800/80 bg-slate-950/80 shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold uppercase">
                    {currentLightboxItem.category}
                  </span>
                  {currentPhotos.length > 1 ? (
                    <span className="text-xs text-amber-300 font-mono bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      Photo {activePhotoIndex + 1} of {currentPhotos.length}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                      {activeLightboxIndex! + 1} of {filteredList.length}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* External YouTube / Insta link */}
                  {currentLightboxItem.externalUrl && (
                    <a
                      href={currentLightboxItem.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
                    >
                      Open Link ↗
                    </a>
                  )}
                  {/* Close button */}
                  <button
                    onClick={handleCloseLightbox}
                    className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center text-sm font-bold transition cursor-pointer"
                    title="Close (Esc)"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Main Content (Image or Video) */}
              <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] sm:min-h-[480px] overflow-hidden">
                {currentLightboxItem.mediaType === "YOUTUBE" && currentLightboxItem.youtubeVideoId ? (
                  <iframe
                    className="w-full h-full aspect-video min-h-[320px] sm:min-h-[480px]"
                    src={`https://www.youtube.com/embed/${currentLightboxItem.youtubeVideoId}?autoplay=1&rel=0`}
                    title={currentLightboxItem.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="relative w-full h-full min-h-[300px] sm:min-h-[480px] flex items-center justify-center">
                    <Image
                      src={activePhotoUrl || currentLightboxItem.imageUrl}
                      alt={currentLightboxItem.title}
                      fill
                      unoptimized
                      className="object-contain p-2 transition-opacity duration-300"
                    />
                  </div>
                )}

                {/* Left / Right Nav Overlay Slider Buttons */}
                {(currentPhotos.length > 1 || filteredList.length > 1) && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevLightbox();
                      }}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-black/90 hover:scale-105 text-white border border-white/25 flex items-center justify-center text-2xl transition-all cursor-pointer shadow-2xl z-20"
                      title={currentPhotos.length > 1 ? "Previous Photo (←)" : "Previous Memory (←)"}
                    >
                      ‹
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextLightbox();
                      }}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-black/90 hover:scale-105 text-white border border-white/25 flex items-center justify-center text-2xl transition-all cursor-pointer shadow-2xl z-20"
                      title={currentPhotos.length > 1 ? "Next Photo (→)" : "Next Memory (→)"}
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Multi-Photo Thumbnail Bar for Set (Up to 10 photos) */}
              {currentPhotos.length > 1 && (
                <div className="px-4 py-2.5 bg-[#0a1322] border-t border-stone-800 flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                    {currentPhotos.map((pUrl, pIdx) => {
                      const isSelected = pIdx === activePhotoIndex;
                      return (
                        <button
                          key={pUrl + pIdx}
                          type="button"
                          onClick={() => setActivePhotoIndex(pIdx)}
                          className={`relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition cursor-pointer ${isSelected ? "border-amber-400 scale-105 shadow-md shadow-amber-400/20" : "border-stone-700 opacity-60 hover:opacity-100"
                            }`}
                        >
                          <Image src={pUrl} alt={`Photo ${pIdx + 1}`} fill unoptimized className="object-cover" />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-[11px] font-mono text-amber-300 whitespace-nowrap hidden sm:inline">
                    Photo {activePhotoIndex + 1} of {currentPhotos.length}
                  </span>
                </div>
              )}

              {/* Modal Footer Description */}
              <div className="p-5 sm:p-6 bg-slate-950 border-t border-stone-800 text-white space-y-1.5 shrink-0">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-amber-300 font-mono">
                  <span>📅 {formatDate(currentLightboxItem.eventDate)}</span>
                  <span>📍 {currentLightboxItem.location || "ISKCON Vartak Nagar, Thane"}</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-white font-normal leading-snug">
                  {currentLightboxItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  {currentLightboxItem.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
