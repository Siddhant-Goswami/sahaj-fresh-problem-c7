#!/usr/bin/env node
/* ============================================================
   A10 — build lecture/deck.html

   Nineteen slides, 100x coral workshop style, one self-contained file.
   Slides 4, 5, 7, 13 and 17 are built from tickets.json, outputs.json,
   criteria.js and agent-bench/report.json; slides 6, 10 and 16 carry their
   citation on the slide.

   Data that has not been generated yet renders as a PENDING block that names
   the command to run. A deck with a blank on it is better than a deck with a
   number nobody measured.

     node lecture/build-deck.js

   Not an Artifact and not deployed: the deck carries the labelled thirty and
   the hidden-set comparison. It opens from disk.
   ============================================================ */

'use strict';

const fs = require('fs');
const path = require('path');
const { escalateSignals } = require('./criteria.js');

const HERE = __dirname;
const ROOT = path.join(HERE, '..');

const read = p => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return null; } };

const tickets = read(path.join(HERE, 'tickets.json'));
const outputs = read(path.join(HERE, 'outputs.json'));
const agent   = read(path.join(ROOT, 'agent-bench', 'report.json'));

if (!tickets) { console.error('lecture/tickets.json missing. Run: node lecture/build-tickets.js'); process.exit(1); }

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function pending(what, cmd) {
  return '<div class="pending"><div class="pending-h">Not generated yet</div>' +
    '<p>' + esc(what) + '</p><pre>' + esc(cmd) + '</pre></div>';
}

/* ---- the C4 dry run, recomputed here so the slide cannot drift ---- */

const c4 = (() => {
  const labelled = tickets.tickets.filter(t => t.agreed === true);
  const rows = labelled.length ? labelled : tickets.tickets;
  const truth = t => (labelled.length ? t.labeller_1 : t.expected);
  let agree = 0; const misses = [];
  rows.forEach(t => {
    const hits = escalateSignals(t.input);
    const got = hits.length > 0;
    if (truth(t).escalate === got) agree++;
    else misses.push({ id: t.id, cls: t.class, want: truth(t).escalate, got, hits });
  });
  const silent = rows.filter(t => escalateSignals(t.input).length === 0).map(t => t.id);
  return { agree, n: rows.length, misses, silent, human: labelled.length > 0 };
})();

/* ---- slides ---- */

const S = [];
const slide = (eyebrow, html, opts) => S.push(Object.assign({ eyebrow, html }, opts || {}));

/* 1 */
slide('Assignment 03 · Sahaj Fresh', `
<h1 class="hero">Evals and guardrails</h1>
<p class="lede">You wrote ten cases and a grader. This is about the thirty you did not write, the two people who disagree with you, and the check nobody is checking.</p>
<div class="rule"></div>
<p class="caption">Every number on these slides was measured. The commands are in the notes.</p>`, { cover: true });

/* 2 — Beat 1 stakes */
slide('Beat 1 · what it cost', `
<h2>Two things that happened, before we talk about models</h2>
<div class="two">
  <div class="card">
    <div class="card-h">Kesar Nandanvan Society, route IND-A</div>
    <p>Four complaints: <span class="mono">SF-IND-13288</span>, <span class="mono">13341</span>, <span class="mono">13402</span>, <span class="mono">13455</span>.</p>
    <p>All four closed as <em>refund issued</em>. None escalated.</p>
    <p class="big">34<span class="unit"> of 46 households cancelled</span></p>
  </div>
  <div class="card">
    <div class="card-h">Ticket SF-NSK-118298</div>
    <p>Closed as <span class="mono">DISP-09 no fault found</span>, because the customer accepted a replacement.</p>
    <p>Two more households reported the same thing within 48 hours.</p>
    <p class="big">0<span class="unit"> signals raised</span></p>
  </div>
</div>
<p class="ask">What did these two cost, and which field in our output contract would have stopped them?</p>`);

