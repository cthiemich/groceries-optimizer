import type { CategoryId } from "./products";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MathemCategory = CategoryId | "other";

export interface MathemMonthData {
  month: string;
  total: number;
  orderCount: number;
  isPartial?: boolean;
  orders: { date: string; amount: number }[];
}

export interface MathemTopItem {
  description: string;
  mathemCategory: string;
  mappedCategory: MathemCategory;
  totalQty: number;
  totalSpend: number;
  orderCount: number;
  avgUnitPrice: number;
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
    orders: [],
  },
  {
    month: "April",
    total: 8959.54,
    orderCount: 6,
    orders: [
      { date: "2026-04-01", amount: 1413.14 },
      { date: "2026-04-12", amount: 1041.46 },
      { date: "2026-04-16", amount: 990.59 },
      { date: "2026-04-19", amount: 1906.29 },
      { date: "2026-04-25", amount: 1608.82 },
      { date: "2026-04-28", amount: 1999.24 },
    ],
  },
  {
    month: "Maj",
    total: 11434.38,
    orderCount: 6,
    orders: [
      { date: "2026-05-06", amount: 1537.81 },
      { date: "2026-05-10", amount: 2438.15 },
      { date: "2026-05-15", amount: 1742.59 },
      { date: "2026-05-20", amount: 1960.52 },
      { date: "2026-05-24", amount: 2052.94 },
      { date: "2026-05-31", amount: 1702.37 },
    ],
  },
  {
    month: "Juni",
    total: 4422.31,
    orderCount: 3,
    isPartial: true,
    orders: [
      { date: "2026-06-04", amount: 1236.92 },
      { date: "2026-06-08", amount: 2063.97 },
      { date: "2026-06-14", amount: 1121.42 },
    ],
  },
];

// ---------------------------------------------------------------------------
// 2. Top items aggregated across all 15 orders (Apr-Jun 2026)
//    254 unique products, 25,205 SEK total spend
// ---------------------------------------------------------------------------

