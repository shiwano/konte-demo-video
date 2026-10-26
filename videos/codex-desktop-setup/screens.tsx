import { Animate, type AnimateContext, type AnimateData } from "konte";

type El = JSX.Element;

// ───────────── geometry: the app window, drawn at its native 1181×806 and scaled onto the stage ─────────────

const W = 1920;
const H = 1088;
const WIN = { w: 1181, h: 806, s: 1.25 };
const WX = (W - WIN.w * WIN.s) / 2;
const WY = (H - WIN.h * WIN.s) / 2;
const P = (x: number, y: number) => [WX + x * WIN.s, WY + y * WIN.s] as const;

// ───────────── the event runner every shot's <Animate> plays ─────────────

type Ev = {
  t: number;
  d?: number;
  ease?: string;
  /** Camera: window point to centre on, and the zoom. */
  cam?: readonly [number, number, number];
  /** Cursor tip, in window coordinates. */
  cur?: readonly [number, number];
  click?: boolean;
  show?: string;
  hide?: string;
  /** Fade-and-rise in, for menus, dialogs and cards. */
  pop?: string;
  vanish?: string;
  type?: string;
  press?: string;
  pulse?: string;
  y?: readonly [string, number];
  spin?: readonly [string, number];
  /** Counts a `<n>s` label up, for the "Working for" timers. */
  count?: readonly [string, number, number];
  /** Sweeps a highlighter background across an inline run of text. */
  wipe?: string;
  dim?: readonly [string, number];
  /** Takes a `display: none` element into the layout, or out of it. */
  on?: string;
  off?: string;
  /** Hover highlight on a row. */
  bg?: string;
  unbg?: string;
};

const toStage = (ev: Ev[]): Ev[] =>
  ev.map((e) => ({
    ...e,
    ...(e.cam && { cam: [...P(e.cam[0], e.cam[1]), e.cam[2]] as const }),
    ...(e.cur && { cur: P(e.cur[0], e.cur[1]) }),
  }));

const play = ({ timeline, split, data }: AnimateContext<AnimateData>) => {
  const { ev, w, h } = data as unknown as { ev: Ev[]; w: number; h: number };
  for (const e of ev) {
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
      timeline.to("#cursor-arrow", { scale: 0.82, duration: 0.07, yoyo: true, repeat: 1, transformOrigin: "0% 0%" }, e.t);
      timeline.fromTo(
        "#cursor-ring",
        { scale: 0.2, opacity: 0.9 },
        { scale: 1.6, opacity: 0, duration: 0.45, ease: "power2.out", immediateRender: false },
        e.t,
      );
    }
    if (e.show) timeline.set(e.show, { autoAlpha: 1 }, e.t);
    if (e.hide) timeline.set(e.hide, { autoAlpha: 0 }, e.t);
    if (e.pop)
      timeline.fromTo(
        e.pop,
        { autoAlpha: 0, y: 8, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, duration: e.d ?? 0.22, ease: "power3.out", immediateRender: false },
        e.t,
      );
    if (e.vanish) timeline.to(e.vanish, { autoAlpha: 0, scale: 0.98, duration: e.d ?? 0.15, ease: "power2.in" }, e.t);
    if (e.type) {
      const s = split(e.type, { type: "chars" });
      timeline.set(s.chars, { display: "none" }, 0);
      timeline.to(s.chars, { display: "inline", duration: 0.001, stagger: { amount: d } }, e.t);
    }
    if (e.press) timeline.to(e.press, { scale: 0.95, duration: 0.08, yoyo: true, repeat: 1, ease: "power2.out" }, e.t);
    if (e.pulse)
      timeline.fromTo(
        e.pulse,
        { boxShadow: "0 0 0 0px rgba(47,111,235,0.55)" },
        { boxShadow: "0 0 0 10px rgba(47,111,235,0)", duration: 0.8, ease: "power2.out", immediateRender: false },
        e.t,
      );
    if (e.y) timeline.to(e.y[0], { y: e.y[1], duration: d, ease }, e.t);
    if (e.spin) timeline.to(e.spin[0], { rotation: 360 * e.spin[1], duration: d, ease: "none", transformOrigin: "50% 50%" }, e.t);
    if (e.count) {
      const [sel, from, to] = e.count;
      const o = { v: from };
      timeline.to(
        o as unknown as string,
        {
          v: to,
          duration: d,
          ease: "none",
          onUpdate: () => {
            document.querySelectorAll(sel).forEach((el) => {
              el.textContent = `${Math.round(o.v)}s`;
            });
          },
        },
        e.t,
      );
    }
    if (e.wipe) timeline.to(e.wipe, { backgroundSize: "100% 100%", duration: d, ease: "power2.inOut" }, e.t);
    if (e.on) timeline.set(e.on, { display: "inline" }, e.t);
    if (e.off) timeline.set(e.off, { display: "none" }, e.t);
    if (e.bg) timeline.set(e.bg, { backgroundColor: "rgba(0,0,0,0.06)" }, e.t);
    if (e.unbg) timeline.set(e.unbg, { backgroundColor: "rgba(0,0,0,0)" }, e.t);
    if (e.dim) timeline.to(e.dim[0], { autoAlpha: e.dim[1], duration: d, ease: "power2.inOut" }, e.t);
  }
};

// ───────────── icons ─────────────

const ICONS: Record<string, string> = {
  back: "M19 12H5M11 6l-6 6 6 6",
  fwd: "M5 12h14M13 6l6 6-6 6",
  sidebar: "M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM9 4v16",
  chevR: "M9 18l6-6-6-6",
  chevL: "M15 18l-6-6 6-6",
  chevD: "M6 9l6 6 6-6",
  plus: "M12 5v14M5 12h14",
  search: "M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM20 20l-4-4",
  home: "M4 11l8-7 8 7v9h-5v-6H9v6H4z",
  cards: "M8 4h11v14H8zM5 7v13h11",
  clock: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 7v5l3 2",
  at: "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  branch: "M6 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM6 16a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM18 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM6 8v8M18 10c0 4-6 3-12 6",
  apps: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  bell: "M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4",
  edit: "M4 20h4L19 9l-4-4L4 16zM13 7l4 4",
  newwin: "M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM12 8v8M8 12h8",
  folder: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  folderOpen: "M3 7a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v1M3 7v10a2 2 0 0 0 2 2h12l3-8H7l-3 8",
  folderPlus: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM12 10v6M9 13h6",
  laptop: "M5 5h14a1 1 0 0 1 1 1v10H4V6a1 1 0 0 1 1-1zM2 19h20",
  mic: "M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21",
  wave: "M5 10v4M8.5 7v10M12 9v6M15.5 5v14M19 10v4",
  approve: "M5 4h14v16H5zM9 10l2 2 4-4",
  gear: "M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1",
  gauge: "M4 17a8 8 0 1 1 16 0M12 17l4-5",
  smile: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM9 10h.01M15 10h.01M9 15c1.5 1 4.5 1 6 0",
  send: "M21 3L10 14M21 3l-7 18-4-7-7-4z",
  help: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6",
  logout: "M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4M16 17l5-5-5-5M21 12H9",
  cube: "M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9",
  refresh: "M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5",
  termbox: "M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM8 9l3 3-3 3M13 15h3",
  wrench: "M14.5 6.5a4 4 0 0 0-5.5 5L3.5 17l3.5 3.5L12.5 15a4 4 0 0 0 5-5.5L15 12l-3-3z",
  copy: "M8 8h12v12H8zM4 16V4h12",
  speaker: "M4 9h4l5-4v14l-5-4H4zM16 9a4 4 0 0 1 0 6",
  thumb: "M7 11v9H4v-9zM7 11l4-8a2 2 0 0 1 2 2v4h6a2 2 0 0 1 2 2l-2 7a2 2 0 0 1-2 1H7",
  qmark: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4M12 16.5h.01",
  arrowUp: "M12 19V5M6 11l6-6 6 6",
  arrowUR: "M7 17L17 7M8 7h9v9",
  list: "M4 6h2M9 6h11M4 12h2M9 12h11M4 18h2M9 18h11",
  x: "M6 6l12 12M18 6L6 18",
  user: "M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM4 21a8 8 0 0 1 16 0",
  download: "M12 4v11M7 10l5 5 5-5M4 20h16",
  sun: "M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5",
  archive: "M4 5h16v4H4zM5 9v10h14V9M10 13h4",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  keyboard: "M3 6h18v12H3zM7 10h.01M11 10h.01M15 10h.01M7 14h10",
  key: "M8 12a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM11 13l8-8M16 8l3 3",
  pointer: "M5 4l6 16 2.4-6.6L20 11z",
  picture: "M4 4h16v16H4zM4 16l5-5 5 5 2-2 4 4",
  monitor: "M4 4h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM8 20h8M12 16v4",
  hook: "M12 3v10a4 4 0 1 1-4-4",
  globe: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  cloud: "M7 18a5 5 0 1 1 1-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8z",
  send2: "M4 12l16-8-6 16-2-6z",
};

function I({ n, s = 16, c, w = 1.6, fill }: { n: string; s?: number; c?: string; w?: number; fill?: string }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={fill ?? "none"} stroke={c ?? "currentColor"} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", display: "block" }}>
      <path d={ICONS[n]} />
    </svg>
  );
}

/** The Codex mark: a soft cloud with a prompt inside. */
function CodexMark({ s = 48 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none" stroke="#9b9ba1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
      <path d="M17 9a8 8 0 0 1 14 0 8 8 0 0 1 9 9 8 8 0 0 1 0 12 8 8 0 0 1-9 9 8 8 0 0 1-14 0 8 8 0 0 1-9-9 8 8 0 0 1 0-12 8 8 0 0 1 9-9z" />
      <path d="M17 19l5 5-5 5M25 30h7" />
    </svg>
  );
}

