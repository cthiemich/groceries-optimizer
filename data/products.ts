export type StoreId = "lidl" | "icaMaxi" | "coop";
export type CategoryId = "dairy" | "bread" | "meat" | "produce";
export type TierId = "storeBrand" | "premium";

export interface StorePrice {
  storeBrand: number;
  premium: number;
}

export interface Product {
  id: string;
  name: string;
  swedishName: string;
  category: CategoryId;
  unit: string;
  unitSize: string;
  defaultWeeklyQty: number; // sensible default for family of 4
  prices: Record<StoreId, StorePrice>;
}

export const STORES: Record<StoreId, { name: string; color: string; accentColor: string }> = {
  lidl:   { name: "Lidl",     color: "#0050AA", accentColor: "#FFD700" },
  icaMaxi: { name: "ICA Maxi", color: "#E3000B", accentColor: "#FF6B6B" },
  coop:   { name: "Coop",    color: "#00843D", accentColor: "#4CAF50" },
};

export const CATEGORIES: Record<CategoryId, { name: string; icon: string; color: string }> = {
  dairy:   { name: "Dairy & Eggs",  icon: "🥛", color: "#3B82F6" },
  bread:   { name: "Bread & Grains", icon: "🍞", color: "#F59E0B" },
  meat:    { name: "Meat & Fish",   icon: "🥩", color: "#EF4444" },
  produce: { name: "Fruit & Veg",   icon: "🥦", color: "#10B981" },
};

