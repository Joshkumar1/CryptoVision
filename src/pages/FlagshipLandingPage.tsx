import React, { useState } from "react";
import { EditorialFloatingHeader } from "@/components/flagship/EditorialFloatingHeader";
import { FloatingHeroCanvas } from "@/components/flagship/FloatingHeroCanvas";
import { InfiniteMarqueeTicker } from "@/components/flagship/InfiniteMarqueeTicker";
import { UnrushedKnowledgeSection } from "@/components/flagship/UnrushedKnowledgeSection";
import { GlobalInvestmentProfitCalculator } from "@/components/flagship/GlobalInvestmentProfitCalculator";
import { InvestmentImpactSimulator } from "@/components/flagship/InvestmentImpactSimulator";
import { ComposureAssetExplorer } from "@/components/flagship/ComposureAssetExplorer";
import { EditorialResearchLibrary } from "@/components/flagship/EditorialResearchLibrary";
import { InstitutionalAdvisorySection } from "@/components/flagship/InstitutionalAdvisorySection";
import { NumbersBehindSuccessSection } from "@/components/flagship/NumbersBehindSuccessSection";
import { EventPerformanceShowcase } from "@/components/flagship/EventPerformanceShowcase";

export const FlagshipLandingPage: React.FC = () => {
  // Primary default hero displays the 3D Animated Event Performance Dashboard (matching Image 1)
  const [heroMode, setHeroMode] = useState<"dashboard" | "coin">("dashboard");

  return (
    <div className="relative min-h-screen flex flex-col bg-[#080809] text-white antialiased selection:bg-white selection:text-black overflow-x-hidden w-full">
      
      {/* ══════════════════════════════════════════════════════════════
          1. FLOATING IVORY CAPSULE HEADER (UDUN REFERENCE SPEC)
          ══════════════════════════════════════════════════════════════ */}
      <EditorialFloatingHeader />

      {/* ══════════════════════════════════════════════════════════════
          2. MAIN CONTENT STREAM
          ══════════════════════════════════════════════════════════════ */}
      <main className="flex-1 w-full">
        
        {/* Hero Section: 3D Animated Event Performance Dashboard (Image 1) or Sovereign Coin */}
        <div id="intelligence">
          {heroMode === "dashboard" ? (
            <EventPerformanceShowcase
              isHero
              hasCoinOption
              onSwitchHeroMode={() => setHeroMode("coin")}
            />
          ) : (
            <FloatingHeroCanvas
              onSwitchHeroMode={() => setHeroMode("dashboard")}
            />
          )}
        </div>

        {/* Continuous Side-to-Side Horizontal Marquee Scrolling Band */}
        <InfiniteMarqueeTicker />

        {/* The 3 Pillars of Composure ("No Rushing of Information") */}
        <div id="philosophy">
          <UnrushedKnowledgeSection />
        </div>

        {/* Institutional Global Investment Impact Simulator (Historical Scenarios) */}
        <div id="simulator">
          <InvestmentImpactSimulator />
        </div>

        {/* Multi-Currency Global Investment Profit Calculator (Yesterday vs Today) */}
        <div id="calculator">
          <GlobalInvestmentProfitCalculator />
        </div>

        {/* Animated Numbers Behind Success Section */}
        <div id="numbers">
          <NumbersBehindSuccessSection />
        </div>

        {/* Dedicated Operations Section (Visible if coin is active in hero) */}
        {heroMode === "coin" && (
          <div id="operations">
            <EventPerformanceShowcase />
          </div>
        )}

        {/* Interactive Zen Asset Dossiers */}
        <div id="composure">
          <ComposureAssetExplorer />
        </div>

        {/* Due Diligence Library & Terminal Transition Gateway */}
        <div id="library">
          <EditorialResearchLibrary />
        </div>

        {/* Institutional Advisory Callout Banner & Clean Minimalist Footer */}
        <div id="advisory">
          <InstitutionalAdvisorySection />
        </div>

      </main>

    </div>
  );
};
