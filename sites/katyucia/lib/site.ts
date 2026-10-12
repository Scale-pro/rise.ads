export const site = {
  name: "Dra. Katyucia Logrado Pessoa",
  shortName: "Dra. Katyucia | Clínica Jardins",
  cro: "CRO-BA 5894",
  title: "Dra. Katyucia Logrado Pessoa | Harmonização Orofacial em Eunápolis - BA",
  description:
    "Harmonização Orofacial e Odontologia Estética com naturalidade, segurança e planejamento individual em Eunápolis e região. Agende sua avaliação clínica.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5573999224429",
  defaultMessage:
    "Olá! Vim pelo site e gostaria de agendar uma avaliação de harmonização orofacial com a Dra. Katyucia na Clínica Jardins.",
  address: {
    street: "Av. Buganvília, 17",
    district: "Jardins de Eunápolis",
    city: "Eunápolis",
    region: "BA",
    postalCode: "45820-779",
  },
  googleMapsUrl: "https://www.google.com/maps/place/Cl%C3%ADnica+Jardins/@-16.3837493,-39.5914129,17z",
} as const;
