# Sevana — Donations & Aid Module

A community-driven donation platform connecting verified NGOs, students, and families in need with donors — built as part of the Sevana Civic & Compassion Super-App proposal (Donations & Aid module only).

Built for **CS002 — Community Service** (K.R. Mangalam University, SOET).

## What this is

This is the **frontend only** (React + Vite, plain CSS). It currently runs entirely on mock data (`src/data/*.js`) so every feature works and can be demoed without a backend.

## Tech Stack

- React 19 + Vite
- React Router v7
- Plain CSS (no framework) — design tokens in `src/index.css`
- No state management library — React Context (`src/context/`) for the donation flow

## Getting Started

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173`.

Copy `.env.example` to `.env` before running if you're connecting a real backend:
```bash
cp .env.example .env
```

## Project Structure

- `src/pages/` — one file per route
- `src/components/` — organized by feature area (home, campaigns, campaignDetail, donation, ngo, trust, common)
- `src/data/` — mock data (campaigns, NGOs, donors, disbursements)
- `src/services/` — **this is what the backend team should edit.** Each function currently returns mock data wrapped in a Promise. Replace the body with a real `fetch()` call to the backend, keeping the same function name and return shape — no component code needs to change.
- `src/context/` — donation flow state (amount, donor details, payment step)
- `src/routes/AppRoutes.jsx` — all route definitions

## Features Implemented

- Home page with impact stats, trust/verification explainer, featured campaigns
- Browse & filter campaigns (by category, search)
- Campaign detail page with donation widget, donor list, disbursement trail
- Full 4-step donation flow (amount → donor details → payment → 80G receipt)
- NGO partner listing + individual NGO profile pages
- Platform-wide Impact & Transparency page
- About & Contact pages
- Fully responsive (tested down to 375px width)

## Not Yet Implemented (backend/future work)

- Real payment gateway (Razorpay) — currently mocked in `src/services/donationService.js`
- Login/authentication
- NGO admin dashboard (for NGOs to create/manage their own campaigns)
- Real image upload (currently using Picsum placeholder URLs)

## Team SEVANA
- Chandra Prakash Mishra (leader)
- Priyanshi
- Manpreet Kaur
- Abhinav
