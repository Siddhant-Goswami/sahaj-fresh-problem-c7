# Sahaj Fresh — the client's response to three pitches

**Speaking:** Rohit Vaidyanathan, Managing Director
**Date:** 20 August 2024, evening
**Context:** Four proposals heard back to back. My position on the packaging changed earlier today
and has not changed back — see the third round of the answers document. I am no longer defending
memo 17 as a complete explanation, so none of you has to spend your two minutes convincing me that
Pune is a problem. I know it is.

What I am now doing is deciding what happens on Monday, with whose time, and against what number.
Verdicts at the end of each.

---

## Before I take them one at a time

All three of you refused to build anything first. TJ asked for an afternoon, Mayur asked for one
analyst for one day, Deepak asked to put a person on a van before spending a rupee on software. I
have had vendors in this building who could not manage that in a six-week engagement, so let me say
it once: that is the right instinct and it is why all three of you are still in the room.

Two of you have also done arithmetic I checked rather than took. Mayur, your one-in-five-hundred
against one-in-forty is right — Pune at 0.2 per cent is one crate in five hundred, Indore at 2.6 is
one in thirty-eight. I checked it before I answered you.

---

## TJ

> *"Let me spend one afternoon comparing Indore's return rate to Pune's for the first week after
> the fix ships. If they match, the film was the whole answer. If Indore's still high, something
> else is also going on — and I don't want to build a system on a half-right cause."*

### What is right about it

The last clause is the whole reason you are getting a yes. You are proposing to test whether the
cause is the cause before you build for it, and you have written the losing condition down in
advance. Nobody who has sold me anything in the last two years has done that.

### My objections

**One. The experiment you are proposing has already run.** The reverted film reached Tier 2 in the
week of 22 July. It is 20 August. "The first week after the fix ships" was four weeks ago and the
data is sitting in the despatch records. You are not asking me for an afternoon of the future, you
are asking for an afternoon of somebody's time to run a query on the past. That makes your pitch
cheaper than you pitched it, and it means I can have the answer on Monday rather than in September.

**Two. Your comparison is the wrong one and it will not carry the conclusion you have hung on it.**
"If they match, the film was the whole answer." No. Pune has been at 0.2 per cent all year. It was
at 0.2 before the reversion and it is at 0.2 after, because nothing about Pune changed. Indore
matching Pune would be consistent with the film being the whole answer, and also consistent with
several other things, because Pune and Indore differ in more than packaging: different telematics
vendor, different devices, different fleet age, hubs open four years against four months, denser
routes, longer subscriber tenure. Match or no match, you would not be able to tell me which of
those moved.

**Three. The comparison that does carry it is Indore against itself.** Same city, same routes, same
riders, same vans, same instrumentation, and exactly one thing changed in the week of 22 July.
Indore ran 1.9, 2.4 and 2.6 per cent across May, June and July. If August is materially below that,
the film was doing real work. If August is still north of two, it was not.

Pune has a job in this and it is the job you gave it in your opening sentence: it is the control
that breaks the film-only hypothesis, because it is hot and on the same film and clean. Do not ask
it to also be the post-fix benchmark. You are using one control for two arguments and it can only
carry one.

**Four. Tell me what you are counting before you count it.** One week at Indore is roughly two
thousand drops. At 2.6 per cent that is about fifty Category A returns; at half a per cent it is
about ten. I can see a difference of that size. I cannot see it inside one route or inside three
days, and I want you to have said which you are using before you look, not after.

### Verdict: **Yes.**

Run it Monday. Indore against Indore, May through July against the four weeks since 22 July, whole
hub not one route, Category A returns per despatched unit. Bring me the same series for Nashik
because the reversion landed there too and it is a free second reading.

You do not need my sign-off for the afternoon. You have it anyway, in writing, because I want it on
the record that this was tested and not assumed.

---

## Mayur Agrawal

> *"The complaints are the receipt, not the problem… Give me one analyst for one day. If the new
> cities spot a warm van as fast as the old ones, I am wrong and you lost a day."*

