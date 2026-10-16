// Video scripts + storyboards (per topic), session add-on guide (A4) and add-on slides (16:9).
import * as A from './art.mjs';
import { LOGO, CREDIT } from './render.mjs';
import { IC, TOPICS, MINI } from './lib-content.mjs';
import { ACT, SESSION_NAMES } from './lib-activities.mjs';
import { scenes } from './lib-video.mjs';
import { html, pdf, png, close } from './lib-render.mjs';
import fs from 'node:fs';
const { g, INK } = A;
A.setMode('color');
const OUT = process.argv[2] || '../out';
const b64 = p => `data:image/jpeg;base64,${fs.readFileSync(p).toString('base64')}`;
const svg = (k, w) => `<svg viewBox="-110 -110 220 220" style="width:${w};height:${w};flex:none">${IC[k]()}</svg>`;
const fmt = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

const DCSS = `
.lhb{height:20mm;display:flex;align-items:center;justify-content:center;border-bottom:.8mm solid ${INK}}.lhb img{height:14mm}
.dp{padding:0 12mm;position:relative}
.dft{position:absolute;bottom:0;left:0;right:0;height:10mm;background:${INK};color:#fff;font-family:Cairo;font-weight:700;font-size:9pt;display:flex;align-items:center;justify-content:center}
h1.t{font-family:Lalezar;font-weight:400;font-size:26pt;color:var(--c1);-webkit-text-stroke:.5mm ${INK};paint-order:stroke fill;margin:3mm 0 1mm}
.meta{display:flex;flex-wrap:wrap;gap:2mm;margin-bottom:3mm}.meta span{background:var(--c2);border:.4mm solid ${INK};border-radius:3mm;padding:.5mm 3mm;font-family:Cairo;font-weight:700;font-size:9.5pt}
table.sb{width:100%;border-collapse:collapse;font-size:9.5pt;line-height:1.45}
table.sb th{background:var(--c1);color:#fff;font-family:Cairo;font-weight:800;padding:1.2mm;border:.4mm solid ${INK}}
table.sb td{border:.4mm solid ${INK};padding:1.2mm 2mm;vertical-align:middle;background:#fff}
table.sb td.n{text-align:center;font-family:Cairo;font-weight:900;font-size:12pt;background:var(--c2)}
table.sb img{width:30mm;height:30mm;display:block;border-radius:2mm}
.vo{font-weight:700}
.note{font-size:9pt;color:#444}
h2.s{font-family:Cairo;font-weight:900;font-size:15pt;color:var(--c3);margin:3mm 0 1.5mm}
.gbox{border:.6mm solid ${INK};border-radius:4mm;padding:2.5mm 4mm;margin-bottom:2.5mm;background:#fff;font-size:11pt;line-height:1.6}
.gbox b{font-family:Cairo;font-weight:800}
.gbox ol,.gbox ul{padding-right:6mm}
`;

function scriptDoc(t) {
  const S = scenes(t), total = S.reduce((a, s) => a + s.dur, 0);
  const rows = S.map((s, i) => {
    const th = `${OUT}/_thumbs/${t.slug}/scene-${i + 1}.jpg`;
    const motion = { intro: 'العنوان يقفز للداخل، سالم يدخل من اليمين، سنّون يهبط ويقفز', item: 'الرقم يظهر بارتداد، البطاقة تكبر وتتمايل، العنوان يصعد، النص يتلاشى للداخل', myth: 'العبارة تظهر، ختم «خطأ» يُطبع، ثم تصعد بطاقة «الحقيقة»', outro: 'سالم يدخل من اليسار، السؤال يقفز، رسالة الختام تصعد' }[s.kind];
    const onscreen = s.kind === 'myth' ? `✗ ${s.title}<br>✓ ${s.text}` : `<b>${s.title}</b><br>${s.text}`;
    return `<tr><td class="n">${i + 1}</td><td style="text-align:center;font-family:Cairo;font-weight:700">${fmt(s.at)}–${fmt(s.at + s.dur)}</td><td>${fs.existsSync(th) ? `<img src="${b64(th)}">` : ''}</td><td>${onscreen}</td><td class="vo">${s.vo}</td><td class="note">${motion}</td></tr>`;
  });
  // split rows over pages (5 per page)
  const pages = [];
  for (let i = 0; i < rows.length; i += 4) pages.push(rows.slice(i, i + 4));
  const head = `<tr><th style="width:8mm">#</th><th style="width:18mm">الوقت</th><th style="width:33mm">اللقطة</th><th>النص على الشاشة</th><th>التعليق الصوتي (اختياري)</th><th style="width:40mm">الحركة</th></tr>`;
  return pages.map((rs, pi) => `<div class="land" style="${t.vars};width:297mm;height:210mm;position:relative;overflow:hidden;background:#fff"><div class="lhb"><img src="${LOGO}"></div><div class="dp">
   ${pi === 0 ? `<h1 class="t">سيناريو فيديو موشن جرافيك: ${t.title}</h1><div class="meta"><span>المدة: ${Math.round(total)} ثانية</span><span>المقاس: 1080×1080 مربع (منشورات وحالات واتساب)</span><span>الفئة: طلاب الصفوف 5–7</span><span>الشخصيات: سالم وسنّون${t.slug === 'habits' || t.slug === 'injury' ? ' والطبيب' : ''}</span><span>الصوت: موسيقى هادئة خفيفة، والتعليق الصوتي يسجّله المثقّف أو طالب سفير</span></div>` : `<h1 class="t" style="font-size:18pt">تابع: ${t.title}</h1>`}
   <table class="sb">${head}${rs.join('')}</table></div><div class="dft">${CREDIT}</div></div>`).join('');
}

