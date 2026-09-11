#!/usr/bin/env node
/* ============================================================
   A2 — pull a student's stage-5 prompt out of submission.json.

     node lecture/extract-prompt.js <submission.json> <p1|p2|...>

   Writes lecture/prompts/<id>.txt with names and handles removed, and
   prints what it removed so you can check it did not eat the prompt.
   Refuses to overwrite an existing file.
   ============================================================ */

'use strict';

const fs = require('fs');
const path = require('path');

const [, , src, id] = process.argv;
if (!src || !id) {
  console.error('usage: node lecture/extract-prompt.js <submission.json> <p1|p2|p3>');
  process.exit(1);
}
if (!/^p\d[\w-]*$/.test(id)) {
  console.error('id must look like p1, p2, p3 — run-prompts.js globs on /^p\\d.*\\.txt$/');
  process.exit(1);
}

const dest = path.join(__dirname, 'prompts', id + '.txt');
if (fs.existsSync(dest)) {
  console.error(dest + ' already exists. Delete it first if you mean to replace it.');
  process.exit(1);
}

let sub;
try { sub = JSON.parse(fs.readFileSync(src, 'utf8')); }
catch (e) { console.error('could not read ' + src + ': ' + e.message); process.exit(1); }

const prompt = sub && sub.stage5 && sub.stage5.prompt;
if (typeof prompt !== 'string' || !prompt.trim()) {
  console.error('no .stage5.prompt in ' + src + '. Is this a submission.json from the Submit stage?');
  process.exit(1);
}

/* ---- redaction ----
   Three passes, each reported. Anything else a student put in their prompt
   stays: a prompt is evidence, and silently rewriting it makes the slide a
   lie. Read the output before it goes on a screen. */

const removed = [];
function strip(text, re, label) {
  return text.replace(re, m => { removed.push(label + ': ' + m.trim()); return '[redacted]'; });
}

let out = prompt;
out = strip(out, /[\w.+-]+@[\w-]+\.[\w.]+/g, 'email');
out = strip(out, /\b(?:written|prepared|submitted|by)\s+by\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?/g, 'byline');
out = strip(out, /(?:^|\n)\s*(?:name|student|author|submitted by)\s*[:\-]\s*.+/gi, 'header line');
out = strip(out, /@[A-Za-z0-9_]{3,}/g, 'handle');

fs.writeFileSync(dest, out.trim() + '\n');

console.log('wrote ' + path.relative(process.cwd(), dest) + ' (' + out.trim().length + ' chars)');
if (removed.length) {
  console.log('redacted ' + removed.length + ':');
  removed.forEach(r => console.log('  ' + r));
} else {
  console.log('redacted nothing. Read the file before it goes on a slide anyway —');
  console.log('subscriber numbers and rider names from the corpus are fine, a student\'s own name is not.');
}
