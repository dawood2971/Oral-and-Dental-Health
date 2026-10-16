import * as A from './art.mjs';
import { render, doc, LOGO, CREDIT } from './render.mjs';
const { g, S, INK, f } = A;

const css = `
.frame{position:absolute;inset:8mm;border:1.1mm solid ${INK};border-radius:9mm}
.frame:after{content:"";position:absolute;inset:1.6mm;border:.4mm dashed ${INK};border-radius:7.5mm}
.ttl{position:absolute;top:15mm;left:14mm;right:14mm;text-align:center;font-family:Lalezar,Tajawal;font-size:40pt;line-height:1.15;color:#fff;-webkit-text-stroke:.75mm ${INK};paint-order:stroke fill;letter-spacing:.3mm}
.sub{position:absolute;top:37mm;left:20mm;right:20mm;text-align:center;font-family:Tajawal;font-weight:700;font-size:15pt}
.art{position:absolute;top:47mm;left:12mm;width:186mm;height:200mm}
.tip{position:absolute;bottom:17mm;left:22mm;right:22mm;border:.7mm solid ${INK};border-radius:6mm;padding:3mm 6mm;font-weight:800;font-size:14.5pt;text-align:center;line-height:1.45;background:#fff}
.tip b{font-family:Cairo,Tajawal;font-weight:900}
.pn{position:absolute;bottom:10.5mm;left:0;right:0;text-align:center;font-family:Cairo,Tajawal;font-weight:700;font-size:10pt}
.cover .ttl{font-size:50pt;top:30mm;color:#ffd23f}
.lhb{position:absolute;top:0;left:0;right:0;height:22mm;background:#fff;border-bottom:.8mm solid ${INK};display:flex;align-items:center;justify-content:center}.lhb img{height:16mm}
table.chart{border-collapse:collapse;width:100%;font-family:Cairo,Tajawal;font-weight:700;font-size:11pt}
table.chart td,table.chart th{border:.5mm solid ${INK};text-align:center;height:11mm;padding:0}
table.chart th{background:#fff;height:10mm}
`;
const lbl = (x, y, t, sz = 70) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Lalezar, Tajawal" font-size="${sz}" fill="${A.isColor() ? '#fff' : '#fff'}" stroke="${INK}" stroke-width="${sz / 13}" paint-order="stroke" stroke-linejoin="round">${t}</text>`;
const ground = (y = 1760) => `<path d="M0,${y} Q475,${y - 40} 950,${y} T1900,${y}" fill="none" ${S(10)}/>` +
  [[160, y - 14], [700, y + 6], [1250, y + 4], [1760, y - 10]].map(([x, yy]) => `<path d="M${x - 30},${yy} L${x - 20},${yy - 50} M${x},${yy} L${x},${yy - 64} M${x + 30},${yy} L${x + 20},${yy - 50}" ${S(9)}/>`).join('');
