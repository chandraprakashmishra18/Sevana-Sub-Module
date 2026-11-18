# Sevana implementation audit — Sprint 0

Audit date: 2026-11-18
Repository: `Sevana-Sub-Module`
Branch: `audit/repository-integration-2026-11-17`
HEAD at audit start: `b92c0c6`

## Executive summary

Sevana currently has a working React/Vite product shell and useful demo
workflows, plus a small Express/Prisma authentication API. It is **not** a
production-integrated platform. The active frontend authentication and Camps,
Donations, organization, notification, XP, and payment workflows use browser
storage and sample data. Most of the corresponding backend endpoints and
business services do not exist.

The highest-risk gap is the split identity: the backend can register and
authenticate PostgreSQL users, but the active frontends do not use that API.
The app therefore has no shared, server-authoritative user session or backend
authorization for module operations. There is no real payment, notification,
email, or permanent file-storage integration.

No application implementation was changed during this Sprint 0 audit. The only
new repository file is this audit document. The existing untracked root file
`on` was preserved.

## Git and repository state

- Current branch is `audit/repository-integration-2026-11-17`; `main` was not
  checked out or modified.
- HEAD is `b92c0c6`.
- At audit start, `git status --short` showed one untracked file: `on`. It was
  not opened, changed, staged, or removed.
- The repository has 539 tracked files and four application roots: `backend`,
  `sevana-platform`, standalone Camps, and standalone Donations.
- No `AGENTS.md` files were found in the repository.
- Existing migration files were inspected but not changed or executed.
- No production secrets were read, database connection was attempted, or
  migration was run.

## Architecture and implementation map

| Area | Present implementation | Production status |
|---|---|---|
| Unified frontend | React/Vite app in `sevana-platform`; includes both Camps and Donations routes and their services | Builds and lints. Feature services remain local/mock backed. |
| Standalone Camps | React/Vite app in `sevana-camps/Sevana-Camps-Module` | Builds and lints. Its features remain local/mock backed. |
| Standalone Donations | React/Vite app in `sevana-donations/Sevana-Donations-And-Aid` | Builds and lints. Its features remain local/mock backed. |
| Backend | CommonJS Express 5 app; `src/app.js` exports the Express handler and `server.js` is the local startup wrapper | Syntax, module export, and Prisma schema validation pass. Backend API coverage is limited. |
| Database | PostgreSQL through Prisma 6 | Schema defines several planned business entities; frontend feature workflows do not use them. No production database was accessed. |
| Deployment | Root `vercel.json` defines backend, unified platform, Camps, and Donations services, with service-local SPA rewrites for each frontend | Static config inspected. Actual Vercel deployment/account settings were not tested. |

The standalone Camps and Donations code duplicates much of the unified
platform’s feature code and demo data. Keep these deployable apps in scope until
the owner decides whether they remain supported; avoid independently evolving
three copies of the same business services.

## Feature and data-flow findings

