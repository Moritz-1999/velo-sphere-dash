import { useMemo, useState } from "react";
import { Star, Search } from "lucide-react";
import { getStocks, StockData } from "@/data/mockStocks";
import { formatPrice, formatPercent } from "@/lib/formatters";

type SortKey = "symbol" | "ltp" | "changePct" | "oiChangePct" | "volume";
type MainTab = "watchlist" | "market";
type Segment = "fno" | "indices" | "nifty50" | "banknifty";
type SmartFilter = "all" | "hot" | "ol" | "oh" | "longBuildup" | "shortBuildup" | "volSpike";

const segments: { key: Segment; label: string }[] = [
  { key: "fno", label: "F&O Stocks" },
  { key: "indices", label: "Indices" },
  { key: "nifty50", label: "Nifty 50" },
  { key: "banknifty", label: "BankNifty" },
];

const smartFilters: { key: SmartFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "hot", label: "🔥 Hot" },
  { key: "ol", label: "🚀 O=L" },
  { key: "oh", label: "🔻 O=H" },
  { key: "longBuildup", label: "📈 Long Buildup" },
  { key: "shortBuildup", label: "📉 Short Buildup" },
  { key: "volSpike", label: "💥 Vol Spike" },
];

const NIFTY50 = [
  "RELIANCE","TCS","INFY","HDFCBANK","ICICIBANK","SBIN","TATAMOTORS","TATASTEEL",
  "WIPRO","LT","HINDALCO","MARUTI","BAJFINANCE","AXISBANK","KOTAKBANK","SUNPHARMA",
  "HCLTECH","ADANIENT","BHARTIARTL","ITC","NTPC","ONGC","POWERGRID","NESTLEIND",
  "ULTRACEMCO","GRASIM","DRREDDY","CIPLA","TECHM","APOLLOHOSP","DIVISLAB","ASIANPAINT",
  "TITAN","BAJAJ-AUTO","M&M","HEROMOTOCO","EICHERMOT","BPCL","COALINDIA","JSWSTEEL",
  "TATACONSUM","HINDUNILVR","INDUSINDBK",
];
const BANKNIFTY = ["HDFCBANK","ICICIBANK","SBIN","AXISBANK","KOTAKBANK","INDUSINDBK","PNB","BANKBARODA","CANBK","FEDERALBNK"];

interface CoinTableProps {
  selectedCoin: string;
  onSelectCoin: (symbol: string) => void;
}

