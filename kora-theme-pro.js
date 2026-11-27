// =============================================================================
// ኮራ ስቶክ — Matte Obsidian Unified Design System (kora-theme-pro.js — v27)
// • ሙሉ አፑን ወጥ Matte Obsidian ቀለም (#070a0e) እና ቀጭን ድንበር ማድረግ
// • ተንሳፋፊ ባለ-ካፕሱል የታችኛው ዳሰሳ ከፕሪሚየም Outline SVG አዶዎች ጋር
// • የላይኛው አሞሌ SVG አዶዎች (☰ እና 🔔) + አንድ ቅርንጫፍ ብቻ ሲኖር ራስ-ሰር መደበቅ
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
    bell: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>'
  };

  function injectMatteThemeCss() {
    let st = document.getElementById('koraMatteThemeCss');
    if (!st) {
      st = document.createElement('style');
      st.id = 'koraMatteThemeCss';
      document.head.appendChild(st);
    }
    st.textContent = `
      /* === 1. Matte Obsidian ዓለም አቀፋዊ ወጥ ቀለም === */
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

      html, body {
        background: #070a0e !important;
        color: #f1f5f9 !important;
      }

      .topbar {
        background: rgba(7, 10, 14, 0.94) !important;
        backdrop-filter: blur(12px) !important;
        border-bottom: 1px solid rgba(148, 163, 184, 0.10) !important;
      }

      .card {
        background: #10161d !important;
        border: 1px solid rgba(148, 163, 184, 0.13) !important;
        box-shadow: none !important;
      }
      .sub-card {
        background: #0b1015 !important;
        border: 1px solid rgba(148, 163, 184, 0.10) !important;
      }
      .kpi {
        background: #0c1117 !important;
        border: 1px solid rgba(148, 163, 184, 0.12) !important;
      }
      .inp, .sel, .search-wrap, .scope-sel {
        background: #0b1015 !important;
        border-color: rgba(148, 163, 184, 0.16) !important;
        color: #f1f5f9 !important;
      }
      .subtab {
        background: #0d1218 !important;
        border: 1px solid rgba(148, 163, 184, 0.14) !important;
        color: #8b9bb0 !important;
      }
      .subtab.active {
        background: rgba(20, 184, 166, 0.16) !important;
        border-color: rgba(20, 184, 166, 0.65) !important;
        color: #2dd4bf !important;
      }
      .modal-card, #modalCard, .drawer, .drawer-panel {
        background: #0d1218 !important;
        border-color: rgba(148, 163, 184, 0.18) !important;
      }

      /* የላይኛው አሞሌ አዶዎች ወደ ንጹህ Matte Obsidian */
      .topbar .icon-btn, .ke-bell-btn {
        background: #0d1218 !important;
        border: 1px solid rgba(148, 163, 184, 0.16) !important;
        color: #cbd5e1 !important;
        border-radius: 11px !important;
      }
      .ke-bell-btn { color: #e2e8f0 !important; }
      .ke-brand-txt small { display: none !important; }
      .ke-brand-txt b { font-size: 14px !important; letter-spacing: 0.2px; }

      /* === 2. ተንሳፋፊ ባለ-ካፕሱል የታችኛው ዳሰሳ (Outline SVG — ልክ እንደ ምሳሌው) === */
      .kth-bnav {
        position: fixed !important;
        left: 10px !important;
        right: 10px !important;
        bottom: 8px !important;
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
      }
      .kth-bnav button.active {
        background: rgba(20, 184, 166, 0.08) !important;
      }
      .kth-nav-pill {
        width: 46px;
        height: 30px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #8b9bb0;
        position: relative;
        transition: all 0.18s ease;
      }
      .kth-bnav button.active .kth-nav-pill {
        background: rgba(6, 182, 212, 0.18);
        color: #22d3ee;
        box-shadow: inset 0 0 0 1px rgba(34, 211, 238, 0.28);
      }
      .kth-nav-lbl {
        font-size: 9.8px;
        font-weight: 700;
        color: #8b9bb0;
        line-height: 1.1;
        white-space: nowrap;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .kth-bnav button.active .kth-nav-lbl {
        color: #22d3ee;
        font-weight: 800;
      }
      .kth-nav-bdg {
        position: absolute;
        top: -3px;
        right: 1px;
        min-width: 15px;
        height: 15px;
        padding: 0 4px;
        border-radius: 99px;
        background: #f43f5e;
        color: #fff;
        font-size: 9px;
        font-weight: 900;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1.5px solid #0b1016;
      }

      /* በሌሎች ገጾች ላይ ከተንሳፋፊው ዳሰሳ ጀርባ ካርዶች እንዳይሸፈኑ */
      body:not(.ktp-active) .viewport {
        padding-bottom: 86px !important;
      }
    `;
  }

  function detectNavKey(btn) {
    const oc = (btn.getAttribute('onclick') || '').toLowerCase();
    const dt = (btn.dataset?.tab || '').toLowerCase();
    const txt = (btn.textContent || '').toLowerCase();
    const hay = `${oc} ${dt} ${txt}`;
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
      const btns = el.querySelectorAll('button');
      if (btns.length === 5 && el.getBoundingClientRect().top > window.innerHeight * 0.6) return el;
    }
    return null;
  }

  function upgradeBottomNav() {
    const nav = findBottomNavEl();
    if (!nav) return;
    nav.classList.add('kth-bnav');

    const btns = Array.from(nav.querySelectorAll('button'));
    btns.forEach((btn) => {
      const key = detectNavKey(btn);

      // ባጅ (ቁጥር) ካለ ማንበብ
      let bdgNum = '';
      const existingBdg = btn.querySelector('.kth-nav-bdg, .badge, .nav-badge, .bnav-badge, [class*="badge" i]');
      if (existingBdg) {
        const m = (existingBdg.textContent || '').trim().match(/\d+/);
        if (m) bdgNum = m[0];
      }

      // ጽሁፉን ማንበብ (ኢሞጂዎችንና ቁጥሮችን በማጽዳት)
      let label = btn.dataset.kthLabel || '';
      if (!label) {
        const clone = btn.cloneNode(true);
        clone.querySelectorAll('.kth-nav-bdg, .badge, .nav-badge, .bnav-badge, [class*="badge" i], svg, .ico, .bnav-ico').forEach((n) => n.remove());
        label = (clone.textContent || '').replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF\d]/gu, '').trim();
        if (!label) {
          const fallback = { dashboard: 'ዳሽቦርድ', trade: 'ግብይት', warehouse: 'መጋዘን', tally: 'ቆጠራ', dispatch: 'ማጓጓዣ' };
          label = fallback[key] || '';
        }
        btn.dataset.kthLabel = label;
      }

      const sig = `${key}|${label}|${bdgNum}`;
      if (btn.dataset.kthSig === sig) return;
      btn.dataset.kthSig = sig;

      btn.innerHTML = `
        <span class="kth-nav-pill">
          ${SVG[key] || SVG.dashboard}
          ${bdgNum ? `<span class="kth-nav-bdg">${bdgNum}</span>` : ''}
        </span>
        <span class="kth-nav-lbl">${label}</span>`;
    });
  }

  function upgradeTopbarChrome() {
    const row1 = document.querySelector('.topbar .topbar-row');
    if (!row1) return;

    // 1. ☰ ቁልፍን ወደ ንጹህ SVG መቀየር
    const menuBtn = row1.querySelector('button:first-child');
    if (menuBtn && !menuBtn.querySelector('svg') && menuBtn.id !== 'keNotifBell' && menuBtn.id !== 'btnNotifBell') {
      menuBtn.innerHTML = SVG.menu;
    }

    // 2. 🔔 ደወልን ወደ ንጹህ SVG መቀየር (ባጁንና አረንጓዴ ነጥቡን ሳያጠፋ)
    const bell = document.getElementById('btnNotifBell') || document.getElementById('keNotifBell');
    if (bell && !bell.querySelector('svg')) {
      const bdg = bell.querySelector('.ke-bell-badge, .badge, .notif-badge');
      const dot = bell.querySelector('.ke-net-dot');
      const bdgHtml = bdg ? bdg.outerHTML : '';
      const dotHtml = dot ? dot.outerHTML : '';
      bell.innerHTML = `${SVG.bell}${bdgHtml}${dotHtml}`;
    }

    // 3. አንድ ቅርንጫፍ ብቻ ካለ የቅርንጫፍ መምረጫውን በራሱ ደብቆ ቦታ መቆጠብ
    if (typeof state !== 'undefined' && Array.isArray(state.branches)) {
      const scopeSel = row1.querySelector('.scope-sel, select');
      if (scopeSel) {
        scopeSel.style.display = state.branches.length <= 1 ? 'none' : '';
      }
    }
  }

  function applyAllThemePolishes() {
    injectMatteThemeCss();
    upgradeTopbarChrome();
    upgradeBottomNav();
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

    if (typeof global.renderAll === 'function' && !global._kthRAHooked) {
      global._kthRAHooked = true;
      const origRA = global.renderAll;
      global.renderAll = function () {
        const res = origRA.apply(this, arguments);
        requestAnimationFrame(applyAllThemePolishes);
        return res;
      };
    }

    // በታችኛው ዳሰሳ ላይ ባጅ ሲቀየር ራስ-ሰር ማደስ
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
