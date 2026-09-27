"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { adminFetch } from "@/lib/admin-fetch";

interface DashboardStats {
  currentYear: number;
  metrics: {
    totalCalendarEntries: number;
    currentYearCalendarEntries: number;
    upcomingEvents: number;
    ongoingEvents: number;
    pastEvents: number;
    featuredEvents: number;
    totalProgramEvents: number;
    totalAdmins: number;
    totalMedia?: number;
    publishedMedia?: number;
    featuredMedia?: number;
    imageCount?: number;
    videoCount?: number;
  };
  recentEvents: Array<{
    _id: string;
    title: string;
    category: string;
    date: string;
    status?: string;
    isFeatured?: boolean;
  }>;
  upcomingFestivals: Array<{
    _id: string;
    title: string;
    dateString: string;
    isFast?: boolean;
  }>;
  recentMedia?: Array<{
    _id: string;
    title: string;
    mediaType: "IMAGE" | "YOUTUBE" | "INSTAGRAM_REEL";
    category: string;
    subcategory?: string;
    imageUrl?: string;
    youtubeVideoId?: string;
    isFeatured?: boolean;
    isPublished?: boolean;
    createdAt?: string;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await adminFetch("/api/admin/stats");
        if (!res.ok) {
          throw new Error("Failed to load dashboard statistics");
        }
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        } else {
          setError(data.error || "Could not retrieve statistics");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard metrics");
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-3">
          <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Media & Daily Darshan */}
        <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 hover:border-slate-700 transition relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Media & Darshan</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <span className="material-symbols-outlined text-base">perm_media</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {isLoading ? "..." : stats?.metrics.totalMedia ?? 0}
          </div>
          <div className="text-[11px] text-amber-300/80 mt-1 flex items-center justify-between">
            <span>{stats?.metrics.imageCount ?? 0} Photos &bull; {stats?.metrics.videoCount ?? 0} Videos</span>
            <span className="text-emerald-400">{stats?.metrics.publishedMedia ?? 0} Live</span>
          </div>
        </div>

