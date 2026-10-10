# Painel de tráfego

Painel web (Vercel) com visão geral, alertas de saldo/cobrança, performance por conta, relatórios prontos para WhatsApp, chat com Claude e servidor MCP.

## Como os dados chegam (integração com Claude)
O Adplane só se conecta pelo Claude (login interativo), então o fluxo é:

    Rotina diária do Claude (lê Adplane) --POST /api/ingest--> Painel (Vercel + Upstash Redis)
    Painel --/api/chat e /api/analysis--> API da Anthropic (Claude)
    Claude (qualquer conversa) --/api/mcp--> Painel (conector MCP)

## Deploy (10 minutos)
1. Crie um repositório no GitHub e suba esta pasta (`git init && git add . && git commit -m painel && git remote add origin <url> && git push -u origin main`).
2. Em vercel.com: Add New > Project > importe o repositório (Framework: Next.js, sem mudar nada).
3. Em Storage (ou Marketplace), adicione **Upstash Redis** e conecte ao projeto (cria `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` ou `KV_REST_API_*`).
4. Em Settings > Environment Variables, defina (veja `.env.example`):
   - `DASHBOARD_PASSWORD` (senha de acesso; o usuário pode ser qualquer um)
   - `INGEST_TOKEN` e `MCP_TOKEN` (gere com `openssl rand -hex 32`)
   - `ANTHROPIC_API_KEY` (chat e análises) e, se quiser, `ANTHROPIC_MODEL`
5. Redeploy. No primeiro acesso o painel carrega a leitura de exemplo de 10/10/2026.

## Checklist antes do deploy
- `vercel.json` já fixa o framework Next.js e a região `gru1` (São Paulo); Node >= 18.18.
- **Upstash Redis é obrigatório na prática**: sem ele os dados ficam só em memória e se perdem a cada cold start (a Vercel tem disco somente leitura).
- Sem `DASHBOARD_PASSWORD` o painel responde 503 em produção (proposital).
- Variáveis em Production **e** Preview: `DASHBOARD_PASSWORD`, `INGEST_TOKEN`, `MCP_TOKEN`, `ANTHROPIC_API_KEY` (opcional: `ANTHROPIC_MODEL`).
- Depois do deploy, teste: `curl -u x:SENHA https://SEU-PROJETO.vercel.app/api/accounts`.

## Ligar a rotina diária do Claude ao painel
No fim da rotina (PASSO 5), além de gravar no painel antigo, envie:

    curl -X POST https://SEU-PROJETO.vercel.app/api/ingest \
      -H "Authorization: Bearer $INGEST_TOKEN" -H "Content-Type: application/json" \
      -d '{"accounts":[{"id":"meta_123","metaStatus":"ACTIVE","report":{...}}]}'

`report` aceita os campos de `lib/types.ts` (spend7d, balance, customConversions, `metrics` com reach/impressions/frequency/clicks/ctr/cpm, `periodStart`/`periodEnd`, `analysis`, `actions`). A rotina só atualiza `report` e `metaStatus`; a configuração (meta, saldo mínimo, objetivo) é editada na página de cada conta.
A rotina precisa de acesso de rede à Vercel e do `INGEST_TOKEN` no ambiente dela.

## Conectar o painel ao Claude (MCP)
No Claude: Configurações > Conectores > Adicionar conector personalizado, URL `https://SEU-PROJETO.vercel.app/api/mcp` com cabeçalho `Authorization: Bearer <MCP_TOKEN>`. No Claude Code:
`claude mcp add --transport http painel https://SEU-PROJETO.vercel.app/api/mcp --header "Authorization: Bearer <MCP_TOKEN>"`
Ferramentas: `resumo_saude`, `saldo_e_cobranca`, `listar_contas`, `conta`, `relatorio_semanal`.

## Desenvolvimento com Claude Code
`npm install && cp .env.example .env.local && npm run dev` (localhost:3000). O `CLAUDE.md` já dá o contexto ao Claude Code.

## Segurança
O painel tem dados financeiros de clientes: use `DASHBOARD_PASSWORD` forte, nunca commite `.env.local`, e tokens distintos para ingest e MCP.
