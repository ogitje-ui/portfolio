# Geopolitical & breaking macro news — headline trading playbook

This is the reference file for lens 7. Its job is different from `macro-calendar.md`: that file covers events you can plan around in advance (FOMC, CPI, expiries); this one covers unscheduled breaking news — the actual headline-trading use case.

## Event category table (expanded)

| Category | Default BTC reaction | Why | Real 2025 example |
|---|---|---|---|
| War / military escalation | Sharp risk-off selloff, historically recovers within days if contained | Crypto trades as a high-beta risk asset; uncertainty triggers de-risking before any "digital gold" narrative kicks in | Israel's Jun 13, 2025 strikes on Iran: BTC ~$107k→~$103k (~4%) in a day, $1B+ liquidated. Recovered above $101k within days; rallied on the Jun 24 ceasefire headline. |
| Tariffs / trade war | Sharp risk-off, often the most severe category due to leverage cascades | Tariff headlines hit equities and crypto simultaneously, and crypto's leverage-heavy derivatives market amplifies the initial move | Trump's Apr 2, 2025 "Liberation Day" tariffs: BTC ~$88k→~$82k, reversed hard on the Apr 9 90-day-pause headline. Oct 2025 100% China tariff: BTC ~$122.5k→~$104.6k (~15%), ~$19B liquidated. |
| Central bank surprise commentary | Same as scheduled FOMC/CPI reaction, just unplanned | Rate-path repricing mechanism is identical whether the trigger is scheduled or not | (Mechanism identical to lens 6; watch for unscheduled Fed speeches/testimony) |
| Regulatory / legislative action | Idiosyncratic — can be bullish or bearish depending on content | Asset-specific news, not macro-correlated | Jun 24, 2025 Senate crypto bill headline compounded the Iran-ceasefire rally same day |
| Exchange / protocol-specific shock (hack, insolvency, depeg) | Idiosyncratic crypto-only risk-off | No TradFi/geopolitical transmission mechanism — it's a pure liquidity/confidence event | (Treat as a lens 2/lens 5 event, not a macro one) |
| Systemic TradFi stress (bank failures, currency crises) | Can decouple *positively* — "digital gold" bid | The one category where BTC has acted as an alternative store of value rather than a high-beta risk asset | March 2023 US regional banking crisis (SVB collapse) — BTC rallied while bank equities fell, a well-documented divergence from the usual risk-off pattern |

## The spike-fade-recover mechanic, in detail

Every tested 2025 episode above followed the same three-part shape:

1. **Initial spike** (minutes to hours): sharp move in the "obvious" direction, amplified well past what the news itself justifies because of forced liquidations — the Oct 2025 tariff episode alone wiped out ~$19B in leveraged positions, which mechanically deepens the move beyond organic selling.
2. **Stall**: once the forced-selling/buying is largely done (check lens 5 — OI dropping sharply after the spike is the tell), price stops making new extremes even though the news backdrop hasn't changed yet.
3. **Retrace**: over the following hours to days, price gives back some or all of the initial move as the market reprices the *actual* probability of continued escalation versus the initial worst-case pricing — often accelerated by a specific de-escalation headline (a ceasefire, a tariff pause) rather than a gradual drift.

**Practical implication for a scalper**: the highest-expectancy entries are usually not the first candle of the spike (illiquid, wide spreads, maximum overshoot risk) but either (a) a fade entry once lens 2 shows a stall/reversal structure on the lower timeframe, taken with a stop just beyond the spike extreme, or (b) a continuation entry only after confirming via lens 5 that the initial liquidation cascade has already cleared rather than still building.

## Live monitoring sources — tested

| Source | Type | Key required | Notes |
|---|---|---|---|
| Google News RSS search | Universal news search | No | `https://news.google.com/rss/search?q=<query>+when:1h&hl=en-US&gl=US&ceid=US:en` — most reliable option tested; swap the time window (`when:1h`, `when:1d`) and query freely |
| CoinDesk RSS | Crypto-native news | No | `https://www.coindesk.com/arc/outboundfeeds/rss/` |
| The Block RSS | Crypto-native news | No | `https://www.theblock.co/rss.xml` |
| GDELT Doc API | Global event/news database | No | `https://api.gdeltproject.org/api/v2/doc/doc?query=<query>&mode=artlist&format=json&sort=datedesc` — rate-limited to roughly one request per 5 seconds; returned persistent rate-limit messages when tested from this environment even when respecting that spacing, so treat as a backup source rather than the primary feed |
| Exa neural search | Semantic/deep-dive search | Yes (user-supplied, via environment variable — never hardcoded in this repo) | Better for digging into the background/analysis of a story once it's already broken than for catching the first alert |
| CryptoPanic | Crypto news aggregator with sentiment votes | Yes | The public endpoint returned a Cloudflare challenge page without a key when tested — needs a registered `auth_token` to use reliably |

