// Wall posters (A4, scalable to A3) for the six adapted MOPH leaflets.
import * as A from './art.mjs';
import { LOGO, CREDIT } from './render.mjs';
import { IC, TOPICS } from './lib-content.mjs';
import { html, pdf, png, close } from './lib-render.mjs';
import fs from 'node:fs';
const { g, INK } = A;
A.setMode('color');
const OUT = process.argv[2] || '../out';

export const PCSS = `
.poster{background:var(--bg)}
.lh{position:absolute;top:0;left:0;right:0;height:22mm;background:#fff;display:flex;align-items:center;justify-content:center}.lh img{height:16mm}
.hd{position:absolute;top:22mm;left:0;right:0;height:36mm;border-top:1.2mm solid ${INK};background:var(--c1);border-bottom:1.2mm solid ${INK};border-radius:0 0 14mm 14mm;color:#fff;text-align:center;padding-top:4mm}
.hd h1{font-family:Lalezar,Tajawal;font-weight:400;font-size:36pt;line-height:1.1;-webkit-text-stroke:.9mm ${INK};paint-order:stroke fill}
.hd p{font-family:Cairo,Tajawal;font-weight:800;font-size:14pt;margin-top:2mm;color:#fff;text-shadow:0 .4mm 0 rgba(0,0,0,.25)}
.ft{position:absolute;bottom:0;left:0;right:0;height:14mm;flex-direction:column;line-height:1.4;background:${INK};color:#fff;font-family:Cairo,Tajawal;font-weight:700;font-size:10pt;display:flex;align-items:center;justify-content:center}
.ft .sm{font-size:8.5pt;font-weight:400;opacity:.85}
.body{position:absolute;top:63mm;bottom:19mm;left:10mm;right:10mm;display:flex;flex-direction:column;gap:4mm}.grow{flex:1;min-height:0}
.card{background:#fff;border:.8mm solid ${INK};border-radius:6mm;box-shadow:1.2mm 1.2mm 0 ${INK};padding:2.5mm 4mm;display:flex;align-items:center;gap:3mm;position:relative}
.n{flex:none;width:11mm;height:11mm;border-radius:50%;background:var(--c1);color:#fff;border:.6mm solid ${INK};font-family:Cairo,Tajawal;font-weight:900;font-size:15pt;display:flex;align-items:center;justify-content:center}
.card .n{position:absolute;top:-3mm;right:-3mm}
.card h3{font-family:Cairo,Tajawal;font-weight:900;font-size:15.5pt;line-height:1.3}
.card p{font-weight:700;font-size:12.5pt;line-height:1.45;color:#333}
.grid2{display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:1fr;gap:5mm 5mm}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4mm}
.span2{grid-column:1/-1}
.box{background:#fff;border:.8mm solid ${INK};border-radius:6mm;padding:3mm 5mm}
.box h2{font-family:Cairo,Tajawal;font-weight:900;font-size:16pt;color:var(--c3)}
.band{margin-top:1.5mm;background:var(--c2);border:.8mm solid ${INK};border-radius:6mm;padding:2.5mm 5mm;font-family:Cairo,Tajawal;font-weight:800;font-size:13pt;display:flex;align-items:center;gap:4mm}
.sec{font-family:Cairo,Tajawal;font-weight:900;font-size:16pt;color:#fff;background:var(--c3);border:.7mm solid ${INK};border-radius:4mm;padding:1mm 5mm;align-self:flex-start}
.myth{display:grid;grid-template-columns:20mm 1fr 1.25fr;align-items:stretch;gap:0;border:.8mm solid ${INK};border-radius:5mm;overflow:hidden;background:#fff;box-shadow:1mm 1mm 0 ${INK}}
.myth>div{padding:1.6mm 3.5mm;display:flex;align-items:center}
.myth .x{background:#ffe3e3;font-weight:800;font-size:12pt;border-left:.6mm dashed ${INK};gap:2mm}
.myth .t{background:#e6f7ee;font-weight:700;font-size:11.8pt;line-height:1.4;gap:2mm}
.myth .ic{justify-content:center;background:var(--c2);border-left:.6mm solid ${INK};padding:1mm}
.tag{flex:none;font-family:Cairo;font-weight:900;font-size:11pt;color:#fff;border-radius:3mm;padding:0 2mm;border:.5mm solid ${INK}}
.inj .card{padding:1.5mm 3mm}.inj .card h3{font-size:13.5pt;line-height:1.2}.inj .card p{font-size:11pt;line-height:1.3}
.tip{flex:1;text-align:center;background:#fff;border:.7mm solid ${INK};border-radius:5mm;padding:1.5mm;font-family:Cairo,Tajawal;font-weight:800;font-size:10.5pt;line-height:1.3}
`;
export const ico = (k, w = 26, h = w) => `<svg viewBox="-110 -110 220 220" style="flex:none;width:${w}mm;height:${h}mm">${IC[k]()}</svg>`;
const foot = () => `<div class="ft"><span>${CREDIT}</span><span class="sm">برنامج تعزيز صحة الفم والأسنان في المجتمع المدرسي · نوفمبر 2026</span></div>`;
export const poster = (t, body, extra = '') => `<div class="page poster" style="${t.vars}${extra}"><div class="lh"><img src="${LOGO}"></div><div class="hd"><h1>${t.title}</h1><p>${t.sub}</p></div><div class="body">${body}</div>${foot()}</div>`;
const T = Object.fromEntries(TOPICS.map(t => [t.slug, t]));

