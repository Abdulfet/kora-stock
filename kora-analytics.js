// =============================================================================
// ኮራ ስቶክ — ብልህ የክምችት ፍጥነት፣ የመልሶ-ግዢ ትንበያ እና የዱቤ ስጋት ሞጁል (kora-analytics.js)
// =============================================================================
(function (global) {
  'use strict';

  const TXT = {
    am: {
      tabLabel: 'ትንተና',
      windowLbl: 'የትንተና ጊዜ',
      daysUnit: 'ቀን',
      leadLbl: 'የመድረሻ ቀን',
      coverLbl: 'የሽፋን ቀን',
      kpiCritical: 'አስቸኳይ መልሶ-ግዢ',
      kpiBudget: 'የመልሶ-ግዢ በጀት',
      kpiDead: 'ያልተንቀሳቀሱ ዕቃዎች',
      kpiDeadCap: 'የቆመ ካፒታል',
      secReorder: 'የመልሶ-ግዢ ትንበያ',
      secFast: 'ፈጣን ተንቀሳቃሽ ዕቃዎች',
      secDead: 'ያልተንቀሳቀሱ ክምችቶች',
      secExpiry: 'የማብቂያ ቀን ስጋት',
      secCredit: 'የዱቤ ዕድሜና ስጋት',
      colItem: 'ዕቃ',
      colZone: 'ቦታ',
      colStock: 'ቀሪ',
      colBurn: 'ዕለታዊ ፍጆታ',
      colDaysLeft: 'የቀረው ቀን',
      colSuggest: 'የሚገዛ ብዛት',
      colBudget: 'ግምት ዋጋ',
      colOut: 'የወጣ ብዛት',
      colTier: 'ደረጃ',
      colProfit: 'ትርፍ',
      colLocked: 'የቆመ ዋጋ',
      colExpiry: 'ማብቂያ ቀን',
      colAtRisk: 'ስጋት ላይ ያለ',
      colParty: 'ደንበኛ',
      colOverdue: 'ያለፈበት ቀን',
      colBalance: 'ቀሪ ዕዳ',
      urgCritical: 'አስቸኳይ',
      bucket0_30: 'ከ1 እስከ 30 ቀን',
      bucket31_60: 'ከ31 እስከ 60 ቀን',
      bucket61: 'ከ60 ቀን በላይ',
      currency: 'ብር',
      none: 'ምንም ስጋት አልተገኘም',
      hidden: 'የተደበቀ'
    },
    en: {
      tabLabel: 'Analytics',
      windowLbl: 'Window',
      daysUnit: 'd',
      leadLbl: 'Lead Time',
      coverLbl: 'Cover Days',
      kpiCritical: 'Urgent Reorders',
      kpiBudget: 'Reorder Budget',
      kpiDead: 'Dead Stock Items',
      kpiDeadCap: 'Capital Tied Up',
      secReorder: 'Reorder Forecast',
      secFast: 'Fast Moving Items',
      secDead: 'Dead Stock',
      secExpiry: 'Expiry Risk Forecast',
      secCredit: 'Credit Aging & Risk',
      colItem: 'Item',
      colZone: 'Zone',
      colStock: 'Stock',
      colBurn: 'Daily Burn',
      colDaysLeft: 'Days Left',
      colSuggest: 'Order Qty',
      colBudget: 'Est. Cost',
      colOut: 'Moved Qty',
      colTier: 'Tier',
      colProfit: 'Profit',
      colLocked: 'Tied Capital',
      colExpiry: 'Expiry Date',
      colAtRisk: 'At Risk Qty',
      colParty: 'Customer',
      colOverdue: 'Days Overdue',
      colBalance: 'Balance Due',
      urgCritical: 'Critical',
      bucket0_30: '1 to 30 Days',
      bucket31_60: '31 to 60 Days',
      bucket61: 'Over 60 Days',
      currency: 'ETB',
      none: 'No risks detected',
      hidden: 'Restricted'
    }
  };

  let opts = { windowDays: 30, leadDays: 7, coverDays: 21 };

  function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function num(v) { return Number(v || 0).toLocaleString('en-US'); }
  function money(v, L) { return `${num(v)} ${L.currency}`; }

  function computeLocalAnalytics(appState) {
    const u = (appState.users || []).find((x) => x.id === Number(appState.activeUserId)) || appState.users?.[0] || { perms: {} };
    const isOwner = u.roleKey === 'owner';
    const perm = (k) => isOwner || Boolean(u.perms?.[k]);
    const canSell = perm('sellPrice');
    const canCost = perm('costPrice');
    const canProfit = perm('profit');
    const canBanks = perm('banks');
    const scope = appState.branchScope || 'all';
    const win = opts.windowDays;
    const lead = opts.leadDays;
    const cover = opts.coverDays;
    const cutoffMs = Date.now() - win * 86400000;
    const todayIso = new Date().toISOString().slice(0, 10);

    const outMap = {};
    (appState.warehouseLedger || []).forEach((r) => {
      if (r.status !== 'valid' || r.type !== 'OUT') return;
      if (scope !== 'all' && r.branch !== scope) return;
      const ts = new Date(r.date || todayIso).getTime();
      if (!isNaN(ts) && ts < cutoffMs) return;
      outMap[r.itemId] = (outMap[r.itemId] || 0) + Number(r.outQty || 0);
    });

    const revMap = {};
    (appState.salesLedger || []).forEach((s) => {
      if (s.status !== 'valid') return;
      if (scope !== 'all' && s.branch !== scope) return;
      const ts = new Date(s.date || todayIso).getTime();
      if (!isNaN(ts) && ts < cutoffMs) return;
      if (!revMap[s.itemId]) revMap[s.itemId] = { rev: 0, prof: 0 };
      revMap[s.itemId].rev += Number(s.total || 0);
      revMap[s.itemId].prof += Number(s.profit || 0);
    });

    const items = (appState.inventory || []).map((i) => {
      const stock = scope === 'all'
        ? Object.values(i.branchStock || {}).reduce((a, b) => a + Number(b || 0), 0)
        : Number((i.branchStock || {})[scope] || 0);
      const outQty = outMap[i.id] || 0;
      const burn = Number((outQty / win).toFixed(3));
      const daysLeft = burn > 0 ? Number((stock / burn).toFixed(1)) : null;
      const suggest = Math.max(0, Math.ceil(burn * (lead + cover) - stock));
      let urgency = 'OK';
      if ((daysLeft !== null && daysLeft <= lead) || (stock <= 0 && outQty > 0)) urgency = 'CRITICAL';
      else if (daysLeft !== null && daysLeft <= lead + 7) urgency = 'SOON';

      const velocity = outQty <= 0 && stock > 0 ? 'DEAD' : (burn >= 2 ? 'FAST' : (burn >= 0.4 ? 'MEDIUM' : (outQty > 0 ? 'SLOW' : 'IDLE')));
      const rev = revMap[i.id]?.rev || 0;
      const prof = revMap[i.id]?.prof || 0;
      const unitList = (global.I18N?.[appState.lang] || global.I18N?.am)?.units || [''];
      const unitName = unitList[i.unitIdx ?? 0] || '';

      return {
        item_id: i.id, name: i.name, unit: unitName, zone: i.zoneCode || '-',
        current_qty: stock, out_qty: outQty, daily_burn: burn, days_left: daysLeft,
        suggested_qty: suggest, urgency, velocity, expiry_date: i.expiry || '',
        landed_cost: Number(i.landedCost || 0), revenue: rev, profit: prof
      };
    });

    const totalRev = items.reduce((a, b) => a + b.revenue, 0);
    let cum = 0;
    items.slice().sort((a, b) => b.revenue - a.revenue).forEach((it) => {
      cum += it.revenue;
      const share = totalRev > 0 ? cum / totalRev : 1;
      it.abc_tier = totalRev <= 0 ? 'C' : (share <= 0.75 ? 'A' : (share <= 0.93 ? 'B' : 'C'));
    });

    const reorder_forecast = items
      .filter((x) => x.suggested_qty > 0 && (x.urgency === 'CRITICAL' || x.urgency === 'SOON'))
      .sort((a, b) => Number(b.urgency === 'CRITICAL') - Number(a.urgency === 'CRITICAL') || (a.days_left ?? 9999) - (b.days_left ?? 9999))
      .map((r) => ({ ...r, est_budget: canCost ? Math.round(r.suggested_qty * r.landed_cost) : null }));

    const fast_movers = items
      .filter((x) => x.out_qty > 0)
      .sort((a, b) => b.out_qty - a.out_qty)
      .slice(0, 15)
      .map((r) => ({
        ...r,
        abc_tier: canSell ? r.abc_tier : null,
        revenue: canSell ? r.revenue : null,
        profit: canProfit ? r.profit : null
      }));

    const dead_stock = items
      .filter((x) => x.velocity === 'DEAD')
      .sort((a, b) => (b.current_qty * b.landed_cost) - (a.current_qty * a.landed_cost))
      .slice(0, 20)
      .map((r) => ({ ...r, locked_capital: canCost ? Math.round(r.current_qty * r.landed_cost) : null }));

    const expiry_risk = [];
    if (appState.cfg?.expiry) {
      const nowMs = Date.now();
      items.forEach((r) => {
        if (!r.expiry_date || r.current_qty <= 0) return;
        const dLeft = Math.ceil((new Date(r.expiry_date).getTime() - nowMs) / 86400000);
        if (dLeft > 90) return;
        const canSellBefore = Math.max(0, Math.floor(r.daily_burn * Math.max(0, dLeft)));
        const atRisk = Math.max(0, r.current_qty - canSellBefore);
        if (atRisk > 0 || dLeft <= 30) {
          expiry_risk.push({
            item_id: r.item_id, name: r.name, unit: r.unit, zone: r.zone,
            current_qty: r.current_qty, expiry_date: r.expiry_date, days_to_expiry: dLeft,
            at_risk_qty: atRisk, at_risk_value: canCost ? Math.round(atRisk * r.landed_cost) : null
          });
        }
      });
      expiry_risk.sort((a, b) => a.days_to_expiry - b.days_to_expiry);
    }

    let credit_risk = null;
    if (canBanks || canSell) {
      let recTot = 0, payTot = 0, b0 = 0, b31 = 0, b61 = 0;
      const topOver = [];
      (appState.creditLedger || []).forEach((c) => {
        const bal = Math.max(0, Number(c.total || 0) - Number(c.paid || 0));
        if (bal <= 0) return;
        if (c.type === 'payable') { payTot += bal; return; }
        recTot += bal;
        const ovDays = c.dueDate ? Math.max(0, Math.floor((Date.now() - new Date(c.dueDate).getTime()) / 86400000)) : 0;
        if (ovDays > 0) {
          if (ovDays <= 30) b0 += bal;
          else if (ovDays <= 60) b31 += bal;
          else b61 += bal;
          topOver.push({ doc_no: c.docNo, party: c.party, balance: bal, due_date: c.dueDate, overdue_days: ovDays });
        }
      });
      topOver.sort((a, b) => b.overdue_days - a.overdue_days || b.balance - a.balance);
      credit_risk = {
        receivable_total: recTot,
        payable_total: canBanks ? payTot : null,
        overdue_0_30: b0, overdue_31_60: b31, overdue_61_plus: b61,
        top_overdue: topOver.slice(0, 10)
      };
    }

    return {
      success: true,
      summary: {
        window_days: win,
        critical_reorder_count: items.filter((x) => x.urgency === 'CRITICAL').length,
        soon_reorder_count: items.filter((x) => x.urgency === 'SOON').length,
        dead_stock_count: dead_stock.length,
        fast_movers_count: items.filter((x) => x.velocity === 'FAST').length,
        total_reorder_budget: canCost ? reorder_forecast.reduce((a, b) => a + Number(b.est_budget || 0), 0) : null,
        dead_stock_capital: canCost ? dead_stock.reduce((a, b) => a + Number(b.locked_capital || 0), 0) : null
      },
      reorder_forecast,
      fast_movers,
      dead_stock,
      expiry_risk,
      credit_risk
    };
  }

  async function loadAnalyticsData(appState, branchUuid = null) {
    if (global.KoraAPI && global.KoraAPI.getSession?.() && navigator.onLine) {
      try {
        const live = await global.KoraAPI.getSmartAnalytics({
          branchId: branchUuid,
          windowDays: opts.windowDays,
          leadDays: opts.leadDays,
          coverDays: opts.coverDays
        });
        if (live && live.success) return live;
      } catch {}
    }
    return computeLocalAnalytics(appState);
  }

  async function renderInto(containerEl, appState) {
    if (!containerEl || !appState) return;
    const lang = appState.lang === 'en' ? 'en' : 'am';
    const L = TXT[lang];
    const data = await loadAnalyticsData(appState);
    const s = data.summary || {};

    const showBudgetCol = (data.reorder_forecast || []).some((r) => r.est_budget !== null);
    const showTierCol = (data.fast_movers || []).some((r) => r.abc_tier !== null);
    const showProfCol = (data.fast_movers || []).some((r) => r.profit !== null);
    const showDeadCap = (data.dead_stock || []).some((r) => r.locked_capital !== null);

    const reorderRows = (data.reorder_forecast || []).map((r) => `
      <tr>
        <td><b>${esc(r.name)}</b></td>
        <td style="color:var(--amber);font-family:ui-monospace,monospace;">${esc(r.zone)}</td>
        <td class="ctr">${num(r.current_qty)} ${esc(r.unit)}</td>
        <td class="ctr">${r.daily_burn}</td>
        <td class="ctr"><span class="pill ${r.urgency === 'CRITICAL' ? 'rose' : 'amber'}">${r.days_left !== null ? `${r.days_left} ${esc(L.daysUnit)}` : esc(L.urgCritical)}</span></td>
        <td class="ctr" style="color:var(--teal);font-weight:900;">+${num(r.suggested_qty)}</td>
        ${showBudgetCol ? `<td class="num">${money(r.est_budget, L)}</td>` : ''}
      </tr>`).join('');

    const fastRows = (data.fast_movers || []).map((r) => `
      <tr>
        <td><b>${esc(r.name)}</b></td>
        <td class="ctr" style="color:var(--emerald);font-weight:900;">${num(r.out_qty)} ${esc(r.unit)}</td>
        <td class="ctr">${r.daily_burn}</td>
        <td class="ctr">${num(r.current_qty)}</td>
        ${showTierCol ? `<td class="ctr"><span class="pill ${r.abc_tier === 'A' ? 'emerald' : 'teal'}">${esc(r.abc_tier || '-')}</span></td>` : ''}
        ${showProfCol ? `<td class="num" style="color:var(--emerald);">+${money(r.profit, L)}</td>` : ''}
      </tr>`).join('');

    const deadRows = (data.dead_stock || []).map((r) => `
      <tr>
        <td><b>${esc(r.name)}</b></td>
        <td style="color:var(--amber);font-family:ui-monospace,monospace;">${esc(r.zone)}</td>
        <td class="ctr">${num(r.current_qty)} ${esc(r.unit)}</td>
        ${showDeadCap ? `<td class="num" style="color:var(--rose);">${money(r.locked_capital, L)}</td>` : ''}
      </tr>`).join('');

    const expiryBlock = (data.expiry_risk || []).length ? `
      <div class="card">
        <b style="color:var(--rose);">${esc(L.secExpiry)}</b>
        <div class="tbl-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>${esc(L.colItem)}</th>
                <th>${esc(L.colZone)}</th>
                <th class="ctr">${esc(L.colExpiry)}</th>
                <th class="ctr">${esc(L.colAtRisk)}</th>
                ${data.expiry_risk.some((x) => x.at_risk_value !== null) ? `<th class="num">${esc(L.colLocked)}</th>` : ''}
              </tr>
            </thead>
            <tbody>
              ${data.expiry_risk.map((x) => `
                <tr>
                  <td><b>${esc(x.name)}</b></td>
                  <td>${esc(x.zone)}</td>
                  <td class="ctr"><span class="pill rose">${esc(x.expiry_date)} (${x.days_to_expiry} ${esc(L.daysUnit)})</span></td>
                  <td class="ctr" style="color:var(--amber);">${num(x.at_risk_qty)} ${esc(x.unit)}</td>
                  ${x.at_risk_value !== null ? `<td class="num" style="color:var(--rose);">${money(x.at_risk_value, L)}</td>` : ''}
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>` : '';

    const cr = data.credit_risk;
    const creditBlock = cr ? `
      <div class="card">
        <b style="color:var(--amber);">${esc(L.secCredit)}</b>
        <div class="kpi-grid">
          <div class="kpi amber"><span class="kpi-lbl">${esc(L.bucket0_30)}</span><span class="kpi-val">${money(cr.overdue_0_30, L)}</span></div>
          <div class="kpi rose"><span class="kpi-lbl">${esc(L.bucket31_60)}</span><span class="kpi-val">${money(cr.overdue_31_60, L)}</span></div>
          <div class="kpi rose"><span class="kpi-lbl">${esc(L.bucket61)}</span><span class="kpi-val">${money(cr.overdue_61_plus, L)}</span></div>
        </div>
        ${(cr.top_overdue || []).length ? `
          <div class="tbl-wrap">
            <table class="tbl">
              <thead><tr><th>${esc(L.colParty)}</th><th class="ctr">${esc(L.colOverdue)}</th><th class="num">${esc(L.colBalance)}</th></tr></thead>
              <tbody>
                ${cr.top_overdue.map((c) => `
                  <tr>
                    <td><b>${esc(c.party)}</b> (${esc(c.doc_no)})</td>
                    <td class="ctr"><span class="pill rose">${c.overdue_days} ${esc(L.daysUnit)}</span></td>
                    <td class="num" style="color:var(--rose);font-weight:900;">${money(c.balance, L)}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>` : `<div style="font-size:11.5px;color:var(--emerald);text-align:center;">${esc(L.none)}</div>`}
      </div>` : '';

    containerEl.innerHTML = `
      <div class="card">
        <div class="grid-3">
          <div>
            <label class="lbl">${esc(L.windowLbl)} (${esc(L.daysUnit)})</label>
            <select class="sel" onchange="KoraAnalytics.setOption('windowDays',Number(this.value));KoraAnalytics.renderInto(document.getElementById('viewRoot'),state);">
              ${[7, 14, 30, 60, 90].map((d) => `<option value="${d}" ${opts.windowDays === d ? 'selected' : ''}>${d} ${esc(L.daysUnit)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="lbl">${esc(L.leadLbl)} (${esc(L.daysUnit)})</label>
            <input type="number" min="1" max="90" class="inp mono" value="${opts.leadDays}" onchange="KoraAnalytics.setOption('leadDays',Math.max(1,Number(this.value||7)));KoraAnalytics.renderInto(document.getElementById('viewRoot'),state);">
          </div>
          <div>
            <label class="lbl">${esc(L.coverLbl)} (${esc(L.daysUnit)})</label>
            <input type="number" min="3" max="180" class="inp mono" value="${opts.coverDays}" onchange="KoraAnalytics.setOption('coverDays',Math.max(3,Number(this.value||21)));KoraAnalytics.renderInto(document.getElementById('viewRoot'),state);">
          </div>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi rose"><span class="kpi-lbl">${esc(L.kpiCritical)}</span><span class="kpi-val">${num(s.critical_reorder_count)}</span></div>
        <div class="kpi cyan"><span class="kpi-lbl">${esc(L.kpiBudget)}</span><span class="kpi-val">${s.total_reorder_budget !== null ? money(s.total_reorder_budget, L) : esc(L.hidden)}</span></div>
        <div class="kpi amber"><span class="kpi-lbl">${esc(L.kpiDead)}</span><span class="kpi-val">${num(s.dead_stock_count)}</span></div>
        <div class="kpi"><span class="kpi-lbl">${esc(L.kpiDeadCap)}</span><span class="kpi-val">${s.dead_stock_capital !== null ? money(s.dead_stock_capital, L) : esc(L.hidden)}</span></div>
      </div>

      <div class="card">
        <b style="color:var(--teal);">${esc(L.secReorder)}</b>
        <div class="tbl-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>${esc(L.colItem)}</th><th>${esc(L.colZone)}</th><th class="ctr">${esc(L.colStock)}</th>
                <th class="ctr">${esc(L.colBurn)}</th><th class="ctr">${esc(L.colDaysLeft)}</th>
                <th class="ctr">${esc(L.colSuggest)}</th>
                ${showBudgetCol ? `<th class="num">${esc(L.colBudget)}</th>` : ''}
              </tr>
            </thead>
            <tbody>${reorderRows || `<tr><td colspan="7" class="ctr" style="padding:14px;color:var(--emerald);">${esc(L.none)}</td></tr>`}</tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <b style="color:var(--emerald);">${esc(L.secFast)}</b>
        <div class="tbl-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>${esc(L.colItem)}</th><th class="ctr">${esc(L.colOut)}</th><th class="ctr">${esc(L.colBurn)}</th>
                <th class="ctr">${esc(L.colStock)}</th>
                ${showTierCol ? `<th class="ctr">${esc(L.colTier)}</th>` : ''}
                ${showProfCol ? `<th class="num">${esc(L.colProfit)}</th>` : ''}
              </tr>
            </thead>
            <tbody>${fastRows || `<tr><td colspan="6" class="ctr" style="padding:14px;color:var(--muted);">${esc(L.none)}</td></tr>`}</tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <b style="color:var(--amber);">${esc(L.secDead)}</b>
        <div class="tbl-wrap">
          <table class="tbl">
            <thead><tr><th>${esc(L.colItem)}</th><th>${esc(L.colZone)}</th><th class="ctr">${esc(L.colStock)}</th>${showDeadCap ? `<th class="num">${esc(L.colLocked)}</th>` : ''}</tr></thead>
            <tbody>${deadRows || `<tr><td colspan="4" class="ctr" style="padding:14px;color:var(--emerald);">${esc(L.none)}</td></tr>`}</tbody>
          </table>
        </div>
      </div>

      ${expiryBlock}
      ${creditBlock}`;
  }

  global.KoraAnalytics = {
    setOption(key, val) { opts[key] = val; },
    getTabLabel(lang) { return TXT[lang === 'en' ? 'en' : 'am'].tabLabel; },
    computeLocalAnalytics,
    renderInto
  };
})(window);
