---
schemaVersion: 1
status: active
currentGoal: Spelet ./terminal som eget projekt på buildapp.se/terminal/
nextAction: Speltestarens fynd i BACKLOG.md (fel som lär ut fel först), sedan Som Claude Code ombyggt med Patriks !-kommandon
blockers: []
reviewedAt: 2026-10-17
---

# Handoff: ./terminal

**2026-10-17, testagenternas småfynd.** Allt i BACKLOG-avsnittet åtgärdat (`5616bec`): låtsasskalet kan globbar, variabler, find/grep/tree, nano och code öppnar redigeraren, PowerShell-parametrarna och fyra riktiga buggar (Move-Item in i mapp, New-Item -ItemType Directory gav fil, echo $PATH, ls -l i PowerShell). Små paket upprepade samma tre uppgifter på låg nivå (Patrik: ping fyra gånger); `maxLvFor` rotfix. winget står kvar i båda skalen med förklaring i bash. Verifierat: `terminal.test.js` (med mutationskoll på spärren) och Playwright i Chromium på 1280 och 390 px (meny, historik, syntaxfel, $?, which, man, nano, smala tabeller, inga JS-fel).

**2026-10-17, flytt till eget repo.** Spelet låg som `terminal.html` i `buildapp-se/ai`; nu `index.html` här, historiken kvar via `git filter-repo` (12 commits). Den gamla adressen togs bort, ingen vidarebefordran (aldrig länkad). `localStorage` delas med `/ai/` (samma ursprung), så topplista och skalval följde med. Egen dörr på `buildapp.se`. Struktur i `CONTEXT.md`.

**2026-10-17, nya paket och utskrifter.** Terminalvett och Cloudflare & Firebase, 15 uppgifter vardera (`d82d1e9`). Rätt svar utanför Filer & mappar visar nu en typisk utskrift (Patrik: rätt kommando visade inget). Debug-flikens fuskskämt larmar på riktigt (rött blink, siren, 999 999 i statusraden, sedan riktiga poängen). Små paket frös när alla uppgifter låg landade; rotfix i `draw`/`spawn` (`7fdb26d`). Verifierat: testet (146 uppgifter), `solveall.js` (varje uppgift i fem paket och båda skalen visar något), `alarmcheck.js`, `stallcheck.js` (7 paket, båda skalen, inga stopp), klick-, ägg-, quiz- och tildetesterna i scratchpad.

**2026-10-17, man och Get-Help.** Hjälpkortet går att öppna med riktiga hjälpkommandon i stället för klick: `man` i bash, `Get-Help`/`help`/`man` i PowerShell, med eller utan kommandonamn. Verifierat: `terminal.test.js` och `mancheck.js` (scratchpad) i Chromium, båda skalen, rätt block, okänt namn, bash `help` orörd.

**2026-10-17, småäggen.** vim-fällan, sl, sudo, Konami och kommandopaletten. `eggcheck.js` grönt i tre motorer.

**2026-10-17, VS Code-ramen.** Sidofält med riktiga vyer, README som flik, filer öppnas i redigeraren, dragbar panel. Klicktest `chromecheck.js` grönt i tre motorer.

**2026-10-17, quizläget.** Eget läge i menyn: tio frågor per paket ur `TASKS`, flerval åt båda hållen och para ihop, resultat och bästa per paket (`term-quiz`). Bossfrågan läser ai-quizet som förut (Patrik gillade dem); `git --help` med flera fungerar nu i PowerShell också. Spelet har egen `integritet.html`; ai:s text är version 2.8 och hänvisar hit. Verifierat i Chromium, Firefox och WebKit (`quizmode.js`) och i `terminal.test.js`.

**2026-10-17, formatera om datorn.** Påskägget byggt: krasch, ominstallation i fyra steg, ny nyckel `term-crash`, integritetstexten i ai-repot version 2.7. Verifierat i Chromium och Firefox (krasch, kvar efter F5, fel steg börjar om, ominstallation, Ctrl+F5, vanlig `rm -rf /` orörd).

**2026-10-17, bossfrågan.** Varje ny nivå ställer en fråga ur quizet på buildapp.se/ai; frågorna ligger sedan i dag i `ai/quiz-data.js`, som båda sidorna läser. Rätt svar ger en `clear`-laddning. Verifierat med `bosscheck.js` i Chromium och Firefox (nivå upp, frysta block, rätt, fel, inga upprepningar) och quizet oförändrat mot den publicerade versionen.

**2026-10-17, agentläge och paketet När agenten stannar.** `claude`, `codex`, `opencode` eller `gemini` mitt i en runda byter prompten mot agentens `>`: text går till agenten som tänker och svarar roligt utan att hjälpa, `!` kör skalet, Esc avbryter, `/exit` eller Ctrl+C två gånger går ut, och svarar man `y` på dess fråga rensas ett block innan användningsgränsen slår till. Nytt paket nummer 4, När agenten stannar: 18 uppgifter ur loggarna (logga in, pusha, merga, radera grenar, wrangler, winget, öppna filer, mellan skal) där förklaringen säger varför agenten stannade. Verifierat: testet (116 uppgifter), `agentcheck.js` och `stopcheck.js` i Chromium och Firefox, klicktestet i tre motorer.

**2026-10-17, VS Code-ramen klickbar.** Menyerna, sidofältet, flikarna, panelflikarna och fönsterknapparna gör något, alla med en lärdom: sök hittar kommandot för det du vill göra, PORTS lär ut Stop-Process, Ångra påminner om att rm saknar papperskorg. Hjälp ger 0 poäng för blocket i stället för att stänga ute rundan. Klicktest i Chromium, Firefox och WebKit (`chromecheck.js` i sessionens scratchpad): alla menyer, vyer, sök, påskägg, Esc, 0 poäng med hjälp, 390 px utan sidledsscroll.

**2026-10-17, före flytten.** Tre paket (Filer & mappar, Git & GitHub, Som Claude Code) plus Allt, 98 uppgifter, svar i bash och PowerShell 5.1, låtsasfilsystem, hjälpkort, topplista, två ljudmotorer plus lokala Lyria-spår. Tre testagenter (bash, PowerShell, en nyfiken spelare i webbläsaren) knäckte spelet samma dag; krascher, fusk, mobil och de största PowerShell-avvikelserna fixade (`db47b77`), hjälpen följer skalet (`ccf1962`), Ctrl+C kopierar markerad text (`588b547`). Resten av fynden står i `BACKLOG.md`.

## Verification

- `node terminal.test.js`: rättningen, alla svar i `TASKS` mot sig själva, låtsasskalet i båda skalen, testagenternas fynd.
- Webbläsare: Playwright i Chromium, Firefox och WebKit mot en lokal server (se `CONTEXT.md`).
