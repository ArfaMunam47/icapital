export type Soundscape = "wind" | "forest" | "ocean" | "birds" | "silk" | "steps" | "quiet";
/** Ambience per scene, matched to what each scene shows (13 scenes). */
const scenes: Soundscape[] = ["wind", "wind", "wind", "quiet", "steps", "quiet", "ocean", "birds", "silk", "quiet", "ocean", "wind", "quiet"];

/**
 * Optional approved music track (e.g. "/audio/foundation.mp3"). Leave null until a licensed file
 * is placed in public/audio — until then an original generative pad is the musical foundation.
 */
export const MUSIC_SRC: string | null = null;

/** Chord (Hz) for the musical foundation at a given playhead; the final chapter resolves home. */
const chords = [[146.83, 220, 277.18, 329.63], [123.47, 185, 246.94, 293.66], [130.81, 196, 246.94, 329.63], [146.83, 220, 293.66, 369.99]];
export function chordAt(progress: number) {
  if (progress >= scenes.length - 1.5) return 3;
  return Math.min(2, Math.floor(Math.max(0, progress) / 4));
}
export function soundMix(progress: number): Record<Soundscape, number> {
  const mix = { wind: 0, forest: 0, ocean: 0, birds: 0, silk: 0, steps: 0, quiet: 0 };
  const p = Math.max(0, Math.min(scenes.length - 1, progress));
  const i = Math.floor(p);
  const current = scenes[i];
  const next = scenes[Math.min(i + 1, scenes.length - 1)];
  if (current) mix[current] += 1 - (p - i);
  if (next) mix[next] += p - i;
  return mix;
}

