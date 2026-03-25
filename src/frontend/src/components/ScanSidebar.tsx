import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronRight, List, Play, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { ScanCriteria } from "../backend.d";

interface SidebarProps {
  onScan: (criteria: ScanCriteria) => void;
  onShowAll: () => void;
  isScanning: boolean;
}

const defaultFilters = {
  minPrice: "",
  maxPrice: "",
  minChange: "",
  maxChange: "",
  minRSI: "",
  maxRSI: "",
  minVolume: "",
  macdSignal: "All",
  aboveFiftyMA: false,
  aboveTwoHundredMA: false,
};

type Section = "price" | "change" | "rsi" | "volume" | "signals";

export function ScanSidebar({ onScan, onShowAll, isScanning }: SidebarProps) {
  const [filters, setFilters] = useState(defaultFilters);
  const [open, setOpen] = useState<Record<Section, boolean>>({
    price: true,
    change: true,
    rsi: true,
    volume: true,
    signals: true,
  });

  const toggle = (s: Section) =>
    setOpen((prev) => ({ ...prev, [s]: !prev[s] }));

  const handleReset = () => setFilters(defaultFilters);

  const handleScan = () => {
    const criteria: ScanCriteria = {};
    if (filters.minPrice)
      criteria.minPrice = Number.parseFloat(filters.minPrice);
    if (filters.maxPrice)
      criteria.maxPrice = Number.parseFloat(filters.maxPrice);
    if (filters.minChange)
      criteria.minPercentChange = Number.parseFloat(filters.minChange);
    if (filters.maxChange)
      criteria.maxPercentChange = Number.parseFloat(filters.maxChange);
    if (filters.minRSI) criteria.minRSI = Number.parseFloat(filters.minRSI);
    if (filters.maxRSI) criteria.maxRSI = Number.parseFloat(filters.maxRSI);
    if (filters.minVolume)
      criteria.volumeThreshold = BigInt(
        Math.floor(Number.parseFloat(filters.minVolume) * 1_000_000),
      );
    if (filters.macdSignal !== "All")
      criteria.macdSignalFilter = filters.macdSignal;
    if (filters.aboveFiftyMA) criteria.aboveFiftyMA = true;
    if (filters.aboveTwoHundredMA) criteria.aboveTwoHundredMA = true;
    onScan(criteria);
  };

  const set = (key: keyof typeof defaultFilters, val: string | boolean) =>
    setFilters((prev) => ({ ...prev, [key]: val }));

  return (
    <aside
      className="w-64 shrink-0 flex flex-col border-r border-border overflow-y-auto"
      style={{ background: "oklch(0.15 0.015 255)" }}
    >
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-bold text-foreground tracking-wider uppercase">
          Scan Filters
        </h2>
      </div>

      <div className="flex-1 p-3 space-y-1 text-sm">
        {/* Price Range */}
        <SectionHeader
          label="Price Range"
          open={open.price}
          onToggle={() => toggle("price")}
        />
        {open.price && (
          <div className="pb-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label
                  htmlFor="price-min"
                  className="text-xs text-muted-foreground"
                >
                  Min $
                </Label>
                <Input
                  id="price-min"
                  data-ocid="scan.price_min.input"
                  className="h-7 text-xs tabular bg-input border-border"
                  value={filters.minPrice}
                  onChange={(e) => set("minPrice", e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label
                  htmlFor="price-max"
                  className="text-xs text-muted-foreground"
                >
                  Max $
                </Label>
                <Input
                  id="price-max"
                  data-ocid="scan.price_max.input"
                  className="h-7 text-xs tabular bg-input border-border"
                  value={filters.maxPrice}
                  onChange={(e) => set("maxPrice", e.target.value)}
                  placeholder="∞"
                />
              </div>
            </div>
          </div>
        )}

        <Separator className="bg-border" />

        {/* % Change */}
        <SectionHeader
          label="% Change"
          open={open.change}
          onToggle={() => toggle("change")}
        />
        {open.change && (
          <div className="pb-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label
                  htmlFor="change-min"
                  className="text-xs text-muted-foreground"
                >
                  Min %
                </Label>
                <Input
                  id="change-min"
                  data-ocid="scan.change_min.input"
                  className="h-7 text-xs tabular bg-input border-border"
                  value={filters.minChange}
                  onChange={(e) => set("minChange", e.target.value)}
                  placeholder="-100"
                />
              </div>
              <div>
                <Label
                  htmlFor="change-max"
                  className="text-xs text-muted-foreground"
                >
                  Max %
                </Label>
                <Input
                  id="change-max"
                  data-ocid="scan.change_max.input"
                  className="h-7 text-xs tabular bg-input border-border"
                  value={filters.maxChange}
                  onChange={(e) => set("maxChange", e.target.value)}
                  placeholder="100"
                />
              </div>
            </div>
          </div>
        )}

        <Separator className="bg-border" />

        {/* RSI */}
        <SectionHeader
          label="RSI"
          open={open.rsi}
          onToggle={() => toggle("rsi")}
        />
        {open.rsi && (
          <div className="pb-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label
                  htmlFor="rsi-min"
                  className="text-xs text-muted-foreground"
                >
                  Min RSI
                </Label>
                <Input
                  id="rsi-min"
                  data-ocid="scan.rsi_min.input"
                  className="h-7 text-xs tabular bg-input border-border"
                  value={filters.minRSI}
                  onChange={(e) => set("minRSI", e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label
                  htmlFor="rsi-max"
                  className="text-xs text-muted-foreground"
                >
                  Max RSI
                </Label>
                <Input
                  id="rsi-max"
                  data-ocid="scan.rsi_max.input"
                  className="h-7 text-xs tabular bg-input border-border"
                  value={filters.maxRSI}
                  onChange={(e) => set("maxRSI", e.target.value)}
                  placeholder="100"
                />
              </div>
            </div>
          </div>
        )}

        <Separator className="bg-border" />

        {/* Volume */}
        <SectionHeader
          label="Volume"
          open={open.volume}
          onToggle={() => toggle("volume")}
        />
        {open.volume && (
          <div className="pb-3">
            <Label htmlFor="vol-min" className="text-xs text-muted-foreground">
              Min Volume (M)
            </Label>
            <Input
              id="vol-min"
              data-ocid="scan.volume.input"
              className="h-7 text-xs tabular bg-input border-border"
              value={filters.minVolume}
              onChange={(e) => set("minVolume", e.target.value)}
              placeholder="0"
            />
          </div>
        )}

        <Separator className="bg-border" />

        {/* Signals */}
        <SectionHeader
          label="Signals"
          open={open.signals}
          onToggle={() => toggle("signals")}
        />
        {open.signals && (
          <div className="pb-3 space-y-3">
            <div>
              <Label
                htmlFor="macd-signal"
                className="text-xs text-muted-foreground"
              >
                MACD Signal
              </Label>
              <Select
                value={filters.macdSignal}
                onValueChange={(v) => set("macdSignal", v)}
              >
                <SelectTrigger
                  id="macd-signal"
                  data-ocid="scan.macd.select"
                  className="h-7 text-xs bg-input border-border mt-1"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Bullish">Bullish</SelectItem>
                  <SelectItem value="Bearish">Bearish</SelectItem>
                  <SelectItem value="Neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="above50ma"
                  data-ocid="scan.above50ma.checkbox"
                  checked={filters.aboveFiftyMA}
                  onCheckedChange={(v) => set("aboveFiftyMA", !!v)}
                  className="border-border"
                />
                <Label
                  htmlFor="above50ma"
                  className="text-xs text-foreground cursor-pointer"
                >
                  Above 50-day MA
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="above200ma"
                  data-ocid="scan.above200ma.checkbox"
                  checked={filters.aboveTwoHundredMA}
                  onCheckedChange={(v) => set("aboveTwoHundredMA", !!v)}
                  className="border-border"
                />
                <Label
                  htmlFor="above200ma"
                  className="text-xs text-foreground cursor-pointer"
                >
                  Above 200-day MA
                </Label>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-border space-y-2">
        <Button
          data-ocid="scan.run_scan.primary_button"
          className="w-full h-8 text-xs font-bold bg-primary text-primary-foreground hover:opacity-90"
          onClick={handleScan}
          disabled={isScanning}
        >
          <Play className="w-3 h-3 mr-1" />
          {isScanning ? "Scanning..." : "Run Scan"}
        </Button>
        <Button
          data-ocid="scan.show_all.secondary_button"
          variant="outline"
          className="w-full h-8 text-xs border-border text-foreground hover:bg-muted"
          onClick={onShowAll}
        >
          <List className="w-3 h-3 mr-1" />
          Show All
        </Button>
        <Button
          data-ocid="scan.reset.secondary_button"
          variant="ghost"
          className="w-full h-7 text-xs text-muted-foreground hover:text-foreground"
          onClick={handleReset}
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset Filters
        </Button>
      </div>
    </aside>
  );
}

function SectionHeader({
  label,
  open,
  onToggle,
}: { label: string; open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="flex items-center justify-between w-full py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
      onClick={onToggle}
    >
      {label}
      {open ? (
        <ChevronDown className="w-3 h-3" />
      ) : (
        <ChevronRight className="w-3 h-3" />
      )}
    </button>
  );
}
