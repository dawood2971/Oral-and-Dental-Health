import * as A from './art.mjs';
import { render, doc, LOGO, CREDIT } from './render.mjs';
import { SESSIONS, I } from './content.mjs';
const { g, S, INK } = A;
A.setMode('color');

const sv = (inner, vb, w, h = w) => `<svg viewBox="${vb}" style="width:${w}mm;height:${h}mm;flex:none">${inner}</svg>`;
const icon = (k, w) => sv(I[k](), '-110 -110 220 220', w);
const LET = ['أ', 'ب', 'ج'];
const NOTES = {
  1: 'مع الصفين الخامس والسادس اجعل خريطة الفم لعبة تنافسية بين المجموعات. ومع الصف السابع اطلب من الطلاب مقارنة عدد أسنانهم الدائمة بأعمارهم ومناقشة السبب.',
  2: 'احرص على أن يرى كل طالب زاوية 45° على المجسم من قرب. اربط الجلسة بتدريب الطلاب الخمسة عشر الذي يبدأ في 12 نوفمبر، وذكّر السفراء بدورهم في المساعدة.',
  3: 'استخدم علباً فارغة ونظيفة، وتجنّب ذكر العلامات التجارية. وعند الحديث عن التمر تكون الرسالة عن التوقيت والتنظيف بعده لا عن المنع، احتراماً لمكانته في بيوتنا.',
  4: 'أرسل للضيف أهداف الجلسة والعرض قبلها بأيام. وإذا تعذّر حضوره فاعرض مقطعاً مرئياً معتمداً من وزارة الصحة وقدّم الشرائح بنفسك، وأجب عن أسئلة الصندوق لاحقاً.',
  5: 'شريحة التدخين والسجائر الإلكترونية موجهة للصف السابع، ومع الصفين الخامس والسادس تكفي الرسالة العامة. يدير السفراء المسابقة بإشرافك، ويوقّع كل طالب «تعهّد الابتسامة».',
};

const css = `
.pg{background:#fff}
.hd{position:absolute;top:0;left:0;right:0;height:30mm;background:var(--c);border-bottom:1mm solid ${INK};display:flex;align-items:center;justify-content:space-between;padding:0 14mm;color:#fff}
.hd h1{font-family:Cairo;font-weight:900;font-size:21pt;white-space:nowrap}
.hd .b{font-family:Cairo;font-weight:800;font-size:11pt;background:#fff;color:${INK};border:.6mm solid ${INK};border-radius:10mm;padding:1mm 4mm}
.ct{position:absolute;top:38mm;left:14mm;right:14mm;bottom:20mm;display:flex;flex-direction:column;gap:4.5mm}
.ft{position:absolute;bottom:7mm;left:14mm;right:14mm;display:flex;justify-content:space-between;font-family:Cairo;font-weight:600;font-size:8.5pt;color:#666;border-top:.3mm solid #ccc;padding-top:2mm}
h2{font-family:Cairo;font-weight:900;font-size:14pt;color:var(--d);margin-bottom:1.5mm;display:flex;align-items:center;gap:2mm}
h2:before{content:"";width:3mm;height:5mm;border-radius:1mm;background:var(--c);border:.4mm solid ${INK}}
.bx{border:.6mm solid ${INK};border-radius:4mm;padding:3mm 5mm;background:#fff}
.tint{background:var(--l)}
p,li{font-size:11.5pt;line-height:1.65;font-weight:700}
ul{padding-right:6mm}
li::marker{color:var(--c)}
.two{display:grid;grid-template-columns:1fr 1fr;gap:4mm}
table.t{width:100%;border-collapse:collapse;font-size:10.5pt}
table.t th{background:var(--c);color:#fff;font-family:Cairo;font-weight:800;padding:1.6mm 2mm;border:.4mm solid ${INK}}
table.t td{border:.4mm solid ${INK};padding:1.6mm 2.5mm;line-height:1.55;font-weight:700;vertical-align:top}
.info{display:grid;grid-template-columns:repeat(4,1fr);gap:2.5mm}
.info div{background:var(--l);border:.5mm solid ${INK};border-radius:3mm;padding:2mm 3mm;font-size:10pt;font-weight:700;line-height:1.4}
.info b{display:block;font-family:Cairo;font-weight:900;font-size:9pt;color:var(--d)}
.ok{color:#1a7f4b;font-weight:900}
`;
let pn = 0;
const page = (vars, title, badge, body) => `<div class="page pg" style="${vars}"><div class="hd"><h1>${title}</h1>${badge ? `<span class="b">${badge}</span>` : ''}</div><div class="ct">${body}</div><div class="ft"><span>${CREDIT}</span><span>${++pn}</span></div></div>`;
const BASE = '--c:#1f8fbf;--l:#e4f3fa;--d:#155f80';
const dark = c => ({ '#1f8fbf': '#155f80', '#169c8c': '#0e6b60', '#e08a00': '#9a5d00', '#d9573a': '#a23a22', '#6c47c9': '#4c2f99' }[c]);

