---
schemaVersion: 1
status: active
currentGoal: Spelet ./terminal som eget projekt på buildapp.se/terminal/
nextAction: underhåll (PS-tabellerna samlade, OUT/sample/gitWorld/changes/petTip in i pure och testade), sedan restlistan i BACKLOG
blockers: []
reviewedAt: 2026-10-28
---

# Handoff: ./terminal

**2026-10-28, granskningens a11y- och UX-fynd fixade.** Kontrast, `#pet`-namnet, klickytor (44 px under 700 px), `<main>` och rubriklösa sektioner; på köpet `aria-valuenow` på draglisten, dold förhandsflik som visades tom, skalvalet 24 px på dator och lekytans lampor. axe 0 överträdelser lokalt på 390 och 1280 px (även best-practice), Fitts 0 under 44 px på 390 px. Kvar i BACKLOG: renderblockerande typsnitt och gmail i historiken.

**2026-10-28, Audits-kolumnerna ifyllda.** Secrets, Actions, UX och WCAG med aifabrikens `audit-run.mjs`; OG image, Markup (W3C nu, länkar med GET), Lighthouse (Chrome DevTools MCP, mobil, plus prestandaspår), Git history och Search Console (gsc MCP) för hand; TLS via SSL Labs-API:t. Mutation hoppades över: ingen package.json eller Stryker-uppsättning, inte snabbt. Fynd i BACKLOG under "Granskning 2026-10-28" (kontrast, `#pet`-etikett, klickytor, main-landmärke, gmail i historiken). Inga kodändringar.

**2026-10-18, licens.** GPL-3.0 (`LICENSE`, texten från GitHubs licens-API) och en `README.md` för den publika repo-sidan, på Patriks begäran.

**2026-10-17 kväll, efter Patriks speltest.** dcg 0.15.3: `DANGER` följer nya regelnamn (PowerShell-raderna `core.filesystem:powershell-remove-item-recursive`, `branch -d` `core.git:branch-delete`), `dcg-check` överens om 1 006 rader. Kugghjulet ritat med kuggar (såg ut som en sol), ljudvalen på en rad. `land()` räknar om blockets höjd, annars hamnade svaret under kanten. Hjälpkortet och inställningarna säger hur de öppnas. Kedjor: `STEPTEXT` + `chainParts` ger ett block per steg efter varandra (nästa släpps när steget före är löst, så a && b && c på en rad löser alla), samlat block med "steg x av y" och långsammare fall från nivå svårighet + 2. OG-bild `og.png` med taggar, genereras med `tools/og.cjs`. `node app.js` som Patrik fick fel på gick inte att återskapa: blocket med app.js ger rätt. Verifierat: `terminal.test.js`, hela Playwright-sviten, `landed.js`, `split-game.js`, `combo-game.js` i scratchpad.

**2026-10-17, andra agentomgången (prioritet 3).** E: `DANGER`-tabellen ersätter `PET_FEAR`, Bit säger "Här hade dcg stoppat Claude: … Säkrare: …", ⚠ på farliga block, `tools/dcg-check.mjs` mot riktiga dcg. F: Vad Claude gör ombyggt ur 2 520 Claude Code-loggar (23 uppgifter, inga hemligheter in i spelet, kontrollerat med sökning i diffen). G: klickbara lampor, port 3000 ledig efter kill (`nodeGone`, flaggan i `S.env['?killed']`), piratlapp, riktig `git diff` (`udiff`). Krockar F/G i `OUT` lösta för hand (F:s ps | grep, get-ciminstance, netstat följer `nodeGone`), E/test-importraden ihopslagen. Verifierat: `terminal.test.js`, hela Playwright-sviten, agenternas egna skript mot main, `gone.js` (node borta i båda skalen), dcg-check.

**2026-10-17, prioritetslistan med fyra agenter.** Patrik bad om en priolista och att dela ut jobbet. Brain: ljudmotor i inställningarna (`?ljud=`), fria giltiga kommandon visar utskrift men räknas som fel (mellanläge, låst beslut kvar), högst nivå + 1 fallande block och `maxLvFor` 7 (låst beslut omprövat, Patrik ja), Bit varnar när ett fritt kommando gör ett block olösbart, `explain` säger när bara något saknas, färre Lista filerna, paketen i svårighetsordning. Agenter i egna worktrees, sammanslagna efter granskning: A likvärdiga former i rättningen, B git-världen som riktig git plus staging/stash/reset, C låtsasskalet (PS-uttryck, Windows-program, bash), D mobil och småfel. Två testkonflikter (båda sidor behölls). Verifierat efter varje sammanslagning: `terminal.test.js`, alla Playwright-skript i sessionens scratchpad samt B:s och C:s egna kontroller mot main. Worktrees ligger kvar i `.claude/worktrees/` (ignorerat).

**2026-10-17, Bit i panelen och Antigravitys granskning.** Bit bor i ett sidofält till höger från 1 000 px (`9bce473`), med lampor, mätare och etiketterad logg; mobilen har kvar hörnet. Antigravity (gemini-4-argon-high, plan-läge i sandlåda, 14 min) granskade `4caaf67`; rapporten kontrollerades mot koden, ett påstående var fel (`-Conmanmad` godkändes inte). Åtgärdat: rättningen (`powershell -c`, `\` i sökvägar efter program i PowerShell, långa flaggor med värde, `-D` på flera grenar, `-m "- text"`), låtsasskalet (`Select-String | Measure-Object` räknade luftraderna, `ii`/`start` gav "cmdlet undefined", `> fil` efter en pipe, `Measure-Object -Line` hoppar över tomma rader, `git commit -am` visade inte meddelandet, `$?` efter syntaxfel), dubbel-Tab i PowerShell kraschade, landade kedjeblock visade fel steg, brunnen kunde krympa till noll (game over) när redigeraren drogs ner, fokusfällor, README dold för skärmläsare, Bit hoppade över stadier och föreslog ogiltiga flaggor, nollornas kontrast. Resten i BACKLOG. Verifierat: `terminal.test.js` med nya regressionstester, Playwright (`fixes.js`, `petgame.js`, `browser.js`).

**2026-10-17, Bit och Tab.** Terminaldjuret Bit (Patriks idé, binärräkningen och 0000-formen hans), Tab-komplettering och fyra fel som lärde ut fel (`4caaf67`). Speltestaren (en subagent) hittade inga krascher; resten av fynden i BACKLOG. En Antigravity-granskning av hela projektet kördes på `4caaf67` (`review-lane.mjs`, kopia av aifabrikens `tools/owasp-lane.mjs`). Verifierat: `terminal.test.js` (nu även att hela skriptet går att tolka, efter ett syntaxfel som bara webbläsaren såg), Playwright 1280 och 390 px (kläckning, binärräknare, sparning, Tab, rädsla, klapp, blicken, inga JS-fel).

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

## 2026-10-26: OWASP

OWASP-granskning (Gemini 3.8 Flash, granskad av Claude): highscores, quizresultat och husdjurets bits ur localStorage escapas eller tvingas till heltal innan de hamnar i innerHTML (`39dba14`), provat i Chromium med förgiftad localStorage.

## Verification

- `node terminal.test.js`: rättningen, alla svar i `TASKS` mot sig själva, låtsasskalet i båda skalen, testagenternas fynd.
- Webbläsare: Playwright i Chromium, Firefox och WebKit mot en lokal server (se `CONTEXT.md`).
