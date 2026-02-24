import { useMemo, useState } from "react";
import { Star, Search } from "lucide-react";
import { getStocks, StockData } from "@/data/mockStocks";
import { formatPrice, formatPercent } from "@/lib/formatters";

type SortKey = "symbol" | "ltp" | "changePct" | "oiChangePct" | "volume";
type MainTab = "watchlist" | "market";
type Segment = "fno" | "indices" | "nifty50" | "banknifty";
type SmartFilter = "all" | "hot" | "ol" | "oh" | "longBuildup" | "shortBuildup" | "volumeSpike" | "ivSurge";

const segmentOptions: { value: Segment; label: string }[] = [
  { value: "fno", label: "F&O Stocks" },
  { value: "indices", label: "Indices" },
  { value: "nifty50", label: "Nifty 50" },
  { value: "banknifty", label: "BankNifty" },
];

const smartFilters: { value: SmartFilter; label: string; emoji: string; color: string }[] = [
  { value: "all", label: "All", emoji: "", color: "" },
  { value: "hot", label: "Hot", emoji: "🔥", color: "#f97316" },
  { value: "ol", label: "O=L Momentum", emoji: "🚀", color: "#22c55e" },
  { value: "oh", label: "O=H Reversal", emoji: "🔻", color: "#ef4444" },
  { value: "longBuildup", label: "Long Buildup", emoji: "📈", color: "#22c55e" },
  { value: "shortBuildup", label: "Short Buildup", emoji: "📉", color: "#ef4444" },
  { value: "volumeSpike", label: "Volume Spike", emoji: "💥", color: "#3b82f6" },
  { value: "ivSurge", label: "IV Surge", emoji: "⚡", color: "#a855f7" },
];

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "volume", label: "Volume ↓" },
  { value: "changePct", label: "% Change ↓" },
  { value: "oiChangePct", label: "OI Change ↓" },
  { value: "symbol", label: "Alphabetical" },
];

const NIFTY50 = ["RELIANCE","TCS","INFY","HDFCBANK","ICICIBANK","SBIN","TATAMOTORS","TATASTEEL","WIPRO","LT","HINDALCO","MARUTI","BAJFINANCE","AXISBANK","KOTAKBANK","SUNPHARMA","HCLTECH","ADANIENT","BHARTIARTL","ITC","NTPC","ONGC","POWERGRID","NESTLEIND","ULTRACEMCO","GRASIM","DRREDDY","CIPLA","TECHM","APOLLOHOSP","DIVISLAB","ASIANPAINT","TITAN","BAJAJ-AUTO","M&M","HEROMOTOCO","EICHERMOT","BPCL","COALINDIA","JSWSTEEL","TATACONSUM","HINDUNILVR","INDUSINDBK","PNB","BANKBARODA","CANBK","FEDERALBNK"];
const BANKNIFTY_STOCKS = ["HDFCBANK","ICICIBANK","SBIN","AXISBANK","KOTAKBANK","INDUSINDBK","PNB","BANKBARODA","CANBK","FEDERALBNK","BAJFINANCE"];

interface CoinTableProps {
  selectedCoin: string;
  onSelectCoin: (symbol: string) => void;
}

