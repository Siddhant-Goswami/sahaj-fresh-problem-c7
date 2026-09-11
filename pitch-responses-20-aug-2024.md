# Sahaj Fresh — the client's response to seven pitches

**Speaking:** Rohit Vaidyanathan, Managing Director
**Date:** 20 August 2024, evening
**Context:** Seven proposals heard back to back. My position on the packaging changed earlier today
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

## Saksham

> *"We invoke Annexure D of your existing Nirvath contract. For just Rs 310 per vehicle per month,
> we shorten the polling interval to 5 minutes… Second, the churn interceptor… our system acts like
> your Indore supervisor — it instantly drafts a highly personalized 'two-weeks-free' save-offer,
> acknowledging the cooling issue is fixed, and routes it to the local Hub Manager's Slack for a
> one-click approval."*

### What is right about it

**You are the only person tonight who brought me a price.** Four people diagnosed the detection
failure and every one of them asked me for time to investigate it further. You went and found
Annexure D, which is the out-of-scope rate card at the back of a statement of work that I signed
and had never read to the end, and you came back with a number. Vinay is bringing me that same page
tomorrow morning. You beat my VP of Operations to it by about fourteen hours.

Let me finish the arithmetic you started, because you quoted me a unit rate and the total is the
part that matters. Forty-two vehicles in scope — twenty at Nashik, twenty-two at Indore. At Rs 310
per vehicle per month that is **Rs 1,56,240 a year**. The telematics changeover was booked into the
cost programme at a saving of Rs 68 lakh. So closing the gap costs **about two and a third per cent
of the saving that created it.**

That number ends the argument, and it is going in front of the Board in that form.

You also refused the pitch-deck roadmap and said so out loud. Noted, and it is the second time
today somebody has told me what they were *not* going to sell me. I have started to find it
persuasive.

### My objections to part one — the polling change

**One. "Instantly closes the detection gap and stops warm milk from reaching the door" is not true,
and I can now show you why with your own arithmetic.**

The rule is not just the polling interval. Clause 3.2 defines an excursion as product above eight
degrees **sustained beyond twenty continuous minutes**. That twenty minutes is in our own document
and no contract variation shortens it. So the floor on detection is twenty minutes plus whatever it
takes to confirm it plus one polling cycle to raise it.

Take the 9 June trip. Compressor tripped at 04:07. First recorded reading above band 04:15. Alert
04:48 — forty-one minutes. Now run it at five-minute polling: you would catch the crossing around
04:10 to 04:12, you could confirm twenty continuous minutes at about 04:35, and you would alert
inside one cycle, so about 04:40. That is thirty-three minutes instead of forty-one. Real, worth
having, and **not instant**. Sixty-second polling, at Rs 940 per vehicle per month, gets you to
roughly twenty-eight minutes for Rs 4.74 lakh a year.

Now put that against the operation. That van left the hub at 04:12 and delivery on that route
starts at 04:35. A perfect alert at 04:33 reaches a rider who is about to make his first drop; an
alert at 04:40 reaches one who has already made two or three. Clause 7.1 protects the crates still
on the van. It does nothing for the ones already at doorsteps.

So buy the variation — I am buying it — but do not sell it to me as stopping warm curd at the door.
It buys eight to ten minutes and it brings us into compliance with a clause we have been in breach
of since March. Those are both good reasons. The one you gave me is not accurate, and it is the
kind of inaccuracy that gets found.

**Two. You picked five minutes and did not show me why.** Both options are on that rate card. Five
minutes satisfies clause 6.3 on my arithmetic; sixty seconds satisfies it with room to spare and
costs Rs 3.2 lakh a year more. That is a real trade and it is mine to make, not yours to make
silently. Come back with both, with the detection number each one produces, and let me choose.

**Three. "Without a new Board budget" is true and it is not the whole truth.** Correct: Vinay holds
authority under Resolution 31/06 to vary contracts up to Rs 75 lakh a year, so nobody needs Board
approval to execute this. But the Rs 1.82 crore has already been reported to the Board as delivered
and is going to the Q3 meeting as a closed item with a recommendation that the team be recognised.
This variation does not need new money. It needs me to stand up and say the number I gave them was
worth less than I said.

I have already decided to do that. But you framed as costless a thing whose actual cost is the one
that hurts, and I would rather hear that named by the person pitching it than have Nandita Rao find
it in the data room.

**Four. Your manual test cannot work as designed.** "Upgrade one Indore van's telemetry for Rs 310
to prove the detection works." One van, one week. In four months across forty-two vehicles I have
exactly one recorded excursion. The overwhelmingly likely result of your test is that nothing
happens on that van all week and you learn nothing at all.

Do not wait for a real excursion. Induce one. Park a van, let the compartment come up out of band,
and time the dashboard from first breach to alert on the current configuration and then on the
five-minute one. That is an afternoon, it costs nothing but a technician, it produces the actual
number, and it does not depend on a chiller happening to fail while you are watching.

