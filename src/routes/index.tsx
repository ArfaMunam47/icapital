import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useStoryProgress } from "@/hooks/use-story-progress";
import { useStorySound } from "@/hooks/use-story-sound";
import { StoryLandscape, CloudReveal } from "@/components/story-landscape";
import { Button } from "@/components/ui/button";
import { ContactEnding } from "@/components/contact-ending";
import { Volume2, VolumeX } from "lucide-react";
import ridge from "@/assets/reference-scene_02_2segs_HD.webm.asset.json";
import alpine from "@/assets/reference-scene_03_2segs_HD.webm.asset.json";
import trail from "@/assets/reference-scene_04_3segs_HD.webm.asset.json";
import arch from "@/assets/reference-scene_05_2segs_HD.webm.asset.json";
import beach from "@/assets/reference-scene_06_2segs_HD.webm.asset.json";
import ridgePoster from "@/assets/reference-scene_02_2segs_HD-poster.jpg.asset.json";
import alpinePoster from "@/assets/reference-scene_03_2segs_HD-poster.jpg.asset.json";
import trailPoster from "@/assets/reference-scene_04_3segs_HD-poster.jpg.asset.json";
import archPoster from "@/assets/reference-scene_05_2segs_HD-poster.jpg.asset.json";
import beachPoster from "@/assets/reference-scene_06_2segs_HD-poster.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "iCapital — The value is in the journey" },
      { name: "description", content: "A cinematic journey through independent wealth advice: perspective, legacy and twenty years of setting the course." },
      { property: "og:title", content: "iCapital — The value is in the journey" },
      { property: "og:description", content: "A cinematic scroll story about independence, perspective and long-term vision." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const A = ({ children }: { children: ReactNode }) => <em className="accent-word">{children}</em>;

type Scene = { bg: "opening" | "video" | "sunset" | "birds" | "vision" | "paper" | "silk" | "current" | "living-video" | "horizon" | "clarity"; src?: string; poster?: string; title: ReactNode; body?: ReactNode; tone?: "dark"; center?: boolean; mist?: boolean; cloudReveal?: boolean; legacy?: boolean; paper?: boolean; creative?: "vision" | "clarity" | "journey" | "side" };

const scenes: Scene[] = [
  {
    bg: "opening",
    title: <>The value is in the <A>journey</A></>,
    body: <>For 20 years we have guided your wealth with judgement and independence, because the journey matters as much as reaching the destination</>,
  },
  { bg: "video", src: ridge.url, poster: ridgePoster.url, title: <>The decisions that<br />matter most demand<br /><A>perspective</A></> },
  { bg: "video", src: alpine.url, poster: alpinePoster.url, cloudReveal: true, tone: "dark", center: true, title: <>They do not<br />just <A>alter</A> the<br />destination</> },
  {
    bg: "vision", center: true,
    title: <>Our <A>compass:</A></>,
    body: <>A life lived with independence, a long-term vision and interests that are always aligned with yours</>,
  },
  { bg: "video", src: trail.url, poster: trailPoster.url, legacy: true, title: <>Some fortunes<br />speak<br />of <A>legacy</A></> },
  { bg: "paper", src: trail.url, poster: trailPoster.url, paper: true, center: true, title: <>Whether you are a family,<br />an institution or a company</>, body: <>We are by your side to preserve, grow and project your future</> },
  { bg: "video", src: beach.url, poster: beachPoster.url, title: <><A>Neither</A><br />do we</> },
  { bg: "birds", title: <>And for 20 years<br />we have set the <A>course</A></> },
  { bg: "horizon", creative: "vision", title: <>Vision matters<span className="creative-bridge">when it becomes</span>a <A>decision.</A></> },
  { bg: "clarity", poster: alpinePoster.url, creative: "clarity", title: <><span className="clarity-eyebrow">A clearer perspective</span>See beyond<br />the <A>complexity.</A></>, body: <>The decisions that shape a life deserve more than a closer look. They ask for distance, independent thinking and a clear view of what lies ahead.<span className="clarity-closing">Clarity for the decisions that shape tomorrow.</span></> },
  { bg: "living-video", src: beach.url, poster: beachPoster.url, creative: "journey", title: <>Never hurry<br />the <A>journey.</A></> },
  { bg: "living-video", src: ridge.url, poster: ridgePoster.url, creative: "side", title: <>We take<br />your <A>side.</A></> },
  { bg: "video", src: arch.url, poster: archPoster.url, title: <>Every journey<br />opens a new <A>perspective</A></> },
];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (v: number) => { const t = clamp(v); return t * t * (3 - 2 * t); };

function Birds() {
  const birds = useMemo(
    (): [number, number, number][] => [
      [10, 18, 1.2], [22, 30, 0.9], [33, 14, 1], [40, 28, 0.7], [58, 10, 1.3], [66, 22, 0.8],
      [74, 12, 1.1], [82, 30, 0.9], [14, 52, 0.8], [30, 64, 1], [70, 56, 0.9], [86, 70, 0.8], [60, 80, 0.7], [46, 72, 0.6],
    ],
    [],
  );
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-sky to-ink">
      {birds.map(([x, y, s], i) => (
        <svg key={i} className="bird absolute" style={{ left: `${x}%`, top: `${y}%`, width: 18 * s, animationDuration: `${19 + i * 1.7}s`, animationDelay: `${i * -2.6}s` }} viewBox="0 0 40 20">
          <path d="M0 8 Q10 0 20 10 Q30 0 40 8 Q30 6 20 16 Q10 6 0 8Z" fill="var(--night)" style={{ animationDuration: `${0.9 + i * 0.06}s`, animationDelay: `${i * -0.13}s` }} />
        </svg>
      ))}
    </div>
  );
}

