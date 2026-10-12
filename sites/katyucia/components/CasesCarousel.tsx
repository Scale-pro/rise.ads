"use client";

import Image from "next/image";
import { useRef } from "react";
import { cases } from "@/lib/content";
import { images } from "@/lib/images";

export function CasesCarousel() {
  const track = useRef<HTMLUListElement>(null);

  function scrollBy(direction: 1 | -1) {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: direction * 374, behavior: "smooth" });
  }

  const btn =
    "w-12 h-12 rounded-full border border-champagne-border bg-white hover:bg-champagne hover:text-white text-navy flex items-center justify-center shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-champagne";

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 justify-end">
        <button type="button" aria-label="Ver casos anteriores" className={btn} onClick={() => scrollBy(-1)}>
          <svg className="w-5 h-5 fill-current rotate-180" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </button>
        <button type="button" aria-label="Ver próximos casos" className={btn} onClick={() => scrollBy(1)}>
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </button>
      </div>
      <ul
        ref={track}
        className="hide-scrollbar flex gap-6 overflow-x-auto snap-x snap-mandatory py-3 -mx-4 px-4 sm:mx-0 sm:px-0"
        tabIndex={0}
        aria-label="Casos clínicos"
      >
        {cases.map((c) => (
          <li
            key={c.n}
            className={`snap-start flex-shrink-0 w-[310px] sm:w-[350px] bg-white rounded-3xl overflow-hidden shadow-luxury hover:-translate-y-1.5 transition-all duration-300 flex flex-col group ${
              c.featured ? "border-2 border-champagne/70" : "border border-[#EAE5DC] hover:border-champagne/80"
            }`}
          >
            <div className="relative aspect-square w-full overflow-hidden bg-slate-50 border-b border-[#F0EBE1]">
              <Image
                src={images[c.image]}
                alt={c.alt}
                fill
                sizes="350px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3.5 left-3.5 right-3.5 flex justify-between items-center pointer-events-none">
                <span className="bg-navy text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  Caso #{c.n}
                </span>
                <span className="bg-champagne-hover text-white text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full shadow-sm">
                  {c.tag}
                </span>
              </div>
            </div>
            <div className="p-5 text-left flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-champagne-hover uppercase tracking-widest block mb-1">{c.kind}</span>
                <h3 className="text-base font-bold text-navy leading-snug">{c.title}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{c.text}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">{c.meta}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
