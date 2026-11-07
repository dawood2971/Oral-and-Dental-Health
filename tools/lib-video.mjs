// Motion-graphics MP4 (1080x1080, silent, on-screen captions) + scene list used by the script/storyboard.
import * as A from './art.mjs';
import { LOGO, CREDIT, CSS } from './render.mjs';
import { IC, TOPICS, MINI } from './lib-content.mjs';
import { browser, close } from './lib-render.mjs';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const { g, INK } = A;
A.setMode('color');
const FPS = 24;

const INTRO = {
  floss: 'الفرشاة لا تصل إلى ما بين الأسنان، وهنا يأتي دور الخيط!',
  caries: 'هل تساءلت كيف تظهر السوسة في السن؟ تعال نرى ماذا يحدث داخل فمك.',
  visit: 'زيارة طبيب الأسنان ليست مخيفة أبداً، بل هي سرّ الابتسامة الصحية!',
  habits: 'مرحباً! أنا سالم. هل تعرف أن فمك هو بوابة صحة جسمك كله؟ تعال نتعلّم سبع عادات تحمي أسنانك.',
  brushing: 'أنا سالم، وهذا صديقي سنّون. هل تفرّش أسنانك بالطريقة الصحيحة؟ تابع معنا ست خطوات في دقيقتين فقط.',
  myths: 'سمعنا كلاماً كثيراً عن الأسنان، لكن هل كله صحيح؟ هيا نلعب: صح أم خطأ؟',
  chart: 'عندي لك تحدٍّ يا بطل! سبعة أيام من التفريش صباحاً ومساءً. هل أنت مستعد؟',
  breath: 'لا أحد يحب رائحة الفم الكريهة! إليك ثماني عادات تجعل نَفَسك منعشاً كل يوم.',
  injury: 'أثناء اللعب قد يسقط سن أو ينكسر. لا تخف! تعلّم ماذا تفعل خطوة بخطوة.',
};
const OUTRO = {
  floss: 'الخيط مرة كل يوم، والفرشاة مرتين. ابتسامتك في أمان!',
  caries: 'قلّل السكريات، وفرّش بمعجون فيه فلورايد، وأوقف السوسة قبل أن تبدأ.',
  visit: 'اطلب من أهلك حجز موعدك كل ستة أشهر، وابتسم بثقة!',
  habits: 'اختر عادة واحدة وابدأ بها اليوم. ابتسامتك تستحق!',
  brushing: 'مرتين يومياً، دقيقتان في كل مرة. جرّبها الليلة قبل النوم!',
  myths: 'الآن تعرف الحقيقة. شارك ما تعلّمته مع أصدقائك وعائلتك.',
  chart: 'علّق الجدول في غرفتك، ولوّن كل يوم، وسلّمه لسفير صحة الفم في صفّك.',
  breath: 'نَفَس منعش يبدأ من فرشاة ولسان نظيف وماء كثير.',
  injury: 'تذكّر: اهدأ، أمسك السن من التاج، ضعه في الحليب، واذهب للطبيب فوراً. وألبس الواقي في الرياضة!',
};

