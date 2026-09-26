"use client";

import React from "react";
import Image from "next/image";

export interface PreviewEventData {
  title: string;
  subtitle?: string;
  category: string;
  date: string;
  time: string;
  location: string;
  venue?: string;
  bannerUrl: string;
  description: string;
  highlights?: string[];
  schedule?: Array<{ time: string; title: string; description?: string }>;
  contactNumber?: string;
  rsvpLink?: string;
  isFeatured?: boolean;
  status?: string;
}

export default function EventPreviewModal({
  event,
  onClose,
}: {
  event: PreviewEventData | null;
  onClose: () => void;
}) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#faf7f2] text-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-amber-900/20">
        {/* Modal Top Chrome (Admin indicator bar) */}
        <div className="bg-[#0a1628] text-white px-5 py-3 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Live Website Preview Mode
            </span>
            {event.status && (
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-300">
                {event.status}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content Body (Styled exactly like public event presentation) */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-8 space-y-6">
          {/* Banner Image Hero Preview - supports both 16:9 landscape and 3:4 portrait flyers */}
          <div className="relative w-full min-h-[260px] sm:min-h-[360px] md:min-h-[420px] rounded-2xl overflow-hidden shadow-xl border border-amber-900/15 bg-slate-950 flex items-center justify-center">
            {event.bannerUrl ? (
              <>
                {/* Ambient Blurred Glow Backdrop */}
                <Image
                  src={event.bannerUrl}
                  alt=""
                  fill
                  className="object-cover blur-2xl scale-110 opacity-40 pointer-events-none"
                  unoptimized
                  aria-hidden="true"
                />
                {/* Full Uncropped Contained Poster / Banner */}
                <div className="relative w-full h-full min-h-[260px] sm:min-h-[360px] md:min-h-[420px] flex items-center justify-center p-2">
                  <Image
                    src={event.bannerUrl}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 896px"
                    className="object-contain drop-shadow-2xl"
                    unoptimized
                  />
                </div>
              </>
            ) : (
              <div className="w-full h-48 flex items-center justify-center text-slate-500 font-serif">
                No Banner Image Provided
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            {/* Badges on Banner */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md">
                {event.category || "Grand Festival"}
              </span>
              {event.isFeatured && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-600 text-white shadow-md">
                  ★ Featured on Homepage
                </span>
              )}
            </div>

            {event.bannerUrl && (
              <a
                href={event.bannerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-black/60 hover:bg-black/90 text-white text-[11px] font-medium backdrop-blur-xs border border-white/20 transition flex items-center gap-1.5"
                title="Open high resolution banner in new tab"
              >
                <span>🔍</span>
                <span>Full Poster</span>
              </a>
            )}

            <div className="absolute bottom-4 left-4 right-4 text-white z-10">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-md">
                {event.title}
              </h2>
              {event.subtitle && (
                <p className="text-xs sm:text-sm text-amber-200/90 font-light mt-1 drop-shadow-sm">
                  {event.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-amber-900/10 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-base shrink-0">
                📅
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Date</div>
                <div className="text-xs font-bold text-slate-800">{event.date || "Upcoming"}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-base shrink-0">
                ⏰
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Timing</div>
                <div className="text-xs font-bold text-slate-800">{event.time || "All Day"}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-base shrink-0">
                📍
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Location</div>
                <div className="text-xs font-bold text-slate-800 truncate" title={event.location}>
                  {event.venue || event.location || "Temple Hall"}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-slate-900">About the Program</h3>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-light">
              {event.description}
            </div>
          </div>

          {/* Highlights */}
          {event.highlights && event.highlights.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-serif text-base font-bold text-slate-900">Key Festival Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {event.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-slate-800"
                  >
                    <span className="text-amber-600 font-bold">✓</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule Timeline */}
          {event.schedule && event.schedule.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-serif text-base font-bold text-slate-900">Schedule &amp; Flow of Events</h3>
              <div className="divide-y divide-amber-900/10 bg-white rounded-xl border border-amber-900/10 overflow-hidden">
                {event.schedule.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-start gap-4">
                    <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-mono text-[11px] font-bold whitespace-nowrap shrink-0">
                      {item.time}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.title}</div>
                      {item.description && (
                        <div className="text-[11px] text-slate-600 mt-0.5">{item.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action Footer */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-amber-950">Free Admission &amp; Prasadam for All</div>
              <div className="text-[11px] text-amber-800">
                Inquiries: {event.contactNumber || "+91 93228 81265"}
              </div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-md">
              Support / Seva Donation
            </div>
          </div>
        </div>

        {/* Modal Close Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
