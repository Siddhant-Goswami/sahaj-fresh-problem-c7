#!/usr/bin/env node
/* ============================================================
   A3 — run every prompt against every ticket, then grade.

   Same fetch shape as js/llm.js: OpenAI chat-completions, temperature 0,
   JSON mode, retry on 429 with the provider's own stated wait. Usage is
   recorded from the response, never estimated.

   Candidate calls:  <prompts> x 30 tickets.
   Judge calls:      only where a model grader has jurisdiction —
                     C5 and C6 on every output, C4 only where the regex
                     in criteria.js is silent.

     GROQ_API_KEY=...  node lecture/run-prompts.js
     GROQ_API_KEY=...  GEMINI_API_KEY=... node lecture/run-prompts.js --judge

   Flags:
     --judge            also run the model graders (needs a second key)
     --prompt p1        run one prompt only
     --limit 5          first N tickets only, for a smoke test
     --out FILE         default lecture/outputs.json

   T2 in the tool-change spec is this script's two-config rule, moved into
   the browser: the judge must not be the candidate. This refuses to run if
   they are the same model.
   ============================================================ */

'use strict';

const fs = require('fs');
const path = require('path');
const { gradeCode, escalateSignals } = require('./criteria.js');

/* ---- providers, lifted from js/data.js so prices cannot drift apart ---- */

const PROVIDERS = {
  groq:   { label: 'Groq',   url: 'https://api.groq.com/openai/v1/chat/completions',
            env: 'GROQ_API_KEY',   model: 'openai/gpt-oss-120b' },
  openai: { label: 'OpenAI', url: 'https://api.openai.com/v1/chat/completions',
            env: 'OPENAI_API_KEY', model: 'gpt-4o-mini' },
  gemini: { label: 'Gemini', url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
            env: 'GEMINI_API_KEY', model: 'gemini-2.0-flash' },
};

const arg = (flag, dflt) => {
  const i = process.argv.indexOf(flag);
  return i === -1 ? dflt : process.argv[i + 1];
};
const has = flag => process.argv.indexOf(flag) !== -1;

const CANDIDATE = {
  provider: arg('--candidate-provider', 'groq'),
  model:    arg('--candidate-model', null),
};
const JUDGE = {
  provider: arg('--judge-provider', process.env.GEMINI_API_KEY ? 'gemini' : 'openai'),
  model:    arg('--judge-model', null),
};

function resolve(cfg) {
  const def = PROVIDERS[cfg.provider];
  if (!def) throw new Error('unknown provider: ' + cfg.provider);
  const key = process.env[def.env];
  if (!key) throw new Error('no key in $' + def.env + ' for provider ' + cfg.provider);
  return { label: def.label, url: def.url, key, model: cfg.model || def.model, provider: cfg.provider };
}

/* ---- one call ---- */

const RETRY_ON = [429, 500, 502, 503, 529];
const MAX_RETRIES = 4;
const sleep = ms => new Promise(r => setTimeout(r, ms));

function retryWaitMs(res, msg, attempt) {
  const hdr = res.headers && res.headers.get ? res.headers.get('retry-after') : null;
  const fromHeader = hdr ? parseFloat(hdr) : NaN;
  if (!isNaN(fromHeader)) return Math.min(fromHeader * 1000, 30000);
  const m = /try again in\s+([\d.]+)\s*(ms|m|s)?/i.exec(msg || '');
  if (m) {
    const v = parseFloat(m[1]);
    const unit = (m[2] || 's').toLowerCase();
    const ms = unit === 'ms' ? v : unit === 'm' ? v * 60000 : v * 1000;
    return Math.min(ms + 250, 30000);
  }
  return Math.min(1000 * Math.pow(2, attempt), 8000);
}

async function chat(cfg, system, user, opts) {
  opts = opts || {};
  const body = {
    model: cfg.model,
    messages: [],
    temperature: opts.temperature != null ? opts.temperature : 0,
  };
  if (system) body.messages.push({ role: 'system', content: system });
  body.messages.push({ role: 'user', content: user == null ? '' : user });
  if (opts.json !== false) body.response_format = { type: 'json_object' };

  const res = await fetch(cfg.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + cfg.key },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    let msg = txt;
    try { const j = JSON.parse(txt); msg = (j.error && (j.error.message || j.error.status)) || txt; } catch (_) {}
    if (opts.json !== false && /response_format|json_object|not supported/i.test(msg)) {
      return chat(cfg, system, user, Object.assign({}, opts, { json: false }));
    }
    const attempt = opts._attempt || 0;
    if (RETRY_ON.indexOf(res.status) !== -1 && attempt < MAX_RETRIES) {
      const wait = retryWaitMs(res, msg, attempt) + Math.floor(Math.random() * 400);
      process.stderr.write('  retry ' + (attempt + 1) + '/' + MAX_RETRIES + ' after ' + res.status + ', waiting ' + wait + 'ms\n');
      await sleep(wait);
      return chat(cfg, system, user, Object.assign({}, opts, { _attempt: attempt + 1 }));
    }
    throw new Error(cfg.label + ' returned ' + res.status + '. ' + msg);
  }

  const j = await res.json();
  const choice = (j.choices && j.choices[0]) || {};
  const u = j.usage || {};
  return {
    text: (choice.message && choice.message.content) || '',
    usage: { in: u.prompt_tokens ?? null, out: u.completion_tokens ?? null, total: u.total_tokens ?? null },
    model: j.model || cfg.model,
  };
}

