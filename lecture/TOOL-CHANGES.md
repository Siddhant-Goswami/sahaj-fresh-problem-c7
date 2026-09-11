# A6 — tool changes T1 to T7: the spec

**Nothing in this document has been built.** The deployed app at
`sahaj-fresh-problem-c7.vercel.app` is byte-for-byte unchanged; the only edit
outside `lecture/` and `agent-bench/` is three lines appended to `.vercelignore`
so these two folders are never uploaded.

That is deliberate on two counts. **T1 and T2 change the contract students have
already built against, and item 5 of the build plan says they need approval
before any code is written.** And an artifact-building pass is the wrong pass in
which to touch a live workbook.

This is the spec to build from once T1 and T2 are approved. Effort estimate
from the plan: four hours.

---

## T1 — add `reason` to the contract

**Files:** `js/data.js` line 120 (`OUTPUT_CONTRACT`); `js/llm.js`
(`parseContract`).

```js
const OUTPUT_CONTRACT = `{
  "condition": "warm" | "sour" | "watery" | "other" | "none",
  "route": "<route code such as IND-A, or null if the text does not give one>",
  "escalate": true | false,
  "reason": "<one sentence quoting the words in the ticket that decided condition and escalate>"
}`;
```

`parseContract` currently builds a three-field object and drops everything
else, so a `reason` in the reply is discarded silently today. Change it to
carry `reason` through **only when the key is present**:

```js
if (Object.prototype.hasOwnProperty.call(o, 'reason'))
  v.reason = o.reason == null ? '' : String(o.reason);
```

Optional on read, required on grade. Old saved state loads unchanged; C3 is
what fails a three-field output, and C3 is allowed to fail.

Reference implementation: `lecture/run-prompts.js`, `parseContract`.

**Breaking for students.** Every stage-5 prompt written before this change
produces three fields and fails C3 on every case. Say so before you ship it.

## T2 — a second provider config for the judge

**Files:** `js/llm.js`; the Setup panel in `js/app.js`.

`LLM` closes over a single `cfg`. Add `cfgJudge` alongside it and route judge
calls through the same `chat()`:

```js
let cfg      = { provider: 'groq', key: '', model: '' };
let cfgJudge = { provider: '',     key: '', model: '' };

function configureJudge(next) { cfgJudge = Object.assign({}, cfgJudge, next); }
function judgeReady() { return !!(cfgJudge.key && cfgJudge.model && PROVIDERS[cfgJudge.provider]); }
```

Setup grows a second key field and a second model picker, labelled *judge*.

**Refuse to run a model grader when the judge model equals the candidate
model.** Not a warning — a refusal, with the reason on screen. A model grading
its own output is not a second opinion, and the failure is silent and
flattering, which is the worst kind. `run-prompts.js` already does this; copy
the message.

Judge key lives in `localStorage` beside the candidate key and is never
committed, same as today.

## T3 — replace grader modes with criteria

**Files:** `js/app.js` `gradeCase` (line 240), `renderGrader` (line 1055),
state shape (line 173).

Today `S.s5.grader` is `{ route, escalate, mode, kw }` and `gradeCase` returns
`{ checks: [{name, pass, note}], pass }` with at most three checks. Replace
with the six criteria:

```js
grader: { criteria: { C1: true, C2: true, C3: true, C4: true, C5: false, C6: false } }
```

`gradeCase` returns `{ checks: {C1: {...}, ...}, pass }`. Lift C1 to C4 from
`lecture/criteria.js` verbatim — it has no dependency on the tool's state and
already exports to `window.Criteria`. C5 and C6 call `chat(cfgJudge, ...)` with
the prompts from `lecture/judges/`.

`renderGrader` lists six rows with a type badge (**code** / **model**) and a
cost note against the two model rows: a model grader is a second call per case.

**Migrate saved state on load,** do not break it:

```js
if (S.s5.grader && S.s5.grader.mode && !S.s5.grader.criteria) {
  S.s5.grader.criteria = { C1: true, C2: !!S.s5.grader.route, C3: true,
                           C4: !!S.s5.grader.escalate, C5: false, C6: false };
  S.s5.grader.legacy = { mode: S.s5.grader.mode, kw: S.s5.grader.kw };
}
```

