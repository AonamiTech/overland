import { Navigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { readAuthIntent } from '@/auth/authIntent';
import MobileTabBar from '@/components/overland/MobileTabBar';
import InstallPrompt from '@/components/overland/InstallPrompt';
import HeroDirect from '@/components/overland/HeroDirect';
import ScrollStory from '@/components/ScrollStory';
import BookCards from '@/components/overland/BookCards';
import MarketNews from '@/components/overland/MarketNews';
import BookingEngine from '@/components/overland/BookingEngine';
import {
  AonNav,
  ProcessSection,
  AudienceSection,
  ProductsSection,
  LanesSection,
  FaqSection,
  AonFooter,
} from '@/components/overland/AonSections';

/**
 * Overland homepage.
 *
 * An open board for US freight, FTL and PTL. Anyone posts, anyone bids, everyone sees
 * the rate. Agree on a bid and each side gets the other's name, email and phone.
 * No cut, no dispatch, no custody, no payment handling. Email verification only.
 *
 * Deliberately short. Everything here is either the marketplace itself or an
 * explanation of how it works.
 *
 * Removed, and why:
 *  - Pricing. The board is open; posting, browsing and bidding cost nothing. A
 *    per-connection fee would also look like brokerage compensation (LEGAL-NOTES.md).
 *  - KPI band. "247 open auctions / 96.4% fill rate" were demo fixtures. Publishing
 *    invented performance figures is an FTC exposure.
 *  - Problem section. The board makes the argument better than an essay about it.
 *  - Testimonials and the integrations wall. Invented names, uncontracted logos.
 */
const Index = () => {
  const { user, loading } = useAuth();

  // A signed-in user wants the board, not the pitch. Hold render until the session is
  // restored so we never flash the marketing page at someone who is already in.
  if (loading) return <div className="min-h-screen bg-[#FAF9F7]" />;
  // Signed-in users land on the board, but the wordmark links here with ?home=1 so
  // the marketing page stays reachable rather than being an infinite bounce.
  const wantsHome = new URLSearchParams(window.location.search).has('home');
  const authDestination = readAuthIntent();
  if (user && !wantsHome && authDestination && authDestination !== '/') {
    return <Navigate to={authDestination} replace />;
  }
  if (user && !wantsHome) return <Navigate to="/board" replace />;

  return (
  <div className="min-h-screen bg-[#FAF9F7] pb-[64px] md:pb-0">
    <AonNav />
    {/* offset for the fixed ticker (38px) + nav (62px) */}
    <main className="pt-[100px]">
      {/* straight to the point: what it is, what lanes pay, how to start */}
      <HeroDirect />

      {/* the film is the second screen: scrolling it explains the whole model */}
      <ScrollStory />

      {/* the marketplace */}
      <BookCards />
      <MarketNews />
      <LanesSection />

      {/* how it works */}
      <ProcessSection />
      <BookingEngine />
      <ProductsSection />

      <AudienceSection />
      <FaqSection />
    </main>
    <AonFooter />
    <MobileTabBar />
      <InstallPrompt />
    </div>
  );
};

export default Index;
