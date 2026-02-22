import { PageLayout } from "@/components/layout/PageLayout";
import { SectorFlowTable } from "@/components/market/SectorFlowTable";
import { StockHeatmapTable } from "@/components/market/StockHeatmapTable";
import { VolumeProfileTable } from "@/components/market/VolumeProfileTable";
import { BigTradeTracker } from "@/components/market/BigTradeTracker";
import { DOMImbalanceTable } from "@/components/market/DOMImbalanceTable";
import { ReturnBuckets } from "@/components/market/ReturnBuckets";
import { MarketVolume } from "@/components/market/MarketVolume";
import { TotalOI } from "@/components/market/TotalOI";

const MarketPage = () => {
  return (
    <PageLayout>
      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-semibold">Market Overview</h1>
          <span className="text-[10px] text-muted-foreground">All F&O Stocks · 50 assets · Today</span>
        </div>

        {/* Sector Flow — hero table */}
        <SectorFlowTable />

        {/* Stock Heatmap + Volume Profile */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          <StockHeatmapTable />
          <VolumeProfileTable />
        </div>

        {/* Big Trade Tracker + DOM Imbalance */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          <BigTradeTracker />
          <DOMImbalanceTable />
        </div>

        {/* Return Buckets */}
        <ReturnBuckets />

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          <MarketVolume />
          <TotalOI />
        </div>
      </div>
    </PageLayout>
  );
};

export default MarketPage;