### My objections to part two — the churn interceptor

Here I get off, and I want to be precise about where, because the underlying observation is
correct and it is only the product that I am refusing.

**One. It would tell customers something I do not believe.** The draft "acknowledges the cooling
issue is fixed." I said this afternoon that I expect the 31 August re-baseline to miss. So you are
proposing an automated system that writes to Tier 2 subscribers, in my company's name, asserting a
fix that the Managing Director does not think has worked. Multiply that by the volume you are
targeting and I am putting a claim I cannot stand behind in front of several thousand people, in
writing, four weeks before a data room opens.

Nothing this system builds goes to a customer stating a cause. That is not a preference. That is a
line.

**Two. It offers money, automatically, and nobody has costed it.** Two weeks free is a revenue
decision. Harish's version was one supervisor's judgement at one society on one morning, and he
took it to the committee himself. Yours fires on every Tier 2 cancellation. We had one thousand one
hundred and sixty-five of those in a quarter. Tell me what two weeks free costs at that volume
before you tell me it has one-click approval.

**Three, and this is the one that decides it. You are intercepting at the wrong moment.** Your
system fires when a customer complains or hits cancel. By cancel it is over — I said this morning
that a subscriber who has had sour curd twice does not come back because of a discount, and I
meant it.

At Kesar Nandanvan they complained on 2 July, 5 July, 9 July and 12 July, and cancelled on 15 July.
Your interceptor would have sent four save-offers to four flats and then thirty-four cancellations
would have happened anyway, because the society committee was not deciding about four refunds. It
was deciding about curd.

The moment worth intercepting is the **second complaint on the same route on the same day**, and the
person to intercept it is Harish, not the customer. Give him 2 July and he has thirteen days to go
and stand at that gate with a probe. He did exactly that when he finally found out on the 15th. He
was thirteen days late and he got there through a society secretary rather than through anything we
built.

**Four. We do not run Slack in hub operations.** Our hub managers work off phones and printed
manifests — during the August outage, the entire company fell back to paper and the incident was
detected by a rider messaging a supervisor from his personal handset. Routing to a Slack channel is
an assumption about our stack that nobody checked. Ask before you design the last mile of a
workflow.

**Five, and this is to your credit.** "The cancellation verbatims that your team is currently
ignoring" is fair and it stung, and it is exactly right — they have been unread since April and the
action to read them was due on the fifteenth. But notice that the fix for nobody reading them might
be one person reading them, which is Aparna's overdue action and costs nothing. Do not sell me
software for a job whose first version is a person and a spreadsheet. If you propose the software
version, show me why the person version is not enough.

### Verdict: **Part one, yes. Part two, no as designed.**

**Part one — approved.** Vinay executes the Annexure D variation. Bring me both options priced, five
minutes and sixty seconds, with the detection number each produces, and I will pick on Tuesday. Run
your induced-breach test first so we have a before number to compare against; there is no point
buying it and then having nothing to prove it worked. And it goes in as a measured change, not as a
declaration of victory.

**Part two — no.** Not "come back with a smaller version" — no to the thing you described. No
automated message to a customer, no automated offer of money, no system stating a cause on our
behalf.

Here is what I would say yes to, and it is most of your machinery pointed at a different target.
Read the same tickets. Classify what the customer actually said — warm, sour, watery, or something
else entirely — and pull out the route. Cluster by route and day. When a route shows two or more in
a morning, put that in front of the hub manager for that hub, with the ticket numbers, before nine
o'clock. He decides what happens next, including whether anybody is offered anything, and every
rupee and every customer conversation stays with a human being exactly where it is today.

That is Dev's second half, it is the failure I have the most evidence for, and you have already
built most of what it needs. Point it at Harish instead of at the customer and bring it back to me
with a cost per month at thirty tickets a day, and what that cost does if Tier 2 doubles.

**One more thing, about your data room paragraph.** "An automated retention tripwire that is
actively recovering our Tier 2 subscribers." In September, three weeks in, with a subscription cycle
of lag, that sentence will not be true and it is precisely the sentence a diligence team tests. Say
the true one instead: we found a detection failure in our own contract, here is the date, here is
what it cost to close, here is the detection number before and after, and here is what we changed
about how complaints reach a hub. That paragraph is stronger because every clause of it can be
checked, and I will not have to defend a word of it.

## Munish

> *"Pune runs the same film and hits 40 degrees in May. Its returns are a fraction of Indore's. If
> film were the cause, Pune would bleed too. What's different: Pune stayed on the old tracking
> vendor. In June an Indore van's chiller knew it had failed forty minutes before the dashboard.
> Nothing was broken — the polling interval you bought and the twenty-minute rule you wrote can't
> both be met. Catch a warm van, crates come back and get written off. Miss it, the failure lands at
> two hundred doors. Two ledgers, and you've read Indore's. Test: IND-A, ten mornings, one person, a
> probe and a sheet. A reading every five minutes, and what the customer did at each door. If vans
> are in band and people still refuse, I'm wrong — back to packaging. Cost: one person, ten
> mornings, nothing touched. Against sixty-eight lakh on that contract and over a crore that walked
> last quarter."*

