---
name: crypto-market-cycle-trader
description: Use when analyzing Bitcoin or crypto markets for trading decisions — e.g. "analyze BTC", "where are we in the cycle", "is this a good entry/exit", "build a trading plan", "read the market structure", "check funding/OI before I lever up", "when should I look for entries", "what's the put/call ratio saying". Synthesizes technical analysis (TA), Wyckoff-style price action (PA), the BTC 4-year halving cycle, futures/options positioning (funding, open interest, live put/call ratio), the TradFi + crypto macro/volatility calendar (FOMC, CPI/PPI, NFP, witching days, options/futures expiries), and an optional astrological timing overlay into one structured playbook drawing on the methods of well-known crypto traders (Trader Mayne, TraderXO, and others). Not financial advice — an analytical checklist, not a signal generator.
---

# Crypto Market Cycle Trader

A structured framework for reading Bitcoin/crypto markets by layering six lenses, each weighted by how much *evidence* it actually carries. Evidence-heavy lenses (price action, TA, cycle context, derivatives, macro/volatility calendar) drive the trade thesis and its timing. The astrology lens is a low-weight sentiment/volatility overlay only — it never drives direction on its own.

## Who this framework draws from

- **Trader Mayne** — price-action trader since 2013 (support/resistance, ranges, liquidity sweeps); co-founded the Breakout prop firm; survived the FTX collapse and rebuilt; known for pairing pure PA with cycle/sentiment reads and occasional Gann/astro timing notes as a minor overlay, not a core signal.
- **TraderXO** — Wyckoff-based order-flow and market-structure trader (accumulation → markup → distribution → markdown), publishes price-action and mindset breakdowns on Substack/X.
- **Other reference points** — Arthur Hayes (macro liquidity/leverage-cycle commentary), Michael Saylor (cycle-agnostic long-horizon accumulation thesis, useful as a contrarian counterweight to pure cycle timing), and on-chain analysts in the Glassnode/CryptoQuant tradition (used here for the derivatives/positioning lens).

This is methodology synthesis, not copy-trading. See `references/trader-playbooks.md` for the expanded notes on each.

## The six-lens framework

Run these in order. Each produces one line of output; the synthesis step at the end combines them.

### 1. Cycle context (macro timing) — weight ~15%
- Compute months since/until the nearest halving.
- Historical pattern (see `references/btc-cycle-history.md` for the full table): bull tops have clustered 12–18 months post-halving; peak-to-trough bear drawdowns have run 77–85%; bear bottoms have historically formed before the next halving.
- **State explicitly that this pattern is contested for the current cycle** — the post-2024-halving year broke the "always green" pattern for the first time, and ETF/institutional flows are cited as a structural change. Treat cycle position as a *prior*, not a rule.
- Output: label the likely phase — Accumulation / Early Markup / Late Markup-Euphoria / Distribution / Markdown-Bear — with a confidence level, not certainty.

### 2. Price action & market structure (Wyckoff / PA lens) — weight ~35%, highest
- Identify the Wyckoff phase on the relevant timeframe (accumulation range with spring, sign-of-strength, markup; or distribution range with upthrust, sign-of-weakness, markdown).
- Map key support/resistance and liquidity pools: equal highs/lows, prior range extremes, untested order blocks.
- Look for liquidity sweeps / stop hunts *before* trusting a move — a break of structure on thin volume that immediately reverses is a sweep, not a breakout.
- Note market-structure shifts: higher-high/higher-low sequences (bullish) vs lower-high/lower-low (bearish), and the specific level where structure would flip.

### 3. Technical analysis confirmation (TA) — weight ~20%
- Trend: 50/100/200-period moving averages on daily/weekly; is price above or below, and are the MAs stacked in order?
- Momentum: RSI, especially divergence at range extremes (price higher-high, RSI lower-high = bearish divergence, and vice versa).
- Volatility/risk sizing: ATR or Bollinger Band width for stop distance.
- Volume must confirm breakouts/breakdowns — a Wyckoff sign-of-strength on low volume is suspect.

### 4. Futures & options positioning (entry timing) — weight ~15%
Use this to time entries *within* a thesis already built from steps 1–3, not to generate a thesis on its own.

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

Full detail and a walk-through in `references/derivatives-timing.md`.

### 5. Macro & volatility calendar (event-risk timing) — weight ~15%
Crypto trades as a risk asset and is directly sensitive to TradFi macro prints and derivatives-expiry mechanics. This lens doesn't generate direction on its own — its job is to flag *when* volatility is structurally elevated (or artificially suppressed) so entries/exits are timed around it rather than into it.

- **FOMC meeting days** (rate decision 14:00 ET + press conference 14:30 ET) — the single highest-impact scheduled event for both TradFi and crypto; historically produces outsized, often two-sided ("whipsaw then trend") moves.
- **CPI / PPI release days** (BLS, ~8:30 AM ET, typically the second/mid-month) — inflation surprises versus consensus are a top driver of rate-path repricing and correlated crypto volatility.
- **NFP / jobs report** (first Friday of the month, ~8:30 AM ET) — same mechanism as CPI, smaller average impact but still a reliable volatility spike.
- **Quad/triple witching** (third Friday of Mar/Jun/Sep/Dec in equities) — simultaneous index option, index future, and single-stock option expiry; drives elevated TradFi volume/volatility that frequently bleeds into crypto via correlation and cross-asset de-risking flows.
- **Crypto options & futures expiries** — Deribit BTC/ETH options expire monthly (last Friday, 08:00 UTC) with the largest notional on the quarterly cycle (last Friday of Mar/Jun/Sep/Dec); CME BTC futures roll monthly on a similar late-month schedule. Large expiries can *pin* price near the "max pain" strike into settlement, then release directional volatility once options-driven hedging flow unwinds.
- **Other recurring high-vol days**: Fed Chair speeches, the annual Jackson Hole Symposium (late August), and any scheduled testimony/press event tied to rates or regulation.

