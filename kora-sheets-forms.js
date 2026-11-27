// =============================================================================
// ኮራ ስቶክ — Google Sheets Stock View + Multi-Share Hub + Dynamic Form Builder
// (kora-sheets-forms.js — v28)
// • መጋዘን ➔ ክምችት: ልክ እንደ Google Sheets ዕለታዊ/ሳምንታዊ/ወርሃዊ (በምድብ የተከፋፈለ)
//   እና ዕለታዊ ታሪክ (አረንጓዴ ገቢ፣ ቀይ VOID፣ ወርቃማ 0-ቀሪ)
// • አንድ «ላክ / አውርድ» ማዕከል: ባለ-ቀለም Excel (.xls)፣ CSV፣ Auto-Fit PDF፣ WhatsApp/Telegram/Share
// • ተለዋዋጭ የቅፅ ገንቢ (የቅፅ ቅንብር): ማንኛውም ድርጅት ለሽያጭ/መጋዘን/ግዢ/ደንበኛ/ማጓጓዣ
//   የራሱን መስኮች (+ አዲስ መስክ) እንዲፈጥርና በቅጾቹ ውስጥ በራሱ እንዲገቡ ማድረግ
// =============================================================================
(function (global) {
  'use strict';

  function hasState() { return typeof state !== 'undefined' && state && typeof state === 'object'; }
  function isAm() { return !hasState() || state.lang !== 'en'; }
  function L(am, en) { return isAm() ? am : en; }
  function sEsc(v) { return typeof esc === 'function' ? esc(v) : String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function sNum(n) { return typeof fmtNum === 'function' ? fmtNum(n) : Number(n || 0).toLocaleString(); }
  function todayIso() { return new Date().toISOString().slice(0, 10); }

  const ICO = {
    share: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>',
    plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    sheet: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/></svg>',
    trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>'
  };

  function ensureSfState() {
    if (!hasState()) return;
    if (!state.sheetUi) state.sheetUi = { tab: 'daily', date: todayIso(), hideZero: false };
    if (!state.customForms || typeof state.customForms !== 'object') {
      state.customForms = {
        sales: [],
        warehouse: [],
        purchase: [],
        customer: [],
        dispatch: []
      };
    }
    ['sales', 'warehouse', 'purchase', 'customer', 'dispatch'].forEach((k) => {
      if (!Array.isArray(state.customForms[k])) state.customForms[k] = [];
    });
    if (!state.customFormTab) state.customFormTab = 'sales';
  }

  function injectSfCss() {
    if (document.getElementById('koraSheetsFormsCss')) return;
    const st = document.createElement('style');
    st.id = 'koraSheetsFormsCss';
    st.textContent = `
      /* === Google Sheets አቀማመጥ (ለክምችት) === */
      .ksf-bar { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
      .ksf-tabs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; width: 100%; }
      .ksf-tab {
        height: 30px; border-radius: 9px; border: 1px solid rgba(148,163,184,0.16);
        background: #0d1218; color: #8b9bb0; font-size: 10.5px; font-weight: 800;
        cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .ksf-tab.on { background: rgba(20,184,166,0.18); border-color: #14b8a6; color: #2dd4bf; }

      .ksf-sheet-wrap {
        width: 100%; overflow: auto; max-height: 60vh;
        border: 1px solid rgba(148,163,184,0.22); border-radius: 10px;
        background: #05080b;
      }
      .ksf-tbl {
        width: 100%; border-collapse: collapse; font-size: 11.5px;
        font-family: system-ui, -apple-system, sans-serif;
      }
      .ksf-tbl th, .ksf-tbl td {
        border: 1px solid rgba(148,163,184,0.16);
        padding: 6px 7px; white-space: nowrap;
      }
      .ksf-tbl thead th {
        position: sticky; top: 0; z-index: 4;
        background: #141c24; color: #e2e8f0; font-weight: 800; font-size: 10.5px;
        text-align: center;
      }
      .ksf-tbl thead th.col-left, .ksf-tbl td.col-left { text-align: left; }
      .ksf-tbl td.num { text-align: right; font-family: ui-monospace, monospace; font-weight: 700; }
      .ksf-tbl td.rownum, .ksf-tbl th.rownum {
        width: 28px; text-align: center; color: #64748b; background: #0c1117;
        font-family: ui-monospace, monospace; font-size: 10px;
      }
      .ksf-tbl td.sticky-col, .ksf-tbl th.sticky-col {
        position: sticky; left: 0; z-index: 3; background: #0b1015;
      }
      .ksf-tbl thead th.sticky-col { z-index: 5; background: #141c24; }

      /* የምድብ ራስጌ (ልክ እንደ Google Sheets አረንጓዴ ባንድ) */
      .ksf-cat-row td {
        background: rgba(16, 185, 129, 0.22) !important;
        color: #a7f3d0 !important;
        font-weight: 900 !important;
        font-size: 11px !important;
        letter-spacing: 0.3px;
        text-align: left !important;
      }
      /* ረድፍ ቀለሞች (ገቢ / VOID / 0-ቀሪ / ዝቅተኛ ስቶክ) */
      .ksf-row-in td { background: rgba(16, 185, 129, 0.11); }
      .ksf-row-void td { background: rgba(239, 68, 68, 0.22) !important; color: #fca5a5 !important; font-weight: 800; }
      .ksf-row-zero td { background: rgba(245, 158, 11, 0.20) !important; color: #fde68a !important; }
      .ksf-row-low td { background: rgba(239, 68, 68, 0.14); color: #fca5a5; }
      .ksf-tot-row td {
        position: sticky; bottom: 0; z-index: 4;
        background: #141c24 !important; color: #2dd4bf !important;
        font-weight: 900 !important; border-top: 2px solid rgba(20,184,166,0.5) !important;
      }
      .ksf-in-num { color: #34d399; }
      .ksf-out-num { color: #fb7185; }

      /* === ተለዋዋጭ የቅፅ ገንቢ === */
      .ksf-field-row {
        display: flex; align-items: center; justify-content: space-between; gap: 8px;
        background: #0b1015; border: 1px solid rgba(148,163,184,0.14);
        border-radius: 10px; padding: 8px 10px;
      }
      .ksf-share-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
    `;
    document.head.appendChild(st);
  }

  // ===========================================================================
  // 1. Google Sheets የክምችት ዳታ ቀማሪ (ዕለታዊ / ሳምንታዊ / ወርሃዊ / ዕለታዊ ታሪክ)
  // ===========================================================================
  function dateRangeStart(tab, refDateStr) {
    const base = new Date((refDateStr || todayIso()) + 'T00:00:00');
    if (tab === 'weekly') {
      const d = new Date(base);
      d.setDate(d.getDate() - 6);
      return d.toISOString().slice(0, 10);
    }
    if (tab === 'monthly') {
      return (refDateStr || todayIso()).slice(0, 7) + '-01';
    }
    return refDateStr || todayIso();
  }

  function getFilteredLedger(startIso, endIso) {
    const br = state.branchScope || 'all';
    const q = (document.getElementById('globalSearch')?.value || '').trim().toLowerCase();

    const rows = (state.warehouseLedger || []).map((w) => ({
      docNo: w.docNo || '-',
      itemId: w.itemId,
      itemName: w.itemName || '-',
      openBal: Number(w.openBal || 0),
      inQty: Number(w.inQty || 0),
      outQty: Number(w.outQty || 0),
      endBal: Number(w.endBal || 0),
      party: w.party || '-',
      ref: w.ref || '-',
      branch: w.branch || '',
      date: (w.date || todayIso()).slice(0, 10),
      isVoid: String(w.status || '').toLowerCase() === 'void'
    }));

    // በERP ውስጥ የተመዘገቡ የተሰረዙ/የተቀደዱ ቅጠሎችን (VOID) በቀይ ረድፍ አብሮ ማሳየት
    (state.erp?.voidLeaves || []).forEach((v) => {
      rows.push({
        docNo: v.docNo || 'VOID',
        itemId: null,
        itemName: 'VOID',
        openBal: 0, inQty: 0, outQty: 0, endBal: 0,
        party: `${L('የተሰረዘ ሰነድ', 'VOID')} (${v.reason || '-'})`,
        ref: 'VOID',
        branch: br === 'all' ? '' : br,
        date: (v.date || todayIso()).slice(0, 10),
        isVoid: true
      });
    });

    return rows.filter((r) => {
      if (br !== 'all' && r.branch && r.branch !== br) return false;
      if (startIso && r.date < startIso) return false;
      if (endIso && r.date > endIso) return false;
      if (q && !`${r.docNo} ${r.itemName} ${r.party} ${r.date}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  function buildGroupedSummary(tab, refDate) {
    const startIso = dateRangeStart(tab, refDate);
    const endIso = refDate || todayIso();
    const br = state.branchScope || 'all';
    const q = (document.getElementById('globalSearch')?.value || '').trim().toLowerCase();
    const ledger = getFilteredLedger(startIso, endIso).filter((r) => !r.isVoid);

    const agg = {};
    ledger.forEach((r) => {
      const k = String(r.itemId || r.itemName);
      if (!agg[k]) agg[k] = { inQty: 0, outQty: 0 };
      agg[k].inQty += r.inQty;
      agg[k].outQty += r.outQty;
    });

    const groups = {};
    (state.inventory || []).forEach((it) => {
      if (q && !`${it.name} ${it.category || ''}`.toLowerCase().includes(q)) return;
      const curStock = typeof getItemStock === 'function' ? Number(getItemStock(it, br) || 0) : Number(it.stock || 0);
      const mv = agg[String(it.id)] || agg[it.name] || { inQty: 0, outQty: 0 };
      const opening = Math.max(0, curStock - mv.inQty + mv.outQty);
      if (state.sheetUi.hideZero && opening === 0 && mv.inQty === 0 && mv.outQty === 0 && curStock === 0) return;

      const cat = (it.category || L('መደበኛ ምርቶች', 'General')).trim();
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push({
        name: it.name,
        opening,
        inQty: mv.inQty,
        outQty: mv.outQty,
        ending: curStock,
        minStock: Number(it.minStock ?? 5)
      });
    });

    return { startIso, endIso, groups };
  }

  function renderGoogleSheetsWarehouse(root) {
    ensureSfState();
    injectSfCss();
    const ui = state.sheetUi;
    const tab = ui.tab || 'daily';
    const refDate = ui.date || todayIso();

    let tableHtml = '';
    let totIn = 0, totOut = 0, totEnd = 0, voidCnt = 0;

    if (tab === 'history') {
      const rows = getFilteredLedger('', refDate);
      rows.forEach((r) => {
        if (r.isVoid) voidCnt++;
        else { totIn += r.inQty; totOut += r.outQty; }
      });

      let trs = '';
      rows.forEach((r, idx) => {
        const cls = r.isVoid ? 'ksf-row-void' : (r.endBal === 0 && r.outQty > 0 ? 'ksf-row-zero' : (r.inQty > 0 ? 'ksf-row-in' : ''));
        trs += `
          <tr class="${cls}">
            <td class="rownum">${idx + 1}</td>
            <td class="sticky-col col-left" style="font-family:ui-monospace,monospace;font-weight:800;">${sEsc(r.docNo)}</td>
            <td class="col-left">${sEsc(r.itemName)}</td>
            <td class="num">${r.isVoid ? '-' : sNum(r.openBal)}</td>
            <td class="num ksf-in-num">${r.isVoid || !r.inQty ? '-' : '+' + sNum(r.inQty)}</td>
            <td class="num ksf-out-num">${r.isVoid || !r.outQty ? '-' : '-' + sNum(r.outQty)}</td>
            <td class="num" style="font-weight:900;">${r.isVoid ? '-' : sNum(r.endBal)}</td>
            <td class="col-left">${sEsc(r.party)}</td>
            <td style="font-family:ui-monospace,monospace;font-size:10.5px;">${sEsc(r.date)}</td>
          </tr>`;
      });

      tableHtml = `
        <table class="ksf-tbl">
          <thead>
            <tr>
              <th class="rownum">#</th>
              <th class="sticky-col col-left">${sEsc(L('ሰነድ / ፓድ', 'Doc / Pad'))}</th>
              <th class="col-left">${sEsc(L('የዕቃው አይነት', 'Item'))}</th>
              <th>${sEsc(L('መነሻ', 'Open'))}</th>
              <th>${sEsc(L('የገባ (+)', 'IN'))}</th>
              <th>${sEsc(L('የወጣ (-)', 'OUT'))}</th>
              <th>${sEsc(L('ቀሪ', 'Bal'))}</th>
              <th class="col-left">${sEsc(L('ደንበኛ / አቅራቢ', 'Party'))}</th>
              <th>${sEsc(L('ቀን', 'Date'))}</th>
            </tr>
          </thead>
          <tbody>
            ${trs || `<tr><td colspan="9" style="text-align:center;padding:24px;color:#8b9bb0;">${sEsc(L('ምንም እንቅስቃሴ አልተገኘም', 'No ledger rows found'))}</td></tr>`}
          </tbody>
        </table>`;
    } else {
      const { groups } = buildGroupedSummary(tab, refDate);
      let rowNo = 0;
      let trs = '';
      Object.keys(groups).forEach((cat) => {
        rowNo++;
        trs += `<tr class="ksf-cat-row"><td class="rownum">${rowNo}</td><td colspan="5">${sEsc(cat)}</td></tr>`;
        groups[cat].forEach((r) => {
          rowNo++;
          totIn += r.inQty; totOut += r.outQty; totEnd += r.ending;
          const lowCls = r.ending === 0 || r.ending <= r.minStock ? 'ksf-row-low' : '';
          trs += `
            <tr class="${lowCls}">
              <td class="rownum">${rowNo}</td>
              <td class="sticky-col col-left" style="font-weight:700;">${sEsc(r.name)}</td>
              <td class="num">${sNum(r.opening)}</td>
              <td class="num ksf-in-num">${r.inQty ? '+' + sNum(r.inQty) : '0'}</td>
              <td class="num ksf-out-num">${r.outQty ? '-' + sNum(r.outQty) : '0'}</td>
              <td class="num" style="font-weight:900;">${sNum(r.ending)}</td>
            </tr>`;
        });
      });

      tableHtml = `
        <table class="ksf-tbl">
          <thead>
            <tr>
              <th class="rownum">#</th>
              <th class="sticky-col col-left">${sEsc(L('የዕቃ አይነት', 'Item Type'))}</th>
              <th>${sEsc(L('መነሻ', 'Start'))}</th>
              <th>${sEsc(L('የገባ (+)', 'IN (+)'))}</th>
              <th>${sEsc(L('የወጣ (-)', 'OUT (-)'))}</th>
              <th>${sEsc(L('ቀሪ', 'Balance'))}</th>
            </tr>
          </thead>
          <tbody>
            ${trs || `<tr><td colspan="6" style="text-align:center;padding:24px;color:#8b9bb0;">${sEsc(L('ዕቃ አልተገኘም', 'No products'))}</td></tr>`}
            <tr class="ksf-tot-row">
              <td class="rownum">Σ</td>
              <td class="sticky-col col-left">${sEsc(L('ጠቅላላ ድምር', 'TOTAL'))}</td>
              <td class="num">-</td>
              <td class="num">+${sNum(totIn)}</td>
              <td class="num">-${sNum(totOut)}</td>
              <td class="num">${sNum(totEnd)}</td>
            </tr>
          </tbody>
        </table>`;
    }

    root.innerHTML = `
      <div class="ksf-tabs">
        <button type="button" class="ksf-tab ${tab === 'daily' ? 'on' : ''}" onclick="KoraSF.setSheetTab('daily')">${sEsc(L('ዕለታዊ', 'Daily'))}</button>
        <button type="button" class="ksf-tab ${tab === 'weekly' ? 'on' : ''}" onclick="KoraSF.setSheetTab('weekly')">${sEsc(L('ሳምንታዊ', 'Weekly'))}</button>
        <button type="button" class="ksf-tab ${tab === 'monthly' ? 'on' : ''}" onclick="KoraSF.setSheetTab('monthly')">${sEsc(L('ወርሃዊ', 'Monthly'))}</button>
        <button type="button" class="ksf-tab ${tab === 'history' ? 'on' : ''}" onclick="KoraSF.setSheetTab('history')">${sEsc(L('ሙሉ ታሪክ', 'Full Log'))}</button>
      </div>

      <div class="ksf-bar">
        <input type="date" class="inp sm mono" style="width:132px;" value="${sEsc(refDate)}" onchange="KoraSF.setSheetDate(this.value)">
        ${tab !== 'history' ? `<button type="button" class="btn sm ${ui.hideZero ? 'teal' : 'muted'}" onclick="KoraSF.toggleHideZero()">${ui.hideZero ? L('0 ተደብቋል', '0 Hidden') : L('0 ደብቅ', 'Hide 0')}</button>` : ''}
        <div style="margin-left:auto;display:flex;align-items:center;gap:6px;">
          <span style="font-size:11px;font-family:ui-monospace,monospace;font-weight:800;">
            <span style="color:#34d399;">+${sNum(totIn)}</span> · <span style="color:#fb7185;">-${sNum(totOut)}</span>${voidCnt ? ` · <span style="color:#f59e0b;">VOID:${voidCnt}</span>` : ''}
          </span>
          <button type="button" class="btn teal sm" style="display:inline-flex;align-items:center;gap:5px;" onclick="KoraSF.openShareHub()">${ICO.share}<span>${sEsc(L('ላክ / አውርድ', 'Export / Share'))}</span></button>
        </div>
      </div>

      <div class="ksf-sheet-wrap">${tableHtml}</div>`;
  }

  // ===========================================================================
  // 2. ባለብዙ-አማራጭ የኤክሴል/PDF/Share ማዕከል (Export & Share Hub)
  // ===========================================================================
  function buildStyledExcelHtml() {
    const ui = state.sheetUi;
    const tab = ui.tab || 'daily';
    const refDate = ui.date || todayIso();
    const org = state.orgName || 'ኮራ ስቶክ';
    const title = `${org} — ${tab === 'history' ? L('ሙሉ ዕለታዊ ታሪክ', 'Full History') : (tab === 'weekly' ? L('ሳምንታዊ ክምችት', 'Weekly Stock') : (tab === 'monthly' ? L('ወርሃዊ ክምችት', 'Monthly Stock') : L('ዕለታዊ ክምችት', 'Daily Stock')))} (${refDate})`;

    let bodyRows = '';
    if (tab === 'history') {
      bodyRows += `<tr style="background:#0f172a;color:#ffffff;font-weight:bold;"><th>ሰነድ/ፓድ</th><th>የዕቃ አይነት</th><th>መነሻ</th><th>የገባ (+)</th><th>የወጣ (-)</th><th>ቀሪ</th><th>ደንበኛ/አቅራቢ</th><th>ቀን</th></tr>`;
      getFilteredLedger('', refDate).forEach((r) => {
        const bg = r.isVoid ? '#fecaca' : (r.endBal === 0 && r.outQty > 0 ? '#fef3c7' : (r.inQty > 0 ? '#dcfce7' : '#ffffff'));
        bodyRows += `<tr style="background:${bg};"><td>${sEsc(r.docNo)}</td><td>${sEsc(r.itemName)}</td><td>${r.isVoid ? '-' : r.openBal}</td><td>${r.isVoid ? '-' : r.inQty}</td><td>${r.isVoid ? '-' : r.outQty}</td><td><b>${r.isVoid ? '-' : r.endBal}</b></td><td>${sEsc(r.party)}</td><td>${sEsc(r.date)}</td></tr>`;
      });
    } else {
      const { groups } = buildGroupedSummary(tab, refDate);
      bodyRows += `<tr style="background:#0f172a;color:#ffffff;font-weight:bold;"><th>የዕቃ አይነት</th><th>መነሻ</th><th>የገባ (+)</th><th>የወጣ (-)</th><th>ቀሪ</th></tr>`;
      let tIn = 0, tOut = 0, tEnd = 0;
      Object.keys(groups).forEach((cat) => {
        bodyRows += `<tr style="background:#bbf7d0;font-weight:bold;"><td colspan="5">${sEsc(cat)}</td></tr>`;
        groups[cat].forEach((r) => {
          tIn += r.inQty; tOut += r.outQty; tEnd += r.ending;
          const bg = r.ending === 0 || r.ending <= r.minStock ? '#fee2e2' : '#ffffff';
          bodyRows += `<tr style="background:${bg};"><td>${sEsc(r.name)}</td><td>${r.opening}</td><td>${r.inQty}</td><td>${r.outQty}</td><td><b>${r.ending}</b></td></tr>`;
        });
      });
      bodyRows += `<tr style="background:#e2e8f0;font-weight:bold;"><td>ጠቅላላ ድምር</td><td>-</td><td>${tIn}</td><td>${tOut}</td><td>${tEnd}</td></tr>`;
    }

    return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #94a3b8;padding:6px 8px;font-size:12px;}h3{margin:0 0 8px;}</style></head><body><h3>${sEsc(title)}</h3><table>${bodyRows}</table></body></html>`;
  }

  function buildCsvText() {
    const tab = state.sheetUi.tab || 'daily', refDate = state.sheetUi.date || todayIso();
    const lines = [];
    if (tab === 'history') {
      lines.push(['Doc/Pad', 'Item', 'Open', 'IN', 'OUT', 'Balance', 'Party', 'Date'].join(','));
      getFilteredLedger('', refDate).forEach((r) => {
        lines.push([r.docNo, r.itemName, r.openBal, r.inQty, r.outQty, r.endBal, r.party, r.date].map((x) => `"${String(x).replace(/"/g, '""')}"`).join(','));
      });
    } else {
      lines.push(['Category', 'Item', 'Start', 'IN', 'OUT', 'Balance'].join(','));
      const { groups } = buildGroupedSummary(tab, refDate);
      Object.keys(groups).forEach((cat) => {
        groups[cat].forEach((r) => {
          lines.push([cat, r.name, r.opening, r.inQty, r.outQty, r.ending].map((x) => `"${String(x).replace(/"/g, '""')}"`).join(','));
        });
      });
    }
    return '\uFEFF' + lines.join('\n');
  }

  function buildTextSummary() {
    const tab = state.sheetUi.tab || 'daily', refDate = state.sheetUi.date || todayIso();
    const org = state.orgName || 'ኮራ ስቶክ';
    const lines = [`📊 ${org} — ${tab.toUpperCase()} (${refDate})`];
    if (tab === 'history') {
      getFilteredLedger('', refDate).slice(0, 25).forEach((r) => {
        lines.push(r.isVoid ? `❌ ${r.docNo}: VOID (${r.party})` : `• ${r.docNo} | ${r.itemName}: ${r.inQty ? '+' + r.inQty : '-' + r.outQty} ➔ ቀሪ ${r.endBal}`);
      });
    } else {
      const { groups } = buildGroupedSummary(tab, refDate);
      Object.keys(groups).forEach((cat) => {
        lines.push(`\n[${cat}]`);
        groups[cat].forEach((r) => lines.push(`• ${r.name}: መነሻ ${r.opening} | +${r.inQty} / -${r.outQty} ➔ ቀሪ ${r.ending}`));
      });
    }
    return lines.join('\n');
  }

  function openShareHub() {
    openModal(`${L('ላክ እና አጋራ (Export & Share)', 'Export & Share Stock Sheet')}`, `
      <div class="sub-card">
        <div style="font-size:11.5px;color:var(--muted);margin-bottom:8px;">
          ${sEsc(L('የአሁኑን የክምችት ሠንጠረዥ በመረጥከው ቅርጸት አውርድ ወይም በቀጥታ አጋራ፦', 'Download or share the active stock sheet in your preferred format:'))}
        </div>
        <div class="ksf-share-grid">
          <button type="button" class="btn teal sm" onclick="KoraSF.exportExcel()">${ICO.sheet} Excel (.xls)</button>
          <button type="button" class="btn muted sm" onclick="KoraSF.exportCsv()">CSV (Google Sheets)</button>
          <button type="button" class="btn primary sm" onclick="KoraSF.printCleanPdf()">PDF / ${sEsc(L('አትም (A4)', 'Print A4'))}</button>
          <button type="button" class="btn emerald sm" onclick="KoraSF.nativeShareExcel()">${ICO.share} ${sEsc(L('ቀጥታ አጋራ (Share)', 'Share File'))}</button>
          <button type="button" class="btn muted sm" onclick="KoraSF.shareWhatsApp()">WhatsApp</button>
          <button type="button" class="btn muted sm" onclick="KoraSF.copySummary()">${sEsc(L('ጽሁፍ ቅዳ (Copy)', 'Copy Text'))}</button>
        </div>
      </div>`, `<button type="button" class="btn muted" onclick="closeModal()">${sEsc(L('ዝጋ', 'Close'))}</button>`);
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportExcel() {
    const fn = `kora-stock-${state.sheetUi.tab}-${state.sheetUi.date}.xls`;
    downloadBlob(new Blob([buildStyledExcelHtml()], { type: 'application/vnd.ms-excel;charset=utf-8' }), fn);
    closeModal(); showToast(L('Excel (.xls) ፋይል ወርዷል!', 'Excel file downloaded!'));
  }

  function exportCsv() {
    const fn = `kora-stock-${state.sheetUi.tab}-${state.sheetUi.date}.csv`;
    downloadBlob(new Blob([buildCsvText()], { type: 'text/csv;charset=utf-8' }), fn);
    closeModal(); showToast(L('CSV ፋይል ወርዷል!', 'CSV file downloaded!'));
  }

  function printCleanPdf() {
    const w = window.open('', '_blank');
    if (!w) { showToast(L('Pop-up ተከልክሏል', 'Pop-up blocked'), true); return; }
    w.document.write(buildStyledExcelHtml().replace('</body>', '<script>window.onload=()=>setTimeout(()=>window.print(),250);</script></body>'));
    w.document.close();
    closeModal();
  }

  async function nativeShareExcel() {
    const fn = `kora-stock-${state.sheetUi.tab}-${state.sheetUi.date}.xls`;
    const file = new File([buildStyledExcelHtml()], fn, { type: 'application/vnd.ms-excel' });
    try {
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: state.orgName || 'Kora Stock', files: [file] });
        closeModal(); return;
      }
      if (navigator.share) {
        await navigator.share({ title: state.orgName || 'Kora Stock', text: buildTextSummary() });
        closeModal(); return;
      }
    } catch {}
    exportExcel();
  }

  function shareWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(buildTextSummary())}`, '_blank');
    closeModal();
  }

  function copySummary() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(buildTextSummary());
      showToast(L('ሠንጠረዡ ተቀድቷል — ቴሌግራም/ዋትስአፕ ላይ ይለጥፉ', 'Copied to clipboard'));
    }
    closeModal();
  }

  // ===========================================================================
  // 3. ተለዋዋጭ የቅፅ ገንቢ (Dynamic Custom Form Builder — ለማንኛውም ድርጅት)
  // ===========================================================================
  const FORM_MODULES = [
    { k: 'sales',     am: 'ሽያጭ',    en: 'Sales' },
    { k: 'warehouse', am: 'መጋዘን',   en: 'Warehouse' },
    { k: 'purchase',  am: 'ግዢ',     en: 'Purchase' },
    { k: 'customer',  am: 'ደንበኛ',   en: 'Customer' },
    { k: 'dispatch',  am: 'ማጓጓዣ',   en: 'Dispatch' }
  ];

  const FIELD_TYPES = [
    { k: 'text',   am: 'ጽሁፍ (Text)',         en: 'Text' },
    { k: 'number', am: 'ቁጥር (Number)',       en: 'Number' },
    { k: 'select', am: 'ምርጫ (Dropdown)',     en: 'Dropdown' },
    { k: 'date',   am: 'ቀን (Date)',          en: 'Date' },
    { k: 'toggle', am: 'አዎ / አይ (Switch)',   en: 'Yes / No' }
  ];

  function renderDynamicFormBuilderCard(container) {
    ensureSfState();
    injectSfCss();
    if (container.querySelector('[data-ksf-builder]')) return;

    const mod = state.customFormTab || 'sales';
    const fields = state.customForms[mod] || [];
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-ksf-builder', '1');
    card.innerHTML = `
      <div class="card-row">
        <b style="color:var(--teal);">${sEsc(L('ተለዋዋጭ የድርጅት ቅፅ ገንቢ (Custom Fields)', 'Dynamic Custom Form Builder'))}</b>
        <button type="button" class="btn teal sm" style="display:inline-flex;align-items:center;gap:4px;" onclick="KoraSF.openAddFieldModal()">${ICO.plus} ${sEsc(L('አዲስ መስክ', 'Add Field'))}</button>
      </div>
      <div style="font-size:11px;color:var(--muted);">
        ${sEsc(L('ማንኛውም ድርጅት እንደ ሥራው ባህሪ የራሱን መስኮች (ለምሳሌ የታርጋ ቁጥር፣ ውፍረት፣ ኮንትራት ቁጥር…) ጨምሮ በቅጾቹ ውስጥ እንዲታዩ ያደርጋል።', 'Add custom fields tailored to any business—they automatically appear inside the corresponding forms.'))}
      </div>

      <div class="subtabs no-scrollbar" style="margin-top:4px;">
        ${FORM_MODULES.map((m) => `<button type="button" class="subtab ${mod === m.k ? 'active' : ''}" onclick="KoraSF.setFormTab('${m.k}')">${sEsc(isAm() ? m.am : m.en)} (${(state.customForms[m.k] || []).length})</button>`).join('')}
      </div>

      <div style="display:flex;flex-direction:column;gap:5px;margin-top:6px;">
        ${fields.map((f, idx) => {
          const tObj = FIELD_TYPES.find((x) => x.k === f.type) || FIELD_TYPES[0];
          return `
            <div class="ksf-field-row">
              <div style="min-width:0;flex:1;">
                <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;">
                  <b style="font-size:12px;">${sEsc(f.label)}</b>
                  <span class="pill" style="font-size:9.5px;">${sEsc(isAm() ? tObj.am : tObj.en)}</span>
                  ${f.required ? `<span class="pill rose" style="font-size:9px;">${sEsc(L('ግዴታ', 'Req'))}</span>` : ''}
                </div>
                ${f.options ? `<div style="font-size:10px;color:var(--muted);margin-top:2px;">${sEsc(f.options)}</div>` : ''}
              </div>
              <div style="display:flex;align-items:center;gap:6px;">
                <div class="toggle ${f.enabled !== false ? 'on' : ''}" onclick="KoraSF.toggleField('${mod}',${idx})"></div>
                <button type="button" class="btn ghost sm" style="color:var(--rose);padding:0 6px;" onclick="KoraSF.deleteField('${mod}',${idx})">${ICO.trash}</button>
              </div>
            </div>`;
        }).join('') || `<div class="sub-card" style="text-align:center;color:var(--muted);padding:14px;font-size:11.5px;">${sEsc(L('ለዚህ ቅፅ የተጨመረ ተጨማሪ መስክ የለም — «+ አዲስ መስክ» ን ይጫኑ', 'No custom fields yet — tap "+ Add Field"'))}</div>`}
      </div>`;

    container.prepend(card);
  }

  function openAddFieldModal() {
    const mod = state.customFormTab || 'sales';
    const modLbl = FORM_MODULES.find((m) => m.k === mod);
    openModal(`${L('አዲስ የቅፅ መስክ ጨምር', 'Add Custom Field')} · ${isAm() ? modLbl?.am : modLbl?.en}`, `
      <div class="sub-card">
        <label class="lbl">${sEsc(L('የመስኩ ስም (Label)', 'Field Name / Label'))}</label>
        <input id="ksfFLbl" class="inp" placeholder="${sEsc(L('ለምሳሌ የመኪና ታርጋ / የውል ቁጥር / ውፍረት', 'e.g. Plate No / Contract ID / Gauge'))}">
        <div class="grid-2" style="margin-top:6px;">
          <div>
            <label class="lbl">${sEsc(L('የመስኩ ዓይነት', 'Field Type'))}</label>
            <select id="ksfFType" class="sel" onchange="document.getElementById('ksfOptWrap').style.display=this.value==='select'?'block':'none'">
              ${FIELD_TYPES.map((t) => `<option value="${t.k}">${sEsc(isAm() ? t.am : t.en)}</option>`).join('')}
            </select>
          </div>
          <div class="switch-row" style="align-self:end;padding-bottom:4px;">
            <span style="font-size:11.5px;">${sEsc(L('ግዴታ ይሁን?', 'Required?'))}</span>
            <div id="ksfFReq" class="toggle" onclick="this.classList.toggle('on')"></div>
          </div>
        </div>
        <div id="ksfOptWrap" style="display:none;margin-top:6px;">
          <label class="lbl">${sEsc(L('የምርጫ ዝርዝር (በኮማ ይለዩ)', 'Dropdown Options (comma separated)'))}</label>
          <input id="ksfFOpts" class="inp sm" placeholder="${sEsc(L('ለምሳሌ 0.75mm, 0.9mm, 1.2mm', 'e.g. Option A, Option B'))}">
        </div>
      </div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${sEsc(L('ተው', 'Cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraSF.saveNewField()">${sEsc(L('ጨምር', 'Save Field'))}</button>`);
  }

  function saveNewField() {
    const mod = state.customFormTab || 'sales';
    const label = (document.getElementById('ksfFLbl')?.value || '').trim();
    const type = document.getElementById('ksfFType')?.value || 'text';
    const required = document.getElementById('ksfFReq')?.classList.contains('on') || false;
    const options = (document.getElementById('ksfFOpts')?.value || '').trim();
    if (!label) { showToast(L('የመስኩን ስም ያስገቡ', 'Enter field label'), true); return; }
    state.customForms[mod].push({ id: 'cf_' + Date.now(), label, type, required, options, enabled: true });
    saveState(); closeModal(); renderView();
    showToast(L('አዲሱ መስክ ተጨምሯል!', 'Custom field added!'));
  }

  // የተፈጠሩትን Custom Fields በራሱ ወደ ተዛማጅ ሞዳሎች ማስገባት
  function injectCustomFieldsIntoModal() {
    if (!hasState()) return;
    ensureSfState();
    const modal = document.querySelector('#modalOverlay.open, .modal-bg.open, #modalCard, .modal-card');
    if (!modal || modal.querySelector('[data-ksf-injected]')) return;

    const headTxt = (modal.querySelector('h3, h4, .modal-title, .modal-head')?.textContent || modal.textContent.slice(0, 60)).toLowerCase();
    let mod = null;
    if (headTxt.includes('ሽያጭ') || headTxt.includes('sale')) mod = 'sales';
    else if (headTxt.includes('መጋዘን') || headTxt.includes('ገቢ') || headTxt.includes('ወጪ') || headTxt.includes('warehouse')) mod = 'warehouse';
    else if (headTxt.includes('ግዢ') || headTxt.includes('purchase')) mod = 'purchase';
    else if (headTxt.includes('ደንበኛ') || headTxt.includes('customer')) mod = 'customer';
    else if (headTxt.includes('ማጓጓዣ') || headTxt.includes('ትዕዛዝ') || headTxt.includes('dispatch')) mod = 'dispatch';
    if (!mod) return;

    const activeFields = (state.customForms[mod] || []).filter((f) => f.enabled !== false);
    if (!activeFields.length) return;

    const body = modal.querySelector('.modal-body, #modalBody') || modal;
    const wrap = document.createElement('div');
    wrap.className = 'sub-card';
    wrap.setAttribute('data-ksf-injected', '1');
    wrap.style.marginTop = '6px';
    wrap.innerHTML = `
      <div style="font-size:10px;font-weight:800;color:var(--teal);margin-bottom:4px;">${sEsc(L('የድርጅቱ ተጨማሪ መስኮች', 'Custom Organization Fields'))}</div>
      ${activeFields.map((f) => {
        if (f.type === 'select') {
          const opts = (f.options || '').split(',').map((o) => o.trim()).filter(Boolean);
          return `<div style="margin-top:4px;"><label class="lbl">${sEsc(f.label)}${f.required ? ' *' : ''}</label><select class="sel" data-cf-id="${f.id}">${opts.map((o) => `<option value="${sEsc(o)}">${sEsc(o)}</option>`).join('')}</select></div>`;
        }
        if (f.type === 'toggle') {
          return `<div class="switch-row" style="margin-top:4px;"><span>${sEsc(f.label)}</span><div class="toggle" data-cf-id="${f.id}" onclick="this.classList.toggle('on')"></div></div>`;
        }
        const inpType = f.type === 'number' ? 'number' : (f.type === 'date' ? 'date' : 'text');
        return `<div style="margin-top:4px;"><label class="lbl">${sEsc(f.label)}${f.required ? ' *' : ''}</label><input type="${inpType}" class="inp sm" data-cf-id="${f.id}" ${f.required ? 'required' : ''}></div>`;
      }).join('')}`;
    body.appendChild(wrap);
  }

  // ===========================================================================
  // 4. ውህደት (Hooks — በመጋዘን «ክምችት» እና በ«የቅፅ ቅንብር» ላይ)
  // ===========================================================================
  function isWarehouseStockSheetActive() {
    if (!hasState() || state.activeMainTab !== 'warehouse') return false;
    const sub = String(state.activeSubTab?.warehouse || '').toLowerCase();
    if (['stock', 'ledger', 'sheet', 'history', 'list'].includes(sub)) return true;
    const activeSub = document.querySelector('#subTabsBar .subtab.active');
    const txt = (activeSub?.textContent || '').trim().toLowerCase();
    return txt.includes('ክምችት') || txt.includes('stock') || txt.includes('ledger');
  }

  function isFormSettingsActive() {
    if (!hasState()) return false;
    const tab = String(state.activeMainTab || '').toLowerCase();
    if (tab.includes('form')) return true;
    const activeSub = document.querySelector('#subTabsBar .subtab.active');
    const txt = (activeSub?.textContent || '').trim();
    return txt.includes('የቅፅ ቅንብር') || txt.includes('የቅጽ ቅንብር') || txt.toLowerCase().includes('form');
  }

  function installSfHooks() {
    if (!hasState() || global._ksfHooksDone) return;
    global._ksfHooksDone = true;
    ensureSfState();
    injectSfCss();

    if (typeof global.renderView === 'function') {
      const _origRV = global.renderView;
      global.renderView = function () {
        const res = _origRV.apply(this, arguments);
        const root = document.getElementById('viewRoot');
        if (root && isWarehouseStockSheetActive()) {
          renderGoogleSheetsWarehouse(root);
        } else if (root && isFormSettingsActive()) {
          renderDynamicFormBuilderCard(root);
        }
        return res;
      };
    }

    if (typeof global.openModal === 'function') {
      const _origOM = global.openModal;
      global.openModal = function () {
        const res = _origOM.apply(this, arguments);
        setTimeout(injectCustomFieldsIntoModal, 10);
        return res;
      };
    }

    // ገጹ አስቀድሞ ክፍት ከሆነ ወዲያውኑ መጫን
    const root = document.getElementById('viewRoot');
    if (root && isWarehouseStockSheetActive()) renderGoogleSheetsWarehouse(root);
    if (root && isFormSettingsActive()) renderDynamicFormBuilderCard(root);
  }

  global.KoraSF = {
    setSheetTab(t) { state.sheetUi.tab = t; saveState(); renderView(); },
    setSheetDate(d) { state.sheetUi.date = d || todayIso(); saveState(); renderView(); },
    toggleHideZero() { state.sheetUi.hideZero = !state.sheetUi.hideZero; saveState(); renderView(); },
    openShareHub, exportExcel, exportCsv, printCleanPdf, nativeShareExcel, shareWhatsApp, copySummary,
    setFormTab(m) { state.customFormTab = m; saveState(); renderView(); },
    openAddFieldModal, saveNewField,
    toggleField(mod, idx) {
      const f = state.customForms[mod]?.[idx];
      if (f) { f.enabled = f.enabled === false ? true : false; saveState(); renderView(); }
    },
    deleteField(mod, idx) {
      if (state.customForms[mod]) { state.customForms[mod].splice(idx, 1); saveState(); renderView(); }
    }
  };

  installSfHooks();
  document.addEventListener('DOMContentLoaded', installSfHooks);
  setTimeout(installSfHooks, 450);
})(window);
