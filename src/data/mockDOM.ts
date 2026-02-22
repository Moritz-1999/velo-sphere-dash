import { getStocks } from "./mockStocks";

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
const rand = seededRandom(456);
const r = (min: number, max: number) => min + rand() * (max - min);

export interface DOMData {
  symbol: string;
  bidQtyTotal: number;
  askQtyTotal: number;
  imbalancePct: number;
  spreadTicks: number;
  top5BidPct: number;
  largeOrders: number;
  sentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
}

export function generateDOMData(): DOMData[] {
  const stocks = getStocks().filter(s => s.sector !== "Index").slice(0, 35);
  return stocks.map(s => {
    const bidQty = r(5000, 80000);
    const askQty = r(5000, 80000);
    const imb = ((bidQty - askQty) / (bidQty + askQty)) * 100;
    return {
      symbol: s.symbol,
      bidQtyTotal: bidQty,
      askQtyTotal: askQty,
      imbalancePct: imb,
      spreadTicks: Math.round(r(1, 8)),
      top5BidPct: r(15, 65),
      largeOrders: Math.round(r(0, 25)),
      sentiment: imb > 15 ? "BULLISH" : imb < -15 ? "BEARISH" : "NEUTRAL",
    };
  });
}

let _dom: DOMData[] | null = null;
export function getDOMData(): DOMData[] {
  if (!_dom) _dom = generateDOMData();
  return _dom;
}
