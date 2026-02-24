import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { SectorFlowTable } from "@/components/market/SectorFlowTable";
import { StockHeatmapTable } from "@/components/market/StockHeatmapTable";
import { VolumeProfileTable } from "@/components/market/VolumeProfileTable";
import { BigTradeTracker } from "@/components/market/BigTradeTracker";
import { DOMImbalanceTable } from "@/components/market/DOMImbalanceTable";
import { ReturnBuckets } from "@/components/market/ReturnBuckets";
import { MarketVolume } from "@/components/market/MarketVolume";
import { TotalOI } from "@/components/market/TotalOI";

type MarketTab = "stocks" | "volProfile" | "bigTrades" | "dom" | "charts";

const tabs: { key: MarketTab; label: string }[] = [
  { key: "stocks", label: "Stocks" },
  { key: "volProfile", label: "Volume Profile" },
  { key: "bigTrades", label: "Big Trades" },
  { key: "dom", label: "DOM" },
  { key: "charts", label: "Charts" },
];

const MarketPage = () => {
  const [activeTab, setActiveTab] = useState<MarketTab>("stocks");

  return (
    <PageLayout>
      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-semibold">Market Overview</h1>
          <span className="text-[10px] text-muted-foreground">All F&O Stocks · 50 assets · Today</span>
        </div>

        {/* Sector Flow — always visible */}
        <SectorFlowTable />

        {/* Tab bar */}
        <div className="flex items-center gap-0.5 border-b border-border">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3 py-1.5 text-[11px] font-medium transition-colors border-b-2 ${
                activeTab === t.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "stocks" && <StockHeatmapTable />}
        {activeTab === "volProfile" && <VolumeProfileTable />}
        {activeTab === "bigTrades" && <BigTradeTracker />}
        {activeTab === "dom" && <DOMImbalanceTable />}
        {activeTab === "charts" && (
          <div className="space-y-3">
            <ReturnBuckets />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              <MarketVolume />
              <TotalOI />
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default MarketPage;