const vcard = (it, i, w = 26, cls = '') => `<div class="card ${cls}" style="flex-direction:column;justify-content:center;text-align:center;gap:1mm"><div class="n">${i + 1}</div>${ico(it[0], w, w * 0.8)}<div><h3>${it[1]}</h3><p>${it[2]}</p></div></div>`;
const hcard = (it, i, w = 24, cls = '') => `<div class="card ${cls}"><div class="n">${i + 1}</div>${ico(it[0], w)}<div><h3>${it[1]}</h3><p>${it[2]}</p></div></div>`;

const salemSay = (txt, mouth = 'grin') => `<div class="band"><svg viewBox="-80 -380 160 400" style="flex:none;width:13mm;height:26mm;margin:-3mm 0 -2mm">${A.boy({ mouth, r: [[60, -212], [104, -262], [114, -330]] })}</svg><span>${txt}</span></div>`;

export const builders = {
  habits(t) {
    const cards = t.items.map((it, i) => i === 6 ? hcard(it, i, 26, 'span2') : vcard(it, i, 29)).join('');
    return poster(t, `<div class="grid2 grow">${cards}</div>${salemSay('سالم يقول: ابدأ بعادة واحدة اليوم، وأضف غيرها كل أسبوع!')}`);
  },
  brushing(t) {
    const cards = t.items.map((it, i) => vcard(it, i, 38)).join('');
    const tips = t.tips.map(([k, s]) => `<div class="tip">${ico(k, 15, 13)}${s}</div>`).join('');
    return poster(t, `<div class="grid2 grow">${cards}</div><div style="display:flex;gap:3mm">${tips}</div>`);
  },
  myths(t) {
    const rows = t.myths.map(([k, m, f]) => `<div class="myth grow"><div class="ic">${ico(k, 16, 15)}</div><div class="x"><span class="tag" style="background:${A.PAL.red}">خطأ</span>${m}</div><div class="t"><span class="tag" style="background:${A.PAL.green}">الحقيقة</span>${f}</div></div>`).join('');
    return poster(t, rows);
  },
  breath(t) {
    const cards = t.items.map((it, i) => hcard(it, i, 23)).join('');
    return poster(t, `<div class="grid2 grow">${cards}</div>${salemSay(t.fact, 'smile')}`);
  },
  injury(t) {
    const steps = t.items.map((it, i) => hcard(it, i, 17, i === 6 ? 'span2' : '')).join('');
    const br = t.broken.map((it, i) => `<div class="card" style="flex-direction:column;text-align:center;gap:0;padding:2mm"><div class="n" style="background:var(--c3)">${i + 1}</div>${ico(it[0], 17, 14)}<h3 style="font-size:12.5pt">${it[1]}</h3><p style="font-size:11pt">${it[2]}</p></div>`).join('');
    const pv = t.prevent;
    return poster(t, `<div class="sec">إذا سقط السن الدائم كاملاً</div><div class="grid2 grow inj" style="gap:3.5mm 5mm">${steps}</div>
      <div class="sec">إذا انكسر جزء من السن</div><div class="grid3">${br}</div>
      <div class="band">${ico(pv[0], 16, 13)}<span><b>للوقاية: ${pv[1]}</b> ${pv[2]}</span></div>`, '');
  },
};

