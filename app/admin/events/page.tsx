"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import EventPreviewModal, { PreviewEventData } from "@/components/EventPreviewModal";
import { generateSlug } from "@/lib/slug-utils";

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
}

export interface ImageMetaInfo {
  url: string;
  fileId?: string;
  filename?: string;
  size?: number;
  mimeType?: string;
  width?: number;
  height?: number;
  provider?: string;
}

export interface AdminProgramEvent {
  _id?: string;
  title: string;
  slug: string;
  subtitle?: string;
  category: string;
  shortDescription?: string;
  description: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  date: string;
  time: string;
  timezone?: string;
  location: string;
  venue?: string;
  mapLink?: string;
  bannerUrl: string;
  bannerImageMeta?: ImageMetaInfo;
  thumbnailUrl?: string;
  galleryImages?: string[];
  highlights?: string[];
  schedule?: ScheduleItem[];
  isFeatured: boolean;
  isPublished: boolean;
  status: "draft" | "published" | "scheduled" | "archived" | "upcoming" | "ongoing" | "past";
  order: number;
  contactNumber?: string;
  rsvpLink?: string;
  publishAt?: string;
  unpublishAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

const CATEGORY_OPTIONS = [
  { id: "Grand Festival", label: "Grand Festival", color: "amber", icon: "🪷" },
  { id: "Weekly Program", label: "Weekly Program", color: "blue", icon: "✨" },
  { id: "Youth & Kids", label: "Youth & Kids", color: "emerald", icon: "🌱" },
  { id: "Kirtan & Seva", label: "Kirtan & Seva", color: "purple", icon: "🎶" },
  { id: "Spiritual Seminar", label: "Spiritual Seminar", color: "indigo", icon: "📖" },
  { id: "Special Yatra", label: "Special Yatra (Pilgrimage)", color: "cyan", icon: "🚌" },
  { id: "Spiritual Retreat", label: "Spiritual Retreat", color: "rose", icon: "🏔️" },
  { id: "Guest Speaker", label: "Guest Speaker Discourse", color: "amber", icon: "🎤" },
  { id: "Temple Announcement", label: "Temple Announcement", color: "slate", icon: "📢" },
];

const DEFAULT_BANNER_PRESETS = [
  { label: "Radha Krishna Altar", url: "https://ik.imagekit.io/9uy2us6yw/LandingPage/download?updatedAt=1752604090619" },
  { label: "Gaura Nitai", url: "/gaur_nitai.jpeg" },
  { label: "Srila Prabhupada", url: "/srila_prabhupada.jpeg" },
  { label: "Temple Courtyard", url: "/hero_bg.jpeg" },
];

export default function AdminEventsPage() {
  // Data State
  const [events, setEvents] = useState<AdminProgramEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedFeatured, setSelectedFeatured] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("order");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Summary Metrics
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    scheduled: 0,
    archived: 0,
    featured: 0,
  });

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeFormTab, setActiveFormTab] = useState<"basic" | "datetime" | "location" | "media" | "schedule" | "publishing">("basic");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Preview Modal State
  const [previewTarget, setPreviewTarget] = useState<PreviewEventData | null>(null);

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<AdminProgramEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Form Fields State
  const [formTitle, setFormTitle] = useState<string>("");
  const [formSlug, setFormSlug] = useState<string>("");
  const [isCustomSlug, setIsCustomSlug] = useState<boolean>(false);
  const [formSubtitle, setFormSubtitle] = useState<string>("");
  const [formCategory, setFormCategory] = useState<string>("Grand Festival");
  const [formShortDescription, setFormShortDescription] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");
  const [formStartDate, setFormStartDate] = useState<string>("");
  const [formStartTime, setFormStartTime] = useState<string>("");
  const [formEndDate, setFormEndDate] = useState<string>("");
  const [formEndTime, setFormEndTime] = useState<string>("");
  const [formDisplayDate, setFormDisplayDate] = useState<string>("");
  const [formDisplayTime, setFormDisplayTime] = useState<string>("");
  const [formTimezone, setFormTimezone] = useState<string>("Asia/Kolkata (IST)");
  const [formLocation, setFormLocation] = useState<string>("Main Temple Hall, ISKCON Vartak Nagar, Thane");
  const [formVenue, setFormVenue] = useState<string>("Main Temple Courtyard");
  const [formMapLink, setFormMapLink] = useState<string>("");
  const [formBannerUrl, setFormBannerUrl] = useState<string>("");
  const [formBannerMeta, setFormBannerMeta] = useState<ImageMetaInfo | undefined>(undefined);
  const [formThumbnailUrl, setFormThumbnailUrl] = useState<string>("");
  const [formHighlights, setFormHighlights] = useState<string[]>([]);
  const [newHighlightInput, setNewHighlightInput] = useState<string>("");
  const [formSchedule, setFormSchedule] = useState<ScheduleItem[]>([]);
  const [formStatus, setFormStatus] = useState<AdminProgramEvent["status"]>("published");
  const [formOrder, setFormOrder] = useState<number>(0);
  const [formContactNumber, setFormContactNumber] = useState<string>("+91 93228 81265");
  const [formPublishAt, setFormPublishAt] = useState<string>("");
  const [formUnpublishAt, setFormUnpublishAt] = useState<string>("");

  // Image Upload State
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewAspectRatio, setPreviewAspectRatio] = useState<"contain" | "16-9" | "3-4">("contain");

  // Show temporary toast notification
  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  }, []);

  // Fetch Events from API
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedStatus !== "all") params.append("status", selectedStatus);
      if (selectedFeatured !== "all") params.append("isFeatured", selectedFeatured === "featured" ? "true" : "false");
      params.append("sortBy", sortBy);

      const res = await fetch(`/api/admin/events?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setEvents(data.data || []);
        if (data.stats) setStats(data.stats);
      } else {
        setErrorMsg(data.error || "Failed to load events");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedStatus, selectedFeatured, sortBy]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Handle Title change & auto-generate slug
  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!isCustomSlug) {
      setFormSlug(generateSlug(val));
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingEventId(null);
    setFormErrors({});
    setActiveFormTab("basic");
    setIsCustomSlug(false);

    setFormTitle("");
    setFormSlug("");
    setFormSubtitle("");
    setFormCategory("Grand Festival");
    setFormShortDescription("");
    setFormDescription("");
    setFormStartDate("");
    setFormStartTime("05:00 PM");
    setFormEndDate("");
    setFormEndTime("09:30 PM");
    setFormDisplayDate("");
    setFormDisplayTime("5:00 PM – 9:30 PM");
    setFormTimezone("Asia/Kolkata (IST)");
    setFormLocation("Main Temple Hall, ISKCON Vartak Nagar, Thane");
    setFormVenue("Main Temple Courtyard");
    setFormMapLink("");
    setFormBannerUrl(DEFAULT_BANNER_PRESETS[0].url);
    setFormBannerMeta(undefined);
    setFormThumbnailUrl("");
    setFormHighlights([
      "Ecstatic Kirtan & Harinam",
      "Vedic Discourse & Q&A",
      "Maha Aarti & Royal Darshan",
      "Sumptuous Prasadam Feast",
    ]);
    setNewHighlightInput("");
    setFormSchedule([
      { time: "05:00 PM", title: "Kirtan & Welcome", description: "Melodious chanting to begin the program" },
      { time: "06:30 PM", title: "Discourse & Katha", description: "Spiritual talk on sacred Vedic wisdom" },
      { time: "07:30 PM", title: "Grand Maha Aarti", description: "Evening lamp offering to Sri Sri Radha Krishna" },
      { time: "08:00 PM", title: "Prasadam Feast", description: "Free sanctified multi-course vegetarian feast" },
    ]);

    setFormStatus("published");
    setFormOrder(events.length + 1);
    setFormContactNumber("+91 93228 81265");
    setFormPublishAt("");
    setFormUnpublishAt("");
    setUploadError(null);

    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (ev: AdminProgramEvent) => {
    setEditingEventId(ev._id || null);
    setFormErrors({});
    setActiveFormTab("basic");
    setIsCustomSlug(true);

    setFormTitle(ev.title || "");
    setFormSlug(ev.slug || generateSlug(ev.title));
    setFormSubtitle(ev.subtitle || "");
    setFormCategory(ev.category || "Grand Festival");
    setFormShortDescription(ev.shortDescription || "");
    setFormDescription(ev.description || "");
    setFormStartDate(ev.startDate || "");
    setFormStartTime(ev.startTime || "");
    setFormEndDate(ev.endDate || "");
    setFormEndTime(ev.endTime || "");
    setFormDisplayDate(ev.date || "");
    setFormDisplayTime(ev.time || "");
    setFormTimezone(ev.timezone || "Asia/Kolkata (IST)");
    setFormLocation(ev.location || "Main Temple Hall, ISKCON Vartak Nagar, Thane");
    setFormVenue(ev.venue || "");
    setFormMapLink(ev.mapLink || "");
    setFormBannerUrl(ev.bannerUrl || "");
    setFormBannerMeta(ev.bannerImageMeta);
    setFormThumbnailUrl(ev.thumbnailUrl || "");
    setFormHighlights(ev.highlights || []);
    setNewHighlightInput("");
    setFormSchedule(ev.schedule || []);
    setFormStatus(ev.status || "published");
    setFormOrder(ev.order || 0);
    setFormContactNumber(ev.contactNumber || "+91 93228 81265");
    setFormPublishAt(ev.publishAt ? new Date(ev.publishAt).toISOString().slice(0, 16) : "");
    setFormUnpublishAt(ev.unpublishAt ? new Date(ev.unpublishAt).toISOString().slice(0, 16) : "");
    setUploadError(null);

    setIsFormModalOpen(true);
  };

  // Add Highlight item
  const handleAddHighlight = () => {
    if (newHighlightInput.trim().length > 0) {
      setFormHighlights([...formHighlights, newHighlightInput.trim()]);
      setNewHighlightInput("");
    }
  };

  // Remove Highlight item
  const handleRemoveHighlight = (index: number) => {
    setFormHighlights(formHighlights.filter((_, i) => i !== index));
  };

  // Schedule items helpers
  const handleAddScheduleRow = () => {
    setFormSchedule([...formSchedule, { time: "06:00 PM", title: "Special Program Item", description: "" }]);
  };

  const handleUpdateScheduleRow = (index: number, field: keyof ScheduleItem, val: string) => {
    const updated = [...formSchedule];
    updated[index] = { ...updated[index], [field]: val };
    setFormSchedule(updated);
  };

  const handleRemoveScheduleRow = (index: number) => {
    setFormSchedule(formSchedule.filter((_, i) => i !== index));
  };

  // Handle Image Upload
  const handleFileUpload = async (file: File) => {
    setIsUploadingImage(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "Events");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFormBannerUrl(data.image.url);
        setFormBannerMeta(data.image);
        showToast(`Image "${file.name}" uploaded successfully via ${data.image.provider}!`);
      } else {
        setUploadError(data.error || "Failed to upload image.");
      }
    } catch (err: any) {
      setUploadError(err?.message || "An upload error occurred.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Save Event (Create or Update)
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const errors: Record<string, string> = {};
    if (!formTitle.trim()) errors.title = "Event title is required.";
    if (!formDescription.trim()) errors.description = "Full event description is required.";
    if (!formBannerUrl.trim()) errors.bannerUrl = "Banner image URL is required.";

    const computedDate = formDisplayDate.trim() || formStartDate.trim() || "Upcoming";
    const computedTime =
      formDisplayTime.trim() ||
      (formStartTime ? `${formStartTime}${formEndTime ? ` – ${formEndTime}` : ""}` : "All Day");

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: formTitle.trim(),
        slug: formSlug.trim() || generateSlug(formTitle),
        subtitle: formSubtitle.trim(),
        category: formCategory,
        shortDescription: formShortDescription.trim(),
        description: formDescription.trim(),
        startDate: formStartDate.trim(),
        startTime: formStartTime.trim(),
        endDate: formEndDate.trim(),
        endTime: formEndTime.trim(),
        date: computedDate,
        time: computedTime,
        timezone: formTimezone.trim(),
        location: formLocation.trim(),
        venue: formVenue.trim(),
        mapLink: formMapLink.trim(),
        bannerUrl: formBannerUrl.trim(),
        bannerImageMeta: formBannerMeta,
        thumbnailUrl: formThumbnailUrl.trim() || formBannerUrl.trim(),
        highlights: formHighlights,
        schedule: formSchedule,
        status: formStatus,
        order: Number(formOrder) || 0,
        contactNumber: formContactNumber.trim(),
        publishAt: formPublishAt ? new Date(formPublishAt).toISOString() : undefined,
        unpublishAt: formUnpublishAt ? new Date(formUnpublishAt).toISOString() : undefined,
      };

      const url = editingEventId ? `/api/admin/events/${editingEventId}` : `/api/admin/events`;
      const method = editingEventId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsFormModalOpen(false);
        showToast(
          editingEventId
            ? `Successfully updated "${formTitle}".`
            : `Successfully created event "${formTitle}".`
        );
        fetchEvents();
      } else {
        setFormErrors({ general: data.error || "Failed to save event." });
      }
    } catch (err: any) {
      setFormErrors({ general: err?.message || "An unexpected error occurred." });
    } finally {
      setIsSaving(false);
    }
  };

  // Quick Status Toggle (Publish / Draft)
  const handleToggleStatus = async (event: AdminProgramEvent) => {
    const nextStatus = event.status === "published" || event.status === "upcoming" ? "draft" : "published";
    try {
      const res = await fetch(`/api/admin/events/${event._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...event,
          status: nextStatus,
        }),
      });
      if (res.ok) {
        showToast(`Event status updated to ${nextStatus.toUpperCase()}`);
        fetchEvents();
      }
    } catch (err) {
      console.error("Status toggle error:", err);
    }
  };

  // Delete Event Confirmation
  const handleConfirmDelete = async () => {
    if (!deleteTarget?._id) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/events/${deleteTarget._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Deleted event "${deleteTarget.title}".`);
        setDeleteTarget(null);
        fetchEvents();
      } else {
        alert(data.error || "Failed to delete event.");
      }
    } catch (err: any) {
      alert(err?.message || "An unexpected error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Open Live Preview from Event Object
  const handleOpenLivePreview = (event: AdminProgramEvent) => {
    setPreviewTarget({
      title: event.title,
      subtitle: event.subtitle,
      category: event.category,
      date: event.date,
      time: event.time,
      location: event.location,
      venue: event.venue,
      bannerUrl: event.bannerUrl,
      description: event.description,
      highlights: event.highlights,
      schedule: event.schedule,
      contactNumber: event.contactNumber,
      rsvpLink: event.rsvpLink,
      isFeatured: event.isFeatured,
      status: event.status,
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-bounce">
          <span className="text-emerald-400 text-lg">✓</span>
          <span className="text-xs font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="text-2xl">🎪</span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Upcoming Events &amp; Festivals CMS
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Public Live Sync
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Create, edit, schedule, and feature grand temple celebrations, youth yatras, retreats, and spiritual discourses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/events"
            target="_blank"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer"
          >
            <span>🌐</span>
            <span>View Public Page</span>
          </Link>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            <span className="text-base leading-none">+</span>
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg">
            {stats.total}
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Total Programs</div>
            <div className="text-xs font-medium text-slate-200">Database Records</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
            {stats.published}
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Live &amp; Published</div>
            <div className="text-xs font-medium text-slate-200">Visible on Public Site</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg">
            {stats.draft}
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Drafts / In Review</div>
            <div className="text-xs font-medium text-slate-200">Hidden from Public</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-lg">
            {stats.featured}
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Featured Spotlight</div>
            <div className="text-xs font-medium text-slate-200">Homepage Hero</div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between">
          <span>{errorMsg}</span>
          <button
            onClick={() => fetchEvents()}
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
          <p className="text-xs text-slate-400">Loading events CMS data...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-16 text-center shadow-xl">
          <div className="text-4xl mb-3">📭</div>
          <h3 className="text-base font-bold text-slate-200">No events found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6 leading-relaxed">

          </p>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-md transition"
          >
            + Create First Event
          </button>
        </div>
      ) : viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Event</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date &amp; Timing</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Homepage</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {events.map((ev) => {
                  const isLive = ev.status === "published" || ev.status === "upcoming";
                  return (
                    <tr key={ev._id} className="hover:bg-slate-800/40 transition group">
                      {/* Banner Thumbnail & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-950 border border-slate-800">
                            {ev.bannerUrl ? (
                              <Image
                                src={ev.bannerUrl}
                                alt={ev.title}
                                fill
                                sizes="48px"
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">
                                🖼️
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-100 group-hover:text-amber-300 transition line-clamp-1">
                              {ev.title}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              /{ev.slug || "-"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <span>🪷</span>
                          <span>{ev.category}</span>
                        </span>
                      </td>

                      {/* Date & Timing */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{ev.date}</div>
                        <div className="text-[10px] text-slate-400">{ev.time}</div>
                      </td>

                      {/* Status Pill */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(ev)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${isLive
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                            : ev.status === "draft"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30"
                              : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                            }`}
                          title="Click to toggle Published / Draft"
                        >
                          <span>{isLive ? "● Published" : `○ ${ev.status}`}</span>
                        </button>
                      </td>

                      {/* Homepage Featured */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {ev.isFeatured ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                            ★ Hero Featured
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px]">Standard (Order: {ev.order})</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenLivePreview(ev)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                            title="Preview Public Presentation"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(ev)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition cursor-pointer"
                            title="Edit Event"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => setDeleteTarget(ev)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 transition cursor-pointer"
                            title="Delete Event"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARD GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((ev) => {
            const isLive = ev.status === "published" || ev.status === "upcoming";
            return (
              <div
                key={ev._id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-slate-700 transition group"
              >
                <div>
                  {/* Hero Banner with ambient blur + contain for 3:4 and 16:9 */}
                  <div className="relative w-full h-48 bg-slate-950 flex items-center justify-center overflow-hidden">
                    {ev.bannerUrl ? (
                      <>
                        <Image
                          src={ev.bannerUrl}
                          alt=""
                          fill
                          sizes="33vw"
                          className="object-cover blur-md scale-110 opacity-30 pointer-events-none"
                          unoptimized
                          aria-hidden="true"
                        />
                        <Image
                          src={ev.bannerUrl}
                          alt={ev.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-contain group-hover:scale-105 transition duration-500 drop-shadow-md"
                          unoptimized
                        />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        No Banner
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500 text-slate-950">
                        {ev.category}
                      </span>
                      {ev.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-600 text-white">
                          ★ Featured
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${isLive
                          ? "bg-emerald-500/80 text-white"
                          : "bg-slate-800 text-slate-300"
                          }`}
                      >
                        {ev.status}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-sm font-bold text-white line-clamp-1">
                        {ev.title}
                      </h3>
                      <div className="text-[11px] text-amber-300 font-light">
                        📅 {ev.date}
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2.5">
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {ev.shortDescription || ev.description}
                    </p>

                    <div className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                      <span>📍</span>
                      <span className="truncate">{ev.venue || ev.location}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Priority #{ev.order}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenLivePreview(ev)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                    >
                      👁️ Preview
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(ev)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-medium transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(ev)}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 text-xs transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT EVENT MULTI-SECTION MODAL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full p-6 shadow-2xl max-h-[92vh] flex flex-col space-y-4 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{editingEventId ? "✏️ Edit Event" : "🎪 Create New Program Event"}</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Configure festival description, dates, banner, schedule, and publishing status.
                </p>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form Section Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 shrink-0 text-xs">
              {[
                { id: "basic", label: "1. Info & Content", icon: "📝" },
                { id: "datetime", label: "2. Date & Time", icon: "📅" },
                { id: "location", label: "3. Location", icon: "📍" },
                { id: "media", label: "4. Media & Banner", icon: "🖼️" },
                { id: "schedule", label: "5. Schedule", icon: "⏱️" },
                { id: "publishing", label: "6. Publishing", icon: "🚀" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFormTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap cursor-pointer ${activeFormTab === tab.id
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "bg-slate-800/60 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                    }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Error alerts */}
            {formErrors.general && (
              <div className="p-3 bg-rose-950/50 border border-rose-500/50 rounded-xl text-rose-300 text-xs shrink-0">
                {formErrors.general}
              </div>
            )}

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveEvent} className="overflow-y-auto flex-1 pr-1 space-y-4">
              {/* TAB 1: BASIC INFO */}
              {activeFormTab === "basic" && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Event Title <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Sri Krishna Janmashtami Mahotsav 2026"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    {formErrors.title && (
                      <p className="text-[10px] text-rose-400 mt-1">{formErrors.title}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Category */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Category <span className="text-amber-400">*</span>
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        {CATEGORY_OPTIONS.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.icon} {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Subtitle */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Subtitle / Tagline
                      </label>
                      <input
                        type="text"
                        value={formSubtitle}
                        onChange={(e) => setFormSubtitle(e.target.value)}
                        placeholder="e.g. Divine Appearance Day of Lord Sri Krishna"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Short Summary
                    </label>
                    <textarea
                      rows={2}
                      value={formShortDescription}
                      onChange={(e) => setFormShortDescription(e.target.value)}
                      placeholder="Brief 1-2 sentence overview of the festival..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Full Description */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Description <span className="text-amber-400">*</span>
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Detailed spiritual significance, activities, darshan times, and feast arrangements..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    {formErrors.description && (
                      <p className="text-[10px] text-rose-400 mt-1">{formErrors.description}</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: DATE & TIME */}
              {activeFormTab === "datetime" && (
                <div className="space-y-4 animate-fadeIn">

                  {/* ISO Start & End dates for filtering */}
                  <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                    <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      Dates
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={formStartDate}
                          onChange={(e) => setFormStartDate(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Start Time</label>
                        <input
                          type="text"
                          value={formStartTime}
                          onChange={(e) => setFormStartTime(e.target.value)}
                          placeholder="05:00 PM"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">End Date (Optional)</label>
                        <input
                          type="date"
                          value={formEndDate}
                          onChange={(e) => setFormEndDate(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">End Time</label>
                        <input
                          type="text"
                          value={formEndTime}
                          onChange={(e) => setFormEndTime(e.target.value)}
                          placeholder="09:30 PM"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: LOCATION & CONTACT */}
              {activeFormTab === "location" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Specific Venue / Hall
                      </label>
                      <input
                        type="text"
                        value={formVenue}
                        onChange={(e) => setFormVenue(e.target.value)}
                        placeholder="e.g. Main Temple Courtyard & Altar"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Inquiries / Helpline Number
                      </label>
                      <input
                        type="text"
                        value={formContactNumber}
                        onChange={(e) => setFormContactNumber(e.target.value)}
                        placeholder="+91 93228 81265"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Address / Temple Location
                    </label>
                    <input
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="Main Temple Hall, ISKCON Vartak Nagar, Thane"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Google Maps Location Link
                      </label>
                      <input
                        type="url"
                        value={formMapLink}
                        onChange={(e) => setFormMapLink(e.target.value)}
                        placeholder="https://maps.google.com/..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>


                  </div>
                </div>
              )}

              {/* TAB 4: MEDIA & IMAGEKIT UPLOAD */}
              {activeFormTab === "media" && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Uploader Box */}
                  <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                          <span>Upload Banner Image</span>
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-normal">
                            ImageKit.io CDN
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Supports 16:9 landscape banners, 3:4 portrait flyers, and square posters up to 10MB. Automatically uploaded to ImageKit and saved in database.
                        </div>
                      </div>
                      {isUploadingImage && (
                        <div className="flex items-center gap-2 text-amber-400 text-xs font-medium">
                          <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                          <span>Uploading to ImageKit...</span>
                        </div>
                      )}
                    </div>

                    {/* File Input */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        id="banner-file-input"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                        className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                      />
                    </div>

                    {uploadError && (
                      <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/50 text-rose-300 text-[11px]">
                        {uploadError}
                      </div>
                    )}
                  </div>

                  {/* Live Banner Preview Card */}
                  {formBannerUrl && (
                    <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-200">Image Preview</span>
                          {formBannerMeta && (
                            <span className="text-slate-400 text-[10px] font-mono">
                              {formBannerMeta.width && formBannerMeta.height
                                ? `${formBannerMeta.width} × ${formBannerMeta.height} px • `
                                : ""}
                              {formBannerMeta.size ? `${(formBannerMeta.size / 1024).toFixed(1)} KB • ` : ""}
                              <span className="text-emerald-400 font-semibold">{formBannerMeta.provider || "imagekit"}</span>
                            </span>
                          )}
                        </div>

                        {/* Aspect Ratio View Toggle */}
                        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[10px]">
                          <button
                            type="button"
                            onClick={() => setPreviewAspectRatio("contain")}
                            className={`px-2.5 py-1 rounded-lg transition cursor-pointer font-medium ${
                              previewAspectRatio === "contain"
                                ? "bg-amber-500 text-slate-950 font-bold"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Adaptive Glow (Full)
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewAspectRatio("16-9")}
                            className={`px-2.5 py-1 rounded-lg transition cursor-pointer font-medium ${
                              previewAspectRatio === "16-9"
                                ? "bg-amber-500 text-slate-950 font-bold"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            16:9 Banner
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewAspectRatio("3-4")}
                            className={`px-2.5 py-1 rounded-lg transition cursor-pointer font-medium ${
                              previewAspectRatio === "3-4"
                                ? "bg-amber-500 text-slate-950 font-bold"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            3:4 Poster
                          </button>
                        </div>
                      </div>

                      {/* Display Canvas */}
                      <div
                        className={`relative w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center transition-all ${
                          previewAspectRatio === "3-4"
                            ? "h-80 sm:h-96"
                            : previewAspectRatio === "16-9"
                            ? "h-52 sm:h-64"
                            : "min-h-[220px] sm:min-h-[300px] h-[35vh]"
                        }`}
                      >
                        {/* Ambient Blurred Background Glow */}
                        <Image
                          src={formBannerUrl}
                          alt=""
                          fill
                          className="object-cover blur-2xl scale-110 opacity-35 pointer-events-none"
                          unoptimized
                          aria-hidden="true"
                        />
                        {/* Main Contained / Scaled Image */}
                        <div className="relative w-full h-full p-2 flex items-center justify-center">
                          <Image
                            src={formBannerUrl}
                            alt="Banner Preview"
                            fill
                            sizes="(max-width: 768px) 100vw, 672px"
                            className="object-contain drop-shadow-xl"
                            unoptimized
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                        <div className="absolute bottom-3 left-3 text-white font-bold text-sm drop-shadow-md z-10">
                          {formTitle || "Event Title Preview"}
                        </div>
                      </div>

                      {/* ImageKit URL Information Box */}
                      <div className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs">
                        <div className="overflow-hidden">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Public CDN URL (Stored in Database)</div>
                          <div className="text-amber-300 font-mono text-[11px] truncate select-all">{formBannerUrl}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(formBannerUrl);
                              showToast("ImageKit Public URL copied to clipboard!");
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 transition cursor-pointer"
                          >
                            📋 Copy URL
                          </button>
                          <a
                            href={formBannerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 transition"
                          >
                            🔗 Open
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: HIGHLIGHTS & SCHEDULE BUILDER */}
              {activeFormTab === "schedule" && (
                <div className="space-y-5 animate-fadeIn">
                  {/* Highlights section */}
                  <div className="space-y-2.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Key Highlights &amp; Attractions (Bullet Tags)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newHighlightInput}
                        onChange={(e) => setNewHighlightInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddHighlight();
                          }
                        }}
                        placeholder="e.g. Maha-Abhishekham with 108 Kalashas"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddHighlight}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition shrink-0"
                      >
                        + Add Tag
                      </button>
                    </div>

                    {/* Highlights chips */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {formHighlights.map((h, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-medium"
                        >
                          <span>✓</span>
                          <span>{h}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveHighlight(i)}
                            className="ml-1 text-slate-400 hover:text-rose-400 font-bold text-xs cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Schedule items builder */}
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-200">
                          Event Flow / Timeline Schedule
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Add chronological time slots (e.g. Aarti, Abhishekham, Katha, Prasadam).
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddScheduleRow}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold transition"
                      >
                        + Add Time Slot
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {formSchedule.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
                        >
                          <div className="sm:col-span-3">
                            <input
                              type="text"
                              value={item.time}
                              onChange={(e) => handleUpdateScheduleRow(idx, "time", e.target.value)}
                              placeholder="06:00 PM"
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          <div className="sm:col-span-4">
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => handleUpdateScheduleRow(idx, "title", e.target.value)}
                              placeholder="Session Title"
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          <div className="sm:col-span-4">
                            <input
                              type="text"
                              value={item.description || ""}
                              onChange={(e) => handleUpdateScheduleRow(idx, "description", e.target.value)}
                              placeholder="Details (Optional)"
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          <div className="sm:col-span-1 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveScheduleRow(idx)}
                              className="p-1 rounded bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 text-xs"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: PUBLISHING & HOMEPAGE FEATURE */}
              {activeFormTab === "publishing" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Status selector */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Publishing Status
                      </label>
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
                      >
                        <option value="published">🟢 Published (Live on Public Website)</option>
                        <option value="draft">🟡 Draft (Hidden from Public)</option>
                        <option value="scheduled">⏱️ Scheduled (Auto-publish at specific date)</option>
                        <option value="archived">⚪ Archived (Past Program)</option>
                      </select>
                    </div>

                    {/* Priority Order */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Display Priority / Order (1 = Top)
                      </label>
                      <input
                        type="number"
                        value={formOrder}
                        onChange={(e) => setFormOrder(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Scheduled dates */}
                  {formStatus === "scheduled" && (
                    <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">
                          Schedule Publish Date &amp; Time
                        </label>
                        <input
                          type="datetime-local"
                          value={formPublishAt}
                          onChange={(e) => setFormPublishAt(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">
                          Auto-Unpublish Date &amp; Time (Optional)
                        </label>
                        <input
                          type="datetime-local"
                          value={formUnpublishAt}
                          onChange={(e) => setFormUnpublishAt(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Form Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setPreviewTarget({
                      title: formTitle || "Untitled Program",
                      subtitle: formSubtitle,
                      category: formCategory,
                      date: formDisplayDate || "Upcoming",
                      time: formDisplayTime || "5:00 PM – 9:30 PM",
                      location: formLocation,
                      venue: formVenue,
                      bannerUrl: formBannerUrl,
                      description: formDescription,
                      highlights: formHighlights,
                      schedule: formSchedule,
                      contactNumber: formContactNumber,
                      status: formStatus,
                    })
                  }
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
                >
                  <span>👁️</span>
                  <span>Live Preview</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
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
                      <span>{editingEventId ? "Update Event" : "Create & Save Event"}</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 text-xl mx-auto">
              🗑️
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-white">Delete Program Event?</h3>
              <p className="text-xs text-slate-300 mt-2">
                Are you sure you want to delete this event from the website:
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 mt-3 text-xs font-semibold text-amber-300">
                {deleteTarget.title} ({deleteTarget.category})
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
                {isDeleting ? "Deleting..." : "Yes, Delete Event"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE EVENT PREVIEW MODAL */}
      <EventPreviewModal
        event={previewTarget}
        onClose={() => setPreviewTarget(null)}
      />
    </div>
  );
}