### What is right about it

You have the best statement of the problem anybody has given me, including the ones written inside
this company. "The complaints are the receipt, not the problem" is the sentence I should have said
to my own Board in July and did not.

And you put the cost in the right place. I spent this morning thinking about wasted crates. You
moved it to the customer finding the warm curd before we do, and then you put a number on that
which I cannot argue with: four complaints at one building, all four refunded and closed, then
thirty-four cancellations in one committee meeting. That is what it costs, and it is not a wastage
line, it is a revenue line.

### My objections

**One. One sentence in your pitch is not evidence and you presented it as if it were.** "Indore,
cooler." You do not know that and neither do I. What I have is Pune at 40 degrees on two days in May
and 41 on a third. I have no Indore temperature series at all — QA's memo asserts that Nashik and
Indore both see sustained 40 degree ambient, which if anything cuts against you. Your argument does
not need that word. It is strong on film-plus-heat-versus-outcome without it, and weaker for
carrying an unsupported claim into a room where somebody checks. I checked.

**Two. Your test may not be constructible in a day, and I would rather you knew that now than at
five o'clock on Monday.** You want to compare how fast the new cities spot a warm van against the
old ones. To measure that you need onset and detection for both fleets. I have exactly one
onset-to-detection measurement in this entire company — the forty-one minutes — and it exists only
because a chiller's own fault memory recorded a compressor trip at 04:07 and somebody went and
looked. For Bengaluru and Pune I have no such pairing at all. Your Bengaluru supervisor's line about
warm compartments showing up while you were still looking at it is a recollection, not a log.

So you may spend the day discovering that the comparison cannot be built from what we keep, which
is a finding, but it is not the finding you promised me.

**Three. There is a version of your question that takes an hour, not a day, and I would start
there.** Do not begin by comparing measured detection. Begin by comparing configuration. Two
vendors, two contracts, two sets of device parameters. Both are documents and both are in this
building. If the two fleets are configured to the same polling interval then your hypothesis is
dead by lunchtime and I have lost an hour. If they are not, you have the answer without needing a
single log line, and you can spend the rest of the day on what it would take to measure actual
latency going forward.

**Four. A small one, but say it correctly to the Board.** "Your own rulebook says almost
immediate." It does not say almost immediate. It says an alert inside one polling cycle of a
twenty-minute breach being crossed. That is a tighter and more damaging statement than yours,
because it is specific enough to be tested against a contract. Use the real wording. It is worse
for us than your paraphrase.

### Verdict: **Yes.**

One analyst, one day, Monday. Configuration comparison first — Nirvath's parameters against
Sarathi's, both fleets, on paper. Then, only if there is a difference, tell me what it would take
to measure detection latency properly going forward and what it would cost to keep measuring it.

Vinay Kulkarni will give you both contracts and Meghana Iyer will give you the SOP. If either of
them is slow, my office.

---

## Deepak

> *"…reducing our sensor polling from 15 minutes down to 5 minutes will let us proactively destroy
> bad inventory and instantly stop the churn… next week, we put a supervisor on one Indore route to
> manually check the temperature every 5 minutes and dump bad crates on the spot. If customer
> complaints on that route flatline, we've validated the fix."*

### What is right about it

You went furthest into the mechanism and you are, I think, closest to correct about what is
actually wrong. And "before we spend a single rupee on AI" is the sentence I most wanted to hear
today.

### My objections, and there are more of them because you have proposed to spend more

**One. You have asserted the downgrade, not checked it.** "When we cut infrastructure costs, we
downgraded our temperature sensors." I have no document that says that. What I have is a contract
covering Nashik and Indore that specifies fifteen-minute polling, and a clause putting Bengaluru
and Pune expressly out of scope so they stayed with the incumbent. Nobody in this building has yet
put the two configurations side by side. It is probably a downgrade. It is not yet a fact, and you
have designed a week of work on top of it. Mayur is spending Monday establishing the thing your
pitch assumes. Wait for his answer — it costs you a day and it might save you a week.

