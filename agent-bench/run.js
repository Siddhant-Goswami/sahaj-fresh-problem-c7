#!/usr/bin/env node
/* ============================================================
   A7 / A8 — the harness.

   No framework. OpenAI chat-completions with tools, same adapter shape as
   js/llm.js, so a Groq key works. Tool-calling needs a model that supports
   it: llama-3.3-70b-versatile on Groq is the default.

     GROQ_API_KEY=...  node agent-bench/run.js
     GROQ_API_KEY=...  node agent-bench/run.js --runs 3 --temperature 0.7
     GROQ_API_KEY=...  node agent-bench/run.js --task A2 --runs 1

   Reports pass@1 per task, pass^3 per task, and overall pass^3. pass^3 is
   the fraction of tasks that passed every one of their runs — the number
   that matters when the agent runs unattended, and the number that is
   always worse than the one on the slide deck.

   Transcripts land in agent-bench/runs/{task}-{n}.json, whole: every
   message, every tool call, every tool result, the final state, and the
   per-field grade.
   ============================================================ */

'use strict';

const fs = require('fs');
const path = require('path');
const { SCHEMAS, POLICY, freshState, execute } = require('./tools.js');
const { TASKS, grade } = require('./tasks.js');

const arg = (f, d) => { const i = process.argv.indexOf(f); return i === -1 ? d : process.argv[i + 1]; };

const PROVIDERS = {
  groq:   { label: 'Groq',   url: 'https://api.groq.com/openai/v1/chat/completions', env: 'GROQ_API_KEY',   model: 'llama-3.3-70b-versatile' },
  openai: { label: 'OpenAI', url: 'https://api.openai.com/v1/chat/completions',      env: 'OPENAI_API_KEY', model: 'gpt-4o-mini' },
};

const RUNS        = parseInt(arg('--runs', '3'), 10);
const TEMPERATURE = parseFloat(arg('--temperature', '0'));
const ONLY        = arg('--task', null);
const MAX_STEPS   = parseInt(arg('--max-steps', '12'), 10);
const WALL_MS     = parseInt(arg('--wall-ms', '60000'), 10);

const providerId = arg('--provider', 'groq');
const def = PROVIDERS[providerId];
if (!def) { console.error('unknown provider ' + providerId); process.exit(1); }
const KEY = process.env[def.env];
if (!KEY) { console.error('no key in $' + def.env); process.exit(1); }
const MODEL = arg('--model', def.model);

/* ---- one completion ---- */

const RETRY_ON = [429, 500, 502, 503, 529];
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function complete(messages, attempt) {
  attempt = attempt || 0;
  const res = await fetch(def.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + KEY },
    body: JSON.stringify({ model: MODEL, messages, tools: SCHEMAS, tool_choice: 'auto', temperature: TEMPERATURE }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    let msg = txt; try { const j = JSON.parse(txt); msg = (j.error && j.error.message) || txt; } catch (_) {}
    if (RETRY_ON.indexOf(res.status) !== -1 && attempt < 4) {
      const m = /try again in\s+([\d.]+)\s*s/i.exec(msg);
      const wait = (m ? parseFloat(m[1]) * 1000 + 250 : Math.min(1000 * Math.pow(2, attempt), 8000)) + Math.floor(Math.random() * 400);
      process.stderr.write('r');
      await sleep(wait);
      return complete(messages, attempt + 1);
    }
    throw new Error(def.label + ' ' + res.status + ': ' + msg);
  }
  const j = await res.json();
  return { message: (j.choices && j.choices[0] && j.choices[0].message) || {}, usage: j.usage || {} };
}

/* ---- one run of one task ---- */

async function runOnce(task, n) {
  const state = freshState();
  const messages = [
    { role: 'system', content: POLICY },
    { role: 'user', content: task.input },
  ];
  const transcript = [];
  const started = Date.now();
  let steps = 0, usageIn = 0, usageOut = 0, halted = null;
  let sameStateStreak = 0;
  let lastFingerprint = fingerprint(state);

  while (true) {
    if (steps >= MAX_STEPS) { halted = 'max steps (' + MAX_STEPS + ') reached without close'; break; }
    if (Date.now() - started > WALL_MS) { halted = 'wall clock over ' + WALL_MS + 'ms'; break; }

    const { message, usage } = await complete(messages, 0);
    steps++;
    usageIn += usage.prompt_tokens || 0;
    usageOut += usage.completion_tokens || 0;
    messages.push(message);
    transcript.push({ step: steps, role: 'assistant', content: message.content || null, tool_calls: message.tool_calls || null });

    const calls = message.tool_calls || [];
    if (!calls.length) {
      // No tool call and no close yet. One nudge, then stop: an agent that
      // has decided to write an essay is not going to close the ticket.
      if (state.closed[task.ticket]) break;
      if (halted === null && transcript.filter(t => t.role === 'assistant' && !t.tool_calls).length > 1) {
        halted = 'stopped calling tools without closing the ticket'; break;
      }
      messages.push({ role: 'user', content: 'Continue. Close the ticket when you are done.' });
      transcript.push({ step: steps, role: 'user', content: 'Continue. Close the ticket when you are done.' });
      continue;
    }

    for (const c of calls) {
      let args = {};
      try { args = JSON.parse(c.function.arguments || '{}'); }
      catch (e) { args = { _unparseable: c.function.arguments }; }
      const result = execute(state, c.function.name, args);
      messages.push({ role: 'tool', tool_call_id: c.id, content: JSON.stringify(result) });
      transcript.push({ step: steps, role: 'tool', name: c.function.name, args, result });
    }

    // Loop guard, the same one as the guardrail table's loop surface.
    const fp = fingerprint(state);
    sameStateStreak = fp === lastFingerprint ? sameStateStreak + calls.length : 0;
    lastFingerprint = fp;
    if (sameStateStreak >= 3) { halted = 'three tool calls without a state change'; break; }

    if (state.closed[task.ticket]) break;
  }

  const g = grade(task, state);
  const record = {
    task: task.id,
    run: n,
    model: MODEL,
    provider: providerId,
    temperature: TEMPERATURE,
    ticket: task.ticket,
    input: task.input,
    steps,
    wall_ms: Date.now() - started,
    halted,
    usage: { in: usageIn, out: usageOut },
    calls: state.calls,
    state: { refunds: state.refunds, qa_notified: state.qa_notified, replies: state.replies, closed: state.closed, lookups: state.lookups },
    goal: task.goal,
    grade: g,
    transcript,
  };

  const runsDir = path.join(__dirname, 'runs');
  fs.mkdirSync(runsDir, { recursive: true });
  fs.writeFileSync(path.join(runsDir, task.id + '-' + n + '.json'), JSON.stringify(record, null, 2) + '\n');
  return record;
}

