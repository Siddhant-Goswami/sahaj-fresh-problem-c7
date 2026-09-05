# Sahaj Fresh — the client answers

**Speaking:** Rohit Vaidyanathan, Managing Director, Sahaj Fresh Retail Private Limited
**Date:** 20 August 2024
**Standing position:** QA memo 17 (QA/2024/MEMO/17, 21 May) identifies the cause. The corrective
action is in flight. We re-baseline the Tier 2 return rate on 31 August and reopen only if it is
not under 0.5 per cent.

I will answer what you ask me. If I do not have a number I will say so rather than give you one
I cannot stand behind.

---

## Sats — "five of your people each found one piece of the answer… no process exists that reads a support ticket, a QA memo, an incident record and an engineering post-mortem as one body of evidence"

That is not quite how I would put it, and I want to be fair to my people before I concede
anything.

Rukhsana Pathan on the Nashik desk noticed three curd returns in eight days and said so in
writing. Joseph Mathai, her lead, looked at it and wrote a view. Priyanka Deshmukh in QA took it
into a lab and produced memo 17. Harish Mane at Indore raised an incident record. Tarun Sethi
wrote up the August app outage. Every one of those went into the system it belongs in and every
one of those reached the person who owns that system.

And we do have an answer. Memo 17 *is* the cross-reading you say we never did. Priyanka did not
just look at complaints — she pulled the packaging change from February, ran conditioned seal
tests at 40 degrees, and then reconciled the geography: Bengaluru does not see sustained 40
degree ambient in April and May, Nashik and Indore do. The film is inside specification for the
climate it was validated in and outside it for the climate the Tier 2 hubs actually run in. That
is a support signal, a procurement change and a lab result read together. It is the only piece of
work in this company this year that did that.

What I will concede is narrower, and it is one item. At the Q2 review on 11 July we agreed that
the Tier 2 exit reasons would be sampled and *read*, not just counted by their codes. That was
Aparna Nadig's action, due 15 August. It is 20 August. Nobody has read them. So the one body of
evidence nobody in this company has actually looked at is what the leaving customers wrote in
their own words.

If you are telling me the four documents should sit in front of one person at one time — fine,
tell me who that person is and what they would do differently to what Priyanka already did.

---

## Parminder Bagga — "What are the list of cancellation reasons that your customers specify? And is that mandatory when you ask them? Where do you store it?"

**The reasons.** There is a coded reason captured at the point of cancellation. I do not carry the
full picklist in my head; Aparna Nadig in Growth owns the field and can give you every code. What
I report to the Board is the roll-up, and the roll-up is this: product condition accounts for
**68 per cent of Tier 2 cancellations, against 19 per cent in Bengaluru**. That is the number that
matters and it is the one I have been working from.

**Is it mandatory.** The reason code is a required field in the cancellation flow, so we get a
code on effectively every cancellation. Whether the agent can pick a default and move on, I do
not know — ask Aparna, and I would like to know the answer myself.

**Where it is stored.** Two places, and the distinction turns out to matter. The *code* sits on
the subscription record and flows into the monthly reporting, which is where my 68 per cent comes
from. The *verbatim* — whatever the customer actually said — is captured alongside it and, as I
said to Sats, has never been read. It is sitting there. It has been sitting there since April.

---

## Sagar B — "Top 3 reasons for cancellations, and the average cancellation time between order and delivery? How are these recorded, and what is the protocol post cancellation?"

**On the top three.** I can give you one with confidence and I am not going to invent the other
two. Product condition is the top reason in Tier 2 and it is not close — 68 per cent. Below that,
the coded breakdown is Growth's and I would be guessing. Ask Aparna for the full ranking.

**On average time between order and delivery.** I do not think we hold that number, and I want to
be careful because I think the question may not fit our business. We are a subscription dairy, not
an order-by-order grocery. A customer does not place an order and wait; they hold a standing
subscription and a crate arrives before 07:00. So there is no order-to-delivery clock to average.

What we do have, and what I think you may actually be after, are two other things. **Cancellation
of a subscription** — that is the churn number: 19.0 per cent of gross adds in Nashik and 19.1 in
Indore across Q2, against 6.4 in Bengaluru and 6.5 in Pune. Month by month in the new cities it
climbs: Nashik 61 then 198 then 345, Indore 34 then 172 then 355.

