// Builds the static interactive page «ابتسامتي صحتي» for GitHub Pages.
// usage: node build-site.mjs <library-out-dir> <site-dir> [<project-materials-dir>]
import * as A from './art.mjs';
import { CREDIT } from './render.mjs';
import { IC, TOPICS, MINI } from './lib-content.mjs';
import { ACT, SESSION_NAMES } from './lib-activities.mjs';
import { QUIZ, FOODS, STORIES, EXPERIMENT, MOUTH, FAQ } from './site-content.mjs';
import fs from 'node:fs';
import path from 'node:path';
const { g } = A;
A.setMode('color');
const [LIB, SITE, MAT] = [process.argv[2] || '../out', process.argv[3] || '../site', process.argv[4] || '/mnt/project-files/materials'];
const HERE = path.dirname(new URL(import.meta.url).pathname);
const cp = (a, b) => { if (fs.existsSync(a)) { fs.mkdirSync(path.dirname(b), { recursive: true }); fs.copyFileSync(a, b); return true; } console.warn('missing', a); return false; };
for (const [a, b] of [['Cairo.ttf', 'Cairo.ttf'], ['Tajawal-Regular.ttf.ttf', 'Tajawal-Regular.ttf'], ['Tajawal-Bold.ttf.ttf', 'Tajawal-Bold.ttf'], ['Lalezar-Regular.ttf.ttf', 'Lalezar.ttf']]) cp(`${HERE}/../fonts/${a}`, `${SITE}/assets/fonts/${b}`);
cp(`${HERE}/../fonts/letterhead.jpg`, `${SITE}/assets/letterhead.jpg`);

// ---------- copy library files ----------
const FILES = [['poster', 'ملصق-جداري.pdf'], ['poster-img', 'ملصق-جداري.png'], ['infographic', 'انفوجرافيك.png'], ['infographic-pdf', 'انفوجرافيك.pdf'], ['video', 'فيديو.mp4'], ['script', 'سيناريو-الفيديو-ولوحة-القصة.pdf']];
for (const t of [...TOPICS, ...MINI]) {
  for (const [k, f] of FILES) cp(`${LIB}/${t.id}/${f}`, `${SITE}/assets/${t.slug}/${k}.${f.split('.').pop()}`);
  cp(`${LIB}/_thumbs/${t.slug}/scene-1.jpg`, `${SITE}/assets/${t.slug}/cover.jpg`);
}
cp(`${LIB}/0-mulhaq-al-jalasat/دليل-الأنشطة-الإضافية-للجلسات.pdf`, `${SITE}/assets/sessions/activities-guide.pdf`);
cp(`${LIB}/0-mulhaq-al-jalasat/شرائح-إضافية-للجلسات.pdf`, `${SITE}/assets/sessions/extra-slides.pdf`);
const decks = ['عرض-الجلسة-1-تعرّف-على-أسنانك', 'عرض-الجلسة-2-الفرشاة-والمعجون-والخيط', 'عرض-الجلسة-3-غذاؤك-وأسنانك', 'عرض-الجلسة-4-التسوّس-وأمراض-اللثة', 'عرض-الجلسة-5-عادات-تحمي-ابتسامتي'];
decks.forEach((d, i) => cp(`${MAT}/sessions/v2/${d}.pdf`, `${SITE}/assets/sessions/session-${i + 1}.pdf`));
cp(`${MAT}/sessions/v2/دليل-الجلسات-التوعوية-للطباعة-2.pdf`, `${SITE}/assets/sessions/facilitator-booklet.pdf`);
cp(`${MAT}/ملصقات-الحائط-3.pdf`, `${SITE}/assets/print/wall-posters.pdf`);
cp(`${MAT}/دفتر-التلوين-سالم-وحمد-2.pdf`, `${SITE}/assets/print/coloring-book.pdf`);
cp(`${MAT}/ملصقات-الطلاب-مربعة-2.pdf`, `${SITE}/assets/print/stickers.pdf`);

