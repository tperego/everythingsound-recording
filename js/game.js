// Gamification: levels, streaks and badges, worked out from the student's XP events.
// XP itself is decided by the database (supabase/game.sql); this file only reads and shows it.

import { COURSE } from './course.js?v=202611220024';
import { h } from './util.js?v=202611220024';

export const LEVELS = COURSE.levels;

/** {n, name, xp, from, to, next, pct} for a total XP. */
export function levelFor(xp) {
  let i = 0;
  while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1].xp) i++;
  const from = LEVELS[i].xp;
  const nextLevel = LEVELS[i + 1] || null;
  const to = nextLevel ? nextLevel.xp : from;
  return { n: i + 1, name: LEVELS[i].name, xp, from, to, next: nextLevel?.name || null, pct: nextLevel ? Math.round(((xp - from) / (to - from)) * 100) : 100 };
}

/** Local calendar day, e.g. "2026-11-12". */
export const dayKey = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
};
const prevDay = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d - 1));
};

/** Days in a row with practice. The streak stays alive until the end of today, even if today has no practice yet. */
export function streaks(events, now = new Date()) {
  const days = new Set(events.filter((e) => e.kind !== 'marked' && !String(e.kind).startsWith('fault-')).map((e) => dayKey(e.created_at)));
  let best = 0;
  for (const d of days) {
    if (days.has(prevDay(d))) continue; // not the start of a run
    let len = 0;
    let k = d;
    while (days.has(k)) {
      len++;
      const [y, m, dd] = k.split('-').map(Number);
      k = dayKey(new Date(y, m - 1, dd + 1));
    }
    best = Math.max(best, len);
  }
  const today = dayKey(now);
  let k = days.has(today) ? today : prevDay(today);
  let current = 0;
  while (days.has(k)) { current++; k = prevDay(k); }
  return { current, best, practisedToday: days.has(today), days };
}

/** Everything the profile, badges and header need, from the raw events. */
export function summarise(events, now = new Date()) {
  const xp = events.reduce((a, e) => a + (Number(e.xp) || 0), 0);
  const weekAgo = now.getTime() - 7 * 864e5;
  const count = {};
  for (const e of events) count[e.kind] = (count[e.kind] || 0) + 1;
  const lessons = new Set(events.filter((e) => e.kind === 'lesson').map((e) => e.ref));
  const desk = new Set(events.filter((e) => e.kind === 'desk-task').map((e) => String(e.ref).split('/').pop()));
  return {
    xp,
    week: events.filter((e) => new Date(e.created_at).getTime() > weekAgo).reduce((a, e) => a + (Number(e.xp) || 0), 0),
    level: levelFor(Math.max(0, xp)),
    refs: new Set(events.map((e) => `${e.kind}:${e.ref}`)),
    count: new Proxy(count, { get: (o, k) => o[k] || 0 }),
    lessons,
    desk,
    bestMarked: Math.max(0, ...events.filter((e) => e.kind === 'marked').map((e) => Number(e.xp) || 0)),
    ...streaks(events, now),
  };
}

export function badges() {
  const desk = (task) => (s) => s.desk.has(task);
  return [
    { id: 'first-xp', icon: '🎚️', name: 'First signal', how: 'Earn your first XP.', test: (s) => s.xp > 0 },
    { id: 'quiz', icon: '✅', name: 'Studio savvy', how: 'Get every answer right in a set of questions.', test: (s) => s.count.passed >= 1 },
    { id: 'phantom', icon: '⚡', name: 'Phantom handled', how: 'Gain stage a condenser with 48V on before any gain.', test: desk('gain') },
    { id: 'four-stages', icon: '📈', name: 'Four stages', how: 'Hear the REC bus after metering it at every stage.', test: desk('monitor') },
    { id: 'off-tape', icon: '📼', name: 'Off-tape', how: 'Return the DAW on its own channel and monitor the MIX bus.', test: desk('daw-return') },
    { id: 'red-light', icon: '🔴', name: 'Red light', how: 'Record a pass while confidence monitoring.', test: desk('record') },
    { id: 'cue-master', icon: '🎧', name: 'Cue master', how: 'Build a cue mix and get it into the singer\'s headphones.', test: desk('cue') },
    { id: 'click', icon: '⏱️', name: 'In time', how: 'Send a click to the cue only, never to the MIX bus.', test: desk('click') },
    { id: 'fault-finder', icon: '🔧', name: 'Fault finder', how: 'Find and fix a silent channel.', test: desk('trouble') },
    { id: 'exam-pass', icon: '🎓', name: 'Signal flow: passed', how: 'Score 70% or more of the simulator blocks in the exam.', test: (s) => s.count['exam-pass'] >= 1 },
    { id: 'exam-perfect', icon: '🏆', name: 'Clean desk', how: 'Get every simulator block of the exam right.', test: (s) => s.count['exam-perfect'] >= 1 },
    { id: 'final-test', icon: '🗻', name: 'The final test', how: 'Pass the final 10-question test.', test: (s) => s.refs.has('passed:rec-24-final/final') },
    { id: 'zen-master', icon: '☯️', name: 'Zen Recording Master', how: 'Pass all three stages of Maestro Zen\'s challenge.', test: (s) => s.count['zen-master'] >= 1 || s.desk.has('zen3') },
    { id: 'feedback', icon: '💌', name: 'Feedback loop', how: 'Get feedback from your teacher.', test: (s) => s.count.marked >= 1 },
    { id: 'streak-3', icon: '🔥', name: 'Warming up', how: 'Practise 3 days in a row.', test: (s) => s.best >= 3 },
    { id: 'streak-7', icon: '🔥', name: 'On fire', how: 'Practise 7 days in a row.', test: (s) => s.best >= 7 },
    { id: 'streak-30', icon: '🌋', name: 'Unstoppable', how: 'Practise 30 days in a row.', test: (s) => s.best >= 30 },
    ...COURSE.modules.map((m, i) => ({
      id: `module-${i + 1}`, icon: '🎓', name: `${m.title}: complete`, how: `Finish every lesson in Module ${i + 1}.`,
      test: (s) => m.lessons.every((id) => s.lessons.has(id)),
    })),
  ];
}

