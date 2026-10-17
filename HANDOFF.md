---
schemaVersion: 1
status: active
currentGoal: Spelet ./terminal som eget projekt på buildapp.se/terminal/
nextAction: Bygg VS Code-ramen klickbar (menyer, sök med humor, flikar) och påskägget "gå in i en agent", enligt BACKLOG.md
blockers: []
reviewedAt: 2026-10-17
---

# Handoff: ./terminal

**2026-10-17, flytt till eget repo.** Spelet låg som `terminal.html` i `buildapp-se/ai`; nu `index.html` här, historiken kvar via `git filter-repo` (12 commits). `buildapp.se/ai/terminal.html` skickar vidare hit med frågesträngen kvar. `localStorage` delas med `/ai/` (samma ursprung), så topplista och skalval följde med. Egen dörr på `buildapp.se`. Struktur i `CONTEXT.md`.

**2026-10-17, före flytten.** Tre paket (Filer & mappar, Git & GitHub, Som Claude Code) plus Allt, 98 uppgifter, svar i bash och PowerShell 5.1, låtsasfilsystem, hjälpkort, topplista, två ljudmotorer plus lokala Lyria-spår. Tre testagenter (bash, PowerShell, en nyfiken spelare i webbläsaren) knäckte spelet samma dag; krascher, fusk, mobil och de största PowerShell-avvikelserna fixade (`db47b77`), hjälpen följer skalet (`ccf1962`), Ctrl+C kopierar markerad text (`588b547`). Resten av fynden står i `BACKLOG.md`.

## Verification

- `node terminal.test.js`: rättningen, alla svar i `TASKS` mot sig själva, låtsasskalet i båda skalen, testagenternas fynd.
- Webbläsare: Playwright i Chromium, Firefox och WebKit mot en lokal server (se `CONTEXT.md`).