function cover() {
  pn++;
  const art = `<rect width="2100" height="2970" fill="#e8f6fb"/><circle cx="1050" cy="1780" r="760" fill="#fff"/>` + A.sun(1820, 900, 1.3) + A.cloud(320, 960, 1.3) +
    `<path d="M-50,2330 Q525,2230 1050,2310 T2150,2290 L2150,3000 L-50,3000 Z" fill="${A.PAL.grass}" ${S(8)}/>` +
    g(640, 2430, 3.2, A.boy({ r: [[60, -212], [104, -262], [114, -330]] })) + g(1460, 2430, 3.2, A.friend({ l: [[-60, -212], [-104, -262], [-114, -330]] })) +
    g(1050, 2200, 2.7, A.tooth({ arms: [[[-46, -6], [-80, -40]], [[46, -6], [80, -40]]], feet: true, sparkle: true })) +
    g(300, 1500, 0.9, I.brush()) + g(1820, 1500, 0.9, I.paste()) + A.star5(1050, 1200, 46) + A.sparkle(500, 1250, 40) + A.sparkle(1600, 1250, 40);
  return `<div class="page" style="background:#e8f6fb"><svg viewBox="0 0 2100 2970" style="position:absolute;inset:0;width:210mm;height:297mm">${art}</svg>
  <div style="position:absolute;top:0;left:0;right:0;height:24mm;background:#fff;border-bottom:.8mm solid ${INK};display:flex;align-items:center;justify-content:center"><img src="${LOGO}" style="height:18mm"></div>
  <div style="position:absolute;top:36mm;left:15mm;right:15mm;text-align:center">
   <div style="display:inline-block;font-family:Cairo;font-weight:800;font-size:14pt;background:#1f8fbf;color:#fff;border:.7mm solid ${INK};border-radius:10mm;padding:1.5mm 7mm">دليل المقدّم</div>
   <div style="font-family:Lalezar,Cairo;font-size:42pt;line-height:1.2;margin-top:5mm;color:#ffd23f;-webkit-text-stroke:.8mm ${INK};paint-order:stroke fill">الجلسات التوعوية الخمس</div>
   <div style="font-family:Cairo;font-weight:900;font-size:22pt;line-height:1.4;margin-top:2mm">صحة الفم والأسنان في المجتمع المدرسي</div>
   <div style="font-family:Cairo;font-weight:700;font-size:13pt;margin-top:3mm">لطلاب الصفوف الخامس والسادس والسابع · نوفمبر 2026</div></div>
  <div style="position:absolute;bottom:9mm;left:15mm;right:15mm;text-align:center;font-family:Cairo;font-weight:800;font-size:12pt;line-height:1.6;background:#fff;border:.6mm solid ${INK};border-radius:4mm;padding:2.5mm">قسم تعزيز الصحة / برنامج الصحة المدرسية والجامعية<br>إعداد: داود اليعقوبي، ممرض الصحة المدرسية</div></div>`;
}

