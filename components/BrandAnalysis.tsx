"use client";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from "recharts";
import { CATEGORIES, type CategoryId } from "@/data/products";
import type { WeeklyQuantities } from "@/lib/optimizer";
import { computeBrandBreakdown } from "@/lib/optimizer";

interface Props {
  quantities: WeeklyQuantities;
}

const SEK = (n: number) => `${n.toFixed(0)} kr`;

export default function BrandAnalysis({ quantities }: Props) {
  const [selectedCat, setSelectedCat] = useState<CategoryId | "all">("all");
  const breakdown = computeBrandBreakdown(quantities);

  const filtered = selectedCat === "all" ? breakdown : breakdown.filter((b) => b.product.category === selectedCat);

  const weeklyStoreBrand = filtered.reduce((sum, b) => sum + b.weeklyStoreBrandCost, 0);
  const weeklyPremium    = filtered.reduce((sum, b) => sum + b.weeklyPremiumCost, 0);
  const monthlySavings   = (weeklyPremium - weeklyStoreBrand) * 4.33;

  // Category comparison
  const catSummary = (Object.keys(CATEGORIES) as CategoryId[]).map((catId) => {
    const catItems = breakdown.filter((b) => b.product.category === catId);
    const sb   = catItems.reduce((s, b) => s + b.weeklyStoreBrandCost, 0);
    const prem = catItems.reduce((s, b) => s + b.weeklyPremiumCost, 0);
    return { name: CATEGORIES[catId].name, icon: CATEGORIES[catId].icon, "Store brand": parseFloat(sb.toFixed(2)), Premium: parseFloat(prem.toFixed(2)) };
  });

  // Sorted bar data for premium premium
  const sortedBySpread = [...filtered].sort((a, b) => b.premiumPct - a.premiumPct);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Store-Brand vs. Premium Analysis</h2>
        <p className="text-sm text-gray-500 mt-0.5">How much extra you pay for branded items vs own-label alternatives</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Store-brand weekly</p>
          <p className="text-2xl font-bold text-blue-800 mt-1">{SEK(weeklyStoreBrand)}</p>
          <p className="text-xs text-blue-500 mt-0.5">{SEK(weeklyStoreBrand * 4.33)}/month</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">Premium weekly</p>
          <p className="text-2xl font-bold text-purple-800 mt-1">{SEK(weeklyPremium)}</p>
          <p className="text-xs text-purple-500 mt-0.5">{SEK(weeklyPremium * 4.33)}/month</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Monthly savings (store-brand)</p>
          <p className="text-2xl font-bold text-green-800 mt-1">{SEK(monthlySavings)}</p>
          <p className="text-xs text-green-500 mt-0.5">{SEK(monthlySavings * 12)}/year</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setSelectedCat("all")} className={`px-3 py-1.5 text-sm rounded-full font-medium transition-colors ${selectedCat === "all" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>All</button>
        {(Object.keys(CATEGORIES) as CategoryId[]).map((c) => (
          <button key={c} onClick={() => setSelectedCat(c)} className={`px-3 py-1.5 text-sm rounded-full font-medium transition-colors flex items-center gap-1.5 ${selectedCat === c ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            <span>{CATEGORIES[c].icon}</span> {CATEGORIES[c].name}
          </button>
        ))}
      </div>

      {/* Category comparison bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Weekly Spend by Category — Store-brand vs Premium</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={catSummary} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `${v} kr`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => [Number(v).toFixed(2) + " kr"]} />
            <Legend />
            <Bar dataKey="Store brand" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Premium" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Premium percentage bar for each product */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">Premium Price Premium by Product</h3>
        <p className="text-xs text-gray-400 mb-4">% more you pay for branded vs store-brand (best prices across all stores)</p>
        <div className="space-y-2">
          {sortedBySpread.filter((b) => b.qty > 0).map((b) => (
            <div key={b.product.id}>
              <div className="flex items-center justify-between text-sm mb-0.5">
                <div className="flex items-center gap-2">
                  <span>{CATEGORIES[b.product.category].icon}</span>
                  <span className="font-medium text-gray-700">{b.product.name}</span>
                  <span className="text-xs text-gray-400">{b.product.unitSize}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{b.bestStoreBrandPrice.toFixed(2)} kr → {b.bestPremiumPrice.toFixed(2)} kr</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${b.premiumPct > 40 ? "bg-red-100 text-red-700" : b.premiumPct > 20 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                    +{b.premiumPct.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, b.premiumPct * 1.5)}%`,
                    backgroundColor: b.premiumPct > 40 ? "#EF4444" : b.premiumPct > 20 ? "#F59E0B" : "#10B981",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-800 text-sm">Detailed Brand Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                <th className="px-5 py-2.5 text-left">Product</th>
                <th className="px-3 py-2.5 text-right">Store brand</th>
                <th className="px-3 py-2.5 text-right">Premium</th>
                <th className="px-3 py-2.5 text-right">Premium %</th>
                <th className="px-3 py-2.5 text-right">Weekly saving</th>
                <th className="px-3 py-2.5 text-right">Monthly saving</th>
                <th className="px-3 py-2.5 text-center">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.filter((b) => b.qty > 0).map((b) => {
                const weeklySaving = b.weeklyPremiumCost - b.weeklyStoreBrandCost;
                const verdict = b.premiumPct < 15 ? "Worth it" : b.premiumPct < 35 ? "Consider" : "Go store-brand";
                const verdictColor = b.premiumPct < 15 ? "bg-green-100 text-green-700" : b.premiumPct < 35 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
                return (
                  <tr key={b.product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-2.5">
                      <p className="font-medium text-gray-800">{b.product.name}</p>
                      <p className="text-xs text-gray-400">{b.product.unitSize} × {b.qty}/wk</p>
                    </td>
                    <td className="px-3 py-2.5 text-right font-semibold text-blue-700">{b.bestStoreBrandPrice.toFixed(2)} kr</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-purple-700">{b.bestPremiumPrice.toFixed(2)} kr</td>
                    <td className="px-3 py-2.5 text-right font-bold text-gray-800">+{b.premiumPct.toFixed(0)}%</td>
                    <td className="px-3 py-2.5 text-right text-green-600 font-semibold">{weeklySaving.toFixed(2)} kr</td>
                    <td className="px-3 py-2.5 text-right text-green-600 font-semibold">{(weeklySaving * 4.33).toFixed(0)} kr</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${verdictColor}`}>{verdict}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800 font-medium">Tip for Swedish shoppers</p>
        <p className="text-xs text-blue-600 mt-1">
          ICA Basic, Coop Budget, and Lidl own-label products typically meet the same food-safety and nutritional standards as premium brands.
          Items with the highest premium % (dairy, eggs, bread) are often where the biggest savings lie — consider switching staples first.
        </p>
      </div>
    </div>
  );
}