export function createStorySound() {
  const context = new AudioContext();
  const output = context.createGain();
  output.gain.value = 0;
  const limiter = context.createDynamicsCompressor();
  limiter.threshold.value = -18;
  output.connect(limiter).connect(context.destination);
  // Ambience sits below the musical foundation.
  const master = context.createGain();
  master.gain.value = 0.5;
  master.connect(output);
  const music = context.createGain();
  music.gain.value = 0.55;
  music.connect(output);
  const musicFilter = context.createBiquadFilter();
  musicFilter.type = "lowpass";
  musicFilter.frequency.value = 900;
  musicFilter.connect(music);
  const gains: Partial<Record<Soundscape, GainNode>> = {};
  const sources: AudioScheduledSourceNode[] = [];
  const buffer = context.createBuffer(1, context.sampleRate * 12, context.sampleRate);
  const data = buffer.getChannelData(0);
  let previous = 0;
  for (let i = 0; i < data.length; i++) {
    previous = (previous + (Math.random() * 2 - 1) * 0.025) / 1.025;
    data[i] = previous * 5;
  }
  const noise = (name: Soundscape, frequency: number, level: number, pulse: number) => {
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = frequency;
    const breathing = context.createGain();
    breathing.gain.value = level;
    const lfo = context.createOscillator();
    lfo.frequency.value = pulse;
    const depth = context.createGain();
    depth.gain.value = level * 0.45;
    lfo.connect(depth).connect(breathing.gain);
    const gain = context.createGain();
    gain.gain.value = 0;
    source.connect(filter).connect(breathing).connect(gain).connect(master);
    source.start(context.currentTime, Math.random() * 8);
    lfo.start();
    gains[name] = gain;
    sources.push(source, lfo);
  };
  noise("wind", 520, 0.16, 0.085);
  noise("ocean", 1400, 0.28, 0.13);
  noise("forest", 2300, 0.09, 0.06);
  noise("birds", 1100, 0.08, 0.1);
  const silk = context.createGain();
  silk.gain.value = 0;
  silk.connect(master);
  gains.silk = silk;
  for (const frequency of [130.81, 196, 261.63]) {
    const tone = context.createOscillator();
    tone.frequency.value = frequency;
    const gain = context.createGain();
    gain.gain.value = 0.025;
    tone.connect(gain).connect(silk);
    tone.start();
    sources.push(tone);
  }
  const voices: OscillatorNode[] = [];
  let track: HTMLAudioElement | null = null;
  if (MUSIC_SRC) {
    track = new Audio(MUSIC_SRC);
    track.loop = true;
    track.crossOrigin = "anonymous";
    context.createMediaElementSource(track).connect(music);
  } else {
    // Original generative pad: slow detuned voices that glide between chords and never restart.
    chords[0]!.forEach((frequency, i) => {
      for (const detune of [-6, 6]) {
        const voice = context.createOscillator();
        voice.type = i === 0 ? "sine" : "triangle";
        voice.frequency.value = frequency;
        voice.detune.value = detune;
        const gain = context.createGain();
        gain.gain.value = i === 0 ? 0.05 : 0.022;
        const swell = context.createOscillator();
        swell.frequency.value = 0.03 + i * 0.011;
        const depth = context.createGain();
        depth.gain.value = gain.gain.value * 0.5;
        swell.connect(depth).connect(gain.gain);
        voice.connect(gain).connect(musicFilter);
        voice.start(); swell.start();
        voices.push(voice);
        sources.push(voice, swell);
      }
    });
  }
  let chord = 0;
  let mix = soundMix(0);
  let enabled = false;
  let disposed = false;
  const timer = window.setInterval(() => {
    if (!enabled || document.hidden || context.state !== "running") return;
    const amount = mix.birds * 0.03 + mix.forest * 0.015;
    if (amount < 0.003 || Math.random() < 0.45) return; // irregular, distant calls
    const bird = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    bird.frequency.setValueAtTime(1800 + Math.random() * 800, now);
    bird.frequency.exponentialRampToValueAtTime(3200, now + 0.09);
    bird.frequency.exponentialRampToValueAtTime(1700, now + 0.23);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(amount, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
    bird.connect(gain).connect(master);
    bird.start(now);
    bird.stop(now + 0.28);
    bird.onended = () => { bird.disconnect(); gain.disconnect(); };
  }, 3300);
  const steps = window.setInterval(() => {
    if (!enabled || document.hidden || context.state !== "running" || mix.steps < 0.05) return;
    const now = context.currentTime + Math.random() * 0.08; // human, unmetered gait
    const src = context.createBufferSource();
    src.buffer = buffer;
    const filter = context.createBiquadFilter();
    filter.type = "bandpass"; filter.frequency.value = 900 + Math.random() * 500; filter.Q.value = 0.8;
    const gain = context.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime((0.22 + Math.random() * 0.12) * mix.steps, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
    src.connect(filter).connect(gain).connect(master);
    src.start(now, Math.random() * 10, 0.35);
    src.onended = () => { src.disconnect(); filter.disconnect(); gain.disconnect(); };
  }, 640);
  const visibility = () => {
    if (document.hidden) void context.suspend();
    else if (enabled) void context.resume().catch(() => undefined);
    if (track) { if (document.hidden || !enabled) track.pause(); else void track.play().catch(() => undefined); }
  };
  document.addEventListener("visibilitychange", visibility);
  return {
    async setEnabled(value: boolean) {
      enabled = value;
      if (value) await context.resume();
      if (track) { if (value) await track.play(); else track.pause(); }
      if (!disposed) output.gain.setTargetAtTime(value ? 0.7 : 0, context.currentTime, value ? 0.8 : 0.2);
    },
    update(progress: number) {
      if (disposed) return;
      mix = soundMix(progress);
      const next = chordAt(progress);
      if (next !== chord && voices.length) {
        chord = next;
        voices.forEach((voice, i) => voice.frequency.setTargetAtTime(chords[next]![Math.floor(i / 2)]!, context.currentTime, 2.4));
      }
      musicFilter.frequency.setTargetAtTime(chord === 3 ? 1600 : 800 + progress * 40, context.currentTime, 2);
      for (const [name, node] of Object.entries(gains)) node.gain.setTargetAtTime(mix[name as Soundscape], context.currentTime, 0.65);
    },
    dispose() {
      disposed = true;
      clearInterval(timer); clearInterval(steps);
      document.removeEventListener("visibilitychange", visibility);
      sources.forEach(source => source.stop());
      track?.pause();
      void context.close();
    },
  };
}