import React from "react";
import { EditorialFloatingHeader } from "@/components/flagship/EditorialFloatingHeader";
import { FloatingHeroCanvas } from "@/components/flagship/FloatingHeroCanvas";
import { UnrushedKnowledgeSection } from "@/components/flagship/UnrushedKnowledgeSection";
import { ComposureAssetExplorer } from "@/components/flagship/ComposureAssetExplorer";
import { EditorialResearchLibrary } from "@/components/flagship/EditorialResearchLibrary";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

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

        {/* The 3 Pillars of Composure ("No Rushing of Information") */}
        <UnrushedKnowledgeSection />

        {/* Interactive Zen Asset Dossiers */}
        <ComposureAssetExplorer />

        {/* Due Diligence Library & Terminal Transition Gateway */}
        <EditorialResearchLibrary />

      </main>

      {/* ══════════════════════════════════════════════════════════════
          3. EDITORIAL MINIMALIST FOOTER
          ══════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#050506] border-t border-white/10 text-white py-16 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black text-xs font-serif font-bold">
                ✦
              </span>
              <span className="font-sans font-bold text-base tracking-tight text-white">
                CryptoVision
              </span>
            </div>
            <p className="text-xs text-white/50 font-sans max-w-sm">
              Institutional intelligence and multi-model alpha synthesized with unhurried conviction.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-xs font-sans text-white/60">
            <Link to="/overview" className="hover:text-white transition-colors">
              Pro Terminal
            </Link>
            <Link to="/discover" className="hover:text-white transition-colors">
              Whale Radar
            </Link>
            <Link to="/news" className="hover:text-white transition-colors">
              Catalysts
            </Link>
            <Link to="/due-diligence" className="hover:text-white transition-colors">
              Due Diligence
            </Link>
            <Link to="/learn" className="hover:text-white transition-colors">
              Academy
            </Link>
            <Link to="/settings" className="hover:text-white transition-colors">
              Settings
            </Link>
          </div>

          <div className="text-[11px] font-mono text-white/35">
            © {new Date().getFullYear()} CRYPTOVISION // ALL RIGHTS RESERVED
          </div>

        </div>
      </footer>

    </div>
  );
};
