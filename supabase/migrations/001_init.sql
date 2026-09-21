SELECT
  n.nspname AS schema_name,
  t.typname AS type_name
FROM pg_type t
JOIN pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
  AND t.typname IN (
    'app_role',
    'plan_type',
    'subscription_status',
    'draw_type',
    'draw_status',
    'verification_status',
    'payment_status',
    'cricket_format',
    'match_result'
  )
ORDER BY t.typname;