// ---------- art helpers ----------
const ico = k => `<svg viewBox="-110 -110 220 220" aria-hidden="true">${IC[k]()}</svg>`;
const wave = [[60, -212], [104, -262], [114, -330]];
const salem = (m = 'grin') => `<svg viewBox="-110 -380 220 400" aria-hidden="true">${A.boy({ mouth: m, r: wave })}</svg>`;
const hamad = (m = 'smile') => `<svg viewBox="-130 -380 220 400" aria-hidden="true">${A.friend({ mouth: m, l: [[-60, -206], [-104, -256], [-116, -322]] })}</svg>`;
const sinnoon = (m = 'grin', o = {}) => `<svg viewBox="-100 -100 200 200" aria-hidden="true">${A.tooth({ mouth: m, sparkle: m !== 'sad', arms: [[[-46, -6], [-80, -40]], [[46, -6], [80, -40]]], feet: true, ...o })}</svg>`;
const T = Object.fromEntries([...TOPICS, ...MINI].map(t => [t.slug, t]));
const food = { milk: A.laban(), cheese: A.cheese(), apple: A.apple(), carrot: A.carrot(), cucumber: A.cucumber(), yogurt: A.yogurt(), water: A.waterBottle(), banana: A.banana(), candy: A.candy(), soda: A.soda(), donut: A.donut(), chips: A.chips(), lollipop: A.lollipop() };
const foodSvg = k => `<svg viewBox="-80 -100 160 200" aria-hidden="true">${food[k]}</svg>`;

// ---------- section builders ----------
const H = (id, kick, title, sub) => `<header class="sh" id="${id}"><span class="kick">${kick}</span><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</header>`;
const block = (id, vars, inner) => `<section class="blk" id="${id}" style="${vars}">${inner}</section>`;

// 1. quizzes & games
const sQuiz = block('care-quiz', '--bg:#eaf4ff;--c1:#1f6fb2;--c2:#cfe5ff;--c3:#164f80', `${H('', 'اختبار ذاتي', 'هل تعتني بأسنانك بالطريقة الصحيحة؟', '9 أسئلة سريعة، ثم تقييم فوري ونصيحة لكل نقطة ضعف')}
<div class="cq" id="cq"><div class="cq-bar"><i id="cqBar"></i></div><p class="cq-n" id="cqN"></p><h3 id="cqQ"></h3><div class="cq-opts" id="cqOpts"></div>
<div class="cq-res" id="cqRes" hidden><div class="cq-face" id="cqFace"></div><div><h3 id="cqTitle"></h3><p id="cqScore"></p><ul id="cqTips"></ul><button class="btn" id="cqAgain">أعد الاختبار</button></div></div></div>`);

const sFood = block('food-game', '--bg:#fff6e5;--c1:#e08a00;--c2:#ffe2a8;--c3:#9a5c00', `${H('', 'لعبة', 'اختر الغذاء الصحيح للسن', 'لديك 30 ثانية: هل هذا الطعام يقوّي سنّون أم يضرّه؟')}
<div class="fg"><div class="fg-top"><span>⏱ <b id="fgTime">30</b></span><span>النقاط: <b id="fgScore">0</b></span><span>أفضل نتيجة: <b id="fgBest">0</b></span></div>
<div class="fg-stage"><div class="fg-tooth" id="fgTooth">${sinnoon('grin')}</div><div class="fg-food" id="fgFood"><button class="btn" id="fgStart">ابدأ اللعبة</button></div></div>
<div class="fg-btns"><button class="btn ok" id="fgGood" disabled>يقوّي سنّي 💪</button><button class="btn no" id="fgBad" disabled>يضرّ سنّي ⚠️</button></div><p class="fg-msg" id="fgMsg" aria-live="polite"></p></div>
<template id="tplToothHappy">${sinnoon('grin')}</template><template id="tplToothSad">${sinnoon('sad', { cavity: true, sad: true })}</template>`);

