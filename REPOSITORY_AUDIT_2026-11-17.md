# Sevana repository audit — 2026-11-17

## Scope and starting state

- Audited the Git checkout at `Sevana-Sub-Module/` (nested inside the supplied workspace).
- Initial state was a clean `main` worktree at `901392d` (`Polish camps CSS across pages`). `backup/pre-presentation-2026-11-17` pointed to that same commit.
- Created `audit/repository-integration-2026-11-17` at the audited main tip. No branch was deleted, no remote was changed, and no migration or payment was run.
- Actual module paths are `sevana-camps/Sevana-Camps-Module`, `sevana-donations/Sevana-Donations-And-Aid`, `sevana-platform`, and `backend`.

## Git health and contribution trace

- Local branches at audit start: `main`, `backup/pre-presentation-2026-11-17`, `feature/backend-development`, and `integration`. The new working branch is `audit/repository-integration-2026-11-17`.
- Remote branches at audit start: `origin/HEAD -> origin/main`, `origin/main`, `origin/feature/donations-frontend`, `origin/feature/backend-development`, `origin/feature/camps-frontend`, `origin/backup/donations-work`, and `origin/integration`.
- `origin/feature/donations-frontend` points to `5beff62`, an ancestor of `main`; it has no commits missing from main. That branch-tip commit changes `sevana-platform/src/design-system.css`. Earlier Donations UI work is represented in the merged history, including `0f9a23f` and `33f1aa5`.
- Backend development was merged in `6536e8a` and `7343ba2`; `origin/feature/backend-development` and the local `feature/backend-development` tip (`95afaea`) are ancestors of main. The second merge contributed backend campaign/community controllers and routes, auth middleware and app wiring, provisioning scripts, operations documentation, and generated-file cleanup. The current main backend tree has only auth and health routes/controllers; campaigns, donations, camps, and community endpoints are not currently exposed by `backend/src/app.js`.
- `origin/feature/camps-frontend` is not integrated: `cefe956` is ahead of main with 13 camp-related files (about 948 insertions). Preserve it.
- `origin/backup/donations-work` points to `0796174`, one commit ahead of its base and not an ancestor of main. It contains unique differences across Donations and Camps styling/components; preserve it pending a careful file-by-file review.
- Local `integration` (`49459bc`) is an ancestor of main and has no unique commits. The backup branch is recoverable. The backend and Donations feature branches are integrated, but no branches were deleted because contributor/backup ownership cannot be inferred from Git history alone. Remote refs require explicit approval before deletion.
- Removal assessment: the local backend feature branch, local `integration`, remote `origin/integration`, and remote Donations/backend feature refs contain no commits absent from main and are technically removable after owner confirmation. Keep `backup/pre-presentation-2026-11-17`, `origin/backup/donations-work`, and `origin/feature/camps-frontend`. The audit branch is the active change branch. No ref was removed.
- No checkout merge conflict was present. The review found integration gaps, not unresolved Git conflict markers.

## Project and integration map

| Area | Current implementation | Audit result |
| --- | --- | --- |
| Unified frontend | React/Vite app in `sevana-platform`, routes for Donations, Camps, shared dashboards and profile | Production build and lint pass. The main app is the configured unified entry point. |
| Donations | Campaigns, NGO pages, donor history and checkout use mock/local browser services | Checkout explicitly says it is a demo; no payment provider or real charge is invoked. Backend has no matching campaign/donation endpoints. |
| Camps | Listings, registrations, organizer actions, XP and notifications use mock/local browser services | Backend has no matching camp/registration endpoints. Existing local behavior is retained. |
| Authentication | One shared platform context backed by the Donations auth service; Camps keeps a compatibility re-export | Current UI auth is localStorage-based. The backend separately exposes register/login/me with JWT and Prisma; the UI does not call it. |
| REST helpers | Optional `VITE_API_URL` clients and generic API resource wrappers exist | No active service calls these wrappers. The clients expect `/auth/*` under the configured API root; campaign/camp resources have no matching backend routes. |
| Backend | CommonJS Express, Prisma/PostgreSQL, health and auth endpoints | Schema validates and client generates. Database connection failed with a Prisma initialization error; no credentials or URLs were printed. |
| Standalone apps | Separate Camps and Donations Vite projects remain | Both build, but their lint checks fail. Donations build also bundles Express/Node built-ins into browser output and warns about a >500 kB chunk. |

