// Rättningen i index.html. Kör: node terminal.test.js
// Läser den rena logiken mellan pure:start och pure:end ur sidan.
const assert = require('assert');
const fs = require('fs');

const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
// Hela sidans skript ska gå att tolka, inte bara den rena delen: ett syntaxfel utanför den stoppar spelet helt
new Function(html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>')));
const src = html.slice(html.indexOf('/* pure:start'), html.indexOf('/* pure:end */'));
const {TASKS, PACKS, POOLS, tokenize, segments, units, canon, same, fill, parts, fake, WORLD, makeQuiz, clash, NEAR, syntax, maxLvFor, lvOf, complete, PET_STAGES, petStage, binStr, binParts} =
  new Function(src + '; return {TASKS, PACKS, POOLS, tokenize, segments, units, canon, same, fill, parts, fake, WORLD, makeQuiz, clash, NEAR, syntax, maxLvFor, lvOf, complete, PET_STAGES, petStage, binStr, binParts};')();

const key = s => canon(tokenize(s));
const eq = (a, b) => assert.ok(same(key(a), key(b)), `${a}  borde godkännas som  ${b}`);
const ne = (a, b) => assert.ok(!same(key(a), key(b)), `${a}  borde INTE godkännas som  ${b}`);

// Snäll rättning: flaggordning, ihopslagna flaggor, citattecken, ./ och avslutande /
eq('grep -nr TODO .', 'grep -rn TODO .');
eq('grep -r -n TODO .', 'grep -rn TODO .');
eq('git commit -am "fixa menyn"', "git commit -a -m 'fixa menyn'");
eq('git commit -m "fixa menyn" -a', 'git commit -am "fixa menyn"');
eq('mkdir ./musik/', 'mkdir musik');
eq('mv notes.txt docs/', 'mv notes.txt docs');
eq('gh repo create tradgard --push --source . --public', 'gh repo create tradgard --public --source=. --push');
eq('rm -fr demo', 'rm -rf demo');
eq('find . -name *.js', 'find . -name "*.js"');
eq(`curl -d "{\\"namn\\":\\"test\\"}" -H 'Content-Type: application/json' -X POST https://api.example.com/items`,
  `curl -X POST -H "Content-Type: application/json" -d '{"namn":"test"}' https://api.example.com/items`);
eq('echo hej>notes.txt', 'echo hej > notes.txt');

// Men inte för snäll
ne('git commit -m fixa menyn', 'git commit -m "fixa menyn"');
ne('mkdir bilder', 'mkdir musik');
ne('mv a b', 'mv b a');
ne('rm -r demo', 'rm demo');
ne('ls -l', 'ls -a');

// Jokern {any} för fria commit-meddelanden
assert.ok(same(key('git commit -m "vad som helst"'), key('git commit -m {any}')));
assert.ok(!same(key('git commit "vad som helst"'), key('git commit -m {any}')));

// Kedjor och flera argument
assert.deepStrictEqual(segments(tokenize('mkdir a && cd a; ls')).length, 3);
assert.deepStrictEqual(units(['mkdir', '-p', 'a', 'b']), [['mkdir', '-p', 'a'], ['mkdir', '-p', 'b']]);
assert.deepStrictEqual(units(['mv', 'a', 'b']), [['mv', 'a', 'b']]);
assert.deepStrictEqual(segments(tokenize('grep x f | wc -l')).length, 1);
assert.throws(() => tokenize('git commit -m "oavslutat'));

// Varje uppgift: mallarna fylls helt, och varje godkänt svar godkänns mot sig självt
let n = 0;
for (const t of TASKS) {
  for (let i = 0; i < 20; i++) {
    const b = fill(t, a => a[Math.floor(Math.random() * a.length)]);
    assert.ok(!/\{(?!any\})\w+\}/.test(b.text + b.why + b.steps.flat().map(a => a.raw).join()), `ofylld mall i: ${t[2]}`);
    for (const s of b.steps) for (const a of s) {
      assert.ok(same(key(a.raw.replace('{any}', '"x y"')), a.key), `svaret godkänns inte: ${a.raw}`);
      n++;
    }
  }
  assert.ok(Object.hasOwn(PACKS, t[0]) && t[0] !== 'all' && [].concat(t[1]).every(l => l >= 1 && l <= 5), `fel paket eller nivå: ${t[2]}`);
  assert.ok(!/—/.test(t[2] + t[4]), `tankstreck i: ${t[2]}`);
}
// {x2} skiljer sig alltid från {x}, även när slumpen alltid väljer det första ordet
for (const t of ['{f} {f2}', '{f2} {f}']) {
  const [a, c] = fill(['fs', 1, t, 'x', ''], a => a[0]).text.split(' ');
  assert.notStrictEqual(a, c);
}
for (const t of TASKS) fill(t, a => a[0]); // får inte hänga sig

