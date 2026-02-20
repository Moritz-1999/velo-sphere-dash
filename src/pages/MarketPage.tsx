import { PageLayout } from "@/components/layout/PageLayout";
import { PriceChangesHeatmap } from "@/components/market/PriceChangesHeatmap";
import { FundingHeatmap } from "@/components/market/FundingHeatmap";
import { LiquidationsHeatmap } from "@/components/market/LiquidationsHeatmap";
import { OIChangesHeatmap } from "@/components/market/OIChangesHeatmap";
import { ReturnBuckets } from "@/components/market/ReturnBuckets";
import { MarketVolume } from "@/components/market/MarketVolume";
import { TotalOI } from "@/components/market/TotalOI";

const MarketPage = () => {
  return (
    <PageLayout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-semibold">Market Overview</h1>
          <span className="text-xxs text-muted-foreground">All Coins · 55 assets</span>
        </div>

        {/* Heatmap grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <PriceChangesHeatmap />
          <FundingHeatmap />
          <LiquidationsHeatmap />
          <OIChangesHeatmap />
        </div>

        {/* Return buckets */}
        <ReturnBuckets />

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <MarketVolume />
          <TotalOI />
        </div>
      </div>
    </PageLayout>
  );
};

export default MarketPage;
