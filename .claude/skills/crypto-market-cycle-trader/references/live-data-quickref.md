# Live data quick reference — all tested endpoints, one page

Every endpoint below is free, requires no API key, and was tested working (July 2026). This is the one-stop list for briefings and live reads; the lens-specific reference files explain interpretation in depth.

## Price & spot flow (lenses 2, 4)

| Metric | Endpoint | Read |
|---|---|---|
| BTC spot (Coinbase) | `https://api.coinbase.com/v2/prices/BTC-USD/spot` | US institutional venue price |
| BTC spot (Kraken, reference) | `https://api.kraken.com/0/public/Ticker?pair=XBTUSD` | Compute Coinbase premium: (CB−KR)/KR |
| ETF flows | `POST https://api.sosovalue.xyz/openapi/v2/etf/currentEtfDataMetrics` body `{"type":"us-btc-spot"}` | 5-day rolling net flow; unofficial access, may break |
| Stablecoin supply | `https://stablecoins.llama.fi/stablecoins?includePrices=false` | Sum peggedUSD circulating. Growing supply = dry powder entering crypto (medium-term bullish); shrinking = capital leaving the ecosystem |
| BTC dominance + total mcap | `https://api.coingecko.com/api/v3/global` | Rising dominance in a downtrend = alts bleeding worse (risk-off within crypto); falling dominance in uptrend = alt season risk appetite |
| ETH/BTC | `https://api.kraken.com/0/public/Ticker?pair=ETHXBT` | Crypto-internal risk appetite: rising = risk-on rotation, falling = defensive BTC preference |

## Derivatives & positioning (lens 5)

| Metric | Endpoint | Read |
|---|---|---|
| Funding rate | `https://www.okx.com/api/v5/public/funding-rate?instId=BTC-USD-SWAP` | Positive = long-heavy; extremes are contrarian |
| Open interest | `https://www.okx.com/api/v5/public/open-interest?instId=BTC-USD-SWAP` | Track the 3–7 day trend (single venue proxy for aggregate); rising OI = leverage building |
| Long/short account ratio | `https://www.okx.com/api/v5/rubik/stat/contracts/long-short-account-ratio?ccy=BTC&period=1D` | Retail positioning skew; >1 = more long accounts. Read contrarian at extremes, and watch the *trend* (e.g. falling from 1.67 → 1.24 = longs capitulating) |
| Taker buy/sell volume | `https://www.okx.com/api/v5/rubik/stat/taker-volume?ccy=BTC&instType=CONTRACTS&period=1D` | Aggression gauge: taker buys > sells = market-buying pressure; divergence from price is the signal (price down + taker buys up = absorption) |
| DVOL (implied vol index) | `https://www.deribit.com/api/v2/public/get_volatility_index_data?currency=BTC&resolution=1D&start_timestamp=<ms>&end_timestamp=<ms>` | Options-market vol pricing: low DVOL (<40) = complacency/cheap optionality, often precedes expansion; spiking DVOL = stress being priced |
| Options put/call (by OI) | `https://www.deribit.com/api/v2/public/get_book_summary_by_currency?currency=BTC&kind=option` | Sum open_interest by instrument suffix -P vs -C; contrarian thresholds in derivatives-timing.md |
| CME basis | Yahoo `BTC=F` (see cross-asset syntax) vs spot | (futures − spot)/spot: healthy contango 5–15% annualized = normal institutional demand; flat/backwardation = institutions defensive; steep contango >20% = overheated |

## Dealer-positioning proxy / gamma walls (lens 5) — free, no key

