import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About, Cases, Evaluation, Facts, Faq, Footer, ForWhom, Locations, Procedures } from "@/components/Sections";
import { StickyCta } from "@/components/StickyCta";
import { site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: "Clínica Jardins — Dra. Katyucia Logrado Pessoa",
  url: site.url,
  telephone: `+${site.whatsappNumber}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: "BR",
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Cases />
        <Facts />
        <ForWhom />
        <Procedures />
        <Evaluation />
        <About />
        <Faq />
        <Locations />
      </main>
      <Footer />
      <StickyCta />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
