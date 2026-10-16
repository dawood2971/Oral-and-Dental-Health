import * as A from './art.mjs';
import { render, doc, LOGO, CREDIT } from './render.mjs';
const { g, S, INK, f } = A;
A.setMode('color');

const css = `
.poster{background:var(--bg)}
.lh{position:absolute;top:0;left:0;right:0;height:22mm;background:#fff;display:flex;align-items:center;justify-content:center}.lh img{height:16mm}
.hd{position:absolute;top:22mm;left:0;right:0;height:38mm;border-top:1.2mm solid #1d1d1f;background:var(--c1);border-bottom:1.2mm solid ${INK};border-radius:0 0 14mm 14mm;color:#fff;text-align:center;padding-top:4mm}
.hd h1{font-family:Lalezar,Tajawal;font-weight:400;font-size:38pt;line-height:1.1;-webkit-text-stroke:.9mm ${INK};paint-order:stroke fill}
.hd p{font-family:Cairo,Tajawal;font-weight:800;font-size:15pt;margin-top:2mm;color:#fff;text-shadow:0 .4mm 0 rgba(0,0,0,.25)}
.ft{position:absolute;bottom:0;left:0;right:0;height:15mm;flex-direction:column;gap:0!important;line-height:1.35;background:${INK};color:#fff;font-family:Cairo,Tajawal;font-weight:700;font-size:10pt;display:flex;align-items:center;justify-content:center;gap:4mm}
.body{position:absolute;top:65mm;bottom:21mm;left:11mm;right:11mm;display:flex;flex-direction:column;gap:5mm}.grow{flex:1}.body>*{margin-top:0!important}
.card{background:#fff;border:.8mm solid ${INK};border-radius:6mm;box-shadow:1.2mm 1.2mm 0 ${INK};padding:3mm 4mm;display:flex;align-items:center;gap:3mm}
.card .n{flex:none;width:12mm;height:12mm;border-radius:50%;background:var(--c1);color:#fff;border:.6mm solid ${INK};font-family:Cairo,Tajawal;font-weight:900;font-size:16pt;display:flex;align-items:center;justify-content:center}
.card h3{font-family:Cairo,Tajawal;font-weight:900;font-size:16.5pt;line-height:1.3}
.card p{font-weight:700;font-size:13pt;line-height:1.45;color:#333}
.vcard{flex-direction:column;justify-content:center;text-align:center;position:relative;gap:1mm}.vcard .n{position:absolute;top:3mm;right:3mm}
.grid2{display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:1fr;gap:5mm}
.pill{display:inline-block;background:var(--c2);border:.6mm solid ${INK};border-radius:20mm;padding:1.5mm 5mm;font-family:Cairo,Tajawal;font-weight:800;font-size:13pt}
.box{background:#fff;border:.8mm solid ${INK};border-radius:6mm;padding:4mm 6mm}
.box h2{font-family:Cairo,Tajawal;font-weight:900;font-size:17pt;margin-bottom:2mm;color:var(--c3)}
.box ul{list-style:none}
.box li{font-weight:700;font-size:14pt;line-height:1.6;padding-right:7mm;position:relative}
.box li:before{content:"";position:absolute;right:0;top:2.6mm;width:3.6mm;height:3.6mm;border-radius:50%;background:var(--c1);border:.4mm solid ${INK}}
.arrow{text-align:center;font-size:13pt;line-height:1;color:${INK};font-weight:900}
.src{font-size:8.5pt;font-weight:400}
.inj li{font-size:12.8pt;line-height:1.5}
`;
const ico = (inner, vb = '-100 -100 200 200', w = 30, h = w) => `<svg viewBox="${vb}" style="flex:none;width:${w}mm;height:${h}mm">${inner}</svg>`;
const foot = src => `<div class="ft"><span>${CREDIT}</span><span class="src">برنامج تعزيز صحة الفم والأسنان في المجتمع المدرسي · نوفمبر 2026${src ? ` · المصدر: ${src}` : ''}</span></div>`;
const poster = (vars, title, sub, body, src) => `<div class="page poster" style="${vars}"><div class="lh"><img src="${LOGO}"></div><div class="hd"><h1>${title}</h1><p>${sub}</p></div><div class="body">${body}</div>${foot(src)}</div>`;

