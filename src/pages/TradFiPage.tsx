import { useMemo, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { PageLayout } from "@/components/layout/PageLayout";
import { TimeRangeSelector } from "@/components/shared/TimeRangeSelector";
import { generateTimeSeries, formatCompact } from "@/data/mockData";

const timeRanges = ["30d", "90d", "1y", "All"];

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded border border-border">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="text-xs font-semibold">{title}</h3>
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

const TradFiPage = () => {
  const [coin, setCoin] = useState<"BTC" | "ETH">("BTC");
  const [timeRange, setTimeRange] = useState("90d");

  const base = coin === "BTC" ? 96500 : 3420;
  const oiFutures = useMemo(() => generateTimeSeries(200, base * 200), [base]);
  const oiOptions = useMemo(() => generateTimeSeries(200, base * 80), [base]);
  const volFutures = useMemo(() => generateTimeSeries(200, base * 150), [base]);
  const basisData = useMemo(() => generateTimeSeries(200, 8).map((p) => ({ ...p, basis: 4 + Math.random() * 12 })), []);
  const premiumData = useMemo(() => generateTimeSeries(200, 1).map((p) => ({ ...p, premium: (Math.random() - 0.3) * 10 })), []);

  return (
    <PageLayout>
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-semibold">TradFi</h1>
          <div className="flex items-center gap-1">
            {(["BTC", "ETH"] as const).map((c) => (
              <button key={c} onClick={() => setCoin(c)}
                className={`px-3 py-1 text-xxs font-medium rounded transition-colors ${coin === c ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                {c}
              </button>
            ))}
          </div>
          <span className="text-xxs text-muted-foreground">CME · Updated daily ~10:30pm ET</span>
          <div className="ml-auto">
            <TimeRangeSelector ranges={timeRanges} selected={timeRange} onSelect={setTimeRange} />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <ChartCard title="CME Futures OI">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={oiFutures} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(240, 12%, 58%)" }} axisLine={{ stroke: "hsl(240, 21%, 15%)" }} tickLine={false} tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })} minTickGap={40} />
                <YAxis tick={{ fontSize: 9, fill: "hsl(240, 12%, 58%)" }} axisLine={false} tickLine={false} width={50} tickFormatter={(v) => "$" + formatCompact(v)} />
                <Tooltip contentStyle={tooltipStyle} labelFormatter={(v) => new Date(v).toLocaleString()} formatter={(v: number) => ["$" + formatCompact(v)]} />
                <Line type="monotone" dataKey="value" stroke="hsl(217, 91%, 60%)" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="CME Options OI">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={oiOptions} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(240, 12%, 58%)" }} axisLine={{ stroke: "hsl(240, 21%, 15%)" }} tickLine={false} tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })} minTickGap={40} />
                <YAxis tick={{ fontSize: 9, fill: "hsl(240, 12%, 58%)" }} axisLine={false} tickLine={false} width={50} tickFormatter={(v) => "$" + formatCompact(v)} />
                <Tooltip contentStyle={tooltipStyle} labelFormatter={(v) => new Date(v).toLocaleString()} formatter={(v: number) => ["$" + formatCompact(v)]} />
                <Line type="monotone" dataKey="value" stroke="hsl(142, 71%, 45%)" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="CME Futures Volume">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volFutures} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(240, 12%, 58%)" }} axisLine={{ stroke: "hsl(240, 21%, 15%)" }} tickLine={false} tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })} minTickGap={40} />
                <YAxis tick={{ fontSize: 9, fill: "hsl(240, 12%, 58%)" }} axisLine={false} tickLine={false} width={50} tickFormatter={(v) => "$" + formatCompact(v)} />
                <Tooltip contentStyle={tooltipStyle} labelFormatter={(v) => new Date(v).toLocaleString()} formatter={(v: number) => ["$" + formatCompact(v)]} />
                <Bar dataKey="value" fill="hsl(217, 91%, 60%)" fillOpacity={0.5} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Annualized Basis">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={basisData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(240, 12%, 58%)" }} axisLine={{ stroke: "hsl(240, 21%, 15%)" }} tickLine={false} tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })} minTickGap={40} />
                <YAxis tick={{ fontSize: 9, fill: "hsl(240, 12%, 58%)" }} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => v.toFixed(0) + "%"} />
                <Tooltip contentStyle={tooltipStyle} labelFormatter={(v) => new Date(v).toLocaleString()} formatter={(v: number) => [v.toFixed(2) + "%", "Basis"]} />
                <Line type="monotone" dataKey="basis" stroke="hsl(45, 93%, 47%)" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Grayscale Premium">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={premiumData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(240, 12%, 58%)" }} axisLine={{ stroke: "hsl(240, 21%, 15%)" }} tickLine={false} tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })} minTickGap={40} />
                <YAxis tick={{ fontSize: 9, fill: "hsl(240, 12%, 58%)" }} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => v.toFixed(0) + "%"} />
                <Tooltip contentStyle={tooltipStyle} labelFormatter={(v) => new Date(v).toLocaleString()} formatter={(v: number) => [v.toFixed(2) + "%", "Premium"]} />
                <Line type="monotone" dataKey="premium" stroke="hsl(270, 60%, 55%)" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </PageLayout>
  );
};

export default TradFiPage;
