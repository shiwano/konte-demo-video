import { Animate, Image, type AnimateContext, type AnimateData, type MediaAsset } from "konte";
import {
  DirectionReview,
  DirectionShots,
  ReelReview,
  ReferenceReview,
  type DirectionSectionData,
  type DirectionShotRow,
  type FeedbackData,
  type Note,
  type Pin,
  type ReferenceAssetData,
  type ShotCardData,
  type TimelineRow,
  type TimelineShot,
} from "konte/workspace/ui/review-ui.js";
import reference from "./reference";

type Img = MediaAsset<"image">;
type El = JSX.Element;

// ───────────── the player's picture, stills on the board and clips in the video ─────────────

export type ClipKey = "03" | "04" | "05before" | "05";
export type Clips = (key: ClipKey, opts?: { start?: number; duration?: number; mediaStart?: number }) => El;

export const stills: Clips = (key) => {
  const src = { "03": reference.frame03, "04": reference.frame04, "05before": reference.frame05Before, "05": reference.frame05 }[key];
  return <Image src={src} fill />;
};

// ───────────── the event runner every shot's <Animate> plays ─────────────

const W = 1920;
const H = 1088;

type Ev = {
  t: number;
  d?: number;
  ease?: string;
  /** Camera: page point to centre on, and the zoom. */
  cam?: readonly [number, number, number];
  cur?: readonly [number, number];
  click?: boolean;
  show?: string;
  hide?: string;
  /** Takes a `display: none` line into the layout. */
  on?: string;
  off?: string;
  type?: string;
  y?: readonly [string, number];
  x?: readonly [string, number];
  clock?: readonly [number, number];
  press?: string;
};

const play = ({ timeline, split, data }: AnimateContext<AnimateData>) => {
  const evs = (data as unknown as { ev: Ev[]; w: number; h: number }).ev;
  const w = (data as unknown as { w: number }).w;
  const h = (data as unknown as { h: number }).h;
  const fmt = (v: number) => {
    const m = Math.floor(v / 60);
    const s = v - m * 60;
    return `${m}:${s < 10 ? "0" : ""}${s.toFixed(1)}`;
  };
  for (const e of evs) {
    const d = e.d ?? 0.5;
    const ease = e.ease ?? "power3.inOut";
    if (e.cam) {
      const [cx, cy, s] = e.cam;
      const clamp = (v: number, lo: number) => Math.min(0, Math.max(lo, v));
      const v = { x: clamp(w / 2 - cx * s, w - w * s), y: clamp(h / 2 - cy * s, h - h * s), scale: s };
      if (d === 0) timeline.set("#cam", v, e.t);
      else timeline.to("#cam", { ...v, duration: d, ease }, e.t);
    }
    if (e.cur) {
      const v = { x: e.cur[0], y: e.cur[1] };
      if (d === 0) timeline.set("#cursor", v, e.t);
      else timeline.to("#cursor", { ...v, duration: d, ease: e.ease ?? "power2.inOut" }, e.t);
    }
    if (e.click) {
      timeline.to("#cursor-arrow", { scale: 0.8, duration: 0.07, yoyo: true, repeat: 1, transformOrigin: "0% 0%" }, e.t);
      timeline.fromTo(
        "#cursor-ring",
        { scale: 0.2, opacity: 0.9 },
        { scale: 1.5, opacity: 0, duration: 0.45, ease: "power2.out", immediateRender: false },
        e.t,
      );
    }
    if (e.show) timeline.set(e.show, { autoAlpha: 1 }, e.t);
    if (e.hide) timeline.set(e.hide, { autoAlpha: 0 }, e.t);
    if (e.on) timeline.set(e.on, { display: "flex" }, e.t);
    if (e.off) timeline.set(e.off, { display: "none" }, e.t);
    if (e.type) {
      const s = split(e.type, { type: "words,chars" });
      timeline.set(s.chars, { display: "none" }, 0);
      timeline.to(s.chars, { display: "inline-block", duration: 0.001, stagger: { amount: d } }, e.t);
    }
    if (e.y) timeline.to(e.y[0], { y: e.y[1], duration: d, ease }, e.t);
    if (e.x) timeline.to(e.x[0], { x: e.x[1], duration: d, ease: e.ease ?? "none" }, e.t);
    if (e.clock) {
      const o = { v: e.clock[0] };
      timeline.to(
        o as unknown as string,
        {
          v: e.clock[1],
          duration: d,
          ease: "none",
          onUpdate: () => {
            document.querySelectorAll(".kr-time-now").forEach((el) => {
              el.textContent = fmt(o.v);
            });
          },
        },
        e.t,
      );
    }
    if (e.press) timeline.to(e.press, { scale: 0.94, opacity: 0.6, duration: 0.12, ease: "power2.out" }, e.t);
  }
};

function Play({ ev }: { ev: Ev[] }) {
  return <Animate data={{ ev, w: W, h: H } as unknown as AnimateData} script={play} />;
}

// ───────────── chrome shared by every shot ─────────────

