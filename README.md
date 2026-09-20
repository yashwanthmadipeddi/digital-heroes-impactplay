# Digital Heroes Alternative — ImpactPlay

ImpactPlay is an alternative concept built from the existing assignment architecture, replacing the golf theme with cricket while preserving the core product pattern: membership, performance tracking, charity giving, transparent monthly rewards, winner verification, and admin controls.

> **Submission note:** the supplied Digital Heroes PRD is explicitly golf-focused. This cricket variant is an alternative concept. Use it as the primary submission only if Digital Heroes confirms that changing the sport/domain is acceptable. Otherwise submit the original golf implementation.

## Product concept

**ImpactPlay — Cricket with Purpose.**

A subscription-based cricket platform where members record recent match performance, choose a charity, and participate in a transparent monthly reward draw. The member journey is intentionally simple, while the admin workspace exposes data, simulation, winner verification, payouts, and reporting.

## Why the cricket adaptation is useful

- Cricket is immediately familiar to a broad audience.
- Match performance is easier to explain than a specialist golf scoring system.
- Runs, wickets, format, and result create a clear input model.
- A normalized **Impact Form Score (1–45)** gives the product a concise performance signal that can also feed the algorithmic draw mode.

## Stack

- React + TypeScript + Vite
- Tailwind-style custom CSS + glassmorphism surfaces
- Framer Motion
- Supabase (PostgreSQL + Auth + Storage + RLS)
- Stripe Test Mode
- Recharts
- Vercel

## Run locally

```bash
npm install
npm run dev
```

The included demo mode allows the UI and workflows to be explored without connecting Supabase or Stripe. Set `VITE_DEMO_MODE=true` in `.env.local`.

Demo accounts:

- User: `demo@impactplay-demo.com` / `Demo@1234`
- Admin: `admin@impactplay-demo.com` / `Admin@1234`

The landing page also includes **Explore live demo** buttons so an evaluator can jump directly into the prepared member or admin experience.

## Core workflows

- Signup/login and role-aware navigation
- Monthly/yearly membership
- Cricket match performance entry
- Latest-five match retention
- Charity directory and contribution percentage
- Monthly reward draw simulation and publication workflow
- 5/4/3-number prize tiers with jackpot rollover
- Winner scorecard proof flow
- Admin users, charities, draw engine, winners, and analytics
- Responsive scroll-triggered landing page with glassmorphism and motion

## Cricket performance model

Each match records:

- Runs: 0–500
- Wickets: 0–10
- Format: T20, ODI, or Test
- Result: Win, Draw, or Loss
- Match date: one entry per date

The system calculates a transparent **Impact Form Score** between 1 and 45 from batting output, wickets, and result bonus. Only the latest five match records are retained.

### Form score formula

```text
Batting component = min(25, round(runs / 4))
Bowling component = min(15, wickets × 5)
Result bonus      = Win 5 | Draw 3 | Loss 1
Final score       = clamp(1, 45, batting + bowling + result bonus)
```

## Reward draw rules

- 5-number match: 40% (jackpot; rollover)
- 4-number match: 35%
- 3-number match: 25%
- Multiple winners in one tier split that tier equally.
- Random mode samples five unique numbers from 1–45.
- Algorithmic mode weights numbers from observed member Form Scores using the documented draw engine.

## Database

The Supabase migration includes:

- `profiles`
- `subscriptions`
- `scores`
- `charities`
- `draws`
- `draw_entries`
- `winners`
- `winner_proofs`
- `audit_events`

RLS policies separate member-owned data from admin operations, and the score table includes a database-level latest-five trigger.

## Deployment

1. Create a new Supabase project.
2. Run `supabase/migrations/001_init.sql` in the SQL editor.
3. Configure the `winner-proofs` storage bucket/policies from the migration.
4. Add `.env.local` with the Supabase values and set `VITE_DEMO_MODE=false` for a connected deployment.
5. Configure Stripe test keys and deploy the supplied Edge Functions if the payment flow is being evaluated.
6. Create a fresh Vercel project/account for the deployment.

## Design direction

The landing page is deliberately not a traditional sports portal. It uses:

- Scroll-triggered section reveals
- Blur-to-sharp transitions
- Glassmorphism cards
- Aurora gradients
- Layered depth and floating product cards
- Responsive layouts
- Reduced-motion support
- Recruiter-friendly direct demo access

## Reviewer path

1. Open the landing page.
2. Read the short product description below the hero eyebrow.
3. Click **Explore live demo**.
4. Choose **User Demo** to inspect the member journey.
5. Return and choose **Admin Demo** to inspect the control room.

## Alternative-domain note

This repository is intentionally a cricket adaptation. The supplied PRD's mandatory golf-specific wording, including Stableford scoring, has been translated into a cricket-specific product model for demonstration. This improves domain familiarity but is a requirement deviation that should be disclosed when used for assessment.
