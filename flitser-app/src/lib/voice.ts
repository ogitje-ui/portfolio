export function speak(text: string, lang = 'en-US') {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 1.05;
  window.speechSynthesis.speak(utterance);
}

const CAMERA_LABEL: Record<string, string> = {
  fixed: 'speed camera',
  mobile: 'mobile speed camera',
  average_start: 'average speed check',
  average_end: 'average speed check',
  redlight: 'red light camera',
  hazard: 'reported hazard',
  unknown: 'speed camera',
};

export function announceCamera(type: string, roundedMeters: number, units: 'km' | 'mi') {
  const label = CAMERA_LABEL[type] ?? 'speed camera';
  const distance =
    units === 'mi'
      ? `${Math.round(roundedMeters * 3.28084 / 100) * 100} feet`
      : `${Math.round(roundedMeters / 50) * 50} meters`;
  speak(`${label} in ${distance}`);
}
