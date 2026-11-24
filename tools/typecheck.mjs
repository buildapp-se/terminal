// Typkontroll av spelets skript utan byggsteg: node tools/typecheck.mjs
// Plockar ut det inbäddade <script> ur index.html till .typecheck/index.html.js med lika många tomma rader
// före, så att tsc:s radnummer är index.html:s. Inställningarna står i tsconfig.json, globala namn från
// andra filer (ljudmotorn, ai-quizet) i tools/globals.d.ts. Kräver nätet första gången (npx hämtar typescript).
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {execSync} from 'node:child_process';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const start = html.indexOf('<script>') + '<script>'.length;
const end = html.lastIndexOf('</script>');
if (start < '<script>'.length || end < start) throw new Error('index.html: hittar inget inbäddat <script>');
const pad = '\n'.repeat(html.slice(0, start).split('\n').length - 1);
// export {} gör filen till en modul, så att spelets egna globala namn (screen, name) inte krockar med DOM:ens
mkdirSync(join(root, '.typecheck'), {recursive: true});
writeFileSync(join(root, '.typecheck', 'index.html.js'), pad + html.slice(start, end) + '\nexport {};\n');
try {
  execSync('npx --yes -p typescript@5.9.3 tsc -p tsconfig.json', {cwd: root, stdio: 'inherit'});
  console.log('typkontroll: ok');
} catch {
  console.error('typkontroll: fel ovan (radnumren gäller index.html)');
  process.exit(1);
}
