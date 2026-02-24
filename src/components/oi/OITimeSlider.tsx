import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause } from "lucide-react";
import { getOISnapshots, OISnapshot } from "@/data/mockOISnapshots";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const tooltipStyle = { backgroundColor: "hsl(240, 17%, 7%)", border: "1px solid hsl(240, 29%, 14%)", borderRadius: "2px", fontSize: "11px" };

export function OITimeSlider() {
  const snapshots = getOISnapshots();
  const [index, setIndex] = useState(snapshots.length - 1);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const intervalRef = useRef<number | null>(null);

  const current = snapshots[index];

  const play = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setIndex(prev => {
        if (prev >= snapshots.length - 1) {
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000 / speed);
  }, [speed, snapshots.length]);

  useEffect(() => {
    if (playing) play();
    else if (intervalRef.current) clearInterval(intervalRef.current);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, play]);

  const chartData = current.strikes.map(s => ({
    strike: s.strike,
    callOI: s.callOI,
    putOI: s.putOI,
  }));

  return (
    <div className="bg-card border border-border">
      <div className="px-3 py-2 border-b border-border flex items-center gap-2">
        <span className="text-[11px] font-semibold">OI Battlefield — Time Replay</span>
        <span className="text-[10px] font-mono text-primary ml-auto">{current.time} IST</span>
      </div>
      <div className="p-2 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
            <XAxis dataKey="strike" tick={{ fontSize: 8, fill: "hsl(240, 12%, 46%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 8, fill: "hsl(240, 12%, 46%)" }} axisLine={false} tickLine={false} width={45} tickFormatter={v => (v / 1e5).toFixed(0) + "L"} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [(v / 1e5).toFixed(1) + "L"]} />
            <ReferenceLine y={0} stroke="hsl(240, 29%, 14%)" />
            <Bar dataKey="callOI" fill="hsl(0, 70%, 55%)" fillOpacity={0.5} name="Call OI" />
            <Bar dataKey="putOI" fill="hsl(142, 60%, 45%)" fillOpacity={0.5} name="Put OI" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Slider controls */}
      <div className="px-3 py-2 border-t border-border flex items-center gap-3">
        <button
          onClick={() => setPlaying(!playing)}
          className="p-1 rounded bg-secondary hover:bg-surface-hover transition-colors"
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
        <span className="text-[10px] font-mono text-muted-foreground w-12">{snapshots[0]?.time}</span>
        <input
          type="range"
          min={0}
          max={snapshots.length - 1}
          value={index}
          onChange={e => { setIndex(+e.target.value); setPlaying(false); }}
          className="flex-1 h-1 accent-primary cursor-pointer"
        />
        <span className="text-[10px] font-mono text-muted-foreground w-12 text-right">{snapshots[snapshots.length - 1]?.time}</span>
        <select
          value={speed}
          onChange={e => setSpeed(+e.target.value)}
          className="bg-secondary text-[10px] px-1.5 py-0.5 rounded border-none outline-none text-foreground"
        >
          <option value={1}>1x</option>
          <option value={5}>5x</option>
          <option value={10}>10x</option>
          <option value={30}>30x</option>
        </select>
      </div>
    </div>
  );
}
