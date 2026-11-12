# Unified Sevana Vite app

This is the single frontend entry point. Install dependencies here and run `npm run dev`; production output is built into `dist/`.

## Structure

- `src/App.jsx`, `src/AppRoutes.jsx`: one app shell and route table.
- `src/shared`: one auth provider, header/footer, user/organization/admin workspaces, beneficiary directory, analytics, and cross-module notifications.
- `src/modules/donations`: preserved Donations & Aid pages, components, mock data, and services.
- `src/modules/camps`: preserved Educational & Medical Camps pages, components, mock data, and services.
- `src/design-system.css`: shared colors, spacing surfaces, focus states, dashboard layouts, and responsive rules.

The module folders in the workspace root remain untouched as recovery copies. Both module applications are composed in the single Router; old cross-module bridge routes are no longer used by the unified app.

## Demo behavior

Authentication and role presentation use browser storage and are not secure backend authentication. Donations, organization review, attendance, registrations, beneficiary reach, and notifications are simulated. Payment processing and document upload are not connected. Avoid treating prototype output as verified or audited data.

## Suggested backend contract

| Area | REST resources |
| --- | --- |
| Identity | `/auth/login`, `/auth/register`, `/auth/me`, `/users` |
| Organizations | `/organizations`, `/organizations/:id/verification` |
| Donations | `/campaigns`, `/donations`, `/donations/:id/receipts`, `/distributions` |
| Camps | `/camps`, `/camps/:id/registrations`, `/registrations/:id/attendance` |
| Volunteers | `/volunteer-applications`, `/volunteers/:id/activities` |
| Beneficiaries | `/beneficiaries`, `/beneficiary-programs` (restricted/private access) |
| Shared | `/notifications`, `/analytics`, `/audit-events` |

Suggested PostgreSQL entities: users, organizations, organization_verifications, campaigns, campaign_resources, donations, receipts, distributions, camps, camp_registrations, attendance, volunteer_applications, beneficiaries, beneficiary_programs, outcomes, feedback, notifications, and audit_events. Enforce permissions and validation on the server, minimize beneficiary PII, and keep payment credentials out of the browser.
