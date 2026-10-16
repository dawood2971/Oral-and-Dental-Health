// Original line-art components. MODE 'line' = coloring (white fills), 'color' = full colour.
export const INK = '#1d1d1f';
let MODE = 'color';
export const setMode = m => { MODE = m; };
export const PAL = {
  skin: '#e2ae86', cheek: '#e8877a', kumma: '#fbfaf4', kumma2: '#efe2c4', emb4: '#8a5a32', hair: '#2b2118', emb1: '#1f6fb2', emb2: '#d1495b', emb3: '#2a9d8f',
  dish: '#fbfaf6', hijab: '#ffffff', dress: '#2f8fbf', dress2: '#cfe9f5', shoe: '#7a5236',
  tooth: '#ffffff', toothShade: '#dceefa', gum: '#f6a5b7', brush: '#22b3a6', brush2: '#ff8a3d', bristle: '#e3f4ff',
  paste: '#7fd3ff', tube: '#ffffff', tubeCap: '#ff6b6b', coat: '#ffffff', water: '#bfe9ff',
  apple: '#e5383b', leaf: '#52b788', carrot: '#f4a261', cheese: '#ffd166', banana: '#ffe066', cucumber: '#8ac926',
  candy: '#ff70a6', candy2: '#9b5de5', soda: '#e63946', choco: '#8d5b4c', donut: '#f7c59f', icing: '#ff8fab',
  sink: '#e9f1f5', mirror: '#d6efff', wood: '#d4a373', star: '#ffd23f', germ: '#7bc96f', germ2: '#5aa64f',
  ball: '#ffffff', guard: '#4cc9f0', sand: '#ffd166', glass: '#e8f7ff', milk: '#ffffff', laban: '#e0f2ff',
  red: '#e63946', green: '#2a9d8f', blue: '#1f6fb2', paper: '#ffffff', grass: '#95d5b2', sky: '#e8f6fb'
};
export const f = k => (MODE === 'color' ? (PAL[k] || k) : '#ffffff');
export const isColor = () => MODE === 'color';
export const SW = 4;
export const S = (w = SW) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
export const g = (x, y, s, inner, rot = 0) => `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">${inner}</g>`;

const pd = pts => 'M' + pts.map(p => p.join(',')).join(' L');
// outlined tube (arms, legs)
export const tube = (pts, k, w = 26) =>
  `<path d="${pd(pts)}" fill="none" stroke="${INK}" stroke-width="${w + SW * 2}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${pd(pts)}" fill="none" stroke="${f(k)}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const hand = ([x, y], r = 14) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f('skin')}" ${S()}/>`;

// ---------- faces ----------
export function face(o = {}) {
  const m = o.mouth || 'smile', look = o.look || 0, ex = o.eyeX || 20;
  let s = '';
  for (const dx of [-ex, ex]) {
    if (o.closed) { s += `<path d="M${dx - 9},2 Q${dx},10 ${dx + 9},2" fill="none" ${S(3.5)}/>`; continue; }
    s += `<ellipse cx="${dx}" cy="0" rx="9" ry="11" fill="#fff" ${S(3)}/>` +
      `<circle cx="${dx + look}" cy="2" r="6" fill="${INK}"/><circle cx="${dx + look + 2}" cy="-1" r="2.2" fill="#fff"/>`;
  }
  const by = o.sad ? -16 : -19;
  s += o.sad
    ? `<path d="M${-ex - 9},${by - 4} L${-ex + 8},${by}" ${S(3)}/><path d="M${ex + 9},${by - 4} L${ex - 8},${by}" ${S(3)}/>`
    : `<path d="M${-ex - 9},${by} Q${-ex},${by - 6} ${-ex + 9},${by}" fill="none" ${S(3)}/><path d="M${ex - 9},${by} Q${ex},${by - 6} ${ex + 9},${by}" fill="none" ${S(3)}/>`;
  if (!o.noNose) s += `<path d="M-3,13 Q0,17 3,13" fill="none" ${S(2.5)}/>`;
  if (isColor() && !o.noCheek) s += `<circle cx="${-ex - 13}" cy="17" r="7" fill="${PAL.cheek}" opacity=".6"/><circle cx="${ex + 13}" cy="17" r="7" fill="${PAL.cheek}" opacity=".6"/>`;
  if (m === 'smile') s += `<path d="M-17,23 Q0,43 17,23 Z" fill="#fff" ${S(3)}/><path d="M-9,31 Q0,37 9,31" fill="${isColor() ? '#ff8a8a' : '#fff'}" stroke="none"/>`;
  else if (m === 'grin') s += `<path d="M-13,25 Q0,35 13,25" fill="none" ${S(3.2)}/>`;
  else if (m === 'sad') s += `<path d="M-14,33 Q0,22 14,33" fill="none" ${S(3.2)}/>`;
  else if (m === 'o') s += `<ellipse cx="0" cy="29" rx="8" ry="9" fill="${isColor() ? '#c94f4f' : '#fff'}" ${S(3)}/>`;
  else if (m === 'teeth') s += `<path d="M-18,22 Q0,42 18,22 Z" fill="#fff" ${S(3)}/><path d="M-16,24 L16,24" ${S(2)}/><path d="M-6,24 L-6,31 M6,24 L6,31" ${S(2)}/>`;
  return s;
}

