import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ChartPage from "./pages/ChartPage";
import OptionsPage from "./pages/OptionsPage";
import MarketPage from "./pages/MarketPage";
import OIIntelPage from "./pages/OIIntelPage";
import TradFiPage from "./pages/TradFiPage";
import AlertsPage from "./pages/AlertsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/market" replace />} />
          <Route path="/chart" element={<ChartPage />} />
          <Route path="/options" element={<OptionsPage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/oi" element={<OIIntelPage />} />
          <Route path="/tradfi" element={<TradFiPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
