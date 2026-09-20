# ImpactPlay alternative checklist

| Product area | Implementation |
|---|---|
| Public visitor | Cricket-first landing, causes, reward mechanics |
| Registered member | Auth, membership, dashboard, cricket form, cause selection, winnings |
| Administrator | Admin dashboard + users, causes, rewards, winners, reports |
| Monthly/yearly plan | Subscribe page + Stripe test Edge Function scaffolding |
| Subscription gating | SubscriberGuard + Supabase subscription query |
| Cricket match input | Runs 0–500, wickets 0–10, T20/ODI/Test, result, date |
| Impact Form Score | Transparent 1–45 calculation |
| One match/date | Client guard + DB unique constraint |
| Latest five | Client rolling logic + DB trigger |
| Reward draw types | Random + algorithmic simulation |
| Prize pool | 40% / 35% / 25% utility and admin display |
| Jackpot rollover | Prize calculation utility + admin UI labeling |
| Multiple winner split | `splitTier()` utility |
| Cause contribution | UI slider + DB CHECK constraint at 10% minimum |
| Winner proof | Match scorecard upload UI + private storage bucket |
| Winner states | Pending / approved / rejected; Pending / paid |
| Admin reporting | Recharts dashboard |
| Motion UI | Framer Motion + IntersectionObserver scroll reveal |
| Responsive design | Desktop, tablet, mobile breakpoints |
| Deployment | Vercel config + Supabase setup docs |

## Deliberate domain adaptation

The supplied Digital Heroes Level 1 PRD is golf-specific and asks for Stableford score tracking. ImpactPlay intentionally replaces the sport domain with cricket and introduces a transparent 1–45 Impact Form Score derived from runs, wickets, and result. This is an alternative concept, not a literal golf-PRD implementation.
