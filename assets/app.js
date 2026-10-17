(() => {
  const D = window.DATA, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const store = { get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } } };
  const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---------- 1a. care self-assessment ----------
  if ($('#cq')) {
    let i = 0; const ans = [];
    const show = () => {
      const q = D.quiz[i];
      $('#cqBar').style.width = `${(i / D.quiz.length) * 100}%`;
      $('#cqN').textContent = `السؤال ${i + 1} من ${D.quiz.length}`; $('#cqQ').textContent = q.q;
      $('#cqOpts').innerHTML = q.o.map(([t, p], j) => `<button class="opt" data-j="${j}">${esc(t)}</button>`).join('');
      $$('#cqOpts .opt').forEach(b => b.onclick = () => { ans[i] = q.o[+b.dataset.j][1]; i++; i < D.quiz.length ? show() : result(); });
    };
    const result = () => {
      const sc = ans.reduce((a, b) => a + b, 0), max = D.quiz.length * 2;
      $('#cqBar').style.width = '100%';
      ['#cqN', '#cqQ', '#cqOpts'].forEach(s => $(s).hidden = true); $('#cqRes').hidden = false;
      const lvl = sc >= 15 ? ['🏆 أنت بطل الأسنان!', 'عاداتك ممتازة، استمر وعلّمها لأصدقائك.', 'grin'] : sc >= 10 ? ['👍 عاداتك جيدة', 'ينقصك القليل لتصبح بطلاً. ابدأ بالنصائح التالية.', 'smile'] : ['💪 تحتاج إلى خطة', 'لا تقلق، كل بطل بدأ بخطوة. اختر نصيحة واحدة وطبّقها من اليوم.', 'o'];
      $('#cqTitle').textContent = lvl[0]; $('#cqScore').textContent = `نتيجتك ${sc} من ${max}. ${lvl[1]}`;
      $('#cqFace').innerHTML = (sc >= 10 ? $('#tplToothHappy') : $('#tplToothSad')).innerHTML;
      const tips = D.quiz.filter((q, k) => ans[k] < 2).map(q => `<li>${esc(q.tip)}</li>`);
      $('#cqTips').innerHTML = tips.length ? tips.join('') : '<li>لا توجد نقاط ضعف. ممتاز!</li>';
    };
    $('#cqAgain').onclick = () => { i = 0; ans.length = 0; ['#cqN', '#cqQ', '#cqOpts'].forEach(s => $(s).hidden = false); $('#cqRes').hidden = true; show(); };
    show();
  }

  // ---------- 1b. food game ----------
  if ($('#fgStart')) {
    let t = 0, sc = 0, cur = null, timer = null, deck = [];
    const best = () => store.get('foodBest', 0);
    $('#fgBest').textContent = best();
    const next = () => { if (!deck.length) deck = shuffle(D.foods.slice()); cur = deck.pop(); $('#fgFood').innerHTML = `<div class="fd">${cur.svg}<b>${esc(cur.n)}</b></div>`; };
    const end = () => {
      clearInterval(timer); timer = null; $('#fgGood').disabled = $('#fgBad').disabled = true;
      if (sc > best()) store.set('foodBest', sc); $('#fgBest').textContent = best();
      $('#fgFood').innerHTML = `<div class="fd"><b>انتهى الوقت! نقاطك: ${sc}</b><button class="btn" id="fgStart">العب مرة أخرى</button></div>`; $('#fgStart').onclick = start;
      $('#fgTooth').innerHTML = $('#tplToothHappy').innerHTML;
    };
    const start = () => {
      t = 30; sc = 0; $('#fgScore').textContent = 0; $('#fgTime').textContent = t; $('#fgMsg').textContent = '';
      $('#fgGood').disabled = $('#fgBad').disabled = false; next();
      timer = setInterval(() => { t--; $('#fgTime').textContent = t; if (t <= 0) end(); }, 1000);
    };
    const pick = good => {
      if (!timer) return;
      const ok = good === cur.good; if (ok) sc++;
      $('#fgScore').textContent = sc;
      $('#fgMsg').textContent = `${ok ? '✓ صحيح!' : '✗ ليس تماماً.'} ${cur.n}: ${cur.why}`;
      $('#fgTooth').innerHTML = (cur.good ? $('#tplToothHappy') : $('#tplToothSad')).innerHTML;
      $('#fgTooth').classList.remove('pop'); void $('#fgTooth').offsetWidth; $('#fgTooth').classList.add('pop');
      next();
    };
    $('#fgStart').onclick = start; $('#fgGood').onclick = () => pick(true); $('#fgBad').onclick = () => pick(false);
  }

  // ---------- 1c. germ catcher ----------
  if ($('#gmGrid')) {
    const cells = $$('#gmGrid .gc'); let hit = 0, miss = 0, t = 0, tick = null, spawn = null;
    cells.forEach(c => c.onclick = () => { if (c.classList.contains('germ')) { c.classList.remove('germ'); c.classList.add('zap'); setTimeout(() => c.classList.remove('zap'), 300); hit++; $('#gmHit').textContent = hit; } });
    const pop = () => {
      const free = cells.filter(c => !c.classList.contains('germ')); if (!free.length) return;
      const c = free[Math.floor(Math.random() * free.length)]; c.classList.add('germ');
      setTimeout(() => { if (c.classList.contains('germ')) { c.classList.remove('germ'); miss++; $('#gmMiss').textContent = miss; c.classList.add('hurt'); setTimeout(() => c.classList.remove('hurt'), 600); } }, Math.max(700, 1400 - (20 - t) * 30));
    };
    $('#gmStart').onclick = () => {
      if (tick) return; hit = miss = 0; t = 20; $('#gmHit').textContent = 0; $('#gmMiss').textContent = 0; $('#gmMsg').textContent = ''; $('#gmStart').disabled = true;
      spawn = setInterval(pop, 650);
      tick = setInterval(() => {
        t--; $('#gmTime').textContent = t;
        if (t <= 0) { clearInterval(tick); clearInterval(spawn); tick = null; cells.forEach(c => c.classList.remove('germ')); $('#gmStart').disabled = false; $('#gmStart').textContent = 'العب مرة أخرى';
          $('#gmMsg').textContent = hit >= miss * 2 ? `رائع! اصطدت ${hit} جرثومة. هكذا تفعل الفرشاة كل يوم 🪥` : `اصطدت ${hit} وهربت ${miss}. الجراثيم التي تهرب تسبب التسوّس، لذلك لا تنسَ التفريش مرتين يومياً.`; }
      }, 1000);
    };
  }

  // ---------- 1d. brushing stepper + timer with music ----------
  if ($('#timer')) {
    let si = 0;
    const showStep = () => { const s = D.brush[si]; $('#stArt').innerHTML = s.ic; $('#stN').textContent = si + 1; $('#stH').textContent = s.h; $('#stP').textContent = s.p; $$('#stDots i').forEach((d, i) => d.classList.toggle('on', i <= si)); $('#stPrev').disabled = si === 0; $('#stNext').textContent = si === D.brush.length - 1 ? 'من البداية' : 'التالي'; };
    $('#stNext').onclick = () => { si = (si + 1) % D.brush.length; showStep(); };
    $('#stPrev').onclick = () => { if (si) { si--; showStep(); } };
    showStep();

    let music = store.get('music', true), ctx = null, nextNote = 0, noteI = 0, sched = null;
    const MEL = [0, 4, 7, 4, 9, 7, 4, 2, 0, 4, 7, 12, 9, 7, 4, 7];
    const setMusicBtn = () => { $('#tmMusic').textContent = `🎵 الموسيقى: ${music ? 'تعمل' : 'متوقفة'}`; $('#tmMusic').setAttribute('aria-pressed', music); };
    setMusicBtn();
    const playLoop = () => {
      if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return; } }
      ctx.resume?.(); nextNote = ctx.currentTime + 0.05; noteI = 0;
      sched = setInterval(() => {
        while (nextNote < ctx.currentTime + 0.3) {
          const o = ctx.createOscillator(), gN = ctx.createGain();
          o.type = 'triangle'; o.frequency.value = 392 * Math.pow(2, MEL[noteI % MEL.length] / 12);
          gN.gain.setValueAtTime(0.0001, nextNote); gN.gain.exponentialRampToValueAtTime(0.08, nextNote + 0.02); gN.gain.exponentialRampToValueAtTime(0.0001, nextNote + 0.26);
          o.connect(gN).connect(ctx.destination); o.start(nextNote); o.stop(nextNote + 0.3);
          nextNote += 0.25; noteI++;
        }
      }, 100);
    };
    const stopLoop = () => { clearInterval(sched); sched = null; };
    const chime = () => { if (!ctx || !music) return; [0, 4, 7, 12].forEach((s, k) => { const o = ctx.createOscillator(), gN = ctx.createGain(), t0 = ctx.currentTime + k * 0.12; o.frequency.value = 523 * Math.pow(2, s / 12); gN.gain.setValueAtTime(0.1, t0); gN.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5); o.connect(gN).connect(ctx.destination); o.start(t0); o.stop(t0 + 0.5); }); };
    $('#tmMusic').onclick = () => { music = !music; store.set('music', music); setMusicBtn(); if (tm) { music ? playLoop() : stopLoop(); } };

    const POS = [[64, 18], [18, 18], [18, 64], [64, 64]], NAMES = ['الأسنان العلوية اليمنى', 'الأسنان العلوية اليسرى', 'الأسنان السفلية اليسرى', 'الأسنان السفلية اليمنى'];
    let tm = null, left = 120;
    const setQ = q => { $$('.qd').forEach(e => e.classList.toggle('on', +e.dataset.q === q)); const b = $('#tmBrush'); if (q < 0) { b.hidden = true; return; } b.hidden = false; b.style.left = POS[q][0] + '%'; b.style.top = POS[q][1] + '%'; };
    setQ(-1);
    const stop = () => { clearInterval(tm); tm = null; stopLoop(); $('#timer').classList.remove('run'); };
    $('#tmGo').onclick = () => {
      if (tm) { stop(); $('#tmGo').textContent = 'تابع'; return; }
      if (left <= 0) left = 120;
      $('#tmStars').hidden = true; $('#tmGo').textContent = 'إيقاف مؤقت'; $('#timer').classList.add('run');
      if (music) playLoop();
      const tick = () => {
        const m = Math.floor(left / 60), s = left % 60; $('#tmT').textContent = `${m}:${String(s).padStart(2, '0')}`;
        $('#tmFg').style.strokeDashoffset = 326.7 * (1 - left / 120);
        const q = Math.min(3, Math.floor((120 - left) / 30));
        if (left > 0) { setQ(q); $('#tmMsg').textContent = `نظّف الآن: ${NAMES[q]} (${30 - ((120 - left) % 30)} ثانية)`; }
        else { stop(); setQ(-1); $('#tmMsg').textContent = 'ابصق المعجون ولا تشطف بكثرة. أراك الليلة!'; $('#tmStars').hidden = false; $('#tmGo').textContent = 'مرة أخرى'; chime(); return; }
        left--;
      };
      tick(); tm = setInterval(tick, 1000);
    };
  }

  // ---------- 1e. myths quiz ----------
  if ($('#quiz')) {
    let qi = 0, score = 0, over = false;
    const qShow = () => { const m = D.myths[qi]; $('#qzIc').innerHTML = m.ic; $('#qzQ').textContent = m.q; $('#qzN').textContent = `العبارة ${qi + 1} من ${D.myths.length}`; $('#qzS').textContent = `النقاط: ${score}`; $('#qzFb').className = 'qz-fb'; $('#qzFb').innerHTML = ''; $('#qzNext').hidden = true; $$('.qz-btns .btn').forEach(b => b.disabled = false); };
    $$('.qz-btns .btn').forEach(b => b.onclick = () => {
      const good = b.dataset.a === '0'; if (good) score++;
      $$('.qz-btns .btn').forEach(x => x.disabled = true);
      $('#qzFb').className = 'qz-fb ' + (good ? 'good' : 'bad');
      $('#qzFb').innerHTML = `<span class="r">${good ? 'إجابة صحيحة! إنها معلومة خاطئة ✓' : 'انتبه! هذه معلومة خاطئة ✗'}</span>الحقيقة: ${esc(D.myths[qi].f)}`;
      $('#qzS').textContent = `النقاط: ${score}`; $('#qzNext').hidden = false; $('#qzNext').textContent = qi === D.myths.length - 1 ? 'النتيجة' : 'العبارة التالية';
    });
    $('#qzNext').onclick = () => {
      if (over) { over = false; qi = 0; score = 0; qShow(); return; }
      if (qi < D.myths.length - 1) { qi++; qShow(); return; }
      over = true; $('#qzIc').innerHTML = ''; $('#qzQ').textContent = `نتيجتك: ${score} من ${D.myths.length} ${score >= 6 ? '🏆 أنت خبير أسنان!' : '👍 أعد المحاولة لتصبح خبيراً'}`; $('#qzFb').innerHTML = ''; $('#qzNext').textContent = 'العب من جديد';
    };
    qShow();
  }

  // ---------- 1f. match + 1g. order ----------
  if ($('#order')) {
    const fixes = shuffle(D.pairs.map((p, i) => [p[1], i]));
    $('#mFix').innerHTML = fixes.map(([f, i]) => `<button class="mc" data-i="${i}">${esc(f)}</button>`).join('');
    let sel = null, matched = 0;
    $$('#mCause .mc').forEach(b => b.onclick = () => { if (b.classList.contains('done')) return; $$('#mCause .mc').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); sel = b; $('#mFb').textContent = 'والآن اختر الحل المناسب'; });
    $$('#mFix .mc').forEach(b => b.onclick = () => {
      if (!sel) { $('#mFb').textContent = 'اختر السبب أولاً'; return; } if (b.classList.contains('done')) return;
      if (b.dataset.i === sel.dataset.i) { b.classList.add('done'); sel.classList.remove('sel'); sel.classList.add('done'); sel = null; matched++; $('#mFb').textContent = matched === D.pairs.length ? 'أحسنت يا محقّق! حللت القضية كاملة 🕵️‍♂️' : 'صحيح! تابع ✓'; }
      else { b.classList.add('wrong'); setTimeout(() => b.classList.remove('wrong'), 450); $('#mFb').textContent = 'ليس هذا الحل، فكّر مرة أخرى'; }
    });
    let next = 0;
    const build = () => {
      next = 0; $('#oFb').textContent = '';
      $('#order').innerHTML = shuffle(D.order.map((s, i) => [s, i])).map(([s, i]) => `<button class="ob" data-i="${i}"><span class="num">${i + 1}</span>${s.ic}<span>${esc(s.h)}</span></button>`).join('');
      $$('.ob').forEach(b => b.onclick = () => {
        if (b.classList.contains('done')) return;
        if (+b.dataset.i === next) { b.classList.add('done'); next++; $('#oFb').textContent = next === D.order.length ? 'رائع! أنقذت السن. تذكّر: كل دقيقة مهمة 🚑' : D.order[next - 1].p; }
        else { b.classList.add('wrong'); setTimeout(() => b.classList.remove('wrong'), 450); $('#oFb').textContent = 'ليست هذه الخطوة التالية، حاول مرة أخرى'; }
      });
    };
    $('#oReset').onclick = build; build();
  }

  // ---------- 2. library tabs + share ----------
  $$('.tab').forEach(t => t.onclick = () => {
    $$('.tab').forEach(x => { x.classList.toggle('on', x === t); x.setAttribute('aria-selected', x === t); });
    $$('.tabp').forEach(p => p.hidden = p.id !== t.dataset.tab);
  });
  $$('.share').forEach(b => b.onclick = async () => {
    const url = new URL(b.dataset.url, location.href).href;
    try { if (navigator.share) { await navigator.share({ title: b.dataset.title, url }); return; } } catch { return; }
    try { await navigator.clipboard.writeText(url); b.textContent = '✓ نُسخ الرابط'; } catch { b.textContent = url; }
    setTimeout(() => b.textContent = '↗ مشاركة', 2500);
  });

  // ---------- 4. mouth map ----------
  {
    const show = k => {
      const m = D.mouth[k]; if (!m) return;
      $$('[data-part]').forEach(e => e.classList.toggle('sel', e.dataset.part === k));
      $('#mmInfo').innerHTML = `<h3><i class="sw sw-${k}"></i>${esc(m.name)}</h3><p class="cnt">${esc(m.count)}</p>
      <dl><dt>وظيفتها</dt><dd>${esc(m.job)}</dd><dt>كيف أعتني بها؟</dt><dd>${esc(m.care)}</dd><dt>مشكلات قد تصيبها</dt><dd>${esc(m.risk)}</dd></dl><p class="fact">💡 ${esc(m.tip)}</p>`;
    };
    $$('.mmap [data-part], .lg').forEach(e => { e.addEventListener('click', () => show(e.dataset.part)); e.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); show(e.dataset.part); } }); });
  }

  // ---------- 5. tracker + certificate ----------
  if ($('#cCanvas')) {
  const ch = store.get('chart', {});
  const paint = () => { let gN = 0, rN = 0; $$('.tc').forEach(b => { const v = ch[b.dataset.k]; b.className = 'tc' + (v === 1 ? ' g' : v === 2 ? ' r' : ''); if (v === 1) gN++; if (v === 2) rN++; }); $('#chG').textContent = gN; $('#chR').textContent = rN; return gN; };
  $$('.tc').forEach(b => b.onclick = () => { const k = b.dataset.k; ch[k] = ((ch[k] || 0) + 1) % 3; store.set('chart', ch); paint(); });
  $('#chReset').onclick = () => { if ($('#chReset').dataset.sure !== '1') { $('#chReset').dataset.sure = '1'; $('#chReset').textContent = 'متأكد؟ اضغط مرة أخرى'; setTimeout(() => { $('#chReset').dataset.sure = ''; $('#chReset').textContent = 'مسح الجدول'; }, 3000); return; } for (const k in ch) delete ch[k]; store.set('chart', ch); paint(); $('#chReset').dataset.sure = ''; $('#chReset').textContent = 'مسح الجدول'; };
  paint();

  const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
  const cv = $('#cCanvas'), c2 = cv.getContext('2d');
  const drawCert = async () => {
    await Promise.all(['700 60px "Times New Roman"', '700 60px Amiri', '400 30px Amiri'].map(f => document.fonts.load(f).catch(() => { })));
    const [lh, sl, to] = await Promise.all([load('assets/letterhead.jpg'), load(D.salem), load(D.tooth)]);
    const W = cv.width, Hh = cv.height, name = $('#cName').value.trim() || '..................', grade = $('#cGrade').value, school = $('#cSchool').value.trim(), green = paint();
    c2.fillStyle = '#fffaf0'; c2.fillRect(0, 0, W, Hh);
    c2.strokeStyle = '#1f8fbf'; c2.lineWidth = 18; c2.strokeRect(30, 30, W - 60, Hh - 60);
    c2.strokeStyle = '#ffd23f'; c2.lineWidth = 6; c2.strokeRect(58, 58, W - 116, Hh - 116);
    if (lh) { const h = 150, w = lh.width * h / lh.height; c2.drawImage(lh, (W - w) / 2, 80, w, h); }
    if (sl) c2.drawImage(sl, 85, 760, 160, 291);
    if (to) c2.drawImage(to, W - 310, 830, 200, 200);
    c2.direction = 'rtl'; c2.textAlign = 'center'; c2.fillStyle = '#1d1d1f';
    c2.font = '700 104px "Times New Roman", Times, Amiri, serif'; c2.fillStyle = '#1f6fb2'; c2.fillText('شهادة بطل الأسنان النظيفة', W / 2, 360, 1080);
    c2.fillStyle = '#1d1d1f'; c2.font = '700 40px "Times New Roman", Times, Amiri, serif'; c2.fillText('يسرّ قسم تعزيز الصحة وبرنامج الصحة المدرسية والجامعية منح الطالب', W / 2, 460, 1080);
    c2.font = '700 84px "Times New Roman", Times, Amiri, serif'; c2.fillStyle = '#1f6fb2'; c2.fillText(name, W / 2, 580, 1080);
    c2.fillStyle = '#1d1d1f'; c2.font = '700 40px "Times New Roman", Times, Amiri, serif'; c2.fillText(`الصف ${grade}${school ? ' · ' + school : ''}`, W / 2, 650, 1080);
    c2.fillText('هذه الشهادة تقديراً لالتزامه بتفريش أسنانه صباحاً ومساءً', W / 2, 730, 1080);
    c2.font = '700 46px "Times New Roman", Times, Amiri, serif'; c2.fillStyle = '#2a9d8f'; c2.fillText(`جمع ${green} سنّاً أخضر من 14 في تحدّي الأيام السبعة`, W / 2, 810, 1080);
    c2.fillStyle = '#1d1d1f'; c2.font = '700 30px "Times New Roman", Times, Amiri, serif'; c2.fillText('توقيع ولي الأمر: ................        الممرض المدرسي: ................', W / 2, 920, 1080);
    c2.font = '700 26px "Times New Roman", Times, Amiri, serif'; c2.fillStyle = '#4a5560'; c2.fillText(D.credit, W / 2, 1040, 1080);
  };
  drawCert();
  $('#cMake').onclick = async () => {
    await drawCert();
    try { $('#cDl').href = cv.toDataURL('image/png'); $('#cDl').hidden = false; } catch { }
    $('#cPrint').hidden = false; $('#cMake').textContent = 'حدّث الشهادة';
  };
  $('#cPrint').onclick = () => {
    const url = cv.toDataURL('image/png'); const img = document.createElement('img'); img.src = url; img.className = 'print-only';
    document.body.appendChild(img); document.body.classList.add('printing');
    setTimeout(() => { window.print(); setTimeout(() => { img.remove(); document.body.classList.remove('printing'); }, 500); }, 150);
  };
  }
})();