const germCell = `<button class="gc" aria-label="سن"><span class="gt">${`<svg viewBox="-62 -92 124 180" aria-hidden="true">${A.tooth({ mouth: 'smile' })}</svg>`}</span><span class="gg">${`<svg viewBox="-70 -70 140 140" aria-hidden="true">${A.germ()}</svg>`}</span></button>`;
const sGerm = block('germ-game', '--bg:#eef9ec;--c1:#3c9a2e;--c2:#d3f1cc;--c3:#26701c', `${H('', 'لعبة', 'اصطاد السوسة', 'الجراثيم تظهر على الأسنان! اضغط عليها بسرعة قبل أن تسبب التسوّس')}
<div class="gm"><div class="fg-top"><span>⏱ <b id="gmTime">20</b></span><span>اصطدت: <b id="gmHit">0</b></span><span>هربت: <b id="gmMiss">0</b></span></div>
<div class="gm-grid" id="gmGrid">${germCell.repeat(9)}</div><button class="btn" id="gmStart">ابدأ</button><p class="fg-msg" id="gmMsg" aria-live="polite"></p></div>`);

const br = T.brushing;
const quadSvg = `<svg viewBox="0 0 300 220" class="mouth-q" aria-hidden="true"><ellipse cx="150" cy="110" rx="140" ry="100" fill="#f78fa7" stroke="#1d1d1f" stroke-width="4"/><ellipse cx="150" cy="110" rx="112" ry="74" fill="#7a2335"/>
${[0, 1, 2, 3].map(q => { const up = q < 2, right = q === 0 || q === 3; let s = ''; for (let i = 0; i < 4; i++) { const x = right ? 160 + i * 26 : 114 - i * 26, y = up ? 44 + i * 6 : 150 - i * 6; s += `<rect x="${x}" y="${y}" width="24" height="26" rx="7" fill="#fff" stroke="#1d1d1f" stroke-width="2.5"/>`; } return `<g class="qd" data-q="${q}">${s}</g>`; }).join('')}
<ellipse cx="150" cy="140" rx="54" ry="22" fill="#f06c8a" stroke="#1d1d1f" stroke-width="3"/></svg>`;
const sBrush = block('brushing', br.vars, `${H('', 'خطوة بخطوة', br.title, br.sub)}
<div class="stepper"><div class="st-art" id="stArt">${ico(br.items[0][0])}</div><div class="st-txt"><b class="num" id="stN">1</b><h3 id="stH">${br.items[0][1]}</h3><p id="stP">${br.items[0][2]}</p>
<div class="st-nav"><button class="btn ghost" id="stPrev">السابق</button><span id="stDots">${br.items.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</span><button class="btn" id="stNext">التالي</button></div></div></div>
<div class="timer" id="timer"><div class="tm-left"><div class="tm-mouth">${quadSvg}<div class="tm-brush" id="tmBrush">${`<svg viewBox="-10 -40 240 50" aria-hidden="true">${A.toothbrush({ paste: true })}</svg>`}</div></div>
<div class="tm-ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="tr-bg"/><circle cx="60" cy="60" r="52" class="tr-fg" id="tmFg"/></svg><div class="tm-t" id="tmT">2:00</div></div></div>
<div class="tm-right"><h3>مؤقّت الدقيقتين</h3><p id="tmMsg">اضغط «ابدأ» وفرّش معنا: 30 ثانية لكل ربع من فمك. الفرشاة على الرسم تريك أين تنظّف الآن.</p>
<div class="tm-ctrl"><button class="btn" id="tmGo">ابدأ</button><button class="btn ghost" id="tmMusic" aria-pressed="true">🎵 الموسيقى: تعمل</button></div><div class="stars" id="tmStars" hidden>⭐⭐⭐ أحسنت! دقيقتان كاملتان</div></div></div>
<div class="tips">${br.tips.map(([k, s]) => `<div class="tip">${ico(k)}<span>${s}</span></div>`).join('')}</div>`);

