function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
const rand = seededRandom(789);
const r = (min: number, max: number) => min + rand() * (max - min);

const symbols = [
  "RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "SBIN", "TATAMOTORS",
  "TATASTEEL", "BAJFINANCE", "AXISBANK", "LT", "MARUTI", "SUNPHARMA",
  "HCLTECH", "ADANIENT", "BHARTIARTL", "ITC", "KOTAKBANK", "WIPRO", "HINDALCO",
];
const prices: Record<string, number> = {
  RELIANCE: 2480, TCS: 3850, INFY: 1520, HDFCBANK: 1680, ICICIBANK: 1120,
  SBIN: 625, TATAMOTORS: 680, TATASTEEL: 142, BAJFINANCE: 6950, AXISBANK: 1080,
  LT: 3420, MARUTI: 11200, SUNPHARMA: 1520, HCLTECH: 1380, ADANIENT: 2850,
  BHARTIARTL: 1280, ITC: 438, KOTAKBANK: 1780, WIPRO: 465, HINDALCO: 520,
};

export interface BigTrade {
  id: string;
  time: string;
  symbol: string;
  price: number;
  qty: number;
  value: number;
  side: "BUY" | "SELL";
  deltaFromVwap: number;
}

export function generateBigTrades(count = 30): BigTrade[] {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const sym = symbols[Math.floor(rand() * symbols.length)];
    const base = prices[sym] || 1000;
    const price = base * (1 + r(-0.02, 0.02));
    const qty = Math.round(r(100, 5000));
    const value = price * qty;
    const mins = Math.round(r(0, 360));
    const t = new Date(now.getTime() - mins * 60000);
    return {
      id: `BT${i}`,
      time: t.toTimeString().slice(0, 8),
      symbol: sym,
      price,
      qty,
      value,
      side: rand() > 0.5 ? "BUY" as const : "SELL" as const,
      deltaFromVwap: r(-1.5, 1.5),
    };
  }).sort((a, b) => b.time.localeCompare(a.time)); // newest first but this is approximate
}

let _trades: BigTrade[] | null = null;
export function getBigTrades(): BigTrade[] {
  if (!_trades) _trades = generateBigTrades();
  return _trades;
}
