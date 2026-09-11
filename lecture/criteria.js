/* ============================================================
   A4 — the criteria, as code.

   Six criteria, one per thing worth checking. C1 to C4 are code graders and
   live here in full. C5 and C6 are model graders and live in lecture/judges/
   as prompts; this file only declares them so the sheet and the runner agree
   on what exists.

   This is the module lecture/run-prompts.js grades with, and the module tool
   change T3 lifts into app.js gradeCase. Nothing here reads the tool's state,
   so it runs under node and in the browser unchanged.

   Self-test:  node lecture/criteria.js
   ============================================================ */

'use strict';

const CONDITIONS = ['warm', 'sour', 'watery', 'other', 'none'];
const ROUTE_RE = /\b(?:IND|NSK)-[A-D]\b/g;

/* ---- C4: the escalate signals, as one regex list ----
   Each entry is [rule, regex]. The rule ids are the five in the escalate rule
   at section 1 of the build plan. Order is not significant; any hit escalates.
   Deliberately English-only: T28 and T29 are Hinglish and this list misses
   them, which is the finding the lecture wants on screen, not a bug to fix
   before the lecture. */

const ESCALATE_SIGNALS = [
  ['R1', /\bagain\b/i],
  ['R1', /\b(second|third|fourth|fifth)\s+time\b/i],
  ['R1', /\blast\s+time\b/i],
  ['R1', /\blately\b/i],
  ['R1', /\bkeeps?\s+happening\b/i],
  ['R1', /\bas\s+before\b/i],
  ['R1', /\b(deliveries|days|mornings|weeks)\s+running\b/i],
  ['R1', /\bcomplained\s+(four|three|two|several|many)\s+times\b/i],
  ['R1', /\bcalled\s+yesterday\b/i],
  ['R2', /\bneighbour/i],
  ['R2', /\bother\s+(flats|households|houses)\b/i],
  ['R2', /\b(two|three|four|five|six|several)\s+(flats|houses|households)\b/i],
  ['R2', /\b(fourth|third|second)\s+flat\b/i],
  ['R2', /\bin\s+(our|the)\s+building\b/i],
  ['R2', /\b\w+\s+subscribers\b/i],
  ['R3', /\bunwell\b/i],
  ['R3', /\bsick\b/i],
  ['R3', /\bstomach\b/i],
  ['R3', /\bhospital\b/i],
  ['R3', /\bdoctor\b/i],
  ['R4', /\brefused\s+both\b/i],
  ['R4', /\brefused\s+all\b/i],
  ['R4', /\btook\s+(them|all\s+three|both)\s+back\b/i],
  ['R4', /\ball\s+three\s+pouches\b/i],
  ['R5', /\bcancel(led|lation)?\b/i],
  ['R5', /\bsociety\b/i],
  ['R5', /\bsecretary\b/i],
  ['R5', /\bcommittee\b/i],
];

function escalateSignals(ticket) {
  const t = String(ticket || '');
  const hits = [];
  ESCALATE_SIGNALS.forEach(([rule, re]) => {
    const m = t.match(re);
    if (m) hits.push({ rule, matched: m[0] });
  });
  return hits;
}

function routesIn(ticket) {
  return String(ticket || '').toUpperCase().match(ROUTE_RE) || [];
}

/* ---- the criteria ---- */