// Weekly chart: A4 landscape, 4 weeks.
export function chartPage(t) {
  const tooth = k => `<svg viewBox="-60 -90 120 175" style="width:8mm;height:11mm">${A.tooth({ mouth: 'smile' }).replace(/fill="#ffffff"/, 'fill="#fff"')}</svg>`;
  const wk = w => `<div class="wk"><div class="wh">الأسبوع ${['الأول', 'الثاني', 'الثالث', 'الرابع'][w]}</div>
    <div class="row hd2"><span></span><span>${'<svg viewBox="-80 -80 160 160" style="width:7mm;height:7mm">' + A.sun(0, 0, 0.9) + '</svg>'}صباحاً</span><span>${'<svg viewBox="-80 -80 160 160" style="width:7mm;height:7mm">' + A.moon(0, 0, 1.2) + '</svg>'}مساءً</span></div>
    ${t.days.map(d => `<div class="row"><span class="d">${d}</span><span>${tooth()}</span><span>${tooth()}</span></div>`).join('')}
    <div class="sig">توقيع ولي الأمر: ..................</div></div>`;
  const css = `@page{size:297mm 210mm;margin:0}.land{width:297mm;height:210mm;position:relative;overflow:hidden;background:var(--bg)}
  .land .lh{height:20mm}.land .lh img{height:14mm}
  .land .hd{top:20mm;height:24mm;padding-top:2mm;border-radius:0 0 10mm 10mm}.land .hd h1{font-size:26pt}.land .hd p{font-size:12pt;margin-top:0}
  .name{position:absolute;top:47mm;right:12mm;left:12mm;display:flex;gap:8mm;font-family:Cairo;font-weight:800;font-size:12.5pt}
  .weeks{position:absolute;top:56mm;bottom:17mm;left:10mm;right:10mm;display:flex;gap:5mm}
  .wk{flex:1;background:#fff;border:.8mm solid ${INK};border-radius:5mm;box-shadow:1mm 1mm 0 ${INK};overflow:hidden;display:flex;flex-direction:column}
  .wh{background:var(--c1);color:#fff;text-align:center;font-family:Cairo;font-weight:900;font-size:13pt;border-bottom:.7mm solid ${INK}}
  .row{display:grid;grid-template-columns:1.2fr 1fr 1fr;align-items:center;justify-items:center;border-bottom:.3mm solid #bbb;flex:1}
  .row.hd2{flex:none;background:var(--c2);font-family:Cairo;font-weight:800;font-size:10pt}.row.hd2 span{display:flex;align-items:center;gap:1mm}
  .d{font-family:Cairo;font-weight:800;font-size:11pt;justify-self:start;padding-right:2mm}
  .sig{font-size:9.5pt;font-weight:700;padding:1.5mm 2mm;background:#fafafa}
  .key{position:absolute;bottom:14.5mm;left:0;right:0;text-align:center;font-family:Cairo;font-weight:800;font-size:10.5pt}
  .land .ft{height:12mm}`;
  const sw = c => `<span style="display:inline-block;width:5mm;height:4mm;border-radius:1mm;vertical-align:middle;border:.4mm solid ${INK};background:${c}"></span>`;
  return { css, page: `<div class="land poster" style="${t.vars}"><div class="lh"><img src="${LOGO}"></div><div class="hd"><h1>${t.title}</h1><p>لوّن السن ${sw(A.PAL.green)} بالأخضر إذا فرّشت أسنانك، و${sw(A.PAL.red)} بالأحمر إذا نسيت</p></div>
  <div class="name"><span>اسم الطالب: ..............................</span><span>الصف: ..........</span><span>تاريخ البدء: ..........</span></div>
  <div class="weeks">${[3, 2, 1, 0].reverse().map(wk).join('')}</div>${foot()}</div>` };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const t of TOPICS) {
    const dir = `${OUT}/${t.id}`; fs.mkdirSync(dir, { recursive: true });
    if (t.slug === 'chart') {
      const { css, page } = chartPage(t);
      const d = html(t.title, page, PCSS + css);
      await pdf(d, `${dir}/ملصق-جداري.pdf`, '297mm', '210mm');
      await png(d, `${dir}/ملصق-جداري.png`, 1123, 794, 1);
    } else {
      const d = html(t.title, builders[t.slug](t), PCSS);
      await pdf(d, `${dir}/ملصق-جداري.pdf`);
      await png(d, `${dir}/ملصق-جداري.png`, 794, 1123, 1);
    }
    console.log('poster', t.id);
  }
  await close();
}
