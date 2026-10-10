const nf = (v: number, d = 2) => new Intl.NumberFormat("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
export const num = (v: number, d = 0) => nf(v, d);
export function money(v: number | null | undefined, cur = "BRL") {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  return `${cur === "BRL" ? "R$" : cur} ${nf(v, 2)}`;
}
export function pct(v: number | null | undefined, d = 2) { return v == null ? "—" : `${nf(v, d)}%`; }
export function ddmm(iso?: string | null) {
  if (!iso) return "";
  const [, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}`;
}
export function ddmmyyyy(iso: string) { const [y, m, d] = iso.slice(0, 10).split("-"); return `${d}/${m}/${y}`; }
export function todayBR() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Sao_Paulo" }).format(new Date()); // AAAA-MM-DD
}
export function daysText(days?: number | null) {
  if (days == null) return "";
  if (days < 1) return "menos de 1 dia";
  const n = Math.round(days);
  return `cerca de ${n} ${n === 1 ? "dia" : "dias"}`;
}
