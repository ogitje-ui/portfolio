---
name: crypto-market-cycle-trader
description: Use when analyzing Bitcoin or crypto markets for trading decisions, scalp or swing entries, or reacting to breaking news — e.g. "analyze BTC", "where are we in the cycle", "is this a good entry/exit", "build a trading plan", "read the market structure", "check funding/OI before I lever up", "when should I look for entries", "what's the put/call ratio saying", "check Coinbase premium", "how are the ETFs flowing", "should I trade this headline", "Iran/Israel/war/tariff headline just hit", "what's gold/oil/DXY saying". Synthesizes technical analysis (TA), Wyckoff-style price action (PA), the BTC 4-year halving cycle, spot demand flow (Coinbase Premium Index, spot BTC ETF net inflows/outflows), futures/options positioning (funding, open interest, live put/call ratio), the TradFi + crypto macro/volatility calendar (FOMC, CPI/PPI, NFP, witching days, options/futures expiries), geopolitical/breaking-news headline risk (war, tariffs, regulatory shocks) with a scalp-oriented Headline Trade Protocol, a cross-asset commodities tape (DXY, gold, oil, silver, yields, VIX, equity futures) as regime filter and headline verifier, and an optional astrological timing overlay into one structured playbook drawing on the methods of well-known crypto traders (Trader Mayne, TraderXO, and others). Not financial advice — an analytical checklist, not a signal generator.
---

# Crypto Market Cycle Trader

A structured framework for reading Bitcoin/crypto markets by layering nine lenses, each weighted by how much *evidence* it actually carries. Evidence-heavy lenses (price action, TA, cycle context, spot demand flow, derivatives, macro/volatility calendar, geopolitical headline risk, cross-asset commodities/macro tape) drive the trade thesis and its timing. The astrology lens is a low-weight sentiment/volatility overlay only — it never drives direction on its own.

## Who this framework draws from

- **Trader Mayne** — price-action trader since 2013 (support/resistance, ranges, liquidity sweeps); co-founded the Breakout prop firm; survived the FTX collapse and rebuilt; known for pairing pure PA with cycle/sentiment reads and occasional Gann/astro timing notes as a minor overlay, not a core signal.
- **TraderXO** — Wyckoff-based order-flow and market-structure trader (accumulation → markup → distribution → markdown), publishes price-action and mindset breakdowns on Substack/X.
- **Other reference points** — Arthur Hayes (macro liquidity/leverage-cycle commentary), Michael Saylor (cycle-agnostic long-horizon accumulation thesis, useful as a contrarian counterweight to pure cycle timing), and on-chain analysts in the Glassnode/CryptoQuant tradition (used here for the derivatives/positioning lens).

This is methodology synthesis, not copy-trading. See `references/trader-playbooks.md` for the expanded notes on each.

## Timeframe adaptation: scalp vs. swing

This framework serves both a several-hours scalp and a multi-day swing — read each lens on a timeframe matched to the trade being considered, not a fixed weekly cadence:

- **Scalp (minutes–hours)**: lens 2 (PA) on the 5m/15m/1h chart for structure and liquidity sweeps; lens 7 (geopolitical/headline risk) is frequently the *primary trigger* — see its Headline Trade Protocol, which runs as its own fast-path and does not wait for the full weighted synthesis below. Lenses 1, 4, 5 (cycle, spot flow, derivatives) are too slow-moving to trigger a scalp themselves — use them only as a quick background check ("does this scalp fight the higher-timeframe trend?").
- **Swing (days)**: run the full eight-lens weighted synthesis at the daily/4h timeframe as designed below; cycle context and spot flow carry real weight here since they move on a similar timescale.
- Either way, lens 6 (scheduled macro calendar) tells you whether you're trading into a known volatility window regardless of style.

## The nine-lens framework

Run these in order. Each produces one line of output; the synthesis step at the end combines them.

