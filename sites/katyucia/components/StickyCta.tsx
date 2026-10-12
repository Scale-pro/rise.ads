import { WhatsAppButton } from "./WhatsAppButton";

export function StickyCta() {
  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-30 bg-white/92 backdrop-blur-md border-t border-canvas-border p-3">
      <WhatsAppButton className="w-full py-3.5 rounded-full text-sm">Agendar avaliação</WhatsAppButton>
    </div>
  );
}
