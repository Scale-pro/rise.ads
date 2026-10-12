import { site } from "./site";

export function whatsappLink(message: string = site.defaultMessage): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
