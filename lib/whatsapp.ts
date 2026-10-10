import type { Account } from "./types";
import { evaluateAll, isSleeping, EMOJI } from "./health";
import { ddmm, ddmmyyyy, daysText, money, num, pct } from "./format";

const OBJ = {
  conversas: { res: "🎯 Conversas iniciadas", cost: "💸 Custo por conversa", unit: "por conversa" },
  leads: { res: "🎯 Leads", cost: "💸 Custo por lead", unit: "por lead" },
  vendas: { res: "🎯 Compras", cost: "💸 Custo por compra", unit: "por compra" },
  cliques: { res: "🖱 Cliques no link", cost: "💸 Custo por clique no link", unit: "por clique" },
  outro: { res: "🎯 Resultados", cost: "💸 Custo por resultado", unit: "por resultado" },
} as const;
const o = (a: Account) => OBJ[a.objective || "conversas"];
const gname = (a: Account) => (a.platform === "google" ? `${a.name} (Google)` : a.name);

export function part1(list: Account[], today: string) {
  const hs = evaluateAll(list);
  const alerts = hs.filter((h) => ["red", "orange", "green", "yellow"].includes(h.level));
  const sleeping = hs.filter((h) => h.level === "sleeping");
  const okCount = hs.filter((h) => h.level === "ok").length;
  const out: string[] = [];
  out.push(`📊 *Saúde das contas de anúncio* — ${ddmmyyyy(today)}`);
  out.push(`${alerts.length} com alerta  |  ${okCount} ok`);
  if (!alerts.length) out.push("", "Tudo calmo: nenhuma conta com alerta hoje.");
  for (const h of alerts) {
    const a = h.account, r = a.report!, b = r.balance, c = a.currency;
    const lines: string[] = [`${EMOJI[h.level]} *${gname(a)}*`];
    if (h.level === "red") lines.push("Pagamento pendente (conta não liquidada)");
    if (h.level === "orange") {
      const stopped = b?.kind === "pre" && (b.amount ?? 1) <= 0;
      lines.push(stopped ? "Saldo zerado, a entrega parou" : h.reasons[0] || "Saldo ou limite acabando");
      if (b?.kind === "pre") {
        lines.push(`Atual: ${money(b.amount, c)}  |  Limite: ${a.minBalance != null ? money(a.minBalance, c) : "não definido"}`);
        if (!stopped) lines.push(`Dura ${daysText(b.runwayDays)} no ritmo atual${b.estimatedEnd ? ` (até ${ddmm(b.estimatedEnd)})` : ""}  |  Recarga sugerida para 7 dias: ${money(b.suggestedRecharge, c)}`);
        else lines.push(`Recarga sugerida para 7 dias: ${money(b.suggestedRecharge, c)}`);
      }
      if (b?.capTotal != null && (b.capRunwayDays ?? 99) < 3)
        lines.push(`Restam ${money(b.capRemaining, c)} de ${money(b.capTotal, c)} no limite de gasto  |  A entrega para ao atingir o limite`);
    }
    if (a.targetCost != null && (h.level === "green" || h.level === "yellow" || r.verdict === "cut" || r.verdict === "scale")) {
      const up = r.verdict === "scale";
      lines.push(`${up ? "Dentro da meta" : "Fora da meta"}: ${money(r.costPerResult, c)} ${o(a).unit} (meta ${money(a.targetCost, c)}). Sugestão: ${up ? `subir orçamento +${a.stepPct ?? 20}%` : `reduzir orçamento −${a.stepPct ?? 20}%`}`);
    }
    out.push("", lines.join("\n"));
  }
  if (sleeping.length) out.push("", `💤 Paradas há 3 dias ou mais: ${sleeping.map((h) => gname(h.account)).join(", ")}`);
  return out.join("\n");
}

function byInvested(list: Account[]) {
  const act = list.filter((a) => a.active && a.report && !isSleeping(a));
  const cur = [...new Set(act.map((a) => a.currency))].sort((x, y) => (x === "BRL" ? -1 : y === "BRL" ? 1 : x.localeCompare(y)));
  return cur.flatMap((c) => act.filter((a) => a.currency === c).sort((x, y) => (y.report!.spend7d ?? 0) - (x.report!.spend7d ?? 0)));
}

