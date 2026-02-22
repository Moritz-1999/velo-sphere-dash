import { getStocks, StockData } from "./mockStocks";

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
const rand = seededRandom(200);
const r = (min: number, max: number) => min + rand() * (max - min);

export interface BuildupEntry {
  symbol: string;
  priceDelta: number;
  oiDelta: number;
  ltp: number;
  type: "long_buildup" | "short_buildup" | "short_covering" | "long_unwinding";
}

export interface ScannerMatch {
  symbol: string;
  strike?: number;
  detail: string;
  time: string;
}

export interface OIPulseData {
  niftyPCR: number;
  niftyPCRTrend: "up" | "down";
  bnfPCR: number;
  bnfPCRTrend: "up" | "down";
  niftyMaxPain: number;
  niftySpot: number;
  bnfMaxPain: number;
  bnfSpot: number;
  vix: number;
  vixChange: number;
  vixChangePct: number;
  fiiLSRatio: number;
}

export function getOIPulse(): OIPulseData {
  return {
    niftyPCR: 1.23,
    niftyPCRTrend: "up",
    bnfPCR: 0.89,
    bnfPCRTrend: "down",
    niftyMaxPain: 22500,
    niftySpot: 22480,
    bnfMaxPain: 48000,
    bnfSpot: 48350,
    vix: 14.2,
    vixChange: 0.3,
    vixChangePct: 2.1,
    fiiLSRatio: 0.67,
  };
}

export function getBuildupData(): BuildupEntry[] {
  const stocks = getStocks().filter(s => s.sector !== "Index");
  return stocks.map(s => {
    const priceDelta = s.changePct;
    const oiDelta = s.oiChangePct;
    let type: BuildupEntry["type"];
    if (oiDelta > 0 && priceDelta > 0) type = "long_buildup";
    else if (oiDelta > 0 && priceDelta < 0) type = "short_buildup";
    else if (oiDelta < 0 && priceDelta > 0) type = "short_covering";
    else type = "long_unwinding";
    return { symbol: s.symbol, priceDelta, oiDelta, ltp: s.ltp, type };
  });
}

export function getScannerMatches(): Record<string, ScannerMatch[]> {
  const now = new Date();
  const fmt = (m: number) => {
    const d = new Date(now.getTime() - m * 60000);
    return d.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour12: false, hour: "2-digit", minute: "2-digit" });
  };
  return {
    strikeUnderAttack: [
      { symbol: "NIFTY", strike: 22500, detail: "CE OI down 12% in 1hr, spot at 22480", time: fmt(3) },
      { symbol: "BANKNIFTY", strike: 48400, detail: "PE OI down 15% in 1hr, spot at 48350", time: fmt(8) },
    ],
    wallBuilding: [
      { symbol: "NIFTY", strike: 22600, detail: "CE OI up 28% today, spot 0.5% away", time: fmt(15) },
      { symbol: "NIFTY", strike: 22300, detail: "PE OI up 22% today, spot 0.8% away", time: fmt(20) },
      { symbol: "BANKNIFTY", strike: 49000, detail: "CE OI up 35% today, heavy resistance", time: fmt(30) },
    ],
    painShift: [
      { symbol: "NIFTY", detail: "Max Pain shifted from 22400 to 22500 (+100 pts)", time: fmt(45) },
    ],
    pcrExtreme: [
      { symbol: "BANKNIFTY", detail: "PCR hit 0.65 — overbought zone", time: fmt(12) },
    ],
    fiiPivot: [
      { symbol: "FII", detail: "Net position flipped from short to long in index futures", time: fmt(90) },
    ],
    gexFlip: [
      { symbol: "NIFTY", detail: "GEX flipped negative — moves may amplify", time: fmt(55) },
    ],
  };
}
