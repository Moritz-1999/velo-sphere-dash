function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
const rand = seededRandom(400);
const r = (min: number, max: number) => min + rand() * (max - min);

export interface BreadthData {
  pctAbove20DMA: number;
  pctAbove20DMA_prev: number;
  pctAbove50DMA: number;
  pctAbove50DMA_prev: number;
  pctAbove200DMA: number;
  pctAbove200DMA_prev: number;
  advances: number;
  declines: number;
  adRatio: number;
  highs52w: number;
  lows52w: number;
  upVolPct: number;
  downVolPct: number;
  mcclellan: number;
  mcclellanTrend: "up" | "down";
  sparklines: Record<string, number[]>;
}

export function getBreadthData(): BreadthData {
  const sparkline = () => Array.from({ length: 30 }, () => r(30, 80));
  return {
    pctAbove20DMA: 72,
    pctAbove20DMA_prev: 68,
    pctAbove50DMA: 58,
    pctAbove50DMA_prev: 61,
    pctAbove200DMA: 51,
    pctAbove200DMA_prev: 54,
    advances: 847,
    declines: 653,
    adRatio: 1.30,
    highs52w: 23,
    lows52w: 8,
    upVolPct: 62,
    downVolPct: 38,
    mcclellan: 42,
    mcclellanTrend: "up",
    sparklines: {
      above20: sparkline(),
      above50: sparkline(),
      above200: sparkline(),
      ad: sparkline(),
      highs: sparkline(),
      upvol: sparkline(),
      mcclellan: sparkline(),
    },
  };
}

export interface AlertTemplate {
  id: string;
  name: string;
  description: string;
  trigger: string;
  enabled: boolean;
}

export function getAlertTemplates(): AlertTemplate[] {
  return [
    { id: "1", name: "PCR Extreme", description: "PCR crosses extreme thresholds", trigger: "PCR > 1.5 or < 0.5", enabled: true },
    { id: "2", name: "VIX Spike", description: "India VIX up significantly intraday", trigger: "VIX up >10% intraday", enabled: false },
    { id: "3", name: "Max Pain Shift", description: "Max Pain moved significantly from open", trigger: "Max Pain moved >100 pts", enabled: true },
    { id: "4", name: "Big OI Buildup", description: "Massive OI buildup at a strike", trigger: "Strike OI increases >5L in 30min", enabled: false },
    { id: "5", name: "Straddle Breakout", description: "Price exits expected move range", trigger: "Price outside ±expected move", enabled: false },
    { id: "6", name: "FII Direction Flip", description: "FII net position reversal", trigger: "FII net position changes direction", enabled: true },
    { id: "7", name: "Volume Explosion", description: "Abnormal volume surge detected", trigger: "F&O stock volume > 3x 20D avg", enabled: false },
    { id: "8", name: "Delivery Spike", description: "High conviction delivery detected", trigger: "Delivery % > 70% on Nifty 50 stock", enabled: false },
    { id: "9", name: "GEX Flip", description: "Gamma exposure sign change", trigger: "Gamma exposure flips sign", enabled: true },
    { id: "10", name: "Unusual Options", description: "Abnormal options activity", trigger: "Option volume > 5x its OI", enabled: false },
    { id: "11", name: "S/R Breach", description: "Key support/resistance broken", trigger: "Price breaks highest OI strike", enabled: true },
    { id: "12", name: "IV Crush/Spike", description: "Implied volatility extreme move", trigger: "IV changes >20% in session", enabled: false },
  ];
}

export interface AlertEvent {
  id: string;
  name: string;
  detail: string;
  time: string;
  status: "triggered" | "watching" | "expired";
  count: number;
}

export function getActiveAlerts(): AlertEvent[] {
  return [
    { id: "a1", name: "PCR Extreme", detail: "BankNifty PCR hit 0.65", time: "12 min ago", status: "triggered", count: 3 },
    { id: "a2", name: "Volume Explosion", detail: "TATASTEEL volume 4.2x avg", time: "28 min ago", status: "triggered", count: 1 },
    { id: "a3", name: "Max Pain Shift", detail: "NIFTY Max Pain: 22400→22500", time: "45 min ago", status: "triggered", count: 2 },
    { id: "a4", name: "S/R Breach", detail: "Watching NIFTY 22500 CE OI", time: "Since 9:15 AM", status: "watching", count: 0 },
    { id: "a5", name: "GEX Flip", detail: "NIFTY GEX monitoring", time: "Since 9:15 AM", status: "watching", count: 0 },
    { id: "a6", name: "FII Direction Flip", detail: "No change today", time: "Expired at 3:30 PM", status: "expired", count: 0 },
  ];
}

export interface AlertTimelineEntry {
  id: string;
  name: string;
  detail: string;
  time: string;
}

export function getAlertTimeline(): AlertTimelineEntry[] {
  return [
    { id: "t1", name: "PCR Extreme", detail: "BankNifty PCR dropped to 0.65 — overbought zone", time: "14:22" },
    { id: "t2", name: "Volume Explosion", detail: "TATASTEEL volume surged to 4.2x 20D avg — ₹842Cr traded", time: "13:45" },
    { id: "t3", name: "Max Pain Shift", detail: "NIFTY Max Pain shifted +100 pts to 22500", time: "12:30" },
    { id: "t4", name: "PCR Extreme", detail: "NIFTY PCR crossed 1.5 — reversal zone", time: "11:15" },
    { id: "t5", name: "S/R Breach", detail: "NIFTY breached 22400 CE highest OI strike", time: "10:48" },
    { id: "t6", name: "GEX Flip", detail: "NIFTY Gamma Exposure flipped negative", time: "10:12" },
    { id: "t7", name: "PCR Extreme", detail: "BankNifty PCR hit 1.52", time: "09:45" },
    { id: "t8", name: "Big OI Buildup", detail: "NIFTY 22500 CE OI surged +5.2L in 25min", time: "09:30" },
  ];
}
