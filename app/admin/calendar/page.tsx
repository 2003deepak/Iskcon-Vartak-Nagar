"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  CALENDAR_CATEGORIES,
  CalendarCategoryConfig,
  getCategoryConfig,
  DEFAULT_EVENT_LOCATION,
} from "@/lib/calendar-categories";
import {
  MONTH_NAMES,
  MONTH_SHORT_NAMES,
  DAY_NAMES,
  isValidDateString,
  parseDateString,
  getNextDateString,
  formatDisplayDate,
  generateMonthGrid,
  CalendarGridDay,
} from "@/lib/calendar-date-utils";

export interface ParanaDetailsData {
  date?: string;
  startTime?: string;
  endTime?: string;
}

export interface VaishnavEventItem {
  _id?: string;
  title: string;
  dateString: string;
  year: number;
  category?: string;
  color?: string;
  isFast?: boolean;
  location?: string;
  paranaDetails?: ParanaDetailsData | null;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}

const COMMON_PRESETS = [
  { title: "Sri Krishna Janmashtami", category: "festival", isFast: true },
  { title: "Gaura Purnima - Appearance of Sri Chaitanya Mahaprabhu", category: "festival", isFast: true },
  { title: "Rama Navami - Appearance of Lord Ramachandra", category: "festival", isFast: true },
  { title: "Radhastami - Appearance of Srimati Radharani", category: "festival", isFast: true },
  { title: "Nrisimha Caturdasi - Appearance of Lord Nrisimhadeva", category: "festival", isFast: true },
  { title: "Pandava Nirjala Ekadashi", category: "ekadashi", isFast: true },
  { title: "Srila Prabhupada Appearance Day", category: "appearance", isFast: true },
  { title: "Srila Prabhupada Disappearance Day", category: "disappearance", isFast: true },
  { title: "Ratha Yatra Festival", category: "special", isFast: false },
  { title: "Govardhana Puja & Annakuta", category: "festival", isFast: false },
];

const COLOR_SWATCHES = [
  "#d97706", // Saffron / Amber
  "#2563eb", // Royal Blue
  "#7c3aed", // Rich Purple
  "#059669", // Emerald Green
  "#e11d48", // Rose Red
  "#0891b2", // Cyan
  "#d946ef", // Fuchsia
  "#475569", // Slate
];

