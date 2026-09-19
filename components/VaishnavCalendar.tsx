"use client";

import { useState, useEffect, useMemo } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import {
  CaretLeft,
  CaretRight,
  CalendarBlank,
  Sparkle,
  Moon,
  Clock,
  MapPin,
  X,
  ListBullets,
  GridFour,
  CalendarPlus,
  ArrowRight,
  Sun,
  Info,
} from "@phosphor-icons/react";

interface EventInfo {
  name: string;
  description: string;
  color: "amber" | "blue";
  category?: string;
  fasting?: string;
  isFast?: boolean;
  location?: string;
  paranaDetails?: {
    startTime?: string;
    endTime?: string;
    date?: string;
  };
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function VaishnavCalendar() {
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [eventsData, setEventsData] = useState<Record<string, EventInfo>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "agenda">("grid");

  // Fetch Vaishnav events from API when year changes
  useEffect(() => {
    let isMounted = true;
    async function fetchYearlyEvents(year: number) {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/vaishnav-events?year=${year}`);
        const data = await res.json();
        if (data.success && data.events && isMounted) {
          setEventsData(data.events);
        }
      } catch (err) {
        console.error("Failed to fetch yearly Vaishnav events:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchYearlyEvents(currentYear);
    return () => {
      isMounted = false;
    };
  }, [currentYear]);

  const changeMonth = (offset: number) => {
    let newMonth = currentMonth + offset;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDateKey(null);
  };

  const jumpToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    if (eventsData[todayKey]) {
      setSelectedDateKey(todayKey);
    }
  };

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Filter events that fall in current month & year for Agenda view
  const monthEventsList = useMemo(() => {
    const list: { dateKey: string; day: number; event: EventInfo }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      if (eventsData[dateKey]) {
        list.push({
          dateKey,
          day: d,
          event: eventsData[dateKey],
        });
      }
    }
    return list;
  }, [eventsData, currentYear, currentMonth, daysInMonth]);

  const selectedEvent = selectedDateKey ? eventsData[selectedDateKey] : null;

  // Format date helper for human-readable title in modal
  const formatReadableDate = (dateKey: string) => {
    const [y, m, d] = dateKey.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Google calendar link builder
  const getGoogleCalendarUrl = (dateKey: string, event: EventInfo) => {
    const [y, m, d] = dateKey.split("-");
    const dateFormatted = `${y}${m}${d}`;
    const title = encodeURIComponent(`[ISKCON] ${event.name}`);
    const details = encodeURIComponent(
      `${event.description}\n\n${event.fasting || ""}\nLocation: ${event.location || "ISKCON Vartak Nagar, Thane"}`
    );
    const location = encodeURIComponent(event.location || "ISKCON Vartak Nagar, Thane West, Mumbai");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateFormatted}/${dateFormatted}&details=${details}&location=${location}`;
  };

  return (
    <section
      className="w-full py-20 bg-[#faf7f2] border-b border-stone-200/60 text-slate-800"
      id="calendar"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/80 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
                <CalendarBlank className="w-4 h-4 text-amber-700" />
                <span>Vaishnava Calendar • Panchanga</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-slate-900 tracking-tight">
                Sacred Festivals &amp; Auspicious Tithis
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                Plan your visits around sacred appearance days, auspicious Ekadashi fasts,
                and grand spiritual celebrations in Thane.
              </p>
            </div>

            {/* Jump to Today quick action */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={jumpToToday}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-stone-50 text-slate-700 text-xs font-semibold border border-stone-300 shadow-xs hover:border-amber-400 transition-all cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Today: {today.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Main Card Container */}
        <ScrollReveal variant="scale-up" delay={150}>
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl p-4 sm:p-7 relative overflow-hidden">
          {/* Top Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-5 border-b border-stone-200">
            {/* Month & Year Display */}
            <div className="flex items-center gap-3">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0a1628] tracking-tight">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              {isLoading && (
                <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 animate-pulse">
                  Updating...
                </span>
              )}
            </div>

            {/* Navigation & View Switchers */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Previous / Next Month Navigation */}
              <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-stone-100 border border-stone-200">
                <button
                  onClick={() => changeMonth(-1)}
                  className="p-2 rounded-full hover:bg-white text-slate-700 hover:text-amber-800 transition-all shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  aria-label="Previous Month"
                >
                  <CaretLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-slate-600 px-1">
                  {monthNames[currentMonth].slice(0, 3)}
                </span>
                <button
                  onClick={() => changeMonth(1)}
                  className="p-2 rounded-full hover:bg-white text-slate-700 hover:text-amber-800 transition-all shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  aria-label="Next Month"
                >
                  <CaretRight className="w-4 h-4" />
                </button>
              </div>

              {/* View Mode Toggle: Grid vs Agenda */}
              <div className="inline-flex items-center p-1 rounded-full bg-stone-100 border border-stone-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-[#0a1628] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  aria-label="Month Grid View"
                >
                  <GridFour className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode("agenda")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === "agenda"
                      ? "bg-[#0a1628] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  aria-label="Agenda List View"
                >
                  <ListBullets className="w-3.5 h-3.5" />
                  <span>Agenda ({monthEventsList.length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* VIEW 1: MONTH GRID (Desktop & Tablet) */}
          <div className={viewMode === "grid" ? "block" : "hidden sm:block"}>
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center">
              {dayHeaders.map((day, idx) => (
                <div
                  key={day}
                  className={`py-2 text-[11px] sm:text-xs font-bold tracking-wider uppercase ${
                    idx === 0 || idx === 6 ? "text-amber-800" : "text-slate-500"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Cells Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
              {/* Empty Leading Cells */}
              {Array.from({ length: firstDay }).map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="bg-stone-50/50 rounded-2xl border border-dashed border-stone-200 min-h-[70px] sm:min-h-[96px] lg:min-h-[105px]"
                />
              ))}

              {/* Day Cells */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                const eventInfo = eventsData[dateKey];

                const isToday =
                  today.getDate() === dayNum &&
                  today.getMonth() === currentMonth &&
                  today.getFullYear() === currentYear;

                const isSelected = selectedDateKey === dateKey;
                const isEkadashi = eventInfo?.color === "blue";
                const isFestival = eventInfo?.color === "amber";

                return (
                  <div
                    key={dateKey}
                    onClick={() => {
                      if (eventInfo) {
                        setSelectedDateKey(isSelected ? null : dateKey);
                      }
                    }}
                    className={`group relative rounded-2xl p-2 sm:p-2.5 min-h-[70px] sm:min-h-[96px] lg:min-h-[105px] flex flex-col justify-between transition-all duration-200 border select-none ${
                      eventInfo ? "cursor-pointer hover:shadow-md" : "bg-white"
                    } ${
                      isSelected
                        ? "ring-2 ring-amber-500 border-amber-500 bg-amber-50/60 shadow-md z-10"
                        : isToday
                        ? "ring-2 ring-amber-400 border-amber-400 bg-amber-50/40 shadow-xs"
                        : eventInfo
                        ? isEkadashi
                          ? "bg-sky-50/40 border-sky-200/90 hover:border-sky-400 hover:bg-sky-50/80"
                          : "bg-amber-50/40 border-amber-200/90 hover:border-amber-400 hover:bg-amber-50/80"
                        : "border-stone-200/80 hover:border-stone-300"
                    }`}
                  >
                    {/* Top Row: Date Number & Badge Indicator */}
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-xs sm:text-sm font-semibold flex items-center justify-center rounded-full w-6 h-6 sm:w-7 sm:h-7 transition-all ${
                          isToday
                            ? "bg-amber-500 text-white font-bold shadow-xs"
                            : isSelected
                            ? "bg-[#0a1628] text-white"
                            : "text-slate-700 group-hover:text-slate-900"
                        }`}
                      >
                        {dayNum}
                      </span>

                      {/* Small subtle devotional icon */}
                      {isEkadashi && (
                        <span
                          className="flex items-center justify-center w-5 h-5 rounded-full bg-sky-100 text-sky-800 border border-sky-300 shadow-2xs"
                          title="Ekadashi Vrata"
                        >
                          <Moon className="w-3 h-3 fill-current" />
                        </span>
                      )}
                      {isFestival && (
                        <span
                          className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs"
                          title="Vaishnava Festival"
                        >
                          <Sparkle className="w-3 h-3 fill-current" />
                        </span>
                      )}
                    </div>

                    {/* Bottom: Event Title Text */}
                    {eventInfo ? (
                      <div className="mt-1">
                        <div
                          className={`px-1.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold leading-tight line-clamp-2 transition-colors ${
                            isEkadashi
                              ? "bg-sky-100/80 text-sky-900 border border-sky-200/60 group-hover:bg-sky-200/70"
                              : "bg-amber-100/80 text-amber-950 border border-amber-200/60 group-hover:bg-amber-200/70"
                          }`}
                        >
                          {eventInfo.name}
                        </div>
                      </div>
                    ) : (
                      <div className="h-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* VIEW 2: AGENDA / LIST VIEW (Optimized for Mobile & Quick Browsing) */}
          <div className={viewMode === "agenda" ? "block" : "block sm:hidden"}>
            <div className="space-y-3 pt-2">
              {monthEventsList.length > 0 ? (
                monthEventsList.map(({ dateKey, day, event }) => {
                  const isEkadashi = event.color === "blue";
                  const isSelected = selectedDateKey === dateKey;
                  const dateObj = new Date(currentYear, currentMonth, day);
                  const weekday = dateObj.toLocaleDateString("en-US", { weekday: "short" });

                  return (
                    <div
                      key={dateKey}
                      onClick={() => setSelectedDateKey(isSelected ? null : dateKey)}
                      className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer ${
                        isSelected
                          ? "ring-2 ring-amber-500 border-amber-400 bg-amber-50/80 shadow-md"
                          : isEkadashi
                          ? "bg-sky-50/40 border-sky-200 hover:border-sky-300 hover:bg-sky-50/80"
                          : "bg-amber-50/40 border-amber-200 hover:border-amber-300 hover:bg-amber-50/80"
                      }`}
                    >
                      {/* Left Block: Date Badge & Event Details */}
                      <div className="flex items-start gap-4">
                        {/* Date badge */}
                        <div
                          className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl shrink-0 font-bold border shadow-xs ${
                            isEkadashi
                              ? "bg-sky-600 text-white border-sky-700"
                              : "bg-amber-600 text-white border-amber-700"
                          }`}
                        >
                          <span className="text-lg leading-none">{day}</span>
                          <span className="text-[10px] uppercase tracking-wider font-semibold opacity-90 mt-0.5">
                            {weekday}
                          </span>
                        </div>

                        {/* Title & Info */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                isEkadashi
                                  ? "bg-sky-100 text-sky-800 border border-sky-200"
                                  : "bg-amber-100 text-amber-900 border border-amber-200"
                              }`}
                            >
                              {isEkadashi ? (
                                <>
                                  <Moon className="w-2.5 h-2.5 fill-current" />
                                  <span>Ekadashi Fasting</span>
                                </>
                              ) : (
                                <>
                                  <Sparkle className="w-2.5 h-2.5 fill-current" />
                                  <span>Festival</span>
                                </>
                              )}
                            </span>
                          </div>

                          <h4 className="font-serif text-base sm:text-lg font-bold text-slate-900 leading-snug">
                            {event.name}
                          </h4>

                          {event.fasting && (
                            <p className="text-xs text-amber-900 flex items-center gap-1.5 font-medium">
                              <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                              <span>{event.fasting}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: CTA Arrow */}
                      <div className="flex items-center justify-end sm:justify-center">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-900">
                          <span>Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                    <Sun className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-base sm:text-lg font-semibold text-slate-800">
                    No Special Festival Recorded for {monthNames[currentMonth]}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    Daily Mangal Aarti, Deity Darshan, Raj Bhog Aarti, and Srimad
                    Bhagavatam discourses are conducted every day at the temple.
                  </p>
                  <a
                    href="#schedule"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#005ab4] hover:underline"
                  >
                    <span>View Daily Schedule</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Event Detail Modal / Overlay */}
          {selectedEvent && selectedDateKey && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
              <div
                className="relative w-full max-w-lg bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 sm:p-8 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Decorative Top Banner */}
                <div
                  className={`absolute top-0 inset-x-0 h-2.5 ${
                    selectedEvent.color === "blue"
                      ? "bg-gradient-to-r from-sky-500 to-indigo-600"
                      : "bg-gradient-to-r from-amber-400 to-[#d97706]"
                  }`}
                />

                {/* Close Button */}
                <button
                  onClick={() => setSelectedDateKey(null)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-600 transition-colors cursor-pointer"
                  aria-label="Close details"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Event Category Tag */}
                <div className="flex items-center gap-2 mb-3 pt-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      selectedEvent.color === "blue"
                        ? "bg-sky-100 text-sky-900 border border-sky-200"
                        : "bg-amber-100 text-amber-950 border border-amber-200"
                    }`}
                  >
                    {selectedEvent.color === "blue" ? (
                      <>
                        <Moon className="w-3.5 h-3.5 fill-current" />
                        <span>Ekadashi Fasting Day</span>
                      </>
                    ) : (
                      <>
                        <Sparkle className="w-3.5 h-3.5 fill-current" />
                        <span>Sacred Vaishnava Festival</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Event Title */}
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-2">
                  {selectedEvent.name}
                </h3>

                {/* Date & Location Grid */}
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2.5 my-5 text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <CalendarBlank className="w-4 h-4 text-amber-700 shrink-0" />
                    <span className="font-medium text-slate-900">
                      {formatReadableDate(selectedDateKey)}
                    </span>
                  </div>

                  {selectedEvent.location && (
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>{selectedEvent.location} &amp; ISKCON Vartak Nagar</span>
                    </div>
                  )}

                  {selectedEvent.fasting && (
                    <div className="flex items-start gap-2.5 text-amber-950 bg-amber-100/60 p-2.5 rounded-xl border border-amber-200/80">
                      <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span className="font-medium">{selectedEvent.fasting}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {selectedEvent.description ||
                    "Celebrate this auspicious day with soul-stirring kirtan, Vedic discourses, and sanctified prasadam."}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href={getGoogleCalendarUrl(selectedDateKey, selectedEvent)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md text-center cursor-pointer"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    <span>Add to Google Calendar</span>
                  </a>

                  <a
                    href="#schedule"
                    onClick={() => setSelectedDateKey(null)}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-semibold uppercase tracking-wider transition-colors text-center"
                  >
                    <span>View Schedule</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Refined Legend */}
          <div className="mt-8 pt-5 border-t border-stone-200 flex flex-wrap items-center justify-center sm:justify-between gap-4 text-xs font-medium text-slate-600">
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-200" />
                <span>Major Festivals &amp; Utsavas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-sky-500 ring-2 ring-sky-200" />
                <span>Ekadashi Fasting</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border-2 border-amber-500 bg-amber-100" />
                <span>Today</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-amber-700" />
              <span>Timings calculated for Mumbai / Thane timezone.</span>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
