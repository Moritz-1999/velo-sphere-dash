import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { generateTimeSeries, EXCHANGE_COLORS, formatCompact } from "@/data/mockData";
import { TimeRangeSelector } from "@/components/shared/TimeRangeSelector";
import { ExchangeLegend } from "@/components/shared/ExchangeLegend";

const timeRanges = ["1d", "7d", "30d", "90d", "1y"];

export function MarketVolume() {
  const [timeRange, setTimeRange] = useState("7d");
  const data = useMemo(() => {
    const pointsMap: Record<string, number> = { "1d": 24, "7d": 168, "30d": 200, "90d": 200, "1y": 200 };
    return generateTimeSeries(pointsMap[timeRange] || 168, 5e9);
  }, [timeRange]);

  return (
    <div className="bg-card rounded border border-border">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="text-xs font-semibold">Market Volume</h3>
        <div className="flex items-center gap-4">
          <ExchangeLegend />
          <TimeRangeSelector ranges={timeRanges} selected={timeRange} onSelect={setTimeRange} />
        </div>
      </div>
      <div className="p-3 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis
              dataKey="time"
              tick={{ fontSize: 9, fill: "hsl(240, 12%, 58%)" }}
              axisLine={{ stroke: "hsl(240, 21%, 15%)" }}
              tickLine={false}
              tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })}
              minTickGap={40}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "hsl(240, 12%, 58%)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => "$" + formatCompact(v)}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(240, 17%, 10%)",
                border: "1px solid hsl(240, 21%, 15%)",
                borderRadius: "4px",
                fontSize: "11px",
              }}
              labelFormatter={(v) => new Date(v).toLocaleString()}
              formatter={(value: number) => ["$" + formatCompact(value)]}
            />
            <Area type="monotone" dataKey="binance" stackId="1" stroke={EXCHANGE_COLORS.binance} fill={EXCHANGE_COLORS.binance} fillOpacity={0.6} />
            <Area type="monotone" dataKey="bybit" stackId="1" stroke={EXCHANGE_COLORS.bybit} fill={EXCHANGE_COLORS.bybit} fillOpacity={0.6} />
            <Area type="monotone" dataKey="okx" stackId="1" stroke={EXCHANGE_COLORS.okx} fill={EXCHANGE_COLORS.okx} fillOpacity={0.6} />
            <Area type="monotone" dataKey="deribit" stackId="1" stroke={EXCHANGE_COLORS.deribit} fill={EXCHANGE_COLORS.deribit} fillOpacity={0.6} />
            <Area type="monotone" dataKey="others" stackId="1" stroke={EXCHANGE_COLORS.others} fill={EXCHANGE_COLORS.others} fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
