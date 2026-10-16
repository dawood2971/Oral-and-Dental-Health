// Vertical infographics 1080x1920 (social / screen) + PDF of the same page.
import * as A from './art.mjs';
import { LOGO, CREDIT } from './render.mjs';
import { IC, TOPICS } from './lib-content.mjs';
import { html, pdf, png, close } from './lib-render.mjs';
import fs from 'node:fs';
const { g, INK } = A;
A.setMode('color');
const OUT = process.argv[2] || '../out';

const css = `
.ig{width:1080px;height:1920px;position:relative;overflow:hidden;background:var(--bg);font-family:Tajawal,Cairo}
.ig .lh{height:150px;background:#fff;display:flex;align-items:center;justify-content:center;border-bottom:8px solid ${INK}}.ig .lh img{height:110px}
.ig .top{display:flex;align-items:center;padding:24px 50px 0;gap:10px;height:380px}
.ig .tt{flex:1}
.ig h1{font-family:Lalezar;font-weight:400;font-size:76px;line-height:1.05;color:var(--c1);-webkit-text-stroke:5px ${INK};paint-order:stroke fill}
.ig .sub{font-family:Cairo;font-weight:800;font-size:34px;line-height:1.35;margin-top:14px}
.keys{display:flex;gap:22px;padding:0 50px;margin-top:6px}
.key{flex:1;background:var(--c1);color:#fff;border:5px solid ${INK};border-radius:30px;box-shadow:7px 7px 0 ${INK};text-align:center;padding:10px 6px 14px}
.key b{display:block;font-family:Cairo;font-weight:900;font-size:68px;line-height:1.1;-webkit-text-stroke:3px ${INK};paint-order:stroke fill}
.key span{font-family:Cairo;font-weight:800;font-size:25px;line-height:1.2}
.path{position:absolute;left:50px;right:50px;top:735px;bottom:175px;display:flex;flex-direction:column;justify-content:space-between}
.path:before{content:"";position:absolute;top:20px;bottom:20px;left:42%;margin-left:-6px;width:12px;background:repeating-linear-gradient(to bottom,${INK} 0 26px,transparent 26px 44px);border-radius:6px}
.st{display:flex;align-items:center;gap:0;position:relative}
.st .bub{width:54%;background:#fff;border:5px solid ${INK};border-radius:28px;box-shadow:6px 6px 0 ${INK};padding:12px 20px;display:flex;align-items:center;gap:12px}
.st .dot{position:absolute;left:42%;margin-left:-34px;width:68px;height:68px;border-radius:50%;background:var(--c1);color:#fff;border:5px solid ${INK};font-family:Cairo;font-weight:900;font-size:40px;display:flex;align-items:center;justify-content:center;z-index:2}
.st h3{font-family:Cairo;font-weight:900;font-size:31px;line-height:1.2}
.st p{font-weight:700;font-size:24px;line-height:1.3;color:#333}
.st .art{width:38%;display:flex;justify-content:center}
.dense .st h3{font-size:25px}.dense .st p{font-size:20px}.dense .st .bub{padding:6px 16px;border-radius:22px}
.q{position:absolute;bottom:92px;left:50px;right:50px;background:var(--c2);border:5px solid ${INK};border-radius:28px;font-family:Cairo;font-weight:900;font-size:32px;text-align:center;padding:10px}
.ig .ft{position:absolute;bottom:0;left:0;right:0;height:76px;background:${INK};color:#fff;font-family:Cairo;font-weight:700;font-size:23px;display:flex;align-items:center;justify-content:center}
`;
const svg = (k, s = 150) => `<svg viewBox="-110 -110 220 220" style="width:${s}px;height:${s}px;flex:none">${IC[k]()}</svg>`;

function hero(t) {
  const wave = [[60, -212], [104, -262], [114, -330]];
  const m = { habits: 'grin', brushing: 'teeth', myths: 'smile', chart: 'grin', breath: 'smile', injury: 'o' }[t.slug];
  let s = g(150, 470, 1.15, A.boy({ mouth: m, r: wave }));
  if (t.slug === 'injury' || t.slug === 'chart') s += g(330, 300, 1.2, A.tooth({ mouth: t.slug === 'injury' ? 'o' : 'grin', arms: true, feet: true, sparkle: t.slug === 'chart' }));
  else s += g(330, 300, 1.2, A.tooth({ mouth: 'grin', arms: [[[-46, -6], [-80, -40]], [[46, -6], [80, -40]]], feet: true, sparkle: true }));
  return `<svg viewBox="0 0 440 490" style="width:350px;height:390px;flex:none">${s}</svg>`;
}

function steps(t) {
  let list;
  if (t.slug === 'myths') list = t.myths.map(([k, m, f]) => [k, '✗ ' + m, '✓ ' + f]);
  else if (t.slug === 'injury') list = t.items;
  else list = t.items;
  const dense = list.length > 6;
  const sz = dense ? 104 : 140;
  return `<div class="path ${dense ? 'dense' : ''}">${list.map((it, i) => `<div class="st"><div class="bub"><div><h3>${it[1]}</h3><p>${it[2]}</p></div></div><div class="dot">${i + 1}</div><div class="art">${svg(it[0], sz)}</div></div>`).join('')}</div>`;
}

export function infographic(t) {
  const extra = t.slug === 'injury' ? 'للوقاية: ألبس واقي الأسنان في الرياضة' : t.question;
  return `<div class="ig" style="${t.vars}"><div class="lh"><img src="${LOGO}"></div>
  <div class="top">${hero(t)}<div class="tt"><h1>${t.title}</h1><div class="sub">${t.sub}</div></div></div>
  <div class="keys">${t.keys.map(([n, s]) => `<div class="key"><b>${n}</b><span>${s}</span></div>`).join('')}</div>
  ${steps(t)}<div class="q">${extra}</div><div class="ft">${CREDIT}</div></div>`;
}
export const IGCSS = css;

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const t of TOPICS) {
    const dir = `${OUT}/${t.id}`; fs.mkdirSync(dir, { recursive: true });
    const d = html(t.title, infographic(t), css, '@page{size:1080px 1920px;margin:0}');
    await png(d, `${dir}/انفوجرافيك.png`, 1080, 1920, 1);
    await pdf(d, `${dir}/انفوجرافيك.pdf`, '1080px', '1920px');
    console.log('ig', t.id);
  }
  await close();
}