| Capability | Current frontend behavior | Backend/API status | Audit result |
|---|---|---|---|
| Registration/login/profile | Active UI contexts call local auth services. Synthetic accounts and user records are handled in the browser. Registration is disabled by the current demo safeguards. | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` exist. Registration hashes passwords with bcrypt and persists user (and optional initial organization/membership) through Prisma; login issues a JWT; `/me` requires a bearer token. Frontends do not call these routes or persist/use the JWT. | Backend auth foundation exists; end-to-end product authentication is disconnected. |
| Logout/session lifecycle | Frontend logout clears local demo auth state. | No backend logout/revocation endpoint or refresh-token/session table. JWT has configured expiry (`JWT_EXPIRES_IN`, default `7d`). | Missing revocation, refresh, email verification, and recovery flows. |
| Authorization | UI exposes demo roles and restricted registration/sign-in behavior. Frontend checks are not security boundaries. | `requireAuth` verifies bearer JWTs. There are no organization-role/permission middleware policies, and only `/api/auth/me` uses `requireAuth`. | Authentication exists, but protected business operations and RBAC do not. |
| Camps | Seed camps/organizers/workers/feedback/invitations and localStorage-backed drafts, registrations, attendance/status, notifications, and activity. XP/leaderboard derive from client-controlled local/demo data. | Prisma has `Camp`, `CampRegistration`, and `CampOutcome`; there are no mounted Camps routes/controllers/services. | No database-backed camp listing, management, registration, capacity/waitlist, attendance, or outcome workflow. |
| Campaigns and organizations | Sample campaign/NGO data; campaign changes and organization submissions/review use browser storage. | Prisma has `Organization`, memberships, and `Campaign`; no organization/campaign CRUD or review endpoints are mounted. Backend registration can create an initial organization and owner membership only. | No complete organization onboarding, member management, campaign lifecycle, or admin review API. |
| Donations/payment/receipts | Contribution walkthrough records a local demo contribution; receipts are demo-only. Campaign, donor, NGO, and disbursement views include sample/browser data. No payment is processed. | Prisma has `Donation` and `PaymentTransaction` models, but no donation/payment routes, provider integration, webhook, signature verification, refund/reconciliation logic, or real receipt generation. | Financial workflow is not operational. Do not report any contribution as paid or issue a legal/tax receipt. |
| Aid and beneficiary programs | Local/demo data and forms; no server-authoritative request or distribution flow. | Prisma has `AidRequest` and `AidDistribution`; no corresponding API routes/services. The frontend beneficiary program service stores records in localStorage. | No real request review, allocation, fulfilment, or beneficiary persistence. |
| XP and leaderboards | XP awards, tiers, histories, and rankings use sample values and client-side calculations/storage. | No XP ledger, balance, award/idempotency model, or leaderboard endpoint in Prisma/API. `User` has no XP balance field. | Client values are mutable and cannot be authoritative. |
| Notifications | Local notification records, read state, and browser events. | No notification model, API, queue, or email provider integration. | Not persistent or cross-device; delivery is not real. |
| File uploads | UI may select/preview media locally; organization form records a selected filename. | No persistent object storage or upload API; no server-side ownership/type/size validation. | No permanent upload or document verification. |
| Generic API wrappers | Shared `apiRequest` and resource wrappers exist in all three frontends. Wrappers advertise resources such as `/users`, `/organizations`, `/campaigns`, `/donations`, `/camps`, `/volunteers`, `/beneficiaries`, and `/notifications`. | Those resource endpoints are absent; wrapper call sites were not found in active feature flows. Backend currently mounts health and auth routes only. | Do not connect these wrappers as though their routes exist. Define and implement contracts before wiring. |

### Authentication specifics

- Backend route mount is `/api/auth`; currently implemented methods are register
  (`POST`), login (`POST`), and current profile (`GET /me`).
- Backend registration/login use Zod validation, bcrypt hashing/comparison, and
  JWT issuance. Organization registration during signup is performed inside a
  Prisma transaction and creates the owner membership.
- JWT middleware validates bearer tokens but only attaches user id and
  `platformRole`; no route-level role/organization permissions are implemented
  for business operations.
- The unified frontend has a shared UI context, and Camps auth is a compatibility
  re-export in the unified app. This does not make the session server-backed.
  Standalone apps retain their own auth contexts/service copies.
- Frontend services include synthetic seed users and local auth state. Current
  demo safeguards remove password fields from stored profiles and disable
  registration; credentials for synthetic accounts remain in frontend source.
- The existing Phase 2 report records a prior local API smoke test of backend
  register, bcrypt persistence, login/JWT, protected `/me`, invalid credentials,
  and validation responses. That historical local test did not integrate the
  frontend or establish production readiness; it was not repeated in this audit.

## Backend surface and security findings

Mounted in `backend/src/app.js`:

- `GET /api/health` — returns a static API status; it does not check PostgreSQL.
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` — bearer-authenticated.
- All other requests return JSON 404.

`backend/src/routes/index.js` and `healthRoutes.js` define separate health and
readiness handlers (including a `SELECT 1` database check), but `app.js` does
not mount that router. The readiness route is therefore not available through
the active app.

