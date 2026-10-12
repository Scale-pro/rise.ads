import { nav } from "@/lib/content";
import { site } from "@/lib/site";
import { WhatsAppButton } from "./WhatsAppButton";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-canvas-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <a href="#" className="flex flex-col text-left group" aria-label="Início">
          <span className="text-base sm:text-lg font-bold tracking-tight text-navy leading-tight group-hover:text-champagne-hover transition-colors">
            Dra. Katyucia <span className="text-slate-300 font-light">|</span> Clínica Jardins
          </span>
          <span className="text-[11px] text-slate-500 font-medium tracking-wider uppercase flex items-center gap-1.5 mt-0.5">
            {site.cro}
            <span className="text-champagne font-bold" aria-hidden="true">•</span>
            Harmonização Orofacial
          </span>
        </a>
        <nav aria-label="Seções" className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-600">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-champagne-hover transition-colors">
              {item.label}
            </a>
          ))}
        </nav>
        <WhatsAppButton className="text-xs sm:text-sm px-5 py-2.5 rounded-full">Agendar no WhatsApp</WhatsAppButton>
      </div>
    </header>
  );
}
