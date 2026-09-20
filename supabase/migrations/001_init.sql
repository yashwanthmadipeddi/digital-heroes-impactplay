-- ImpactPlay — Cricket + charity + monthly reward platform
create extension if not exists pgcrypto;

create type public.app_role as enum ('user','admin');
create type public.plan_type as enum ('monthly','yearly');
create type public.subscription_status as enum ('active','inactive','cancelled','past_due');
create type public.draw_type as enum ('random','algorithmic');
create type public.draw_status as enum ('draft','simulated','published');
create type public.verification_status as enum ('pending','approved','rejected');
create type public.payment_status as enum ('pending','paid');
create type public.cricket_format as enum ('T20','ODI','Test');
create type public.match_result as enum ('Win','Draw','Loss');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  role public.app_role not null default 'user',
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.charities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  image_url text not null,
  website_url text,
  featured boolean not null default false,
  impact_metric text not null default '',
  created_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  plan public.plan_type not null,
  status public.subscription_status not null default 'inactive',
  price numeric(10,2) not null default 0,
  charity_percentage numeric(5,2) not null default 10 check (charity_percentage >= 10 and charity_percentage <= 100),
  charity_id uuid references public.charities(id) on delete set null,
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create table public.scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  score integer not null check (score between 1 and 45),
  score_date date not null,
  runs integer not null default 0 check (runs between 0 and 500),
  wickets integer not null default 0 check (wickets between 0 and 10),
  format public.cricket_format not null default 'T20',
  result public.match_result not null default 'Win',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, score_date)
);

create index scores_user_date_idx on public.scores(user_id, score_date desc);

-- Keep the latest-five cricket matches per member at database level.
create or replace function public.enforce_latest_five_scores()
returns trigger language plpgsql as $$
begin
  delete from public.scores
  where user_id = new.user_id
    and id not in (
      select id from public.scores
      where user_id = new.user_id
      order by score_date desc, created_at desc
      limit 5
    );
  return new;
end;
$$;

create trigger scores_latest_five
after insert on public.scores
for each row execute function public.enforce_latest_five_scores();

create table public.draws (
  id uuid primary key default gen_random_uuid(),
  draw_month date not null unique,
  draw_type public.draw_type not null,
  numbers integer[] not null default '{}',
  status public.draw_status not null default 'draft',
  eligible_subscribers integer not null default 0,
  total_prize_pool numeric(12,2) not null default 0,
  jackpot_amount numeric(12,2) not null default 0,
  prize_4_match numeric(12,2) not null default 0,
  prize_3_match numeric(12,2) not null default 0,
  rollover_from_previous numeric(12,2) not null default 0,
  simulation_payload jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.draw_entries (
  id uuid primary key default gen_random_uuid(),
  draw_id uuid not null references public.draws(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(draw_id, user_id)
);

create table public.winners (
  id uuid primary key default gen_random_uuid(),
  draw_id uuid not null references public.draws(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  match_type text not null check (match_type in ('5-number','4-number','3-number')),
  amount numeric(12,2) not null default 0,
  verification_status public.verification_status not null default 'pending',
  payment_status public.payment_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.winner_proofs (
  id uuid primary key default gen_random_uuid(),
  winner_id uuid not null unique references public.winners(id) on delete cascade,
  file_path text not null,
  status public.verification_status not null default 'pending',
  admin_notes text,
  uploaded_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table public.audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  entity_type text not null,
  entity_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index subscriptions_status_idx on public.subscriptions(status);
create index winners_draw_idx on public.winners(draw_id);
create index audit_event_created_idx on public.audit_events(created_at desc);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id,email,full_name) values(new.id,new.email,coalesce(new.raw_user_meta_data->>'full_name','Member'));
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.charities enable row level security;
alter table public.subscriptions enable row level security;
alter table public.scores enable row level security;
alter table public.draws enable row level security;
alter table public.draw_entries enable row level security;
alter table public.winners enable row level security;
alter table public.winner_proofs enable row level security;
alter table public.audit_events enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create policy "public can read charities" on public.charities for select using (true);
create policy "admins manage charities" on public.charities for all using (public.is_admin()) with check (public.is_admin());
create policy "users read own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "users update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "admins read profiles" on public.profiles for select using (public.is_admin());

create policy "users read own subscription" on public.subscriptions for select using (user_id = auth.uid() or public.is_admin());
create policy "users update own subscription" on public.subscriptions for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "admins manage subscriptions" on public.subscriptions for all using (public.is_admin()) with check (public.is_admin());

create policy "users manage own scores" on public.scores for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "admins manage scores" on public.scores for all using (public.is_admin()) with check (public.is_admin());

create policy "members read published draws" on public.draws for select using (status = 'published' or public.is_admin());
create policy "admins manage draws" on public.draws for all using (public.is_admin()) with check (public.is_admin());
create policy "members read own draw entries" on public.draw_entries for select using (user_id = auth.uid() or public.is_admin());
create policy "members enter draws" on public.draw_entries for insert with check (user_id = auth.uid());
create policy "admins manage entries" on public.draw_entries for all using (public.is_admin()) with check (public.is_admin());

create policy "members read own winnings" on public.winners for select using (user_id = auth.uid() or public.is_admin());
create policy "admins manage winners" on public.winners for all using (public.is_admin()) with check (public.is_admin());
create policy "winner reads own proof" on public.winner_proofs for select using (exists(select 1 from public.winners w where w.id = winner_id and w.user_id = auth.uid()) or public.is_admin());
create policy "winner uploads own proof" on public.winner_proofs for insert with check (exists(select 1 from public.winners w where w.id = winner_id and w.user_id = auth.uid()));
create policy "admins manage proof" on public.winner_proofs for all using (public.is_admin()) with check (public.is_admin());

insert into public.charities(name,description,image_url,featured,impact_metric) values
('Hope Foundation','Community-led education, nutrition, and youth opportunity programs.','https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80',true,'1,850 families reached this year'),
('Green Earth Initiative','Restoring local ecosystems through urban forests, water stewardship, and education.','https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',true,'12,400 native trees planted'),
('Children First','Direct support for children through safe learning spaces and mentorship.','https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=900&q=80',false,'740 students supported'),
('Community Health Trust','Mobile health camps and prevention programs for underserved communities.','https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80',false,'5,600 screenings delivered');

insert into storage.buckets (id, name, public) values ('winner-proofs','winner-proofs',false)
on conflict (id) do nothing;

create policy "winner uploads proof object" on storage.objects for insert to authenticated with check (bucket_id='winner-proofs' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "winner reads proof object" on storage.objects for select to authenticated using (bucket_id='winner-proofs' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "admins read proof objects" on storage.objects for select to authenticated using (bucket_id='winner-proofs' and public.is_admin());
