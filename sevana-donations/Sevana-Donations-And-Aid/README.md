# Sevana — Donations & Aid Module

A community-driven donation platform connecting verified NGOs, students, and families in need with donors — built as part of the Sevana Civic & Compassion Super-App proposal (Donations & Aid module only).

Built for **CS002 — Community Service** (K.R. Mangalam University, SOET).

## What this is

This is a frontend demo (React + Vite, plain CSS). Seed content comes from `src/data/*.js`; submitted donation receipts and XP are saved in browser storage.

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
- `src/services/` — demo data and browser persistence; replace with API calls when a backend is available
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

- Real payment gateway (Razorpay) and server-side donation receipts — current checkout is a demo and does not transfer money
- Login/authentication and XP synchronization with the Camps module
- NGO admin dashboard (for NGOs to create/manage their own campaigns)
- Real image upload (currently using Picsum placeholder URLs)

## Team SEVANA
- Chandra Prakash Mishra (leader)
- Priyanshi
- Manpreet Kaur
- Abhinav
