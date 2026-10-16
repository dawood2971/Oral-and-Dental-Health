// Standalone Salem & Hamad pictures: editable SVG + transparent PNG (color and coloring) + A4 sheet PDF.
import * as A from './art.mjs';
import { render, doc, LOGO, CREDIT } from './render.mjs';
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
const { g, INK } = A;
const out = process.argv[2] || 'out/chars';
fs.mkdirSync(out, { recursive: true });
const wave = [[60, -212], [104, -262], [114, -330]];
const pair = () => g(690, 470, 1.15, A.boy({ r: wave })) + g(250, 470, 1.15, A.friend({ l: [[-60, -206], [-104, -256], [-116, -322]] }));
const single = alt => g(160, 470, 1.15, alt ? A.friend({ l: [[-60, -206], [-104, -256], [-116, -322]] }) : A.boy({ r: wave }));
const svgOf = (inner, w, h) => `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${inner}</svg>\n`;
const items = [];
for (const mode of ['color', 'line']) {
  A.setMode(mode);
  const sfx = mode === 'color' ? '' : '-للتلوين';
  items.push([`سالم-وحمد${sfx}`, svgOf(pair(), 940, 490), 940, 490]);
  items.push([`سالم${sfx}`, svgOf(single(false), 330, 490), 330, 490]);
  items.push([`حمد${sfx}`, svgOf(single(true), 330, 490), 330, 490]);
}
const b = await chromium.launch();
for (const [name, svg, w, h] of items) {
  fs.writeFileSync(path.join(out, name + '.svg'), svg);
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 4 });
  await p.setContent(`<html><body style="margin:0;background:transparent">${svg.replace(/^<\?xml.*?\?>/, '')}</body></html>`);
  await p.screenshot({ path: path.join(out, name + '.png'), omitBackground: true });
  await p.close();
}
await b.close();

// A4 character sheet
A.setMode('color');
const css = `
.lhb{position:absolute;top:0;left:0;right:0;height:22mm;border-bottom:.8mm solid ${INK};display:flex;align-items:center;justify-content:center}.lhb img{height:16mm}
h1{position:absolute;top:28mm;left:0;right:0;text-align:center;font-family:Lalezar,Tajawal;font-size:38pt;color:#ffd23f;-webkit-text-stroke:.7mm ${INK};paint-order:stroke fill}
.art{position:absolute;top:48mm;left:10mm;width:190mm}
.cards{position:absolute;top:160mm;left:15mm;right:15mm;display:flex;gap:6mm}
.card{flex:1;border:.7mm solid ${INK};border-radius:5mm;padding:4mm 5mm;font-size:14pt;line-height:1.9;font-weight:700}
.card h2{font-family:Lalezar,Tajawal;font-weight:400;font-size:22pt;margin-bottom:1mm}
.ft{position:absolute;bottom:9mm;left:0;right:0;text-align:center;font-family:Cairo,Tajawal;font-weight:700;font-size:10.5pt}`;
const sheet = `<div class="page"><div class="lhb"><img src="${LOGO}"></div><h1>تعرّف على سالم وحمد</h1>
<svg class="art" viewBox="0 0 940 490">${pair()}</svg>
<div class="cards">
<div class="card" style="background:#e8f2fb"><h2 style="color:${A.PAL.emb1}">سالم</h2>طالب عُماني في الصف السادس، يلبس الدشداشة البيضاء والكمّة المطرّزة بالأزرق.<br>يحب الرياضة، ولا ينام قبل أن ينظّف أسنانه.</div>
<div class="card" style="background:#f7efe0"><h2 style="color:${A.PAL.emb4}">حمد</h2>صديق سالم وزميله في الصف، يلبس الدشداشة البيضاء والكمّة البنية المخرّمة.<br>يحب التمر واللبن، ويشرب الماء بدل المشروبات الغازية.</div>
</div>
<div class="ft">${CREDIT}</div></div>`;
await render(doc('سالم وحمد', [sheet], css), path.join(out, 'بطاقة-تعريف-سالم-وحمد.pdf'));
