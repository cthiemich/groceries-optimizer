"use client";
import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { PRODUCTS } from "@/data/products";
import { optimize, defaultDiscounts } from "@/lib/optimizer";
import type { WeeklyQuantities, TierPreferences } from "@/lib/optimizer";
import type { TierId } from "@/data/products";

const WeeklyCalculator    = dynamic(() => import("@/components/WeeklyCalculator"),    { ssr: false });
const StoreComparison     = dynamic(() => import("@/components/StoreComparison"),     { ssr: false });
const OptimizationResults = dynamic(() => import("@/components/OptimizationResults"), { ssr: false });
const PriceTracker        = dynamic(() => import("@/components/PriceTracker"),        { ssr: false });
const BrandAnalysis       = dynamic(() => import("@/components/BrandAnalysis"),       { ssr: false });
const SensitivityAnalysis = dynamic(() => import("@/components/SensitivityAnalysis"), { ssr: false });

const TABS = [
  { id: "calculator",   label: "Calculator",    icon: "🧮" },
  { id: "comparison",   label: "Compare Stores", icon: "📊" },
  { id: "optimize",     label: "Optimize",      icon: "✅" },
  { id: "tracker",      label: "Price Tracker", icon: "📍" },
  { id: "brands",       label: "Brand Analysis", icon: "🏷️" },
  { id: "sensitivity",  label: "Sensitivity",   icon: "📈" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function defaultQuantities(): WeeklyQuantities {
  return Object.fromEntries(PRODUCTS.map((p) => [p.id, p.defaultWeeklyQty]));
}

function defaultTiers(): TierPreferences {
  return Object.fromEntries(PRODUCTS.map((p) => [p.id, "storeBrand" as TierId]));
}

const SEK = (n: number) => `${n.toFixed(0)} kr`;

export default function Home() {
  const [tab, setTab] = useState<TabId>("calculator");
  const [quantities, setQuantities] = useState<WeeklyQuantities>(defaultQuantities);
  const [tiers, setTiers] = useState<TierPreferences>(defaultTiers);

  const result = useMemo(
    () => optimize(quantities, tiers, defaultDiscounts()),
    [quantities, tiers]
  );

  const onQuantityChange = useCallback((id: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, [id]: qty }));
  }, []);

  const onTierChange = useCallback((id: string, tier: TierId) => {
    setTiers((prev) => ({ ...prev, [id]: tier }));
  }, []);

  const onReset = useCallback(() => {
    setQuantities(defaultQuantities());
    setTiers(defaultTiers());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">🛒</div>
              <div>
                <h1 className="font-bold text-gray-900 text-sm leading-tight">Swedish Grocery Optimizer</h1>
                <p className="text-xs text-gray-400">Family of 4 · Huddinge · Lidl vs ICA Maxi vs Coop</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Optimized weekly</p>
                  <p className="font-bold text-gray-900">{SEK(result.optimizedTotal)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Monthly</p>
                  <p className="font-bold text-gray-900">{SEK(result.monthlyOptimized)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">You save</p>
                  <p className="font-bold text-green-600">{result.savingsPct.toFixed(0)}%</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${result.savingsPct >= 20 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                {result.savingsPct >= 20 ? "20%+ target met" : `${result.savingsPct.toFixed(1)}% saved`}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <nav className="flex gap-0 overflow-x-auto -mb-px">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                  tab === t.id
                    ? "border-green-600 text-green-700"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {tab === "calculator"  && <WeeklyCalculator quantities={quantities} tiers={tiers} onQuantityChange={onQuantityChange} onTierChange={onTierChange} onReset={onReset} />}
        {tab === "comparison"  && <StoreComparison result={result} />}
        {tab === "optimize"    && <OptimizationResults result={result} />}
        {tab === "tracker"     && <PriceTracker />}
        {tab === "brands"      && <BrandAnalysis quantities={quantities} />}
        {tab === "sensitivity" && <SensitivityAnalysis quantities={quantities} tiers={tiers} />}
      </main>

      <footer className="border-t border-gray-200 bg-white mt-8 py-4">
        <p className="text-center text-xs text-gray-400">
          Prices based on Huddinge-area store surveys (Lidl Huddinge C · ICA Maxi Flemingsberg · Coop Extra Huddinge) · June 2025 benchmarks
        </p>
      </footer>
    </div>
  );
}
