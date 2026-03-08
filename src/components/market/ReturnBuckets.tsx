import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getStocks } from "@/data/mockStocks";

export function ReturnBuckets() {
  const buckets = useMemo(() => {
    const stocks = getStocks().filter(s => s.sector !== "Index");
    const ranges = [
      { label: "<-4%", min: -Infinity, max: -4 },
      { label: "-4 to -2%", min: -4, max: -2 },
      { label: "-2 to -1%", min: -2, max: -1 },
      { label: "-1 to 0%", min: -1, max: 0 },
      { label: "0 to +1%", min: 0, max: 1 },
      { label: "+1 to +2%", min: 1, max: 2 },
      { label: "+2 to +4%", min: 2, max: 4 },
      { label: ">+4%", min: 4, max: Infinity },
    ];
    return ranges.map(r => ({
      range: r.label,
      count: stocks.filter(s => s.changePct >= r.min && s.changePct < r.max).length,
      positive: r.min >= 0,
    }));
  }, []);

  return (
    <div className="border border-border bg-card">
      <div className="px-3 py-2 border-b border-border">
        <h3 className="text-xs font-semibold">Return Buckets</h3>
        <span className="text-[10px] text-muted-foreground">Distribution of stock returns today</span>
      </div>
      <div className="p-3 h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={buckets} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <XAxis dataKey="range" tick={{ fontSize: 10, fill: "hsl(240, 10%, 46%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(240, 10%, 46%)" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(240, 17%, 7%)", border: "1px solid hsl(240, 29%, 14%)", borderRadius: 4, fontSize: 11 }}
              labelStyle={{ color: "hsl(240, 10%, 90%)" }}
              cursor={{ fill: "hsl(240, 17%, 12%)", opacity: 0.5 }}
            />
            <Bar dataKey="count" radius={[2, 2, 0, 0]}>
              {buckets.map((b, i) => (
                <Cell key={i} fill={b.positive ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)"} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