const my = T.myths;
const sMyth = block('myths', my.vars, `${H('', 'اختبر معلوماتك', 'حقائق وأوهام: صح أم خطأ؟', my.sub)}
<div class="quiz" id="quiz"><div class="qz-top"><span id="qzN"></span><span id="qzS"></span></div>
<div class="qz-card"><div class="qz-ic" id="qzIc"></div><p id="qzQ"></p></div>
<div class="qz-btns"><button class="btn ok" data-a="1">صح 👍</button><button class="btn no" data-a="0">خطأ 👎</button></div>
<div class="qz-fb" id="qzFb" aria-live="polite"></div><button class="btn" id="qzNext" hidden>العبارة التالية</button></div>`);

const PAIRS = [['بقايا طعام بين الأسنان', 'الخيط يومياً'], ['بكتيريا على اللسان', 'تنظيف اللسان بالفرشاة'], ['فم جاف', 'شرب الماء كثيراً'], ['تدخين أو سيجارة إلكترونية', 'الابتعاد عنها تماماً'], ['جهاز أسنان متّسخ', 'تنظيف الجهاز يومياً'], ['رائحة مستمرة رغم العناية', 'زيارة الطبيب للبحث عن السبب']];
const bb = T.breath, inj = T.injury;
const sMatch = block('breath', bb.vars, `${H('', 'لعبة المطابقة', 'المحقّق سنّون: رائحة الفم', 'اختر السبب ثم الحل المناسب له')}
<div class="story"><span>${hamad('sad')}</span><p>حمد لاحظ أن أصدقاءه يبتعدون عنه في الفسحة. ساعد المحقّق سنّون في معرفة السبب والحل.</p></div>
<div class="match"><div class="mcol" id="mCause">${PAIRS.map(([c], i) => `<button class="mc" data-i="${i}">${c}</button>`).join('')}</div><div class="mcol" id="mFix"></div></div><p class="mfb" id="mFb" aria-live="polite"></p>
<p class="fact">💡 ${bb.fact}</p>`);
const sOrder = block('injury', inj.vars, `${H('', 'فريق الإسعاف السريع', inj.title, 'رتّب خطوات إنقاذ السن الدائم المخلوع: اضغط عليها بالترتيب الصحيح')}
<div class="order" id="order"></div><p class="ofb" id="oFb" aria-live="polite"></p><button class="btn ghost" id="oReset">أعد المحاولة</button>
<div class="mini-grid three">${inj.broken.map(([k, h, p]) => `<div class="mini">${ico(k)}<div><b>${h}</b><span>${p}</span></div></div>`).join('')}</div><p class="fact">🛡️ <b>${inj.prevent[1]}</b> ${inj.prevent[2]}</p>`);

