/* ============================================================
   Provider adapter. Groq, OpenAI and Gemini all speak the
   OpenAI chat-completions shape, so one client covers all three.
   Every call returns measured usage. Nothing here estimates.
   ============================================================ */

const LLM = (() => {

  let cfg = { provider: 'groq', key: '', model: '' };

  function configure(next) { cfg = Object.assign({}, cfg, next); }
  function current() { return Object.assign({}, cfg); }

  function providerDef() { return PROVIDERS[cfg.provider] || PROVIDERS.groq; }

  function priceFor(provider, model) {
    const p = PROVIDERS[provider];
    if (!p) return null;
    return p.models.find(m => m.id === model) || null;
  }

  function ready() { return !!(cfg.key && cfg.model && PROVIDERS[cfg.provider]); }

  /* ---- one call ---- */

  async function chat(system, user, opts) {
    opts = opts || {};
    if (!ready()) throw new Error('No provider configured. Open Setup and add a key and a model.');

    const def = providerDef();
    const body = {
      model: cfg.model,
      messages: [],
      temperature: opts.temperature != null ? opts.temperature : 0,
    };
    if (system) body.messages.push({ role: 'system', content: system });
    body.messages.push({ role: 'user', content: user != null ? user : '' });
    if (opts.maxTokens) body.max_tokens = opts.maxTokens;
    if (opts.json) body.response_format = { type: 'json_object' };

    let res;
    try {
      res = await fetch(def.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + cfg.key,
        },
        body: JSON.stringify(body),
      });
    } catch (e) {
      throw new Error(
        'The request never reached ' + def.label + '. The usual causes are a dropped network, a ' +
        'browser extension intercepting calls to this host, or a corporate proxy stripping the ' +
        'Authorization header. Try another provider in Setup before you spend time on it. ' +
        'Original: ' + e.message
      );
    }

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      let msg = txt;
      try { const j = JSON.parse(txt); msg = (j.error && (j.error.message || j.error.status)) || txt; } catch (_) {}
      // Some models reject response_format. Retry once without it.
      if (opts.json && /response_format|json_object|not supported/i.test(msg)) {
        return chat(system, user, Object.assign({}, opts, { json: false }));
      }
      if (res.status === 401 || res.status === 403) throw new Error('Key rejected by ' + def.label + ' (' + res.status + '). ' + msg);
      if (res.status === 429) throw new Error('Rate limited by ' + def.label + '. Wait and run again. ' + msg);
      throw new Error(def.label + ' returned ' + res.status + '. ' + msg);
    }

    const j = await res.json();
    const choice = (j.choices && j.choices[0]) || {};
    const text = (choice.message && choice.message.content) || '';
    const u = j.usage || {};

    return {
      text: text,
      usage: {
        in: u.prompt_tokens != null ? u.prompt_tokens : null,
        out: u.completion_tokens != null ? u.completion_tokens : null,
        total: u.total_tokens != null ? u.total_tokens : null,
      },
      model: j.model || cfg.model,
      provider: cfg.provider,
    };
  }

  /* ---- run a batch with bounded concurrency ---- */

  async function batch(items, makeCall, onProgress, concurrency) {
    const limit = concurrency || 3;
    const out = new Array(items.length);
    let next = 0, done = 0;

    async function worker() {
      while (true) {
        const i = next++;
        if (i >= items.length) return;
        try {
          out[i] = { ok: true, value: await makeCall(items[i], i) };
        } catch (e) {
          out[i] = { ok: false, error: e.message || String(e) };
        }
        done++;
        if (onProgress) onProgress(done, items.length);
      }
    }

    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
    return out;
  }

  /* ---- parse a model reply into the output contract ---- */

  function parseContract(text) {
    if (!text) return { ok: false, error: 'empty reply', raw: text };
    let s = String(text).trim();
    // strip code fences
    s = s.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
    // find the first balanced-looking object
    const a = s.indexOf('{'), b = s.lastIndexOf('}');
    if (a === -1 || b === -1 || b < a) return { ok: false, error: 'no JSON object in reply', raw: text };
    try {
      const o = JSON.parse(s.slice(a, b + 1));
      return {
        ok: true,
        value: {
          condition: o.condition == null ? null : String(o.condition).toLowerCase().trim(),
          route: (o.route == null || o.route === '' || String(o.route).toLowerCase() === 'null')
                 ? null : String(o.route).toUpperCase().trim(),
          escalate: typeof o.escalate === 'boolean'
                    ? o.escalate
                    : /^(true|yes|1)$/i.test(String(o.escalate)),
        },
        raw: text,
      };
    } catch (e) {
      return { ok: false, error: 'reply is not valid JSON: ' + e.message, raw: text };
    }
  }

  return { configure, current, providerDef, priceFor, ready, chat, batch, parseContract };
})();

/* ============================================================
   Run ledger. The only source stage 8 is allowed to read.
   ============================================================ */

const Ledger = {
  add(store, entry) {
    store.push(Object.assign({ ts: Date.now() }, entry));
    return store;
  },
  forStage(store, stage) {
    return store.filter(e => e.stage === stage);
  },
  totals(rows) {
    return rows.reduce((a, r) => {
      a.calls++;
      a.in += r.in || 0;
      a.out += r.out || 0;
      return a;
    }, { calls: 0, in: 0, out: 0 });
  },
  mean(rows) {
    const t = this.totals(rows);
    if (!t.calls) return { calls: 0, in: 0, out: 0 };
    return { calls: t.calls, in: t.in / t.calls, out: t.out / t.calls };
  },
};