## Security and deployment review

- No actual `.env` file is tracked. `backend/.env` is ignored, and frontend `.env.example` files document an optional `VITE_API_URL` without values. No secret values were copied into this report.
- The root had no `.gitignore`; 929 root `node_modules` paths and 4,647 `sevana-platform/node_modules` paths were tracked. Added a root ignore file and removed those 5,576 generated paths from the Git index only. The local dependency folders remain present and usable; lockfiles remain tracked.
- `backend/src/app.js` uses unrestricted `cors()` and does not mount the available rate-limiting middleware. JWT auth and Zod validation are present; passwords are bcrypt-hashed. Production CORS restrictions and auth throttling remain necessary before deployment.
- The current backend contains no user-controlled raw SQL; its only raw query is a fixed `SELECT 1` health check. Camp media selection creates browser-local preview URLs; there is no backend upload/storage endpoint or server-side upload validation yet.
- `backend/server.js` requires PostgreSQL connectivity before listening. Database connection failed, so full backend startup and authenticated DB-backed journeys are not verified.
- No Vercel/Node-host deployment config was found in the current tree. Production API URL, hosted PostgreSQL, CORS allowlist, migration rollout and SPA fallback remain to be specified. Do not deploy until those are configured and database-backed endpoints are implemented and tested.

## Tests and verification

| Check | Status | Result |
| --- | --- | --- |
| Installed dependency verification | PASS | `npm ls --depth=0` passed in workspace, platform, Camps, Donations, and backend directories. No fresh install was run. |
| Unified frontend production build | PASS | `npm run build` completed; 228 modules transformed. |
| Unified frontend lint | PASS | `npm run lint` passed after the small `WorkerProfile` lint fix below. |
| Camps standalone production build | PASS | `npm run build` completed. |
| Donations standalone production build | PASS WITH WARNING | Build completed; Express/Node modules were externalized for browser compatibility and output chunk exceeded 500 kB. |
| Camps standalone lint | FAIL | Three existing issues: context export/Fast Refresh, `WorkerProfile` effect state update, unused `reason`. |
| Donations standalone lint | FAIL | Seven existing issues including CommonJS globals in browser `App.jsx`, Fast Refresh context export, effect state update, and unused `reason`. |
| Prisma schema validation | PASS | `npx prisma validate` accepted the schema. |
| Prisma client generation | PASS | `npx prisma generate` generated v6.19.3 client. |
| PostgreSQL connection | FAIL | Prisma client initialization failed; no DB mutation was attempted. |
| Backend HTTP/API smoke test | BLOCKED | Sandbox loopback requests failed before the local Express health route could be verified. |
| Browser end-to-end journey | BLOCKED | In-app browser could not reach the local Vite server (`ERR_CONNECTION_TIMED_OUT`). No payment or form submission occurred. |
| Unit/API/E2E test suite | NOT TESTED | No test/spec or Playwright/Cypress suite is configured in the repository. |

## Changes made on the audit branch

- `.gitignore`: added root rules for `node_modules`, `dist`, `coverage`, and `.env`, retaining `.env.example` files.
- Git index: untracked 5,576 generated dependency paths with `git rm --cached`; on-disk dependency directories were preserved.
- `sevana-platform/src/modules/camps/pages/WorkerProfile.jsx`: removed a redundant synchronous loading state update and put the existing signed-out render before the loading render. This resolves the active unified app lint error without changing the screen.
- `REPOSITORY_AUDIT_2026-11-17.md`: this audit report.

Build-generated `dist` and Vite cache changes were restored; they are not part of the proposed source changes.

## Deployment verdict

**NOT READY.** The unified demo frontend builds and passes lint, but PostgreSQL connectivity is unavailable, the backend does not implement the Donations/Camps API surface, the active UI remains local/mock-backed, CORS is unrestricted, standalone lint failures remain, and production deployment configuration is absent. Browser-level critical journeys were blocked by local network isolation, so they are not claimed as tested.
