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
  paketen `fs`, `git`, `cc` (Vad Claude gör: det Claude kör själv) och `stop` (Vibe-kodaren: kommandon som agenter ber dig köra själv, förklaringen börjar med varför agenten stannade); PowerShell-svaret `'='` betyder samma som bash, saknas det
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
  Sedan 2026-10-17 (testagenternas fynd) kan `fake` det vanligaste i båda skalen: globbar och PowerShells
  kommalistor (ett kommando per mål via `each`), `>`/`>>` för alla kommandon, variabler (`ENV0` plus `S.env`:
  `export`, `X=v`, `$env:X = v`, `$?` sätts per kommando i `run`), find, grep, tree, less, test-path, get-item.
  Resultatet kan bära `note`, som visas i stället för tystnad (inga träffar). Det `fake` svarar vinner över `OUT`.
  PowerShell-tabeller tappar kolumner när `COLS` (mäts i `resized()`) är under 64. `syntax()` ger bash- och
  PowerShell-felen för `;;` och tom pipe. `toy` svarar på which/type/Get-Command, `editorCmd` öppnar nano/code/notepad
  i redigeraren. Test i `terminal.test.js`.
- **Utskrifter (`OUT`, `sample`):** block utanför Filer & mappar skriver en kort, typisk utskrift när
  de löses (git, gh, npm, curl, ping, wrangler, firebase med flera), i verktygets riktiga form med
  påhittade värden. Nyckeln är kommandots början, den längsta vinner; tysta kommandon får raden att
  tystnad betyder att det gick bra, även i Filer & mappar. Nytt kommando i `TASKS`: lägg en rad i `OUT`,
  annars visas inget (`altcheck.js` i scratchpad hittar sådana). Rör i Filer & mappar körs av `piped`:
  första kommandot mot filsystemet, sedan head/tail/sort/wc eller Select-Object/Measure-Object på raderna.
- **Världen (`S`) ändras av allt man skriver**, block eller inte, i spelet och i quizet (2026-10-17, Patriks krav):
  `fake` kör filsystemet för varje kommando (fel räknas bara för fria kommandon och Filer & mappar),
  `gitWorld` gör clone (ny mapp), init, commit, grenar (`S.branch`, `S.branches`, startar med `POOLS.b`)
  och restore. `S.commits` börjar med `SEEDLOG`. `git status`, `log` och `branch` i `OUT` läser `S`.
  `render()` ritar om prompten, statusradens gren (`#branch`), utforskaren (fälls ut till mappen du står i),
  källkontrollen och öppen fil efter varje kommando. Fria kommandon som inte löser block är fortfarande fel i spelet,
  men händer ändå. Quizet (`fresh()` + `quiz()`) har en levande terminal: bokstav (eller siffra + bokstav vid
  para ihop) och Enter svarar, tomt Enter går vidare, allt annat körs. Test `worldcheck.js` i scratchpad.
- **Redigeraren går att skriva i** (Patriks krav 2026-10-17): klick i koden byter till en `textarea` (`editing`), fliken får en prick när något ändrats,
  Ctrl+S sparar (`saveEdit`), Esc slutar utan att spara, flikbyte släpper osparat. Filer sparas i `S.fs` (Changes visar M, `cat` ser det),
  README i sessionen (`let README`). stats.json skrivs av spelet: ändrad `score` eller `best` sparad ger fusklarmet (`alarm()`, samma som
  Debug Console, rör aldrig `S.score`), annan ändring sparas inte och är inget fusk. Test `editcheck.js` i scratchpad.
- **Debug Console är ett fält** (2026-10-17, förr larmade fliken direkt och Patrik förstod inte varför): `S.score`, `best` eller `S` visar värden,
  `S.score = ...` eller `best = ...` som man skriver själv ger fusklarmet med den inskrivna siffran, okänt ger `ReferenceError`. Test `alarmcheck.js`.
- **Svårighet per skal:** `t[1]` får vara `[bash, PowerShell]` (läses via `lvOf`) när PowerShell-svaret är en pipe där bash har ett kort kommando.
  Sökning i alla filer är `[1, 3]`: Patrik tyckte `Get-ChildItem -Recurse | Select-String TODO` var svårt på nivå 1 (2026-10-17). Test `lvcheck.js`.
- **Hello world** (Patriks krav 2026-10-17): två kedjeblock i Filer & mappar (svårighet 2), JavaScript och Python: skapa filen, skriv koden, kör.
  `node`/`python`/`bash` på en fil som inte finns i `PROGS` kör det som står i filen (`runFile`: bara utskriftsrader, console.log, print, echo,
  Write-Output), så egna ändringar i redigeraren syns när man kör. PowerShell rättas i gemener, men låtsasskalet får originaltexten
  (`canon(u, ps, keep)`), annars blev det hello world i filen. Test `hellocheck.js` (trädet, redigeraren, utskriften, löst block, egen text).
