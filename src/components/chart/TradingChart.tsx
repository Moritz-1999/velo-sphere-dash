import { useMemo, useState } from "react";
import {
  ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Area,
} from "recharts";
import { generateTimeSeries, formatCompact } from "@/data/mockData";
import { TimeRangeSelector } from "@/components/shared/TimeRangeSelector";

interface TradingChartProps {
  coin: string;
}

const timeframes = ["1m", "5m", "15m", "1h", "4h", "1d", "1w"];

export function TradingChart({ coin }: TradingChartProps) {
  const [timeframe, setTimeframe] = useState("1h");
  const [showOI, setShowOI] = useState(true);
  const [showVolume, setShowVolume] = useState(true);

  const priceData = useMemo(() => {
    const base = coin === "BTC" ? 96500 : coin === "ETH" ? 3420 : 100;
    return generateTimeSeries(200, base).map((p, i, arr) => ({
      ...p,
      open: p.value * (1 + (Math.random() - 0.5) * 0.005),
      high: p.value * (1 + Math.random() * 0.008),
      low: p.value * (1 - Math.random() * 0.008),
      close: p.value,
      volume: Math.abs(p.binance || 0) + Math.abs(p.bybit || 0),
      oi: (p.binance || 0) * 0.4 + base * 1e4,
    }));
  }, [coin]);

  const indicators = [
    { label: "OI", active: showOI, toggle: () => setShowOI(!showOI) },
    { label: "Volume", active: showVolume, toggle: () => setShowVolume(!showVolume) },
  ];

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold font-mono">{coin}/USDT</span>
          <span className="text-xs text-muted-foreground">Perpetual</span>
        </div>
        <TimeRangeSelector ranges={timeframes} selected={timeframe} onSelect={setTimeframe} />
      </div>

      {/* Main chart */}
      <div className="flex-1 min-h-0 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={priceData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis
              dataKey="time"
              tick={{ fontSize: 9, fill: "hsl(240, 12%, 58%)" }}
              axisLine={{ stroke: "hsl(240, 21%, 15%)" }}
              tickLine={false}
              tickFormatter={(v) => {
                const d = new Date(v);
                return d.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" });
              }}
              minTickGap={60}
            />
            <YAxis
              yAxisId="price"
              orientation="right"
              tick={{ fontSize: 9, fill: "hsl(240, 12%, 58%)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => "$" + formatCompact(v)}
              width={60}
              domain={["auto", "auto"]}
            />
            {showVolume && (
              <YAxis
                yAxisId="volume"
                orientation="left"
                tick={{ fontSize: 9, fill: "hsl(240, 12%, 58%)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatCompact(v)}
                width={50}
                domain={[0, "auto"]}
              />
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(240, 17%, 10%)",
                border: "1px solid hsl(240, 21%, 15%)",
                borderRadius: "4px",
                fontSize: "11px",
              }}
              labelFormatter={(v) => new Date(v).toLocaleString()}
              formatter={(value: number, name: string) => {
                if (name === "volume") return ["$" + formatCompact(value), "Volume"];
                return ["$" + formatCompact(value), name];
              }}
            />
            {showVolume && (
              <Bar dataKey="volume" yAxisId="volume" fill="hsl(217, 91%, 60%)" fillOpacity={0.15} />
            )}
            <Area
              type="monotone"
              dataKey="close"
              yAxisId="price"
              stroke="hsl(217, 91%, 60%)"
              fill="hsl(217, 91%, 60%)"
              fillOpacity={0.05}
              strokeWidth={1.5}
              dot={false}
            />
            {showOI && (
              <Line
                type="monotone"
                dataKey="oi"
                yAxisId="volume"
                stroke="hsl(45, 93%, 47%)"
                strokeWidth={1}
                dot={false}
                strokeOpacity={0.6}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Indicator toggles */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-t border-border">
        {indicators.map((ind) => (
          <button
            key={ind.label}
            onClick={ind.toggle}
            className={`px-2 py-0.5 text-xxs font-medium rounded transition-colors ${
              ind.active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {ind.label}
          </button>
        ))}
        {["Funding", "Liquidations", "CVD", "Premium"].map((label) => (
          <button
            key={label}
            className="px-2 py-0.5 text-xxs font-medium rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