export default function AdminCalendarPage() {
  // Navigation & Filtering State
  const [selectedYear, setSelectedYear] = useState<number>(() => new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<string>("all"); // "all" or "1" - "12"
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedFasting, setSelectedFasting] = useState<string>("all"); // "all" | "fast" | "non-fast"
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Grid Month State (for interactive calendar view)
  const [gridMonth, setGridMonth] = useState<number>(() => new Date().getMonth()); // 0-11
  const [gridYear, setGridYear] = useState<number>(() => new Date().getFullYear());

  // Data & Loading State
  const [events, setEvents] = useState<VaishnavEventItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [modalFormErrors, setModalFormErrors] = useState<Record<string, string>>({});

  // Form Fields
  const [formTitle, setFormTitle] = useState<string>("");
  const [formDateString, setFormDateString] = useState<string>("");
  const [formCategory, setFormCategory] = useState<string>("festival");
  const [formColor, setFormColor] = useState<string>("#d97706");
  const [formIsFast, setFormIsFast] = useState<boolean>(false);
  const [formLocation, setFormLocation] = useState<string>(DEFAULT_EVENT_LOCATION);
  const [formParanaDate, setFormParanaDate] = useState<string>("");
  const [formParanaStart, setFormParanaStart] = useState<string>("");
  const [formParanaEnd, setFormParanaEnd] = useState<string>("");

  // Delete Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState<VaishnavEventItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Bulk Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importFormat, setImportFormat] = useState<"json" | "csv">("csv");
  const [importRawText, setImportRawText] = useState<string>("");
  const [importValidating, setImportValidating] = useState<boolean>(false);
  const [importPreviewData, setImportPreviewData] = useState<any | null>(null);
  const [isImportingConfirmed, setIsImportingConfirmed] = useState<boolean>(false);

  // Quick Stats
  const [stats, setStats] = useState({
    total: 0,
    fasting: 0,
    ekadashi: 0,
    festivals: 0,
  });

  // Show temporary toast message
  const showToast = useCallback((msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4500);
  }, []);

  // Fetch Events from Admin API
  const fetchCalendarEvents = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const params = new URLSearchParams();
      if (selectedYear) params.append("year", selectedYear.toString());
      if (selectedMonth !== "all") params.append("month", selectedMonth);
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedFasting !== "all") params.append("isFast", selectedFasting === "fast" ? "true" : "false");
      if (searchQuery.trim().length > 0) params.append("search", searchQuery.trim());

      const res = await fetch(`/api/admin/calendar?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setEvents(data.events || []);
        if (data.stats) {
          setStats(data.stats);
        }
      } else {
        setErrorMsg(data.error || "Failed to load calendar events.");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "An unexpected error occurred while fetching events.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedYear, selectedMonth, selectedCategory, selectedFasting, searchQuery]);

  useEffect(() => {
    fetchCalendarEvents();
  }, [fetchCalendarEvents]);

  // Sync gridYear when selectedYear changes
  useEffect(() => {
    setGridYear(selectedYear);
  }, [selectedYear]);

  // Map of events keyed by dateString for fast lookup in Calendar Grid
  const eventsByDate = useMemo(() => {
    const map = new Map<string, VaishnavEventItem[]>();
    events.forEach((ev) => {
      const list = map.get(ev.dateString) || [];
      list.push(ev);
      map.set(ev.dateString, list);
    });
    return map;
  }, [events]);

  // Open Create Modal with optional initial date
  const handleOpenCreateModal = (initialDateStr?: string) => {
    setEditingEventId(null);
    setModalFormErrors({});
    const defaultDate =
      initialDateStr ||
      `${selectedYear}-${String(gridMonth + 1).padStart(2, "0")}-01`;

    setFormTitle("");
    setFormDateString(defaultDate);
    setFormCategory("festival");
    setFormColor("#d97706");
    setFormIsFast(false);
    setFormLocation(DEFAULT_EVENT_LOCATION);
    setFormParanaDate(getNextDateString(defaultDate));
    setFormParanaStart("06:15 AM");
    setFormParanaEnd("10:00 AM");
    setIsEditModalOpen(true);
  };

  // Open Edit Modal for existing event
  const handleOpenEditModal = (event: VaishnavEventItem) => {
    setEditingEventId(event._id || null);
    setModalFormErrors({});
    setFormTitle(event.title);
    setFormDateString(event.dateString);
    setFormCategory(event.category || "festival");
    setFormColor(event.color || getCategoryConfig(event.category).defaultColor);
    setFormIsFast(Boolean(event.isFast));
    setFormLocation(event.location || DEFAULT_EVENT_LOCATION);
    setFormParanaDate(event.paranaDetails?.date || getNextDateString(event.dateString));
    setFormParanaStart(event.paranaDetails?.startTime || "");
    setFormParanaEnd(event.paranaDetails?.endTime || "");
    setIsEditModalOpen(true);
  };

  // Auto update Parana Date when event Date changes
  const handleDateChange = (newDateStr: string) => {
    setFormDateString(newDateStr);
    if (isValidDateString(newDateStr)) {
      setFormParanaDate(getNextDateString(newDateStr));
    }
  };

  // Apply Preset
  const handleApplyPreset = (preset: (typeof COMMON_PRESETS)[0]) => {
    setFormTitle(preset.title);
    setFormCategory(preset.category);
    const catConfig = getCategoryConfig(preset.category);
    setFormColor(catConfig.defaultColor);
    setFormIsFast(preset.isFast);
  };

  // Save Event (Create or Update)
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalFormErrors({});

    const errors: Record<string, string> = {};
    if (!formTitle.trim()) {
      errors.title = "Event title is required.";
    }
    if (!formDateString || !isValidDateString(formDateString)) {
      errors.dateString = "Valid date (YYYY-MM-DD) is required.";
    }

    if (formIsFast) {
      if (formParanaDate && !isValidDateString(formParanaDate)) {
        errors.paranaDate = "Parana date must be in YYYY-MM-DD format.";
      }
    }

    if (Object.keys(errors).length > 0) {
      setModalFormErrors(errors);
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: formTitle.trim(),
        dateString: formDateString.trim(),
        category: formCategory,
        color: formColor,
        isFast: formIsFast,
        location: formLocation.trim() || DEFAULT_EVENT_LOCATION,
        paranaDetails: formIsFast
          ? {
            date: formParanaDate.trim(),
            startTime: formParanaStart.trim(),
            endTime: formParanaEnd.trim(),
          }
          : null,
      };

      const url = editingEventId
        ? `/api/admin/calendar/${editingEventId}`
        : `/api/admin/calendar`;
      const method = editingEventId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsEditModalOpen(false);
        showToast(
          editingEventId
            ? `Successfully updated "${formTitle}".`
            : `Successfully created "${formTitle}".`
        );
        fetchCalendarEvents();
      } else {
        if (res.status === 409) {
          setModalFormErrors({
            duplicate: data.error || "A calendar entry with this title, date and location already exists.",
          });
        } else {
          setModalFormErrors({ general: data.error || "Failed to save calendar entry." });
        }
      }
    } catch (err: any) {
      setModalFormErrors({ general: err?.message || "An unexpected error occurred." });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Event
  const handleConfirmDelete = async () => {
    if (!deleteTarget?._id) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/calendar/${deleteTarget._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Deleted event "${deleteTarget.title}".`);
        setDeleteTarget(null);
        fetchCalendarEvents();
      } else {
        alert(data.error || "Failed to delete calendar entry.");
      }
    } catch (err: any) {
      alert(err?.message || "An unexpected error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Validate Bulk Import Payload
  const handleValidateImport = async () => {
    if (!importRawText.trim()) {
      alert("Please paste CSV or JSON data first.");
      return;
    }
    setImportValidating(true);
    try {
      const res = await fetch("/api/admin/calendar/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "validate",
          format: importFormat,
          rawText: importRawText,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setImportPreviewData(data);
      } else {
        alert(data.error || "Failed to validate import payload.");
      }
    } catch (err: any) {
      alert(err?.message || "An unexpected error occurred during validation.");
    } finally {
      setImportValidating(false);
    }
  };

  // Execute Confirmed Bulk Import
  const handleExecuteImport = async () => {
    if (!importPreviewData) return;
    setIsImportingConfirmed(true);
    try {
      const res = await fetch("/api/admin/calendar/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "import",
          format: importFormat,
          rawText: importRawText,
          skipDuplicates: true,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || "Bulk import completed successfully!");
        setIsImportModalOpen(false);
        setImportPreviewData(null);
        setImportRawText("");
        fetchCalendarEvents();
      } else {
        alert(data.error || "Bulk import execution failed.");
      }
    } catch (err: any) {
      alert(err?.message || "An error occurred during import execution.");
    } finally {
      setIsImportingConfirmed(false);
    }
  };

  // CSV Sample Template
  const sampleCsvContent = `title,dateString,category,isFast,location,paranaDate,paranaStartTime,paranaEndTime
"Gaura Purnima - Appearance of Sri Chaitanya Mahaprabhu",2026-03-03,festival,true,"Mayapur, India",2026-03-04,06:20 AM,10:15 AM
"Rama Navami - Appearance of Sri Ramachandra",2026-03-28,festival,true,"Ayodhya, India",2026-03-29,06:12 AM,10:05 AM
"Pandava Nirjala Ekadashi",2026-06-25,ekadashi,true,"Mumbai, India",2026-06-26,06:02 AM,10:14 AM
"Sri Krishna Janmashtami",2026-09-04,festival,true,"Vrindavan, India",2026-09-05,06:05 AM,10:00 AM
"Radhastami",2026-09-17,festival,true,"Vrindavan, India",2026-09-18,06:08 AM,10:02 AM`;

  // JSON Sample Template
  const sampleJsonContent = `[
  {
    "title": "Gaura Purnima - Appearance of Sri Chaitanya Mahaprabhu",
    "dateString": "2026-03-03",
    "category": "festival",
    "color": "#d97706",
    "isFast": true,
    "location": "Mayapur, India",
    "paranaDetails": {
      "date": "2026-03-04",
      "startTime": "06:20 AM",
      "endTime": "10:15 AM"
    }
  },
  {
    "title": "Pandava Nirjala Ekadashi",
    "dateString": "2026-06-25",
    "category": "ekadashi",
    "color": "#2563eb",
    "isFast": true,
    "location": "Mumbai, India",
    "paranaDetails": {
      "date": "2026-06-26",
      "startTime": "06:02 AM",
      "endTime": "10:14 AM"
    }
  }
]`;

  // Monthly Grid for Calendar View
  const monthGridDays: CalendarGridDay[] = useMemo(() => {
    return generateMonthGrid(gridYear, gridMonth);
  }, [gridYear, gridMonth]);

  // Navigate Calendar Grid Month
  const handlePrevMonth = () => {
    if (gridMonth === 0) {
      setGridMonth(11);
      setGridYear((y) => y - 1);
    } else {
      setGridMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (gridMonth === 11) {
      setGridMonth(0);
      setGridYear((y) => y + 1);
    } else {
      setGridMonth((m) => m + 1);
    }
  };

  const handleGoToToday = () => {
    const now = new Date();
    setGridMonth(now.getMonth());
    setGridYear(now.getFullYear());
    setSelectedYear(now.getFullYear());
    setSelectedMonth(String(now.getMonth() + 1));
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-bounce">
          <span className="text-emerald-400 text-lg">✓</span>
          <span className="text-xs font-medium">{successToast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="text-2xl">📅</span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Vaishnava Calendar
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
              Live &amp; Synced
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Manage sacred Vaishnava festival dates, Ekadashi observances, fasting schedules, and Parana times for ISKCON Vartak Nagar.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setIsImportModalOpen(true);
              setImportPreviewData(null);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer"
          >
            <span>📥</span>
            <span>Bulk Import</span>
          </button>

          <button
            onClick={() => handleOpenCreateModal()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            <span className="text-base leading-none">+</span>
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Summary Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg">
            {stats.total}
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Total Events</div>
            <div className="text-xs font-medium text-slate-200">{selectedYear} Observances</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg">
            {stats.ekadashi}
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Ekadashis</div>
            <div className="text-xs font-medium text-slate-200">Sacred Tithis</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-lg">
            {stats.festivals}
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Festivals</div>
            <div className="text-xs font-medium text-slate-200">Major Celebrations</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold text-lg">
            {stats.fasting}
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Fasting Days</div>
            <div className="text-xs font-medium text-slate-200">With Parana Window</div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between">
          <span>{errorMsg}</span>
          <button
            onClick={() => fetchCalendarEvents()}
            className="px-2.5 py-1 bg-rose-900/60 hover:bg-rose-800 text-white rounded-lg font-medium text-[11px]"
          >
            Retry
          </button>
        </div>
      )}

      {/* MAIN VIEW AREA */}
      {isLoading ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-16 text-center">
          <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-400">Loading Vaishnava calendar data...</p>
        </div>
      ) : (
        /* CALENDAR GRID VIEW */
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Month Navigation Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
            <div className="flex items-center gap-3">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                {MONTH_NAMES[gridMonth]} {gridYear}
              </h2>

            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGoToToday}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Today
              </button>
              <button
                onClick={handlePrevMonth}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs font-bold transition"
                title="Previous Month"
              >
                &larr;
              </button>
              <button
                onClick={handleNextMonth}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs font-bold transition"
                title="Next Month"
              >
                &rarr;
              </button>
            </div>
          </div>

          {/* 7-Day Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/60 text-center py-2.5">
            {DAY_NAMES.map((d, i) => (
              <div
                key={d}
                className={`text-[11px] font-bold uppercase tracking-wider ${i === 0 || i === 6 ? "text-amber-400/80" : "text-slate-400"
                  }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Monthly Day Cells Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-800/80 bg-slate-950/20">
            {monthGridDays.map((dayObj, cellIdx) => {
              const dayEvents = eventsByDate.get(dayObj.dateString) || [];
              const isFastDay = dayEvents.some((e) => e.isFast);

              return (
                <div
                  key={cellIdx}
                  className={`min-h-[115px] sm:min-h-[135px] p-2 flex flex-col justify-between transition group relative ${dayObj.isCurrentMonth
                    ? "bg-slate-900/30 hover:bg-slate-900/70"
                    : "bg-slate-950/70 opacity-45"
                    } ${dayObj.isToday ? "ring-1 ring-amber-500/80 bg-amber-500/5" : ""}`}
                >
                  {/* Day Header with Day Number & Quick Add Button */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${dayObj.isToday
                        ? "bg-amber-500 text-slate-950 shadow-md"
                        : isFastDay
                          ? "text-blue-400 font-black"
                          : dayObj.isCurrentMonth
                            ? "text-slate-300"
                            : "text-slate-600"
                        }`}
                    >
                      {dayObj.dayNumber}
                    </span>

                    {/* Quick Add Event on this day */}
                    <button
                      onClick={() => handleOpenCreateModal(dayObj.dateString)}
                      className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-400 text-xs flex items-center justify-center transition cursor-pointer"
                      title={`Add event on ${dayObj.dateString}`}
                    >
                      +
                    </button>
                  </div>

                  {/* Day Events Stack */}
                  <div className="space-y-1.5 overflow-y-auto max-h-[85px] scrollbar-thin">
                    {dayEvents.map((ev, evIdx) => {
                      const catConfig = getCategoryConfig(ev.category);
                      return (
                        <div
                          key={ev._id || evIdx}
                          onClick={() => handleOpenEditModal(ev)}
                          style={{
                            borderLeftColor: ev.color || catConfig.defaultColor,
                          }}
                          className={`border-l-3 px-2 py-1 rounded-r-md text-[11px] font-medium cursor-pointer transition select-none shadow-sm ${ev.isFast
                            ? "bg-blue-950/40 hover:bg-blue-900/60 text-blue-200 border-l-blue-500"
                            : "bg-slate-800/80 hover:bg-slate-700/90 text-slate-200"
                            }`}
                          title={`${ev.title} - Click to Edit`}
                        >
                          <div className="flex items-center gap-1 leading-tight truncate">
                            {ev.isFast && <span className="text-[10px]">🌙</span>}
                            <span className="truncate">{ev.title}</span>
                          </div>

                          {/* Fasting Parana Pill if present */}
                          {ev.isFast && ev.paranaDetails?.startTime && (
                            <div className="text-[9px] text-blue-300/80 flex items-center gap-1 mt-0.5">
                              <span>⏱️</span>
                              <span>
                                Parana: {ev.paranaDetails.startTime} - {ev.paranaDetails.endTime || "End"}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Day footer subtle indicator */}
                  <div className="text-[9px] text-slate-600 self-end">
                    {dayEvents.length > 0 ? `${dayEvents.length} event${dayEvents.length > 1 ? "s" : ""}` : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CREATE / EDIT EVENT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  {editingEventId ? "Edit Calendar Entry" : "Create New Calendar Entry"}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Configure Vaishnava observance details, tithi dates, and parana schedule.
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Error alerts */}
            {modalFormErrors.general && (
              <div className="p-3 bg-rose-950/50 border border-rose-500/50 rounded-xl text-rose-300 text-xs">
                {modalFormErrors.general}
              </div>
            )}
            {modalFormErrors.duplicate && (
              <div className="p-3 bg-amber-950/50 border border-amber-500/50 rounded-xl text-amber-300 text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{modalFormErrors.duplicate}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveEvent} className="space-y-4">

              {/* Title Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Event Title <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Paksa vardhini Mahadvadasi or Gaura Purnima"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                {modalFormErrors.title && (
                  <p className="text-[10px] text-rose-400 mt-1">{modalFormErrors.title}</p>
                )}
              </div>

              {/* Date & Location Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Date String */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Event Date (YYYY-MM-DD) <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formDateString}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />

                  {modalFormErrors.dateString && (
                    <p className="text-[10px] text-rose-400 mt-1">{modalFormErrors.dateString}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Temple / Location
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Mumbai, India"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Category & Color Swatch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setFormCategory(newCat);
                      const catConf = getCategoryConfig(newCat);
                      setFormColor(catConf.defaultColor);
                      if (catConf.defaultIsFast) {
                        setFormIsFast(true);
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {CALENDAR_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Color Swatches */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Event Color Badge
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    {COLOR_SWATCHES.map((swatch) => (
                      <button
                        key={swatch}
                        type="button"
                        onClick={() => setFormColor(swatch)}
                        style={{ backgroundColor: swatch }}
                        className={`w-6 h-6 rounded-full transition cursor-pointer ${formColor === swatch
                          ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110"
                          : "opacity-75 hover:opacity-100"
                          }`}
                        title={swatch}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Fasting Toggle Checkbox */}
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🌙</span>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Fasting Observance</div>
                      <div className="text-[10px] text-slate-400">
                        Check this if devotees observe fasting on this day (Ekadashi, Janmashtami, etc.)
                      </div>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsFast}
                      onChange={(e) => setFormIsFast(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {/* CONDITIONAL PARANA DETAILS */}
                {formIsFast && (
                  <div className="pt-3 border-t border-slate-800/80 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
                        ⏱️ Parana Window (Breaking Fast)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (formDateString && isValidDateString(formDateString)) {
                            setFormParanaDate(getNextDateString(formDateString));
                          }
                        }}
                        className="text-[10px] text-amber-400 hover:underline"
                      >
                        Auto-set Next Day
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Parana Date</label>
                        <input
                          type="date"
                          value={formParanaDate}
                          onChange={(e) => setFormParanaDate(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Start Time (e.g. 06:15 AM)</label>
                        <input
                          type="text"
                          value={formParanaStart}
                          onChange={(e) => setFormParanaStart(e.target.value)}
                          placeholder="06:15 AM"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">End Time (e.g. 10:30 AM)</label>
                        <input
                          type="text"
                          value={formParanaEnd}
                          onChange={(e) => setFormParanaEnd(e.target.value)}
                          placeholder="10:30 AM"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingEventId ? "Update Entry" : "Create Entry"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 text-xl mx-auto">
              🗑️
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-white">Delete Calendar Entry?</h3>
              <p className="text-xs text-slate-300 mt-2">
                Are you sure you want to permanently delete:
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 mt-3 text-xs font-semibold text-amber-300">
                {deleteTarget.title} ({deleteTarget.dateString})
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Entry"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK IMPORT MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>📥</span>
                  <span>Bulk Import Calendar Records</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Import multi-year Vaishnava calendar data via CSV or JSON with validation and duplicate protection.
                </p>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Step 1: Input or Preview */}
            {!importPreviewData ? (
              <div className="space-y-4">
                {/* Format selection */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setImportFormat("csv")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${importFormat === "csv"
                        ? "bg-amber-500 text-slate-950"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                    >
                      CSV Format
                    </button>
                    <button
                      type="button"
                      onClick={() => setImportFormat("json")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${importFormat === "json"
                        ? "bg-amber-500 text-slate-950"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                    >
                      JSON Format
                    </button>
                  </div>

                  {/* Template download buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setImportFormat("csv");
                        setImportRawText(sampleCsvContent);
                      }}
                      className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                    >
                      Load Sample CSV
                    </button>
                    <span className="text-slate-600">•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setImportFormat("json");
                        setImportRawText(sampleJsonContent);
                      }}
                      className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                    >
                      Load Sample JSON
                    </button>
                  </div>
                </div>

                {/* Paste Area */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Paste {importFormat.toUpperCase()} Data
                  </label>
                  <textarea
                    rows={10}
                    value={importRawText}
                    onChange={(e) => setImportRawText(e.target.value)}
                    placeholder={
                      importFormat === "csv"
                        ? "title,dateString,category,isFast,location,paranaDate,paranaStartTime,paranaEndTime..."
                        : '[{"title":"Paksa vardhini Mahadvadasi","dateString":"2026-02-10","category":"mahadvadasi","isFast":true...}]'
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Validate Button */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsImportModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleValidateImport}
                    disabled={importValidating || !importRawText.trim()}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition cursor-pointer"
                  >
                    {importValidating ? "Validating Records..." : "Validate & Preview →"}
                  </button>
                </div>
              </div>
            ) : (
              /* Step 2: Validation Preview Table */
              <div className="space-y-4">
                {/* Summary badges */}
                <div className="grid grid-cols-4 gap-2.5 p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Total Rows</div>
                    <div className="text-sm font-bold text-white">{importPreviewData.summary.total}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-emerald-400">Ready to Import</div>
                    <div className="text-sm font-bold text-emerald-400">{importPreviewData.summary.readyToImport}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-amber-400">Duplicates (Skip)</div>
                    <div className="text-sm font-bold text-amber-400">{importPreviewData.summary.duplicates}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-rose-400">Invalid Rows</div>
                    <div className="text-sm font-bold text-rose-400">{importPreviewData.summary.invalid}</div>
                  </div>
                </div>

                {/* Preview Table */}
                <div className="border border-slate-800 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-950 sticky top-0 border-b border-slate-800 text-[10px] uppercase text-slate-400">
                      <tr>
                        <th className="py-2.5 px-3">Row</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Title</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Errors / Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                      {importPreviewData.preview.map((row: any) => (
                        <tr key={row.rowNumber} className="hover:bg-slate-800/30">
                          <td className="py-2 px-3 font-mono text-slate-400">#{row.rowNumber}</td>
                          <td className="py-2 px-3 whitespace-nowrap">
                            {row.status === "valid" && (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">
                                Ready
                              </span>
                            )}
                            {row.status === "duplicate" && (
                              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold text-[10px]">
                                Duplicate
                              </span>
                            )}
                            {row.status === "invalid" && (
                              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold text-[10px]">
                                Invalid
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 font-mono text-slate-300">
                            {row.sanitizedData?.dateString || "-"}
                          </td>
                          <td className="py-2 px-3 font-semibold text-slate-200">
                            {row.sanitizedData?.title || "-"}
                          </td>
                          <td className="py-2 px-3 text-slate-400">
                            {row.sanitizedData?.category || "-"}
                          </td>
                          <td className="py-2 px-3 text-rose-400 text-[11px]">
                            {row.errors?.join(", ") || "OK"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setImportPreviewData(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
                  >
                    &larr; Back to Editor
                  </button>

                  <button
                    type="button"
                    onClick={handleExecuteImport}
                    disabled={
                      isImportingConfirmed ||
                      importPreviewData.summary.readyToImport === 0
                    }
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-40 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                  >
                    {isImportingConfirmed
                      ? "Importing to Database..."
                      : `Confirm & Import ${importPreviewData.summary.readyToImport} Records`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
