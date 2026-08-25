import { useTechnicalIndicators } from "@/hooks/useMarketData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatPrice } from "@/lib/utils";
import { Activity, TrendingUp, TrendingDown, Gauge } from "lucide-react";

interface TechnicalSectionProps {
  coinId: string;
  currentPrice: number;
}

function SignalBadgeInline({ signal }: { signal: string }) {
  const isBull = signal === "Bullish" || signal === "Oversold";
  const isBear = signal === "Bearish" || signal === "Overbought";

  const variant = isBull ? "positive" : isBear ? "negative" : "secondary";

  return (
    <Badge variant={variant as any} className="font-bold text-xs uppercase tracking-wide">
      {signal}
    </Badge>
  );
}

function IndicatorRow({
  label,
  value,
  signal,
  detail,
}: {
  label: string;
  value: string;
  signal: string;
  detail?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-border/50 last:border-0 hover:bg-surface-2/40 px-2 rounded-lg transition-colors">
      <div className="flex flex-col gap-0.5 min-w-0 pr-4">
        <span className="text-sm font-bold text-text-primary">{label}</span>
        {detail && <span className="text-xs text-text-tertiary truncate">{detail}</span>}
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-sm font-mono font-bold text-text-primary tabular">{value}</span>
        <SignalBadgeInline signal={signal} />
      </div>
    </div>
  );
}

export function TechnicalSection({ coinId, currentPrice }: TechnicalSectionProps) {
  const { data: ta, isLoading, error } = useTechnicalIndicators(coinId);

  if (error) return null;

  return (
    <Card className="card-highlight">
      <CardHeader className="flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2.5 text-base font-bold">
          <Gauge className="h-4 w-4 text-accent" /> Technical Indicators
        </CardTitle>
        {ta?.overall && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-tertiary">Summary:</span>
            <Badge
              variant={
                ta.overall.signal === "Bullish"
                  ? "positive"
                  : ta.overall.signal === "Bearish"
                  ? "negative"
                  : "secondary"
              }
              className="font-bold text-xs gap-1.5"
            >
              {ta.overall.signal === "Bullish" && <TrendingUp className="h-3.5 w-3.5 text-positive" />}
              {ta.overall.signal === "Bearish" && <TrendingDown className="h-3.5 w-3.5 text-negative" />}
              {ta.overall.signal} ({ta.overall.bullishSignals} Bull / {ta.overall.bearishSignals} Bear)
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : ta ? (
          <div className="divide-y divide-border/40">
            <IndicatorRow
              label="Relative Strength Index (RSI 14)"
              value={ta.rsi.value.toFixed(2)}
              signal={ta.rsi.signal}
              detail={
                ta.rsi.value > 70
                  ? "Extreme Overbought Zone (>70) — high reversal risk"
                  : ta.rsi.value < 30
                  ? "Oversold Zone (<30) — potential accumulation"
                  : "Neutral Zone (30–70) — trend continuation"
              }
            />
            <IndicatorRow
              label="MACD Momentum (12, 26, 9)"
              value={ta.macd.value.toFixed(4)}
              signal={ta.macd.trend}
              detail={`Signal line: ${ta.macd.signal.toFixed(4)} • Histogram: ${ta.macd.histogram > 0 ? "+" : ""}${ta.macd.histogram.toFixed(4)}`}
            />
            <IndicatorRow
              label="20-Period Simple Moving Average"
              value={formatPrice(ta.movingAverages.sma20)}
              signal={ta.movingAverages.aboveSma20 ? "Bullish" : "Bearish"}
              detail={`Current price is ${ta.movingAverages.aboveSma20 ? "above" : "below"} the 20-day trend average`}
            />
            <IndicatorRow
              label="50-Period Simple Moving Average"
              value={formatPrice(ta.movingAverages.sma50)}
              signal={ta.movingAverages.aboveSma50 ? "Bullish" : "Bearish"}
              detail={`Current price is ${ta.movingAverages.aboveSma50 ? "above" : "below"} the 50-day baseline average`}
            />
            <IndicatorRow
              label="Bollinger Bands (20, 2)"
              value={`${ta.bollingerBands.width.toFixed(1)}% Bandwidth`}
              signal={
                ta.bollingerBands.position === "Within bands"
                  ? "Neutral"
                  : ta.bollingerBands.position === "Above upper band"
                  ? "Overbought"
                  : "Oversold"
              }
              detail={`Range: ${formatPrice(ta.bollingerBands.lower)} to ${formatPrice(ta.bollingerBands.upper)}`}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
