// The signal flow exam as the tutor marks it: one row per block, grouped by question (MarkingSheet_Template).
// The desk sends every block (checks); the tutor confirms or changes the simulator's scores and marks the
// tutor blocks; the marked sheet is saved as scores: [{q, name, by, score, max: 1}].

import { h } from './util.js?v=202611210112';

const QTITLE = {
  Q1: 'Mic on a boom stand, patched to Input X; headphones for the musician', Q2: 'Mic signal into the console and on to the DAW; meter off-bus',
  Q3: 'New DAW project, mono track; meter the input; return it to channel 5; meter off-tape', Q4: 'Off-tape signal to the MIX bus; meter and monitor it',
  Q5: 'Stereo cue mix with the mic signal to the live room; meter and monitor it', Q6: 'DAW click to the cue mix only; meter and monitor the cue',
  Q7: 'Record at least one pass while confidence monitoring', Q8: 'Save and close; neutralise the console', Q9: 'Pack up the live room', All: 'Throughout',
};
const OPTS = [1, 0.5, 0];
const fmt = (v) => (v === null || v === undefined ? '—' : String(v));

/** The rows to show: the tutor's marks if marked, else what the desk sent. */
export function sheetRows(sub) {
  const blocks = Array.isArray(sub.checks) ? sub.checks : [];
  const marked = sub.status === 'marked' && Array.isArray(sub.scores) ? sub.scores : null;
  return blocks.map((b, i) => ({ ...b, sim: b.score, score: marked ? marked[i]?.score ?? null : b.score }));
}

export function sheetTotals(rows) {
  const got = rows.reduce((a, r) => a + (Number(r.score) || 0), 0);
  const left = rows.filter((r) => r.score === null || r.score === undefined).length;
  return { got, max: rows.length, left };
}

/** editable: the tutor's view, with 1 / 0.5 / 0 buttons on every block. onChange(rows) after each change. */
export function examSheet(rows, { editable = false, onChange = () => {} } = {}) {
  const box = h('div', { class: 'exsheet' });
  const draw = () => {
    const groups = [];
    rows.forEach((r, i) => {
      let g = groups.find((x) => x.q === r.q);
      if (!g) { g = { q: r.q, rows: [] }; groups.push(g); }
      g.rows.push([r, i]);
    });
    box.replaceChildren(...groups.map((g) => h('section', { class: 'exq' },
      h('h3', {}, `${g.q} · ${QTITLE[g.q] || ''}`),
      ...g.rows.map(([r, i]) => h('div', { class: `exr ${r.by}` },
        h('span', { class: 'exn' }, r.name, r.by === 'tutor' ? h('span', { class: 'muted small' }, ' · tutor') : ''),
        editable
          ? h('span', { class: 'exbtns', role: 'group', 'aria-label': `Score for ${r.name}` }, OPTS.map((v) => h('button', {
            type: 'button', class: `sc s${String(v).replace('.', '')}${r.score === v ? ' on' : ''}`, 'aria-pressed': String(r.score === v),
            onclick: () => { r.score = r.score === v ? null : v; draw(); onChange(rows); },
          }, String(v))))
          : h('span', { class: `sc s${String(r.score).replace('.', '')}` }, fmt(r.score)),
        h('span', { class: 'muted small why' }, r.by === 'sim' && editable && r.sim !== r.score ? `simulator: ${fmt(r.sim)}${r.why ? ` · ${r.why}` : ''}` : r.why || ''))))));
  };
  draw();
  return box;
}
