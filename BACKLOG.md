# Backlog

Flyttat från `buildapp-se/ai` 2026-10-17.

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
- [ ] Mer git i världen, i den ordning de lär ut mest (analysagentens lista 2026-10-17): `git add` med en riktig "Staged Changes"-lista och commit som bara tar det stagade; `git stash`/`stash pop`; `git reset` (`--hard` tar tillbaka filerna, `HEAD~1` tar bort senaste commiten); `git -C mapp` mot rätt mapp.
- [ ] Patrik spelar och lyssnar: välj ljud bland `terminal-ljud.js`, `?ljud=gemini` och `?ljud=mp3` (bara lokalt, spåren i `_musik/`), radera det som väljs bort.
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
- [ ] git-världen säger ja till omöjligheter: `switch nope`, `merge nope`, `branch -d main` på main. Clone: `cd budget` + `git status` visar "Untracked projekt/budget", `git init` där ska ge "Reinitialized", `git clone url mapp` ska säga 'mapp'.
- [ ] PS-uttryck: `"hej"`, `"hej" > f`, `$PSVersionTable`, `$env:USERPROFILE`, `(Get-Content f).Count`, `(Get-Command node).Source`.
- [ ] Windows-program i PS: netstat, findstr, tasklist, taskkill, where.exe, py, tnc (alias för Test-NetConnection).
- [ ] Godkänn likvärdiga former: `git push/pull origin main`; långa flaggor (`--lines=10`, `--recursive`, `--message=`, `--verbose`, `--delete`, `--ignore-case`), `-n10`, `kill -15/-TERM`, `ps -aux`, `chmod a+x`, `curl -s`, `ssh-keygen -C`, `ping -c4`; PS namngivna `Test-NetConnection -ComputerName`, `Resolve-DnsName -Name`, `Test-Connection -Count`, `Stop-Process -Id -Force`.
- [ ] Giltiga fria kommandon räknas som tyst fel (`node --version`, `gh pr list`, `Get-Process`): visa `sample()` och "# rätt kommando, men inget block bad om det".
- [ ] bash: `ls -z` ska ge "invalid option", `rmdir ..` fel text, `node spel.py` kör Python. Förklaringen till `find -name *.js` utan citattecken: nyansera.
- [ ] "Lista filerna i mappen du står i" är 9 av 40 block i Filer & mappar: sänk vikten.
- [ ] Mobil: ingen pausknapp (texten säger Esc), kugghjulet syns inte, "Enter starta" under kanten; quizets para ihop och hjälpkortet: dd hamnar utanför 390 px (dt över dd under 600 px). Hjälpkortets första rad klipps under panelflikarna.
- [ ] Smått: quizräknaren "2 rätt" blir "13 av 16" (para ihop räknas 4), OUTPUT-fliken säger "Spela en runda" mitt i en runda, topplistan och delningstexten visar inte skal, källkontrollens placeholder klipps.
- [x] Tab-komplettering (`4caaf67`).
