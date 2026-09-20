# Architecture

```text
                   Vercel
                     |
              React + Vite app
                     |
      +--------------+--------------+
      |              |              |
   Supabase        Stripe        Browser UI
   Auth/DB         Test mode      Framer Motion
      |
 PostgreSQL + RLS + Storage
      |
 Edge Functions
  - checkout
  - webhook
  - draw simulation
```

## Security decisions

- Supabase service role is never exposed to the browser.
- User-facing tables use RLS.
- Admin-only actions are enforced server-side through the `is_admin()` database function and Edge Function checks.
- Winner proof storage is private.
- Draw pool calculations are duplicated in an auditable frontend utility and intended to be enforced server-side for production publication.
