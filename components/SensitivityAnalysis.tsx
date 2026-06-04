"use client";
import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { STORES, CATEGORIES, type StoreId, type CategoryId } from "@/data/products";
import { optimize, computeSensitivityScenarios, buildUniformDiscounts } from "@/lib/optimizer";
import type { WeeklyQuantities, TierPreferences } from "@/lib/optimizer";

interface Props {
  quantities: WeeklyQuantities;
  tiers: TierPreferences;
}

const SEK = (n: number) => `${n.toFixed(0)} kr`;
const STORE_IDS = Object.keys(STORES) as StoreId[];
const CAT_IDS = Object.keys(CATEGORIES) as CategoryId[];

export default function SensitivityAnalysis({ quantities, tiers }: Props) {
  // Per-store, per-category discount sliders (0-40%)
  const [discounts, setDiscounts] = useState<Record<StoreId, Record<CategoryId, number>>>(() => {
    const d = {} as Record<StoreId, Record<CategoryId, number>>;
    STORE_IDS.forEach((s) => {
      d[s] = {} as Record<CategoryId, number>;
      CAT_IDS.forEach((c) => { d[s][c] = 0; });
    });
    return d;
  });

  const [globalDiscount, setGlobalDiscount] = useState(0);

  const result = useMemo(() => optimize(quantities, tiers, discounts), [quantities, tiers, discounts]);
  const baseline = useMemo(() => optimize(quantities, tiers, buildUniformDiscounts(0)), [quantities, tiers]);
  const scenarios = useMemo(() => computeSensitivityScenarios(quantities, tiers), [quantities, tiers]);

  const baselineMonthly = baseline.monthlyOptimized;

  function applyGlobal(pct: number) {
    setGlobalDiscount(pct);
    const d = {} as Record<StoreId, Record<CategoryId, number>>;
    STORE_IDS.forEach((s) => {
      d[s] = {} as Record<CategoryId, number>;
      CAT_IDS.forEach((c) => { d[s][c] = pct; });
    });
    setDiscounts(d);
  }

  function setDiscount(store: StoreId, cat: CategoryId, pct: number) {
    setDiscounts((prev) => ({
      ...prev,
      [store]: { ...prev[store], [cat]: pct },
    }));
    setGlobalDiscount(-1);
  }

  // Tornado chart data — which store/category combo has the biggest impact
  const tornadoData = STORE_IDS.flatMap((sid) =>
    CAT_IDS.map((cid) => {
      const boosted = { ...discounts };
      STORE_IDS.forEach((s) => { boosted[s] = { ...discounts[s] }; });
      boosted[sid][cid] = Math.min(40, (discounts[sid][cid] ?? 0) + 10);
      const r = optimize(quantities, tiers, boosted);
      return {
        label: `${STORES[sid].name} ${CATEGORIES[cid].name}`,
        impact: result.monthlyOptimized - r.monthlyOptimized,
        store: sid,
      };
    })
  ).sort((a, b) => b.impact - a.impact).slice(0, 8);

  // Sweep monthly cost from 0% to 40% discount
  const sweepData = Array.from({ length: 9 }, (_, i) => {
    const pct = i * 5;
    const r = optimize(quantities, tiers, buildUniformDiscounts(pct));
    return {
      "Discount %": `${pct}%`,
      "Monthly cost": parseFloat(r.monthlyOptimized.toFixed(2)),
      "Monthly saving": parseFloat((baselineMonthly - r.monthlyOptimized).toFixed(2)),
    };
  });

  const currentSavingsPct = ((baselineMonthly - result.monthlyOptimized) / baselineMonthly) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Sensitivity Analysis — Offers & Discounts</h2>
        <p className="text-sm text-gray-500 mt-0.5">Model how weekly offers at Lidl, ICA Maxi, and Coop affect your monthly bill</p>
      </div>

      {/* Live result card */}
      <div className={`rounded-xl p-5 ${currentSavingsPct >= 20 ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-blue-500 to-indigo-600"} text-white`}>
        <div className="flex justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm opacity-80">Monthly bill with current offer settings</p>
            <p className="text-4xl font-extrabold mt-1">{SEK(result.monthlyOptimized)}</p>
            <p className="text-sm opacity-75 mt-0.5">Baseline: {SEK(baselineMonthly)} · Saving: {SEK(baselineMonthly - result.monthlyOptimized)}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black">{currentSavingsPct.toFixed(1)}%</p>
            <p className="text-sm opacity-80">vs baseline</p>
          </div>
        </div>
      </div>

      {/* Global shortcut */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">Quick Presets — Apply to All Stores & Categories</h3>
        <div className="flex items-center gap-4 mb-4">
          <input
            type="range" min={0} max={40} step={5}
            value={globalDiscount >= 0 ? globalDiscount : 0}
            onChange={(e) => applyGlobal(Number(e.target.value))}
            className="flex-1 accent-blue-600"
          />
          <span className="text-lg font-bold text-blue-700 w-14 text-right">{globalDiscount >= 0 ? `${globalDiscount}%` : "Mixed"}</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[0, 5, 10, 15, 20, 25, 30].map((pct) => (
            <button
              key={pct}
              onClick={() => applyGlobal(pct)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${globalDiscount === pct ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {pct}% off
            </button>
          ))}
        </div>
      </div>

      {/* Per-store sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {STORE_IDS.map((sid) => (
          <div key={sid} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STORES[sid].color }} />
              {STORES[sid].name} — Category Offers
            </h3>
            <div className="space-y-3">
              {CAT_IDS.map((cid) => {
                const val = discounts[sid]?.[cid] ?? 0;
                return (
                  <div key={cid}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 flex items-center gap-1">
                        <span>{CATEGORIES[cid].icon}</span> {CATEGORIES[cid].name}
                      </span>
                      <span className="font-semibold" style={{ color: val > 0 ? STORES[sid].color : "#9CA3AF" }}>
                        {val}% off
                      </span>
                    </div>
                    <input
                      type="range" min={0} max={40} step={5}
                      value={val}
                      onChange={(e) => setDiscount(sid, cid, Number(e.target.value))}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: STORES[sid].color }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Predefined scenarios */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Offer Scenario Comparison — Monthly Bill</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={scenarios.map((s) => ({ name: s.label, "Monthly cost": parseFloat(s.monthlyTotal.toFixed(2)), "vs baseline": parseFloat((-s.monthlySavings).toFixed(2)) }))} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" />
            <YAxis tickFormatter={(v) => `${v} kr`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v, name) => [Number(v).toFixed(0) + " kr", String(name)]} />
            <Bar dataKey="Monthly cost" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cost sweep line chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">Monthly Cost Sweep — 0% to 40% Uniform Discount</h3>
        <p className="text-xs text-gray-400 mb-4">Shows how your optimized monthly bill shrinks as offer depth increases</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={sweepData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="Discount %" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="cost" tickFormatter={(v) => `${v} kr`} tick={{ fontSize: 11 }} />
            <YAxis yAxisId="saving" orientation="right" tickFormatter={(v) => `${v} kr`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => [Number(v).toFixed(0) + " kr"]} />
            <Legend />
            <Line yAxisId="cost" type="monotone" dataKey="Monthly cost" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
            <Line yAxisId="saving" type="monotone" dataKey="Monthly saving" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tornado chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">Tornado Chart — Biggest Impact Levers</h3>
        <p className="text-xs text-gray-400 mb-4">Monthly savings gained by adding +10% offer on each store/category combo</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={tornadoData} layout="vertical" margin={{ top: 5, right: 40, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => `${v.toFixed(0)} kr`} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="label" tick={{ fontSize: 11 }} width={160} />
            <Tooltip formatter={(v) => [Number(v).toFixed(2) + " kr", "Monthly impact"]} />
            <Bar dataKey="impact" radius={[0, 6, 6, 0]} fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Scenario table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-800 text-sm">Scenario Summary Table</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
              <th className="px-5 py-2.5 text-left">Scenario</th>
              <th className="px-4 py-2.5 text-right">Monthly bill</th>
              <th className="px-4 py-2.5 text-right">vs baseline</th>
              <th className="px-4 py-2.5 text-right">Saving %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {scenarios.map((s) => (
              <tr key={s.label} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-2.5 font-medium text-gray-700">{s.label}</td>
                <td className="px-4 py-2.5 text-right font-bold text-gray-900">{SEK(s.monthlyTotal)}</td>
                <td className={`px-4 py-2.5 text-right font-semibold ${s.monthlySavings > 0 ? "text-green-600" : "text-gray-400"}`}>
                  {s.monthlySavings > 0 ? `−${SEK(s.monthlySavings)}` : "—"}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.savingsPct >= 20 ? "bg-green-100 text-green-700" : s.savingsPct > 0 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"}`}>
                    {s.savingsPct > 0 ? `${s.savingsPct.toFixed(1)}%` : "0%"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
