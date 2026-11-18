# Sevana API Integration Blueprint

**Prepared:** 2026-11-18  
**Scope:** Repository analysis and proposed API contract only. No implementation or migration is included.

## 1. Status key and architecture

- **EXISTING** — mounted backend behavior or current frontend behavior that exists in source.
- **PARTIALLY IMPLEMENTED** — schema/API/UI foundation exists, but the user workflow is not end-to-end.
- **DEMO / LOCAL ONLY** — browser storage, hard-coded sample data, mock service, or UI-only state; never authoritative.
- **PROPOSED BACKEND** — contract recommendation; endpoint does not currently exist unless explicitly marked existing.

The canonical combined UI is `sevana-platform` (React/Vite, `src/AppRoutes.jsx`). Standalone copies remain at `sevana-camps/Sevana-Camps-Module` and `sevana-donations/Sevana-Donations-And-Aid`; their feature services/data are duplicated. This blueprint prioritizes the unified app and recommends either integrating the standalone apps against the same contract or explicitly retiring them in a separately approved product decision. The backend is CommonJS Express (`backend/src/app.js`) with Prisma/PostgreSQL.

### Current backend routes

| Status | Method and path | Authentication | Current behavior |
|---|---|---|---|
| EXISTING | `GET /api/health` | Public | `{ success: true, message }`; static API liveness only. |
| EXISTING | `POST /api/auth/register` | Public | Validates, hashes password, creates User and optionally Organization + OWNER membership transactionally; returns user + bearer access token. |
| EXISTING | `POST /api/auth/login` | Public | Validates credentials and active user; returns user + bearer access token. |
| EXISTING | `GET /api/auth/me` | Bearer JWT | Returns profile and organization memberships. |
| EXISTING | all other paths | N/A | JSON 404. No business routes are mounted. |

Existing success envelope is `{ success: true, data: ... }`; auth registration/login also include `message`. Validation/error envelopes currently vary (`message`, and Zod `errors` on validation). Proposed APIs should standardize on `{ success: true, data, meta? }` and `{ success: false, error: { code, message, details? }, requestId? }`; paginate lists with `meta: { page, pageSize, total }`. Use ISO-8601 UTC timestamps, UUID IDs, decimal money serialized as strings, and never return password hashes or provider secrets.

## 2. Frontend feature and data-source inventory

Paths below are relative to repository root. Shared UI components are named by their owning page/module; CSS files are omitted unless they contain stateful integration logic.

