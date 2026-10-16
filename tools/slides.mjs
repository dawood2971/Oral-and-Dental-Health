import * as A from './art.mjs';
import { CSS, LOGO, CREDIT } from './render.mjs';
import { SESSIONS, I, toothSection } from './content.mjs';
import { chromium } from 'playwright';
const { g, S, INK } = A;
A.setMode('color');

const sv = (inner, vb = '-100 -100 200 200', w = 200, h = w, st = '') => `<svg viewBox="${vb}" style="width:${w}px;height:${h}px;flex:none;${st}">${inner}</svg>`;
const icon = (k, w = 200) => sv(I[k](), '-110 -110 220 220', w);
const LET = ['أ', 'ب', 'ج'];

const css = CSS.replace('@page{size:A4;margin:0}', '@page{size:1920px 1080px;margin:0}') + `
.s{width:1920px;height:1080px;position:relative;overflow:hidden;background:var(--l);page-break-after:always;break-after:page;font-family:Tajawal,Cairo,sans-serif}
.s:last-child{page-break-after:auto}
.band{position:absolute;top:0;left:0;right:0;height:160px;background:var(--c);display:flex;align-items:center;justify-content:space-between;padding:0 100px;border-bottom:8px solid ${INK}}
.band h2{font-family:Cairo;font-weight:900;font-size:68px;color:#fff;line-height:1.1}
.tag{font-family:Cairo;font-weight:800;font-size:28px;background:#fff;color:${INK};border:4px solid ${INK};border-radius:40px;padding:6px 28px;white-space:nowrap}
.bd{position:absolute;top:210px;bottom:110px;left:100px;right:100px;display:flex;flex-direction:column;justify-content:center;gap:36px}
.ft{position:absolute;bottom:28px;left:100px;right:100px;display:flex;justify-content:space-between;font-family:Cairo;font-weight:700;font-size:22px;color:#5b6470}
.card{background:#fff;border:5px solid ${INK};border-radius:36px;box-shadow:10px 10px 0 ${INK};padding:30px 32px}
.row{display:flex;gap:40px}
.col{display:flex;flex-direction:column}
h3{font-family:Cairo;font-weight:900;font-size:56px;line-height:1.25}
.p{font-weight:700;font-size:42px;line-height:1.45;color:#2f3640}
.num{flex:none;width:96px;height:96px;border-radius:50%;background:var(--c);color:#fff;border:5px solid ${INK};font-family:Cairo;font-weight:900;font-size:44px;display:flex;align-items:center;justify-content:center}
.li{display:flex;align-items:center;gap:28px;font-weight:800;font-size:54px;line-height:1.35}
.big{font-family:Lalezar,Cairo;font-size:150px;line-height:1.05;color:var(--c);-webkit-text-stroke:5px ${INK};paint-order:stroke fill}
`;

const band = (s, t) => `<div class="band"><h2>${t}</h2><span class="tag">الجلسة ${s.n} · ${s.title}</span></div>`;
let pg = 0;
const slide = (s, t, body, extra = '') => `<div class="s" style="--c:${s.color};--l:${s.light}">${band(s, t)}<div class="bd">${body}</div>${extra}<div class="ft"><span>${CREDIT}</span><span>${++pg}</span></div></div>`;

function cover(s) {
  pg = 1;
  return `<div class="s" style="--c:${s.color};--l:${s.light};background:${s.color}">
  <div style="position:absolute;top:0;left:0;right:0;height:150px;background:#fff;display:flex;align-items:center;justify-content:center;border-bottom:8px solid ${INK}"><img src="${LOGO}" style="height:118px"></div>
  <svg viewBox="0 0 900 900" style="position:absolute;left:40px;bottom:0;width:860px;height:860px"><circle cx="450" cy="560" r="380" fill="#fff" opacity=".25"/>${g(300, 880, 1.75, A.boy({ r: [[60, -212], [104, -262], [114, -330]] }))}${g(640, 880, 1.75, A.friend({ l: [[-60, -212], [-104, -262], [-114, -330]] }))}${g(470, 760, 1.5, A.tooth({ arms: [[[-46, -6], [-80, -40]], [[46, -6], [80, -40]]], feet: true, sparkle: true }))}</svg>
  <div style="position:absolute;right:110px;top:250px;width:900px;color:#fff">
   <div class="tag" style="display:inline-block;font-size:40px;padding:10px 40px">الجلسة ${s.n} من 5</div>
   <div style="font-family:Lalezar,Cairo;font-size:132px;line-height:1.15;margin-top:40px;-webkit-text-stroke:6px ${INK};paint-order:stroke fill">${s.title}</div>
   <div style="font-family:Cairo;font-weight:800;font-size:48px;line-height:1.35;margin-top:24px">${s.sub}</div>
   <div style="font-family:Cairo;font-weight:700;font-size:36px;margin-top:44px;opacity:.95">${s.date} · ${s.presenter}</div>
  </div>
  <div style="position:absolute;bottom:30px;right:110px;font-family:Cairo;font-weight:700;font-size:24px;color:#fff">${CREDIT}</div></div>`;
}

