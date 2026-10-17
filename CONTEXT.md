# Project context

## Product intent

Spelet `./terminal` på `buildapp.se/terminal/`: uppgifter faller som tetrisblock i en
kopia av VS Code:s terminal, spelaren skriver kommandot innan blocket landar. För
vibe-kodare och programmeringsstudenter som behöver terminalen men inte kan den än.
Humor och påskägg är en del av målet, men varje skämt ska bära en lärdom.

Flyttat hit från `buildapp-se/ai` 2026-10-17 med historiken kvar (`git filter-repo`);
Den gamla adressen `buildapp.se/ai/terminal.html` togs bort, ingen vidarebefordran: spelet var aldrig länkat.

## Architecture

- `index.html` är hela spelet: HTML, CSS och JS i en fil, inget byggsteg, bara svenska.
  GitHub Pages project site under `buildapp.se/terminal/`.
- Uppgifterna ligger som data i `TASKS`
  (`[paket, svårighet 1–5, uppgift, svar, förklaring, PowerShell-svar, PowerShell-förklaring]`,
  paketen `fs`, `git`, `cc` och `stop` (När agenten stannar: kommandon som agenter ber dig köra själv, förklaringen börjar med varför agenten stannade); PowerShell-svaret `'='` betyder samma som bash, saknas det
  visas uppgiften bara i bash), med mallord som `{d}` och `{f2}` ur `POOLS`. Ett svar kan
  vara en lista med varianter, en kedja (lista av listor, ett steg per kommando) och
  innehålla jokern `{any}`.
- Rättningen normaliserar i stället för att jämföra strängar: flaggordning, ihopslagna
  flaggor (`-rn`), citattecken, `./` och avslutande `/` spelar ingen roll, men ordet i ett
  argument måste stämma. `;`, `&&` (bara bash) och flera argument till
  `mkdir`/`touch`/`rm` rensar flera block (kombo). I bash kortsluter `&&` och `||` som på
  riktigt; i PowerShell 5.1 är de parsefel.
- Den rena logiken står mellan `pure:start` och `pure:end` och testas av
  `terminal.test.js` (`node terminal.test.js`), som också kör varje svar i `TASKS` mot sig
  självt och kräver en förklaring i `GLOSS` för varje del av varje svar (hjälpkortet).
  `stallcheck.js` (lokal server på 8766, Playwright ur fackligastudier) leker med slumpade kommandon
  i alla paket och skal och larmar om blocken slutar komma. Fångade 2026-10-17 att `spawn` fastnade i
  hemmappen när de nyss använda uppgifterna var de enda som gick där; sista fasen tar nu alla uppgifter.
  Tabellerna som slås upp med spelarens text saknar prototyp (`Object.setPrototypeOf(o, null)`),
  annars kraschar `toString` och `constructor`.
- **Skal:** väljs vid första besöket (förval PowerShell på Windows), byts med `s` i menyn
  och under inställningar (kugghjulet eller Ctrl+,), låst under en runda (`S.ps`). Spelet
  härmar Windows PowerShell 5.1, eftersom det är den som finns på Patriks dator. PowerShell
  rättas med alias (`PSALIAS`), skiftlägesokänsligt, förkortade och positionella parametrar
  (`PSPARAMS`, `PSPOS`; filsystemets dynamiska parametrar förlorar mot de vanliga) och ger
  PowerShells egna felmeddelanden. Hjälpkortet visar svaret i ditt skal (`PS>` eller `$`)
  och det andra skalets svar under.
- **Låtsasfilsystem:** `WORLD` (hemmappen med `projekt/`, rundan börjar där) körs av
  `fake()`, som tar rättningens kanoniska form och därför tjänar båda skalen. Fria kommandon
  och block i Filer & mappar körs mot det; prompten följer mappen. Filer & mappar släpper ett
  block i taget: ny mapp ger först "lista", sedan "kör programmet" om det finns ett, sedan
  "gå in". Mallorden dras ur filsystemet (dolda namn aldrig) och varje uppgift provkörs på en
  kopia (`doable`). I PowerShell är bara `.git` och `.hemligt` dolda.
