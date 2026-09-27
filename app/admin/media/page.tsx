"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { adminFetch } from "@/lib/admin-fetch";
import {
  MEDIA_CATEGORIES,
  MEDIA_TYPES,
  extractYouTubeVideoId,
  getYouTubeThumbnail,
  getYouTubeEmbedUrl,
  isValidHttpUrl,
  isValidInstagramUrl,
  extractInstagramShortcode,
} from "@/lib/media-utils";
import { MediaCategory, MediaType } from "@/models/MediaItem";

export interface AdminMediaItem {
  _id: string;
  title: string;
  description?: string;
  mediaType: MediaType;
  category: MediaCategory;
  subcategory?: string;
  imageUrl: string;
  externalUrl?: string;
  youtubeVideoId?: string;
  eventDate?: string;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminMediaPage() {
  // Data State
  const [mediaList, setMediaList] = useState<AdminMediaItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Metrics State
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    featured: 0,
    images: 0,
    videos: 0,
    reels: 0,
  });

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedFeatured, setSelectedFeatured] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("displayOrder");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Form Fields State
  const [formMediaType, setFormMediaType] = useState<MediaType>("IMAGE");
  const [formTitle, setFormTitle] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");
  const [formCategory, setFormCategory] = useState<MediaCategory>("Darshan");
  const [formSubcategory, setFormSubcategory] = useState<string>("");
  const [formImageUrl, setFormImageUrl] = useState<string>("");
  const [formExternalUrl, setFormExternalUrl] = useState<string>("");
  const [formEventDate, setFormEventDate] = useState<string>("");
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(0);
  const [formIsFeatured, setFormIsFeatured] = useState<boolean>(false);
  const [formIsPublished, setFormIsPublished] = useState<boolean>(true);

  // Image Verification State
  const [imageVerificationStatus, setImageVerificationStatus] = useState<"idle" | "verifying" | "valid" | "invalid">("idle");
  const [imageDimensions, setImageDimensions] = useState<{ width?: number; height?: number } | null>(null);
  const [previewAspectRatio, setPreviewAspectRatio] = useState<"contain" | "16-9" | "3-4" | "1-1">("contain");
  const imageVerificationTimeout = useRef<NodeJS.Timeout | null>(null);

  // Staged File Upload for ImageKit
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);

  // Lightbox Preview Modal State
  const [previewItem, setPreviewItem] = useState<AdminMediaItem | null>(null);

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<AdminMediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Toast Helper
  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  }, []);

  // Fetch Media Records
  const fetchMedia = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      if (selectedType !== "all") params.append("type", selectedType);
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedStatus !== "all") params.append("status", selectedStatus);
      if (selectedFeatured !== "all") params.append("featured", selectedFeatured === "featured" ? "true" : "false");
      if (selectedDate.trim()) params.append("date", selectedDate.trim());
      params.append("sortBy", sortBy);

      const res = await adminFetch(`/api/admin/media?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setMediaList(data.items || []);
        if (data.stats) setStats(data.stats);
      } else {
        setErrorMsg(data.error || "Failed to load media records.");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedType, selectedCategory, selectedStatus, selectedFeatured, selectedDate, sortBy]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  // Image URL Real-Time Verifier & Loader
  const verifyImage = useCallback((url: string) => {
    if (!url.trim()) {
      setImageVerificationStatus("idle");
      setImageDimensions(null);
      return;
    }

    if (!isValidHttpUrl(url)) {
      setImageVerificationStatus("invalid");
      setImageDimensions(null);
      return;
    }

    setImageVerificationStatus("verifying");

    const img = new window.Image();
    img.onload = () => {
      setImageVerificationStatus("valid");
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      setImageVerificationStatus("invalid");
      setImageDimensions(null);
    };
    img.src = url.trim();
  }, []);

  // Handle URL change with debounce
  const handleImageUrlChange = (val: string) => {
    setFormImageUrl(val);
    setSelectedFile(null);
    if (imageVerificationTimeout.current) clearTimeout(imageVerificationTimeout.current);
    imageVerificationTimeout.current = setTimeout(() => {
      verifyImage(val);
    }, 400);
  };

  // Handle YouTube URL change & auto-extract thumbnail
  const handleYouTubeUrlChange = (val: string) => {
    setFormExternalUrl(val);
    const videoId = extractYouTubeVideoId(val);
    if (videoId) {
      const thumb = getYouTubeThumbnail(videoId, "maxres");
      setFormImageUrl(thumb);
      verifyImage(thumb);
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = (initialCategory?: MediaCategory) => {
    setEditingItemId(null);
    setFormErrors({});
    setFileUploadError(null);
    setSelectedFile(null);

    setFormMediaType("IMAGE");
    setFormTitle("");
    setFormDescription("");
    setFormCategory(initialCategory || "Darshan");
    setFormSubcategory("Gaura Nitai");
    setFormImageUrl("");
    setFormExternalUrl("");
    setFormEventDate(new Date().toISOString().slice(0, 10));
    setFormDisplayOrder(mediaList.length + 1);
    setFormIsFeatured(false);
    setFormIsPublished(true);

    setImageVerificationStatus("idle");
    setImageDimensions(null);

    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: AdminMediaItem) => {
    setEditingItemId(item._id);
    setFormErrors({});
    setFileUploadError(null);
    setSelectedFile(null);

    setFormMediaType(item.mediaType);
    setFormTitle(item.title);
    setFormDescription(item.description || "");
    setFormCategory(item.category);
    setFormSubcategory(item.subcategory || "");
    setFormImageUrl(item.imageUrl || "");
    setFormExternalUrl(item.externalUrl || "");
    setFormEventDate(item.eventDate || new Date().toISOString().slice(0, 10));
    setFormDisplayOrder(item.displayOrder ?? 0);
    setFormIsFeatured(item.isFeatured);
    setFormIsPublished(item.isPublished);

    if (item.imageUrl) {
      verifyImage(item.imageUrl);
    } else {
      setImageVerificationStatus("idle");
      setImageDimensions(null);
    }

    setIsFormModalOpen(true);
  };

  // Handle Local File Upload to ImageKit
  const handleFileUpload = async (file: File) => {
    setIsUploadingFile(true);
    setFileUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "Media");

      const res = await adminFetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFormImageUrl(data.image.url);
        verifyImage(data.image.url);
        showToast(`Image "${file.name}" uploaded to ImageKit successfully!`);
      } else {
        setFileUploadError(data.error || "Failed to upload image.");
      }
    } catch (err: any) {
      setFileUploadError(err?.message || "An upload error occurred.");
    } finally {
      setIsUploadingFile(false);
    }
  };

  // Save Media (Create or Update)
  const handleSaveMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const errors: Record<string, string> = {};

    if (!formTitle.trim()) {
      errors.title = "Media title is required.";
    }

    if (formMediaType === "IMAGE") {
      if (!formImageUrl.trim()) {
        errors.imageUrl = "Image URL is required. Paste a URL or upload a file.";
      } else if (imageVerificationStatus === "invalid") {
        errors.imageUrl = "Image URL is invalid or inaccessible. Please verify the URL.";
      }
    } else if (formMediaType === "YOUTUBE") {
      if (!formExternalUrl.trim()) {
        errors.externalUrl = "YouTube video URL is required.";
      } else if (!extractYouTubeVideoId(formExternalUrl)) {
        errors.externalUrl = "Invalid YouTube URL format. Enter standard, short, or embed URL.";
      }
    } else if (formMediaType === "INSTAGRAM_REEL") {
      if (!formExternalUrl.trim()) {
        errors.externalUrl = "Instagram Reel URL is required.";
      } else if (!isValidInstagramUrl(formExternalUrl)) {
        errors.externalUrl = "Invalid Instagram link. Format: https://www.instagram.com/reel/...";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSaving(true);

    try {
      let finalImageUrl = formImageUrl.trim();
      let extractedVideoId: string | undefined = undefined;

      if (formMediaType === "YOUTUBE") {
        const vidId = extractYouTubeVideoId(formExternalUrl);
        if (vidId) {
          extractedVideoId = vidId;
          if (!finalImageUrl) finalImageUrl = getYouTubeThumbnail(vidId, "maxres");
        }
      } else if (formMediaType === "INSTAGRAM_REEL" && !finalImageUrl) {
        finalImageUrl = "/hero_bg.jpeg";
      }

      const payload = {
        title: formTitle.trim(),
        description: formDescription.trim(),
        mediaType: formMediaType,
        category: formCategory,
        subcategory: formSubcategory.trim(),
        imageUrl: finalImageUrl,
        externalUrl: formExternalUrl.trim() || undefined,
        youtubeVideoId: extractedVideoId,
        eventDate: formEventDate.trim() || new Date().toISOString().slice(0, 10),
        displayOrder: Number(formDisplayOrder) || 0,
        isFeatured: Boolean(formIsFeatured),
        isPublished: Boolean(formIsPublished),
      };

      const url = editingItemId ? `/api/admin/media/${editingItemId}` : `/api/admin/media`;
      const method = editingItemId ? "PUT" : "POST";

      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsFormModalOpen(false);
        showToast(
          editingItemId
            ? `Successfully updated "${formTitle}".`
            : `✓ Media published successfully! Visible on website.`
        );
        fetchMedia();
      } else {
        setFormErrors({ general: data.error || "Failed to save media item." });
      }
    } catch (err: any) {
      setFormErrors({ general: err?.message || "An unexpected error occurred." });
    } finally {
      setIsSaving(false);
    }
  };

  // Quick Toggle Published Status
  const handleTogglePublished = async (item: AdminMediaItem) => {
    try {
      const nextPublished = !item.isPublished;
      const res = await adminFetch(`/api/admin/media/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...item,
          isPublished: nextPublished,
        }),
      });

      if (res.ok) {
        showToast(`Status updated: ${nextPublished ? "Published (Live on Website)" : "Draft (Hidden)"}`);
        fetchMedia();
      }
    } catch (err) {
      console.error("Toggle publish error:", err);
    }
  };

  // Quick Toggle Featured Status
  const handleToggleFeatured = async (item: AdminMediaItem) => {
    try {
      const nextFeatured = !item.isFeatured;
      const res = await adminFetch(`/api/admin/media/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...item,
          isFeatured: nextFeatured,
        }),
      });

      if (res.ok) {
        showToast(nextFeatured ? "★ Added to Featured Spotlight" : "Removed from Featured");
        fetchMedia();
      }
    } catch (err) {
      console.error("Toggle featured error:", err);
    }
  };

  // Delete Media Confirmation
  const handleConfirmDelete = async () => {
    if (!deleteTarget?._id) return;
    setIsDeleting(true);
    try {
      const res = await adminFetch(`/api/admin/media/${deleteTarget._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Deleted media "${deleteTarget.title}".`);
        setDeleteTarget(null);
        fetchMedia();
      } else {
        alert(data.error || "Failed to delete media item.");
      }
    } catch (err: any) {
      alert(err?.message || "An error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-950/95 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md animate-bounce">
          <span className="text-emerald-400 text-lg">✓</span>
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Page Header Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <span className="text-2xl">🖼️</span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Media &amp; Daily Darshan CMS
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Live Website Sync
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Manage deity darshan images, YouTube kirtans, and Instagram reels. Paste any image URL with instant preview or upload to ImageKit.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/#gallery"
            target="_blank"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer"
          >
            <span>🌐</span>
            <span>View Public Gallery</span>
          </Link>

          <button
            onClick={() => handleOpenCreateModal()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            <span className="text-base leading-none">+</span>
            <span>Add Media</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg shrink-0">
            {stats.total}
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Total Media</div>
            <div className="text-xs font-medium text-slate-200">Database Items</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg shrink-0">
            {stats.published}
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Published</div>
            <div className="text-xs font-medium text-slate-200">Live on Website</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-lg shrink-0">
            {stats.featured}
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Featured</div>
            <div className="text-xs font-medium text-slate-200">Hero Spotlight</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg shrink-0">
            {stats.images}
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Photos / Darshan</div>
            <div className="text-xs font-medium text-slate-200">Image Records</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3.5 shadow-sm col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold text-lg shrink-0">
            {stats.videos + stats.reels}
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Videos &amp; Reels</div>
            <div className="text-xs font-medium text-slate-200">YouTube &amp; Insta</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Tool Strip */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-3.5 backdrop-blur-md shadow-xl">
        {/* Top: Type Filter Tabs & Search Box */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Media Type Segmented Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {[
              { id: "all", label: "All Media", icon: "✨" },
              { id: "IMAGE", label: "Images", icon: "🖼️" },
              { id: "YOUTUBE", label: "YouTube", icon: "▶️" },
              { id: "INSTAGRAM_REEL", label: "Reels", icon: "📱" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer whitespace-nowrap ${selectedType === t.id
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold"
                    : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, description..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <span className="absolute left-3 top-2.5 text-slate-500 text-xs">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Bottom: Secondary Filters (Category, Status, Featured, Date, View Switcher) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="all">📁 All Categories</option>
              {MEDIA_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="all">⚡ Status: All</option>
              <option value="published">🟢 Published</option>
              <option value="draft">🟡 Draft</option>
            </select>

            {/* Featured Filter */}
            <select
              value={selectedFeatured}
              onChange={(e) => setSelectedFeatured(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="all">★ Featured: All</option>
              <option value="featured">★ Featured Only</option>
            </select>

            {/* Event Date Filter */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              title="Filter by Event Date"
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500 cursor-pointer"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate("")}
                className="text-slate-400 hover:text-white text-[11px] underline cursor-pointer"
              >
                Clear Date
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="inline-flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${viewMode === "cards" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                  }`}
                title="Card Grid View"
              >
                ▦ Cards
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${viewMode === "table" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                  }`}
                title="Table View"
              >
                ☰ Table
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between">
          <span>{errorMsg}</span>
          <button
            onClick={() => fetchMedia()}
            className="px-2.5 py-1 bg-rose-900/60 hover:bg-rose-800 text-white rounded-lg font-medium text-[11px]"
          >
            Retry
          </button>
        </div>
      )}

      {/* MAIN VIEW AREA */}
      {isLoading ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-16 text-center">
          <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Loading media library records...</p>
        </div>
      ) : mediaList.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-16 text-center shadow-xl">
          <div className="text-4xl mb-3">🖼️</div>
          <h3 className="text-base font-bold text-slate-200">No media items found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6 leading-relaxed">
            Add your first daily darshan photo, YouTube kirtan video, or Instagram Reel to display on the public website.
          </p>
          <button
            onClick={() => handleOpenCreateModal()}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
          >
            + Add First Media
          </button>
        </div>
      ) : viewMode === "cards" ? (
        /* VISUAL CARD GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {mediaList.map((item) => {
            const isLive = item.isPublished;
            return (
              <div
                key={item._id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-slate-700 transition group"
              >
                <div>
                  {/* Media Visual Canvas Container */}
                  <div
                    onClick={() => setPreviewItem(item)}
                    className="relative w-full h-48 bg-slate-950 flex items-center justify-center overflow-hidden cursor-pointer"
                  >
                    {/* Ambient Glow Backdrop */}
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      sizes="33vw"
                      className="object-cover blur-md scale-110 opacity-35 pointer-events-none"
                      unoptimized
                      aria-hidden="true"
                    />

                    {/* Contained Main Visual */}
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain group-hover:scale-105 transition duration-500 drop-shadow-md"
                      unoptimized
                    />

                    {/* Dark gradient bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

                    {/* Media Type Icon Badge */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-black/70 backdrop-blur-xs border border-white/20 text-white flex items-center gap-1">
                        <span>{item.mediaType === "IMAGE" ? "🖼️" : item.mediaType === "YOUTUBE" ? "▶️" : "📱"}</span>
                        <span>{item.mediaType === "IMAGE" ? "Photo" : item.mediaType === "YOUTUBE" ? "YouTube" : "Reel"}</span>
                      </span>

                      {item.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-600 text-white shadow-md">
                          ★ Featured
                        </span>
                      )}
                    </div>

                    {/* Status Pill on top right */}
                    <div className="absolute top-3 right-3 z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePublished(item);
                        }}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${isLive
                            ? "bg-emerald-500/90 text-white hover:bg-emerald-600"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          }`}
                        title="Click to toggle Published / Draft"
                      >
                        {isLive ? "● Live" : "○ Draft"}
                      </button>
                    </div>

                    {/* YouTube Play Icon Overlay if video */}
                    {item.mediaType === "YOUTUBE" && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition">
                          ▶
                        </div>
                      </div>
                    )}

                    {/* Category pill on bottom left */}
                    <div className="absolute bottom-2.5 left-3 z-10">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-slate-950">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description || "No description provided."}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
                      <span>📅 {item.eventDate || "Recent"}</span>
                      {item.subcategory && <span className="truncate max-w-[120px]">🏷️ {item.subcategory}</span>}
                    </div>
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(item)}
                      className={`text-xs p-1 rounded hover:bg-slate-800 transition cursor-pointer ${item.isFeatured ? "text-purple-400 font-bold" : "text-slate-500 hover:text-slate-300"
                        }`}
                      title="Toggle Featured Spotlight"
                    >
                      {item.isFeatured ? "★ Featured" : "☆ Feature"}
                    </button>
                    <span className="text-[10px] text-slate-600 font-mono">#{item.displayOrder}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer text-xs"
                      title="Preview Media"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition cursor-pointer text-xs font-semibold"
                      title="Edit Media"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 text-xs transition cursor-pointer"
                      title="Delete Media"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Media</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Event Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {mediaList.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-800/40 transition group">
                    {/* Thumbnail & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-950 border border-slate-800">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-100 group-hover:text-amber-300 transition line-clamp-1">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-slate-500 line-clamp-1">
                            {item.description || item.subcategory || "No details"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Media Type */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300">
                        <span>{item.mediaType === "IMAGE" ? "🖼️" : item.mediaType === "YOUTUBE" ? "▶️" : "📱"}</span>
                        <span>{item.mediaType}</span>
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <span>{item.category}</span>
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-300">
                      {item.eventDate || "-"}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublished(item)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${item.isPublished
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                            : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                          }`}
                      >
                        {item.isPublished ? "● Live" : "○ Draft"}
                      </button>
                    </td>

                    {/* Order */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-400">
                      #{item.displayOrder}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                          title="Preview"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition cursor-pointer"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MEDIA MODAL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[92vh] flex flex-col space-y-4 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{editingItemId ? "✏️ Edit Media Record" : "✨ Add New Media / Daily Darshan"}</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Publish high-resolution Darshan photos, YouTube kirtans, and Instagram reels directly to the main website.
                </p>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Error alerts */}
            {formErrors.general && (
              <div className="p-3 bg-rose-950/50 border border-rose-500/50 rounded-xl text-rose-300 text-xs shrink-0">
                {formErrors.general}
              </div>
            )}

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveMedia} className="overflow-y-auto flex-1 pr-1 space-y-4 text-xs">
              {/* 1. Media Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Media Type <span className="text-amber-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {MEDIA_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setFormMediaType(t.id);
                        if (t.id === "YOUTUBE" && formExternalUrl) {
                          handleYouTubeUrlChange(formExternalUrl);
                        }
                      }}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${formMediaType === t.id
                          ? "bg-amber-500/15 border-amber-500 text-amber-300 font-bold shadow-md shadow-amber-500/10"
                          : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                        }`}
                    >
                      <span className="text-base">{t.icon}</span>
                      <span className="text-[11px]">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. DYNAMIC URL ENTRY ACCORDING TO TYPE */}
              {formMediaType === "IMAGE" && (
                <div className="space-y-3 p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-200">
                      Image URL <span className="text-amber-400">*</span>
                    </label>
                    {imageVerificationStatus === "verifying" && (
                      <span className="text-amber-400 text-[10px] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        Verifying image link...
                      </span>
                    )}
                    {imageVerificationStatus === "valid" && (
                      <span className="text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                        ✓ Image loaded successfully
                        {imageDimensions?.width ? ` (${imageDimensions.width}×${imageDimensions.height}px)` : ""}
                      </span>
                    )}
                    {imageVerificationStatus === "invalid" && (
                      <span className="text-rose-400 text-[10px] font-semibold">
                        ⚠ Unable to load image
                      </span>
                    )}
                  </div>

                  <input
                    type="url"
                    value={formImageUrl}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    placeholder="https://example.com/daily-darshan.jpg or ImageKit URL"
                    className={`w-full bg-slate-900 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition ${imageVerificationStatus === "invalid"
                        ? "border-rose-500 focus:border-rose-500"
                        : imageVerificationStatus === "valid"
                          ? "border-emerald-500/80 focus:border-emerald-500"
                          : "border-slate-800 focus:border-amber-500"
                      }`}
                  />

                  {formErrors.imageUrl && (
                    <p className="text-[10px] text-rose-400">{formErrors.imageUrl}</p>
                  )}

                  {/* Or File Upload to ImageKit */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] text-slate-400">
                      Or upload local file directly to ImageKit:
                    </span>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition">
                      <span>📁 Choose Local File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {isUploadingFile && (
                    <div className="text-[11px] text-amber-400 animate-pulse">
                      Uploading to ImageKit, please wait...
                    </div>
                  )}
                  {fileUploadError && (
                    <div className="text-[10px] text-rose-400">{fileUploadError}</div>
                  )}

                  {/* Real-time Image Visual Preview Canvas */}
                  {formImageUrl && (
                    <div className="pt-2 space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Live Image Preview</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setPreviewAspectRatio("contain")}
                            className={`px-2 py-0.5 rounded ${previewAspectRatio === "contain" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-300"}`}
                          >
                            Full
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewAspectRatio("16-9")}
                            className={`px-2 py-0.5 rounded ${previewAspectRatio === "16-9" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-300"}`}
                          >
                            16:9
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewAspectRatio("3-4")}
                            className={`px-2 py-0.5 rounded ${previewAspectRatio === "3-4" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-300"}`}
                          >
                            3:4
                          </button>
                        </div>
                      </div>

                      <div
                        className={`relative w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center transition-all ${previewAspectRatio === "3-4" ? "h-64 sm:h-72" : previewAspectRatio === "16-9" ? "h-44 sm:h-52" : "h-52"
                          }`}
                      >
                        {imageVerificationStatus === "valid" ? (
                          <>
                            <Image
                              src={formImageUrl}
                              alt=""
                              fill
                              className="object-cover blur-xl scale-110 opacity-30 pointer-events-none"
                              unoptimized
                              aria-hidden="true"
                            />
                            <div className="relative w-full h-full p-2 flex items-center justify-center">
                              <Image
                                src={formImageUrl}
                                alt="Preview"
                                fill
                                sizes="500px"
                                className="object-contain drop-shadow-md"
                                unoptimized
                              />
                            </div>
                          </>
                        ) : imageVerificationStatus === "verifying" ? (
                          <div className="text-slate-400 text-xs animate-pulse">Loading preview...</div>
                        ) : (
                          <div className="p-4 text-center text-rose-300 text-xs space-y-1">
                            <div className="text-xl">⚠️</div>
                            <div className="font-semibold">Unable to load image</div>
                            <div className="text-[10px] text-slate-400">
                              Please verify the URL is public and links directly to an authentic image.
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* YOUTUBE VIDEO ENTRY */}
              {formMediaType === "YOUTUBE" && (
                <div className="space-y-3 p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      YouTube Video URL <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="url"
                      value={formExternalUrl}
                      onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=OGSaFXdssdQ or https://youtu.be/..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    {formErrors.externalUrl && (
                      <p className="text-[10px] text-rose-400 mt-1">{formErrors.externalUrl}</p>
                    )}
                  </div>

                  {/* YouTube Live Video Embed / Thumbnail Preview */}
                  {extractYouTubeVideoId(formExternalUrl) && (
                    <div className="space-y-2 pt-2">

                      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-slate-800">
                        <iframe
                          className="w-full h-full"
                          src={getYouTubeEmbedUrl(extractYouTubeVideoId(formExternalUrl)!, false)}
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* INSTAGRAM REEL ENTRY */}
              {formMediaType === "INSTAGRAM_REEL" && (
                <div className="space-y-3 p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Instagram Reel URL <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="url"
                      value={formExternalUrl}
                      onChange={(e) => setFormExternalUrl(e.target.value)}
                      placeholder="https://www.instagram.com/reel/C8xYz12345/ or https://www.instagram.com/p/..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    {formErrors.externalUrl && (
                      <p className="text-[10px] text-rose-400 mt-1">{formErrors.externalUrl}</p>
                    )}
                  </div>

                  {formExternalUrl && isValidInstagramUrl(formExternalUrl) && (
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-semibold">
                        <span>📱 Valid Instagram Link</span>
                        {extractInstagramShortcode(formExternalUrl) && (
                          <span className="font-mono text-slate-400">({extractInstagramShortcode(formExternalUrl)})</span>
                        )}
                      </div>
                      <a
                        href={formExternalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:text-amber-300 text-[11px] underline"
                      >
                        Open in Instagram ↗
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* 3. TITLE & DESCRIPTION */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Title / Caption <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Sri Sri Gaura Nitai Raj Bhog Aarti Darshan"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                {formErrors.title && (
                  <p className="text-[10px] text-rose-400 mt-1">{formErrors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description / Significance (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g. Divine morning darshan with fresh flower garlands and silk sringar..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* 4. CATEGORY & SUBCATEGORY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as MediaCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold cursor-pointer"
                  >
                    {MEDIA_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Subcategory / Tag
                  </label>
                  <input
                    type="text"
                    value={formSubcategory}
                    onChange={(e) => setFormSubcategory(e.target.value)}
                    placeholder="e.g. Gaura Nitai, Sandhya Aarti"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* 5. EVENT DATE & DISPLAY ORDER */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Event / Darshan Date
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={formEventDate}
                      onChange={(e) => setFormEventDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setFormEventDate(new Date().toISOString().slice(0, 10))}
                      className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold shrink-0"
                    >
                      Today
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Display Priority / Order (1 = Top)
                  </label>
                  <input
                    type="number"
                    value={formDisplayOrder}
                    onChange={(e) => setFormDisplayOrder(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* 6. STATUS TOGGLES */}
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsPublished}
                    onChange={(e) => setFormIsPublished(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Publish Immediately</div>
                    <div className="text-[10px] text-slate-400">Make visible on the public website right away</div>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-purple-500 rounded"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">★ Featured Spotlight</div>
                    <div className="text-[10px] text-slate-400">Highlight in homepage featured gallery</div>
                  </div>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving || (formMediaType === "IMAGE" && imageVerificationStatus === "invalid")}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingItemId ? "Update Media" : "Publish to Website"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX / FULL MEDIA PREVIEW MODAL */}
      {previewItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500 text-slate-950">
                  {previewItem.category}
                </span>
                <span className="text-white font-bold text-sm truncate max-w-xs sm:max-w-md">
                  {previewItem.title}
                </span>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Media Body */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
              {previewItem.mediaType === "YOUTUBE" && previewItem.youtubeVideoId ? (
                <iframe
                  className="w-full h-full"
                  src={getYouTubeEmbedUrl(previewItem.youtubeVideoId, true)}
                  title={previewItem.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <Image
                    src={previewItem.imageUrl}
                    alt=""
                    fill
                    className="object-cover blur-2xl scale-110 opacity-40 pointer-events-none"
                    unoptimized
                    aria-hidden="true"
                  />
                  <div className="relative w-full h-full p-2 flex items-center justify-center">
                    <Image
                      src={previewItem.imageUrl}
                      alt={previewItem.title}
                      fill
                      sizes="900px"
                      className="object-contain drop-shadow-2xl"
                      unoptimized
                    />
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <p className="text-slate-300">{previewItem.description || "No description provided."}</p>
                <div className="text-[11px] text-slate-500 font-mono mt-1">
                  Date: {previewItem.eventDate || "Recent"} • Priority: #{previewItem.displayOrder}
                </div>
              </div>

              {previewItem.externalUrl && (
                <a
                  href={previewItem.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 self-start sm:self-center"
                >
                  Open External Link ↗
                </a>
              )}
            </div>
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
              <h3 className="text-base font-bold text-white">Delete Media Item?</h3>
              <p className="text-xs text-slate-300 mt-2">
                Are you sure you want to permanently delete this media from the website:
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 mt-3 text-xs font-semibold text-amber-300 truncate">
                {deleteTarget.title} ({deleteTarget.category})
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                This item will be removed from the public website gallery.
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
                {isDeleting ? "Deleting..." : "Yes, Delete Media"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