const bubbles = pts => pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${S(8)}/><path d="M${x - r * .5},${y - r * .1} Q${x - r * .45},${y - r * .5} ${x - r * .1},${y - r * .55}" fill="none" ${S(6)}/>`).join('');
const svg = inner => `<svg class="art" viewBox="0 -110 1900 2000">${inner}</svg>`;
let pn = 0;
const page = (title, art, tip, sub = '') => `<div class="page"><div class="frame"></div><div class="ttl">${title}</div>${sub ? `<div class="sub">${sub}</div>` : ''}${svg(art)}${tip ? `<div class="tip">${tip}</div>` : ''}<div class="pn">${++pn}</div></div>`;

// arms for brushing: right hand up to mouth
const brushArm = [[60, -212], [104, -236], [44, -262]];
const wave = [[60, -212], [104, -262], [114, -330]];

function cover() {
  A.setMode('color');
  const art = `<rect x="0" y="0" width="2100" height="2970" fill="${A.PAL.sky}"/>` +
    `<circle cx="1050" cy="1650" r="820" fill="#fff" opacity=".75"/>` +
    A.sun(1830, 800, 1.5) + A.cloud(330, 820, 1.5) + A.cloud(700, 1000, 0.8) +
    `<path d="M-50,2250 Q525,2140 1050,2230 T2150,2210 L2150,3000 L-50,3000 Z" fill="${A.PAL.grass}" ${S(8)}/>` +
    g(620, 2380, 3.55, A.boy({ r: wave, mouth: 'smile' })) +
    g(1520, 2380, 3.55, A.friend({ l: [[-60, -206], [-100, -150], [-116, -96]], r: [[60, -206], [90, -150], [80, -96]] })) +
    g(1520 - 116 * 3.55, 2380 - 96 * 3.55, 1.5, A.toothbrush({ paste: true }), -120) +
    g(1070, 2120, 3.0, A.tooth({ arms: [[[-46, -6], [-80, -40]], [[46, -6], [80, -40]]], feet: true, sparkle: true })) +
    A.sparkle(240, 1300, 46) + A.sparkle(1880, 1250, 56) + A.sparkle(1900, 1700, 34) + A.heart(220, 1650, 1.5) + A.star5(1070, 1050, 50);
  return `<div class="page cover" style="background:${A.PAL.sky}">
  <svg style="position:absolute;inset:0;width:210mm;height:297mm" viewBox="0 0 2100 2970">${art}</svg>
  <div class="lhb"><img src="${LOGO}"></div>
  <div class="ttl">ابتسامة سالم وحمد</div>
  <div style="position:absolute;top:55mm;left:0;right:0;text-align:center;font-family:Cairo,Tajawal;font-weight:800;font-size:19pt">دفتر تلوين وأنشطة لصحة الفم والأسنان</div>
  <div style="position:absolute;bottom:30mm;left:25mm;right:25mm;background:#fff;border:.8mm solid ${INK};border-radius:6mm;padding:4mm 8mm;font-family:Cairo,Tajawal;font-weight:700;font-size:15pt;line-height:2">
    هدية إلى: ........................................................ &nbsp; الصف: ............
  </div>
  <div style="position:absolute;bottom:9mm;left:0;right:0;text-align:center;font-family:Cairo,Tajawal;font-weight:700;font-size:11pt;line-height:1.5">${CREDIT}<br>برنامج تعزيز صحة الفم والأسنان في المجتمع المدرسي · نوفمبر 2026</div>
  </div>`;
}

function meet() {
  const art = A.sun(200, 230, 1.4) + A.cloud(1650, 200, 1.4) + A.cloud(1250, 330, 0.9) + ground() +
    g(450, 1700, 3.05, A.boy({ r: wave })) + g(1450, 1700, 3.05, A.friend({ l: [[-60, -206], [-104, -256], [-116, -322]] })) +
    g(950, 1420, 2.5, A.tooth({ arms: [[[-46, -6], [-82, -44]], [[46, -6], [82, -44]]], feet: true, sparkle: true })) +
    lbl(450, 1900, 'سالم', 110) + lbl(1450, 1900, 'حمد', 110) + lbl(950, 1150, 'سنّون', 95);
  return page('تعرّف على أصدقائك!', art, 'سالم وحمد وصديقهما <b>سنّون</b> يرافقونك في هذا الدفتر.<br>لوّن الرسومات وتعلّم معهم كيف تحافظ على ابتسامتك.');
}

function brushing() {
  const art = g(620, 560, 2.0, A.mirror(300, 380)) + g(620, 1240, 2.3, A.sink()) +
    g(330, 1180, 1.5, A.cup('brush2')) + g(920, 1130, 1.25, A.pasteTube(), 0) +
    g(1380, 1800, 3.05, A.boy({ r: brushArm, mouth: 'teeth', closed: false })) +
    g(1380 + 44 * 3.05, 1800 - 262 * 3.05, 1.12, A.toothbrush({ paste: false }), 188) +
    bubbles([[1130, 760, 34], [1060, 640, 24], [1180, 560, 18], [1640, 700, 30], [1700, 560, 20], [440, 1100, 18], [800, 1080, 22]]);
  return page('أفرّش أسناني صباحاً ومساءً', art, 'أفرّش أسناني <b>مرتين في اليوم</b>: بعد الإفطار وقبل النوم.');
}

function paste() {
  const art = ground() + g(820, 1720, 3.1, A.friend({ r: [[60, -206], [100, -250], [96, -300]], l: [[-60, -206], [-100, -240], [-110, -290]] })) +
    g(820 + 96 * 3.1, 1720 - 300 * 3.1, 1.35, A.toothbrush({ paste: true }), -75) +
    g(820 - 110 * 3.1, 1720 - 290 * 3.1 - 40, 1.25, A.pasteTube(), 0) +
    g(1560, 1450, 2.6, A.pasteTube()) + A.sparkle(1400, 900, 50) + A.sparkle(1720, 950, 34) + A.sparkle(300, 600, 40) + A.star5(1650, 500, 60);
  return page('معجون يحتوي على الفلورايد', art, 'أختار <b>فرشاة ناعمة</b> و<b>معجوناً فيه فلورايد</b>،<br>والفلورايد يقوّي سطح الأسنان ويحميها من التسوس.');
}

function twoMinutes() {
  const art = A.sun(330, 380, 2.0) + A.moon(1580, 380, 2.4) + A.star5(1740, 230, 34) + A.star5(1400, 220, 26) +
    lbl(330, 640, 'صباحاً', 90) + lbl(1580, 640, 'مساءً', 90) +
    g(950, 880, 3.0, A.hourglass()) + g(950, 1480, 2.5, A.clock(2)) +
    g(360, 1450, 2.8, A.tooth({ arms: [[[-46, -6], [-78, -30]], [[46, -6], [74, -44]]], feet: true, mouth: 'smile' })) +
    g(360 + 74 * 2.8, 1450 - 44 * 2.8, 0.9, A.toothbrush(), -110) +
    g(1560, 1450, 2.8, A.tooth({ arms: [[[-46, -6], [-74, -44]], [[46, -6], [78, -30]]], feet: true, mouth: 'grin' })) +
    g(1560 - 74 * 2.8, 1450 - 44 * 2.8, 0.9, A.toothbrush(), -70) + lbl(950, 1860, 'دقيقتان', 120);
  return page('دقيقتان في كل مرة', art, 'أفرّش أسناني <b>لمدة دقيقتين</b> كاملتين، وأنظّف كل الأسطح:<br>الخارجية والداخلية وأسطح المضغ، ثم لساني.');
}

function healthyFood() {
  const tableY = 1380;
  const art = g(950, 1280, 2.9, A.friend({ r: [[60, -206], [100, -150], [120, -110]], l: [[-60, -206], [-100, -150], [-120, -110]] })) +
    `<rect x="120" y="${tableY}" width="1660" height="70" rx="20" fill="#fff" ${S(10)}/><path d="M220,${tableY + 70} L220,1880 M1680,${tableY + 70} L1680,1880" ${S(14)}/>` +
    g(330, tableY - 70, 1.7, A.apple()) + g(560, tableY - 50, 1.6, A.banana()) + g(780, tableY - 120, 1.5, A.laban()) +
    g(1150, tableY - 60, 1.6, A.cheese()) + g(1380, tableY - 80, 1.6, A.yogurt()) + g(1600, tableY - 100, 1.5, A.carrot(), 20) +
    g(950, tableY - 6, 1.4, A.cucumber()) + A.sparkle(240, 600, 46) + A.sparkle(1680, 560, 40) + A.heart(300, 900, 1.6) + A.heart(1620, 860, 1.4);
  return page('أطعمة صديقة لأسناني', art, 'أختار وجبات خفيفة صحية: <b>الفواكه الطازجة، والخضروات، والزبادي، والأجبان</b>.');
}

function happySad() {
  const art = `<path d="M950,250 L950,1850" stroke="${INK}" stroke-width="8" stroke-dasharray="30 24"/>` +
    g(470, 1050, 3.6, A.tooth({ arms: [[[-46, -6], [-84, -40]], [[46, -6], [84, -40]]], feet: true, sparkle: true })) +
    g(470 - 84 * 3.6, 1050 - 40 * 3.6 - 70, 1.6, A.apple()) + g(470 + 84 * 3.6, 1050 - 40 * 3.6, 1.0, A.toothbrush({ paste: true }), -80) +
    g(1430, 1050, 3.6, A.tooth({ sad: true, cavity: true, arms: [[[-46, -6], [-84, 20]], [[46, -6], [84, 20]]] })) +
    g(1430 - 84 * 3.6, 1050 + 20 * 3.6 + 10, 1.5, A.candy(), -20) + g(1430 + 84 * 3.6, 1050 + 20 * 3.6, 1.2, A.soda()) +
    g(1250, 600, 1.6, A.germ()) + g(1680, 700, 1.3, A.germ()) +
    g(300, 1700, 1.6, A.carrot(), -60) + g(600, 1700, 1.5, A.cheese()) + g(1260, 1700, 1.5, A.donut()) + g(1600, 1680, 1.4, A.lollipop(), 20);
  return page('سنّ سعيد وسنّ حزين', art, 'السكريات تُغذّي البكتيريا فتصنع أحماضاً تُسبّب التسوس.<br><b>أقلّل الحلويات والمشروبات الغازية.</b>');
}

function water() {
  const art = A.sun(1650, 300, 1.6) + ground() +
    g(800, 1700, 3.1, A.boy({ r: [[60, -212], [104, -240], [70, -280]], mouth: 'grin', closed: true })) +
    g(800 + 70 * 3.1 + 40, 1700 - 280 * 3.1 - 30, 1.7, A.waterBottle(), -35) +
    g(1500, 1500, 2.2, A.soda()) + `<path d="M1330,1270 L1670,1730 M1670,1270 L1330,1730" stroke="${INK}" stroke-width="34" stroke-linecap="round"/><path d="M1330,1270 L1670,1730 M1670,1270 L1330,1730" stroke="#fff" stroke-width="18" stroke-linecap="round"/>` +
    A.heart(1300, 700, 1.8) + A.sparkle(260, 800, 50) + bubbles([[1450, 900, 30], [1560, 980, 20], [380, 1100, 26]]);
  return page('الماء أفضل مشروب لأسناني', art, 'أشرب <b>الماء</b> بدلاً من المشروبات الغازية والعصائر المحلّاة.');
}

function flossPage() {
  const L = 520, R = 1380, Y = 1050, k = 4.4;
  const art = g(L, Y, k, A.tooth({ arms: [[[-46, -6], [-80, 20]], [[46, -6], [80, -30]]], feet: true, mouth: 'grin' })) +
    g(R, Y, k, A.tooth({ arms: [[[-46, -6], [-80, -30]], [[46, -6], [80, 20]]], feet: true, mouth: 'smile' })) +
    `<path d="M${L + 80 * k},${Y - 30 * k} Q950,${Y + 120} ${R - 80 * k},${Y - 30 * k}" fill="none" stroke="${INK}" stroke-width="10"/>` +
    g(950, 1660, 3.4, A.floss()) + A.sparkle(950, 380, 70) + A.sparkle(260, 380, 40) + A.sparkle(1640, 360, 48) + A.heart(950, 1300, 1.6);
  return page('خيط الأسنان مرة في اليوم', art, 'الخيط يُزيل بقايا الطعام <b>بين الأسنان</b> حيث لا تصل الفرشاة.');
}

function dentistPage() {
  const cal = `<rect x="1350" y="220" width="420" height="420" rx="30" fill="#fff" ${S(10)}/><rect x="1350" y="220" width="420" height="110" rx="30" fill="#fff" ${S(10)}/>` +
    `<path d="M1440,190 L1440,260 M1680,190 L1680,260" ${S(14)}/>` + lbl(1560, 500, '6', 220) + lbl(1560, 610, 'أشهر', 70);
  const art = cal + ground() +
    g(520, 1720, 3.35, A.dentist({ r: [[60, -206], [100, -200], [130, -230]], mouth: 'grin' })) +
    `<path d="M${520 + 130 * 3.35},${1720 - 230 * 3.35} L${520 + 130 * 3.35 + 150},${1720 - 230 * 3.35 - 120}" ${S(14)}/><circle cx="${520 + 130 * 3.35 + 170}" cy="${1720 - 230 * 3.35 - 136}" r="34" fill="#fff" ${S(10)}/>` +
    g(1320, 1720, 2.75, A.boy({ l: [[-60, -212], [-100, -232], [-120, -270]], mouth: 'teeth' })) + A.sparkle(1100, 820, 40);
  return page('أزور طبيب الأسنان', art, 'أزور طبيب الأسنان <b>كل 6 أشهر</b> للفحص الدوري، حتى لو لم أشعر بألم.');
}

function sportsPage() {
  const art = A.sun(260, 280, 1.5) + A.cloud(1600, 240, 1.3) + ground() +
    g(700, 1700, 3.05, A.boy({ r: [[60, -212], [110, -250], [130, -300]], mouth: 'grin' })) +
    g(700 + 130 * 3.05 + 70, 1700 - 300 * 3.05 - 40, 2.0, A.mouthguard()) +
    g(1150, 1610, 2.0, A.ball()) +
    `<rect x="1320" y="1050" width="420" height="560" rx="30" fill="#fff" ${S(10)}/>` +
    g(1530, 1250, 1.1, `<path d="M-150,0 L150,0" stroke="${INK}" stroke-width="44" stroke-linecap="round"/><path d="M-150,0 L150,0" stroke="#fff" stroke-width="30" stroke-linecap="round"/><path d="M150,-20 L200,0 L150,20 Z" fill="#fff" ${S(8)}/>`, -30) +
    `<path d="M1380,1110 L1680,1550 M1680,1110 L1380,1550" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M1380,1110 L1680,1550 M1680,1110 L1380,1550" stroke="#fff" stroke-width="14" stroke-linecap="round"/>` +
    lbl(1530, 1000, 'ليس في فمي!', 64);
  return page('أحمي أسناني من الإصابات', art, 'ألبس <b>واقي الأسنان</b> في الرياضات الجماعية، ولا أضع <b>الأقلام والألعاب</b> في فمي.');
}

