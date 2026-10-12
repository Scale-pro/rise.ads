import Image from "next/image";
import { credentials, facts, faq, locations, procedures, situations, steps } from "@/lib/content";
import { images } from "@/lib/images";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import { CasesCarousel } from "./CasesCarousel";
import { Eyebrow } from "./Eyebrow";
import { WhatsAppButton } from "./WhatsAppButton";

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight leading-tight">{title}</h2>
      <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">{text}</p>
    </div>
  );
}

export function Cases() {
  return (
    <section id="transformacoes" className="py-20 md:py-28 bg-canvas-warm border-b border-[#EAE5DC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-4">
          <Eyebrow>Resultados reais & transformações naturais</Eyebrow>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-navy tracking-tight leading-tight">
            Transformações Antes & Depois
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            Planejamento anatômico individualizado com foco em simetria, sustentação e extrema naturalidade.
          </p>
        </div>
        <CasesCarousel />
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 bg-white border border-[#EAE5DC] rounded-2xl shadow-sm">
          <p className="text-xs text-slate-600 leading-relaxed text-center sm:text-left max-w-3xl">
            <strong className="text-navy font-semibold">* Nota Ética CFO:</strong> As transformações exibidas refletem
            estudos clínicos autorizados e cada paciente possui resposta anatômica individual. O planejamento seguro exige
            avaliação prévia presencial.
          </p>
          <WhatsAppButton
            message="Olá Dra. Katyucia! Vi os estudos clínicos de antes e depois e gostaria de uma avaliação facial personalizada."
            className="whitespace-nowrap text-xs sm:text-sm px-6 py-3 rounded-xl flex-shrink-0"
          >
            Avaliar o meu caso no WhatsApp
          </WhatsAppButton>
        </div>
      </div>
    </section>
  );
}

export function Facts() {
  return (
    <section className="py-10 bg-white border-b border-canvas-border">
      <dl className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {facts.map((f) => (
          <div key={f.value} className="flex flex-col-reverse">
            <dd className="text-xs text-slate-500 font-medium mt-1">{f.label}</dd>
            <dt className="text-xl sm:text-2xl font-extrabold text-navy">{f.value}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ForWhom() {
  return (
    <section id="para-quem-e" className="py-20 md:py-28 bg-canvas border-b border-canvas-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Autoavaliação Facial"
          title="Você se identifica com alguma destas situações?"
          text="Sinais comuns de que seu rosto e feições merecem uma conversa clínica atenta e planejada."
        />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {situations.map((s, i) => (
            <li key={s.title} className="bg-white rounded-2xl border border-[#EFE8DC] p-6 shadow-luxury flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-full bg-champagne-muted text-champagne-hover font-bold flex items-center justify-center mb-4">
                  {i + 1}
                </div>
                <h3 className="font-bold text-navy mb-2">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{s.text}</p>
              </div>
              <span className="mt-5 pt-3 border-t border-slate-100 text-[11px] font-bold uppercase tracking-wider text-champagne-hover">
                {s.chip}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Procedures() {
  return (
    <section id="procedimentos" className="py-20 md:py-28 bg-canvas-alt border-b border-canvas-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Procedimentos Avaliados"
          title="O que podemos avaliar para você"
          text="A indicação depende exclusivamente de avaliação presencial e do mapeamento anatômico de cada paciente."
        />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {procedures.map((p) => (
            <li key={p.title} className="bg-white rounded-2xl border border-[#EFE8DC] p-6 shadow-luxury flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-navy mb-2">{p.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{p.text}</p>
              </div>
              <a
                href={whatsappLink(p.message)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 text-xs font-bold text-navy hover:text-champagne-hover transition-colors"
              >
                Saber se é indicado para mim <span aria-hidden="true">▸</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Evaluation() {
  return (
    <section id="como-e-avaliacao" className="py-20 md:py-28 bg-canvas border-b border-canvas-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Atendimento Humanizado"
          title="Como é a sua avaliação"
          text="Um processo estruturado com calma, transparência e respeito total à individualidade de cada paciente."
        />
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <li key={s.n} className="bg-white rounded-3xl overflow-hidden border border-[#EAE5DC] shadow-luxury flex flex-col">
              <div className="relative aspect-[4/3]">
                <Image src={images[s.image]} alt={s.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                <span className="absolute top-3.5 left-3.5 bg-navy text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
                  Passo {s.n}
                </span>
              </div>
              <div className="p-6">
                <span className="text-[10px] font-bold text-champagne-hover uppercase tracking-widest block mb-1">{s.kind}</span>
                <h3 className="text-lg font-bold text-navy mb-2">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="dra-katyucia" className="py-20 md:py-28 bg-canvas-warm border-b border-canvas-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-luxury border border-[#EAE5DC] max-w-md mx-auto">
            <Image src={images.step2} alt={site.name} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-navy-dark/90 to-transparent text-white">
              <p className="font-bold">{site.name}</p>
              <p className="text-xs opacity-90">Cirurgiã-Dentista • {site.cro}</p>
              <p className="text-xs opacity-90">Clínica Jardins — Eunápolis / BA</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <Eyebrow>Profissional Responsável</Eyebrow>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy tracking-tight leading-tight mb-6">
            “Cada rosto pede um plano diferente. Meu critério é proporção e naturalidade.”
          </h2>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              Com formação sólida em Odontologia pela <strong className="text-navy">Universidade Estadual de Feira de Santana (UEFS, 2000)</strong>, a{" "}
              <strong className="text-navy">{site.name} ({site.cro})</strong> atua há mais de duas décadas promovendo saúde e estética integrada.
            </p>
            <p>
              À frente da <strong className="text-navy">Clínica Jardins desde 2011</strong>, em Eunápolis, seu trabalho em harmonização orofacial une
              domínio anatômico rigoroso à busca permanente pela sutileza estética.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-4 mt-8">
            {credentials.map((c) => (
              <div key={c.value} className="bg-white rounded-2xl border border-[#EAE5DC] p-4 flex flex-col-reverse">
                <dd className="text-[11px] text-slate-500 font-medium">{c.label}</dd>
                <dt className="text-lg font-extrabold text-navy">{c.value}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="py-20 md:py-28 bg-canvas border-b border-canvas-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Tire Suas Dúvidas"
          title="Perguntas Frequentes"
          text="Respostas claras sobre segurança, valores, conforto e agendamento."
        />
        <div className="space-y-4">
          {faq.map((item) => (
            <details key={item.q} className="group bg-white rounded-2xl border border-[#EAE5DB] shadow-sm open:shadow-luxury">
              <summary className="flex items-center justify-between gap-4 cursor-pointer p-5 text-left text-[15px] font-medium text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-champagne rounded-2xl">
                {item.q}
                <svg className="faq-chevron w-5 h-5 fill-champagne-hover transition-transform flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                </svg>
              </summary>
              <p className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Locations() {
  return (
    <section id="onde-atendemos" className="py-20 md:py-28 bg-canvas-alt">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Atendimento Presencial"
          title="Locais e formas de atendimento"
          text="Escolha o acolhimento presencial na nossa sede ou consulte nossa disponibilidade regional."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {locations.map((l) => (
            <div key={l.title} className="bg-white rounded-3xl border border-[#EAE5DC] shadow-luxury p-7 flex flex-col justify-between gap-6">
              <div>
                <span className="text-[10px] font-bold text-champagne-hover uppercase tracking-widest">{l.badge}</span>
                <h3 className="text-xl font-bold text-navy mt-1 mb-3">{l.title}</h3>
                {l.lines.map((line) => (
                  <p key={line} className="text-sm text-slate-600 leading-relaxed mb-1">{line}</p>
                ))}
              </div>
              {l.primary ? (
                <WhatsAppButton message={l.message} className="text-sm px-6 py-3.5 rounded-xl">{l.cta}</WhatsAppButton>
              ) : (
                <a
                  href={whatsappLink(l.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center bg-navy hover:bg-navy-light text-white text-sm font-bold px-6 py-3.5 rounded-xl transition-colors"
                >
                  {l.cta}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy-dark text-white py-10 pb-28 md:pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="font-bold">{site.name}</p>
          <p className="text-xs text-slate-300 mt-1">Cirurgiã-Dentista • {site.cro} • Clínica Jardins</p>
          <p className="text-[11px] text-slate-400 mt-3 max-w-xl">
            Aviso Legal CFO: Conteúdo meramente informativo, não substitui consulta ou avaliação clínica presencial individualizada.
          </p>
        </div>
        <WhatsAppButton className="text-sm px-6 py-3 rounded-full">Agendar no WhatsApp</WhatsAppButton>
      </div>
    </footer>
  );
}