export const MATHEM_TOP_ITEMS: MathemTopItem[] = [
  // ── DAIRY ───────────────────────────────────────────────────────────────
  { description: "Arla Smör Osaltat 500g", mathemCategory: "Mejeri, ost & juice", mappedCategory: "dairy", totalQty: 11, totalSpend: 666.75, orderCount: 13, avgUnitPrice: 60.61 },
  { description: "Arla Mellanmjölk 1.5% 1.5L", mathemCategory: "Mejeri, ost & juice", mappedCategory: "dairy", totalQty: 43, totalSpend: 743.10, orderCount: 13, avgUnitPrice: 17.28 },
  { description: "Parmigiano Reggiano 150g", mathemCategory: "Mejeri, ost & juice", mappedCategory: "dairy", totalQty: 4, totalSpend: 260.71, orderCount: 5, avgUnitPrice: 65.18 },
  { description: "Halloumi 200g", mathemCategory: "Mejeri, ost & juice", mappedCategory: "dairy", totalQty: 8, totalSpend: 237.01, orderCount: 8, avgUnitPrice: 29.63 },
  { description: "Präst Lagrad 12M ~700g", mathemCategory: "Mejeri, ost & juice", mappedCategory: "dairy", totalQty: 2, totalSpend: 218.19, orderCount: 2, avgUnitPrice: 109.10 },
  { description: "Valio Kvarg Vanilj 200g", mathemCategory: "Mejeri, ost & juice", mappedCategory: "dairy", totalQty: 11, totalSpend: 213.40, orderCount: 7, avgUnitPrice: 19.40 },
  { description: "Fetaost 150g", mathemCategory: "Mejeri, ost & juice", mappedCategory: "dairy", totalQty: 9, totalSpend: 212.49, orderCount: 4, avgUnitPrice: 23.61 },
  { description: "Kronägg EKO 15-pack", mathemCategory: "Mejeri, ost & juice", mappedCategory: "dairy", totalQty: 6, totalSpend: 377.64, orderCount: 6, avgUnitPrice: 62.94 },
  { description: "Oddlygood Havredryck 1L", mathemCategory: "Mejeri, ost & juice", mappedCategory: "dairy", totalQty: 19, totalSpend: 313.84, orderCount: 12, avgUnitPrice: 16.52 },
  { description: "Arla Kvarg 450g", mathemCategory: "Mejeri, ost & juice", mappedCategory: "dairy", totalQty: 6, totalSpend: 144.60, orderCount: 6, avgUnitPrice: 24.10 },
  { description: "Arla Präst 300g skivad", mathemCategory: "Mejeri, ost & juice", mappedCategory: "dairy", totalQty: 2, totalSpend: 110.64, orderCount: 4, avgUnitPrice: 55.32 },
  { description: "Bregott 500g", mathemCategory: "Mejeri, ost & juice", mappedCategory: "dairy", totalQty: 2, totalSpend: 104.02, orderCount: 2, avgUnitPrice: 52.01 },

  // ── BREAD & GRAINS ──────────────────────────────────────────────────────
  { description: "Olivolja Extra Virgin EKO 500ml", mathemCategory: "Skafferi", mappedCategory: "bread", totalQty: 5, totalSpend: 622.09, orderCount: 5, avgUnitPrice: 124.42 },
  { description: "Polarbröd Norrlands 440g", mathemCategory: "Bröd & bageri", mappedCategory: "bread", totalQty: 14, totalSpend: 447.93, orderCount: 15, avgUnitPrice: 32.00 },
  { description: "Havregryn KRAV 650g", mathemCategory: "Skafferi", mappedCategory: "bread", totalQty: 10, totalSpend: 283.50, orderCount: 7, avgUnitPrice: 28.35 },
  { description: "Majskakor Popcorn 125g", mathemCategory: "Bröd & bageri", mappedCategory: "bread", totalQty: 11, totalSpend: 224.30, orderCount: 6, avgUnitPrice: 20.39 },
  { description: "Pinjenötter 50g", mathemCategory: "Skafferi", mappedCategory: "bread", totalQty: 6, totalSpend: 181.44, orderCount: 5, avgUnitPrice: 30.24 },
  { description: "Färsk Pasta Tortelloni 250g", mathemCategory: "Skafferi", mappedCategory: "bread", totalQty: 6, totalSpend: 181.41, orderCount: 5, avgUnitPrice: 30.24 },
  { description: "Quinoa EKO 500g", mathemCategory: "Skafferi", mappedCategory: "bread", totalQty: 2, totalSpend: 111.58, orderCount: 2, avgUnitPrice: 55.79 },

  // ── MEAT & FISH ─────────────────────────────────────────────────────────
  { description: "Kyckling Bröstfilé ~925g", mathemCategory: "Kött, chark & fågel", mappedCategory: "meat", totalQty: 6, totalSpend: 851.10, orderCount: 6, avgUnitPrice: 141.85 },
  { description: "Kalkon Bröstfilé 400g", mathemCategory: "Kött, chark & fågel", mappedCategory: "meat", totalQty: 5, totalSpend: 515.80, orderCount: 5, avgUnitPrice: 103.16 },
  { description: "Färsk Laxfilé 500g", mathemCategory: "Fisk & skaldjur", mappedCategory: "meat", totalQty: 5, totalSpend: 648.31, orderCount: 4, avgUnitPrice: 129.66 },
  { description: "Nötfärs 12% ~1kg", mathemCategory: "Kött, chark & fågel", mappedCategory: "meat", totalQty: 3, totalSpend: 455.99, orderCount: 5, avgUnitPrice: 152.00 },
  { description: "Basturökt Skinka 120g", mathemCategory: "Kött, chark & fågel", mappedCategory: "meat", totalQty: 10, totalSpend: 269.40, orderCount: 11, avgUnitPrice: 26.94 },
  { description: "Gravad Lax 150g", mathemCategory: "Fisk & skaldjur", mappedCategory: "meat", totalQty: 4, totalSpend: 298.46, orderCount: 6, avgUnitPrice: 74.62 },
  { description: "Kycklingfärs Fryst 800g", mathemCategory: "Kött, chark & fågel", mappedCategory: "meat", totalQty: 2, totalSpend: 166.48, orderCount: 2, avgUnitPrice: 83.24 },

  // ── PRODUCE ─────────────────────────────────────────────────────────────
  { description: "Sparris Vit 400g", mathemCategory: "Frukt & grönt", mappedCategory: "produce", totalQty: 13, totalSpend: 1119.35, orderCount: 8, avgUnitPrice: 86.10 },
  { description: "Champinjoner EKO 250g", mathemCategory: "Frukt & grönt", mappedCategory: "produce", totalQty: 12, totalSpend: 451.82, orderCount: 13, avgUnitPrice: 37.65 },
  { description: "Jordgubbar 400g", mathemCategory: "Frukt & grönt", mappedCategory: "produce", totalQty: 5, totalSpend: 369.75, orderCount: 3, avgUnitPrice: 73.95 },
  { description: "Mango", mathemCategory: "Frukt & grönt", mappedCategory: "produce", totalQty: 23, totalSpend: 584.33, orderCount: 12, avgUnitPrice: 25.41 },
  { description: "Äpple Pink Lady 4-pack 600g", mathemCategory: "Frukt & grönt", mappedCategory: "produce", totalQty: 7, totalSpend: 276.29, orderCount: 7, avgUnitPrice: 39.47 },
  { description: "Babyspenat EKO 65g", mathemCategory: "Frukt & grönt", mappedCategory: "produce", totalQty: 13, totalSpend: 268.13, orderCount: 9, avgUnitPrice: 20.63 },
  { description: "Zucchini 355g", mathemCategory: "Frukt & grönt", mappedCategory: "produce", totalQty: 15, totalSpend: 247.68, orderCount: 9, avgUnitPrice: 16.51 },
  { description: "Aubergine 500g", mathemCategory: "Frukt & grönt", mappedCategory: "produce", totalQty: 14, totalSpend: 239.30, orderCount: 5, avgUnitPrice: 17.09 },
  { description: "Paprika Röd", mathemCategory: "Frukt & grönt", mappedCategory: "produce", totalQty: 15, totalSpend: 209.13, orderCount: 9, avgUnitPrice: 13.94 },
  { description: "Sallad EKO 65g", mathemCategory: "Frukt & grönt", mappedCategory: "produce", totalQty: 8, totalSpend: 166.16, orderCount: 8, avgUnitPrice: 20.77 },
  { description: "Potatis 2kg", mathemCategory: "Frukt & grönt", mappedCategory: "produce", totalQty: 5, totalSpend: 146.45, orderCount: 5, avgUnitPrice: 29.29 },
  { description: "Gurka", mathemCategory: "Frukt & grönt", mappedCategory: "produce", totalQty: 7, totalSpend: 123.20, orderCount: 9, avgUnitPrice: 17.60 },
];

