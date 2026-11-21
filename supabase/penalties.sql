-- Recording course: Maestro Zen takes XP away for the faults that would harm gear or ears in a real studio.
--   fault-feedback  -15 XP  a feedback loop on the desk
--   fault-phantom   -20 XP  a mic plugged or unplugged with 48V on, or 48V switched off with the speakers open
-- At most 10 of each a day, so a bad day can't wipe out a term's work. No daily bonus for a fault.
-- Safe to run more than once. Music Theory is not affected (it never sends these kinds).

alter table public.xp_events drop constraint if exists xp_events_xp_range;
alter table public.xp_events add constraint xp_events_xp_range check (xp between -100 and 100);
alter table public.xp_events drop constraint if exists xp_events_kind_ok;
-- Same rule as zen.sql: any well-formed kind (only the database's own functions can write XP).
alter table public.xp_events add constraint xp_events_kind_ok check (kind ~ '^[a-z][a-z0-9-]{1,30}$');

create or replace function public.award_xp(p_course text, p_kind text, p_ref text)
returns table (gained int, total int)
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  today date := (now() at time zone 'utc')::date;
  base int;
  per_day int;
  repeatable boolean := false;
  n int;
  r text;
  ins int;
  got int := 0;
begin
  if uid is null then raise exception 'Not signed in'; end if;
  if not exists (select 1 from public.enrolments where user_id = uid and course_id = p_course) then raise exception 'Not enrolled'; end if;
  if p_ref is null or p_ref !~ '^[a-z0-9-]{1,60}(/[a-z0-9-]{1,60})?$' then raise exception 'Bad reference'; end if;

  case p_kind
    when 'passed' then base := 20; per_day := 40;
    when 'submitted' then base := 30; per_day := 40;
    when 'lesson' then base := 50; per_day := 40;
    when 'quiz-perfect' then base := 15; per_day := 40;
    when 'desk-task' then base := 20; per_day := 40;
    when 'exam-pass' then base := 50; per_day := 40;
    when 'exam-perfect' then base := 30; per_day := 40;
    when 'quiz-pass' then base := 10; per_day := 5; repeatable := true;
    when 'quiz-round' then base := 3; per_day := 10; repeatable := true;
    when 'fault-feedback' then base := -15; per_day := 10; repeatable := true;
    when 'fault-phantom' then base := -20; per_day := 10; repeatable := true;
    else raise exception 'Unknown kind';
  end case;
  if base < 0 and p_course <> 'recording' then raise exception 'Unknown kind'; end if;

  if repeatable then
    select count(*) into n from public.xp_events where user_id = uid and course_id = p_course and kind = p_kind and day = today;
    r := p_ref || '@' || today || '#' || (n + 1);
  else
    select count(*) into n from public.xp_events
      where user_id = uid and course_id = p_course and kind in ('passed', 'submitted', 'lesson', 'quiz-perfect', 'desk-task', 'exam-pass', 'exam-perfect') and day = today;
    r := p_ref;
  end if;

  if n < per_day then
    insert into public.xp_events (user_id, course_id, kind, ref, xp) values (uid, p_course, p_kind, r, base)
      on conflict (user_id, course_id, kind, ref) do nothing;
    get diagnostics ins = row_count;
    if ins > 0 then got := base; end if;
  end if;

  -- First practice of the day in this course: a small bonus (never for a fault).
  if base > 0 then
    insert into public.xp_events (user_id, course_id, kind, ref, xp) values (uid, p_course, 'daily', today::text, 5)
      on conflict (user_id, course_id, kind, ref) do nothing;
    get diagnostics ins = row_count;
    if ins > 0 then got := got + 5; end if;
  end if;

  return query select got, coalesce((select sum(xp) from public.xp_events where user_id = uid and course_id = p_course), 0)::int;
end;
$$;
revoke execute on function public.award_xp(text, text, text) from public, anon;
grant execute on function public.award_xp(text, text, text) to authenticated;
