// =============================================================================
// ኮራ ስቶክ — ባለ 1-ስክሪን ፕሮፌሽናል ቆጠራ ሞተር (kora-tally-pro.js — v18)
// • 100% የሻርፕ ሜታል ባለ 1-ስክሪን አቀማመጥ (ያለ Scroll)
// • 7 የቆጠራ ሲስተሞች: 10-ሳጥን ንኪኪ፣ መንሸራተቻ፣ ባለብዙ-ተሸካሚ፣ ተቀያያሪ ሸክም፣
//   ብሉቱዝ/ኪቦርድ፣ የክብደት/ጥቅል ቀያሪ እና የካሜራ በር መሻገሪያ (Tripwire)
// • የድምፅ ሞተር: የተጫነ ብዛት / የክሊክ ቁጥር / ሁለቱንም + ኦፍላይን የድምፅ ስቱዲዮ
// =============================================================================
(function (global) {
  'use strict';

  const VOICE_DB = 'kora_voice_packs_v1';
  const VOICE_STORE = 'packs';
  const PRESETS = [1, 2, 3, 5, 10, 15, 20];

  const TALLY_MODES = [
    { id: 'tap',      icon: '⚡', am: 'መደበኛ ንኪኪ (10-ዙር)',      en: 'Standard Tap (10-Box)' },
    { id: 'swipe',    icon: '👉', am: 'መንሸራተቻ (Slide)',          en: 'Slide-to-Count' },
    { id: 'carriers', icon: '👷', am: 'ባለብዙ-ተሸካሚ (2–4 ጫኞች)',  en: 'Multi-Carrier (2–4)' },
    { id: 'mixed',    icon: '🎛️', am: 'ተቀያያሪ ሸክም (Mixed Pad)', en: 'Mixed Load Pad' },
    { id: 'clicker',  icon: '🎮', am: 'ብሉቱዝ / ኪቦርድ ቆጣሪ',      en: 'Bluetooth / Key Clicker' },
    { id: 'weight',   icon: '⚖️', am: 'የክብደት / ጥቅል ቀያሪ',       en: 'Weight & Pack Calc' },
    { id: 'camera',   icon: '📷', am: 'የካሜራ በር ቆጣሪ (Tripwire)', en: 'Camera Tripwire Count' }
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
  let camStream = null;
  let camRafId = null;
  let camCanvas = null;
  let camCtx = null;
  let camPrevL = null;
  let camPrevR = null;
  let camLastTrig = 0;
  let camLastZone = null;
  let camLastZoneTs = 0;
  let timerId = null;
  let hooksReady = false;
  let origCommitFn = null;

  // ---------------------------------------------------------------------------
  // 1. መሠረታዊ አጋዥ ፋንክሽኖች (በቀጥታ state ን የሚያነቡ)
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

  function sumAny(arr) {
    return (arr || []).reduce((a, s) => a + strokeVal(s), 0);
  }

  function makeStroke(qty, carrierId) {
    const fmt = detectStrokeFmt();
    const n = Number(qty || 0);
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
      voiceRead: 'qty',      // qty | clicks | both | beep
      voiceLang: 'am-pack',  // am-pack | en-US | ar-SA | om-pack | ti-pack | dev:...
      voiceRate: 1.05,
      debounceMs: 500,
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
  // 2. ባለ 1-ስክሪን የሻርፕ ሜታል CSS
  // ---------------------------------------------------------------------------
  function injectCss() {
    if (document.getElementById('koraTallyProCss')) return;
    const st = document.createElement('style');
    st.id = 'koraTallyProCss';
    st.textContent = `
      body.ktp-active .search-wrap { display: none !important; }
      body.ktp-active #subTabsBar { display: none !important; }
      body.ktp-active .viewport { padding: 4px 8px 6px !important; overflow: hidden !important; display: flex !important; flex-direction: column !important; }
      body.ktp-active #viewRoot { flex: 1 !important; min-height: 0 !important; display: flex !important; flex-direction: column !important; gap: 5px !important; overflow: hidden !important; }

      .ktp-shell { display: flex; flex-direction: column; flex: 1; min-height: 0; gap: 5px; }
      .ktp-toprow { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
      .ktp-subtabs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; flex: 1; min-width: 0; }
      .ktp-tab { height: 30px; padding: 0 3px; border-radius: 10px; border: 1px solid var(--border-strong); background: rgba(15,23,42,0.88); color: var(--muted); font-size: 10.5px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; }
      .ktp-tab.on { background: rgba(20,184,166,0.22); border-color: var(--teal); color: #5eead4; }
      .ktp-sq { width: 30px; height: 30px; border-radius: 9px; border: 1px solid var(--border-strong); background: rgba(15,23,42,0.92); color: var(--text); font-size: 14px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; cursor: pointer; }
      .ktp-sq.locked { background: rgba(245,158,11,0.25); border-color: var(--amber); }

      .ktp-strip { display: flex; align-items: center; gap: 4px; overflow-x: auto; flex-shrink: 0; padding: 1px 0; }
      .ktp-chip { height: 26px; padding: 0 9px; border-radius: 13px; border: 1px solid var(--border-strong); background: rgba(15,23,42,0.85); color: var(--text); font-size: 11px; font-weight: 800; white-space: nowrap; flex-shrink: 0; cursor: pointer; }
      .ktp-chip.on { background: var(--teal); border-color: var(--teal); color: #041b1a; }
      .ktp-chip.done { background: rgba(16,185,129,0.22); border-color: var(--emerald); color: #6ee7b7; }
      .ktp-chip.add { border-style: dashed; border-color: var(--amber); color: var(--amber); background: transparent; }

      .ktp-bar { display: grid; gap: 4px; align-items: center; flex-shrink: 0; }
      .ktp-bar.ticket { grid-template-columns: 50px 76px 1fr 28px; }
      .ktp-bar.free   { grid-template-columns: 1fr 82px 30px; }
      .ktp-bar.audit  { grid-template-columns: 1fr 78px; }
      .ktp-inp { height: 29px; padding: 0 8px; border-radius: 8px; border: 1px solid var(--border-strong); background: rgba(11,18,32,0.95); color: var(--text); font-size: 11.5px; font-weight: 700; min-width: 0; width: 100%; }
      .ktp-dir { height: 29px; border-radius: 8px; border: 1px solid rgba(239,68,68,0.55); background: rgba(239,68,68,0.2); color: #fca5a5; font-size: 11px; font-weight: 900; cursor: pointer; }
      .ktp-dir.in { border-color: rgba(16,185,129,0.55); background: rgba(16,185,129,0.22); color: #6ee7b7; }

      .ktp-loadbox { background: rgba(15,23,42,0.82); border: 1px solid var(--border); border-radius: 10px; padding: 4px 6px; display: flex; flex-direction: column; gap: 4px; flex-shrink: 0; }
      .ktp-loadhead { display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: var(--muted); font-weight: 700; }
      .ktp-presets { display: grid; grid-template-columns: repeat(8, 1fr); gap: 3px; }
      .ktp-pbtn { height: 26px; border-radius: 7px; border: 1px solid var(--border-strong); background: rgba(11,18,32,0.92); color: var(--text); font-size: 11px; font-weight: 800; font-family: ui-monospace, monospace; cursor: pointer; }
      .ktp-pbtn.on { background: var(--teal); border-color: var(--teal); color: #032220; }

      .ktp-board { flex: 1; min-height: 0; display: flex; flex-direction: column; background: rgba(11,18,32,0.94); border: 1px solid var(--border-strong); border-radius: 13px; padding: 6px; gap: 6px; position: relative; overflow: hidden; }
      .ktp-prog { height: 4px; border-radius: 4px; background: rgba(51,65,85,0.65); overflow: hidden; flex-shrink: 0; }
      .ktp-prog-fill { height: 100%; background: linear-gradient(90deg, var(--teal), var(--emerald)); transition: width 0.15s ease; }
      .ktp-kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; flex-shrink: 0; }
      .ktp-kpi { background: rgba(15,23,42,0.88); border: 1px solid var(--border); border-radius: 9px; padding: 4px 3px; text-align: center; }
      .ktp-kpi span { display: block; font-size: 9px; color: var(--muted); font-weight: 700; }
      .ktp-kpi b { display: block; font-size: 16px; font-family: ui-monospace, monospace; font-weight: 900; line-height: 1.15; margin-top: 1px; }
      .ktp-kpi.c-teal b { color: #2dd4bf; }
      .ktp-kpi.c-em b { color: #34d399; }
      .ktp-kpi.c-amb b { color: #fbbf24; }
      .ktp-kpi.c-sky b { color: #38bdf8; }
      .ktp-kpi.c-rose b { color: #fb7185; }

      .ktp-ok-bar { background: rgba(16,185,129,0.22); border: 1px solid var(--emerald); color: #6ee7b7; font-size: 11px; font-weight: 900; text-align: center; padding: 3px 6px; border-radius: 8px; flex-shrink: 0; }
      .ktp-stage { flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: center; position: relative; overflow: hidden; }
      .ktp-rbox { background: rgba(15,23,42,0.72); border: 1px solid var(--border); border-radius: 11px; padding: 7px; display: flex; flex-direction: column; gap: 6px; }
      .ktp-rhead { display: flex; justify-content: space-between; font-size: 10.5px; font-weight: 800; color: var(--muted); font-family: ui-monospace, monospace; }
      .ktp-g10 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; }
      .ktp-cell { height: 35px; border-radius: 9px; border: 1px solid var(--border-strong); background: rgba(6,10,18,0.65); color: var(--muted); font-family: ui-monospace, monospace; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; }
      .ktp-cell.hit { background: rgba(20,184,166,0.2); border-color: var(--teal); color: #5eead4; }
      .ktp-cell.last { border-width: 2px; border-color: #2dd4bf; box-shadow: 0 0 10px rgba(45,212,191,0.35); }

      .ktp-lock-ov { position: absolute; inset: 0; background: rgba(6,10,18,0.78); backdrop-filter: blur(2px); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; border-radius: 10px; z-index: 5; }
      .ktp-mfoot { display: flex; align-items: center; justify-content: space-between; gap: 6px; font-size: 10px; color: var(--muted); font-family: ui-monospace, monospace; flex-shrink: 0; overflow: hidden; }
      .ktp-sp { padding: 1px 6px; border-radius: 99px; border: 1px solid rgba(245,158,11,0.45); background: rgba(245,158,11,0.12); color: #fcd34d; font-size: 9.5px; font-weight: 800; white-space: nowrap; }

      .ktp-dock { display: flex; flex-direction: column; gap: 5px; flex-shrink: 0; }
      .ktp-tap { height: 50px; border-radius: 13px; border: 2px solid var(--teal); background: linear-gradient(180deg, rgba(20,184,166,0.3), rgba(13,148,136,0.16)); color: #f0fdfa; font-size: 17px; font-weight: 900; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; user-select: none; -webkit-tap-highlight-color: transparent; }
      .ktp-tap:active { transform: scale(0.97); background: rgba(20,184,166,0.48); }
      .ktp-tap.locked { opacity: 0.45; border-color: var(--amber); }

      .ktp-slide { height: 50px; border-radius: 13px; border: 2px solid var(--teal); background: rgba(11,18,32,0.95); position: relative; overflow: hidden; touch-action: none; user-select: none; display: flex; align-items: center; justify-content: center; }
      .ktp-sfill { position: absolute; left: 0; top: 0; bottom: 0; width: 0%; background: rgba(20,184,166,0.32); pointer-events: none; }
      .ktp-sthumb { position: absolute; left: 3px; top: 3px; width: 58px; height: 40px; border-radius: 10px; background: var(--teal); color: #032220; font-size: 16px; font-weight: 900; display: flex; align-items: center; justify-content: center; cursor: grab; }

      .ktp-cgrid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; }
      .ktp-cbtn { height: 50px; border-radius: 12px; border: 2px solid var(--teal); background: rgba(15,23,42,0.92); color: var(--text); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; cursor: pointer; user-select: none; }
      .ktp-cbtn:active { transform: scale(0.96); }

      .ktp-mgrid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; }
      .ktp-mbtn { height: 42px; border-radius: 10px; border: 1.5px solid var(--teal); background: rgba(20,184,166,0.14); color: #5eead4; font-size: 15px; font-weight: 900; font-family: ui-monospace, monospace; cursor: pointer; }
      .ktp-mbtn:active { transform: scale(0.95); background: rgba(20,184,166,0.35); }

      .ktp-cam { position: relative; width: 100%; flex: 1; min-height: 118px; border-radius: 10px; overflow: hidden; background: #020617; border: 1px solid var(--teal); }
      .ktp-cam video { width: 100%; height: 100%; object-fit: cover; display: block; }
      .ktp-cline { position: absolute; top: 0; bottom: 0; left: 50%; width: 3px; background: #f59e0b; box-shadow: 0 0 12px #f59e0b; pointer-events: none; }
      .ktp-chud { position: absolute; top: 6px; left: 6px; right: 6px; display: flex; justify-content: space-between; pointer-events: none; }

      .ktp-acts { display: grid; grid-template-columns: 1fr 1fr 1fr 1.65fr; gap: 5px; }
      .ktp-act { height: 37px; border-radius: 10px; border: 1px solid var(--border-strong); background: rgba(15,23,42,0.92); color: var(--text); font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 3px; cursor: pointer; white-space: nowrap; }
      .ktp-act.primary { background: var(--teal); border-color: var(--teal); color: #032220; font-weight: 900; }

      .ktp-vrow { display: grid; grid-template-columns: 1fr auto auto auto; gap: 5px; align-items: center; padding: 5px 7px; border-radius: 9px; background: rgba(15,23,42,0.85); border: 1px solid var(--border); }
    `;
    document.head.appendChild(st);
  }

  // ---------------------------------------------------------------------------
  // 3. የድምፅ ሞተር + ኦፍላይን የድምፅ ጥቅል ስቱዲዮ (IndexedDB)
  // ---------------------------------------------------------------------------
  let vDbProm = null;
  const packCache = {};
  let audQueue = [];
  let audPlaying = false;
  let recorder = null;
  let recKey = '';
  let recChunks = [];

  function openVDb() {
    if (vDbProm) return vDbProm;
    vDbProm = new Promise((res, rej) => {
      try {
        const req = indexedDB.open(VOICE_DB, 1);
        req.onupgradeneeded = () => {
          if (!req.result.objectStoreNames.contains(VOICE_STORE)) req.result.createObjectStore(VOICE_STORE, { keyPath: 'id' });
        };
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
      await new Promise((res, rej) => {
        const tx = db.transaction(VOICE_STORE, 'readwrite');
        tx.objectStore(VOICE_STORE).put(pack);
        tx.oncomplete = res;
        tx.onerror = () => rej(tx.error);
      });
    } catch {}
  }

  function playNextAud() {
    if (audPlaying || !audQueue.length) return;
    audPlaying = true;
    const a = new Audio(audQueue.shift());
    a.playbackRate = Number(state.tallyPro?.voiceRate || 1.05);
    const done = () => { audPlaying = false; playNextAud(); };
    a.onended = done;
    a.onerror = done;
    a.play().catch(done);
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
      if (clips[String(t)]) {
        out.push(clips[String(t)]);
        if (o > 0 && clips[String(o)]) out.push(clips[String(o)]);
        return out;
      }
    }
    for (const ch of String(num)) if (clips[ch]) out.push(clips[ch]);
    return out;
  }

  function amPhon(n) {
    const num = Math.max(0, Math.round(Number(n || 0)));
    if (AM_PHONETIC[num]) return AM_PHONETIC[num];
    if (num > 20 && num < 100) {
      const t = Math.floor(num / 10) * 10, o = num % 10;
      return `${AM_PHONETIC[t] || t} ${AM_PHONETIC[o] || o}`;
    }
    if (num >= 100 && num < 1000) {
      const h = Math.floor(num / 100), r = num % 100;
      const hs = h === 1 ? 'meto' : `${AM_PHONETIC[h] || h} meto`;
      return r ? `${hs} ${amPhon(r)}` : hs;
    }
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
    if (cfg.voiceRead === 'beep') {
      if (typeof playTone === 'function') playTone(reached ? 880 : 620, reached ? 0.16 : 0.06, 'sine');
      return;
    }
    const lang = cfg.voiceLang || 'am-pack';
    if (lang.endsWith('-pack')) {
      const pack = await loadPack(lang);
      const clips = pack.clips || {};
      if (Object.keys(clips).length > 0) {
        audQueue = []; audPlaying = false;
        if (cfg.voiceRead === 'clicks') numClips(clicks, clips).forEach(qAud);
        else if (cfg.voiceRead === 'both') {
          if (clips.load) qAud(clips.load);
          numClips(clicks, clips).forEach(qAud);
          numClips(totalQty, clips).forEach(qAud);
        } else numClips(totalQty, clips).forEach(qAud);
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
  // 4. ንቁ የቆጠራ አውድ (ቲኬት / ነጻ / ኦዲት / ታሪክ)
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
      const id = 'tk_' + Date.now();
      const br = activeBr();
      list.push({
        id,
        dir: 'OUT',
        docNo: typeof nextBranchDoc === 'function' ? nextBranchDoc(br) : 'WH1-01',
        party: '',
        branch: br,
        activeItemId: null,
        items: []
      });
      state.tally.activeTicketId = id;
    }
    let tk = list.find((x) => x.id === state.tally.activeTicketId) || list[0];
    state.tally.activeTicketId = tk.id;
    if (!Array.isArray(tk.items)) tk.items = [];
    if (tk.items.length && !tk.items.some((x) => String(x.itemId) === String(tk.activeItemId))) {
      tk.activeItemId = tk.items[0].itemId;
    }
    return tk;
  }

  function getCtx() {
    ensureState();
    const sub = getSub();
    if (sub === 'tickets') {
      const tk = ensureTicket();
      const it = tk.items.find((x) => String(x.itemId) === String(tk.activeItemId)) || tk.items[0] || null;
      return {
        sub,
        key: it ? `tk:${tk.id}:${it.itemId}` : `tk:${tk.id}:none`,
        ticket: tk,
        item: it,
        strokes: it ? (it.strokes = it.strokes || []) : [],
        target: it ? Number(it.target || 0) : 0,
        sysQty: 0,
        ready: Boolean(it)
      };
    }
    if (sub === 'free') {
      const f = state.tally.free;
      f.strokes = f.strokes || [];
      return { sub, key: 'free:main', free: f, strokes: f.strokes, target: Number(f.target || 0), sysQty: 0, ready: true };
    }
    if (sub === 'audit') {
      const a = state.tally.audit;
      a.strokes = a.strokes || [];
      const inv = (state.inventory || []).find((x) => String(x.id) === String(a.itemId)) || (state.inventory || [])[0] || null;
      if (inv && !a.itemId) a.itemId = inv.id;
      const sys = itemStock(inv, state.branchScope || 'all');
      return { sub, key: `aud:${inv ? inv.id : 'none'}`, audit: a, inv, strokes: a.strokes, target: 0, sysQty: sys, ready: Boolean(inv) };
    }
    return { sub: 'history', key: 'hist', strokes: [], target: 0, sysQty: 0, ready: false };
  }

  function metaLog(key) {
    ensureState();
    if (!Array.isArray(state.tallyPro.metaLogs[key])) state.tallyPro.metaLogs[key] = [];
    return state.tallyPro.metaLogs[key];
  }

  function fmtAgo(ts) {
    if (!ts) return tl('ገና አልተጀመረም', 'Not started yet');
    const sec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
    if (sec < 60) return tl(`ከ${sec}ሰ በፊት`, `${sec}s ago`);
    return tl(`ከ${Math.floor(sec / 60)}ደ ${sec % 60}ሰ በፊት`, `${Math.floor(sec / 60)}m ${sec % 60}s ago`);
  }

  // ---------------------------------------------------------------------------
  // 5. የቆጠራ እርምጃዎች
  // ---------------------------------------------------------------------------
  function doCount(qtyOvr = null, carrierId = null, bypassDeb = false) {
    ensureState();
    const cfg = state.tallyPro;
    const ctx = getCtx();
    if (!ctx.ready) { showToast(tl('መጀመሪያ «+ ዕቃ ጨምር» ይጫኑ', 'Add an item first'), true); return false; }
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

    const tot = sumAny(ctx.strokes);
    const clicks = ctx.strokes.length;
    const reached = ctx.target > 0 && tot >= ctx.target;

    if (cfg.haptic && navigator.vibrate) navigator.vibrate(reached ? [80, 50, 120] : 26);
    announce(tot, clicks, reached);
    saveState();

    if (cfg.mode === 'camera' && camStream) updateLiveNums();
    else renderTallyPro();
    return true;
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
    if (!ctx.ready) { showToast(tl('መጀመሪያ ዕቃ ይምረጡ', 'Select an item first'), true); return; }
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

  function askClear() {
    const ctx = getCtx();
    if (!ctx.ready || !ctx.strokes.length) return;
    openModal(`🧹 ${tl('ቆጠራውን አጽዳ?', 'Clear Counts?')}`, `
      <p style="font-size:12.5px;color:var(--muted);">${safeEsc(tl('እስካሁን የተቆጠረው ወደ 0 ይመለሳል። እርግጠኛ ነህ?', 'Reset all counts to 0?'))}</p>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${safeEsc(tl('ተው', 'Cancel'))}</button>
      <button type="button" class="btn danger" onclick="KoraTallyPro.confirmClear()">${safeEsc(tl('አጽዳ', 'Clear'))}</button>`);
  }

  function confirmClear() {
    const ctx = getCtx();
    if (ctx.ready) {
      ctx.strokes.length = 0;
      state.tallyPro.metaLogs[ctx.key] = [];
      saveState();
    }
    closeModal();
    if (state.tallyPro.mode === 'camera' && camStream) updateLiveNums();
    else renderTallyPro();
  }

  function setLoad(n) {
    ensureState();
    if (n === 'other') {
      openModal(`⚙️ ${tl('የአንድ ሸክም መጠን', 'Custom Load Size')}`, `
        <div class="sub-card">
          <label class="lbl">${safeEsc(tl('በአንድ ሸክም ስንት ፍሬ?', 'Units per load'))}</label>
          <input id="ktpCustLoad" type="number" min="1" class="inp mono" value="${state.tallyPro.loadSize}">
        </div>`, `
        <button type="button" class="btn muted" onclick="closeModal()">${safeEsc(tl('ተው', 'Cancel'))}</button>
        <button type="button" class="btn teal" onclick="KoraTallyPro.confirmLoad()">${safeEsc(tl('አስቀምጥ', 'Save'))}</button>`);
      return;
    }
    state.tallyPro.loadSize = Math.max(1, Number(n || 1));
    state.tally.loadSize = state.tallyPro.loadSize;
    saveState();
    renderTallyPro();
  }

  function confirmLoad() {
    const v = Math.max(1, Number(document.getElementById('ktpCustLoad')?.value || 1));
    state.tallyPro.loadSize = v;
    state.tally.loadSize = v;
    saveState();
    closeModal();
    renderTallyPro();
  }

  function toggleLock() {
    ensureState();
    state.tallyPro.locked = !state.tallyPro.locked;
    if (state.tallyPro.locked) stopCamera();
    saveState();
    renderTallyPro();
  }

  // ---------------------------------------------------------------------------
  // 6. የቲኬት አስተዳደር እና ቀጥታ ምዝገባ
  // ---------------------------------------------------------------------------
  function selTicket(id) { state.tally.activeTicketId = id; saveState(); renderTallyPro(); }

  function newTicket() {
    const br = activeBr();
    const id = 'tk_' + Date.now();
    state.tally.tickets.push({
      id, dir: 'OUT', docNo: 'WH-' + String(state.tally.tickets.length + 1).padStart(2, '0'),
      party: '', branch: br, activeItemId: null, items: []
    });
    state.tally.activeTicketId = id;
    saveState();
    renderTallyPro();
  }

  function delTicket() {
    const tk = ensureTicket();
    if (state.tally.tickets.length <= 1) { tk.items = []; tk.party = ''; tk.activeItemId = null; }
    else {
      state.tally.tickets = state.tally.tickets.filter((x) => x.id !== tk.id);
      state.tally.activeTicketId = state.tally.tickets[0]?.id || null;
    }
    saveState();
    renderTallyPro();
  }

  function toggleDir() {
    const tk = ensureTicket();
    tk.dir = String(tk.dir || 'OUT').toUpperCase() === 'IN' ? 'OUT' : 'IN';
    saveState();
    renderTallyPro();
  }

  function setTkField(k, v) { const tk = ensureTicket(); tk[k] = v; saveState(); }
  function selTkItem(itemId) { const tk = ensureTicket(); tk.activeItemId = itemId; saveState(); renderTallyPro(); }

  function openAddItem() {
    const br = state.branchScope || 'all';
    const opts = (state.inventory || []).map((it) =>
      `<option value="${safeEsc(it.id)}">${safeEsc(it.name)} (${safeNum(itemStock(it, br))})</option>`
    ).join('');
    openModal(`➕ ${tl('ወደ ቲኬቱ ዕቃ ጨምር', 'Add Item to Ticket')}`, `
      <div class="sub-card">
        <label class="lbl">${safeEsc(tl('ዕቃ ይምረጡ', 'Select Item'))}</label>
        <select id="ktpInvSel" class="sel">${opts}</select>
        <label class="lbl" style="margin-top:6px;">${safeEsc(tl('ግብ / የሚጫን ብዛት (አማራጭ)', 'Target Qty (optional)'))}</label>
        <input id="ktpInvTgt" type="number" min="0" class="inp mono" placeholder="0 = ገደብ የለም">
      </div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${safeEsc(tl('ተው', 'Cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraTallyPro.confirmAddItem()">${safeEsc(tl('ጨምር', 'Add'))}</button>`);
  }

  function confirmAddItem() {
    const rawId = document.getElementById('ktpInvSel')?.value;
    const target = Math.max(0, Number(document.getElementById('ktpInvTgt')?.value || 0));
    const inv = (state.inventory || []).find((x) => String(x.id) === String(rawId));
    if (!inv) return;
    const tk = ensureTicket();
    const ex = tk.items.find((x) => String(x.itemId) === String(inv.id));
    if (ex) {
      if (target > 0) ex.target = target;
      tk.activeItemId = inv.id;
    } else {
      tk.items.push({ itemId: inv.id, name: inv.name, unit: unitLbl(inv), loc: inv.zoneCode || 'A-01', target, strokes: [] });
      tk.activeItemId = inv.id;
    }
    saveState();
    closeModal();
    renderTallyPro();
  }

  function doCommit(btn) {
    const ctx = getCtx();
    if (!ctx.ready) { showToast(tl('የሚመዘገብ ቆጠራ የለም', 'Nothing to submit'), true); return; }

    // ነባሩ commitActiveTally ካለ (የሽያጭ ቲኬቶችንና ኦዲትን በትክክል የሚያዋህድ) እሱን መጠቀም
    if (typeof origCommitFn === 'function') {
      try {
        origCommitFn(btn);
        setTimeout(() => { if (isTallyActive()) renderTallyPro(); }, 120);
        return;
      } catch {}
    }

    // Fallback ምዝገባ
    const today = new Date().toISOString().slice(0, 10);
    if (ctx.sub === 'tickets') {
      const tk = ctx.ticket;
      const br = tk.branch || activeBr();
      const nonZero = tk.items.filter((x) => sumAny(x.strokes) > 0);
      if (!nonZero.length) { showToast(tl('መጀመሪያ ቆጠራ ያድርጉ', 'Count first'), true); return; }
      const isIn = String(tk.dir).toUpperCase() === 'IN';
      nonZero.forEach((x, idx) => {
        const qty = sumAny(x.strokes);
        const inv = (state.inventory || []).find((z) => String(z.id) === String(x.itemId));
        if (inv && inv.branchStock) {
          const op = itemStock(inv, br);
          const en = Math.max(0, op + (isIn ? qty : -qty));
          inv.branchStock[br] = en;
          if (Array.isArray(state.warehouseLedger)) {
            state.warehouseLedger.push({
              id: Date.now() + idx, docNo: tk.docNo, type: isIn ? 'IN' : 'OUT', status: 'valid',
              branch: br, itemId: inv.id, itemName: inv.name, unit: unitLbl(inv), loc: inv.zoneCode || '-',
              openBal: op, inQty: isIn ? qty : 0, outQty: isIn ? 0 : qty, endBal: en,
              party: tk.party || '-', ref: 'Tally', date: today
            });
          }
        }
      });
      state.tally.history.unshift({
        id: Date.now(), type: isIn ? 'IN' : 'OUT', docNo: tk.docNo, party: tk.party || '-',
        summary: nonZero.map((x) => `${x.name}: ${sumAny(x.strokes)}`).join(' · '),
        total: nonZero.reduce((a, x) => a + sumAny(x.strokes), 0), date: new Date().toLocaleString()
      });
      tk.items = []; tk.activeItemId = null;
      saveState(); renderAll(); showToast(tl('በስቶክ ላይ ተመዝግቧል!', 'Committed to stock!'));
    } else if (ctx.sub === 'free') {
      const tot = sumAny(ctx.strokes);
      if (!(tot > 0)) return;
      state.tally.history.unshift({
        id: Date.now(), type: 'FREE', docNo: tl('ነጻ ቆጠራ', 'Free'), party: ctx.free.note || '-',
        summary: `${tot} (${ctx.strokes.length})`, total: tot, date: new Date().toLocaleString()
      });
      ctx.free.strokes = [];
      saveState(); renderTallyPro(); showToast(tl('ተቀምጧል!', 'Saved!'));
    }
  }

  // ---------------------------------------------------------------------------
  // 7. የካሜራ በር መሻገሪያ ቆጣሪ (Virtual Tripwire)
  // ---------------------------------------------------------------------------
  async function startCamera() {
    if (camStream) return;
    if (!navigator.mediaDevices?.getUserMedia) { showToast(tl('ካሜራ አይደገፍም', 'Camera unsupported'), true); return; }
    try {
      camStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 640 }, height: { ideal: 360 } }, audio: false });
      const vid = document.getElementById('ktpCamVid');
      if (vid) { vid.srcObject = camStream; await vid.play().catch(() => {}); }
      camCanvas = document.createElement('canvas');
      camCanvas.width = 64; camCanvas.height = 48;
      camCtx = camCanvas.getContext('2d', { willReadFrequently: true });
      camPrevL = null; camPrevR = null; camLastZone = null;
      const st = document.getElementById('ktpCamSt');
      if (st) st.textContent = tl('🟢 በመቁጠር ላይ', '🟢 Live');
      camLoop();
    } catch { showToast(tl('የካሜራ ፍቃድ ያስፈልጋል', 'Camera permission denied'), true); }
  }

  function stopCamera() {
    if (camRafId) { cancelAnimationFrame(camRafId); camRafId = null; }
    if (camStream) { camStream.getTracks().forEach((t) => t.stop()); camStream = null; }
    camPrevL = null; camPrevR = null;
  }

  function toggleCam() {
    if (camStream) { stopCamera(); renderTallyPro(); }
    else startCamera();
  }

  function toggleCamDir() {
    state.tallyPro.camDir = state.tallyPro.camDir === 'LR' ? 'RL' : 'LR';
    saveState();
    const b = document.getElementById('ktpCamDir');
    if (b) b.textContent = state.tallyPro.camDir === 'LR' ? '➡️ ግራ➔ቀኝ (+)' : '⬅️ ቀኝ➔ግራ (+)';
  }

  function camLoop() {
    if (!camStream) return;
    const vid = document.getElementById('ktpCamVid');
    if (vid && vid.readyState >= 2 && camCtx) {
      camCtx.drawImage(vid, 0, 0, 64, 48);
      const d = camCtx.getImageData(0, 0, 64, 48).data;
      const L = [], R = [];
      for (let y = 8; y < 40; y += 2) {
        for (let x = 16; x < 28; x += 2) { const i = (y * 64 + x) * 4; L.push((d[i] + d[i + 1] + d[i + 2]) / 3); }
        for (let x = 36; x < 48; x += 2) { const i = (y * 64 + x) * 4; R.push((d[i] + d[i + 1] + d[i + 2]) / 3); }
      }
      if (camPrevL && camPrevR) {
        let dL = 0, dR = 0;
        for (let i = 0; i < L.length; i++) { dL += Math.abs(L[i] - camPrevL[i]); dR += Math.abs(R[i] - camPrevR[i]); }
        dL /= L.length; dR /= R.length;
        const th = Number(state.tallyPro.camSensitivity || 26);
        const now = Date.now(), cool = Number(state.tallyPro.camCooldownMs || 1100);
        if (dL > th && dL > dR * 1.15) {
          if (camLastZone === 'R' && now - camLastZoneTs < 1200 && now - camLastTrig > cool) {
            camLastTrig = now; camLastZone = null;
            if (state.tallyPro.camDir === 'RL') doCount(null, null, true);
          } else { camLastZone = 'L'; camLastZoneTs = now; }
        } else if (dR > th && dR > dL * 1.15) {
          if (camLastZone === 'L' && now - camLastZoneTs < 1200 && now - camLastTrig > cool) {
            camLastTrig = now; camLastZone = null;
            if (state.tallyPro.camDir === 'LR') doCount(null, null, true);
          } else { camLastZone = 'R'; camLastZoneTs = now; }
        }
      }
      camPrevL = L; camPrevR = R;
    }
    camRafId = requestAnimationFrame(() => setTimeout(camLoop, 110));
  }

  // ---------------------------------------------------------------------------
  // 8. የክብደት/ጥቅል ቀያሪ እና የመንሸራተቻ ቆጣሪ
  // ---------------------------------------------------------------------------
  function updWeight() {
    const m = document.getElementById('ktpWM')?.value || 'weight';
    const a = Number(document.getElementById('ktpWA')?.value || 0);
    const b = Number(document.getElementById('ktpWB')?.value || 1);
    const q = (a > 0 && b > 0) ? (m === 'weight' ? Math.round(a / b) : Math.round(a * b)) : 0;
    const o = document.getElementById('ktpWO');
    if (o) o.textContent = `= ${safeNum(q)}`;
  }

  function applyWeight() {
    const m = document.getElementById('ktpWM')?.value || 'weight';
    const a = Number(document.getElementById('ktpWA')?.value || 0);
    const b = Number(document.getElementById('ktpWB')?.value || 1);
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
  // 9. ቅንብር ሞዳል (⚙️) እና ኦፍላይን የድምፅ ስቱዲዮ
  // ---------------------------------------------------------------------------
  function openSettings() {
    ensureState();
    const cfg = state.tallyPro;
    const vs = ('speechSynthesis' in global) ? global.speechSynthesis.getVoices() : [];
    const devOpts = vs.slice(0, 35).map((v) =>
      `<option value="dev:${safeEsc(v.voiceURI)}" ${cfg.voiceLang === 'dev:' + v.voiceURI ? 'selected' : ''}>${safeEsc(v.name)} (${safeEsc(v.lang)})</option>`
    ).join('');

    openModal(`⚙️ ${tl('የቆጠራ እና የድምፅ ቅንብር', 'Tally & Voice Settings')}`, `
      <div class="sub-card">
        <label class="lbl">${safeEsc(tl('የቆጠራ ሲስተም (Mode)', 'Counting Style / Mode'))}</label>
        <select id="ktpModeSel" class="sel">
          ${TALLY_MODES.map((m) => `<option value="${m.id}" ${cfg.mode === m.id ? 'selected' : ''}>${m.icon} ${safeEsc(isAm() ? m.am : m.en)}</option>`).join('')}
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
          <b>🔊 ${safeEsc(tl('የድምፅ ንባብ', 'Voice Readout'))}</b>
          <div id="ktpVTog" class="toggle ${cfg.voiceEnabled ? 'on' : ''}" onclick="this.classList.toggle('on')"></div>
        </div>
        <div class="grid-2" style="margin-top:6px;">
          <div>
            <label class="lbl">${safeEsc(tl('ምን ይናገር?', 'Readout Target'))}</label>
            <select id="ktpVRead" class="sel">
              <option value="qty" ${cfg.voiceRead === 'qty' ? 'selected' : ''}>${safeEsc(tl('የተጫነ ብዛት (5, 10, 15...)', 'Total Qty (5, 10, 15...)'))}</option>
              <option value="clicks" ${cfg.voiceRead === 'clicks' ? 'selected' : ''}>${safeEsc(tl('የክሊክ / ሸክም ቁጥር (1, 2, 3...)', 'Click / Load # (1, 2, 3...)'))}</option>
              <option value="both" ${cfg.voiceRead === 'both' ? 'selected' : ''}>${safeEsc(tl('ሁለቱንም (ሸክም 2 — 10)', 'Both (Load 2 — 10)'))}</option>
              <option value="beep" ${cfg.voiceRead === 'beep' ? 'selected' : ''}>${safeEsc(tl('ቢፕ ድምፅ ብቻ', 'Beep Tone Only'))}</option>
            </select>
          </div>
          <div>
            <label class="lbl">${safeEsc(tl('የድምፅ ቋንቋ', 'Voice Language'))}</label>
            <select id="ktpVLang" class="sel">
              <option value="am-pack" ${cfg.voiceLang === 'am-pack' ? 'selected' : ''}>🇪🇹 ${safeEsc(tl('አማርኛ (ጥቅል / ድምፅ)', 'Amharic (Pack / Voice)'))}</option>
              <option value="en-US" ${cfg.voiceLang === 'en-US' ? 'selected' : ''}>🇬🇧 English (US/UK)</option>
              <option value="ar-SA" ${cfg.voiceLang === 'ar-SA' ? 'selected' : ''}>🇸🇦 العربية (Arabic)</option>
              <option value="om-pack" ${cfg.voiceLang === 'om-pack' ? 'selected' : ''}>🇪🇹 Afaan Oromo (Pack)</option>
              <option value="ti-pack" ${cfg.voiceLang === 'ti-pack' ? 'selected' : ''}>🇪🇹 ትግርኛ (Pack)</option>
              ${devOpts}
            </select>
          </div>
        </div>
        <div class="grid-2" style="margin-top:6px;">
          <button type="button" class="btn muted sm" onclick="KoraTallyPro.testVoice()">▶️ ${safeEsc(tl('ድምፅ ሞክር', 'Test Voice'))}</button>
          <button type="button" class="btn teal sm" onclick="KoraTallyPro.openStudio()">🎙️ ${safeEsc(tl('ቋንቋ ቅረጽ / አውርድ', 'Voice Studio'))}</button>
        </div>
      </div>

      <div class="sub-card">
        <div class="switch-row"><span>⏱ ${safeEsc(tl('የመጨረሻ ንኪኪ ሰዓት ቆጣሪ', 'Last Tap Timer'))}</span><div id="ktpTTog" class="toggle ${cfg.showTimer ? 'on' : ''}" onclick="this.classList.toggle('on')"></div></div>
        <div class="switch-row"><span>🔒 ${safeEsc(tl('በስልክ ጥሪ ጊዜ ራስ-ሰር መቆለፊያ', 'Auto-Lock on Call'))}</span><div id="ktpCTog" class="toggle ${cfg.autoLockCall ? 'on' : ''}" onclick="this.classList.toggle('on')"></div></div>
        <div class="switch-row"><span>📳 ${safeEsc(tl('ጠንካራ ንዝረት', 'Strong Haptic'))}</span><div id="ktpHTog" class="toggle ${cfg.haptic ? 'on' : ''}" onclick="this.classList.toggle('on')"></div></div>
      </div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${safeEsc(tl('ተው', 'Cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraTallyPro.saveSettings()">${safeEsc(tl('አስቀምጥ', 'Save'))}</button>`);
  }

  function saveSettings() {
    const cfg = state.tallyPro;
    const prev = cfg.mode;
    cfg.mode = document.getElementById('ktpModeSel')?.value || 'tap';
    cfg.debounceMs = Number(document.getElementById('ktpDebSel')?.value || 500);
    cfg.carrierCount = Number(document.getElementById('ktpCarSel')?.value || 2);
    cfg.voiceEnabled = document.getElementById('ktpVTog')?.classList.contains('on') || false;
    cfg.voiceRead = document.getElementById('ktpVRead')?.value || 'qty';
    cfg.voiceLang = document.getElementById('ktpVLang')?.value || 'am-pack';
    cfg.showTimer = document.getElementById('ktpTTog')?.classList.contains('on') || false;
    cfg.autoLockCall = document.getElementById('ktpCTog')?.classList.contains('on') || false;
    cfg.haptic = document.getElementById('ktpHTog')?.classList.contains('on') || false;
    if (prev === 'camera' && cfg.mode !== 'camera') stopCamera();
    saveState(); closeModal(); renderTallyPro(); showToast(tl('ተቀምጧል', 'Saved'));
  }

  function testVoice() {
    ensureState();
    const cfg = state.tallyPro;
    const bak = { e: cfg.voiceEnabled, r: cfg.voiceRead, l: cfg.voiceLang };
    cfg.voiceEnabled = true;
    const r = document.getElementById('ktpVRead'), l = document.getElementById('ktpVLang');
    if (r) cfg.voiceRead = r.value;
    if (l) cfg.voiceLang = l.value;
    announce(10, 2, false);
    cfg.voiceEnabled = bak.e; cfg.voiceRead = bak.r; cfg.voiceLang = bak.l;
  }

  async function openStudio(pid = null) {
    ensureState();
    const cur = state.tallyPro.voiceLang || 'am-pack';
    const packId = pid || (cur.endsWith('-pack') ? cur : 'am-pack');
    const pack = await loadPack(packId);
    const clips = pack.clips || {};

    openModal(`🎙️ ${tl('ኦፍላይን የድምፅ ጥቅል ስቱዲዮ', 'Offline Voice Pack Studio')}`, `
      <div class="sub-card">
        <div class="card-row">
          <select class="sel" style="height:30px;flex:1;" onchange="KoraTallyPro.openStudio(this.value)">
            <option value="am-pack" ${packId === 'am-pack' ? 'selected' : ''}>🇪🇹 አማርኛ (am-pack)</option>
            <option value="om-pack" ${packId === 'om-pack' ? 'selected' : ''}>🇪🇹 Afaan Oromo (om-pack)</option>
            <option value="ti-pack" ${packId === 'ti-pack' ? 'selected' : ''}>🇪🇹 ትግርኛ (ti-pack)</option>
            <option value="custom-pack" ${packId === 'custom-pack' ? 'selected' : ''}>🌍 ሌላ ቋንቋ (custom-pack)</option>
          </select>
          <span class="pill teal">${Object.keys(clips).length}/${VOICE_KEYS.length}</span>
        </div>
        <div class="grid-2" style="margin-top:6px;">
          <button type="button" class="btn muted sm" onclick="KoraTallyPro.expPack('${safeEsc(packId)}')">⬇️ ${safeEsc(tl('ጥቅሉን አውርድ', 'Export'))}</button>
          <label class="btn teal sm" style="text-align:center;">⬆️ ${safeEsc(tl('ጥቅል ጫን', 'Import'))}<input type="file" accept=".json" style="display:none;" onchange="KoraTallyPro.impPack(this,'${safeEsc(packId)}')"></label>
        </div>
        <div style="display:flex;gap:4px;margin-top:6px;">
          <input id="ktpPUrl" class="inp sm" placeholder="${safeEsc(tl('የድምፅ ጥቅል ሊንክ (URL)...', 'Voice pack URL...'))}">
          <button type="button" class="btn muted sm" onclick="KoraTallyPro.dlPack('${safeEsc(packId)}')">🌐 ${safeEsc(tl('አውርድ', 'Fetch'))}</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;max-height:260px;overflow-y:auto;">
        ${VOICE_KEYS.map((vk) => {
          const has = Boolean(clips[vk.k]), isR = recKey === vk.k;
          return `
            <div class="ktp-vrow">
              <b style="font-size:11.5px;color:${has ? '#5eead4' : 'var(--text)'};">${has ? '✓ ' : ''}${safeEsc(vk.am)}</b>
              <button type="button" class="btn sm ${isR ? 'danger' : 'teal'}" onclick="KoraTallyPro.recClip('${safeEsc(packId)}','${vk.k}')">${isR ? '⏹️' : '🎙️'}</button>
              <button type="button" class="btn sm muted" ${has ? '' : 'disabled'} onclick="KoraTallyPro.playClip('${safeEsc(packId)}','${vk.k}')">▶️</button>
              <button type="button" class="btn sm ghost" ${has ? '' : 'disabled'} style="color:var(--rose);" onclick="KoraTallyPro.delClip('${safeEsc(packId)}','${vk.k}')">✕</button>
            </div>`;
        }).join('')}
      </div>`, `
      <button type="button" class="btn teal" onclick="closeModal();KoraTallyPro.openSettings()">${safeEsc(tl('ጨርስ', 'Done'))}</button>`);
  }

  async function recClip(packId, key) {
    if (recorder && recorder.state === 'recording') { recorder.stop(); return; }
    if (!navigator.mediaDevices?.getUserMedia) { showToast(tl('ማይክሮፎን አልተገኘም', 'No mic'), true); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recChunks = []; recKey = key;
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => { if (e.data.size > 0) recChunks.push(e.data); };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const rd = new FileReader();
        rd.onload = async () => {
          const p = await loadPack(packId);
          p.clips = p.clips || {}; p.clips[key] = rd.result;
          await savePack(p);
          recKey = ''; openStudio(packId); showToast(tl('ተቀርጿል', 'Recorded'));
        };
        rd.readAsDataURL(new Blob(recChunks, { type: recorder.mimeType || 'audio/webm' }));
      };
      recorder.start();
      openStudio(packId);
      setTimeout(() => { if (recorder && recorder.state === 'recording' && recKey === key) recorder.stop(); }, 2200);
    } catch { recKey = ''; showToast(tl('የማይክሮፎን ፍቃድ ያስፈልጋል', 'Mic denied'), true); }
  }

  async function playClip(packId, key) { const p = await loadPack(packId); if (p.clips?.[key]) qAud(p.clips[key]); }
  async function delClip(packId, key) { const p = await loadPack(packId); if (p.clips) delete p.clips[key]; await savePack(p); openStudio(packId); }
  async function expPack(packId) {
    const p = await loadPack(packId);
    const url = URL.createObjectURL(new Blob([JSON.stringify(p)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = `kora-voice-${packId}.json`; a.click();
    URL.revokeObjectURL(url); showToast(tl('ወርዷል', 'Exported'));
  }
  function impPack(inp, packId) {
    const f = inp.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = async () => {
      try {
        const p = JSON.parse(String(r.result || '{}'));
        if (!p || typeof p.clips !== 'object') throw 0;
        p.id = packId; await savePack(p);
        state.tallyPro.voiceLang = packId; saveState(); openStudio(packId); showToast(tl('ተጭኗል', 'Installed'));
      } catch { showToast(tl('ትክክለኛ ፋይል አይደለም', 'Invalid file'), true); }
    };
    r.readAsText(f);
  }
  async function dlPack(packId) {
    const u = (document.getElementById('ktpPUrl')?.value || '').trim(); if (!u) return;
    try {
      const res = await fetch(u); if (!res.ok) throw 0;
      const p = await res.json(); if (!p || typeof p.clips !== 'object') throw 0;
      p.id = packId; await savePack(p);
      state.tallyPro.voiceLang = packId; saveState(); openStudio(packId); showToast(tl('ወርዶ ተቀምጧል', 'Downloaded'));
    } catch { showToast(tl('ማውረድ አልተቻለም', 'Download failed'), true); }
  }

  // ---------------------------------------------------------------------------
  // 10. ባለ 1-ስክሪን የቆጠራ UI ሠሪ
  // ---------------------------------------------------------------------------
  function build10Grid(strokes) {
    const clicks = strokes.length;
    const full = Math.floor(clicks / 10), inR = clicks % 10;
    const fullQ = sumAny(strokes.slice(0, full * 10));
    const curS = strokes.slice(full * 10), curQ = sumAny(curS);
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
    const mInfo = TALLY_MODES.find((m) => m.id === cfg.mode) || TALLY_MODES[0];

    const topRow = `
      <div class="ktp-toprow">
        <div class="ktp-subtabs">
          <button type="button" class="ktp-tab ${sub === 'tickets' ? 'on' : ''}" onclick="KoraTallyPro.setSub('tickets')">${safeEsc(tl('የጭነት ቲኬት', 'Tickets'))}</button>
          <button type="button" class="ktp-tab ${sub === 'free' ? 'on' : ''}" onclick="KoraTallyPro.setSub('free')">${safeEsc(tl('ነጻ ቆጠራ', 'Free'))}</button>
          <button type="button" class="ktp-tab ${sub === 'audit' ? 'on' : ''}" onclick="KoraTallyPro.setSub('audit')">${safeEsc(tl('ኦዲት', 'Audit'))}</button>
          <button type="button" class="ktp-tab ${sub === 'history' ? 'on' : ''}" onclick="KoraTallyPro.setSub('history')">${safeEsc(tl('ታሪክ', 'History'))}</button>
        </div>
        <button type="button" class="ktp-sq ${cfg.locked ? 'locked' : ''}" onclick="KoraTallyPro.toggleLock()">${cfg.locked ? '🔒' : '🔓'}</button>
        <button type="button" class="ktp-sq" onclick="KoraTallyPro.openSettings()">⚙️</button>
      </div>`;

    if (sub === 'history') {
      const rows = (state.tally.history || []).map((h) => `
        <div class="sub-card" style="padding:8px 10px;">
          <div class="card-row">
            <b style="font-size:12px;">${safeEsc(h.docNo || h.ref || '')} · ${safeEsc(h.party || '')}</b>
            <span class="pill teal">${safeNum(h.total || h.qty || 0)}</span>
          </div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px;">${safeEsc(h.summary || h.itemName || '')}</div>
          <div style="font-size:10px;color:var(--muted);margin-top:2px;">🕒 ${safeEsc(h.date || '')}</div>
        </div>`).join('') || `<div class="sub-card" style="text-align:center;color:var(--muted);padding:24px;">${safeEsc(tl('የቆጠራ ታሪክ የለም', 'No history yet'))}</div>`;
      root.innerHTML = `<div class="ktp-shell">${topRow}<div style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:6px;">${rows}</div></div>`;
      return;
    }

    let headHtml = '';
    if (sub === 'tickets') {
      const tk = ctx.ticket;
      const isIn = String(tk.dir || 'OUT').toUpperCase() === 'IN';
      headHtml = `
        <div class="ktp-strip no-scrollbar">
          ${state.tally.tickets.map((t) => `<button type="button" class="ktp-chip ${t.id === tk.id ? 'on' : ''}" onclick="KoraTallyPro.selTicket('${safeEsc(t.id)}')">🚛 ${safeEsc(t.docNo || t.id)}</button>`).join('')}
          <button type="button" class="ktp-chip add" onclick="KoraTallyPro.newTicket()">+ ${safeEsc(tl('አዲስ', 'New'))}</button>
        </div>
        <div class="ktp-bar ticket">
          <button type="button" class="ktp-dir ${isIn ? 'in' : ''}" onclick="KoraTallyPro.toggleDir()">${isIn ? tl('ገቢ', 'IN') : tl('ወጪ', 'OUT')}</button>
          <input class="ktp-inp mono" value="${safeEsc(tk.docNo || '')}" placeholder="ኮድ" onchange="KoraTallyPro.setTkField('docNo',this.value)">
          <input class="ktp-inp" value="${safeEsc(tk.party || '')}" placeholder="${safeEsc(tl('ደንበኛ / አቅራቢ', 'Party'))}" onchange="KoraTallyPro.setTkField('party',this.value)">
          <button type="button" class="ktp-sq" style="width:28px;height:29px;color:#fb7185;" onclick="KoraTallyPro.delTicket()">✕</button>
        </div>
        <div class="ktp-strip no-scrollbar">
          ${tk.items.map((x) => {
            const q = sumAny(x.strokes), done = x.target > 0 && q >= x.target;
            const lbl = x.target > 0 ? `${x.name} (${q}/${x.target})` : `${x.name} (${q})`;
            const act = String(x.itemId) === String(tk.activeItemId);
            return `<button type="button" class="ktp-chip ${act ? 'on' : (done ? 'done' : '')}" onclick="KoraTallyPro.selTkItem('${safeEsc(x.itemId)}')">${done ? '✓ ' : ''}${safeEsc(lbl)}</button>`;
          }).join('')}
          <button type="button" class="ktp-chip add" onclick="KoraTallyPro.openAddItem()">+ ${safeEsc(tl('ዕቃ ጨምር', 'Add Item'))}</button>
        </div>`;
    } else if (sub === 'free') {
      headHtml = `
        <div class="ktp-bar free">
          <input class="ktp-inp" value="${safeEsc(ctx.free.note || '')}" placeholder="${safeEsc(tl('ማስታወሻ (አማራጭ)', 'Note'))}" oninput="state.tally.free.note=this.value;saveState();">
          <input class="ktp-inp mono" type="number" min="0" style="text-align:center;color:#38bdf8;" value="${ctx.free.target || ''}" placeholder="${safeEsc(tl('ግብ', 'Target'))}" onchange="state.tally.free.target=Math.max(0,Number(this.value||0));saveState();KoraTallyPro.render();">
          <button type="button" class="ktp-sq" onclick="KoraTallyPro.openSettings()">${mInfo.icon}</button>
        </div>`;
    } else if (sub === 'audit') {
      const br = state.branchScope || 'all';
      headHtml = `
        <div class="ktp-bar audit">
          <select class="ktp-inp" onchange="state.tally.audit.itemId=this.value;state.tally.audit.strokes=[];saveState();KoraTallyPro.render();">
            ${(state.inventory || []).map((it) => `<option value="${safeEsc(it.id)}" ${ctx.inv && String(ctx.inv.id) === String(it.id) ? 'selected' : ''}>${safeEsc(it.name)} (${safeNum(itemStock(it, br))})</option>`).join('')}
          </select>
          <div class="ktp-inp mono" style="display:flex;align-items:center;justify-content:center;color:#38bdf8;">${safeNum(ctx.sysQty)}</div>
        </div>`;
    }

    const presetHtml = `
      <div class="ktp-loadbox">
        <div class="ktp-loadhead">
          <span>${safeEsc(tl('በአንድ ሸክም', 'Per Load'))}: <b style="color:#5eead4;">1 = ${ls}</b></span>
          <button type="button" style="background:none;border:none;color:#fbbf24;font-size:10px;font-weight:800;cursor:pointer;" onclick="KoraTallyPro.openSettings()">${mInfo.icon} ${safeEsc(isAm() ? mInfo.am : mInfo.en)} ▾</button>
        </div>
        <div class="ktp-presets">
          ${PRESETS.map((n) => `<button type="button" class="ktp-pbtn ${ls === n ? 'on' : ''}" onclick="KoraTallyPro.setLoad(${n})">+${n}</button>`).join('')}
          <button type="button" class="ktp-pbtn ${!PRESETS.includes(ls) ? 'on' : ''}" onclick="KoraTallyPro.setLoad('other')">${safeEsc(tl('ሌላ', 'Oth'))}</button>
        </div>
      </div>`;

    let kpiHtml = '', pct = 0;
    const reached = ctx.target > 0 && tot >= ctx.target;
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
      const rem = ctx.target > 0 ? Math.max(0, ctx.target - tot) : null;
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

    let stage = '';
    if (!ctx.ready) {
      stage = `<div style="text-align:center;color:var(--muted);font-size:12px;padding:12px;">${safeEsc(tl('ዕቃ ለመቁጠር ከላይ «+ ዕቃ ጨምር» ይጫኑ', 'Tap "+ Add Item" above'))}</div>`;
    } else if (cfg.mode === 'camera') {
      stage = `
        <div class="ktp-cam">
          <video id="ktpCamVid" playsinline muted autoplay></video>
          <div class="ktp-cline"></div>
          <div class="ktp-chud">
            <span id="ktpCamSt" class="pill ${camStream ? 'teal' : 'amber'}">${camStream ? tl('🟢 በመቁጠር ላይ', '🟢 Live') : tl('⏸️ ቆሟል', '⏸️ Stopped')}</span>
            <button id="ktpCamDir" type="button" style="pointer-events:auto;height:24px;padding:0 8px;border-radius:12px;border:1px solid var(--amber);background:rgba(15,23,42,0.88);color:#fcd34d;font-size:10px;font-weight:800;" onclick="KoraTallyPro.toggleCamDir()">${cfg.camDir === 'LR' ? '➡️ ግራ➔ቀኝ (+)' : '⬅️ ቀኝ➔ግራ (+)'}</button>
          </div>
        </div>`;
    } else if (cfg.mode === 'weight') {
      stage = `
        <div class="ktp-rbox">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
            <select id="ktpWM" class="ktp-inp" style="flex:1;" onchange="KoraTallyPro.updWeight()">
              <option value="weight">⚖️ ${safeEsc(tl('ጠቅላላ ክብደት ÷ የ1 ፍሬ ክብደት', 'Weight ÷ Unit Wt'))}</option>
              <option value="pack">📦 ${safeEsc(tl('ጥቅል × በጥቅል ያለ ፍሬ', 'Packs × Units'))}</option>
            </select>
            <b id="ktpWO" style="color:#2dd4bf;font-size:16px;font-family:ui-monospace,monospace;">= 0</b>
          </div>
          <div class="grid-2" style="gap:5px;">
            <input id="ktpWA" type="number" step="any" class="ktp-inp mono" placeholder="${safeEsc(tl('ክብደት / ጥቅል', 'Wt / Packs'))}" oninput="KoraTallyPro.updWeight()">
            <input id="ktpWB" type="number" step="any" class="ktp-inp mono" value="1" placeholder="${safeEsc(tl('የ1 ፍሬ ክብደት', 'Unit wt'))}" oninput="KoraTallyPro.updWeight()">
          </div>
          <button type="button" class="btn teal sm" onclick="KoraTallyPro.applyWeight()">➕ ${safeEsc(tl('ውጤቱን ጨምር', 'Add to Tally'))}</button>
        </div>`;
    } else if (cfg.mode === 'carriers') {
      const cars = cfg.carriers.slice(0, Number(cfg.carrierCount || 2));
      const m = metaLog(ctx.key);
      const chips = cars.map((c) => {
        const cl = m.filter((x) => x.carrierId === c.id);
        return `<span class="ktp-chip" style="border-color:${c.color};color:${c.color};">${safeEsc(c.name)}: ${cl.reduce((a, x) => a + x.qty, 0)} (${cl.length})</span>`;
      }).join('');
      stage = `<div class="ktp-strip no-scrollbar" style="margin-bottom:4px;">${chips}</div>${build10Grid(ctx.strokes)}`;
    } else if (cfg.mode === 'clicker') {
      stage = `<div style="text-align:center;font-size:10.5px;color:#5eead4;margin-bottom:4px;font-weight:800;">🎮 ${safeEsc(tl('ብሉቱዝ ቁልፍ / Enter / Space ዝግጁ ነው', 'Bluetooth Clicker / Enter / Space Ready'))}</div>${build10Grid(ctx.strokes)}`;
    } else {
      stage = build10Grid(ctx.strokes);
    }

    const lockOv = cfg.locked ? `
      <div class="ktp-lock-ov">
        <div style="font-size:20px;">🔒</div>
        <div style="font-size:12px;font-weight:900;color:#fbbf24;">${safeEsc(tl('ቆጠራው ተቆልፏል', 'Tally Locked'))}</div>
        <button type="button" class="btn teal sm" onclick="KoraTallyPro.toggleLock()">▶ ${safeEsc(tl('ቆጠራ ቀጥል', 'Resume'))}</button>
      </div>` : '';

    const meta = metaLog(ctx.key);
    const lastTs = meta.length ? meta[meta.length - 1].ts : 0;
    const speeds = meta.slice(-3).reverse().map((m, i) => `<span class="ktp-sp">#${meta.length - i} (${m.dt || '0.0'}s)</span>`).join(' ');
    const mFoot = cfg.showTimer ? `<div class="ktp-mfoot"><span id="ktpAgo">⏱ ${safeEsc(fmtAgo(lastTs))}</span><div style="display:flex;gap:3px;overflow:hidden;">${speeds}</div></div>` : '';

    let dockCtrl = '';
    if (cfg.mode === 'swipe') {
      dockCtrl = `
        <div id="ktpSlide" class="ktp-slide">
          <div id="ktpSFill" class="ktp-sfill"></div>
          <span style="font-size:12px;font-weight:800;color:#5eead4;pointer-events:none;">👉 ${safeEsc(tl(`ወደ ቀኝ አንሸራትት (+${ls})`, `Slide Right (+${ls})`))}</span>
          <div id="ktpSThumb" class="ktp-sthumb">⚡+${ls}</div>
        </div>`;
    } else if (cfg.mode === 'carriers') {
      const cars = cfg.carriers.slice(0, Number(cfg.carrierCount || 2));
      dockCtrl = `<div class="ktp-cgrid">${cars.map((c) => `<button type="button" class="ktp-cbtn" style="border-color:${c.color};" onclick="KoraTallyPro.count(null,'${c.id}')"><span style="font-size:10.5px;font-weight:800;color:${c.color};">👷 ${safeEsc(c.name)}</span><b style="font-size:15px;">⚡ +${ls}</b></button>`).join('')}</div>`;
    } else if (cfg.mode === 'mixed') {
      dockCtrl = `<div class="ktp-mgrid">${[1, 2, 3, 5, 10, 15, 20].map((v) => `<button type="button" class="ktp-mbtn" onclick="KoraTallyPro.count(${v})">+${v}</button>`).join('')}<button type="button" class="ktp-mbtn" style="border-color:var(--amber);color:#fbbf24;" onclick="KoraTallyPro.openPartial()">${safeEsc(tl('ሌላ', 'Oth'))}</button></div>`;
    } else if (cfg.mode === 'camera') {
      dockCtrl = `<div class="grid-2" style="gap:6px;"><button type="button" class="ktp-tap" style="height:45px;font-size:13px;border-color:${camStream ? 'var(--rose)' : 'var(--teal)'};" onclick="KoraTallyPro.toggleCam()">${camStream ? '⏹️ ' + tl('ካሜራ አቁም', 'Stop') : '📷 ' + tl('ካሜራ ጀምር', 'Start Cam')}</button><button type="button" class="ktp-tap ${cfg.locked ? 'locked' : ''}" style="height:45px;font-size:14px;" onclick="KoraTallyPro.count()">⚡ +${ls} ${safeEsc(tl('ቁጠር', 'Count'))}</button></div>`;
    } else {
      dockCtrl = `<button type="button" class="ktp-tap ${cfg.locked ? 'locked' : ''}" onclick="KoraTallyPro.count()">⚡ +${ls} ${safeEsc(tl('ቁጠር', 'COUNT'))}</button>`;
    }

    const pLbl = sub === 'tickets' ? `✓ ${tl('ቀጥታ መዝግብ', 'Commit')}` : (sub === 'free' ? `💾 ${tl('አስቀምጥ', 'Save')}` : `⚡ ${tl('ማስተካከያ ላክ', 'Apply')}`);

    root.innerHTML = `
      <div class="ktp-shell">
        ${topRow}
        ${headHtml}
        ${presetHtml}
        <div class="ktp-board">
          <div class="ktp-prog"><div id="ktpPF" class="ktp-prog-fill" style="width:${pct}%"></div></div>
          ${kpiHtml}
          ${reached ? `<div class="ktp-ok-bar">✓ ${safeEsc(tl('ግቡ ሞልቷል — ጭነት አስቁም', 'Target Reached — Stop Loading'))}</div>` : ''}
          <div class="ktp-stage">${stage}${lockOv}</div>
          ${mFoot}
        </div>
        <div class="ktp-dock">
          ${dockCtrl}
          <div class="ktp-acts">
            <button type="button" class="ktp-act" onclick="KoraTallyPro.undo()">↩️ ${safeEsc(tl('መልስ', 'Undo'))}</button>
            <button type="button" class="ktp-act" onclick="KoraTallyPro.openPartial()">+ ${safeEsc(tl('ጎዶሎ', 'Part'))}</button>
            <button type="button" class="ktp-act" onclick="KoraTallyPro.clear()">🧹 ${safeEsc(tl('አጽዳ', 'Clear'))}</button>
            <button type="button" class="ktp-act primary" onclick="KoraTallyPro.commit(this)">${safeEsc(pLbl)}</button>
          </div>
        </div>
      </div>`;

    if (cfg.mode === 'swipe') bindSlide();
    if (cfg.mode === 'camera' && camStream) {
      const v = document.getElementById('ktpCamVid');
      if (v && v.srcObject !== camStream) { v.srcObject = camStream; v.play().catch(() => {}); }
    }
  }

  // ---------------------------------------------------------------------------
  // 11. ውህደት ከኮራ ስቶክ ጋር (Hooks)
  // ---------------------------------------------------------------------------
  function isTallyActive() {
    return hasState() && state.activeMainTab === 'tally';
  }

  function installHooks() {
    if (hooksReady || !hasState()) return;
    hooksReady = true;
    ensureState();
    injectCss();

    if (typeof global.commitActiveTally === 'function') {
      origCommitFn = global.commitActiveTally;
    }

    // 1. renderTally ን በቀጥታ መተካት
    global.renderTally = function () {
      renderTallyPro();
    };

    // 2. renderView ሲጠራ ከቆጠራ ሲወጣ ክላሱንና ካሜራውን ማጽዳት
    if (typeof global.renderView === 'function') {
      const origRV = global.renderView;
      global.renderView = function () {
        if (!isTallyActive()) {
          document.body.classList.remove('ktp-active');
          stopCamera();
        }
        const res = origRV.apply(this, arguments);
        if (isTallyActive()) renderTallyPro();
        return res;
      };
    }

    // 3. ከጎን ሜኑ «የቆጠራ ቅንብር» ሲነካ አዲሱን ቅንብር መክፈት
    if (typeof global.renderSetupPage === 'function') {
      const origSP = global.renderSetupPage;
      global.renderSetupPage = function (page) {
        if (page === 'tally' || page === 'tallySettings') {
          const root = document.getElementById('viewRoot');
          if (root) {
            root.innerHTML = `
              <div class="card">
                <b style="color:var(--teal);">⚙️ ${safeEsc(tl('የቆጠራ እና የድምፅ ቅንብር', 'Tally & Voice Settings'))}</b>
                <div class="grid-2" style="margin-top:8px;">
                  <button type="button" class="btn teal" onclick="KoraTallyPro.openSettings()">⚙️ ${safeEsc(tl('የቆጠራ ቅንብር ክፈት', 'Open Settings'))}</button>
                  <button type="button" class="btn muted" onclick="KoraTallyPro.openStudio()">🎙️ ${safeEsc(tl('የድምፅ ስቱዲዮ', 'Voice Studio'))}</button>
                </div>
              </div>`;
            return;
          }
        }
        return origSP.apply(this, arguments);
      };
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && isTallyActive() && state.tallyPro?.autoLockCall) {
        state.tallyPro.locked = true;
        stopCamera();
        saveState();
      } else if (!document.hidden && isTallyActive()) {
        renderTallyPro();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!isTallyActive() || state.tallyPro?.mode !== 'clicker') return;
      const tag = (document.activeElement?.tagName || '').toUpperCase();
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      if (['Enter', ' ', 'ArrowUp', 'ArrowRight', 'AudioVolumeUp', 'VolumeUp', 'MediaPlayPause'].includes(e.key)) {
        e.preventDefault();
        doCount(null, null, false);
      }
    });

    if (!timerId) {
      timerId = setInterval(() => {
        if (!isTallyActive() || !state.tallyPro?.showTimer) return;
        const el = document.getElementById('ktpAgo');
        if (!el) return;
        const m = metaLog(getCtx().key);
        el.textContent = '⏱ ' + fmtAgo(m.length ? m[m.length - 1].ts : 0);
      }, 1000);
    }

    if (isTallyActive()) renderTallyPro();
  }

  global.KoraTallyPro = {
    render: renderTallyPro, setSub, count: doCount, undo: doUndo,
    openPartial, confirmPartial, clear: askClear, confirmClear,
    setLoad, confirmLoad, toggleLock, selTicket, newTicket, delTicket,
    toggleDir, setTkField, selTkItem, openAddItem, confirmAddItem,
    commit: doCommit, openSettings, saveSettings, testVoice,
    openStudio, recClip, playClip, delClip, expPack, impPack, dlPack,
    toggleCam, toggleCamDir, updWeight, applyWeight
  };

  installHooks();
  document.addEventListener('DOMContentLoaded', installHooks);
  setTimeout(installHooks, 300);
})(window);