// ---------- Omani kumma (tall cylinder, all-over embroidery like the reference) ----------
let KID = 0;
function kumma(y, alt) {
  const id = 'km' + (++KID), bot = y - 18, top = y - 86;
  const shape = `M-57,${bot} C-60,${y - 50} -58,${top + 10} -54,${top + 4} C-30,${top - 6} 30,${top - 6} 54,${top + 4} C58,${top + 10} 60,${y - 50} 57,${bot} C30,${bot + 10} -30,${bot + 10} -57,${bot} Z`;
  let s = `<defs><clipPath id="${id}"><path d="${shape}"/></clipPath></defs>`;
  s += `<path d="${shape}" fill="${f(alt ? 'kumma2' : 'kumma')}"/>`;
  let p = '';
  const c = MODE === 'color';
  if (!alt) {
    // Salem: white kumma with blue/teal scroll embroidery
    const col = c ? PAL.emb1 : INK, col2 = c ? PAL.emb3 : INK;
    for (let r = 0; r < 3; r++) {
      const yy = top + 16 + r * 22;
      for (let x = -66 + (r % 2) * 11; x < 66; x += 22) {
        p += `<path d="M${x - 8},${yy + 4} C${x - 8},${yy - 8} ${x + 8},${yy - 8} ${x + 6},${yy + 2} C${x + 4},${yy + 7} ${x - 2},${yy + 6} ${x - 1},${yy + 1}" fill="none" stroke="${col}" stroke-width="2.6" stroke-linecap="round"/>`;
        p += `<circle cx="${x + 11}" cy="${yy + 9}" r="2.2" fill="${col2}"/>`;
      }
    }
    p += `<path d="M-62,${bot - 10} C-30,${bot - 2} 30,${bot - 2} 62,${bot - 10}" fill="none" stroke="${col}" stroke-width="3"/>`;
  } else {
    // Hamad: beige kumma with brown lattice of small holes
    const col = c ? PAL.emb4 : INK;
    for (let r = 0; r < 8; r++) {
      const yy = top + 8 + r * 10;
      for (let x = -64 + (r % 2) * 6; x < 66; x += 12) p += `<path d="M${x},${yy - 4} L${x + 4},${yy} L${x},${yy + 4} L${x - 4},${yy} Z" ${c ? `fill="${col}"` : `fill="none" stroke="${INK}" stroke-width="1.4"`}/>`;
    }
    p += `<path d="M-62,${top + 8} C-30,${top + 2} 30,${top + 2} 62,${top + 8}" fill="none" stroke="${col}" stroke-width="2.5"/>`;
  }
  s += `<g clip-path="url(#${id})">${p}</g>`;
  s += `<path d="${shape}" fill="none" ${S()}/>`;
  s += `<path d="M-54,${top + 4} C-30,${top + 14} 30,${top + 14} 54,${top + 4}" fill="none" ${S(2.5)}/>`;
  return s;
}
// short dark hair visible under the kumma (sideburns)
function hair() {
  let s = '';
  for (const sx of [-1, 1]) s += `<path d="M${sx * 57},-318 C${sx * 60},-304 ${sx * 58},-292 ${sx * 50},-284 C${sx * 47},-292 ${sx * 44},-304 ${sx * 36},-316 Z" fill="${f('hair')}" ${S(3)}/>`;
  return s;
}
function flower(x, y, r) {
  let s = '';
  for (let i = 0; i < 5; i++) { const a = i * 72 * Math.PI / 180; s += `<circle cx="${(x + Math.cos(a) * r).toFixed(1)}" cy="${(y + Math.sin(a) * r).toFixed(1)}" r="${r * 0.62}" fill="${f('emb3')}" ${S(1.8)}/>`; }
  return s + `<circle cx="${x}" cy="${y}" r="${r * 0.5}" fill="${f('star')}" ${S(1.8)}/>`;
}