### 1. Cycle context (macro timing) — weight ~5%
- Compute months since/until the nearest halving.
- Historical pattern (see `references/btc-cycle-history.md` for the full table): bull tops have clustered 12–18 months post-halving; peak-to-trough bear drawdowns have run 77–85%; bear bottoms have historically formed before the next halving.
- **State explicitly that this pattern is contested for the current cycle** — the post-2024-halving year broke the "always green" pattern for the first time, and ETF/institutional flows are cited as a structural change. Treat cycle position as a *prior*, not a rule.
- **On-chain valuation anchor**: check live MVRV (free via Coin Metrics community API, see `references/live-data-quickref.md`) — historical cycle tops ~3.5–4+, bear bottoms <1, ~1.0–1.5 = accumulation/mid-bear. Date-based cycle timing and MVRV agreeing raises phase confidence; disagreeing lowers it.
- Output: label the likely phase — Accumulation / Early Markup / Late Markup-Euphoria / Distribution / Markdown-Bear — with a confidence level, not certainty.

### 2. Price action & market structure (Wyckoff / PA lens) — weight ~25%, highest
- Identify the Wyckoff phase on the relevant timeframe (accumulation range with spring, sign-of-strength, markup; or distribution range with upthrust, sign-of-weakness, markdown).
- Map key support/resistance and liquidity pools: equal highs/lows, prior range extremes, untested order blocks.
- Look for liquidity sweeps / stop hunts *before* trusting a move — a break of structure on thin volume that immediately reverses is a sweep, not a breakout.
- Note market-structure shifts: higher-high/higher-low sequences (bullish) vs lower-high/lower-low (bearish), and the specific level where structure would flip.

### 3. Technical analysis confirmation (TA) — weight ~15%
- Trend: 50/100/200-period moving averages on daily/weekly; is price above or below, and are the MAs stacked in order?
- Momentum: RSI, especially divergence at range extremes (price higher-high, RSI lower-high = bearish divergence, and vice versa).
- Volatility/risk sizing: ATR or Bollinger Band width for stop distance.
- Volume must confirm breakouts/breakdowns — a Wyckoff sign-of-strength on low volume is suspect.

### 4. Spot demand & institutional flow — weight ~15%
This lens tracks *real* capital, not leverage — that's why it's weighted above the derivatives lens. A dollar of ETF inflow or Coinbase-driven spot buying reflects an actual position taken; a dollar of futures OI is a bet that can unwind without any BTC changing hands.

- **Coinbase Premium Index**: the % difference between Coinbase's BTC-USD price and a reference global venue price (traditionally Binance BTC-USDT). Coinbase is the primary US institutional/whale on-ramp (and the custodian behind several spot ETFs), so a sustained **positive premium** signals net US spot buying pressure; a sustained **negative premium/discount** signals US selling pressure or demand concentrated outside the US instead. Treat a premium that flips sign as a flag worth cross-checking against lens 2's structure read.
- **Spot BTC ETF net flows** (IBIT, FBTC, ARKB, BITB, GBTC, and the rest of the US spot-ETF complex): multi-day sustained **net inflows** are one of the strongest available confirmations of a real markup phase; sustained **net outflows** (especially broad-based, not just one fund rotating into another) are a strong markdown/distribution confirmation. A single day is noisy — read it as a **5-day rolling net flow**, the same discipline used for the put/call ratio in lens 6.
- **Combine the two**: positive Coinbase premium + positive ETF net flows in the same window = high-conviction confirmation of real spot demand behind a move (not just short-covering or leveraged momentum). Both negative at once = real distribution, treat any bounce as suspect until they turn.

**Slow-moving backdrop feeds** (weekly relevance, endpoints in `references/live-data-quickref.md`): total stablecoin supply (growing = dry powder entering, shrinking = capital leaving), BTC dominance (rising in a downtrend = alts bleeding worse), and ETH/BTC (crypto-internal risk appetite).

Full live-data endpoints, the DIY Coinbase-premium formula, and a fuller flow-reading walkthrough in `references/spot-flow-indicators.md`.

### 5. Futures & options positioning (entry timing) — weight ~10%
Use this to time entries *within* a thesis already built from lenses 1–4, not to generate a thesis on its own.

| Open interest | Funding rate | Price | Read |
|---|---|---|---|
| Rising | Positive | Rising | Trend confirmed by new money, but crowd is long — watch for long-squeeze risk if it stalls |
| Rising | Negative | Falling | Trend confirmed, crowd is short — watch for short-squeeze risk if it stalls |
| Rising | Either | Flat/chopping | Leverage stacking without resolution — "stored energy," expect a sharp move soon |
| Falling | Either | Any | Positions closing/deleveraging — often the tail end of a move, not the start |

