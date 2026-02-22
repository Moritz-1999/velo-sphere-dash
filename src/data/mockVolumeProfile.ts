import { getStocks } from "./mockStocks";

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
const rand = seededRandom(123);
const r = (min: number, max: number) => min + rand() * (max - min);

export interface VolumeProfileData {
  symbol: string;
  poc: number;
  vah: number;
  val: number;
  ltp: number;
  ltpVsPocPct: number;
  position: "Above VA" | "Inside VA" | "Below VA";
  cumulativeDelta: number;
  bigTradeCount: number;
}

export function generateVolumeProfiles(): VolumeProfileData[] {
  const stocks = getStocks().filter(s => s.sector !== "Index");
  return stocks.map(s => {
    const range = s.ltp * 0.02;
    const poc = s.ltp + r(-range, range);
    const vah = poc + r(range * 0.3, range * 1.2);
    const val = poc - r(range * 0.3, range * 1.2);
    const ltpVsPocPct = ((s.ltp - poc) / poc) * 100;
    let position: VolumeProfileData["position"] = "Inside VA";
    if (s.ltp > vah) position = "Above VA";
    else if (s.ltp < val) position = "Below VA";
    return {
      symbol: s.symbol,
      poc, vah, val,
      ltp: s.ltp,
      ltpVsPocPct,
      position,
      cumulativeDelta: r(-50, 50) * 1e5,
      bigTradeCount: Math.round(r(0, 45)),
    };
  });
}

let _vp: VolumeProfileData[] | null = null;
export function getVolumeProfiles(): VolumeProfileData[] {
  if (!_vp) _vp = generateVolumeProfiles();
  return _vp;
}
