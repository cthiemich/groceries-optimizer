import { PRODUCTS, STORES, HUDDINGE_WEEKLY_OFFERS, type StoreId, type CategoryId, type TierId } from "@/data/products";

export interface WeeklyQuantities {
  [productId: string]: number;
}

export interface TierPreferences {
  [productId: string]: TierId;
}

export interface StoreTotal {
  storeId: StoreId;
  storeName: string;
  total: number;
  breakdown: { category: CategoryId; total: number }[];
}

export interface OptimizedItem {
  productId: string;
  productName: string;
  swedishName: string;
  category: CategoryId;
  unit: string;
  qty: number;
  bestStore: StoreId;
  bestStoreName: string;
  bestPrice: number;
  worstPrice: number;
  savings: number;
  allPrices: Record<StoreId, number>;
}

export interface OptimizationResult {
  optimizedTotal: number;
  cheapestSingleStore: { storeId: StoreId; total: number };
  mostExpensiveSingleStore: { storeId: StoreId; total: number };
  absoluteSavings: number;
  savingsPct: number;
  monthlyOptimized: number;
  monthlyCheapest: number;
  monthlySavings: number;
  items: OptimizedItem[];
  storeAllocations: Record<StoreId, { items: string[]; subtotal: number }>;
  storeTotals: StoreTotal[];
}

export interface SensitivityScenario {
  label: string;
  discounts: Record<StoreId, Record<CategoryId, number>>;
  monthlyTotal: number;
  monthlySavings: number;
  savingsPct: number;
}

function getEffectivePrice(
  product: typeof PRODUCTS[0],
  storeId: StoreId,
  tier: TierId,
  offerDiscounts: Record<StoreId, Record<CategoryId, number>>
): number {
  const base = product.prices[storeId][tier];
  const discount = offerDiscounts[storeId]?.[product.category] ?? 0;
  return base * (1 - discount / 100);
}

export function computeStoreTotals(
  quantities: WeeklyQuantities,
  tiers: TierPreferences,
  offerDiscounts: Record<StoreId, Record<CategoryId, number>> = defaultDiscounts()
): StoreTotal[] {
  return (Object.keys(STORES) as StoreId[]).map((storeId) => {
    const breakdown: Record<CategoryId, number> = { dairy: 0, bread: 0, meat: 0, produce: 0 };

    PRODUCTS.forEach((p) => {
      const qty = quantities[p.id] ?? p.defaultWeeklyQty;
      if (qty === 0) return;
      const tier = tiers[p.id] ?? "storeBrand";
      const price = getEffectivePrice(p, storeId, tier, offerDiscounts);
      breakdown[p.category] += price * qty;
    });

    const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
    return {
      storeId,
      storeName: STORES[storeId].name,
      total,
      breakdown: (Object.entries(breakdown) as [CategoryId, number][]).map(([category, total]) => ({ category, total })),
    };
  });
}

export function optimize(
  quantities: WeeklyQuantities,
  tiers: TierPreferences,
  offerDiscounts: Record<StoreId, Record<CategoryId, number>> = defaultDiscounts()
): OptimizationResult {
  const storeTotals = computeStoreTotals(quantities, tiers, offerDiscounts);
  const sorted = [...storeTotals].sort((a, b) => a.total - b.total);
  const cheapest = sorted[0];
  const mostExpensive = sorted[sorted.length - 1];

  const storeIds = Object.keys(STORES) as StoreId[];
  const storeAllocations: Record<StoreId, { items: string[]; subtotal: number }> = {
    lidl:    { items: [], subtotal: 0 },
    icaMaxi: { items: [], subtotal: 0 },
    coop:    { items: [], subtotal: 0 },
  };

  const items: OptimizedItem[] = PRODUCTS.map((p) => {
    const qty = quantities[p.id] ?? p.defaultWeeklyQty;
    const tier = tiers[p.id] ?? "storeBrand";

    const allPrices = Object.fromEntries(
      storeIds.map((s) => [s, getEffectivePrice(p, s, tier, offerDiscounts)])
    ) as Record<StoreId, number>;

    const bestStore = storeIds.reduce((a, b) => (allPrices[a] <= allPrices[b] ? a : b));
    const worstPrice = Math.max(...Object.values(allPrices));
    const bestPrice = allPrices[bestStore];

    return {
      productId: p.id,
      productName: p.name,
      swedishName: p.swedishName,
      category: p.category,
      unit: p.unit,
      qty,
      bestStore,
      bestStoreName: STORES[bestStore].name,
      bestPrice,
      worstPrice,
      savings: (worstPrice - bestPrice) * qty,
      allPrices,
    };
  });

  let optimizedTotal = 0;
  items.forEach((item) => {
    if (item.qty === 0) return;
    const cost = item.bestPrice * item.qty;
    optimizedTotal += cost;
    storeAllocations[item.bestStore].items.push(item.productName);
    storeAllocations[item.bestStore].subtotal += cost;
  });

  const absoluteSavings = mostExpensive.total - optimizedTotal;
  const savingsPct = (absoluteSavings / mostExpensive.total) * 100;

  return {
    optimizedTotal,
    cheapestSingleStore: { storeId: cheapest.storeId, total: cheapest.total },
    mostExpensiveSingleStore: { storeId: mostExpensive.storeId, total: mostExpensive.total },
    absoluteSavings,
    savingsPct,
    monthlyOptimized: optimizedTotal * 4.33,
    monthlyCheapest: cheapest.total * 4.33,
    monthlySavings: (cheapest.total - optimizedTotal) * 4.33,
    items,
    storeAllocations,
    storeTotals,
  };
}

