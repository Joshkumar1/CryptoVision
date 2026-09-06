import React from "react";
import { EditorialFloatingHeader } from "@/components/flagship/EditorialFloatingHeader";
import { FloatingHeroCanvas } from "@/components/flagship/FloatingHeroCanvas";
import { InfiniteMarqueeTicker } from "@/components/flagship/InfiniteMarqueeTicker";
import { UnrushedKnowledgeSection } from "@/components/flagship/UnrushedKnowledgeSection";
import { GlobalInvestmentProfitCalculator } from "@/components/flagship/GlobalInvestmentProfitCalculator";
import { InvestmentImpactSimulator } from "@/components/flagship/InvestmentImpactSimulator";
import { ComposureAssetExplorer } from "@/components/flagship/ComposureAssetExplorer";
import { EditorialResearchLibrary } from "@/components/flagship/EditorialResearchLibrary";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import { InstitutionalAdvisorySection } from "@/components/flagship/InstitutionalAdvisorySection";
import { NumbersBehindSuccessSection } from "@/components/flagship/NumbersBehindSuccessSection";

export const FlagshipLandingPage: React.FC = () => {
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
        
        {/* Hero Canvas with Floating Ambient Cards & Editorial Typography */}
        <div id="intelligence">
          <FloatingHeroCanvas />
        </div>

        {/* Continuous Side-to-Side Horizontal Marquee Scrolling Band */}
        <InfiniteMarqueeTicker />

        {/* The 3 Pillars of Composure ("No Rushing of Information") */}
        <UnrushedKnowledgeSection />

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

        {/* Interactive Zen Asset Dossiers */}
        <ComposureAssetExplorer />

        {/* Due Diligence Library & Terminal Transition Gateway */}
        <EditorialResearchLibrary />

        {/* Institutional Advisory Callout Banner & Clean Minimalist Footer */}
        <div id="advisory">
          <InstitutionalAdvisorySection />
        </div>

      </main>

    </div>
  );
};
