import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const tooltipStyle = { backgroundColor: "hsl(240, 17%, 7%)", border: "1px solid hsl(240, 29%, 14%)", borderRadius: "2px", fontSize: "11px" };

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

export function BreadthChart() {
  const data = useMemo(() => {
    const rand = seededRandom(888);
    const points = [];
    let val = 55;
    const now = new Date();
    for (let i = 125; i >= 0; i--) {
      val += (rand() - 0.48) * 3;
      val = Math.max(25, Math.min(80, val));
      const d = new Date(now.getTime() - i * 86400000);
      if (d.getDay() === 0 || d.getDay() === 6) continue;
      points.push({
        date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        value: Math.round(val * 10) / 10,
      });
    }
    return points;
  }, []);

  const currentVal = data[data.length - 1]?.value ?? 0;

  return (
    <div className="bg-card border border-border">
      <div className="px-3 py-2 border-b border-border flex items-center justify-between">
        <span className="text-[11px] font-semibold">% Stocks Above 200 DMA — Last 6 Months</span>
        <span className={`text-[11px] font-mono font-semibold ${currentVal >= 50 ? "text-positive" : "text-negative"}`}>
          {currentVal}%
        </span>
      </div>
      <div className="p-2 h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
            <XAxis dataKey="date" tick={{ fontSize: 8, fill: "hsl(240, 12%, 46%)" }} axisLine={false} tickLine={false} minTickGap={40} />
            <YAxis domain={[20, 80]} tick={{ fontSize: 8, fill: "hsl(240, 12%, 46%)" }} axisLine={false} tickLine={false} width={30} tickFormatter={v => `${v}%`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`]} />
            <ReferenceLine y={60} stroke="hsl(var(--positive))" strokeDasharray="4 4" strokeOpacity={0.4} label={{ value: "Healthy", position: "right", fontSize: 8, fill: "hsl(var(--positive))" }} />
            <ReferenceLine y={40} stroke="hsl(var(--negative))" strokeDasharray="4 4" strokeOpacity={0.4} label={{ value: "Weak", position: "right", fontSize: 8, fill: "hsl(var(--negative))" }} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={currentVal >= 50 ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)"}
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
