// Educational library adapted from MOPH (Qatar) leaflets, re-written for Omani boys, grades 5–7.
// Every icon draws inside a -100..100 box.
import * as A from './art.mjs';
const { g, S, INK, f } = A;

const teethRow = (extra = '') => {
  let s = `<rect x="-96" y="20" width="192" height="60" rx="26" fill="${f('gum')}" ${S(4)}/>`;
  for (const x of [-60, 0, 60]) s += `<path d="M${x - 27},38 L${x - 30},-30 Q${x - 28},-56 ${x},-54 Q${x + 28},-56 ${x + 30},-30 L${x + 27},38 Z" fill="#fff" ${S(4)}/>`;
  return s + extra;
};
const upperRow = (extra = '') => {
  let s = `<rect x="-96" y="-80" width="192" height="60" rx="26" fill="${f('gum')}" ${S(4)}/>`;
  for (const x of [-60, 0, 60]) s += `<path d="M${x - 27},-38 L${x - 30},30 Q${x - 28},56 ${x},54 Q${x + 28},56 ${x + 30},30 L${x + 27},-38 Z" fill="#fff" ${S(4)}/>`;
  return s + extra;
};
const arrowsUD = (x, y1, y2) => `<path d="M${x},${y1} L${x},${y2} M${x - 12},${y1 + 14} L${x},${y1} L${x + 12},${y1 + 14} M${x - 12},${y2 - 14} L${x},${y2} L${x + 12},${y2 - 14}" fill="none" stroke="${A.PAL.red}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
const arrowsLR = (x1, x2, y) => `<path d="M${x1},${y} L${x2},${y} M${x1 + 14},${y - 12} L${x1},${y} L${x1 + 14},${y + 12} M${x2 - 14},${y - 12} L${x2},${y} L${x2 - 14},${y + 12}" fill="none" stroke="${A.PAL.red}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
const roll = (x, y, r) => `<path d="M${x + r},${y} A${r},${r} 0 1,1 ${x},${y - r}" fill="none" stroke="${A.PAL.red}" stroke-width="7" stroke-linecap="round"/><path d="M${x - 10},${y - r - 10} L${x + 6},${y - r} L${x - 10},${y - r + 12}" fill="none" stroke="${A.PAL.red}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
const ban = inner => inner + `<circle r="84" fill="none" stroke="${A.PAL.red}" stroke-width="14"/><path d="M-59,-59 L59,59" stroke="${A.PAL.red}" stroke-width="14" stroke-linecap="round"/>`;

export const IC = {
  brush2: () => teethRow(g(-30, -30, 0.55, A.toothbrush(), -40)) + A.sparkle(80, -70, 14),
  floss: () => teethRow(`<path d="M-30,-70 L-30,60 M30,-70 L30,60" stroke="${f('brush')}" stroke-width="7"/><path d="M-30,-70 L-30,60 M30,-70 L30,60" fill="none" ${S(1.5)}/>`) + g(-75, -70, 0.45, A.floss()),
  plate: () => `<ellipse cx="0" cy="30" rx="96" ry="44" fill="${f('paper')}" ${S(4)}/><ellipse cx="0" cy="26" rx="70" ry="28" fill="none" ${S(2)}/>` + g(-42, -6, 0.6, A.apple()) + g(46, -6, 0.62, A.carrot(), 25) + g(4, 24, 0.5, A.cheese()),
  junk: () => ban(g(-30, 10, 0.55, A.soda()) + g(30, 6, 0.55, A.chips()) + g(0, 44, 0.45, A.donut())),
  snack: () => g(-40, 20, 0.7, A.yogurt()) + g(40, -10, 0.55, A.cucumber(), -30) + g(52, 44, 0.45, A.apple()),
  water: () => g(-26, 0, 1, A.waterBottle()) + `<path d="M34,-14 L80,-14 L74,66 L40,66 Z" fill="${f('water')}" ${S(4)}/>`,
  dentist: () => g(0, 98, 0.52, A.dentist({ mouth: 'grin' })) + `<rect x="46" y="-92" width="54" height="56" rx="8" fill="#fff" ${S(4)}/><path d="M46,-76 L100,-76" ${S(3)}/><text x="73" y="-44" text-anchor="middle" font-family="Cairo" font-weight="900" font-size="28" fill="${INK}">6</text>`,
  paste: () => g(-30, 0, 0.75, A.pasteTube()) + g(-10, 50, 0.4, A.toothbrush({ paste: true }), -25),
  timer: () => A.clock(2),
  sunmoon: () => A.sun(-44, -20, 0.62) + A.moon(50, 26, 0.75),
  newbrush: () => g(-100, -30, 0.9, A.toothbrush()) + g(-100, 40, 0.9, A.toothbrush({ k: 'brush2' })) + `<text x="0" y="96" text-anchor="middle" font-family="Cairo" font-weight="900" font-size="30" fill="${INK}">3 أشهر</text>`,
  // brushing steps
  s45: () => teethRow(g(-80, -40, 0.6, A.toothbrush(), -45) + `<text x="40" y="-70" font-family="Cairo" font-weight="900" font-size="34" fill="${A.PAL.red}">45°</text>`),
  sOuter: () => teethRow(roll(0, -12, 32)),
  sInner: () => upperRow(g(-80, 70, 0.55, A.toothbrush(), -20) + arrowsLR(-60, 60, 90)),
  sFront: () => upperRow(g(4, 96, 0.5, A.toothbrush(), -90) + arrowsUD(52, -10, 80)),
  sChew: () => teethRow(arrowsLR(-80, 80, -80) + g(-98, -46, 0.45, A.toothbrush(), -10)),
  tongue: () => `<path d="M-62,-50 Q-66,84 0,84 Q66,84 62,-50 Z" fill="#f78fa7" ${S(5)}/><path d="M0,-40 L0,44" ${S(4)}/>` + g(-30, -44, 0.42, A.toothbrush(), -70) + A.sparkle(74, -64, 18),
  spit: () => `<path d="M-86,0 Q-86,86 0,86 Q86,86 86,0 Z" fill="#e9f1f5" ${S(4)}/><rect x="-96" y="-12" width="192" height="16" rx="6" fill="#fff" ${S(4)}/><path d="M-20,40 q10,-14 20,0 q10,-14 20,0 q-6,14 -20,10 q-14,4 -20,-10z" fill="${f('paste')}" ${S(3)}/><text x="0" y="-40" text-anchor="middle" font-family="Cairo" font-weight="900" font-size="34" fill="${A.PAL.red}">ابصق</text>`,
  // myths
  starch: () => g(-34, 0, 0.75, A.chips()) + g(44, 6, 0.55, A.candy()),
  body: () => A.heart(-36, 20, 1.15) + g(46, -6, 0.7, A.tooth({ mouth: 'smile' })),
  hard: () => g(-96, -10, 0.88, A.toothbrush()) + `<text x="0" y="60" text-anchor="middle" font-family="Cairo" font-weight="900" font-size="30" fill="${INK}">ناعمة ✓</text>`,
  force: () => teethRow(g(-40, -40, 0.5, A.toothbrush(), -40) + `<path d="M-90,-90 l30,20 M-70,-100 l20,30" stroke="${A.PAL.red}" stroke-width="7" stroke-linecap="round"/>`),
  baby: () => g(-40, 0, 0.6, A.tooth({ mouth: 'smile' })) + g(40, 24, 0.42, A.tooth({ mouth: 'smile' })),
  calendar: () => `<rect x="-70" y="-70" width="140" height="140" rx="16" fill="#fff" ${S(6)}/><rect x="-70" y="-70" width="140" height="40" rx="16" fill="${A.PAL.red}" ${S(6)}/><text x="0" y="52" text-anchor="middle" font-family="Cairo, Tajawal" font-weight="900" font-size="78" fill="${INK}">6</text>`,
  lemon: () => ban(`<ellipse cx="-22" cy="-16" rx="36" ry="27" fill="${f('banana')}" ${S(4)}/><path d="M14,-16 l9,-4 l0,8 Z" fill="${f('banana')}" ${S(3)}/><rect x="6" y="8" width="44" height="50" rx="7" fill="#fff" ${S(4)}/><text x="28" y="40" text-anchor="middle" font-family="Cairo" font-weight="900" font-size="14" fill="${INK}">صودا</text>`),
  // bad breath
  mouthwash: () => `<rect x="-22" y="-92" width="44" height="24" rx="5" fill="${f('red')}" ${S(4)}/><path d="M-22,-68 Q-50,-56 -50,-30 L-50,70 Q-50,84 -36,84 L36,84 Q50,84 50,70 L50,-30 Q50,-56 22,-68 Z" fill="#c8f2e6" ${S(4)}/><rect x="-36" y="-10" width="72" height="50" rx="8" fill="#fff" ${S(3)}/><path d="M-24,14 L24,14" ${S(3)}/>` + `<text x="72" y="-50" font-family="Cairo" font-weight="900" font-size="34" fill="${A.PAL.blue}">?</text>`,
  novape: () => ban(`<rect x="-60" y="-10" width="96" height="20" rx="4" fill="#fff" ${S(4)}/><rect x="16" y="-10" width="20" height="20" fill="#f4a261" ${S(4)}/>` + `<rect x="-16" y="-70" width="26" height="110" rx="8" fill="#6c757d" ${S(4)}/>`),
  retainer: () => g(0, 0, 1.2, A.mouthguard()),
  refer: () => g(-42, 98, 0.52, A.dentist({ mouth: 'smile' })) + `<path d="M10,-20 L70,-20 M54,-36 L70,-20 L54,-4" fill="none" stroke="${A.PAL.blue}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="80" cy="30" r="22" fill="#fff" ${S(4)}/><text x="80" y="40" text-anchor="middle" font-family="Cairo" font-weight="900" font-size="26" fill="${INK}">+</text>`,
  // injuries
  search: () => g(-20, 20, 0.5, A.tooth({ mouth: 'o' })) + `<circle cx="22" cy="-22" r="44" fill="none" ${S(10)}/><circle cx="22" cy="-22" r="44" fill="rgba(191,233,255,.4)" stroke="${A.PAL.blue}" stroke-width="5"/><path d="M54,10 L90,46" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>`,
  crown: () => g(0, 4, 0.9, A.tooth({ mouth: 'smile' })) + `<text x="0" y="-78" text-anchor="middle" font-family="Cairo" font-weight="900" font-size="26" fill="${A.PAL.green}">✓ التاج</text><path d="M60,70 L86,96 M86,70 L60,96" stroke="${A.PAL.red}" stroke-width="8" stroke-linecap="round"/>`,
  tap: () => `<path d="M-70,-60 L20,-60 Q40,-60 40,-40 L40,-20 L20,-20 L20,-40 L-70,-40 Z" fill="#cfd8dc" ${S(4)}/><rect x="-60" y="-80" width="24" height="20" rx="4" fill="${f('blue')}" ${S(3)}/>` + [0, 20, 40].map(y => `<circle cx="30" cy="${y}" r="5" fill="${f('water')}" ${S(2)}/>`).join('') + g(30, 66, 0.42, A.tooth({ mouth: 'o' })),
  milk: () => `<path d="M-40,-60 L40,-60 L32,80 L-32,80 Z" fill="${f('glass')}" ${S(4)}/><path d="M-36,-20 L36,-20 L32,76 L-32,76 Z" fill="#fff" ${S(3)}/>` + g(0, 32, 0.32, A.tooth({ mouth: 'smile' })) + g(70, -10, 0.5, A.laban()),
  cheek: () => `<circle r="80" fill="${f('skin')}" ${S(4)}/><path d="M-40,20 Q0,50 40,20" fill="none" ${S(5)}/><circle cx="-28" cy="-20" r="7" fill="${INK}"/><circle cx="28" cy="-20" r="7" fill="${INK}"/>` + g(56, 30, 0.22, A.tooth()) + `<text x="0" y="-90" text-anchor="middle" font-family="Cairo" font-weight="900" font-size="22" fill="${A.PAL.red}">لا تبلعه!</text>`,
  nodry: () => ban(`<rect x="-50" y="-10" width="100" height="56" rx="8" fill="#cfe9f5" ${S(4)}/><ellipse cx="0" cy="-10" rx="24" ry="7" fill="#fff" ${S(3)}/><path d="M-20,-12 Q-26,-44 0,-50 Q24,-44 18,-12 Z" fill="#fff" ${S(3)}/>`),
  fast: () => g(0, 98, 0.52, A.dentist({ mouth: 'smile' })) + `<g transform="translate(-60,-60)">${A.clock(10).replace(/<circle cx="0" cy="0" r="70"/, '<circle cx="0" cy="0" r="70"')}</g>`.replace('translate(-60,-60)', 'translate(-62,-56) scale(.48)'),
  broken: () => `<path d="${A.TOOTH}" fill="#fff" ${S(5)}/><path d="M-52,-38 L-10,-50 L4,-30 L20,-46 L52,-38" fill="none" stroke="${A.PAL.red}" stroke-width="6"/>` + `<path d="M40,-90 L60,-70 L48,-60 L28,-80 Z" fill="#fff" ${S(4)}/>`,
  car: () => `<path d="M-90,30 L-90,0 Q-90,-10 -76,-12 L-50,-14 L-30,-46 Q-24,-54 -12,-54 L36,-54 Q48,-54 56,-44 L76,-14 L86,-12 Q96,-10 96,4 L96,30 Z" fill="${f('blue')}" ${S(5)}/><path d="M-22,-42 L-38,-16 L0,-16 L0,-42 Z M12,-42 L12,-16 L60,-16 L44,-42 Z" fill="#e8f6fb" ${S(3)}/><circle cx="-50" cy="34" r="20" fill="#555" ${S(4)}/><circle cx="56" cy="34" r="20" fill="#555" ${S(4)}/>` + `<rect x="-14" y="-82" width="28" height="22" rx="4" fill="${f('red')}" ${S(3)}/>`,
  glue: () => g(0, 98, 0.52, A.dentist({ mouth: 'grin' })) + g(-62, -50, 0.4, A.tooth({ mouth: 'smile', sparkle: true })),
  guard: () => g(0, -20, 1, A.mouthguard()) + g(-46, 62, 0.42, A.ball()) + `<text x="40" y="78" text-anchor="middle" font-family="Cairo" font-weight="900" font-size="22" fill="${INK}">واقي</text>`,
  calm: () => g(0, 10, 0.9, A.tooth({ mouth: 'o' })) + `<path d="M-90,-60 q10,-10 20,0 M70,-60 q10,-10 20,0" fill="none" ${S(4)}/>`,
  chart: () => `<rect x="-80" y="-80" width="160" height="160" rx="12" fill="#fff" ${S(5)}/>` + [0, 1, 2, 3].map(r => [0, 1].map(c => `<rect x="${-56 + c * 64}" y="${-60 + r * 34}" width="48" height="24" rx="5" fill="${(r + c) % 4 === 3 ? A.PAL.red : A.PAL.green}" ${S(3)}/>`).join('')).join(''),
  // floss / caries / visit (short videos)
  flossLen: () => `<path d="M-90,0 C-50,-40 -10,40 30,0 S80,-30 90,0" fill="none" stroke="${f('brush')}" stroke-width="8"/><path d="M-90,0 C-50,-40 -10,40 30,0 S80,-30 90,0" fill="none" ${S(1.5)}/>` + g(-70, -50, 0.5, A.floss()) + `<text x="20" y="70" text-anchor="middle" font-family="Cairo" font-weight="900" font-size="34" fill="${INK}">45 سم</text>`,
  flossWrap: () => `<rect x="-90" y="-30" width="50" height="90" rx="24" fill="${f('skin')}" ${S(4)}/><rect x="40" y="-30" width="50" height="90" rx="24" fill="${f('skin')}" ${S(4)}/><path d="M-40,-10 L40,-10" stroke="${f('brush')}" stroke-width="7"/><path d="M-65,-10 m-14,0 a14,8 0 1,0 28,0 a14,8 0 1,0 -28,0 M65,-10 m-14,0 a14,8 0 1,0 28,0 a14,8 0 1,0 -28,0" fill="none" stroke="${f('brush')}" stroke-width="5"/><text x="0" y="-50" text-anchor="middle" font-family="Cairo" font-weight="900" font-size="26" fill="${A.PAL.red}">اترك 5 سم</text>`,
  flossC: () => teethRow(`<path d="M-30,-60 Q-58,-10 -30,40 M30,-60 Q2,-10 30,40" fill="none" stroke="${f('brush')}" stroke-width="7"/>`) + `<text x="0" y="-74" text-anchor="middle" font-family="Cairo" font-weight="900" font-size="34" fill="${A.PAL.red}">C</text>`,
  flossGentle: () => teethRow(`<path d="M-30,-70 L-30,30" stroke="${f('brush')}" stroke-width="7"/>` + arrowsUD(-62, -60, 10)) + A.heart(70, -70, 0.5, 'gum'),
  flossAll: () => teethRow(`<path d="M-30,-70 L-30,30 M30,-70 L30,30" stroke="${f('brush')}" stroke-width="5" stroke-dasharray="8 6"/>`) + A.sparkle(80, -70, 16) + A.sparkle(-84, -60, 12),
  sugar: () => g(-36, -10, 0.7, A.candy()) + g(44, 10, 0.55, A.soda()) + g(-10, 60, 0.5, A.donut()),
  bacteria: () => g(-40, -20, 0.62, A.germ()) + g(46, 20, 0.5, A.germ({ k: 'germ2' })) + g(-10, 60, 0.35, A.germ()),
  acid: () => g(-30, 0, 0.62, A.germ()) + [[40, -50], [64, -10], [44, 30], [70, 60]].map(([x, y]) => `<path d="M${x},${y - 16} Q${x + 12},${y} ${x},${y + 10} Q${x - 12},${y} ${x},${y - 16} Z" fill="#c7f464" ${S(3)}/>`).join('') + `<text x="0" y="96" text-anchor="middle" font-family="Cairo" font-weight="900" font-size="26" fill="${A.PAL.red}">أحماض</text>`,
  cavity: () => g(0, 0, 1, A.tooth({ sad: true, cavity: true })),
  protect: () => g(-40, 10, 0.62, A.tooth({ mouth: 'grin', sparkle: true })) + g(40, 0, 0.6, A.pasteTube()),
  chair: () => `<path d="M-80,40 L40,40 L70,0 L90,0 L60,60 L-80,60 Z" fill="${f('blue')}" ${S(4)}/><path d="M-80,40 L-90,-40 L-70,-40 L-60,40" fill="${f('blue')}" ${S(4)}/><path d="M-10,60 L-10,90 M-40,90 L20,90" ${S(6)}/><path d="M30,-40 L30,-90 L80,-90" fill="none" ${S(5)}/><circle cx="80" cy="-74" r="14" fill="${f('star')}" ${S(3)}/>`,
  look: () => g(0, 0, 0.9, A.tooth({ mouth: 'teeth' })) + `<circle cx="64" cy="-50" r="22" fill="${f('mirror')}" ${S(4)}/><path d="M48,-34 L10,10" ${S(6)}/>`,
  xray: () => `<rect x="-80" y="-60" width="160" height="120" rx="12" fill="#22313a" ${S(4)}/>` + [-50, -17, 17, 50].map(x => `<path d="M${x - 14},-30 Q${x},-44 ${x + 14},-30 L${x + 10},30 L${x - 10},30 Z" fill="#e6f1f6" stroke="#e6f1f6" stroke-width="2"/>`).join(''),
  polish: () => g(0, 0, 1, A.tooth({ mouth: 'grin', sparkle: true })) + A.sparkle(-76, 60, 14),
};

