# A4 — the criteria sheet

Six criteria. Four are code, two are a model. The implementation of all six is
in `lecture/criteria.js` (C1–C4 in full) and `lecture/judges/` (C5, C6).

| ID | Criterion | Grader | Implementation |
|---|---|---|---|
| C1 | `condition` is one of the five | Code | Set membership against `["warm","sour","watery","other","none"]` |
| C2 | `route` is a route code present verbatim in the ticket, or `null` when none is present | Code | `/\b(?:IND\|NSK)-[A-D]\b/g` over the ticket, compared to the output |
| C3 | Output is valid JSON with all four fields | Code | `parseContract`, extended for `reason`; `escalate` must be a boolean and `reason` non-empty |
| C4 | `escalate` is true when the ticket carries any escalate signal, false otherwise | Code first, model second | 28-entry regex list in `criteria.js`. `judges/j4.txt` runs **only** where the regex is silent. |
| C5 | `condition` reflects the symptom the customer stated, not one inferred | Model | `judges/j5.txt` |
| C6 | `reason` contains no fact absent from the ticket | Model | `judges/j6.txt` |

## Why each one is the grader it is

**C1, C2, C3 are code because the answer is in the text.** A model asked
whether `IND-A` appears in a ticket is a slower, more expensive, less reliable
`indexOf`. The only interesting thing about C2 is the negative case: the ticket
says the word *route* and carries no code (T13), or carries a hub code that
looks like one (T15, T29).

**C4 is code first because the signals are words.** Twenty-eight regexes cover
five rules. The model grader exists only for the tickets the regexes do not
speak to, which is how a model grader should be scoped: not "check escalate",
but "check escalate on the ten tickets where the cheap check had nothing to
say".

**C5 and C6 need a model because they are about what is *absent*.** No regex
can tell you that `"sour"` was inferred rather than read, or that the word
*society* in a reason came from the model and not from the ticket. These are
the two criteria worth paying for.

## The deletion test, written in advance

> If the C4 regex agrees with the human labels on **27 of 30 or better**, and
> the C4 model grader does not beat it, the C4 model grader is **deleted in the
> lecture, on screen**.

Run it:

```bash
node lecture/criteria.js
```

Until both humans have labelled, this runs against the drafted expected values
and says so. Dry run as built:

```
C4 regex vs DRAFTED expected values (dry run: humans have not labelled yet)
  agreement: 28 / 30
  threshold for deleting the C4 model grader: 27 / 30
  misses:
    T15 (unrelated) want false, got true via R1:"again"
    T28 (hinglish)  want true,  got false (regex silent)
  regex silent on 10 tickets: T04, T07, T09, T11, T12, T14, T16, T17, T28, T29
```

**28 of 30, so on the drafted labels the model grader goes.** Rerun it against
the human labels before you say that on a slide.

### The two misses are the best thing on this sheet

**T15 is a false positive and it is beautiful.** The ticket is the 14 August
dispatch outage: *"the screen kept spinning and then said please try again."*
`/\bagain\b/` fires on *please try again*. A word that means "this has happened
before" in twenty-nine tickets means nothing at all in the thirtieth, and the
regex cannot tell. This is the lecture's own guardrail lesson arriving
uninvited: a rule that fires on something real also fires on something
innocent.

Do not fix it before the lecture. Fix it on screen, in front of the room, and
then ask what the fix costs — `/(?<!try )\bagain\b/` is one lookbehind and one
new blind spot.

**T28 is a miss and it is the cheaper lesson.** *"dahi phir se khatta aaya,
teen din se yahi ho raha hai"* carries two prior-occurrence signals and the
regex list is English. T29 is also Hinglish, is also silent, and happens to be
*correct* — expected escalate is false and silence produces false. A rule that
is right by accident is not right.

## Running order

1. `C3` first: an output that did not parse cannot be graded on anything else.
   `run-prompts.js` records the parse error and marks C1, C2 and C4 against
   `null`, which fails them. That is deliberate — a broken output is a failed
   output, not an absent one.
2. `C1`, `C2`, `C4` from code, on every output. Free.
3. `C5`, `C6` from the judge, on every output that parsed.
4. `C4` from the judge, **only** where `checks.C4.silent` is true.

Call count for three prompts and thirty tickets: 90 candidate calls, 180 judge
calls for C5 and C6, plus up to 30 more for the silent C4s. Well inside a Groq
free tier with the retry logic in `run-prompts.js`, but the judge is a second
provider and a second bill.

## The judge must not be the candidate

`run-prompts.js` refuses to start if the judge model equals the candidate
model. A model grading its own output is not a second opinion, and the failure
is silent and flattering rather than loud, which is the worst kind. This is
tool change **T2** in `TOOL-CHANGES.md`, moved into the browser.
