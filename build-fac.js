// Enciphers .facilitator-src/pack.json into js/data.js.
// Run: node build-fac.js "<passphrase>"
// The plaintext source is gitignored. The repo ships only the blob.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const pass = process.argv[2];
if (!pass) { console.error('usage: node build-fac.js "<passphrase>"'); process.exit(1); }

const src = fs.readFileSync(path.join(__dirname, '.facilitator-src', 'pack.json'), 'utf8');
const plain = Buffer.from(JSON.stringify(JSON.parse(src)), 'utf8');
const key = Buffer.from(pass, 'utf8');

const enc = Buffer.alloc(plain.length);
for (let i = 0; i < plain.length; i++) enc[i] = plain[i] ^ key[i % key.length];

const blob = enc.toString('base64');
const hash = crypto.createHash('sha256').update(pass, 'utf8').digest('hex');

const dataPath = path.join(__dirname, 'js', 'data.js');
let js = fs.readFileSync(dataPath, 'utf8');
js = js.replace(/const FAC_HASH = '[^']*';/, "const FAC_HASH = '" + hash + "';");
js = js.replace(/const FAC_BLOB = '[^']*';/, "const FAC_BLOB = '" + blob + "';");
fs.writeFileSync(dataPath, js);

console.log('facilitator pack enciphered:', plain.length, 'bytes ->', blob.length, 'base64 chars');
console.log('hash:', hash.slice(0, 16) + '...');
