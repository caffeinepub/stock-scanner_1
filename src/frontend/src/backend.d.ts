import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Stock {
    rsi: number;
    macdSignal: string;
    volume: bigint;
    sector: string;
    fiftyDayMA: number;
    companyName: string;
    percentChange: number;
    price: number;
    twoHundredDayMA: number;
    symbol: string;
}
export interface MarketSummary {
    name: string;
    currentValue: number;
    change: number;
}
export interface ScanCriteria {
    volumeThreshold?: bigint;
    minRSI?: number;
    maxPrice?: number;
    maxPercentChange?: number;
    minPercentChange?: number;
    maxRSI?: number;
    minPrice?: number;
    aboveTwoHundredMA?: boolean;
    aboveFiftyMA?: boolean;
    macdSignalFilter?: string;
}
export interface backendInterface {
    addToWatchlist(symbol: string): Promise<void>;
    getAllStocks(): Promise<Array<Stock>>;
    getMarketSummary(): Promise<Array<MarketSummary>>;
    getStock(symbol: string): Promise<Stock>;
    getWatchlist(): Promise<Array<string>>;
    removeFromWatchlist(symbol: string): Promise<void>;
    scanStocks(criteria: ScanCriteria): Promise<Array<Stock>>;
    scanStocksPaginated(criteria: ScanCriteria, limit: bigint, offset: bigint): Promise<Array<Stock>>;
}
