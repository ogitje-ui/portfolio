# Futures/derivatives timing detail

## Core metrics

- **Open interest (OI)** — total live futures/perp contracts outstanding. Rises when new positions open, falls when positions close. It's the best single proxy for how much leverage is currently in the market.
- **Funding rate** — the periodic payment between longs and shorts on perpetual futures that keeps perp price anchored to spot. Positive funding = longs pay shorts (market is long-heavy); negative = shorts pay longs (market is short-heavy).
- **Liquidation levels/heatmaps** — price levels where clusters of leveraged positions would be force-closed. Tools like Coinglass aggregate this across exchanges.
- **Long/short ratio** — retail vs. aggregate positioning skew, another crowding proxy.

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

Sources: [Phemex — Using open interest to time BTC trades](https://phemex.com/academy/open-interest-bitcoin-trading-2026), [Coinalyze — futures market data](https://coinalyze.net/), [Coinglass — BTC futures data](https://www.coinglass.com/currencies/BTC/futures), [Zipmex — analyzing funding rates](https://zipmex.com/blog/how-to-analyze-funding-rates-in-crypto/), [Coinglass — BTC funding rate](https://www.coinglass.com/FundingRate/BTC), [Medium/XT Exchange — liquidation cascades, funding regimes, OI signals](https://medium.com/@XT_com/bitcoin-futures-market-microstructure-liquidation-cascades-funding-regimes-and-open-interest-978b107b4889)
