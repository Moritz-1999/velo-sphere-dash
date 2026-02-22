import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { generateTimeSeries } from "@/data/mockStocks";

export function TotalOI() {
  const data = useMemo(() => generateTimeSeries(100, 8000).map(p => ({
    time: new Date(p.time).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    indexOpt: (p.indexOptions || 0) / 1e7,
    stockOpt: (p.stockOptions || 0) / 1e7,
    indexFut: (p.indexFutures || 0) / 1e7,
    stockFut: (p.stockFutures || 0) / 1e7,
  })), []);

  return (
    <div className="border border-border bg-card">
      <div className="px-3 py-2 border-b border-border">
        <h3 className="text-xs font-semibold">Total Open Interest</h3>
        <span className="text-[10px] text-muted-foreground">By segment · ₹ Cr</span>
      </div>
      <div className="p-3 h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
            <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(240, 10%, 46%)" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 9, fill: "hsl(240, 10%, 46%)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(240, 17%, 8%)", border: "1px solid hsl(240, 29%, 14%)", borderRadius: 4, fontSize: 11 }} />
            <Area type="monotone" dataKey="indexOpt" stackId="1" fill="hsl(217, 91%, 60%)" fillOpacity={0.3} stroke="hsl(217, 91%, 60%)" strokeWidth={1} name="Index Options" />
            <Area type="monotone" dataKey="stockOpt" stackId="1" fill="hsl(239, 84%, 67%)" fillOpacity={0.25} stroke="hsl(239, 84%, 67%)" strokeWidth={1} name="Stock Options" />
            <Area type="monotone" dataKey="indexFut" stackId="1" fill="hsl(142, 71%, 45%)" fillOpacity={0.2} stroke="hsl(142, 71%, 45%)" strokeWidth={1} name="Index Futures" />
            <Area type="monotone" dataKey="stockFut" stackId="1" fill="hsl(38, 92%, 50%)" fillOpacity={0.2} stroke="hsl(38, 92%, 50%)" strokeWidth={1} name="Stock Futures" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
