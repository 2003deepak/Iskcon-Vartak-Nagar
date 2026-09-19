"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
}

interface ProgramEvent {
  _id: string;
  title: string;
  subtitle?: string;
  category: "Grand Festival" | "Weekly Program" | "Youth & Kids" | "Kirtan & Seva" | "Spiritual Seminar";
  date: string;
  time: string;
  location: string;
  bannerUrl: string;
  description: string;
  highlights?: string[];
  schedule?: ScheduleItem[];
  isFeatured?: boolean;
  contactNumber?: string;
  rsvpLink?: string;
  status?: string;
}

const CATEGORIES = [
  "All Events",
  "Grand Festival",
  "Weekly Program",
  "Youth & Kids",
  "Kirtan & Seva",
];

export default function EventsPage() {
  const [events, setEvents] = useState<ProgramEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Events");
  const [activeModalEvent, setActiveModalEvent] = useState<ProgramEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const res = await fetch("/api/events");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setEvents(json.data);
        }
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Filter events
  const filteredEvents = events.filter((ev) => {
    const matchesCategory =
      selectedCategory === "All Events" ||
      ev.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ev.subtitle && ev.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredEvent = events.find((e) => e.isFeatured) || events[0];

  return (
    <>
      <Header />

      <main className="w-full bg-[#faf7f2] text-slate-800 min-h-screen">
        {/* Hero Section */}
        <section className="relative w-full py-16 sm:py-24 lg:py-28 bg-[#0a1628] text-white overflow-hidden border-b border-white/5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-xs font-semibold tracking-[0.25em] text-amber-300 uppercase mb-4 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Spiritual Gatherings &amp; Festivals</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#f3e7c4] tracking-tight">
              Upcoming Events &amp; Festivals
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-300 font-light mt-4 leading-relaxed">
              Immerse yourself in celestial celebrations, uplifting kirtans, enlightening Vedic wisdom discourses, and community feasts at ISKCON Vartak Nagar.
            </p>

            {/* Category Filter Pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105 font-semibold"
                        : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Grand Event Banner Section */}
        {featuredEvent && selectedCategory === "All Events" && !searchQuery && (
          <section className="w-full py-12 lg:py-16 px-6 sm:px-8 max-w-7xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c1b33] via-[#091527] to-[#060e1b] border border-amber-500/30 shadow-2xl text-white">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                {/* Banner Image / Poster Container */}
                <div className="lg:col-span-6 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-full min-h-[320px] overflow-hidden group">
                  <Image
                    src={featuredEvent.bannerUrl}
                    alt={featuredEvent.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060e1b] via-transparent to-black/30 lg:bg-gradient-to-r lg:from-transparent lg:to-[#0c1b33]" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-[11px] tracking-wider uppercase shadow-lg">
                      <span className="material-symbols-outlined text-xs">star</span>
                      Featured Festival
                    </span>
                  </div>
                </div>

                {/* Banner Content */}
                <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 space-y-4 sm:space-y-5">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-amber-400 uppercase">
                    <span className="w-2 h-0.5 bg-amber-400"></span>
                    <span>{featuredEvent.category}</span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#fce8b8] leading-tight">
                    {featuredEvent.title}
                  </h2>

                  {featuredEvent.subtitle && (
                    <p className="text-xs sm:text-sm text-amber-200/80 font-medium">
                      {featuredEvent.subtitle}
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2 text-xs sm:text-sm text-slate-200 border-y border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-400 text-lg">
                        calendar_month
                      </span>
                      <span>{featuredEvent.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-400 text-lg">
                        schedule
                      </span>
                      <span>{featuredEvent.time}</span>
                    </div>
                    <div className="sm:col-span-2 flex items-start gap-2">
                      <span className="material-symbols-outlined text-amber-400 text-lg shrink-0 mt-0.5">
                        location_on
                      </span>
                      <span className="text-slate-300">{featuredEvent.location}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed line-clamp-3">
                    {featuredEvent.description}
                  </p>

                  {featuredEvent.highlights && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {featuredEvent.highlights.slice(0, 4).map((hl, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-200">
                          <span className="material-symbols-outlined text-amber-400 text-sm">
                            check_circle
                          </span>
                          <span className="truncate">{hl}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setActiveModalEvent(featuredEvent)}
                      className="px-6 py-3 rounded-full bg-[#dfb260] hover:bg-[#cca04b] text-slate-950 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md hover:-translate-y-0.5 transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <span>View Full Schedule &amp; Poster</span>
                      <span className="material-symbols-outlined text-base">visibility</span>
                    </button>
                    <Link
                      href="/support-us#donate"
                      className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold uppercase tracking-wider hover:-translate-y-0.5 transition-all inline-flex items-center gap-1.5"
                    >
                      <span>Offer Seva</span>
                      <span className="material-symbols-outlined text-base">volunteer_activism</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Main Events Grid */}
        <section className="w-full py-10 lg:py-16 px-6 sm:px-8 max-w-7xl mx-auto">
          {/* Section Header & Search */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-amber-800 uppercase mb-1">
                <span className="w-2 h-0.5 bg-amber-700"></span>
                <span>Program Roster</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-slate-900">
                {selectedCategory === "All Events" ? "All Upcoming Programs" : selectedCategory}
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-stone-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-amber-500 shadow-xs"
              />
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-lg pointer-events-none">
                search
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm animate-pulse space-y-4"
                >
                  <div className="h-48 bg-stone-200 rounded-2xl w-full" />
                  <div className="h-4 bg-stone-200 rounded w-1/3" />
                  <div className="h-6 bg-stone-200 rounded w-3/4" />
                  <div className="h-16 bg-stone-200 rounded w-full" />
                </div>
              ))}
            </div>
          )}

          {/* No Events Found */}
          {!loading && filteredEvents.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 shadow-sm p-8 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-700 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">event_busy</span>
              </div>
              <h3 className="font-serif text-xl text-slate-900 mb-2">No Events Found</h3>
              <p className="text-xs sm:text-sm text-slate-600 font-light mb-4">
                No events currently match your selected criteria. Try selecting another category or clear your search.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All Events");
                  setSearchQuery("");
                }}
                className="px-6 py-2.5 rounded-full bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Events Cards Grid */}
          {!loading && filteredEvents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {filteredEvents.map((event) => (
                <article
                  key={event._id}
                  className="group bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Event Banner Image Container */}
                    <div
                      onClick={() => setActiveModalEvent(event)}
                      className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 cursor-pointer"
                    >
                      <Image
                        src={event.bannerUrl}
                        alt={event.title}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                      {/* Category Badge */}
                      <div className="absolute top-3.5 left-3.5">
                        <span className="px-3 py-1 rounded-full bg-[#102643]/90 backdrop-blur-xs text-amber-300 text-[10px] font-semibold tracking-wider uppercase border border-amber-400/25 shadow-sm">
                          {event.category}
                        </span>
                      </div>

                      {/* Click to Zoom Banner Indicator */}
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/70 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20">
                        <span className="material-symbols-outlined text-xs">zoom_in</span>
                        <span>View Poster</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-3">
                      {/* Date & Time Row */}
                      <div className="flex items-center gap-3 text-xs text-amber-800 font-medium">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-base text-amber-600">
                            calendar_today
                          </span>
                          <span>{event.date}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-base text-amber-600">
                            schedule
                          </span>
                          <span>{event.time}</span>
                        </div>
                      </div>

                      <h3
                        onClick={() => setActiveModalEvent(event)}
                        className="font-serif text-xl sm:text-2xl font-normal text-slate-900 group-hover:text-amber-900 transition-colors leading-snug cursor-pointer line-clamp-2"
                      >
                        {event.title}
                      </h3>

                      {event.subtitle && (
                        <p className="text-xs text-amber-700 font-medium line-clamp-1">
                          {event.subtitle}
                        </p>
                      )}

                      <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed line-clamp-3">
                        {event.description}
                      </p>

                      {/* Highlights Pill */}
                      {event.highlights && event.highlights.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1.5">
                          {event.highlights.slice(0, 2).map((hl, i) => (
                            <span
                              key={i}
                              className="text-[11px] bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200/60 font-light"
                            >
                              ✓ {hl}
                            </span>
                          ))}
                          {event.highlights.length > 2 && (
                            <span className="text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-light">
                              +{event.highlights.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-6 pt-0 flex items-center justify-between gap-2 border-t border-stone-100 mt-4">
                    <button
                      onClick={() => setActiveModalEvent(event)}
                      className="text-xs font-semibold text-amber-800 hover:text-amber-950 uppercase tracking-wider inline-flex items-center gap-1 cursor-pointer transition-colors py-2"
                    >
                      <span>Full Schedule</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                    <Link
                      href="/support-us#donate"
                      className="text-xs font-medium text-slate-600 hover:text-amber-800 inline-flex items-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm text-amber-600">
                        volunteer_activism
                      </span>
                      <span>Sponsor</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Sponsor / Host Program Callout Banner */}
        <section className="w-full py-14 px-6 sm:px-8 max-w-7xl mx-auto mb-16">
          <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-gradient-to-r from-[#0a1628] via-[#0f233d] to-[#0a1628] text-white shadow-xl border border-amber-500/25 relative overflow-hidden text-center sm:text-left">
            <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[400px] h-[200px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-xs font-semibold tracking-wider text-amber-300 uppercase">
                  <span>Devotional Seva</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#f3e7c4]">
                  Sponsor a Festival Feast or Daily Aarti
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-2xl">
                  Celebrate birthdays, anniversaries, or honor departed loved ones by sponsoring festival prasadam, flower decorations, or altar offerings at ISKCON Vartak Nagar.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center lg:items-end">
                <Link
                  href="/support-us#donate"
                  className="px-8 py-3.5 rounded-full bg-[#dfb260] hover:bg-[#cca04b] text-slate-950 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md hover:-translate-y-0.5 transition-all text-center"
                >
                  Offer Festival Seva
                </Link>
                <a
                  href="tel:+919322881265"
                  className="px-8 py-3.5 rounded-full bg-transparent hover:bg-white/10 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all text-center inline-flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">call</span>
                  <span>+91 93228 81265</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Event Details & Poster Modal Lightbox */}
        {activeModalEvent && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-fadeIn"
            onClick={() => setActiveModalEvent(null)}
          >
            <div
              className="relative w-full max-w-4xl bg-[#0a1628] border border-amber-500/30 rounded-3xl shadow-2xl text-white overflow-hidden my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalEvent(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
                {/* Left: Banner Poster Image */}
                <div className="md:col-span-5 relative min-h-[260px] md:min-h-[460px] bg-black">
                  <Image
                    src={activeModalEvent.bannerUrl}
                    alt={activeModalEvent.title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent md:hidden" />
                </div>

                {/* Right: Full Schedule & Event Details */}
                <div className="md:col-span-7 p-6 sm:p-8 space-y-5">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-semibold tracking-wider uppercase">
                      {activeModalEvent.category}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#fce8b8] mt-2">
                      {activeModalEvent.title}
                    </h2>
                    {activeModalEvent.subtitle && (
                      <p className="text-xs text-amber-200/80 font-medium mt-1">
                        {activeModalEvent.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Metadata Info Box */}
                  <div className="space-y-2 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-400 text-base">
                        calendar_today
                      </span>
                      <span className="font-medium text-white">{activeModalEvent.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-400 text-base">
                        schedule
                      </span>
                      <span>{activeModalEvent.time}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-amber-400 text-base shrink-0 mt-0.5">
                        location_on
                      </span>
                      <span>{activeModalEvent.location}</span>
                    </div>
                  </div>

                  {/* Detailed Description */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                      About the Program
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                      {activeModalEvent.description}
                    </p>
                  </div>

                  {/* Schedule Breakdown */}
                  {activeModalEvent.schedule && activeModalEvent.schedule.length > 0 && (
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                        Program Schedule
                      </h4>
                      <div className="space-y-2">
                        {activeModalEvent.schedule.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs"
                          >
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-medium shrink-0">
                              {item.time}
                            </span>
                            <span className="text-slate-200">{item.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-3 flex flex-wrap gap-3">
                    <Link
                      href="/support-us#donate"
                      className="px-6 py-2.5 rounded-full bg-[#dfb260] hover:bg-[#cca04b] text-slate-950 text-xs font-bold uppercase tracking-wider shadow-md transition-all"
                    >
                      Offer Seva
                    </Link>
                    <a
                      href={`tel:${activeModalEvent.contactNumber || "+919322881265"}`}
                      className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold tracking-wider uppercase inline-flex items-center gap-1.5 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">call</span>
                      <span>Enquire</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
