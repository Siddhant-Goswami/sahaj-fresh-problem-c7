# Sahaj Fresh — the client answers

**Speaking:** Rohit Vaidyanathan, Managing Director, Sahaj Fresh Retail Private Limited
**Date:** 20 August 2024
**Standing position, rounds one and two:** QA memo 17 (QA/2024/MEMO/17, 21 May) identifies the
cause. The corrective action is in flight. We re-baseline the Tier 2 return rate on 31 August and
reopen only if it is not under 0.5 per cent.

**That position does not survive round three.** Read the document in order — the third round is
where it changes and why.

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

# Second round of questions

---

## "QA has the physical root cause and is reverting it. AI cannot fix packaging. Does the Board want prediction of future supply chain anomalies, or an intelligence layer to stop the churn bleeding while the physical fix rolls out?"

The second one. Stop the bleeding.

Let me correct the premise slightly, because it matters. It is not that AI cannot fix the
packaging — obviously it cannot. It is that the packaging is already fixed. The purchase order for
65 micron film went in on 4 June and the first Tier 2 despatch on reverted film was the week of 22
July. That work is done and paid for. I do not need help with it.

Here is what I do not have. I have no way of knowing whether it worked until the numbers come in.
The only instrument I own is a monthly return rate, and we agreed at the Q2 review to re-baseline
on 31 August: under 0.5 per cent and the matter closes, above it and we reopen memo 17. That is
eleven days away and I am waiting on a report. If the reversion has not worked I will find that
out at the end of the month, having lost another month of subscribers in two cities where I have
already cut acquisition by 60 per cent to stop the bleeding a different way.

So if you are asking what I would buy: something that tells me what is happening in those two
cities faster than a monthly report tells me. Not something that tells me what might happen next
year.

On the prediction option, and I will be blunt because you will save yourself a week. I have one
packaging change, one summer, and two hubs that have been open since April. There is no history
in this business to predict from. "Predict future supply chain anomalies" is a sentence I could
put in front of the Board and not a thing I could operate, and I have a Board that is about to
start reading everything very carefully — data room preparation for the Series B begins in
September. A 19 per cent cancellation rate in two cities is the first thing a diligence process
finds. If somebody brings me a chatbot for the data room, the answer is no.

---

## "When a Nashik subscriber clicks Cancel, what is the exact human workflow? Does anyone intervene, or is it a silent exit?"

It is a silent exit.

One correction on your premise. Acquisition was not cut because of the rate as such. Aparna
Nadig's argument at the Q2 review was that we are acquiring into a leaking bucket, and on that
basis we agreed a 60 per cent cut in paid acquisition in both Tier 2 cities from 1 August. The
rate was the evidence, not the reason.

The workflow, exactly as it runs: the subscriber cancels, the reason code is captured as a
required field, the subscription runs to the end of the paid cycle and then lapses. That is the
whole of it. No call. No offer. No queue anybody works. It is nobody's job to intervene, which
means it does not happen.

The one intervention I am aware of was local and improvised. In Indore, a society secretary told
our rider that his committee had cancelled 34 subscriptions with effect from the August cycle.
The route supervisor went there himself the next morning with two crates and a probe, and offered
the society two weeks free and a doorstep temperature check every morning for those two weeks.
That was his own initiative. It is not policy, there is no budget line for it, and his own view
recorded at the time was that he does not think he will get 34 of them back.

To put the scale on it: 604 cancellations in Nashik in Q2 and 561 in Indore. I cannot tell you
that anybody in this company spoke to a single one of them.

---

## 1. "Is it mainly product quality, or are there other reasons too?"

Quality, and it is not close. 68 per cent of Tier 2 cancellations cite product condition against
19 per cent in Bengaluru.

There are other reasons and I am not going to rank them for you, for the reason I gave earlier —
the coded breakdown is Growth's and I would be guessing.

What I will add, because it is the part that convinced me it is a product problem and not a
market one, is Aparna's argument at the Q2 review. If this were a bad acquisition cohort, it would
decay and flatten. It does neither. Nashik went 61, 198, 345 across April, May and June. Indore
went 34, 172, 355. It climbs month on month. That is not a cohort ageing out, that is something
still happening.

---

## 2. "What kind of quality complaints are customers actually making? Real examples?"

I can give you the tickets. These are verbatim from the Nashik queue in April.

> "curd pouches were 'loose', she pressed one and it was watery, refused both. Rider Sandeep
> confirmed he took them back. Customer polite but says this is second time this month, first time
> she did not complain."

> *Customer:* "the curd is sour today, again. we have been with you 14 months"
> *Agent:* "I am very sorry sir. May I arrange a refund and a replacement?"
> *Customer:* "refund is fine. but you should check what is happening, three houses in our
> building said the same yesterday"

A third the same week: all three pouches, taken back at the door, refund of Rs 144.

From Indore, the society secretary, and the supervisor wrote it down as he said it: *"your curd is
not reaching us cold and we have complained four times."*

And one that is not a customer at all — the rider's own note on the first ticket. He says the box
"felt warm" when he opened it at the third stop, though the van reading was fine when he left the
hub at 04:50.

One observation, which you can do what you like with. The first customer says she did not complain
the first time. The second says three neighbours had the same thing the previous day and only one
of them is in our system. So whatever number I quote you for complaints is the floor, not the
count.

---

## 3. "Do the complaints cluster by product, route, delivery time, vehicle or city?"

Four of those I can answer and one I cannot, and I would rather tell you which is which.

**Product — yes, sharply.** Curd. Not paneer, not milk, which carry a different seal geometry, and
curd has the highest moisture content of the three. That specificity is a large part of why QA
landed on the film.

**City — yes, absolutely.** Nashik and Indore. Bengaluru and Pune are flat over the same window.

**Delivery time — yes.** The early routes, every time. Rukhsana flagged that herself in April:
three curd returns in eight days out of Nashik and all of them on the early routes. In Indore the
vans leave the hub between 04:05 and 04:22 and the drops are done before 07:00.

**Vehicle — one incident, and it is closed.** On 9 June a three-wheeler in Indore lost temperature
control on the early Sunday route. The chiller's compressor tripped on low voltage and did not
restart; the auxiliary battery was found at 10.9 volts against a 12.4 minimum and had not been
changed since August 2022. 62 units of Category A were returned and disposed, eleven subscribers
got no Category A that morning and were credited. We audited auxiliary battery age across both
Tier 2 fleets and replaced six in Indore and four in Nashik. That one had a cause and the cause
was fixed.

**Route — I cannot answer that.** We do not cut complaints by route. The only route I can name to
you is the Vijay Nagar one, and I can only name it because a society on it cancelled in a block
and the supervisor wrote a report about it. If you asked me which route in Nashik has the most
condition complaints this month, I could not tell you, and I do not think anybody here could
without going through the tickets by hand.

