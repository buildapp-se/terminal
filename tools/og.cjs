// OG-bild 1200 × 630 för buildapp.se/terminal: spelets egna färger, block och Bit, renderad i spelets sida.
// Kör med en lokal server på 8765 (uv run --no-project python -m http.server 8765 --bind 127.0.0.1) och Playwright installerat: node tools/og.cjs
const {chromium} = require('C:/dev/fackligastudier/node_modules/playwright');
(async () => {
  const b = await chromium.launch(), p = await b.newPage({viewport: {width: 1200, height: 630}, deviceScaleFactor: 1});
  await p.goto('http://127.0.0.1:8765/'); await p.waitForTimeout(500);
  await p.evaluate(() => {
    const bit = petSVG(4, 'happy');
    const blk = (pack, text, x, y, ans, rot = 0) => `<div class="b" style="--c:${PACKS[pack].c};left:${x}px;top:${y}px;transform:rotate(${rot}deg)"><span class="t">${PACKS[pack].tag}</span><p>${text}</p>${ans ? `<code>${ans}</code>` : ''}</div>`;
    document.head.insertAdjacentHTML('beforeend', `<style>
      html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#181818}
      body>*:not(#og){display:none!important}
      #og{position:fixed;inset:0;font-family:'JetBrains Mono',monospace;color:#CCCCCC;background:#181818}
      .bar{height:34px;background:#1F1F1F;border-bottom:1px solid #2B2B2B;display:flex;align-items:center;gap:8px;padding:0 16px}
      .dot{width:12px;height:12px;border-radius:50%}
      .tab{margin-left:18px;font-size:14px;color:#9D9D9D}.tab b{color:#E7E7E7;font-weight:400;border-bottom:1px solid #0078D4;padding-bottom:7px}
      .left{position:absolute;left:64px;top:118px;width:520px}
      .kick{font-size:17px;letter-spacing:.14em;color:#4EC9B0}
      h1{margin:16px 0 0;font-size:84px;line-height:1;color:#fff;font-weight:700;letter-spacing:-.02em}
      h1 i{font-style:normal;color:#4FC1FF}
      .sub{margin-top:26px;font-size:25px;line-height:1.45;color:#BDBDBD}
      .url{position:absolute;left:64px;bottom:58px;font-size:20px;color:#6A9955}
      .well{position:absolute;right:52px;top:70px;width:500px;height:504px;background:#1E1E1E;border:1px solid #2B2B2B;border-radius:10px;overflow:hidden}
      .b{position:absolute;width:290px;border:2px solid var(--c);border-radius:4px;background:#1E1E1E;padding:12px 14px 12px;box-shadow:0 10px 30px #0008}
      .b .t{position:absolute;top:-11px;left:10px;background:#1E1E1E;padding:0 6px;font-size:13px;color:var(--c)}
      .b p{margin:0;font-size:17px;line-height:1.35;color:#E7E7E7}
      .b code{display:block;margin-top:6px;font-size:14px;color:#8B8B8B}
      .prompt{position:absolute;left:24px;bottom:22px;font-size:22px;color:#E7E7E7}
      .prompt span{color:#3B8EEA}.cur{display:inline-block;width:12px;height:24px;background:#E7E7E7;vertical-align:-4px;margin-left:2px}
      .pet{position:absolute;right:26px;bottom:74px;width:120px;height:120px;filter:drop-shadow(0 8px 16px #0009)}
    </style>`);
    document.body.insertAdjacentHTML('beforeend', `<div id="og">
      <div class="bar"><span class="dot" style="background:#FF5F57"></span><span class="dot" style="background:#FEBC2E"></span><span class="dot" style="background:#28C840"></span><span class="tab"><b>TERMINAL</b>&nbsp;&nbsp; PORTS</span></div>
      <div class="left">
        <div class="kick">BASH · POWERSHELL · GIT</div>
        <h1><i>./</i>terminal</h1>
        <div class="sub">Kommandon faller som tetrisblock.<br>Skriv rätt innan de når botten.</div>
      </div>
      <div class="url">buildapp.se/terminal</div>
      <div class="well">
        ${blk('git', 'Skapa grenen dark-mode och byt till den', 180, 30, '', 0)}
        ${blk('fs', 'Hello world i Python: skapa filen hello.py', 24, 150, '', 0)}
        ${blk('cc', 'Läs de 50 första raderna i app.log', 60, 286, '', 0)}
        <svg class="pet" viewBox="0 0 40 40">${bit}</svg>
        <div class="prompt"><span>$</span> git switch -c dark-mode<span class="cur"></span></div>
      </div>
    </div>`);
  });
  await p.waitForTimeout(400);
  await p.screenshot({path: require('path').join(__dirname, '..', 'og.png')});
  await b.close();
  console.log('ok');
})();