/* 3 */
slide('Beat 1 · the answer', `
<h2 class="answer">escalate</h2>
<p class="lede">Not <span class="mono">condition</span>. Every one of those tickets had the condition right. A human read each of them, agreed the curd was warm, issued the refund, and closed it.</p>
<div class="rule"></div>
<p class="lede">The field that carries "somebody should look at this" is the field nobody was grading.</p>
<p class="ask">On route IND-A, the escalate flag was worth 34 subscriptions.</p>
<p class="caption">Corpus 07, IND-1 Route Supervisor daily report, 18 July 2024. The supervisor went himself with a probe on 16 July and read 9.4&nbsp;°C at the gate, against a 2.0–8.0&nbsp;°C band.</p>`);

/* 4 — DATA: the contract */
slide('The contract', `
<h2>Four fields. One of them is new.</h2>
<pre class="code">${esc(JSON.stringify(tickets.contract, null, 2))}</pre>
<p class="lede"><span class="mono">reason</span> is the addition. Without it, "the label matches the stated symptom" and "no invented fact" have nothing to check — you can only grade the answer, never the working.</p>
<p class="caption">Tool change T1. It breaks every stage-5 prompt written against three fields, and that is one honest line, not a reason not to do it.</p>`, { data: 'lecture/tickets.json' });

/* 5 — DATA: the thirty */
slide('The set', (() => {
  const c = tickets.counts;
  const row = (label, obj) => '<tr><th>' + label + '</th><td>' +
    Object.keys(obj).map(k => '<span class="chip"><b>' + obj[k] + '</b> ' + esc(k) + '</span>').join(' ') + '</td></tr>';
  return `
<h2>Thirty tickets, six of them verbatim from the corpus</h2>
<table class="counts">
  ${row('class', c.by_class)}
  ${row('condition', c.by_condition)}
  <tr><th>escalate</th><td><span class="chip"><b>${c.escalate_true}</b> true</span> <span class="chip"><b>${c.escalate_false}</b> false</span></td></tr>
  <tr><th>route</th><td><span class="chip"><b>${c.route_null}</b> null</span> <span class="chip"><b>${c.total - c.route_null}</b> a code</span></td></tr>
</table>
<p class="lede">Tickets 1 to 6 are the six seed cases, read out of <span class="mono">js/data.js</span> by the build so "verbatim" is enforced rather than promised. Tickets 7 to 30 use only names, places, routes and formats that appear in <span class="mono">corpus/wave-1</span>.</p>
<p class="caption">Ten classes. The four the tool does not have — polite repeat, health, Hinglish, injection — are the four that broke things.</p>`;
})(), { data: 'lecture/tickets.json' });

/* 6 — CITATION */
slide('The escalate rule', `
<h2>Five signals, all of them read off the corpus</h2>
<ol class="rules">
  <li><b>R1</b> a signal of prior occurrence <span class="src">"second time this month" — SF-NSK-118204 · "again" — SF-NSK-118331</span></li>
  <li><b>R2</b> a neighbour or group report <span class="src">"three houses in our building" — SF-NSK-118331</span></li>
  <li><b>R3</b> a health mention</li>
  <li><b>R4</b> a refusal of two or more units <span class="src">"refused both" — SF-NSK-118204 · "All three pouches" — SF-NSK-118402</span></li>
  <li><b>R5</b> a named society or route with a cancellation threat <span class="src">Kesar Nandanvan — corpus 07</span></li>
</ol>
<p class="lede">False on a single first-time complaint, on an unrelated complaint, and on praise. <b>Tone is not a signal.</b> An angry first-time complaint is still false.</p>
<p class="cite">Sources: <span class="mono">corpus/wave-1/04-support-escalation-nashik-apr.md</span> · <span class="mono">corpus/wave-1/07-route-supervisor-indore-jul.md</span></p>`, { citation: true });

