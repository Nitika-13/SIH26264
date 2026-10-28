
-- SIH26264 seed. Run AFTER schema.sql. Run PART 1 and PART 2 first.
-- Then create the 3 demo users in the dashboard (see PROMPTS.md, Step 3) and run PART 3.
-- All data below is fictional.

-- PART 1: cells and colleges
insert into cells (name, sla_days) values
  ('Anti-Ragging Cell', 7),
  ('Approvals Bureau', 15),
  ('Finance & Refunds Cell', 15),
  ('Regional Office', 15),
  ('Legal Cell', 15);

insert into colleges (name, state, region) values
  ('Sunrise Institute of Technology', 'Telangana', 'South'),
  ('Greenfield Engineering College', 'Karnataka', 'South'),
  ('Lakeview Polytechnic', 'Maharashtra', 'West'),
  ('Apex School of Management', 'Delhi', 'North'),
  ('Nova College of Pharmacy', 'Uttar Pradesh', 'North'),
  ('Heritage Institute of Engineering', 'West Bengal', 'East'),
  ('Riverbend Technical Campus', 'Gujarat', 'West'),
  ('Himalaya Institute of Technology', 'Uttarakhand', 'North');

-- PART 2: 80 complaints over the last 40 days (triggers route them and set due dates)
insert into complaints (college_id, original_text, created_at)
select
  1 + floor(power(random(), 1.8) * 8)::int,
  (array[
    'College is refusing to refund my first-year fee after I withdrew admission',
    'The course I joined is not approved by AICTE but admissions are still going on',
    'Seniors are ragging first-year students in the hostel at night',
    'There are no qualified faculty and the labs have not worked all semester',
    'College is withholding my original certificates until I pay extra charges',
    'Fee was deposited twice and the college has not issued a receipt',
    'The hostel has unsafe wiring and the warden ignores every complaint',
    'Management promised placements in writing, but nothing happened and fees were collected',
    'Admission was cancelled without notice and the deposit was not returned',
    'Affiliation of our programme appears to have lapsed, but the college hides it'
  ])[1 + floor(random() * 10)::int],
  now() - random() * 40 * interval '1 day'
from generate_series(1, 80);

update complaints
   set status = (array['Under Review','Notice Sent','Resolved','Under Review','Submitted'])[1 + floor(random() * 5)::int]::case_status
 where complainant_id is null;

update complaints
   set resolved_at = created_at + (random() * 14 + 2) * interval '1 day'
 where status = 'Resolved' and complainant_id is null;

insert into case_updates (complaint_id, actor_role, action, note, old_status, new_status, created_at)
select id, 'officer', 'Status changed', 'Case reviewed by the cell', 'Submitted', status, created_at + interval '1 day'
  from complaints
 where complainant_id is null and status <> 'Submitted';

select escalate_overdue();

-- PART 3: run after creating the demo users in Authentication > Users
-- student@demo.test, officer@demo.test, leadership@demo.test (tick "Auto Confirm User")
update profiles set full_name = 'Aarav Sharma', role = 'complainant'
 where id = (select id from auth.users where email = 'student@demo.test');

update profiles set full_name = 'Meera Iyer', role = 'officer',
       cell_id = (select id from cells where name = 'Finance & Refunds Cell')
 where id = (select id from auth.users where email = 'officer@demo.test');

update profiles set full_name = 'R. K. Nair', role = 'senior'
 where id = (select id from auth.users where email = 'leadership@demo.test');

-- Give the demo student three existing complaints so "My complaints" is not empty
update complaints set complainant_id = (select id from auth.users where email = 'student@demo.test')
 where id in (select id from complaints where complainant_id is null order by created_at desc limit 3);