- **Utskrifter (`OUT`, `sample`):** block utanför Filer & mappar skriver en kort, typisk utskrift när
  de löses (git, gh, npm, curl, ping, wrangler, firebase med flera), i verktygets riktiga form med
  påhittade värden. Nyckeln är kommandots början, den längsta vinner; tysta kommandon får raden att
  tystnad betyder att det gick bra. Nytt kommando i `TASKS`: lägg en rad i `OUT`, annars visas inget.
- **Små paket:** `draw` släpper inga dubbletter av block som redan ligger i brunnen, utom som sista
  utväg i `spawn` när alla uppgifter redan ligger där (annars frös rundan i paket med 15 uppgifter).
- **Poäng:** landade block ger halva poängen utan kombo, block med hjälp 0, CPM räknar bara tecken i delar som
  löste något, varje felaktig del i en rad räknas som ett fel. `whoami`, `hostname`, `date`
  och `history` svarar utan att räknas som fel (`toy()`).
- **VS Code-ramen** är klickbar sedan 2026-10-17: allt har `data-do` (en rad i `DO`) eller `data-menu` (en lista i `MENUS`), en klicklyssnare för allt. Aktivitetsfältets vyer (utforskaren, sök, källkontroll, kör, tillägg) öppnas i ett sidofält som i VS Code (`VIEWS`, `openSide`; klick på aktiv ikon stänger). Utforskaren visar låtsasfilsystemet som träd, en fil öppnas som förhandsflik i redigeraren; källkontrollen visar U/M/D mot `WORLD` (`changes`). README.md är en flik i redigeraren. Draglisten (`#sash`) mellan redigeraren och panelen ändrar höjden, även med pil upp och ner; `resized()` mäter om brunnen. Panelflikarna (problems, output, debug, ports) och smala skärmar använder fortfarande blad i terminalen (`sheet()`). Sök (förstoringsglaset, kommandocentret, Ctrl+P/F) letar i `TASKS` på uppgift, svar och förklaring med vardagsord i `SYN` och påskägg i `EGGS`. Varje skämt ska lära något.
- **Hjälpkortet** öppnas med klick på blocket eller med ett riktigt hjälpkommando (sedan 2026-10-17, Patriks idé): `man` i bash, `Get-Help`/`help`/`man` i PowerShell. Utan namn blocket närmast botten (samma ordning som `target()`), med namn blocket vars svar börjar med kommandot, okänt namn ger skalets riktiga fel. Bash `help` är spelets egen hjälptext.
- **Hjälp ger 0 poäng** för blocket (`b.helped`), rundan räknas ändå (Patriks val 2026-10-17, ersätter att hela rundan stängdes ute). Sökning mitt i en runda nollar blocken som faller just då.
- **Quizläget** (sedan 2026-10-17, Patriks idé: ai-quizet var för enkelt som bossfråga): väljs under `# läge` i menyn (`m` byter, `prefs.kind`). Tio frågor per paket ur `TASKS` (`makeQuiz` i den rena delen): åtta flerval åt båda hållen (`vilket`: uppgiften, välj kommandot; `vad`: kommandot, välj uppgiften) och två omgångar para ihop fyra (siffra väljer kommando, bokstav beskrivning; rätt på första försöket ger poäng). Felsvaren tas helst från samma kommando (`ls -a` mot `ls -l`) och aldrig från en uppgift vars svar också godkänns (`clash`: samma svar, en kedja som innehåller svaret, cmdlets som bara skiljer sig i växlar, eller samma grupp i `NEAR`, uppgifter där det ena kommandot också löser den andra). Felsvaren rangordnas efter likhet (samma kommando, samma ifyllda ord, kedja mot kedja), så att ett namn inte avslöjar svaret. Mallorden är desamma i hela quizet, så att rätt svar inte avslöjas av ett namn. Resultatskärmen visar antal rätt och vilka du ska öva på; bästa resultatet per paket och skal sparas i `term-quiz` och syns i menyn. `--help` och `git help` svarar i båda skalen (`helpText`, riktiga `git --help`); cmdlets i PowerShell får sitt fel plus tips om `Get-Help`. Quizläget testat i `terminal.test.js` (alla paket och skal ger tio frågor utan krockar) och `quizmode.js` i scratchpad.
- **Bossfrågan:** varje ny nivå ställer en fråga ur quizet på buildapp.se/ai, `<script src="/ai/quiz-data.js">` (ai-repot, samma fil som `quiz.html` läser; Patrik gillade dem, 2026-10-17). Flerval tas som de är, para ihop blir "vilken beskrivning passar X" med två felsvar ur samma omgång. Saknas filen (lokalt utan `/ai/`) blir det en `vad`-fråga ur rundans paket. Lokalt test: `bosscheck.js` skickar `/ai/quiz-data.js` till ai-repots fil. Rätt svar ger en `clear`-laddning (max 3), fel kostar inget och visar förklaringen. Läget `boss` fryser blocken; blad, sök och inställningar är spärrade under bossfrågan och quizet.
- **Ljud:** `terminal-ljud.js`; `?ljud=gemini` laddar `terminal-ljud-gemini.js` (samma
  gränssnitt), `?ljud=mp3` spelar Lyria-spåren i `_musik/` (bara lokalt, gitignorerat).
