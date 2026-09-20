# Deployment runbook

## 1. Supabase

Create a new project (do not reuse a personal project). Run:

```text
supabase/migrations/001_init.sql
```

Then create an admin account through Supabase Auth and promote it only after creation:

```sql
update public.profiles set role='admin' where email='your-admin-email@example.com';
```

For winner proof screenshots, the migration creates the `winner-proofs` private bucket and policies.

## 2. Edge Functions

Set secrets in Supabase:

```text
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
PUBLIC_APP_URL
```

Deploy:

```bash
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
supabase functions deploy run-draw
```

Configure Stripe's test webhook to call the `stripe-webhook` function.

## 3. Frontend

Create `.env.local`:

```text
VITE_DEMO_MODE=false
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_REPLACE_ME
```

Install/build:

```bash
npm install
npm run build
```

Deploy the `dist` output via a **new Vercel account**, and add the same Vite environment variables.
