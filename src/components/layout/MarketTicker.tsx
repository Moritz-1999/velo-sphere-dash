import { useNavigate } from "react-router-dom";

interface TickerItem {
  label: string;
  value: string;
  change?: string;
  changePct?: number;
  route: string;
}

const tickerData: TickerItem[] = [
  { label: "NIFTY", value: "22,450", change: "+0.52%", changePct: 0.52, route: "/chart" },
  { label: "BANKNIFTY", value: "48,230", change: "-0.31%", changePct: -0.31, route: "/chart" },
  { label: "VIX", value: "14.2", change: "+2.1%", changePct: 2.1, route: "/oi" },
  { label: "FII", value: "+₹342Cr", changePct: 1, route: "/market" },
  { label: "DII", value: "-₹120Cr", changePct: -1, route: "/market" },
  { label: "GIFT NIFTY", value: "22,480", change: "+0.3%", changePct: 0.3, route: "/chart" },
  { label: "PCR", value: "1.23", changePct: 0, route: "/oi" },
  { label: "Max Pain", value: "22,500", changePct: 0, route: "/oi" },
  { label: "USD/INR", value: "83.42", changePct: 0, route: "/market" },
  { label: "Crude", value: "$78.2", changePct: 0, route: "/market" },
];

export function MarketTicker() {
  const navigate = useNavigate();

  const items = [...tickerData, ...tickerData]; // duplicate for seamless loop

  return (
    <div
      className="h-7 overflow-hidden shrink-0 relative"
      style={{ backgroundColor: "#0c0c10" }}
    >
      <div className="flex items-center h-full animate-ticker whitespace-nowrap">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate(item.route)}
          >
            <span className="text-[11px] text-muted-foreground">{item.label}</span>
            <span className="text-[11px] font-mono text-foreground">{item.value}</span>
            {item.change && (
              <span
                className="text-[11px] font-mono"
                style={{
                  color: (item.changePct ?? 0) >= 0
                    ? "hsl(var(--positive))"
                    : "hsl(var(--negative))",
                }}
              >
                {item.change}
              </span>
            )}
            <span className="text-[11px] mx-3" style={{ color: "#6b6b80" }}>•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