- **Bit, terminaldjuret** (Patriks idé 2026-10-17): nere till höger i terminalen. Äter en bit per löst steg (hjälp ger ingen mat, som inga poäng),
  quizet matar också. Växer vid tvåpotenserna 1, 2, 4 ... 1 024 (`PET_STAGES`, `petStage`); varje stadium lär ut något om bitar.
  Räknaren syns binärt i hela nibbles med inledande nollor (`binStr`, Patrik: 0000, 0001, 0010), klick förklarar platsvärdena (`binParts`).
  Humör i `petSVG`: sover i menyn, rädd när högen når övre tredjedelen och vid `PET_FEAR` (rm -rf, sudo, push --force, reset --hard),
  ledsen vid fel, knuff mot hjälpkortet efter tre fel i rad. Blicken följer lägsta fallande block. Pratar sparsamt (minst 30 s mellan tips).
  Sparas i `term-pet` (integritetstexten 1.1). Test: `terminal.test.js` för de rena delarna.
- **Tab** (`complete`): bash fyller i det entydiga och listar vid andra Tab, PowerShell bläddrar. Dolda namn bara efter punkt.
- **Versionsfrågor** (`VERS` i `toy`): `git --version`, `node -v`, `python -V` med flera är aldrig fel. `python -v` är verbose, inte version.
- **Små paket:** `draw` släpper inga dubbletter av block som redan ligger i brunnen, utom som sista
  utväg i `spawn` när alla uppgifter redan ligger där (annars frös rundan i paket med 15 uppgifter).
  Svårighetsspärren är halva nivån men höjs tills minst 8 uppgifter passar (`maxLvFor`): Terminalvett har tre
  lätta, och Patrik fick ping och ipconfig fyra gånger var (2026-10-17).
- **Poäng:** landade block ger halva poängen utan kombo, block med hjälp 0, CPM räknar bara tecken i delar som
  löste något, varje felaktig del i en rad räknas som ett fel. `whoami`, `hostname`, `date`
  och `history` svarar utan att räknas som fel (`toy()`).
