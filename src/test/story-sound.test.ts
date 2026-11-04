import { expect, it } from "vitest";
import { chordAt, soundMix } from "@/lib/story-sound";
it("matches scene ambience to what each scene shows", () => {
  expect(soundMix(0).wind).toBe(1);
  expect(soundMix(2).wind).toBe(1);
  expect(soundMix(4).steps).toBe(1);
  expect(soundMix(6).ocean).toBe(1);
  expect(soundMix(7).birds).toBe(1);
  expect(soundMix(9).quiet).toBe(1);
  expect(soundMix(12).quiet).toBe(1);
});
it("crossfades adjacent scenes", () => {
  expect(soundMix(6.5).ocean).toBe(0.5);
  expect(soundMix(6.5).birds).toBe(0.5);
});
it("keeps one musical foundation that resolves at the final chapter", () => {
  expect(chordAt(0)).toBe(0);
  expect(chordAt(5)).toBe(1);
  expect(chordAt(9)).toBe(2);
  expect(chordAt(12)).toBe(3);
});