const CRITERIA = [
  {
    id: 'C1',
    text: 'condition is one of the five',
    grader: 'code',
    implementation: 'set membership against ["warm","sour","watery","other","none"]',
    run: ({ output }) => {
      const v = output && output.condition;
      return CONDITIONS.indexOf(v) !== -1
        ? { pass: true,  evidence: String(v) }
        : { pass: false, evidence: 'condition is ' + JSON.stringify(v) + ', outside the contract' };
    },
  },

  {
    id: 'C2',
    text: 'route is a route code present verbatim in the ticket, or null when none is present',
    grader: 'code',
    implementation: 'match /\\b(?:IND|NSK)-[A-D]\\b/g against the ticket, compare to the output',
    run: ({ ticket, output }) => {
      const inText = routesIn(ticket);
      const got = output && output.route != null && output.route !== '' ? String(output.route).toUpperCase().trim() : null;
      if (got === null) {
        return inText.length === 0
          ? { pass: true,  evidence: 'no route code in the ticket, output null' }
          : { pass: false, evidence: 'ticket carries ' + inText.join(', ') + ', output was null' };
      }
      return inText.indexOf(got) !== -1
        ? { pass: true,  evidence: got + ' appears in the ticket' }
        : { pass: false, evidence: got + ' does not appear in the ticket (ticket has ' + (inText.join(', ') || 'no route code') + ')' };
    },
  },

  {
    id: 'C3',
    text: 'output is valid JSON with all four fields',
    grader: 'code',
    implementation: 'parseContract, extended for reason',
    run: ({ output, parseError }) => {
      if (parseError) return { pass: false, evidence: parseError };
      const missing = ['condition', 'route', 'escalate', 'reason']
        .filter(k => !(output && Object.prototype.hasOwnProperty.call(output, k)));
      if (missing.length) return { pass: false, evidence: 'missing field(s): ' + missing.join(', ') };
      if (typeof output.escalate !== 'boolean') return { pass: false, evidence: 'escalate is not a boolean' };
      if (typeof output.reason !== 'string' || !output.reason.trim()) return { pass: false, evidence: 'reason is empty' };
      return { pass: true, evidence: 'four fields, escalate boolean, reason non-empty' };
    },
  },

  {
    id: 'C4',
    text: 'escalate is true when the ticket carries any escalate signal, false otherwise',
    grader: 'code first, model second',
    implementation: 'ESCALATE_SIGNALS regex list. The model grader (judges/j4.txt) runs only on tickets where the regex is silent.',
    run: ({ ticket, output }) => {
      const hits = escalateSignals(ticket);
      const want = hits.length > 0;
      const got = !!(output && output.escalate);
      return {
        pass: want === got,
        evidence: hits.length
          ? 'signals ' + hits.map(h => h.rule + ':"' + h.matched + '"').join(', ') + ' → want true, got ' + got
          : 'no signal in the ticket → want false, got ' + got,
        silent: hits.length === 0,        // the model grader's jurisdiction
      };
    },
  },

  {
    id: 'C5',
    text: 'condition reflects the symptom the customer stated, not one inferred',
    grader: 'model',
    implementation: 'lecture/judges/j5.txt',
    run: null,
  },

  {
    id: 'C6',
    text: 'reason contains no fact absent from the ticket',
    grader: 'model',
    implementation: 'lecture/judges/j6.txt',
    run: null,
  },
];

function gradeCode(ctx) {
  const checks = {};
  CRITERIA.forEach(c => { if (c.run) checks[c.id] = Object.assign({ criterion: c.id }, c.run(ctx)); });
  return checks;
}

/* ---- exports for node and for the browser ---- */

const API = { CONDITIONS, ROUTE_RE, ESCALATE_SIGNALS, escalateSignals, routesIn, CRITERIA, gradeCode };
if (typeof module !== 'undefined' && module.exports) module.exports = API;
if (typeof window !== 'undefined') window.Criteria = API;

/* ============================================================
   Self-test and the C4 deletion test.

   The deletion test written in advance: if the C4 regex agrees with the
   human labels on 27 of 30 or better, and the C4 model grader does not
   beat it, the C4 model grader is deleted in the lecture, on screen.

   Until the two humans have labelled, this runs against the drafted
   expected values in tickets.json, which is a dry run and says so.
   ============================================================ */

if (typeof require !== 'undefined' && require.main === module) {
  const fs = require('fs'), path = require('path');
  const pack = JSON.parse(fs.readFileSync(path.join(__dirname, 'tickets.json'), 'utf8'));

  const labelled = pack.tickets.filter(t => t.agreed === true);
  const against = labelled.length
    ? { rows: labelled, truth: t => t.labeller_1, what: 'agreed human labels (' + labelled.length + ')' }
    : { rows: pack.tickets, truth: t => t.expected, what: 'DRAFTED expected values (dry run: humans have not labelled yet)' };

  let agree = 0;
  const misses = [];
  against.rows.forEach(t => {
    const want = against.truth(t).escalate;
    const hits = escalateSignals(t.input);
    const got = hits.length > 0;
    if (want === got) agree++;
    else misses.push({ id: t.id, class: t.class, want, got, hits: hits.map(h => h.rule + ':' + h.matched) });
  });

  console.log('C4 regex vs ' + against.what);
  console.log('  agreement: ' + agree + ' / ' + against.rows.length);
  console.log('  threshold for deleting the C4 model grader: 27 / 30');
  if (misses.length) {
    console.log('  misses:');
    misses.forEach(m => console.log('    ' + m.id + ' (' + m.class + ') want ' + m.want + ', got ' + m.got +
      (m.hits.length ? ' via ' + m.hits.join(', ') : ' (regex silent)')));
  }

  const silent = against.rows.filter(t => escalateSignals(t.input).length === 0);
  console.log('  regex silent on ' + silent.length + ' tickets: ' + silent.map(t => t.id).join(', '));
  console.log('  → those, and only those, go to judges/j4.txt');
}
