# Macro & volatility calendar

TradFi macro prints and derivatives-expiry mechanics are the best-evidenced volatility drivers in this entire framework — unlike the astrology lens, these have a direct, well-documented transmission mechanism into both equities and crypto (rate-path repricing, cross-asset de-risking, options-hedging flow). Use this file to check "what's inside my trade window" before sizing an entry.

## FOMC meeting schedule 2026

Federal Reserve rate decisions are released at 14:00 ET, with a press conference at 14:30 ET. This is historically the single highest-impact scheduled event for both TradFi and crypto.

| Meeting | Dates | Includes dot plot / projections |
|---|---|---|
| 1 | Jan 27–28, 2026 | No |
| 2 | Mar 17–18, 2026 | Yes |
| 3 | Apr 28–29, 2026 | No |
| 4 | Jun 16–17, 2026 | Yes |
| 5 | Jul 28–29, 2026 | No |
| 6 | Sep 15–16, 2026 | Yes |
| 7 | Oct 27–28, 2026 | No |
| 8 | Dec 8–9, 2026 | Yes |

Meetings with dot-plot/economic projections (Mar, Jun, Sep, Dec) tend to produce larger moves than the projection-free meetings, since they reprice the market's full rate path, not just the immediate decision. Note: dates are tentative until confirmed at the prior meeting — recheck close to the date.

## CPI / PPI (BLS)

- CPI is typically released around the second week of the month, ~8:30 AM ET, covering the prior month's data.
- PPI typically follows CPI by a day or two in the same release window.
- These are the second-most-reliable scheduled volatility events after FOMC — an inflation surprise vs. consensus directly reprices Fed rate-path expectations, which flows straight into risk-asset (including crypto) volatility.
- Exact dates shift slightly year to year and are sometimes revised — check the official BLS schedule before the event: [CPI schedule](https://www.bls.gov/schedule/news_release/cpi.htm), [PPI schedule](https://www.bls.gov/schedule/news_release/ppi.htm).

## NFP (jobs report)

- Released the first Friday of most months, ~8:30 AM ET.
- Smaller average impact than CPI/FOMC individually, but a reliable short-burst volatility event, and can compound with a CPI print landing the same week.

## Quad/triple witching (TradFi, bleeds into crypto via correlation)

Third Friday of March, June, September, and December — simultaneous expiry of index options, index futures, and single-stock options. Drives elevated TradFi volume/volatility that frequently spills into crypto through correlated de-risking or re-risking flows, especially when crypto and equities are trading tightly correlated (common during macro-dominated regimes).

| Quarter | 2026 date | Note |
|---|---|---|
| Q1 | Mar 20, 2026 | Standard 3rd Friday |
| Q2 | Jun 18, 2026 | Shifted from Jun 19 due to the Juneteenth market holiday |
| Q3 | Sep 18, 2026 | Standard 3rd Friday |
| Q4 | Dec 18, 2026 | Standard 3rd Friday |

## Crypto options & futures expiries

- **Deribit (dominant BTC/ETH options venue)**: monthly expiry on the **last Friday of every month, 08:00 UTC**. The **quarterly expiries** (last Friday of Mar/Jun/Sep/Dec) carry by far the largest notional/open interest of the year and are the events most likely to move price mechanically, not just informationally.
- **CME BTC futures**: monthly contracts expire on a similar late-month schedule; large CME OI unwinds around expiry can add to spot/perp volatility.
- **Max pain**: the strike price where option sellers' aggregate payout is minimized (i.e., the level option pricing "gravitates toward") is often cited pre-expiry as a magnet. Treat it as a mild pinning tendency into settlement, not a reliable price target — multiple large expiries have settled well away from the max-pain strike. The more consistent pattern is **suppressed volatility going into expiry, then a volatility release in the following 24h** once dealer hedging flow (gamma exposure) unwinds.

## Other recurring high-volatility days

- **Jackson Hole Economic Symposium** — annual, late August; Fed Chair remarks here have historically moved rate expectations and, by extension, risk assets including crypto.
- Any unscheduled Fed Chair testimony/speech tied to rates, or major regulatory/legislative crypto-specific hearings, function the same way — check the economic calendar for the week, not just this file, since ad hoc events aren't on a fixed schedule.

## Weekly event-risk checklist (use before sizing any entry)

1. Is an FOMC decision inside this week? → Highest caution; avoid fresh directional risk in the 24–48h pre-window unless already in a confirmed trend.
2. Is CPI, PPI, or NFP inside this week? → Same caution, one notch down from FOMC.
3. Is this week a quad-witching week (3rd Friday of Mar/Jun/Sep/Dec)? → Expect cross-asset volatility bleed; don't be surprised by moves that don't originate in crypto-native flow.
4. Is a Deribit/CME monthly or quarterly expiry inside this week (last Friday of the month)? → Expect potential pre-expiry pinning followed by a post-settlement volatility release; reduce leverage into the expiry itself.
5. If none of the above apply → this is a "clear" week from a macro-calendar standpoint; rely on lenses 1–4 without an event-risk discount.

Sources: [Federal Reserve — FOMC meeting calendars](https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm), [FedRateCalc — 2026 FOMC schedule](https://fedratecalc.com/fomc-meeting-schedule/), [BLS — CPI release schedule](https://www.bls.gov/schedule/news_release/cpi.htm), [BLS — PPI release schedule](https://www.bls.gov/schedule/news_release/ppi.htm), [TradeStation — 2026 quadruple witching dates](https://www.tradestation.com/insights/2026/01/23/quadruple-witching-dates-2026-stock-futures-trading/), [Deribit — contract introduction policy](https://support.deribit.com/hc/en-us/articles/25944688876957-Contract-Introduction-Policy), [CoinDesk — options expiry and max-pain magnet coverage](https://www.coindesk.com/markets/2026/06/25/forget-max-pain-bitcoin-is-well-below-the-usd72-000-magnet-ahead-of-usd10-billion-options-expiry)