// 2. media library
const ALL = [...TOPICS, ...MINI];
const igGallery = TOPICS.map(t => `<figure class="ig"><a href="assets/${t.slug}/infographic.png" target="_blank" rel="noopener"><img loading="lazy" src="assets/${t.slug}/infographic.png" alt="إنفوجرافيك: ${t.title}"></a><figcaption><b>${t.title}</b><span class="acts"><a class="sbtn" href="assets/${t.slug}/infographic.png" download>⬇ صورة</a><a class="sbtn" href="assets/${t.slug}/infographic-pdf.pdf" download>⬇ PDF</a><button class="sbtn share" data-url="assets/${t.slug}/infographic.png" data-title="${t.title}">↗ مشاركة</button></span></figcaption></figure>`).join('');
const vids = [...MINI, ...TOPICS].map(t => `<figure class="vd"><video controls preload="none" playsinline poster="assets/${t.slug}/cover.jpg" src="assets/${t.slug}/video.mp4"></video><figcaption><b>${t.title}</b><span class="acts"><a class="sbtn" href="assets/${t.slug}/video.mp4" download>⬇ MP4</a><a class="sbtn" href="assets/${t.slug}/script.pdf" download>⬇ السيناريو</a></span></figcaption></figure>`).join('');
const posters = TOPICS.map(t => `<figure class="ps"><a href="assets/${t.slug}/poster.pdf" target="_blank" rel="noopener"><img loading="lazy" src="assets/${t.slug}/poster-img.png" alt="ملصق: ${t.title}"></a><figcaption><b>${t.title}</b><a class="sbtn" href="assets/${t.slug}/poster.pdf" download>⬇ PDF للطباعة</a></figcaption></figure>`).join('');
const sLib = `<div class="tabs" role="tablist"><button role="tab" class="tab on" data-tab="tabIg" aria-selected="true">معرض الإنفوجرافيك</button><button role="tab" class="tab" data-tab="tabVd" aria-selected="false">استوديو الفيديو</button><button role="tab" class="tab" data-tab="tabPs" aria-selected="false">ركن الملصقات</button></div>
<div class="tabp" id="tabIg"><div class="ig-grid">${igGallery}</div></div>
<div class="tabp" id="tabVd" hidden><div class="vd-grid">${vids}</div></div>
<div class="tabp" id="tabPs" hidden><div class="ps-grid">${posters}</div><div class="more-print"><b>مواد إضافية للطباعة:</b><a class="sbtn" href="assets/print/wall-posters.pdf" download>⬇ ملصقات الحائط</a><a class="sbtn" href="assets/print/coloring-book.pdf" download>⬇ دفتر التلوين: سالم وحمد</a><a class="sbtn" href="assets/print/stickers.pdf" download>⬇ ملصقات الطلاب</a></div></div>`;

// 3. workshops hub
const stories = STORIES.map((s, i) => `<article class="stc"><div class="stc-art">${i === 1 ? hamad(s.mouth) : salem(s.mouth)}</div><div><h4>${s.title}</h4>${s.text.map(p => `<p>${p}</p>`).join('')}<details><summary>أسئلة للنقاش</summary><ol>${s.qs.map(q => `<li>${q}</li>`).join('')}</ol></details></div></article>`).join('');
const exp = `<article class="exp"><h4>🧪 ${EXPERIMENT.title}</h4><p>${EXPERIMENT.idea}</p><div class="exp-cols"><div><b>تحتاج:</b><ul>${EXPERIMENT.tools.map(x => `<li>${x}</li>`).join('')}</ul></div><div><b>الخطوات:</b><ol>${EXPERIMENT.steps.map(x => `<li>${x}</li>`).join('')}</ol></div></div>
<div class="eggs" aria-hidden="true"><div class="egg"><span class="shell"></span><small>ماء</small></div><div class="egg vin"><span class="shell"></span><small>خل</small></div><div class="egg vin paste"><span class="shell"></span><small>معجون ثم خل</small></div></div>
<p class="fact"><b>النتيجة المتوقعة:</b> ${EXPERIMENT.result}</p><p class="safe">⚠️ ${EXPERIMENT.safety}</p><details><summary>أسئلة للنقاش</summary><ol>${EXPERIMENT.qs.map(q => `<li>${q}</li>`).join('')}</ol></details></article>`;
const teacher = `<div class="tg"><div class="tg-list">${decks.map((d, i) => `<a class="dlc" href="assets/sessions/session-${i + 1}.pdf" download><b>${SESSION_NAMES[i + 1].split(' (')[0]}</b><span>العرض التقديمي (PDF)</span></a>`).join('')}
<a class="dlc hl" href="assets/sessions/facilitator-booklet.pdf" download><b>دليل الجلسات التوعوية</b><span>الأهداف والأنشطة وخطة كل جلسة</span></a>
<a class="dlc hl" href="assets/sessions/activities-guide.pdf" download><b>دليل الأنشطة الإضافية</b><span>6 أنشطة جماعية جاهزة</span></a>
<a class="dlc" href="assets/sessions/extra-slides.pdf" download><b>شرائح إضافية</b><span>13 شريحة تُضاف للعروض</span></a></div>
<div class="tg-table"><table><thead><tr><th>النشاط</th><th>الجلسة</th><th>المدة</th><th>الهدف</th></tr></thead><tbody>${TOPICS.map(t => `<tr><td>${ACT[t.slug].name}</td><td>${ACT[t.slug].sessions.join(' و')}</td><td>${ACT[t.slug].time}</td><td>${ACT[t.slug].goal}</td></tr>`).join('')}</tbody></table></div></div>`;

