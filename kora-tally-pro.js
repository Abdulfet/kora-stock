// =============================================================================
// ኮራ ስቶክ — Flagship 1-Screen Tally Engine (kora-tally-pro.js — v27)
// • ስማርት ካፕሱል (4 ረድፎችን ወደ 1 ቀጭን መስመር + ◀/▶ ፈጣን የዕቃ መቀያየሪያ + ×5 ▾)
// • Ergonomic Split: የአደጋ ቀጠናን ማጥፋት (መልስ/+ጎዶሎ/Long-Press አጽዳ/መዝግብ ከላይ፣
//   ዋናው 62px ቀስቃሽ ብቻውን ከታች)
// • ብልህ «የመጨረሻ ጎዶሎ» (+X ጨርስ) + ግቡ ሲሞላ የሚያበራ አረንጓዴ መዝግብ ቁልፍ
// • ንጹህ የሰዓት ቆጣሪ (>1ሰ / ከ1 ቀን በፊት) + 7 የቆጠራ ሲስተሞች + ኦፍላይን የድምፅ ስቱዲዮ
// =============================================================================
(function (global) {
  'use strict';

  const VOICE_DB = 'kora_voice_packs_v1';
  const VOICE_STORE = 'packs';
  const PRESETS = [1, 2, 3, 5, 10, 15, 20];

  const ICONS = {
    lock: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    unlock: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.6-1.7"/></svg>',
    gear: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    undo: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>',
    plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    bolt: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg>',
    chevL: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m15 18-6-6 6-6"/></svg>',
    chevR: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m9 18 6-6-6-6"/></svg>',
    chevD: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>',
    clock: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    truck: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M14 9h5l3 4v4h-3"/><circle cx="7.5" cy="17.5" r="2"/><circle cx="16.5" cy="17.5" r="2"/></svg>',
    box: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></svg>',
    note: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>'
  };

  const TALLY_MODES = [
    { id: 'tap',      am: 'መደበኛ ንኪኪ (10-ዙር)',      en: 'Standard Tap (10-Box)' },
    { id: 'swipe',    am: 'መንሸራተቻ (Slide-Gate)',     en: 'Slide-Gate Count' },
    { id: 'pingpong', am: 'ተቀያያሪ ግራና ቀኝ (Ping-Pong)', en: 'Alternating L/R' },
    { id: 'carriers', am: 'ባለብዙ-ተሸካሚ (2–4 ጫኞች)',  en: 'Multi-Carrier (2–4)' },
    { id: 'mixed',    am: 'ተቀያያሪ ሸክም (Mixed Pad)', en: 'Mixed Load Pad' },
    { id: 'clicker',  am: 'ብሉቱዝ / ኪቦርድ ቆጣሪ',      en: 'Bluetooth / Key Clicker' },
    { id: 'weight',   am: 'የክብደት / ጥቅል ቀያሪ',       en: 'Weight & Pack Calc' },
    { id: 'camera',   am: 'የካሜራ በር ቆጣሪ (Tripwire)', en: 'Camera Tripwire' }
  ];

  const VOICE_KEYS = [
    { k: '1', am: '1 (አንድ)' }, { k: '2', am: '2 (ሁለት)' }, { k: '3', am: '3 (ሦስት)' },
    { k: '4', am: '4 (አራት)' }, { k: '5', am: '5 (አምስት)' }, { k: '6', am: '6 (ስድስት)' },
    { k: '7', am: '7 (ሰባት)' }, { k: '8', am: '8 (ስምንት)' }, { k: '9', am: '9 (ዘጠኝ)' },
    { k: '10', am: '10 (አሥር)' }, { k: '15', am: '15 (አሥራ አምስት)' },
    { k: '20', am: '20 (ሃያ)' }, { k: '30', am: '30 (ሠላሳ)' }, { k: '40', am: '40 (አርባ)' },
    { k: '50', am: '50 (ሃምሳ)' }, { k: '60', am: '60 (ስድሳ)' }, { k: '70', am: '70 (ሰባ)' },
    { k: '80', am: '80 (ሰማንያ)' }, { k: '90', am: '90 (ዘጠና)' }, { k: '100', am: '100 (መቶ)' },
    { k: 'load', am: '«ሸክም»' }, { k: 'done', am: '«ግቡ ሞልቷል»' }
  ];

  const AM_PHONETIC = {
    1: 'and', 2: 'hulet', 3: 'sost', 4: 'arat', 5: 'amist',
    6: 'sidist', 7: 'sebat', 8: 'simint', 9: 'zetegn', 10: 'asir',
    11: 'asra and', 12: 'asra hulet', 13: 'asra sost', 14: 'asra arat', 15: 'asra amist',
    16: 'asra sidist', 17: 'asra sebat', 18: 'asra simint', 19: 'asra zetegn',
    20: 'haya', 30: 'selasa', 40: 'arba', 50: 'hamsa',
    60: 'sidsa', 70: 'seba', 80: 'semanya', 90: 'zetena', 100: 'meto'
  };

  let detectedStrokeFmt = null;
  let lastTapTs = 0;
  let pingPongSide = 'L';
  let camStream = null, camRafId = null, camCanvas = null, camCtx = null;
  let camPrevL = null, camPrevR = null, camLastTrig = 0, camLastZone = null, camLastZoneTs = 0;
  let timerId = null, hooksReady = false, origCommitFn = null;
  let clearHoldTimer = null, clearHoldDone = false;

  // ---------------------------------------------------------------------------
  // 1. መሠረታዊ አጋዥ ፋንክሽኖች
  // ---------------------------------------------------------------------------
  function hasState() { return typeof state !== 'undefined' && state && typeof state === 'object'; }
  function isAm() { return !hasState() || state.lang !== 'en'; }
  function tl(am, en) { return isAm() ? am : en; }
  function safeEsc(s) { return typeof esc === 'function' ? esc(s) : String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function safeNum(n) { return typeof fmtNum === 'function' ? fmtNum(n) : Number(n || 0).toLocaleString(); }
  function activeBr() {
    if (!hasState()) return '';
    if (state.branchScope && state.branchScope !== 'all') return state.branchScope;
    return state.branches?.[0]?.name || '';
  }
  function itemStock(it, br) {
    if (!it) return 0;
    if (typeof getItemStock === 'function') return Number(getItemStock(it, br || 'all') || 0);
    if (it.branchStock && br && br !== 'all') return Number(it.branchStock[br] || 0);
    return Number(it.stock ?? it.qty ?? 0);
  }
  function unitLbl(it) {
    if (!it) return '';
    if (typeof getUnitLabel === 'function') return getUnitLabel(it);
    return it.unit || '';
  }

  function detectStrokeFmt() {
    if (detectedStrokeFmt) return detectedStrokeFmt;
    if (typeof sumStrokes === 'function') {
      try {
        if (sumStrokes([5]) === 5) return (detectedStrokeFmt = 'number');
        if (sumStrokes([{ qty: 5 }]) === 5) return (detectedStrokeFmt = 'qty');
        if (sumStrokes([{ v: 5 }]) === 5) return (detectedStrokeFmt = 'v');
        if (sumStrokes([{ val: 5 }]) === 5) return (detectedStrokeFmt = 'val');
        if (sumStrokes([{ count: 5 }]) === 5) return (detectedStrokeFmt = 'count');
      } catch {}
    }
    return (detectedStrokeFmt = 'number');
  }
  function strokeVal(s) {
    if (typeof s === 'number') return s;
    if (s && typeof s === 'object') return Number(s.qty ?? s.v ?? s.val ?? s.count ?? s.n ?? 0);
    return 0;
  }
  function sumAny(arr) { return (arr || []).reduce((a, s) => a + strokeVal(s), 0); }
  function makeStroke(qty, carrierId) {
    const fmt = detectStrokeFmt(), n = Number(qty || 0);
    if (fmt === 'number') return n;
    const o = { ts: Date.now() };
    o[fmt] = n;
    if (carrierId) o.carrierId = carrierId;
    return o;
  }

  function ensureState() {
    if (!hasState()) return;
    if (!state.tally) state.tally = {};
    if (!Array.isArray(state.tally.tickets)) state.tally.tickets = [];
    if (!Array.isArray(state.tally.history)) state.tally.history = [];
    if (!state.tally.free) state.tally.free = { note: '', target: 0, strokes: [] };
    if (!state.tally.audit) state.tally.audit = { itemId: state.inventory?.[0]?.id || null, strokes: [] };
    if (!state.activeSubTab) state.activeSubTab = {};
    if (!state.activeSubTab.tally) state.activeSubTab.tally = 'tickets';

    const defs = {
      mode: 'tap',
      loadSize: Number(state.tally.loadSize || state.tally.step || 10),
      locked: false,
      voiceEnabled: true,
      voiceRead: 'clicks',
      voiceLang: 'am-pack',
      voiceRate: 1.05,
      debounceMs: 450,
      showTimer: true,
      autoLockCall: true,
      haptic: true,
      carrierCount: 2,
      carriers: [
        { id: 'c1', name: 'ጫኝ 1', color: '#14b8a6' },
        { id: 'c2', name: 'ጫኝ 2', color: '#38bdf8' },
        { id: 'c3', name: 'ጫኝ 3', color: '#f59e0b' },
        { id: 'c4', name: 'ጫኝ 4', color: '#a855f7' }
      ],
      camSensitivity: 26,
      camCooldownMs: 1100,
      camDir: 'LR',
      metaLogs: {}
    };
    state.tallyPro = Object.assign(defs, state.tallyPro || {});
    if (!state.tallyPro.metaLogs) state.tallyPro.metaLogs = {};
  }

  // ---------------------------------------------------------------------------
  // 2. ንጹህ የሰዓት አቆጣጠር (ከ23 ሰዓት በፊት / ከ1 ቀን በፊት / >1ሰ)
  // ---------------------------------------------------------------------------
  function fmtAgo(ts) {
    if (!ts) return tl('ለመቁጠር ዝግጁ', 'Ready to count');
    const sec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
    if (sec < 60) return tl(`ከ${sec}ሰ በፊት`, `${sec}s ago`);
    const min = Math.floor(sec / 60);
    if (min < 60) {
      const rSec = sec % 60;
      return tl(`ከ${min}ደ ${rSec}ሰ በፊት`, `${min}m ${rSec}s ago`);
    }
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return tl(`ከ${hrs} ሰዓት በፊት`, `${hrs}h ago`);
    const days = Math.floor(hrs / 24);
    return tl(`ከ${days} ቀን በፊት`, `${days}d ago`);
  }

  function fmtDtPill(dt) {
    const s = Number(dt || 0);
    if (s <= 0) return '0.0s';
    if (s < 60) return `${s.toFixed(1)}s`;
    if (s < 3600) return `${Math.floor(s / 60)}${tl('ደ', 'm')}`;
    return tl('>1ሰ', '>1h');
  }

  // ---------------------------------------------------------------------------
  // 3. Flagship Ergonomic CSS (Matte Obsidian + Smart Capsule + Solo Trigger)
  // ---------------------------------------------------------------------------
  function injectCss() {
    let st = document.getElementById('koraTallyProCss');
    if (!st) {
      st = document.createElement('style');
      st.id = 'koraTallyProCss';
      document.head.appendChild(st);
    }
    st.textContent = `
      body.ktp-active .search-wrap { display: none !important; }
      body.ktp-active #subTabsBar { display: none !important; }

      .ktp-shell {
        display: flex; flex-direction: column; flex: 1; min-height: 0;
        gap: 6px; padding-bottom: 2px;
      }

      /* ረድፍ 1: ታቦች + ቁልፍ + ቅንብር */
      .ktp-toprow { display: flex; align-items: center; gap: 5px; flex-shrink: 0; }
      .ktp-subtabs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; flex: 1; min-width: 0; }
      .ktp-tab {
        height: 31px; padding: 0 4px; border-radius: 10px;
        border: 1px solid rgba(148,163,184,0.14);
        background: #0d1218; color: #8b9bb0;
        font-size: 11px; font-weight: 700; white-space: nowrap;
        overflow: hidden; text-overflow: ellipsis; cursor: pointer;
        transition: all 0.14s ease;
      }
      .ktp-tab.on {
        background: rgba(20,184,166,0.16);
        border-color: rgba(20,184,166,0.65);
        color: #2dd4bf; font-weight: 800;
      }
      .ktp-sq {
        width: 31px; height: 31px; border-radius: 10px;
        border: 1px solid rgba(148,163,184,0.16);
        background: #0d1218; color: #cbd5e1;
        display: inline-flex; align-items: center; justify-content: center;
        flex-shrink: 0; cursor: pointer;
      }
      .ktp-sq.locked { background: rgba(245,158,11,0.18); border-color: rgba(245,158,11,0.65); color: #fbbf24; }

      /* ረድፍ 2: ስማርት ካፕሱል (4 ረድፎችን በ1 ንጹህ መስመር!) */
      .ktp-capsule-row { display: flex; align-items: center; gap: 5px; flex-shrink: 0; }
      .ktp-cap-main {
        flex: 1; min-width: 0; height: 36px; border-radius: 12px;
        border: 1px solid rgba(148,163,184,0.18); background: #0f151c;
        display: flex; align-items: center; padding: 0 3px; gap: 2px;
      }
      .ktp-cap-step {
        width: 26px; height: 28px; border-radius: 8px; border: none;
        background: transparent; color: #94a3b8;
        display: inline-flex; align-items: center; justify-content: center;
        flex-shrink: 0; cursor: pointer;
      }
      .ktp-cap-step:active { background: rgba(148,163,184,0.15); color: #fff; }
      .ktp-cap-btn {
        flex: 1; min-width: 0; height: 100%; border: none; background: transparent;
        color: #f1f5f9; display: flex; align-items: center; gap: 6px;
        padding: 0 6px; cursor: pointer; text-align: left;
      }
      .ktp-cap-dir {
        font-size: 9.5px; font-weight: 900; padding: 2px 6px; border-radius: 6px; flex-shrink: 0;
        background: rgba(244,63,94,0.16); color: #fda4af; border: 1px solid rgba(244,63,94,0.35);
      }
      .ktp-cap-dir.in { background: rgba(16,185,129,0.16); color: #6ee7b7; border-color: rgba(16,185,129,0.35); }
      .ktp-cap-txt {
        flex: 1; min-width: 0; font-size: 12px; font-weight: 800;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .ktp-cap-badge {
        font-size: 10.5px; font-family: ui-monospace, monospace; font-weight: 800;
        color: #2dd4bf; flex-shrink: 0;
      }
      .ktp-load-pill {
        height: 36px; padding: 0 10px; border-radius: 12px;
        border: 1px solid rgba(20,184,166,0.45);
        background: rgba(20,184,166,0.12); color: #2dd4bf;
        font-size: 12.5px; font-weight: 900; font-family: ui-monospace, monospace;
        display: inline-flex; align-items: center; gap: 4px;
        flex-shrink: 0; cursor: pointer;
      }

      /* ረድፍ 3: የላይ እርምጃ መስመር (ከዋናው ቀስቃሽ ርቆ — 0 ድንገተኛ ንኪኪ!) */
      .ktp-actbar {
        display: grid; grid-template-columns: 1fr 1fr 40px 1.45fr;
        gap: 5px; flex-shrink: 0;
      }
      .ktp-act {
        height: 35px; border-radius: 10px;
        border: 1px solid rgba(148,163,184,0.16);
        background: #0d1218; color: #cbd5e1;
        font-size: 11px; font-weight: 700;
        display: inline-flex; align-items: center; justify-content: center; gap: 4px;
        cursor: pointer; white-space: nowrap; position: relative; overflow: hidden;
        user-select: none; -webkit-user-select: none;
      }
      .ktp-act:active { background: #17202b; }
      .ktp-act.danger-hold { color: #fb7185; border-color: rgba(244,63,94,0.28); }
      .ktp-act.danger-hold .ktp-hold-fill {
        position: absolute; left: 0; top: 0; bottom: 0; width: 0%;
        background: rgba(244,63,94,0.38); pointer-events: none;
      }
      .ktp-act.danger-hold.holding .ktp-hold-fill { width: 100%; transition: width 0.75s linear; }
      .ktp-act.commit {
        border-color: rgba(20,184,166,0.4);
        background: rgba(20,184,166,0.12);
        color: #5eead4; font-weight: 800;
      }
      .ktp-act.commit.dim { opacity: 0.48; border-color: rgba(148,163,184,0.14); background: #0d1218; color: #64748b; }
      .ktp-act.commit.ready {
        background: linear-gradient(135deg, #10b981, #14b8a6);
        border-color: #34d399; color: #02201b; font-weight: 900;
        box-shadow: 0 0 16px rgba(16,185,129,0.42);
      }

      /* ረድፍ 4: ግዙፍና ንጹህ የቆጠራ መድረክ (Flex 1) */
      .ktp-board {
        flex: 1; min-height: 0; display: flex; flex-direction: column;
        background: #0d1218; border: 1px solid rgba(148,163,184,0.16);
        border-radius: 15px; padding: 8px; gap: 7px;
        position: relative; overflow: hidden;
      }
      .ktp-prog { height: 4px; border-radius: 4px; background: rgba(51,65,85,0.45); overflow: hidden; flex-shrink: 0; }
      .ktp-prog-fill { height: 100%; background: linear-gradient(90deg, #14b8a6, #10b981); transition: width 0.16s ease; }
      .ktp-kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; flex-shrink: 0; }
      .ktp-kpi {
        background: #080c10; border: 1px solid rgba(148,163,184,0.12);
        border-radius: 10px; padding: 6px 3px; text-align: center;
      }
      .ktp-kpi span { display: block; font-size: 9.5px; color: #8b9bb0; font-weight: 700; }
      .ktp-kpi b { display: block; font-size: 18px; font-family: ui-monospace, monospace; font-weight: 900; line-height: 1.18; margin-top: 2px; }
      .ktp-kpi.c-teal b { color: #2dd4bf; }
      .ktp-kpi.c-em b { color: #34d399; }
      .ktp-kpi.c-amb b { color: #fbbf24; }
      .ktp-kpi.c-sky b { color: #38bdf8; }
      .ktp-kpi.c-rose b { color: #fb7185; }

      .ktp-banner {
        font-size: 11px; font-weight: 800; text-align: center;
        padding: 5px 8px; border-radius: 9px; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center; gap: 6px;
      }
      .ktp-banner.ok { background: rgba(16,185,129,0.18); border: 1px solid rgba(16,185,129,0.55); color: #6ee7b7; }
      .ktp-banner.final {
        background: rgba(245,158,11,0.16); border: 1px solid rgba(245,158,11,0.55);
        color: #fcd34d; cursor: pointer;
      }

      .ktp-stage { flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: center; position: relative; overflow: hidden; }
      .ktp-rbox {
        background: #080c10; border: 1px solid rgba(148,163,184,0.12);
        border-radius: 12px; padding: 9px 8px; display: flex; flex-direction: column; gap: 8px;
      }
      .ktp-rhead { display: flex; justify-content: space-between; font-size: 10.5px; font-weight: 700; color: #8b9bb0; font-family: ui-monospace, monospace; }
      .ktp-g10 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
      .ktp-cell {
        height: 42px; border-radius: 10px;
        border: 1px solid rgba(148,163,184,0.15);
        background: #0d1218; color: #64748b;
        font-family: ui-monospace, monospace; font-size: 13px; font-weight: 800;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.12s ease;
      }
      .ktp-cell.hit { background: rgba(20,184,166,0.15); border-color: rgba(20,184,166,0.55); color: #5eead4; }
      .ktp-cell.last { border-width: 2px; border-color: #2dd4bf; box-shadow: 0 0 12px rgba(45,212,191,0.28); color: #f0fdfa; }

      .ktp-lock-ov {
        position: absolute; inset: 0; background: rgba(7,10,14,0.82); backdrop-filter: blur(3px);
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        gap: 8px; border-radius: 11px; z-index: 5;
      }
      .ktp-mfoot {
        display: flex; align-items: center; justify-content: space-between; gap: 6px;
        font-size: 10.5px; color: #8b9bb0; font-family: ui-monospace, monospace;
        flex-shrink: 0; overflow: hidden; padding-top: 2px;
      }
      .ktp-mfoot-left { display: inline-flex; align-items: center; gap: 4px; white-space: nowrap; }
      .ktp-sp {
        padding: 2px 7px; border-radius: 99px;
        border: 1px solid rgba(148,163,184,0.18); background: #080c10;
        color: #cbd5e1; font-size: 9.5px; font-weight: 700; white-space: nowrap;
      }
      .ktp-sp.latest { border-color: rgba(20,184,166,0.45); color: #5eead4; }

      /* ረድፍ 5: ብቸኛ የአውራ-ጣት ቀስቃሽ ቀጠና (62px — ከታች ምንም አደገኛ ቁልፍ የለም!) */
      .ktp-trigger-zone { flex-shrink: 0; padding-top: 2px; }
      .ktp-tap {
        width: 100%; height: 62px; border-radius: 16px;
        border: 1.5px solid #14b8a6;
        background: linear-gradient(180deg, rgba(20,184,166,0.24), rgba(13,148,136,0.12));
        color: #f0fdfa; font-size: 19px; font-weight: 900; letter-spacing: 0.3px;
        display: flex; align-items: center; justify-content: center; gap: 8px;
        cursor: pointer; user-select: none; -webkit-tap-highlight-color: transparent;
        box-shadow: 0 6px 20px rgba(20,184,166,0.16);
      }
      .ktp-tap:active { transform: scale(0.975); background: rgba(20,184,166,0.38); }
      .ktp-tap.final-mode {
        border-color: #f59e0b;
        background: linear-gradient(180deg, rgba(245,158,11,0.26), rgba(217,119,6,0.14));
        color: #fef3c7; box-shadow: 0 6px 20px rgba(245,158,11,0.18);
      }
      .ktp-tap.locked { opacity: 0.42; border-color: rgba(245,158,11,0.6); }

      /* ሌሎች የቆጠራ ሲስተም ቀስቃሾች */
      .ktp-slide { height: 62px; border-radius: 16px; border: 1.5px solid #14b8a6; background: #0d1218; position: relative; overflow: hidden; touch-action: none; user-select: none; display: flex; align-items: center; justify-content: center; }
      .ktp-sfill { position: absolute; left: 0; top: 0; bottom: 0; width: 0%; background: rgba(20,184,166,0.28); pointer-events: none; }
      .ktp-sthumb { position: absolute; left: 4px; top: 4px; width: 66px; height: 50px; border-radius: 12px; background: #14b8a6; color: #03201d; font-size: 16px; font-weight: 900; display: flex; align-items: center; justify-content: center; cursor: grab; }

      .ktp-pp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
      .ktp-pp-btn { height: 62px; border-radius: 15px; border: 1.5px solid rgba(148,163,184,0.18); background: #0d1218; color: #64748b; font-size: 16px; font-weight: 900; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; }
      .ktp-pp-btn.ready { border-color: #14b8a6; background: rgba(20,184,166,0.22); color: #f0fdfa; }

      .ktp-cgrid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; }
      .ktp-cbtn { height: 56px; border-radius: 14px; border: 1.5px solid #14b8a6; background: #0d1218; color: #f1f5f9; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; cursor: pointer; user-select: none; }
      .ktp-cbtn:active { transform: scale(0.96); }

      .ktp-mgrid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; }
      .ktp-mbtn { height: 46px; border-radius: 11px; border: 1px solid rgba(20,184,166,0.45); background: rgba(20,184,166,0.12); color: #5eead4; font-size: 15px; font-weight: 900; font-family: ui-monospace, monospace; cursor: pointer; }
      .ktp-mbtn:active { transform: scale(0.95); background: rgba(20,184,166,0.3); }

      .ktp-cam { position: relative; width: 100%; flex: 1; min-height: 120px; border-radius: 11px; overflow: hidden; background: #020617; border: 1px solid rgba(20,184,166,0.5); }
      .ktp-cam video { width: 100%; height: 100%; object-fit: cover; display: block; }
      .ktp-cline { position: absolute; top: 0; bottom: 0; left: 50%; width: 3px; background: #f59e0b; box-shadow: 0 0 12px #f59e0b; pointer-events: none; }
      .ktp-chud { position: absolute; top: 6px; left: 6px; right: 6px; display: flex; justify-content: space-between; pointer-events: none; }

      /* የሸክም ሞዳል እና የድምፅ ስቱዲዮ */
      .ktp-preset-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
      .ktp-pbtn { height: 40px; border-radius: 10px; border: 1px solid rgba(148,163,184,0.2); background: #0d1218; color: #f1f5f9; font-size: 14px; font-weight: 800; font-family: ui-monospace, monospace; cursor: pointer; }
      .ktp-pbtn.on { background: #14b8a6; border-color: #14b8a6; color: #03201d; }
      .ktp-strip { display: flex; align-items: center; gap: 5px; overflow-x: auto; padding: 2px 0; }
      .ktp-chip { height: 28px; padding: 0 10px; border-radius: 14px; border: 1px solid rgba(148,163,184,0.22); background: #0d1218; color: #e2e8f0; font-size: 11.5px; font-weight: 700; white-space: nowrap; flex-shrink: 0; cursor: pointer; }
      .ktp-chip.on { background: #14b8a6; border-color: #14b8a6; color: #03201d; font-weight: 900; }
      .ktp-chip.done { background: rgba(16,185,129,0.18); border-color: #10b981; color: #6ee7b7; }
      .ktp-chip.add { border-style: dashed; border-color: #f59e0b; color: #fbbf24; background: transparent; }
      .ktp-vrow { display: grid; grid-template-columns: 1fr auto auto auto; gap: 5px; align-items: center; padding: 5px 7px; border-radius: 9px; background: #0d1218; border: 1px solid rgba(148,163,184,0.14); }
    `;
  }

  // ---------------------------------------------------------------------------
  // 4. የድምፅ ሞተር + ኦፍላይን የድምፅ ስቱዲዮ (IndexedDB)
  // ---------------------------------------------------------------------------
  let vDbProm = null, audQueue = [], audPlaying = false, recorder = null, recKey = '', recChunks = [];
  const packCache = {};

  function openVDb() {
    if (vDbProm) return vDbProm;
    vDbProm = new Promise((res, rej) => {
      try {
        const req = indexedDB.open(VOICE_DB, 1);
        req.onupgradeneeded = () => { if (!req.result.objectStoreNames.contains(VOICE_STORE)) req.result.createObjectStore(VOICE_STORE, { keyPath: 'id' }); };
        req.onsuccess = () => res(req.result);
        req.onerror = () => rej(req.error);
      } catch (e) { rej(e); }
    });
    return vDbProm;
  }
  async function loadPack(id) {
    if (packCache[id]) return packCache[id];
    try {
      const db = await openVDb();
      return await new Promise((res) => {
        const req = db.transaction(VOICE_STORE, 'readonly').objectStore(VOICE_STORE).get(id);
        req.onsuccess = () => res((packCache[id] = req.result || { id, clips: {} }));
        req.onerror = () => res({ id, clips: {} });
      });
    } catch { return { id, clips: {} }; }
  }
  async function savePack(pack) {
    packCache[pack.id] = pack;
    try {
      const db = await openVDb();
      await new Promise((res, rej) => { const tx = db.transaction(VOICE_STORE, 'readwrite'); tx.objectStore(VOICE_STORE).put(pack); tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
    } catch {}
  }
  function playNextAud() {
    if (audPlaying || !audQueue.length) return;
    audPlaying = true;
    const a = new Audio(audQueue.shift());
    a.playbackRate = Number(state.tallyPro?.voiceRate || 1.05);
    const done = () => { audPlaying = false; playNextAud(); };
    a.onended = done; a.onerror = done; a.play().catch(done);
  }
  function qAud(src) { if (src) { audQueue.push(src); playNextAud(); } }
  function numClips(n, clips) {
    const num = Math.max(0, Math.round(Number(n || 0)));
    if (clips[String(num)]) return [clips[String(num)]];
    const out = [];
    if (num >= 100 && clips['100']) {
      const h = Math.floor(num / 100);
      if (h > 1 && clips[String(h)]) out.push(clips[String(h)]);
      out.push(clips['100']);
      if (num % 100 > 0) out.push(...numClips(num % 100, clips));
      return out;
    }
    if (num > 10 && num < 100) {
      const t = Math.floor(num / 10) * 10, o = num % 10;
      if (clips[String(t)]) { out.push(clips[String(t)]); if (o > 0 && clips[String(o)]) out.push(clips[String(o)]); return out; }
    }
    for (const ch of String(num)) if (clips[ch]) out.push(clips[ch]);
    return out;
  }
  function amPhon(n) {
    const num = Math.max(0, Math.round(Number(n || 0)));
    if (AM_PHONETIC[num]) return AM_PHONETIC[num];
    if (num > 20 && num < 100) { const t = Math.floor(num / 10) * 10, o = num % 10; return `${AM_PHONETIC[t] || t} ${AM_PHONETIC[o] || o}`; }
    if (num >= 100 && num < 1000) { const h = Math.floor(num / 100), r = num % 100; const hs = h === 1 ? 'meto' : `${AM_PHONETIC[h] || h} meto`; return r ? `${hs} ${amPhon(r)}` : hs; }
    return String(num);
  }
  function speakTts(text, langCode) {
    if (!('speechSynthesis' in global)) return;
    try {
      global.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text));
      u.rate = Number(state.tallyPro?.voiceRate || 1.05);
      const vs = global.speechSynthesis.getVoices() || [];
      if (langCode.startsWith('dev:')) {
        const v = vs.find((x) => x.voiceURI === langCode.slice(4));
        if (v) { u.voice = v; u.lang = v.lang; }
      } else {
        u.lang = langCode;
        const v = vs.find((x) => (x.lang || '').toLowerCase().startsWith(langCode.slice(0, 2).toLowerCase()));
        if (v) u.voice = v;
      }
      global.speechSynthesis.speak(u);
    } catch {}
  }
  async function announce(totalQty, clicks, reached) {
    const cfg = state.tallyPro;
    if (!cfg || !cfg.voiceEnabled) return;
    if (cfg.voiceRead === 'beep') { if (typeof playTone === 'function') playTone(reached ? 880 : 620, reached ? 0.16 : 0.06, 'sine'); return; }
    const lang = cfg.voiceLang || 'am-pack';
    if (lang.endsWith('-pack')) {
      const pack = await loadPack(lang), clips = pack.clips || {};
      if (Object.keys(clips).length > 0) {
        audQueue = []; audPlaying = false;
        if (cfg.voiceRead === 'clicks') numClips(clicks, clips).forEach(qAud);
        else if (cfg.voiceRead === 'both') { if (clips.load) qAud(clips.load); numClips(clicks, clips).forEach(qAud); numClips(totalQty, clips).forEach(qAud); }
        else numClips(totalQty, clips).forEach(qAud);
        if (reached && clips.done) qAud(clips.done);
        return;
      }
      const vs = ('speechSynthesis' in global) ? global.speechSynthesis.getVoices() : [];
      const amV = vs.find((v) => (v.lang || '').toLowerCase().startsWith('am'));
      if (amV) {
        const txt = cfg.voiceRead === 'clicks' ? String(clicks) : (cfg.voiceRead === 'both' ? `ሸክም ${clicks}፣ ${totalQty}` : String(totalQty));
        speakTts(reached ? `${txt}፣ ግቡ ሞልቷል` : txt, 'am-ET');
      } else {
        const txt = cfg.voiceRead === 'clicks' ? amPhon(clicks) : (cfg.voiceRead === 'both' ? `shekim ${amPhon(clicks)}, ${amPhon(totalQty)}` : amPhon(totalQty));
        speakTts(reached ? `${txt}, mol-twal` : txt, 'en-US');
      }
      return;
    }
    let phrase = cfg.voiceRead === 'clicks' ? String(clicks) : (cfg.voiceRead === 'both' ? `Load ${clicks}, total ${totalQty}` : String(totalQty));
    if (reached) phrase += ', target reached';
    speakTts(phrase, lang);
  }

  // ---------------------------------------------------------------------------
  // 5. ንቁ አውድ (ቲኬት / ነጻ / ኦዲት / ታሪክ)
  // ---------------------------------------------------------------------------
  function getSub() {
    ensureState();
    const s = state.activeSubTab.tally || 'tickets';
    return ['tickets', 'free', 'audit', 'history'].includes(s) ? s : 'tickets';
  }
  function setSub(sub) {
    ensureState();
    state.activeSubTab.tally = sub;
    if (sub === 'history') stopCamera();
    saveState();
    renderTallyPro();
  }
  function ensureTicket() {
    ensureState();
    const list = state.tally.tickets;
    if (!list.length) {
      const id = 'tk_' + Date.now(), br = activeBr();
      list.push({ id, dir: 'OUT', docNo: typeof nextBranchDoc === 'function' ? nextBranchDoc(br) : 'WH1-01', party: '', branch: br, activeItemId: null, items: [] });
      state.tally.activeTicketId = id;
    }
    let tk = list.find((x) => x.id === state.tally.activeTicketId) || list[0];
    state.tally.activeTicketId = tk.id;
    if (!Array.isArray(tk.items)) tk.items = [];
    if (tk.items.length && !tk.items.some((x) => String(x.itemId) === String(tk.activeItemId))) tk.activeItemId = tk.items[0].itemId;
    return tk;
  }
  function getCtx() {
    ensureState();
    const sub = getSub();
    if (sub === 'tickets') {
      const tk = ensureTicket();
      const it = tk.items.find((x) => String(x.itemId) === String(tk.activeItemId)) || tk.items[0] || null;
      return { sub, key: it ? `tk:${tk.id}:${it.itemId}` : `tk:${tk.id}:none`, ticket: tk, item: it, strokes: it ? (it.strokes = it.strokes || []) : [], target: it ? Number(it.target || 0) : 0, sysQty: 0, ready: Boolean(it) };
    }
    if (sub === 'free') {
      const f = state.tally.free; f.strokes = f.strokes || [];
      return { sub, key: 'free:main', free: f, strokes: f.strokes, target: Number(f.target || 0), sysQty: 0, ready: true };
    }
    if (sub === 'audit') {
      const a = state.tally.audit; a.strokes = a.strokes || [];
      const inv = (state.inventory || []).find((x) => String(x.id) === String(a.itemId)) || (state.inventory || [])[0] || null;
      if (inv && !a.itemId) a.itemId = inv.id;
      return { sub, key: `aud:${inv ? inv.id : 'none'}`, audit: a, inv, strokes: a.strokes, target: 0, sysQty: itemStock(inv, state.branchScope || 'all'), ready: Boolean(inv) };
    }
    return { sub: 'history', key: 'hist', strokes: [], target: 0, sysQty: 0, ready: false };
  }
  function metaLog(key) {
    ensureState();
    if (!Array.isArray(state.tallyPro.metaLogs[key])) state.tallyPro.metaLogs[key] = [];
    return state.tallyPro.metaLogs[key];
  }

  // ---------------------------------------------------------------------------
  // 6. የቆጠራ ዋና ተግባራት + Long-Press Clear
  // ---------------------------------------------------------------------------
  function doCount(qtyOvr = null, carrierId = null, bypassDeb = false) {
    ensureState();
    const cfg = state.tallyPro, ctx = getCtx();
    if (!ctx.ready) { openCapsuleSheet(); return false; }
    if (cfg.locked) { showToast(tl('ቆጠራው ተቆልፏል — መጀመሪያ ይክፈቱት', 'Tally is locked'), true); return false; }
    const now = Date.now();
    if (!bypassDeb && cfg.debounceMs > 0 && now - lastTapTs < cfg.debounceMs) return false;

    const qty = Number(qtyOvr !== null ? qtyOvr : cfg.loadSize || 1);
    if (!(qty > 0)) return false;

    const meta = metaLog(ctx.key);
    const prev = meta.length ? meta[meta.length - 1].ts : 0;
    const dt = prev ? Number(((now - prev) / 1000).toFixed(1)) : 0;

    ctx.strokes.push(makeStroke(qty, carrierId));
    meta.push({ ts: now, dt, qty, carrierId: carrierId || null });
    lastTapTs = now;
    if (cfg.mode === 'pingpong') pingPongSide = pingPongSide === 'L' ? 'R' : 'L';

    const tot = sumAny(ctx.strokes), clicks = ctx.strokes.length;
    const reached = ctx.target > 0 && tot >= ctx.target;
    if (cfg.haptic && navigator.vibrate) navigator.vibrate(reached ? [80, 50, 120] : 26);
    announce(tot, clicks, reached);
    saveState();

    if (cfg.mode === 'camera' && camStream) updateLiveNums();
    else renderTallyPro();
    return true;
  }

  function doPingPong(side) {
    if (side !== pingPongSide) {
      if (state.tallyPro.haptic && navigator.vibrate) navigator.vibrate([12, 30, 12]);
      return;
    }
    doCount(null, null, false);
  }

  function doUndo() {
    const ctx = getCtx();
    if (!ctx.ready || !ctx.strokes.length || state.tallyPro.locked) return;
    ctx.strokes.pop();
    const m = metaLog(ctx.key);
    if (m.length) m.pop();
    if (state.tallyPro.haptic && navigator.vibrate) navigator.vibrate(15);
    saveState();
    if (state.tallyPro.mode === 'camera' && camStream) updateLiveNums();
    else renderTallyPro();
  }

  function openPartial() {
    const ctx = getCtx();
    if (!ctx.ready) { openCapsuleSheet(); return; }
    openModal(`➕ ${tl('ጎዶሎ / የተለየ ብዛት', 'Add Partial Qty')}`, `
      <div class="sub-card">
        <label class="lbl">${safeEsc(tl('የተቆጠረው ጎዶሎ ብዛት', 'Partial quantity'))}</label>
        <input id="ktpPartInp" type="number" min="1" step="any" class="inp mono" placeholder="4" onkeydown="if(event.key==='Enter') KoraTallyPro.confirmPartial()">
      </div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${safeEsc(tl('ተው', 'Cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraTallyPro.confirmPartial()">${safeEsc(tl('ጨምር', 'Add'))}</button>`);
    setTimeout(() => document.getElementById('ktpPartInp')?.focus(), 40);
  }
  function confirmPartial() {
    const v = Number(document.getElementById('ktpPartInp')?.value || 0);
    if (!(v > 0)) return;
    closeModal();
    doCount(v, null, true);
  }

  function bindClearHold() {
    const btn = document.getElementById('ktpClearBtn');
    if (!btn) return;
    const cancel = () => {
      if (clearHoldTimer) { clearTimeout(clearHoldTimer); clearHoldTimer = null; }
      btn.classList.remove('holding');
    };
    btn.onpointerdown = () => {
      const ctx = getCtx();
      if (!ctx.ready || !ctx.strokes.length) return;
      clearHoldDone = false;
      btn.classList.add('holding');
      clearHoldTimer = setTimeout(() => {
        clearHoldDone = true;
        btn.classList.remove('holding');
        if (navigator.vibrate) navigator.vibrate(40);
        askClear();
      }, 750);
    };
    btn.onpointerup = () => {
      if (!clearHoldDone && clearHoldTimer) {
        cancel();
        const ctx = getCtx();
        if (ctx.strokes.length) showToast(tl('ለማጽዳት 1 ሰከንድ ጫን አድርገው ይያዙ', 'Hold 1s to clear'));
      }
    };
    btn.onpointerleave = cancel;
    btn.onpointercancel = cancel;
  }

  function askClear() {
    const ctx = getCtx();
    if (!ctx.ready || !ctx.strokes.length) return;
    openModal(`${tl('ቆጠራውን አጽዳ?', 'Clear Counts?')}`, `
      <p style="font-size:12.5px;color:var(--muted);">${safeEsc(tl('እስካሁን የተቆጠረው ሙሉ በሙሉ ወደ 0 ይመለሳል። እርግጠኛ ነህ?', 'Reset all current counts to 0?'))}</p>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${safeEsc(tl('ተው', 'Cancel'))}</button>
      <button type="button" class="btn danger" onclick="KoraTallyPro.confirmClear()">${safeEsc(tl('አጽዳ', 'Clear'))}</button>`);
  }
  function confirmClear() {
    const ctx = getCtx();
    if (ctx.ready) { ctx.strokes.length = 0; state.tallyPro.metaLogs[ctx.key] = []; saveState(); }
    closeModal();
    if (state.tallyPro.mode === 'camera' && camStream) updateLiveNums();
    else renderTallyPro();
  }

  function toggleLock() {
    ensureState();
    state.tallyPro.locked = !state.tallyPro.locked;
    if (state.tallyPro.locked) stopCamera();
    saveState();
    renderTallyPro();
  }

  // ---------------------------------------------------------------------------
  // 7. ስማርት ካፕሱል ሞዳሎች (ቲኬት/ዕቃ፣ ነጻ ማስታወሻ፣ ኦዲት ዕቃ እና የሸክም መጠን ×5 ▾)
  // ---------------------------------------------------------------------------
  function stepItem(delta) {
    const sub = getSub();
    if (sub === 'tickets') {
      const tk = ensureTicket();
      if (tk.items.length < 2) return;
      const idx = tk.items.findIndex((x) => String(x.itemId) === String(tk.activeItemId));
      const next = (idx + delta + tk.items.length) % tk.items.length;
      tk.activeItemId = tk.items[next].itemId;
      saveState(); renderTallyPro();
    } else if (sub === 'audit') {
      const inv = state.inventory || [];
      if (inv.length < 2) return;
      const idx = inv.findIndex((x) => String(x.id) === String(state.tally.audit.itemId));
      const next = (idx + delta + inv.length) % inv.length;
      state.tally.audit.itemId = inv[next].id;
      state.tally.audit.strokes = [];
      saveState(); renderTallyPro();
    }
  }

  function openLoadSheet() {
    ensureState();
    const cur = Number(state.tallyPro.loadSize || 10);
    openModal(`${tl('የአንድ ሸክም መጠን (×)', 'Load Multiplier (×)')}`, `
      <div class="sub-card">
        <div class="ktp-preset-grid">
          ${PRESETS.map((n) => `<button type="button" class="ktp-pbtn ${cur === n ? 'on' : ''}" onclick="KoraTallyPro.setLoad(${n})">+${n}</button>`).join('')}
          <button type="button" class="ktp-pbtn ${!PRESETS.includes(cur) ? 'on' : ''}" onclick="document.getElementById('ktpCustL').focus()">${safeEsc(tl('ሌላ', 'Oth'))}</button>
        </div>
        <div style="display:flex;gap:6px;margin-top:8px;">
          <input id="ktpCustL" type="number" min="1" class="inp mono" value="${cur}" placeholder="${safeEsc(tl('ሌላ ቁጥር', 'Custom'))}">
          <button type="button" class="btn teal sm" onclick="KoraTallyPro.confirmLoad()">${safeEsc(tl('አስቀምጥ', 'Set'))}</button>
        </div>
      </div>`, `<button type="button" class="btn muted" onclick="closeModal()">${safeEsc(tl('ዝጋ', 'Close'))}</button>`);
  }
  function setLoad(n) {
    state.tallyPro.loadSize = Math.max(1, Number(n || 1));
    state.tally.loadSize = state.tallyPro.loadSize;
    saveState(); closeModal(); renderTallyPro();
  }
  function confirmLoad() {
    const v = Math.max(1, Number(document.getElementById('ktpCustL')?.value || 1));
    setLoad(v);
  }

  function openCapsuleSheet() {
    const ctx = getCtx();
    if (ctx.sub === 'tickets') {
      const tk = ctx.ticket;
      const isIn = String(tk.dir || 'OUT').toUpperCase() === 'IN';
      openModal(`${tl('የጭነት ቲኬት እና ዕቃዎች', 'Loading Ticket & Items')}`, `
        <div class="sub-card">
          <label class="lbl">${safeEsc(tl('ንቁ ቲኬቶች', 'Active Tickets'))}</label>
          <div class="ktp-strip no-scrollbar">
            ${state.tally.tickets.map((t) => `<button type="button" class="ktp-chip ${t.id === tk.id ? 'on' : ''}" onclick="KoraTallyPro.selTicket('${safeEsc(t.id)}')">${safeEsc(t.docNo || t.id)}</button>`).join('')}
            <button type="button" class="ktp-chip add" onclick="KoraTallyPro.newTicket()">+ ${safeEsc(tl('አዲስ ቲኬት', 'New Ticket'))}</button>
          </div>
          <div style="display:grid;grid-template-columns:64px 96px 1fr;gap:5px;margin-top:7px;">
            <button type="button" class="btn sm ${isIn ? 'emerald' : 'danger'}" onclick="KoraTallyPro.toggleDir()">${isIn ? tl('ገቢ', 'IN') : tl('ወጪ', 'OUT')}</button>
            <input class="inp sm mono" value="${safeEsc(tk.docNo || '')}" placeholder="ኮድ" onchange="KoraTallyPro.setTkField('docNo',this.value)">
            <input class="inp sm" value="${safeEsc(tk.party || '')}" placeholder="${safeEsc(tl('ደንበኛ / አቅራቢ', 'Customer / Party'))}" onchange="KoraTallyPro.setTkField('party',this.value)">
          </div>
        </div>
        <div class="sub-card">
          <div class="card-row"><label class="lbl" style="margin:0;">${safeEsc(tl('በቲኬቱ ውስጥ ያሉ ዕቃዎች', 'Ticket Items'))}</label><button type="button" class="btn teal sm" style="height:25px;font-size:10.5px;" onclick="KoraTallyPro.openAddItem()">+ ${safeEsc(tl('ዕቃ ጨምር', 'Add Item'))}</button></div>
          <div class="ktp-strip no-scrollbar" style="margin-top:5px;">
            ${tk.items.map((x) => {
              const q = sumAny(x.strokes), done = x.target > 0 && q >= x.target;
              const lbl = x.target > 0 ? `${x.name} (${q}/${x.target})` : `${x.name} (${q})`;
              const act = String(x.itemId) === String(tk.activeItemId);
              return `<button type="button" class="ktp-chip ${act ? 'on' : (done ? 'done' : '')}" onclick="KoraTallyPro.selTkItem('${safeEsc(x.itemId)}')">${done ? '✓ ' : ''}${safeEsc(lbl)}</button>`;
            }).join('') || `<span style="font-size:11px;color:var(--muted);">${safeEsc(tl('ገና ዕቃ አልተጨመረም', 'No items yet'))}</span>`}
          </div>
        </div>`, `
        <button type="button" class="btn danger sm" onclick="KoraTallyPro.delTicket()">${safeEsc(tl('ቲኬቱን አጥፋ', 'Delete'))}</button>
        <button type="button" class="btn teal" onclick="closeModal();KoraTallyPro.render();">${safeEsc(tl('ጨርስ', 'Done'))}</button>`);
      return;
    }

    if (ctx.sub === 'free') {
      openModal(`${tl('የነጻ ቆጠራ ማስታወሻ እና ግብ', 'Free Count Note & Target')}`, `
        <div class="sub-card">
          <label class="lbl">${safeEsc(tl('ማስታወሻ (አማራጭ)', 'Note (optional)'))}</label>
          <input id="ktpFrNote" class="inp" value="${safeEsc(ctx.free.note || '')}" placeholder="${safeEsc(tl('ለምሳሌ የጠዋት ጭነት', 'e.g. Morning load'))}">
          <label class="lbl" style="margin-top:7px;">${safeEsc(tl('የቆጠራ ግብ (Target)', 'Target Qty (0 = unlimited)'))}</label>
          <input id="ktpFrTgt" type="number" min="0" class="inp mono" value="${ctx.free.target || ''}" placeholder="0">
        </div>`, `
        <button type="button" class="btn muted" onclick="closeModal()">${safeEsc(tl('ተው', 'Cancel'))}</button>
        <button type="button" class="btn teal" onclick="KoraTallyPro.saveFreeMeta()">${safeEsc(tl('አስቀምጥ', 'Save'))}</button>`);
      return;
    }

    if (ctx.sub === 'audit') {
      const br = state.branchScope || 'all';
      openModal(`${tl('ለኦዲት ዕቃ ይምረጡ', 'Select Item for Audit')}`, `
        <div class="sub-card">
          <label class="lbl">${safeEsc(tl('ዕቃ', 'Product'))}</label>
          <select id="ktpAudSel" class="sel">
            ${(state.inventory || []).map((it) => `<option value="${safeEsc(it.id)}" ${ctx.inv && String(ctx.inv.id) === String(it.id) ? 'selected' : ''}>${safeEsc(it.name)} (${safeEsc(tl('ሲስተም', 'Sys'))}: ${safeNum(itemStock(it, br))})</option>`).join('')}
          </select>
        </div>`, `
        <button type="button" class="btn muted" onclick="closeModal()">${safeEsc(tl('ተው', 'Cancel'))}</button>
        <button type="button" class="btn teal" onclick="KoraTallyPro.selectAuditItem()">${safeEsc(tl('ምረጥ', 'Select'))}</button>`);
    }
  }

  function saveFreeMeta() {
    state.tally.free.note = (document.getElementById('ktpFrNote')?.value || '').trim();
    state.tally.free.target = Math.max(0, Number(document.getElementById('ktpFrTgt')?.value || 0));
    saveState(); closeModal(); renderTallyPro();
  }
  function selectAuditItem() {
    const id = document.getElementById('ktpAudSel')?.value;
    if (id && String(state.tally.audit.itemId) !== String(id)) {
      state.tally.audit.itemId = id;
      state.tally.audit.strokes = [];
      saveState();
    }
    closeModal(); renderTallyPro();
  }

  function selTicket(id) { state.tally.activeTicketId = id; saveState(); openCapsuleSheet(); renderTallyPro(); }
  function newTicket() {
    const br = activeBr(), id = 'tk_' + Date.now();
    state.tally.tickets.push({ id, dir: 'OUT', docNo: 'WH-' + String(state.tally.tickets.length + 1).padStart(2, '0'), party: '', branch: br, activeItemId: null, items: [] });
    state.tally.activeTicketId = id; saveState(); openCapsuleSheet(); renderTallyPro();
  }
  function delTicket() {
    const tk = ensureTicket();
    if (state.tally.tickets.length <= 1) { tk.items = []; tk.party = ''; tk.activeItemId = null; }
    else { state.tally.tickets = state.tally.tickets.filter((x) => x.id !== tk.id); state.tally.activeTicketId = state.tally.tickets[0]?.id || null; }
    saveState(); closeModal(); renderTallyPro();
  }
  function toggleDir() { const tk = ensureTicket(); tk.dir = String(tk.dir || 'OUT').toUpperCase() === 'IN' ? 'OUT' : 'IN'; saveState(); openCapsuleSheet(); renderTallyPro(); }
  function setTkField(k, v) { const tk = ensureTicket(); tk[k] = v; saveState(); }
  function selTkItem(itemId) { const tk = ensureTicket(); tk.activeItemId = itemId; saveState(); closeModal(); renderTallyPro(); }

  function openAddItem() {
    const br = state.branchScope || 'all';
    const opts = (state.inventory || []).map((it) => `<option value="${safeEsc(it.id)}">${safeEsc(it.name)} (${safeNum(itemStock(it, br))})</option>`).join('');
    openModal(`➕ ${tl('ወደ ቲኬቱ ዕቃ ጨምር', 'Add Item to Ticket')}`, `
      <div class="sub-card">
        <label class="lbl">${safeEsc(tl('ዕቃ ይምረጡ', 'Select Item'))}</label>
        <select id="ktpInvSel" class="sel">${opts}</select>
        <label class="lbl" style="margin-top:6px;">${safeEsc(tl('ግብ / የሚጫን ብዛት (አማራጭ)', 'Target Qty (optional)'))}</label>
        <input id="ktpInvTgt" type="number" min="0" class="inp mono" placeholder="0 = ገደብ የለም">
      </div>`, `
      <button type="button" class="btn muted" onclick="KoraTallyPro.openCapsuleSheet()">${safeEsc(tl('ተመለስ', 'Back'))}</button>
      <button type="button" class="btn teal" onclick="KoraTallyPro.confirmAddItem()">${safeEsc(tl('ጨምር', 'Add'))}</button>`);
  }
  function confirmAddItem() {
    const rawId = document.getElementById('ktpInvSel')?.value;
    const target = Math.max(0, Number(document.getElementById('ktpInvTgt')?.value || 0));
    const inv = (state.inventory || []).find((x) => String(x.id) === String(rawId));
    if (!inv) return;
    const tk = ensureTicket();
    const ex = tk.items.find((x) => String(x.itemId) === String(inv.id));
    if (ex) { if (target > 0) ex.target = target; tk.activeItemId = inv.id; }
    else { tk.items.push({ itemId: inv.id, name: inv.name, unit: unitLbl(inv), loc: inv.zoneCode || 'A-01', target, strokes: [] }); tk.activeItemId = inv.id; }
    saveState(); closeModal(); renderTallyPro();
  }

  function doCommit(btn) {
    const ctx = getCtx();
    if (!ctx.ready || (ctx.sub !== 'audit' && sumAny(ctx.strokes) === 0)) {
      showToast(tl('መጀመሪያ ቆጠራ ያድርጉ', 'Count at least one load first'), true);
      return;
    }
    if (typeof origCommitFn === 'function') {
      try { origCommitFn(btn); setTimeout(() => { if (isTallyActive()) renderTallyPro(); }, 120); return; } catch {}
    }
    const today = new Date().toISOString().slice(0, 10);
    if (ctx.sub === 'tickets') {
      const tk = ctx.ticket, br = tk.branch || activeBr();
      const nonZero = tk.items.filter((x) => sumAny(x.strokes) > 0);
      if (!nonZero.length) return;
      const isIn = String(tk.dir).toUpperCase() === 'IN';
      nonZero.forEach((x, idx) => {
        const qty = sumAny(x.strokes);
        const inv = (state.inventory || []).find((z) => String(z.id) === String(x.itemId));
        if (inv && inv.branchStock) {
          const op = itemStock(inv, br), en = Math.max(0, op + (isIn ? qty : -qty));
          inv.branchStock[br] = en;
          if (Array.isArray(state.warehouseLedger)) {
            state.warehouseLedger.push({ id: Date.now() + idx, docNo: tk.docNo, type: isIn ? 'IN' : 'OUT', status: 'valid', branch: br, itemId: inv.id, itemName: inv.name, unit: unitLbl(inv), loc: inv.zoneCode || '-', openBal: op, inQty: isIn ? qty : 0, outQty: isIn ? 0 : qty, endBal: en, party: tk.party || '-', ref: 'Tally', date: today });
          }
        }
      });
      state.tally.history.unshift({ id: Date.now(), type: isIn ? 'IN' : 'OUT', docNo: tk.docNo, party: tk.party || '-', summary: nonZero.map((x) => `${x.name}: ${sumAny(x.strokes)}`).join(' · '), total: nonZero.reduce((a, x) => a + sumAny(x.strokes), 0), date: new Date().toLocaleString() });
      tk.items = []; tk.activeItemId = null;
      saveState(); renderAll(); showToast(tl('በስቶክ ላይ ተመዝግቧል!', 'Committed to stock!'));
    } else if (ctx.sub === 'free') {
      const tot = sumAny(ctx.strokes);
      state.tally.history.unshift({ id: Date.now(), type: 'FREE', docNo: tl('ነጻ ቆጠራ', 'Free'), party: ctx.free.note || '-', summary: `${tot} (${ctx.strokes.length})`, total: tot, date: new Date().toLocaleString() });
      ctx.free.strokes = []; saveState(); renderTallyPro(); showToast(tl('ተቀምጧል!', 'Saved!'));
    } else if (ctx.sub === 'audit' && ctx.inv) {
      const tot = sumAny(ctx.strokes), br = activeBr();
      if (ctx.inv.branchStock) ctx.inv.branchStock[br] = tot;
      state.tally.history.unshift({ id: Date.now(), type: 'AUDIT', docNo: tl('ኦዲት', 'Audit'), party: ctx.inv.name, summary: `${ctx.sysQty} -> ${tot}`, total: tot, date: new Date().toLocaleString() });
      ctx.audit.strokes = []; saveState(); renderAll(); showToast(tl('የስቶክ ማስተካከያ ተልኳል!', 'Audit applied!'));
    }
  }

  // ---------------------------------------------------------------------------
  // 8. ካሜራ / ክብደት / መንሸራተቻ
  // ---------------------------------------------------------------------------
  async function startCamera() {
    if (camStream) return;
    if (!navigator.mediaDevices?.getUserMedia) { showToast(tl('ካሜራ አይደገፍም', 'Camera unsupported'), true); return; }
    try {
      camStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 640 }, height: { ideal: 360 } }, audio: false });
      const vid = document.getElementById('ktpCamVid');
      if (vid) { vid.srcObject = camStream; await vid.play().catch(() => {}); }
      camCanvas = document.createElement('canvas'); camCanvas.width = 64; camCanvas.height = 48;
      camCtx = camCanvas.getContext('2d', { willReadFrequently: true });
      camPrevL = null; camPrevR = null; camLastZone = null;
      const st = document.getElementById('ktpCamSt');
      if (st) st.textContent = tl('🟢 በመቁጠር ላይ', '🟢 Live');
      camLoop();
    } catch { showToast(tl('የካሜራ ፍቃድ ያስፈልጋል', 'Camera denied'), true); }
  }
  function stopCamera() {
    if (camRafId) { cancelAnimationFrame(camRafId); camRafId = null; }
    if (camStream) { camStream.getTracks().forEach((t) => t.stop()); camStream = null; }
    camPrevL = null; camPrevR = null;
  }
  function toggleCam() { if (camStream) { stopCamera(); renderTallyPro(); } else startCamera(); }
  function toggleCamDir() {
    state.tallyPro.camDir = state.tallyPro.camDir === 'LR' ? 'RL' : 'LR'; saveState();
    const b = document.getElementById('ktpCamDir');
    if (b) b.textContent = state.tallyPro.camDir === 'LR' ? 'ግራ➔ቀኝ (+)' : 'ቀኝ➔ግራ (+)';
  }
  function camLoop() {
    if (!camStream) return;
    const vid = document.getElementById('ktpCamVid');
    if (vid && vid.readyState >= 2 && camCtx) {
      camCtx.drawImage(vid, 0, 0, 64, 48);
      const d = camCtx.getImageData(0, 0, 64, 48).data, L = [], R = [];
      for (let y = 8; y < 40; y += 2) {
        for (let x = 16; x < 28; x += 2) { const i = (y * 64 + x) * 4; L.push((d[i] + d[i + 1] + d[i + 2]) / 3); }
        for (let x = 36; x < 48; x += 2) { const i = (y * 64 + x) * 4; R.push((d[i] + d[i + 1] + d[i + 2]) / 3); }
      }
      if (camPrevL && camPrevR) {
        let dL = 0, dR = 0;
        for (let i = 0; i < L.length; i++) { dL += Math.abs(L[i] - camPrevL[i]); dR += Math.abs(R[i] - camPrevR[i]); }
        dL /= L.length; dR /= R.length;
        const th = Number(state.tallyPro.camSensitivity || 26), now = Date.now(), cool = Number(state.tallyPro.camCooldownMs || 1100);
        if (dL > th && dL > dR * 1.15) {
          if (camLastZone === 'R' && now - camLastZoneTs < 1200 && now - camLastTrig > cool) { camLastTrig = now; camLastZone = null; if (state.tallyPro.camDir === 'RL') doCount(null, null, true); }
          else { camLastZone = 'L'; camLastZoneTs = now; }
        } else if (dR > th && dR > dL * 1.15) {
          if (camLastZone === 'L' && now - camLastZoneTs < 1200 && now - camLastTrig > cool) { camLastTrig = now; camLastZone = null; if (state.tallyPro.camDir === 'LR') doCount(null, null, true); }
          else { camLastZone = 'R'; camLastZoneTs = now; }
        }
      }
      camPrevL = L; camPrevR = R;
    }
    camRafId = requestAnimationFrame(() => setTimeout(camLoop, 110));
  }
  function updWeight() {
    const m = document.getElementById('ktpWM')?.value || 'weight';
    const a = Number(document.getElementById('ktpWA')?.value || 0), b = Number(document.getElementById('ktpWB')?.value || 1);
    const q = (a > 0 && b > 0) ? (m === 'weight' ? Math.round(a / b) : Math.round(a * b)) : 0;
    const o = document.getElementById('ktpWO'); if (o) o.textContent = `= ${safeNum(q)}`;
  }
  function applyWeight() {
    const m = document.getElementById('ktpWM')?.value || 'weight';
    const a = Number(document.getElementById('ktpWA')?.value || 0), b = Number(document.getElementById('ktpWB')?.value || 1);
    const q = (a > 0 && b > 0) ? (m === 'weight' ? Math.round(a / b) : Math.round(a * b)) : 0;
    if (q > 0) { doCount(q, null, true); showToast(`+${q}`); }
  }
  function bindSlide() {
    const track = document.getElementById('ktpSlide'), thumb = document.getElementById('ktpSThumb'), fill = document.getElementById('ktpSFill');
    if (!track || !thumb) return;
    let drag = false, sx = 0, mx = 0;
    const rst = () => { drag = false; thumb.style.transition = 'transform 0.16s ease'; thumb.style.transform = 'translateX(0px)'; if (fill) fill.style.width = '0%'; };
    thumb.onpointerdown = (e) => {
      if (state.tallyPro.locked) return;
      drag = true; thumb.setPointerCapture(e.pointerId);
      sx = e.clientX; mx = Math.max(40, track.clientWidth - thumb.clientWidth - 8);
      thumb.style.transition = 'none';
    };
    thumb.onpointermove = (e) => {
      if (!drag) return;
      const dx = Math.max(0, Math.min(mx, e.clientX - sx));
      thumb.style.transform = `translateX(${dx}px)`;
      if (fill) fill.style.width = `${Math.round((dx / mx) * 100)}%`;
      if (dx >= mx * 0.82) { rst(); doCount(null, null, false); }
    };
    thumb.onpointerup = rst; thumb.onpointercancel = rst;
  }

  // ---------------------------------------------------------------------------
  // 9. ቅንብር ሞዳል (⚙️) እና የድምፅ ስቱዲዮ
  // ---------------------------------------------------------------------------
  function openSettings() {
    ensureState();
    const cfg = state.tallyPro;
    const vs = ('speechSynthesis' in global) ? global.speechSynthesis.getVoices() : [];
    const devOpts = vs.slice(0, 35).map((v) => `<option value="dev:${safeEsc(v.voiceURI)}" ${cfg.voiceLang === 'dev:' + v.voiceURI ? 'selected' : ''}>${safeEsc(v.name)} (${safeEsc(v.lang)})</option>`).join('');

    openModal(`${tl('የቆጠራ እና የድምፅ ቅንብር', 'Tally & Voice Settings')}`, `
      <div class="sub-card">
        <label class="lbl">${safeEsc(tl('የቆጠራ ሲስተም (Mode)', 'Counting Style / Mode'))}</label>
        <select id="ktpModeSel" class="sel">
          ${TALLY_MODES.map((m) => `<option value="${m.id}" ${cfg.mode === m.id ? 'selected' : ''}>${safeEsc(isAm() ? m.am : m.en)}</option>`).join('')}
        </select>
        <div class="grid-2" style="margin-top:6px;">
          <div>
            <label class="lbl">${safeEsc(tl('የድጋሚ ንኪኪ መከላከያ', 'Anti-Double Tap'))}</label>
            <select id="ktpDebSel" class="sel">
              ${[0, 250, 400, 500, 700, 1000].map((ms) => `<option value="${ms}" ${Number(cfg.debounceMs) === ms ? 'selected' : ''}>${ms === 0 ? tl('ጠፍቷል', 'Off') : (ms / 1000) + 's'}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="lbl">${safeEsc(tl('የተሸካሚዎች ብዛት', 'Carriers Count'))}</label>
            <select id="ktpCarSel" class="sel">
              ${[2, 3, 4].map((n) => `<option value="${n}" ${Number(cfg.carrierCount) === n ? 'selected' : ''}>${n} ${tl('ጫኞች', 'Carriers')}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>

      <div class="sub-card">
        <div class="switch-row">
          <b>${safeEsc(tl('የድምፅ ንባብ', 'Voice Readout'))}</b>
          <div id="ktpVTog" class="toggle ${cfg.voiceEnabled ? 'on' : ''}" onclick="this.classList.toggle('on')"></div>
        </div>
        <div class="grid-2" style="margin-top:6px;">
          <div>
            <label class="lbl">${safeEsc(tl('ምን ይናገር?', 'Readout Target'))}</label>
            <select id="ktpVRead" class="sel">
              <option value="clicks" ${cfg.voiceRead === 'clicks' ? 'selected' : ''}>${safeEsc(tl('የሸክም / ክሊክ ቁጥር (1, 2, 3...)', 'Load / Click # (1, 2, 3...)'))}</option>
              <option value="qty" ${cfg.voiceRead === 'qty' ? 'selected' : ''}>${safeEsc(tl('የተጫነ ብዛት (5, 10, 15...)', 'Total Qty (5, 10, 15...)'))}</option>
              <option value="both" ${cfg.voiceRead === 'both' ? 'selected' : ''}>${safeEsc(tl('ሁለቱንም (ሸክም 2 — 10)', 'Both (Load 2 — 10)'))}</option>
              <option value="beep" ${cfg.voiceRead === 'beep' ? 'selected' : ''}>${safeEsc(tl('ቢፕ ድምፅ ብቻ', 'Beep Tone Only'))}</option>
            </select>
          </div>
          <div>
            <label class="lbl">${safeEsc(tl('የድምፅ ቋንቋ', 'Voice Language'))}</label>
            <select id="ktpVLang" class="sel">
              <option value="am-pack" ${cfg.voiceLang === 'am-pack' ? 'selected' : ''}>አማርኛ (Pack / Voice)</option>
              <option value="en-US" ${cfg.voiceLang === 'en-US' ? 'selected' : ''}>English (US/UK)</option>
              <option value="ar-SA" ${cfg.voiceLang === 'ar-SA' ? 'selected' : ''}>العربية (Arabic)</option>
              <option value="om-pack" ${cfg.voiceLang === 'om-pack' ? 'selected' : ''}>Afaan Oromo (Pack)</option>
              <option value="ti-pack" ${cfg.voiceLang === 'ti-pack' ? 'selected' : ''}>ትግርኛ (Pack)</option>
              ${devOpts}
            </select>
          </div>
        </div>
        <div class="grid-2" style="margin-top:6px;">
          <button type="button" class="btn muted sm" onclick="KoraTallyPro.testVoice()">${safeEsc(tl('ድምፅ ሞክር', 'Test Voice'))}</button>
          <button type="button" class="btn teal sm" onclick="KoraTallyPro.openStudio()">${safeEsc(tl('ቋንቋ ቅረጽ / አውርድ', 'Voice Studio'))}</button>
        </div>
      </div>

      <div class="sub-card">
        <div class="switch-row"><span>${safeEsc(tl('የመጨረሻ ንኪኪ ሰዓት ቆጣሪ', 'Last Tap Timer'))}</span><div id="ktpTTog" class="toggle ${cfg.showTimer ? 'on' : ''}" onclick="this.classList.toggle('on')"></div></div>
        <div class="switch-row"><span>${safeEsc(tl('በስልክ ጥሪ ጊዜ ራስ-ሰር መቆለፊያ', 'Auto-Lock on Call'))}</span><div id="ktpCTog" class="toggle ${cfg.autoLockCall ? 'on' : ''}" onclick="this.classList.toggle('on')"></div></div>
        <div class="switch-row"><span>${safeEsc(tl('ጠንካራ ንዝረት', 'Strong Haptic'))}</span><div id="ktpHTog" class="toggle ${cfg.haptic ? 'on' : ''}" onclick="this.classList.toggle('on')"></div></div>
      </div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${safeEsc(tl('ተው', 'Cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraTallyPro.saveSettings()">${safeEsc(tl('አስቀምጥ', 'Save'))}</button>`);
  }
  function saveSettings() {
    const cfg = state.tallyPro, prev = cfg.mode;
    cfg.mode = document.getElementById('ktpModeSel')?.value || 'tap';
    cfg.debounceMs = Number(document.getElementById('ktpDebSel')?.value || 450);
    cfg.carrierCount = Number(document.getElementById('ktpCarSel')?.value || 2);
    cfg.voiceEnabled = document.getElementById('ktpVTog')?.classList.contains('on') || false;
    cfg.voiceRead = document.getElementById('ktpVRead')?.value || 'clicks';
    cfg.voiceLang = document.getElementById('ktpVLang')?.value || 'am-pack';
    cfg.showTimer = document.getElementById('ktpTTog')?.classList.contains('on') || false;
    cfg.autoLockCall = document.getElementById('ktpCTog')?.classList.contains('on') || false;
    cfg.haptic = document.getElementById('ktpHTog')?.classList.contains('on') || false;
    if (prev === 'camera' && cfg.mode !== 'camera') stopCamera();
    saveState(); closeModal(); renderTallyPro(); showToast(tl('ተቀምጧል', 'Saved'));
  }
  function testVoice() {
    ensureState();
    const cfg = state.tallyPro, bak = { e: cfg.voiceEnabled, r: cfg.voiceRead, l: cfg.voiceLang };
    cfg.voiceEnabled = true;
    const r = document.getElementById('ktpVRead'), l = document.getElementById('ktpVLang');
    if (r) cfg.voiceRead = r.value;
    if (l) cfg.voiceLang = l.value;
    announce(20, 4, false);
    cfg.voiceEnabled = bak.e; cfg.voiceRead = bak.r; cfg.voiceLang = bak.l;
  }
  async function openStudio(pid = null) {
    ensureState();
    const cur = state.tallyPro.voiceLang || 'am-pack';
    const packId = pid || (cur.endsWith('-pack') ? cur : 'am-pack');
    const pack = await loadPack(packId), clips = pack.clips || {};
    openModal(`${tl('ኦፍላይን የድምፅ ጥቅል ስቱዲዮ', 'Offline Voice Studio')}`, `
      <div class="sub-card">
        <div class="card-row">
          <select class="sel" style="height:30px;flex:1;" onchange="KoraTallyPro.openStudio(this.value)">
            <option value="am-pack" ${packId === 'am-pack' ? 'selected' : ''}>አማርኛ (am-pack)</option>
            <option value="om-pack" ${packId === 'om-pack' ? 'selected' : ''}>Afaan Oromo (om-pack)</option>
            <option value="ti-pack" ${packId === 'ti-pack' ? 'selected' : ''}>ትግርኛ (ti-pack)</option>
            <option value="custom-pack" ${packId === 'custom-pack' ? 'selected' : ''}>ሌላ ቋንቋ (custom-pack)</option>
          </select>
          <span class="pill teal">${Object.keys(clips).length}/${VOICE_KEYS.length}</span>
        </div>
        <div class="grid-2" style="margin-top:6px;">
          <button type="button" class="btn muted sm" onclick="KoraTallyPro.expPack('${safeEsc(packId)}')">${safeEsc(tl('ጥቅሉን አውርድ', 'Export'))}</button>
          <label class="btn teal sm" style="text-align:center;">${safeEsc(tl('ጥቅል ጫን', 'Import'))}<input type="file" accept=".json" style="display:none;" onchange="KoraTallyPro.impPack(this,'${safeEsc(packId)}')"></label>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;max-height:260px;overflow-y:auto;">
        ${VOICE_KEYS.map((vk) => {
          const has = Boolean(clips[vk.k]), isR = recKey === vk.k;
          return `<div class="ktp-vrow"><b style="font-size:11.5px;color:${has ? '#5eead4' : 'var(--text)'};">${has ? '✓ ' : ''}${safeEsc(vk.am)}</b><button type="button" class="btn sm ${isR ? 'danger' : 'teal'}" onclick="KoraTallyPro.recClip('${safeEsc(packId)}','${vk.k}')">${isR ? '■' : '●'}</button><button type="button" class="btn sm muted" ${has ? '' : 'disabled'} onclick="KoraTallyPro.playClip('${safeEsc(packId)}','${vk.k}')">▶</button><button type="button" class="btn sm ghost" ${has ? '' : 'disabled'} style="color:var(--rose);" onclick="KoraTallyPro.delClip('${safeEsc(packId)}','${vk.k}')">✕</button></div>`;
        }).join('')}
      </div>`, `<button type="button" class="btn teal" onclick="closeModal();KoraTallyPro.openSettings()">${safeEsc(tl('ጨርስ', 'Done'))}</button>`);
  }
  async function recClip(packId, key) {
    if (recorder && recorder.state === 'recording') { recorder.stop(); return; }
    if (!navigator.mediaDevices?.getUserMedia) { showToast(tl('ማይክሮፎን አልተገኘም', 'No mic'), true); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recChunks = []; recKey = key; recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => { if (e.data.size > 0) recChunks.push(e.data); };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const rd = new FileReader();
        rd.onload = async () => { const p = await loadPack(packId); p.clips = p.clips || {}; p.clips[key] = rd.result; await savePack(p); recKey = ''; openStudio(packId); showToast(tl('ተቀርጿል', 'Recorded')); };
        rd.readAsDataURL(new Blob(recChunks, { type: recorder.mimeType || 'audio/webm' }));
      };
      recorder.start(); openStudio(packId);
      setTimeout(() => { if (recorder && recorder.state === 'recording' && recKey === key) recorder.stop(); }, 2200);
    } catch { recKey = ''; showToast(tl('የማይክሮፎን ፍቃድ ያስፈልጋል', 'Mic denied'), true); }
  }
  async function playClip(packId, key) { const p = await loadPack(packId); if (p.clips?.[key]) qAud(p.clips[key]); }
  async function delClip(packId, key) { const p = await loadPack(packId); if (p.clips) delete p.clips[key]; await savePack(p); openStudio(packId); }
  async function expPack(packId) {
    const p = await loadPack(packId);
    const url = URL.createObjectURL(new Blob([JSON.stringify(p)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = `kora-voice-${packId}.json`; a.click(); URL.revokeObjectURL(url);
  }
  function impPack(inp, packId) {
    const f = inp.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = async () => {
      try { const p = JSON.parse(String(r.result || '{}')); if (!p || typeof p.clips !== 'object') throw 0; p.id = packId; await savePack(p); state.tallyPro.voiceLang = packId; saveState(); openStudio(packId); showToast(tl('ተጭኗል', 'Installed')); }
      catch { showToast(tl('ትክክለኛ ፋይል አይደለም', 'Invalid file'), true); }
    };
    r.readAsText(f);
  }

  // ---------------------------------------------------------------------------
  // 10. ባለ 1-ስክሪን Flagship UI ሠሪ
  // ---------------------------------------------------------------------------
  function build10Grid(strokes) {
    const clicks = strokes.length, full = Math.floor(clicks / 10), inR = clicks % 10;
    const fullQ = sumAny(strokes.slice(0, full * 10)), curS = strokes.slice(full * 10), curQ = sumAny(curS);
    let cells = '';
    for (let i = 0; i < 10; i++) {
      const s = curS[i], hit = s !== undefined, last = hit && i === curS.length - 1;
      cells += `<div class="ktp-cell ${hit ? 'hit' : ''} ${last ? 'last' : ''}">${hit ? '+' + strokeVal(s) : (i + 1)}</div>`;
    }
    return `
      <div class="ktp-rbox">
        <div class="ktp-rhead">
          <span>${safeEsc(tl('የተጠናቀቁ', 'Done'))}: ${full}×10 (${safeNum(fullQ)})</span>
          <span>${safeEsc(tl('የአሁኑ ዙር', 'Round'))}: ${inR}/10 (+${safeNum(curQ)})</span>
        </div>
        <div class="ktp-g10">${cells}</div>
      </div>`;
  }

  function updateLiveNums() {
    const ctx = getCtx(), tot = sumAny(ctx.strokes), loads = ctx.strokes.length;
    const ls = Math.max(1, Number(state.tallyPro.loadSize || 1));
    const k1 = document.getElementById('ktpK1'), k2 = document.getElementById('ktpK2');
    const k3 = document.getElementById('ktpK3'), k4 = document.getElementById('ktpK4');
    if (k1) k1.textContent = safeNum(tot);
    if (k2) k2.textContent = safeNum(loads);
    if (ctx.sub === 'audit') {
      const d = tot - ctx.sysQty;
      if (k3) k3.textContent = (d > 0 ? '+' : '') + safeNum(d);
      if (k4) k4.textContent = safeNum(ctx.sysQty);
    } else {
      const rem = ctx.target > 0 ? Math.max(0, ctx.target - tot) : null;
      if (k3) k3.textContent = rem !== null ? safeNum(rem) : '∞';
      if (k4) k4.textContent = rem !== null ? safeNum(Math.ceil(rem / ls)) : '∞';
    }
    const pf = document.getElementById('ktpPF');
    if (pf && ctx.target > 0) pf.style.width = `${Math.min(100, Math.round((tot / ctx.target) * 100))}%`;
  }

  function renderTallyPro() {
    const root = document.getElementById('viewRoot');
    if (!root || !hasState()) return;
    ensureState();
    injectCss();
    document.body.classList.add('ktp-active');

    const cfg = state.tallyPro, sub = getSub(), ctx = getCtx();
    const ls = Number(cfg.loadSize || 10);
    const tot = sumAny(ctx.strokes), loads = ctx.strokes.length;

    // ረድፍ 1: ታቦች + 🔒 + ⚙️ (SVG)
    const topRow = `
      <div class="ktp-toprow">
        <div class="ktp-subtabs">
          <button type="button" class="ktp-tab ${sub === 'tickets' ? 'on' : ''}" onclick="KoraTallyPro.setSub('tickets')">${safeEsc(tl('ቲኬት', 'Tickets'))}</button>
          <button type="button" class="ktp-tab ${sub === 'free' ? 'on' : ''}" onclick="KoraTallyPro.setSub('free')">${safeEsc(tl('ነጻ ቆጠራ', 'Free'))}</button>
          <button type="button" class="ktp-tab ${sub === 'audit' ? 'on' : ''}" onclick="KoraTallyPro.setSub('audit')">${safeEsc(tl('ኦዲት', 'Audit'))}</button>
          <button type="button" class="ktp-tab ${sub === 'history' ? 'on' : ''}" onclick="KoraTallyPro.setSub('history')">${safeEsc(tl('ታሪክ', 'History'))}</button>
        </div>
        <button type="button" class="ktp-sq ${cfg.locked ? 'locked' : ''}" onclick="KoraTallyPro.toggleLock()" aria-label="Lock">${cfg.locked ? ICONS.lock : ICONS.unlock}</button>
        <button type="button" class="ktp-sq" onclick="KoraTallyPro.openSettings()" aria-label="Settings">${ICONS.gear}</button>
      </div>`;

    if (sub === 'history') {
      const rows = (state.tally.history || []).map((h) => `
        <div class="sub-card" style="padding:9px 11px;">
          <div class="card-row">
            <b style="font-size:12px;">${safeEsc(h.docNo || h.ref || '')} · ${safeEsc(h.party || '')}</b>
            <span class="pill teal">${safeNum(h.total || h.qty || 0)}</span>
          </div>
          <div style="font-size:11px;color:var(--muted);margin-top:3px;">${safeEsc(h.summary || h.itemName || '')}</div>
          <div style="font-size:10px;color:var(--muted);margin-top:2px;">${safeEsc(h.date || '')}</div>
        </div>`).join('') || `<div class="sub-card" style="text-align:center;color:var(--muted);padding:26px;">${safeEsc(tl('የቆጠራ ታሪክ የለም', 'No tally history yet'))}</div>`;
      root.innerHTML = `<div class="ktp-shell">${topRow}<div style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:6px;">${rows}</div></div>`;
      return;
    }

    // ረድፍ 2: ስማርት ካፕሱል (1 መስመር ብቻ!)
    let capHtml = '';
    if (sub === 'tickets') {
      const tk = ctx.ticket;
      const isIn = String(tk.dir || 'OUT').toUpperCase() === 'IN';
      const hasMulti = tk.items.length > 1;
      const titleTxt = ctx.item ? `${tk.docNo || tk.id} · ${ctx.item.name}` : `${tk.docNo || tk.id} · ${tl('+ ዕቃ ጨምር', '+ Add Item')}`;
      const badgeTxt = ctx.item ? (ctx.target > 0 ? `${tot}/${ctx.target}` : `${tot}`) : '';
      capHtml = `
        <div class="ktp-capsule-row">
          <div class="ktp-cap-main">
            ${hasMulti ? `<button type="button" class="ktp-cap-step" onclick="KoraTallyPro.stepItem(-1)">${ICONS.chevL}</button>` : ''}
            <button type="button" class="ktp-cap-btn" onclick="KoraTallyPro.openCapsuleSheet()">
              <span class="ktp-cap-dir ${isIn ? 'in' : ''}">${isIn ? tl('ገቢ', 'IN') : tl('ወጪ', 'OUT')}</span>
              <span class="ktp-cap-txt">${safeEsc(titleTxt)}</span>
              ${badgeTxt ? `<span class="ktp-cap-badge">${safeEsc(badgeTxt)}</span>` : ''}
              <span style="color:#64748b;display:inline-flex;">${ICONS.chevD}</span>
            </button>
            ${hasMulti ? `<button type="button" class="ktp-cap-step" onclick="KoraTallyPro.stepItem(1)">${ICONS.chevR}</button>` : ''}
          </div>
          <button type="button" class="ktp-load-pill" onclick="KoraTallyPro.openLoadSheet()">×${ls} ${ICONS.chevD}</button>
        </div>`;
    } else if (sub === 'free') {
      const lbl = ctx.free.note ? ctx.free.note : tl('ማስታወሻ / ግብ አስገባ', 'Set note / target');
      const bdg = ctx.target > 0 ? `${tl('ግብ', 'Tgt')} ${safeNum(ctx.target)}` : '';
      capHtml = `
        <div class="ktp-capsule-row">
          <div class="ktp-cap-main">
            <button type="button" class="ktp-cap-btn" onclick="KoraTallyPro.openCapsuleSheet()">
              <span style="color:#2dd4bf;display:inline-flex;">${ICONS.note}</span>
              <span class="ktp-cap-txt" style="${ctx.free.note ? '' : 'color:#8b9bb0;font-weight:600;'}">${safeEsc(lbl)}</span>
              ${bdg ? `<span class="ktp-cap-badge">${safeEsc(bdg)}</span>` : ''}
              <span style="color:#64748b;display:inline-flex;">${ICONS.chevD}</span>
            </button>
          </div>
          <button type="button" class="ktp-load-pill" onclick="KoraTallyPro.openLoadSheet()">×${ls} ${ICONS.chevD}</button>
        </div>`;
    } else {
      const hasMulti = (state.inventory || []).length > 1;
      const nm = ctx.inv ? ctx.inv.name : tl('ዕቃ ምረጥ', 'Select item');
      capHtml = `
        <div class="ktp-capsule-row">
          <div class="ktp-cap-main">
            ${hasMulti ? `<button type="button" class="ktp-cap-step" onclick="KoraTallyPro.stepItem(-1)">${ICONS.chevL}</button>` : ''}
            <button type="button" class="ktp-cap-btn" onclick="KoraTallyPro.openCapsuleSheet()">
              <span style="color:#38bdf8;display:inline-flex;">${ICONS.box}</span>
              <span class="ktp-cap-txt">${safeEsc(nm)}</span>
              <span class="ktp-cap-badge">${tl('ሲስተም', 'Sys')} ${safeNum(ctx.sysQty)}</span>
              <span style="color:#64748b;display:inline-flex;">${ICONS.chevD}</span>
            </button>
            ${hasMulti ? `<button type="button" class="ktp-cap-step" onclick="KoraTallyPro.stepItem(1)">${ICONS.chevR}</button>` : ''}
          </div>
          <button type="button" class="ktp-load-pill" onclick="KoraTallyPro.openLoadSheet()">×${ls} ${ICONS.chevD}</button>
        </div>`;
    }

    // ረድፍ 3: የላይ እርምጃ መስመር (Ergonomic Split — ከታችኛው ቀስቃሽ ሙሉ ለሙሉ የራቀ)
    const rem = ctx.target > 0 ? Math.max(0, ctx.target - tot) : null;
    const reached = ctx.target > 0 && tot >= ctx.target;
    const isFinalPartial = sub !== 'audit' && rem !== null && rem > 0 && rem < ls;
    const commitReady = reached || (sub === 'audit' && loads > 0) || (ctx.target === 0 && tot > 0 && sub === 'free');
    const commitDim = sub !== 'audit' && tot === 0;
    const pLbl = sub === 'tickets' ? tl('ቀጥታ መዝግብ', 'Commit') : (sub === 'free' ? tl('አስቀምጥ', 'Save') : tl('ማስተካከያ ላክ', 'Apply'));

    const actBarHtml = `
      <div class="ktp-actbar">
        <button type="button" class="ktp-act" onclick="KoraTallyPro.undo()">${ICONS.undo}<span>${safeEsc(tl('መልስ', 'Undo'))}</span></button>
        <button type="button" class="ktp-act" onclick="KoraTallyPro.openPartial()">${ICONS.plus}<span>${safeEsc(tl('ጎዶሎ', 'Part'))}</span></button>
        <button id="ktpClearBtn" type="button" class="ktp-act danger-hold" title="${safeEsc(tl('ለማጽዳት 1 ሰከንድ ይያዙ', 'Hold 1s to clear'))}"><span class="ktp-hold-fill"></span>${ICONS.trash}</button>
        <button type="button" class="ktp-act commit ${reached ? 'ready' : (commitDim ? 'dim' : '')}" onclick="KoraTallyPro.commit(this)">${ICONS.check}<span>${safeEsc(pLbl)}</span></button>
      </div>`;

    // ረድፍ 4: 4 KPIs + ብልህ የመጨረሻ ጎዶሎ ባነር + የመሃል መድረክ + ንጹህ የሰዓት ቴፕ
    let kpiHtml = '', pct = 0;
    if (sub === 'audit') {
      const diff = tot - ctx.sysQty;
      pct = ctx.sysQty > 0 ? Math.min(100, Math.round((tot / ctx.sysQty) * 100)) : 0;
      kpiHtml = `
        <div class="ktp-kpis">
          <div class="ktp-kpi c-teal"><span>${safeEsc(tl('የተቆጠረ', 'Counted'))}</span><b id="ktpK1">${safeNum(tot)}</b></div>
          <div class="ktp-kpi c-em"><span>${safeEsc(tl('ሸክም', 'Loads'))}</span><b id="ktpK2">${safeNum(loads)}</b></div>
          <div class="ktp-kpi ${diff === 0 ? 'c-em' : (diff < 0 ? 'c-rose' : 'c-amb')}"><span>${safeEsc(tl('ልዩነት', 'Diff'))}</span><b id="ktpK3">${diff > 0 ? '+' : ''}${safeNum(diff)}</b></div>
          <div class="ktp-kpi c-sky"><span>${safeEsc(tl('ሲስተም', 'System'))}</span><b id="ktpK4">${safeNum(ctx.sysQty)}</b></div>
        </div>`;
    } else {
      const remL = rem !== null ? Math.ceil(rem / Math.max(1, ls)) : null;
      pct = ctx.target > 0 ? Math.min(100, Math.round((tot / ctx.target) * 100)) : 0;
      kpiHtml = `
        <div class="ktp-kpis">
          <div class="ktp-kpi c-teal"><span>${safeEsc(tl('የተቆጠረ', 'Counted'))}</span><b id="ktpK1">${safeNum(tot)}</b></div>
          <div class="ktp-kpi c-em"><span>${safeEsc(tl('ሸክም', 'Loads'))}</span><b id="ktpK2">${safeNum(loads)}</b></div>
          <div class="ktp-kpi c-amb"><span>${safeEsc(tl('ቀሪ ብዛት', 'Rem Qty'))}</span><b id="ktpK3">${rem !== null ? safeNum(rem) : '∞'}</b></div>
          <div class="ktp-kpi c-sky"><span>${safeEsc(tl('ቀሪ ሸክም', 'Rem Loads'))}</span><b id="ktpK4">${remL !== null ? safeNum(remL) : '∞'}</b></div>
        </div>`;
    }

    let statusBanner = '';
    if (reached) {
      statusBanner = `<div class="ktp-banner ok">${ICONS.check} ${safeEsc(tl('ግቡ ሞልቷል — ጭነት አስቁም', 'Target Reached — Stop Loading'))}</div>`;
    } else if (isFinalPartial) {
      statusBanner = `<button type="button" class="ktp-banner final" onclick="KoraTallyPro.count(${rem},null,true)">${safeEsc(tl(`ጎዶሎ፦ ${rem} ፍሬ ብቻ ቀረ — +${rem} ለመጨረስ ንካ`, `Final Partial: ${rem} left — Tap to add +${rem}`))}</button>`;
    }

    let stage = '';
    if (!ctx.ready) {
      stage = `<div style="text-align:center;color:#8b9bb0;font-size:12.5px;padding:14px;"><button type="button" class="btn teal sm" onclick="KoraTallyPro.openCapsuleSheet()">+ ${safeEsc(tl('ዕቃ ጨምርና ቆጠራ ጀምር', 'Add Item to Start'))}</button></div>`;
    } else if (cfg.mode === 'camera') {
      stage = `
        <div class="ktp-cam">
          <video id="ktpCamVid" playsinline muted autoplay></video>
          <div class="ktp-cline"></div>
          <div class="ktp-chud">
            <span id="ktpCamSt" class="pill ${camStream ? 'teal' : 'amber'}">${camStream ? tl('በመቁጠር ላይ', 'Live') : tl('ቆሟል', 'Stopped')}</span>
            <button id="ktpCamDir" type="button" style="pointer-events:auto;height:24px;padding:0 8px;border-radius:12px;border:1px solid #f59e0b;background:rgba(13,18,24,0.9);color:#fcd34d;font-size:10px;font-weight:800;" onclick="KoraTallyPro.toggleCamDir()">${cfg.camDir === 'LR' ? 'ግራ➔ቀኝ (+)' : 'ቀኝ➔ግራ (+)'}</button>
          </div>
        </div>`;
    } else if (cfg.mode === 'weight') {
      stage = `
        <div class="ktp-rbox">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
            <select id="ktpWM" class="sel" style="flex:1;height:30px;font-size:11px;" onchange="KoraTallyPro.updWeight()">
              <option value="weight">${safeEsc(tl('ጠቅላላ ክብደት ÷ የ1 ፍሬ ክብደት', 'Weight ÷ Unit Wt'))}</option>
              <option value="pack">${safeEsc(tl('ጥቅል × በጥቅል ያለ ፍሬ', 'Packs × Units'))}</option>
            </select>
            <b id="ktpWO" style="color:#2dd4bf;font-size:16px;font-family:ui-monospace,monospace;">= 0</b>
          </div>
          <div class="grid-2" style="gap:5px;">
            <input id="ktpWA" type="number" step="any" class="inp sm mono" placeholder="${safeEsc(tl('ክብደት / ጥቅል', 'Wt / Packs'))}" oninput="KoraTallyPro.updWeight()">
            <input id="ktpWB" type="number" step="any" class="inp sm mono" value="1" placeholder="${safeEsc(tl('የ1 ፍሬ ክብደት', 'Unit wt'))}" oninput="KoraTallyPro.updWeight()">
          </div>
          <button type="button" class="btn teal sm" onclick="KoraTallyPro.applyWeight()">+ ${safeEsc(tl('ውጤቱን ጨምር', 'Add to Tally'))}</button>
        </div>`;
    } else if (cfg.mode === 'carriers') {
      const cars = cfg.carriers.slice(0, Number(cfg.carrierCount || 2));
      const m = metaLog(ctx.key);
      const chips = cars.map((c) => {
        const cl = m.filter((x) => x.carrierId === c.id);
        return `<span class="ktp-chip" style="border-color:${c.color};color:${c.color};">${safeEsc(c.name)}: ${cl.reduce((a, x) => a + x.qty, 0)} (${cl.length})</span>`;
      }).join('');
      stage = `<div class="ktp-strip no-scrollbar" style="margin-bottom:4px;">${chips}</div>${build10Grid(ctx.strokes)}`;
    } else {
      stage = build10Grid(ctx.strokes);
    }

    const lockOv = cfg.locked ? `
      <div class="ktp-lock-ov">
        <div style="color:#fbbf24;">${ICONS.lock}</div>
        <div style="font-size:12.5px;font-weight:900;color:#fbbf24;">${safeEsc(tl('ቆጠራው ተቆልፏል', 'Tally Locked'))}</div>
        <button type="button" class="btn teal sm" onclick="KoraTallyPro.toggleLock()">▶ ${safeEsc(tl('ቆጠራ ቀጥል', 'Resume'))}</button>
      </div>` : '';

    const meta = metaLog(ctx.key);
    const lastTs = meta.length ? meta[meta.length - 1].ts : 0;
    const speeds = meta.slice(-3).reverse().map((m, i) => `<span class="ktp-sp ${i === 0 ? 'latest' : ''}">#${meta.length - i} (${fmtDtPill(m.dt)})</span>`).join(' ');
    const mFoot = cfg.showTimer ? `<div class="ktp-mfoot"><span id="ktpAgo" class="ktp-mfoot-left">${ICONS.clock}<span>${safeEsc(fmtAgo(lastTs))}</span></span><div style="display:flex;gap:4px;overflow:hidden;">${speeds}</div></div>` : '';

    // ረድፍ 5: ብቸኛ የአውራ-ጣት ቀስቃሽ (ከታች ምንም አደገኛ ቁልፍ የለም!)
    let triggerHtml = '';
    if (cfg.mode === 'swipe') {
      const stepVal = isFinalPartial ? rem : ls;
      triggerHtml = `
        <div id="ktpSlide" class="ktp-slide">
          <div id="ktpSFill" class="ktp-sfill"></div>
          <span style="font-size:12.5px;font-weight:800;color:#5eead4;pointer-events:none;">${safeEsc(tl(`ወደ ቀኝ አንሸራትት (+${stepVal})`, `Slide Right (+${stepVal})`))}</span>
          <div id="ktpSThumb" class="ktp-sthumb">+${stepVal}</div>
        </div>`;
    } else if (cfg.mode === 'pingpong') {
      const stepVal = isFinalPartial ? rem : ls;
      triggerHtml = `
        <div class="ktp-pp-grid">
          <button type="button" class="ktp-pp-btn ${pingPongSide === 'L' ? 'ready' : ''}" onclick="KoraTallyPro.pingPong('L')">${ICONS.bolt} +${stepVal} (${tl('ግራ', 'L')})</button>
          <button type="button" class="ktp-pp-btn ${pingPongSide === 'R' ? 'ready' : ''}" onclick="KoraTallyPro.pingPong('R')">${ICONS.bolt} +${stepVal} (${tl('ቀኝ', 'R')})</button>
        </div>`;
    } else if (cfg.mode === 'carriers') {
      const cars = cfg.carriers.slice(0, Number(cfg.carrierCount || 2));
      triggerHtml = `<div class="ktp-cgrid">${cars.map((c) => `<button type="button" class="ktp-cbtn" style="border-color:${c.color};" onclick="KoraTallyPro.count(null,'${c.id}')"><span style="font-size:10.5px;font-weight:800;color:${c.color};">${safeEsc(c.name)}</span><b style="font-size:15px;">+${ls}</b></button>`).join('')}</div>`;
    } else if (cfg.mode === 'mixed') {
      triggerHtml = `<div class="ktp-mgrid">${[1, 2, 3, 5, 10, 15, 20].map((v) => `<button type="button" class="ktp-mbtn" onclick="KoraTallyPro.count(${v})">+${v}</button>`).join('')}<button type="button" class="ktp-mbtn" style="border-color:#f59e0b;color:#fbbf24;" onclick="KoraTallyPro.openPartial()">${safeEsc(tl('ሌላ', 'Oth'))}</button></div>`;
    } else if (cfg.mode === 'camera') {
      triggerHtml = `<div class="grid-2" style="gap:6px;"><button type="button" class="ktp-tap" style="height:56px;font-size:14px;border-color:${camStream ? '#f43f5e' : '#14b8a6'};" onclick="KoraTallyPro.toggleCam()">${camStream ? tl('ካሜራ አቁም', 'Stop Cam') : tl('ካሜራ ጀምር', 'Start Cam')}</button><button type="button" class="ktp-tap ${cfg.locked ? 'locked' : ''}" style="height:56px;font-size:15px;" onclick="KoraTallyPro.count()">${ICONS.bolt} +${ls} ${safeEsc(tl('ቁጠር', 'Count'))}</button></div>`;
    } else if (isFinalPartial) {
      triggerHtml = `<button type="button" class="ktp-tap final-mode ${cfg.locked ? 'locked' : ''}" onclick="KoraTallyPro.count(${rem},null,true)">${ICONS.bolt} +${rem} ${safeEsc(tl('ጨርስ (ጎዶሎ)', 'FINISH PARTIAL'))}</button>`;
    } else {
      triggerHtml = `<button type="button" class="ktp-tap ${cfg.locked ? 'locked' : ''}" onclick="KoraTallyPro.count()">${ICONS.bolt} +${ls} ${safeEsc(tl('ቁጠር', 'COUNT'))}</button>`;
    }

    root.innerHTML = `
      <div class="ktp-shell">
        ${topRow}
        ${capHtml}
        ${actBarHtml}
        <div class="ktp-board">
          <div class="ktp-prog"><div id="ktpPF" class="ktp-prog-fill" style="width:${pct}%"></div></div>
          ${kpiHtml}
          ${statusBanner}
          <div class="ktp-stage">${stage}${lockOv}</div>
          ${mFoot}
        </div>
        <div class="ktp-trigger-zone">${triggerHtml}</div>
      </div>`;

    bindClearHold();
    if (cfg.mode === 'swipe') bindSlide();
    if (cfg.mode === 'camera' && camStream) {
      const v = document.getElementById('ktpCamVid');
      if (v && v.srcObject !== camStream) { v.srcObject = camStream; v.play().catch(() => {}); }
    }
  }

  // ---------------------------------------------------------------------------
  // 11. ውህደት (Hooks)
  // ---------------------------------------------------------------------------
  function isTallyActive() { return hasState() && state.activeMainTab === 'tally'; }

  function installHooks() {
    if (hooksReady || !hasState()) return;
    hooksReady = true;
    ensureState();
    injectCss();
    if (typeof global.commitActiveTally === 'function') origCommitFn = global.commitActiveTally;

    global.renderTally = function () { renderTallyPro(); };

    if (typeof global.renderView === 'function') {
      const origRV = global.renderView;
      global.renderView = function () {
        if (!isTallyActive()) { document.body.classList.remove('ktp-active'); stopCamera(); }
        const res = origRV.apply(this, arguments);
        if (isTallyActive()) renderTallyPro();
        return res;
      };
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && isTallyActive() && state.tallyPro?.autoLockCall) {
        state.tallyPro.locked = true; stopCamera(); saveState();
      } else if (!document.hidden && isTallyActive()) renderTallyPro();
    });

    document.addEventListener('keydown', (e) => {
      if (!isTallyActive() || state.tallyPro?.mode !== 'clicker') return;
      const tag = (document.activeElement?.tagName || '').toUpperCase();
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      if (['Enter', ' ', 'ArrowUp', 'ArrowRight', 'AudioVolumeUp', 'VolumeUp', 'MediaPlayPause'].includes(e.key)) {
        e.preventDefault(); doCount(null, null, false);
      }
    });

    if (!timerId) {
      timerId = setInterval(() => {
        if (!isTallyActive() || !state.tallyPro?.showTimer) return;
        const el = document.querySelector('#ktpAgo span');
        if (!el) return;
        const m = metaLog(getCtx().key);
        el.textContent = fmtAgo(m.length ? m[m.length - 1].ts : 0);
      }, 1000);
    }

    if (isTallyActive()) renderTallyPro();
  }

  global.KoraTallyPro = {
    render: renderTallyPro, setSub, count: doCount, pingPong: doPingPong, undo: doUndo,
    openPartial, confirmPartial, clear: askClear, confirmClear,
    openLoadSheet, setLoad, confirmLoad, openCapsuleSheet, stepItem,
    saveFreeMeta, selectAuditItem, toggleLock, selTicket, newTicket, delTicket,
    toggleDir, setTkField, selTkItem, openAddItem, confirmAddItem,
    commit: doCommit, openSettings, saveSettings, testVoice,
    openStudio, recClip, playClip, delClip, expPack, impPack,
    toggleCam, toggleCamDir, updWeight, applyWeight
  };

  installHooks();
  document.addEventListener('DOMContentLoaded', installHooks);
  setTimeout(installHooks, 300);
})(window);