**Two. Your pilot cannot produce the result you have claimed for it.** One route, one week,
measured in customer complaints. IND-A runs about seventy drops a day, so you are looking at five
hundred drops and single-digit complaints. The four complaints from Kesar Nandanvan that ended in
thirty-four cancellations were spread across ten days. At that volume you cannot distinguish a
flatline from a quiet week, and "complaints on that route flatlined" is exactly the sentence
somebody would repeat to a Board without the sample size attached to it. If you want a
week-long read, use Category A returns per despatched unit across the whole hub, not complaints on
one route.

**Three. You will be running inside a window that already has one change in it.** The reverted film
reached Tier 2 four weeks ago and the whole company is watching a re-baseline on 31 August. Put a
supervisor on a van next week and any movement you see has two candidate causes and no way to
separate them. I raised this against my own timetable earlier today and it applies to you with more
force, because you would be the one adding the second variable.

**Four. Your pilot does not test your hypothesis. It tests a different intervention.** Your
hypothesis is about polling frequency. Your pilot puts a human being on a van. A supervisor riding
along does not simply read a probe every five minutes — he sees a sweating seal, he talks to the
rider, he changes how the crates are handled at the third stop, and every driver on that route
knows he is there. If complaints fall you will not know whether five-minute data did it or the
presence of a supervisor did it, and the thing you would then want to buy is the data, not the
supervisor.

**Five. "Dump bad crates on the spot" is the intervention and also the cost, and you have counted
it only once.** That is clause 7.1 and it is the correct action. But complaints falling partly
because product was destroyed before it reached the door is not the same as product arriving in
good condition. Count the crates you dump. I said this morning that I expect the wastage line to
rise and that I would defend it to the Board — I meant it, and I cannot defend a number nobody
wrote down.

**Six. "Instantly stop the churn" is not true and you should not say it to my Board.** Detection
stops the next customer being disappointed. It does not bring back thirty-four flats at Kesar
Nandanvan, and a subscriber who has had sour curd twice does not return because a crate they never
saw got destroyed. Churn will lag your fix by at least a subscription cycle. Overstate that and the
first person who notices will discount everything else you said, including the parts that are
right.

**Seven. You have my baseline wrong.** "Back to the 0.5 per cent baseline." The baseline is 0.3 per
cent. Half a per cent is the threshold Meghana committed to at the 31 August re-baseline, which is a
pass mark, not a normal state. It is a small thing. It is also my number and I noticed.

**Eight, and this is the one that decides it.** If your hypothesis is that fifteen-minute polling is
the defect, the first question is not what a pilot costs. It is what the contract charges to change
it. There is a rate card in that statement of work for exactly this, and Vinay is bringing it to me
tomorrow morning. If shortening the interval across forty-two vehicles is cheap against the sixty-
eight lakh we booked as a saving on that contract, then the correct next step is a contract
variation and a measurement, not a week of a supervisor's time to establish something I could buy
on Tuesday. You have proposed to pilot a hypothesis that may be cheaper to simply test in
production.

### Verdict: **Change it.**

Not a no. The instinct is right and I want the manual test in principle — if a person cannot do
this once by hand, I am not buying software that claims to do it a thousand times.

What I want changed: wait for Mayur's configuration answer and for the Annexure D price before you
commit anybody's week. Measure Category A returns per despatched unit across the hub, not
complaints on one route. Count and report every crate destroyed. Drop "instantly stop the churn."
And come back to me with what it costs per month to run whatever you are proposing at our volume —
not the pilot, the thing after the pilot.

Bring me that and I will fund the week.

---

## The pushback that applies to all three of you

You have all found the same thing and you are all right about it, so let me tell you what none of
you has addressed.

Every one of these proposals stops a van that has gone into a defined excursion. Above eight
degrees, sustained past twenty minutes, alert, pull the crates, clause 7.1. Good. That is a real
failure and it is happening.

