// A Recording lesson: the video, then its exercises (questions, desk tasks or the exam).
// Desk tasks and the exam run in desk.html inside the page; the desk tells us when they're done.

import { COURSE, courseLessons, lessonNeighbours, lessonProgress } from './course.js?v=202611200125';
import { findLesson } from './lessons.js?v=202611200125';
import { h, store, toast } from './util.js?v=202611200125';
import { awardXp, enrolled, joinCourse, myProfile, renderAccountWidget, saveProgress } from './auth.js?v=202611200125';

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
    form.querySelector('.qres').textContent = right === ex.questions.length ? 'All right!' : `${right} of ${ex.questions.length} right. Watch the part again and have another go.`;
    if (right === ex.questions.length) mark(ex, 'passed', `${lesson.id}/${ex.id}`);
  });
  return form;
}

function deskCard(ex) {
  const open = () => openDesk(ex, `desk.html?task=${encodeURIComponent(ex.task)}#console`);
  return h('div', { class: 'row wrap' },
    h('button', { type: 'button', class: 'btn primary', onclick: open }, status()[ex.id] === 'passed' ? 'Do it again on the desk' : 'Open on the desk'),
    ex.at != null || ex.v != null ? watchPart(ex.at, ex.v || 0) : '');
}

let lastExam = store.get(`es.exam.${lesson.id}`, null);
function examCard(ex) {
  return h('div', {},
    h('p', { class: 'muted' }, 'The desk starts zeroed with one condenser mic on wall box 1 (Input X = channel 1). Return the DAW on channel 5. When you finish, press End exam on the desk: you pass with 70% of the simulator blocks. Your tutor marks the blocks the simulator can’t see.'),
    lastExam ? h('p', {}, h('strong', {}, `Last attempt: ${lastExam.auto} / ${lastExam.autoMax} simulator blocks`), ` · ${lastExam.total} / ${lastExam.max} with tutor marks`) : '',
    h('button', { type: 'button', class: 'btn primary', onclick: () => openDesk(ex, 'desk.html?exam=1#exam') }, lastExam ? 'Take the exam again' : 'Start the exam'));
}

function openDesk(ex, url) {
  openTask = ex;
  $('#desktitle').textContent = ex.title;
  $('#desk').src = url; $('#deskpop').href = url;
  $('#deskwrap').hidden = false;
  $('#deskwrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
$('#deskclose').onclick = () => { $('#deskwrap').hidden = true; $('#desk').src = 'about:blank'; openTask = null; };

window.addEventListener('message', (e) => {
  if (e.origin !== location.origin || e.data?.source !== 'es-desk' || !openTask) return;
  const ex = openTask, d = e.data;
  if (d.type === 'task' && ex.kind === 'desk' && d.task === ex.task) { toast(`Done: ${ex.title}`); mark(ex, 'desk-task', `${lesson.id}/${ex.task}`); }
  if (d.type === 'exam' && ex.kind === 'exam') {
    lastExam = { auto: d.auto, autoMax: d.autoMax, total: d.total, max: d.max, at: Date.now() };
    store.set(`es.exam.${lesson.id}`, lastExam);
    if (d.autoMax && d.auto / d.autoMax >= 0.7) {
      mark(ex, 'exam-pass', `${lesson.id}/exam`);
      if (d.auto === d.autoMax) awardXp('exam-perfect', `${lesson.id}/exam`);
    } else draw();
  }
});

function draw() {
  if (!lesson.exercises.length) {
    const st = status(); if (!st.watched) { st.watched = true; store.set(key, st); }
    $('#exercises').replaceChildren(h('div', { class: 'card' }, h('p', { class: 'muted' }, 'Exercises for this lesson are on the way. Watch the video, then carry on.')));
    return;
  }
  $('#exercises').replaceChildren(...lesson.exercises.map((ex, i) => {
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
  const isIn = p ? await enrolled() : null;
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
