# Stock Scanner

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Stock market trading scanner with real-time-style data display
- Scanner table showing stocks with key metrics: symbol, name, price, % change, volume, RSI, MACD signal, moving averages
- Filter/scan panel with criteria: price range, % change range, volume threshold, RSI range, technical signals (bullish/bearish MACD crossover, oversold/overbought RSI, above/below moving averages)
- Market overview header (major indices: S&P 500, NASDAQ, DOW)
- Watchlist feature to save/track stocks
- Sortable columns in scanner table
- Stock detail view with key stats
- Sample stock data (50+ stocks with realistic metrics)

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: store watchlist per user, provide stock data with simulated market metrics
2. Backend: CRUD for watchlist (add/remove symbols)
3. Frontend: dark financial dashboard layout
4. Frontend: market overview header bar
5. Frontend: left sidebar with scan filter controls
6. Frontend: main scanner results table (sortable, with signal badges)
7. Frontend: watchlist panel
8. Frontend: stock detail modal/panel
