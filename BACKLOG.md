# Backlog

Flyttat från `buildapp-se/ai` 2026-10-17.

## Prioritet (2026-10-17)

1. **Klart:**  likvärdiga former (agent A), git-världens omöjligheter (agent B), rödmarkeringen i `explain` (Brain).
2. **Klart:**  PS-uttryck, Windows-program, bash-detaljer, text som börjar med streck (agent C); mobil, quizräknaren, OUTPUT-fliken, skal i topplistan, vim/claude i quizet, filer vid storleksbyte (agent D); vikten för "Lista filerna" (Brain).
3. **Klart:** större bygg (agent B, E, F, G).
4. **Underhåll:** PS-tabellerna samlade, mer logik in i `pure` och testad. Efter agenterna, eftersom det rör samma kod.
5. **Sist:** programspråk, delad topplista, mp3.

## Spelet

- [x] `[P1]` Paket "När agenten stannar", 18 uppgifter 2026-10-17, med Patriks egna `gh pr merge 8 -R Elwyndaz/forskning --merge` och `git branch -D` på flera grenar. Kvar ur underlaget: `git worktree remove`, `codex mcp add`, `claude plugin install`, `wsl.exe -e bash -lc`, `MSYS_NO_PATHCONV=1`.
- [x] Påskägg "formatera om datorn" byggt 2026-10-17, beskrivning i `CONTEXT.md`.
- [x] Påskägg "gå in i en agent" byggt 2026-10-17 (`027e37c`): `claude`, `codex`, `opencode` med flera byter prompten mot agentens (`>`). Där inne rensar bara `!ls` block; skriver man `ls` utan `!` går det som en fråga till agenten, som svarar roligt men inte hjälper (spinnerord som "Funderar…" medan blocken faller, "Du har helt rätt!", ger rätt svar i fel skal, ber om lov med y/n och rensar ett block på `y` innan "usage limit, återställs kl 03.00"). Esc avbryter tänkandet. Ut med `/exit` eller Ctrl+C två gånger, som på riktigt; hjälpkortet visar alltid vägen ut. Lärdomen: i Claude Code skickar du text till agenten, `!` kör skalet (i Git Bash). Varje skämt ska bära en sådan lärdom, annars stryks det. Patrik 2026-10-17: alla idéerna är bra, även agentläget som riktig mekanik i Som Claude Code (varannan våg kräver `!`).
- [x] Quizläge 2026-10-17: tio frågor per paket ur spelets egna uppgifter, flerval och para ihop, resultat efter varje quiz. Bossfrågan läser fortfarande ai-quizet (Patrik gillade dem).
- [x] README öppnas som flik i redigeraren, som i VS Code, inte i terminalen (Patrik 2026-10-17).
- [x] Terminalpanelen går att dra upp och ner, som i VS Code (Patrik 2026-10-17).
- [x] Allt klickbart till vänster (aktivitetsfältet, sidofältets vyer) ser ut ungefär som i VS Code (Patrik 2026-10-17).
- [x] VS Code-ramen klickbar 2026-10-17: menyer, README-flik, utforskaren, sök med påskägg, källkontroll, PROBLEMS, OUTPUT, DEBUG CONSOLE, PORTS, fönsterknappar, zen-läge.
- [x] Påskägg i terminalen: vim-fällan (`:q!` för att komma ut), sl, sudo-raden, Konami, en riktig kommandopalett (Ctrl+Shift+P med `>`).
- [x] Vad Claude gör ombyggt ur 2 520 Claude Code-loggar (agent F 2026-10-17): 23 uppgifter ur det Claude kör oftast (head, grep -n, uv run, sed -n, tail, git status --short, git log --oneline, curl -s, tsc), förklaringen säger varför Claude kör det. Patriks egna !-kommandon fanns redan i Vibe-kodaren. Kvar: `git push origin --delete` och `git fetch --prune` i git-paketet; `Select-Object -Skip` i `piped`.
- [x] Världen följer allt man skriver (2026-10-17): `render()`, grenar, clone/init/commit/restore, `git status`/`log`/`branch` ur världen, quizets terminal, redigerbara filer med Ctrl+S.
- [x] Bit reagerar på allt som dcg blockerar (agent E 2026-10-17): `DANGER` + `danger()` i pure, 17 dcg-regler och 6 som dcg släpper igenom ("dcg släpper igenom det här, men…"), högst en varning per regel och runda, röd ⚠ på block med farligt svar, `tools/dcg-check.mjs` jämför med riktiga `dcg test`. dcg 0.12.0 stoppar även `git restore fil` och `git branch -d`, så de varnas också. Kvar: `git stash drop` (dcg varnar bara), cmd:s `rmdir /s` och `del /s`.
- [x] Mer git i världen (agent B): staging (`S.index`, Staged Changes), stash, reset. Förenklat: `stash pop` skriver över i stället för att slå ihop.
- [ ] Patrik spelar och lyssnar: välj ljudmotor i inställningarna (# ljudmotor: standard, gemini, mp3 bara lokalt; sätter `?ljud=` och laddar om, byggt 2026-10-17), radera det som väljs bort.
- [ ] Om mp3 vinner (villkoren kollade 2026-10-18: OK med AI angivet som källa, se vaultens Job - Musik med Gemini): ta in `_musik/` i git och kolla att looparna inte hackar i skarven.
- [x] Egen integritetstext för spelet, `integritet.html`, 2026-10-17.
- [x] Paket Terminalvett (15 uppgifter 2026-10-17, utan hjälp-uppgifter eftersom man/Get-Help öppnar hjälpkortet, och utan zip): hjälp (Get-Help, Get-Command), installera (winget, npm, uv, npx/uvx), processer och portar, miljö (PATH, `$?`), nätverk (ipconfig, ping, Resolve-DnsName, Test-NetConnection), ssh-keygen, zip. Hjälpkortet får raden "begreppet bakom".
- [x] Paket Cloudflare & Firebase (15 uppgifter 2026-10-17: wrangler login/dev/deploy/tail/secret put, d1 execute --remote, rollback) och Firebase (login, use, deploy --only hosting, emulators:start).
- [ ] Programspråk som egna paket (Python-REPL, JS-konsol, SQL).
- [ ] Delad topplista mellan vänner. Kräver backend och ny integritetstext; bara om ni faktiskt tävlar.
- [ ] `[P2]` Typkontroll utan byggsteg (2026-10-18): projektet saknar TypeScript, i strid med regeln om `strict: true` i varje JS-projekt. Flytta skriptet ur `index.html` till `terminal.js`, lägg `jsconfig.json` med `checkJs` och `strict: true`, typa med JSDoc och kör `npx tsc --noEmit` som kontroll. Räkna med hundratals anmärkningar i första körningen.

## Testagenternas fynd (2026-10-17)

- [x] Alla småfynd i bash och PowerShell åtgärdade, plus upprepningen i små paket (`maxLvFor`), `5616bec`.

## Speltestarens fynd (2026-10-17, efter `5616bec` kvar)

- [x] Fel som lär ut fel: versionsfrågor, Hello world med > i PowerShell, `npx firebase-tools`, Confirm-frågan för icke-tom mapp (`4caaf67`).
- [x] git-världen säger nej som riktig git (agent B 2026-10-17): switch/merge/branch -d med gits fel, grenar under remotes/origin/, init Reinitialized, clone 'mapp', status i klonen. Texterna `used by worktree at` och `not found.` är inte avlästa mot riktig git (dcg stoppade provet). Kvar: `git checkout nope` och `git add` på saknad fil ger inget fel.
- [x] PS-uttryck (agent C 2026-10-17): `"hej"`, `"hej" > f`, `$PSVersionTable`, `(Get-Content f).Count`, `(Get-Command node).Source`, avlästa på riktig PowerShell 5.1.
- [x] Windows-program i PS (agent C): netstat, findstr, tasklist, taskkill, where.exe (`where` är Where-Object: lärdom), py, tnc. Siffrorna stämmer med PORTS och Get-Process. Kvar: taskkill tar inte bort processen ur världen; findstr kan inte sina egna reguljära uttryck.
- [x] Godkänn likvärdiga former (agent A 2026-10-17, normalisering i `canonStage`/`canonPSStage`: `LONGFLAG`, `NOOP`, `SIGS`, `PSDROP`). Kvar: `-Force` inuti `powershell -Command "..."` (citatet är en token), `git push origin HEAD`, `tnc`-aliaset.
- [x] Giltiga fria kommandon (`node --version`, `ping`) visar `sample()` och "# rätt kommando, men inget block bad om det", räknas fortfarande som fel (låst beslut, mellanläge Patrik 2026-10-17).
- [x] bash (agent C): `ls -z` (GNU-texten, Git Bash säger `unknown option`), `rmdir ..`/`.` (ej avlästa, dcg), `node spel.py` ger nodes fel, `find -name *.js` nyanserad.
- [x] "Lista filerna" var 9 av 40 block i Filer & mappar, nu 3 till 4 (2026-10-17): tvingas fram i nya mappar bara de tre första gångerna och dras inte slumpvis där man redan listat.
- [x] Mobil (agent D 2026-10-17): paus och kugghjul i panelens flikrad under 700 px, knappraden fast i bladets botten, dt över dd under 600 px, hjälpkortet börjar överst. Kvar: Bits bubbla och ägg täcker terminalens nedersta rad på 390 px.
- [x] Smått (agent D): quizräknaren "X av Y rätt hittills", OUTPUT mitt i rundan, skal (`sh`) i topplista och delning (integritet 1.2), källkontrollens platshållare växer (`field-sizing`, inte i Firefox).
- [x] Tab-komplettering (`4caaf67`).

## Antigravitys granskning (2026-10-17, på `4caaf67`, kvar)

Rapporten kontrollerades mot koden; det mesta åtgärdat samma dag (se `HANDOFF.md`). Kvar:

- [x] `[P1]` Fria kommandon kan låsa ett block i Filer & mappar (`touch backup` före "Skapa mappen backup"). Byggt 2026-10-17: spelet städar inte, Bit varnar en gång per block med skalets eget fel och vad man gör (ta bort det som står i vägen, eller skapa det som saknas). Patrik: man får ta bort den själv.
- [x] Samtidiga block (låst beslut omprövat, Patrik ja 2026-10-17): högst nivå + 1 i luften, `maxLvFor`-gränsen 7 så att git börjar på svårighet 1.
- [x] Rödmarkeringen i `explain` (2026-10-17): saknas bara något säger spelet "# rätt kommando, men en flagga eller ett argument saknas" i stället för att färga rätta ord; commit-meddelande utan citattecken får en förklaring. Kvar: citerad fel text markeras inte (`echo` delar på mellanslag).
- [x] Text som börjar med streck i `fake`/`piped` (agent C).
- [x] `vim`/`claude` i quizet släpps vid resultat och bossfråga (`plainPrompt`, agent D).
- [x] Antalet filer följer fönstret och Bits panel (`relane`, agent D), men byts först när inget block ligger landat (staplar slås aldrig ihop).
- [ ] Underhåll: PowerShell-cmdlets står i åtta tabeller (`PSALIAS`, `PSPARAMS`, `PSPOS`, `PSOP`, `PSCMD`, `PSNAME`, `KNOWNPS`...) som har glidit isär; samla i en. `node()` vid källkontrollen dubblerar `look()`.
- [ ] Tester: `OUT`, `sample`, `gitWorld`, `changes`, `petTip` ligger utanför `pure` och testas inte; svaren i andra paket än Filer & mappar körs inte genom `fake()` i testet.
- [x] Idéer ur granskningen (agent G): klickbara lampor 8 4 2 1 med chmod-tolkning i Bits panel, port 3000 ledig när node 4821 är dödad (ps, netstat, lsof, Get-NetTCPConnection, PORTS), piratlapp på Bit vid skatten, riktig `git diff`/`--staged` (udiff). Kvar: `git diff HEAD`/`--stat` mot en gren, pkill/killall.

## Granskning 2026-10-28 (Audits-kolumnerna)

- [x] `[P2]` Kontrast: `.dim` (#6e7681) ger 3,86:1 mot #181818 och 1,84:1 på vald knapp (#264f78) i skalvalet; Bits `.bin` (#7a7a7a) 4,13:1. Krav 4,5:1 (axe och Lighthouse, mobil). Fixat 2026-10-28: `--faint` #808893, vald rads undertext #BCC6D0, `.bin` #888.
- [x] `[P2]` `#pet` har `aria-label` utan den synliga texten (0000), label-content-name-mismatch. Fixat 2026-10-28: namnet börjar med bitarna; lekytans lampor ritar 0/1 med CSS av samma skäl.
- [x] `[P2]` Klickytor under 44 px enligt UX-skriptet (Fitts), vilka element är inte listade; skärmbildsgenomgången inte gjord. Fixat 2026-10-28: på 390 px var det sökrutan, panelflikarna, kugghjulet, skalvalet, kommandoraden och statusradens knappar; under 700 px är titel-, flik- och statusraden 44 px, sökrutan har genomskinlig kant och `#cmd` en högre osynlig yta. Skalvalet minst 24 px även på dator.
- [x] `[P3]` Ingen `<main>`-landmärke (landmark-one-main). Fixat 2026-10-28: `.work` är `<main>` med dold `<h1>`.
- [x] `[P3]` Två `<section>` utan rubrik (W3C-varning, rad 261 och 268 i levererad HTML). Fixat 2026-10-28: redigeraren och panelen är `<div>`, de är fönsterytor, inte avsnitt.
- [ ] `[P3]` Renderblockerande förfrågningar kostar cirka 550 ms LCP på Slow 4G (troligen Google Fonts-CSS).
- [x] `[P3]` Personlig gmail som författaradress på 15 commits i den publika historiken. Accepterat av Patrik 2026-10-28: historiken skrivs inte om. Nya commits går via noreply.
