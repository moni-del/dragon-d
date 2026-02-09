import { Toaster } from "@/ui/toaster";
import { Toaster as Sonner } from "@/ui/sonner";
import { TooltipProvider } from "@/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import DeveloperPortal from "./pages/DeveloperPortal";
import APKDeveloperPortal from "./pages/APKDeveloperPortal";
import APKDeveloperHub from "./pages/APKDeveloperHub";
import WebPortal from "./pages/WebPortal";
import MobileLogin from "./pages/MobileLogin";
import MobileDashboard from "./pages/MobileDashboard";
import MobileProducts from "./pages/MobileProducts";
import AdminProductManager from "./pages/AdminProductManager";
import AdminDiscountManager from "./pages/AdminDiscountManager";
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
          <Route path="/web" element={<WebPortal />} />
          <Route path="/mobile" element={<MobileLogin />} />
          <Route path="/mobile/dashboard" element={<MobileDashboard />} />
          <Route path="/mobile/products" element={<MobileProducts />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProductManager />} />
          <Route path="/admin/discounts" element={<AdminDiscountManager />} />
          <Route path="/developer" element={<DeveloperPortal />} />
          <Route path="/apk-developer" element={<APKDeveloperPortal />} />
          <Route path="/mobile-dev" element={<APKDeveloperHub />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
