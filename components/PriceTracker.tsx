"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PRODUCTS, STORES, CATEGORIES, type StoreId, type CategoryId } from "@/data/products";

// Simulated 12-week Huddinge price history (slight random drift around realistic prices)
function generateHistory(basePrice: number, weeks: number, volatility = 0.05) {
  let price = basePrice;
  return Array.from({ length: weeks }, (_, w) => {
    const drift = (Math.random() - 0.48) * volatility * basePrice;
    price = Math.max(basePrice * 0.8, Math.min(basePrice * 1.2, price + drift));
    // Occasional offer spike every 3-4 weeks
    if (w % 4 === 3) price = basePrice * (0.8 + Math.random() * 0.05);
    return parseFloat(price.toFixed(2));
  });
}

// Stable seed-based pseudo-random for reproducible UI
function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function generateStableHistory(basePrice: number, weeks: number, productSeed: number) {
  const prices: number[] = [];
  let price = basePrice;
  for (let w = 0; w < weeks; w++) {
    const r = seededRandom(productSeed * 100 + w);
    const drift = (r - 0.48) * 0.05 * basePrice;
    price = Math.max(basePrice * 0.78, Math.min(basePrice * 1.22, price + drift));
    if (w % 4 === 3) price = basePrice * (0.78 + seededRandom(productSeed + w) * 0.06);
    prices.push(parseFloat(price.toFixed(2)));
  }
  return prices;
}

const WEEKS = 12;
const weekLabels = Array.from({ length: WEEKS }, (_, i) => `W${i + 1}`);

export default function PriceTracker() {
  const [selectedCat, setSelectedCat] = useState<CategoryId | "all">("all");
  const [selectedProduct, setSelectedProduct] = useState<string>(PRODUCTS[0].id);

  const catIds = Object.keys(CATEGORIES) as CategoryId[];
  const filtered = selectedCat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === selectedCat);
  const product = PRODUCTS.find((p) => p.id === selectedProduct) ?? PRODUCTS[0];

  // Build chart data for selected product
  const storeIds = Object.keys(STORES) as StoreId[];
  const histories = storeIds.map((sid, si) =>
    generateStableHistory(product.prices[sid].storeBrand, WEEKS, PRODUCTS.indexOf(product) * 3 + si)
  );

  const chartData = weekLabels.map((week, wi) => {
    const row: Record<string, string | number> = { week };
    storeIds.forEach((sid, si) => { row[STORES[sid].name] = histories[si][wi]; });
    return row;
  });

  // Price table: current best/worst
  const priceMatrix = filtered.map((p) => {
    const prices = storeIds.map((s) => p.prices[s].storeBrand);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { product: p, prices, min, max, spread: max - min, spreadPct: ((max - min) / min) * 100 };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Huddinge Local Price Tracker</h2>
        <p className="text-sm text-gray-500 mt-0.5">12-week price history and current store-brand benchmarks for the Huddinge area</p>
      </div>

      {/* Alert bar */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <span className="text-xl">📍</span>
        <div>
          <p className="text-sm font-semibold text-amber-800">Huddinge Price Zone — Stockholm South</p>
          <p className="text-xs text-amber-600 mt-0.5">
            Covers: Lidl Huddinge C · ICA Maxi Flemingsberg · Coop Extra Huddinge. Prices updated weekly.
          </p>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCat("all")}
          className={`px-3 py-1.5 text-sm rounded-full font-medium transition-colors ${selectedCat === "all" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          All
        </button>
        {catIds.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCat(c)}
            className={`px-3 py-1.5 text-sm rounded-full font-medium transition-colors flex items-center gap-1.5 ${selectedCat === c ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            <span>{CATEGORIES[c].icon}</span> {CATEGORIES[c].name}
          </button>
        ))}
      </div>

      {/* Price matrix table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-800 text-sm">Current Store-Brand Prices (SEK)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-2.5 text-left">Product</th>
                {storeIds.map((s) => (
                  <th key={s} className="px-4 py-2.5 text-right" style={{ color: STORES[s].color }}>
                    {STORES[s].name}
                  </th>
                ))}
                <th className="px-4 py-2.5 text-right text-gray-500">Spread</th>
                <th className="px-4 py-2.5 text-center text-gray-500">Best deal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {priceMatrix.map(({ product: p, prices, min, max, spreadPct }) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedProduct(p.id)}
                  className={`cursor-pointer transition-colors ${selectedProduct === p.id ? "bg-blue-50" : "hover:bg-gray-50"}`}
                >
                  <td className="px-5 py-2.5">
                    <p className="font-medium text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.unitSize}</p>
                  </td>
                  {storeIds.map((sid, si) => (
                    <td key={sid} className="px-4 py-2.5 text-right">
                      <span
                        className={`font-semibold ${prices[si] === min ? "text-green-600" : prices[si] === max ? "text-red-500" : "text-gray-700"}`}
                      >
                        {prices[si].toFixed(2)}
                      </span>
                    </td>
                  ))}
                  <td className="px-4 py-2.5 text-right">
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${spreadPct > 20 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>
                      {spreadPct.toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {(() => {
                      const bestIdx = prices.indexOf(min);
                      const sid = storeIds[bestIdx];
                      return (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: STORES[sid].color }}>
                          {STORES[sid].name}
                        </span>
                      );
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="px-5 py-2 text-xs text-gray-400 border-t border-gray-100">
          Click any row to see 12-week price history. Green = cheapest · Red = most expensive.
        </p>
      </div>

      {/* 12-week price history chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">
          12-Week Price History — <span className="text-blue-600">{product.name}</span> ({product.unitSize})
        </h3>
        <p className="text-xs text-gray-400 mb-4">Store-brand prices at Huddinge-area stores · Offer weeks visible as dips</p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `${v} kr`} domain={["auto", "auto"]} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => [Number(v).toFixed(2) + " kr"]} />
            <Legend />
            {storeIds.map((sid) => (
              <Line
                key={sid}
                type="monotone"
                dataKey={STORES[sid].name}
                stroke={STORES[sid].color}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