---

## 4. "When a customer complains about quality, what happens internally? Who looks into it, and how do you figure out what went wrong?"

The handling and the investigation are two different things and I think you are asking about both.

**The handling.** The customer calls the desk. The agent opens a ticket, dispositions it DISP-07,
product condition, returned at door. The rider brings the crates back. The agent refunds to the
customer's wallet and offers a replacement on the next run. The rider's note goes on as an
internal comment. The ticket is closed. If the agent thinks it needs a second look it goes to the
team lead, and the lead decides whether to put it in front of the hub. That is a judgement call,
not a rule. There is a second disposition, DISP-09, no fault found, used where the customer takes
a replacement and we conclude nothing was wrong.

**The investigation.** Here I have to be straight with you: there is no per-ticket investigation.
Nobody roots-causes an individual complaint. It gets refunded and closed.

What actually triggered the work that found the cause was the aggregate. Category A returns at the
two Tier 2 hubs went from a 0.3 per cent baseline to 2.1 per cent over the six weeks to 17 May.
At that size it becomes visible in a monthly report, and once it was visible Priyanka Deshmukh
took it into the QA lab in Bengaluru, drew samples from the new film lot and from retained old
stock, and ran conditioned seal tests. She also pulled cold room temperatures at both Tier 2 hubs
for the period — in band — and reviewed rider handling with the hub managers, which produced a
crate staging briefing at Nashik on 27 April. Returns continued after that briefing, and she used
that as evidence that handling is not the driver.

So the honest answer to "how do you figure out what went wrong" is: we wait until the rate moves
far enough to show up in a monthly report, and then Quality investigates. Between a single
complaint and a monthly report there is nothing.

---

## 5. "What would you want improved in the end — reducing cancellations, catching quality problems earlier, reducing complaints, or something else?"

Cancellations. That is the number the Board sees and it is the number that costs me the Series B
conversation.

But I will answer you properly rather than just picking one off your list. If you come back and
tell me the way to reduce cancellations is to catch the quality problem earlier, I will listen.
What I will not buy is early warning as a thing in itself, bought on the argument that it is
obviously good. Show me the line from the earlier catch to the cancellation that does not happen,
and show it to me in a number.

Two constraints on anything you propose.

**The clock.** We re-baseline on 31 August. If Tier 2 returns are not under 0.5 per cent we reopen
memo 17. Whatever you build either tells me something before then, or it tells me that next time
I will not be waiting eleven days to find out.

**The money.** In February the Board directed management to take not less than Rs 1.8 crore a year
out of recurring infrastructure cost, and we delivered Rs 1.82 crore, a quarter early. I am not
going to sign a new recurring line that quietly hands some of that back. So when you come to me,
come with a cost per month at our volume, and tell me what it does to that cost if Tier 2 doubles.

---

# Third round of questions

## Before I answer any of these

I have gone away and read two things I had not read.

The first is section 4 of incident record INC-2291, raised at Indore on 9 June. The second is
section 4 of Harish Mane's route supervisor report of 18 July. Both documents had crossed my desk.
I had read the parts of them I thought were mine — a vehicle with a flat auxiliary battery, a
society that cancelled — and I had not read the sections where the two men who wrote them said, in
plain words, that they did not understand something and did not know who owned it.

I am not going to defend that. Sats told me at the start of this session that five of my people
each found one piece and the company still had no answer, and I argued with him. He was right and
I was wrong, and the proof is that the two pieces I had not read are the two that matter.

What follows is what I now think, twelve hours after telling you the packaging was the cause.

---

## Shefali Mody

### "What aren't you saying that isn't in the corpus? Have you spoken to the CFO?"

Yes to the CFO, and here is the thing I have not been saying.

The Resolution 31/05 cost programme delivered Rs 1.82 crore against a Rs 1.8 crore mandate, a
quarter early. The single largest line in it is the fleet telematics changeover at Rs 68 lakh.
That saving is not measured against what we used to pay. It is measured against the incumbent's
quotation for an enlarged six-hub fleet, which we never took up. Tarun Sethi asked at the Q2
review on 11 July whether a saving measured against a quotation nobody accepted is a saving. Farida
Kutty said the treatment is consistent with how the other five lines were built and that Finance
is comfortable. I said the Board had asked for a number and this was the number, and I moved the
item on.

That is what I have not been saying. My Head of Engineering put a question mark on the biggest
line in the programme in front of eight people, and I closed the discussion because I wanted the
number.

### "Has anyone reconciled the Pune numbers against the packaging root cause?"

No. And until an hour ago I could not have told you what the Pune numbers were, because they are
in section 4 of the report I had not read.

They are these. Pune touched 40 degrees on 22 and 23 May and 41 on 26 May. Category A returns at
Pune: 0.2 per cent in May, 0.3 in June, 0.2 in July. Indore over the same three months: 1.9, 2.4,
2.6.

Memo 17's argument is that the 55 micron film holds at ambient and fails after four hours at 40
degrees, and that this is why the Tier 2 hubs break and the Tier 1 hubs do not. Pune is on the same
national film contract. Pune went to 41 degrees. Pune returned 0.2 per cent.

I cannot reconcile that, and neither can memo 17. Harish Mane wrote at the bottom of that section
that the numbers were not what he expected to hear and that he did not know what to do with them,
and that it was above his level. He was right that it was above his level. It arrived at his hub
manager and at Meghana and it stopped there.

### "Is the Rs 1.8 crore programme open for revision, or politically closed?"

It was closed. It was going to the Board at the Q3 meeting as a closed item, with a recommendation
that the team be recognised for it.

It is open as of this conversation. I am the person who closed it and I am the person who has to
reopen it, and I would rather do that myself before the data room than have somebody else do it
during diligence.

I want to be precise about what is being reopened, because it is not the whole programme. Five of
the six lines are real reductions against things we were actually paying. The telematics line is
the one where the saving may have been bought with something, and nobody priced what was given up.

### "Who owns the detection gap, and what is the plan for it in diligence?"

Nobody owns it. That is the answer as it stands and it is not a good one.

Action 4 on INC-2291 reads "detection gap at section 4: obtain explanation." Owner: unassigned.
Status: open. It was raised on 9 June, left open at the Indore weekly review on 14 June, left open
again on 21 June, and the incident was closed with observation on 24 June with that action still
open. Harish wrote that he recorded it there rather than let it drop because he did not know which
document it belonged against.

From today it is Vinay Kulkarni's, as VP Operations and the man who negotiated the contract, with
Meghana Iyer owning the SOP side of it. I am not comfortable with the person who signed the
contract also owning the question of whether the contract is adequate, so Meghana reports the
number and Vinay fixes it.

