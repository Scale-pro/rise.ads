export async function askClaude(system: string, messages: { role: "user" | "assistant"; content: string }[], maxTokens = 1500) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY não configurada");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5", max_tokens: maxTokens, system, messages }),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(j?.error?.message || `Erro ${res.status}`);
  return (j.content || []).map((c: { text?: string }) => c.text || "").join("");
}

export const SYSTEM_BASE = `Você é o gerente de tráfego do Eduardo (consultor de marketing, mercado brasileiro). Responda em português, de forma direta e honesta.
Regras: use só os números fornecidos; nunca invente dados; não prometa resultado; este painel é somente leitura (você não altera orçamento, campanhas ou lances: apenas sugere, e as mudanças só acontecem se o Eduardo pedir depois, conta por conta).
Escala diária: dentro da meta sugere subir o orçamento em stepPct%; fora da meta, reduzir stepPct%. Frequência acima de 2,5 indica público cansando.`;
