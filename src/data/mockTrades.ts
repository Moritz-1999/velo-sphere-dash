function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
const rand = seededRandom(300);
const r = (min: number, max: number) => min + rand() * (max - min);

export interface Position {
  id: string;
  symbol: string;
  type: "FUT" | "CE" | "PE" | "EQ";
  qty: number;
  avgPrice: number;
  ltp: number;
  target: number;
  sl: number;
  entryTime: string;
}

export interface ClosedTrade {
  id: string;
  symbol: string;
  entryTime: string;
  exitTime: string;
  entryPrice: number;
  exitPrice: number;
  qty: number;
  pnl: number;
  pnlPct: number;
  duration: string;
  rr: number;
}

export function getOpenPositions(): Position[] {
  return [
    { id: "1", symbol: "NIFTY 22500 CE", type: "CE", qty: 50, avgPrice: 185, ltp: 210, target: 280, sl: 150, entryTime: "09:22:15" },
    { id: "2", symbol: "RELIANCE FUT", type: "FUT", qty: 250, avgPrice: 2465, ltp: 2492, target: 2540, sl: 2430, entryTime: "09:45:30" },
    { id: "3", symbol: "BANKNIFTY 48400 PE", type: "PE", qty: -30, avgPrice: 320, ltp: 295, target: 220, sl: 380, entryTime: "10:12:00" },
    { id: "4", symbol: "INFY FUT", type: "FUT", qty: -600, avgPrice: 1528, ltp: 1535, target: 1480, sl: 1555, entryTime: "11:05:45" },
    { id: "5", symbol: "TATAMOTORS CE 700", type: "CE", qty: 1400, avgPrice: 12.5, ltp: 15.2, target: 22, sl: 8, entryTime: "10:30:00" },
  ];
}

export function getClosedTrades(): ClosedTrade[] {
  return [
    { id: "c1", symbol: "NIFTY 22400 CE", entryTime: "09:16:30", exitTime: "09:48:12", entryPrice: 142, exitPrice: 178, qty: 50, pnl: 1800, pnlPct: 25.35, duration: "32m", rr: 2.1 },
    { id: "c2", symbol: "SBIN FUT", entryTime: "09:20:00", exitTime: "10:15:00", entryPrice: 622, exitPrice: 615, qty: 1500, pnl: -10500, pnlPct: -1.13, duration: "55m", rr: -0.5 },
    { id: "c3", symbol: "HDFCBANK 1680 PE", entryTime: "10:30:00", exitTime: "11:45:00", entryPrice: 28, exitPrice: 42, qty: 550, pnl: 7700, pnlPct: 50.0, duration: "1h 15m", rr: 3.2 },
    { id: "c4", symbol: "BANKNIFTY 48500 CE", entryTime: "09:18:00", exitTime: "09:35:00", entryPrice: 210, exitPrice: 195, qty: -30, pnl: 450, pnlPct: 7.14, duration: "17m", rr: 1.4 },
    { id: "c5", symbol: "TATASTEEL FUT", entryTime: "11:00:00", exitTime: "12:30:00", entryPrice: 141.5, exitPrice: 143.8, qty: 6500, pnl: 14950, pnlPct: 1.63, duration: "1h 30m", rr: 1.8 },
  ];
}

export interface JournalDay {
  date: string;
  pnl: number;
  trades: number;
  winRate: number;
}

export function getJournalData(): JournalDay[] {
  const data: JournalDay[] = [];
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    data.push({
      date: d.toISOString().split("T")[0],
      pnl: r(-25000, 45000),
      trades: Math.round(r(3, 12)),
      winRate: r(30, 80),
    });
  }
  return data;
}
