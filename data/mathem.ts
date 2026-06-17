import type { CategoryId } from "./products";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MathemCategory = CategoryId | "other";

export interface MathemMonthData {
  month: string;
  total: number;
  orderCount: number;
  orders: { date: string; amount: number }[];
}

export interface MathemItem {
  description: string;
  mathemCategory: string;
  mappedCategory: MathemCategory;
  quantity: number;
  totalPrice: number;
  unitPrice: number;
}

export interface MathemFees {
  delivery: number;
  boxes: number;
  pant: number;
  total: number;
}

// ---------------------------------------------------------------------------
// 1. Monthly spending history (from MatHem order list API)
// ---------------------------------------------------------------------------

export const MATHEM_MONTHLY_HISTORY: MathemMonthData[] = [
  {
    month: "Mars",
    total: 9007.5,
    orderCount: 5,
    orders: [
      // Individual order amounts not available for Mars
    ],
  },
  {
    month: "April",
    total: 8959.54,
    orderCount: 6,
    orders: [
      { date: "2025-04-01", amount: 1999.24 },
      { date: "2025-04-05", amount: 1608.82 },
      { date: "2025-04-10", amount: 1906.29 },
      { date: "2025-04-15", amount: 990.59 },
      { date: "2025-04-20", amount: 1041.46 },
      { date: "2025-04-25", amount: 1413.14 },
    ],
  },
  {
    month: "Maj",
    total: 11434.38,
    orderCount: 6,
    orders: [
      { date: "2025-05-01", amount: 1702.37 },
      { date: "2025-05-06", amount: 2052.94 },
      { date: "2025-05-11", amount: 1960.52 },
      { date: "2025-05-16", amount: 1742.59 },
      { date: "2025-05-21", amount: 2438.15 },
      { date: "2025-05-26", amount: 1537.81 },
    ],
  },
  {
    month: "Juni",
    total: 4422.31,
    orderCount: 3,
    orders: [
      { date: "2025-06-01", amount: 1121.42 },
      { date: "2025-06-06", amount: 2063.97 },
      { date: "2025-06-11", amount: 1236.92 },
    ],
  },
];

// ---------------------------------------------------------------------------
// 2. Detailed items from sample order (order vcxmtv, total 1613.46 SEK)
// ---------------------------------------------------------------------------

