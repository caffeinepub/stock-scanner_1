import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Bookmark, Menu, Scan, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ScanCriteria, Stock } from "./backend.d";
import { MarketBar } from "./components/MarketBar";
import { ScanSidebar } from "./components/ScanSidebar";
import { StockDetailModal } from "./components/StockDetailModal";
import { StockTable } from "./components/StockTable";
import {
  useAddToWatchlist,
  useAllStocks,
  useRemoveFromWatchlist,
  useScanStocks,
  useWatchlist,
  useWatchlistStocks,
} from "./hooks/useQueries";

const qc = new QueryClient();

function Dashboard() {
  const [view, setView] = useState<"scanner" | "watchlist">("scanner");
  const [scanCriteria, setScanCriteria] = useState<ScanCriteria | null>(null);
  const [showAllMode, setShowAllMode] = useState(true);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const allStocks = useAllStocks();
  const scanResult = useScanStocks(
    scanCriteria ?? {},
    !!scanCriteria && !showAllMode,
  );
  const { data: watchlistSymbols = [] } = useWatchlist();
  const watchlistStocks = useWatchlistStocks(watchlistSymbols);
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const handleScan = (criteria: ScanCriteria) => {
    setScanCriteria(criteria);
    setShowAllMode(false);
  };

  const handleShowAll = () => {
    setScanCriteria(null);
    setShowAllMode(true);
  };

  const handleToggleWatch = (symbol: string) => {
    if (watchlistSymbols.includes(symbol)) {
      removeFromWatchlist.mutate(symbol, {
        onSuccess: () => toast.success(`Removed ${symbol} from watchlist`),
        onError: () => toast.error("Failed to update watchlist"),
      });
    } else {
      addToWatchlist.mutate(symbol, {
        onSuccess: () => toast.success(`Added ${symbol} to watchlist`),
        onError: () => toast.error("Failed to update watchlist"),
      });
    }
  };

  const displayedStocks =
    view === "watchlist"
      ? (watchlistStocks.data ?? [])
      : showAllMode
        ? (allStocks.data ?? [])
        : (scanResult.data ?? []);

  const isLoading =
    view === "watchlist"
      ? watchlistStocks.isLoading
      : showAllMode
        ? allStocks.isLoading
        : scanResult.isLoading || scanResult.isFetching;

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: "oklch(0.13 0.015 255)" }}
    >
      <MarketBar />

      {/* View Tabs + Mobile Sidebar Toggle */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b border-border shrink-0"
        style={{ background: "oklch(0.15 0.015 255)" }}
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground lg:hidden"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            {sidebarOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </Button>
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as "scanner" | "watchlist")}
          >
            <TabsList className="h-7 bg-muted">
              <TabsTrigger
                data-ocid="nav.scanner.tab"
                value="scanner"
                className="text-xs h-6 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Scan className="w-3 h-3 mr-1" />
                Scanner
              </TabsTrigger>
              <TabsTrigger
                data-ocid="nav.watchlist.tab"
                value="watchlist"
                className="text-xs h-6 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Bookmark className="w-3 h-3 mr-1" />
                Watchlist
                {watchlistSymbols.length > 0 && (
                  <span className="ml-1 text-xs bg-primary/30 text-primary rounded-full px-1.5">
                    {watchlistSymbols.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="text-xs text-muted-foreground hidden sm:block">
          {showAllMode ? "Showing all stocks" : "Custom scan results"}
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {view === "scanner" && sidebarOpen && (
          <ScanSidebar
            onScan={handleScan}
            onShowAll={handleShowAll}
            isScanning={scanResult.isFetching}
          />
        )}

        <main className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <StockTable
            stocks={displayedStocks}
            isLoading={isLoading}
            watchlist={watchlistSymbols}
            onToggleWatch={handleToggleWatch}
            onSelectStock={setSelectedStock}
            mode={view}
          />
        </main>
      </div>

      <StockDetailModal
        stock={selectedStock}
        onClose={() => setSelectedStock(null)}
        isWatched={
          selectedStock
            ? watchlistSymbols.includes(selectedStock.symbol)
            : false
        }
        onToggleWatch={handleToggleWatch}
      />

      {/* Footer */}
      <footer
        className="px-4 py-2 border-t border-border shrink-0 text-center"
        style={{ background: "oklch(0.15 0.015 255)" }}
      >
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ♥ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <Dashboard />
      <Toaster />
    </QueryClientProvider>
  );
}