// 4. mouth map + FAQ
function mouthMap() {
  const teeth = [];
  const types = ['incisor', 'incisor', 'canine', 'premolar', 'premolar', 'molar', 'molar'];
  const W = { incisor: 26, canine: 26, premolar: 30, molar: 38 };
  for (const arch of ['up', 'down']) for (const side of [-1, 1]) types.forEach((ty, i) => {
    const a = (i + 0.5) / 7.4 * (Math.PI / 2) * 0.98;
    const x = 200 + side * Math.sin(a) * 150, y = arch === 'up' ? 190 - Math.cos(a) * 150 : 230 + Math.cos(a) * 150;
    const rot = side * a * 180 / Math.PI * (arch === 'up' ? 1 : -1);
    const w = W[ty], h = ty === 'molar' ? 34 : 30;
    teeth.push(`<rect class="mt t-${ty}" data-part="${ty}" x="${(x - w / 2).toFixed(1)}" y="${(y - h / 2).toFixed(1)}" width="${w}" height="${h}" rx="9" transform="rotate(${rot.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})" tabindex="0" role="button" aria-label="${MOUTH[ty].name}"/>`);
  });
  return `<svg viewBox="0 0 400 420" class="mmap" role="group" aria-label="خريطة الفم">
  <path class="mp gum" data-part="gum" tabindex="0" role="button" aria-label="${MOUTH.gum.name}" d="M200,20 C330,20 375,110 370,200 L330,200 C330,120 290,60 200,60 C110,60 70,120 70,200 L30,200 C25,110 70,20 200,20 Z M200,400 C330,400 375,310 370,220 L330,220 C330,300 290,360 200,360 C110,360 70,300 70,220 L30,220 C25,310 70,400 200,400 Z"/>
  <path class="mp tongue" data-part="tongue" tabindex="0" role="button" aria-label="${MOUTH.tongue.name}" d="M130,250 C130,200 270,200 270,250 C270,320 230,340 200,340 C170,340 130,320 130,250 Z"/><path d="M200,225 L200,300" stroke="#b63d5a" stroke-width="3" pointer-events="none"/>
  ${teeth.join('')}<text x="200" y="207" text-anchor="middle" class="mm-l">اضغط على أي جزء</text></svg>`;
}
const legend = ['incisor', 'canine', 'premolar', 'molar', 'gum', 'tongue'].map(k => `<button class="lg" data-part="${k}"><i class="sw sw-${k}"></i>${MOUTH[k].name}</button>`).join('');
const sMap = `<div class="mm"><div class="mm-art">${mouthMap()}<div class="mm-leg">${legend}</div></div><div class="mm-info" id="mmInfo" aria-live="polite"><div class="mm-empty">${sinnoon('grin')}<p>اختر جزءاً من الفم لتعرف وظيفته وكيف تعتني به وما المشكلات التي قد تصيبه.</p></div></div></div>`;
const sFaq = `<div class="faq">${FAQ.map(([q, a, who]) => `<details><summary><span class="who">${who}</span>${q}</summary><p>${a}</p></details>`).join('')}</div><p class="note">هذه إجابات توعوية عامة، ولا تغني عن زيارة طبيب الأسنان عند وجود ألم أو مشكلة.</p>`;