Rule of thumb: avoid opening *new* directional risk in the 24–48h window immediately before a high-impact print (FOMC/CPI/PPI/NFP) unless already riding a confirmed trend — the pre-event window is disproportionately prone to stop-hunts in both directions. Prefer entries *after* the print confirms a direction over pre-positioning for a guess. Around large options/futures expiries, expect potential pre-expiry pinning followed by a volatility release in the 24h after settlement — reduce leverage into the expiry itself rather than into the release.

Full 2026 dates and a weekly-event checklist in `references/macro-calendar.md`.

### 6. Astrological timing overlay — optional, sentiment-only, weight 0% on direction
Explicit caveat: there is no demonstrated causal mechanism here. It is included because some traders in this space (Gann lineage, parts of the crypto-astro community, occasionally referenced by Mayne) watch it for **volatility clustering and crowd-psychology timing**, not price direction.

- **Mercury retrograde windows**: anecdotally correlated with choppier price action and sharper reversals/exhaustion — in an existing bear trend these periods have coincided with sharp legs down, in a bull trend with sharp blow-off or shakeout moves. Use only as a "tighten stops, reduce size, expect chop" flag.
- **Full moon / new moon**: some traders treat these as minor turning-point *timing* windows to cross-check against a PA-based reversal signal — never as a standalone trigger.
- **Gann time-price cycles**: anniversary dates of major prior highs/lows are watched as candidate turning dates worth cross-referencing against structure.
- **Hard rule**: astrology may only ever adjust position size or stop placement around a trade already justified by lenses 1–5. It must never be the sole reason to enter or exit.

Expanded notes and sourcing caveats in `references/astro-timing.md`.

## Synthesis & output template

Only take a trade where **at least two of the three primary pillars (PA, TA, cycle context) agree**. Use derivatives data to time the entry within that thesis. Use the macro/volatility calendar to decide *when* in the week to act (or to stand aside) — it can delay or accelerate an entry but doesn't flip the directional bias. Use the astro overlay only to size/tighten risk.

When asked to "read" the market, produce:

```
Bias:            [bullish / bearish / neutral] on [timeframe]
Cycle context:   [phase + confidence] — see lens 1
Structure read:  [Wyckoff phase + key level] — see lens 2
TA confirmation: [trend/momentum/volume state] — see lens 3
Derivatives:     [funding/OI/put-call ratio read + implication] — see lens 4
Macro calendar:  [any FOMC/CPI/PPI/NFP/witching/expiry inside the trade window — see lens 5, or "clear"]
Astro flag:      [any active window — vol-up/reduce-size flag only, or "none active"]
Key levels:      [invalidation level] / [target/next liquidity pool]
Trigger:         [what needs to happen to act]
Invalidation:    [structure-based level that proves the thesis wrong]
Position sizing: [risk % of account given stop distance]
```

## Risk management (non-negotiable)

- Define invalidation *before* entry, from structure (lens 2), never an arbitrary percentage.
- Size positions from stop distance and a fixed account-risk percentage (e.g. 0.5–2% risk per idea), not from conviction.
- Funding/OI extremes are a reason to reduce leverage, not increase it.
- Historical 4-year-cycle bear phases have produced 70–85% peak-to-trough drawdowns — size and leverage choices should assume this can happen again, especially late in a markup phase that feels euphoric.
- Don't open fresh directional risk inside the 24–48h pre-window of FOMC/CPI/PPI/NFP, and reduce leverage going into large monthly/quarterly crypto options & futures expiries — these are known volatility-injection points, not opportunities to add conviction.
- Futures/leverage trading can produce full loss of margin; treat leverage as a timing tool for a thesis you already believe, not a way to force a bigger edge out of a weak one.

## Reference files (load on demand)

- `references/trader-playbooks.md` — expanded methodology notes on Trader Mayne, TraderXO, and the other traders referenced above, with sources.
- `references/btc-cycle-history.md` — halving dates, historical peak/trough timing, drawdown table, and the 2025–2026 divergence from the prior pattern.
- `references/derivatives-timing.md` — funding rate, open interest, put/call ratio, and liquidation-heatmap mechanics with a fuller decision matrix.
- `references/macro-calendar.md` — 2026 FOMC/CPI/PPI/NFP/witching/crypto-options-expiry dates and a weekly event-risk checklist.
- `references/astro-timing.md` — expanded astrological timing concepts, sourcing, and caveats.

## Disclaimer

This is an educational analytical framework, not financial advice. Crypto markets are highly volatile; futures/leverage trading can result in total loss of capital. Historical cycle patterns and any trader's stated methodology are not guarantees of future performance — apply independent judgment and proper risk management.