function maze() {
  const C = 11, R = 11, cs = 128, ox = 950 - C * cs / 2, oy = 330;
  const rnd = A.rng(20261103);
  const vis = Array.from({ length: R }, () => Array(C).fill(false));
  const walls = { h: Array.from({ length: R + 1 }, () => Array(C).fill(true)), v: Array.from({ length: R }, () => Array(C + 1).fill(true)) };
  const st = [[0, C - 1]]; vis[0][C - 1] = true;
  while (st.length) {
    const [r, c] = st[st.length - 1];
    const n = [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].filter(([a, b]) => a >= 0 && b >= 0 && a < R && b < C && !vis[a][b]);
    if (!n.length) { st.pop(); continue; }
    const [a, b] = n[Math.floor(rnd() * n.length)];
    if (a !== r) walls.h[Math.max(a, r)][c] = false; else walls.v[r][Math.max(b, c)] = false;
    vis[a][b] = true; st.push([a, b]);
  }
  walls.v[0][C] = false; walls.v[R - 1][0] = false; // entrance right-top, exit left-bottom
  let d = '';
  for (let r = 0; r <= R; r++) for (let c = 0; c < C; c++) if (walls.h[r][c]) d += `M${ox + c * cs},${oy + r * cs} L${ox + (c + 1) * cs},${oy + r * cs} `;
  for (let r = 0; r < R; r++) for (let c = 0; c <= C; c++) if (walls.v[r][c]) d += `M${ox + c * cs},${oy + r * cs} L${ox + c * cs},${oy + (r + 1) * cs} `;
  const art = `<path d="${d}" fill="none" ${S(14)}/>` +
    g(1855, oy + cs / 2 - 20, 0.9, A.toothbrush({ paste: true }), 180) +
    g(ox - 110, oy + (R - 0.5) * cs - 40, 1.5, A.tooth({ sparkle: false, mouth: 'smile' })) +
    lbl(ox + C * cs + 140, oy - 70, 'ابدأ', 80) + lbl(ox - 110, oy + (R - 0.5) * cs - 200, 'النهاية', 70);
  return page('ساعد الفرشاة لتصل إلى سنّون', art, 'ارسم الطريق الصحيح داخل المتاهة، ثم لوّن الفرشاة وسنّون.');
}

