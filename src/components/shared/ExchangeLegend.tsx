import { EXCHANGE_COLORS } from "@/data/mockData";

const exchanges = [
  { key: "binance", label: "Binance" },
  { key: "bybit", label: "Bybit" },
  { key: "okx", label: "OKX" },
  { key: "deribit", label: "Deribit" },
  { key: "others", label: "Others" },
];

export function ExchangeLegend() {
  return (
    <div className="flex items-center gap-3">
      {exchanges.map((ex) => (
        <div key={ex.key} className="flex items-center gap-1.5">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: EXCHANGE_COLORS[ex.key as keyof typeof EXCHANGE_COLORS] }}
          />
          <span className="text-xxs text-muted-foreground">{ex.label}</span>
        </div>
      ))}
    </div>
  );
}
