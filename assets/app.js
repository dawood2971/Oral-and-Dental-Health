(() => {
  const D = window.DATA, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const store = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } } };
  const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);

  // 1. flip cards + pledge
  $$('.flip').forEach(b => b.addEventListener('click', () => b.classList.toggle('on')));
  $$('.chip').forEach(c => c.addEventListener('click', () => {
    $$('.chip').forEach(x => x.classList.remove('on')); c.classList.add('on');
    $('.pledge-out').textContent = `أتعهّد أن أبدأ اليوم بـ: «${c.textContent}» 💪`;
    store.set('pledge', c.textContent);
  }));
  const pl = store.get('pledge'); if (pl) $$('.chip').find(c => c.textContent === pl)?.click();

  // 2. brushing stepper + timer
  let si = 0;
  const showStep = () => {
    const s = D.brush[si]; $('#stArt').innerHTML = s.ic; $('#stN').textContent = si + 1; $('#stH').textContent = s.h; $('#stP').textContent = s.p;
    $$('#stDots i').forEach((d, i) => d.classList.toggle('on', i <= si));
    $('#stPrev').disabled = si === 0; $('#stNext').textContent = si === D.brush.length - 1 ? 'من البداية' : 'التالي';
  };
  $('#stNext').onclick = () => { si = (si + 1) % D.brush.length; showStep(); };
  $('#stPrev').onclick = () => { if (si) { si--; showStep(); } };
  showStep();
  let tm = null;
  $('#tmGo').onclick = () => {
    if (tm) { clearInterval(tm); tm = null; $('#tmGo').textContent = 'ابدأ'; return; }
    let left = 120; const fg = $('#tmFg'), qs = $$('#quads span');
    qs.forEach(q => q.className = '');
    $('#tmGo').textContent = 'إيقاف';
    const tick = () => {
      const m = Math.floor(left / 60), s = left % 60; $('#tmT').textContent = `${m}:${String(s).padStart(2, '0')}`;
      fg.style.strokeDashoffset = 326.7 * (1 - left / 120);
      const q = Math.min(3, Math.floor((120 - left) / 30)); qs.forEach((e, i) => e.className = i < q ? 'done' : i === q ? 'on' : '');
      $('#tmMsg').textContent = left ? `نظّف الآن: ${qs[q].textContent}` : 'أحسنت! دقيقتان كاملتان 🎉 ابصق المعجون ولا تشطف بكثرة.';
      if (!left) { clearInterval(tm); tm = null; qs.forEach(e => e.className = 'done'); $('#tmGo').textContent = 'مرة أخرى'; }
      left--;
    };
    tick(); tm = setInterval(tick, 1000);
  };

  // 3. myths quiz (every statement is a myth: correct answer is «خطأ»)
  let qi = 0, score = 0;
  const qShow = () => {
    const m = D.myths[qi]; $('#qzIc').innerHTML = m.ic; $('#qzQ').textContent = m.q;
    $('#qzN').textContent = `العبارة ${qi + 1} من ${D.myths.length}`; $('#qzS').textContent = `النقاط: ${score}`;
    $('#qzFb').className = 'qz-fb'; $('#qzFb').innerHTML = ''; $('#qzNext').hidden = true; $$('.qz-btns .btn').forEach(b => b.disabled = false);
  };
  $$('.qz-btns .btn').forEach(b => b.onclick = () => {
    const good = b.dataset.a === '0'; if (good) score++;
    $$('.qz-btns .btn').forEach(x => x.disabled = true);
    $('#qzFb').className = 'qz-fb ' + (good ? 'good' : 'bad');
    $('#qzFb').innerHTML = `<span class="r">${good ? 'إجابة صحيحة! إنها معلومة خاطئة ✓' : 'انتبه! هذه معلومة خاطئة ✗'}</span>الحقيقة: ${D.myths[qi].f}`;
    $('#qzS').textContent = `النقاط: ${score}`;
    $('#qzNext').hidden = false; $('#qzNext').textContent = qi === D.myths.length - 1 ? 'النتيجة' : 'العبارة التالية';
  });
  let over = false;
  $('#qzNext').onclick = () => {
    if (over) { over = false; qi = 0; score = 0; qShow(); return; }
    if (qi < D.myths.length - 1) { qi++; qShow(); return; }
    over = true; const n = D.myths.length;
    $('#qzIc').innerHTML = ''; $('#qzQ').textContent = `نتيجتك: ${score} من ${n} ${score >= 6 ? '🏆 أنت خبير أسنان!' : '👍 أعد المحاولة لتصبح خبيراً'}`;
    $('#qzFb').innerHTML = ''; $('#qzNext').textContent = 'العب من جديد';
  };
  qShow();

  // 4. 28-day chart
  const ch = store.get('chart', {});
  const paint = () => {
    let gN = 0, rN = 0;
    $$('.tc').forEach(b => { const v = ch[b.dataset.k]; b.className = 'tc' + (v === 1 ? ' g' : v === 2 ? ' r' : ''); if (v === 1) gN++; if (v === 2) rN++; });
    $('#chG').textContent = gN; $('#chR').textContent = rN;
  };
  $$('.tc').forEach(b => b.onclick = () => { const k = b.dataset.k; ch[k] = ((ch[k] || 0) + 1) % 3; store.set('chart', ch); paint(); });
  $('#chReset').onclick = () => { for (const k in ch) delete ch[k]; store.set('chart', ch); paint(); };
  paint();

  // 5. cause → fix matching
  const fixes = shuffle(D.pairs.map((p, i) => [p[1], i]));
  $('#mFix').innerHTML = fixes.map(([f, i]) => `<button class="mc" data-i="${i}">${f}</button>`).join('');
  let sel = null, matched = 0;
  $$('#mCause .mc').forEach(b => b.onclick = () => { if (b.classList.contains('done')) return; $$('#mCause .mc').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); sel = b; $('#mFb').textContent = 'والآن اختر الحل المناسب ←'; });
  $$('#mFix .mc').forEach(b => b.onclick = () => {
    if (!sel || b.classList.contains('done')) { if (!sel) $('#mFb').textContent = 'اختر السبب أولاً'; return; }
    if (b.dataset.i === sel.dataset.i) { b.classList.add('done'); sel.classList.remove('sel'); sel.classList.add('done'); sel = null; matched++; $('#mFb').textContent = matched === D.pairs.length ? 'أحسنت يا محقّق! حللت القضية كاملة 🕵️‍♂️' : 'صحيح! تابع ✓'; }
    else { b.classList.add('wrong'); setTimeout(() => b.classList.remove('wrong'), 450); $('#mFb').textContent = 'ليس هذا الحل، فكّر مرة أخرى'; }
  });

  // 6. injury ordering
  let next = 0;
  const buildOrder = () => {
    next = 0; $('#oFb').textContent = '';
    $('#order').innerHTML = shuffle(D.order.map((s, i) => [s, i])).map(([s, i]) => `<button class="ob" data-i="${i}"><span class="num">${i + 1}</span>${s.ic}<span>${s.h}</span></button>`).join('');
    $$('.ob').forEach(b => b.onclick = () => {
      if (b.classList.contains('done')) return;
      if (+b.dataset.i === next) { b.classList.add('done'); next++; $('#oFb').textContent = next === D.order.length ? 'رائع! أنقذت السن. تذكّر: كل دقيقة مهمة 🚑' : D.order[next - 1].p; }
      else { b.classList.add('wrong'); setTimeout(() => b.classList.remove('wrong'), 450); $('#oFb').textContent = 'ليست هذه الخطوة التالية، حاول مرة أخرى'; }
    });
  };
  $('#oReset').onclick = buildOrder; buildOrder();
})();