function circleFoods() {
  const items = [A.apple, A.candy, A.carrot, A.soda, A.cheese, A.donut, A.banana, A.lollipop, A.yogurt, A.chips, A.cucumber, A.laban];
  let art = '';
  items.forEach((fn, i) => {
    const c = i % 3, r = Math.floor(i / 3), x = 330 + c * 620, y = 380 + r * 420;
    art += `<rect x="${x - 270}" y="${y - 180}" width="540" height="360" rx="40" fill="#fff" ${S(8)}/>` + g(x, y, fn === A.lollipop ? 2.0 : 2.4, fn(), 0);
  });
  return page('ضع دائرة حول الأطعمة المفيدة', art, 'ضع دائرة حول ما يحمي أسنانك، وضع ✗ على ما يضرّها إذا أكثرنا منه.');
}

function chart() {
  const days = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
  const star = `<svg viewBox="-50 -50 100 100" style="width:8mm;height:8mm;display:inline-block;vertical-align:middle">${A.star5(0, 0, 44, 'star', 5)}</svg>`;
  let rows = '';
  for (let w = 1; w <= 4; w++) for (const [lab, ic] of [['صباحاً', A.sun(0, 0, 0.6)], ['مساءً', A.moon(0, 0, 0.75)]])
    rows += `<tr>${lab === 'صباحاً' ? `<th rowspan="2" style="width:22mm">الأسبوع ${w}</th>` : ''}<td style="width:24mm"><svg viewBox="-60 -60 120 120" style="width:8mm;height:8mm;display:inline-block;vertical-align:middle">${ic}</svg> ${lab}</td>${days.map(() => `<td>${star}</td>`).join('')}</tr>`;
  pn++;
  return `<div class="page"><div class="frame"></div><div class="ttl">جدول تفريش أسناني</div><div class="sub">لوّن النجمة في كل مرة تفرش فيها أسنانك خلال شهر نوفمبر</div>
  <div style="position:absolute;top:52mm;left:16mm;right:16mm"><table class="chart"><tr><th colspan="2">اليوم</th>${days.map(d => `<th>${d}</th>`).join('')}</tr>${rows}</table></div>
  <svg style="position:absolute;bottom:42mm;left:0;right:0;margin:auto;width:150mm;height:45mm" viewBox="0 0 1500 450">${g(300, 260, 1.9, A.tooth({ arms: true, feet: true, sparkle: true }))}${g(1200, 260, 1.9, A.tooth({ arms: true, feet: true, mouth: 'grin' }))}${lbl(750, 230, 'عدد نجومي: ......', 80)}</svg>
  <div class="tip">أُغيّر فرشاة أسناني <b>كل 3 أشهر</b>، وأطلب من أسرتي مساعدتي في الالتزام بالجدول.</div><div class="pn">${pn}</div></div>`;
}