For diligence: it goes into the data room as a named open issue with a dated remediation and a
cost, and it goes in before anybody asks. An issue we found and are fixing is a paragraph. The
same issue found by a diligence team in our incident records is a discount.

### "What number has to move, by when, and who declares it moved?"

Two numbers, and I have to be careful because they are about to interfere with each other.

The first is time from onset to detection. Today, on the one trip where I have both timestamps, it
is 41 minutes. What it should be is whatever clause 6.3 already says it should be — an alert inside
one polling cycle of the 20 minute threshold being crossed. That is not a target I am inventing;
it is an obligation we have been in breach of and recording as compliant.

The second is the Tier 2 Category A return rate, under 0.5 per cent, which was already committed
for the 31 August re-baseline.

Here is the problem, and it is mine to solve before I ask you to solve anything. The film reversion
reached Tier 2 in the week of 22 July. If we change anything about detection now, both changes land
inside the same measurement window and the 31 August number cannot tell me which one moved it. I
have been treating 31 August as the date the question gets answered. It is now the date two
questions get answered together, which means neither of them does.

Meghana declares it, on her number, not Operations'.

---

## Deepak

### "Are we stopping churn at all costs, or minimising wastage? A system that never delivers sour milk will aggressively dump marginal inventory."

That is the sharpest thing anybody has asked me today, and the answer changed in the last hour.

I would have told you this morning that it is a genuine trade-off and I want the balance. What I
now think is that we are not on the trade-off curve at all. Clause 7.1 says Category A product
subject to a confirmed excursion does not get delivered — the rider brings the crates back and we
destroy them. That rule only fires when an excursion is confirmed. If the alert does not fire, the
rule never engages, the crate goes to the door, and the wastage register records nothing.

So the clean wastage line I have been looking at all year is not evidence that we are running a
tight operation. It may be evidence that we are not catching anything. INC-2291 is the one trip
where the alert did fire, and it cost us 62 units disposed and eleven subscribers credited on one
morning. One trip.

Optimise for churn. And yes, I am expecting the wastage line to go up, possibly a lot, and I am
telling you now that I will defend that number to the Board. A destroyed crate of curd is tens of
rupees a pouch. A cancelled subscription is a monthly bill I never see again, and at Kesar
Nandanvan we lost 34 of them in one committee meeting. I would rather explain wastage than churn.

But show me the wastage line. Do not hide it inside the churn case.

### "What is an acceptable target for Tier 2 cancellations? Does it need to match Bengaluru's 6 per cent?"

Nobody has set one, and that is a real gap that you have just found. I am not going to invent a
number in this room to make your scoping easier.

What I will hold myself to are the two figures already on the record. Category A returns under 0.5
per cent, which is Meghana's commitment. And on cancellations: Nashik ran 61, 198, 345 across
April, May and June, and Indore 34, 172, 355. June is the last month in which I will accept an
increase. Direction first, then we argue about the destination.

Matching Bengaluru at 6.4 is the right long-run answer and I would be lying if I told you I expect
it inside two quarters.

### "With the Series B data room opening in September, do you need a low-lift fix in three weeks, or an algorithmic roadmap for the pitch deck?"

The three-week fix. Emphatically.

A roadmap in a deck that is not running in the business is not an asset in diligence, it is a
liability, because the first question is "and is it live?" and the answer is no. I said earlier
today that if somebody brought me a chatbot for the data room the answer was no. That still
stands, and it now extends to a roadmap slide.

What helps me in September is being able to say: we found a detection failure, here is the date we
found it, here is what it cost, here is what we changed, and here is the number since. That is a
strong paragraph. It is stronger than anything you could put on a slide.

### "Must the solution live inside the Rs 1.82 crore mandate, or is there a dedicated AI budget to undo the hardware compromises?"

There is no AI budget. There is no line called that.

But your question contains an assumption I want to make explicit, because I think it is correct
and I had not seen it until this session. You said "to undo the hardware compromises." If the
detection gap is a consequence of what we bought in March, then part of that Rs 68 lakh was not a
saving at all. It was a purchase of a cheaper level of service, booked as a saving, with the
difference never costed.

So the framing is not "does this come out of the mandate." It is: what does it cost to restore the
level of service the SOP already requires, and is that number smaller than Rs 68 lakh? If it is —
and I would be surprised if it were not — then this is a contract question before it is a software
question, and I should not be paying anybody to build something to work around a clause I could
just buy.

Vinay is bringing me, tomorrow morning, what Annexure D of that SOW charges to shorten the sensor
polling interval across the 42 vehicles in scope. I have not seen that page. I am told there is a
rate card.

The Board's per-contract ceiling under Resolution 31/06 is Rs 75 lakh a year and Vinay already
holds the authority to negotiate inside it. So if the answer is a contract variation, I do not
need to go back to the Board to do it. I only need to go back to tell them the Rs 1.82 crore was
worth less than I said.

---

## Parminder Bagga

### "On excursion trips, do you reconstruct which drops were already delivered before detection? How many Category A units reached doorsteps out of band in Tier 2?"

We do not reconstruct it, and I cannot give you that number. Nobody in this company can give you
that number today.

Take INC-2291, which is the best-documented trip we have. The vehicle left the hub at 04:12. The
product zone read 8.6 degrees at 04:15, 10.9 at 04:30, 12.3 at 04:45. The excursion state was
raised at 04:48, the desk acknowledged at 04:56, and the rider was told to return at 05:02. On that
route, delivery starts at about 04:35.

So there is a window of roughly half an hour in which that rider was making drops from a
compartment that was already out of band. The incident record tells me what came back — 62 units
disposed, eleven subscribers credited. It does not tell me what went out. Nobody wrote it down and
nobody has been back to work it out.

And that is the good case, as you say. For a trip that never raised an excursion at all there is no
incident record to reconstruct from. The dashboard holds readings for 13 months rolling, so the
raw material exists for the whole life of both hubs. It has never been queried for this.

I would like that number. I am also aware that asking for it is asking how many customers we
knowingly served warm dairy to, and that the answer goes into a data room. I want it anyway.

### "Incident action 4 has been unowned since June. Who can explain the difference between how the old-city fleet and the new-city fleet report temperature, and can I see both configurations?"

You can see both, and I have asked for both to be put in front of you rather than described to you.
Vinay Kulkarni can explain the commercial side and Meghana Iyer the SOP side.

What I can tell you now, having gone and looked at the SOW this evening, is the fact that I think
you are driving at, and I had not put it together until you asked the question in those words.

The Nirvath contract covers Nashik and Indore. Clause 2.3 puts Bengaluru and Pune expressly out of
scope — no supply, no retrofit, no migration, no data services. The old cities are still on the
incumbent arrangement with Sarathi at Rs 1.10 crore. So when your Bengaluru supervisor tells you a
warm compartment showed up on screen while he was still looking at it, he is describing a different
vendor, a different device and a different configuration to the one that produced 41 minutes at
Indore.

