import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getCoins } from "@/data/mockData";
import { TimeRangeSelector } from "@/components/shared/TimeRangeSelector";

interface Bucket {
  range: string;
  count: number;
  coins: string[];
  midpoint: number;
}

const timeRanges = ["1h", "4h", "24h", "7d"];

export function ReturnBuckets() {
  const [timeRange, setTimeRange] = useState("24h");
  const coins = useMemo(() => getCoins(), []);

  const buckets = useMemo(() => {
    const keyMap: Record<string, "change1h" | "change4h" | "change24h" | "change7d"> = {
      "1h": "change1h", "4h": "change4h", "24h": "change24h", "7d": "change7d",
    };
    const key = keyMap[timeRange];
    const ranges = [-10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10];
    const result: Bucket[] = [];

    for (let i = 0; i < ranges.length - 1; i++) {
      const low = ranges[i];
      const high = ranges[i + 1];
      const matching = coins.filter((c) => c[key] >= low && c[key] < high);
      result.push({
        range: `${low}% to ${high}%`,
        count: matching.length,
        coins: matching.map((c) => c.symbol),
        midpoint: (low + high) / 2,
      });
    }
    return result;
  }, [coins, timeRange]);

  return (
    <div className="bg-card rounded border border-border">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="text-xs font-semibold">Return Distribution</h3>
        <TimeRangeSelector ranges={timeRanges} selected={timeRange} onSelect={setTimeRange} />
      </div>
      <div className="p-3 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={buckets} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis
              dataKey="range"
              tick={{ fontSize: 9, fill: "hsl(240, 12%, 58%)" }}
              axisLine={{ stroke: "hsl(240, 21%, 15%)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "hsl(240, 12%, 58%)" }}
              axisLine={false}
              tickLine={false}
              width={25}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(240, 17%, 10%)",
                border: "1px solid hsl(240, 21%, 15%)",
                borderRadius: "4px",
                fontSize: "11px",
              }}
              labelStyle={{ color: "white" }}
              formatter={(value: number, _name: string, props: any) => [
                `${value} coins: ${props.payload.coins.join(", ")}`,
                "Count",
              ]}
            />
            <Bar dataKey="count" radius={[2, 2, 0, 0]}>
              {buckets.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.midpoint >= 0 ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)"}
                  fillOpacity={0.7}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
