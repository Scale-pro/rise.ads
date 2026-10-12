import Image from "next/image";
import { heroBullets } from "@/lib/content";
import { images } from "@/lib/images";
import { site } from "@/lib/site";
import { WhatsAppButton } from "./WhatsAppButton";

export function Hero() {
  return (
    <section className="py-12 md:py-24 bg-gradient-to-b from-canvas-warm via-canvas to-canvas border-b border-canvas-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-champagne-soft border border-champagne-border text-navy text-xs font-semibold tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-champagne animate-pulse" aria-hidden="true" />
              Cirurgiã-dentista • {site.cro}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] leading-[1.18] font-extrabold text-navy tracking-tight">
              Harmonização orofacial com planejamento e{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-champagne via-champagne-light to-champagne-hover">
                naturalidade
              </span>
              , em Eunápolis
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Avaliação individualizada com a <strong className="text-navy font-semibold">{site.name}</strong> para
              realçar o que faz sentido para o seu rosto, com segurança biológica e sem exageros.
            </p>
            <ul className="space-y-3 pt-1 text-slate-700 text-sm sm:text-base">
              {heroBullets.map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <span
                    className="w-5 h-5 rounded-full bg-champagne/15 text-champagne-hover font-bold text-xs flex items-center justify-center flex-shrink-0 border border-champagne/30"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span className="font-medium">{b}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <WhatsAppButton
                iconClassName="w-6 h-6"
                className="btn-wa-pulse min-h-[54px] gap-3 text-base sm:text-lg px-8 py-4 rounded-2xl"
              >
                Agendar minha avaliação
              </WhatsAppButton>
              <span className="text-xs text-slate-500 font-medium">Resposta rápida pelo WhatsApp em horário comercial</span>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              <div className="bg-white rounded-3xl p-3 shadow-luxury border border-[#EAE5DC] overflow-hidden">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100">
                  <Image
                    src={images.hero}
                    alt={`${site.name} - Cirurgiã-Dentista ${site.cro}`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-[#EAE5DC] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="text-champagne text-base" aria-hidden="true">★★★★★</div>
                  <div className="text-left leading-tight">
                    <span className="text-xs font-bold text-navy block">4.7 no Google</span>
                    <span className="text-[10px] text-slate-500 font-medium">24 avaliações reais</span>
                  </div>
                </div>
                <a
                  href={site.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-navy bg-champagne-soft px-3 py-1.5 rounded-lg border border-champagne-border hover:bg-champagne hover:text-white transition-colors"
                >
                  Ver no Google
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