const CSS = `
.scr{position:absolute;inset:0;overflow:hidden;background:#0b0c0f;--font-term:"JetBrains Mono",ui-monospace,monospace;}
.cam{position:absolute;left:0;top:0;width:1920px;height:1088px;transform-origin:0 0;}
.st{position:absolute;left:0;top:0;width:1920px;height:1088px;}
.off{visibility:hidden;opacity:0;}
.cursor{position:absolute;left:0;top:0;z-index:50;pointer-events:none;}
.cursor-ring{position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;border:3px solid rgba(169,159,255,.9);opacity:0;}
.step{position:absolute;right:56px;top:44px;z-index:60;display:flex;align-items:center;gap:22px;padding:16px 40px 16px 18px;border-radius:999px;background:rgba(21,22,29,.94);border:2px solid #4c5166;box-shadow:0 16px 44px rgba(0,0,0,.6);color:#f0f1f7;font-size:50px;font-weight:700;letter-spacing:-.015em;}
.step-n{display:flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:50%;background:#6e62f5;color:#fff;font-size:38px;font-weight:800;}
.term{position:absolute;inset:0;background:#101012;color:#e8e8ea;font-family:var(--font-term);font-size:29px;line-height:1.5;display:flex;flex-direction:column;padding:48px 84px 40px;}
.term-log{flex:0 1 auto;min-height:0;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;gap:2px;}
.tl{display:flex;white-space:pre-wrap;}
.tl.hid{display:none;}
.tl-b{flex:none;width:2ch;}
.tl-body{flex:1;min-width:0;}
.tl.text .tl-b{color:#e8e8ea;}
.tl.tool .tl-b{color:#4eba65;}
.tl.tool b{font-weight:700;}
.tl.out{color:#8e8e96;}
.tl.user{color:#b9b9c0;background:#232327;margin:10px 0;padding:2px 0;}
.tl.spin{color:#d97757;}
.tl.gap{height:14px;}
.tl.head{color:#e8e8ea;}
.tl.head .mascot{color:#d97757;}
.tl.dim{color:#8e8e96;}
.tl.cont{color:#e8e8ea;}
.g1{display:inline-block;width:1ch;}
.mascot{display:block;flex:none;}
.tl.q-title{color:#e8e8ea;}
.tl.q-opt{color:#e8e8ea;}
.tl.q-opt.sel{color:#b1b9f9;}
.tl.q-desc{color:#8e8e96;}
.tl.q-hint{color:#8e8e96;font-size:24px;}
.tl.q-rule{color:#56565e;}
.term-in{margin-top:18px;border-top:2px solid #4a4a52;border-bottom:2px solid #4a4a52;padding:10px 0;display:flex;gap:1ch;}
.term-in-p{color:#e8e8ea;}
.term-caret{display:inline-block;width:.6em;height:1.15em;vertical-align:-.2em;background:#e8e8ea;}
.term-hint{color:#6e6e76;font-size:24px;padding-top:8px;}
`;

