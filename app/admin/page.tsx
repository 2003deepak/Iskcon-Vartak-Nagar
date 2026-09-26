"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

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
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/stats");
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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Calendar Entries */}
        <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Vaishnava Calendar</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
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

        {/* Published & Total Events */}
        <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Total Program Events</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
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
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/calendar"
            className="flex items-center gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-800/50 transition group"
          >
            <div className="p-2.5 rounded-lg bg-amber-500/15 text-amber-400 group-hover:scale-105 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition">
                Add Calendar Entry
              </div>
              <div className="text-[11px] text-slate-400">
                Ekadashi, festivals, parana timings
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
                Add Upcoming Event
              </div>
              <div className="text-[11px] text-slate-400">
                Seminars, festivals & youth programs
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
                Preview Live Website
              </div>
              <div className="text-[11px] text-slate-400">
                Verify published public changes
              </div>
            </div>
          </Link>
        </div>
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