function fingerprint(s) {
  return JSON.stringify([s.refunds, s.qa_notified, Object.keys(s.replies).map(k => s.replies[k].length), s.closed]);
}

/* ---- policy violations worth naming even when the goal state passes ---- */

function violations(task, record) {
  const v = [];
  const calls = record.calls;
  const firstRefund = calls.findIndex(c => c.name === 'issue_refund');
  const firstLookup = calls.findIndex(c => c.name === 'lookup_history');
  if (firstRefund !== -1 && (firstLookup === -1 || firstLookup > firstRefund)) v.push('refunded before looking up history');
  if (calls.filter(c => c.name === 'issue_refund' && c.args.ticket === task.ticket).length > 1) v.push('refunded the same ticket twice');
  if (calls.filter(c => c.name === 'reply' && c.args.ticket === task.ticket).length > 1) v.push('more than one reply');
  if (calls.filter(c => c.name === 'close').length > 1) v.push('closed more than once');
  if (!record.state.closed[task.ticket]) v.push('ticket never closed');
  if (record.halted) v.push('halted: ' + record.halted);
  return v;
}

/* ---- main ---- */

async function main() {
  const tasks = ONLY ? TASKS.filter(t => t.id === ONLY) : TASKS;
  if (!tasks.length) { console.error('no task ' + ONLY); process.exit(1); }

  console.error(def.label + ' / ' + MODEL + ' · temperature ' + TEMPERATURE + ' · ' + RUNS + ' run(s) per task');
  console.error(tasks.length * RUNS + ' runs\n');

  const all = [];
  for (const task of tasks) {
    process.stderr.write(task.id + ' (' + task.type + ') ');
    for (let n = 1; n <= RUNS; n++) {
      try {
        const rec = await runOnce(task, n);
        rec.violations = violations(task, rec);
        all.push(rec);
        process.stderr.write(rec.grade.pass ? '✓' : '✗');
      } catch (e) {
        all.push({ task: task.id, run: n, error: e.message, grade: { pass: false, fields: [] }, violations: ['call failed: ' + e.message] });
        process.stderr.write('!');
      }
    }
    process.stderr.write('\n');
  }

  /* ---- report ---- */

  const report = { artifact: 'A8', run: new Date().toISOString(), provider: providerId, model: MODEL, temperature: TEMPERATURE, runs_per_task: RUNS, tasks: {} };

  tasks.forEach(task => {
    const mine = all.filter(r => r.task === task.id);
    const passes = mine.filter(r => r.grade && r.grade.pass).length;
    const failedFields = {};
    mine.forEach(r => (r.grade && r.grade.fields || []).forEach(f => { if (!f.pass) failedFields[f.field] = (failedFields[f.field] || 0) + 1; }));
    report.tasks[task.id] = {
      type: task.type,
      'pass@1': passes + ' / ' + mine.length,
      ['pass^' + RUNS]: passes === mine.length,
      failed_fields: failedFields,
      violations: [].concat(...mine.map(r => r.violations || [])),
    };
  });

  const clean = tasks.filter(t => report.tasks[t.id]['pass^' + RUNS]).length;
  report.overall = {
    ['pass^' + RUNS]: clean + ' / ' + tasks.length,
    'pass@1': all.filter(r => r.grade && r.grade.pass).length + ' / ' + all.length,
  };

  fs.writeFileSync(path.join(__dirname, 'report.json'), JSON.stringify(report, null, 2) + '\n');

  console.log('\n' + JSON.stringify(report, null, 2));
  console.error('\ntranscripts: agent-bench/runs/  ·  report: agent-bench/report.json');

  if (clean === tasks.length && RUNS >= 3 && TEMPERATURE === 0) {
    console.error('\nEvery task passed every run. The lecture needs a failure to read.');
    console.error('Rerun at temperature 0.7 and say on the slide that the temperature was raised and why:');
    console.error('  node agent-bench/run.js --temperature 0.7');
  }
}

main().catch(e => { console.error('\n' + e.message); process.exit(1); });
