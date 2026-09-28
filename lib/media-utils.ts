import { MediaCategory, MediaType } from "@/models/MediaItem";

export const MEDIA_CATEGORIES: { id: MediaCategory; label: string; icon: string; description: string }[] = [
  { id: "Darshan", label: "Darshan", icon: "🪷", description: "Daily divine deity darshan & sringar" },
  { id: "Festival", label: "Festival", icon: "🎪", description: "Grand festival celebrations & abhishekham" },
  { id: "Kirtan", label: "Kirtan", icon: "🎶", description: "Congregational sankirtan & maha aarti" },
  { id: "Yatra", label: "Yatra", icon: "🚩", description: "Yatra" },
  { id: "Community Seva", label: "Community Seva", icon: "🤝", description: "Seva" }
];

export const MEDIA_TYPES: { id: MediaType; label: string; icon: string }[] = [
  { id: "IMAGE", label: "Image", icon: "🖼️" },
  { id: "YOUTUBE", label: "YouTube Video", icon: "▶️" },
  { id: "INSTAGRAM_REEL", label: "Instagram Reel", icon: "📱" },
];

/**
 * Extracts YouTube Video ID from any standard, short, shorts, or embed URL
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url || typeof url !== "string") return null;

  const trimmed = url.trim();

  // Handle standard watch URLs: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  // Raw 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Generates YouTube Thumbnail URL
 */
export function getYouTubeThumbnail(videoId: string, quality: "hq" | "maxres" = "hq"): string {
  if (quality === "maxres") {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Generates YouTube Embed URL
 */
export function getYouTubeEmbedUrl(videoId: string, autoplay: boolean = true): string {
  return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1`;
}

/**
 * Validates Instagram Reel / Post URL
 */
export function isValidInstagramUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  return /^(https?:\/\/)?(www\.)?instagram\.com\/(reel|p|tv)\/[a-zA-Z0-9_-]+/i.test(trimmed);
}

/**
 * Extracts Instagram Reel/Post Shortcode
 */
export function extractInstagramShortcode(url: string): string | null {
  if (!url || typeof url !== "string") return null;
  const match = url.trim().match(/instagram\.com\/(?:reel|p|tv)\/([a-zA-Z0-9_-]+)/i);
  return match && match[1] ? match[1] : null;
}

/**
 * Validates whether string is a valid HTTP/HTTPS URL
 */
export function isValidHttpUrl(string: string): boolean {
  if (!string || typeof string !== "string") return false;
  const trimmed = string.trim();
  // Allow root-relative paths like /gaur_nitai.jpeg
  if (trimmed.startsWith("/") && trimmed.length > 1) return true;

  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
