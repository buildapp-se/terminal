# Backlog

Flyttat från `buildapp-se/ai` 2026-10-17.

## Prioritet (2026-10-17)

1. **Straffar rätt svar:** likvärdiga former (agent A), git-världens omöjligheter (agent B), rödmarkeringen i  (Brain).
2. **Låtsasskalet och småfel:** PS-uttryck, Windows-program, bash-detaljer, text som börjar med streck (agent C); mobil, quizräknaren, OUTPUT-fliken, skal i topplistan, vim/claude i quizet, filer vid storleksbyte (agent D); vikten för "Lista filerna" (Brain).
3. **Större bygg:** mer git i världen (agent B efter steg 1), Bit och dcg, Vad Claude gör ur loggarna, idéerna ur granskningen.
4. **Underhåll:** PS-tabellerna samlade, mer logik in i  och testad. Efter agenterna, eftersom det rör samma kod.
5. **Sist:** programspråk, delad topplista, mp3 (Lyrias villkor).

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
- [ ] Bygg om paketet Vad Claude gör (förr Som Claude Code) från loggdatan (2026-10-17: grep, head, git, curl, uv, ls, tail, node i topp; PowerShell mest för att döda dev-servrar). Ta också med kommandon Patrik kör själv med `!` (bash-input i transkripten), t.ex. `powershell -Command "Stop-Process -Id N"`: det han gör på riktigt ska han kunna öva på.
- [x] Världen följer allt man skriver (2026-10-17): `render()`, grenar, clone/init/commit/restore, `git status`/`log`/`branch` ur världen, quizets terminal, redigerbara filer med Ctrl+S.
- [ ] Bit reagerar på allt som dcg (Destructive Command Guard, hooken som stoppar Claude Code) blockerar, och förklarar varför (Patriks idé 2026-10-17). I dag reagerar `PET_FEAR` bara på fem mönster. dcg 0.12.0 har fem paket på: `core.filesystem`, `core.git`, `system.disk`, `windows.filesystem`, `windows.system`. Provat med `dcg test`: blockerar `rm -r`/`rm -rf`, `push --force` (men inte `--force-with-lease`), `reset --hard`, `clean -fd`, `checkout -- .`, `restore .`, `branch -D`, `stash clear`, `Remove-Item -Recurse -Force`, `curl … | bash`, dd mot disk. Släpper igenom `chmod -R 777`, `DROP TABLE` via wrangler, `docker system prune`, `gh repo delete`, `npm unpublish`.
  - Hur: en ren tabell `DANGER` (mönster, dcg-regelns namn, svensk förklaring, säkrare alternativ) som ersätter `PET_FEAR`. Bubblan: "Här hade dcg stoppat Claude: … Säkrare: …". Rätt svar räknas som vanligt, Bit avbryter aldrig. Block vars svar är farligt får en röd ⚠ redan innan man skriver. Ett lokalt kontrollskript kör alla svar i `TASKS` genom `dcg test` och larmar när tabellen och dcg inte är överens (dcg körs inte i webbläsaren, och testet ska inte kräva dcg).
  - Fördelar: lär ut varför agenten stannar (passar Vibe-kodaren och När agenten stannar), vanan att läsa raden före Enter, och det säkrare alternativet (`--force-with-lease`, `git stash`).
  - Nackdelar: `rm -r` och `git restore .` är rätt svar i Filer & mappar, så Bit kan tjata (tips en gång per kommando och runda). Tabellen kan glida isär från dcg när dcg uppdateras (därav kontrollskriptet). Risk för falsk trygghet: dcg släpper igenom `chmod 777` och `DROP TABLE`, så Bit ska säga "dcg släpper igenom det här, men…" även för dem.