Security gaps to address before public use:

- `cors()` is currently unrestricted; no production origin allowlist is applied.
- `express-rate-limit` is installed but no rate limiter is mounted.
- No refresh/revocation/session store, password reset, email verification, or
  backend logout endpoint is present.
- No permission middleware protects organization, camp, donation, payment, or
  aid operations because those routes do not exist.
- No webhook signature checks, idempotency processing, upload validation,
  persistent notification authorization, or audit log are implemented.
- Helmet is enabled and Zod input validation/bcrypt/JWT foundations are present;
  these do not offset the missing end-to-end controls above.
- Never put server secrets in frontend `VITE_*` variables. No secret values were
  inspected during this audit.

## Database and migration findings

`backend/prisma/schema.prisma` defines application models for:

- User, Organization, OrganizationMember
- Campaign, Donation, PaymentTransaction
- AidRequest, AidDistribution
- Camp, CampRegistration, CampOutcome
- `spatial_ref_sys`

It does not define persistent models for sessions/refresh tokens, email
verification, password recovery, XP ledger/balance, notifications, audit
events, or uploaded-file metadata. The existing schema has useful foreign keys,
unique constraints, and indexes, but models alone do not implement their
business workflows.

Migration sequence in the repository:

1. `prisma/migrations/0_init/migration.sql` creates only `spatial_ref_sys`.
2. `prisma/migrations/20261113214716_init_community_platform/migration.sql`
   creates the listed application enums, tables, indexes, and foreign keys.

The Prisma schema retains a `spatial_ref_sys` model. Prior static audit findings
reported no application use of `spatial_ref_sys`, PostGIS geometry/geography,
`cube`, `earthdistance`, `ll_to_earth`, or `earth_box`; Camp uses ordinary
latitude/longitude floats. This is an apparent migration/schema artifact, not a
feature dependency. Do not delete or rewrite migration history during feature
work; decide its treatment as a separate reviewed migration plan.

Current audit verification ran Prisma schema validation only. It did not query
or mutate any database, and it did not inspect production connection values.
Prior local DB verification is documented separately in
`PHASE2_REPAIR_REPORT_2026-11-18.md`.

## External integrations and blockers

The frontend/backend manifests and inspected source do not show a configured
payment-provider SDK, email provider, or persistent object-storage integration.
The following require owner/account setup before they can be operational:

- A payment provider account and sandbox/live credentials (Razorpay is named in
  the product brief, but no integration is implemented).
- A real email delivery provider and verified sender/domain for verification,
  recovery, and notifications.
- Persistent object storage and credentials/policies for private organization
  documents and public campaign/camp media.
- A selected, migrated non-production PostgreSQL environment for integration
  testing. Production must remain untouched until a reviewed migration plan is
  approved.
- Vercel Services project configuration/access and deployment validation are
  owner-operated and were not changed or tested here.

No external integration is considered live or verified.

## Prioritized implementation plan

Keep work behind explicit review checkpoints. Do not remove demo behavior until
its real replacement passes contract and workflow tests. Use migrations that
preserve existing data; review generated SQL before applying it anywhere.

### Sprint 1 — Identity, schema gap analysis, and API contract

1. Decide whether all three UI roots remain supported; designate the unified
   frontend as the canonical implementation or explicitly plan synchronized
   standalone support.
2. Define one auth contract and connect the active frontend contexts to
   registration, login, `/me`, and protected calls. Keep real credentials out of
   browser localStorage; select secure cookie/token storage and CSRF strategy.
3. Design persisted sessions/revocation, refresh, email verification, password
   recovery, account status, and organization permission policies. Add tests for
   token expiry, unauthorized access, and role boundaries.
4. Compare the model/migration design for sessions, verification/recovery,
   auditability, XP, notifications, documents, receipts, and payment metadata.
   Review SQL and data-preservation behavior before any migration execution.
5. Create `docs/api-spec.md` from implemented/approved contracts, not from
   unused generic frontend wrappers.

