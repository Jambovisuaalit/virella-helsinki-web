alter table public.orders
  add column if not exists delivery_status text not null default 'awaiting_onboarding',
  add column if not exists delivery_started_at timestamptz,
  add column if not exists delivery_completed_at timestamptz;

alter table public.orders
  drop constraint if exists orders_delivery_status_check;

alter table public.orders
  add constraint orders_delivery_status_check
  check (delivery_status in ('awaiting_onboarding','ready','in_progress','client_review','revision','completed','cancelled'));

update public.orders
set delivery_status = case
  when questionnaire_status = 'completed' then 'ready'
  else 'awaiting_onboarding'
end
where delivery_status = 'awaiting_onboarding';

create table if not exists public.delivery_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  from_status text,
  to_status text not null,
  note text,
  actor text not null default 'admin',
  created_at timestamptz not null default now(),
  constraint delivery_events_from_status_check check (from_status is null or from_status in ('awaiting_onboarding','ready','in_progress','client_review','revision','completed','cancelled')),
  constraint delivery_events_to_status_check check (to_status in ('awaiting_onboarding','ready','in_progress','client_review','revision','completed','cancelled'))
);

create index if not exists delivery_events_order_id_created_at_idx
  on public.delivery_events(order_id, created_at desc);

alter table public.delivery_events enable row level security;

create or replace function public.transition_delivery_state(
  p_order_id uuid,
  p_next_status text,
  p_note text default null,
  p_actor text default 'admin'
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  current_order public.orders;
  next_order public.orders;
  now_ts timestamptz := now();
begin
  if p_next_status not in ('awaiting_onboarding','ready','in_progress','client_review','revision','completed','cancelled') then
    raise exception 'invalid_delivery_status';
  end if;

  select * into current_order
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'order_not_found';
  end if;

  if current_order.delivery_status = p_next_status then
    return current_order;
  end if;

  if not (
    (current_order.delivery_status = 'awaiting_onboarding' and p_next_status = 'ready') or
    (current_order.delivery_status = 'ready' and p_next_status in ('in_progress','cancelled')) or
    (current_order.delivery_status = 'in_progress' and p_next_status in ('client_review','completed','cancelled')) or
    (current_order.delivery_status = 'client_review' and p_next_status in ('revision','completed','cancelled')) or
    (current_order.delivery_status = 'revision' and p_next_status in ('client_review','completed','cancelled'))
  ) then
    raise exception 'invalid_delivery_transition:%->%', current_order.delivery_status, p_next_status;
  end if;

  update public.orders
  set
    delivery_status = p_next_status,
    delivery_started_at = case
      when p_next_status = 'in_progress' and delivery_started_at is null then now_ts
      else delivery_started_at
    end,
    delivery_completed_at = case
      when p_next_status = 'completed' then now_ts
      else delivery_completed_at
    end,
    updated_at = now_ts
  where id = p_order_id
  returning * into next_order;

  insert into public.delivery_events(order_id, from_status, to_status, note, actor, created_at)
  values (
    p_order_id,
    current_order.delivery_status,
    p_next_status,
    nullif(left(trim(coalesce(p_note, '')), 500), ''),
    coalesce(nullif(left(trim(coalesce(p_actor, '')), 80), ''), 'admin'),
    now_ts
  );

  return next_order;
end;
$$;

revoke all on function public.transition_delivery_state(uuid, text, text, text) from public, anon, authenticated;
grant execute on function public.transition_delivery_state(uuid, text, text, text) to service_role;