## Headline Trade Protocol (full version)

1. **Verify**: is this from a primary source (wire service, official government/central-bank statement) or a single unconfirmed account? Wait for a second independent confirmation before sizing a real position — this costs a minute or two and filters out the large share of "breaking news" that turns out to be false or wildly overstated.
2. **Classify magnitude**:
   - *Tier 1* — major war escalation, systemic financial threat, surprise central-bank action. Moves the whole market, all asset classes.
   - *Tier 2* — regional/contained conflict, single-country tariff, expected-but-early Fed commentary. Moves crypto but with a smaller magnitude and shorter half-life than Tier 1.
   - *Tier 3* — rhetoric without concrete action, statements that get walked back same day. Usually noise; avoid trading Tier 3 headlines directly, they're a common source of whipsaw.
3. **Don't chase the first 1–5 minutes.** This window has the widest spreads, thinnest liquidity, and the highest odds of an overshoot that partially reverses.
4. **Cross-check the higher-timeframe bias** from lenses 1–6 (the swing-mode synthesis). A headline that fights the existing trend is a smaller, quicker counter-trend scalp; one that agrees with the existing trend is higher conviction and can be sized and held closer to normal.
5. **Check lens 5 (derivatives)**: is the liquidation cascade already largely done (better entry for a fade/continuation) or still actively building (higher risk of catching a falling knife)?
6. **Use a structure-based stop beyond the spike wick**, not a fixed percentage or a normal ATR-based stop — headline volatility routinely blows through stops sized for ordinary conditions.
7. **Time-box the trade.** Headline-driven edges decay quickly once the initial repricing is done; default to closing out same-session or within 24 hours rather than holding for a full swing-style target, unless lens 2 later confirms the move has become a genuine structural break (in which case it graduates into a normal swing thesis).
8. **Reduce position size** relative to a normal structure-based swing entry — headline ranges are wider and far less predictable than a level-based PA setup.

Sources: [CoinDesk — Bitcoin bounces to $106K after Iran-Israel jitters](https://www.coindesk.com/markets/2025/06/13/bitcoin-bounces-to-106k-after-iran-israel-jitters-but-analysts-warn-of-deeper-pullback), [Fortune — Bitcoin and crypto sink as Israel launches airstrikes against Iran](https://fortune.com/crypto/2025/06/13/bitcoin-crypto-market-israel-airstrikes-iran/), [Decrypt — Bitcoin rebounds as markets price in short-lived Iran conflict](https://decrypt.co/326424/bitcoin-rebounds-markets-price-short-lived-iran-conflict), [CNBC — Bitcoin price rises as Israel-Iran ceasefire begins, Senate unveils crypto bill](https://www.cnbc.com/2025/06/24/bitcoin-price-rises-on-israel-iran-ceasefire-senate-major-crypto-bill.html), [CryptoBriefing — Trump's Liberation Day tariffs send Bitcoin tumbling](https://cryptobriefing.com/trump-tariffs-market-turmoil-bitcoin/), [Fortune — Bitcoin, crypto prices rebound as Trump pauses tariffs for 90 days](https://fortune.com/crypto/2025/04/11/bitcoin-crypto-markets-whipsawed-tariff-turmoil/), [CNN — Trump's new 100% tariffs on China triggered a $19 billion crypto sell-off](https://www.cnn.com/2025/10/11/business/trump-tariffs-crypto-selloff), [Bitcoin Magazine — Bitcoin price dumps to $108,000 as Trump imposes 100% tariffs on China](https://bitcoinmagazine.com/news/bitcoin-price-crashes-to-108000-as-trump-to-impose-100-tariffs-on-china)
