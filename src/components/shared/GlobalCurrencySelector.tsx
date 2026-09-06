import React, { useState, useEffect } from "react";
import { Globe, Search, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CurrencyPreferenceService, SUPPORTED_CURRENCIES_MAP } from "@/lib/currency/CurrencyPreferenceService";
import type { CurrencyDefinition } from "@/lib/currency/CurrencyPreferenceService";

export const GlobalCurrencySelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyDefinition>(CurrencyPreferenceService.getSelectedCurrency());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Subscribe to currency changes project-wide
    const unsubscribe = CurrencyPreferenceService.subscribe((newCurr) => {
      setCurrentCurrency(newCurr);
    });
    return unsubscribe;
  }, []);

  const allCurrencies = Object.values(SUPPORTED_CURRENCIES_MAP);

  const filteredCurrencies = searchQuery.trim() === ""
    ? allCurrencies
    : allCurrencies.filter((c) =>
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.symbol.includes(searchQuery)
      );

  const handleSelectCurrency = (code: string) => {
    CurrencyPreferenceService.setCurrency(code);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      {/* HEADER TRIGGER BUTTON (Matches Refactoring UI Pill design) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-mono text-white transition-all cursor-pointer shadow-sm hover:border-[#00dc82]/40"
        title="Select Display Currency (Project-Wide)"
      >
        <span className="text-sm">{currentCurrency.flag}</span>
        <span className="font-bold text-white">{currentCurrency.code}</span>
        <span className="text-[#00dc82] font-semibold">{currentCurrency.symbol}</span>
      </button>

      {/* SEARCHABLE CURRENCY SELECTOR MODAL */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-lg rounded-3xl bg-[#0c0e14] border border-white/20 p-6 shadow-2xl overflow-hidden serene-card"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-[#00dc82]">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-base text-white">Select Display Currency</h3>
                    <p className="text-xs text-white/50 font-sans">Sets local valuation across all CryptoVision views</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Search Field */}
              <div className="relative mb-4">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search currency by code, name, or symbol..."
                  className="w-full rounded-2xl bg-black/60 border border-white/15 pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder-white/40 focus:outline-none focus:border-[#00dc82] transition-all"
                  autoFocus
                />
              </div>

              {/* Currency List */}
              <div className="max-h-80 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {filteredCurrencies.map((curr) => {
                  const isSelected = currentCurrency.code === curr.code;
                  return (
                    <button
                      key={curr.code}
                      type="button"
                      onClick={() => handleSelectCurrency(curr.code)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-mono transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#00dc82]/15 border border-[#00dc82]/40 text-white"
                          : "hover:bg-white/[0.06] text-white/70 hover:text-white border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{curr.flag}</span>
                        <div className="text-left">
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{curr.code}</span>
                            <span className="text-white/40">// {curr.name}</span>
                          </div>
                          <div className="text-[10px] text-white/50">
                            1 USD = {curr.symbol}{curr.rateToUsd} {curr.code}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm text-[#00dc82]">{curr.symbol}</span>
                        {isSelected && <Check className="h-4 w-4 text-[#00dc82]" />}
                      </div>
                    </button>
                  );
                })}

                {filteredCurrencies.length === 0 && (
                  <div className="py-8 text-center text-xs font-mono text-white/40">
                    No currencies matching "{searchQuery}"
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-white/40">
                <span>DETECTED LOCALE: {navigator.language || "en-US"}</span>
                <span>PERSISTED PREFERENCE</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
