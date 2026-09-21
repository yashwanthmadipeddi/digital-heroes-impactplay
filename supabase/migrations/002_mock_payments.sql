-- ImpactPlay: evaluator-safe mock payment records.
-- Apply this AFTER the existing ImpactPlay schema is already deployed.
-- This does not connect to a real payment provider and does not move money.

create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  amount numeric(10,2) not null check (amount > 0),
  currency text not null default 'INR',
  plan public.plan_type not null,
  status text not null check (status in ('paid','failed','refunded')),
  payment_method text not null default 'demo_card',
  provider text not null default 'ImpactPlay Demo Gateway',
  transaction_reference text not null unique,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists payment_transactions_user_idx
  on public.payment_transactions(user_id, created_at desc);

alter table public.payment_transactions enable row level security;

drop policy if exists "users read own payment transactions" on public.payment_transactions;
create policy "users read own payment transactions"
  on public.payment_transactions for select
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "users create own payment transactions" on public.payment_transactions;
create policy "users create own payment transactions"
  on public.payment_transactions for insert
  with check (user_id = auth.uid());

drop policy if exists "admins manage payment transactions" on public.payment_transactions;
create policy "admins manage payment transactions"
  on public.payment_transactions for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "users create own subscription" on public.subscriptions;
create policy "users create own subscription"
  on public.subscriptions for insert
  with check (user_id = auth.uid());

grant select, insert, update, delete on public.subscriptions to authenticated;
grant select, insert on public.payment_transactions to authenticated;
grant select on public.charities to anon, authenticated;
grant select, insert, update, delete on public.scores to authenticated;
grant select on public.draws to anon, authenticated;
grant select on public.winners to authenticated;
