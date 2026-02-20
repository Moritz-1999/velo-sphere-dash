import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ChartPage from "./pages/ChartPage";
import FuturesPage from "./pages/FuturesPage";
import OptionsPage from "./pages/OptionsPage";
import MarketPage from "./pages/MarketPage";
import TradFiPage from "./pages/TradFiPage";
import AIPage from "./pages/AIPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/chart" replace />} />
          <Route path="/chart" element={<ChartPage />} />
          <Route path="/futures" element={<FuturesPage />} />
          <Route path="/options" element={<OptionsPage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/tradfi" element={<TradFiPage />} />
          <Route path="/ai" element={<AIPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
