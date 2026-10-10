import { getAccounts } from "@/lib/store";
import { part1, part2, part3, weeklyBlock } from "@/lib/whatsapp";
import { isSleeping } from "@/lib/health";
import { todayBR } from "@/lib/format";
import CopyButton from "@/components/CopyButton";
export const dynamic = "force-dynamic";

export default async function Page() {
  const all = await getAccounts(); const act = all.filter((a) => a.active);
  const blocks = act.filter((a) => a.report?.spend7d != null && !isSleeping(a));
  return (<>
    <h1>Relatórios (texto para WhatsApp)</h1>
    <p className="mut">Textos prontos no formato do relatório diário. Copie e cole.</p>
    <h2 className="row">1. Saúde das contas <CopyButton text={part1(act, todayBR())} /></h2>
    <pre className="wa">{part1(act, todayBR())}</pre>
    <h2 className="row">2. Saldo e cobrança <CopyButton text={part2(act)} /></h2>
    <pre className="wa">{part2(act)}</pre>
    <h2 className="row">3. Relatório semanal por cliente <CopyButton text={part3(act)} label="Copiar todos" /></h2>
    {blocks.map((a) => (<div key={a.id} style={{ marginBottom: 14 }}><div className="row small mut" style={{ marginBottom: 4 }}><span>{a.name}</span><CopyButton text={weeklyBlock(a)} /></div><pre className="wa">{weeklyBlock(a)}</pre></div>))}
  </>);
}