// ---------- topics ----------
// Each topic: id, short, title, sub, color vars, session mapping, items [icon, heading, text], extra fields.
export const TOPICS = [
  {
    id: '1-ahamm-al-adat', slug: 'habits', keys: [['2×','مرتين يومياً'],['2','دقيقتان'],['6','أشهر بين كل زيارة للطبيب']], n: 1, short: 'عادات لفم سليم', title: 'صحة الفم والأسنان',
    sub: 'فمك بوابة صحة جسمك كله، فاحمِه بهذه العادات السبع', vars: '--bg:#fdeef4;--c1:#d6457a;--c2:#ffd3e3;--c3:#a12a58',
    session: 1, from: 'ملصق «صحة الفم والأسنان»',
    items: [
      ['brush2', 'نظّف أسنانك مرتين يومياً', 'دقيقتان كاملتان بعد الإفطار وقبل النوم.'],
      ['floss', 'استخدم الخيط مرة يومياً', 'ينظّف ما بين الأسنان حيث لا تصل الفرشاة.'],
      ['plate', 'كُل غذاءً متوازناً', 'فواكه وخضروات وبروتين مثل البيض والسمك والعدس.'],
      ['junk', 'ابتعد عن الأكل غير الصحي', 'الحلويات والشيبس والمشروبات الغازية تؤذي أسنانك.'],
      ['snack', 'اختر وجبة خفيفة صحية', 'في الفسحة: خيار، جزر، زبادي، تفاحة.'],
      ['water', 'اشرب الكثير من الماء', 'الماء يغسل فمك بعد الأكل وهو أفضل مشروب.'],
      ['dentist', 'زُر طبيب الأسنان', 'مرة كل 6 أشهر للفحص، حتى لو لم تشعر بألم.'],
    ],
    question: 'أي عادة من السبع ستبدأ بها اليوم؟',
  },
  {
    id: '2-tariqat-at-tafreesh', slug: 'brushing', keys: [['45°','زاوية الفرشاة'],['2','دقيقتان'],['3','أشهر عمر الفرشاة']], n: 2, short: 'الطريقة الصحيحة للتفريش', title: 'الطريقة الصحيحة لتنظيف الأسنان',
    sub: 'ست خطوات في دقيقتين لأسنان نظيفة ولثة سليمة', vars: '--bg:#e7f6fb;--c1:#1f8fbf;--c2:#bfe9ff;--c3:#1f6fb2',
    session: 2, from: 'منشور «الطريقة الصحيحة لاستخدام فرشاة الأسنان»',
    items: [
      ['s45', 'ميّل الفرشاة 45°', 'نصف الشعيرات على السن ونصفها على اللثة.'],
      ['sOuter', 'الأسطح الخارجية', 'حركة صغيرة للأمام والخلف مع تدوير لطيف، كل 2 أو 3 أسنان معاً.'],
      ['sInner', 'الأسطح الداخلية', 'حافظ على زاوية 45° ونظّف من الداخل بالحركة نفسها.'],
      ['sFront', 'خلف الأسنان الأمامية', 'أوقف الفرشاة عمودياً وحرّكها لأعلى ولأسفل.'],
      ['sChew', 'أسطح المضغ', 'حرّك الفرشاة للأمام والخلف بلطف على أسطح الطحن.'],
      ['tongue', 'نظّف لسانك', 'من الخلف إلى الأمام لإزالة البكتيريا والرائحة.'],
    ],
    tips: [['sunmoon', 'مرتين يومياً'], ['timer', 'دقيقتان'], ['paste', 'معجون بالفلورايد بحجم حبة البازلاء'], ['spit', 'ابصق المعجون ولا تشطف بكثرة'], ['newbrush', 'فرشاة ناعمة تُغيَّر كل 3 أشهر']],
    question: 'ما الخطوة التي تنساها عادة؟',
  },
  {
    id: '3-al-mafaheem-al-khatia', slug: 'myths', keys: [['8','معلومات خاطئة'],['8','حقائق صحيحة'],['1','فم صحي = جسم صحي']], n: 3, short: 'صح أم خطأ؟', title: 'صح أم خطأ؟',
    sub: 'ثماني معلومات خاطئة عن الأسنان، وإليك الحقيقة', vars: '--bg:#f1edfb;--c1:#6a4fc4;--c2:#ddd3ff;--c3:#4b33a0',
    session: 4, from: 'منشور «المفاهيم الخاطئة حول صحة الفم»',
    myths: [
      ['starch', 'الحلويات وحدها تسبب التسوس.', 'الشيبس والبسكويت والخبز الأبيض تلتصق بالأسنان وتسبب التسوس أيضاً.'],
      ['body', 'صحة الفم لا علاقة لها بصحة جسمي.', 'الفم بوابة الجسم، وإهماله مرتبط بأمراض مثل السكري وأمراض القلب.'],
      ['hard', 'الفرشاة الخشنة تنظّف أفضل.', 'الفرشاة الخشنة قد تجرح اللثة وتُتلف المينا. اختر الناعمة.'],
      ['force', 'كلما فرّشت بقوة صارت أسناني أنظف.', 'الضغط القوي يؤذي اللثة والمينا. الحركة اللطيفة تكفي.'],
      ['floss', 'لا أحتاج الخيط إذا فرّشت جيداً.', 'الفرشاة تنظّف الأسطح، والخيط وحده يصل إلى ما بين الأسنان.'],
      ['baby', 'الأسنان اللبنية لا تهم لأنها ستسقط.', 'تساعد على الأكل والنطق وتحفظ مكان الأسنان الدائمة.'],
      ['calendar', 'لا أزور طبيب الأسنان إلا عند الألم.', 'زُره كل 6 أشهر ليكتشف المشكلة قبل أن تؤلمك.'],
      ['lemon', 'الليمون وبيكربونات الصودا تبيّض الأسنان.', 'قد تسبب تآكل المينا. التبييض يكون فقط تحت إشراف الطبيب.'],
    ],
    question: 'أي معلومة فاجأتك أكثر؟',
  },
  {
    id: '4-jadwal-at-tafreesh', slug: 'chart', keys: [['28','يوماً'],['56','سنّاً تلوّنه'],['2','مرتان كل يوم']], n: 4, short: 'تحدّي الأسابيع الأربعة', title: 'تحدّي التفريش: 4 أسابيع',
    sub: 'لوّن السن بالأخضر إذا فرّشت، وبالأحمر إذا نسيت', vars: '--bg:#eaf7ef;--c1:#2a9d8f;--c2:#c7f0dd;--c3:#1b6f65',
    session: 2, from: 'جدول «أسنانك عنوان صحتك» الأسبوعي',
    days: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    items: [
      ['sunmoon', 'صباحاً ومساءً', 'خانة بعد الإفطار وخانة قبل النوم.'],
      ['chart', 'أخضر أو أحمر', 'أخضر إذا فرّشت، أحمر إذا نسيت. كن صادقاً!'],
      ['calendar', '28 يوماً', 'من الجلسة الثانية حتى ما بعد الجلسة الخامسة.'],
      ['dentist', 'توقيع ولي الأمر', 'يوقّع في نهاية كل أسبوع، وتسلّمه للسفير.'],
    ],
    question: 'كم سناً أخضر جمعت هذا الأسبوع؟',
  },
  {
    id: '5-raihat-al-fam', slug: 'breath', keys: [['2×','تفريش يومياً'],['1','مرة خيط يومياً'],['2','زيارتان للطبيب سنوياً']], n: 5, short: 'رائحة الفم الكريهة', title: 'كيف أمنع رائحة الفم الكريهة؟',
    sub: 'نَفَس منعش كل يوم بثماني عادات صحيحة', vars: '--bg:#e8f5ec;--c1:#2b8a3e;--c2:#c6efcf;--c3:#1e6b2e',
    session: 4, from: 'منشور «ما هي وسائل الوقاية من رائحة الفم الكريهة»',
    items: [
      ['brush2', 'فرّش أسنانك مرتين يومياً', 'صباحاً وقبل النوم، دقيقتين في كل مرة.'],
      ['tongue', 'لا تنسَ لسانك', 'أكثر بكتيريا الرائحة تختبئ على سطح اللسان.'],
      ['floss', 'استخدم الخيط يومياً', 'بقايا الطعام بين الأسنان من أكبر أسباب الرائحة.'],
      ['water', 'اشرب الماء كثيراً', 'الفم الجاف تتكاثر فيه البكتيريا بسرعة.'],
      ['novape', 'ابتعد عن التدخين والسيجارة الإلكترونية', 'تسبب رائحة كريهة وتضر اللثة والرئتين.'],
      ['retainer', 'نظّف التقويم أو الواقي يومياً', 'إذا كان عندك جهاز أسنان متحرّك، فرّشه واحفظه نظيفاً.'],
      ['mouthwash', 'الغسول بوصفة الطبيب فقط', 'طبيب الأسنان يقرر إن كنت تحتاج مضمضة.'],
      ['refer', 'زُر الطبيب مرتين في السنة', 'إذا استمرت الرائحة، يبحث الطبيب عن سبب آخر ويحوّلك للمختص.'],
    ],
    fact: 'هل تعلم؟ رائحة الفم عند الاستيقاظ طبيعية، لأن اللعاب يقلّ أثناء النوم. التفريش الصباحي يحلّها.',
    question: 'لماذا يجعل الماء نَفَسك أنظف؟',
  },
  {
    id: '6-isabat-al-asnan', slug: 'injury', keys: [['7','خطوات للإنقاذ'],['60','دقيقة: الوقت الذهبي'],['1','كوب حليب']], n: 6, short: 'إصابات الأسنان', title: 'إصابات الأسنان: ماذا أفعل؟',
    sub: 'إذا سقط سنّك الدائم أو انكسر أثناء اللعب، تصرّف بسرعة', vars: '--bg:#fff1ea;--c1:#e0592a;--c2:#ffd8c7;--c3:#a63d14',
    session: 5, from: 'منشور «إصابات الأسنان»',
    items: [
      ['calm', 'اهدأ وابحث عن السن', 'أخبر المعلم أو أحد الكبار فوراً.'],
      ['crown', 'أمسكه من التاج', 'الجزء الأبيض فقط، ولا تلمس الجذر.'],
      ['tap', 'اغسله بالماء البارد ثوانيَ', 'أغلق فتحة المغسلة أولاً، ولا تفرك السن.'],
      ['milk', 'ضعه في كوب حليب', 'الحليب يحفظ السن حيّاً حتى تصل للطبيب.'],
      ['cheek', 'لا يوجد حليب؟', 'احفظه في فمك بين الخد واللثة بحذر حتى لا تبلعه.'],
      ['nodry', 'لا تلفّه في منديل', 'إذا جفّ السن قلّت فرصة إنقاذه.'],
      ['fast', 'اذهب إلى طبيب الأسنان فوراً', 'كل دقيقة مهمة، والأفضل خلال ساعة.'],
    ],
    broken: [
      ['broken', 'ابحث عن القطعة المكسورة', 'واحفظها في ماء أو حليب.'],
      ['car', 'اذهب إلى طبيب الأسنان مباشرة', 'السن المكسور حالة طارئة.'],
      ['glue', 'قد يُلصقها الطبيب', 'يمكن إعادة القطعة إلى مكانها أحياناً.'],
    ],
    prevent: ['guard', 'ألبس واقي الأسنان', 'في كرة القدم والكاراتيه والرياضات التي فيها احتكاك.'],
    question: 'ماذا تفعل لو سقط سن صديقك في الملعب؟',
  },
];

