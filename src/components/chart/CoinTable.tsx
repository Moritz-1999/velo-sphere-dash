import { useMemo, useState } from "react";
import { Star, Search } from "lucide-react";
import { getStocks, StockData } from "@/data/mockStocks";
import { formatPrice, formatPercent } from "@/lib/formatters";

type SortKey = "symbol" | "ltp" | "changePct" | "oiChangePct" | "volume";
type TabKey = "fav" | "indices" | "fno" | "alpha" | "ohl";

const tabs: { key: TabKey; label: string }[] = [
  { key: "fav", label: "⭐ Fav" },
  { key: "indices", label: "Indices" },
  { key: "fno", label: "F&O" },
  { key: "alpha", label: "Alpha" },
  { key: "ohl", label: "OHL" },
];

interface CoinTableProps {
  selectedCoin: string;
  onSelectCoin: (symbol: string) => void;
}

export function CoinTable({ selectedCoin, onSelectCoin }: CoinTableProps) {
  const [allStocks, setAllStocks] = useState(() => getStocks());
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<TabKey>("fno");
  const [sortKey, setSortKey] = useState<SortKey>("volume");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const toggleStar = (symbol: string) => {
    setAllStocks(prev =>
      prev.map(s => (s.symbol === symbol ? { ...s, starred: !s.starred } : s))
    );
  };

  const filtered = useMemo(() => {
    let result = allStocks;

    // If searching, search across all tabs
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => s.symbol.toLowerCase().includes(q));
    } else {
      // Apply tab filter
      switch (tab) {
        case "fav":
          result = result.filter(s => s.starred);
          break;
        case "indices":
          result = result.filter(s => s.category === "index");
          break;
        case "fno":
          result = result.filter(s => s.category === "fno");
          break;
        case "alpha":
          result = result
            .filter(s => s.category === "fno")
            .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
            .slice(0, 20);
          break;
        case "ohl":
          result = result.filter(s => s.category === "fno" && s.ohlSignal !== null);
          break;
      }
    }

    // Sort (alpha tab has its own sort, skip for it unless user explicitly sorts)
    if (tab !== "alpha" || search) {
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
  }, [allStocks, search, tab, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortArrow = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      <span className="ml-0.5 text-[9px]">{sortDir === "desc" ? "↓" : "↑"}</span>
    ) : null;

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
        {/* Tabs */}
        <div className="flex items-center gap-0.5">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${
                tab === t.key
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        {tab === "fav" && filtered.length === 0 && !search ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-xs">
            Star stocks to add them here
          </div>
        ) : (
          <table className="w-full text-[11px]">
            <thead className="sticky top-0 bg-card z-10">
              <tr className="text-muted-foreground border-b border-border">
                <th className="w-5 px-0.5 py-1.5" />
                <th
                  className="px-1 py-1.5 text-left font-medium cursor-pointer hover:text-foreground select-none"
                  onClick={() => handleSort("symbol")}
                >
                  Symbol
                  <SortArrow k="symbol" />
                </th>
                <th
                  className="w-[70px] px-1 py-1.5 text-right font-medium cursor-pointer hover:text-foreground select-none"
                  onClick={() => handleSort("ltp")}
                >
                  LTP
                  <SortArrow k="ltp" />
                </th>
                <th
                  className="w-[55px] px-1 py-1.5 text-right font-medium cursor-pointer hover:text-foreground select-none"
                  onClick={() => handleSort("changePct")}
                >
                  Chg%
                  <SortArrow k="changePct" />
                </th>
                <th
                  className="w-[55px] px-1 py-1.5 text-right font-medium cursor-pointer hover:text-foreground select-none"
                  onClick={() => handleSort("oiChangePct")}
                >
                  OIΔ%
                  <SortArrow k="oiChangePct" />
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
                    className="cursor-pointer transition-colors border-b border-border/40"
                    style={{
                      height: 32,
                      background: isSelected
                        ? "rgba(59,130,246,0.06)"
                        : undefined,
                      borderLeft: isSelected
                        ? "3px solid hsl(var(--primary))"
                        : "3px solid transparent",
                    }}
                    onMouseEnter={e => {
                      if (!isSelected)
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(255,255,255,0.04)";
                    }}
                    onMouseLeave={e => {
                      if (!isSelected)
                        (e.currentTarget as HTMLElement).style.background = "";
                    }}
                  >
                    {/* Star */}
                    <td
                      className="px-0.5"
                      onClick={e => {
                        e.stopPropagation();
                        toggleStar(s.symbol);
                      }}
                    >
                      <Star
                        className={`h-3 w-3 ${
                          s.starred
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-muted-foreground/30 hover:text-muted-foreground"
                        }`}
                      />
                    </td>
                    {/* Symbol */}
                    <td className="px-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: s.sectorColor }}
                        />
                        {/* spacer for future logo */}
                        <span className="w-3 shrink-0" />
                        <span className="font-medium whitespace-nowrap">
                          {s.symbol}
                        </span>
                        {s.ohlSignal && (
                          <span
                            className={`text-[9px] font-bold ml-auto shrink-0 ${
                              s.ohlSignal === "O=H"
                                ? "text-negative"
                                : "text-positive"
                            }`}
                          >
                            {s.ohlSignal}
                          </span>
                        )}
                      </div>
                    </td>
                    {/* LTP */}
                    <td className="px-1 text-right font-mono text-foreground">
                      ₹{formatPrice(s.ltp)}
                    </td>
                    {/* Chg% — text color only, no bg */}
                    <td
                      className="px-1 text-right font-mono"
                      style={{
                        color:
                          s.changePct > 0
                            ? "hsl(var(--positive))"
                            : s.changePct < 0
                              ? "hsl(var(--negative))"
                              : "hsl(var(--foreground))",
                      }}
                    >
                      {formatPercent(s.changePct)}
                    </td>
                    {/* OI Δ% — text color only, no bg */}
                    <td
                      className="px-1 text-right font-mono"
                      style={{
                        color:
                          s.oiChangePct > 0
                            ? "hsl(var(--positive))"
                            : s.oiChangePct < 0
                              ? "hsl(var(--negative))"
                              : "hsl(var(--foreground))",
                      }}
                    >
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
