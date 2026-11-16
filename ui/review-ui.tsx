import { Image, type MediaAsset } from "konte";

type Img = MediaAsset<"image">;
type Children = JSX.Element | string | number | boolean | null | undefined | Children[];

const BASE_W = 1920;

const CSS = `
.kr{--font-title:"Cormorant Garamond",Georgia,serif;--font-mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;--bg-app:#0b0c0f;--bg-panel:#15161d;--bg-elevated:#1d1f29;--bg-hover:#282b38;--border:#2b2d3b;--border-strong:#414557;--text-primary:#f0f1f7;--text-secondary:#b3b8c9;--text-muted:#9299ae;--accent:#6e62f5;--accent-hover:#a99fff;--accent-soft:rgba(110,98,245,.15);--green:#30c98e;--green-soft:rgba(48,201,142,.14);--orange:#f59e4b;--yellow:#e8c558;--yellow-soft:rgba(232,197,88,.14);--red:#f25c5c;
  position:relative;width:1920px;height:1080px;overflow:hidden;background:var(--bg-app);color:var(--text-primary);font-size:14px;line-height:1.45;-webkit-font-smoothing:antialiased;}
.kr *{box-sizing:border-box;}
:where(.kr button){font:inherit;color:inherit;cursor:pointer;background:transparent;border:0 solid;padding:0;}
.kr svg{display:block;flex:none;}
.kr-header{z-index:5;position:absolute;inset:0 0 auto 0;height:52px;border-bottom:1px solid var(--border);background:rgba(11,12,15,.85);backdrop-filter:blur(12px);}
.kr-header-in{display:flex;align-items:center;justify-content:space-between;height:100%;max-width:1600px;margin:0 auto;padding:0 20px;}
.kr-brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:15px;letter-spacing:-.01em;}
.kr-brand-sep{width:1px;height:18px;background:var(--border-strong);}
.kr-brand-stage{font-weight:500;color:var(--text-primary);font-size:14px;}
.kr-hright{display:flex;align-items:center;gap:10px;}
.kr-toggle{display:flex;align-items:center;gap:8px;color:var(--text-secondary);font-size:13px;margin-right:6px;}
.kr-switch{position:relative;width:30px;height:16px;border-radius:999px;background:var(--bg-hover);border:1px solid var(--border-strong);}
.kr-switch::after{content:"";position:absolute;top:2px;left:2px;width:10px;height:10px;border-radius:50%;background:var(--text-muted);}
.kr-switch.on{background:var(--accent);border-color:var(--accent);}
.kr-switch.on::after{left:16px;background:#fff;}
.kr-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:34px;padding:0 12px;border-radius:8px;border:1px solid var(--border);background:var(--bg-elevated);color:var(--text-primary);font-size:13px;font-weight:500;white-space:nowrap;}
.kr-btn.ghost{background:transparent;color:var(--text-muted);opacity:.7;}
.kr-btn.icon{width:34px;padding:0;}
.kr-btn.ok{background:var(--green-soft);border-color:rgba(48,201,142,.5);color:var(--green);}
.kr-btn .count{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:var(--accent-soft);color:var(--accent-hover);font-size:11px;font-weight:600;}
.kr-main{position:absolute;top:68px;left:0;right:0;bottom:0;max-width:1600px;margin:0 auto;padding:0 20px;}
.kr-handoff{display:flex;align-items:flex-start;gap:12px;padding:13px 18px;border:1px solid var(--border);border-left:3px solid var(--accent);border-radius:10px;background:var(--bg-panel);color:var(--text-primary);font-size:13.5px;margin-bottom:16px;}
.kr-handoff svg{color:var(--accent-hover);margin-top:2px;}
.kr-panel{background:var(--bg-panel);border:1px solid var(--border);border-radius:14px;}
.kr-label{font-size:11px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--text-secondary);}
.kr-submit{z-index:6;position:absolute;right:180px;bottom:24px;display:flex;align-items:center;gap:10px;height:44px;padding:0 50px;border-radius:999px;background:var(--accent);color:#fff;font-weight:600;font-size:15px;box-shadow:0 10px 30px rgba(110,98,245,.45);}
.kr-kbd{display:inline-block;padding:1px 6px;border-radius:4px;border:1px solid rgba(255,255,255,.45);font-size:10.5px;font-weight:600;color:rgba(255,255,255,.85);}
.kr-note{border:1px solid var(--border);border-radius:10px;background:var(--bg-elevated);padding:10px 14px;font-size:13px;}
.kr-note.agent{background:rgba(110,98,245,.12);border-color:rgba(110,98,245,.35);display:flex;gap:10px;align-items:flex-start;}
.kr-note.agent svg{color:var(--accent-hover);margin-top:3px;}
.kr-note.human{display:flex;gap:10px;align-items:flex-start;background:var(--bg-elevated);}
.kr-note.human.stale .kr-note-text{text-decoration:line-through;color:var(--text-muted);}
.kr-note.human.stale{opacity:.75;}
.kr-note-meta{display:flex;flex-direction:column;align-items:center;gap:4px;min-width:30px;}
.kr-note-time{font-family:var(--font-mono,ui-monospace);font-size:10.5px;color:var(--text-muted);background:var(--bg-panel);border:1px solid var(--border);border-radius:4px;padding:0 4px;}
.kr-pin{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:var(--yellow);color:#14151b;font-size:11px;font-weight:700;}
.kr-pin span{transform:rotate(45deg);}
.kr-add{width:100%;display:flex;align-items:center;justify-content:center;gap:6px;height:30px;border:1px dashed var(--border-strong);border-radius:8px;color:var(--text-muted);font-size:13px;}
.kr-empty{color:var(--text-muted);font-size:12.5px;}
.kr-kv{display:grid;grid-template-columns:76px 1fr;gap:8px 10px;align-items:start;}
.kr-kv-k{font-size:10.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-muted);padding-top:2px;}
.kr-kv-v{font-size:13px;color:var(--text-primary);}
.kr-line{display:flex;gap:8px;align-items:flex-start;font-size:13px;}
.kr b{font-weight:600;}
.kr i{color:var(--text-muted);}
.kr-accept{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 14px;border-radius:999px;border:1px solid var(--border-strong);color:var(--text-primary);font-size:13px;font-weight:600;background:transparent;}
.kr-accept.on{background:var(--green);border-color:var(--green);color:#0b2a1e;}
.kr-badge{display:inline-flex;align-items:center;height:18px;padding:0 7px;border-radius:5px;font-size:9.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;}
.kr-badge.changed{background:var(--accent-soft);color:var(--accent-hover);}
.kr-badge.new{background:var(--green-soft);color:var(--green);}
.kr-dot{width:6px;height:6px;border-radius:50%;background:var(--green);}
.kr-player{position:relative;overflow:hidden;border-radius:14px;border:1px solid var(--border);background:#000;}
.kr-player-title{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font-family:var(--font-title);font-style:italic;font-weight:500;letter-spacing:.06em;text-shadow:0 4px 18px rgba(0,0,0,.6);}
.kr-pinmark{position:absolute;transform:translate(-50%,-100%);}
.kr-pin.draft{background:var(--orange);box-shadow:0 0 0 2px rgba(60,30,0,.55);}
.kr-note.human.draft{background:rgba(245,158,75,.13);border-color:rgba(245,158,75,.45);}
.kr-note-tools{margin-left:auto;display:flex;gap:10px;color:var(--text-muted);padding-top:2px;}
.kr-composer{display:flex;gap:8px;align-items:flex-start;}
.kr-composer-box{flex:1;min-height:52px;padding:8px 12px;border-radius:10px;border:1px solid var(--accent);box-shadow:0 0 0 3px rgba(110,98,245,.18);background:var(--bg-app);font-size:13px;line-height:1.5;}
.kr-caret{display:inline-block;width:1px;height:15px;margin-left:1px;vertical-align:-2px;background:var(--text-primary);}
.kr-composer-btn{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;border:1px solid var(--border-strong);color:var(--text-secondary);}
.kr-composer-btn.ok{border-color:rgba(48,201,142,.55);color:var(--green);}
.kr-pinmark .kr-pin{width:22px;height:22px;font-size:12px;box-shadow:0 4px 12px rgba(0,0,0,.5);}
.kr-transport{display:flex;align-items:center;gap:8px;padding:10px;}
.kr-tbtn{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;border:1px solid var(--border);background:var(--bg-elevated);color:var(--text-secondary);}
.kr-tbtn.play{width:44px;background:var(--accent);border-color:var(--accent);color:#fff;}
.kr-tbtn.wide{width:auto;padding:0 12px;gap:6px;font-size:13px;}
.kr-tbtn.notes{width:auto;padding:0 12px;gap:6px;font-size:13px;color:var(--accent-hover);background:var(--accent-soft);border-color:rgba(110,98,245,.4);}
.kr-time{margin-left:auto;font-family:var(--font-mono,ui-monospace);font-size:13px;color:var(--text-secondary);letter-spacing:.04em;padding-right:4px;}
.kr-tl{position:relative;}
.kr-tl-row{position:absolute;left:0;right:0;}
.kr-tl-label{position:absolute;left:0;width:84px;display:flex;align-items:center;gap:7px;padding-left:10px;color:var(--text-secondary);font-size:12px;}
.kr-tl-track{position:absolute;left:86px;right:0;}
.kr-clip{position:absolute;display:flex;align-items:center;gap:6px;padding:0 6px;border-radius:5px;border:1px solid;font-size:10.5px;overflow:hidden;white-space:nowrap;}
.kr-clip.shot{background:#1a1c26;border-color:#30334a;color:var(--text-primary);}
.kr-clip.shot.acc{background:rgba(48,201,142,.08);border-color:rgba(48,201,142,.28);}
.kr-clip.shot.sel{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent);background:rgba(110,98,245,.16);}
.kr-clip.video{background:rgba(70,140,230,.13);border-color:rgba(90,150,240,.45);color:#cfe0ff;}
.kr-clip.image{background:rgba(232,197,88,.12);border-color:rgba(232,197,88,.45);color:#f3e2a8;}
.kr-clip.audio{background:rgba(245,110,75,.12);border-color:rgba(245,110,75,.45);color:#ffd2c4;}
.kr-clip.line{background:rgba(242,92,92,.16);border-color:rgba(242,92,92,.55);color:#ffd0d0;}
.kr-clip.sel{box-shadow:inset 0 0 0 1px var(--accent);border-color:var(--accent);}
.kr-chip{display:inline-flex;align-items:center;gap:3px;color:inherit;opacity:.85;}
.kr-chip.ok{color:var(--green);opacity:1;}
.kr-chip.stale{color:var(--yellow);opacity:1;}
.kr-chip.new{color:var(--green);opacity:1;font-weight:600;}
.kr-shotcard{padding:12px 13px;border:1px solid var(--border);border-radius:10px;background:var(--bg-elevated);}
.kr-shotcard.sel{border-color:var(--accent-hover);background:rgba(110,98,245,.13);box-shadow:inset 3px 0 0 var(--accent);}
.kr-shotcard-head{display:flex;align-items:center;gap:8px;font-weight:600;font-size:13px;}
.kr-shotcard-c{display:inline-flex;align-items:center;gap:3px;color:var(--text-muted);font-weight:500;font-size:11.5px;}
.kr-shotcard-action{margin-top:8px;color:var(--text-secondary);font-size:12.5px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.kr-progress{height:4px;border-radius:999px;background:var(--bg-hover);overflow:hidden;}
.kr-progress div{height:100%;background:var(--green);}
.kr-media{position:relative;border-radius:10px;overflow:hidden;background:#000;}
.kr-media-tag{position:absolute;top:10px;left:10px;padding:2px 8px;border-radius:6px;background:rgba(0,0,0,.6);font-size:11px;font-weight:600;}
.kr-media-tools{position:absolute;top:10px;right:10px;display:flex;gap:6px;}
.kr-media-tool{display:flex;align-items:center;gap:5px;height:28px;padding:0 8px;border-radius:7px;background:rgba(15,16,20,.75);border:1px solid rgba(255,255,255,.12);font-size:11.5px;color:var(--text-secondary);}
.kr-audio{position:absolute;left:12px;right:12px;bottom:16px;height:34px;display:flex;align-items:center;gap:12px;padding:0 14px;border-radius:999px;background:#f1f3f4;}
.kr-audio-time{font-size:12px;color:#222;}
.kr-audio-bar{flex:1;height:4px;border-radius:999px;background:#c8c8c8;overflow:hidden;}
.kr-audio-bar div{height:100%;background:#555;}
.kr-audio-more{color:#333;font-weight:700;font-size:15px;}
.kr-drow:last-child{border-bottom:none;}
.kr ul{margin:0;padding-left:18px;list-style:disc;}
.kr li{margin-bottom:3px;}
.kr li::marker{color:var(--text-secondary);}
.kr-dnotes{display:flex;flex-direction:column;gap:8px;}
.kr-tp-title{display:flex;align-items:center;justify-content:space-between;}
.kr-takes{display:inline-flex;align-items:center;gap:5px;height:22px;padding:0 8px;border:1px solid var(--border);border-radius:6px;background:var(--bg-elevated);color:var(--text-secondary);font-size:11.5px;}
.kr-tag-new{color:var(--green);font-weight:600;}
.kr-tp-head{display:flex;align-items:center;gap:7px;margin-top:4px;}
.kr-tp-count{min-width:20px;padding:1px 7px;border-radius:999px;background:var(--bg-elevated);border:1px solid var(--border-strong);color:var(--text-secondary);font-size:11px;font-weight:600;text-align:center;}
.kr-clip-open{display:inline-flex;align-items:center;gap:4px;flex:none;padding:1px 5px;border:1px solid var(--border);border-radius:3px;background:rgba(0,0,0,.35);color:var(--text-secondary);font-size:10px;}
.kr-sc{margin-top:24px;line-height:1.7;}
.kr-sc-row{display:flex;gap:0 20px;}
.kr-sc-gutter{flex:none;width:88px;padding-top:11px;text-align:right;font-size:11.8px;line-height:1.5;color:var(--text-muted);}
.kr-sc-id{display:block;font-size:13px;font-weight:700;color:var(--text-primary);}
.kr-sc-body{flex:1;min-width:0;margin:0;padding:10px 0 10px 35px;border-left:3px solid transparent;}
.kr-sc-notes{flex:none;width:288px;padding:10px 0;display:flex;flex-direction:column;gap:6px;}
.kr-sc-scene{padding-top:26px;padding-bottom:3px;font-size:16px;font-weight:700;letter-spacing:.02em;}
.kr-sc-action{position:relative;margin:0;font-size:14px;}
.kr-sc-chev{position:absolute;left:-34px;top:-2px;display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:6px;color:var(--text-muted);}
.kr-sc-chev.open{background:var(--bg-elevated);color:var(--text-primary);}
.kr-sc-chev.open svg{transform:rotate(90deg);}
.kr-sc-line{display:flex;flex-direction:column;margin:8px 0 2px 3em;max-width:30em;}
.kr-sc-speaker{font-size:11.8px;font-weight:600;letter-spacing:.04em;color:var(--accent-hover);}
.kr-sc-acting{font-size:12.8px;color:var(--text-muted);}
.kr-sc-text{font-size:16px;}
.kr-sc-aside{margin:6px 0 0;font-size:13px;color:var(--text-secondary);}
.kr-sc-label{margin-right:8px;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-muted);}
.kr-sc-staging dt{color:var(--text-muted);font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;padding-top:2px;}
.kr-sc-staging dd{margin:0;}
.kr-rail{z-index:4;position:absolute;top:52px;bottom:0;left:0;background:var(--bg-panel);border-right:1px solid var(--border);font-size:13.4px;}
.kr-rail-scroll{margin-top:41.6px;padding:4.8px 8px 32px;}
.kr-rail-toggle{z-index:5;position:absolute;top:60px;left:9.6px;display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:6px;color:var(--text-muted);}
.kr-rail-group+.kr-rail-group{margin-top:17.6px;}
.kr-rail-title{padding:4.8px 9.6px;font-size:11.5px;font-weight:500;color:var(--text-muted);}
.kr-rail-row{display:flex;align-items:center;gap:7.2px;min-height:30px;padding:2.4px 9.6px;border-radius:6px;color:var(--text-secondary);}
.kr-rail-row.current{background:var(--bg-elevated);color:var(--text-primary);font-weight:600;}
.kr-rail-name{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.kr-rail-fold{display:flex;align-items:center;justify-content:center;width:20px;height:20px;margin-left:-4.8px;color:var(--text-muted);}
.kr-rail-fold.open svg{transform:rotate(90deg);}
.kr-rail-meta{font-size:11.5px;font-weight:400;color:var(--text-muted);}
.kr-rail-noted{color:var(--accent-hover);}
.kr-rail-left{min-width:20px;padding:0 5.6px;border-radius:999px;background:var(--yellow-soft);color:var(--yellow);font-size:11.2px;font-weight:600;line-height:20px;text-align:center;}
.kr-rail-done{color:var(--green);}
.kr-rail-shots{display:flex;flex-wrap:wrap;gap:3px;padding:4px 9.6px 8px 24.8px;}
.kr-rail-shot{display:flex;align-items:center;justify-content:center;min-width:30.4px;height:24px;padding:0 4.8px;border:1px solid transparent;border-radius:4px;font-size:11.2px;}
.kr-rail-shot.cur{color:var(--text-primary)!important;}
.kr-group-title{margin:0 0 11.2px;font-size:13.1px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-secondary);line-height:19.2px;}
.kr-subject{background:var(--bg-panel);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,.18);}
.kr-subject-head{display:flex;align-items:center;gap:11.2px;height:47px;padding:0 14.4px;background:var(--bg-elevated);border-bottom:1px solid var(--border);}
.kr-subject-kind{font-size:10.9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--text-muted);}
.kr-subject-name{flex:1 1 auto;font-size:15.7px;font-weight:600;}
.kr-subject-progress{font-size:12.2px;color:var(--text-muted);}
.kr-ref-row{display:grid;grid-template-columns:940px minmax(0,1fr) 132px;gap:9.6px 14.4px;align-items:start;padding:14.4px;}
.kr-ref-row+.kr-ref-row{border-top:1px solid var(--border);}
.kr-ref-row.focused{background:var(--accent-soft);box-shadow:inset 3px 0 0 var(--accent);}
.kr-ref-label{grid-column:1/-1;display:flex;align-items:baseline;gap:9.6px;height:17px;}
.kr-ref-role{font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--text-secondary);}
.kr-ref-holds{font-size:12.5px;color:var(--text-muted);}
.kr-move{display:flex;align-items:flex-start;gap:6.4px;padding:7px 9px;border-radius:10px;background:var(--bg-elevated);border:1px solid var(--border-strong);font-size:13.1px;line-height:1.4;}
.kr-move-icon{color:var(--text-secondary);padding-top:2px;}
.kr-move-body{display:flex;flex:1;flex-direction:column;gap:3px;min-width:0;}
.kr-move-row{display:flex;align-items:baseline;gap:8px;}
.kr-move-label{flex:none;width:67px;font-size:10px;letter-spacing:.04em;text-transform:uppercase;color:var(--text-secondary);}
.kr-move-flag{margin-left:auto;padding:1px 6px;border-radius:6px;background:var(--yellow-soft);color:var(--yellow);font-size:10.9px;text-transform:uppercase;letter-spacing:.05em;}
.kr-dgrid{display:grid;grid-template-columns:108px 1fr 318px;column-gap:16px;}
.kr-dhead{background:var(--bg-elevated);padding:7.2px 11.2px;box-shadow:inset 0 -1px 0 var(--border);}
.kr-dhead-label{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--text-muted);}
.kr-drow{padding:8px 11.2px;border-bottom:1px solid var(--border);font-size:14.1px;}
.kr-drow:last-child{border-bottom:none;}
.kr-dfield{font-weight:600;}
.kr-dvalue{color:var(--text-primary);}
.kr-sc-body.focused{background:var(--accent-soft);}
.kr-sc-jump{padding-top:1.6px;padding-bottom:1.6px;}
.kr-sc-join{display:flex;align-items:center;gap:6.4px;font-size:11.5px;line-height:1.4;white-space:nowrap;color:var(--text-secondary);}
.kr-sc-join::after{content:"";flex:1 1 auto;margin-left:4.8px;border-top:1px dashed var(--border-strong);}
.kr-sc-staging{display:grid;grid-template-columns:auto 1fr;gap:4.8px 14.4px;margin:8px 0 0;padding:9.6px 12px;background:var(--bg-app);border:1px solid var(--border);border-radius:10px;font-size:12.8px;}
.kr-framing{display:inline-block;padding:2px 8px;border-radius:999px;background:var(--bg-elevated);color:var(--text-secondary);border:1px solid var(--border);font-size:11.2px;font-weight:600;letter-spacing:.02em;}
`;

