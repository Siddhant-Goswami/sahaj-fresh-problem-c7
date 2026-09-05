/* ============================================================
   Assignment 03 workbook — player, gates, stage benches.
   ============================================================ */

/* ---------------- tiny helpers ---------------- */

const $  = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}
function ic(name) { return '<i data-lucide="' + name + '"></i>'; }
function icons() { if (window.lucide) window.lucide.createIcons(); }

let toastT;
function toast(msg, kind) {
  const t = $('#toast');
  t.className = 'toast show' + (kind ? ' ' + kind : '');
  t.innerHTML = ic(kind === 'good' ? 'check-circle-2' : kind === 'bad' ? 'alert-circle' : 'info') +
                '<span>' + esc(msg) + '</span>';
  icons();
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), kind === 'bad' ? 6000 : 3400);
}

/* ---- markdown, enough of it for the corpus ----
   Escape first, then build markup, so document text can never inject. */

function mdInline(s) {
  return s
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*([^*\n]+)\*(?![*\w])/g, '$1<em>$2</em>')
    .replace(/(^|[^_\w])_([^_\n]+)_(?![_\w])/g, '$1<em>$2</em>');
}
function mdRow(l) {
  return l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
}
function mdToHtml(src) {
  const L = esc(src).split('\n');
  const out = [];
  const isBreak = l =>
    /^\s*(#{1,6})\s/.test(l) || /^\s*&gt;/.test(l) || /^\s*\|/.test(l) ||
    /^\s*(---+|\*\*\*+)\s*$/.test(l) || /^\s*([-*+]|\d+\.)\s+/.test(l);
  let i = 0;

  while (i < L.length) {
    const l = L[i];

    // table: a pipe row followed by a separator row
    if (/^\s*\|/.test(l) && i + 1 < L.length && /^\s*\|[\s:|-]+\|?\s*$/.test(L[i + 1])) {
      const head = mdRow(l);
      i += 2;
      const body = [];
      while (i < L.length && /^\s*\|/.test(L[i])) { body.push(mdRow(L[i])); i++; }
      out.push('<table class="mdt"><thead><tr>' + head.map(c => '<th>' + mdInline(c) + '</th>').join('') +
        '</tr></thead><tbody>' + body.map(r => '<tr>' + r.map(c => '<td>' + mdInline(c) + '</td>').join('') + '</tr>').join('') +
        '</tbody></table>');
      continue;
    }

    const h = l.match(/^\s*(#{1,6})\s+(.*)$/);
    if (h) { const n = h[1].length; out.push('<h' + n + '>' + mdInline(h[2]) + '</h' + n + '>'); i++; continue; }

    if (/^\s*(---+|\*\*\*+)\s*$/.test(l)) { out.push('<hr>'); i++; continue; }

    if (/^\s*&gt;/.test(l)) {
      const buf = [];
      while (i < L.length && /^\s*&gt;/.test(L[i])) { buf.push(L[i].replace(/^\s*&gt;\s?/, '')); i++; }
      out.push('<blockquote>' + mdBlocks(buf) + '</blockquote>');
      continue;
    }

    if (/^\s*([-*+]|\d+\.)\s+/.test(l)) {
      const ord = /^\s*\d+\./.test(l);
      const items = [];
      while (i < L.length && /^\s*([-*+]|\d+\.)\s+/.test(L[i])) {
        items.push(L[i].replace(/^\s*([-*+]|\d+\.)\s+/, '')); i++;
      }
      const t = ord ? 'ol' : 'ul';
      out.push('<' + t + '>' + items.map(x => '<li>' + mdInline(x) + '</li>').join('') + '</' + t + '>');
      continue;
    }

    if (!l.trim()) { i++; continue; }

    const para = [];
    while (i < L.length && L[i].trim() && !isBreak(L[i])) { para.push(L[i]); i++; }
    if (para.length) out.push('<p>' + mdInline(para.join('<br>')) + '</p>');
    else i++;
  }
  return out.join('\n');
}
function mdBlocks(arr) {
  // re-run the block parser over already-escaped lines (used inside blockquotes)
  const html = mdToHtml(arr.join('\n')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
  return html;
}

/* Wrap search hits in <mark> without touching markup: text nodes only. */
function markHits(root, q) {
  if (!q) return;
  const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walk.nextNode()) nodes.push(walk.currentNode);
  nodes.forEach(n => {
    const v = n.nodeValue;
    re.lastIndex = 0;
    if (!re.test(v)) return;
    re.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let last = 0, m;
    while ((m = re.exec(v))) {
      if (m.index > last) frag.appendChild(document.createTextNode(v.slice(last, m.index)));
      const mk = document.createElement('mark');
      mk.textContent = m[0];
      frag.appendChild(mk);
      last = m.index + m[0].length;
      if (m[0].length === 0) re.lastIndex++;
    }
    if (last < v.length) frag.appendChild(document.createTextNode(v.slice(last)));
    n.parentNode.replaceChild(frag, n);
  });
}

const nz = s => String(s == null ? '' : s).trim().length > 0;
const lines = s => String(s || '').split('\n').map(x => x.trim()).filter(Boolean);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = (n, d) => Number(n).toLocaleString('en-IN', { minimumFractionDigits: d == null ? 0 : d, maximumFractionDigits: d == null ? 0 : d });

/* ---------------- state ---------------- */

const SKEY = 'sf_a03_v1';

function blankCase(i) {
  return {
    id: 'C' + String(i + 1).padStart(2, '0'),
    src: '', cls: '',
    input: '',
    exp: { condition: '', route: '', escalate: 'false' },
    out: null,      // parsed contract
    raw: '',        // model reply verbatim
    err: '',
  };
}

function defaultState() {
  return {
    v: 1,
    pos: 0,
    maxReached: 0,
    provider: 'groq', key: '', model: '',
    timers: {},
    s1: { qs: Array.from({ length: Q_TARGET }, () => ({ q: '', a: '' })),
          who: '', what: '', where: '', nums: '', obs: '' },
    s2: { baseline: '', src: '', hyp: '', fals: '', test: '' },
    s3: { pitch: '', verdict: '', signoff: '', at: '', pushback: '' },
    s4: { input: '', output: '', steps: [] },
    s5: {
      prompt: '',
      cases: Array.from({ length: CASE_TARGET }, (_, i) => blankCase(i)),
      grader: {
        route: true, escalate: true, mode: 'keyword-output',
        kw: { warm: 'warm, hot', sour: 'sour', watery: 'watery, loose, separated', other: '', none: '' },
      },
      ran: false,
      labels: {},        // caseId -> 'y' | 'n'  (student's blind hand label)
      labelsDone: false,
      whyNot: '',
    },
    s6: {
      exploitTicket: '', exploitOut: '', exp: { condition: '', route: '', escalate: 'false' },
      graderSaid: null, humanWrong: null,
      // The verdict the grader gave at the moment the exploit was tested, frozen.
      // Rewriting the grader is the point of this stage; it must not overwrite
      // the evidence that made the rewrite necessary.
      exploitVerdict: null,
      rewrite: '', before: null, after: null,
      hidden: { ran: false, pass: 0, total: 0, rows: [] },
      hiddenBefore: null,
    },
    s7: { guards: GUARD_SLOTS.map(g => ({ id: g.id, name: '', rule: '', cat: '', fp: '', testId: '', testFired: null, testNote: '' })) },
    s8: { volume: DEFAULT_VOLUME, days: 30, pin: null, pout: null, fx: DEFAULT_FX, prefix: null, five: '' },
    ledger: [],
    fac: false,
  };
}

let S = defaultState();
let FAC = null;   // deciphered facilitator pack, when unlocked

function save() { try { localStorage.setItem(SKEY, JSON.stringify(S)); } catch (e) {} }
function load() {
  try {
    const raw = localStorage.getItem(SKEY);
    if (!raw) return;
    const o = JSON.parse(raw);
    if (o && o.v === 1) S = Object.assign(defaultState(), o);
    // Sign-offs saved before the date fix carry the wall clock, which reads
    // wrong inside a role-play set on ROLE_DATE. Move it, keep the real one.
    if (S.s3 && S.s3.at && S.s3.at !== ROLE_DATE) {
      S.s3.realAt = S.s3.realAt || S.s3.at;
      S.s3.at = ROLE_DATE;
    }
    // Exploits confirmed before the verdict was frozen kept only the boolean.
    // Keep the record rather than re-grading it against a grader since rewritten.
    if (S.s6 && S.s6.graderSaid === true && !S.s6.exploitVerdict) {
      S.s6.exploitVerdict = { pass: true, checks: [], grader: null };
    }
  } catch (e) {}
}

/* ---------------- gates ---------------- */

function s1Obs() {
  const a = S.s1;
  return [a.who, a.what, a.where, a.nums].map(x => String(x || '').trim()).join(' ');
}
function hasNumber(s) { return /\d/.test(String(s || '')); }
function solutionWordsIn(s) {
  const t = ' ' + String(s || '').toLowerCase() + ' ';
  return SOLUTION_WORDS.filter(w => t.includes(' ' + w) || t.includes(w + ' '));
}

function caseFilled(c) { return nz(c.input) && nz(c.exp.condition); }
function casesFilled() { return S.s5.cases.filter(caseFilled).length; }
function ranCount() { return S.s5.cases.filter(c => c.out || c.err).length; }

function gradeCase(c) {
  // Returns { checks: [{name, pass, note}], pass: bool } or null if not run.
  if (!c.out) return null;
  const g = S.s5.grader, checks = [];

  if (g.route) {
    const e = (c.exp.route || '').trim().toUpperCase() || null;
    const a = c.out.route || null;
    checks.push({ name: 'route', pass: e === a, note: (e || 'null') + ' vs ' + (a || 'null') });
  }
  if (g.escalate) {
    const e = String(c.exp.escalate) === 'true';
    const a = !!c.out.escalate;
    checks.push({ name: 'escalate', pass: e === a, note: e + ' vs ' + a });
  }

  const expc = (c.exp.condition || '').toLowerCase().trim();
  if (g.mode === 'exact') {
    checks.push({ name: 'label', pass: expc === (c.out.condition || ''), note: expc + ' vs ' + (c.out.condition || 'null') });
  } else if (g.mode === 'keyword-output') {
    const terms = kwTerms(g.kw[expc]);
    const hay = String(c.raw || '').toLowerCase();
    const hit = terms.length === 0 ? true : terms.some(t => hay.includes(t));
    checks.push({ name: 'label', pass: hit, note: terms.length ? 'looked for [' + terms.join(', ') + '] in the reply' : 'no keywords set for "' + (expc || '?') + '", so this check cannot fail' });
  } else { // keyword-input
    const derived = deriveFromInput(c.input, g.kw);
    checks.push({ name: 'label', pass: derived === (c.out.condition || null), note: 'ticket text reads as "' + (derived || 'none') + '", model said "' + (c.out.condition || 'null') + '"' });
  }
  return { checks, pass: checks.every(x => x.pass) };
}

function kwTerms(s) {
  return String(s || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
}
function deriveFromInput(text, kw) {
  const hay = String(text || '').toLowerCase();
  for (const label of ['warm', 'sour', 'watery']) {
    if (kwTerms(kw[label]).some(t => hay.includes(t))) return label;
  }
  return 'other';
}

function ownPassRate() {
  // A call that failed is a case that did not pass, not a case that does not
  // exist. Dividing by the ones that came back turns a rate limit into a
  // flattering number, and stage 6 then compares that flattery to the hidden
  // set, which does count its failures. Same denominator on both sides.
  const attempted = S.s5.cases.filter(c => c.out || nz(c.err));
  if (!attempted.length) return null;
  const p = attempted.filter(c => { const g = gradeCase(c); return g && g.pass; }).length;
  return { pass: p, total: attempted.length };
}

function agreement() {
  const ids = Object.keys(S.s5.labels);
  if (!ids.length) return null;
  let agree = 0, n = 0;
  ids.forEach(id => {
    const c = S.s5.cases.find(x => x.id === id);
    if (!c || !c.out) return;
    const g = gradeCase(c);
    if (!g) return;
    n++;
    const human = S.s5.labels[id] === 'y';
    if (human === g.pass) agree++;
  });
  return { agree, n };
}

function guardReady(g) { return nz(g.name) && nz(g.rule) && nz(g.cat) && nz(g.fp) && g.testFired !== null; }

function s5Tokens() {
  const rows = S.ledger.filter(e => e.stage === 's5' && e.purpose === 'case');
  return Ledger.mean(rows);
}

const GATES = {
  brief: () => ({ ok: true, why: 'Read the brief, then start the clock on stage 1.' }),

  s1: () => {
    const a = S.s1;
    const filled = a.qs.filter(q => nz(q.q)).length;
    if (filled < Q_TARGET) return { ok: false, why: 'Write all ' + Q_TARGET + ' questions. ' + filled + ' so far.' };
    if (!nz(a.who) || !nz(a.what) || !nz(a.where) || !nz(a.nums))
      return { ok: false, why: 'The observation needs all four parts: who, what breaks, where, in numbers.' };
    if (!hasNumber(a.nums)) return { ok: false, why: 'The numbers field has no number in it.' };
    const bad = solutionWordsIn(s1Obs());
    if (bad.length) return { ok: false, why: 'The observation names a solution (' + bad.slice(0, 3).join(', ') + '). Stage 1 is the problem only.' };
    return { ok: true, why: Q_TARGET + ' questions and an observation with a number in it.' };
  },

  s2: () => {
    const a = S.s2;
    const miss = [['baseline', a.baseline], ['hypothesis', a.hyp], ['falsifier', a.fals], ['manual test', a.test]]
      .filter(p => !nz(p[1])).map(p => p[0]);
    if (miss.length) return { ok: false, why: 'Still missing: ' + miss.join(', ') + '.' };
    if (!hasNumber(a.baseline)) return { ok: false, why: 'A baseline without a number is not a baseline.' };
    return { ok: true, why: 'Baseline, hypothesis, falsifier and a test the client would accept.' };
  },

  s3: () => {
    if (!nz(S.s3.pitch)) return { ok: false, why: 'Write the pitch before you take it to the client.' };
    if (S.s3.verdict !== 'yes') return { ok: false, why: 'No design work until the client signs off. Record the verdict.' };
    if (!nz(S.s3.signoff)) return { ok: false, why: 'Sign-off has to be in writing. Type what the client actually said.' };
    return { ok: true, why: 'Signed off ' + (S.s3.at || '') + '.' };
  },

  s4: () => {
    const a = S.s4;
    if (!nz(a.input) || !nz(a.output)) return { ok: false, why: 'Name the input and the output first.' };
    if (a.steps.length < 3) return { ok: false, why: 'A process with fewer than three steps is a wish. ' + a.steps.length + ' so far.' };
    if (a.steps.some(s => !nz(s.name))) return { ok: false, why: 'Every step needs a name.' };
    const unjust = a.steps.filter(s => s.kind === 'model' && !nz(s.why));
    if (unjust.length) return { ok: false, why: unjust.length + ' probabilistic step(s) with no reason deterministic could not do it.' };
    return { ok: true, why: 'Every probabilistic step is justified.' };
  },

  s5: () => {
    const n = casesFilled();
    if (n < CASE_TARGET) return { ok: false, why: n + ' of ' + CASE_TARGET + ' cases have an input and an expected condition.' };
    if (!nz(S.s5.prompt)) return { ok: false, why: 'Write the prompt for your model step.' };
    if (ranCount() < CASE_TARGET) {
      // Distinguish "not run yet" from "the provider refused", or a rate limit
      // reads as a prompt failure and the student rewrites a prompt that was fine.
      const failed = S.s5.cases.filter(c => nz(c.input) && !c.out && nz(c.err)).length;
      return { ok: false, why: 'Run the cases. ' + ranCount() + ' of ' + CASE_TARGET + ' have output' +
        (failed ? ', and ' + failed + ' call(s) came back with an error. Read the error on the case before you touch the prompt — it may be the provider.' : '.') };
    }
    const ag = agreement();
    if (!ag || ag.n < LABEL_TARGET) return { ok: false, why: 'Hand-label ' + LABEL_TARGET + ' outputs. ' + (ag ? ag.n : 0) + ' done.' };
    if (ag.agree < AGREE_TARGET && !nz(S.s5.whyNot))
      return { ok: false, why: 'Grader agrees with you ' + ag.agree + ' of ' + ag.n + '. Get to ' + AGREE_TARGET + ', or write why not.' };
    const errored = S.s5.cases.filter(c => nz(c.input) && !c.out && nz(c.err)).length;
    return { ok: true, why: 'Grader agrees ' + ag.agree + ' of ' + ag.n + '.' +
      (errored ? ' ' + errored + ' call(s) never returned and count as failures in your pass rate.' : '') };
  },

  s6: () => {
    const a = S.s6;
    if (!nz(a.exploitOut)) return { ok: false, why: 'Compose an output that beats your own grader.' };
    if (a.graderSaid !== true) return { ok: false, why: 'Your exploit does not pass the grader yet. It has to pass every check.' };
    if (a.humanWrong !== true) return { ok: false, why: 'Mark the exploit wrong by hand. If it is right, it is not an exploit.' };
    if (!nz(a.rewrite)) return { ok: false, why: 'Rewrite the check and say what you changed.' };
    if (a.before === null || a.after === null) return { ok: false, why: 'Record your pass rate before and after the rewrite.' };
    return { ok: true, why: 'Own set moved from ' + a.before + '% to ' + a.after + '%.' };
  },

  s7: () => {
    const n = S.s7.guards.filter(guardReady).length;
    if (n < 3) return { ok: false, why: n + ' of 3 guards complete. Each needs a rule, a catch, a false positive, and a test on a real run.' };
    return { ok: true, why: 'Three guards, each tested on a real run.' };
  },

  s8: () => {
    const t = s5Tokens();
    if (!t.calls) return { ok: false, why: 'No measured runs in the ledger. Go back to stage 5 and run your cases.' };
    const L = lines(S.s8.five);
    if (!L.length) return { ok: false, why: 'Write the five-line client explanation.' };
    if (L.length > 5) return { ok: false, why: 'Five lines means five. You have ' + L.length + '.' };
    return { ok: true, why: 'Costed from ' + t.calls + ' measured calls.' };
  },

  submit: () => ({ ok: true, why: 'Download the bundle.' }),
};

function gateFor(i) { return GATES[STAGES[i].id](); }

/* ---------------- shell ---------------- */

function renderNav() {
  const nav = $('#stageNav');
  nav.innerHTML = '';
  STAGES.forEach((st, i) => {
    const unlocked = i <= S.maxReached;
    const done = unlocked && gateFor(i).ok;
    const b = el(
      '<button class="mod' + (i === S.pos ? ' active' : '') + (unlocked ? '' : ' locked') + (done && unlocked ? ' done' : '') + '">' +
      '<span class="mod-ic">' + ic(unlocked ? st.icon : 'lock') + '</span>' +
      '<span class="mod-label">' + (st.num > 0 && st.num < 9 ? st.num + '. ' : '') + esc(st.title) + '</span>' +
      (st.time ? '<span class="mod-time">' + st.time + 'm</span>' : '') +
      '</button>'
    );
    b.addEventListener('click', () => {
      if (!unlocked) { toast('Finish stage ' + S.maxReached + ' first. The stages are in order for a reason.', 'bad'); return; }
      go(i);
    });
    nav.appendChild(b);
  });
  icons();
}

function updateChrome() {
  const pct = Math.round((S.pos / (STAGES.length - 1)) * 100);
  $('#progressFill').style.width = pct + '%';
  $('#progressBar').setAttribute('aria-valuenow', String(pct));
  $('#progressLabel').textContent = 'Stage ' + STAGES[S.pos].num + ' / 8';

  const ks = $('#keyState');
  if (LLM.ready()) {
    ks.className = 'keystate caption mono on';
    ks.innerHTML = '<span class="dotk"></span>' + esc(PROVIDERS[S.provider].label + ' · ' + S.model);
  } else {
    ks.className = 'keystate caption mono off';
    ks.innerHTML = '<span class="dotk"></span>no provider';
  }
}

function updateGate() {
  const g = gateFor(S.pos);
  const note = $('#gateNote');
  note.textContent = g.why;
  note.className = 'gate-note caption' + (g.ok ? ' ok' : '');
  const cont = $('#continueBtn');
  const last = S.pos === STAGES.length - 1;
  cont.disabled = !g.ok || last;
  cont.innerHTML = last ? 'Done' : 'Continue ' + ic('arrow-right');
  $('#backBtn').disabled = S.pos === 0;
  icons();
}

function go(i) {
  i = clamp(i, 0, STAGES.length - 1);
  stopTick();
  S.pos = i;
  if (i > S.maxReached) S.maxReached = i;
  save();
  renderNav();
  renderStage();
  updateChrome();
  updateGate();
  window.scrollTo({ top: 0 });
  $('#stage').focus({ preventScroll: true });
}

function advance() {
  if (!gateFor(S.pos).ok) return;
  if (S.pos + 1 > S.maxReached) S.maxReached = S.pos + 1;
  go(S.pos + 1);
}

/* ---------------- timers ---------------- */

let tickT = null;
function stopTick() { if (tickT) { clearInterval(tickT); tickT = null; } }

function timerHTML(st) {
  if (!st.time) return '';
  return '<div class="timer">' +
    '<span class="tval" id="tval">--:--</span>' +
    '<button class="tbtn" id="tstart" title="Start or pause">' + ic('play') + '</button>' +
    '<button class="tbtn" id="treset" title="Reset">' + ic('rotate-ccw') + '</button>' +
    '</div>';
}

function mountTimer(st) {
  if (!st.time) return;
  if (!S.timers[st.id]) S.timers[st.id] = { left: st.time * 60, running: false };
  const t = S.timers[st.id];

  function paint() {
    const v = $('#tval'); if (!v) return;
    const neg = t.left < 0, a = Math.abs(t.left);
    v.textContent = (neg ? '-' : '') + String(Math.floor(a / 60)).padStart(2, '0') + ':' + String(a % 60).padStart(2, '0');
    v.className = 'tval' + (neg ? ' over' : t.running ? ' run' : '');
    const b = $('#tstart'); if (b) { b.innerHTML = ic(t.running ? 'pause' : 'play'); icons(); }
  }
  paint();

  stopTick();
  tickT = setInterval(() => {
    if (t.running) { t.left--; paint(); if (t.left === 0) toast('Stage ' + st.num + ': time is up. Stop and take stock.', 'bad'); if (t.left % 15 === 0) save(); }
  }, 1000);

  $('#tstart').addEventListener('click', () => { t.running = !t.running; paint(); save(); });
  $('#treset').addEventListener('click', () => { t.left = st.time * 60; t.running = false; paint(); save(); });
}

/* ---------------- stage header ---------------- */

function head(st, extra) {
  return '<div class="eyebrow-row">' +
    ic(st.icon) +
    '<span class="eyebrow eyebrow--accent">' + (st.time ? 'Stage ' + st.num : 'Sahaj Fresh') + '</span>' +
    (st.time ? '<span class="eyebrow">' + st.time + ' minutes</span>' : '') +
    timerHTML(st) +
    '</div>' +
    '<h1>' + esc(st.title) + '</h1>' +
    (st.produce
      ? '<div class="brief-strip">' +
        '<div class="bstrip"><b>You produce</b><span>' + esc(st.produce) + '</span></div>' +
        '<div class="bstrip"><b>Done when</b><span>' + esc(st.doneWhen) + '</span></div>' +
        '</div>'
      : '') +
    (extra || '');
}

/* ---------------- stage renderers ---------------- */

const R = {};

/* ---- 0. brief ---- */
R.brief = function (root, st) {
  root.className = 'step';
  root.innerHTML = head(st) +
    '<p class="subtitle">You are the builder. One client, one ambiguous ask, one corpus. ' +
    'You extract the problem, prove it, design the system, write the checks, break the checks, price it.</p>' +

    '<div class="glabel">The client brief, verbatim</div>' +
    '<div class="quotecard">&ldquo;' + esc(CLIENT_BRIEF) + '&rdquo;</div>' +
    '<p class="body">Your facilitator plays the client. It is <strong>' + esc(ROLE_DATE) + '</strong>. ' +
    'You have the documents the client shared in <code>corpus/wave-1</code>. Nothing else. ' +
    'The client answers what you ask and volunteers nothing.</p>' +

    '<div class="anchor">' + ic('flag') +
    '<div><strong>Two rules that decide this assignment.</strong> Evals before build: if you cannot write the check, ' +
    'do not automate the step. And numbers from runs, not estimates &mdash; every figure on your cost sheet comes ' +
    'out of a real API response, measured in this app.</div></div>' +

    '<div class="anchor warnbox">' + ic('trending-up') +
    '<div><strong>Stage 6 is marked higher than stage 5.</strong> Finding your own blind spot beats a clean pass. ' +
    'Plan your time accordingly.</div></div>' +

    '<div class="bench"><div class="bench-title">' + ic('list-checks') + 'The eight stages<span class="spacer"></span></div>' +
    '<div class="tblwrap"><table class="uc"><thead><tr><th>#</th><th>Stage</th><th>Time</th><th>You produce</th></tr></thead><tbody>' +
    STAGES.filter(s => s.time).map(s =>
      '<tr><td>' + s.num + '</td><td>' + esc(s.title) + '</td><td class="num">' + s.time + 'm</td><td>' + esc(s.produce) + '</td></tr>'
    ).join('') +
    '</tbody></table></div></div>' +

    '<div class="bench"><div class="bench-title">' + ic('plug') + 'Before you start<span class="spacer"></span></div>' +
    '<p class="bench-intro">Stages 5 to 8 make real model calls. Add a provider key now so you are not doing it ' +
    'with the clock running. The key is stored in this browser only and is sent to your chosen provider and nowhere else.</p>' +
    '<div class="row-wrap">' +
    '<button class="btn btn--primary btn--sm" id="openSetup">' + ic('settings') + ' Set up a provider</button>' +
    '<button class="btn btn--secondary btn--sm" id="openCorpus">' + ic('folder-open') + ' Read the corpus (9 documents)</button>' +
    '</div></div>';

  $('#openSetup', root).addEventListener('click', setupDrawer);
  $('#openCorpus', root).addEventListener('click', corpusDrawer);
  mountTimer(st);
};

/* ---- 1. extract the problem ---- */
R.s1 = function (root, st) {
  root.className = 'step';
  root.innerHTML = head(st) +
    '<p class="body">Five questions for the client, asked before you know the answer. Then one observation: ' +
    '<strong>who, what breaks, where, in numbers.</strong> No solution. A stranger should read your observation ' +
    'and name the same problem.</p>' +

    '<div class="bench"><div class="bench-title">' + ic('help-circle') + 'Your five questions' +
    '<span class="spacer"></span><span class="caption mono" id="qcount"></span></div>' +
    '<p class="bench-intro">Write the question, then note what the client actually said when you asked it. ' +
    'The app flags questions that are really solutions in disguise.</p>' +
    '<div class="qlist" id="qlist"></div></div>' +

    '<div class="bench"><div class="bench-title">' + ic('microscope') + 'The observation</div>' +
    '<p class="bench-intro">Four parts. Keep it to what the corpus and the client actually told you.</p>' +
    '<div class="field"><label class="label" for="f-who">Who <span class="hint">whose problem is this</span></label>' +
    '<input class="input" id="f-who" placeholder="Subscribers on early Tier 2 routes, and the hub managers who never hear about it" /></div>' +
    '<div class="field"><label class="label" for="f-what">What breaks <span class="hint">the mechanism, not the symptom</span></label>' +
    '<textarea class="textarea" id="f-what" placeholder="What actually fails, in the order it fails"></textarea></div>' +
    '<div class="field"><label class="label" for="f-where">Where <span class="hint">which cities, hubs, routes, and where it is clean</span></label>' +
    '<input class="input" id="f-where" placeholder="" /></div>' +
    '<div class="field"><label class="label" for="f-nums">In numbers <span class="hint">at least one figure from the corpus</span></label>' +
    '<textarea class="textarea" id="f-nums" placeholder="Cite the document you took each number from"></textarea></div>' +
    '<div id="obsLint"></div></div>';

  const list = $('#qlist', root);
  S.s1.qs.forEach((q, i) => {
    const row = el(
      '<div class="qrow"><span class="qn">' + (i + 1) + '</span>' +
      '<input class="input input--sm q" placeholder="Question ' + (i + 1) + '" />' +
      '<div class="qa"><input class="input input--sm a" placeholder="What the client said" /></div>' +
      '<div class="qwarn" hidden></div></div>'
    );
    const qi = $('.q', row), ai = $('.a', row), warn = $('.qwarn', row);
    qi.value = q.q; ai.value = q.a;

    function lint() {
      const bad = solutionWordsIn(q.q);
      row.classList.toggle('filled', nz(q.q));
      row.classList.toggle('flag', bad.length > 0);
      if (bad.length) {
        warn.hidden = false;
        warn.innerHTML = ic('alert-triangle') + '<span>This asks about a solution (' + esc(bad.join(', ')) +
          '). Ask what breaks, not what to build.</span>';
        icons();
      } else warn.hidden = true;
      const n = S.s1.qs.filter(x => nz(x.q)).length;
      $('#qcount', root).textContent = n + ' / ' + Q_TARGET;
    }
    qi.addEventListener('input', () => { q.q = qi.value; lint(); save(); updateGate(); });
    ai.addEventListener('input', () => { q.a = ai.value; save(); });
    lint();
    list.appendChild(row);
  });

  ['who', 'what', 'where', 'nums'].forEach(k => {
    const f = $('#f-' + k, root);
    f.value = S.s1[k];
    f.addEventListener('input', () => { S.s1[k] = f.value; obsLint(); save(); updateGate(); });
  });

  function obsLint() {
    const box = $('#obsLint', root);
    const bad = solutionWordsIn(s1Obs());
    const num = hasNumber(S.s1.nums);
    let h = '';
    if (bad.length) h += '<div class="anchor warnbox">' + ic('alert-triangle') +
      '<div><strong>Your observation names a solution.</strong> Found: ' + esc(bad.join(', ')) +
      '. Stage 1 is the problem only. The client asked for AI; that is their guess, not your finding.</div></div>';
    if (nz(S.s1.nums) && !num) h += '<div class="anchor warnbox">' + ic('hash') +
      '<div>No digit in the numbers field. An observation without a number is an opinion.</div></div>';
    box.innerHTML = h;
    icons();
  }
  obsLint();
  $('#qcount', root).textContent = S.s1.qs.filter(x => nz(x.q)).length + ' / ' + Q_TARGET;
  mountTimer(st);
};

/* ---- 2. define good ---- */
R.s2 = function (root, st) {
  root.className = 'step';
  root.innerHTML = head(st) +
    '<p class="body">A baseline you can measure today, a hypothesis about what moves it, one thing that would ' +
    'prove you wrong, and the cheapest manual test that would settle it. The test should need no software.</p>' +

    '<div class="bench"><div class="bench-title">' + ic('gauge') + 'Baseline</div>' +
    '<div class="field"><label class="label" for="f-baseline">The number as it stands today <span class="hint">with a figure in it</span></label>' +
    '<textarea class="textarea" id="f-baseline" placeholder="What you would measure this week, and what it reads right now"></textarea></div>' +
    '<div class="field"><label class="label" for="f-src">Where that number comes from <span class="hint">document and section</span></label>' +
    '<input class="input" id="f-src" /></div></div>' +

    '<div class="bench"><div class="bench-title">' + ic('git-branch') + 'Hypothesis and falsifier</div>' +
    '<div class="field"><label class="label" for="f-hyp">Hypothesis <span class="hint">if we change X, the baseline moves to Y</span></label>' +
    '<textarea class="textarea" id="f-hyp"></textarea></div>' +
    '<div class="field"><label class="label" for="f-fals">One falsifier <span class="hint">the single result that would kill it</span></label>' +
    '<textarea class="textarea" id="f-fals" placeholder="We do X, and the baseline does not move."></textarea></div>' +
    '<div class="anchor">' + ic('scan-search') +
    '<div><strong>A falsifier names a result, not a risk.</strong> &ldquo;It might not work&rdquo; is not a falsifier. ' +
    '&ldquo;We fix the detection lag and the complaints continue at the same rate&rdquo; is.</div></div></div>' +

    '<div class="bench"><div class="bench-title">' + ic('clipboard-check') + 'Cheapest manual test</div>' +
    '<p class="bench-intro">One hub, a short window, a person doing by hand what the system would do. ' +
    'If a person cannot do it once, a model cannot do it a thousand times.</p>' +
    '<div class="field"><textarea class="textarea" id="f-test" style="min-height:120px" placeholder="Who does what, where, for how long, and what result would count as proof"></textarea></div></div>';

  [['baseline', 'baseline'], ['src', 'src'], ['hyp', 'hyp'], ['fals', 'fals'], ['test', 'test']].forEach(([id, k]) => {
    const f = $('#f-' + id, root);
    f.value = S.s2[k];
    f.addEventListener('input', () => { S.s2[k] = f.value; save(); updateGate(); });
  });
  mountTimer(st);
};

/* ---- 3. align ---- */
R.s3 = function (root, st) {
  root.className = 'step';
  root.innerHTML = head(st) +
    '<p class="body">Two minutes to the client. They will push back once. If they say no or change, ' +
    'record that and go back &mdash; do not start designing on a maybe.</p>' +

    '<div class="bench"><div class="bench-title">' + ic('presentation') + 'The pitch</div>' +
    '<p class="bench-intro">Problem, evidence, what you propose to test, what it costs to find out. Two minutes.</p>' +
    '<div class="field"><textarea class="textarea" id="f-pitch" style="min-height:170px"></textarea></div></div>' +

    '<div class="bench"><div class="bench-title">' + ic('message-square-warning') + 'The pushback</div>' +
    '<p class="bench-intro">Write down the objection the client actually raised, and what you said back.</p>' +
    '<div class="field"><textarea class="textarea" id="f-pushback"></textarea></div></div>' +

    '<div class="bench"><div class="bench-title">' + ic('file-signature') + 'Sign-off</div>' +
    '<div class="glabel">Client verdict</div>' +
    '<div class="row-wrap" id="verdicts">' +
    ['yes', 'change', 'no'].map(v =>
      '<button class="pick" data-v="' + v + '">' + (v === 'yes' ? 'Yes' : v === 'change' ? 'Change it' : 'No') + '</button>'
    ).join('') + '</div>' +
    '<div class="field" style="margin-top:16px"><label class="label" for="f-signoff">In writing <span class="hint">what the client said, in their words</span></label>' +
    '<textarea class="textarea" id="f-signoff"></textarea></div>' +
    '<div id="s3note"></div></div>';

  ['pitch', 'pushback', 'signoff'].forEach(k => {
    const f = $('#f-' + k, root);
    f.value = S.s3[k];
    f.addEventListener('input', () => { S.s3[k] = f.value; save(); updateGate(); });
  });

  function paintV() {
    $$('#verdicts .pick', root).forEach(b => {
      const on = b.dataset.v === S.s3.verdict;
      b.className = 'pick' + (on ? ' sel ' + (b.dataset.v === 'yes' ? 'yes' : 'no') : '');
    });
    const n = $('#s3note', root);
    if (S.s3.verdict === 'no' || S.s3.verdict === 'change') {
      n.innerHTML = '<div class="anchor warnbox">' + ic('undo-2') +
        '<div><strong>Then you are not at stage 4.</strong> Go back to stage 1 or 2, fix what the client rejected, ' +
        'and pitch again. Designing against a no is the most expensive mistake on this assignment.</div></div>';
    } else if (S.s3.verdict === 'yes') {
      n.innerHTML = '<div class="anchor">' + ic('check-circle-2') +
        '<div>Signed off ' + esc(S.s3.at || '') + '. Now you may design.</div></div>';
    } else n.innerHTML = '';
    icons();
  }
  $$('#verdicts .pick', root).forEach(b => b.addEventListener('click', () => {
    S.s3.verdict = b.dataset.v;
    // The sign-off is an artefact of the role-play, so it carries the role-play's
    // date. The real clock still goes in the bundle, for anyone checking the work.
    S.s3.at = ROLE_DATE;
    S.s3.realAt = new Date().toISOString();
    paintV(); save(); updateGate();
  }));
  paintV();
  mountTimer(st);
};

/* ---- 4. design the process ---- */
R.s4 = function (root, st) {
  root.className = 'step step--wide';
  root.innerHTML = head(st) +
    '<p class="body">Input, output, steps. Tag every step <strong>deterministic</strong>, ' +
    '<strong>probabilistic</strong>, or <strong>human</strong>. Every probabilistic step must carry a reason ' +
    'a deterministic step could not do it. If you cannot write that reason, the step is deterministic and ' +
    'you were reaching for a model out of habit.</p>' +
    '<div class="kindkey">' + STEP_KINDS.map(k =>
      '<span class="kk"><i class="kkdot" style="background:' + k.color + '"></i>' +
      '<b style="color:' + k.color + '">' + k.short + '</b> ' + esc(k.label) +
      '<span class="kkh">' + esc(k.hint) + '</span></span>').join('') + '</div>' +

    '<div class="bench">' +
    '<div class="field"><label class="label" for="f-in">Input <span class="hint">what arrives, and from where</span></label>' +
    '<input class="input" id="f-in" placeholder="One exported support ticket" /></div>' +
    '<div class="field" style="margin-bottom:0"><label class="label" for="f-out">Output <span class="hint">what leaves, and who acts on it</span></label>' +
    '<input class="input" id="f-out" placeholder="A flagged route-day for a named human to call the hub about" /></div></div>' +

    '<div class="cg-wrap">' +
    '<div><div class="glabel">Steps, in order</div><div class="steplist" id="steplist"></div>' +
    '<div class="row-wrap"><button class="btn btn--secondary btn--sm" id="addStep">' + ic('plus') + ' Add step</button>' +
    '<span class="caption mut">Drag is not needed &mdash; use the arrows to reorder.</span></div></div>' +
    '<div><div class="glabel">Control graph</div><div class="cg-canvas" id="cg"></div></div>' +
    '</div>';

  ['in', 'out'].forEach(k => {
    const f = $('#f-' + k, root);
    const key = k === 'in' ? 'input' : 'output';
    f.value = S.s4[key];
    f.addEventListener('input', () => { S.s4[key] = f.value; save(); updateGate(); });
  });

  let cgT;
  function drawSoon() { clearTimeout(cgT); cgT = setTimeout(drawGraph, 220); }

  function drawGraph() {
    const steps = S.s4.steps;
    const COL = {}; STEP_KINDS.forEach(k => { COL[k.id] = k.color; });
    const W = 300, rowH = 46, padT = 34, padB = 40;
    const H = padT + steps.length * rowH + padB + 10;
    let g = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Control graph">';
    g += '<defs><marker id="a3" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">' +
         '<path d="M0 0 L8 4 L0 8 z" fill="#B9B9B9"/></marker></defs>';

    function node(y, label, fill, stroke, dash, warn) {
      let s = '<rect x="18" y="' + y + '" width="' + (W - 36) + '" height="30" rx="7" fill="' + fill + '" stroke="' + stroke + '"' +
        (dash ? ' stroke-dasharray="4 3"' : '') + ' stroke-width="1.4"/>';
      s += '<text x="' + (W / 2) + '" y="' + (y + 19) + '" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" fill="' +
        (dash ? '#666' : '#fff') + '">' + esc(label.length > 34 ? label.slice(0, 33) + '…' : label) + '</text>';
      if (warn) s += '<circle cx="' + (W - 28) + '" cy="' + (y + 15) + '" r="6" fill="#F59E0B"/>' +
        '<text x="' + (W - 28) + '" y="' + (y + 18.5) + '" text-anchor="middle" font-size="9" font-weight="700" fill="#fff">!</text>';
      return s;
    }
    function arrow(y1, y2) { return '<line x1="' + (W / 2) + '" y1="' + y1 + '" x2="' + (W / 2) + '" y2="' + y2 + '" stroke="#C9C9C9" stroke-width="1.2" marker-end="url(#a3)"/>'; }

    g += node(4, S.s4.input || 'input', '#fff', '#C9C9C9', true, false);
    let y = padT;
    steps.forEach((s, i) => {
      g += arrow(i === 0 ? 34 : y - 12, y - 2);
      g += node(y, (i + 1) + '. ' + (s.name || 'unnamed'), COL[s.kind] || '#999', COL[s.kind] || '#999', false,
                s.kind === 'model' && !nz(s.why));
      y += rowH;
    });
    g += arrow(y - 12, y - 2);
    g += node(y, S.s4.output || 'output', '#fff', '#C9C9C9', true, false);
    g += '</svg>';

    const counts = { det: 0, model: 0, human: 0 };
    steps.forEach(s => counts[s.kind]++);
    $('#cg', root).innerHTML = g +
      '<div class="cg-legend">' + STEP_KINDS.map(k =>
        '<span><i style="background:' + k.color + '"></i>' + k.label.toLowerCase() + ' ' + counts[k.id] + '</span>'
      ).join('') + '</div>';
  }

  function renderSteps() {
    const box = $('#steplist', root);
    box.innerHTML = '';
    if (!S.s4.steps.length) box.innerHTML = '<p class="caption mut">No steps yet. Start with what arrives and what you do to it first.</p>';
    S.s4.steps.forEach((s, i) => {
      const row = el(
        '<div class="pstep k-' + s.kind + (s.kind === 'model' && !nz(s.why) ? ' needwhy' : '') + '">' +
        '<div class="pstep-top">' +
        '<input class="input input--sm nm" placeholder="What this step does" />' +
        '<div class="kindsel">' + STEP_KINDS.map(k =>
          '<button data-k="' + k.id + '" class="' + (s.kind === k.id ? 'sel' : '') + '" ' +
          'title="' + esc(k.label + ' — ' + k.hint) + '" aria-label="' + esc(k.label) + '">' + k.short + '</button>'
        ).join('') + '</div>' +
        '<button class="iconbtn up" title="Move up">' + ic('chevron-up') + '</button>' +
        '<button class="iconbtn del" title="Remove">' + ic('trash-2') + '</button>' +
        '</div>' +
        (s.kind === 'model'
          ? '<div class="why"><input class="input input--sm wy" placeholder="Why a deterministic step cannot do this" /></div>'
          : '') +
        '</div>'
      );
      const nm = $('.nm', row); nm.value = s.name;
      nm.addEventListener('input', () => { s.name = nm.value; save(); updateGate(); drawSoon(); });
      const wy = $('.wy', row);
      if (wy) {
        wy.value = s.why || '';
        wy.addEventListener('input', () => {
          s.why = wy.value;
          row.classList.toggle('needwhy', !nz(s.why));
          save(); updateGate(); drawSoon();
        });
      }
      $$('.kindsel button', row).forEach(b => b.addEventListener('click', () => {
        s.kind = b.dataset.k; save(); renderSteps(); drawGraph(); updateGate();
      }));
      $('.up', row).addEventListener('click', () => {
        if (i === 0) return;
        S.s4.steps.splice(i - 1, 0, S.s4.steps.splice(i, 1)[0]);
        save(); renderSteps(); drawGraph();
      });
      $('.del', row).addEventListener('click', () => {
        S.s4.steps.splice(i, 1); save(); renderSteps(); drawGraph(); updateGate();
      });
      box.appendChild(row);
    });
    icons();
  }

  $('#addStep', root).addEventListener('click', () => {
    S.s4.steps.push({ name: '', kind: 'det', why: '' });
    save(); renderSteps(); drawGraph(); updateGate();
  });

  renderSteps(); drawGraph();
  mountTimer(st);
};

/* ---- 5. write evals ---- */
R.s5 = function (root, st) {
  root.className = 'step step--eval';
  root.innerHTML = head(st) +
    '<p class="body">This is the stage where you find out whether your process actually works. ' +
    'You will build a small test set, run it for real, and then check the checker.</p>' +

    '<div class="bench primer"><div class="bench-title">' + ic('graduation-cap') + 'What you are doing here</div>' +
    '<p class="bench-intro">If you have never written an eval set before, read this once. It is four moves, in order.</p>' +
    '<div class="moves">' +
    '<div class="move"><span class="mn">1</span><div><b>Write the prompt.</b> One instruction for the one ' +
    'probabilistic step in your control graph. It has to return the fixed JSON shape below, because a check ' +
    'can only test something with a predictable shape.</div></div>' +
    '<div class="move"><span class="mn">2</span><div><b>Say what right looks like.</b> A <em>case</em> is one ' +
    'ticket plus the answer you believe is correct for it. Six tickets are loaded from the client\'s own corpus ' +
    'with the answers left blank on purpose &mdash; deciding them is the actual work, and it is where you find ' +
    'out your own definition of "warm" is fuzzier than you thought. Write ' + (CASE_TARGET - SEED_CASES.length) +
    ' more yourself so the awkward shapes are covered too.</div></div>' +
    '<div class="move"><span class="mn">3</span><div><b>Run it.</b> One real model call per case. You now have ' +
    'what the model said next to what you said it should say, and a pass rate.</div></div>' +
    '<div class="move"><span class="mn">4</span><div><b>Judge the judge.</b> Read ' + LABEL_TARGET + ' outputs ' +
    'yourself and mark each right or wrong before you are shown the grader\'s verdict. If you and your grader ' +
    'disagree, <strong>the grader is the thing that is broken</strong>, not you. That agreement number is the ' +
    'only evidence that your automated check means anything.</div></div>' +
    '</div>' +
    '<div class="anchor">' + ic('info') + '<div><strong>A high pass rate here proves nothing on its own.</strong> ' +
    'You wrote the cases and you wrote the grader, so of course they agree. Stage 6 is where that gets tested.</div></div>' +
    '</div>' +

    '<div class="bench"><div class="bench-title">' + ic('file-code-2') + '<span class="stepnum">1</span> The prompt for your probabilistic step</div>' +
    '<p class="bench-intro">Write the prompt for the one model step in your control graph. It must return exactly ' +
    'this JSON and nothing else, or your deterministic checks have nothing to check.</p>' +
    '<pre class="codeblk">' + esc(OUTPUT_CONTRACT) + '</pre>' +
    '<div class="field"><label class="label" for="f-prompt">System prompt</label>' +
    '<textarea class="textarea mono" id="f-prompt" style="min-height:150px" placeholder="You are classifying one Sahaj Fresh support ticket..."></textarea></div></div>' +

    '<div class="bench"><div class="bench-title">' + ic('layers') + '<span class="stepnum">2</span> The cases' +
    '<span class="spacer"></span><span class="caption mono" id="ccount"></span></div>' +
    '<p class="bench-intro">' + CASE_TARGET + ' cases. Load the six corpus tickets, fill in the expected output ' +
    'for each, then write ' + (CASE_TARGET - SEED_CASES.length) + ' of your own. Tag each case with the class it ' +
    'covers: a set that is all easy complaints measures only the easy half of the problem.</p>' +
    '<div class="coverage" id="cvg"></div>' +
    '<div class="row-wrap" style="margin-bottom:12px">' +
    '<button class="btn btn--secondary btn--sm" id="seedBtn">' + ic('download') + ' Load the 6 corpus tickets</button>' +
    '<button class="btn btn--ghost btn--sm" id="addCase">' + ic('plus') + ' Add a case</button>' +
    '</div>' +
    '<div class="cases" id="cases"></div></div>' +

    '<div class="bench"><div class="bench-title">' + ic('play-circle') + '<span class="stepnum">3</span> Run</div>' +
    '<p class="bench-intro">One call per case against your provider. Tokens are recorded to the ledger and ' +
    'stage 8 reads them; nothing here is estimated.</p>' +
    '<div class="runbar">' +
    '<button class="btn btn--primary btn--sm" id="runBtn">' + ic('zap') + ' Run all cases</button>' +
    '<div class="prog"><i id="runFill"></i></div>' +
    '<span class="caption mono" id="runNote"></span></div></div>' +

    '<div class="bench"><div class="bench-title">' + ic('ruler') + 'The grader</div>' +
    '<p class="bench-intro">The grader is the code that decides pass or fail without you. Check the two ' +
    'easy fields exactly, then pick how the condition label is judged. That last choice matters far more ' +
    'than it looks, and stage 6 is where you find out why.</p>' +
    '<div class="row-wrap" style="margin-bottom:12px">' +
    '<label class="pick"><input type="checkbox" id="gk-route"> route must match exactly</label>' +
    '<label class="pick"><input type="checkbox" id="gk-esc"> escalate must match exactly</label>' +
    '</div>' +
    '<div class="gopts" id="gmodes"></div>' +
    '<div id="kwbox"></div></div>' +

    '<div class="bench"><div class="bench-title">' + ic('user-check') + '<span class="stepnum">4</span> Hand-label ' + LABEL_TARGET +
    '<span class="spacer"></span><span class="caption mono" id="hlnote"></span></div>' +
    '<p class="bench-intro">Read the ticket and the model output. Say whether the output is right, using ' +
    'your own judgement. Your grader\'s verdict stays hidden until all ' + LABEL_TARGET + ' are labelled, ' +
    'so you cannot be influenced by it.</p>' +
    '<div id="hl"></div>' +
    '<div id="hlres"></div></div>';

  const pf = $('#f-prompt', root);
  pf.value = S.s5.prompt;
  pf.addEventListener('input', () => { S.s5.prompt = pf.value; save(); updateGate(); });

  /* --- cases --- */
  function paintCoverage() {
    $('#cvg', root).innerHTML = REQUIRED_CLASSES.map(c => {
      const have = S.s5.cases.some(x => x.cls === c.id && caseFilled(x));
      return '<span class="cvg' + (have ? ' have' : '') + '" title="' + esc(c.hint) + '">' + esc(c.label) + '</span>';
    }).join('');
    $('#ccount', root).textContent = casesFilled() + ' / ' + CASE_TARGET + ' complete';
  }

  function renderCases() {
    const box = $('#cases', root);
    box.innerHTML = '';
    // The hand-label step is blind on purpose. Showing the grader's tick on the
    // case card above it hands over the answer, so hold it back on exactly the
    // cases being labelled, until every one of them has a label.
    const blind = {};
    const hlSet = S.s5.cases.filter(c => c.out).slice(0, LABEL_TARGET);
    if (hlSet.length && !hlSet.every(c => S.s5.labels[c.id])) {
      hlSet.forEach(c => { blind[c.id] = true; });
    }
    S.s5.cases.forEach((c, i) => {
      const g = gradeCase(c);
      const row = el(
        '<div class="case' + (g ? (g.pass ? ' pass' : ' fail') : '') + '">' +
        '<div class="case-head"><span class="cid">' + esc(c.id) + '</span>' +
        (c.src ? '<span class="csrc">' + esc(c.src) + '</span>' : '') +
        '<span class="spacer"></span>' +
        '<select class="classsel"><option value="">class…</option>' +
        REQUIRED_CLASSES.map(k => '<option value="' + k.id + '">' + esc(k.label) + '</option>').join('') +
        '</select>' +
        '<button class="iconbtn del" title="Clear">' + ic('eraser') + '</button></div>' +
        '<textarea class="textarea textarea--sm inp" style="min-height:64px" placeholder="Ticket text"></textarea>' +
        '<div class="expect-row">' +
        '<div><label>expected condition</label><select class="input input--sm ec">' +
        ['', 'warm', 'sour', 'watery', 'other', 'none'].map(v => '<option value="' + v + '">' + (v || '—') + '</option>').join('') +
        '</select></div>' +
        '<div><label>expected route</label><input class="input input--sm er" placeholder="IND-A, or leave blank for null" /></div>' +
        '<div><label>expected escalate</label><select class="input input--sm ee"><option value="false">false</option><option value="true">true</option></select></div>' +
        '</div>' +
        (c.raw ? '<div class="outbox">' + esc(c.raw) + '</div>' : '') +
        (c.err ? '<div class="outbox err-t">' + esc(c.err) + '</div>' : '') +
        (g
          ? (blind[c.id]
            ? '<div class="checkline"><span class="chk o" title="Hand-label this output below first. ' +
              'The grader\'s verdict is held back so it cannot influence you.">grader verdict held ' +
              'until you hand-label it</span></div>'
            : '<div class="checkline">' + g.checks.map(x =>
              '<span class="chk ' + (x.pass ? 'y' : 'n') + '" title="' + esc(x.note) + '">' + x.name + ' ' + (x.pass ? '✓' : '✗') + '</span>'
            ).join('') + '</div>')
          : '') +
        '</div>'
      );
      const inp = $('.inp', row), ec = $('.ec', row), er = $('.er', row), ee = $('.ee', row), cs = $('.classsel', row);
      inp.value = c.input; ec.value = c.exp.condition; er.value = c.exp.route; ee.value = String(c.exp.escalate); cs.value = c.cls;

      inp.addEventListener('input', () => { c.input = inp.value; paintCoverage(); save(); updateGate(); });
      ec.addEventListener('change', () => { c.exp.condition = ec.value; paintCoverage(); save(); renderCases(); updateGate(); });
      er.addEventListener('input', () => { c.exp.route = er.value; save(); });
      ee.addEventListener('change', () => { c.exp.escalate = ee.value; save(); renderCases(); });
      cs.addEventListener('change', () => { c.cls = cs.value; paintCoverage(); save(); });
      $('.del', row).addEventListener('click', () => {
        Object.assign(c, blankCase(i), { id: c.id });
        delete S.s5.labels[c.id];
        save(); renderCases(); paintCoverage(); renderHL(); updateGate();
      });
      box.appendChild(row);
    });
    icons();
    paintCoverage();
  }

  $('#seedBtn', root).addEventListener('click', () => {
    SEED_CASES.forEach((sd, i) => {
      const c = S.s5.cases[i];
      if (nz(c.input) && c.input !== sd.input && !confirm('Case ' + c.id + ' already has text. Overwrite the first six?')) return;
      c.input = sd.input; c.src = sd.src;
    });
    save(); renderCases(); updateGate();
    toast('Six corpus tickets loaded. The expected outputs are yours to decide.', 'good');
  });

  $('#addCase', root).addEventListener('click', () => {
    S.s5.cases.push(blankCase(S.s5.cases.length));
    save(); renderCases(); updateGate();
  });

  /* --- grader --- */
  function renderGrader() {
    const g = S.s5.grader;
    $('#gk-route', root).checked = g.route;
    $('#gk-esc', root).checked = g.escalate;

    const modes = [
      { id: 'keyword-output', t: 'Keyword in the reply', d: 'The expected condition\'s keywords must appear somewhere in what the model said.' },
      { id: 'keyword-input',  t: 'Keyword in the ticket', d: 'Work out the label from the ticket text by keyword, then check the model agrees.' },
      { id: 'exact',          t: 'Exact label match',     d: 'The model\'s condition must equal the expected condition you wrote by hand.' },
    ];
    $('#gmodes', root).innerHTML = modes.map(m =>
      '<label class="gopt' + (g.mode === m.id ? ' sel' : '') + '"><input type="radio" name="gm" value="' + m.id + '"' +
      (g.mode === m.id ? ' checked' : '') + '><span><b>' + esc(m.t) + '</b><span>' + esc(m.d) + '</span></span></label>'
    ).join('');

    $('#kwbox', root).innerHTML = g.mode === 'exact' ? '' :
      '<div class="glabel">Keywords per label</div><div class="kwgrid">' +
      ['warm', 'sour', 'watery', 'other', 'none'].map(k =>
        '<div><label>' + k + '</label><input class="input input--sm kwf" data-k="' + k + '" value="' + esc(g.kw[k]) + '" placeholder="comma separated" /></div>'
      ).join('') + '</div>';

    $$('input[name=gm]', root).forEach(r => r.addEventListener('change', () => {
      g.mode = r.value; save(); renderGrader(); renderCases(); renderHL(); updateGate();
    }));
    $$('.kwf', root).forEach(f => f.addEventListener('input', () => {
      g.kw[f.dataset.k] = f.value; save(); renderCases(); renderHL();
    }));
  }
  $('#gk-route', root).addEventListener('change', e => { S.s5.grader.route = e.target.checked; save(); renderCases(); renderHL(); updateGate(); });
  $('#gk-esc', root).addEventListener('change', e => { S.s5.grader.escalate = e.target.checked; save(); renderCases(); renderHL(); updateGate(); });

  /* --- run --- */
  $('#runBtn', root).addEventListener('click', async () => {
    if (!LLM.ready()) { toast('Add a provider key first (Setup in the sidebar).', 'bad'); setupDrawer(); return; }
    if (!nz(S.s5.prompt)) { toast('Write the system prompt first.', 'bad'); return; }
    const todo = S.s5.cases.map((c, i) => ({ c, i })).filter(x => nz(x.c.input));
    if (!todo.length) { toast('No cases with input text.', 'bad'); return; }

    const btn = $('#runBtn', root); btn.disabled = true;
    const fill = $('#runFill', root), note = $('#runNote', root);
    note.textContent = 'running 0 / ' + todo.length;

    const res = await LLM.batch(todo,
      async (x) => {
        const r = await LLM.chat(S.s5.prompt, x.c.input, {
          json: true, maxTokens: 300,
          onRetry: e => { note.textContent = 'rate limited, waiting ' + Math.round(e.waitMs / 100) / 10 + 's (retry ' + e.attempt + ' of ' + e.of + ')'; },
        });
        Ledger.add(S.ledger, { stage: 's5', purpose: 'case', caseId: x.c.id, model: r.model, in: r.usage.in, out: r.usage.out });
        return r;
      },
      (d, t) => { fill.style.width = Math.round(d / t * 100) + '%'; note.textContent = 'running ' + d + ' / ' + t; }
    );

    res.forEach((r, k) => {
      const c = todo[k].c;
      if (!r.ok) { c.err = r.error; c.raw = ''; c.out = null; return; }
      c.raw = r.value.text; c.err = '';
      const p = LLM.parseContract(r.value.text);
      if (p.ok) { c.out = p.value; } else { c.out = null; c.err = p.error; }
    });

    S.s5.ran = true;
    const bad = res.filter(r => !r.ok).length;
    const unparsed = todo.filter(x => x.c.err && !x.c.out).length;
    save(); renderCases(); renderHL(); updateGate();
    btn.disabled = false;
    note.textContent = 'done';
    const pr = ownPassRate();
    toast(bad ? bad + ' call(s) failed. ' + (res.find(r => !r.ok) || {}).error
              : unparsed ? unparsed + ' repl(ies) did not parse as the contract. Tighten the prompt.'
              : 'Ran ' + todo.length + ' cases. Pass rate ' + Math.round(pr.pass / pr.total * 100) + '%.',
          bad || unparsed ? 'bad' : 'good');
  });

  /* --- hand labelling --- */
  function renderHL() {
    const done = S.s5.cases.filter(c => c.out).slice(0, LABEL_TARGET);
    const box = $('#hl', root);
    if (!done.length) {
      box.innerHTML = '<p class="caption mut">Run the cases first. There is nothing to label yet.</p>';
      $('#hlres', root).innerHTML = ''; $('#hlnote', root).textContent = '';
      return;
    }
    const all = done.every(c => S.s5.labels[c.id]);
    box.innerHTML = '';
    done.forEach(c => {
      const mine = S.s5.labels[c.id];
      const g = gradeCase(c);
      const row = el(
        '<div class="hl"><div class="tk">' + esc(c.input.slice(0, 260)) + (c.input.length > 260 ? '…' : '') + '</div>' +
        '<div class="mo">' + esc(JSON.stringify(c.out)) + '</div>' +
        '<div class="picks">' +
        '<span class="caption mut">Is this output right?</span>' +
        '<button class="pick y' + (mine === 'y' ? ' sel yes' : '') + '">Right</button>' +
        '<button class="pick n' + (mine === 'n' ? ' sel no' : '') + '">Wrong</button>' +
        (all ? '<span class="agree ' + (g && g.pass === (mine === 'y') ? 'ok-t' : 'err-t') + '">grader said ' +
               (g && g.pass ? 'pass' : 'fail') + (g && g.pass === (mine === 'y') ? ' · agrees' : ' · disagrees') + '</span>' : '') +
        '</div></div>'
      );
      // renderCases too: the last label lifts the blind on the cards above.
      $('.y', row).addEventListener('click', () => { S.s5.labels[c.id] = 'y'; save(); renderHL(); renderCases(); updateGate(); });
      $('.n', row).addEventListener('click', () => { S.s5.labels[c.id] = 'n'; save(); renderHL(); renderCases(); updateGate(); });
      box.appendChild(row);
    });

    const ag = agreement();
    $('#hlnote', root).textContent = (ag ? ag.n : 0) + ' / ' + LABEL_TARGET + ' labelled';
    const res = $('#hlres', root);
    if (all && ag) {
      const good = ag.agree >= AGREE_TARGET;
      res.innerHTML =
        '<div class="scorecard">' +
        '<div class="sc"><b>Grader agreement</b><div class="v ' + (good ? 'good' : 'warn') + '">' + ag.agree + ' / ' + ag.n + '</div>' +
        '<div class="s">your judgement vs your grader</div></div>' +
        '<div class="sc"><b>Own-set pass rate</b><div class="v">' + Math.round(ownPassRate().pass / ownPassRate().total * 100) + '%</div>' +
        '<div class="s">what the grader says today</div></div>' +
        '</div>' +
        (good
          ? '<div class="anchor">' + ic('check-circle-2') + '<div>' + AGREE_TARGET + ' or better. Your grader is a reasonable ' +
            'stand-in for you &mdash; on these cases. Stage 6 is where you find out what that is worth.</div></div>'
          : '<div class="anchor warnbox">' + ic('alert-triangle') + '<div><strong>Below ' + AGREE_TARGET + '.</strong> Either fix the grader ' +
            'and re-check, or write down why the disagreement is the grader being right and you being sloppy. ' +
            'Both are acceptable; silence is not.</div></div>' +
            '<div class="field" style="margin-top:12px"><label class="label" for="f-why">Why not</label>' +
            '<textarea class="textarea" id="f-why"></textarea></div>');
      const w = $('#f-why', res);
      if (w) { w.value = S.s5.whyNot; w.addEventListener('input', () => { S.s5.whyNot = w.value; save(); updateGate(); }); }
    } else res.innerHTML = '';
    icons();
  }

  renderCases(); renderGrader(); renderHL();
  mountTimer(st);
};

/* ---- 6. break your evals ---- */
R.s6 = function (root, st) {
  root.className = 'step step--eval';
  const pr = ownPassRate();

  root.innerHTML = head(st) +
    '<p class="body">Produce one output that passes every check you wrote and is still wrong. Then rewrite the check. ' +
    'The finding is not that you fixed it. The finding is the size of the gap between your own cases and cases ' +
    'you have never seen.</p>' +

    '<div class="anchor">' + ic('trending-up') +
    '<div><strong>This stage is marked higher than stage 5.</strong> A clean pass on your own set proves your set is ' +
    'easy. Finding your own blind spot is the work.</div></div>' +

    '<div class="bench"><div class="bench-title">' + ic('bug') + 'The passing wrong output</div>' +
    '<p class="bench-intro">Write a ticket and the output your process would give for it. Run it through your own ' +
    'grader. You want a green pass on an answer you know is wrong.</p>' +
    '<div class="field"><label class="label" for="f-et">Ticket text</label>' +
    '<textarea class="textarea" id="f-et" placeholder="Not sour, not watery, arrived fine, but…"></textarea></div>' +
    '<div class="field"><label class="label" for="f-eo">The output that beats your grader <span class="hint">JSON matching the contract</span></label>' +
    '<textarea class="textarea mono" id="f-eo" placeholder=\'{"condition":"...","route":"...","escalate":false}\'></textarea></div>' +
    '<div class="field"><label class="label">What did you write as the expected output for this ticket?</label>' +
    '<div class="expect-row">' +
    '<div><label>expected condition</label><select class="input input--sm" id="x-ec">' +
    ['', 'warm', 'sour', 'watery', 'other', 'none'].map(v => '<option value="' + v + '">' + (v || '—') + '</option>').join('') + '</select></div>' +
    '<div><label>expected route</label><input class="input input--sm" id="x-er" /></div>' +
    '<div><label>expected escalate</label><select class="input input--sm" id="x-ee"><option value="false">false</option><option value="true">true</option></select></div>' +
    '</div></div>' +
    '<div class="row-wrap"><button class="btn btn--primary btn--sm" id="testExploit">' + ic('gavel') + ' Run it through my grader</button></div>' +
    '<div id="exres"></div></div>' +

    '<div class="bench"><div class="bench-title">' + ic('wrench') + 'Rewrite the check</div>' +
    '<p class="bench-intro">Go back to stage 5, change the grader, then come back and re-run your cases. ' +
    'Record the pass rate on your own set before and after.</p>' +
    '<div class="row-wrap">' +
    '<button class="btn btn--secondary btn--sm" id="snapBefore">' + ic('camera') + ' Snapshot as "before"</button>' +
    '<button class="btn btn--secondary btn--sm" id="snapAfter">' + ic('camera') + ' Snapshot as "after"</button>' +
    '<span class="caption mono" id="snapNow"></span></div>' +
    '<div class="field" style="margin-top:14px"><label class="label" for="f-rw">What you changed, and why it closes the hole</label>' +
    '<textarea class="textarea" id="f-rw"></textarea></div>' +
    '<div id="snapres"></div></div>' +

    '<div class="bench"><div class="bench-title">' + ic('lock') + 'The hidden set' +
    '<span class="spacer"></span><span class="caption mono" id="hidstate"></span></div>' +
    '<p class="bench-intro">Ten cases you have never seen, held by the facilitator. They run your prompt and your ' +
    'grader untouched. Your own pass rate should rise after tuning. This one should not.</p>' +
    '<div id="hidbox"></div></div>';

  ['et', 'eo', 'rw'].forEach(k => {
    const f = $('#f-' + k, root);
    const key = k === 'et' ? 'exploitTicket' : k === 'eo' ? 'exploitOut' : 'rewrite';
    f.value = S.s6[key];
    f.addEventListener('input', () => {
      S.s6[key] = f.value;
      // A frozen verdict belongs to the exploit that was tested. Change the
      // exploit and the verdict is stale, so it goes and has to be re-earned.
      if (key !== 'rewrite') {
        S.s6.exploitVerdict = null; S.s6.graderSaid = null; S.s6.humanWrong = null;
        paintEx();
      }
      save(); updateGate();
    });
  });

  if (!S.s6.exp) S.s6.exp = { condition: '', route: '', escalate: 'false' };
  const xec = $('#x-ec', root), xer = $('#x-er', root), xee = $('#x-ee', root);
  xec.value = S.s6.exp.condition; xer.value = S.s6.exp.route; xee.value = S.s6.exp.escalate;
  // Changing what you expected changes what the verdict meant, so it is re-earned.
  const clearVerdict = () => {
    S.s6.exploitVerdict = null; S.s6.graderSaid = null; S.s6.humanWrong = null;
    paintEx(); updateGate();
  };
  xec.addEventListener('change', () => { S.s6.exp.condition = xec.value; clearVerdict(); save(); });
  xer.addEventListener('input', () => { S.s6.exp.route = xer.value; clearVerdict(); save(); });
  xee.addEventListener('change', () => { S.s6.exp.escalate = xee.value; clearVerdict(); save(); });

  $('#testExploit', root).addEventListener('click', () => {
    const p = LLM.parseContract(S.s6.exploitOut);
    if (!p.ok) { toast('That is not the contract JSON: ' + p.error, 'bad'); return; }
    const fake = {
      id: 'EXPLOIT', input: S.s6.exploitTicket, exp: S.s6.exp,
      out: p.value, raw: S.s6.exploitOut, err: '',
    };
    const g = gradeCase(fake);
    S.s6.graderSaid = g.pass;
    S.s6.exploitVerdict = { pass: g.pass, checks: g.checks, grader: S.s5.grader.mode };
    save();
    paintEx();
    updateGate();
  });

  // What the grader would say about the exploit right now, as opposed to what it
  // said when the exploit was tested. Only used to report that the fix landed.
  function regradeExploit() {
    const p = LLM.parseContract(S.s6.exploitOut);
    if (!p.ok) return null;
    return gradeCase({ id: 'EXPLOIT', input: S.s6.exploitTicket, exp: S.s6.exp, out: p.value, raw: S.s6.exploitOut, err: '' });
  }

  function paintEx() {
    const box = $('#exres', root);
    const v = S.s6.exploitVerdict;
    if (!v) { box.innerHTML = ''; return; }

    const now = regradeExploit();
    const closed = v.pass && now && !now.pass;

    box.innerHTML =
      '<div class="checkline" style="margin-top:12px">' + v.checks.map(x =>
        '<span class="chk ' + (x.pass ? 'y' : 'n') + '" title="' + esc(x.note) + '">' + x.name + ' ' + (x.pass ? '✓' : '✗') + '</span>'
      ).join('') + '</div>' +
      (v.pass
        ? '<div class="anchor">' + ic('siren') + '<div><strong>Your grader passed it.</strong> Now say whether it is actually right.</div></div>' +
          '<div class="picks row-wrap">' +
          '<button class="pick' + (S.s6.humanWrong === true ? ' sel no' : '') + '" id="hw">It is wrong. This is the exploit.</button>' +
          '<button class="pick' + (S.s6.humanWrong === false ? ' sel yes' : '') + '" id="hr">It is right. Not an exploit.</button>' +
          '</div>'
        : '<div class="anchor warnbox">' + ic('x-circle') + '<div>Your grader caught it, so it is not an exploit yet. ' +
          'Look at the check that failed and find an output that gets past it.</div></div>') +
      (closed
        ? '<div class="anchor"style="margin-top:10px">' + ic('check-circle-2') + '<div><strong>Your rewritten grader now catches this.</strong> ' +
          'That is the fix landing. The verdict above is the one your grader gave at the time, on the ' +
          esc(v.grader || 'original') + ' check, and it stays on the record &mdash; it is the evidence the ' +
          'rewrite was needed.</div></div>'
        : '');
    const hw = $('#hw', box), hr = $('#hr', box);
    if (hw) hw.addEventListener('click', () => { S.s6.humanWrong = true; save(); paintEx(); updateGate(); });
    if (hr) hr.addEventListener('click', () => { S.s6.humanWrong = false; save(); paintEx(); updateGate(); });
    icons();
  }
  paintEx();

  function pct(p) { return p ? Math.round(p.pass / p.total * 100) : null; }
  function paintSnaps() {
    const now = ownPassRate();
    $('#snapNow', root).textContent = now ? 'own set right now: ' + pct(now) + '% (' + now.pass + '/' + now.total + ')' : 'no runs yet';
    const a = S.s6;
    const box = $('#snapres', root);
    if (a.before === null && a.after === null) { box.innerHTML = ''; return; }
    const moved = a.before !== null && a.after !== null && a.after !== a.before;
    box.innerHTML = '<div class="scorecard">' +
      '<div class="sc"><b>Own set, before</b><div class="v">' + (a.before === null ? '—' : a.before + '%') + '</div></div>' +
      '<div class="sc"><b>Own set, after</b><div class="v ' + (moved ? 'good' : '') + '">' + (a.after === null ? '—' : a.after + '%') + '</div></div>' +
      '<div class="sc"><b>Hidden set</b><div class="v ' + (a.hidden.ran ? (a.hidden.pass / a.hidden.total < 0.8 ? 'warn' : 'good') : '') + '">' +
      (a.hidden.ran ? Math.round(a.hidden.pass / a.hidden.total * 100) + '%' : '—') + '</div></div>' +
      '</div>' +
      (a.before !== null && a.after !== null && !moved
        ? '<div class="anchor warnbox">' + ic('alert-triangle') + '<div>Your own pass rate did not move. Either the rewrite ' +
          'changed nothing, or you snapshotted twice without re-running the cases.</div></div>' : '');
  }
  $('#snapBefore', root).addEventListener('click', () => {
    const p = ownPassRate(); if (!p) { toast('Run your cases first.', 'bad'); return; }
    S.s6.before = pct(p); S.s6.hiddenBefore = S.s6.hidden.ran ? Math.round(S.s6.hidden.pass / S.s6.hidden.total * 100) : null;
    save(); paintSnaps(); updateGate(); toast('Before = ' + S.s6.before + '%', 'good');
  });
  $('#snapAfter', root).addEventListener('click', () => {
    const p = ownPassRate(); if (!p) { toast('Run your cases first.', 'bad'); return; }
    S.s6.after = pct(p); save(); paintSnaps(); updateGate(); toast('After = ' + S.s6.after + '%', 'good');
  });
  paintSnaps();

  /* --- hidden set --- */
  function paintHidden() {
    const box = $('#hidbox', root), stt = $('#hidstate', root);
    if (!FAC) {
      stt.textContent = 'locked';
      box.innerHTML = '<div class="anchor warnbox">' + ic('key-round') +
        '<div>The hidden set is released by your facilitator, on request, once your rewrite is done. ' +
        'They unlock it from the Facilitator panel in the sidebar.</div></div>';
      icons(); return;
    }
    stt.textContent = 'unlocked · ' + FAC.hidden.length + ' cases';
    const h = S.s6.hidden;
    box.innerHTML =
      '<div class="row-wrap"><button class="btn btn--primary btn--sm" id="runHid">' + ic('zap') + ' Run the hidden set</button>' +
      '<span class="caption mono" id="hidNote">' + (h.ran ? h.pass + ' / ' + h.total + ' passed' : '') + '</span></div>' +
      (h.ran ? '<div class="cases" style="margin-top:14px">' + h.rows.map(r =>
        '<div class="case ' + (r.pass ? 'pass' : 'fail') + '"><div class="case-head">' +
        '<span class="cid">' + esc(r.id) + '</span><span class="csrc">' + esc(r.cls) + '</span>' +
        '<span class="spacer"></span><span class="chk ' + (r.pass ? 'y' : 'n') + '">' + (r.pass ? 'pass' : 'fail') + '</span></div>' +
        '<div class="tk caption">' + esc(r.input) + '</div>' +
        '<div class="outbox">expected ' + esc(JSON.stringify(r.expect)) + '\ngot      ' + esc(r.got == null ? (r.err || 'nothing') : JSON.stringify(r.got)) + '</div>' +
        '</div>'
      ).join('') + '</div>' : '') +
      (h.ran ? hiddenVerdict() : '');

    const b = $('#runHid', box);
    if (b) b.addEventListener('click', runHidden);
    icons();
  }

  function hiddenVerdict() {
    const h = S.s6.hidden, own = S.s6.after != null ? S.s6.after : (ownPassRate() ? pct(ownPassRate()) : null);
    const hp = Math.round(h.pass / h.total * 100);
    if (own == null) return '';
    const gap = own - hp;
    return '<div class="anchor' + (gap > 15 ? ' warnbox' : '') + '">' + ic(gap > 15 ? 'alert-triangle' : 'check-circle-2') +
      '<div><strong>Own set ' + own + '%, hidden set ' + hp + '%.</strong> ' +
      (gap > 15
        ? 'A gap that size is the finding. Your cases and your grader were tuned together against each other. ' +
          'Write it up as it is &mdash; an honest gap scores above a clean pass.'
        : 'The two are close. Either your set genuinely covers the space, or the hidden set happened to look like yours. ' +
          'Say which you think it is and why.') +
      '</div></div>';
  }

  async function runHidden() {
    if (!LLM.ready()) { toast('Add a provider key first.', 'bad'); return; }
    if (!nz(S.s5.prompt)) { toast('No prompt to run.', 'bad'); return; }
    const b = $('#runHid', root); if (b) b.disabled = true;
    const note = $('#hidNote', root); if (note) note.textContent = 'running…';

    const res = await LLM.batch(FAC.hidden,
      async (hc) => {
        const r = await LLM.chat(S.s5.prompt, hc.input, {
          json: true, maxTokens: 300,
          onRetry: e => { if (note) note.textContent = 'rate limited, waiting ' + Math.round(e.waitMs / 100) / 10 + 's (retry ' + e.attempt + ' of ' + e.of + ')'; },
        });
        Ledger.add(S.ledger, { stage: 's6', purpose: 'hidden', caseId: hc.id, model: r.model, in: r.usage.in, out: r.usage.out });
        return r;
      },
      (d, t) => { if (note) note.textContent = 'running ' + d + ' / ' + t; }
    );

    const rows = FAC.hidden.map((hc, i) => {
      const r = res[i];
      if (!r.ok) return { id: hc.id, cls: hc.class, input: hc.input, expect: hc.expect, got: null, err: r.error, pass: false };
      const p = LLM.parseContract(r.value.text);
      if (!p.ok) return { id: hc.id, cls: hc.class, input: hc.input, expect: hc.expect, got: null, err: p.error, pass: false };
      const fake = {
        id: hc.id, input: hc.input, raw: r.value.text, out: p.value,
        exp: { condition: hc.expect.condition, route: hc.expect.route || '', escalate: String(hc.expect.escalate) },
      };
      const g = gradeCase(fake);
      return { id: hc.id, cls: hc.class, input: hc.input, expect: hc.expect, got: p.value, err: '', pass: g.pass };
    });

    S.s6.hidden = { ran: true, total: rows.length, pass: rows.filter(r => r.pass).length, rows };
    save(); paintHidden(); paintSnaps(); updateGate();
    toast('Hidden set: ' + S.s6.hidden.pass + ' of ' + S.s6.hidden.total + ' passed.', 'good');
  }

  paintHidden();
  mountTimer(st);
};

/* ---- 7. guardrails ---- */
function ruleTerms(rule) {
  return String(rule || '').split(',').map(s => s.trim()).filter(Boolean).map(t => {
    const m = t.match(/^\/(.*)\/([a-z]*)$/);
    try { return m ? new RegExp(m[1], m[2] || 'i') : new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); }
    catch (e) { return null; }
  }).filter(Boolean);
}
function ruleFires(rule, text) {
  const rs = ruleTerms(rule);
  if (!rs.length) return null;
  return rs.some(r => r.test(String(text || '')));
}

R.s7 = function (root, st) {
  root.className = 'step step--eval';
  root.innerHTML = head(st) +
    '<p class="body">Three boundaries: what the system must never output or do. For each one, a rule the machine ' +
    'can apply, one thing it should catch, and one thing it will wrongly catch. Then test it on output from a ' +
    'run that actually happened.</p>' +

    '<div class="anchor">' + ic('shield-alert') +
    '<div><strong>A guard with no false positive has not been thought about.</strong> Every rule that fires on ' +
    'something real also fires on something innocent. Name it before the client finds it.</div></div>' +

    '<div class="bench"><div class="bench-title">' + ic('terminal') + 'How a rule is written</div>' +
    '<p class="bench-intro">Comma-separated terms. A plain word matches anywhere, case-insensitively. ' +
    'Wrap in slashes for a regular expression, for example <code>/\\b\\d{4}-x{3}-\\d{3}\\b/</code> for a masked ' +
    'subscriber number. The guard fires if any term matches.</p></div>' +

    '<div id="guards"></div>';

  const pool = [].concat(
    S.s5.cases.filter(c => c.raw).map(c => ({ id: c.id, label: 'stage 5 · ' + c.id, text: c.raw })),
    (S.s6.hidden.rows || []).filter(r => r.got).map(r => ({ id: r.id, label: 'hidden · ' + r.id, text: JSON.stringify(r.got) }))
  );

  function render() {
    const box = $('#guards', root);
    box.innerHTML = '';
    S.s7.guards.forEach((g, i) => {
      const node = el(
        '<div class="guard' + (guardReady(g) ? ' ready' : '') + '">' +
        '<div class="guard-head"><span class="gnum">' + (i + 1) + '</span>' +
        '<input class="input input--sm nm" placeholder="The system must never…" /></div>' +
        '<div class="field"><label class="label">Rule <span class="hint">comma-separated terms or /regex/</span></label>' +
        '<input class="input input--sm mono rl" /></div>' +
        '<div class="guard-grid">' +
        '<div class="field" style="margin:0"><label class="label">One catch <span class="hint">text this must stop</span></label>' +
        '<textarea class="textarea textarea--sm ct" style="min-height:64px"></textarea><div class="caption cres"></div></div>' +
        '<div class="field" style="margin:0"><label class="label">One false positive <span class="hint">innocent text it stops anyway</span></label>' +
        '<textarea class="textarea textarea--sm fp" style="min-height:64px"></textarea><div class="caption fres"></div></div>' +
        '</div>' +
        '<div class="testres"><div class="glabel" style="margin-top:0">Test on a real run</div>' +
        '<div class="row-wrap" style="margin-top:0">' +
        '<select class="input input--sm ts" style="max-width:240px"><option value="">pick a real output…</option>' +
        pool.map(p => '<option value="' + esc(p.id) + '">' + esc(p.label) + '</option>').join('') + '</select>' +
        '<button class="btn btn--secondary btn--sm run">' + ic('play') + ' Test</button>' +
        '<span class="tout caption mono"></span></div>' +
        '<input class="input input--sm tn" style="margin-top:10px" placeholder="What the test showed" /></div>' +
        '</div>'
      );
      const nm = $('.nm', node), rl = $('.rl', node), ct = $('.ct', node), fp = $('.fp', node),
            ts = $('.ts', node), tn = $('.tn', node);
      nm.value = g.name; rl.value = g.rule; ct.value = g.cat; fp.value = g.fp; ts.value = g.testId; tn.value = g.testNote;

      function paintSamples() {
        const c = ruleFires(g.rule, g.cat), f = ruleFires(g.rule, g.fp);
        $('.cres', node).innerHTML = !nz(g.rule) || !nz(g.cat) ? '' :
          c ? '<span class="ok-t">rule fires · caught</span>' : '<span class="err-t">rule does not fire · this would get through</span>';
        $('.fres', node).innerHTML = !nz(g.rule) || !nz(g.fp) ? '' :
          f ? '<span class="warn-t">rule fires · confirmed false positive</span>' : '<span class="mut">rule does not fire, so this is not a false positive of this rule</span>';
      }
      nm.addEventListener('input', () => { g.name = nm.value; save(); updateGate(); });
      rl.addEventListener('input', () => { g.rule = rl.value; paintSamples(); save(); updateGate(); });
      ct.addEventListener('input', () => { g.cat = ct.value; paintSamples(); save(); updateGate(); });
      fp.addEventListener('input', () => { g.fp = fp.value; paintSamples(); save(); updateGate(); });
      ts.addEventListener('change', () => { g.testId = ts.value; save(); });
      tn.addEventListener('input', () => { g.testNote = tn.value; save(); });

      $('.run', node).addEventListener('click', () => {
        const p = pool.find(x => x.id === ts.value);
        if (!p) { toast('Pick a real output first. Run stage 5 if the list is empty.', 'bad'); return; }
        if (!nz(g.rule)) { toast('Write the rule first.', 'bad'); return; }
        const fired = ruleFires(g.rule, p.text);
        g.testFired = fired; g.testId = p.id;
        $('.tout', node).innerHTML = fired
          ? '<span class="warn-t">fired on ' + esc(p.label) + '</span>'
          : '<span class="ok-t">did not fire on ' + esc(p.label) + '</span>';
        save(); render(); updateGate();
      });

      if (g.testFired !== null && g.testId) {
        const p = pool.find(x => x.id === g.testId);
        $('.tout', node).innerHTML = (g.testFired ? '<span class="warn-t">fired' : '<span class="ok-t">did not fire') +
          ' on ' + esc(p ? p.label : g.testId) + '</span>';
      }
      paintSamples();
      box.appendChild(node);
    });
    icons();
  }
  render();
  if (!pool.length) {
    $('#guards', root).insertAdjacentHTML('afterbegin',
      '<div class="anchor warnbox">' + ic('alert-triangle') +
      '<div>There are no real run outputs to test against yet. Go back to stage 5 and run your cases.</div></div>');
    icons();
  }
  mountTimer(st);
};

/* ---- 8. price it ---- */
R.s8 = function (root, st) {
  root.className = 'step step--wide';
  const t = s5Tokens();
  const price = LLM.priceFor(S.provider, S.model);
  if (S.s8.pin == null && price) S.s8.pin = price.in;
  if (S.s8.pout == null && price) S.s8.pout = price.out;

  root.innerHTML = head(st) +
    '<p class="body">Tokens per unit of work, cost per month at the client\'s volume, and the cost of checking ' +
    'against the cost of doing. Every token figure below comes out of a real API response recorded in this ' +
    'session. Nothing on this page is a guess except the prices, and those you verify.</p>' +

    (t.calls
      ? ''
      : '<div class="anchor warnbox">' + ic('alert-triangle') +
        '<div><strong>No measured runs.</strong> Stage 8 cannot be built from estimates. Go back to stage 5 and run your cases.</div></div>') +

    '<div class="bench"><div class="bench-title">' + ic('activity') + 'Measured, from ' + t.calls + ' calls</div>' +
    '<div class="scorecard">' +
    '<div class="sc"><b>Input tokens / ticket</b><div class="v">' + (t.calls ? fmt(t.in) : '—') + '</div><div class="s">mean over your runs</div></div>' +
    '<div class="sc"><b>Output tokens / ticket</b><div class="v">' + (t.calls ? fmt(t.out) : '—') + '</div><div class="s">mean over your runs</div></div>' +
    '<div class="sc"><b>Model calls / ticket</b><div class="v">1</div><div class="s">one classification, no agent loop</div></div>' +
    '</div>' +
    '<div class="glabel">Fixed prefix</div>' +
    '<p class="bench-intro">How much of each request is the same every time? Measure it: one call with your ' +
    'system prompt and an empty ticket. Whatever that costs is what caching would take off the top.</p>' +
    '<div class="row-wrap"><button class="btn btn--secondary btn--sm" id="probeBtn">' + ic('ruler') + ' Measure the fixed prefix</button>' +
    '<span class="caption mono" id="probeNote">' + (S.s8.prefix ? S.s8.prefix + ' tokens fixed' : 'not measured') + '</span></div>' +
    '<div id="splitBox"></div></div>' +

    '<div class="bench"><div class="bench-title">' + ic('sliders-horizontal') + 'The client\'s volume and your prices</div>' +
    '<div class="costgrid">' +
    '<div>' +
    '<div class="field"><label class="label" for="v-vol">DISP-07 tickets per day <span class="hint">Tier 2, at Q2 volume</span></label>' +
    '<input type="range" id="v-vol" min="' + VOLUME_RANGE[0] + '" max="' + VOLUME_RANGE[1] + '" style="width:100%" />' +
    '<div class="caption mono" id="volNote"></div></div>' +
    '<div class="field"><label class="label" for="v-fx">USD to INR</label><input class="input input--sm" id="v-fx" type="number" step="0.5" /></div>' +
    '</div>' +
    '<div>' +
    '<div class="field"><label class="label" for="v-pin">Input, USD per 1M tokens</label><input class="input input--sm" id="v-pin" type="number" step="0.01" /></div>' +
    '<div class="field"><label class="label" for="v-pout">Output, USD per 1M tokens</label><input class="input input--sm" id="v-pout" type="number" step="0.01" /></div>' +
    '<p class="caption mut">Pre-filled from this app\'s table for ' + esc(S.model || 'your model') + '. ' +
    'Prices move. Check your provider\'s page before you put a number in front of the client.</p>' +
    '</div></div></div>' +

    '<div class="bench"><div class="bench-title">' + ic('receipt-indian-rupee') + 'The cost sheet</div>' +
    '<div id="sheet"></div></div>' +

    '<div class="bench"><div class="bench-title">' + ic('message-square-quote') + 'Five lines for the client' +
    '<span class="spacer"></span><span class="linecount" id="lc"></span></div>' +
    '<p class="bench-intro">No jargon, no token counts they did not ask for. What it costs a month, what drives ' +
    'that number, and what happens to it if volume doubles. The client has to be able to repeat it.</p>' +
    '<textarea class="textarea" id="f-five" style="min-height:130px"></textarea></div>';

  const vol = $('#v-vol', root), fx = $('#v-fx', root), pin = $('#v-pin', root), pout = $('#v-pout', root), five = $('#f-five', root);
  vol.value = S.s8.volume; fx.value = S.s8.fx; pin.value = S.s8.pin == null ? '' : S.s8.pin; pout.value = S.s8.pout == null ? '' : S.s8.pout;
  five.value = S.s8.five;

  function sheet() {
    $('#volNote', root).textContent = S.s8.volume + ' per day · ' + (S.s8.volume * S.s8.days) + ' per month';
    const box = $('#sheet', root);
    if (!t.calls) { box.innerHTML = '<p class="caption mut">Nothing to cost until stage 5 has run.</p>'; return; }
    const PIN = Number(S.s8.pin) || 0, POUT = Number(S.s8.pout) || 0, FX = Number(S.s8.fx) || 1;
    const perTicketUSD = (t.in / 1e6) * PIN + (t.out / 1e6) * POUT;
    const perMonth = perTicketUSD * S.s8.volume * S.s8.days;
    const evalCases = S.s5.cases.filter(c => c.out).length || CASE_TARGET;
    const checkPerRelease = perTicketUSD * evalCases;
    const ratio = perMonth > 0 ? checkPerRelease / perMonth : 0;
    const cacheable = S.s8.prefix ? (S.s8.prefix / 1e6) * PIN * S.s8.volume * S.s8.days : null;

    box.innerHTML =
      '<div class="tblwrap"><table class="uc"><tbody>' +
      '<tr><td>Cost per ticket</td><td class="num">$' + perTicketUSD.toFixed(6) + '</td><td class="num">Rs ' + (perTicketUSD * FX).toFixed(4) + '</td></tr>' +
      '<tr><td>Tickets per month</td><td class="num">' + fmt(S.s8.volume * S.s8.days) + '</td><td class="num"></td></tr>' +
      '<tr class="tot"><td>Cost of doing, per month</td><td class="num">$' + perMonth.toFixed(2) + '</td><td class="num">Rs ' + fmt(perMonth * FX, 0) + '</td></tr>' +
      '</tbody></table></div>' +

      '<div class="glabel">Checking against doing</div>' +
      '<div class="tblwrap"><table class="uc"><tbody>' +
      '<tr><td>Eval set, one release</td><td class="num">' + evalCases + ' cases</td><td class="num">$' + checkPerRelease.toFixed(4) + '</td></tr>' +
      '<tr><td>As a share of one month of doing</td><td class="num">' + (ratio * 100).toFixed(2) + '%</td>' +
      '<td class="num">' + (ratio < 0.05 ? 'cheap to check' : ratio < 0.25 ? 'worth watching' : 'checking is expensive') + '</td></tr>' +
      '</tbody></table></div>' +
      '<div class="anchor">' + ic('scale') + '<div><strong>Read that ratio out loud.</strong> If checking costs a ' +
      'rounding error against doing, you have no excuse for shipping a change without running the set. ' +
      'If it does not, that is a design finding and it belongs in your pitch.</div></div>' +

      (cacheable !== null
        ? '<div class="glabel">What caching would save</div>' +
          '<div class="tblwrap"><table class="uc"><tbody>' +
          '<tr><td>Fixed prefix (SOP, route list, instructions)</td><td class="num">' + fmt(S.s8.prefix) + ' tokens</td>' +
          '<td class="num">' + Math.round(S.s8.prefix / t.in * 100) + '% of input</td></tr>' +
          '<tr><td>Monthly spend on that prefix</td><td class="num">$' + cacheable.toFixed(2) + '</td>' +
          '<td class="num">Rs ' + fmt(cacheable * FX, 0) + '</td></tr>' +
          '<tr><td>Recoverable at a 90% cache discount</td><td class="num">$' + (cacheable * 0.9).toFixed(2) + '</td>' +
          '<td class="num">Rs ' + fmt(cacheable * 0.9 * FX, 0) + '</td></tr>' +
          '</tbody></table></div>'
        : '');
  }

  function splitBox() {
    const box = $('#splitBox', root);
    if (!S.s8.prefix || !t.calls) { box.innerHTML = ''; return; }
    const fixedPct = clamp(Math.round(S.s8.prefix / t.in * 100), 0, 100);
    box.innerHTML = '<div class="splitbar">' +
      '<i class="fixed" style="width:' + fixedPct + '%">' + (fixedPct > 18 ? 'fixed ' + fixedPct + '%' : '') + '</i>' +
      '<i class="var" style="width:' + (100 - fixedPct) + '%">' + (100 - fixedPct > 18 ? 'ticket ' + (100 - fixedPct) + '%' : '') + '</i>' +
      '</div><p class="caption mut">Of ' + fmt(t.in) + ' input tokens per ticket, ' + fmt(S.s8.prefix) +
      ' are the same every single time.</p>';
  }

  vol.addEventListener('input', () => { S.s8.volume = Number(vol.value); sheet(); save(); });
  fx.addEventListener('input', () => { S.s8.fx = Number(fx.value); sheet(); save(); });
  pin.addEventListener('input', () => { S.s8.pin = Number(pin.value); sheet(); save(); });
  pout.addEventListener('input', () => { S.s8.pout = Number(pout.value); sheet(); save(); });

  five.addEventListener('input', () => {
    S.s8.five = five.value;
    const n = lines(five.value).length;
    const lc = $('#lc', root);
    lc.textContent = n + ' / 5 lines';
    lc.className = 'linecount' + (n > 5 ? ' bad' : '');
    save(); updateGate();
  });
  $('#lc', root).textContent = lines(S.s8.five).length + ' / 5 lines';

  $('#probeBtn', root).addEventListener('click', async () => {
    if (!LLM.ready()) { toast('Add a provider key first.', 'bad'); return; }
    if (!nz(S.s5.prompt)) { toast('No system prompt to measure.', 'bad'); return; }
    const b = $('#probeBtn', root); b.disabled = true;
    $('#probeNote', root).textContent = 'measuring…';
    try {
      const r = await LLM.chat(S.s5.prompt, '', { maxTokens: 16 });
      Ledger.add(S.ledger, { stage: 's8', purpose: 'prefix', model: r.model, in: r.usage.in, out: r.usage.out });
      S.s8.prefix = r.usage.in;
      $('#probeNote', root).textContent = fmt(r.usage.in) + ' tokens fixed';
      save(); splitBox(); sheet();
      toast('Fixed prefix measured: ' + fmt(r.usage.in) + ' input tokens.', 'good');
    } catch (e) {
      $('#probeNote', root).textContent = 'failed';
      toast(e.message, 'bad');
    }
    b.disabled = false;
  });

  sheet(); splitBox();
  mountTimer(st);
};

/* ---- 9. submit ---- */
R.submit = function (root, st) {
  root.className = 'step';
  const done = STAGES.slice(1, 9).map(s => ({ s, g: GATES[s.id]() }));
  const nOk = done.filter(d => d.g.ok).length;

  root.innerHTML = head(st) +
    '<p class="subtitle">One folder: questions, observation, hypothesis and test, client sign-off, control graph, ' +
    'eval file and run output, hand labels, the passing wrong output, guardrails with catches, cost sheet, ' +
    'five-line client explanation.</p>' +

    '<div class="scorecard">' +
    '<div class="sc"><b>Stages complete</b><div class="v ' + (nOk === 8 ? 'good' : 'warn') + '">' + nOk + ' / 8</div></div>' +
    '<div class="sc"><b>Model calls made</b><div class="v">' + S.ledger.length + '</div><div class="s">recorded in the ledger</div></div>' +
    '<div class="sc"><b>Tokens spent</b><div class="v">' + fmt(Ledger.totals(S.ledger).in + Ledger.totals(S.ledger).out) + '</div></div>' +
    '</div>' +

    '<div class="bench"><div class="bench-title">' + ic('list-checks') + 'What is still open</div>' +
    '<div class="tblwrap"><table class="uc"><tbody>' +
    done.map(d => '<tr><td>' + d.s.num + '. ' + esc(d.s.title) + '</td>' +
      '<td class="num">' + (d.g.ok ? '<span class="ok-t">done</span>' : '<span class="err-t">open</span>') + '</td>' +
      '<td>' + esc(d.g.why) + '</td></tr>').join('') +
    '</tbody></table></div></div>' +

    '<div class="bench"><div class="bench-title">' + ic('download') + 'Download the bundle</div>' +
    '<p class="bench-intro">Two files. The Markdown is what a human reads. The JSON carries your raw runs, ' +
    'the ledger, and every token count, so the numbers can be checked against your claims.</p>' +
    '<div class="row-wrap">' +
    '<button class="btn btn--primary btn--sm" id="dlMd">' + ic('file-text') + ' submission.md</button>' +
    '<button class="btn btn--secondary btn--sm" id="dlJson">' + ic('file-json') + ' submission.json</button>' +
    '<button class="btn btn--ghost btn--sm" id="dlState">' + ic('save') + ' Back up my state</button>' +
    '</div></div>' +

    '<div class="anchor">' + ic('trophy') +
    '<div><strong>Stage 6 outweighs stage 5.</strong> If your gap table is honest and your pass rate fell on ' +
    'the hidden set, say so plainly. That submission scores above a clean sheet.</div></div>';

  $('#dlMd', root).addEventListener('click', () => download('submission.md', buildMarkdown(), 'text/markdown'));
  $('#dlJson', root).addEventListener('click', () => download('submission.json', JSON.stringify(buildJson(), null, 2), 'application/json'));
  $('#dlState', root).addEventListener('click', () => download('a03-state.json', JSON.stringify(S, null, 2), 'application/json'));
};

/* ---------------- export ---------------- */

function download(name, text, mime) {
  const b = new Blob([text], { type: mime + ';charset=utf-8' });
  const u = URL.createObjectURL(b);
  const a = document.createElement('a');
  a.href = u; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
  toast('Saved ' + name, 'good');
}

function buildJson() {
  const t = s5Tokens(), ag = agreement(), pr = ownPassRate();
  return {
    assignment: 'Assignment 03 — From Client Brief to Costed System',
    client: 'Sahaj Fresh',
    generated: new Date().toISOString(),
    provider: { provider: S.provider, model: S.model },
    stage1: S.s1, stage2: S.s2, stage3: S.s3, stage4: S.s4,
    stage5: {
      prompt: S.s5.prompt, grader: S.s5.grader,
      cases: S.s5.cases.map(c => ({ id: c.id, src: c.src, cls: c.cls, input: c.input, expected: c.exp, output: c.out, raw: c.raw, error: c.err, grade: gradeCase(c) })),
      handLabels: S.s5.labels, agreement: ag, passRate: pr, whyNot: S.s5.whyNot,
    },
    stage6: S.s6,
    stage7: S.s7.guards,
    stage8: { measured: t, volumePerDay: S.s8.volume, daysPerMonth: S.s8.days, priceInPerM: S.s8.pin, priceOutPerM: S.s8.pout, fx: S.s8.fx, fixedPrefixTokens: S.s8.prefix, fiveLines: lines(S.s8.five) },
    ledger: S.ledger,
  };
}

function buildMarkdown() {
  const t = s5Tokens(), ag = agreement(), pr = ownPassRate();
  const PIN = Number(S.s8.pin) || 0, POUT = Number(S.s8.pout) || 0, FX = Number(S.s8.fx) || 1;
  const perTicket = t.calls ? (t.in / 1e6) * PIN + (t.out / 1e6) * POUT : 0;
  const perMonth = perTicket * S.s8.volume * S.s8.days;
  const L = [];
  const p = s => L.push(s);

  p('# Assignment 03 submission — Sahaj Fresh');
  p('');
  p('Generated ' + new Date().toLocaleString('en-IN') + ' · provider ' + S.provider + ' · model ' + (S.model || '—'));
  p('');
  p('> Client brief, verbatim: "' + CLIENT_BRIEF + '"');
  p('');

  p('## Stage 1 — Extract the problem');
  p('');
  p('### The questions');
  p('');
  S.s1.qs.forEach((q, i) => { if (nz(q.q)) { p((i + 1) + '. ' + q.q); if (nz(q.a)) p('   - Client said: ' + q.a); } });
  p('');
  p('### The observation');
  p('');
  p('- **Who:** ' + S.s1.who);
  p('- **What breaks:** ' + S.s1.what);
  p('- **Where:** ' + S.s1.where);
  p('- **In numbers:** ' + S.s1.nums);
  p('');

  p('## Stage 2 — Define good');
  p('');
  p('- **Baseline:** ' + S.s2.baseline);
  p('- **Source:** ' + S.s2.src);
  p('- **Hypothesis:** ' + S.s2.hyp);
  p('- **Falsifier:** ' + S.s2.fals);
  p('- **Cheapest manual test:** ' + S.s2.test);
  p('');

  p('## Stage 3 — Align');
  p('');
  p('### Pitch');
  p(''); p(S.s3.pitch); p('');
  p('### Pushback'); p(''); p(S.s3.pushback || '_none recorded_'); p('');
  p('### Sign-off');
  p('');
  p('**Verdict: ' + (S.s3.verdict || 'not recorded') + '** (' + (S.s3.at || '') + ')');
  p(''); p('> ' + String(S.s3.signoff || '').replace(/\n/g, '\n> ')); p('');

  p('## Stage 4 — The process');
  p('');
  p('- **Input:** ' + S.s4.input);
  p('- **Output:** ' + S.s4.output);
  p('');
  p('| # | Step | Kind | Why not deterministic |');
  p('|---|---|---|---|');
  S.s4.steps.forEach((s, i) => p('| ' + (i + 1) + ' | ' + s.name + ' | ' + s.kind + ' | ' + (s.kind === 'model' ? s.why : '—') + ' |'));
  p('');

  p('## Stage 5 — Evals');
  p('');
  p('### The prompt'); p(''); p('```'); p(S.s5.prompt); p('```'); p('');
  p('### The grader');
  p('');
  p('- Route checked exactly: ' + S.s5.grader.route);
  p('- Escalate checked exactly: ' + S.s5.grader.escalate);
  p('- Label judged by: ' + S.s5.grader.mode);
  if (S.s5.grader.mode !== 'exact') p('- Keywords: ' + JSON.stringify(S.s5.grader.kw));
  p('');
  p('### Cases and run output');
  p('');
  p('| ID | Class | Expected | Model output | Grade |');
  p('|---|---|---|---|---|');
  S.s5.cases.forEach(c => {
    if (!nz(c.input)) return;
    const g = gradeCase(c);
    p('| ' + c.id + ' | ' + (c.cls || '—') + ' | `' + JSON.stringify(c.exp) + '` | `' +
      (c.out ? JSON.stringify(c.out) : (c.err || 'not run')) + '` | ' + (g ? (g.pass ? 'pass' : 'fail') : '—') + ' |');
  });
  p('');
  if (pr) p('**Own-set pass rate: ' + pr.pass + ' / ' + pr.total + ' (' + Math.round(pr.pass / pr.total * 100) + '%)**');
  p('');
  p('### Hand labels against the grader');
  p('');
  if (ag) p('Agreement: **' + ag.agree + ' of ' + ag.n + '**.');
  Object.keys(S.s5.labels).forEach(id => {
    const c = S.s5.cases.find(x => x.id === id); if (!c) return;
    const g = gradeCase(c);
    p('- ' + id + ': I said ' + (S.s5.labels[id] === 'y' ? 'right' : 'wrong') + ', grader said ' + (g && g.pass ? 'pass' : 'fail'));
  });
  if (nz(S.s5.whyNot)) { p(''); p('**Why agreement is below eight:** ' + S.s5.whyNot); }
  p('');

  p('## Stage 6 — Breaking the evals');
  p('');
  p('### The output that passed every check and was wrong');
  p('');
  p('Ticket:'); p(''); p('> ' + String(S.s6.exploitTicket || '').replace(/\n/g, '\n> ')); p('');
  p('Output:'); p(''); p('```json'); p(S.s6.exploitOut); p('```'); p('');
  p('Grader verdict: **' + (S.s6.graderSaid ? 'passed' : 'failed') + '**. My verdict: **' +
    (S.s6.humanWrong ? 'wrong' : 'right') + '**.');
  p('');
  p('### The rewritten check'); p(''); p(S.s6.rewrite); p('');
  p('| Set | Pass rate |');
  p('|---|---|');
  p('| Own cases, before rewrite | ' + (S.s6.before == null ? '—' : S.s6.before + '%') + ' |');
  p('| Own cases, after rewrite | ' + (S.s6.after == null ? '—' : S.s6.after + '%') + ' |');
  p('| Hidden set | ' + (S.s6.hidden.ran ? Math.round(S.s6.hidden.pass / S.s6.hidden.total * 100) + '%' : 'not run') + ' |');
  p('');
  if (S.s6.hidden.ran) {
    p('Hidden set, case by case:');
    p('');
    p('| ID | Class | Expected | Got | Result |');
    p('|---|---|---|---|---|');
    S.s6.hidden.rows.forEach(r => p('| ' + r.id + ' | ' + r.cls + ' | `' + JSON.stringify(r.expect) + '` | `' +
      (r.got ? JSON.stringify(r.got) : r.err) + '` | ' + (r.pass ? 'pass' : 'fail') + ' |'));
    p('');
  }

  p('## Stage 7 — Guardrails');
  p('');
  S.s7.guards.forEach((g, i) => {
    p('### Guard ' + (i + 1) + ': ' + (g.name || 'unnamed'));
    p('');
    p('- **Rule:** `' + g.rule + '`');
    p('- **Catch:** ' + g.cat);
    p('- **False positive:** ' + g.fp);
    p('- **Tested on:** ' + (g.testId || 'not tested') + ' — rule ' + (g.testFired ? 'fired' : 'did not fire'));
    if (nz(g.testNote)) p('- **What the test showed:** ' + g.testNote);
    p('');
  });

  p('## Stage 8 — Cost sheet');
  p('');
  p('All token figures are measured from ' + t.calls + ' real API responses. None are estimated.');
  p('');
  p('| Line | Value |');
  p('|---|---|');
  p('| Input tokens per ticket (mean) | ' + (t.calls ? fmt(t.in) : '—') + ' |');
  p('| Output tokens per ticket (mean) | ' + (t.calls ? fmt(t.out) : '—') + ' |');
  p('| Fixed prefix, measured | ' + (S.s8.prefix ? fmt(S.s8.prefix) + ' tokens' : 'not measured') + ' |');
  p('| Price in / out, USD per 1M | ' + PIN + ' / ' + POUT + ' |');
  p('| Tickets per day | ' + S.s8.volume + ' |');
  p('| Cost per ticket | $' + perTicket.toFixed(6) + ' |');
  p('| **Cost of doing, per month** | **$' + perMonth.toFixed(2) + ' / Rs ' + fmt(perMonth * FX, 0) + '** |');
  const evalCases = S.s5.cases.filter(c => c.out).length || CASE_TARGET;
  const check = perTicket * evalCases;
  p('| Cost of checking, one release (' + evalCases + ' cases) | $' + check.toFixed(4) + ' |');
  p('| Checking as a share of doing | ' + (perMonth ? (check / perMonth * 100).toFixed(2) : '0') + '% |');
  p('');
  p('### Five lines for the client');
  p('');
  lines(S.s8.five).forEach(l => p(l + '  '));
  p('');
  p('---');
  p('');
  p('_Run ledger: ' + S.ledger.length + ' calls, ' + fmt(Ledger.totals(S.ledger).in) + ' input tokens, ' +
    fmt(Ledger.totals(S.ledger).out) + ' output tokens. Full detail in submission.json._');

  return L.join('\n');
}

/* ---------------- drawers ---------------- */

function openDrawer(title, html, after) {
  $('#drawerTitle').textContent = title;
  $('#drawerBody').innerHTML = html;
  $('#drawer').classList.add('open');
  $('#scrim').classList.add('open');
  icons();
  if (after) after($('#drawerBody'));
}
function closeDrawer() {
  $('#drawer').classList.remove('open');
  $('#scrim').classList.remove('open');
  $('#sidebar').classList.remove('open');
}

function setupDrawer() {
  const html =
    '<p class="body-sm mut">Stages 5 to 8 make real calls so your cost sheet is measured rather than guessed. ' +
    'Your key is kept in this browser\'s local storage, sent directly to the provider you pick, and never anywhere else. ' +
    'Use a throwaway key with a spend cap if you would rather.</p>' +
    '<div class="field"><label class="label">Provider</label><div class="row-wrap" id="provs">' +
    Object.keys(PROVIDERS).map(k => '<button class="pick" data-p="' + k + '">' + esc(PROVIDERS[k].label) + '</button>').join('') +
    '</div></div>' +
    '<div class="field"><label class="label" for="k-key">API key</label>' +
    '<input class="input mono" id="k-key" type="password" placeholder="paste key" autocomplete="off" />' +
    '<div class="help" id="keyHelp"></div></div>' +
    '<div class="field"><label class="label" for="k-model">Model</label><select class="input" id="k-model"></select></div>' +
    '<div class="row-wrap"><button class="btn btn--primary btn--sm" id="testKey">' + ic('plug-zap') + ' Test connection</button>' +
    '<span class="caption mono" id="testOut"></span></div>' +
    '<div class="glabel">Run ledger</div>' +
    '<div id="ledgerBox"></div>';

  openDrawer('Provider setup', html, box => {
    function paint() {
      $$('#provs .pick', box).forEach(b => b.className = 'pick' + (b.dataset.p === S.provider ? ' sel yes' : ''));
      const def = PROVIDERS[S.provider];
      $('#keyHelp', box).innerHTML = 'Get a key at <a href="' + def.keyUrl + '" target="_blank" rel="noopener" style="color:var(--accent-press);text-decoration:underline">' + esc(def.keyUrl) + '</a>';
      const sel = $('#k-model', box);
      sel.innerHTML = def.models.map(m => '<option value="' + esc(m.id) + '">' + esc(m.id) + '  ·  $' + m.in + ' in / $' + m.out + ' out per 1M</option>').join('');
      if (!def.models.some(m => m.id === S.model)) S.model = def.models[0].id;
      sel.value = S.model;
      $('#k-key', box).value = S.key;
      LLM.configure({ provider: S.provider, key: S.key, model: S.model });
      updateChrome();

      const rows = S.ledger.slice(-8).reverse();
      $('#ledgerBox', box).innerHTML = rows.length
        ? '<div class="tblwrap"><table class="uc"><thead><tr><th>stage</th><th>purpose</th><th>in</th><th>out</th></tr></thead><tbody>' +
          rows.map(r => '<tr><td>' + r.stage + '</td><td>' + r.purpose + (r.caseId ? ' ' + r.caseId : '') + '</td>' +
            '<td class="num">' + fmt(r.in || 0) + '</td><td class="num">' + fmt(r.out || 0) + '</td></tr>').join('') +
          '</tbody></table></div><p class="caption mut">' + S.ledger.length + ' calls total. Stage 8 reads this and nothing else.</p>'
        : '<p class="caption mut">No calls yet.</p>';
    }
    $$('#provs .pick', box).forEach(b => b.addEventListener('click', () => {
      S.provider = b.dataset.p; S.s8.pin = null; S.s8.pout = null; save(); paint();
    }));
    $('#k-key', box).addEventListener('input', e => { S.key = e.target.value.trim(); LLM.configure({ key: S.key }); save(); updateChrome(); });
    $('#k-model', box).addEventListener('change', e => {
      S.model = e.target.value;
      const p = LLM.priceFor(S.provider, S.model);
      if (p) { S.s8.pin = p.in; S.s8.pout = p.out; }
      LLM.configure({ model: S.model }); save(); updateChrome();
    });
    $('#testKey', box).addEventListener('click', async () => {
      const out = $('#testOut', box);
      out.textContent = 'calling…';
      try {
        const r = await LLM.chat('Reply with the single word: ready', 'ping', { maxTokens: 10 });
        Ledger.add(S.ledger, { stage: 'setup', purpose: 'test', model: r.model, in: r.usage.in, out: r.usage.out });
        save(); paint();
        out.innerHTML = '<span class="ok-t">' + esc((r.text || '').trim().slice(0, 30)) + ' · ' + r.usage.in + ' in / ' + r.usage.out + ' out</span>';
      } catch (e) {
        out.innerHTML = '<span class="err-t">failed</span>';
        toast(e.message, 'bad');
      }
    });
    paint();
  });
}

function corpusDrawer() {
  const html =
    '<p class="body-sm mut">Nine documents, exactly what the client shared. This is the whole corpus; there is no wave two ' +
    'on this assignment.</p>' +
    '<div class="field"><input class="input" id="cq" placeholder="Search all nine documents" /></div>' +
    '<div id="clist"></div>';

  openDrawer('corpus / wave-1', html, box => {
    function list(q) {
      const t = String(q || '').trim().toLowerCase();
      const hits = CORPUS.map(d => {
        const n = t ? (d.text.toLowerCase().split(t).length - 1) : 0;
        return { d, n };
      }).filter(x => !t || x.n > 0);
      $('#clist', box).innerHTML = hits.length
        ? '<div class="doclist">' + hits.map(x =>
            '<button class="docrow" data-id="' + x.d.id + '"><span class="dn">' + x.d.id + '</span>' +
            '<span class="dt">' + esc(x.d.title) + '</span>' +
            '<span class="dw">' + (t ? x.n + ' hit' + (x.n === 1 ? '' : 's') : x.d.text.split(/\s+/).length + ' words') + '</span></button>'
          ).join('') + '</div>'
        : '<p class="caption mut">No document contains that.</p>';
      $$('.docrow', box).forEach(b => b.addEventListener('click', () => show(b.dataset.id, t)));
    }
    function show(id, q) {
      const d = CORPUS.find(x => x.id === id);
      $('#drawerBody').innerHTML =
        '<div class="row-wrap" style="margin:0 0 12px">' +
        '<button class="btn btn--ghost btn--sm" id="back">' + ic('arrow-left') + ' All documents</button>' +
        '<button class="btn btn--ghost btn--sm" id="raw">' + ic('code') + ' Raw</button>' +
        '<span class="caption mut">' + esc(d.file) + '</span></div>' +
        '<div class="mdbody" id="mdb">' + mdToHtml(d.text) + '</div>';
      icons();
      markHits($('#mdb'), q);
      $('#back').addEventListener('click', corpusDrawer);
      $('#raw').addEventListener('click', () => {
        const b = $('#mdb');
        if (b.dataset.raw === '1') { b.innerHTML = mdToHtml(d.text); b.dataset.raw = ''; b.className = 'mdbody'; }
        else { b.textContent = d.text; b.dataset.raw = '1'; b.className = 'mdbody rawmd'; }
        markHits(b, q);
      });
    }
    $('#cq', box).addEventListener('input', e => list(e.target.value));
    list('');
  });
}

function facDecipher(pass) {
  if (!pass) return null;
  try {
    const bin = atob(FAC_BLOB);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const key = new TextEncoder().encode(pass);
    const out = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) out[i] = bytes[i] ^ key[i % key.length];
    const o = JSON.parse(new TextDecoder().decode(out));
    return (o && o.hidden && o.marking) ? o : null;
  } catch (e) { return null; }
}

function facDrawer() {
  if (!FAC) {
    openDrawer('Facilitator',
      '<p class="body-sm mut">This panel holds the client role-play script, the per-stage marking notes and the ' +
      'hidden eval set. It is for the person running the session.</p>' +
      '<div class="field"><label class="label" for="fp">Passphrase</label>' +
      '<input class="input mono" id="fp" type="password" autocomplete="off" /></div>' +
      '<button class="btn btn--primary btn--sm" id="fgo">' + ic('unlock') + ' Unlock</button>',
      box => {
        function tryIt() {
          const o = facDecipher($('#fp', box).value.trim());
          if (!o) { toast('That passphrase does not decipher the pack.', 'bad'); return; }
          FAC = o; S.fac = true; save();
          toast('Facilitator pack unlocked. The hidden set is now runnable at stage 6.', 'good');
          facDrawer();
          if (STAGES[S.pos].id === 's6') renderStage();
        }
        $('#fgo', box).addEventListener('click', tryIt);
        $('#fp', box).addEventListener('keydown', e => { if (e.key === 'Enter') tryIt(); });
      });
    return;
  }

  const m = FAC.marking;
  const html =
    '<div class="anchor warnbox">' + ic('eye-off') +
    '<div><strong>Do not show this panel to students.</strong> The hidden set stops being an instrument the moment ' +
    'it is seen.</div></div>' +
    '<div class="glabel">The role</div>' +
    '<div class="bstrip"><b>' + esc(FAC.role.date) + '</b><span>' + esc(FAC.role.who) + ' ' + esc(FAC.role.believes) + '<br><br>' +
    'Has not read: ' + esc(FAC.role.hasNotRead) + '</span></div>' +
    '<ul class="body-sm">' + FAC.role.rules.map(r => '<li>' + esc(r) + '</li>').join('') + '</ul>' +
    '<div class="glabel">The problem students should extract</div>' +
    '<p class="body-sm">' + esc(FAC.problem) + '</p>' +
    '<div class="glabel">Marking, by stage</div>' +
    Object.keys(m).map(k =>
      '<div class="bstrip" style="margin-bottom:8px"><b>' + esc(k) + '</b><span>' +
      Object.keys(m[k]).map(f => '<strong>' + esc(f) + ':</strong> ' + esc(m[k][f])).join('<br>') +
      '</span></div>').join('') +
    '<div class="glabel">Failure modes</div>' +
    '<ul class="body-sm">' + FAC.failureModes.map(r => '<li>' + esc(r) + '</li>').join('') + '</ul>' +
    '<div class="glabel">Hidden set (' + FAC.hidden.length + ' cases)</div>' +
    '<div class="tblwrap"><table class="uc"><thead><tr><th>id</th><th>class</th><th>expected</th></tr></thead><tbody>' +
    FAC.hidden.map(h => '<tr><td>' + h.id + '</td><td>' + h.class + '</td><td class="num">' + esc(JSON.stringify(h.expect)) + '</td></tr>').join('') +
    '</tbody></table></div>' +
    '<div class="row-wrap"><button class="btn btn--secondary btn--sm" id="flock">' + ic('lock') + ' Lock again</button></div>';

  openDrawer('Facilitator', html, box => {
    $('#flock', box).addEventListener('click', () => {
      FAC = null; S.fac = false; save(); closeDrawer();
      toast('Locked.', 'good');
      if (STAGES[S.pos].id === 's6') renderStage();
    });
  });
}

/* ---------------- boot ---------------- */

function renderStage() {
  const st = STAGES[S.pos];
  const root = $('#stage');
  root.innerHTML = '';
  const wrap = el('<div class="step"></div>');
  root.appendChild(wrap);
  R[st.id](wrap, st);
  icons();
  updateGate();
}

function boot() {
  load();
  LLM.configure({ provider: S.provider, key: S.key, model: S.model });
  if (!S.model && PROVIDERS[S.provider]) { S.model = PROVIDERS[S.provider].models[0].id; LLM.configure({ model: S.model }); }

  renderNav();
  renderStage();
  updateChrome();
  updateGate();

  $('#continueBtn').addEventListener('click', advance);
  $('#backBtn').addEventListener('click', () => go(S.pos - 1));
  $('#homeLink').addEventListener('click', () => go(0));
  $('#setupBtn').addEventListener('click', setupDrawer);
  $('#corpusBtn').addEventListener('click', corpusDrawer);
  $('#facBtn').addEventListener('click', facDrawer);
  $('#drawerClose').addEventListener('click', closeDrawer);
  $('#scrim').addEventListener('click', closeDrawer);
  $('#menuBtn').addEventListener('click', () => {
    const open = $('#sidebar').classList.toggle('open');
    $('#scrim').classList.toggle('open', open);
    $('#menuBtn').setAttribute('aria-expanded', String(open));
  });
  $('#resetBtn').addEventListener('click', () => {
    if (!confirm('Wipe every answer, every run and the ledger? This cannot be undone. Download your state first if you want it back.')) return;
    const keep = { provider: S.provider, key: S.key, model: S.model };
    S = Object.assign(defaultState(), keep);
    save(); go(0);
    toast('Reset. Your provider key was kept.', 'good');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDrawer();
  });
  window.addEventListener('beforeunload', save);
  setInterval(save, 15000);
}

document.addEventListener('DOMContentLoaded', boot);