**Live put/call ratio** (options positioning, checked alongside funding/OI): pull the *live* BTC options put/call ratio (volume or open-interest basis) from Deribit's own stats page or an aggregator (Coinglass, Laevitas, The Block). Read it the same contrarian way CBOE's equity put/call ratio is read in TradFi, since crypto options skew responds to the same fear/greed mechanics:

| Put/call ratio | Literal read | Contrarian read |
|---|---|---|
| < ~0.7 (crypto) / < 0.45 (CBOE equity) | Call-heavy — bullish positioning | Speculative excess / greed — caution on new longs |
| ~0.7–1.0 | Balanced-to-call-tilted | No strong contrarian signal |
| > 1.0 | Put-heavy — bearish positioning / hedging | Elevated fear — often a better setup for longs than shorts |
| > ~1.2 (crypto extreme) / > 1.23 (CBOE extreme) | Heavy put buying | Capitulation-style extreme — classic contrarian bounce zone |

Use the **5–10 day moving average** of the ratio, not a single reading — daily put/call prints are noisy and a one-day spike (e.g. a single large hedge trade) is not a sentiment shift. Treat this as a fear/greed cross-check on top of funding/OI, most useful for confirming (or fading) an already-extreme funding/OI reading rather than as a standalone trigger.

**Additional positioning/sentiment feeds** (all free/no-key, endpoints + interpretation in `references/live-data-quickref.md`): open interest trend (OKX), retail long/short account ratio (contrarian at extremes, trend matters), taker buy/sell volume (aggression/absorption divergences), DVOL implied-vol index (low = complacency before expansion, spike = stress priced), CME basis (institutional demand gauge: healthy contango vs defensive backwardation), and the Fear & Greed Index (<20 contrarian bounce zone, >80 trim zone).

Full detail and a walk-through in `references/derivatives-timing.md`.

### 6. Macro & volatility calendar (scheduled event-risk timing) — weight ~10%
Crypto trades as a risk asset and is directly sensitive to TradFi macro prints and derivatives-expiry mechanics. This lens doesn't generate direction on its own — its job is to flag *when* volatility is structurally elevated (or artificially suppressed) so entries/exits are timed around it rather than into it.

- **FOMC meeting days** (rate decision 14:00 ET + press conference 14:30 ET) — the single highest-impact scheduled event for both TradFi and crypto; historically produces outsized, often two-sided ("whipsaw then trend") moves.
- **CPI / PPI release days** (BLS, ~8:30 AM ET, typically the second/mid-month) — inflation surprises versus consensus are a top driver of rate-path repricing and correlated crypto volatility.
- **NFP / jobs report** (first Friday of the month, ~8:30 AM ET) — same mechanism as CPI, smaller average impact but still a reliable volatility spike.
- **Quad/triple witching** (third Friday of Mar/Jun/Sep/Dec in equities) — simultaneous index option, index future, and single-stock option expiry; drives elevated TradFi volume/volatility that frequently bleeds into crypto via correlation and cross-asset de-risking flows.
- **Crypto options & futures expiries** — Deribit BTC/ETH options expire monthly (last Friday, 08:00 UTC) with the largest notional on the quarterly cycle (last Friday of Mar/Jun/Sep/Dec); CME BTC futures roll monthly on a similar late-month schedule. Large expiries can *pin* price near the "max pain" strike into settlement, then release directional volatility once options-driven hedging flow unwinds.
- **Other recurring high-vol days**: Fed Chair speeches, the annual Jackson Hole Symposium (late August), and any scheduled testimony/press event tied to rates or regulation.

Rule of thumb: avoid opening *new* directional risk in the 24–48h window immediately before a high-impact print (FOMC/CPI/PPI/NFP) unless already riding a confirmed trend — the pre-event window is disproportionately prone to stop-hunts in both directions. Prefer entries *after* the print confirms a direction over pre-positioning for a guess. Around large options/futures expiries, expect potential pre-expiry pinning followed by a volatility release in the 24h after settlement — reduce leverage into the expiry itself rather than into the release.

Full 2026 dates and a weekly-event checklist in `references/macro-calendar.md`.

