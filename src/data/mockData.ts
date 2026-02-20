// Mock data for the crypto dashboard

export interface CoinData {
  symbol: string;
  name: string;
  price: number;
  change1h: number;
  change4h: number;
  change24h: number;
  change7d: number;
  change30d: number;
  high7d: number;
  low7d: number;
  volume24h: number;
  volDelta: number;
  openInterest: number;
  oiChange: number;
  funding: number;
  predictedFunding: number;
  starred: boolean;
}

export interface ExchangeBreakdown {
  binance: number;
  bybit: number;
  okx: number;
  deribit: number;
  others: number;
}

export interface TimeSeriesPoint {
  time: string;
  value: number;
  binance?: number;
  bybit?: number;
  okx?: number;
  deribit?: number;
  others?: number;
}

export interface LiquidationPoint {
  time: string;
  longLiq: number;
  shortLiq: number;
}

export interface HourlyReturn {
  hour: number;
  avgReturn: number;
}

export interface DailyReturn {
  day: string;
  avgReturn: number;
}

const coinConfigs = [
  { symbol: "BTC", name: "Bitcoin", basePrice: 96500 },
  { symbol: "ETH", name: "Ethereum", basePrice: 3420 },
  { symbol: "SOL", name: "Solana", basePrice: 178 },
  { symbol: "BNB", name: "BNB", basePrice: 620 },
  { symbol: "XRP", name: "XRP", basePrice: 2.18 },
  { symbol: "DOGE", name: "Dogecoin", basePrice: 0.325 },
  { symbol: "ADA", name: "Cardano", basePrice: 0.98 },
  { symbol: "AVAX", name: "Avalanche", basePrice: 35.2 },
  { symbol: "LINK", name: "Chainlink", basePrice: 22.5 },
  { symbol: "DOT", name: "Polkadot", basePrice: 7.8 },
  { symbol: "MATIC", name: "Polygon", basePrice: 0.52 },
  { symbol: "UNI", name: "Uniswap", basePrice: 12.3 },
  { symbol: "ARB", name: "Arbitrum", basePrice: 1.12 },
  { symbol: "OP", name: "Optimism", basePrice: 2.45 },
  { symbol: "ATOM", name: "Cosmos", basePrice: 9.8 },
  { symbol: "FIL", name: "Filecoin", basePrice: 5.6 },
  { symbol: "LTC", name: "Litecoin", basePrice: 108 },
  { symbol: "NEAR", name: "NEAR Protocol", basePrice: 5.2 },
  { symbol: "APT", name: "Aptos", basePrice: 9.1 },
  { symbol: "SUI", name: "Sui", basePrice: 3.85 },
  { symbol: "INJ", name: "Injective", basePrice: 24.5 },
  { symbol: "TIA", name: "Celestia", basePrice: 11.2 },
  { symbol: "SEI", name: "Sei", basePrice: 0.48 },
  { symbol: "STX", name: "Stacks", basePrice: 2.1 },
  { symbol: "IMX", name: "Immutable X", basePrice: 1.85 },
  { symbol: "RUNE", name: "THORChain", basePrice: 5.4 },
  { symbol: "FTM", name: "Fantom", basePrice: 0.72 },
  { symbol: "AAVE", name: "Aave", basePrice: 285 },
  { symbol: "MKR", name: "Maker", basePrice: 1520 },
  { symbol: "CRV", name: "Curve", basePrice: 0.65 },
  { symbol: "ALGO", name: "Algorand", basePrice: 0.28 },
  { symbol: "SAND", name: "Sandbox", basePrice: 0.42 },
  { symbol: "MANA", name: "Decentraland", basePrice: 0.38 },
  { symbol: "AXS", name: "Axie Infinity", basePrice: 7.2 },
  { symbol: "GALA", name: "Gala", basePrice: 0.035 },
  { symbol: "ENS", name: "ENS", basePrice: 28.5 },
  { symbol: "LDO", name: "Lido", basePrice: 2.1 },
  { symbol: "RPL", name: "Rocket Pool", basePrice: 24.8 },
  { symbol: "SNX", name: "Synthetix", basePrice: 3.2 },
  { symbol: "COMP", name: "Compound", basePrice: 58 },
  { symbol: "SUSHI", name: "SushiSwap", basePrice: 1.15 },
  { symbol: "1INCH", name: "1inch", basePrice: 0.42 },
  { symbol: "DYDX", name: "dYdX", basePrice: 1.65 },
  { symbol: "GMX", name: "GMX", basePrice: 32.5 },
  { symbol: "PEPE", name: "Pepe", basePrice: 0.0000132 },
  { symbol: "WIF", name: "dogwifhat", basePrice: 2.15 },
  { symbol: "BONK", name: "Bonk", basePrice: 0.0000245 },
  { symbol: "JUP", name: "Jupiter", basePrice: 0.92 },
  { symbol: "W", name: "Wormhole", basePrice: 0.58 },
  { symbol: "STRK", name: "Starknet", basePrice: 0.72 },
  { symbol: "PYTH", name: "Pyth Network", basePrice: 0.38 },
  { symbol: "JTO", name: "Jito", basePrice: 3.25 },
  { symbol: "ORDI", name: "ORDI", basePrice: 42 },
  { symbol: "WLD", name: "Worldcoin", basePrice: 2.85 },
  { symbol: "BLUR", name: "Blur", basePrice: 0.28 },
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = seededRandom(42);

function randomInRange(min: number, max: number): number {
  return min + rand() * (max - min);
}

function randomChange(): number {
  return (rand() - 0.5) * 10; // -5% to +5%
}

export function generateCoins(): CoinData[] {
  return coinConfigs.map((config) => {
    const change24h = randomChange();
    const price = config.basePrice * (1 + change24h / 100);
    const volumeMultiplier = config.basePrice > 1000 ? 1e9 : config.basePrice > 10 ? 1e8 : 1e7;
    
    return {
      symbol: config.symbol,
      name: config.name,
      price,
      change1h: randomInRange(-2, 2),
      change4h: randomInRange(-4, 4),
      change24h,
      change7d: randomInRange(-15, 15),
      change30d: randomInRange(-30, 30),
      high7d: price * (1 + randomInRange(0.02, 0.08)),
      low7d: price * (1 - randomInRange(0.02, 0.08)),
      volume24h: randomInRange(0.5, 5) * volumeMultiplier,
      volDelta: randomInRange(-0.3, 0.3) * volumeMultiplier,
      openInterest: randomInRange(0.2, 2) * volumeMultiplier,
      oiChange: randomInRange(-5, 5),
      funding: randomInRange(-0.01, 0.05),
      predictedFunding: randomInRange(-0.01, 0.05),
      starred: rand() > 0.85,
    };
  });
}

export function generateTimeSeries(points: number = 168, baseValue: number = 100): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = [];
  let value = baseValue;
  const now = Date.now();
  
  for (let i = points; i >= 0; i--) {
    value *= 1 + (rand() - 0.48) * 0.02;
    const total = value;
    const binance = total * randomInRange(0.35, 0.45);
    const bybit = total * randomInRange(0.2, 0.3);
    const okx = total * randomInRange(0.15, 0.25);
    const deribit = total * randomInRange(0.05, 0.15);
    const others = total - binance - bybit - okx - deribit;
    
    data.push({
      time: new Date(now - i * 3600000).toISOString(),
      value: total,
      binance,
      bybit,
      okx,
      deribit,
      others: Math.max(0, others),
    });
  }
  return data;
}

