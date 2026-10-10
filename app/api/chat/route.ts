import { NextRequest, NextResponse } from "next/server";
import { getAccounts } from "@/lib/store";
import { askClaude, SYSTEM_BASE } from "@/lib/claude";
import { evaluateAll } from "@/lib/health";
import { todayBR } from "@/lib/format";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const accounts = (await getAccounts()).filter((a) => a.active);
    const levels = evaluateAll(accounts).map((h) => ({ id: h.account.id, nivel: h.level }));
    const system = `${SYSTEM_BASE}\nHoje é ${todayBR()}.\nDados atuais das contas ativas (JSON; report = leitura dos últimos 7 dias fechados contra os 7 anteriores):\n${JSON.stringify({ niveis: levels, contas: accounts })}`;
    const text = await askClaude(system, messages.slice(-12), 1800);
    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
