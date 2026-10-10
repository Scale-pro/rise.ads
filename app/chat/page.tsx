import ChatClient from "@/components/ChatClient";
export default function Page() {
  return (<><h1>Chat com Claude</h1><p className="mut">Pergunte sobre qualquer conta. O Claude responde com os dados reais da última leitura (somente leitura: nada é alterado nas contas).</p><ChatClient /></>);
}