### 7. Geopolitical & breaking macro news (headline risk) — weight ~12%, and the primary scalp trigger
Distinct from lens 6: this covers *unscheduled* breaking news — war, tariffs, surprise central-bank commentary, regulatory action, exchange-specific shocks — the stuff actually traded on a headline basis. It carries real weight in the structural synthesis (a live war or tariff shock should shift the swing-level bias), and it also runs as its own standalone fast-path for scalping, described below.

**Event categories & default BTC reaction** — grounded in real 2025 episodes, not just theory:
- **War/military escalation**: default is a sharp *risk-off* selloff, not a safe-haven bid. When Israel struck Iran on Jun 13, 2025, BTC fell ~4% (~$107k→$103k) within a day with over $1B liquidated; the U.S. strikes on Fordow that same month triggered a similar dip. Both **recovered within days** once the conflict didn't broaden, and the Jun 24 ceasefire headline itself produced a rally back above $105k. Pattern: sell the escalation headline, expect the move to fade/reverse on any de-escalation signal.
- **Tariffs / trade-war headlines**: same risk-off mechanic, often the sharpest category because of leverage cascades — Trump's Apr 2, 2025 "Liberation Day" tariffs took BTC from ~$88k to ~$82k, then reversed hard on the Apr 9 90-day-pause headline; the Oct 2025 100%-China-tariff announcement dropped BTC ~15% (~$122.5k→~$104.6k) with a record ~$19B liquidated. Cross-check lens 5 — these episodes are exactly what an "OI stacking, expect a sharp move" derivatives read predicts.
- **Central bank surprise commentary**: same mechanic as lens 6's FOMC/CPI entries but unplanned — hawkish surprise is risk-off, dovish surprise is risk-on, just without calendar warning.
- **Regulatory/legislative action**: more idiosyncratic than macro-correlated — can be sharply bullish (e.g. a Senate crypto bill headline) or bearish depending on content; read the specific headline rather than assuming a default direction.
- **Exchange/protocol-specific shocks** (hacks, insolvency, depegs): idiosyncratic crypto-only risk-off; treat as a pure lens-2/lens-5 liquidity event, no geopolitical read needed.
- **Systemic TradFi stress** (bank failures, currency crises): the one category where BTC has historically decoupled *positively* from broader risk-off — a "digital gold" bid can dominate instead of the usual high-beta selloff. This is the exception to the default risk-off assumption above.

**The spike-fade-recover mechanic**: every case above followed the same shape — (1) a sharp initial move within minutes to hours, amplified well beyond "fundamental" impact by liquidation cascades, (2) a stall once initial forced selling/buying is absorbed, (3) a partial-to-full retrace over the following hours to days as the market reprices actual escalation risk vs. the initial worst case. The scalping edge is rarely in chasing the first candle — it's in fading the overshoot once lens 2 shows a stall/reversal, or catching continuation only after lens 5 shows OI/liquidations have already cleared.

**Live monitoring, tested working, no key required**:
- **Google News RSS search** (most reliable): `https://news.google.com/rss/search?q=<topic>+when:1h&hl=en-US&gl=US&ceid=US:en` — swap `when:1h`/`when:1d` for the window, works for any topic (Iran, Fed, tariffs, a specific exchange).
- **CoinDesk RSS**: `https://www.coindesk.com/arc/outboundfeeds/rss/`
- **The Block RSS**: `https://www.theblock.co/rss.xml`
- **GDELT** (`api.gdeltproject.org/api/v2/doc/doc`) — free, no key, but rate-limited to ~1 request/5s and unreliable from this environment specifically; treat as backup, not primary.
- **Exa** (if a key is supplied via environment variable, never hardcoded) — better for digging into a story once it breaks than for the first alert.