### What is right about it

**The two ledgers.** I reached that this evening, answering somebody else's question, and it took me
four paragraphs and a table. You put it in six words. Catch it and it is wastage; miss it and it is
a doorstep. Pune and Indore may be suffering the same event at a similar rate and filing it in two
different books, and the book I read every month is the one that looks clean when nothing is
working. If you take nothing else out of tonight, that sentence is the one I am repeating to my
Board.

**You are the only person who has proposed to go and look.** Five people tonight proposed to query
something. Queries interrogate records we already keep, and the whole finding is that the records we
keep are silent exactly where the failure is. There is no field in any system we own that holds a
compartment temperature and what the customer at that door did about it, in the same row, at the
same minute. You cannot query your way to a row that does not exist. Somebody has to stand there
with a probe and write it down. That is why yours is the pitch I am most confident about and it is
the cheapest one I have heard.

**You picked the right route.** I doubt you knew how right. On 18 July, IND-A returned eight on
seventy-one drops — eleven per cent — while IND-B returned nothing on sixty-four, on the same
morning, out of the same cold room, on the same film. IND-A is Vijay Nagar. Kesar Nandanvan is on
IND-A. The hub number for that month was 2.6 per cent, so my monthly report was averaging a route
running at four times it against a route running at zero, and telling me a city had a mild problem.

**And you wrote your losing condition down before you started.** Third time tonight, and it is still
the thing that separates the people I will spend money with from the people I will not.

### My objections

**One. "The polling interval you bought and the twenty-minute rule you wrote can't both be met" is
not right, and the truth is worse than your version.** I have said something close to your sentence
twice today myself, so this correction is as much mine as yours.

They can both be met. Take the 9 June trip and measure it the way the documents measure it. First
recorded reading above band 04:15. Twenty continuous minutes of breach is therefore established at
04:35. Clause 6.3 allows one polling cycle from that point — fifteen minutes, so 04:50. The alert
came at 04:48. **That trip was compliant.** Two minutes inside the obligation, and forty-one minutes
of product warming, and a rider making drops through most of it.

So we are not in breach and I have been telling people all day that we are. What we have is a rule
that measures from the first reading rather than from the fault, on an instrument that only reads
every fifteen minutes, which means up to a quarter of an hour of warming happens before the clock
that governs us starts. Clause 8.2 says an incident shall be raised where detection exceeded the
6.3 obligation. It never exceeded it. That is why no incident has ever been raised on detection
grounds at either hub, and why action 4 sat unowned — the system was reporting itself compliant
throughout.

There is a second half to it that is yours to use. A genuine excursion of, say, twenty-two minutes
gives you two above-band readings and never a third. Two readings establish fifteen minutes. It
never reaches twenty, it is never an excursion, no alert fires, no crate is held, nothing is
recorded. Not a late alert. None. Every one of those mornings closes clean in every log we keep.

Say that version instead of yours. Yours can be argued with by a vendor. That one cannot.

**Two. Your falsifier does not send you where you think it does.** "If vans are in band and people
still refuse, I'm wrong — back to packaging." No. It sends you to a third possibility, and I have a
reading that already points at it. Harish went to Kesar Nandanvan on 16 July with a probe and read
**9.4 degrees at the gate at 06:20**, on a route that starts dropping at 04:35. That is not a
compartment reading. That is product that has been out of the compartment, in a crate, in a rider's
hands, up four floors and back down, for some part of two hours. A van can be in band all morning
and the pouch at the door can be out of band, and that is neither telematics nor film — it is the
last hundred metres, which nobody in this company measures at all.

So probe both. The compartment every five minutes as you proposed, and the actual pouch at the door
on a sample of drops — say every fifth one, and every drop where the customer refuses. Costs you
nothing, takes the observer thirty seconds, and it converts your ambiguous null into a real answer.
If the compartment is in band and the pouch at the door is at nine degrees, you have found the
third failure and it is cheaper to fix than either of the other two.

**Three. Ten mornings on one route can hand you a null that means nothing, and I want to know in
advance what we do with it.** The chiller failure that produced INC-2291 was a dead auxiliary
battery, and the June audit replaced six of those at Indore and four at Nashik. It is entirely
possible you stand on IND-A for ten mornings and never see a single excursion, and that would tell
us nothing except that ten is a small number.

Two things fix it. First, run a control: IND-B, same hub, same vans, same film, same riders' depot,
the route that returned zero on 18 July. Same sheet, same ten mornings. What I care about is not
IND-A's absolute number, it is the difference between two routes out of one cold room, and a
difference is the one thing a null cannot take away from you. I would rather pay for two people for
ten mornings than one person for twenty.

