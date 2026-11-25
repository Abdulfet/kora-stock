// =============================================================================
// ኮራ ስቶክ — የSupabase API እና የኦፍላይን ሲንክ ድልድይ (kora-api.js)
// =============================================================================
(function (global) {
  'use strict';

  const CONFIG = {
    SUPABASE_URL: 'https://dawnjbtjcpkxowxwucqm.supabase.co',
    SUPABASE_ANON_KEY: 'sb_publishable_Fm6k5BTjEScJbz-4p4SwJA_TGK8uPV6',
    NOTIFY_FUNCTION: 'kora-notify',
    TIMEOUT_MS: 18000,
    SESSION_KEY: 'korastock_cloud_sess_v12',
    QUEUE_KEY: 'korastock_sync_v12',
    SNAPSHOT_KEY: 'korastock_bootstrap_cache_v12'
  };

  let syncing = false;
  let listeners = [];

  function uuid() {
    if (global.crypto && typeof global.crypto.randomUUID === 'function') {
      return global.crypto.randomUUID();
    }
    return 'ks_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
  }

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }

  function emit(eventName, detail) {
    listeners.forEach((fn) => {
      try { fn(eventName, detail); } catch {}
    });
  }

  function getSession() {
    return readJson(CONFIG.SESSION_KEY, null);
  }

  function setSession(sess) {
    if (sess) writeJson(CONFIG.SESSION_KEY, sess);
    else localStorage.removeItem(CONFIG.SESSION_KEY);
    emit('session', sess);
  }

  function getToken() {
    return getSession()?.token || '';
  }

  async function fetchWithTimeout(url, options) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), CONFIG.TIMEOUT_MS);
    try {
      return await fetch(url, { ...options, signal: ctrl.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  function isNetworkFailure(err) {
    if (!navigator.onLine) return true;
    const msg = String(err?.message || err || '');
    return err?.name === 'AbortError' || err instanceof TypeError || /Failed to fetch|NetworkError|Load failed/i.test(msg);
  }

  async function callRpc(fnName, params = {}) {
    const res = await fetchWithTimeout(`${CONFIG.SUPABASE_URL}/rest/v1/rpc/${fnName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: CONFIG.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${CONFIG.SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(params)
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 401 || String(data?.message || data?.error || '').includes('UNAUTHORIZED')) {
      setSession(null);
      emit('unauthorized', null);
      throw new Error('UNAUTHORIZED');
    }

    if (!res.ok) {
      throw new Error(data?.message || data?.error || `HTTP_${res.status}`);
    }
    return data;
  }

  async function callNotify(payload) {
    const token = getToken();
    const res = await fetchWithTimeout(`${CONFIG.SUPABASE_URL}/functions/v1/${CONFIG.NOTIFY_FUNCTION}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: CONFIG.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
        'x-session-token': token
      },
      body: JSON.stringify({ ...payload, token })
    });
    return await res.json().catch(() => ({ success: false }));
  }

  async function uploadNotifyFile({ file, branchId = '', reportTitle, dataTier = 'QTY_ONLY', channelId = '', lang = 'am' }) {
    const token = getToken();
    const fd = new FormData();
    fd.append('token', token);
    if (branchId) fd.append('branch_id', branchId);
    fd.append('report_title', reportTitle || '');
    fd.append('data_tier', dataTier);
    if (channelId) fd.append('channel_id', channelId);
    fd.append('lang', lang);
    fd.append('file', file, file.name || 'report.pdf');

    const res = await fetchWithTimeout(`${CONFIG.SUPABASE_URL}/functions/v1/${CONFIG.NOTIFY_FUNCTION}`, {
      method: 'POST',
      headers: {
        apikey: CONFIG.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
        'x-session-token': token
      },
      body: fd
    });
    return await res.json().catch(() => ({ success: false }));
  }

  function getQueue() {
    return readJson(CONFIG.QUEUE_KEY, []);
  }

  function saveQueue(list) {
    writeJson(CONFIG.QUEUE_KEY, list);
    emit('queue', {
      total: list.length,
      pending: list.filter((j) => j.status === 'pending').length,
      failed: list.filter((j) => j.status === 'failed').length
    });
  }

  function enqueueJob(rpcName, params, postNotifyAction = null, label = '') {
    const q = getQueue();
    const idempKey = params.p_idempotency_key || uuid();
    const job = {
      id: uuid(),
      rpcName,
      params: { ...params, p_idempotency_key: idempKey },
      postNotifyAction,
      label,
      status: 'pending',
      retries: 0,
      lastError: '',
      createdAt: Date.now()
    };
    q.push(job);
    saveQueue(q);
    return job;
  }

  function discardJob(jobId) {
    saveQueue(getQueue().filter((j) => j.id !== jobId));
  }

  function retryFailedJobs() {
    const q = getQueue().map((j) => (j.status === 'failed' ? { ...j, status: 'pending', lastError: '' } : j));
    saveQueue(q);
    return syncQueue();
  }

  async function syncQueue() {
    if (syncing || !navigator.onLine || !getToken()) return { synced: 0, remaining: getQueue().length };
    const queue = getQueue();
    if (!queue.some((j) => j.status === 'pending')) return { synced: 0, remaining: queue.length };

    syncing = true;
    emit('sync_start', null);

    let synced = 0;
    const nextQueue = [];
    const token = getToken();

    for (let idx = 0; idx < queue.length; idx++) {
      const job = queue[idx];
      if (job.status !== 'pending') {
        nextQueue.push(job);
        continue;
      }

      try {
        const res = await callRpc(job.rpcName, { ...job.params, p_token: token });
        if (res && res.success) {
          synced++;
          if (job.postNotifyAction && res.document_id) {
            callNotify({
              action: job.postNotifyAction,
              document_id: res.document_id,
              lang: job.params._lang || 'am'
            }).catch(() => {});
          }
        } else {
          nextQueue.push({
            ...job,
            status: 'failed',
            retries: job.retries + 1,
            lastError: String(res?.error || 'SYNC_REJECTED')
          });
        }
      } catch (err) {
        if (err.message === 'UNAUTHORIZED') {
          nextQueue.push(job, ...queue.slice(idx + 1));
          break;
        }
        if (isNetworkFailure(err)) {
          nextQueue.push({ ...job, retries: job.retries + 1 }, ...queue.slice(idx + 1));
          break;
        }
        nextQueue.push({
          ...job,
          status: 'failed',
          retries: job.retries + 1,
          lastError: String(err?.message || 'ERROR')
        });
      }
    }

    saveQueue(nextQueue);
    syncing = false;
    emit('sync_done', { synced, remaining: nextQueue.length });
    return { synced, remaining: nextQueue.length };
  }

  async function executeWithOfflineFallback(rpcName, params, opts = {}) {
    const idempKey = params.p_idempotency_key || uuid();
    const payload = { ...params, p_token: getToken(), p_idempotency_key: idempKey };

    if (!navigator.onLine) {
      const job = enqueueJob(rpcName, payload, opts.notifyAction || null, opts.label || rpcName);
      return { success: true, offline: true, queued_job_id: job.id };
    }

    try {
      const res = await callRpc(rpcName, payload);
      if (res && res.success && opts.notifyAction && res.document_id) {
        callNotify({ action: opts.notifyAction, document_id: res.document_id, lang: opts.lang || 'am' }).catch(() => {});
      }
      return res;
    } catch (err) {
      if (isNetworkFailure(err)) {
        const job = enqueueJob(rpcName, payload, opts.notifyAction || null, opts.label || rpcName);
        return { success: true, offline: true, queued_job_id: job.id };
      }
      throw err;
    }
  }

  const KoraAPI = {
    configure(overrides) { Object.assign(CONFIG, overrides || {}); },
    onEvent(fn) {
      listeners.push(fn);
      return () => { listeners = listeners.filter((x) => x !== fn); };
    },
    getSession,
    getQueue,
    discardJob,
    retryFailedJobs,
    syncQueue,

    async loginPin(orgCode, pin) {
      const res = await callRpc('rpc_login_pin', { p_org_code: orgCode, p_pin: pin });
      if (res && res.success) setSession(res);
      return res;
    },

    async logout() {
      const tok = getToken();
      if (tok && navigator.onLine) {
        await callRpc('rpc_logout', { p_token: tok }).catch(() => {});
      }
      setSession(null);
    },

    async getBootstrap(branchId = null) {
      try {
        const res = await callRpc('rpc_get_bootstrap', { p_token: getToken(), p_branch_id: branchId });
        if (res && res.success) writeJson(CONFIG.SNAPSHOT_KEY, { branchId, data: res, ts: Date.now() });
        return res;
      } catch (err) {
        if (isNetworkFailure(err)) {
          const cached = readJson(CONFIG.SNAPSHOT_KEY, null);
          if (cached?.data) return { ...cached.data, from_cache: true };
        }
        throw err;
      }
    },

    async getDashboard(branchId = null) {
      return await callRpc('rpc_get_dashboard_summary', { p_token: getToken(), p_branch_id: branchId });
    },

    async getSmartAnalytics({ branchId = null, windowDays = 30, leadDays = 7, coverDays = 21 } = {}) {
      return await callRpc('rpc_get_smart_analytics', {
        p_token: getToken(),
        p_branch_id: branchId,
        p_window_days: windowDays,
        p_lead_days: leadDays,
        p_cover_days: coverDays
      });
    },

    async postSale({ docNo, customer, isDirect = false, items, payments, overridePin = null, dueDate = null, lang = 'am' }) {
      return await executeWithOfflineFallback(
        'rpc_post_sale',
        {
          p_doc_no: docNo,
          p_customer: customer,
          p_is_direct: isDirect,
          p_items: items,
          p_payments: payments,
          p_override_pin: overridePin,
          p_due_date: dueDate
        },
        { notifyAction: 'dispatch_document', label: docNo, lang }
      );
    },

    async postPurchase({ docNo, supplier, branchId, freight = 0, labor = 0, items, payments, dueDate = null, lang = 'am' }) {
      return await executeWithOfflineFallback(
        'rpc_post_purchase',
        {
          p_doc_no: docNo,
          p_supplier: supplier,
          p_branch_id: branchId,
          p_freight: freight,
          p_labor: labor,
          p_items: items,
          p_payments: payments,
          p_due_date: dueDate
        },
        { notifyAction: 'dispatch_document', label: docNo, lang }
      );
    },

    async receivePurchase(documentId, refNo = '-', lang = 'am') {
      const res = await callRpc('rpc_receive_purchase', {
        p_token: getToken(),
        p_document_id: documentId,
        p_ref_no: refNo
      });
      if (res && res.success) {
        callNotify({ action: 'dispatch_document', document_id: documentId, lang }).catch(() => {});
      }
      return res;
    },

    async toggleDocumentVoid(documentId, pin, shouldVoid, lang = 'am') {
      const res = await callRpc('rpc_toggle_document_void', {
        p_token: getToken(),
        p_document_id: documentId,
        p_pin: pin,
        p_void: Boolean(shouldVoid)
      });
      if (res && res.success) {
        callNotify({
          action: 'send_audit_log',
          action_title: shouldVoid ? 'VOID' : 'RESTORE',
          details: documentId,
          lang
        }).catch(() => {});
      }
      return res;
    },

    async creditAction({ creditId, action, amount, bankId = null, ftRef = '' }) {
      return await callRpc('rpc_credit_action', {
        p_token: getToken(),
        p_credit_id: creditId,
        p_action: action,
        p_amount: amount,
        p_bank_id: bankId,
        p_ft_ref: ftRef
      });
    },

    sendRiskAudit(branchId = null, lang = 'am') {
      return callNotify({ action: 'send_risk_audit', branch_id: branchId, lang });
    },

    sendScheduledSummary(period = 'DAILY', lang = 'am') {
      return callNotify({ action: 'send_scheduled_summary', period, lang });
    },

    testChannel(channelId) {
      return callNotify({ action: 'test_channel', channel_id: channelId });
    },

    registerTelegramWebhook(channelId) {
      return callNotify({ action: 'register_telegram_webhook', channel_id: channelId });
    },

    uploadNotifyFile
  };

  global.addEventListener('online', () => {
    emit('network', { online: true });
    syncQueue();
  });
  global.addEventListener('offline', () => emit('network', { online: false }));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && navigator.onLine) syncQueue();
  });

  global.KoraAPI = KoraAPI;
})(window);
