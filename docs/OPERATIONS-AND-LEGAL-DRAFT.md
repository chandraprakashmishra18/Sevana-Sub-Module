# Sevana presentation and operations draft

**Status:** Draft for review. This is not approved policy or legal advice. Replace every bracketed item and obtain review from the responsible organization before publishing.

## Privacy policy draft

**Effective date:** [DATE]  
**Responsible organization:** [LEGAL ORGANIZATION NAME]  
**Privacy contact:** [PRIVACY CONTACT EMAIL OR ADDRESS]

Sevana is a demonstration platform for community services. The operator should list the information actually collected by the deployed version here, including account details, organization details, camp registrations, donation records, and any information entered into free-text fields. Do not collect sensitive beneficiary information in the presentation demo.

**Purposes and access:** [DESCRIBE EACH PURPOSE, WHO CAN ACCESS THE DATA, AND THE CONTROLS USED.]  
**Service providers and sharing:** [NAME PROVIDERS AND EXPLAIN WHEN DATA IS SHARED.]  
**Retention and deletion:** [SET RETENTION PERIODS AND A DELETION REQUEST PROCESS.]  
**Security:** [DESCRIBE VERIFIED SECURITY MEASURES; DO NOT CLAIM AUDITS OR CERTIFICATIONS THAT HAVE NOT OCCURRED.]  
**Choices and requests:** Contact [PRIVACY CONTACT] to ask about access, correction, or deletion, subject to applicable requirements.  
**Changes:** [DESCRIBE HOW POLICY CHANGES WILL BE ANNOUNCED.]

Until these details are completed and reviewed, do not use the demonstration with real personal, payment, health, or beneficiary data.

## Terms of use draft

**Operator:** [LEGAL ORGANIZATION NAME]  
**Effective date:** [DATE]  
**Contact:** [SUPPORT CONTACT]

Sevana is currently a demonstration platform. Listings, organization claims, donation records, and impact information may be incomplete or simulated. Do not rely on the demo to transfer money, confirm a donation, verify an organization, or make an urgent care decision. The operator must replace this paragraph with accurate service scope before public use.

Users must provide information they are authorized to submit, respect other users' privacy, and avoid unlawful or harmful use. [OPERATOR: DEFINE CONTENT RULES, ACCOUNT SUSPENSION PROCESS, SERVICE AVAILABILITY, DISPUTE PROCESS, AND APPLICABLE LEGAL TERMS AFTER REVIEW.]

## Support contact placeholders

- General support: [SUPPORT EMAIL]
- Privacy requests: [PRIVACY CONTACT]
- Organization verification: [VERIFICATION CONTACT]
- Urgent safeguarding/escalation: [RESPONSIBLE CONTACT AND PROCESS]

Do not publish until named contacts have accepted responsibility and the inboxes/processes have been checked.

## NGO / organization verification procedure draft

1. Applicant submits the organization name, type, official contact details, and the documents required by [APPROVED VERIFICATION POLICY]. Collect only documents needed for the review.
2. A designated reviewer checks the submission against [AUTHORITATIVE REGISTRY OR APPROVED EVIDENCE], confirms the applicant is authorized to act for the organization, and records the evidence reviewed.
3. A second reviewer or documented supervisor approval is required for [HIGH-RISK / EXCEPTION CASES]. Keep the review decision and reason in an access-controlled audit record.
4. Mark the organization **Verified** only after the required checks are complete. If evidence is insufficient, leave it **Pending** and request clarification. If rejected, record a factual reason and a contact/appeal route. Do not expose submitted identity documents publicly.
5. Recheck on [REVIEW INTERVAL] or when credible concerns arise. Record who reviewed, when, the outcome, and the next review date.

**Open decisions:** [WHO REVIEWS] · [ACCEPTED DOCUMENTS] · [REGISTRY CHECK] · [RETENTION PERIOD] · [APPEAL ROUTE] · [REVIEW INTERVAL]. The application currently enforces pending-versus-verified publishing in the backend, but does not itself perform these evidence checks; do not describe an organization as independently verified based only on its application status.

## Deployment and data operations checklist

- Production must use HTTPS for the frontend and API, a production-only JWT secret of at least 32 characters, and an exact HTTPS `CLIENT_URL` allowlist value. The committed application source currently includes no production host configuration.
- The local frontend environment currently points at an HTTP LAN API address. Set `VITE_API_URL` to the approved HTTPS API URL in the production build environment; never publish the LAN address or a credential in client-side variables.
- Before applying a production migration, take and verify a database backup. Keep backup credentials out of command history and process arguments; use the database provider's protected backup facility or a protected PostgreSQL credential file with `pg_dump --format=custom`. Store the artifact encrypted with restricted access and retention.
- Restore into a separate non-production database first. Verify the restored schema, migration history, and representative record counts before authorizing production recovery. Record the restore date, operator, source backup, and result.
- Repository backup status: no database dump or restore runbook was found during this review. No database operation was performed, so no backup was taken.
- Migration status is unknown while the configured PostgreSQL instance is unavailable. Review applied migrations and resolve any baseline/history ambiguity before production migration; do not reset the database.
