// Globala namn som spelet läser från andra skript (se tools/typecheck.mjs).

// terminal-ljud.js eller terminal-ljud-gemini.js, laddas efter sidan
declare const audio: any;

// /ai/quiz-data.js i ai-repot (bossfrågan), saknas lokalt
// Steg: flerval {q, options, answer, notes, why} eller para ihop {title, pairs}
declare const QUIZZES: {steps?: any[]}[];

// User-Agent Client Hints finns i Chromium men inte i TypeScripts DOM-typer
interface Navigator { userAgentData?: {platform: string} }
