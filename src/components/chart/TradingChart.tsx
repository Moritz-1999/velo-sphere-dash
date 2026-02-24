import { useMemo, useState } from "react";
import {
  ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Area,
} from "recharts";
import { generateTimeSeries } from "@/data/mockStocks";
import { formatINR, formatQty } from "@/lib/formatters";
import { TimeRangeSelector } from "@/components/shared/TimeRangeSelector";
import { getStocks } from "@/data/mockStocks";

interface TradingChartProps {
  coin: string;
}

const timeframes = ["1m", "5m", "15m", "1h", "4h", "1D"];

export function TradingChart({ coin }: TradingChartProps) {
  const [timeframe, setTimeframe] = useState("15m");
  const [showOI, setShowOI] = useState(true);
  const [showVolume, setShowVolume] = useState(true);

  const stock = useMemo(() => getStocks().find(s => s.symbol === coin), [coin]);
  const basePrice = stock?.ltp || 22450;

  const priceData = useMemo(() => {
    return generateTimeSeries(200, basePrice).map(p => ({
      ...p,
      open: p.value * (1 + (Math.random() - 0.5) * 0.003),
      high: p.value * (1 + Math.random() * 0.005),
      low: p.value * (1 - Math.random() * 0.005),
      close: p.value,
      volume: Math.abs(p.cashVolume || 0) + Math.abs(p.foVolume || 0),
      oi: (p.indexFutures || 0) * 10 + basePrice * 1e3,
    }));
  }, [coin, basePrice]);

  const changePct = stock?.changePct || 0;
  const change = stock?.change || 0;

  const indicators = [
    { label: "OI", active: showOI, toggle: () => setShowOI(!showOI) },
    { label: "Volume", active: showVolume, toggle: () => setShowVolume(!showVolume) },
  ];

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold font-mono">{coin}</span>
          <span className="text-lg font-mono font-semibold">₹{basePrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          <span className={`text-xs font-mono ${changePct >= 0 ? "text-positive" : "text-negative"}`}>
            {change >= 0 ? "+" : ""}{change.toFixed(2)} ({changePct >= 0 ? "+" : ""}{changePct.toFixed(2)}%)
          </span>
        </div>
        <TimeRangeSelector ranges={timeframes} selected={timeframe} onSelect={setTimeframe} />
      </div>

      <div className="flex-1 min-h-0 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={priceData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(240, 12%, 46%)" }} axisLine={{ stroke: "hsl(240, 29%, 14%)" }} tickLine={false}
              tickFormatter={v => new Date(v).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })} minTickGap={60} />
            <YAxis yAxisId="price" orientation="right" tick={{ fontSize: 9, fill: "hsl(240, 12%, 46%)" }} axisLine={false} tickLine={false}
              tickFormatter={v => "₹" + formatQty(v)} width={60} domain={["auto", "auto"]} />
            {showVolume && (
              <YAxis yAxisId="volume" orientation="left" tick={{ fontSize: 9, fill: "hsl(240, 12%, 46%)" }} axisLine={false} tickLine={false}
                tickFormatter={v => formatQty(v)} width={50} domain={[0, "auto"]} />
            )}
            <Tooltip contentStyle={{ backgroundColor: "hsl(240, 17%, 7%)", border: "1px solid hsl(240, 29%, 14%)", borderRadius: "2px", fontSize: "11px" }}
              labelFormatter={v => new Date(v).toLocaleString()} />
            {showVolume && <Bar dataKey="volume" yAxisId="volume" fill="hsl(217, 91%, 60%)" fillOpacity={0.15} />}
            <Area type="monotone" dataKey="close" yAxisId="price" stroke="hsl(217, 91%, 60%)" fill="hsl(217, 91%, 60%)" fillOpacity={0.05} strokeWidth={1.5} dot={false} />
            {showOI && <Line type="monotone" dataKey="oi" yAxisId="volume" stroke="hsl(38, 92%, 50%)" strokeWidth={1} dot={false} strokeOpacity={0.6} />}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-1 px-3 py-1.5 border-t border-border">
        {indicators.map(ind => (
          <button key={ind.label} onClick={ind.toggle}
            className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${ind.active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
            {ind.label}
          </button>
        ))}
        {["CVD", "VWAP", "VIX", "Funding", "Tape Speed"].map(l => (
          <button key={l} className="px-2 py-0.5 text-[10px] font-medium rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">{l}</button>
        ))}
      </div>
    </div>
  );
}