export function CoinTable({ selectedCoin, onSelectCoin }: CoinTableProps) {
  const [allStocks, setAllStocks] = useState(() => getStocks());
  const [search, setSearch] = useState("");
  const [mainTab, setMainTab] = useState<MainTab>("watchlist");
  const [segment, setSegment] = useState<Segment>("fno");
  const [smartFilter, setSmartFilter] = useState<SmartFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("volume");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const toggleStar = (symbol: string) => {
    setAllStocks(prev =>
      prev.map(s => (s.symbol === symbol ? { ...s, starred: !s.starred } : s))
    );
  };

  const filtered = useMemo(() => {
    let result = allStocks;

    // Search across all tabs
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => s.symbol.toLowerCase().includes(q));
    } else if (mainTab === "watchlist") {
      result = result.filter(s => s.starred);
    } else {
      // Market tab: apply segment
      switch (segment) {
        case "fno": result = result.filter(s => s.category === "fno"); break;
        case "indices": result = result.filter(s => s.category === "index"); break;
        case "nifty50": result = result.filter(s => NIFTY50.includes(s.symbol)); break;
        case "banknifty": result = result.filter(s => BANKNIFTY_STOCKS.includes(s.symbol)); break;
      }

      // Apply smart filter
      switch (smartFilter) {
        case "hot":
          result = [...result].sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct)).slice(0, 20);
          break;
        case "ol":
          result = result.filter(s => s.ohlSignal === "O=L");
          break;
        case "oh":
          result = result.filter(s => s.ohlSignal === "O=H");
          break;
        case "longBuildup":
          result = result.filter(s => s.oiChangePct > 0 && s.changePct > 0);
          break;
        case "shortBuildup":
          result = result.filter(s => s.oiChangePct > 0 && s.changePct < 0);
          break;
        case "volumeSpike":
          result = result.filter(s => s.volume > 500 * 1e7); // rough threshold
          break;
        case "ivSurge":
          result = result.filter(s => s.iv > 28);
          break;
      }
    }

    // Sort
    return [...result].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return 0;
    });
  }, [allStocks, search, mainTab, segment, smartFilter, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortArrow = ({ k }: { k: SortKey }) =>
    sortKey === k ? <span className="ml-0.5 text-[9px]">{sortDir === "desc" ? "↓" : "↑"}</span> : null;

  const activeSmartDef = smartFilters.find(f => f.value === smartFilter);
  const smartCount = smartFilter !== "all" ? `(${filtered.length})` : "";

  const getBadge = (s: StockData) => {
    if (smartFilter === "all") return null;
    if (smartFilter === "hot") return <span className="text-[8px]" style={{ color: "#f97316" }}>●</span>;
    if (smartFilter === "ol" && s.ohlSignal === "O=L") return <span className="text-[8px] text-positive font-bold">O=L</span>;
    if (smartFilter === "oh" && s.ohlSignal === "O=H") return <span className="text-[8px] text-negative font-bold">O=H</span>;
    if (smartFilter === "longBuildup") return <span className="text-[8px] text-positive font-bold">LB</span>;
    if (smartFilter === "shortBuildup") return <span className="text-[8px] text-negative font-bold">SB</span>;
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Search */}
      <div className="p-2 border-b border-border space-y-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search stocks..."
            className="w-full bg-secondary text-xs pl-7 pr-2 py-1.5 rounded border-none outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
          />
        </div>
        {/* Main tabs */}
        <div className="flex items-center gap-1">
          {([
            { key: "watchlist" as MainTab, label: "📌 Watchlist" },
            { key: "market" as MainTab, label: "🌐 Market" },
          ]).map(t => (
            <button
              key={t.key}
              onClick={() => setMainTab(t.key)}
              className={`flex-1 px-2 py-1 text-[10px] font-medium rounded transition-colors ${
                mainTab === t.key
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground bg-secondary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* Filter row (Market tab only) */}
        {mainTab === "market" && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <select
              value={segment}
              onChange={e => setSegment(e.target.value as Segment)}
              className="bg-secondary text-[10px] px-1.5 py-1 rounded border-none outline-none text-foreground"
            >
              {segmentOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <select
              value={sortKey}
              onChange={e => { setSortKey(e.target.value as SortKey); setSortDir("desc"); }}
              className="bg-secondary text-[10px] px-1.5 py-1 rounded border-none outline-none text-foreground"
            >
              {sortOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <select
              value={smartFilter}
              onChange={e => setSmartFilter(e.target.value as SmartFilter)}
              className="bg-secondary text-[10px] px-1.5 py-1 rounded border-none outline-none text-foreground"
              style={smartFilter !== "all" ? { borderLeft: `2px solid ${activeSmartDef?.color}` } : undefined}
            >
              {smartFilters.map(f => (
                <option key={f.value} value={f.value}>
                  {f.emoji} {f.label} {f.value === smartFilter && smartCount ? smartCount : ""}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        {mainTab === "watchlist" && filtered.length === 0 && !search ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-xs gap-2">
            <Star className="h-5 w-5 opacity-30" />
            <span>Star stocks from the Market tab to build your watchlist</span>
          </div>
        ) : (
          <table className="w-full text-[11px]">
            <thead className="sticky top-0 bg-card z-10">
              <tr className="text-muted-foreground border-b border-border">
                <th className="w-5 px-0.5 py-1.5" />
                <th className="px-1 py-1.5 text-left font-medium cursor-pointer hover:text-foreground select-none" onClick={() => handleSort("symbol")}>
                  Symbol<SortArrow k="symbol" />
                </th>
                <th className="w-[70px] px-1 py-1.5 text-right font-medium cursor-pointer hover:text-foreground select-none" onClick={() => handleSort("ltp")}>
                  LTP<SortArrow k="ltp" />
                </th>
                <th className="w-[55px] px-1 py-1.5 text-right font-medium cursor-pointer hover:text-foreground select-none" onClick={() => handleSort("changePct")}>
                  Chg%<SortArrow k="changePct" />
                </th>
                <th className="w-[55px] px-1 py-1.5 text-right font-medium cursor-pointer hover:text-foreground select-none" onClick={() => handleSort("oiChangePct")}>
                  OIΔ%<SortArrow k="oiChangePct" />
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const isSelected = selectedCoin === s.symbol;
                const badge = getBadge(s);
                return (
                  <tr
                    key={s.symbol}
                    onClick={() => onSelectCoin(s.symbol)}
                    className="cursor-pointer transition-colors border-b border-border/40"
                    style={{
                      height: 32,
                      background: isSelected ? "rgba(59,130,246,0.06)" : undefined,
                      borderLeft: isSelected ? "3px solid hsl(var(--primary))" : "3px solid transparent",
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = ""; }}
                  >
                    <td className="px-0.5" onClick={e => { e.stopPropagation(); toggleStar(s.symbol); }}>
                      <Star className={`h-3 w-3 ${s.starred ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30 hover:text-muted-foreground"}`} />
                    </td>
                    <td className="px-1">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: s.sectorColor }} />
                        <span className="w-3 shrink-0" />
                        <span className="font-medium whitespace-nowrap">{s.symbol}</span>
                        {badge && <span className="ml-auto shrink-0">{badge}</span>}
                      </div>
                    </td>
                    <td className="px-1 text-right font-mono text-foreground">₹{formatPrice(s.ltp)}</td>
                    <td className="px-1 text-right font-mono" style={{ color: s.changePct > 0 ? "hsl(var(--positive))" : s.changePct < 0 ? "hsl(var(--negative))" : "hsl(var(--foreground))" }}>
                      {formatPercent(s.changePct)}
                    </td>
                    <td className="px-1 text-right font-mono" style={{ color: s.oiChangePct > 0 ? "hsl(var(--positive))" : s.oiChangePct < 0 ? "hsl(var(--negative))" : "hsl(var(--foreground))" }}>
                      {formatPercent(s.oiChangePct)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
