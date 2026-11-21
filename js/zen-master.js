// Maestro Zen, the same Master as in Music Theory: the figure, his slow low voice and his few heavy words.

import { store } from './util.js?v=202611210134';

export const MASTER_SVG = `<svg viewBox="0 0 160 160" role="img" aria-label="Maestro Zen">
  <circle class="zm-aura" cx="80" cy="78" r="70"/>
  <path class="zm-robe" d="M20 150 C 24 104, 50 88, 80 88 C 110 88, 136 104, 140 150 Z"/>
  <path class="zm-robe-fold" d="M80 92 L 66 150 M80 92 L 98 150"/>
  <ellipse class="zm-hands" cx="80" cy="128" rx="20" ry="7"/>
  <circle class="zm-head" cx="80" cy="58" r="26"/>
  <ellipse class="zm-ear" cx="54" cy="60" rx="4" ry="7"/><ellipse class="zm-ear" cx="106" cy="60" rx="4" ry="7"/>
  <path class="zm-brow" d="M62 50 q 8 -6 15 0 M83 50 q 7 -6 15 0"/>
  <path class="zm-brow-long" d="M62 50 q -8 2 -12 12 M98 50 q 8 2 12 12"/>
  <path class="zm-eye" d="M65 58 q 6 4 11 0 M84 58 q 6 4 11 0"/>
  <path class="zm-beard" d="M62 70 C 64 96, 96 96, 98 70 C 92 80, 68 80, 62 70 Z"/>
  <path class="zm-moustache" d="M68 70 q 12 -6 24 0"/>
  <ellipse class="zm-mouth" cx="80" cy="76" rx="4" ry="1"/>
</svg>`;

export const voiceOn = () => store.get('es.zen.voice', true);
export const setVoice = (on) => { store.set('es.zen.voice', on); if (!on) window.speechSynthesis?.cancel(); };

function lowVoice() {
  const vs = (window.speechSynthesis?.getVoices() || []).filter((v) => /^en/i.test(v.lang));
  return vs.find((v) => /daniel|fred|alex|male|google uk english male|arthur|aaron|ralph/i.test(v.name)) || vs[0] || null;
}

/** The Master speaks: words in the bubble and, if allowed, a slow, low voice. */
export function say(master, words, text) {
  words.textContent = text;
  words.classList.remove('in'); void words.offsetWidth; words.classList.add('in');
  master.classList.add('speaking');
  const stop = () => master.classList.remove('speaking');
  if (voiceOn() && window.speechSynthesis && window.SpeechSynthesisUtterance) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.pitch = 0.1; u.rate = 0.72;
    const v = lowVoice(); if (v) u.voice = v;
    u.onend = stop; u.onerror = stop;
    speechSynthesis.speak(u);
    setTimeout(stop, 600 + text.length * 90);
  } else setTimeout(stop, 400 + text.length * 45);
}

export const pick = (a) => a[Math.floor(Math.random() * a.length)];
export const WRONG = [
  'No.', 'Hmm. No.', 'Still more to learn. Much more.',
  'The cable remembers. So do I.', 'Forty-eight volts. Zero patience.',
  'You listened to what you sent. Listen to what returns.',
  'Silence would have been more correct.', 'Even the click is disappointed.',
  'Your ears are open. Your mind is on holiday.', 'Empty your cup. Then come back.',
  'Fall seven times. Patch it right the eighth.', 'Wrong. But wrong with conviction. That is something.',
];
export const PASSED = ['Good. Do not smile yet.', 'The gate opens. Breathe.', 'Acceptable. The next gate is heavier.'];
export const INTRO = 'Three gates. No hints. One mistake, and the gate closes.';
export const LOCKED = 'The cup is not yet full. Finish every exercise. Then come.';
export const WON = 'There is nothing left for me to teach you. Go. Record someone else.';
