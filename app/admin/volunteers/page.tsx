"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-fetch";

interface VolunteerApplication {
  _id: string;
  applicationNumber: string;
  fullName: string;
  phone: string;
  email?: string;
  sevaInterest: string;
  preferredContactMethod: "WhatsApp" | "Phone Call" | "Email";
  availability?: string;
  adminNotes?: string;
  submittedAt: string;
  updatedAt: string;
}

const SEVA_DEPARTMENTS = [
  "ALL",
  "Prasadam Distribution",
  "Festival Organization",
  "Vedic Book Distribution",
  "Photography & Media",
  "Deity Flower Garlands",
  "Sunday Feast",
];

export default function AdminVolunteersPage() {
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Search & Filter State with Debouncing
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [selectedSeva, setSelectedSeva] = useState("ALL");

  // Modal State
  const [selectedApp, setSelectedApp] = useState<VolunteerApplication | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Debounce search query (700ms)
  useEffect(() => {
    setIsDebouncing(true);
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setIsDebouncing(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const fetchVolunteers = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const params = new URLSearchParams();
      if (debouncedSearch.trim()) params.append("search", debouncedSearch.trim());
      if (selectedSeva !== "ALL") params.append("seva", selectedSeva);

      const res = await adminFetch(`/api/admin/volunteers?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to retrieve volunteer records.");
      }

      const data = await res.json();
      if (data.success) {
        setApplications(data.applications || []);
        setTotalCount(data.totalCount || 0);
      } else {
        setErrorMsg(data.error || "Could not load volunteer records.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to connect to volunteer database.");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedSeva]);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  // Derived Metrics
  const metrics = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayCount = applications.filter(
      (a) => a.submittedAt && a.submittedAt.startsWith(today)
    ).length;

    const prasadamCount = applications.filter((a) =>
      a.sevaInterest?.toLowerCase().includes("prasadam")
    ).length;

    const festivalCount = applications.filter((a) =>
      a.sevaInterest?.toLowerCase().includes("festival")
    ).length;

    return {
      total: totalCount || applications.length,
      today: todayCount,
      prasadam: prasadamCount,
      festivals: festivalCount,
    };
  }, [applications, totalCount]);

  const openNotesModal = (app: VolunteerApplication) => {
    setSelectedApp(app);
    setEditNotes(app.adminNotes || "");
  };

  const handleSaveNotes = async () => {
    if (!selectedApp) return;

    try {
      setIsSaving(true);
      const res = await adminFetch(`/api/admin/volunteers/${selectedApp._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes: editNotes }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Internal notes updated successfully.");
        setSelectedApp(null);
        fetchVolunteers();
      } else {
        showToast(data.error || "Failed to update notes.");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to save notes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove the volunteer inquiry from ${name}?`)) {
      return;
    }

    try {
      const res = await adminFetch(`/api/admin/volunteers/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Volunteer application removed.");
        if (selectedApp?._id === id) setSelectedApp(null);
        fetchVolunteers();
      }
    } catch {
      showToast("Failed to delete application.");
    }
  };

  // Build formatted WhatsApp link
  const getWhatsAppLink = (app: VolunteerApplication) => {
    const cleanPhone = app.phone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const message = encodeURIComponent(
      `Hare Krishna ${app.fullName} 🙏\n\nThank you for reaching out to volunteer with ISKCON Vartak Nagar.\nYou had expressed interest in: *${app.sevaInterest}* (Ref: ${app.applicationNumber}).\n\nWe would love to connect and share more about upcoming seva opportunities with you.\n\nHare Krishna! 🙏`
    );
    return `https://wa.me/${formattedPhone}?text=${message}`;
  };

  // Helper to format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-amber-500 text-slate-950 px-5 py-3 rounded-xl font-semibold shadow-2xl flex items-center gap-2 animate-fadeIn">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-3">
          <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider text-amber-300 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Devotee Registry</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Volunteer Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
            Manage incoming seva inquiries, communicate via WhatsApp, and record devotee follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchVolunteers()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-200 border border-slate-800 hover:border-slate-700 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            title="Refresh list"
          >
            <svg
              className={`w-4 h-4 text-slate-300 ${isLoading ? "animate-spin text-amber-400" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inquiries */}
        <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Total Inquiries</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {isLoading ? "..." : metrics.total}
          </div>
          <div className="text-[11px] text-amber-300/80 mt-1">
            <span>All-time website submissions</span>
          </div>
        </div>

        {/* Today's Inquiries */}
        <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Received Today</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {isLoading ? "..." : metrics.today}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Recent inquiries</span>
          </div>
        </div>

        {/* Prasadam Department */}
        <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Prasadam Seva</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {isLoading ? "..." : metrics.prasadam}
          </div>
          <div className="text-[11px] text-blue-400/80 mt-1">
            <span>Food for Life &amp; Annadanam</span>
          </div>
        </div>

        {/* Festivals & Media */}
        <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Festival &amp; Events</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {isLoading ? "..." : metrics.festivals}
          </div>
          <div className="text-[11px] text-purple-400/80 mt-1">
            <span>Stage, setup &amp; reception</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input with Debounce Indicator */}
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 flex items-center">
            {isDebouncing ? (
              <svg className="w-4 h-4 text-amber-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by volunteer name, phone, email, or application ID..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/60 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
              title="Clear search"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Seva Department Dropdown Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedSeva}
            onChange={(e) => setSelectedSeva(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-300 focus:outline-none focus:border-amber-400/60 transition cursor-pointer"
          >
            {SEVA_DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept === "ALL" ? "All Departments" : dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications Table View */}
      <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800/80">
              <tr>
                <th className="px-5 py-4 font-semibold">Ref ID &amp; Date</th>
                <th className="px-5 py-4 font-semibold">Volunteer Details</th>
                <th className="px-5 py-4 font-semibold">Phone / WhatsApp</th>
                <th className="px-5 py-4 font-semibold">Preferred Seva</th>
                <th className="px-5 py-4 font-semibold text-right">Connect &amp; Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-slate-400">
                    <div className="inline-flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-medium">Loading volunteer inquiries...</span>
                    </div>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-slate-400">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800/60 text-slate-500 border border-slate-700/60 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-slate-300">No volunteer applications found</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {searchQuery || selectedSeva !== "ALL"
                        ? "Try clearing your search query or department filter."
                        : "Submissions from the public website will appear here automatically."}
                    </p>
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr
                    key={app._id}
                    className="hover:bg-slate-800/35 transition-colors group"
                  >
                    {/* Application ID & Date */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-amber-300">
                          {app.applicationNumber}
                        </span>
                        <button
                          onClick={() => handleCopy(app.applicationNumber, `id-${app._id}`)}
                          className="text-slate-500 hover:text-amber-300 transition"
                          title="Copy Application Number"
                        >
                          {copiedId === `id-${app._id}` ? (
                            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <span className="text-[11px] text-slate-500 font-light block mt-0.5">
                        {formatDate(app.submittedAt)}
                      </span>
                    </td>

                    {/* Volunteer Name & Details */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold text-xs flex items-center justify-center shrink-0">
                          {app.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-slate-100">{app.fullName}</div>
                          {app.email ? (
                            <div className="text-[11px] text-slate-400 font-light truncate max-w-xs">{app.email}</div>
                          ) : (
                            <div className="text-[11px] text-slate-600 font-light">No email</div>
                          )}
                        </div>
                      </div>
                      {app.adminNotes && (
                        <div className="text-[11px] text-amber-300/80 font-light mt-1.5 truncate max-w-sm flex items-center gap-1.5 pl-11">
                          <svg className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="truncate">{app.adminNotes}</span>
                        </div>
                      )}
                    </td>

                    {/* Phone / Contact */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-200">{app.phone}</span>
                        <button
                          onClick={() => handleCopy(app.phone, `phone-${app._id}`)}
                          className="text-slate-500 hover:text-amber-300 transition"
                          title="Copy Phone Number"
                        >
                          {copiedId === `phone-${app._id}` ? (
                            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/80 text-slate-400 mt-1 inline-block">
                        {app.preferredContactMethod || "WhatsApp"}
                      </span>
                    </td>

                    {/* Preferred Seva */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-400/20 text-xs font-medium">
                        {app.sevaInterest}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* WhatsApp Link */}
                        <a
                          href={getWhatsAppLink(app)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition active:scale-95"
                          title="Open WhatsApp chat with greeting"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>WhatsApp</span>
                        </a>

                        {/* Call Link */}
                        <a
                          href={`tel:${app.phone}`}
                          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition active:scale-95"
                          title="Call volunteer"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </a>

                        {/* Notes / Details Button */}
                        <button
                          onClick={() => openNotesModal(app)}
                          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition active:scale-95 cursor-pointer"
                          title="View details & edit notes"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(app._id, app.fullName)}
                          className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition active:scale-95 cursor-pointer"
                          title="Delete inquiry"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details & Notes Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c1322] border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-fadeIn">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div>
                <span className="font-mono text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                  {selectedApp.applicationNumber}
                </span>
                <h3 className="font-serif text-xl text-white font-normal mt-0.5">
                  Volunteer: {selectedApp.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Applicant Info Summary Box */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Phone / WhatsApp</span>
                  <span className="font-mono text-slate-200 text-sm font-semibold">{selectedApp.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Email</span>
                  <span className="text-slate-200 truncate block">{selectedApp.email || "Not provided"}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Preferred Seva</span>
                  <span className="text-amber-300 font-medium">{selectedApp.sevaInterest}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Submission Date</span>
                  <span className="text-slate-300">{formatDate(selectedApp.submittedAt)}</span>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold">
                  Internal Devotee Notes (Optional)
                </label>
                <textarea
                  rows={4}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Record conversation details, seva availability, skills, or timings..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 leading-relaxed transition"
                />
              </div>

              {/* Direct Outreach Bar */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400 font-medium">Outreach:</span>
                <div className="flex items-center gap-2">
                  <a
                    href={getWhatsAppLink(selectedApp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition"
                  >
                    <span>💬 WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${selectedApp.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 border border-sky-500/30 text-xs font-semibold transition"
                  >
                    <span>📞 Call</span>
                  </a>
                  {selectedApp.email && (
                    <a
                      href={`mailto:${selectedApp.email}?subject=${encodeURIComponent(
                        `Volunteer Seva at ISKCON Vartak Nagar [${selectedApp.applicationNumber}]`
                      )}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-400 border border-purple-500/30 text-xs font-semibold transition"
                    >
                      <span>✉ Email</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-300 border border-slate-800 transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-[#dfb260] hover:bg-[#cca04b] text-[#060e1b] text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
