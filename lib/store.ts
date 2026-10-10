import fs from "node:fs";
import path from "node:path";
import { Redis } from "@upstash/redis";
import type { Account } from "./types";
import seed from "../data/seed.json";

const KEY = "painel:accounts:v1";
const hasRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) ||
  !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

function redis() {
  return new Redis({
    url: (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) as string,
    token: (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN) as string,
  });
}

const localFile = path.join(process.cwd(), "data", "runtime.json");
let memory: Account[] | null = null;

export async function getAccounts(): Promise<Account[]> {
  if (hasRedis) {
    const r = redis();
    const data = await r.get<Account[]>(KEY);
    if (data && data.length) return data;
    await r.set(KEY, seed);
    return seed as Account[];
  }
  if (memory) return memory;
  try {
    if (fs.existsSync(localFile)) { memory = JSON.parse(fs.readFileSync(localFile, "utf8")); return memory!; }
  } catch {}
  memory = seed as Account[];
  return memory;
}

export async function saveAccounts(list: Account[]) {
  if (hasRedis) { await redis().set(KEY, list); return; }
  memory = list;
  try { fs.writeFileSync(localFile, JSON.stringify(list)); } catch {}
}

export async function getAccount(id: string) {
  return (await getAccounts()).find((a) => a.id === id);
}

export async function patchAccount(id: string, patch: Partial<Account>) {
  const list = await getAccounts();
  const i = list.findIndex((a) => a.id === id);
  if (i < 0) return null;
  list[i] = { ...list[i], ...patch, report: patch.report ? { ...list[i].report, ...patch.report } as Account["report"] : list[i].report };
  await saveAccounts(list);
  return list[i];
}

// Ingest: a rotina do Claude só atualiza report/metaStatus; contas novas entram completas.
export async function ingest(docs: Partial<Account>[]) {
  const list = await getAccounts();
  let updated = 0, created = 0;
  for (const d of docs) {
    if (!d.id) continue;
    const i = list.findIndex((a) => a.id === d.id);
    if (i < 0) {
      list.push({ active: true, platform: d.id.startsWith("google") ? "google" : "meta", accountId: d.id.split("_")[1], name: d.id, currency: "BRL", ...d } as Account);
      created++;
    } else {
      const cur = list[i];
      if (d.report) cur.report = { ...cur.report, ...d.report } as Account["report"];
      if (d.metaStatus) cur.metaStatus = d.metaStatus;
      updated++;
    }
  }
  await saveAccounts(list);
  return { updated, created };
}
