
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import RouteMeta from "./components/RouteMeta";
import CompleteProfile from "./components/overland/CompleteProfile";
import AuthErrorBanner from "./components/overland/AuthErrorBanner";
import RequireAuth from "./auth/RequireAuth";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

/* Route-level code splitting. Index and NotFound stay eager - they are the entry
   points and lazying them only adds a round trip. Everything else loads on demand. */
const AuthDialog = lazy(() => import("./components/overland/AuthDialog"));
const BrokerDashboard = lazy(() => import("./components/BrokerDashboard"));
const FleetDashboard = lazy(() => import("./components/FleetDashboard"));
const CorporateDashboard = lazy(() => import("./components/CorporateDashboard"));
const PostLoadsPage = lazy(() => import("./components/PostLoadsPage"));
const HireTrucksPage = lazy(() => import("./components/HireTrucksPage"));
const PostTruckPage = lazy(() => import("./components/PostTruckPage"));
const FleetManagementPage = lazy(() => import("./components/FleetManagementPage"));
const GPSTrackingPage = lazy(() => import("./components/GPSTrackingPage"));
const FleetSupportPage = lazy(() => import("./components/FleetSupportPage"));
const ReportsAnalyticsPage = lazy(() => import("./components/ReportsAnalyticsPage"));
const SettingsPage = lazy(() => import("./components/SettingsPage"));
const CorporateBiddingExchange = lazy(() => import("./components/CorporateBiddingExchange"));
const CorporateBiddingPage = lazy(() => import("./components/CorporateBiddingPage"));
const BrokerBiddingExchange = lazy(() => import("./components/BrokerBiddingExchange"));
const FleetBiddingExchange = lazy(() => import("./components/FleetBiddingExchange"));
const FleetSettingsPage = lazy(() => import("./components/FleetSettingsPage"));
const CorporatePostLoadPage = lazy(() => import("./components/corporate/CorporatePostLoadPage"));
const CorporateBulkUploadPage = lazy(() => import("./components/corporate/CorporateBulkUploadPage"));
const CorporateERPIntegrationPage = lazy(() => import("./components/corporate/CorporateERPIntegrationPage"));
const CorporateLiveTrackingPage = lazy(() => import("./components/corporate/CorporateLiveTrackingPage"));
const CorporateInsuranceHubPage = lazy(() => import("./components/corporate/CorporateInsuranceHubPage"));
const CorporateBiddingDashboardPage = lazy(() => import("./components/corporate/CorporateBiddingDashboardPage"));
const CorporateAnalyticsPage = lazy(() => import("./components/corporate/CorporateAnalyticsPage"));
const CorporateSettingsPage = lazy(() => import("./components/corporate/CorporateSettingsPage"));

const TermsPage = lazy(() => import("./pages/TermsPage"));
const BoardPage = lazy(() => import("./pages/BoardPage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
      <BrowserRouter>
        <AuthDialog />
        <AuthErrorBanner />
        <CompleteProfile />
        <RouteMeta />
        <Suspense fallback={<div className="min-h-screen bg-[#FBFAF8]" />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/lane/:slug" element={<BoardPage />} />
          <Route path="/board" element={<RequireAuth><BoardPage /></RequireAuth>} />
          <Route path="/broker-dashboard" element={<BrokerDashboard />} />
          <Route path="/fleet-dashboard" element={<FleetDashboard />} />
          <Route path="/corporate-dashboard" element={<CorporateDashboard />} />
          <Route path="/post-loads" element={<PostLoadsPage />} />
          <Route path="/hire-trucks" element={<HireTrucksPage />} />
          <Route path="/post-truck" element={<PostTruckPage />} />
          <Route path="/fleet-management" element={<FleetManagementPage />} />
          <Route path="/gps-tracking" element={<GPSTrackingPage />} />
          <Route path="/fleet-support" element={<FleetSupportPage />} />
          <Route path="/reports-analytics" element={<ReportsAnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/fleet-settings" element={<FleetSettingsPage />} />
          <Route path="/corporate-bidding-exchange" element={<CorporateBiddingExchange />} />
          <Route path="/broker-bidding-exchange" element={<BrokerBiddingExchange />} />
          <Route path="/fleet-bidding-exchange" element={<FleetBiddingExchange />} />
          <Route path="/corporate-bidding" element={<CorporateBiddingPage />} />
          <Route path="/corporate/post-load" element={<CorporatePostLoadPage />} />
          <Route path="/corporate/bulk-upload" element={<CorporateBulkUploadPage />} />
          <Route path="/corporate/erp-integration" element={<CorporateERPIntegrationPage />} />
          <Route path="/corporate/live-tracking" element={<CorporateLiveTrackingPage />} />
          <Route path="/corporate/insurance-hub" element={<CorporateInsuranceHubPage />} />
          <Route path="/corporate/bidding-dashboard" element={<CorporateBiddingDashboardPage />} />
          <Route path="/corporate/analytics" element={<CorporateAnalyticsPage />} />
          <Route path="/corporate/settings" element={<CorporateSettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