const goals = s => slide(s, 'أهداف الجلسة', `<div class="row" style="align-items:center"><div class="col" style="flex:1;gap:34px">${s.goals.map((t, i) => `<div class="li"><div class="num">${i + 1}</div>${t}</div>`).join('')}</div>${sv(g(0, 190, 0.95, A.boy({ r: [[60, -212], [104, -262], [114, -330]] })), '-120 -210 240 410', 360, 620)}</div>`);
const pre = s => slide(s, 'سؤال قبل أن نبدأ', `<div class="card" style="display:flex;align-items:center;gap:60px;padding:70px">${icon('question', 300)}<div style="font-family:Cairo;font-weight:900;font-size:84px;line-height:1.4">${s.pre}</div></div><div class="p" style="text-align:center">ارفع يدك وشارك برأيك.. وسنعرف الإجابة معاً</div>`);

function content(s, d) {
  switch (d.k) {
    case 'cards': return slide(s, d.t, `<div class="row">${d.items.map(([k, h, p]) => `<div class="card col" style="flex:1;align-items:center;text-align:center;gap:16px">${icon(k, 260)}<h3>${h}</h3><div class="p">${p}</div></div>`).join('')}</div>`);
    case 'types': {
      const shapes = [
        `<path d="M-40,-80 L40,-80 L44,0 L30,90 L-30,90 L-44,0 Z" fill="#fff" ${S(6)}/>`,
        `<path d="M0,-96 L44,-40 L36,10 L20,96 L-20,96 L-36,10 L-44,-40 Z" fill="#fff" ${S(6)}/>`,
        `<path d="M-50,-60 Q-50,-90 -20,-82 L0,-70 L20,-82 Q50,-90 50,-60 L40,20 L20,96 L-20,96 L-40,20 Z" fill="#fff" ${S(6)}/>`,
        `<path d="M-70,-50 Q-70,-90 -40,-80 L-14,-66 L14,-80 L40,-90 Q70,-90 70,-50 L60,10 L50,90 L20,90 L10,40 L-10,40 L-20,90 L-50,90 L-60,10 Z" fill="#fff" ${S(6)}/>`];
      return slide(s, d.t, `<div class="row">${d.items.map(([h, n, p], i) => `<div class="card col" style="flex:1;align-items:center;text-align:center;gap:10px">${sv(shapes[i], '-110 -110 220 220', 170)}<div class="big" style="font-size:110px">${n}</div><h3>${h}</h3><div class="p">${p}</div></div>`).join('')}</div><div class="p" style="text-align:center;font-weight:800">${d.note}</div>`);
    }
    case 'compare': {
      const c = ([h, n, l], k) => `<div class="card col" style="flex:1;gap:18px"><div style="display:flex;align-items:center;justify-content:space-between"><h3 style="font-size:54px">${h}</h3><div class="big" style="font-size:96px">${n}</div></div>${l.map(t => `<div class="li" style="font-size:46px">${sv(A.star5(0, 0, 40, 'star', 5), '-50 -50 100 100', 54)}${t}</div>`).join('')}</div>`;
      return slide(s, d.t, `<div class="row">${c(d.a)}${c(d.b)}</div>`);
    }
    case 'section':
      return slide(s, d.t, `<div class="row" style="align-items:center">${sv(toothSection(), '-260 -260 520 520', 640)}<div class="col" style="flex:1;gap:30px">${d.items.map(([h, p], i) => `<div class="li"><div style="flex:none;width:50px;height:50px;border-radius:50%;border:5px solid ${INK};background:${['#fffdf7', '#f7e3b5', '#f28b9b', A.PAL.gum][i]}"></div><div><h3 style="font-size:60px">${h}</h3><div class="p" style="font-size:42px">${p}</div></div></div>`).join('')}</div></div>`);
    case 'statement':
      return slide(s, d.t, `<div class="row" style="align-items:center;gap:80px"><div class="col" style="flex:1;gap:40px"><div class="big" style="font-size:104px;line-height:1.2">${d.big}</div><div class="p" style="font-size:50px">${d.p}</div></div>${icon(d.fig, 480)}</div>`);
    case 'rule':
      return slide(s, d.t, `<div class="row" style="align-items:center;justify-content:center;gap:90px">${icon('sunmoon', 380)}<div class="big" style="font-size:300px">${d.big}</div>${icon('clock', 340)}</div><div class="card" style="text-align:center"><div class="p" style="font-size:52px;font-weight:800">${d.p}</div></div>`);
    case 'steps': {
      const two = d.items.length > 4;
      return slide(s, d.t, `<div style="display:grid;grid-template-columns:${two ? '1fr 1fr' : '1fr'};gap:30px 50px">${d.items.map((t, i) => `<div class="card li" style="padding:26px 30px;font-size:${two ? 44 : 54}px"><div class="num">${i + 1}</div>${t}</div>`).join('')}</div>`);
    }
    case 'mistakes':
      return slide(s, d.t, `<div class="row" style="align-items:center"><div class="col" style="flex:1;gap:26px">${d.items.map(t => `<div class="li">${icon('cross', 80)}${t}</div>`).join('')}</div>${icon('sad', 420)}</div>`);
    case 'chain': case 'chain4':
      return slide(s, d.t, `<div class="row" style="align-items:center;justify-content:center;gap:24px">${d.items.map(([k, t], i) => `<div class="card col" style="align-items:center;text-align:center;width:${d.k === 'chain' ? 440 : 340}px;gap:10px">${icon(k, d.k === 'chain' ? 240 : 200)}<h3 style="font-size:${d.k === 'chain' ? 46 : 40}px">${t}</h3></div>${i < d.items.length - 1 ? `<div style="font-family:Cairo;font-weight:900;font-size:90px">←</div>` : ''}`).join('')}</div>${d.p ? `<div class="card"><div class="p" style="font-size:40px;text-align:center">${d.p}</div></div>` : ''}`);
    case 'sugar': {
      const spoon = `<ellipse cx="0" cy="-30" rx="26" ry="34" fill="#fff" ${S(5)}/><rect x="-7" y="0" width="14" height="70" rx="7" fill="#fff" ${S(5)}/>`;
      return slide(s, d.t, `<div class="col" style="gap:22px">${d.items.map(([k, t, n]) => `<div class="card" style="display:flex;align-items:center;gap:30px;padding:14px 30px">${icon(k, 120)}<div style="width:430px;font-family:Cairo;font-weight:900;font-size:40px">${t}</div><div style="display:flex;gap:6px;flex:1">${n ? Array.from({ length: n }, () => sv(spoon, '-40 -70 80 150', 52, 98)).join('') : '<span class="p" style="font-size:40px">صفر.. ولا ملعقة!</span>'}</div><div class="big" style="font-size:90px;-webkit-text-stroke:4px ${INK}">${n}</div></div>`).join('')}</div><div class="p" style="text-align:center;font-size:32px">${d.note}</div>`);
    }
    case 'friends': {
      const col = ([h, items], good) => `<div class="card col" style="flex:1;gap:20px;background:${good ? '#e5f6ec' : '#ffe9e9'}"><div style="display:flex;align-items:center;gap:20px;justify-content:center">${icon(good ? 'check' : 'cross', 80)}<h3>${h}</h3></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">${items.map(([k, t]) => `<div style="background:#fff;border:4px solid ${INK};border-radius:24px;padding:10px;text-align:center">${icon(k, 130)}<div style="font-family:Cairo;font-weight:800;font-size:30px">${t}</div></div>`).join('')}</div></div>`;
      return slide(s, d.t, `<div class="row">${col(d.a, true)}${col(d.b, false)}</div>`);
    }
    case 'tips':
      return slide(s, d.t, `<div style="display:grid;grid-template-columns:1fr 1fr;gap:36px">${d.items.map(([k, t]) => `<div class="card" style="display:flex;align-items:center;gap:30px">${icon(k, 170)}<h3 style="font-size:54px">${t}</h3></div>`).join('')}</div>`);
    case 'guest':
      return slide(s, d.t, `<div class="row" style="align-items:center;justify-content:center;gap:100px">${sv(g(0, 190, 0.95, A.dentist({ r: [[60, -212], [104, -262], [114, -330]], mouth: 'grin' })), '-130 -210 260 410', 420, 660)}<div class="col" style="gap:40px"><div class="p" style="font-size:52px">${d.p}</div><div class="card"><div class="big" style="font-size:90px">${d.name}</div></div><div class="p">جهّز سؤالك.. وضعه في صندوق الأسئلة السرية</div></div></div>`);
    case 'compare2': {
      const c = ([h, l], k) => `<div class="card col" style="flex:1;gap:20px"><div style="display:flex;align-items:center;gap:24px">${icon(k, 150)}<h3 style="font-size:52px">${h}</h3></div>${l.map(t => `<div class="li" style="font-size:46px"><div style="flex:none;width:26px;height:26px;border-radius:50%;background:var(--c);border:4px solid ${INK}"></div>${t}</div>`).join('')}</div>`;
      return slide(s, d.t, `<div class="row">${c(d.a, d.fa)}${c(d.b, d.fb)}</div><div class="p" style="text-align:center;font-weight:800">إذا لاحظت إحدى هذه العلامات أخبر أسرتك وراجع طبيب الأسنان</div>`);
    }
    case 'pills':
      return slide(s, d.t, `<div class="row" style="align-items:center"><div style="flex:1;display:flex;flex-wrap:wrap;gap:26px">${d.items.map(t => `<span class="card" style="padding:18px 40px;font-family:Cairo;font-weight:900;font-size:46px;border-radius:60px">${t}</span>`).join('')}</div>${icon(d.fig, 360)}</div><div class="p" style="font-weight:800">معظم الإصابات يمكن منعها بالانتباه والوقاية</div>`);
    case 'pledge':
      return slide(s, d.t, `<div class="card col" style="gap:24px;padding:44px 60px">${d.items.map(t => `<div class="li"><div style="flex:none;width:56px;height:56px;border:5px solid ${INK};border-radius:12px;background:#fff"></div>${t}</div>`).join('')}<div class="li" style="margin-top:20px;font-size:38px">الاسم: ..................................... &nbsp;&nbsp; التوقيع: .....................</div></div>`);
  }
}