// Build the scene list for a topic: [{kind, dur, title, text, icon, n, vo}]
export function scenes(t) {
  const S = [{ kind: 'intro', dur: 4.5, title: t.title, text: t.sub, vo: INTRO[t.slug] }];
  if (t.slug === 'myths') t.myths.forEach(([k, m, f], i) => S.push({ kind: 'myth', dur: 5.2, n: i + 1, icon: k, title: m, text: f, vo: `هل صحيح أن ${m.replace(/\.$/, '')}؟ خطأ! ${f}` }));
  else t.items.forEach(([k, h, p], i) => S.push({ kind: 'item', dur: t.mini ? 3.6 : 3.8, n: i + 1, icon: k, title: h, text: p, vo: `${h}. ${p}` }));
  if (t.slug === 'injury') {
    S.push({ kind: 'item', dur: 4.2, n: '!', icon: 'broken', title: 'وإذا انكسر جزء من السن؟', text: 'احفظ القطعة في ماء أو حليب، واذهب للطبيب مباشرة، فقد يُلصقها.', vo: 'وإذا انكسر جزء من السن؟ احفظ القطعة في ماء أو حليب واذهب لطبيب الأسنان مباشرة، فقد يتمكن من إلصاقها.' });
    S.push({ kind: 'item', dur: 3.8, n: '✓', icon: 'guard', title: t.prevent[1], text: t.prevent[2], vo: `والأهم: ${t.prevent[1]} ${t.prevent[2]}` });
  }
  if (t.slug === 'brushing') S.push({ kind: 'item', dur: 3.8, n: '✓', icon: 'paste', title: 'معجون بالفلورايد', text: 'بحجم حبة البازلاء، ثم ابصقه ولا تشطف بكثرة.', vo: 'استخدم معجوناً بالفلورايد بحجم حبة البازلاء، ثم ابصقه ولا تشطف فمك بكثرة.' });
  S.push({ kind: 'outro', dur: 4.8, title: t.question, text: OUTRO[t.slug], vo: OUTRO[t.slug] });
  let at = 0; for (const s of S) { s.at = at; at += s.dur; }
  return S;
}

const css = `
body{margin:0;background:#000}
#v{width:1080px;height:1080px;position:relative;overflow:hidden;background:var(--bg)}
.lh{position:absolute;top:0;left:0;right:0;height:120px;background:#fff;border-bottom:7px solid ${INK};display:flex;align-items:center;justify-content:center;z-index:5}.lh img{height:88px}
.ft{position:absolute;bottom:0;left:0;right:0;height:56px;background:${INK};color:#fff;font-family:Cairo;font-weight:700;font-size:21px;display:flex;align-items:center;justify-content:center;z-index:5}
.sc{position:absolute;top:127px;bottom:56px;left:0;right:0;opacity:0}
.a{position:absolute;will-change:transform,opacity}
.big{font-family:Lalezar;font-size:92px;line-height:1.05;color:var(--c1);-webkit-text-stroke:6px ${INK};paint-order:stroke fill;text-align:center;left:60px;right:60px}
.mid{font-family:Cairo;font-weight:900;font-size:56px;line-height:1.25;text-align:center;left:70px;right:70px;color:${INK}}
.txt{font-family:Cairo;font-weight:800;font-size:38px;line-height:1.45;text-align:center;left:90px;right:90px;color:#333}
.num{width:120px;height:120px;border-radius:50%;background:var(--c1);color:#fff;border:7px solid ${INK};font-family:Cairo;font-weight:900;font-size:64px;display:flex;align-items:center;justify-content:center;box-shadow:7px 7px 0 ${INK}}
.card{background:#fff;border:7px solid ${INK};border-radius:44px;box-shadow:10px 10px 0 ${INK}}
.stamp{font-family:Cairo;font-weight:900;font-size:50px;color:#fff;border:6px solid ${INK};border-radius:20px;padding:0 28px}
.dots{position:absolute;bottom:22px;left:0;right:0;display:flex;justify-content:center;gap:14px}
.dots i{width:20px;height:20px;border-radius:50%;border:4px solid ${INK};background:#fff}
.dots i.on{background:var(--c1)}
.a svg{flex:none}
.blob{position:absolute;border-radius:50%;background:var(--c2);opacity:.7}
`;
const el = (cls, style, inner, anim) => `<div class="a ${cls}" style="${style}" data-anim='${JSON.stringify(anim)}'>${inner}</div>`;
const svg = (k, s) => `<svg viewBox="-110 -110 220 220" width="${s}" height="${s}">${IC[k]()}</svg>`;

