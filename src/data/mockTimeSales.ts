function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
const rand = seededRandom(777);
const r = (min: number, max: number) => min + rand() * (max - min);

export interface TradePrint {
  time: string;
  price: number;
  qty: number;
  side: "buy" | "sell";
}

export function generateTimeSales(basePrice: number, count = 200): TradePrint[] {
  const prints: TradePrint[] = [];
  let price = basePrice;
  const now = new Date();

  for (let i = 0; i < count; i++) {
    price += (rand() - 0.48) * basePrice * 0.0005;
    const qty = rand() > 0.9 ? Math.round(r(100, 500)) : Math.round(r(5, 80));
    const side = rand() > 0.48 ? "buy" : "sell" as const;
    const t = new Date(now.getTime() - i * r(800, 5000));
    prints.push({
      time: t.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      price: Math.round(price * 100) / 100,
      qty,
      side,
    });
  }
  return prints;
}