        {/* Total Calendar Entries */}
        <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Vaishnava Calendar</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {isLoading ? "..." : stats?.metrics.totalCalendarEntries ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span>{stats?.metrics.currentYearCalendarEntries ?? 0} entries for {stats?.currentYear || new Date().getFullYear()}</span>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Upcoming Events</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {isLoading ? "..." : stats?.metrics.upcomingEvents ?? 0}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Active on public website</span>
          </div>
        </div>

        {/* Total Program Events */}
        <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Total Programs</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {isLoading ? "..." : stats?.metrics.totalProgramEvents ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span>{stats?.metrics.featuredEvents ?? 0} featured on homepage</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">
          Quick Management Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/media"
            className="flex items-center gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-800/50 transition group"
          >
            <div className="p-2.5 rounded-lg bg-amber-500/15 text-amber-400 group-hover:scale-105 transition">
              <span className="material-symbols-outlined text-lg">add_photo_alternate</span>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition">
                + Add Media / Darshan
              </div>
              <div className="text-[11px] text-slate-400">
                URL preview, YouTube & Reels
              </div>
            </div>
          </Link>

          <Link
            href="/admin/events"
            className="flex items-center gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-800/50 transition group"
          >
            <div className="p-2.5 rounded-lg bg-amber-500/15 text-amber-400 group-hover:scale-105 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition">
                Add Program Event
              </div>
              <div className="text-[11px] text-slate-400">
                Seminars, festivals & youth programs
              </div>
            </div>
          </Link>

          <Link
            href="/admin/calendar"
            className="flex items-center gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-800/50 transition group"
          >
            <div className="p-2.5 rounded-lg bg-purple-500/15 text-purple-400 group-hover:scale-105 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition">
                Add Calendar Entry
              </div>
              <div className="text-[11px] text-slate-400">
                Ekadashi & parana timings
              </div>
            </div>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 transition group"
          >
            <div className="p-2.5 rounded-lg bg-slate-800 text-slate-300 group-hover:scale-105 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200 group-hover:text-white transition">
                Live Website
              </div>
              <div className="text-[11px] text-slate-400">
                Verify published gallery & pages
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Media & Darshan Showcase */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Recent Media & Daily Darshan
            </h2>
            <p className="text-[11px] text-slate-400">
              Manage website images, darshan photos, YouTube & Instagram media
            </p>
          </div>
          <Link
            href="/admin/media"
            className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
          >
            <span>Open Media Manager</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-slate-500">Loading recent media...</div>
        ) : !stats?.recentMedia || stats.recentMedia.length === 0 ? (
          <div className="py-8 text-center bg-slate-950/40 rounded-xl border border-dashed border-slate-800 p-6">
            <span className="material-symbols-outlined text-3xl text-slate-600 mb-1">add_photo_alternate</span>
            <p className="text-xs text-slate-400">No media uploaded yet.</p>
            <Link
              href="/admin/media"
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-medium hover:bg-amber-500/30 transition"
            >
              + Add First Media / Darshan
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.recentMedia.map((m) => {
              const thumbUrl = m.imageUrl || (m.youtubeVideoId ? `https://img.youtube.com/vi/${m.youtubeVideoId}/hqdefault.jpg` : "/gaur_nitai.jpeg");
              return (
                <Link
                  key={m._id}
                  href="/admin/media"
                  className="group relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition flex flex-col"
                >
                  <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={thumbUrl}
                      alt={m.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1 left-1">
                      <span className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] font-semibold text-white uppercase">
                        {m.mediaType === "YOUTUBE" ? "YT" : m.mediaType === "INSTAGRAM_REEL" ? "Reel" : "IMG"}
                      </span>
                    </div>
                    {m.isFeatured && (
                      <div className="absolute top-1 right-1">
                        <span className="material-symbols-outlined text-amber-400 text-xs drop-shadow-md">star</span>
                      </div>
                    )}
                  </div>
                  <div className="p-2 flex-1 flex flex-col justify-between">
                    <div className="text-[11px] font-medium text-slate-200 line-clamp-1 group-hover:text-amber-300 transition">
                      {m.title}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-between mt-1">
                      <span>{m.category}</span>
                      <span className={m.isPublished ? "text-emerald-400" : "text-amber-500"}>
                        {m.isPublished ? "Live" : "Draft"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Two Column Layout: Recent Program Events & Upcoming Festivals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Recent Program Events
            </h2>
            <Link href="/admin/events" className="text-xs text-amber-400 hover:underline">
              View all
            </Link>
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-xs text-slate-500">Loading events...</div>
          ) : !stats?.recentEvents || stats.recentEvents.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">No program events recorded yet.</div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {stats.recentEvents.map((evt) => (
                <div key={evt._id} className="py-3 flex items-center justify-between">
                  <div className="pr-4">
                    <div className="text-xs font-medium text-slate-200">{evt.title}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="text-amber-400/90">{evt.category}</span>
                      <span>&bull;</span>
                      <span>{evt.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {evt.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-medium">
                        Featured
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-medium capitalize">
                      {evt.status || "upcoming"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Festivals / Calendar Preview */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Vaishnava Calendar Preview
            </h2>
            <Link href="/admin/calendar" className="text-xs text-amber-400 hover:underline">
              View all
            </Link>
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-xs text-slate-500">Loading calendar...</div>
          ) : !stats?.upcomingFestivals || stats.upcomingFestivals.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">No calendar entries recorded yet.</div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {stats.upcomingFestivals.map((cal) => (
                <div key={cal._id} className="py-3 flex items-center justify-between">
                  <div className="pr-4">
                    <div className="text-xs font-medium text-slate-200">{cal.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{cal.dateString}</div>
                  </div>
                  {cal.isFast && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-semibold shrink-0">
                      Fasting Day
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