// ---------- Salem: Omani boy, dishdasha + kumma. feet at y=0 ----------
export function boy(o = {}) {
  const L = o.l || [[-60, -212], [-84, -150], [-72, -92]], R = o.r || [[60, -212], [84, -150], [72, -92]];
  let s = '';
  for (const sx of [-1, 1]) s += `<path d="M${sx * 6},-2 Q${sx * 4},-18 ${sx * 28},-18 Q${sx * 52},-18 ${sx * 52},-2 Z" fill="${f('shoe')}" ${S()}/>`;
  s += `<rect x="-14" y="-258" width="28" height="26" fill="${f('skin')}" ${S()}/>`;
  s += `<path d="M-26,-238 Q-58,-234 -66,-212 L-80,-22 Q-80,-10 -66,-10 L66,-10 Q80,-10 80,-22 L66,-212 Q58,-234 26,-238 Z" fill="${f('dish')}" ${S()}/>`;
  s += `<path d="M-34,-110 L-40,-18 M34,-110 L40,-18" fill="none" ${S(2.4)}/>`;
  s += `<path d="M-24,-237 Q0,-222 24,-237" fill="none" ${S()}/><path d="M0,-226 L0,-160" ${S(2.5)}/>`;
  if (o.coat) {
    s += `<path d="M-26,-238 Q-58,-234 -66,-212 L-80,-22 Q-80,-10 -66,-10 L-30,-10 L-22,-150 L-14,-236 Z" fill="${f('coat')}" ${S()}/>`;
    s += `<path d="M26,-238 Q58,-234 66,-212 L80,-22 Q80,-10 66,-10 L30,-10 L22,-150 L14,-236 Z" fill="${f('coat')}" ${S()}/>`;
    s += `<rect x="34" y="-150" width="28" height="28" rx="4" fill="${f('coat')}" ${S(3)}/><path d="M42,-150 L42,-165" stroke="${f('blue')}" stroke-width="5" stroke-linecap="round"/>`;
    s += `<rect x="-62" y="-176" width="32" height="18" rx="3" fill="${f('star')}" ${S(2.5)}/>`;
  }
  s += `<path d="M5,-228 C11,-206 1,-190 6,-168" fill="none" stroke="${INK}" stroke-width="3"/>`;
  s += `<path d="M6,-170 C-3,-160 -1,-147 6,-140 C13,-147 15,-160 6,-170 Z" fill="${f('kumma2')}" ${S(2.6)}/>`;
  if (!o.armsFront) s += tube(L, o.coat ? 'coat' : 'dish') + tube(R, o.coat ? 'coat' : 'dish');
  s += `<circle cx="-55" cy="-296" r="11" fill="${f('skin')}" ${S()}/><circle cx="55" cy="-296" r="11" fill="${f('skin')}" ${S()}/>`;
  s += `<circle cx="0" cy="-300" r="56" fill="${f('skin')}" ${S()}/>`;
  s += hair() + kumma(-300, o.alt);
  s += g(0, -290, 1, face(o));
  if (o.glasses) s += `<g fill="none" ${S(3.5)}><circle cx="-20" cy="-290" r="17"/><circle cx="20" cy="-290" r="17"/><path d="M-3,-292 Q0,-296 3,-292 M-37,-292 L-54,-298 M37,-292 L54,-298"/></g>`;
  if (o.armsFront) s += tube(L, 'dish') + tube(R, 'dish');
  if (!o.noHands) s += hand(L[L.length - 1]) + hand(R[R.length - 1]);
  return s;
}

// ---------- Maryam: Omani schoolgirl, white hijab + uniform dress ----------
export function girl(o = {}) {
  const L = o.l || [[-60, -206], [-86, -146], [-74, -90]], R = o.r || [[60, -206], [86, -146], [74, -90]];
  const dk = o.dress || 'dress';
  let s = '';
  for (const sx of [-1, 1]) s += `<path d="M${sx * 6},-2 Q${sx * 4},-20 ${sx * 28},-20 Q${sx * 52},-20 ${sx * 52},-2 Z" fill="${f('shoe')}" ${S()}/>`;
  s += `<path d="M-30,-230 Q-60,-226 -66,-204 L-86,-22 Q-86,-10 -72,-10 L72,-10 Q86,-10 86,-22 L66,-204 Q60,-226 30,-230 Z" fill="${f(dk)}" ${S()}/>`;
  if (o.coat) {
    s += `<path d="M-22,-226 L0,-150 L22,-226" fill="${f('dress2')}" ${S(3)}/><path d="M0,-150 L0,-14" ${S(3)}/>`;
    s += `<rect x="28" y="-150" width="30" height="30" rx="4" fill="${f('coat')}" ${S(3)}/><path d="M36,-150 L36,-165" stroke="${f('blue')}" stroke-width="5" stroke-linecap="round"/><path d="M36,-150 L36,-165" fill="none" ${S(1.5)}/>`;
    s += `<rect x="-58" y="-170" width="34" height="20" rx="3" fill="${f('star')}" ${S(2.5)}/>`;
  } else {
    s += `<rect x="-74" y="-140" width="148" height="16" fill="${f('dress2')}" ${S(3)}/>`;
    s += `<path d="M-30,-90 L-36,-18 M30,-90 L36,-18" fill="none" ${S(2.4)}/>`;
    for (const by of [-200, -175, -155]) s += `<circle cx="0" cy="${by}" r="4" fill="${f('dress2')}" ${S(2)}/>`;
  }
  s += `<path d="M-64,-300 C-66,-378 66,-378 64,-300 L72,-210 Q0,-184 -72,-210 Z" fill="${f('hijab')}" ${S()}/>`;
  s += `<path d="M-40,-236 Q0,-214 40,-236" fill="none" ${S(2.4)}/>`;
  s += `<ellipse cx="0" cy="-292" rx="44" ry="50" fill="${f('skin')}" ${S()}/>`;
  s += `<path d="M-44,-300 C-40,-338 40,-338 44,-300" fill="none" ${S(2.4)}/>`;
  s += g(0, -288, 0.95, face(o));
  s += tube(L, dk) + tube(R, dk);
  if (!o.noHands) s += hand(L[L.length - 1]) + hand(R[R.length - 1]);
  return s;
}
export const dentist = (o = {}) => boy({ ...o, coat: true, glasses: true });
// Hamad: Salem's friend (different kumma embroidery)
export const friend = (o = {}) => boy({ ...o, alt: true });

