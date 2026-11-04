/** Maps native scroll fraction <-> scene playhead with per-scene durations (weights). */
const segments = (w: number[]) => w.slice(0, -1).map((v, i) => (v + (w[i + 1] ?? v)) / 2);

export function fractionToPlayhead(fraction: number, weights: number[]) {
  const seg = segments(weights);
  const total = seg.reduce((a, b) => a + b, 0);
  let d = Math.max(0, Math.min(1, fraction)) * total;
  for (let i = 0; i < seg.length; i++) {
    const len = seg[i]!;
    if (d <= len) return i + d / len;
    d -= len;
  }
  return seg.length;
}

export function playheadToFraction(playhead: number, weights: number[]) {
  const seg = segments(weights);
  const total = seg.reduce((a, b) => a + b, 0);
  const p = Math.max(0, Math.min(seg.length, playhead));
  let d = 0;
  for (let i = 0; i < Math.floor(p); i++) d += seg[i]!;
  if (p < seg.length) d += (p - Math.floor(p)) * seg[Math.floor(p)]!;
  return total ? d / total : 0;
}
