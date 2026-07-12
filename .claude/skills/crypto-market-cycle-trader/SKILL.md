---
name: crypto-market-cycle-trader
description: Use when analyzing Bitcoin or crypto markets for trading decisions — e.g. "analyze BTC", "where are we in the cycle", "is this a good entry/exit", "build a trading plan", "read the market structure", "check funding/OI before I lever up". Synthesizes technical analysis (TA), Wyckoff-style price action (PA), the BTC 4-year halving cycle, futures/derivatives positioning, and an optional astrological timing overlay into one structured playbook drawing on the methods of well-known crypto traders (Trader Mayne, TraderXO, and others). Not financial advice — an analytical checklist, not a signal generator.
---

# Crypto Market Cycle Trader

A structured framework for reading Bitcoin/crypto markets by layering five lenses, each weighted by how much *evidence* it actually carries. Evidence-heavy lenses (price action, TA, cycle context, derivatives) drive the trade thesis. The astrology lens is a low-weight sentiment/volatility overlay only — it never drives direction on its own.

## Who this framework draws from

- **Trader Mayne** — price-action trader since 2013 (support/resistance, ranges, liquidity sweeps); co-founded the Breakout prop firm; survived the FTX collapse and rebuilt; known for pairing pure PA with cycle/sentiment reads and occasional Gann/astro timing notes as a minor overlay, not a core signal.
- **TraderXO** — Wyckoff-based order-flow and market-structure trader (accumulation → markup → distribution → markdown), publishes price-action and mindset breakdowns on Substack/X.
- **Other reference points** — Arthur Hayes (macro liquidity/leverage-cycle commentary), Michael Saylor (cycle-agnostic long-horizon accumulation thesis, useful as a contrarian counterweight to pure cycle timing), and on-chain analysts in the Glassnode/CryptoQuant tradition (used here for the derivatives/positioning lens).

This is methodology synthesis, not copy-trading. See `references/trader-playbooks.md` for the expanded notes on each.

## The five-lens framework

Run these in order. Each produces one line of output; the synthesis step at the end combines them.

### 1. Cycle context (macro timing) — weight ~20%
- Compute months since/until the nearest halving.
- Historical pattern (see `references/btc-cycle-history.md` for the full table): bull tops have clustered 12–18 months post-halving; peak-to-trough bear drawdowns have run 77–85%; bear bottoms have historically formed before the next halving.
- **State explicitly that this pattern is contested for the current cycle** — the post-2024-halving year broke the "always green" pattern for the first time, and ETF/institutional flows are cited as a structural change. Treat cycle position as a *prior*, not a rule.
- Output: label the likely phase — Accumulation / Early Markup / Late Markup-Euphoria / Distribution / Markdown-Bear — with a confidence level, not certainty.

### 2. Price action & market structure (Wyckoff / PA lens) — weight ~40%, highest
- Identify the Wyckoff phase on the relevant timeframe (accumulation range with spring, sign-of-strength, markup; or distribution range with upthrust, sign-of-weakness, markdown).
- Map key support/resistance and liquidity pools: equal highs/lows, prior range extremes, untested order blocks.
- Look for liquidity sweeps / stop hunts *before* trusting a move — a break of structure on thin volume that immediately reverses is a sweep, not a breakout.
- Note market-structure shifts: higher-high/higher-low sequences (bullish) vs lower-high/lower-low (bearish), and the specific level where structure would flip.

### 3. Technical analysis confirmation (TA) — weight ~25%
- Trend: 50/100/200-period moving averages on daily/weekly; is price above or below, and are the MAs stacked in order?
- Momentum: RSI, especially divergence at range extremes (price higher-high, RSI lower-high = bearish divergence, and vice versa).
- Volatility/risk sizing: ATR or Bollinger Band width for stop distance.
- Volume must confirm breakouts/breakdowns — a Wyckoff sign-of-strength on low volume is suspect.

### 4. Futures/derivatives positioning (entry timing) — weight ~15%
Use this to time entries *within* a thesis already built from steps 1–3, not to generate a thesis on its own.

| Open interest | Funding rate | Price | Read |
|---|---|---|---|
| Rising | Positive | Rising | Trend confirmed by new money, but crowd is long — watch for long-squeeze risk if it stalls |
| Rising | Negative | Falling | Trend confirmed, crowd is short — watch for short-squeeze risk if it stalls |
| Rising | Either | Flat/chopping | Leverage stacking without resolution — "stored energy," expect a sharp move soon |
| Falling | Either | Any | Positions closing/deleveraging — often the tail end of a move, not the start |

Full detail and a walk-through in `references/derivatives-timing.md`.

### 5. Astrological timing overlay — optional, sentiment-only, weight 0% on direction
Explicit caveat: there is no demonstrated causal mechanism here. It is included because some traders in this space (Gann lineage, parts of the crypto-astro community, occasionally referenced by Mayne) watch it for **volatility clustering and crowd-psychology timing**, not price direction.

- **Mercury retrograde windows**: anecdotally correlated with choppier price action and sharper reversals/exhaustion — in an existing bear trend these periods have coincided with sharp legs down, in a bull trend with sharp blow-off or shakeout moves. Use only as a "tighten stops, reduce size, expect chop" flag.
- **Full moon / new moon**: some traders treat these as minor turning-point *timing* windows to cross-check against a PA-based reversal signal — never as a standalone trigger.
- **Gann time-price cycles**: anniversary dates of major prior highs/lows are watched as candidate turning dates worth cross-referencing against structure.
- **Hard rule**: astrology may only ever adjust position size or stop placement around a trade already justified by lenses 1–4. It must never be the sole reason to enter or exit.

Expanded notes and sourcing caveats in `references/astro-timing.md`.

## Synthesis & output template

Only take a trade where **at least two of the three primary pillars (PA, TA, cycle context) agree**. Use derivatives data to time the entry within that thesis. Use the astro overlay only to size/tighten risk.

When asked to "read" the market, produce:

```
Bias:            [bullish / bearish / neutral] on [timeframe]
Cycle context:   [phase + confidence] — see lens 1
Structure read:  [Wyckoff phase + key level] — see lens 2
TA confirmation: [trend/momentum/volume state] — see lens 3
Derivatives:     [funding/OI read + implication] — see lens 4
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
- Futures/leverage trading can produce full loss of margin; treat leverage as a timing tool for a thesis you already believe, not a way to force a bigger edge out of a weak one.

## Reference files (load on demand)

- `references/trader-playbooks.md` — expanded methodology notes on Trader Mayne, TraderXO, and the other traders referenced above, with sources.
- `references/btc-cycle-history.md` — halving dates, historical peak/trough timing, drawdown table, and the 2025–2026 divergence from the prior pattern.
- `references/derivatives-timing.md` — funding rate, open interest, and liquidation-heatmap mechanics with a fuller decision matrix.
- `references/astro-timing.md` — expanded astrological timing concepts, sourcing, and caveats.

## Disclaimer

This is an educational analytical framework, not financial advice. Crypto markets are highly volatile; futures/leverage trading can result in total loss of capital. Historical cycle patterns and any trader's stated methodology are not guarantees of future performance — apply independent judgment and proper risk management.
