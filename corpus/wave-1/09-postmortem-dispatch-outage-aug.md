# Post-mortem: dispatch app outage, 14 August 2024

**Incident:** ENG-0417
**Severity:** SEV-1
**Duration:** 03:10 to 06:25 IST, 3 hours 15 minutes
**Author:** Tarun Sethi, Head of Engineering
**Reviewed:** 19 August 2024, engineering weekly
**Status:** Post-mortem accepted, actions tracked

---

## 1. Summary

The Sahaj Rider mobile application could not authenticate any user between 03:10 and 06:25 on 14 August. Riders across all four hubs opened the app to a spinning loader and then to a generic "please try again" screen. No route manifests, no drop sequences, no proof-of-delivery capture.

All four hubs fell back to printed manifests. Deliveries went out. The morning ran roughly forty minutes late on average and proof of delivery for the whole morning was reconstructed from paper on 15 August.

No product loss. No customer-facing data exposure.

## 2. What broke

The session service validates rider tokens against a signing key held in the platform secret store. The secret store's TLS client certificate was rotated automatically at 03:07 on 14 August under the ninety-day rotation policy introduced in June.

The session service holds a long-lived connection pool to the secret store and pins the certificate chain at process start. It does not re-read the trust bundle. When the old certificate was revoked, every pooled connection failed handshake on next use. The service did not crash; it returned a 500 on every token validation and kept doing so, so the health check (a shallow `/healthz` checking process liveness only) stayed green for the full 3 hours 15 minutes.

**Primary fault:** certificate rotation on a dependency that the consuming service pins at start-up and never refreshes.

## 3. Why it took 3 hours 15 minutes

| Time | Event |
|---|---|
| 03:07 | Certificate rotated |
| 03:10 | First authentication failures |
| 03:44 | First rider message to a hub supervisor, personal handset (NSK-1) |
| 04:02 | BLR-1 supervisor calls the on-call number |
| 04:05 | On-call engineer (R. Ravindran) acknowledges |
| 04:05 to 05:20 | Investigation. Health checks green, dashboards green, error rate panel showed no anomaly because the panel filters on 5xx from the API gateway and these 500s were served from the session service behind it |
| 05:22 | Ravindran finds the handshake errors in the session service pod logs |
| 05:40 | Correlation with the rotation event in the secret store audit log |
| 06:10 | Rolling restart of session service begins |
| 06:25 | Full recovery |

The detection path was a rider messaging a supervisor from their own phone. That is the real finding of this post-mortem.

## 4. Contributing factors

4.1 Health check does not exercise a dependency. Process liveness is not service health.
4.2 The 5xx panel filters at the gateway and is blind to internal 500s the gateway passes through unchanged.
4.3 The June certificate rotation policy shipped with no inventory of which services pin at start-up.
4.4 No synthetic login probe. One automated rider login every sixty seconds would have paged us at 03:11.
4.5 The on-call runbook has no entry for authentication failure and sends you to the API gateway.

## 5. Notes from the review that are not action items

5.1 The paper fallback worked and it worked because Sunil Bagade keeps printed manifests as standing practice at NSK-1 and the other hubs copied him during the incident. This is not written down anywhere. It should be.

5.2 We considered whether the cold chain dashboard could serve as a secondary liveness signal during an incident of this kind, on the argument that if vehicle telemetry is arriving then the operation is running. It cannot. The NTPL feed does not stream: its alerts and readings arrive batched, a clump at a time rather than continuously, so a quiet dashboard for a few minutes tells you nothing at all about the last few minutes. Ravindran raised it, we tested the idea against the 14 August data, and we are dropping it.

5.3 Nobody escalated for thirty-four minutes because the riders assumed it was their handsets. Worth a line in the rider briefing.

## 6. Actions

| # | Action | Owner | Due | Status |
|---|---|---|---|---|
| 1 | Deep health check on session service, exercises secret store | R. Ravindran | 30 Aug | Done |
| 2 | Synthetic rider login probe, 60s, pages on two consecutive failures | R. Ravindran | 6 Sep | Done |
| 3 | Inventory all services that pin certificates at start-up | T. Sethi | 6 Sep | Done, five found, two more than expected |
| 4 | Error rate panel to include internal 5xx | P. Anantharaman | 13 Sep | In progress |
| 5 | Runbook entry for authentication failure | R. Ravindran | 13 Sep | Done |
| 6 | Rotation policy to require a pinning review before each rotation window | T. Sethi | 20 Sep | Open |
| 7 | Document the printed manifest fallback as standing procedure | S. Bagade | 20 Sep | Open |
