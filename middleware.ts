import { NextRequest, NextResponse } from "next/server";

// Protege o painel com senha (HTTP Basic). /api/ingest e /api/mcp usam token próprio (Bearer).
export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;
  if (p.startsWith("/api/ingest") || p.startsWith("/api/mcp")) return NextResponse.next();
  const pass = process.env.DASHBOARD_PASSWORD;
  if (!pass) {
    if (process.env.NODE_ENV === "production") return new NextResponse("Defina DASHBOARD_PASSWORD na Vercel.", { status: 503 });
    return NextResponse.next();
  }
  const auth = req.headers.get("authorization") || "";
  if (auth.startsWith("Basic ")) {
    try {
      const [, pw] = atob(auth.slice(6)).split(/:(.*)/s);
      if (pw === pass) return NextResponse.next();
    } catch {}
  }
  return new NextResponse("Acesso restrito", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="Painel de tráfego"' } });
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