The same SOP governs both fleets. Two different sets of equipment were bought to satisfy it, and
only one of them was ever checked against it.

I have no evidence Nirvath have breached anything. Their response to Harish's ticket was that the
device was operating within specification for this account, no transmission gaps, no faults, no
fault found. I now think that answer was probably true and completely useless, and that the
question was asked of the wrong party. Harish asked the vendor whether the device was broken. The
question was whether what we bought could meet the rule we wrote.

---

## Sats

### The arithmetic

I am not going to argue with it. I want to say clearly what I am accepting, because I have spent
this entire session telling you it was the packaging.

I did not know the polling interval. I have never heard anyone say "clause 6.3" out loud in this
company. I have now read both. Annexure B6 of the SOW sets the sensor polling interval at 15
minutes. Clause 3.2 defines an excursion as product above 8 degrees sustained beyond 20 continuous
minutes, and 6.3 requires the alert inside one polling cycle of that threshold being crossed.

Your point is that the second cannot be satisfied by the first. Two readings 15 minutes apart do
not establish 20 continuous minutes, so the system needs three, and three readings is 30 minutes
before it is entitled to declare anything. Anything shorter than that produces no alert. Not a late
alert — none.

And then clause 7.1, which is the part I had not followed through. Disposal is triggered by a
confirmed excursion. No alert, no confirmation, no disposal, no wastage entry. The van completes
its round, the curd goes to the door, and every log we keep comes back clean. Cold room in band.
Trip sheet signed. Wastage register empty. Vendor reports no fault found.

Which is what every document in the pile says. Priyanka wrote that cold room temperatures at both
Tier 2 hubs were pulled and were within band, and she was right, and it told her nothing, because
the failure is not at the cold room end and our instrumentation is not capable of seeing where it
is.

I would like two things verified before I take this to the Board, and I am asking for verification
rather than disputing it. First, that the dashboard's duration logic works the way you have assumed
— that it counts continuous breach across received readings and cannot interpolate. Second, whether
the webhook retry behaviour at Annexure B10, which retries at 5 and 20 minutes on a non-2xx,
extends the gap further in practice. If both hold, the 41 minutes at Indore is not an anomaly
anybody needs to explain. It is the contract working exactly as written.

One more thing, and then I will stop. Tarun's post-mortem on the August app outage has a paragraph
in it where Engineering considered using the cold chain dashboard as a liveness signal and dropped
the idea, because the Nirvath feed does not stream — it arrives batched, a clump at a time. They
tested that against the 14 August data and wrote it down as a note that was explicitly not an
action item.

So the sixth person who found a piece of this was my Head of Engineering, eleven days ago, and he
filed it under things that are not action items. Nobody asked him why the feed was batched. It is
batched because we bought it batched, at 15 minute intervals, in March, and booked the difference
as Rs 68 lakh.

---

# Fourth round of questions

*These came in after I had conceded the position above. I am answering them as the person who
conceded it, not as the person who spent this morning defending memo 17. Some of the answers
therefore differ from what I would have told you six hours ago, and I have said where.*

---

## "What are the main reasons for the cancellations in these two cities?"

The coded reason is product condition — 68 per cent of Tier 2 cancellations against 19 per cent in
Bengaluru. That much I told you this morning and it has not changed.

What has changed is my explanation of it. This morning I told you the reason underneath the code
was the packaging film. I no longer believe that is the whole of it, and I am not sure it is the
main part of it. What I now think the reason is: curd is arriving at the door out of temperature
on the early Tier 2 routes, the instrumentation we bought for those two cities cannot raise an
alert in time to stop the van, and each complaint is refunded and closed one at a time so the
pattern on a route is never assembled. The customer experiences that as bad curd twice and leaves.

And the honest caveat on the whole answer: the free-text reason each leaving subscriber wrote is
still unread. It was due to be sampled on 15 August. So the most direct evidence of why people are
cancelling — them saying why — is the one source nobody in this company has opened.

---

## "Are you adopting any AI in your day-to-day logistics?"

None. Not a pilot, not a proof of concept, not a vendor trial.

To be concrete about what we do run, so you are not guessing: a dispatch platform under licence, a
rider mobile application for manifests and proof of delivery, a telematics dashboard from the
vendor, and a support ticketing system with disposition codes. Route planning is a supervisor with
a spreadsheet — 275 drops planned across four Indore routes on a given morning, vehicles assigned
by hand, absences covered by overtime. Threshold alerting on the dashboard is a fixed number, 8
degrees, configured per vehicle class.

There is nothing in that list that learns anything, and I would rather tell you that plainly than
dress up a threshold as an algorithm.

The nearest thing to inference in this company this year was a support lead reading three tickets
and concluding it was the season. He was working from four data points and a memory of Pune two
summers ago. He was wrong, he documented his reasoning, and nothing in our systems was capable of
telling him he was wrong.

---

## "What is your current customer marketing strategy?"

Acquisition, and until three weeks ago that was the entire strategy.

The shape of it: paid acquisition into a subscription, priced to get the first crate through the
door, on the assumption that a daily dairy delivery becomes a habit and habits do not churn. In
Q2 that bought 3,180 gross adds in Nashik and 2,940 in Indore.

We lost 604 of the Nashik ones and 561 of the Indore ones inside the same quarter. Aparna Nadig's
phrase at the Q2 review was that we are acquiring into a leaking bucket, and on that basis we cut
paid acquisition in both Tier 2 cities by 60 per cent from 1 August.

So the current strategy, stated honestly, is: we have stopped buying subscribers in the two cities
where we cannot keep them, and we have not replaced that with anything. There is no retention
programme, no win-back, no lifecycle contact, nothing that runs when somebody cancels. I described
it earlier today as a silent exit and that is exactly what it is. Marketing in this company means
the top of the funnel and nothing below it.

---

## "How structured is your logistics strategy and partnership?"

Structured on paper. Fragmented in procurement. That distinction is the whole of my answer.

**On paper.** One cold chain SOP, SOP-CC-004, version 4.0, effective 8 January. Clause 2.2 puts
every vehicle in scope whether owned, leased or third-party operated, and every city hub including
hubs commissioned after that date — which was written precisely so that Nashik and Indore would be
covered before they opened. Chilled band 2 to 8 degrees. Defined excursion, defined detection
obligation, defined disposal, defined escalation, defined record retention. It is a good document.
Meghana wrote it and it anticipated the expansion.

**In procurement.** Five hubs, and the instrumentation under that single SOP was bought city by
city by whoever was negotiating in that year, against a Board mandate to take cost out. Bengaluru
and Pune sit with the incumbent, Sarathi, at Rs 1.10 crore. Nashik and Indore sit with Nirvath at
Rs 42 lakh on a 36-month term from March, 42 vehicles, terminable for convenience after month 18
on ninety days' notice with the unamortised hardware payable.

