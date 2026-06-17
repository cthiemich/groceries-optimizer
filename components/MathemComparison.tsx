"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { CATEGORIES, type CategoryId } from "@/data/products";
import {
  MATHEM_MONTHLY_HISTORY,
  MATHEM_ORDER_ITEMS,
  MATHEM_AVG_MONTHLY,
  MATHEM_AVG_WEEKLY,
  MATHEM_FEES,
  MATHEM_ORDERS_PER_MONTH,
  getMathemCategoryTotals,
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

  // --- Section 3: Monthly trend chart data ---
  const trendData = MATHEM_MONTHLY_HISTORY.map((m) => ({
    month: m.month === "Juni" ? "Juni (partial)" : m.month,
    "MatHem spend": parseFloat(m.total.toFixed(0)),
  }));

  // --- Section 4: Weekly comparison data ---
  const weeklyDiff = ((MATHEM_AVG_WEEKLY - result.optimizedTotal) / MATHEM_AVG_WEEKLY) * 100;
  const weeklyData = [
    { label: "MatHem average", value: parseFloat(MATHEM_AVG_WEEKLY.toFixed(0)) },
    { label: "Optimized stores", value: parseFloat(result.optimizedTotal.toFixed(0)) },
  ];

  // --- Section 5: Hidden costs ---
  const deliveryMonthly = MATHEM_FEES.delivery * MATHEM_ORDERS_PER_MONTH;
  const boxesMonthly = MATHEM_FEES.boxes * MATHEM_ORDERS_PER_MONTH;
  const pantMonthly = MATHEM_FEES.pant * MATHEM_ORDERS_PER_MONTH;
  const totalOverheadMonthly = MATHEM_FEES.total * MATHEM_ORDERS_PER_MONTH;
  const overheadPct = (totalOverheadMonthly / MATHEM_AVG_MONTHLY) * 100;

  // --- Section 6: Category breakdown ---
  const mathemCategoryTotals = getMathemCategoryTotals();
  const sampleOrderTotal = MATHEM_ORDER_ITEMS.reduce((s, i) => s + i.totalPrice, 0);

  // Per-category optimized weekly totals (from best-price-per-item allocation)
  const optimizedCategoryTotals: Record<string, number> = {};
  for (const item of result.items) {
    if (item.qty === 0) continue;
    optimizedCategoryTotals[item.category] =
      (optimizedCategoryTotals[item.category] ?? 0) + item.bestPrice * item.qty;
  }

  const categoryIds = Object.keys(CATEGORIES) as CategoryId[];

  return (
    <div className="space-y-6">
      {/* Section 1: Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          MatHem vs Store Shopping
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Compare your actual MatHem delivery spending against optimized in-store
          prices
        </p>
      </div>

      {/* Section 2: Hero savings banner */}
      <div
        className={`rounded-xl p-5 text-white ${
          savingsGood
            ? "bg-gradient-to-r from-green-500 to-emerald-600"
            : "bg-gradient-to-r from-blue-500 to-indigo-600"
        }`}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm font-medium opacity-90">
              Monthly savings by switching to optimized store shopping
            </p>
            <p className="text-4xl font-extrabold mt-1">{SEK(monthlySavings)}</p>
            <p className="text-sm opacity-80 mt-0.5">
              That&apos;s {savingsPct.toFixed(1)}% less per month
            </p>
          </div>
          <div className="text-right">
            <div
              className={`text-5xl font-black ${
                savingsGood ? "text-yellow-300" : "text-white"
              }`}
            >
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

      {/* Section 3: Monthly spending trend */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">
          Monthly Spending Trend
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          MatHem actual monthly totals vs your optimized store plan
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              tickFormatter={(v) => `${v} kr`}
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v) => [Number(v).toFixed(0) + " kr", "MatHem spend"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "13px",
              }}
            />
            <Bar
              dataKey="MatHem spend"
              fill={MATHEM_COLOR}
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            />
            <ReferenceLine
              y={result.monthlyOptimized}
              stroke={OPTIMIZED_COLOR}
              strokeWidth={2}
              strokeDasharray="6 4"
              label={{
                value: `Optimized: ${SEK(result.monthlyOptimized)}`,
                position: "right",
                fill: OPTIMIZED_COLOR,
                fontSize: 11,
                fontWeight: 600,
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Section 4: Weekly cost breakdown comparison */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">
          Weekly Cost Comparison
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Average weekly spend: MatHem delivery vs optimized physical stores
        </p>
        <div className="space-y-4">
          {weeklyData.map((row) => {
            const isMathem = row.label === "MatHem average";
            const maxVal = Math.max(...weeklyData.map((d) => d.value));
            const pct = (row.value / maxVal) * 100;
            const color = isMathem ? MATHEM_COLOR : OPTIMIZED_COLOR;
            return (
              <div key={row.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600 font-medium flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: color }}
                    />
                    {row.label}
                  </span>
                  <span className="font-bold text-gray-900">
                    {SEK(row.value)}/wk
                  </span>
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
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">Weekly savings</span>
          <span className="text-sm font-bold text-green-600">
            {SEK(MATHEM_AVG_WEEKLY - result.optimizedTotal)} less (
            {weeklyDiff.toFixed(1)}%)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 5: Hidden costs */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-1">
            Hidden Delivery Costs
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Overhead fees on every MatHem order ({MATHEM_ORDERS_PER_MONTH}{" "}
            orders/month avg)
          </p>
          <div className="space-y-3">
            {[
              {
                label: "Delivery fee",
                perOrder: MATHEM_FEES.delivery,
                monthly: deliveryMonthly,
              },
              {
                label: "Box fee",
                perOrder: MATHEM_FEES.boxes,
                monthly: boxesMonthly,
              },
              {
                label: "Pant (deposit)",
                perOrder: MATHEM_FEES.pant,
                monthly: pantMonthly,
              },
            ].map((fee) => (
              <div
                key={fee.label}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600">{fee.label}</span>
                <span className="text-gray-500">
                  {fee.perOrder} kr x {MATHEM_ORDERS_PER_MONTH} ={" "}
                  <span className="font-semibold text-gray-800">
                    {SEK(fee.monthly)}
                  </span>
                </span>
              </div>
            ))}

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">
                Total monthly overhead
              </span>
              <span className="text-sm font-bold text-purple-700">
                {SEK(totalOverheadMonthly)}
              </span>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-600 font-medium">
                  % of total MatHem spend
                </span>
                <span className="text-sm font-bold text-purple-800">
                  {overheadPct.toFixed(1)}%
                </span>
              </div>
              <div className="mt-2 h-2 bg-purple-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-purple-500"
                  style={{ width: `${Math.min(overheadPct * 4, 100)}%` }}
                />
              </div>
              <p className="text-xs text-purple-500 mt-1.5">
                {SEK(totalOverheadMonthly * 12)} per year in delivery fees alone
              </p>
            </div>
          </div>
        </div>

        {/* Section 6: Category breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-800">Category Breakdown</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              MatHem sample order vs optimized weekly (approximate)
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-2.5 text-left">Category</th>
                  <th className="px-3 py-2.5 text-right">MatHem (sample)</th>
                  <th className="px-3 py-2.5 text-right">Store (optimized)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categoryIds.map((catId) => {
                  const cat = CATEGORIES[catId];
                  const mathemVal = mathemCategoryTotals[catId] ?? 0;
                  const storeVal = optimizedCategoryTotals[catId] ?? 0;
                  return (
                    <tr
                      key={catId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-2.5">
                        <span className="flex items-center gap-2">
                          <span className="text-base">{cat.icon}</span>
                          <span className="font-medium text-gray-800">
                            {cat.name}
                          </span>
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right font-semibold text-purple-700">
                        {mathemVal > 0 ? `${mathemVal.toFixed(0)} kr` : "---"}
                      </td>
                      <td className="px-3 py-2.5 text-right font-semibold text-green-700">
                        {storeVal > 0 ? `${storeVal.toFixed(0)} kr` : "---"}
                      </td>
                    </tr>
                  );
                })}
                {/* "Other" row for items that don't map to our categories */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-2.5">
                    <span className="flex items-center gap-2">
                      <span className="text-base">📦</span>
                      <span className="font-medium text-gray-800">Other</span>
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold text-purple-700">
                    {(mathemCategoryTotals.other ?? 0).toFixed(0)} kr
                  </td>
                  <td className="px-3 py-2.5 text-right text-gray-400">---</td>
                </tr>
                {/* Totals row */}
                <tr className="bg-gray-50 font-bold">
                  <td className="px-5 py-2.5 text-gray-800">Total</td>
                  <td className="px-3 py-2.5 text-right text-purple-800">
                    {SEK(sampleOrderTotal)}
                  </td>
                  <td className="px-3 py-2.5 text-right text-green-800">
                    {SEK(result.optimizedTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-5 py-2.5 bg-amber-50 border-t border-amber-200">
            <p className="text-xs text-amber-700">
              Note: MatHem column is one sample order ({SEK(sampleOrderTotal)}).
              Categories are approximate mappings. &quot;Other&quot; includes baby food,
              drinks, and household items.
            </p>
          </div>
        </div>
      </div>

      {/* Section 7: Key insights */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-xs text-green-600 font-medium uppercase tracking-wide">
              Monthly savings potential
            </p>
            <p className="text-2xl font-bold text-green-800 mt-1">
              {SEK(monthlySavings)}
            </p>
            <p className="text-xs text-green-500 mt-0.5">
              By switching from MatHem to optimized multi-store shopping (
              {savingsPct.toFixed(0)}% reduction)
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">
              Delivery overhead per year
            </p>
            <p className="text-2xl font-bold text-purple-800 mt-1">
              {SEK(totalOverheadMonthly * 12)}
            </p>
            <p className="text-xs text-purple-500 mt-0.5">
              {SEK(totalOverheadMonthly)}/month in fees you completely avoid with
              physical stores
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">
              Online delivery price premium
            </p>
            <p className="text-2xl font-bold text-blue-800 mt-1">
              ~15-25%
            </p>
            <p className="text-xs text-blue-500 mt-0.5">
              MatHem prices are generally higher than in-store, especially on
              produce and dairy
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">
              Recommendation
            </p>
            <p className="text-lg font-bold text-amber-800 mt-1">
              Split trips across 2-3 stores
            </p>
            <p className="text-xs text-amber-500 mt-0.5">
              Weekly visits to Lidl + ICA Maxi cover most items. Save MatHem for
              occasional convenience or specialty items only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
