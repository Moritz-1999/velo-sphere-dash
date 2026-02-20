import { useMemo, useState } from "react";
import { getCoins, formatPercent } from "@/data/mockData";
import { TimeRangeSelector } from "@/components/shared/TimeRangeSelector";

type SortKey = "symbol" | "1h" | "4h" | "24h" | "7d" | "30d";

function getHeatmapClass(value: number): string {
  if (value > 5) return "heatmap-strong-positive";
  if (value > 2) return "heatmap-positive";
  if (value > 0.5) return "heatmap-weak-positive";
  if (value > -0.5) return "heatmap-neutral";
  if (value > -2) return "heatmap-weak-negative";
  if (value > -5) return "heatmap-negative";
  return "heatmap-strong-negative";
}

export function PriceChangesHeatmap() {
  const coins = useMemo(() => getCoins(), []);
  const [sortKey, setSortKey] = useState<SortKey>("24h");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sortedCoins = useMemo(() => {
    return [...coins].sort((a, b) => {
      if (sortKey === "symbol") return sortDir === "asc" ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol);
      const keyMap: Record<string, keyof typeof a> = { "1h": "change1h", "4h": "change4h", "24h": "change24h", "7d": "change7d", "30d": "change30d" };
      const k = keyMap[sortKey];
      return sortDir === "asc" ? (a[k] as number) - (b[k] as number) : (b[k] as number) - (a[k] as number);
    });
  }, [coins, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const columns: { key: SortKey; label: string }[] = [
    { key: "symbol", label: "Coin" },
    { key: "1h", label: "1h" },
    { key: "4h", label: "4h" },
    { key: "24h", label: "24h" },
    { key: "7d", label: "7d" },
    { key: "30d", label: "30d" },
  ];

  return (
    <div className="bg-card rounded border border-border">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="text-xs font-semibold">Price Changes</h3>
      </div>
      <div className="overflow-auto scrollbar-thin max-h-[500px]">
        <table className="w-full text-xxs">
          <thead className="sticky top-0 bg-card z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-2 py-1.5 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none whitespace-nowrap"
                >
                  {col.label}
                  {sortKey === col.key && <span className="ml-0.5">{sortDir === "asc" ? "↑" : "↓"}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedCoins.map((coin) => (
              <tr key={coin.symbol} className="hover:bg-surface-hover transition-colors">
                <td className="px-2 py-1 font-medium font-mono">{coin.symbol}</td>
                {[coin.change1h, coin.change4h, coin.change24h, coin.change7d, coin.change30d].map((val, i) => (
                  <td key={i} className={`px-2 py-1 font-mono text-right ${getHeatmapClass(val)}`}>
                    <span className={val >= 0 ? "text-positive" : "text-negative"}>
                      {formatPercent(val)}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