Two different vendors, two different devices, two different configurations, one rulebook, and
nobody whose job it was to check the second one against the rulebook before signing.

And the thing I noticed this evening reading the service levels, which I am fairly sure nobody has
said out loud in this company: what we bought service levels on is dashboard availability, 99 per
cent monthly, and hardware replacement within five working days. There is no service level on
detection. Nothing in that contract obliges anybody to tell us a van is warm within any particular
time. The remedy for a breach of the availability SLA is service credits capped at 5 per cent of
the quarterly charge, and clause 4.3 makes that our sole financial remedy.

We contracted for uptime. The SOP requires detection. Those are not the same product and we bought
the wrong one.

---

## "What is the level of your customer satisfaction, and have you had feedback on it?"

We do not measure satisfaction. There is no survey, no score, no NPS, nothing that asks a
subscriber how it is going while they are still a subscriber.

What we have instead are three things, and all three are lagging and all three are self-selecting:
complaints from people who called, cancellations from people who left, and a reason code captured
on the way out.

The feedback we do have is worth reading precisely because it tells you how bad the instrument is.
One subscriber told us it was the second time that month and that she had not complained the first
time. Another told us three houses in his building had the same thing the previous day, and when
the agent checked, one of those three was in our system — and that one had been closed as no fault
found because the customer accepted a replacement. A society in Indore complained four times, all
four were refunded and closed at the desk, none reached the hub manager, and the next thing we
heard was the committee cancelling 34 subscriptions in one meeting.

So: the complaint count is a floor, not a measurement. The only satisfaction instrument this
company owns is people leaving, and by the time it reads, it has already read.

---

## "What is the condition and the level of your Quality Control department?"

Better than the rest of the company, and I want to say that clearly before I criticise the scope of
it.

Priyanka Deshmukh runs QA under Meghana Iyer, with a lab in Bengaluru. When the Tier 2 return rate
moved she drew samples from the new film lot and from retained old stock, ran conditioned seal peel
and drop tests against internal methods, and produced a memo with the numbers in it and the method
named. She then wrote, in her own memo, that the inbound acceptance protocol had no conditioned
seal test in it, that this was a gap, and — her words — that the gap is hers and she is owning it.

That is the standard I want everywhere in this business and do not have.

The criticism is not of the department, it is of its remit. QA's scope is the product and the
packaging. Section 6 of that memo is headed "not investigated further" and it records that cold
room temperatures at both Tier 2 hubs were pulled and were within band. She checked what was hers
to check and she checked it properly. Nobody in this company has the equivalent remit for the cold
chain in transit — for whether the instrumentation between the cold room and the doorstep is
capable of seeing what the SOP says it must see. Meghana owns the SOP. Vinay owns the contract.
Nobody owned the question of whether the second satisfies the first, which is exactly why that
incident action sat unassigned from June to today.

---

## "Is your packaging verified and up to the mark?"

It is verified now. It was not verified properly when we changed it, and I want to give you the
sequence rather than a yes or a no, because the answer has become genuinely awkward in the last few
hours.

**What we did wrong in February.** We moved Category A pouch film from Sanchit to Nivaan under
procurement rationalisation, 65 micron down to 55. The specification was accepted on Nivaan's
declared burst strength, which is marginally better than Sanchit's despite the thinner gauge — 226
kPa against 218. That acceptance was based on a supplier certificate at ambient. Nobody conditioned
a sample, because the acceptance protocol did not require it.

**What the lab found in May.** At ambient the Nivaan film is inside specification. Conditioned four
hours at 40 degrees it is not, on two of five measures: seal peel 14.2 newtons per 15mm against a
specification of 18, and 6 failures in 20 on the drop test against a limit of 1 in 20. Those are
real results and I am not going to wave them away.

**What we are doing.** Reverting Tier 2 supply to 65 micron, Rs 0.34 a pouch, about Rs 5.7 lakh a
year on Tier 2 volume. Purchase order placed 4 June, first despatch week of 22 July. And adding a
40 degree conditioned seal test to inbound acceptance for all flexible packaging, which is
Priyanka's fix to the protocol.

**And here is the part I did not see until today.** We decided to keep 55 micron at Bengaluru,
Bengaluru two and Pune, on the argument that the validated climate envelope holds in those cities.
That decision preserves roughly 70 per cent of the packaging saving.

Pune touched 41 degrees in May. Pune is on 55 micron film. Pune returned 0.2 per cent.

So the field contradicts the lab, and both are correct. The film genuinely fails a conditioned test
at 40 degrees, and a city that runs at 41 degrees on that same film has no problem at all. The only
way both of those are true is that something other than the film is deciding whether a customer
gets bad curd, and Pune has it and the Tier 2 hubs do not.

I am not cancelling the film reversion. The test results stand and a thicker film is the right
specification regardless. But I have been telling this Board, and told you this morning, that the
film is the cause of a 19 per cent cancellation rate, and I no longer think a Rs 5.7 lakh packaging
change is going to fix it. If I am right about that, then on 31 August the return rate will not
come under 0.5 per cent, memo 17 reopens, and we will have spent three months on the wrong
correction while the actual one sat in an unassigned action item.

I would rather find that out from you now than from the number on the 31st.

# Fifth round of questions

*Same day, late. These five came in after I had signed the section above, and four of them are
questions I should have been asked by my own Board in June. I am answering them as the point of
contact for this engagement, which from today is me and not Vinay, because every one of these
crosses a line between two of my directors and that is exactly where everything in this company
has been getting lost.*

*Where I am giving you a number, it is a number that exists in a document I have read. Where I am
giving you a date, it is a commitment with a name against it. Where I have neither, I say so.*

---

## "INC-2291 flagged a 41-minute gap between the compressor fault and the dashboard's excursion alert; the vendor closed it 'no fault found,' and the action to explain it was still open and unassigned as of the last review on record. Has anyone traced that gap since, and is similar detection latency still occurring on NSK-1/IND-1 routes?"

**Has anyone traced it: no.** Not between 9 June and this session. Action 4 on that incident record
reads "detection gap at section 4: obtain explanation," owner unassigned, and it was still
unassigned when I sat down with you this morning — through the IND-1 weekly review on 14 June,
again on 21 June, and through the closure of the incident itself on 24 June. Seventy-two days. The
man who raised it wrote that he was recording it there because he did not know which document it
belonged against, and he was right, because there is no document in this company that it belongs
against.

It has an owner as of today. Vinay Kulkarni fixes it, Meghana Iyer reports the number, and I have
split it that way deliberately because Vinay negotiated the contract that I now think caused it.