Second — and you should hear this from me rather than discover it on day four — putting an observer
with a clipboard on a route changes the route. The rider will pre-cool differently, close the door
faster, and stop leaving the crate in the sun at the gate. If refusals on IND-A fall to zero the
moment your person turns up, that is not a disproof of anything. It is a finding of a different
kind and it is worth having, but you must write down before Monday what each of the three possible
outcomes means, because after the fact everybody finds a story that suits them. I have watched this
company do exactly that with four support tickets and a memory of Pune.

**Four. "What the customer did at each door" is not enough, and the gap is the whole reason this
went unseen for four months.** Accepted and refused are not the two outcomes. There is a third —
accepted, said nothing, and cancelled a fortnight later. One Nashik subscriber told us it was the
second time that month and that she had not complained the first time. Another told us three houses
in his building had the same problem the previous day; one of the three was in our system. Refusal
at the door undercounts, and we do not know by how much.

So record the drop identifier at every door, and then join it forwards: any ticket raised against
that subscriber in the following twenty-four hours, and any cancellation in the following thirty
days. That join has never been made in this company. It costs a column on your sheet and a query
afterwards, and it is the closest thing to a direct measurement of what warm curd actually costs us
that anybody has proposed tonight.

**Five. Your cost framing is right and one of your numbers is not, and I am going to be pedantic
because this one is going in front of a Board.** "Over a crore that walked last quarter" is not a
statement I can defend. What walked last quarter is 1,165 subscribers across the two hubs. That is
of the order of **Rs 1.26 to 1.68 crore of annualised revenue run-rate**, on a blended revenue per
subscriber I derived myself an hour ago and which is weighted to the mature cities. The cash that
actually left the business inside the quarter is a good deal smaller than a crore, and I do not hold
a city-level contribution margin at all — Farida does, and I am not going to guess at it in this
room.

Say the defensible version: one thousand one hundred and sixty-five subscribers in ninety days,
still climbing month on month, against a fix that has already been priced at Rs 1.56 lakh a year.
Nobody can argue with that and it does not need the crore.

While I am on it — sixty-eight lakh is the right number to hold this against, but hold it correctly.
The saving is not the cost of the fix. Saksham found the rate card tonight: Annexure D closes the
polling gap for about Rs 1.56 lakh a year across all forty-two vehicles, which is two and a third
per cent of the saving that created it. Your test does not have to justify itself against Rs 68
lakh. It has to tell me whether that Rs 1.56 lakh is the right Rs 1.56 lakh, which is a far lower
bar and makes your pitch stronger, not weaker.

**Six. Not Harish, and not an ops probe.** The observer must not be the man who supervises that
route, offered that society a retention deal, and wrote the report that started this. That is no
reflection on him — he is the reason any of us know about Pune — but a number that goes into a data
room cannot be produced by the person whose route is being judged. Priyanka's team has calibrated
probes and the discipline to record a certificate number next to a reading, which under clause 4.3
of our own SOP is the difference between evidence and an anecdote. QA holds the probe. Ops holds
the van. Nobody holds both.

### Verdict: **Yes. Start Monday, and it is the item I would keep if I had to cut every other one.**

Two routes, ten mornings, QA probe, compartment every five minutes, pouch at the door on a sample
and on every refusal, drop identifiers recorded and joined forward to tickets and cancellations.
The three outcomes and what each one means, written down and given to me before the first morning.

One thing to be aware of on timing. Ten mornings from Monday 26 August finishes in the first week of
September, which is after the 31 August re-baseline and inside the window where the data room opens.
That is not a reason to rush it. It is a reason to tell Meghana now, because she is already trying
to work out whether the 31st can separate the film reversion from anything else we touch this
month, and your test is one more thing landing in her window.

And I want to be clear about the order of things, because your pitch and TJ's are not competitors.
His is retrospective and costs an afternoon and can be on my desk Monday evening. Yours is
prospective and takes ten mornings and produces the row that does not exist anywhere in our systems.
Run both. If TJ's query shows Indore's August materially below its May-to-July line, your test tells
me whether that was the film or something else that changed. If it does not, your test is the only
instrument I have got.

## Veerendar Jonnala

> *"In Q2, Tier 2 cancellation rates were around 19%, and 68% of those cancellations were related to
> quality. We also found that Category A returns increased from 0.3% to 2.1%. The QA investigation
> linked the curd pouch problem to the change from 65-micron to 55-micron film, especially under
> high temperatures. So before building anything, I want to test whether changing the film back to
> 65 microns actually brings the return rate below 0.5%. We can start with one hub and track
> dispatches and returns manually, so there is no software cost involved."*

### What is right about it