export const earnedBadges = (s) => badges().filter((b) => b.test(s));

// ---------- What's shown ----------

/** Small header chip: level and streak. */
export function xpChip(s) {
  return h('a', { class: 'btn small xp-chip', href: 'account.html#journey', title: `${s.xp} XP · level ${s.level.n}, ${s.level.name}${s.current ? ` · ${s.current}-day streak` : ''}` },
    h('span', { class: 'lvl' }, `Lv ${s.level.n}`),
    s.current ? h('span', { class: 'streak' }, `🔥 ${s.current}`) : '');
}

function bar(level) {
  return h('div', { class: 'xp-bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(level.pct), 'aria-label': 'Progress to the next level' },
    h('span', { style: { width: `${level.pct}%` } }));
}

/** One line for the course home page. */
export function journeyStrip(s) {
  const l = s.level;
  return h('a', { class: 'journey-strip', href: 'account.html#journey' },
    h('span', { class: 'lvl-badge' }, String(l.n)),
    h('span', { class: 'journey-text' },
      h('strong', {}, `Level ${l.n} · ${l.name}${s.desk.has('zen3') ? ' · ☯️ Zen Master' : ''}`),
      h('span', { class: 'muted small' }, l.next ? `${s.xp} XP · ${l.to - s.xp} to ${l.next}` : `${s.xp} XP · top level!`),
      bar(l)),
    h('span', { class: 'journey-stat' }, h('strong', {}, s.current ? `🔥 ${s.current}` : '🔥 0'), h('span', { class: 'muted small' }, s.practisedToday ? 'day streak' : s.current ? 'practise today to keep it' : 'start a streak today')),
    h('span', { class: 'journey-stat' }, h('strong', {}, `🏅 ${earnedBadges(s).length}`), h('span', { class: 'muted small' }, 'badges')));
}

const KIND_TEXT = {
  passed: 'Questions right',
  'desk-task': 'Desk task done',
  'exam-pass': 'Exam passed',
  'exam-perfect': 'Perfect exam',
  submitted: 'Sent to your teacher',
  lesson: 'Lesson complete',
  'quiz-pass': 'Quick-fire round passed',
  'quiz-round': 'Quick-fire round',
  'quiz-perfect': 'Perfect round',
  daily: 'Daily practice',
  marked: 'Teacher feedback',
  'zen-master': 'Beat Maestro Zen',
  'fault-feedback': 'Maestro Zen: feedback loop',
  'fault-phantom': 'Maestro Zen: phantom power fault',
};

/** The "My journey" card on the profile page (and, with another title, on the teacher's Students page). */
export function journeyCard(s, events, { title = 'My journey', id = 'journey' } = {}) {
  const l = s.level;
  const all = badges();
  const recent = [...events].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))).slice(0, 8);
  return h('section', { class: 'card journey', id },
    h('h2', {}, title),
    h('div', { class: 'journey-top' },
      h('div', { class: 'lvl-big' }, h('span', { class: 'lvl-badge big' }, String(l.n)),
        h('div', {}, h('strong', {}, `Level ${l.n} · ${l.name}`),
          h('div', { class: 'muted small' }, l.next ? `${s.xp} XP · ${l.to - s.xp} more to reach ${l.next}` : `${s.xp} XP · you reached the top level!`),
          bar(l))),
      h('div', { class: 'journey-stats' },
        stat(`🔥 ${s.current}`, 'day streak'),
        stat(`${s.best}`, 'best streak'),
        stat(`⚡ ${s.week}`, 'XP this week'))),
    h('h3', {}, 'Badges'),
    h('ul', { class: 'badge-grid' }, all.map((b) => {
      const got = b.test(s);
      return h('li', { class: `badge-tile${got ? ' got' : ''}`, title: b.how },
        h('span', { class: 'badge-icon', 'aria-hidden': 'true' }, got ? b.icon : '🔒'),
        h('strong', {}, b.name),
        h('span', { class: 'muted small' }, got ? 'Earned' : b.how));
    })),
    h('details', { class: 'mt' },
      h('summary', {}, 'How to earn XP'),
      h('ul', { class: 'small' },
        h('li', {}, 'Get every answer right in a set of questions: 20 XP'),
        h('li', {}, 'Finish a task on the desk: 20 XP'),
        h('li', {}, 'Pass the signal flow exam (70% of the simulator blocks): 50 XP, and 30 more for a perfect score'),
        h('li', {}, 'Send an exercise to your teacher: 30 XP'),
        h('li', {}, 'Finish a whole lesson: 50 XP'),
        h('li', {}, 'Your teacher’s feedback: 10 XP, plus up to 40 more for your score'),
        h('li', {}, 'Your first practice each day: 5 XP, and it keeps your streak going'))),
    recent.length ? h('details', { class: 'mt' },
      h('summary', {}, 'Recent XP'),
      h('ul', { class: 'xp-log small' }, recent.map((e) => h('li', {},
        h('span', {}, KIND_TEXT[e.kind] || e.kind),
        h('span', { class: 'muted' }, new Date(e.created_at).toLocaleDateString([], { day: 'numeric', month: 'short' })),
        h('strong', {}, `+${e.xp}`))))) : '');
}

