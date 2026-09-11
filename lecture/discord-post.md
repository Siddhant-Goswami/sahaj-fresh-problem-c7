# A11 — Discord post

> Same caveat as `assignment.md`: written without Part D of the lecture file,
> which is not on this machine. Check the dates and the link before posting.

Paste as-is. Discord renders the bold, the bullets and the code fence.

---

**Evals and guardrails — follow-up work**

Today we took one output contract, thirty tickets, six criteria and five
guardrail surfaces, and found out that the check we were most confident in
fires on the words *"please try again"*.

Three things before the next session. All of it builds on your Assignment 03
stage 5.

**1 · Add a fourth field to your contract**
```json
{ "condition": "...", "route": "...", "escalate": true,
  "reason": "<one sentence quoting the words in the ticket that decided it>" }
```
Rerun your ten cases. Report the pass rate before and after, and one sentence
on why it moved. It will probably go down. That is fine.

**2 · Split your grader into six criteria and label per criterion**
C1–C4 are code, C5–C6 are a model. Hand-label your six outputs against each of
the six, not against the output as a whole. Send me the one criterion where you
and your grader disagree most, and your guess at why.

**3 · Write one guard you cannot test**
Input and Output you can test from a classifier. Action, Process and Loop you
cannot — they need a tool-call log, a workflow, or a run that goes wrong. Write
one Action or Loop guard for Sahaj Fresh anyway, and one sentence on what
testing it would take.

**Send:** `followup.md`, four sections, in the usual place.

**The one thing to take away:** a guard with no false positive has not been
thought about. Every rule that fires on something real also fires on something
innocent — name it before the client finds it.

Workbook is still live if you need it: <https://sahaj-fresh-problem-c7.vercel.app>

---

## Shorter version, if the channel is busy

**Evals and guardrails — follow-up**

Three things on top of your stage 5, before next session:

• Add `reason` to your output contract, rerun your ten cases, report what
happened to the pass rate and why
• Split your grader into six criteria (four code, two model) and hand-label
**per criterion** — send the one where you and your grader disagree most
• Write one **Action** or **Loop** guard you cannot currently test, plus one
sentence on what testing it would require

`followup.md`, four sections. Workbook:
<https://sahaj-fresh-problem-c7.vercel.app>

> A guard with no false positive has not been thought about.
