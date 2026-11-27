// =============================================================================
// ኮራ ስቶክ — Matte Obsidian Unified Design System (kora-theme-pro.js — v28)
// • የተቆረጠውን የታችኛው ዳሰሳ (transform bug) 100% ማስተካከያ
// • የጎን ሜኑ (Drawer) እና የመላው አፑ ቁልፎች ሙሉ Outline SVG አዶዎች
// • የጎን ሜኑ ድግምግሞሽ ማጽጃ (ድርብ ቋንቋ፣ የቆጠራ ቅንብር፣ የፒዲኤፍ ስቱዲዮ)
// =============================================================================
(function (global) {
  'use strict';

  const SVG = {
    dashboard: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>',
    trade: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2.5 3.5h2.8l2.2 11.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.5l1.6-6.8H6.2"/></svg>',
    warehouse: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8.5V7a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 7v9a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m3.3 6.7 8.7 5 8.7-5M12 21.8V11.7"/><path d="M18 14v6M15 17h6"/></svg>',
    tally: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M9 3v2h6V3"/><path d="m9 13 2 2 4-4"/></svg>',
    dispatch: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10V7a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 7v9a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l1.5-.86"/><path d="m3.3 6.7 8.7 5 8.7-5M12 21.8V11.7"/><path d="m16 17 2 2 4-4"/></svg>',
    menu: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h12"/></svg>',
    bell: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    // የጎን ሜኑ እና የአፕ አጠቃላይ Outline SVG አዶዎች
    sparkles: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 3v4M21 5h-4"/></svg>',
    shield: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    box: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></svg>',
    branch: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9h.01M9 13h.01M9 17h.01"/></svg>',
    bank: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>',
    supplier: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><path d="M4 20V8l5 3V8l5 3V4h6v16"/></svg>',
    expense: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/></svg>',
    market: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1.5-5h15L21 9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 12v8h14v-8"/></svg>',
    users: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    send: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
    checkSq: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="m9 12 2 2 4-4"/></svg>',
    form: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>',
    gear: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    globe: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M2.5 12h19M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
    db: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>',
    truckSm: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M14 9h5l3 4v4h-3"/><circle cx="7.5" cy="17.5" r="2"/><circle cx="16.5" cy="17.5" r="2"/></svg>',
    fuelSm: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17"/><path d="M15 10h2a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2"/><path d="M6 10h6M2 22h14"/></svg>',
    phoneSm: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    navSm: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>',
    checkSm: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
  };

  function injectMatteThemeCss() {
    let st = document.getElementById('koraMatteThemeCss');
    if (!st) {
      st = document.createElement('style');
      st.id = 'koraMatteThemeCss';
      document.head.appendChild(st);
    }
    st.textContent = `
      /* === 1. Matte Obsidian ወጥ ቀለም === */
      :root {
        --bg: #070a0e !important;
        --bg-deep: #05080b !important;
        --surface: #0d1218 !important;
        --surface-deep: #090d12 !important;
        --card: #10161d !important;
        --border: rgba(148, 163, 184, 0.11) !important;
        --border-strong: rgba(148, 163, 184, 0.19) !important;
        --teal: #14b8a6 !important;
        --primary: #06b6d4 !important;
        --emerald: #10b981 !important;
        --amber: #f59e0b !important;
        --rose: #f43f5e !important;
        --text: #f1f5f9 !important;
        --muted: #8b9bb0 !important;
      }

      html, body { background: #070a0e !important; color: #f1f5f9 !important; }
      .topbar { background: rgba(7, 10, 14, 0.94) !important; backdrop-filter: blur(12px) !important; border-bottom: 1px solid rgba(148, 163, 184, 0.10) !important; }
      .card { background: #10161d !important; border: 1px solid rgba(148, 163, 184, 0.13) !important; box-shadow: none !important; }
      .sub-card { background: #0b1015 !important; border: 1px solid rgba(148, 163, 184, 0.10) !important; }
      .kpi { background: #0c1117 !important; border: 1px solid rgba(148, 163, 184, 0.12) !important; }
      .inp, .sel, .search-wrap, .scope-sel { background: #0b1015 !important; border-color: rgba(148, 163, 184, 0.16) !important; color: #f1f5f9 !important; }
      .subtab { background: #0d1218 !important; border: 1px solid rgba(148, 163, 184, 0.14) !important; color: #8b9bb0 !important; }
      .subtab.active { background: rgba(20, 184, 166, 0.16) !important; border-color: rgba(20, 184, 166, 0.65) !important; color: #2dd4bf !important; }
      .modal-card, #modalCard, .drawer, .drawer-panel { background: #0d1218 !important; border-color: rgba(148, 163, 184, 0.18) !important; }
      .topbar .icon-btn, .ke-bell-btn { background: #0d1218 !important; border: 1px solid rgba(148, 163, 184, 0.16) !important; color: #cbd5e1 !important; border-radius: 11px !important; }
      .ke-brand-txt small { display: none !important; }
      .ke-brand-txt b { font-size: 14px !important; letter-spacing: 0.2px; }

      /* === 2. v28 FIX: ተንሳፋፊ ዳሰሳ — transform: none! (መቆረጡን 100% ያስወግዳል) === */
      .kth-bnav {
        position: fixed !important;
        left: 10px !important;
        right: 10px !important;
        bottom: 8px !important;
        width: auto !important;
        max-width: none !important;
        min-width: 0 !important;
        margin: 0 !important;
        transform: none !important;
        height: 64px !important;
        padding: 4px 6px !important;
        border-radius: 26px !important;
        background: rgba(11, 16, 22, 0.96) !important;
        backdrop-filter: blur(16px) !important;
        border: 1px solid rgba(148, 163, 184, 0.16) !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.65) !important;
        display: grid !important;
        grid-template-columns: repeat(5, 1fr) !important;
        align-items: center !important;
        gap: 2px !important;
        z-index: 95 !important;
        box-sizing: border-box !important;
      }
      .kth-bnav button {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 18px !important;
        height: 54px !important;
        padding: 3px 2px !important;
        margin: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 3px !important;
        position: relative !important;
        color: #8b9bb0 !important;
        transform: none !important;
        min-width: 0 !important;
        width: 100% !important;
      }
      .kth-bnav button.active { background: rgba(20, 184, 166, 0.08) !important; }
      .kth-nav-pill {
        width: 46px; height: 30px; border-radius: 15px;
        display: flex; align-items: center; justify-content: center;
        color: #8b9bb0; position: relative; transition: all 0.18s ease;
      }
      .kth-bnav button.active .kth-nav-pill {
        background: rgba(6, 182, 212, 0.18); color: #22d3ee;
        box-shadow: inset 0 0 0 1px rgba(34, 211, 238, 0.28);
      }
      .kth-nav-lbl {
        font-size: 9.8px; font-weight: 700; color: #8b9bb0; line-height: 1.1;
        white-space: nowrap; max-width: 100%; overflow: hidden; text-overflow: ellipsis;
      }
      .kth-bnav button.active .kth-nav-lbl { color: #22d3ee; font-weight: 800; }
      .kth-nav-bdg {
        position: absolute; top: -3px; right: 1px; min-width: 15px; height: 15px; padding: 0 4px;
        border-radius: 99px; background: #f43f5e; color: #fff; font-size: 9px; font-weight: 900;
        display: flex; align-items: center; justify-content: center; border: 1.5px solid #0b1016;
      }

      /* === 3. የጎን ሜኑ ፕሪሚየም SVG ረድፎች === */
      #drawerNav .drawer-item {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 10px !important;
        padding: 9px 11px !important;
        border-radius: 11px !important;
        font-size: 12.5px !important;
        font-weight: 700 !important;
        color: #cbd5e1 !important;
      }
      #drawerNav .drawer-item.active {
        background: rgba(20, 184, 166, 0.14) !important;
        border: 1px solid rgba(20, 184, 166, 0.45) !important;
        color: #2dd4bf !important;
      }
      .kth-dr-left {
        display: inline-flex; align-items: center; gap: 10px; min-width: 0;
      }
      .kth-dr-ico {
        width: 28px; height: 28px; border-radius: 8px;
        background: rgba(148, 163, 184, 0.08);
        color: #94a3b8;
        display: inline-flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      #drawerNav .drawer-item.active .kth-dr-ico {
        background: rgba(20, 184, 166, 0.2);
        color: #2dd4bf;
      }
      .kth-dr-hidden { display: none !important; }

      body:not(.ktp-active) .viewport { padding-bottom: 86px !important; }
    `;
  }

  function detectNavKey(btn) {
    const hay = `${btn.getAttribute('onclick') || ''} ${btn.dataset?.tab || ''} ${btn.textContent || ''}`.toLowerCase();
    if (hay.includes('dashboard') || hay.includes('ዳሽቦርድ')) return 'dashboard';
    if (hay.includes('trade') || hay.includes('sales') || hay.includes('ግብይት') || hay.includes('ሽያጭ')) return 'trade';
    if (hay.includes('warehouse') || hay.includes('መጋዘን')) return 'warehouse';
    if (hay.includes('tally') || hay.includes('ቆጠራ')) return 'tally';
    if (hay.includes('dispatch') || hay.includes('ማጓጓዣ')) return 'dispatch';
    return 'dashboard';
  }

  function findBottomNavEl() {
    const direct = document.querySelector('.bnav, .bottom-nav, #bottomNav, nav.nav');
    if (direct) return direct;
    const cands = document.querySelectorAll('nav, footer, div[class*="nav" i], div[class*="tabbar" i]');
    for (const el of cands) {
      if (el.closest('#viewRoot') || el.closest('.drawer') || el.closest('.modal')) continue;
      if (el.querySelectorAll('button').length === 5 && el.getBoundingClientRect().top > window.innerHeight * 0.6) return el;
    }
    return null;
  }

  function upgradeBottomNav() {
    const nav = findBottomNavEl();
    if (!nav) return;
    nav.classList.add('kth-bnav');
    Array.from(nav.querySelectorAll('button')).forEach((btn) => {
      const key = detectNavKey(btn);
      let bdgNum = '';
      const existingBdg = btn.querySelector('.kth-nav-bdg, .badge, .nav-badge, .bnav-badge, [class*="badge" i]');
      if (existingBdg) {
        const m = (existingBdg.textContent || '').trim().match(/\d+/);
        if (m) bdgNum = m[0];
      }
      let label = btn.dataset.kthLabel || '';
      if (!label) {
        const clone = btn.cloneNode(true);
        clone.querySelectorAll('.kth-nav-bdg, .badge, .nav-badge, .bnav-badge, [class*="badge" i], svg, .ico, .bnav-ico').forEach((n) => n.remove());
        label = (clone.textContent || '').replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF\d]/gu, '').trim();
        if (!label) {
          const fb = { dashboard: 'ዳሽቦርድ', trade: 'ግብይት', warehouse: 'መጋዘን', tally: 'ቆጠራ', dispatch: 'ማጓጓዣ' };
          label = fb[key] || '';
        }
        btn.dataset.kthLabel = label;
      }
      const sig = `${key}|${label}|${bdgNum}`;
      if (btn.dataset.kthSig === sig) return;
      btn.dataset.kthSig = sig;
      btn.innerHTML = `<span class="kth-nav-pill">${SVG[key] || SVG.dashboard}${bdgNum ? `<span class="kth-nav-bdg">${bdgNum}</span>` : ''}</span><span class="kth-nav-lbl">${label}</span>`;
    });
  }

  function stripEmojis(s) {
    return String(s || '').replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF\uFE0F]/gu, '').replace(/\s+/g, ' ').trim();
  }

  function pickDrawerSvg(text) {
    const t = text.toLowerCase();
    if (t.includes('ዘመናዊ') || t.includes('next-gen')) return SVG.sparkles;
    if (t.includes('ቁጥጥር') || t.includes('erp') || t.includes('ኦዲት')) return SVG.shield;
    if (t.includes('ዕቃዎች') || t.includes('item') || t.includes('product')) return SVG.box;
    if (t.includes('ቅርንጫፍ') || t.includes('branch')) return SVG.branch;
    if (t.includes('ባንክ') || t.includes('bank')) return SVG.bank;
    if (t.includes('አቅራቢ') || t.includes('supplier')) return SVG.supplier;
    if (t.includes('ወጪ') || t.includes('expense')) return SVG.expense;
    if (t.includes('ገበያ') || t.includes('market')) return SVG.market;
    if (t.includes('ሰራተኞች') || t.includes('ደንበኞች') || t.includes('staff') || t.includes('customer')) return SVG.users;
    if (t.includes('መልዕክት') || t.includes('channel') || t.includes('message')) return SVG.send;
    if (t.includes('ማጽደቂያ') || t.includes('approval')) return SVG.checkSq;
    if (t.includes('ቅፅ') || t.includes('ቅጽ') || t.includes('form') || t.includes('ፒዲኤፍ')) return SVG.form;
    if (t.includes('ባክአፕ') || t.includes('backup')) return SVG.db;
    if (t.includes('ቋንቋ') || t.includes('lang')) return SVG.globe;
    return SVG.gear;
  }

  function upgradeSideDrawer() {
    const nav = document.getElementById('drawerNav');
    if (!nav) return;

    const seenKeys = new Set();
    Array.from(nav.querySelectorAll('.drawer-item')).forEach((btn) => {
      const rawTxt = (btn.textContent || '').trim();
      const cleanTxt = stripEmojis(rawTxt);

      // 1. ድግምግሞሾችን እና በገጽ ውስጥ ያሉ አላስፈላጊ ታቦችን መደበቅ
      const isDupLang = btn.hasAttribute('data-ke-lang') || (cleanTxt.includes('ቋንቋ ቀይር') && seenKeys.has('lang'));
      const isTallyCfg = cleanTxt.includes('የቆጠራ ቅንብር') || cleanTxt.toLowerCase().includes('tally setting');
      const isPdfStudio = cleanTxt.includes('የፒዲኤፍ ስቱዲዮ') || cleanTxt.toLowerCase().includes('pdf studio');

      if (isDupLang || isTallyCfg || isPdfStudio) {
        btn.classList.add('kth-dr-hidden');
        return;
      }
      if (cleanTxt.includes('ቋንቋ ቀይር') || cleanTxt.toLowerCase().includes('language')) seenKeys.add('lang');

      if (btn.dataset.kthDrDone === cleanTxt) return;
      btn.dataset.kthDrDone = cleanTxt;

      // በቀኝ በኩል ባጅ/ፒል ካለ ጠብቆ ማቆየት (ለምሳሌ «እንግሊዝኛ»)
      let rightBadge = '';
      const pill = btn.querySelector('.pill, .badge');
      if (pill) rightBadge = pill.outerHTML;
      const pureLabel = pill ? stripEmojis(rawTxt.replace(pill.textContent, '')) : cleanTxt;

      btn.innerHTML = `
        <span class="kth-dr-left">
          <span class="kth-dr-ico">${pickDrawerSvg(pureLabel)}</span>
          <span>${pureLabel}</span>
        </span>
        ${rightBadge}`;
    });
  }

  function upgradeGlobalInlineIcons() {
    const root = document.getElementById('viewRoot');
    if (!root) return;
    // በዋና ቁልፎች ውስጥ ያሉ ባለቀለም ኢሞጂዎችን ወደ ንጹህ SVG መቀየር
    const swaps = [
      ['🚚', SVG.truckSm],
      ['⛽', SVG.fuelSm],
      ['📞', SVG.phoneSm],
      ['🧭', SVG.navSm],
      ['✅', SVG.checkSm]
    ];
    root.querySelectorAll('button.btn, a.btn').forEach((el) => {
      if (el.dataset.kthBtnIco) return;
      const html = el.innerHTML;
      if (html.includes('<svg')) { el.dataset.kthBtnIco = '1'; return; }
      let next = html;
      swaps.forEach(([em, svg]) => {
        if (next.includes(em)) next = next.replaceAll(em, svg);
      });
      if (next !== html) {
        el.innerHTML = next;
        el.style.display = 'inline-flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.gap = '5px';
      }
      el.dataset.kthBtnIco = '1';
    });
  }

  function upgradeTopbarChrome() {
    const row1 = document.querySelector('.topbar .topbar-row');
    if (!row1) return;
    const menuBtn = row1.querySelector('button:first-child');
    if (menuBtn && !menuBtn.querySelector('svg') && menuBtn.id !== 'keNotifBell' && menuBtn.id !== 'btnNotifBell') {
      menuBtn.innerHTML = SVG.menu;
    }
    const bell = document.getElementById('btnNotifBell') || document.getElementById('keNotifBell');
    if (bell && !bell.querySelector('svg')) {
      const bdg = bell.querySelector('.ke-bell-badge, .badge, .notif-badge');
      const dot = bell.querySelector('.ke-net-dot');
      bell.innerHTML = `${SVG.bell}${bdg ? bdg.outerHTML : ''}${dot ? dot.outerHTML : ''}`;
    }
    if (typeof state !== 'undefined' && Array.isArray(state.branches)) {
      const scopeSel = row1.querySelector('.scope-sel, select');
      if (scopeSel) scopeSel.style.display = state.branches.length <= 1 ? 'none' : '';
    }
  }

  function applyAllThemePolishes() {
    injectMatteThemeCss();
    upgradeTopbarChrome();
    upgradeBottomNav();
    upgradeSideDrawer();
    upgradeGlobalInlineIcons();
  }

  function bootTheme() {
    applyAllThemePolishes();

    if (typeof global.renderView === 'function' && !global._kthRVHooked) {
      global._kthRVHooked = true;
      const origRV = global.renderView;
      global.renderView = function () {
        const res = origRV.apply(this, arguments);
        requestAnimationFrame(applyAllThemePolishes);
        return res;
      };
    }
    if (typeof global.renderDrawer === 'function' && !global._kthDRHooked) {
      global._kthDRHooked = true;
      const origDR = global.renderDrawer;
      global.renderDrawer = function () {
        const res = origDR.apply(this, arguments);
        requestAnimationFrame(upgradeSideDrawer);
        return res;
      };
    }
    if (typeof global.renderAll === 'function' && !global._kthRAHooked) {
      global._kthRAHooked = true;
      const origRA = global.renderAll;
      global.renderAll = function () {
        const res = origRA.apply(this, arguments);
        requestAnimationFrame(applyAllThemePolishes);
        return res;
      };
    }

    const nav = findBottomNavEl();
    if (nav && !nav.dataset.kthObs) {
      nav.dataset.kthObs = '1';
      let t = null;
      new MutationObserver(() => {
        clearTimeout(t);
        t = setTimeout(upgradeBottomNav, 30);
      }).observe(nav, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    }
  }

  document.addEventListener('DOMContentLoaded', bootTheme);
  setTimeout(bootTheme, 150);
  setTimeout(bootTheme, 550);
})(window);
