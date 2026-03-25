import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp, ArrowUpDown, Search, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Stock } from "../backend.d";
import {
  formatMA,
  formatPercent,
  formatPrice,
  formatVolume,
} from "../lib/format";

type SortKey =
  | "symbol"
  | "price"
  | "percentChange"
  | "volume"
  | "rsi"
  | "macdSignal";
type SortDir = "asc" | "desc";

const SKELETON_ROWS = [
  "sr-1",
  "sr-2",
  "sr-3",
  "sr-4",
  "sr-5",
  "sr-6",
  "sr-7",
  "sr-8",
];
const SKELETON_COLS = [
  "sc-1",
  "sc-2",
  "sc-3",
  "sc-4",
  "sc-5",
  "sc-6",
  "sc-7",
  "sc-8",
  "sc-9",
  "sc-10",
  "sc-11",
];

function RSIBadge({ rsi }: { rsi: number }) {
  if (rsi > 70)
    return (
      <Badge className="text-xs px-1.5 py-0 bg-destructive/20 text-destructive border-destructive/30 font-mono">
        {rsi.toFixed(1)}
      </Badge>
    );
  if (rsi < 30)
    return (
      <Badge className="text-xs px-1.5 py-0 bg-success/20 text-success border-success/30 font-mono">
        {rsi.toFixed(1)}
      </Badge>
    );
  return (
    <Badge variant="secondary" className="text-xs px-1.5 py-0 font-mono">
      {rsi.toFixed(1)}
    </Badge>
  );
}

function MACDBadge({ signal }: { signal: string }) {
  if (signal === "Bullish")
    return (
      <Badge className="text-xs px-1.5 py-0 bg-success/20 text-success border-success/30">
        Bullish
      </Badge>
    );
  if (signal === "Bearish")
    return (
      <Badge className="text-xs px-1.5 py-0 bg-destructive/20 text-destructive border-destructive/30">
        Bearish
      </Badge>
    );
  return (
    <Badge variant="secondary" className="text-xs px-1.5 py-0">
      Neutral
    </Badge>
  );
}

function SortIcon({
  col,
  sort,
}: { col: SortKey; sort: { key: SortKey; dir: SortDir } }) {
  if (sort.key !== col)
    return <ArrowUpDown className="w-3 h-3 ml-1 inline opacity-40" />;
  return sort.dir === "asc" ? (
    <ArrowUp className="w-3 h-3 ml-1 inline text-primary" />
  ) : (
    <ArrowDown className="w-3 h-3 ml-1 inline text-primary" />
  );
}

interface Props {
  stocks: Stock[];
  isLoading: boolean;
  watchlist: string[];
  onToggleWatch: (symbol: string) => void;
  onSelectStock: (stock: Stock) => void;
  mode: "scanner" | "watchlist";
}

