# Sevana demo deployment readiness

## Deployment target

The root `vercel.json` defines four services on one Vercel deployment:

| Service | Root | Public path | Runtime |
|---|---|---|---|
| `backend` | `backend/` | `/api/*` | Express app exported by `src/app.js` |
| `sevana-platform` | `sevana-platform/` | fallback `/` | Vite unified app |
| `sevana-camps-module` | `sevana-camps/Sevana-Camps-Module/` | `/camps/*` | Vite, base and router basename `/camps` |
| `sevana-donations-and-aid` | `sevana-donations/Sevana-Donations-And-Aid/` | `/donations/*` | Vite, base and router basename `/donations` |

Configure the Vercel project Framework Preset as **Services**. Vercel Services
is currently a beta feature. Each Vite service has a `build` script and uses its
own package/lock files. The Express service uses `backend/src/app.js` as its
entrypoint instead of the local `server.js` startup wrapper. The local wrapper
starts its own listener and explicitly connects Prisma before listening; the
service entrypoint directly exports the Express app for Vercel.

The modules navigate between same-origin public paths. No app-to-app
server-to-server calls were found, so no Vercel service bindings are configured.
The root rewrites preserve each service's public path. The Vite base paths and
React Router basenames make assets and client routes resolve under those paths.

## Environment variables

- Set `VITE_API_URL=/api` for each Vite service. This is a same-origin public
  path. The generic resource wrappers remain unused by the active mock-backed
  Camps and Donations services; only backend health and auth routes currently
  exist.
- Set backend `DATABASE_URL` and `JWT_SECRET` in the Vercel backend service's
  environment settings; `JWT_EXPIRES_IN` is optional. `PORT` is supplied by the
  runtime. Never set backend secrets as `VITE_*` values.
- `VITE_API_URL` is a public build-time value. Never put database credentials,
  JWT secrets, payment secrets, or other private values in a `VITE_*` variable.
- No production secret values were read or changed during this work.

## Verified demo functionality

Static inspection confirms the unified frontend's current flows remain backed by
sample data and browser storage:

- Browse sample campaign and camp listings and details.
- Create/update demo campaign and camp records locally.
- Submit camp registration requests, update their demo status, and record
  attendance locally.
- Run the donation walkthrough, save a local contribution record, and display a
  clearly marked demo receipt. No payment is attempted.
- View sample and local donation/camp activity, XP, badges, and leaderboards.
- Submit local organization onboarding information and change its simulated
  review status in the demo console. No documents are uploaded or verified.
- Sign in with the bundled synthetic sample accounts; log out and use the
  existing mock-backed app flows.

These are code-path findings, not a claim of production API integration. The
prior unified app lint/build and auth-storage checks passed. The multi-service
builds and route checks for this change are reported in the current task result.

## Disabled or restricted functionality

- Public account registration is disabled. The registration route explains why
  and links to sample account sign-in.
- The authentication service rejects registration even if called directly.
- Sign-in accepts only the bundled synthetic sample accounts. Their credentials
  are public demo fixtures, not secrets or real user accounts.
- On app load, existing `sevana_users` and `sevana_auth_user` browser records are
  scrubbed of `password` fields. Future user/profile writes also omit passwords.
- The payment step only saves a local demo record and explicitly states that no
  payment was attempted. Receipts are not tax documents or proof of payment.
- XP, badges, leaderboard rankings, organization submissions/review, camp
  registrations, and moderation actions are illustrative local demo data. They
  are not authoritative or secure decisions.

## Security limitations

- The demo has no connected authentication API, server-side session, secure
  authorization, or server persistence for Camps and Donations.
- Demo records live in the browser and can be inspected, changed, or deleted by
  the browser user. Do not enter real user, donor, organization, or beneficiary
  information.
- Synthetic sample credentials are shipped in frontend source and are publicly
  discoverable. They must not be reused for any real service.
- This is suitable only for a clearly labeled staging/demo audience, not for
  public onboarding or handling personal/financial information.
- Standalone Camps and Donations are also configured as services in the root
  Vercel deployment. Their registration flows are disabled and their auth
  services accept only the synthetic sample accounts; their feature data
  remains local demo data.

## Remaining production blockers

1. Implement and connect backend registration/login/profile flows with password
   hashing, token lifecycle, protected server routes, and authorization.
2. Add backend Camps, campaign, donation, organization, moderation, notification,
   receipt, and audit endpoints and connect frontend services to verified
   contracts. Keep demo mode explicit until each is implemented.
3. Add a real payment provider integration, server-side payment verification,
   idempotency, refunds/reconciliation, and legally compliant receipts before
   representing any donation as paid.
4. Implement verified organization onboarding and document upload/storage with
   access controls and retention rules.
5. Replace local XP, leaderboard, approval, and registration state with
   server-authoritative records and authorization checks.
6. Configure production secrets only in the backend hosting environment, review
   CORS/rate limiting/logging, privacy/retention, and recovery/monitoring.
7. Reassess the Prisma schema and migration plan against a non-production
   database before any production database changes.

## Verification results

| Check | Result | Notes |
|---|---|---|
| `npm run lint` (workspace root) | PASS | Unified frontend ESLint completed successfully. |
| `npm run build` (workspace root) | PASS | Unified Vite production build completed successfully. |
| `npm run lint` and `npm run build` (standalone Camps) | PASS | Lint completed; Vite emitted assets under `/camps/assets/`. |
| `npm run lint` and `npm run build` (standalone Donations) | PASS | Lint completed; Vite emitted assets under `/donations/assets/`. |
| Backend entrypoint check | PASS | `server.js` and `src/app.js` passed `node --check`; requiring `src/app.js` returned an Express handler. No backend build script exists. |
| Local Vercel config review | PASS | Root service names, roots, route rewrites, and JSON parse were checked. Set project Framework Preset to Services; Vercel dashboard settings were not accessible from this workspace. |
| Auth storage safety check | PASS | Legacy password fields were stripped; registration rejects; only sample login works; passwords are absent from current user storage. |
| Local HTTP/browser smoke test | BLOCKED | The browser and local HTTP probe could not access the loopback server; the host reported loopback/socket access denied. |