// Prices in SEK — realistic 2024/2025 benchmarks for Huddinge, Stockholm
// storeBrand = Lidl own-label / ICA Basic / Coop Änglamark/Budget
// premium    = named brand (Arla, Scan, etc.)
export const PRODUCTS: Product[] = [
  // ── DAIRY & EGGS ──────────────────────────────────────────────────────────
  {
    id: "milk",
    name: "Whole Milk",
    swedishName: "Mjölk 3%",
    category: "dairy",
    unit: "litre",
    unitSize: "1 L",
    defaultWeeklyQty: 4,
    prices: {
      lidl:    { storeBrand: 11.90, premium: 14.50 },
      icaMaxi: { storeBrand: 13.90, premium: 16.90 },
      coop:    { storeBrand: 13.50, premium: 15.90 },
    },
  },
  {
    id: "yogurt",
    name: "Natural Yogurt",
    swedishName: "Naturell yoghurt",
    category: "dairy",
    unit: "pack",
    unitSize: "500 g",
    defaultWeeklyQty: 2,
    prices: {
      lidl:    { storeBrand: 14.90, premium: 22.90 },
      icaMaxi: { storeBrand: 17.90, premium: 25.90 },
      coop:    { storeBrand: 16.50, premium: 24.50 },
    },
  },
  {
    id: "cheese",
    name: "Swedish Cheese",
    swedishName: "Hushållsost",
    category: "dairy",
    unit: "pack",
    unitSize: "400 g",
    defaultWeeklyQty: 1,
    prices: {
      lidl:    { storeBrand: 44.90, premium: 62.90 },
      icaMaxi: { storeBrand: 54.90, premium: 72.90 },
      coop:    { storeBrand: 49.90, premium: 68.90 },
    },
  },
  {
    id: "butter",
    name: "Butter",
    swedishName: "Smör",
    category: "dairy",
    unit: "pack",
    unitSize: "500 g",
    defaultWeeklyQty: 1,
    prices: {
      lidl:    { storeBrand: 34.90, premium: 44.90 },
      icaMaxi: { storeBrand: 42.90, premium: 52.90 },
      coop:    { storeBrand: 39.90, premium: 49.90 },
    },
  },
  {
    id: "eggs",
    name: "Eggs",
    swedishName: "Ägg",
    category: "dairy",
    unit: "pack",
    unitSize: "12-pack",
    defaultWeeklyQty: 2,
    prices: {
      lidl:    { storeBrand: 28.90, premium: 42.90 },
      icaMaxi: { storeBrand: 35.90, premium: 49.90 },
      coop:    { storeBrand: 32.90, premium: 47.90 },
    },
  },
  // ── BREAD & GRAINS ────────────────────────────────────────────────────────
  {
    id: "bread",
    name: "Whole-grain Bread",
    swedishName: "Grovt bröd",
    category: "bread",
    unit: "loaf",
    unitSize: "700 g",
    defaultWeeklyQty: 2,
    prices: {
      lidl:    { storeBrand: 17.90, premium: 32.90 },
      icaMaxi: { storeBrand: 24.90, premium: 36.90 },
      coop:    { storeBrand: 21.90, premium: 34.90 },
    },
  },
  {
    id: "crispbread",
    name: "Crispbread",
    swedishName: "Knäckebröd",
    category: "bread",
    unit: "pack",
    unitSize: "500 g",
    defaultWeeklyQty: 1,
    prices: {
      lidl:    { storeBrand: 21.90, premium: 32.90 },
      icaMaxi: { storeBrand: 28.90, premium: 38.90 },
      coop:    { storeBrand: 24.90, premium: 35.90 },
    },
  },
  {
    id: "pasta",
    name: "Pasta",
    swedishName: "Pasta",
    category: "bread",
    unit: "pack",
    unitSize: "500 g",
    defaultWeeklyQty: 2,
    prices: {
      lidl:    { storeBrand: 9.90,  premium: 16.90 },
      icaMaxi: { storeBrand: 13.90, premium: 19.90 },
      coop:    { storeBrand: 11.90, premium: 18.90 },
    },
  },
  {
    id: "rice",
    name: "Long-grain Rice",
    swedishName: "Långkornigt ris",
    category: "bread",
    unit: "bag",
    unitSize: "1 kg",
    defaultWeeklyQty: 1,
    prices: {
      lidl:    { storeBrand: 19.90, premium: 29.90 },
      icaMaxi: { storeBrand: 27.90, premium: 36.90 },
      coop:    { storeBrand: 24.90, premium: 33.90 },
    },
  },
  {
    id: "oats",
    name: "Rolled Oats",
    swedishName: "Havregryn",
    category: "bread",
    unit: "bag",
    unitSize: "750 g",
    defaultWeeklyQty: 1,
    prices: {
      lidl:    { storeBrand: 14.90, premium: 22.90 },
      icaMaxi: { storeBrand: 19.90, premium: 27.90 },
      coop:    { storeBrand: 17.90, premium: 25.90 },
    },
  },
  // ── MEAT & FISH ───────────────────────────────────────────────────────────
  {
    id: "chicken",
    name: "Chicken Breast",
    swedishName: "Kycklingbröstfilé",
    category: "meat",
    unit: "kg",
    unitSize: "1 kg",
    defaultWeeklyQty: 1,
    prices: {
      lidl:    { storeBrand: 89.90,  premium: 109.90 },
      icaMaxi: { storeBrand: 99.90,  premium: 119.90 },
      coop:    { storeBrand: 94.90,  premium: 114.90 },
    },
  },
  {
    id: "groundBeef",
    name: "Ground Beef (12% fat)",
    swedishName: "Nötfärs 12%",
    category: "meat",
    unit: "pack",
    unitSize: "500 g",
    defaultWeeklyQty: 1,
    prices: {
      lidl:    { storeBrand: 54.90, premium: 72.90 },
      icaMaxi: { storeBrand: 64.90, premium: 84.90 },
      coop:    { storeBrand: 59.90, premium: 79.90 },
    },
  },
  {
    id: "pork",
    name: "Pork Shoulder",
    swedishName: "Fläskkött",
    category: "meat",
    unit: "pack",
    unitSize: "500 g",
    defaultWeeklyQty: 1,
    prices: {
      lidl:    { storeBrand: 49.90, premium: 68.90 },
      icaMaxi: { storeBrand: 61.90, premium: 79.90 },
      coop:    { storeBrand: 56.90, premium: 74.90 },
    },
  },
  {
    id: "salmon",
    name: "Salmon Fillet",
    swedishName: "Laxfilé",
    category: "meat",
    unit: "pack",
    unitSize: "400 g",
    defaultWeeklyQty: 1,
    prices: {
      lidl:    { storeBrand: 59.90, premium: 89.90 },
      icaMaxi: { storeBrand: 74.90, premium: 99.90 },
      coop:    { storeBrand: 69.90, premium: 94.90 },
    },
  },
  // ── FRUIT & VEG ───────────────────────────────────────────────────────────
  {
    id: "bananas",
    name: "Bananas",
    swedishName: "Bananer",
    category: "produce",
    unit: "kg",
    unitSize: "1 kg",
    defaultWeeklyQty: 2,
    prices: {
      lidl:    { storeBrand: 15.90, premium: 19.90 },
      icaMaxi: { storeBrand: 21.90, premium: 26.90 },
      coop:    { storeBrand: 18.90, premium: 23.90 },
    },
  },
  {
    id: "apples",
    name: "Apples",
    swedishName: "Äpplen",
    category: "produce",
    unit: "kg",
    unitSize: "1 kg",
    defaultWeeklyQty: 1,
    prices: {
      lidl:    { storeBrand: 21.90, premium: 29.90 },
      icaMaxi: { storeBrand: 28.90, premium: 36.90 },
      coop:    { storeBrand: 24.90, premium: 33.90 },
    },
  },
  {
    id: "potatoes",
    name: "Potatoes",
    swedishName: "Potatis",
    category: "produce",
    unit: "bag",
    unitSize: "1.5 kg",
    defaultWeeklyQty: 2,
    prices: {
      lidl:    { storeBrand: 17.90, premium: 24.90 },
      icaMaxi: { storeBrand: 24.90, premium: 32.90 },
      coop:    { storeBrand: 21.90, premium: 29.90 },
    },
  },
  {
    id: "carrots",
    name: "Carrots",
    swedishName: "Morötter",
    category: "produce",
    unit: "bag",
    unitSize: "500 g",
    defaultWeeklyQty: 2,
    prices: {
      lidl:    { storeBrand: 9.90,  premium: 14.90 },
      icaMaxi: { storeBrand: 14.90, premium: 19.90 },
      coop:    { storeBrand: 12.90, premium: 17.90 },
    },
  },
  {
    id: "tomatoes",
    name: "Tomatoes",
    swedishName: "Tomater",
    category: "produce",
    unit: "pack",
    unitSize: "500 g",
    defaultWeeklyQty: 2,
    prices: {
      lidl:    { storeBrand: 19.90, premium: 28.90 },
      icaMaxi: { storeBrand: 27.90, premium: 35.90 },
      coop:    { storeBrand: 23.90, premium: 32.90 },
    },
  },
  {
    id: "onions",
    name: "Yellow Onions",
    swedishName: "Gul lök",
    category: "produce",
    unit: "bag",
    unitSize: "1 kg",
    defaultWeeklyQty: 1,
    prices: {
      lidl:    { storeBrand: 11.90, premium: 17.90 },
      icaMaxi: { storeBrand: 17.90, premium: 23.90 },
      coop:    { storeBrand: 14.90, premium: 20.90 },
    },
  },
  {
    id: "cucumber",
    name: "Cucumber",
    swedishName: "Gurka",
    category: "produce",
    unit: "piece",
    unitSize: "1 pcs",
    defaultWeeklyQty: 2,
    prices: {
      lidl:    { storeBrand: 9.90,  premium: 13.90 },
      icaMaxi: { storeBrand: 13.90, premium: 18.90 },
      coop:    { storeBrand: 11.90, premium: 16.90 },
    },
  },
];

// Huddinge-specific weekly offer patterns (% off regular price, rotating schedule)
export const HUDDINGE_WEEKLY_OFFERS: Record<StoreId, { category: CategoryId; discountPct: number; weekPattern: number[] }[]> = {
  lidl: [
    { category: "meat",    discountPct: 20, weekPattern: [1, 3] },
    { category: "produce", discountPct: 15, weekPattern: [2, 4] },
    { category: "dairy",   discountPct: 10, weekPattern: [1, 2, 3, 4] },
  ],
  icaMaxi: [
    { category: "meat",    discountPct: 25, weekPattern: [2, 4] },
    { category: "dairy",   discountPct: 15, weekPattern: [1, 3] },
    { category: "bread",   discountPct: 10, weekPattern: [1, 2, 3, 4] },
  ],
  coop: [
    { category: "produce", discountPct: 20, weekPattern: [1, 3] },
    { category: "bread",   discountPct: 15, weekPattern: [2, 4] },
    { category: "meat",    discountPct: 10, weekPattern: [1, 2] },
  ],
};
