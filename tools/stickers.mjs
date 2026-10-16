import * as A from './art.mjs';
import { render, doc, CREDIT } from './render.mjs';
const { g, S, INK, f } = A;
A.setMode('color');
const css = `
.hdr{position:absolute;top:4mm;line-height:1.3;left:0;right:0;text-align:center;font-family:Cairo,Tajawal;font-weight:800;font-size:11pt}
.hdr small{font-weight:600;font-size:9pt;color:#555}
.sheet{position:absolute;left:50%;transform:translateX(-50%)}
.sheet>svg{position:absolute}
`;
const sash = `<path d="M-52,-226 L-30,-232 L66,-60 L52,-46 Z" fill="${A.PAL.red}" ${S(3)}/>`;
function sticker(bg, ring, icon, text, size, small = false) {
  const fs = Math.min(small ? 80 : 68, Math.round(440 / (text.length * 0.5)));
  return `<svg viewBox="-310 -310 620 620" style="width:${size}mm;height:${size}mm;display:block">
  <rect x="-310" y="-310" width="620" height="620" fill="${bg}"/>
  <rect x="-272" y="-272" width="544" height="544" rx="46" fill="#fff" stroke="${ring}" stroke-width="12"/>
  <rect x="-272" y="-272" width="544" height="544" rx="46" fill="none" ${S(6)}/>
  ${icon}
  <rect x="-262" y="${small ? 95 : 110}" width="524" height="${small ? 130 : 120}" rx="40" fill="${bg}" ${S(7)}/>
  <text x="0" y="${small ? 182 : 192}" text-anchor="middle" font-family="Cairo, Tajawal" font-weight="900" font-size="${fs}" fill="#fff" stroke="${INK}" stroke-width="7" paint-order="stroke" stroke-linejoin="round">${text}</text>
</svg>`;
}
const fig = (inner, s = 0.7, y = 150) => g(0, y, s, inner);
const big = [
  ['#22b3a6', '#bff0ea', fig(A.tooth({ arms: [[[-46, -6], [-80, -40]], [[46, -6], [80, -40]]], feet: true, sparkle: true }), 1.85, -50), 'فرّشتُ أسناني!'],
  ['#1f8fbf', '#cdeeff', fig(A.boy({ r: [[60, -212], [104, -262], [114, -330]] }), 0.86, 108), 'مرتين يومياً'],
  ['#f4a300', '#ffe7a3', fig(A.clock(2), 1.45, -60), 'دقيقتان كل مرة'],
  ['#7b4fd6', '#e3d6ff', fig(A.friend({ l: [[-60, -206], [-104, -256], [-116, -322]] }), 0.86, 108), 'ابتسامتي سرّ قوتي'],
  ['#3a86ff', '#d6e6ff', fig(A.waterBottle(), 1.3, -55), 'الماء صديق أسناني'],
  ['#43aa8b', '#c7f0d8', fig(A.apple() + g(70, 10, 0.8, A.carrot(), 25), 1.6, -50), 'أختار الصحي'],
  ['#e76f51', '#ffd6c2', fig(A.floss() + g(0, -10, 0.5, A.TOOTH ? `<path d="${A.TOOTH}" fill="#fff" ${S(6)}/>` : ''), 1.9, -50), 'أستخدم الخيط'],
  ['#e63946', '#ffd0d4', fig(A.candy() + A.cross(60, -50, 0.7), 1.6, -50), 'سكر أقل.. ابتسامة أجمل'],
  ['#2a9d8f', '#c9f2ec', fig(A.dentist({ mouth: 'grin' }), 0.86, 108), 'زرتُ طبيب الأسنان'],
  ['#d4a017', '#fff1b8', fig(A.tooth({ arms: [[[-46, -6], [-80, -40]], [[46, -6], [80, -40]]], feet: true, sparkle: true }) + A.star5(0, -95, 26, 'star', 4), 1.75, -40), 'سفير الابتسامة'],
  ['#ff6b6b', '#ffd9d9', fig(A.pasteTube(), 1.3, -55) , 'الفلورايد يحميني'],
  ['#3a6ea5', '#d6e6ff', fig(A.mouthguard() + g(0, -70, 0.6, A.ball()), 1.6, -40), 'أحمي أسناني'],
];
const small = [
  ['#f4a300', '#ffe7a3', fig(A.star5(0, 0, 120, 'star', 8), 1, -70), 'أحسنت!'],
  ['#22b3a6', '#bff0ea', fig(A.tooth({ sparkle: true }), 1.5, -60), 'بطل التفريش'],
  ['#2a9d8f', '#c9f2ec', fig(A.check(0, 0, 2.6), 1, -70), 'متقن'],
  ['#7b4fd6', '#e3d6ff', fig(A.tooth({ mouth: 'grin' }) + A.star5(0, -95, 26, 'star', 4), 1.5, -50), 'سفير الابتسامة'],
  ['#e63946', '#ffd0d4', fig(A.heart(0, 0, 3.4), 1, -60), 'أحب أسناني'],
  ['#1f8fbf', '#cdeeff', fig(g(-110, 30, 1, A.toothbrush({ paste: true })), 1, -60), 'فرّشتُ اليوم'],
];
// scissors icon, centred at (x,y) in mm, pointing along angle a (deg)
const scissors = (x, y, a) => `<g transform="translate(${x},${y}) rotate(${a}) scale(.42)" fill="none" stroke="${INK}" stroke-width="1.1" stroke-linecap="round">
  <circle cx="-6" cy="-3.2" r="2.4" fill="#fff"/><circle cx="-6" cy="3.2" r="2.4" fill="#fff"/>
  <path d="M-3.8,-2.2 L7,2.6 M-3.8,2.2 L7,-2.6"/><circle cx="0" cy="0" r=".6" fill="${INK}"/></g>`;