export function computeSensitivityScenarios(
  quantities: WeeklyQuantities,
  tiers: TierPreferences
): SensitivityScenario[] {
  const categories: CategoryId[] = ["dairy", "bread", "meat", "produce"];
  const storeIds = Object.keys(STORES) as StoreId[];

  const scenarios: SensitivityScenario[] = [
    {
      label: "No offers (baseline)",
      discounts: buildUniformDiscounts(0),
      monthlyTotal: 0,
      monthlySavings: 0,
      savingsPct: 0,
    },
    {
      label: "Typical weekly offers",
      discounts: buildTypicalDiscounts(),
      monthlyTotal: 0,
      monthlySavings: 0,
      savingsPct: 0,
    },
    {
      label: "Strong offer week",
      discounts: buildUniformDiscounts(20),
      monthlyTotal: 0,
      monthlySavings: 0,
      savingsPct: 0,
    },
    {
      label: "Mega sale (bank holiday)",
      discounts: buildUniformDiscounts(30),
      monthlyTotal: 0,
      monthlySavings: 0,
      savingsPct: 0,
    },
    {
      label: "Lidl flagship week",
      discounts: buildStoreBoostDiscounts("lidl", 25),
      monthlyTotal: 0,
      monthlySavings: 0,
      savingsPct: 0,
    },
    {
      label: "ICA Maxi member week",
      discounts: buildStoreBoostDiscounts("icaMaxi", 25),
      monthlyTotal: 0,
      monthlySavings: 0,
      savingsPct: 0,
    },
  ];

  const baselineResult = optimize(quantities, tiers, buildUniformDiscounts(0));
  const baselineMonthly = baselineResult.optimizedTotal * 4.33;

  scenarios.forEach((scenario) => {
    const result = optimize(quantities, tiers, scenario.discounts);
    scenario.monthlyTotal = result.monthlyOptimized;
    scenario.monthlySavings = baselineMonthly - result.monthlyOptimized;
    scenario.savingsPct = (scenario.monthlySavings / baselineMonthly) * 100;
  });

  return scenarios;
}

export function buildUniformDiscounts(pct: number): Record<StoreId, Record<CategoryId, number>> {
  const cats: CategoryId[] = ["dairy", "bread", "meat", "produce"];
  const stores = Object.keys(STORES) as StoreId[];
  const result = {} as Record<StoreId, Record<CategoryId, number>>;
  stores.forEach((s) => {
    result[s] = {} as Record<CategoryId, number>;
    cats.forEach((c) => { result[s][c] = pct; });
  });
  return result;
}

function buildTypicalDiscounts(): Record<StoreId, Record<CategoryId, number>> {
  const cats: CategoryId[] = ["dairy", "bread", "meat", "produce"];
  const stores = Object.keys(STORES) as StoreId[];
  const result = {} as Record<StoreId, Record<CategoryId, number>>;
  stores.forEach((s) => {
    result[s] = {} as Record<CategoryId, number>;
    cats.forEach((c) => { result[s][c] = 0; });
  });
  // Apply Huddinge patterns — average across the 4-week month
  HUDDINGE_WEEKLY_OFFERS.lidl.forEach((o) => {
    result.lidl[o.category] = (o.discountPct * o.weekPattern.length) / 4;
  });
  HUDDINGE_WEEKLY_OFFERS.icaMaxi.forEach((o) => {
    result.icaMaxi[o.category] = (o.discountPct * o.weekPattern.length) / 4;
  });
  HUDDINGE_WEEKLY_OFFERS.coop.forEach((o) => {
    result.coop[o.category] = (o.discountPct * o.weekPattern.length) / 4;
  });
  return result;
}

function buildStoreBoostDiscounts(boostStore: StoreId, pct: number): Record<StoreId, Record<CategoryId, number>> {
  const base = buildUniformDiscounts(5);
  const cats: CategoryId[] = ["dairy", "bread", "meat", "produce"];
  cats.forEach((c) => { base[boostStore][c] = pct; });
  return base;
}

export function defaultDiscounts(): Record<StoreId, Record<CategoryId, number>> {
  return buildUniformDiscounts(0);
}

export function computeBrandBreakdown(
  quantities: WeeklyQuantities,
  offerDiscounts: Record<StoreId, Record<CategoryId, number>> = defaultDiscounts()
) {
  const storeIds = Object.keys(STORES) as StoreId[];
  return PRODUCTS.map((p) => {
    const qty = quantities[p.id] ?? p.defaultWeeklyQty;
    const storeBrandPrices = Object.fromEntries(
      storeIds.map((s) => [s, getEffectivePrice(p, s, "storeBrand", offerDiscounts)])
    ) as Record<StoreId, number>;
    const premiumPrices = Object.fromEntries(
      storeIds.map((s) => [s, getEffectivePrice(p, s, "premium", offerDiscounts)])
    ) as Record<StoreId, number>;

    const bestStoreBrand = Math.min(...Object.values(storeBrandPrices));
    const bestPremium = Math.min(...Object.values(premiumPrices));
    const premiumPremium = bestPremium - bestStoreBrand;
    const premiumPct = (premiumPremium / bestStoreBrand) * 100;

    return {
      product: p,
      qty,
      bestStoreBrandPrice: bestStoreBrand,
      bestPremiumPrice: bestPremium,
      weeklyStoreBrandCost: bestStoreBrand * qty,
      weeklyPremiumCost: bestPremium * qty,
      premiumPremium,
      premiumPct,
    };
  });
}