function sceneHtml(t, s, i, total) {
  const wave = [[60, -212], [104, -262], [114, -330]];
  const dots = s.kind === 'item' || s.kind === 'myth' ? `<div class="dots">${Array.from({ length: total }, (_, j) => `<i class="${j < i ? 'on' : ''}"></i>`).join('')}</div>` : '';
  let h = `<div class="blob" style="width:520px;height:520px;right:-160px;top:-120px"></div><div class="blob" style="width:380px;height:380px;left:-120px;bottom:-80px"></div>`;
  if (s.kind === 'intro') {
    h += el('big', 'top:40px', s.title, { t: 0.2, fx: 'pop' });
    h += el('', 'left:520px;top:335px', `<svg viewBox="-110 -380 220 400" width="300" height="545">${A.boy({ mouth: 'grin', r: wave })}</svg>`, { t: 0.6, fx: 'right' });
    h += el('', 'left:180px;top:500px', `<svg viewBox="-100 -100 200 200" width="300" height="300">${A.tooth({ mouth: 'grin', arms: [[[-46, -6], [-80, -40]], [[46, -6], [80, -40]]], feet: true, sparkle: true })}</svg>`, { t: 1.0, fx: 'bounce' });
    h += el('txt', 'top:205px', s.text, { t: 1.6, fx: 'up' });
  } else if (s.kind === 'item') {
    h += el('num', 'right:70px;top:46px', s.n, { t: 0.05, fx: 'pop' });
    h += el('card', 'left:250px;top:60px;width:580px;height:470px;display:flex;align-items:center;justify-content:center', svg(s.icon, 420), { t: 0.25, fx: 'zoom', wob: 1 });
    h += el('mid', 'top:570px', s.title, { t: 0.7, fx: 'up' });
    h += el('txt', 'top:660px', s.text, { t: 1.1, fx: 'fade' });
  } else if (s.kind === 'myth') {
    h += el('num', 'right:70px;top:40px', s.n, { t: 0.05, fx: 'pop' });
    h += el('card', 'left:90px;right:220px;top:40px;height:330px;padding:30px 40px;display:flex;align-items:center;gap:30px;background:#ffe3e3', `${svg(s.icon, 200)}<div style="font-family:Cairo;font-weight:900;font-size:48px;line-height:1.35">${s.title}</div>`, { t: 0.2, fx: 'zoom' });
    h += el('stamp', `left:110px;top:330px;background:${A.PAL.red};transform-origin:center`, '✗ خطأ', { t: 1.4, fx: 'stamp' });
    h += el('card', `left:90px;right:90px;top:450px;height:370px;padding:30px 44px;background:#e6f7ee;display:flex;flex-direction:column;justify-content:center;gap:14px`, `<span class="stamp" style="background:${A.PAL.green};align-self:flex-start;font-size:42px">✓ الحقيقة</span><div style="font-family:Cairo;font-weight:800;font-size:44px;line-height:1.45">${s.text}</div>`, { t: 2.2, fx: 'up' });
  } else {
    h += el('', 'left:90px;top:120px', `<svg viewBox="-110 -380 220 400" width="300" height="545">${A.boy({ mouth: 'grin', r: wave })}</svg>`, { t: 0.1, fx: 'left' });
    h += el('card', 'left:420px;right:60px;top:70px;padding:34px 40px;font-family:Cairo;font-weight:900;font-size:50px;line-height:1.35;text-align:center', s.title, { t: 0.5, fx: 'pop' });
    h += el('txt', 'left:420px;right:60px;top:430px;text-align:center', s.text, { t: 1.2, fx: 'up' });
    h += el('', 'left:60px;right:60px;top:700px;text-align:center;font-family:Cairo;font-weight:800;font-size:28px;color:#333', 'قسم تعزيز الصحة · برنامج الصحة المدرسية والجامعية', { t: 1.8, fx: 'fade' });
  }
  return `<div class="sc" data-at="${s.at}" data-dur="${s.dur}">${h}${dots}</div>`;
}