export function generateFundingSeries(points: number = 168): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = [];
  const now = Date.now();
  
  for (let i = points; i >= 0; i--) {
    data.push({
      time: new Date(now - i * 3600000).toISOString(),
      value: randomInRange(-0.02, 0.06),
      binance: randomInRange(-0.02, 0.06),
      bybit: randomInRange(-0.02, 0.06),
      okx: randomInRange(-0.02, 0.06),
      deribit: randomInRange(-0.01, 0.04),
    });
  }
  return data;
}

export function generateLiquidations(points: number = 168): LiquidationPoint[] {
  const data: LiquidationPoint[] = [];
  const now = Date.now();
  
  for (let i = points; i >= 0; i--) {
    data.push({
      time: new Date(now - i * 3600000).toISOString(),
      longLiq: randomInRange(0, 50) * 1e6,
      shortLiq: -randomInRange(0, 50) * 1e6,
    });
  }
  return data;
}

export function generateHourlyReturns(): HourlyReturn[] {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    avgReturn: randomInRange(-0.3, 0.3),
  }));
}

export function generateDailyReturns(): DailyReturn[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day) => ({
    day,
    avgReturn: randomInRange(-0.4, 0.4),
  }));
}

export function generateExchangeBreakdown(total: number): ExchangeBreakdown {
  const binance = total * randomInRange(0.35, 0.45);
  const bybit = total * randomInRange(0.2, 0.28);
  const okx = total * randomInRange(0.15, 0.22);
  const deribit = total * randomInRange(0.05, 0.12);
  const others = total - binance - bybit - okx - deribit;
  return { binance, bybit, okx, deribit, others: Math.max(0, others) };
}

// Cached data
let _coins: CoinData[] | null = null;
export function getCoins(): CoinData[] {
  if (!_coins) _coins = generateCoins();
  return _coins;
}

// Format utilities
export function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(2);
  if (price >= 0.01) return price.toFixed(4);
  return price.toFixed(8);
}

export function formatCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1e12) return (value / 1e12).toFixed(1) + "T";
  if (abs >= 1e9) return (value / 1e9).toFixed(1) + "B";
  if (abs >= 1e6) return (value / 1e6).toFixed(1) + "M";
  if (abs >= 1e3) return (value / 1e3).toFixed(1) + "K";
  return value.toFixed(2);
}

export function formatPercent(value: number): string {
  return (value >= 0 ? "+" : "") + value.toFixed(2) + "%";
}

export const EXCHANGE_COLORS = {
  binance: "hsl(45, 93%, 47%)",
  bybit: "hsl(270, 60%, 55%)",
  okx: "hsl(200, 80%, 50%)",
  deribit: "hsl(30, 90%, 55%)",
  others: "hsl(240, 12%, 50%)",
};

export const EXCHANGES = ["binance", "bybit", "okx", "deribit", "others"] as const;