// mini diagram: three teeth on a gum line, local box -100..100
function teethRow(extra = '') {
  let s = `<rect x="-96" y="20" width="192" height="60" rx="26" fill="${f('gum')}" ${S(4)}/>`;
  for (const x of [-60, 0, 60]) s += `<path d="M${x - 27},38 L${x - 30},-30 Q${x - 28},-56 ${x},-54 Q${x + 28},-56 ${x + 30},-30 L${x + 27},38 Z" fill="#fff" ${S(4)}/>`;
  return s + extra;
}
const circArrow = (x, y, r) => `<path d="M${x + r},${y} A${r},${r} 0 1,1 ${x},${y - r}" fill="none" stroke="${A.PAL.red}" stroke-width="7" stroke-linecap="round"/><path d="M${x - 10},${y - r - 10} L${x + 6},${y - r} L${x - 10},${y - r + 12}" fill="none" stroke="${A.PAL.red}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
const dblArrow = (x1, x2, y) => `<path d="M${x1},${y} L${x2},${y} M${x1 + 14},${y - 12} L${x1},${y} L${x1 + 14},${y + 12} M${x2 - 14},${y - 12} L${x2},${y} L${x2 - 14},${y + 12}" fill="none" stroke="${A.PAL.red}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;

function pBrushing() {
  const steps = [
    ['ضع المعجون', 'كمية مناسبة من معجون يحتوي على الفلورايد على فرشاة ناعمة.', g(-90, 30, 0.8, A.toothbrush({ paste: true }))],
    ['ميّل الفرشاة نحو اللثة', 'ضع الفرشاة بزاوية 45° على خط التقاء السن باللثة.', teethRow(g(-10, -20, 0.55, A.toothbrush(), -45))],
    ['حركات دائرية صغيرة', 'نظّف الأسطح الخارجية بلطف، سنّاً سنّاً، دون ضغط قوي.', teethRow(circArrow(0, -10, 34))],
    ['الأسطح الداخلية', 'نظّف الأسطح الداخلية للأسنان العلوية والسفلية.', teethRow(g(30, -70, 0.5, A.toothbrush(), 100))],
    ['أسطح المضغ', 'حرّك الفرشاة ذهاباً وإياباً على أسطح المضغ.', teethRow(dblArrow(-80, 80, -80))],
    ['نظّف لسانك', 'نظّف اللسان بلطف لإزالة البكتيريا ورائحة الفم.', `<path d="M-60,-40 Q-60,80 0,80 Q60,80 60,-40 Z" fill="#f78fa7" ${S(5)}/><path d="M0,-30 L0,40" ${S(4)}/>` + A.sparkle(70, -60, 22)],
  ];
  const cards = steps.map(([h, p, art], i) => `<div class="card vcard"><div class="n">${i + 1}</div>${ico(art, '-110 -110 220 220', 30, 24)}<div><h3>${h}</h3><p>${p}</p></div></div>`).join('');
  const body = `<div class="grid2 grow">${cards}</div>
  <div style="display:flex;gap:4mm">
    <div class="box" style="flex:1;text-align:center;padding:3mm">${ico(A.sun(-60, 0, 0.8) + A.moon(60, 0, 0.9), '-120 -70 240 140', 30, 16)}<h2 style="margin:1mm 0 0">مرتين يومياً</h2><b>بعد الإفطار وقبل النوم</b></div>
    <div class="box" style="flex:1;text-align:center;padding:3mm">${ico(A.clock(2), '-80 -80 160 160', 16)}<h2 style="margin:1mm 0 0">دقيقتان كاملتان</h2><b>في كل مرة</b></div>
    <div class="box" style="flex:1;text-align:center;padding:3mm">${ico(g(-110, 0, 1, A.toothbrush()), '-120 -60 240 120', 30, 16)}<h2 style="margin:1mm 0 0">فرشاة جديدة</h2><b>كل 3 أشهر</b></div>
  </div>`;
  return poster('--bg:#e7f6fb;--c1:#1f8fbf;--c2:#bfe9ff;--c3:#1f6fb2', 'خطوات التفريش الصحيح', 'ابتسامتك تبدأ من فرشاتك', body, 'دليل صحة الفم والأسنان (Public Health England)');
}

