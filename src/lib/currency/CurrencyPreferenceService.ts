export interface CurrencyDefinition {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  locale: string;
  rateToUsd: number; // 1 USD = X Local Currency
}

export const SUPPORTED_CURRENCIES_MAP: Record<string, CurrencyDefinition> = {
  USD: { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", locale: "en-US", rateToUsd: 1.0 },
  INR: { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳", locale: "en-IN", rateToUsd: 83.50 },
  EUR: { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", locale: "de-DE", rateToUsd: 0.92 },
  GBP: { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧", locale: "en-GB", rateToUsd: 0.78 },
  JPY: { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵", locale: "ja-JP", rateToUsd: 148.20 },
  KRW: { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷", locale: "ko-KR", rateToUsd: 1340.0 },
  CNY: { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳", locale: "zh-CN", rateToUsd: 7.18 },
  AED: { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪", locale: "ar-AE", rateToUsd: 3.67 },
  SAR: { code: "SAR", name: "Saudi Riyal", symbol: "SR", flag: "🇸🇦", locale: "ar-SA", rateToUsd: 3.75 },
  SGD: { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬", locale: "en-SG", rateToUsd: 1.34 },
  AUD: { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺", locale: "en-AU", rateToUsd: 1.52 },
  CAD: { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦", locale: "en-CA", rateToUsd: 1.36 },
  CHF: { code: "CHF", name: "Swiss Franc", symbol: "Fr.", flag: "🇨🇭", locale: "de-CH", rateToUsd: 0.87 },
  HKD: { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰", locale: "zh-HK", rateToUsd: 7.82 },
  BRL: { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷", locale: "pt-BR", rateToUsd: 5.60 },
  MXN: { code: "MXN", name: "Mexican Peso", symbol: "Mex$", flag: "🇲🇽", locale: "es-MX", rateToUsd: 19.80 },
  ZAR: { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦", locale: "en-ZA", rateToUsd: 18.20 },
};

const STORAGE_KEY = "cv_user_display_currency";
const EVENT_NAME = "cv-currency-change";

export class CurrencyPreferenceService {
  /**
   * Auto-detect the user's currency based on browser locale and timezone
   */
  public static detectDefaultCurrency(): string {
    if (typeof window === "undefined") return "USD";

    // 1. Check existing saved preference
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_CURRENCIES_MAP[saved]) {
      return saved;
    }

    // 2. Infer from browser language & timezone
    const lang = (navigator.language || "").toLowerCase();
    const timeZone = (Intl.DateTimeFormat().resolvedOptions().timeZone || "").toLowerCase();

    if (lang.includes("in") || timeZone.includes("kolkata") || timeZone.includes("calcutta")) return "INR";
    if (lang.includes("gb") || timeZone.includes("london")) return "GBP";
    if (lang.includes("de") || lang.includes("fr") || lang.includes("es") || lang.includes("it") || timeZone.includes("paris") || timeZone.includes("berlin")) return "EUR";
    if (lang.includes("ja") || timeZone.includes("tokyo")) return "JPY";
    if (lang.includes("ko") || timeZone.includes("seoul")) return "KRW";
    if (lang.includes("ae") || timeZone.includes("dubai")) return "AED";
    if (lang.includes("sg") || timeZone.includes("singapore")) return "SGD";
    if (lang.includes("au") || timeZone.includes("sydney") || timeZone.includes("melbourne")) return "AUD";
    if (lang.includes("ca") || timeZone.includes("toronto") || timeZone.includes("vancouver")) return "CAD";
    if (lang.includes("cn") || timeZone.includes("shanghai")) return "CNY";
    if (lang.includes("hk") || timeZone.includes("hong_kong")) return "HKD";
    if (lang.includes("sa") || timeZone.includes("riyadh")) return "SAR";
    if (lang.includes("br") || timeZone.includes("sao_paulo")) return "BRL";
    if (lang.includes("mx") || timeZone.includes("mexico")) return "MXN";
    if (lang.includes("za") || timeZone.includes("johannesburg")) return "ZAR";
    if (lang.includes("ch") || timeZone.includes("zurich")) return "CHF";

    return "USD"; // Default fallback
  }

  /**
   * Get current selected currency code
   */
  public static getSelectedCurrencyCode(): string {
    return this.detectDefaultCurrency();
  }

  /**
   * Get full currency definition object
   */
  public static getSelectedCurrency(): CurrencyDefinition {
    const code = this.getSelectedCurrencyCode();
    return SUPPORTED_CURRENCIES_MAP[code] || SUPPORTED_CURRENCIES_MAP.USD;
  }

  /**
   * Set user currency preference and broadcast event to subscribers
   */
  public static setCurrency(code: string): void {
    if (!SUPPORTED_CURRENCIES_MAP[code]) return;
    localStorage.setItem(STORAGE_KEY, code);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: SUPPORTED_CURRENCIES_MAP[code] }));
  }

  /**
   * Listen for currency preference changes
   */
  public static subscribe(callback: (currency: CurrencyDefinition) => void): () => void {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<CurrencyDefinition>;
      callback(custom.detail);
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }

  /**
   * Format any USD amount into user's display currency
   */
  public static formatUsdToDisplay(usdAmount: number, overrideCode?: string): { formatted: string; raw: number; currency: CurrencyDefinition } {
    const curr = overrideCode ? (SUPPORTED_CURRENCIES_MAP[overrideCode] || SUPPORTED_CURRENCIES_MAP.USD) : this.getSelectedCurrency();
    const localVal = usdAmount * curr.rateToUsd;

    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: curr.code,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: localVal < 10 && localVal > 0 ? 2 : 0,
      maximumFractionDigits: localVal < 10 ? 4 : 2,
    }).format(localVal);

    return {
      formatted: `${curr.symbol}${new Intl.NumberFormat("en-US", {
        minimumFractionDigits: localVal < 10 && localVal > 0 ? 2 : 0,
        maximumFractionDigits: localVal < 10 ? 2 : 2,
      }).format(localVal)}`,
      raw: localVal,
      currency: curr,
    };
  }
}
