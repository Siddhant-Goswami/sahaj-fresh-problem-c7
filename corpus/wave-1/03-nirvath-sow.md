# STATEMENT OF WORK

**SOW Reference:** SF/NTPL/SOW/2024/011
**Executed on:** 3 March 2024
**Master Services Agreement:** SF/NTPL/MSA/2024/003 dated 27 February 2024

**BETWEEN SAHAJ FRESH RETAIL PRIVATE LIMITED**, registered office 4th Floor, Sanchay Arcade, 12th Main, HSR Layout Sector 6, Bengaluru 560102 ("the Company")

**AND NIRVATH TELEMATICS PRIVATE LIMITED**, registered office Unit 3B, Meridian Techpark, Wagle Estate, Thane West 400604 ("the Service Provider")

---

## 1. Recitals

1.1 The Company operates chilled last-mile delivery fleets and requires vehicle tracking and temperature telemetry services for the fleets at Annexure A. The Company's authorised signatory executes this SOW pursuant to Resolution 31/06 of the Board of Directors dated 14 February 2024.

## 2. Scope of services

2.1 The Service Provider shall supply, install, commission and maintain telematics units on the vehicles at Annexure A and provide the associated dashboard and data services per Annexure B.

2.2 **Sites in scope:** Nashik hub (site code NSK-1) and Indore hub (site code IND-1), together with such additional Tier 2 hubs as the Parties may add by written variation.

2.3 **Sites expressly out of scope:** Bengaluru hub (BLR-1), Bengaluru hub (BLR-2) and Pune hub (PNQ-1). No obligation arises under this SOW in respect of vehicles operating from those sites, whether by way of supply, retrofit, migration or data services.

2.4 Installation complete not later than 15 April 2024.

2.5 Any service not expressly enumerated at Annexure B is out of scope and, if required, shall be procured by written variation priced under Annexure D.

## 3. Commercials

3.1 Total charge **Rs 42,00,000 (Rupees Forty Two Lakh only)** per annum, built up at Annexure C.

3.2 The Parties record that the Company's incumbent arrangement for equivalent services across its existing fleets is presently contracted at **Rs 1,10,00,000 (Rupees One Crore Ten Lakh only)** per annum with M/s Sarathi Fleet Systems Private Limited, under a separate agreement to which the Service Provider is not party. This recital is included at the Company's request for internal record and creates no obligation on either Party.

3.3 Invoicing quarterly in advance. Payment net 45 days from a valid tax invoice. Charges firm for twelve months, thereafter escalation not exceeding 6 per cent per annum on ninety days' notice.

3.4 **Goods and Services Tax.** All charges are exclusive of GST, charged at the rate applicable on the date of supply and borne by the Company. The Service Provider shall furnish invoices compliant with Section 31 of the Central Goods and Services Tax Act, 2017 bearing its GSTIN 27AAKCN4471R1ZQ, and shall file outward supply returns within the prescribed timelines so as not to prejudice the Company's input tax credit. Where input tax credit is denied by reason of the Service Provider's default, the amount is recoverable as a debt.

## 4. Service levels

4.1 Dashboard availability 99.0 per cent monthly, excluding maintenance notified 48 hours in advance.
4.2 Hardware fault replacement, 5 working days from ticket, at site. Support desk 09:00 to 21:00 IST, Monday to Saturday.
4.3 Service credits for breach of 4.1 capped at 5 per cent of the quarterly charge, and are the Company's sole financial remedy for such breach.

## 5. Term and termination

5.1 Thirty-six months from execution.
5.2 Either Party may terminate for material breach not remedied within thirty days of written notice.
5.3 The Company may terminate for convenience after month eighteen on ninety days' notice, subject to payment of the unamortised hardware balance per Annexure C paragraph 4.

## 6. General

6.1 Governing law, India. Courts at Bengaluru, exclusive jurisdiction. Telematics data is the property of the Company; the Service Provider retains a licence to process it solely to deliver the services. Aggregate liability capped at charges paid in the preceding twelve months, no indirect or consequential loss. This SOW, the MSA and Annexures A to D are the entire agreement.

---

# ANNEXURE A: Vehicles in scope

| Site | Vehicle class | Registration series | Count |
|---|---|---|---|
| NSK-1 | 3-wheeler chilled | MH15 EK 41xx | 14 |
| NSK-1 | LCV chilled 1.2T | MH15 EJ 87xx | 6 |
| IND-1 | 3-wheeler chilled | MP09 ZT 22xx | 17 |
| IND-1 | LCV chilled 1.2T | MP09 ZR 55xx | 5 |

Total 42 units.

---

# ANNEXURE B: Technical parameters and data services

| # | Parameter | Specification |
|---|---|---|
| B1 | Telematics unit model | TGX-220 (GSM/GPRS, 2G fallback) |
| B2 | Positional accuracy | 10 m CEP, open sky |
| B3 | Position reporting | 60 seconds while ignition on |
| B4 | Temperature probe | 1 x NTC, product zone, plus or minus 0.5 degrees C |
| B5 | Probe cable length | 4.5 m standard, 7 m on LCV |
| B6 | Sensor polling interval | 15 minutes |
| B7 | Data retention on device | 72 hours, first-in-first-out |
| B8 | Dashboard data retention | 13 months rolling |
| B9 | Alert transport | HTTPS webhook to Company endpoint, plus SMS |
| B10 | Webhook delivery | Best effort, retry at 5 and 20 minutes on non-2xx |
| B11 | Threshold configuration | Company-configurable per vehicle class |
| B12 | Time source | Network time, drift corrected on transmission |
| B13 | Report export | CSV on demand, up to 90 days per request |
| B14 | API access | Read-only REST, 1,000 calls per day, fair use |

Note: the parameters above are the standard commercial configuration under the pricing at Annexure C. Alternative configurations for any parameter are available under Annexure D and are chargeable.

---

# ANNEXURE C: Price build-up

| Component | Rs per annum |
|---|---|
| Hardware amortisation, 42 units, 36-month straight line | 11,76,000 |
| Connectivity, 42 SIMs | 6,04,800 |
| Platform and dashboard | 18,14,400 |
| Installation, amortised | 3,52,800 |
| Support and field maintenance | 2,52,000 |
| **Total** | **42,00,000** |

Paragraph 4: on termination under clause 5.3, the unamortised hardware balance is the residual of the 36-month schedule at row 1 to the effective date.

---

# ANNEXURE D: Rate card, out-of-scope services

| Service | Unit | Rate (Rs) |
|---|---|---|
| Additional named dashboard user, beyond 10 | Per user per month | 180 |
| Driver behaviour scoring module | Per vehicle per month | 145 |
| Fuel sensor integration | Per vehicle, one time | 3,900 |
| Sensor polling interval, 5 minutes | Per vehicle per month | 310 |
| Sensor polling interval, 60 seconds | Per vehicle per month | 940 |
| Second temperature probe, dual zone | Per vehicle, one time | 4,200 |
| Geofence sets beyond 25 | Per set per month | 60 |
| Retrofit to non-Annexure A vehicle | Per vehicle, one time | 6,800 |
| Custom report development | Per man-day | 9,500 |
| Historical extract beyond 90 days | Per request | 1,500 |
| On-site engineer, unscheduled | Per visit | 2,400 |

---

**FOR SAHAJ FRESH RETAIL PRIVATE LIMITED**
Vinay Kulkarni, Vice President, Operations. 3 March 2024

**FOR NIRVATH TELEMATICS PRIVATE LIMITED**
Ashwin Belgaumkar, Director, Sales. 3 March 2024
