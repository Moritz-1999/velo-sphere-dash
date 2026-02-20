import { useMemo } from "react";
import { getCoins, formatPercent } from "@/data/mockData";

function getOIClass(value: number): string {
  if (value > 5) return "heatmap-strong-positive";
  if (value > 2) return "heatmap-positive";
  if (value > 0.5) return "heatmap-weak-positive";
  if (value > -0.5) return "heatmap-neutral";
  if (value > -2) return "heatmap-weak-negative";
  if (value > -5) return "heatmap-negative";
  return "heatmap-strong-negative";
}

export function OIChangesHeatmap() {
  const coins = useMemo(() => getCoins(), []);

  const oiData = useMemo(() => {
    return coins.map((coin) => ({
      symbol: coin.symbol,
      oi1h: (Math.random() - 0.5) * 4,
      oi4h: (Math.random() - 0.5) * 8,
      oi24h: coin.oiChange,
      oi7d: (Math.random() - 0.5) * 20,
      oi30d: (Math.random() - 0.5) * 40,
    }));
  }, [coins]);

  const sorted = useMemo(() => [...oiData].sort((a, b) => b.oi24h - a.oi24h), [oiData]);
  const periods = ["1h", "4h", "24h", "7d", "30d"];

  return (
    <div className="bg-card rounded border border-border">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="text-xs font-semibold">Open Interest Changes</h3>
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
              const values = [row.oi1h, row.oi4h, row.oi24h, row.oi7d, row.oi30d];
              return (
                <tr key={row.symbol} className="hover:bg-surface-hover transition-colors">
                  <td className="px-2 py-1 font-medium font-mono">{row.symbol}</td>
                  {values.map((val, i) => (
                    <td key={i} className={`px-2 py-1 font-mono text-right ${getOIClass(val)}`}>
                      <span className={val >= 0 ? "text-positive" : "text-negative"}>
                        {formatPercent(val)}
                      </span>
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