**What we know about the 41 minutes.** The vendor's answer was that the device was operating within
specification for this account, no transmission gaps, no faults. I now believe that answer was
true. Annexure B6 of the Nirvath SOW sets the sensor polling interval at 15 minutes. Clause 3.2 of
our own SOP defines an excursion as above 8 degrees sustained beyond 20 continuous minutes. Three
readings at 15-minute spacing are needed before the dashboard is entitled to declare 20 continuous
minutes of anything, and three readings is 30 minutes.

Put INC-2291 against that. Onset in the chiller's own fault memory is 04:07. The compartment was
next read at 04:15 and was already at 8.6 degrees, then 10.9 at 04:30, then 12.3 at 04:45 — three
consecutive readings, the earliest moment the duration test can be satisfied — and the alert was
raised at 04:48. Eight minutes of the compartment warming before anybody looked at it, thirty
minutes of waiting for enough readings to be allowed to call it, three minutes of dashboard. That
is the 41 minutes, in full, and every one of those minutes is the specification working.

So the 41 minutes is not an anomaly and there is nothing for the vendor to explain. It is the
contract performing to specification against an SOP it was never checked against. Harish asked the
vendor whether the device was broken. Nobody asked whether what we bought could satisfy the rule we
wrote.

**Is it still happening: almost certainly, and I cannot prove it to you, and the reason I cannot is
the finding.** A late alert leaves a record. An alert that never fires leaves nothing — no
excursion log under clause 6.5, no disposal under 7.1, no wastage entry under 7.3, no incident
under 8.2. The only trips in our system with both an onset time and a detection time are trips
where the compressor died hard enough to leave a fault memory in the workshop and a supervisor
went and looked. That is one trip in five months. Our detection-latency dataset has a sample size
of one because the failure mode deletes its own evidence.

Nothing has changed on those two fleets since June. Same 42 vehicles, same devices, same 15-minute
interval, same thresholds. The battery audit in June replaced six units at Indore and four at
Nashik, which fixes a cause of excursions and does nothing whatever to detection. So my answer is:
yes, structurally, on every out-of-band trip at NSK-1 and IND-1 since those hubs opened in April.

**What I have asked for, and the dates.** The dashboard holds readings for thirteen months rolling,
so the raw material exists for the entire life of both hubs and has never been queried for this.
Meghana's team is to produce, by **Friday 23 August**, for every trip at NSK-1 and IND-1 since
8 April: the time of the first above-band reading, the time of the excursion alert if one was
raised, and the count of trips carrying three or more consecutive above-band readings where no
alert was raised at all. That last count is the number I actually want and the one nobody has ever
seen. The same query is to be run against BLR-1, BLR-2 and PNQ-1 so there is a comparison.

Two things I want verified rather than assumed, and I said this to Sats earlier: that the
dashboard's duration logic counts continuous breach across received readings and cannot
interpolate between them, and whether the retry behaviour at Annexure B10 — non-2xx retried at 5
and 20 minutes — stretches the gap further in practice. Tarun Sethi's post-mortem on the August
outage records that the feed arrives batched rather than streamed, which he found on 14 August,
wrote down, and explicitly marked as not an action item. It is one now.

---

## "Pune hit 40–41°C in May and runs hot every year, yet held 0.2–0.3% Category A returns all quarter, while Indore ran 1.9–2.6% over the same months. What's different about Pune's cold chain, route start times, crate-staging practice, or packaging batch that Nashik/Indore don't have?"

This is the question that broke my position today, so let me take your four candidates one at a
time and tell you which of them I can answer and which I cannot.

**Packaging batch.** Nothing is different, and this is the fact that ends memo 17 as a complete
explanation. Pune is on the same 55-micron Nivaan film under the same national contract. We kept
55 micron at Bengaluru, Bengaluru two and Pune deliberately, to preserve about 70 per cent of the
packaging saving, on the argument that the validated climate envelope holds in those cities. Pune
touched 41 degrees on 26 May. Pune returned 0.2 per cent in May. The lab result is real — seal peel
14.2 newtons against a specification of 18 after four hours conditioned at 40 degrees — and it does
not predict Pune. Both things are true, which means something other than the film decides whether a
customer gets bad curd.

The one caveat I will not paper over: "same national contract" is a statement from a procurement
schedule, not a verified fact at the hub. Nobody has read the lot codes off pouches actually
delivered at PNQ-1. Priyanka can do that in a morning and it is worth doing before we build
anything on the assumption.

**Crate staging.** Nothing is different, and we know because we asked. Harish rang Digvijay
Ghorpade at PNQ-1 on 18 July specifically to find out what Pune does about staging in the hot
months. Digvijay said they do nothing special. That answer is more damaging than it looks, because
crate staging was the theory Joseph Mathai wrote up at Nashik in April — vans in the sun at society
gates, riders doing four floors on foot, Pune solved it two summers ago with stairwell staging —
and the whole of our April response was a rider briefing issued on that theory. The man in Pune
says the thing that theory says he does was never done.

**Route start times.** I do not have Pune's. That is an honest gap and it is embarrassing at this
stage of the conversation. What I have is Indore: vans departing between 04:05 and 04:22, delivery
on IND-A starting about 04:35, and Nashik departing about 04:50 on the trip in the April ticket.
Vinay is getting me PNQ-1 despatch and first-drop times for the same period, with vehicle class and
route lengths, by **Monday 26 August**. If Pune departs later, into daylight and warmer ambient,
and still returns 0.2 per cent, that closes off the early-route explanation entirely.

**Cold chain — and this is the one I would put your money on.** Clause 2.3 of the Nirvath SOW puts
Bengaluru and Pune expressly out of scope: no supply, no retrofit, no migration, no data services.
Pune is still on the incumbent, Sarathi, inside the Rs 1.10 crore arrangement. Different vendor,
different device, different polling behaviour, same SOP over the top of both, and only one of the
two was ever checked against it. When a Bengaluru supervisor tells you a warm compartment appears
on screen while he is still looking at it, he is describing the fleet we did not change.

Here is the mechanism I think you are looking at, and I want to state it as a hypothesis with a
test attached rather than as a finding, because I have been wrong once today already.

A Category A return is a doorstep refusal. It is what happens when warm curd reaches a customer.
If Pune's instrumentation detects an excursion inside the SOP's window, the desk turns the van
around under clause 7.1 and the crates come back and are destroyed. The failure lands in Pune's
**wastage register**, not in Pune's return rate. At Indore, on a 15-minute interval, the alert
never fires, the van completes the round, and the same failure lands at 275 doorsteps and comes
back to us as returns, complaints, and a society committee cancelling 34 subscriptions in one
meeting.

If that is right, Pune and Indore may be suffering the same physical event at similar rates and
booking it in two different ledgers — one of which I look at every month and one of which I have
been quietly congratulating myself on.