| Feature | Unified frontend pages/components | Current data sources / status |
|---|---|---|
| Shared identity, sign in/up | `sevana-platform/src/shared/AuthContext.jsx`, `useAuth.js`; `modules/donations/pages/Login.jsx`, `Register.jsx`, `OrganizationRegistration.jsx`; Camps `context/useAuth.js` is compatibility-facing | **DEMO / LOCAL ONLY**: auth services and `localStorage`; UI registration safeguards restrict demo signup. Backend `/auth/register`, `/auth/login`, `/auth/me` are **EXISTING** but disconnected. Two module auth service copies and separate standalone apps complicate identity. |
| Shared dashboard, organization, admin | `shared/Dashboard.jsx`, `OrganizationDashboard.jsx`, `AdminDashboard.jsx`, `Analytics.jsx`, `Navbar.jsx`, `LandingPage.jsx` | **DEMO / LOCAL ONLY**: aggregates browser/demo records and static metrics; no dashboard/analytics endpoint. |
| Organizations/NGO directory & verification | Donations `pages/NGOPartners.jsx`, `NGOProfilePage.jsx`, `OrganizationRegistration.jsx`, `AdminConsole.jsx`; `components/ngo/{NGOCard,NGOProfile,NGOVerificationBadge}.jsx`, `components/trust/VerificationSteps.jsx` | **DEMO / LOCAL ONLY**: `mockNGOs.js`, local organization submissions/review. Auth signup can create an Organization and OWNER membership (**PARTIALLY IMPLEMENTED**); organization CRUD, documents, verification, member permissions are absent. |
| Campaigns | `pages/{Campaigns,CampaignDetail,CampaignManager,ImpactTransparency,Home}.jsx`; `components/campaigns/{CampaignGrid,CampaignFilters,CampaignCard}.jsx`, `components/campaignDetail/{CampaignHeader,DonorList,DisbursementTrail}.jsx`, home featured/stats components | **DEMO / LOCAL ONLY**: `mockCampaigns.js`, `campaignService.js` overrides in localStorage, donation-derived local raised totals, mock donor/disbursement data. `Campaign` Prisma model exists (**PARTIALLY IMPLEMENTED**). |
| Donations, checkout, receipt | `pages/Donate.jsx`; `components/donation/{AmountSelector,DonorDetailsForm,PaymentMethodStep,ReceiptPreview,ThankYouScreen,XPRewardBanner}.jsx`; `components/campaignDetail/DonationWidget.jsx` | **DEMO / LOCAL ONLY**: `donationService.js` validates locally, appends local history, fabricates receipt ID and XP; explicitly processes no payment. Donor and payment step form state is client-side. Donation/PaymentTransaction models exist (**PARTIALLY IMPLEMENTED**), no provider integration. |
| Aid/beneficiaries & disbursements | `shared/Beneficiaries.jsx`, `shared/beneficiaryService.js`, campaign detail disbursement trail; `mockDisbursements.js` | **DEMO / LOCAL ONLY**: beneficiary program localStorage plus mock disbursements. `AidRequest`/`AidDistribution` models exist, no API. |
| Camps directory/detail/create/manage | Camps `pages/{Camps,CampDetail,OrganizeCamp,CampManager,PastCamps}.jsx`; `components/camps/{CampGrid,CampFilters,CampCard}.jsx`; `components/home/{FeaturedCamps,CampStats}.jsx`; `components/campDetail/{CampHeader,CampScheduleInfo,OrganizerCard,FeedbackList,RoleSelector,InvitePanel}.jsx`; `components/organize/{CampDetailsForm,MediaUploadForm,OrganizerReview}.jsx` | **DEMO / LOCAL ONLY**: `mockCamps.js`, `campService.js` created-camp and override keys in localStorage, static counts/content. `Camp` and `CampOutcome` models exist (**PARTIALLY IMPLEMENTED**). |
| Camp registration, organizers, invitations, feedback | `pages/{JoinCamp,Organizers,OrganizerProfilePage,InvitationsPage}.jsx`; `components/join/{WorkerJoinForm,AttendeeJoinForm,ContactDetailsStep,JoinConfirmation}.jsx`; `components/feedback/{FeedbackForm,FeedbackCard}.jsx` | **DEMO / LOCAL ONLY**: registrations, organizer info, invitation and feedback services use browser/local data and mocks. `CampRegistration` persists a subset of fields; no mounted API. Invitations/feedback have no Prisma models. |
| XP/profile/leaderboards | Camps `pages/{WorkerProfile,LeaderboardPage}.jsx`, `components/profile/{XPBar,TierBadge,Leaderboard,CampHistoryList,BadgeGrid}.jsx`; Donations `pages/DonorLeaderboardPage.jsx`, `components/donation/XPRewardBanner.jsx` | **DEMO / LOCAL ONLY**: mock workers/donors/XP and client-side awards/ranks in auth/join/donation services/localStorage. No XP ledger, badge, or leaderboard schema/API. |
| Notifications | `shared/Notifications.jsx`; Camps/Donations service `notificationService.js` copies | **DEMO / LOCAL ONLY**: browser/local records and events; no durable backend model, delivery provider, or API. |
| File/media upload | Camps `components/organize/MediaUploadForm.jsx`; organization registration document/media inputs | **DEMO / LOCAL ONLY**: local selection/preview/name only. No durable file store or metadata model. |
| API clients | Unified `modules/{camps,donations}/api/client.js` and `services/apiResources.js` | **PARTIALLY IMPLEMENTED**: `apiRequest` and generic resource wrappers target `/users`, `/organizations`, `/campaigns`, `/donations`, `/camps`, `/volunteers`, `/beneficiaries`, `/notifications`; wrappers are not mounted endpoints and feature flows do not use them. No bearer-token attachment is implemented. Standalone clients repeat this pattern. |

Standalone app integration counterparts are under `sevana-camps/Sevana-Camps-Module/src/{pages,components,services,api}` and `sevana-donations/Sevana-Donations-And-Aid/src/{pages,components,services,api}`. Their contexts/services and static data are copies of the unified modules; when supported, wire them to the same contracts, not independent APIs.

## 3. Proposed API conventions