const intro = () => page(BASE, 'المقدمة', '', `
 <div class="bx tint"><p>صحة الفم والأسنان جزء لا يتجزأ من صحة الإنسان، وقد ارتبطت أمراض الفم بعدد من الأمراض المزمنة، ومعظمها يرتبط بعادات يومية يمكن تغييرها. والمدرسة أفضل مكان لبناء هذه العادات في سن مبكرة، قبل أن تكتمل الأسنان الدائمة لدى الطلاب.</p></div>
 <div><h2>عن هذا الدليل</h2><p>يضم هذا الدليل الجلسات التوعوية الخمس لبرنامج «تعزيز صحة الفم والأسنان في المجتمع المدرسي» لشهر نوفمبر 2026، الموجهة لطلاب الصفوف الخامس والسادس والسابع. ولكل جلسة عرض تقديمي جاهز من 14 شريحة، وفي هذا الدليل لكل جلسة صفحتان: الأولى للأهداف والمواد والرسائل الأساسية، والثانية لسير الجلسة دقيقة بدقيقة والنشاط والاختبار السريع بإجاباته.</p></div>
 <div><h2>الهدف العام</h2><p>رفع مستوى الوعي الصحي بصحة الفم والأسنان لدى الطلاب، وترسيخ الممارسات السليمة للعناية بالأسنان في المدرسة والبيت.</p></div>
 <div class="two"><div class="bx"><h2>شخصيات البرنامج</h2><p>سالم وصديقه حمد، طالبان عُمانيان بالدشداشة والكمة، ومعهما «سنّون» السن المرح. تظهر الشخصيات في العروض والدفتر والملصقات ليتعرف الطلاب على البرنامج من أول نظرة.</p></div>
 <div class="bx"><h2>مواد البرنامج المساندة</h2><ul><li>دفتر التلوين والأنشطة «ابتسامة سالم وحمد»</li><li>ستة ملصقات حائط</li><li>ملصقات التوعية والتحفيز للطلاب</li><li>استمارة تقييم التفريش للطلاب الخمسة عشر</li></ul></div></div>
 <div><h2>مصادر المعلومات</h2><p>اعتمد محتوى الجلسات على مطوية وزارة الصحة بسلطنة عُمان «الأطفال وإصابات الأسنان والأنسجة المحيطة بها»، ودليل صحة الفم والأسنان العربي المستند إلى إرشادات Public Health England وNHS.</p></div>`);

function toc() {
  const rows = [['المقدمة', 2], ['خطة الجلسات وطريقة التقديم', 4], ...SESSIONS.map((s, i) => [`الجلسة ${s.n}: ${s.title}`, 5 + i * 2, s]), ['الخاتمة', 15]];
  return page(BASE, 'الفهرس', '', `<div class="bx" style="padding:6mm 8mm">${rows.map(([t, p, s]) => `<div style="display:flex;align-items:center;gap:3mm;padding:3.4mm 0;border-bottom:.3mm dashed #aaa">${s ? `<span style="flex:none;width:9mm;height:9mm;border-radius:50%;background:${s.color};border:.5mm solid ${INK};color:#fff;font-family:Cairo;font-weight:900;font-size:13pt;display:flex;align-items:center;justify-content:center">${s.n}</span>` : `<span style="flex:none;width:9mm"></span>`}<span style="font-family:Cairo;font-weight:800;font-size:14pt">${t}</span>${s ? `<span style="font-size:10.5pt;font-weight:700;color:#555">· ${s.date}</span>` : ''}<span style="flex:1"></span><span style="font-family:Cairo;font-weight:900;font-size:14pt">${p}</span></div>`).join('')}</div>
  <div style="display:flex;justify-content:center;gap:10mm;margin-top:6mm">${sv(g(0, 190, 0.92, A.boy({ r: [[60, -212], [104, -262], [114, -330]] })), '-120 -210 240 410', 40, 68)}${sv(A.tooth({ sparkle: true, arms: true, feet: true }), '-110 -100 220 200', 50, 46)}${sv(g(0, 190, 0.92, A.friend({ l: [[-60, -212], [-104, -262], [-114, -330]] })), '-120 -210 240 410', 40, 68)}</div>`);
}

const overview = () => page(BASE, 'خطة الجلسات وطريقة التقديم', '', `
 <table class="t"><tr><th>الجلسة</th><th>التاريخ</th><th>الموضوع</th><th>النشاط التفاعلي</th><th>المقدّم</th></tr>
 ${SESSIONS.map(s => `<tr><td style="text-align:center;font-family:Cairo;font-weight:900">${s.n}</td><td>${s.date.replace(' 2026', '')}</td><td>${s.title}: ${s.sub}</td><td>${s.activity.t.replace('نشاط: ', '')}</td><td>${s.presenter}</td></tr>`).join('')}</table>
 <div><h2>بنية الجلسة (حصة واحدة: 45 دقيقة)</h2>
 <table class="t"><tr><th style="width:22%">المرحلة</th><th style="width:16%">الزمن</th><th>ما يحدث</th></tr>
 <tr><td>التمهيد</td><td>5 دقائق</td><td>ترحيب، عرض الأهداف، وسؤال قبلي يقيس معرفة الطلاب</td></tr>
 <tr><td>المحتوى</td><td>15 – 20 دقيقة</td><td>شرائح المحتوى مع أسئلة قصيرة للطلاب بعد كل شريحة</td></tr>
 <tr><td>النشاط التفاعلي</td><td>12 – 15 دقيقة</td><td>نشاط عملي في مجموعات أو مع الضيف</td></tr>
 <tr><td>الاختبار السريع</td><td>5 دقائق</td><td>3 أسئلة اختيار من متعدد برفع الأيدي، وتسجيل النتيجة</td></tr>
 <tr><td>الختام</td><td>3 دقائق</td><td>الرسائل الأساسية، ومهمة البيت، وموعد الجلسة القادمة</td></tr></table></div>
 <div class="two"><div class="bx tint"><h2>للصفين الخامس والسادس</h2><p>الألعاب والصور والحركة، وجمل قصيرة، ومكافأة المشاركين بملصقات التحفيز.</p></div>
 <div class="bx tint"><h2>للصف السابع</h2><p>النقاش والتحديات والأسئلة المفتوحة، وتوسيع الحديث عن الأسباب والعادات مثل التدخين.</p></div></div>
 <div class="bx"><h2>قياس الأثر</h2><p>سجّل عدد الإجابات الصحيحة للسؤال القبلي وللاختبار السريع في كل فصل؛ فالمستهدف في الخطة زيادة المعرفة بنسبة 30% بين بداية الجلسة ونهايتها.</p></div>`);

