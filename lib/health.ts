import type { Account } from "./types";

export type Level = "red" | "orange" | "green" | "yellow" | "ok" | "sleeping";

export interface Health {
  account: Account;
  level: Level;
  minDays: number | null; // para ordenar os alertas laranja
  reasons: string[];
}

export function isSleeping(a: Account) { return a.report?.verdict === "sleeping" || (a.report?.daysSinceSpend ?? 0) >= 3; }

export function evaluate(a: Account): Health {
  const r = a.report;
  const reasons: string[] = [];
  if (!r) return { account: a, level: "ok", minDays: null, reasons };
  if (isSleeping(a)) return { account: a, level: "sleeping", minDays: null, reasons };
  if (r.billingIssue || (a.metaStatus && a.metaStatus !== "ACTIVE")) {
    return { account: a, level: "red", minDays: null, reasons: ["Pagamento pendente (conta não liquidada)"] };
  }
  const b = r.balance;
  let orange = false;
  const days: number[] = [];
  if (b?.kind === "pre") {
    if (a.minBalance != null && b.amount != null && b.amount < a.minBalance) { orange = true; reasons.push("Saldo pré-pago abaixo do limite"); }
    if (b.runwayDays != null && b.runwayDays < 3) { orange = true; if (!reasons.length) reasons.push("Saldo pré-pago acabando"); }
    if (b.runwayDays != null) days.push(b.runwayDays);
  }
  if (b?.capRunwayDays != null && b.capRunwayDays < 3) { orange = true; reasons.push("Limite de gasto da conta quase atingido"); days.push(b.capRunwayDays); }
  if (orange) return { account: a, level: "orange", minDays: days.length ? Math.min(...days) : 0, reasons };
  if (a.targetCost != null) {
    if (r.verdict === "scale") return { account: a, level: "green", minDays: null, reasons: [] };
    if (r.verdict === "cut") return { account: a, level: "yellow", minDays: null, reasons: [] };
  }
  return { account: a, level: "ok", minDays: null, reasons };
}

export function evaluateAll(list: Account[]) {
  const hs = list.filter((a) => a.active).map(evaluate);
  const order = { red: 0, orange: 1, green: 2, yellow: 3, ok: 4, sleeping: 5 } as const;
  hs.sort((x, y) => order[x.level] - order[y.level] || (x.minDays ?? 99) - (y.minDays ?? 99));
  return hs;
}

export const EMOJI: Record<Level, string> = { red: "🔴", orange: "🟠", green: "🟢", yellow: "🟡", ok: "⚪", sleeping: "💤" };