Base path: `/api`. Public read endpoints expose only published/active records and safe public fields. All ownership and role checks happen server-side; UI route guards are not authorization. `platformRole=ADMIN` is platform-wide; organization permissions derive from `OrganizationMember.role` for the specified organization. Recommended permission groups: `org:read`, `org:manage`, `org:verify` (platform admin), `campaign:manage`, `camp:manage`, `camp:attendance`, `aid:review`, `aid:disburse`, `payment:admin`. Individual users can donate and request aid. Anonymous donation means no donor identity is exposed publicly; it does not mean payment/accounting is anonymous.

The existing schema has no session/revocation, invitation, feedback, audit event, notification, XP, upload metadata, payment webhook/idempotency, receipt delivery, or beneficiary profile models. These are explicit schema gaps to design before implementation; model list below calls out additions instead of implying that records already persist. Suggested common fields for mutable records are `id`, timestamps, and status; changes to money/status/attendance/verification must be audited.

## 4. Resource contracts

All examples below show the `data` value inside the common success envelope unless a complete response is shown. `401` means missing/invalid/expired authentication; `403` means authenticated but insufficient permission; `404` hides inaccessible resources where appropriate; `409` means duplicate/state conflict; `422` means semantic validation failure (existing auth currently uses `400`). Return field-level details in the standard error envelope.

### 4.1 Identity and shared user

| Status / method + route | Auth and permission | Request | Response / validation / errors |
|---|---|---|---|
| EXISTING `POST /api/auth/register` | Public | `{ fullName, email, password, phone?, accountType?: "INDIVIDUAL"|"ORGANIZATION", organizationName?, organizationType?, organizationDescription? }` | `201 { user: {id,fullName,email,phone,platformRole}, accessToken }`. Current validation: trimmed full name 2–120, email valid ≤255 normalized lowercase, password 8–72, phone ≤20; org type from Prisma enum and name/type required for org. `400` validation, `409` email duplicate, `500`. Future cookie/session choice is unresolved; do not put long-lived credentials in localStorage by default. |
| EXISTING `POST /api/auth/login` | Public | `{ email, password }` | `200 { user, accessToken }`; invalid email/password or inactive account `401`; malformed `400`; generic `500`. |
| EXISTING `GET /api/auth/me` | Bearer JWT | none | `200 User` with memberships and organization `{id,name,type,verificationStatus}`. `401` invalid/expired or unavailable. This response is the shared identity source for both modules. |
| PROPOSED `PATCH /api/users/me` | Authenticated | `{ fullName?, phone? }` | `200 User`; trim/length and phone validation; reject unknown/immutable fields. `400/401/422`. Prisma `User`. |
| PROPOSED `POST /api/auth/logout` (if refreshable/revocable session chosen) | Authenticated | none or `{ refreshToken }` | `204`; revoke server session. Requires Session/RefreshToken schema. Current stateless JWT has no logout/revocation endpoint. |

### 4.2 Organizations and memberships

| PROPOSED method + route | Auth and permission | Request | Response / validation / errors |
|---|---|---|---|
| `GET /api/organizations` | Public directory; private fields omitted | Query `q,type,city,verificationStatus,page,pageSize` (public listing defaults VERIFIED only) | `{ items: OrganizationPublic[], meta }`. Validate enum, bounded page size, escaped search. |
| `GET /api/organizations/:organizationId` | Public safe fields; member may see private details | none | `Organization` plus public campaigns/camps summary. `404`. |
| `POST /api/organizations` | Authenticated | `{ name,type,description?,email?,phone?,website?,address?,city?,state? }` | `201 Organization` plus created OWNER membership; validate lengths, URL/email, enum; status always `PENDING` from client. Duplicate membership/org policy `409`; `401/422`. Existing registration's embedded org creation may be retained during compatibility. |
| `PATCH /api/organizations/:organizationId` | OWNER/ADMIN (`org:manage`) | allowed organization profile fields only | `200 Organization`; field validation; `403/404/422`. Never permit setting verification status. |
| `GET /api/organizations/:organizationId/members` | Member with `org:read` | paging | `{ items: Member[], meta }`; `403/404`. |
| `POST /api/organizations/:organizationId/invitations` | OWNER/ADMIN | `{ email, role: COORDINATOR|MEMBER }` | `201 { invitationId,email,role,status,expiresAt }`; email/role validation, invite unique/non-expired; `409`. Requires proposed OrganizationInvitation/token model and email integration. |
| `PATCH /api/organizations/:organizationId/members/:userId` | OWNER/ADMIN | `{ role }` | Updated membership; enum validation; cannot demote/remove last owner; `409/403/404`. |
| `DELETE /api/organizations/:organizationId/members/:userId` | OWNER/ADMIN or self leave policy | none | `204`; last-owner guard `409`. |
| `PATCH /api/admin/organizations/:organizationId/verification` | Platform ADMIN (`org:verify`) | `{ status: VERIFIED|REJECTED|SUSPENDED, reason? }` | Organization with verifiedAt; reason required for rejection/suspension; append audit event. `403/404/409/422`. |