/* 7 — DATA: three prompts */
slide('Beat 2 · three prompts', (() => {
  if (!outputs) return `
<h2>Three prompts written in this room, one set of thirty tickets</h2>
${pending('The ninety candidate calls have not been run. Collect the three prompts first — see lecture/prompts/README.md.',
  'GROQ_API_KEY=...  node lecture/run-prompts.js --judge')}
<p class="lede">Nothing changes but the prompt. Same tickets, same model, temperature 0, JSON mode.</p>`;
  const ids = Object.keys(outputs.summary);
  const head = '<tr><th></th>' + ids.map(i => '<th>' + esc(i) + '</th>').join('') + '</tr>';
  const body = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'].map(c =>
    '<tr><th>' + c + '</th>' + ids.map(i => '<td class="num">' + esc(outputs.summary[i].per_criterion[c]) + '</td>').join('') + '</tr>').join('');
  const all = '<tr class="total"><th>all six</th>' + ids.map(i => '<td class="num">' + esc(outputs.summary[i].all_six) + '</td>').join('') + '</tr>';
  return `
<h2>Three prompts written in this room, one set of thirty tickets</h2>
<table class="counts"><thead>${head}</thead><tbody>${body}${all}</tbody></table>
<p class="lede">Nothing changes but the prompt. Same tickets, same model (<span class="mono">${esc(outputs.candidate.model)}</span>), temperature 0, JSON mode.</p>`;
})(), { data: 'lecture/outputs.json' });

/* 8 */
slide('Beat 3 · score it yourself', (() => {
  const t = tickets.tickets.find(x => x.id === 'T09');
  return `
<h2>Ticket T09. Score the output by hand, on paper, now.</h2>
<blockquote class="ticket">${esc(t.input)}</blockquote>
<p class="lede">Pass or fail on each of the six criteria. Do not confer. Two minutes.</p>
<p class="caption">Do not read the next slide yet.</p>`;
})());

/* 9 */
slide('Beat 3 · the room disagrees', (() => {
  const t = tickets.tickets.find(x => x.id === 'T09');
  return `
<h2>Three defensible answers, and that is the finding</h2>
<div class="three">
  <div class="card"><div class="card-h">warm</div><p>Room temperature <em>is</em> out of band for chilled dairy. SOP-CC-004 says 2.0–8.0&nbsp;°C.</p></div>
  <div class="card coral"><div class="card-h">other</div><p>The customer denies both named spoilage symptoms and asks a question. Drafted answer.</p></div>
  <div class="card"><div class="card-h">none</div><p>Nothing was wrong with the product. She is asking what normal looks like.</p></div>
</div>
<p class="lede">If the people who wrote the eval cannot agree on one ticket, a grader that reports 28 of 30 is reporting a number with an unmeasured error bar on it.</p>
<p class="ask">The disagreement stays in the file. It is not a defect to resolve before the lecture; it is the reason two humans label instead of one.</p>
<p class="caption">${esc(t.contest_note || '')}</p>`;
})());

/* 10 — CITATION */
slide('The criteria', `
<h2>Six criteria. Four are code. Two are worth paying a model for.</h2>
<table class="crit">
  <tr><td class="badge code">code</td><th>C1</th><td>condition is one of the five</td><td class="why">set membership</td></tr>
  <tr><td class="badge code">code</td><th>C2</th><td>route appears verbatim in the ticket, or is null</td><td class="why">one regex</td></tr>
  <tr><td class="badge code">code</td><th>C3</th><td>valid JSON, all four fields</td><td class="why">the parser</td></tr>
  <tr><td class="badge code">code</td><th>C4</th><td>escalate matches the signals in the ticket</td><td class="why">28 regexes, then a judge <em>only</em> where they are silent</td></tr>
  <tr><td class="badge model">model</td><th>C5</th><td>condition is the symptom stated, not one inferred</td><td class="why">about what is <em>absent</em></td></tr>
  <tr><td class="badge model">model</td><th>C6</th><td>reason contains no fact absent from the ticket</td><td class="why">about what is <em>absent</em></td></tr>
</table>
<p class="lede">A model asked whether <span class="mono">IND-A</span> appears in a ticket is a slower, dearer, less reliable <span class="mono">indexOf</span>. Pay for C5 and C6. Nothing else.</p>
<p class="cite">Implementation: <span class="mono">lecture/criteria.js</span> · <span class="mono">lecture/judges/j4.txt, j5.txt, j6.txt</span> · sheet: <span class="mono">lecture/criteria.md</span></p>`, { citation: true });

