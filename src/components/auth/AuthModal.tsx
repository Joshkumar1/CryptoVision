import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/stores/appStore";
import { CryptoTrendsNewsreel } from "@/components/auth/CryptoTrendsNewsreel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Brain,
  FlaskConical,
  ArrowRight,
  Wallet,
  Activity,
} from "lucide-react";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, setPersona } = useAppStore();

  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("analyst@cryptovision.ai");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login({
        name: email.split("@")[0] || "Institutional Trader",
        email,
        role: "Portfolio Strategist",
        tier: "INSTITUTIONAL",
        persona: "RESEARCH",
      });
      setIsLoading(false);
      closeAuthModal();
    }, 500);
  };

  const handleQuickDemoLogin = (role: "ANALYST" | "RESEARCH" | "EXPLORE") => {
    setIsLoading(true);
    setPersona(role);
    setTimeout(() => {
      if (role === "ANALYST") {
        login({
          name: "Marcus Vance, CFA",
          email: "marcus.vance@quantfund.io",
          role: "Lead Quant Strategist",
          tier: "INSTITUTIONAL",
          persona: "ANALYST",
        });
      } else if (role === "RESEARCH") {
        login({
          name: "Elena Rostova",
          email: "elena@crypto-research.org",
          role: "Senior Due Diligence Auditor",
          tier: "PRO",
          persona: "RESEARCH",
        });
      } else {
        login({
          name: "Jordan Blake",
          email: "jordan@explorecrypto.io",
          role: "Market Explorer",
          tier: "STARTER",
          persona: "EXPLORE",
        });
      }
      setIsLoading(false);
      closeAuthModal();
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-background/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 w-full max-w-5xl rounded-3xl bg-surface-1 border border-gold/40 shadow-2xl overflow-hidden card-highlight"
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-surface-0/80 border border-border/80 text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition-all shadow-md"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
            {/* Left side: Form */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-surface-1">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="gold" className="text-[10px] font-bold uppercase">
                    Terminal Gateway
                  </Badge>
                </div>
                <h2 className="text-xl font-black text-text-primary tracking-tight">
                  {authMode === "login" ? "Sign In to CryptoVision" : "Create Account"}
                </h2>
                <p className="text-xs text-text-secondary mt-1">
                  Access institutional crypto research, reality scores, and trend feeds.
                </p>
              </div>

              {/* 1-Click Role Profiles */}
              <div className="space-y-2 p-3 rounded-xl bg-surface-0/90 border border-border/80">
                <span className="text-[10px] font-bold text-text-tertiary uppercase block">
                  Instant Demo Profiles:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin("ANALYST")}
                    className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-400/30 text-left hover:bg-purple-500/25 transition-all text-[10px] font-bold text-purple-200 flex items-center gap-1"
                  >
                    <FlaskConical className="h-3 w-3" /> Analyst
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin("RESEARCH")}
                    className="p-1.5 rounded-lg bg-accent/15 border border-accent/30 text-left hover:bg-accent/25 transition-all text-[10px] font-bold text-accent flex items-center gap-1"
                  >
                    <Brain className="h-3 w-3" /> Research
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin("EXPLORE")}
                    className="p-1.5 rounded-lg bg-gold/15 border border-gold/30 text-left hover:bg-gold/25 transition-all text-[10px] font-bold text-gold flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" /> Explore
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-text-secondary">Email Address</label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 bg-surface-0 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-text-secondary">Password / Passkey</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-9 pr-9 bg-surface-0 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 bg-gold hover:bg-gold-hover text-surface-0 font-black text-xs uppercase shadow-md mt-2"
                >
                  {isLoading ? "Verifying..." : "Sign In"}
                </Button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("RESEARCH")}
                  className="w-full h-9 rounded-xl bg-surface-0 border border-border text-text-secondary hover:text-text-primary text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Wallet className="h-3.5 w-3.5 text-accent" /> Connect Web3 Vault
                </button>
              </form>

              <div className="pt-2 text-center text-[11px] text-text-tertiary">
                <button
                  onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                  className="text-gold font-bold hover:underline"
                >
                  {authMode === "login" ? "Don't have an account? Sign up" : "Already registered? Log in"}
                </button>
              </div>
            </div>

            {/* Right side: Newsreel */}
            <div className="lg:col-span-7 h-[420px] lg:h-auto min-h-[420px] p-2 bg-surface-0/60">
              <CryptoTrendsNewsreel compact />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
