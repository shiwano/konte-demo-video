import { Animate, type AnimateContext, type AnimateData } from "konte";

type El = JSX.Element;

// ───────────── geometry: the app window, drawn at its native 1202×801 and scaled onto the stage ─────────────

const W = 1920;
const H = 1088;
const WIN = { w: 1202, h: 801, s: 1.25 };
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
  /** Fade-and-rise in, for menus, dialogs and toasts. */
  pop?: string;
  vanish?: string;
  type?: string;
  press?: string;
  pulse?: string;
  y?: readonly [string, number];
  spin?: readonly [string, number];
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
        { boxShadow: "0 0 0 0px rgba(217,119,87,0.65)" },
        { boxShadow: "0 0 0 10px rgba(217,119,87,0)", duration: 0.8, ease: "power2.out", immediateRender: false },
        e.t,
      );
    if (e.y) timeline.to(e.y[0], { y: e.y[1], duration: d, ease }, e.t);
    if (e.spin) timeline.to(e.spin[0], { rotation: 360 * e.spin[1], duration: d, ease: "none" }, e.t);
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
    if (e.bg) timeline.set(e.bg, { backgroundColor: "rgba(0,0,0,0.055)" }, e.t);
    if (e.unbg) timeline.set(e.unbg, { backgroundColor: "rgba(0,0,0,0)" }, e.t);
    if (e.dim) timeline.to(e.dim[0], { autoAlpha: e.dim[1], duration: d, ease: "power2.inOut" }, e.t);
  }
};

// ───────────── icons ─────────────

const ICONS: Record<string, string> = {
  menu: "M4 6h16M4 12h16M4 18h16",
  sidebar: "M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM9 4v16",
  chevL: "M15 18l-6-6 6-6",
  chevR: "M9 18l6-6-6-6",
  chevD: "M6 9l6 6 6-6",
  plus: "M12 5v14M5 12h14",
  search: "M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM20 20l-4-4",
  projects: "M6 4h12M5 7.5h14M5 11h14a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z",
  artifacts: "M9 3h10a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM5 7v13a1 1 0 0 0 1 1h10",
  briefcase: "M4 8h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zM9 8V5h6v3",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  pointer: "M5 4l6 16 2.4-6.6L20 11z",
  gear: "M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1",
  clock: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 7v5l3 2",
  globe: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  help: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4M12 16.5h.01",
  upCircle: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 16V8M8.5 11.5L12 8l3.5 3.5",
  devices: "M4 5h11a1 1 0 0 1 1 1v9H3V6a1 1 0 0 1 1-1zM2 18h15M19 9h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z",
  ticket: "M3 8a2 2 0 0 0 0 4v4h18v-4a2 2 0 0 0 0-4V5H3zM10 8h4M10 12h4",
  doc: "M6 3h9l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM9 12h6M9 16h4",
  info: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 11v5M12 8h.01",
  key: "M8 12a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM11 13l8-8M16 8l3 3",
  logout: "M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4M16 17l5-5-5-5M21 12H9",
  user: "M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM4 21a8 8 0 0 1 16 0",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  card: "M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM2 10h20",
  brain: "M12 5a3.5 3.5 0 0 0-6.5 1.5A3.5 3.5 0 0 0 4 13a3.5 3.5 0 0 0 4 6 3 3 0 0 0 4 0zM12 5a3.5 3.5 0 0 1 6.5 1.5A3.5 3.5 0 0 1 20 13a3.5 3.5 0 0 1-4 6 3 3 0 0 1-4 0z",
  palette: "M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-1.5-1-2.5 1-1.5 2-1.5h2a4 4 0 0 0 4-4c0-4.5-4-8-9-8zM8 10h.01M12 7h.01M16 10h.01",
  reflect: "M4 14h16M7 18h10M8 10a4 4 0 0 1 8 0",
  moon: "M20 14A8 8 0 1 1 10 4a6.5 6.5 0 0 0 10 10z",
  code: "M9 7l-5 5 5 5M15 7l5 5-5 5",
  monitor: "M4 4h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM8 20h8M12 16v4",
  plug: "M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4",
  wrench: "M14.5 6.5a4 4 0 0 0-5.5 5L3.5 17l3.5 3.5L12.5 15a4 4 0 0 0 5-5.5L15 12l-3-3z",
  skills: "M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM9 8h6M9 12h6M9 16h3",
  connectors: "M4 4h6v6H4zM4 14h6v6H4zM14 14h6v6h-6zM17 3l4 4-4 4-4-4z",
  folder: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  terminal: "M5 8l4 4-4 4M12 16h7",
  mic: "M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21",
  laptop: "M5 5h14a1 1 0 0 1 1 1v10H4V6a1 1 0 0 1 1-1zM2 19h20",
  x: "M6 6l12 12M18 6L6 18",
  check: "M5 12.5l4.5 4.5L19 7.5",
  books: "M5 4h3v16H5zM10 4h3v16h-3zM15 5l3-1 3 15-3 1z",
  branch: "M6 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM6 16a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM18 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM6 8v8M18 10c0 4-6 3-12 6",
  upload: "M12 16V4M7 9l5-5 5 5M4 20h16",
  chat: "M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10l-5 4V6a1 1 0 0 1 1-1z",
  arrowR: "M5 12h14M13 6l6 6-6 6",
  arrowUR: "M7 17L17 7M8 7h9v9",
  filter: "M4 7h16M7 12h10M10 17h4",
  enter: "M20 5v7a3 3 0 0 1-3 3H5M9 11l-4 4 4 4",
  bug: "M9 7a3 3 0 0 1 6 0M8 9h8v6a4 4 0 0 1-8 0zM4 12h4M16 12h4M5 7l3 2M19 7l-3 2M5 19l3-2.5M19 19l-3-2.5",
  sessions: "M5 5h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H9l-4 3V6a1 1 0 0 1 1-1zM15 15a3 3 0 1 1 6 0 3 3 0 0 1-6 0zM20.5 17.5L22 19",
  list: "M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM8 9h8M8 12h8M8 15h5",
  inbox: "M4 4h16v16H4zM4 14h5l1 2h4l1-2h5M12 7v5M9.5 9.5L12 12l2.5-2.5",
  refresh: "M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5",
  home: "M3 11l9-7 9 7M5 9.5V20h14V9.5",
  download: "M12 4v11M7 10l5 5 5-5M4 20h16",
  picture: "M4 4h16v16H4zM4 16l5-5 5 5 2-2 4 4",
  music: "M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  video: "M4 5h16v14H4zM10 9l5 3-5 3z",
  pin: "M9 4h6l-1 6 3 3H7l3-3zM12 13v7",
};

function I({ n, s = 16, c, w = 1.6, fill }: { n: string; s?: number; c?: string; w?: number; fill?: string }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={fill ?? "none"} stroke={c ?? "currentColor"} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", display: "block" }}>
      <path d={ICONS[n]} />
    </svg>
  );
}

function Critter({ s = 36 }: { s?: number }) {
  return (
    <svg width={s} height={s * 0.75} viewBox="0 0 32 24" shapeRendering="crispEdges" style={{ display: "block" }}>
      <g fill="#d97757">
        <rect x="5" y="3" width="22" height="13" />
        <rect x="0" y="8" width="5" height="4" />
        <rect x="27" y="8" width="5" height="4" />
        <rect x="7" y="16" width="3" height="6" />
        <rect x="12" y="16" width="3" height="6" />
        <rect x="17" y="16" width="3" height="6" />
        <rect x="22" y="16" width="3" height="6" />
      </g>
      <rect x="10" y="7" width="3" height="3" fill="#2b1810" />
      <rect x="19" y="7" width="3" height="3" fill="#2b1810" />
    </svg>
  );
}

