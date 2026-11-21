// The tutor's exam Inbox: finished signal flow exams, marked block by block (1 / 0.5 / 0).

import { getSubmission, inbox, myProfile, renderAccountWidget, saveFeedback } from './auth.js?v=202611210115';
import { examSheet, sheetRows, sheetTotals } from './examsheet.js?v=202611210115';
import { h, toast } from './util.js?v=202611210115';

const $ = (s) => document.querySelector(s);
const when = (d) => new Date(d).toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
let subs = [];

async function load() {
  $('#list').replaceChildren(h('p', { class: 'muted' }, 'Loading…'));
  try { subs = (await inbox()).filter((s) => Array.isArray(s.checks)); }
  catch (err) { $('#list').replaceChildren(h('p', { class: 'warn' }, `Couldn’t load the exams: ${err.message}`)); return; }
  drawList();
}

function drawList() {
  const only = $('#only-waiting').checked;
  const show = subs.filter((s) => !only || s.status !== 'marked');
  $('#list').replaceChildren(h('h2', {}, only ? `Waiting for marks (${show.length})` : `All exams (${show.length})`),
    show.length ? h('ul', { class: 'sub-list' }, show.map((s) => h('li', {}, h('button', { type: 'button', class: 'btn small ghost', onclick: () => open(s.id) },
      h('strong', {}, s.student?.full_name || 'Student'), ` · ${when(s.created_at)} · `,
      s.status === 'marked' ? `marked ${sheetTotals(sheetRows(s)).got} / ${s.checks.length}` : `simulator ${s.answers?.auto ?? '?'} / ${s.answers?.autoMax ?? '?'}`))))
      : h('p', { class: 'muted' }, only ? 'Nothing waiting. 🎉' : 'No exams yet.'));
}

async function open(id) {
  let s;
  try { s = await getSubmission(id); } catch (err) { toast(err.message); return; }
  const rows = sheetRows(s);
  const total = h('strong', {});
  const upd = () => { const t = sheetTotals(rows); total.textContent = `${t.got} / ${t.max}${t.left ? ` · ${t.left} block${t.left > 1 ? 's' : ''} not marked yet` : ''}`; };
  const comment = h('textarea', { rows: 3, placeholder: 'A comment for the student (optional)', 'aria-label': 'Comment' }, s.comment || '');
  const save = h('button', { type: 'button', class: 'btn primary', onclick: async () => {
    const t = sheetTotals(rows);
    if (t.left && !confirmLeft(t.left)) return;
    save.disabled = true;
    try {
      await saveFeedback(s.id, { scores: rows.map((r) => ({ q: r.q, name: r.name, by: r.by, score: r.score ?? 0, max: 1 })), comment: comment.value.trim() });
      toast('Marks saved. The student can see them now.');
      const i = subs.findIndex((x) => x.id === s.id); if (i >= 0) subs[i] = { ...subs[i], status: 'marked', scores: rows.map((r) => ({ score: r.score ?? 0 })) };
      drawList(); $('#detail').replaceChildren();
    } catch (err) { toast(err.message); }
    finally { save.disabled = false; }
  } }, s.status === 'marked' ? 'Save changes' : 'Save marks');
  upd();
  $('#detail').replaceChildren(h('section', { class: 'card mark-exam' },
    h('h2', {}, `${s.student?.full_name || 'Student'} · ${s.exercise_title || 'Signal flow exam'}`),
    h('p', { class: 'muted' }, `Sent ${when(s.created_at)} · simulator ${s.answers?.auto ?? '?'} / ${s.answers?.autoMax ?? '?'}${s.status === 'marked' ? ` · marked ${when(s.marked_at)}` : ''}. Click a score to set it; click it again to clear it. Unmarked blocks count as 0.`),
    h('div', { class: 'mark-bar' }, h('span', {}, 'Total ', total), save),
    examSheet(rows, { editable: true, onChange: upd }),
    comment,
  ));
  $('#detail').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// The page has no browser dialogs to rely on: ask once inline by pressing Save again.
let warned = 0;
function confirmLeft(n) {
  if (warned === n) { warned = 0; return true; }
  warned = n; toast(`${n} block${n > 1 ? 's are' : ' is'} not marked: they will count as 0. Press Save again to save anyway.`); return false;
}

async function start() {
  renderAccountWidget($('#account-widget'));
  const p = await myProfile().catch(() => null);
  if (!p || p.role !== 'teacher') {
    $('#list').replaceChildren(h('p', {}, p ? 'Only the teacher account can mark exams.' : 'Sign in with your teacher account to see the exams.'),
      p ? '' : h('a', { class: 'btn primary', href: 'account.html?next=mark.html' }, 'Sign in'));
    return;
  }
  $('#only-waiting').addEventListener('change', drawList);
  $('#refresh').addEventListener('click', load);
  await load();
  const id = new URLSearchParams(location.search).get('id');
  if (id) open(id);
}
start();
