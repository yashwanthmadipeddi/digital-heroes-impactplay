# ImpactPlay Cricket — final evaluator setup

## Demo access

The recruiter demo is credential-free. Open the landing page, click Explore live demo, then choose User Demo or Admin Demo.

No demo account needs to be created in Supabase.

## Mock payment

Both real authenticated members and the local demo member can use the same clearly-labelled ImpactPlay Demo Gateway.

The gateway does not process real money. A successful payment marks the subscription active, shows a payment-success state, generates an `IP-DEMO-...` reference, and returns to the appropriate product area.

For real users, the active subscription and payment transaction are written to Supabase.
For demo users, they are stored in the browser demo state.

## Supabase migration

The supplied project already has the original database schema deployed. Run only:

`supabase/migrations/002_mock_payments.sql`

in Supabase SQL Editor once.

## Vercel

Keep these frontend variables:

```env
VITE_DEMO_MODE=false
VITE_SUPABASE_URL=YOUR_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_OR_PUBLISHABLE_KEY
```

Do not expose Supabase service-role/secret keys in Vercel frontend variables.

## Local test

```powershell
cd C:\DigitalHeroes_ImpactPlay_Cricket\impactplay-cricket
npm install
npm run build
npm run dev
```

## Note about the supplied ZIP

`supabase/migrations/001_init.sql` in the uploaded source currently contains a cleanup/check query rather than the original schema migration. Do not run that file against the live project. The new `002_mock_payments.sql` is additive and is for the already-configured database.