function stat(big, small) {
  return h('div', { class: 'stat' }, h('strong', {}, big), h('span', { class: 'muted small' }, small));
}

/** Leaderboard rows (from the database): students see opted-in classmates and themselves; the teacher sees everyone. */
export function leaderboardList(rows, { by = 'xp', teacher = false } = {}) {
  const sorted = [...rows].sort((a, b) => b[by] - a[by] || String(a.name).localeCompare(String(b.name)));
  if (!sorted.length) return h('p', { class: 'muted' }, 'Nobody here yet.');
  return h('ol', { class: 'board' }, sorted.map((r, i) => h('li', { class: r.is_me ? 'me' : '' },
    h('span', { class: 'rank' }, i < 3 && r[by] > 0 ? ['🥇', '🥈', '🥉'][i] : String(i + 1)),
    h('span', { class: 'who' }, r.is_me ? `${r.name || 'You'} (you)`
      : teacher && r.student_id ? h('a', { href: `students.html?id=${encodeURIComponent(r.student_id)}` }, r.name || 'Student') : r.name || 'Student',
      r.is_me && !r.listed && !teacher ? h('span', { class: 'muted small' }, ' · only you can see yourself here') : '',
      teacher && r.last_active ? h('span', { class: 'muted small' }, ` · active ${new Date(r.last_active).toLocaleDateString([], { day: 'numeric', month: 'short' })}`) : '',
      teacher && !r.listed ? h('span', { class: 'muted small' }, ' · hidden from classmates') : ''),
    h('span', { class: 'lvl' }, `Lv ${levelFor(r.xp).n}`),
    h('strong', { class: 'pts' }, `${r[by]} XP`))));
}

// ---------- Celebrations ----------

let popTimer = null;
/** "+20 XP" in the corner, a banner for a new level, and one for each new badge. */
export function celebrate({ gained, before, after }) {
  if (!gained) return;
  let el = document.getElementById('xp-pop');
  if (!el) {
    el = h('div', { id: 'xp-pop', role: 'status', 'aria-live': 'polite' });
    document.body.append(el);
  }
  el.textContent = gained > 0 ? `+${gained} XP` : `−${-gained} XP`;
  el.classList.toggle('loss', gained < 0);
  el.classList.remove('show');
  void el.offsetWidth; // restart the animation
  el.classList.add('show');
  clearTimeout(popTimer);
  popTimer = setTimeout(() => el.classList.remove('show'), 2200);

  const news = [];
  if (before && after && after.level.n > before.level.n) news.push({ icon: '⭐', title: `Level ${after.level.n}: ${after.level.name}!`, text: 'Keep going: every exercise, round and day of practice counts.' });
  if (before && after) {
    const had = new Set(earnedBadges(before).map((b) => b.id));
    for (const b of earnedBadges(after)) if (!had.has(b.id)) news.push({ icon: b.icon, title: `New badge: ${b.name}`, text: b.how });
  }
  news.forEach((n, i) => setTimeout(() => banner(n), 400 + i * 3200));
}

function banner({ icon, title, text }) {
  const el = h('div', { class: 'xp-banner', role: 'status' },
    h('span', { class: 'xp-banner-icon', 'aria-hidden': 'true' }, icon),
    h('div', {}, h('strong', {}, title), h('div', { class: 'small' }, text)),
    h('button', { type: 'button', class: 'msg-del', 'aria-label': 'Close', onclick: () => el.remove() }, '✕'));
  document.querySelectorAll('.xp-banner').forEach((b) => b.remove());
  document.body.append(el);
  setTimeout(() => el.classList.add('show'), 20);
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 400); }, 4800);
}
