# Backlog

Flyttat från `buildapp-se/ai` 2026-10-17.

## Spelet

- [ ] `[P1]` Paket "När agenten stannar": kommandon som Claude och Codex ber Patrik köra själv. Underlag från loggarna 2026-10-17 (2 536 transkript, skript `handoff-cmds.mjs` i sessionens scratchpad), sju grupper: logga in (`gh auth login -h github.com -w`, `gh auth refresh -s workflow`, `gh auth switch`, `npx wrangler login`), pusha och merga (`git push`, `git -C mapp push`, `git push -u origin gren`, `gh pr merge N --squash`), radera och städa (`git branch -D`, `git worktree remove`, `git checkout -- fil`), databas och hemligheter (`wrangler d1 execute --remote`, `wrangler secret put`), öppna filer (`start "" fil`, `explorer mapp`), installera (`winget install --id X -e`, `claude plugin install`, `codex mcp add`) och mellan skal (`powershell -Command "..."`, `wsl.exe -e bash -lc '...'`, `MSYS_NO_PATHCONV=1`). Hjälpkortet säger varför agenten stannade (behöver webbläsare, går inte att ångra, rör produktion).
- [ ] Påskägg "formatera om datorn": `rm -rf / --no-preserve-root`, `sudo rm -rf /*`, `dd if=/dev/zero of=/dev/sda`, `mkfs`, `format C:`, `Remove-Item C:\ -Recurse -Force`, `del /s /q C:\*`. Spelet låtsas krascha: bash ger kernel panic, svart skärm och Linux-uppstart med inloggning; PowerShell ger blåskärm med procent, Windows-uppstart och PowerShell-banderollen. Kraschen sitter kvar: ut kommer man bara genom att installera om exakt rätt (en liten uppgiftskedja i rätt skal: boota från USB, välja disk, partitionera, skapa användare) eller genom hård omladdning (Ctrl+F5) eller att rensa webbplatsdata. Vanlig F5 startar i kraschen igen. Teknik: efter omladdningen syns ingen skillnad mellan F5 och Ctrl+F5, och `localStorage` överlever båda, så Ctrl+F5 och Ctrl+Shift+R fångas i `keydown` och rensar kraschen innan webbläsaren laddar om. Shift-klick på omladdningsknappen går inte att se; rensad webbplatsdata fungerar av sig själv. Kräver en ny `localStorage`-nyckel och därmed ny version av integritetstexten. Respektera prefers-reduced-motion.
- [ ] Påskägg "gå in i en agent": `claude`, `codex`, `opencode` med flera byter prompten mot agentens (`>`). Där inne rensar bara `!ls` block; skriver man `ls` utan `!` går det som en fråga till agenten, som svarar roligt men inte hjälper (spinnerord som "Funderar…" medan blocken faller, "Du har helt rätt!", ger rätt svar i fel skal, ber om lov med y/n och rensar ett block på `y` innan "usage limit, återställs kl 03.00"). Esc avbryter tänkandet. Ut med `/exit` eller Ctrl+C två gånger, som på riktigt; hjälpkortet visar alltid vägen ut. Lärdomen: i Claude Code skickar du text till agenten, `!` kör skalet (i Git Bash). Varje skämt ska bära en sådan lärdom, annars stryks det. Patrik 2026-10-17: alla idéerna är bra, även agentläget som riktig mekanik i Som Claude Code (varannan våg kräver `!`).
- [ ] Quizet bakat in i spelet: en "bossfråga" mellan nivåerna ur `buildapp.se/ai/quiz.html` (`QUIZZES`), svar med `a`/`b`/`c`, rätt ger bonus eller en `clear`-laddning.
- [x] VS Code-ramen klickbar 2026-10-17: menyer, README-flik, utforskaren, sök med påskägg, källkontroll, PROBLEMS, OUTPUT, DEBUG CONSOLE, PORTS, fönsterknappar, zen-läge.
- [ ] Påskägg i terminalen: vim-fällan (`:q!` för att komma ut), sl, sudo-raden, Konami, en riktig kommandopalett (Ctrl+Shift+P med `>`).
- [ ] Bygg om paketet Som Claude Code från loggdatan (2026-10-17: grep, head, git, curl, uv, ls, tail, node i topp; PowerShell mest för att döda dev-servrar). Ta också med kommandon Patrik kör själv med `!` (bash-input i transkripten), t.ex. `powershell -Command "Stop-Process -Id N"`: det han gör på riktigt ska han kunna öva på.
- [ ] Patrik spelar och lyssnar: välj ljud bland `terminal-ljud.js`, `?ljud=gemini` och `?ljud=mp3` (bara lokalt, spåren i `_musik/`), radera det som väljs bort.
- [ ] Om mp3 vinner: kolla Lyrias användningsvillkor, ta in `_musik/` i git och kolla att looparna inte hackar i skarven.
- [ ] Egen integritetstext för spelet; i dag redovisas nycklarna i `buildapp.se/ai/integritet.html`.
- [ ] Paket Terminalvett: hjälp (Get-Help, Get-Command), installera (winget, npm, uv, npx/uvx), processer och portar, miljö (PATH, `$?`), nätverk (ipconfig, ping, Resolve-DnsName, Test-NetConnection), ssh-keygen, zip. Hjälpkortet får raden "begreppet bakom".
- [ ] Paket Cloudflare (wrangler login/dev/deploy/tail/secret put, d1 execute --remote, rollback) och Firebase (login, use, deploy --only hosting, emulators:start).
- [ ] Programspråk som egna paket (Python-REPL, JS-konsol, SQL).
- [ ] Delad topplista mellan vänner. Kräver backend och ny integritetstext; bara om ni faktiskt tävlar.

## Testagenternas fynd kvar (2026-10-17)

Krascher, fusk, mobil och de största PowerShell-avvikelserna är fixade (`db47b77`). Kvar, alla små:

- [ ] bash: `cd -` (förra mappen), globbar (`ls *.txt`, `rm *.log`), `wc` utan flagga ger rader, ord och tecken, flera filer till `cat`/`head`/`wc`, `tail -n +28`, `./notes.txt` ska ge "Permission denied", `ls -1/-R/-d`, `cat < f`, `echo $HOME`, `cd a b` ska ge "too many arguments", `mv a b mapp` med flera källor.
- [ ] bash: kommandon som saknas: find, grep (fritt), tree, which, less, man, nano/vim, export.
- [ ] PowerShell: `New-Item -Name` och `-Value`, `-Force` som skriver över, jokertecken, `gci`-filter (`-Name`, `-File`, `-Directory`, `-Hidden`), kommalistor (`rm a, b`), extra positionella argument ("A positional parameter cannot be found..."), `cd..` och `cd\`, `$HOME`/`$PWD`, dold mapp kräver `-Force` för att tas bort, `Rename-Item` med sökväg ska ge fel, `.\deploy.sh`, `ls -l` och `ls -a` ger 5.1:s fel.
- [ ] PowerShell: kommandon som finns men säger "not recognized": Get-Help, Write-Host, Test-Path, Get-Item, Out-File, ii, start, explorer, tree.
- [ ] Kosmetiskt: `;;` och `ls |` ger syntaxfel, pil ner återställer halvskriven rad, `Get-ChildItem`-tabellen bryts på 390 px, `s` i menyn byter skal även för den som börjar skriva `ls`.