// stickers with clear gaps; dashed cut lines run through the middle of every gap, with scissors at each line's start
const sheet = (items, cols, size, gap, title, top) => {
  const pitch = size + gap, rows = Math.ceil(items.length / cols), W = cols * pitch, H = rows * pitch;
  const tiles = items.map(([bg, ring, ic, t], i) => {
    const c = i % cols, r = Math.floor(i / cols);
    return sticker(bg, ring, ic, t, size, size < 50).replace('<svg ', `<svg style="position:absolute;right:${c * pitch + gap / 2}mm;top:${r * pitch + gap / 2}mm;width:${size}mm;height:${size}mm" `).replace(/ style="width:[^"]*"/, '');
  }).join('');
  let cut = '';
  const dash = `stroke="${INK}" stroke-width=".3" stroke-dasharray="2 1.4"`;
  for (let r = 0; r <= rows; r++) cut += `<line x1="0" y1="${r * pitch}" x2="${W - 5}" y2="${r * pitch}" ${dash}/>` + scissors(W - 2.2, r * pitch, 180);
  for (let c = 0; c <= cols; c++) cut += `<line x1="${c * pitch}" y1="${c < cols ? 5 : 0}" x2="${c * pitch}" y2="${H}" ${dash}/>` + (c < cols ? scissors(c * pitch, 2.2, 90) : "");
  return `<div class="page"><div class="hdr">${title}<br><small>اطبع على ورق ملصقات A4 لاصق، ثم قصّ على الخطوط المتقطعة (✂) في المسافات بين الملصقات<br>${CREDIT}</small></div>
<div class="sheet" style="top:${top}mm;width:${W}mm;height:${H}mm"><svg viewBox="0 0 ${W} ${H}" style="left:0;top:0;width:${W}mm;height:${H}mm;overflow:visible">${cut}</svg>${tiles}</div></div>`;
};
const smallAll = [];
for (let r = 0; r < 4; r++) smallAll.push(...small);
const pages = [sheet(big, 3, 56, 9, 'ملصقات صحة الفم والأسنان · 12 ملصقاً', 26), sheet(smallAll, 4, 36, 8, 'ملصقات التحفيز والتقييم · 24 ملصقاً', 26)];
await render(doc('ملصقات صحة الفم والأسنان', pages, css), process.argv[2] || 'stickers.pdf');