function sessionA(s) {
  const v = `--c:${s.color};--l:${s.light};--d:${dark(s.color)}`;
  const titles = s.slides.map(d => d.t);
  return page(v, `الجلسة ${s.n}: ${s.title}`, s.date.replace(' 2026', ''), `
  <div class="info"><div><b>التاريخ</b>${s.date}</div><div><b>المدة</b>حصة واحدة (45 دقيقة)</div><div><b>المقدّم</b>${s.presenter}</div><div><b>الفئة</b>الصفوف 5 و6 و7</div></div>
  <div><h2>أهداف الجلسة</h2><p style="margin-bottom:1mm">في نهاية الجلسة يُتوقع من الطالب أن:</p><ul>${s.goals.map(t => `<li>${t}</li>`).join('')}</ul></div>
  <div class="two"><div class="bx"><h2>المواد والأدوات</h2><ul>${s.materials.map(t => `<li>${t}</li>`).join('')}</ul></div>
  <div class="bx"><h2>محتوى العرض (14 شريحة)</h2><ul><li>الغلاف والأهداف والسؤال القبلي (1 – 3)</li>${titles.map((t, i) => `<li>${t} (${i + 4})</li>`).join('')}<li>النشاط، والاختبار، والختام (9 – 14)</li></ul></div></div>
  <div class="bx tint" style="display:flex;gap:4mm;align-items:center"><div style="flex:1"><h2>الرسائل الأساسية</h2><ul>${s.keys.map(t => `<li>${t}</li>`).join('')}</ul></div>${icon(s.n === 3 ? 'apple' : s.n === 4 ? 'germ' : s.n === 5 ? 'guard' : s.n === 2 ? 'brush' : 'tooth', 30)}</div>`);
}

function sessionB(s) {
  const v = `--c:${s.color};--l:${s.light};--d:${dark(s.color)}`;
  const act = parseInt(s.activity.time), content = 45 - 5 - act - 5 - 3;
  let t = 0; const span = m => { const a = t; t += m; return `${a} – ${t}`; };
  const rows = [
    [span(5), 'التمهيد', `ترحيب وعرض الأهداف، ثم السؤال القبلي: «${s.pre}»`, '1 – 3'],
    [span(content), 'المحتوى', s.slides.map(d => d.t).join('، '), '4 – 8'],
    [span(act), 'النشاط', s.activity.t.replace('نشاط: ', ''), '9'],
    [span(5), 'الاختبار السريع', '3 أسئلة برفع الأيدي، وتسجيل عدد الإجابات الصحيحة', '10 – 12'],
    [span(3), 'الختام', 'الرسائل الأساسية ومهمة البيت وموعد الجلسة القادمة', '13 – 14']];
  return page(v, `الجلسة ${s.n}: سير الجلسة`, s.title, `
  <table class="t"><tr><th style="width:13%">الدقائق</th><th style="width:17%">المرحلة</th><th>ما يقوم به المقدّم</th><th style="width:12%">الشرائح</th></tr>${rows.map(r => `<tr><td style="text-align:center">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td style="text-align:center">${r[3]}</td></tr>`).join('')}</table>
  <div class="bx tint"><h2>${s.activity.t} (${s.activity.time})</h2><ol style="padding-right:6mm">${s.activity.steps.map(x => `<li>${x}</li>`).join('')}</ol></div>
  <div class="bx"><h2>الاختبار السريع والإجابات</h2>${s.quiz.map(([q, o, a], i) => `<p>${i + 1}. ${q}<br><span style="font-weight:600">${o.map((x, j) => j === a ? `<span class="ok">${LET[j]}) ${x} ✔</span>` : `${LET[j]}) ${x}`).join(' &nbsp;·&nbsp; ')}</span></p>`).join('')}</div>
  <div class="two"><div class="bx"><h2>مهمة البيت</h2><ul>${s.take.map(x => `<li>${x}</li>`).join('')}</ul></div><div class="bx"><h2>ملاحظات للمقدّم</h2><p>${NOTES[s.n]}</p></div></div>`);
}