**Headline Trade Protocol** (runs standalone, doesn't wait for the full synthesis):
1. **Verify** — primary source (Reuters/AP/official statement) or unconfirmed rumor? Wait for a second confirming source before trading; costs 1-2 minutes, avoids most fake-headline whipsaws.
2. **Classify magnitude** — Tier 1 (major war escalation, systemic threat, surprise Fed action) moves the whole market; Tier 2 (regional/contained conflict, single-country tariff) moves crypto but smaller/shorter; Tier 3 (rhetoric without action) is usually noise — don't trade it directly.
3. **Don't chase the first 1–5 minute candle** — that's the illiquid, spread-widened, most overshoot-prone window. Wait for a defined lower-timeframe structure: a stall/sweep-and-reclaim (fade setup) or a clean continuation after brief consolidation (trend setup).
4. **Check alignment with the structural bias** from lenses 1–6: a headline fighting the existing higher-timeframe trend is a smaller, quicker counter-trend scalp; one agreeing with it is higher-conviction and can be sized/held more normally.
5. **Check lens 5** — has forced selling/buying already happened (post-cascade, better fade entry) or is OI still building (avoid catching a falling knife mid-cascade)?
6. **Tight, structure-based stop** beyond the spike wick, not a fixed percentage — headline volatility blows through normal ATR-based stops.
7. **Time-box the trade** — headline edges decay fast; default to closing same-session/within 24h rather than holding for a full structural target, unless lens 2 confirms the move has become a genuine structural break.
8. **Reduce size vs. a normal swing entry** — headline ranges are wider and less predictable than structure-based entries.

Full expanded event table and more historical examples in `references/geopolitical-headline-playbook.md`.

### 8. Cross-asset & commodities tape (DXY, gold, oil, silver, yields, VIX, ES) — weight ~8%
BTC doesn't trade in a vacuum — in macro-driven regimes it moves with the risk-asset complex, and commodities price geopolitical and inflation risk *faster and more honestly* than crypto does. This lens reads the TradFi tape to classify the current regime and to verify (or debunk) what headlines and BTC's own price action are claiming.

**The instruments and what each one answers:**
- **DXY (dollar index)** — the single most important cross-asset input: BTC is historically inversely correlated with dollar strength. Sustained DXY rally = macro headwind for every BTC long thesis; sustained decline = tailwind.
- **Gold** — the regime decoder, read *against* BTC: gold up + BTC down = genuine safe-haven flight where BTC is being treated as a risk asset (the June 2025 Iran pattern); gold up + BTC up + DXY down = debasement/liquidity trade, the strongest bull regime BTC gets; gold making highs while BTC lags = capital choosing the traditional haven — a relative-strength warning for BTC.
- **Oil (WTI/Brent)** — the geopolitical lie detector, and the fastest verification tool for lens 7: a Middle East escalation headline that oil doesn't rally on is a headline the market doesn't believe — treat it as Tier 3 regardless of how loud the news is. Oil holding/extending a war premium = escalation is being priced seriously (risk-off leg has legs); oil giving the spike back = de-escalation being priced (BTC bounce fuel). Sustained high oil also = inflation pressure = hawkish-Fed risk, feeding lens 6.
- **Silver** — gold's high-beta sibling; silver outperforming gold (gold/silver ratio falling) leans risk-on/industrial demand, silver lagging badly leans defensive.
- **US 10Y yield (^TNX)** — rising yields pressure non-yielding assets (BTC and gold alike); a fast yield spike is a risk-off accelerant, a grind lower is a tailwind.
- **VIX** — equity fear: VIX low/falling while headlines scream = TradFi calling the bluff; VIX spiking above ~25–30 = genuine cross-asset stress where BTC's high-beta correlation kicks in hardest.
- **ES/NQ futures** — BTC's tightest intraday correlation in macro regimes; overnight/weekend ES direction frequently leads BTC's next session.

**Regime table (the composite read):**

| DXY | Gold vs BTC | Oil | VIX | Regime | BTC implication |
|---|---|---|---|---|---|
| Falling | Both rising | Calm | Low | Debasement / liquidity bid | Strongest long regime |
| Rising | Gold up, BTC down | Spiking | Rising | Genuine risk-off / haven flight | Short regime; expect lens-7 spike-fade timing |
| Flat | Gold flat, BTC weak | Fading a spike | Low/falling | Market calling the geopolitical bluff | Fade panic moves; headline shorts lose their tailwind |
| Rising fast | Both falling | Any | Rising | Tightening / yields shock | Reduce all risk; BTC usually lags the recovery |

**Live data — tested, free, no key**: Yahoo Finance chart API, e.g. `https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1d&range=5d` (send a browser User-Agent header). Symbols: `GC=F` gold, `SI=F` silver, `CL=F` WTI, `DX-Y.NYB` DXY, `^TNX` 10Y yield, `^VIX` VIX, `ES=F` S&P futures. Full decision walkthrough in `references/cross-asset-signals.md`.

Role in synthesis: a **regime filter and headline verifier**, not an entry signal — it can veto or downgrade a thesis (e.g. "short on war escalation" dies when oil won't confirm), and it sets which side deserves benefit of the doubt, but entries still come from lenses 2/5/7.

### 9. Astrological timing overlay — optional, sentiment-only, weight 0% on direction
Explicit caveat: there is no demonstrated causal mechanism here. It is included because some traders in this space (Gann lineage, parts of the crypto-astro community, occasionally referenced by Mayne) watch it for **volatility clustering and crowd-psychology timing**, not price direction.

- **Mercury retrograde windows**: anecdotally correlated with choppier price action and sharper reversals/exhaustion — in an existing bear trend these periods have coincided with sharp legs down, in a bull trend with sharp blow-off or shakeout moves. Use only as a "tighten stops, reduce size, expect chop" flag.
- **Full moon / new moon**: some traders treat these as minor turning-point *timing* windows to cross-check against a PA-based reversal signal — never as a standalone trigger.
- **Gann time-price cycles**: anniversary dates of major prior highs/lows are watched as candidate turning dates worth cross-referencing against structure.
- **Hard rule**: astrology may only ever adjust position size or stop placement around a trade already justified by lenses 1–8. It must never be the sole reason to enter or exit.

Expanded notes and sourcing caveats in `references/astro-timing.md`.

## Engagement rhythm: when the user should be looking at entries

Crypto has no open/close — entries are triggered by **levels and events, not clock time**. The user is on Dutch time (CET/CEST). Standing guidance when they ask "when should I look":

- **Primary trigger: price at a mapped level.** Every market read should end with 2–4 active alert levels; the user sets platform price alerts there and checks in when one fires.
- **Daily anchor: one morning check (~09:00 CEST, London open)** — overnight recap, refreshed levels, day's calendar.
- **High-value windows**: 15:30 CEST US equity open (max intraday vol, tightest ES correlation), 30 min *after* any 14:30 CEST macro print, 21:00–23:00 CEST as the US session matures. Daily candle close is 02:00 CEST — swing confirmations read there or next morning.
- **Anti-windows (don't initiate)**: Sunday-evening/weekend thin tape (CME closed Fri 22:00 CEST → Sun), Asia chop 03:00–08:00 CEST unless a level hits, 24–48h pre-FOMC/CPI, the first minutes of any spike.

## Conviction checks: the user's feeling is a hypothesis, not a signal

When the user expresses a directional feeling ("I think it's going down", "I want to long this") or shows an already-open position, the job is to **stress-test it, not validate it**:

1. Run the lens read **position-agnostic first** — score the market as if the user were flat. Never work backward from their position to a justification.
2. Open with an explicit alignment verdict: **CONFIRMED** (≥2 primary pillars agree, nothing vetoing), **MIXED** (1 pillar, or cross-asset/headline verification failing), or **AGAINST** (0–1 pillars, or the premise contradicted by the tape). For MIXED and AGAINST, say plainly that the framework says this is not the right move — do not soften it into "it could work."
3. Name the specific data that would flip the verdict, so the user knows what they're actually betting on.
4. **Grade process, not outcome.** A trade that made money from a bad location was still a bad entry (and vice versa) — say which it was. Mid-range entries, unverified-headline entries, and entries whose real driver is a feeling all get called out as such even when the direction later proves right.
5. If the position is already open, follow the honest grade with management advice (hold with existing plan / tighten / exit-now level) — critique without a next action is useless.
6. When asked retrospectively ("should I have taken this?"), score against the data available *at entry time*, not what happened after.

This rule exists at the user's own request: agreement is worth nothing to them; the framework's disagreement is what they're paying for.

## Trade setup requests: always verdict first, then concrete setups

Whenever the user asks for a trade setup (or "should I enter", "give me a play", "what's the trade here"), do NOT just describe the market. Always respond with:

**1. A verdict line, first sentence: SCALP / SWING / STAND ASIDE** — decided from the data, not from what the user seems to want to hear:

| Conditions | Verdict |
|---|---|
| Primary pillars aligned (2-of-4: PA, TA, cycle, spot flow), no Tier-1 event inside ~48h, price at/near a decision level | **SWING** |
| Pillars conflicting or price mid-range, but clear intraday levels + derivatives fuel (liquidation clusters, funding skew) exist | **SCALP** only |
| Active breaking headline (lens 7) | **SCALP** via the Headline Trade Protocol; swing only if the event graduates into a structural break |
| High-impact scheduled print (FOMC/CPI/PPI/NFP) inside 24–48h | **SCALP** pre-event at most; swing entries wait for the post-print direction |
| Chop flags stacked (astro window + mid-range + no derivatives fuel) or eval guardrails tight (daily-loss/drawdown headroom low in the journal) | **STAND ASIDE** — say so plainly and state what has to change to re-engage |

**2. Concrete setups in card form** — primary side only when bias is clear; both sides when neutral. Every setup card contains all seven fields:

```
Side/Type:    [long/short] [scalp/swing]
Entry:        [zone or trigger — e.g. "sweep of $62k + reclaim", "retest-hold of $65.8k from above"]
Confirmation: [what must print first — close, volume, funding/OI behavior; never a first-touch entry]
Stop:         [structure-based level, beyond the wick/invalidation — never a bare %]
Targets:      [ONE full-size TP — the user's prop platform is all-or-nothing on TP orders (no partials). Pick the level that clears ≥1.4:1 vs the stop while exiting before the next bounce zone; SL-editing (e.g. move to entry at a milestone) is allowed and is the substitute for a ladder. Scalps get one TP + time-box]
Size:         [risk % per the risk rules, adjusted for chop/headline/event flags AND current eval headroom from trading/dashboard.html]
Dies if:      [the specific condition that cancels the setup before entry triggers]
```

**3. The one-line reason for the verdict** — which data made it a scalp vs. a swing (e.g. "pillars split 2-2 and CPI lands Wednesday, so nothing here deserves swing duration").

Setups are conditional plays at levels, not predictions — if price never reaches the trigger, the setup expires untouched. State an expiry for every card (a session for scalps, a week or an event for swings).

## Synthesis & output template

Two modes, matching the timeframe-adaptation section above:

- **Swing mode**: only take a trade where **at least two of the four primary pillars (PA, TA, cycle context, spot demand flow) agree**. Use derivatives data (funding/OI/put-call) to time the entry within that thesis. Use the macro calendar and any live geopolitical/headline read to decide *when* to act (or stand aside) — they can delay/accelerate an entry or shift the bias, but the primary pillars still decide direction. Use the astro overlay only to size/tighten risk.
- **Scalp/headline mode**: when a live breaking-news event is the trigger, run lens 7's Headline Trade Protocol directly instead of waiting for full pillar agreement — check it against the existing structural bias for sizing/conviction, but don't require the 2-of-4 agreement rule to act.

When asked to "read" the market, produce:

```
Bias:            [bullish / bearish / neutral] on [timeframe]
Cycle context:   [phase + confidence] — see lens 1
Structure read:  [Wyckoff phase + key level] — see lens 2
TA confirmation: [trend/momentum/volume state] — see lens 3
Spot flow:       [Coinbase premium sign + ETF 5-day net flow + implication] — see lens 4
Derivatives:     [funding/OI/put-call ratio read + implication] — see lens 5
Macro calendar:  [any FOMC/CPI/PPI/NFP/witching/expiry inside the trade window — see lens 6, or "clear"]
Headline flag:   [any live breaking event — category/tier + expected reaction — see lens 7, or "none active"]
Cross-asset:     [regime read: DXY/gold/oil/VIX/ES composite — see lens 8 — and whether it confirms or vetoes the bias]
Astro flag:      [any active window — vol-up/reduce-size flag only, or "none active"]
Key levels:      [invalidation level] / [target/next liquidity pool]
Trigger:         [what needs to happen to act]
Invalidation:    [structure-based level that proves the thesis wrong]
Position sizing: [risk % of account given stop distance]
```

## Risk management (non-negotiable)

- Define invalidation *before* entry, from structure (lens 2), never an arbitrary percentage.
- Size positions from stop distance and a fixed account-risk percentage (e.g. 0.5–2% risk per idea), not from conviction.
- **Prop-eval accounts**: risk per trade is defined against the *remaining drawdown budget* (from `trading/dashboard.html` guardrails), not the notional balance — default 10–20% of remaining budget per idea. On this user's eval ($5,000 static drawdown floor, $3,000 daily), that means ~$500–$1,000 risk per trade; any single trade risking >30% of remaining budget is oversized regardless of conviction. Setup-card size fields must be computed this way.
- Funding/OI extremes are a reason to reduce leverage, not increase it.
- Weight spot-flow signals (Coinbase premium, ETF net flows) above derivatives signals when they conflict — real capital moving is stronger evidence than leveraged positioning.
- Historical 4-year-cycle bear phases have produced 70–85% peak-to-trough drawdowns — size and leverage choices should assume this can happen again, especially late in a markup phase that feels euphoric.
- Don't open fresh directional risk inside the 24–48h pre-window of FOMC/CPI/PPI/NFP, and reduce leverage going into large monthly/quarterly crypto options & futures expiries — these are known volatility-injection points, not opportunities to add conviction.
- Don't trade unconfirmed single-source headlines, don't chase the first 1–5 minutes of a breaking-news candle, and size headline trades smaller than structure-based swing entries — see lens 7's Headline Trade Protocol.
- Futures/leverage trading can produce full loss of margin; treat leverage as a timing tool for a thesis you already believe, not a way to force a bigger edge out of a weak one.

## Trade journal & funded-account tracking

The user's trade journal lives at `trading/dashboard.html` in this repo — a self-contained page (data embedded in its `trade-data` JSON block, no backend) tracking progress toward the prop-eval profit target, equity curve, daily PnL, stats, and open positions, with CSV export for Excel. Workflow when the user posts a position screenshot or reports a fill:

1. Read the screenshot/message and extract: pair, direction, style (scalp/swing/headline), entry, exit (if closing), size, fees, PnL, open/close timestamps, plus `sl`/`tp` if visible, `risk` (USD at stop), and `grade` — the conviction-check verdict at entry time (CONFIRMED/MIXED/AGAINST). The dashboard computes R-multiples and PnL-by-grade from these, which is how the framework's value gets proven or disproven against real trades.
2. Edit the `trade-data` JSON block in `trading/dashboard.html` — append new trades, or move an open trade to `status: "closed"` with `exit`, `closed`, and `pnl` filled in. Never maintain a second copy of the data anywhere else; this block is the single source of truth.
3. Include a one-line `notes` field capturing the setup and which lens triggered it — this builds the by-style stats that show which setups actually pay.
4. Commit and push, then republish the artifact **to the same URL** (pass the existing artifact URL) so the user's wife's bookmarked link stays current.
5. Config (`startingBalance`, `profitTarget`, `maxDrawdownPct`, `dailyLossLimitPct`) lives in the same JSON block; limits flagged `limitsAssumed: true` are placeholders the user still needs to confirm against their eval's real rules.

## Reference files (load on demand)

- `references/trader-playbooks.md` — expanded methodology notes on Trader Mayne, TraderXO, and the other traders referenced above, with sources.
- `references/btc-cycle-history.md` — halving dates, historical peak/trough timing, drawdown table, and the 2025–2026 divergence from the prior pattern.
- `references/spot-flow-indicators.md` — Coinbase Premium Index (formula + live endpoints) and spot BTC ETF net-flow data, with tested free/no-key sources.
- `references/derivatives-timing.md` — funding rate, open interest, put/call ratio, and liquidation-heatmap mechanics with a fuller decision matrix.
- `references/macro-calendar.md` — 2026 FOMC/CPI/PPI/NFP/witching/crypto-options-expiry dates and a weekly event-risk checklist.
- `references/geopolitical-headline-playbook.md` — expanded event-category table, more historical examples, live news-feed setup, and the full Headline Trade Protocol.
- `references/cross-asset-signals.md` — DXY/gold/oil/silver/yields/VIX/ES regime reading, the oil-as-headline-verifier method, and tested live endpoints.
- `references/live-data-quickref.md` — every tested free endpoint on one page (price, flows, funding/OI/long-short/taker/DVOL/put-call/CME basis, Fear & Greed, stablecoins, dominance, cross-asset, news) with the composite reading order.
- `references/astro-timing.md` — expanded astrological timing concepts, sourcing, and caveats.

## Disclaimer

This is an educational analytical framework, not financial advice. Crypto markets are highly volatile; futures/leverage trading can result in total loss of capital. Historical cycle patterns and any trader's stated methodology are not guarantees of future performance — apply independent judgment and proper risk management.