Now take the case I actually have the most evidence for. Harish Mane went to Kesar Nandanvan on 16
July with a probe and read the product at 9.4 degrees at the society gate at 06:20, on a route where
delivery starts at 04:35. That product is out of band. I do not know that it was ever out of band
for twenty continuous minutes, and if it was not, then no alert was ever going to fire for that
society on any of the four occasions they complained, at any polling interval you care to buy. The
customers were still getting bad curd. They still cancelled thirty-four subscriptions.

So detection catches the van that fails badly. It does not obviously catch the van that arrives
merely warm, and four complaints from one building over ten days, each refunded and closed at a
desk, never assembled into one fact that reached the hub manager who could have gone and looked —
that is a second failure sitting next to the first, and it is the one that actually produced the
cancellations I can count.

Whoever comes back to me with both halves gets the work.

---

## Dev Sharma

*Pitched after the other three, and after I had said the paragraph above out loud.*

> *"Bengaluru at 6.4, Pune at 6.5, same film, hotter city. That's five years of getting the cold
> chain right… So Sahaj can run Tier 2. Pune proves it. The only question is what Pune has that
> Nashik and Indore don't… When a customer in Indore complains, it's refunded and closed. One at a
> time, by one agent, in one ticket… between a single complaint and a monthly report there is
> nothing."*

### What is right about it

**You took the half I had just finished saying nobody had touched.** Three people spent tonight
telling me my vans are blind. You are the first to say that even a van that never trips an alert
produces four complaints from one building over ten days, refunded and closed one at a time, and
that the company only learns about it as thirty-four cancellations. That is the failure I have
evidence for and can count. It is also the cheaper of the two to fix, and nobody had proposed to
fix it.

**And you reframed the whole thing, which I want to be explicit about because it is the most
commercially useful thing anyone has done today.** Every other version of this conversation says
Sahaj Fresh cannot run a cold chain in Tier 2. Yours says Sahaj Fresh demonstrably can, 150
kilometres away, in a hotter city, on the same film — and that the question is what Pune has that
Indore does not. That is a different sentence in front of a Board, and it is a different sentence
in a data room. It converts an indictment into a gap analysis against our own working reference. If
I am going to reopen a closed cost programme in front of the people who congratulated me for it, I
would rather do it holding your framing than anybody else's.

I also noticed that you opened by telling me my team is good. It worked. It worked partly because
it is true and I can check every clause of it — Meghana's SOP did anticipate the expansion before
the hubs existed, and Priyanka did put her name on a hole in her own protocol. Do not mistake me
noticing for me discounting it.

### My objections

**One, and it is the one that decides the verdict. You did not ask me for anything.**

Two minutes is meant to be problem, evidence, what you propose to test, and what it costs me to
find out. You gave me the first two, and they are the best two I have heard. Then you stopped.
There is no test in your pitch, no number that would prove you wrong, and no price.

TJ asked for an afternoon and told me what result would kill his own hypothesis. Mayur asked for
one analyst and one day and said "if I am wrong you lost a day." Deepak asked for a supervisor and
a week and got a lot of it wrong, but he asked. I cannot sign off on a diagnosis, however good, and
I have spent today learning what it costs to accept a correct-sounding explanation without a test
attached — that is exactly what I did with memo 17 in July, and it cost me a quarter.

**Two. You have attributed the wrong city, and I only know that because I read the section
yesterday.** "Pune sees a warm compartment while a supervisor is still looking at the screen." That
line is Harish Mane's, in section 4 of INC-2291, and he is talking about **Bengaluru** — the routes
he worked before his posting to Indore. Not Pune. And it is a recollection of what screens used to
feel like, not a logged measurement. It is probably true and it is not evidence, and if you put it
in front of my Board as Pune, the first person to open the incident record will find it and stop
believing the rest of your paragraph. The rest of your paragraph deserves better.

**Three. "Only one of them was ever checked against it" is generous to us, and the truth is
worse.** Clause 6.3, the detection obligation, was introduced in version 4.0 of the SOP, effective 8
January 2024. The Nirvath statement of work was executed on 3 March 2024 — two months later, by the
same company, under a Board resolution passed in February. So the detection clause existed, in our
own controlled document, before we signed a contract that cannot satisfy it, and nobody put the two
pieces of paper on the same desk.