function Cursor() {
  return (
    <div className="cursor" id="cursor">
      <div className="cursor-ring" id="cursor-ring" />
      <svg id="cursor-arrow" width="34" height="48" viewBox="0 0 17 24" style={{ display: "block" }}>
        <path d="M1 1 L1 19 L5.6 14.8 L8.6 21.6 L11.4 20.4 L8.5 13.8 L14.6 13.8 Z" fill="#fff" stroke="#000" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function Step({ n, label }: { n: number; label: string }) {
  return (
    <div className="step" id="step">
      <span className="step-n">{n}</span>
      {label}
    </div>
  );
}

function Screen({ children, ev, step, cursor = true }: { children: El | El[]; ev: Ev[]; step?: [number, string]; cursor?: boolean }) {
  const stepEv: Ev[] = step ? [] : [];
  return (
    <>
      <style>{CSS}</style>
      <div className="scr">
        <div className="cam" id="cam">
          {children}
          {cursor && <Cursor />}
        </div>
        {step && <Step n={step[0]} label={step[1]} />}
      </div>
      <Play ev={[...stepEv, ...ev]} />
      {step && (
        <Animate
          script={({ timeline }) => {
            timeline.from("#step", { x: 40, opacity: 0, duration: 0.45, ease: "power3.out" }, 0.05);
          }}
        />
      )}
    </>
  );
}

const State = ({ id, on, children }: { id: string; on?: boolean; children: El }) => (
  <div className={on ? "st" : "st off"} id={id}>
    {children}
  </div>
);

// ───────────── the Claude Code terminal ─────────────

type Line =
  | { k: "head" }
  | { k: "gap" }
  | { k: "user" | "text" | "tool" | "out" | "spin" | "dim" | "cont" | "q-title" | "q-opt" | "q-desc" | "q-hint" | "q-rule"; s: string; sel?: boolean };

type TLine = Line & { id?: string; hid?: boolean };

function TermLine({ l }: { l: TLine }) {
  const cls = (k: string) => ["tl", k, l.hid ? "hid" : "", "sel" in l && l.sel ? "sel" : ""].join(" ");
  const id = l.id;
  switch (l.k) {
    case "head":
      return (
        <div className={cls("head")} id={id} style={{ gap: "2ch", marginBottom: "18px" }}>
          <Mascot />
          <div>
            <div>Claude Code v2.1.302</div>
            <div style={{ color: "#8e8e96" }}>Opus 5.5 · Claude Max</div>
            <div style={{ color: "#8e8e96" }}>~/code/my-video</div>
          </div>
        </div>
      );
    case "gap":
      return <div className={cls("gap")} id={id} />;
    case "text":
    case "tool":
      return (
        <div className={cls(l.k)} id={id}>
          <span className="tl-b">●</span>
          <span className="tl-body">{l.k === "tool" ? <ToolText s={l.s} /> : glyphs(l.s)}</span>
        </div>
      );
    case "user":
      return (
        <div className={cls("user")} id={id}>
          <span className="tl-b">❯</span>
          <span className="tl-body">{l.s}</span>
        </div>
      );
    default:
      return (
        <div className={cls(l.k)} id={id}>
          <span className="tl-body">{glyphs(l.s)}</span>
        </div>
      );
  }
}

const MASCOT = [" ▐▛███▜▌", "▝▜█████▛▘", "  ▘▘ ▝▝"];
const QUADS: Record<string, number[]> = { "█": [0, 1, 2, 3], "▐": [1, 3], "▌": [0, 2], "▛": [0, 1, 2], "▜": [0, 1, 3], "▝": [1], "▘": [0] };

function Mascot() {
  const rects = MASCOT.flatMap((row, r) =>
    [...row].flatMap((ch, c) => (QUADS[ch] ?? []).map((q) => <rect x={c * 2 + (q % 2)} y={r * 2 + Math.floor(q / 2)} width={1.02} height={1.02} />)),
  );
  return (
    <svg className="mascot" viewBox="0 0 18 6" preserveAspectRatio="none" shapeRendering="crispEdges" style={{ width: "9ch", height: "4.5em" }} fill="#d97757">
      {rects}
    </svg>
  );
}

const glyphs = (s: string) => s.split(/([⎿✻])/).map((part, i) => (i % 2 ? <span className="g1">{part}</span> : part));

function ToolText({ s }: { s: string }) {
  const i = s.indexOf("(");
  return i < 0 ? (
    <b>{s}</b>
  ) : (
    <>
      <b>{s.slice(0, i)}</b>
      {s.slice(i)}
    </>
  );
}

function Terminal({ lines, input = "", inputId }: { lines: TLine[]; input?: string; inputId?: string }) {
  return (
    <div className="term">
      <div className="term-log">
        {lines.map((l) => (
          <TermLine l={l} />
        ))}
      </div>
      <div className="term-in">
        <span className="term-in-p">❯</span>
        <span>
          <span id={inputId}>{input}</span>
          <span className="term-caret" />
        </span>
      </div>
      <div className="term-hint">? for shortcuts</div>
    </div>
  );
}

// The session's transcript, in order; each terminal shot shows what came before and reveals its own.
const PITCHES = [
  ["Last Order", "The owner sets out one cup more than there are customers left."],
  ["Night Window", "A girl at the window table watches the street go dark, one light at a time."],
  ["Borrowed Umbrella", "At closing time, the old café owner lends his last customer the yellow umbrella."],
] as const;

const question = (sel: number, id: string, hid = true): TLine[] => [
  { k: "q-rule", s: "─".repeat(70), id: `${id}-a`, hid },
  { k: "q-title", s: " ☐ Pitch", id: `${id}-b`, hid },
  { k: "q-title", s: " Which one shall we make?", id: `${id}-c`, hid },
  ...PITCHES.flatMap(([title, desc], i): TLine[] => [
    { k: "q-opt", s: `${i === sel ? "❯" : " "} ${i + 1}. ${title}`, sel: i === sel, id: `${id}-o${i}`, hid },
    { k: "q-desc", s: `     ${desc}`, id: `${id}-d${i}`, hid },
  ]),
  { k: "q-hint", s: " Enter to select · ↑/↓ to navigate · Esc to cancel", id: `${id}-h`, hid },
];

const qIds = (id: string) => [`${id}-a`, `${id}-b`, `${id}-c`, `${id}-o0`, `${id}-d0`, `${id}-o1`, `${id}-d1`, `${id}-o2`, `${id}-d2`, `${id}-h`].map((x) => `#${x}`).join(",");

// ───────────── Borrowed Umbrella, the film being made ─────────────

type ShotId = "01" | "02" | "03" | "04" | "05" | "06";
const IDS: ShotId[] = ["01", "02", "03", "04", "05", "06"];

const ACTIONS: Record<ShotId, string> = {
  "01": "Rain streams down the rain-streaked window beside the girl in the navy coat, the last customer left at the window table, while the old café owner dries cups behind the counter.",
  "02": "The girl in the navy coat wraps both hands around her empty cup and watches the rain.",
  "03": "Behind the counter, the old café owner stops drying a cup and looks over at the girl in the navy coat.",
  "04": "The old café owner's hand lifts the yellow umbrella out of the umbrella stand.",
  "05": "At the window table, the old café owner holds the yellow umbrella out to the girl in the navy coat.",
  "06": "Beyond the rain-streaked window, the girl in the navy coat walks away down the street under the open yellow umbrella.",
};
const DURATIONS: Record<ShotId, number> = { "01": 4, "02": 3.5, "03": 3, "04": 2.5, "05": 4, "06": 4 };
const STARTS: Record<ShotId, number> = { "01": 0, "02": 4, "03": 7.5, "04": 10.5, "05": 13, "06": 17 };
const span = (id: ShotId) => ({ start: STARTS[id], end: STARTS[id] + DURATIONS[id] });
const LINES = {
  "02": { speaker: "the girl in the navy coat", text: "It's not going to stop, is it?", acting: "Barely above a whisper, half to herself, resigned but not unhappy." },
  "05": { speaker: "the old café owner", text: "Take it. Bring it back whenever.", acting: "Low and unhurried, a small smile in it, as if it were nothing at all." },
};

const shotCards = (state: Partial<Record<ShotId, Partial<ShotCardData>>>): ShotCardData[] =>
  IDS.map((id) => ({ id, action: ACTIONS[id], ...state[id] }));
const timelineShots = (state: Partial<Record<ShotId, Partial<TimelineShot>>>): TimelineShot[] =>
  IDS.map((id) => ({ id, duration: DURATIONS[id], ...state[id] }));

const icon = reference.icon;

// ───────────── direction review ─────────────

const brief = (accepted: boolean): DirectionSectionData => ({
  title: "Brief",
  accepted,
  selected: !accepted,
  fields: [
    { field: "Logline", value: "At closing time on a rainy night, the old café owner lends his last customer the yellow umbrella from the stand by the door." },
    {
      field: "Hook",
      value: "Rain running down a café window at closing time, and one girl at the window table with nowhere dry to go.",
      agent: "Shot 01 shows the chairs already upturned, so 'closing time' reads without a word.",
    },
    { field: "Audience", value: "People who watch short films on a quiet evening. They leave with the small warmth of a stranger's kindness." },
    { field: "Tone", value: "Quiet, tender and unhurried. Nobody explains anything; the kindness is in a gesture and two short lines." },
    {
      field: "Look",
      value: "2D anime with painterly backgrounds and soft cel shading. A warm amber café interior against the cold blue of a rainy night outside; the yellow umbrella is the only saturated colour in the piece.",
    },
  ],
});

const policy = (accepted: boolean): DirectionSectionData => ({
  title: "Policy",
  accepted,
  fields: [
    { field: "Format", value: "16:9  1248×704 (0.9 Mpx) → 1280×720, 24 fps" },
    { field: "Language", value: "en  English" },
    { field: "Speech", value: "Free  any script allowed" },
  ],
});

const shotRows: DirectionShotRow[] = [
  { id: "01", role: "opening", roleTone: "opening", action: ACTIONS["01"], place: "the corner café", framing: "wide", setup: "the café, wide", lineup: "the old café owner / the girl in the navy coat", duration: 4 },
  { id: "02", role: "rising", roleTone: "rising", action: ACTIONS["02"], line: LINES["02"], place: "the corner café", framing: "close", setup: "the girl, close", lineup: "the girl in the navy coat", duration: 3.5 },
  { id: "03", role: "rising", roleTone: "rising", action: ACTIONS["03"], place: "the corner café", framing: "medium", setup: "the counter, medium", lineup: "the old café owner", duration: 3 },
  { id: "04", role: "turning point", roleTone: "turn", action: ACTIONS["04"], place: "the corner café", framing: "insert", setup: "the umbrella stand, insert", lineup: "the old café owner", duration: 2.5 },
  { id: "05", role: "payoff", roleTone: "payoff", action: ACTIONS["05"], line: LINES["05"], place: "the corner café", framing: "medium", setup: "the window table, medium", lineup: "the old café owner / the girl in the navy coat", duration: 4 },
  { id: "06", role: "payoff", roleTone: "payoff", action: ACTIONS["06"], telop: "Borrowed Umbrella", place: "the corner café", framing: "wide", setup: "through the window, wide", lineup: "the girl in the navy coat", duration: 4 },
];

const DIRECTION_HANDOFF =
  "Six shots, about 21 seconds: one quiet act of kindness at closing time. Please sign off the direction before we spend on the animatic.";

function DirectionPage({ accepted, submit }: { accepted: boolean; submit?: boolean }) {
  return (
    <DirectionReview
      width={W}
      submit={submit}
      icon={icon}
      header={{ hideStale: true, nextToReview: accepted ? undefined : 8, allAccepted: accepted }}
      handoff={DIRECTION_HANDOFF}
      sections={[
        brief(accepted),
        policy(accepted),
        rosterSection("Characters", [ROSTER.girl, ROSTER.owner], accepted),
        rosterSection("Props", [ROSTER.umbrella], accepted),
        rosterSection("Locations", [ROSTER.cafe], accepted),
      ]}
      after={<DirectionShots title="Flow & Shots" accepted={accepted} rows={shotRows} />}
    />
  );
}

// ───────────── reference review ─────────────

const ROSTER = {
  girl: { kind: "Character", name: "the girl in the navy coat", description: "Early twenties, shoulder-length black hair still damp at the ends, a navy duffle coat over a cream knit sweater. No umbrella." },
  owner: { kind: "Character", name: "the old café owner", description: "Seventies, short white hair, round wire glasses, a gray cardigan under a brown canvas apron. Moves slowly and never hurries a customer." },
  umbrella: { kind: "Prop", name: "the yellow umbrella", description: "A worn, mustard-yellow long umbrella with a curved bamboo handle; the one thing in the café that is not amber or brown." },
  cafe: { kind: "Location", name: "the corner café", description: "A small old café at night, dark wood and warm amber pendant lights, almost empty at closing time. Rain on a dark street outside." },
};

const rosterSection = (title: string, entries: { name: string; description: string }[], accepted: boolean): DirectionSectionData => ({
  title,
  accepted,
  fields: entries.map((e) => ({ field: e.name, value: e.description })),
});

const REFERENCE_HANDOFF =
  "The cast, the umbrella, the café and the sound bed. Pick one take per asset; everything downstream is drawn from these.";

const refAssets = (accepted: number): ReferenceAssetData[] => [
  {
    name: "girl",
    image: reference.refGirl,
    aspect: 2 / 3,
    takes: 3,
    fresh: accepted > 0 ? undefined : 3,
    accepted: accepted > 0,
    roster: ROSTER.girl,
    agent: "Three takes, same outfit. This one holds the damp hair ends best; the toggles read clearly.",
  },
  {
    name: "owner",
    image: reference.refOwner,
    aspect: 2 / 3,
    takes: 3,
    fresh: accepted > 1 ? undefined : 3,
    accepted: accepted > 1,
    roster: ROSTER.owner,
    agent: "The round wire glasses and the long apron hold across takes. This one stoops a little more, which suits him.",
  },
  {
    name: "umbrella",
    image: reference.refUmbrella,
    aspect: 1,
    takes: 2,
    fresh: accepted > 2 ? undefined : 2,
    accepted: accepted > 2,
    roster: ROSTER.umbrella,
    agent: "Mustard rather than lemon yellow, so it sits inside the amber palette and still pops against the blue street.",
  },
  {
    name: "cafe",
    image: reference.refCafe,
    aspect: 2,
    takes: 2,
    fresh: accepted > 3 ? undefined : 2,
    accepted: accepted > 3,
    roster: ROSTER.cafe,
    agent: "The counter sits left and the window table right, matching the wide setup.",
  },
];

function ReferencePage({ accepted }: { accepted: number }) {
  return (
    <ReferenceReview
      width={W}
      icon={icon}
      header={{ needsReview: false, hideStale: true, nextToReview: 8 - accepted }}
      handoff={REFERENCE_HANDOFF}
      selected={["girl", "owner", "umbrella", "cafe"][Math.min(accepted, 3)]}
      groups={[{ title: "Images", assets: refAssets(accepted) }]}
    />
  );
}

// ───────────── animatic and video review ─────────────

const animaticRows: TimelineRow[] = [
  { label: "Image", icon: "image", clips: IDS.map((id) => ({ label: "first", ...span(id), kind: "image" as const, takes: 1, fresh: 1 })) },
  {
    label: "Audio",
    icon: "speaker",
    clips: [
      { label: "line", start: 4.6, end: 7.4, kind: "line", takes: 1, fresh: 1 },
      { label: "line", start: 13.8, end: 16.8, kind: "line", takes: 1, fresh: 1 },
    ],
  },
];

const videoRows = (fresh05: boolean): TimelineRow[] => [
  {
    label: "Video",
    icon: "film",
    clips: IDS.map((id) => ({
      label: "motion",
      ...span(id),
      kind: "video" as const,
      takes: id === "05" && fresh05 ? 2 : 1,
      fresh: id === "05" && fresh05 ? 1 : undefined,
      accepted: true,
    })),
  },
  {
    label: "Audio",
    icon: "speaker",
    lanes: 2,
    clips: [
      { label: "rain", start: 0, end: 21, kind: "audio", takes: 1, accepted: true },
      { label: "bgm", start: 0, end: 21, kind: "audio", takes: 2, accepted: true },
    ],
  },
];

const PLAYER = { x: 180, y: 136, w: 823, h: 463 };
/** A point on the player's picture, in page pixels. */
const onPlayer = (fx: number, fy: number) => [PLAYER.x + fx * PLAYER.w, PLAYER.y + fy * PLAYER.h] as const;
/** The timeline's track: page x of reel second `t` over a 21s view. */
const TRACK = { x: 266, w: 729 };
const trackX = (t: number) => TRACK.x + (t / 21) * TRACK.w;

const VIDEO_HANDOFF = "Every shot is in motion now. Play it through; pin anything that should change on the frame itself.";

function AnimaticPage({ panels }: { panels: El }) {
  return (
    <ReelReview
      width={W}
      icon={icon}
      stage="Animatic"
      header={{ needsReview: false, hideStale: true }}
      handoff="The whole board, six panels and both lines, on the cut's own clock. Scrub through and accept the panels that tell it."
      media={panels}
      time="0:00.0"
      total="0:21.0"
      timeline={{ shots: timelineShots({}), rows: animaticRows, playhead: 0, selected: "01" }}
      feedback={{ target: "Shot 01", position: "key", blocking: "The owner turns the cup slowly inside the cloth; the girl stays still at the window table, watching the rain.", camera: "fixed", agent: "The chairs are upturned on the far tables, so it reads as closing time." }}
      shots={shotCards({})}
    />
  );
}

function VideoPage(p: {
  media: El;
  selected: ShotId;
  time: string;
  playhead: number;
  feedback: FeedbackData;
  cards: Partial<Record<ShotId, Partial<ShotCardData>>>;
  pins?: Pin[];
  handoff?: string;
  fresh05?: boolean;
  dirty?: boolean;
  shotsFrom?: number;
  hideStale?: boolean;
}) {
  const accepted = Object.values(p.cards).filter((c) => c?.accepted).length;
  return (
    <ReelReview
      width={W}
      icon={icon}
      stage="Video"
      header={{ needsReview: false, hideStale: p.hideStale ?? true, dirty: p.dirty, allAccepted: accepted === 6 }}
      handoff={p.handoff ?? VIDEO_HANDOFF}
      media={p.media}
      pins={p.pins}
      time={p.time}
      total="0:21.0"
      timeline={{ shots: timelineShots(Object.fromEntries(IDS.map((id) => [id, { accepted: !!p.cards[id]?.accepted }]))), rows: videoRows(!!p.fresh05), playhead: p.playhead, selected: p.selected }}
      feedback={p.feedback}
      shots={shotCards(p.cards)}
      shotsFrom={p.shotsFrom}
      soundtrack={{ accepted: true }}
    />
  );
}

const acceptedThrough = (ids: ShotId[]) => Object.fromEntries(ids.map((id) => [id, { accepted: true }])) as Partial<Record<ShotId, Partial<ShotCardData>>>;

const NOTE_TEXT = "She should take the umbrella here.";
const PIN: Pin = { n: 1, x: 0.63, y: 0.64 };

const feedback05 = (extra: Partial<FeedbackData>): FeedbackData => ({
  target: "Shot 05",
  line: { speaker: "the old café owner", text: LINES["05"].text, acting: LINES["05"].acting },
  blocking: "He holds the umbrella a little further toward her; she looks up at him and her hands leave the cup.",
  camera: "fixed",
  ...extra,
});

// ───────────── the shots ─────────────

const TERM_SESSION: TLine[] = [
  { k: "head" },
  { k: "user", s: "/konte-checkin", id: "u1", hid: true },
  { k: "spin", s: "✻ Cogitating…", id: "sp1", hid: true },
  { k: "tool", s: "Bash(konte video current)", id: "t1", hid: true },
  { k: "out", s: '  ⎿  Video: none — this workspace has no videos. Run "konte video new <name>".', id: "o1", hid: true },
  { k: "tool", s: "Skill(drafting-guide)", id: "t2", hid: true },
  { k: "out", s: "  ⎿  Successfully loaded skill", id: "o2", hid: true },
  { k: "text", s: "A new piece, then. What do you want to make, and where will it play?", id: "x1", hid: true },
];

export function Shot01() {
  return (
    <Screen
      step={[1, "Plan"]}
      cursor={false}
      ev={[
        { t: 0, d: 0, cam: [0, 0, 1.12] },
        { t: 0.2, d: 0.7, type: "#in1" },
        { t: 1.05, off: "#in1" },
        { t: 1.05, on: "#u1" },
        { t: 1.15, on: "#sp1" },
        { t: 1.45, off: "#sp1" },
        { t: 1.45, on: "#t1" },
        { t: 1.6, on: "#o1" },
        { t: 1.8, on: "#t2" },
        { t: 1.9, on: "#o2" },
        { t: 2.0, on: "#x1" },
      ]}
    >
      <Terminal lines={TERM_SESSION} input="/konte-checkin" inputId="in1" />
    </Screen>
  );
}

const TERM_PITCH: TLine[] = [
  ...TERM_SESSION.filter((l) => l.id !== "sp1").map((l) => ({ ...l, hid: false })),
  { k: "user", s: "A quiet short film. Rain, a café, one small kindness. About twenty seconds." },
  { k: "text", s: "Three pitches, each turning on one gesture:" },
  ...question(0, "q0", false),
  ...question(1, "q1"),
  ...question(2, "q2"),
  { k: "text", s: "User answered Claude's questions:", id: "a1", hid: true },
  { k: "out", s: "  ⎿  · Which one shall we make? → Borrowed Umbrella", id: "a2", hid: true },
  { k: "tool", s: 'Bash(konte preview direction --summary "Six shots, about 21 seconds…")', id: "a3", hid: true },
  { k: "out", s: "  ⎿  Running in the background (↓ to manage)", id: "a4", hid: true },
];

export function Shot02() {
  return (
    <Screen
      cursor={false}
      ev={[
        { t: 0, d: 0, cam: [0, 0, 1.15] },
        { t: 0.55, off: qIds("q0") },
        { t: 0.55, on: qIds("q1") },
        { t: 1.0, off: qIds("q1") },
        { t: 1.0, on: qIds("q2") },
        { t: 1.6, off: qIds("q2") },
        { t: 1.6, on: "#a1,#a2" },
        { t: 2.15, on: "#a3" },
        { t: 2.4, on: "#a4" },
      ]}
    >
      <Terminal lines={TERM_PITCH} />
    </Screen>
  );
}

export function Shot03() {
  return (
    <Screen
      cursor={false}
      ev={[
        { t: 0, d: 0, cam: [900, 470, 1.3] },
        { t: 0.35, d: 4.6, y: [".kr-main > div", -1260], ease: "power2.inOut" },
        { t: 0.2, d: 5, cam: [900, 720, 1.38], ease: "power1.inOut" },
      ]}
    >
      <DirectionPage accepted={false} submit={false} />
    </Screen>
  );
}

export function Shot04() {
  return (
    <Screen
      ev={[
        { t: 0, d: 0, cam: [1300, 420, 1.2] },
        { t: 0, d: 0, y: [".kr-main > div", -1260] },
        { t: 0, d: 0, cur: [1150, 420] },
        { t: 0.05, d: 0.4, cur: [1590, 30] },
        { t: 0.05, d: 0.4, cam: [1400, 300, 1.35] },
        { t: 0.48, click: true },
        { t: 0.5, hide: "#d1" },
        { t: 0.5, show: "#d2" },
        { t: 0.7, d: 0.4, cur: [1600, 1036] },
        { t: 0.7, d: 0.45, cam: [1400, 800, 1.35] },
        { t: 1.15, click: true },
        { t: 1.15, press: ".kr-submit" },
      ]}
    >
      <State id="d1" on>
        <DirectionPage accepted={false} />
      </State>
      <State id="d2">
        <DirectionPage accepted />
      </State>
    </Screen>
  );
}

export function Shot05() {
  return (
    <Screen
      step={[2, "Review shared assets"]}
      ev={[
        { t: 0, d: 0, cam: [1000, 480, 1.25] },
        { t: 0, d: 0, cur: [900, 620] },
        { t: 0.3, d: 0.7, cam: [1150, 420, 1.45], ease: "power3.out" },
        { t: 0.9, d: 0.55, cur: [1690, 222] },
        { t: 1.55, click: true },
        { t: 1.57, hide: "#r0" },
        { t: 1.57, show: "#r1" },
      ]}
    >
      <State id="r0" on>
        <ReferencePage accepted={0} />
      </State>
      <State id="r1">
        <ReferencePage accepted={1} />
      </State>
    </Screen>
  );
}

const REF_ROW = 488;

export function Shot06() {
  const ev: Ev[] = [
    { t: 0, d: 0, cam: [1300, 520, 1.25] },
    { t: 0, d: 0, cur: [1690, 222] },
  ];
  [1, 2, 3].forEach((i) => {
    const t = 0.05 + (i - 1) * 0.6;
    ev.push({ t, d: 0.3, y: [".kr-main > div", -REF_ROW * i], ease: "power3.inOut" });
    ev.push({ t: t + 0.38, click: true });
    ev.push({ t: t + 0.4, hide: `#r${i}` });
    ev.push({ t: t + 0.4, show: `#r${i + 1}` });
  });
  return (
    <Screen ev={ev}>
      {[1, 2, 3, 4].map((n) => (
        <State id={`r${n}`} on={n === 1}>
          <ReferencePage accepted={n} />
        </State>
      ))}
    </Screen>
  );
}

const TERM_ANIMATIC: TLine[] = [
  { k: "out", s: "  ⎿  Running in the background (↓ to manage)" },
  { k: "text", s: "Direction accepted. The reference pool is ready for you." },
  { k: "tool", s: 'Bash(konte preview reference --summary "The cast, the umbrella, the café…")' },
  { k: "out", s: "  ⎿  Running in the background (↓ to manage)" },
  { k: "text", s: "Reference review is in: all 8 accepted. Drawing the board.", id: "b1", hid: true },
  { k: "tool", s: "Bash(konte generate animatic && konte job wait)", id: "b2", hid: true },
  { k: "out", s: "  ⎿  Running in the background (↓ to manage)", id: "b3", hid: true },
  { k: "text", s: 'Background command "Generate animatic panels and wait" completed (exit code 0)', id: "b4", hid: true },
  { k: "tool", s: "Bash(tail -2 /tmp/claude/tasks/b121xmi8e.output)", id: "b5", hid: true },
  { k: "out", s: "  ⎿  9 started, 0 waiting, 0 synced, 0 failed, 0 skipped — run `konte job wait`", id: "b6", hid: true },
  { k: "out", s: "     9 job(s) settled: 9 completed (4:53) — run `konte status`", id: "b7", hid: true },
  { k: "tool", s: 'Bash(konte preview animatic --summary "The whole board, six panels…")', id: "b8", hid: true },
];

export function Shot07() {
  return (
    <Screen
      step={[3, "Review the cut"]}
      cursor={false}
      ev={[
        { t: 0, d: 0, cam: [0, 0, 1.15] },
        { t: 0.2, on: "#b1" },
        { t: 0.45, on: "#b2" },
        { t: 0.6, on: "#b3" },
        { t: 1.35, on: "#b4" },
        { t: 1.65, on: "#b5" },
        { t: 1.8, on: "#b6,#b7" },
        { t: 2.45, on: "#b8" },
      ]}
    >
      <Terminal lines={TERM_ANIMATIC} />
    </Screen>
  );
}

const PANELS: Record<ShotId, Img> = {
  "01": reference.panel01,
  "02": reference.panel02,
  "03": reference.panel03,
  "04": reference.panel04,
  "05": reference.panel05,
  "06": reference.panel06,
};

export function Shot08() {
  const t0 = 0.55;
  const t1 = 2.6;
  const reel = 18.5;
  const ev: Ev[] = [
    { t: 0, d: 0, cam: [620, 520, 1.35] },
    { t: 0, d: 0, cur: [trackX(0) + 40, 760] },
    { t: 0.1, d: 0.4, cur: [trackX(0), 694] },
    { t: 0.5, click: true },
    { t: t0, d: t1 - t0, x: [".kr-playhead", (reel / 21) * TRACK.w], ease: "none" },
    { t: t0, d: t1 - t0, cur: [trackX(reel), 694], ease: "none" },
    { t: t0, d: t1 - t0, clock: [0, reel] },
  ];
  IDS.slice(1).forEach((id, i) => {
    const prev = IDS[i]!;
    const at = t0 + (t1 - t0) * (STARTS[id] / reel);
    ev.push({ t: at, hide: `#p${prev}` }, { t: at, show: `#p${id}` });
  });
  const panels = (
    <>
      {IDS.map((id) => (
        <div className={id === "01" ? "st" : "st off"} id={`p${id}`} style={{ width: "100%", height: "100%" }}>
          <Image src={PANELS[id]} fill />
        </div>
      ))}
    </>
  );
  return (
    <Screen ev={ev}>
      <AnimaticPage panels={panels} />
    </Screen>
  );
}

export function Shot09({ clips }: { clips: Clips }) {
  const media = (
    <>
      <div className="st" id="v03" style={{ width: "100%", height: "100%" }}>
        {clips("03", { start: 0, duration: 2, mediaStart: 1 })}
      </div>
      <div className="st off" id="v04" style={{ width: "100%", height: "100%" }}>
        {clips("04", { start: 2, duration: 1, mediaStart: 0 })}
      </div>
    </>
  );
  return (
    <Screen
      ev={[
        { t: 0, d: 0, cam: [600, 380, 1.5] },
        { t: 0, d: 0, cur: [1100, 900] },
        { t: 0, d: 3, x: [".kr-playhead", (3 / 21) * TRACK.w] },
        { t: 0, d: 3, clock: [8.5, 11.5] },
        { t: 2, hide: "#v03" },
        { t: 2, show: "#v04" },
      ]}
    >
      <VideoPage
        media={media}
        selected="03"
        time="0:08.5"
        playhead={8.5}
        cards={acceptedThrough(["01", "02"])}
        feedback={{ target: "Shot 03", blocking: "He stops turning the cup, lifts his head and holds his look off screen right toward the window table.", camera: "fixed" }}
      />
    </Screen>
  );
}

const PLACE = onPlayer(PIN.x, PIN.y);

export function Shot10({ clips }: { clips: Clips }) {
  const page = (pins: Pin[] | undefined, composer: string | undefined) => (
    <VideoPage
      media={clips("05before", { mediaStart: 3.3 })}
      selected="05"
      time="0:16.3"
      playhead={16.3}
      pins={pins}
      cards={acceptedThrough(["01", "02", "03", "04", "06"])}
      shotsFrom={2}
      feedback={feedback05({ composer })}
    />
  );
  return (
    <Screen
      step={[4, "Revise"]}
      ev={[
        { t: 0, d: 0, cam: [560, 380, 1.7] },
        { t: 0, d: 0, cur: [880, 520] },
        { t: 0.25, d: 0.7, cur: [PLACE[0], PLACE[1] - 6] },
        { t: 1.05, click: true },
        { t: 1.07, hide: "#e0" },
        { t: 1.07, show: "#e1" },
        { t: 1.2, d: 0.6, cam: [PLACE[0] + 120, PLACE[1] - 40, 2.1], ease: "power3.out" },
      ]}
    >
      <State id="e0" on>
        {page(undefined, undefined)}
      </State>
      <State id="e1">{page([{ ...PIN, state: "placing" }], "")}</State>
    </Screen>
  );
}

export function Shot11({ clips }: { clips: Clips }) {
  const page = (pins: Pin[], composer: string | undefined, notes: Note[] | undefined) => (
    <VideoPage
      media={clips("05before", { mediaStart: 3.3 })}
      selected="05"
      time="0:16.3"
      playhead={16.3}
      pins={pins}
      dirty={notes !== undefined}
      cards={acceptedThrough(["01", "02", "03", "04", "06"])}
      shotsFrom={2}
      feedback={feedback05({ composer, notes })}
    />
  );
  return (
    <Screen
      ev={[
        { t: 0, d: 0, cam: [1140, 560, 1.75] },
        { t: 0, d: 0, cur: [PLACE[0], PLACE[1] - 6] },
        { t: 0.2, d: 0.4, cur: [1180, 700] },
        { t: 0.25, d: 1.5, type: "#e2 .kr-composer-box" },
        { t: 1.75, d: 0.35, cur: [1391, 468] },
        { t: 2.15, click: true },
        { t: 2.17, hide: "#e2" },
        { t: 2.17, show: "#e3" },
      ]}
    >
      <State id="e2" on>
        {page([{ ...PIN, state: "placing" }], NOTE_TEXT, undefined)}
      </State>
      <State id="e3">{page([{ ...PIN, state: "draft" }], undefined, [{ pin: 1, time: "0:03", text: NOTE_TEXT, draft: true }])}</State>
    </Screen>
  );
}

export function Shot12({ clips }: { clips: Clips }) {
  return (
    <Screen
      ev={[
        { t: 0, d: 0, cam: [1300, 700, 1.2] },
        { t: 0, d: 0, cur: [1391, 468] },
        { t: 0.1, d: 0.55, cur: [1640, 1040] },
        { t: 0.1, d: 0.6, cam: [1500, 880, 1.6], ease: "power3.out" },
        { t: 0.8, click: true },
        { t: 0.8, press: ".kr-submit" },
      ]}
    >
      <VideoPage
        media={clips("05before", { mediaStart: 3.3 })}
        selected="05"
        time="0:16.3"
        playhead={16.3}
        pins={[{ ...PIN, state: "draft" }]}
        dirty
        cards={acceptedThrough(["01", "02", "03", "04", "06"])}
        shotsFrom={2}
        feedback={feedback05({ notes: [{ pin: 1, time: "0:03", text: NOTE_TEXT, draft: true }] })}
      />
    </Screen>
  );
}

const TERM_REVISE: TLine[] = [
  { k: "text", s: "Board accepted. All six shots are in motion now." },
  { k: "tool", s: 'Bash(konte preview video --summary "Every shot is in motion now…")' },
  { k: "out", s: "  ⎿  Running in the background (↓ to manage)" },
  { k: "text", s: 'Background command "Open the video preview for review" completed (exit code 0)' },
  { k: "text", s: "One note on shot 05: she should take the umbrella. Generating a new take.", id: "c1", hid: true },
  { k: "tool", s: "Bash(konte reroll video:shot.05.motion && konte job wait)", id: "c2", hid: true },
  { k: "out", s: "  ⎿  Running in the background (↓ to manage)", id: "c3", hid: true },
  { k: "text", s: 'Background command "Reroll shot 05 motion and wait" completed (exit code 0)', id: "c4", hid: true },
  { k: "tool", s: 'Bash(konte preview video --summary "New take on 05: her hands close on the handle.")', id: "c5", hid: true },
  { k: "out", s: "  ⎿  Running in the background (↓ to manage)", id: "c6", hid: true },
];

export function Shot13() {
  return (
    <Screen
      cursor={false}
      ev={[
        { t: 0, d: 0, cam: [0, 0, 1.15] },
        { t: 0.2, on: "#c1" },
        { t: 0.5, on: "#c2" },
        { t: 0.65, on: "#c3" },
        { t: 1.5, on: "#c4" },
        { t: 1.95, on: "#c5" },
        { t: 2.15, on: "#c6" },
      ]}
    >
      <Terminal lines={TERM_REVISE} />
    </Screen>
  );
}

export function Shot14({ clips }: { clips: Clips }) {
  const page = (accepted: boolean) => (
    <VideoPage
      media={clips("05", { mediaStart: 2.4 })}
      selected="05"
      time="0:15.4"
      playhead={15.4}
      fresh05={!accepted}
      hideStale={false}
      handoff="New take on 05: both her hands close on the handle, where your pin was."
      cards={{ ...acceptedThrough(["01", "02", "03", "04", "06"]), "05": { accepted, changed: !accepted, comments: 1 } }}
      shotsFrom={2}
      feedback={feedback05({
        fresh: accepted ? undefined : 1,
        agent: "New take beside the old one: she takes the handle by 3.5s. Keep whichever reads warmer.",
        notes: [{ pin: 1, time: "0:03", text: NOTE_TEXT, stale: true }],
      })}
    />
  );
  return (
    <Screen
      ev={[
        { t: 0, d: 0, cam: [800, 420, 1.3] },
        { t: 0, d: 0, cur: [1100, 820] },
        { t: 0, d: 2, clock: [15.4, 17.4] },
        { t: 0, d: 2, x: [".kr-playhead", (2 / 21) * TRACK.w] },
        { t: 0.85, d: 0.5, cam: [1250, 560, 1.3], ease: "power2.inOut" },
        { t: 0.8, d: 0.5, cur: [1650, 727] },
        { t: 1.4, click: true },
        { t: 1.42, hide: "#n0" },
        { t: 1.42, show: "#n1" },
      ]}
    >
      <State id="n0" on>
        {page(false)}
      </State>
      <State id="n1">{page(true)}</State>
    </Screen>
  );
}

const TERM_EXPORT: TLine[] = [
  { k: "tool", s: "Bash(konte reroll video:shot.05.motion && konte job wait)" },
  { k: "out", s: "  ⎿  Running in the background (↓ to manage)" },
  { k: "text", s: 'Background command "Reroll shot 05 motion and wait" completed (exit code 0)' },
  { k: "tool", s: 'Bash(konte preview video --summary "New take on 05: her hands close on the handle.")' },
  { k: "out", s: "  ⎿  Running in the background (↓ to manage)" },
  { k: "text", s: 'Background command "Open the video preview for review" completed (exit code 0)', id: "f1", hid: true },
  { k: "tool", s: "Skill(export-guide)", id: "f2", hid: true },
  { k: "out", s: "  ⎿  Successfully loaded skill", id: "f3", hid: true },
  { k: "tool", s: "Bash(konte export video && konte job wait && konte probe export)", id: "f4", hid: true },
  { k: "out", s: "  ⎿  Running in the background (↓ to manage)", id: "f5", hid: true },
  { k: "text", s: "All six shots accepted. Rendering the final cut now.", id: "f6", hid: true },
];

const TERM_DONE: TLine[] = [
  { k: "text", s: 'Background command "Export and probe the final video" completed (exit code 0)', id: "g1", hid: true },
  { k: "dim", s: "  Read 1 file (ctrl+o to expand)", id: "g2", hid: true },
  { k: "text", s: "Borrowed Umbrella is finished.", id: "g3", hid: true },
  { k: "cont", s: "  /home/you/code/my-video/videos/borrowed-umbrella/dist/video/20261026T231412/video.mp4", id: "g4", hid: true },
  { k: "cont", s: "  - 1280×720, 21 seconds, 24 fps, stereo AAC", id: "g5", hid: true },
];

export function Shot15() {
  return (
    <Screen
      step={[5, "Export"]}
      cursor={false}
      ev={[
        { t: 0, d: 0, cam: [0, 0, 1.15] },
        { t: 0.1, on: "#f1" },
        { t: 0.3, on: "#f2" },
        { t: 0.4, on: "#f3" },
        { t: 0.7, on: "#f4" },
        { t: 0.85, on: "#f5" },
        { t: 1.3, on: "#f6" },
        { t: 2.2, on: "#g1" },
        { t: 2.4, on: "#g2" },
        { t: 2.65, on: "#g3" },
        { t: 2.8, on: "#g4" },
        { t: 2.9, on: "#g5" },
      ]}
    >
      <Terminal lines={[...TERM_EXPORT, ...TERM_DONE]} />
    </Screen>
  );
}
