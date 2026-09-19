"use client";

import ScrollReveal from "@/components/ScrollReveal";

export default function GallerySection() {
  return (
    <section className="w-full py-20 bg-[#faf7f2] border-b border-stone-200/60 text-slate-800" id="gallery">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-amber-800 uppercase mb-2">
                <span className="w-2 h-0.5 bg-amber-700"></span>
                <span>Devotional Gallery</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-slate-900 tracking-tight">
                Divine Moments Captured
              </h2>
            </div>
            <a
              className="text-xs font-semibold text-[#005ab4] hover:text-amber-800 uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
              href="#"
            >
              <span>View Full Media Archive</span>
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </a>
          </div>
        </ScrollReveal>

        {/* Video Container */}
        <ScrollReveal variant="scale-up" delay={150} duration={800} className="w-full flex justify-center">
          <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-stone-300 bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/OGSaFXdssdQ?si=_JZ6UQ-iNogrxD_E"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
