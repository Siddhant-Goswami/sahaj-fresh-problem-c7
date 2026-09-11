# A11 — assignment sheet

> **Built without the source.** `evals-and-guardrails-lecture.md` is not in this
> repo and is not anywhere on this machine, so Part D could not be read. This
> sheet is reconstructed from the build plan's beats and from slide 19 of
> `deck.html`. **Check it against Part D before you post it.** If Part D says
> something different, Part D wins.

---

## Evals and guardrails — post-lecture work

**Due:** before the next session.
**Builds on:** your Assignment 03 submission. If you did not reach stage 5,
start from the workbook at https://sahaj-fresh-problem-c7.vercel.app and get
there first — everything below is stage 5 and 7 work.

### 1. Add `reason` to your contract

Your output contract grows a fourth field:

```json
{
  "condition": "warm" | "sour" | "watery" | "other" | "none",
  "route": "<route code such as IND-A, or null>",
  "escalate": true | false,
  "reason": "<one sentence quoting the words in the ticket that decided condition and escalate>"
}
```

Change your stage-5 prompt, rerun your ten cases, and **report what it did to
your pass rate.** The number will probably go down. Say why, in one sentence.

You cannot grade "the label matches the stated symptom" or "the model invented
nothing" without a field that shows the working. That is what `reason` is for
and it is the only reason it exists.

### 2. Split your grader into criteria, and label per criterion

Your grader today gives one verdict per output. Replace it with six:

| ID | Criterion | Grader |
|---|---|---|
| C1 | `condition` is one of the five | code |
| C2 | `route` appears verbatim in the ticket, or is null | code |
| C3 | valid JSON, all four fields | code |
| C4 | `escalate` matches the signals in the ticket | code |
| C5 | `condition` is the symptom stated, not one inferred | model |
| C6 | `reason` contains no fact absent from the ticket | model |

Then hand-label your six outputs **per criterion**, not per output. Six outputs
× six criteria is thirty-six judgements, and they will not all agree with your
grader in the same places.

**Send one line:** the criterion where you and your grader disagree most, and
your best guess at why.

### 3. Write one guard you cannot test

Five surfaces. Your assignment has three slots and they all sit on two of them:

| Surface | Testable from a classifier? |
|---|---|
| Input | yes |
| Output | yes |
| **Action** | **no — needs a tool-call log** |
| **Process** | **no — needs a workflow** |
| **Loop** | **no — needs a run that goes wrong** |

Write one Action or Loop guard for Sahaj Fresh: a name, a rule a machine can
apply, one thing it catches, one thing it wrongly catches. Then **one sentence
on what you would need in order to test it.**

Writing a guard you cannot test is not busywork. It is how you find out that
your system has surfaces your evals cannot reach, which is the thing most teams
discover in production.

### What to send

One file, `followup.md`, with four sections:

1. Pass rate before and after `reason`, and the sentence.
2. Your six criteria, with the grader type for each and one line on why C5 and
   C6 are worth a model call and C1 to C4 are not.
3. The criterion where you and your grader disagree most, and why.
4. The untestable guard, and what testing it would require.

Four sections. Not five, not three.

### Marked on

| | |
|---|---|
| The pass rate moved and you explained the movement | 25 |
| C5 and C6 are model graders and you justified the cost | 25 |
| You labelled per criterion and found a real disagreement | 25 |
| The untestable guard names a surface, not a topic | 25 |

**A pass rate that did not move after a contract change is the answer that
needs the most explaining.** It usually means the grader is not reading the new
field.

### The one thing

Find the false positive before the client does.
