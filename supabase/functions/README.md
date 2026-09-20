# Supabase Edge Functions

Deploy these functions after setting secrets in Supabase:

- `create-checkout-session`: creates Stripe subscription checkout sessions.
- `stripe-webhook`: activates/updates the user subscription from Stripe webhook events.
- `run-draw`: server-side admin endpoint for draw simulation.

Example CLI commands:

```bash
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
supabase functions deploy run-draw
```

Required secrets:

```text
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
PUBLIC_APP_URL
```

The frontend uses the Supabase anon key only; service-role secrets must never be placed in Vite environment variables.
