// Jämför tabellen DANGER i index.html med dcg (Destructive Command Guard). Kör lokalt: node tools/dcg-check.mjs
// Kör alla svar i TASKS (båda skalen) och alla exempel i DANGER genom dcg test, och skriver ut där de inte är överens.
// Exit 1 vid avvikelse. Kräver dcg i PATH; terminal.test.js kräver det inte.
// Kommandona går till dcg på stdin, så att inga farliga strängar står på någon kommandorad (dcg-hooken läser dem).
import {readFileSync} from 'fs';
import {execFileSync} from 'child_process';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const src = html.slice(html.indexOf('/* pure:start'), html.indexOf('/* pure:end */'));
const {TASKS, DANGER, danger, fill} = new Function(src + '; return {TASKS, DANGER, danger, fill};')();

const lines = new Set();
for (const d of DANGER) for (const x of [...(d.ex || []), ...(d.ps || [])]) lines.add(x);
for (const t of TASKS) for (const ps of [false, true]) {
  if (ps && !t[5]) continue;
  for (let i = 0; i < 12; i++) { // flera ifyllningar: mallorden varierar
    const b = fill(t, i ? a => a[Math.floor(Math.random() * a.length)] : a => a[0], ps);
    for (const s of b.steps) for (const a of s) lines.add(a.raw.replace('{any}', '"x y"'));
  }
}

let bad = 0;
for (const raw of lines) {
  let out;
  try { out = execFileSync('dcg', ['test', '--stdin', '--format', 'json'], {input: raw, encoding: 'utf8'}); } catch (e) { out = e.stdout; }
  const j = JSON.parse(out), stops = j.decision === 'deny', d = danger(raw);
  const want = stops ? j.rule_id : null, have = d ? d.rule : null;
  if (want === have) continue;
  bad++;
  console.log(`${raw}\n  dcg: ${j.decision}${j.rule_id ? ' ' + j.rule_id : ''}  DANGER: ${d ? d.rule ?? 'släpps igenom' : 'ingen träff'}`);
}
console.log(bad ? `${bad} avvikelser av ${lines.size} rader` : `ok: DANGER och dcg är överens om ${lines.size} rader`);
process.exit(bad ? 1 : 0);