**Every number you quoted is correct and I did not have to check a single one twice.** Nashik 19.0
per cent of gross adds and Indore 19.1 against 6.4 and 6.5 in the mature cities. Sixty-eight per
cent of Tier 2 cancellations citing product condition against nineteen in Bengaluru. Category A
returns from a 0.3 per cent baseline to 2.1 over the six weeks to 17 May. I have corrected three
people's arithmetic tonight and none of it was yours.

**And you are the only person in four days who has proposed to test the explanation this company
actually holds, rather than the one the room arrived at this afternoon.** I want to be careful here,
because there is a failure mode in this building that you are the only guard against. I changed my
position on the packaging twelve hours ago. Six people have since pitched me on detection. A room
that turns over its cause in a day can turn it over again, and Priyanka's lab result is real —
conditioned four hours at 40 degrees, seal peel 14.2 newtons against a specification of 18, six
failures in twenty on the drop test against a limit of one. That did not stop being true this
afternoon because a supervisor rang Pune.

So I do not want the counterweight to leave the room. I want it to be a better counterweight, and
that is what the rest of this is.

### My objections

**One. The test you are proposing has already run, and you can have its answer tomorrow evening
without spending a rupee.**

The purchase order for 65 micron went in on 4 June. First Tier 2 despatch on reverted film was the
week of 22 July. It is 20 August. The experiment you want to start has been running for four weeks
and the despatch and return records are sitting in the system. You are asking me to begin,
prospectively, something that concluded while we were arranging this meeting.

TJ pitched the retrospective version of your test earlier tonight and has it on my desk Monday
evening. That is not a reason your instinct was wrong. It is a reason that the specific thing you
asked me for is already bought.

**Two. You did not mention Pune, and Pune is the reason this room is having a different
conversation.**

Pune is on the same national film contract, the same 55 micron. Pune touched 40 degrees on 22 and 23
May and 41 on 26 May. Pune returned 0.2 per cent in May, 0.3 in June, 0.2 in July, while Indore ran
1.9, 2.4 and 2.6. A city on the failing film, hotter than Indore, with a tenth of the returns.

Memo 17's mechanism is that the film holds at ambient and fails above 40 degrees. If that is the
cause of a 19 per cent cancellation rate, Pune should be bleeding and Pune is not. That single fact
is why I stopped defending memo 17 today, and every other pitch tonight opened with it. Yours does
not contain the word.

I am not scoring a point. I am telling you what it costs, because I did exactly what you are
proposing. On 11 July I took a lab result with a plausible mechanism, called it the cause, put a
Rs 5.7 lakh corrective action against it and set a re-baseline date six weeks out. That is your
pitch, almost word for word, and it cost me a quarter and thirty-four households in one society
while an unassigned action about a forty-one minute detection gap sat open on an incident record.
The lab was not wrong. It was incomplete, and the thing that would have told me so was a number
Harish already had on 18 July and could not get anybody to look at.

**Three. Your success criterion cannot tell you what moved the number, and the dangerous outcome is
the one where you pass.**

"Below 0.5 per cent" is Meghana's commitment and it is the right threshold. But three things land in
that measurement window: the film reversion in late July, the 60 per cent acquisition cut on
1 August, and now several tests I have approved tonight. If the rate comes in at 0.4, your design
cannot tell me which of them did it.

And think about what happens next if it does come in at 0.4. Memo 17 closes as vindicated. The
detection gap goes back to being an unowned line on a closed incident record. That is not a
hypothetical failure mode — it is a description of what happened in this company between 21 May and
this afternoon. A pass on your test is more dangerous to me than a fail, and any test where the
good outcome is the dangerous one needs a second instrument beside it.

**Four. "Start with one hub" is not available, and the level you have chosen hides the signal.**

There is no unexposed arm. The reverted film went to both Tier 2 hubs off one purchase order in the
same week, so there is no hub still on 55 micron to compare against. You cannot design a controlled
trial of a change that has already been made everywhere it was going to be made — the only control
that ever existed is Indore against its own May-to-July line, which is TJ's.

And a hub-level rate averages away the thing worth seeing. On 18 July at Indore, route IND-A
returned eight on seventy-one drops while IND-B returned nothing on sixty-four, same cold room, same
morning, same film. A hub number of 2.6 per cent is the average of a route at eleven per cent and a
route at zero. Whatever is happening is not happening to a hub.

### Verdict: **No as pitched. Yes to a reshaped version, and the reshaped version is more important than the one you brought.**

I am not funding a prospective trial of a change that has already shipped, measured at a level that
conceals the variance, against a criterion that three other things are moving.

Here is what I want from you instead, and I am giving it to you specifically because you are the
person in this room least likely to let the packaging question go, and both of these items are
jobs where that is the qualification.

**One — go and verify that Pune is actually on 55 micron.** Everything I have conceded today rests
on it, and what it rests on is a line in a procurement schedule. Nobody has read a lot code off a
pouch that was actually delivered in Pune. If it turns out that PNQ-1 has been drawing from retained
Sanchit stock, or that the national contract was applied late there, or that Pune's supply reverted
for some reason nobody recorded, then memo 17 is rehabilitated, six pitches tonight were built on a
false premise, and I have reopened a cost programme I did not need to reopen. That is the one check
still capable of overturning the position I took this afternoon, it costs a morning and a phone
call, and you are the right person to run it because you will actually want it to come back the
other way. Priyanka gives you the method and the lot code format.

