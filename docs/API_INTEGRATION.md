# CryptoVision AI — API Integration Guide

## Architecture Overview

```
REAL DATA → VALIDATED DATA → NORMALIZED DATA → FEATURE ENGINEERING
→ ANALYTICAL ENGINES → EVIDENCE ENGINE → RISK / OPPORTUNITY / VALUATION
→ AI RESEARCH COPILOT → USER
```

All providers implement provider-agnostic interfaces. Analytical engines consume **only** normalized data models — never raw provider responses.

---

## Provider Matrix

| Provider | Purpose | Auth | Rate Limit | Refresh | Fallback |
|----------|---------|------|-----------|---------|----------|
| **CoinGecko** | Primary market data | API key (optional) | 30/min free, 500/min pro | 2-5 min | CMC |
| **CoinMarketCap** | Secondary market data | API key (required) | 30/min basic | 2-5 min | CoinGecko |
| **DeFiLlama** | DeFi fundamentals | None (free) | ~60/min | 15-60 min | None |
| **GitHub** | Developer intelligence | PAT (required) | 5000/hr authenticated | 6-24 hr | CoinGecko dev_data |
| **Binance** | Market microstructure | None (public) | 1200/min | 30-60 sec | None |
| **CryptoPanic** | Primary news | API key (required) | ~5/min free | 2-5 min | NewsData |
| **NewsData.io** | Fallback news | API key (required) | ~10/min | 2-5 min | None |
| **GoPlus** | Token security | API key (required) | 30/min | 1 hr | None |
| **Alternative.me** | Fear & Greed | None (free) | ~20/min | 10 min | None |
| **Alchemy** | On-chain data | API key (required) | 300/min | On-demand | QuickNode (future) |

---

## Provider Details

### CoinGecko
- **Environment**: `COINGECKO_API_KEY`, `COINGECKO_BASE_URL`, `ENABLE_COINGECKO`
- **Endpoints**: `/coins/markets`, `/coins/{id}`, `/coins/{id}/market_chart`, `/search/trending`, `/global`
- **Cache TTL**: 3 min (market), 30 min (detail)
- **Rate Limiting**: Sliding window 30/min, 2s min interval, circuit breaker at 5 failures
- **Failure Behavior**: Falls back to CoinMarketCap, then stale cache. SEED_DATA labeled as "DEMO".

### CoinMarketCap
- **Environment**: `COINMARKETCAP_API_KEY`, `ENABLE_CMC`
- **Endpoints**: `/v1/cryptocurrency/listings/latest`, `/v1/cryptocurrency/quotes/latest`, `/v2/cryptocurrency/info`, `/v1/global-metrics/quotes/latest`
- **Cache TTL**: 3 min
- **Rate Limiting**: 25/min, 2.5s min interval
- **Failure Behavior**: Returns null, system uses CoinGecko data only

### DeFiLlama
- **Environment**: `ENABLE_DEFILLAMA`
- **Endpoints**: `/protocol/{slug}`, `/fees/{slug}` (fees.llama.fi), yields, stablecoins, treasury, hacks
- **Cache TTL**: 30 min (TVL), 1 hr (fees/revenue)
- **No API key needed**

### GitHub
- **Environment**: `GITHUB_TOKEN`, `ENABLE_GITHUB`
- **Endpoints**: `/repos/{owner}/{repo}`, `/repos/{owner}/{repo}/stats/participation`, `/repos/{owner}/{repo}/contributors`, `/repos/{owner}/{repo}/releases`
- **Cache TTL**: 6-24 hours
- **Rate Limiting**: 55/min, 500ms interval
- **Note**: Stats endpoints return 202 (computing) on first call — retry after delay

### Binance
- **Environment**: `ENABLE_BINANCE`
- **Endpoints**: `/api/v3/klines`, `/api/v3/depth`, `/api/v3/ticker/24hr`
- **Cache TTL**: 45s (orderbook), 3 min (ticker)
- **Public endpoints — no authentication needed for market data**

### CryptoPanic
- **Environment**: `CRYPTOPANIC_API_KEY`, `ENABLE_NEWS`
- **Endpoints**: `/posts/` with filters
- **Cache TTL**: 3 min
- **Very restrictive free tier — 5 req/min**

### GoPlus
- **Environment**: `GOPLUS_API_KEY`, `ENABLE_SECURITY`
- **Endpoints**: `/token_security/{chainId}?contract_addresses=`
- **Cache TTL**: 1 hour
- **Chain IDs**: 1 (ETH), 56 (BSC), 137 (MATIC), 42161 (ARB)

### Alternative.me
- **Endpoints**: `/fng/?limit=` 
- **Cache TTL**: 10 min
- **Free public API — always available**
- **⚠️ Contextual sentiment ONLY — never used for scoring**

### Alchemy
- **Environment**: `ALCHEMY_API_KEY`, `ENABLE_ONCHAIN`
- **JSON-RPC Methods**: `eth_getBalance`, `alchemy_getTokenBalances`, `alchemy_getAssetTransfers`, `alchemy_getTokenMetadata`
- **Multi-chain**: ETH, Polygon, Arbitrum, Optimism, Base

---

## Infrastructure

### Caching
- **Tiered TTLs**: REALTIME (45s), MARKET (3min), FUNDAMENTAL (30min), DEVELOPER (6hr), HISTORICAL (24hr)
- **Stale fallback**: Expired cache data returned (labeled as stale) when providers fail
- **Key format**: `{provider}:{endpoint}:{params_hash}`

### Rate Limiting
- Per-provider sliding window with configurable limits
- Exponential backoff on 429/5xx responses
- Request deduplication (concurrent identical requests share one fetch)
- Circuit breaker: opens after N consecutive failures, auto-resets

### Data Quality
- Type validation, freshness checks, outlier detection
- Cross-provider consistency validation
- Every metric tracks: source, timestamp, quality, coverage

### Background Pipeline
- Scheduled tasks run independently of HTTP requests
- Market snapshot: every 2 min
- Global data: every 3 min
- News: every 3 min
- Sentiment: every 10 min
- Pre-computed features stored in in-memory feature store

---

## Normalized Data Flow

```
Provider Response
  ↓
Provider Adapter (implements interface)
  ↓
Normalized Data Model (NormalizedAsset, NormalizedMetric, etc.)
  ↓
Data Quality Validation (VALID/STALE/MISSING/CONFLICT/INVALID)
  ↓
Feature Store (pre-computed, cached)
  ↓
Analytical Engine (intelligence, reality check, financial, etc.)
  ↓
Evidence Engine (traceable to source + timestamp)
  ↓
API Response (with data freshness + provider attribution)
```

---

## Security Notes

- API keys stored in `.env` — NEVER committed to version control
- Frontend code NEVER sees API keys (all calls proxy through backend)
- `.gitignore` excludes `.env`, `.env.*` (except `.env.example`)
- JWT authentication on protected endpoints
- Rate limiting on all external provider calls

---

## Adding a New Provider

1. Create adapter in `server/src/providers/{name}.ts`
2. Implement the appropriate interface from `providers/interfaces.ts`
3. Add env vars to `config/env.ts` and `.env.example`
4. Register in `providers/init.ts`
5. Add rate limit config to `infra/rateLimiter.ts`
6. Update this documentation