### Sprint 2 — Organizations, membership, permissions, and files

Implement organization CRUD/onboarding, member invitations/roles, verified
admin decisions, and server-side policies. Add private durable object storage,
ownership/type/size checks, and document status/retention. Keep personal and
beneficiary data access audited and least-privilege.

### Sprint 3 — Camps

Implement camp CRUD/publish/cancel/search, eligibility, registration
cancellation, duplicate handling, capacity/waitlist, attendance, volunteer
management, outcomes, and organization/admin authorization. Enforce capacity
and duplicate rules transactionally on the backend; preserve existing UI
behavior while replacing each service behind tested API contracts.

### Sprint 4 — Campaigns, donations, aid, and receipts

Implement authorized campaign lifecycle/search, donation records and history,
aid requests/reviews/disbursements, and audit history. Define receipt rules
before generating any receipt. Do not label pending/failed transactions as
donations paid.

### Sprint 5 — Payment provider

Implement sandbox order creation, server-side signature and webhook verification,
idempotent transaction state transitions, failures, refunds, and reconciliation.
Test against the provider sandbox. Report account/credential/legal setup as
BLOCKED until supplied and verified. Enable live processing only after separate
owner approval.

### Sprint 6 — XP, leaderboard, notifications, and email

Add an auditable XP ledger with unique business-event awards and transactional
balances; derive leaderboards from persisted records. Add durable notifications,
read preferences/history, and provider-confirmed email delivery. No client-side
award operation may be authoritative.

### Sprint 7 — Frontend integration and security hardening

Wire each screen to implemented backend endpoints; handle loading, empty,
validation, failure, expired-session, and unauthorized states. Restrict CORS,
mount rate limits, add relevant CSRF controls, safe logging, authorization
coverage, and upload/webhook protections. Remove synthetic accounts/demo
behavior only when the corresponding real workflow has been verified.

### Sprint 8 — Verification, deployment runbook, and production readiness

Run automated unit/integration/E2E workflows against non-production data,
payment sandbox, and storage/email test environments. Verify Vercel Preview,
health/readiness, database connectivity, migrations, rollback, observability,
recovery, and privacy/retention. Owner manages production credentials and
deployment; do not deploy or migrate production from this implementation task.

## Sprint 0 verification results

All commands below were run during this audit. Build output was directed to
unique system temporary directories so tracked/generated repository outputs
were not overwritten.

| Check | Result | Details |
|---|---|---|
| Branch and initial worktree review | PASS | Correct audit branch; `on` was the sole untracked file and was preserved. |
| Unified platform lint/build | PASS | `npm run lint`; `npm run build` through the package script. Vite transformed 229 modules. |
| Standalone Camps lint/build | PASS | `npm run lint`; `npm run build`. Vite transformed 145 modules. |
| Standalone Donations lint/build | PASS | `npm run lint`; `npm run build`. Vite transformed 132 modules. |
| Backend syntax/export | PASS | `node --check` on server, app, and auth controller; requiring `src/app.js` returned an Express handler. |
| Prisma validation | PASS | Local Prisma 6 schema validation succeeded. No DB connection was attempted. |
| Database/production access | NOT RUN | No database connection, production secret access, or migration occurred in this audit. |
| Live API/browser journeys | NOT RUN | This audit used static code review and build/lint checks; no live frontend/backend services were started. |

Vite warned that the external temporary `outDir` was not emptied because it is
outside the project root; builds completed successfully. This was intentional
to preserve repository outputs.

## Readiness verdict

**Not suitable for production use.** Local frontend builds/lint and Prisma
validation pass, but these do not establish production integration. The backend
auth foundation is not connected to the frontend; Camps/Donations and other
business workflows are demo/local; and payment, email, file storage, persistent
XP/notifications, complete authorization, production database migration, and
live deployment verification remain incomplete or blocked.

The current clearly labelled demo can remain available for controlled
demonstration with synthetic information only. Production readiness must be
claimed feature by feature after the corresponding persisted backend workflow
and security tests pass.
