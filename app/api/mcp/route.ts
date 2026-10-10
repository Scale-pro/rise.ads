import { NextRequest, NextResponse } from "next/server";
import { getAccounts } from "@/lib/store";
import { evaluateAll, isSleeping } from "@/lib/health";
import { part1, part2, weeklyBlock } from "@/lib/whatsapp";
import { todayBR } from "@/lib/format";

export const dynamic = "force-dynamic";

// Servidor MCP (Streamable HTTP, sem sessão). Conecte no Claude como conector personalizado:
//   URL: https://SEU-PROJETO.vercel.app/api/mcp   |   Header: Authorization: Bearer <MCP_TOKEN>
const TOOLS = [
  { name: "resumo_saude", description: "Mensagem de saúde das contas (alertas de cobrança, saldo, limite de gasto, meta), pronta para WhatsApp.", inputSchema: { type: "object", properties: {} } },
  { name: "saldo_e_cobranca", description: "Resumo de saldo e cobrança de todas as contas ativas não paradas.", inputSchema: { type: "object", properties: {} } },
  { name: "listar_contas", description: "Lista as contas com nível de alerta, gasto 7 dias, resultado e custo por resultado.", inputSchema: { type: "object", properties: { somente_alertas: { type: "boolean" } } } },
  { name: "conta", description: "Dados completos de uma conta (busca por nome ou id).", inputSchema: { type: "object", properties: { busca: { type: "string" } }, required: ["busca"] } },
  { name: "relatorio_semanal", description: "Relatório semanal de uma conta no formato WhatsApp.", inputSchema: { type: "object", properties: { busca: { type: "string" } }, required: ["busca"] } },
];

const txt = (s: string) => ({ content: [{ type: "text", text: s }] });

async function call(name: string, args: Record<string, unknown>) {
  const all = await getAccounts();
  const find = (q: string) => { const s = q.toLowerCase(); return all.find((a) => a.id.toLowerCase() === s || a.accountId === q) || all.find((a) => a.name.toLowerCase().includes(s)); };
  switch (name) {
    case "resumo_saude": return txt(part1(all.filter((a) => a.active), todayBR()));
    case "saldo_e_cobranca": return txt(part2(all));
    case "listar_contas": {
      const hs = evaluateAll(all).filter((h) => !args.somente_alertas || ["red", "orange", "green", "yellow"].includes(h.level));
      return txt(JSON.stringify(hs.map((h) => ({ id: h.account.id, nome: h.account.name, nivel: h.level, moeda: h.account.currency, gasto7d: h.account.report?.spend7d, resultados7d: h.account.report?.results7d, custoPorResultado: h.account.report?.costPerResult, saldo: h.account.report?.balance?.amount, diasDeSaldo: h.account.report?.balance?.runwayDays, parada: isSleeping(h.account) })), null, 1));
    }
    case "conta": { const a = find(String(args.busca || "")); return txt(a ? JSON.stringify(a, null, 1) : "Conta não encontrada."); }
    case "relatorio_semanal": { const a = find(String(args.busca || "")); return txt(a?.report ? weeklyBlock(a) : "Conta não encontrada ou sem leitura."); }
  }
  return { ...txt(`Ferramenta desconhecida: ${name}`), isError: true };
}

export async function POST(req: NextRequest) {
  const token = process.env.MCP_TOKEN;
  if (!token || req.headers.get("authorization") !== `Bearer ${token}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const msg = await req.json().catch(() => null);
  if (!msg) return NextResponse.json({ jsonrpc: "2.0", error: { code: -32700, message: "parse error" }, id: null }, { status: 400 });
  if (msg.id === undefined) return new NextResponse(null, { status: 202 }); // notificação
  const ok = (result: unknown) => NextResponse.json({ jsonrpc: "2.0", id: msg.id, result });
  switch (msg.method) {
    case "initialize": return ok({ protocolVersion: msg.params?.protocolVersion || "2025-03-26", capabilities: { tools: {} }, serverInfo: { name: "painel-trafego", version: "1.0.0" } });
    case "ping": return ok({});
    case "tools/list": return ok({ tools: TOOLS });
    case "tools/call": return ok(await call(msg.params?.name, msg.params?.arguments || {}));
  }
  return NextResponse.json({ jsonrpc: "2.0", id: msg.id, error: { code: -32601, message: "method not found" } });
}
export async function GET() { return new NextResponse("Use POST (MCP Streamable HTTP).", { status: 405 }); }
