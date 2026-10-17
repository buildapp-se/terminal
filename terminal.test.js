// Rättningen i index.html. Kör: node terminal.test.js
// Läser den rena logiken mellan pure:start och pure:end ur sidan.
const assert = require('assert');
const fs = require('fs');

const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
// Hela sidans skript ska gå att tolka, inte bara den rena delen: ett syntaxfel utanför den stoppar spelet helt
new Function(html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>')));
const src = html.slice(html.indexOf('/* pure:start'), html.indexOf('/* pure:end */'));
const {TASKS, PACKS, POOLS, tokenize, segments, units, canon, same, fill, parts, fake, WORLD, makeQuiz, clash, NEAR, syntax, maxLvFor, lvOf, complete, PET_STAGES, petStage, binStr, binParts, lampSum, lampMode, gitRefs, back} =
  new Function(src + '; return {TASKS, PACKS, POOLS, tokenize, segments, units, canon, same, fill, parts, fake, WORLD, makeQuiz, clash, NEAR, syntax, maxLvFor, lvOf, complete, PET_STAGES, petStage, binStr, binParts, lampSum, lampMode, gitRefs, back};')();

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

// Små paket får minst 7 olika uppgifter redan på nivå 1, i båda skalen
for (const ps of [false, true]) for (const pack of Object.keys(PACKS)) {
  const lv = maxLvFor(pack, ps, 1), n = TASKS.filter(t => (pack === 'all' || t[0] === pack) && (!ps || t[5]) && lvOf(t, ps) <= lv).length;
  assert.ok(n >= 7, `${pack} ${ps ? 'ps' : 'bash'}: bara ${n} uppgifter på nivå 1`);
}
assert.strictEqual(maxLvFor('git', false, 1), 1, 'git börjar med de 7 lätta'); assert.strictEqual(maxLvFor('fs', false, 1), 1, 'stora paket börjar fortfarande med det lättaste');

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
assert.strictEqual(binParts(13), '8 + 4 + 1'); assert.strictEqual(binParts(0), '0'); assert.strictEqual(binParts(16), '16'); assert.strictEqual(binParts(1028), '1 024 + 4', 'svenska mellanslag i tusental');
assert.strictEqual(lampSum(11), '1 0 1 1 = 8 + 2 + 1 = 11'); assert.strictEqual(lampSum(4), '0 1 0 0 = 4'); assert.strictEqual(lampSum(0), '0 0 0 0 = 0');
assert.strictEqual(lampMode(5), '101 = r-x = 5'); assert.strictEqual(lampMode(15), '111 = rwx = 7', 'chmod tar de tre lägsta bitarna'); assert.strictEqual(lampMode(8), '000 = --- = 0');
for (const [, , text] of PET_STAGES) assert.ok(!text.includes('—') && !/(^|[^.\d])\d+\.\d+(?![.\d])/.test(text), 'svensk text: inga tankstreck, decimalkomma: ' + text);
// PowerShell frågar om mappen inte är tom
sh = shell(true); sh('New-Item -ItemType Directory tom'); sh('New-Item tom/a.txt');
sh.bad('Remove-Item tom', /Confirm\n[\s\S]*tom has children[\s\S]*\): N\n# spelet svarar N/);

// Antigravitys granskning 2026-10-17: fel som spelet visade eller rättade fel
const peq = (a, b) => assert.ok(same(pkey(a), pkey(b)), a + '  borde godkännas som  ' + b);
eq('powershell -command "Stop-Process -Id 4821"', 'powershell -Command "Stop-Process -Id 4821"');
eq('powershell -c "Stop-Process -Id 4821"', 'powershell -Command "Stop-Process -Id 4821"');
ne('powershell -Conmanmad "Stop-Process -Id 4821"', 'powershell -Command "Stop-Process -Id 4821"');
peq('python .\\spel.py', 'python spel.py'); peq('git -C budget\\ push', 'git -C budget push');
eq('gh pr merge --repo Elwyndaz/forskning 8 --merge', 'gh pr merge 8 --repo=Elwyndaz/forskning --merge');
eq('npx wrangler d1 execute db --local --file schema.sql', 'npx wrangler d1 execute db --local --file=schema.sql');
eq('winget install --id=Git.Git -e', 'winget install --id Git.Git -e');
eq('git branch -d -D fix-login', 'git branch -dD fix-login');
eq('git commit -m "- fixa"', 'git commit -m "{any}"');
sh = shell(true);
assert.match(sh.out('Select-String ERROR app.log | Measure-Object'), /Count\s+: 4\b/, 'Select-String räknar bara träffar');
for (const c of ['ii', 'start', 'Invoke-Item', 'Start-Process']) sh.bad(c, e => !/undefined/.test(e.message) && /cmdlet (Invoke-Item|Start-Process) /.test(e.message));
assert.ok(complete(sh.fs, ['projekt'], 'cat .e', true).line.includes('.env'), 'Tab i PowerShell hittar .env');
sh = shell(false);
sh('cat notes.txt | sort > sorterad.txt');
assert.ok(typeof sh.fs.projekt['sorterad.txt'] === 'string' && sh.fs.projekt['sorterad.txt'].length, '> efter en pipe skriver filen');

// Speltestarens fynd: likvärdiga former godkänns, men inte allt som liknar
eq('git push origin main', 'git push'); eq('git pull origin main', 'git pull'); eq('git push origin', 'git push'); eq('git push', 'git push origin main');
eq('git -C budget push origin main', 'git -C budget push');
ne('git push -u origin main', 'git push'); ne('git push --force', 'git push'); ne('git push origin main --force', 'git push');
ne('git push origin dark-mode', 'git push'); ne('git push upstream main', 'git push'); ne('git push -u origin main', 'git push -u origin dark-mode');
eq('head --lines=10 app.log', 'head -n 10 app.log'); eq('head --lines 10 app.log', 'head -n 10 app.log'); eq('head -n10 app.log', 'head -n 10 app.log');
eq('head -10 app.log', 'head -n 10 app.log'); eq('tail --lines=20 app.log', 'tail -n 20 app.log'); eq('tail -n20 app.log', 'tail -20 app.log');
ne('head -n 5 app.log', 'head -n 10 app.log'); ne('tail -n 20 app.log', 'head -n 20 app.log'); ne('wc --lines notes.txt', 'wc -n notes.txt');
eq('rm --recursive demo', 'rm -r demo'); eq('cp --recursive musik bilder', 'cp -r musik bilder'); eq('grep --recursive TODO .', 'grep -r TODO .');
eq('grep --ignore-case TODO notes.txt', 'grep -i TODO notes.txt'); eq('grep -i --recursive TODO .', 'grep -ri TODO .');
ne('rm -r demo', 'rm demo'); ne('rm --recursive demo', 'rm demo'); ne('grep TODO notes.txt', 'grep -i TODO notes.txt');
eq('git commit --message="fixa menyn"', 'git commit -m "fixa menyn"'); eq('git commit --message "fixa menyn"', 'git commit -m "fixa menyn"');
eq('git remote --verbose', 'git remote -v'); eq('git branch --delete dark-mode', 'git branch -d dark-mode'); eq('tar --verbose -xzf backup.tar.gz', 'tar -xvzf backup.tar.gz');
ne('git commit --message="fixa"', 'git commit -m "fixa menyn"'); ne('git branch --delete dark-mode', 'git branch -D dark-mode');
eq('kill -15 4821', 'kill 4821'); eq('kill -TERM 4821', 'kill 4821'); eq('kill -s TERM 4821', 'kill 4821'); eq('kill -SIGTERM 4821', 'kill 4821');
eq('kill -9 4821', 'kill -KILL 4821'); eq('kill -s SIGKILL 4821', 'kill -9 4821'); eq('kill -s 9 4821', 'kill -s KILL 4821');
ne('kill -9 4821', 'kill 4821'); ne('kill 4821', 'kill -9 4821'); ne('kill -HUP 4821', 'kill 4821'); ne('kill 4822', 'kill 4821');
eq('ps -aux', 'ps aux'); ne('ps -ef', 'ps aux'); eq('chmod a+x deploy.sh', 'chmod +x deploy.sh'); ne('chmod +w deploy.sh', 'chmod +x deploy.sh'); ne('chmod a-x deploy.sh', 'chmod +x deploy.sh');
eq('curl -s https://example.com', 'curl https://example.com'); eq('curl --silent https://example.com', 'curl https://example.com'); eq('curl -sS https://example.com', 'curl https://example.com');
eq('curl -so data.json https://example.com/data.json', 'curl -o data.json https://example.com/data.json'); ne('curl -sI https://example.com', 'curl https://example.com');
eq('ssh-keygen -t ed25519 -C "patrik@buildapp.se"', 'ssh-keygen -t ed25519'); eq('ssh-keygen -C hej -t ed25519', 'ssh-keygen -t ed25519'); ne('ssh-keygen -t rsa', 'ssh-keygen -t ed25519');
eq('ping -c4 google.com', 'ping -c 4 google.com'); eq('ping google.com -c 4', 'ping -c 4 google.com'); ne('ping -c 5 google.com', 'ping -c 4 google.com');
eq('gh pr merge 8 --repo=Elwyndaz/forskning --merge', 'gh pr merge 8 -R Elwyndaz/forskning --merge'); eq('gh repo view --repo Elwyndaz/forskning', 'gh repo view -R Elwyndaz/forskning');
ne('gh pr merge 8 --repo Elwyndaz/annat --merge', 'gh pr merge 8 -R Elwyndaz/forskning --merge');
eqp('Test-NetConnection -ComputerName buildapp.se -Port 443', 'Test-NetConnection buildapp.se -Port 443'); eqp('Test-NetConnection -TraceRoute buildapp.se', 'Test-NetConnection buildapp.se -TraceRoute');
eqp('Test-NetConnection -Port 443 -ComputerName buildapp.se', 'Test-NetConnection buildapp.se -Port 443');
nep('Test-NetConnection buildapp.se -Port 80', 'Test-NetConnection buildapp.se -Port 443'); nep('Test-NetConnection buildapp.se', 'Test-NetConnection buildapp.se -TraceRoute');
eqp('Resolve-DnsName -Name buildapp.se', 'Resolve-DnsName buildapp.se'); nep('Resolve-DnsName -Name example.com', 'Resolve-DnsName buildapp.se');
eqp('Test-Connection -ComputerName google.com', 'Test-Connection google.com'); eqp('Test-Connection google.com -Count 4', 'Test-Connection google.com'); nep('Test-Connection google.com -Count 1', 'Test-Connection google.com');
eqp('Stop-Process -Id 4821 -Force', 'Stop-Process -Id 4821'); eqp('kill 4821 -Force', 'Stop-Process -Id 4821'); nep('Stop-Process -Id 4822 -Force', 'Stop-Process -Id 4821');
eqp('git push origin main', 'git push'); eqp('curl.exe -s https://example.com', 'curl.exe https://example.com');
// Låtsasskalet (keep) ser fortfarande -Force
assert.ok(canon(tokenize('Stop-Process -Id 4821 -Force', true), true, true).includes('-force'));

// git-grenarna som riktig git: GitHubs grenar blir lokala när man byter till dem, omöjligheter ger gits egna fel
{
  const g = {branch: 'main', branches: new Set(['main'])}, git = s => gitRefs(tokenize(s), g), no = (s, re) => assert.throws(() => git(s), re, s);
  no('git switch nope', /^Error: fatal: invalid reference: nope$/);
  no('git merge nope', /^Error: merge: nope - not something we can merge$/);
  no('git branch -d main', /cannot delete branch 'main' used by worktree at '\/home\/du\/projekt'/);
  no('git branch -d dark-mode', /error: branch 'dark-mode' not found\./);
  no('git merge dark-mode', /not something we can merge/); // finns bara på GitHub än
  assert.strictEqual(git('git branch dark-mode'), '');
  no('git branch dark-mode', /fatal: a branch named 'dark-mode' already exists/);
  no('git switch -c dark-mode', /already exists/);
  assert.strictEqual(git('git switch fix-login'), "branch 'fix-login' set up to track 'origin/fix-login'.\nSwitched to a new branch 'fix-login'");
  assert.strictEqual(git('git switch fix-login'), "Already on 'fix-login'");
  assert.strictEqual(git('git merge dark-mode'), undefined);
  assert.strictEqual(git('git checkout main'), undefined);
  assert.strictEqual(git('git checkout index.html'), undefined); // en fil, inte en gren
  assert.strictEqual(git('git branch'), '  dark-mode\n  fix-login\n* main');
  assert.ok(git('git branch -a').includes('  remotes/origin/ny-meny'));
  assert.strictEqual(git('git branch -D dark-mode'), 'Deleted branch dark-mode (was 3f9c2a1).');
  no('git push -C budget', /unknown switch `C'/);
  assert.strictEqual(git('git -C budget push'), undefined);
  assert.throws(() => gitRefs(tokenize('git status'), g, false), /not a git repository/);
  assert.strictEqual(gitRefs(tokenize('git init'), g, false), undefined);
  // reset: HEAD~n och origin/main räknas bakåt, längre än historiken ger gits fel
  const h = {commits: [{id: 'aaaaaaa'}, {id: 'bbbbbbb'}, {id: '3f9c2a1'}], pushed: 1};
  assert.deepStrictEqual(['HEAD', 'HEAD~', 'HEAD~1', 'HEAD^^', 'HEAD~2', 'origin/main', 'bbbbbbb'].map(r => back(r, h)), [0, 1, 1, 2, 2, 2, 1]);
  assert.throws(() => back('HEAD~3', h), /fatal: ambiguous argument 'HEAD~3': unknown revision/);
  assert.throws(() => gitRefs(tokenize('git reset --soft HEAD~5'), h), /ambiguous argument/);
  assert.strictEqual(gitRefs(tokenize('git reset HEAD~1'), h), undefined);
}
// Låtsasskalet, speltestarens fynd 2026-10-17. Texterna avlästa i Windows PowerShell 5.1 på Windows 11 och i Git Bash.
sh = shell(true);
assert.strictEqual(sh.out('"hej"'), 'hej', 'en sträng först skrivs ut'); assert.strictEqual(sh.out("'hej då'"), 'hej då');
sh('"hej" > h.txt'); assert.strictEqual(sh.fs.projekt['h.txt'], 'hej', '"hej" > fil');
assert.match(sh.out('$PSVersionTable'), /^PSVersion\s+5\.1\.\d+\.\d+$/m); assert.match(sh.out('$PSVersionTable'), /^PSEdition\s+Desktop$/m);
assert.match(sh.out('$PSVersionTable.PSVersion'), /Major  Minor  Build  Revision\n[-\s]+\n5      1      \d+/);
assert.strictEqual(sh.out('$env:USERPROFILE'), 'C:\\Users\\du');
assert.strictEqual(sh.out('(Get-Content notes.txt).Count'), '3'); assert.strictEqual(sh.out('(gc todo.md).Length'), '3');
assert.strictEqual(sh.out('(Get-ChildItem spel).Count'), '2', 'Count på Get-ChildItem räknar filerna, inte tabellens rader');
sh.bad('(Get-Content nope.txt).Count', /Get-Content : Cannot find path/);
assert.strictEqual(sh.out('(Get-Command node).Source'), 'C:\\Program Files\\nodejs\\node.exe');
assert.strictEqual(sh.out('(Get-Command npm).Source'), 'C:\\Program Files\\nodejs\\npm.ps1', 'PowerShell väljer npm.ps1');
assert.strictEqual(sh.out('(Get-Command ping).Source'), 'C:\\WINDOWS\\system32\\PING.EXE', 'Source stavas som i PATH');
assert.strictEqual(sh.out('(Get-Command curl).Source'), '', 'curl är ett alias, inget program');
sh.bad('(Get-Command nope).Source', /Get-Command : The term 'nope' is not recognized/);
assert.ok(/Python313/.test(sh.env.PATH ?? '') || /Python313/.test(sh.out('$env:PATH')), 'PATH har mapparna where.exe hittar programmen i');
// Windows-program: världens processer och portar, node 4821 på 3000
assert.match(sh.out('netstat -ano'), /^  Proto  Local Address          Foreign Address        State           PID$/m);
assert.strictEqual(sh.out('netstat -ano | findstr :3000'), '  TCP    [::]:3000              [::]:0                 LISTENING       4821');
assert.ok(!/LISTENING/.test(sh.out('netstat -n')), 'utan -a bara anslutningar som är igång');
assert.match(sh.out('netstat -a'), /0\.0\.0\.0:135            BUILDAPP:0             LISTENING$/m, 'utan -n står datorns namn');
assert.match(sh.out('tasklist'), /^Image Name {21}PID Session Name {8}Session# {4}Mem Usage\n={25} ={8} ={16} ={11} ={12}$/m);
assert.strictEqual(sh.out('tasklist | findstr node'), 'node.exe                      4821 Console                    1     52 108 K');
assert.match(sh.out('tasklist /FI "PID eq 4821"'), /node\.exe/); assert.strictEqual(sh.out('tasklist /FI "IMAGENAME eq nope.exe"'), 'INFO: No tasks are running which match the specified criteria.');
sh.bad('tasklist nope', /ERROR: Invalid argument\/option - 'nope'\.\nType "TASKLIST \/\?" for usage\./);
sh.bad('taskkill /PID 4821', /could not be terminated\.\nReason: This process can only be terminated forcefully \(with \/F option\)\./);
assert.strictEqual(sh.out('taskkill /PID 4821 /F'), 'SUCCESS: The process with PID 4821 has been terminated.');
assert.strictEqual(sh.out('taskkill /f /im node.exe'), 'SUCCESS: The process "node.exe" with PID 4821 has been terminated.');
assert.strictEqual(sh.out('taskkill /PID 6120'), 'SUCCESS: Sent termination signal to the process with PID 6120.', 'Code har ett fönster och kan be att få stänga');
sh.bad('taskkill /PID 999', /^Error: ERROR: The process "999" not found\.$/); sh.bad('taskkill', /Neither \/FI nor \/PID nor \/IM were specified/);
sh.bad('taskkill /F /PID 1204', /Access is denied/);
assert.strictEqual(sh.out('findstr mjölk notes.txt'), 'köp mjölk'); assert.strictEqual(sh.out('findstr /n /i MJÖLK notes.txt'), '1:köp mjölk');
assert.strictEqual(sh.out('findstr "mjölk mormor" notes.txt'), 'köp mjölk\nring mormor', 'orden är alternativ'); assert.strictEqual(sh.out('findstr /c:"köp mjölk" notes.txt'), 'köp mjölk');
assert.strictEqual(sh.out('findstr /s import *.py'), 'spel\\spel.py:import random'); assert.ok(/inga träffar/.test(sh('findstr zzz notes.txt').note));
sh.bad('findstr x nope.txt', /FINDSTR: Cannot open nope.txt/); sh.bad('findstr', /FINDSTR: Bad command line/);
assert.strictEqual(sh.out('where.exe node'), 'C:\\Program Files\\nodejs\\node.exe'); assert.strictEqual(sh.out('where.exe npm'), 'C:\\Program Files\\nodejs\\npm\nC:\\Program Files\\nodejs\\npm.cmd');
assert.ok(/WindowsApps\\python\.exe$/.test(sh.out('where.exe python')), 'Microsoft Stores python syns också');
sh.bad('where.exe nope', /INFO: Could not find files for the given pattern\(s\)\./); assert.strictEqual(sh.out('where.exe node nope'), 'C:\\Program Files\\nodejs\\node.exe\nINFO: Could not find "nope".');
assert.ok(/Where-Object[\s\S]*where\.exe/.test(sh('where node').note), 'where är Where-Object i PowerShell');
assert.ok(/Gissa/.test(sh.out('py spel/spel.py'))); sh.bad('py nope.py', /python\.exe: can't open file 'C:\\\\Users\\\\du\\\\projekt\\\\nope\.py': \[Errno 2\]/);
peq('tnc buildapp.se -Port 443', 'Test-NetConnection buildapp.se -Port 443');
// bash
sh = shell(false);
sh.bad('ls -z', /^Error: ls: invalid option -- 'z'\nTry 'ls --help' for more information\.$/); sh.bad('ls -lz', /invalid option -- 'z'/); assert.ok(o('ls -1A').length, 'riktiga flaggor går');
sh.bad('rmdir ..', /^Error: rmdir: failed to remove '\.\.': Directory not empty$/); sh.bad('rmdir .', /rmdir: failed to remove '\.': Invalid argument/);
sh.bad('rm -r ..', /refusing to remove '\.' or '\.\.'/);
sh.bad('node spel/spel.py', /TypeError \[ERR_UNKNOWN_FILE_EXTENSION\]: Unknown file extension "\.py" for \/home\/du\/projekt\/spel\/spel\.py[\s\S]*Node\.js v/);
sh('echo print(1) > h.py'); sh.bad('node h.py', /h\.py:1\nprint\(1\)\n\^\n\nReferenceError: print is not defined/);
sh('echo "- [ ] ny punkt" >> todo.md'); assert.ok(o('cat todo.md').endsWith('\n- [ ] ny punkt'), 'text som börjar med streck är ingen flagga');
assert.strictEqual(o('tail -2 app.log').split('\n').length, 2, '-2 är fortfarande en flagga');
assert.ok(TASKS.some(t => /av en slump/.test(t[4]) && /find/.test([].concat(t[3])[0])), 'find utan citattecken: förklaringen nyanserad');
sh = shell(true);
sh('Add-Content todo.md "- [ ] ny"'); assert.ok(sh.out('Get-Content todo.md').endsWith('\n- [ ] ny'));
sh('echo "- [ ] två" >> todo.md'); assert.ok(sh.out('cat todo.md').endsWith('\n- [ ] två'));

console.log(`ok: ${TASKS.length} uppgifter, ${n} bash-svar och ${np} PowerShell-svar kontrollerade, låtsasskalet i båda skalen`);