Schema foundation: `Organization`, `OrganizationMember`, `User`; unique `(organizationId,userId)`. Add invitation and audit models before invitation/review workflows. Only existing signup creates org/member; all other routes are proposed.

### 4.3 Camps, registrations, attendance, outcomes

| PROPOSED method + route | Auth and permission | Request | Response / validation / errors |
|---|---|---|---|
| `GET /api/camps` | Public published camps | Query `q,type,city,state,from,to,status,page,pageSize` (status forced PUBLISHED publicly) | `{ items: CampSummary[], meta }`, optionally safe registration count. Validate enum/date/range/page; no private attendee data. |
| `GET /api/camps/:campId` | Public published; draft visible to authorized members | none | Camp, organization public summary, capacity/availability and outcomes summary; `404`. |
| `POST /api/camps` | Authenticated org COORDINATOR/ADMIN/OWNER, verified org for publish | `{ organizationId,title,description,type,serviceDetails?,targetAudience?,venue?,address?,city?,state?,latitude?,longitude?,startsAt,endsAt,registrationDeadline?,capacity? }` | `201 Camp` in DRAFT. Validate title ≤200, description nonempty, lat/lon bounds, end after start, deadline before start, capacity positive, dates/timezone. `401/403/404/422`. |
| `PATCH /api/camps/:campId` | `camp:manage` for owning org | same mutable fields / status transition | Updated Camp; allow-listed transitions DRAFT→PUBLISHED→CANCELLED/COMPLETED, no arbitrary status; conflicts `409`. |
| `DELETE /api/camps/:campId` | `camp:manage`; draft only | none | `204`; published records should cancel rather than delete; `409`. |
| `POST /api/camps/:campId/registrations` | Authenticated user; optional guest only if product explicitly preserves it | `{ role: BENEFICIARY|VOLUNTEER, fullName?,email?,phone?,notes? }` | `201 CampRegistration { id,campId,userId,role,status,registeredAt }`; calculate capacity/waitlist transactionally, duplicate `(campId,userId)` `409`, deadline/cancel/full errors `409`, contact PII validation and access limits. Prisma `CampRegistration` currently requires `fullName`; `userId` optional. |
| `GET /api/camps/:campId/registrations` | Owning org manager; user sees own via `GET /api/users/me/camp-registrations` | `status,role,page,pageSize` | `{ items,meta }`, PII only to authorized manager; `403/404`. |
| `PATCH /api/camps/:campId/registrations/:registrationId` | Org manager; owner may cancel own | `{ status?: REGISTERED|CANCELLED, attendance?: PRESENT|ABSENT|EXCUSED, notes? }` | Registration. Attendance changes require `camp:attendance`; audit; prevent invalid state transitions `409`. |
| `POST /api/camps/:campId/outcomes` | Owning org `camp:manage` after completion | `{ summary,beneficiariesServed,volunteersParticipated,servicesProvided?,materialsDistributed? }` | `201 CampOutcome`; nonnegative integer counts, summary required; one/multiple policy decided; `409/422`. |

Relationships: `Camp.organizationId→Organization`, `createdById→User`; registrations reference Camp and optional User; outcomes reference Camp. Current schema has no invite, feedback, or worker skill/availability records. Add CampInvitation/CampFeedback only if those existing UI workflows remain in scope. Registration currently lacks UI-specific age group/reason/skill fields; avoid collecting sensitive details until policy and retention are defined.

### 4.4 Campaigns, donations, payments, receipts

