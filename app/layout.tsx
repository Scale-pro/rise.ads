import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Painel de tráfego", description: "Saldo, performance e relatórios das contas de anúncio" };

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="top">
          <b>📊 Painel de tráfego</b>
          <nav>
            <Link href="/">Visão geral</Link>
            <Link href="/relatorios">Relatórios</Link>
            <Link href="/chat">Chat com Claude</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
