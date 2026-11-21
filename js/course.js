// The Recording course: modules in order, each listing lesson ids from js/lessons.js.

import { LESSONS, findLesson } from './lessons.js?v=202611210034';
import { store } from './util.js?v=202611210034';

export const COURSE = {
  id: 'recording',
  academy: 'Everything Sound Academy',
  title: 'Recording and Signal Flow',
  intro:
    'From the live room to the control room and back: set up mics and cables, gain stage, meter at every stage, record into Pro Tools, build cue mixes, and find faults fast. Each lesson has a short video and tasks you do on a simulator laid out like the SSL AWS 900.',
  chatChannels: [
    { id: 'course:announcements', name: 'Announcements', icon: '📢', about: 'News and tips from your teacher, for all courses.', teacherOnly: true },
    { id: 'course:rec-general', name: 'General', icon: '#', about: 'Say hello, ask anything about the studio.' },
    { id: 'course:rec-signal-flow', name: 'Signal flow Q&A', icon: '#', about: 'Questions about the desk, the patchbay, cues and the exam.' },
  ],
  modules: [
    { title: 'The live room', intro: 'Cables, stands, mics, the tie box and talking between rooms: everything before the signal reaches the desk.',
      lessons: ['rec-01-cables', 'rec-02-stands-mics', 'rec-03-tie-box'] },
    { title: 'Control room signal flow', intro: 'Gain staging, the four metering stages, Pro Tools in and out, confidence monitoring, cues, foldback, the patchbay and the exam.',
      lessons: ['rec-04-gain-staging', 'rec-05-metering', 'rec-06-pro-tools', 'rec-07-troubleshooting', 'rec-08-cues', 'rec-09-patchbay', 'rec-10-exam'] },
    { title: 'Microphones', intro: 'Mic types, the classics, polar patterns, stereo techniques and drum set-ups. Exercises with the mic simulator are on the way.',
      lessons: ['rec-11-mics', 'rec-12-polar', 'rec-13-stereo', 'rec-14-drums'] },
    { title: 'Pro Tools', intro: 'Basic operations, guide tracks, editing, comping, templates and automation.',
      lessons: ['rec-15-pt-basics', 'rec-16-guide', 'rec-17-edits', 'rec-18-comping', 'rec-19-template'] },
    { title: 'Mixing on the console', intro: 'Dynamics and EQ on the desk, outboard reverb and compression, printing and exporting the mix.',
      lessons: ['rec-20-dyn-eq', 'rec-21-outboard', 'rec-22-print', 'rec-23-atmos'] },
    { title: 'The Zen Master', intro: 'The final test, then the three-stage challenge of Maestro Zen. Opens when every exercise before it is done.',
      lessons: ['rec-24-final', 'rec-25-zen'] },
  ],
  // Level names for this course's own XP (parallel to Music Theory's).
  levels: [
    { xp: 0, name: 'Runner' }, { xp: 100, name: 'Cable coiler' }, { xp: 250, name: 'Tape op' }, { xp: 450, name: 'Assistant engineer' },
    { xp: 700, name: 'Second engineer' }, { xp: 1000, name: 'Recording engineer' }, { xp: 1400, name: 'Mix engineer' },
    { xp: 1900, name: 'Chief engineer' }, { xp: 2500, name: 'Producer' }, { xp: 3200, name: 'Studio manager' }, { xp: 4000, name: 'Studio legend' },
  ],
};

export function courseLessons() {
  return COURSE.modules.flatMap((m) => m.lessons.map(findLesson).filter(Boolean));
}

export function lessonNeighbours(id) {
  const all = courseLessons();
  const i = all.findIndex((l) => l.id === id);
  return { index: i, total: all.length, prev: i > 0 ? all[i - 1] : null, next: i >= 0 && i < all.length - 1 ? all[i + 1] : null };
}

/** Progress of one lesson on this device. A video-only lesson counts as done once it has been opened. */
export function lessonProgress(lesson) {
  const status = store.get(`es.status.${lesson.id}`, {});
  if (!lesson.exercises.length) { const seen = !!status.watched; return { total: 1, done: seen ? 1 : 0, started: seen }; }
  const total = lesson.exercises.length;
  const done = lesson.exercises.filter((e) => status[e.id] === 'passed' || status[e.id] === 'submitted').length;
  const started = lesson.exercises.some((e) => status[e.id]);
  return { total, done, started };
}

export { LESSONS };
