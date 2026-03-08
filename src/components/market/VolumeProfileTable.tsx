import { useState, useEffect } from "react";
import { HeatmapTable, HeatmapColumn } from "@/components/shared/HeatmapTable";
import { HeatmapCell } from "@/components/shared/HeatmapCell";
import { getVolumeProfiles, VolumeProfileData } from "@/data/mockVolumeProfile";
import { getDirectionalBg, getIntensityBg } from "@/lib/heatmapColors";
import { formatPrice, formatLakhsCr } from "@/lib/formatters";
import { StatusBadge } from "@/components/shared/StatusBadge";

export function VolumeProfileTable() {
  const [data, setData] = useState(() => getVolumeProfiles());

  useEffect(() => {
    const timer = setInterval(() => {
      setData(prev => prev.map(d => ({
        ...d,
        ltpVsPocPct: d.ltpVsPocPct + (Math.random() - 0.5) * 0.1,
        cumulativeDelta: d.cumulativeDelta + (Math.random() - 0.5) * 5e4,
        bigTradeCount: Math.max(0, d.bigTradeCount + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
      })));
    }, 900);
    return () => clearInterval(timer);
  }, []);

  const columns: HeatmapColumn<VolumeProfileData>[] = [
    {
      key: "symbol", label: "Symbol", width: "110px", headerAlign: "left",
      render: (r) => <HeatmapCell value={r.symbol} align="left" mono={false} className="text-foreground font-medium" />,
    },
    {
      key: "poc", label: "POC",
      render: (r) => <HeatmapCell value={`₹${formatPrice(r.poc)}`} bgColor={getIntensityBg(50, 100)} />,
      sortValue: (r) => r.poc,
    },
    {
      key: "vah", label: "VAH",
      render: (r) => <HeatmapCell value={`₹${formatPrice(r.vah)}`} bgColor={getIntensityBg(30, 100)} />,
      sortValue: (r) => r.vah,
    },
    {
      key: "val", label: "VAL",
      render: (r) => <HeatmapCell value={`₹${formatPrice(r.val)}`} bgColor={getIntensityBg(30, 100)} />,
      sortValue: (r) => r.val,
    },
    {
      key: "ltpVsPoc", label: "LTP vs POC",
      render: (r) => {
        const color = Math.abs(r.ltpVsPocPct) < 0.5 ? "positive" : Math.abs(r.ltpVsPocPct) > 1.5 ? "negative" : "neutral";
        const bg = getDirectionalBg(-Math.abs(r.ltpVsPocPct), 2); // closer = green
        return <HeatmapCell value={`${r.ltpVsPocPct >= 0 ? "+" : ""}${r.ltpVsPocPct.toFixed(2)}%`} bgColor={bg} textColor={color === "positive" ? "hsl(var(--positive))" : color === "negative" ? "hsl(var(--negative))" : undefined} />;
      },
      sortValue: (r) => Math.abs(r.ltpVsPocPct),
    },
    {
      key: "position", label: "Position", headerAlign: "center",
      render: (r) => (
        <HeatmapCell value="" align="center">
          <StatusBadge label={r.position} variant={r.position === "Inside VA" ? "positive" : r.position === "Above VA" ? "warning" : "negative"} />
        </HeatmapCell>
      ),
    },
    {
      key: "delta", label: "Delta",
      render: (r) => (
        <HeatmapCell value={formatLakhsCr(r.cumulativeDelta)} bgColor={getDirectionalBg(r.cumulativeDelta, 3e6)} textColor={r.cumulativeDelta >= 0 ? "hsl(var(--positive))" : "hsl(var(--negative))"} />
      ),
      sortValue: (r) => r.cumulativeDelta,
    },
    {
      key: "bigTrades", label: "Big Trades",
      render: (r) => <HeatmapCell value={r.bigTradeCount.toString()} bgColor={getIntensityBg(r.bigTradeCount, 40)} />,
      sortValue: (r) => r.bigTradeCount,
    },
  ];

  return (
    <HeatmapTable
      data={data}
      columns={columns}
      rowKey={(r) => r.symbol}
      defaultSortKey="bigTrades"
      title="Volume Profile Levels"
      subtitle="⚡ TBT Powered · Institutional S/R"
      maxHeight="500px"
    />
  );
}