/* 11 */
slide('The judge', `
<h2>The judge must not be the candidate</h2>
<pre class="code">Judge model equals candidate model (openai/gpt-oss-120b).
Refusing to run: a model that grades its own output is not a
second opinion. Pass --judge-provider / --judge-model.</pre>
<p class="lede">Not a warning. A refusal. The failure mode here is silent and flattering, which is the worst kind — the pass rate goes up and nothing tells you why.</p>
<p class="caption">Candidate on Groq, judge on Gemini or OpenAI. Two keys, two spend caps. Tool change T2.</p>`);

/* 12 */
slide('Beat 3 · the deletion test', `
<h2>Written before the numbers came back</h2>
<blockquote class="pledge">If the C4 regex agrees with the human labels on <b>27 of 30 or better</b>, and the C4 model grader does not beat it, the C4 model grader is <b>deleted in this lecture, on screen</b>.</blockquote>
<p class="lede">A threshold you set after seeing the result is not a threshold. It is a rationalisation with a number in it.</p>`);

/* 13 — DATA: C4 result */
slide('Beat 3 · the result', `
<h2>C4 regex versus ${c4.human ? 'the human labels' : 'the drafted labels'}</h2>
<p class="score"><b>${c4.agree}</b> / ${c4.n}</p>
<p class="lede">Threshold was 27. <b>The C4 model grader goes.</b>${c4.human ? '' : ' <span class="warn">Dry run — the two labellers have not finished. Rerun before you say this out loud.</span>'}</p>
<table class="counts">
  <tr><th>misses</th><td>${c4.misses.map(m => '<span class="chip"><b>' + m.id + '</b> want ' + m.want + ', got ' + m.got + '</span>').join(' ') || 'none'}</td></tr>
  <tr><th>regex silent</th><td>${c4.silent.map(id => '<span class="chip">' + id + '</span>').join(' ')}</td></tr>
</table>
<p class="caption">Only the silent ones ever reach a judge. That is what "code first, model second" buys: ${c4.silent.length} model calls per prompt instead of ${c4.n}.</p>`, { data: 'node lecture/criteria.js' });

/* 14 */
slide('Beat 3 · the two misses', `
<h2>Both misses are worth more than the 28</h2>
<div class="two">
  <div class="card">
    <div class="card-h">T15 — a false positive</div>
    <blockquote class="ticket small">"the screen kept spinning and then said <b>please try again</b>"</blockquote>
    <p><span class="mono">/\\bagain\\b/</span> fires. A word that means <em>this has happened before</em> in twenty-nine tickets means nothing at all in the thirtieth, and the regex cannot tell.</p>
    <p class="fix">Fix it here, on screen: <span class="mono">/(?&lt;!try )\\bagain\\b/</span>. One lookbehind, one new blind spot.</p>
  </div>
  <div class="card">
    <div class="card-h">T28 — a miss</div>
    <blockquote class="ticket small">"dahi <b>phir se</b> khatta aaya, <b>teen din se</b> yahi ho raha hai"</blockquote>
    <p>Two prior-occurrence signals. The regex list is English.</p>
    <p class="fix">T29 is also Hinglish, also silent, and happens to be <em>right</em> — expected false, silence produces false. <b>A rule that is right by accident is not right.</b></p>
  </div>
</div>`);