export function StockTable({
  stocks,
  isLoading,
  watchlist,
  onToggleWatch,
  onSelectStock,
  mode,
}: Props) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: "symbol",
    dir: "asc",
  });

  const handleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  };

  const filtered = useMemo(() => {
    let list = stocks;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          s.companyName.toLowerCase().includes(q),
      );
    }
    list = [...list].sort((a, b) => {
      let av: string | number = a[sort.key as keyof Stock] as string | number;
      let bv: string | number = b[sort.key as keyof Stock] as string | number;
      if (sort.key === "volume") {
        av = Number(a.volume);
        bv = Number(b.volume);
      }
      if (typeof av === "string" && typeof bv === "string") {
        return sort.dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sort.dir === "asc"
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });
    return list;
  }, [stocks, search, sort]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Controls */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            data-ocid="scanner.search_input"
            className="pl-8 h-8 text-xs bg-input border-border"
            placeholder="Search symbol or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="text-xs text-muted-foreground shrink-0">
          {isLoading ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            <span data-ocid="scanner.results_count.panel">
              <span className="text-foreground font-semibold">
                {filtered.length}
              </span>{" "}
              stocks{mode === "watchlist" ? " watched" : " found"}
            </span>
          )}
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader
            className="sticky top-0 z-10"
            style={{ background: "oklch(0.15 0.015 255)" }}
          >
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-8 text-center" />
              <SortableHead col="symbol" sort={sort} onSort={handleSort}>
                Symbol
              </SortableHead>
              <TableHead className="text-xs text-muted-foreground">
                Company
              </TableHead>
              <TableHead className="text-xs text-muted-foreground">
                Sector
              </TableHead>
              <SortableHead col="price" sort={sort} onSort={handleSort}>
                Price
              </SortableHead>
              <SortableHead col="percentChange" sort={sort} onSort={handleSort}>
                Change %
              </SortableHead>
              <SortableHead col="volume" sort={sort} onSort={handleSort}>
                Volume
              </SortableHead>
              <SortableHead col="rsi" sort={sort} onSort={handleSort}>
                RSI
              </SortableHead>
              <SortableHead col="macdSignal" sort={sort} onSort={handleSort}>
                MACD
              </SortableHead>
              <TableHead className="text-xs text-muted-foreground">
                vs 50MA
              </TableHead>
              <TableHead className="text-xs text-muted-foreground">
                vs 200MA
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              SKELETON_ROWS.map((rowKey, i) => (
                <TableRow
                  key={rowKey}
                  className="border-border"
                  data-ocid={`scanner.item.${i + 1}`}
                >
                  {SKELETON_COLS.map((colKey) => (
                    <TableCell key={colKey}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-16">
                  <div
                    data-ocid="scanner.empty_state"
                    className="text-muted-foreground text-sm"
                  >
                    {search
                      ? "No stocks match your search."
                      : "Run a scan or show all stocks to see results."}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence initial={false}>
                {filtered.map((stock, idx) => {
                  const isWatched = watchlist.includes(stock.symbol);
                  const isPositive = stock.percentChange >= 0;
                  const vs50Pos = stock.price >= stock.fiftyDayMA;
                  const vs200Pos = stock.price >= stock.twoHundredDayMA;
                  return (
                    <motion.tr
                      key={stock.symbol}
                      data-ocid={`scanner.item.${idx + 1}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="border-border cursor-pointer hover:bg-muted/40 transition-colors"
                      style={
                        idx % 2 === 1
                          ? { background: "oklch(0.16 0.015 255 / 0.5)" }
                          : undefined
                      }
                      onClick={() => onSelectStock(stock)}
                    >
                      <TableCell
                        className="text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          data-ocid={`scanner.watchlist.toggle.${idx + 1}`}
                          variant="ghost"
                          size="sm"
                          className={`h-6 w-6 p-0 ${isWatched ? "text-yellow-400" : "text-muted-foreground"} hover:text-yellow-400`}
                          onClick={() => onToggleWatch(stock.symbol)}
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${isWatched ? "fill-yellow-400" : ""}`}
                          />
                        </Button>
                      </TableCell>
                      <TableCell className="font-bold text-foreground tabular text-xs">
                        {stock.symbol}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[140px] truncate">
                        {stock.companyName}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {stock.sector}
                      </TableCell>
                      <TableCell className="tabular text-xs text-foreground font-medium">
                        ${formatPrice(stock.price)}
                      </TableCell>
                      <TableCell
                        className={`tabular text-xs font-semibold ${isPositive ? "text-success" : "text-destructive"}`}
                      >
                        {isPositive ? "▲" : "▼"}{" "}
                        {formatPercent(stock.percentChange)}
                      </TableCell>
                      <TableCell className="tabular text-xs text-muted-foreground">
                        {formatVolume(stock.volume)}
                      </TableCell>
                      <TableCell>
                        <RSIBadge rsi={stock.rsi} />
                      </TableCell>
                      <TableCell>
                        <MACDBadge signal={stock.macdSignal} />
                      </TableCell>
                      <TableCell
                        className={`tabular text-xs font-medium ${vs50Pos ? "text-success" : "text-destructive"}`}
                      >
                        {formatMA(stock.price, stock.fiftyDayMA)}
                      </TableCell>
                      <TableCell
                        className={`tabular text-xs font-medium ${vs200Pos ? "text-success" : "text-destructive"}`}
                      >
                        {formatMA(stock.price, stock.twoHundredDayMA)}
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function SortableHead({
  col,
  sort,
  onSort,
  children,
}: {
  col: SortKey;
  sort: { key: SortKey; dir: SortDir };
  onSort: (k: SortKey) => void;
  children: React.ReactNode;
}) {
  return (
    <TableHead
      className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none"
      onClick={() => onSort(col)}
    >
      {children}
      <SortIcon col={col} sort={sort} />
    </TableHead>
  );
}
