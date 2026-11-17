# Sevana demo deployment readiness

## Deployment target

The staging/demo target is the unified React + Vite frontend in `sevana-platform/`.
The root workspace is not the Vercel frontend root, and the preserved
`sevana-camps/` and `sevana-donations/` projects are recovery/source copies.
Do not deploy those standalone copies: they still contain the old browser-only
registration implementations.

Vercel project settings:

- **Framework preset:** Services (the root `vercel.json` defines a single
  frontend service; Vercel Services is a beta feature).
- **Service root:** `sevana-platform` with the Vite framework.
- The service uses its package manifest and Vercel's Vite build defaults:
  `npm run build`, output directory `dist`, and the default install command.
- The root catch-all rewrite sends every application URL to the unified frontend
  service, which contains both Camps and Donations routes.
- `sevana-platform/vercel.json` retains the frontend's SPA fallback for direct
  React Router navigation.

The Vercel build and deploy target is frontend-only. The backend is not deployed
or connected by this configuration.

## Environment variables

- No environment variable is required to build or run the demo frontend.
- Leave `VITE_API_URL` unset or empty. The generic REST wrappers are intentionally
  not connected to the current mock-backed services; backend domain endpoints
  do not exist yet.
- `VITE_API_URL` is a public build-time value. Never put database credentials,
  JWT secrets, payment secrets, or other private values in a `VITE_*` variable.
- The optional backend configuration shown in `sevana-platform/.env.example`
  is not needed for this staging deployment.

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
build, lint, and auth-storage checks passed in this workspace. A browser smoke
test could not reach the local dev server because loopback sockets are blocked
by the environment; this is an environment limitation, not evidence of a
frontend runtime failure.

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
- The preserved standalone Camps and Donations folders still contain legacy
  localStorage registration code. They are not the Vercel target and must not be
  deployed separately until they receive the same safeguards.

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
| `npm run build` (workspace root) | PASS | Vite production build completed successfully. |
| Local Vercel config review | PASS | Root multi-service config sends all routes to `sevana-platform`; set project Framework Preset to Services. Vercel dashboard settings were not accessible from this workspace. |
| Auth storage safety check | PASS | Legacy password fields were stripped; registration rejects; only sample login works; passwords are absent from current user storage. |
| Local HTTP/browser smoke test | BLOCKED | The browser and local HTTP probe could not access the loopback server; the host reported loopback/socket access denied. |