// PowerShell: alias, skiftläge, förkortade och namngivna parametrar
const pkey = s => canon(tokenize(s, true), true);
const eqp = (a, b) => assert.ok(same(pkey(a), pkey(b)), `PS: ${a}  borde godkännas som  ${b}
${pkey(a)}
${pkey(b)}`);
const nep = (a, b) => assert.ok(!same(pkey(a), pkey(b)), `PS: ${a}  borde INTE godkännas som  ${b}`);
eqp('ls', 'Get-ChildItem');
eqp('dir', 'Get-ChildItem');
eqp('get-childitem -force', 'Get-ChildItem -Force');
eqp('mkdir musik', 'New-Item -ItemType Directory musik');
eqp('ni musik -Type Directory', 'New-Item -ItemType Directory musik');
eqp('rm demo -r', 'Remove-Item demo -Recurse');
eqp('Remove-Item -Path demo -Recurse -Force', 'Remove-Item demo -Force -Recurse');
eqp('Get-Content app.log -Last 20', 'Get-Content app.log -Tail 20');
eqp('gc app.log -tail 20', 'Get-Content app.log -Tail 20');
eqp('sls TODO notes.txt', 'Select-String TODO notes.txt');
eqp('Select-String -Path notes.txt -Pattern TODO', 'Select-String TODO notes.txt');
eqp(String.raw`cd ~\musik`, 'Set-Location ~/musik');
eqp('kill 4821', 'Stop-Process -Id 4821');
eqp('echo hej > notes.txt', 'Write-Output hej > notes.txt');
eqp('git commit -m "fixa menyn"', "git commit -m 'fixa menyn'");
nep('rm -rf demo', 'Remove-Item demo -Recurse -Force');
nep('ls -la', 'Get-ChildItem -Force');
nep('Select-String notes.txt TODO', 'Select-String TODO notes.txt');
// Varje PowerShell-svar godkänns av sig självt
let np = 0;
for (const t of TASKS) if (t[5]) for (const s of fill(t, a => a[0], true).steps) for (const a of s) {
  assert.ok(same(pkey(a.raw.replace('{any}', '"x y"')), a.key), `PS-svaret godkänns inte: ${a.raw}`); np++;
}

// Hjälpkortet: varje del av varje godkänt svar har en förklaring
const missing = new Set();
for (const t of TASKS) for (const pick of [a => a[0], a => a[a.length - 1]])
  for (const s of fill(t, pick).steps) for (const a of s)
    for (const [p, d] of parts(a.raw)) if (!d || /undefined/.test(d)) missing.add(`${a.raw}  ->  ${p}`);
for (const t of TASKS) if (t[5]) for (const pick of [a => a[0], a => a[a.length - 1]])
  for (const s of fill(t, pick, true).steps) for (const a of s)
    for (const [p, d] of parts(a.raw, true)) if (!d || /undefined/.test(d)) missing.add(`PS ${a.raw}  ->  ${p}`);
