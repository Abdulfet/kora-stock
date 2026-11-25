// =============================================================================
// ኮራ ስቶክ — ERP Control & Reporting Suite (kora-erp-guard.js — v22)
// • FT/Telebirr/Bank Duplicate Receipt Blocker + Photo Archive
// • Customer Credit Limit Guard + 1-Tap Reminder
// • Dual-PIN Digital Shift Handover + Pad Sequence Gap & Voided Leaves Log
// • Stockout Forecast + Dead Stock + Damage/Scrap Log
// • End-of-Day Digest (Configurable Telegram/WhatsApp), Thermal/Custom Print,
//   Shelf QR Labels, and Full JSON Backup/Restore
// =============================================================================
(function (global) {
  'use strict';

  function hasState() { return typeof state !== 'undefined' && state && typeof state === 'object'; }
  function isAm() { return !hasState() || state.lang !== 'en'; }
  function L(am, en) { return isAm() ? am : en; }
  function sEsc(v) { return typeof esc === 'function' ? esc(v) : String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function sNum(n) { return typeof fmtNum === 'function' ? fmtNum(n) : Number(n || 0).toLocaleString(); }
  function sMoney(n) { return typeof fmtMoney === 'function' ? fmtMoney(n) : `${Number(n || 0).toLocaleString()} ብር`; }
  function todayIso() { return new Date().toISOString().slice(0, 10); }

  function normRef(s) { return String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }

  function addAudit(action, ref, details) {
    if (!hasState()) return;
    if (!Array.isArray(state.auditLogs)) state.auditLogs = [];
    const u = typeof curUser === 'function' ? curUser() : { name: 'User', role: '-' };
    state.auditLogs.unshift({
      id: 'aud_' + Date.now(),
      action, ref: ref || '-', details: details || '',
      actor: u.name || '-', role: u.role || '-',
      ts: new Date().toLocaleString()
    });
    if (state.auditLogs.length > 400) state.auditLogs.length = 400;
  }

  function ensureErpState() {
    if (!hasState()) return;
    if (!state.erp || typeof state.erp !== 'object') state.erp = {};
    const e = state.erp;
    if (!Array.isArray(e.ftRefs)) e.ftRefs = [];
    if (!Array.isArray(e.creditRules)) e.creditRules = [];
    if (!Array.isArray(e.handovers)) e.handovers = [];
    if (!Array.isArray(e.voidLeaves)) e.voidLeaves = [];
    if (!Array.isArray(e.damages)) e.damages = [];
    if (!e.subTab) e.subTab = 'ft';
    if (!e.printSize) e.printSize = '80mm'; // 58mm | 80mm | A5 | A4
    if (e.tgBot === undefined) e.tgBot = '';
    if (e.tgChat === undefined) e.tgChat = '';
  }

  function injectErpCss() {
    if (document.getElementById('koraErpCss')) return;
    const st = document.createElement('style');
    st.id = 'koraErpCss';
    st.textContent = `
      .keg-bar { height: 6px; border-radius: 6px; background: rgba(51,65,85,0.65); overflow: hidden; margin-top: 4px; }
      .keg-fill { height: 100%; background: var(--teal); transition: width 0.2s ease; }
      .keg-fill.warn { background: var(--amber); }
      .keg-fill.over { background: var(--rose); }
      .keg-alert { background: rgba(239,68,68,0.16); border: 1px solid rgba(239,68,68,0.55); color: #fca5a5; border-radius: 10px; padding: 8px 10px; font-size: 11.5px; line-height: 1.45; }
      .keg-ok { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.5); color: #6ee7b7; border-radius: 10px; padding: 8px 10px; font-size: 11.5px; }
      .keg-thumb { width: 42px; height: 42px; border-radius: 8px; object-fit: cover; border: 1px solid var(--border-strong); cursor: pointer; flex-shrink: 0; }
      .keg-pre { white-space: pre-wrap; font-family: ui-monospace, monospace; font-size: 11px; line-height: 1.5; background: #070d19; border: 1px solid var(--border-strong); border-radius: 10px; padding: 9px; color: #e2e8f0; }
      .keg-qr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(145px, 1fr)); gap: 7px; }
      .keg-qr-card { background: var(--surface-deep); border: 1px solid var(--border-strong); border-radius: 11px; padding: 8px; display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center; }
      .keg-qr-svg { width: 68px; height: 68px; background: #fff; border-radius: 7px; padding: 3px; }
    `;
    document.head.appendChild(st);
  }

  function buildQrSvg(text, cls = 'keg-qr-svg') {
    const str = String(text || 'KORA');
    const size = 21;
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) { hash ^= str.charCodeAt(i); hash = Math.imul(hash, 16777619); }
    const isF = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);
    let rects = '';
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        let on = false;
        if (isF(r, c)) {
          const lr = r < 7 ? r : r - (size - 7), lc = c < 7 ? c : c - (size - 7);
          on = (lr === 0 || lr === 6 || lc === 0 || lc === 6 || (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4));
        } else {
          on = (((hash >>> ((r * 5 + c * 3) % 24)) ^ (str.charCodeAt((r + c) % str.length) >> (c % 5))) & 1) === 1;
        }
        if (on) rects += `<rect x="${c}" y="${r}" width="1" height="1" fill="#060a12"/>`;
      }
    }
    return `<svg class="${cls}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg"><rect width="${size}" height="${size}" fill="#fff"/>${rects}</svg>`;
  }

  let draftPhoto = '';
  let ftSearch = '';

  function readPhotoInput(inp) {
    const f = inp.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      draftPhoto = r.result;
      showToast(L('ፎቶ ተያይዟል', 'Photo attached'));
    };
    r.readAsDataURL(f);
  }

  function viewPhoto(src, title) {
    if (!src) return;
    openModal(`🖼️ ${title || L('ፎቶ', 'Photo')}`, `<img src="${src}" style="width:100%;max-height:65vh;object-fit:contain;border-radius:10px;">`, `<button type="button" class="btn teal" onclick="closeModal()">${sEsc(L('ዝጋ', 'Close'))}</button>`);
  }

  // ===========================================================================
  // 1. 💳 የባንክና ቴሌብር FT / Ref ID ድጋሚ መጠቀምን መከላከያ
  // ===========================================================================
  function renderFtTab(root) {
    const list = state.erp.ftRefs;
    const todayTotal = list.filter((x) => x.date === todayIso()).reduce((a, x) => a + Number(x.amount || 0), 0);
    const filtered = list.filter((x) => {
      if (!ftSearch) return true;
      return `${x.refNo} ${x.bank} ${x.party} ${x.amount}`.toLowerCase().includes(ftSearch.toLowerCase());
    });

    root.innerHTML = `
      <div class="kpi-grid">
        <div class="kpi teal"><span class="kpi-lbl">${sEsc(L('የተረጋገጡ ደረሰኞች', 'Verified Refs'))}</span><span class="kpi-val">${list.length}</span></div>
        <div class="kpi emerald"><span class="kpi-lbl">${sEsc(L('የዛሬ የባንክ/ቴሌብር ገቢ', 'Today Bank/Telebirr'))}</span><span class="kpi-val">${sMoney(todayTotal)}</span></div>
      </div>

      <div class="card-row" style="gap:6px;">
        <input class="inp sm" style="flex:1;" value="${sEsc(ftSearch)}" placeholder="🔍 ${sEsc(L('FT ቁጥር ወይም ደንበኛ ፈልግ...', 'Search FT / Ref ID...'))}" oninput="KoraErp.setFtSearch(this.value)">
        <button type="button" class="btn teal sm" onclick="KoraErp.openFtModal()">+ ${sEsc(L('ደረሰኝ አረጋግጥ', 'Verify FT'))}</button>
      </div>

      <div class="cards-grid">
        ${filtered.map((x) => `
          <div class="card">
            <div class="card-row">
              <div style="min-width:0;flex:1;">
                <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;">
                  <span class="pill teal">${sEsc(x.bank)}</span>
                  <b style="font-family:ui-monospace,monospace;font-size:12.5px;color:#38bdf8;">${sEsc(x.refNo)}</b>
                </div>
                <div style="font-size:12px;font-weight:800;margin-top:3px;">${sEsc(x.party || '-')} · <span style="color:#34d399;">${sMoney(x.amount)}</span></div>
                <div style="font-size:10px;color:var(--muted);margin-top:2px;">📅 ${sEsc(x.date)} · 👤 ${sEsc(x.by || '-')} ${x.note ? `· ${sEsc(x.note)}` : ''}</div>
              </div>
              ${x.photo ? `<img class="keg-thumb" src="${x.photo}" onclick="KoraErp.viewPhoto('${x.photo}','${sEsc(x.refNo)}')">` : ''}
            </div>
          </div>`).join('') || `<div class="card" style="text-align:center;color:var(--muted);padding:22px;">${sEsc(L('ገና የተመዘገበ የባንክ/ቴሌብር ደረሰኝ የለም', 'No bank/Telebirr receipts logged yet'))}</div>`}
      </div>`;
  }

  function openFtModal() {
    draftPhoto = '';
    openModal(`💳 ${L('የባንክ / ቴሌብር ደረሰኝ ማረጋገጫ', 'Verify Bank / Telebirr Ref')}`, `
      <div id="kegFtWarn"></div>
      <div class="grid-2">
        <div>
          <label class="lbl">${sEsc(L('ባንክ / ቻናል', 'Bank / Channel'))}</label>
          <select id="kegFtBank" class="sel">
            <option value="CBE">CBE (ንግድ ባንክ)</option>
            <option value="Telebirr">Telebirr (ቴሌብር)</option>
            <option value="Abyssinia">Abyssinia (አቢሲኒያ)</option>
            <option value="Awash">Awash (አዋሽ)</option>
            <option value="Dashen">Dashen (ዳሽን)</option>
            <option value="Coop">Coop / Ebirr</option>
            <option value="Other">${sEsc(L('ሌላ ባንክ', 'Other'))}</option>
          </select>
        </div>
        <div>
          <label class="lbl">${sEsc(L('መጠን (ብር)', 'Amount (ETB)'))}</label>
          <input id="kegFtAmt" type="number" min="1" class="inp mono" placeholder="15000">
        </div>
      </div>
      <div>
        <label class="lbl">${sEsc(L('የትራንዛክሽን ቁጥር (FT / Ref ID)', 'Transaction Ref / FT Number'))}</label>
        <input id="kegFtRef" class="inp mono" placeholder="FT26329ABC12 / BJK89..." oninput="KoraErp.checkFtLive(this.value)">
      </div>
      <div class="grid-2">
        <input id="kegFtParty" class="inp sm" placeholder="${sEsc(L('የደንበኛ ስም', 'Customer name'))}">
        <input id="kegFtNote" class="inp sm" placeholder="${sEsc(L('የሰነድ ቁጥር / ማስታወሻ', 'Invoice / note'))}">
      </div>
      <label class="btn muted sm" style="text-align:center;">📷 ${sEsc(L('የደረሰኙን ፎቶ / ስክሪንሾት አያይዝ', 'Attach Receipt Screenshot'))}<input type="file" accept="image/*" style="display:none;" onchange="KoraErp.readPhoto(this)"></label>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${sEsc(L('ተው', 'Cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraErp.saveFt()">${sEsc(L('አረጋግጥና መዝግብ', 'Verify & Save'))}</button>`);
  }

  function findDupFt(refNo) {
    const key = normRef(refNo);
    if (key.length < 4) return null;
    return state.erp.ftRefs.find((x) => normRef(x.refNo) === key) || null;
  }

  function checkFtLive(val) {
    const box = document.getElementById('kegFtWarn');
    if (!box) return;
    const dup = findDupFt(val);
    if (dup) {
      box.innerHTML = `<div class="keg-alert">🚨 <b>${sEsc(L('ማስጠንቀቂያ — ድጋሚ ደረሰኝ!', 'DUPLICATE RECEIPT DETECTED!'))}</b><br>${sEsc(L('ይህ ቁጥር ቀደም ሲል ተመዝግቧል፦', 'Already registered:'))} <b>${sEsc(dup.bank)} · ${sMoney(dup.amount)}</b> (${sEsc(dup.party)} · ${sEsc(dup.date)} · ${sEsc(dup.by)})</div>`;
    } else if (normRef(val).length >= 5) {
      box.innerHTML = `<div class="keg-ok">✅ ${sEsc(L('አዲስ ቁጥር ነው — ቀደም ሲል አልተጠቀመበትም', 'Unique reference — not used before'))}</div>`;
    } else {
      box.innerHTML = '';
    }
  }

  function saveFt() {
    const bank = document.getElementById('kegFtBank')?.value || 'CBE';
    const refNo = (document.getElementById('kegFtRef')?.value || '').trim().toUpperCase();
    const amount = Number(document.getElementById('kegFtAmt')?.value || 0);
    const party = (document.getElementById('kegFtParty')?.value || '').trim();
    const note = (document.getElementById('kegFtNote')?.value || '').trim();

    if (normRef(refNo).length < 4 || !(amount > 0)) {
      showToast(L('ትክክለኛ የFT ቁጥር እና መጠን ያስገቡ', 'Enter valid Ref ID and amount'), true);
      return;
    }
    const dup = findDupFt(refNo);
    if (dup) {
      checkFtLive(refNo);
      addAudit('DUPLICATE_FT_BLOCKED', refNo, `${bank} ${sMoney(amount)} (${party}) — original: ${dup.date}`);
      saveState();
      showToast(L('🚨 ይህ የደረሰኝ ቁጥር ቀደም ሲል ተመዝግቧል!', 'Duplicate FT blocked!'), true);
      return;
    }
    const u = typeof curUser === 'function' ? curUser() : { name: 'User' };
    state.erp.ftRefs.unshift({
      id: 'ft_' + Date.now(), bank, refNo, amount, party, note,
      photo: draftPhoto, date: todayIso(), by: u.name || '-'
    });
    addAudit('FT_VERIFIED', refNo, `${bank} · ${sMoney(amount)} · ${party}`);
    saveState(); closeModal(); renderView();
    showToast(L('የባንክ ደረሰኙ ተረጋግጦ ተመዝግቧል!', 'Receipt verified & logged!'));
  }

  // ===========================================================================
  // 2. 🧾 የደንበኛ ዱቤ ገደብ እና ራስ-ሰር ማስታወሻ
  // ===========================================================================
  function collectCustomerCredit() {
    const map = {};
    (state.customers || []).forEach((c) => {
      const k = (c.name || '').trim();
      if (!k) return;
      map[k] = { name: k, phone: c.phone || '', balance: Number(c.balance || c.credit || 0), limit: 0, dueDays: 15 };
    });
    (state.sales || []).forEach((s) => {
      const k = (s.party || s.customer || '').trim();
      const rem = Number(s.balance ?? s.due ?? (s.payMode === 'credit' ? (Number(s.total || 0) - Number(s.paid || 0)) : 0));
      if (!k) return;
      if (!map[k]) map[k] = { name: k, phone: s.phone || '', balance: 0, limit: 0, dueDays: 15 };
      if (rem > 0 && !(state.customers || []).some((c) => (c.name || '').trim() === k && Number(c.balance || 0) > 0)) {
        map[k].balance += rem;
      }
    });
    (state.erp.creditRules || []).forEach((r) => {
      if (!map[r.name]) map[r.name] = { name: r.name, phone: r.phone || '', balance: Number(r.manualBal || 0), limit: 0, dueDays: 15 };
      if (r.phone) map[r.name].phone = r.phone;
      if (r.manualBal > 0 && map[r.name].balance === 0) map[r.name].balance = Number(r.manualBal);
      map[r.name].limit = Number(r.limit || 0);
      map[r.name].dueDays = Number(r.dueDays || 15);
    });
    return Object.values(map).sort((a, b) => b.balance - a.balance);
  }

  function renderCreditTab(root) {
    const list = collectCustomerCredit();
    const totalDue = list.reduce((a, c) => a + c.balance, 0);
    const overCnt = list.filter((c) => c.limit > 0 && c.balance >= c.limit).length;

    root.innerHTML = `
      <div class="kpi-grid">
        <div class="kpi amber"><span class="kpi-lbl">${sEsc(L('ጠቅላላ ዱቤ', 'Total Credit'))}</span><span class="kpi-val">${sMoney(totalDue)}</span></div>
        <div class="kpi ${overCnt > 0 ? 'rose' : 'emerald'}"><span class="kpi-lbl">${sEsc(L('ገደብ ያለፉ ደንበኞች', 'Over Limit'))}</span><span class="kpi-val">${overCnt}</span></div>
      </div>
      <div class="card-row">
        <b style="color:var(--teal);">🧾 ${sEsc(L('የደንበኞች የዱቤ ገደብ ቁጥጥር', 'Customer Credit Guard'))}</b>
        <button type="button" class="btn teal sm" onclick="KoraErp.openCreditModal('')">+ ${sEsc(L('ገደብ ወስን', 'Set Limit'))}</button>
      </div>
      <div class="cards-grid">
        ${list.map((c) => {
          const pct = c.limit > 0 ? Math.min(100, Math.round((c.balance / c.limit) * 100)) : 0;
          const over = c.limit > 0 && c.balance >= c.limit;
          const warn = c.limit > 0 && pct >= 80 && !over;
          return `
            <div class="card" style="${over ? 'border-color:rgba(239,68,68,0.65);' : ''}">
              <div class="card-row">
                <b>👤 ${sEsc(c.name)}</b>
                <span class="pill ${over ? 'rose' : (warn ? 'amber' : 'teal')}">${over ? L('🚨 ገደብ አልፏል', 'Over Limit') : (c.limit > 0 ? pct + '%' : L('ገደብ የለም', 'No Limit'))}</span>
              </div>
              <div class="card-row" style="font-size:11.5px;">
                <span>${sEsc(L('ቀሪ ዱቤ', 'Due'))}: <b style="color:#fbbf24;">${sMoney(c.balance)}</b></span>
                <span>${sEsc(L('ገደብ', 'Limit'))}: <b>${c.limit > 0 ? sMoney(c.limit) : '∞'}</b></span>
              </div>
              ${c.limit > 0 ? `<div class="keg-bar"><div class="keg-fill ${over ? 'over' : (warn ? 'warn' : '')}" style="width:${pct}%"></div></div>` : ''}
              <div style="display:flex;gap:5px;margin-top:4px;">
                <button type="button" class="btn muted sm" style="flex:1;" onclick="KoraErp.openCreditModal('${sEsc(c.name)}')">⚙️ ${sEsc(L('ገደብ ቀይር', 'Edit Limit'))}</button>
                <button type="button" class="btn teal sm" style="flex:1;" onclick="KoraErp.sendCreditReminder('${sEsc(c.name)}',${c.balance},'${sEsc(c.phone)}')">💬 ${sEsc(L('ማስታወሻ ላክ', 'Remind'))}</button>
              </div>
            </div>`;
        }).join('') || `<div class="card" style="text-align:center;color:var(--muted);padding:22px;">${sEsc(L('የተመዘገበ የደንበኛ ዱቤ የለም', 'No credit accounts found'))}</div>`}
      </div>`;
  }

  function openCreditModal(name) {
    const ex = state.erp.creditRules.find((r) => r.name === name) || { name: name || '', phone: '', limit: 50000, dueDays: 15, manualBal: 0 };
    openModal(`🧾 ${L('የደንበኛ ዱቤ ገደብ', 'Set Credit Limit')}`, `
      <input id="kegCrName" class="inp" value="${sEsc(ex.name)}" placeholder="${sEsc(L('የደንበኛ ስም', 'Customer name'))}">
      <div class="grid-2">
        <div><label class="lbl">${sEsc(L('ከፍተኛ የዱቤ ገደብ (ብር)', 'Credit Limit (ETB)'))}</label><input id="kegCrLim" type="number" min="0" class="inp mono" value="${ex.limit || 0}"></div>
        <div><label class="lbl">${sEsc(L('የመክፈያ ቀን ገደብ', 'Due Days'))}</label><input id="kegCrDays" type="number" min="1" class="inp mono" value="${ex.dueDays || 15}"></div>
      </div>
      <div class="grid-2">
        <input id="kegCrPhone" class="inp sm mono" value="${sEsc(ex.phone || '')}" placeholder="${sEsc(L('ስልክ ቁጥር', 'Phone'))}">
        <input id="kegCrBal" type="number" min="0" class="inp sm mono" value="${ex.manualBal || 0}" placeholder="${sEsc(L('ነባር ቀሪ ዱቤ (ካለ)', 'Opening due'))}">
      </div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${sEsc(L('ተው', 'Cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraErp.saveCreditRule()">${sEsc(L('አስቀምጥ', 'Save'))}</button>`);
  }

  function saveCreditRule() {
    const name = (document.getElementById('kegCrName')?.value || '').trim();
    if (!name) return;
    const rule = {
      name,
      limit: Math.max(0, Number(document.getElementById('kegCrLim')?.value || 0)),
      dueDays: Math.max(1, Number(document.getElementById('kegCrDays')?.value || 15)),
      phone: (document.getElementById('kegCrPhone')?.value || '').trim(),
      manualBal: Math.max(0, Number(document.getElementById('kegCrBal')?.value || 0))
    };
    const idx = state.erp.creditRules.findIndex((r) => r.name === name);
    if (idx >= 0) state.erp.creditRules[idx] = rule;
    else state.erp.creditRules.unshift(rule);
    addAudit('CREDIT_LIMIT_SET', name, `${sMoney(rule.limit)} (${rule.dueDays}d)`);
    saveState(); closeModal(); renderView(); showToast(L('የዱቤ ገደቡ ተቀምጧል', 'Credit limit saved'));
  }

  function sendCreditReminder(name, balance, phone) {
    const org = state.orgName || 'ኮራ ስቶክ';
    const txt = `ሰላም ${name}፣ ከ${org} የወሰዱት ቀሪ የዱቤ ሂሳብ ${sMoney(balance)} መሆኑን በትህትና እናስታውሳለን። ሲከፍሉ የባንክ ደረሰኝ ቁጥሩን (FT) ይላኩልን። እናመሰግናለን!`;
    const clean = String(phone || '').replace(/[^\d]/g, '').replace(/^0/, '251');
    if (clean) window.open(`https://wa.me/${clean}?text=${encodeURIComponent(txt)}`, '_blank');
    else if (navigator.clipboard) { navigator.clipboard.writeText(txt); showToast(L('መልእክቱ ተቀድቷል — ቴሌግራም ላይ ይለጥፉ', 'Copied reminder text')); }
  }

  // ===========================================================================
  // 3. 🔐 ባለ ሁለት PIN የፈረቃ ርክክብ + የፓድ ቁጥር ኦዲት (Voided Leaves & Gaps)
  // ===========================================================================
  function detectPadGaps() {
    const groups = {};
    const allDocs = [
      ...(state.warehouseLedger || []).map((x) => x.docNo),
      ...(state.erp.voidLeaves || []).map((x) => x.docNo)
    ].filter(Boolean);

    allDocs.forEach((d) => {
      const m = String(d).trim().match(/^(.*?)(\d+)$/);
      if (!m) return;
      const pfx = m[1], num = Number(m[2]), pad = m[2].length;
      if (!groups[pfx]) groups[pfx] = { pfx, pad, nums: new Set() };
      groups[pfx].nums.add(num);
    });

    const missing = [];
    Object.values(groups).forEach((g) => {
      const arr = Array.from(g.nums).sort((a, b) => a - b);
      if (arr.length < 2) return;
      const min = arr[0], max = arr[arr.length - 1];
      if (max - min > 120) return;
      for (let n = min + 1; n < max; n++) {
        if (!g.nums.has(n)) missing.push(`${g.pfx}${String(n).padStart(g.pad, '0')}`);
      }
    });
    return missing.slice(0, 20);
  }

  function renderShiftAndPadTab(root) {
    const td = todayIso();
    const todayIn = (state.warehouseLedger || []).filter((x) => x.date === td).reduce((a, x) => a + Number(x.inQty || 0), 0);
    const todayOut = (state.warehouseLedger || []).filter((x) => x.date === td).reduce((a, x) => a + Number(x.outQty || 0), 0);
    const todaySales = (state.sales || []).filter((x) => (x.date || '').startsWith(td)).reduce((a, x) => a + Number(x.total || 0), 0);
    const gaps = detectPadGaps();

    root.innerHTML = `
      <div class="card">
        <div class="card-row">
          <b style="color:var(--teal);">🔐 ${sEsc(L('ባለ ሁለት PIN የፈረቃ ርክክብ', 'Dual-PIN Shift Handover'))}</b>
          <button type="button" class="btn teal sm" onclick="KoraErp.openHandoverModal()">✍️ ${sEsc(L('ፈረቃ አስረክብ', 'Sign Handover'))}</button>
        </div>
        <div class="kpi-grid">
          <div class="kpi"><span class="kpi-lbl">${sEsc(L('የዛሬ ሽያጭ', 'Today Sales'))}</span><span class="kpi-val" style="font-size:13px;">${sMoney(todaySales)}</span></div>
          <div class="kpi emerald"><span class="kpi-lbl">${sEsc(L('ገቢ / ወጪ ዕቃ', 'IN / OUT'))}</span><span class="kpi-val" style="font-size:13px;">+${sNum(todayIn)} / -${sNum(todayOut)}</span></div>
        </div>
        ${(state.erp.handovers || []).slice(0, 5).map((h) => `
          <div class="sub-card">
            <div class="card-row"><b style="font-size:11.5px;color:#5eead4;">✓ ${sEsc(h.fromUser)} ➔ ${sEsc(h.toUser)}</b><span style="font-size:10px;color:var(--muted);">${sEsc(h.ts)}</span></div>
            <div style="font-size:11px;color:var(--muted);">${sEsc(L('በእጅ ገንዘብ', 'Cash'))}: <b>${sMoney(h.cashHanded)}</b> · ${sEsc(L('ገቢ/ወጪ', 'IN/OUT'))}: +${sNum(h.inQty)}/-${sNum(h.outQty)}</div>
            ${h.note ? `<div style="font-size:10.5px;">📝 ${sEsc(h.note)}</div>` : ''}
          </div>`).join('') || `<div style="font-size:11px;color:var(--muted);text-align:center;padding:6px;">${sEsc(L('የተፈረመ የፈረቃ ርክክብ የለም', 'No handovers signed yet'))}</div>`}
      </div>

      <div class="card">
        <div class="card-row">
          <b style="color:var(--amber);">📑 ${sEsc(L('የፓድ ቁጥር ኦዲት እና የተሰረዙ ቅጠሎች', 'Pad Sequence & Voided Leaves'))}</b>
          <button type="button" class="btn amber sm" onclick="KoraErp.openVoidLeafModal('')">+ ${sEsc(L('የተቀደደ/የተሰረዘ ቅጠል', 'Log Void Leaf'))}</button>
        </div>
        ${gaps.length ? `
          <div class="keg-alert">
            ⚠️ <b>${sEsc(L('ያልተመዘገቡ (የዘለሉ) የፓድ ቁጥሮች ተገኝተዋል፦', 'Missing Pad Numbers Detected:'))}</b><br>
            <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:5px;">
              ${gaps.map((g) => `<button type="button" class="pill rose" style="border:none;cursor:pointer;" onclick="KoraErp.openVoidLeafModal('${sEsc(g)}')">${sEsc(g)} (+${L('መዝግብ', 'Void')})</button>`).join('')}
            </div>
          </div>` : `<div class="keg-ok">✅ ${sEsc(L('ሁሉም የፓድ ቁጥሮች በተከታታይ ቅደም ተከተል ናቸው', 'All pad numbers are sequential — no gaps'))}</div>`}
        ${(state.erp.voidLeaves || []).map((v) => `
          <div class="sub-card">
            <div class="card-row">
              <div style="flex:1;min-width:0;">
                <b style="color:#fb7185;font-family:ui-monospace,monospace;">VOID · ${sEsc(v.docNo)}</b>
                <div style="font-size:11px;">${sEsc(v.reason)}</div>
                <div style="font-size:10px;color:var(--muted);">📅 ${sEsc(v.date)} · 👤 ${sEsc(v.by)}</div>
              </div>
              ${v.photo ? `<img class="keg-thumb" src="${v.photo}" onclick="KoraErp.viewPhoto('${v.photo}','VOID ${sEsc(v.docNo)}')">` : ''}
            </div>
          </div>`).join('')}
      </div>`;
  }

  function openHandoverModal() {
    const users = (state.users || []).length ? state.users : [{ name: 'Admin', pin: '' }];
    const opts = users.map((u) => `<option value="${sEsc(u.name)}">${sEsc(u.name)} (${sEsc(u.role || '-')})</option>`).join('');
    openModal(`🔐 ${L('ባለ ሁለት PIN የፈረቃ ርክክብ', 'Dual-PIN Shift Handover')}`, `
      <div class="sub-card">
        <div class="grid-2">
          <div><label class="lbl">${sEsc(L('አስረካቢ (Outgoing)', 'Outgoing Staff'))}</label><select id="kegHoFrom" class="sel">${opts}</select></div>
          <div><label class="lbl">${sEsc(L('የአስረካቢ PIN', 'Outgoing PIN'))}</label><input id="kegHoPin1" type="password" inputmode="numeric" class="inp mono" placeholder="****"></div>
        </div>
        <div class="grid-2" style="margin-top:6px;">
          <div><label class="lbl">${sEsc(L('ተረካቢ (Incoming)', 'Incoming Staff'))}</label><select id="kegHoTo" class="sel">${opts}</select></div>
          <div><label class="lbl">${sEsc(L('የተረካቢ PIN', 'Incoming PIN'))}</label><input id="kegHoPin2" type="password" inputmode="numeric" class="inp mono" placeholder="****"></div>
        </div>
      </div>
      <div class="grid-2">
        <div><label class="lbl">${sEsc(L('በእጅ የተረከበ ገንዘብ (ብር)', 'Cash Handed Over'))}</label><input id="kegHoCash" type="number" min="0" class="inp mono" value="0"></div>
        <div><label class="lbl">${sEsc(L('ማስታወሻ / ጉድለት ካለ', 'Handover Note'))}</label><input id="kegHoNote" class="inp" placeholder="ሁሉም ትክክል ነው"></div>
      </div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${sEsc(L('ተው', 'Cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraErp.confirmHandover()">🔐 ${sEsc(L('ፈርመህ ቆልፍ', 'Verify & Lock'))}</button>`);
  }

  function confirmHandover() {
    const fromName = document.getElementById('kegHoFrom')?.value || '';
    const toName = document.getElementById('kegHoTo')?.value || '';
    const pin1 = (document.getElementById('kegHoPin1')?.value || '').trim();
    const pin2 = (document.getElementById('kegHoPin2')?.value || '').trim();
    const users = state.users || [];

    if (users.length > 1 && fromName === toName) {
      showToast(L('አስረካቢና ተረካቢ የተለያዩ ሠራተኞች መሆን አለባቸው', 'Outgoing and incoming must be different'), true);
      return;
    }
    const u1 = users.find((u) => u.name === fromName);
    const u2 = users.find((u) => u.name === toName);
    if ((u1?.pin && String(u1.pin) !== pin1) || (!u1?.pin && pin1.length < 3)) {
      showToast(L('የአስረካቢ PIN ትክክል አይደለም', 'Invalid Outgoing PIN'), true);
      return;
    }
    if ((u2?.pin && String(u2.pin) !== pin2) || (!u2?.pin && pin2.length < 3)) {
      showToast(L('የተረካቢ PIN ትክክል አይደለም', 'Invalid Incoming PIN'), true);
      return;
    }
    const td = todayIso();
    const inQty = (state.warehouseLedger || []).filter((x) => x.date === td).reduce((a, x) => a + Number(x.inQty || 0), 0);
    const outQty = (state.warehouseLedger || []).filter((x) => x.date === td).reduce((a, x) => a + Number(x.outQty || 0), 0);
    const cashHanded = Math.max(0, Number(document.getElementById('kegHoCash')?.value || 0));
    const note = (document.getElementById('kegHoNote')?.value || '').trim();

    state.erp.handovers.unshift({
      id: 'ho_' + Date.now(), fromUser: fromName, toUser: toName,
      cashHanded, inQty, outQty, note, ts: new Date().toLocaleString()
    });
    addAudit('SHIFT_HANDOVER', `${fromName} -> ${toName}`, `Cash: ${sMoney(cashHanded)}, IN:+${inQty}, OUT:-${outQty}`);
    saveState(); closeModal(); renderView(); showToast(L('የፈረቃ ርክክቡ በ2 PIN ተቆልፏል!', 'Shift handover signed!'));
  }

  function openVoidLeafModal(prefill) {
    draftPhoto = '';
    openModal(`📑 ${L('የተሰረዘ / የተቀደደ የፓድ ቅጠል መዝግብ', 'Log Voided Pad Leaf')}`, `
      <input id="kegVdDoc" class="inp mono" value="${sEsc(prefill || '')}" placeholder="${sEsc(L('የፓድ ቁጥር (ለምሳሌ WH1-0102)', 'Pad Doc No'))}">
      <input id="kegVdReason" class="inp" placeholder="${sEsc(L('ምክንያት (የተሳሳተ ጽሁፍ / ተቀደደ / ተበላሸ)', 'Reason (mistake / torn)'))}">
      <label class="btn muted sm" style="text-align:center;">📷 ${sEsc(L('የተሰረዘውን ወረቀት ፎቶ አንሳ', 'Photo of Voided Leaf'))}<input type="file" accept="image/*" capture="environment" style="display:none;" onchange="KoraErp.readPhoto(this)"></label>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${sEsc(L('ተው', 'Cancel'))}</button>
      <button type="button" class="btn danger" onclick="KoraErp.saveVoidLeaf()">${sEsc(L('እንደ ተሰረዘ መዝግብ', 'Mark Void'))}</button>`);
  }

  function saveVoidLeaf() {
    const docNo = (document.getElementById('kegVdDoc')?.value || '').trim();
    const reason = (document.getElementById('kegVdReason')?.value || '').trim();
    if (!docNo || !reason) { showToast(L('ቁጥሩንና ምክንያቱን ያስገቡ', 'Enter doc no and reason'), true); return; }
    const u = typeof curUser === 'function' ? curUser() : { name: 'User' };
    state.erp.voidLeaves.unshift({ id: 'vd_' + Date.now(), docNo, reason, photo: draftPhoto, date: todayIso(), by: u.name || '-' });
    addAudit('PAD_VOID_LEAF', docNo, reason);
    saveState(); closeModal(); renderView(); showToast(L('የተሰረዘው ቅጠል ተመዝግቧል', 'Voided leaf recorded'));
  }

  // ===========================================================================
  // 4. 📉 የዕቃ ማለቂያ ትንበያ + Dead Stock + የተበላሹ/ቁራጭ ዕቃዎች
  // ===========================================================================
  function computeForecast() {
    const cutoff = Date.now() - 30 * 86400000;
    const outMap = {};
    (state.warehouseLedger || []).forEach((w) => {
      const ts = new Date(w.date || Date.now()).getTime();
      if (ts >= cutoff && Number(w.outQty || 0) > 0) {
        outMap[w.itemId] = (outMap[w.itemId] || 0) + Number(w.outQty || 0);
      }
    });
    const urgent = [], dead = [];
    (state.inventory || []).forEach((it) => {
      const stk = typeof getItemStock === 'function' ? getItemStock(it, state.branchScope || 'all') : Number(it.stock || 0);
      const out30 = outMap[it.id] || 0;
      const daily = out30 / 30;
      if (daily > 0 && stk > 0) {
        const daysLeft = Math.round(stk / daily);
        if (daysLeft <= 14) urgent.push({ it, stk, daily: daily.toFixed(1), daysLeft });
      } else if (stk > 0 && out30 === 0) {
        dead.push({ it, stk });
      }
    });
    urgent.sort((a, b) => a.daysLeft - b.daysLeft);
    return { urgent, dead };
  }

  function renderStockHealthTab(root) {
    const { urgent, dead } = computeForecast();
    const dmgs = state.erp.damages || [];
    root.innerHTML = `
      <div class="card">
        <div class="card-row"><b style="color:var(--amber);">📉 ${sEsc(L('በቅርብ የሚያልቁ ዕቃዎች ትንበያ (≤14 ቀን)', 'Stockout Forecast (≤14 Days)'))}</b><span class="pill amber">${urgent.length}</span></div>
        ${urgent.map((u) => `
          <div class="sub-card">
            <div class="card-row">
              <b>${sEsc(u.it.name)}</b>
              <span class="pill ${u.daysLeft <= 5 ? 'rose' : 'amber'}">${sEsc(L(`በ${u.daysLeft} ቀን ያልቃል`, `${u.daysLeft}d left`))}</span>
            </div>
            <div style="font-size:11px;color:var(--muted);">${sEsc(L('ቀሪ ስቶክ', 'Stock'))}: <b>${sNum(u.stk)}</b> · ${sEsc(L('ዕለታዊ ፍጆታ', 'Daily avg'))}: ${u.daily}/ቀን</div>
          </div>`).join('') || `<div class="keg-ok">✅ ${sEsc(L('በሚቀጥሉት 14 ቀናት ውስጥ የሚያልቅ አስቸኳይ ዕቃ የለም', 'No urgent stockouts forecasted'))}</div>`}
      </div>

      <div class="card">
        <div class="card-row"><b style="color:var(--muted);">🧊 ${sEsc(L('ለ30 ቀን ያልተንቀሳቀሱ ዕቃዎች (Dead Stock)', 'Dead Stock (0 Outflow in 30d)'))}</b><span class="pill">${dead.length}</span></div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;">
          ${dead.slice(0, 15).map((d) => `<span class="pill">${sEsc(d.it.name)} (${sNum(d.stk)})</span>`).join('') || `<span style="font-size:11px;color:var(--muted);">${sEsc(L('ሁሉም ዕቃዎች በእንቅስቃሴ ላይ ናቸው', 'All stock is moving'))}</span>`}
        </div>
      </div>

      <div class="card">
        <div class="card-row">
          <b style="color:var(--rose);">🧱 ${sEsc(L('የተበላሹ እና ቁራጭ ዕቃዎች መዝገብ', 'Damaged & Scrap Log'))}</b>
          <button type="button" class="btn danger sm" onclick="KoraErp.openDamageModal()">+ ${sEsc(L('ጉዳት መዝግብ', 'Log Damage'))}</button>
        </div>
        ${dmgs.map((d) => `
          <div class="sub-card">
            <div class="card-row">
              <div style="flex:1;min-width:0;">
                <b>${sEsc(d.itemName)} · <span style="color:#fb7185;">-${sNum(d.qty)}</span></b>
                <div style="font-size:11px;color:var(--muted);">${sEsc(d.reason)} · 🏢 ${sEsc(d.branch)}</div>
                <div style="font-size:10px;color:var(--muted);">📅 ${sEsc(d.date)} · 👤 ${sEsc(d.by)}</div>
              </div>
              ${d.photo ? `<img class="keg-thumb" src="${d.photo}" onclick="KoraErp.viewPhoto('${d.photo}','${sEsc(d.itemName)}')">` : ''}
            </div>
          </div>`).join('') || `<div style="font-size:11px;color:var(--muted);text-align:center;padding:8px;">${sEsc(L('የተመዘገበ የተበላሸ/ቁራጭ ዕቃ የለም', 'No damage records'))}</div>`}
      </div>`;
  }

  function openDamageModal() {
    draftPhoto = '';
    const invOpts = (state.inventory || []).map((it) => `<option value="${sEsc(it.id)}">${sEsc(it.name)}</option>`).join('');
    const brOpts = (state.branches || []).map((b) => `<option value="${sEsc(b.name)}">${sEsc(b.name)}</option>`).join('');
    openModal(`🧱 ${L('የተበላሸ / ቁራጭ ዕቃ መዝግብ', 'Log Damaged / Scrap Stock')}`, `
      <select id="kegDmItem" class="sel">${invOpts}</select>
      <div class="grid-2">
        <select id="kegDmBr" class="sel">${brOpts}</select>
        <input id="kegDmQty" type="number" min="1" class="inp mono" placeholder="${sEsc(L('ብዛት', 'Qty'))}">
      </div>
      <select id="kegDmReason" class="sel">
        <option value="የተበላሸ / የተሰበረ">${sEsc(L('የተበላሸ / የተሰበረ', 'Damaged / Broken'))}</option>
        <option value="የዛገ / በዝናብ የተጎዳ">${sEsc(L('የዛገ / በዝናብ የተጎዳ', 'Rusted / Weather'))}</option>
        <option value="ቁራጭ / ለማሳያ የወጣ">${sEsc(L('ቁራጭ / ለማሳያ የወጣ', 'Scrap / Sample'))}</option>
        <option value="ጊዜው ያለፈበት">${sEsc(L('ጊዜው ያለፈበት', 'Expired'))}</option>
      </select>
      <label class="btn muted sm" style="text-align:center;">📷 ${sEsc(L('የጉዳቱን ፎቶ አንሳ', 'Attach Photo Proof'))}<input type="file" accept="image/*" capture="environment" style="display:none;" onchange="KoraErp.readPhoto(this)"></label>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${sEsc(L('ተው', 'Cancel'))}</button>
      <button type="button" class="btn danger" onclick="KoraErp.saveDamage()">${sEsc(L('ከስቶክ ቀንሰህ መዝግብ', 'Deduct & Save'))}</button>`);
  }

  function saveDamage() {
    const id = document.getElementById('kegDmItem')?.value;
    const br = document.getElementById('kegDmBr')?.value || state.branches?.[0]?.name || '-';
    const qty = Math.max(0, Number(document.getElementById('kegDmQty')?.value || 0));
    const reason = document.getElementById('kegDmReason')?.value || '-';
    const it = (state.inventory || []).find((x) => String(x.id) === String(id));
    if (!it || !(qty > 0)) { showToast(L('ዕቃ እና ብዛት ያስገቡ', 'Enter item and qty'), true); return; }

    if (it.branchStock) {
      const op = Number(it.branchStock[br] || 0);
      it.branchStock[br] = Math.max(0, op - qty);
      if (Array.isArray(state.warehouseLedger)) {
        state.warehouseLedger.push({
          id: Date.now(), docNo: 'DMG-' + String(Date.now()).slice(-4), type: 'OUT', status: 'valid',
          branch: br, itemId: it.id, itemName: it.name, unit: it.unit || '', loc: it.zoneCode || '-',
          openBal: op, inQty: 0, outQty: qty, endBal: it.branchStock[br],
          party: reason, ref: 'Damage', date: todayIso()
        });
      }
    }
    const u = typeof curUser === 'function' ? curUser() : { name: 'User' };
    state.erp.damages.unshift({ id: 'dm_' + Date.now(), itemId: it.id, itemName: it.name, branch: br, qty, reason, photo: draftPhoto, date: todayIso(), by: u.name || '-' });
    addAudit('STOCK_DAMAGE', it.name, `-${qty} (${br}) · ${reason}`);
    saveState(); closeModal(); renderAll(); showToast(L('ጉዳቱ ተመዝግቦ ከስቶክ ተቀንሷል', 'Damage logged & deducted'));
  }

  // ===========================================================================
  // 5. 📊 የዕለቱ ማጠቃለያ ሪፖርት + 58mm/80mm/A4 ህትመት + Shelf QR + ሙሉ ምትኬ
  // ===========================================================================
  function buildDailyDigestText() {
    const td = todayIso();
    const org = state.orgName || 'ኮራ ስቶክ';
    const sales = (state.sales || []).filter((x) => (x.date || '').startsWith(td));
    const salesTot = sales.reduce((a, x) => a + Number(x.total || 0), 0);
    const ftToday = state.erp.ftRefs.filter((x) => x.date === td);
    const ftTot = ftToday.reduce((a, x) => a + Number(x.amount || 0), 0);
    const wIn = (state.warehouseLedger || []).filter((x) => x.date === td).reduce((a, x) => a + Number(x.inQty || 0), 0);
    const wOut = (state.warehouseLedger || []).filter((x) => x.date === td).reduce((a, x) => a + Number(x.outQty || 0), 0);
    const dmgs = state.erp.damages.filter((x) => x.date === td).reduce((a, x) => a + Number(x.qty || 0), 0);
    const voids = state.erp.voidLeaves.filter((x) => x.date === td).length;
    const gaps = detectPadGaps();
    const { urgent } = computeForecast();

    return [
      `📊 ${org} — የዕለቱ ማጠቃለያ (${td})`,
      `━━━━━━━━━━━━━━━━━━`,
      `💰 የዛሬ ሽያጭ: ${sMoney(salesTot)} (${sales.length} ሰነድ)`,
      `💳 የተረጋገጠ FT/ባንክ: ${sMoney(ftTot)} (${ftToday.length} ደረሰኝ)`,
      `📦 መጋዘን እንቅስቃሴ: +${sNum(wIn)} ገቢ | -${sNum(wOut)} ወጪ`,
      `🧱 የተበላሸ/ቁራጭ: ${sNum(dmgs)} | የተሰረዘ ቅጠል: ${voids}`,
      gaps.length ? `⚠️ የዘለሉ የፓድ ቁጥሮች: ${gaps.slice(0, 5).join(', ')}` : `✅ የፓድ ቁጥሮች: ምንም ክፍተት የለም`,
      urgent.length ? `📉 በቅርብ የሚያልቁ: ${urgent.slice(0, 3).map((u) => `${u.it.name} (${u.daysLeft}ቀ)`).join('፣ ')}` : `✅ አስቸኳይ የስቶክ እጥረት የለም`
    ].join('\n');
  }

  function renderDigestAndToolsTab(root) {
    const digest = buildDailyDigestText();
    const inv = (state.inventory || []).slice(0, 12);

    root.innerHTML = `
      <div class="card">
        <div class="card-row">
          <b style="color:var(--teal);">📊 ${sEsc(L('የዕለቱ የባለቤት ማጠቃለያ ሪፖርት', 'End-of-Day Owner Digest'))}</b>
          <select class="sel" style="width:92px;height:27px;font-size:11px;" onchange="state.erp.printSize=this.value;saveState();">
            ${['58mm', '80mm', 'A5', 'A4'].map((sz) => `<option value="${sz}" ${state.erp.printSize === sz ? 'selected' : ''}>🖨️ ${sz}</option>`).join('')}
          </select>
        </div>
        <div class="keg-pre">${sEsc(digest)}</div>
        <div class="grid-2" style="margin-top:4px;">
          <input id="kegTgBot" class="inp sm mono" value="${sEsc(state.erp.tgBot)}" placeholder="Telegram Bot Token" onchange="state.erp.tgBot=this.value.trim();saveState();">
          <input id="kegTgChat" class="inp sm mono" value="${sEsc(state.erp.tgChat)}" placeholder="Telegram Chat ID" onchange="state.erp.tgChat=this.value.trim();saveState();">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;margin-top:4px;">
          <button type="button" class="btn teal sm" onclick="KoraErp.sendTelegramDigest()">✈️ ${sEsc(L('ቴሌግራም Bot', 'Send Bot'))}</button>
          <button type="button" class="btn muted sm" onclick="KoraErp.shareDigestWa()">💬 WhatsApp</button>
          <button type="button" class="btn primary sm" onclick="KoraErp.printDigest()">🖨️ ${sEsc(L('አትም', 'Print'))}</button>
        </div>
      </div>

      <div class="card">
        <div class="card-row">
          <b style="color:var(--teal);">🏷️ ${sEsc(L('የመደርደሪያ QR መለያዎች (Shelf QR)', 'Shelf QR Labels'))}</b>
          <button type="button" class="btn teal sm" onclick="KoraErp.printShelfQrs()">🖨️ ${sEsc(L('QR አትም', 'Print QRs'))}</button>
        </div>
        <div class="keg-qr-grid">
          ${inv.map((it) => `
            <div class="keg-qr-card">
              ${buildQrSvg(`KORA-ITEM|${it.id}|${it.zoneCode || 'A1'}`)}
              <b style="font-size:11px;line-height:1.2;">${sEsc(it.name)}</b>
              <span style="font-size:9.5px;color:var(--teal);font-family:ui-monospace,monospace;">📍 ${sEsc(it.zoneCode || 'A-01')}</span>
            </div>`).join('')}
        </div>
      </div>

      <div class="card">
        <b style="color:var(--primary);">💾 ${sEsc(L('ሙሉ የሲስተም ምትኬ (Backup & Restore)', 'Full Backup & Restore'))}</b>
        <div class="grid-2" style="margin-top:4px;">
          <button type="button" class="btn teal sm" onclick="KoraErp.exportBackup()">⬇️ ${sEsc(L('ምትኬ አውርድ (JSON)', 'Export Backup'))}</button>
          <label class="btn muted sm" style="text-align:center;">⬆️ ${sEsc(L('ምትኬ መልስ (Restore)', 'Restore JSON'))}<input type="file" accept=".json" style="display:none;" onchange="KoraErp.importBackup(this)"></label>
        </div>
      </div>`;
  }

  async function sendTelegramDigest() {
    const bot = (state.erp.tgBot || '').trim();
    const chat = (state.erp.tgChat || '').trim();
    const text = buildDailyDigestText();
    if (!bot || !chat) {
      showToast(L('መጀመሪያ የራስህን Telegram Bot Token እና Chat ID አስገባ', 'Enter your Bot Token & Chat ID first'), true);
      return;
    }
    try {
      const res = await fetch(`https://api.telegram.org/bot${encodeURIComponent(bot)}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chat, text })
      });
      if (!res.ok) throw 0;
      addAudit('TG_DIGEST_SENT', todayIso(), 'Owner daily digest sent');
      saveState();
      showToast(L('✈️ የዕለቱ ማጠቃለያ ወደ ቴሌግራም ተልኳል!', 'Digest sent to Telegram!'));
    } catch {
      showToast(L('መላክ አልተቻለም — Token/Chat ID እና ኢንተርኔት አረጋግጥ', 'Send failed — check Token/Chat ID'), true);
    }
  }

  function shareDigestWa() {
    window.open(`https://wa.me/?text=${encodeURIComponent(buildDailyDigestText())}`, '_blank');
  }

  function openPrintWindow(title, bodyHtml) {
    const sz = state.erp.printSize || '80mm';
    const wCss = (sz === '58mm' || sz === '80mm') ? `width:${sz};margin:0 auto;` : 'width:100%;max-width:720px;margin:0 auto;';
    const w = window.open('', '_blank');
    if (!w) { showToast(L('Pop-up ተከልክሏል', 'Pop-up blocked'), true); return; }
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${sEsc(title)}</title><style>@page{size:${sz === '58mm' || sz === '80mm' ? sz + ' auto' : sz};margin:4mm;}body{font-family:system-ui,sans-serif;color:#000;background:#fff;${wCss}font-size:12px;}pre{white-space:pre-wrap;font-family:ui-monospace,monospace;font-size:11px;}.qgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;}.qcard{border:1px dashed #333;border-radius:6px;padding:6px;text-align:center;page-break-inside:avoid;}</style></head><body>${bodyHtml}<script>window.onload=()=>setTimeout(()=>window.print(),250);</script></body></html>`);
    w.document.close();
  }

  function printDigest() {
    openPrintWindow('Kora Digest', `<pre>${sEsc(buildDailyDigestText())}</pre>`);
  }

  function printShelfQrs() {
    const cards = (state.inventory || []).map((it) => `
      <div class="qcard">
        ${buildQrSvg(`KORA-ITEM|${it.id}|${it.zoneCode || 'A1'}`, '')}
        <div style="font-weight:800;font-size:11px;margin-top:4px;">${sEsc(it.name)}</div>
        <div style="font-size:10px;">${sEsc(it.zoneCode || 'A-01')}</div>
      </div>`).join('');
    openPrintWindow('Shelf QR Labels', `<div class="qgrid">${cards}</div>`);
  }

  function exportBackup() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `korastock-backup-${todayIso()}.json`; a.click();
    URL.revokeObjectURL(url);
    showToast(L('ሙሉ ምትኬ ወርዷል!', 'Full backup exported!'));
  }

  function importBackup(inp) {
    const f = inp.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const parsed = JSON.parse(String(r.result || '{}'));
        if (!parsed || !Array.isArray(parsed.inventory)) throw 0;
        Object.assign(state, parsed);
        saveState(); renderAll();
        showToast(L('ምትኬው በተሳካ ሁኔታ ተመልሷል!', 'Backup restored!'));
      } catch {
        showToast(L('ትክክለኛ የኮራ ስቶክ ምትኬ ፋይል አይደለም', 'Invalid backup JSON'), true);
      }
    };
    r.readAsText(f);
  }

  // ===========================================================================
  // 6. ዋናው ገጽ መቀያየሪያ እና ውህደት (Hooks)
  // ===========================================================================
  const ERP_TABS = [
    { k: 'ft',     am: '💳 FT/ባንክ',   en: '💳 Bank FT' },
    { k: 'credit', am: '🧾 ዱቤ ገደብ',   en: '🧾 Credit' },
    { k: 'shift',  am: '🔐 ፈረቃ/ፓድ',  en: '🔐 Shift/Pad' },
    { k: 'stock',  am: '📉 ትንበያ/ጉዳት', en: '📉 Forecast' },
    { k: 'digest', am: '📊 ሪፖርት/QR',  en: '📊 Digest/QR' }
  ];

  function renderErpPage(root) {
    ensureErpState();
    const sub = state.erp.subTab || 'ft';
    if (sub === 'credit') renderCreditTab(root);
    else if (sub === 'shift') renderShiftAndPadTab(root);
    else if (sub === 'stock') renderStockHealthTab(root);
    else if (sub === 'digest') renderDigestAndToolsTab(root);
    else renderFtTab(root);
  }

  function installErpHooks() {
    if (!hasState() || global._kegHooksDone) return;
    global._kegHooksDone = true;
    injectErpCss();
    ensureErpState();

    const _origSub = global.renderSubTabs;
    global.renderSubTabs = function () {
      if (state.activeMainTab === 'setup:erpguard') {
        ensureErpState();
        document.getElementById('subTabsBar').innerHTML = ERP_TABS.map((t) =>
          `<button type="button" class="subtab ${state.erp.subTab === t.k ? 'active' : ''}" onclick="KoraErp.setTab('${t.k}')">${sEsc(isAm() ? t.am : t.en)}</button>`
        ).join('');
        return;
      }
      if (typeof _origSub === 'function') _origSub();
    };

    const _origSetup = global.renderSetupPage;
    global.renderSetupPage = function (page) {
      const root = document.getElementById('viewRoot');
      if (page === 'erpguard' && root) { renderErpPage(root); return; }
      if (typeof _origSetup === 'function') _origSetup(page);
    };

    const _origDrawer = global.renderDrawer;
    global.renderDrawer = function () {
      if (typeof _origDrawer === 'function') _origDrawer();
      const nav = document.getElementById('drawerNav');
      if (nav && !nav.querySelector('[data-keg-nav]')) {
        nav.insertAdjacentHTML('afterbegin', `
          <button type="button" data-keg-nav="1" class="drawer-item ${state.activeMainTab === 'setup:erpguard' ? 'active' : ''}" onclick="vib(14);openSetup('erpguard')">
            <span>🛡️ ${sEsc(L('ቁጥጥር እና ሪፖርት (ERP)', 'ERP Control & Digest'))}</span>
          </button>`);
      }
    };

    if (state.loggedIn) renderAll();
  }

  global.KoraErp = {
    setTab(k) { state.erp.subTab = k; saveState(); renderSubTabs(); renderView(); },
    setFtSearch(v) { ftSearch = v; renderView(); },
    readPhoto: readPhotoInput, viewPhoto,
    openFtModal, checkFtLive, saveFt,
    openCreditModal, saveCreditRule, sendCreditReminder,
    openHandoverModal, confirmHandover, openVoidLeafModal, saveVoidLeaf,
    openDamageModal, saveDamage,
    sendTelegramDigest, shareDigestWa, printDigest, printShelfQrs,
    exportBackup, importBackup
  };

  installErpHooks();
  document.addEventListener('DOMContentLoaded', installErpHooks);
  setTimeout(installErpHooks, 450);
})(window);
