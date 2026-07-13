# Futures/derivatives timing detail

## Core metrics

- **Open interest (OI)** — total live futures/perp contracts outstanding. Rises when new positions open, falls when positions close. It's the best single proxy for how much leverage is currently in the market.
- **Funding rate** — the periodic payment between longs and shorts on perpetual futures that keeps perp price anchored to spot. Positive funding = longs pay shorts (market is long-heavy); negative = shorts pay longs (market is short-heavy).
- **Liquidation levels/heatmaps** — price levels where clusters of leveraged positions would be force-closed. Tools like Coinglass aggregate this across exchanges.
- **Long/short ratio** — retail vs. aggregate positioning skew, another crowding proxy.
- **Put/call ratio** — options-market sentiment gauge, covered in its own section below since it's read differently (contrarian, not trend-confirming) than funding/OI.

## Live put/call ratio

The put/call ratio compares open interest or volume in put options vs. call options. In crypto it's calculated on Deribit (the dominant BTC/ETH options venue); in TradFi the reference series is CBOE's equity put/call ratio. Both are read the same way and are useful cross-checks of each other during macro-correlated regimes.

**Where to pull it live**: Deribit's own options statistics page, or aggregators — Coinglass, Laevitas, and The Block's crypto-options data page all publish live/near-live BTC and ETH put/call ratios (by volume and by open interest).

**Literal vs. contrarian reading** — this is the part that trips people up:
- A ratio **< 1** means more call interest than put interest — the crowd is positioned bullishly.
- A ratio **> 1** means more put interest than call interest — the crowd is positioned bearishly / hedging.
- Read *literally*, high put/call = bearish, low put/call = bullish.
- Read *as a contrarian sentiment gauge* (the way professional options desks actually use it), it's closer to the opposite at the extremes: heavy put buying often reflects capitulation-level fear or expensive hedging that has already been priced in, and tends to precede bounces; heavy call buying often reflects speculative excess/greed that precedes pullbacks.

**Rough thresholds**:

| Ratio zone | Crypto (Deribit) | CBOE equity | Interpretation |
|---|---|---|---|
| Speculative excess / greed | roughly < 0.7 | < 0.45 | Contrarian caution on chasing new longs |
| Neutral | roughly 0.7–1.0 | 0.55–0.70 | No strong contrarian signal either way |
| Elevated fear | roughly > 1.0 | > 1.0 | Often a better setup for longs than shorts |
| Extreme fear / capitulation | roughly > 1.2 | > 1.23 | Classic contrarian bounce zone — extreme readings occur only a small fraction of the time |

**How to use it correctly**:
1. Always use a **5–10 day moving average**, not the single-day print — daily values are noisy and a single large institutional hedge can spike the ratio for one session without reflecting a real sentiment shift.
2. Treat it as a **confirmation/fade layer on top of funding and OI**, not standalone. A funding-rate extreme *and* a put/call extreme pointing the same contrarian direction is a much stronger signal than either alone (mirrors the "combine sentiment indicators" principle used with the CBOE ratio in TradFi — VIX term structure, breadth, RSI, etc.).
3. Cross-reference the TradFi (CBOE) reading during macro-dominated weeks (see the macro calendar lens) — crypto and equity fear/greed often move together when risk-asset correlation is high, so a CBOE extreme can foreshadow or confirm a crypto options extreme.

## Reading process

1. **Check the OI trend** over the past 3–7 days: rising, flat, or falling. A sustained OI build near a key price level means the market is loading directional bets — that stored leverage eventually has to release, one way or another.
2. **Cross with funding sign**:
   - Rising OI + positive funding + rising price → trend is being confirmed by fresh money, but the crowd is long. A break below support risks cascading long liquidations (a sharp downside flush).
   - Rising OI + negative funding + falling price → trend confirmed, crowd is short. A break above resistance risks a short squeeze (sharp upside flush).
   - Rising OI + price chopping sideways → leverage stacking without resolution. This is the "coiled spring" state — expect an outsized move once price actually breaks the range, in whichever direction triggers the larger stack.
   - Falling OI → deleveraging/position closing. Often marks the tail end of a move rather than its start; a falling-OI rally/selloff has less "fuel" behind it than a rising-OI one.
3. **Divergence warning**: if price is falling but funding and OI are climbing, it usually means leveraged traders are aggressively buying the dip — informative because it flags a crowd that can get flushed by further downside, adding to the move rather than absorbing it.
4. **Liquidation heatmap as a magnet**: dense liquidation clusters just above/below current price behave like liquidity pools — price has a statistical tendency to "hunt" them (the same concept as a Wyckoff spring/upthrust, described in the PA lens, just visible in derivatives data instead of price structure alone). Treat a heatmap cluster coinciding with a PA-identified liquidity pool as a stronger signal than either alone.
5. **Risk-zone flag**: high funding + rising OI + rising realized volatility together typically mark a high-risk, late-stage move — a point to trim/tighten rather than add.

## How this feeds the synthesis step

Derivatives data is a **timing/confirmation layer**, not a thesis generator. Use it to:
- Decide whether to enter now vs. wait for a flush/reset (e.g., don't chase a breakout into a heavily one-sided, over-leveraged funding regime).
- Size positions down when funding/OI signal crowding, even if PA/TA/cycle context all agree directionally.
- Identify the specific price level a move is likely to run to (the liquidity/liquidation cluster), which sharpens the "target/next liquidity pool" field in the output template.
- Fade or confirm an extreme put/call ratio reading with the funding/OI read from the same window — agreement between the two raises conviction more than either alone.

Sources: [Phemex — Using open interest to time BTC trades](https://phemex.com/academy/open-interest-bitcoin-trading-2026), [Coinalyze — futures market data](https://coinalyze.net/), [Coinglass — BTC futures data](https://www.coinglass.com/currencies/BTC/futures), [Zipmex — analyzing funding rates](https://zipmex.com/blog/how-to-analyze-funding-rates-in-crypto/), [Coinglass — BTC funding rate](https://www.coinglass.com/FundingRate/BTC), [Medium/XT Exchange — liquidation cascades, funding regimes, OI signals](https://medium.com/@XT_com/bitcoin-futures-market-microstructure-liquidation-cascades-funding-regimes-and-open-interest-978b107b4889), [The Block — crypto options put/call open interest ratio](https://www.theblock.co/data/crypto-markets/options/open-interest-put-call-ratio), [Deribit — options statistics](https://www.deribit.com/statistics/BTC/metrics/options), [Coinglass — Deribit options data](https://www.coinglass.com/options/Deribit), [Wall Street Courier — CBOE put-call ratio as contrarian indicator](https://www.wallstreetcourier.com/spotlights/the-cboe-put-call-ratio-a-useful-greed-fear-contrarian-indicator/), [SentimenTrader — equity put/call ratio](https://sentimentrader.com/education/sentiment-indicator/equity-put-call-ratio)