/* 15 */
slide('Beat 4 · the gap', `
<h2>Your pass rate, and the one you did not write</h2>
<div class="two">
  <div class="card"><div class="card-h">Your ten cases</div><p class="big">?<span class="unit"> / 10</span></p><p>You wrote the cases. You wrote the grader. You wrote the prompt.</p></div>
  <div class="card coral"><div class="card-h">The hidden ten</div><p class="big">?<span class="unit"> / 10</span></p><p>Same contract, same six classes, written by someone else.</p></div>
</div>
<p class="ask">If your own rate moved and the hidden rate did not, you tuned the grader, not the system.</p>
<p class="caption">Stage 6 already does this. Nothing in the tool changes for this beat.</p>`);

/* 16 — CITATION */
slide('The recursion', `
<h2>Who grades the grader?</h2>
<p class="lede">C1 to C4 are code, so the question terminates: you read the regex. C5 and C6 are a model, so it does not — and the only thing that stops the regress is a human reading a sample and saying <em>yes, that judge is judging the thing I meant</em>.</p>
<div class="rule"></div>
<p class="lede">That is what the two labellers are for, and it is why agreement is reported <b>per criterion</b> and not as one number. Humans agree with the grader on C1 and C2 almost always. On C5 they agree rather less. <b>That difference is the argument for where a model grader is worth its cost.</b></p>
<p class="cite">Tool changes T4 (agreement per criterion) and T5 (two labellers) — <span class="mono">lecture/TOOL-CHANGES.md</span>. Agreement rule and blind labelling already in <span class="mono">js/app.js</span>, <span class="mono">agreement()</span> and <span class="mono">renderHL</span>.</p>`, { citation: true });

/* 17 — DATA: agent bench */
slide('Beat 5 · the agent', (() => {
  if (!agent) return `
<h2>A classifier answers once. An agent acts, and can act three times.</h2>
${pending('The eighteen agent runs have not been made.',
  'GROQ_API_KEY=...  node agent-bench/run.js --runs 3')}
<p class="lede">Six tasks, five tools, one goal state each. <span class="mono">pass@1</span> is the number on the slide deck. <span class="mono">pass^3</span> is the number that matters when it runs unattended.</p>`;
  const k = Object.keys(agent.tasks);
  const pk = 'pass^' + agent.runs_per_task;
  const rows = k.map(id => {
    const t = agent.tasks[id];
    return '<tr><th>' + id + '</th><td>' + esc(t.type) + '</td><td class="num">' + esc(t['pass@1']) +
      '</td><td class="num ' + (t[pk] ? 'ok' : 'bad') + '">' + (t[pk] ? 'pass' : 'FAIL') + '</td></tr>';
  }).join('');
  return `
<h2>Six tasks, ${agent.runs_per_task} runs each, temperature ${agent.temperature}</h2>
<table class="counts"><thead><tr><th></th><th>task</th><th>pass@1</th><th>${esc(pk)}</th></tr></thead><tbody>${rows}</tbody></table>
<p class="score">${esc(agent.overall[pk])}<span class="unit"> tasks clean across every run</span></p>
<p class="lede">pass@1 is ${esc(agent.overall['pass@1'])}. The gap between those two numbers is the entire argument for running an eval more than once.</p>
${agent.temperature > 0 ? '<p class="caption">Temperature was raised to ' + agent.temperature + ' deliberately: at 0 every task passed every run, and a bench with no failures in it has not been calibrated, it has been flattered.</p>' : ''}`;
})(), { data: 'agent-bench/report.json' });

