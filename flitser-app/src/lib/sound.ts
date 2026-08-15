let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function beep(frequency: number, durationMs: number, delayMs = 0, gainValue = 0.2) {
  const audioCtx = getCtx();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  gain.gain.value = gainValue;
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const startAt = audioCtx.currentTime + delayMs / 1000;
  const stopAt = startAt + durationMs / 1000;
  gain.gain.setValueAtTime(gainValue, startAt);
  gain.gain.exponentialRampToValueAtTime(0.001, stopAt);
  osc.start(startAt);
  osc.stop(stopAt);
}

/** Unlocks the AudioContext - call from a user gesture (e.g. the onboarding "Start" tap). */
export function primeAudio() {
  getCtx();
}

export function playFarAlert() {
  beep(880, 150);
}

export function playNearAlert() {
  beep(880, 130, 0);
  beep(880, 130, 220);
}

export function playCloseAlert() {
  beep(1046, 140, 0, 0.28);
  beep(1046, 140, 200, 0.28);
  beep(1046, 140, 400, 0.28);
}
