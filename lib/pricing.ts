// Single source of truth for all monetization/financial figures shown on the
// site. Everything is read from the platform's public monetization endpoint
// (the same admin-managed config the app uses); numbers must never be hardcoded
// in components or i18n. The FALLBACK below is only used when the endpoint is
// unreachable at build/revalidate time.

const API_BASE = process.env.CYQLE_API_URL || 'https://api.cyqle.in';
const PUBLIC_TIERS_URL = `${API_BASE}/subscriptions/public/tiers`;

// Home groups the platform's five tiers into three display plans; "pro" fans
// out into the standard/turbo/max power tiers.
export type PlanKey = 'free' | 'lite' | 'standard' | 'turbo' | 'max';

const TIER_TO_PLAN: Record<string, PlanKey> = {
  free: 'free',
  lite: 'lite',
  'pro-standard': 'standard',
  'pro-turbo': 'turbo',
  'pro-max': 'max',
};

export interface PlanData {
  monthly: number; // USD / month
  creditPrice: number; // USD / credit (pay-as-you-go)
  vcpu: number;
  ramGB: number;
  storageGB: number; // 0 => no persistence
  bandwidthMbps: number;
  powerMultiplier: number;
  sessionMinutes: number; // -1 => unlimited
  aiCreditsPerMonth: number; // In-House AI Agent credits included / month
  apiAccess: boolean;
  snapshots: boolean;
  persistence: boolean;
  aiAgent: boolean; // In-House AI Agent available on this plan
}

export interface CreditPack {
  id: string;
  priceUSD: number;
  userCredits: number; // credits shown to the user (meter cents / centsPerCredit)
  approxTasks: number | null;
  highlight: boolean;
}

export interface PricingData {
  plans: Record<PlanKey, PlanData>;
  creditPacks: CreditPack[];
  creditHours: number; // desktop hours per credit (creditMinutes / 60)
}

// Baked from the platform config; used verbatim only if the endpoint fails.
export const FALLBACK_PRICING: PricingData = {
  plans: {
    free: {
      monthly: 0,
      creditPrice: 0,
      vcpu: 1,
      ramGB: 1,
      storageGB: 0,
      bandwidthMbps: 10,
      powerMultiplier: 1,
      sessionMinutes: 60,
      aiCreditsPerMonth: 0,
      apiAccess: true,
      snapshots: false,
      persistence: false,
      aiAgent: false,
    },
    lite: {
      monthly: 6,
      creditPrice: 0.2,
      vcpu: 1,
      ramGB: 2,
      storageGB: 20,
      bandwidthMbps: 100,
      powerMultiplier: 1,
      sessionMinutes: -1,
      aiCreditsPerMonth: 9,
      apiAccess: true,
      snapshots: true,
      persistence: true,
      aiAgent: true,
    },
    standard: {
      monthly: 12,
      creditPrice: 0.4,
      vcpu: 2,
      ramGB: 4,
      storageGB: 40,
      bandwidthMbps: 150,
      powerMultiplier: 1,
      sessionMinutes: -1,
      aiCreditsPerMonth: 18,
      apiAccess: true,
      snapshots: true,
      persistence: true,
      aiAgent: true,
    },
    turbo: {
      monthly: 23,
      creditPrice: 0.77,
      vcpu: 4,
      ramGB: 8,
      storageGB: 60,
      bandwidthMbps: 200,
      powerMultiplier: 2,
      sessionMinutes: -1,
      aiCreditsPerMonth: 34.5,
      apiAccess: true,
      snapshots: true,
      persistence: true,
      aiAgent: true,
    },
    max: {
      monthly: 45,
      creditPrice: 1.51,
      vcpu: 8,
      ramGB: 16,
      storageGB: 120,
      bandwidthMbps: 300,
      powerMultiplier: 4,
      sessionMinutes: -1,
      aiCreditsPerMonth: 67.5,
      apiAccess: true,
      snapshots: true,
      persistence: true,
      aiAgent: true,
    },
  },
  creditPacks: [
    { id: 'starter', priceUSD: 5, userCredits: 10, approxTasks: 8, highlight: false },
    { id: 'plus', priceUSD: 15, userCredits: 35, approxTasks: 28, highlight: true },
    { id: 'power', priceUSD: 40, userCredits: 100, approxTasks: 80, highlight: false },
  ],
  creditHours: 10,
};

