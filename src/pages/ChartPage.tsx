import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { CoinTable } from "@/components/chart/CoinTable";
import { TradingChart } from "@/components/chart/TradingChart";

const ChartPage = () => {
  const [selectedCoin, setSelectedCoin] = useState("BTC");

  return (
    <PageLayout>
      <div className="flex h-full min-h-0">
        {/* Coin sidebar */}
        <div className="w-[360px] shrink-0">
          <CoinTable selectedCoin={selectedCoin} onSelectCoin={setSelectedCoin} />
        </div>
        {/* Chart area */}
        <div className="flex-1 min-w-0">
          <TradingChart coin={selectedCoin} />
        </div>
      </div>
    </PageLayout>
  );
};

export default ChartPage;