Keep `legacy` readable so a student's old keyword lists are not deleted out
from under them mid-session.

## T4 — agreement per criterion

**Files:** `js/app.js` `agreement()` (line 293), `renderHL` (line 1131).

`S.s5.labels` is `caseId -> 'y' | 'n'` — one verdict for the whole output.
Per-criterion labels:

```js
labels: {}   // caseId -> { C1: 'y'|'n', C2: ..., ... }
```

`agreement()` returns `{ C1: {agree, n}, C2: {...}, ... }`. `renderHL` shows a
row per criterion, not a row per case.

This is the change that makes Beat 3 work: the room can see that humans agree
with the grader on C1 and C2 nearly always, and on C5 rather less, which is the
argument for where a model grader is worth paying for.

**Gate arithmetic.** `AGREE_TARGET` is currently 5 of 6 over cases. Per
criterion it has to become a rate — 5 of 6 *per criterion that was labelled* —
or the gate at `js/app.js:369` starts asking for something no student can
reach. Decide this before building T4; it is the one place where T3 and T4
together can silently make stage 5 unpassable.

## T5 — two labellers

**Files:** `js/app.js` state, `renderHL`.

`S.s5.labels` becomes `labels_1` and `labels_2` with a labeller toggle in the
bench header. An `agreed` cell shows where the two humans match, and it is
shown **before** the grader's verdict is revealed. The blind rule is preserved:
neither labeller sees the grader, and neither sees the other until both are
done.

For student mode this is optional — one student, one labeller. It earns its
place in lecture mode, where two people have labelled thirty tickets and the
disagreements are the slide.

## T6 — thirty-ticket lecture mode

**Files:** `js/data.js`, `js/app.js`.

Behind the facilitator flag (same passphrase gate as the pack), load
`lecture/tickets.json` as `LECTURE_SET` and set `LABEL_TARGET = 30`. Student
mode stays at `CASE_TARGET = 10` cases and `LABEL_TARGET = 6` labels.

**`lecture/` is in `.vercelignore`,** so a deployed build has no file to fetch
and lecture mode is unavailable on the hosted app by construction. That is the
intent: the labelled thirty are a facilitator asset. Run lecture mode from
`python3 -m http.server 8000` on the facilitator's own machine, where the file
is on disk.

If lecture mode is ever wanted on the hosted build, the set has to go through
`build-fac.js` into the enciphered blob like the hidden set did. Do not just
remove the `.vercelignore` line.

## T7 — widen the stage 7 sample pool

**Files:** `js/app.js` `R.s7`, the `pool` array.

Today the pool is stage-5 case replies plus the stage-6 exploit. Add:

- the injection ticket (T30) as a testable **input**, so a student can write an
  input guard and see it fire;
- agent transcripts from `agent-bench/runs/*.json`, flattened to a tool-call
  log, so a guard can be tested against an action sequence and not only a
  classifier reply.

A tool-call log as a pool entry is a string like:

```
lookup_history {"subscriber":"9730-xxx-018"}
issue_refund   {"ticket":"SF-NSK-118990","amount":48}
reply          {"ticket":"SF-NSK-118990","text":"..."}
close          {"ticket":"SF-NSK-118990","condition":"warm","escalate":false}
```

which the existing `ruleFires` regex machinery greps without any change. This
is the smallest change that lets stage 7 touch the Action and Loop surfaces —
see `guardrails.md`.

Keep three guard slots for students. The lecture shows five.

---

## Not changing

- **The hidden set mechanics and the own-vs-hidden gap verdict.** Already the
  most Socratic thing in the tool. (But see `RECONCILIATION.md` §3: the pack's
  escalate labels need a decision, not a mechanism change.)
- **The cost ledger and stage 8.** Measured from real usage, nothing to fix.
- **Run-three-times for the classifier.** At temperature 0 the classifier is
  near-deterministic. `pass^k` belongs in the agent bench, where a tool-call
  sequence has real variance, not in stage 5 where it would triple the bill to
  measure noise.

## Build order

`T1`, `T2` need approval. Then `T1` → `T2` → `T3` → `T4` (watch the gate
arithmetic) → `T5` → `T6` → `T7`. `T3` is the big one; everything after it is
rendering.
