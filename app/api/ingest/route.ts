import { NextRequest, NextResponse } from "next/server";
import { ingest } from "@/lib/store";

export const dynamic = "force-dynamic";

// A rotina do Claude envia: { "accounts": [ { "id": "meta_123", "metaStatus": "ACTIVE", "report": {...} } ] }
export async function POST(req: NextRequest) {
  const token = process.env.INGEST_TOKEN;
  if (!token || req.headers.get("authorization") !== `Bearer ${token}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const docs = Array.isArray(body) ? body : body?.accounts;
  if (!Array.isArray(docs)) return NextResponse.json({ error: "esperado { accounts: [...] }" }, { status: 400 });
  return NextResponse.json({ ok: true, ...(await ingest(docs)) });
}
