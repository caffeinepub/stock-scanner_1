import { Skeleton } from "@/components/ui/skeleton";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useMarketSummary } from "../hooks/useQueries";

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3"];

export function MarketBar() {
  const { data: markets, isLoading } = useMarketSummary();

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-4 py-2 border-b border-border"
      style={{ background: "oklch(0.13 0.015 255)" }}
    >
      <div className="flex items-center gap-2 mr-6">
        <span className="text-primary font-bold text-lg tracking-tight">
          📈 StockScan
        </span>
      </div>
      <div className="flex items-center gap-4 flex-1 overflow-x-auto">
        {isLoading
          ? SKELETON_KEYS.map((k) => <Skeleton key={k} className="h-8 w-36" />)
          : (markets ?? []).map((m) => {
              const isPositive = m.change >= 0;
              return (
                <div
                  key={m.name}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-card border border-border shrink-0"
                >
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {m.name}
                  </span>
                  <span className="tabular text-sm font-bold text-foreground">
                    {m.currentValue.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span
                    className={`flex items-center gap-0.5 tabular text-xs font-semibold ${
                      isPositive ? "text-success" : "text-destructive"
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {isPositive ? "+" : ""}
                    {m.change.toFixed(2)}%
                  </span>
                </div>
              );
            })}
      </div>
      <div className="ml-4 text-xs text-muted-foreground shrink-0">
        Live Data
      </div>
    </header>
  );
}
