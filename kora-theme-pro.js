// =============================================================================
// ኮራ ስቶክ — Unified UI, 2x2 Dashboard, Swipe-Exit, Kora Live Grid & Form Builder
// (kora-theme-pro.js — v30)
// =============================================================================
(function (global) {
  'use strict';

  // ከድሮው kora-sheets-forms.js ጋር ግጭት እንዳይኖር አስቀድሞ መዝጋት
  global._kgHooksDone = true;
  global._ksfHooksDone = true;

  function hasState() { return typeof state !== 'undefined' && state && typeof state === 'object'; }
  function isAm() { return !hasState() || state.lang !== 'en'; }
  function L(am, en) { return isAm() ? am : en; }
  function sEsc(v) { return typeof esc === 'function' ? esc(v) : String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function sNum(n) { return typeof fmtNum === 'function' ? fmtNum(n) : Number(n || 0).toLocaleString(); }
  function sMoney(n) { return typeof fmtMoney === 'function' ? fmtMoney(n) : `${Number(n || 0).toLocaleString()} ብር`; }
  function todayIso() { return new Date().toISOString().slice(0, 10); }

  const SVG = {
    dashboard: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>',
    trade: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2.5 3.5h2.8l2.2 11.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.5l1.6-6.8H6.2"/></svg>',
    warehouse: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8.5V7a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 7v9a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m3.3 6.7 8.7 5 8.7-5M12 21.8V11.7"/><path d="M18 14v6M15 17h6"/></svg>',
    tally: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M9 3v2h6V3"/><path d="m9 13 2 2 4-4"/></svg>',
    dispatch: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10V7a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 7v9a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l1.5-.86"/><path d="m3.3 6.7 8.7 5 8.7-5M12 21.8V11.7"/><path d="m16 17 2 2 4-4"/></svg>',
    menu: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h12"/></svg>',
    back: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>',
    bell: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    undo: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>',
    search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    dots: '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>',
    lock: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    alignL: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h12M3 18h16"/></svg>',
    alignC: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M6 12h12M4 18h16"/></svg>',
    alignR: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M9 12h12M5 18h16"/></svg>',
    wrap: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h15a3 3 0 1 1 0 6h-4"/><path d="m16 16-2 2 2 2M3 18h7"/></svg>',
    fill: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2a2 2 0 0 0 2.8 0L19 11Z"/><path d="m5 2 5 5M2 13h15"/></svg>',
    plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>',
    sparkles: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 3v4M21 5h-4"/></svg>',
    shield: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    box: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></svg>',
    branch: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>',
    bank: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>',
    supplier: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20M4 20V8l5 3V8l5 3V4h6v16"/></svg>',
    expense: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>',
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

  let lastMainTab = 'dashboard';
  let tallyHistoryPushed = false;
  let gridOpen = false;
  let gridDomain = 'stock';
  let gridSearchOpen = false;
  let gridSearchQuery = '';
  let gridMenuOpen = false;
  let selectedColKey = null;
  let styleUndoStack = [];
  let gridHistoryPushed = false;

  const TEXT_PALETTE = ['', '#f1f5f9', '#2dd4bf', '#38bdf8', '#fbbf24', '#fb7185', '#a3e635', '#0f172a'];
  const FILL_PALETTE = ['', 'rgba(20,184,166,0.16)', 'rgba(56,189,248,0.16)', 'rgba(245,158,11,0.18)', 'rgba(244,63,94,0.18)', 'rgba(148,163,184,0.14)'];

  function defaultGridStyle() {
    return { theme: 'dark', fontSize: 12, bold: false, italic: false, align: 'auto', rowPad: 6, wrap: false, hideZero: false, paper: 'A4', colWidths: {}, colStyles: {} };
  }

  function ensureGridState() {
    if (!hasState()) return;
    if (!state.koraGrid) state.koraGrid = { stockTab: 'daily', finTab: 'cashflow', date: todayIso() };
    state.koraGridStyle = Object.assign(defaultGridStyle(), state.koraGridStyle || {});
    if (!state.koraGridStyle.colWidths) state.koraGridStyle.colWidths = {};
    if (!state.koraGridStyle.colStyles) state.koraGridStyle.colStyles = {};
    if (!state.customForms || typeof state.customForms !== 'object') {
      state.customForms = { sales: [], warehouse: [], purchase: [], customer: [], dispatch: [] };
    }
    ['sales', 'warehouse', 'purchase', 'customer', 'dispatch'].forEach((k) => {
      if (!Array.isArray(state.customForms[k])) state.customForms[k] = [];
    });
    if (!state.customFormTab) state.customFormTab = 'sales';
  }

  // ---------------------------------------------------------------------------
  // 1. Unified CSS (Matte Obsidian + 2x2 Dashboard + Swipe Hint + Kora Live Grid)
  // ---------------------------------------------------------------------------
  function injectUnifiedCss() {
    let st = document.getElementById('koraMatteThemeCss');
    if (!st) {
      st = document.createElement('style');
      st.id = 'koraMatteThemeCss';
      document.head.appendChild(st);
    }
    st.textContent = `
      :root {
        --bg: #070a0e !important; --bg-deep: #05080b !important;
        --surface: #0d1218 !important; --surface-deep: #090d12 !important;
        --card: #10161d !important;
        --border: rgba(148, 163, 184, 0.11) !important;
        --border-strong: rgba(148, 163, 184, 0.19) !important;
        --teal: #14b8a6 !important; --primary: #06b6d4 !important;
        --emerald: #10b981 !important; --amber: #f59e0b !important;
        --rose: #f43f5e !important; --text: #f1f5f9 !important; --muted: #8b9bb0 !important;
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

      /* === 2×2 ዳሽቦርድ KPI አቀማመጥ (ግማሽ ስክሪን ይቆጥባል!) === */
      .kpi-grid, .stats-grid, .kth-dash-2x2 {
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 7px !important;
        width: 100% !important;
      }
      .kpi-grid > *, .stats-grid > *, .kth-dash-2x2 > * {
        min-width: 0 !important;
        margin: 0 !important;
        padding: 9px 10px !important;
        border-radius: 12px !important;
      }
      .kpi-grid .kpi-lbl, .kth-dash-2x2 .kpi-lbl {
        font-size: 10px !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
      }
      .kpi-grid .kpi-val, .kth-dash-2x2 .kpi-val {
        font-size: 16.5px !important;
        line-height: 1.2 !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
      }
      .kth-dash-2x2 .kpi-sub, .kpi-grid .kpi-sub {
        font-size: 9.8px !important;
        margin-top: 2px !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
      }

      /* === ቋሚ ተንሳፋፊ ዳሰሳ === */
      .kth-bnav {
        position: fixed !important; left: 10px !important; right: 10px !important; bottom: 8px !important;
        width: auto !important; max-width: none !important; min-width: 0 !important;
        margin: 0 !important; transform: none !important;
        height: 64px !important; padding: 4px 6px !important; border-radius: 26px !important;
        background: rgba(11, 16, 22, 0.96) !important; backdrop-filter: blur(16px) !important;
        border: 1px solid rgba(148, 163, 184, 0.16) !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.65) !important;
        display: grid !important; grid-template-columns: repeat(5, 1fr) !important;
        align-items: center !important; gap: 2px !important; z-index: 95 !important; box-sizing: border-box !important;
      }
      .kth-bnav button {
        background: transparent !important; border: none !important; box-shadow: none !important;
        border-radius: 18px !important; height: 54px !important; padding: 3px 2px !important; margin: 0 !important;
        display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important;
        gap: 3px !important; position: relative !important; color: #8b9bb0 !important; transform: none !important; min-width: 0 !important; width: 100% !important;
      }
      .kth-bnav button.active { background: rgba(20, 184, 166, 0.08) !important; }
      .kth-nav-pill { width: 46px; height: 30px; border-radius: 15px; display: flex; align-items: center; justify-content: center; color: #8b9bb0; position: relative; transition: all 0.18s ease; }
      .kth-bnav button.active .kth-nav-pill { background: rgba(6, 182, 212, 0.18); color: #22d3ee; box-shadow: inset 0 0 0 1px rgba(34, 211, 238, 0.28); }
      .kth-nav-lbl { font-size: 9.8px; font-weight: 700; color: #8b9bb0; line-height: 1.1; white-space: nowrap; max-width: 100%; overflow: hidden; text-overflow: ellipsis; }
      .kth-bnav button.active .kth-nav-lbl { color: #22d3ee; font-weight: 800; }
      .kth-nav-bdg { position: absolute; top: -3px; right: 1px; min-width: 15px; height: 15px; padding: 0 4px; border-radius: 99px; background: #f43f5e; color: #fff; font-size: 9px; font-weight: 900; display: flex; align-items: center; justify-content: center; border: 1.5px solid #0b1016; }

      /* === ሙሉ ስክሪን Focus Mode (ቆጠራ እና የኮራ ሠንጠረዥ) === */
      html body.kth-focus-tally .kth-bnav,
      html body.kth-focus-grid .kth-bnav { display: none !important; }
      html body.kth-focus-tally.ktp-active .viewport {
        height: calc(100dvh - var(--kth-top-h, 46px)) !important;
        max-height: calc(100dvh - var(--kth-top-h, 46px)) !important;
        padding: 4px 8px 10px !important;
      }
      html body.kth-focus-tally.ktp-active .ktp-tap { height: 66px !important; }
      .kth-back-btn { color: #2dd4bf !important; border-color: rgba(20, 184, 166, 0.45) !important; background: rgba(20, 184, 166, 0.12) !important; }

      /* === በጣት ወደ ጎን መጎተቻ ጠቋሚ (Swipe-Right Feedback Pill) === */
      #kthSwipeHint {
        position: fixed; left: 0; top: 50%; transform: translate(-110%, -50%);
        z-index: 220; pointer-events: none;
        height: 42px; padding: 0 14px 0 10px; border-radius: 0 21px 21px 0;
        background: rgba(20, 184, 166, 0.94); color: #03201d;
        font-size: 12px; font-weight: 900;
        display: flex; align-items: center; gap: 6px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55);
        transition: opacity 0.14s ease; opacity: 0;
      }

      /* === የጎን ሜኑ SVG እና ድግምግሞሽ ማጥፊያ === */
      #drawerNav .drawer-item { display: flex !important; align-items: center !important; justify-content: space-between !important; gap: 10px !important; padding: 9px 11px !important; border-radius: 11px !important; font-size: 12.5px !important; font-weight: 700 !important; color: #cbd5e1 !important; }
      #drawerNav .drawer-item.active { background: rgba(20, 184, 166, 0.14) !important; border: 1px solid rgba(20, 184, 166, 0.45) !important; color: #2dd4bf !important; }
      #drawerNav .drawer-item.kth-dr-hidden, .kth-hide-pdf-btn { display: none !important; }
      .kth-dr-left { display: inline-flex; align-items: center; gap: 10px; min-width: 0; }
      .kth-dr-ico { width: 28px; height: 28px; border-radius: 8px; background: rgba(148, 163, 184, 0.08); color: #94a3b8; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
      #drawerNav .drawer-item.active .kth-dr-ico { background: rgba(20, 184, 166, 0.2); color: #2dd4bf; }
      body:not(.ktp-active):not(.kth-focus-tally):not(.kth-focus-grid) .viewport { padding-bottom: 86px !important; }

      /* === ሙሉ ስክሪን የኮራ ሠንጠረዥ (Kora Live Grid) === */
      .kg-overlay { position: fixed; inset: 0; z-index: 150; display: flex; flex-direction: column; background: #06090d; color: #f1f5f9; font-family: system-ui, -apple-system, sans-serif; }
      .kg-overlay.light { background: #f8fafc; color: #0f172a; }
      .kg-top { height: 48px; padding: 0 8px; flex-shrink: 0; display: flex; align-items: center; gap: 6px; background: #0b1016; border-bottom: 1px solid rgba(148,163,184,0.16); }
      .kg-overlay.light .kg-top { background: #ffffff; border-bottom-color: #cbd5e1; }
      .kg-tbtn { width: 34px; height: 34px; border-radius: 10px; border: none; background: transparent; color: inherit; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; cursor: pointer; }
      .kg-tbtn.on { background: rgba(20,184,166,0.2); color: #2dd4bf; }
      .kg-title-wrap { flex: 1; min-width: 0; display: flex; flex-direction: column; }
      .kg-title-wrap b { font-size: 14px; font-weight: 900; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .kg-title-wrap small { font-size: 10px; color: #8b9bb0; font-family: ui-monospace, monospace; }
      .kg-search-row { padding: 5px 8px; display: flex; align-items: center; gap: 6px; flex-shrink: 0; background: #0d131a; border-bottom: 1px solid rgba(148,163,184,0.14); }
      .kg-overlay.light .kg-search-row { background: #f1f5f9; border-bottom-color: #cbd5e1; }
      .kg-search-inp { flex: 1; height: 32px; border-radius: 9px; padding: 0 10px; border: 1px solid rgba(148,163,184,0.24); background: #070a0e; color: inherit; font-size: 12px; font-weight: 600; }
      .kg-overlay.light .kg-search-inp { background: #fff; border-color: #94a3b8; }

      .kg-body { flex: 1; min-height: 0; overflow: auto; -webkit-overflow-scrolling: touch; position: relative; }
      .kg-tbl { border-collapse: collapse; table-layout: fixed; min-width: 100%; }
      .kg-tbl th, .kg-tbl td { border: 1px solid rgba(148,163,184,0.18); box-sizing: border-box; overflow: hidden; text-overflow: ellipsis; }
      .kg-overlay.light .kg-tbl th, .kg-overlay.light .kg-tbl td { border-color: #cbd5e1; }
      .kg-tbl tr.kg-letters th { position: sticky; top: 0; z-index: 6; height: 24px; padding: 0 4px; background: #0f161f; color: #64748b; font-size: 10px; font-weight: 800; text-align: center; user-select: none; cursor: pointer; }
      .kg-overlay.light .kg-tbl tr.kg-letters th { background: #e2e8f0; color: #475569; }
      .kg-tbl tr.kg-letters th.col-sel { background: rgba(20,184,166,0.28) !important; color: #2dd4bf !important; border-bottom: 2px solid #14b8a6 !important; }
      .kg-resizer { position: absolute; top: 0; right: -4px; width: 14px; height: 100%; cursor: col-resize; touch-action: none; z-index: 8; display: flex; align-items: center; justify-content: center; }
      .kg-resizer::after { content: ''; width: 2px; height: 12px; border-radius: 2px; background: rgba(148,163,184,0.38); }
      .kg-tbl tr.kg-letters th.col-sel .kg-resizer::after { background: #2dd4bf; height: 16px; }
      .kg-tbl tr.kg-heads th { position: sticky; top: 24px; z-index: 5; background: #151e29; color: #f1f5f9; font-weight: 800; padding: 6px 6px; user-select: none; }
      .kg-overlay.light .kg-tbl tr.kg-heads th { background: #f1f5f9; color: #0f172a; }
      .kg-tbl .kg-rn { width: 32px; text-align: center; color: #64748b; background: #0c1117; font-family: ui-monospace, monospace; font-size: 10px; position: sticky; left: 0; z-index: 4; }
      .kg-overlay.light .kg-tbl .kg-rn { background: #f1f5f9; color: #64748b; }
      .kg-tbl tr.kg-letters th.kg-rn { z-index: 9; }
      .kg-tbl tr.kg-heads th.kg-rn { z-index: 8; }
      .kg-tbl td.col-sel { box-shadow: inset 1px 0 0 rgba(20,184,166,0.45), inset -1px 0 0 rgba(20,184,166,0.45); }
      .kg-tbl tr.kg-cat td { background: rgba(16, 185, 129, 0.22) !important; color: #a7f3d0 !important; font-weight: 900 !important; text-align: left !important; }
      .kg-overlay.light .kg-tbl tr.kg-cat td { background: #bbf7d0 !important; color: #065f46 !important; }
      .kg-tbl tr.kg-in td { background: rgba(16, 185, 129, 0.11); }
      .kg-overlay.light .kg-tbl tr.kg-in td { background: #dcfce7; }
      .kg-tbl tr.kg-void td { background: rgba(239, 68, 68, 0.24) !important; color: #fca5a5 !important; font-weight: 800; }
      .kg-overlay.light .kg-tbl tr.kg-void td { background: #fee2e2 !important; color: #991b1b !important; }
      .kg-tbl tr.kg-zero td { background: rgba(245, 158, 11, 0.22) !important; color: #fde68a !important; }
      .kg-overlay.light .kg-tbl tr.kg-zero td { background: #fef3c7 !important; color: #92400e !important; }
      .kg-tbl tr.kg-low td { background: rgba(239, 68, 68, 0.13); color: #fca5a5; }
      .kg-overlay.light .kg-tbl tr.kg-low td { background: #fef2f2; color: #b91c1c; }
      .kg-tbl tr.kg-tot td { position: sticky; bottom: 0; z-index: 5; background: #131c26 !important; color: #2dd4bf !important; font-weight: 900 !important; border-top: 2px solid #14b8a6 !important; }
      .kg-overlay.light .kg-tbl tr.kg-tot td { background: #e2e8f0 !important; color: #0f766e !important; }

      .kg-fmt-bar { display: flex; align-items: center; gap: 4px; overflow-x: auto; padding: 5px 8px; flex-shrink: 0; background: #0d131a; border-top: 1px solid rgba(148,163,184,0.16); }
      .kg-overlay.light .kg-fmt-bar { background: #f1f5f9; border-top-color: #cbd5e1; }
      .kg-fbtn { height: 31px; min-width: 31px; padding: 0 7px; border-radius: 8px; border: 1px solid rgba(148,163,184,0.18); background: #070a0e; color: inherit; font-size: 12px; font-weight: 800; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; gap: 3px; cursor: pointer; }
      .kg-overlay.light .kg-fbtn { background: #ffffff; border-color: #cbd5e1; }
      .kg-fbtn.on { background: rgba(20,184,166,0.22); border-color: #14b8a6; color: #2dd4bf; }
      .kg-fsep { width: 1px; height: 20px; background: rgba(148,163,184,0.22); flex-shrink: 0; margin: 0 2px; }

      .kg-sheet-tabs { display: flex; align-items: center; gap: 5px; overflow-x: auto; padding: 6px 8px 8px; flex-shrink: 0; background: #090d12; border-top: 1px solid rgba(148,163,184,0.14); }
      .kg-overlay.light .kg-sheet-tabs { background: #e2e8f0; border-top-color: #cbd5e1; }
      .kg-stab { height: 33px; padding: 0 11px; border-radius: 17px; flex-shrink: 0; border: 1px solid rgba(148,163,184,0.18); background: #0f151d; color: #94a3b8; font-size: 11.5px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; white-space: nowrap; }
      .kg-overlay.light .kg-stab { background: #ffffff; color: #475569; border-color: #cbd5e1; }
      .kg-stab.on { background: rgba(20,184,166,0.22); border-color: #14b8a6; color: #2dd4bf; }
      .kg-overlay.light .kg-stab.on { background: #0f766e; color: #ffffff; border-color: #0f766e; }

      .kg-menu-pop { position: fixed; top: 52px; right: 8px; width: 238px; z-index: 180; background: #101720; border: 1px solid rgba(148,163,184,0.25); border-radius: 14px; padding: 6px; box-shadow: 0 14px 36px rgba(0,0,0,0.65); display: flex; flex-direction: column; gap: 3px; }
      .kg-overlay.light .kg-menu-pop { background: #ffffff; color: #0f172a; border-color: #cbd5e1; }
      .kg-mitem { height: 36px; padding: 0 10px; border-radius: 9px; border: none; background: transparent; color: inherit; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: space-between; cursor: pointer; text-align: left; }
      .kg-mitem:active { background: rgba(20,184,166,0.16); }
      .kg-msep { border: 0; border-top: 1px solid rgba(148,163,184,0.16); margin: 3px 0; }
      .ksf-field-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; background: #080c10; border: 1px solid rgba(148,163,184,0.16); border-radius: 9px; padding: 6px 8px; }
    `;
  }

  // ---------------------------------------------------------------------------
  // 2. የዳሽቦርድ 4 ካርዶችን ወደ 2×2 መሰብሰብ
  // ---------------------------------------------------------------------------
  function enforceDashboard2x2() {
    if (!hasState() || state.activeMainTab !== 'dashboard') return;
    const root = document.getElementById('viewRoot');
    if (!root) return;

    // ነባር .kpi-grid / .stats-grid ካለ በቀጥታ 2×2 ማድረግ
    root.querySelectorAll('.kpi-grid, .stats-grid').forEach((g) => g.classList.add('kth-dash-2x2'));

    // 4ቱ የዳሽቦርድ ካርዶች በቀጥታ በ#viewRoot ውስጥ ተደርድረው ከሆነ በ2×2 wrapper መሰብሰብ
    if (!root.querySelector('.kth-dash-2x2')) {
      const kpis = [];
      for (const ch of Array.from(root.children)) {
        if (ch.querySelector('table, canvas, select')) break;
        const txt = (ch.textContent || '').trim();
        if (ch.classList.contains('kpi') || (ch.classList.contains('card') && txt.length < 95 && /ብር|etb|[\d,]+/i.test(txt))) {
          kpis.push(ch);
        } else if (kpis.length >= 2) break;
      }
      if (kpis.length >= 2) {
        const wrap = document.createElement('div');
        wrap.className = 'kth-dash-2x2';
        root.insertBefore(wrap, kpis[0]);
        kpis.forEach((el) => wrap.appendChild(el));
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 3. እውነተኛ በጣት ወደ ጎን መጎተቻ (In-App Touch Swipe-Right to Exit)
  // ---------------------------------------------------------------------------
  function installTouchSwipeExit() {
    if (global._kthSwipeInstalled) return;
    global._kthSwipeInstalled = true;

    let hint = document.getElementById('kthSwipeHint');
    if (!hint) {
      hint = document.createElement('div');
      hint.id = 'kthSwipeHint';
      hint.innerHTML = `${SVG.back}<span>${L('ተመለስ', 'Back')}</span>`;
      document.body.appendChild(hint);
    }

    let tracking = false, startX = 0, startY = 0, lastDx = 0;

    function canSwipeNow(target, x) {
      if (document.querySelector('#modalOverlay.open, .modal-bg.open, .modal-backdrop.open')) return false;
      if (target && target.closest('#ktpSlide, .kg-resizer, input, select, textarea, .no-scrollbar')) return false;

      if (gridOpen) {
        const body = document.querySelector('.kg-body');
        // በሰሌዳው ላይ ከግራ ጠርዝ (<=52px) ወይም ሠንጠረዡ መጀመሪያ ላይ ሲሆን ብቻ ወደ ቀኝ ጎትቶ መውጣት
        return x <= 52 || !body || body.scrollLeft <= 3;
      }
      if (hasState() && (state.activeMainTab === 'tally' || String(state.activeMainTab || '').startsWith('setup:'))) {
        return true;
      }
      return false;
    }

    document.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) { tracking = false; return; }
      const t = e.touches[0];
      if (!canSwipeNow(e.target, t.clientX)) { tracking = false; return; }
      tracking = true;
      startX = t.clientX;
      startY = t.clientY;
      lastDx = 0;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (!tracking || e.touches.length !== 1) return;
      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = Math.abs(t.clientY - startY);
      if (dx < 8 || dy > 65 || dy > dx * 0.75) {
        if (dy > 45 && dx < 28) tracking = false;
        hint.style.opacity = '0';
        hint.style.transform = 'translate(-110%, -50%)';
        lastDx = 0;
        return;
      }
      lastDx = dx;
      const pct = Math.min(1, dx / 85);
      hint.style.opacity = String(pct);
      hint.style.transform = `translate(${Math.round(-110 + pct * 110)}%, -50%)`;
    }, { passive: true });

    const finishSwipe = () => {
      if (!tracking) return;
      tracking = false;
      hint.style.opacity = '0';
      hint.style.transform = 'translate(-110%, -50%)';
      if (lastDx >= 78) {
        if (navigator.vibrate) navigator.vibrate(16);
        if (gridOpen) closeGrid();
        else if (hasState() && (state.activeMainTab === 'tally' || String(state.activeMainTab || '').startsWith('setup:'))) {
          exitFocusScreen();
        }
      }
      lastDx = 0;
    };

    document.addEventListener('touchend', finishSwipe, { passive: true });
    document.addEventListener('touchcancel', finishSwipe, { passive: true });
  }

  // ---------------------------------------------------------------------------
  // 4. ሙሉ ስክሪን የኮራ ሠንጠረዥ (ለክምችት እና ሂሳብ)
  // ---------------------------------------------------------------------------
  function pushStyleUndo() {
    styleUndoStack.push(JSON.stringify(state.koraGridStyle));
    if (styleUndoStack.length > 25) styleUndoStack.shift();
  }

  function dateRangeStart(tab, refDate) {
    const base = new Date((refDate || todayIso()) + 'T00:00:00');
    if (tab === 'weekly') { const d = new Date(base); d.setDate(d.getDate() - 6); return d.toISOString().slice(0, 10); }
    if (tab === 'monthly') return (refDate || todayIso()).slice(0, 7) + '-01';
    return refDate || todayIso();
  }

  function getStockLedgerRows(startIso, endIso) {
    const br = state.branchScope || 'all';
    const q = gridSearchQuery.trim().toLowerCase();
    const rows = (state.warehouseLedger || []).map((w) => ({
      docNo: w.docNo || '-', itemId: w.itemId, itemName: w.itemName || '-',
      openBal: Number(w.openBal || 0), inQty: Number(w.inQty || 0),
      outQty: Number(w.outQty || 0), endBal: Number(w.endBal || 0),
      party: w.party || '-', branch: w.branch || '',
      date: (w.date || todayIso()).slice(0, 10),
      isVoid: String(w.status || '').toLowerCase() === 'void'
    }));
    (state.erp?.voidLeaves || []).forEach((v) => {
      rows.push({
        docNo: v.docNo || 'VOID', itemId: null, itemName: 'VOID',
        openBal: 0, inQty: 0, outQty: 0, endBal: 0,
        party: `${L('የተሰረዘ ሰነድ', 'VOID')} (${v.reason || '-'})`,
        branch: br === 'all' ? '' : br,
        date: (v.date || todayIso()).slice(0, 10), isVoid: true
      });
    });
    return rows.filter((r) => {
      if (br !== 'all' && r.branch && r.branch !== br) return false;
      if (startIso && r.date && r.date.length === 10 && r.date < startIso) return false;
      if (endIso && r.date && r.date.length === 10 && r.date > endIso) return false;
      if (q && !`${r.docNo} ${r.itemName} ${r.party} ${r.date}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  function buildGridDataset() {
    ensureGridState();
    const refDate = state.koraGrid.date || todayIso();
    const st = state.koraGridStyle;
    const q = gridSearchQuery.trim().toLowerCase();

    if (gridDomain === 'stock') {
      const tab = state.koraGrid.stockTab || 'daily';
      if (tab === 'history') {
        const cols = [
          { k: 'doc',   lbl: L('ሰነድ / ፓድ', 'Doc / Pad'), w: 92,  defAlign: 'left' },
          { k: 'item',  lbl: L('የዕቃ አይነት', 'Item'),     w: 140, defAlign: 'left' },
          { k: 'open',  lbl: L('መነሻ', 'Open'),           w: 62,  defAlign: 'right' },
          { k: 'in',    lbl: L('የገባ (+)', 'IN (+)'),     w: 64,  defAlign: 'right' },
          { k: 'out',   lbl: L('የወጣ (-)', 'OUT (-)'),    w: 64,  defAlign: 'right' },
          { k: 'bal',   lbl: L('ቀሪ', 'Balance'),         w: 66,  defAlign: 'right' },
          { k: 'party', lbl: L('ደንበኛ / አቅራቢ', 'Party'),  w: 118, defAlign: 'left' },
          { k: 'date',  lbl: L('ቀን', 'Date'),            w: 90,  defAlign: 'center' }
        ];
        const list = getStockLedgerRows('', '');
        let tIn = 0, tOut = 0;
        const rows = list.map((r) => {
          if (!r.isVoid) { tIn += r.inQty; tOut += r.outQty; }
          const rowCls = r.isVoid ? 'kg-void' : (r.endBal === 0 && r.outQty > 0 ? 'kg-zero' : (r.inQty > 0 ? 'kg-in' : ''));
          return {
            rowCls,
            cells: [r.docNo, r.itemName, r.isVoid ? '-' : sNum(r.openBal), r.isVoid || !r.inQty ? '-' : '+' + sNum(r.inQty), r.isVoid || !r.outQty ? '-' : '-' + sNum(r.outQty), r.isVoid ? '-' : sNum(r.endBal), r.party, r.date]
          };
        });
        return { title: L('ሙሉ ዕለታዊ ታሪክ', 'Full Stock History'), cols, rows, totals: [L('ድምር', 'TOTAL'), `${rows.length}`, '-', '+' + sNum(tIn), '-' + sNum(tOut), '-', '', ''] };
      }

      const cols = [
        { k: 'item', lbl: L('የዕቃ አይነት', 'Item Type'), w: 150, defAlign: 'left' },
        { k: 'open', lbl: L('መነሻ', 'Start'),           w: 68,  defAlign: 'right' },
        { k: 'in',   lbl: L('የገባ (+)', 'IN (+)'),     w: 68,  defAlign: 'right' },
        { k: 'out',  lbl: L('የወጣ (-)', 'OUT (-)'),    w: 68,  defAlign: 'right' },
        { k: 'bal',  lbl: L('ቀሪ', 'Balance'),         w: 72,  defAlign: 'right' }
      ];
      const startIso = tab === 'all' ? '' : dateRangeStart(tab, refDate);
      const endIso = tab === 'all' ? '' : refDate;
      const br = state.branchScope || 'all';
      const ledger = getStockLedgerRows(startIso, endIso).filter((r) => !r.isVoid);
      const agg = {};
      ledger.forEach((r) => {
        const k = String(r.itemId || r.itemName);
        if (!agg[k]) agg[k] = { inQty: 0, outQty: 0 };
        agg[k].inQty += r.inQty; agg[k].outQty += r.outQty;
      });
      const groups = {};
      (state.inventory || []).forEach((it) => {
        if (q && !`${it.name} ${it.category || ''}`.toLowerCase().includes(q)) return;
        const cur = typeof getItemStock === 'function' ? Number(getItemStock(it, br) || 0) : Number(it.stock || 0);
        const mv = agg[String(it.id)] || agg[it.name] || { inQty: 0, outQty: 0 };
        const open = Math.max(0, cur - mv.inQty + mv.outQty);
        if (st.hideZero && open === 0 && mv.inQty === 0 && mv.outQty === 0 && cur === 0) return;
        const cat = (it.category || L('መደበኛ ምርቶች', 'General')).trim();
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push({ name: it.name, open, inQty: mv.inQty, outQty: mv.outQty, cur, min: Number(it.minStock ?? 5) });
      });
      const rows = [];
      let tOpen = 0, tIn = 0, tOut = 0, tCur = 0;
      Object.keys(groups).forEach((cat) => {
        rows.push({ isCat: true, cat: `${cat} (${groups[cat].length})` });
        groups[cat].forEach((r) => {
          tOpen += r.open; tIn += r.inQty; tOut += r.outQty; tCur += r.cur;
          rows.push({
            rowCls: r.cur === 0 || r.cur <= r.min ? 'kg-low' : '',
            cells: [r.name, sNum(r.open), r.inQty ? '+' + sNum(r.inQty) : '0', r.outQty ? '-' + sNum(r.outQty) : '0', sNum(r.cur)]
          });
        });
      });
      const tLbl = tab === 'weekly' ? L('ሳምንታዊ ክምችት', 'Weekly Stock') : (tab === 'monthly' ? L('ወርሃዊ ክምችት', 'Monthly Stock') : L('ዕለታዊ ክምችት', 'Daily Stock'));
      return { title: tLbl, cols, rows, totals: [L('ጠቅላላ ድምር', 'TOTAL'), sNum(tOpen), '+' + sNum(tIn), '-' + sNum(tOut), sNum(tCur)] };
    }

    // === ሂሳብ ===
    const ftab = state.koraGrid.finTab || 'cashflow';
    if (ftab === 'banks') {
      const cols = [
        { k: 'bank', lbl: L('ባንክ / ካዝና', 'Account'), w: 135, defAlign: 'left' },
        { k: 'acc',  lbl: L('ቁጥር', 'Account No'),     w: 112, defAlign: 'left' },
        { k: 'open', lbl: L('መነሻ', 'Opening'),        w: 80,  defAlign: 'right' },
        { k: 'bal',  lbl: L('ቀሪ (ብር)', 'Balance'),   w: 92,  defAlign: 'right' }
      ];
      let sum = 0;
      const rows = (state.banks || []).filter((b) => !q || `${b.name} ${b.accNo || b.account || ''}`.toLowerCase().includes(q)).map((b) => {
        const bal = Number(b.balance ?? b.endBal ?? b.openBal ?? 0);
        sum += bal;
        return { rowCls: bal > 0 ? 'kg-in' : 'kg-low', cells: [b.name || '-', b.accNo || b.account || '-', sNum(b.openBal || 0), sNum(bal)] };
      });
      return { title: L('ባንክ እና ካዝና', 'Banks & Cash'), cols, rows, totals: [L('ጠቅላላ ገንዘብ', 'TOTAL'), '', '-', sNum(sum)] };
    }
    if (ftab === 'credit') {
      const cols = [
        { k: 'cust', lbl: L('ደንበኛ', 'Customer'),  w: 140, defAlign: 'left' },
        { k: 'ph',   lbl: L('ስልክ', 'Phone'),       w: 102, defAlign: 'left' },
        { k: 'due',  lbl: L('ቀሪ ዱቤ (ብር)', 'Due'), w: 92,  defAlign: 'right' },
        { k: 'lim',  lbl: L('ገደብ', 'Limit'),       w: 82,  defAlign: 'right' }
      ];
      const map = {};
      (state.customers || []).forEach((c) => { if (c.name) map[c.name] = { name: c.name, phone: c.phone || '-', due: Number(c.balance || c.credit || 0), lim: 0 }; });
      (state.erp?.creditRules || []).forEach((r) => {
        if (!map[r.name]) map[r.name] = { name: r.name, phone: r.phone || '-', due: Number(r.manualBal || 0), lim: 0 };
        map[r.name].lim = Number(r.limit || 0);
      });
      let sum = 0;
      const rows = Object.values(map).filter((c) => !q || c.name.toLowerCase().includes(q)).map((c) => {
        sum += c.due;
        const over = c.lim > 0 && c.due >= c.lim;
        return { rowCls: over ? 'kg-void' : (c.due > 0 ? 'kg-zero' : ''), cells: [c.name, c.phone, sNum(c.due), c.lim > 0 ? sNum(c.lim) : '∞'] };
      });
      return { title: L('የደንበኛ ዱቤ', 'Customer Credits'), cols, rows, totals: [L('ጠቅላላ ዱቤ', 'TOTAL'), '', sNum(sum), ''] };
    }
    const cols = [
      { k: 'doc',  lbl: L('ሰነድ', 'Ref'),            w: 86,  defAlign: 'left' },
      { k: 'desc', lbl: L('ዝርዝር / ደንበኛ', 'Detail'), w: 145, defAlign: 'left' },
      { k: 'in',   lbl: L('ገቢ (+)', 'Income'),      w: 84,  defAlign: 'right' },
      { k: 'out',  lbl: L('ወጪ (-)', 'Expense'),     w: 84,  defAlign: 'right' },
      { k: 'date', lbl: L('ቀን', 'Date'),            w: 88,  defAlign: 'center' }
    ];
    const rows = [];
    let tIn = 0, tOut = 0;
    (state.sales || []).forEach((s) => {
      const amt = Number(s.total || 0);
      const desc = `${s.party || s.customer || '-'} · ${s.itemName || ''}`.trim();
      if (q && !`${s.docNo || s.invNo || ''} ${desc}`.toLowerCase().includes(q)) return;
      tIn += amt;
      rows.push({ rowCls: 'kg-in', cells: [s.docNo || s.invNo || 'SALE', desc, '+' + sNum(amt), '-', (s.date || todayIso()).slice(0, 10)] });
    });
    (state.expenses || []).forEach((e) => {
      const amt = Number(e.amount || e.total || 0);
      const desc = `${e.title || e.category || e.note || L('ወጪ', 'Expense')}`;
      if (q && !desc.toLowerCase().includes(q)) return;
      tOut += amt;
      rows.push({ rowCls: 'kg-low', cells: [e.ref || 'EXP', desc, '-', '-' + sNum(amt), (e.date || todayIso()).slice(0, 10)] });
    });
    const net = tIn - tOut;
    return { title: ftab === 'pnl' ? `${L('ትርፍና ኪሳራ', 'P&L')} (${sMoney(net)})` : L('የሂሳብ መዝገብ', 'Finance Ledger'), cols, rows, totals: [L('የተጣራ', 'NET'), sMoney(net), '+' + sNum(tIn), '-' + sNum(tOut), ''] };
  }

  function getEffectiveStyle(colKey, defAlign) {
    const st = state.koraGridStyle;
    const cs = (colKey && st.colStyles?.[colKey]) || {};
    return {
      bold: cs.bold !== undefined ? cs.bold : st.bold,
      italic: cs.italic !== undefined ? cs.italic : st.italic,
      align: cs.align || (st.align !== 'auto' ? st.align : defAlign),
      color: cs.color || '',
      bg: cs.bg || ''
    };
  }

  function renderGridOverlay() {
    ensureGridState();
    injectUnifiedCss();
    let ov = document.getElementById('koraLiveGridOverlay');
    if (!gridOpen) {
      if (ov) ov.remove();
      document.body.classList.remove('kth-focus-grid');
      return;
    }
    document.body.classList.add('kth-focus-grid');
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'koraLiveGridOverlay';
      document.body.appendChild(ov);
    }

    const st = state.koraGridStyle;
    ov.className = `kg-overlay ${st.theme === 'light' ? 'light' : ''}`;
    const ds = buildGridDataset();
    const curSelStyle = selectedColKey ? getEffectiveStyle(selectedColKey, 'left') : { bold: st.bold, italic: st.italic, align: st.align, color: '', bg: '' };

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const colgroupHtml = `<colgroup><col style="width:32px;">${ds.cols.map((c) => `<col style="width:${Number(st.colWidths[c.k] || c.w)}px;">`).join('')}</colgroup>`;
    const letterRow = `<tr class="kg-letters"><th class="kg-rn" onclick="KoraGrid.selectCol(null)">#</th>${ds.cols.map((c, i) => `<th class="${selectedColKey === c.k ? 'col-sel' : ''}" onclick="KoraGrid.selectCol('${c.k}')">${letters[i] || i + 1}<span class="kg-resizer" data-col="${c.k}" data-defw="${c.w}"></span></th>`).join('')}</tr>`;
    const headRow = `<tr class="kg-heads"><th class="kg-rn"></th>${ds.cols.map((c) => {
      const ef = getEffectiveStyle(c.k, c.defAlign);
      return `<th class="${selectedColKey === c.k ? 'col-sel' : ''}" style="font-size:${st.fontSize}px;text-align:${ef.align};white-space:${st.wrap ? 'normal' : 'nowrap'};">${sEsc(c.lbl)}</th>`;
    }).join('')}</tr>`;

    let rn = 0;
    const bodyHtml = ds.rows.map((r) => {
      rn++;
      if (r.isCat) return `<tr class="kg-cat"><td class="kg-rn">${rn}</td><td colspan="${ds.cols.length}" style="padding:${st.rowPad}px 7px;font-size:${st.fontSize}px;">${sEsc(r.cat)}</td></tr>`;
      return `<tr class="${r.rowCls || ''}"><td class="kg-rn">${rn}</td>${r.cells.map((val, ci) => {
        const c = ds.cols[ci], ef = getEffectiveStyle(c.k, c.defAlign);
        const css = [`padding:${st.rowPad}px 7px`, `font-size:${st.fontSize}px`, `text-align:${ef.align}`, `font-weight:${ef.bold ? '800' : '500'}`, `font-style:${ef.italic ? 'italic' : 'normal'}`, `white-space:${st.wrap ? 'normal' : 'nowrap'}`, ef.color ? `color:${ef.color}` : '', ef.bg ? `background:${ef.bg}` : ''].filter(Boolean).join(';');
        return `<td class="${selectedColKey === c.k ? 'col-sel' : ''}" style="${css}">${sEsc(val)}</td>`;
      }).join('')}</tr>`;
    }).join('') || `<tr><td colspan="${ds.cols.length + 1}" style="text-align:center;padding:30px;color:#8b9bb0;">${sEsc(L('ምንም መረጃ የለም', 'No records'))}</td></tr>`;

    const totRow = ds.totals ? `<tr class="kg-tot"><td class="kg-rn">Σ</td>${ds.totals.map((val, ci) => {
      const c = ds.cols[ci], ef = getEffectiveStyle(c.k, c.defAlign);
      return `<td style="padding:${st.rowPad + 1}px 7px;font-size:${st.fontSize}px;text-align:${ef.align};">${sEsc(val)}</td>`;
    }).join('')}</tr>` : '';

    const bottomTabsHtml = gridDomain === 'stock'
      ? [['daily', L('ዕለታዊ', 'Daily'), true], ['weekly', L('ሳምንታዊ', 'Weekly'), true], ['monthly', L('ወርሃዊ', 'Monthly'), true], ['history', L('ሙሉ ታሪክ', 'Full Log'), false]]
          .map(([k, lbl, lk]) => `<button type="button" class="kg-stab ${state.koraGrid.stockTab === k ? 'on' : ''}" onclick="KoraGrid.setTab('${k}')">${lk ? SVG.lock : ''}${sEsc(lbl)}</button>`).join('')
      : [['cashflow', L('ገቢ / ወጪ', 'Cashflow'), true], ['banks', L('ባንክ / ካዝና', 'Banks'), true], ['credit', L('ዱቤ', 'Credit'), true], ['pnl', L('ትርፍ / ኪሳራ', 'P&L'), true]]
          .map(([k, lbl, lk]) => `<button type="button" class="kg-stab ${state.koraGrid.finTab === k ? 'on' : ''}" onclick="KoraGrid.setTab('${k}')">${lk ? SVG.lock : ''}${sEsc(lbl)}</button>`).join('');

    const menuPop = gridMenuOpen ? `
      <div class="kg-menu-pop" onclick="event.stopPropagation()">
        <button type="button" class="kg-mitem" onclick="KoraGrid.toggleTheme()"><span>${sEsc(st.theme === 'dark' ? L('ነጭ ገጽታ (Light)', 'Light Theme') : L('ጥቁር ገጽታ (Dark)', 'Dark Theme'))}</span><span>${st.theme === 'dark' ? '☀️' : '🌙'}</span></button>
        <button type="button" class="kg-mitem" onclick="KoraGrid.toggleHideZero()"><span>${sEsc(L('ዜሮ ቀሪ ደብቅ', 'Hide Zero Rows'))}</span><span>${st.hideZero ? '✓' : ''}</span></button>
        <button type="button" class="kg-mitem" onclick="KoraGrid.cyclePaper()"><span>${sEsc(L('የወረቀት መጠን', 'Paper Size'))}</span><b>${st.paper}</b></button>
        <hr class="kg-msep">
        <button type="button" class="kg-mitem" onclick="KoraGrid.exportPdf()"><span>${sEsc(L('PDF / ህትመት (እንደታየው)', 'PDF / Print'))}</span><span>PDF</span></button>
        <button type="button" class="kg-mitem" onclick="KoraGrid.exportXls()"><span>${sEsc(L('ሰንጠረዥ አውርድ (.xls)', 'Export (.xls)'))}</span><span>XLS</span></button>
        <button type="button" class="kg-mitem" onclick="KoraGrid.exportCsv()"><span>${sEsc(L('CSV ፋይል አውርድ', 'Export CSV'))}</span><span>CSV</span></button>
        <button type="button" class="kg-mitem" onclick="KoraGrid.shareSheet()"><span>${sEsc(L('ቀጥታ አጋራ (Share)', 'Share'))}</span><span>➔</span></button>
        <hr class="kg-msep">
        <button type="button" class="kg-mitem" style="color:#fb7185;" onclick="KoraGrid.resetStyle()"><span>${sEsc(L('ቅርጸቱን ወደ ነባር መልስ', 'Reset Layout'))}</span><span>↺</span></button>
      </div>` : '';

    ov.innerHTML = `
      <div class="kg-top">
        <button type="button" class="kg-tbtn" onclick="KoraGrid.close()" aria-label="Back">${SVG.back}</button>
        <div class="kg-title-wrap">
          <b>${sEsc(ds.title)}</b>
          <small>${sEsc(state.orgName || 'ኮራ ስቶክ')} · ${sEsc(state.koraGrid.date)}${selectedColKey ? ` · ${L('ዓምድ', 'Col')} ${selectedColKey.toUpperCase()}` : ''}</small>
        </div>
        <button type="button" class="kg-tbtn" onclick="KoraGrid.undo()">${SVG.undo}</button>
        <button type="button" class="kg-tbtn ${gridSearchOpen ? 'on' : ''}" onclick="KoraGrid.toggleSearch()">${SVG.search}</button>
        <button type="button" class="kg-tbtn ${gridMenuOpen ? 'on' : ''}" onclick="KoraGrid.toggleMenu(event)">${SVG.dots}</button>
      </div>

      ${gridSearchOpen ? `<div class="kg-search-row"><input id="kgSearchInp" class="kg-search-inp" value="${sEsc(gridSearchQuery)}" placeholder="${sEsc(L('ዕቃ፣ ሰነድ ወይም ደንበኛ ፈልግ...', 'Search...'))}" oninput="KoraGrid.setQuery(this.value)"><input type="date" class="kg-search-inp" style="flex:0 0 130px;" value="${sEsc(state.koraGrid.date)}" onchange="KoraGrid.setDate(this.value)"></div>` : ''}

      <div class="kg-body" onclick="if(KoraGrid._closeMenuIfOpen()) return;">
        <table class="kg-tbl">${colgroupHtml}<thead>${letterRow}${headRow}</thead><tbody>${bodyHtml}${totRow}</tbody></table>
      </div>

      <div class="kg-fmt-bar no-scrollbar">
        <button type="button" class="kg-fbtn ${curSelStyle.bold ? 'on' : ''}" onclick="KoraGrid.toggleFmt('bold')"><b>B</b></button>
        <button type="button" class="kg-fbtn ${curSelStyle.italic ? 'on' : ''}" onclick="KoraGrid.toggleFmt('italic')"><i>I</i></button>
        <span class="kg-fsep"></span>
        <button type="button" class="kg-fbtn" onclick="KoraGrid.stepFont(-1)">A-</button>
        <span style="font-size:11px;font-family:ui-monospace,monospace;font-weight:800;padding:0 3px;">${st.fontSize}</span>
        <button type="button" class="kg-fbtn" onclick="KoraGrid.stepFont(1)">A+</button>
        <span class="kg-fsep"></span>
        <button type="button" class="kg-fbtn" onclick="KoraGrid.stepColW(-14)" title="Narrow">↔-</button>
        <button type="button" class="kg-fbtn" onclick="KoraGrid.stepColW(14)" title="Widen">↔+</button>
        <span class="kg-fsep"></span>
        <button type="button" class="kg-fbtn ${curSelStyle.align === 'left' ? 'on' : ''}" onclick="KoraGrid.setAlign('left')">${SVG.alignL}</button>
        <button type="button" class="kg-fbtn ${curSelStyle.align === 'center' ? 'on' : ''}" onclick="KoraGrid.setAlign('center')">${SVG.alignC}</button>
        <button type="button" class="kg-fbtn ${curSelStyle.align === 'right' ? 'on' : ''}" onclick="KoraGrid.setAlign('right')">${SVG.alignR}</button>
        <span class="kg-fsep"></span>
        <button type="button" class="kg-fbtn" onclick="KoraGrid.cycleTextColor()"><span style="border-bottom:3px solid ${curSelStyle.color || '#2dd4bf'};line-height:1;">A</span></button>
        <button type="button" class="kg-fbtn" onclick="KoraGrid.cycleFillColor()">${SVG.fill}</button>
        <span class="kg-fsep"></span>
        <button type="button" class="kg-fbtn" onclick="KoraGrid.cycleRowPad()">↕ ${st.rowPad === 3 ? L('ጥብቅ', 'Sm') : (st.rowPad === 10 ? L('ሰፊ', 'Lg') : L('መደበኛ', 'Md'))}</button>
        <button type="button" class="kg-fbtn ${st.wrap ? 'on' : ''}" onclick="KoraGrid.toggleWrap()">${SVG.wrap}</button>
      </div>

      <div class="kg-sheet-tabs no-scrollbar">
        ${bottomTabsHtml}
        <input type="date" style="margin-left:auto;height:31px;border-radius:15px;padding:0 9px;border:1px solid rgba(148,163,184,0.22);background:#0f151d;color:#cbd5e1;font-size:11px;font-family:ui-monospace,monospace;flex-shrink:0;" value="${sEsc(state.koraGrid.date)}" onchange="KoraGrid.setDate(this.value)">
      </div>
      ${menuPop}`;

    ov.querySelectorAll('.kg-resizer').forEach((handle) => {
      handle.onpointerdown = (e) => {
        e.stopPropagation(); e.preventDefault();
        const colKey = handle.dataset.col, startX = e.clientX;
        const startW = Number(state.koraGridStyle.colWidths[colKey] || handle.dataset.defw || 90);
        pushStyleUndo();
        handle.setPointerCapture(e.pointerId);
        handle.onpointermove = (ev) => {
          const nw = Math.max(46, Math.min(300, Math.round(startW + (ev.clientX - startX))));
          state.koraGridStyle.colWidths[colKey] = nw;
          const idx = Array.from(ov.querySelectorAll('.kg-resizer')).indexOf(handle);
          const colEl = ov.querySelectorAll('colgroup col')[idx + 1];
          if (colEl) colEl.style.width = nw + 'px';
        };
        handle.onpointerup = () => { handle.onpointermove = null; saveState(); };
      };
    });
  }

  function buildExactExportHtml() {
    const ds = buildGridDataset(), st = state.koraGridStyle;
    const colTags = ds.cols.map((c) => `<col style="width:${Number(st.colWidths[c.k] || c.w)}px;">`).join('');
    const headCells = ds.cols.map((c) => {
      const ef = getEffectiveStyle(c.k, c.defAlign);
      return `<th style="background:#0f172a;color:#fff;padding:${st.rowPad + 1}px 6px;font-size:${st.fontSize}px;text-align:${ef.align};">${sEsc(c.lbl)}</th>`;
    }).join('');
    const bodyRows = ds.rows.map((r) => {
      if (r.isCat) return `<tr style="background:#bbf7d0;color:#065f46;font-weight:bold;"><td colspan="${ds.cols.length}" style="padding:${st.rowPad}px 7px;font-size:${st.fontSize}px;">${sEsc(r.cat)}</td></tr>`;
      const bg = r.rowCls === 'kg-void' ? '#fee2e2' : (r.rowCls === 'kg-zero' ? '#fef3c7' : (r.rowCls === 'kg-in' ? '#dcfce7' : (r.rowCls === 'kg-low' ? '#fef2f2' : '#ffffff')));
      return `<tr style="background:${bg};">${r.cells.map((val, ci) => {
        const c = ds.cols[ci], ef = getEffectiveStyle(c.k, c.defAlign);
        return `<td style="padding:${st.rowPad}px 6px;font-size:${st.fontSize}px;text-align:${ef.align};font-weight:${ef.bold ? 'bold' : 'normal'};font-style:${ef.italic ? 'italic' : 'normal'};white-space:${st.wrap ? 'normal' : 'nowrap'};">${sEsc(val)}</td>`;
      }).join('')}</tr>`;
    }).join('');
    const totRow = ds.totals ? `<tr style="background:#e2e8f0;font-weight:bold;">${ds.totals.map((val, ci) => {
      const c = ds.cols[ci], ef = getEffectiveStyle(c.k, c.defAlign);
      return `<td style="padding:${st.rowPad + 1}px 6px;font-size:${st.fontSize}px;text-align:${ef.align};">${sEsc(val)}</td>`;
    }).join('')}</tr>` : '';
    return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"><style>@page{size:${st.paper};margin:8mm;}body{font-family:system-ui,Arial,sans-serif;color:#0f172a;background:#fff;margin:0;}h3{margin:0 0 8px;font-size:15px;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #94a3b8;}</style></head><body><h3>${sEsc(state.orgName || 'ኮራ ስቶክ')} — ${sEsc(ds.title)} (${sEsc(state.koraGrid.date)})</h3><table><colgroup>${colTags}</colgroup><thead><tr>${headCells}</tr></thead><tbody>${bodyRows}${totRow}</tbody></table></body></html>`;
  }

  function downloadBlob(blob, fn) {
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = u; a.download = fn; a.click();
    setTimeout(() => URL.revokeObjectURL(u), 1000);
  }

  function openGrid(domain) {
    ensureGridState();
    gridDomain = domain || 'stock';
    gridOpen = true;
    gridMenuOpen = false;
    selectedColKey = null;
    if (!gridHistoryPushed) {
      try { window.history.pushState({ koraFocus: 'grid' }, ''); gridHistoryPushed = true; } catch {}
    }
    renderGridOverlay();
  }

  function closeGrid() {
    if (!gridOpen) return;
    gridOpen = false; gridMenuOpen = false; gridHistoryPushed = false;
    renderGridOverlay();
    const subBar = document.getElementById('subTabsBar');
    if (subBar) {
      const firstSub = Array.from(subBar.querySelectorAll('.subtab')).find((b) => {
        const t = (b.textContent || '').trim().toLowerCase();
        return !t.includes('ክምችት') && !t.includes('ሂሳብ') && !t.includes('ሒሳብ') && !t.includes('stock') && !t.includes('finance');
      });
      if (firstSub) firstSub.click();
    }
  }

  function checkAndLaunchGridFromSubTab() {
    if (!hasState() || gridOpen) return;
    const activeSub = document.querySelector('#subTabsBar .subtab.active');
    if (!activeSub) return;
    const txt = (activeSub.textContent || '').replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu, '').trim().toLowerCase();
    if (txt.includes('ክምችት') || txt === 'stock' || txt === 'ledger') {
      openGrid('stock');
    } else if (txt.includes('ሂሳብ') || txt.includes('ሒሳብ') || txt === 'finance' || txt === 'accounts') {
      openGrid('finance');
    }
  }

  // ---------------------------------------------------------------------------
  // 5. ተለዋዋጭ የድርጅት ቅፅ ገንቢ (በ«የቅጽ ቅንብር» ሞዳል ውስጥ)
  // ---------------------------------------------------------------------------
  const FORM_MODS = [
    { k: 'sales', am: 'ሽያጭ', en: 'Sales' }, { k: 'warehouse', am: 'መጋዘን', en: 'Warehouse' },
    { k: 'purchase', am: 'ግዢ', en: 'Purchase' }, { k: 'customer', am: 'ደንበኛ', en: 'Customer' },
    { k: 'dispatch', am: 'ማጓጓዣ', en: 'Dispatch' }
  ];
  const F_TYPES = [
    { k: 'text', am: 'ጽሁፍ', en: 'Text' }, { k: 'number', am: 'ቁጥር', en: 'Number' },
    { k: 'select', am: 'ምርጫ', en: 'Dropdown' }, { k: 'date', am: 'ቀን', en: 'Date' },
    { k: 'toggle', am: 'አዎ/አይ', en: 'Yes/No' }
  ];

  function buildFormBuilderHtml() {
    ensureGridState();
    const mod = state.customFormTab || 'sales';
    const list = state.customForms[mod] || [];
    return `
      <div class="card-row" style="margin-bottom:5px;">
        <b style="font-size:11.5px;color:#2dd4bf;">${sEsc(L('የድርጅቱ ተጨማሪ መስኮች', 'Custom Organization Fields'))}</b>
        <button type="button" class="btn teal sm" style="height:26px;font-size:10.5px;display:inline-flex;align-items:center;gap:3px;" onclick="KoraGrid.openAddField()">${SVG.plus} ${sEsc(L('አዲስ መስክ', 'Add Field'))}</button>
      </div>
      <div class="subtabs no-scrollbar" style="margin-bottom:6px;">
        ${FORM_MODS.map((m) => `<button type="button" class="subtab ${mod === m.k ? 'active' : ''}" style="height:25px;font-size:10.5px;" onclick="KoraGrid.setFormTab('${m.k}')">${sEsc(isAm() ? m.am : m.en)} (${(state.customForms[m.k] || []).length})</button>`).join('')}
      </div>
      <div style="display:flex;flex-direction:column;gap:5px;max-height:160px;overflow-y:auto;">
        ${list.map((f, i) => {
          const tObj = F_TYPES.find((x) => x.k === f.type) || F_TYPES[0];
          return `<div class="ksf-field-row"><div style="min-width:0;flex:1;"><b style="font-size:11.5px;">${sEsc(f.label)}</b><span class="pill" style="font-size:9px;margin-left:4px;">${sEsc(isAm() ? tObj.am : tObj.en)}</span>${f.required ? `<span class="pill rose" style="font-size:9px;">*</span>` : ''}</div><div style="display:flex;align-items:center;gap:6px;"><div class="toggle ${f.enabled !== false ? 'on' : ''}" onclick="KoraGrid.toggleField('${mod}',${i})"></div><button type="button" class="btn ghost sm" style="color:#fb7185;padding:0 5px;" onclick="KoraGrid.delField('${mod}',${i})">${SVG.trash}</button></div></div>`;
        }).join('') || `<div style="font-size:11px;color:#8b9bb0;text-align:center;padding:8px;">${sEsc(L('የድርጅትህን ተጨማሪ መስክ በ«+ አዲስ መስክ» ጨምር', 'Tap "+ Add Field" to customize any form'))}</div>`}
      </div>`;
  }

  function injectIntoModals() {
    if (!hasState()) return;
    ensureGridState();
    const modal = document.querySelector('#modalOverlay.open, .modal-bg.open, .modal-backdrop.open, #modalCard, .modal-card');
    if (!modal) return;
    const fullTxt = modal.textContent || '';

    if ((fullTxt.includes('የቅጽ ቅንብር') || fullTxt.includes('የቅፅ ቅንብር') || fullTxt.includes('ፓድ ቁጥር አሳይ')) && !modal.querySelector('[data-kg-fbuilder]')) {
      const sws = modal.querySelectorAll('.switch-row');
      const host = sws.length ? sws[sws.length - 1].parentElement : (modal.querySelector('.modal-body, #modalBody') || modal);
      if (host) {
        const box = document.createElement('div');
        box.setAttribute('data-kg-fbuilder', '1');
        box.style.cssText = 'margin-top:10px;padding-top:8px;border-top:1px solid rgba(148,163,184,0.18);';
        box.innerHTML = buildFormBuilderHtml();
        host.appendChild(box);
      }
      return;
    }

    if (modal.querySelector('[data-kg-cf-inj]') || modal.querySelector('[data-kg-fbuilder]')) return;
    const head = (modal.querySelector('h3, h4, .modal-title, .modal-head')?.textContent || fullTxt.slice(0, 50)).toLowerCase();
    let mod = null;
    if (head.includes('ሽያጭ') || head.includes('sale')) mod = 'sales';
    else if (head.includes('መጋዘን') || head.includes('ገቢ') || head.includes('ወጪ') || head.includes('warehouse')) mod = 'warehouse';
    else if (head.includes('ግዢ') || head.includes('purchase')) mod = 'purchase';
    else if (head.includes('ደንበኛ') || head.includes('customer')) mod = 'customer';
    else if (head.includes('ማጓጓዣ') || head.includes('ትዕዛዝ') || head.includes('dispatch')) mod = 'dispatch';
    if (!mod) return;

    const active = (state.customForms[mod] || []).filter((f) => f.enabled !== false);
    if (!active.length) return;
    const body = modal.querySelector('.modal-body, #modalBody') || modal;
    const wrap = document.createElement('div');
    wrap.className = 'sub-card'; wrap.setAttribute('data-kg-cf-inj', '1'); wrap.style.marginTop = '6px';
    wrap.innerHTML = `<div style="font-size:10px;font-weight:800;color:#2dd4bf;margin-bottom:4px;">${sEsc(L('የድርጅቱ ተጨማሪ መስኮች', 'Custom Fields'))}</div>` +
      active.map((f) => {
        if (f.type === 'select') {
          const opts = (f.options || '').split(',').map((o) => o.trim()).filter(Boolean);
          return `<div style="margin-top:4px;"><label class="lbl">${sEsc(f.label)}</label><select class="sel" data-cf-id="${f.id}">${opts.map((o) => `<option value="${sEsc(o)}">${sEsc(o)}</option>`).join('')}</select></div>`;
        }
        if (f.type === 'toggle') return `<div class="switch-row" style="margin-top:4px;"><span>${sEsc(f.label)}</span><div class="toggle" data-cf-id="${f.id}" onclick="this.classList.toggle('on')"></div></div>`;
        return `<div style="margin-top:4px;"><label class="lbl">${sEsc(f.label)}</label><input type="${f.type === 'number' ? 'number' : (f.type === 'date' ? 'date' : 'text')}" class="inp sm" data-cf-id="${f.id}"></div>`;
      }).join('');
    body.appendChild(wrap);
  }

  // ---------------------------------------------------------------------------
  // 6. ዳሰሳ፣ ጎን ሜኑ እና Focus Mode ማስተባበሪያ
  // ---------------------------------------------------------------------------
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
    for (const el of document.querySelectorAll('nav, footer, div[class*="nav" i], div[class*="tabbar" i]')) {
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
      const ex = btn.querySelector('.kth-nav-bdg, .badge, .nav-badge, .bnav-badge, [class*="badge" i]');
      if (ex) { const m = (ex.textContent || '').trim().match(/\d+/); if (m) bdgNum = m[0]; }
      let label = btn.dataset.kthLabel || '';
      if (!label) {
        const cl = btn.cloneNode(true);
        cl.querySelectorAll('.kth-nav-bdg, .badge, .nav-badge, .bnav-badge, [class*="badge" i], svg, .ico, .bnav-ico').forEach((n) => n.remove());
        label = (cl.textContent || '').replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF\d]/gu, '').trim();
        if (!label) label = ({ dashboard: 'ዳሽቦርድ', trade: 'ግብይት', warehouse: 'መጋዘን', tally: 'ቆጠራ', dispatch: 'ማጓጓዣ' })[key] || '';
        btn.dataset.kthLabel = label;
      }
      const sig = `${key}|${label}|${bdgNum}`;
      if (btn.dataset.kthSig === sig) return;
      btn.dataset.kthSig = sig;
      btn.innerHTML = `<span class="kth-nav-pill">${SVG[key] || SVG.dashboard}${bdgNum ? `<span class="kth-nav-bdg">${bdgNum}</span>` : ''}</span><span class="kth-nav-lbl">${label}</span>`;
    });
  }

  function stripEmojis(s) { return String(s || '').replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF\uFE0F]/gu, '').replace(/\s+/g, ' ').trim(); }

  function pickDrawerSvg(text) {
    const t = text.toLowerCase();
    if (t.includes('ዘመናዊ') || t.includes('next-gen')) return SVG.sparkles;
    if (t.includes('ቁጥጥር') || t.includes('erp') || t.includes('ኦዲት')) return SVG.shield;
    if (t.includes('ዕቃዎች') || t.includes('item')) return SVG.box;
    if (t.includes('ቅርንጫፍ') || t.includes('branch')) return SVG.branch;
    if (t.includes('ባንክ') || t.includes('bank')) return SVG.bank;
    if (t.includes('አቅራቢ') || t.includes('supplier')) return SVG.supplier;
    if (t.includes('ወጪ') || t.includes('expense')) return SVG.expense;
    if (t.includes('ገበያ') || t.includes('market')) return SVG.market;
    if (t.includes('ሰራተኞች') || t.includes('ደንበኞች') || t.includes('staff') || t.includes('customer')) return SVG.users;
    if (t.includes('መልዕክት') || t.includes('channel')) return SVG.send;
    if (t.includes('ማጽደቂያ') || t.includes('approval')) return SVG.checkSq;
    if (t.includes('ቅፅ') || t.includes('ቅጽ') || t.includes('form')) return SVG.form;
    if (t.includes('ባክአፕ') || t.includes('backup')) return SVG.db;
    if (t.includes('ቋንቋ') || t.includes('lang')) return SVG.globe;
    return SVG.gear;
  }

  function upgradeSideDrawer() {
    const nav = document.getElementById('drawerNav');
    if (!nav) return;
    let seenLang = false;
    Array.from(nav.querySelectorAll('.drawer-item')).forEach((btn) => {
      const rawTxt = (btn.textContent || '').trim();
      const cleanTxt = stripEmojis(rawTxt), low = cleanTxt.toLowerCase();
      const isLang = low.includes('ቋንቋ') || low.includes('language');
      if (btn.hasAttribute('data-ke-lang') || (isLang && seenLang) || cleanTxt.includes('የቆጠራ ቅንብር') || cleanTxt.includes('ፒዲኤፍ ስቱዲዮ') || cleanTxt.includes('የፒዲኤፍ') || low.includes('pdf studio')) {
        btn.classList.add('kth-dr-hidden'); return;
      }
      if (isLang) seenLang = true;
      if (btn.dataset.kthDrDone === cleanTxt) return;
      btn.dataset.kthDrDone = cleanTxt;
      const pill = btn.querySelector('.pill, .badge');
      const pureLabel = pill ? stripEmojis(rawTxt.replace(pill.textContent, '')) : cleanTxt;
      btn.innerHTML = `<span class="kth-dr-left"><span class="kth-dr-ico">${pickDrawerSvg(pureLabel)}</span><span>${pureLabel}</span></span>${pill ? pill.outerHTML : ''}`;
    });
  }

  function upgradeInlineIconsAndHidePdf() {
    const root = document.getElementById('viewRoot');
    if (!root) return;
    root.querySelectorAll('button').forEach((b) => {
      const t = (b.textContent || '').trim().toLowerCase();
      if (t.includes('ፒዲኤፍ ስቱዲዮ') || t.includes('pdf studio')) b.classList.add('kth-hide-pdf-btn');
    });
    const swaps = [['🚚', SVG.truckSm], ['⛽', SVG.fuelSm], ['📞', SVG.phoneSm], ['🧭', SVG.navSm], ['✅', SVG.checkSm]];
    root.querySelectorAll('button.btn, a.btn').forEach((el) => {
      if (el.dataset.kthBtnIco) return;
      const html = el.innerHTML;
      if (!html.includes('<svg')) {
        let next = html;
        swaps.forEach(([em, svg]) => { if (next.includes(em)) next = next.replaceAll(em, svg); });
        if (next !== html) { el.innerHTML = next; el.style.cssText += ';display:inline-flex;align-items:center;justify-content:center;gap:5px;'; }
      }
      el.dataset.kthBtnIco = '1';
    });
  }

  function exitFocusScreen() {
    tallyHistoryPushed = false;
    document.body.classList.remove('kth-focus-tally');
    const target = (lastMainTab && lastMainTab !== 'tally') ? lastMainTab : 'dashboard';
    if (typeof global.switchMainTab === 'function') global.switchMainTab(target);
  }

  function syncFocusAndTopbar() {
    const isTally = hasState() && state.activeMainTab === 'tally';
    if (hasState() && state.activeMainTab && state.activeMainTab !== 'tally' && !String(state.activeMainTab).startsWith('setup:')) {
      lastMainTab = state.activeMainTab;
    }
    document.body.classList.toggle('kth-focus-tally', Boolean(isTally));
    if (isTally && !tallyHistoryPushed) {
      try { window.history.pushState({ koraFocus: 'tally' }, ''); tallyHistoryPushed = true; } catch {}
    } else if (!isTally) tallyHistoryPushed = false;

    const topbar = document.querySelector('.topbar');
    if (topbar) document.documentElement.style.setProperty('--kth-top-h', Math.ceil(topbar.getBoundingClientRect().height) + 'px');

    const row1 = document.querySelector('.topbar .topbar-row');
    if (!row1) return;
    const menuBtn = row1.querySelector('button:first-child');
    if (menuBtn && menuBtn.id !== 'keNotifBell' && menuBtn.id !== 'btnNotifBell') {
      if (isTally) {
        if (!menuBtn.dataset.kthOrigOnclick) menuBtn.dataset.kthOrigOnclick = menuBtn.getAttribute('onclick') || '';
        menuBtn.innerHTML = SVG.back; menuBtn.classList.add('kth-back-btn');
        menuBtn.setAttribute('onclick', 'KoraTheme.exitFocus()');
      } else {
        menuBtn.classList.remove('kth-back-btn');
        if (menuBtn.dataset.kthOrigOnclick !== undefined) {
          if (menuBtn.dataset.kthOrigOnclick) menuBtn.setAttribute('onclick', menuBtn.dataset.kthOrigOnclick);
          else menuBtn.removeAttribute('onclick');
          delete menuBtn.dataset.kthOrigOnclick;
        }
        if (!menuBtn.querySelector('svg') || menuBtn.innerHTML !== SVG.menu) menuBtn.innerHTML = SVG.menu;
      }
    }
    const bell = document.getElementById('btnNotifBell') || document.getElementById('keNotifBell');
    if (bell && !bell.querySelector('svg')) {
      const bdg = bell.querySelector('.ke-bell-badge, .badge, .notif-badge'), dot = bell.querySelector('.ke-net-dot');
      bell.innerHTML = `${SVG.bell}${bdg ? bdg.outerHTML : ''}${dot ? dot.outerHTML : ''}`;
    }
    if (hasState() && Array.isArray(state.branches)) {
      const scopeSel = row1.querySelector('.scope-sel, select');
      if (scopeSel) scopeSel.style.display = state.branches.length <= 1 ? 'none' : '';
    }
  }

  function applyAll() {
    injectUnifiedCss();
    syncFocusAndTopbar();
    upgradeBottomNav();
    upgradeSideDrawer();
    upgradeInlineIconsAndHidePdf();
    enforceDashboard2x2();
    checkAndLaunchGridFromSubTab();
  }

  function boot() {
    applyAll();
    installTouchSwipeExit();

    if (!global._kthPopHooked) {
      global._kthPopHooked = true;
      window.addEventListener('popstate', () => {
        if (gridOpen) { closeGrid(); return; }
        if (hasState() && state.activeMainTab === 'tally') exitFocusScreen();
      });
      document.addEventListener('click', (e) => {
        if (e.target?.closest?.('#subTabsBar .subtab')) setTimeout(checkAndLaunchGridFromSubTab, 35);
      }, true);
      new MutationObserver(() => injectIntoModals()).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    }

    if (typeof global.renderView === 'function' && !global._kthRVHooked) {
      global._kthRVHooked = true;
      const origRV = global.renderView;
      global.renderView = function () { const res = origRV.apply(this, arguments); requestAnimationFrame(applyAll); return res; };
    }
    if (typeof global.renderDrawer === 'function' && !global._kthDRHooked) {
      global._kthDRHooked = true;
      const origDR = global.renderDrawer;
      global.renderDrawer = function () { const res = origDR.apply(this, arguments); requestAnimationFrame(upgradeSideDrawer); return res; };
    }
    if (typeof global.renderAll === 'function' && !global._kthRAHooked) {
      global._kthRAHooked = true;
      const origRA = global.renderAll;
      global.renderAll = function () { const res = origRA.apply(this, arguments); requestAnimationFrame(applyAll); return res; };
    }
    if (typeof global.openModal === 'function' && !global._kthOMHooked) {
      global._kthOMHooked = true;
      const origOM = global.openModal;
      global.openModal = function () { const res = origOM.apply(this, arguments); setTimeout(injectIntoModals, 15); return res; };
    }

    const nav = findBottomNavEl();
    if (nav && !nav.dataset.kthObs) {
      nav.dataset.kthObs = '1';
      let t = null;
      new MutationObserver(() => { clearTimeout(t); t = setTimeout(upgradeBottomNav, 30); })
        .observe(nav, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    }
  }

  global.KoraTheme = { exitFocus: exitFocusScreen, refresh: applyAll };
  global.KoraGrid = {
    isOpen: () => gridOpen, open: openGrid, close: closeGrid,
    undo() { if (!styleUndoStack.length) { showToast(L('የሚመለስ ለውጥ የለም', 'Nothing to undo')); return; } state.koraGridStyle = JSON.parse(styleUndoStack.pop()); saveState(); renderGridOverlay(); },
    _closeMenuIfOpen() { if (gridMenuOpen) { gridMenuOpen = false; renderGridOverlay(); return true; } return false; },
    toggleMenu(e) { if (e) e.stopPropagation(); gridMenuOpen = !gridMenuOpen; renderGridOverlay(); },
    toggleSearch() { gridSearchOpen = !gridSearchOpen; gridMenuOpen = false; renderGridOverlay(); if (gridSearchOpen) setTimeout(() => document.getElementById('kgSearchInp')?.focus(), 30); },
    setQuery(v) { gridSearchQuery = v; renderGridOverlay(); },
    setDate(d) { state.koraGrid.date = d || todayIso(); saveState(); renderGridOverlay(); },
    setTab(t) { if (gridDomain === 'stock') state.koraGrid.stockTab = t; else state.koraGrid.finTab = t; selectedColKey = null; saveState(); renderGridOverlay(); },
    selectCol(k) { selectedColKey = selectedColKey === k ? null : k; renderGridOverlay(); },
    stepColW(delta) {
      if (!selectedColKey) { showToast(L('መጀመሪያ የዓምድ ፊደል (A, B, C...) ንካ', 'Tap a column letter (A, B...) first')); return; }
      pushStyleUndo();
      const cur = Number(state.koraGridStyle.colWidths[selectedColKey] || 90);
      state.koraGridStyle.colWidths[selectedColKey] = Math.max(46, Math.min(300, cur + delta));
      saveState(); renderGridOverlay();
    },
    toggleFmt(prop) {
      pushStyleUndo();
      const st = state.koraGridStyle;
      if (selectedColKey) { st.colStyles[selectedColKey] = st.colStyles[selectedColKey] || {}; st.colStyles[selectedColKey][prop] = !getEffectiveStyle(selectedColKey, 'left')[prop]; }
      else st[prop] = !st[prop];
      saveState(); renderGridOverlay();
    },
    stepFont(d) { pushStyleUndo(); state.koraGridStyle.fontSize = Math.max(9, Math.min(18, Number(state.koraGridStyle.fontSize || 12) + d)); saveState(); renderGridOverlay(); },
    setAlign(a) { pushStyleUndo(); const st = state.koraGridStyle; if (selectedColKey) { st.colStyles[selectedColKey] = st.colStyles[selectedColKey] || {}; st.colStyles[selectedColKey].align = a; } else st.align = a; saveState(); renderGridOverlay(); },
    cycleTextColor() {
      if (!selectedColKey) { showToast(L('መጀመሪያ የዓምድ ፊደል (A, B, C...) ንካ', 'Tap a column letter first')); return; }
      pushStyleUndo(); const st = state.koraGridStyle; st.colStyles[selectedColKey] = st.colStyles[selectedColKey] || {};
      const cur = st.colStyles[selectedColKey].color || '';
      st.colStyles[selectedColKey].color = TEXT_PALETTE[(TEXT_PALETTE.indexOf(cur) + 1) % TEXT_PALETTE.length];
      saveState(); renderGridOverlay();
    },
    cycleFillColor() {
      if (!selectedColKey) { showToast(L('መጀመሪያ የዓምድ ፊደል (A, B, C...) ንካ', 'Tap a column letter first')); return; }
      pushStyleUndo(); const st = state.koraGridStyle; st.colStyles[selectedColKey] = st.colStyles[selectedColKey] || {};
      const cur = st.colStyles[selectedColKey].bg || '';
      st.colStyles[selectedColKey].bg = FILL_PALETTE[(FILL_PALETTE.indexOf(cur) + 1) % FILL_PALETTE.length];
      saveState(); renderGridOverlay();
    },
    cycleRowPad() { pushStyleUndo(); const c = state.koraGridStyle.rowPad || 6; state.koraGridStyle.rowPad = c === 3 ? 6 : (c === 6 ? 10 : 3); saveState(); renderGridOverlay(); },
    toggleWrap() { pushStyleUndo(); state.koraGridStyle.wrap = !state.koraGridStyle.wrap; saveState(); renderGridOverlay(); },
    toggleTheme() { state.koraGridStyle.theme = state.koraGridStyle.theme === 'dark' ? 'light' : 'dark'; gridMenuOpen = false; saveState(); renderGridOverlay(); },
    toggleHideZero() { state.koraGridStyle.hideZero = !state.koraGridStyle.hideZero; gridMenuOpen = false; saveState(); renderGridOverlay(); },
    cyclePaper() { state.koraGridStyle.paper = state.koraGridStyle.paper === 'A4' ? 'A5' : 'A4'; saveState(); renderGridOverlay(); },
    resetStyle() { pushStyleUndo(); state.koraGridStyle = defaultGridStyle(); selectedColKey = null; gridMenuOpen = false; saveState(); renderGridOverlay(); showToast(L('ወደ ነባር ተመልሷል', 'Reset')); },
    exportPdf() { gridMenuOpen = false; renderGridOverlay(); const w = window.open('', '_blank'); if (!w) { showToast(L('Pop-up ተከልክሏል', 'Pop-up blocked'), true); return; } w.document.write(buildExactExportHtml().replace('</body>', '<script>window.onload=()=>setTimeout(()=>window.print(),250);</script></body>')); w.document.close(); },
    exportXls() { gridMenuOpen = false; renderGridOverlay(); downloadBlob(new Blob([buildExactExportHtml()], { type: 'application/vnd.ms-excel;charset=utf-8' }), `kora-${gridDomain}-${state.koraGrid.date}.xls`); showToast(L('ሰንጠረዥ (.xls) ወርዷል', 'Downloaded')); },
    exportCsv() {
      gridMenuOpen = false; renderGridOverlay();
      const ds = buildGridDataset(), lines = [ds.cols.map((c) => `"${c.lbl}"`).join(',')];
      ds.rows.forEach((r) => lines.push(r.isCat ? `"${r.cat}"` : r.cells.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(',')));
      downloadBlob(new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8' }), `kora-${gridDomain}-${state.koraGrid.date}.csv`);
      showToast(L('CSV ወርዷል', 'CSV downloaded'));
    },
    async shareSheet() {
      gridMenuOpen = false; renderGridOverlay();
      const file = new File([buildExactExportHtml()], `kora-${gridDomain}-${state.koraGrid.date}.xls`, { type: 'application/vnd.ms-excel' });
      try { if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ title: state.orgName || 'ኮራ ስቶክ', files: [file] }); return; } } catch {}
      this.exportXls();
    },
    setFormTab(m) { state.customFormTab = m; saveState(); const b = document.querySelector('[data-kg-fbuilder]'); if (b) b.innerHTML = buildFormBuilderHtml(); },
    openAddField() {
      const mod = state.customFormTab || 'sales';
      openModal(`${L('አዲስ የቅፅ መስክ ጨምር', 'Add Custom Field')}`, `
        <div class="sub-card">
          <label class="lbl">${sEsc(L('የመስኩ ስም', 'Field Name'))}</label>
          <input id="kgCfLbl" class="inp" placeholder="${sEsc(L('ለምሳሌ የውል ቁጥር / ውፍረት / ባች ቁጥር', 'e.g. Contract No / Batch'))}">
          <div class="grid-2" style="margin-top:6px;">
            <div><label class="lbl">${sEsc(L('ዓይነት', 'Type'))}</label><select id="kgCfType" class="sel" onchange="document.getElementById('kgCfOptBox').style.display=this.value==='select'?'block':'none'">${F_TYPES.map((t) => `<option value="${t.k}">${sEsc(isAm() ? t.am : t.en)}</option>`).join('')}</select></div>
            <div class="switch-row" style="align-self:end;padding-bottom:4px;"><span style="font-size:11px;">${sEsc(L('ግዴታ?', 'Required?'))}</span><div id="kgCfReq" class="toggle" onclick="this.classList.toggle('on')"></div></div>
          </div>
          <div id="kgCfOptBox" style="display:none;margin-top:6px;"><label class="lbl">${sEsc(L('ምርጫዎች (በኮማ ይለዩ)', 'Options (comma)'))}</label><input id="kgCfOpts" class="inp sm" placeholder="0.75mm, 0.9mm, 1.2mm"></div>
        </div>`, `
        <button type="button" class="btn muted" onclick="closeModal()">${sEsc(L('ተው', 'Cancel'))}</button>
        <button type="button" class="btn teal" onclick="KoraGrid.saveField('${mod}')">${sEsc(L('ጨምር', 'Save'))}</button>`);
    },
    saveField(mod) {
      const label = (document.getElementById('kgCfLbl')?.value || '').trim();
      const type = document.getElementById('kgCfType')?.value || 'text';
      const required = document.getElementById('kgCfReq')?.classList.contains('on') || false;
      const options = (document.getElementById('kgCfOpts')?.value || '').trim();
      if (!label) { showToast(L('የመስኩን ስም ያስገቡ', 'Enter field name'), true); return; }
      state.customForms[mod].push({ id: 'cf_' + Date.now(), label, type, required, options, enabled: true });
      saveState(); closeModal(); showToast(L('አዲሱ መስክ ተጨምሯል!', 'Field added!'));
    },
    toggleField(mod, i) { const f = state.customForms[mod]?.[i]; if (f) { f.enabled = f.enabled === false ? true : false; saveState(); const b = document.querySelector('[data-kg-fbuilder]'); if (b) b.innerHTML = buildFormBuilderHtml(); } },
    delField(mod, i) { if (state.customForms[mod]) { state.customForms[mod].splice(i, 1); saveState(); const b = document.querySelector('[data-kg-fbuilder]'); if (b) b.innerHTML = buildFormBuilderHtml(); } }
  };

  document.addEventListener('DOMContentLoaded', boot);
  setTimeout(boot, 150);
  setTimeout(boot, 550);
})(window);