const closing = () => page(BASE, 'الخاتمة', '', `
 <div class="bx tint"><p>بنهاية الجلسات الخمس يكون الطلاب قد تعرّفوا على أسنانهم، وتعلّموا التفريش الصحيح واستخدام الخيط، واكتشفوا أثر الغذاء والسكر، وفهموا التسوس وأمراض اللثة وأهمية زيارة الطبيب، وتعلموا حماية ابتسامتهم من الإصابات والعادات الضارة.</p></div>
 <div><h2>ما بعد الجلسات</h2><ul><li>التقييم البعدي للطلاب الخمسة عشر يوم 23 نوفمبر، والمستهدف أن يصل 12 طالباً على الأقل إلى مستوى «متقن».</li><li>حفل تكريم السفراء التسعة والمتدربين يوم الخميس 26 نوفمبر.</li><li>رفع التقرير الختامي لإدارة المدرسة يوم 30 نوفمبر متضمناً نتائج الأسئلة القبلية والاختبارات السريعة.</li></ul></div>
 <div><h2>لتبقى العادة</h2><ul><li>يستمر السفراء في تقديم نصيحة أسبوعية في فصولهم.</li><li>تبقى ملصقات الحائط معلقة في الممرات والفصول.</li><li>يشجَّع الطلاب على إكمال جدول التفريش في دفتر التلوين مع أسرهم.</li></ul></div>
 <div class="bx" style="text-align:center"><p style="font-family:Cairo;font-weight:900;font-size:15pt">«ابتسامة صحية اليوم.. عادة تدوم مدى الحياة»</p><p>شكراً لكل من أسهم في إنجاح هذا البرنامج: إدارة المدرسة، والمعلمين، والمركز الصحي، وسفراء صحة الفم والأسنان، وأولياء الأمور.</p></div>
 <div style="display:flex;justify-content:center">${sv(g(-70, 190, 0.85, A.boy({ r: [[60, -212], [104, -262], [114, -330]] })) + g(90, 190, 0.85, A.friend({ l: [[-60, -212], [-104, -262], [-114, -330]] })) + g(10, 120, 0.6, A.tooth({ sparkle: true, feet: true })), '-200 -210 400 410', 70, 72)}</div>`);

function back() {
  pn++;
  return `<div class="page" style="background:#1f8fbf"><div style="position:absolute;top:0;left:0;right:0;height:24mm;background:#fff;border-bottom:.8mm solid ${INK};display:flex;align-items:center;justify-content:center"><img src="${LOGO}" style="height:18mm"></div>
  <svg viewBox="-150 -150 300 300" style="position:absolute;top:70mm;left:0;right:0;margin:auto;width:110mm;height:110mm">${A.tooth({ arms: [[[-46, -6], [-80, -40]], [[46, -6], [80, -40]]], feet: true, sparkle: true })}</svg>
  <div style="position:absolute;top:190mm;left:15mm;right:15mm;text-align:center;color:#fff">
   <div style="font-family:Lalezar,Cairo;font-size:36pt;-webkit-text-stroke:.7mm ${INK};paint-order:stroke fill;color:#ffd23f">ابتسامتك.. مسؤوليتك</div>
   <div style="font-family:Cairo;font-weight:800;font-size:14pt;margin-top:4mm;line-height:1.7">فرّش مرتين يومياً · دقيقتان · معجون بالفلورايد<br>خيط مرة يومياً · سكر أقل · طبيب الأسنان كل 6 أشهر</div></div>
  <div style="position:absolute;bottom:12mm;left:15mm;right:15mm;text-align:center;color:#fff;font-family:Cairo;font-weight:700;font-size:11pt;line-height:1.6">قسم تعزيز الصحة / برنامج الصحة المدرسية والجامعية<br>إعداد: داود اليعقوبي، ممرض الصحة المدرسية · نوفمبر 2026</div></div>`;
}

const pages = [cover(), intro()];
pages.push(toc()); // page 3
pages.push(overview());
for (const s of SESSIONS) pages.push(sessionA(s), sessionB(s));
pages.push(closing(), back());
await render(doc('دليل الجلسات التوعوية – صحة الفم والأسنان', pages, css), process.argv[2] || 'booklet.pdf');
