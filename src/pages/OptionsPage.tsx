import { useMemo, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { PageLayout } from "@/components/layout/PageLayout";
import { TimeRangeSelector } from "@/components/shared/TimeRangeSelector";
import { generateTimeSeries, generateFundingSeries, formatCompact } from "@/data/mockData";

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

const tooltipStyle = {
  backgroundColor: "hsl(240, 17%, 10%)",
  border: "1px solid hsl(240, 21%, 15%)",
  borderRadius: "4px",
  fontSize: "11px",
};

const OptionsPage = () => {
  const [coin, setCoin] = useState<"BTC" | "ETH">("BTC");
  const [timeRange, setTimeRange] = useState("30d");

  const dvolData = useMemo(() => generateFundingSeries(200).map((p) => ({
    ...p,
    dvol: 40 + Math.random() * 40,
    rv30: 30 + Math.random() * 35,
  })), []);

  const volumeData = useMemo(() => generateTimeSeries(200, 500e6).map((p) => ({
    ...p,
    calls: Math.abs(p.binance || 0),
    puts: Math.abs(p.bybit || 0),
  })), []);

  return (
    <PageLayout>
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-semibold">Options</h1>
          <div className="flex items-center gap-1">
            {(["BTC", "ETH"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCoin(c)}
                className={`px-3 py-1 text-xxs font-medium rounded transition-colors ${
                  coin === c ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <span className="text-xxs text-muted-foreground">Deribit Only</span>
          <div className="ml-auto">
            <TimeRangeSelector ranges={timeRanges} selected={timeRange} onSelect={setTimeRange} />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* DVOL */}
          <ChartCard title="DVOL — Implied Volatility Index">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dvolData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(240, 12%, 58%)" }} axisLine={{ stroke: "hsl(240, 21%, 15%)" }} tickLine={false} tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })} minTickGap={40} />
                <YAxis tick={{ fontSize: 9, fill: "hsl(240, 12%, 58%)" }} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => v.toFixed(0) + "%"} />
                <Tooltip contentStyle={tooltipStyle} labelFormatter={(v) => new Date(v).toLocaleString()} />
                <Line type="monotone" dataKey="dvol" stroke="hsl(217, 91%, 60%)" strokeWidth={1.5} dot={false} name="DVOL" />
                <Line type="monotone" dataKey="rv30" stroke="hsl(45, 93%, 47%)" strokeWidth={1} dot={false} name="RV 30d" strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Options Volume */}
          <ChartCard title="Options Volume">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(240, 12%, 58%)" }} axisLine={{ stroke: "hsl(240, 21%, 15%)" }} tickLine={false} tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })} minTickGap={40} />
                <YAxis tick={{ fontSize: 9, fill: "hsl(240, 12%, 58%)" }} axisLine={false} tickLine={false} width={50} tickFormatter={(v) => "$" + formatCompact(v)} />
                <Tooltip contentStyle={tooltipStyle} labelFormatter={(v) => new Date(v).toLocaleString()} formatter={(v: number) => ["$" + formatCompact(v)]} />
                <Bar dataKey="calls" stackId="1" fill="hsl(142, 71%, 45%)" fillOpacity={0.6} name="Calls" />
                <Bar dataKey="puts" stackId="1" fill="hsl(0, 84%, 60%)" fillOpacity={0.6} name="Puts" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Greeks placeholder */}
          <ChartCard title="Traded Delta">
            <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
              Delta chart — Greeks data visualization
            </div>
          </ChartCard>

          {/* RV Spread */}
          <ChartCard title="Realized Volatility Spread">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dvolData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(240, 12%, 58%)" }} axisLine={{ stroke: "hsl(240, 21%, 15%)" }} tickLine={false} tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })} minTickGap={40} />
                <YAxis tick={{ fontSize: 9, fill: "hsl(240, 12%, 58%)" }} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => v.toFixed(0) + "%"} />
                <Tooltip contentStyle={tooltipStyle} labelFormatter={(v) => new Date(v).toLocaleString()} />
                <Line type="monotone" dataKey="dvol" stroke="hsl(270, 60%, 55%)" strokeWidth={1.5} dot={false} name="IV" />
                <Line type="monotone" dataKey="rv30" stroke="hsl(142, 71%, 45%)" strokeWidth={1.5} dot={false} name="RV" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </PageLayout>
  );
};

export default OptionsPage;
