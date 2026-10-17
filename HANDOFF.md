---
schemaVersion: 1
status: active
currentGoal: Spelet ./terminal som eget projekt på buildapp.se/terminal/
nextAction: Påskägget formatera om datorn, sedan testagenternas småfynd, enligt BACKLOG.md
blockers: []
reviewedAt: 2026-10-17
---

# Handoff: ./terminal

**2026-10-17, flytt till eget repo.** Spelet låg som `terminal.html` i `buildapp-se/ai`; nu `index.html` här, historiken kvar via `git filter-repo` (12 commits). Den gamla adressen togs bort, ingen vidarebefordran (aldrig länkad). `localStorage` delas med `/ai/` (samma ursprung), så topplista och skalval följde med. Egen dörr på `buildapp.se`. Struktur i `CONTEXT.md`.

**2026-10-17, bossfrågan.** Varje ny nivå ställer en fråga ur quizet på buildapp.se/ai; frågorna ligger sedan i dag i `ai/quiz-data.js`, som båda sidorna läser. Rätt svar ger en `clear`-laddning. Verifierat med `bosscheck.js` i Chromium och Firefox (nivå upp, frysta block, rätt, fel, inga upprepningar) och quizet oförändrat mot den publicerade versionen.

**2026-10-17, agentläge och paketet När agenten stannar.** `claude`, `codex`, `opencode` eller `gemini` mitt i en runda byter prompten mot agentens `>`: text går till agenten som tänker och svarar roligt utan att hjälpa, `!` kör skalet, Esc avbryter, `/exit` eller Ctrl+C två gånger går ut, och svarar man `y` på dess fråga rensas ett block innan användningsgränsen slår till. Nytt paket nummer 4, När agenten stannar: 18 uppgifter ur loggarna (logga in, pusha, merga, radera grenar, wrangler, winget, öppna filer, mellan skal) där förklaringen säger varför agenten stannade. Verifierat: testet (116 uppgifter), `agentcheck.js` och `stopcheck.js` i Chromium och Firefox, klicktestet i tre motorer.

**2026-10-17, VS Code-ramen klickbar.** Menyerna, sidofältet, flikarna, panelflikarna och fönsterknapparna gör något, alla med en lärdom: sök hittar kommandot för det du vill göra, PORTS lär ut Stop-Process, Ångra påminner om att rm saknar papperskorg. Hjälp ger 0 poäng för blocket i stället för att stänga ute rundan. Klicktest i Chromium, Firefox och WebKit (`chromecheck.js` i sessionens scratchpad): alla menyer, vyer, sök, påskägg, Esc, 0 poäng med hjälp, 390 px utan sidledsscroll.

**2026-10-17, före flytten.** Tre paket (Filer & mappar, Git & GitHub, Som Claude Code) plus Allt, 98 uppgifter, svar i bash och PowerShell 5.1, låtsasfilsystem, hjälpkort, topplista, två ljudmotorer plus lokala Lyria-spår. Tre testagenter (bash, PowerShell, en nyfiken spelare i webbläsaren) knäckte spelet samma dag; krascher, fusk, mobil och de största PowerShell-avvikelserna fixade (`db47b77`), hjälpen följer skalet (`ccf1962`), Ctrl+C kopierar markerad text (`588b547`). Resten av fynden står i `BACKLOG.md`.

## Verification

- `node terminal.test.js`: rättningen, alla svar i `TASKS` mot sig själva, låtsasskalet i båda skalen, testagenternas fynd.
- Webbläsare: Playwright i Chromium, Firefox och WebKit mot en lokal server (se `CONTEXT.md`).
