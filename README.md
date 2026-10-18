# ./terminal

Kommandon faller som tetrisblock, skriv rätt innan de landar.

Ett gratis webbläsarspel som lär ut bash, PowerShell och git i en låtsas-VS Code. Varje block är en uppgift på svenska ("Skapa grenen dark-mode och byt till den") och du löser den genom att skriva det riktiga kommandot innan blocket når botten.

**Spela:** https://buildapp.se/terminal/

## Vad som finns

- 139 uppgifter i fyra paket: Filer & mappar, Git & GitHub, Som Claude Code och När agenten stannar, plus Allt.
- bash eller PowerShell, med ett låtsasfilsystem där `ls`, `cd`, `cat`, `mkdir` och `git status` fungerar.
- Bit, terminaldjuret i sidopanelen, som växer i tvåpotenser, lär ut bitar och varnar för farliga kommandon.
- Kedjor, kombos med `&&`, agentläge (`claude`), quizläge och fri lek i menyn.
- Inget konto, inget att installera. Bara inställningar och topplista sparas, lokalt i webbläsaren.

## Köra lokalt

Ren HTML, CSS och JavaScript utan ramverk eller byggsteg. Öppna `index.html` i en webbläsare.

Test: `node terminal.test.js` kontrollerar varje uppgift och varje godkänt svar.

## Byggt med

Claude Code (Claude Opus 5.5). Antigravity (Gemini) granskade koden och skrev den alternativa ljudmotorn i `terminal-ljud-gemini.js`.

## Licens

GNU General Public License v3.0, se [LICENSE](LICENSE). Du får använda, ändra och sprida koden, men ändrade versioner som sprids måste också vara öppna under GPL-3.0.
