import { useState, useMemo } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { getNiftyChain, getBankNiftyChain, OptionChainData } from "@/data/mockOptionChain";
import { calculateGEX } from "@/lib/greeks";
import { formatINR, formatQty, formatPercent } from "@/lib/formatters";
import { getDirectionalBg, getIntensityBg } from "@/lib/heatmapColors";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { Sparkline } from "@/components/shared/Sparkline";

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border">
      <div className="px-3 py-2 border-b border-border">
        <h3 className="text-[11px] font-semibold">{title}</h3>
      </div>
      <div className="p-2 h-[240px]">{children}</div>
    </div>
  );
}

const tooltipStyle = { backgroundColor: "hsl(240, 17%, 7%)", border: "1px solid hsl(240, 29%, 14%)", borderRadius: "2px", fontSize: "11px" };

// DEX calculation
function calculateDEX(spot: number, strikes: { strike: number; callOI: number; putOI: number; callDelta: number; putDelta: number }[]) {
  return strikes.map(s => ({
    strike: s.strike,
    dex: (s.callOI * s.callDelta + s.putOI * s.putDelta) * spot * 0.01,
  }));
}

const OptionsPage = () => {
  const [index, setIndex] = useState<"NIFTY" | "BANKNIFTY">("NIFTY");
  const [expiry, setExpiry] = useState(0);
  const [showGreeks, setShowGreeks] = useState(false);

  const chain = useMemo(() => index === "NIFTY" ? getNiftyChain() : getBankNiftyChain(), [index]);
  const atm = Math.round(chain.spot / (index === "NIFTY" ? 50 : 100)) * (index === "NIFTY" ? 50 : 100);
  const maxCallOIStrike = chain.strikes.reduce((a, b) => a.callOI > b.callOI ? a : b).strike;
  const maxPutOIStrike = chain.strikes.reduce((a, b) => a.putOI > b.putOI ? a : b).strike;

  const gexData = useMemo(() => calculateGEX(chain.spot, chain.strikes), [chain]);
  const dexData = useMemo(() => calculateDEX(chain.spot, chain.strikes), [chain]);
  const oiByStrike = chain.strikes.map(s => ({ strike: s.strike, callOI: s.callOI, putOI: -s.putOI }));
  const oiChangeByStrike = chain.strikes.map(s => ({ strike: s.strike, callOIChg: s.callOIChange, putOIChg: -s.putOIChange }));
  const ivSmile = chain.strikes.map(s => ({ strike: s.strike, callIV: s.callIV, putIV: s.putIV }));

  // Straddle P&L mock
  const straddlePnl = useMemo(() => {
    const data = [];
    for (let i = 0; i <= 50; i++) {
      data.push({ time: `${9 + Math.floor(i * 6.5 / 50)}:${String(15 + (i * 6.5 / 50 % 1) * 60 | 0).padStart(2, "0")}`, buyerPnl: (Math.random() - 0.45) * 5000 * (i / 25), sellerPnl: -(Math.random() - 0.45) * 5000 * (i / 25) });
    }
    return data;
  }, [index]);

  // Options flow mock
  const flowData = useMemo(() => {
    const flows = [];
    for (let i = 0; i < 15; i++) {
      const isCall = Math.random() > 0.5;
      const strike = atm + (Math.round((Math.random() - 0.5) * 10)) * (index === "NIFTY" ? 50 : 100);
      const isBuy = Math.random() > 0.45;
      const qty = Math.round(Math.random() * 5000 + 500);
      const premium = Math.round(Math.random() * 200 + 20);
      flows.push({
        time: `${14 - Math.floor(i * 0.4)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
        strike, type: isCall ? "CE" : "PE", ltp: premium, qty, premiumL: (qty * premium * (index === "NIFTY" ? 25 : 15)) / 1e5,
        side: isBuy ? "BUY" : "SELL",
      });
    }
    return flows;
  }, [index, atm]);

  // IV Term Structure mock
  const ivTermStructure = useMemo(() => {
    const expiries = chain.expiries;
    return expiries.map((exp, i) => ({
      expiry: exp.split("-").slice(0, 2).join(" "),
      iv: chain.atmIV + (i * 0.8) + (Math.random() - 0.5) * 2,
      isCurrent: i === 0,
    }));
  }, [chain]);

  return (
    <PageLayout>
      <div className="p-3 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-0.5">
            {(["NIFTY", "BANKNIFTY"] as const).map(i => (
              <button key={i} onClick={() => setIndex(i)}
                className={`px-3 py-1 text-[11px] font-medium rounded transition-colors ${index === i ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>{i}</button>
            ))}
          </div>
          <select value={expiry} onChange={e => setExpiry(+e.target.value)}
            className="bg-secondary text-[11px] px-2 py-1 rounded border-none outline-none text-foreground">
            {chain.expiries.map((e, i) => <option key={e} value={i}>{e}</option>)}
          </select>
          <div className="flex items-center gap-4 text-[11px] ml-2">
            <span>Spot: <strong className="font-mono text-foreground">₹{chain.spot.toLocaleString("en-IN")}</strong></span>
            <span>ATM IV: <strong className="font-mono text-primary">{chain.atmIV.toFixed(1)}%</strong></span>
            <span>IV%ile: <strong className="font-mono">{chain.ivPercentile.toFixed(0)}</strong></span>
            <span>PCR: <strong className="font-mono" style={{ color: chain.pcr > 1.2 ? "hsl(var(--positive))" : chain.pcr < 0.8 ? "hsl(var(--negative))" : "inherit" }}>{chain.pcr.toFixed(2)}</strong></span>
            <span>Max Pain: <strong className="font-mono">₹{chain.maxPain.toLocaleString("en-IN")}</strong></span>
            <span>Exp Move: <strong className="font-mono text-warning">±{chain.expectedMove.toFixed(0)} ({chain.expectedMovePct.toFixed(2)}%)</strong></span>
          </div>
          <button onClick={() => setShowGreeks(!showGreeks)}
            className={`ml-auto px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${showGreeks ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary"}`}>
            {showGreeks ? "Hide Greeks" : "Show Greeks"}
          </button>
        </div>

        {/* Option Chain */}
        <div className="border border-border overflow-auto scrollbar-thin max-h-[420px]">
          <table className="w-full text-[11px]">
            <thead className="sticky top-0 bg-card z-20">
              <tr className="text-muted-foreground">
                <th className="px-1 py-1.5 text-right font-medium">OI</th>
                <th className="px-1 py-1.5 text-right font-medium">OIΔ</th>
                <th className="px-1 py-1.5 text-right font-medium">Vol</th>
                <th className="px-1 py-1.5 text-right font-medium">IV</th>
                {showGreeks && <><th className="px-1 py-1.5 text-right font-medium">Δ</th><th className="px-1 py-1.5 text-right font-medium">Γ</th></>}
                <th className="px-1 py-1.5 text-right font-medium">LTP</th>
                <th className="px-1 py-1.5 text-right font-medium">Chg%</th>
                <th className="px-2 py-1.5 text-center font-semibold bg-surface text-foreground sticky left-0 z-10">STRIKE</th>
                <th className="px-1 py-1.5 text-left font-medium">Chg%</th>
                <th className="px-1 py-1.5 text-left font-medium">LTP</th>
                {showGreeks && <><th className="px-1 py-1.5 text-left font-medium">Δ</th><th className="px-1 py-1.5 text-left font-medium">Γ</th></>}
                <th className="px-1 py-1.5 text-left font-medium">IV</th>
                <th className="px-1 py-1.5 text-left font-medium">Vol</th>
                <th className="px-1 py-1.5 text-left font-medium">OIΔ</th>
                <th className="px-1 py-1.5 text-left font-medium">OI</th>
              </tr>
            </thead>
            <tbody>
              {chain.strikes.map(s => {
                const isATM = s.strike === atm;
                const callITM = s.strike < chain.spot;
                const putITM = s.strike > chain.spot;
                return (
                  <tr key={s.strike} className={`${isATM ? "border-y border-primary/40" : ""} hover:bg-surface-hover transition-colors`}>
                    <td className="px-1 py-0.5 text-right font-mono" style={{ background: getIntensityBg(s.callOI, 800000) }}>{formatQty(s.callOI)}</td>
                    <td className="px-1 py-0.5 text-right font-mono" style={{ background: getDirectionalBg(s.callOIChange, 20000), color: s.callOIChange >= 0 ? "hsl(var(--positive))" : "hsl(var(--negative))" }}>{s.callOIChange > 0 ? "+" : ""}{formatQty(s.callOIChange)}</td>
                    <td className="px-1 py-0.5 text-right font-mono" style={{ background: getIntensityBg(s.callVol, 40000) }}>{formatQty(s.callVol)}</td>
                    <td className="px-1 py-0.5 text-right font-mono" style={{ background: getIntensityBg(s.callIV, 40) }}>{s.callIV.toFixed(1)}</td>
                    {showGreeks && <>
                      <td className="px-1 py-0.5 text-right font-mono text-muted-foreground">{s.callDelta.toFixed(2)}</td>
                      <td className="px-1 py-0.5 text-right font-mono text-muted-foreground">{s.callGamma.toFixed(4)}</td>
                    </>}
                    <td className={`px-1 py-0.5 text-right font-mono font-medium ${callITM ? "bg-primary/5" : ""}`}>{s.callLTP.toFixed(2)}</td>
                    <td className="px-1 py-0.5 text-right font-mono" style={{ color: s.callChange >= 0 ? "hsl(var(--positive))" : "hsl(var(--negative))" }}>{formatPercent(s.callChange)}</td>
                    <td className={`px-2 py-0.5 text-center font-mono font-semibold bg-surface sticky left-0 ${isATM ? "text-primary" : "text-foreground"}`}>
                      {s.strike === maxCallOIStrike && <span className="text-[9px] mr-0.5">🔴</span>}
                      {s.strike === chain.maxPain && <span className="text-[9px] mr-0.5">⚡</span>}
                      {s.strike.toLocaleString("en-IN")}
                      {s.strike === maxPutOIStrike && <span className="text-[9px] ml-0.5">🟢</span>}
                    </td>
                    <td className="px-1 py-0.5 text-left font-mono" style={{ color: s.putChange >= 0 ? "hsl(var(--positive))" : "hsl(var(--negative))" }}>{formatPercent(s.putChange)}</td>
                    <td className={`px-1 py-0.5 text-left font-mono font-medium ${putITM ? "bg-primary/5" : ""}`}>{s.putLTP.toFixed(2)}</td>
                    {showGreeks && <>
                      <td className="px-1 py-0.5 text-left font-mono text-muted-foreground">{s.putDelta.toFixed(2)}</td>
                      <td className="px-1 py-0.5 text-left font-mono text-muted-foreground">{s.putGamma.toFixed(4)}</td>
                    </>}
                    <td className="px-1 py-0.5 text-left font-mono" style={{ background: getIntensityBg(s.putIV, 40) }}>{s.putIV.toFixed(1)}</td>
                    <td className="px-1 py-0.5 text-left font-mono" style={{ background: getIntensityBg(s.putVol, 40000) }}>{formatQty(s.putVol)}</td>
                    <td className="px-1 py-0.5 text-left font-mono" style={{ background: getDirectionalBg(s.putOIChange, 20000), color: s.putOIChange >= 0 ? "hsl(var(--positive))" : "hsl(var(--negative))" }}>{s.putOIChange > 0 ? "+" : ""}{formatQty(s.putOIChange)}</td>
                    <td className="px-1 py-0.5 text-left font-mono" style={{ background: getIntensityBg(s.putOI, 800000) }}>{formatQty(s.putOI)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 10 Panel Cards — 2 rows of 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-3">
          {/* OI by Strike */}
          <ChartCard title="OI by Strike">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={oiByStrike.filter((_, i) => i % 2 === 0)} layout="vertical" margin={{ left: 5, right: 5 }}>
                <XAxis type="number" tick={{ fontSize: 8, fill: "hsl(240, 12%, 46%)" }} axisLine={false} tickLine={false} tickFormatter={v => formatQty(Math.abs(v))} />
                <YAxis type="category" dataKey="strike" tick={{ fontSize: 8, fill: "hsl(240, 12%, 46%)" }} axisLine={false} tickLine={false} width={45} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatQty(Math.abs(v))]} />
                <Bar dataKey="callOI" fill="hsl(0, 84%, 60%)" fillOpacity={0.6} />
                <Bar dataKey="putOI" fill="hsl(142, 71%, 45%)" fillOpacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Change in OI */}
          <ChartCard title="Change in OI by Strike">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={oiChangeByStrike.filter((_, i) => i % 2 === 0)} layout="vertical" margin={{ left: 5, right: 5 }}>
                <XAxis type="number" tick={{ fontSize: 8, fill: "hsl(240, 12%, 46%)" }} axisLine={false} tickLine={false} tickFormatter={v => formatQty(Math.abs(v))} />
                <YAxis type="category" dataKey="strike" tick={{ fontSize: 8, fill: "hsl(240, 12%, 46%)" }} axisLine={false} tickLine={false} width={45} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="callOIChg" fill="hsl(0, 84%, 60%)" fillOpacity={0.5} />
                <Bar dataKey="putOIChg" fill="hsl(142, 71%, 45%)" fillOpacity={0.5} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* IV Smile */}
          <ChartCard title="IV Smile / Skew">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ivSmile.filter((_, i) => i % 2 === 0)} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="strike" tick={{ fontSize: 8, fill: "hsl(240, 12%, 46%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 8, fill: "hsl(240, 12%, 46%)" }} axisLine={false} tickLine={false} width={30} tickFormatter={v => v.toFixed(0)} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="callIV" stroke="hsl(0, 84%, 60%)" strokeWidth={1.5} dot={false} name="Call IV" />
                <Line type="monotone" dataKey="putIV" stroke="hsl(142, 71%, 45%)" strokeWidth={1.5} dot={false} name="Put IV" />
                <ReferenceLine x={atm} stroke="hsl(217, 91%, 60%)" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* GEX */}
          <ChartCard title="GEX — Gamma Exposure (₹Cr)">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gexData.filter((_, i) => i % 2 === 0)} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="strike" tick={{ fontSize: 8, fill: "hsl(240, 12%, 46%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 8, fill: "hsl(240, 12%, 46%)" }} axisLine={false} tickLine={false} width={40} tickFormatter={v => (v / 1e7).toFixed(0)} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [(v / 1e7).toFixed(2) + " Cr"]} />
                <ReferenceLine y={0} stroke="hsl(240, 29%, 14%)" />
                <Bar dataKey="gex" radius={[2, 2, 0, 0]}>
                  {gexData.filter((_, i) => i % 2 === 0).map((d, i) => (
                    <Cell key={i} fill={d.gex >= 0 ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)"} fillOpacity={0.6} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* DEX — NEW */}
          <ChartCard title="DEX — Delta Exposure">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dexData.filter((_, i) => i % 2 === 0)} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="strike" tick={{ fontSize: 8, fill: "hsl(240, 12%, 46%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 8, fill: "hsl(240, 12%, 46%)" }} axisLine={false} tickLine={false} width={40} tickFormatter={v => (v / 1e7).toFixed(0)} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [(v / 1e7).toFixed(2) + " Cr"]} />
                <ReferenceLine y={0} stroke="hsl(240, 29%, 14%)" />
                <Bar dataKey="dex" radius={[2, 2, 0, 0]}>
                  {dexData.filter((_, i) => i % 2 === 0).map((d, i) => (
                    <Cell key={i} fill={d.dex >= 0 ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)"} fillOpacity={0.6} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Expected Move */}
          <ChartCard title="Expected Move">
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="text-2xl font-mono font-bold text-warning">±{chain.expectedMove.toFixed(0)} pts</div>
              <div className="text-sm font-mono text-muted-foreground">±{chain.expectedMovePct.toFixed(2)}%</div>
              <div className="w-full max-w-[280px] h-6 bg-surface rounded relative">
                <div className="absolute inset-y-0 left-1/4 right-1/4 bg-warning/15 rounded" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
              </div>
              <div className="flex justify-between w-full max-w-[280px] text-[10px] font-mono text-muted-foreground">
                <span>₹{(chain.spot - chain.expectedMove).toLocaleString("en-IN")}</span>
                <span className="text-foreground">₹{chain.spot.toLocaleString("en-IN")}</span>
                <span>₹{(chain.spot + chain.expectedMove).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </ChartCard>

          {/* Max Pain */}
          <ChartCard title="Max Pain Curve">
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <div className="text-lg font-mono font-semibold">Max Pain: ₹{chain.maxPain.toLocaleString("en-IN")}</div>
              <div className="text-[11px] text-muted-foreground font-mono">
                Distance: {chain.spot > chain.maxPain ? "+" : ""}{(chain.spot - chain.maxPain).toFixed(0)} pts ({((chain.spot - chain.maxPain) / chain.spot * 100).toFixed(2)}%)
              </div>
              <div className="text-[10px] text-muted-foreground">Price tends to gravitate toward Max Pain near expiry</div>
            </div>
          </ChartCard>

          {/* Options Flow */}
          <ChartCard title="Options Flow (Live)">
            <div className="overflow-auto scrollbar-thin h-full">
              <table className="w-full text-[10px]">
                <thead className="sticky top-0 bg-card">
                  <tr className="text-muted-foreground">
                    <th className="px-1 py-1 text-left">Time</th>
                    <th className="px-1 py-1 text-right">Strike</th>
                    <th className="px-1 py-1">Type</th>
                    <th className="px-1 py-1 text-right">Qty</th>
                    <th className="px-1 py-1 text-right">₹L</th>
                    <th className="px-1 py-1">Side</th>
                  </tr>
                </thead>
                <tbody>
                  {flowData.map((f, i) => (
                    <tr key={i} className={`border-l-2 ${f.side === "BUY" ? "border-l-positive/50" : "border-l-negative/50"} hover:bg-surface-hover`}>
                      <td className="px-1 py-0.5 font-mono">{f.time}</td>
                      <td className="px-1 py-0.5 text-right font-mono">{f.strike}</td>
                      <td className="px-1 py-0.5 text-center">{f.type}</td>
                      <td className="px-1 py-0.5 text-right font-mono">{formatQty(f.qty)}</td>
                      <td className="px-1 py-0.5 text-right font-mono" style={{ background: getIntensityBg(f.premiumL, 100) }}>₹{f.premiumL.toFixed(1)}L</td>
                      <td className={`px-1 py-0.5 text-center font-medium ${f.side === "BUY" ? "text-positive" : "text-negative"}`}>{f.side}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>

          {/* IV Term Structure — NEW */}
          <ChartCard title="IV Term Structure">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ivTermStructure} margin={{ top: 10, right: 10, bottom: 5, left: 5 }}>
                <XAxis dataKey="expiry" tick={{ fontSize: 8, fill: "hsl(240, 12%, 46%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 8, fill: "hsl(240, 12%, 46%)" }} axisLine={false} tickLine={false} width={30} tickFormatter={v => v.toFixed(0) + "%"} domain={["auto", "auto"]} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v.toFixed(1) + "%"]} />
                <Line type="monotone" dataKey="iv" stroke="hsl(var(--warning))" strokeWidth={2} dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  if (payload.isCurrent) {
                    return <circle cx={cx} cy={cy} r={5} fill="hsl(var(--warning))" stroke="hsl(var(--background))" strokeWidth={2} />;
                  }
                  return <circle cx={cx} cy={cy} r={3} fill="hsl(var(--warning))" fillOpacity={0.5} />;
                }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Straddle P&L */}
          <ChartCard title="ATM Straddle P&L (Today)">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={straddlePnl} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="time" tick={{ fontSize: 8, fill: "hsl(240, 12%, 46%)" }} axisLine={false} tickLine={false} minTickGap={30} />
                <YAxis tick={{ fontSize: 8, fill: "hsl(240, 12%, 46%)" }} axisLine={false} tickLine={false} width={40} tickFormatter={v => (v / 1000).toFixed(1) + "K"} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => ["₹" + v.toFixed(0)]} />
                <ReferenceLine y={0} stroke="hsl(240, 29%, 14%)" />
                <Line type="monotone" dataKey="buyerPnl" stroke="hsl(142, 71%, 45%)" strokeWidth={1.5} dot={false} name="Buyer P&L" />
                <Line type="monotone" dataKey="sellerPnl" stroke="hsl(0, 84%, 60%)" strokeWidth={1.5} dot={false} name="Seller P&L" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </PageLayout>
  );
};

export default OptionsPage;