Run `python3 .claude/skills/crypto-market-cycle-trader/scripts/gamma_walls.py` — computes from Deribit option OI (no key):
- **Gamma walls**: the largest-OI strikes act as magnets/pins into expiry and as high-friction levels intraday, because dealer delta-hedging concentrates there. Big **put walls below spot = support shelves**; **call walls above = resistance caps**. A move usually slows/stalls approaching a heavy wall and accelerates once through it (dealers flip from dampening to chasing).
- **Max pain**: strike minimizing total holder payout — a mild gravitational pin into expiry, never a precise target (see macro-calendar.md on expiry mechanics).
- **Near-dated P/C by OI**: >1 put-heavy/hedged, <0.7 call-heavy/greedy — contrarian.
- This is a *proxy*, not a true dealer gamma model (that needs per-option greeks and a dealer-side sign assumption, which free data can't give). Use it to explain *where* price meets friction and *which* levels are defended, cross-referenced with the lens-2 structure map — a gamma wall coinciding with a PA level is a much stronger level than either alone. The real aggregated dealer-gamma / liquidation-heatmap products remain key-gated (Coinglass).

## On-chain (lenses 1, 4) — Coin Metrics community API, free, no key

Endpoint: `https://community-api.coinmetrics.io/v4/timeseries/asset-metrics?assets=btc&metrics=<list>&frequency=1d&sort=time&start_time=<date>` (community tier = 31 BTC metrics, ~1-day lag; realized cap raw is paid but the ratios below are free).

| Metric | Read |
|---|---|
| `CapMVRVCur` — MVRV ratio | THE on-chain cycle-valuation anchor for lens 1: market cap ÷ realized cap. Historical cycle tops printed ~3.5–4+, bear bottoms <1, ~1.0–1.5 = accumulation/mid-bear territory. Slow signal — read weekly, adjusts cycle-phase confidence |
| `FlowInExUSD` / `FlowOutExUSD` | Exchange netflow (in − out): sustained net inflows = coins moving to exchanges to be sold (bearish); net outflows = withdrawal to cold storage (accumulation). Feeds lens 4 alongside ETF flows |
| `SplyExNtv` / `SplyExUSD` | Total supply sitting on exchanges — the stock version of the flow above; multi-week downtrend = supply squeeze backdrop |
| `AdrActCnt`, `TxCnt` | Network activity/usage trend — divergence from price is the signal |
| `HashRate` | Miner health; capitulation-style hashrate drops have historically clustered near cycle lows |

## Liquidations (lens 5) — OKX public, free, no key

`https://www.okx.com/api/v5/public/liquidation-orders?instType=SWAP&uly=BTC-USD&state=filled` — recent forced-liquidation prints (side, size, price). Single-venue proxy, not aggregate: use it to confirm *whether* a move was liquidation-driven and which side got flushed, and to spot cascades in progress (cluster of same-side prints). For USDT-margined add `uly=BTC-USDT`.

## Multi-venue funding & OI aggregation (lens 5) — six venues, no key

Aggregating across venues turns single-exchange readings into a Coinglass-style composite, and **cross-venue funding divergence is itself a signal** (one venue's crowd markedly more long/short than the rest = that venue's positioning gets flushed first).

| Venue | Endpoint | Notes |
|---|---|---|
| OKX | (see Derivatives section above) | Funding + OI + long/short + taker + liquidations |
| Deribit perp | `https://www.deribit.com/api/v2/public/ticker?instrument_name=BTC-PERPETUAL` | `funding_8h`, `open_interest` (USD), mark |
| Hyperliquid (DEX) | `POST https://api.hyperliquid.xyz/info` body `{"type":"metaAndAssetCtxs"}` | Per-asset funding (hourly rate) + OI in BTC; large venue, fully keyless |
| Bitget | `https://api.bitget.com/api/v2/mix/market/ticker?symbol=BTCUSDT&productType=USDT-FUTURES` | `fundingRate`, `holdingAmount` (OI in BTC) |
| KuCoin | `https://api-futures.kucoin.com/api/v1/contracts/XBTUSDTM` | `fundingFeeRate`, `openInterest` (lots), mark |
| Gate.io | `https://api.gateio.ws/api/v4/futures/usdt/contracts/BTC_USDT` | `funding_rate` (8h), mark |

Aggregation guidance: normalize funding to a common 8h basis (Hyperliquid publishes hourly — ×8), then read (a) the OI-weighted average funding as the composite crowd position, and (b) the spread between the most-positive and most-negative venue as the divergence signal. For OI, track each venue's 3–7 day *trend* rather than summing mixed units.

**Binance geo-block workaround**: `https://data-api.binance.vision/api/v3/ticker/price?symbol=BTCUSDT` — Binance's public market-data domain serves spot prices where the main API is region-blocked. Use it as the traditional reference leg of the Coinbase Premium (adjusting for USDT/USD), falling back to Kraken if unavailable. (Futures endpoints are not on this domain — venue table above covers derivatives.)

## DIY estimated liquidation clusters (lens 5) — heatmap approximation, no key

True aggregated liquidation heatmaps are Coinglass-proprietary (key-gated). A workable approximation, since liquidation price is a mechanical function of entry and leverage:

1. Identify where OI built up (the 3–7 day OI trend vs price — a sideways price with rising OI marks the entry zone).
2. Project liquidation clusters below (for longs) / above (for shorts) that zone at standard leverage-tier distances: **~2% away for 50x, ~4% for 25x, ~10% for 10x** (maintenance margins shift these slightly per venue).
3. Cross-check: a projected cluster that coincides with a PA liquidity pool (equal lows/highs, old range extremes) is a high-confidence magnet — same logic as lens 2's sweep zones, derived independently.
4. Confirm after the fact with OKX liquidation prints (endpoint above): if price enters the projected cluster and prints show the expected side being flushed, the map was right — trust the next projection more.

## Dealer gamma / market-maker positioning (lenses 5, 6) — DIY GEX from Deribit, no key

The model behind max-pain pinning and post-expiry volatility releases. Deribit's public options data makes a workable approximation free:

- Data: `get_book_summary_by_currency?currency=BTC&kind=option` gives per-instrument open interest; instrument names encode expiry + strike + P/C. `ticker?instrument_name=<opt>` returns greeks (gamma) per instrument for precision, or approximate gamma analytically from strike/expiry/DVOL.
- Method: assume dealers are net short the options the crowd is net long (standard simplification). Sum OI-weighted gamma per strike → find the **zero-gamma flip level** where net dealer gamma changes sign.
- Read: price **above** the flip = dealers hedge counter-trend (sell rallies, buy dips) → moves dampen, ranges hold, favor mean-reversion scalps. Price **below** the flip = dealers hedge with-trend (sell into falls) → moves amplify, breakdowns extend, favor momentum/continuation and wider targets.
- Near a big monthly/quarterly expiry (lens 6): high gamma concentration at a strike = pinning force toward it into settlement; the post-expiry gamma unwind is the volatility-release mechanic already described in macro-calendar.md.
- Caveat: the dealers-net-short assumption is a simplification the whole retail-GEX industry shares (SqueezeMetrics/SpotGamma-style); treat the flip level as a zone, not a line.

## Sentiment (lenses 5, 7 cross-check)

| Metric | Endpoint | Read |
|---|---|---|
| Fear & Greed Index | `https://api.alternative.me/fng/?limit=7` | 0–100 composite. Contrarian at extremes: <20 extreme fear = bounce zone historically, >80 extreme greed = trim zone. Mid-range = no signal |

## Computed TA indicators (lens 3) — from OHLC candles, no key

Pull candles: `https://data-api.binance.vision/api/v3/klines?symbol=BTCUSDT&interval=<4h|1h|1d>&limit=<n>` (each row: [openTime, O, H, L, C, V, ...]). Compute in-session; don't eyeball a chart.

- **Bollinger Bands BB(20,2)**: basis = 20-period SMA of closes; upper/lower = basis ± 2× population stdev. Report basis, upper, lower, band width % (=(upper−lower)/basis), and %B (=(price−lower)/(upper−lower); <0 = below lower band, >100 = above upper). **Breach ≠ reversal**: price closing outside a band is *stretched*, and in a trend it "walks the band." A lower-band breach only becomes a mean-reversion long on a **close back inside the band**; treat a breach that coincides with a structure level (a support zone / liquidity pool) as a higher-conviction reclaim setup than either alone. A squeeze (low band width) preceding the breach means volatility expansion — the move has fuel.
- **RSI(14)**, **ATR(14)** (stop distance), **20/50/200 SMA/EMA** stack: compute from the same candle pull as needed per lens 3.

## Cross-asset (lens 8)

Yahoo Finance chart API (browser User-Agent required): `https://query1.finance.yahoo.com/v8/finance/chart/<SYM>?interval=1d&range=5d` — symbols `GC=F` gold, `SI=F` silver, `CL=F` WTI, `BZ=F` Brent, `DX-Y.NYB` DXY, `^TNX` 10Y, `^VIX` VIX, `ES=F`/`NQ=F` equity futures, `BTC=F` CME bitcoin futures. Full interpretation in cross-asset-signals.md.

## News & events (lenses 6, 7)

| Feed | Endpoint |
|---|---|
| Google News search RSS | `https://news.google.com/rss/search?q=<query>+when:1d&hl=en-US&gl=US&ceid=US:en` |
| CoinDesk RSS | `https://www.coindesk.com/arc/outboundfeeds/rss/` |
| The Block RSS | `https://www.theblock.co/rss.xml` |
| BLS release schedules | `https://www.bls.gov/schedule/news_release/cpi.htm` (and `ppi.htm`) |

## Composite reading order for a briefing

1. Price + premium + ETF flows → is real money buying or selling? (lens 4)
2. Funding + OI trend + long/short + taker flow + liquidation prints → how is leverage positioned, who gets squeezed? (lens 5)
3. DVOL + F&G + put/call → is the crowd fearful or greedy, and is vol cheap or expensive? (contrarian layer)
4. Cross-asset regime table → does the macro tape confirm or veto? (lens 8)
5. News + calendar → what can interrupt today? (lenses 6, 7)
6. Weekly backdrop: stablecoin supply, dominance, ETH/BTC, MVRV, exchange netflow/supply → slow-moving, weekly relevance not daily.

Signals only count when the faster layers (1–2) and the regime layer (4) agree; sentiment extremes (3) time entries within that agreement.

## Open-source stacks (for going deeper than REST endpoints)

If the endpoint list above ever stops being enough, these maintained open-source projects rebuild Coinglass-class data from primary sources:

- **cryptofeed** (`github.com/bmoscon/cryptofeed`, Python) — real-time websocket aggregator across dozens of exchanges: trades, order books, **funding, open interest, and liquidation streams**. This is the genuine open-source Coinglass engine; requires running a persistent process (a small VPS or always-on machine), so it's a self-hosting upgrade path rather than something an ephemeral session can use.
- **CCXT** (`github.com/ccxt/ccxt`, Python/JS) — the standard unified REST/WS client for 100+ exchanges (`fetchFundingRate`, `fetchOpenInterest`, order books, OHLCV). Best way to widen venue coverage beyond the OKX/Deribit/Kraken/Coinbase endpoints used here without writing bespoke clients.
- **OpenBB** (`github.com/OpenBB-finance/OpenBB`, Python) — open-source financial terminal aggregating crypto + macro + equity providers under one API; useful if the cross-asset layer should grow past Yahoo.
- **Hyperliquid public API** (`api.hyperliquid.xyz/info`, no key) — a fully open derivatives venue: funding, OI, and liquidation data with no auth at all; useful as a second derivatives venue for confirming OKX readings.
- **coinglass-api** (`github.com/dineshpinto/coinglass-api`, Python) — clean wrapper for the real Coinglass API if a paid/free-tier Coinglass key is ever obtained; the fastest route to true *aggregated* liquidation heatmaps.
