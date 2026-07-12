# Spot demand & institutional flow indicators

Both indicators in this file track *real* capital movement rather than leveraged positioning, which is why lens 4 outweighs the derivatives lens (lens 5) when they disagree.

## Coinbase Premium Index

**What it is**: the percentage difference between Coinbase's BTC-USD price and a reference "global" venue price (the standard reference is Binance BTC-USDT, adjusted for the USDT/USD peg). Coinbase is the dominant US institutional/whale on-ramp and the custodian behind several spot ETFs, so this premium is read as a proxy for **US spot buying/selling pressure specifically**, distinct from global (often Asia-led) flow.

```
Coinbase Premium % = (Coinbase_BTCUSD_price − Reference_price) / Reference_price × 100
```

- **Positive premium** (Coinbase trading above the reference) → net US spot buying pressure.
- **Negative premium / discount** (Coinbase trading below the reference) → net US selling pressure, or demand concentrated elsewhere (typically Asia).
- A premium that **flips sign** intraday or across a session is itself a signal worth cross-checking against the lens 2 structure read — e.g. a bounce off support with a flip to positive premium is a stronger reclaim than one with the premium still negative.

**Live sources, tested and confirmed working (no API key required)**:
- Coinbase spot price: `https://api.coinbase.com/v2/prices/BTC-USD/spot` or `https://api.exchange.coinbase.com/products/BTC-USD/ticker`
- Reference "global" price: **Binance via its public market-data domain `https://data-api.binance.vision/api/v3/ticker/price?symbol=BTCUSDT`** (tested working — this domain bypasses the geo-block that hits Binance's main API from some networks), which restores the traditional Binance BTC-USDT reference leg (adjust for the USDT/USD peg). Fallbacks: `https://api.kraken.com/0/public/Ticker?pair=XBTUSD` or OKX — both free, no key.
- This DIY computation is a close proxy, not an exact replica of any single vendor's proprietary formula — differences in exact reference venue and USDT/USD handling will cause small deviations from published Coinbase Premium Index values.

**Official/vendor source**: CryptoQuant publishes a "Coinbase Premium Index" as a named metric. Their API requires a free signup for a key (confirmed: unauthenticated requests return a clear 401 asking for a Bearer token) — the free tier is rate-limited/delayed; full real-time access is a paid plan.

## Spot BTC ETF net flows

**What it is**: daily net creation (inflow) or redemption (outflow) across the US spot BTC ETF complex — IBIT (BlackRock), FBTC (Fidelity), ARKB (Ark/21Shares), BITB (Bitwise), GBTC (Grayscale), and the rest. This is one of the highest-conviction institutional-demand signals available since ETF approval reshaped BTC's investor base (see `references/btc-cycle-history.md` for how this changed the 4-year cycle dynamics).

**Reading it**:
- Use a **5-day rolling net flow**, not a single day — single-day flows are noisy (a single large redemption from one fund can flip the daily total without reflecting a broader trend).
- Sustained multi-day **net inflows**, especially broad-based across multiple issuers rather than concentrated in one, are a strong markup/accumulation confirmation.
- Sustained multi-day **net outflows**, especially broad-based, are a strong markdown/distribution confirmation.
- Combine with the Coinbase Premium: both positive together = high-conviction real spot demand; both negative together = real distribution, treat any price bounce in that environment as leverage/short-covering-driven (cross-check lens 5) rather than durable.

**Live sources, tested**:
- **SoSoValue's public API** returned complete, current data with **no API key** when tested — `POST https://api.sosovalue.xyz/openapi/v2/etf/currentEtfDataMetrics` with body `{"type":"us-btc-spot"}` returns per-ticker daily net inflow/outflow, cumulative net inflow, total net assets, and discount/premium rate for every listed US spot BTC ETF. **Caveat**: this is an "openapi" path that is presumably meant to require a key — unauthenticated access worked at test time but is undocumented behavior and could be restricted or rate-limited without notice. Treat it as convenient-but-unofficial, not a guaranteed-stable integration.
- **Farside Investors** (`farside.co.uk/btc/`) is the most commonly cited free aggregator for this data among crypto traders, but it returned an HTTP 403 (bot/geo protection) when fetched directly in testing — likely still viewable in an ordinary browser, just not via a plain script/fetch from this environment.
- **CoinGlass** has a Bitcoin ETF dashboard (`coinglass.com/bitcoin-etf`) aggregating the same data as part of its broader free dashboard suite (already used elsewhere in this skill for derivatives data).
- For a fully sanctioned, stable integration, SoSoValue and CoinGlass both offer official API keys (free tiers available; check current terms before relying on them long-term).

## How this feeds the synthesis step

- Spot flow is a **primary pillar**, on par with PA/TA/cycle context for the "at least two of four agree" rule in the main skill file — not just a timing modifier like derivatives or the macro calendar.
- When spot flow conflicts with a leverage-driven move (e.g., price rallying on rising OI/positive funding but Coinbase premium negative and ETF flows net-outflow), treat the rally as suspect — it's being driven by derivatives positioning without real spot backing, which historically is more prone to a sharp reversal once the leveraged crowd is squeezed out (cross-reference `references/derivatives-timing.md`).

Sources: [CryptoQuant API — unauthorized-access error confirming key requirement](https://api.cryptoquant.com/v1/btc/market-data/coinbase-premium-index), [Coinbase Exchange public API](https://api.exchange.coinbase.com/products/BTC-USD/ticker), [Coinbase public spot price API](https://api.coinbase.com/v2/prices/BTC-USD/spot), [Kraken public Ticker API](https://api.kraken.com/0/public/Ticker?pair=XBTUSD), [SoSoValue — US BTC spot ETF page](https://sosovalue.com/assets/etf/us-btc-spot), [Farside Investors — BTC ETF flows](https://farside.co.uk/btc/), [CoinGlass — Bitcoin ETF dashboard](https://www.coinglass.com/bitcoin-etf)
