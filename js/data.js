/* ============================================================
   Assignment 03 — From Client Brief to Costed System
   Content, seeds, pricing. No logic here.
   ============================================================ */

const CLIENT_BRIEF =
  "Cancellations in our new cities are bad and the Board is asking questions. " +
  "Can AI help with the quality complaints before the Series B?";

const ROLE_DATE = "20 August 2024";

/* ---------------- stages ---------------- */

const STAGES = [
  {
    id: 'brief', num: 0, icon: 'briefcase',
    title: 'The brief',
    lede: 'One client, one ambiguous ask, one corpus.',
    time: null,
  },
  {
    id: 's1', num: 1, icon: 'search',
    title: 'Extract the problem',
    time: 15,
    produce: '5 questions for the client, then one observation: who, what breaks, where, in numbers. No solution.',
    doneWhen: 'A stranger reads it and names the same problem.',
  },
  {
    id: 's2', num: 2, icon: 'ruler',
    title: 'Define good',
    time: 10,
    produce: 'Baseline number, hypothesis, one falsifier, cheapest manual test.',
    doneWhen: 'Client would accept the test as proof.',
  },
  {
    id: 's3', num: 3, icon: 'handshake',
    title: 'Align',
    time: 5,
    produce: '2 minute pitch to the client. Client says yes, no, or change.',
    doneWhen: 'Client signs off in writing.',
  },
  {
    id: 's4', num: 4, icon: 'workflow',
    title: 'Design the process',
    time: 12,
    produce: 'Input, output, steps. Each step tagged deterministic, probabilistic, or human. Control graph on the board.',
    doneWhen: 'Every probabilistic step has a reason deterministic could not do it.',
  },
  {
    id: 's5', num: 5, icon: 'flask-conical',
    title: 'Write evals',
    time: 25,
    produce: '10 cases: input, expected output, check. Run against your process. Hand-label 6 outputs, compare to your grader.',
    doneWhen: 'Grader agrees with you 5 of 6, or you say why not.',
  },
  {
    id: 's6', num: 6, icon: 'hammer',
    title: 'Break your evals',
    time: 12,
    produce: 'One output that passes every check and is wrong. Rewrite the check.',
    doneWhen: 'Pass rate on your cases moves, pass rate on hidden cases does not.',
  },
  {
    id: 's7', num: 7, icon: 'shield',
    title: 'Guardrails',
    time: 10,
    produce: 'Three boundaries: what the system must never output or do. One catch and one false positive each.',
    doneWhen: 'Each guard tested on a real run.',
  },
  {
    id: 's8', num: 8, icon: 'indian-rupee',
    title: 'Price it',
    time: 10,
    produce: "Tokens per unit of work, cost per month at the client's volume, cost of checking versus cost of doing. Explain to a non-technical client in five lines.",
    doneWhen: 'Client can repeat the number and what drives it.',
  },
  {
    id: 'submit', num: 9, icon: 'package-check',
    title: 'Submit',
    lede: 'One folder, every artefact.',
    time: null,
  },
];

/* ---------------- stage 1: question lint ---------------- */

// Words that mark a question as solution-shaped rather than discovery-shaped.
const SOLUTION_WORDS = [
  'model', 'llm', 'gpt', 'chatbot', 'chat bot', 'ai agent', 'agent',
  'fine-tune', 'finetune', 'fine tune', 'training data', 'train a',
  'vector', 'embedding', 'rag', 'prompt', 'automate with', 'which tool',
  'tech stack', 'api', 'dashboard we should build',
];

const GOOD_QUESTION_HINTS = [
  'Which cities, and since when?',
  'What do the exit reasons actually say?',
  'What changed between February and April?',
  'What does one complaint look like end to end?',
  'Who sees a complaint, and what happens next?',
  'Is Pune affected?',
];

/* ---------------- stage 4: step kinds ---------------- */

// `model` stays the stored id so existing saved work keeps loading. Everything
// the student reads says "probabilistic".
const STEP_KINDS = [
  { id: 'det',   short: 'D', label: 'Deterministic', color: '#F96846',
    hint: 'Code. Same input, same output, every time.' },
  { id: 'model', short: 'P', label: 'Probabilistic', color: '#7C3AED',
    hint: 'A model reads it. The same input can come back different. Must be justified.' },
  { id: 'human', short: 'H', label: 'Human',         color: '#15803D',
    hint: 'A person decides, or speaks to a person.' },
];
const KIND = {}; STEP_KINDS.forEach(k => { KIND[k.id] = k; });

/* ---------------- stage 5: output contract + seeds ---------------- */

const OUTPUT_CONTRACT = `{
  "condition": "warm" | "sour" | "watery" | "other" | "none",
  "route": "<route code such as IND-A, or null if the text does not give one>",
  "escalate": true | false
}`;