assert.ok(!missing.size, `förklaring saknas:\n${[...missing].join('\n')}`);

// Låtsasfilsystemet: samma värld i båda skalen. PowerShell med skiftläget kvar (keep), som spelet kör det.
function shell(ps) {
  const fs = structuredClone(WORLD), env = {};
  const sh = s => { const r = fake(fs, sh.cwd, canon(tokenize(s, ps), ps, true), ps, env); if (r) sh.cwd = r.cwd; return r; };
  sh.fs = fs; sh.env = env;
  sh.cwd = ['projekt'];
  sh.out = s => sh(s).out.join('\n');
  sh.bad = (s, re) => assert.throws(() => sh(s), re, `${s} borde ge fel`);
  return sh;
}
let sh = shell(false);
assert.ok(/spel/.test(sh.out('ls')) && !/\.env/.test(sh.out('ls')), 'ls visar inte dolda filer');
assert.strictEqual(sh('ls').seen, 'projekt');
assert.ok(/\.env/.test(sh.out('ls -a')) && /\.hemligt/.test(sh.out('ls -la')));
sh('cd spel'); assert.deepStrictEqual(sh.cwd, ['projekt', 'spel']);
assert.ok(/Gissa/.test(sh.out('python spel.py')));
sh('cd ../..'); assert.deepStrictEqual(sh.cwd, []);
assert.ok(/högre upp/.test(sh.out('cd ..')));
assert.ok(sh('cd ~').same, 'cd dit du står ändrar ingenting');
sh('cd projekt');
sh.bad('cat nope.txt', /cat: nope.txt: No such file or directory/);
sh.bad('cd notes.txt', /Not a directory/);
sh('mkdir demo'); sh.bad('mkdir demo', /File exists/);
sh('touch demo/a.txt'); assert.ok(sh('touch demo/a.txt').same);
sh.bad('rm demo', /Is a directory/); sh.bad('rmdir demo', /Directory not empty/);
sh('rm -r demo'); assert.ok(!/demo/.test(sh.out('ls')));
sh('mv notes.txt musik'); assert.ok(/notes\.txt/.test(sh.out('ls musik')));
sh('echo hej > x.txt'); sh('echo da >> x.txt'); assert.strictEqual(sh.out('cat x.txt'), 'hej\nda'); assert.strictEqual(sh.out('wc -l x.txt'), '2 x.txt');
assert.strictEqual(sh('head -n 3 app.log').out.length, 3); assert.strictEqual(sh('tail -5 app.log').out.length, 5);
sh.bad('rm -rf /', /dangerous/);
sh('mkdir -p a/b/c'); sh('cd a/b/c'); assert.deepStrictEqual(sh.cwd, ['projekt', 'a', 'b', 'c']);
sh('rm -r ../../../a'); assert.deepStrictEqual(sh.cwd, ['projekt'], 'mappen du stod i togs bort');
sh('cd ~/recept'); assert.deepStrictEqual(sh.cwd, ['recept']);

sh = shell(true);
assert.ok(/\.env/.test(sh.out('Get-ChildItem')) && !/\.hemligt/.test(sh.out('gci')), 'på Windows är .env inte dold, .hemligt är det');
assert.ok(/\.hemligt/.test(sh.out('gci -Force')));
sh.bad('ls -la', /Get-ChildItem : A parameter cannot be found that matches parameter name 'la'/);
sh('Set-Location SPEL'); assert.deepStrictEqual(sh.cwd, ['projekt', 'spel'], 'PowerShell hittar det riktiga namnet');
sh('cd ..');
sh.bad('Set-Location nope', /Error: Set-Location : Cannot find path 'C:\\Users\\du\\projekt\\nope' because it does not exist\.$/);
sh.bad('Remove-Item musik', /has children and the Recurse parameter was not specified/);
assert.ok(/demo/.test(sh.out('New-Item -ItemType Directory demo'))); sh.bad('mkdir demo', /already exists/);
sh.bad('Rename-Item notes.txt todo.md', /Cannot create a file when that file already exists/);
assert.strictEqual(sh('Get-Content app.log -Tail 3').out.length, 3);
sh('Remove-Item musik -Recurse'); assert.ok(!/musik/.test(sh.out('ls')));