function Spinner({ id, s = 14, c = "#6b6b70" }: { id?: string; s?: number; c?: string }) {
  return (
    <svg id={id} width={s} height={s} viewBox="0 0 24 24" style={{ flex: "none", display: "block" }}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="#dcdce0" strokeWidth="2.6" />
      <path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke={c} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/** Plugin logos, drawn as plain marks. */
function Logo({ k, s = 22 }: { k: string; s?: number }) {
  const box = (child: El) => (
    <svg width={s} height={s} viewBox="0 0 24 24" style={{ display: "block", flex: "none" }}>
      {child}
    </svg>
  );
  switch (k) {
    case "gmail":
      return box(
        <g fill="none" strokeWidth="3" strokeLinejoin="round">
          <path d="M3 19V7l9 7 9-7v12" stroke="#ea4335" />
          <path d="M3 7v12" stroke="#4285f4" />
          <path d="M21 7v12" stroke="#34a853" />
        </g>,
      );
    case "drive":
      return box(
        <g>
          <path d="M8 3h8l7 12h-8z" fill="#fbbc04" />
          <path d="M8 3L1 15l4 6 7-12z" fill="#34a853" />
          <path d="M5 21h14l4-6H9z" fill="#4285f4" />
        </g>,
      );
    case "calendar":
      return box(
        <g>
          <rect x="2" y="2" width="20" height="20" rx="3" fill="#4285f4" />
          <rect x="4" y="6" width="16" height="14" rx="1" fill="#fff" />
          <text x="12" y="17.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="#4285f4" fontFamily="Inter">
            31
          </text>
        </g>,
      );
    case "slack":
      return box(
        <g strokeWidth="3.4" strokeLinecap="round">
          <path d="M9 3v8" stroke="#36c5f0" />
          <path d="M3 15h8" stroke="#2eb67d" />
          <path d="M15 21v-8" stroke="#ecb22e" />
          <path d="M21 9h-8" stroke="#e01e5a" />
        </g>,
      );
    case "notion":
      return box(
        <g>
          <rect x="3" y="2.5" width="18" height="19" rx="2.5" fill="#fff" stroke="#111" strokeWidth="1.8" />
          <path d="M8 17V7.5l8 9.5V7" fill="none" stroke="#111" strokeWidth="2" />
        </g>,
      );
    case "github":
      return box(
        <g>
          <circle cx="12" cy="12" r="10" fill="#111" />
          <path d="M8.5 19v-2.5c-2.5.5-3-1-3.5-1.8M15.5 19v-3c0-1-.4-1.5-.9-1.8 2.2-.3 3.9-1.2 3.9-4.2 0-.9-.3-1.7-.9-2.3.1-.6.1-1.4-.1-2.2 0 0-.8-.2-2.4.9a8 8 0 0 0-4.2 0C7.3 4.3 6.5 4.5 6.5 4.5c-.2.8-.2 1.6-.1 2.2-.6.6-.9 1.4-.9 2.3 0 3 1.7 3.9 3.9 4.2-.4.4-.7.9-.8 1.6" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
        </g>,
      );
    case "outlook":
      return box(
        <g>
          <rect x="7" y="4" width="15" height="16" rx="2" fill="#0f78d4" />
          <rect x="2" y="7" width="11" height="11" rx="1.5" fill="#0a5bb0" />
          <circle cx="7.5" cy="12.5" r="2.6" fill="none" stroke="#fff" strokeWidth="1.6" />
        </g>,
      );
    case "browser":
      return box(
        <g>
          <path d="M12 2l8 3-1 11-7 6-7-6-1-11z" fill="#fb542b" />
          <path d="M9 9h6l-1 5-2 2-2-2z" fill="#fff" />
        </g>,
      );
    default:
      return box(
        <g>
          <rect x="2" y="3" width="17" height="16" rx="3" fill="#fbd75b" />
          <path d="M5.5 8h10M5.5 11.5h10M5.5 15h6" stroke="#e7a92e" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M13 12l9 3.5-3.8 1.4-1.4 3.8z" fill="#2f7ff0" stroke="#fff" strokeWidth="0.8" strokeLinejoin="round" />
        </g>,
      );
  }
}

// ───────────── chrome shared by every shot ─────────────

const CSS = `
.scr{position:absolute;inset:0;overflow:hidden;background:radial-gradient(120% 90% at 50% 40%,#f4f1ea 0%,#e6e0d4 60%,#d9d1c3 100%);font-family:"Inter",system-ui,sans-serif;color:#1d1d1f;-webkit-font-smoothing:antialiased;}
.cam{position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0;}
.win{position:absolute;left:${WX}px;top:${WY}px;width:${WIN.w}px;height:${WIN.h}px;transform:scale(${WIN.s});transform-origin:0 0;background:#edf0f5;border:1px solid #c4c8cf;border-radius:8px;overflow:hidden;box-shadow:0 30px 80px rgba(60,45,25,.25),0 6px 18px rgba(60,45,25,.12);font-size:14px;}
.off{visibility:hidden;opacity:0;}
.abs{position:absolute;}
.full{position:absolute;inset:0;}
.cursor{position:absolute;left:0;top:0;z-index:80;pointer-events:none;}
.cursor-ring{position:absolute;left:-24px;top:-24px;width:48px;height:48px;border-radius:50%;border:3px solid rgba(47,111,235,.95);opacity:0;}
.step{position:absolute;left:64px;top:44px;z-index:90;display:flex;align-items:center;gap:20px;padding:14px 36px 14px 16px;border-radius:999px;background:rgba(29,29,31,.94);box-shadow:0 14px 40px rgba(40,30,20,.35);color:#fafafa;font-size:44px;font-weight:700;letter-spacing:-.015em;}
.step-n{display:flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:50%;background:#2f6feb;color:#fff;font-size:34px;font-weight:800;}
.blackout{position:absolute;inset:0;z-index:70;background:#0c0c0c;}

.t{position:absolute;white-space:nowrap;display:flex;align-items:center;gap:8px;}
.ic{position:absolute;color:#3c3c41;}
.panel{position:absolute;left:52px;top:44px;right:4px;bottom:4px;border-radius:10px;background:#fff;border:1px solid #e2e5ea;overflow:hidden;}
.sidebg{position:absolute;left:52px;top:44px;width:289px;bottom:4px;border-radius:10px 0 0 10px;background:#f8f9fb;border-right:1px solid #e6e8ec;}
.rail-sel{position:absolute;left:8px;width:36px;height:36px;border-radius:10px;background:#dfe3ea;}
.row{position:absolute;left:60px;width:272px;height:30px;border-radius:8px;}
.row.sel{background:#e9ebef;}
.mute{color:#8a8a90;}
.faint{color:#b2b2b8;}

.pbar{position:absolute;left:405px;top:650px;width:708px;height:46px;border-radius:14px 14px 0 0;background:#eeeff2;}
.comp{position:absolute;left:391px;top:688px;width:736px;height:98px;border:1px solid #dcdde1;border-radius:20px;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.04);}
.cin{font-size:14px;color:#1d1d1f;white-space:pre;}
.pick{color:#2462d6;font-weight:600;align-items:center;gap:5px;}
.caret{display:inline-block;width:1.5px;height:17px;background:#1d1d1f;vertical-align:-3px;margin-left:1px;}
.round{position:absolute;width:28px;height:28px;border-radius:50%;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;}
.sq{width:9px;height:9px;border-radius:2px;background:#fff;}

.dimmer{position:absolute;inset:0;background:rgba(20,20,24,.16);}
.modal{position:absolute;background:#fafafa;border-radius:20px;box-shadow:0 24px 60px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.06);}
.btn{position:absolute;display:flex;align-items:center;justify-content:center;gap:6px;border-radius:9px;font-size:14px;font-weight:500;}
.btn.dark{background:#1b1b1f;color:#fff;}
.btn.dis{background:#a3a3a8;color:#f4f4f5;}
.btn.line{border:1px solid #dcdde1;background:#fff;color:#1d1d1f;}
.btn.flat{color:#7a7a80;}
.field{position:absolute;border:1px solid #dcdde1;border-radius:9px;background:#fff;display:flex;align-items:center;padding:0 10px;font-size:14px;}

.menu{position:absolute;background:#fff;border-radius:14px;box-shadow:0 14px 40px rgba(0,0,0,.15),0 0 0 1px rgba(0,0,0,.06);}
.mi{position:absolute;left:6px;right:6px;height:30px;border-radius:8px;display:flex;align-items:center;gap:10px;padding:0 10px;font-size:14px;white-space:nowrap;}
.mi .k{margin-left:auto;color:#8a8a90;font-size:13.5px;}
.msep{position:absolute;left:14px;right:14px;height:1px;background:#ececef;}

.card{position:absolute;border:1px solid #e3e4e8;border-radius:14px;background:#fff;}
.tog{position:absolute;width:32px;height:20px;border-radius:999px;background:#3b82f6;}
.tog::after{content:"";position:absolute;right:2px;top:2px;width:16px;height:16px;border-radius:50%;background:#fff;}
.tog.lite{background:#93b8f5;}
.sel-box{position:absolute;height:28px;border:1px solid #dcdde1;border-radius:8px;display:flex;align-items:center;gap:8px;padding:0 10px;font-size:13.5px;background:#fff;}

.xp{position:absolute;background:#fff;border:1px solid #b7b7b7;box-shadow:0 18px 50px rgba(0,0,0,.25);font-family:"Inter",system-ui,sans-serif;font-size:13px;color:#1b1b1b;}
.xp-row{display:flex;align-items:center;height:28px;}
.xp-sel{background:#cce8ff;}

.bubble{position:absolute;height:42px;border-radius:21px;background:#111;color:#fff;font-size:14px;font-weight:600;display:flex;align-items:center;padding:0 16px;}
.work{position:absolute;left:391px;width:736px;height:22px;border-bottom:1px solid #e6e7ea;padding-bottom:12px;color:#8a8a90;font-size:14px;display:flex;align-items:center;gap:6px;}
.para{position:absolute;left:391px;width:736px;font-size:14px;line-height:22px;color:#1d1d1f;}
.cmd{position:absolute;left:391px;display:flex;align-items:center;gap:8px;color:#9a9aa0;font-size:13.5px;white-space:nowrap;}
.mark{background-image:linear-gradient(rgba(47,111,235,.22),rgba(47,111,235,.22));background-repeat:no-repeat;background-size:100% 100%;}
.skill{display:inline-flex;align-items:center;gap:4px;color:#2462d6;font-weight:600;}
.qopt{position:absolute;left:408px;display:flex;align-items:center;gap:10px;font-size:14px;}
.qn{width:20px;height:20px;border-radius:5px;background:#f0f0f2;border:1px solid #e3e4e8;display:flex;align-items:center;justify-content:center;font-size:11.5px;color:#6b6b70;}
`;

function T({ x, y, s = 14, w = 400, c, children, id, cls, style }: { x: number; y: number; s?: number; w?: number; c?: string; children?: (El | string | false)[] | El | string; id?: string; cls?: string; style?: Record<string, string | number> }) {
  const h = Math.round(s * 1.5);
  return (
    <div className={cls ? `t ${cls}` : "t"} id={id} style={{ left: `${x}px`, top: `${y - h / 2}px`, height: `${h}px`, fontSize: `${s}px`, fontWeight: w, ...(c && { color: c }), ...style }}>
      {children}
    </div>
  );
}

function Ic({ n, x, y, s = 16, c, w }: { n: string; x: number; y: number; s?: number; c?: string; w?: number }) {
  return (
    <div className="ic" style={{ left: `${x - s / 2}px`, top: `${y - s / 2}px`, ...(c && { color: c }) }}>
      <I n={n} s={s} w={w} />
    </div>
  );
}

function Cursor({ at }: { at: readonly [number, number] }) {
  const [x, y] = P(at[0], at[1]);
  return (
    <div className="cursor" id="cursor" style={{ transform: `translate(${x}px, ${y}px)` }}>
      <div className="cursor-ring" id="cursor-ring" />
      <svg id="cursor-arrow" width="30" height="44" viewBox="0 0 17 24" style={{ display: "block" }}>
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

function Screen({ children, ev, step, cursor }: { children: El | El[]; ev: Ev[]; step?: readonly [number, string]; cursor?: readonly [number, number] }) {
  return (
    <>
      <style>{CSS}</style>
      <div className="scr">
        <div className="cam" id="cam">
          <div className="win">{children}</div>
          {cursor && <Cursor at={cursor} />}
        </div>
        {step && <Step n={step[0]} label={step[1]} />}
      </div>
      <Animate data={{ ev: toStage(ev), w: W, h: H } as unknown as AnimateData} script={play} />
      {step && (
        <Animate
          script={({ timeline }) => {
            timeline.from("#step", { x: -40, opacity: 0, duration: 0.45, ease: "power3.out" }, 0.05);
          }}
        />
      )}
    </>
  );
}

// ───────────── the Codex window ─────────────

/** Title bar with the menu bar; Settings hides the sidebar toggle, which shifts the menus left. */
function TopBar({ toggle = true, fileOn }: { toggle?: boolean; fileOn?: boolean }) {
  const mx = toggle ? 0 : -40;
  return (
    <>
      <Ic n="back" x={20} y={18} c="#9b9ba1" />
      <Ic n="fwd" x={54} y={18} c="#c2c2c7" />
      {toggle && <Ic n="sidebar" x={88} y={18} />}
      <div className="abs" id="file-hl" style={{ left: `${113 + mx}px`, top: "6px", width: "40px", height: "25px", borderRadius: "6px", background: fileOn ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0)" }} />
      <T x={123 + mx} y={18} c="#3c3c41">
        File
      </T>
      <T x={168 + mx} y={18} c="#3c3c41">
        Edit
      </T>
      <T x={216 + mx} y={18} c="#3c3c41">
        View
      </T>
      <T x={269 + mx} y={18} c="#3c3c41">
        Help
      </T>
      <div className="abs" style={{ left: "1060px", top: "18px", width: "12px", height: "1px", background: "#3c3c41" }} />
      <div className="abs" style={{ left: "1107px", top: "13px", width: "10px", height: "10px", border: "1px solid #3c3c41" }} />
      <Ic n="x" x={1158} y={18} s={15} w={1.3} />
    </>
  );
}

type RailSel = "home" | "custom" | "none";

function Rail({ sel = "home" }: { sel?: RailSel }) {
  return (
    <>
      {sel === "home" && <div className="rail-sel" style={{ top: "52px" }} />}
      {sel === "custom" && <div className="rail-sel" style={{ top: "184px", borderRadius: "50%" }} />}
      <Ic n="home" x={26} y={70} s={18} c={sel === "home" ? "#1d1d1f" : undefined} />
      <Ic n="cards" x={26} y={114} s={18} />
      <Ic n="clock" x={26} y={158} s={18} />
      <Ic n="at" x={26} y={202} s={18} />
      <Ic n="more" x={26} y={246} s={18} w={3} />
      <div className="abs" style={{ left: "14px", top: "272px", width: "24px", height: "1px", background: "#d4d7dd" }} />
      <Ic n="branch" x={26} y={298} s={18} />
      <Ic n="apps" x={26} y={343} s={18} />
      <div className="round" style={{ left: "14px", top: "724px", width: "24px", height: "24px", background: "#2f80f6" }}>
        <I n="download" s={14} w={2} />
      </div>
      <div className="round" id="avatar" style={{ left: "14px", top: "768px", width: "24px", height: "24px", background: "#8a8f98", fontSize: "9.5px", fontWeight: 600 }}>
        AL
      </div>
    </>
  );
}

type Chat = { name: string; sel?: boolean; spin?: boolean; id?: string };

/** The home sidebar. `proj` lists the project's chats when the project exists; `projId` toggles a project row in mid-shot. */
function HomeSide({ proj, projId, bellDot }: { proj?: Chat[]; projId?: string; bellDot?: boolean }) {
  const projBlock = (chats: Chat[], sel: boolean) => (
    <>
      <div className={sel ? "row sel" : "row"} style={{ top: "204px" }} />
      <Ic n={chats.length ? "folderOpen" : "folder"} x={76} y={219} s={15} />
      <T x={92} y={219}>
        konte-workspace
      </T>
      {chats.map((c, i) => (
        <div className={c.id ? "off" : undefined} id={c.id}>
          <div className={c.sel ? "row sel" : "row"} style={{ top: `${234 + i * 31}px` }} />
          <T x={92} y={249 + i * 31}>
            {c.name}
          </T>
          {c.spin && (
            <div className="abs" style={{ left: "306px", top: `${242 + i * 31}px` }}>
              <Spinner s={14} id={`${c.id ?? "chat"}-sp${i}`} />
            </div>
          )}
        </div>
      ))}
      <T x={68} y={265 + chats.length * 31} c="#6b6b70">
        Recents <I n="chevR" s={14} />
      </T>
    </>
  );
  return (
    <>
      <div className="sidebg" />
      <T x={68} y={70} s={17} w={600}>
        Codex <I n="chevD" s={14} />
      </T>
      <Ic n="bell" x={280} y={70} />
      {bellDot && <div className="abs" style={{ left: "283px", top: "61px", width: "6px", height: "6px", borderRadius: "50%", background: "#2f80f6" }} />}
      <Ic n="search" x={314} y={70} />
      <Ic n="edit" x={76} y={112} s={15} />
      <T x={92} y={112}>
        New chat
      </T>
      <T x={68} y={185} c="#6b6b70">
        Projects
      </T>
      {proj ? (
        projBlock(proj, true)
      ) : (
        <>
          <div id={projId ? `${projId}-a` : undefined} className="full">
            <T x={68} y={222} c="#b2b2b8">
              No projects
            </T>
            <T x={68} y={272} c="#6b6b70">
              Recents <I n="chevR" s={14} />
            </T>
          </div>
          {projId && (
            <div id={`${projId}-b`} className="full off">
              {projBlock([], true)}
            </div>
          )}
        </>
      )}
    </>
  );
}

/** The composer: placeholder, a typed run, a picked skill chip, and the send button. */
function Composer({ id, ph = "Do anything", typed, pick, ws, konteChip, running, project = true, projNext }: { id: string; ph?: string; typed?: string; pick?: string; ws?: boolean; konteChip?: boolean; running?: boolean; project?: boolean; projNext?: boolean }) {
  return (
    <>
      {project && (
        <>
          <div className="pbar" />
          <div className="abs" id={`${id}-proj`} style={{ left: "410px", top: "656px", height: "26px", padding: "0 6px", borderRadius: "7px", display: "flex", alignItems: "center", gap: "6px", color: "#6b6b70" }}>
            <I n="folder" s={15} />
            <span id={`${id}-proj-a`} style={{ display: ws ? "none" : "inline" }}>
              Choose project
            </span>
            {(ws || projNext) && (
              <span id={`${id}-proj-b`} style={{ display: ws ? "inline" : "none", color: "#1d1d1f" }}>
                konte-workspace
              </span>
            )}
          </div>
          <T x={ws || projNext ? 564 : 553} y={669} id={`${id}-pc`} c="#1d1d1f">
            <I n="laptop" s={16} />
            This computer
          </T>
        </>
      )}
      <div className="comp" id={`${id}-comp`} />
      <div className="abs" style={{ left: "403px", top: "701px", height: "22px", display: "flex", alignItems: "center", fontSize: "14px" }}>
        <span className="mute" id={`${id}-ph`}>
          {ph}
        </span>
        {typed !== undefined && (
          <span className="cin" id={`${id}-in`} style={{ display: "none" }}>
            {typed}
          </span>
        )}
        {pick !== undefined && (
          <span className="pick" id={`${id}-pick`} style={{ display: "none" }}>
            <span style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "5px" }}>
              <I n="cube" s={14} />
            </span>
            {pick}
          </span>
        )}
        <span className="caret off" id={`${id}-caret`} />
      </div>
      <Ic n="plus" x={413} y={764} s={18} c="#1d1d1f" />
      {konteChip ? (
        <T x={440} y={764} c="#7a7a80" s={13.5}>
          <I n="gear" s={14} />
          konte
        </T>
      ) : (
        <T x={440} y={764} c="#7a7a80" s={13.5}>
          <I n="approve" s={14} />
          Approve for me
        </T>
      )}
      <T x={908} y={764} s={13}>
        GPT-6.1 Sol <span className="mute">Medium</span> <I n="chevD" s={12} c="#8a8a90" />
      </T>
      <Ic n="mic" x={1069} y={764} s={17} c="#1d1d1f" />
      <div className={running ? "round off" : "round"} id={`${id}-wave`} style={{ left: "1091px", top: "750px" }}>
        <I n="wave" s={16} w={2} />
      </div>
      <div className="round off" id={`${id}-send`} style={{ left: "1091px", top: "750px" }}>
        <I n="arrowUp" s={16} w={2} />
      </div>
      <div className={running ? "round" : "round off"} id={`${id}-stop`} style={{ left: "1091px", top: "750px" }}>
        <span className="sq" />
      </div>
    </>
  );
}

/** The empty home page; `ws` is the open project, `wsNext` swaps the heading to it in mid-shot. */
function Home({ id = "h", ws, wsNext, typed, pick, konteChip }: { id?: string; ws?: boolean; wsNext?: boolean; typed?: string; pick?: string; konteChip?: boolean }) {
  return (
    <div className="full" id={`${id}-main`}>
      <div className="panel" style={{ left: "341px", borderRadius: "0 10px 10px 0", borderLeft: "none" }} />
      <Ic n="newwin" x={1151} y={70} s={15} />
      <div className="abs" style={{ left: "735px", top: "326px" }}>
        <CodexMark />
      </div>
      <div className="abs" id={`${id}-title-a`} style={{ left: "341px", right: "4px", top: "400px", textAlign: "center", fontSize: "29px", display: ws ? "none" : "block" }}>
        What should we build?
      </div>
      {(ws || wsNext) && (
        <div className="abs" id={`${id}-title-b`} style={{ left: "341px", right: "4px", top: "400px", textAlign: "center", fontSize: "29px", display: ws ? "block" : "none" }}>
          What should we work on in <span style={{ borderBottom: "1.5px dotted #8a8a90" }}>konte-workspace</span>?
        </div>
      )}
      <Composer id={id} ws={ws} projNext={wsNext} typed={typed} pick={pick} konteChip={konteChip} />
    </div>
  );
}

// ───────────── dialogs and menus ─────────────

function CreateProject({ filled }: { filled?: boolean }) {
  return (
    <div className="full off" id="cp">
      <div className="dimmer" />
      <div className="modal" id="cp-box" style={{ left: "331px", top: "242px", width: "520px", height: "322px" }}>
        <T x={19} y={34} s={19} w={600}>
          Create project
        </T>
        <Ic n="x" x={492} y={27} s={15} />
        <div className="field" style={{ left: "20px", top: "60px", width: "480px", height: "39px", padding: 0, ...(filled ? {} : { borderColor: "#5b8def" }) }}>
          <span style={{ width: "40px", height: "100%", borderRight: "1px solid #e6e7ea", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <I n="folder" s={15} />
          </span>
          <span style={{ paddingLeft: "8px" }} className={filled ? "" : "faint"}>
            {filled ? "konte-workspace" : "Project name"}
          </span>
        </div>
        <T x={19} y={121} s={13} w={600}>
          Source folders
        </T>
        {filled ? (
          <>
            <T x={394} y={121} s={13} c="#6b6b70">
              <I n="laptop" s={15} />
              This computer
            </T>
            <div className="card" style={{ left: "20px", top: "139px", width: "480px", height: "97px", borderRadius: "12px" }}>
              <div className="abs" style={{ left: 0, right: 0, top: "48px", height: "1px", background: "#ececef" }} />
            </div>
            <T x={34} y={164}>
              <I n="folder" s={15} c="#6b6b70" />
              konte-workspace
            </T>
            <Ic n="x" x={475} y={163} s={13} c="#6b6b70" />
            <T x={34} y={212}>
              <I n="folderPlus" s={15} c="#6b6b70" />
              Add folder
            </T>
          </>
        ) : (
          <>
            <div className="card" style={{ left: "20px", top: "137px", width: "480px", height: "103px", borderRadius: "12px" }} />
            <T x={163} y={171} c="#6b6b70">
              Add a folder on <span style={{ color: "#1d1d1f" }}>this computer</span>
              <I n="chevD" s={13} c="#1d1d1f" />
            </T>
            <div className="btn" id="cp-add" style={{ left: "229px", top: "193px", width: "62px", height: "24px", background: "#eeeff2", fontSize: "13.5px", gap: "4px", borderRadius: "999px" }}>
              <I n="folderPlus" s={14} />
              Add
            </div>
          </>
        )}
        <T x={309} y={filled ? 286 : 289} c="#8a8a90">
          Cancel
        </T>
        <div className="btn dark" id="cp-ok" style={{ left: "378px", top: filled ? "270px" : "273px", width: "122px", height: "32px" }}>
          Create project
        </div>
      </div>
    </div>
  );
}

function FolderDialog() {
  const folders = [
    ["Archive", "2026/03/02 13:35"],
    ["Codex", "2026/09/25 14:38"],
    ["ComfyUI", "2026/10/24 4:30"],
    ["konte-workspace", "2026/10/27 3:28"],
    ["Notes", "2026/07/06 0:58"],
    ["Scripts", "2026/04/29 9:03"],
  ] as const;
  const left: [string, string, boolean?][] = [
    ["home", "Home"],
    ["", ""],
    ["monitor", "Desktop"],
    ["download", "Downloads"],
    ["cards", "Documents", true],
    ["picture", "Pictures"],
    ["speaker", "Music"],
    ["monitor", "Videos"],
  ];
  const fy = () => (
    <svg width="16" height="14" viewBox="0 0 16 14" style={{ flex: "none" }}>
      <path d="M1 2h5l1.5 1.5H15v9.5H1z" fill="#f3c356" />
      <path d="M1 5h14v8H1z" fill="#f8d775" />
    </svg>
  );
  return (
    <div className="xp off" id="xp" style={{ left: "4px", top: "136px", width: "1172px", height: "533px" }}>
      <div className="xp-row" style={{ height: "32px", padding: "0 10px", gap: "8px" }}>
        <span style={{ width: "16px", height: "16px", borderRadius: "50%", border: "1.5px solid #333" }} />
        Select Project Root
        <span style={{ marginLeft: "auto" }}>
          <I n="x" s={16} w={1.2} />
        </span>
      </div>
      <div className="xp-row" style={{ height: "48px", padding: "0 12px", gap: "18px", color: "#333" }}>
        <I n="back" s={16} w={1.2} />
        <span style={{ color: "#aaa" }}>
          <I n="fwd" s={16} w={1.2} />
        </span>
        <I n="chevD" s={14} w={1.2} />
        <I n="arrowUp" s={16} w={1.2} />
        <div className="field" style={{ position: "relative", width: "790px", height: "34px", borderRadius: "4px", borderColor: "#ddd", gap: "8px" }}>
          <I n="cards" s={15} w={1.2} /> › Documents
          <span style={{ marginLeft: "auto", display: "flex", gap: "16px" }}>
            <I n="chevD" s={14} w={1.2} />
            <I n="refresh" s={14} w={1.2} />
          </span>
        </div>
        <div className="field" style={{ position: "relative", width: "190px", height: "34px", borderRadius: "4px", borderColor: "#ddd", color: "#777" }}>
          Search Documents
          <span style={{ marginLeft: "auto" }}>
            <I n="search" s={14} w={1.2} />
          </span>
        </div>
      </div>
      <div className="xp-row" style={{ height: "34px", padding: "0 18px", gap: "26px", background: "#f6f8fb" }}>
        <span>Organize ▾</span>
        <span>New folder</span>
      </div>
      <div style={{ position: "absolute", left: 0, top: "116px", width: "150px", bottom: "82px", borderRight: "1px solid #eee", paddingTop: "8px" }}>
        {left.map(([ic, s, sel]) =>
          s ? (
            <div className={sel ? "xp-row xp-sel" : "xp-row"} style={{ height: "32px", padding: "0 0 0 26px", gap: "8px", margin: "0 8px 0 4px" }}>
              <span style={{ color: "#3b78c4" }}>
                <I n={ic} s={16} w={1.4} />
              </span>
              {s}
            </div>
          ) : (
            <div style={{ height: "1px", background: "#ddd", margin: "10px 20px" }} />
          ),
        )}
      </div>
      <div style={{ position: "absolute", left: "160px", top: "116px", right: "8px" }}>
        <div className="xp-row" style={{ height: "28px", color: "#555", gap: "0" }}>
          <span style={{ width: "262px", paddingLeft: "32px" }}>Name</span>
          <span style={{ width: "144px", paddingLeft: "8px" }}>Date modified</span>
          <span style={{ width: "120px", paddingLeft: "8px" }}>Type</span>
          <span style={{ paddingLeft: "8px" }}>Size</span>
        </div>
        <div style={{ marginTop: "6px" }}>
          {folders.map(([n, d]) => (
            <div className="xp-row" style={{ position: "relative", height: "28px", paddingLeft: "18px", gap: "6px", width: "720px" }}>
              {n === "konte-workspace" && <div className="abs off xp-sel" id="xp-kw-sel" style={{ inset: 0, zIndex: 0, border: "1px solid #99d1ff" }} />}
              <span style={{ position: "relative", display: "flex", alignItems: "center", gap: "6px", width: "238px" }}>
                {fy()}
                {n}
              </span>
              <span style={{ position: "relative", width: "144px", color: "#666" }}>{d}</span>
              <span style={{ position: "relative", color: "#666" }}>File folder</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "82px", background: "#f3f3f3", borderTop: "1px solid #e5e5e5" }}>
        <div className="xp-row" style={{ position: "absolute", left: "128px", top: "10px", gap: "8px" }}>
          Folder:
          <div style={{ width: "970px", height: "22px", border: "1px solid #ccc", background: "#fff", padding: "0 4px", display: "flex", alignItems: "center", position: "relative" }}>
            <span id="xp-f-b" className="off">
              konte-workspace
            </span>
          </div>
        </div>
        <div style={{ position: "absolute", right: "18px", bottom: "12px", display: "flex", gap: "16px" }}>
          <span id="xp-ok" style={{ width: "112px", height: "24px", border: "1px solid #bbb", background: "#fdfdfd", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "3px" }}>
            Select Folder
          </span>
          <span style={{ width: "86px", height: "24px", border: "1px solid #bbb", background: "#fdfdfd", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "3px" }}>
            Cancel
          </span>
        </div>
      </div>
    </div>
  );
}

function TrustDialog() {
  return (
    <div className="full off" id="trust">
      <div className="dimmer" />
      <div className="modal" id="trust-box" style={{ left: "391px", top: "263px", width: "400px", height: "280px" }}>
        <div className="abs" style={{ left: 0, right: 0, top: "22px", textAlign: "center", fontSize: "18px", fontWeight: 600 }}>
          Trust this folder?
        </div>
        <Ic n="x" x={372} y={28} s={15} />
        <div className="abs" style={{ left: 0, right: 0, top: "66px", textAlign: "center", fontSize: "13px", color: "#6b6b70" }}>
          C:\Users\alex\Documents\konte-workspace
        </div>
        <div className="abs" style={{ left: "20px", right: "20px", top: "102px", textAlign: "center", fontSize: "13px", lineHeight: "21px", color: "#6b6b70" }}>
          ChatGPT can read, edit, and execute files here. Folder settings can also run code automatically, even without a model request. Continue only if you trust these files.
        </div>
        <div className="btn dark" id="trust-ok" style={{ left: "20px", top: "176px", width: "360px", height: "35px", borderRadius: "999px" }}>
          Trust folder
        </div>
        <div className="btn line" style={{ left: "20px", top: "224px", width: "360px", height: "35px", borderRadius: "999px" }}>
          Cancel
        </div>
      </div>
    </div>
  );
}

function AccountMenu() {
  const row = (top: number, n: string, s: string, k?: string, id?: string) => (
    <div className="mi" id={id} style={{ top: `${top}px` }}>
      <I n={n} s={16} />
      {s}
      {k && <span className="k">{k}</span>}
    </div>
  );
  return (
    <div className="menu off" id="acct-menu" style={{ left: "62px", top: "450px", width: "324px", height: "342px" }}>
      <div className="round" style={{ left: "16px", top: "20px", width: "22px", height: "22px", background: "#8a8f98", fontSize: "8.5px", fontWeight: 600 }}>
        AL
      </div>
      <T x={48} y={26}>
        Alex
      </T>
      <T x={48} y={48} c="#8a8a90">
        Pro
      </T>
      <div className="msep" style={{ top: "72px" }} />
      {row(84, "gauge", "Usage", "100% left")}
      {row(124, "smile", "Show Pet", "Alt+Win+P")}
      {row(165, "send", "Invite a friend")}
      {row(206, "gear", "Settings", "Ctrl+,", "mi-settings")}
      <div className="msep" style={{ top: "250px" }} />
      {row(262, "help", "Help", "›")}
      {row(302, "logout", "Log out")}
    </div>
  );
}

/** The File menu, as it opens from the menu bar. */
function FileMenu() {
  const row = (top: number, s: string, k?: string, id?: string, dim?: boolean) => (
    <div className="mi" id={id} style={{ top: `${top}px`, ...(dim && { color: "#a8a8ae" }) }}>
      {s}
      {k && <span className="k">{k}</span>}
    </div>
  );
  return (
    <div className="menu off" id="file-menu" style={{ left: "101px", top: "31px", width: "240px", height: "292px", borderRadius: "10px" }}>
      {row(4, "New Window")}
      {row(33, "New Chat", "Ctrl+N")}
      {row(62, "New Temporary Chat", "Ctrl+Shift+N", undefined, true)}
      {row(91, "New Project...")}
      <div className="msep" style={{ top: "126px" }} />
      {row(136, "Open Folder...", "Ctrl+O")}
      <div className="msep" style={{ top: "171px" }} />
      {row(181, "Close", "Ctrl+W")}
      <div className="msep" style={{ top: "216px" }} />
      {row(224, "Log Out")}
      {row(254, "Quit ChatGPT", "Ctrl+Q", "fm-quit")}
    </div>
  );
}

const SKILLS: [string, string, string][] = [
  ["Konte: Setup", "Create or set up a konte workspace. Use when starting with konte, creating a workspace, or preparing one.", "From Konte"],
  ["Konte Checkin", "Session opener — recap where the current video stands, propose the next step, surface the choice.", "Project"],
  ["Konte: Upgrade", "Update or reinstall one workspace's konte binary. Use when the user requests an upgrade.", "From Konte"],
  ["Konte Feedback", "Turn one konte bug, rough edge or unanswered question hit this session into a post for the forum.", "Project"],
  ["Konte Comfy Workflow", "Import a ComfyUI workflow into a konte project and clean up the auto-generated adapter.", "Project"],
];

/** The `$` skill picker above the composer; `rows` are indices into SKILLS, `hl` the highlighted one. */
function SkillMenu({ rows, hl = 0 }: { rows: number[]; hl?: number }) {
  const h = rows.length * 28.5 + 12;
  return (
    <div className="menu off" id="skills" style={{ left: "391px", top: `${680 - h}px`, width: "736px", height: `${h}px`, borderRadius: "14px" }}>
      {rows.map((r, i) => {
        const [name, desc, src] = SKILLS[r]!;
        return (
          <div className="mi" id={`sk-${i}`} style={{ top: `${6 + i * 28.5}px`, height: "27px", fontSize: "13px", gap: "8px", ...(i === hl && { backgroundColor: "rgba(0,0,0,0.06)" }) }}>
            <I n="cube" s={14} />
            <span style={{ color: "#1d1d1f" }}>{name}</span>
            <span className="mute" style={{ overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>
              {desc}
            </span>
            <span className="mute" style={{ marginLeft: "8px" }}>
              {src}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ───────────── Settings ─────────────

const SET_NAV: ([string, string] | string)[] = [
  "Personal",
  ["gear", "General"],
  ["bell", "Notifications"],
  ["download", "Import"],
  ["user", "Profile"],
  ["sun", "Appearance"],
  ["user", "Account"],
  ["archive", "Archived chats"],
  ["user", "Parental controls"],
  ["user", "Trusted contact"],
  ["mic", "Voice"],
  ["folder", "Storage"],
  ["shield", "Configuration"],
  ["smile", "Personalization"],
  ["smile", "Mini & Pets"],
  ["keyboard", "Keyboard shortcuts"],
  ["gauge", "Usage & billing"],
  ["shield", "Data controls"],
  "Integrations",
  ["at", "Plugins"],
  ["key", "Passwords"],
  ["pointer", "Computer use"],
  ["picture", "Appshots"],
  ["monitor", "Browser"],
  ["laptop", "Cloud computer"],
  "Coding",
  ["hook", "Hooks"],
  ["globe", "Connections"],
  ["cloud", "Codex Cloud"],
  ["branch", "Code Review"],
  ["branch", "Git"],
  ["branch", "Worktrees"],
];

/** Settings' left list, laid out from y=160 (General at 194) and clipped under the search pill. */
function SettingsSide({ sel, scrolled }: { sel: string; scrolled?: boolean }) {
  let y = 160;
  const items: El[] = [];
  for (const it of SET_NAV) {
    if (typeof it === "string") {
      if (y > 160) y += 15;
      items.push(
        <T x={68} y={y} c="#6b6b70">
          {it}
        </T>,
      );
      y += 34;
    } else {
      const [ic, s] = it;
      const id = `nav-${s.toLowerCase().replace(/[^a-z]+/g, "-")}`;
      items.push(
        <>
          <div className="row" id={id} style={{ top: `${y - 15}px`, width: "262px", backgroundColor: s === sel ? "#e9ebef" : "rgba(0,0,0,0)" }} />
          <T x={92} y={y}>
            {s}
          </T>
          <Ic n={ic} x={76} y={y} s={15} />
          {s === "Profile" && <Ic n="arrowUR" x={306} y={y} s={14} c="#9b9ba1" />}
        </>,
      );
      y += 31;
    }
  }
  return (
    <>
      <div className="sidebg" />
      <T x={68} y={70} s={17} w={600}>
        Settings
      </T>
      <div className="abs" style={{ left: "60px", top: "96px", width: "272px", height: "36px", borderRadius: "999px", background: "#eceef2", display: "flex", alignItems: "center", gap: "10px", paddingLeft: "14px", color: "#8a8a90" }}>
        <I n="search" s={15} />
        Search
      </div>
      <div className="abs" style={{ left: "52px", top: "140px", width: "288px", bottom: "5px", overflow: "hidden" }}>
        <div className="abs" id="set-list" style={{ left: "-52px", top: "-140px", width: "340px", height: "1400px", ...(scrolled && { transform: "translateY(-380px)" }) }}>
          {items}
        </div>
      </div>
      <div className="abs" style={{ left: "331px", top: scrolled ? "385px" : "150px", width: "4px", height: "410px", borderRadius: "2px", background: "#cfd2d8" }} />
    </>
  );
}

function SettingsGeneral() {
  const row = (top: number, title: string, desc: string, right: El, h = 60) => (
    <>
      <T x={407} y={top + 18} w={600} s={13.5}>
        {title}
      </T>
      <div className="abs" style={{ left: "407px", top: `${top + 30}px`, width: "420px", fontSize: "12px", lineHeight: "16px", color: "#6b6b70" }}>
        {desc}
      </div>
      {right}
      <div className="abs" style={{ left: "407px", width: "694px", top: `${top + h}px`, height: "1px", background: "#ececef" }} />
    </>
  );
  return (
    <div className="full" id="sv-general">
      <div className="panel" style={{ left: "341px", borderRadius: "0 10px 10px 0", borderLeft: "none" }} />
      <T x={390} y={137} s={28} w={700}>
        General
      </T>
      <T x={390} y={208} s={14} w={600}>
        Permissions
      </T>
      <div className="card" style={{ left: "391px", top: "234px", width: "726px", height: "169px" }} />
      {row(238, "Default permissions", "By default, ChatGPT can read and edit files in its workspace. It can ask for additional access when needed", <div className="tog lite" style={{ left: "1069px", top: "261px" }} />, 72)}
      <T x={407} y={332} w={600} s={13.5}>
        Full access
      </T>
      <div className="abs" style={{ left: "407px", top: "344px", width: "500px", fontSize: "12px", lineHeight: "16px", color: "#6b6b70" }}>
        When ChatGPT runs with full access, it can edit any file on your computer and run commands with network, without your approval. This significantly increases the risk of data loss, leaks, or unexpected behavior.
      </div>
      <div className="tog" style={{ left: "1069px", top: "346px" }} />
      <T x={390} y={465} s={14} w={600}>
        General
      </T>
      <div className="card" style={{ left: "391px", top: "491px", width: "726px", height: "330px" }} />
      {row(494, "Projectless chat folder", "The location where chats started outside of projects store their data by default.", (
        <>
          <T x={838} y={529} s={12} c="#3c3c41" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            C:\Users\alex\Documents\Codex
          </T>
          <div className="btn" style={{ left: "1039px", top: "516px", width: "62px", height: "27px", background: "#eeeff2", fontSize: "13px" }}>
            Change
          </div>
        </>
      ), 74)}
      {row(571, "Default file open destination", "Where files and folders open by default", <div className="sel-box" style={{ left: "966px", top: "584px" }}>Default app <I n="chevD" s={13} /></div>)}
      {row(631, "Agent environment", "Choose where the agent runs on Windows", <div className="sel-box" style={{ left: "966px", top: "645px" }}>Windows native <I n="chevD" s={13} /></div>)}
      {row(692, "Integrated terminal shell", "Choose which shell opens in the integrated terminal.", <div className="sel-box" style={{ left: "995px", top: "705px" }}>PowerShell <I n="chevD" s={13} /></div>)}
      <T x={407} y={770} w={600} s={13.5}>
        Language
      </T>
      <div className="sel-box" style={{ left: "1016px", top: "766px" }}>
        English <I n="chevD" s={13} />
      </div>
    </div>
  );
}

const SET_PLUGINS: [string, string, string][] = [
  ["gmail", "Gmail", "Read and manage Gmail"],
  ["drive", "Google Drive", "Drive, Docs, Sheets or Slides"],
  ["calendar", "Google Calendar", "Manage Google Calendar events"],
  ["slack", "Slack", "Read and manage Slack"],
  ["notion", "Notion", "Create docs, tasks, databases"],
];

function SettingsPlugins({ hidden }: { hidden?: boolean }) {
  return (
    <div className={hidden ? "full off" : "full"} id="sv-plugins">
      <div className="panel" style={{ left: "341px", borderRadius: "0 10px 10px 0", borderLeft: "none" }} />
      <T x={390} y={137} s={28} w={700}>
        Plugins
      </T>
      <T x={390} y={168} c="#6b6b70">
        Manage plugins, skills, and MCPs
      </T>
      <div className="btn line" style={{ left: "918px", top: "133px", width: "130px", height: "32px", fontSize: "13.5px" }}>
        Browse directory
      </div>
      <div className="btn dark" id="btn-add" style={{ left: "1056px", top: "133px", width: "62px", height: "32px", fontSize: "13.5px", gap: "4px" }}>
        Add <I n="chevD" s={13} />
      </div>
      <div className="abs" style={{ left: "390px", top: "215px", width: "72px", height: "28px", borderRadius: "8px", background: "#eeeff2" }} />
      <T x={399} y={229} s={13}>
        Plugins <span className="mute">5</span>
      </T>
      <T x={474} y={229} s={13} c="#6b6b70">
        Apps <span className="faint">11</span>
      </T>
      <T x={543} y={229} s={13} c="#6b6b70">
        MCPs <span className="faint">1</span>
      </T>
      <div className="field" style={{ left: "895px", top: "213px", width: "222px", height: "32px", gap: "8px", color: "#a0a0a6" }}>
        <I n="search" s={15} c="#6b6b70" />
        Search plugins
      </div>
      <div className="card" style={{ left: "391px", top: "286px", width: "726px", height: "302px" }} />
      {SET_PLUGINS.map(([k, name, desc], i) => {
        const y = 317 + i * 60.5;
        return (
          <>
            <div className="abs" style={{ left: "408px", top: `${y - 17}px`, width: "34px", height: "34px", borderRadius: "8px", border: "1px solid #e6e7ea", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Logo k={k} s={22} />
            </div>
            <T x={455} y={y - 10} s={13.5} w={600}>
              {name}
            </T>
            <T x={455} y={y + 10} s={12} c="#6b6b70">
              {desc}
            </T>
            <div className="tog" style={{ left: "1045px", top: `${y - 10}px` }} />
            <Ic n="chevR" x={1093} y={y} s={14} c="#8a8a90" />
            {i < 4 && <div className="abs" style={{ left: "407px", width: "694px", top: `${y + 29}px`, height: "1px", background: "#ececef" }} />}
          </>
        );
      })}
    </div>
  );
}

function AddMenu() {
  return (
    <div className="menu off" id="add-menu" style={{ left: "932px", top: "171px", width: "186px", height: "96px", borderRadius: "12px", transformOrigin: "100% 0%" }}>
      <div className="mi" style={{ top: "4px", fontSize: "13.5px", gap: "8px" }}>
        <I n="at" s={15} /> Create plugin
      </div>
      <div className="mi" id="mi-market" style={{ top: "33px", fontSize: "13.5px", gap: "8px" }}>
        <I n="plus" s={15} /> Add a marketplace
      </div>
      <div className="mi" style={{ top: "62px", fontSize: "13.5px", gap: "8px" }}>
        <I n="wrench" s={15} /> Add MCP server
      </div>
    </div>
  );
}

/** The "Add plugin marketplace" dialog. `source` and `gitRef` are "empty", "typing" (hidden text for a type run) or "done". */
function MarketForm({ source, gitRef, ready }: { source: "empty" | "typing" | "done"; gitRef: "empty" | "typing" | "done"; ready?: boolean }) {
  const field = (id: string, top: number, ph: string, val: string, st: "empty" | "typing" | "done") => (
    <div className="field" id={id} style={{ left: "20px", top: `${top}px`, width: "560px", height: "35px" }}>
      <span className="faint" id={`${id}-ph`} style={{ display: st === "done" ? "none" : "inline" }}>
        {ph}
      </span>
      {st !== "empty" && (
        <span className="cin" id={`${id}-in`} style={{ display: st === "done" ? "inline" : "none" }}>
          {val}
        </span>
      )}
      <span className="caret off" id={`${id}-caret`} />
    </div>
  );
  return (
    <div className="full off" id="mk">
      <div className="dimmer" />
      <div className="modal" id="mk-box" style={{ left: "291px", top: "196px", width: "600px", height: "414px" }}>
        <T x={19} y={35} s={19} w={600}>
          Add plugin marketplace
        </T>
        <Ic n="x" x={572} y={28} s={15} />
        <T x={20} y={63} c="#8a8a90">
          Add from a GitHub repo, Git URL, or local folder. <span style={{ color: "#2462d6" }}>Learn more</span>
        </T>
        <T x={20} y={94} s={13} c="#6b6b70">
          Source
        </T>
        {field("mk-src", 110, "openai/plugins or git@github.com:org/repo.git", "shiwano/konte", source)}
        <T x={20} y={167} s={13} c="#6b6b70">
          Git ref
        </T>
        {field("mk-ref", 182, "main", "origin/plugin", gitRef)}
        <T x={20} y={239} s={13} c="#6b6b70">
          Sparse paths
        </T>
        <div className="field" style={{ left: "20px", top: "255px", width: "560px", height: "95px", alignItems: "flex-start", paddingTop: "8px" }}>
          <span className="faint">plugins/codex</span>
        </div>
        <div className="btn line" style={{ left: "355px", top: "363px", width: "74px", height: "32px" }}>
          Cancel
        </div>
        <div className={ready ? "btn dis off" : "btn dis"} id="mk-ok-off" style={{ left: "441px", top: "363px", width: "139px", height: "32px", fontWeight: 600 }}>
          Add marketplace
        </div>
        <div className={ready ? "btn dark" : "btn dark off"} id="mk-ok" style={{ left: "441px", top: "363px", width: "139px", height: "32px", fontWeight: 600 }}>
          Add marketplace
        </div>
      </div>
    </div>
  );
}

// ───────────── Customize › Plugins ─────────────

const POPULAR: [string, string, string, boolean][] = [
  ["gmail", "Gmail", "Read and manage Gmail", true],
  ["drive", "Google Drive", "Drive, Docs, Sheets or Slides", true],
  ["calendar", "Google Calendar", "Manage Google Calendar events", true],
  ["github", "GitHub", "Triage PRs, issues, CI, and publish flows", false],
  ["slack", "Slack", "Read and manage Slack", true],
  ["outlook", "Outlook Email", "Triage Outlook inboxes", false],
];

/** Customize › Plugins. `tab` is the tab showing at the start; `konte` how far the konte install has got. */
function Customize({ tab, konte }: { tab: "public" | "personal"; konte: "none" | "installing" | "installed" }) {
  const installed: [string, string][] = [
    ["gmail", "Gmail"],
    ["drive", "Google Drive"],
    ["calendar", "Google Calendar"],
    ["slack", "Slack"],
    ["notion", "Notion"],
  ];
  return (
    <div className="full" id="cu">
      <div className="sidebg" />
      <T x={68} y={70} s={17} w={600}>
        Customize
      </T>
      <Ic n="search" x={314} y={70} />
      <div className="row sel" style={{ top: "97px" }} />
      <Ic n="at" x={76} y={112} s={15} />
      <T x={92} y={112}>
        Plugins
      </T>
      <Ic n="cube" x={76} y={143} s={15} />
      <T x={92} y={143}>
        Skills
      </T>
      <T x={68} y={189} c="#6b6b70">
        Installed
      </T>
      {installed.map(([k, s], i) => (
        <T x={68} y={223 + i * 31}>
          <Logo k={k} s={15} />
          {s}
        </T>
      ))}
      <div className={konte === "installed" ? "abs" : "abs off"} id="cu-side-konte">
        <T x={68} y={378}>
          <Logo k="konte" s={15} />
          konte
        </T>
      </div>
      <div className="panel" style={{ left: "341px", borderRadius: "0 10px 10px 0", borderLeft: "none" }} />
      <T x={371} y={92} s={25} w={700}>
        Plugins
      </T>
      <T x={371} y={127} c="#6b6b70">
        Connect plugins to let Codex work across your tools
      </T>
      <div className="field" style={{ left: "743px", top: "75px", width: "240px", height: "31px", borderRadius: "999px", gap: "8px", color: "#a0a0a6" }}>
        <I n="search" s={15} c="#6b6b70" />
        Search plugins
      </div>
      <Ic n="refresh" x={1011} y={90} s={16} />
      <Ic n="gear" x={1050} y={90} s={16} />
      <div className="btn dark" style={{ left: "1075px", top: "74px", width: "62px", height: "32px", borderRadius: "999px", fontSize: "13.5px", gap: "4px" }}>
        Add <I n="chevD" s={13} />
      </div>
      <div className="abs" id="tab-pub-bg" style={{ left: "371px", top: "157px", width: "70px", height: "36px", borderRadius: "999px", background: tab === "public" ? "#eeeff2" : "rgba(0,0,0,0)" }} />
      <div className="abs" id="tab-per-bg" style={{ left: "445px", top: "157px", width: "84px", height: "36px", borderRadius: "999px", background: tab === "personal" ? "#eeeff2" : "rgba(0,0,0,0)" }} />
      <T x={388} y={175} s={13} w={500} c={tab === "public" ? "#1d1d1f" : "#6b6b70"}>
        Public
      </T>
      <T x={462} y={175} s={13} w={500} c={tab === "personal" ? "#1d1d1f" : "#6b6b70"}>
        Personal
      </T>
      <div className="card" style={{ left: "363px", top: "213px", width: "782px", height: "80px", borderRadius: "20px", boxShadow: "0 2px 8px rgba(0,0,0,.04)" }} />
      <div className="abs" style={{ left: "397px", top: "243px" }}>
        <Logo k="browser" s={20} />
      </div>
      <T x={439} y={245} s={13} w={600}>
        Use ChatGPT while you browse
      </T>
      <T x={439} y={264} s={12.5} c="#6b6b70">
        Install the browser extension to bring ChatGPT into your browser.
      </T>
      <div className="btn dark" style={{ left: "1037px", top: "240px", width: "60px", height: "27px", borderRadius: "999px", fontSize: "13px" }}>
        Install
      </div>
      <Ic n="x" x={1119} y={253} s={13} c="#8a8a90" />
      <div className={tab === "public" ? "full" : "full off"} id="cu-pub">
        <T x={371} y={339} s={16} w={600}>
          Popular <I n="chevR" s={14} c="#8a8a90" />
        </T>
        {POPULAR.map(([k, name, desc, has], i) => {
          const x = i % 2 === 0 ? 371 : 774;
          const y = 407 + Math.floor(i / 2) * 68;
          return (
            <>
              <div className="abs" style={{ left: `${x}px`, top: `${y - 18}px`, width: "36px", height: "36px", borderRadius: "9px", border: "1px solid #e6e7ea", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Logo k={k} s={22} />
              </div>
              <T x={x + 48} y={y - 11} s={13.5} w={600}>
                {name}
              </T>
              <T x={x + 48} y={y + 12} s={12.5} c="#6b6b70">
                {desc}
              </T>
              <Ic n={has ? "more" : "plus"} x={x + 349} y={y} s={17} w={has ? 3 : 1.6} />
            </>
          );
        })}
        <T x={371} y={619} s={16} w={600}>
          New &amp; Noteworthy <I n="chevR" s={14} c="#8a8a90" />
        </T>
      </div>
      <div className={tab === "personal" ? "full" : "full off"} id="cu-per">
        <T x={371} y={339} s={16} w={600}>
          konte
        </T>
        <div className="abs" style={{ left: "371px", top: "389px", width: "36px", height: "36px", borderRadius: "9px", border: "1px solid #e6e7ea", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Logo k="konte" s={24} />
        </div>
        <T x={419} y={396} s={13.5} w={600}>
          konte <I n="branch" s={13} c="#6b6b70" />
        </T>
        <T x={419} y={419} s={12.5} c="#6b6b70">
          Setup and upgrade konte, the agent-operated…
        </T>
        <div className={konte === "none" ? "abs" : "abs off"} id="pk-plus" style={{ left: "708px", top: "395px", width: "24px", height: "24px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <I n="plus" s={18} />
        </div>
        <div className={konte === "installing" ? "abs" : "abs off"} id="pk-inst" style={{ left: "652px", top: "397px", display: "flex", alignItems: "center", gap: "7px", color: "#7a7a80", fontSize: "13px" }}>
          <Spinner id="pk-sp" s={16} c="#8a8a90" />
          Installing
        </div>
        <div className={konte === "installed" ? "abs" : "abs off"} id="pk-more" style={{ left: "708px", top: "395px" }}>
          <I n="more" s={20} w={3} />
        </div>
      </div>
    </div>
  );
}

// ───────────── chats ─────────────

function ChatHead({ title }: { title: string }) {
  return (
    <>
      <div className="panel" style={{ left: "341px", borderRadius: "0 10px 10px 0", borderLeft: "none" }} />
      <T x={360} y={70} w={600}>
        <I n="folder" s={15} />
        {title}
      </T>
      <Ic n="more" x={1076} y={70} s={17} w={3} />
      <Ic n="list" x={1110} y={70} s={16} />
      <div className="abs" style={{ left: "1131px", top: "60px", width: "1px", height: "20px", background: "#e2e3e7" }} />
      <Ic n="newwin" x={1151} y={70} s={15} />
    </>
  );
}

/** The setup chat at a stage: 0 just sent, 1 running, 2 done with the reply arriving, 3 that reply settled. */
function SetupChat({ id, stage }: { id: string; stage: 0 | 1 | 2 | 3 }) {
  const running = stage <= 1;
  return (
    <div className="full" id={`${id}-main`}>
      <ChatHead title="Set up Konte" />
      <div className={stage === 0 ? "bubble off" : "bubble"} id={`${id}-bubble`} style={{ left: "1011px", top: "128px" }}>
        $konte:setup
      </div>
      {running ? (
        <>
          <div className={stage === 0 ? "work off" : "work"} id={`${id}-work`} style={{ top: "217px" }}>
            Working for <span id={`${id}-secs`}>{stage === 0 ? "0s" : "11s"}</span>
          </div>
          <div className={stage === 0 ? "para off" : "para"} id={`${id}-p1`} style={{ top: "262px" }}>
            Using the konte:setup skill to check this workspace and run the setup it needs.
          </div>
          <div className={stage === 0 ? "cmd off" : "cmd"} id={`${id}-c1`} style={{ top: "303px" }}>
            <I n="termbox" s={15} />
            <span id={`${id}-c1-a`}>Running</span>
            <span id={`${id}-c1-b`} style={{ display: "none" }}>
              Ran
            </span>
            Get-ChildItem -Force; if (Test-Path -LiteralPath 'AGENTS.md') {"{"} Get-Content -LiteralPath 'AGENTS.md' {"}"}
          </div>
          <div className="cmd off" id={`${id}-c2`} style={{ top: "331px" }}>
            <I n="termbox" s={15} />
            <span id={`${id}-c2-a`}>Running</span>
            <span id={`${id}-c2-b`} style={{ display: "none" }}>
              Ran
            </span>
            the konte setup script
          </div>
          <div className="cmd off" id={`${id}-c3`} style={{ top: "359px" }}>
            <I n="termbox" s={15} />
            Running konte doctor
          </div>
        </>
      ) : (
        <div className={stage === 2 ? "full off" : "full"} id={`${id}-reply`}>
          <div className="work" style={{ top: "219px" }}>
            Worked for 58s <I n="chevR" s={14} />
          </div>
          <div className="para" style={{ top: "260px" }}>
            konte setup is complete.
          </div>
          <div className="para" style={{ top: "286px", paddingLeft: "28px", width: "708px" }}>
            <b style={{ position: "absolute", left: "8px" }}>1.</b>
            <span className="mark" id={`${id}-mark`} style={stage === 2 ? { backgroundSize: "0% 100%" } : undefined}>
              Fully quit the Codex app and restart it. Opening a new chat isn't enough.
            </span>
          </div>
          <div className="para" style={{ top: "310px", paddingLeft: "28px", width: "708px" }}>
            <b style={{ position: "absolute", left: "8px" }}>2.</b>
            Open this workspace, and trust the project settings if asked.
          </div>
          <div className="para" style={{ top: "333px", paddingLeft: "28px", width: "708px" }}>
            <b style={{ position: "absolute", left: "8px" }}>3.</b>
            Run{" "}
            <span className="skill">
              <I n="cube" s={14} /> Konte Checkin
            </span>
            .
          </div>
          <div className="abs" style={{ left: "392px", top: "366px", display: "flex", gap: "16px", color: "#7a7a80" }}>
            <I n="copy" s={15} />
            <I n="speaker" s={15} />
            <I n="thumb" s={15} />
            <I n="more" s={15} w={3} />
          </div>
        </div>
      )}
      <Composer id={`${id}-c`} ph="Work with Codex" project={false} running={running} />
    </div>
  );
}

/** The check-in chat, built up over one shot: work line, narration, then the question card. */
function CheckinChat({ id }: { id: string }) {
  return (
    <div className="full" id={`${id}-main`}>
      <ChatHead title="Run konte session check-in" />
      <div className="bubble off" id={`${id}-bubble`} style={{ left: "993px", top: "112px" }}>
        $konte-checkin
      </div>
      <div className="work off" id={`${id}-work`} style={{ top: "190px" }}>
        Working for <span id={`${id}-secs`}>1s</span>
      </div>
      <div className="para off" id={`${id}-p1`} style={{ top: "232px" }}>
        Following konte-checkin to see which piece is in progress and where it stands.
      </div>
      <div className="cmd off" id={`${id}-c1`} style={{ top: "268px", color: "#7a7a80" }}>
        <I n="wrench" s={15} />
        Loaded a tool, ran commands
      </div>
      <div className="para off" id={`${id}-p2`} style={{ top: "302px" }}>
        This workspace has no videos yet. I'd suggest starting by shaping the concept for your first piece.
      </div>
      <div className="para off" id={`${id}-p3`} style={{ top: "338px" }}>
        What should your first piece start from?
      </div>
      <div className="para off" id={`${id}-p4`} style={{ top: "374px" }}>
        Tell me what you have in mind — what it's for, where it'll be shown, and what you picture.
      </div>
      <div className="cmd off" id={`${id}-think`} style={{ top: "414px", color: "#a8a8ae", fontSize: "14px" }}>
        Thinking
      </div>
      <div className="card off" id={`${id}-q`} style={{ left: "391px", top: "466px", width: "736px", height: "258px", borderRadius: "20px", boxShadow: "0 4px 18px rgba(0,0,0,.06)" }}>
        <T x={17} y={27} c="#6b6b70" s={13}>
          <I n="qmark" s={15} />
          Question
        </T>
        <T x={614} y={29} c="#6b6b70" s={12.5}>
          <I n="chevL" s={13} /> 1 of 2 <I n="chevR" s={13} />
          <span style={{ marginLeft: "16px" }}>
            <I n="x" s={13} />
          </span>
        </T>
        <T x={17} y={63} w={600}>
          What should your first piece start from?
        </T>
        {["Talk through an idea and shape the concept together (recommended)", "Use a script or shot list you already have", "Start from material or references you have"].map((s, i) => (
          <T x={17} y={101 + i * 37}>
            <span className="qn">{i + 1}</span>
            <span style={{ fontWeight: 500 }}>{s}</span>
          </T>
        ))}
        <div className="abs" style={{ left: 0, right: 0, top: "196px", height: "62px", borderTop: "1px solid #f0f0f2", borderRadius: "0 0 20px 20px", background: "#fbfbfc" }} />
        <T x={25} y={227} c="#a8a8ae">
          <I n="edit" s={14} />
          <span style={{ marginLeft: "6px" }}>Or write your own response</span>
        </T>
        <Ic n="mic" x={599} y={227} s={16} c="#3c3c41" />
        <div className="btn line" style={{ left: "621px", top: "214px", width: "42px", height: "27px", borderRadius: "999px", fontSize: "13px" }}>
          Skip
        </div>
        <div className="btn dis" style={{ left: "672px", top: "214px", width: "46px", height: "27px", borderRadius: "999px", fontSize: "13px" }}>
          Next
        </div>
      </div>
      <div className="comp" style={{ top: "738px", height: "48px", borderRadius: "18px" }} />
      <Ic n="plus" x={413} y={762} s={18} c="#1d1d1f" />
      <T x={432} y={762} c="#a8a8ae">
        Work with Codex
      </T>
      <T x={880} y={762} s={13}>
        GPT-6.1 Sol <span className="mute">Medium</span> <I n="chevD" s={12} c="#8a8a90" />
      </T>
      <Ic n="gear" x={1041} y={762} s={15} c="#6b6b70" />
      <Ic n="mic" x={1069} y={762} s={17} c="#1d1d1f" />
      <div className="round" style={{ left: "1091px", top: "748px" }}>
        <span className="sq" />
      </div>
    </div>
  );
}

// ───────────── the shots ─────────────

export type ShotId = "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17";

type Def = { step?: readonly [number, string]; cursor?: readonly [number, number]; ev: Ev[]; body: () => El };

const AFTER_SETUP: Chat[] = [{ name: "Set up Konte" }];

const SHOTS: Record<ShotId, Def> = {
  "01": {
    step: [1, "Open a workspace"],
    cursor: [780, 520],
    ev: [
      { t: 0, d: 0, cam: [590, 403, 1] },
      { t: 0.1, d: 0.8, cam: [640, 660, 1.9] },
      { t: 0.15, d: 0.8, cur: [482, 671] },
      { t: 1.05, click: true },
      { t: 1.05, press: "#h-proj" },
      { t: 1.1, bg: "#h-proj" },
    ],
    body: () => (
      <>
        <TopBar />
        <Rail />
        <HomeSide />
        <Home />
      </>
    ),
  },
  "02": {
    cursor: [482, 671],
    ev: [
      { t: 0, d: 0, cam: [590, 420, 1.3] },
      { t: 0, d: 0, show: "#cp" },
      { t: 0, pop: "#cp-box", d: 0.25 },
      { t: 0.15, d: 0.6, cam: [590, 400, 1.75] },
      { t: 0.2, d: 0.6, cur: [592, 448] },
      { t: 0.85, bg: "#cp-add" },
      { t: 1.05, click: true },
      { t: 1.05, press: "#cp-add" },
    ],
    body: () => (
      <>
        <TopBar />
        <Rail />
        <HomeSide />
        <Home />
        <CreateProject />
      </>
    ),
  },
  "03": {
    cursor: [592, 448],
    ev: [
      { t: 0, d: 0, cam: [420, 400, 1.55] },
      { t: 0, d: 0, show: "#xp" },
      { t: 0, d: 0, show: "#cp" },
      { t: 0, pop: "#xp", d: 0.25 },
      { t: 0.15, d: 0.55, cur: [300, 384] },
      { t: 0.75, click: true },
      { t: 0.78, show: "#xp-kw-sel" },
      { t: 0.78, show: "#xp-f-b" },
      { t: 0.95, d: 0.6, cam: [880, 580, 1.65] },
      { t: 0.95, d: 0.6, cur: [1000, 645] },
      { t: 1.7, click: true },
      { t: 1.7, press: "#xp-ok" },
      { t: 1.85, vanish: "#xp" },
    ],
    body: () => (
      <>
        <TopBar />
        <Rail />
        <HomeSide />
        <Home />
        <CreateProject />
        <FolderDialog />
      </>
    ),
  },
  "04": {
    cursor: [1000, 645],
    ev: [
      { t: 0, d: 0, cam: [590, 410, 1.5] },
      { t: 0, d: 0, show: "#cp" },
      { t: 0.05, d: 0.5, cam: [640, 420, 1.75] },
      { t: 0.1, d: 0.55, cur: [772, 530] },
      { t: 0.75, click: true },
      { t: 0.75, press: "#cp-ok" },
      { t: 0.9, show: "#trust" },
      { t: 0.9, pop: "#trust-box", d: 0.25 },
      { t: 0.9, hide: "#sb-a" },
      { t: 0.9, show: "#sb-b" },
      { t: 0.9, off: "#h-proj-a" },
      { t: 0.9, on: "#h-proj-b" },
      { t: 1.0, d: 0.5, cur: [600, 458] },
      { t: 1.0, d: 0.5, cam: [590, 410, 1.6] },
      { t: 1.65, click: true },
      { t: 1.65, press: "#trust-ok" },
      { t: 1.8, vanish: "#trust", d: 0.18 },
      { t: 1.8, vanish: "#cp", d: 0.18 },
      { t: 1.95, off: "#h-title-a" },
      { t: 1.95, d: 0, on: "#h-title-b" },
      { t: 1.95, pop: "#h-title-b", d: 0.3 },
      { t: 1.95, d: 0.7, cam: [700, 500, 1.35] },
      { t: 2.0, d: 0.6, cur: [880, 560] },
    ],
    body: () => (
      <>
        <TopBar />
        <Rail />
        <HomeSide projId="sb" />
        <Home wsNext />
        <CreateProject filled />
        <TrustDialog />
      </>
    ),
  },
  "05": {
    step: [2, "Add the marketplace"],
    cursor: [420, 620],
    ev: [
      { t: 0, d: 0, cam: [300, 600, 1.7] },
      { t: 0.1, d: 0.5, cur: [26, 782] },
      { t: 0.65, click: true },
      { t: 0.65, press: "#avatar" },
      { t: 0.7, pop: "#acct-menu" },
      { t: 0.8, d: 0.5, cam: [240, 620, 1.85] },
      { t: 0.95, d: 0.5, cur: [110, 671] },
      { t: 1.45, bg: "#mi-settings" },
      { t: 1.6, click: true },
    ],
    body: () => (
      <>
        <TopBar />
        <Rail />
        <HomeSide proj={[]} />
        <Home ws />
        <AccountMenu />
      </>
    ),
  },
  "06": {
    cursor: [180, 420],
    ev: [
      { t: 0, d: 0, cam: [590, 403, 1] },
      { t: 0.2, d: 0.55, cam: [260, 450, 1.75] },
      { t: 0.3, d: 0.4, cur: [190, 520] },
      { t: 0.7, d: 0.6, y: ["#set-list", -380] },
      { t: 1.25, d: 0.35, cur: [118, 392] },
      { t: 1.65, click: true },
      { t: 1.7, bg: "#nav-plugins" },
      { t: 1.7, unbg: "#nav-general" },
      { t: 1.72, show: "#sv-plugins" },
      { t: 1.75, d: 0.6, cam: [590, 380, 1.1] },
    ],
    body: () => (
      <>
        <TopBar toggle={false} />
        <Rail sel="none" />
        <SettingsSide sel="General" />
        <SettingsGeneral />
        <SettingsPlugins hidden />
      </>
    ),
  },
  "07": {
    cursor: [118, 392],
    ev: [
      { t: 0, d: 0, cam: [590, 380, 1.1] },
      { t: 0.05, d: 0.5, cam: [950, 200, 2.0] },
      { t: 0.1, d: 0.5, cur: [1087, 150] },
      { t: 0.65, click: true },
      { t: 0.65, press: "#btn-add" },
      { t: 0.72, pop: "#add-menu" },
      { t: 0.9, d: 0.4, cur: [1030, 220] },
      { t: 1.3, bg: "#mi-market" },
      { t: 1.45, click: true },
    ],
    body: () => (
      <>
        <TopBar toggle={false} />
        <Rail sel="none" />
        <SettingsSide sel="Plugins" scrolled />
        <SettingsPlugins />
        <AddMenu />
      </>
    ),
  },
  "08": {
    cursor: [1030, 220],
    ev: [
      { t: 0, d: 0, cam: [590, 403, 1.3] },
      { t: 0, d: 0, show: "#mk" },
      { t: 0, pop: "#mk-box", d: 0.22 },
      { t: 0.15, d: 0.5, cam: [520, 330, 2.2] },
      { t: 0.15, d: 0.35, cur: [640, 326] },
      { t: 0.55, click: true },
      { t: 0.6, off: "#mk-src-ph" },
      { t: 0.6, on: "#mk-src-in" },
      { t: 0.6, show: "#mk-src-caret" },
      { t: 0.6, pulse: "#mk-src" },
      { t: 0.65, d: 1.3, type: "#mk-src-in" },
    ],
    body: () => (
      <>
        <TopBar toggle={false} />
        <Rail sel="none" />
        <SettingsSide sel="Plugins" scrolled />
        <SettingsPlugins />
        <MarketForm source="typing" gitRef="empty" />
      </>
    ),
  },
  "09": {
    cursor: [640, 326],
    ev: [
      { t: 0, d: 0, cam: [520, 330, 2.2] },
      { t: 0, d: 0, show: "#mk" },
      { t: 0, d: 0, show: "#mk-src-caret" },
      { t: 0.05, d: 0.4, cam: [520, 380, 2.2] },
      { t: 0.1, d: 0.35, cur: [640, 398] },
      { t: 0.5, click: true },
      { t: 0.55, hide: "#mk-src-caret" },
      { t: 0.55, off: "#mk-ref-ph" },
      { t: 0.55, on: "#mk-ref-in" },
      { t: 0.55, show: "#mk-ref-caret" },
      { t: 0.55, pulse: "#mk-ref" },
      { t: 0.6, d: 1.3, type: "#mk-ref-in" },
      { t: 2.0, hide: "#mk-ok-off" },
      { t: 2.0, pop: "#mk-ok", d: 0.15 },
      { t: 2.05, d: 0.5, cam: [720, 480, 2.0] },
      { t: 2.1, d: 0.5, cur: [802, 577] },
      { t: 2.75, click: true },
      { t: 2.75, press: "#mk-ok" },
    ],
    body: () => (
      <>
        <TopBar toggle={false} />
        <Rail sel="none" />
        <SettingsSide sel="Plugins" scrolled />
        <SettingsPlugins />
        <MarketForm source="done" gitRef="typing" />
      </>
    ),
  },
  "10": {
    step: [3, "Install konte"],
    cursor: [802, 577],
    ev: [
      { t: 0, d: 0, cam: [590, 403, 1] },
      { t: 0.05, d: 0.55, cam: [520, 280, 1.6] },
      { t: 0.1, d: 0.55, cur: [488, 177] },
      { t: 0.75, click: true },
      { t: 0.8, bg: "#tab-per-bg" },
      { t: 0.8, unbg: "#tab-pub-bg" },
      { t: 0.8, hide: "#cu-pub" },
      { t: 0.8, pop: "#cu-per", d: 0.25 },
      { t: 1.0, d: 0.5, cam: [600, 380, 2.0] },
      { t: 1.0, d: 0.5, cur: [722, 409] },
      { t: 1.6, click: true },
      { t: 1.6, press: "#pk-plus" },
      { t: 1.7, hide: "#pk-plus" },
      { t: 1.7, pop: "#pk-inst", d: 0.15 },
      { t: 1.7, d: 1.2, spin: ["#pk-sp", 2] },
      { t: 1.9, d: 0.6, cur: [820, 520] },
      { t: 2.1, d: 0.7, cam: [450, 330, 1.35] },
      { t: 2.9, hide: "#pk-inst" },
      { t: 2.9, pop: "#pk-more", d: 0.15 },
      { t: 2.9, pop: "#cu-side-konte", d: 0.3 },
    ],
    body: () => (
      <>
        <TopBar />
        <Rail sel="custom" />
        <Customize tab="public" konte="none" />
      </>
    ),
  },
  "11": {
    step: [4, "Run setup"],
    cursor: [600, 500],
    ev: [
      { t: 0, d: 0, cam: [450, 330, 1.35] },
      { t: 0.05, d: 0.5, cam: [250, 260, 1.6] },
      { t: 0.1, d: 0.5, cur: [27, 72] },
      { t: 0.65, click: true },
      { t: 0.75, hide: "#cu-wrap" },
      { t: 0.75, show: "#h-wrap" },
      { t: 0.8, d: 0.65, cam: [760, 680, 1.75] },
      { t: 0.85, d: 0.55, cur: [700, 716] },
      { t: 1.45, click: true },
      { t: 1.5, show: "#h-caret" },
      { t: 1.5, pulse: "#h-comp" },
    ],
    body: () => (
      <>
        <TopBar />
        <div className="full" id="cu-wrap">
          <Rail sel="custom" />
          <Customize tab="personal" konte="installed" />
        </div>
        <div className="full off" id="h-wrap">
          <Rail />
          <HomeSide proj={[]} />
          <Home ws />
        </div>
      </>
    ),
  },
  "12": {
    ev: [
      { t: 0, d: 0, cam: [760, 680, 1.75] },
      { t: 0, d: 0, show: "#h-caret" },
      { t: 0.2, off: "#h-ph" },
      { t: 0.2, on: "#h-in" },
      { t: 0.2, d: 0.6, type: "#h-in" },
      { t: 0.2, hide: "#h-wave" },
      { t: 0.2, show: "#h-send" },
      { t: 0.9, show: "#skills" },
      { t: 0.9, pop: "#skills", d: 0.2 },
      { t: 1.0, d: 0.5, cam: [760, 650, 1.6] },
      { t: 1.9, off: "#h-in" },
      { t: 1.9, on: "#h-pick" },
      { t: 1.9, vanish: "#skills", d: 0.12 },
      { t: 2.0, d: 0.4, cam: [760, 690, 1.75] },
      { t: 2.6, press: "#h-send" },
      { t: 2.75, hide: "#h-main" },
      { t: 2.75, show: "#s-main" },
      { t: 2.75, hide: "#sb1" },
      { t: 2.75, show: "#sb2" },
      { t: 2.75, d: 0, cam: [760, 260, 1.45] },
      { t: 2.8, pop: "#s-bubble", d: 0.25 },
      { t: 3.0, pop: "#s-work", d: 0.2 },
      { t: 3.0, d: 0.5, count: ["#s-secs", 0, 1] },
      { t: 3.15, pop: "#s-p1", d: 0.2 },
    ],
    body: () => (
      <>
        <TopBar />
        <Rail />
        <div className="full" id="sb1">
          <HomeSide proj={[]} />
        </div>
        <div className="full off" id="sb2">
          <HomeSide proj={[{ name: "Set up Konte", sel: true, spin: true }]} />
        </div>
        <Home ws typed="$konte" pick="Konte: Setup" />
        <SkillMenu rows={[0, 2]} />
        <div className="full off" id="s-main">
          <SetupChat id="s" stage={0} />
        </div>
      </>
    ),
  },
  "13": {
    ev: [
      { t: 0, d: 0, cam: [740, 300, 1.8] },
      { t: 0, d: 2.5, spin: ["#chat-sp0", 3] },
      { t: 0, d: 2.5, count: ["#s-secs", 11, 47] },
      { t: 0.8, off: "#s-c1-a" },
      { t: 0.8, on: "#s-c1-b" },
      { t: 0.8, pop: "#s-c2", d: 0.18 },
      { t: 1.6, off: "#s-c2-a" },
      { t: 1.6, on: "#s-c2-b" },
      { t: 1.6, pop: "#s-c3", d: 0.18 },
    ],
    body: () => (
      <>
        <TopBar />
        <Rail />
        <HomeSide proj={[{ name: "Set up Konte", sel: true, spin: true }]} />
        <SetupChat id="s" stage={1} />
      </>
    ),
  },
  "14": {
    ev: [
      { t: 0, d: 0, cam: [740, 300, 1.8] },
      { t: 0.1, pop: "#s-reply", d: 0.35 },
      { t: 0.4, d: 0.6, cam: [640, 300, 2.3] },
      { t: 1.0, d: 0.55, wipe: "#s-mark" },
    ],
    body: () => (
      <>
        <TopBar />
        <Rail />
        <HomeSide proj={[{ name: "Set up Konte", sel: true }]} />
        <SetupChat id="s" stage={2} />
      </>
    ),
  },
  "15": {
    cursor: [520, 360],
    ev: [
      { t: 0, d: 0, cam: [640, 300, 2.3] },
      { t: 0.05, d: 0.5, cam: [220, 170, 2.1] },
      { t: 0.1, d: 0.45, cur: [133, 20] },
      { t: 0.6, click: true },
      { t: 0.62, bg: "#file-hl" },
      { t: 0.65, pop: "#file-menu", d: 0.18 },
      { t: 0.8, d: 0.55, cur: [170, 302] },
      { t: 1.3, bg: "#fm-quit" },
      { t: 1.5, click: true },
      { t: 1.55, d: 0.2, dim: ["#blackout", 1] },
      { t: 1.75, hide: "#old" },
      { t: 1.75, show: "#new" },
      { t: 1.75, d: 0, cam: [590, 403, 1] },
      { t: 1.75, d: 0, cur: [780, 560] },
      { t: 1.9, d: 0.35, dim: ["#blackout", 0] },
    ],
    body: () => (
      <>
        <div id="old" className="full">
          <TopBar />
          <Rail />
          <HomeSide proj={[{ name: "Set up Konte", sel: true }]} />
          <SetupChat id="s" stage={3} />
          <FileMenu />
        </div>
        <div id="new" className="full off">
          <TopBar />
          <Rail />
          <HomeSide proj={AFTER_SETUP} />
          <Home id="n" ws konteChip />
        </div>
        <div className="blackout off" id="blackout" />
      </>
    ),
  },
  "16": {
    step: [5, "Check in"],
    cursor: [780, 560],
    ev: [
      { t: 0, d: 0, cam: [590, 403, 1] },
      { t: 0.1, d: 0.6, cam: [760, 640, 1.6] },
      { t: 0.1, d: 0.55, cur: [700, 716] },
      { t: 0.75, click: true },
      { t: 0.8, show: "#h-caret" },
      { t: 0.8, pulse: "#h-comp" },
      { t: 1.0, off: "#h-ph" },
      { t: 1.0, on: "#h-in" },
      { t: 1.0, d: 0.6, type: "#h-in" },
      { t: 1.0, hide: "#h-wave" },
      { t: 1.0, show: "#h-send" },
      { t: 1.7, show: "#skills" },
      { t: 1.7, pop: "#skills", d: 0.2 },
      { t: 1.75, d: 0.5, cam: [760, 610, 1.6] },
      { t: 2.3, unbg: "#sk-0" },
      { t: 2.3, bg: "#sk-1" },
      { t: 2.9, off: "#h-in" },
      { t: 2.9, on: "#h-pick" },
      { t: 2.9, vanish: "#skills", d: 0.12 },
      { t: 2.95, d: 0.4, cam: [760, 690, 1.75] },
      { t: 3.5, press: "#h-send" },
      { t: 3.6, off: "#h-pick" },
      { t: 3.6, on: "#h-ph" },
      { t: 3.6, hide: "#h-caret" },
    ],
    body: () => (
      <>
        <TopBar />
        <Rail />
        <HomeSide proj={AFTER_SETUP} />
        <Home ws konteChip typed="$konte" pick="Konte Checkin" />
        <SkillMenu rows={[0, 1, 2, 3, 4]} />
      </>
    ),
  },
  "17": {
    ev: [
      { t: 0, d: 0, cam: [760, 250, 1.45] },
      { t: 0, pop: "#c-bubble", d: 0.25 },
      { t: 0.2, pop: "#c-work", d: 0.2 },
      { t: 0.2, d: 3.2, count: ["#c-secs", 1, 24] },
      { t: 0, d: 3.5, spin: ["#chat-sp0", 4] },
      { t: 0.45, pop: "#c-p1", d: 0.2 },
      { t: 0.8, pop: "#c-c1", d: 0.2 },
      { t: 0.5, d: 0.8, cam: [760, 300, 1.6] },
      { t: 1.15, pop: "#c-p2", d: 0.2 },
      { t: 1.4, pop: "#c-p3", d: 0.2 },
      { t: 1.6, pop: "#c-p4", d: 0.2 },
      { t: 1.8, pop: "#c-think", d: 0.2 },
      { t: 1.9, d: 0.9, cam: [700, 430, 1.25] },
      { t: 2.2, pop: "#c-q", d: 0.35 },
    ],
    body: () => (
      <>
        <TopBar />
        <Rail />
        <HomeSide proj={[{ name: "Run konte session check-in", sel: true, spin: true }, ...AFTER_SETUP]} bellDot />
        <CheckinChat id="c" />
      </>
    ),
  },
};

export function Shot({ id }: { id: ShotId }) {
  const s = SHOTS[id];
  return (
    <Screen step={s.step} cursor={s.cursor} ev={s.ev}>
      {s.body()}
    </Screen>
  );
}

/** Each shot's clicks and typing runs, read off its events for the sound cues. */
export const cues = (id: ShotId) => ({
  clicks: SHOTS[id].ev.filter((e) => e.click).map((e) => e.t),
  typing: SHOTS[id].ev.filter((e) => e.type).map((e) => [e.t, e.d ?? 0.5] as const),
});
