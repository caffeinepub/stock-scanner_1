import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ScanCriteria, Stock } from "../backend.d";
import { useActor } from "./useActor";

export function useMarketSummary() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["marketSummary"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMarketSummary();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useAllStocks() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allStocks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStocks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useScanStocks(criteria: ScanCriteria, enabled: boolean) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["scanStocks", criteria],
    queryFn: async () => {
      if (!actor) return [];
      return actor.scanStocks(criteria);
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useWatchlist() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWatchlist();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useWatchlistStocks(symbols: string[]) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["watchlistStocks", symbols],
    queryFn: async () => {
      if (!actor || symbols.length === 0) return [];
      const results = await Promise.all(symbols.map((s) => actor.getStock(s)));
      return results as Stock[];
    },
    enabled: !!actor && !isFetching && symbols.length > 0,
  });
}

export function useAddToWatchlist() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (symbol: string) => {
      if (!actor) throw new Error("No actor");
      return actor.addToWatchlist(symbol);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["watchlist"] });
      qc.invalidateQueries({ queryKey: ["watchlistStocks"] });
    },
  });
}

export function useRemoveFromWatchlist() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (symbol: string) => {
      if (!actor) throw new Error("No actor");
      return actor.removeFromWatchlist(symbol);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["watchlist"] });
      qc.invalidateQueries({ queryKey: ["watchlistStocks"] });
    },
  });
}
