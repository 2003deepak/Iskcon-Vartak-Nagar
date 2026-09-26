"use client";

import React from "react";
import Link from "next/link";

export default function AdminMediaPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">
            Media &amp; Assets Module
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Centralized storage for festival banners, darshan photos, and event flyers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 text-center max-w-2xl mx-auto shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4 text-2xl">
          🖼️
        </div>
        <h2 className="text-lg font-semibold text-slate-100 mb-2">
          Media Architecture Ready
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto mb-6">
          Next.js remote image patterns (ImageKit, Unsplash, Google) are preconfigured in <code>next.config.ts</code>. Direct file upload integrations will be wired in Phase 2.
        </p>

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs transition"
        >
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