const Icon = {
  check: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  sparkle: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
    </svg>
  ),
  plus: (s = 13) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  help: (s = 15) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.6M12 17.2h.01" />
    </svg>
  ),
  reset: (s = 13) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  ),
  play: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 4.5v15l12.5-7.5z" />
    </svg>
  ),
  toStart: (s = 13) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 4h2.5v16H5zM20 4.5v15L9 12z" />
    </svg>
  ),
  prev: (s = 13) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 5h2.5v14H6zM19 5v14l-9-7z" />
    </svg>
  ),
  next: (s = 13) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 5H18v14h-2.5zM5 5v14l9-7z" />
    </svg>
  ),
  loop: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  ),
  expand: (s = 13) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5" />
    </svg>
  ),
  bubble: (s = 13) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.4 8.4 0 0 1-12.2 7.5L3 21l2-5.6A8.4 8.4 0 1 1 21 11.5z" />
    </svg>
  ),
  grid: (s = 11) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" />
    </svg>
  ),
  clock: (s = 11) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  info: (s = 12) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 11v6M12 7.5h.01" />
    </svg>
  ),
  shots: (s = 13) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7.5" height="7.5" rx="1" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1" />
    </svg>
  ),
  film: (s = 13) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 3v18M16 3v18M4 8h4M4 16h4M16 8h4M16 16h4" />
    </svg>
  ),
  image: (s = 13) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  ),
  speaker: (s = 13) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
    </svg>
  ),
  book: (s = 12) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M5 3h12a2 2 0 0 1 2 2v16H7a2 2 0 0 1-2-2z" />
      <path d="M5 19a2 2 0 0 1 2-2h12" />
    </svg>
  ),
  pencil: (s = 12) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3l4 4L8 20H4v-4z" />
    </svg>
  ),
  close: (s = 12) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  ),
  menu: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  chevron: (s = 12) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 6 6 6-6 6" />
    </svg>
  ),
  minus: (s = 12) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M5 12h14" />
    </svg>
  ),
};