export const MATHEM_ORDER_ITEMS: MathemItem[] = [
  // ── Mejeri, ost & juice -> dairy ─────────────────────────────────────────
  {
    description: "Arla Mellanmjolk 1.5L",
    mathemCategory: "Mejeri, ost & juice",
    mappedCategory: "dairy",
    quantity: 4,
    totalPrice: 79.8,
    unitPrice: 19.95,
  },
  {
    description: "Oddlygood Havredryck 1L",
    mathemCategory: "Mejeri, ost & juice",
    mappedCategory: "dairy",
    quantity: 2,
    totalPrice: 35.9,
    unitPrice: 17.95,
  },
  {
    description: "Kronagg EKO 10-pack",
    mathemCategory: "Mejeri, ost & juice",
    mappedCategory: "dairy",
    quantity: 1,
    totalPrice: 41.95,
    unitPrice: 41.95,
  },
  {
    description: "Arla Prast 300g",
    mathemCategory: "Mejeri, ost & juice",
    mappedCategory: "dairy",
    quantity: 1,
    totalPrice: 65.95,
    unitPrice: 65.95,
  },
  {
    description: "Bregott 750g",
    mathemCategory: "Mejeri, ost & juice",
    mappedCategory: "dairy",
    quantity: 1,
    totalPrice: 78.5,
    unitPrice: 78.5,
  },
  {
    description: "Parmesan 500g",
    mathemCategory: "Mejeri, ost & juice",
    mappedCategory: "dairy",
    quantity: 1,
    totalPrice: 150.66,
    unitPrice: 150.66, // weight-based, 0.465 kg
  },
  {
    description: "Valio Kvarg 200g",
    mathemCategory: "Mejeri, ost & juice",
    mappedCategory: "dairy",
    quantity: 1,
    totalPrice: 20.5,
    unitPrice: 20.5,
  },
  {
    description: "Arla Graddfil 3dl",
    mathemCategory: "Mejeri, ost & juice",
    mappedCategory: "dairy",
    quantity: 1,
    totalPrice: 15.95,
    unitPrice: 15.95,
  },
  {
    description: "Garant Ricotta 250g",
    mathemCategory: "Mejeri, ost & juice",
    mappedCategory: "dairy",
    quantity: 1,
    totalPrice: 23.5,
    unitPrice: 23.5,
  },

  // ── Barn & baby -> other ─────────────────────────────────────────────────
  {
    description: "Ella's Kitchen Sticks",
    mathemCategory: "Barn & baby",
    mappedCategory: "other",
    quantity: 4,
    totalPrice: 59.8,
    unitPrice: 14.95,
  },
  {
    description: "Semper Grot",
    mathemCategory: "Barn & baby",
    mappedCategory: "other",
    quantity: 2,
    totalPrice: 25.9,
    unitPrice: 12.95,
  },
  {
    description: "Semper Grotklammmis",
    mathemCategory: "Barn & baby",
    mappedCategory: "other",
    quantity: 2,
    totalPrice: 25.9,
    unitPrice: 12.95,
  },

  // ── Frukt & gront -> produce ─────────────────────────────────────────────
  {
    description: "Passionsfrukt",
    mathemCategory: "Frukt & gront",
    mappedCategory: "produce",
    quantity: 4,
    totalPrice: 39.8,
    unitPrice: 9.95,
  },
  {
    description: "Avokado",
    mathemCategory: "Frukt & gront",
    mappedCategory: "produce",
    quantity: 2,
    totalPrice: 25.9,
    unitPrice: 12.95,
  },
  {
    description: "Champinjoner EKO 250g",
    mathemCategory: "Frukt & gront",
    mappedCategory: "produce",
    quantity: 1,
    totalPrice: 41.95,
    unitPrice: 41.95,
  },
  {
    description: "Sotpotatis 350g",
    mathemCategory: "Frukt & gront",
    mappedCategory: "produce",
    quantity: 3,
    totalPrice: 32.85,
    unitPrice: 10.95,
  },
  {
    description: "Schalottenlok 250g",
    mathemCategory: "Frukt & gront",
    mappedCategory: "produce",
    quantity: 1,
    totalPrice: 12.95,
    unitPrice: 12.95,
  },
  {
    description: "Lime",
    mathemCategory: "Frukt & gront",
    mappedCategory: "produce",
    quantity: 4,
    totalPrice: 15.8,
    unitPrice: 3.95,
  },
  {
    description: "Citron",
    mathemCategory: "Frukt & gront",
    mappedCategory: "produce",
    quantity: 2,
    totalPrice: 15.9,
    unitPrice: 7.95,
  },
  {
    description: "Paprika Rod 300g",
    mathemCategory: "Frukt & gront",
    mappedCategory: "produce",
    quantity: 1,
    totalPrice: 20.95,
    unitPrice: 20.95,
  },
  {
    description: "Sallad EKO 65g",
    mathemCategory: "Frukt & gront",
    mappedCategory: "produce",
    quantity: 1,
    totalPrice: 21.95,
    unitPrice: 21.95,
  },
  {
    description: "Morotter 500g",
    mathemCategory: "Frukt & gront",
    mappedCategory: "produce",
    quantity: 1,
    totalPrice: 12.95,
    unitPrice: 12.95,
  },
  {
    description: "Plommon 500g",
    mathemCategory: "Frukt & gront",
    mappedCategory: "produce",
    quantity: 1,
    totalPrice: 27.95,
    unitPrice: 27.95,
  },
  {
    description: "Lok Gul",
    mathemCategory: "Frukt & gront",
    mappedCategory: "produce",
    quantity: 2,
    totalPrice: 7.9,
    unitPrice: 3.95,
  },
  {
    description: "Potatis 2kg",
    mathemCategory: "Frukt & gront",
    mappedCategory: "produce",
    quantity: 1,
    totalPrice: 30.95,
    unitPrice: 30.95,
  },
  {
    description: "Kiwi EKO",
    mathemCategory: "Frukt & gront",
    mappedCategory: "produce",
    quantity: 2,
    totalPrice: 19.9,
    unitPrice: 9.95,
  },
  {
    description: "Brysselkal 500g",
    mathemCategory: "Frukt & gront",
    mappedCategory: "produce",
    quantity: 1,
    totalPrice: 14.95,
    unitPrice: 14.95,
  },
  {
    description: "Gronkal 200g",
    mathemCategory: "Frukt & gront",
    mappedCategory: "produce",
    quantity: 1,
    totalPrice: 35.95,
    unitPrice: 35.95,
  },
  {
    description: "Vitlok",
    mathemCategory: "Frukt & gront",
    mappedCategory: "produce",
    quantity: 1,
    totalPrice: 11.95,
    unitPrice: 11.95,
  },

  // ── Brod & bageri -> bread ───────────────────────────────────────────────
  {
    description: "Polarbrod 440g",
    mathemCategory: "Brod & bageri",
    mappedCategory: "bread",
    quantity: 1,
    totalPrice: 33.95,
    unitPrice: 33.95,
  },

  // ── Dryck -> other ──────────────────────────────────────────────────────
  {
    description: "Kolsyrat Vatten 1.5L",
    mathemCategory: "Dryck",
    mappedCategory: "other",
    quantity: 2,
    totalPrice: 25.9,
    unitPrice: 12.95,
  },
  {
    description: "Appelmust 3L",
    mathemCategory: "Dryck",
    mappedCategory: "other",
    quantity: 1,
    totalPrice: 128.0,
    unitPrice: 128.0,
  },
  {
    description: "Glogg alkoholfri 75cl",
    mathemCategory: "Dryck",
    mappedCategory: "other",
    quantity: 1,
    totalPrice: 33.95,
    unitPrice: 33.95,
  },

  // ── Skafferi -> bread (pantry) ──────────────────────────────────────────
  {
    description: "Gnocchi 500g",
    mathemCategory: "Skafferi",
    mappedCategory: "bread",
    quantity: 1,
    totalPrice: 34.95,
    unitPrice: 34.95,
  },
  {
    description: "Pinjenotter 50g",
    mathemCategory: "Skafferi",
    mappedCategory: "bread",
    quantity: 2,
    totalPrice: 61.9,
    unitPrice: 30.95,
  },

  // ── Kott, chark & fagel -> meat ─────────────────────────────────────────
  {
    description: "Parsons Skinka 120g",
    mathemCategory: "Kott, chark & fagel",
    mappedCategory: "meat",
    quantity: 1,
    totalPrice: 28.95,
    unitPrice: 28.95,
  },
  {
    description: "Kronfagel Kyckling Larfile ~925g",
    mathemCategory: "Kott, chark & fagel",
    mappedCategory: "meat",
    quantity: 1,
    totalPrice: 141.27,
    unitPrice: 141.27, // with 30% spoilage discount
  },

  // ── Fardigmat & mellanmal -> other ──────────────────────────────────────
  {
    description: "Vegoskivor 100g",
    mathemCategory: "Fardigmat & mellanmal",
    mappedCategory: "other",
    quantity: 1,
    totalPrice: 26.95,
    unitPrice: 26.95,
  },

  // ── Hem & hushall -> other ──────────────────────────────────────────────
  {
    description: "Mimea AS Eukalyptus",
    mathemCategory: "Hem & hushall",
    mappedCategory: "other",
    quantity: 1,
    totalPrice: 79.95,
    unitPrice: 79.95,
  },
  {
    description: "Stickers Princess",
    mathemCategory: "Hem & hushall",
    mappedCategory: "other",
    quantity: 1,
    totalPrice: 59.95,
    unitPrice: 59.95,
  },

  // ── Fryst -> produce ────────────────────────────────────────────────────
  {
    description: "Hackad Spenat 1000g",
    mathemCategory: "Fryst",
    mappedCategory: "produce",
    quantity: 1,
    totalPrice: 25.5,
    unitPrice: 25.5,
  },
];

