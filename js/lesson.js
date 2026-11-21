// A Recording lesson: the video, then its exercises (questions, desk tasks or the exam).
// Desk tasks and the exam run in desk.html inside the page; the desk tells us when they're done.

import { COURSE, courseLessons, lessonNeighbours, lessonProgress } from './course.js?v=202611212357';
import { findLesson } from './lessons.js?v=202611212357';
import { h, store, toast } from './util.js?v=202611212357';
import { MASTER_SVG, INTRO, LOCKED, PASSED, WON, WRONG, pick, say, setVoice, voiceOn } from './zen-master.js?v=202611212357';
import { examSheet, sheetRows, sheetTotals } from './examsheet.js?v=202611212357';
import { awardXp, awardZen, enrolled, mySubmissions, submitOnline, joinCourse, myProfile, renderAccountWidget, saveProgress } from './auth.js?v=202611212357';

const $ = (s) => document.querySelector(s);
const params = new URLSearchParams(location.search);
const lesson = findLesson(params.get('lesson')) || courseLessons()[0];
const key = `es.status.${lesson.id}`;
const status = () => store.get(key, {});
const moduleIndex = COURSE.modules.findIndex((m) => m.lessons.includes(lesson.id));
const FREE = moduleIndex === 0; // the Live room module is the free taster

document.title = `${lesson.title} · Recording · ${COURSE.academy}`;
const nb = lessonNeighbours(lesson.id);
$('#lesson-where').textContent = `Module ${moduleIndex + 1} · ${COURSE.modules[moduleIndex].title} · Lesson ${nb.index + 1} of ${nb.total}`;
$('#lesson-title').textContent = lesson.title;
$('#lesson-about').textContent = lesson.about || '';

const navLink = (l, label) => l ? h('a', { class: 'btn small', href: `lesson.html?lesson=${encodeURIComponent(l.id)}` }, label) : h('span');
for (const id of ['#lesson-nav', '#lesson-nav-bottom']) $(id).replaceChildren(navLink(nb.prev, `← ${nb.prev?.title || ''}`), h('a', { class: 'btn small ghost', href: 'index.html' }, 'All lessons'), navLink(nb.next, `${nb.next?.title || ''} →`));

