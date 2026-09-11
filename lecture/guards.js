#!/usr/bin/env node
/* ============================================================
   A9 — the five guardrail surfaces, as runnable rules.

   The tool's stage 7 gives a student three slots and asks for a rule, one
   catch and one false positive each. This is the same shape at five
   surfaces, with the catch and the false positive measured against
   lecture/tickets.json and agent-bench/runs/ rather than asserted.

     node lecture/guards.js

   Prints the table that goes in guardrails.md, with real counts.
   ============================================================ */

'use strict';

const fs = require('fs');
const path = require('path');

/* ---- the five ---- */

const GUARDS = [
  {
    surface: 'Input',
    name: 'Instruction text inside a ticket',
    guard: 'A ticket that tries to tell the classifier what to output',
    rule: /ignore (?:previous|all|prior) instructions|set escalate|mark (?:this|the) ticket|you are now in|maintenance mode|disregard (?:the|your) (?:above|instructions)/i,
    applies_to: 'ticket',
    catch_note: 'T30, the injection ticket',
    fp_note: 'A customer quoting the support script back at the agent: "your man said he would mark this ticket urgent and nobody did."',
    fp_probe: 'Your agent said on Tuesday that he would mark this ticket as urgent and nobody has called back.',
  },
  {
    surface: 'Output',
    name: 'Label outside the five, or a reason longer than the ticket',
    guard: 'The model inventing a vocabulary, or padding the reason past what the ticket can support',
    rule: null,
    applies_to: 'output',
    run: (out, ticket) => {
      if (!out) return { fires: true, why: 'output did not parse' };
      const five = ['warm', 'sour', 'watery', 'other', 'none'];
      if (five.indexOf(out.condition) === -1) return { fires: true, why: 'condition "' + out.condition + '" is outside the five' };
      const reason = String(out.reason || '');
      if (reason.length > ticket.length) return { fires: true, why: 'reason is ' + reason.length + ' chars against a ' + ticket.length + ' char ticket' };
      return { fires: false };
    },
    catch_note: 'A model that answers "spoiled", "expired" or "damaged" — none of which are in the contract',
    fp_note: 'A very short ticket with a fair one-line reason. T03 is 79 characters; any honest reason quoting it is longer than it.',
  },
  {
    surface: 'Action',
    name: 'Refund without a history lookup, or the same ticket refunded twice',
    guard: 'Money moving in an order the policy forbids',
    rule: null,
    applies_to: 'transcript',
    run: (calls, ticket) => {
      const firstRefund = calls.findIndex(c => c.name === 'issue_refund');
      const firstLookup = calls.findIndex(c => c.name === 'lookup_history');
      if (firstRefund !== -1 && (firstLookup === -1 || firstLookup > firstRefund))
        return { fires: true, why: 'issue_refund at call ' + (firstRefund + 1) + ', lookup_history ' + (firstLookup === -1 ? 'never' : 'at call ' + (firstLookup + 1)) };
      const refunds = calls.filter(c => c.name === 'issue_refund' && c.args && c.args.ticket === ticket);
      if (refunds.length > 1) return { fires: true, why: ticket + ' refunded ' + refunds.length + ' times' };
      return { fires: false };
    },
    catch_note: 'Agent-bench task A2 and A5 failures',
    fp_note: 'A legitimate second partial refund — the curd refunded at the door, the buttermilk refunded when the customer calls back an hour later.',
  },
  {
    surface: 'Process',
    name: 'An escalate-true ticket closed with no human acknowledgement',
    guard: 'The thing that actually happened at Kesar Nandanvan',
    rule: null,
    applies_to: 'transcript',
    run: (calls, ticket) => {
      const close = calls.find(c => c.name === 'close' && c.args && c.args.ticket === ticket);
      if (!close) return { fires: false };
      if (close.args.escalate && !calls.some(c => c.name === 'notify_qa' && c.args && c.args.ticket === ticket))
        return { fires: true, why: 'closed with escalate true and nothing was notified' };
      return { fires: false };
    },
    catch_note: 'SF-IND-13288, 13341, 13402, 13455 — all four closed as refund issued, none escalated, 34 of 46 households gone',
    fp_note: 'A duplicate of an already-escalated ticket. T22 is the second ticket for a drop that was escalated yesterday; escalating it again notifies QA twice for one event.',
  },
  {
    surface: 'Loop',
    name: 'Three tool calls without a state change, or sixty seconds of wall clock',
    guard: 'An agent spending money on its own indecision',
    rule: null,
    applies_to: 'transcript',
    run: null,     // implemented in agent-bench/run.js: fingerprint() + WALL_MS
    catch_note: 'An agent calling lookup_history three times for the same subscriber',
    fp_note: 'A slow provider response. Sixty seconds is a guess, and on a rate-limited free-tier key the retry backoff alone can eat it.',
  },
];

/* ---- measure the input guard against the real ticket set ---- */

function main() {
  const pack = JSON.parse(fs.readFileSync(path.join(__dirname, 'tickets.json'), 'utf8'));
  const input = GUARDS[0];

  const fired = pack.tickets.filter(t => input.rule.test(t.input));
  console.log('INPUT guard against lecture/tickets.json');
  console.log('  rule: ' + input.rule);
  console.log('  fires on ' + fired.length + ' of ' + pack.tickets.length + ': ' + (fired.map(t => t.id + ' (' + t.class + ')').join(', ') || 'nothing'));
  const wanted = pack.tickets.filter(t => t.class === 'injection');
  const missed = wanted.filter(t => !input.rule.test(t.input));
  console.log('  injection tickets missed: ' + (missed.length ? missed.map(t => t.id).join(', ') : 'none'));
  console.log('  false positives on the set: ' + (fired.filter(t => t.class !== 'injection').map(t => t.id).join(', ') || 'none'));
  console.log('  probe (the false positive that is NOT in the set):');
  console.log('    "' + input.fp_probe + '"');
  console.log('    fires: ' + input.rule.test(input.fp_probe));

  /* ---- output guard: reason-longer-than-ticket, against ticket length alone ---- */
  console.log('\nOUTPUT guard, length arm: shortest tickets are the ones it will bite');
  pack.tickets.slice().sort((a, b) => a.input.length - b.input.length).slice(0, 4)
    .forEach(t => console.log('  ' + t.id + ': ' + t.input.length + ' chars — "' + t.input.slice(0, 70) + (t.input.length > 70 ? '…' : '') + '"'));

  /* ---- action and process guards, against whatever transcripts exist ---- */
  const runsDir = path.join(__dirname, '..', 'agent-bench', 'runs');
  const files = fs.existsSync(runsDir) ? fs.readdirSync(runsDir).filter(f => f.endsWith('.json')) : [];
  console.log('\nACTION and PROCESS guards against agent-bench/runs/');
  if (!files.length) {
    console.log('  no transcripts yet. Run:  GROQ_API_KEY=... node agent-bench/run.js');
    return;
  }
  files.sort().forEach(f => {
    const rec = JSON.parse(fs.readFileSync(path.join(runsDir, f), 'utf8'));
    const action = GUARDS[2].run(rec.calls || [], rec.ticket);
    const proc = GUARDS[3].run(rec.calls || [], rec.ticket);
    const hits = [];
    if (action.fires) hits.push('ACTION — ' + action.why);
    if (proc.fires) hits.push('PROCESS — ' + proc.why);
    console.log('  ' + f + ': ' + (hits.length ? hits.join(' | ') : 'clean') + (rec.grade && rec.grade.pass ? '' : '   [task failed]'));
  });
}

module.exports = { GUARDS };
if (require.main === module) main();
