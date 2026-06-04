"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import { STORES, CATEGORIES, type CategoryId } from "@/data/products";
import type { OptimizationResult } from "@/lib/optimizer";

interface Props {
  result: OptimizationResult;
}

const SEK = (n: number) => `${n.toFixed(0)} kr`;

export default function StoreComparison({ result }: Props) {
  const storeIds = Object.keys(STORES) as (keyof typeof STORES)[];

  // Per-store, per-category breakdown for stacked bar
  const stackedData = (Object.keys(CATEGORIES) as CategoryId[]).map((catId) => {
    const row: Record<string, string | number> = { category: CATEGORIES[catId].name };
    result.storeTotals.forEach((st) => {
      const catTotal = st.breakdown.find((b) => b.category === catId)?.total ?? 0;
      row[st.storeName] = parseFloat(catTotal.toFixed(2));
    });
    return row;
  });

  // Radar chart data — normalised to max
  const radarData = (Object.keys(CATEGORIES) as CategoryId[]).map((catId) => {
    const row: Record<string, string | number> = { subject: CATEGORIES[catId].name };
    result.storeTotals.forEach((st) => {
      const catTotal = st.breakdown.find((b) => b.category === catId)?.total ?? 0;
      row[st.storeName] = parseFloat(catTotal.toFixed(2));
    });
    return row;
  });

  // Winner per category
  const categoryWinners = (Object.keys(CATEGORIES) as CategoryId[]).map((catId) => {
    let best = { storeName: "", total: Infinity };
    result.storeTotals.forEach((st) => {
      const total = st.breakdown.find((b) => b.category === catId)?.total ?? 0;
      if (total < best.total) best = { storeName: st.storeName, total };
    });
    return { catId, catName: CATEGORIES[catId].name, icon: CATEGORIES[catId].icon, ...best };
  });

  const totalData = result.storeTotals.map((st) => ({
    name: st.storeName,
    "Weekly total": parseFloat(st.total.toFixed(2)),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Store Price Comparison</h2>
        <p className="text-sm text-gray-500 mt-0.5">Weekly spend across all three stores for your basket</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {result.storeTotals
          .slice()
          .sort((a, b) => a.total - b.total)
          .map((st, i) => (
            <div
              key={st.storeId}
              className={`rounded-xl p-4 border-2 ${
                i === 0 ? "border-green-400 bg-green-50" : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{st.storeName}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{SEK(st.total)}<span className="text-sm font-normal text-gray-400">/wk</span></p>
                  <p className="text-sm text-gray-500 mt-0.5">{SEK(st.total * 4.33)}/month</p>
                </div>
                {i === 0 && (
                  <span className="text-xs font-semibold bg-green-500 text-white px-2 py-0.5 rounded-full">Cheapest</span>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* Category winners */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Category Winners</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categoryWinners.map((w) => (
            <div key={w.catId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">{w.icon}</span>
              <div>
                <p className="text-xs text-gray-500">{w.catName}</p>
                <p className="font-semibold text-gray-900 text-sm">{w.storeName}</p>
                <p className="text-xs text-gray-400">{SEK(w.total)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stacked bar by category */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Weekly Spend by Category & Store</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={stackedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `${v} kr`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => [Number(v).toFixed(0) + " kr"]} />
            <Legend />
            {storeIds.map((id) => (
              <Bar key={id} dataKey={STORES[id].name} fill={STORES[id].color} radius={[3, 3, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Overall total bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Total Weekly Basket Cost</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={totalData} layout="vertical" margin={{ top: 5, right: 60, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => `${v} kr`} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 13, fontWeight: 600 }} width={70} />
            <Tooltip formatter={(v) => [Number(v).toFixed(0) + " kr", "Weekly total"]} />
            <Bar dataKey="Weekly total" radius={[0, 6, 6, 0]}>
              {totalData.map((entry, i) => {
                const sid = storeIds.find((s) => STORES[s].name === entry.name) ?? storeIds[0];
                return <rect key={i} fill={STORES[sid].color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Category Cost Profile (Radar)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, "auto"]} tick={{ fontSize: 10 }} />
            {storeIds.map((id) => (
              <Radar
                key={id}
                name={STORES[id].name}
                dataKey={STORES[id].name}
                stroke={STORES[id].color}
                fill={STORES[id].color}
                fillOpacity={0.15}
              />
            ))}
            <Legend />
            <Tooltip formatter={(v) => [Number(v).toFixed(0) + " kr"]} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