/* ---- parse the contract, reason included (T1) ---- */

function parseContract(text) {
  if (!text) return { ok: false, error: 'empty reply', raw: text };
  let s = String(text).trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  const a = s.indexOf('{'), b = s.lastIndexOf('}');
  if (a === -1 || b === -1 || b < a) return { ok: false, error: 'no JSON object in reply', raw: text };
  try {
    const o = JSON.parse(s.slice(a, b + 1));
    const v = {
      condition: o.condition == null ? null : String(o.condition).toLowerCase().trim(),
      route: (o.route == null || o.route === '' || String(o.route).toLowerCase() === 'null')
             ? null : String(o.route).toUpperCase().trim(),
      escalate: typeof o.escalate === 'boolean' ? o.escalate : /^(true|yes|1)$/i.test(String(o.escalate)),
    };
    // reason is optional on read so an old prompt still parses; C3 is what
    // requires it, and C3 is allowed to fail.
    if (Object.prototype.hasOwnProperty.call(o, 'reason')) v.reason = o.reason == null ? '' : String(o.reason);
    return { ok: true, value: v, raw: text };
  } catch (e) {
    return { ok: false, error: 'reply is not valid JSON: ' + e.message, raw: text };
  }
}

/* ---- bounded concurrency, same as LLM.batch ---- */

async function pool(items, fn, concurrency) {
  const limit = concurrency || 3;
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      try { out[i] = { ok: true, value: await fn(items[i], i) }; }
      catch (e) { out[i] = { ok: false, error: e.message || String(e) }; }
    }
  }));
  return out;
}

/* ---- judges ---- */

const JUDGE_PROMPTS = {};
['j4', 'j5', 'j6'].forEach(j => {
  JUDGE_PROMPTS[j] = fs.readFileSync(path.join(__dirname, 'judges', j + '.txt'), 'utf8');
});

async function runJudge(cfg, which, ticket, output) {
  const prompt = JUDGE_PROMPTS[which]
    .replace('{ticket}', ticket)
    .replace('{output}', JSON.stringify(output, null, 2));
  const r = await chat(cfg, null, prompt, { temperature: 0 });
  const p = parseJudge(r.text);
  return { criterion: which.toUpperCase().replace('J', 'C'), pass: p.pass, evidence: p.evidence, raw: r.text, usage: r.usage };
}

function parseJudge(text) {
  try {
    const s = String(text).replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
    const o = JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}') + 1));
    return { pass: o.pass === true, evidence: String(o.evidence == null ? '' : o.evidence) };
  } catch (e) {
    return { pass: null, evidence: 'judge reply did not parse: ' + String(text).slice(0, 200) };
  }
}

/* ---- main ---- */