function pCaries() {
  const steps = [
    ['بقايا الطعام والسكريات', 'تبقى على الأسنان بعد الأكل إذا لم ننظّفها.', A.tooth({ mouth: 'grin' }) + g(64, 50, 0.6, A.candy(), -20)],
    ['البكتيريا تتغذى عليها', 'تتفاعل بكتيريا الفم مع بقايا الطعام وتكوّن طبقة لزجة تسمى «البلاك».', A.tooth({ mouth: 'o' }) + g(-62, -60, 0.5, A.germ()) + g(64, 40, 0.42, A.germ())],
    ['البلاك يُنتج أحماضاً', 'الأحماض تُسبّب تآكل سطح السن (المينا).', A.tooth({ mouth: 'sad', sad: false }) + [[-60, -70], [62, -40], [-70, 30]].map(([x, y]) => `<path d="M${x},${y - 16} Q${x + 12},${y} ${x},${y + 8} Q${x - 12},${y} ${x},${y - 16} Z" fill="#ffd23f" ${S(3)}/>`).join('')],
    ['تسوّس الأسنان', 'يظهر التسوس ويسبب الألم، وقد يصل إلى التهاب اللثة.', A.tooth({ sad: true, cavity: true })],
  ];
  const chain = steps.map(([h, p, art], i) => `<div class="card" style="--c1:${['#f4a261', '#7bc96f', '#ffb703', '#e63946'][i]}"><div class="n">${i + 1}</div>${ico(art, '-100 -100 200 200', 25)}<div><h3>${h}</h3><p>${p}</p></div></div>${i < 3 ? '<div class="arrow">▼</div>' : ''}`).join('');
  const body = `<div class="grow" style="display:flex;gap:5mm"><div style="flex:1.35;display:flex;flex-direction:column;justify-content:space-between">${chain}</div>
  <div style="flex:1;display:flex;flex-direction:column;gap:5mm">
   <div class="box grow"><h2>علامات التسوس</h2><ul><li>بقع بيضاء تصبح أغمق مع الوقت</li><li>ألم في الأسنان</li><li>حساسية من الحلويات والساخن والبارد</li><li>ألم عند المضغ</li><li>رائحة فم كريهة</li></ul></div>
   <div class="box"><h2>علامات مشاكل اللثة</h2><ul><li>تورّم اللثة واحمرارها</li><li>نزيف عند التفريش أو الأكل</li></ul></div>
  </div></div>
  <div class="box" style="margin-top:5mm;display:flex;align-items:center;gap:4mm;background:#eafaf1">${ico(A.tooth({ sparkle: true, arms: true }), '-110 -100 220 200', 26)}<div><h2>الخبر السار: التسوس يمكن الوقاية منه!</h2><b style="font-size:12pt">فرّش أسنانك مرتين يومياً بمعجون فيه فلورايد، وقلّل السكريات، وزُر طبيب الأسنان كل 6 أشهر.</b></div></div>`;
  return poster('--bg:#fff6ea;--c1:#e76f51;--c2:#ffd6c2;--c3:#c4462a', 'كيف يبدأ تسوّس الأسنان؟', 'أربع خطوات صغيرة.. نستطيع إيقافها', body, 'دليل صحة الفم والأسنان');
}

function pFood() {
  const good = [[A.apple, 'التفاح والفواكه'], [A.carrot, 'الجزر والخضروات'], [A.cheese, 'الأجبان'], [A.yogurt, 'الزبادي'], [A.laban, 'الحليب'], [A.waterBottle, 'الماء']];
  const bad = [[A.candy, 'الحلويات'], [A.soda, 'المشروبات الغازية'], [A.lollipop, 'المصاصات'], [A.donut, 'الكعك المحلّى'], [A.chips, 'رقائق البطاطس'], [() => A.cup('brush2'), 'العصائر المحلّاة']];
  const tile = ([fn, t]) => `<div style="background:#fff;border:.6mm solid ${INK};border-radius:5mm;padding:2mm;text-align:center">${ico(fn(), '-90 -90 180 180', 22)}<div style="font-family:Cairo,Tajawal;font-weight:800;font-size:13pt">${t}</div></div>`;
  const col = (title, items, c, mark) => `<div style="flex:1;background:${c};border:.8mm solid ${INK};border-radius:7mm;padding:4mm"><div style="display:flex;align-items:center;gap:3mm;justify-content:center;margin-bottom:3mm">${ico(mark, '-50 -50 100 100', 12)}<h2 style="font-family:Cairo,Tajawal;font-weight:900;font-size:19pt">${title}</h2></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:4mm">${items.map(tile).join('')}</div></div>`;
  const body = `<div class="grow" style="display:flex;gap:5mm">${col('أكثِر منها', good, '#dff5e6', A.check(0, 0, 1))}${col('قلّل منها', bad, '#ffe3e3', A.cross(0, 0, 1))}</div>
  <div style="display:flex;align-items:center;gap:4mm;margin-top:5mm">
   ${ico(g(0, 190, 0.95, A.friend({ r: [[60, -206], [100, -250], [96, -300]] })) + g(96, -110, 0.7, A.apple()), '-120 -200 240 400', 36, 60)}
   <div class="box" style="flex:1"><h2>تذكّر</h2><ul><li>اختر وجبات خفيفة صحية: الفواكه الطازجة والخضروات والزبادي والأجبان.</li><li>السكريات تغذي البكتيريا التي تسبب التسوس.</li><li>إذا أكلت حلوى فاجعلها مع الوجبة، ثم نظّف أسنانك.</li></ul></div>
  </div>`;
  return poster('--bg:#f3fbef;--c1:#43aa8b;--c2:#c7f0d8;--c3:#2a7f62', 'غذاء صحي = أسنان قوية', 'ما تأكله اليوم يظهر في ابتسامتك غداً', body, 'دليل صحة الفم والأسنان');
}

