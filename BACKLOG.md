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
- [ ] Bygg om paketet Som Claude Code från loggdatan (2026-10-17: grep, head, git, curl, uv, ls, tail, node i topp; PowerShell mest för att döda dev-servrar). Ta också med kommandon Patrik kör själv med `!` (bash-input i transkripten), t.ex. `powershell -Command "Stop-Process -Id N"`: det han gör på riktigt ska han kunna öva på.
- [ ] Patrik spelar och lyssnar: välj ljud bland `terminal-ljud.js`, `?ljud=gemini` och `?ljud=mp3` (bara lokalt, spåren i `_musik/`), radera det som väljs bort.
- [ ] Om mp3 vinner: kolla Lyrias användningsvillkor, ta in `_musik/` i git och kolla att looparna inte hackar i skarven.
- [x] Egen integritetstext för spelet, `integritet.html`, 2026-10-17.
- [x] Paket Terminalvett (15 uppgifter 2026-10-17, utan hjälp-uppgifter eftersom man/Get-Help öppnar hjälpkortet, och utan zip): hjälp (Get-Help, Get-Command), installera (winget, npm, uv, npx/uvx), processer och portar, miljö (PATH, `$?`), nätverk (ipconfig, ping, Resolve-DnsName, Test-NetConnection), ssh-keygen, zip. Hjälpkortet får raden "begreppet bakom".
- [x] Paket Cloudflare & Firebase (15 uppgifter 2026-10-17: wrangler login/dev/deploy/tail/secret put, d1 execute --remote, rollback) och Firebase (login, use, deploy --only hosting, emulators:start).
- [ ] Programspråk som egna paket (Python-REPL, JS-konsol, SQL).
- [ ] Delad topplista mellan vänner. Kräver backend och ny integritetstext; bara om ni faktiskt tävlar.

## Testagenternas fynd kvar (2026-10-17)

Krascher, fusk, mobil och de största PowerShell-avvikelserna är fixade (`db47b77`). Kvar, alla små:

- [ ] bash: `cd -` (förra mappen), globbar (`ls *.txt`, `rm *.log`), `wc` utan flagga ger rader, ord och tecken, flera filer till `cat`/`head`/`wc`, `tail -n +28`, `./notes.txt` ska ge "Permission denied", `ls -1/-R/-d`, `cat < f`, `echo $HOME`, `cd a b` ska ge "too many arguments", `mv a b mapp` med flera källor.
- [ ] bash: kommandon som saknas: find, grep (fritt), tree, which, less, man, nano, export.
- [ ] PowerShell: `New-Item -Name` och `-Value`, `-Force` som skriver över, jokertecken, `gci`-filter (`-Name`, `-File`, `-Directory`, `-Hidden`), kommalistor (`rm a, b`), extra positionella argument ("A positional parameter cannot be found..."), `cd..` och `cd\`, `$HOME`/`$PWD`, dold mapp kräver `-Force` för att tas bort, `Rename-Item` med sökväg ska ge fel, `.\deploy.sh`, `ls -l` och `ls -a` ger 5.1:s fel.
- [ ] PowerShell: kommandon som finns men säger "not recognized": Get-Help, Write-Host, Test-Path, Get-Item, Out-File, ii, start, explorer, tree.
- [ ] Kosmetiskt: `;;` och `ls |` ger syntaxfel, pil ner återställer halvskriven rad, `Get-ChildItem`-tabellen bryts på 390 px, `s` i menyn byter skal även för den som börjar skriva `ls`.