**Two — establish the date the reverted film actually reached customers, per hub.** "Week of 22
July" is a despatch date from a supplier. What nobody has is the date the first 65-micron pouch was
handed to a subscriber at Nashik and at Indore, which is despatch plus transit plus goods inward
plus whatever 55-micron stock was sitting in each cold room and got used first. Those two hubs
almost certainly turned over on different days. Goods receipt notes at each hub and lot codes on the
pouches will give it to you.

Understand why that is the more important of the two. TJ's before-and-after split needs it and he
does not have it. Meghana's 31 August re-baseline needs it. Any field test that describes itself as
running "on the reverted film" needs somebody to have established that it is. Almost every piece of
analysis I have approved tonight has a before-and-after in it and not one of them currently knows
where the line goes. You would be supplying the missing axis for four other people's work, manually,
with no software, which is exactly the shape of engagement you pitched.

**And to be clear about what I am not doing: the film reversion stands.** I am not cancelling it and
nobody tonight has asked me to. Priyanka's results are real, 65 micron is the correct specification
for a city that runs at 40 degrees regardless of what else is true, and the conditioned seal test
she added to inbound acceptance is the one durable improvement to come out of this whole episode.
What I no longer believe is that Rs 5.7 lakh of film is going to fix a 19 per cent cancellation
rate. Both of those can be true, and holding both is the position you should be arguing from.

---

## What happens Monday

| # | Who | What | By |
|---|---|---|---|
| 1 | TJ | Indore against Indore, May–July versus the four weeks since 22 July. Nashik the same. Category A returns per despatched unit. | Mon evening |
| 2 | Mayur | Nirvath and Sarathi device configurations side by side, both fleets, on paper. Then what it would take to measure detection latency going forward. | Mon evening |
| 3 | Vinay Kulkarni | Annexure D variation, both options priced — 5 minute at Rs 1.56 lakh a year and 60 second at Rs 4.74 lakh — with the detection number each produces. I choose Tuesday. | Tue morning |
| 3a | Saksham | Induced-breach test on a stationary van: first breach to alert, current configuration. Gives us the before number. | Mon afternoon |
| 3b | Munish | Two routes, ten mornings, QA probe. IND-A and IND-B, compartment every five minutes, pouch at the door on a sample and on every refusal, drop IDs joined forward to tickets and cancellations. Three outcomes and what each means, in writing, before the first morning. | Starts Mon, reports 6 Sep |
| 4 | Dev Sharma | The missing half of his own pitch: what he would test, the two numbers, what it costs to find out and what it costs to run. | Mon, with 1 and 2 |
| 5 | Deepak | Revised pilot per the above, gated on 1, 2 and 3. | Wed |
| 6 | Meghana Iyer | Whether the 31 August re-baseline can still separate the film reversion from anything else we change this month. If it cannot, tell me now. | Fri |
| 7 | Joseph Mathai | How many DISP-07 Category A tickets were closed at the desk without reaching a hub manager, Tier 2, since 8 April. Count only. | Wed |
| 8 | Veerendar Jonnala | Lot codes read off pouches actually delivered at PNQ-1, against Priyanka's method. Then the date the reverted film first reached a customer at NSK-1 and at IND-1, from goods receipt notes and lot codes. | Wed |

Nothing gets built this week. Nobody writes any software until items 1 to 3 are on my desk, and if
item 3 comes back small then item 5 may not be a pilot at all, it may be a purchase order and a
measurement.

Item 7 is the one I have added on my own account, after Dev's pitch. If the answer is what I now
expect it to be, then the second failure is larger than the first and it is the one I can fix
without buying anything from anybody.

Costs: items 1, 2 and 4 are three person-days. Item 3 is a phone call. Item 3b is twenty QA
mornings and the loan of two calibrated probes, and it is the only line here that costs me a person
for more than a day — it is also the one I would keep if I had to cut everything else, because it
is the only item that produces a fact we do not already own. Item 7 is a query somebody should have
run in May. Item 8 is two mornings, a telephone call to a hub and a magnifying glass. I am approving
all of them now.

---

*Rohit Vaidyanathan*
*Managing Director, 20 August 2024*
*Signed on paper. Copies to V. Kulkarni and M. Iyer.*

---

# Addendum — Monday 26 August 2024

*Written the same evening the Monday items came back. It belongs with the Friday document rather
than in a new one, because it is the answer to a condition I set on Friday and it changes two of the
decisions above.*

---

## Dev Sharma — the missing half, delivered

