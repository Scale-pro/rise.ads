import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

type Props = {
  children: React.ReactNode;
  message?: string;
  className?: string;
  iconClassName?: string;
};

export function WhatsAppButton({ children, message, className = "", iconClassName }: Props) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-whatsapp hover:bg-whatsapp-hover text-white font-bold shadow-wa transition-all duration-200 hover:-translate-y-0.5 ${className}`}
    >
      <WhatsAppIcon className={iconClassName} />
      <span>{children}</span>
    </a>
  );
}
