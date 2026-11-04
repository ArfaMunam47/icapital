import { expect, it } from "vitest";
import { fractionToPlayhead, playheadToFraction } from "@/lib/story-timeline";
const w = [1, 2, 1];
it("gives longer scenes more scroll", () => {
  expect(fractionToPlayhead(0, w)).toBe(0);
  expect(fractionToPlayhead(0.5, w)).toBe(1);
  expect(fractionToPlayhead(1, w)).toBe(2);
});
it("round-trips scene positions", () => {
  expect(playheadToFraction(1, w)).toBe(0.5);
  expect(fractionToPlayhead(playheadToFraction(1.3, w), w)).toBeCloseTo(1.3);
});
