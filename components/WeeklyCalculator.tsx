"use client";
import { PRODUCTS, CATEGORIES, type CategoryId, type TierId } from "@/data/products";
import type { WeeklyQuantities, TierPreferences } from "@/lib/optimizer";

interface Props {
  quantities: WeeklyQuantities;
  tiers: TierPreferences;
  onQuantityChange: (id: string, qty: number) => void;
  onTierChange: (id: string, tier: TierId) => void;
  onReset: () => void;
}

export default function WeeklyCalculator({ quantities, tiers, onQuantityChange, onTierChange, onReset }: Props) {
  const categoryIds = Object.keys(CATEGORIES) as CategoryId[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Weekly Consumption Calculator</h2>
          <p className="text-sm text-gray-500 mt-0.5">Set your family's weekly quantities and brand tier preferences</p>
        </div>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Reset to defaults
        </button>
      </div>

      {categoryIds.map((catId) => {
        const cat = CATEGORIES[catId];
        const products = PRODUCTS.filter((p) => p.category === catId);
        return (
          <div key={catId} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2" style={{ backgroundColor: `${cat.color}15` }}>
              <span className="text-xl">{cat.icon}</span>
              <h3 className="font-semibold text-gray-800">{cat.name}</h3>
              <span className="text-xs text-gray-400 ml-auto">{products.length} items</span>
            </div>
            <div className="divide-y divide-gray-50">
              {products.map((p) => {
                const qty = quantities[p.id] ?? p.defaultWeeklyQty;
                const tier = tiers[p.id] ?? "storeBrand";
                return (
                  <div key={p.id} className="px-5 py-3 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.swedishName} · {p.unitSize}</p>
                    </div>

                    {/* Tier toggle */}
                    <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-medium">
                      <button
                        onClick={() => onTierChange(p.id, "storeBrand")}
                        className={`px-2.5 py-1.5 transition-colors ${
                          tier === "storeBrand"
                            ? "bg-blue-600 text-white"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        Store brand
                      </button>
                      <button
                        onClick={() => onTierChange(p.id, "premium")}
                        className={`px-2.5 py-1.5 transition-colors border-l border-gray-200 ${
                          tier === "premium"
                            ? "bg-purple-600 text-white"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        Premium
                      </button>
                    </div>

                    {/* Quantity stepper */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onQuantityChange(p.id, Math.max(0, qty - 1))}
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 font-bold text-sm transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-semibold text-gray-800 text-sm">{qty}</span>
                      <button
                        onClick={() => onQuantityChange(p.id, qty + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 font-bold text-sm transition-colors"
                      >
                        +
                      </button>
                      <span className="text-xs text-gray-400 w-10">{p.unit}/wk</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <p className="text-xs text-gray-400 text-center">
        Prices reflect Huddinge-area benchmarks (June 2025) · All amounts in SEK
      </p>
    </div>
  );
}
