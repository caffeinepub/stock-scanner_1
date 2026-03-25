import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import type { Stock } from "../backend.d";
import {
  formatMA,
  formatPercent,
  formatPrice,
  formatVolume,
} from "../lib/format";

interface Props {
  stock: Stock | null;
  onClose: () => void;
  isWatched: boolean;
  onToggleWatch: (symbol: string) => void;
}

function RSIBadge({ rsi }: { rsi: number }) {
  if (rsi > 70)
    return (
      <Badge className="bg-destructive/20 text-destructive border-destructive/30">
        Overbought {rsi.toFixed(1)}
      </Badge>
    );
  if (rsi < 30)
    return (
      <Badge className="bg-success/20 text-success border-success/30">
        Oversold {rsi.toFixed(1)}
      </Badge>
    );
  return <Badge variant="secondary">{rsi.toFixed(1)}</Badge>;
}

function MACDBadge({ signal }: { signal: string }) {
  if (signal === "Bullish")
    return (
      <Badge className="bg-success/20 text-success border-success/30">
        Bullish
      </Badge>
    );
  if (signal === "Bearish")
    return (
      <Badge className="bg-destructive/20 text-destructive border-destructive/30">
        Bearish
      </Badge>
    );
  return <Badge variant="secondary">Neutral</Badge>;
}

export function StockDetailModal({
  stock,
  onClose,
  isWatched,
  onToggleWatch,
}: Props) {
  if (!stock) return null;
  const isPositive = stock.percentChange >= 0;
  const vs50 = formatMA(stock.price, stock.fiftyDayMA);
  const vs200 = formatMA(stock.price, stock.twoHundredDayMA);
  const vs50Pos = stock.price >= stock.fiftyDayMA;
  const vs200Pos = stock.price >= stock.twoHundredDayMA;

  return (
    <Dialog open={!!stock} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        data-ocid="stock_detail.dialog"
        className="max-w-md border-border"
        style={{ background: "oklch(0.17 0.015 255)" }}
      >
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight">
                {stock.symbol}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                {stock.companyName}
              </p>
              <p className="text-xs text-muted-foreground">{stock.sector}</p>
            </div>
            <Button
              data-ocid="stock_detail.watchlist.toggle"
              variant="ghost"
              size="sm"
              className={`mt-1 ${isWatched ? "text-yellow-400" : "text-muted-foreground"} hover:text-yellow-400`}
              onClick={() => onToggleWatch(stock.symbol)}
            >
              <Star
                className={`w-5 h-5 ${isWatched ? "fill-yellow-400" : ""}`}
              />
              {isWatched ? "Watching" : "Watch"}
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="flex items-baseline gap-3">
            <span className="tabular text-3xl font-bold text-foreground">
              ${formatPrice(stock.price)}
            </span>
            <span
              className={`tabular text-lg font-semibold ${isPositive ? "text-success" : "text-destructive"}`}
            >
              {isPositive ? "▲" : "▼"} {formatPercent(stock.percentChange)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <DataCard label="Volume" value={formatVolume(stock.volume)} />
            <DataCard label="RSI" value={<RSIBadge rsi={stock.rsi} />} />
            <DataCard
              label="MACD Signal"
              value={<MACDBadge signal={stock.macdSignal} />}
            />
            <DataCard
              label="Sector"
              value={
                <span className="text-sm text-foreground">{stock.sector}</span>
              }
            />
            <DataCard
              label="vs 50-Day MA"
              value={
                <span
                  className={`tabular text-sm font-semibold ${vs50Pos ? "text-success" : "text-destructive"}`}
                >
                  {vs50}
                </span>
              }
            />
            <DataCard
              label="vs 200-Day MA"
              value={
                <span
                  className={`tabular text-sm font-semibold ${vs200Pos ? "text-success" : "text-destructive"}`}
                >
                  {vs200}
                </span>
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div>
              <span className="block">50-Day MA</span>
              <span className="tabular text-foreground font-medium">
                ${formatPrice(stock.fiftyDayMA)}
              </span>
            </div>
            <div>
              <span className="block">200-Day MA</span>
              <span className="tabular text-foreground font-medium">
                ${formatPrice(stock.twoHundredDayMA)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            data-ocid="stock_detail.close_button"
            variant="outline"
            className="flex-1 border-border text-foreground hover:bg-muted"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DataCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      className="rounded-md p-2.5"
      style={{ background: "oklch(0.13 0.015 255)" }}
    >
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div>{value}</div>
    </div>
  );
}
