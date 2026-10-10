import { NextRequest, NextResponse } from "next/server";
import { getAccount, patchAccount } from "@/lib/store";
import { askClaude, SYSTEM_BASE } from "@/lib/claude";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const a = await getAccount(params.id);
    if (!a?.report) return NextResponse.json({ error: "conta sem leitura" }, { status: 404 });
    const prompt = `Escreva a análise semanal para o CLIENTE desta conta, em linguagem simples, com os números reais.
Responda SOMENTE em JSON: {"analysis": "parágrafo curto: custo por resultado (dentro/fora da meta se houver meta), quantidade de resultados, alcance e frequência (diga se o público está cansando quando frequência > 2,5), taxa de clique e o que sugere, comparação com a semana anterior, conversões personalizadas relevantes", "actions": ["Ação 1 em primeira pessoa (\\"Vou ajustar...\\")", "Ação 2", "...se saldo/limite baixo, a última ação avisa que é preciso recarregar"]}
Se o resultado está ruim, diga e proponha a correção; se está bom, diga o que sustenta e que o orçamento pode subir +stepPct%. Não prometa resultado.
Conta: ${JSON.stringify(a)}`;
    const raw = await askClaude(SYSTEM_BASE, [{ role: "user", content: prompt }], 1200);
    const j = JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1));
    await patchAccount(a.id, { report: { analysis: j.analysis, actions: j.actions } as never });
    return NextResponse.json(j);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
