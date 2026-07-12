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

## Sentiment (lenses 5, 7 cross-check)

| Metric | Endpoint | Read |
|---|---|---|
| Fear & Greed Index | `https://api.alternative.me/fng/?limit=7` | 0–100 composite. Contrarian at extremes: <20 extreme fear = bounce zone historically, >80 extreme greed = trim zone. Mid-range = no signal |

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
2. Funding + OI trend + long/short + taker flow → how is leverage positioned, who gets squeezed? (lens 5)
3. DVOL + F&G + put/call → is the crowd fearful or greedy, and is vol cheap or expensive? (contrarian layer)
4. Cross-asset regime table → does the macro tape confirm or veto? (lens 8)
5. News + calendar → what can interrupt today? (lenses 6, 7)
6. Stablecoin supply + dominance + ETH/BTC → slow-moving backdrop, weekly relevance not daily.

Signals only count when the faster layers (1–2) and the regime layer (4) agree; sentiment extremes (3) time entries within that agreement.