// 5. tracker + certificate
const ch = T.chart;
const TT = `<svg viewBox="-62 -92 124 180" aria-hidden="true">${A.tooth({ mouth: 'smile' })}</svg>`;
const sTrack = `<p class="hint">اضغط على السن مرة ليصبح أخضر (فرّشت)، ومرة ثانية ليصبح أحمر (نسيت). يُحفظ تقدّمك على هذا الجهاز فقط.</p>
<div class="weeks">${[0, 1, 2, 3].map(w => `<div class="wk"><h4>الأسبوع ${['الأول', 'الثاني', 'الثالث', 'الرابع'][w]}</h4><div class="wrow wh"><span></span><span>☀️ صباحاً</span><span>🌙 مساءً</span></div>${ch.days.map((d, i) => `<div class="wrow"><span>${d}</span>${[0, 1].map(c => `<button class="tc" data-k="${w}-${i}-${c}" aria-label="${d} ${c ? 'مساءً' : 'صباحاً'}، الأسبوع ${w + 1}">${TT}</button>`).join('')}</div>`).join('')}</div>`).join('')}</div>
<div class="chart-sum"><span><b id="chG">0</b> سن أخضر · <b id="chR">0</b> سن أحمر من 56</span><button class="btn ghost" id="chReset">مسح الجدول</button><a class="btn ghost" href="assets/chart/poster.pdf" download>⬇ الجدول الورقي للطباعة</a></div>
<div class="cert-box"><div class="cert-form"><h3>🏅 شهادة بطل الأسنان النظيفة</h3><p>اكتب اسمك وصفّك، وستُكتب الشهادة بعدد الأسنان الخضراء التي جمعتها.</p>
<label for="cName">اسم الطالب</label><input id="cName" maxlength="40" placeholder="مثال: سالم بن محمد">
<label for="cGrade">الصف</label><select id="cGrade"><option>الخامس</option><option selected>السادس</option><option>السابع</option></select>
<label for="cSchool">المدرسة (اختياري)</label><input id="cSchool" maxlength="50">
<div class="cert-btns"><button class="btn" id="cMake">أنشئ الشهادة</button><a class="btn ghost" id="cDl" download="شهادة-بطل-الأسنان.png" hidden>⬇ تنزيل الصورة</a><button class="btn ghost" id="cPrint" hidden>🖨 طباعة</button></div></div>
<div class="cert-prev"><canvas id="cCanvas" width="1600" height="1131" aria-label="معاينة الشهادة"></canvas></div></div>`;

const NAV = [['games', '🎮 الاختبارات والألعاب'], ['library', '📚 المكتبة الرقمية'], ['workshops', '🧑‍🏫 الجلسات والورش'], ['mouth', '🦷 خريطة الفم والأسئلة'], ['tracker', '🏆 التحديات والعادات']];
const part = (id, n, title, sub, inner, cls = '') => `<section class="part ${cls}" id="${id}"><div class="part-h"><span class="pn">${n}</span><div><h2>${title}</h2><p>${sub}</p></div></div>${inner}</section>`;

const DATA = {
  quiz: QUIZ, foods: FOODS.map(f => ({ ...f, svg: foodSvg(f.k) })), mouth: MOUTH,
  myths: my.myths.map(([k, m, f]) => ({ ic: ico(k), q: m, f })),
  brush: br.items.map(([k, h, p]) => ({ ic: ico(k), h, p })),
  pairs: PAIRS, order: inj.items.map(([k, h, p]) => ({ ic: ico(k), h, p })),
  salem: `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-110 -380 220 400" width="440" height="800">${A.boy({ mouth: 'grin', r: wave })}</svg>`).toString('base64')}`,
  tooth: `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200" width="400" height="400">${A.tooth({ mouth: 'grin', sparkle: true, arms: [[[-46, -6], [-80, -40]], [[46, -6], [80, -40]]], feet: true })}</svg>`).toString('base64')}`,
  credit: CREDIT,
};