function pTips() {
  const tips = [
    ['فرّش مرتين يومياً', 'لمدة دقيقتين بفرشاة ناعمة ومعجون فيه فلورايد.', g(-100, 30, 0.9, A.toothbrush({ paste: true }))],
    ['استخدم الخيط', 'مرة واحدة في اليوم لتنظيف ما بين الأسنان.', g(0, 0, 1.6, A.floss())],
    ['غيّر فرشاتك', 'كل 3 أشهر، أو عندما تتفرّق شعيراتها.', g(0, 0, 0.9, A.hourglass())],
    ['زُر طبيب الأسنان', 'كل 6 أشهر للفحص الدوري.', `<rect x="-70" y="-70" width="140" height="140" rx="16" fill="#fff" ${S(6)}/><rect x="-70" y="-70" width="140" height="40" rx="16" fill="${A.PAL.red}" ${S(6)}/><text x="0" y="50" text-anchor="middle" font-family="Cairo, Tajawal" font-weight="900" font-size="80">6</text>`],
    ['قلّل السكريات', 'الحلويات والمشروبات الغازية تسبب التسوس.', A.cross(0, 0, 0.6) + g(-30, 30, 0.8, A.candy())],
    ['اختر وجبات صحية', 'فواكه طازجة، خضروات، زبادي، أجبان.', g(-30, 10, 1, A.apple()) + g(50, 20, 0.8, A.carrot(), 20)],
    ['اشرب الماء', 'الماء أفضل مشروب لأسنانك وجسمك.', g(0, 0, 1.1, A.waterBottle())],
    ['ابتعد عن التدخين', 'التبغ يضر الفم واللثة ويسبب رائحة كريهة.', `<rect x="-80" y="-12" width="150" height="24" rx="4" fill="#fff" ${S(5)}/><rect x="40" y="-12" width="30" height="24" fill="#f4a261" ${S(5)}/><circle r="80" fill="none" stroke="${A.PAL.red}" stroke-width="14"/><path d="M-56,-56 L56,56" stroke="${A.PAL.red}" stroke-width="14"/>`],
  ];
  const cards = tips.map(([h, p, art], i) => `<div class="card vcard"><div class="n">${i + 1}</div>${ico(art, '-100 -100 200 200', 26, 21)}<div><h3>${h}</h3><p>${p}</p></div></div>`).join('');
  const body = `<div class="grid2 grow">${cards}</div>`;
  return poster('--bg:#fff9e6;--c1:#f4a300;--c2:#ffe7a3;--c3:#b26b00', '8 نصائح لابتسامة صحية', 'معظم أمراض الفم يمكن الوقاية منها بخطوات بسيطة', body, 'دليل صحة الفم والأسنان');
}