And **refusal at the door** — where the crate arrives and the customer will not take it. That is
same-morning, inside the delivery window. Category A returns at the Tier 2 hubs went from a 0.3
per cent baseline to 2.1 per cent over the six weeks to 17 May. If you want an elapsed time for
those, the honest answer is that we measure them as a rate, not as a duration.

**How they are recorded, and the protocol.** For a doorstep refusal: the customer calls the desk,
the agent opens a ticket and dispositions it **DISP-07, product condition, returned at door**. The
rider brings the affected crates back. The agent processes a refund to the customer's wallet — the
ones I have seen are Rs 96 and Rs 144, so small — and offers a replacement on the following day's
run, which the customer may decline. The rider's own note goes on the ticket as an internal
comment. The ticket is then closed at the desk.

If the agent judges it needs a second pair of eyes it goes to the team lead, and the lead decides
whether to raise it to the hub. That is a judgement call, not a rule.

There is a second disposition, **DISP-09, no fault found**, used where the customer accepts a
replacement and we conclude nothing was wrong.

Post-cancellation of a *subscription*, as opposed to an order: the reason code is captured, the
subscription lapses at the end of the paid cycle, and there is no standing retention motion. Where
a hub has lost a block of subscribers, the supervisor has made a local offer — at one Indore
society, a two-week free extension and a doorstep probe check every morning. That is initiative,
not policy.

---

## Nikhil kv — "What are customers mainly complaining about when they cancel?"

The condition of the curd when it reaches the door.

The complaint text is consistent enough that QA quoted it as a pattern: **watery, loose, or sour**
at the point of delivery. One customer pressed a pouch and it was watery and refused both. Another
said the curd was sour again and that three houses in his building had said the same the day
before. A third had all three pouches taken back. It is curd specifically — not paneer, not milk,
which carry a different seal geometry.

68 per cent of Tier 2 cancellations cite quality. In Bengaluru the same figure is 19 per cent.

And we know why, which is the part I would ask you to take seriously before you go looking for
something more interesting. In February we moved our Category A pouch film to a new supplier and
a thinner gauge — 55 micron against 65. At ambient it tests inside specification. Conditioned at
40 degrees for four hours it fails on two of five measures. Bengaluru does not get 40 degrees in
the delivery window. Nashik and Indore do. The purchase order to revert Tier 2 supply to 65 micron
went in on 4 June, first despatch on the reverted film was the week of 22 July, and we re-baseline
on 31 August.

---

## Dev Sharma — "When Nashik started coming back sour, who was the one person who had to be convinced before anything changed?"

Meghana Iyer, Head of Cold Chain and Quality.

I will give you the sequence, because the sequence is the answer to your question.

Rukhsana raised it in April. It went to Joseph Mathai, her lead. Joseph looked at three curd
returns in eight days, all on the early routes, and formed a view: it was the season. Nashik had
come out of winter fast, the vans were standing in the sun at society gates while riders walked
four floors, and he had seen something like it in Pune two summers earlier that settled once the
riders staged crates in the stairwell. He wrote that to the Nashik hub manager on 26 April, a
rider briefing went out on 27 April, and the thread was set to monitoring and reviewed on 29 April
with no further action pending.

So: correctly documented, correctly escalated, and nothing changed. That is April.

What changed it was Priyanka Deshmukh going into a lab in May and coming out with a physical
cause, and then Meghana putting her name to it and tabling memo 17 at the Q2 review on 11 July.
Money moved after that. Not before.

If you want the bottleneck named plainly: nothing in this company moves on a product-condition
question until Quality says it is real. Support can escalate it and Support did. Support cannot
authorise a change of packaging specification, and a plausible explanation offered by a lead who
is trying to be helpful will close a thread just as effectively as a correct one.

I would add one thing you did not ask for, because you asked me to help you find a bottleneck and
it would be dishonest to leave it out. When Priyanka wrote memo 17 she recorded that a crate
staging briefing had been issued at Nashik on 27 April and that returns continued after it. She
used that as evidence that rider handling is not the driver. That is a correct piece of reasoning,
and it is the only place in any of this where somebody went back and checked whether the previous
explanation had held.

---

*Rohit Vaidyanathan*
*Managing Director, 20 August 2024*
