#!/usr/bin/env python3
"""
Dealer-positioning proxy for BTC from free Deribit options data (no key).

Not a true dealer gamma model (that needs per-option greeks + dealer-side sign
assumptions), but a usable stand-in built from open interest by strike:
  - Gamma walls: strikes with the largest OI act as magnets/pins into expiry and
    as high-friction levels intraday (dealer hedging clusters there).
  - Put walls below spot = support shelves (put writers/dealers defend); call
    walls above = resistance caps.
  - Max pain: the strike minimizing total option-holder payout — a mild pin bias
    into expiry, NOT a precise target.
  - P/C by OI: >1 put-heavy (fear/hedged), <~0.7 call-heavy (greed) — contrarian.

Usage: python3 gamma_walls.py            # nearest 3 expiries
       python3 gamma_walls.py --exp-count 5
"""
import json, re, sys, urllib.request, datetime as dt
from collections import defaultdict

EXP_COUNT = 3
if "--exp-count" in sys.argv:
    EXP_COUNT = int(sys.argv[sys.argv.index("--exp-count") + 1])

URL = ("https://www.deribit.com/api/v2/public/"
       "get_book_summary_by_currency?currency=BTC&kind=option")
req = urllib.request.Request(URL, headers={"User-Agent": "research"})
data = json.load(urllib.request.urlopen(req, timeout=20))["result"]

pat = re.compile(r"BTC-(\d{1,2}[A-Z]{3}\d{2})-(\d+)-([CP])")
spot = None
exps = {}
rows = []
for o in data:
    m = pat.match(o["instrument_name"])
    if not m:
        continue
    exp, strike, cp = m.group(1), int(m.group(2)), m.group(3)
    oi = o.get("open_interest", 0) or 0
    if o.get("underlying_price"):
        spot = o["underlying_price"]
    exps.setdefault(exp, dt.datetime.strptime(exp, "%d%b%y"))
    rows.append((exp, strike, cp, oi))

near = {e for e, _ in sorted(exps.items(), key=lambda x: x[1])[:EXP_COUNT]}
strike_oi = defaultdict(lambda: [0.0, 0.0])  # strike -> [call_oi, put_oi]
calls = puts = 0.0
for exp, strike, cp, oi in rows:
    if exp not in near:
        continue
    strike_oi[strike][0 if cp == "C" else 1] += oi
    if cp == "C":
        calls += oi
    else:
        puts += oi

# max pain: strike where total intrinsic payout to holders is minimized
strikes = sorted(strike_oi)
def payout(settle):
    tot = 0.0
    for k in strikes:
        c, p = strike_oi[k]
        tot += max(settle - k, 0) * c + max(k - settle, 0) * p
    return tot
max_pain = min(strikes, key=payout) if strikes else None

print(f"Spot ~{spot:,.0f}   nearest expiries: {sorted(near)}")
print(f"OI  calls {calls:,.0f} / puts {puts:,.0f}   P/C {puts/calls:.2f}"
      f"   max-pain {max_pain:,.0f}")
print("\nGamma walls (largest OI strikes = pins / friction levels):")
tot = {k: sum(v) for k, v in strike_oi.items()}
for s in sorted(tot, key=tot.get, reverse=True)[:10]:
    c, p = strike_oi[s]
    if abs(s - spot) <= 250:
        tag = "AT SPOT"
    elif s > spot:
        tag = "resistance (call wall)" if c >= p else "resistance"
    else:
        tag = "support (put wall)" if p >= c else "support"
    print(f"  {s:>7,}  OI {tot[s]:>7,.0f}  (C {c:>6,.0f} / P {p:>6,.0f})  {tag}")