> *"The thing to test is what nobody in this company has ever measured. Not the compartment. The
> crate, at the door, where the customer is standing… Fourteen mornings, both Tier 2 hubs, on the
> reverted film. Every rider takes three probe readings — third drop, middle drop, last drop — and
> writes them on the trip sheet he already carries and already signs… Doorstep readings inside band
> on the large majority of drops, and Category A returns still above two per cent. Then temperature
> at the door is not the mechanism, Priyanka's lab carries the whole thing, and everything I have
> argued since Friday is wrong… No software. No contract. Nothing touching the Rs 1.82 crore."*

### What is right about it

**You argued me out of a number I had suggested, and you were right.** I proposed onset-to-detection
on Friday. Your answer is that we hold exactly one such measurement in the entire company, that it
exists only because a chiller's fault memory happened to record a compressor trip, and that Mayur
and Vinay answer that half between them without needing you. That is correct, and it is the first
time this week somebody has declined a metric I offered them instead of taking it to be agreeable.
Onset-to-detection stays as Vinay's compliance number. It is not your test's number and it should
not have been.

**You have found the same thing Munish found, from the other end, and neither of you had heard the
other.** He came at it from Harish's probe reading at the gate. You came at it from the excursion
definition. You have both landed on the one measurement this business has never taken, and I now
have two independently-arrived-at designs for taking it. That is worth more to me than either
design on its own, and I will come to what I am doing with both of them.

**The sentence about what your own proposal will not do.** "This doesn't bring back Kesar Nandanvan.
Churn lags a subscription cycle whatever we do." Nobody sells like that, and I have had four days of
people telling me what their thing will fix. You are also right about what it does buy: two
independent readings where Meghana currently has one contested rate. I have been saying since Friday
that the 31st has stopped being able to answer anything. Your paragraph is the first proposal that
addresses that rather than adding to it.

**And you acknowledged the spreadsheet before I could.** I told you on Friday that somebody in the
room would say the aggregation half is a person and an hour a morning, and that if your Monday
paragraph did not say it first, it would be said to you. You said it first, and then offered to do
it by hand for a fortnight so I can see the output before I fund anything permanent. That is the
correct order and it is now approved.

### My objections

**One, and it is the important one. Your falsifier is contaminated and you do not need it.**

"Doorstep readings inside band on the large majority of drops, *and* Category A returns still above
two per cent." The second clause of that is a monthly rate, and the monthly rate has three things
moving in it — the film reversion in late July, the acquisition cut on 1 August, and now the tests
themselves. Meghana has been telling me for a week that she cannot separate two changes in that
window. You are proposing to hang your own disproof on the same number, and if it comes in at 1.8
per cent neither of us will know what that means.

You do not need it. Your design already contains a cleaner test than the one you wrote down, and I
do not think you noticed it. **Compare the refusal rate at doors that read out of band against the
refusal rate at doors that read in band, on the same route, on the same morning, off the same van.**
Same film, same riders, same cohort, same weather, same everything. Every confound I have been
worrying about since Friday cancels, because both groups share it. If out-of-band doors refuse at
several times the rate of in-band doors, temperature at the door is the mechanism and no monthly
rate is required to say so. If the two rates are the same, you are wrong, and you will know it
inside a fortnight rather than at a re-baseline.

That also means the three readings per route are not enough. Three readings give you a route
average; the test I have just described needs a reading joined to a *door*. Take the same three
drops, but record what happened at those three doors specifically — accepted, refused, or accepted
and a ticket raised within twenty-four hours. Forty-two readings a morning across both hubs, each
tied to an outcome, and over fourteen mornings that is a sample worth arguing about.

**Two. "No alert was going to fire at any polling interval Vinay can buy on Tuesday" is too strong,
and the correct version hands you something better.**

A twenty-two-minute excursion at fifteen-minute polling gives you two above-band readings, never a
third, never establishes twenty continuous minutes, and produces nothing — you are right about that
and it is the finding I reached at midnight on Friday from the contract end. But at five-minute
polling that same twenty-two minutes *is* caught. Vinay's variation does buy that case.

What it does not buy — and this is your actual point, so make it this way — is product that never
goes above eight degrees in the compartment at all, or goes above it for twelve minutes, and still
arrives at a fourth-floor door at 9.4 degrees an hour and a half later because it has been out of
the compartment in a crate in a stairwell. No polling interval in any rate card reaches that,
because the instrument is in the van and the failure is in the rider's hands.

And there is a consequence I want on the record. The binding constraint is not the polling interval
we bought from Nirvath. It is clause 3.2 — twenty continuous minutes above eight degrees — which is
in *our* document, written by us, and can be changed by Meghana on a Tuesday for nothing. That is
the cheapest lever on the table and nobody has mentioned it in four days. I am not pulling it yet,
because a shorter definition means more confirmed excursions, which means clause 7.1 fires more
often, which means the wastage line I already told Deepak to expect goes up further still. But it
belongs in the options and it costs nothing.

