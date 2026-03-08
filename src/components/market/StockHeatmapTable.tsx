import { useState, useEffect, useCallback } from "react";
import { HeatmapTable, HeatmapColumn } from "@/components/shared/HeatmapTable";
import { HeatmapCell } from "@/components/shared/HeatmapCell";
import { getStocks, StockData } from "@/data/mockStocks";
import { getDirectionalBg, getIntensityBg, getPCRBg, getDeliveryBg, getCellTextColor } from "@/lib/heatmapColors";
import { formatPrice, formatPercent, formatVolume } from "@/lib/formatters";

function tickStock(s: StockData): StockData {
  const priceDelta = (Math.random() - 0.48) * s.ltp * 0.0015;
  const newLtp = s.ltp + priceDelta;
  const newChange = s.change + priceDelta;
  const newChangePct = (newChange / (s.ltp - s.change)) * 100;
  return {
    ...s,
    ltp: newLtp,
    change: newChange,
    changePct: newChangePct,
    oi: s.oi + (Math.random() - 0.5) * s.oi * 0.002,
    oiChangePct: s.oiChangePct + (Math.random() - 0.5) * 0.08,
    iv: Math.max(5, s.iv + (Math.random() - 0.5) * 0.3),
    pcr: Math.max(0.1, s.pcr + (Math.random() - 0.5) * 0.015),
    volume: s.volume + Math.floor(Math.random() * s.volume * 0.003),
  };
}

export function StockHeatmapTable() {
  const [stocks, setStocks] = useState(() => getStocks().filter(s => s.sector !== "Index"));

  useEffect(() => {
    const timer = setInterval(() => {
      setStocks(prev => prev.map(tickStock));
    }, 800);
    return () => clearInterval(timer);
  }, []);

  const columns: HeatmapColumn<StockData>[] = [
    {
      key: "symbol", label: "Symbol", width: "110px", headerAlign: "left",
      render: (r) => (
        <HeatmapCell value="" align="left" mono={false}>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: r.sectorColor }} />
            <span className="text-foreground font-medium text-xs">{r.symbol}</span>
          </span>
        </HeatmapCell>
      ),
    },
    {
      key: "ltp", label: "LTP",
      render: (r) => <HeatmapCell value={`₹${formatPrice(r.ltp)}`} />,
      sortValue: (r) => r.ltp,
    },
    {
      key: "changePct", label: "% Change",
      render: (r) => (
        <HeatmapCell value={formatPercent(r.changePct)} bgColor={getDirectionalBg(r.changePct, 4)} textColor={getCellTextColor(r.changePct)} />
      ),
      sortValue: (r) => r.changePct,
    },
    {
      key: "oiChangePct", label: "OI Δ%",
      render: (r) => (
        <HeatmapCell value={formatPercent(r.oiChangePct)} bgColor={getDirectionalBg(r.oiChangePct, 8)} textColor={getCellTextColor(r.oiChangePct)} />
      ),
      sortValue: (r) => r.oiChangePct,
    },
    {
      key: "iv", label: "IV",
      render: (r) => <HeatmapCell value={r.iv.toFixed(1)} bgColor={getIntensityBg(r.iv, 35)} />,
      sortValue: (r) => r.iv,
    },
    {
      key: "pcr", label: "PCR",
      render: (r) => <HeatmapCell value={r.pcr.toFixed(2)} bgColor={getPCRBg(r.pcr)} />,
      sortValue: (r) => r.pcr,
    },
    {
      key: "deliveryPct", label: "Del%",
      render: (r) => <HeatmapCell value={`${r.deliveryPct.toFixed(0)}%`} bgColor={getDeliveryBg(r.deliveryPct)} />,
      sortValue: (r) => r.deliveryPct,
    },
    {
      key: "volume", label: "Volume",
      render: (r) => <HeatmapCell value={formatVolume(r.volume)} bgColor={getIntensityBg(r.volume / 1e9, 5)} />,
      sortValue: (r) => r.volume,
    },
  ];

  return (
    <HeatmapTable
      data={stocks}
      columns={columns}
      rowKey={(r) => r.symbol}
      defaultSortKey="changePct"
      title="Stock Heatmap"
      subtitle={`${stocks.length} F&O stocks`}
      maxHeight="500px"
    />
  );
}