| PROPOSED method + route | Auth and permission | Request | Response / validation / errors |
|---|---|---|---|
| `GET /api/campaigns` | Public active campaigns | Query `q,category,beneficiaryGroup,organizationId,status,page,pageSize` (public only ACTIVE) | `{ items: CampaignSummary[],meta }`; raised totals computed only from successful money donations; validate enums/paging. |
| `GET /api/campaigns/:campaignId` | Public active; member may see own org drafts | none | Campaign + organization public summary + successful total/donor count; `404`. |
| `POST /api/campaigns` | Authenticated org manager; verified org for ACTIVE | `{ organizationId,title,description,category,beneficiaryGroup?,imageUrl?,goalAmount?,currency?,startDate?,endDate?,location? }` | `201 Campaign` DRAFT; validate title ≤200, description, enums, positive decimal goal, 3-letter supported currency (initially INR), end after start; `403/404/422`. Creator from auth identity, never body. |
| `PATCH /api/campaigns/:campaignId` | Owning org OWNER/ADMIN/COORDINATOR | allowed campaign fields/status | Updated Campaign; transition validation; cannot alter raised totals or donation state; `403/404/409/422`. |
| `PATCH /api/admin/campaigns/:campaignId/status` | Platform ADMIN | `{ status: ACTIVE|PAUSED|COMPLETED|CANCELLED, reason? }` | Updated status + audit record; invalid transition `409`. |
| `GET /api/campaigns/:campaignId/donations` | Public safe donor list only; own history separately authenticated | Query `page,pageSize` | `{ items:[{displayName,amount,currency,createdAt}],meta }`; anonymous donors always masked, never expose email/phone; `404`. |
| `POST /api/donations` | Public guest or authenticated | `{ campaignId, type:"MONEY", amount, currency:"INR", isAnonymous, donorName?, donorEmail? }` | `201 { donation:{id,status:"PENDING",amount,currency}, payment:{id,status:"PENDING",provider,providerOrderId,checkoutData} }`; amount positive and bounded, campaign ACTIVE/in window, currency allowed, guest contact validation. No `SUCCESSFUL` from client. `404/409/422/503`. Create Donation + PaymentTransaction transactionally. |
| `GET /api/donations/me` | Authenticated | `page,pageSize` | User's donations and payment status, receipt available only when settled; `401`. Guests require a signed email receipt link if supported. |
| `GET /api/donations/:donationId/receipt` | Donor identity/verified guest receipt token or ADMIN | none | `200 { receiptNumber,issuedAt,donor,campaign,amount,currency,status }`; only successful payment; `404/403/409`. Receipt validity/tax language requires separate product/legal decision. |
| `POST /api/payments/:paymentTransactionId/confirm` | Authenticated owner or provider proof; never trust client status | `{ providerPaymentId,providerOrderId,signature }` for provider-specific verification | `200 { transaction:{id,status}, donation:{id,status} }`; verify signature server-side and order/amount/currency binding, idempotent state transition. Bad signature `401/422`, mismatch `409`. |
| `POST /api/payments/webhooks/:provider` | Provider signature, no user JWT | Raw provider payload + signature header | `200 { received:true }` only after verified, idempotently processed event. Signature failure `401`; malformed `400`; transient internal failure `5xx` to trigger provider retry. Persist provider event ID/payload hash; add PaymentEvent/idempotency model. |

Schema foundation: `Campaign` belongs to Organization and creator User; `Donation` optionally links campaign and donor, `PaymentTransaction` links donation; AidDistribution may link donation/campaign. Money totals should derive from persisted successful transactions, not browser values. Existing `Donation` fields can represent money/goods/services; payment endpoint above covers online money only. Add durable receipt issuance metadata and payment event/idempotency data as design gaps. No payment provider SDK/account is present; Razorpay was named in project brief/audit but is not configured. Do not claim a payment or issue a receipt until verified settlement.

### 4.5 Aid requests and disbursements

