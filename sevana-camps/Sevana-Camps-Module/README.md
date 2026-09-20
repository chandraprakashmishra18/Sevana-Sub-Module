# Sevana — Camps Module

A platform connecting medical and educational camps with workers (doctors, teachers, volunteers) and attendees (people needing a checkup or a class) — organized by verified NGOs, schools, and NSS/NCC units. Built as part of the Sevana Civic & Compassion Super-App proposal.

Built for **CS002 — Community Service** (K.R. Mangalam University, SOET).

## What this is

**Frontend only** (React + Vite, plain CSS). Runs entirely on mock data (`src/data/*.js`) so every feature works and can be demoed without a backend.

## Tech Stack

- React 19 + Vite
- React Router v7
- Plain CSS (shared design tokens with the Donations module, in `src/index.css`)
- React Context (`src/context/`) for the Join Camp flow

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

- `src/pages/` — one file per route
- `src/components/` — organized by feature (home, camps, campDetail, join, organize, organizers, profile)
- `src/data/` — mock data (camps, organizers, workers, feedback); `mockWorkers.js` also holds the tier calculation logic
- `src/services/` — **backend team edits these only.** Each function returns mock data wrapped in a Promise; replace the body with a real fetch() call, keeping the same name and return shape
- `src/context/` — Join Camp flow state (role, contact details, role-specific fields)

## Features Implemented

- Home with stats, featured upcoming camps, how-it-works
- Browse & filter camps (by type: Medical/Educational, status: Upcoming/Past, search)
- Camp detail page with role selection (Worker vs Attendee), schedule info, organizer card, feedback
- Full 3-step Join flow, branching by role
- Full 3-step Organize-a-Camp flow (for NSS/NCC/schools/colleges), including local photo/video preview
- Organizer listing + individual profiles
- Past Camps with outcome summaries
- Worker gamification: XP, 5-tier progression (Seedling → Legend), badges, camp history
- Platform-wide Leaderboard
- About & Contact
- Fully responsive

## Not Yet Implemented (backend/future work)

- Login/authentication (worker/attendee/organizer identity is currently accessed by direct URL, not tied to a logged-in user)
- Real media upload/storage (currently browser-local preview only — see the note on the Organize page)
- Camp approval workflow for organizers (submitted camps don't yet appear in the live listing)
- Real XP awarding (currently hardcoded in mock data, not calculated from actual attendance)

## Team SEVANA
- Chandra Prakash Mishra (leader)
- Priyanshi
- Manpreet Kaur
- Abhinav