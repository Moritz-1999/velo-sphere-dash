import { getOISnapshots } from "@/data/mockOISnapshots";
import { useMemo } from "react";
import { formatQty } from "@/lib/formatters";

function DeltaCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-card border border-border p-3">
      <div className="text-[10px] text-muted-foreground mb-1">{label}</div>
      <div className={`text-lg font-mono font-semibold ${color || "text-foreground"}`}>{value}</div>
      {sub && <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

export function OIDeltaCards() {
  const snapshots = getOISnapshots();

  const deltas = useMemo(() => {
    if (snapshots.length < 2) return { totalOI: 0, callsAdded: 0, putsAdded: 0, pcrDrift: 0 };
    const first = snapshots[0];
    const last = snapshots[snapshots.length - 1];

    const firstTotalCall = first.strikes.reduce((s, x) => s + x.callOI, 0);
    const firstTotalPut = first.strikes.reduce((s, x) => s + x.putOI, 0);
    const lastTotalCall = last.strikes.reduce((s, x) => s + x.callOI, 0);
    const lastTotalPut = last.strikes.reduce((s, x) => s + x.putOI, 0);

    const callsAdded = lastTotalCall - firstTotalCall;
    const putsAdded = lastTotalPut - firstTotalPut;
    const totalOI = callsAdded + putsAdded;
    const openPCR = firstTotalPut / firstTotalCall;
    const currentPCR = lastTotalPut / lastTotalCall;
    const pcrDrift = currentPCR - openPCR;

    return { totalOI, callsAdded, putsAdded, pcrDrift };
  }, [snapshots]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      <DeltaCard
        label="OI Added Today"
        value={formatQty(deltas.totalOI)}
        sub="Total new OI since 9:15 AM"
      />
      <DeltaCard
        label="Calls Added"
        value={formatQty(deltas.callsAdded)}
        color={deltas.callsAdded > 0 ? "text-negative" : "text-positive"}
        sub="New Call OI vs open"
      />
      <DeltaCard
        label="Puts Added"
        value={formatQty(deltas.putsAdded)}
        color={deltas.putsAdded > 0 ? "text-positive" : "text-negative"}
        sub="New Put OI vs open"
      />
      <DeltaCard
        label="PCR Drift"
        value={`${deltas.pcrDrift >= 0 ? "+" : ""}${deltas.pcrDrift.toFixed(3)}`}
        color={deltas.pcrDrift > 0 ? "text-positive" : "text-negative"}
        sub={`PCR drifted ${deltas.pcrDrift >= 0 ? "bullish" : "bearish"}`}
      />
    </div>
  );
}
