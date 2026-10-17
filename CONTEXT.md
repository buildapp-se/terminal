# Project context

## Product intent

Spelet `./terminal` på `buildapp.se/terminal/`: uppgifter faller som tetrisblock i en
kopia av VS Code:s terminal, spelaren skriver kommandot innan blocket landar. För
vibe-kodare och programmeringsstudenter som behöver terminalen men inte kan den än.
Humor och påskägg är en del av målet, men varje skämt ska bära en lärdom.

Flyttat hit från `buildapp-se/ai` 2026-10-17 med historiken kvar (`git filter-repo`);
`buildapp.se/ai/terminal.html` skickar vidare hit.

## Architecture

- `index.html` är hela spelet: HTML, CSS och JS i en fil, inget byggsteg, bara svenska.
  GitHub Pages project site under `buildapp.se/terminal/`.
- Uppgifterna ligger som data i `TASKS`
  (`[paket, svårighet 1–5, uppgift, svar, förklaring, PowerShell-svar, PowerShell-förklaring]`,
  paketen `fs`, `git`, `cc`; PowerShell-svaret `'='` betyder samma som bash, saknas det
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
- **Poäng:** landade block ger halva poängen utan kombo, block med hjälp 0, CPM räknar bara tecken i delar som
  löste något, varje felaktig del i en rad räknas som ett fel. `whoami`, `hostname`, `date`
  och `history` svarar utan att räknas som fel (`toy()`).
- **VS Code-ramen** är klickbar sedan 2026-10-17: allt har `data-do` (en rad i `DO`) eller `data-menu` (en lista i `MENUS`), en klicklyssnare för allt. Vyer öppnas som blad i terminalen (`sheet()`, läget `sheet`, samma tillbaka-logik som inställningarna). Sök (förstoringsglaset, kommandocentret, Ctrl+P/F) letar i `TASKS` på uppgift, svar och förklaring med vardagsord i `SYN` och påskägg i `EGGS`. Varje skämt ska lära något.
- **Hjälp ger 0 poäng** för blocket (`b.helped`), rundan räknas ändå (Patriks val 2026-10-17, ersätter att hela rundan stängdes ute). Sökning mitt i en runda nollar blocken som faller just då.
- **Ljud:** `terminal-ljud.js`; `?ljud=gemini` laddar `terminal-ljud-gemini.js` (samma
  gränssnitt), `?ljud=mp3` spelar Lyria-spåren i `_musik/` (bara lokalt, gitignorerat).
- **Lagring:** `localStorage` på `buildapp.se`: `term-highscores`, `term-sound`,
  `term-shell` (plus `prefs`-fälten i samma nycklar). Ursprunget är delat med `/ai/`, så data
  följde med flytten. Nycklarna redovisas i `buildapp.se/ai/integritet.html`; en ny nyckel
  kräver att den sidan uppdateras.

## Important decisions

- PowerShell 5.1, inte 7: det är vad en Windows-dator har från början. `&&` och `cd -` finns
  bara i 7, och det får hjälpkortet säga.
- Skalet låses per runda, ingen "lugn start".

## Environments and operations

`git push` till `main`, GitHub Pages bygger automatiskt. Ingen backend.
Webbläsartest: Playwright från `C:/dev/fackligastudier/node_modules/playwright` mot
`uv run --no-project python -m http.server` lokalt.
