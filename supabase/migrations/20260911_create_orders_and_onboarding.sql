create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  product_id text not null,
  product_key text not null,
  amount_total integer,
  currency text,
  payment_status text not null,
  customer_email text,
  customer_name text,
  questionnaire_id text,
  questionnaire_status text not null default 'pending',
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.onboarding_submissions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  questionnaire_id text not null,
  answers jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(order_id, questionnaire_id)
);

create index if not exists orders_payment_status_idx on public.orders(payment_status);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists onboarding_order_id_idx on public.onboarding_submissions(order_id);

alter table public.orders enable row level security;
alter table public.onboarding_submissions enable row level security;

-- No public policies by design. Application writes use the server-only service-role key.