**The test, and I want it run before anybody writes a line of code.** Pull PNQ-1's excursion count
and wastage register for May, June and July and set them against IND-1's for the same months. If
Pune shows materially more confirmed excursions and more disposal than Indore while returning a
tenth of the Category A returns, the difference between those two cities is detection and nothing
else, and the entire case moves off packaging and onto the Rs 68 lakh line. If Pune shows neither —
few excursions *and* few returns — then Pune's cold chain genuinely does not fail and there is a
physical difference we have not found yet, and I would want you looking at fleet age, vehicle class
and hub maturity next. Note that our June auxiliary-battery audit covered NSK-1 and IND-1 only.
Nobody has ever audited Pune's, and Pune has been running since January 2022 with supervisors who
have been through four summers.

Meghana has that comparison, both hubs, by **Friday 23 August**. It is a query, not a project.

---

## "QA's 21 May memo says Category A returns are caused by the thinner Nivaan film failing above 40°C, 'closed pending' a revert to 65-micron film that was due to reach customers the week of 22 July. Can you send week-by-week Category A return rate and cancellation counts for NSK-1 and IND-1 from 22 July to today, split before/after the reverted film actually reached customers?"

Yes, and I will send it. Meghana and Aparna jointly, to you by **Friday 23 August**. Before it
arrives I want to tell you four things about it, because if I send you that series without them you
will draw a conclusion from it that it cannot support.

**One: I do not currently know the split date, and "week of 22 July" is not it.** That was the
first despatch of reverted film from the supplier. What your question actually asks for is the date
the first customer received a pouch in 65-micron film, which is despatch, plus transit, plus goods
inward at the hub, plus whatever 55-micron stock was sitting in that hub and got used first,
separately for Nashik and for Indore. Nobody recorded a changeover date. It is reconstructible —
goods receipt notes at each hub and the lot code printed on the pouch — and that reconstruction is
now Meghana's, with the same Friday date. Until it is done, any before-and-after split is a guess
dressed as an analysis. If the two hubs turn over on different dates, and they very likely did, the
series has to be split per hub, not for Tier 2 as a block.

**Two: the return rate we report and the return rate you would compute from the field are not the
same number.** Our monthly figure — Indore 1.9, 2.4, 2.6 per cent for May, June and July — is a
unit-based rate. The daily supervisor report for 18 July shows 275 drops planned, 261 completed,
14 returns of which 12 were Category A, which is 5.1 per cent of drops and about 4.4 per cent of
drops for Category A alone. Those are different denominators, not a contradiction, and if I hand
you a weekly series without fixing the denominator you will read a step change that is an artefact
of arithmetic. The series will come with the denominator stated on it and will be built one way
throughout.

**Three: the count is biased downwards and I know by how much in kind, not in size.** A doorstep
refusal is dispositioned DISP-07. Where the customer accepts a replacement and the desk concludes
nothing was wrong, it is closed DISP-09, no fault found — and that is how ticket SF-NSK-118298 was
closed on 22 April, which is why the third of the three houses in that Nashik building never
appeared in the pattern. DISP-09 closures on Category A curd are the same event with a different
label on it. You will get both series: DISP-07, and DISP-07 plus DISP-09-on-Category-A. The gap
between the two lines is itself a finding.

**Four, and this is the one that ruins the experiment: three changes land inside your window and
only one of them is the film.** The film reversion reached customers somewhere in late July.
Paid acquisition in both Tier 2 cities was cut by 60 per cent from 1 August, which changes the
subscriber mix inside the window — fewer new joiners, and new joiners are not the ones who leave.
And nothing at all has changed about detection, which is the variable I now think matters most.
On the cancellation counts specifically, watch the date semantics: a cancellation is captured when
requested and the subscription lapses at the end of the paid cycle. Kesar Nandanvan's committee
decided on 15 July, effective from the August cycle. Those 34 households will appear in the August
numbers, a fortnight after the film changed, and they will look for all the world like the fix
failing. They were lost in June and July.

This is why I told Shefali that 31 August has stopped being the date a question gets answered and
become the date two questions get answered together. I would rather give you a series with the
confounds written on the front of it than a clean-looking chart that persuades my Board of
something false for a second time.

---

## "Multiple signals died at the point level instead of reaching a single owner — four Kesar Nandanvan complaints never escalated before 34 of 46 households cancelled; a repeat sour-curd complaint was closed 'no fault found' days before two more households reported the same thing. Who owns connecting a support ticket, a route supervisor's field note, and a QA finding into one picture today, and how is that actually done?"

**Nobody owns it. There is no such role, no such meeting and no such system.** I argued the
opposite with Sats this morning and I was wrong, so let me set out precisely what does exist,
because the shape of the gap matters more than the admission.

Every one of those signals has a home and a proper owner *within its own system*. A ticket belongs
to the desk agent, who dispositions and closes it. A field note belongs to the route supervisor,
who files it to his hub manager. An incident belongs to the raiser under SOP-QA-002. A QA finding
belongs to Priyanka under Meghana. Each of those chains works. What does not exist is anything that
reads across them.

**How a signal actually travels today.** The agent refunds and closes. If she judges it needs a
second pair of eyes it goes to her team lead; if he judges the same, it goes to the hub manager.
That is judgement at two points, not a rule at either. Rukhsana Pathan asked her lead in writing on
26 April whether to raise a third curd return in eight days to the hub or whether it was a known
thing. Joseph Mathai answered that it was the season, told the hub manager there was nothing to
action, and issued a rider briefing. He documented his reasoning honestly, he was working from four
tickets and a memory of Pune two summers ago, and nothing in any system we own was capable of
telling him he was wrong. In the same thread Rukhsana asked whether she should reopen 118298. There
is no record that anybody answered her.

**The only automatic joins we have are in the SOP, and both are downstream of the alert.** Clause
8.1 escalates two confirmed excursions on one vehicle in seven days to Meghana. Clause 8.2 raises
an incident where detection missed the 6.3 obligation. Both are keyed to a *confirmed excursion*.
No alert, no confirmation, and neither rule ever fires. So the entire cross-signal wiring of this
company sits behind the one mechanism that does not work, and it has therefore never fired at
NSK-1 or IND-1.

That is why Kesar Nandanvan looks the way it does. Four tickets on one route into one society
across ten days — SF-IND-13288, 13341, 13402, 13455 — each refunded, each closed, none escalated,
because no individual one of them met any threshold and there is no threshold that counts them
together. The first time those four became a single fact was when the society secretary said it to
a rider at the gate, and by then the committee had already voted. Harish went himself with a probe
on 16 July and read 9.4 degrees at the gate at 06:20. He offered a two-week extension and a daily
probe check, which was his own initiative and not policy, and he wrote that he did not expect to
get 34 back.