interface RawTier {
  id: string;
  pricing?: { monthly?: number; creditMinutes?: number; creditPrice?: number };
  limits?: {
    maxSessionDurationMinutes?: number;
    maxStorageGB?: number;
    hasApiAccess?: boolean;
    hasSnapshotAccess?: boolean;
    powerMultiplier?: number;
    vcpu?: number;
    memoryGB?: number;
    bandwidthDownlink?: string;
    llmMonthlyCostCents?: number;
  };
  features?: { persistence?: boolean; apiAccess?: boolean; browserAgent?: boolean };
}

interface RawPack {
  id: string;
  priceUSD?: number;
  creditsCents?: number;
  approxTasks?: number | null;
  highlight?: boolean;
}

function mbps(bandwidth: string | undefined): number {
  const n = parseInt(String(bandwidth ?? ''), 10);
  return Number.isFinite(n) ? n : 0;
}

function mapTier(tier: RawTier, centsPerCredit: number): PlanData {
  const p = tier.pricing ?? {};
  const l = tier.limits ?? {};
  const f = tier.features ?? {};
  const llmMonthlyCents = l.llmMonthlyCostCents ?? 0;
  return {
    monthly: p.monthly ?? 0,
    creditPrice: p.creditPrice ?? 0,
    vcpu: l.vcpu ?? 0,
    ramGB: l.memoryGB ?? 0,
    storageGB: l.maxStorageGB ?? 0,
    bandwidthMbps: mbps(l.bandwidthDownlink),
    powerMultiplier: l.powerMultiplier ?? 1,
    sessionMinutes: l.maxSessionDurationMinutes ?? -1,
    aiCreditsPerMonth: centsPerCredit > 0 ? llmMonthlyCents / centsPerCredit : 0,
    apiAccess: f.apiAccess ?? l.hasApiAccess ?? false,
    snapshots: l.hasSnapshotAccess ?? false,
    persistence: f.persistence ?? (l.maxStorageGB ?? 0) > 0,
    aiAgent: f.browserAgent ?? false,
  };
}

/**
 * Fetch the canonical pricing from the platform. Server-side only; cached with
 * ISR so admin edits (re-polled into the endpoint) propagate without a redeploy.
 * Falls back to shipped defaults if the endpoint is unavailable.
 */
export async function getPricing(): Promise<PricingData> {
  try {
    const res = await fetch(PUBLIC_TIERS_URL, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const data = json?.data;
    const rawTiers: RawTier[] = data?.tiers ?? [];
    if (!rawTiers.length) throw new Error('no tiers');

    const centsPerCredit = data?.parity?.centsPerCredit ?? 20;

    const plans = { ...FALLBACK_PRICING.plans };
    for (const tier of rawTiers) {
      const key = TIER_TO_PLAN[tier.id];
      if (key) plans[key] = mapTier(tier, centsPerCredit);
    }

    const rawPacks: RawPack[] = data?.creditPacks ?? [];
    const creditPacks: CreditPack[] = rawPacks.length
      ? rawPacks.map((pack) => ({
          id: pack.id,
          priceUSD: pack.priceUSD ?? 0,
          userCredits:
            centsPerCredit > 0 ? Math.round((pack.creditsCents ?? 0) / centsPerCredit) : 0,
          approxTasks: pack.approxTasks ?? null,
          highlight: !!pack.highlight,
        }))
      : FALLBACK_PRICING.creditPacks;

    // creditMinutes is uniform across tiers; read it off the first that has one.
    const creditMinutes = rawTiers.find((t) => t.pricing?.creditMinutes)?.pricing?.creditMinutes;

    return {
      plans,
      creditPacks,
      creditHours: creditMinutes ? creditMinutes / 60 : FALLBACK_PRICING.creditHours,
    };
  } catch {
    return FALLBACK_PRICING;
  }
}