// ---------- tooth mascot "سنّون" ----------
export const TOOTH = 'M-52,-38 C-54,-78 -22,-84 0,-68 C22,-84 54,-78 52,-38 C50,-8 44,12 40,42 C36,74 22,80 15,56 C9,36 -9,36 -15,56 C-22,80 -36,74 -40,42 C-44,12 -50,-8 -52,-38 Z';
export function tooth(o = {}) {
  let s = '';
  if (o.arms) for (const sx of [-1, 1]) {
    const pts = o.arms[sx < 0 ? 0 : 1] || [[sx * 46, -6], [sx * 76, 8]];
    s += tube(pts, 'tooth', 12) + `<circle cx="${pts[pts.length - 1][0]}" cy="${pts[pts.length - 1][1]}" r="9" fill="${f('tooth')}" ${S(3)}/>`;
  }
  if (o.feet) for (const sx of [-1, 1]) s += `<ellipse cx="${sx * 30}" cy="76" rx="18" ry="9" fill="${f(o.shoe || 'brush')}" ${S(3)}/>`;
  const fill = o.sad && isColor() ? '#e9e4cf' : f('tooth');
  s += `<path d="${TOOTH}" fill="${fill}" ${S()}/>`;
  if (isColor() && !o.sad) s += `<path d="M-38,-44 C-38,-62 -24,-66 -14,-60" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M44,-30 C44,0 38,20 34,44" fill="none" stroke="${PAL.toothShade}" stroke-width="8" stroke-linecap="round"/>`;
  if (o.cavity) s += `<path d="M18,-58 q10,-4 14,6 q2,10 -8,12 q-12,0 -6,-18z" fill="${isColor() ? '#6b4f3a' : '#fff'}" ${S(3)}/><path d="M-30,20 q8,-6 12,2 q2,8 -6,9 q-9,-1 -6,-11z" fill="${isColor() ? '#6b4f3a' : '#fff'}" ${S(3)}/>`;
  s += g(0, -24, 0.78, face({ ...o, eyeX: 19, noNose: true, mouth: o.sad ? 'sad' : (o.mouth || 'smile') }));
  if (o.sparkle) s += sparkle(66, -66, 14) + sparkle(-70, -40, 10);
  return s;
}

export const sparkle = (x, y, r, k = 'star') => `<path d="M${x},${y - r} Q${x + r * 0.18},${y - r * 0.18} ${x + r},${y} Q${x + r * 0.18},${y + r * 0.18} ${x},${y + r} Q${x - r * 0.18},${y + r * 0.18} ${x - r},${y} Q${x - r * 0.18},${y - r * 0.18} ${x},${y - r} Z" fill="${f(k)}" ${S(2.5)}/>`;
export const star5 = (x, y, r, k = 'star', w = 3) => {
  let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; d += (i ? 'L' : 'M') + (x + Math.cos(a) * rr).toFixed(1) + ',' + (y + Math.sin(a) * rr).toFixed(1); }
  return `<path d="${d}Z" fill="${f(k)}" ${S(w)}/>`;
};

