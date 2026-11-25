// =============================================================================
// ኮራ ስቶክ — Next-Gen Warehouse & Trade Suite (kora-nextgen.js — v25)
// • Interactive Photo Dot-Counter (Zoom, Undo, Annotated Export, Send to Tally)
// • Weighted Average Cost (WAC) Purchase Log & Seller/Broker Commission Tracker
// • Web Bluetooth 58mm/80mm ESC/POS Thermal Printer + Print Fallback
// • Branch GPS Geofenced Staff Check-In / Check-Out
// • Configurable Multi-Phone Supabase Cloud Sync & Snapshot Push/Pull
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

  function addAudit(action, ref, details) {
    if (!hasState()) return;
    if (!Array.isArray(state.auditLogs)) state.auditLogs = [];
    const u = typeof curUser === 'function' ? curUser() : { name: 'User', role: '-' };
    state.auditLogs.unshift({
      id: 'aud_' + Date.now(), action, ref: ref || '-', details: details || '',
      actor: u.name || '-', role: u.role || '-', ts: new Date().toLocaleString()
    });
    if (state.auditLogs.length > 400) state.auditLogs.length = 400;
  }

  function ensureNgState() {
    if (!hasState()) return;
    if (!state.nextgen || typeof state.nextgen !== 'object') state.nextgen = {};
    const ng = state.nextgen;
    if (!ng.subTab) ng.subTab = 'photodot';
    if (!Array.isArray(ng.costLogs)) ng.costLogs = [];
    if (!Array.isArray(ng.commissions)) ng.commissions = [];
    if (!Array.isArray(ng.checkIns)) ng.checkIns = [];
    if (!ng.geoRadiusM) ng.geoRadiusM = 200;
    if (!ng.printerWidth) ng.printerWidth = 32; // 32 chars = 58mm, 48 chars = 80mm
    if (!ng.sync) {
      ng.sync = { url: '', anonKey: '', roomCode: 'kora-main', auto: false, lastSync: '', lastStatus: '' };
    }
  }

  function injectNgCss() {
    if (document.getElementById('koraNgCss')) return;
    const st = document.createElement('style');
    st.id = 'koraNgCss';
    st.textContent = `
      .kng-canvas-wrap {
        width: 100%; max-height: 52vh; overflow: auto;
        border: 1.5px solid var(--teal); border-radius: 12px;
        background: #020617; position: relative; touch-action: pan-x pan-y;
      }
      .kng-canvas-wrap canvas { display: block; margin: 0 auto; cursor: crosshair; }
      .kng-dot-tools { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; }
      .kng-chip-row { display: flex; gap: 5px; flex-wrap: wrap; align-items: center; }
      .kng-badge-in { background: rgba(16,185,129,0.2); border: 1px solid var(--emerald); color: #6ee7b7; border-radius: 8px; padding: 2px 7px; font-size: 10.5px; font-weight: 800; }
      .kng-badge-out { background: rgba(239,68,68,0.2); border: 1px solid var(--rose); color: #fca5a5; border-radius: 8px; padding: 2px 7px; font-size: 10.5px; font-weight: 800; }
      .kng-bt-box { background: #070d19; border: 1px dashed var(--primary); border-radius: 11px; padding: 9px; font-family: ui-monospace, monospace; font-size: 11px; white-space: pre-wrap; color: #e2e8f0; }
    `;
    document.head.appendChild(st);
  }

  // ===========================================================================
  // 1. 🎯 በፎቶ ላይ ነጥብ እየነኩ የሚቆጥር የብረት/ቱቦ ቆጣሪ (Interactive Photo Dot-Counter)
  // ===========================================================================
  let pdImg = null;
  let pdDots = []; // [{ x: 0..1, y: 0..1 }]
  let pdZoom = 1;
  let pdColor = '#2dd4bf';
  let pdRadius = 11;

  function renderPhotoDotTab(root) {
    root.innerHTML = `
      <div class="card">
        <div class="card-row">
          <b style="color:var(--teal);">🎯 ${sEsc(L('በፎቶ ላይ ነጥብ እየነኩ መቁጠሪያ', 'Interactive Photo Dot-Counter'))}</b>
          <span id="kngPdCount" class="pill teal" style="font-size:13px;font-weight:900;">${pdDots.length}</span>
        </div>

        <div class="kng-dot-tools">
          <label class="btn teal sm">📷 ${sEsc(L('ፎቶ አንሳ / ምረጥ', 'Take / Pick Photo'))}<input type="file" accept="image/*" capture="environment" style="display:none;" onchange="KoraNg.loadPhoto(this)"></label>
          <button type="button" class="btn muted sm" onclick="KoraNg.pdSetZoom(-0.35)">🔍-</button>
          <button type="button" class="btn muted sm" onclick="KoraNg.pdSetZoom(0.35)">🔍+</button>
          <button type="button" class="btn muted sm" onclick="KoraNg.pdCycleColor()">🎨</button>
          <button type="button" class="btn muted sm" onclick="KoraNg.pdUndo()">↩️ ${sEsc(L('መልስ', 'Undo'))}</button>
          <button type="button" class="btn danger sm" onclick="KoraNg.pdClear()">🧹</button>
        </div>

        <div id="kngCanvasWrap" class="kng-canvas-wrap">
          ${pdImg
            ? `<canvas id="kngPdCanvas"></canvas>`
            : `<div style="padding:36px 14px;text-align:center;color:var(--muted);font-size:12px;line-height:1.5;">📷 ${sEsc(L('የተደረደሩ ብረቶችን፣ ቱቦዎችን ወይም ካርቶኖችን ፎቶ አንስተህ እያንዳንዱን ጫፍ በጣት ስትነካ 1, 2, 3... እያለ ይቆጥራል።', 'Take or upload a photo of stacked steel/pipes/cartons, then tap each piece to drop numbered dots.'))}</div>`}
        </div>

        <div class="grid-2" style="margin-top:4px;">
          <button type="button" class="btn muted sm" ${pdImg ? '' : 'disabled'} onclick="KoraNg.pdDownload()">⬇️ ${sEsc(L('ምልክት ያለው ፎቶ አውርድ', 'Save Proof Image'))}</button>
          <button type="button" class="btn teal sm" ${pdDots.length ? '' : 'disabled'} onclick="KoraNg.pdSendToTally()">⚡ ${sEsc(L(`+${pdDots.length} ወደ ቆጠራ ላክ`, `Send +${pdDots.length} to Tally`))}</button>
        </div>
      </div>`;

    if (pdImg) {
      requestAnimationFrame(drawPhotoDotCanvas);
    }
  }

  function loadPhoto(inp) {
    const f = inp.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        pdImg = img;
        pdDots = [];
        pdZoom = 1;
        renderView();
      };
      img.src = r.result;
    };
    r.readAsDataURL(f);
  }

  function drawPhotoDotCanvas() {
    const cv = document.getElementById('kngPdCanvas');
    const wrap = document.getElementById('kngCanvasWrap');
    if (!cv || !wrap || !pdImg) return;

    const baseW = Math.max(260, wrap.clientWidth - 4);
    const scale = (baseW / pdImg.naturalWidth) * pdZoom;
    const w = Math.round(pdImg.naturalWidth * scale);
    const h = Math.round(pdImg.naturalHeight * scale);
    cv.width = w;
    cv.height = h;

    const ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(pdImg, 0, 0, w, h);

    const rad = Math.max(8, Math.round(pdRadius * Math.sqrt(pdZoom)));
    pdDots.forEach((d, idx) => {
      const x = d.x * w;
      const y = d.y * h;
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fillStyle = pdColor;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#060a12';
      ctx.stroke();

      ctx.fillStyle = '#060a12';
      ctx.font = `900 ${Math.max(10, Math.round(rad * 0.95))}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(idx + 1), x, y + 0.5);
    });

    cv.onclick = (e) => {
      const rect = cv.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      if (nx < 0 || nx > 1 || ny < 0 || ny > 1) return;
      // በነባር ነጥብ ላይ ድጋሚ ከተነካ ነጥቡን ማንሳት (Toggle remove)
      const hitIdx = pdDots.findIndex((d) => Math.hypot((d.x - nx) * w, (d.y - ny) * h) <= rad * 1.15);
      if (hitIdx >= 0) pdDots.splice(hitIdx, 1);
      else pdDots.push({ x: nx, y: ny });

      if (navigator.vibrate) navigator.vibrate(14);
      const cntEl = document.getElementById('kngPdCount');
      if (cntEl) cntEl.textContent = String(pdDots.length);
      drawPhotoDotCanvas();
      // የ"ላክ" ቁልፍን ብዛት ማደስ
      const sendBtn = document.querySelector('[onclick*="pdSendToTally"]');
      if (sendBtn) {
        sendBtn.disabled = pdDots.length === 0;
        sendBtn.textContent = `⚡ ${L(`+${pdDots.length} ወደ ቆጠራ ላክ`, `Send +${pdDots.length} to Tally`)}`;
      }
    };
  }

  function pdSendToTally() {
    const qty = pdDots.length;
    if (!(qty > 0)) return;
    if (!state.tally) state.tally = {};
    if (!state.tally.free) state.tally.free = { note: '', target: 0, strokes: [] };
    if (!Array.isArray(state.tally.free.strokes)) state.tally.free.strokes = [];

    // የStroke አይነት ከነባሩ ጋር እንዲጣጣም ማድረግ
    let entry = qty;
    if (typeof sumStrokes === 'function') {
      try {
        if (sumStrokes([{ qty: 5 }]) === 5) entry = { qty, ts: Date.now() };
        else if (sumStrokes([{ v: 5 }]) === 5) entry = { v: qty, ts: Date.now() };
      } catch {}
    }

    // ንቁ የቲኬት ዕቃ ካለ ወደ እሱ፣ ካልሆነ ወደ ነጻ ቆጠራ መላክ
    let sentLabel = L('ነጻ ቆጠራ', 'Free Tally');
    const tk = (state.tally.tickets || []).find((x) => String(x.id) === String(state.tally.activeTicketId));
    const tkItem = tk?.items?.find((x) => String(x.itemId) === String(tk.activeItemId));
    if (tkItem) {
      tkItem.strokes = tkItem.strokes || [];
      tkItem.strokes.push(entry);
      sentLabel = `${tk.docNo || tk.id} · ${tkItem.name}`;
    } else {
      state.tally.free.strokes.push(entry);
      if (!state.tally.free.note) state.tally.free.note = L('የፎቶ ቆጠራ', 'Photo Dot Count');
    }

    addAudit('PHOTO_DOT_COUNT', sentLabel, `+${qty} (Photo dots)`);
    saveState();
    showToast(`✅ +${qty} ${L('ወደ', 'sent to')} ${sentLabel}!`);
    if (typeof switchMainTab === 'function') {
      state.activeSubTab.tally = tkItem ? 'tickets' : 'free';
      switchMainTab('tally');
    }
  }

  function pdDownload() {
    const cv = document.getElementById('kngPdCanvas');
    if (!cv) return;
    const a = document.createElement('a');
    a.href = cv.toDataURL('image/jpeg', 0.9);
    a.download = `kora-count-${pdDots.length}-${todayIso()}.jpg`;
    a.click();
    showToast(L('ምልክት ያለው ፎቶ ወርዷል', 'Annotated image saved'));
  }

  // ===========================================================================
  // 2. 📈 አማካይ የግዢ ዋጋ (WAC) እና የሻጭ/ደላላ ኮሚሽን
  // ===========================================================================
  function renderWacAndCommTab(root) {
    const inv = state.inventory || [];
    const comms = state.nextgen.commissions || [];
    const unpaidComm = comms.filter((c) => !c.paid).reduce((a, c) => a + Number(c.amount || 0), 0);

    root.innerHTML = `
      <div class="card">
        <div class="card-row">
          <b style="color:var(--teal);">📈 ${sEsc(L('ተንቀሳቃሽ አማካይ የግዢ ዋጋ (WAC)', 'Weighted Average Cost (WAC)'))}</b>
          <button type="button" class="btn teal sm" onclick="KoraNg.openWacModal()">+ ${sEsc(L('ግዢ መዝግብ', 'Log Purchase'))}</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:5px;">
          ${inv.slice(0, 12).map((it) => {
            const stk = typeof getItemStock === 'function' ? getItemStock(it, 'all') : Number(it.stock || 0);
            const buy = Number(it.buyPrice || it.costPrice || 0);
            const sell = Number(it.sellPrice || 0);
            const margin = sell > 0 && buy > 0 ? Math.round(((sell - buy) / sell) * 100) : 0;
            return `
              <div class="sub-card">
                <div class="card-row">
                  <b style="font-size:12px;">${sEsc(it.name)}</b>
                  <span class="pill ${margin >= 15 ? 'emerald' : (margin > 0 ? 'amber' : 'rose')}">${margin}% ${sEsc(L('ትርፍ', 'Margin'))}</span>
                </div>
                <div class="card-row" style="font-size:11px;color:var(--muted);">
                  <span>${sEsc(L('አማካይ ግዢ', 'WAC'))}: <b style="color:#38bdf8;">${sMoney(buy)}</b></span>
                  <span>${sEsc(L('ሽያጭ', 'Sell'))}: <b style="color:#34d399;">${sMoney(sell)}</b> · ${sNum(stk)}</span>
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-row">
          <b style="color:var(--amber);">🤝 ${sEsc(L('የሻጭ / ደላላ ኮሚሽን መዝገብ', 'Seller & Broker Commission'))}</b>
          <button type="button" class="btn amber sm" onclick="KoraNg.openCommModal()">+ ${sEsc(L('ኮሚሽን ጨምር', 'Add Comm'))}</button>
        </div>
        <div class="kpi-grid">
          <div class="kpi amber"><span class="kpi-lbl">${sEsc(L('ያልተከፈለ ኮሚሽን', 'Unpaid Commission'))}</span><span class="kpi-val" style="font-size:14px;">${sMoney(unpaidComm)}</span></div>
          <div class="kpi emerald"><span class="kpi-lbl">${sEsc(L('ጠቅላላ መዝገቦች', 'Entries'))}</span><span class="kpi-val" style="font-size:14px;">${comms.length}</span></div>
        </div>
        ${comms.map((c) => `
          <div class="sub-card">
            <div class="card-row">
              <b>👤 ${sEsc(c.agent)} · <span style="color:#fbbf24;">${sMoney(c.amount)}</span></b>
              ${c.paid
                ? `<span class="pill emerald">✓ ${sEsc(L('ተከፍሏል', 'Paid'))}</span>`
                : `<button type="button" class="btn teal sm" style="height:24px;font-size:10px;" onclick="KoraNg.markCommPaid('${c.id}')">✓ ${sEsc(L('ክፈል', 'Mark Paid'))}</button>`}
            </div>
            <div style="font-size:10.5px;color:var(--muted);">${sEsc(c.ref || '-')} · ${sEsc(L('ሽያጭ', 'Sale'))}: ${sMoney(c.saleAmt)} (${c.rate}%) · 📅 ${sEsc(c.date)}</div>
          </div>`).join('') || `<div style="font-size:11px;color:var(--muted);text-align:center;padding:8px;">${sEsc(L('የተመዘገበ ኮሚሽን የለም', 'No commissions logged'))}</div>`}
      </div>`;
  }

  function openWacModal() {
    const opts = (state.inventory || []).map((it) => `<option value="${sEsc(it.id)}">${sEsc(it.name)} (WAC: ${Number(it.buyPrice || 0)})</option>`).join('');
    const brOpts = (state.branches || []).map((b) => `<option value="${sEsc(b.name)}">${sEsc(b.name)}</option>`).join('');
    openModal(`📈 ${L('አዲስ ግዢ (WAC ማስያ)', 'Log Purchase Batch (WAC)')}`, `
      <select id="kngWacIt" class="sel">${opts}</select>
      <div class="grid-2">
        <div><label class="lbl">${sEsc(L('የገባ ብዛት', 'New Qty'))}</label><input id="kngWacQty" type="number" min="1" class="inp mono" placeholder="100"></div>
        <div><label class="lbl">${sEsc(L('የአንድ ፍሬ ግዢ ዋጋ', 'Unit Cost (ETB)'))}</label><input id="kngWacCost" type="number" min="1" class="inp mono" placeholder="1150"></div>
      </div>
      <div class="grid-2">
        <select id="kngWacBr" class="sel">${brOpts}</select>
        <input id="kngWacSup" class="inp sm" placeholder="${sEsc(L('አቅራቢ', 'Supplier'))}">
      </div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${sEsc(L('ተው', 'Cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraNg.saveWacPurchase()">${sEsc(L('WAC አስላና መዝግብ', 'Calculate & Save'))}</button>`);
  }

  function saveWacPurchase() {
    const id = document.getElementById('kngWacIt')?.value;
    const qty = Number(document.getElementById('kngWacQty')?.value || 0);
    const unitCost = Number(document.getElementById('kngWacCost')?.value || 0);
    const br = document.getElementById('kngWacBr')?.value || state.branches?.[0]?.name || '-';
    const supplier = (document.getElementById('kngWacSup')?.value || '').trim() || '-';
    const it = (state.inventory || []).find((x) => String(x.id) === String(id));
    if (!it || !(qty > 0) || !(unitCost > 0)) { showToast(L('ብዛት እና ዋጋ ያስገቡ', 'Enter qty and cost'), true); return; }

    const oldQty = typeof getItemStock === 'function' ? Math.max(0, getItemStock(it, 'all')) : Math.max(0, Number(it.stock || 0));
    const oldCost = Number(it.buyPrice || it.costPrice || unitCost);
    const newWac = Math.round(((oldQty * oldCost) + (qty * unitCost)) / (oldQty + qty));

    it.buyPrice = newWac;
    if (it.branchStock) {
      const op = Number(it.branchStock[br] || 0);
      it.branchStock[br] = op + qty;
    }
    state.nextgen.costLogs.unshift({ id: 'wac_' + Date.now(), itemName: it.name, qty, unitCost, oldWac: oldCost, newWac, supplier, date: todayIso() });
    addAudit('WAC_UPDATED', it.name, `${oldCost} -> ${newWac} ETB (+${qty} @ ${unitCost})`);
    saveState(); closeModal(); renderAll();
    showToast(`📈 ${it.name}: ${L('አዲስ WAC', 'New WAC')} = ${sMoney(newWac)}`);
  }

  function openCommModal() {
    openModal(`🤝 ${L('የሻጭ / ደላላ ኮሚሽን', 'Record Commission')}`, `
      <input id="kngCmAgent" class="inp" placeholder="${sEsc(L('የሻጭ / ደላላ ስም', 'Seller / Broker name'))}">
      <div class="grid-2">
        <div><label class="lbl">${sEsc(L('የሽያጭ ጠቅላላ መጠን', 'Sale Total'))}</label><input id="kngCmSale" type="number" min="0" class="inp mono" placeholder="50000" oninput="KoraNg.updCommPrev()"></div>
        <div><label class="lbl">${sEsc(L('ኮሚሽን (%)', 'Rate (%)'))}</label><input id="kngCmRate" type="number" step="0.1" min="0" class="inp mono" value="2" oninput="KoraNg.updCommPrev()"></div>
      </div>
      <div class="grid-2">
        <input id="kngCmRef" class="inp sm" placeholder="${sEsc(L('የሰነድ ቁጥር / ደንበኛ', 'Invoice / Party'))}">
        <div id="kngCmPrev" class="pill amber" style="justify-content:center;">= 0 ብር</div>
      </div>`, `
      <button type="button" class="btn muted" onclick="closeModal()">${sEsc(L('ተው', 'Cancel'))}</button>
      <button type="button" class="btn teal" onclick="KoraNg.saveComm()">${sEsc(L('መዝግብ', 'Save'))}</button>`);
  }

  function updCommPrev() {
    const s = Number(document.getElementById('kngCmSale')?.value || 0);
    const r = Number(document.getElementById('kngCmRate')?.value || 0);
    const el = document.getElementById('kngCmPrev');
    if (el) el.textContent = `= ${sMoney(Math.round((s * r) / 100))}`;
  }

  function saveComm() {
    const agent = (document.getElementById('kngCmAgent')?.value || '').trim();
    const saleAmt = Number(document.getElementById('kngCmSale')?.value || 0);
    const rate = Number(document.getElementById('kngCmRate')?.value || 0);
    const amount = Math.round((saleAmt * rate) / 100);
    if (!agent || !(amount > 0)) { showToast(L('ስምና መጠን ያስገቡ', 'Enter agent & amount'), true); return; }
    state.nextgen.commissions.unshift({
      id: 'cm_' + Date.now(), agent, saleAmt, rate, amount,
      ref: (document.getElementById('kngCmRef')?.value || '').trim() || '-',
      paid: false, date: todayIso()
    });
    addAudit('COMMISSION_ADDED', agent, `${sMoney(amount)} (${rate}% of ${sMoney(saleAmt)})`);
    saveState(); closeModal(); renderView(); showToast(L('ኮሚሽኑ ተመዝግቧል', 'Commission logged'));
  }

  function markCommPaid(id) {
    const c = state.nextgen.commissions.find((x) => x.id === id);
    if (!c) return;
    c.paid = true; c.paidAt = todayIso();
    addAudit('COMMISSION_PAID', c.agent, sMoney(c.amount));
    saveState(); renderView(); showToast(L('ኮሚሽኑ እንደተከፈለ ተመዝግቧል', 'Marked paid'));
  }

  // ===========================================================================
  // 3. 🖨️ ቀጥታ የብሉቱዝ ደረሰኝ ማተሚያ (Web Bluetooth 58mm/80mm ESC/POS)
  // ===========================================================================
  let btDevice = null;
  let btChar = null;
  let btPreviewDoc = 'sale';

  function buildThermalText(kind) {
    const w = Number(state.nextgen.printerWidth || 32);
    const line = '-'.repeat(w);
    const org = (state.orgName || 'KORA STOCK').toUpperCase();
    const dt = new Date().toLocaleString();

    if (kind === 'tally') {
      const h = (state.tally?.history || [])[0];
      const fTot = (state.tally?.free?.strokes || []).reduce((a, x) => a + (typeof x === 'number' ? x : Number(x?.qty || x?.v || 0)), 0);
      return [
        org, 'TALLY RECEIPT', line,
        `Date: ${dt}`,
        h ? `Ref: ${h.docNo || h.ref || '-'}` : 'Ref: Free Count',
        h ? `Party: ${h.party || '-'}` : `Note: ${state.tally?.free?.note || '-'}`,
        h ? `Items: ${h.summary || h.itemsSummary || '-'}` : `Counted: ${fTot}`,
        line, `TOTAL: ${h ? (h.total || h.qty || 0) : fTot}`, line, 'Verified by Kora Stock'
      ].join('\n');
    }
    if (kind === 'gatepass') {
      const g = (state.gatePasses || [])[0];
      return [
        org, 'GATE EXIT PASS', line,
        `Pass: ${g?.passNo || 'GP-001'}`,
        `Doc:  ${g?.docNo || '-'}`,
        `Party: ${g?.party || '-'}`,
        `Driver: ${g?.driver || '-'} (${g?.plate || '-'})`,
        line,
        ...(g?.items || []).map((x) => `- ${x.itemName} x ${x.qty}`),
        line,
        `EXIT CODE: ${g?.passCode || '----'}`,
        `Date: ${dt}`, line
      ].join('\n');
    }
    const s = (state.sales || [])[0];
    return [
      org, 'SALES RECEIPT', line,
      `Inv: ${s?.docNo || s?.invNo || 'INV-001'}`,
      `Date: ${s?.date || dt}`,
      `Customer: ${s?.party || s?.customer || 'Walk-in'}`,
      line,
      ...(s?.items || [{ name: s?.itemName || 'Product', qty: s?.qty || 1, total: s?.total || 0 }]).map((x) => `${x.name || x.itemName} x${x.qty}  ${x.total || ''}`),
      line,
      `TOTAL: ${Number(s?.total || 0).toLocaleString()} ETB`,
      line, 'Thank you! · Kora Stock'
    ].join('\n');
  }

  function renderBluetoothTab(root) {
    const connected = Boolean(btDevice && btDevice.gatt?.connected && btChar);
    const preview = buildThermalText(btPreviewDoc);

    root.innerHTML = `
      <div class="card">
        <div class="card-row">
          <b style="color:var(--teal);">🖨️ ${sEsc(L('የብሉቱዝ ደረሰኝ ማተሚያ (Thermal)', 'Bluetooth Thermal Printer'))}</b>
          <span class="pill ${connected ? 'emerald' : 'amber'}">${connected ? '🟢 ' + sEsc(btDevice.name || 'Connected') : L('አልተገናኘም', 'Not Paired')}</span>
        </div>

        <div class="grid-2">
          <select class="sel" onchange="state.nextgen.printerWidth=Number(this.value);saveState();renderView();">
            <option value="32" ${state.nextgen.printerWidth === 32 ? 'selected' : ''}>58mm (32 chars)</option>
            <option value="48" ${state.nextgen.printerWidth === 48 ? 'selected' : ''}>80mm (48 chars)</option>
          </select>
          <button type="button" class="btn primary sm" onclick="KoraNg.connectBtPrinter()">📡 ${sEsc(connected ? L('እንደገና አገናኝ', 'Reconnect BT') : L('ብሉቱዝ ማተሚያ ፈልግ', 'Pair BT Printer'))}</button>
        </div>

        <div class="seg" style="margin-top:4px;">
          <button type="button" class="seg-btn ${btPreviewDoc === 'sale' ? 'teal' : ''}" onclick="KoraNg.setBtDoc('sale')">🧾 ${sEsc(L('የመጨረሻ ሽያጭ', 'Last Sale'))}</button>
          <button type="button" class="seg-btn ${btPreviewDoc === 'tally' ? 'teal' : ''}" onclick="KoraNg.setBtDoc('tally')">⚡ ${sEsc(L('ቆጠራ', 'Tally'))}</button>
          <button type="button" class="seg-btn ${btPreviewDoc === 'gatepass' ? 'teal' : ''}" onclick="KoraNg.setBtDoc('gatepass')">🛂 ${sEsc(L('መውጫ ፈቃድ', 'Gate Pass'))}</button>
        </div>

        <div class="kng-bt-box">${sEsc(preview)}</div>

        <div class="grid-2" style="margin-top:4px;">
          <button type="button" class="btn teal sm" onclick="KoraNg.printViaBt()">🖨️ ${sEsc(L('በብሉቱዝ አትም', 'Print via Bluetooth'))}</button>
          <button type="button" class="btn muted sm" onclick="KoraNg.printThermalBrowser()">📄 ${sEsc(L('በስልክ/PDF አትም', 'Browser / PDF Print'))}</button>
        </div>
      </div>`;
  }

  async function connectBtPrinter() {
    if (!navigator.bluetooth) {
      showToast(L('ይህ ብራውዘር Web Bluetooth አይደግፍም — «በስልክ/PDF አትም» ይጠቀሙ', 'Web Bluetooth unsupported — use Browser Print'), true);
      return;
    }
    const KNOWN_SERVICES = [
      '000018f0-0000-1000-8000-00805f9b34fb',
      '49535343-fe7d-4ae5-8fa9-9fafd205e455',
      '0000ff00-0000-1000-8000-00805f9b34fb',
      'e7810a71-73ae-499d-8c15-faa9aef0c3f2'
    ];
    try {
      btDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: KNOWN_SERVICES
      });
      const server = await btDevice.gatt.connect();
      btChar = null;
      for (const svcUuid of KNOWN_SERVICES) {
        try {
          const svc = await server.getPrimaryService(svcUuid);
          const chars = await svc.getCharacteristics();
          const writable = chars.find((c) => c.properties.write || c.properties.writeWithoutResponse);
          if (writable) { btChar = writable; break; }
        } catch {}
      }
      if (!btChar) throw new Error('No writable GATT characteristic');
      renderView();
      showToast(`🖨️ ${btDevice.name || 'Printer'} ${L('ተገናኝቷል!', 'connected!')}`);
    } catch {
      showToast(L('ከብሉቱዝ ማተሚያው ጋር መገናኘት አልተቻለም', 'Could not pair BLE printer'), true);
    }
  }

  async function printViaBt() {
    const txt = buildThermalText(btPreviewDoc);
    if (!btChar || !btDevice?.gatt?.connected) {
      showToast(L('መጀመሪያ «ብሉቱዝ ማተሚያ ፈልግ» ን ተጫን ወይም «በስልክ አትም» ተጠቀም', 'Pair BT printer first or use Browser Print'), true);
      return;
    }
    try {
      const enc = new TextEncoder();
      const initCmd = new Uint8Array([0x1b, 0x40]); // ESC @
      const feedCut = new Uint8Array([0x0a, 0x0a, 0x0a, 0x1d, 0x56, 0x00]); // LF x3 + Cut
      const body = enc.encode(txt + '\n');
      const full = new Uint8Array(initCmd.length + body.length + feedCut.length);
      full.set(initCmd, 0);
      full.set(body, initCmd.length);
      full.set(feedCut, initCmd.length + body.length);

      for (let i = 0; i < full.length; i += 100) {
        const chunk = full.slice(i, i + 100);
        if (btChar.properties.writeWithoutResponse) await btChar.writeValueWithoutResponse(chunk);
        else await btChar.writeValue(chunk);
      }
      showToast(L('🖨️ ደረሰኙ ታትሟል!', 'Printed via Bluetooth!'));
    } catch {
      showToast(L('ህትመቱ አልተሳካም — ግንኙነቱን አረጋግጥ', 'Bluetooth print failed'), true);
    }
  }

  function printThermalBrowser() {
    const mm = state.nextgen.printerWidth === 48 ? '80mm' : '58mm';
    const w = window.open('', '_blank');
    if (!w) { showToast(L('Pop-up ተከልክሏል', 'Pop-up blocked'), true); return; }
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><style>@page{size:${mm} auto;margin:2mm;}body{width:${mm};margin:0 auto;font-family:ui-monospace,monospace;font-size:11px;white-space:pre-wrap;color:#000;background:#fff;}</style></head><body>${sEsc(buildThermalText(btPreviewDoc))}<script>window.onload=()=>setTimeout(()=>window.print(),200);</script></body></html>`);
    w.document.close();
  }

  // ===========================================================================
  // 4. 📍 የቅርንጫፍ GPS ክልል መቆጣጠሪያ (Geofenced Check-In)
  // ===========================================================================
  function distMeters(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180, dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  function renderGeoTab(root) {
    const branches = state.branches || [];
    const logs = state.nextgen.checkIns || [];
    root.innerHTML = `
      <div class="card">
        <div class="card-row">
          <b style="color:var(--teal);">📍 ${sEsc(L('የቅርንጫፍ GPS ክልል (Geofencing)', 'Branch GPS Geofencing'))}</b>
          <select class="sel" style="width:105px;height:28px;font-size:11px;" onchange="state.nextgen.geoRadiusM=Number(this.value);saveState();">
            ${[100, 150, 200, 350, 500].map((m) => `<option value="${m}" ${Number(state.nextgen.geoRadiusM) === m ? 'selected' : ''}>${m} ሜትር</option>`).join('')}
          </select>
        </div>

        <div class="grid-2">
          <select id="kngGeoBr" class="sel">
            ${branches.map((b, i) => `<option value="${i}">${sEsc(b.name)}</option>`).join('')}
          </select>
          <button type="button" class="btn muted sm" onclick="KoraNg.pinBranchHere()">📌 ${sEsc(L('ይህን ቦታ መጋዘን አድርግ', 'Set Branch GPS Here'))}</button>
        </div>

        <div class="grid-2" style="margin-top:4px;">
          <button type="button" class="btn teal sm" onclick="KoraNg.doGeoCheck('IN')">🟢 ${sEsc(L('ሥራ ገባሁ (Check-In)', 'Check-In (GPS)'))}</button>
          <button type="button" class="btn amber sm" onclick="KoraNg.doGeoCheck('OUT')">🔴 ${sEsc(L('ሥራ ወጣሁ (Check-Out)', 'Check-Out (GPS)'))}</button>
        </div>
      </div>

      <div class="card">
        <b style="font-size:12px;color:var(--muted);">🕒 ${sEsc(L('የመገኘት GPS መዝገብ', 'Verified Attendance Log'))}</b>
        ${logs.slice(0, 20).map((c) => `
          <div class="sub-card">
            <div class="card-row">
              <b>${c.type === 'IN' ? '🟢 ገባ' : '🔴 ወጣ'} · ${sEsc(c.user)} (${sEsc(c.branch)})</b>
              <span class="${c.inside ? 'kng-badge-in' : 'kng-badge-out'}">${c.inside ? L('በግቢ ውስጥ', 'Inside') : `${sNum(c.distM)}m ${L('ውጭ', 'Outside')}`}</span>
            </div>
            <div style="font-size:10px;color:var(--muted);">🕒 ${sEsc(c.ts)} · GPS: ${c.lat.toFixed(4)}, ${c.lng.toFixed(4)}</div>
          </div>`).join('') || `<div style="font-size:11px;color:var(--muted);text-align:center;padding:10px;">${sEsc(L('ገና የተመዘገበ Check-In የለም', 'No GPS check-ins yet'))}</div>`}
      </div>`;
  }

  function pinBranchHere() {
    if (!navigator.geolocation) { showToast(L('GPS አይደገፍም', 'GPS unsupported'), true); return; }
    const idx = Number(document.getElementById('kngGeoBr')?.value || 0);
    const b = (state.branches || [])[idx];
    if (!b) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      b.lat = pos.coords.latitude;
      b.lng = pos.coords.longitude;
      addAudit('BRANCH_GPS_PINNED', b.name, `${b.lat.toFixed(5)}, ${b.lng.toFixed(5)}`);
      saveState(); renderView();
      showToast(`📌 ${b.name} GPS ${L('ተቀምጧል', 'pinned')}`);
    }, () => showToast(L('የGPS ፍቃድ አልተሰጠም', 'GPS denied'), true), { enableHighAccuracy: true });
  }

  function doGeoCheck(type) {
    if (!navigator.geolocation) { showToast(L('GPS አይደገፍም', 'GPS unsupported'), true); return; }
    const idx = Number(document.getElementById('kngGeoBr')?.value || 0);
    const b = (state.branches || [])[idx] || { name: 'ዋና መጋዘን', lat: 8.9125, lng: 38.7652 };
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      const distM = distMeters(latitude, longitude, Number(b.lat || 8.9125), Number(b.lng || 38.7652));
      const radius = Number(state.nextgen.geoRadiusM || 200);
      const inside = distM <= radius;
      const u = typeof curUser === 'function' ? curUser() : { name: 'Staff' };
      state.nextgen.checkIns.unshift({
        id: 'ci_' + Date.now(), type, user: u.name || 'Staff', branch: b.name,
        lat: latitude, lng: longitude, distM, inside, ts: new Date().toLocaleString()
      });
      addAudit(`GEO_CHECK_${type}`, b.name, `${u.name} · ${inside ? 'INSIDE' : 'OUTSIDE'} (${distM}m)`);
      saveState(); renderView();
      showToast(inside
        ? `✅ ${L('በግቢ ውስጥ መሆንህ ተረጋግጧል', 'Verified inside fence')} (${distM}m)`
        : `⚠️ ${L('ከመጋዘኑ ክልል ውጭ ነህ', 'Outside geofence')} (${distM}m)`, !inside);
    }, () => showToast(L('የGPS ፍቃድ አልተሰጠም', 'GPS permission denied'), true), { enableHighAccuracy: true });
  }

  // ===========================================================================
  // 5. ⚡ የባለብዙ-ስልክ Supabase ቀጥታ ማመሳሰል (Cloud Sync Center)
  // ===========================================================================
  let autoSyncTimer = null;

  const SYNC_SQL_SNIPPET = `create table if not exists public.kora_sync_snapshots (
  room_code text primary key,
  payload jsonb not null,
  updated_by text,
  updated_at timestamptz default now()
);
alter table public.kora_sync_snapshots enable row level security;
create policy "kora_sync_all" on public.kora_sync_snapshots for all using (true) with check (true);`;

  function renderSyncTab(root) {
    const sy = state.nextgen.sync;
    root.innerHTML = `
      <div class="card">
        <div class="card-row">
          <b style="color:var(--teal);">⚡ ${sEsc(L('የባለብዙ-ስልክ Supabase ቀጥታ ማመሳሰል', 'Multi-Phone Supabase Cloud Sync'))}</b>
          <span class="pill ${navigator.onLine ? 'emerald' : 'amber'}">${navigator.onLine ? '🟢 Online' : '🟡 Offline'}</span>
        </div>

        <label class="lbl">Supabase Project URL</label>
        <input id="kngSyUrl" class="inp sm mono" value="${sEsc(sy.url || '')}" placeholder="https://xxxx.supabase.co" onchange="KoraNg.saveSyncCfg()">

        <label class="lbl" style="margin-top:4px;">Supabase Anon Key</label>
        <input id="kngSyKey" type="password" class="inp sm mono" value="${sEsc(sy.anonKey || '')}" placeholder="eyJhbGciOi..." onchange="KoraNg.saveSyncCfg()">

        <div class="grid-2" style="margin-top:4px;">
          <div>
            <label class="lbl">${sEsc(L('የድርጅት ማመሳሰያ ኮድ', 'Workspace Code'))}</label>
            <input id="kngSyRoom" class="inp sm mono" value="${sEsc(sy.roomCode || 'kora-main')}" onchange="KoraNg.saveSyncCfg()">
          </div>
          <div class="switch-row" style="align-self:end;padding-bottom:4px;">
            <span style="font-size:11px;">🔄 ${sEsc(L('ራስ-ሰር (30ሰ)', 'Auto (30s)'))}</span>
            <div class="toggle ${sy.auto ? 'on' : ''}" onclick="KoraNg.toggleAutoSync(this)"></div>
          </div>
        </div>

        <div class="grid-2" style="margin-top:6px;">
          <button type="button" class="btn teal sm" onclick="KoraNg.syncPush()">⬆️ ${sEsc(L('ወደ ዳታቤዝ ላክ (Push)', 'Push to Cloud'))}</button>
          <button type="button" class="btn primary sm" onclick="KoraNg.syncPull()">⬇️ ${sEsc(L('ከሌላ ስልክ ሳብ (Pull)', 'Pull from Cloud'))}</button>
        </div>

        ${sy.lastSync ? `<div style="font-size:10.5px;color:var(--muted);margin-top:4px;">🕒 ${sEsc(L('የመጨረሻ ማመሳሰል', 'Last sync'))}: <b>${sEsc(sy.lastSync)}</b> (${sEsc(sy.lastStatus || 'OK')})</div>` : ''}
      </div>

      <div class="card">
        <div class="card-row">
          <b style="font-size:11.5px;color:var(--amber);">🗄️ ${sEsc(L('የSupabase ሠንጠረዥ SQL (አንድ ጊዜ ብቻ)', 'One-Time Supabase SQL Setup'))}</b>
          <button type="button" class="btn muted sm" onclick="KoraNg.copySyncSql()">📋 Copy SQL</button>
        </div>
        <div class="kng-bt-box" style="font-size:10px;">${sEsc(SYNC_SQL_SNIPPET)}</div>
      </div>`;
  }

  function saveSyncCfg() {
    const sy = state.nextgen.sync;
    const u = document.getElementById('kngSyUrl');
    const k = document.getElementById('kngSyKey');
    const r = document.getElementById('kngSyRoom');
    if (u) sy.url = u.value.trim().replace(/\/+$/, '');
    if (k) sy.anonKey = k.value.trim();
    if (r) sy.roomCode = r.value.trim() || 'kora-main';
    saveState();
  }

  function toggleAutoSync(el) {
    state.nextgen.sync.auto = !state.nextgen.sync.auto;
    if (el) el.classList.toggle('on', state.nextgen.sync.auto);
    saveState();
    setupAutoSyncLoop();
  }

  function setupAutoSyncLoop() {
    if (autoSyncTimer) { clearInterval(autoSyncTimer); autoSyncTimer = null; }
    if (hasState() && state.nextgen?.sync?.auto) {
      autoSyncTimer = setInterval(() => {
        if (navigator.onLine && state.nextgen?.sync?.url && state.nextgen?.sync?.anonKey) {
          syncPush(true);
        }
      }, 30000);
    }
  }

  async function syncPush(silent = false) {
    saveSyncCfg();
    const sy = state.nextgen.sync;
    if (!sy.url || !sy.anonKey) { if (!silent) showToast(L('Supabase URL እና Anon Key አስገባ', 'Enter URL & Key'), true); return; }
    try {
      const u = typeof curUser === 'function' ? curUser() : { name: 'User' };
      const res = await fetch(`${sy.url}/rest/v1/kora_sync_snapshots`, {
        method: 'POST',
        headers: {
          apikey: sy.anonKey,
          Authorization: `Bearer ${sy.anonKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          room_code: sy.roomCode || 'kora-main',
          payload: state,
          updated_by: u.name || 'User',
          updated_at: new Date().toISOString()
        })
      });
      if (!res.ok) throw new Error(String(res.status));
      sy.lastSync = new Date().toLocaleTimeString();
      sy.lastStatus = 'PUSH OK';
      saveState();
      if (!silent) { renderView(); showToast(L('⬆️ ዳታው ወደ Supabase ተልኳል!', 'Pushed to Supabase!')); }
    } catch {
      sy.lastStatus = 'PUSH ERR';
      if (!silent) showToast(L('መላክ አልተቻለም — URL/Key እና SQL ሠንጠረዥ አረጋግጥ', 'Push failed — check credentials & table'), true);
    }
  }

  async function syncPull() {
    saveSyncCfg();
    const sy = state.nextgen.sync;
    if (!sy.url || !sy.anonKey) { showToast(L('Supabase URL እና Anon Key አስገባ', 'Enter URL & Key'), true); return; }
    try {
      const res = await fetch(`${sy.url}/rest/v1/kora_sync_snapshots?room_code=eq.${encodeURIComponent(sy.roomCode || 'kora-main')}&select=*`, {
        headers: { apikey: sy.anonKey, Authorization: `Bearer ${sy.anonKey}` }
      });
      if (!res.ok) throw new Error(String(res.status));
      const rows = await res.json();
      if (!rows?.length || !rows[0]?.payload) { showToast(L('በዚህ ኮድ የተቀመጠ ዳታ አልተገኘም', 'No cloud snapshot found'), true); return; }
      const keepSync = { ...sy, lastSync: new Date().toLocaleTimeString(), lastStatus: `PULL (${rows[0].updated_by || '-'})` };
      Object.assign(state, rows[0].payload);
      ensureNgState();
      state.nextgen.sync = keepSync;
      saveState(); renderAll();
      showToast(L('⬇️ አዲሱ ዳታ ከSupabase ተስቧል!', 'Pulled latest cloud data!'));
    } catch {
      showToast(L('መሳብ አልተቻለም — ኢንተርኔት እና ቁልፍ አረጋግጥ', 'Pull failed'), true);
    }
  }

  function copySyncSql() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(SYNC_SQL_SNIPPET);
      showToast(L('📋 SQL ተቀድቷል — Supabase SQL Editor ላይ ለጥፈህ Run በል', 'SQL copied!'));
    }
  }

  // ===========================================================================
  // 6. ዋናው ገጽ እና ውህደት (Hooks)
  // ===========================================================================
  const NG_TABS = [
    { k: 'photodot', am: '🎯 ፎቶ ነጥብ',  en: '🎯 Photo Dot' },
    { k: 'wac',      am: '📈 WAC/ኮሚሽን', en: '📈 WAC/Comm' },
    { k: 'btprint',  am: '🖨️ ብሉቱዝ',    en: '🖨️ BT Print' },
    { k: 'geofence', am: '📍 GPS ክልል',  en: '📍 Geofence' },
    { k: 'sync',     am: '⚡ Cloud Sync', en: '⚡ Cloud Sync' }
  ];

  function renderNextGenPage(root) {
    ensureNgState();
    const sub = state.nextgen.subTab || 'photodot';
    if (sub === 'wac') renderWacAndCommTab(root);
    else if (sub === 'btprint') renderBluetoothTab(root);
    else if (sub === 'geofence') renderGeoTab(root);
    else if (sub === 'sync') renderSyncTab(root);
    else renderPhotoDotTab(root);
  }

  function installNgHooks() {
    if (!hasState() || global._kngHooksDone) return;
    global._kngHooksDone = true;
    injectNgCss();
    ensureNgState();
    setupAutoSyncLoop();

    const _origSub = global.renderSubTabs;
    global.renderSubTabs = function () {
      if (state.activeMainTab === 'setup:nextgen') {
        ensureNgState();
        document.getElementById('subTabsBar').innerHTML = NG_TABS.map((t) =>
          `<button type="button" class="subtab ${state.nextgen.subTab === t.k ? 'active' : ''}" onclick="KoraNg.setTab('${t.k}')">${sEsc(isAm() ? t.am : t.en)}</button>`
        ).join('');
        return;
      }
      if (typeof _origSub === 'function') _origSub();
    };

    const _origSetup = global.renderSetupPage;
    global.renderSetupPage = function (page) {
      const root = document.getElementById('viewRoot');
      if (page === 'nextgen' && root) { renderNextGenPage(root); return; }
      if (typeof _origSetup === 'function') _origSetup(page);
    };

    const _origDrawer = global.renderDrawer;
    global.renderDrawer = function () {
      if (typeof _origDrawer === 'function') _origDrawer();
      const nav = document.getElementById('drawerNav');
      if (nav && !nav.querySelector('[data-kng-nav]')) {
        nav.insertAdjacentHTML('afterbegin', `
          <button type="button" data-kng-nav="1" class="drawer-item ${state.activeMainTab === 'setup:nextgen' ? 'active' : ''}" onclick="vib(14);openSetup('nextgen')">
            <span>🚀 ${sEsc(L('ዘመናዊ መሣሪያዎች (Next-Gen)', 'Next-Gen Tools'))}</span>
          </button>`);
      }
    };

    if (state.loggedIn) renderAll();
  }

  const DOT_COLORS = ['#2dd4bf', '#f59e0b', '#fb7185', '#38bdf8', '#a3e635'];

  global.KoraNg = {
    setTab(k) { state.nextgen.subTab = k; saveState(); renderSubTabs(); renderView(); },
    loadPhoto,
    pdSetZoom(delta) { pdZoom = Math.max(0.8, Math.min(3.2, Number((pdZoom + delta).toFixed(2)))); drawPhotoDotCanvas(); },
    pdCycleColor() { pdColor = DOT_COLORS[(DOT_COLORS.indexOf(pdColor) + 1) % DOT_COLORS.length]; drawPhotoDotCanvas(); },
    pdUndo() { if (pdDots.length) { pdDots.pop(); renderView(); } },
    pdClear() { pdDots = []; renderView(); },
    pdDownload, pdSendToTally,
    openWacModal, saveWacPurchase, openCommModal, updCommPrev, saveComm, markCommPaid,
    setBtDoc(k) { btPreviewDoc = k; renderView(); },
    connectBtPrinter, printViaBt, printThermalBrowser,
    pinBranchHere, doGeoCheck,
    saveSyncCfg, toggleAutoSync, syncPush, syncPull, copySyncSql
  };

  installNgHooks();
  document.addEventListener('DOMContentLoaded', installNgHooks);
  setTimeout(installNgHooks, 500);
})(window);