// ───────────────────────── shared chrome ─────────────────────────

export interface HeaderState {
  needsReview?: boolean;
  hideStale?: boolean;
  nextToReview?: number;
  /** The Accept all button, done or not; omitted where the page has none. */
  acceptAll?: boolean;
  /** The page's one Accept (the direction review), marked or not. */
  accept?: boolean;
  /** Unsent drafts on the page, which arm the Reset button. */
  dirty?: boolean;
}

/** The index pinned to the page's left edge; the page makes room for it. */
export interface RailSpec {
  width: number;
  children?: Children;
}

export interface ReviewFrameProps {
  /** The jsxImage canvas; the screen is laid out at 1920×1080 and scaled to it. */
  width: number;
  icon: Img;
  stage: "Direction" | "Reference" | "Animatic" | "Video";
  handoff?: string;
  header?: HeaderState;
  submit?: boolean;
  /** Pixels the page is scrolled down; the header, the index and the submit button stay put. */
  scroll?: number;
  rail?: RailSpec;
  children?: Children;
}

function Switch({ on, label }: { on: boolean; label: string }) {
  return (
    <div className="kr-toggle">
      <div className={on ? "kr-switch on" : "kr-switch"} />
      {label}
    </div>
  );
}

export function ReviewFrame(props: ReviewFrameProps) {
  const h = props.header ?? {};
  const mainStyle = props.rail ? { left: `${props.rail.width + 28}px`, right: "20px", maxWidth: "none", padding: "0" } : undefined;
  return (
    <div style={{ zoom: props.width / BASE_W }}>
      <style>{CSS}</style>
      <div className="kr">
        <div className="kr-header">
          <div className="kr-header-in">
            <div className="kr-brand">
              <Image src={props.icon} style={{ width: "22px", height: "22px", borderRadius: "5px" }} />
              konte
              <div className="kr-brand-sep" />
              <span className="kr-brand-stage">{props.stage}</span>
            </div>
            <div className="kr-hright">
              {h.needsReview !== undefined && <Switch on={h.needsReview} label="Needs review" />}
              <Switch on={h.hideStale ?? true} label="Hide stale notes" />
              <button className="kr-btn icon">{Icon.help()}</button>
              {h.nextToReview !== undefined && (
                <button className={h.nextToReview > 0 ? "kr-btn" : "kr-btn ghost"}>
                  Next to review {h.nextToReview > 0 && <span className="count">{h.nextToReview}</span>}
                </button>
              )}
              {h.acceptAll !== undefined &&
                (h.acceptAll ? (
                  <button className="kr-btn ok">{Icon.check(13)} All accepted</button>
                ) : (
                  <button className="kr-btn">{Icon.check(13)} Accept all</button>
                ))}
              <button className={h.dirty ? "kr-btn" : "kr-btn ghost"}>
                {Icon.reset()} Reset
              </button>
              {h.accept !== undefined && (
                <button className={h.accept ? "kr-btn ok" : "kr-btn"}>
                  {Icon.check(13)} {h.accept ? "Accepted" : "Accept"}
                </button>
              )}
            </div>
          </div>
        </div>
        {props.rail && (
          <>
            <div className="kr-rail" style={{ width: `${props.rail.width}px` }}>
              {props.rail.children}
            </div>
            <button className="kr-rail-toggle">{Icon.menu()}</button>
          </>
        )}
        <div className="kr-main" style={mainStyle}>
          <div style={{ marginTop: `${-(props.scroll ?? 0)}px` }}>
            {props.handoff && <HandoffBanner text={props.handoff} />}
            {props.children}
          </div>
        </div>
        {props.submit !== false && (
          <button className="kr-submit">
            Submit Review <span className="kr-kbd">Ctrl+⏎</span>
          </button>
        )}
      </div>
    </div>
  );
}

