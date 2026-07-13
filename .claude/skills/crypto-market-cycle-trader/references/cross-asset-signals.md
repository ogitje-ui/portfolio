# Cross-asset & commodities signals

Reference file for lens 8. The core idea: TradFi and commodities markets are deeper, older, and less leverage-distorted than crypto — when they disagree with a crypto move or a scary headline, they're usually the ones telling the truth. This lens never generates entries; it classifies the regime, verifies headlines, and vetoes theses that the broader tape refuses to confirm.

## Instrument-by-instrument reading guide

### DXY — US Dollar Index (`DX-Y.NYB`)
The most important single input. BTC has spent most of its macro-correlated life inversely tracking the dollar: a rising DXY tightens global liquidity and pressures every risk asset priced in dollars; a falling DXY is the tide that lifts BTC. Read the 5-day trend, not the tick. A DXY breakout coinciding with a BTC support test is a much higher-probability breakdown than the chart alone suggests.

### Gold (`GC=F`) — the regime decoder
Never read gold alone; read the **gold–BTC pair**:
- **Gold up, BTC down** → genuine safe-haven flight. Capital wants protection and does not consider BTC protection — BTC is trading as a high-beta risk asset (this was the exact June 2025 Iran-war pattern: gold surged while BTC dipped). Bearish for BTC until the stress clears.
- **Gold up, BTC up, DXY down** → debasement/liquidity trade. Both monetary hedges bid together is the strongest macro regime BTC gets.
- **Gold flat/down, BTC up** → crypto-idiosyncratic strength (ETF flows, halving narrative) — fine, but check lens 4 confirms real spot demand.
- **Gold making new highs while BTC stays far below its own** → relative-strength warning: the haven bid is real but BTC isn't receiving it.

### Oil — WTI (`CL=F`) / Brent (`BZ=F`) — the geopolitical lie detector
Middle East risk prices through oil **first and most honestly** — it's the commodity physically at stake (Strait of Hormuz flows). Use it to verify every lens-7 war headline:
- Escalation headline + **oil rallying and holding the gains** → the market believes it. The risk-off leg has fuel; don't fade it early.
- Escalation headline + **oil fading the spike within hours** → the market is pricing containment/de-escalation regardless of the rhetoric. Downgrade the headline a tier; BTC shorts riding that headline are living on borrowed time.
- **Sustained** high oil (weeks) → inflation pass-through → hawkish rate-path repricing → feeds lens 6 as a slow risk-off pressure even without war drama.

### Silver (`SI=F`)
Gold's high-beta sibling — part monetary hedge, part industrial metal. The **gold/silver ratio** is the useful derivative: ratio falling (silver outperforming) leans risk-on/reflation; ratio spiking (silver dumped harder than gold) is defensive stress. Secondary signal — use as a tiebreaker, not a driver.

### US 10-Year yield (`^TNX`)
Rising real yields raise the opportunity cost of non-yielding assets — BTC and gold both. A fast spike (tens of bps in days) is a risk-off accelerant; a gentle grind lower is quiet fuel for risk assets. Read together with DXY: both rising fast = the tightening regime where BTC historically performs worst.

### VIX (`^VIX`)
Equity implied volatility = TradFi's fear price:
- **VIX low/falling while headlines are loud** → the deepest market in the world is calling the bluff. Trust it over the news cycle.
- **VIX > ~25–30 and rising** → genuine cross-asset stress; BTC's equity correlation is tightest exactly here, and liquidation cascades (lens 5) get amplified.

### ES/NQ futures (`ES=F`, `NQ=F`)
BTC's tightest intraday correlation in macro-driven regimes, and they trade nearly 24/5 — overnight and weekend ES direction frequently front-runs BTC's next session. A BTC breakdown while ES rallies is suspect (crypto-idiosyncratic, check lens 7 for a crypto-only shock); a joint breakdown is macro and trustworthy.

## The composite regime table

| DXY | Gold vs BTC | Oil | VIX | ES | Regime | BTC playbook |
|---|---|---|---|---|---|---|
| Falling | Both rising | Calm | Low | Up | Debasement / liquidity bid | Long bias, buy dips, swings allowed |
| Rising | Gold up, BTC down | Spiking + holding | Rising | Down | Genuine haven flight | Short bias; time entries with lens 7's spike-fade shape |
| Flat | Gold quiet, BTC weak | Fading its spike | Low/falling | Up | Market calling the geopolitical bluff | Fade panic; headline shorts lose tailwind; range tactics |
| Rising fast | Both falling | Any | Rising | Down | Yields/tightening shock | Stand down or minimal size; BTC lags the eventual recovery |

## Live data — tested working (July 2026), free, no API key

Yahoo Finance chart API, one call per symbol (a browser `User-Agent` header is required):

```
https://query1.finance.yahoo.com/v8/finance/chart/<SYMBOL>?interval=1d&range=5d
```

| Symbol | Instrument |
|---|---|
| `GC=F` | Gold futures (COMEX) |
| `SI=F` | Silver futures |
| `CL=F` | WTI crude futures |
| `BZ=F` | Brent crude futures |
| `DX-Y.NYB` | US Dollar Index |
| `^TNX` | US 10-Year Treasury yield (×10) |
| `^VIX` | CBOE Volatility Index |
| `ES=F` / `NQ=F` | S&P 500 / Nasdaq 100 futures |

`regularMarketPrice` in the response meta is the live quote; the closes array gives the short trend. URL-encode `^` as `%5E` in shell contexts. (Stooq's CSV endpoint was tested as an alternative and did not resolve from this environment — treat Yahoo as primary.)

## How this lens interacts with the others

- **Verifies lens 7**: no war-headline trade without checking oil's reaction first; no "systemic stress" call without VIX agreeing.
- **Contextualizes lens 2**: a BTC support break with DXY breaking out and ES down is trustworthy; the same break on a calm cross-asset tape is more likely a liquidity sweep.
- **Feeds lens 6**: sustained oil strength and fast yield moves are early inputs to the next CPI/FOMC repricing.
- **Veto power in synthesis**: when the cross-asset regime read directly contradicts a proposed trade's premise (e.g. short "on escalation" while oil fades and VIX falls), the trade drops one conviction tier or gets scrapped — regime beats narrative.