And Bengaluru is not compliant because somebody checked it. The Sarathi arrangement predates clause
6.3 entirely. Bengaluru is compliant by accident — it happens to poll fast enough for a rule that
did not exist when it was bought. We did not check one and skip the other. We checked neither. One
of them got lucky.

Use that. It is more damning and it is verifiable from two document dates.

**Four. Be careful what you claim escalation would have bought.** Your Kesar Nandanvan example is
the strongest thing in your pitch and I want to make sure it holds up when somebody pushes on it.
Harish did act, decisively, the moment he found out — he went to the society himself the next
morning with two crates and a probe, and offered a retention deal. He got thirty-four cancellations
anyway, because he found out on 15 July from the secretary rather than on 2 July from the first
ticket. So the claim is not "escalation would have saved them." The claim is "escalation on 2 July
would have given Harish thirteen days he did not get." That is a narrower claim and I can defend it.
The broad one, somebody will take apart.

### Verdict: **Yes — conditional, and the condition is one paragraph.**

Yours is the diagnosis I want to build on, and it is the only one of the four that has both halves
of the problem in it. If you bring me the missing half of your own pitch you are ahead of the other
three and I will say so to them.

What I need from you, and it is small:

- **What you would test, and what result would tell you that you are wrong.** Not "does detection
  matter" — something I can put a date and a number against.
- **The two numbers you would move.** I would suggest onset-to-detection minutes for the first half,
  and share of condition complaints reaching a hub manager within twenty-four hours for the second.
  If you have better ones, argue for them.
- **What it costs me to find out**, and separately, what the thing costs to run per month once it
  exists, at our volume, if Tier 2 doubles.

Bring me that on Monday alongside TJ's and Mayur's numbers and I will fund it in the same meeting.

One more thing, and take it as a compliment rather than a warning. You are the only person tonight
who has argued for the aggregation half. That is also the half I could probably fix with a person
and a spreadsheet before you write any software, and if your Monday paragraph does not acknowledge
that, somebody in that room will.

---

## What happens Monday

| # | Who | What | By |
|---|---|---|---|
| 1 | TJ | Indore against Indore, May–July versus the four weeks since 22 July. Nashik the same. Category A returns per despatched unit. | Mon evening |
| 2 | Mayur | Nirvath and Sarathi device configurations side by side, both fleets, on paper. Then what it would take to measure detection latency going forward. | Mon evening |
| 3 | Vinay Kulkarni | Annexure D price to shorten the sensor polling interval across the 42 vehicles in scope. | Tue morning |
| 4 | Dev Sharma | The missing half of his own pitch: what he would test, the two numbers, what it costs to find out and what it costs to run. | Mon, with 1 and 2 |
| 5 | Deepak | Revised pilot per the above, gated on 1, 2 and 3. | Wed |
| 6 | Meghana Iyer | Whether the 31 August re-baseline can still separate the film reversion from anything else we change this month. If it cannot, tell me now. | Fri |
| 7 | Joseph Mathai | How many DISP-07 Category A tickets were closed at the desk without reaching a hub manager, Tier 2, since 8 April. Count only. | Wed |

Nothing gets built this week. Nobody writes any software until items 1 to 3 are on my desk, and if
item 3 comes back small then item 5 may not be a pilot at all, it may be a purchase order and a
measurement.

Item 7 is the one I have added on my own account, after Dev's pitch. If the answer is what I now
expect it to be, then the second failure is larger than the first and it is the one I can fix
without buying anything from anybody.

Costs: items 1, 2 and 4 are three person-days. Item 3 is a phone call. Item 7 is a query somebody
should have run in May. I am approving all of them now.

---

*Rohit Vaidyanathan*
*Managing Director, 20 August 2024*
*Signed on paper. Copies to V. Kulkarni and M. Iyer.*
