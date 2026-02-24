import { useMemo } from "react";
import { getOpenPositions, getClosedTrades } from "@/data/mockTrades";
import { formatINR } from "@/lib/formatters";

export function PnLSummaryBar() {
  const positions = useMemo(() => getOpenPositions(), []);
  const closed = useMemo(() => getClosedTrades(), []);

  const totalClosedPnl = closed.reduce((s, t) => s + t.pnl, 0);
  const openPnl = positions.reduce((s, p) => s + (p.ltp - p.avgPrice) * p.qty, 0);
  const totalPnl = totalClosedPnl + openPnl;
  const wins = closed.filter(t => t.pnl > 0).length;
  const losses = closed.filter(t => t.pnl <= 0).length;
  const winRate = closed.length > 0 ? (wins / closed.length * 100) : 0;
  const best = closed.length > 0 ? Math.max(...closed.map(t => t.pnl)) : 0;
  const worst = closed.length > 0 ? Math.min(...closed.map(t => t.pnl)) : 0;
  const avgRR = closed.length > 0 ? (closed.reduce((s, t) => s + t.rr, 0) / closed.length) : 0;
  const openRisk = positions.reduce((s, p) => s + Math.abs(p.avgPrice - p.sl) * Math.abs(p.qty), 0);

  const pnlColor = totalPnl >= 0 ? "text-positive" : "text-negative";
  const pnlBarWidth = Math.min(100, Math.abs(totalPnl) / 500); // scale

  return (
    <div className="bg-card border border-border" style={{ height: 56 }}>
      <div className="flex items-center h-full px-4 gap-6 text-[11px]">
        {/* P&L */}
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-[9px]">Today's P&L</span>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-mono font-bold ${pnlColor}`}>
              {totalPnl >= 0 ? "+" : ""}₹{Math.abs(totalPnl).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </span>
            <div className="w-20 h-1.5 bg-surface rounded overflow-hidden">
              <div
                className={`h-full rounded ${totalPnl >= 0 ? "bg-positive" : "bg-negative"}`}
                style={{ width: `${pnlBarWidth}%` }}
              />
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-border" />

        {/* Trades */}
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-[9px]">Trades</span>
          <span className="font-mono">{closed.length} (<span className="text-positive">{wins}W</span> / <span className="text-negative">{losses}L</span>)</span>
        </div>

        <div className="h-6 w-px bg-border" />

        {/* Win Rate */}
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-[9px]">Win Rate</span>
          <span className="font-mono">{winRate.toFixed(0)}%</span>
        </div>

        <div className="h-6 w-px bg-border" />

        {/* Open Risk */}
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-[9px]">Open Risk</span>
          <span className="font-mono text-warning">₹{openRisk.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
        </div>

        <div className="h-6 w-px bg-border" />

        {/* Best / Worst */}
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-[9px]">Best</span>
          <span className="font-mono text-positive">+₹{best.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-[9px]">Worst</span>
          <span className="font-mono text-negative">-₹{Math.abs(worst).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
        </div>

        <div className="h-6 w-px bg-border" />

        {/* R:R */}
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-[9px]">Avg R:R</span>
          <span className={`font-mono ${avgRR >= 1.5 ? "text-positive" : avgRR >= 1 ? "text-warning" : "text-negative"}`}>{avgRR.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}