// ---------- objects (local origin roughly centre) ----------
// toothbrush along +x; bristles up. length ~220
export function toothbrush(o = {}) {
  let s = `<path d="M0,-7 Q-7,0 0,7 L150,6 Q163,5 172,7 L214,7 Q221,7 221,0 Q221,-8 213,-8 L172,-8 Q163,-6 150,-6 Z" fill="${f(o.k || 'brush')}" ${S()}/>`;
  s += `<rect x="22" y="-4" width="60" height="8" rx="4" fill="${f('brush2')}" ${S(2)}/>`;
  s += `<rect x="173" y="-34" width="42" height="26" rx="3" fill="${f('bristle')}" ${S(3)}/>`;
  for (let x = 180; x < 214; x += 7) s += `<path d="M${x},-32 L${x},-10" ${S(1.6)}/>`;
  if (o.paste) s += `<path d="M176,-36 C178,-50 196,-52 200,-44 C206,-52 216,-44 212,-36 Z" fill="${f('paste')}" ${S(2.6)}/>`;
  return s;
}
export function pasteTube(o = {}) {
  let s = `<rect x="-40" y="-96" width="80" height="16" rx="3" fill="${f('tubeCap')}" ${S()}/>`;
  for (let x = -32; x <= 32; x += 8) s += `<path d="M${x},-94 L${x},-82" ${S(1.6)}/>`;
  s += `<path d="M-38,-80 L38,-80 L26,52 L-26,52 Z" fill="${f('tube')}" ${S()}/>`;
  s += `<path d="M-34,-40 L34,-40 L31,-6 L-31,-6 Z" fill="${f('paste')}" ${S(2.5)}/>`;
  s += `<rect x="-14" y="52" width="28" height="26" rx="4" fill="${f('tubeCap')}" ${S()}/>`;
  s += g(0, 24, 0.22, `<path d="${TOOTH}" fill="${f('tooth')}" ${S(10)}/>`);
  if (o.label !== false) s += `<text x="0" y="-17" text-anchor="middle" font-family="Cairo, Tajawal" font-weight="800" font-size="17" fill="${INK}">فلورايد</text>`;
  return s;
}
export function cup(k = 'brush2') {
  return `<path d="M-34,-50 L34,-50 L26,40 Q0,48 -26,40 Z" fill="${f(k)}" ${S()}/><path d="M-32,-30 L32,-30" ${S(2.5)}/>`;
}
export function waterBottle() {
  let s = `<rect x="-14" y="-92" width="28" height="18" rx="3" fill="${f('blue')}" ${S()}/>`;
  s += `<path d="M-14,-74 Q-30,-62 -30,-44 L-30,58 Q-30,70 -18,70 L18,70 Q30,70 30,58 L30,-44 Q30,-62 14,-74 Z" fill="${f('water')}" ${S()}/>`;
  s += `<rect x="-30" y="-10" width="60" height="30" fill="${f('paper')}" ${S(2.5)}/><path d="M-12,5 q6,-12 12,0 q6,12 12,0" fill="none" ${S(2.4)}/>`;
  return s;
}
export function soda() {
  let s = `<path d="M-30,-60 Q-30,-70 -22,-70 L22,-70 Q30,-70 30,-60 L30,60 Q30,70 22,70 L-22,70 Q-30,70 -30,60 Z" fill="${f('soda')}" ${S()}/>`;
  s += `<path d="M-30,-52 L30,-52 M-30,52 L30,52" ${S(2.5)}/><path d="M-16,-10 q16,-22 32,0 q-16,22 -32,0" fill="${f('paper')}" ${S(2.5)}/>`;
  return s;
}
export function apple() {
  return `<path d="M0,-40 C-30,-60 -64,-36 -56,4 C-50,40 -24,58 0,46 C24,58 50,40 56,4 C64,-36 30,-60 0,-40 Z" fill="${f('apple')}" ${S()}/>` +
    `<path d="M0,-40 Q2,-56 8,-64" fill="none" ${S()}/><path d="M8,-58 Q30,-74 40,-56 Q22,-44 8,-58 Z" fill="${f('leaf')}" ${S(3)}/>` +
    (isColor() ? `<path d="M-36,-18 Q-38,-34 -24,-40" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7"/>` : '');
}
export function carrot() {
  let s = `<path d="M-14,-46 Q-24,-50 -22,-36 L-2,66 Q2,74 6,66 L22,-36 Q24,-50 14,-46 Z" fill="${f('carrot')}" ${S()}/>`;
  s += `<path d="M-14,-12 L-4,-12 M8,10 L16,10 M-8,30 L2,30" ${S(2.5)}/>`;
  s += `<path d="M0,-46 Q-24,-80 -14,-88 Q2,-70 0,-46 Q10,-82 24,-82 Q20,-58 0,-46 Z" fill="${f('leaf')}" ${S(3)}/>`;
  return s;
}
export function banana() {
  return `<path d="M-60,-30 Q-56,-40 -50,-34 Q-30,30 40,14 Q60,8 64,14 Q50,44 0,44 Q-50,40 -60,-30 Z" fill="${f('banana')}" ${S()}/><path d="M-50,-24 Q-30,30 40,24" fill="none" ${S(2.4)}/><path d="M-62,-30 L-56,-42" ${S(6)}/>`;
}
export function cheese() {
  let s = `<path d="M-60,30 L-60,-8 L50,-40 L60,-8 L60,30 Z" fill="${f('cheese')}" ${S()}/><path d="M-60,-8 L60,-8" ${S(3)}/>`;
  for (const [x, y, r] of [[-30, 10, 8], [10, 16, 6], [36, 4, 7], [16, -22, 5]]) s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${isColor() ? '#f4b400' : '#fff'}" ${S(2.4)}/>`;
  return s;
}
export function laban() {
  let s = `<path d="M-30,-40 L30,-40 L30,64 Q30,72 22,72 L-22,72 Q-30,72 -30,64 Z" fill="${f('milk')}" ${S()}/>`;
  s += `<path d="M-30,-40 L-18,-66 L18,-66 L30,-40" fill="${f('laban')}" ${S()}/><rect x="-12" y="-80" width="24" height="14" rx="3" fill="${f('blue')}" ${S(3)}/>`;
  s += `<rect x="-30" y="0" width="60" height="34" fill="${f('laban')}" ${S(2.5)}/>`;
  s += `<text x="0" y="24" text-anchor="middle" font-family="Cairo, Tajawal" font-weight="800" font-size="20" fill="${INK}">حليب</text>`;
  return s;
}
export function yogurt() {
  let s = `<path d="M-46,-24 L46,-24 L36,44 Q0,52 -36,44 Z" fill="${f('laban')}" ${S()}/><rect x="-52" y="-38" width="104" height="16" rx="6" fill="${f('paper')}" ${S()}/>`;
  s += `<text x="0" y="18" text-anchor="middle" font-family="Cairo, Tajawal" font-weight="800" font-size="20" fill="${INK}">زبادي</text>`;
  return s;
}
export function cucumber() {
  return `<path d="M-64,-8 Q-70,-24 -50,-26 L50,-20 Q70,-18 64,0 Q58,14 40,14 L-48,10 Q-64,8 -64,-8 Z" fill="${f('cucumber')}" ${S()}/>` +
    [-36, -10, 16, 40].map(x => `<circle cx="${x}" cy="${-6 + (x % 3)}" r="2.6" fill="${INK}"/>`).join('');
}
export function candy() {
  return `<path d="M-30,0 L-62,-24 L-58,24 Z" fill="${f('candy2')}" ${S()}/><path d="M30,0 L62,-24 L58,24 Z" fill="${f('candy2')}" ${S()}/>` +
    `<ellipse cx="0" cy="0" rx="34" ry="26" fill="${f('candy')}" ${S()}/><path d="M-18,-18 Q0,0 -12,22 M6,-24 Q22,0 10,24" fill="none" ${S(2.5)}/>`;
}
export function lollipop() {
  let s = `<path d="M0,30 L0,110" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M0,30 L0,110" stroke="${f('paper')}" stroke-width="6" stroke-linecap="round"/>`;
  s += `<circle cx="0" cy="-10" r="44" fill="${f('candy')}" ${S()}/><path d="M0,-10 m-30,0 a30,30 0 1,1 30,30 a20,20 0 1,1 -20,-20 a10,10 0 1,1 10,10" fill="none" stroke="${isColor() ? '#fff' : INK}" stroke-width="5"/>`;
  return s;
}
export function donut() {
  return `<ellipse cx="0" cy="0" rx="62" ry="50" fill="${f('donut')}" ${S()}/><path d="M-54,-6 Q-56,-44 0,-44 Q56,-44 54,-6 Q40,10 20,0 Q0,16 -20,2 Q-40,12 -54,-6 Z" fill="${f('icing')}" ${S(3)}/>` +
    `<ellipse cx="0" cy="-6" rx="18" ry="12" fill="#fff" ${S(3)}/>` + [[-34, -24, 20], [30, -26, -30], [-10, -34, 70], [40, -10, 10]].map(([x, y, r]) => `<rect x="${x}" y="${y}" width="12" height="4" rx="2" transform="rotate(${r} ${x} ${y})" fill="${f('candy2')}" ${S(1.5)}/>`).join('');
}
export function chips() {
  return `<path d="M-44,-60 L44,-60 L38,0 L44,60 L-44,60 L-38,0 Z" fill="${f('brush2')}" ${S()}/><path d="M-44,-60 l8,-8 l8,8 l8,-8 l8,8 l8,-8 l8,8 l8,-8 l8,8 l8,-8 l8,8" fill="none" ${S(2.4)}/>` +
    `<circle cx="0" cy="4" r="24" fill="${f('cheese')}" ${S(3)}/><text x="0" y="48" text-anchor="middle" font-family="Cairo, Tajawal" font-weight="800" font-size="16" fill="${INK}">رقائق</text>`;
}
export function dates() { // bowl of dates (Omani touch)
  let s = '';
  for (const [x, y, r] of [[-30, -18, -20], [0, -26, 10], [28, -16, 25], [-14, -6, 0], [16, -4, -10]]) s += `<ellipse cx="${x}" cy="${y}" rx="16" ry="10" transform="rotate(${r} ${x} ${y})" fill="${f('choco')}" ${S(3)}/>`;
  return s + `<path d="M-64,-4 L64,-4 Q58,40 0,44 Q-58,40 -64,-4 Z" fill="${f('wood')}" ${S()}/><path d="M-40,14 Q0,24 40,14" fill="none" ${S(2.2)}/>`;
}
export function floss() {
  return `<rect x="-40" y="-36" width="80" height="72" rx="14" fill="${f('brush')}" ${S()}/><circle cx="0" cy="0" r="18" fill="${f('paper')}" ${S(3)}/>` +
    `<text x="0" y="28" text-anchor="middle" font-family="Cairo, Tajawal" font-weight="800" font-size="13" fill="${INK}">خيط</text>`;
}
export function germ(o = {}) {
  const n = 12, R = 46; let d = '';
  for (let i = 0; i <= n; i++) {
    const a = i / n * Math.PI * 2, a2 = (i + 0.5) / n * Math.PI * 2;
    const p = [Math.cos(a) * R, Math.sin(a) * R], q = [Math.cos(a2) * (R + 18), Math.sin(a2) * (R + 18)], p2 = [Math.cos((i + 1) / n * Math.PI * 2) * R, Math.sin((i + 1) / n * Math.PI * 2) * R];
    if (i === 0) d += `M${p[0].toFixed(1)},${p[1].toFixed(1)}`;
    if (i < n) d += ` Q${q[0].toFixed(1)},${q[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  let s = `<path d="${d}Z" fill="${f(o.k || 'germ')}" ${S()}/>`;
  s += `<circle cx="-16" cy="-6" r="10" fill="#fff" ${S(3)}/><circle cx="16" cy="-6" r="10" fill="#fff" ${S(3)}/><circle cx="-14" cy="-4" r="4.5" fill="${INK}"/><circle cx="18" cy="-4" r="4.5" fill="${INK}"/>`;
  s += `<path d="M-28,-22 L-6,-14 M28,-22 L6,-14" ${S(3.5)}/><path d="M-16,18 Q0,8 16,18 L12,24 L6,18 L0,25 L-6,18 L-12,24 Z" fill="#fff" ${S(3)}/>`;
  return s;
}
export function ball() {
  let s = `<circle cx="0" cy="0" r="50" fill="${f('ball')}" ${S()}/>`;
  s += `<path d="M0,-16 L15,-5 L9,13 L-9,13 L-15,-5 Z" fill="${isColor() ? INK : '#fff'}" ${S(3)}/>`;
  for (const a of [-90, -18, 54, 126, 198]) { const r = a * Math.PI / 180; s += `<path d="M${(Math.cos(r) * 16).toFixed(1)},${(Math.sin(r) * 16).toFixed(1)} L${(Math.cos(r) * 38).toFixed(1)},${(Math.sin(r) * 38).toFixed(1)}" ${S(3)}/>`; }
  return s;
}
export function mouthguard() {
  return `<path d="M-60,-10 Q-60,40 0,44 Q60,40 60,-10 Q44,-12 40,10 Q0,30 -40,10 Q-44,-12 -60,-10 Z" fill="${f('guard')}" ${S()}/><path d="M-30,18 L-26,30 M0,24 L0,36 M30,18 L26,30" ${S(2.4)}/>`;
}
export function hourglass() {
  let s = `<rect x="-60" y="-110" width="120" height="18" rx="6" fill="${f('wood')}" ${S()}/><rect x="-60" y="92" width="120" height="18" rx="6" fill="${f('wood')}" ${S()}/>`;
  s += `<path d="M-46,-92 L46,-92 Q46,-40 8,0 Q46,40 46,92 L-46,92 Q-46,40 -8,0 Q-46,-40 -46,-92 Z" fill="${f('glass')}" ${S()}/>`;
  s += `<path d="M-30,-60 L30,-60 Q24,-30 0,-4 Q-24,-30 -30,-60 Z" fill="${f('sand')}" ${S(2.5)}/><path d="M-34,92 Q0,40 34,92 Z" fill="${f('sand')}" ${S(2.5)}/><path d="M0,-4 L0,60" ${S(2)}/>`;
  return s;
}
export function clock(min = 2) {
  let s = `<circle cx="0" cy="0" r="70" fill="${f('paper')}" ${S(5)}/>`;
  for (let i = 0; i < 12; i++) { const a = i * 30 * Math.PI / 180; s += `<path d="M${(Math.sin(a) * 58).toFixed(1)},${(-Math.cos(a) * 58).toFixed(1)} L${(Math.sin(a) * 64).toFixed(1)},${(-Math.cos(a) * 64).toFixed(1)}" ${S(3)}/>`; }
  s += `<path d="M0,0 L0,-50" ${S(5)}/><path d="M0,0 L${(Math.sin(min * 6 * Math.PI / 180) * 40).toFixed(1)},${(-Math.cos(min * 6 * Math.PI / 180) * 40).toFixed(1)}" ${S(6)}/><circle r="5" fill="${INK}"/>`;
  return s;
}
export function sink() {
  let s = `<rect x="-200" y="0" width="400" height="40" rx="10" fill="${f('wood')}" ${S()}/>`;
  s += `<path d="M-150,0 Q-150,90 0,90 Q150,90 150,0 Z" fill="${f('sink')}" ${S()}/>`;
  s += `<path d="M-20,0 L-20,-60 Q-20,-80 0,-80 L50,-80 L50,-60 L10,-60 L10,0" fill="${f('sink')}" ${S()}/>`;
  s += `<rect x="-200" y="40" width="400" height="160" fill="${f('wood')}" ${S()}/><path d="M0,40 L0,200" ${S(3)}/><circle cx="-20" cy="120" r="6" fill="#fff" ${S(2.5)}/><circle cx="20" cy="120" r="6" fill="#fff" ${S(2.5)}/>`;
  return s;
}
export function mirror(w = 300, h = 360) {
  return `<rect x="${-w / 2 - 18}" y="${-h / 2 - 18}" width="${w + 36}" height="${h + 36}" rx="40" fill="${f('wood')}" ${S()}/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="28" fill="${f('mirror')}" ${S()}/>` +
    `<path d="M${-w / 2 + 30},${-h / 2 + 90} L${-w / 2 + 90},${-h / 2 + 30} M${-w / 2 + 30},${-h / 2 + 140} L${-w / 2 + 140},${-h / 2 + 30}" stroke="${isColor() ? '#fff' : INK}" stroke-width="${isColor() ? 10 : 3}" stroke-linecap="round"/>`;
}
export function cloud(x, y, s = 1) {
  return g(x, y, s, `<path d="M-80,20 Q-100,20 -96,0 Q-92,-22 -66,-18 Q-60,-50 -24,-44 Q0,-70 30,-46 Q66,-52 70,-20 Q100,-18 96,6 Q92,22 74,20 Z" fill="${f('paper')}" ${S()}/>`);
}
export function sun(x, y, s = 1) {
  let r = '';
  for (let i = 0; i < 12; i++) { const a = i * 30 * Math.PI / 180; r += `<path d="M${(Math.cos(a) * 52).toFixed(1)},${(Math.sin(a) * 52).toFixed(1)} L${(Math.cos(a) * 72).toFixed(1)},${(Math.sin(a) * 72).toFixed(1)}" ${S(5)}/>`; }
  return g(x, y, s, r + `<circle r="40" fill="${f('star')}" ${S()}/><circle cx="-13" cy="-6" r="4.5" fill="${INK}"/><circle cx="13" cy="-6" r="4.5" fill="${INK}"/><path d="M-14,10 Q0,22 14,10" fill="none" ${S(3.5)}/>`);
}
export function moon(x, y, s = 1) {
  return g(x, y, s, `<path d="M10,-50 A50,50 0 1,0 40,30 A40,40 0 1,1 10,-50 Z" fill="${f('star')}" ${S()}/>`);
}
export function heart(x, y, s = 1, k = 'red') {
  return g(x, y, s, `<path d="M0,30 C-50,-6 -36,-44 -12,-40 Q0,-38 0,-24 Q0,-38 12,-40 C36,-44 50,-6 0,30 Z" fill="${f(k)}" ${S()}/>`);
}
export function check(x, y, s = 1) {
  return g(x, y, s, `<circle r="40" fill="${f('green')}" ${S()}/><path d="M-18,0 L-4,14 L20,-14" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`);
}
export function cross(x, y, s = 1) {
  return g(x, y, s, `<circle r="40" fill="${f('red')}" ${S()}/><path d="M-14,-14 L14,14 M14,-14 L-14,14" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round"/>`);
}
// simple seeded RNG
export function rng(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