// Fynd från testagenterna 2026-10-17
for (const w of ['toString -a', 'constructor', '__proto__', 'hasOwnProperty -x']) for (const ps of [false, true]) canon(tokenize(w, ps), ps); // får inte kasta
sh = shell(false);
assert.strictEqual(sh('mkdir'), null, 'mkdir utan argument: MISSING-texten i spelet');
sh.bad('mv notes.txt', /missing destination file operand/);
sh.bad('echo hej >', /unexpected token `newline'/);
sh.bad('rm -r .', /refusing to remove/); sh.bad('rm -rf ~', /hemmapp/);
sh.bad('mv spel spel/inne', /subdirectory of itself/); sh.bad('cp -r musik musik', /into itself/);
sh.bad('mkdir -p notes.txt/a', /Not a directory/);
sh('mkdir __proto__'); assert.ok(/__proto__/.test(sh.out('ls')), '__proto__ är en vanlig mapp');
assert.deepStrictEqual(segments(tokenize('cd x && ls || pwd')).map(g => g.op), [undefined, '&&', '||']);
sh = shell(true);
assert.strictEqual(sh('touch x.txt'), null, 'touch finns inte i PowerShell');
sh.bad('Remove-Item', /Supply values for the following parameters:\nPath\[0\]:/);
sh.bad('rm -f notes.txt', /ambiguous. Possible matches include: -Filter -Force/);
sh.bad('rm -rf spel', /parameter name 'rf'\./);
assert.ok(/\.hemligt/.test(sh.out('gci -fo')), '-fo är -Force, inte tvetydigt');
assert.ok(sh('cd').same && sh.cwd.length, 'cd utan argument står kvar i PowerShell 5.1');

// När agenten stannar: Patriks egna kommandon, flaggor i valfri ordning
eq('gh pr merge -R Elwyndaz/forskning 8 --merge', 'gh pr merge 8 -R Elwyndaz/forskning --merge');
eq('gh pr merge 8 --merge --repo Elwyndaz/forskning', 'gh pr merge 8 --repo Elwyndaz/forskning --merge');
ne('gh pr merge 9 -R Elwyndaz/forskning --merge', 'gh pr merge 8 -R Elwyndaz/forskning --merge');
ne('gh pr merge 8 -R Elwyndaz/annat --merge', 'gh pr merge 8 -R Elwyndaz/forskning --merge');
eq('git branch -D fix-login dark-mode', 'git branch -D fix-login dark-mode');

// Varje uppgift i Filer & mappar går att köra mot världen utan att skalet kraschar
for (const ps of [false, true]) for (const t of TASKS) if (t[0] === 'fs' && (!ps || t[5])) for (const pick of [a => a[0], a => a[a.length - 1]]) {
  const s = shell(ps);
  for (const st of fill(t, pick, ps).steps) try { s(st[0].raw.replace('{any}', 'x')); }
  catch (e) { assert.ok(!/undefined|TypeError/.test(e.message + e.name), `${st[0].raw}: ${e.message}`); }
}

// Quizläget: tio frågor per paket, rätt svar finns med, inga dubbletter, inget felsvar som också godkänns
const sizes = {};
for (const ps of [false, true]) for (const pack of Object.keys(PACKS)) for (let r = 0; r < 60; r++) {
  const qs = makeQuiz(pack, ps), tag = `${pack} ${ps ? 'ps' : 'bash'}`;
  sizes[tag] = Math.min(sizes[tag] ?? 99, qs.length);
  for (const q of qs) {
    const txt = q.pairs ? q.pairs.flatMap(x => [x.text, x.cmd]) : q.options;
    assert.ok(!txt.some(x => /\{\w+\}/.test(x)), `${tag}: omallat ord i ${txt}`);
    if (q.pairs) { assert.ok(q.pairs.every((x, i) => q.pairs.every((y, j) => i === j || !clash(x, y))), `${tag}: par krockar`); continue; }
    assert.strictEqual(new Set(q.options).size, q.options.length, `${tag}: dubbla alternativ ${q.options}`);
    assert.ok(q.options.length >= 3, `${tag}: för få alternativ till ${q.ask}`);
    assert.strictEqual(q.options[q.answer], q.kind === 'vilket' ? q.it.cmd : q.it.text);
  }
}
// NEAR pekar på uppgifterna med deras text, så en omskriven text får inte tappa krocken
for (const g of NEAR) for (const t of g) assert.ok(TASKS.some(x => x[2] === t), `NEAR: ingen uppgift heter ${t}`);
const small = Object.entries(sizes).filter(([, n]) => n < 10);
assert.ok(!small.length, `quiz med färre än tio frågor: ${small.map(x => x.join(' ')).join(', ')}`);

// Testagenternas småfynd 2026-10-17, bash
sh = shell(false);
const o = s => sh.out(s);
sh('cd spel'); sh('cd ../musik'); assert.strictEqual(o('cd -'), '/home/du/projekt/spel', 'cd - går tillbaka och skriver mappen');
sh.cwd = ['projekt'];
assert.strictEqual(o('ls *.txt'), 'notes.txt', 'ls *.txt'); assert.strictEqual(o('echo *.md'), 'README.md todo.md');
sh('cp app.log b.log'); sh('rm *.log'); assert.ok(!/\.log/.test(o('ls')), 'rm *.log');
sh.bad('ls *.xyz', /cannot access '\*\.xyz'/);
assert.strictEqual(o('wc notes.txt'), ' 3  7 44 notes.txt', 'wc utan flagga: rader, ord, byte');
assert.ok(/ total$/.test(o('wc -l notes.txt todo.md')), 'wc med flera filer har en totalrad');
assert.strictEqual(o('cat notes.txt todo.md').split('\n').length, 6, 'cat med två filer');
assert.ok(/^==> notes\.txt <==/.test(o('head -n 1 notes.txt todo.md')), 'head med flera filer har rubriker');
sh('cp ../recept/pannkakor.txt p.txt'); assert.strictEqual(o('tail -n +3 p.txt'), '2,5 dl vetemjöl\n1 nypa salt', 'tail -n +3');
sh.bad('./notes.txt', /Permission denied/); sh.bad('./musik', /Is a directory/);
assert.strictEqual(o('ls -1 spel'), 'highscore.txt\nspel.py'); assert.ok(/^\.:\n[\s\S]*\.\/spel:\nhighscore\.txt  spel\.py/.test(o('ls -R')), 'ls -R');
assert.strictEqual(o('ls -d spel'), 'spel');
assert.strictEqual(o('cat < notes.txt').split('\n')[0], 'köp mjölk'); assert.strictEqual(o('wc -l < notes.txt'), '3', 'wc -l < fil skriver inget filnamn');
assert.strictEqual(o('echo $HOME'), '/home/du'); assert.strictEqual(o('echo ~'), '/home/du');
assert.strictEqual(o('echo $PATH'), '/usr/local/bin:/usr/bin:/bin:/home/du/.local/bin', 'echo $PATH skriver sökvägen, inte texten $PATH');
sh.bad('cd spel musik', /too many arguments/);
sh('mkdir ut'); sh('mv notes.txt todo.md ut'); assert.strictEqual(o('ls ut'), 'notes.txt  todo.md', 'mv med flera källor');
sh.bad('mv README.md app.js deploy.sh', /target 'deploy.sh' is not a directory/);
// bash: kommandon som saknades
assert.strictEqual(o('find . -name "*.js"'), './server/server.js'); assert.strictEqual(o('find spel -type f'), 'spel/highscore.txt\nspel/spel.py');
assert.ok(/inga träffar/.test(sh('find . -name nope').note));
assert.strictEqual(o('grep -r API_KEY .'), './.env:API_KEY=hunter2', 'grep -r hittar dolda filer');
assert.strictEqual(o('grep -n mjölk ut/notes.txt'), '1:köp mjölk'); assert.strictEqual(o('grep -c ERROR ../projekt/README.md'), '0');
assert.strictEqual(o('grep -ci error server/server.log'), '3');
assert.ok(/^\.\n├── [\s\S]*\n\d+ directories, \d+ files$/.test(o('tree')), 'tree: ' + o('tree'));
assert.ok(/less visar en sida/.test(o('less README.md')));
sh('export PORT=3000'); assert.strictEqual(o('echo $PORT'), '3000'); assert.ok(/^PORT=3000$/m.test(o('env')));
sh('X=hej'); assert.strictEqual(o('echo $X'), 'hej'); sh('unset X'); assert.strictEqual(o('echo $X'), '');
sh.bad('$HOME', /bash: \/home\/du: Is a directory/);
assert.ok(/inga träffar/.test(sh('grep -r zzz .').note));
sh('ls > lista.txt'); assert.ok(/spel/.test(o('cat lista.txt')), '> fungerar för alla kommandon, inte bara echo');
sh('ls -a > lista.txt'); assert.ok(/\.env/.test(o('cat lista.txt')), 'flaggorna följer med före >');
// Rader skalet vägrar
assert.strictEqual(syntax(tokenize('ls ;;'), false), "bash: syntax error near unexpected token `;;'");
assert.strictEqual(syntax(tokenize('ls |'), false), 'bash: syntax error: unexpected end of file');
assert.strictEqual(syntax(tokenize('ls |', true), true), 'An empty pipe element is not allowed.');
assert.strictEqual(syntax(tokenize('ls ;;', true), true), null, 'PowerShell tål tomma satser');
assert.strictEqual(syntax(tokenize('cd a && ls; pwd'), false), null);

// PowerShell
sh = shell(true);
sh('New-Item -ItemType Directory demo'); assert.strictEqual(typeof sh.fs.projekt.demo, 'object', 'New-Item -ItemType Directory skapar en mapp, även med stort D');
sh('Move-Item notes.txt musik'); assert.ok(/notes\.txt/.test(o('ls musik')), 'Move-Item in i en mapp');
sh('New-Item -Path demo -Name a.txt -Value hej'); assert.strictEqual(sh.fs.projekt.demo['a.txt'], 'hej', 'New-Item -Name -Value');
sh('New-Item -Name b.txt'); assert.strictEqual(sh.fs.projekt['b.txt'], '', 'New-Item -Name utan -Path skapar här');
sh.bad('New-Item b.txt', /already exists/); sh('New-Item b.txt -Value ny -Force'); assert.strictEqual(sh.fs.projekt['b.txt'], 'ny', '-Force skriver över');
sh.bad('Move-Item b.txt todo.md', /already exists/); sh('Move-Item b.txt todo.md -Force'); assert.strictEqual(sh.fs.projekt['todo.md'], 'ny');
assert.ok(/todo\.md/.test(o('Get-ChildItem *.md')) && !/notes/.test(o('gci *.md')), 'jokertecken i sökvägen');
assert.ok(/server\.js/.test(o('Get-ChildItem -Recurse -Filter *.js')), '-Recurse -Filter');
assert.ok(/server\\server\.js/.test(o('gci -Recurse -Name -File')), '-Name ger relativa namn');
assert.ok(!/\.env|README/.test(o('gci -Directory')) && /spel/.test(o('gci -Directory')), '-Directory');
assert.ok(/\.hemligt/.test(o('gci -Hidden')) && !/spel/.test(o('gci -Hidden')), '-Hidden visar bara dolda');
sh('rm todo.md, deploy.sh'); assert.ok(!/todo\.md|deploy\.sh/.test(o('ls')), 'rm a, b');
sh.bad('Remove-Item README.md app.log', /A positional parameter cannot be found that accepts argument 'app.log'/);
sh('cd..'); assert.deepStrictEqual(sh.cwd, []); sh('cd projekt'); sh.bad('cd\\', /bara din hemmapp/);
assert.strictEqual(o('$HOME'), 'C:\\Users\\du'); assert.ok(/C:\\Users\\du\\projekt/.test(o('$PWD')));
sh('Set-Location $HOME'); assert.deepStrictEqual(sh.cwd, []); sh('cd projekt');
sh.bad('Remove-Item .hemligt -Recurse', /sufficient access rights/); sh('Remove-Item .hemligt -Recurse -Force'); assert.ok(!sh.fs.projekt['.hemligt']);
sh.bad('Rename-Item README.md musik/R.md', /represents a path/);
sh('New-Item hej.sh'); assert.ok(/Windows öppnar hej\.sh/.test(o('.\\hej.sh'))); sh.bad('.\\nope.sh', /is not recognized/);
sh('New-Item x.ps1'); sh.bad('.\\x.ps1', /running scripts is disabled/);
sh.bad('ls -l', /Missing an argument for parameter 'LiteralPath'/); sh.bad('ls -a', /Missing an argument for parameter 'Attributes'/);
assert.strictEqual(o('Test-Path musik'), 'True'); assert.strictEqual(o('Test-Path nope'), 'False'); assert.strictEqual(o('Test-Path musik -PathType Leaf'), 'False');
assert.ok(/README\.md/.test(o('Get-Item README.md'))); sh.bad('Get-Item .git', /Could not find item/);
assert.ok(/skärmen/.test(o('Write-Host hej > w.txt')) && sh.fs.projekt['w.txt'] === '', 'Write-Host går inte till filen');
assert.strictEqual(o('Write-Output hej då'), 'hej\ndå', 'Write-Output: ett ord per rad');
sh('Write-Output hej | Out-File o.txt'); assert.strictEqual(sh.fs.projekt['o.txt'], 'hej');
assert.ok(/öppnas/.test(o('ii README.md')) && /öppnas/.test(o('start README.md')) && /Utforskaren/.test(o('explorer .')));
assert.ok(/Folder PATH listing[\s\S]*├───bilder/.test(o('tree')) && /spel\.py/.test(o('tree /F')), 'tree och tree /F');
sh('$env:PORT = 3000'); assert.strictEqual(o('$env:PORT'), '3000'); assert.ok(/PORT\s+3000/.test(o('Get-ChildItem env:')));
assert.ok(/README\.md:1:# projekt/.test(o('Select-String projekt README.md')));
assert.ok(/spel\\spel\.py:1:import random/.test(o('Get-ChildItem -Recurse | Select-String random')));
sh.bad('cat < notes.txt', /reserved for future use/);

// Små paket får minst 8 olika uppgifter redan på nivå 1, i båda skalen
for (const ps of [false, true]) for (const pack of Object.keys(PACKS)) {
  const lv = maxLvFor(pack, ps, 1), n = TASKS.filter(t => (pack === 'all' || t[0] === pack) && (!ps || t[5]) && lvOf(t, ps) <= lv).length;
  assert.ok(n >= 8, `${pack} ${ps ? 'ps' : 'bash'}: bara ${n} uppgifter på nivå 1`);
}
assert.strictEqual(maxLvFor('fs', false, 1), 1, 'stora paket börjar fortfarande med det lättaste');

// Inget svar i Filer & mappar säger 'Missing an argument' i en ny värld (PowerShell)
for (const t of TASKS) if (t[0] === 'fs' && t[5]) for (const st of fill(t, a => a[0], true).steps) {
  const s = shell(true);
  try { s(st[0].raw); } catch (e) { assert.ok(!/Missing an argument|positional parameter/.test(e.message), `${st[0].raw}: ${e.message}`); }
}

// Tab: kommandon, filer, mappar med /, dolda bara med punkt, gemensam början, PowerShell utan hänsyn till skiftläge
{
  const w = structuredClone(WORLD), cmds = ['git', 'grep', 'gh', 'ls'];
  assert.deepStrictEqual(complete(w, ['projekt'], 'gr', false, cmds), {line: 'grep ', list: ['grep'], base: ''});
  assert.strictEqual(complete(w, ['projekt'], 'g', false, cmds).line, 'g', 'flera träffar utan gemensam början: raden står kvar');
  assert.deepStrictEqual(complete(w, ['projekt'], 'g', false, cmds).list, ['gh', 'git', 'grep']);
  assert.strictEqual(complete(w, ['projekt'], 'cd mu', false, cmds).line, 'cd musik/');
  assert.strictEqual(complete(w, ['projekt'], 'cat spel/sp', false, cmds).line, 'cat spel/spel.py ');
  assert.strictEqual(complete(w, ['projekt'], 'cat no', false, cmds).line, 'cat notes.txt ');
  assert.ok(!complete(w, ['projekt'], 'ls ', false, cmds).list.some(n => n.startsWith('.')), 'dolda syns inte utan punkt');
  assert.ok(complete(w, ['projekt'], 'ls .e', false, cmds).line === 'ls .env ', 'dolda med punkt');
  assert.strictEqual(complete(w, ['projekt'], 'cd MU', true, cmds).line, 'cd musik\\', 'PowerShell: skiftläge spelar ingen roll, mappar får \\');
  assert.strictEqual(complete(w, ['projekt'], 'cat nope/x', false, cmds).list.length, 0);
  assert.strictEqual(complete(w, ['projekt'], 'Get-Ch', true, ['Get-ChildItem', 'Get-Content']).line, 'Get-ChildItem ');
}
// Bit: stadierna är tvåpotenserna från 1, och binärt räknas i hela nibbles
assert.deepStrictEqual(PET_STAGES.map(s => s[0]), [0, ...Array.from({length: PET_STAGES.length - 1}, (_, i) => 2 ** i)], 'Bit växer vid 1, 2, 4, 8 ...');
assert.deepStrictEqual([0, 1, 3, 4, 7, 8, 9, 1024, 5000].map(petStage), [0, 1, 2, 3, 3, 4, 4, PET_STAGES.length - 1, PET_STAGES.length - 1]);
assert.deepStrictEqual([0, 1, 2, 3, 4].map(binStr), ['0000', '0001', '0010', '0011', '0100']);
assert.strictEqual(binStr(18), '0001 0010'); assert.strictEqual(binStr(255), '1111 1111');
assert.strictEqual(binParts(13), '8 + 4 + 1'); assert.strictEqual(binParts(0), '0'); assert.strictEqual(binParts(16), '16');
for (const [, , text] of PET_STAGES) assert.ok(!text.includes('—') && !/(^|[^.\d])\d+\.\d+(?![.\d])/.test(text), 'svensk text: inga tankstreck, decimalkomma: ' + text);
// PowerShell frågar om mappen inte är tom
sh = shell(true); sh('New-Item -ItemType Directory tom'); sh('New-Item tom/a.txt');
sh.bad('Remove-Item tom', /Confirm\n[\s\S]*tom has children[\s\S]*\): N\n# spelet svarar N/);

console.log(`ok: ${TASKS.length} uppgifter, ${n} bash-svar och ${np} PowerShell-svar kontrollerade, låtsasskalet i båda skalen`);