// Verbatim ticket text from corpus/wave-1. Expected outputs are deliberately
// blank: deciding them is the student's work.
const SEED_CASES = [
  {
    src: '04 / SF-NSK-118204',
    input: 'Customer says curd pouches were "loose", she pressed one and it was watery, refused both. Rider Sandeep confirmed he took them back. Customer polite but says this is second time this month, first time she did not complain. Trip TR-NSK-0419-03.',
  },
  {
    src: '04 / SF-NSK-118331',
    input: 'Customer: the curd is sour today, again. we have been with you 14 months\nAgent: I am very sorry sir. May I arrange a refund and a replacement?\nCustomer: refund is fine. but you should check what is happening, three houses in our building said the same yesterday\nAgent: I will note that sir and pass it to the hub team.',
  },
  {
    src: '04 / SF-NSK-118402',
    input: 'Same complaint pattern. All three pouches. Rider took them back. Refund Rs 144.',
  },
  {
    src: '04 / SF-NSK-118204 internal',
    input: 'Trip TR-NSK-0419-03. Rider says the box "felt warm" when he opened it at the third stop but the van reading was fine when he left the hub at 04:50.',
  },
  {
    src: '07 / Kesar Nandanvan',
    input: 'Society secretary Mr Deolekar, Kesar Nandanvan, Vijay Nagar, route IND-A: "your curd is not reaching us cold and we have complained four times." 34 subscriptions cancelled with effect from the August cycle.',
  },
  {
    src: '06 / INC-2291',
    input: 'Trip TR-IND-0609-02. Chilled compartment lost temperature control during the early Sunday route. Product zone temperature rose out of band and remained out of band for the balance of the run. 62 units of Category A returned and disposed. Eleven subscribers received no Category A that morning and were credited.',
  },
];

// The classes the facilitator expects every eval set to force.
const REQUIRED_CLASSES = [
  { id: 'clear',     label: 'Clear condition complaint', hint: 'Names the condition plainly.' },
  { id: 'noroute',   label: 'Complaint with no route',   hint: 'Condition is clear, route is absent. Expected route must be null.' },
  { id: 'unrelated', label: 'Unrelated complaint',       hint: 'Late delivery, billing, rider conduct. Condition is not a product condition.' },
  { id: 'sarcasm',   label: 'Sarcasm or mixed',          hint: 'Says one thing, means another, or two products with different outcomes.' },
  { id: 'neighbour', label: "Neighbour report",          hint: "Reports other people's complaints, not their own." },
  { id: 'duplicate', label: 'Duplicate',                 hint: 'Same underlying event, second ticket.' },
];

const Q_TARGET     = 5;    // questions for the client at stage 1
const CASE_TARGET  = 10;   // eval cases at stage 5
const LABEL_TARGET = 6;    // outputs hand-labelled against the grader
const AGREE_TARGET = 5;    // agreement needed, out of LABEL_TARGET

/* ---------------- stage 7 ---------------- */

const GUARD_SLOTS = [
  { id: 'g1', label: 'Guard 1' },
  { id: 'g2', label: 'Guard 2' },
  { id: 'g3', label: 'Guard 3' },
];

/* ---------------- providers and prices ---------------- */
/* Prices are USD per 1,000,000 tokens and are DEFAULTS ONLY.
   They move. Every price field in stage 8 is editable, and the stage
   tells the student to verify against the provider's current page. */

const PROVIDERS = {
  groq: {
    label: 'Groq',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    keyUrl: 'https://console.groq.com/keys',
    auth: 'bearer',
    models: [
      { id: 'llama-3.3-70b-versatile', in: 0.59, out: 0.79 },
      { id: 'llama-3.1-8b-instant',    in: 0.05, out: 0.08 },
      { id: 'openai/gpt-oss-120b',     in: 0.15, out: 0.75 },
      { id: 'openai/gpt-oss-20b',      in: 0.10, out: 0.50 },
    ],
  },
  openai: {
    label: 'OpenAI',
    url: 'https://api.openai.com/v1/chat/completions',
    keyUrl: 'https://platform.openai.com/api-keys',
    auth: 'bearer',
    models: [
      { id: 'gpt-4o-mini',   in: 0.15, out: 0.60 },
      { id: 'gpt-4.1-nano',  in: 0.10, out: 0.40 },
      { id: 'gpt-4.1-mini',  in: 0.40, out: 1.60 },
      { id: 'gpt-4o',        in: 2.50, out: 10.00 },
    ],
  },
  gemini: {
    label: 'Gemini',
    url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    keyUrl: 'https://aistudio.google.com/apikey',
    auth: 'bearer',
    models: [
      { id: 'gemini-2.0-flash',      in: 0.10, out: 0.40 },
      { id: 'gemini-2.5-flash-lite', in: 0.10, out: 0.40 },
      { id: 'gemini-2.5-flash',      in: 0.30, out: 2.50 },
    ],
  },
};

const DEFAULT_VOLUME = 30;   // DISP-07 tickets per day, Tier 2, Q2 volume
const VOLUME_RANGE = [20, 40];
const DEFAULT_FX = 88;       // USD to INR, editable

/* ---------------- facilitator pack ----------------
   XOR-enciphered against a key derived from the facilitator passphrase,
   then base64. Not cryptography. It stops a student who is scrolling
   data.js, and it is meant to stop exactly that much.
   FAC_HASH is SHA-256 of the passphrase, checked before decipher. */

const FAC_HASH = '2eac6078d858bda31f58fd0667aae128704a824d60c9232120e907ef3da51580';
const FAC_BLOB = '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';
