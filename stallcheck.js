// Leker med kommandon och spolar tiden framåt. Larmar om inga nya block kommer på 40 spelsekunder fast rundan inte är slut.
const pw = require('C:/dev/fackligastudier/node_modules/playwright');
const url = process.argv[2] || 'http://localhost:8766/';
const CMDS = {
  bash: ['cd ..', 'cd ~', 'cd', 'cd projekt', 'cd spel', 'cd musik', 'cd bilder', 'cd server', 'cd .hemligt', 'cd .git', 'cd ../recept', 'cd /', 'cd -',
    'mkdir x', 'mkdir -p a/b', 'touch a.txt', 'rm notes.txt', 'rm -r spel', 'rm -rf musik', 'rm -r bilder', 'rm -rf ../projekt', 'rm -r ~/projekt', 'rm -rf ~/recept', 'rm -rf .git',
    'mv spel bilder', 'mv notes.txt x', 'cp -r server kopia', 'rm -rf *', 'rm *', 'ls -a', 'ls', 'clear', 'echo hej > b.txt', 'rmdir bilder', 'mv musik ..', 'cd ../..', 'mv ../recept .'],
  ps: ['cd ..', 'Set-Location ~', 'cd projekt', 'cd spel', 'cd musik', 'cd bilder', 'cd .hemligt', 'cd ../recept', 'cd \\', 'cd C:\\',
    'mkdir x', 'New-Item a.txt', 'Remove-Item notes.txt', 'Remove-Item spel -Recurse', 'Remove-Item musik -Recurse -Force', 'Remove-Item ..\\projekt -Recurse -Force', 'Remove-Item ~\\projekt -Recurse',
    'Move-Item spel bilder', 'Copy-Item server kopia -Recurse', 'Remove-Item * -Recurse', 'Get-ChildItem -Force', 'cls', 'rmdir bilder', 'Move-Item musik ..', 'cd ..\\..'],
};
(async () => {
  const b = await pw.chromium.launch(), p = await b.newPage({viewport: {width: 1280, height: 860}}), errs = [];
  p.on('pageerror', e => errs.push(e.message));
  let stalls = [];
  for (const sh of (process.argv[4]||'bash,ps').split(',')) for (const pack of (process.argv[3]||'fs,git,cc,stop,all').split(',')) for (let seed = 0; seed < +(process.argv[5]||12); seed++) {
    await p.goto(url + '?nc=' + Date.now());
    await p.evaluate(s => localStorage.setItem('term-shell', JSON.stringify(s)), sh); await p.reload();
    const r = await p.evaluate(({pack, cmds, seed}) => {
      prefs.pack = pack; prefs.level = 1 + (seed % 3); start();
      const hist = []; let quiet = 0, last = S.seq + S.blocks.length + S.cleared, spawned = 0;
      for (let t = 0; t < 4000 && mode === 'play'; t++) {
        if (t % 40 === 0) { const c = cmds[Math.floor(Math.random() * cmds.length)]; hist.push(c); run(c); }
        // ibland löser vi ett block, så att vi kommer upp i nivå
        if (t % 25 === 0 && S.blocks.some(x => !x.landed) && Math.random() < .6) { const x = S.blocks.find(x => !x.landed); run(x.steps[x.step][0].raw.replace('{any}', 'x')); }
        if (mode === 'boss') { bossAnswer(0); bossEnd(); }
        if (mode !== 'play') break;
        tick(.1);
        const now = S.blocks.length + S.cleared;
        if (now !== last) { quiet = 0; last = now; spawned++; } else if (!S.blocks.some(x => !x.landed)) quiet += .1;
        if (quiet > 40) return {stall: true, level: S.level, cwd: S.cwd.join('/'), landed: S.blocks.length, hist: hist.slice(-8), ls: Object.keys(look(S.fs, S.cwd, S.ps).node || {}).join(' ') || '(finns inte eller tom)', H: S.H, lanes: S.lanes, spawnIn: S.spawnIn, mode, seen: [...S.seen], ran: [...S.ran], went: [...S.went], spawned: spawn(), after: S.blocks.length, blocks: S.blocks.map(x => [x.lane, Math.round(x.y), x.h, x.landed, x.text]), draw: [0,1,2,3,4].map(() => draw(TASKS.filter(t => t[0] === S.pack && (!S.ps || t[5])))?.text ?? null)};
      }
      return {stall: false, mode, level: S?.level};
    }, {pack, cmds: CMDS[sh], seed});
    if (r.stall) { stalls.push(`${sh} ${pack}: ${JSON.stringify(r)}`); }
  }
  await b.close();
  console.log(stalls.length ? `FAIL ${stalls.length} stopp:\n` + stalls.join('\n') : 'PASS inga stopp');
  if (errs.length) console.log('fel: ' + [...new Set(errs)].join('; '));
  process.exit(stalls.length || errs.length ? 1 : 0);
})();