// Short extra videos (15–30 s) requested for the page's video studio.
export const MINI = [
  { id: 'v7-al-khait', slug: 'floss', n: 7, short: 'استخدام الخيط', title: 'كيف أستخدم خيط الأسنان؟', sub: 'خمس خطوات تنظّف ما لا تصله الفرشاة', vars: '--bg:#e9f7f5;--c1:#2a9d8f;--c2:#c7f0e6;--c3:#1b6f65', question: 'جرّب الخيط الليلة قبل التفريش!',
    items: [['flossLen', 'خذ خيطاً بطول ذراعك', 'حوالي 45 سم.'], ['flossWrap', 'لفّه على الإصبعين الوسطى', 'واترك 5 سم بينهما.'], ['flossGentle', 'أدخله بين السنّين بلطف', 'حركة صعود ونزول، دون ضغط على اللثة.'], ['flossC', 'اثنِه حول السن على شكل C', 'ونظّف جانب كل سن.'], ['flossAll', 'استخدم جزءاً نظيفاً لكل مسافة', 'حتى آخر ضرس، مرة كل يوم.']] },
  { id: 'v8-at-tasawwus', slug: 'caries', n: 8, short: 'كيف تتكوّن السوسة؟', title: 'كيف تتكوّن السوسة؟', sub: 'رحلة السكر من فمك إلى سنّك', vars: '--bg:#fff4e6;--c1:#e07a1f;--c2:#ffe0bd;--c3:#a6520c', question: 'ما أول خطوة توقف السوسة؟',
    items: [['sugar', 'تأكل السكريات والنشويات', 'حلوى، مشروبات غازية، شيبس.'], ['bacteria', 'البكتيريا في فمك تتغذّى عليها', 'وتكوّن طبقة لزجة اسمها البلاك.'], ['acid', 'البكتيريا تُنتج أحماضاً', 'تهاجم المينا لمدة 20 دقيقة بعد الأكل.'], ['cavity', 'تتكرّر الهجمات فتظهر السوسة', 'ثقب صغير يكبر ويؤلم إذا أُهمل.'], ['protect', 'الفرشاة والفلورايد يحميانك', 'وقلّل السكريات بين الوجبات.']] },
  { id: 'v9-ziyarat-at-tabeeb', slug: 'visit', n: 9, short: 'زيارة طبيب الأسنان', title: 'لماذا أزور طبيب الأسنان؟', sub: 'زيارة كل 6 أشهر تحمي ابتسامتك', vars: '--bg:#eef2fd;--c1:#3d5adf;--c2:#d5ddff;--c3:#2a3fa6', question: 'متى موعد زيارتك القادمة؟',
    items: [['calendar', 'كل 6 أشهر', 'حتى لو لم تشعر بأي ألم.'], ['chair', 'تجلس على كرسي مريح', 'والطبيب يشرح لك كل خطوة.'], ['look', 'يفحص أسنانك ولثّتك', 'بمرآة صغيرة وأدوات آمنة.'], ['xray', 'صورة أشعة عند الحاجة', 'ليرى ما بين الأسنان وتحتها.'], ['polish', 'تنظيف ونصائح', 'ويكتشف السوسة مبكراً قبل أن تؤلم.']] },
];