- **VS Code-ramen** är klickbar sedan 2026-10-17: allt har `data-do` (en rad i `DO`) eller `data-menu` (en lista i `MENUS`), en klicklyssnare för allt. Aktivitetsfältets vyer (utforskaren, sök, källkontroll, kör, tillägg) öppnas i ett sidofält som i VS Code (`VIEWS`, `openSide`; klick på aktiv ikon stänger). Utforskaren visar låtsasfilsystemet som träd, en fil öppnas som förhandsflik i redigeraren; källkontrollen visar U/M/D mot senaste commit (`S.base`, annars `WORLD`; `changes`) och rundans commits som Graph (`S.commits`, `commit()`; varje löst `git commit`, `--amend` byter senaste meddelandet). Meddelanderutan plus Enter eller Commit-knappen kör `git commit -m "…"` genom `run()` (`sideCommit`, Patriks idé 2026-10-17), så rätt meddelande löser blocket och fel räknas som fel. Test `scmcheck.js` i scratchpad. README.md är en flik i redigeraren. Draglisten (`#sash`) mellan redigeraren och panelen ändrar höjden, även med pil upp och ner; `resized()` mäter om brunnen. Panelflikarna (problems, output, debug, ports) och smala skärmar använder fortfarande blad i terminalen (`sheet()`). Sök (förstoringsglaset, kommandocentret, Ctrl+P/F) letar i `TASKS` på uppgift, svar och förklaring med vardagsord i `SYN` och påskägg i `EGGS`. Varje skämt ska lära något.
- **Hjälpkortet** öppnas med klick på blocket eller med ett riktigt hjälpkommando (sedan 2026-10-17, Patriks idé): `man` i bash, `Get-Help`/`help`/`man` i PowerShell. Utan namn blocket närmast botten (samma ordning som `target()`), med namn blocket vars svar börjar med kommandot, okänt namn ger skalets riktiga fel. Bash `help` är spelets egen hjälptext.
- **Hjälp ger 0 poäng** för blocket (`b.helped`), rundan räknas ändå (Patriks val 2026-10-17, ersätter att hela rundan stängdes ute). Sökning mitt i en runda nollar blocken som faller just då.
- **Quizläget** (sedan 2026-10-17, Patriks idé: ai-quizet var för enkelt som bossfråga): väljs under `# läge` i menyn (`m` byter, `prefs.kind`). Tio frågor per paket ur `TASKS` (`makeQuiz` i den rena delen): åtta flerval åt båda hållen (`vilket`: uppgiften, välj kommandot; `vad`: kommandot, välj uppgiften) och två omgångar para ihop fyra (siffra väljer kommando, bokstav beskrivning; rätt på första försöket ger poäng). Felsvaren tas helst från samma kommando (`ls -a` mot `ls -l`) och aldrig från en uppgift vars svar också godkänns (`clash`: samma svar, en kedja som innehåller svaret, cmdlets som bara skiljer sig i växlar, eller samma grupp i `NEAR`, uppgifter där det ena kommandot också löser den andra). Felsvaren rangordnas efter likhet (samma kommando, samma ifyllda ord, kedja mot kedja), så att ett namn inte avslöjar svaret. Mallorden är desamma i hela quizet, så att rätt svar inte avslöjas av ett namn. Resultatskärmen visar antal rätt och vilka du ska öva på; bästa resultatet per paket och skal sparas i `term-quiz` och syns i menyn. `--help` och `git help` svarar i båda skalen (`helpText`, riktiga `git --help`); cmdlets i PowerShell får sitt fel plus tips om `Get-Help`. Quizläget testat i `terminal.test.js` (alla paket och skal ger tio frågor utan krockar) och `quizmode.js` i scratchpad.
- **Bossfrågan:** varje ny nivå ställer en fråga ur quizet på buildapp.se/ai, `<script src="/ai/quiz-data.js">` (ai-repot, samma fil som `quiz.html` läser; Patrik gillade dem, 2026-10-17). Flerval tas som de är, para ihop blir "vilken beskrivning passar X" med två felsvar ur samma omgång. Saknas filen (lokalt utan `/ai/`) blir det en `vad`-fråga ur rundans paket. Lokalt test: `bosscheck.js` skickar `/ai/quiz-data.js` till ai-repots fil. Rätt svar ger en `clear`-laddning (max 3), fel kostar inget och visar förklaringen. Läget `boss` fryser blocken; blad, sök och inställningar är spärrade under bossfrågan och quizet.
- **Ljud:** `terminal-ljud.js`; `?ljud=gemini` laddar `terminal-ljud-gemini.js` (samma
  gränssnitt), `?ljud=mp3` spelar Lyria-spåren i `_musik/` (bara lokalt, gitignorerat).
- **Små påskägg (`egg`, `enterVim`, `train`, `KONAMI`, `palette`):** `vim`/`vi` i bash låser allt du skriver i vim tills `:q!`, `:wq` med flera (blocken faller under tiden; tips var tredje försök, Ctrl+C ger vims riktiga svar). `sl` kör ett tåg över brunnen och låser prompten i 3 sekunder. `sudo su`/`-i`/`-s` ger sudoers-raden, `sudo make me a sandwich` xkcd 149; `sudo` i PowerShell ger Windows 11:s riktiga "Sudo is disabled" (avläst på Patriks dator). Konami-koden växlar en grön CRT-skärm (`html.crt`), sparas inte. Ctrl+Shift+P, eller `>` i sökrutan, listar menyernas kommandon som en palett. Help, Svåra tecken (`DO.chars`) visar var ~, |, \, $ med flera sitter på svenskt tangentbord i Windows och Mac (Patrik hittade inte ~ 2026-10-17); hjälpkortet för ~ säger AltGr + ¨. Test `eggcheck.js` i scratchpad.
- **Påskägget formatera om datorn:** `WIPE` fångar `rm -rf / --no-preserve-root`, `rm -rf /*`, `dd ... of=/dev/sd`, `mkfs`, `format C:`, `Format-Volume` och `Clear-Disk` (direkt, utan fråga, med flit: Patrik 2026-10-17, sådant ska aldrig köras på chans), `Remove-Item C:\ -Recurse`, `del /s /q C:\`. Vanlig `rm -rf /` ger fortfarande GNU:s spärr. bash ger kernel panic, PowerShell blåskärm med procent; sedan en svart skärm där man installerar om i fyra steg (`SETUP`), fel steg börjar om. Steget sparas i `term-crash`, så vanlig F5 startar i kraschen igen. Ctrl+F5 och Ctrl+Shift+R fångas i `keydown` och rensar nyckeln innan omladdningen (efteråt syns ingen skillnad mot F5); Shift-klick på omladdningsknappen går inte att se, rensad webbplatsdata fungerar alltid. Reducerad rörelse hoppar över procenträkningen. Test: `crashcheck.js`, `wipecheck.js` i scratchpad.
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
