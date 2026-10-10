# Painel de tráfego (Eduardo)

Next.js 14 (App Router, TypeScript) para deploy na Vercel. Mostra saldo, cobrança, performance e relatórios WhatsApp das contas Meta/Google Ads.

## Regras
- Somente leitura nas contas de anúncio: o painel nunca pausa, ativa ou altera orçamento/lance/campanha.
- Nunca inventar números. Texto em português do Brasil; datas DD/MM; valores "R$ 1.234,56" (outras moedas: "USD 1.234,56").
- Dados vêm da rotina diária do Claude (Adplane) via POST /api/ingest. Não existe token público do Adplane para servidor externo.

## Mapa
- lib/types.ts: modelo (Account, Report). lib/store.ts: Upstash Redis (ou memória/seed local).
- lib/health.ts: regras de alerta (🔴 cobrança, 🟠 saldo/limite, 🟢/🟡 meta). lib/whatsapp.ts: partes 1, 2 e 3 do relatório.
- app/api/ingest (Bearer INGEST_TOKEN), app/api/mcp (Bearer MCP_TOKEN, JSON-RPC MCP), app/api/chat e app/api/analysis/[id] (ANTHROPIC_API_KEY).
- middleware.ts: senha do painel (DASHBOARD_PASSWORD, HTTP Basic).
- data/seed.json: leitura de 10/10/2026 (dados de exemplo iniciais).

## Comandos
npm install · npm run dev · npm run build
