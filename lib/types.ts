export type Platform = "meta" | "google";
export type Verdict = "scale" | "cut" | "ok" | "sleeping";

export interface CustomConversion { name: string; count: number; costPer?: number | null; value?: number | null }

export interface Balance {
  kind: "pre" | "pos";
  amount?: number;
  currency: string;
  dailyAvg?: number;
  runwayDays?: number | null;
  estimatedEnd?: string | null;
  suggestedRecharge?: number;
  projection30d?: number;
  paymentText?: string;
  capTotal?: number;
  capSpent?: number;
  capRemaining?: number;
  capRunwayDays?: number;
  estimated?: boolean;
}

export interface Metrics {
  reach?: number; impressions?: number; frequency?: number;
  clicks?: number; ctr?: number; cpm?: number;
  revenue?: number; roas?: number;
}

export interface Report {
  updatedAt: string;
  periodStart?: string; // AAAA-MM-DD
  periodEnd?: string;
  spendYesterday?: number; spend7d?: number; spendPrev7d?: number;
  results7d?: number | null; resultsPrev7d?: number | null;
  costPerResult?: number | null;
  daysSinceSpend?: number;
  verdict?: Verdict;
  billingIssue?: boolean;
  customConversions?: CustomConversion[];
  balance?: Balance;
  metrics?: Metrics;
  note?: string;
  analysis?: string;       // "Como foi a semana"
  actions?: string[];      // "O que vamos fazer"
}

export interface Account {
  id: string; // meta_<id> | google_<id>
  platform: Platform;
  accountId: string;
  name: string;
  currency: string;
  active: boolean;
  billing?: "pre" | "pos" | "";
  minBalance?: number | null;
  rechargeAmount?: number | null;
  rechargeDate?: string | null;
  objective?: "conversas" | "leads" | "vendas" | "cliques" | "outro";
  targetCost?: number | null;
  stepPct?: number;
  metaStatus?: string;
  report?: Report;
}
