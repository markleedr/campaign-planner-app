import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CreateAdProof from "./pages/CreateAdProof";
import ProofView from "./pages/ProofView";
import CampaignDetail from "./pages/CampaignDetail";
import CampaignView from "./pages/CampaignView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateAdProof />} />
          <Route path="/create/:platform/:format" element={<Dashboard />} />
          <Route path="/campaign/:campaignId" element={<CampaignDetail />} />
          <Route path="/c/:shareToken" element={<CampaignView />} />
          <Route path="/proof/:shareToken" element={<ProofView />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
