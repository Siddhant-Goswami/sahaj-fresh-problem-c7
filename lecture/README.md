# Lecture artifacts

Everything the evals-and-guardrails lecture runs on, built from
`corpus/wave-1` and from the tool in this repo.

**The deployed app is untouched.** `index.html`, `css/` and `js/` are
byte-for-byte unchanged. The only edits outside `lecture/` and `agent-bench/`
are to `.vercelignore` and `.gitignore`.

Tool changes T1 to T7 are **specified and not built**, in `TOOL-CHANGES.md`.
T1 and T2 change the contract students have already built against and need
approval first.

---

## Half of this folder is not in the repo

This repo is public. A labelled eval set in a public repo is a set that no
longer measures anything, so the answers are gitignored under the same rule
that keeps `.facilitator-src/pack.json` out — see `.gitignore`.

| In the repo | Facilitator's machine only |
|---|---|
| `criteria.js`, `criteria.md` | `tickets.json` — the thirty, labelled |
| `guards.js`, `guardrails.md` | `build-tickets.js` — the generator, which is itself the answer key |
| `run-prompts.js`, `extract-prompt.js` | `outputs.json` |
| `judges/j4.txt, j5.txt, j6.txt` | `deck.html` — built, carries the answers |
| `build-deck.js` | `RECONCILIATION.md` — quotes stage-6 hidden-set contents |
| `assignment.md`, `discord-post.md` | `prompts/` — student submissions, and a model stage-5 prompt |
| `TOOL-CHANGES.md`, this file | `../agent-bench/tasks.js`, `report.json`, `runs/` |

**There is no way to rebuild the right-hand column from a clone**, because the
generators are the answer keys. Back that column up. If it ever needs to live
in the repo, put it through `build-fac.js` into the enciphered blob the way the
hidden set is, and do not just delete the `.gitignore` lines.

`lecture/` and `agent-bench/` are in `.vercelignore` as well. Belt and braces:
the site is a CLI deploy that honours that file — `build-fac.js` and
`build-corpus.js` are both git-tracked and both 404 live, which is the proof —
but the two folders should never be uploaded whichever way a deploy is made.

## Status

| # | Artifact | File | Status |
|---|---|---|---|
| A1 | Thirty labelled tickets | `tickets.json` | **Built.** Drafted expected values; two humans still to label. |
| A2 | Three student prompts | `prompts/` | **1 of 3.** Facilitator's own prompt written; `p1`, `p2` need student submissions. |
| A3 | Thirty outputs per prompt | `outputs.json` | **Runner built, not run.** Needs A2 and a key. |
| A4 | Criteria sheet C1–C6 | `criteria.md`, `criteria.js` | **Built and self-testing.** |
| A5 | Judge prompts | `judges/j4.txt, j5.txt, j6.txt` | **Built.** |
| A6 | Tool changes T1–T7 | `TOOL-CHANGES.md` | **Specified, deliberately not built.** |
| A7 | Agent bench | `../agent-bench/` | **Built and self-tested.** Needs a key to run. |
| A8 | Agent transcripts, 18 runs | `../agent-bench/runs/` | **Not run.** Needs a key. |
| A9 | Guardrail table, five surfaces | `guardrails.md`, `guards.js` | **Built and measured.** |
| A10 | Slide deck, 19 slides | `deck.html`, `build-deck.js` | **Built.** Slides 7 and 17 render a PENDING block until A3 and A8 exist. |
| A11 | Assignment sheet, Discord post | `assignment.md`, `discord-post.md` | **Built from the beats.** Part D of the lecture file was not available — check against it. |
| A12 | Resource bank entries | — | Yours. |

Plus `RECONCILIATION.md` — **not in the repo**, facilitator's machine only,
because it quotes hidden-set contents. It is the first thing to read: the build
plan's escalate rule and the tool's hidden set disagree on **five of ten**
hidden cases, and that needs a decision before anything is printed.

## Rebuilding

```bash
node lecture/build-tickets.js     # A1 — writes tickets.json, and fails loudly if it is inconsistent
node lecture/criteria.js          # A4 — runs the C4 deletion test
node lecture/guards.js            # A9 — measures the guards against the ticket set
node lecture/build-deck.js        # A10 — writes deck.html from whatever data exists
```

Nothing above needs a key or a network. All four need `tickets.json`, so all
four need the gitignored half of the folder — from a clone alone, only the
scripts are here. The two that also need a key:

```bash
GROQ_API_KEY=... GEMINI_API_KEY=... node lecture/run-prompts.js --judge   # A3
GROQ_API_KEY=...                    node agent-bench/run.js --runs 3      # A8
```

Then rebuild the deck so slides 7 and 17 fill in.

## `tickets.json` checks itself

`build-tickets.js` refuses to write a file that is inconsistent. It verifies,
on every build:

- every `expected.route` appears verbatim in its own ticket text, and every
  ticket with `route: null` carries no route code
- every `escalate: true` names at least one rule that fired, and every
  `escalate: false` names none
- every quoted piece of condition evidence is actually in the ticket
- the class distribution matches the build plan exactly, and there are thirty

Tickets 1 to 6 are read out of `js/data.js` at build time, so "the six seed
cases, verbatim" is enforced rather than promised in a comment.

## Reading order for the facilitator

1. `RECONCILIATION.md` — two decisions, one of them blocking
2. `criteria.md` — the six criteria and the deletion test, including the two
   misses that are worth more than the 28
3. `guardrails.md` — the five surfaces, measured
4. `TOOL-CHANGES.md` — what to build once T1 and T2 are approved
5. `deck.html` — open it from a local server, not `file://`. Rebuild it first
   if `tickets.json` has changed.

```bash
python3 -m http.server 8000
# then http://localhost:8000/lecture/deck.html
```

Arrow keys or click to move. Print to PDF renders one slide a page.

## What only you can do

1. Collect three `submission.json` files from students who reached stage 5,
   then `node lecture/extract-prompt.js <file> p1`.
2. Find the second labeller. Rukhsana-level familiarity with the corpus is
   enough; it does not have to be an instructor.
3. Two keys with spend caps: one Groq for candidates, one Gemini or OpenAI for
   the judge. `run-prompts.js` refuses to run if they are the same model.
4. Decide whether to expose the real root cause — 15-minute polling under
   Annexure B6 against SOP-CC-004 clause 6.3's "within one polling cycle". The
   build plan recommends **no**, and I agree: the lecture is about grading the
   classifier, and that answer belongs to the exercise debrief.
5. Approve T1 and T2, and settle the escalate rule in `RECONCILIATION.md` §3.