function pInjury() {
  const causes = [['السقوط', '🤕'], ['الأنشطة الرياضية', ''], ['المصارعة والتحديات', ''], ['التنمّر', ''], ['وضع أدوات في الفم', ''], ['حوادث السير', '']];
  const body = `<div class="box" style="margin-bottom:5mm"><h2>من أسباب إصابات الأسنان</h2><div style="display:flex;flex-wrap:wrap;gap:2.5mm">${causes.map(([c]) => `<span class="pill">${c}</span>`).join('')}</div></div>
  <div class="grow" style="display:flex;gap:5mm">
   <div class="box inj" style="flex:1"><h2>كيف أحمي أسناني؟</h2><ul>
    <li>أفرّش أسناني مرتين يومياً بالفرشاة والمعجون.</li>
    <li>أبتعد عن العادات السيئة مثل مصّ الإصبع.</li>
    <li>لا أضع الألعاب والأقلام في فمي.</li>
    <li>ألبس <b>واقي الأسنان</b> في الرياضات الجماعية.</li>
    <li>أزور طبيب الأسنان بشكل دوري.</li>
    <li>لا أهمل أي إصابة وأتابعها مع الطبيب.</li></ul></div>
   <div class="box inj" style="flex:1;background:#fff3f3"><h2>إذا تعرّضتُ لإصابة</h2><ul>
    <li>أبقى هادئاً وأخبر المعلم أو أحد أفراد أسرتي فوراً.</li>
    <li>يُفحص الفم للبحث عن جروح في الخد واللسان والشفة.</li>
    <li>يُتأكد من عدم وجود كسر في الأسنان.</li>
    <li>للجروح البسيطة: الضغط بقطعة شاش نظيفة لمدة <b>10 دقائق</b> ومراقبة النزيف.</li>
    <li>مراجعة الطبيب مباشرة إذا لم يتوقف النزيف أو انكسر السن أو سقط من مكانه.</li></ul></div>
  </div>
  <div style="display:flex;align-items:flex-end;gap:5mm;margin-top:4mm">${ico(g(0, 190, 0.92, A.boy({ r: [[60, -212], [110, -250], [130, -300]], mouth: 'grin' })) + g(132, -126, 0.7, A.mouthguard()), '-130 -210 270 410', 34, 52)}
   <div class="box" style="flex:1;background:#eef7ff"><h2>واقي الأسنان</h2><b style="font-size:13pt">غطاء يحمي الأسنان أثناء كرة القدم والرياضات الجماعية. اسأل طبيب الأسنان عن المناسب لك.</b></div></div>`;
  return poster('--bg:#eef4ff;--c1:#3a6ea5;--c2:#d6e6ff;--c3:#24508a', 'احمِ أسنانك من الإصابات', 'الأطفال والإصابات في الأسنان والأنسجة المحيطة بها', body, 'وزارة الصحة – سلطنة عُمان');
}

function pAmbassadors() {
  const grade = g => `<div class="box" style="flex:1;text-align:center;padding:3mm"><h2 style="text-align:center">الصف ${g}</h2>${[1, 2, 3].map(() => `<div style="display:flex;align-items:center;gap:2mm;margin:3mm 0">${ico(A.star5(0, 0, 40, 'star', 5), '-50 -50 100 100', 8)}<div style="flex:1;border-bottom:.5mm dashed ${INK};height:11mm"></div></div>`).join('')}</div>`;
  const sash = `<path d="M-52,-226 L-30,-232 L66,-60 L52,-46 Z" fill="${A.PAL.red}" ${S(3)}/>`;
  const body = `<div style="display:flex;justify-content:center;align-items:flex-end;gap:6mm">${ico(g(0, 190, 0.95, A.boy({ r: [[60, -212], [104, -262], [114, -330]] }) + sash), '-120 -210 240 410', 46, 78)}
   <div style="text-align:center;margin-bottom:6mm">${ico(A.tooth({ sparkle: true, arms: [[[-46, -6], [-80, -40]], [[46, -6], [80, -40]]], feet: true }), '-110 -100 220 200', 50, 46)}<div class="pill" style="font-size:20pt;margin-top:2mm">اسألني عن أسنانك!</div></div>
   ${ico(g(0, 190, 0.95, A.friend({ l: [[-60, -206], [-104, -256], [-116, -322]] }) + `<path d="M52,-226 L30,-232 L-66,-60 L-52,-46 Z" fill="${A.PAL.red}" ${S(3)}/>`), '-120 -210 240 410', 46, 78)}</div>
   <div class="grow" style="display:flex;gap:4mm;margin-top:4mm">${grade('الخامس')}${grade('السادس')}${grade('السابع')}</div>
   <div class="box" style="margin-top:5mm"><h2>مهام السفير</h2><ul><li>أكون قدوة في تفريش أسناني مرتين يومياً.</li><li>أذكّر زملائي بالعادات الصحية وأوزّع بطاقات التوعية.</li><li>أساعد في الجلسات التوعوية والتدريب على التفريش الصحيح.</li></ul></div>`;
  return poster('--bg:#f6f0ff;--c1:#7b4fd6;--c2:#e3d6ff;--c3:#5a32b0', 'سفراء صحة الفم والأسنان', '9 سفراء · 3 من كل صف · نوفمبر 2026', body, '');
}

const pages = [pBrushing(), pCaries(), pFood(), pTips(), pInjury(), pAmbassadors()];
await render(doc('ملصقات حائط – صحة الفم والأسنان', pages, css), process.argv[2] || 'posters.pdf');
