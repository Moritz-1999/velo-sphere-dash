import { useMemo } from "react";
import { HeatmapTable, HeatmapColumn } from "@/components/shared/HeatmapTable";
import { HeatmapCell } from "@/components/shared/HeatmapCell";
import { getSectors, SectorData } from "@/data/mockSectors";
import { getDirectionalBg, getIntensityBg, getDMABg, getCellTextColor } from "@/lib/heatmapColors";
import { formatLakhsCr, formatPercent } from "@/lib/formatters";

export function SectorFlowTable() {
  const sectors = useMemo(() => getSectors(), []);

  const columns: HeatmapColumn<SectorData>[] = [
    {
      key: "name", label: "Sector", width: "140px", headerAlign: "left",
      render: (r) => <HeatmapCell value={r.name} align="left" mono={false} />,
      sortValue: undefined,
    },
    {
      key: "changePct", label: "% Change",
      render: (r) => (
        <HeatmapCell value={formatPercent(r.changePct)} bgColor={getDirectionalBg(r.changePct, 3)} textColor={getCellTextColor(r.changePct)} />
      ),
      sortValue: (r) => r.changePct,
    },
    {
      key: "fiiFlow", label: "FII Flow",
      render: (r) => (
        <HeatmapCell value={formatLakhsCr(r.fiiFlow)} bgColor={getDirectionalBg(r.fiiFlow, 5e7)} textColor={getCellTextColor(r.fiiFlow)} />
      ),
      sortValue: (r) => r.fiiFlow,
    },
    {
      key: "diiFlow", label: "DII Flow",
      render: (r) => (
        <HeatmapCell value={formatLakhsCr(r.diiFlow)} bgColor={getDirectionalBg(r.diiFlow, 5e7)} textColor={getCellTextColor(r.diiFlow)} />
      ),
      sortValue: (r) => r.diiFlow,
    },
    {
      key: "ad", label: "A/D",
      render: (r) => {
        const net = r.advances - r.declines;
        return <HeatmapCell value={`${r.advances}/${r.declines}`} bgColor={getDirectionalBg(net, 20)} textColor={getCellTextColor(net)} />;
      },
      sortValue: (r) => r.advances - r.declines,
    },
    {
      key: "dma20", label: "% > 20 DMA",
      render: (r) => <HeatmapCell value={`${r.pctAbove20DMA.toFixed(0)}%`} bgColor={getDMABg(r.pctAbove20DMA)} />,
      sortValue: (r) => r.pctAbove20DMA,
    },
    {
      key: "dma200", label: "% > 200 DMA",
      render: (r) => <HeatmapCell value={`${r.pctAbove200DMA.toFixed(0)}%`} bgColor={getDMABg(r.pctAbove200DMA)} />,
      sortValue: (r) => r.pctAbove200DMA,
    },
    {
      key: "avgIV", label: "Avg IV",
      render: (r) => <HeatmapCell value={r.avgIV.toFixed(1)} bgColor={getIntensityBg(r.avgIV, 35)} />,
      sortValue: (r) => r.avgIV,
    },
    {
      key: "oiChangePct", label: "OI Δ%",
      render: (r) => (
        <HeatmapCell value={formatPercent(r.oiChangePct)} bgColor={getDirectionalBg(r.oiChangePct, 6)} textColor={getCellTextColor(r.oiChangePct)} />
      ),
      sortValue: (r) => r.oiChangePct,
    },
  ];

  return (
    <HeatmapTable
      data={sectors}
      columns={columns}
      rowKey={(r) => r.name}
      defaultSortKey="changePct"
      title="Sector Flow"
      subtitle="14 sectors · Real-time"
      maxHeight="600px"
    />
  );
}
