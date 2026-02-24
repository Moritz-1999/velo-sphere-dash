import { useMemo } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { getOIPulse, getBuildupData, getScannerMatches, BuildupEntry, ScannerMatch } from "@/data/mockOI";
import { getNiftyChain, getBankNiftyChain } from "@/data/mockOptionChain";
import { formatINR, formatPercent } from "@/lib/formatters";
import { getDirectionalBg } from "@/lib/heatmapColors";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { TrendingUp, TrendingDown, Target, Blocks, Zap, RefreshCw, Building, Settings2 } from "lucide-react";

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-card border border-border p-3">
      <div className="text-[10px] text-muted-foreground mb-1">{label}</div>
      <div className={`text-lg font-mono font-semibold ${color || "text-foreground"}`}>{value}</div>
      {sub && <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

function ScannerCard({ icon, title, desc, matches, color }: { icon: React.ReactNode; title: string; desc: string; matches: ScannerMatch[]; color: string }) {
  return (
    <div className="bg-card border border-border p-3">
      <div className="flex items-center gap-2 mb-2">
        <span style={{ color }}>{icon}</span>
        <span className="text-[11px] font-semibold">{title}</span>
        <span className="ml-auto text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded font-mono">{matches.length}</span>
      </div>
      <div className="text-[10px] text-muted-foreground mb-2">{desc}</div>
      <div className="space-y-1">
        {matches.map((m, i) => (
          <div key={i} className="flex items-center gap-2 text-[10px]">
            <span className="font-mono font-medium text-foreground">{m.symbol}{m.strike ? ` ${m.strike}` : ""}</span>
            <span className="text-muted-foreground flex-1 truncate">{m.detail}</span>
            <span className="text-muted-foreground font-mono">{m.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BuildupColumn({ title, emoji, entries, color }: { title: string; emoji: string; entries: BuildupEntry[]; color: string }) {
  return (
    <div className="bg-card border border-border">
      <div className="px-3 py-2 border-b border-border flex items-center gap-2">
        <span>{emoji}</span>
        <span className="text-[11px] font-semibold" style={{ color }}>{title}</span>
        <span className="text-[10px] bg-surface px-1.5 py-0.5 rounded font-mono ml-auto">{entries.length}</span>
      </div>
      <div className="max-h-[300px] overflow-auto scrollbar-thin">
        {entries.slice(0, 12).map(e => (
          <div key={e.symbol} className="px-3 py-1.5 border-b border-border/50 hover:bg-surface-hover transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-medium">{e.symbol}</span>
              <span className={`text-[11px] font-mono ${e.priceDelta >= 0 ? "text-positive" : "text-negative"}`}>{formatPercent(e.priceDelta)}</span>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground">OI: {formatPercent(e.oiDelta)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const tooltipStyle = { backgroundColor: "hsl(240, 17%, 7%)", border: "1px solid hsl(240, 29%, 14%)", borderRadius: "2px", fontSize: "11px" };

const OIIntelPage = () => {
  const pulse = getOIPulse();
  const buildup = useMemo(() => getBuildupData(), []);
  const scanners = useMemo(() => getScannerMatches(), []);
  const niftyChain = useMemo(() => getNiftyChain(), []);
  const bnfChain = useMemo(() => getBankNiftyChain(), []);

  const longBuildup = buildup.filter(b => b.type === "long_buildup");
  const shortBuildup = buildup.filter(b => b.type === "short_buildup");
  const shortCovering = buildup.filter(b => b.type === "short_covering");
  const longUnwinding = buildup.filter(b => b.type === "long_unwinding");

  const niftyBattleData = niftyChain.strikes.filter((_, i) => i % 2 === 0).map(s => ({ strike: s.strike, callOI: s.callOI, putOI: s.putOI }));
  const bnfBattleData = bnfChain.strikes.filter((_, i) => i % 2 === 0).map(s => ({ strike: s.strike, callOI: s.callOI, putOI: s.putOI }));

  return (
    <PageLayout>
      <div className="p-3 space-y-3">
        <h1 className="text-sm font-semibold">OI Intelligence</h1>

        {/* Pulse Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">
          <StatCard label="Nifty PCR" value={pulse.niftyPCR.toFixed(2)} sub={pulse.niftyPCRTrend === "up" ? "↑ Rising" : "↓ Falling"} color={pulse.niftyPCR > 1.2 ? "text-positive" : pulse.niftyPCR < 0.8 ? "text-negative" : ""} />
          <StatCard label="BankNifty PCR" value={pulse.bnfPCR.toFixed(2)} sub={pulse.bnfPCRTrend === "up" ? "↑ Rising" : "↓ Falling"} color={pulse.bnfPCR > 1.2 ? "text-positive" : pulse.bnfPCR < 0.8 ? "text-negative" : ""} />
          <StatCard label="Nifty Max Pain" value={`₹${pulse.niftyMaxPain.toLocaleString("en-IN")}`} sub={`${pulse.niftySpot > pulse.niftyMaxPain ? "+" : ""}${(pulse.niftySpot - pulse.niftyMaxPain).toFixed(0)} pts from spot`} />
          <StatCard label="BankNifty Max Pain" value={`₹${pulse.bnfMaxPain.toLocaleString("en-IN")}`} sub={`${pulse.bnfSpot > pulse.bnfMaxPain ? "+" : ""}${(pulse.bnfSpot - pulse.bnfMaxPain).toFixed(0)} pts from spot`} />
          <StatCard label="India VIX" value={pulse.vix.toFixed(1)} sub={`+${pulse.vixChange} (+${pulse.vixChangePct}%)`} color="text-warning" />
          <StatCard label="FII L/S Ratio" value={pulse.fiiLSRatio.toFixed(2)} sub={pulse.fiiLSRatio < 0.8 ? "Bearish" : "Neutral"} color={pulse.fiiLSRatio < 0.8 ? "text-negative" : ""} />
        </div>

        {/* OI Battlefield */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {[{ title: "NIFTY OI Battlefield", data: niftyBattleData, spot: niftyChain.spot }, { title: "BANKNIFTY OI Battlefield", data: bnfBattleData, spot: bnfChain.spot }].map(b => (
            <div key={b.title} className="bg-card border border-border">
              <div className="px-3 py-2 border-b border-border text-[11px] font-semibold">{b.title}</div>
              <div className="p-2 h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={b.data} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                    <XAxis dataKey="strike" tick={{ fontSize: 8, fill: "hsl(240, 12%, 46%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 8, fill: "hsl(240, 12%, 46%)" }} axisLine={false} tickLine={false} width={45} tickFormatter={v => (v / 1e5).toFixed(0) + "L"} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [(v / 1e5).toFixed(1) + "L"]} />
                    <ReferenceLine y={0} stroke="hsl(240, 29%, 14%)" />
                    <Bar dataKey="callOI" fill="hsl(0, 70%, 55%)" fillOpacity={0.5} name="Call OI" />
                    <Bar dataKey="putOI" fill="hsl(142, 60%, 45%)" fillOpacity={0.5} name="Put OI" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>

        {/* Smart Scanners */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          <ScannerCard icon={<Target className="h-4 w-4" />} title="Strike Under Attack 🎯" desc="OI declining >10% in 1hr AND price within 1% of strike" matches={scanners.strikeUnderAttack} color="hsl(var(--negative))" />
          <ScannerCard icon={<Blocks className="h-4 w-4" />} title="Wall Building 🧱" desc="OI increased >20% today AND price >2% away" matches={scanners.wallBuilding} color="hsl(var(--positive))" />
          <ScannerCard icon={<Zap className="h-4 w-4" />} title="Pain Shift ⚡" desc="Max Pain moved >100 points from opening value" matches={scanners.painShift} color="hsl(var(--warning))" />
          <ScannerCard icon={<RefreshCw className="h-4 w-4" />} title="PCR Extreme 🔄" desc="PCR hit >1.5 (reversal zone) or <0.5 (overbought)" matches={scanners.pcrExtreme} color="hsl(var(--neutral))" />
          <ScannerCard icon={<Building className="h-4 w-4" />} title="FII Pivot 🏦" desc="FII net position changed direction" matches={scanners.fiiPivot} color="hsl(217, 91%, 60%)" />
          <ScannerCard icon={<Settings2 className="h-4 w-4" />} title="GEX Flip ⚙️" desc="Gamma Exposure flipped positive↔negative" matches={scanners.gexFlip} color="hsl(var(--warning))" />
        </div>

        {/* Buildup Classifier */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <BuildupColumn title="LONG BUILDUP" emoji="🟢" entries={longBuildup} color="hsl(var(--positive))" />
          <BuildupColumn title="SHORT BUILDUP" emoji="🔴" entries={shortBuildup} color="hsl(var(--negative))" />
          <BuildupColumn title="SHORT COVERING" emoji="🟡" entries={shortCovering} color="hsl(var(--warning))" />
          <BuildupColumn title="LONG UNWINDING" emoji="⚪" entries={longUnwinding} color="hsl(var(--muted-foreground))" />
        </div>
      </div>
    </PageLayout>
  );
};

export default OIIntelPage;
