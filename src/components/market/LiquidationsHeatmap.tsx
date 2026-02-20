import { useMemo } from "react";
import { getCoins, formatCompact } from "@/data/mockData";

function getLiqClass(value: number): string {
  if (value > 5e7) return "heatmap-strong-negative";
  if (value > 2e7) return "heatmap-negative";
  if (value > 5e6) return "heatmap-weak-negative";
  return "heatmap-neutral";
}

export function LiquidationsHeatmap() {
  const coins = useMemo(() => getCoins(), []);

  const liqData = useMemo(() => {
    return coins.map((coin) => {
      const base = coin.volume24h * 0.005;
      return {
        symbol: coin.symbol,
        liq1h: base * (0.02 + Math.random() * 0.08),
        liq4h: base * (0.08 + Math.random() * 0.15),
        liq24h: base * (0.3 + Math.random() * 0.5),
        liq7d: base * (1.5 + Math.random() * 2),
      };
    });
  }, [coins]);

  const sorted = useMemo(() => [...liqData].sort((a, b) => b.liq24h - a.liq24h), [liqData]);
  const periods = ["1h", "4h", "24h", "7d"];

  return (
    <div className="bg-card rounded border border-border">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="text-xs font-semibold">Liquidations</h3>
        <span className="text-xxs text-muted-foreground">All Exchanges</span>
      </div>
      <div className="overflow-auto scrollbar-thin max-h-[500px]">
        <table className="w-full text-xxs">
          <thead className="sticky top-0 bg-card z-10">
            <tr>
              <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">Coin</th>
              {periods.map((p) => (
                <th key={p} className="px-2 py-1.5 text-right font-medium text-muted-foreground">{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const values = [row.liq1h, row.liq4h, row.liq24h, row.liq7d];
              return (
                <tr key={row.symbol} className="hover:bg-surface-hover transition-colors">
                  <td className="px-2 py-1 font-medium font-mono">{row.symbol}</td>
                  {values.map((val, i) => (
                    <td key={i} className={`px-2 py-1 font-mono text-right ${getLiqClass(val)}`}>
                      ${formatCompact(val)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
