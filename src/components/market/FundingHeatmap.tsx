import { useMemo } from "react";
import { getCoins, formatPercent } from "@/data/mockData";

function getFundingClass(value: number): string {
  if (value > 0.04) return "heatmap-strong-positive";
  if (value > 0.02) return "heatmap-positive";
  if (value > 0.005) return "heatmap-weak-positive";
  if (value > -0.005) return "heatmap-neutral";
  if (value > -0.02) return "heatmap-weak-negative";
  if (value > -0.04) return "heatmap-negative";
  return "heatmap-strong-negative";
}

export function FundingHeatmap() {
  const coins = useMemo(() => getCoins(), []);

  // Generate fake multi-period funding
  const fundingData = useMemo(() => {
    return coins.map((coin) => ({
      symbol: coin.symbol,
      current: coin.funding,
      avg8h: coin.funding * 0.9 + (Math.random() - 0.5) * 0.01,
      avg24h: coin.funding * 0.85 + (Math.random() - 0.5) * 0.015,
      avg7d: coin.funding * 0.7 + (Math.random() - 0.5) * 0.02,
      avg30d: coin.funding * 0.6 + (Math.random() - 0.5) * 0.02,
    }));
  }, [coins]);

  const sorted = useMemo(() => [...fundingData].sort((a, b) => b.current - a.current), [fundingData]);
  const periods = ["Current", "Avg 8h", "Avg 24h", "Avg 7d", "Avg 30d"];
  
  return (
    <div className="bg-card rounded border border-border">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="text-xs font-semibold">Funding Rates</h3>
        <span className="text-xxs text-muted-foreground">OI-Weighted Average</span>
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
              const values = [row.current, row.avg8h, row.avg24h, row.avg7d, row.avg30d];
              return (
                <tr key={row.symbol} className="hover:bg-surface-hover transition-colors">
                  <td className="px-2 py-1 font-medium font-mono">{row.symbol}</td>
                  {values.map((val, i) => (
                    <td key={i} className={`px-2 py-1 font-mono text-right ${getFundingClass(val)}`}>
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
