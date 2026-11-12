# Sevana Community Services Platform

Sevana now launches as one React + Vite application that combines Donations & Aid with Educational & Medical Camps. The original project folders remain intact as recovery copies. The unified application source is in [`sevana-platform`](./sevana-platform).

## Run one application

From this workspace:

```powershell
npm install --prefix .\sevana-platform
npm run dev
```

The unified frontend runs at `http://localhost:5173`. Build it with `npm run build` and lint it with `npm run lint`. The root dev/build scripts use the unified app dependencies when installed; in this workspace, where the package registry was unavailable, they fall back to the already installed Donations Vite toolchain while still serving/building only the unified app. Set `VITE_API_URL` in `sevana-platform/.env.local` only when an API server is available.

## Shared application

- One landing page, navigation, footer, React Router, auth provider, login/register flow, and profile storage.
- Donations routes: `/campaigns`, `/campaigns/:id`, `/donate`, `/manage-campaigns`, `/ngo-partners`, `/impact`.
- Camps routes: `/camps`, `/camps/:id`, `/camps/:id/join`, `/organize`, `/manage-camps`, `/organizers`, `/invitations`.
- Shared role workspaces: `/dashboard`, `/organization`, `/admin`, `/admin/moderation`.
- Cross-module features: `/notifications`, `/analytics`, `/beneficiaries`, `/profile`.

Navigation between modules stays inside this frontend. Dashboard role choices and all records/actions remain demo-only; no real payment, secure authorization, or legal organization verification is performed.

## Preserved projects

`sevana-donations/Sevana-Donations-And-Aid` and `sevana-camps/Sevana-Camps-Module` have not been deleted or overwritten. Their existing source, styles, mock data, service logic, and individual project manifests are retained. Their source was copied into `sevana-platform/src/modules/{donations,camps}` and the unified routes now compose those pages under one router. A Vite adapter was added to the preserved Donations project so the unified app can be built and started here without registry access. The workspace default starts one server only.

## Backend phase

Both module service layers and their API request boundaries are preserved inside the unified app. `src/shared/AuthContext.jsx` is the single app-level auth context; module auth hooks delegate to it. Suggested REST resources: auth/users, organizations/verifications, campaigns/resources, donations/receipts/distributions, camps/registrations/attendance, volunteers, beneficiaries, notifications, and audit events. Suggested PostgreSQL entities and security considerations are documented in [`sevana-platform/README.md`](./sevana-platform/README.md).