**What I am putting in place from today, and I am telling you this so you scope against what will
exist rather than what did.**

Meghana Iyer owns cross-signal review. Not Support, not Growth, not me — the SOP owner, because the
question that has to get asked across those documents is whether the cold chain is doing what the
SOP says, and she is the only person whose remit spans a ticket, a probe reading and a lab result.
She chairs a standing weekly review of Tier 2 quality signals, first sitting **Friday 30 August**,
with the desk, the two hub managers and Priyanka in the room, and it reads tickets, supervisor
reports and incident actions as one pile.

The escalation judgement comes out of the desk. Any cluster on one route, one society or one
product inside seven days escalates to the hub manager automatically, and DISP-09 no-fault-found
becomes unavailable on Category A curd without a hub manager's countersignature. I would rather
over-escalate for a quarter and tighten it than leave a 22-year-old agent to decide alone whether
three complaints are a pattern.

Every unassigned action on an incident record gets an owner before that incident can be closed. INC-2291
was closed with observation on 24 June with its most important action blank, and that must never be
possible again.

And Aparna Nadig reads the exit verbatims. That was her action from 11 July, due 15 August, five
days overdue, and it is the single largest unread body of evidence in this business.

I will say the obvious thing about all of that: it is four process changes and it is entirely
manual. It depends on Meghana having time on a Friday and on a desk rule being followed. That is
what I can do by myself in a fortnight. Whether the durable version of it is a system that assembles
that picture without waiting for a meeting is a question for you, and it is the real question in
this engagement.

---

## "What specifically is the Board pressing on — the raw cancellation numbers, the cost of the fix, recurrence risk in the next city launch, or something else — and what needs to be shown before Series B to close it?"

Let me separate what the Board has actually pressed on to date from what it is going to press on at
the Q3 meeting, because I am about to change the second one myself.

**What they have pressed on so far is cost, and they were right the first time.** Nandita Rao, our
nominee director from Kalpavriksha, looked at the recurring infrastructure schedule in February and
said the telematics and tracking line looked heavy against comparable subscription grocery
operations she had reviewed, and asked that it be examined specifically. That observation is what
produced Resolution 31/05 and the Rs 1.8 crore mandate. She was right that the line was worth
examining. Nobody, including me, asked what we would be giving up.

Sameer Bhattacharya asked in the same meeting that the savings case come back with a line-by-line
comparison **against the incumbent arrangements**. Five of the six lines were built that way. The
telematics line — Rs 68 lakh, the largest single contributor — was built against the incumbent's
quotation for an enlarged six-hub fleet that we never took up. Tarun Sethi asked at the Q2 review
whether a saving measured against a quotation nobody accepted is a saving. Farida said the
treatment was consistent and that Finance was comfortable. I said the Board had asked for a number
and this was the number, and I moved the item on. So there is a director's instruction from
February that the largest line does not satisfy, and it was going to the Q3 meeting as a closed
item with a recommendation that the team be recognised for it.

**The cancellation numbers have not been the pressure and that is about to change.** Q2 went to
the Board for information, with quality's position recorded as understood and the fix in flight —
memo 17, film reversion, re-baseline 31 August. That framing bought Q3 as a watch item rather than
a crisis. It will not survive the 31st. Nashik 19.0 per cent of gross adds and Indore 19.1 against
6.4 and 6.5 in the mature cities, climbing month on month — 61, 198, 345 at Nashik and 34, 172, 355
at Indore — and I no longer believe a Rs 5.7 lakh packaging change reverses that.

**So here is what I think the Board will actually press on, and it is your third option, sharpened.**
Not "what did this cost" and not "how many left." It is: *the saving that funded the expansion may
have bought the failure that is killing the expansion, and nobody costed the trade, and the same
procurement pattern is queued up to do it again.* The six-hub quotation that our Rs 68 lakh was
measured against tells you there is a sixth hub contemplated. If we open it on the Nirvath
arrangement — which is a 36-month term from March, terminable for convenience only after month 18
on ninety days' notice with unamortised hardware payable — we take the detection gap into the next
city on day one, with the same SOP over the top and the same nobody checking the second against the
first.

That is the recurrence question and it is not really about telematics. It is that this company can
buy an instrument, write a rule, and never check that the instrument satisfies the rule, and that
the failure produces clean logs at every step. Cold room in band. Trip sheet signed. Wastage
register empty. Vendor reports no fault found.

**What has to be shown before the data room opens, and I would rather show it than be asked for it.**

The gap quantified, not asserted — the count of trips at NSK-1 and IND-1 that ran out of band with
no alert raised, and the count of Category A units that reached doorsteps out of band. I have asked
for that number knowing it is the number that says how many customers we knowingly served warm
dairy to and that it goes into a data room. I want it anyway. An issue we found and are fixing is a
paragraph; the same issue found by a diligence team in our own incident records is a discount.

The Rs 68 lakh restated. What Annexure D of that SOW charges to shorten the polling interval across
42 vehicles — Vinay brings me that rate card tomorrow morning and I have not seen the page. If it
is, say, Rs 15 lakh, then the honest saving was Rs 53 lakh, the programme was Rs 1.67 crore against
a Rs 1.8 crore mandate, and I go back to the Board to tell them we missed. I would rather report a
miss I understand than a beat I cannot defend. Vinay already holds authority to Rs 75 lakh a year
per contract under Resolution 31/06, so if the answer is a contract variation I do not need the
Board to do it — I only need them to know the number was worth less than I said.

A named owner on every open item, with dates. Detection to Vinay, the number to Meghana, cross-signal
review to Meghana, verbatims to Aparna, conditioned seal testing into inbound acceptance to Priyanka.

And a control that stops it recurring: no city hub opens, and no instrumentation contract is
executed, without a written conformance check of the equipment against SOP-CC-004 clauses 3.2 and
6.3, signed by the SOP owner and not by the person negotiating the contract. One page. It would have
cost nothing in March.

Then a number that has moved, in the direction it should move, with the mechanism named. Not a
roadmap. I said this morning that a chatbot in the data room gets a no, and that now extends to a
strategy slide. What helps me in September is being able to say: we found a detection failure on
this date, here is what it cost, here is what we changed, here is the number since. That paragraph
is worth more than anything you could put on a slide, and it is the only thing on this list that I
cannot write by myself.

The wastage line will go up when detection starts working. I will defend that to the Board myself.
A destroyed pouch of curd is tens of rupees. A cancelled subscription is a monthly bill I never see
again, and at one society in Indore we lost 34 of them in a single committee meeting.

---

*Rohit Vaidyanathan*
*Managing Director, 20 August 2024*
*Signed on paper. Vinay and Meghana to see this before it goes anywhere near the data room.*