export function part2(list: Account[]) {
  const out: string[] = ["💳 *Saldo e cobrança*"];
  for (const a of byInvested(list)) {
    const r = a.report!, b = r.balance, c = a.currency;
    if (!b) continue;
    const L: string[] = [];
    if (b.kind === "pre") {
      L.push(`*${gname(a)}* — Pré-pago`);
      L.push(`${b.estimated ? "Estimado" : "Saldo atual"}: ${money(b.amount, c)}  |  Gasto médio por dia: ${money(b.dailyAvg, c)}`);
      const stopped = (b.amount ?? 1) <= 0;
      L.push(`${stopped ? "Sem saldo (anúncios parados)" : `Dura ${daysText(b.runwayDays)}${b.estimatedEnd ? ` (até ${ddmm(b.estimatedEnd)})` : ""}`}  |  Recarga sugerida para 7 dias: ${money(b.suggestedRecharge, c)}${(b.suggestedRecharge ?? 1) === 0 ? " (já cobre)" : ""}`);
    } else {
      const m = b.paymentText || "cartão";
      const label = /cart[aã]o/i.test(m) && !/\*/.test(m) ? "Pós-pago (cartão)" : `Pós-pago (${m.replace(/\s*\*(\d+)/, " final $1")})`;
      L.push(`*${gname(a)}* — ${label}`);
      L.push(`Gasto nos últimos 7 dias: ${money(r.spend7d, c)}  |  Projeção para 30 dias: ${money(b.projection30d, c)}`);
      L.push("Próxima cobrança: a API não informa a data. A projeção acima é a estimativa de fatura.");
    }
    if (b.capTotal != null) L.push(`Limite de gasto: ${money(b.capTotal, c)} (gasto ${money(b.capSpent, c)}, restam ${money(b.capRemaining, c)})`);
    out.push("", L.join("\n"));
  }
  return out.join("\n");
}

export function weeklyBlock(a: Account) {
  const r = a.report!, m = r.metrics || {}, c = a.currency, b = r.balance;
  const ob = o(a);
  const L: string[] = [`*${a.name.toUpperCase()}${a.platform === "google" ? " (Google)" : ""}*`];
  if (r.periodStart && r.periodEnd) L.push(`📅 ${ddmm(r.periodStart)} a ${ddmm(r.periodEnd)}`);
  L.push(`💰 Investimento: ${money(r.spend7d, c)}`);
  if (a.objective === "vendas" && m.revenue != null) { L.push(`${ob.res}: ${r.results7d ?? 0}`); if (r.costPerResult != null) L.push(`${ob.cost}: ${money(r.costPerResult, c)}`); L.push(`💵 Valor em vendas: ${money(m.revenue, c)}`); if (m.roas != null) L.push(`📈 Retorno sobre o investimento (ROAS): ${num(m.roas, 2)}`); }
  else if (a.objective === "cliques") { L.push(`${ob.res}: ${num(r.results7d ?? 0, a.platform === "google" ? 0 : 0)}`); if (r.costPerResult != null) L.push(`${ob.cost}: ${money(r.costPerResult, c)}`); }
  else { L.push(`${ob.res}: ${num(r.results7d ?? 0, Number.isInteger(r.results7d ?? 0) ? 0 : 2)}`); if (r.costPerResult != null) L.push(`${ob.cost}: ${money(r.costPerResult, c)}`); }
  if (a.platform === "meta") {
    if (m.reach != null) L.push(`📣 Pessoas alcançadas: ${num(m.reach)}`);
    if (m.impressions != null) L.push(`👁 Exibições do anúncio: ${num(m.impressions)}`);
    if (m.clicks != null) L.push(`🖱 Cliques no link: ${num(m.clicks)}${m.ctr != null ? ` (${pct(m.ctr)} de quem viu)` : ""}`);
    if (m.cpm != null) L.push(`💵 Custo por mil exibições: ${money(m.cpm, c)}`);
  } else {
    if (m.impressions != null) L.push(`👁 Impressões: ${num(m.impressions)}`);
    if (m.clicks != null && a.objective !== "cliques") L.push(`🖱 Cliques: ${num(m.clicks)}${m.ctr != null ? ` (CTR ${pct(m.ctr)})` : ""}`);
    else if (m.ctr != null) L.push(`👁 CTR: ${pct(m.ctr)}`);
  }
  const cc = [...(r.customConversions || [])].sort((x, y) => y.count - x.count);
  if (cc.length) L.push(`🧩 Conversões personalizadas: ${cc.map((x) => `${x.name}: ${num(x.count, Number.isInteger(x.count) ? 0 : 2)}${x.costPer != null ? ` (${money(x.costPer, c)} cada)` : ""}`).join(" | ")}`);
  if (b) L.push(b.kind === "pre" ? `💳 Saldo atual: ${money(b.amount, c)} (pré-pago, ${(b.amount ?? 1) <= 0 ? "anúncios parados" : `dura ${daysText(b.runwayDays)}`})` : `💳 Pós-pago: projeção de ${money(b.projection30d, c)} em 30 dias`);
  L.push("", "━━━━━━━━━━━━━━━━━━", "");
  L.push("🧠 *Como foi a semana*", r.analysis || "(análise ainda não gerada: use o botão \"Gerar análise com Claude\" na página da conta)");
  L.push("", "🔮 *O que vamos fazer*");
  for (const x of r.actions || []) L.push(`• ${x}`);
  return L.join("\n");
}

export const part3 = (list: Account[]) => byInvested(list).filter((a) => a.report?.spend7d != null).map(weeklyBlock).join("\n\n");