// ---------- video ----------
// A lesson can have several videos: buttons switch between them ("Video 1 of 3: …").
let curV = 0;
function setVideo(v = 0, at = 0, play = false) {
  const vids = lesson.videos || [];
  if (!vids.length) { $('#video').hidden = true; return; }
  curV = v; const vid = vids[v];
  const q = new URLSearchParams({ rel: '0', modestbranding: '1', start: String(Math.floor(at)) });
  if (play) q.set('autoplay', '1');
  $('#video').classList.toggle('short', !!vid.short);
  const parts = vids.length > 1 ? h('div', { class: 'vparts', role: 'group', 'aria-label': 'Videos in this lesson' }, vids.map((x, i) =>
    h('button', { type: 'button', class: `btn small${i === v ? ' primary' : ''}`, 'aria-pressed': String(i === v), onclick: () => setVideo(i) }, `${i + 1}. ${x.title}`))) : '';
  $('#video').replaceChildren(parts,
    h('iframe', { src: `https://www.youtube-nocookie.com/embed/${vid.id}?${q}`, title: vid.title, allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen', allowfullscreen: true, loading: 'lazy' }),
    h('a', { class: 'muted small', href: `https://www.youtube.com/watch?v=${vid.id}`, target: '_blank', rel: 'noopener' }, 'Watch on YouTube'));
}
setVideo();
const mmss = (at) => `${Math.floor(at / 60)}:${String(Math.floor(at % 60)).padStart(2, '0')}`;
const watchPart = (at, v = 0) => h('button', { type: 'button', class: 'btn small ghost', onclick: () => { setVideo(v, at || 0, true); $('#video').scrollIntoView({ behavior: 'smooth', block: 'center' }); } },
  (lesson.videos.length > 1 ? `▶ Watch: ${lesson.videos[v].title}` : '▶ Watch this part') + (at ? ` (${mmss(at)})` : ''));

// ---------- progress and XP ----------
function mark(ex, kind, ref) {
  const st = status();
  if (st[ex.id] === 'passed') return;
  st[ex.id] = 'passed'; store.set(key, st);
  saveProgress(lesson.id, ex.id, 'passed').catch(() => {});
  awardXp(kind, ref);
  if (lesson.exercises.every((e) => status()[e.id] === 'passed')) { awardXp('lesson', lesson.id); toast('Lesson complete!'); }
  draw();
}

// ---------- exercises ----------
let openTask = null;
let teacher = false; // the teacher sees every lesson and stage unlocked, to try them out
function quizCard(ex) {
  const done = status()[ex.id] === 'passed';
  const form = h('form', { class: 'quiz' }, ex.questions.map((q, qi) => h('fieldset', { class: 'q', id: `q-${ex.id}-${qi}` },
    h('legend', {}, `${qi + 1}. ${q.q}`),
    ...q.a.map((a, ai) => h('label', { class: 'opt' }, h('input', { type: 'radio', name: `q${qi}`, value: String(ai), checked: done && ai === q.ok }), h('span', {}, a))),
    q.at != null || q.v != null ? watchPart(q.at, q.v || 0) : '')),
    h('div', { class: 'row' }, h('button', { type: 'submit', class: 'btn primary' }, 'Check my answers'), h('span', { class: 'qres muted', role: 'status' })));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let right = 0;
    ex.questions.forEach((q, qi) => {
      const v = form.querySelector(`input[name="q${qi}"]:checked`);
      const ok = v && +v.value === q.ok; if (ok) right++;
      form.querySelector(`#q-${ex.id}-${qi}`).className = `q ${v ? (ok ? 'right' : 'wrong') : ''}`;
    });
    const need = ex.pass || ex.questions.length;
    form.querySelector('.qres').textContent = right === ex.questions.length ? 'All right!'
      : right >= need ? `${right} of ${ex.questions.length} right: passed.`
      : `${right} of ${ex.questions.length} right${ex.pass ? ` (${need} to pass)` : ''}. ${lesson.videos.length ? 'Watch the part again and have another go.' : 'Think it through and have another go.'}`;
    if (right >= need) mark(ex, 'passed', `${lesson.id}/${ex.id}`);
  });
  return form;
}

function deskCard(ex) {
  if (ex.after && !teacher && status()[ex.after] !== 'passed') {
    const prev = lesson.exercises.find((e) => e.id === ex.after);
    return h('p', { class: 'muted' }, `🔒 Opens when you pass ${prev ? prev.title.split(' · ')[0] : 'the one before'}.`);
  }
  const open = () => openDesk(ex, `desk.html?task=${encodeURIComponent(ex.task)}#console`);
  return h('div', { class: 'row wrap' },
    h('button', { type: 'button', class: 'btn primary', onclick: open }, status()[ex.id] === 'passed' ? 'Do it again on the desk' : 'Open on the desk'),
    ex.at != null || ex.v != null ? watchPart(ex.at, ex.v || 0) : '');
}

let lastExam = store.get(`es.exam.${lesson.id}`, null);
let myExams = null; // this exam's attempts sent to the tutor (newest first), once loaded

/** A finished exam goes to the tutor's Inbox, like a submission: the tutor marks the blocks the simulator can't see. */
async function sendExam(ex, d) {
  if (teacher || !Array.isArray(d.blocks)) return;
  const p = await myProfile().catch(() => null);
  if (!p) { toast('Sign in to send your exam to your tutor.'); return; }
  try {
    await submitOnline({ lessonId: lesson.id, exerciseId: ex.id, exerciseTitle: ex.title, project: null,
      answers: { auto: d.auto, autoMax: d.autoMax, total: d.total, max: d.max }, checks: d.blocks, message: '' });
    toast('Exam sent to your tutor.');
    myExams = null; draw();
  } catch (err) { toast(`Your exam wasn’t sent: ${err.message}`); }
}

