# Sevana Community Services Platform

Sevana is a frontend prototype split into two Vite applications: Donations & Aid and Camps & Community Service. Both use local mock data and browser storage. Prototype login, role views, donation records, camp registrations, and moderation examples are not real authentication, transactions, or verified platform records.

## Run the prototype

From this folder, install each module and run both dev servers:

```powershell
npm install --prefix .\sevana-donations\Sevana-Donations-And-Aid
npm install --prefix .\sevana-camps\Sevana-Camps-Module
npm run dev:donations
npm run dev:camps
```

Open [Donations & Aid](http://localhost:5173) and [Camps](http://localhost:5174). Root `package.json` also provides `npm run build` to build both apps. Each application has its own `.env.example`; copy it to `.env.local` and set `VITE_API_URL` only when a backend is available. Blank means demo mode.

## Routes

| Module | Routes |
| --- | --- |
| Donations | `/`, `/about`, `/contact`, `/campaigns`, `/campaigns/:id`, `/donate`, `/ngo-partners`, `/ngo-partners/:id`, `/impact`, `/leaderboard`, `/login`, `/register`, `/dashboard` |
| Camps | `/`, `/about`, `/contact`, `/camps`, `/camps/:id`, `/camps/:id/join`, `/organize`, `/organizers`, `/organizers/:id`, `/past-camps`, `/profile`, `/profile/:id`, `/leaderboard`, `/invitations`, `/login`, `/register`, `/dashboard` |

The dashboards provide a persisted demo role switcher (individual, volunteer, organization, platform admin) so the corresponding views can be reviewed without pretending the role switch is authorization. Cross-module navigation expects both dev servers to be running.

## Backend integration boundary

Each module has `src/api/client.js` for shared REST requests and `src/services/apiResources.js` for resource operations. Current screens still use the established local mock services; the API resource exports are a clean integration seam and intentionally fail with a clear message if used while `VITE_API_URL` is blank. Keep real authorization, validation, payment processing, and beneficiary privacy enforcement on the backend.

Suggested REST resources:

| Resource | Example endpoints |
| --- | --- |
| Authentication | `POST /auth/login`, `POST /auth/register`, `POST /auth/logout`, `GET /auth/me` |
| Users | `GET/POST /users`, `GET/PATCH /users/:id` |
| Organizations | `GET/POST /organizations`, `GET/PATCH /organizations/:id`, `POST /organizations/:id/verification` |
| Campaigns | `GET/POST /campaigns`, `GET/PATCH /campaigns/:id`, `POST /campaigns/:id/moderation` |
| Donations | `GET/POST /donations`, `GET /donations/:id/receipt`, `POST /donations/:id/distributions` |
| Camps | `GET/POST /camps`, `GET/PATCH /camps/:id`, `POST /camps/:id/moderation` |
| Registrations | `GET/POST /camps/:id/registrations`, `PATCH /registrations/:id`, `POST /registrations/:id/attendance` |
| Volunteers | `GET/POST /volunteer-applications`, `PATCH /volunteer-applications/:id` |
| Beneficiaries | `GET/POST /beneficiaries`, `GET/PATCH /beneficiaries/:id` (restricted access) |
| Notifications | `GET /notifications`, `PATCH /notifications/:id/read` |

Suggested PostgreSQL entities: `users`, `organizations`, `organization_verifications`, `campaigns`, `campaign_resources`, `donations`, `receipts`, `distributions`, `camps`, `camp_registrations`, `attendance`, `volunteer_applications`, `beneficiaries`, `outcomes`, `feedback`, `notifications`, and `audit_events`. Use role/permission checks in the API, store sensitive beneficiary information privately, and integrate a payment provider through a backend rather than accepting payment details in this frontend.

## Current scope and known prototype limits

The existing apps include public campaign and camp discovery, detail pages, donation and registration demo flows, organizer forms, profile/leaderboard/invitation features, and local persistence. Dashboards and the backend resource boundary are prototype additions. There is no production organization verification workflow, real admin moderation, server-backed user dashboard, complete campaign editing/distribution reports, or live notification delivery yet; those require backend entities and endpoints. No payment is processed by this prototype.