const SEEK = `
const ease=x=>1-Math.pow(1-x,3), back=x=>{const c=1.70158+1;return 1+c*Math.pow(x-1,3)+1.70158*Math.pow(x-1,2)};
window.seek=function(T){
 for(const sc of document.querySelectorAll('.sc')){
  const at=+sc.dataset.at,du=+sc.dataset.dur,l=T-at;
  const vis=l>=-0.001&&l<du; const fo=Math.min(1,Math.max(0,(du-l)/0.35)); const fi=Math.min(1,Math.max(0,l/0.25));
  sc.style.opacity=vis?Math.min(fo,fi):0; if(!vis)continue;
  for(const e of sc.querySelectorAll('[data-anim]')){
   const a=JSON.parse(e.dataset.anim); const p=Math.min(1,Math.max(0,(l-a.t)/0.55)); const q=ease(p),b=back(p);
   let tr='',op=p>0?1:0;
   if(a.fx==='pop')tr='scale('+(0.3+0.7*b)+')';
   if(a.fx==='zoom')tr='scale('+(0.6+0.4*b)+')';
   if(a.fx==='up'){tr='translateY('+(60*(1-q))+'px)';op=q}
   if(a.fx==='fade')op=q;
   if(a.fx==='right')tr='translateX('+(500*(1-q))+'px)';
   if(a.fx==='left')tr='translateX('+(-500*(1-q))+'px)';
   if(a.fx==='bounce')tr='translateY('+(-400*(1-q))+'px) translateY('+(-Math.abs(Math.sin(l*3))*18*(p>=1?1:0))+'px)';
   if(a.fx==='stamp')tr='rotate(-8deg) scale('+(2.2-1.2*b)+')';
   if(a.wob&&p>=1)tr+=' rotate('+(Math.sin((l-a.t)*2.6)*2.5)+'deg)';
   e.style.transform=tr; e.style.opacity=op;
  }
 }
};`;

export function videoHtml(t) {
  const S = scenes(t), items = S.filter(s => s.kind === 'item' || s.kind === 'myth').length;
  let k = 0;
  const body = `<div id="v" style="${t.vars}"><div class="lh"><img src="${LOGO}"></div>${S.map(s => sceneHtml(t, s, (s.kind === 'item' || s.kind === 'myth') ? ++k : 0, items)).join('')}<div class="ft">${CREDIT}</div></div><script>${SEEK}</script>`;
  return { S, html: `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>${CSS}${css}</style></head><body>${body}</body></html>` };
}

export async function renderVideo(t, mp4, thumbsDir) {
  const { S, html } = videoHtml(t);
  const total = S.reduce((a, s) => a + s.dur, 0);
  const p = await (await browser()).newPage({ viewport: { width: 1080, height: 1080 } });
  await p.setContent(html, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-preset', 'medium', '-movflags', '+faststart', mp4], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round(total * FPS);
  for (let i = 0; i < n; i++) {
    await p.evaluate(T => window.seek(T), i / FPS);
    const buf = await p.screenshot({ type: 'jpeg', quality: 88 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise((r, j) => ff.on('close', c => c ? j(new Error('ffmpeg ' + c)) : r()));
  if (thumbsDir) {
    fs.mkdirSync(thumbsDir, { recursive: true });
    for (const [i, s] of S.entries()) {
      await p.evaluate(T => window.seek(T), s.at + s.dur - 0.5);
      s.thumb = `${thumbsDir}/scene-${i + 1}.jpg`;
      await p.screenshot({ path: s.thumb, type: 'jpeg', quality: 80 });
    }
  }
  await p.close();
  return { S, total };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const OUT = process.argv[2] || '../out', only = process.argv[3];
  for (const t of [...TOPICS, ...MINI.map(m => ({ ...m, mini: true }))]) {
    if (only && !only.split(',').includes(t.slug)) continue;
    const dir = `${OUT}/${t.id}`; fs.mkdirSync(dir, { recursive: true });
    const { total } = await renderVideo(t, `${dir}/فيديو.mp4`, `${OUT}/_thumbs/${t.slug}`);
    console.log('video', t.id, total.toFixed(1) + 's');
  }
  await close();
}
