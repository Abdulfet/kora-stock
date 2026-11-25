// =============================================================================
// ኮራ ስቶክ — የላቁ ሞጁሎችና የUI ማስተካከያዎች (kora-pro.js — ክፍል 1 ከ 2)
// ነባሩን index.html ሳያፈርስ በላዩ ላይ በንጽህና የሚዋሃድ
// =============================================================================
(function (global) {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. ንጹህ ባለሁለት-ቋንቋ መዝገበ-ቃላት (አማርኛ ብቻ / እንግሊዝኛ ብቻ)
  // ---------------------------------------------------------------------------
  const PRO_TXT = {
    am: {
      notifTitle: 'ማሳወቂያዎች',
      noNotifs: 'ምንም አዲስ ማሳወቂያ የለም',
      langMenu: 'ቋንቋ ቀይር',
      calendarLbl: 'የቀን አቆጣጠር',
      calEt: 'የኢትዮጵያ አቆጣጠር',
      calGc: 'የአውሮፓውያን አቆጣጠር',
      inStock: 'በመጋዘን',
      reserved: 'የተያዘ',
      availableQty: 'ለሽያጭ ዝግጁ',
      exceedsAvail: 'ከዝግጁ ክምችት በላይ ነው',
      needsTransport: 'ትራንስፖርት ይፈልጋል',
      dropoffPlace: 'የማድረሻ ቦታ',
      pendingLoad: 'ጭነት የሚጠብቅ',
      partialLoad: 'ከፊል ተጭኗል',
      loadedDone: 'ተጭኗል',
      loadNow: 'ጫን',
      loadViaTally: 'በቆጠራ ጫን',
      loadConfirm: 'ጭነት አረጋግጥ',
      loadedQty: 'የተጫነ ብዛት',
      remainingLoad: 'ቀሪ ጭነት',
      gatePass: 'መውጫ ፈቃድ',
      gateCode: 'የመውጫ ኮድ',
      gateIssued: 'የወጣ ፈቃድ',
      gateExited: 'ወጥቷል',
      verifyExit: 'መውጣት አረጋግጥ',
      transfer: 'ዝውውር',
      fromBranch: 'ላኪ ቅርንጫፍ',
      toBranch: 'ተቀባይ ቅርንጫፍ',
      inTransitTr: 'በመንገድ ላይ',
      receivedTr: 'ተረክቧል',
      sendTransfer: 'ዝውውር ላክ',
      receiveTransfer: 'ዝውውር ተረከብ',
      discrepancy: 'ልዩነት ተገኝቷል',
      shiftTab: 'ፈረቃ',
      openShift: 'ፈረቃ ክፈት',
      closeShift: 'የቀን መዝጊያ',
      openingCash: 'የመነሻ ጥሬ ገንዘብ',
      expectedCash: 'የሚጠበቅ ገንዘብ',
      countedCash: 'የተቆጠረ ገንዘብ',
      shiftOpen: 'ክፍት ፈረቃ',
      shiftClosed: 'ተዘግቷል',
      supplierForm: 'የአቅራቢ መረከቢያ ዝርዝር',
      fiscalNo: 'ፊስካል ቁጥር',
      poNo: 'የግዢ ማዘዣ ቁጥር',
      licenseNo: 'መንጃ ፈቃድ ቁጥር',
      receiverName: 'ተረካቢ ስም',
      lineRemark: 'ማስታወሻ',
      attachPhoto: 'የሰነድ ፎቶ አያይዝ',
      photoAttached: 'ፎቶ ተያይዟል',
      signHere: 'ፊርማ',
      clearSign: 'ፊርማ አጽዳ',
      pendingFin: 'የሂሳብ ማጽደቂያ የሚጠብቅ',
      approveFin: 'ዋጋና ዱቤ አጽድቅ',
      customersMenu: 'ደንበኞች',
      creditLimit: 'የዱቤ ጣሪያ',
      creditDays: 'የመክፈያ ቀናት',
      errCreditLimit: 'ከደንበኛው የዱቤ ጣሪያ በላይ ነው',
      errOverdueBlock: 'ደንበኛው ቀኑ ያለፈበት ዱቤ አለበት',
      modulesTitle: 'የሲስተም ሞጁሎች',
      modGatePass: 'የዕቃ መውጫ ፈቃድ',
      modTransfer: 'የቅርንጫፍ ዝውውር',
      modShift: 'የገንዘብ ያዥ ፈረቃ',
      modDispatch: 'ማጓጓዣ',
      modSupplierForm: 'የአቅራቢ ዝርዝር ፎርምና ፊርማ',
      backupMenu: 'ባክአፕ',
      exportBackup: 'ሙሉ ዳታ አውርድ',
      restoreBackup: 'ዳታ መልስ',
      unitUsed: 'መለኪያ',
      cardMenu: 'አማራጮች',
      viewDetails: 'ዝርዝር እይ',
      dailyOpt: 'ዕለታዊ',
      markVoid: 'ሰነዱን ሰርዝ',
      restoreDoc: 'ሰነዱን መልስ',
      directDeliver: 'ቀጥታ አቅርቦት',
      secLoads: 'ጭነት የሚጠብቁ ሽያጮች',
      secInbound: 'ርክክብ የሚጠብቁ ግዢዎች',
      secFinPend: 'ዋጋ ማጽደቂያ የሚጠብቁ ገቢዎች',
      secTransfers: 'የሚመጡ ዝውውሮች',
      secApprovals: 'የቆጠራ ማጽደቂያዎች',
      secPayables: 'ክፍያ የሚጠብቁ ዱቤዎች'
    },
    en: {
      notifTitle: 'Notifications',
      noNotifs: 'No pending notifications',
      langMenu: 'Switch Language',
      calendarLbl: 'Calendar System',
      calEt: 'Ethiopian Calendar',
      calGc: 'Gregorian Calendar',
      inStock: 'On Hand',
      reserved: 'Reserved',
      availableQty: 'Available',
      exceedsAvail: 'Exceeds available stock',
      needsTransport: 'Requires Transport',
      dropoffPlace: 'Delivery Address',
      pendingLoad: 'Awaiting Load',
      partialLoad: 'Partially Loaded',
      loadedDone: 'Loaded',
      loadNow: 'Load Now',
      loadViaTally: 'Load via Tally',
      loadConfirm: 'Confirm Load',
      loadedQty: 'Loaded Qty',
      remainingLoad: 'Remaining',
      gatePass: 'Gate Pass',
      gateCode: 'Exit Code',
      gateIssued: 'Issued',
      gateExited: 'Exited',
      verifyExit: 'Verify Exit',
      transfer: 'Transfer',
      fromBranch: 'From Branch',
      toBranch: 'To Branch',
      inTransitTr: 'In Transit',
      receivedTr: 'Received',
      sendTransfer: 'Send Transfer',
      receiveTransfer: 'Receive Transfer',
      discrepancy: 'Discrepancy Found',
      shiftTab: 'Shifts',
      openShift: 'Open Shift',
      closeShift: 'Close Day',
      openingCash: 'Opening Cash',
      expectedCash: 'Expected Cash',
      countedCash: 'Counted Cash',
      shiftOpen: 'Active Shift',
      shiftClosed: 'Closed',
      supplierForm: 'Supplier Delivery Details',
      fiscalNo: 'Fiscal Number',
      poNo: 'Order Number',
      licenseNo: 'License Number',
      receiverName: 'Receiver Name',
      lineRemark: 'Remark',
      attachPhoto: 'Attach Slip Photo',
      photoAttached: 'Photo Attached',
      signHere: 'Signature',
      clearSign: 'Clear',
      pendingFin: 'Pending Finance',
      approveFin: 'Approve Cost',
      customersMenu: 'Customers',
      creditLimit: 'Credit Limit',
      creditDays: 'Credit Days',
      errCreditLimit: 'Exceeds customer credit limit',
      errOverdueBlock: 'Customer has overdue balance',
      modulesTitle: 'System Modules',
      modGatePass: 'Gate Pass Control',
      modTransfer: 'Branch Transfers',
      modShift: 'Cashier Shifts',
      modDispatch: 'Dispatch',
      modSupplierForm: 'Supplier Form & Signature',
      backupMenu: 'Backup',
      exportBackup: 'Download Backup',
      restoreBackup: 'Restore Backup',
      unitUsed: 'Unit',
      cardMenu: 'Options',
      viewDetails: 'Details',
      dailyOpt: 'Daily',
      markVoid: 'Void Document',
      restoreDoc: 'Restore Document',
      directDeliver: 'Direct Fulfillment',
      secLoads: 'Sales Awaiting Load',
      secInbound: 'Purchases Awaiting Receipt',
      secFinPend: 'Deliveries Pending Costing',
      secTransfers: 'Incoming Branch Transfers',
      secApprovals: 'Pending Audit Approvals',
      secPayables: 'Approved Payables'
    }
  };

  function pt(k) {
    return (PRO_TXT[state.lang === 'en' ? 'en' : 'am'] || PRO_TXT.am)[k] || k;
  }

  // ---------------------------------------------------------------------------
  // 2. የCSS ማስተካከያዎች (ቀይ ደወል፣ ቋሚ የቆጠራ ቁልፍ፣ ያልተቆረጡ ታቦችና ሠንጠረዦች)
  // ---------------------------------------------------------------------------
  function injectProStyles() {
    if (document.getElementById('koraProStyles')) return;
    const style = document.createElement('style');
    style.id = 'koraProStyles';
    style.textContent = `
      /* በየገጹ ይደጋገም የነበረውን ሰማያዊ ሳጥን ሙሉ በሙሉ አጥፋ */
      #taskBanner { display: none !important; }

      /* የታችኛው ዳሰሳ ቀይ የማሳወቂያ ቁጥር */
      .nav-badge { background: var(--rose) !important; color: #fff !important; box-shadow: 0 0 0 2px #0f172a; }

      /* የላይኛው የማሳወቂያ ደወል ቁልፍ */
      .bell-btn { position: relative; width: 34px; height: 34px; border-radius: 10px; border: 1px solid var(--border-strong); background: var(--surface); color: var(--text); font-size: 16px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .bell-badge { position: absolute; top: -4px; right: -4px; min-width: 17px; height: 17px; padding: 0 4px; border-radius: 9px; background: var(--rose); color: #fff; font-size: 9.5px; font-weight: 900; display: none; align-items: center; justify-content: center; box-shadow: 0 0 0 2px var(--bg); }
      .bell-badge.show { display: inline-flex; }

      /* ቅርንጫፍ መምረጫው ከንዑስ ታቦች ተለይቶ ከላይ እንዲቀመጥ */
      .topbar-row .scope-sel { max-width: 122px; height: 34px; font-size: 11px; }
      #subTabsBar { width: 100%; }

      /* የክምችት ሠንጠረዥ በስልክ ሳይቆረጥ በንጽህና እንዲታይ */
      .tbl-wrap { max-height: 62vh; }
      table.tbl td, table.tbl th { padding: 6px 5px; }
      .stock-dual { display: flex; flex-direction: column; align-items: flex-end; line-height: 1.25; white-space: normal; }
      .stock-dual small { font-size: 9.5px; color: var(--muted); font-weight: 700; }
      .stock-badges { display: flex; flex-wrap: wrap; gap: 3px; justify-content: flex-end; margin-top: 2px; }
      .mini-tag { font-size: 9px; font-weight: 900; padding: 1px 5px; border-radius: 5px; font-family: ui-monospace, monospace; }
      .mini-tag.res { background: rgba(245,158,11,0.2); color: #fde68a; }
      .mini-tag.avl { background: rgba(16,185,129,0.2); color: #6ee7b7; }

      /* በቆጠራ ገጽ ላይ ዋናው ቁልፍ ከታችኛው ዳሰሳ ሥር ፈጽሞ እንዳይቆረጥ */
      .tally-sticky-dock { position: sticky; bottom: 0; z-index: 15; background: rgba(6,10,18,0.96); backdrop-filter: blur(8px); padding: 7px 0 4px; margin-top: 4px; display: flex; flex-direction: column; gap: 6px; border-top: 1px solid var(--border); }
      .viewport.tally-pad { padding-bottom: 76px !important; }

      /* የስክሪን ፊርማ ሳጥን */
      .sig-pad { width: 100%; height: 115px; border-radius: 10px; border: 1.5px dashed var(--teal); background: #070d19; touch-action: none; display: block; cursor: crosshair; }

      /* የካርድ አማራጭ ሜኑ ቁልፍ */
      .more-btn { width: 28px; height: 28px; border-radius: 8px; border: 1px solid var(--border-strong); background: var(--surface-deep); color: var(--muted); font-size: 15px; font-weight: 900; display: inline-flex; align-items: center; justify-content: center; }

      /* የማሳወቂያ ዝርዝር ካርድ */
      .notif-item { background: var(--surface-deep); border: 1px solid var(--border-strong); border-left: 3px solid var(--teal); border-radius: 11px; padding: 9px; display: flex; justify-content: space-between; align-items: center; gap: 8px; }
      .notif-item.warn { border-left-color: var(--amber); }
      .notif-item.rose { border-left-color: var(--rose); }
      .notif-item.cyan { border-left-color: var(--primary); }
    `;
    document.head.appendChild(style);
  }

  // ---------------------------------------------------------------------------
  // 3. የዳታ መዋቅር ማሟያ (ነባር ዳታን ሳያጠፋ)
  // ---------------------------------------------------------------------------
  function ensureProState() {
    if (!state.cfg) state.cfg = {};
    const cfgDefs = {
      calendar: 'ET',
      modGatePass: true,
      modTransfer: true,
      modShift: true,
      modDispatch: true,
      modSupplierForm: true
    };
    Object.keys(cfgDefs).forEach((k) => {
      if (state.cfg[k] === undefined) state.cfg[k] = cfgDefs[k];
    });

    if (!Array.isArray(state.customers)) {
      state.customers = [
        { id: 1, name: 'አቶ ዳዊት', phone: '0911122334', creditLimit: 300000, creditDays: 14 },
        { id: 2, name: 'ብሩክ ንግድ', phone: '0911445566', creditLimit: 200000, creditDays: 14 }
      ];
    }
    if (!Array.isArray(state.gatePasses)) state.gatePasses = [];
    if (!Array.isArray(state.transfers)) state.transfers = [];
    if (!Array.isArray(state.shifts)) state.shifts = [];
    if (!Array.isArray(state.pendingFinanceDeliveries)) state.pendingFinanceDeliveries = [];
    if (!state.reservedMap || typeof state.reservedMap !== 'object') state.reservedMap = {};

    // መጋዘን መጀመሪያ «መመዝገቢያ» እንዲከፍት
    if (!state._proInitV1) {
      state.activeSubTab.warehouse = 'entry';
      state._proInitV1 = true;
      saveState();
    }
    if (state.activeSubTab.warehouse === 'ledger') {
      state.activeSubTab.warehouse = 'stock';
      state.stockPeriod = 'DAILY';
    }
  }

  // ---------------------------------------------------------------------------
  // 4. የኢትዮጵያ እና የአውሮፓውያን ቀን ቀያሪ
  // ---------------------------------------------------------------------------
  function toEthiopianDateStr(isoStr) {
    if (!isoStr || !/^\d{4}-\d{2}-\d{2}/.test(isoStr)) return isoStr || '-';
    const [y, m, d] = isoStr.slice(0, 10).split('-').map(Number);
    // Gregorian to JDN
    const a = Math.floor((14 - m) / 12);
    const y2 = y + 4800 - a;
    const m2 = m + 12 * a - 3;
    const jdn = d + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
    // JDN to Ethiopian
    const r = (jdn - 1723856) % 1461;
    const n = (r % 365) + 365 * Math.floor(r / 1460);
    const ey = 4 * Math.floor((jdn - 1723856) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
    const em = Math.floor(n / 30) + 1;
    const ed = (n % 30) + 1;
    return `${String(ed).padStart(2, '0')}/${String(em).padStart(2, '0')}/${ey}`;
  }

  function fmtDateDisplay(isoStr) {
    if (!isoStr) return '-';
    if (state.cfg?.calendar === 'ET') return toEthiopianDateStr(isoStr);
    return isoStr;
  }

  // ---------------------------------------------------------------------------
  // 5. የተያዘ ክምችት (Reserved) እና ለሽያጭ ዝግጁ ቀሪ ስሌት
  // ---------------------------------------------------------------------------
  function getReservedQty(itemId, br = 'all') {
    let sum = 0;
    (state.salesLedger || []).forEach((s) => {
      if (s.status !== 'valid') return;
      if (s.fulfillmentStatus !== 'PENDING_LOAD' && s.fulfillmentStatus !== 'PARTIAL') return;
      if (Number(s.itemId) !== Number(itemId)) return;
      if (br !== 'all' && s.branch !== br) return;
      const ordered = Number(s.orderedQty ?? s.qty ?? 0);
      const loaded = Number(s.dispatchedQty ?? 0);
      sum += Math.max(0, ordered - loaded);
    });
    return sum;
  }

  function getAvailableStock(item, br = 'all') {
    if (!item) return 0;
    const phys = getItemStock(item, br);
    const res = getReservedQty(item.id, br);
    return Math.max(0, phys - res);
  }

  // ---------------------------------------------------------------------------
  // 6. የላይኛው አሞሌ (🔔 ማሳወቂያ ደወል + ቅርንጫፍ መምረጫ) እና የማሳወቂያ ማዕከል
  // ---------------------------------------------------------------------------
  function setupTopbarUpgrades() {
    const rows = document.querySelectorAll('.topbar .topbar-row');
    if (rows.length < 2) return;
    const row1 = rows[0];
    const scopeEl = document.getElementById('branchScope');
    const langBtn = document.getElementById('btnLangTop');

    // ቅርንጫፍ መምረጫውን ወደ 1ኛ መስመር አውጣው — ንዑስ ታቦቹ ሙሉ ስፋት እንዲያገኙ
    if (scopeEl && scopeEl.parentElement !== row1) {
      row1.insertBefore(scopeEl, langBtn || null);
    }

    // የቋንቋ ቁልፉን ከላይ አጥፍተህ በምትኩ የማሳወቂያ ደወል (🔔) አስቀምጥ
    if (langBtn) langBtn.style.display = 'none';

    if (!document.getElementById('btnNotifBell')) {
      const bell = document.createElement('button');
      bell.type = 'button';
      bell.id = 'btnNotifBell';
      bell.className = 'bell-btn';
      bell.onclick = () => openNotificationCenter();
      bell.innerHTML = '🔔<span id="bellBadge" class="bell-badge">0</span>';
      row1.appendChild(bell);
    }
  }

  function collectActionableNotifications() {
    const br = state.branchScope;
    const out = {
      loads: [],
      inbound: [],
      finPend: [],
      transfers: [],
      approvals: [],
      payables: [],
      gatePasses: []
    };

    // 1. ጭነት የሚጠብቁ ሽያጮች (ለመጋዘን / ባለቤት)
    const loadGroups = new Map();
    (state.salesLedger || []).forEach((s) => {
      if (s.status !== 'valid') return;
      if (s.fulfillmentStatus !== 'PENDING_LOAD' && s.fulfillmentStatus !== 'PARTIAL') return;
      if (br !== 'all' && s.branch !== br) return;
      const rem = Math.max(0, Number(s.orderedQty ?? s.qty) - Number(s.dispatchedQty ?? 0));
      if (rem <= 0) return;
      if (!loadGroups.has(s.invNo)) {
        loadGroups.set(s.invNo, { invNo: s.invNo, branchDoc: s.branchDoc, customer: s.customer, branch: s.branch, date: s.date, lines: [] });
      }
      loadGroups.get(s.invNo).lines.push({ saleId: s.id, itemId: s.itemId, itemName: s.itemName, unit: s.unit, ordered: Number(s.orderedQty ?? s.qty), loaded: Number(s.dispatchedQty ?? 0), rem });
    });
    out.loads = Array.from(loadGroups.values());

    // 2. ርክክብ የሚጠብቁ ግዢዎች
    out.inbound = (state.purchasesLedger || []).filter((p) => p.status === 'pending' && (br === 'all' || p.branch === br));

    // 3. የሂሳብ ዋጋ ማጽደቂያ የሚጠብቁ የአቅራቢ ገቢዎች
    if (hasPerm('costPrice') || hasPerm('banks')) {
      out.finPend = (state.pendingFinanceDeliveries || []).filter((d) => d.status === 'PENDING_FINANCE');
    }

    // 4. በመንገድ ላይ ያሉ የቅርንጫፍ ዝውውሮች
    if (state.cfg.modTransfer) {
      out.transfers = (state.transfers || []).filter((tr) => tr.status === 'IN_TRANSIT' && (br === 'all' || tr.toBranch === br));
    }

    // 5. የቆጠራ ኦዲት ማጽደቂያዎች
    if (hasPerm('approve')) {
      out.approvals = (state.pendingApprovals || []).slice();
    }

    // 6. ጸድቀው ክፍያ የሚጠብቁ ዱቤዎች
    if (hasPerm('pay')) {
      out.payables = (state.creditLedger || []).filter((c) => c.type === 'payable' && c.status === 'approved' && c.total > c.paid);
    }

    // 7. ክፍት የመውጫ ፈቃዶች
    if (state.cfg.modGatePass) {
      out.gatePasses = (state.gatePasses || []).filter((g) => g.status === 'ISSUED' && (br === 'all' || g.branch === br));
    }

    const total = out.loads.length + out.inbound.length + out.finPend.length + out.transfers.length + out.approvals.length + out.payables.length;
    return { ...out, total };
  }

  function updateBellBadge() {
    const n = collectActionableNotifications();
    const badge = document.getElementById('bellBadge');
    if (!badge) return;
    if (n.total > 0) {
      badge.textContent = n.total > 99 ? '99+' : String(n.total);
      badge.classList.add('show');
    } else {
      badge.classList.remove('show');
    }
  }

  function openNotificationCenter() {
    vib(16);
    const n = collectActionableNotifications();
    const sections = [];

    if (n.loads.length) {
      sections.push(`
        <div class="sub-card">
          <b style="color:var(--teal);">${esc(pt('secLoads'))} (${n.loads.length})</b>
          ${n.loads.map((g) => `
            <div class="notif-item">
              <div style="min-width:0;">
                <b>${esc(g.branchDoc || g.invNo)} · ${esc(g.customer)}</b>
                <div style="font-size:10.5px;color:var(--muted);">${esc(g.branch)} · ${g.lines.map((l) => `${esc(l.itemName)} (${fmtNum(l.rem)})`).join('፣ ')}</div>
              </div>
              <div style="display:flex;gap:4px;flex-shrink:0;">
                <button type="button" class="btn muted sm" onclick="closeModal();KoraPro.queueSaleToTally('${esc(g.invNo)}')">🧮</button>
                <button type="button" class="btn teal sm" onclick="closeModal();KoraPro.openLoadSaleModal('${esc(g.invNo)}')">${esc(pt('loadNow'))}</button>
              </div>
            </div>`).join('')}
        </div>`);
    }

    if (n.inbound.length) {
      sections.push(`
        <div class="sub-card">
          <b style="color:var(--amber);">${esc(pt('secInbound'))} (${n.inbound.length})</b>
          ${n.inbound.map((p) => `
            <div class="notif-item warn">
              <div style="min-width:0;">
                <b>${esc(p.itemName)} · ${fmtNum(p.qty)} ${esc(p.unit)}</b>
                <div style="font-size:10.5px;color:var(--muted);">${esc(p.branchDoc)} · ${esc(p.supplier)} · ${esc(p.branch)}</div>
              </div>
              <button type="button" class="btn emerald sm" onclick="closeModal();receivePendingPurchase(${p.id})">${esc(t('receiveNow'))}</button>
            </div>`).join('')}
        </div>`);
    }

    if (n.transfers.length) {
      sections.push(`
        <div class="sub-card">
          <b style="color:var(--primary);">${esc(pt('secTransfers'))} (${n.transfers.length})</b>
          ${n.transfers.map((tr) => `
            <div class="notif-item cyan">
              <div style="min-width:0;">
                <b>${esc(tr.transferNo)} · ${esc(tr.fromBranch)} ➔ ${esc(tr.toBranch)}</b>
                <div style="font-size:10.5px;color:var(--muted);">${tr.items.map((x) => `${esc(x.name)} (${fmtNum(x.sentQty)})`).join('፣ ')}</div>
              </div>
              <button type="button" class="btn primary sm" onclick="closeModal();KoraPro.openReceiveTransferModal('${esc(tr.id)}')">${esc(t('receiveNow'))}</button>
            </div>`).join('')}
        </div>`);
    }

    if (n.finPend.length) {
      sections.push(`
        <div class="sub-card">
          <b style="color:var(--amber);">${esc(pt('secFinPend'))} (${n.finPend.length})</b>
          ${n.finPend.map((d) => `
            <div class="notif-item warn">
              <div style="min-width:0;">
                <b>${esc(d.docNo)} · ${esc(d.supplier)}</b>
                <div style="font-size:10.5px;color:var(--muted);">${esc(d.branch)} · ${fmtDateDisplay(d.date)}</div>
              </div>
              <button type="button" class="btn amber sm" onclick="closeModal();KoraPro.openApproveFinDeliveryModal('${esc(d.id)}')">${esc(pt('approveFin'))}</button>
            </div>`).join('')}
        </div>`);
    }

    if (n.payables.length) {
      sections.push(`
        <div class="sub-card">
          <b style="color:var(--rose);">${esc(pt('secPayables'))} (${n.payables.length})</b>
          ${n.payables.map((c) => `
            <div class="notif-item rose">
              <div style="min-width:0;">
                <b>${esc(c.party)} (${esc(c.docNo)})</b>
                <div style="font-size:10.5px;color:var(--muted);">${fmtMoney(c.approvedAmt || (c.total - c.paid))}</div>
              </div>
              <button type="button" class="btn emerald sm" onclick="closeModal();openCreditActionModal(${c.id},'pay')">${esc(t('executePay'))}</button>
            </div>`).join('')}
        </div>`);
    }

    if (n.approvals.length) {
      sections.push(`
        <div class="sub-card">
          <b style="color:var(--primary);">${esc(pt('secApprovals'))} (${n.approvals.length})</b>
          ${n.approvals.map((a) => `
            <div class="notif-item cyan">
              <div style="min-width:0;">
                <b>${esc(a.itemName)} (${fmtNum(a.sysBal)} ➔ ${fmtNum(a.counted)})</b>
                <div style="font-size:10.5px;color:var(--muted);">${esc(a.branch)} · ${esc(a.requestedBy)}</div>
              </div>
              <button type="button" class="btn teal sm" onclick="closeModal();openSetup('approvals')">${esc(t('confirm'))}</button>
            </div>`).join('')}
        </div>`);
    }

    openModal(pt('notifTitle'), sections.length ? sections.join('') : `<div class="sub-card" style="text-align:center;color:var(--muted);padding:24px;">${esc(pt('noNotifs'))}</div>`);
  }

  // ---------------------------------------------------------------------------
  // 7. የንዑስ ታቦች፣ የታችኛው ዳሰሳ እና የጎን ሜኑ ማሻሻያ (ነባሩን አቀማመጥ ሳይነካ)
  // ---------------------------------------------------------------------------
  const _origRenderDrawer = global.renderDrawer;
  const _origRenderBottomNav = global.renderBottomNav;
  const _origRenderSubTabs = global.renderSubTabs;
  const _origRenderAll = global.renderAll;

  global.renderAll = function () {
    ensureProState();
    setupTopbarUpgrades();
    _origRenderAll();
    updateBellBadge();
    const vp = document.querySelector('.viewport');
    if (vp) vp.classList.toggle('tally-pad', state.activeMainTab === 'tally');
  };

  global.renderDrawer = function () {
    _origRenderDrawer();
    const nav = document.getElementById('drawerNav');
    if (!nav) return;

    const extras = [];
    if (hasPerm('sellPrice') || hasPerm('banks')) {
      extras.push({ k: 'customers', ico: '🤝', lbl: pt('customersMenu') });
    }
    if (isOwner()) {
      extras.push({ k: 'backup', ico: '💾', lbl: pt('backupMenu') });
    }

    const extraHtml = extras.map((x) => {
      const act = state.activeMainTab === 'setup:' + x.k;
      return `<button type="button" class="drawer-item ${act ? 'active' : ''}" onclick="vib(14);openSetup('${x.k}')"><span>${x.ico} ${esc(x.lbl)}</span></button>`;
    }).join('');

    const langItem = `<button type="button" class="drawer-item" onclick="vib(14);closeDrawer();toggleLang()"><span>🌐 ${esc(pt('langMenu'))}</span><span class="pill teal">${esc(t('langSwitch'))}</span></button>`;
    nav.insertAdjacentHTML('beforeend', extraHtml + langItem);
  };

  global.renderBottomNav = function () {
    const n = collectActionableNotifications();
    const whBadge = n.loads.length + n.inbound.length + n.transfers.length;
    const dispBadge = (state.dispatchOrders || []).filter((o) => o.status !== 'delivered').length + n.gatePasses.length;
    const tradeBadge = n.finPend.length + n.payables.length;

    const tabs = [
      { k: 'dashboard', ico: '📊', lbl: t('tDash'), show: true, badge: 0 },
      { k: 'trade', ico: '💼', lbl: t('tTrade'), show: hasPerm('sellPrice') || hasPerm('banks'), badge: tradeBadge },
      { k: 'warehouse', ico: '📦', lbl: t('tWarehouse'), show: true, badge: whBadge },
      { k: 'tally', ico: '🧮', lbl: t('tTally'), show: state.cfg.counter, badge: n.loads.length },
      { k: 'dispatch', ico: '🚚', lbl: t('tDispatch'), show: state.cfg.modDispatch !== false, badge: dispBadge }
    ].filter((x) => x.show);

    const nav = document.getElementById('bottomNav');
    nav.style.gridTemplateColumns = `repeat(${tabs.length}, 1fr)`;
    nav.innerHTML = tabs.map((tb) => `
      <button type="button" class="nav-btn ${state.activeMainTab === tb.k ? 'active' : ''}" onclick="switchMainTab('${tb.k}')">
        <span class="ico">${tb.ico}</span>
        <span>${esc(tb.lbl)}</span>
        ${tb.badge ? `<span class="nav-badge">${tb.badge > 99 ? '99+' : tb.badge}</span>` : ''}
      </button>`).join('');
  };

  global.renderSubTabs = function () {
    const main = state.activeMainTab;
    if (main === 'setup:customers') {
      document.getElementById('subTabsBar').innerHTML = `<button type="button" class="subtab active">${esc(pt('customersMenu'))}</button>`;
      return;
    }
    if (main === 'setup:backup') {
      document.getElementById('subTabsBar').innerHTML = `<button type="button" class="subtab active">${esc(pt('backupMenu'))}</button>`;
      return;
    }
    if (main === 'warehouse') {
      const list = [
        { k: 'entry', lbl: t('sEntry') },
        { k: 'stock', lbl: t('sStock') },
        { k: 'map', lbl: t('sMap') },
        { k: 'alerts', lbl: t('sAlerts') }
      ];
      if (!list.some((x) => x.k === state.activeSubTab.warehouse)) state.activeSubTab.warehouse = 'entry';
      document.getElementById('subTabsBar').innerHTML = list.map((s) =>
        `<button type="button" class="subtab ${state.activeSubTab.warehouse === s.k ? 'active' : ''}" onclick="switchSubTab('${s.k}')">${esc(s.lbl)}</button>`
      ).join('');
      return;
    }
    if (main === 'trade') {
      const list = [
        { k: 'sales', lbl: t('sSales'), show: hasPerm('sellPrice') },
        { k: 'purchases', lbl: t('sPurchases'), show: hasPerm('costPrice') || hasPerm('sellPrice') },
        { k: 'credit', lbl: t('sCredit'), show: hasPerm('sellPrice') || hasPerm('banks') },
        { k: 'shifts', lbl: pt('shiftTab'), show: state.cfg.modShift !== false && (hasPerm('sellPrice') || hasPerm('banks')) }
      ].filter((x) => x.show);
      if (!list.some((x) => x.k === state.activeSubTab.trade) && list.length) state.activeSubTab.trade = list[0].k;
      document.getElementById('subTabsBar').innerHTML = list.map((s) =>
        `<button type="button" class="subtab ${state.activeSubTab.trade === s.k ? 'active' : ''}" onclick="switchSubTab('${s.k}')">${esc(s.lbl)}</button>`
      ).join('');
      return;
    }
    if (main === 'dispatch') {
      const list = [
        { k: 'gatepass', lbl: pt('gatePass'), show: state.cfg.modGatePass !== false },
        { k: 'orders', lbl: t('sOrders'), show: true },
        { k: 'map', lbl: t('sLiveMap'), show: true },
        { k: 'fleet', lbl: t('sFleet'), show: true }
      ].filter((x) => x.show);
      if (!list.some((x) => x.k === state.activeSubTab.dispatch) && list.length) state.activeSubTab.dispatch = list[0].k;
      document.getElementById('subTabsBar').innerHTML = list.map((s) =>
        `<button type="button" class="subtab ${state.activeSubTab.dispatch === s.k ? 'active' : ''}" onclick="switchSubTab('${s.k}')">${esc(s.lbl)}</button>`
      ).join('');
      return;
    }
    _origRenderSubTabs();
  };

  // ---------------------------------------------------------------------------
  // 8. የተሻሻለው የክምችት ሠንጠረዥ (ዕለታዊ + ሳምንታዊ + ወርሃዊ + ሁሉም እና የተያዘ ቀሪ)
  // ---------------------------------------------------------------------------
  global.renderStockReportTable = function (root) {
    const periods = [
      ['DAILY', pt('dailyOpt')],
      ['WEEK', t('thisWeek')],
      ['LAST_WEEK', t('lastWeek')],
      ['MONTH', t('thisMonth')],
      ['ALL', t('allTime')]
    ];
    if (!periods.some((p) => p[0] === state.stockPeriod)) state.stockPeriod = 'WEEK';

    const periodBar = `
      <div class="subtabs no-scrollbar" style="padding-bottom:2px;">
        ${periods.map(([k, lbl]) => `
          <button type="button" class="subtab ${state.stockPeriod === k ? 'active' : ''}" onclick="state.stockPeriod='${k}';saveState();renderView();">${esc(lbl)}</button>
        `).join('')}
      </div>`;

    if (state.stockPeriod === 'DAILY') {
      const q = (document.getElementById('globalSearch')?.value || '').trim().toLowerCase();
      const wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;flex-direction:column;gap:8px;';
      root.innerHTML = periodBar;
      root.appendChild(wrap);
      renderDailyLedger(wrap, q, state.branchScope);
      return;
    }

    const q = (document.getElementById('globalSearch')?.value || '').trim().toLowerCase();
    const rows = computePeriodStockRows(state.stockPeriod);
    const cats = [...new Set(state.inventory.map((i) => i.category || t('allCategories')))].sort();
    const filtered = rows.filter((r) => {
      if (state.categoryFilter !== 'all' && r.category !== state.categoryFilter) return false;
      if (q && !`${r.name} ${r.category} ${r.zoneCode}`.toLowerCase().includes(q)) return false;
      return true;
    });

    const byCat = {};
    filtered.forEach((r) => {
      const c = r.category || t('allCategories');
      if (!byCat[c]) byCat[c] = [];
      byCat[c].push(r);
    });
    const groups = Object.keys(byCat).sort().map((cat) => ({
      cat,
      items: byCat[cat].sort((a, b) => compareItemsSmart(a.name, b.name, cat))
    }));
    global.renderedStockGroups = groups;

    let bodyHtml = '';
    groups.forEach((grp, gIdx) => {
      if (gIdx > 0) bodyHtml += `<tr class="r-sp"><td colspan="5"></td></tr>`;
      const allSel = grp.items.length > 0 && pdfSelectScope === 'stock' && grp.items.every((it) => Boolean(pdfSelected[String(it.id)]));
      bodyHtml += `<tr class="r-cat ${allSel ? 'cat-sel' : ''}" onclick="togglePdfCategory(${gIdx})"><td colspan="5">📁 ${esc(grp.cat)} (${grp.items.length})</td></tr>`;

      grp.items.forEach((r) => {
        const isSel = pdfSelectScope === 'stock' && Boolean(pdfSelected[String(r.id)]);
        const resQ = getReservedQty(r.id, state.branchScope);
        const avlQ = Math.max(0, r.curQty - resQ);
        const subUnitTxt = Number(r.packSize || 1) > 1 ? `${fmtNum(r.curQty * r.packSize)} ${getSubUnitLabel(r)}` : '';

        bodyHtml += `
          <tr class="${isSel ? 'r-sel' : (r.curQty === 0 ? 'r-zero' : '')}" onclick="togglePdfRow('stock','${r.id}',this)">
            <td>
              <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;">
                <div>
                  <b>${esc(r.name)}</b>
                  <div style="font-size:10px;color:var(--amber);">${esc(formatLoc(r))}</div>
                </div>
                <button type="button" class="more-btn" style="width:24px;height:24px;font-size:11px;" onclick="event.stopPropagation();openItemModal(${r.id})">✏️</button>
              </div>
            </td>
            <td class="ctr">${fmtNum(r.openQ)}</td>
            <td class="ctr" style="color:var(--emerald);">${r.inQ > 0 ? '+' + fmtNum(r.inQ) : '-'}</td>
            <td class="ctr" style="color:var(--rose);">${r.outQ > 0 ? '-' + fmtNum(r.outQ) : '-'}</td>
            <td class="num">
              <div class="stock-dual">
                <b style="color:var(--teal);">${fmtNum(r.curQty)} ${esc(getUnitLabel(r))}</b>
                ${subUnitTxt ? `<small>${esc(subUnitTxt)}</small>` : ''}
                ${resQ > 0 ? `
                  <div class="stock-badges">
                    <span class="mini-tag res">${esc(pt('reserved'))}: ${fmtNum(resQ)}</span>
                    <span class="mini-tag avl">${esc(pt('availableQty'))}: ${fmtNum(avlQ)}</span>
                  </div>` : ''}
              </div>
            </td>
          </tr>`;
      });
    });

    root.innerHTML = `
      ${periodBar}
      <div class="card-row">
        <select class="sel" style="max-width:175px;height:31px;" onchange="state.categoryFilter=this.value;renderView();">
          <option value="all">${esc(t('allCategories'))}</option>
          ${cats.map((c) => `<option value="${esc(c)}" ${state.categoryFilter === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}
        </select>
        <div style="display:flex;gap:5px;">
          <button type="button" class="btn teal sm" onclick="openPdfDestModal('stock')">📄 ${esc(t('pdf'))}</button>
          <button type="button" class="btn muted sm" onclick="exportStockCsv()">📊 ${esc(t('excel'))}</button>
        </div>
      </div>
      <div class="tbl-wrap">
        <table class="tbl">
          <thead>
            <tr>
              <th>${esc(t('item'))}</th>
              <th class="ctr">${esc(t('openingBal'))}</th>
              <th class="ctr">${esc(t('totalIn'))}</th>
              <th class="ctr">${esc(t('totalOut'))}</th>
              <th class="num">${esc(t('endingBal'))}</th>
            </tr>
          </thead>
          <tbody>${bodyHtml || `<tr><td colspan="5" class="ctr" style="padding:18px;color:var(--muted);">${esc(t('noData'))}</td></tr>`}</tbody>
        </table>
      </div>`;
  };

  // ---------------------------------------------------------------------------
  // 9. የተሻሻለው የሽያጭ ቅጽና ካርድ (ያለ ቆጠራ ቁልፍ፣ ከተያዘ ክምችት፣ ከዱቤ ጣሪያና ራስ-ሰር ክፍያ ጋር)
  // ---------------------------------------------------------------------------
  let proSaleDraft = null;

  global.openSaleModal = function () {
    const defItem = state.inventory[0];
    const defBr = state.branchScope !== 'all' ? state.branchScope : (state.branches[0]?.name || '');
    const defBank = state.banks[0]?.name || t('creditMethod');
    const unitPrice = defItem ? Number(defItem.sellPrice || 0) : 0;
    const initGrand = state.cfg.vat ? Math.round(unitPrice * (1 + Number(state.vatRate || 0) / 100)) : unitPrice;

    proSaleDraft = {
      invNo: 'INV-' + (1000 + state.salesLedger.length + 1),
      customer: '',
      direct: false,
      needsDispatch: false,
      dropoff: '',
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      lines: defItem ? [{ itemId: defItem.id, branch: defBr, qty: 1, unitFactor: 1, unitLabel: getUnitLabel(defItem), price: unitPrice }] : [],
      payments: [{ method: defBank, amount: initGrand }]
    };
    renderProSaleModal();
  };

  function calcProSaleTotals() {
    const sub = (proSaleDraft?.lines || []).reduce((a, l) => a + Number(l.qty || 0) * Number(l.price || 0), 0);
    const vat = state.cfg.vat ? Math.round(sub * (Number(state.vatRate || 0) / 100)) : 0;
    const grand = sub + vat;
    const paid = (proSaleDraft?.payments || []).reduce((a, p) => a + Number(p.amount || 0), 0);
    return { sub, vat, grand, paid, rem: grand - paid };
  }

  function syncProSalePayAndUi() {
    if (!proSaleDraft) return;
    if (proSaleDraft.payments.length === 1) {
      proSaleDraft.payments[0].amount = calcProSaleTotals().grand;
      const firstPayInp = document.getElementById('proSalePay_0');
      if (firstPayInp) firstPayInp.value = String(proSaleDraft.payments[0].amount);
    }
    const tot = calcProSaleTotals();
    const b = document.getElementById('proSaleTotBadge');
    const r = document.getElementById('proSaleRemBadge');
    if (b) b.textContent = fmtMoney(tot.grand);
    if (r) {
      r.textContent = `${t('unallocated')}: ${fmtNum(tot.rem)}`;
      r.style.color = Math.abs(tot.rem) <= 1 ? 'var(--emerald)' : 'var(--rose)';
    }

    // የእያንዳንዱ መስመር የዝግጁ ክምችት ማስጠንቀቂያ በቀጥታ ማዘመን
    proSaleDraft.lines.forEach((l, idx) => {
      const warnEl = document.getElementById(`proSaleWarn_${idx}`);
      if (!warnEl) return;
      const it = state.inventory.find((x) => x.id === l.itemId);
      const avl = getAvailableStock(it, l.branch);
      const needBase = Number(l.qty || 0) * Number(l.unitFactor || 1);
      const msgs = [];
      if (!proSaleDraft.direct && needBase > avl) msgs.push(`⚠️ ${pt('exceedsAvail')} (${fmtNum(avl)})`);
      if (it && it.floorPrice > 0 && Number(l.price) < it.floorPrice * Number(l.unitFactor || 1)) {
        msgs.push(`⚠️ ${t('errFloor')} (${fmtNum(it.floorPrice)})`);
      }
      warnEl.textContent = msgs.join(' · ');
      warnEl.style.display = msgs.length ? 'block' : 'none';
    });
  }

  function renderProSaleModal() {
    const tot = calcProSaleTotals();
    const payOpts = [...state.banks.map((b) => b.name), t('creditMethod')];
    const custDatalist = `<datalist id="proCustList">${(state.customers || []).map((c) => `<option value="${esc(c.name)}">`).join('')}</datalist>`;

    const linesHtml = proSaleDraft.lines.map((l, idx) => {
      const it = state.inventory.find((x) => x.id === l.itemId);
      const avl = getAvailableStock(it, l.branch);
      const hasSubUnit = it && Number(it.packSize || 1) > 1;
      const needBase = Number(l.qty || 0) * Number(l.unitFactor || 1);
      const warnMsgs = [];
      if (!proSaleDraft.direct && needBase > avl) warnMsgs.push(`⚠️ ${pt('exceedsAvail')} (${fmtNum(avl)})`);
      if (it && it.floorPrice > 0 && Number(l.price) < it.floorPrice * Number(l.unitFactor || 1)) warnMsgs.push(`⚠️ ${t('errFloor')} (${fmtNum(it.floorPrice)})`);

      return `
        <div class="sub-card" style="${warnMsgs.length ? 'border-color:var(--rose);' : ''}">
          <div class="card-row">
            <button type="button" class="btn muted sm" style="flex:1;justify-content:flex-start;" onclick="KoraPro.pickSaleItem(${idx})">${esc(it ? it.name : t('pickItemTitle'))}</button>
            ${proSaleDraft.lines.length > 1 ? `<button type="button" class="icon-btn sm" style="color:var(--rose);" onclick="KoraPro.removeSaleLine(${idx})">✕</button>` : ''}
          </div>
          <div class="grid-2">
            <select class="sel" onchange="KoraPro.setSaleLineField(${idx},'branch',this.value)" ${proSaleDraft.direct ? 'disabled' : ''}>
              ${state.branches.map((b) => `<option value="${esc(b.name)}" ${l.branch === b.name ? 'selected' : ''}>${esc(b.name)} (${fmtNum(getAvailableStock(it, b.name))})</option>`).join('')}
            </select>
            ${hasSubUnit ? `
              <select class="sel" onchange="KoraPro.setSaleUnitMode(${idx},this.value)">
                <option value="main" ${l.unitFactor === 1 ? 'selected' : ''}>${esc(getUnitLabel(it))}</option>
                <option value="sub" ${l.unitFactor < 1 ? 'selected' : ''}>${esc(getSubUnitLabel(it))}</option>
              </select>` : `<input class="inp" readonly value="${esc(it ? getUnitLabel(it) : '-')}">`}
          </div>
          <div class="grid-2">
            <div><label class="lbl">${esc(t('qty'))}</label><input type="number" min="1" class="inp mono" value="${l.qty}" oninput="KoraPro.setSaleLineNum(${idx},'qty',this.value)"></div>
            <div><label class="lbl">${esc(t('unitPrice'))}</label><input type="number" step="0.01" class="inp mono" value="${l.price}" oninput="KoraPro.setSaleLineNum(${idx},'price',this.value)"></div>
          </div>
          <div id="proSaleWarn_${idx}" style="display:${warnMsgs.length ? 'block' : 'none'};font-size:10.5px;color:var(--rose);font-weight:900;">${esc(warnMsgs.join(' · '))}</div>
        </div>`;
    }).join('');

    const paysHtml = proSaleDraft.payments.map((p, idx) => `
      <div style="display:grid;grid-template-columns:1fr 112px auto;gap:5px;align-items:center;">
        <select class="sel" onchange="KoraPro.setSalePayMethod(${idx},this.value)">
          ${payOpts.map((m) => `<option value="${esc(m)}" ${p.method === m ? 'selected' : ''}>${esc(m)}</option>`).join('')}
        </select>
        <input id="proSalePay_${idx}" type="number" min="0" class="inp mono" value="${p.amount}" oninput="KoraPro.setSalePayAmt(${idx},this.value)">
        ${proSaleDraft.payments.length > 1 ? `<button type="button" class="icon-btn sm" style="color:var(--rose);" onclick="KoraPro.removeSalePay(${idx})">✕</button>` : '<span></span>'}
      </div>`).join('');

    openModal(t('newSale'), `
      ${custDatalist}
      <div class="grid-2">
        <div><label class="lbl">${esc(t('docNo'))}</label><input class="inp mono" value="${esc(proSaleDraft.invNo)}" oninput="KoraPro.setSaleMeta('invNo',this.value)"></div>
        <div><label class="lbl">${esc(t('customer'))}</label><input class="inp" list="proCustList" value="${esc(proSaleDraft.customer)}" oninput="KoraPro.setSaleMeta('customer',this.value)"></div>
      </div>
      ${state.cfg.crossDock ? `
        <div class="switch-row" style="padding:3px 0;">
          <span>${esc(pt('directDeliver'))}</span>
          <div class="toggle ${proSaleDraft.direct ? 'on' : ''}" onclick="KoraPro.toggleSaleFlag('direct')"></div>
        </div>` : ''}
      ${state.cfg.modDispatch !== false ? `
        <div class="switch-row" style="padding:3px 0;">
          <span>${esc(pt('needsTransport'))}</span>
          <div class="toggle ${proSaleDraft.needsDispatch ? 'on' : ''}" onclick="KoraPro.toggleSaleFlag('needsDispatch')"></div>
        </div>
        ${proSaleDraft.needsDispatch ? `<input class="inp" value="${esc(proSaleDraft.dropoff)}" placeholder="${esc(pt('dropoffPlace'))}" oninput="KoraPro.setSaleMeta('dropoff',this.value)">` : ''}` : ''}
      ${linesHtml}
      <button type="button" class="btn muted sm" onclick="KoraPro.addSaleLine()">+ ${esc(t('addItemRow'))}</button>
      <div class="sub-card">
        <div class="card-row"><b style="color:var(--teal);">${esc(t('splitPay'))}</b><span id="proSaleTotBadge" class="pill teal">${fmtMoney(tot.grand)}</span></div>
        ${paysHtml}
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;">
          <button type="button" class="btn ghost sm" onclick="KoraPro.addSalePay()">+ ${esc(t('addPayRow'))}</button>
          <span id="proSaleRemBadge" style="font-family:ui-monospace,monospace;font-weight:900;color:${Math.abs(tot.rem) <= 1 ? 'var(--emerald)' : 'var(--rose)'};">${esc(t('unallocated'))}: ${fmtNum(tot.rem)}</span>
        </div>
        ${proSaleDraft.payments.some((p) => p.method === t('creditMethod')) ? `<div><label class="lbl">${esc(t('dueDate'))}</label><input type="date" class="inp" value="${esc(proSaleDraft.dueDate)}" onchange="KoraPro.setSaleMeta('dueDate',this.value)"></div>` : ''}
      </div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${esc(t('cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraPro.submitSale(this)">${esc(t('completeSale'))}</button>`);
  }

  function submitProSale(btn) {
    if (!proSaleDraft || !proSaleDraft.lines.length) return;
    const tot = calcProSaleTotals();
    if (tot.grand <= 0) return;
    if (Math.abs(tot.rem) > 1) { showToast(t('errSplit'), true); return; }

    // የዝግጁ ክምችት ፍተሻ
    if (!proSaleDraft.direct) {
      for (const l of proSaleDraft.lines) {
        const it = state.inventory.find((x) => x.id === l.itemId);
        const need = Number(l.qty || 0) * Number(l.unitFactor || 1);
        if (!it || getAvailableStock(it, l.branch) < need) { showToast(t('errStock'), true); return; }
      }
    }

    // የደንበኛ የዱቤ ጣሪያ እና ያለፈበት ዕዳ ፍተሻ
    const creditAmt = proSaleDraft.payments.filter((p) => p.method === t('creditMethod')).reduce((a, p) => a + Number(p.amount || 0), 0);
    let needOwnerOverride = false;
    let overrideReason = '';

    const belowFloor = proSaleDraft.lines.some((l) => {
      const it = state.inventory.find((x) => x.id === l.itemId);
      return it && it.floorPrice > 0 && Number(l.price) < it.floorPrice * Number(l.unitFactor || 1);
    });
    if (belowFloor) { needOwnerOverride = true; overrideReason = t('errFloor'); }

    if (creditAmt > 0 && proSaleDraft.customer.trim()) {
      const cName = proSaleDraft.customer.trim().toLowerCase();
      const todayIso = new Date().toISOString().slice(0, 10);
      const custObj = (state.customers || []).find((c) => c.name.trim().toLowerCase() === cName);
      const custCredits = (state.creditLedger || []).filter((c) => c.type === 'receivable' && c.party.trim().toLowerCase() === cName && c.total > c.paid);
      const hasOverdue = custCredits.some((c) => c.dueDate && c.dueDate < todayIso);
      const usedCredit = custCredits.reduce((a, c) => a + (c.total - c.paid), 0);
      if (hasOverdue) { needOwnerOverride = true; overrideReason = pt('errOverdueBlock'); }
      else if (custObj && custObj.creditLimit > 0 && (usedCredit + creditAmt) > custObj.creditLimit) {
        needOwnerOverride = true; overrideReason = pt('errCreditLimit');
      }
    }

    if (needOwnerOverride && !isOwner()) {
      showToast(overrideReason, true);
      verifyPin(true, () => commitProSaleNow(btn));
      return;
    }
    commitProSaleNow(btn);
  }

  async function commitProSaleNow(btn) {
    await withBusy(btn, async () => {
      const tot = calcProSaleTotals();
      const today = new Date().toISOString().slice(0, 10);
      const firstBr = proSaleDraft.lines[0].branch;
      const bDoc = nextBranchDoc(firstBr);
      const cust = proSaleDraft.customer.trim() || '-';
      const cleanPays = proSaleDraft.payments.filter((p) => p.amount > 0);
      const creditAmt = cleanPays.filter((p) => p.method === t('creditMethod')).reduce((a, p) => a + p.amount, 0);
      let totalProf = 0;
      const notifItems = [];
      const fStatus = proSaleDraft.direct ? 'COMPLETED' : 'PENDING_LOAD';

      proSaleDraft.lines.forEach((l, idx) => {
        const it = state.inventory.find((x) => x.id === l.itemId);
        if (!it) return;
        const baseQty = Number((Number(l.qty || 0) * Number(l.unitFactor || 1)).toFixed(2));
        const lineSub = Number(l.qty || 0) * Number(l.price || 0);
        const lineVat = state.cfg.vat ? Math.round(lineSub * (state.vatRate / 100)) : 0;
        const lineTot = lineSub + lineVat;
        const lineProf = Math.round(lineSub - (baseQty * Number(it.landedCost || 0)));
        totalProf += lineProf;

        // ክምችቱ መጋዘን ሲጭን እንዲቀነስ አሁን PENDING_LOAD (የተያዘ) ሆኖ ይመዘገባል
        state.salesLedger.push({
          id: Date.now() + idx + 100,
          invNo: proSaleDraft.invNo,
          branchDoc: bDoc,
          customer: cust,
          itemId: it.id,
          itemName: it.name,
          qty: l.qty,
          orderedQty: baseQty,
          dispatchedQty: proSaleDraft.direct ? baseQty : 0,
          fulfillmentStatus: fStatus,
          unit: l.unitLabel || getUnitLabel(it),
          unitPrice: l.price,
          vatAmt: lineVat,
          total: lineTot,
          cost: it.landedCost,
          profit: lineProf,
          payments: idx === 0 ? cleanPays : [],
          branch: l.branch,
          status: 'valid',
          date: today
        });
        notifItems.push({ name: it.name, qty: l.qty, unit: l.unitLabel || getUnitLabel(it), loc: it.zoneCode || '-', total: lineTot });
      });

      if (creditAmt > 0) {
        state.creditLedger.push({
          id: Date.now() + 500, docNo: proSaleDraft.invNo, party: cust, type: 'receivable',
          items: notifItems.map((x) => x.name).join(' · '), total: tot.grand,
          paid: tot.grand - creditAmt, dueDate: proSaleDraft.dueDate, status: 'open',
          approvedAmt: 0, approvedBank: '', ftRef: ''
        });
      }

      if (proSaleDraft.needsDispatch) {
        state.dispatchOrders.unshift({
          id: Date.now() + 700,
          orderNo: 'DSP-' + (500 + state.dispatchOrders.length + 1),
          item: notifItems.map((x) => x.name).join('፣ '),
          qty: notifItems.map((x) => `${fmtNum(x.qty)} ${x.unit}`).join(' · '),
          pickup: firstBr,
          dropoff: proSaleDraft.dropoff.trim() || cust,
          fee: 0, status: 'open', driver: '', plate: '',
          otp: String(1000 + Math.floor(Math.random() * 9000))
        });
      }

      // ለሁሉም የሚመለከታቸው አካላት በራሱ ይልካል (መጋዘን ያለ ዋጋ፣ ሂሳብ/ባለቤት ሙሉ ፋይናንስ)
      dispatchNotifications('sale', {
        docNo: proSaleDraft.invNo, branchDoc: bDoc, party: cust, branch: firstBr,
        items: notifItems, total: tot.grand, profit: totalProf
      });

      saveState();
      closeModal();
      vib([25, 20, 40]);
      playTone(680, 0.1, 'triangle');
      renderAll();
      showToast(t('savedOk'));
    });
  }

  // የሽያጭ ካርድ (ትልቁን ቀይ ቁልፍ ወደ ⋮ ሜኑ መውሰድ + የጭነት ሁኔታ ማሳየት)
  const _origRenderTrade = global.renderTrade;
  global.renderTrade = function (sub) {
    if (sub === 'shifts') {
      if (global.KoraPro && typeof global.KoraPro.renderShiftsView === 'function') {
        global.KoraPro.renderShiftsView(document.getElementById('viewRoot'));
      }
      return;
    }
    if (sub !== 'sales') {
      _origRenderTrade(sub);
      return;
    }
    const root = document.getElementById('viewRoot');
    const q = (document.getElementById('globalSearch')?.value || '').trim().toLowerCase();
    const br = state.branchScope;
    const list = state.salesLedger.slice().reverse().filter((s) => {
      if (br !== 'all' && s.branch !== br) return false;
      if (q && !`${s.invNo} ${s.customer} ${s.itemName}`.toLowerCase().includes(q)) return false;
      return true;
    });

    root.innerHTML = `
      <div class="card-row">
        <button type="button" class="btn teal sm" onclick="openSaleModal()">+ ${esc(t('newSale'))}</button>
        <span class="pill">${fmtNum(list.length)}</span>
      </div>
      <div class="cards-grid">
        ${list.map((s) => {
          const isV = s.status === 'void';
          const payTxt = (s.payments || []).map((p) => `${p.method}: ${fmtNum(p.amount)}`).join(' · ');
          const fs = s.fulfillmentStatus || 'COMPLETED';
          const loadBadge = isV
            ? `<span class="pill rose">${esc(t('voidWord'))}</span>`
            : fs === 'PENDING_LOAD'
              ? `<span class="pill amber">${esc(pt('pendingLoad'))}</span>`
              : fs === 'PARTIAL'
                ? `<span class="pill teal">${esc(pt('partialLoad'))} (${fmtNum(s.dispatchedQty)}/${fmtNum(s.orderedQty)})</span>`
                : `<span class="pill emerald">${esc(pt('loadedDone'))}</span>`;
          return `
            <div class="card" style="${isV ? 'opacity:0.58;border-color:var(--rose);' : ''}">
              <div class="card-row">
                <b style="font-family:ui-monospace,monospace;color:var(--teal);">${esc(s.invNo)}</b>
                <div style="display:flex;align-items:center;gap:5px;">
                  ${loadBadge}
                  ${hasPerm('editVoid') ? `<button type="button" class="more-btn" onclick="KoraPro.openSaleCardMenu(${s.id})">⋮</button>` : ''}
                </div>
              </div>
              <b>${esc(s.customer)}</b>
              <div style="font-size:11.5px;color:var(--muted);">${esc(s.itemName)} · ${fmtNum(s.qty)} ${esc(s.unit)} · ${esc(s.branch)}</div>
              <div class="card-row">
                <b style="font-family:ui-monospace,monospace;font-size:14px;">${fmtMoney(s.total)}</b>
                ${hasPerm('profit') && !isV ? `<span class="pill emerald">+${fmtMoney(s.profit)}</span>` : ''}
              </div>
              <div style="font-size:10.5px;color:var(--muted);">${esc(payTxt)} · ${esc(fmtDateDisplay(s.date))}</div>
            </div>`;
        }).join('') || `<div class="card" style="text-align:center;color:var(--muted);">${esc(t('noData'))}</div>`}
      </div>`;
  };

  function openSaleCardMenu(saleId) {
    const s = state.salesLedger.find((x) => x.id === saleId);
    if (!s) return;
    const isV = s.status === 'void';
    openModal(`${pt('cardMenu')} · ${s.invNo}`, `
      <div class="sub-card">
        <b>${esc(s.customer)}</b>
        <div style="font-size:11.5px;color:var(--muted);">${esc(s.itemName)} · ${fmtNum(s.qty)} ${esc(s.unit)} · ${fmtMoney(s.total)}</div>
      </div>
      <button type="button" class="btn ${isV ? 'teal' : 'danger'}" onclick="closeModal();toggleSaleVoid(${s.id})">${esc(isV ? pt('restoreDoc') : pt('markVoid'))}</button>`);
  }

  // የKoraPro የጋራ መገናኛ (ክፍል 2 ተጨማሪ ተግባራትን እዚህ ላይ ይቀጥላል)
  global.KoraPro = {
    pt,
    fmtDateDisplay,
    getReservedQty,
    getAvailableStock,
    collectActionableNotifications,
    updateBellBadge,
    openNotificationCenter,
    openSaleCardMenu,
    pickSaleItem(idx) {
      openPicker((itemId) => {
        const it = state.inventory.find((x) => x.id === itemId);
        if (!it || !proSaleDraft) return;
        proSaleDraft.lines[idx].itemId = it.id;
        proSaleDraft.lines[idx].unitFactor = 1;
        proSaleDraft.lines[idx].unitLabel = getUnitLabel(it);
        proSaleDraft.lines[idx].price = it.sellPrice;
        syncProSalePayAndUi();
        renderProSaleModal();
      });
    },
    setSaleLineField(idx, k, v) { proSaleDraft.lines[idx][k] = v; syncProSalePayAndUi(); },
    setSaleLineNum(idx, k, v) {
      proSaleDraft.lines[idx][k] = k === 'qty' ? Math.max(1, Number(v || 1)) : Math.max(0, Number(v || 0));
      syncProSalePayAndUi();
    },
    setSaleUnitMode(idx, mode) {
      const l = proSaleDraft.lines[idx];
      const it = state.inventory.find((x) => x.id === l.itemId);
      if (!it) return;
      const ps = Math.max(1, Number(it.packSize || 1));
      if (mode === 'sub') { l.unitFactor = 1 / ps; l.unitLabel = getSubUnitLabel(it); l.price = Number((it.sellPrice / ps).toFixed(2)); }
      else { l.unitFactor = 1; l.unitLabel = getUnitLabel(it); l.price = it.sellPrice; }
      syncProSalePayAndUi();
      renderProSaleModal();
    },
    addSaleLine() {
      const it = state.inventory[0];
      const br = state.branchScope !== 'all' ? state.branchScope : (state.branches[0]?.name || '');
      proSaleDraft.lines.push({ itemId: it?.id || 0, branch: br, qty: 1, unitFactor: 1, unitLabel: getUnitLabel(it), price: it?.sellPrice || 0 });
      syncProSalePayAndUi();
      renderProSaleModal();
    },
    removeSaleLine(idx) { proSaleDraft.lines.splice(idx, 1); syncProSalePayAndUi(); renderProSaleModal(); },
    setSaleMeta(k, v) { proSaleDraft[k] = v; },
    toggleSaleFlag(k) { proSaleDraft[k] = !proSaleDraft[k]; renderProSaleModal(); },
    setSalePayMethod(idx, v) { proSaleDraft.payments[idx].method = v; renderProSaleModal(); },
    setSalePayAmt(idx, v) { proSaleDraft.payments[idx].amount = Math.max(0, Number(v || 0)); syncProSalePayAndUi(); },
    addSalePay() {
      const tot = calcProSaleTotals();
      proSaleDraft.payments.push({ method: state.banks[1]?.name || t('creditMethod'), amount: Math.max(0, tot.rem) });
      renderProSaleModal();
    },
    removeSalePay(idx) { proSaleDraft.payments.splice(idx, 1); syncProSalePayAndUi(); renderProSaleModal(); },
    submitSale: submitProSale
  };

  // === የkora-pro.js ክፍል 1 መጨረሻ (ክፍል 2 ከዚህ ቀጥሎ ይገባል) ===
  // ===========================================================================
  // ክፍል 2: ከፊል ጭነትና መውጫ ፈቃድ፣ የአቅራቢ ገቢ ፎርም (ፎቶና ፊርማ)፣
  //         የቅርንጫፍ ዝውውር፣ ቋሚ የቆጠራ ቁልፍ፣ ፈረቃ፣ ደንበኞች፣ ሞጁሎችና ባክአፕ
  // ===========================================================================

  let activeSigState = { hasInk: false, canvasId: '' };
  let supplierAttachData = '';
  let transferBasket = [];
  let transferToBranch = '';

  // ---------------------------------------------------------------------------
  // 10. የስክሪን ፊርማ ሳጥን (Signature Pad)
  // ---------------------------------------------------------------------------
  function initSigPad(canvasId) {
    const cv = document.getElementById(canvasId);
    if (!cv) return;
    const rect = cv.getBoundingClientRect();
    cv.width = Math.max(260, Math.round(rect.width || 300));
    cv.height = 115;
    const ctx = cv.getContext('2d');
    ctx.strokeStyle = '#2dd4bf';
    ctx.lineWidth = 2.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    activeSigState = { hasInk: false, canvasId };

    let drawing = false;
    const pos = (e) => {
      const r = cv.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (cv.width / r.width), y: (e.clientY - r.top) * (cv.height / r.height) };
    };

    cv.onpointerdown = (e) => {
      drawing = true;
      const p = pos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      activeSigState.hasInk = true;
      try { cv.setPointerCapture(e.pointerId); } catch {}
    };
    cv.onpointermove = (e) => {
      if (!drawing) return;
      const p = pos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    };
    const end = () => { drawing = false; };
    cv.onpointerup = end;
    cv.onpointercancel = end;
  }

  function clearSigPad(canvasId) {
    const cv = document.getElementById(canvasId);
    if (!cv) return;
    cv.getContext('2d').clearRect(0, 0, cv.width, cv.height);
    activeSigState.hasInk = false;
  }

  function readSigData(canvasId) {
    const cv = document.getElementById(canvasId);
    if (!cv || !activeSigState.hasInk) return '';
    try { return cv.toDataURL('image/png'); } catch { return ''; }
  }

  // ---------------------------------------------------------------------------
  // 11. የሽያጭ ጭነት (ሙሉ ወይም ከፊል) እና ራስ-ሰር የዕቃ መውጫ ፈቃድ (Gate Pass)
  // ---------------------------------------------------------------------------
  function getSaleLinesByInv(invNo) {
    return (state.salesLedger || []).filter(
      (s) => s.invNo === invNo && s.status === 'valid' && (s.fulfillmentStatus === 'PENDING_LOAD' || s.fulfillmentStatus === 'PARTIAL')
    );
  }

  function queueSaleToTally(invNo) {
    const lines = getSaleLinesByInv(invNo);
    if (!lines.length) return;
    const first = lines[0];
    const existing = state.tally.tickets.find((tk) => tk.saleInvNo === invNo);
    if (existing) {
      state.tally.activeTicketId = existing.id;
    } else {
      const id = 'tk_sale_' + Date.now();
      state.tally.tickets.push({
        id,
        saleInvNo: invNo,
        dir: 'OUT',
        docNo: first.branchDoc || invNo,
        party: first.customer || '-',
        branch: first.branch,
        activeItemId: first.itemId,
        items: lines.map((s) => {
          const it = state.inventory.find((x) => x.id === s.itemId);
          const rem = Math.max(0, Number(s.orderedQty ?? s.qty) - Number(s.dispatchedQty ?? 0));
          return {
            itemId: s.itemId,
            saleId: s.id,
            name: s.itemName,
            unit: s.unit || getUnitLabel(it),
            loc: it?.zoneCode || 'A-01',
            target: rem,
            strokes: []
          };
        }).filter((x) => x.target > 0)
      });
      state.tally.activeTicketId = id;
    }
    saveState();
    switchMainTab('tally');
    switchSubTab('tickets');
    showToast(t('savedOk'));
  }

  function openLoadSaleModal(invNo) {
    const lines = getSaleLinesByInv(invNo);
    if (!lines.length) return;
    const head = lines[0];

    openModal(`${pt('loadConfirm')} · ${head.branchDoc || invNo}`, `
      <div class="sub-card">
        <b>${esc(head.customer)}</b>
        <div style="font-size:11px;color:var(--muted);">${esc(head.branch)} · ${esc(fmtDateDisplay(head.date))}</div>
      </div>
      <div class="sub-card">
        ${lines.map((s) => {
          const rem = Math.max(0, Number(s.orderedQty ?? s.qty) - Number(s.dispatchedQty ?? 0));
          return `
            <div style="display:grid;grid-template-columns:1fr 84px;gap:6px;align-items:center;">
              <div>
                <b style="font-size:12px;">${esc(s.itemName)}</b>
                <div style="font-size:10px;color:var(--amber);">${esc(pt('remainingLoad'))}: ${fmtNum(rem)} ${esc(s.unit)}</div>
              </div>
              <input type="number" min="0" max="${rem}" step="0.01" class="inp sm mono ld-qty-inp" data-sale-id="${s.id}" value="${rem}">
            </div>`;
        }).join('')}
      </div>
      <div class="grid-2">
        <input id="ldDriver" class="inp sm" placeholder="${esc(t('driver'))}">
        <input id="ldPlate" class="inp sm mono" placeholder="${esc(t('plate'))}">
      </div>
      ${state.cfg.modSupplierForm ? `
        <div class="sub-card">
          <div class="card-row">
            <span class="lbl" style="margin:0;">${esc(pt('signHere'))}</span>
            <button type="button" class="btn ghost sm" onclick="KoraPro.clearSig('ldSigPad')">${esc(pt('clearSign'))}</button>
          </div>
          <canvas id="ldSigPad" class="sig-pad"></canvas>
        </div>` : ''}`, `
      <button type="button" class="btn muted" onclick="closeModal();KoraPro.queueSaleToTally('${esc(invNo)}')">🧮 ${esc(pt('loadViaTally'))}</button>
      <button type="button" class="btn teal" onclick="KoraPro.confirmLoadSale('${esc(invNo)}')">✅ ${esc(pt('loadConfirm'))}</button>`);

    if (state.cfg.modSupplierForm) setTimeout(() => initSigPad('ldSigPad'), 60);
  }

  function confirmLoadSale(invNo) {
    const qtyMap = {};
    document.querySelectorAll('.ld-qty-inp').forEach((el) => {
      qtyMap[Number(el.dataset.saleId)] = Math.max(0, Number(el.value || 0));
    });
    const drv = (document.getElementById('ldDriver')?.value || '').trim();
    const plt = (document.getElementById('ldPlate')?.value || '').trim();
    const sig = state.cfg.modSupplierForm ? readSigData('ldSigPad') : '';
    const ok = fulfillSaleLines(invNo, qtyMap, drv, plt, sig);
    if (ok) closeModal();
  }

  function fulfillSaleLines(invNo, saleQtyMap, driver = '', plate = '', sigData = '') {
    const lines = getSaleLinesByInv(invNo);
    if (!lines.length) return false;
    const head = lines[0];
    const today = new Date().toISOString().slice(0, 10);
    const passItems = [];
    let anyLoaded = false;

    for (const s of lines) {
      const rem = Math.max(0, Number(s.orderedQty ?? s.qty) - Number(s.dispatchedQty ?? 0));
      const req = Math.min(rem, Math.max(0, Number(saleQtyMap[s.id] ?? saleQtyMap['item_' + s.itemId] ?? 0)));
      if (req <= 0) continue;
      const it = state.inventory.find((x) => x.id === s.itemId);
      if (!it || getItemStock(it, s.branch) < req) {
        showToast(t('errStock'), true);
        return false;
      }
    }

    lines.forEach((s, idx) => {
      const rem = Math.max(0, Number(s.orderedQty ?? s.qty) - Number(s.dispatchedQty ?? 0));
      const req = Math.min(rem, Math.max(0, Number(saleQtyMap[s.id] ?? saleQtyMap['item_' + s.itemId] ?? 0)));
      if (req <= 0) return;
      const it = state.inventory.find((x) => x.id === s.itemId);
      if (!it) return;

      anyLoaded = true;
      const openBal = getItemStock(it, s.branch);
      const endBal = Number((openBal - req).toFixed(2));
      it.branchStock[s.branch] = endBal;

      s.dispatchedQty = Number((Number(s.dispatchedQty || 0) + req).toFixed(2));
      s.fulfillmentStatus = s.dispatchedQty >= Number(s.orderedQty ?? s.qty) ? 'COMPLETED' : 'PARTIAL';

      state.warehouseLedger.push({
        id: Date.now() + idx,
        docNo: s.branchDoc || s.invNo,
        type: 'OUT',
        status: 'valid',
        branch: s.branch,
        itemId: it.id,
        itemName: it.name,
        unit: s.unit || getUnitLabel(it),
        loc: it.zoneCode || 'A-01',
        openBal,
        inQty: 0,
        outQty: req,
        endBal,
        party: s.customer,
        ref: [s.invNo, driver, plate].filter(Boolean).join(' · '),
        signature: sigData || '',
        date: today
      });

      passItems.push({ itemName: it.name, qty: req, unit: s.unit || getUnitLabel(it), zone: it.zoneCode || '-' });
    });

    if (!anyLoaded) return false;

    // የዕቃ መውጫ ፈቃድ (Gate Pass) በራሱ ይፈጠራል
    let passCode = '';
    if (state.cfg.modGatePass !== false) {
      passCode = String(1000 + Math.floor(Math.random() * 9000));
      state.gatePasses.unshift({
        id: 'gp_' + Date.now(),
        passNo: 'GP-' + String(100 + state.gatePasses.length + 1),
        passCode,
        docNo: head.branchDoc || invNo,
        branch: head.branch,
        party: head.customer,
        driver,
        plate,
        items: passItems,
        signature: sigData || '',
        status: 'ISSUED',
        issuedBy: curUser().name,
        verifiedBy: '',
        date: today
      });
    }

    dispatchNotifications('dispatch', {
      docNo: head.branchDoc || invNo,
      branchDoc: head.branchDoc || invNo,
      party: head.customer,
      branch: head.branch,
      items: passItems.map((x) => ({ name: x.itemName, qty: x.qty, unit: x.unit, loc: x.zone, total: null })),
      total: null,
      profit: null
    });

    saveState();
    vib([30, 20, 45]);
    playTone(720, 0.1, 'triangle');
    renderAll();
    showToast(passCode ? `${pt('gatePass')}: ${passCode}` : t('savedOk'));
    return true;
  }

  // ---------------------------------------------------------------------------
  // 12. የመጋዘን ገጽ (ንጹህ ክምችት + የተሻሻለ መመዝገቢያ ከአቅራቢ ፎርም፣ ፊርማና ዝውውር ጋር)
  // ---------------------------------------------------------------------------
  const _origRenderWarehouse = global.renderWarehouse;

  global.renderWarehouse = function (sub) {
    const root = document.getElementById('viewRoot');
    if (sub === 'stock') {
      // ድርብ ቢጫ ሳጥን ሳይኖር ንጹህ የክምችት ሠንጠረዥ (ርክክብ የሚጠብቁት ደወሉ 🔔 ላይ ይታያሉ)
      renderStockReportTable(root);
      return;
    }
    if (sub === 'entry') {
      renderProFastEntry(root);
      return;
    }
    _origRenderWarehouse(sub);
  };

  function renderProFastEntry(root) {
    const br = getEntryBranch();
    const q = (document.getElementById('globalSearch')?.value || '').trim().toLowerCase();
    const prevDoc = document.getElementById('entDocNo')?.value || getSuggestedEntryDocNo(br);
    const prevParty = document.getElementById('entParty')?.value || '';
    const prevRef = document.getElementById('entRef')?.value || '';
    const prevFiscal = document.getElementById('entFiscal')?.value || '';
    const prevPo = document.getElementById('entPo')?.value || '';
    const prevDrv = document.getElementById('entDriver')?.value || '';
    const prevPlt = document.getElementById('entPlate')?.value || '';
    const prevLic = document.getElementById('entLicense')?.value || '';
    const prevRec = document.getElementById('entReceiver')?.value || curUser().name;
    const prevKg = document.getElementById('entKg')?.value || '';
    const prevNote = document.getElementById('entNote')?.value || '';

    const otherBranches = state.branches.filter((b) => b.name !== br);
    if (!transferToBranch || transferToBranch === br) transferToBranch = otherBranches[0]?.name || br;

    const isTransfer = entryMode === 'TRANSFER';
    const isIn = entryMode === 'IN';
    const activeList = isTransfer ? transferBasket : entryBasket;
    const pickedMap = {};
    activeList.forEach((b) => { pickedMap[b.itemId] = (pickedMap[b.itemId] || 0) + Number(b.qty || 0); });

    const sortedItems = state.inventory.slice().sort((a, b) => {
      const ca = (a.category || '').localeCompare(b.category || '');
      return ca !== 0 ? ca : compareItemsSmart(a.name, b.name, a.category || '');
    }).filter((it) => !q || `${it.name} ${it.category} ${it.zoneCode}`.toLowerCase().includes(q));

    const basketTot = activeList.reduce((s, b) => s + Number(b.qty || 0), 0);

    // ቅጾቹ በንጹህ ባለ 2 አምድ (ያለ ባዶ ክፍተት) እንዲቀመጡ
    let formHtml = '';
    if (isTransfer) {
      formHtml = `
        <div class="grid-2">
          <div><label class="lbl">${esc(pt('fromBranch'))}</label><input class="inp sm" readonly value="${esc(br)}"></div>
          <div><label class="lbl">${esc(pt('toBranch'))}</label>
            <select id="entToBranch" class="sel" style="height:30px;" onchange="KoraPro.setTransferDest(this.value)">
              ${otherBranches.map((b) => `<option value="${esc(b.name)}" ${transferToBranch === b.name ? 'selected' : ''}>${esc(b.name)}</option>`).join('') || `<option value="${esc(br)}">${esc(br)}</option>`}
            </select>
          </div>
        </div>
        <div class="grid-2">
          <input id="entDriver" class="inp sm" value="${esc(prevDrv)}" placeholder="${esc(t('driver'))}">
          <input id="entPlate" class="inp sm mono" value="${esc(prevPlt)}" placeholder="${esc(t('plate'))}">
        </div>
        <input id="entNote" class="inp sm" value="${esc(prevNote)}" placeholder="${esc(t('notePh'))}">`;
    } else if (isIn) {
      formHtml = `
        <div class="grid-2">
          <input id="entDocNo" class="inp sm mono" value="${esc(prevDoc)}" placeholder="${esc(t('docNo'))}">
          <input id="entParty" class="inp sm" value="${esc(prevParty)}" placeholder="${esc(t('supplier'))}">
        </div>
        <div class="grid-2">
          <input id="entDriver" class="inp sm" value="${esc(prevDrv)}" placeholder="${esc(t('driver'))}">
          <input id="entPlate" class="inp sm mono" value="${esc(prevPlt)}" placeholder="${esc(t('plate'))}">
        </div>
        ${state.cfg.modSupplierForm ? `
          <div class="grid-2">
            <input id="entFiscal" class="inp sm mono" value="${esc(prevFiscal)}" placeholder="${esc(pt('fiscalNo'))}">
            <input id="entPo" class="inp sm mono" value="${esc(prevPo)}" placeholder="${esc(pt('poNo'))}">
          </div>
          <div class="grid-2">
            <input id="entLicense" class="inp sm mono" value="${esc(prevLic)}" placeholder="${esc(pt('licenseNo'))}">
            <input id="entReceiver" class="inp sm" value="${esc(prevRec)}" placeholder="${esc(pt('receiverName'))}">
          </div>
          <div class="card-row">
            <label class="btn muted sm">📷 ${esc(supplierAttachData ? pt('photoAttached') : pt('attachPhoto'))}<input type="file" accept="image/*" capture="environment" style="display:none;" onchange="KoraPro.onSupplierPhoto(this)"></label>
            ${supplierAttachData ? `<button type="button" class="btn ghost sm" onclick="KoraPro.clearSupplierPhoto()">✕</button>` : ''}
          </div>` : ''}
        ${state.cfg.showKgField || state.cfg.showNoteField ? `
          <div class="grid-2">
            ${state.cfg.showKgField ? `<input id="entKg" type="number" class="inp sm mono" value="${esc(prevKg)}" placeholder="${esc(t('weightKg'))}">` : ''}
            ${state.cfg.showNoteField ? `<input id="entNote" class="inp sm" value="${esc(prevNote)}" placeholder="${esc(t('notePh'))}">` : ''}
          </div>` : ''}`;
    } else {
      // የወጪ ቅጽ (ያለ ባዶ ክፍተት የተመጣጠነ)
      const optInputs = [];
      if (state.cfg.showPadField) optInputs.push(`<input id="entRef" class="inp sm" value="${esc(prevRef)}" placeholder="${esc(t('padNo'))}">`);
      if (state.cfg.showDriverField) {
        optInputs.push(`<input id="entDriver" class="inp sm" value="${esc(prevDrv)}" placeholder="${esc(t('driver'))}">`);
        optInputs.push(`<input id="entPlate" class="inp sm mono" value="${esc(prevPlt)}" placeholder="${esc(t('plate'))}">`);
      }
      if (state.cfg.showKgField) optInputs.push(`<input id="entKg" type="number" class="inp sm mono" value="${esc(prevKg)}" placeholder="${esc(t('weightKg'))}">`);
      if (state.cfg.showNoteField) optInputs.push(`<input id="entNote" class="inp sm" value="${esc(prevNote)}" placeholder="${esc(t('notePh'))}">`);

      formHtml = `
        <div class="grid-2">
          <div style="display:flex;gap:3px;">
            <input id="entDocNo" class="inp sm mono" value="${esc(prevDoc)}" placeholder="${esc(t('docNo'))}">
            <button type="button" class="btn danger sm" style="padding:0 7px;" onclick="promptDirectEntryVoid()">${esc(t('voidWord'))}</button>
          </div>
          <input id="entParty" class="inp sm" value="${esc(prevParty)}" placeholder="${esc(t('customer'))}">
        </div>
        ${optInputs.length ? `<div class="grid-2">${optInputs.join('')}</div>` : ''}`;
    }

    root.innerHTML = `
      <div class="seg">
        <button type="button" class="seg-btn ${entryMode === 'OUT' ? 'out' : ''}" onclick="entryMode='OUT';vib(14);renderView();">${esc(t('modeOut'))}</button>
        <button type="button" class="seg-btn ${entryMode === 'IN' ? 'in' : ''}" onclick="entryMode='IN';vib(14);renderView();">${esc(t('modeIn'))}</button>
        ${state.cfg.modTransfer && state.branches.length > 1 ? `<button type="button" class="seg-btn ${isTransfer ? 'teal' : ''}" onclick="entryMode='TRANSFER';vib(14);renderView();">${esc(pt('transfer'))}</button>` : ''}
      </div>

      <div class="card">${formHtml}</div>

      <div id="entryTilesBox" class="tile-grid">
        ${sortedItems.map((it) => {
          const bal = getItemStock(it, br);
          const resQ = getReservedQty(it.id, br);
          return `
            <div class="tile ${pickedMap[it.id] ? 'picked' : ''}" onclick="KoraPro.openQuickQtyAdd(${it.id})">
              <div class="card-row" style="flex-wrap:nowrap;">
                <b style="font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(it.name)}</b>
                <span style="font-family:ui-monospace,monospace;font-size:11.5px;font-weight:900;color:${bal === 0 ? 'var(--amber)' : 'var(--emerald)'};">${fmtNum(bal)}</span>
              </div>
              <div class="card-row" style="font-size:10px;color:var(--muted);">
                <span>📍 ${esc(it.zoneCode || '-')} · ${esc(getUnitLabel(it))}${resQ > 0 ? ` · 🔒${fmtNum(resQ)}` : ''}</span>
                <button type="button" class="btn ghost sm" style="height:22px;padding:0 6px;font-size:10px;color:var(--teal);border-color:var(--teal);" onclick="event.stopPropagation();jumpItemToTally(${it.id})">🧮</button>
              </div>
            </div>`;
        }).join('') || `<div class="card" style="grid-column:1/-1;text-align:center;color:var(--muted);">${esc(t('noData'))}</div>`}
      </div>

      ${activeList.length ? `
        <div class="card" style="border-color:rgba(20,184,166,0.5);">
          <div class="card-row">
            <b style="color:var(--teal);">${activeList.length} · ${fmtNum(basketTot)}</b>
            <div style="display:flex;gap:5px;">
              ${!isTransfer ? `<button type="button" class="btn muted sm" onclick="sendEntryBasketToTally()">🧮 ${esc(t('sendToTally'))}</button>` : ''}
              <button type="button" class="btn ${isTransfer ? 'teal' : (isIn ? 'emerald' : 'danger')} sm" onclick="KoraPro.submitProEntry(this)">
                ${esc(isTransfer ? pt('sendTransfer') : (isIn ? t('submitIn') : t('submitOut')))}
              </button>
            </div>
          </div>
          <div id="entryBasketList" style="display:flex;flex-direction:column;gap:5px;">
            ${activeList.map((b, i) => `
              <div class="basket-row" style="flex-direction:column;align-items:stretch;gap:4px;">
                <div style="display:flex;align-items:center;gap:6px;">
                  <span class="drag-handle" ${!isTransfer ? 'onpointerdown="startEntryBasketDrag(this.parentElement.parentElement, event)"' : ''}>${i + 1}</span>
                  <span style="flex:1;min-width:0;font-size:12px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(b.name)}</span>
                  <input type="number" min="1" class="inp sm mono" style="width:66px;text-align:center;" value="${b.qty}" oninput="KoraPro.setBasketQty(${i},this.value)">
                  <button type="button" class="icon-btn sm" style="color:var(--rose);" onclick="KoraPro.removeBasketIdx(${i})">✕</button>
                </div>
                ${isIn ? `<input class="inp sm" style="height:27px;font-size:11px;" value="${esc(b.remark || '')}" placeholder="${esc(pt('lineRemark'))}" oninput="KoraPro.setBasketRemark(${i},this.value)">` : ''}
              </div>`).join('')}
          </div>
        </div>` : ''}`;
  }

  // በአንድ ንኪኪ ብዛትና ማስታወሻ መጨመሪያ (በአቅራቢ ገቢ ላይ ተመሳሳይ ዕቃን በተለያየ መስመር መጨመር ያስችላል)
  function openQuickQtyAdd(itemId) {
    const it = state.inventory.find((x) => x.id === itemId);
    if (!it) return;
    const isIn = entryMode === 'IN';
    vib(14);
    openModal(it.name, `
      <div class="sub-card">
        <div class="card-row">
          <span style="color:var(--muted);">${esc(formatLoc(it))}</span>
          <span class="pill teal">${fmtNum(getItemStock(it, getEntryBranch()))} ${esc(getUnitLabel(it))}</span>
        </div>
        <input id="qkAddQty" type="number" min="1" inputmode="numeric" class="inp mono" style="height:44px;font-size:19px;text-align:center;" placeholder="${esc(t('qty'))}" onkeydown="if(event.key==='Enter') KoraPro.confirmQuickQtyAdd(${itemId})">
        ${isIn ? `<input id="qkAddRem" class="inp sm" placeholder="${esc(pt('lineRemark'))}">` : ''}
      </div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${esc(t('cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraPro.confirmQuickQtyAdd(${itemId})">${esc(t('add'))}</button>`);
    setTimeout(() => document.getElementById('qkAddQty')?.focus(), 40);
  }

  function confirmQuickQtyAdd(itemId) {
    const qty = Math.floor(Number(document.getElementById('qkAddQty')?.value || 0));
    const remark = (document.getElementById('qkAddRem')?.value || '').trim();
    const it = state.inventory.find((x) => x.id === itemId);
    if (!it || qty <= 0) return;

    if (entryMode === 'TRANSFER') {
      const ex = transferBasket.find((x) => x.itemId === itemId);
      if (ex) ex.qty += qty;
      else transferBasket.push({ itemId: it.id, name: it.name, unit: getUnitLabel(it), qty });
    } else if (entryMode === 'IN' && remark) {
      // ማስታወሻ ካለው እንደ ራሱ መስመር ይገባል (ለምሳሌ ለአብዱ / ለሌላ ደንበኛ የተለየ መስመር)
      entryBasket.push({ itemId: it.id, name: it.name, unit: getUnitLabel(it), loc: it.zoneCode || 'A-01', qty, remark });
    } else {
      const ex = entryBasket.find((x) => x.itemId === itemId && !x.remark);
      if (ex) ex.qty += qty;
      else entryBasket.push({ itemId: it.id, name: it.name, unit: getUnitLabel(it), loc: it.zoneCode || 'A-01', qty, remark: '' });
    }

    vib(18);
    closeModal();
    renderView();
  }

  function submitProEntry(btn) {
    if (entryMode === 'TRANSFER') {
      submitBranchTransfer(btn);
      return;
    }
    if (entryMode === 'IN' && state.cfg.modSupplierForm) {
      // ከመመዝገቡ በፊት የተረካቢ/ሹፌር ፊርማ ማረጋገጫ ሞዳል
      openModal(`${pt('supplierForm')} · ${pt('signHere')}`, `
        <div class="sub-card">
          <div class="card-row">
            <span class="lbl" style="margin:0;">${esc(pt('signHere'))}</span>
            <button type="button" class="btn ghost sm" onclick="KoraPro.clearSig('inSigPad')">${esc(pt('clearSign'))}</button>
          </div>
          <canvas id="inSigPad" class="sig-pad"></canvas>
        </div>`, `
        <button type="button" class="btn muted" onclick="closeModal()">${esc(t('cancel'))}</button>
        <button type="button" class="btn emerald" onclick="KoraPro.finalizeSupplierDelivery()">${esc(t('submitIn'))}</button>`);
      setTimeout(() => initSigPad('inSigPad'), 60);
      return;
    }
    commitEntryBasket(btn);
  }

  function finalizeSupplierDelivery() {
    if (!entryBasket.length) return;
    const br = getEntryBranch();
    const docNo = (document.getElementById('entDocNo')?.value || '').trim() || nextBranchDoc(br);
    const supplier = (document.getElementById('entParty')?.value || '').trim() || '-';
    const fiscalNo = (document.getElementById('entFiscal')?.value || '').trim();
    const poNo = (document.getElementById('entPo')?.value || '').trim();
    const driver = (document.getElementById('entDriver')?.value || '').trim();
    const plate = (document.getElementById('entPlate')?.value || '').trim();
    const licenseNo = (document.getElementById('entLicense')?.value || '').trim();
    const receiver = (document.getElementById('entReceiver')?.value || curUser().name).trim();
    const sig = readSigData('inSigPad');
    const today = new Date().toISOString().slice(0, 10);
    const bObj = state.branches.find((b) => b.name === br);
    if (bObj) bObj.seq = Math.max(Number(bObj.seq || 0), docNumInt(docNo));

    const linesCopy = [];
    entryBasket.forEach((l, idx) => {
      const it = state.inventory.find((x) => x.id === l.itemId);
      if (!it) return;
      const openBal = getItemStock(it, br);
      const endBal = openBal + Number(l.qty || 0);
      it.branchStock[br] = endBal;
      state.warehouseLedger.push({
        id: Date.now() + idx,
        docNo, type: 'IN', status: 'valid', branch: br,
        itemId: it.id, itemName: it.name, unit: getUnitLabel(it), loc: it.zoneCode || 'A-01',
        openBal, inQty: l.qty, outQty: 0, endBal,
        party: supplier,
        ref: [driver, plate, l.remark].filter(Boolean).join(' · ') || '-',
        fiscalNo, poNo, licenseNo, receiver,
        attachment: supplierAttachData,
        signature: sig,
        date: today
      });
      linesCopy.push({ itemId: it.id, name: it.name, qty: l.qty, unit: getUnitLabel(it), remark: l.remark || '', unitCost: it.landedCost || 0, sellPrice: it.sellPrice || 0 });
    });

    // ለሂሳብ ክፍል ዋጋና ዱቤ ማጽደቂያ በደወሉ 🔔 ይላካል
    state.pendingFinanceDeliveries.unshift({
      id: 'fin_' + Date.now(),
      docNo, supplier, branch: br, fiscalNo, poNo, driver, plate, licenseNo, receiver,
      attachment: supplierAttachData,
      signature: sig,
      items: linesCopy,
      status: 'PENDING_FINANCE',
      date: today
    });

    dispatchNotifications('receive', {
      docNo, branchDoc: docNo, party: supplier, branch: br,
      items: linesCopy.map((x) => ({ name: x.name, qty: x.qty, unit: x.unit, loc: x.remark || '-', total: null })),
      total: null, profit: null
    });

    entryBasket = [];
    supplierAttachData = '';
    saveState();
    closeModal();
    vib([30, 20, 45]);
    renderAll();
    showToast(t('savedOk'));
  }

  // የሂሳብ ሹም የአቅራቢ ገቢ ዋጋ፣ የጫኝ ወጪ እና ዱቤ ማጽደቂያ ሞዳል
  function openApproveFinDeliveryModal(finId) {
    const d = (state.pendingFinanceDeliveries || []).find((x) => x.id === finId);
    if (!d) return;
    const payOpts = [t('creditMethod'), ...state.banks.map((b) => b.name)];

    openModal(`${pt('approveFin')} · ${d.docNo}`, `
      <div class="sub-card">
        <b>${esc(d.supplier)} · ${esc(d.branch)}</b>
        <div style="font-size:10.5px;color:var(--muted);">
          ${d.fiscalNo ? `${esc(pt('fiscalNo'))}: ${esc(d.fiscalNo)} · ` : ''}
          ${d.driver ? `${esc(d.driver)} (${esc(d.plate)})` : ''}
        </div>
        ${d.attachment ? `<img src="${d.attachment}" style="width:100%;max-height:190px;object-fit:contain;border-radius:9px;background:#000;border:1px solid var(--border-strong);">` : ''}
      </div>
      <div class="sub-card">
        ${d.items.map((x, i) => `
          <div style="display:flex;flex-direction:column;gap:4px;padding-bottom:6px;border-bottom:1px solid var(--border);">
            <b>${esc(x.name)} · ${fmtNum(x.qty)} ${esc(x.unit)} ${x.remark ? `<small style="color:var(--amber);">(${esc(x.remark)})</small>` : ''}</b>
            <div class="grid-2">
              <div><label class="lbl">${esc(t('costPrice'))}</label><input type="number" step="0.01" class="inp sm mono af-cost" data-idx="${i}" value="${x.unitCost || 0}"></div>
              <div><label class="lbl">${esc(t('unitPrice'))}</label><input type="number" step="0.01" class="inp sm mono af-sell" data-idx="${i}" value="${x.sellPrice || 0}"></div>
            </div>
          </div>`).join('')}
      </div>
      <div class="grid-2">
        <div><label class="lbl">${esc(t('transportCost'))}</label><input id="afFreight" type="number" min="0" class="inp sm mono" value="0"></div>
        <div><label class="lbl">${esc(t('laborCost'))}</label><input id="afLabor" type="number" min="0" class="inp sm mono" value="0"></div>
      </div>
      <div class="grid-2">
        <div><label class="lbl">${esc(t('payment'))}</label><select id="afPayMethod" class="sel">${payOpts.map((p) => `<option value="${esc(p)}">${esc(p)}</option>`).join('')}</select></div>
        <div><label class="lbl">${esc(t('dueDate'))}</label><input id="afDue" type="date" class="inp" value="${new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10)}"></div>
      </div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${esc(t('cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraPro.confirmApproveFin('${esc(finId)}')">${esc(t('confirm'))}</button>`);
  }

  function confirmApproveFin(finId) {
    const d = (state.pendingFinanceDeliveries || []).find((x) => x.id === finId);
    if (!d) return;
    const freight = Math.max(0, Number(document.getElementById('afFreight')?.value || 0));
    const labor = Math.max(0, Number(document.getElementById('afLabor')?.value || 0));
    const payMethod = document.getElementById('afPayMethod')?.value || t('creditMethod');
    const dueDate = document.getElementById('afDue')?.value || '';

    const costs = Array.from(document.querySelectorAll('.af-cost')).map((el) => Math.max(0, Number(el.value || 0)));
    const sells = Array.from(document.querySelectorAll('.af-sell')).map((el) => Math.max(0, Number(el.value || 0)));
    const qtySum = d.items.reduce((a, x) => a + Number(x.qty || 0), 0) || 1;
    const extraPer = (freight + labor) / qtySum;

    let grand = 0;
    d.items.forEach((x, i) => {
      const landed = Math.round((costs[i] || 0) + extraPer);
      const lineTot = Math.round(x.qty * landed);
      grand += lineTot;
      const it = state.inventory.find((z) => z.id === x.itemId);
      if (it) {
        if (landed > 0) it.landedCost = landed;
        if (sells[i] > 0) it.sellPrice = sells[i];
      }
      state.purchasesLedger.push({
        id: Date.now() + i, purNo: d.docNo, branchDoc: d.docNo, supplier: d.supplier,
        itemId: x.itemId, itemName: x.name, qty: x.qty, unit: x.unit,
        unitCost: costs[i] || 0, freight: i === 0 ? freight : 0, labor: i === 0 ? labor : 0,
        landedUnit: landed, sellPrice: sells[i] || 0, total: lineTot,
        payments: i === 0 ? [{ method: payMethod, amount: grand }] : [],
        branch: d.branch, status: 'received', date: d.date
      });
    });

    if (payMethod === t('creditMethod') && grand > 0) {
      state.creditLedger.push({
        id: Date.now() + 200, docNo: d.docNo, party: d.supplier, type: 'payable',
        items: d.items.map((x) => x.name).join(' · '), total: grand, paid: 0,
        dueDate, status: 'open', approvedAmt: 0, approvedBank: '', ftRef: ''
      });
    }

    d.status = 'COMPLETED';
    saveState();
    closeModal();
    renderAll();
    showToast(t('savedOk'));
  }

  // ---------------------------------------------------------------------------
  // 13. ባለሁለት-ደረጃ የቅርንጫፍ ዝውውር (መላክና መረከብ)
  // ---------------------------------------------------------------------------
  function submitBranchTransfer(btn) {
    if (!transferBasket.length) return;
    const fromBr = getEntryBranch();
    const toBr = document.getElementById('entToBranch')?.value || transferToBranch;
    if (!toBr || toBr === fromBr) { showToast(t('errGeneric'), true); return; }

    for (const l of transferBasket) {
      const it = state.inventory.find((x) => x.id === l.itemId);
      if (!it || getAvailableStock(it, fromBr) < l.qty) { showToast(t('errStock'), true); return; }
    }

    withBusy(btn, async () => {
      const today = new Date().toISOString().slice(0, 10);
      const trNo = 'TRF-' + String(100 + state.transfers.length + 1);
      const driver = (document.getElementById('entDriver')?.value || '').trim();
      const plate = (document.getElementById('entPlate')?.value || '').trim();
      const note = (document.getElementById('entNote')?.value || '').trim();

      const itemsSnap = transferBasket.map((l, idx) => {
        const it = state.inventory.find((x) => x.id === l.itemId);
        const openBal = getItemStock(it, fromBr);
        const endBal = openBal - l.qty;
        it.branchStock[fromBr] = endBal;
        state.warehouseLedger.push({
          id: Date.now() + idx, docNo: trNo, type: 'OUT', status: 'valid', branch: fromBr,
          itemId: it.id, itemName: it.name, unit: l.unit, loc: it.zoneCode || '-',
          openBal, inQty: 0, outQty: l.qty, endBal, party: toBr,
          ref: [driver, plate, note].filter(Boolean).join(' · ') || pt('transfer'), date: today
        });
        return { itemId: it.id, name: it.name, unit: l.unit, sentQty: l.qty, receivedQty: 0 };
      });

      state.transfers.unshift({
        id: 'tr_' + Date.now(), transferNo: trNo, fromBranch: fromBr, toBranch: toBr,
        driver, plate, note, items: itemsSnap, status: 'IN_TRANSIT',
        sentBy: curUser().name, receivedBy: '', date: today
      });

      transferBasket = [];
      saveState();
      renderAll();
      showToast(t('savedOk'));
    });
  }

  function openReceiveTransferModal(trId) {
    const tr = (state.transfers || []).find((x) => x.id === trId);
    if (!tr || tr.status !== 'IN_TRANSIT') return;
    openModal(`${pt('receiveTransfer')} · ${tr.transferNo}`, `
      <div class="sub-card">
        <b>${esc(tr.fromBranch)} ➔ ${esc(tr.toBranch)}</b>
        <div style="font-size:11px;color:var(--muted);">${esc(tr.driver || '-')} ${tr.plate ? `(${esc(tr.plate)})` : ''} · ${esc(fmtDateDisplay(tr.date))}</div>
      </div>
      <div class="sub-card">
        ${tr.items.map((x, i) => `
          <div style="display:grid;grid-template-columns:1fr 84px;gap:6px;align-items:center;">
            <div>
              <b>${esc(x.name)}</b>
              <div style="font-size:10px;color:var(--amber);">${esc(pt('fromBranch'))}: ${fmtNum(x.sentQty)} ${esc(x.unit)}</div>
            </div>
            <input type="number" min="0" class="inp sm mono tr-rec-inp" data-idx="${i}" value="${x.sentQty}">
          </div>`).join('')}
      </div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${esc(t('cancel'))}</button>
      <button type="button" class="btn primary" onclick="KoraPro.confirmReceiveTransfer('${esc(trId)}')">${esc(t('receiveNow'))}</button>`);
  }

  function confirmReceiveTransfer(trId) {
    const tr = (state.transfers || []).find((x) => x.id === trId);
    if (!tr || tr.status !== 'IN_TRANSIT') return;
    const inputs = Array.from(document.querySelectorAll('.tr-rec-inp')).map((el) => Math.max(0, Number(el.value || 0)));
    const today = new Date().toISOString().slice(0, 10);
    let hasDiff = false;

    tr.items.forEach((x, idx) => {
      const rec = inputs[idx] ?? x.sentQty;
      x.receivedQty = rec;
      if (rec !== x.sentQty) hasDiff = true;
      const it = state.inventory.find((z) => z.id === x.itemId);
      if (it && rec > 0) {
        const openBal = getItemStock(it, tr.toBranch);
        const endBal = openBal + rec;
        it.branchStock[tr.toBranch] = endBal;
        state.warehouseLedger.push({
          id: Date.now() + idx, docNo: tr.transferNo, type: 'IN', status: 'valid', branch: tr.toBranch,
          itemId: it.id, itemName: it.name, unit: x.unit, loc: it.zoneCode || '-',
          openBal, inQty: rec, outQty: 0, endBal, party: tr.fromBranch,
          ref: rec !== x.sentQty ? `${pt('discrepancy')} (${rec}/${x.sentQty})` : pt('transfer'), date: today
        });
      }
    });

    tr.status = 'RECEIVED';
    tr.receivedBy = curUser().name;
    saveState();
    closeModal();
    renderAll();
    showToast(hasDiff ? pt('discrepancy') : t('savedOk'), hasDiff);
  }

  // ---------------------------------------------------------------------------
  // 14. ቋሚ የቆጠራ ቁልፍ (Sticky Dock) + የዕቃ ታብ ቀጥታ ዝመና + የሽያጭ ቲኬት ማጠናቀቂያ
  // ---------------------------------------------------------------------------
  const _origRenderTally = global.renderTally;
  const _origUpdateTallyStageUi = global.updateTallyStageUi;
  const _origCommitActiveTally = global.commitActiveTally;

  global.renderTally = function (sub) {
    _origRenderTally(sub);
    // ዋናውን የመቁጠሪያ ቁልፍና የታችኛውን 4 እርምጃዎች ቋሚ (Sticky) ሳጥን ውስጥ ማስገባት
    const trig = document.getElementById('tallyTriggerArea');
    if (trig && trig.parentElement && !trig.parentElement.classList.contains('tally-sticky-dock')) {
      const actRow = trig.nextElementSibling;
      const dock = document.createElement('div');
      dock.className = 'tally-sticky-dock';
      trig.parentElement.insertBefore(dock, trig);
      dock.appendChild(trig);
      if (actRow) dock.appendChild(actRow);
    }
  };

  global.updateTallyStageUi = function () {
    _origUpdateTallyStageUi();
    // በቲኬት ገጽ ላይ የዕቃውን ታብ ቁጥር (ለምሳሌ 15/20 -> 20/20) በቀጥታ ማደስ
    if (state.activeMainTab === 'tally' && (state.activeSubTab.tally || 'tickets') === 'tickets') {
      const tk = getActiveTicket();
      const root = document.getElementById('viewRoot');
      if (!tk || !root) return;
      const strip = root.querySelector('.card .no-scrollbar');
      if (strip) {
        strip.innerHTML = tk.items.map((x) => {
          const cnt = sumStrokes(x.strokes);
          const done = x.target > 0 && cnt >= x.target;
          return `<button type="button" class="btn sm ${x.itemId === tk.activeItemId ? 'teal' : (done ? 'emerald' : 'muted')}" onclick="getActiveTicket().activeItemId=${x.itemId};saveState();renderView();">${done ? '✓ ' : ''}${esc(x.name)} (${x.target > 0 ? `${cnt}/${x.target}` : cnt})</button>`;
        }).join('') + `<button type="button" class="btn ghost sm" style="border-style:dashed;color:var(--amber);border-color:var(--amber);" onclick="openAddTicketItemModal()">+ ${esc(t('addTicketItem'))}</button>`;
      }
    }
  };

  global.commitActiveTally = function (btn) {
    const sub = state.activeSubTab.tally || 'tickets';
    if (sub === 'tickets') {
      const tk = getActiveTicket();
      if (tk && tk.saleInvNo) {
        const qtyMap = {};
        let hasAny = false;
        tk.items.forEach((x) => {
          const q = sumStrokes(x.strokes);
          if (q > 0) {
            hasAny = true;
            if (x.saleId) qtyMap[x.saleId] = q;
            qtyMap['item_' + x.itemId] = q;
          }
        });
        if (!hasAny) return;
        withBusy(btn, async () => {
          const ok = fulfillSaleLines(tk.saleInvNo, qtyMap);
          if (ok) {
            state.tally.tickets = state.tally.tickets.filter((x) => x.id !== tk.id);
            ensureTallyTicket();
            saveState();
            renderAll();
          }
        });
        return;
      }
    }
    _origCommitActiveTally(btn);
  };

  // ---------------------------------------------------------------------------
  // 15. የዕቃ መውጫ ፈቃድ (Gate Pass) እና ሳይደራረብ የተስተካከለ ቀጥታ ካርታ
  // ---------------------------------------------------------------------------
  const _origRenderDispatch = global.renderDispatch;

  global.renderDispatch = function (sub) {
    const root = document.getElementById('viewRoot');

    if (sub === 'gatepass') {
      const q = (document.getElementById('globalSearch')?.value || '').trim().toLowerCase();
      const br = state.branchScope;
      const list = (state.gatePasses || []).filter((g) => {
        if (br !== 'all' && g.branch !== br) return false;
        if (q && !`${g.passNo} ${g.docNo} ${g.party} ${g.driver} ${g.plate}`.toLowerCase().includes(q)) return false;
        return true;
      });
      root.innerHTML = `
        <div class="cards-grid">
          ${list.map((g) => {
            const exited = g.status === 'EXITED';
            return `
              <div class="card" style="${exited ? 'opacity:0.65;' : 'border-color:rgba(20,184,166,0.5);'}">
                <div class="card-row">
                  <b style="font-family:ui-monospace,monospace;color:var(--teal);">${esc(g.passNo)} · ${esc(g.docNo)}</b>
                  <span class="pill ${exited ? 'emerald' : 'amber'}">${esc(exited ? pt('gateExited') : pt('gateIssued'))}</span>
                </div>
                <b>${esc(g.party)} · ${esc(g.branch)}</b>
                <div style="font-size:11px;color:var(--muted);">${(g.items || []).map((x) => `${esc(x.itemName)} (${fmtNum(x.qty)} ${esc(x.unit)})`).join('፣ ')}</div>
                <div class="card-row" style="font-size:10.5px;color:var(--muted);">
                  <span>🚚 ${esc(g.driver || '-')} ${g.plate ? `(${esc(g.plate)})` : ''}</span>
                  <span>${esc(fmtDateDisplay(g.date))}</span>
                </div>
                ${!exited && (isOwner() || hasPerm('sellPrice')) ? `<div class="pill amber">${esc(pt('gateCode'))}: <b>${esc(g.passCode)}</b></div>` : ''}
                ${!exited ? `<button type="button" class="btn teal sm" onclick="KoraPro.openVerifyGatePass('${esc(g.id)}')">${esc(pt('verifyExit'))}</button>` : ''}
              </div>`;
          }).join('') || `<div class="card" style="text-align:center;color:var(--muted);">${esc(t('noData'))}</div>`}
        </div>`;
      return;
    }

    if (sub === 'map') {
      // የካርታ ነጥቦች እንዳይደራረቡ ርቀታቸውን በራሱ የሚያስተካክል ስሌት
      const pts = [
        ...state.branches.map((b, i) => ({ kind: 'branch', name: b.name, online: true, x: Number(b.mapX || (22 + i * 26)), y: Number(b.mapY || (26 + (i % 2) * 38)) })),
        ...state.fleet.map((f, i) => ({ kind: 'fleet', name: f.driver, online: f.online, x: Number(f.mapX || (32 + i * 32)), y: Number(f.mapY || (66 - (i % 2) * 28)) }))
      ];
      for (let pass = 0; pass < 14; pass++) {
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[j].x - pts[i].x;
            const dy = pts[j].y - pts[i].y;
            const dist = Math.hypot(dx, dy) || 0.1;
            const minD = 20;
            if (dist < minD) {
              const push = (minD - dist) / 2;
              const nx = (dx / dist) * push;
              const ny = (dy / dist) * push;
              pts[i].x = Math.max(12, Math.min(88, pts[i].x - nx));
              pts[i].y = Math.max(14, Math.min(84, pts[i].y - ny));
              pts[j].x = Math.max(12, Math.min(88, pts[j].x + nx));
              pts[j].y = Math.max(14, Math.min(84, pts[j].y + ny));
            }
          }
        }
      }
      root.innerHTML = `
        <div class="card" style="padding:12px;">
          <div style="position:relative;width:100%;height:350px;border-radius:14px;background:radial-gradient(circle at 50% 45%,#0c2038,#060a12);border:1px solid var(--border-strong);overflow:hidden;">
            ${pts.map((p) => p.kind === 'branch' ? `
              <div style="position:absolute;left:${p.x.toFixed(1)}%;top:${p.y.toFixed(1)}%;transform:translate(-50%,-50%);text-align:center;z-index:2;">
                <div style="width:32px;height:32px;margin:0 auto 2px;border-radius:10px;background:rgba(20,184,166,0.22);border:2px solid var(--teal);display:flex;align-items:center;justify-content:center;font-size:15px;">🏢</div>
                <span style="font-size:10px;font-weight:900;background:rgba(6,10,18,0.92);border:1px solid var(--border-strong);padding:2px 6px;border-radius:6px;white-space:nowrap;">${esc(p.name)}</span>
              </div>` : `
              <div style="position:absolute;left:${p.x.toFixed(1)}%;top:${p.y.toFixed(1)}%;transform:translate(-50%,-50%);text-align:center;z-index:3;">
                <div style="width:30px;height:30px;margin:0 auto 2px;border-radius:50%;background:${p.online ? 'rgba(16,185,129,0.28)' : 'rgba(148,163,184,0.2)'};border:2px solid ${p.online ? 'var(--emerald)' : 'var(--muted)'};display:flex;align-items:center;justify-content:center;font-size:14px;">🚚</div>
                <span style="font-size:9.5px;font-weight:900;color:#6ee7b7;background:rgba(6,10,18,0.92);border:1px solid rgba(16,185,129,0.45);padding:1px 6px;border-radius:6px;white-space:nowrap;">${esc(p.name)}</span>
              </div>`).join('')}
          </div>
        </div>`;
      return;
    }

    _origRenderDispatch(sub);
  };

  function openVerifyGatePass(gpId) {
    const g = (state.gatePasses || []).find((x) => x.id === gpId);
    if (!g) return;
    openModal(`${pt('verifyExit')} · ${g.passNo}`, `
      <div class="sub-card">
        <b>${esc(g.party)}</b>
        <div style="font-size:11px;color:var(--muted);">${(g.items || []).map((x) => `${esc(x.itemName)} (${fmtNum(x.qty)})`).join('፣ ')}</div>
      </div>
      <input id="inpGpCode" type="number" inputmode="numeric" maxlength="4" class="inp gate-pin" placeholder="••••">`, `
      <button type="button" class="btn muted" onclick="closeModal()">${esc(t('cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraPro.confirmVerifyGatePass('${esc(gpId)}')">${esc(t('confirm'))}</button>`);
    setTimeout(() => document.getElementById('inpGpCode')?.focus(), 40);
  }

  function confirmVerifyGatePass(gpId) {
    const g = (state.gatePasses || []).find((x) => x.id === gpId);
    const code = (document.getElementById('inpGpCode')?.value || '').trim();
    if (!g || code !== g.passCode) { showToast(t('errPin'), true); vib([50, 30, 50]); return; }
    g.status = 'EXITED';
    g.verifiedBy = curUser().name;
    saveState(); closeModal(); renderAll(); showToast(t('savedOk'));
  }

  // ---------------------------------------------------------------------------
  // 16. የገንዘብ ያዥ ፈረቃ እና የቀን መዝጊያ (Cashier Shifts)
  // ---------------------------------------------------------------------------
  function renderShiftsView(root) {
    const me = curUser();
    const openSh = (state.shifts || []).find((s) => s.status === 'OPEN' && s.userId === me.id);
    const today = new Date().toISOString().slice(0, 10);
    const cashBankName = state.banks[0]?.name || '';

    let activeBlock = '';
    if (openSh) {
      const salesCash = (state.salesLedger || [])
        .filter((s) => s.status === 'valid' && s.date >= openSh.date)
        .reduce((sum, s) => sum + (s.payments || []).filter((p) => p.method === cashBankName).reduce((a, b) => a + Number(b.amount || 0), 0), 0);
      const expCash = (state.expensesLedger || [])
        .filter((e) => e.date >= openSh.date && e.bank === cashBankName)
        .reduce((a, e) => a + Number(e.amount || 0), 0);
      const expected = Number(openSh.openingCash || 0) + salesCash - expCash;

      activeBlock = `
        <div class="card" style="border-color:var(--teal);">
          <div class="card-row">
            <b style="color:var(--teal);">${esc(pt('shiftOpen'))} · ${esc(openSh.userName)}</b>
            <span class="pill emerald">${esc(fmtDateDisplay(openSh.date))}</span>
          </div>
          <div class="kpi-grid">
            <div class="kpi"><span class="kpi-lbl">${esc(pt('openingCash'))}</span><span class="kpi-val">${fmtMoney(openSh.openingCash)}</span></div>
            <div class="kpi emerald"><span class="kpi-lbl">${esc(pt('expectedCash'))}</span><span class="kpi-val">${fmtMoney(expected)}</span></div>
          </div>
          <button type="button" class="btn danger" onclick="KoraPro.openCloseShiftModal('${esc(openSh.id)}',${expected})">${esc(pt('closeShift'))}</button>
        </div>`;
    } else {
      activeBlock = `
        <div class="card">
          <div class="card-row">
            <b>${esc(pt('shiftTab'))}</b>
            <button type="button" class="btn teal sm" onclick="KoraPro.openStartShiftModal()">+ ${esc(pt('openShift'))}</button>
          </div>
        </div>`;
    }

    const closedList = (state.shifts || []).filter((s) => s.status === 'CLOSED');
    root.innerHTML = `
      ${activeBlock}
      <div class="cards-grid">
        ${closedList.map((s) => `
          <div class="card">
            <div class="card-row">
              <b>${esc(s.userName)} · ${esc(fmtDateDisplay(s.date))}</b>
              <span class="pill ${s.variance === 0 ? 'emerald' : (s.variance > 0 ? 'teal' : 'rose')}">${s.variance >= 0 ? '+' : ''}${fmtMoney(s.variance)}</span>
            </div>
            <div style="font-size:11px;color:var(--muted);font-family:ui-monospace,monospace;">
              ${esc(pt('openingCash'))}: ${fmtNum(s.openingCash)} · ${esc(pt('expectedCash'))}: ${fmtNum(s.expectedCash)} · ${esc(pt('countedCash'))}: ${fmtNum(s.countedCash)}
            </div>
          </div>`).join('') || `<div class="card" style="text-align:center;color:var(--muted);">${esc(t('noData'))}</div>`}
      </div>`;
  }

  function openStartShiftModal() {
    openModal(pt('openShift'), `
      <div><label class="lbl">${esc(pt('openingCash'))}</label><input id="shOpenAmt" type="number" min="0" class="inp mono" value="0"></div>
      <div><label class="lbl">${esc(t('notePh'))}</label><input id="shOpenNote" class="inp"></div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${esc(t('cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraPro.confirmOpenShift()">${esc(t('confirm'))}</button>`);
  }

  function confirmOpenShift() {
    const amt = Math.max(0, Number(document.getElementById('shOpenAmt')?.value || 0));
    state.shifts.unshift({
      id: 'sh_' + Date.now(), userId: curUser().id, userName: curUser().name,
      openingCash: amt, expectedCash: amt, countedCash: 0, variance: 0,
      note: (document.getElementById('shOpenNote')?.value || '').trim(),
      status: 'OPEN', date: new Date().toISOString().slice(0, 10)
    });
    saveState(); closeModal(); renderAll(); showToast(t('savedOk'));
  }

  function openCloseShiftModal(shId, expected) {
    openModal(pt('closeShift'), `
      <div class="sub-card">
        <span>${esc(pt('expectedCash'))}: <b style="color:var(--teal);">${fmtMoney(expected)}</b></span>
      </div>
      <div><label class="lbl">${esc(pt('countedCash'))}</label><input id="shCountAmt" type="number" min="0" class="inp mono" value="${expected}"></div>
      <div><label class="lbl">${esc(t('notePh'))}</label><input id="shCloseNote" class="inp"></div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${esc(t('cancel'))}</button>
      <button type="button" class="btn danger" onclick="KoraPro.confirmCloseShift('${esc(shId)}',${expected})">${esc(pt('closeShift'))}</button>`);
  }

  function confirmCloseShift(shId, expected) {
    const sh = (state.shifts || []).find((x) => x.id === shId);
    if (!sh) return;
    const counted = Math.max(0, Number(document.getElementById('shCountAmt')?.value || 0));
    sh.expectedCash = expected;
    sh.countedCash = counted;
    sh.variance = counted - expected;
    sh.status = 'CLOSED';
    sh.note = (document.getElementById('shCloseNote')?.value || sh.note).trim();
    saveState(); closeModal(); renderAll(); showToast(t('savedOk'));
  }

  // ---------------------------------------------------------------------------
  // 17. የደንበኞች ገጽ (የዱቤ ጣሪያ)፣ ባክአፕ እና የቅንብሮች ማሟያ (ቀን አቆጣጠር + ሞጁሎች)
  // ---------------------------------------------------------------------------
  const _origRenderSetupPage = global.renderSetupPage;

  global.renderSetupPage = function (page) {
    const root = document.getElementById('viewRoot');

    if (page === 'customers') {
      const todayIso = new Date().toISOString().slice(0, 10);
      root.innerHTML = `
        <div class="card-row">
          <button type="button" class="btn teal sm" onclick="KoraPro.openCustomerModal()">+ ${esc(t('add'))}</button>
          <span class="pill">${(state.customers || []).length}</span>
        </div>
        <div class="cards-grid">
          ${(state.customers || []).map((c) => {
            const cName = c.name.trim().toLowerCase();
            const openCrs = (state.creditLedger || []).filter((x) => x.type === 'receivable' && x.party.trim().toLowerCase() === cName && x.total > x.paid);
            const used = openCrs.reduce((a, x) => a + (x.total - x.paid), 0);
            const over = openCrs.some((x) => x.dueDate && x.dueDate < todayIso);
            return `
              <div class="card" style="${over ? 'border-color:var(--rose);' : ''}">
                <div class="card-row">
                  <b>${esc(c.name)}</b>
                  <div style="display:flex;gap:4px;">
                    <button type="button" class="icon-btn sm" onclick="KoraPro.openCustomerModal(${c.id})">✏️</button>
                    ${isOwner() ? `<button type="button" class="icon-btn sm" style="color:var(--rose);" onclick="deleteFromList('customers',${c.id})">✕</button>` : ''}
                  </div>
                </div>
                <div style="font-size:11px;color:var(--muted);font-family:ui-monospace,monospace;">${esc(c.phone || '-')} · ${c.creditDays || 14} ${esc(t('daysUnit'))}</div>
                <div class="card-row" style="font-size:11px;">
                  <span class="pill teal">${esc(pt('creditLimit'))}: ${fmtMoney(c.creditLimit)}</span>
                  <span class="pill ${over ? 'rose' : (used > 0 ? 'amber' : 'emerald')}">${fmtMoney(used)}</span>
                </div>
              </div>`;
          }).join('') || `<div class="card" style="text-align:center;color:var(--muted);">${esc(t('noData'))}</div>`}
        </div>`;
      return;
    }

    if (page === 'backup') {
      root.innerHTML = `
        <div class="card">
          <b style="color:var(--teal);">💾 ${esc(pt('backupMenu'))}</b>
          <div class="grid-2">
            <button type="button" class="btn teal" onclick="KoraPro.exportJsonBackup()">⬇️ ${esc(pt('exportBackup'))}</button>
            <label class="btn muted" style="text-align:center;">⬆️ ${esc(pt('restoreBackup'))}<input type="file" accept=".json" style="display:none;" onchange="KoraPro.restoreJsonBackup(this)"></label>
          </div>
        </div>`;
      return;
    }

    _origRenderSetupPage(page);

    if (page === 'settings') {
      const extra = document.createElement('div');
      extra.style.cssText = 'display:flex;flex-direction:column;gap:9px;';
      extra.innerHTML = `
        <div class="card">
          <b style="color:var(--teal);">${esc(pt('calendarLbl'))}</b>
          <div class="seg">
            <button type="button" class="seg-btn ${state.cfg.calendar === 'ET' ? 'teal' : ''}" onclick="state.cfg.calendar='ET';saveState();renderAll();">${esc(pt('calEt'))}</button>
            <button type="button" class="seg-btn ${state.cfg.calendar === 'GC' ? 'teal' : ''}" onclick="state.cfg.calendar='GC';saveState();renderAll();">${esc(pt('calGc'))}</button>
          </div>
        </div>
        <div class="card">
          <b style="color:var(--primary);">${esc(pt('modulesTitle'))}</b>
          ${[
            ['modGatePass', pt('modGatePass')],
            ['modTransfer', pt('modTransfer')],
            ['modShift', pt('modShift')],
            ['modDispatch', pt('modDispatch')],
            ['modSupplierForm', pt('modSupplierForm')]
          ].map(([k, lbl]) => `
            <div class="switch-row">
              <span>${esc(lbl)}</span>
              <div class="toggle ${state.cfg[k] !== false ? 'on' : ''}" onclick="state.cfg['${k}']=state.cfg['${k}']===false?true:false;saveState();renderAll();"></div>
            </div>`).join('')}
        </div>`;
      root.appendChild(extra);
    }
  };

  function openCustomerModal(editId = null) {
    const c = editId ? (state.customers || []).find((x) => x.id === editId) : null;
    openModal(pt('customersMenu'), `
      <input id="cuName" class="inp" value="${esc(c?.name || '')}" placeholder="${esc(t('customer'))}">
      <input id="cuPhone" class="inp mono" value="${esc(c?.phone || '')}" placeholder="09...">
      <div class="grid-2">
        <div><label class="lbl">${esc(pt('creditLimit'))}</label><input id="cuLimit" type="number" min="0" class="inp mono" value="${c?.creditLimit || 0}"></div>
        <div><label class="lbl">${esc(pt('creditDays'))}</label><input id="cuDays" type="number" min="1" class="inp mono" value="${c?.creditDays || 14}"></div>
      </div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${esc(t('cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraPro.saveCustomerModal(${editId || 'null'})">${esc(t('save'))}</button>`);
  }

  function saveCustomerModal(editId) {
    const name = (document.getElementById('cuName')?.value || '').trim();
    if (!name) return;
    const payload = {
      name,
      phone: (document.getElementById('cuPhone')?.value || '').trim(),
      creditLimit: Math.max(0, Number(document.getElementById('cuLimit')?.value || 0)),
      creditDays: Math.max(1, Number(document.getElementById('cuDays')?.value || 14))
    };
    if (editId) {
      const c = state.customers.find((x) => x.id === editId);
      if (c) Object.assign(c, payload);
    } else {
      state.customers.push({ id: Date.now(), ...payload });
    }
    saveState(); closeModal(); renderAll(); showToast(t('savedOk'));
  }

  function exportJsonBackup() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KoraStock_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t('savedOk'));
  }

  function restoreJsonBackup(inp) {
    const file = inp.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      verifyPin(true, () => {
        try {
          const parsed = JSON.parse(String(r.result || '{}'));
          if (!parsed || !Array.isArray(parsed.inventory)) { showToast(t('errGeneric'), true); return; }
          saveJson(STORE_KEY, parsed);
          state = loadState();
          ensureProState();
          renderAll();
          showToast(t('savedOk'));
        } catch { showToast(t('errGeneric'), true); }
      });
    };
    r.readAsText(file);
  }

  // በፒዲኤፍ ምድብ መምረጫ ላይ የglobal.renderedStockGroups ማጣጣሚያ
  global.togglePdfCategory = function (gIdx) {
    const grp = (global.renderedStockGroups || [])[gIdx];
    if (!grp || !grp.items.length) return;
    vib(20);
    if (pdfSelectScope !== 'stock') { pdfSelected = {}; pdfSelectScope = 'stock'; }
    const allSel = grp.items.every((it) => Boolean(pdfSelected[String(it.id)]));
    grp.items.forEach((it) => {
      if (allSel) delete pdfSelected[String(it.id)];
      else pdfSelected[String(it.id)] = true;
    });
    updatePdfBar();
    renderView();
  };

  // የKoraPro ተጨማሪ ተግባራትን ማገናኘት
  Object.assign(global.KoraPro, {
    clearSig: clearSigPad,
    queueSaleToTally,
    openLoadSaleModal,
    confirmLoadSale,
    openApproveFinDeliveryModal,
    confirmApproveFin,
    openReceiveTransferModal,
    confirmReceiveTransfer,
    openVerifyGatePass,
    confirmVerifyGatePass,
    renderShiftsView,
    openStartShiftModal,
    confirmOpenShift,
    openCloseShiftModal,
    confirmCloseShift,
    openCustomerModal,
    saveCustomerModal,
    exportJsonBackup,
    restoreJsonBackup,
    openQuickQtyAdd,
    confirmQuickQtyAdd,
    submitProEntry,
    finalizeSupplierDelivery,
    setTransferDest(v) { transferToBranch = v; },
    onSupplierPhoto(inp) {
      const f = inp.files?.[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => { supplierAttachData = r.result; renderView(); };
      r.readAsDataURL(f);
    },
    clearSupplierPhoto() { supplierAttachData = ''; renderView(); },
    setBasketQty(idx, val) {
      const list = entryMode === 'TRANSFER' ? transferBasket : entryBasket;
      if (list[idx]) list[idx].qty = Math.max(1, Math.floor(Number(val || 1)));
    },
    setBasketRemark(idx, val) {
      if (entryBasket[idx]) entryBasket[idx].remark = val;
    },
    removeBasketIdx(idx) {
      if (entryMode === 'TRANSFER') transferBasket.splice(idx, 1);
      else entryBasket.splice(idx, 1);
      vib(14);
      renderView();
    }
  });

  // ---------------------------------------------------------------------------
  // 18. ማስጀመሪያ (ነባሩን ሳይነካ ወዲያውኑ ይሠራል)
  // ---------------------------------------------------------------------------
  injectProStyles();
  ensureProState();
  if (state.loggedIn) {
    renderAll();
  }
})(window);