function attemptsBox(ex) {
  const box = h('div', { class: 'exam-attempts' });
  const fill = (subs) => {
    if (!subs.length) { box.replaceChildren(); return; }
    const want = params.get('submission');
    box.replaceChildren(h('h3', {}, 'Your attempts'), ...subs.map((s) => {
      const rows = sheetRows(s), t = sheetTotals(rows), marked = s.status === 'marked';
      return h('details', { class: 'exam-attempt', open: s.id === want, id: `sub-${s.id}` },
        h('summary', {}, h('strong', {}, new Date(s.created_at).toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })),
          marked ? h('span', { class: 'score-pill' }, `${t.got} / ${t.max}`) : h('span', { class: 'badge' }, `Waiting for your tutor · simulator ${s.answers?.auto ?? '?'} / ${s.answers?.autoMax ?? '?'}`)),
        marked && s.comment ? h('blockquote', { class: 'comment' }, s.comment) : '',
        examSheet(rows));
    }));
    if (want) setTimeout(() => document.getElementById(`sub-${want}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };
  if (myExams) fill(myExams);
  else mySubmissions().then((all) => { myExams = all.filter((s) => s.lesson_id === lesson.id && s.exercise_id === ex.id); fill(myExams); }).catch(() => {});
  return box;
}

function examCard(ex) {
  return h('div', {},
    h('p', { class: 'muted' }, 'The desk starts zeroed with one condenser mic on wall box 1 (Input X = channel 1). Return the DAW on channel 5. When you finish, press End exam on the desk: you pass with 70% of the simulator blocks, and the whole sheet goes to your tutor, who can review any block and marks your general attitude. Everything else, from the stand to the coiled cable, is on the desk: the Live room and DAW tabs.'),
    lastExam ? h('p', {}, h('strong', {}, `Last attempt: ${lastExam.auto} / ${lastExam.autoMax} simulator blocks`), ` · ${lastExam.total} / ${lastExam.max} with tutor marks`) : '',
    h('button', { type: 'button', class: 'btn primary', onclick: () => openDesk(ex, 'desk.html?exam=1#exam') }, lastExam ? 'Take the exam again' : 'Start the exam'),
    attemptsBox(ex));
}

function openDesk(ex, url) {
  openTask = ex;
  $('#desktitle').textContent = ex.title;
  $('#desk').src = url; $('#deskpop').href = url;
  $('#deskwrap').hidden = false; $('#deskdone').hidden = true;
  $('#deskwrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function closeDesk(goNext = false) {
  const ex = openTask;
  $('#deskwrap').hidden = true; $('#desk').src = 'about:blank'; openTask = null;
  if (!goNext) return;
  if (lesson.zen) { document.querySelector('.zen-stage')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
  // Scroll to the next exercise not done yet, or to the lesson navigation when all are done.
  const i = lesson.exercises.indexOf(ex);
  const next = lesson.exercises.findIndex((e, k) => k > i && status()[e.id] !== 'passed');
  const target = next >= 0 ? document.querySelectorAll('#exercises .card.ex')[next] : $('#lesson-nav-bottom');
  target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
$('#deskclose').onclick = () => closeDesk(false);
$('#deskdone-btn').onclick = () => closeDesk(true);
// Done: a clear reminder above the desk to close it and carry on.
function deskDone(text) {
  const left = lesson.exercises.filter((e) => status()[e.id] !== 'passed').length;
  $('#deskdone-text').textContent = text + (left ? ` Close the desk to continue with the next exercise.` : ' That was the last one in this lesson: close the desk to continue.');
  $('#deskdone-btn').textContent = left ? 'Close the desk and continue →' : 'Close the desk: lesson complete';
  $('#deskdone').hidden = false;
  $('#deskdone').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

window.addEventListener('message', (e) => {
  if (e.origin !== location.origin || e.data?.source !== 'es-desk' || !openTask) return;
  const ex = openTask, d = e.data;
  if (d.type === 'close') { closeDesk(true); return; }
  // Maestro Zen takes XP for faults that would harm gear or ears (feedback, phantom power).
  if (d.type === 'fault' && (d.kind === 'feedback' || d.kind === 'phantom')) { awardXp(`fault-${d.kind}`, `${lesson.id}/${String(d.line || d.kind).replace(/[^a-z0-9-]/g, '')}`); return; }
  if (d.type === 'zen-fail' && lesson.zen) { zen.failed = true; zen.line = pick(WRONG); draw(); return; }
  if (d.type === 'task' && ex.kind === 'desk' && d.task === ex.task && lesson.zen) {
    zen.failed = false;
    const won = lesson.exercises.every((e) => e === ex || status()[e.id] === 'passed');
    zen.line = won ? WON : pick(PASSED);
    if (won) awardZen();
  }
  if (d.type === 'task' && ex.kind === 'desk' && d.task === ex.task) { mark(ex, 'desk-task', `${lesson.id}/${ex.task}`); deskDone(`✓ Done: ${ex.title}.`); }
  if (d.type === 'exam' && ex.kind === 'exam') {
    lastExam = { auto: d.auto, autoMax: d.autoMax, total: d.total, max: d.max, at: Date.now() };
    store.set(`es.exam.${lesson.id}`, lastExam);
    sendExam(ex, d);
    if (d.autoMax && d.auto / d.autoMax >= 0.7) {
      mark(ex, 'exam-pass', `${lesson.id}/exam`);
      if (d.auto === d.autoMax) awardXp('exam-perfect', `${lesson.id}/exam`);
      deskDone(`✓ Exam passed: ${d.auto} / ${d.autoMax} simulator blocks.`);
    } else { draw(); deskDone(`Exam ended: ${d.auto} / ${d.autoMax} simulator blocks (70% to pass). Have another go when you are ready.`); }
  }
});

// ---------- Maestro Zen's challenge: the same Master as in Music Theory, three gates on the desk ----------
const zen = { failed: false, line: '' };
function masterEl(small) { const m = h('div', { class: 'zen-master', 'aria-hidden': 'true' }); m.innerHTML = MASTER_SVG; return m; }
function zenStage() {
  const exs = lesson.exercises, st = status();
  const cur = exs.findIndex((e) => st[e.id] !== 'passed'); // -1: all three gates passed
  const master = masterEl(), words = h('blockquote', { class: 'zen-words', 'aria-live': 'polite' });
  const name = (e) => e.title.split(' · ')[1] || e.title;
  const gates = h('ol', { class: 'zen-gates', 'aria-label': 'The three gates' }, exs.map((e, i) => h('li', {
    class: `zen-gate${cur < 0 || i < cur ? ' passed' : ''}${i === cur ? ' current' : ''}${i === cur && zen.failed ? ' failed' : ''}`,
  }, h('span', { class: 'zen-gate-n' }, cur < 0 || i < cur ? '✓' : String(i + 1)), h('span', {}, name(e)))));
  const enter = (i, label, cls = 'btn primary') => h('button', { type: 'button', class: cls, onclick: () => openDesk(exs[i], `desk.html?task=${encodeURIComponent(exs[i].task)}#console`) }, label);
  const actions = h('div', { class: 'row wrap', id: 'zen-actions' },
    cur < 0 ? h('div', { class: 'zen-won' }, h('span', { class: 'zen-won-icon' }, '☯️'), h('div', {}, h('strong', {}, 'Zen Recording Master'), h('div', { class: 'muted small' }, 'All three gates passed.')))
      : enter(cur, zen.failed ? `Begin gate ${cur + 1} again` : `Enter gate ${cur + 1}: ${name(exs[cur])}`),
    ...(teacher ? exs.map((e, i) => enter(i, `Try gate ${i + 1}`, 'btn small ghost')) : []));
  const voice = h('label', { class: 'toggle small zen-voice' }, h('input', { type: 'checkbox', checked: voiceOn(), onchange: (e) => setVoice(e.target.checked) }), ' The Master speaks aloud');
  const card = h('section', { class: 'card zen-stage' }, master, h('div', { class: 'zen-talk' },
    h('p', { class: 'eyebrow' }, 'Maestro Zen, master of the studio'), words, gates, actions, voice));
  setTimeout(() => say(master, words, zen.line || (cur < 0 ? WON : INTRO)), 0);
  return card;
}

// Module 6 opens only when the work before it is done: requires 'all' (every exercise before this lesson) or a lesson id.
function missing() {
  if (!lesson.requires || teacher) return [];
  const all = courseLessons();
  const before = lesson.requires === 'all' ? all.slice(0, all.findIndex((l) => l.id === lesson.id)) : [findLesson(lesson.requires)].filter(Boolean);
  return before.filter((l) => l.exercises.length && lessonProgress(l).done < lessonProgress(l).total);
}
function draw() {
  const miss = missing();
  if (miss.length) {
    const m = masterEl(), w = h('p', { class: 'zen-words' });
    setTimeout(() => say(m, w, LOCKED), 0);
    $('#exercises').replaceChildren(h('section', { class: 'card zen-home' }, m, w), h('section', { class: 'card gate' }, h('h2', {}, '🔒 Not yet'),
      h('p', { class: 'muted' }, lesson.requires === 'all'
        ? 'Maestro Zen receives only those who have walked the whole path. Finish every exercise in the course first. Still to do:'
        : 'Pass the final test first. Maestro Zen does not open his door twice.'),
      h('ul', {}, miss.map((l) => h('li', {}, h('a', { href: `lesson.html?lesson=${encodeURIComponent(l.id)}` }, l.title), ` · ${lessonProgress(l).done} of ${lessonProgress(l).total} done`)))));
    return;
  }
  if (!lesson.exercises.length) {
    const st = status(); if (!st.watched) { st.watched = true; store.set(key, st); }
    $('#exercises').replaceChildren(h('div', { class: 'card' }, h('p', { class: 'muted' }, 'Exercises for this lesson are on the way. Watch the video, then carry on.')));
    return;
  }
  const note = teacher && (lesson.requires || lesson.exercises.some((e) => e.after))
    ? h('p', { class: 'muted small' }, 'Teacher preview: everything here is unlocked for you. Students must finish the course first, and pass each stage before the next.') : '';
  if (lesson.zen) { $('#exercises').replaceChildren(note, zenStage()); return; }
  $('#exercises').replaceChildren(note, ...lesson.exercises.map((ex, i) => {
    const done = status()[ex.id] === 'passed';
    return h('section', { class: `card ex ${done ? 'done' : ''}` },
      h('div', { class: 'ex-head' }, h('span', { class: 'eyebrow' }, `${i + 1} · ${{ quiz: 'Questions', desk: 'On the desk', exam: 'Exam' }[ex.kind]}`), h('span', { class: 'ex-state' }, done ? '✓ Done' : '')),
      h('h2', {}, ex.title),
      ex.kind === 'quiz' ? quizCard(ex) : ex.kind === 'desk' ? deskCard(ex) : examCard(ex));
  }));
}

// ---------- access: the Live room is free; the rest is for enrolled students ----------
async function gate() {
  if (FREE) { draw(); return; }
  const p = await myProfile().catch(() => null);
  teacher = p?.role === 'teacher';
  const isIn = p ? (teacher || await enrolled()) : null;
  if (isIn) { $('#gate').replaceChildren(); draw(); return; }
  $('#exercises').replaceChildren();
  if (!p) {
    $('#gate').replaceChildren(h('section', { class: 'card gate' }, h('h2', {}, 'Sign in to do this lesson'),
      h('p', { class: 'muted' }, 'The video is open to everyone. The tasks on the desk and the exam are for students in the course. Each Academy site remembers your sign-in separately, so sign in here once with the same email and password you use for Music Theory. New? Create your account with the class code from your teacher.'),
      h('a', { class: 'btn primary', href: `account.html?next=${encodeURIComponent(location.pathname.split('/').pop() + location.search)}` }, 'Sign in or create an account')));
    return;
  }
  const f = h('form', { class: 'row wrap' }, h('input', { name: 'code', required: true, placeholder: 'Class code', autocomplete: 'off', 'aria-label': 'Class code' }), h('button', { class: 'btn primary', type: 'submit' }, 'Join the course'), h('span', { class: 'status', role: 'status' }));
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    try { const c = await joinCourse(f.code.value.trim()); if (c !== COURSE.id) { f.querySelector('.status').textContent = 'That code is for another course.'; return; } toast('Welcome to the Recording course!'); gate(); }
    catch (err) { f.querySelector('.status').textContent = err.message; }
  });
  $('#gate').replaceChildren(h('section', { class: 'card gate' }, h('h2', {}, 'Join the Recording course'),
    h('p', { class: 'muted' }, 'You are signed in, but not in this course yet. Enter the class code from your teacher.'), f));
}

renderAccountWidget($('#account-widget'));
gate();
