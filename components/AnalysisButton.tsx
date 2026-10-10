"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function AnalysisButton({ id }: { id: string }) {
  const [busy, setBusy] = useState(false); const [err, setErr] = useState(""); const router = useRouter();
  return (<span><button disabled={busy} onClick={async () => {
    setBusy(true); setErr("");
    const r = await fetch(`/api/analysis/${id}`, { method: "POST" }); const j = await r.json();
    setBusy(false); if (!r.ok) setErr(j.error || "erro"); else router.refresh();
  }}>{busy ? "Gerando…" : "✨ Gerar análise com Claude"}</button>{err && <span className="small" style={{ color: "var(--red)", marginLeft: 8 }}>{err}</span>}</span>);
}
