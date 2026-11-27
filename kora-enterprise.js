// =============================================================================
// ኮራ ስቶክ — Enterprise Suite (kora-enterprise.js — v26)
// • ድርብ የቆጠራ ታብ ማስወገጃ + የታችኛው 4 ቁልፎች ሳይሸፈኑ ሙሉ 1-ስክሪን ልኬት
// • Self-Healing 🔔 ኖቲፊኬሽን ደወል + ንጹህ ላይኛው አሞሌ (ኮራ ስቶክ · ቅርንጫፍ · 🔔)
// • ዘመናዊ ገበያ (Kora Market) + ትዕዛዞች -> Google-Maps Live Map -> QR መውጫ ፈቃድ -> ተሽከርካሪዎች
// =============================================================================
(function (global) {
  'use strict';

  function hasState() { return typeof state !== 'undefined' && state && typeof state === 'object'; }
  function isAm() { return !hasState() || state.lang !== 'en'; }
  function L(am, en) { return isAm() ? am : en; }
  function sEsc(v) { return typeof esc === 'function' ? esc(v) : String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function sNum(n) { return typeof fmtNum === 'function' ? fmtNum(n) : Number(n || 0).toLocaleString(); }
  function sMoney(n) { return typeof fmtMoney === 'function' ? fmtMoney(n) : `${Number(n || 0).toLocaleString()} ብር`; }

  const AM_PHON = {
    0: 'zero', 1: 'and', 2: 'hulet', 3: 'sost', 4: 'arat', 5: 'amist',
    6: 'sidist', 7: 'sebat', 8: 'simint', 9: 'zetegn', 10: 'asir',
    11: 'asra and', 12: 'asra hulet', 13: 'asra sost', 14: 'asra arat', 15: 'asra amist',
    16: 'asra sidist', 17: 'asra sebat', 18: 'asra simint', 19: 'asra zetegn',
    20: 'haya', 30: 'selasa', 40: 'arba', 50: 'hamsa',
    60: 'sidsa', 70: 'seba', 80: 'semanya', 90: 'zetena', 100: 'meto'
  };

  function numToAmPhonetic(n) {
    const num = Math.max(0, Math.round(Number(n || 0)));
    if (AM_PHON[num]) return AM_PHON[num];
    if (num > 20 && num < 100) {
      const t = Math.floor(num / 10) * 10, o = num % 10;
      return `${AM_PHON[t] || t} ${AM_PHON[o] || o}`;
    }
    if (num >= 100 && num < 1000) {
      const h = Math.floor(num / 100), r = num % 100;
      const hs = h === 1 ? 'meto' : `${AM_PHON[h] || h} meto`;
      return r ? `${hs} ${numToAmPhonetic(r)}` : hs;
    }
    return String(num);
  }

  // ---------------------------------------------------------------------------
  // 1. Enterprise & Sharp-Metal 1-Screen Tally CSS (v26)
  // ---------------------------------------------------------------------------
  function injectEnterpriseCss() {
    let st = document.getElementById('koraEntCss');
    if (!st) {
      st = document.createElement('style');
      st.id = 'koraEntCss';
      document.head.appendChild(st);
    }
    st.textContent = `
      .ke-hidden-el { display: none !important; }
      .topbar { padding: 5px 8px 4px !important; gap: 5px !important; }
      .topbar-row { display: flex !important; align-items: center !important; gap: 6px !important; width: 100% !important; }
      .topbar-row .scope-sel { flex: 0 1 138px !important; max-width: 145px !important; height: 32px !important; font-size: 11.5px !important; }
      .ke-brand-box { display: none; align-items: center; gap: 6px; flex: 1 1 auto; min-width: 0; }
      body.ke-tally .ke-brand-box { display: flex !important; }
      body.ke-tally .search-wrap { display: none !important; }
      .ke-brand-txt { display: flex; flex-direction: column; min-width: 0; line-height: 1.15; }
      .ke-brand-txt b { font-size: 13px; font-weight: 900; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .ke-brand-txt small { font-size: 9.5px; font-weight: 700; color: var(--teal); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

      .ke-bell-btn { position: relative !important; width: 34px !important; height: 32px !important; border-radius: 10px !important; border: 1px solid var(--border-strong) !important; background: rgba(15, 23, 42, 0.92) !important; color: #fbbf24 !important; font-size: 16px !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important; cursor: pointer; }
      .ke-bell-badge { position: absolute; top: -4px; right: -4px; min-width: 17px; height: 17px; padding: 0 4px; border-radius: 99px; background: #ef4444; color: #fff; font-size: 10px; font-weight: 900; display: flex; align-items: center; justify-content: center; border: 1.5px solid #060a12; }
      .ke-net-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; background: #10b981; box-shadow: 0 0 6px #10b981; position: absolute; bottom: 2px; left: 2px; }
      .ke-net-dot.off { background: #f59e0b; box-shadow: 0 0 6px #f59e0b; }

      .ke-sub-wrap { display: flex !important; align-items: center !important; gap: 5px !important; width: 100% !important; }
      .ke-sub-wrap > #subTabsBar { flex: 1 1 auto !important; min-width: 0 !important; }
      .ke-tally-tools { display: none; align-items: center; gap: 4px; flex-shrink: 0; }
      body.ke-tally .ke-tally-tools { display: flex !important; }
      .ke-tool-btn { width: 30px; height: 29px; border-radius: 9px; border: 1px solid var(--border-strong); background: rgba(15, 23, 42, 0.92); color: var(--text); font-size: 14px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }
      .ke-tool-btn.locked { background: rgba(239, 68, 68, 0.22); border-color: rgba(239, 68, 68, 0.65); }

      /* === v26 FIX 1: KoraTallyPro ሲሠራ ድርብ የሆነውን የላይኛው ታብ መስመር ሙሉ ለሙሉ መደበቅ === */
      html body.ke-tally.ktp-active .ke-sub-wrap { display: none !important; }
      html body.ke-tally.ktp-active .topbar { padding: 4px 8px !important; gap: 0 !important; }

      /* === v26 FIX 2: የታችኛው +ቁጠር እና 4ቱ ቁልፎች ከዳሰሳው በላይ 100% እንዲታዩ === */
      html body.ke-tally.ktp-active .viewport {
        height: var(--ke-tally-h, calc(100dvh - 118px)) !important;
        max-height: var(--ke-tally-h, calc(100dvh - 118px)) !important;
        padding: 4px 7px 6px !important;
        overflow: hidden !important;
        display: flex !important;
        flex-direction: column !important;
        box-sizing: border-box !important;
      }
      html body.ke-tally.ktp-active #viewRoot {
        flex: 1 1 0% !important;
        height: 100% !important;
        min-height: 0 !important;
        max-height: 100% !important;
        padding: 0 !important;
        overflow: hidden !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 0 !important;
      }
      html body.ke-tally.ktp-active .ktp-shell {
        flex: 1 1 0% !important;
        min-height: 0 !important;
        height: 100% !important;
        gap: 5px !important;
      }
      html body.ke-tally.ktp-active .ktp-board {
        flex: 1 1 0% !important;
        min-height: 0 !important;
      }
      html body.ke-tally.ktp-active .ktp-cell {
        height: 39px !important;
        font-size: 13px !important;
      }
      html body.ke-tally.ktp-active .ktp-kpi b {
        font-size: 17px !important;
      }
      html body.ke-tally.ktp-active .ktp-tap {
        height: 48px !important;
      }
      html body.ke-tally.ktp-active .ktp-act {
        height: 36px !important;
      }

      /* === Fallback: KoraTallyPro በሌለበት ሁኔታ (ነባሩ ቆጠራ) === */
      body.ke-tally:not(.ktp-active) .topbar { padding: 4px 8px 3px !important; gap: 4px !important; }
      body.ke-tally:not(.ktp-active) #subTabsBar { display: grid !important; grid-template-columns: repeat(4, 1fr) !important; gap: 4px !important; padding: 0 !important; overflow: visible !important; }
      body.ke-tally:not(.ktp-active) #subTabsBar .subtab { width: 100% !important; height: 29px !important; padding: 0 3px !important; font-size: 10.5px !important; font-weight: 800 !important; border-radius: 9px !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; text-align: center !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; }
      body.ke-tally:not(.ktp-active) .viewport { padding-top: 4px !important; padding-left: 7px !important; padding-right: 7px !important; display: flex !important; flex-direction: column !important; }
      body.ke-tally:not(.ktp-active) #viewRoot { display: flex !important; flex-direction: column !important; gap: 5px !important; width: 100% !important; }
      body.ke-tally:not(.ktp-active) #viewRoot > * { flex-shrink: 0; }
      body.ke-tally:not(.ktp-active) #viewRoot .card { padding: 5px 7px !important; gap: 4px !important; border-radius: 11px !important; margin: 0 !important; }
      body.ke-tally:not(.ktp-active) #viewRoot .sub-card { padding: 4px 6px !important; gap: 4px !important; margin: 0 !important; }
      body.ke-tally:not(.ktp-active) #viewRoot .inp, body.ke-tally:not(.ktp-active) #viewRoot .sel { height: 28px !important; font-size: 11.5px !important; padding: 0 7px !important; }
      body.ke-tally:not(.ktp-active) .ke-board-grow { flex: 1 1 auto !important; min-height: 170px !important; display: flex !important; flex-direction: column !important; justify-content: space-between !important; }
      body.ke-tally:not(.ktp-active) .ke-board-grow > .ke-round-center { margin-top: auto !important; margin-bottom: auto !important; }
      body.ke-tally:not(.ktp-active) .ke-dock-flush, body.ke-tally:not(.ktp-active) .tally-sticky-dock { position: static !important; bottom: auto !important; margin-top: 0 !important; padding: 1px 0 0 !important; gap: 4px !important; flex-shrink: 0 !important; }

      .ke-kpi-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
      .ke-modal-sep { border: 0; border-top: 1px solid var(--border-strong); margin: 7px 0 5px; }
      .ke-modal-hdr { font-size: 10.5px; font-weight: 900; color: var(--teal); letter-spacing: 0.2px; margin-bottom: 2px; }

      .ke-mkt-hero { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 2px; scroll-snap-type: x mandatory; }
      .ke-hero-card { min-width: 240px; flex-shrink: 0; scroll-snap-align: start; border-radius: 14px; padding: 11px; background: linear-gradient(135deg, rgba(20,184,166,0.22), rgba(15,23,42,0.96)); border: 1px solid rgba(45,212,191,0.45); display: flex; flex-direction: column; gap: 5px; }
      .ke-mkt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(156px, 1fr)); gap: 8px; }
      .ke-ad-card { background: var(--card); border: 1px solid var(--border-strong); border-radius: 13px; overflow: hidden; display: flex; flex-direction: column; }
      .ke-ad-img { width: 100%; height: 106px; object-fit: cover; background: linear-gradient(135deg, #0f1d30, #091322); display: flex; align-items: center; justify-content: center; position: relative; font-size: 30px; }
      .ke-ad-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .ke-disc { position: absolute; top: 6px; left: 6px; background: #ef4444; color: #fff; font-size: 9.5px; font-weight: 900; padding: 2px 6px; border-radius: 6px; }
      .ke-stk-tag { position: absolute; bottom: 6px; right: 6px; background: rgba(6,10,18,0.86); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.5); font-size: 9px; font-weight: 800; padding: 1px 6px; border-radius: 6px; }
      .ke-ad-body { padding: 8px; display: flex; flex-direction: column; gap: 4px; flex: 1; }
      .ke-ad-acts { display: grid; grid-template-columns: 1fr 1fr 1.3fr; gap: 4px; margin-top: auto; padding-top: 5px; }
      .ke-ad-btn { height: 27px; border-radius: 8px; border: 1px solid var(--border-strong); background: var(--surface-deep); color: var(--text); font-size: 10.5px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 2px; text-decoration: none; cursor: pointer; }
      .ke-ad-btn.buy { background: var(--teal); border-color: var(--teal); color: #041b1a; }

      .ke-steps { display: grid; grid-template-columns: repeat(6, 1fr); gap: 3px; margin: 4px 0; }
      .ke-st-bar { height: 5px; border-radius: 4px; background: rgba(51,65,85,0.65); }
      .ke-st-bar.on { background: var(--teal); }
      .ke-map-box { width: 100%; height: 390px; border-radius: 14px; overflow: hidden; border: 1px solid var(--border-strong); background: #070d19; position: relative; z-index: 1; }
      .ke-map-ctrl { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; justify-content: space-between; }
      .ke-route-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; }
      .ke-qr-box { display: flex; align-items: center; gap: 10px; background: #070d19; border: 1px dashed var(--teal); border-radius: 11px; padding: 8px; }
      .ke-qr-svg { width: 74px; height: 74px; background: #fff; border-radius: 8px; padding: 4px; flex-shrink: 0; }
      .ke-aud-row { background: var(--surface-deep); border: 1px solid var(--border); border-left: 3px solid var(--primary); border-radius: 10px; padding: 8px; display: flex; flex-direction: column; gap: 2px; }
    `;
  }

  // ---------------------------------------------------------------------------
  // 2. የዳታ መዋቅር እና ኦዲት መዝገብ
  // ---------------------------------------------------------------------------
  const TMS_STAGES = [
    { k: 'open',      am: 'ክፍት',       en: 'Open',       col: 'amber' },
    { k: 'assigned',  am: 'ሹፌር ተመደበ',  en: 'Assigned',   col: 'primary' },
    { k: 'loading',   am: 'በመጫን ላይ',    en: 'Loading',    col: 'teal' },
    { k: 'transit',   am: 'በጉዞ ላይ',     en: 'In Transit', col: 'teal' },
    { k: 'arrived',   am: 'ደርሷል',       en: 'Arrived',    col: 'emerald' },
    { k: 'delivered', am: 'ተረክቧል',      en: 'Delivered',  col: 'emerald' }
  ];

  const DEFAULT_COORDS = [
    [8.9125, 38.7652], [9.0315, 38.7428], [9.0185, 38.8012],
    [8.9885, 38.7895], [9.0052, 38.7115]
  ];

  function ensureEntState() {
    if (!hasState()) return;
    if (!state.cfg) state.cfg = {};
    const cfgDefs = {
      tallyPhoto: true, tallyPack: true, tallyWeight: true, tallyCamera: true,
      voiceReadMode: 'clicks', voiceLang: 'am',
      marketShowMine: true, marketShowAds: true, mapLayer: 'street'
    };
    Object.keys(cfgDefs).forEach((k) => {
      if (state.cfg[k] === undefined) state.cfg[k] = cfgDefs[k];
    });

    if (!Array.isArray(state.auditLogs)) state.auditLogs = [];
    if (!Array.isArray(state.marketAds)) {
      state.marketAds = [{
        id: 'ad_1', title: 'የታሸገ ምርት U — የጅምላ ቅናሽ',
        category: state.inventory?.[0]?.category || 'ጠቅላላ',
        price: 1290, oldPrice: 1450, unit: 'ካርቶን', moq: 10, stockStatus: 'IN_STOCK',
        seller: state.orgName || 'ኮራ ስቶክ', city: 'አዲስ አበባ · መርካቶ',
        phone: '0911000000', telegram: '', featured: true, photo: ''
      }];
    }

    (state.branches || []).forEach((b, i) => {
      if (!b.lat || !b.lng) { const pt = DEFAULT_COORDS[i % DEFAULT_COORDS.length]; b.lat = pt[0]; b.lng = pt[1]; }
    });
    (state.fleet || []).forEach((f, i) => {
      if (!f.lat || !f.lng) { f.lat = 8.965 + i * 0.028; f.lng = 38.748 + i * 0.024; }
      if (!f.capacity) f.capacity = i % 2 === 0 ? '5 ቶን (FSR)' : '3.5 ቶን (Isuzu)';
      if (!f.phone) f.phone = '0911' + String(200000 + i * 11111).slice(0, 6);
    });
    (state.dispatchOrders || []).forEach((o, i) => {
      if (!o.pickupLat) { o.pickupLat = state.branches?.[0]?.lat || 8.9125; o.pickupLng = state.branches?.[0]?.lng || 38.7652; }
      if (!o.dropLat) { o.dropLat = 8.995 + (i % 3) * 0.015; o.dropLng = 38.785 + (i % 2) * 0.014; }
      if (o.fuelCost === undefined) o.fuelCost = 0;
      if (o.driverCost === undefined) o.driverCost = 0;
    });

    if (!state._keV19Init) {
      if (state.activeSubTab) state.activeSubTab.dispatch = 'orders';
      state._keV19Init = true;
      saveState();
    }
  }

  function logAudit(action, ref, details) {
    if (!hasState()) return;
    ensureEntState();
    const u = typeof curUser === 'function' ? curUser() : { name: 'User', role: '-' };
    state.auditLogs.unshift({
      id: 'aud_' + Date.now(), action, ref: ref || '-', details: details || '',
      actor: u.name || '-', role: u.role || '-', ts: new Date().toLocaleString()
    });
    if (state.auditLogs.length > 400) state.auditLogs.length = 400;
    saveState();
  }

  // ---------------------------------------------------------------------------
  // 3. የድምፅ መቆጣጠሪያ (ከKoraTallyPro ጋር እንዳይጋጭ ተስተካክሏል)
  // ---------------------------------------------------------------------------
  function getExactActiveLoadClicks(rawSpokenQty) {
    if (!hasState()) return 0;
    const t = state.tally || {};
    const sub = state.activeSubTab?.tally || 'tickets';
    try {
      let strokes = null;
      if (sub === 'tickets' && Array.isArray(t.tickets)) {
        const tk = t.tickets.find((x) => String(x.id) === String(t.activeTicketId)) || t.tickets[0];
        if (tk && Array.isArray(tk.items)) {
          const it = tk.items.find((x) => String(x.itemId) === String(tk.activeItemId)) || tk.items[tk.activeItemIdx || 0] || tk.items[0];
          strokes = it?.strokes || it?.loads || it?.hits || null;
        }
      } else if (sub === 'free' && t.free) strokes = t.free.strokes || t.free.loads || null;
      else if (sub === 'audit' && t.audit) strokes = t.audit.strokes || t.audit.loads || null;
      if (Array.isArray(strokes) && strokes.length > 0) return strokes.length;
    } catch {}
    try {
      let step = Number(t.loadSize || t.step || 0);
      if (!(step > 0)) {
        const m = (document.getElementById('viewRoot')?.textContent || '').match(/1\s*=\s*(\d+)/);
        if (m) step = Number(m[1]);
      }
      if (step > 0 && rawSpokenQty > 0) return Math.max(1, Math.round(rawSpokenQty / step));
    } catch {}
    return 0;
  }

  function formatVoicePhrase(totalQty, clicksNum, mode, lang) {
    const val = (mode === 'clicks' && clicksNum > 0) ? clicksNum : totalQty;
    const vs = ('speechSynthesis' in global) ? (global.speechSynthesis.getVoices() || []) : [];
    if (lang === 'am') {
      const amV = vs.find((v) => (v.lang || '').toLowerCase().startsWith('am'));
      if (amV) return { voice: amV, lang: 'am-ET', text: (mode === 'both' && clicksNum > 0) ? `ሸክም ${clicksNum}፣ ${totalQty}` : String(val) };
      return { voice: null, lang: 'en-US', text: (mode === 'both' && clicksNum > 0) ? `shekim ${numToAmPhonetic(clicksNum)}, ${numToAmPhonetic(totalQty)}` : numToAmPhonetic(val) };
    }
    const matchV = vs.find((v) => (v.lang || '').toLowerCase().startsWith(lang.slice(0, 2).toLowerCase())) || null;
    return { voice: matchV, lang, text: (mode === 'both' && clicksNum > 0) ? `Load ${clicksNum}, ${totalQty}` : String(val) };
  }

  function installVoiceInterceptor() {
    if (!('speechSynthesis' in global)) return;
    if (!global._keOrigSpeak) global._keOrigSpeak = global.speechSynthesis.speak.bind(global.speechSynthesis);
    global.speechSynthesis.speak = function (utt) {
      try {
        // KoraTallyPro ሲሠራ የራሱን የድምፅ ስቱዲዮና ቅንብር ስለሚጠቀም አንጋፋበትም
        if (hasState() && state.activeMainTab === 'tally' && !document.body.classList.contains('ktp-active') && utt && utt.text && !utt._keBypass) {
          ensureEntState();
          const mode = state.cfg.voiceReadMode || 'clicks';
          const lang = state.cfg.voiceLang || 'am';
          const rawNum = Number(String(utt.text).replace(/[^\d.]/g, ''));
          if (!Number.isNaN(rawNum) && rawNum > 0) {
            const clicksNum = getExactActiveLoadClicks(rawNum);
            const built = formatVoicePhrase(rawNum, clicksNum, mode, lang);
            if (built.voice) utt.voice = built.voice;
            utt.lang = built.lang;
            utt.text = built.text;
          }
        }
      } catch {}
      return global._keOrigSpeak(utt);
    };
  }

  function testVoiceSample() {
    if (!('speechSynthesis' in global)) { showToast(L('ድምፅ አይደገፍም', 'Speech unsupported'), true); return; }
    ensureEntState();
    const built = formatVoicePhrase(20, 4, state.cfg.voiceReadMode || 'clicks', state.cfg.voiceLang || 'am');
    global.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(built.text);
    u._keBypass = true;
    if (built.voice) u.voice = built.voice;
    u.lang = built.lang;
    (global._keOrigSpeak || global.speechSynthesis.speak.bind(global.speechSynthesis))(u);
  }

  // ---------------------------------------------------------------------------
  // 4. Self-Healing Topbar + 🔔 Notification Bell + 1-Screen Tally Measure
  // ---------------------------------------------------------------------------
  let capturedNotifBtns = [];
  let cachedRealLockBtn = null;
  let cachedRealCfgBtn = null;

  function syncTopbarAndNotifications() {
    const topbar = document.querySelector('.topbar');
    const row1 = document.querySelector('.topbar .topbar-row');
    if (!topbar || !row1) return;

    row1.querySelectorAll('button').forEach((btn) => {
      if (btn.id === 'btnNotifBell' || btn.id === 'keNotifBell') return;
      const txt = (btn.textContent || '').trim();
      const oc = btn.getAttribute('onclick') || '';
      if (/^(እንግሊዝኛ|አማርኛ|english|amharic|am|en)$/i.test(txt) || oc.includes('toggleLang')) {
        btn.classList.add('ke-hidden-el');
      }
    });

    let brand = document.getElementById('keBrandBox');
    if (!brand) {
      brand = document.createElement('div');
      brand.id = 'keBrandBox';
      brand.className = 'ke-brand-box';
      const menuBtn = row1.querySelector('button');
      if (menuBtn && menuBtn.nextSibling) row1.insertBefore(brand, menuBtn.nextSibling);
      else row1.prepend(brand);
    }
    const org = (hasState() && state.orgName) ? state.orgName : L('ኮራ ስቶክ', 'Kora Stock');
    brand.innerHTML = `<div class="ke-brand-txt"><b>${sEsc(org)}</b><small>${sEsc(L('ትክክለኛ የስቶክ ቆጠራ', 'Precision Stock Tally'))}</small></div>`;

    const scopeSel = topbar.querySelector('.scope-sel, select[id*="branch" i], select[id*="scope" i]');
    if (scopeSel && scopeSel.parentElement !== row1) row1.appendChild(scopeSel);

    const oldDot = document.getElementById('keNetDot');
    if (oldDot && !oldDot.closest('.ke-bell-btn')) oldDot.remove();

    capturedNotifBtns = [];
    let notifCount = 0;
    const scanContainers = [document.querySelector('.viewport'), document.getElementById('viewRoot')].filter(Boolean);
    scanContainers.forEach((cont) => {
      Array.from(cont.children).forEach((el) => {
        if (el.id === 'viewRoot') return;
        const txt = (el.textContent || '').trim();
        const isBanner =
          txt.includes('ለእርስዎ የመጡ') ||
          /assigned to you|pending action|tasks for you|action required/i.test(txt) ||
          (/ርክክብ የሚጠብቁ/.test(txt) && /ክፍያ ፈጽም/.test(txt));
        if (isBanner && !/ቁጠር|count/i.test(txt)) {
          el.classList.add('ke-hidden-el');
          el.querySelectorAll('button').forEach((b) => {
            const label = (b.textContent || '').trim();
            if (!label) return;
            capturedNotifBtns.push({ label, el: b });
            const m = label.match(/\((\d+)\)/);
            notifCount += m ? Number(m[1]) : 1;
          });
        }
      });
    });

    if (notifCount === 0 && hasState()) {
      const openGp = (state.gatePasses || []).filter((g) => g.status !== 'EXITED').length;
      const openDsp = (state.dispatchOrders || []).filter((o) => o.status !== 'delivered').length;
      notifCount = openGp + openDsp;
    }

    const proBell = document.getElementById('btnNotifBell');
    let bell = document.getElementById('keNotifBell');
    if (proBell) {
      proBell.classList.add('ke-bell-btn');
      if (proBell.parentElement !== row1) row1.appendChild(proBell);
      if (bell) bell.remove();
      bell = proBell;
    } else {
      if (!bell) {
        bell = document.createElement('button');
        bell.id = 'keNotifBell'; bell.type = 'button'; bell.className = 'ke-bell-btn';
        bell.onclick = () => openNotifCenterModal();
        row1.appendChild(bell);
      } else if (bell.parentElement !== row1) row1.appendChild(bell);
      bell.innerHTML = `🔔${notifCount > 0 ? `<span class="ke-bell-badge">${notifCount}</span>` : ''}<span class="ke-net-dot ${navigator.onLine ? '' : 'off'}"></span>`;
    }
    if (bell && !bell.querySelector('.ke-net-dot')) {
      bell.insertAdjacentHTML('beforeend', `<span class="ke-net-dot ${navigator.onLine ? '' : 'off'}"></span>`);
    }
    const dotEl = bell?.querySelector('.ke-net-dot');
    if (dotEl) dotEl.classList.toggle('off', !navigator.onLine);

    const subBar = document.getElementById('subTabsBar');
    if (subBar) {
      let wrap = subBar.parentElement;
      if (!wrap || !wrap.classList.contains('ke-sub-wrap')) {
        wrap = document.createElement('div'); wrap.className = 'ke-sub-wrap';
        subBar.parentElement.insertBefore(wrap, subBar);
        wrap.appendChild(subBar);
      }
      let tools = document.getElementById('keTallyTools');
      if (!tools) {
        tools = document.createElement('div'); tools.id = 'keTallyTools'; tools.className = 'ke-tally-tools';
        tools.innerHTML = `
          <button id="keTopLockBtn" type="button" class="ke-tool-btn" onclick="KoraEnt.triggerTallyLock()">🔓</button>
          <button id="keTopCfgBtn" type="button" class="ke-tool-btn" onclick="KoraEnt.triggerTallyCfg()">⚙️</button>`;
        wrap.appendChild(tools);
      }
    }
  }

  function openNotifCenterModal() {
    const itemsHtml = capturedNotifBtns.length
      ? capturedNotifBtns.map((b, idx) => `<button type="button" class="btn primary" style="width:100%;justify-content:space-between;" onclick="KoraEnt.clickNotifBtn(${idx})"><span>🔔 ${sEsc(b.label)}</span><span>➔</span></button>`).join('')
      : '';
    const openDsp = (state.dispatchOrders || []).filter((o) => o.status !== 'delivered');
    const openGp = (state.gatePasses || []).filter((g) => g.status !== 'EXITED');

    openModal(`🔔 ${L('የማሳወቂያ እና ትዕዛዞች ማዕከል', 'Notifications & Tasks')}`, `
      <div style="display:flex;flex-direction:column;gap:7px;">
        ${itemsHtml}
        ${openDsp.length ? `<div class="sub-card"><div class="card-row"><b>🚚 ${sEsc(L('ክፍት የማጓጓዣ ትዕዛዞች', 'Active Dispatch'))}</b><span class="pill amber">${openDsp.length}</span></div><button type="button" class="btn muted sm" style="margin-top:4px;width:100%;" onclick="closeModal();switchMainTab('dispatch');">➔ ${sEsc(L('ማጓጓዣ ክፈት', 'Open Dispatch'))}</button></div>` : ''}
        ${openGp.length ? `<div class="sub-card"><div class="card-row"><b>🛂 ${sEsc(L('ክፍት የመውጫ ፈቃዶች', 'Open Gate Passes'))}</b><span class="pill teal">${openGp.length}</span></div><button type="button" class="btn muted sm" style="margin-top:4px;width:100%;" onclick="closeModal();state.activeSubTab.dispatch='gatepass';switchMainTab('dispatch');">➔ ${sEsc(L('መውጫ ፈቃድ ክፈት', 'Open Gate Passes'))}</button></div>` : ''}
        ${!itemsHtml && !openDsp.length && !openGp.length ? `<div class="sub-card" style="text-align:center;color:var(--muted);padding:16px;">✅ ${sEsc(L('አዲስ ማሳወቂያ የለም', 'No pending alerts'))}</div>` : ''}
      </div>`, `<button type="button" class="btn teal" onclick="closeModal()">${sEsc(L('ዝጋ', 'Close'))}</button>`);
  }

  function measureBottomNav() {
    const direct = document.querySelector('.bnav, .bottom-nav, #bottomNav, nav.nav, nav[class*="bottom" i]');
    if (direct) {
      const r = direct.getBoundingClientRect();
      if (r.height >= 40 && r.top > window.innerHeight * 0.6) return { navEl: direct, navTop: r.top };
    }
    let navEl = null, navTop = window.innerHeight;
    const sels = 'nav, footer, [id*="nav" i], [id*="tab" i], [class*="nav" i], [class*="tabbar" i], [class*="bottom" i]';
    document.querySelectorAll(sels).forEach((el) => {
      if (el.closest('#viewRoot') || el.closest('#modalOverlay') || el.closest('.modal') || el.closest('.drawer')) return;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      const r = el.getBoundingClientRect();
      if (r.height >= 42 && r.height <= 120 && r.bottom >= window.innerHeight - 36 && r.top > window.innerHeight * 0.65 && r.width > window.innerWidth * 0.6) {
        if (r.top < navTop) { navTop = r.top; navEl = el; }
      }
    });
    return { navEl, navTop: navEl ? navTop : window.innerHeight - 78 };
  }

  function applyTallyLayoutAndModes() {
    syncTopbarAndNotifications();

    const vp = document.querySelector('.viewport');
    const root = document.getElementById('viewRoot');
    if (!hasState() || state.activeMainTab !== 'tally') {
      document.body.classList.remove('ke-tally');
      document.documentElement.style.removeProperty('--ke-tally-h');
      if (vp) vp.style.paddingBottom = '';
      if (root) root.style.minHeight = '';
      return;
    }

    // መጀመሪያ ክላሱን መጨመር — ድርቡ ታብ ወዲያውኑ ስለሚደበቅ ትክክለኛው vpRect.top ይለካል!
    document.body.classList.add('ke-tally');
    if (!root || !vp) return;

    const { navTop } = measureBottomNav();
    const vpRect = vp.getBoundingClientRect();

    // KoraTallyPro ንቁ ከሆነ ትክክለኛውን የ1-ስክሪን ቁመት ብቻ መስጠት (ከታችኛው ዳሰሳ 4px በላይ!)
    if (document.body.classList.contains('ktp-active')) {
      const exactH = Math.max(360, Math.floor(navTop - vpRect.top - 4));
      document.documentElement.style.setProperty('--ke-tally-h', exactH + 'px');
      root.style.minHeight = '';
      vp.style.paddingBottom = '';
      return;
    }

    // Fallback: KoraTallyPro ከሌለ ለነባሩ ቆጠራ
    const modeMap = [
      { flag: 'tallyPhoto',  keys: ['ፎቶ', 'photo'] },
      { flag: 'tallyPack',   keys: ['ጥቅል', 'pack'] },
      { flag: 'tallyWeight', keys: ['ሚዛን', 'weight', 'scale'] },
      { flag: 'tallyCamera', keys: ['ካሜራ', 'camera'] }
    ];
    let switchedBack = false;
    root.querySelectorAll('.seg').forEach((container) => {
      const btns = Array.from(container.querySelectorAll('button'));
      let matchedAny = false, visibleCount = 0, disabledWasActive = false, counterBtn = null;
      btns.forEach((btn, idx) => {
        const txt = (btn.textContent || '').trim().toLowerCase();
        if (idx === 0 || txt.includes('መቁጠሪያ') || txt.includes('counter')) counterBtn = btn;
        const hit = modeMap.find((m) => m.keys.some((k) => txt.includes(k)));
        if (hit) {
          matchedAny = true;
          const on = state.cfg[hit.flag] !== false;
          const isAct = btn.classList.contains('active') || btn.classList.contains('teal') || btn.classList.contains('primary');
          if (!on && isAct) disabledWasActive = true;
          btn.style.display = on ? '' : 'none';
          if (on) visibleCount++;
        } else visibleCount++;
      });
      if (matchedAny) {
        if (disabledWasActive && counterBtn && !switchedBack) { switchedBack = true; setTimeout(() => counterBtn.click(), 0); }
        container.style.display = visibleCount <= 1 ? 'none' : '';
      }
    });

    cachedRealLockBtn = null; cachedRealCfgBtn = null;
    root.querySelectorAll('.card, .sub-card').forEach((card) => {
      const txt = card.textContent || '';
      if (/በአንድ ሸክም|per load/i.test(txt) && /\+10/.test(txt)) {
        card.querySelectorAll('button').forEach((b) => {
          const bt = (b.textContent || '').trim();
          if (bt.includes('🔒') || bt.includes('🔓')) { cachedRealLockBtn = b; b.classList.add('ke-hidden-el'); }
          else if (bt.includes('⚙')) { cachedRealCfgBtn = b; b.classList.add('ke-hidden-el'); }
        });
      }
    });
    const topLock = document.getElementById('keTopLockBtn');
    if (topLock && cachedRealLockBtn) {
      const isLocked = cachedRealLockBtn.classList.contains('locked') || (cachedRealLockBtn.textContent || '').includes('🔒');
      topLock.textContent = isLocked ? '🔒' : '🔓';
      topLock.classList.toggle('locked', cachedRealLockBtn.classList.contains('locked'));
    }

    const overlap = Math.max(0, Math.ceil(vpRect.bottom - navTop));
    vp.style.paddingBottom = (overlap > 0 ? overlap + 8 : 6) + 'px';
    if (state.activeSubTab?.tally === 'history') { root.style.minHeight = ''; return; }
    root.style.minHeight = Math.max(320, Math.floor(navTop - vpRect.top - 10)) + 'px';

    let container = root;
    if (root.children.length === 1 && root.firstElementChild.children.length >= 2) {
      container = root.firstElementChild;
      container.style.display = 'flex'; container.style.flexDirection = 'column';
      container.style.flex = '1 1 auto'; container.style.gap = '4px';
    }
    let dockEl = null, boardEl = null;
    Array.from(container.children).forEach((el) => {
      if (el.classList.contains('ke-hidden-el')) return;
      el.classList.remove('ke-board-grow', 'ke-dock-flush');
      el.querySelectorAll('.ke-round-center').forEach((c) => c.classList.remove('ke-round-center'));
      const txt = el.textContent || '';
      if (el.classList.contains('tally-sticky-dock') || (/(መልስ|undo)/i.test(txt) && /(አጽዳ|clear)/i.test(txt))) dockEl = el;
      else if (/(×10|0\/10|10\s*\(|ቆጠራው ተቆልፏል|tally paused|ለመቁጠር ዝግጁ|የተቆጠረ|የተጫነ|counted)/i.test(txt) && !(/\+15/.test(txt) && /\+20/.test(txt))) boardEl = el;
    });
    if (dockEl) dockEl.classList.add('ke-dock-flush');
    if (boardEl) {
      boardEl.classList.add('ke-board-grow');
      Array.from(boardEl.children).forEach((ch) => {
        const t = ch.textContent || '';
        if (/(×10|\/10|ቆጠራው ተቆልፏል|tally paused)/i.test(t) && !/(የተቆጠረ|የተጫነ|counted)/i.test(t)) ch.classList.add('ke-round-center');
      });
    }
  }

  function injectIntoTallySettingsModal() {
    if (!hasState() || document.body.classList.contains('ktp-active')) return;
    ensureEntState();
    const modal = document.querySelector('#modalOverlay.open, .modal-bg.open, .modal-backdrop.open, #modalCard, .modal-card, .modal');
    if (!modal) return;
    const fullText = modal.textContent || '';
    if (!(fullText.includes('የቆጠራ ቅንብር') || fullText.toLowerCase().includes('tally setting')) || modal.querySelector('[data-ke-tmodes]')) return;

    const swRows = modal.querySelectorAll('.switch-row');
    if (!swRows.length) return;
    const switchBox = swRows[swRows.length - 1].parentElement;
    if (!switchBox) return;

    const wrap = document.createElement('div');
    wrap.setAttribute('data-ke-tmodes', '1');
    wrap.innerHTML = `
      <hr class="ke-modal-sep">
      <div class="ke-modal-hdr">🎛️ ${sEsc(L('የቆጠራ ሙዶች ማብሪያና ማጥፊያ', 'Tally Modes On/Off'))}</div>
      ${[
        ['tallyPhoto',  L('📷 ፎቶ ቆጠራ', '📷 Photo Count')],
        ['tallyPack',   L('📦 ጥቅልና ፍሬ ቆጠራ', '📦 Pack & Piece')],
        ['tallyWeight', L('⚖️ ሚዛን ቆጠራ', '⚖️ Weight Scale')],
        ['tallyCamera', L('🎥 የካሜራ በር ቆጣሪ', '🎥 Camera Tripwire')]
      ].map(([k, lbl]) => `
        <div class="switch-row">
          <span>${sEsc(lbl)}</span>
          <div class="toggle ${state.cfg[k] !== false ? 'on' : ''}" onclick="KoraEnt.toggleTallyMode('${k}',this)"></div>
        </div>`).join('')}

      <hr class="ke-modal-sep">
      <div class="card-row" style="margin-bottom:4px;">
        <div class="ke-modal-hdr" style="margin:0;">🔊 ${sEsc(L('የድምፅ ንባብ ምርጫ እና ቋንቋ', 'Voice Readout & Language'))}</div>
        <button type="button" class="btn muted sm" style="height:24px;padding:0 8px;font-size:10px;" onclick="KoraEnt.testVoiceSample()">▶️ ${sEsc(L('ሞክር', 'Test'))}</button>
      </div>
      <div class="grid-2" style="gap:6px;">
        <div>
          <label class="lbl" style="font-size:10px;">${sEsc(L('ምን ይናገር?', 'Readout'))}</label>
          <select class="sel" style="height:31px;font-size:11px;" onchange="state.cfg.voiceReadMode=this.value;saveState();">
            <option value="clicks" ${state.cfg.voiceReadMode === 'clicks' ? 'selected' : ''}>${sEsc(L('የሸክም / ክሊክ ቁጥር (1, 2, 3...)', 'Load / Click # (1, 2, 3...)'))}</option>
            <option value="qty" ${state.cfg.voiceReadMode === 'qty' ? 'selected' : ''}>${sEsc(L('የተጫነ ብዛት (5, 10, 15...)', 'Total Qty (5, 10, 15...)'))}</option>
            <option value="both" ${state.cfg.voiceReadMode === 'both' ? 'selected' : ''}>${sEsc(L('ሁለቱንም (ሸክም 4 — 20)', 'Both (Load 4 — 20)'))}</option>
          </select>
        </div>
        <div>
          <label class="lbl" style="font-size:10px;">${sEsc(L('የድምፅ ቋንቋ', 'Language'))}</label>
          <select class="sel" style="height:31px;font-size:11px;" onchange="state.cfg.voiceLang=this.value;saveState();">
            <option value="am" ${state.cfg.voiceLang === 'am' ? 'selected' : ''}>🇪🇹 አማርኛ (Amharic)</option>
            <option value="en-US" ${state.cfg.voiceLang === 'en-US' ? 'selected' : ''}>🇬🇧 English</option>
            <option value="ar-SA" ${state.cfg.voiceLang === 'ar-SA' ? 'selected' : ''}>🇸🇦 العربية</option>
          </select>
        </div>
      </div>`;
    switchBox.appendChild(wrap);
  }

  // ---------------------------------------------------------------------------
  // 5. ኦፍላይን QR ኮድ SVG ሠሪ
  // ---------------------------------------------------------------------------
  function buildOfflineQrSvg(text) {
    const str = String(text || 'KORA');
    const size = 21;
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) { hash ^= str.charCodeAt(i); hash = Math.imul(hash, 16777619); }
    const isFinder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);
    let rects = '';
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        let on = false;
        if (isFinder(r, c)) {
          const lr = r < 7 ? r : r - (size - 7), lc = c < 7 ? c : c - (size - 7);
          on = (lr === 0 || lr === 6 || lc === 0 || lc === 6 || (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4));
        } else {
          on = (((hash >>> ((r * 5 + c * 3) % 24)) ^ (str.charCodeAt((r + c) % str.length) >> (c % 5))) & 1) === 1;
        }
        if (on) rects += `<rect x="${c}" y="${r}" width="1" height="1" fill="#060a12"/>`;
      }
    }
    return `<svg class="ke-qr-svg" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg"><rect width="${size}" height="${size}" fill="#fff"/>${rects}</svg>`;
  }

  // ---------------------------------------------------------------------------
  // 6. ዘመናዊ ገበያ / ማስታወቂያ (Kora Market)
  // ---------------------------------------------------------------------------
  let mktCat = 'all', mktSort = 'new', mktQuery = '', adPhotoDraft = '';

  function buildMarketCatalog() {
    const items = [];
    if (state.cfg.marketShowAds !== false) (state.marketAds || []).forEach((ad) => items.push({ ...ad, isCustom: true }));
    if (state.cfg.marketShowMine !== false) {
      (state.inventory || []).forEach((it) => {
        const qty = typeof getItemStock === 'function' ? getItemStock(it, 'all') : Number(it.stock || 0);
        items.push({
          id: 'inv_' + it.id, title: it.name, category: it.category || L('ጠቅላላ', 'General'),
          price: Number(it.sellPrice || 0), oldPrice: 0,
          unit: typeof getUnitLabel === 'function' ? getUnitLabel(it) : (it.unit || ''),
          moq: 1, stockStatus: qty > 10 ? 'IN_STOCK' : (qty > 0 ? 'LOW' : 'OUT'),
          seller: state.orgName || 'ኮራ ስቶክ', city: state.branches?.[0]?.name || 'አዲስ አበባ',
          phone: state.orgPhone || '0911000000', telegram: '', featured: false, photo: it.photo || ''
        });
      });
    }
    return items;
  }

  function renderModernMarket(root) {
    ensureEntState();
    const all = buildMarketCatalog();
    const cats = [...new Set(all.map((x) => x.category).filter(Boolean))];
    const featured = all.filter((x) => x.featured || (x.oldPrice > x.price));

    let list = all.filter((x) => {
      if (mktCat !== 'all' && x.category !== mktCat) return false;
      if (mktQuery && !`${x.title} ${x.category} ${x.seller} ${x.city}`.toLowerCase().includes(mktQuery.toLowerCase())) return false;
      return true;
    });
    if (mktSort === 'low') list.sort((a, b) => a.price - b.price);
    else if (mktSort === 'high') list.sort((a, b) => b.price - a.price);

    root.innerHTML = `
      <div class="card-row" style="gap:6px;">
        <input class="inp sm" style="flex:1;" value="${sEsc(mktQuery)}" placeholder="🔍 ${sEsc(L('ምርት ወይም ሻጭ ፈልግ...', 'Search market...'))}" oninput="KoraEnt.setMktQuery(this.value)">
        <select class="sel" style="width:105px;height:32px;font-size:11px;" onchange="KoraEnt.setMktSort(this.value)">
          <option value="new" ${mktSort === 'new' ? 'selected' : ''}>${sEsc(L('አዲስ', 'Newest'))}</option>
          <option value="low" ${mktSort === 'low' ? 'selected' : ''}>${sEsc(L('ርካሽ ዋጋ', 'Price: Low'))}</option>
          <option value="high" ${mktSort === 'high' ? 'selected' : ''}>${sEsc(L('ከፍተኛ ዋጋ', 'Price: High'))}</option>
        </select>
        <button type="button" class="icon-btn sm" onclick="KoraEnt.openMarketSettings()">⚙️</button>
      </div>
      <div class="card-row">
        <div class="subtabs no-scrollbar" style="flex:1;">
          <button type="button" class="subtab ${mktCat === 'all' ? 'active' : ''}" onclick="KoraEnt.setMktCat('all')">${sEsc(L('ሁሉም', 'All'))} (${all.length})</button>
          ${cats.map((c) => `<button type="button" class="subtab ${mktCat === c ? 'active' : ''}" onclick="KoraEnt.setMktCat('${sEsc(c)}')">${sEsc(c)}</button>`).join('')}
        </div>
        <button type="button" class="btn teal sm" onclick="KoraEnt.openNewAdModal()">+ ${sEsc(L('ማስታወቂያ', 'Post Ad'))}</button>
      </div>
      ${featured.length ? `
        <div class="ke-mkt-hero no-scrollbar">
          ${featured.map((f) => {
            const pct = f.oldPrice > f.price ? Math.round(((f.oldPrice - f.price) / f.oldPrice) * 100) : 0;
            return `
              <div class="ke-hero-card">
                <div class="card-row"><span class="pill amber">⭐ ${sEsc(L('ተለይቶ የቀረበ', 'Featured'))}</span>${pct > 0 ? `<span class="pill rose">-${pct}%</span>` : ''}</div>
                <b style="font-size:13.5px;">${sEsc(f.title)}</b>
                <div style="display:flex;align-items:baseline;gap:6px;">
                  <b style="color:#2dd4bf;font-size:15px;font-family:ui-monospace,monospace;">${sMoney(f.price)}</b>
                  ${f.oldPrice > f.price ? `<span style="font-size:11px;color:var(--muted);text-decoration:line-through;">${sNum(f.oldPrice)}</span>` : ''}
                  <span style="font-size:10px;color:var(--muted);">/ ${sEsc(f.unit)}</span>
                </div>
                <div style="font-size:10px;color:var(--muted);">🏢 ${sEsc(f.seller)} · 📍 ${sEsc(f.city)}</div>
              </div>`;
          }).join('')}
        </div>` : ''}
      <div class="ke-mkt-grid">
        ${list.map((ad) => {
          const pct = ad.oldPrice > ad.price ? Math.round(((ad.oldPrice - ad.price) / ad.oldPrice) * 100) : 0;
          const stTxt = ad.stockStatus === 'OUT' ? L('አልቋል', 'Out') : (ad.stockStatus === 'LOW' ? L('ውስን', 'Low') : L('አለ', 'In Stock'));
          const cleanPhone = String(ad.phone || '').replace(/[^\d+]/g, '');
          return `
            <div class="ke-ad-card">
              <div class="ke-ad-img">
                ${ad.photo ? `<img src="${ad.photo}">` : '📦'}
                ${pct > 0 ? `<span class="ke-disc">-${pct}%</span>` : ''}
                <span class="ke-stk-tag" style="${ad.stockStatus === 'OUT' ? 'color:#fca5a5;border-color:#ef4444;' : ''}">${sEsc(stTxt)}</span>
              </div>
              <div class="ke-ad-body">
                <div style="font-size:9.5px;color:var(--amber);font-weight:800;">${sEsc(ad.seller)} · ${sEsc(ad.city)}</div>
                <b style="font-size:12.5px;line-height:1.25;">${sEsc(ad.title)}</b>
                <div style="display:flex;align-items:baseline;gap:4px;"><b style="color:#38bdf8;font-size:14px;font-family:ui-monospace,monospace;">${sMoney(ad.price)}</b><span style="font-size:10px;color:var(--muted);">/ ${sEsc(ad.unit)}</span></div>
                <div style="font-size:10px;color:var(--muted);">${sEsc(L('ዝቅተኛ ግዢ', 'MOQ'))}: ${sNum(ad.moq)} ${sEsc(ad.unit)}</div>
                <div class="ke-ad-acts">
                  <a class="ke-ad-btn" href="tel:${sEsc(cleanPhone)}">📞</a>
                  <button type="button" class="ke-ad-btn" onclick="KoraEnt.msgSeller('${sEsc(ad.id)}')">💬</button>
                  <button type="button" class="ke-ad-btn buy" onclick="KoraEnt.orderFromAd('${sEsc(ad.id)}')">🛒 ${sEsc(L('እዘዝ', 'Order'))}</button>
                </div>
              </div>
            </div>`;
        }).join('') || `<div class="card" style="grid-column:1/-1;text-align:center;color:var(--muted);padding:24px;">${sEsc(L('ምንም ማስታወቂያ አልተገኘም', 'No listings'))}</div>`}
      </div>`;
  }

  function openMarketSettings() {
    openModal(`⚙️ ${L('የገበያ ቅንብር', 'Market Visibility')}`, `
      <div class="sub-card">
        <div class="switch-row"><span>${sEsc(L('ምርቶቼን በገበያ አሳይ', 'Show My Inventory'))}</span><div class="toggle ${state.cfg.marketShowMine !== false ? 'on' : ''}" onclick="state.cfg.marketShowMine=state.cfg.marketShowMine===false?true:false;saveState();this.classList.toggle('on');renderView();"></div></div>
        <div class="switch-row"><span>${sEsc(L('የገበያ ማስታወቂያዎችን አሳይ', 'Show Posted Ads'))}</span><div class="toggle ${state.cfg.marketShowAds !== false ? 'on' : ''}" onclick="state.cfg.marketShowAds=state.cfg.marketShowAds===false?true:false;saveState();this.classList.toggle('on');renderView();"></div></div>
      </div>`, `<button type="button" class="btn teal" onclick="closeModal()">${sEsc(L('ጨርስ', 'Done'))}</button>`);
  }

  function openNewAdModal() {
    adPhotoDraft = '';
    openModal(`📢 ${L('አዲስ የገበያ ማስታወቂያ አውጣ', 'Post New Ad')}`, `
      <input id="keAdTitle" class="inp" placeholder="${sEsc(L('የምርቱ ርዕስ', 'Product title'))}">
      <div class="grid-2"><input id="keAdCat" class="inp sm" placeholder="${sEsc(L('ምድብ', 'Category'))}" value="${sEsc(state.inventory?.[0]?.category || '')}"><input id="keAdUnit" class="inp sm" placeholder="${sEsc(L('መለኪያ', 'Unit'))}" value="ፍሬ"></div>
      <div class="grid-2"><input id="keAdPrice" type="number" min="0" class="inp sm mono" placeholder="${sEsc(L('የአሁን ዋጋ', 'Price'))}"><input id="keAdOld" type="number" min="0" class="inp sm mono" placeholder="${sEsc(L('የበፊት ዋጋ (ቅናሽ)', 'Old price'))}"></div>
      <div class="grid-2"><input id="keAdMoq" type="number" min="1" class="inp sm mono" value="1" placeholder="MOQ"><input id="keAdPhone" class="inp sm mono" value="${sEsc(state.orgPhone || '0911000000')}" placeholder="${sEsc(L('ስልክ', 'Phone'))}"></div>
      <div class="grid-2"><input id="keAdCity" class="inp sm" value="አዲስ አበባ" placeholder="${sEsc(L('ከተማ', 'City'))}"><input id="keAdTg" class="inp sm" placeholder="Telegram (@user)"></div>
      <div class="card-row"><label class="btn muted sm">📷 ${sEsc(L('ፎቶ ምረጥ', 'Add Photo'))}<input type="file" accept="image/*" style="display:none;" onchange="KoraEnt.onAdPhoto(this)"></label><div class="switch-row" style="gap:6px;padding:0;"><span style="font-size:11px;">⭐ ${sEsc(L('ልዩ', 'Featured'))}</span><div id="keAdFeat" class="toggle on" onclick="this.classList.toggle('on')"></div></div></div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${sEsc(L('ተው', 'Cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraEnt.saveNewAd()">${sEsc(L('ልቀቅ', 'Publish'))}</button>`);
  }

  function saveNewAd() {
    const title = (document.getElementById('keAdTitle')?.value || '').trim();
    const price = Number(document.getElementById('keAdPrice')?.value || 0);
    if (!title || price <= 0) { showToast(L('ርዕስ እና ዋጋ ያስገቡ', 'Enter title & price'), true); return; }
    const ad = {
      id: 'ad_' + Date.now(), title,
      category: (document.getElementById('keAdCat')?.value || '').trim() || L('ጠቅላላ', 'General'),
      unit: (document.getElementById('keAdUnit')?.value || '').trim() || 'ፍሬ',
      price, oldPrice: Number(document.getElementById('keAdOld')?.value || 0),
      moq: Math.max(1, Number(document.getElementById('keAdMoq')?.value || 1)),
      stockStatus: 'IN_STOCK', seller: state.orgName || 'ኮራ ስቶክ',
      city: (document.getElementById('keAdCity')?.value || '').trim() || 'አዲስ አበባ',
      phone: (document.getElementById('keAdPhone')?.value || '').trim(),
      telegram: (document.getElementById('keAdTg')?.value || '').trim().replace(/^@/, ''),
      featured: document.getElementById('keAdFeat')?.classList.contains('on') || false,
      photo: adPhotoDraft
    };
    state.marketAds.unshift(ad);
    logAudit('MARKET_AD', ad.id, `${ad.title} (${sMoney(ad.price)})`);
    saveState(); closeModal(); renderView(); showToast(L('ማስታወቂያው ተለቋል!', 'Published!'));
  }

  function msgSeller(adId) {
    const ad = buildMarketCatalog().find((x) => x.id === adId); if (!ad) return;
    const text = encodeURIComponent(`ሰላም ${ad.seller}፣ "${ad.title}" (${sMoney(ad.price)}) መግዛት እፈልጋለሁ።`);
    if (ad.telegram) window.open(`https://t.me/${ad.telegram}`, '_blank');
    else window.open(`https://wa.me/${String(ad.phone || '').replace(/[^\d]/g, '').replace(/^0/, '251')}?text=${text}`, '_blank');
  }

  function orderFromAd(adId) {
    const ad = buildMarketCatalog().find((x) => x.id === adId); if (!ad) return;
    openModal(`🛒 ${L('የግዢ ትዕዛዝ', 'Order Request')}`, `
      <div class="sub-card"><b>${sEsc(ad.title)}</b><div style="font-size:11.5px;color:#2dd4bf;">${sMoney(ad.price)} / ${sEsc(ad.unit)}</div></div>
      <div class="grid-2"><div><label class="lbl">${sEsc(L('ብዛት', 'Qty'))}</label><input id="keOrdQty" type="number" min="${ad.moq}" value="${ad.moq}" class="inp mono"></div><div><label class="lbl">${sEsc(L('አድራሻ', 'Address'))}</label><input id="keOrdAddr" class="inp" placeholder="ቦሌ / መርካቶ"></div></div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${sEsc(L('ተው', 'Cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraEnt.confirmAdOrder('${sEsc(adId)}')">${sEsc(L('ላክ', 'Send'))}</button>`);
  }

  function confirmAdOrder(adId) {
    const ad = buildMarketCatalog().find((x) => x.id === adId); if (!ad) return;
    const qty = Math.max(1, Number(document.getElementById('keOrdQty')?.value || 1));
    const addr = (document.getElementById('keOrdAddr')?.value || '').trim() || '-';
    const msg = encodeURIComponent(`🛒 የኮራ ስቶክ ትዕዛዝ\nምርት: ${ad.title}\nብዛት: ${qty} ${ad.unit}\nድምር: ${sMoney(qty * ad.price)}\nአድራሻ: ${addr}`);
    const p = String(ad.phone || '').replace(/[^\d]/g, '').replace(/^0/, '251');
    logAudit('MARKET_ORDER', ad.title, `${qty} ${ad.unit}`);
    closeModal();
    window.open(ad.telegram ? `https://t.me/${ad.telegram}` : `https://wa.me/${p}?text=${msg}`, '_blank');
  }

  // ---------------------------------------------------------------------------
  // 7. ዓለም አቀፋዊ ማጓጓዣ (ትዕዛዞች -> Live Map -> QR መውጫ ፈቃድ -> ተሽከርካሪዎች)
  // ---------------------------------------------------------------------------
  let leafletMap = null, leafletLoading = null, podPhotoData = '';

  function loadLeafletLib() {
    if (global.L && typeof global.L.map === 'function') return Promise.resolve(global.L);
    if (leafletLoading) return leafletLoading;
    leafletLoading = new Promise((resolve, reject) => {
      if (!document.getElementById('leafletCssLink')) {
        const lnk = document.createElement('link');
        lnk.id = 'leafletCssLink'; lnk.rel = 'stylesheet';
        lnk.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(lnk);
      }
      const sc = document.createElement('script');
      sc.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      sc.onload = () => resolve(global.L);
      sc.onerror = () => reject(new Error('Leaflet failed'));
      document.head.appendChild(sc);
    });
    return leafletLoading;
  }

  function haversineKm(lat1, lng1, lat2, lng2) {
    const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function renderEnterpriseOrders(root) {
    const list = state.dispatchOrders || [];
    const totalRev = list.reduce((a, o) => a + Number(o.fee || 0), 0);
    const totalCost = list.reduce((a, o) => a + Number(o.fuelCost || 0) + Number(o.driverCost || 0), 0);

    root.innerHTML = `
      <div class="ke-kpi-2">
        <div class="kpi"><span class="kpi-lbl">${sEsc(L('ትዕዛዞች', 'Orders'))}</span><span class="kpi-val">${list.length}</span></div>
        <div class="kpi emerald"><span class="kpi-lbl">${sEsc(L('የጉዞ የተጣራ ትርፍ', 'Net Trip Profit'))}</span><span class="kpi-val">${sMoney(totalRev - totalCost)}</span></div>
      </div>
      <div class="card-row">
        <button type="button" class="btn teal sm" onclick="KoraEnt.openNewOrderModal()">+ ${sEsc(L('አዲስ የማጓጓዣ ትዕዛዝ', 'New Order'))}</button>
        <span class="pill">${list.filter((o) => o.status !== 'delivered').length} ${sEsc(L('ክፍት', 'Active'))}</span>
      </div>
      <div class="cards-grid">
        ${list.map((o) => {
          const stIdx = Math.max(0, TMS_STAGES.findIndex((s) => s.k === o.status));
          const stObj = TMS_STAGES[stIdx] || TMS_STAGES[0];
          const net = Number(o.fee || 0) - Number(o.fuelCost || 0) - Number(o.driverCost || 0);
          const nextStage = TMS_STAGES[stIdx + 1];
          const dist = haversineKm(o.pickupLat || 8.9125, o.pickupLng || 38.7652, o.dropLat || 9.01, o.dropLng || 38.79).toFixed(1);
          const drvObj = (state.fleet || []).find((f) => f.driver === o.driver);
          return `
            <div class="card" style="${o.status === 'delivered' ? 'opacity:0.68;' : ''}">
              <div class="card-row"><b style="font-family:ui-monospace,monospace;color:var(--teal);">${sEsc(o.orderNo)}</b><span class="pill ${stObj.col}">${sEsc(isAm() ? stObj.am : stObj.en)}</span></div>
              <b>${sEsc(o.item)} · ${sEsc(o.qty)}</b>
              <div style="font-size:11px;color:var(--muted);">📍 ${sEsc(o.pickup)} ➔ ${sEsc(o.dropoff)} · <b>${dist} ኪ.ሜ</b></div>
              <div class="ke-steps">${TMS_STAGES.map((_, idx) => `<div class="ke-st-bar ${idx <= stIdx ? 'on' : ''}"></div>`).join('')}</div>
              <div class="card-row" style="font-size:11px;">
                <span>🚚 ${sEsc(o.driver || L('ሹፌር አልተመደበም', 'Unassigned'))} ${o.plate ? `(${sEsc(o.plate)})` : ''}</span>
                <b style="color:${net >= 0 ? '#34d399' : '#fb7185'};font-family:ui-monospace,monospace;">${sMoney(o.fee)} ${o.fuelCost || o.driverCost ? `(${L('ትርፍ', 'Net')}: ${sNum(net)})` : ''}</b>
              </div>
              ${o.status !== 'delivered' && o.otp ? `<div class="pill amber">${sEsc(L('የርክክብ ኮድ (OTP)', 'POD OTP'))}: <b>${sEsc(o.otp)}</b></div>` : ''}
              <div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:2px;">
                ${o.status === 'open' ? `<button type="button" class="btn primary sm" style="flex:1;" onclick="KoraEnt.openAssignDriverModal(${o.id})">🚚 ${sEsc(L('ሹፌር መድብ', 'Assign'))}</button>` : ''}
                ${nextStage && o.status !== 'open' && nextStage.k !== 'delivered' ? `<button type="button" class="btn teal sm" style="flex:1;" onclick="KoraEnt.advanceOrder(${o.id},'${nextStage.k}')">➔ ${sEsc(isAm() ? nextStage.am : nextStage.en)}</button>` : ''}
                ${o.status !== 'open' && o.status !== 'delivered' ? `<button type="button" class="btn emerald sm" style="flex:1;" onclick="KoraEnt.openPodModal(${o.id})">✅ ${sEsc(L('ርክክብ (POD)', 'POD'))}</button>` : ''}
                <button type="button" class="btn muted sm" onclick="KoraEnt.openCostModal(${o.id})">⛽</button>
                ${drvObj?.phone ? `<a class="btn muted sm" style="text-decoration:none;" href="tel:${sEsc(drvObj.phone)}">📞</a>` : ''}
                <a class="btn muted sm" style="text-decoration:none;" target="_blank" href="https://www.google.com/maps/dir/?api=1&destination=${o.dropLat || 9.01},${o.dropLng || 38.79}">🧭</a>
              </div>
            </div>`;
        }).join('') || `<div class="card" style="text-align:center;color:var(--muted);">${sEsc(L('ምንም ትዕዛዝ የለም', 'No orders'))}</div>`}
      </div>`;
  }

  function renderGoogleLikeLiveMap(root) {
    ensureEntState();
    const activeOrd = (state.dispatchOrders || []).find((o) => o.status !== 'delivered');
    const distKm = activeOrd ? haversineKm(activeOrd.pickupLat, activeOrd.pickupLng, activeOrd.dropLat, activeOrd.dropLng) : 0;
    const etaMin = activeOrd ? Math.max(8, Math.round((distKm / 28) * 60)) : 0;

    root.innerHTML = `
      <div class="ke-map-ctrl">
        <div class="seg" style="flex:1;">
          <button type="button" class="seg-btn ${state.cfg.mapLayer === 'street' ? 'teal' : ''}" onclick="KoraEnt.setMapLayer('street')">🗺️ ${sEsc(L('መንገድ', 'Street'))}</button>
          <button type="button" class="seg-btn ${state.cfg.mapLayer === 'sat' ? 'teal' : ''}" onclick="KoraEnt.setMapLayer('sat')">🛰️ ${sEsc(L('ሳተላይት', 'Satellite'))}</button>
          <button type="button" class="seg-btn ${state.cfg.mapLayer === 'dark' ? 'teal' : ''}" onclick="KoraEnt.setMapLayer('dark')">🌙 ${sEsc(L('ጨለማ', 'Dark'))}</button>
        </div>
        <button type="button" class="btn teal sm" onclick="KoraEnt.shareMyGps()">📍 ${sEsc(L('የእኔ GPS', 'My GPS'))}</button>
      </div>
      ${activeOrd ? `
        <div class="ke-route-strip">
          <div class="kpi"><span class="kpi-lbl">${sEsc(L('ንቁ ጉዞ', 'Active'))}</span><span class="kpi-val" style="font-size:13px;">${sEsc(activeOrd.orderNo)}</span></div>
          <div class="kpi teal"><span class="kpi-lbl">${sEsc(L('ርቀት', 'Distance'))}</span><span class="kpi-val" style="font-size:13px;">${distKm.toFixed(1)} ኪ.ሜ</span></div>
          <div class="kpi emerald"><span class="kpi-lbl">${sEsc(L('ግምት ሰዓት', 'ETA'))}</span><span class="kpi-val" style="font-size:13px;">~${etaMin} ደቂቃ</span></div>
        </div>` : ''}
      <div id="keLeafletMap" class="ke-map-box">
        <div style="height:100%;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:12px;">🌍 ${sEsc(L('ካርታ በመጫን ላይ...', 'Loading live map...'))}</div>
      </div>
      ${activeOrd ? `
        <div class="card-row">
          <span style="font-size:11px;color:var(--muted);">📍 ${sEsc(activeOrd.pickup)} ➔ ${sEsc(activeOrd.dropoff)}</span>
          <a class="btn primary sm" style="text-decoration:none;" target="_blank" href="https://www.google.com/maps/dir/?api=1&origin=${activeOrd.pickupLat},${activeOrd.pickupLng}&destination=${activeOrd.dropLat},${activeOrd.dropLng}">🧭 ${sEsc(L('Google Maps አቅጣጫ', 'Google Maps Nav'))}</a>
        </div>` : ''}`;

    loadLeafletLib().then((Lf) => {
      const el = document.getElementById('keLeafletMap'); if (!el) return;
      if (leafletMap) { try { leafletMap.remove(); } catch {} leafletMap = null; }
      el.innerHTML = '';
      leafletMap = Lf.map(el, { zoomControl: true }).setView([8.985, 38.765], 12);
      const tileUrls = {
        street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        sat: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      };
      Lf.tileLayer(tileUrls[state.cfg.mapLayer || 'street'], { maxZoom: 19, attribution: '© OSM / Kora Stock' }).addTo(leafletMap);
      const bounds = [];
      (state.branches || []).forEach((b) => {
        const ico = Lf.divIcon({ className: '', html: `<div style="background:#0f172a;border:2px solid #14b8a6;color:#5eead4;border-radius:10px;padding:3px 7px;font-size:11px;font-weight:900;white-space:nowrap;box-shadow:0 2px 10px #000;">🏢 ${sEsc(b.name)}</div>`, iconAnchor: [35, 14] });
        Lf.marker([b.lat, b.lng], { icon: ico }).addTo(leafletMap).bindPopup(`<b>🏢 ${sEsc(b.name)}</b>`);
        bounds.push([b.lat, b.lng]);
      });
      (state.fleet || []).forEach((f) => {
        const col = f.online ? '#10b981' : '#94a3b8';
        const ico = Lf.divIcon({ className: '', html: `<div style="background:#064e3b;border:2px solid ${col};color:#fff;border-radius:14px;padding:3px 8px;font-size:11px;font-weight:900;white-space:nowrap;box-shadow:0 2px 10px #000;">🚚 ${sEsc(f.driver)}</div>`, iconAnchor: [32, 14] });
        Lf.marker([f.lat, f.lng], { icon: ico }).addTo(leafletMap).bindPopup(`<b>🚚 ${sEsc(f.driver)}</b><br>${sEsc(f.plate || '')} · ${sEsc(f.capacity || '')}`);
        bounds.push([f.lat, f.lng]);
      });
      if (activeOrd) {
        Lf.polyline([[activeOrd.pickupLat, activeOrd.pickupLng], [activeOrd.dropLat, activeOrd.dropLng]], { color: '#2dd4bf', weight: 4, dashArray: '8 6' }).addTo(leafletMap);
        Lf.circleMarker([activeOrd.dropLat, activeOrd.dropLng], { radius: 8, color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.85 }).addTo(leafletMap).bindPopup(`<b>📍 ${sEsc(activeOrd.dropoff)}</b>`);
        bounds.push([activeOrd.dropLat, activeOrd.dropLng]);
      }
      if (bounds.length >= 2) leafletMap.fitBounds(bounds, { padding: [34, 34] });
    }).catch(() => {
      const el = document.getElementById('keLeafletMap');
      if (el) el.innerHTML = `<div style="height:100%;display:flex;align-items:center;justify-content:center;color:var(--muted);">📡 ${sEsc(L('ካርታውን ለመጫን ኢንተርኔት ያስፈልጋል', 'Internet required'))}</div>`;
    });
  }

  function renderQrGatePasses(root) {
    const q = (document.getElementById('globalSearch')?.value || '').trim().toLowerCase();
    const br = state.branchScope;
    const list = (state.gatePasses || []).filter((g) => {
      if (br !== 'all' && g.branch !== br) return false;
      if (q && !`${g.passNo} ${g.docNo} ${g.party} ${g.driver} ${g.plate}`.toLowerCase().includes(q)) return false;
      return true;
    });
    root.innerHTML = `
      <div class="card-row"><b style="color:var(--teal);">🛂 ${sEsc(L('የዕቃ መውጫ ፈቃድ (QR)', 'Gate Pass (QR)'))}</b><span class="pill">${list.length}</span></div>
      <div class="cards-grid">
        ${list.map((g) => {
          const exited = g.status === 'EXITED';
          return `
            <div class="card" style="${exited ? 'opacity:0.62;' : 'border-color:rgba(20,184,166,0.55);'}">
              <div class="card-row"><b style="font-family:ui-monospace,monospace;color:var(--teal);">${sEsc(g.passNo)} · ${sEsc(g.docNo)}</b><span class="pill ${exited ? 'emerald' : 'amber'}">${sEsc(exited ? L('ወጥቷል', 'Exited') : L('ክፍት ፈቃድ', 'Issued'))}</span></div>
              <div class="ke-qr-box">
                ${buildOfflineQrSvg(`KORA|${g.passNo}|${g.docNo}|${g.passCode}`)}
                <div style="min-width:0;flex:1;display:flex;flex-direction:column;gap:3px;">
                  <b>${sEsc(g.party)}</b>
                  <div style="font-size:11px;color:var(--muted);">${(g.items || []).map((x) => `${sEsc(x.itemName)} (${sNum(x.qty)})`).join('፣ ')}</div>
                  <div style="font-size:10.5px;color:var(--muted);">🚚 ${sEsc(g.driver || '-')} ${g.plate ? `(${sEsc(g.plate)})` : ''}</div>
                  ${!exited && (isOwner() || hasPerm('sellPrice')) ? `<span class="pill amber" style="width:fit-content;">${sEsc(L('ኮድ', 'Code'))}: <b>${sEsc(g.passCode)}</b></span>` : ''}
                </div>
              </div>
              ${!exited ? `<button type="button" class="btn teal sm" onclick="KoraEnt.verifyGatePass('${sEsc(g.id)}')">✅ ${sEsc(L('በር ላይ አረጋግጥ', 'Verify Exit'))}</button>` : `<div style="font-size:10.5px;color:#6ee7b7;">✓ ${sEsc(L('ያረጋገጠው', 'Verified'))}: ${sEsc(g.verifiedBy || '-')}</div>`}
            </div>`;
        }).join('') || `<div class="card" style="text-align:center;color:var(--muted);padding:24px;">${sEsc(L('ምንም የመውጫ ፈቃድ የለም', 'No gate passes'))}</div>`}
      </div>`;
  }

  function verifyGatePass(id) {
    if (global.KoraPro && typeof global.KoraPro.openVerifyGatePass === 'function') { global.KoraPro.openVerifyGatePass(id); return; }
    const g = (state.gatePasses || []).find((x) => String(x.id) === String(id)); if (!g) return;
    openModal(`🛂 ${L('የመውጫ ፈቃድ ማረጋገጫ', 'Verify Gate Exit')} · ${g.passNo}`, `<div class="sub-card"><b>${sEsc(g.party)}</b><input id="keGpCode" class="inp gate-pin" placeholder="${sEsc(L('የፈቃድ ኮድ', 'Pass Code'))}"></div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${sEsc(L('ተው', 'Cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraEnt.confirmGpExit('${sEsc(id)}')">✅ ${sEsc(L('አረጋግጥ', 'Confirm'))}</button>`);
  }

  function confirmGpExit(id) {
    const g = (state.gatePasses || []).find((x) => String(x.id) === String(id));
    const code = (document.getElementById('keGpCode')?.value || '').trim();
    if (!g || (g.passCode && code !== String(g.passCode))) { showToast(L('ኮዱ ትክክል አይደለም', 'Invalid code'), true); return; }
    const u = typeof curUser === 'function' ? curUser() : { name: 'Guard' };
    g.status = 'EXITED'; g.verifiedBy = u.name || 'Guard'; g.exitedAt = new Date().toLocaleString();
    logAudit('GATE_EXIT', g.passNo, `${g.party}`);
    saveState(); closeModal(); renderAll(); showToast(L('መውጫው ተረጋግጧል!', 'Exit verified!'));
  }

  function renderEnterpriseFleet(root) {
    const list = state.fleet || [];
    root.innerHTML = `
      <div class="card-row"><button type="button" class="btn teal sm" onclick="KoraEnt.openAddFleetModal()">+ ${sEsc(L('ተሽከርካሪ ጨምር', 'Add Vehicle'))}</button><span class="pill">${list.filter((f) => f.online).length}/${list.length} ${sEsc(L('በመስመር ላይ', 'Online'))}</span></div>
      <div class="cards-grid">
        ${list.map((f, i) => `
          <div class="card">
            <div class="card-row"><b>🚚 ${sEsc(f.driver)}</b><span class="pill ${f.online ? 'emerald' : 'amber'}">${sEsc(f.online ? L('በመስመር ላይ', 'Online') : L('ከመስመር ውጭ', 'Offline'))}</span></div>
            <div style="font-size:11.5px;color:var(--muted);font-family:ui-monospace,monospace;">${sEsc(f.plate || '-')} · ${sEsc(f.capacity || '3.5 ቶን')}</div>
            <div class="card-row" style="margin-top:4px;"><a class="btn muted sm" style="text-decoration:none;" href="tel:${sEsc(f.phone || '')}">📞 ${sEsc(f.phone || '-')}</a><button type="button" class="btn teal sm" onclick="KoraEnt.toggleFleetOnline(${i})">${sEsc(f.online ? L('አቁም', 'Set Off') : L('አብራ', 'Set On'))}</button></div>
          </div>`).join('')}
      </div>`;
  }

  function openNewOrderModal() {
    openModal(`🚚 ${L('አዲስ የማጓጓዣ ትዕዛዝ', 'New Order')}`, `
      <input id="keNoItem" class="inp" placeholder="${sEsc(L('የዕቃው ዝርዝር', 'Item'))}">
      <div class="grid-2"><input id="keNoQty" class="inp sm" placeholder="${sEsc(L('ብዛት', 'Qty'))}"><input id="keNoFee" type="number" min="0" class="inp sm mono" placeholder="${sEsc(L('ዋጋ (ብር)', 'Fee'))}"></div>
      <div class="grid-2"><input id="keNoPick" class="inp sm" value="${sEsc(state.branches?.[0]?.name || 'ዋና መጋዘን')}"><input id="keNoDrop" class="inp sm" placeholder="${sEsc(L('መድረሻ', 'Dropoff'))}"></div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${sEsc(L('ተው', 'Cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraEnt.saveNewOrder()">${sEsc(L('መዝግብ', 'Create'))}</button>`);
  }

  function saveNewOrder() {
    const item = (document.getElementById('keNoItem')?.value || '').trim(); if (!item) return;
    const ord = {
      id: Date.now(), orderNo: 'DSP-' + (501 + (state.dispatchOrders || []).length), item,
      qty: (document.getElementById('keNoQty')?.value || '').trim() || '1',
      pickup: (document.getElementById('keNoPick')?.value || '').trim() || '-',
      dropoff: (document.getElementById('keNoDrop')?.value || '').trim() || '-',
      fee: Math.max(0, Number(document.getElementById('keNoFee')?.value || 0)),
      fuelCost: 0, driverCost: 0,
      pickupLat: state.branches?.[0]?.lat || 8.9125, pickupLng: state.branches?.[0]?.lng || 38.7652,
      dropLat: 9.002 + Math.random() * 0.025, dropLng: 38.755 + Math.random() * 0.04,
      status: 'open', driver: '', plate: '', otp: String(1000 + Math.floor(Math.random() * 9000))
    };
    state.dispatchOrders.unshift(ord);
    logAudit('DISPATCH_CREATED', ord.orderNo, `${ord.item} (${ord.pickup} -> ${ord.dropoff})`);
    saveState(); closeModal(); renderAll(); showToast(L('ትዕዛዙ ተመዝግቧል', 'Created'));
  }

  function openAssignDriverModal(ordId) {
    const opts = (state.fleet || []).map((f, i) => `<option value="${i}">${sEsc(f.driver)} (${sEsc(f.plate || '-')})</option>`).join('');
    openModal(`🚚 ${L('ሹፌር መድብ', 'Assign Driver')}`, `<select id="keDrvSel" class="sel">${opts}</select>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${sEsc(L('ተው', 'Cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraEnt.confirmAssign(${ordId})">${sEsc(L('መድብ', 'Assign'))}</button>`);
  }

  function confirmAssign(ordId) {
    const o = (state.dispatchOrders || []).find((x) => x.id === ordId);
    const f = (state.fleet || [])[Number(document.getElementById('keDrvSel')?.value || 0)];
    if (!o || !f) return;
    o.driver = f.driver; o.plate = f.plate || ''; o.status = 'assigned';
    logAudit('DISPATCH_ASSIGNED', o.orderNo, f.driver);
    saveState(); closeModal(); renderAll(); showToast(L('ሹፌር ተመድቧል', 'Assigned'));
  }

  function advanceOrder(ordId, nextStatus) {
    const o = (state.dispatchOrders || []).find((x) => x.id === ordId); if (!o) return;
    o.status = nextStatus; logAudit('DISPATCH_STATUS', o.orderNo, nextStatus);
    saveState(); renderAll(); showToast(L('ታድሷል', 'Updated'));
  }

  function openCostModal(ordId) {
    const o = (state.dispatchOrders || []).find((x) => x.id === ordId); if (!o) return;
    openModal(`⛽ ${L('የጉዞ ወጪና ገቢ', 'Trip Financials')} · ${o.orderNo}`, `
      <div class="grid-2"><div><label class="lbl">${sEsc(L('ገቢ', 'Fee'))}</label><input id="keCFee" type="number" min="0" class="inp mono" value="${o.fee || 0}"></div><div><label class="lbl">${sEsc(L('ነዳጅ', 'Fuel'))}</label><input id="keCFuel" type="number" min="0" class="inp mono" value="${o.fuelCost || 0}"></div></div>
      <div><label class="lbl">${sEsc(L('ሹፌር/ጫኝ ወጪ', 'Driver Cost'))}</label><input id="keCDrv" type="number" min="0" class="inp mono" value="${o.driverCost || 0}"></div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${sEsc(L('ተው', 'Cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraEnt.saveCost(${ordId})">${sEsc(L('አስቀምጥ', 'Save'))}</button>`);
  }

  function saveCost(ordId) {
    const o = (state.dispatchOrders || []).find((x) => x.id === ordId); if (!o) return;
    o.fee = Math.max(0, Number(document.getElementById('keCFee')?.value || 0));
    o.fuelCost = Math.max(0, Number(document.getElementById('keCFuel')?.value || 0));
    o.driverCost = Math.max(0, Number(document.getElementById('keCDrv')?.value || 0));
    saveState(); closeModal(); renderAll(); showToast(L('ተቀምጧል', 'Saved'));
  }

  function openPodModal(ordId) {
    const o = (state.dispatchOrders || []).find((x) => x.id === ordId); if (!o) return;
    podPhotoData = '';
    openModal(`✅ ${L('የርክክብ ማረጋገጫ (POD)', 'POD')} · ${o.orderNo}`, `
      <div class="sub-card"><b>${sEsc(o.item)} · ${sEsc(o.dropoff)}</b><input id="kePodOtp" type="number" inputmode="numeric" class="inp gate-pin" placeholder="OTP"><label class="btn muted sm" style="margin-top:6px;">📷 ${sEsc(L('ፎቶ አያይዝ', 'Attach Photo'))}<input type="file" accept="image/*" capture="environment" style="display:none;" onchange="KoraEnt.onPodPhoto(this)"></label></div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${sEsc(L('ተው', 'Cancel'))}</button>
      <button type="button" class="btn emerald" onclick="KoraEnt.confirmPod(${ordId})">${sEsc(L('አረጋግጥ', 'Confirm'))}</button>`);
  }

  function confirmPod(ordId) {
    const o = (state.dispatchOrders || []).find((x) => x.id === ordId);
    const otp = (document.getElementById('kePodOtp')?.value || '').trim();
    if (!o || (o.otp && otp !== String(o.otp))) { showToast(L('ኮዱ ትክክል አይደለም', 'Invalid OTP'), true); return; }
    o.status = 'delivered'; o.podPhoto = podPhotoData; o.deliveredAt = new Date().toLocaleString();
    logAudit('DISPATCH_POD', o.orderNo, o.dropoff);
    saveState(); closeModal(); renderAll(); showToast(L('ርክክቡ ተረጋግጧል!', 'Delivered!'));
  }

  function shareMyGps() {
    if (!navigator.geolocation) { showToast(L('GPS አይደገፍም', 'GPS unsupported'), true); return; }
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      if (state.fleet?.[0]) { state.fleet[0].lat = latitude; state.fleet[0].lng = longitude; state.fleet[0].online = true; }
      saveState(); renderView(); showToast(`📍 GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    }, () => showToast(L('የGPS ፍቃድ አልተሰጠም', 'GPS denied'), true), { enableHighAccuracy: true });
  }

  function openAddFleetModal() {
    openModal(`🚚 ${L('አዲስ ተሽከርካሪ', 'Add Vehicle')}`, `
      <input id="keFlDrv" class="inp" placeholder="${sEsc(L('የሹፌር ስም', 'Driver'))}">
      <div class="grid-2"><input id="keFlPlt" class="inp sm mono" placeholder="${sEsc(L('ታርጋ', 'Plate'))}"><input id="keFlCap" class="inp sm" placeholder="${sEsc(L('አቅም', 'Capacity'))}"></div>
      <input id="keFlPh" class="inp sm mono" placeholder="${sEsc(L('ስልክ', 'Phone'))}">`, `
      <button type="button" class="btn muted" onclick="closeModal()">${sEsc(L('ተው', 'Cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraEnt.saveAddFleet()">${sEsc(L('አስቀምጥ', 'Save'))}</button>`);
  }

  function saveAddFleet() {
    const driver = (document.getElementById('keFlDrv')?.value || '').trim(); if (!driver) return;
    state.fleet.push({
      id: Date.now(), driver, plate: (document.getElementById('keFlPlt')?.value || '').trim(),
      capacity: (document.getElementById('keFlCap')?.value || '').trim() || '3.5 ቶን',
      phone: (document.getElementById('keFlPh')?.value || '').trim(),
      online: true, lat: 8.98 + Math.random() * 0.03, lng: 38.75 + Math.random() * 0.03
    });
    saveState(); closeModal(); renderView(); showToast(L('ተጨምሯል', 'Added'));
  }

  function renderAuditLogPage(root) {
    const logs = state.auditLogs || [];
    root.innerHTML = `
      <div class="card-row"><b style="color:var(--primary);">🛡️ ${sEsc(L('የማይጠፋ የኦዲት መዝገብ', 'Audit Log'))}</b><span class="pill">${logs.length}</span></div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${logs.map((a) => `
          <div class="ke-aud-row">
            <div class="card-row"><b style="font-size:12px;color:#5eead4;">${sEsc(a.action)} · ${sEsc(a.ref)}</b><span style="font-size:10px;color:var(--muted);">${sEsc(a.ts)}</span></div>
            <div style="font-size:11px;">${sEsc(a.details)}</div>
            <div style="font-size:10px;color:var(--muted);">👤 ${sEsc(a.actor)} (${sEsc(a.role)})</div>
          </div>`).join('') || `<div class="card" style="text-align:center;color:var(--muted);padding:24px;">${sEsc(L('የኦዲት መዝገብ ገና ባዶ ነው', 'No audit logs'))}</div>`}
      </div>`;
  }

  // ---------------------------------------------------------------------------
  // 8. ውህደት (Hooks)
  // ---------------------------------------------------------------------------
  function installEnterpriseHooks() {
    if (!hasState() || global._keHooksDone) return;
    global._keHooksDone = true;
    injectEnterpriseCss();
    ensureEntState();
    installVoiceInterceptor();

    if (typeof global.openModal === 'function') {
      const _origOM = global.openModal;
      global.openModal = function () {
        const res = _origOM.apply(this, arguments);
        setTimeout(injectIntoTallySettingsModal, 0);
        return res;
      };
    }

    const _origSubTabs = global.renderSubTabs;
    global.renderSubTabs = function () {
      if (state.activeMainTab === 'dispatch') {
        const list = [
          { k: 'orders',   lbl: L('ትዕዛዞች', 'Orders'), show: true },
          { k: 'map',      lbl: L('ቀጥታ ካርታ', 'Live Map'), show: true },
          { k: 'gatepass', lbl: L('መውጫ ፈቃድ', 'Gate Pass'), show: state.cfg.modGatePass !== false },
          { k: 'fleet',    lbl: L('ተሽከርካሪዎች', 'Fleet'), show: true }
        ].filter((x) => x.show);
        if (!list.some((x) => x.k === state.activeSubTab.dispatch)) state.activeSubTab.dispatch = 'orders';
        document.getElementById('subTabsBar').innerHTML = list.map((s) =>
          `<button type="button" class="subtab ${state.activeSubTab.dispatch === s.k ? 'active' : ''}" onclick="switchSubTab('${s.k}')">${sEsc(s.lbl)}</button>`
        ).join('');
        syncTopbarAndNotifications();
        return;
      }
      if (state.activeMainTab === 'setup:auditlog') {
        document.getElementById('subTabsBar').innerHTML = `<button type="button" class="subtab active">🛡️ ${sEsc(L('ኦዲት መዝገብ', 'Audit Log'))}</button>`;
        syncTopbarAndNotifications();
        return;
      }
      if (typeof _origSubTabs === 'function') _origSubTabs();
      syncTopbarAndNotifications();
    };

    global.renderDispatch = function (sub) {
      const root = document.getElementById('viewRoot'); if (!root) return;
      ensureEntState();
      if (sub === 'map') renderGoogleLikeLiveMap(root);
      else if (sub === 'gatepass') renderQrGatePasses(root);
      else if (sub === 'fleet') renderEnterpriseFleet(root);
      else renderEnterpriseOrders(root);
    };

    const _origSetup = global.renderSetupPage;
    global.renderSetupPage = function (page) {
      const root = document.getElementById('viewRoot');
      if (page === 'market' && root) { renderModernMarket(root); return; }
      if (page === 'auditlog' && root) { renderAuditLogPage(root); return; }
      if (typeof _origSetup === 'function') _origSetup(page);
    };

    const _origDrawer = global.renderDrawer;
    global.renderDrawer = function () {
      if (typeof _origDrawer === 'function') _origDrawer();
      const nav = document.getElementById('drawerNav');
      if (nav) {
        if (isOwner() && !nav.querySelector('[data-ke-aud]')) {
          nav.insertAdjacentHTML('beforeend', `<button type="button" data-ke-aud="1" class="drawer-item ${state.activeMainTab === 'setup:auditlog' ? 'active' : ''}" onclick="vib(14);openSetup('auditlog')"><span>🛡️ ${sEsc(L('ኦዲት መዝገብ', 'Audit Log'))}</span></button>`);
        }
        if (!nav.querySelector('[data-ke-lang]')) {
          nav.insertAdjacentHTML('beforeend', `<button type="button" data-ke-lang="1" class="drawer-item" onclick="if(typeof toggleLang==='function')toggleLang();else{state.lang=state.lang==='en'?'am':'en';saveState();renderAll();}"><span>🌐 ${sEsc(L('ቋንቋ ቀይር (English)', 'Switch Language (አማርኛ)'))}</span></button>`);
        }
      }
    };

    const _origRV = global.renderView;
    global.renderView = function () {
      if (typeof _origRV === 'function') _origRV();
      applyTallyLayoutAndModes();
      requestAnimationFrame(applyTallyLayoutAndModes);
      setTimeout(applyTallyLayoutAndModes, 120);
    };

    window.addEventListener('resize', () => {
      const tag = (document.activeElement?.tagName || '').toUpperCase();
      if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) applyTallyLayoutAndModes();
    });
    window.addEventListener('online', syncTopbarAndNotifications);
    window.addEventListener('offline', syncTopbarAndNotifications);
    if (state.loggedIn) renderAll();
  }

  global.KoraEnt = {
    testVoiceSample,
    triggerTallyLock() { if (cachedRealLockBtn) { cachedRealLockBtn.click(); setTimeout(applyTallyLayoutAndModes, 30); } },
    triggerTallyCfg() { if (cachedRealCfgBtn) cachedRealCfgBtn.click(); },
    clickNotifBtn(idx) { const target = capturedNotifBtns[idx]?.el; closeModal(); if (target) target.click(); },
    toggleTallyMode(key, el) { state.cfg[key] = state.cfg[key] === false ? true : false; if (el) el.classList.toggle('on', state.cfg[key] !== false); saveState(); applyTallyLayoutAndModes(); },
    setMktCat(c) { mktCat = c; renderView(); },
    setMktSort(s) { mktSort = s; renderView(); },
    setMktQuery(q) { mktQuery = q; renderView(); },
    openMarketSettings, openNewAdModal, saveNewAd, msgSeller, orderFromAd, confirmAdOrder,
    onAdPhoto(inp) { const f = inp.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => { adPhotoDraft = r.result; showToast(L('ፎቶ ተመርጧል', 'Photo ready')); }; r.readAsDataURL(f); },
    onPodPhoto(inp) { const f = inp.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => { podPhotoData = r.result; showToast(L('ፎቶ ተያይዟል', 'Photo attached')); }; r.readAsDataURL(f); },
    setMapLayer(l) { state.cfg.mapLayer = l; saveState(); renderView(); },
    shareMyGps, openNewOrderModal, saveNewOrder, openAssignDriverModal, confirmAssign,
    advanceOrder, openCostModal, saveCost, openPodModal, confirmPod, openAddFleetModal, saveAddFleet,
    verifyGatePass, confirmGpExit,
    toggleFleetOnline(i) { if (state.fleet?.[i]) { state.fleet[i].online = !state.fleet[i].online; saveState(); renderView(); } }
  };

  installEnterpriseHooks();
  document.addEventListener('DOMContentLoaded', installEnterpriseHooks);
  setTimeout(installEnterpriseHooks, 350);
})(window);
