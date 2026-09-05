import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppStore } from "@/stores/appStore";
import { CryptoTrendsNewsreel } from "@/components/auth/CryptoTrendsNewsreel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Brain,
  FlaskConical,
  ShieldCheck,
  Zap,
  ArrowRight,
  Wallet,
  CheckCircle2,
  Activity,
} from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, setPersona } = useAppStore();

  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("analyst@cryptovision.ai");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
      navigate("/overview");
    }, 600);
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
      navigate("/overview");
    }, 450);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-2 sm:p-4 max-w-7xl mx-auto font-ranade inner-app">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 w-full items-stretch">
        {/* ── Left Column: Authentication Form & Quick Demo Logins ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-surface-1/95 border border-gold/30 shadow-2xl card-highlight space-y-6"
        >
          {/* Brand Header */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Link to="/overview" className="flex items-center gap-2.5 group">
                <div className="h-9 w-9 rounded-xl gradient-accent flex items-center justify-center font-bold text-white shadow-accent ring-1 ring-gold/40 group-hover:scale-105 transition-transform">
                  CV
                </div>
                <div className="font-extrabold text-base tracking-tight text-text-primary">
                  CryptoVision <span className="text-gold">AI</span>
                </div>
              </Link>
              <Badge variant="gold" className="text-[10px] font-bold uppercase tracking-wider">
                Terminal Access v2.5
              </Badge>
            </div>

            <h1 className="text-2xl font-black text-text-primary tracking-tight leading-tight">
              {authMode === "login" ? "Sign In to Intelligence Terminal" : "Create Intelligence Account"}
            </h1>
            <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
              Access verifiable on-chain telemetry, reality check matrices, and multi-signal market radar.
            </p>
          </div>

          {/* Quick 1-Click Role Profiles */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-surface-0/85 border border-border/80 shadow-inner">
            <div className="flex items-center justify-between text-[11px] font-bold text-text-tertiary uppercase tracking-wider">
              <span>Instant 1-Click Demo Profiles:</span>
              <span className="text-gold">Select Mode</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("ANALYST")}
                className="p-2 rounded-xl bg-purple-500/15 border border-purple-400/30 hover:border-purple-400 text-left hover:bg-purple-500/25 transition-all group"
              >
                <div className="flex items-center gap-1 text-[10px] font-black text-purple-300">
                  <FlaskConical className="h-3 w-3" /> Analyst
                </div>
                <div className="text-[9px] text-text-tertiary mt-0.5 group-hover:text-text-secondary truncate">
                  Institutional Quant
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin("RESEARCH")}
                className="p-2 rounded-xl bg-accent/15 border border-accent/30 hover:border-accent text-left hover:bg-accent/25 transition-all group"
              >
                <div className="flex items-center gap-1 text-[10px] font-black text-accent">
                  <Brain className="h-3 w-3" /> Research
                </div>
                <div className="text-[9px] text-text-tertiary mt-0.5 group-hover:text-text-secondary truncate">
                  Due Diligence
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin("EXPLORE")}
                className="p-2 rounded-xl bg-gold/15 border border-gold/30 hover:border-gold text-left hover:bg-gold/25 transition-all group"
              >
                <div className="flex items-center gap-1 text-[10px] font-black text-gold">
                  <Sparkles className="h-3 w-3" /> Explore
                </div>
                <div className="text-[9px] text-text-tertiary mt-0.5 group-hover:text-text-secondary truncate">
                  Beginner Visual
                </div>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary block">Work / Institutional Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@fund.com"
                  className="pl-10 h-10 bg-surface-0 border-border/90 text-xs font-medium focus:border-gold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-text-secondary">Terminal Passkey / Password</label>
                {authMode === "login" && (
                  <button
                    type="button"
                    onClick={() => alert("Password reset link sent to registered email.")}
                    className="text-[11px] text-accent hover:underline font-semibold"
                  >
                    Forgot passkey?
                  </button>
                )}
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter security key"
                  className="pl-10 pr-10 h-10 bg-surface-0 border-border/90 text-xs font-mono font-medium focus:border-gold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-text-secondary select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border bg-surface-0 text-gold focus:ring-gold/30"
                />
                <span>Remember terminal session</span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gold hover:bg-gold-hover text-surface-0 font-black text-xs tracking-wide uppercase shadow-lg shadow-gold/20 flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Activity className="h-4 w-4 animate-spin" /> Verifying Credentials...
                </span>
              ) : (
                <>
                  <span>{authMode === "login" ? "Enter Intelligence Station" : "Create Account"}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            {/* Web3 Wallet Connect Option */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("RESEARCH")}
                className="w-full h-10 rounded-xl bg-surface-0 border border-border/90 hover:border-accent/60 text-text-secondary hover:text-text-primary text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Wallet className="h-4 w-4 text-accent" />
                <span>Connect Web3 Vault (MetaMask / Phantom)</span>
              </button>
            </div>
          </form>

          {/* Footer switch */}
          <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs text-text-tertiary">
            <span>
              {authMode === "login" ? "New institutional user?" : "Already have an account?"}
            </span>
            <button
              onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
              className="font-extrabold text-gold hover:underline"
            >
              {authMode === "login" ? "Create Free Account" : "Sign In Here"}
            </button>
          </div>
        </motion.div>

        {/* ── Right Column: Interactive Crypto Trends Newsreel Showcase ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-7 h-[620px] lg:h-auto min-h-[520px]"
        >
          <CryptoTrendsNewsreel autoPlayInterval={6500} />
        </motion.div>
      </div>
    </div>
  );
}
