import Link from "next/link";
import { getAccounts } from "@/lib/store";
import { evaluateAll, EMOJI } from "@/lib/health";
import { money, num, daysText, ddmm } from "@/lib/format";
export const dynamic = "force-dynamic";

export default async function Page() {
  const all = (await getAccounts()).filter((a) => a.active);
  const hs = evaluateAll(all);
  const alerts = hs.filter((h) => ["red", "orange", "green", "yellow"].includes(h.level));
  const sleeping = hs.filter((h) => h.level === "sleeping");
  const run = hs.filter((h) => h.level !== "sleeping");
  const upd = all.map((a) => a.report?.updatedAt).filter(Boolean).sort().pop();
  const byCur: Record<string, number> = {};
  for (const h of run) byCur[h.account.currency] = (byCur[h.account.currency] || 0) + (h.account.report?.spend7d || 0);
  const pre = run.filter((h) => h.account.report?.balance?.kind === "pre");
  return (<>
    <h1>Visão geral</h1>
    <div className="mut small">Última leitura: {upd ? new Date(upd).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) : "—"}</div>
    <div className="cards">
      <div className="card"><div className="v">{alerts.filter((h) => h.level === "red" || h.level === "orange").length}</div><div className="l">Contas com alerta de saldo/cobrança</div></div>
      <div className="card"><div className="v">{run.length}</div><div className="l">Contas rodando</div></div>
      <div className="card"><div className="v">{sleeping.length}</div><div className="l">Contas paradas (3+ dias)</div></div>
      <div className="card"><div className="v">{pre.length}</div><div className="l">Contas pré-pagas</div></div>
      {Object.entries(byCur).map(([c, v]) => <div className="card" key={c}><div className="v">{money(v, c)}</div><div className="l">Investido em 7 dias ({c})</div></div>)}
    </div>

    {alerts.length > 0 && (<><h2>Alertas</h2><div className="alerts">
      {alerts.map((h) => { const a = h.account, r = a.report!, b = r.balance; return (
        <div key={a.id} className={"alert " + h.level}>
          <Link href={`/contas/${a.id}`}><b>{EMOJI[h.level]} {a.name}</b></Link> <span className="pill">{a.platform}</span>
          <div className="small">
            {h.reasons[0]}{b?.kind === "pre" && b.amount != null ? ` — saldo ${money(b.amount, a.currency)}, dura ${daysText(b.runwayDays)}${b.estimatedEnd ? ` (até ${ddmm(b.estimatedEnd)})` : ""}` : ""}
            {b?.capRemaining != null && (b.capRunwayDays ?? 99) < 3 ? ` — limite de gasto: restam ${money(b.capRemaining, a.currency)}` : ""}
            {a.targetCost != null && (r.verdict === "scale" || r.verdict === "cut") ? ` — ${money(r.costPerResult, a.currency)} por resultado (meta ${money(a.targetCost, a.currency)}): ${r.verdict === "scale" ? `subir +${a.stepPct ?? 20}%` : `reduzir −${a.stepPct ?? 20}%`}` : ""}
          </div>
        </div>); })}
    </div></>)}

    <h2>Contas rodando</h2>
    <div className="wrap"><table>
      <thead><tr><th>Conta</th><th>Plat.</th><th className="n">Gasto 7d</th><th className="n">Anterior</th><th className="n">Resultados</th><th className="n">Custo/resultado</th><th>Meta</th><th>Pagamento</th><th className="n">Saldo / projeção 30d</th><th>Dura</th></tr></thead>
      <tbody>{run.map((h) => { const a = h.account, r = a.report!, b = r.balance, c = a.currency; return (
        <tr key={a.id}>
          <td><Link href={`/contas/${a.id}`}>{EMOJI[h.level]} {a.name}</Link></td>
          <td>{a.platform}</td>
          <td className="n">{money(r.spend7d, c)}</td>
          <td className="n mut">{money(r.spendPrev7d, c)}</td>
          <td className="n">{r.results7d != null ? num(r.results7d, Number.isInteger(r.results7d) ? 0 : 2) : "—"}</td>
          <td className="n">{money(r.costPerResult, c)}</td>
          <td>{a.targetCost != null ? money(a.targetCost, c) : <span className="mut">—</span>}</td>
          <td>{b?.kind === "pre" ? "Pré-pago" : `Pós-pago${b?.paymentText ? ` (${b.paymentText})` : ""}`}</td>
          <td className="n">{b?.kind === "pre" ? money(b.amount, c) : money(b?.projection30d, c)}</td>
          <td>{b?.kind === "pre" ? daysText(b.runwayDays) : ""}</td>
        </tr>); })}</tbody>
    </table></div>

    {sleeping.length > 0 && (<><h2>💤 Paradas há 3 dias ou mais</h2><p className="mut">{sleeping.map((h, i) => (<span key={h.account.id}>{i ? ", " : ""}<Link href={`/contas/${h.account.id}`}>{h.account.name}</Link></span>))}</p></>)}
  </>);
}
