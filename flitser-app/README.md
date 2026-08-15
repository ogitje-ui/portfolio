# Flitser Alert

A free, open-source speed camera warning app that runs entirely in your
browser — installable on iPhone (or any phone) as a PWA, no account,
no tracking, no proprietary app store dependency like Flitsmeister.

Camera locations come from [OpenStreetMap](https://www.openstreetmap.org/)
community data. Everything runs client-side: your GPS position never leaves
your device.

## Features

- 🗺️ Live map (Leaflet + OSM tiles) centered on your GPS position
- 📷 Speed camera data pulled from OpenStreetMap via the Overpass API, cached
  in IndexedDB for offline use
- 🔔 Staged proximity alerts (far / near / close) with synthesized audio
  beeps, spoken voice announcements, and an on-screen banner
- 🧭 Direction-aware alerting — cameras behind you are filtered out once
  you're moving fast enough to have a reliable heading
- 📍 Community-style reporting: drop a pin for a mobile radar or hazard at
  your current location; it auto-expires after a few hours and is stored
  locally on your device
- 📶 Works offline once camera data for an area has been cached
- 📱 Installable to your iPhone home screen (PWA), no App Store required

## Legal & safety disclaimer

Speed camera warning devices and apps are **legal in some countries and
restricted or regulated in others** (for example, some countries require
generic "danger zone" alerts rather than exact camera coordinates). You are
responsible for knowing and following the law in the country you're driving
in. This app does not encourage speeding — always drive within the posted
limit regardless of what any alert says. Do not interact with your phone
while driving; mount it and rely on the audio/voice alerts.

## Data source & attribution

Camera positions are queried live from the [Overpass
API](https://wiki.openstreetmap.org/wiki/Overpass_API) against
OpenStreetMap data, © OpenStreetMap contributors, licensed under the
[Open Database License (ODbL)](https://opendatacommons.org/licenses/odbl/).
Map tiles are the standard OSM tile layer. If OSM is missing a camera near
you, the best fix is to [add it to OpenStreetMap
directly](https://wiki.openstreetmap.org/wiki/Tag:highway%3Dspeed_camera) —
every app that uses OSM data benefits.

The public Overpass mirrors used by default are shared, rate-limited
infrastructure. For heavy personal use or a production deployment, consider
[running your own Overpass instance](https://wiki.openstreetmap.org/wiki/Overpass_API/Installation)
and pointing `src/lib/overpass.ts` at it.

## Tech stack

- React + TypeScript + Vite
- [react-leaflet](https://react-leaflet.js.org/) / Leaflet for the map
- `idb` for IndexedDB caching (camera cache, user reports, settings)
- `vite-plugin-pwa` (Workbox) for the installable, offline-capable PWA
- Web Audio API for alert tones, Web Speech API for voice announcements —
  no bundled audio assets

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL. Your browser will ask for location permission —
allow it to see nearby cameras and get alerts. On desktop, use your
browser's dev tools to override geolocation to test different areas.

## Build & deploy

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

`dist/` is a static site — deploy it to GitHub Pages, Netlify, Vercel,
Cloudflare Pages, or any static host. **PWAs require HTTPS** (except on
`localhost`), which all of the above provide by default.

## Installing on iPhone

1. Deploy the app (or open your dev URL) in **Safari** on your iPhone.
2. Tap the **Share** icon → **Add to Home Screen**.
3. Open it from the home screen icon — it now runs full-screen, like a
   native app.
4. On first launch, allow **Location** access. If you want background-tab
   notifications too, allow **Notifications** (supported on iOS 16.4+ for
   home-screen-installed web apps).

### iOS / Safari limitations

- iOS suspends JavaScript in background/locked tabs, so **keep the app open
  and your screen on** while navigating for continuous proximity alerts —
  this is the same limitation any browser-based nav app (including Google
  Maps in Safari) has. A native background service would require a real
  iOS app with location background modes, which is out of scope for a
  pure PWA.
- `navigator.vibrate` isn't supported on iOS Safari, so alerts there rely on
  sound, voice, and the visual banner rather than vibration.
- Voice announcements use the on-device Web Speech API voices, which vary in
  quality by iOS version and language pack installed.

## Roadmap / ideas for contributors

- Optional lightweight backend to sync community mobile-radar reports
  between users in real time (currently local-only)
- Turn-by-turn style "upcoming road" filtering instead of a simple radius,
  using route data
- Android/desktop-specific enhancements (Web Push background alerts where
  supported)
- CarPlay/Android Auto would need a native wrapper (e.g. Capacitor) — the
  web core here could be reused

## Contributing

Issues and PRs welcome. Please keep new features client-side and privacy
preserving unless there's a clear, opt-in reason not to be.

## License

Code is [MIT licensed](./LICENSE). Camera/map data from OpenStreetMap
remains under [ODbL](https://opendatacommons.org/licenses/odbl/) and is not
covered by the MIT license above.