/** A titled group of the index. */
export function RailGroup({ title, children }: { title: string; children?: Children }) {
  return (
    <div className="kr-rail-group">
      <div className="kr-rail-title">{title}</div>
      {children}
    </div>
  );
}

/** One row of the index: a fold before the name, then its marks and count. */
export function RailRow(p: { name: string; current?: boolean; fold?: boolean; noted?: boolean; meta?: string | number; left?: number; done?: boolean }) {
  return (
    <div className={p.current ? "kr-rail-row current" : "kr-rail-row"}>
      {p.fold !== undefined && <span className={p.fold ? "kr-rail-fold open" : "kr-rail-fold"}>{Icon.chevron(12)}</span>}
      <span className="kr-rail-name">{p.name}</span>
      {p.noted && <span className="kr-rail-noted">{Icon.bubble(11)}</span>}
      {p.meta !== undefined && <span className="kr-rail-meta">{p.meta}</span>}
      {p.left ? <span className="kr-rail-left">{p.left}</span> : p.done ? <span className="kr-rail-done">{Icon.check(12)}</span> : null}
    </div>
  );
}

export function HandoffBanner({ text }: { text: string }) {
  return (
    <div className="kr-handoff">
      {Icon.sparkle(15)}
      <span>{text}</span>
    </div>
  );
}

// ───────────────────────── notes ─────────────────────────

export interface Note {
  text: string;
  /** Shot-local or reel time, as shown ("0:11"). */
  time?: string;
  /** Pin number on the frame; omitted for a plain comment. */
  pin?: number;
  /** Struck through: addressed by a later take. */
  stale?: boolean;
  /** Written in this session and not yet submitted: orange, with edit and delete. */
  draft?: boolean;
}

export function AgentNote({ text }: { text: string }) {
  return (
    <div className="kr-note agent">
      {Icon.sparkle(13)}
      <span>{text}</span>
    </div>
  );
}

export function HumanNote({ note }: { note: Note }) {
  const cls = ["kr-note human", note.stale ? "stale" : "", note.draft ? "draft" : ""].join(" ");
  return (
    <div className={cls}>
      <div className="kr-note-meta">
        {note.pin !== undefined ? (
          <span className={note.draft ? "kr-pin draft" : "kr-pin"}>
            <span>{note.pin}</span>
          </span>
        ) : (
          <span style={{ color: "var(--text-muted)" }}>{Icon.bubble(14)}</span>
        )}
        {note.time && <span className="kr-note-time">{note.time}</span>}
      </div>
      <span className="kr-note-text">{note.text}</span>
      {note.draft && (
        <span className="kr-note-tools">
          {Icon.pencil(13)}
          {Icon.close(13)}
        </span>
      )}
    </div>
  );
}

/** The comment box a click on the frame opens: what is typed so far, with confirm and cancel. */
export function NoteComposer({ text, caret = true }: { text: string; caret?: boolean }) {
  return (
    <div className="kr-composer">
      <div className="kr-composer-box">
        {text}
        {caret && <span className="kr-caret" />}
      </div>
      <button className="kr-composer-btn ok">{Icon.check(15)}</button>
      <button className="kr-composer-btn">{Icon.close(14)}</button>
    </div>
  );
}

/** A pin on the frame: numbered once written, a "+" while the reviewer is still typing. */
export function PinMark({ pin }: { pin: Pin }) {
  return (
    <div className="kr-pinmark" style={{ left: `${pin.x * 100}%`, top: `${pin.y * 100}%` }}>
      <span className={pin.state ? "kr-pin draft" : "kr-pin"}>
        <span>{pin.state === "placing" ? "+" : pin.n}</span>
      </span>
    </div>
  );
}

function AddNote() {
  return (
    <button className="kr-add">
      {Icon.plus()} Add note
    </button>
  );
}

function AcceptPill({ on, wide }: { on: boolean; wide?: boolean }) {
  const style = wide ? { width: "100%", justifyContent: "center" } : undefined;
  return on ? (
    <button className="kr-accept on" style={style}>
      {Icon.check(13)} Accepted
    </button>
  ) : (
    <button className="kr-accept" style={style}>
      {Icon.check(13)} Accept
    </button>
  );
}

// ───────────────────────── reel (animatic / video) ─────────────────────────

export interface Pin {
  n: number;
  /** 0–1 across the frame. */
  x: number;
  y: number;
  /** `placing`: just clicked, the comment still being typed; `draft`: written, not yet submitted. */
  state?: "placing" | "draft";
}

