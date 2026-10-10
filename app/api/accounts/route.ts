import { NextResponse } from "next/server";
import { getAccounts } from "@/lib/store";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json(await getAccounts()); }
