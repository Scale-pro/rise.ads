import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAccount, patchAccount } from "@/lib/store";
import { evaluate, EMOJI } from "@/lib/health";
import { money, num, pct, daysText, ddmm } from "@/lib/format";
import { weeklyBlock } from "@/lib/whatsapp";
import CopyButton from "@/components/CopyButton";
import AnalysisButton from "@/components/AnalysisButton";
export const dynamic = "force-dynamic";

async function save(fd: FormData) {
  "use server";
  const id = String(fd.get("id"));
  const n = (k: string) => { const v = String(fd.get(k) || "").replace(",", "."); return v === "" ? null : Number(v); };
  await patchAccount(id, {
    active: fd.get("active") === "on",
    objective: String(fd.get("objective")) as never,
    billing: String(fd.get("billing")) as never,
    minBalance: n("minBalance"), targetCost: n("targetCost"), stepPct: n("stepPct") ?? 20,
  });
  revalidatePath(`/contas/${id}`); revalidatePath("/");
}

export default async function Page({ params }: { params: { id: string } }) {
  const a = await getAccount(params.id);
  if (!a) notFound();
  const h = evaluate(a), r = a.report, b = r?.balance, c = a.currency, m = r?.metrics;
  return (<>
    <p className="small"><Link href="/">← Voltar</Link></p>
    <h1>{EMOJI[h.level]} {a.name} <span className="pill">{a.platform}</span> <span className="pill">{c}</span></h1>
    <div className="mut small">ID {a.accountId}{a.metaStatus ? ` · status Meta: ${a.metaStatus}` : ""}{r ? ` · leitura ${new Date(r.updatedAt).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}` : ""}</div>
    {r && (<>
      <div className="cards">
        <div className="card"><div className="v">{money(r.spend7d, c)}</div><div className="l">Gasto 7 dias (anterior {money(r.spendPrev7d, c)})</div></div>
        <div className="card"><div className="v">{r.results7d != null ? num(r.results7d, Number.isInteger(r.results7d) ? 0 : 2) : "—"}</div><div className="l">Resultados ({a.objective})</div></div>
        <div className="card"><div className="v">{money(r.costPerResult, c)}</div><div className="l">Custo por resultado{a.targetCost != null ? ` (meta ${money(a.targetCost, c)})` : ""}</div></div>
        <div className="card"><div className="v">{money(r.spendYesterday, c)}</div><div className="l">Gasto ontem · {r.daysSinceSpend ?? 0} dias sem gasto</div></div>
      </div>
      {b && (<><h2>Saldo e cobrança</h2><div className="card">
        {b.kind === "pre" ? (<>
          <div><b>Pré-pago</b> — saldo atual <b>{money(b.amount, c)}</b>{a.minBalance != null ? ` (limite de aviso ${money(a.minBalance, c)})` : ""}</div>
          <div className="small">Gasto médio/dia {money(b.dailyAvg, c)} · dura {daysText(b.runwayDays)}{b.estimatedEnd ? ` (até ${ddmm(b.estimatedEnd)})` : ""} · recarga sugerida para 7 dias {money(b.suggestedRecharge, c)}</div>
        </>) : (<>
          <div><b>Pós-pago</b> — {b.paymentText || "cartão"}</div>
          <div className="small">Projeção 30 dias {money(b.projection30d, c)} (gasto médio/dia {money(b.dailyAvg, c)}). A API não informa a data da próxima cobrança.</div>
        </>)}
        {b.capTotal != null && <div className="small">Limite de gasto: {money(b.capTotal, c)} · gasto {money(b.capSpent, c)} · restam {money(b.capRemaining, c)}</div>}
      </div></>)}
      {m && (<><h2>Performance da semana</h2><div className="cards">
        {m.reach != null && <div className="card"><div className="v">{num(m.reach)}</div><div className="l">Pessoas alcançadas</div></div>}
        {m.impressions != null && <div className="card"><div className="v">{num(m.impressions)}</div><div className="l">Exibições</div></div>}
        {m.frequency != null && <div className="card"><div className="v">{num(m.frequency, 2)}</div><div className="l">Frequência{m.frequency > 2.5 ? " (cansando)" : ""}</div></div>}
        {m.clicks != null && <div className="card"><div className="v">{num(m.clicks)}</div><div className="l">Cliques{m.ctr != null ? ` · ${pct(m.ctr)}` : ""}</div></div>}
        {m.cpm != null && <div className="card"><div className="v">{money(m.cpm, c)}</div><div className="l">Custo por mil exibições</div></div>}
      </div></>)}
      {!!r.customConversions?.length && (<><h2>Conversões personalizadas</h2><div className="wrap"><table><thead><tr><th>Nome</th><th className="n">Qtd</th><th className="n">Custo cada</th></tr></thead><tbody>
        {r.customConversions.map((x) => <tr key={x.name}><td>{x.name}</td><td className="n">{num(x.count, Number.isInteger(x.count) ? 0 : 2)}</td><td className="n">{money(x.costPer, c)}</td></tr>)}</tbody></table></div></>)}
      {r.note && <><h2>Leitura</h2><p>{r.note}</p></>}
      <h2 className="row">Relatório para o cliente <AnalysisButton id={a.id} /> {r.spend7d != null && <CopyButton text={weeklyBlock(a)} />}</h2>
      <pre className="wa">{weeklyBlock(a)}</pre>
    </>)}
    <h2>Configuração</h2>
    <form action={save} className="grid">
      <input type="hidden" name="id" value={a.id} />
      <label>Ativa<input type="checkbox" name="active" defaultChecked={a.active} style={{ width: 20 }} /></label>
      <label>Objetivo<select name="objective" defaultValue={a.objective || "conversas"}>{["conversas", "leads", "vendas", "cliques", "outro"].map((o) => <option key={o}>{o}</option>)}</select></label>
      <label>Cobrança (painel)<select name="billing" defaultValue={a.billing || ""}><option value="">—</option><option value="pre">pré-pago</option><option value="pos">pós-pago</option></select></label>
      <label>Saldo mínimo (aviso)<input name="minBalance" defaultValue={a.minBalance ?? ""} /></label>
      <label>Custo máximo por resultado (meta)<input name="targetCost" defaultValue={a.targetCost ?? ""} /></label>
      <label>Passo de escala (%)<input name="stepPct" defaultValue={a.stepPct ?? 20} /></label>
      <div style={{ alignSelf: "end" }}><button>Salvar</button></div>
    </form>
  </>);
}
