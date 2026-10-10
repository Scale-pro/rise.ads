"use client";
import { useState } from "react";
export default function CopyButton({ text, label = "Copiar" }: { text: string; label?: string }) {
  const [ok, set] = useState(false);
  return <button className="sec" onClick={async () => { try { await navigator.clipboard.writeText(text); set(true); setTimeout(() => set(false), 1500); } catch {} }}>{ok ? "Copiado ✓" : label}</button>;
}
