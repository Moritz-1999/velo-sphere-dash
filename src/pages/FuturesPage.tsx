import { useMemo, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { PageLayout } from "@/components/layout/PageLayout";
import { TimeRangeSelector } from "@/components/shared/TimeRangeSelector";
import { ExchangeLegend } from "@/components/shared/ExchangeLegend";
import {
  generateTimeSeries, generateFundingSeries, generateLiquidations,
  generateHourlyReturns, generateDailyReturns, generateExchangeBreakdown,
  EXCHANGE_COLORS, formatCompact, getCoins,
} from "@/data/mockData";

const coins = getCoins();
const coinOptions = coins.slice(0, 20).map((c) => c.symbol);
const timeRanges = ["1d", "7d", "30d", "90d", "1y"];

function ChartCard({ title, children, extra }: { title: string; children: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div className="bg-card rounded border border-border">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="text-xs font-semibold">{title}</h3>
        {extra}
      </div>
      <div className="p-3 h-[260px]">{children}</div>
    </div>
  );
}

const FuturesPage = () => {
  const [coin, setCoin] = useState("BTC");
  const [timeRange, setTimeRange] = useState("7d");

  const basePrice = useMemo(() => coins.find((c) => c.symbol === coin)?.price || 100, [coin]);
  const volumeData = useMemo(() => generateTimeSeries(168, basePrice * 1e5), [basePrice]);
  const oiData = useMemo(() => generateTimeSeries(168, basePrice * 5e4), [basePrice]);
  const fundingData = useMemo(() => generateFundingSeries(168), []);
  const liqData = useMemo(() => generateLiquidations(168), []);
  const hourlyReturns = useMemo(() => generateHourlyReturns(), []);
  const dailyReturns = useMemo(() => generateDailyReturns(), []);

  const volBreakdown = useMemo(() => {
    const total = basePrice * 1e8;
    const bd = generateExchangeBreakdown(total);
    return Object.entries(bd).map(([exchange, value]) => ({ exchange, value }));
  }, [basePrice]);

  const oiBreakdown = useMemo(() => {
    const total = basePrice * 4e7;
    const bd = generateExchangeBreakdown(total);
    return Object.entries(bd).map(([exchange, value]) => ({ exchange, value }));
  }, [basePrice]);

  const tooltipStyle = {
    backgroundColor: "hsl(240, 17%, 10%)",
    border: "1px solid hsl(240, 21%, 15%)",
    borderRadius: "4px",
    fontSize: "11px",
  };

  const cursorStyle = { fill: "hsl(240, 17%, 12%)", fillOpacity: 0.4 };
  const lineCursorStyle = { stroke: "hsl(240, 29%, 14%)" };

  const xAxisProps = {
    tick: { fontSize: 9, fill: "hsl(240, 12%, 58%)" },
    axisLine: { stroke: "hsl(240, 21%, 15%)" },
    tickLine: false as const,
  };

  const yAxisProps = {
    tick: { fontSize: 9, fill: "hsl(240, 12%, 58%)" },
    axisLine: false as const,
    tickLine: false as const,
    width: 50,
  };

  return (
    <PageLayout>
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-semibold">Futures</h1>
          <div className="flex items-center gap-1">
            {coinOptions.slice(0, 10).map((c) => (
              <button
                key={c}
                onClick={() => setCoin(c)}
                className={`px-2 py-0.5 text-xxs font-medium rounded transition-colors ${
                  coin === c ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="ml-auto">
            <TimeRangeSelector ranges={timeRanges} selected={timeRange} onSelect={setTimeRange} />
          </div>
        </div>

        <ExchangeLegend />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* 24h Volume Breakdown */}
          <ChartCard title="24h Volume">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volBreakdown} layout="vertical" margin={{ left: 10, right: 10 }}>
                <XAxis type="number" {...xAxisProps} tickFormatter={(v) => "$" + formatCompact(v)} />
                <YAxis type="category" dataKey="exchange" {...yAxisProps} width={60} tick={{ fontSize: 10, fill: "hsl(240, 12%, 58%)" }} />
                <Tooltip contentStyle={tooltipStyle} cursor={cursorStyle} formatter={(v: number) => ["$" + formatCompact(v)]} />
                <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                  {volBreakdown.map((entry) => (
                    <Cell key={entry.exchange} fill={EXCHANGE_COLORS[entry.exchange as keyof typeof EXCHANGE_COLORS]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* OI Snapshot */}
          <ChartCard title="Open Interest Snapshot">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={oiBreakdown} layout="vertical" margin={{ left: 10, right: 10 }}>
                <XAxis type="number" {...xAxisProps} tickFormatter={(v) => "$" + formatCompact(v)} />
                <YAxis type="category" dataKey="exchange" {...yAxisProps} width={60} tick={{ fontSize: 10, fill: "hsl(240, 12%, 58%)" }} />
                <Tooltip contentStyle={tooltipStyle} cursor={cursorStyle} formatter={(v: number) => ["$" + formatCompact(v)]} />
                <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                  {oiBreakdown.map((entry) => (
                    <Cell key={entry.exchange} fill={EXCHANGE_COLORS[entry.exchange as keyof typeof EXCHANGE_COLORS]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Funding */}
          <ChartCard title="Funding Rate">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fundingData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="time" {...xAxisProps} tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })} minTickGap={40} />
                <YAxis {...yAxisProps} tickFormatter={(v) => v.toFixed(3) + "%"} />
                <Tooltip contentStyle={tooltipStyle} cursor={lineCursorStyle} labelFormatter={(v) => new Date(v).toLocaleString()} />
                <Line type="monotone" dataKey="binance" stroke={EXCHANGE_COLORS.binance} strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="bybit" stroke={EXCHANGE_COLORS.bybit} strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="okx" stroke={EXCHANGE_COLORS.okx} strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="deribit" stroke={EXCHANGE_COLORS.deribit} strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Open Interest Time Series */}
          <ChartCard title="Open Interest">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={oiData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="time" {...xAxisProps} tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })} minTickGap={40} />
                <YAxis {...yAxisProps} tickFormatter={(v) => "$" + formatCompact(v)} />
                <Tooltip contentStyle={tooltipStyle} cursor={lineCursorStyle} labelFormatter={(v) => new Date(v).toLocaleString()} formatter={(v: number) => ["$" + formatCompact(v)]} />
                <Area type="monotone" dataKey="binance" stackId="1" stroke={EXCHANGE_COLORS.binance} fill={EXCHANGE_COLORS.binance} fillOpacity={0.5} />
                <Area type="monotone" dataKey="bybit" stackId="1" stroke={EXCHANGE_COLORS.bybit} fill={EXCHANGE_COLORS.bybit} fillOpacity={0.5} />
                <Area type="monotone" dataKey="okx" stackId="1" stroke={EXCHANGE_COLORS.okx} fill={EXCHANGE_COLORS.okx} fillOpacity={0.5} />
                <Area type="monotone" dataKey="deribit" stackId="1" stroke={EXCHANGE_COLORS.deribit} fill={EXCHANGE_COLORS.deribit} fillOpacity={0.5} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Liquidations */}
          <ChartCard title="Liquidations">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={liqData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="time" {...xAxisProps} tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })} minTickGap={40} />
                <YAxis {...yAxisProps} tickFormatter={(v) => "$" + formatCompact(Math.abs(v))} />
                <Tooltip contentStyle={tooltipStyle} cursor={cursorStyle} labelFormatter={(v) => new Date(v).toLocaleString()} formatter={(v: number) => ["$" + formatCompact(Math.abs(v))]} />
                <Bar dataKey="shortLiq" fill="hsl(0, 84%, 60%)" fillOpacity={0.7} />
                <Bar dataKey="longLiq" fill="hsl(142, 71%, 45%)" fillOpacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Volume Time Series */}
          <ChartCard title="Volume">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="time" {...xAxisProps} tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })} minTickGap={40} />
                <YAxis {...yAxisProps} tickFormatter={(v) => "$" + formatCompact(v)} />
                <Tooltip contentStyle={tooltipStyle} cursor={lineCursorStyle} labelFormatter={(v) => new Date(v).toLocaleString()} formatter={(v: number) => ["$" + formatCompact(v)]} />
                <Area type="monotone" dataKey="binance" stackId="1" stroke={EXCHANGE_COLORS.binance} fill={EXCHANGE_COLORS.binance} fillOpacity={0.5} />
                <Area type="monotone" dataKey="bybit" stackId="1" stroke={EXCHANGE_COLORS.bybit} fill={EXCHANGE_COLORS.bybit} fillOpacity={0.5} />
                <Area type="monotone" dataKey="okx" stackId="1" stroke={EXCHANGE_COLORS.okx} fill={EXCHANGE_COLORS.okx} fillOpacity={0.5} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Hourly Returns */}
          <ChartCard title="Average Hourly Returns">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyReturns} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="hour" {...xAxisProps} tickFormatter={(v) => `${v}:00`} />
                <YAxis {...yAxisProps} tickFormatter={(v) => v.toFixed(2) + "%"} />
                <Tooltip contentStyle={tooltipStyle} cursor={cursorStyle} formatter={(v: number) => [v.toFixed(3) + "%", "Avg Return"]} />
                <Bar dataKey="avgReturn" radius={[2, 2, 0, 0]}>
                  {hourlyReturns.map((entry, i) => (
                    <Cell key={i} fill={entry.avgReturn >= 0 ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)"} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Daily Returns */}
          <ChartCard title="Average Daily Returns">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyReturns} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="day" {...xAxisProps} />
                <YAxis {...yAxisProps} tickFormatter={(v) => v.toFixed(2) + "%"} />
                <Tooltip contentStyle={tooltipStyle} cursor={cursorStyle} formatter={(v: number) => [v.toFixed(3) + "%", "Avg Return"]} />
                <Bar dataKey="avgReturn" radius={[2, 2, 0, 0]}>
                  {dailyReturns.map((entry, i) => (
                    <Cell key={i} fill={entry.avgReturn >= 0 ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)"} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </PageLayout>
  );
};

export default FuturesPage;
