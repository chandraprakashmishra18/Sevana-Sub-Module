# Sevana platform readiness notes

## Beneficiary programs: proposal only

`AidRequest` describes an organization's request for funds or goods and currently includes a free-text `beneficiaryName` and a beneficiary count. `AidDistribution` records resources linked to an organization, request, optional campaign, and optional donation. These are aggregate workflow and utilization records; they should not become a public roster of recipients.

### Proposed schema

- `BeneficiaryProgram`: organization-owned program metadata (`id`, `organizationId`, title, public description, category, status, start/end dates, created/updated timestamps). The organization is required; creator identity and timestamps are retained for accountability.
- `BeneficiaryCase`: private enrollment/eligibility record (`id`, `programId`, opaque case reference, minimum necessary identity/contact fields, consent and eligibility state, encrypted sensitive fields where needed, created/updated timestamps). Avoid collecting government IDs, health details, or exact addresses unless the program has a documented need and retention policy.
- `ProgramOutcome`: aggregate-only reporting keyed to program and reporting period (counts and non-identifying narrative); never include case-level identifiers.
- Link distributions to an optional `BeneficiaryCase` only if operationally necessary; otherwise retain the existing aggregate `AidDistribution` link to `AidRequest`.

### Ownership and access

The owning organization controls each program. Organization owners/admins manage program metadata and staff with a separate least-privilege caseworker role may access assigned cases. Platform admins may moderate program metadata and audit access, but do not receive routine access to sensitive case details. Beneficiaries may access only their own case through verified identity. Every read/write of case data should be auditable; deletion/retention and consent withdrawal need an explicit policy before implementation.

### API proposal

- `POST/GET /api/organizations/:organizationId/programs` for authorized organization managers; public reads expose only approved public metadata and aggregate outcomes.
- `GET/PATCH /api/programs/:id` follows owner membership checks; publication requires verified organization status, mirroring campaigns and camps.
- `POST /api/programs/:id/enrollments` accepts minimum necessary data and consent; no public listing endpoint for cases.
- `GET/PATCH /api/programs/:id/cases/:caseId` is scoped to the owning organization and assigned caseworkers, with explicit field-level redaction and audit events.
- `GET /api/programs/:id/outcomes` returns aggregates with small-cell suppression to reduce re-identification risk.

No schema changes or migrations for this proposal have been made.

## Donation payments: recommendation and implementation requirements

### Provider comparison

| Provider | Fit for Sevana | Trade-offs |
| --- | --- | --- |
| Razorpay | Recommended first integration for a domestic INR launch: hosted checkout options, Orders/Payments APIs, webhooks, refunds, and settlement reporting align with the current single-merchant donation flow. | Current standard public pricing advertises 2% plus GST per successful payment (with promotional offers subject to eligibility/terms); complete merchant onboarding and charity/fundraising approval before launch. |
| Cashfree Payments | Strong alternative with payment APIs, signature-verified webhooks, refund operations, and settlement tooling. | Get a written quote and confirm fundraising/nonprofit onboarding and settlement terms; its published terms describe standard T+2 settlement. |

Razorpay is a recommendation for implementation simplicity, not an endorsement or an assumption that the platform is already eligible. Compare final NGO account eligibility, payment-method pricing, support, and settlement terms during merchant onboarding.

### Required flow

1. The server validates a donation intent against a published campaign and a verified organization, creates a pending donation and provider order, and stores the provider order ID and immutable amount/currency. The browser receives only the public checkout parameters.
2. Treat the browser success callback as a hint. Verify the provider payment signature server-side and reconcile the order/payment with the provider API. Mark the donation successful only after verified capture/settlement status according to the chosen accounting policy.
3. Webhook handling uses a dedicated route that captures the original raw request bytes, verifies the provider signature with a secret held only in the server secret manager, checks event age/type as applicable, and only then parses and processes the event. Never log secrets or donor payment credentials.
4. Deduplicate with a database uniqueness constraint on provider event ID and provider payment/order IDs, and update donation/transaction state in a DB transaction. Make event handling safe under retries and out-of-order delivery; reconcile periodically against provider records.
5. For refunds, authorize an organization/admin workflow, request the refund against the original captured payment, persist provider refund ID/state, and use idempotency supported by the specific refund endpoint. Do not mark refunded until provider confirmation; account for partial refunds and fees.
6. Model settlement as a separate provider-reported event/reconciliation record. A successful capture is not proof that the merchant bank account has received settled funds. Track gross, fees, tax on fees, net settlement, settlement ID/date, and matched payments.

### Receipts and tax claims

Issue a platform payment acknowledgement only after verified successful payment/capture, with donation ID, amount/currency, timestamp, campaign/recipient organization, donor details as supplied, and provider reference. Do not label it an 80G certificate or promise deductibility. Only the eligible donee organization can issue statutory donation certificates after verifying its registration and completing applicable Income Tax Department reporting (current official guidance describes Forms 113/114 for eligible entities). Keep corrections/refunds linked to the original acknowledgement and issue a refund record rather than silently replacing history.

No payment provider, checkout, webhook, settlement, refund, or genuine receipt has been implemented. Existing demo UI must not be treated as payment evidence.
