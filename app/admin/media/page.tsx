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
  imageUrl: string;
  images?: string[];
  externalUrl?: string;
  youtubeVideoId?: string;
  eventDate?: string;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StagedPhoto {
  id: string;
  previewUrl: string;
  file?: File;
  remoteUrl?: string;
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
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedFeatured, setSelectedFeatured] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("displayOrder");

  // Debounce search query changes to prevent API spamming on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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
  const [formImageUrl, setFormImageUrl] = useState<string>("");
  const [formImages, setFormImages] = useState<StagedPhoto[]>([]);
  const [manualUrlInput, setManualUrlInput] = useState<string>("");
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
  const [previewPhotoIndex, setPreviewPhotoIndex] = useState<number>(0);

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
      if (debouncedSearch.trim()) params.append("search", debouncedSearch.trim());
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
  }, [debouncedSearch, selectedType, selectedCategory, selectedStatus, selectedFeatured, selectedDate, sortBy]);

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

  // Close Modal and cleanup object URLs
  const handleCloseModal = () => {
    formImages.forEach((img) => {
      if (img.file && img.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(img.previewUrl);
      }
    });
    setFormImages([]);
    setIsFormModalOpen(false);
  };

  // Open Create Modal
  const handleOpenCreateModal = (initialCategory?: MediaCategory) => {
    // Revoke previous blob URLs
    formImages.forEach((img) => {
      if (img.file && img.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(img.previewUrl);
      }
    });

    setEditingItemId(null);
    setFormErrors({});
    setFileUploadError(null);
    setSelectedFile(null);

    setFormMediaType("IMAGE");
    setFormTitle("");
    setFormDescription("");
    setFormCategory(initialCategory || "Darshan");
    setFormImageUrl("");
    setFormImages([]);
    setManualUrlInput("");
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
    // Revoke previous blob URLs
    formImages.forEach((img) => {
      if (img.file && img.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(img.previewUrl);
      }
    });

    setEditingItemId(item._id);
    setFormErrors({});
    setFileUploadError(null);
    setSelectedFile(null);

    const initialUrls = Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : [item.imageUrl].filter(Boolean);

    const staged: StagedPhoto[] = initialUrls.map((url, i) => ({
      id: `existing-${item._id}-${i}-${url}`,
      previewUrl: url,
      remoteUrl: url,
    }));

    setFormMediaType(item.mediaType);
    setFormTitle(item.title);
    setFormDescription(item.description || "");
    setFormCategory(item.category);
    setFormImageUrl(item.imageUrl || (initialUrls[0] || ""));
    setFormImages(staged);
    setManualUrlInput("");
    setFormExternalUrl(item.externalUrl || "");
    setFormEventDate(item.eventDate || new Date().toISOString().slice(0, 10));
    setFormDisplayOrder(item.displayOrder ?? 0);
    setFormIsFeatured(item.isFeatured);
    setFormIsPublished(item.isPublished);

    if (item.imageUrl || initialUrls[0]) {
      verifyImage(item.imageUrl || initialUrls[0]);
    } else {
      setImageVerificationStatus("idle");
      setImageDimensions(null);
    }

    setIsFormModalOpen(true);
  };

  // Handle Multi-file Selection (Local Staging Only - Uploads to ImageKit only when clicking Publish)
  const handleMultipleFilesUpload = (files: FileList | File[]) => {
    const currentCount = formImages.length;
    const availableSlots = 10 - currentCount;
    if (availableSlots <= 0) {
      showToast("Maximum of 10 photos already reached.");
      return;
    }

    const fileArray = Array.from(files).slice(0, availableSlots);
    const newPhotos: StagedPhoto[] = fileArray.map((file) => ({
      id: `local-${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
      previewUrl: URL.createObjectURL(file),
      file,
    }));

    const updatedList = [...formImages, ...newPhotos].slice(0, 10);
    setFormImages(updatedList);
    if (!formImageUrl && updatedList.length > 0) {
      setFormImageUrl(updatedList[0].previewUrl);
    }
    showToast(`Added ${newPhotos.length} photo(s) to staging queue.`);
  };

  const handleAddManualUrl = () => {
    if (!manualUrlInput.trim()) return;
    if (formImages.length >= 10) {
      showToast("Maximum 10 photos allowed.");
      return;
    }
    const url = manualUrlInput.trim();
    if (!formImages.some((p) => p.remoteUrl === url || p.previewUrl === url)) {
      const newPhoto: StagedPhoto = {
        id: `url-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        previewUrl: url,
        remoteUrl: url,
      };
      const updated = [...formImages, newPhoto].slice(0, 10);
      setFormImages(updated);
      if (!formImageUrl) {
        setFormImageUrl(url);
      }
    }
    setManualUrlInput("");
  };

  const handleRemoveImage = (index: number) => {
    const target = formImages[index];
    if (target?.file && target.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(target.previewUrl);
    }
    const updated = formImages.filter((_, i) => i !== index);
    setFormImages(updated);
    if (updated.length > 0) {
      setFormImageUrl(updated[0].previewUrl);
    } else {
      setFormImageUrl("");
      setImageVerificationStatus("idle");
    }
  };

  const handleSetCoverImage = (index: number) => {
    if (index < 0 || index >= formImages.length) return;
    const coverItem = formImages[index];
    const reordered = [coverItem, ...formImages.filter((_, i) => i !== index)];
    setFormImages(reordered);
    setFormImageUrl(coverItem.previewUrl);
    showToast("Selected as primary cover photo.");
  };

  // Save Media (Create or Update) - Uploads staged files to storage on submit
  const handleSaveMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const errors: Record<string, string> = {};

    if (!formTitle.trim()) {
      errors.title = "Media title is required.";
    }

    if (formMediaType === "IMAGE") {
      if (formImages.length === 0) {
        errors.imageUrl = "At least one photo is required. Select photos or enter URL.";
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
      let finalImagesList: string[] = [];
      let finalCoverUrl = "";
      let extractedVideoId: string | undefined = undefined;

      if (formMediaType === "IMAGE") {
        // Upload staged local files to storage only now
        const localFilesToUpload = formImages.filter((p) => p.file);

        if (localFilesToUpload.length > 0) {
          const uploadFormData = new FormData();
          localFilesToUpload.forEach((p) => {
            if (p.file) uploadFormData.append("files", p.file);
          });
          uploadFormData.append("folder", "Media");

          const uploadRes = await adminFetch("/api/admin/upload", {
            method: "POST",
            body: uploadFormData,
          });

          const uploadData = await uploadRes.json();
          if (!uploadRes.ok || !uploadData.success) {
            throw new Error(uploadData.error || "Failed to upload staged photos to storage.");
          }

          const uploadedArray: any[] = Array.isArray(uploadData.images)
            ? uploadData.images
            : uploadData.image
            ? [uploadData.image]
            : [];
          let uploadIdx = 0;

          finalImagesList = formImages
            .map((p) => {
              if (p.file) {
                const uploadedItem = uploadedArray[uploadIdx++];
                const url = typeof uploadedItem === "string" ? uploadedItem : uploadedItem?.url || "";
                return url || p.remoteUrl || "";
              }
              return p.remoteUrl || p.previewUrl;
            })
            .filter((url) => url && !url.startsWith("blob:"));
        } else {
          finalImagesList = formImages
            .map((p) => p.remoteUrl || p.previewUrl)
            .filter((url) => url && !url.startsWith("blob:"));
        }

        finalCoverUrl = finalImagesList[0] || "";
      } else if (formMediaType === "YOUTUBE") {
        const vidId = extractYouTubeVideoId(formExternalUrl);
        if (vidId) {
          extractedVideoId = vidId;
          finalCoverUrl = getYouTubeThumbnail(vidId, "maxres");
        }
      } else if (formMediaType === "INSTAGRAM_REEL") {
        finalCoverUrl = "/hero_bg.jpeg";
      }

      const payload = {
        title: formTitle.trim(),
        description: formDescription.trim(),
        mediaType: formMediaType,
        category: formCategory,
        imageUrl: finalCoverUrl,
        images: finalImagesList.slice(0, 10),
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
        // Clean up blob URLs
        formImages.forEach((img) => {
          if (img.file && img.previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(img.previewUrl);
          }
        });

        setIsFormModalOpen(false);
        showToast(
          editingItemId
            ? `Successfully updated "${formTitle}".`
            : `✓ Media published successfully with ${finalImagesList.length || 1} photo(s)!`
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
            Manage deity darshan images, YouTube kirtans, and Instagram reels. Paste any image URL with instant preview or upload daily darshan.
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
      ) : (
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

                      {Array.isArray(item.images) && item.images.length > 1 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/90 text-slate-950 shadow-md">
                          📷 {item.images.length} Photos
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
                      onClick={() => {
                        setPreviewItem(item);
                        setPreviewPhotoIndex(0);
                      }}
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
                onClick={handleCloseModal}
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

              {/* 2. DYNAMIC PHOTO ALBUM UPLOAD (UP TO 10 PHOTOS) */}
              {formMediaType === "IMAGE" && (
                <div className="space-y-3.5 p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-semibold text-slate-200">
                        Photos in Album / Set <span className="text-amber-400">*</span>
                      </label>
                      <p className="text-[11px] text-slate-400">
                        Select up to 10 photos. Photos will only be uploaded to ImageKit when you click &quot;Publish to Website&quot;.
                      </p>
                    </div>

                  </div>

                  {/* Multi-File Upload & URL Entry Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                    {/* Choose Local Files Button (Select up to 10) */}
                    <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer transition shadow-md shrink-0">
                      <span>📁 Select Local Photos (Up to 10)</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files) handleMultipleFilesUpload(e.target.files);
                          e.target.value = "";
                        }}
                        className="hidden"
                      />
                    </label>

                    {/* Or Manual URL Add */}
                    <div className="flex flex-1 items-center gap-1.5">
                      <input
                        type="url"
                        value={manualUrlInput}
                        onChange={(e) => setManualUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddManualUrl();
                          }
                        }}
                        placeholder="Paste image URL..."
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddManualUrl}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition shrink-0"
                      >
                        + Add URL
                      </button>
                    </div>
                  </div>

                  {fileUploadError && (
                    <div className="p-2.5 bg-rose-950/40 border border-rose-500/40 rounded-xl text-[11px] text-rose-300">
                      {fileUploadError}
                    </div>
                  )}

                  {formErrors.imageUrl && (
                    <p className="text-[10px] text-rose-400 font-medium">{formErrors.imageUrl}</p>
                  )}

                  {/* Thumbnail Gallery List */}
                  {formImages.length > 0 ? (
                    <div className="space-y-2 pt-2">
                      <div className="text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Selected Photos (Click any to set as primary cover):</span>
                        <span className="text-[10px] text-amber-400">★ Photo #1 is Cover</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 max-h-56 overflow-y-auto pr-1">
                        {formImages.map((photo, idx) => {
                          const isCover = idx === 0;
                          return (
                            <div
                              key={photo.id}
                              className={`group relative aspect-square rounded-xl overflow-hidden bg-slate-900 border-2 transition ${isCover ? "border-amber-500 shadow-md shadow-amber-500/20" : "border-slate-800 hover:border-slate-600"
                                }`}
                            >
                              <Image
                                src={photo.previewUrl}
                                alt={`Photo ${idx + 1}`}
                                fill
                                unoptimized
                                className="object-cover"
                              />

                              {/* Top Badge: Cover or Index */}
                              <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-1">
                                {isCover ? (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-slate-950 shadow">
                                    ★ Cover
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/75 text-slate-300">
                                    #{idx + 1}
                                  </span>
                                )}
                              </div>

                              {/* Top-Right Cross (✕) Remove Button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImage(idx);
                                }}
                                className="absolute top-1.5 right-1.5 z-20 w-5 h-5 rounded-full bg-slate-950/80 hover:bg-rose-600 border border-slate-700/60 hover:border-rose-500 text-slate-300 hover:text-white flex items-center justify-center text-[10px] font-bold transition shadow-md cursor-pointer"
                                title="Remove this photo"
                              >
                                ✕
                              </button>

                              {/* Hover Action to Set Cover */}
                              {!isCover && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center p-1 pointer-events-none">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSetCoverImage(idx);
                                    }}
                                    className="pointer-events-auto px-2 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold transition cursor-pointer shadow-lg"
                                  >
                                    ★ Set Cover
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 border-2 border-dashed border-slate-800 rounded-xl text-center space-y-1">
                      <div className="text-2xl">🖼️</div>
                      <div className="text-xs font-semibold text-slate-300">No photos selected yet</div>
                      <div className="text-[11px] text-slate-500">
                        Select up to 10 photos. They will only be uploaded when you click &quot;Publish to Website&quot;.
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
                  onClick={handleCloseModal}
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
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Uploading & Publishing...</span>
                    </>
                  ) : (
                    <span>{editingItemId ? "Update Media" : "Publish to Website"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div >
      )
      }

      {/* LIGHTBOX / FULL MEDIA PREVIEW MODAL */}
      {
        previewItem && (
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
                  {(() => {
                    const photos = Array.isArray(previewItem.images) && previewItem.images.length > 0 ? previewItem.images : [previewItem.imageUrl].filter(Boolean);
                    if (photos.length > 1) {
                      return (
                        <span className="text-xs text-amber-300 font-mono bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                          Photo {previewPhotoIndex + 1} of {photos.length}
                        </span>
                      );
                    }
                    return null;
                  })()}
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
                ) : (() => {
                  const photos = Array.isArray(previewItem.images) && previewItem.images.length > 0 ? previewItem.images : [previewItem.imageUrl].filter(Boolean);
                  const currentPhotoUrl = photos[previewPhotoIndex] || previewItem.imageUrl;
                  return (
                    <>
                      <Image
                        src={currentPhotoUrl}
                        alt=""
                        fill
                        className="object-cover blur-2xl scale-110 opacity-40 pointer-events-none"
                        unoptimized
                        aria-hidden="true"
                      />
                      <div className="relative w-full h-full p-2 flex items-center justify-center">
                        <Image
                          src={currentPhotoUrl}
                          alt={previewItem.title}
                          fill
                          sizes="900px"
                          className="object-contain drop-shadow-2xl transition-opacity duration-300"
                          unoptimized
                        />
                      </div>

                      {/* Slider Navigation Arrows */}
                      {photos.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
                            }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-black/90 hover:scale-105 text-white border border-white/20 flex items-center justify-center text-xl transition-all cursor-pointer shadow-xl z-20"
                            title="Previous Photo (←)"
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-black/90 hover:scale-105 text-white border border-white/20 flex items-center justify-center text-xl transition-all cursor-pointer shadow-xl z-20"
                            title="Next Photo (→)"
                          >
                            ›
                          </button>
                        </>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Multi-photo thumbnail bar in admin preview */}
              {(() => {
                const photos = Array.isArray(previewItem.images) && previewItem.images.length > 0 ? previewItem.images : [previewItem.imageUrl].filter(Boolean);
                if (photos.length <= 1) return null;
                return (
                  <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {photos.map((pUrl, pIdx) => {
                      const isSelected = pIdx === previewPhotoIndex;
                      return (
                        <button
                          key={pUrl + pIdx}
                          type="button"
                          onClick={() => setPreviewPhotoIndex(pIdx)}
                          className={`relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                            isSelected ? "border-amber-400 scale-105 shadow-md shadow-amber-400/30" : "border-slate-800 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <Image src={pUrl} alt={`Photo ${pIdx + 1}`} fill unoptimized className="object-cover" />
                        </button>
                      );
                    })}
                  </div>
                );
              })()}

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
        )
      }

      {/* DELETE CONFIRMATION MODAL */}
      {
        deleteTarget && (
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
        )
      }
    </div >
  );
}