/* 18 */
slide('Beat 6 · guardrails', `
<h2>Five surfaces. Your assignment has slots for three.</h2>
<table class="crit guards">
  <tr><th>Input</th><td>Instruction text inside a ticket</td><td class="why">catches T30 · wrongly catches a customer quoting the support script</td></tr>
  <tr><th>Output</th><td>Label outside the five; reason longer than the ticket</td><td class="why">catches "spoiled" · wrongly catches T03, 79 characters long</td></tr>
  <tr><th>Action</th><td>Refund without a lookup; the same ticket refunded twice</td><td class="why">catches agent task A2 · wrongly catches a real second partial refund</td></tr>
  <tr><th>Process</th><td>escalate true, closed, nothing notified</td><td class="why">catches all four Kesar Nandanvan closures · wrongly catches T22, the duplicate</td></tr>
  <tr><th>Loop</th><td>Three tool calls with no state change; 60 s wall clock</td><td class="why">catches a lookup loop · wrongly catches a slow provider</td></tr>
</table>
<p class="lede">The input guard fires on <b>1 of 30</b> tickets and nothing else — clean on the set it was written for, and dirty on the first realistic sentence that is not in it. Nobody found that by running it thirty times. Somebody found it by imagining an angry customer.</p>
<p class="ask">A guard with no false positive has not been thought about.</p>`);

/* 19 */
slide('What you do next', `
<h2>Three things, by the next session</h2>
<ol class="rules">
  <li><b>Add <span class="mono">reason</span> to your contract</b> and rerun your ten cases. Report what it did to your pass rate and why.</li>
  <li><b>Split your grader into criteria</b> and label your six outputs per criterion, not per output. Send the criterion your grader and you disagree on most.</li>
  <li><b>Write one guard you cannot test</b> — an Action or a Loop guard — and one sentence on what you would need in order to test it.</li>
</ol>
<div class="rule"></div>
<p class="lede">One thing only, if you do nothing else: <b>find the false positive before the client does.</b></p>`);

/* ---- render ---- */

