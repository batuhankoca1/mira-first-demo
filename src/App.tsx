import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Closet from "./pages/Closet";
import CategoryDetail from "./pages/CategoryDetail";
import DressUp from "./pages/DressUp";
import AIStylist from "./pages/AIStylist";
import Explore from "./pages/Explore";
import Marketplace from "./pages/Marketplace";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { WardrobeProvider } from "@/hooks/useWardrobe";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <WardrobeProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/closet" replace />} />
            <Route path="/closet" element={<Closet />} />
            <Route path="/closet/:category" element={<CategoryDetail />} />
            <Route path="/dressup" element={<DressUp />} />
            <Route path="/stylist" element={<AIStylist />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/:id" element={<ProductDetail />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </WardrobeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