// ---------------------------------------------------------------------------
// 3. Aggregated category totals from all 15 orders (product spend only)
// ---------------------------------------------------------------------------

export const MATHEM_CATEGORY_TOTALS: Record<MathemCategory, number> = {
  dairy: 5492.98,
  bread: 4451.99,
  meat: 4006.29,
  produce: 7040.77,
  other: 4212.56,
};

export const MATHEM_TOTAL_PRODUCT_SPEND = 25204.59;
export const MATHEM_TOTAL_ORDERS = 15;
export const MATHEM_UNIQUE_PRODUCTS = 254;

// ---------------------------------------------------------------------------
// 4. Per-order fees (actual averages from 15 orders)
// ---------------------------------------------------------------------------

export const MATHEM_FEES: MathemFees = {
  delivery: 19,
  boxes: 14,
  pant: 4,
  total: 37,
};

export const MATHEM_ACTUAL_TOTAL_FEES = 319.60;
export const MATHEM_AVG_FEES_PER_ORDER = 21.31;

// ---------------------------------------------------------------------------
// 5. Computed averages
// ---------------------------------------------------------------------------

const FULL_MONTHS = MATHEM_MONTHLY_HISTORY.filter((m) => !m.isPartial);

export const MATHEM_AVG_MONTHLY =
  FULL_MONTHS.reduce((sum, m) => sum + m.total, 0) / FULL_MONTHS.length;

export const MATHEM_AVG_WEEKLY = MATHEM_AVG_MONTHLY / 4.33;

export const MATHEM_AVG_ORDER = MATHEM_TOTAL_PRODUCT_SPEND / MATHEM_TOTAL_ORDERS;

export const MATHEM_ORDERS_PER_MONTH = Math.round(
  FULL_MONTHS.reduce((sum, m) => sum + m.orderCount, 0) / FULL_MONTHS.length
);

export const MATHEM_DELIVERY_COST_MONTHLY =
  MATHEM_ORDERS_PER_MONTH * MATHEM_AVG_FEES_PER_ORDER;

// ---------------------------------------------------------------------------
// 6. Helpers
// ---------------------------------------------------------------------------

export function getMathemWeeklyCategoryTotals(): Record<MathemCategory, number> {
  const weeklyFactor = 1 / MATHEM_TOTAL_ORDERS;
  return {
    dairy: Math.round(MATHEM_CATEGORY_TOTALS.dairy * weeklyFactor * 100) / 100,
    bread: Math.round(MATHEM_CATEGORY_TOTALS.bread * weeklyFactor * 100) / 100,
    meat: Math.round(MATHEM_CATEGORY_TOTALS.meat * weeklyFactor * 100) / 100,
    produce: Math.round(MATHEM_CATEGORY_TOTALS.produce * weeklyFactor * 100) / 100,
    other: Math.round(MATHEM_CATEGORY_TOTALS.other * weeklyFactor * 100) / 100,
  };
}