function Spinner({ id, s = 14, c = "#2f6feb" }: { id?: string; s?: number; c?: string }) {
  return (
    <svg id={id} width={s} height={s} viewBox="0 0 24 24" style={{ flex: "none", display: "block" }}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="#d8dbe2" strokeWidth="3" />
      <path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ───────────── chrome shared by every shot ─────────────

const CSS = `
.scr{position:absolute;inset:0;overflow:hidden;background:radial-gradient(120% 90% at 50% 40%,#f4f1ea 0%,#e6e0d4 60%,#d9d1c3 100%);font-family:"Inter",system-ui,sans-serif;color:#1f1f1e;-webkit-font-smoothing:antialiased;}
.cam{position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0;}
.win{position:absolute;left:${WX}px;top:${WY}px;width:${WIN.w}px;height:${WIN.h}px;transform:scale(${WIN.s});transform-origin:0 0;background:#fff;border:1px solid #c9c9cc;border-radius:8px;overflow:hidden;box-shadow:0 30px 80px rgba(60,45,25,.25),0 6px 18px rgba(60,45,25,.12);font-size:14px;}
.off{visibility:hidden;opacity:0;}
.abs{position:absolute;}
.cursor{position:absolute;left:0;top:0;z-index:80;pointer-events:none;}
.cursor-ring{position:absolute;left:-24px;top:-24px;width:48px;height:48px;border-radius:50%;border:3px solid rgba(217,119,87,.95);opacity:0;}
.step{position:absolute;left:64px;top:44px;z-index:90;display:flex;align-items:center;gap:20px;padding:14px 36px 14px 16px;border-radius:999px;background:rgba(31,30,29,.94);box-shadow:0 14px 40px rgba(40,30,20,.35);color:#faf9f5;font-size:44px;font-weight:700;letter-spacing:-.015em;}
.step-n{display:flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:50%;background:#d97757;color:#fff;font-size:34px;font-weight:800;}
.blackout{position:absolute;inset:0;z-index:70;background:#0c0c0c;}

.side{position:absolute;left:0;top:0;bottom:0;width:289px;background:#f8f8f7;border-right:1px solid #e6e6e4;}
.side-top{position:absolute;left:18px;top:8px;right:10px;height:22px;display:flex;align-items:center;gap:14px;color:#3d3d3a;}
.seg{margin-left:auto;display:flex;background:#ececea;border-radius:7px;padding:2px;gap:2px;}
.seg span{display:flex;width:30px;height:24px;align-items:center;justify-content:center;border-radius:5px;}
.seg span.on{background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.1);}
.nav{position:absolute;left:9px;right:11px;top:44px;display:flex;flex-direction:column;gap:2px;}
.nav-i{display:flex;align-items:center;gap:12px;height:32px;padding:0 10px;border-radius:7px;color:#1f1f1e;font-size:14px;}
.nav-i.sel{background:#e6e6e3;}
.beta{font-size:11px;border:1px solid #d6d6d3;border-radius:999px;padding:0 6px;line-height:18px;margin-left:-2px;}
.sess{position:absolute;left:9px;right:11px;top:268px;display:flex;flex-direction:column;}
.grp{display:flex;align-items:center;gap:6px;height:36px;padding:0 10px;color:#6b6b66;font-size:12px;font-weight:500;}
.si{display:flex;align-items:center;height:34px;padding:0 10px;border-radius:7px;font-size:14px;color:#1f1f1e;white-space:nowrap;overflow:hidden;}
.si.sel{background:#e6e6e3;}
.acct{position:absolute;left:0;right:0;bottom:0;height:50px;border-top:1px solid #e6e6e4;display:flex;align-items:center;gap:9px;padding:0 16px 0 17px;font-size:14px;}
.avatar{width:20px;height:20px;border-radius:50%;background:#e3e2de;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:#3d3d3a;}
.plan{color:#6b6b66;font-size:13px;}

.main{position:absolute;left:289px;top:0;right:0;bottom:0;background:#fff;}
.titlebar{position:absolute;left:19px;right:0;top:0;height:36px;display:flex;align-items:center;color:#6b6b66;font-size:14px;}
.title-b{color:#1f1f1e;display:flex;align-items:center;gap:6px;}
.tb-r{margin-left:auto;display:flex;align-items:center;gap:20px;padding-right:20px;color:#3d3d3a;}
.tb-r .on{background:#e9e9e7;border-radius:5px;padding:3px;}
.wctl{display:flex;gap:30px;margin-left:16px;color:#3d3d3a;}
.composer{position:absolute;height:44px;border:1px solid #d9d9d6;border-radius:13px;background:#fff;display:flex;align-items:center;gap:12px;padding:0 14px;box-shadow:0 1px 3px rgba(0,0,0,.05);}
.ph{color:#8b8b86;font-size:15px;}
.cin{font-size:15px;color:#1f1f1e;white-space:pre;}
.cin.cmd{color:#2b63d9;}
.caret{display:inline-block;width:1.5px;height:18px;background:#1f1f1e;vertical-align:-3px;margin-left:1px;}
.crow{position:absolute;display:flex;align-items:center;gap:6px;font-size:13px;color:#3d3d3a;}
.chip{display:flex;align-items:center;gap:6px;padding:2px 4px;border-radius:6px;}
.mute{color:#8b8b86;}
.critter{position:absolute;}

.dimmer{position:absolute;inset:0;background:rgba(20,20,19,.38);}
.modal{position:absolute;background:#fff;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.25),0 0 0 1px rgba(0,0,0,.05);}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:28px;padding:0 10px;border-radius:7px;font-size:14px;font-weight:500;}
.btn.dark{background:#1f1f1e;color:#fff;}
.btn.ghost{background:#f1f1ef;color:#1f1f1e;}
.btn.dis{background:#f4f4f2;color:#b6b6b1;}
.btn.line{border:1px solid #d9d9d6;background:#fff;}

.menu{position:absolute;background:#fff;border-radius:12px;box-shadow:0 12px 36px rgba(0,0,0,.16),0 0 0 1px rgba(0,0,0,.06);padding:6px 0;}
.mi{display:flex;align-items:center;gap:12px;height:28px;padding:0 16px;margin:0 6px;border-radius:6px;font-size:14px;color:#1f1f1e;white-space:nowrap;}
.mi.hl{background:#f0f0ee;}
.mi .k{margin-left:auto;color:#8b8b86;font-size:13px;}
.msep{height:1px;background:#ececea;margin:5px 16px;}

.set{position:absolute;left:89px;top:36px;width:1024px;height:728px;background:#fff;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.22),0 0 0 1px rgba(0,0,0,.05);overflow:hidden;}
.set-h{position:absolute;left:0;right:0;top:0;height:44px;border-bottom:1px solid #ececea;display:flex;align-items:center;padding:0 16px;font-size:15px;font-weight:500;}
.set-nav{position:absolute;left:0;top:44px;bottom:0;width:211px;border-right:1px solid #ececea;overflow:hidden;}
.set-search{position:absolute;left:16px;top:16px;width:178px;height:28px;border:1px solid #d9d9d6;border-radius:8px;display:flex;align-items:center;gap:10px;padding:0 10px;color:#8b8b86;font-size:14px;z-index:2;background:#fff;}
.set-list{position:absolute;left:16px;right:15px;top:44px;}
.set-list .grp{padding:0;height:52px;align-items:flex-end;padding-bottom:12px;box-sizing:border-box;}
.set-i{display:flex;align-items:center;gap:12px;height:33px;padding:0 12px;border-radius:7px;font-size:14px;}
.set-i.sel{background:#e9e9e7;}
.set-body{position:absolute;left:212px;top:44px;right:0;bottom:0;}
.tog{width:36px;height:20px;border-radius:999px;background:#2f6feb;position:relative;}
.tog::after{content:"";position:absolute;right:2px;top:2px;width:16px;height:16px;border-radius:50%;background:#fff;}
.seg2{display:flex;background:#f1f1ef;border-radius:8px;padding:2px;}
.seg2 span{padding:3px 11px;border-radius:6px;font-size:14px;}
.seg2 span.on{background:#fff;box-shadow:0 0 0 1px #e0e0dd;}
.field{border:1px solid #d9d9d6;border-radius:8px;display:flex;align-items:center;gap:10px;padding:0 10px;font-size:14px;}
.toast{position:absolute;left:825px;top:740px;width:360px;height:44px;background:#fff;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.16),0 0 0 1px rgba(0,0,0,.06);display:flex;align-items:center;gap:12px;padding:0 16px;font-size:14px;font-weight:500;}

.xp{position:absolute;background:#fff;border:1px solid #b7b7b7;box-shadow:0 18px 50px rgba(0,0,0,.25);font-family:"Inter",system-ui,sans-serif;font-size:13px;color:#1b1b1b;}
.xp-row{display:flex;align-items:center;height:28px;}
.xp-sel{background:#cce8ff;}

.sv-meta{position:absolute;left:58px;top:68px;color:#8b8b86;font-size:13px;}
.sv-meta u{text-decoration:underline;text-underline-offset:2px;}
.bubble{position:absolute;right:345px;padding:12px 18px;background:#f1f1ef;border-radius:12px;font-size:15px;color:#2b63d9;}
.todo{position:absolute;left:58px;width:509px;border:1px solid #e3e3e0;border-radius:10px;padding:14px 16px;display:flex;flex-direction:column;gap:8px;font-size:14px;}
.td{display:flex;align-items:center;gap:8px;height:20px;}
.dot{width:14px;height:14px;border-radius:50%;flex:none;}
.dot.done{background:#5b5b57;display:flex;align-items:center;justify-content:center;}
.dot.wait{border:1.5px dashed #9b9b96;}
.td.done span{color:#6b6b66;}
.status{position:absolute;left:62px;display:flex;align-items:center;gap:10px;color:#6b6b66;font-size:15px;}
.reply{position:absolute;left:58px;width:520px;font-size:15px;line-height:1.6;color:#1f1f1e;}
.reply code{font-family:"JetBrains Mono",monospace;font-size:13.5px;background:#f1f1ef;border-radius:4px;padding:1px 5px;}
.mark{background-image:linear-gradient(rgba(217,119,87,.25),rgba(217,119,87,.25));background-repeat:no-repeat;background-size:100% 100%;}
.rp{position:absolute;left:625px;width:280px;border:1px solid #e3e3e0;border-radius:12px;padding:0 18px;font-size:14px;}
.rp-row{display:flex;align-items:center;gap:10px;height:34px;white-space:nowrap;}
`;

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

// ───────────── the Claude Code desktop app ─────────────

const RECENT = [
  "Fix flaky login test",
  "Refactor the billing module",
  "Draft the release notes",
  "Add a dark mode toggle",
  "Investigate the slow build",
  "Write the API docs",
  "Clean up old branches",
  "Review the onboarding flow",
  "Update dependencies",
  "Prototype the search page",
];

type Ws = { sessions: string[]; sel?: string };

function Sidebar({ ws, newSel = true }: { ws?: Ws; newSel?: boolean }) {
  return (
    <div className="side">
      <div className="side-top">
        <I n="menu" />
        <I n="sidebar" />
        <I n="chevL" />
        <span style={{ color: ws ? "#3d3d3a" : "#b6b6b1" }}>
          <I n="chevR" />
        </span>
        <div className="seg">
          <span className="on">
            <I n="sessions" />
          </span>
          <span>
            <I n="code" />
          </span>
        </div>
      </div>
      <div className="nav">
        <div className={newSel ? "nav-i sel" : "nav-i"} id="nav-new">
          <I n="plus" />
          New
        </div>
        <div className="nav-i">
          <I n="search" />
          Search
        </div>
        <div className="nav-i">
          <I n="projects" />
          Projects <span className="beta">Beta</span>
        </div>
        <div className="nav-i">
          <I n="artifacts" />
          Artifacts
        </div>
        <div className="nav-i">
          <I n="briefcase" />
          Customize
        </div>
        <div className="nav-i">
          <I n="more" w={3} />
          More
        </div>
      </div>
      <div className="sess">
        <div className="grp">
          my-app <I n="pointer" s={13} /> <span style={{ fontSize: "9px" }}>▶</span>
        </div>
        {ws && (
          <>
            <div className="grp" id="ws-head" style={{ borderRadius: "7px" }}>
              konte-workspace <span style={{ fontSize: "9px" }}>▼</span>
              <span className="off" id="ws-plus" style={{ marginLeft: "auto", color: "#1f1f1e" }}>
                <I n="plus" s={16} />
              </span>
            </div>
            {ws.sessions.map((s) => (
              <div className={s === ws.sel ? "si sel" : "si"}>{s}</div>
            ))}
            <div style={{ height: "14px" }} />
          </>
        )}
        <div className="grp">
          Remote Control <I n="pointer" s={13} /> <span style={{ fontSize: "9px" }}>▼</span>
        </div>
        {RECENT.map((s) => (
          <div className="si">{s}</div>
        ))}
      </div>
      <div className="acct" style={{ background: "#f8f8f7" }}>
        <span className="avatar">A</span>
        Alex <span className="plan">· Max</span>
        <span className="mute">
          <I n="chevD" s={13} />
        </span>
        <span style={{ marginLeft: "auto", color: "#3d3d3a" }}>
          <I n="bug" s={18} />
        </span>
      </div>
    </div>
  );
}

function WinCtl() {
  return (
    <div className="wctl">
      <svg width="12" height="12" viewBox="0 0 12 12">
        <path d="M1 6h10" stroke="#3d3d3a" strokeWidth="1" />
      </svg>
      <svg width="12" height="12" viewBox="0 0 12 12">
        <rect x="1.5" y="1.5" width="9" height="9" fill="none" stroke="#3d3d3a" strokeWidth="1" />
      </svg>
      <svg width="12" height="12" viewBox="0 0 12 12">
        <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="#3d3d3a" strokeWidth="1" />
      </svg>
    </div>
  );
}

function TitleBar({ title, folder = true, session = false }: { title?: string; folder?: boolean; session?: boolean }) {
  return (
    <div className="titlebar">
      {title ? (
        <span className="title-b">
          {title} <I n="chevD" s={14} />
        </span>
      ) : (
        "New session"
      )}
      <div className="tb-r">
        {session && (
          <span className="on">
            <I n="list" s={17} />
          </span>
        )}
        <I n="terminal" s={17} />
        {session && <I n="inbox" s={17} />}
        <I n="globe" s={17} />
        {folder && <I n="folder" s={17} />}
        {session && <I n="more" w={3} s={17} />}
        <WinCtl />
      </div>
    </div>
  );
}

/** The empty New session page; `folder` is what the folder chip reads, `id` prefixes the parts a shot animates. */
function Home({ folder, folderNext, id = "h", input, inputCmd }: { folder?: string; folderNext?: string; id?: string; input?: string; inputCmd?: string }) {
  return (
    <div className="main" id={`${id}-main`}>
      <TitleBar folder={!!folder} />
      <div className="critter" style={{ left: "797px", top: "689px" }}>
        <Critter />
      </div>
      <div className="composer" id={`${id}-comp`} style={{ left: "71px", top: "715px", width: "770px" }}>
        <I n="plus" s={18} />
        {input !== undefined && (
          <span className="cin" id={`${id}-in`} style={{ display: "none" }}>
            {input}
          </span>
        )}
        {inputCmd !== undefined && (
          <span className="cin cmd" id={`${id}-cmd`} style={{ display: "none" }}>
            {inputCmd}
          </span>
        )}
        <span className="caret off" id={`${id}-caret`} />
        <span className="ph" id={`${id}-ph`}>
          Describe a task or ask a question
        </span>
        <span style={{ marginLeft: "auto", display: "flex", gap: "16px", alignItems: "center" }}>
          {input !== undefined && (
            <span className="off" id={`${id}-enter`}>
              <I n="enter" s={18} />
            </span>
          )}
          <I n="mic" s={18} />
        </span>
      </div>
      <div className="crow" style={{ left: "87px", top: "771px" }}>
        <span className="chip">
          <I n="laptop" s={15} /> This computer
        </span>
        <span className="chip" id={`${id}-folder`} style={{ marginLeft: "6px" }}>
          <I n="folder" s={15} />
          <span id={`${id}-folder-a`}>{folder ?? "Choose..."}</span>
          {folderNext && (
            <span id={`${id}-folder-b`} style={{ display: "none" }}>
              {folderNext}
            </span>
          )}
        </span>
        <span style={{ marginLeft: "10px" }}>Auto</span>
      </div>
      <div className="crow" style={{ left: "689px", top: "771px" }}>
        Opus 5.5 <span className="mute" style={{ marginLeft: "4px" }}>
          Medium
        </span>
        <span style={{ marginLeft: "24px" }}>
          <Spinner s={15} />
        </span>
      </div>
    </div>
  );
}

const TODO_SETUP = ["Check workspace directory", "Download and run setup script", "Hand off restart steps"];
const TODO_CHECKIN = ["Read house rules and current video", "Read video status and feedback", "Deliver check-in"];

/** A running session: the user's slash command, the agent's checklist and the environment panel. */
type Todo = "wait" | "run" | "done";

function Session({
  id,
  title,
  cmd,
  todos,
  state,
  meta,
  fresh,
  children,
}: {
  id: string;
  title: string;
  cmd: string;
  todos: string[];
  state: Todo[];
  meta: string;
  fresh?: boolean;
  children?: El | El[] | false;
}) {
  const off = (on: boolean, cls: string) => (on ? cls : `${cls} off`);
  return (
    <div className="main" id={`${id}-main`}>
      <TitleBar title={title} session />
      <div className="sv-meta">
        {meta} · <u>Save as environment</u>
      </div>
      <div className={off(!fresh, "bubble")} id={`${id}-bubble`} style={{ top: "108px" }}>
        {cmd}
      </div>
      <div className={off(!fresh, "todo")} id={`${id}-todo`} style={{ top: "211px" }}>
        {todos.map((s, i) => (
          <div className="td" id={`${id}-td${i}`}>
            <span style={{ position: "relative", width: "14px", height: "14px" }}>
              <span className={off(state[i] === "wait", "dot wait abs")} id={`${id}-w${i}`} style={{ left: 0, top: 0 }} />
              <span className={off(state[i] === "run", "abs")} id={`${id}-r${i}`} style={{ left: 0, top: 0 }}>
                <Spinner id={`${id}-sp${i}`} />
              </span>
              <span className={off(state[i] === "done", "dot done abs")} id={`${id}-d${i}`} style={{ left: 0, top: 0 }}>
                <I n="check" s={10} c="#fff" w={3} />
              </span>
            </span>
            <span>{s}</span>
          </div>
        ))}
      </div>
      <div className="rp" style={{ top: "48px", height: "150px", paddingTop: "10px" }}>
        <div className="rp-row" style={{ fontWeight: 600, fontSize: "13px" }}>
          Environment <span style={{ fontSize: "9px" }}>▼</span>
        </div>
        <div className="rp-row">
          <I n="laptop" s={16} /> This computer <span style={{ marginLeft: "auto", textDecoration: "underline", fontSize: "13px" }}>Save</span>
        </div>
        <div className="rp-row">
          <I n="folder" s={16} /> konte-workspace <span className="mute">· ~\Documents</span>
        </div>
        <div className="rp-row">
          <I n="pointer" s={16} /> Remote Control <span style={{ marginLeft: "auto" }} className="tog" />
        </div>
      </div>
      <div className="rp" style={{ top: "206px", height: "50px" }}>
        <div className="rp-row" style={{ height: "48px", fontWeight: 600, fontSize: "13px" }}>
          Context <span style={{ fontSize: "9px" }}>▶</span>
          <span className="mute" style={{ marginLeft: "auto", fontWeight: 400 }}>
            7%
          </span>
          <span style={{ width: "20px", height: "6px", borderRadius: "3px", background: "#e3e3e0", position: "relative" }}>
            <span style={{ position: "absolute", left: 0, top: 0, width: "6px", height: "6px", borderRadius: "3px", background: "#2f6feb" }} />
          </span>
        </div>
      </div>
      {children}
      <div className="composer" style={{ left: "31px", top: "715px", width: "563px" }}>
        <I n="plus" s={18} />
        <span className="ph">Enter to send, Ctrl+Enter to queue for later</span>
        <span style={{ marginLeft: "auto", display: "flex", gap: "20px", alignItems: "center" }}>
          <span style={{ width: "11px", height: "11px", background: "#1f1f1e", borderRadius: "2px" }} />
          <I n="mic" s={18} />
        </span>
      </div>
      <div className="crow" style={{ left: "48px", top: "771px" }}>
        Auto
      </div>
      <div className="crow" style={{ left: "442px", top: "771px" }}>
        Opus 5.5 <span className="mute" style={{ marginLeft: "4px" }}>
          Medium
        </span>
        <span style={{ marginLeft: "24px" }}>
          <Spinner s={15} />
        </span>
      </div>
    </div>
  );
}

function Status({ id, top, label, secs, hidden }: { id: string; top: number; label: string; secs: number; hidden?: boolean }) {
  return (
    <div className={hidden ? "status off" : "status"} id={id} style={{ top: `${top}px` }}>
      <svg width="14" height="14" viewBox="0 0 14 14" id={`${id}-dots`}>
        <g fill="#d97757">
          <rect x="1" y="1" width="3" height="3" />
          <rect x="10" y="1" width="3" height="3" />
          <rect x="1" y="10" width="3" height="3" />
          <rect x="10" y="10" width="3" height="3" />
        </g>
      </svg>
      {label} <span id={`${id}-secs`}>{secs}s</span> <span style={{ fontSize: "9px" }}>▶</span>
    </div>
  );
}

// ───────────── overlays ─────────────

function AccountMenu() {
  const row = (n: string, s: string, k?: string, id?: string) => (
    <div className="mi" id={id}>
      <I n={n} s={16} />
      {s}
      {k && <span className="k">{k}</span>}
    </div>
  );
  return (
    <div className="menu off" id="acct-menu" style={{ left: "9px", top: "382px", width: "272px", transformOrigin: "0% 100%" }}>
      <div style={{ padding: "6px 16px 8px", fontSize: "13px", color: "#3d3d3a" }}>you@example.com</div>
      <div className="mi" id="mi-settings">
        <I n="gear" s={16} />
        Settings
        <span className="k">Ctrl+,</span>
      </div>
      {row("clock", "Usage")}
      {row("globe", "Language")}
      {row("help", "Get help")}
      <div className="msep" />
      {row("upCircle", "Upgrade plan")}
      {row("devices", "Get apps and extensions")}
      {row("ticket", "Share guest passes")}
      {row("doc", "View changelog")}
      <div className="mi">
        <I n="info" s={16} />
        Learn more
        <span className="k">
          <I n="chevR" s={14} />
        </span>
      </div>
      <div className="msep" />
      <div className="mi">
        <I n="key" s={16} />
        Get API keys
        <span className="k">
          <I n="arrowUR" s={14} />
        </span>
      </div>
      <div className="msep" />
      {row("logout", "Log out")}
    </div>
  );
}

const SET_NAV: ([string, string] | string)[] = [
  "Preferences",
  ["gear", "General"],
  ["user", "Account"],
  ["shield", "Privacy"],
  ["card", "Billing"],
  ["clock", "Usage"],
  ["briefcase", "Capabilities"],
  ["brain", "Memory"],
  ["palette", "Design systems"],
  ["reflect", "Reflect"],
  ["moon", "Time and focus"],
  ["code", "Claude Code"],
  ["pointer", "Claude in Chrome"],
  "This computer",
  ["monitor", "System"],
  ["plug", "Extensions"],
  ["wrench", "Developer"],
  "Customize",
  ["skills", "Skills"],
  ["connectors", "Connectors"],
  ["plug", "Plugins"],
  "Platform",
  ["key", "API keys"],
];

function SettingsNav({ sel, scrolled }: { sel: string; scrolled?: boolean }) {
  return (
    <div className="set-nav">
      <div className="set-search">
        <I n="search" s={16} /> Search
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "56px", background: "#fff", zIndex: 1 }} />
      <div className="set-list" id="set-list" style={scrolled ? { transform: "translateY(-211px)" } : undefined}>
        {SET_NAV.map((e) =>
          typeof e === "string" ? (
            <div className="grp">{e}</div>
          ) : (
            <div className={e[1] === sel ? "set-i sel" : "set-i"} id={`nav-${e[1].toLowerCase().replace(/ /g, "-")}`}>
              <I n={e[0]} s={17} />
              {e[1]}
              {e[1] === "API keys" && (
                <span style={{ marginLeft: "auto" }}>
                  <I n="arrowUR" s={16} />
                </span>
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function SettingsGeneral() {
  const row = (title: string, desc: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: "40px", padding: "14px 0", borderBottom: "1px solid #f0f0ee" }}>
      <div>
        <div style={{ fontSize: "14px", marginBottom: "4px" }}>{title}</div>
        <div className="mute" style={{ fontSize: "13px", lineHeight: 1.5 }}>
          {desc}
        </div>
      </div>
      <span className="tog" style={{ flex: "none" }} />
    </div>
  );
  return (
    <div style={{ position: "absolute", left: "16px", right: "26px", top: "16px" }}>
      <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "12px" }}>General</div>
      {row("Classify session states", "Allow Claude to automatically classify sessions as blocked, ready for review, or done. Classifying sessions counts towards your plan usage.")}
      {row("Switch models when a message is flagged", "When safeguards flag a message, automatically switch to a different model to keep chatting. When off, your session will pause instead.")}
      <div style={{ fontSize: "15px", fontWeight: 600, margin: "40px 0 16px" }}>Code appearance</div>
      <div style={{ display: "flex", gap: "16px" }}>
        <div style={{ flex: 1 }}>
          <div className="field" style={{ height: "26px", marginBottom: "14px" }}>
            Claude Light <span style={{ marginLeft: "auto" }}><I n="chevD" s={14} /></span>
          </div>
          <div style={{ height: "92px", border: "1px solid #ececea", borderRadius: "6px", fontFamily: "JetBrains Mono, monospace", fontSize: "12px", padding: "8px 14px", lineHeight: 1.6 }}>
            <div>function greet(name: string) {"{"}</div>
            <div style={{ background: "#fde7e7" }}>-   return "Hello, " + name;</div>
            <div style={{ background: "#e6f4e6" }}>+   return `Hello, ${"${name}"}!`;</div>
            <div>{"}"}</div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div className="field" style={{ height: "26px", marginBottom: "14px" }}>
            Claude Dark <span style={{ marginLeft: "auto" }}><I n="chevD" s={14} /></span>
          </div>
          <div style={{ height: "92px", borderRadius: "6px", background: "#1f1f1e", color: "#e8e8e6", fontFamily: "JetBrains Mono, monospace", fontSize: "12px", padding: "8px 14px", lineHeight: 1.6 }}>
            <div>function greet(name: string) {"{"}</div>
            <div style={{ background: "#5a2626" }}>-   return "Hello, " + name;</div>
            <div style={{ background: "#2b4f2b" }}>+   return `Hello, ${"${name}"}!`;</div>
            <div>{"}"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PluginsHead({ discover }: { discover?: boolean }) {
  return (
    <div style={{ position: "absolute", left: "20px", right: "20px", top: "16px", height: "30px", display: "flex", alignItems: "center", gap: "16px" }}>
      <span style={{ fontSize: "21px", fontWeight: 500 }}>Plugins</span>
      <span className="seg2">
        <span className={discover ? "" : "on"}>Yours</span>
        <span className={discover ? "on" : ""}>Discover</span>
      </span>
      <span className="field" style={{ marginLeft: "auto", width: discover ? "232px" : "232px", height: "28px", color: "#8b8b86" }}>
        <I n="search" s={15} /> Search
      </span>
      {discover && (
        <span style={{ color: "#2f6feb" }}>
          <I n="filter" s={18} />
        </span>
      )}
      <span className="btn dark" id="btn-add" style={{ height: "28px" }}>
        <I n="plus" s={15} c="#fff" w={2} /> Add <I n="chevD" s={14} c="#fff" />
      </span>
    </div>
  );
}

function PluginsEmpty() {
  return (
    <>
      <PluginsHead />
      <div style={{ position: "absolute", left: "20px", right: "20px", top: "60px", height: "124px", background: "#f4f4f2", borderRadius: "10px", padding: "18px 16px" }}>
        <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "8px" }}>Add your first plugins</div>
        <div className="mute" style={{ fontSize: "14px", marginBottom: "14px" }}>
          Give Claude role-level expertise with plugins. Add them from Discover.
        </div>
        <span className="btn dark">Discover plugins</span>
        <svg width="50" height="56" viewBox="0 0 50 56" style={{ position: "absolute", right: "46px", top: "34px" }} fill="none" stroke="#1f1f1e" strokeWidth="2">
          <path d="M8 4h34v14H34v8h8v14H34v12H16V40H8V26h8v-8H8z" />
        </svg>
      </div>
      <div style={{ position: "absolute", left: "20px", right: "20px", top: "212px", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "15px", fontWeight: 500 }}>In this project</span>
        <span style={{ fontSize: "11px", background: "#f1f1ef", borderRadius: "999px", padding: "1px 7px" }}>0</span>
        <span className="btn line" style={{ marginLeft: "auto", height: "34px", fontSize: "12px" }}>
          <I n="folder" s={15} /> konte-workspace
        </span>
      </div>
      <div style={{ position: "absolute", left: "20px", top: "258px", display: "flex", alignItems: "center", gap: "16px", color: "#3d3d3a" }}>
        <span style={{ width: "34px", height: "34px", border: "1px solid #e3e3e0", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <I n="folder" s={17} />
        </span>
        No plugins installed for this project yet.
      </div>
    </>
  );
}

function PluginsKonte({ installed }: { installed?: boolean }) {
  return (
    <>
      <PluginsHead discover />
      <div style={{ position: "absolute", left: "20px", right: "76px", top: "64px", height: "44px", display: "flex", alignItems: "center", gap: "16px" }}>
        <span style={{ width: "36px", height: "36px", border: "1px solid #e3e3e0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <I n="plug" s={18} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "3px" }}>Konte</div>
          <div className="mute" style={{ fontSize: "13px", whiteSpace: "nowrap", overflow: "hidden", position: "relative", height: "18px" }}>
            <span id="pk-desc-a" className={installed ? "abs off" : "abs"} style={{ left: 0, top: 0 }}>
              by shiwano · Install, bootstrap and upgrade konte, the agent-operated AI video productio...
            </span>
            <span id="pk-desc-b" className={installed ? "abs" : "abs off"} style={{ left: 0, top: 0 }}>
              by shiwano · v0.1.1 · Setup and upgrade konte, the agent-operated AI video production ...
            </span>
          </div>
        </div>
        <span style={{ position: "relative", width: "80px", height: "28px" }}>
          <span className={installed ? "btn ghost abs off" : "btn ghost abs"} id="pk-add" style={{ right: 0, top: 0, paddingRight: "6px" }}>
            Add <span style={{ width: "1px", height: "16px", background: "#d6d6d3", margin: "0 2px" }} />
            <I n="chevD" s={14} />
          </span>
          <span className={installed ? "btn abs" : "btn abs off"} id="pk-added" style={{ right: 0, top: 0, border: "1px solid #ececea", color: "#9b9b96" }}>
            <I n="check" s={15} /> Added
          </span>
        </span>
        <span className={installed ? undefined : "off"} id="pk-more" style={{ position: "absolute", right: "-44px" }}>
          <I n="more" w={3} s={18} />
        </span>
      </div>
    </>
  );
}

type SetView = "general" | "empty" | "konte" | "installed";

function Settings({ view, sel, id = "set" }: { view: SetView; sel: string; id?: string }) {
  return (
    <div className="set" id={id}>
      <div className="set-h">
        Settings
        <span style={{ marginLeft: "auto" }} id="set-x">
          <I n="x" s={18} />
        </span>
      </div>
      <SettingsNav sel={sel} scrolled={view !== "general"} />
      <div className="set-body">
        {view === "general" && (
          <>
            <div id="sv-general" className="abs" style={{ inset: 0 }}>
              <SettingsGeneral />
            </div>
            <div id="sv-plugins" className="abs off" style={{ inset: 0, background: "#fff" }}>
              <PluginsEmpty />
            </div>
          </>
        )}
        {view === "empty" && <PluginsEmpty />}
        {view === "konte" && <PluginsKonte />}
        {view === "installed" && <PluginsKonte installed />}
      </div>
    </div>
  );
}

function AddMenu() {
  return (
    <div className="menu off" id="add-menu" style={{ left: "883px", top: "130px", width: "210px", transformOrigin: "100% 0%" }}>
      <div className="mi" id="mi-market">
        <I n="globe" s={16} /> Add marketplace
      </div>
      <div className="mi">
        <I n="gear" s={16} /> Manage marketplaces
      </div>
      <div className="mi">
        <I n="upload" s={16} /> Upload plugin
      </div>
      <div className="mi">
        <I n="chat" s={16} /> Create with Claude
      </div>
    </div>
  );
}

function MarketChoice() {
  const opt = (id: string, icon: string, title: string, desc: string) => (
    <div id={id} style={{ height: "68px", border: "1px solid #e3e3e0", borderRadius: "10px", display: "flex", alignItems: "center", gap: "16px", padding: "0 16px", marginBottom: "15px" }}>
      <I n={icon} s={18} />
      <div>
        <div style={{ fontSize: "14px", fontWeight: 500, marginBottom: "3px" }}>{title}</div>
        <div className="mute" style={{ fontSize: "13px" }}>
          {desc}
        </div>
      </div>
    </div>
  );
  return (
    <div className="modal" id="mk-choice" style={{ left: "241px", top: "269px", width: "720px", height: "262px", padding: "0 16px" }}>
      <div style={{ height: "46px", display: "flex", alignItems: "center", fontSize: "15px", fontWeight: 500 }}>
        Add marketplace
        <span style={{ marginLeft: "auto" }}>
          <I n="x" s={18} />
        </span>
      </div>
      {opt("mk-browse", "books", "Browse Anthropic sources", "Curated marketplaces of plugins from Anthropic and partners")}
      <div style={{ position: "relative" }}>
        {opt("mk-repo", "branch", "Add from a repository", "Sync a plugin marketplace from a GitHub repository or Git URL")}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <span className="btn ghost">Cancel</span>
      </div>
    </div>
  );
}

const REPO = "shiwano/konte@plugin";

function MarketForm({ typed }: { typed: "none" | "typing" | "picked" }) {
  return (
    <div className="modal" id="mk-form" style={{ left: "241px", top: "250px", width: "720px", height: "300px", padding: "0 16px" }}>
      <div style={{ height: "46px", display: "flex", alignItems: "center", fontSize: "15px", fontWeight: 500 }}>
        Add marketplace
        <span style={{ marginLeft: "auto" }}>
          <I n="x" s={18} />
        </span>
      </div>
      <div style={{ border: "1px solid #e3e3e0", borderRadius: "10px", padding: "14px 16px", display: "flex", gap: "12px", fontSize: "14px", lineHeight: 1.45, color: "#3d3d3a", marginTop: "17px" }}>
        <I n="info" s={17} />
        Only add marketplaces you trust, because Anthropic doesn't control their plugins and their owners can change them later.
      </div>
      <div style={{ fontSize: "14px", fontWeight: 500, margin: "16px 0 6px" }}>URL</div>
      <div className="field" id="mk-url" style={{ height: "28px", position: "relative" }}>
        <span className="mute" id="mk-url-ph" style={{ display: typed === "none" ? "inline" : "none" }}>
          Select a repository
        </span>
        {typed === "none" && (
          <span className="cin off abs" id="mk-url-in" style={{ left: "8px", top: "4px", fontSize: "14px" }}>
            {REPO}
          </span>
        )}
        {typed !== "none" && (
          <span className="cin abs" id="mk-url-val" style={{ left: "8px", top: "4px", fontSize: "14px" }}>
            {REPO}
          </span>
        )}
        <span style={{ marginLeft: "auto" }}>
          <I n="chevD" s={15} />
        </span>
      </div>
      <div className="mute" style={{ fontSize: "13px", marginTop: "8px" }}>
        A GitHub <code style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11.5px", background: "#f1f1ef", padding: "1px 4px", borderRadius: "4px" }}>owner/repo</code> or a Git repository URL.
      </div>
      <div style={{ position: "absolute", right: "16px", bottom: "16px", display: "flex", gap: "8px" }}>
        <span className="btn ghost">Cancel</span>
        <span style={{ position: "relative", width: "46px", height: "28px" }}>
          <span className={typed === "picked" ? "btn dis abs off" : "btn dis abs"} id="mk-sync-off" style={{ right: 0, top: 0 }}>
            Sync
          </span>
          <span className={typed === "picked" ? "btn dark abs" : "btn dark abs off"} id="mk-sync" style={{ right: 0, top: 0 }}>
            Sync
          </span>
        </span>
      </div>
      <div className="menu off" id="mk-drop" style={{ left: "16px", top: "205px", width: "688px", padding: "4px 0" }}>
        <div style={{ height: "36px", display: "flex", alignItems: "center", padding: "0 18px", fontSize: "14px" }}>{REPO}</div>
        <div className="msep" style={{ margin: "4px 18px" }} />
        <div className="mi" id="mk-use" style={{ height: "36px", padding: "0 18px", margin: "0 4px", borderRadius: "7px" }}>
          <I n="arrowR" s={15} /> Use "{REPO}"
        </div>
      </div>
    </div>
  );
}

function SlashMenu({ items, tip }: { items: string[]; tip: string }) {
  const top = 715 - 12 - items.length * 28 - 12;
  return (
    <>
      <div className="menu off" id="slash" style={{ left: "390px", top: `${top}px`, width: "236px", padding: "6px" }}>
        {items.map((s, i) => {
          const [a, b] = s.includes(":") ? s.split(":") : [s, ""];
          return (
            <div className={i === 0 ? "mi hl" : "mi"} style={{ padding: "0 10px", borderRadius: "7px" }}>
              <span>
                <b style={{ fontWeight: 600 }}>{a}</b>
                {b ? `:${b}` : ""}
              </span>
            </div>
          );
        })}
      </div>
      <div className="off abs" id="slash-tip" style={{ left: "632px", bottom: `${801 - 703}px`, width: "182px", background: "#141413", color: "#fff", borderRadius: "6px", padding: "8px 10px", fontSize: "12px", lineHeight: 1.45 }}>
        {tip}
      </div>
    </>
  );
}

function FolderDialog() {
  const folders = [
    ["Archive", "2026/03/02 13:35"],
    ["Codex", "2026/09/25 14:38"],
    ["ComfyUI", "2026/10/24 4:30"],
    ["konte-workspace", "2026/10/27 0:02"],
    ["Notes", "2026/07/06 0:58"],
    ["Scripts", "2026/04/29 9:03"],
  ] as const;
  const left: [string, string, boolean?][] = [
    ["home", "Home"],
    ["", ""],
    ["monitor", "Desktop"],
    ["download", "Downloads"],
    ["doc", "Documents", true],
    ["picture", "Pictures"],
    ["music", "Music"],
    ["video", "Videos"],
  ];
  const fy = (f: string) => (
    <svg width="16" height="14" viewBox="0 0 16 14" style={{ flex: "none" }}>
      <path d="M1 2h5l1.5 1.5H15v9.5H1z" fill="#f3c356" />
      <path d="M1 5h14v8H1z" fill="#f8d775" />
      <title>{f}</title>
    </svg>
  );
  return (
    <div className="xp" id="xp" style={{ left: "8px", top: "134px", width: "1186px", height: "533px" }}>
      <div className="xp-row" style={{ height: "32px", padding: "0 10px", gap: "8px" }}>
        <span style={{ width: "16px", height: "16px", borderRadius: "3px", background: "#d97757" }} />
        Select Folder
        <span style={{ marginLeft: "auto" }}>
          <I n="x" s={16} w={1.2} />
        </span>
      </div>
      <div className="xp-row" style={{ height: "48px", padding: "0 12px", gap: "18px", color: "#333" }}>
        <span style={{ transform: "rotate(180deg)" }}>
          <I n="arrowR" s={16} w={1.2} />
        </span>
        <span style={{ color: "#aaa" }}>
          <I n="arrowR" s={16} w={1.2} />
        </span>
        <I n="chevD" s={14} w={1.2} />
        <span style={{ transform: "rotate(-90deg)" }}>
          <I n="arrowR" s={16} w={1.2} />
        </span>
        <div className="field" style={{ width: "804px", height: "34px", borderRadius: "4px", borderColor: "#ddd", gap: "8px" }}>
          <I n="doc" s={15} w={1.2} /> › Documents
          <span style={{ marginLeft: "auto", display: "flex", gap: "16px" }}>
            <I n="chevD" s={14} w={1.2} />
            <I n="refresh" s={14} w={1.2} />
          </span>
        </div>
        <div className="field" style={{ width: "200px", height: "34px", borderRadius: "4px", borderColor: "#ddd", color: "#777" }}>
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
        <div id="xp-rows" style={{ marginTop: "6px" }}>
          {folders.map(([n, d]) => (
            <div className="xp-row" id={n === "konte-workspace" ? "xp-kw" : undefined} style={{ position: "relative", height: "28px", paddingLeft: "18px", gap: "6px", width: "720px" }}>
              {n === "konte-workspace" && <div className="abs off xp-sel" id="xp-kw-sel" style={{ inset: 0, zIndex: 0, border: "1px solid #99d1ff" }} />}
              <span style={{ position: "relative", display: "flex", alignItems: "center", gap: "6px", width: "238px" }}>
                {fy(n)}
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
          <div style={{ width: "984px", height: "22px", border: "1px solid #ccc", background: "#fff", padding: "0 4px", display: "flex", alignItems: "center", position: "relative" }}>
            <span id="xp-f-a">Documents</span>
            <span id="xp-f-b" className="abs off" style={{ left: "4px" }}>
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
    <div className="off" id="trust" style={{ position: "absolute", inset: 0 }}>
      <div className="dimmer" />
      <div className="modal" id="trust-box" style={{ left: "401px", top: "292px", width: "400px", height: "216px", padding: "16px" }}>
        <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}>Trust this workspace?</div>
        <div className="mute" style={{ fontSize: "13.5px", lineHeight: 1.5 }}>
          Claude Code may read, write, or execute files in this folder. Only proceed if you trust this workspace.
        </div>
        <div style={{ margin: "8px -12px", background: "#f4f4f2", borderRadius: "6px", padding: "9px 12px", fontFamily: "JetBrains Mono, monospace", fontSize: "12px" }}>C:\Users\alex\Documents\konte-workspace</div>
        <div className="mute" style={{ fontSize: "13px" }}>
          Read our <u>security guide</u> for more information.
        </div>
        <div style={{ position: "absolute", right: "16px", bottom: "16px", display: "flex", gap: "8px" }}>
          <span className="btn ghost">Cancel</span>
          <span className="btn dark" id="trust-ok">
            Trust workspace
          </span>
        </div>
      </div>
    </div>
  );
}

function AppMenu() {
  return (
    <>
      <div className="menu off" id="app-menu" style={{ left: "12px", top: "34px", width: "150px", transformOrigin: "0% 0%" }}>
        <div className="mi" id="am-file">
          File <span className="k">›</span>
        </div>
        <div className="mi">
          Edit <span className="k">›</span>
        </div>
        <div className="mi">
          View <span className="k">›</span>
        </div>
        <div className="mi">
          Help <span className="k">›</span>
        </div>
      </div>
      <div className="menu off" id="file-menu" style={{ left: "166px", top: "34px", width: "200px", transformOrigin: "0% 0%" }}>
        <div className="mi">
          New session <span className="k">Ctrl+N</span>
        </div>
        <div className="mi">
          Settings… <span className="k">Ctrl+,</span>
        </div>
        <div className="msep" />
        <div className="mi" id="fm-exit">
          Exit
        </div>
      </div>
    </>
  );
}

function Toast() {
  return (
    <div className="toast off" id="toast">
      <I n="info" s={17} />
      Konte is installed and ready to use.
      <span style={{ marginLeft: "auto" }}>
        <I n="x" s={16} />
      </span>
    </div>
  );
}

// ───────────── the shots ─────────────

const WS_SETUP: Ws = { sessions: ["Konte setup"], sel: "Konte setup" };
const WS_AFTER: Ws = { sessions: ["Konte setup"] };
const WS_CHECKIN: Ws = { sessions: ["Konte checkin", "Konte setup"], sel: "Konte checkin" };

export type ShotId = "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17";

type Def = { step?: readonly [number, string]; cursor?: readonly [number, number]; ev: Ev[]; body: () => El };

const SHOTS: Record<ShotId, Def> = {
  "01": {
    step: [1, "Open a workspace"],
    cursor: [760, 520],
    ev: [
      { t: 0, d: 0, cam: [601, 400, 1] },
      { t: 0.1, d: 0.8, cam: [520, 700, 1.9] },
      { t: 0.15, d: 0.8, cur: [536, 784] },
      { t: 1.05, click: true },
      { t: 1.05, press: "#h-folder" },
      { t: 1.1, bg: "#h-folder" },
    ],
    body: () => (
      <>
        <Sidebar />
        <Home />
      </>
    ),
  },
  "02": {
    cursor: [560, 520],
    ev: [
      { t: 0, d: 0, cam: [420, 400, 1.55] },
      { t: 0, pop: "#xp", d: 0.25 },
      { t: 0.15, d: 0.55, cur: [300, 384] },
      { t: 0.75, click: true },
      { t: 0.78, show: "#xp-kw-sel" },
      { t: 0.78, hide: "#xp-f-a" },
      { t: 0.78, show: "#xp-f-b" },
      { t: 0.95, d: 0.6, cam: [900, 580, 1.65] },
      { t: 0.95, d: 0.6, cur: [1018, 645] },
      { t: 1.7, click: true },
      { t: 1.7, press: "#xp-ok" },
      { t: 1.85, vanish: "#xp" },
    ],
    body: () => (
      <>
        <Sidebar />
        <Home />
        <FolderDialog />
      </>
    ),
  },
  "03": {
    cursor: [640, 560],
    ev: [
      { t: 0, d: 0, cam: [601, 400, 1.55] },
      { t: 0, d: 0, show: "#trust" },
      { t: 0, pop: "#trust-box", d: 0.25 },
      { t: 0.1, d: 0.55, cur: [728, 480] },
      { t: 0.75, click: true },
      { t: 0.75, press: "#trust-ok" },
      { t: 0.9, vanish: "#trust" },
      { t: 0.95, d: 0.55, cam: [560, 740, 2.1] },
      { t: 1.05, off: "#h-folder-a" },
      { t: 1.05, on: "#h-folder-b" },
      { t: 1.1, pulse: "#h-folder" },
      { t: 1.05, d: 0.4, cur: [700, 640] },
    ],
    body: () => (
      <>
        <Sidebar />
        <Home folderNext="konte-workspace" />
        <TrustDialog />
      </>
    ),
  },
  "04": {
    step: [2, "Add the marketplace"],
    cursor: [420, 620],
    ev: [
      { t: 0, d: 0, cam: [300, 600, 1.7] },
      { t: 0.1, d: 0.5, cur: [72, 778] },
      { t: 0.65, click: true },
      { t: 0.7, pop: "#acct-menu" },
      { t: 0.8, d: 0.5, cam: [240, 520, 1.85] },
      { t: 0.95, d: 0.5, cur: [82, 430] },
      { t: 1.45, bg: "#mi-settings" },
      { t: 1.6, click: true },
    ],
    body: () => (
      <>
        <Sidebar />
        <Home folder="konte-workspace" />
        <AccountMenu />
      </>
    ),
  },
  "05": {
    cursor: [180, 420],
    ev: [
      { t: 0, d: 0, cam: [601, 400, 1] },
      { t: 0, pop: "#set", d: 0.25 },
      { t: 0.25, d: 0.55, cam: [300, 440, 1.75] },
      { t: 0.3, d: 0.4, cur: [190, 520] },
      { t: 0.7, d: 0.6, y: ["#set-list", -211] },
      { t: 1.25, d: 0.35, cur: [170, 650] },
      { t: 1.65, click: true },
      { t: 1.7, bg: "#nav-plugins" },
      { t: 1.7, unbg: "#nav-claude-code" },
      { t: 1.72, show: "#sv-plugins" },
      { t: 1.75, d: 0.55, cam: [601, 380, 1.15] },
    ],
    body: () => (
      <>
        <Sidebar />
        <Home folder="konte-workspace" />
        <div className="dimmer" style={{ background: "rgba(20,20,19,.18)" }} />
        <Settings view="general" sel="Claude Code" />
      </>
    ),
  },
  "06": {
    cursor: [760, 300],
    ev: [
      { t: 0, d: 0, cam: [601, 380, 1.15] },
      { t: 0.05, d: 0.5, cam: [930, 180, 2.0] },
      { t: 0.1, d: 0.5, cur: [1052, 112] },
      { t: 0.65, click: true },
      { t: 0.65, press: "#btn-add" },
      { t: 0.72, pop: "#add-menu" },
      { t: 0.9, d: 0.4, cur: [985, 152] },
      { t: 1.3, bg: "#mi-market" },
      { t: 1.45, click: true },
    ],
    body: () => (
      <>
        <Sidebar />
        <Home folder="konte-workspace" />
        <div className="dimmer" style={{ background: "rgba(20,20,19,.18)" }} />
        <Settings view="empty" sel="Plugins" />
        <AddMenu />
      </>
    ),
  },
  "07": {
    cursor: [900, 330],
    ev: [
      { t: 0, d: 0, cam: [601, 400, 1.3] },
      { t: 0, pop: "#mk-choice", d: 0.25 },
      { t: 0.2, d: 0.5, cam: [600, 420, 1.75] },
      { t: 0.25, d: 0.55, cur: [560, 440] },
      { t: 0.85, bg: "#mk-repo" },
      { t: 1.15, click: true },
    ],
    body: () => (
      <>
        <Sidebar />
        <Home folder="konte-workspace" />
        <div className="dimmer" style={{ background: "rgba(20,20,19,.18)" }} />
        <Settings view="empty" sel="Plugins" />
        <div className="dimmer" style={{ background: "rgba(20,20,19,.28)" }} />
        <MarketChoice />
      </>
    ),
  },
  "08": {
    cursor: [560, 440],
    ev: [
      { t: 0, d: 0, cam: [601, 420, 1.55] },
      { t: 0, pop: "#mk-form", d: 0.2 },
      { t: 0.15, d: 0.5, cam: [480, 440, 2.4] },
      { t: 0.15, d: 0.3, cur: [700, 500] },
      { t: 0.55, hide: "#mk-url-ph" },
      { t: 0.55, show: "#mk-url-in" },
      { t: 0.55, pulse: "#mk-url" },
      { t: 0.55, d: 1.9, type: "#mk-url-in" },
      { t: 2.75, pop: "#mk-drop" },
      { t: 2.8, d: 0.5, cam: [480, 470, 2.1] },
    ],
    body: () => (
      <>
        <Sidebar />
        <Home folder="konte-workspace" />
        <div className="dimmer" style={{ background: "rgba(20,20,19,.18)" }} />
        <Settings view="empty" sel="Plugins" />
        <div className="dimmer" style={{ background: "rgba(20,20,19,.28)" }} />
        <MarketForm typed="none" />
      </>
    ),
  },
  "09": {
    cursor: [700, 500],
    ev: [
      { t: 0, d: 0, cam: [480, 470, 2.1] },
      { t: 0, d: 0, show: "#mk-drop" },
      { t: 0.05, d: 0.45, cur: [420, 523] },
      { t: 0.45, bg: "#mk-use" },
      { t: 0.6, click: true },
      { t: 0.65, vanish: "#mk-drop" },
      { t: 0.7, hide: "#mk-sync-off" },
      { t: 0.7, pop: "#mk-sync", d: 0.15 },
      { t: 0.75, d: 0.5, cam: [760, 470, 2.1] },
      { t: 0.8, d: 0.45, cur: [922, 524] },
      { t: 1.4, click: true },
      { t: 1.4, press: "#mk-sync" },
    ],
    body: () => (
      <>
        <Sidebar />
        <Home folder="konte-workspace" />
        <div className="dimmer" style={{ background: "rgba(20,20,19,.18)" }} />
        <Settings view="empty" sel="Plugins" />
        <div className="dimmer" style={{ background: "rgba(20,20,19,.28)" }} />
        <MarketForm typed="typing" />
      </>
    ),
  },
  "10": {
    step: [3, "Install konte"],
    cursor: [760, 300],
    ev: [
      { t: 0, d: 0, cam: [601, 380, 1.15] },
      { t: 0.1, d: 0.6, cam: [760, 175, 2.1] },
      { t: 0.15, d: 0.6, cur: [1002, 172] },
      { t: 0.85, click: true },
      { t: 0.85, press: "#pk-add" },
      { t: 1.0, hide: "#pk-add" },
      { t: 1.0, pop: "#pk-added", d: 0.18 },
      { t: 1.0, hide: "#pk-desc-a" },
      { t: 1.0, show: "#pk-desc-b" },
      { t: 1.0, show: "#pk-more" },
      { t: 1.3, d: 0.7, cam: [760, 455, 1.2] },
      { t: 1.35, d: 0.6, cur: [760, 640] },
      { t: 1.55, pop: "#toast", d: 0.35 },
    ],
    body: () => (
      <>
        <Sidebar />
        <Home folder="konte-workspace" />
        <div className="dimmer" style={{ background: "rgba(20,20,19,.18)" }} />
        <Settings view="konte" sel="Plugins" />
        <Toast />
      </>
    ),
  },
  "11": {
    step: [4, "Run setup"],
    cursor: [800, 400],
    ev: [
      { t: 0, d: 0, cam: [880, 300, 1.5] },
      { t: 0, d: 0, show: "#toast" },
      { t: 0.05, d: 0.45, cur: [1091, 58] },
      { t: 0.55, click: true },
      { t: 0.55, press: "#set-x" },
      { t: 0.65, vanish: "#set", d: 0.18 },
      { t: 0.65, vanish: "#set-dim", d: 0.18 },
      { t: 0.65, vanish: "#toast", d: 0.18 },
      { t: 0.7, d: 0.6, cam: [300, 300, 1.7] },
      { t: 0.75, d: 0.55, cur: [52, 62] },
      { t: 1.4, click: true },
      { t: 1.5, d: 0.7, cam: [560, 700, 1.7] },
      { t: 1.55, pulse: "#h-comp" },
      { t: 1.55, show: "#h-caret" },
      { t: 1.6, d: 0.6, cur: [760, 640] },
    ],
    body: () => (
      <>
        <Sidebar />
        <Home folder="konte-workspace" />
        <div className="dimmer" id="set-dim" style={{ background: "rgba(20,20,19,.18)" }} />
        <Settings view="installed" sel="Plugins" />
        <Toast />
      </>
    ),
  },
  "12": {
    ev: [
      { t: 0, d: 0, cam: [440, 690, 2.0] },
      { t: 0, d: 0, show: "#h-caret" },
      { t: 0.2, off: "#h-ph" },
      { t: 0.2, on: "#h-in" },
      { t: 0.2, d: 0.8, type: "#h-in" },
      { t: 1.05, pop: "#slash", d: 0.18 },
      { t: 1.2, pop: "#slash-tip", d: 0.18 },
      { t: 2.1, off: "#h-in" },
      { t: 2.1, on: "#h-cmd" },
      { t: 2.1, vanish: "#slash", d: 0.12 },
      { t: 2.1, vanish: "#slash-tip", d: 0.12 },
      { t: 2.1, show: "#h-enter" },
      { t: 2.7, press: "#h-enter" },
      { t: 2.8, hide: "#h-main" },
      { t: 2.8, show: "#s-wrap" },
      { t: 2.8, hide: "#side-a" },
      { t: 2.8, show: "#side-b" },
      { t: 2.8, d: 0.45, cam: [601, 300, 1.35] },
      { t: 2.85, pop: "#s-bubble", d: 0.25 },
      { t: 3.0, pop: "#s-todo", d: 0.25 },
      { t: 3.1, pop: "#s-st", d: 0.2 },
    ],
    body: () => (
      <>
        <div id="side-a" className="abs" style={{ inset: 0 }}>
          <Sidebar />
        </div>
        <div id="side-b" className="abs off" style={{ inset: 0 }}>
          <Sidebar ws={WS_SETUP} newSel={false} />
        </div>
        <Home folder="konte-workspace" input="/konte" inputCmd="/konte:setup" />
        <SlashMenu items={["konte:setup", "konte:upgrade", "context"]} tip="(konte) Create or set up a konte workspace. Use when starting with konte, creating a workspace, or preparing a cloned or moved workspace." />
        <div className="off" id="s-wrap">
          <SessionSetup id="s" stage={0} />
        </div>
      </>
    ),
  },
  "13": {
    ev: [
      { t: 0, d: 0, cam: [500, 250, 1.75] },
      { t: 0, d: 2.5, spin: ["#s-sp1, #s-sp2", 3] },
      { t: 0, d: 1.0, count: ["#s-st-secs", 11, 34] },
      { t: 1.0, hide: "#s-r1" },
      { t: 1.0, pop: "#s-d1", d: 0.15 },
      { t: 1.0, hide: "#s-w2" },
      { t: 1.0, show: "#s-r2" },
      { t: 1.0, hide: "#s-st" },
      { t: 1.0, show: "#s-st2" },
      { t: 1.0, d: 0.8, count: ["#s-st2-secs", 2, 6] },
      { t: 1.8, hide: "#s-r2" },
      { t: 1.8, pop: "#s-d2", d: 0.15 },
      { t: 1.8, hide: "#s-st2" },
    ],
    body: () => (
      <>
        <Sidebar ws={WS_SETUP} newSel={false} />
        <SessionSetup id="s" stage={1} />
      </>
    ),
  },
  "14": {
    ev: [
      { t: 0, d: 0, cam: [500, 300, 1.75] },
      { t: 0.1, pop: "#s-reply", d: 0.35 },
      { t: 0.45, d: 0.6, cam: [610, 400, 2.1] },
      { t: 1.0, d: 0.5, wipe: "#s-mark" },
    ],
    body: () => (
      <>
        <Sidebar ws={WS_SETUP} newSel={false} />
        <SessionSetup id="s" stage={2} />
      </>
    ),
  },
  "15": {
    cursor: [360, 380],
    ev: [
      { t: 0, d: 0, cam: [610, 400, 2.1] },
      { t: 0.05, d: 0.5, cam: [200, 150, 2.1] },
      { t: 0.1, d: 0.45, cur: [27, 20] },
      { t: 0.6, click: true },
      { t: 0.65, pop: "#app-menu", d: 0.18 },
      { t: 0.8, d: 0.3, cur: [70, 54] },
      { t: 1.0, bg: "#am-file" },
      { t: 1.05, pop: "#file-menu", d: 0.18 },
      { t: 1.15, d: 0.35, cur: [210, 123] },
      { t: 1.45, bg: "#fm-exit" },
      { t: 1.55, click: true },
      { t: 1.6, d: 0.2, dim: ["#blackout", 1] },
      { t: 1.8, hide: "#old" },
      { t: 1.8, show: "#new" },
      { t: 1.8, d: 0, cam: [601, 400, 1] },
      { t: 1.8, d: 0, cur: [760, 520] },
      { t: 1.95, d: 0.35, dim: ["#blackout", 0] },
    ],
    body: () => (
      <>
        <div id="old" className="abs" style={{ inset: 0 }}>
          <Sidebar ws={WS_SETUP} newSel={false} />
          <SessionSetup id="s" stage={3} />
          <AppMenu />
        </div>
        <div id="new" className="abs off" style={{ inset: 0 }}>
          <Sidebar ws={WS_AFTER} />
          <Home folder="konte-workspace" id="n" />
        </div>
        <div className="blackout off" id="blackout" />
      </>
    ),
  },
  "16": {
    step: [5, "Check in"],
    cursor: [760, 520],
    ev: [
      { t: 0, d: 0, cam: [601, 400, 1] },
      { t: 0.05, d: 0.6, cam: [260, 330, 2.0] },
      { t: 0.1, d: 0.55, cur: [268, 324] },
      { t: 0.5, show: "#ws-plus" },
      { t: 0.5, bg: "#ws-head" },
      { t: 0.8, click: true },
      { t: 0.8, press: "#ws-plus" },
      { t: 0.9, pop: "#h-main", d: 0.25 },
      { t: 1.0, d: 0.6, cam: [440, 690, 2.0] },
      { t: 1.05, d: 0.5, cur: [760, 620] },
      { t: 1.15, show: "#h-caret" },
      { t: 1.3, off: "#h-ph" },
      { t: 1.3, on: "#h-in" },
      { t: 1.3, d: 1.1, type: "#h-in" },
      { t: 2.0, pop: "#slash", d: 0.18 },
      { t: 2.15, pop: "#slash-tip", d: 0.18 },
      { t: 2.9, off: "#h-in" },
      { t: 2.9, on: "#h-cmd" },
      { t: 2.9, vanish: "#slash", d: 0.12 },
      { t: 2.9, vanish: "#slash-tip", d: 0.12 },
      { t: 2.9, show: "#h-enter" },
      { t: 3.4, press: "#h-enter" },
      { t: 3.55, off: "#h-cmd" },
      { t: 3.55, on: "#h-ph" },
      { t: 3.55, hide: "#h-enter" },
    ],
    body: () => (
      <>
        <Sidebar ws={WS_AFTER} />
        <Home folder="konte-workspace" input="/konte-checkin" inputCmd="/konte-checkin" />
        <SlashMenu items={["konte-checkin"]} tip={'Session opener — recap where the current video stands, propose the next step, surface the choice. Use at the start of a session or when the user asks "where are we" / "what\'s next". (project)'} />
      </>
    ),
  },
  "17": {
    ev: [
      { t: 0, d: 0, cam: [601, 300, 1.35] },
      { t: 0, pop: "#c-bubble", d: 0.25 },
      { t: 0.25, pop: "#c-todo", d: 0.3 },
      { t: 0.35, hide: "#c-w0" },
      { t: 0.35, show: "#c-r0" },
      { t: 0.45, pop: "#c-st", d: 0.25 },
      { t: 0.35, d: 3.1, spin: ["#c-sp0, #c-sp1", 4] },
      { t: 0.45, d: 2.5, count: ["#c-st-secs", 1, 10] },
      { t: 0.3, d: 0.7, cam: [500, 280, 1.8] },
      { t: 1.6, hide: "#c-r0" },
      { t: 1.6, pop: "#c-d0", d: 0.15 },
      { t: 1.6, hide: "#c-w1" },
      { t: 1.6, show: "#c-r1" },
      { t: 2.2, d: 0.8, cam: [601, 400, 1.12] },
    ],
    body: () => (
      <>
        <Sidebar ws={WS_CHECKIN} newSel={false} />
        <Session id="c" title="Konte checkin" cmd="/konte-checkin" todos={TODO_CHECKIN} state={["wait", "wait", "wait"]} meta="Second session on this computer · konte-workspace" fresh>
          <Status id="c-st" top={354} label="Running a command" secs={1} hidden />
        </Session>
      </>
    ),
  },
};

/** The setup session at a stage: 0 just sent, 1 running, 2 done with the restart reply arriving, 3 that reply settled. */
function SessionSetup({ id, stage }: { id: string; stage: 0 | 1 | 2 | 3 }) {
  const state: Todo[] = stage >= 2 ? ["done", "done", "done"] : ["done", "run", "wait"];
  return (
    <Session id={id} title="Konte setup" cmd="/konte:setup" todos={TODO_SETUP} state={state} meta="Started on this computer · konte-workspace" fresh={stage === 0}>
      {stage <= 1 ? (
        <>
          <Status id={`${id}-st`} top={354} label="Downloading and running the konte setup script" secs={11} hidden={stage === 0} />
          <Status id={`${id}-st2`} top={354} label="Writing the restart steps" secs={2} hidden />
        </>
      ) : (
        <div className={stage === 2 ? "reply off" : "reply"} id={`${id}-reply`} style={{ top: "346px" }}>
          <p style={{ margin: "0 0 10px" }}>konte is set up in this workspace.</p>
          <p style={{ margin: 0 }}>
            <span className="mark" id={`${id}-mark`} style={stage === 2 ? { backgroundSize: "0% 100%" } : undefined}>
              Fully quit Claude Code and launch it again in this folder — closing the window is not enough.
            </span>{" "}
            Then run <code>/konte-checkin</code>.
          </p>
        </div>
      )}
    </Session>
  );
}

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