| PROPOSED method + route | Auth and permission | Request | Response / validation / errors |
|---|---|---|---|
| `POST /api/aid-requests` | Authenticated individual or organization member | `{ organizationId?,title,description,category,beneficiaryName?,beneficiaryCount?,requestedAmount?,itemDescription?,quantity?,unit?,urgency }` | `201 AidRequest` with `SUBMITTED`. Resolve organization under authorized membership or platform intake policy; positive counts/amount/quantity, enum checks, required monetary or item need; protect beneficiary PII. `401/403/422`. Existing schema requires organizationId and optionally requesterId, so individual intake needs a policy/relationship design before coding. |
| `GET /api/aid-requests` | Requester sees own; organization reviewers see their org; platform admin policy | Query `organizationId,status,urgency,page,pageSize` | `{items,meta}` scoped to permission; `403/404`. |
| `GET /api/aid-requests/:id` | Requester, owning org reviewer, authorized admin | none | AidRequest and distributions with PII filtering; `404/403`. |
| `PATCH /api/aid-requests/:id/review` | Owning org `aid:review` or assigned platform ADMIN | `{ status: UNDER_REVIEW|APPROVED|REJECTED, reviewNotes }` | Updated request + audit entry; review note required on rejection, valid transition only, no requester self-approval; `409/403/422`. |
| `POST /api/aid-requests/:id/distributions` | Owning org OWNER/ADMIN with `aid:disburse` | `{ amount?,currency?,itemDescription?,quantity?,notes?,campaignId?,donationId? }` | `201 AidDistribution`; request must be APPROVED, currency/amount or goods quantity coherent, linked resources same org/campaign and available, no over-allocation; transactionally update request to FULFILLED only when fully fulfilled; `409/403/422`. |
| `GET /api/organizations/:organizationId/distributions` | Organization member `org:read`; public only aggregate transparency fields | page filters | `{items,meta}`; hide beneficiary identity and private notes publicly; `403/404`. |

Models present: AidRequest references Organization and optional requester User; AidDistribution references Organization, AidRequest and optional Campaign/Donation. Add audit history for decisions/distributions; define allocation arithmetic and public privacy policy before exposing transparency.

### 4.6 XP and leaderboards

| PROPOSED method + route | Auth and permission | Request | Response / validation / errors |
|---|---|---|---|
| `GET /api/leaderboards/donors` | Public | Query `period?,page,pageSize` | `{items:[{userId,displayName,xp,rank,tier}],meta}` from server ledger; exclude anonymous donation attribution and private accounts per policy. |
| `GET /api/leaderboards/volunteers` | Public | Query `period?,page,pageSize` | `{items:[{userId,displayName,xp,rank,tier}],meta}` from verified attendance/approved events. |
| `GET /api/users/me/xp` | Authenticated | none | `{balance,events:[{id,sourceType,sourceId,points,createdAt}],tier}`. |

No client award endpoint. XP should be generated by trusted domain transitions (successful settled donation, attendance confirmed, approved camp outcome) and be idempotent. Proposed `XpLedger` with unique `(sourceType,sourceId,userId,reason)` and optional cached User balance; add Badge/award model only if existing badge UI is retained. Derive ranks on server; validate bounded paging/period. Do not trust the current local XP formula or client-submitted points.

### 4.7 Notifications

| PROPOSED method + route | Auth and permission | Request | Response / validation / errors |
|---|---|---|---|
| `GET /api/notifications` | Authenticated self | Query `unread,page,pageSize` | `{items:[{id,type,title,message,href,readAt,createdAt}],meta}`. |
| `PATCH /api/notifications/:id` | Authenticated recipient | `{ readAt: timestamp|null }` or dedicated read action | Updated notification; only recipient may change; `404/403/422`. |
| `POST /api/notifications/read-all` | Authenticated self | none | `{updatedCount}`. |

Add `Notification` model with recipient User FK, type, safe content/reference, readAt, createdAt, and indexes `(userId,readAt,createdAt)`. Domain operations enqueue notifications transactionally; email/push is separate delivery infrastructure and not implied by an in-app notification. Validate href as internal/allow-listed to avoid unsafe links.

### 4.8 File uploads

| PROPOSED method + route | Auth and permission | Request | Response / validation / errors |
|---|---|---|---|
| `POST /api/uploads/presign` | Authenticated; org membership and purpose scoped | `{ purpose:"organization_document"|"campaign_image"|"camp_image",organizationId?,fileName,contentType,size }` | `201 { uploadId,uploadUrl,method,headers,expiresAt }`; validate MIME by content inspection, max bytes per purpose, extension, generated object key, ownership; reject executable/unsupported files. `401/403/413/422/503`. |
| `POST /api/uploads/:uploadId/complete` | Same uploader/organization permission | `{ checksum? }` | `200 { id,url,purpose,status:"READY" }` after object existence/type scan; otherwise `409/422`. |
| `DELETE /api/uploads/:uploadId` | Uploader or org OWNER/ADMIN; retention policy | none | `204`; safe ownership checks, `404/403`. |