- [ ] Mer git i världen, i den ordning de lär ut mest (analysagentens lista 2026-10-17): `git add` med en riktig "Staged Changes"-lista och commit som bara tar det stagade; `git stash`/`stash pop`; `git reset` (`--hard` tar tillbaka filerna, `HEAD~1` tar bort senaste commiten); `git -C mapp` mot rätt mapp.
- [ ] Patrik spelar och lyssnar: välj ljudmotor i inställningarna (# ljudmotor: standard, gemini, mp3 bara lokalt; sätter `?ljud=` och laddar om, byggt 2026-10-17), radera det som väljs bort.
- [ ] Om mp3 vinner: kolla Lyrias användningsvillkor, ta in `_musik/` i git och kolla att looparna inte hackar i skarven.
- [x] Egen integritetstext för spelet, `integritet.html`, 2026-10-17.
- [x] Paket Terminalvett (15 uppgifter 2026-10-17, utan hjälp-uppgifter eftersom man/Get-Help öppnar hjälpkortet, och utan zip): hjälp (Get-Help, Get-Command), installera (winget, npm, uv, npx/uvx), processer och portar, miljö (PATH, `$?`), nätverk (ipconfig, ping, Resolve-DnsName, Test-NetConnection), ssh-keygen, zip. Hjälpkortet får raden "begreppet bakom".
- [x] Paket Cloudflare & Firebase (15 uppgifter 2026-10-17: wrangler login/dev/deploy/tail/secret put, d1 execute --remote, rollback) och Firebase (login, use, deploy --only hosting, emulators:start).
- [ ] Programspråk som egna paket (Python-REPL, JS-konsol, SQL).
- [ ] Delad topplista mellan vänner. Kräver backend och ny integritetstext; bara om ni faktiskt tävlar.

## Testagenternas fynd (2026-10-17)

- [x] Alla småfynd i bash och PowerShell åtgärdade, plus upprepningen i små paket (`maxLvFor`), `5616bec`.

## Speltestarens fynd (2026-10-17, efter `5616bec` kvar)

- [x] Fel som lär ut fel: versionsfrågor, Hello world med > i PowerShell, `npx firebase-tools`, Confirm-frågan för icke-tom mapp (`4caaf67`).
- [ ] git-världen säger ja till omöjligheter: `switch nope`, `merge nope`, `branch -d main` på main. Alla grenar i `POOLS.b` finns lokalt från start (`fresh`), så `git branch dark-mode` borde svara "already exists"; låt dem ligga under `remotes/origin/` tills man byter till dem. `git push -C budget` godkänns som `git -C budget push` (`-C` gäller bara före underkommandot). Clone: `cd budget` + `git status` visar "Untracked projekt/budget", `git init` där ska ge "Reinitialized", `git clone url mapp` ska säga 'mapp'.
- [ ] PS-uttryck: `"hej"`, `"hej" > f`, `$PSVersionTable`, `$env:USERPROFILE`, `(Get-Content f).Count`, `(Get-Command node).Source`.
- [ ] Windows-program i PS: netstat, findstr, tasklist, taskkill, where.exe, py, tnc (alias för Test-NetConnection).
- [ ] Godkänn likvärdiga former: `git push/pull origin main`; långa flaggor (`--lines=10`, `--recursive`, `--message=`, `--verbose`, `--delete`, `--ignore-case`), `-n10`, `kill -15/-TERM`, `ps -aux`, `chmod a+x`, `curl -s`, `ssh-keygen -C`, `ping -c4`; PS namngivna `Test-NetConnection -ComputerName`, `Resolve-DnsName -Name`, `Test-Connection -Count`, `Stop-Process -Id -Force`.
- [x] Giltiga fria kommandon (`node --version`, `ping`) visar `sample()` och "# rätt kommando, men inget block bad om det", räknas fortfarande som fel (låst beslut, mellanläge Patrik 2026-10-17).
- [ ] bash: `ls -z` ska ge "invalid option", `rmdir ..` fel text, `node spel.py` kör Python. Förklaringen till `find -name *.js` utan citattecken: nyansera.
- [ ] "Lista filerna i mappen du står i" är 9 av 40 block i Filer & mappar: sänk vikten.
- [ ] Mobil: ingen pausknapp (texten säger Esc), kugghjulet syns inte, "Enter starta" under kanten; quizets para ihop och hjälpkortet: dd hamnar utanför 390 px (dt över dd under 600 px). Hjälpkortets första rad klipps under panelflikarna.
- [ ] Smått: quizräknaren "2 rätt" blir "13 av 16" (para ihop räknas 4), OUTPUT-fliken säger "Spela en runda" mitt i en runda, topplistan och delningstexten visar inte skal, källkontrollens placeholder klipps.
- [x] Tab-komplettering (`4caaf67`).

## Antigravitys granskning (2026-10-17, på `4caaf67`, kvar)

Rapporten kontrollerades mot koden; det mesta åtgärdat samma dag (se `HANDOFF.md`). Kvar:

- [x] `[P1]` Fria kommandon kan låsa ett block i Filer & mappar (`touch backup` före "Skapa mappen backup"). Byggt 2026-10-17: spelet städar inte, Bit varnar en gång per block med skalets eget fel och vad man gör (ta bort det som står i vägen, eller skapa det som saknas). Patrik: man får ta bort den själv.
- [x] Samtidiga block (låst beslut omprövat, Patrik ja 2026-10-17): högst nivå + 1 i luften, `maxLvFor`-gränsen 7 så att git börjar på svårighet 1.
- [ ] Rödmarkeringen i `explain`: saknas bara en flagga (`grep TODO .` mot `grep -r TODO .`) blir alla rätta argument röda; säg "# rätt kommando, men en flagga saknas". Commit-meddelande utan citattecken får ingen förklaring, och citerad fel text markeras inte (`echo` delar på mellanslag).
- [ ] Låtsasskalet: text som börjar med streck räknas som flagga, så `echo "- [ ] ny punkt" >> todo.md` och `Add-Content todo.md "- [ ] ny"` går fel (rättningen klarar det sedan 2026-10-17).
- [ ] `vim` eller `claude` i quizet: prompten fastnar i vim- eller agentläget även på resultatskärmen.
- [ ] Antalet filer räknas bara vid rundstart (`S.lanes`): stänger man Bits panel eller ändrar fönstret mitt i rundan följer de inte med. Obs: med panelen öppen på 1 280 px är brunnen under 980 px, alltså 2 filer i stället för 3.
- [ ] Underhåll: PowerShell-cmdlets står i åtta tabeller (`PSALIAS`, `PSPARAMS`, `PSPOS`, `PSOP`, `PSCMD`, `PSNAME`, `KNOWNPS`...) som har glidit isär; samla i en. `node()` vid källkontrollen dubblerar `look()`.
- [ ] Tester: `OUT`, `sample`, `gitWorld`, `changes`, `petTip` ligger utanför `pure` och testas inte; svaren i andra paket än Filer & mappar körs inte genom `fake()` i testet.
- [ ] Idéer ur granskningen: klickbara lampor i Bits panel (tänd 8 4 2 1 och se summan, plus chmod-siffran för tre bitar), PORTS-fliken som släpper 4821 när man dödat processen, piratlapp på Bit när man hittat `.hemligt/skatt.txt`, `git diff` som visar spelarens egen ändring.
