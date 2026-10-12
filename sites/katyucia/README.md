# Site Dra. Katyucia Logrado Pessoa

Landing page de harmonização orofacial (Eunápolis/BA), recriada a partir do design do Stitch em Next.js 14 (App Router, TypeScript, Tailwind CSS). Página estática, sem backend.

## Rodar localmente
    cd sites/katyucia
    npm install
    cp .env.example .env.local
    npm run dev

Scripts: `npm run typecheck` · `npm run lint` · `npm run build`.

## Deploy na Vercel
1. Suba o repositório no GitHub.
2. Na Vercel: Add New > Project > importe o repositório.
3. **Root Directory: `sites/katyucia`** (Framework: Next.js, detectado automaticamente).
4. Variáveis de ambiente: `NEXT_PUBLIC_SITE_URL` (domínio final) e, opcionalmente, `NEXT_PUBLIC_WHATSAPP_NUMBER`.
5. Deploy. O workflow `.github/workflows/katyucia-ci.yml` roda typecheck, lint e build a cada push.

## Onde editar
- Textos: `lib/content.ts` · Dados da clínica, WhatsApp e SEO: `lib/site.ts` · Fotos: `lib/images.ts`
- Cores/tipografia: `tailwind.config.ts` (paleta champagne/navy do design)

## Pendências para o conteúdo
- As fotos vieram do Stitch (URLs `googleusercontent` externas, podem expirar): baixe-as para `public/img` e atualize `lib/images.ts`.
- Atendimento em **Porto Seguro e Salvador** estava marcado "[confirmar]" no design original: confirme antes de publicar.
- Antes/depois e textos seguem as regras do CFO: confirme autorização de imagem dos pacientes.