Add `UploadedFile` metadata model (owner, organization, purpose, opaque object key, verified MIME/size/checksum, status, timestamps), private storage integration and malware/content checks. Store only stable public URLs for approved public media; private verification documents must use authorization-gated downloads. File URLs submitted directly in campaign/org JSON must not bypass upload ownership checks.

## 5. Prisma model map and gaps

| Feature | Existing models/relationships | Additional model/design need |
|---|---|---|
| Identity | User; OrganizationMember → User, Organization | Session/RefreshToken, verification/recovery tokens if chosen; User account fields/policies. |
| Organization | Organization → members, campaigns, aid, distributions, camps; unique membership per org/user | OrganizationInvitation, audit event, file metadata. |
| Campaign/donation/payment | Campaign → Organization/User; Donation → Campaign/User; PaymentTransaction → Donation; unique provider order/payment IDs | Provider webhook/event idempotency, receipt issuance, audit event; settlement/refund policy. |
| Aid | AidRequest → Organization/optional User; AidDistribution → Organization/request/optional campaign/donation | Review/distribution audit trail; decide personal request organization requirement and allocation semantics. |
| Camps | Camp → Organization/User; CampRegistration → Camp/optional User; CampOutcome → Camp | CampInvitation, CampFeedback only if retaining their current UI. Registration extension for necessary role-specific data only after privacy review. |
| XP | None | XpLedger unique event award; optional Badge and user badge relation. |
| Notifications | None | Notification recipient FK and read/delivery indexes; optional delivery attempt/outbox. |
| Uploads | None | UploadedFile metadata plus object-storage lifecycle. |

All model additions/changes require a reviewed migration plan and generated SQL review. This document did not alter Prisma or migration files, and no migration is authorized by this blueprint.

## 6. Validation and shared errors

- Validate every body, query, path ID, enum, and state transition on the server. Use allow-lists for mutable fields; derive actor and creator IDs from authentication.
- Normalize email to lowercase; trim names; bound strings, page sizes, upload sizes, monetary precision/currency, array sizes, and date ranges. Use Prisma decimal-safe arithmetic and database transactions for capacity, payment settlement, and allocation invariants.
- Return `400` malformed syntax, `401` unauthenticated, `403` forbidden, `404` absent/out-of-scope, `409` duplicate/capacity/status/idempotency conflict, `413` upload too large, `422` well-formed but invalid fields/state, `429` rate limit, `500` unexpected, and `503` unavailable integration. Never leak SQL, stack, password, private beneficiary details, or provider secrets.
- Existing auth currently returns `400` for Zod validation and has route-specific messages. Standardize errors as a backward-compatible API versioning task; frontend should tolerate current auth envelope during transition.
- Financial provider callback: verify cryptographic signature against raw body, bind order/payment/donation/amount/currency, persist provider event ID uniquely, and make repeated delivery safe. Only server/provider can transition a payment to SUCCESSFUL/FAILED/REFUNDED.
- Authorization must combine platform role and membership role on every organization-owned action; enforce privacy for donor and beneficiary data. Add rate limits and origin policy before public rollout (current CORS is unrestricted and rate-limit package is not mounted, per audit).

## 7. Frontend integration change map

Integration should happen per domain after its endpoints and authorization are implemented. These are likely change locations, not changes made in this preparation task.

