import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { AuthProvider } from "./auth/AuthContext";
import RouteMeta from "./components/RouteMeta";
import CompleteProfile from "./components/overland/CompleteProfile";
import AuthErrorBanner from "./components/overland/AuthErrorBanner";
import ErrorBoundaryFallback from "./components/overland/ErrorBoundaryFallback";
import RequireAuth from "./auth/RequireAuth";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const AuthDialog = lazy(() => import("./components/overland/AuthDialog"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const BoardPage = lazy(() => import("./pages/BoardPage"));

const queryClient = new QueryClient();

const App = () => (
  <Sentry.ErrorBoundary fallback={({ error, componentStack, eventId, resetError }) => (
    <ErrorBoundaryFallback error={error} componentStack={componentStack} eventId={eventId} resetError={resetError} />
  )}>
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </Sentry.ErrorBoundary>
);

export default App;
