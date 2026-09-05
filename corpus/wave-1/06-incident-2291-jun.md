# INCIDENT RECORD INC-2291

**Raised under:** SOP-QA-002 (single-trip Category A disposal exceeding 50 units)
**Date of incident:** 9 June 2024
**Hub:** IND-1 (Indore)
**Trip:** TR-IND-0609-02
**Vehicle:** MP09 ZT 2214, 3-wheeler chilled
**Rider:** Kailash Verma
**Raised by:** Harish Mane, Route Supervisor, IND-1
**Date raised:** 9 June 2024, 11:20
**Severity:** 2 (product loss, no customer harm)
**Status:** Closed with observation

---

## 1. What happened

The chilled compartment on MP09 ZT 2214 lost temperature control during the early Sunday route. Product zone temperature rose out of band and remained out of band for the balance of the run. The dashboard raised an excursion state at 04:48. The control desk acknowledged at 04:56 and instructed the rider to abandon the remaining Category A drops and return to hub.

62 units of Category A (curd 400g, buttermilk 1L, paneer 200g) were returned and disposed under SOP-CC-004 clause 7.1. Eleven subscribers on the route received no Category A that morning and were credited.

## 2. Timeline

| Time | Event | Source |
|---|---|---|
| 03:58 | Compartment pre-cooled to 4.1 C, loading complete, trip sheet signed | Trip sheet TS-IND-0609-02 |
| 04:12 | Vehicle departed IND-1 | Gate register |
| 04:15 | Product zone 8.6 C | Dashboard log |
| 04:30 | Product zone 10.9 C | Dashboard log |
| 04:45 | Product zone 12.3 C | Dashboard log |
| 04:48 | Excursion state raised against vehicle | Dashboard log |
| 04:56 | Control desk acknowledged | Dashboard log |
| 05:02 | Rider contacted, instructed to return | Call log |
| 05:34 | Vehicle back at IND-1 | Gate register |
| 06:10 | 62 units recorded in wastage register | Wastage register |

## 3. Cause of the temperature loss

The chiller unit on MP09 ZT 2214 was taken to the workshop on 10 June. The unit's own fault memory records a **low-voltage compressor trip at 04:07** on 9 June. The compressor did not restart. The auxiliary battery was found at 10.9 V against a 12.4 V minimum and has been replaced. The battery was last changed in August 2022 and was outside its service life.

Workshop job card WS-IND-1188. Vehicle returned to service 11 June.

## 4. Observation on detection

Onset was 04:07 per the chiller fault memory. The dashboard raised the excursion state at 04:48. That is a gap of **41 minutes** between onset and detection.

That is longer than I expected it to be. On the Bengaluru routes I worked before this posting, a compartment going warm showed up on the screen while you were still looking at it.

I raised it with the telematics vendor. NTPL ticket **NT-88214**, raised 9 June 16:05. Their response on 11 June:

> "Device MP09ZT2214 / IMEI 8654xxxxx1129 is operating within specification for this account. No transmission gaps or device faults recorded in the period 03:00 to 06:00 IST on 09/06/2024. No fault found. Ticket closed."

So I have no explanation for the 41 minutes. The device was working, the dashboard was up, the thresholds were set correctly (8.0 C, verified on the vehicle configuration screen on 10 June), and the vendor says nothing is wrong.

Flagging it here so it is on the record. I do not know who owns this question or which document it belongs against.

## 5. Actions

| # | Action | Owner | Due | Status |
|---|---|---|---|---|
| 1 | Replace auxiliary battery, MP09 ZT 2214 | Workshop, IND-1 | 10 Jun | Done |
| 2 | Audit auxiliary battery age across IND-1 fleet, replace any beyond 24 months | Workshop, IND-1 | 20 Jun | Done, 6 replaced |
| 3 | Same audit at NSK-1 | Workshop, NSK-1 | 20 Jun | Done, 4 replaced |
| 4 | Detection gap at section 4: obtain explanation | Unassigned | Open | **Open** |

Action 4 has no owner. It was left open at the IND-1 weekly review on 14 June and again on 21 June. Recorded here rather than dropped.

---

**Closed with observation:** 24 June 2024
**Closed by:** Harish Mane
**Countersigned:** Sunil Bagade (acting for IND-1 in Mr Deshpande's absence)