1. **Shared API/auth first:** `sevana-platform/src/modules/{camps,donations}/api/client.js`, both `services/apiResources.js`, `shared/AuthContext.jsx`, `shared/useAuth.js`, Donations `context/useAuth.js`, `modules/{camps,donations}/services/authService.js`, `pages/{Login,Register,OrganizationRegistration}.jsx`. Unify session bootstrap (`GET /auth/me`), bearer/cookie handling, loading/error state, logout, and profile. Avoid duplicated module auth state.
2. **Organizations:** Donations `services/{ngoService,organizationDemoService}.js`, `pages/{NGOPartners,NGOProfilePage,OrganizationRegistration,AdminConsole}.jsx`, `shared/{OrganizationDashboard,AdminDashboard}.jsx`, NGO and trust components; switch static profiles/submissions/review to organization APIs.
3. **Camps:** Camps `services/{campService,joinService,organizerService,invitationService,feedbackService}.js`; pages listed above, `JoinCampContext.jsx`, camp detail/join/manage/organize/feedback/profile components; replace local registration and attendance with server state. Update generated links/routes only as required by APIs.
4. **Campaigns/donations/payments:** Donations `services/{campaignService,donationService}.js`, `pages/{Campaigns,CampaignDetail,CampaignManager,Donate,ImpactTransparency,DonorLeaderboardPage,AdminConsole}.jsx`, donation/checkout/campaign detail components; treat payment as pending until provider confirmation/webhook. Remove demo receipt/XP claims only when real replacements are ready.
5. **Aid/disbursement:** `shared/{beneficiaryService.js,Beneficiaries.jsx,Analytics.jsx}`, campaign `DisbursementTrail.jsx`, `mockDisbursements.js` consumers; add request/review and disbursement states/errors.
6. **XP/notifications:** Camps `services/communityService.js`, notification services and profile/leaderboard components; Donations XP/notification consumers; shared `Notifications.jsx`. Fetch server values, refresh after confirmed events, maintain optimistic UI only with rollback.
7. **Uploads:** `MediaUploadForm.jsx`, organization registration document controls, campaign image controls and their services; presign/upload/complete lifecycle and progress/failure UI.
8. **All roots:** Standalone Camps and Donations `src/api/client.js`, `src/services/apiResources.js`, contexts and domain services mirror these changes if those apps remain supported. Their duplicated mock files must not be removed or rewritten as part of the analysis task.

## 8. Feature dependencies

1. Authentication/shared identity → every authenticated write, personal history, notifications, and XP ownership.
2. Organization and membership authorization → organization dashboards, organization-scoped campaigns/camps/aid, moderation, uploads.
3. Upload metadata/storage → organization verification documents and campaign/camp images; resource writes must validate upload ownership.
4. Camp persistence → registration; registration/attendance → volunteer XP; outcome → impact metrics and possible XP.
5. Campaign persistence/status → donations; donation intent → payment order; verified payment settlement → successful donation, receipt, donor totals, notifications, donor XP.
6. Aid request → review/approval → allocation/disbursement; distributions depend on available donations/resources and feed transparency/analytics.
7. Notifications consume committed organization, registration, moderation, payment, and aid events; email is a later delivery channel.
8. Leaderboards depend on authoritative XP ledger entries and confirmed source events, never local demo counters.

## 9. Recommended implementation order

### Tomorrow — Sprint 1: contract and identity foundation

1. Confirm `sevana-platform` is the canonical UI for Sprint 1 and decide whether standalone apps are in support scope; keep every demo path intact while backend adapters are introduced.
2. Agree one API envelope, auth session strategy, permission vocabulary, and `/auth/me` identity shape. Map existing registration/login payloads and current role labels to `PlatformRole` + organization membership without granting client-selected authority.
3. Implement frontend integration only for the already-mounted auth routes after a reviewed API/auth decision: shared API client token/session attachment, bootstrap `/auth/me`, login/register error mapping, profile identity, logout behavior, and 401 handling. Backend endpoints already exist; do not create duplicate auth routes.
4. Write/approve organization and permission contract next: establish organization create/list/detail/profile and member authorization. Current embedded signup organization creation needs a compatibility decision to avoid duplicate organizations.
5. Perform a schema-gap design review (sessions/revocation, audit, uploaded files, XP, notifications, payment event idempotency, invitation/feedback), but keep any schema/migration implementation as a separately scoped next task. No migration is required for the existing auth routes.
6. Define non-production integration acceptance cases for identity and access boundaries before connecting business mutations. Keep public demo deployment and sample data untouched.

Suggested sequence after Sprint 1: organizations + uploads → camps + registration/attendance/outcomes → campaigns → donations + payment sandbox + receipts → aid review/disbursement → XP/leaderboards → notifications/email → standalone app parity and security/deployment hardening. Payment-provider credentials, storage/email accounts, and production migrations are external prerequisites, not assumed available.

## 10. Preparation-task verification

This blueprint is an analysis artifact. Repository safety checks for this task are recorded in the completion message; no source, frontend, package/config, Prisma schema, migration, demo data, commit, or push operation is part of the proposed contracts above.
