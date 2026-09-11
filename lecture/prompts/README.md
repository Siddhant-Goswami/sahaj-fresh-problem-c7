# A2 — the three student prompts

The lecture shows three real stage-5 prompts side by side, and then shows what
the same thirty tickets do to each of them. The point is that the prompts were
written by people in the room.

## This directory is gitignored

Only this README is in the repo. `p1` and `p2` are other people's submitted
work, and `p3-facilitator.txt` is a model answer to stage 5 — none of the three
belongs in a public repo. See `.gitignore`.

| File | Source | Status |
|---|---|---|
| `p3-facilitator.txt` | The facilitator's own stage-5 prompt, written against the four-field contract | Ready, local only |
| `p1.txt` | Student submission | **Missing — Siddhant collects** |
| `p2.txt` | Student submission | **Missing — Siddhant collects** |

## How to fill p1 and p2

Ask students who reached stage 5 to send `submission.json` from the Submit
stage. Then:

```bash
node lecture/extract-prompt.js ~/Downloads/submission-a.json p1
node lecture/extract-prompt.js ~/Downloads/submission-b.json p2
```

The script reads `.stage5.prompt`, strips anything that looks like a name or a
handle, and writes `lecture/prompts/<id>.txt`. It refuses to overwrite.

Collect more than three if you can and pick the three that differ most in
structure — a bare one-liner, a long one with examples, and one that lists the
condition vocabulary. Three prompts that all look the same make a dull slide.

## If fewer than three arrive

The fallback in the build plan: two student prompts and `p3-facilitator.txt`
as the third, and the slide says so. If only one student prompt arrives, run
with two and say that too. Do not invent a student prompt.

## A note on the contract

`p3-facilitator.txt` is written against the **four-field** contract
(`condition`, `route`, `escalate`, `reason`). Student submissions predate the
`reason` field, so their prompts will produce three fields and fail C3 on every
ticket. That is not a bug in the extraction and it is not a bug in their work:
it is the contract change (T1) landing on prompts written before it, and it is
worth one line on the slide. C1, C2 and C4 still grade normally; C5 grades
normally; C6 has nothing to read and is recorded as not graded.