function guideDoc() {
  const cover = `<div class="page" style="--c1:#1f8fbf;--c2:#bfe9ff;--c3:#1f6fb2;background:#e7f6fb"><div class="lhb" style="background:#fff"><img src="${LOGO}"></div>
   <div style="text-align:center;padding-top:22mm"><h1 class="t" style="font-size:40pt">ملحق الجلسات التوعوية</h1><div style="font-family:Cairo;font-weight:800;font-size:16pt">ستة أنشطة تفاعلية جديدة لطلاب الصفوف الخامس والسادس والسابع</div></div>
   <svg viewBox="0 0 700 500" style="width:150mm;margin:8mm auto 0">${g(470, 480, 1.2, A.boy({ mouth: 'grin', r: [[60, -212], [104, -262], [114, -330]] }))}${g(230, 480, 1.2, A.friend({ mouth: 'smile', l: [[-60, -206], [-104, -256], [-116, -322]] }))}${g(350, 150, 0.9, A.tooth({ mouth: 'grin', sparkle: true, arms: true }))}</svg>
   <div class="dp"><table class="sb" style="font-size:11pt"><tr><th>النشاط</th><th>الموضوع</th><th>يُضاف إلى</th><th>المدة</th></tr>
   ${TOPICS.map(t => `<tr><td><b>${ACT[t.slug].name}</b></td><td>${t.short}</td><td>${ACT[t.slug].sessions.map(n => SESSION_NAMES[n].split(':')[0]).join(' و')}</td><td>${ACT[t.slug].time}</td></tr>`).join('')}</table>
   <p style="font-size:10.5pt;margin-top:3mm;line-height:1.6">كل نشاط يرافقه ملصق وإنفوجرافيك وفيديو قصير في مجلد الموضوع نفسه، وشريحتان في ملف «شرائح إضافية للجلسات». المحتوى مُعدّ ليناسب طلاب مدارس الذكور في سلطنة عُمان.</p></div>
   <div class="dft">${CREDIT}</div></div>`;
  const pages = TOPICS.map(t => {
    const a = ACT[t.slug];
    return `<div class="page" style="${t.vars};background:#fff"><div class="lhb"><img src="${LOGO}"></div><div class="dp">
     <h1 class="t">${t.n}. ${a.name}</h1>
     <div class="meta"><span>الموضوع: ${t.short}</span><span>المدة: ${a.time}</span>${a.sessions.map(n => `<span>${SESSION_NAMES[n]}</span>`).join('')}</div>
     <div class="gbox"><b>الهدف:</b> ${a.goal}</div>
     <div class="gbox"><b>الأدوات:</b> ${a.tools}</div>
     <h2 class="s">خطوات التنفيذ</h2><div class="gbox"><ol>${a.steps.map(s => `<li>${s}</li>`).join('')}</ol></div>
     <h2 class="s">المعلومة الأساسية (من الملصق)</h2><div class="gbox" style="background:var(--bg)"><ul>${(t.myths ? t.myths.map(m => [m[0], m[1], m[2]]) : t.items).map(it => `<li><b>${it[1]}</b> ${it[2]}</li>`).join('')}</ul></div>
     <h2 class="s">أسئلة للنقاش</h2><div class="gbox"><ul>${a.ask.map(q => `<li>${q}</li>`).join('')}</ul></div>
     <div class="gbox" style="background:var(--c2)"><b>ملاحظة للمثقّف:</b> ${a.link}</div>
     </div><div class="dft">${CREDIT}</div></div>`;
  });
  return [cover, ...pages].join('');
}