async function main() {
  const pack = JSON.parse(fs.readFileSync(path.join(__dirname, 'tickets.json'), 'utf8'));
  let tickets = pack.tickets;
  const limit = parseInt(arg('--limit', ''), 10);
  if (!isNaN(limit)) tickets = tickets.slice(0, limit);

  const promptDir = path.join(__dirname, 'prompts');
  let promptIds = fs.readdirSync(promptDir).filter(f => /^p\d[\w.-]*\.txt$/.test(f)).sort();
  const one = arg('--prompt', null);
  if (one) promptIds = promptIds.filter(f => f.startsWith(one));
  if (!promptIds.length) {
    console.error('No prompts in lecture/prompts/. See lecture/prompts/README.md — A2 needs three submission.json files.');
    process.exit(1);
  }

  const cand = resolve(CANDIDATE);
  let judge = null;
  if (has('--judge')) {
    judge = resolve(JUDGE);
    if (judge.model === cand.model) {
      console.error('Judge model equals candidate model (' + cand.model + '). Refusing to run: a model that grades its own output is not a second opinion. Pass --judge-provider / --judge-model.');
      process.exit(1);
    }
  }

  console.error('candidate: ' + cand.label + ' / ' + cand.model);
  console.error('judge:     ' + (judge ? judge.label + ' / ' + judge.model : 'not run (pass --judge)'));
  console.error('calls:     ' + (promptIds.length * tickets.length) + ' candidate' +
    (judge ? ', up to ' + (promptIds.length * tickets.length * 2 + promptIds.length * tickets.filter(t => escalateSignals(t.input).length === 0).length) + ' judge' : ''));

  const rows = [];

  for (const file of promptIds) {
    const promptId = file.replace(/\.txt$/, '');
    const system = fs.readFileSync(path.join(promptDir, file), 'utf8');
    process.stderr.write(promptId + ': ');

    const results = await pool(tickets, async t => {
      const r = await chat(cand, system, t.input, { temperature: 0 });
      process.stderr.write('.');
      return { ticket: t, r };
    }, 3);

    process.stderr.write('\n');

    for (let i = 0; i < results.length; i++) {
      const t = tickets[i];
      const res = results[i];
      if (!res.ok) {
        rows.push({ prompt_id: promptId, ticket_id: t.id, error: res.error, raw: null, parsed: null, usage: null, checks: null });
        continue;
      }
      const parsed = parseContract(res.value.r.text);
      const output = parsed.ok ? parsed.value : null;
      const checks = gradeCode({ ticket: t.input, output, parseError: parsed.ok ? null : parsed.error });

      rows.push({
        prompt_id: promptId,
        ticket_id: t.id,
        ticket_class: t.class,
        raw: res.value.r.text,
        parsed: output,
        usage: res.value.r.usage,
        model: res.value.r.model,
        expected: t.expected,
        checks,
      });
    }
  }

  /* ---- judges, second pass, only where they have jurisdiction ---- */

  if (judge) {
    const jobs = [];
    rows.forEach(row => {
      if (!row.parsed) return;
      const t = tickets.find(x => x.id === row.ticket_id);
      jobs.push({ row, t, which: 'j5' });
      jobs.push({ row, t, which: 'j6' });
      if (row.checks && row.checks.C4 && row.checks.C4.silent) jobs.push({ row, t, which: 'j4' });
    });
    process.stderr.write('judging (' + jobs.length + ' calls): ');
    const out = await pool(jobs, async job => {
      const v = await runJudge(judge, job.which, job.t.input, job.row.parsed);
      process.stderr.write('.');
      return { job, v };
    }, 3);
    process.stderr.write('\n');
    out.forEach(o => {
      if (!o.ok) return;
      o.value.job.row.checks[o.value.v.criterion] = o.value.v;
    });
  }

  /* ---- summary ---- */

  const summary = {};
  promptIds.map(f => f.replace(/\.txt$/, '')).forEach(pid => {
    const mine = rows.filter(r => r.prompt_id === pid);
    const per = {};
    ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'].forEach(c => {
      const graded = mine.filter(r => r.checks && r.checks[c] && r.checks[c].pass !== null && r.checks[c].pass !== undefined);
      per[c] = graded.length ? graded.filter(r => r.checks[c].pass).length + ' / ' + graded.length : 'not graded';
    });
    const tok = mine.filter(r => r.usage).reduce((a, r) => ({ calls: a.calls + 1, in: a.in + (r.usage.in || 0), out: a.out + (r.usage.out || 0) }), { calls: 0, in: 0, out: 0 });
    summary[pid] = {
      per_criterion: per,
      all_six: mine.filter(r => r.checks && Object.values(r.checks).every(c => c.pass === true)).length + ' / ' + mine.length,
      errors: mine.filter(r => r.error).length,
      tokens: tok.calls ? { calls: tok.calls, mean_in: Math.round(tok.in / tok.calls), mean_out: Math.round(tok.out / tok.calls) } : null,
    };
  });

  const outFile = arg('--out', path.join(__dirname, 'outputs.json'));
  fs.writeFileSync(outFile, JSON.stringify({
    artifact: 'A3',
    run: new Date().toISOString(),
    candidate: { provider: cand.provider, model: cand.model, temperature: 0, json_mode: true },
    judge: judge ? { provider: judge.provider, model: judge.model, temperature: 0 } : null,
    tickets_file: 'lecture/tickets.json',
    summary,
    rows,
  }, null, 2) + '\n');

  console.error('\nwrote ' + outFile);
  console.log(JSON.stringify(summary, null, 2));
}

main().catch(e => { console.error('\n' + e.message); process.exit(1); });
