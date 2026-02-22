import { useState, useMemo } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { getOpenPositions, getClosedTrades, getJournalData } from "@/data/mockTrades";
import { formatINR, formatPercent, formatLakhsCr } from "@/lib/formatters";
import { getDirectionalBg } from "@/lib/heatmapColors";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Search } from "lucide-react";

const tooltipStyle = { backgroundColor: "hsl(240, 17%, 7%)", border: "1px solid hsl(240, 29%, 14%)", borderRadius: "2px", fontSize: "11px" };

function ProgressBar({ current, entry, target, sl, isLong }: { current: number; entry: number; target: number; sl: number; isLong: boolean }) {
  const totalRange = Math.abs(target - sl);
  const pnlFromEntry = current - entry;
  const targetDist = target - entry;
  const slDist = sl - entry;

  const targetPct = totalRange > 0 ? Math.max(0, Math.min(100, (Math.abs(pnlFromEntry) / Math.abs(targetDist)) * 100)) : 0;
  const slPct = totalRange > 0 ? Math.max(0, Math.min(100, (Math.abs(pnlFromEntry) / Math.abs(slDist)) * 100)) : 0;
  const isProfit = isLong ? current > entry : current < entry;

  if (isProfit) {
    return (
      <div className="flex items-center gap-1">
        <div className="w-16 h-1.5 bg-surface rounded overflow-hidden">
          <div className="h-full bg-positive rounded" style={{ width: `${Math.min(100, targetPct)}%` }} />
        </div>
        <span className="text-[9px] font-mono text-muted-foreground">{targetPct.toFixed(0)}%</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1">
      <div className="w-16 h-1.5 bg-surface rounded overflow-hidden">
        <div className="h-full bg-negative rounded" style={{ width: `${Math.min(100, slPct)}%` }} />
      </div>
      <span className="text-[9px] font-mono text-muted-foreground">{slPct.toFixed(0)}%</span>
    </div>
  );
}

const TradFiPage = () => {
  const positions = useMemo(() => getOpenPositions(), []);
  const closed = useMemo(() => getClosedTrades(), []);
  const journal = useMemo(() => getJournalData(), []);
  const [showClosed, setShowClosed] = useState(true);
  const [showJournal, setShowJournal] = useState(false);

  const [orderSymbol, setOrderSymbol] = useState("");
  const [orderSide, setOrderSide] = useState<"BUY" | "SELL">("BUY");
  const [orderType, setOrderType] = useState("Market");

  const totalClosedPnl = closed.reduce((s, t) => s + t.pnl, 0);
  const wins = closed.filter(t => t.pnl > 0).length;
  const winRate = closed.length > 0 ? (wins / closed.length * 100) : 0;

  const equityCurve = useMemo(() => {
    let cum = 0;
    return closed.map(t => { cum += t.pnl; return { time: t.exitTime, pnl: cum }; });
  }, [closed]);

  return (
    <PageLayout>
      <div className="p-3 space-y-3">
        {/* Order Panel */}
        <div className="bg-card border border-border p-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <input value={orderSymbol} onChange={e => setOrderSymbol(e.target.value)} placeholder="Symbol..."
                className="bg-secondary text-[11px] pl-7 pr-2 py-1.5 rounded w-40 border-none outline-none placeholder:text-muted-foreground" />
            </div>
            <div className="flex gap-0.5">
              {(["BUY", "SELL"] as const).map(s => (
                <button key={s} onClick={() => setOrderSide(s)}
                  className={`px-3 py-1.5 text-[11px] font-semibold rounded transition-colors ${orderSide === s ? (s === "BUY" ? "bg-positive text-positive-foreground" : "bg-negative text-negative-foreground") : "bg-secondary text-muted-foreground"}`}>
                  {s}
                </button>
              ))}
            </div>
            <select value={orderType} onChange={e => setOrderType(e.target.value)}
              className="bg-secondary text-[11px] px-2 py-1.5 rounded border-none outline-none text-foreground">
              {["Market", "Limit", "SL", "SL-M"].map(t => <option key={t}>{t}</option>)}
            </select>
            <input placeholder="Qty" className="bg-secondary text-[11px] px-2 py-1.5 rounded w-16 border-none outline-none placeholder:text-muted-foreground font-mono" />
            <input placeholder="Price" className="bg-secondary text-[11px] px-2 py-1.5 rounded w-20 border-none outline-none placeholder:text-muted-foreground font-mono" />
            <input placeholder="Target" className="bg-secondary text-[11px] px-2 py-1.5 rounded w-20 border-none outline-none placeholder:text-muted-foreground font-mono" />
            <input placeholder="SL" className="bg-secondary text-[11px] px-2 py-1.5 rounded w-20 border-none outline-none placeholder:text-muted-foreground font-mono" />
            <span className="text-[10px] font-mono text-muted-foreground">R:R —</span>
            <button className={`px-4 py-1.5 text-[11px] font-semibold rounded ${orderSide === "BUY" ? "bg-positive text-positive-foreground" : "bg-negative text-negative-foreground"}`}>
              EXECUTE
            </button>
          </div>
        </div>

        {/* Active Positions */}
        <div className="bg-card border border-border">
          <div className="px-3 py-2 border-b border-border text-[11px] font-semibold">Active Positions</div>
          <div className="overflow-auto scrollbar-thin">
            <table className="w-full text-[11px]">
              <thead className="bg-card">
                <tr className="text-muted-foreground">
                  <th className="px-2 py-1.5 text-left font-medium">Symbol</th>
                  <th className="px-2 py-1.5 text-right font-medium">Qty</th>
                  <th className="px-2 py-1.5 text-right font-medium">Avg</th>
                  <th className="px-2 py-1.5 text-right font-medium">LTP</th>
                  <th className="px-2 py-1.5 text-right font-medium">P&L ₹</th>
                  <th className="px-2 py-1.5 text-right font-medium">P&L %</th>
                  <th className="px-2 py-1.5 text-center font-medium">Target</th>
                  <th className="px-2 py-1.5 text-center font-medium">SL</th>
                  <th className="px-2 py-1.5 text-right font-medium">R:R</th>
                  <th className="px-2 py-1.5 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {positions.map(p => {
                  const isLong = p.qty > 0;
                  const pnl = (p.ltp - p.avgPrice) * p.qty;
                  const pnlPct = ((p.ltp - p.avgPrice) / p.avgPrice) * 100 * (isLong ? 1 : -1);
                  const rr = Math.abs((p.ltp - p.avgPrice) / (p.avgPrice - p.sl));
                  return (
                    <tr key={p.id} className={`border-l-2 ${pnl >= 0 ? "border-l-positive/50" : "border-l-negative/50"} hover:bg-surface-hover`}>
                      <td className="px-2 py-1.5 font-mono font-medium">
                        {p.symbol}
                        <span className={`ml-1 text-[9px] px-1 rounded ${p.type === "CE" ? "bg-positive/15 text-positive" : p.type === "PE" ? "bg-negative/15 text-negative" : "bg-primary/15 text-primary"}`}>{p.type}</span>
                      </td>
                      <td className={`px-2 py-1.5 text-right font-mono ${p.qty > 0 ? "text-positive" : "text-negative"}`}>{p.qty > 0 ? "+" : ""}{p.qty}</td>
                      <td className="px-2 py-1.5 text-right font-mono">₹{p.avgPrice.toLocaleString("en-IN")}</td>
                      <td className="px-2 py-1.5 text-right font-mono cell-flash">₹{p.ltp.toLocaleString("en-IN")}</td>
                      <td className="px-2 py-1.5 text-right font-mono" style={{ background: getDirectionalBg(pnl, 20000), color: pnl >= 0 ? "hsl(var(--positive))" : "hsl(var(--negative))" }}>
                        {pnl >= 0 ? "+" : ""}₹{Math.abs(pnl).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono" style={{ background: getDirectionalBg(pnlPct, 10), color: pnlPct >= 0 ? "hsl(var(--positive))" : "hsl(var(--negative))" }}>
                        {formatPercent(pnlPct)}
                      </td>
                      <td className="px-2 py-1.5">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-[9px] font-mono text-muted-foreground">₹{p.target}</span>
                          <ProgressBar current={p.ltp} entry={p.avgPrice} target={p.target} sl={p.sl} isLong={isLong} />
                        </div>
                      </td>
                      <td className="px-2 py-1.5">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-[9px] font-mono text-muted-foreground">₹{p.sl}</span>
                          <ProgressBar current={p.ltp} entry={p.avgPrice} target={p.sl} sl={p.target} isLong={!isLong} />
                        </div>
                      </td>
                      <td className={`px-2 py-1.5 text-right font-mono ${rr > 1.5 ? "text-positive" : rr < 1 ? "text-negative" : "text-warning"}`}>{rr.toFixed(1)}</td>
                      <td className="px-2 py-1.5 text-center">
                        <div className="flex gap-1 justify-center">
                          <button className="px-1.5 py-0.5 text-[9px] bg-secondary hover:bg-surface-hover rounded">Trail</button>
                          <button className="px-1.5 py-0.5 text-[9px] bg-negative/20 text-negative hover:bg-negative/30 rounded">Exit</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Closed Trades */}
        <div className="bg-card border border-border">
          <button onClick={() => setShowClosed(!showClosed)} className="w-full px-3 py-2 border-b border-border text-[11px] font-semibold flex items-center justify-between hover:bg-surface-hover">
            <span>Today's Closed Trades</span>
            <span className="text-muted-foreground">{showClosed ? "▼" : "▶"}</span>
          </button>
          {showClosed && (
            <div>
              <div className="overflow-auto scrollbar-thin">
                <table className="w-full text-[11px]">
                  <thead className="bg-card">
                    <tr className="text-muted-foreground">
                      <th className="px-2 py-1.5 text-left font-medium">Symbol</th>
                      <th className="px-2 py-1.5 text-right font-medium">Entry</th>
                      <th className="px-2 py-1.5 text-right font-medium">Exit</th>
                      <th className="px-2 py-1.5 text-right font-medium">P&L ₹</th>
                      <th className="px-2 py-1.5 text-right font-medium">P&L %</th>
                      <th className="px-2 py-1.5 text-right font-medium">Duration</th>
                      <th className="px-2 py-1.5 text-right font-medium">R:R</th>
                    </tr>
                  </thead>
                  <tbody>
                    {closed.map(t => (
                      <tr key={t.id} className="hover:bg-surface-hover">
                        <td className="px-2 py-1 font-mono font-medium">{t.symbol}</td>
                        <td className="px-2 py-1 text-right font-mono">₹{t.entryPrice}</td>
                        <td className="px-2 py-1 text-right font-mono">₹{t.exitPrice}</td>
                        <td className="px-2 py-1 text-right font-mono" style={{ background: getDirectionalBg(t.pnl, 15000), color: t.pnl >= 0 ? "hsl(var(--positive))" : "hsl(var(--negative))" }}>
                          {t.pnl >= 0 ? "+" : ""}₹{Math.abs(t.pnl).toLocaleString("en-IN")}
                        </td>
                        <td className="px-2 py-1 text-right font-mono" style={{ color: t.pnlPct >= 0 ? "hsl(var(--positive))" : "hsl(var(--negative))" }}>{formatPercent(t.pnlPct)}</td>
                        <td className="px-2 py-1 text-right font-mono text-muted-foreground">{t.duration}</td>
                        <td className="px-2 py-1 text-right font-mono">{t.rr.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-3 py-2 border-t border-border flex items-center gap-6 text-[11px]">
                <span>Total P&L: <strong className={`font-mono ${totalClosedPnl >= 0 ? "text-positive" : "text-negative"}`}>{totalClosedPnl >= 0 ? "+" : ""}₹{Math.abs(totalClosedPnl).toLocaleString("en-IN")}</strong></span>
                <span>Trades: <strong className="font-mono">{closed.length}</strong></span>
                <span>Win Rate: <strong className="font-mono">{winRate.toFixed(0)}%</strong></span>
                <div className="ml-auto w-[150px] h-[30px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={equityCurve}>
                      <Line type="monotone" dataKey="pnl" stroke={totalClosedPnl >= 0 ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)"} strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Trade Journal */}
        <div className="bg-card border border-border">
          <button onClick={() => setShowJournal(!showJournal)} className="w-full px-3 py-2 border-b border-border text-[11px] font-semibold flex items-center justify-between hover:bg-surface-hover">
            <span>Trade Journal — Calendar</span>
            <span className="text-muted-foreground">{showJournal ? "▼" : "▶"}</span>
          </button>
          {showJournal && (
            <div className="p-3">
              <div className="grid grid-cols-5 gap-1 mb-3">
                {journal.map(d => (
                  <div key={d.date} className="p-2 rounded cursor-pointer hover:ring-1 hover:ring-primary/30 transition-all"
                    style={{ background: getDirectionalBg(d.pnl, 40000) }}>
                    <div className="text-[9px] text-muted-foreground">{new Date(d.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                    <div className={`text-[10px] font-mono font-medium ${d.pnl >= 0 ? "text-positive" : "text-negative"}`}>
                      {d.pnl >= 0 ? "+" : ""}₹{Math.abs(d.pnl / 1000).toFixed(1)}K
                    </div>
                    <div className="text-[9px] font-mono text-muted-foreground">{d.trades}T · {d.winRate.toFixed(0)}%</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 text-[11px] text-muted-foreground">
                <span>Win Rate: <strong className="text-foreground font-mono">{(journal.filter(d => d.pnl > 0).length / journal.length * 100).toFixed(0)}%</strong></span>
                <span>Avg Winner: <strong className="text-positive font-mono">₹{(journal.filter(d => d.pnl > 0).reduce((s, d) => s + d.pnl, 0) / Math.max(1, journal.filter(d => d.pnl > 0).length) / 1000).toFixed(1)}K</strong></span>
                <span>Avg Loser: <strong className="text-negative font-mono">₹{(Math.abs(journal.filter(d => d.pnl < 0).reduce((s, d) => s + d.pnl, 0)) / Math.max(1, journal.filter(d => d.pnl < 0).length) / 1000).toFixed(1)}K</strong></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default TradFiPage;