// ---- 16:9 slides ----
const SCSS = `@page{size:338.67mm 190.5mm;margin:0}
.sl{width:338.67mm;height:190.5mm;position:relative;overflow:hidden;background:var(--bg);page-break-after:always}
.sl .top{position:absolute;top:0;left:0;right:0;height:17mm;background:#fff;border-bottom:.8mm solid ${INK};display:flex;align-items:center;justify-content:space-between;padding:0 8mm}.sl .top img{height:12mm}
.sl .tag2{font-family:Cairo;font-weight:800;font-size:11pt;background:var(--c1);color:#fff;border:.5mm solid ${INK};border-radius:4mm;padding:.5mm 4mm}
.sl h1{position:absolute;top:21mm;right:10mm;left:10mm;font-family:Lalezar;font-weight:400;font-size:30pt;color:var(--c1);-webkit-text-stroke:.6mm ${INK};paint-order:stroke fill}
.sl .gr{position:absolute;top:42mm;bottom:15mm;right:10mm;left:10mm;display:grid;gap:4mm}
.sl .c{background:#fff;border:.7mm solid ${INK};border-radius:5mm;box-shadow:1mm 1mm 0 ${INK};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:2mm;position:relative}
.sl .c h3{font-family:Cairo;font-weight:900;font-size:13pt;line-height:1.25}.sl .c p{font-size:10pt;font-weight:700;line-height:1.3}
.sl .c .nn{position:absolute;top:-2.5mm;right:-2.5mm;width:9mm;height:9mm;border-radius:50%;background:var(--c1);color:#fff;border:.5mm solid ${INK};font-family:Cairo;font-weight:900;display:flex;align-items:center;justify-content:center}
.sl .bt{position:absolute;bottom:0;left:0;right:0;height:9mm;background:${INK};color:#fff;font-family:Cairo;font-weight:700;font-size:9pt;display:flex;align-items:center;justify-content:center}
.sl .act{position:absolute;top:42mm;bottom:15mm;right:10mm;left:95mm;font-size:15pt;font-weight:700;line-height:1.6}
.sl .act ol{padding-right:8mm}.sl .act li{margin-bottom:1.5mm}
.sl .qq{background:var(--c2);border:.7mm solid ${INK};border-radius:5mm;padding:2mm 5mm;font-family:Cairo;font-weight:900;font-size:15pt;margin-top:3mm}
`;
const top = (t, n) => `<div class="top"><img src="${LOGO}"><span class="tag2">${n}</span></div>`;
const bt = `<div class="bt">${CREDIT}</div>`;
function slides() {
  const wave = [[60, -212], [104, -262], [114, -330]];
  const out = [`<div class="sl" style="--bg:#e7f6fb;--c1:#1f8fbf"><div class="top"><img src="${LOGO}"><span></span></div>
   <h1 style="top:45mm;text-align:center;font-size:48pt">شرائح إضافية للجلسات التوعوية</h1>
   <div style="position:absolute;top:80mm;left:0;right:0;text-align:center;font-family:Cairo;font-weight:800;font-size:18pt">ستة موضوعات · لكل موضوع شريحة معلومات وشريحة نشاط</div>
   <svg viewBox="0 0 700 500" style="position:absolute;bottom:9mm;left:115mm;width:110mm">${g(470, 480, 1.2, A.boy({ mouth: 'grin', r: wave }))}${g(230, 480, 1.2, A.friend({ mouth: 'smile', l: [[-60, -206], [-104, -256], [-116, -322]] }))}</svg>${bt}</div>`];
  for (const t of TOPICS) {
    const a = ACT[t.slug], tag = a.sessions.map(n => SESSION_NAMES[n].split(':')[0]).join(' · ');
    const list = t.myths ? t.myths.map(([k, m, f]) => [k, '✗ ' + m, '✓ ' + f]) : t.items;
    const cols = list.length > 6 ? 4 : list.length === 4 ? 4 : 3;
    out.push(`<div class="sl" style="${t.vars}">${top(t, tag)}<h1>${t.title}</h1><div class="gr" style="grid-template-columns:repeat(${cols},1fr)">${list.map((it, i) => `<div class="c"><span class="nn">${i + 1}</span>${svg(it[0], list.length > 6 ? '20mm' : '30mm')}<h3>${it[1]}</h3><p>${it[2]}</p></div>`).join('')}</div>${bt}</div>`);
    out.push(`<div class="sl" style="${t.vars}">${top(t, tag)}<h1>نشاط: ${a.name}</h1>
      <svg viewBox="-110 -380 220 400" style="position:absolute;bottom:12mm;left:12mm;width:60mm;height:110mm">${A.boy({ mouth: 'grin', r: wave })}</svg>
      <div class="act"><ol>${a.steps.map(s => `<li>${s}</li>`).join('')}</ol><div class="qq">سؤال: ${a.ask[0]}</div></div>${bt}</div>`);
  }
  return out.join('');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  fs.mkdirSync(`${OUT}/0-mulhaq-al-jalasat`, { recursive: true });
  for (const t of [...TOPICS, ...MINI.map(m => ({ ...m, mini: true }))]) {
    fs.mkdirSync(`${OUT}/${t.id}`, { recursive: true });
    await pdf(html('سيناريو ' + t.title, scriptDoc(t), DCSS, '@page{size:297mm 210mm;margin:0}.land{page-break-after:always}'), `${OUT}/${t.id}/سيناريو-الفيديو-ولوحة-القصة.pdf`, '297mm', '210mm');
    console.log('script', t.id);
  }
  await pdf(html('ملحق الجلسات', guideDoc(), DCSS), `${OUT}/0-mulhaq-al-jalasat/دليل-الأنشطة-الإضافية-للجلسات.pdf`);
  await pdf(html('شرائح إضافية', slides(), DCSS + SCSS), `${OUT}/0-mulhaq-al-jalasat/شرائح-إضافية-للجلسات.pdf`, '338.67mm', '190.5mm');
  console.log('guide+slides');
  await close();
}