// ---------------------------------------------------------------------------
// 3. Per-order fees
// ---------------------------------------------------------------------------

export const MATHEM_FEES: MathemFees = {
  delivery: 19,
  boxes: 14,
  pant: 4,
  total: 37,
};

// ---------------------------------------------------------------------------
// 4. Helper: sum sample order items by our category system
// ---------------------------------------------------------------------------

export function getMathemCategoryTotals(): Record<MathemCategory, number> {
  const totals: Record<MathemCategory, number> = {
    dairy: 0,
    bread: 0,
    meat: 0,
    produce: 0,
    other: 0,
  };

  for (const item of MATHEM_ORDER_ITEMS) {
    totals[item.mappedCategory] += item.totalPrice;
  }

  // Round to 2 decimal places to avoid floating-point drift
  for (const key of Object.keys(totals) as MathemCategory[]) {
    totals[key] = Math.round(totals[key] * 100) / 100;
  }

  return totals;
}

// ---------------------------------------------------------------------------
// 5. Average monthly spending (full months only: Mars + April + Maj)
// ---------------------------------------------------------------------------

const FULL_MONTHS = MATHEM_MONTHLY_HISTORY.filter(
  (m) => m.month !== "Juni", // Juni is a partial month
);

export const MATHEM_AVG_MONTHLY =
  FULL_MONTHS.reduce((sum, m) => sum + m.total, 0) / FULL_MONTHS.length;
// (9007.50 + 8959.54 + 11434.38) / 3 = ~9800.47 SEK

// ---------------------------------------------------------------------------
// 6. Average weekly spending
// ---------------------------------------------------------------------------

export const MATHEM_AVG_WEEKLY = MATHEM_AVG_MONTHLY / 4.33;
// ~2263.39 SEK

// ---------------------------------------------------------------------------
// 7. Delivery cost estimates
// ---------------------------------------------------------------------------

/** Observed average from full months with known order counts (April: 6, May: 6) */
export const MATHEM_ORDERS_PER_MONTH = 6;

/** Average monthly delivery-related fees (orders/month x fee per order) */
export const MATHEM_DELIVERY_COST_MONTHLY =
  MATHEM_ORDERS_PER_MONTH * MATHEM_FEES.total;
// 6 x 37 = 222 SEK/month