export function CoinTable({ selectedCoin, onSelectCoin }: CoinTableProps) {
  const [allStocks, setAllStocks] = useState(() => getStocks());
  const [search, setSearch] = useState("");
  const [mainTab, setMainTab] = useState<MainTab>("market");
  const [segment, setSegment] = useState<Segment>("fno");
  const [smart, setSmart] = useState<SmartFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("volume");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const toggleStar = (symbol: string) => {
    setAllStocks(prev =>
      prev.map(s => (s.symbol === symbol ? { ...s, starred: !s.starred } : s))
    );
  };

  const filtered = useMemo(() => {
    let result = allStocks;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => s.symbol.toLowerCase().includes(q));
    } else if (mainTab === "watchlist") {
      result = result.filter(s => s.starred);
    } else {
      // Market tab — apply segment
      switch (segment) {
        case "fno":
          result = result.filter(s => s.category === "fno");
          break;
        case "indices":
          result = result.filter(s => s.category === "index");
          break;
        case "nifty50":
          result = result.filter(s => NIFTY50.includes(s.symbol));
          break;
        case "banknifty":
          result = result.filter(s => BANKNIFTY.includes(s.symbol));
          break;
      }

      // Apply smart filter
      switch (smart) {
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
          result = result.filter(s => s.changePct > 0 && s.oiChangePct > 0);
          break;
        case "shortBuildup":
          result = result.filter(s => s.changePct < 0 && s.oiChangePct > 0);
          break;
        case "volSpike":
          result = [...result].sort((a, b) => b.volume - a.volume).slice(0, 15);
          break;
      }
    }

    if (smart !== "hot") {
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
    }
    return result;
  }, [allStocks, search, mainTab, segment, smart, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortArrow = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      <span className="ml-0.5 text-[8px] opacity-80">{sortDir === "desc" ? "▼" : "▲"}</span>
    ) : null;

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Main tabs: Watchlist / Market */}
      <div className="p-1.5">
        <div className="flex gap-1 p-0.5 bg-secondary rounded-md">
          <button
            onClick={() => setMainTab("watchlist")}
            className={`flex-1 h-7 text-[11px] font-semibold rounded transition-colors ${
              mainTab === "watchlist"
                ? "bg-border text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            📌 Watchlist
          </button>
          <button
            onClick={() => setMainTab("market")}
            className={`flex-1 h-7 text-[11px] font-semibold rounded transition-colors ${
              mainTab === "market"
                ? "bg-border text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🌐 Market
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-1.5 pb-1.5">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search stocks..."
            className="w-full h-7 bg-secondary text-[11px] pl-7 pr-2 rounded border border-border outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Smart filter row — Market tab only */}
      {mainTab === "market" && !search && (
        <div className="flex gap-1.5 px-1.5 pb-1.5">
          <select
            value={segment}
            onChange={e => setSegment(e.target.value as Segment)}
            className="flex-1 h-6 text-[10px] bg-secondary border border-border rounded px-1.5 text-foreground outline-none cursor-pointer"
          >
            {segments.map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
          <select
            value={smart}
            onChange={e => setSmart(e.target.value as SmartFilter)}
            className="flex-1 h-6 text-[10px] bg-secondary border border-border rounded px-1.5 text-foreground outline-none cursor-pointer"
          >
            {smartFilters.map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        {mainTab === "watchlist" && filtered.length === 0 && !search ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-[11px]">
            Star stocks to add them here
          </div>
        ) : (
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead className="sticky top-0 bg-card z-10">
              <tr className="border-b border-border">
                <th className="w-4 px-0.5" style={{ height: 24 }} />
                <th
                  className="text-left px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground select-none"
                  style={{ height: 24 }}
                  onClick={() => handleSort("symbol")}
                >
                  Symbol<SortArrow k="symbol" />
                </th>
                <th
                  className="text-right px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground select-none"
                  style={{ width: 72, height: 24 }}
                  onClick={() => handleSort("ltp")}
                >
                  LTP<SortArrow k="ltp" />
                </th>
                <th
                  className="text-right px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground select-none"
                  style={{ width: 52, height: 24 }}
                  onClick={() => handleSort("changePct")}
                >
                  Chg%<SortArrow k="changePct" />
                </th>
                <th
                  className="text-right px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground select-none"
                  style={{ width: 52, height: 24 }}
                  onClick={() => handleSort("oiChangePct")}
                >
                  OIΔ%<SortArrow k="oiChangePct" />
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const isSelected = selectedCoin === s.symbol;
                return (
                  <tr
                    key={s.symbol}
                    onClick={() => onSelectCoin(s.symbol)}
                    className="cursor-pointer transition-colors"
                    style={{
                      height: 28,
                      borderBottom: "1px solid hsl(var(--border))",
                      background: isSelected ? "rgba(59,130,246,0.05)" : undefined,
                      borderLeft: isSelected ? "3px solid hsl(var(--primary))" : "3px solid transparent",
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) (e.currentTarget as HTMLElement).style.background = "";
                    }}
                  >
                    {/* Star */}
                    <td
                      className="px-0.5 text-center"
                      onClick={e => { e.stopPropagation(); toggleStar(s.symbol); }}
                    >
                      <Star className={`h-3 w-3 inline-block ${s.starred ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30 hover:text-muted-foreground"}`} />
                    </td>
                    {/* Symbol */}
                    <td className="px-1">
                      <div className="flex items-center gap-1">
                        <span
                          className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: s.sectorColor }}
                        />
                        <span className="text-xs font-medium text-foreground whitespace-nowrap leading-none">
                          {s.symbol}
                        </span>
                        {s.ohlSignal && (
                          <span className={`text-[9px] font-bold ml-auto shrink-0 ${s.ohlSignal === "O=H" ? "text-negative" : "text-positive"}`}>
                            {s.ohlSignal}
                          </span>
                        )}
                      </div>
                    </td>
                    {/* LTP */}
                    <td className="px-1 text-right font-mono text-xs text-foreground tabular-nums">
                      ₹{formatPrice(s.ltp)}
                    </td>
                    {/* Chg% */}
                    <td className="px-1 text-right">
                      <span
                        className="font-mono text-[11px] font-medium tabular-nums"
                        style={{
                          color: s.changePct > 0 ? "hsl(var(--positive))" : s.changePct < 0 ? "hsl(var(--negative))" : "hsl(var(--foreground))",
                        }}
                      >
                        {formatPercent(s.changePct)}
                      </span>
                    </td>
                    {/* OI Δ% */}
                    <td className="px-1 text-right">
                      <span
                        className="font-mono text-[11px] font-medium tabular-nums"
                        style={{
                          color: s.oiChangePct > 0 ? "hsl(var(--positive))" : s.oiChangePct < 0 ? "hsl(var(--negative))" : "hsl(var(--foreground))",
                        }}
                      >
                        {formatPercent(s.oiChangePct)}
                      </span>
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