- **Små påskägg (`egg`, `enterVim`, `train`, `KONAMI`, `palette`):** `vim`/`vi` i bash låser allt du skriver i vim tills `:q!`, `:wq` med flera (blocken faller under tiden; tips var tredje försök, Ctrl+C ger vims riktiga svar). `sl` kör ett tåg över brunnen och låser prompten i 3 sekunder. `sudo su`/`-i`/`-s` ger sudoers-raden, `sudo make me a sandwich` xkcd 149; `sudo` i PowerShell ger Windows 11:s riktiga "Sudo is disabled" (avläst på Patriks dator). Konami-koden växlar en grön CRT-skärm (`html.crt`), sparas inte. Ctrl+Shift+P, eller `>` i sökrutan, listar menyernas kommandon som en palett. Help, Svåra tecken (`DO.chars`) visar var ~, |, \, $ med flera sitter på svenskt tangentbord i Windows och Mac (Patrik hittade inte ~ 2026-10-17); hjälpkortet för ~ säger AltGr + ¨. Test `eggcheck.js` i scratchpad.
- **Påskägget formatera om datorn:** `WIPE` fångar `rm -rf / --no-preserve-root`, `rm -rf /*`, `dd ... of=/dev/sd`, `mkfs`, `format C:`, `Remove-Item C:\ -Recurse`, `del /s /q C:\`. Vanlig `rm -rf /` ger fortfarande GNU:s spärr. bash ger kernel panic, PowerShell blåskärm med procent; sedan en svart skärm där man installerar om i fyra steg (`SETUP`), fel steg börjar om. Steget sparas i `term-crash`, så vanlig F5 startar i kraschen igen. Ctrl+F5 och Ctrl+Shift+R fångas i `keydown` och rensar nyckeln innan omladdningen (efteråt syns ingen skillnad mot F5); Shift-klick på omladdningsknappen går inte att se, rensad webbplatsdata fungerar alltid. Reducerad rörelse hoppar över procenträkningen. Test: `crashcheck.js`, `wipecheck.js` i scratchpad.
- **Lagring:** `localStorage` på `buildapp.se`: `term-highscores`, `term-sound`,
  `term-shell`, `term-crash`, `term-quiz`. Ursprunget är delat med `/ai/`, så data
  följde med flytten. Nycklarna redovisas i spelets egen `integritet.html` (sedan 2026-10-17,
  tidigare i `buildapp.se/ai/integritet.html`); en ny nyckel kräver att den sidan uppdateras.

## Important decisions

- PowerShell 5.1, inte 7: det är vad en Windows-dator har från början. `&&` och `cd -` finns
  bara i 7, och det får hjälpkortet säga.
- Skalet låses per runda, ingen "lugn start".

## Environments and operations

`git push` till `main`, GitHub Pages bygger automatiskt. Ingen backend.
Webbläsartest: Playwright från `C:/dev/fackligastudier/node_modules/playwright` mot
`uv run --no-project python -m http.server` lokalt.
