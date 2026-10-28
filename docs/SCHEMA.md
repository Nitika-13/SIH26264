
-- SIH26264 schema. Run ONCE, the whole file, in Supabase > SQL Editor on a fresh project.
-- Then run seed.sql.

create extension if not exists pgcrypto;

create type user_role as enum ('complainant','officer','senior','admin');
create type case_status as enum ('Submitted','Under Review','Notice Sent','Resolved','Escalated');

create table cells (
  id serial primary key,
  name text unique not null,
  sla_days int not null default 15
);

create table colleges (
  id serial primary key,
  name text not null,
  state text not null,
  region text not null
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role user_role not null default 'complainant',
  cell_id int references cells(id),
  language text not null default 'en',
  created_at timestamptz not null default now()
);

create sequence complaint_seq start 1001;

create table complaints (
  id uuid primary key default gen_random_uuid(),
  code text unique not null default ('AICTE-' || to_char(now(),'YY') || '-' || lpad(nextval('complaint_seq')::text, 5, '0')),
  complainant_id uuid references profiles(id),
  college_id int not null references colleges(id),
  cell_id int references cells(id),
  category text,
  urgency text not null default 'normal' check (urgency in ('low','normal','high')),
  summary text,
  original_text text not null,
  translated_text text,
  language text default 'en',
  status case_status not null default 'Submitted',
  routed_by text not null default 'rules' check (routed_by in ('rules','ai')),
  created_at timestamptz not null default now(),
  due_date timestamptz,
  resolved_at timestamptz
);
create index on complaints (status);
create index on complaints (cell_id);
create index on complaints (college_id);
create index on complaints (due_date);

create table case_updates (
  id bigserial primary key,
  complaint_id uuid not null references complaints(id) on delete cascade,
  actor_id uuid references profiles(id),
  actor_role text not null default 'system',
  action text not null,
  note text,
  old_status case_status,
  new_status case_status,
  visible_to_complainant boolean not null default true,
  created_at timestamptz not null default now()
);
create index on case_updates (complaint_id, created_at);

create table attachments (
  id uuid primary key default gen_random_uuid(),
  complaint_id uuid not null references complaints(id) on delete cascade,
  file_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes int,
  created_at timestamptz not null default now()
);

create table notifications_log (
  id bigserial primary key,
  complaint_id uuid references complaints(id) on delete cascade,
  channel text not null,
  recipient text,
  message text,
  sent_at timestamptz not null default now()
);

-- Helpers (security definer so policies do not recurse)
create or replace function app_role() returns user_role
language sql stable security definer set search_path = public as

$$
select role from profiles where id = auth.uid() $$;

create or replace function app_cell() returns int
language sql stable security definer set search_path = public as
$$ select cell_id from profiles where id = auth.uid() $$;

-- New auth user -> profile
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as
$$

begin
  insert into profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''))
  on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- Keyword routing + SLA due date. Always works, even if the AI call fails.
create or replace function complaints_before_insert() returns trigger
language plpgsql as 

$$
declare
  t text := lower(coalesce(new.original_text,''));
  cname text;
begin
  if new.cell_id is null then
    cname := case
      when t ~ '(ragg|bully|bullied|abus|torment)' then 'Anti-Ragging Cell'
      when t ~ '(unapproved|not approved|approval|affiliat|recogni)' then 'Approvals Bureau'
      when t ~ '(fee|refund|deposit|scholarship|fine)' then 'Finance & Refunds Cell'
      when t ~ '(hostel|lab|faculty|infrastructure|classroom|library)' then 'Regional Office'
      else 'Legal Cell' end;
    select id into new.cell_id from cells where name = cname;
    new.category := coalesce(new.category, cname);
    new.routed_by := 'rules';
  end if;
  if new.urgency = 'normal' and t ~ '(ragg|bully|bullied|abus|torment)' then
    new.urgency := 'high';
  end if;
  if new.due_date is null then
    new.due_date := new.created_at + make_interval(days => coalesce((select sla_days from cells where id = new.cell_id), 15));
  end if;
  return new;
end
$$

;
create trigger trg_complaints_before_insert before insert on complaints
  for each row execute function complaints_before_insert();