function Index() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useStoryProgress(ref, scenes.length);
  const sound = useStorySound(p);

  const [panel, setPanel] = useState<null | "menu" | "contact">(null);
  const [lang, setLang] = useState<"en" | "es">("en");
  const [sent, setSent] = useState(false);
  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    setPanel(null);
    window.scrollTo({ top: (i / (scenes.length - 1)) * (el.offsetHeight - window.innerHeight), behavior: "smooth" });
  };

  const go = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    const max = el.offsetHeight - window.innerHeight;
    const target = clamp((Math.round(p) + dir) / (scenes.length - 1));
    window.scrollTo({ top: target * max, behavior: "smooth" });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (panel) return;
      if (e.target instanceof HTMLElement && e.target.closest("button, input, textarea, a, select")) return;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(1); }
      if (["ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); go(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const progress = p / (scenes.length - 1);
  const activeScene = scenes[Math.round(p)];

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => void sound.toggle()} aria-pressed={sound.enabled} aria-label={sound.enabled ? "Mute sound" : "Enable sound"} title={sound.unavailable ? "Sound unavailable — try again" : sound.enabled ? "Mute sound" : "Enable scene sound"} className="fixed bottom-6 left-6 z-[65] rounded-full border border-border bg-ink/80 text-foreground backdrop-blur-sm">
        {sound.enabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
      </Button>
        {/* Overlays */}
        <div className={`fixed inset-0 z-[60] bg-ink/80 backdrop-blur-xl transition-all duration-700 ${panel ? "opacity-100" : "pointer-events-none opacity-0"}`}>
          <button onClick={() => setPanel(null)} aria-label="Close" className="absolute right-6 top-6 text-2xl font-light md:right-10">×</button>
          {panel === "menu" && (
            <nav className="flex h-full flex-col items-center justify-center gap-6 text-center">
              {[["The journey", 0], ["Perspective", 1], ["Our compass", 3], ["Legacy", 4], ["Our side", 11], ["Vision", 8]].map(([l, i]) => (
                <button key={l as string} onClick={() => jump(i as number)} className="text-[clamp(1.6rem,3vw,2.6rem)] font-light tracking-tight transition hover:text-accent">
                  {l}
                </button>
              ))}
              <button onClick={() => setPanel("contact")} className="mt-6 accent-word text-xl">Talk to us</button>
            </nav>
          )}
          {panel === "contact" && (
            <div className="flex h-full items-center justify-center px-6">
              {sent ? (
                <p className="text-center text-2xl font-light">Thank you. We'll be <A>by your side</A> shortly.</p>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="w-full max-w-md space-y-5 text-center">
                  <h3 className="text-3xl font-light">Let's begin the <A>journey</A></h3>
                  <p className="text-[13px] text-muted-foreground">Tell us a little about yourself and an advisor will reach out.</p>
                  {["Name", "Email", "Phone"].map((f) => (
                    <input key={f} required={f !== "Phone"} type={f === "Email" ? "email" : "text"} placeholder={f} className="w-full border-b border-border bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-accent" />
                  ))}
                  <textarea placeholder="How can we help?" rows={3} className="w-full border-b border-border bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-accent" />
                  <button className="rounded-full bg-foreground px-8 py-2.5 text-[12px] text-primary-foreground transition hover:bg-accent">Send</button>
                </form>
              )}
            </div>
          )}
        </div>

    <div ref={ref} style={{ height: `${scenes.length * 120}vh` }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {scenes.map((sc, i) => {
          const d = p - i; // <0 upcoming, >0 passed
          if (i < Math.floor(p) || i > Math.floor(p) + 1) return null;
          const op = i <= p ? 1 : ease(1 + d);
          const textOp = 1 - ease((Math.abs(d) - 0.15) / 0.65);
          const ty = d * -20;
          return (
            <div key={i} data-scene={i} className={`story-scene absolute inset-0 ${sc.tone === "dark" ? "story-scene-dark" : ""} ${sc.creative ? "creative-scene" : ""} ${sc.paper ? "paper-scene" : ""} ${sc.legacy ? "legacy-scene" : ""} ${sc.bg === "clarity" ? "clarity-scene" : ""}`} style={{ opacity: op, zIndex: i }}>
              <div className="absolute inset-0">
                {(sc.bg === "opening" || sc.bg === "video" || sc.bg === "sunset" || sc.bg === "silk" || sc.bg === "current" || sc.bg === "living-video" || sc.bg === "horizon" || sc.bg === "clarity") && <StoryLandscape kind={sc.bg} src={sc.src} poster={sc.poster} progress={clamp((d + 0.85) / 1.7)} />}
                {sc.bg === "birds" && <Birds />}
                {sc.bg === "vision" && <div className="absolute inset-0 bg-ink" />}
                {sc.mist && <div className="scene-mist absolute inset-0" />}
                {sc.cloudReveal && <CloudReveal progress={clamp((d + 0.85) / 1.7)} />}
                {sc.bg === "paper" && <StoryLandscape kind="video" src={sc.src} poster={sc.poster} progress={clamp((d + 0.85) / 1.7)} />}
                {sc.bg === "paper" && <div className="paper-surface absolute inset-0" />}
                {sc.bg === "video" && !sc.mist && !sc.cloudReveal && <div className="video-copy-shade absolute inset-0" />}
              </div>
              <div
                className={sc.creative ? `story-copy creative-copy creative-copy-${sc.creative} absolute` : `story-copy text-cine absolute inset-x-0 mx-auto flex max-w-xl flex-col items-center px-6 text-center ${sc.center ? "story-copy-center" : "story-copy-upper"}`}
                style={{ opacity: textOp, transform: `translateY(${ty}px)` }}
              >
                <h2 className="story-heading font-normal leading-[1.15]">{sc.title}</h2>
                {sc.body && <p className="story-body mt-4 max-w-sm text-[14px] leading-relaxed text-muted-foreground">{sc.body}</p>}
              </div>
            </div>
          );
        })}

        {/* Header */}
        <header className={`story-header text-cine absolute inset-x-0 top-0 z-50 flex items-center justify-center px-6 py-6 ${activeScene?.tone === "dark" || activeScene?.paper ? "story-scene-dark" : ""}`}>
          <a href="#" className="flex items-center gap-1.5" aria-label="iCapital home">
            <span className="text-[26px] font-medium tracking-tight"><span className="text-accent">i</span>Capital</span>
            <span className="text-[6.5px] uppercase leading-[1.25] tracking-wider text-muted-foreground">Wealth<br />Management<br />Advisors</span>
          </a>
          <div className="absolute right-6 flex items-center gap-4 text-[11px] md:right-10">
            <button onClick={() => setPanel("contact")} className="rounded-full border border-border bg-muted px-4 py-1.5 backdrop-blur-sm transition hover:bg-foreground hover:text-primary-foreground">Contact</button>
            <button onClick={() => setLang("es")} className={`hidden sm:inline ${lang === "es" ? "font-semibold" : "opacity-70"}`}>ES</button>
            <button onClick={() => setLang("en")} className={`hidden sm:inline ${lang === "en" ? "font-semibold" : "opacity-70"}`}>EN</button>
            <button onClick={() => setPanel("menu")} aria-label="Menu" className="flex flex-col gap-[3px]"><span className="block h-px w-4 bg-foreground" /><span className="block h-px w-4 bg-foreground" /><span className="block h-px w-4 bg-foreground" /></button>
          </div>
        </header>

        {/* Intro loader */}
        <div aria-hidden="true" className="intro-loader pointer-events-none fixed inset-0 z-[70] flex items-center justify-center bg-foreground">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>

        {/* Right progress rail */}
        <div className="absolute right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-2 md:right-10 md:flex" style={{ opacity: clamp(p * 3) }}>
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1"><path d="M1 9 L5 3 L7 6 L9 2 L13 9Z" /></svg>
          <div className="relative h-40 w-px bg-border">
            <div className="absolute left-0 top-0 w-px bg-accent" style={{ height: `${progress * 100}%` }} />
          </div>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><path d="M6 0a5 5 0 1 0 4 7A4 4 0 0 1 6 0Z" /></svg>
        </div>

        {/* Bottom cue */}
        <div className="absolute inset-x-0 bottom-6 z-50 flex justify-center">
          {p < 0.3 ? (
            <button onClick={() => go(1)} className="text-cine text-[11px] text-muted-foreground">Discover more</button>
          ) : (
            <button onClick={() => go(1)} aria-label="Next scene" className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted backdrop-blur-sm">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M2 3.5 L5 6.5 L8 3.5" /></svg>
            </button>
          )}
        </div>
      </div>
    </div>
    <ContactEnding jump={jump} />
    </>
  );
}
