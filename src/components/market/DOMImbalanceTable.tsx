import { useMemo } from "react";
import { HeatmapTable, HeatmapColumn } from "@/components/shared/HeatmapTable";
import { HeatmapCell } from "@/components/shared/HeatmapCell";
import { getDOMData, DOMData } from "@/data/mockDOM";
import { getDirectionalBg, getIntensityBg } from "@/lib/heatmapColors";
import { formatQty, formatPercent } from "@/lib/formatters";
import { StatusBadge } from "@/components/shared/StatusBadge";

export function DOMImbalanceTable() {
  const data = useMemo(() => getDOMData(), []);

  const columns: HeatmapColumn<DOMData>[] = [
    {
      key: "symbol", label: "Symbol", width: "110px", headerAlign: "left",
      render: (r) => <HeatmapCell value={r.symbol} align="left" mono={false} className="text-foreground font-medium" />,
    },
    {
      key: "bidQty", label: "Bid Qty",
      render: (r) => <HeatmapCell value={formatQty(r.bidQtyTotal)} bgColor={getDirectionalBg(1, 1)} />,
      sortValue: (r) => r.bidQtyTotal,
    },
    {
      key: "askQty", label: "Ask Qty",
      render: (r) => <HeatmapCell value={formatQty(r.askQtyTotal)} bgColor={getDirectionalBg(-1, 1)} />,
      sortValue: (r) => r.askQtyTotal,
    },
    {
      key: "imbalance", label: "Imbalance %",
      render: (r) => (
        <HeatmapCell value={formatPercent(r.imbalancePct)} bgColor={getDirectionalBg(r.imbalancePct, 30)} textColor={r.imbalancePct >= 0 ? "hsl(var(--positive))" : "hsl(var(--negative))"} />
      ),
      sortValue: (r) => r.imbalancePct,
    },
    {
      key: "spread", label: "Spread",
      render: (r) => {
        const bg = r.spreadTicks > 4 ? "rgba(245, 158, 11, 0.15)" : "transparent";
        return <HeatmapCell value={`${r.spreadTicks} ticks`} bgColor={bg} textColor={r.spreadTicks > 4 ? "hsl(var(--warning))" : undefined} />;
      },
      sortValue: (r) => r.spreadTicks,
    },
    {
      key: "top5Bid", label: "Top5 Bid%",
      render: (r) => <HeatmapCell value={`${r.top5BidPct.toFixed(0)}%`} bgColor={getIntensityBg(r.top5BidPct, 60)} />,
      sortValue: (r) => r.top5BidPct,
    },
    {
      key: "largeOrders", label: "Large Orders",
      render: (r) => <HeatmapCell value={r.largeOrders.toString()} bgColor={getIntensityBg(r.largeOrders, 20)} />,
      sortValue: (r) => r.largeOrders,
    },
    {
      key: "sentiment", label: "Sentiment", headerAlign: "center",
      render: (r) => (
        <HeatmapCell value="" align="center">
          <StatusBadge
            label={r.sentiment}
            variant={r.sentiment === "BULLISH" ? "positive" : r.sentiment === "BEARISH" ? "negative" : "neutral"}
          />
        </HeatmapCell>
      ),
    },
  ];

  return (
    <HeatmapTable
      data={data}
      columns={columns}
      rowKey={(r) => r.symbol}
      defaultSortKey="imbalance"
      title="DOM Imbalance"
      subtitle="⚡ 50-Level Depth · Order Book Analysis"
      maxHeight="500px"
    />
  );
}