export interface TimelineShot {
  id: string;
  duration: number;
  accepted?: boolean;
  changed?: boolean;
}

export interface TimelineClip {
  label: string;
  /** Seconds on the reel clock. */
  start: number;
  end: number;
  kind: "video" | "image" | "audio" | "line";
  takes?: number;
  /** Takes awaiting a verdict, shown as "N new". */
  fresh?: number;
  /** One of the takes is accepted: a check. */
  accepted?: boolean;
}

export interface TimelineRow {
  label: string;
  icon: "film" | "image" | "speaker";
  clips: TimelineClip[];
  /** Two stacked lanes, as the audio row is with a bed and the lines. */
  lanes?: 1 | 2;
}

export interface TimelineProps {
  shots: TimelineShot[];
  rows: TimelineRow[];
  playhead: number;
  selected?: string;
  /** Visible window in seconds; defaults to the whole reel. */
  view?: [number, number];
}

export interface ShotCardData {
  id: string;
  action: string;
  accepted?: boolean;
  changed?: boolean;
  comments?: number;
}

export type PanelPosition = "key" | "opening" | "landing" | "mid";

const POSITION_TEXT: Record<PanelPosition, string> = {
  key: "Key: the shot's defining moment",
  opening: "Opening: motion starts here",
  landing: "Landing: motion ends here",
  mid: "Mid: motion in progress",
};

export interface FeedbackData {
  target: string;
  /** New takes across the target's assets, shown on its Takes button. */
  fresh?: number;
  line?: { speaker: string; text: string; acting: string };
  /** The panel's position in the shot, shown with konte's own wording; the animatic review only. */
  position?: PanelPosition;
  blocking?: string;
  camera?: string;
  agent?: string;
  notes?: Note[];
  /** The open comment box and what is typed in it; replaces Add note while open. */
  composer?: string;
}

export interface ReelReviewProps extends Omit<ReviewFrameProps, "children"> {
  frame?: Img;
  /** Replaces `frame` in the player: stacked images or a playing clip. */
  media?: Children;
  pins?: Pin[];
  title?: string;
  time: string;
  total: string;
  timeline: TimelineProps;
  feedback: FeedbackData;
  shots: ShotCardData[];
  /** Index of the first shot card shown; the column scrolls. */
  shotsFrom?: number;
  soundtrack?: { accepted: boolean };
}

function fmt(t: number) {
  const m = Math.floor(t / 60);
  const s = t - m * 60;
  return `${m}:${String(Math.round(s)).padStart(2, "0")}`;
}