function certificate() {
  pn++;
  const art = g(950, 520, 3.4, A.tooth({ arms: [[[-46, -6], [-82, -44]], [[46, -6], [82, -44]]], feet: true, sparkle: true })) +
    `<circle cx="950" cy="520" r="0"/>` + A.star5(380, 400, 90) + A.star5(1520, 400, 90) + A.star5(240, 640, 50) + A.star5(1660, 640, 50);
  return `<div class="page"><div class="frame" style="border-width:1.6mm"></div><img src="${LOGO}" style="position:absolute;top:13mm;left:0;right:0;margin:auto;height:13mm"><div class="ttl" style="font-size:44pt;top:29mm">شهادة بطل الابتسامة</div>
  <svg class="art" viewBox="0 0 1900 1000" style="height:98mm;top:52mm">${art}</svg>
  <div style="position:absolute;top:150mm;left:24mm;right:24mm;text-align:center;font-family:Cairo,Tajawal;font-weight:700;font-size:16pt;line-height:2.1">
  تُمنح هذه الشهادة إلى الطالب<br>....................................................................<br>
  الصف: ............ &nbsp;&nbsp; لالتزامه بتفريش أسنانه مرتين يومياً<br>وتطبيق عادات تحمي ابتسامته خلال شهر نوفمبر 2026</div>
  <div style="position:absolute;bottom:34mm;left:24mm;right:24mm;display:flex;justify-content:space-between;font-family:Cairo,Tajawal;font-weight:700;font-size:13pt;text-align:center">
  <div>سفير صحة الفم والأسنان<br><br>..............................</div><div>إدارة المدرسة<br><br>..............................</div></div>
  <div style="position:absolute;bottom:15mm;left:20mm;right:20mm;text-align:center;font-size:8.5pt;line-height:1.5">مصادر المعلومات: وزارة الصحة – سلطنة عُمان (مطوية الأطفال وإصابات الأسنان والأنسجة المحيطة بها)، ودليل صحة الفم والأسنان (مصادر Public Health England وNHS). رسومات أصلية أُعدّت للبرنامج.<br>${CREDIT}</div>
  <div class="pn">${pn}</div></div>`;
}

const pages = [cover()];
A.setMode('line');
pages.push(meet(), brushing(), paste(), twoMinutes(), healthyFood(), happySad(), water(), flossPage(), dentistPage(), sportsPage(), maze(), circleFoods(), chart(), certificate());
await render(doc('دفتر تلوين – ابتسامة سالم وحمد', pages, css), process.argv[2] || 'coloring.pdf');
