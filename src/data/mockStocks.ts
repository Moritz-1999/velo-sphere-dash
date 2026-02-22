function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
const rand = seededRandom(99);
const r = (min: number, max: number) => min + rand() * (max - min);

export interface StockData {
  symbol: string;
  sector: string;
  sectorColor: string;
  ltp: number;
  change: number;
  changePct: number;
  high52w: number;
  low52w: number;
  volume: number;
  oi: number;
  oiChangePct: number;
  iv: number;
  pcr: number;
  deliveryPct: number;
  starred: boolean;
}

const SECTOR_COLORS: Record<string, string> = {
  IT: "#3b82f6", Banking: "#22c55e", Pharma: "#ec4899", Auto: "#f59e0b",
  FMCG: "#a855f7", Metal: "#6b7280", Energy: "#ef4444", Realty: "#14b8a6",
  Infra: "#f97316", "PSU Bank": "#84cc16", Financial: "#06b6d4", Telecom: "#8b5cf6",
  Cement: "#d946ef", Consumer: "#eab308",
};

const stockConfigs: { symbol: string; sector: string; basePrice: number }[] = [
  { symbol: "NIFTY", sector: "Index", basePrice: 22450 },
  { symbol: "BANKNIFTY", sector: "Index", basePrice: 48200 },
  { symbol: "FINNIFTY", sector: "Index", basePrice: 20850 },
  { symbol: "RELIANCE", sector: "Energy", basePrice: 2480 },
  { symbol: "TCS", sector: "IT", basePrice: 3850 },
  { symbol: "INFY", sector: "IT", basePrice: 1520 },
  { symbol: "HDFCBANK", sector: "Banking", basePrice: 1680 },
  { symbol: "ICICIBANK", sector: "Banking", basePrice: 1120 },
  { symbol: "SBIN", sector: "Banking", basePrice: 625 },
  { symbol: "TATAMOTORS", sector: "Auto", basePrice: 680 },
  { symbol: "TATASTEEL", sector: "Metal", basePrice: 142 },
  { symbol: "WIPRO", sector: "IT", basePrice: 465 },
  { symbol: "LT", sector: "Infra", basePrice: 3420 },
  { symbol: "HINDALCO", sector: "Metal", basePrice: 520 },
  { symbol: "MARUTI", sector: "Auto", basePrice: 11200 },
  { symbol: "BAJFINANCE", sector: "Financial", basePrice: 6950 },
  { symbol: "AXISBANK", sector: "Banking", basePrice: 1080 },
  { symbol: "KOTAKBANK", sector: "Banking", basePrice: 1780 },
  { symbol: "SUNPHARMA", sector: "Pharma", basePrice: 1520 },
  { symbol: "HCLTECH", sector: "IT", basePrice: 1380 },
  { symbol: "ADANIENT", sector: "Infra", basePrice: 2850 },
  { symbol: "BHARTIARTL", sector: "Telecom", basePrice: 1280 },
  { symbol: "ITC", sector: "FMCG", basePrice: 438 },
  { symbol: "NTPC", sector: "Energy", basePrice: 345 },
  { symbol: "ONGC", sector: "Energy", basePrice: 262 },
  { symbol: "POWERGRID", sector: "Energy", basePrice: 278 },
  { symbol: "NESTLEIND", sector: "FMCG", basePrice: 2520 },
  { symbol: "ULTRACEMCO", sector: "Cement", basePrice: 9850 },
  { symbol: "GRASIM", sector: "Cement", basePrice: 2180 },
  { symbol: "DRREDDY", sector: "Pharma", basePrice: 5620 },
  { symbol: "CIPLA", sector: "Pharma", basePrice: 1420 },
  { symbol: "TECHM", sector: "IT", basePrice: 1280 },
  { symbol: "APOLLOHOSP", sector: "Pharma", basePrice: 5980 },
  { symbol: "DIVISLAB", sector: "Pharma", basePrice: 3680 },
  { symbol: "ASIANPAINT", sector: "Consumer", basePrice: 2820 },
  { symbol: "TITAN", sector: "Consumer", basePrice: 3250 },
  { symbol: "BAJAJ-AUTO", sector: "Auto", basePrice: 8450 },
  { symbol: "M&M", sector: "Auto", basePrice: 1680 },
  { symbol: "HEROMOTOCO", sector: "Auto", basePrice: 4520 },
  { symbol: "EICHERMOT", sector: "Auto", basePrice: 4180 },
  { symbol: "BPCL", sector: "Energy", basePrice: 345 },
  { symbol: "COALINDIA", sector: "Metal", basePrice: 385 },
  { symbol: "JSWSTEEL", sector: "Metal", basePrice: 815 },
  { symbol: "TATACONSUM", sector: "FMCG", basePrice: 920 },
  { symbol: "HINDUNILVR", sector: "FMCG", basePrice: 2380 },
  { symbol: "INDUSINDBK", sector: "Banking", basePrice: 1420 },
  { symbol: "PNB", sector: "PSU Bank", basePrice: 108 },
  { symbol: "BANKBARODA", sector: "PSU Bank", basePrice: 245 },
  { symbol: "CANBK", sector: "PSU Bank", basePrice: 98 },
  { symbol: "FEDERALBNK", sector: "Banking", basePrice: 158 },
];

export function generateStocks(): StockData[] {
  return stockConfigs.map(c => {
    const changePct = r(-4, 4);
    const ltp = c.basePrice * (1 + changePct / 100);
    const sectorColor = SECTOR_COLORS[c.sector] || "#6b7280";
    return {
      symbol: c.symbol,
      sector: c.sector,
      sectorColor,
      ltp,
      change: ltp - c.basePrice,
      changePct,
      high52w: c.basePrice * r(1.15, 1.45),
      low52w: c.basePrice * r(0.55, 0.85),
      volume: r(50, 800) * 1e7,
      oi: c.sector === "Index" ? r(50, 200) * 1e5 : r(5, 80) * 1e5,
      oiChangePct: r(-8, 8),
      iv: r(12, 38),
      pcr: r(0.5, 1.8),
      deliveryPct: r(20, 75),
      starred: rand() > 0.85,
    };
  });
}

let _stocks: StockData[] | null = null;
export function getStocks(): StockData[] {
  if (!_stocks) _stocks = generateStocks();
  return _stocks;
}

export interface TimeSeriesPoint {
  time: string;
  value: number;
  indexOptions?: number;
  stockOptions?: number;
  indexFutures?: number;
  stockFutures?: number;
  cashVolume?: number;
  foVolume?: number;
}

export function generateTimeSeries(points = 200, base = 100): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = [];
  let val = base;
  const now = Date.now();
  for (let i = points; i >= 0; i--) {
    val *= 1 + (rand() - 0.48) * 0.015;
    const total = val;
    data.push({
      time: new Date(now - i * 3600000).toISOString(),
      value: total,
      indexOptions: total * r(0.3, 0.4),
      stockOptions: total * r(0.2, 0.3),
      indexFutures: total * r(0.15, 0.25),
      stockFutures: total * r(0.05, 0.15),
      cashVolume: total * r(0.35, 0.5),
      foVolume: total * r(0.5, 0.65),
    });
  }
  return data;
}
