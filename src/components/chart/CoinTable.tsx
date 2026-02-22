import { useMemo, useState } from "react";
import { Star, Search } from "lucide-react";
import { getStocks, StockData } from "@/data/mockStocks";
import { formatINR, formatPercent, formatQty } from "@/lib/formatters";
import { getDirectionalBg, getIntensityBg, getPCRBg, getDeliveryBg } from "@/lib/heatmapColors";

type SortKey = keyof StockData;

const watchlists = ["All", "Nifty50", "BankNifty", "F&O Stocks"];

interface CoinTableProps {
  selectedCoin: string;
  onSelectCoin: (symbol: string) => void;
}

export function CoinTable({ selectedCoin, onSelectCoin }: CoinTableProps) {
  const stocks = useMemo(() => getStocks(), []);
  const [search, setSearch] = useState("");
  const [watchlist, setWatchlist] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("volume");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    let result = stocks;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => s.symbol.toLowerCase().includes(q));
    }
    if (watchlist === "BankNifty") result = result.filter(s => s.sector === "Banking" || s.sector === "PSU Bank" || s.sector === "Financial");
    return [...result].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return 0;
    });
  }, [stocks, search, watchlist, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortHeader = ({ k, label, className = "" }: { k: SortKey; label: string; className?: string }) => (
    <th className={`px-1 py-1.5 font-medium cursor-pointer hover:text-foreground select-none ${className}`} onClick={() => handleSort(k)}>
      {label}{sortKey === k ? (sortDir === "desc" ? " ↓" : " ↑") : ""}
    </th>
  );

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-2 border-b border-border space-y-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search stocks..."
            className="w-full bg-secondary text-xs pl-7 pr-2 py-1.5 rounded border-none outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary" />
        </div>
        <div className="flex items-center gap-0.5">
          {watchlists.map(w => (
            <button key={w} onClick={() => setWatchlist(w)}
              className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${watchlist === w ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {w}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto scrollbar-thin">
        <table className="w-full text-[11px]">
          <thead className="sticky top-0 bg-card z-10">
            <tr className="text-muted-foreground text-right">
              <th className="w-5 px-0.5 py-1.5"></th>
              <th className="px-1 py-1.5 text-left font-medium">Symbol</th>
              <SortHeader k="ltp" label="LTP" className="text-right" />
              <SortHeader k="changePct" label="Chg%" className="text-right" />
              <SortHeader k="volume" label="Vol" className="text-right" />
              <SortHeader k="oi" label="OI" className="text-right" />
              <SortHeader k="oiChangePct" label="OIΔ%" className="text-right" />
              <SortHeader k="iv" label="IV" className="text-right" />
              <SortHeader k="pcr" label="PCR" className="text-right" />
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.symbol} onClick={() => onSelectCoin(s.symbol)}
                className={`cursor-pointer transition-colors ${selectedCoin === s.symbol ? "bg-primary/10" : "hover:bg-surface-hover"}`}>
                <td className="px-0.5 py-0.5">
                  <Star className={`h-2.5 w-2.5 ${s.starred ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"}`} />
                </td>
                <td className="px-1 py-0.5 font-medium">
                  <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: s.sectorColor }} />
                  <span className="font-mono">{s.symbol}</span>
                </td>
                <td className="px-1 py-0.5 text-right font-mono">₹{formatINR(s.ltp).replace("₹", "")}</td>
                <td className="px-1 py-0.5 text-right font-mono" style={{ background: getDirectionalBg(s.changePct), color: s.changePct >= 0 ? "hsl(var(--positive))" : "hsl(var(--negative))" }}>
                  {formatPercent(s.changePct)}
                </td>
                <td className="px-1 py-0.5 text-right font-mono text-muted-foreground">{formatQty(s.volume)}</td>
                <td className="px-1 py-0.5 text-right font-mono text-muted-foreground">{s.oi > 0 ? formatQty(s.oi) : "—"}</td>
                <td className="px-1 py-0.5 text-right font-mono" style={{ background: getDirectionalBg(s.oiChangePct), color: s.oiChangePct >= 0 ? "hsl(var(--positive))" : "hsl(var(--negative))" }}>
                  {formatPercent(s.oiChangePct)}
                </td>
                <td className="px-1 py-0.5 text-right font-mono" style={{ background: getIntensityBg(s.iv, 40) }}>
                  {s.iv.toFixed(1)}
                </td>
                <td className="px-1 py-0.5 text-right font-mono" style={{ background: getPCRBg(s.pcr) }}>
                  {s.pcr.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
