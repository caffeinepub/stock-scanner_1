import Array "mo:core/Array";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

actor {
  type Stock = {
    symbol : Text;
    companyName : Text;
    price : Float;
    percentChange : Float;
    volume : Nat;
    rsi : Float;
    macdSignal : Text;
    fiftyDayMA : Float;
    twoHundredDayMA : Float;
    sector : Text;
  };

  module Stock {
    public func compare(stock1 : Stock, stock2 : Stock) : Order.Order {
      Text.compare(stock1.symbol, stock2.symbol);
    };
  };

  type MarketSummary = {
    name : Text;
    currentValue : Float;
    change : Float;
  };

  type ScanCriteria = {
    minPrice : ?Float;
    maxPrice : ?Float;
    minPercentChange : ?Float;
    maxPercentChange : ?Float;
    minRSI : ?Float;
    maxRSI : ?Float;
    macdSignalFilter : ?Text;
    volumeThreshold : ?Nat;
    aboveFiftyMA : ?Bool;
    aboveTwoHundredMA : ?Bool;
  };

  let stocks = Map.empty<Text, Stock>();
  let marketSummaries = Map.empty<Text, MarketSummary>();
  let userWatchlists = Map.empty<Principal, Set.Set<Text>>();

  func checkStockExists(symbol : Text) : () {
    if (not stocks.containsKey(symbol)) {
      Runtime.trap("Stock with symbol " # symbol # " does not exist");
    };
  };

  func scanStocksHelper(criteria : ScanCriteria, limit : ?Nat, offset : ?Nat) : [Stock] {
    var stocksIter = stocks.values();

    stocksIter := stocksIter.filter(
      func(stock) {
        switch (criteria.minPrice) {
          case (?minPrice) { if (stock.price < minPrice) { return false } };
          case (null) {};
        };
        switch (criteria.maxPrice) {
          case (?maxPrice) { if (stock.price > maxPrice) { return false } };
          case (null) {};
        };
        switch (criteria.minPercentChange) {
          case (?minPercentChange) {
            if (stock.percentChange < minPercentChange) { return false };
          };
          case (null) {};
        };
        switch (criteria.maxPercentChange) {
          case (?maxPercentChange) {
            if (stock.percentChange > maxPercentChange) { return false };
          };
          case (null) {};
        };
        switch (criteria.minRSI) {
          case (?minRSI) { if (stock.rsi < minRSI) { return false } };
          case (null) {};
        };
        switch (criteria.maxRSI) {
          case (?maxRSI) { if (stock.rsi > maxRSI) { return false } };
          case (null) {};
        };
        switch (criteria.macdSignalFilter) {
          case (?signal) {
            if (not Text.equal(stock.macdSignal, signal)) { return false };
          };
          case (null) {};
        };
        switch (criteria.volumeThreshold) {
          case (?threshold) { if (stock.volume < threshold) { return false } };
          case (null) {};
        };
        switch (criteria.aboveFiftyMA) {
          case (?above) {
            if (above and (stock.price < stock.fiftyDayMA)) { return false };
            if (not above and (stock.price > stock.fiftyDayMA)) { return false };
          };
          case (null) {};
        };
        switch (criteria.aboveTwoHundredMA) {
          case (?above) {
            if (above and (stock.price < stock.twoHundredDayMA)) { return false };
            if (not above and (stock.price > stock.twoHundredDayMA)) { return false };
          };
          case (null) {};
        };
        true;
      }
    );

    switch (offset) {
      case (?off) {
        let skip = off;
        stocksIter := stocksIter.drop(skip);
      };
      case (null) {};
    };

    switch (limit) {
      case (?lim) {
        let take = lim;
        stocksIter := stocksIter.take(take);
      };
      case (null) {};
    };

    stocksIter.toArray().sort();
  };

  let sampleStockData = [
    {
      symbol = "AAPL";
      companyName = "Apple Inc.";
      price = 145.6;
      percentChange = 1.2;
      volume = 100_000_000;
      rsi = 55.4;
      macdSignal = "bullish";
      fiftyDayMA = 143.2;
      twoHundredDayMA = 140.1;
      sector = "Technology";
    },
    {
      symbol = "GOOGL";
      companyName = "Alphabet Inc.";
      price = 2754.1;
      percentChange = -0.8;
      volume = 30_000_000;
      rsi = 48.9;
      macdSignal = "neutral";
      fiftyDayMA = 2740.5;
      twoHundredDayMA = 2600.3;
      sector = "Technology";
    },
    {
      symbol = "TSLA";
      companyName = "Tesla Inc.";
      price = 688.2;
      percentChange = 2.5;
      volume = 60_000_000;
      rsi = 60.2;
      macdSignal = "bullish";
      fiftyDayMA = 675.8;
      twoHundredDayMA = 630.7;
      sector = "Automotive";
    },
    {
      symbol = "AMZN";
      companyName = "Amazon.com Inc.";
      price = 3345.7;
      percentChange = -1.1;
      volume = 50_000_000;
      rsi = 47.3;
      macdSignal = "bearish";
      fiftyDayMA = 3320.1;
      twoHundredDayMA = 3200.9;
      sector = "Consumer Discretionary";
    },
    {
      symbol = "MSFT";
      companyName = "Microsoft Corporation";
      price = 289.3;
      percentChange = 0.7;
      volume = 80_000_000;
      rsi = 53.6;
      macdSignal = "bullish";
      fiftyDayMA = 287.9;
      twoHundredDayMA = 280.5;
      sector = "Technology";
    },
    {
      symbol = "FB";
      companyName = "Meta Platforms Inc.";
      price = 355.2;
      percentChange = -0.5;
      volume = 40_000_000;
      rsi = 46.2;
      macdSignal = "neutral";
      fiftyDayMA = 353.8;
      twoHundredDayMA = 340.7;
      sector = "Technology";
    },
    {
      symbol = "NVDA";
      companyName = "NVIDIA Corporation";
      price = 210.6;
      percentChange = 1.9;
      volume = 70_000_000;
      rsi = 58.7;
      macdSignal = "bullish";
      fiftyDayMA = 208.2;
      twoHundredDayMA = 200.1;
      sector = "Technology";
    },
    {
      symbol = "JPM";
      companyName = "JPMorgan Chase & Co.";
      price = 155.8;
      percentChange = -0.7;
      volume = 35_000_000;
      rsi = 49.5;
      macdSignal = "bearish";
      fiftyDayMA = 154.3;
      twoHundredDayMA = 150.2;
      sector = "Financials";
    },
    {
      symbol = "V";
      companyName = "Visa Inc.";
      price = 224.1;
      percentChange = 1.3;
      volume = 25_000_000;
      rsi = 56.8;
      macdSignal = "bullish";
      fiftyDayMA = 222.7;
      twoHundredDayMA = 220.4;
      sector = "Financials";
    },
    {
      symbol = "PG";
      companyName = "Procter & Gamble Co.";
      price = 143.5;
      percentChange = 0.2;
      volume = 20_000_000;
      rsi = 52.3;
      macdSignal = "neutral";
      fiftyDayMA = 143.0;
      twoHundredDayMA = 140.6;
      sector = "Consumer Staples";
    },
    {
      symbol = "JNJ";
      companyName = "Johnson & Johnson";
      price = 169.7;
      percentChange = -0.3;
      volume = 18_000_000;
      rsi = 51.1;
      macdSignal = "neutral";
      fiftyDayMA = 169.2;
      twoHundredDayMA = 168.0;
      sector = "Healthcare";
    },
    {
      symbol = "WMT";
      companyName = "Walmart Inc.";
      price = 142.3;
      percentChange = 0.5;
      volume = 22_000_000;
      rsi = 54.7;
      macdSignal = "bullish";
      fiftyDayMA = 141.8;
      twoHundredDayMA = 140.2;
      sector = "Consumer Staples";
    },
    {
      symbol = "DIS";
      companyName = "The Walt Disney Company";
      price = 180.2;
      percentChange = 1.0;
      volume = 28_000_000;
      rsi = 57.9;
      macdSignal = "bullish";
      fiftyDayMA = 179.8;
      twoHundredDayMA = 178.5;
      sector = "Communication Services";
    },
    {
      symbol = "HD";
      companyName = "Home Depot Inc.";
      price = 330.6;
      percentChange = -0.6;
      volume = 15_000_000;
      rsi = 48.1;
      macdSignal = "bearish";
      fiftyDayMA = 329.2;
      twoHundredDayMA = 325.7;
      sector = "Consumer Discretionary";
    },
    {
      symbol = "BAC";
      companyName = "Bank of America Corp.";
      price = 41.9;
      percentChange = 0.8;
      volume = 55_000_000;
      rsi = 55.2;
      macdSignal = "bullish";
      fiftyDayMA = 41.4;
      twoHundredDayMA = 40.0;
      sector = "Financials";
    },
    {
      symbol = "MA";
      companyName = "Mastercard Incorporated";
      price = 362.4;
      percentChange = 1.4;
      volume = 12_000_000;
      rsi = 59.3;
      macdSignal = "bullish";
      fiftyDayMA = 361.0;
      twoHundredDayMA = 360.5;
      sector = "Financials";
    },
    {
      symbol = "UNH";
      companyName = "UnitedHealth Group Inc.";
      price = 418.5;
      percentChange = -1.0;
      volume = 10_000_000;
      rsi = 47.8;
      macdSignal = "bearish";
      fiftyDayMA = 417.1;
      twoHundredDayMA = 415.7;
      sector = "Healthcare";
    },
    {
      symbol = "XOM";
      companyName = "Exxon Mobil Corporation";
      price = 59.2;
      percentChange = 1.6;
      volume = 33_000_000;
      rsi = 62.1;
      macdSignal = "bullish";
      fiftyDayMA = 58.7;
      twoHundredDayMA = 57.3;
      sector = "Energy";
    },
    {
      symbol = "PFE";
      companyName = "Pfizer Inc.";
      price = 40.1;
      percentChange = 0.9;
      volume = 27_000_000;
      rsi = 56.5;
      macdSignal = "bullish";
      fiftyDayMA = 39.6;
      twoHundredDayMA = 39.0;
      sector = "Healthcare";
    },
    {
      symbol = "CSCO";
      companyName = "Cisco Systems Inc.";
      price = 56.8;
      percentChange = -0.4;
      volume = 19_000_000;
      rsi = 50.7;
      macdSignal = "neutral";
      fiftyDayMA = 56.3;
      twoHundredDayMA = 55.9;
      sector = "Technology";
    },
    {
      symbol = "KO";
      companyName = "The Coca-Cola Company";
      price = 56.1;
      percentChange = 0.6;
      volume = 21_000_000;
      rsi = 53.2;
      macdSignal = "bullish";
      fiftyDayMA = 55.6;
      twoHundredDayMA = 55.0;
      sector = "Consumer Staples";
    },
    {
      symbol = "INTC";
      companyName = "Intel Corporation";
      price = 53.4;
      percentChange = 1.1;
      volume = 17_000_000;
      rsi = 57.1;
      macdSignal = "bullish";
      fiftyDayMA = 52.9;
      twoHundredDayMA = 52.5;
      sector = "Technology";
    },
    {
      symbol = "MRK";
      companyName = "Merck & Co. Inc.";
      price = 75.2;
      percentChange = -0.9;
      volume = 16_000_000;
      rsi = 48.4;
      macdSignal = "bearish";
      fiftyDayMA = 74.7;
      twoHundredDayMA = 74.3;
      sector = "Healthcare";
    },
    {
      symbol = "CVX";
      companyName = "Chevron Corporation";
      price = 104.7;
      percentChange = 1.7;
      volume = 24_000_000;
      rsi = 63.4;
      macdSignal = "bullish";
      fiftyDayMA = 104.2;
      twoHundredDayMA = 103.7;
      sector = "Energy";
    },
    {
      symbol = "T";
      companyName = "AT&T Inc.";
      price = 28.5;
      percentChange = 0.3;
      volume = 18_000_000;
      rsi = 52.7;
      macdSignal = "neutral";
      fiftyDayMA = 28.0;
      twoHundredDayMA = 27.5;
      sector = "Communication Services";
    },
    {
      symbol = "ORCL";
      companyName = "Oracle Corporation";
      price = 87.6;
      percentChange = 1.8;
      volume = 14_000_000;
      rsi = 61.2;
      macdSignal = "bullish";
      fiftyDayMA = 87.1;
      twoHundredDayMA = 86.6;
      sector = "Technology";
    },
    {
      symbol = "PEP";
      companyName = "PepsiCo Inc.";
      price = 146.2;
      percentChange = -0.2;
      volume = 13_000_000;
      rsi = 51.9;
      macdSignal = "neutral";
      fiftyDayMA = 145.7;
      twoHundredDayMA = 145.2;
      sector = "Consumer Staples";
    },
    {
      symbol = "IBM";
      companyName = "International Business Machines Corporation";
      price = 138.4;
      percentChange = 1.5;
      volume = 11_000_000;
      rsi = 58.3;
      macdSignal = "bullish";
      fiftyDayMA = 137.9;
      twoHundredDayMA = 137.4;
      sector = "Technology";
    },
    {
      symbol = "MCD";
      companyName = "McDonald's Corporation";
      price = 252.7;
      percentChange = 1.2;
      volume = 9_000_000;
      rsi = 55.6;
      macdSignal = "bullish";
      fiftyDayMA = 252.2;
      twoHundredDayMA = 251.7;
      sector = "Consumer Discretionary";
    },
    {
      symbol = "BA";
      companyName = "The Boeing Company";
      price = 222.5;
      percentChange = 2.1;
      volume = 13_000_000;
      rsi = 64.7;
      macdSignal = "bullish";
      fiftyDayMA = 222.0;
      twoHundredDayMA = 221.5;
      sector = "Industrials";
    },
    {
      symbol = "WFC";
      companyName = "Wells Fargo & Company";
      price = 46.8;
      percentChange = 1.9;
      volume = 15_000_000;
      rsi = 60.5;
      macdSignal = "bullish";
      fiftyDayMA = 46.3;
      twoHundredDayMA = 45.8;
      sector = "Financials";
    },
    {
      symbol = "SBUX";
      companyName = "Starbucks Corporation";
      price = 116.1;
      percentChange = -0.6;
      volume = 8_000_000;
      rsi = 46.6;
      macdSignal = "bearish";
      fiftyDayMA = 115.6;
      twoHundredDayMA = 115.1;
      sector = "Consumer Discretionary";
    },
    {
      symbol = "C";
      companyName = "Citigroup Inc.";
      price = 69.3;
      percentChange = -1.2;
      volume = 12_000_000;
      rsi = 44.9;
      macdSignal = "bearish";
      fiftyDayMA = 68.8;
      twoHundredDayMA = 68.3;
      sector = "Financials";
    },
    {
      symbol = "GE";
      companyName = "General Electric Company";
      price = 104.5;
      percentChange = 1.4;
      volume = 10_000_000;
      rsi = 59.2;
      macdSignal = "bullish";
      fiftyDayMA = 104.0;
      twoHundredDayMA = 103.5;
      sector = "Industrials";
    },
    {
      symbol = "VZ";
      companyName = "Verizon Communications Inc.";
      price = 56.7;
      percentChange = 0.5;
      volume = 11_000_000;
      rsi = 53.1;
      macdSignal = "bullish";
      fiftyDayMA = 56.2;
      twoHundredDayMA = 55.7;
      sector = "Communication Services";
    },
    {
      symbol = "TGT";
      companyName = "Target Corporation";
      price = 258.3;
      percentChange = 1.7;
      volume = 6_000_000;
      rsi = 61.5;
      macdSignal = "bullish";
      fiftyDayMA = 257.8;
      twoHundredDayMA = 257.3;
      sector = "Consumer Discretionary";
    },
    {
      symbol = "HON";
      companyName = "Honeywell International Inc.";
      price = 236.9;
      percentChange = -0.8;
      volume = 7_000_000;
      rsi = 47.5;
      macdSignal = "bearish";
      fiftyDayMA = 236.4;
      twoHundredDayMA = 235.9;
      sector = "Industrials";
    },
    {
      symbol = "GM";
      companyName = "General Motors Company";
      price = 55.2;
      percentChange = 2.3;
      volume = 14_000_000;
      rsi = 65.8;
      macdSignal = "bullish";
      fiftyDayMA = 54.7;
      twoHundredDayMA = 54.2;
      sector = "Automotive";
    },
    {
      symbol = "GS";
      companyName = "The Goldman Sachs Group Inc.";
      price = 414.8;
      percentChange = 1.5;
      volume = 5_000_000;
      rsi = 58.9;
      macdSignal = "bullish";
      fiftyDayMA = 414.3;
      twoHundredDayMA = 413.8;
      sector = "Financials";
    },
    {
      symbol = "MMM";
      companyName = "3M Company";
      price = 192.3;
      percentChange = -0.4;
      volume = 8_000_000;
      rsi = 50.0;
      macdSignal = "neutral";
      fiftyDayMA = 191.8;
      twoHundredDayMA = 191.3;
      sector = "Industrials";
    },
    {
      symbol = "CMCSA";
      companyName = "Comcast Corporation";
      price = 59.4;
      percentChange = 0.7;
      volume = 13_000_000;
      rsi = 55.3;
      macdSignal = "bullish";
      fiftyDayMA = 58.9;
      twoHundredDayMA = 58.4;
      sector = "Communication Services";
    },
    {
      symbol = "CAT";
      companyName = "Caterpillar Inc.";
      price = 216.7;
      percentChange = 2.0;
      volume = 9_000_000;
      rsi = 63.9;
      macdSignal = "bullish";
      fiftyDayMA = 216.2;
      twoHundredDayMA = 215.7;
      sector = "Industrials";
    },
    {
      symbol = "F";
      companyName = "Ford Motor Company";
      price = 14.2;
      percentChange = 1.6;
      volume = 22_000_000;
      rsi = 62.8;
      macdSignal = "bullish";
      fiftyDayMA = 13.7;
      twoHundredDayMA = 13.2;
      sector = "Automotive";
    },
    {
      symbol = "LMT";
      companyName = "Lockheed Martin Corporation";
      price = 359.2;
      percentChange = -1.3;
      volume = 6_000_000;
      rsi = 45.1;
      macdSignal = "bearish";
      fiftyDayMA = 358.7;
      twoHundredDayMA = 358.2;
      sector = "Industrials";
    },
    {
      symbol = "DELL";
      companyName = "Dell Technologies Inc.";
      price = 104.1;
      percentChange = 1.8;
      volume = 7_000_000;
      rsi = 61.7;
      macdSignal = "bullish";
      fiftyDayMA = 103.6;
      twoHundredDayMA = 103.1;
      sector = "Technology";
    },
    {
      symbol = "RTX";
      companyName = "Raytheon Technologies Corporation";
      price = 83.6;
      percentChange = 0.4;
      volume = 11_000_000;
      rsi = 54.9;
      macdSignal = "bullish";
      fiftyDayMA = 83.1;
      twoHundredDayMA = 82.6;
      sector = "Industrials";
    },
    {
      symbol = "BKNG";
      companyName = "Booking Holdings Inc.";
      price = 2250.3;
      percentChange = 1.1;
      volume = 3_000_000;
      rsi = 55.8;
      macdSignal = "bullish";
      fiftyDayMA = 2245.8;
      twoHundredDayMA = 2240.3;
      sector = "Consumer Discretionary";
    },
    {
      symbol = "MRNA";
      companyName = "Moderna Inc.";
      price = 195.7;
      percentChange = 2.9;
      volume = 16_000_000;
      rsi = 68.4;
      macdSignal = "bullish";
      fiftyDayMA = 195.2;
      twoHundredDayMA = 194.7;
      sector = "Healthcare";
    },
    {
      symbol = "TWTR";
      companyName = "Twitter Inc.";
      price = 66.8;
      percentChange = -1.0;
      volume = 9_000_000;
      rsi = 47.2;
      macdSignal = "bearish";
      fiftyDayMA = 66.3;
      twoHundredDayMA = 65.8;
      sector = "Communication Services";
    },
    {
      symbol = "PYPL";
      companyName = "PayPal Holdings Inc.";
      price = 189.5;
      percentChange = 1.3;
      volume = 10_000_000;
      rsi = 56.1;
      macdSignal = "bullish";
      fiftyDayMA = 189.0;
      twoHundredDayMA = 188.5;
      sector = "Technology";
    },
    {
      symbol = "CRM";
      companyName = "Salesforce.com Inc.";
      price = 246.8;
      percentChange = -0.7;
      volume = 8_000_000;
      rsi = 48.7;
      macdSignal = "bearish";
      fiftyDayMA = 246.3;
      twoHundredDayMA = 245.8;
      sector = "Technology";
    },
    {
      symbol = "RCL";
      companyName = "Royal Caribbean Group";
      price = 87.2;
      percentChange = 2.6;
      volume = 15_000_000;
      rsi = 66.2;
      macdSignal = "bullish";
      fiftyDayMA = 86.7;
      twoHundredDayMA = 86.2;
      sector = "Consumer Discretionary";
    },
    {
      symbol = "NKE";
      companyName = "NIKE Inc.";
      price = 154.3;
      percentChange = 1.5;
      volume = 12_000_000;
      rsi = 58.2;
      macdSignal = "bullish";
      fiftyDayMA = 153.8;
      twoHundredDayMA = 153.3;
      sector = "Consumer Discretionary";
    },
    {
      symbol = "QCOM";
      companyName = "QUALCOMM Incorporated";
      price = 143.2;
      percentChange = -0.2;
      volume = 11_000_000;
      rsi = 52.5;
      macdSignal = "neutral";
      fiftyDayMA = 142.7;
      twoHundredDayMA = 142.2;
      sector = "Technology";
    },
    {
      symbol = "AMD";
      companyName = "Advanced Micro Devices Inc.";
      price = 104.8;
      percentChange = 1.9;
      volume = 13_000_000;
      rsi = 60.6;
      macdSignal = "bullish";
      fiftyDayMA = 104.3;
      twoHundredDayMA = 103.8;
      sector = "Technology";
    },
    {
      symbol = "AXP";
      companyName = "American Express Company";
      price = 167.4;
      percentChange = -1.1;
      volume = 8_000_000;
      rsi = 46.0;
      macdSignal = "bearish";
      fiftyDayMA = 166.9;
      twoHundredDayMA = 166.4;
      sector = "Financials";
    },
    {
      symbol = "DOW";
      companyName = "Dow Inc.";
      price = 59.8;
      percentChange = 0.9;
      volume = 10_000_000;
      rsi = 57.4;
      macdSignal = "bullish";
      fiftyDayMA = 59.3;
      twoHundredDayMA = 58.8;
      sector = "Materials";
    },
    {
      symbol = "ABT";
      companyName = "Abbott Laboratories";
      price = 125.6;
      percentChange = 1.2;
      volume = 7_000_000;
      rsi = 53.8;
      macdSignal = "bullish";
      fiftyDayMA = 125.1;
      twoHundredDayMA = 124.6;
      sector = "Healthcare";
    },
    {
      symbol = "WBA";
      companyName = "Walgreens Boots Alliance Inc.";
      price = 54.1;
      percentChange = -0.5;
      volume = 6_000_000;
      rsi = 48.1;
      macdSignal = "bearish";
      fiftyDayMA = 53.6;
      twoHundredDayMA = 53.1;
      sector = "Healthcare";
    },
    {
      symbol = "PH";
      companyName = "Parker-Hannifin Corporation";
      price = 302.3;
      percentChange = 2.4;
      volume = 5_000_000;
      rsi = 62.6;
      macdSignal = "bullish";
      fiftyDayMA = 301.8;
      twoHundredDayMA = 301.3;
      sector = "Industrials";
    },
    {
      symbol = "GIS";
      companyName = "General Mills Inc.";
      price = 62.7;
      percentChange = 1.6;
      volume = 7_000_000;
      rsi = 59.9;
      macdSignal = "bullish";
      fiftyDayMA = 62.2;
      twoHundredDayMA = 61.7;
      sector = "Consumer Staples";
    },
  ];

  for (stock in sampleStockData.values()) {
    stocks.add(stock.symbol, stock);
  };

  let sampleMarketSummaries = [
    {
      name = "S&P 500";
      currentValue = 4450.2;
      change = 1.1;
    },
    {
      name = "NASDAQ";
      currentValue = 15000.6;
      change = -0.5;
    },
    {
      name = "DOW Jones";
      currentValue = 35000.7;
      change = 0.7;
    },
  ];

  for (summary in sampleMarketSummaries.values()) {
    marketSummaries.add(summary.name, summary);
  };

  public shared ({ caller }) func addToWatchlist(symbol : Text) : async () {
    checkStockExists(symbol);
    let currentWatchlist = switch (userWatchlists.get(caller)) {
      case (null) { Set.empty<Text>() };
      case (?watchlist) { watchlist };
    };
    currentWatchlist.add(symbol);
    userWatchlists.add(caller, currentWatchlist);
  };

  public shared ({ caller }) func removeFromWatchlist(symbol : Text) : async () {
    switch (userWatchlists.get(caller)) {
      case (null) { Runtime.trap("Watchlist is empty") };
      case (?watchlist) {
        if (not watchlist.contains(symbol)) {
          Runtime.trap("Symbol not in watchlist");
        };
        watchlist.remove(symbol);
        userWatchlists.add(caller, watchlist);
      };
    };
  };

  public query ({ caller }) func getWatchlist() : async [Text] {
    switch (userWatchlists.get(caller)) {
      case (null) { [] };
      case (?watchlist) { watchlist.toArray().sort() };
    };
  };

  public query ({ caller }) func getStock(symbol : Text) : async Stock {
    switch (stocks.get(symbol)) {
      case (null) { Runtime.trap("Stock not found") };
      case (?stock) { stock };
    };
  };

  public query ({ caller }) func getAllStocks() : async [Stock] {
    stocks.values().toArray().sort();
  };

  public query ({ caller }) func scanStocks(criteria : ScanCriteria) : async [Stock] {
    scanStocksHelper(criteria, null, null);
  };

  public query ({ caller }) func scanStocksPaginated(criteria : ScanCriteria, limit : Nat, offset : Nat) : async [Stock] {
    scanStocksHelper(criteria, ?limit, ?offset);
  };

  public query ({ caller }) func getMarketSummary() : async [MarketSummary] {
    marketSummaries.values().toArray();
  };
};