create or replace function complaints_after_insert() returns trigger
language plpgsql security definer set search_path = public as 

$$
begin
  insert into case_updates (complaint_id, actor_role, action, note, new_status, created_at)
  values (new.id, 'system', 'Received',
          'Complaint received and routed to ' || coalesce((select name from cells where id = new.cell_id),'a cell'),
          'Submitted', new.created_at);
  return new;
end
$$

;
create trigger trg_complaints_after_insert after insert on complaints
  for each row execute function complaints_after_insert();

-- Row Level Security
alter table cells enable row level security;
alter table colleges enable row level security;
alter table profiles enable row level security;
alter table complaints enable row level security;
alter table case_updates enable row level security;
alter table attachments enable row level security;
alter table notifications_log enable row level security;

create policy cells_read on cells for select to anon, authenticated using (true);
create policy colleges_read on colleges for select to anon, authenticated using (true);

create policy profiles_read on profiles for select to authenticated
  using (id = auth.uid() or app_role() in ('senior','admin'));

create policy complaints_read on complaints for select to authenticated
  using (
    complainant_id = auth.uid()
    or (app_role() = 'officer' and cell_id = app_cell())
    or app_role() in ('senior','admin')
  );
create policy complaints_insert on complaints for insert to authenticated
  with check (complainant_id = auth.uid());
-- No update or delete policies: changes go through the functions below.

create policy updates_read on case_updates for select to authenticated
  using (
    exists (select 1 from complaints c where c.id = complaint_id)
    and (visible_to_complainant or app_role() <> 'complainant')
  );
-- No insert, update or delete policies: the audit trail is append-only and written by functions.

create policy attachments_read on attachments for select to authenticated
  using (exists (select 1 from complaints c where c.id = complaint_id));
create policy attachments_insert on attachments for insert to authenticated
  with check (exists (select 1 from complaints c where c.id = complaint_id and c.complainant_id = auth.uid()));

create policy notif_read on notifications_log for select to authenticated
  using (app_role() in ('officer','senior','admin')
         and exists (select 1 from complaints c where c.id = complaint_id));

-- Officer action: status change, note, notice. Atomic, permission-checked, audited.
create or replace function officer_update_case(
  p_complaint uuid,
  p_status case_status default null,
  p_note text default null,
  p_notice boolean default false
) returns void
language plpgsql security definer set search_path = public as 

$$
declare
  c complaints;
  r user_role := app_role();
  new_s case_status;
begin
  select * into c from complaints where id = p_complaint;
  if c.id is null then raise exception 'Case not found'; end if;
  if not (r in ('senior','admin') or (r = 'officer' and c.cell_id = app_cell())) then
    raise exception 'Not allowed';
  end if;
  new_s := case when p_notice then 'Notice Sent'::case_status else coalesce(p_status, c.status) end;
  update complaints
     set status = new_s,
         resolved_at = case when new_s = 'Resolved' then now() else resolved_at end
   where id = p_complaint;
  insert into case_updates (complaint_id, actor_id, actor_role, action, note, old_status, new_status)
  values (p_complaint, auth.uid(), r::text,
          case when p_notice then 'Notice sent to college'
               when new_s <> c.status then 'Status changed'
               else 'Note added' end,
          p_note, c.status, new_s);
  if p_notice then
    insert into notifications_log (complaint_id, channel, recipient, message)
    values (p_complaint, 'email', (select name from colleges where id = c.college_id),
            'Notice sent seeking an explanation within 7 days');
  end if;
end
$$

;

-- Public tracking by complaint ID, limited fields only
create or replace function track_complaint(p_code text) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'code', c.code,
    'status', c.status,
    'cell', (select name from cells where id = c.cell_id),
    'college', (select name from colleges where id = c.college_id),
    'created_at', c.created_at,
    'due_date', c.due_date,
    'timeline', (select coalesce(jsonb_agg(jsonb_build_object('action', u.action, 'at', u.created_at) order by u.created_at), '[]'::jsonb)
                 from case_updates u where u.complaint_id = c.id and u.visible_to_complainant)
  )
  from complaints c where upper(c.code) = upper(p_code)