**Three. The trip sheet is the wrong home for the readings, and it expires.**

Clause 9.1 of our own SOP: trip sheets are retained for **ninety days**. Excursion logs are
thirty-six months. So the entire evidentiary base of your fortnight — the only doorstep measurements
this company will ever have taken — is on paper that we are entitled to destroy in late November,
which is after the data room opens and while somebody is still asking questions about it.

Use the trip sheet for capture, because you are right that the rider already carries it and already
signs it and that is why this costs thirty seconds. But the ten minutes of keying in has to land
somewhere with a retention period, against the trip ID, and the paper has to be kept for the
duration of this exercise regardless of what clause 9.1 permits. Meghana arranges that before the
first morning.

**Four. Nobody has said what is being probed, and without that the numbers will not be comparable.**

Harish's 9.4 was taken at a gate on 16 July. Was that the crate air, the outside of a pouch, or a
pouch centre? Those are three different numbers off the same crate, and fourteen riders across two
hubs will otherwise produce all three, mixed, in one column. Priyanka writes a one-page method —
what is probed, where, for how long, what is recorded — before Monday's first drop, and it is a
page, not a project.

The same goes for the instruments. You have asked, correctly, whether the clause 4.1 probes are on
the vans or in a drawer, and I do not know the answer; Meghana is checking and I am not going to
pretend to you that I know. But add clause 4.3 to your check: calibration at intervals not exceeding
six months, certificates retained twenty-four months. If somebody hands me a fortnight of readings
off uncalibrated handhelds, I have a fortnight of anecdotes, and Munish made the same point about
who holds the probe on Friday.

**Five. Your honesty check on the riders is right and one ride-along a week is not enough.**

You wrote it yourself — a rider who thinks I want a good number can write one. That is not cynicism,
it is what happens when the person being measured records the measurement. One ride-along a week
across two hubs and eight routes means a given rider is checked roughly once a month.

I am solving this a different way, and it is the reason both of your and Munish's designs are being
funded rather than one. Munish's QA observer is on IND-A and IND-B for ten of your fourteen
mornings, with a calibrated probe, taking readings independently. Those are two of your eight
routes. So for ten mornings I have two records of the same drops — one written by the rider, one
written by an observer who does not report to the hub. **The gap between those two columns is a
direct measurement of how honest the rider-written data is**, and it tells me whether the cheap
wide instrument can be trusted at the other six routes and at four more hubs after that. Neither of
you designed that. It falls out of running both, which is why I am running both.

**Six. On the recurring cost, the fortnight's real product is not the flags.**

Half a role at four hubs and one at eight is the right way to price it and I accept the framing —
you are also right that I will not sign an infrastructure line that quietly hands back what I cut.
But an hour a morning per hub reading twenty tickets by hand is a number that holds until Tier 2
doubles and then does not.

So while you are doing it by hand, write down every judgement you make: what made you flag a second
complaint from one building, what made you leave one alone, what you looked at that turned out not
to matter. That log is the specification for whatever eventually replaces the person, and it is the
only way to write that specification honestly. Do the fortnight as a manual process and treat the
notebook as the deliverable.

### Verdict: **Approved and funded, both halves, starting tomorrow morning.**

Fourteen mornings, both hubs, three drops a route, each reading joined to a door outcome and to any
ticket in the following twenty-four hours. Priyanka's method page and the calibration check before
the first drop. Meghana takes the readings off paper into something with a retention period. The
headline number is the refusal rate at out-of-band doors against in-band doors on the same morning —
not the monthly rate, which cannot answer anything before October.

Your two numbers stand as proposed: share of doorstep readings inside the two to eight band, and
share of out-of-band doorstep readings against which the dashboard raised nothing. On the second
one, note that Meghana is producing the same quantity from the opposite direction — trips carrying
three or more consecutive above-band readings with no alert raised. If your number and hers disagree
materially, that disagreement is itself worth a paragraph, because it means the dashboard and the
doorstep are seeing different mornings.

One practical thing that will otherwise sink the join: every probe reading needs the **time** and
the **trip ID** written next to it. Without those two, a doorstep reading cannot be set against a
dashboard record at all, and the second of your two numbers becomes uncomputable. It is the sort of
column that gets left off a paper form and discovered in week three.

Your two conditions are accepted as you set them. Wastage is counted from day one and reported
beside the churn number, not underneath it — I said that to Deepak on Friday and you were right to
hold me to it in writing. And the point about Kesar Nandanvan stands in the record: this does not
bring those thirty-four back, churn lags a cycle, and what we are buying is that Meghana's number on
the 31st stops being the only thing we have.

Joseph's count lands Wednesday. If it says what I now expect, your fortnight starts the day after
with the aggregation half already justified.

---

*Rohit Vaidyanathan*
*Managing Director, 26 August 2024*
*Copies to V. Kulkarni, M. Iyer, P. Deshmukh. Priyanka: the method page is the gating item.*
