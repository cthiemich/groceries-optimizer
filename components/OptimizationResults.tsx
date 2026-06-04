"use client";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { STORES, CATEGORIES, type StoreId, type CategoryId } from "@/data/products";
import type { OptimizationResult } from "@/lib/optimizer";

interface Props {
  result: OptimizationResult;
}

const SEK = (n: number) => `${n.toFixed(0)} kr`;
const STORE_IDS = Object.keys(STORES) as StoreId[];

export default function OptimizationResults({ result }: Props) {
  const savingsGood = result.savingsPct >= 20;

  // Pie chart: how much spend goes to each store in the optimal plan
  const pieData = STORE_IDS.map((id) => ({
    name: STORES[id].name,
    value: parseFloat(result.storeAllocations[id].subtotal.toFixed(2)),
    color: STORES[id].color,
  })).filter((d) => d.value > 0);

  // Monthly comparison bar data
  const monthlyComparison = [
    { label: "Most expensive store", amount: result.mostExpensiveSingleStore.total * 4.33, storeId: result.mostExpensiveSingleStore.storeId },
    { label: "Cheapest single store", amount: result.cheapestSingleStore.total * 4.33, storeId: result.cheapestSingleStore.storeId },
    { label: "Optimized (split trips)", amount: result.monthlyOptimized, storeId: null },
  ];

  const maxMonthly = Math.max(...monthlyComparison.map((d) => d.amount));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Optimization Results</h2>
        <p className="text-sm text-gray-500 mt-0.5">Buy each item at its cheapest store to maximize savings</p>
      </div>

      {/* Savings banner */}
      <div
        className={`rounded-xl p-5 text-white ${savingsGood ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-blue-500 to-indigo-600"}`}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm font-medium opacity-90">Monthly savings vs. always shopping at {STORES[result.mostExpensiveSingleStore.storeId].name}</p>
            <p className="text-4xl font-extrabold mt-1">{SEK(result.absoluteSavings * 4.33)}</p>
            <p className="text-sm opacity-80 mt-0.5">That's {result.savingsPct.toFixed(1)}% less per month</p>
          </div>
          <div className="text-right">
            <div className={`text-5xl font-black ${savingsGood ? "text-yellow-300" : "text-white"}`}>
              {result.savingsPct.toFixed(0)}%
            </div>
            <div className="text-sm opacity-80 mt-1">
              {savingsGood ? "Target achieved" : `${(20 - result.savingsPct).toFixed(1)}% to 20% target`}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
          <div>
            <p className="text-xs opacity-70">Optimized weekly</p>
            <p className="text-lg font-bold">{SEK(result.optimizedTotal)}</p>
          </div>
          <div>
            <p className="text-xs opacity-70">Optimized monthly</p>
            <p className="text-lg font-bold">{SEK(result.monthlyOptimized)}</p>
          </div>
          <div>
            <p className="text-xs opacity-70">Annual savings</p>
            <p className="text-lg font-bold">{SEK(result.absoluteSavings * 52)}</p>
          </div>
        </div>
      </div>

      {/* Monthly cost comparison */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Monthly Cost Comparison</h3>
        <div className="space-y-3">
          {monthlyComparison.map((row, i) => {
            const pct = (row.amount / maxMonthly) * 100;
            const color = row.storeId ? STORES[row.storeId as StoreId].color : "#10B981";
            return (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 font-medium">{row.label}</span>
                  <span className="font-bold text-gray-900">{SEK(row.amount)}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store allocation pie */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Optimal Spend by Store</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [Number(v).toFixed(0) + " kr", "Weekly spend"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Shopping list by store */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Optimized Shopping List</h3>
          <div className="space-y-3">
            {STORE_IDS.filter((id) => result.storeAllocations[id].subtotal > 0).map((id) => (
              <div key={id}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STORES[id].color }} />
                  <span className="font-semibold text-sm text-gray-800">{STORES[id].name}</span>
                  <span className="ml-auto text-sm font-bold text-gray-900">{SEK(result.storeAllocations[id].subtotal)}/wk</span>
                </div>
                <div className="ml-4 flex flex-wrap gap-1.5">
                  {result.storeAllocations[id].items.map((item) => (
                    <span key={item} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Per-item savings table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Per-Item Savings Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-5 py-2.5 text-left">Product</th>
                <th className="px-3 py-2.5 text-center">Category</th>
                <th className="px-3 py-2.5 text-center">Qty/wk</th>
                <th className="px-3 py-2.5 text-right">Best price</th>
                <th className="px-3 py-2.5 text-center">Buy at</th>
                <th className="px-3 py-2.5 text-right">Weekly saving</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {result.items
                .filter((i) => i.qty > 0)
                .sort((a, b) => b.savings - a.savings)
                .map((item) => (
                  <tr key={item.productId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-2.5">
                      <p className="font-medium text-gray-800">{item.productName}</p>
                      <p className="text-xs text-gray-400">{item.swedishName}</p>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-base">{CATEGORIES[item.category].icon}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center text-gray-600">{item.qty}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-gray-900">{item.bestPrice.toFixed(2)} kr</td>
                    <td className="px-3 py-2.5 text-center">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: STORES[item.bestStore].color }}
                      >
                        {item.bestStoreName}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span className={`font-semibold ${item.savings > 0 ? "text-green-600" : "text-gray-400"}`}>
                        {item.savings > 0 ? `+${item.savings.toFixed(2)} kr` : "—"}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
