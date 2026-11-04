import { useEffect, useState, type RefObject } from "react";
import { fractionToPlayhead } from "@/lib/story-timeline";

/** Ease the scene playhead, without intercepting native wheel or touch scrolling. */
export function useStoryProgress(ref: RefObject<HTMLDivElement | null>, weights: number[]) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    let current = 0;
    let target = 0;
    let previousTime = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const tick = (time: number) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 64) : 16;
      previousTime = time;
      current += (target - current) * (reducedMotion.matches ? 1 : 1 - Math.exp(-elapsed / 105));
      if (Math.abs(target - current) < 0.0001) current = target;
      setProgress(current);
      if (current !== target) frame = requestAnimationFrame(tick);
      else { frame = 0; previousTime = 0; }
    };
    const update = () => {
      const element = ref.current;
      if (!element) return;
      const distance = Math.max(1, element.offsetHeight - window.innerHeight);
      target = fractionToPlayhead(window.scrollY / distance, weights);
      if (!frame) frame = requestAnimationFrame(tick);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref, weights]);

  return progress;
}