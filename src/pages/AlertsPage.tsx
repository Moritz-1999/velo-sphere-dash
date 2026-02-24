import { useState, useMemo } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { getBreadthData, getAlertTemplates, getActiveAlerts, getAlertTimeline } from "@/data/mockBreadth";
import { Sparkline } from "@/components/shared/Sparkline";
import { getDirectionalBg } from "@/lib/heatmapColors";
import { Bell, BellRing, BellOff, Clock, Plus, Volume2, VolumeX } from "lucide-react";
import { BreadthChart } from "@/components/alerts/BreadthChart";

function BreadthCard({ label, value, sub, trend, sparkData, barMode }: { label: string; value: string; sub?: string; trend?: "up" | "down"; sparkData?: number[]; barMode?: { up: number; down: number } }) {
  return (
    <div className="bg-card border border-border p-3">
      <div className="text-[10px] text-muted-foreground mb-1">{label}</div>
      <div className="text-lg font-mono font-semibold">{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground mt-0.5">
        {trend && <span className={trend === "up" ? "text-positive" : "text-negative"}>{trend === "up" ? "⬆" : "⬇"} vs yesterday</span>}
        {!trend && sub}
      </div>}
      {sparkData && <div className="mt-1"><Sparkline data={sparkData} width={100} height={20} /></div>}
      {barMode && (
        <div className="mt-2 flex items-center gap-1">
          <div className="flex-1 h-2 bg-surface rounded overflow-hidden flex">
            <div className="bg-positive/60 h-full" style={{ width: `${barMode.up}%` }} />
            <div className="bg-negative/60 h-full" style={{ width: `${barMode.down}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

const AlertsPage = () => {
  const breadth = useMemo(() => getBreadthData(), []);
  const templates = useMemo(() => getAlertTemplates(), []);
  const alerts = useMemo(() => getActiveAlerts(), []);
  const timeline = useMemo(() => getAlertTimeline(), []);
  const [templateStates, setTemplateStates] = useState<Record<string, boolean>>(() => {
    const s: Record<string, boolean> = {};
    templates.forEach(t => s[t.id] = t.enabled);
    return s;
  });
  const [soundEnabled, setSoundEnabled] = useState(true);

  const positiveCount = [
    breadth.pctAbove20DMA > 60,
    breadth.pctAbove50DMA > 50,
    breadth.pctAbove200DMA > 50,
    breadth.adRatio > 1,
    breadth.highs52w > breadth.lows52w,
    breadth.upVolPct > 55,
    breadth.mcclellan > 0,
  ].filter(Boolean).length;
  const verdict = positiveCount >= 5 ? "HEALTHY" : positiveCount >= 3 ? "CAUTIOUS" : "WEAK";
  const verdictColor = verdict === "HEALTHY" ? "text-positive" : verdict === "CAUTIOUS" ? "text-warning" : "text-negative";
  const verdictEmoji = verdict === "HEALTHY" ? "🟢" : verdict === "CAUTIOUS" ? "🟡" : "🔴";

  return (
    <PageLayout>
      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-semibold">Alerts & Market Breadth</h1>
          {/* Sound toggle — NEW */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium transition-colors ${
              soundEnabled ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
            }`}
          >
            {soundEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
            {soundEnabled ? "Sound On" : "Sound Off"}
          </button>
        </div>

        {/* Active Alerts */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">
          {alerts.map(a => (
            <div key={a.id} className={`bg-card border p-3 ${a.status === "triggered" ? "border-primary/50" : a.status === "expired" ? "border-border opacity-60" : "border-border"}`}>
              <div className="flex items-center gap-1.5 mb-1">
                {a.status === "triggered" ? <BellRing className="h-3 w-3 text-primary animate-pulse" /> :
                 a.status === "watching" ? <Bell className="h-3 w-3 text-muted-foreground" /> :
                 <BellOff className="h-3 w-3 text-muted-foreground/50" />}
                <span className="text-[10px] font-semibold">{a.name}</span>
              </div>
              <div className="text-[10px] text-muted-foreground mb-1">{a.detail}</div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-muted-foreground">{a.time}</span>
                {a.count > 0 && <span className="text-[9px] bg-primary/15 text-primary px-1 rounded font-mono">{a.count}x</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Alert Templates */}
        <div className="bg-card border border-border">
          <div className="px-3 py-2 border-b border-border text-[11px] font-semibold">Alert Templates</div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-0">
            {templates.map(t => (
              <div key={t.id} className={`p-3 border-r border-b border-border ${templateStates[t.id] ? "bg-primary/5" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold">{t.name}</span>
                  <button onClick={() => setTemplateStates(s => ({ ...s, [t.id]: !s[t.id] }))}
                    className={`w-8 h-4 rounded-full transition-colors flex items-center ${templateStates[t.id] ? "bg-primary justify-end" : "bg-surface justify-start"}`}>
                    <span className="w-3 h-3 rounded-full bg-foreground mx-0.5" />
                  </button>
                </div>
                <div className="text-[10px] text-muted-foreground mb-1">{t.description}</div>
                <div className="text-[9px] font-mono text-primary/70">{t.trigger}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Alert Builder */}
        <div className="bg-card border border-border p-3">
          <div className="text-[11px] font-semibold mb-2">Custom Alert Builder</div>
          <div className="flex items-center gap-2 flex-wrap">
            <select className="bg-secondary text-[11px] px-2 py-1.5 rounded border-none outline-none text-foreground">
              <option>PCR</option><option>OI Change</option><option>IV</option><option>Price</option><option>Volume</option><option>VIX</option>
            </select>
            <select className="bg-secondary text-[11px] px-2 py-1.5 rounded border-none outline-none text-foreground">
              <option>NIFTY</option><option>BANKNIFTY</option><option>Any F&O Stock</option>
            </select>
            <select className="bg-secondary text-[11px] px-2 py-1.5 rounded border-none outline-none text-foreground">
              <option>Greater than</option><option>Less than</option><option>Crosses above</option><option>Crosses below</option>
            </select>
            <input placeholder="Value" className="bg-secondary text-[11px] px-2 py-1.5 rounded w-20 border-none outline-none placeholder:text-muted-foreground font-mono" />
            <button className="px-3 py-1.5 text-[11px] font-medium bg-primary text-primary-foreground rounded flex items-center gap-1">
              <Plus className="h-3 w-3" /> Create Alert
            </button>
          </div>
        </div>

        {/* Alert Timeline */}
        <div className="bg-card border border-border">
          <div className="px-3 py-2 border-b border-border text-[11px] font-semibold">Alert Timeline</div>
          <div className="max-h-[200px] overflow-auto scrollbar-thin">
            {timeline.map(t => (
              <div key={t.id} className="flex items-start gap-3 px-3 py-2 border-b border-border/50 hover:bg-surface-hover">
                <div className="flex flex-col items-center mt-0.5">
                  <Clock className="h-3 w-3 text-primary" />
                  <div className="w-px h-full bg-border mt-1" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold">{t.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{t.time}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">{t.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Breadth Scanner */}
        <div className="bg-card border border-border">
          <div className="px-3 py-2 border-b border-border text-[11px] font-semibold">Market Breadth Scanner</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            <BreadthCard label="% Above 20 DMA" value={`${breadth.pctAbove20DMA}%`} trend={breadth.pctAbove20DMA > breadth.pctAbove20DMA_prev ? "up" : "down"} sparkData={breadth.sparklines.above20} />
            <BreadthCard label="% Above 50 DMA" value={`${breadth.pctAbove50DMA}%`} trend={breadth.pctAbove50DMA > breadth.pctAbove50DMA_prev ? "up" : "down"} sparkData={breadth.sparklines.above50} />
            <BreadthCard label="% Above 200 DMA" value={`${breadth.pctAbove200DMA}%`} trend={breadth.pctAbove200DMA > breadth.pctAbove200DMA_prev ? "up" : "down"} sparkData={breadth.sparklines.above200} />
            <BreadthCard label="Advance/Decline" value={`${breadth.advances}/${breadth.declines}`} sub={`Ratio: ${breadth.adRatio.toFixed(2)}`} sparkData={breadth.sparklines.ad} />
            <BreadthCard label="52W Highs/Lows" value={`H:${breadth.highs52w} / L:${breadth.lows52w}`} sparkData={breadth.sparklines.highs} />
            <BreadthCard label="Up Vol / Down Vol" value={`${breadth.upVolPct}% / ${breadth.downVolPct}%`} barMode={{ up: breadth.upVolPct, down: breadth.downVolPct }} />
            <BreadthCard label="McClellan Oscillator" value={`${breadth.mcclellan > 0 ? "+" : ""}${breadth.mcclellan}`} trend={breadth.mcclellanTrend} sparkData={breadth.sparklines.mcclellan} />
            <div className="bg-card border border-border p-3">
              <div className="text-[10px] text-muted-foreground mb-1">BREADTH VERDICT</div>
              <div className={`text-xl font-semibold ${verdictColor}`}>{verdictEmoji} {verdict}</div>
              <div className="text-[10px] text-muted-foreground mt-1">{positiveCount}/7 indicators positive</div>
            </div>
          </div>
        </div>

        {/* Breadth Trend Chart — NEW */}
        <BreadthChart />
      </div>
    </PageLayout>
  );
};

export default AlertsPage;
