"use client";
import { useRef, useState } from "react";
type M = { role: "user" | "assistant"; content: string };
const SUG = ["Quais contas precisam de recarga hoje?", "Quais clientes estão fora da meta e por quê?", "Resuma a semana da conta com maior investimento", "Quais contas posso escalar +20%?"];
export default function ChatClient() {
  const [msgs, setMsgs] = useState<M[]>([]); const [q, setQ] = useState(""); const [busy, setBusy] = useState(false); const end = useRef<HTMLDivElement>(null);
  async function send(text: string) {
    if (!text.trim() || busy) return;
    const next = [...msgs, { role: "user" as const, content: text }]; setMsgs(next); setQ(""); setBusy(true);
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages: next }) });
      const j = await r.json();
      setMsgs([...next, { role: "assistant", content: r.ok ? j.text : `Erro: ${j.error}` }]);
    } finally { setBusy(false); setTimeout(() => end.current?.scrollIntoView({ behavior: "smooth" }), 50); }
  }
  return (<div>
    {!msgs.length && <div className="row" style={{ marginBottom: 14 }}>{SUG.map((s) => <button key={s} className="sec" onClick={() => send(s)}>{s}</button>)}</div>}
    <div className="chat">{msgs.map((m, i) => <div key={i} className={"msg " + (m.role === "user" ? "u" : "")}>{m.content}</div>)}{busy && <div className="msg mut">Claude está analisando…</div>}<div ref={end} /></div>
    <form className="row" onSubmit={(e) => { e.preventDefault(); send(q); }}><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pergunte sobre saldo, performance, campanhas…" style={{ flex: 1 }} /><button disabled={busy}>Enviar</button></form>
  </div>);
}
