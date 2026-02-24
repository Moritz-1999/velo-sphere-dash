import { Position } from "@/data/mockTrades";

interface PositionCardProps {
  position: Position;
}

export function PositionCard({ position: p }: PositionCardProps) {
  const isLong = p.qty > 0;
  const pnl = (p.ltp - p.avgPrice) * p.qty;
  const pnlPct = ((p.ltp - p.avgPrice) / p.avgPrice) * 100 * (isLong ? 1 : -1);

  // Progress track: SL on left, Target on right
  const slPrice = p.sl;
  const targetPrice = p.target;
  const totalRange = Math.abs(targetPrice - slPrice);
  const ltpPosition = totalRange > 0 ? ((p.ltp - Math.min(slPrice, targetPrice)) / totalRange) * 100 : 50;
  const clampedPos = Math.max(0, Math.min(100, isLong ? ltpPosition : 100 - ltpPosition));
  const isProfit = pnl >= 0;

  return (
    <div className="bg-card border border-border p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-semibold">{p.symbol}</span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
            isLong ? "bg-positive/15 text-positive" : "bg-negative/15 text-negative"
          }`}>
            {isLong ? "🟢 LONG" : "🔴 SHORT"}
          </span>
        </div>
      </div>

      <div className="text-[10px] text-muted-foreground mb-3">
        Qty: {p.qty > 0 ? "+" : ""}{p.qty} &nbsp; Avg: ₹{p.avgPrice}
      </div>

      {/* Progress track */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground mb-1">
          <span>SL ₹{slPrice}</span>
          <span>₹{targetPrice} Target</span>
        </div>
        <div className="relative h-2 bg-surface rounded overflow-hidden">
          {/* Fill from SL to LTP */}
          <div
            className={`absolute inset-y-0 left-0 rounded ${isProfit ? "bg-positive/40" : "bg-negative/40"}`}
            style={{ width: `${clampedPos}%` }}
          />
          {/* LTP marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-foreground border-2 border-card"
            style={{ left: `${clampedPos}%`, transform: `translateX(-50%) translateY(-50%)` }}
          />
        </div>
        <div className="text-center text-[9px] font-mono text-muted-foreground mt-1">
          ▲ LTP ₹{p.ltp}
        </div>
      </div>

      {/* P&L */}
      <div className={`text-sm font-mono font-bold ${isProfit ? "text-positive" : "text-negative"} mb-2`}>
        P&L: {pnl >= 0 ? "+" : ""}₹{Math.abs(pnl).toLocaleString("en-IN", { maximumFractionDigits: 0 })} ({pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(2)}%)
      </div>

      {/* Actions */}
      <div className="flex gap-1.5">
        <button className="px-2 py-1 text-[9px] bg-secondary hover:bg-surface-hover rounded transition-colors">Trail SL</button>
        <button className="px-2 py-1 text-[9px] bg-secondary hover:bg-surface-hover rounded transition-colors">Modify</button>
        <button className="px-2 py-1 text-[9px] bg-negative/20 text-negative hover:bg-negative/30 rounded transition-colors">Exit</button>
      </div>
    </div>
  );
}
