import { useState, useEffect } from "react";
import { HeatmapTable, HeatmapColumn } from "@/components/shared/HeatmapTable";
import { HeatmapCell } from "@/components/shared/HeatmapCell";
import { getBigTrades, BigTrade } from "@/data/mockBigTrades";
import { getIntensityBg, getDirectionalBg } from "@/lib/heatmapColors";
import { formatCompactINR, formatPrice } from "@/lib/formatters";
import { StatusBadge } from "@/components/shared/StatusBadge";

export function BigTradeTracker() {
  const [trades, setTrades] = useState(() => getBigTrades());

  useEffect(() => {
    const timer = setInterval(() => {
      setTrades(prev => prev.map(t => ({
        ...t,
        price: t.price + (Math.random() - 0.48) * t.price * 0.001,
        qty: t.qty + Math.floor((Math.random() - 0.5) * 50),
        value: t.value + (Math.random() - 0.5) * t.value * 0.005,
        deltaFromVwap: t.deltaFromVwap + (Math.random() - 0.5) * 0.05,
      })));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const columns: HeatmapColumn<BigTrade>[] = [
    {
      key: "time", label: "Time", width: "70px", headerAlign: "left",
      render: (r) => <HeatmapCell value={r.time} align="left" className="text-muted-foreground" />,
    },
    {
      key: "symbol", label: "Symbol", width: "100px", headerAlign: "left",
      render: (r) => <HeatmapCell value={r.symbol} align="left" mono={false} className="text-foreground font-medium" />,
    },
    {
      key: "price", label: "Price",
      render: (r) => <HeatmapCell value={`₹${formatPrice(r.price)}`} />,
      sortValue: (r) => r.price,
    },
    {
      key: "qty", label: "Qty",
      render: (r) => <HeatmapCell value={r.qty.toLocaleString("en-IN")} bgColor={getIntensityBg(r.qty, 4000)} />,
      sortValue: (r) => r.qty,
    },
    {
      key: "value", label: "Value",
      render: (r) => <HeatmapCell value={formatCompactINR(r.value)} bgColor={getIntensityBg(r.value, 2e7)} />,
      sortValue: (r) => r.value,
    },
    {
      key: "side", label: "Side", headerAlign: "center",
      render: (r) => (
        <HeatmapCell value="" align="center">
          <StatusBadge label={r.side} variant={r.side === "BUY" ? "positive" : "negative"} />
        </HeatmapCell>
      ),
    },
    {
      key: "deltaVwap", label: "Δ VWAP",
      render: (r) => (
        <HeatmapCell
          value={`${r.deltaFromVwap >= 0 ? "+" : ""}${r.deltaFromVwap.toFixed(2)}%`}
          bgColor={getDirectionalBg(Math.abs(r.deltaFromVwap) > 0.5 ? -1 : 1, 1)}
          textColor={Math.abs(r.deltaFromVwap) < 0.5 ? "hsl(var(--positive))" : "hsl(var(--negative))"}
        />
      ),
      sortValue: (r) => Math.abs(r.deltaFromVwap),
    },
  ];

  return (
    <HeatmapTable
      data={trades}
      columns={columns}
      rowKey={(r) => r.id}
      defaultSortKey="value"
      title="Big Trade Tracker"
      subtitle="⚡ TBT Powered · >₹10L trades"
      maxHeight="500px"
    />
  );
}