const activity = s => slide(s, s.activity.t, `<div class="row" style="align-items:center"><div class="col" style="flex:1;gap:26px">${s.activity.steps.map((t, i) => `<div class="card li" style="padding:26px 30px;font-size:50px"><div class="num">${i + 1}</div>${t}</div>`).join('')}</div><div class="col" style="align-items:center;gap:20px">${icon('hourglass', 320)}<div class="tag" style="font-size:40px">${s.activity.time}</div></div></div>`);
const quiz = (s, [q, opts], i) => slide(s, `اختبار سريع · سؤال ${i + 1} من 3`, `<div class="card" style="display:flex;align-items:center;gap:40px">${icon('question', 170)}<div style="font-family:Cairo;font-weight:900;font-size:64px;line-height:1.3">${q}</div></div><div class="col" style="gap:30px">${opts.map((o, j) => `<div class="card li" style="padding:18px 34px;font-size:52px"><div class="num" style="background:#fff;color:${INK}">${LET[j]}</div>${o}</div>`).join('')}</div>`);
const keys = s => slide(s, 'تذكّر', `<div class="row" style="align-items:center"><div class="col" style="flex:1;gap:30px">${s.keys.map(t => `<div class="li">${icon('star', 70)}${t}</div>`).join('')}</div>${icon('tooth', 400)}</div>`);
function closing(s) {
  const next = SESSIONS[s.n];
  return slide(s, 'مهمتي في البيت', `<div class="row" style="align-items:center"><div class="col" style="flex:1;gap:30px">${s.take.map((t, i) => `<div class="card li" style="padding:26px 34px"><div class="num">${i + 1}</div>${t}</div>`).join('')}
  <div class="p" style="font-size:40px;font-weight:800;margin-top:10px">${next ? `الجلسة القادمة: <b>${next.title}</b> · ${next.date}` : 'نلتقي في حفل تكريم السفراء والمتدربين يوم الخميس 26 نوفمبر'}</div></div>
  ${sv(g(-70, 190, 0.85, A.boy({ r: [[60, -212], [104, -262], [114, -330]] })) + g(90, 190, 0.85, A.friend({ l: [[-60, -212], [-104, -262], [-114, -330]] })), '-200 -210 400 410', 560, 580)}</div>`);
}

export function deck(s) {
  const out = [cover(s), goals(s), pre(s), ...s.slides.map(d => content(s, d)), activity(s), ...s.quiz.map((q, i) => quiz(s, q, i)), keys(s), closing(s)];
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>${css}</style></head><body>${out.join('')}</body></html>`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const outDir = process.argv[2] || '.';
  const which = process.argv[3] ? [+process.argv[3]] : [1, 2, 3, 4, 5];
  const browser = await chromium.launch();
  for (const n of which) {
    const s = SESSIONS[n - 1];
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.setContent(deck(s), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: `${outDir}/عرض-الجلسة-${n}-${s.title.replace(/\s+/g, '-')}.pdf`, width: '1920px', height: '1080px', printBackground: true });
    await page.close();
  }
  await browser.close();
}
