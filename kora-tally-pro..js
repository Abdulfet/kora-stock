// =============================================================================
// ኮራ ስቶክ — ባለ 1-ስክሪን ፕሮፌሽናል ቆጠራ ሞተር (kora-tally-pro.js — ክፍል 1 ከ 2)
// • 100% የሻርፕ ሜታል ባለ 1-ስክሪን አቀማመጥ (ያለ Scroll)
// • 7 የቆጠራ ሲስተሞች: 10-ሳጥን ንኪኪ፣ መንሸራተቻ፣ ባለብዙ-ተሸካሚ፣ ተቀያያሪ ሸክም፣
//   ብሉቱዝ/ኪቦርድ፣ የክብደት/ጥቅል ቀያሪ፣ እና የካሜራ መስመር መሻገሪያ (Tripwire)
// • የድምፅ ሞተር: የተጫነ ብዛት / የክሊክ ብዛት / ሁለቱንም + የስልክ ቋንቋዎች +
//   ኦፍላይን የሚወርድና የሚቀረጽ የአማርኛ/ሌላ ቋንቋ ድምፅ ስቱዲዮ (IndexedDB)
// =============================================================================
(function (global) {
  'use strict';

  const VOICE_DB_NAME = 'kora_voice_packs_v1';
  const VOICE_STORE = 'packs';

  const TALLY_MODES = [
    { id: 'tap',      icon: '⚡', am: 'መደበኛ ንኪኪ (10-ዙር)',     en: 'Standard Tap (10-Box)' },
    { id: 'swipe',    icon: '👉', am: 'መንሸራተቻ (Slide)',         en: 'Slide-to-Count' },
    { id: 'carriers', icon: '👷', am: 'ባለብዙ-ተሸካሚ (2–4 ጫኞች)', en: 'Multi-Carrier (2–4)' },
    { id: 'mixed',    icon: '🎛️', am: 'ተቀያያሪ ሸክም (Mixed Pad)', en: 'Mixed Load Pad' },
    { id: 'clicker',  icon: '🎮', am: 'ብሉቱዝ / ኪቦርድ ቆጣሪ',     en: 'Bluetooth / Key Clicker' },
    { id: 'weight',   icon: '⚖️', am: 'የክብደት / ጥቅል ቀያሪ',      en: 'Weight & Pack Calc' },
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

  // ---------------------------------------------------------------------------
  // 1. ባለ 1-ስክሪን የሻርፕ ሜታል ስታይሎች (CSS)
  // ---------------------------------------------------------------------------
  function injectTallyProStyles() {
    if (document.getElementById('koraTallyProCss')) return;
    const st = document.createElement('style');
    st.id = 'koraTallyProCss';
    st.textContent = `
      /* በቆጠራ ገጽ ላይ ቦታ የሚበላውን መፈለጊያና ድርብ ታብ በመደበቅ 1-ስክሪን ማድረግ */
      body.ktp-active .search-wrap { display: none !important; }
      body.ktp-active #subTabsBar { display: none !important; }
      body.ktp-active #viewRoot {
        padding: 4px 8px 6px !important;
        overflow: hidden !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 5px !important;
      }

      .ktp-shell {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
        gap: 5px;
      }

      /* ረድፍ 1: ታቦች + ቁልፍ + ቅንብር በአንድ መስመር */
      .ktp-toprow {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-shrink: 0;
      }
      .ktp-subtabs {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 4px;
        flex: 1;
        min-width: 0;
      }
      .ktp-tab {
        height: 30px;
        padding: 0 4px;
        border-radius: 10px;
        border: 1px solid var(--border-strong);
        background: rgba(15, 23, 42, 0.85);
        color: var(--muted);
        font-size: 10.5px;
        font-weight: 800;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
      }
      .ktp-tab.on {
        background: rgba(20, 184, 166, 0.22);
        border-color: var(--teal);
        color: #5eead4;
      }
      .ktp-sqbtn {
        width: 30px;
        height: 30px;
        border-radius: 9px;
        border: 1px solid var(--border-strong);
        background: rgba(15, 23, 42, 0.9);
        color: var(--text);
        font-size: 14px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        cursor: pointer;
      }
      .ktp-sqbtn.locked {
        background: rgba(245, 158, 11, 0.22);
        border-color: var(--amber);
      }

      /* ረድፍ 2: የቲኬት ዝርዝር እና የዕቃ መስመር (በቀጭን ቅርጽ) */
      .ktp-strip {
        display: flex;
        align-items: center;
        gap: 4px;
        overflow-x: auto;
        flex-shrink: 0;
        padding: 1px 0;
      }
      .ktp-chip {
        height: 26px;
        padding: 0 9px;
        border-radius: 13px;
        border: 1px solid var(--border-strong);
        background: rgba(15, 23, 42, 0.8);
        color: var(--text);
        font-size: 11px;
        font-weight: 800;
        white-space: nowrap;
        flex-shrink: 0;
        cursor: pointer;
      }
      .ktp-chip.on { background: var(--teal); border-color: var(--teal); color: #041b1a; }
      .ktp-chip.done { background: rgba(16, 185, 129, 0.2); border-color: var(--emerald); color: #6ee7b7; }
      .ktp-chip.add { border-style: dashed; border-color: var(--amber); color: var(--amber); background: transparent; }

      .ktp-bar {
        display: grid;
        gap: 4px;
        align-items: center;
        flex-shrink: 0;
      }
      .ktp-bar.ticket { grid-template-columns: 52px 74px 1fr 28px; }
      .ktp-bar.free   { grid-template-columns: 1fr 84px 30px; }
      .ktp-bar.audit  { grid-template-columns: 1fr 78px; }
      .ktp-mini-inp {
        height: 29px;
        padding: 0 8px;
        border-radius: 8px;
        border: 1px solid var(--border-strong);
        background: rgba(11, 18, 32, 0.95);
        color: var(--text);
        font-size: 11.5px;
        font-weight: 700;
        min-width: 0;
        width: 100%;
      }
      .ktp-dir-btn {
        height: 29px;
        border-radius: 8px;
        border: 1px solid rgba(239, 68, 68, 0.5);
        background: rgba(239, 68, 68, 0.18);
        color: #fca5a5;
        font-size: 11px;
        font-weight: 900;
        cursor: pointer;
      }
      .ktp-dir-btn.in {
        border-color: rgba(16, 185, 129, 0.5);
        background: rgba(16, 185, 129, 0.2);
        color: #6ee7b7;
      }

      /* ረድፍ 3: የአንድ ሸክም መጠን */
      .ktp-loadbox {
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 4px 6px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex-shrink: 0;
      }
      .ktp-loadhead {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 10px;
        color: var(--muted);
        font-weight: 700;
      }
      .ktp-presets {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 3px;
      }
      .ktp-pbtn {
        height: 26px;
        border-radius: 7px;
        border: 1px solid var(--border-strong);
        background: rgba(11, 18, 32, 0.9);
        color: var(--text);
        font-size: 11px;
        font-weight: 800;
        font-family: ui-monospace, monospace;
        cursor: pointer;
      }
      .ktp-pbtn.on {
        background: var(--teal);
        border-color: var(--teal);
        color: #032220;
      }

      /* ረድፍ 4: ዋናው የቆጠራ መድረክ (Flex 1 — በስክሪኑ ልክ ይለጠጣል) */
      .ktp-board {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        background: rgba(11, 18, 32, 0.92);
        border: 1px solid var(--border-strong);
        border-radius: 13px;
        padding: 6px;
        gap: 6px;
        position: relative;
        overflow: hidden;
      }
      .ktp-prog {
        height: 4px;
        border-radius: 4px;
        background: rgba(51, 65, 85, 0.65);
        overflow: hidden;
        flex-shrink: 0;
      }
      .ktp-prog-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--teal), var(--emerald));
        transition: width 0.16s ease;
      }
      .ktp-kpis {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 4px;
        flex-shrink: 0;
      }
      .ktp-kpi {
        background: rgba(15, 23, 42, 0.85);
        border: 1px solid var(--border);
        border-radius: 9px;
        padding: 4px 3px;
        text-align: center;
      }
      .ktp-kpi span { display: block; font-size: 9px; color: var(--muted); font-weight: 700; }
      .ktp-kpi b { display: block; font-size: 16px; font-family: ui-monospace, monospace; font-weight: 900; line-height: 1.15; margin-top: 1px; }
      .ktp-kpi.c-teal b { color: #2dd4bf; }
      .ktp-kpi.c-em b { color: #34d399; }
      .ktp-kpi.c-amb b { color: #fbbf24; }
      .ktp-kpi.c-sky b { color: #38bdf8; }
      .ktp-kpi.c-rose b { color: #fb7185; }

      .ktp-target-ok {
        background: rgba(16, 185, 129, 0.22);
        border: 1px solid var(--emerald);
        color: #6ee7b7;
        font-size: 11px;
        font-weight: 900;
        text-align: center;
        padding: 4px;
        border-radius: 8px;
        flex-shrink: 0;
      }

      /* የመሃል መድረክ */
      .ktp-stage {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }
      .ktp-round-box {
        background: rgba(15, 23, 42, 0.72);
        border: 1px solid var(--border);
        border-radius: 11px;
        padding: 7px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .ktp-round-head {
        display: flex;
        justify-content: space-between;
        font-size: 10.5px;
        font-weight: 800;
        color: var(--muted);
        font-family: ui-monospace, monospace;
      }
      .ktp-grid10 {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 5px;
      }
      .ktp-cell {
        height: 36px;
        border-radius: 9px;
        border: 1px solid var(--border-strong);
        background: rgba(6, 10, 18, 0.65);
        color: var(--muted);
        font-family: ui-monospace, monospace;
        font-size: 12px;
        font-weight: 800;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.12s ease;
      }
      .ktp-cell.hit {
        background: rgba(20, 184, 166, 0.2);
        border-color: var(--teal);
        color: #5eead4;
      }
      .ktp-cell.last {
        border-width: 2px;
        border-color: #2dd4bf;
        box-shadow: 0 0 10px rgba(45, 212, 191, 0.35);
      }

      /* ቆጠራው ሲቆለፍ ቁጥሮቹን ሳይደብቅ በግልጽ የሚታይ ባነር */
      .ktp-lock-overlay {
        position: absolute;
        inset: 0;
        background: rgba(6, 10, 18, 0.76);
        backdrop-filter: blur(2px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        border-radius: 10px;
        z-index: 5;
      }

      .ktp-meta-foot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
        font-size: 10px;
        color: var(--muted);
        font-family: ui-monospace, monospace;
        flex-shrink: 0;
        overflow: hidden;
      }
      .ktp-speed-pill {
        padding: 1px 6px;
        border-radius: 99px;
        border: 1px solid rgba(245, 158, 11, 0.45);
        background: rgba(245, 158, 11, 0.12);
        color: #fcd34d;
        font-size: 9.5px;
        font-weight: 800;
        white-space: nowrap;
      }

      /* ረድፍ 5: ቋሚ የአውራ-ጣት መቁጠሪያ ዶክ */
      .ktp-dock {
        display: flex;
        flex-direction: column;
        gap: 5px;
        flex-shrink: 0;
      }
      .ktp-main-tap {
        height: 52px;
        border-radius: 13px;
        border: 2px solid var(--teal);
        background: linear-gradient(180deg, rgba(20, 184, 166, 0.28), rgba(13, 148, 136, 0.16));
        color: #f0fdfa;
        font-size: 17px;
        font-weight: 900;
        letter-spacing: 0.3px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }
      .ktp-main-tap:active { transform: scale(0.97); background: rgba(20, 184, 166, 0.45); }
      .ktp-main-tap.locked { opacity: 0.45; border-color: var(--amber); }

      /* መንሸራተቻ ቆጣሪ (Slide-to-Count) */
      .ktp-slider-track {
        height: 52px;
        border-radius: 14px;
        border: 2px solid var(--teal);
        background: rgba(11, 18, 32, 0.95);
        position: relative;
        overflow: hidden;
        touch-action: none;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .ktp-slider-fill {
        position: absolute;
        left: 0; top: 0; bottom: 0;
        width: 0%;
        background: rgba(20, 184, 166, 0.32);
        pointer-events: none;
      }
      .ktp-slider-thumb {
        position: absolute;
        left: 3px; top: 3px;
        width: 58px; height: 42px;
        border-radius: 10px;
        background: var(--teal);
        color: #032220;
        font-size: 17px;
        font-weight: 900;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: grab;
        box-shadow: 0 2px 10px rgba(20, 184, 166, 0.45);
      }

      /* ባለብዙ-ተሸካሚ ቁልፎች */
      .ktp-carrier-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 6px;
      }
      .ktp-carrier-btn {
        height: 54px;
        border-radius: 12px;
        border: 2px solid var(--teal);
        background: rgba(15, 23, 42, 0.92);
        color: var(--text);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2px;
        cursor: pointer;
        user-select: none;
      }
      .ktp-carrier-btn:active { transform: scale(0.96); }

      /* ተቀያያሪ ሸክም (Mixed Load Pad) */
      .ktp-mixed-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 6px;
      }
      .ktp-mixed-btn {
        height: 48px;
        border-radius: 11px;
        border: 1.5px solid var(--teal);
        background: rgba(20, 184, 166, 0.14);
        color: #5eead4;
        font-size: 16px;
        font-weight: 900;
        font-family: ui-monospace, monospace;
        cursor: pointer;
      }
      .ktp-mixed-btn:active { transform: scale(0.95); background: rgba(20, 184, 166, 0.35); }

      /* የካሜራ በር ቆጣሪ */
      .ktp-cam-wrap {
        position: relative;
        width: 100%;
        flex: 1;
        min-height: 125px;
        border-radius: 10px;
        overflow: hidden;
        background: #020617;
        border: 1px solid var(--teal);
      }
      .ktp-cam-wrap video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .ktp-cam-line {
        position: absolute;
        top: 0; bottom: 0; left: 50%;
        width: 3px;
        background: #f59e0b;
        box-shadow: 0 0 12px #f59e0b;
        pointer-events: none;
      }
      .ktp-cam-hud {
        position: absolute;
        top: 6px; left: 6px; right: 6px;
        display: flex;
        justify-content: space-between;
        pointer-events: none;
      }

      /* 4ቱ የታችኛው እርምጃ ቁልፎች */
      .ktp-actions {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1.65fr;
        gap: 5px;
      }
      .ktp-act {
        height: 38px;
        border-radius: 10px;
        border: 1px solid var(--border-strong);
        background: rgba(15, 23, 42, 0.92);
        color: var(--text);
        font-size: 11.5px;
        font-weight: 800;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        cursor: pointer;
        white-space: nowrap;
      }
      .ktp-act.primary {
        background: var(--teal);
        border-color: var(--teal);
        color: #032220;
        font-weight: 900;
      }

      /* የድምፅ ስቱዲዮ */
      .ktp-vrow {
        display: grid;
        grid-template-columns: 1fr auto auto auto;
        gap: 5px;
        align-items: center;
        padding: 5px 7px;
        border-radius: 9px;
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid var(--border);
      }
    `;
    document.head.appendChild(st);
  }

  // ---------------------------------------------------------------------------
  // 2. የቆጠራ ፕሮ ሁኔታ (State) እና የStroke ቅርጸት አዋቂ
  // ---------------------------------------------------------------------------
  let detectedStrokeFmt = null;

  function detectStrokeFormat() {
    if (detectedStrokeFmt) return detectedStrokeFmt;
    if (typeof global.sumStrokes === 'function') {
      try {
        if (global.sumStrokes([5]) === 5) return (detectedStrokeFmt = 'number');
        if (global.sumStrokes([{ qty: 5 }]) === 5) return (detectedStrokeFmt = 'qty');
        if (global.sumStrokes([{ v: 5 }]) === 5) return (detectedStrokeFmt = 'v');
        if (global.sumStrokes([{ val: 5 }]) === 5) return (detectedStrokeFmt = 'val');
        if (global.sumStrokes([{ count: 5 }]) === 5) return (detectedStrokeFmt = 'count');
      } catch {}
    }
    return (detectedStrokeFmt = 'number');
  }

  function strokeVal(s) {
    if (typeof s === 'number') return s;
    if (s && typeof s === 'object') return Number(s.qty ?? s.v ?? s.val ?? s.count ?? s.n ?? 0);
    return 0;
  }

  function sumAnyStrokes(arr) {
    return (arr || []).reduce((a, s) => a + strokeVal(s), 0);
  }

  function ensureTallyProState() {
    if (!global.state) return;
    if (!state.tally) state.tally = {};
    if (!Array.isArray(state.tally.tickets)) state.tally.tickets = [];
    if (!Array.isArray(state.tally.history)) state.tally.history = [];
    if (!state.tally.free) state.tally.free = { note: '', target: 0, strokes: [] };
    if (!state.tally.audit) state.tally.audit = { itemId: state.inventory?.[0]?.id || null, strokes: [] };

    const defaults = {
      mode: 'tap',              // tap | swipe | carriers | mixed | clicker | weight | camera
      loadSize: 10,
      locked: false,
      voiceEnabled: true,
      voiceRead: 'qty',         // qty | clicks | both | beep
      voiceLang: 'am-pack',     // am-pack | en-US | ar-SA | fr-FR | dev:<URI>
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
      camSensitivity: 30,
      camCooldownMs: 1100,
      camDir: 'LR',             // LR: ግራ->ቀኝ = +1, RL: ቀኝ->ግራ = +1
      metaLogs: {},             // key -> [{ ts, dt, qty, carrierId }]
      weightPerUnit: 1,
      itemsPerPack: 10
    };
    state.tallyPro = Object.assign(defaults, state.tallyPro || {});
    if (!state.tallyPro.metaLogs) state.tallyPro.metaLogs = {};
  }

  function isAm() {
    return (global.state?.cfg?.lang || 'am') === 'am';
  }
  function tl(amTxt, enTxt) {
    return isAm() ? amTxt : enTxt;
  }

  // ---------------------------------------------------------------------------
  // 3. ኦፍላይን የድምፅ ጥቅል ማከማቻ (IndexedDB) + አማርኛ/ዓለም አቀፍ ድምፅ ሞተር
  // ---------------------------------------------------------------------------
  let voiceDbPromise = null;
  const cachedPacks = {};
  let activeAudioQueue = [];
  let isPlayingAudio = false;
  let mediaRecorder = null;
  let recordingKey = '';
  let recChunks = [];

  function openVoiceDb() {
    if (voiceDbPromise) return voiceDbPromise;
    voiceDbPromise = new Promise((resolve, reject) => {
      try {
        const req = indexedDB.open(VOICE_DB_NAME, 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(VOICE_STORE)) {
            db.createObjectStore(VOICE_STORE, { keyPath: 'id' });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      } catch (err) { reject(err); }
    });
    return voiceDbPromise;
  }

  async function loadVoicePack(packId) {
    if (cachedPacks[packId]) return cachedPacks[packId];
    try {
      const db = await openVoiceDb();
      return await new Promise((resolve) => {
        const tx = db.transaction(VOICE_STORE, 'readonly');
        const req = tx.objectStore(VOICE_STORE).get(packId);
        req.onsuccess = () => {
          cachedPacks[packId] = req.result || { id: packId, name: packId, clips: {} };
          resolve(cachedPacks[packId]);
        };
        req.onerror = () => resolve({ id: packId, name: packId, clips: {} });
      });
    } catch {
      return { id: packId, name: packId, clips: {} };
    }
  }

  async function saveVoicePack(pack) {
    cachedPacks[pack.id] = pack;
    try {
      const db = await openVoiceDb();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(VOICE_STORE, 'readwrite');
        tx.objectStore(VOICE_STORE).put(pack);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch {}
  }

  async function listVoicePacks() {
    try {
      const db = await openVoiceDb();
      return await new Promise((resolve) => {
        const tx = db.transaction(VOICE_STORE, 'readonly');
        const req = tx.objectStore(VOICE_STORE).getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } catch { return []; }
  }

  function playNextClip() {
    if (isPlayingAudio || !activeAudioQueue.length) return;
    const src = activeAudioQueue.shift();
    isPlayingAudio = true;
    const aud = new Audio(src);
    aud.playbackRate = Number(state.tallyPro?.voiceRate || 1.05);
    const done = () => { isPlayingAudio = false; playNextClip(); };
    aud.onended = done;
    aud.onerror = done;
    aud.play().catch(done);
  }

  function queueAudioClip(dataUrl) {
    if (!dataUrl) return;
    activeAudioQueue.push(dataUrl);
    playNextClip();
  }

  function decomposeNumberClips(n, clips) {
    const out = [];
    const num = Math.max(0, Math.round(Number(n || 0)));
    if (clips[String(num)]) { out.push(clips[String(num)]); return out; }
    if (num >= 100 && clips['100']) {
      const h = Math.floor(num / 100);
      if (h > 1 && clips[String(h)]) out.push(clips[String(h)]);
      out.push(clips['100']);
      const rem = num % 100;
      if (rem > 0) out.push(...decomposeNumberClips(rem, clips));
      return out;
    }
    if (num > 10 && num < 100) {
      const tens = Math.floor(num / 10) * 10;
      const ones = num % 10;
      if (clips[String(tens)]) {
        out.push(clips[String(tens)]);
        if (ones > 0 && clips[String(ones)]) out.push(clips[String(ones)]);
        return out;
      }
    }
    // ቁጥሩ ካልተቀረጸ አሃዝ በአሃዝ ማንበብ (ለምሳሌ 2, 5)
    for (const ch of String(num)) {
      if (clips[ch]) out.push(clips[ch]);
    }
    return out;
  }

  function numToAmPhonetic(n) {
    const num = Math.max(0, Math.round(Number(n || 0)));
    if (AM_PHONETIC[num]) return AM_PHONETIC[num];
    if (num > 20 && num < 100) {
      const tens = Math.floor(num / 10) * 10;
      const ones = num % 10;
      return `${AM_PHONETIC[tens] || tens} ${AM_PHONETIC[ones] || ones}`;
    }
    if (num >= 100 && num < 1000) {
      const h = Math.floor(num / 100);
      const rem = num % 100;
      const hStr = h === 1 ? 'meto' : `${AM_PHONETIC[h] || h} meto`;
      return rem ? `${hStr} ${numToAmPhonetic(rem)}` : hStr;
    }
    return String(num);
  }

  function speakWebSpeech(text, langCode) {
    if (!('speechSynthesis' in global)) return;
    try {
      global.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text));
      u.rate = Number(state.tallyPro?.voiceRate || 1.05);
      const voices = global.speechSynthesis.getVoices() || [];
      if (langCode.startsWith('dev:')) {
        const uri = langCode.slice(4);
        const v = voices.find((x) => x.voiceURI === uri);
        if (v) { u.voice = v; u.lang = v.lang; }
      } else {
        u.lang = langCode;
        const v = voices.find((x) => (x.lang || '').toLowerCase().startsWith(langCode.slice(0, 2).toLowerCase()));
        if (v) u.voice = v;
      }
      global.speechSynthesis.speak(u);
    } catch {}
  }

  async function announceCount(totalQty, clickCount, targetReached = false) {
    const cfg = state.tallyPro;
    if (!cfg || !cfg.voiceEnabled) return;

    if (cfg.voiceRead === 'beep') {
      if (typeof global.playTone === 'function') {
        global.playTone(targetReached ? 880 : 620, targetReached ? 0.18 : 0.06, 'sine');
      }
      return;
    }

    const lang = cfg.voiceLang || 'am-pack';

    // 1. የተቀረጸ ወይም የወረደ የድምፅ ጥቅል (አማርኛ / ኦሮምኛ / ትግርኛ / ሌላ)
    if (lang.endsWith('-pack') || lang.startsWith('pack:')) {
      const packId = lang.startsWith('pack:') ? lang.slice(5) : lang;
      const pack = await loadVoicePack(packId);
      const clips = pack.clips || {};
      const hasClips = Object.keys(clips).length > 0;

      if (hasClips) {
        activeAudioQueue = [];
        isPlayingAudio = false;
        if (cfg.voiceRead === 'clicks') {
          decomposeNumberClips(clickCount, clips).forEach(queueAudioClip);
        } else if (cfg.voiceRead === 'both') {
          if (clips.load) queueAudioClip(clips.load);
          decomposeNumberClips(clickCount, clips).forEach(queueAudioClip);
          decomposeNumberClips(totalQty, clips).forEach(queueAudioClip);
        } else {
          decomposeNumberClips(totalQty, clips).forEach(queueAudioClip);
        }
        if (targetReached && clips.done) queueAudioClip(clips.done);
        return;
      }

      // ጥቅሉ ገና ካልተቀረጸ/ካልወረደ: የስልኩን አማርኛ (ካለ) ወይም የአማርኛ ድምፀት fallback ይጠቀማል
      const voices = ('speechSynthesis' in global) ? global.speechSynthesis.getVoices() : [];
      const amVoice = voices.find((v) => (v.lang || '').toLowerCase().startsWith('am'));
      if (amVoice) {
        const txt = cfg.voiceRead === 'clicks'
          ? String(clickCount)
          : (cfg.voiceRead === 'both' ? `ሸክም ${clickCount}፣ ${totalQty}` : String(totalQty));
        speakWebSpeech(targetReached ? `${txt}፣ ግቡ ሞልቷል` : txt, 'am-ET');
      } else {
        const txt = cfg.voiceRead === 'clicks'
          ? numToAmPhonetic(clickCount)
          : (cfg.voiceRead === 'both' ? `shekim ${numToAmPhonetic(clickCount)}, ${numToAmPhonetic(totalQty)}` : numToAmPhonetic(totalQty));
        speakWebSpeech(targetReached ? `${txt}, mol-twal` : txt, 'en-US');
      }
      return;
    }

    // 2. የስልኩ ዓለም አቀፍ ቋንቋዎች (እንግሊዝኛ፣ አረብኛ፣ ፈረንሳይኛ፣ ቻይንኛ...)
    let phrase = '';
    if (cfg.voiceRead === 'clicks') phrase = String(clickCount);
    else if (cfg.voiceRead === 'both') phrase = `Load ${clickCount}, total ${totalQty}`;
    else phrase = String(totalQty);
    if (targetReached) phrase += ', target reached';
    speakWebSpeech(phrase, lang);
  }

  // ---------------------------------------------------------------------------
  // 4. የቆጠራ ቅንብር ሞዳል (⚙️) እና ኦፍላይን የድምፅ ስቱዲዮ
  // ---------------------------------------------------------------------------
  function openTallyProSettings() {
    ensureTallyProState();
    const cfg = state.tallyPro;
    const voices = ('speechSynthesis' in global) ? global.speechSynthesis.getVoices() : [];
    const devOpts = voices.slice(0, 35).map((v) =>
      `<option value="dev:${esc(v.voiceURI)}" ${cfg.voiceLang === 'dev:' + v.voiceURI ? 'selected' : ''}>${esc(v.name)} (${esc(v.lang)})</option>`
    ).join('');

    openModal(`⚙️ ${tl('የቆጠራ እና የድምፅ ቅንብር', 'Tally & Voice Settings')}`, `
      <div class="sub-card">
        <label class="lbl">${esc(tl('የቆጠራ ሲስተም (Mode)', 'Counting Style / Mode'))}</label>
        <select id="ktpModeSel" class="sel">
          ${TALLY_MODES.map((m) => `<option value="${m.id}" ${cfg.mode === m.id ? 'selected' : ''}>${m.icon} ${esc(isAm() ? m.am : m.en)}</option>`).join('')}
        </select>
        <div class="grid-2" style="margin-top:6px;">
          <div>
            <label class="lbl">${esc(tl('የድጋሚ ንኪኪ መከላከያ', 'Anti-Double Tap'))}</label>
            <select id="ktpDebSel" class="sel">
              ${[0, 250, 400, 500, 700, 1000].map((ms) => `<option value="${ms}" ${Number(cfg.debounceMs) === ms ? 'selected' : ''}>${ms === 0 ? tl('ጠፍቷል', 'Off') : (ms / 1000) + 's'}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="lbl">${esc(tl('የተሸካሚዎች ብዛት', 'Carriers Count'))}</label>
            <select id="ktpCarCnt" class="sel">
              ${[2, 3, 4].map((n) => `<option value="${n}" ${Number(cfg.carrierCount) === n ? 'selected' : ''}>${n} ${tl('ጫኞች', 'Carriers')}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>

      <div class="sub-card">
        <div class="switch-row">
          <b>🔊 ${esc(tl('የድምፅ ንባብ', 'Voice Readout'))}</b>
          <div id="ktpVoiceTog" class="toggle ${cfg.voiceEnabled ? 'on' : ''}" onclick="this.classList.toggle('on')"></div>
        </div>
        <div class="grid-2" style="margin-top:6px;">
          <div>
            <label class="lbl">${esc(tl('ምን ይናገር?', 'Readout Target'))}</label>
            <select id="ktpVoiceRead" class="sel">
              <option value="qty" ${cfg.voiceRead === 'qty' ? 'selected' : ''}>${esc(tl('የተጫነ ብዛት (5, 10, 15...)', 'Total Qty (5, 10, 15...)'))}</option>
              <option value="clicks" ${cfg.voiceRead === 'clicks' ? 'selected' : ''}>${esc(tl('የክሊክ / ሸክም ቁጥር (1, 2, 3...)', 'Click / Load # (1, 2, 3...)'))}</option>
              <option value="both" ${cfg.voiceRead === 'both' ? 'selected' : ''}>${esc(tl('ሁለቱንም (ሸክም 2 — 10)', 'Both (Load 2 — 10)'))}</option>
              <option value="beep" ${cfg.voiceRead === 'beep' ? 'selected' : ''}>${esc(tl('ቢፕ ድምፅ ብቻ', 'Beep Tone Only'))}</option>
            </select>
          </div>
          <div>
            <label class="lbl">${esc(tl('የድምፅ ቋንቋ', 'Voice Language'))}</label>
            <select id="ktpVoiceLang" class="sel">
              <option value="am-pack" ${cfg.voiceLang === 'am-pack' ? 'selected' : ''}>🇪🇹 ${esc(tl('አማርኛ (ጥቅል / ድምፅ)', 'Amharic (Pack / Voice)'))}</option>
              <option value="en-US" ${cfg.voiceLang === 'en-US' ? 'selected' : ''}>🇬🇧 English (US/UK)</option>
              <option value="ar-SA" ${cfg.voiceLang === 'ar-SA' ? 'selected' : ''}>🇸🇦 العربية (Arabic)</option>
              <option value="om-pack" ${cfg.voiceLang === 'om-pack' ? 'selected' : ''}>🇪🇹 Afaan Oromo (Pack)</option>
              <option value="ti-pack" ${cfg.voiceLang === 'ti-pack' ? 'selected' : ''}>🇪🇹 ትግርኛ (Pack)</option>
              ${devOpts}
            </select>
          </div>
        </div>
        <div class="grid-2" style="margin-top:6px;">
          <button type="button" class="btn muted sm" onclick="KoraTallyPro.testVoice()">▶️ ${esc(tl('ድምፅ ሞክር', 'Test Voice'))}</button>
          <button type="button" class="btn teal sm" onclick="KoraTallyPro.openVoiceStudio()">🎙️ ${esc(tl('ቋንቋ ቅረጽ / አውርድ', 'Voice Studio / Download'))}</button>
        </div>
      </div>

      <div class="sub-card">
        <div class="switch-row">
          <span>⏱ ${esc(tl('የመጨረሻ ንኪኪ ሰዓት ቆጣሪ', 'Last Tap Timer'))}</span>
          <div id="ktpTimerTog" class="toggle ${cfg.showTimer ? 'on' : ''}" onclick="this.classList.toggle('on')"></div>
        </div>
        <div class="switch-row">
          <span>🔒 ${esc(tl('በስልክ ጥሪ ጊዜ ራስ-ሰር መቆለፊያ', 'Auto-Lock on Call/Switch'))}</span>
          <div id="ktpCallTog" class="toggle ${cfg.autoLockCall ? 'on' : ''}" onclick="this.classList.toggle('on')"></div>
        </div>
        <div class="switch-row">
          <span>📳 ${esc(tl('ጠንካራ ንዝረት', 'Strong Haptic'))}</span>
          <div id="ktpHapTog" class="toggle ${cfg.haptic ? 'on' : ''}" onclick="this.classList.toggle('on')"></div>
        </div>
      </div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${esc(tl('ተው', 'Cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraTallyPro.saveSettingsModal()">${esc(tl('አስቀምጥ', 'Save'))}</button>`);
  }

  function saveSettingsModal() {
    const cfg = state.tallyPro;
    const prevMode = cfg.mode;
    cfg.mode = document.getElementById('ktpModeSel')?.value || 'tap';
    cfg.debounceMs = Number(document.getElementById('ktpDebSel')?.value || 500);
    cfg.carrierCount = Number(document.getElementById('ktpCarCnt')?.value || 2);
    cfg.voiceEnabled = document.getElementById('ktpVoiceTog')?.classList.contains('on') || false;
    cfg.voiceRead = document.getElementById('ktpVoiceRead')?.value || 'qty';
    cfg.voiceLang = document.getElementById('ktpVoiceLang')?.value || 'am-pack';
    cfg.showTimer = document.getElementById('ktpTimerTog')?.classList.contains('on') || false;
    cfg.autoLockCall = document.getElementById('ktpCallTog')?.classList.contains('on') || false;
    cfg.haptic = document.getElementById('ktpHapTog')?.classList.contains('on') || false;
    if (prevMode === 'camera' && cfg.mode !== 'camera') {
      if (global.KoraTallyPro?.stopCamera) global.KoraTallyPro.stopCamera();
    }
    saveState();
    closeModal();
    renderView();
    showToast(tl('ተቀምጧል', 'Saved'));
  }

  async function openVoiceStudio(packId = null) {
    ensureTallyProState();
    const curLang = state.tallyPro.voiceLang || 'am-pack';
    const targetPackId = packId || (curLang.endsWith('-pack') ? curLang : 'am-pack');
    const pack = await loadVoicePack(targetPackId);
    const clips = pack.clips || {};
    const doneCnt = Object.keys(clips).length;

    openModal(`🎙️ ${tl('የድምፅ ጥቅል ስቱዲዮ (ኦፍላይን)', 'Offline Voice Pack Studio')}`, `
      <div class="sub-card">
        <div class="card-row">
          <select id="ktpStudioPackSel" class="sel" style="height:30px;flex:1;" onchange="KoraTallyPro.openVoiceStudio(this.value)">
            <option value="am-pack" ${targetPackId === 'am-pack' ? 'selected' : ''}>🇪🇹 አማርኛ (am-pack)</option>
            <option value="om-pack" ${targetPackId === 'om-pack' ? 'selected' : ''}>🇪🇹 Afaan Oromo (om-pack)</option>
            <option value="ti-pack" ${targetPackId === 'ti-pack' ? 'selected' : ''}>🇪🇹 ትግርኛ (ti-pack)</option>
            <option value="custom-pack" ${targetPackId === 'custom-pack' ? 'selected' : ''}>🌍 ሌላ ቋንቋ (custom-pack)</option>
          </select>
          <span class="pill teal">${doneCnt}/${VOICE_KEYS.length}</span>
        </div>
        <div class="grid-2" style="margin-top:6px;">
          <button type="button" class="btn muted sm" onclick="KoraTallyPro.exportVoicePack('${esc(targetPackId)}')">⬇️ ${esc(tl('ጥቅሉን ላክ (JSON)', 'Export Pack'))}</button>
          <label class="btn teal sm" style="text-align:center;">⬆️ ${esc(tl('ጥቅል ጫን (Import)', 'Load Pack'))}<input type="file" accept=".json" style="display:none;" onchange="KoraTallyPro.importVoicePack(this,'${esc(targetPackId)}')"></label>
        </div>
        <div style="display:flex;gap:4px;margin-top:6px;">
          <input id="ktpPackUrl" class="inp sm" placeholder="${esc(tl('የድምፅ ጥቅል ሊንክ (URL) ካለ...', 'Voice pack JSON URL...'))}">
          <button type="button" class="btn muted sm" onclick="KoraTallyPro.downloadVoicePackUrl('${esc(targetPackId)}')">🌐 ${esc(tl('አውርድ', 'Download'))}</button>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:4px;max-height:270px;overflow-y:auto;">
        ${VOICE_KEYS.map((vk) => {
          const has = Boolean(clips[vk.k]);
          const isRec = recordingKey === vk.k;
          return `
            <div class="ktp-vrow">
              <b style="font-size:11.5px;color:${has ? '#5eead4' : 'var(--text)'};">${has ? '✓ ' : ''}${esc(vk.am)}</b>
              <button type="button" class="btn sm ${isRec ? 'danger' : 'teal'}" onclick="KoraTallyPro.toggleRecKey('${esc(targetPackId)}','${vk.k}')">${isRec ? '⏹️' : '🎙️'}</button>
              <button type="button" class="btn sm muted" ${has ? '' : 'disabled'} onclick="KoraTallyPro.playKeyClip('${esc(targetPackId)}','${vk.k}')">▶️</button>
              <button type="button" class="btn sm ghost" ${has ? '' : 'disabled'} style="color:var(--rose);" onclick="KoraTallyPro.delKeyClip('${esc(targetPackId)}','${vk.k}')">✕</button>
            </div>`;
        }).join('')}
      </div>`, `
      <button type="button" class="btn teal" onclick="closeModal();KoraTallyPro.openSettings()">${esc(tl('ጨርስ', 'Done'))}</button>`);
  }

  async function toggleRecKey(packId, key) {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      showToast(tl('ማይክሮፎን አልተገኘም', 'Microphone unavailable'), true);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recChunks = [];
      recordingKey = key;
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recChunks.push(e.data); };
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((tr) => tr.stop());
        const blob = new Blob(recChunks, { type: mediaRecorder.mimeType || 'audio/webm' });
        const reader = new FileReader();
        reader.onload = async () => {
          const pack = await loadVoicePack(packId);
          pack.clips = pack.clips || {};
          pack.clips[key] = reader.result;
          await saveVoicePack(pack);
          recordingKey = '';
          openVoiceStudio(packId);
          showToast(tl('ድምፁ ተቀምጧል', 'Clip saved'));
        };
        reader.readAsDataURL(blob);
      };
      mediaRecorder.start();
      openVoiceStudio(packId);
      // ከ2.2 ሰከንድ በኋላ በራሱ እንዲቆም (ፈጣን ቀረጻ)
      setTimeout(() => {
        if (mediaRecorder && mediaRecorder.state === 'recording' && recordingKey === key) {
          mediaRecorder.stop();
        }
      }, 2200);
    } catch {
      recordingKey = '';
      showToast(tl('የማይክሮፎን ፍቃድ ያስፈልጋል', 'Mic permission denied'), true);
    }
  }

  async function playKeyClip(packId, key) {
    const pack = await loadVoicePack(packId);
    if (pack.clips?.[key]) queueAudioClip(pack.clips[key]);
  }

  async function delKeyClip(packId, key) {
    const pack = await loadVoicePack(packId);
    if (pack.clips) delete pack.clips[key];
    await saveVoicePack(pack);
    openVoiceStudio(packId);
  }

  async function exportVoicePack(packId) {
    const pack = await loadVoicePack(packId);
    const blob = new Blob([JSON.stringify(pack)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kora-voice-${packId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(tl('የድምፅ ጥቅሉ ወርዷል', 'Voice pack exported'));
  }

  function importVoicePack(inp, packId) {
    const file = inp.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = async () => {
      try {
        const parsed = JSON.parse(String(r.result || '{}'));
        if (!parsed || typeof parsed.clips !== 'object') throw new Error();
        parsed.id = packId;
        await saveVoicePack(parsed);
        state.tallyPro.voiceLang = packId;
        saveState();
        openVoiceStudio(packId);
        showToast(tl('የድምፅ ጥቅሉ ተጭኗል', 'Voice pack installed'));
      } catch {
        showToast(tl('ትክክለኛ የድምፅ ፋይል አይደለም', 'Invalid voice pack file'), true);
      }
    };
    r.readAsText(file);
  }

  async function downloadVoicePackUrl(packId) {
    const url = (document.getElementById('ktpPackUrl')?.value || '').trim();
    if (!url) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const parsed = await res.json();
      if (!parsed || typeof parsed.clips !== 'object') throw new Error();
      parsed.id = packId;
      await saveVoicePack(parsed);
      state.tallyPro.voiceLang = packId;
      saveState();
      openVoiceStudio(packId);
      showToast(tl('ከኢንተርኔት ወርዶ ተቀምጧል', 'Downloaded & saved offline'));
    } catch {
      showToast(tl('ሊንኩን ማውረድ አልተቻለም', 'Download failed'), true);
    }
  }

  // መጋራት ለክፍል 2
  global._KTP_INTERNAL = {
    TALLY_MODES,
    injectTallyProStyles,
    detectStrokeFormat,
    strokeVal,
    sumAnyStrokes,
    ensureTallyProState,
    isAm,
    tl,
    announceCount,
    openTallyProSettings,
    saveSettingsModal,
    openVoiceStudio,
    toggleRecKey,
    playKeyClip,
    delKeyClip,
    exportVoicePack,
    importVoicePack,
    downloadVoicePackUrl
  };

// === የkora-tally-pro.js ክፍል 1 መጨረሻ (ክፍል 2 ከዚህ ቀጥሎ ይገባል) ===
  // ===========================================================================
  // ኮራ ስቶክ — kora-tally-pro.js (ክፍል 2 ከ 2)
  // ===========================================================================
  let lastTapTs = 0;
  let camStream = null;
  let camRafId = null;
  let camCanvas = null;
  let camCtx = null;
  let camPrevLeft = null;
  let camPrevRight = null;
  let camLastTrigTs = 0;
  let camLastZone = null;
  let camLastZoneTs = 0;
  let timerIntervalId = null;
  let hooksInstalled = false;

  const PRESETS = [1, 2, 3, 5, 10, 15, 20];

  function makeStrokeObj(qty, carrierId) {
    const fmt = detectStrokeFormat();
    const n = Number(qty || 0);
    if (fmt === 'number') return n;
    const obj = { ts: Date.now() };
    obj[fmt] = n;
    if (carrierId) obj.carrierId = carrierId;
    return obj;
  }

  function getSubTab() {
    ensureTallyProState();
    if (!state.tallyPro.subTab) {
      const s = String(state.sub || '').toLowerCase();
      if (['tickets', 'free', 'audit', 'history'].includes(s)) state.tallyPro.subTab = s;
      else state.tallyPro.subTab = 'tickets';
    }
    return state.tallyPro.subTab;
  }

  function setSubTab(sub) {
    ensureTallyProState();
    state.tallyPro.subTab = sub;
    if (typeof state.sub !== 'undefined') state.sub = sub;
    if (sub === 'history') stopCamera();
    saveState();
    renderTallyPro();
  }

  function ensureActiveTicket() {
    ensureTallyProState();
    const list = state.tally.tickets;
    if (!list.length) {
      const id = 'TK-' + String(Date.now()).slice(-4);
      list.push({
        id,
        code: 'WH1-01',
        dir: 'out',
        party: '',
        pad: '',
        items: [],
        activeItemIdx: 0,
        createdAt: new Date().toISOString()
      });
      state.tally.activeTicketId = id;
    }
    let tk = list.find((t) => t.id === state.tally.activeTicketId) || list[0];
    state.tally.activeTicketId = tk.id;
    if (!Array.isArray(tk.items)) tk.items = [];
    if (typeof tk.activeItemIdx !== 'number' || tk.activeItemIdx >= tk.items.length) {
      tk.activeItemIdx = Math.max(0, tk.items.length - 1);
    }
    return tk;
  }

  function getActiveContext() {
    ensureTallyProState();
    const sub = getSubTab();
    if (sub === 'tickets') {
      const tk = ensureActiveTicket();
      const it = tk.items[tk.activeItemIdx] || null;
      return {
        sub,
        key: it ? `tk:${tk.id}:${tk.activeItemIdx}` : `tk:${tk.id}:none`,
        ticket: tk,
        item: it,
        strokes: it ? (it.strokes = it.strokes || []) : [],
        target: it ? Number(it.target || 0) : 0,
        systemQty: 0,
        ready: Boolean(it)
      };
    }
    if (sub === 'free') {
      const f = state.tally.free;
      f.strokes = f.strokes || [];
      return {
        sub,
        key: 'free:main',
        free: f,
        strokes: f.strokes,
        target: Number(f.target || 0),
        systemQty: 0,
        ready: true
      };
    }
    if (sub === 'audit') {
      const a = state.tally.audit;
      a.strokes = a.strokes || [];
      const inv = (state.inventory || []).find((x) => x.id === a.itemId) || (state.inventory || [])[0] || null;
      if (inv && !a.itemId) a.itemId = inv.id;
      const sysQty = inv ? Number(inv.stock ?? inv.qty ?? inv.quantity ?? 0) : 0;
      return {
        sub,
        key: `audit:${inv ? inv.id : 'none'}`,
        audit: a,
        inv,
        strokes: a.strokes,
        target: 0,
        systemQty: sysQty,
        ready: Boolean(inv)
      };
    }
    return { sub: 'history', key: 'history', strokes: [], target: 0, systemQty: 0, ready: false };
  }

  function getMetaLog(key) {
    ensureTallyProState();
    if (!Array.isArray(state.tallyPro.metaLogs[key])) state.tallyPro.metaLogs[key] = [];
    return state.tallyPro.metaLogs[key];
  }

  function formatAgo(ts) {
    if (!ts) return tl('ገና አልተጀመረም', 'Not started yet');
    const sec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
    if (sec < 60) return tl(`ከ${sec}ሰ በፊት`, `${sec}s ago`);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return tl(`ከ${m}ደ ${s}ሰ በፊት`, `${m}m ${s}s ago`);
  }

  // ---------------------------------------------------------------------------
  // 5. የቆጠራ ዋና ተግባራት (+ ቁጠር፣ መልስ፣ ጎዶሎ፣ አጽዳ፣ መዝግብ)
  // ---------------------------------------------------------------------------
  function recordCount(qtyOverride = null, carrierId = null, bypassDebounce = false) {
    ensureTallyProState();
    const cfg = state.tallyPro;
    const ctx = getActiveContext();
    if (!ctx.ready) {
      showToast(tl('መጀመሪያ «+ ዕቃ ጨምር» ይጫኑ', 'Add an item first'), true);
      return false;
    }
    if (cfg.locked) {
      showToast(tl('ቆጠራው ተቆልፏል — መጀመሪያ ይክፈቱት', 'Tally is locked'), true);
      return false;
    }
    const now = Date.now();
    if (!bypassDebounce && cfg.debounceMs > 0 && now - lastTapTs < cfg.debounceMs) {
      return false;
    }

    const qty = Number(qtyOverride !== null ? qtyOverride : cfg.loadSize || 1);
    if (!(qty > 0)) return false;

    const meta = getMetaLog(ctx.key);
    const prevTs = meta.length ? meta[meta.length - 1].ts : 0;
    const dt = prevTs ? Number(((now - prevTs) / 1000).toFixed(1)) : 0;

    ctx.strokes.push(makeStrokeObj(qty, carrierId));
    meta.push({ ts: now, dt, qty, carrierId: carrierId || null });
    lastTapTs = now;

    const total = sumAnyStrokes(ctx.strokes);
    const clicks = ctx.strokes.length;
    const reached = ctx.target > 0 && total >= ctx.target;

    if (cfg.haptic && navigator.vibrate) {
      navigator.vibrate(reached ? [80, 50, 120] : 28);
    }
    announceCount(total, clicks, reached);
    saveState();

    // ካሜራ እየሠራ ከሆነ ቪዲዮው እንዳይቋረጥ ቁጥሮቹን ብቻ በቀጥታ ማደስ
    if (cfg.mode === 'camera' && camStream) {
      updateLiveBoardOnly();
    } else {
      renderTallyPro();
    }
    return true;
  }

  function undoCount() {
    const ctx = getActiveContext();
    if (!ctx.ready || !ctx.strokes.length) return;
    if (state.tallyPro.locked) {
      showToast(tl('መጀመሪያ ቆጠራውን ይክፈቱ', 'Unlock tally first'), true);
      return;
    }
    ctx.strokes.pop();
    const meta = getMetaLog(ctx.key);
    if (meta.length) meta.pop();
    if (state.tallyPro.haptic && navigator.vibrate) navigator.vibrate(15);
    saveState();
    if (state.tallyPro.mode === 'camera' && camStream) updateLiveBoardOnly();
    else renderTallyPro();
  }

  function openPartialModal() {
    const ctx = getActiveContext();
    if (!ctx.ready) {
      showToast(tl('መጀመሪያ ዕቃ ይምረጡ', 'Select an item first'), true);
      return;
    }
    openModal(`➕ ${tl('ጎዶሎ / የተለየ ብዛት ጨምር', 'Add Partial / Custom Qty')}`, `
      <div class="sub-card">
        <label class="lbl">${esc(tl('የተቆጠረው ጎዶሎ ብዛት', 'Partial quantity to add'))}</label>
        <input id="ktpPartialInp" type="number" min="1" step="any" class="inp" placeholder="ለምሳሌ 4" autofocus>
      </div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${esc(tl('ተው', 'Cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraTallyPro.confirmPartial()">${esc(tl('ጨምር', 'Add'))}</button>`);
  }

  function confirmPartial() {
    const val = Number(document.getElementById('ktpPartialInp')?.value || 0);
    if (!(val > 0)) return;
    closeModal();
    recordCount(val, null, true);
  }

  function clearCounts() {
    const ctx = getActiveContext();
    if (!ctx.ready || !ctx.strokes.length) return;
    openModal(`🧹 ${tl('ቆጠራውን አጽዳ?', 'Clear Counts?')}`, `
      <p style="font-size:12.5px;color:var(--muted);line-height:1.5;">
        ${esc(tl('እስካሁን የተቆጠረው ሙሉ በሙሉ ወደ 0 ይመለሳል። እርግጠኛ ነህ?', 'All current counts will reset to 0. Are you sure?'))}
      </p>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${esc(tl('ተው', 'Cancel'))}</button>
      <button type="button" class="btn danger" onclick="KoraTallyPro.confirmClear()">${esc(tl('አጽዳ', 'Clear'))}</button>`);
  }

  function confirmClear() {
    const ctx = getActiveContext();
    if (ctx.ready) {
      ctx.strokes.length = 0;
      state.tallyPro.metaLogs[ctx.key] = [];
      saveState();
    }
    closeModal();
    if (state.tallyPro.mode === 'camera' && camStream) updateLiveBoardOnly();
    else renderTallyPro();
  }

  function setLoadSize(n) {
    ensureTallyProState();
    if (n === 'other') {
      openModal(`⚙️ ${tl('የአንድ ሸክም መጠን', 'Custom Load Size')}`, `
        <div class="sub-card">
          <label class="lbl">${esc(tl('በአንድ ሸክም ስንት ፍሬ?', 'Units per single load'))}</label>
          <input id="ktpCustomLoad" type="number" min="1" class="inp" value="${Number(state.tallyPro.loadSize || 10)}">
        </div>`, `
        <button type="button" class="btn muted" onclick="closeModal()">${esc(tl('ተው', 'Cancel'))}</button>
        <button type="button" class="btn teal" onclick="KoraTallyPro.confirmCustomLoad()">${esc(tl('አስቀምጥ', 'Set'))}</button>`);
      return;
    }
    state.tallyPro.loadSize = Math.max(1, Number(n || 1));
    saveState();
    renderTallyPro();
  }

  function confirmCustomLoad() {
    const v = Math.max(1, Number(document.getElementById('ktpCustomLoad')?.value || 1));
    state.tallyPro.loadSize = v;
    saveState();
    closeModal();
    renderTallyPro();
  }

  function toggleLock() {
    ensureTallyProState();
    state.tallyPro.locked = !state.tallyPro.locked;
    if (state.tallyPro.locked) stopCamera();
    saveState();
    renderTallyPro();
  }

  // ---------------------------------------------------------------------------
  // 6. የቲኬት፣ የዕቃ፣ የነጻ ቆጠራ እና የኦዲት አስተዳደር
  // ---------------------------------------------------------------------------
  function selectTicket(id) {
    state.tally.activeTicketId = id;
    saveState();
    renderTallyPro();
  }

  function addTicket() {
    const num = state.tally.tickets.length + 1;
    const id = 'TK-' + String(Date.now()).slice(-4);
    state.tally.tickets.push({
      id,
      code: `WH1-0${num}`,
      dir: 'out',
      party: '',
      pad: '',
      items: [],
      activeItemIdx: 0,
      createdAt: new Date().toISOString()
    });
    state.tally.activeTicketId = id;
    saveState();
    renderTallyPro();
  }

  function removeActiveTicket() {
    const tk = ensureActiveTicket();
    if (state.tally.tickets.length <= 1) {
      tk.items = [];
      tk.party = '';
      tk.pad = '';
    } else {
      state.tally.tickets = state.tally.tickets.filter((t) => t.id !== tk.id);
      state.tally.activeTicketId = state.tally.tickets[0]?.id || null;
    }
    saveState();
    renderTallyPro();
  }

  function toggleTicketDir() {
    const tk = ensureActiveTicket();
    tk.dir = (tk.dir === 'in') ? 'out' : 'in';
    saveState();
    renderTallyPro();
  }

  function updateTicketField(field, val) {
    const tk = ensureActiveTicket();
    tk[field] = val;
    saveState();
  }

  function selectTicketItem(idx) {
    const tk = ensureActiveTicket();
    tk.activeItemIdx = idx;
    saveState();
    renderTallyPro();
  }

  function openAddTicketItemModal() {
    const invOpts = (state.inventory || []).map((it) =>
      `<option value="${esc(it.id)}">${esc(it.name)} (${Number(it.stock ?? it.qty ?? 0)})</option>`
    ).join('');
    openModal(`➕ ${tl('ወደ ቲኬቱ ዕቃ ጨምር', 'Add Item to Ticket')}`, `
      <div class="sub-card">
        <label class="lbl">${esc(tl('ዕቃ ይምረጡ', 'Select Product'))}</label>
        <select id="ktpAddInvSel" class="sel">${invOpts}</select>
        <label class="lbl" style="margin-top:6px;">${esc(tl('የሚጫን / የሚወርድ ግብ (አማራጭ)', 'Target Qty (optional)'))}</label>
        <input id="ktpAddTarget" type="number" min="0" class="inp" placeholder="ለምሳሌ 50 (0 = ገደብ የለም)">
      </div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${esc(tl('ተው', 'Cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraTallyPro.confirmAddTicketItem()">${esc(tl('ጨምር', 'Add'))}</button>`);
  }

  function confirmAddTicketItem() {
    const invId = document.getElementById('ktpAddInvSel')?.value;
    const target = Math.max(0, Number(document.getElementById('ktpAddTarget')?.value || 0));
    const inv = (state.inventory || []).find((x) => x.id === invId);
    if (!inv) return;
    const tk = ensureActiveTicket();
    tk.items.push({
      itemId: inv.id,
      name: inv.name,
      unit: inv.unit || '',
      target,
      strokes: []
    });
    tk.activeItemIdx = tk.items.length - 1;
    saveState();
    closeModal();
    renderTallyPro();
  }

  function commitPrimaryAction() {
    const ctx = getActiveContext();
    if (!ctx.ready) {
      showToast(tl('የሚመዘገብ ቆጠራ የለም', 'Nothing to submit'), true);
      return;
    }
    const nowStr = new Date().toLocaleString();

    if (ctx.sub === 'tickets') {
      const tk = ctx.ticket;
      const nonZero = tk.items.filter((it) => sumAnyStrokes(it.strokes) > 0);
      if (!nonZero.length) {
        showToast(tl('መጀመሪያ ቆጠራ ያድርጉ', 'Count at least one load first'), true);
        return;
      }
      const isIn = tk.dir === 'in';
      const summaryLines = [];
      nonZero.forEach((it) => {
        const qty = sumAnyStrokes(it.strokes);
        summaryLines.push(`${it.name}: ${qty}`);
        const inv = (state.inventory || []).find((x) => x.id === it.itemId);
        if (inv) {
          if (typeof inv.stock === 'number') inv.stock = Math.max(0, inv.stock + (isIn ? qty : -qty));
          else if (typeof inv.qty === 'number') inv.qty = Math.max(0, inv.qty + (isIn ? qty : -qty));
        }
      });
      state.tally.history.unshift({
        id: 'H-' + Date.now(),
        type: isIn ? 'in' : 'out',
        ref: tk.code || tk.id,
        party: tk.party || tl('ያልተገለጸ', 'Walk-in'),
        itemsSummary: summaryLines.join(' · '),
        total: nonZero.reduce((a, x) => a + sumAnyStrokes(x.strokes), 0),
        loads: nonZero.reduce((a, x) => a + (x.strokes?.length || 0), 0),
        date: nowStr
      });
      // ቲኬቱን አጽድቶ ለቀጣይ ማዘጋጀት
      tk.items = [];
      tk.activeItemIdx = 0;
      saveState();
      renderTallyPro();
      showToast(tl('ቆጠራው በስቶክ ላይ ተመዝግቧል!', 'Ticket committed to stock!'));
      return;
    }

    if (ctx.sub === 'free') {
      const total = sumAnyStrokes(ctx.strokes);
      if (!(total > 0)) {
        showToast(tl('የተቆጠረ ቁጥር የለም', 'No counts yet'), true);
        return;
      }
      state.tally.history.unshift({
        id: 'H-' + Date.now(),
        type: 'free',
        ref: tl('ነጻ ቆጠራ', 'Free Tally'),
        party: ctx.free.note || tl('ማስታወሻ የለም', 'No note'),
        itemsSummary: `${total} (${ctx.strokes.length} ${tl('ሸክም', 'loads')})`,
        total,
        loads: ctx.strokes.length,
        date: nowStr
      });
      ctx.free.strokes = [];
      state.tallyPro.metaLogs[ctx.key] = [];
      saveState();
      renderTallyPro();
      showToast(tl('ወደ ታሪክ/መመዝገቢያ ተቀምጧል!', 'Saved to tally history!'));
      return;
    }

    if (ctx.sub === 'audit') {
      const total = sumAnyStrokes(ctx.strokes);
      const inv = ctx.inv;
      if (!inv) return;
      const diff = total - ctx.systemQty;
      if (typeof inv.stock === 'number') inv.stock = total;
      else if (typeof inv.qty === 'number') inv.qty = total;
      state.tally.history.unshift({
        id: 'H-' + Date.now(),
        type: 'audit',
        ref: tl('ስቶክ ኦዲት', 'Stock Audit'),
        party: inv.name,
        itemsSummary: `${tl('ሲስተም', 'Sys')}: ${ctx.systemQty} ➔ ${tl('አዲስ', 'New')}: ${total} (${diff >= 0 ? '+' : ''}${diff})`,
        total,
        loads: ctx.strokes.length,
        date: nowStr
      });
      ctx.audit.strokes = [];
      state.tallyPro.metaLogs[ctx.key] = [];
      saveState();
      renderTallyPro();
      showToast(tl('የስቶክ ማስተካከያ ተልኳል!', 'Stock audit applied!'));
    }
  }

  // ---------------------------------------------------------------------------
  // 7. የካሜራ በር መሻገሪያ ቆጣሪ (Virtual Tripwire)
  // ---------------------------------------------------------------------------
  async function startCamera() {
    if (camStream) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      showToast(tl('ካሜራ በዚህ ስልክ ላይ አይሠራም', 'Camera not supported'), true);
      return;
    }
    try {
      camStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 640 }, height: { ideal: 360 } },
        audio: false
      });
      const vid = document.getElementById('ktpCamVideo');
      if (vid) {
        vid.srcObject = camStream;
        await vid.play().catch(() => {});
      }
      camCanvas = document.createElement('canvas');
      camCanvas.width = 64;
      camCanvas.height = 48;
      camCtx = camCanvas.getContext('2d', { willReadFrequently: true });
      camPrevLeft = null;
      camPrevRight = null;
      camLastZone = null;
      const stEl = document.getElementById('ktpCamStatus');
      if (stEl) stEl.textContent = tl('🟢 በመቁጠር ላይ', '🟢 Live');
      runCameraLoop();
    } catch {
      showToast(tl('የካሜራ ፍቃድ ያስፈልጋል', 'Camera permission denied'), true);
    }
  }

  function stopCamera() {
    if (camRafId) { cancelAnimationFrame(camRafId); camRafId = null; }
    if (camStream) {
      camStream.getTracks().forEach((tr) => tr.stop());
      camStream = null;
    }
    camPrevLeft = null;
    camPrevRight = null;
    const stEl = document.getElementById('ktpCamStatus');
    if (stEl) stEl.textContent = tl('⏸️ ቆሟል', '⏸️ Stopped');
  }

  function toggleCamera() {
    if (camStream) { stopCamera(); renderTallyPro(); }
    else startCamera();
  }

  function toggleCameraDir() {
    state.tallyPro.camDir = state.tallyPro.camDir === 'LR' ? 'RL' : 'LR';
    saveState();
    const btn = document.getElementById('ktpCamDirBtn');
    if (btn) btn.textContent = state.tallyPro.camDir === 'LR' ? '➡️ ግራ➔ቀኝ (+)' : '⬅️ ቀኝ➔ግራ (+)';
  }

  function runCameraLoop() {
    if (!camStream) return;
    const vid = document.getElementById('ktpCamVideo');
    if (vid && vid.readyState >= 2 && camCtx) {
      camCtx.drawImage(vid, 0, 0, 64, 48);
      const data = camCtx.getImageData(0, 0, 64, 48).data;
      // መሃሉን መስመር (x=32) ተከትሎ ግራ ዞን (x: 16..28) እና ቀኝ ዞን (x: 36..48)
      const leftBuf = [];
      const rightBuf = [];
      for (let y = 8; y < 40; y += 2) {
        for (let x = 16; x < 28; x += 2) {
          const i = (y * 64 + x) * 4;
          leftBuf.push((data[i] + data[i + 1] + data[i + 2]) / 3);
        }
        for (let x = 36; x < 48; x += 2) {
          const i = (y * 64 + x) * 4;
          rightBuf.push((data[i] + data[i + 1] + data[i + 2]) / 3);
        }
      }
      if (camPrevLeft && camPrevRight) {
        let diffL = 0, diffR = 0;
        for (let i = 0; i < leftBuf.length; i++) {
          diffL += Math.abs(leftBuf[i] - camPrevLeft[i]);
          diffR += Math.abs(rightBuf[i] - camPrevRight[i]);
        }
        diffL /= leftBuf.length;
        diffR /= rightBuf.length;

        const thresh = Number(state.tallyPro.camSensitivity || 26);
        const now = Date.now();
        const cool = Number(state.tallyPro.camCooldownMs || 1100);

        if (diffL > thresh && diffL > diffR * 1.15) {
          if (camLastZone === 'R' && now - camLastZoneTs < 1200 && now - camLastTrigTs > cool) {
            camLastTrigTs = now;
            camLastZone = null;
            if (state.tallyPro.camDir === 'RL') recordCount(null, null, true);
          } else {
            camLastZone = 'L';
            camLastZoneTs = now;
          }
        } else if (diffR > thresh && diffR > diffL * 1.15) {
          if (camLastZone === 'L' && now - camLastZoneTs < 1200 && now - camLastTrigTs > cool) {
            camLastTrigTs = now;
            camLastZone = null;
            if (state.tallyPro.camDir === 'LR') recordCount(null, null, true);
          } else {
            camLastZone = 'R';
            camLastZoneTs = now;
          }
        }
      }
      camPrevLeft = leftBuf;
      camPrevRight = rightBuf;
    }
    camRafId = requestAnimationFrame(() => setTimeout(runCameraLoop, 110));
  }

  // ---------------------------------------------------------------------------
  // 8. የክብደት/ጥቅል ቀያሪ እና የመንሸራተቻ ቆጣሪ (Slide-to-Count)
  // ---------------------------------------------------------------------------
  function applyWeightCalc() {
    const mode = document.getElementById('ktpWMode')?.value || 'weight';
    const a = Number(document.getElementById('ktpWValA')?.value || 0);
    const b = Number(document.getElementById('ktpWValB')?.value || 1);
    if (!(a > 0) || !(b > 0)) return;
    const qty = mode === 'weight' ? Math.round(a / b) : Math.round(a * b);
    if (qty > 0) {
      recordCount(qty, null, true);
      showToast(`+${qty} ${tl('ተጨምሯል', 'added')}`);
    }
  }

  function updateWeightPreview() {
    const mode = document.getElementById('ktpWMode')?.value || 'weight';
    const a = Number(document.getElementById('ktpWValA')?.value || 0);
    const b = Number(document.getElementById('ktpWValB')?.value || 1);
    const qty = (a > 0 && b > 0) ? (mode === 'weight' ? Math.round(a / b) : Math.round(a * b)) : 0;
    const out = document.getElementById('ktpWOut');
    if (out) out.textContent = `= ${qty.toLocaleString()}`;
  }

  function bindSlideTrack() {
    const track = document.getElementById('ktpSlideTrack');
    const thumb = document.getElementById('ktpSlideThumb');
    const fill = document.getElementById('ktpSlideFill');
    if (!track || !thumb) return;
    let dragging = false, startX = 0, maxX = 0;

    const reset = () => {
      dragging = false;
      thumb.style.transition = 'transform 0.16s ease';
      thumb.style.transform = 'translateX(0px)';
      if (fill) fill.style.width = '0%';
    };

    thumb.onpointerdown = (e) => {
      if (state.tallyPro.locked) return;
      dragging = true;
      thumb.setPointerCapture(e.pointerId);
      startX = e.clientX;
      maxX = Math.max(40, track.clientWidth - thumb.clientWidth - 8);
      thumb.style.transition = 'none';
    };
    thumb.onpointermove = (e) => {
      if (!dragging) return;
      const dx = Math.max(0, Math.min(maxX, e.clientX - startX));
      thumb.style.transform = `translateX(${dx}px)`;
      if (fill) fill.style.width = `${Math.round((dx / maxX) * 100)}%`;
      if (dx >= maxX * 0.82) {
        reset();
        recordCount(null, null, false);
      }
    };
    thumb.onpointerup = reset;
    thumb.onpointercancel = reset;
  }

  // ---------------------------------------------------------------------------
  // 9. ባለ 1-ስክሪን የሻርፕ ሜታል ገጽ ሠሪ (Renderer)
  // ---------------------------------------------------------------------------
  function buildRound10Html(strokes, loadSize) {
    const totalClicks = strokes.length;
    const fullRounds = Math.floor(totalClicks / 10);
    const inRound = totalClicks % 10;
    const fullQty = sumAnyStrokes(strokes.slice(0, fullRounds * 10));
    const curRoundStrokes = strokes.slice(fullRounds * 10);
    const curRoundQty = sumAnyStrokes(curRoundStrokes);

    let cells = '';
    for (let i = 0; i < 10; i++) {
      const s = curRoundStrokes[i];
      const hit = s !== undefined;
      const isLast = hit && i === curRoundStrokes.length - 1;
      const label = hit ? `+${strokeVal(s)}` : String(i + 1);
      cells += `<div class="ktp-cell ${hit ? 'hit' : ''} ${isLast ? 'last' : ''}">${label}</div>`;
    }
    return `
      <div class="ktp-round-box">
        <div class="ktp-round-head">
          <span>${esc(tl('የተጠናቀቁ', 'Done'))}: ${fullRounds}×10 (${fullQty.toLocaleString()})</span>
          <span>${esc(tl('የአሁኑ ዙር', 'Round'))}: ${inRound}/10 (+${curRoundQty})</span>
        </div>
        <div class="ktp-grid10">${cells}</div>
      </div>`;
  }

  function buildMetaFootHtml(ctx) {
    const meta = getMetaLog(ctx.key);
    const lastTs = meta.length ? meta[meta.length - 1].ts : 0;
    const speeds = meta.slice(-3).reverse().map((m, idx) => {
      const num = meta.length - idx;
      return `<span class="ktp-speed-pill">#${num} (${m.dt || '0.0'}s)</span>`;
    }).join(' ');
    return `
      <div class="ktp-meta-foot">
        <span id="ktpAgoTxt">⏱ ${esc(formatAgo(lastTs))}</span>
        <div style="display:flex;gap:3px;overflow:hidden;">${speeds}</div>
      </div>`;
  }

  function updateLiveBoardOnly() {
    const ctx = getActiveContext();
    const total = sumAnyStrokes(ctx.strokes);
    const loads = ctx.strokes.length;
    const rem = ctx.target > 0 ? Math.max(0, ctx.target - total) : null;
    const remLoads = rem !== null ? Math.ceil(rem / Math.max(1, state.tallyPro.loadSize || 1)) : null;

    const k1 = document.getElementById('ktpKpi1');
    const k2 = document.getElementById('ktpKpi2');
    const k3 = document.getElementById('ktpKpi3');
    const k4 = document.getElementById('ktpKpi4');
    if (k1) k1.textContent = total.toLocaleString();
    if (k2) k2.textContent = loads.toLocaleString();
    if (ctx.sub === 'audit') {
      const diff = total - ctx.systemQty;
      if (k3) k3.textContent = (diff > 0 ? '+' : '') + diff.toLocaleString();
      if (k4) k4.textContent = ctx.systemQty.toLocaleString();
    } else {
      if (k3) k3.textContent = rem !== null ? rem.toLocaleString() : '∞';
      if (k4) k4.textContent = remLoads !== null ? remLoads.toLocaleString() : '∞';
    }
    const pf = document.getElementById('ktpProgFill');
    if (pf && ctx.target > 0) {
      pf.style.width = `${Math.min(100, Math.round((total / ctx.target) * 100))}%`;
    }
  }

  function renderTallyPro() {
    const root = document.getElementById('viewRoot');
    if (!root) return;
    ensureTallyProState();
    injectTallyProStyles();
    document.body.classList.add('ktp-active');

    const cfg = state.tallyPro;
    const sub = getSubTab();
    const ctx = getActiveContext();
    const loadSize = Number(cfg.loadSize || 10);
    const total = sumAnyStrokes(ctx.strokes);
    const loads = ctx.strokes.length;
    const modeInfo = TALLY_MODES.find((m) => m.id === cfg.mode) || TALLY_MODES[0];

    // ረድፍ 1: ታቦች + ቁልፍ + ቅንብር በአንድ መስመር (ልክ እንደ ሻርፕ ሜታል)
    const topRowHtml = `
      <div class="ktp-toprow">
        <div class="ktp-subtabs">
          <button type="button" class="ktp-tab ${sub === 'tickets' ? 'on' : ''}" onclick="KoraTallyPro.setSubTab('tickets')">${esc(tl('የጭነት ቲኬት', 'Tickets'))}</button>
          <button type="button" class="ktp-tab ${sub === 'free' ? 'on' : ''}" onclick="KoraTallyPro.setSubTab('free')">${esc(tl('ነጻ ቆጠራ', 'Free Count'))}</button>
          <button type="button" class="ktp-tab ${sub === 'audit' ? 'on' : ''}" onclick="KoraTallyPro.setSubTab('audit')">${esc(tl('ስቶክ ኦዲት', 'Audit'))}</button>
          <button type="button" class="ktp-tab ${sub === 'history' ? 'on' : ''}" onclick="KoraTallyPro.setSubTab('history')">${esc(tl('ታሪክ', 'History'))}</button>
        </div>
        <button type="button" class="ktp-sqbtn ${cfg.locked ? 'locked' : ''}" onclick="KoraTallyPro.toggleLock()" title="Lock">${cfg.locked ? '🔒' : '🔓'}</button>
        <button type="button" class="ktp-sqbtn" onclick="KoraTallyPro.openSettings()" title="Settings">⚙️</button>
      </div>`;

    // የታሪክ ገጽ (History)
    if (sub === 'history') {
      const rows = (state.tally.history || []).map((h) => `
        <div class="sub-card" style="padding:8px 10px;">
          <div class="card-row">
            <b style="font-size:12px;">${esc(h.ref || '')} · ${esc(h.party || '')}</b>
            <span class="pill teal">${Number(h.total || 0).toLocaleString()}</span>
          </div>
          <div style="font-size:11px;color:var(--muted);margin-top:3px;">${esc(h.itemsSummary || '')}</div>
          <div style="font-size:10px;color:var(--muted);margin-top:2px;">🕒 ${esc(h.date || '')}</div>
        </div>`).join('') || `<div class="sub-card" style="text-align:center;color:var(--muted);padding:24px;">${esc(tl('የተመዘገበ የቆጠራ ታሪክ የለም', 'No tally history yet'))}</div>`;

      root.innerHTML = `<div class="ktp-shell">${topRowHtml}<div style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:6px;">${rows}</div></div>`;
      return;
    }

    // ረድፍ 2: እንደ ንዑስ ታቡ የሚቀየር ቀጭን ራስጌ
    let headerHtml = '';
    if (sub === 'tickets') {
      const tk = ctx.ticket;
      const tkChips = state.tally.tickets.map((t) =>
        `<button type="button" class="ktp-chip ${t.id === tk.id ? 'on' : ''}" onclick="KoraTallyPro.selectTicket('${esc(t.id)}')">🚛 ${esc(t.code || t.id)}</button>`
      ).join('');
      const itemChips = tk.items.map((it, idx) => {
        const q = sumAnyStrokes(it.strokes);
        const done = it.target > 0 && q >= it.target;
        const txt = it.target > 0 ? `${it.name} (${q}/${it.target})` : `${it.name} (${q})`;
        return `<button type="button" class="ktp-chip ${idx === tk.activeItemIdx ? 'on' : (done ? 'done' : '')}" onclick="KoraTallyPro.selectTicketItem(${idx})">${done ? '✓ ' : ''}${esc(txt)}</button>`;
      }).join('');
      headerHtml = `
        <div class="ktp-strip no-scrollbar">
          ${tkChips}
          <button type="button" class="ktp-chip add" onclick="KoraTallyPro.addTicket()">+ ${esc(tl('አዲስ', 'New'))}</button>
        </div>
        <div class="ktp-bar ticket">
          <button type="button" class="ktp-dir-btn ${tk.dir === 'in' ? 'in' : ''}" onclick="KoraTallyPro.toggleTicketDir()">${tk.dir === 'in' ? tl('ገቢ', 'IN') : tl('ወጪ', 'OUT')}</button>
          <input class="ktp-mini-inp" value="${esc(tk.code || '')}" placeholder="ኮድ" onchange="KoraTallyPro.updateTicketField('code',this.value)">
          <input class="ktp-mini-inp" value="${esc(tk.party || '')}" placeholder="${esc(tl('ደንበኛ / አቅራቢ', 'Customer / Party'))}" onchange="KoraTallyPro.updateTicketField('party',this.value)">
          <button type="button" class="ktp-sqbtn" style="width:28px;height:29px;color:#fb7185;" onclick="KoraTallyPro.removeActiveTicket()">✕</button>
        </div>
        <div class="ktp-strip no-scrollbar">
          ${itemChips}
          <button type="button" class="ktp-chip add" onclick="KoraTallyPro.openAddTicketItemModal()">+ ${esc(tl('ዕቃ ጨምር', 'Add Item'))}</button>
        </div>`;
    } else if (sub === 'free') {
      headerHtml = `
        <div class="ktp-bar free">
          <input class="ktp-mini-inp" value="${esc(ctx.free.note || '')}" placeholder="${esc(tl('ማስታወሻ (አማራጭ)', 'Note (optional)'))}" oninput="state.tally.free.note=this.value;saveState();">
          <input class="ktp-mini-inp" type="number" min="0" style="text-align:center;color:#38bdf8;" value="${ctx.free.target || ''}" placeholder="${esc(tl('ግብ', 'Target'))}" onchange="state.tally.free.target=Math.max(0,Number(this.value||0));saveState();KoraTallyPro.render();">
          <button type="button" class="ktp-sqbtn" onclick="KoraTallyPro.openSettings()" title="Mode">${modeInfo.icon}</button>
        </div>`;
    } else if (sub === 'audit') {
      const opts = (state.inventory || []).map((it) =>
        `<option value="${esc(it.id)}" ${ctx.inv && ctx.inv.id === it.id ? 'selected' : ''}>${esc(it.name)} (${Number(it.stock ?? it.qty ?? 0)})</option>`
      ).join('');
      headerHtml = `
        <div class="ktp-bar audit">
          <select class="ktp-mini-inp" onchange="state.tally.audit.itemId=this.value;state.tally.audit.strokes=[];saveState();KoraTallyPro.render();">${opts}</select>
          <div class="ktp-mini-inp" style="display:flex;align-items:center;justify-content:center;color:#38bdf8;">${ctx.systemQty.toLocaleString()}</div>
        </div>`;
    }

    // ረድፍ 3: የአንድ ሸክም መጠን + የቆጠራ ሲስተም ባጅ
    const presetHtml = `
      <div class="ktp-loadbox">
        <div class="ktp-loadhead">
          <span>${esc(tl('በአንድ ሸክም', 'Per Load'))}: <b style="color:#5eead4;">1 = ${loadSize}</b></span>
          <button type="button" style="background:none;border:none;color:#fbbf24;font-size:10px;font-weight:800;cursor:pointer;" onclick="KoraTallyPro.openSettings()">${modeInfo.icon} ${esc(isAm() ? modeInfo.am : modeInfo.en)} ▾</button>
        </div>
        <div class="ktp-presets">
          ${PRESETS.map((n) => `<button type="button" class="ktp-pbtn ${loadSize === n ? 'on' : ''}" onclick="KoraTallyPro.setLoadSize(${n})">+${n}</button>`).join('')}
          <button type="button" class="ktp-pbtn ${!PRESETS.includes(loadSize) ? 'on' : ''}" onclick="KoraTallyPro.setLoadSize('other')">${esc(tl('ሌላ', 'Oth'))}</button>
        </div>
      </div>`;

    // ረድፍ 4: 4ቱ ቁጥሮች (ሲቆለፍም ሳይደበቁ የሚታዩ) + የመሃል መድረክ
    let kpiHtml = '';
    let pct = 0;
    const targetReached = ctx.target > 0 && total >= ctx.target;
    if (sub === 'audit') {
      const diff = total - ctx.systemQty;
      pct = ctx.systemQty > 0 ? Math.min(100, Math.round((total / ctx.systemQty) * 100)) : 0;
      kpiHtml = `
        <div class="ktp-kpis">
          <div class="ktp-kpi c-teal"><span>${esc(tl('የተቆጠረ', 'Counted'))}</span><b id="ktpKpi1">${total.toLocaleString()}</b></div>
          <div class="ktp-kpi c-em"><span>${esc(tl('ሸክም', 'Loads'))}</span><b id="ktpKpi2">${loads.toLocaleString()}</b></div>
          <div class="ktp-kpi ${diff === 0 ? 'c-em' : (diff < 0 ? 'c-rose' : 'c-amb')}"><span>${esc(tl('ልዩነት', 'Diff'))}</span><b id="ktpKpi3">${diff > 0 ? '+' : ''}${diff.toLocaleString()}</b></div>
          <div class="ktp-kpi c-sky"><span>${esc(tl('ሲስተም', 'System'))}</span><b id="ktpKpi4">${ctx.systemQty.toLocaleString()}</b></div>
        </div>`;
    } else {
      const rem = ctx.target > 0 ? Math.max(0, ctx.target - total) : null;
      const remLoads = rem !== null ? Math.ceil(rem / Math.max(1, loadSize)) : null;
      pct = ctx.target > 0 ? Math.min(100, Math.round((total / ctx.target) * 100)) : 0;
      kpiHtml = `
        <div class="ktp-kpis">
          <div class="ktp-kpi c-teal"><span>${esc(tl('የተቆጠረ', 'Counted'))}</span><b id="ktpKpi1">${total.toLocaleString()}</b></div>
          <div class="ktp-kpi c-em"><span>${esc(tl('ሸክም', 'Loads'))}</span><b id="ktpKpi2">${loads.toLocaleString()}</b></div>
          <div class="ktp-kpi c-amb"><span>${esc(tl('ቀሪ ብዛት', 'Rem Qty'))}</span><b id="ktpKpi3">${rem !== null ? rem.toLocaleString() : '∞'}</b></div>
          <div class="ktp-kpi c-sky"><span>${esc(tl('ቀሪ ሸክም', 'Rem Loads'))}</span><b id="ktpKpi4">${remLoads !== null ? remLoads.toLocaleString() : '∞'}</b></div>
        </div>`;
    }

    // የመሃል መድረክ (እንደ ተመረጠው ሲስተም)
    let stageInner = '';
    if (!ctx.ready) {
      stageInner = `<div style="text-align:center;color:var(--muted);font-size:12.5px;padding:12px;">${esc(tl('ዕቃ ለመቁጠር ከላይ «+ ዕቃ ጨምር» ይጫኑ', 'Tap "+ Add Item" above to begin counting'))}</div>`;
    } else if (cfg.mode === 'camera') {
      stageInner = `
        <div class="ktp-cam-wrap">
          <video id="ktpCamVideo" playsinline muted autoplay></video>
          <div class="ktp-cam-line"></div>
          <div class="ktp-cam-hud">
            <span id="ktpCamStatus" class="pill ${camStream ? 'teal' : 'amber'}">${camStream ? tl('🟢 በመቁጠር ላይ', '🟢 Live') : tl('⏸️ ቆሟል', '⏸️ Stopped')}</span>
            <button id="ktpCamDirBtn" type="button" style="pointer-events:auto;height:24px;padding:0 8px;border-radius:12px;border:1px solid var(--amber);background:rgba(15,23,42,0.85);color:#fcd34d;font-size:10px;font-weight:800;" onclick="KoraTallyPro.toggleCameraDir()">${cfg.camDir === 'LR' ? '➡️ ግራ➔ቀኝ (+)' : '⬅️ ቀኝ➔ግራ (+)'}</button>
          </div>
        </div>`;
    } else if (cfg.mode === 'weight') {
      stageInner = `
        <div class="ktp-round-box" style="gap:7px;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
            <select id="ktpWMode" class="ktp-mini-inp" style="flex:1;" onchange="KoraTallyPro.updateWeightPreview()">
              <option value="weight">⚖️ ${esc(tl('ጠቅላላ ክብደት ÷ የ1 ፍሬ ክብደት', 'Total Weight ÷ Unit Weight'))}</option>
              <option value="pack">📦 ${esc(tl('ጥቅል/ካርቶን × በጥቅል ውስጥ ያለ ፍሬ', 'Packs × Units per Pack'))}</option>
            </select>
            <b id="ktpWOut" style="color:#2dd4bf;font-size:16px;font-family:ui-monospace,monospace;">= 0</b>
          </div>
          <div class="grid-2" style="gap:5px;">
            <input id="ktpWValA" type="number" step="any" class="ktp-mini-inp" placeholder="${esc(tl('ክብደት (ኪ.ግ) / ጥቅል', 'Weight / Packs'))}" oninput="KoraTallyPro.updateWeightPreview()">
            <input id="ktpWValB" type="number" step="any" class="ktp-mini-inp" value="1" placeholder="${esc(tl('የ1 ፍሬ ክብደት / ፍሬ', 'Unit wt / per pack'))}" oninput="KoraTallyPro.updateWeightPreview()">
          </div>
          <button type="button" class="btn teal sm" onclick="KoraTallyPro.applyWeightCalc()">➕ ${esc(tl('ውጤቱን ወደ ቆጠራ ጨምር', 'Add Result to Tally'))}</button>
        </div>`;
    } else if (cfg.mode === 'carriers') {
      const activeCars = cfg.carriers.slice(0, Number(cfg.carrierCount || 2));
      const meta = getMetaLog(ctx.key);
      const carPills = activeCars.map((c) => {
        const cLogs = meta.filter((m) => m.carrierId === c.id);
        const cQty = cLogs.reduce((a, m) => a + m.qty, 0);
        return `<span class="ktp-chip" style="border-color:${c.color};color:${c.color};">${esc(c.name)}: ${cQty} (${cLogs.length})</span>`;
      }).join('');
      stageInner = `<div class="ktp-strip no-scrollbar" style="margin-bottom:4px;">${carPills}</div>${buildRound10Html(ctx.strokes, loadSize)}`;
    } else if (cfg.mode === 'clicker') {
      stageInner = `
        <div style="text-align:center;font-size:10.5px;color:#5eead4;margin-bottom:4px;font-weight:800;">
          🎮 ${esc(tl('ብሉቱዝ ቁልፍ / Enter / Space ዝግጁ ነው', 'Bluetooth Clicker / Enter / Space Ready'))}
        </div>
        ${buildRound10Html(ctx.strokes, loadSize)}`;
    } else {
      stageInner = buildRound10Html(ctx.strokes, loadSize);
    }

    const lockOverlay = cfg.locked ? `
      <div class="ktp-lock-overlay">
        <div style="font-size:22px;">🔒</div>
        <div style="font-size:12px;font-weight:900;color:#fbbf24;">${esc(tl('ቆጠራው ተቆልፏል', 'Tally Locked'))}</div>
        <button type="button" class="btn teal sm" onclick="KoraTallyPro.toggleLock()">▶ ${esc(tl('ቆጠራ ቀጥል', 'Resume Tally'))}</button>
      </div>` : '';

    // ረድፍ 5: የመቁጠሪያ ዶክ (እንደ ተመረጠው ሲስተም)
    let dockControlHtml = '';
    if (cfg.mode === 'swipe') {
      dockControlHtml = `
        <div id="ktpSlideTrack" class="ktp-slider-track">
          <div id="ktpSlideFill" class="ktp-slider-fill"></div>
          <span style="font-size:12.5px;font-weight:800;color:#5eead4;pointer-events:none;">👉 ${esc(tl(`ወደ ቀኝ አንሸራትት (+${loadSize})`, `Slide Right (+${loadSize})`))}</span>
          <div id="ktpSlideThumb" class="ktp-slider-thumb">⚡+${loadSize}</div>
        </div>`;
    } else if (cfg.mode === 'carriers') {
      const activeCars = cfg.carriers.slice(0, Number(cfg.carrierCount || 2));
      dockControlHtml = `
        <div class="ktp-carrier-grid">
          ${activeCars.map((c) => `
            <button type="button" class="ktp-carrier-btn" style="border-color:${c.color};" onclick="KoraTallyPro.count(null,'${c.id}')">
              <span style="font-size:11px;font-weight:800;color:${c.color};">👷 ${esc(c.name)}</span>
              <b style="font-size:15px;">⚡ +${loadSize}</b>
            </button>`).join('')}
        </div>`;
    } else if (cfg.mode === 'mixed') {
      dockControlHtml = `
        <div class="ktp-mixed-grid">
          ${[1, 2, 3, 5, 10, 15, 20].map((v) => `<button type="button" class="ktp-mixed-btn" onclick="KoraTallyPro.count(${v})">+${v}</button>`).join('')}
          <button type="button" class="ktp-mixed-btn" style="border-color:var(--amber);color:#fbbf24;" onclick="KoraTallyPro.openPartialModal()">${esc(tl('ሌላ', 'Oth'))}</button>
        </div>`;
    } else if (cfg.mode === 'camera') {
      dockControlHtml = `
        <div class="grid-2" style="gap:6px;">
          <button type="button" class="ktp-main-tap" style="height:46px;font-size:13.5px;border-color:${camStream ? 'var(--rose)' : 'var(--teal)'};" onclick="KoraTallyPro.toggleCamera()">${camStream ? '⏹️ ' + tl('ካሜራ አቁም', 'Stop Cam') : '📷 ' + tl('ካሜራ ጀምር', 'Start Cam')}</button>
          <button type="button" class="ktp-main-tap ${cfg.locked ? 'locked' : ''}" style="height:46px;font-size:14.5px;" onclick="KoraTallyPro.count()">⚡ +${loadSize} ${esc(tl('ቁጠር', 'Count'))}</button>
        </div>`;
    } else {
      dockControlHtml = `
        <button type="button" class="ktp-main-tap ${cfg.locked ? 'locked' : ''}" onclick="KoraTallyPro.count()">
          ⚡ +${loadSize} ${esc(tl('ቁጠር', 'COUNT'))}
        </button>`;
    }

    const primaryLbl = sub === 'tickets'
      ? `✓ ${tl('ቀጥታ መዝግብ', 'Commit Stock')}`
      : (sub === 'free' ? `💾 ${tl('ወደ መመዝገቢያ', 'Save Log')}` : `⚡ ${tl('ማስተካከያ ላክ', 'Apply Audit')}`);

    root.innerHTML = `
      <div class="ktp-shell">
        ${topRowHtml}
        ${headerHtml}
        ${presetHtml}
        <div class="ktp-board">
          <div class="ktp-prog"><div id="ktpProgFill" class="ktp-prog-fill" style="width:${pct}%"></div></div>
          ${kpiHtml}
          ${targetReached ? `<div class="ktp-target-ok">✓ ${esc(tl('ግቡ ሞልቷል — ጭነት አስቁም', 'Target Reached — Stop Loading'))}</div>` : ''}
          <div class="ktp-stage">
            ${stageInner}
            ${lockOverlay}
          </div>
          ${cfg.showTimer ? buildMetaFootHtml(ctx) : ''}
        </div>
        <div class="ktp-dock">
          ${dockControlHtml}
          <div class="ktp-actions">
            <button type="button" class="ktp-act" onclick="KoraTallyPro.undo()">↩️ ${esc(tl('መልስ', 'Undo'))}</button>
            <button type="button" class="ktp-act" onclick="KoraTallyPro.openPartialModal()">+ ${esc(tl('ጎዶሎ', 'Part'))}</button>
            <button type="button" class="ktp-act" onclick="KoraTallyPro.clear()">🧹 ${esc(tl('አጽዳ', 'Clear'))}</button>
            <button type="button" class="ktp-act primary" onclick="KoraTallyPro.commit()">${esc(primaryLbl)}</button>
          </div>
        </div>
      </div>`;

    if (cfg.mode === 'swipe') bindSlideTrack();
    if (cfg.mode === 'camera' && camStream) {
      const vid = document.getElementById('ktpCamVideo');
      if (vid && vid.srcObject !== camStream) {
        vid.srcObject = camStream;
        vid.play().catch(() => {});
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 10. የስልክ ጥሪ ራስ-ሰር መቆለፊያ፣ የብሉቱዝ ቁልፍ እና የኮራ ስቶክ ውህደት
  // ---------------------------------------------------------------------------
  function isTallyScreenActive() {
    const s = global.state;
    if (!s) return false;
    if (s.tab === 'tally' || s.activeTab === 'tally' || s.view === 'tally' || s.nav === 'tally') return true;
    const activeNav = document.querySelector('.bnav .active, .bnav-btn.active, nav button.active');
    if (activeNav) {
      const txt = (activeNav.textContent || '').trim();
      if (txt.includes('ቆጠራ') || txt.toLowerCase().includes('tally')) return true;
    }
    return false;
  }

  function installHooks() {
    if (hooksInstalled || typeof global.renderView !== 'function') return;
    hooksInstalled = true;
    ensureTallyProState();
    injectTallyProStyles();

    const origRenderView = global.renderView;
    global.renderView = function () {
      const res = origRenderView.apply(this, arguments);
      if (isTallyScreenActive()) {
        renderTallyPro();
      } else {
        document.body.classList.remove('ktp-active');
        stopCamera();
      }
      return res;
    };

    // በስልክ ጥሪ ወይም ወደ ሌላ አፕ ሲቀየር ራስ-ሰር መቆለፊያ
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && isTallyScreenActive() && state.tallyPro?.autoLockCall) {
        state.tallyPro.locked = true;
        stopCamera();
        saveState();
      } else if (!document.hidden && isTallyScreenActive()) {
        renderTallyPro();
      }
    });

    // የብሉቱዝ ክሊከር / ኪቦርድ ቆጠራ ማዳመጫ
    document.addEventListener('keydown', (e) => {
      if (!isTallyScreenActive() || state.tallyPro?.mode !== 'clicker') return;
      const tag = (document.activeElement?.tagName || '').toUpperCase();
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      if (['Enter', ' ', 'ArrowUp', 'ArrowRight', 'AudioVolumeUp', 'VolumeUp', 'MediaPlayPause'].includes(e.key)) {
        e.preventDefault();
        recordCount(null, null, false);
      }
    });

    // የሰዓት ቆጣሪ (በየ1 ሰከንድ ጽሁፉን ብቻ ማደስ)
    if (!timerIntervalId) {
      timerIntervalId = setInterval(() => {
        if (!isTallyScreenActive() || !state.tallyPro?.showTimer) return;
        const el = document.getElementById('ktpAgoTxt');
        if (!el) return;
        const ctx = getActiveContext();
        const meta = getMetaLog(ctx.key);
        const lastTs = meta.length ? meta[meta.length - 1].ts : 0;
        el.textContent = '⏱ ' + formatAgo(lastTs);
      }, 1000);
    }

    if (isTallyScreenActive()) renderTallyPro();
  }

  function testVoice() {
    ensureTallyProState();
    const cfg = state.tallyPro;
    const prevEn = cfg.voiceEnabled;
    const prevRead = cfg.voiceRead;
    const prevLang = cfg.voiceLang;
    cfg.voiceEnabled = true;
    const rSel = document.getElementById('ktpVoiceRead');
    const lSel = document.getElementById('ktpVoiceLang');
    if (rSel) cfg.voiceRead = rSel.value;
    if (lSel) cfg.voiceLang = lSel.value;
    announceCount(10, 2, false);
    cfg.voiceEnabled = prevEn;
    cfg.voiceRead = prevRead;
    cfg.voiceLang = prevLang;
  }

  global.KoraTallyPro = {
    render: renderTallyPro,
    setSubTab,
    count: recordCount,
    undo: undoCount,
    clear: clearCounts,
    confirmClear,
    openPartialModal,
    confirmPartial,
    setLoadSize,
    confirmCustomLoad,
    toggleLock,
    selectTicket,
    addTicket,
    removeActiveTicket,
    toggleTicketDir,
    updateTicketField,
    selectTicketItem,
    openAddTicketItemModal,
    confirmAddTicketItem,
    commit: commitPrimaryAction,
    openSettings: openTallyProSettings,
    saveSettingsModal,
    openVoiceStudio,
    toggleRecKey,
    playKeyClip,
    delKeyClip,
    exportVoicePack,
    importVoicePack,
    downloadVoicePackUrl,
    testVoice,
    startCamera,
    stopCamera,
    toggleCamera,
    toggleCameraDir,
    applyWeightCalc,
    updateWeightPreview
  };

  installHooks();
  document.addEventListener('DOMContentLoaded', installHooks);
  setTimeout(installHooks, 400);
})(window);