function Timeline(p: TimelineProps & { width: number }) {
  const total = p.shots.reduce((a, s) => a + s.duration, 0);
  const [v0, v1] = p.view ?? [0, total];
  const trackW = p.width - 86 - 8;
  const x = (t: number) => ((t - v0) / (v1 - v0)) * trackW;
  const span = v1 - v0;
  const step = span > 12 ? 5 : span > 4 ? 1 : 0.5;
  const ticks: number[] = [];
  for (let t = Math.ceil(v0 / step) * step; t <= v1 + 1e-6; t += step) ticks.push(t);
  let acc = 0;
  const shotPos = p.shots.map((s) => {
    const r = { ...s, start: acc, end: acc + s.duration };
    acc += s.duration;
    return r;
  });
  const rowH = 34;
  const rowsTop = 70;
  let y = rowsTop;
  const rowYs = p.rows.map((r) => {
    const top = y;
    y += (r.lanes ?? 1) * rowH;
    return top;
  });
  const height = y + 6;
  const clipStyle = (s: number, e: number, top: number) => ({
    left: `${Math.max(x(s), 0) + 1}px`,
    width: `${Math.max(Math.min(x(e), trackW) - Math.max(x(s), 0) - 2, 0)}px`,
    top: `${top}px`,
    height: "26px",
  });
  return (
    <div className="kr-panel kr-tl" style={{ height: `${height}px`, overflow: "hidden" }}>
      <div className="kr-tl-track" style={{ top: "6px", height: "26px", right: "8px", borderBottom: "1px solid var(--border-strong)" }}>
        {ticks.map((t) => (
          <div style={{ position: "absolute", left: `${x(t)}px`, top: "4px", fontSize: "10.5px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            {step < 1 ? `0:${t < 10 ? "0" : ""}${t.toFixed(1)}` : fmt(t)}
          </div>
        ))}
      </div>
      <div className="kr-tl-label" style={{ top: "40px", height: "26px" }}>
        {Icon.shots()} Shot
      </div>
      <div className="kr-tl-track" style={{ top: "0", bottom: "0", right: "8px" }}>
        {shotPos
          .filter((s) => s.end > v0 && s.start < v1)
          .map((s) => {
            const cls = ["kr-clip shot", s.accepted ? "acc" : "", p.selected === s.id ? "sel" : ""].join(" ");
            return (
              <div className={cls} style={clipStyle(s.start, s.end, 40)}>
                <b>{s.id}</b>
                <span style={{ color: "var(--text-muted)" }}>{s.duration}s</span>
                {s.changed && <span className="kr-badge changed">Changed</span>}
              </div>
            );
          })}
        {p.rows.map((r, ri) =>
          r.clips
            .filter((c) => c.end > v0 && c.start < v1)
            .map((c, ci) => {
              const lane = r.lanes === 2 && c.kind === "audio" && ci > 0 ? 1 : 0;
              const sel = shotPos.find((s) => s.id === p.selected);
              const isSel = sel && c.kind !== "audio" && c.start >= sel.start && c.end <= sel.end;
              return (
                <div
                  className={`kr-clip ${c.kind}${isSel ? " sel" : ""}`}
                  style={clipStyle(c.start, c.end, rowYs[ri]! + lane * rowH + 4)}
                >
                  <span>{c.label}</span>
                  {c.takes !== undefined && (
                    <span className="kr-clip-open">
                      {Icon.grid()} {c.takes}
                      {c.fresh ? <span className="kr-chip new">{c.fresh} new</span> : null}
                      {c.accepted && <span className="kr-chip ok">{Icon.check(10)}</span>}
                    </span>
                  )}
                  <span className="kr-clip-open">{Icon.info(11)}</span>
                </div>
              );
            }),
        )}
        <div
          className="kr-playhead"
          style={{
            position: "absolute",
            left: `${x(p.playhead)}px`,
            top: "6px",
            bottom: "4px",
            width: "2px",
            background: "#fff",
          }}
        >
          <div style={{ position: "absolute", top: "-2px", left: "-6px", width: "14px", height: "14px", borderRadius: "50%", background: "#fff", border: "3px solid var(--accent)" }} />
        </div>
      </div>
      {p.rows.map((r, ri) => (
        <div className="kr-tl-label" style={{ top: `${rowYs[ri]! + 4}px`, height: `${(r.lanes ?? 1) * rowH - 8}px` }}>
          {Icon[r.icon]()} {r.label}
        </div>
      ))}
      <div style={{ position: "absolute", right: "16px", bottom: "8px", display: "flex", gap: "6px" }}>
        {[Icon.minus(), Icon.expand(12), Icon.plus(12)].map((ic) => (
          <button className="kr-tbtn" style={{ width: "26px", height: "26px", borderRadius: "50%" }}>
            {ic}
          </button>
        ))}
      </div>
    </div>
  );
}

function Player({ frame, media, pins, title, width }: { frame?: Img; media?: Children; pins?: Pin[]; title?: string; width: number }) {
  const height = (width * 9) / 16;
  return (
    <div className="kr-player" style={{ width: `${width}px`, height: `${height}px` }}>
      {media ?? (frame && <Image src={frame} fill />)}
      {title && (
        <div className="kr-player-title" style={{ fontSize: `${width * 0.052}px` }}>
          {title}
        </div>
      )}
      {(pins ?? []).map((p) => (
            <PinMark pin={p} />
          ))}
    </div>
  );
}

function Transport({ time, total }: { time: string; total: string }) {
  return (
    <div className="kr-panel kr-transport">
      <button className="kr-tbtn">{Icon.toStart()}</button>
      <button className="kr-tbtn">{Icon.prev()}</button>
      <button className="kr-tbtn play">{Icon.play()}</button>
      <button className="kr-tbtn">{Icon.next()}</button>
      <button className="kr-tbtn">{Icon.loop()}</button>
      <button className="kr-tbtn wide" style={{ width: "62px", justifyContent: "space-between" }}>
        1×
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <button className="kr-tbtn notes">{Icon.bubble()} Notes</button>
      <button className="kr-tbtn">{Icon.expand()}</button>
      <div className="kr-time">
        <span className="kr-time-now">{time}</span> / {total}
      </div>
    </div>
  );
}

/** The reel review's sidebar: titled by its target, the read-only context on top, the comments under a Feedback head. */
export function FeedbackPanel({ data, board = false }: { data: FeedbackData; board?: boolean }) {
  const notes = data.notes ?? [];
  const position = board ? data.position : undefined;
  return (
    <div className="kr-panel" style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
      <div className="kr-tp-title">
        <span className="kr-label">{data.target}</span>
        <button className="kr-takes">
          {Icon.grid(12)} Takes
          {data.fresh ? <span className="kr-tag-new">{data.fresh} new</span> : null}
        </button>
      </div>
      {data.line && (
        <div className="kr-note">
          <div className="kr-line">
            <span style={{ color: "var(--text-muted)", marginTop: "2px" }}>{Icon.speaker(13)}</span>
            <span>
              <b>{data.line.speaker}:</b> {data.line.text} <i>{data.line.acting}</i>
            </span>
          </div>
        </div>
      )}
      {(position || data.blocking || data.camera) && (
        <div className="kr-note">
          <div className="kr-kv">
            {[
              ["Position", position && POSITION_TEXT[position]],
              ["Blocking", data.blocking],
              ["Camera", data.camera],
            ]
              .filter(([, v]) => v)
              .map(([k, v], i) => [
                <div className="kr-kv-k" style={{ display: "flex", gap: "6px" }}>
                  {i === 0 ? Icon.film(11) : <span style={{ width: "11px" }} />} {k}
                </div>,
                <div className="kr-kv-v">{v}</div>,
              ])}
          </div>
        </div>
      )}
      {data.agent && <AgentNote text={data.agent} />}
      <div className="kr-tp-head">
        <span className="kr-label" style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
          Feedback
        </span>
        {notes.length > 0 && <span className="kr-tp-count">{notes.length}</span>}
      </div>
      {notes.length === 0 && (
        <div className="kr-empty" style={{ marginTop: "-5px" }}>
          No notes on this shot yet. Add one below, or click the frame to pin one.
        </div>
      )}
      {notes.map((n) => (
        <HumanNote note={n} />
      ))}
      {data.composer !== undefined ? <NoteComposer text={data.composer} /> : <AddNote />}
    </div>
  );
}

function ShotCard({ shot, selected }: { shot: ShotCardData; selected: boolean }) {
  return (
    <div className={selected ? "kr-shotcard sel" : "kr-shotcard"}>
      <div className="kr-shotcard-head">
        {shot.accepted && <span className="kr-dot" />}
        Shot {shot.id}
        {shot.comments ? (
          <span className="kr-shotcard-c">
            {Icon.bubble(11)} {shot.comments}
          </span>
        ) : null}
        {shot.changed && <span className="kr-badge changed">Changed</span>}
      </div>
      <div className="kr-shotcard-action">{shot.action}</div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
        <AcceptPill on={!!shot.accepted} />
      </div>
    </div>
  );
}

export function ShotList(p: { shots: ShotCardData[]; selected?: string; from?: number; height: number }) {
  const accepted = p.shots.filter((s) => s.accepted).length;
  const pct = Math.round((accepted / p.shots.length) * 100);
  const pending = p.shots.length - accepted;
  return (
    <div className="kr-panel" style={{ padding: "14px", height: `${p.height}px`, overflow: "hidden", display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="kr-label">Shots</span>
        <button className="kr-btn" style={{ height: "30px", fontSize: "12px" }}>
          Next to review <span className="count">{pending}</span>
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", color: "var(--text-secondary)" }}>
        <span>
          {accepted} of {p.shots.length} accepted
        </span>
        <span>{pct}%</span>
      </div>
      <div className="kr-progress">
        <div style={{ width: `${pct}%` }} />
      </div>
      {p.shots.slice(p.from ?? 0).map((s) => (
        <ShotCard shot={s} selected={s.id === p.selected} />
      ))}
    </div>
  );
}

/** The animatic and video review page: player, transport, timeline, feedback, shot list. */
export function ReelReview(p: ReelReviewProps) {
  const playerW = 823;
  const sideTop = p.soundtrack ? 112 : 0;
  return (
    <ReviewFrame {...p}>
      <div style={{ display: "flex", gap: "17px" }}>
        <div style={{ width: `${playerW}px`, display: "flex", flexDirection: "column", gap: "12px" }}>
          <Player frame={p.frame} media={p.media} pins={p.pins} title={p.title} width={playerW} />
          <Transport time={p.time} total={p.total} />
          <Timeline {...p.timeline} width={playerW} />
        </div>
        <div style={{ width: "445px" }}>
          <FeedbackPanel data={p.feedback} board={p.stage === "Animatic"} />
        </div>
        <div style={{ width: "258px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {p.soundtrack && (
            <div className="kr-panel" style={{ padding: "14px", height: `${sideTop - 14}px` }}>
              <div className="kr-label" style={{ marginBottom: "12px" }}>
                Soundtrack
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button className={p.soundtrack.accepted ? "kr-accept on" : "kr-accept"} style={{ width: "100%", justifyContent: "center" }}>
                  {Icon.check(13)} {p.soundtrack.accepted ? "Accepted" : "Accept"}
                </button>
              </div>
            </div>
          )}
          <ShotList shots={p.shots} selected={p.timeline.selected} from={p.shotsFrom} height={835 - sideTop} />
        </div>
      </div>
    </ReviewFrame>
  );
}

// ───────────────────────── reference ─────────────────────────

export interface ReferenceRowData {
  /** The asset's name, tagged on its frame. */
  name: string;
  /** What the row is inside its subject ("Look", "Voice", "Master"); omitted where the subject's name says it. */
  label?: string;
  /** The landmarks a view holds, beside its label. */
  holds?: string;
  /** An image asset; omitted for an audio row, which shows the player instead. */
  image?: Img;
  /** Width over height of the image. */
  aspect?: number;
  takes?: number;
  /** Takes awaiting a verdict, shown as "N new". */
  fresh?: number;
  roster?: { kind: string; name: string; description: string; needsReview?: boolean };
  /** The lines a voice sample's character speaks. */
  lines?: { text: string; acting?: string }[];
  agent?: string;
  notes?: Note[];
  pins?: Pin[];
  accepted?: boolean;
  focused?: boolean;
}

export interface ReferenceSubjectData {
  kind: "Character" | "Narrator" | "Prop" | "Place" | "Song" | "Material";
  name: string;
  rows: ReferenceRowData[];
}

export interface ReferenceSectionData {
  title: "Cast" | "Props" | "Places" | "Sound" | "Materials";
  subjects: ReferenceSubjectData[];
}

export interface ReferenceReviewProps extends Omit<ReviewFrameProps, "children" | "stage" | "rail"> {
  sections: ReferenceSectionData[];
  /** The subject the index marks as being read. */
  current?: string;
}

const REF_RAIL_W = 208;
/** The subjects' column: 1600px wide, centered beside the index. */
const REF_COL_W = 1600;
const REF_MEDIA_W = 940;
const REF_IMAGE_MAX_H = 842;
const REF_AUDIO_H = 136;

const refImageH = (r: ReferenceRowData) => Math.min(REF_IMAGE_MAX_H, REF_MEDIA_W / (r.aspect ?? 16 / 9));
const refRowH = (r: ReferenceRowData) => 28.8 + (r.label ? 26.6 : 0) + (r.image ? refImageH(r) : REF_AUDIO_H);
const refSubjectH = (s: ReferenceSubjectData) => 48 + s.rows.reduce((a, r, i) => a + refRowH(r) + (i > 0 ? 1 : 0), 0) + 1;

/** Each subject card's top, by name, measured from the top of the page under the handoff banner. */
export function referenceSubjectTops(sections: ReferenceSectionData[]): Record<string, number> {
  const out: Record<string, number> = {};
  let y = 0;
  sections.forEach((sec, si) => {
    if (si > 0) y += 25.6;
    y += 30.4;
    sec.subjects.forEach((sub, i) => {
      if (i > 0) y += 14.4;
      out[sub.name] = y;
      y += refSubjectH(sub);
    });
  });
  return out;
}

function MediaTools({ a }: { a: ReferenceRowData }) {
  return (
    <div className="kr-media-tools">
      {a.takes !== undefined && (
        <button className="kr-media-tool">
          {Icon.grid(12)} {a.takes} {a.takes === 1 ? "take" : "takes"}
          {a.fresh ? <span className="kr-tag-new">{a.fresh} new</span> : null}
          {a.accepted && <span className="kr-chip ok">{Icon.check(10)}</span>}
        </button>
      )}
      <button className="kr-media-tool">{Icon.expand(13)}</button>
    </div>
  );
}

function ImageMedia({ a }: { a: ReferenceRowData }) {
  const h = refImageH(a);
  const w = h * (a.aspect ?? 16 / 9);
  return (
    <div className="kr-media" style={{ height: `${h}px` }}>
      <div style={{ position: "absolute", top: "0", bottom: "0", left: `${(REF_MEDIA_W - w) / 2}px`, width: `${w}px` }}>
        <Image src={a.image!} fill />
        {(a.pins ?? []).map((p) => (
          <PinMark pin={p} />
        ))}
      </div>
      <div className="kr-media-tag">{a.name}</div>
      <MediaTools a={a} />
    </div>
  );
}

function AudioMedia({ a }: { a: ReferenceRowData }) {
  return (
    <div className="kr-media" style={{ height: `${REF_AUDIO_H}px` }}>
      <div className="kr-media-tag">{a.name}</div>
      <MediaTools a={a} />
      <div style={{ position: "absolute", top: "46px", left: "0", right: "0", display: "flex", justifyContent: "center", color: "var(--text-muted)" }}>
        {Icon.speaker(32)}
      </div>
      <div className="kr-audio">
        <span style={{ color: "#111" }}>{Icon.play(13)}</span>
        <span className="kr-audio-time">0:00 / 0:00</span>
        <div className="kr-audio-bar" />
        <span style={{ color: "#777" }}>{Icon.speaker(14)}</span>
        <span className="kr-audio-more">⋮</span>
      </div>
    </div>
  );
}

/** A direction card in the notes column: a label column, then its text. */
function MoveCard({ rows, flag }: { rows: [string | null, Children][]; flag?: string }) {
  return (
    <div className="kr-move">
      <span className="kr-move-icon">{Icon.film(12)}</span>
      <span className="kr-move-body">
        {rows.map(([label, text], i) => (
          <span className="kr-move-row">
            {label !== null && <span className="kr-move-label">{label}</span>}
            <span>{text}</span>
            {i === 0 && flag && <span className="kr-move-flag">{flag}</span>}
          </span>
        ))}
      </span>
    </div>
  );
}

function ReferenceRow({ a }: { a: ReferenceRowData }) {
  const audio = !a.image;
  return (
    <div className={a.focused ? "kr-ref-row focused" : "kr-ref-row"}>
      {a.label && (
        <div className="kr-ref-label">
          <span className="kr-ref-role">{a.label}</span>
          {a.holds && <span className="kr-ref-holds">{a.holds}</span>}
        </div>
      )}
      {audio ? <AudioMedia a={a} /> : <ImageMedia a={a} />}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "0" }}>
        {a.roster && <MoveCard rows={[[a.roster.kind, a.roster.name], [null, a.roster.description]]} flag={a.roster.needsReview ? "needs review" : undefined} />}
        {a.lines && a.lines.length > 0 && (
          <MoveCard
            rows={a.lines.map((l, i): [string, Children] => [
              i === 0 ? "Lines" : "",
              <>
                {l.text}
                {l.acting && <span style={{ color: "var(--text-muted)" }}> ({l.acting})</span>}
              </>,
            ])}
          />
        )}
        {a.agent && <AgentNote text={a.agent} />}
        {(a.notes ?? []).length === 0 && (
          <div className="kr-empty">
            {audio ? "No notes on this asset yet. Add one below." : "No notes on this asset yet. Add one below, or click the frame to pin one."}
          </div>
        )}
        {(a.notes ?? []).map((n) => (
          <HumanNote note={n} />
        ))}
        <AddNote />
      </div>
      <div>
        <AcceptPill on={!!a.accepted} wide />
      </div>
    </div>
  );
}

function ReferenceSubject({ s }: { s: ReferenceSubjectData }) {
  const done = s.rows.filter((r) => r.accepted).length;
  return (
    <div className="kr-subject">
      <div className="kr-subject-head">
        <span className="kr-subject-kind">{s.kind}</span>
        <span className="kr-subject-name">{s.name}</span>
        {s.rows.length > 1 && (
          <span className="kr-subject-progress">
            {done}/{s.rows.length} accepted
          </span>
        )}
        {s.rows.length > 1 && done < s.rows.length && (
          <button className="kr-btn" style={{ color: "var(--text-secondary)" }}>
            {Icon.check(13)} Accept all
          </button>
        )}
      </div>
      {s.rows.map((r) => (
        <ReferenceRow a={r} />
      ))}
    </div>
  );
}

/** The reference review page: a card per subject the direction names, a row per asset under it, the index on the left. */
export function ReferenceReview(p: ReferenceReviewProps) {
  const rail = (
    <div className="kr-rail-scroll">
      {p.sections.map((sec) => (
        <RailGroup title={sec.title}>
          {sec.subjects.map((sub) => {
            const left = sub.rows.filter((r) => !r.accepted).length;
            return <RailRow name={sub.name} current={sub.name === p.current} noted={sub.rows.some((r) => (r.notes ?? []).length > 0)} left={left} done={left === 0} />;
          })}
        </RailGroup>
      ))}
    </div>
  );
  return (
    <ReviewFrame {...p} stage="Reference" rail={{ width: REF_RAIL_W, children: rail }}>
      <div style={{ maxWidth: `${REF_COL_W}px`, margin: "0 auto" }}>
        {p.sections.map((sec, i) => (
          <div style={{ marginTop: i > 0 ? "25.6px" : "0" }}>
            <div className="kr-group-title">{sec.title}</div>
            {sec.subjects.map((sub, j) => (
              <div style={{ marginTop: j > 0 ? "14.4px" : "0" }}>
                <ReferenceSubject s={sub} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </ReviewFrame>
  );
}

// ───────────────────────── direction ─────────────────────────

export interface DirectionField {
  field: string;
  value: string | string[];
  agent?: string;
  notes?: Note[];
}

export interface DirectionShotRow {
  id: string;
  /** The dramatic function, shown under the shot's staging. */
  role: string;
  /** The stripe beside the shot and its cell in the index. */
  roleTone?: "opening" | "rising" | "turn" | "payoff" | "closing";
  action: string;
  line?: { speaker: string; text: string; acting: string };
  telop?: string;
  place: string;
  framing: string;
  setup: string;
  lineup: string;
  props?: string[];
  duration: number;
  /** A time jump into the shot, headed above it. */
  join?: "jump-back" | "jump-forward";
  /** The staging folded open under the shot. */
  staging?: boolean;
  focused?: boolean;
  agent?: string;
  notes?: Note[];
}

/** An index entry: a roster part and the number of shots showing it. */
export interface DirectionEntry {
  name: string;
  shots: number;
  noted?: boolean;
}

export interface DirectionReviewProps extends Omit<ReviewFrameProps, "children" | "stage" | "rail"> {
  shots: DirectionShotRow[];
  cast: DirectionEntry[];
  props?: DirectionEntry[];
  places: DirectionEntry[];
  brief: DirectionField[];
  policy: DirectionField[];
}

const DIR_RAIL_W = 280;
const DIR_PAGE_W = 1152;

const TONE_COLOR = {
  opening: ["#8a93a6", "rgba(138,147,166,.16)"],
  rising: ["#a99fff", "rgba(110,98,245,.18)"],
  turn: ["#f59e4b", "rgba(245,158,75,.18)"],
  payoff: ["#30c98e", "rgba(48,201,142,.18)"],
  closing: ["#4fb8c9", "rgba(79,184,201,.16)"],
} as const;

const JOIN_LABEL = { "jump-back": "time jumps back", "jump-forward": "time jumps forward" };

function DirectionRail(p: DirectionReviewProps) {
  const total = p.shots.reduce((a, r) => a + r.duration, 0);
  return (
    <div className="kr-rail-scroll" style={{ fontSize: "13.4px" }}>
      <RailGroup title="Flow">
        <RailRow name="Whole piece" meta={`${p.shots.length} shots · ${fmt(total)}`} />
        <div className="kr-rail-shots">
          {p.shots.map((s) => {
            const [c, soft] = TONE_COLOR[s.roleTone ?? "opening"];
            return (
              <span className={s.focused ? "kr-rail-shot cur" : "kr-rail-shot"} style={{ color: c, background: soft, borderColor: s.focused ? c : "transparent" }}>
                {s.id}
              </span>
            );
          })}
        </div>
      </RailGroup>
      <RailGroup title="Cast">
        {p.cast.map((e) => (
          <RailRow name={e.name} noted={e.noted} meta={e.shots} />
        ))}
      </RailGroup>
      {p.props && p.props.length > 0 && (
        <RailGroup title="Props">
          {p.props.map((e) => (
            <RailRow name={e.name} noted={e.noted} meta={e.shots} />
          ))}
        </RailGroup>
      )}
      <RailGroup title="Places">
        {p.places.map((e) => (
          <RailRow name={e.name} fold={false} noted={e.noted} meta={e.shots} />
        ))}
      </RailGroup>
      <RailGroup title="More">
        <RailRow name="Brief" noted={p.brief.some((f) => f.agent || (f.notes ?? []).length > 0)} />
        <RailRow name="Policy" noted={p.policy.some((f) => f.agent || (f.notes ?? []).length > 0)} />
      </RailGroup>
    </div>
  );
}

function DirectionTable({ title, head, fields }: { title: string; head: string; fields: DirectionField[] }) {
  return (
    <div style={{ marginTop: "41.6px" }}>
      <div className="kr-group-title" style={{ margin: "0" }}>
        {title}
      </div>
      <div style={{ marginTop: "12.8px" }}>
        <div className="kr-dgrid kr-dhead">
          {[head, "Value", "Notes"].map((l) => (
            <span className="kr-dhead-label">{l}</span>
          ))}
        </div>
        {fields.map((f) => (
          <div className="kr-dgrid kr-drow">
            <div className="kr-dfield">{f.field}</div>
            <div className="kr-dvalue">
              {Array.isArray(f.value) ? (
                <ul>
                  {f.value.map((v) => (
                    <li>{v}</li>
                  ))}
                </ul>
              ) : (
                f.value
              )}
            </div>
            <div className="kr-dnotes">
              {f.agent && <AgentNote text={f.agent} />}
              {(f.notes ?? []).map((n) => (
                <HumanNote note={n} />
              ))}
              <AddNote />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The direction review page: the shots as a script, the brief and the policy under it, the index on the left; the header's Accept signs it all. */
export function DirectionReview(p: DirectionReviewProps) {
  return (
    <ReviewFrame {...p} stage="Direction" rail={{ width: DIR_RAIL_W, children: <DirectionRail {...p} /> }}>
      <div style={{ maxWidth: `${DIR_PAGE_W}px`, margin: "0 auto" }}>
        <ShotScript rows={p.shots} />
        <DirectionTable title="Brief" head="Field" fields={p.brief} />
        <DirectionTable title="Policy" head="Field" fields={p.policy} />
      </div>
    </ReviewFrame>
  );
}

const chevron = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 6 6 6-6 6" />
  </svg>
);

/** The direction's shots as a screenplay: the clock in the gutter, the shot in the column, its notes in the margin. */
function ShotScript({ rows }: { rows: DirectionShotRow[] }) {
  let clock = 0;
  return (
    <div className="kr-sc">
      {rows.map((r, i) => {
        const start = clock;
        clock += r.duration;
        const scene = i === 0 || rows[i - 1]!.place !== r.place;
        return [
          r.join && (
            <div className="kr-sc-row">
              <div className="kr-sc-gutter" />
              <div className="kr-sc-body kr-sc-jump">
                <span className="kr-sc-join">{JOIN_LABEL[r.join]}</span>
              </div>
              <div className="kr-sc-notes" />
            </div>
          ),
          scene && (
            <div className="kr-sc-row">
              <div className="kr-sc-gutter" />
              <div className="kr-sc-body kr-sc-scene">○ {r.place}</div>
            </div>
          ),
          <div className="kr-sc-row">
            <div className="kr-sc-gutter">
              <span className="kr-sc-id">{r.id}</span>
              {fmt(Math.floor(start))} · {r.duration}s
            </div>
            <div className={r.focused ? "kr-sc-body focused" : "kr-sc-body"} style={{ borderLeftColor: TONE_COLOR[r.roleTone ?? "opening"][0] }}>
              <p className="kr-sc-action">
                <span className={r.staging ? "kr-sc-chev open" : "kr-sc-chev"}>{chevron}</span>
                {r.action}
              </p>
              {r.line && (
                <div className="kr-sc-line">
                  <span className="kr-sc-speaker">{r.line.speaker}</span>
                  <span className="kr-sc-acting">（{r.line.acting}）</span>
                  <span className="kr-sc-text">{r.line.text}</span>
                </div>
              )}
              {r.telop && (
                <p className="kr-sc-aside">
                  <span className="kr-sc-label">Telop</span>
                  {r.telop}
                </p>
              )}
              {r.staging && (
                <dl className="kr-sc-staging">
                  <dt>Does</dt>
                  <dd>{r.role}</dd>
                  <dt>Where</dt>
                  <dd style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-start" }}>
                    <span>{r.place}</span>
                    <span>
                      <span className="kr-framing">{r.framing}</span> {r.setup}
                    </span>
                  </dd>
                  <dt>Lineup (L→R)</dt>
                  <dd>{r.lineup}</dd>
                  {r.props && r.props.length > 0 && [<dt>Props</dt>, <dd>{r.props.join(" · ")}</dd>]}
                </dl>
              )}
            </div>
            <div className="kr-sc-notes">
              {r.agent && <AgentNote text={r.agent} />}
              {(r.notes ?? []).map((n) => (
                <HumanNote note={n} />
              ))}
              <AddNote />
            </div>
          </div>,
        ];
      })}
    </div>
  );
}