const page = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ابتسامتي صحتي</title><meta name="description" content="صفحة توعية تفاعلية بصحة الفم والأسنان للطلاب والمعلمين والأسر">
<meta property="og:title" content="ابتسامتي صحتي"><meta property="og:description" content="ألعاب واختبارات ومكتبة توعوية عن صحة الفم والأسنان"><meta property="og:image" content="assets/habits/infographic.png">
<link rel="stylesheet" href="assets/style.css"></head><body>
<a class="skip" href="#games">انتقل إلى المحتوى</a>
<div class="lh"><img src="assets/letterhead.jpg" alt="وزارة الصحة · المديرية العامة للخدمات الصحية بمحافظة الظاهرة"></div>
<header class="hero"><div class="hero-t"><span class="kick">قسم تعزيز الصحة · برنامج الصحة المدرسية والجامعية</span><h1>ابتسامتي صحتي</h1><p>تعلّم مع سالم وحمد وصديقهما سنّون كيف تحمي أسنانك: العب، واختبر نفسك، وتابع عاداتك، وحمّل الملصقات والفيديوهات.</p>
<div class="aud"><span>👦 للطلاب: الألعاب والتحديات والقصص</span><span>🧑‍🏫 للمعلمين والممرضين: العروض والأدلة</span><span>👨‍👩‍👦 للأسر: الأسئلة الشائعة والجدول المنزلي</span></div></div>
<div class="hero-art"><span class="h-h">${hamad()}</span><span class="h-t">${sinnoon()}</span><span class="h-s">${salem()}</span></div></header>
<nav class="toc" aria-label="أقسام الصفحة">${NAV.map(([a, b]) => `<a href="#${a}">${b}</a>`).join('')}</nav>
<main>
${part('games', '1', 'الاختبارات والألعاب التفاعلية', 'اختبر عاداتك، والعب، وتعلّم بالتجربة', sQuiz + sFood + sGerm + sBrush + sMyth + sMatch + sOrder)}
${part('library', '2', 'المكتبة الرقمية والوسائط', 'إنفوجرافيك وفيديوهات موشن جرافيك وملصقات جاهزة للطباعة بالترويسة الرسمية', sLib, 'lib')}
${part('workshops', '3', 'دليل الجلسات التوعوية والورش', 'محتوى للطلاب من الصف الخامس إلى السابع، وأدوات جاهزة للمعلم والممرض المدرسي', `<h3 class="ph3">🎒 حقيبة الطالب</h3><div class="stories">${stories}</div>${exp}<h3 class="ph3">🧑‍🏫 دليل المعلم والممرض المدرسي</h3>${teacher}`, 'ws')}
${part('mouth', '4', 'خريطة الفم والأسئلة الشائعة', 'اكتشف أجزاء فمك، واقرأ إجابات مبسّطة عن أكثر الأسئلة تكراراً', sMap + `<h3 class="ph3">❓ اسأل الطبيب: الأسئلة الشائعة</h3>` + sFaq, 'mo')}
${part('tracker', '5', 'التحديات وحساب العادات', 'تحدّي 28 يوماً للتفريش صباحاً ومساءً، ثم شهادتك', sTrack, 'tr')}
</main>
<footer><p>${CREDIT}</p><p class="sm">برنامج تعزيز صحة الفم والأسنان في المجتمع المدرسي · نوفمبر 2026 · بعض المحتوى مقتبس بتصرّف من مواد توعوية لوزارة الصحة العامة بدولة قطر</p></footer>
<script>window.DATA=${JSON.stringify(DATA)}</script><script src="assets/app.js"></script></body></html>`;
fs.writeFileSync(`${SITE}/index.html`, page);
cp(`${HERE}/site-style.css`, `${SITE}/assets/style.css`);
cp(`${HERE}/site-app.js`, `${SITE}/assets/app.js`);
fs.writeFileSync(`${SITE}/.nojekyll`, '');
console.log('site ok');
