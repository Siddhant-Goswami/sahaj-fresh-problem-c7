# Sahaj Fresh: From Client Brief to Costed System

**Assignment 03 for 100xEngineers.** An interactive workbook for the facilitated session.

One client, one ambiguous ask, one corpus. You extract the problem, prove it, design the system, write the
checks, break your own checks, and price it — with every token figure measured from a real API response
rather than estimated.

> **The client brief, verbatim:** "Cancellations in our new cities are bad and the Board is asking questions.
> Can AI help with the quality complaints before the Series B?"

Live: **https://sahaj-fresh-problem-c7.vercel.app**

---

## What this is

A workbook, not a simulator. **The facilitator plays the client**; the app does not. What the app does is
hold the eight stages in order, run the clock, refuse to let you design before the client has signed off,
make the real model calls for stages 5 to 8, and build a cost sheet out of the token counts those calls
actually returned.

| # | Stage | Time | You produce | Gate |
|---|---|---|---|---|
| 1 | Extract the problem | 40 min | 10 questions, then one observation: who, what breaks, where, in numbers | 10 questions, observation with a number and no solution words |
| 2 | Define good | 30 min | Baseline, hypothesis, falsifier, cheapest manual test | All four, baseline carries a figure |
| 3 | Align | 15 min | 5 minute pitch; client says yes, no, or change | Verdict is yes and sign-off is in writing |
| 4 | Design the process | 40 min | Input, output, steps tagged deterministic / model / human | Every model step has a reason deterministic could not do it |
| 5 | Write evals | 60 min | 15 cases, run for real, 10 hand-labelled against your grader | Grader agrees 8 of 10, or you write why not |
| 6 | Break your evals | 20 min | One output that passes every check and is wrong | Exploit passes, you mark it wrong, check rewritten, rates recorded |
| 7 | Guardrails | 30 min | Three boundaries, each with a catch and a false positive | Each guard tested against a real run output |
| 8 | Price it | 30 min | Cost per ticket, per month, check cost vs do cost, five lines for the client | Costed from measured tokens; five lines means five |

Stage 6 is marked higher than stage 5. Finding your own blind spot beats a clean pass.

## Running it

No build step. Either:

```bash
python3 -m http.server 8000     # then open http://localhost:8000
```

or open `index.html` directly — the corpus is baked into `js/corpus.js` so it works from `file://` too.

## Bring your own key

Stages 5 to 8 make real calls. Pick a provider in **Setup**, paste a key, pick a model:

| Provider | Get a key |
|---|---|
| Groq | https://console.groq.com/keys |
| OpenAI | https://platform.openai.com/api-keys |
| Gemini | https://aistudio.google.com/apikey |

All three are called through the OpenAI chat-completions shape, so one adapter covers them. The key lives in
this browser's `localStorage`, is sent to the provider you chose and nowhere else, and is never committed
anywhere. A throwaway key with a spend cap is a sensible choice — a full pass through the assignment is
roughly 30 to 60 calls at ~1,500 input tokens each.

Prices in `js/data.js` are **defaults that move**. Stage 8 lets you edit both price fields, and it tells you
to check the provider's page before quoting a number to the client.

## What lands in the submission

The Submit stage produces `submission.md` (what a human reads) and `submission.json` (raw runs, hand labels,
and the full ledger, so your numbers can be checked against your claims). Between them they carry every item
the assignment asks for: questions, observation, hypothesis and test, client sign-off, control graph, eval
file and run output, hand labels, the passing wrong output, guardrails with catches, cost sheet, and the
five-line client explanation.

`Back up my state` writes the whole workbook to a JSON file if you need to move machines.

## Files

```
index.html            app shell
css/tokens.css        100x design tokens
css/app.css           layout and the stage benches
js/corpus.js          GENERATED from corpus/wave-1 — run `node build-corpus.js`
js/data.js            stages, seed cases, prices, enciphered facilitator pack
js/llm.js             provider adapter and the run ledger
js/app.js             player, gates, and the nine stage benches
corpus/wave-1/        the nine documents the client shared
```

## For facilitators

The **Facilitator** panel in the sidebar holds the client role-play script, per-stage marking notes, and the
ten-case hidden set that stage 6 runs. It is behind a passphrase, and the pack is enciphered in `js/data.js`
rather than sitting there in plain text.

This is obfuscation, not cryptography, and it is meant to be exactly that: it stops a student scrolling
`data.js`, and it will not stop a student who is determined. Release the hidden set the way the assignment
intends — on request, after the rewrite — and treat a leaked set as a set that no longer measures anything.

The plaintext source lives in `.facilitator-src/pack.json`, which is gitignored. To change the pack, restore
that file and run `node build-fac.js "<passphrase>"`.

## Provenance

The corpus in `corpus/wave-1` is the Sahaj Fresh wave-one corpus from Assignment 02, unchanged. The stage
structure, timings and gates come from the Assignment 03 brief; the marking notes and hidden set come from
the facilitator sheet.
