import { useMemo, useState } from "react";
import { Star, Search } from "lucide-react";
import { getCoins, formatPrice, formatPercent, formatCompact, CoinData } from "@/data/mockData";

type SortKey = keyof CoinData;
type ChangeKey = "change1h" | "change4h" | "change24h" | "change7d";

const changeOptions: { label: string; key: ChangeKey }[] = [
  { label: "1h", key: "change1h" },
  { label: "4h", key: "change4h" },
  { label: "24h", key: "change24h" },
  { label: "7d", key: "change7d" },
];

interface CoinTableProps {
  selectedCoin: string;
  onSelectCoin: (symbol: string) => void;
}

export function CoinTable({ selectedCoin, onSelectCoin }: CoinTableProps) {
  const coins = useMemo(() => getCoins(), []);
  const [search, setSearch] = useState("");
  const [changeKey, setChangeKey] = useState<ChangeKey>("change24h");
  const [sortKey, setSortKey] = useState<SortKey>("volume24h");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    let result = coins;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
    }
    return [...result].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [coins, search, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Search + change toggle */}
      <div className="p-2 border-b border-border space-y-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coins..."
            className="w-full bg-secondary text-xs pl-7 pr-2 py-1.5 rounded border-none outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-0.5">
          {changeOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setChangeKey(opt.key)}
              className={`px-2 py-0.5 text-xxs font-medium rounded transition-colors ${
                changeKey === opt.key ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        <table className="w-full text-xxs">
          <thead className="sticky top-0 bg-card z-10">
            <tr className="text-muted-foreground">
              <th className="w-6 px-1 py-1.5"></th>
              <th className="px-1 py-1.5 text-left font-medium">Coin</th>
              <th className="px-1 py-1.5 text-right font-medium cursor-pointer hover:text-foreground" onClick={() => handleSort("price")}>Price</th>
              <th className="px-1 py-1.5 text-right font-medium cursor-pointer hover:text-foreground" onClick={() => handleSort(changeKey)}>Chg</th>
              <th className="px-1 py-1.5 text-right font-medium cursor-pointer hover:text-foreground" onClick={() => handleSort("volume24h")}>Vol</th>
              <th className="px-1 py-1.5 text-right font-medium cursor-pointer hover:text-foreground" onClick={() => handleSort("openInterest")}>OI</th>
              <th className="px-1 py-1.5 text-right font-medium cursor-pointer hover:text-foreground" onClick={() => handleSort("funding")}>Fund</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((coin) => {
              const change = coin[changeKey] as number;
              return (
                <tr
                  key={coin.symbol}
                  onClick={() => onSelectCoin(coin.symbol)}
                  className={`cursor-pointer transition-colors ${
                    selectedCoin === coin.symbol ? "bg-primary/10" : "hover:bg-surface-hover"
                  }`}
                >
                  <td className="px-1 py-0.5">
                    <Star className={`h-2.5 w-2.5 ${coin.starred ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"}`} />
                  </td>
                  <td className="px-1 py-0.5 font-medium font-mono">{coin.symbol}</td>
                  <td className="px-1 py-0.5 text-right font-mono">${formatPrice(coin.price)}</td>
                  <td className={`px-1 py-0.5 text-right font-mono ${change >= 0 ? "text-positive" : "text-negative"}`}>
                    {formatPercent(change)}
                  </td>
                  <td className="px-1 py-0.5 text-right font-mono text-muted-foreground">${formatCompact(coin.volume24h)}</td>
                  <td className="px-1 py-0.5 text-right font-mono text-muted-foreground">${formatCompact(coin.openInterest)}</td>
                  <td className={`px-1 py-0.5 text-right font-mono ${coin.funding >= 0 ? "text-positive" : "text-negative"}`}>
                    {coin.funding.toFixed(4)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