$$
;

-- SLA escalation
create or replace function escalate_overdue() returns int
language plpgsql security definer set search_path = public as
$$

declare n int;
begin
  with e as (
    update complaints set status = 'Escalated'
     where status not in ('Resolved','Escalated') and due_date < now()
    returning id
  )
  insert into case_updates (complaint_id, actor_role, action, note, new_status)
  select id, 'system', 'Escalated', 'Resolution deadline passed. Escalated to the Chairman''s Office.', 'Escalated' from e;
  get diagnostics n = row_count;
  return n;
end $$;

-- Demo helper: move every open deadline back n days, then escalate
create or replace function simulate_days(n int) returns int
language plpgsql security definer set search_path = public as 

$$
begin
  if app_role() not in ('senior','admin') then raise exception 'Not allowed'; end if;
  update complaints set due_date = due_date - make_interval(days => n)
   where status not in ('Resolved','Escalated');
  return escalate_overdue();
end
$$

;

grant execute on function track_complaint(text) to anon, authenticated;
grant execute on function officer_update_case(uuid, case_status, text, boolean) to authenticated;
grant execute on function escalate_overdue() to authenticated;
grant execute on function simulate_days(int) to authenticated;

-- Analytics views (security_invoker so RLS still applies)
create view v_kpis with (security_invoker = true) as
select
  count(*) as total,
  count(*) filter (where status <> 'Resolved') as open_cases,
  count(*) filter (where status = 'Resolved') as resolved,
  count(*) filter (where status = 'Escalated') as escalated,
  round(100.0 * count(*) filter (where status = 'Escalated'
        or (status <> 'Resolved' and due_date < now())
        or (status = 'Resolved' and resolved_at > due_date)) / nullif(count(*),0), 1) as sla_breach_pct,
  round((avg(extract(epoch from (resolved_at - created_at)) / 86400) filter (where status = 'Resolved'))::numeric, 1) as avg_resolution_days
from complaints;

create view v_by_college with (security_invoker = true) as
select co.id as college_id, co.name as college, co.state,
       count(c.id) as total,
       count(c.id) filter (where c.status <> 'Resolved') as open_cases,
       count(c.id) filter (where c.status = 'Escalated') as escalated
from colleges co left join complaints c on c.college_id = co.id
group by co.id, co.name, co.state;

create view v_by_cell with (security_invoker = true) as
select ce.id as cell_id, ce.name as cell,
       count(c.id) as total,
       count(c.id) filter (where c.status <> 'Resolved') as open_cases,
       count(c.id) filter (where c.status = 'Escalated') as escalated,
       round((avg(extract(epoch from (c.resolved_at - c.created_at)) / 86400) filter (where c.status = 'Resolved'))::numeric, 1) as avg_resolution_days
from cells ce left join complaints c on c.cell_id = ce.id
group by ce.id, ce.name;

create view v_by_category with (security_invoker = true) as
select coalesce(category,'Other') as category, count(*) as total
from complaints group by 1;

create view v_trend with (security_invoker = true) as
select date_trunc('week', created_at)::date as week, count(*) as total
from complaints group by 1 order by 1;

create view v_repeat_offenders with (security_invoker = true) as
select co.name as college, c.category, count(*) as cases_30d
from complaints c join colleges co on co.id = c.college_id
where c.created_at > now() - interval '30 days'
group by co.name, c.category
having count(*) >= 3
order by cases_30d desc;

grant select on v_kpis, v_by_college, v_by_cell, v_by_category, v_trend, v_repeat_offenders to authenticated;

-- Storage bucket for attachments. File path convention: <user_id>/<complaint_code>/<filename></filename>
insert into storage.buckets (id, name, public) values ('attachments','attachments', false)
on conflict (id) do nothing;

create policy "attachments upload own folder" on storage.objects for insert to authenticated
  with check (bucket_id = 'attachments' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "attachments read own or staff" on storage.objects for select to authenticated
  using (bucket_id = 'attachments'
         and ((storage.foldername(name))[1] = auth.uid()::text or app_role() in ('officer','senior','admin')));

-- Realtime for live tracking
alter publication supabase_realtime add table complaints, case_updates;
