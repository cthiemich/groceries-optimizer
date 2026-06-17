"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { CATEGORIES, type CategoryId } from "@/data/products";
import {
  MATHEM_MONTHLY_HISTORY,
  MATHEM_TOP_ITEMS,
  MATHEM_CATEGORY_TOTALS,
  MATHEM_TOTAL_ORDERS,
  MATHEM_UNIQUE_PRODUCTS,
  MATHEM_AVG_MONTHLY,
  MATHEM_AVG_WEEKLY,
  MATHEM_AVG_ORDER,
  MATHEM_FEES,
  MATHEM_ORDERS_PER_MONTH,
  MATHEM_DELIVERY_COST_MONTHLY,
  MATHEM_AVG_FEES_PER_ORDER,
  getMathemWeeklyCategoryTotals,
  type MathemCategory,
} from "@/data/mathem";
import type { OptimizationResult } from "@/lib/optimizer";

interface Props {
  result: OptimizationResult;
}

const SEK = (n: number) => `${n.toFixed(0)} kr`;
const MATHEM_COLOR = "#8B5CF6";
const OPTIMIZED_COLOR = "#10B981";

export default function MathemComparison({ result }: Props) {
  const monthlySavings = MATHEM_AVG_MONTHLY - result.monthlyOptimized;
  const savingsPct = (monthlySavings / MATHEM_AVG_MONTHLY) * 100;
  const annualSavings = monthlySavings * 12;
  const savingsGood = savingsPct >= 20;

  const trendData = MATHEM_MONTHLY_HISTORY.map((m) => ({
    month: m.isPartial ? `${m.month} (partial)` : m.month,
    "MatHem spend": parseFloat(m.total.toFixed(0)),
    orders: m.orderCount,
  }));

  const weeklyDiff = ((MATHEM_AVG_WEEKLY - result.optimizedTotal) / MATHEM_AVG_WEEKLY) * 100;

  const mathemWeekly = getMathemWeeklyCategoryTotals();
  const catIds: CategoryId[] = ["dairy", "bread", "meat", "produce"];

  const optimizedCatTotals: Record<string, number> = {};
  for (const item of result.items) {
    if (item.qty === 0) continue;
    optimizedCatTotals[item.category] =
      (optimizedCatTotals[item.category] ?? 0) + item.bestPrice * item.qty;
  }

  const mathemWeeklyTotal = Object.values(mathemWeekly).reduce((a, b) => a + b, 0);
  const optimizedWeeklyTotal = result.optimizedTotal;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">MatHem vs Store Shopping</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Based on {MATHEM_TOTAL_ORDERS} actual MatHem orders ({MATHEM_UNIQUE_PRODUCTS} unique products, {SEK(MATHEM_TOTAL_ORDERS * MATHEM_AVG_ORDER)} total)
        </p>
      </div>

      {/* Hero savings banner */}
      <div className={`rounded-xl p-5 text-white ${savingsGood ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-purple-500 to-indigo-600"}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm font-medium opacity-90">Monthly savings by switching to optimized store shopping</p>
            <p className="text-4xl font-extrabold mt-1">{SEK(monthlySavings)}</p>
            <p className="text-sm opacity-80 mt-0.5">That&apos;s {savingsPct.toFixed(1)}% less per month</p>
          </div>
          <div className="text-right">
            <div className={`text-5xl font-black ${savingsGood ? "text-yellow-300" : "text-purple-200"}`}>
              {savingsPct.toFixed(0)}%
            </div>
            <div className="text-sm opacity-80 mt-1">less than MatHem</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
          <div>
            <p className="text-xs opacity-70">MatHem monthly avg</p>
            <p className="text-lg font-bold">{SEK(MATHEM_AVG_MONTHLY)}</p>
          </div>
          <div>
            <p className="text-xs opacity-70">Optimized monthly</p>
            <p className="text-lg font-bold">{SEK(result.monthlyOptimized)}</p>
          </div>
          <div>
            <p className="text-xs opacity-70">Annual savings potential</p>
            <p className="text-lg font-bold">{SEK(annualSavings)}</p>
          </div>
        </div>
      </div>

      {/* Monthly spending trend */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">Monthly Spending Trend</h3>
        <p className="text-xs text-gray-400 mb-4">Your actual MatHem bills vs what you&apos;d pay at physical stores</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
            <YAxis tickFormatter={(v) => `${(Number(v) / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(v) => [Number(v).toFixed(0) + " kr", "MatHem spend"]}
              labelFormatter={(l) => {
                const m = MATHEM_MONTHLY_HISTORY.find((h) => h.month === String(l).replace(" (partial)", ""));
                return m ? `${l} — ${m.orderCount} orders` : String(l);
              }}
            />
            <Bar dataKey="MatHem spend" fill={MATHEM_COLOR} radius={[4, 4, 0, 0]} maxBarSize={60} />
            <ReferenceLine y={result.monthlyOptimized} stroke={OPTIMIZED_COLOR} strokeWidth={2} strokeDasharray="6 4"
              label={{ value: `Optimized: ${SEK(result.monthlyOptimized)}`, position: "right", fill: OPTIMIZED_COLOR, fontSize: 11, fontWeight: 600 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly cost comparison */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">Weekly Cost Comparison</h3>
        <p className="text-xs text-gray-400 mb-4">Average per order ({MATHEM_TOTAL_ORDERS} orders analyzed) vs optimized weekly basket</p>
        <div className="space-y-4">
          {[
            { label: "MatHem average order", value: MATHEM_AVG_ORDER, color: MATHEM_COLOR },
            { label: "Optimized stores (weekly)", value: result.optimizedTotal, color: OPTIMIZED_COLOR },
          ].map((row) => {
            const maxVal = Math.max(MATHEM_AVG_ORDER, result.optimizedTotal);
            const pct = (row.value / maxVal) * 100;
            return (
              <div key={row.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600 font-medium flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: row.color }} />
                    {row.label}
                  </span>
                  <span className="font-bold text-gray-900">{SEK(row.value)}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: row.color }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">Weekly savings</span>
          <span className="text-sm font-bold text-green-600">
            {SEK(MATHEM_AVG_WEEKLY - result.optimizedTotal)} less ({weeklyDiff.toFixed(1)}%)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery overhead */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-1">Delivery Overhead</h3>
          <p className="text-xs text-gray-400 mb-4">Avg {MATHEM_AVG_FEES_PER_ORDER.toFixed(0)} kr/order across {MATHEM_TOTAL_ORDERS} orders ({MATHEM_ORDERS_PER_MONTH}/month)</p>
          <div className="space-y-3">
            {[
              { label: "Delivery fee", perOrder: MATHEM_FEES.delivery, monthly: MATHEM_FEES.delivery * MATHEM_ORDERS_PER_MONTH },
              { label: "Box fee", perOrder: MATHEM_FEES.boxes, monthly: MATHEM_FEES.boxes * MATHEM_ORDERS_PER_MONTH },
              { label: "Pant (deposit)", perOrder: MATHEM_FEES.pant, monthly: MATHEM_FEES.pant * MATHEM_ORDERS_PER_MONTH },
            ].map((fee) => (
              <div key={fee.label} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{fee.label}</span>
                <span className="text-gray-500">
                  {fee.perOrder} kr x {MATHEM_ORDERS_PER_MONTH} = <span className="font-semibold text-gray-800">{SEK(fee.monthly)}</span>
                </span>
              </div>
            ))}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">Monthly overhead</span>
              <span className="text-sm font-bold text-purple-700">{SEK(MATHEM_DELIVERY_COST_MONTHLY)}</span>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-xs text-purple-600">
                {SEK(MATHEM_DELIVERY_COST_MONTHLY * 12)}/year in fees alone — {((MATHEM_DELIVERY_COST_MONTHLY / MATHEM_AVG_MONTHLY) * 100).toFixed(1)}% of your total MatHem spend goes to logistics
              </p>
            </div>
          </div>
        </div>

        {/* Category breakdown — now from all 15 orders */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-800">Weekly Category Spend</h3>
            <p className="text-xs text-gray-400 mt-0.5">MatHem avg/order vs optimized store basket</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-2.5 text-left">Category</th>
                  <th className="px-3 py-2.5 text-right">MatHem</th>
                  <th className="px-3 py-2.5 text-right">Stores</th>
                  <th className="px-3 py-2.5 text-right">Diff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {catIds.map((catId) => {
                  const cat = CATEGORIES[catId];
                  const mVal = mathemWeekly[catId];
                  const sVal = optimizedCatTotals[catId] ?? 0;
                  const diff = mVal > 0 && sVal > 0 ? ((mVal - sVal) / mVal) * 100 : 0;
                  return (
                    <tr key={catId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-2.5">
                        <span className="flex items-center gap-2">
                          <span className="text-base">{cat.icon}</span>
                          <span className="font-medium text-gray-800">{cat.name}</span>
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right font-semibold text-purple-700">{SEK(mVal)}</td>
                      <td className="px-3 py-2.5 text-right font-semibold text-green-700">{SEK(sVal)}</td>
                      <td className="px-3 py-2.5 text-right">
                        {diff > 0 ? (
                          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">-{diff.toFixed(0)}%</span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-2.5">
                    <span className="flex items-center gap-2">
                      <span className="text-base">📦</span>
                      <span className="font-medium text-gray-800">Other</span>
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold text-purple-700">{SEK(mathemWeekly.other)}</td>
                  <td className="px-3 py-2.5 text-right text-gray-400">—</td>
                  <td className="px-3 py-2.5 text-right text-gray-400">—</td>
                </tr>
                <tr className="bg-gray-50 font-bold">
                  <td className="px-5 py-2.5 text-gray-800">Total/order</td>
                  <td className="px-3 py-2.5 text-right text-purple-800">{SEK(mathemWeeklyTotal)}</td>
                  <td className="px-3 py-2.5 text-right text-green-800">{SEK(optimizedWeeklyTotal)}</td>
                  <td className="px-3 py-2.5 text-right">
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      -{((mathemWeeklyTotal - optimizedWeeklyTotal) / mathemWeeklyTotal * 100).toFixed(0)}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-5 py-2.5 bg-amber-50 border-t border-amber-200">
            <p className="text-xs text-amber-700">
              MatHem column = average per order from {MATHEM_TOTAL_ORDERS} orders. &quot;Other&quot; includes drinks, baby food, household, and pharmacy.
              Categories are mapped approximately.
            </p>
          </div>
        </div>
      </div>

      {/* Top items from MatHem */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Your Most-Purchased MatHem Items</h3>
          <p className="text-xs text-gray-400 mt-0.5">Top items by total spend across {MATHEM_TOTAL_ORDERS} orders</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-5 py-2.5 text-left">Product</th>
                <th className="px-3 py-2.5 text-center">Cat</th>
                <th className="px-3 py-2.5 text-center">Orders</th>
                <th className="px-3 py-2.5 text-center">Total qty</th>
                <th className="px-3 py-2.5 text-right">Avg unit</th>
                <th className="px-3 py-2.5 text-right">Total spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MATHEM_TOP_ITEMS
                .sort((a, b) => b.totalSpend - a.totalSpend)
                .slice(0, 25)
                .map((item, i) => {
                  const catIcon = item.mappedCategory !== "other"
                    ? CATEGORIES[item.mappedCategory as CategoryId].icon
                    : "📦";
                  return (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-2">
                        <p className="font-medium text-gray-800 text-sm">{item.description}</p>
                        <p className="text-xs text-gray-400">{item.mathemCategory}</p>
                      </td>
                      <td className="px-3 py-2 text-center text-base">{catIcon}</td>
                      <td className="px-3 py-2 text-center text-gray-600">{item.orderCount}x</td>
                      <td className="px-3 py-2 text-center text-gray-600">{item.totalQty}</td>
                      <td className="px-3 py-2 text-right text-gray-600">{item.avgUnitPrice.toFixed(2)} kr</td>
                      <td className="px-3 py-2 text-right font-semibold text-gray-900">{item.totalSpend.toFixed(0)} kr</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key insights */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Monthly savings potential</p>
            <p className="text-2xl font-bold text-green-800 mt-1">{SEK(monthlySavings)}</p>
            <p className="text-xs text-green-500 mt-0.5">
              Switch from MatHem to optimized multi-store shopping ({savingsPct.toFixed(0)}% reduction)
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">Delivery overhead per year</p>
            <p className="text-2xl font-bold text-purple-800 mt-1">{SEK(MATHEM_DELIVERY_COST_MONTHLY * 12)}</p>
            <p className="text-xs text-purple-500 mt-0.5">
              {SEK(MATHEM_DELIVERY_COST_MONTHLY)}/month in fees you avoid at physical stores
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Your top MatHem spend</p>
            <p className="text-2xl font-bold text-blue-800 mt-1">Produce: {SEK(MATHEM_CATEGORY_TOTALS.produce)}</p>
            <p className="text-xs text-blue-500 mt-0.5">
              Fruit &amp; veg is your biggest category — Lidl produce prices are 30-40% cheaper
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">Recommendation</p>
            <p className="text-lg font-bold text-amber-800 mt-1">Split trips across 2-3 stores</p>
            <p className="text-xs text-amber-500 mt-0.5">
              Weekly Lidl + ICA Maxi covers most staples. Keep MatHem only for specialty/convenience items.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
