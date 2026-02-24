import { useState, useMemo } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { generateTimeSales } from "@/data/mockTimeSales";

interface TimeAndSalesProps {
  basePrice: number;
}

export function TimeAndSales({ basePrice }: TimeAndSalesProps) {
  const [collapsed, setCollapsed] = useState(false);
  const trades = useMemo(() => generateTimeSales(basePrice, 50), [basePrice]);

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="absolute right-0 top-16 bg-card border border-border px-1 py-2 z-10 hover:bg-secondary transition-colors"
      >
        <ChevronLeft className="h-3 w-3 text-muted-foreground" />
      </button>
    );
  }

  return (
    <div className="absolute right-0 top-0 bottom-0 w-[220px] bg-card border-l border-border z-10 flex flex-col">
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-border">
        <span className="text-[10px] font-semibold">Time & Sales</span>
        <button onClick={() => setCollapsed(true)} className="hover:text-foreground text-muted-foreground">
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
      <div className="flex-1 overflow-auto scrollbar-thin">
        <table className="w-full text-[10px]">
          <thead className="sticky top-0 bg-card">
            <tr className="text-muted-foreground">
              <th className="px-1.5 py-1 text-left font-medium">Time</th>
              <th className="px-1.5 py-1 text-right font-medium">Price</th>
              <th className="px-1.5 py-1 text-right font-medium">Qty</th>
              <th className="px-1 py-1 w-4" />
            </tr>
          </thead>
          <tbody>
            {trades.map((t, i) => {
              const isLarge = t.qty > 100;
              return (
                <tr
                  key={i}
                  className={`border-b border-border/30 ${isLarge ? "bg-primary/5" : ""}`}
                >
                  <td className={`px-1.5 py-0.5 font-mono ${isLarge ? "font-bold" : ""}`}>{t.time}</td>
                  <td className={`px-1.5 py-0.5 text-right font-mono ${isLarge ? "font-bold" : ""}`}>
                    ₹{t.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className={`px-1.5 py-0.5 text-right font-mono ${isLarge ? "font-bold" : ""}`}>{t.qty}</td>
                  <td className="px-1 py-0.5">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: t.side === "buy" ? "hsl(var(--positive))" : "hsl(var(--negative))" }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