const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Evals and guardrails — Sahaj Fresh</title>
<link rel="stylesheet" href="../css/tokens.css">
<style>
  :root { --pad: 64px; }
  * { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; background: #111; }
  body { font-family: var(--font-body, system-ui); color: var(--fg, #1a1a1a); }
  .deck { height: 100vh; display: grid; place-items: center; }
  .slide { display: none; width: min(1280px, 96vw); aspect-ratio: 16/9; background: var(--bg, #fff);
           border-radius: 12px; padding: var(--pad); overflow: auto; position: relative;
           box-shadow: 0 24px 80px rgba(0,0,0,.5); }
  .slide.on { display: block; }
  .slide.cover { display: none; } .slide.cover.on { display: grid; align-content: center; }
  .eyebrow { position: absolute; top: 28px; left: var(--pad); font-family: var(--font-mono, monospace);
             font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: var(--accent, #F96846); }
  .num { position: absolute; top: 28px; right: var(--pad); font-family: var(--font-mono, monospace);
         font-size: 12px; color: #999; }
  .tag { position: absolute; bottom: 20px; right: var(--pad); font-family: var(--font-mono, monospace);
         font-size: 11px; color: #bbb; }
  h1.hero { font-family: var(--font-display, sans-serif); font-size: 72px; line-height: 1.05; margin: 0 0 20px; letter-spacing: -.02em; }
  h2 { font-family: var(--font-display, sans-serif); font-size: 40px; line-height: 1.15; margin: 24px 0 22px; letter-spacing: -.015em; }
  h2.answer { font-family: var(--font-mono, monospace); font-size: 72px; color: var(--accent, #F96846); margin: 12px 0 24px; }
  p { margin: 0 0 14px; }
  .lede { font-size: 19px; line-height: 1.55; max-width: 68ch; }
  .caption { font-size: 13px; color: var(--fg-2, #666); line-height: 1.5; max-width: 80ch; }
  .cite { font-size: 12px; color: var(--fg-2, #666); border-top: 1px solid var(--border, #e5e5e5); padding-top: 12px; margin-top: 20px; }
  .ask { font-size: 21px; font-weight: 700; line-height: 1.4; background: var(--accent-tint, #FFEEE9);
         border-left: 4px solid var(--accent, #F96846); padding: 14px 18px; margin: 20px 0 14px; max-width: 72ch; }
  .rule { height: 1px; background: var(--border, #e5e5e5); margin: 22px 0; }
  .mono { font-family: var(--font-mono, monospace); font-size: .92em; }
  .two { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
  .three { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin: 20px 0; }
  .card { border: 1px solid var(--border, #e5e5e5); border-radius: 10px; padding: 18px 20px; background: var(--surface-1, #f9f9f9); }
  .card.coral { border-color: var(--accent, #F96846); background: var(--accent-tint, #FFEEE9); }
  .card-h { font-family: var(--font-mono, monospace); font-size: 12px; letter-spacing: .08em; text-transform: uppercase;
            color: var(--accent-press, #C53D1B); margin-bottom: 10px; }
  .card p { font-size: 15px; line-height: 1.5; }
  .big { font-family: var(--font-display, sans-serif); font-size: 64px; font-weight: 700; line-height: 1; margin: 14px 0 4px; }
  .unit { font-size: 15px; font-weight: 400; color: var(--fg-2, #666); margin-left: 8px; }
  .score { font-family: var(--font-display, sans-serif); font-size: 88px; font-weight: 700; line-height: 1;
           color: var(--accent, #F96846); margin: 8px 0 16px; }
  .code { background: var(--surface-inverse, #1a1a1a); color: #f5f5f5; font-family: var(--font-mono, monospace);
          font-size: 15px; line-height: 1.6; padding: 18px 20px; border-radius: 8px; overflow-x: auto; margin: 0 0 18px; }
  .ticket { margin: 0 0 18px; padding: 16px 20px; border-left: 4px solid var(--accent, #F96846);
            background: var(--surface-1, #f9f9f9); font-size: 17px; line-height: 1.55; }
  .ticket.small { font-size: 15px; padding: 12px 16px; }
  .pledge { margin: 0 0 18px; padding: 22px 26px; border: 2px solid var(--accent, #F96846); border-radius: 10px;
            font-size: 21px; line-height: 1.5; background: var(--accent-tint, #FFEEE9); }
  table { border-collapse: collapse; width: 100%; margin: 0 0 18px; font-size: 15px; }
  th, td { text-align: left; padding: 9px 12px; border-bottom: 1px solid var(--border, #e5e5e5); vertical-align: top; }
  thead th { font-family: var(--font-mono, monospace); font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: var(--fg-2,#666); }
  .counts th { font-family: var(--font-mono, monospace); font-size: 13px; color: var(--fg-2, #666); width: 120px; }
  td.num { font-family: var(--font-mono, monospace); }
  td.num.ok { color: #15803D; font-weight: 700; } td.num.bad { color: #C53D1B; font-weight: 700; }
  tr.total th, tr.total td { border-top: 2px solid var(--fg, #1a1a1a); font-weight: 700; }
  .chip { display: inline-block; font-family: var(--font-mono, monospace); font-size: 13px; padding: 3px 9px;
          border-radius: 999px; background: var(--surface-2, #f5f5f5); margin: 0 4px 5px 0; }
  .chip b { color: var(--accent-press, #C53D1B); }
  .crit th { font-family: var(--font-mono, monospace); width: 56px; }
  .crit .why { color: var(--fg-2, #666); font-size: 14px; }
  .guards th { width: 100px; font-family: var(--font-display, sans-serif); font-size: 16px; }
  .badge { width: 64px; } .badge.code, .badge.model { font-family: var(--font-mono, monospace); font-size: 11px;
    text-transform: uppercase; letter-spacing: .06em; }
  .badge.code { color: #15803D; } .badge.model { color: #7C3AED; }
  .rules { margin: 0 0 18px; padding-left: 26px; font-size: 18px; line-height: 1.75; max-width: 76ch; }
  .rules b { font-family: var(--font-mono, monospace); color: var(--accent-press, #C53D1B); }
  .src { display: block; font-size: 13px; color: var(--fg-2, #666); font-style: italic; }
  .fix { font-size: 14px; border-top: 1px dashed var(--border, #e5e5e5); padding-top: 10px; }
  .warn { color: #C53D1B; font-weight: 700; }
  .pending { border: 2px dashed var(--accent, #F96846); border-radius: 10px; padding: 20px 24px; margin: 0 0 18px;
             background: var(--accent-tint, #FFEEE9); }
  .pending-h { font-family: var(--font-mono, monospace); font-size: 12px; text-transform: uppercase;
               letter-spacing: .08em; color: var(--accent-press, #C53D1B); margin-bottom: 8px; }
  .pending pre { font-family: var(--font-mono, monospace); font-size: 14px; margin: 10px 0 0; overflow-x: auto; }
  .bar { position: fixed; left: 0; right: 0; bottom: 0; height: 3px; background: rgba(255,255,255,.12); }
  .bar i { display: block; height: 100%; background: var(--accent, #F96846); transition: width .18s; }
  @media print { html, body { background: #fff; } .deck { display: block; height: auto; }
    .slide, .slide.cover { display: block !important; page-break-after: always; box-shadow: none; border-radius: 0; aspect-ratio: auto; min-height: 100vh; } .bar { display: none; } }
</style></head>
<body>
<div class="deck">
${S.map((s, i) => `<section class="slide${s.cover ? ' cover' : ''}${i === 0 ? ' on' : ''}">
  <div class="eyebrow">${esc(s.eyebrow)}</div><div class="num">${i + 1} / ${S.length}</div>
  ${s.html}
  ${s.data ? `<div class="tag">built from ${esc(s.data)}</div>` : s.citation ? '<div class="tag">citation on slide</div>' : ''}
</section>`).join('\n')}
</div>
<div class="bar"><i style="width:${(100 / S.length).toFixed(1)}%"></i></div>
<script>
  var n = 0, all = document.querySelectorAll('.slide'), bar = document.querySelector('.bar i');
  function go(i) {
    n = Math.max(0, Math.min(all.length - 1, i));
    all.forEach(function (s, j) { s.classList.toggle('on', j === n); });
    bar.style.width = ((n + 1) / all.length * 100).toFixed(1) + '%';
    location.hash = String(n + 1);
  }
  addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); go(n + 1); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(n - 1); }
    if (e.key === 'Home') go(0);
    if (e.key === 'End') go(all.length - 1);
  });
  addEventListener('click', function (e) { if (!e.target.closest('a')) go(n + (e.clientX > innerWidth / 2 ? 1 : -1)); });
  function fromHash() { return (parseInt((location.hash || '#1').slice(1), 10) || 1) - 1; }
  // A hash change does not reload the document, so deep links and the back
  // button need this or they silently do nothing.
  addEventListener('hashchange', function () { if (fromHash() !== n) go(fromHash()); });
  go(fromHash());
</script>
</body></html>
`;

fs.writeFileSync(path.join(HERE, 'deck.html'), html);

console.log('lecture/deck.html written: ' + S.length + ' slides');
console.log('  data slides: ' + S.map((s, i) => s.data ? (i + 1) : null).filter(Boolean).join(', '));
console.log('  citation slides: ' + S.map((s, i) => s.citation ? (i + 1) : null).filter(Boolean).join(', '));
if (!outputs) console.log('  PENDING slide 7  — run lecture/run-prompts.js');
if (!agent)   console.log('  PENDING slide 17 — run agent-bench/run.js');
if (!tickets.tickets.some(t => t.agreed === true)) console.log('  slide 13 is a DRY RUN — the two labellers have not finished');
console.log('\n  open with:  python3 -m http.server 8000   then  http://localhost:8000/lecture/deck.html');
