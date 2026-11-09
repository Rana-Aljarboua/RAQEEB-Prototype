(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- theme toggle ---------- */
  var btn = document.getElementById('themeBtn');
  function isLight() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'light';
    return window.matchMedia('(prefers-color-scheme: light)').matches;
  }
  function syncBtn() { btn.textContent = isLight() ? 'الوضع الداكن' : 'الوضع الفاتح'; }
  btn.addEventListener('click', function () {
    root.setAttribute('data-theme', isLight() ? 'dark' : 'light');
    syncBtn();
  });
  syncBtn();

  /* ---------- reveal on scroll (content is visible at rest; this only animates bars) ---------- */
  function fillBoard() {
    var g = document.getElementById('gaugeVal'), n = document.getElementById('gaugeNum');
    var target = 88, C = 527.8;
    g.style.strokeDashoffset = C * (1 - target / 100);
    if (reduce) { n.textContent = target + '%'; }
    else {
      var t0 = performance.now();
      (function tick(t) { var p = Math.min(1, (t - t0) / 1600); n.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + '%'; if (p < 1) requestAnimationFrame(tick); })(t0);
    }
    document.querySelectorAll('#rows .track span').forEach(function (s) { s.style.width = s.dataset.w + '%'; });
  }
  function lightSteps() {
    document.querySelectorAll('#steps .step').forEach(function (s, i) { setTimeout(function () { s.classList.add('on'); }, reduce ? 0 : i * 450); });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        if (e.target.id === 'board') fillBoard();
        if (e.target.id === 'how') lightSteps();
        io.unobserve(e.target);
      });
    }, { threshold: 0.3 });
    io.observe(document.getElementById('board'));
    io.observe(document.getElementById('how'));
  } else { fillBoard(); lightSteps(); }

  /* ---------- rotating example feed ---------- */
  var pool = [
    ['NCA', 'إرشادات جديدة لحماية البيانات في الحوسبة السحابية', 'يؤثر على: أنظمة الموارد البشرية', 'mid', 'يحتاج مراجعة'],
    ['SASO', 'تعديل متطلبات وسم كفاءة الطاقة', 'يؤثر على: التغليف والملصقات', 'high', 'أثر عالٍ'],
    ['EXPORT', 'تحديث قائمة السلع ذات الاستخدام المزدوج', 'يؤثر على: شحنات التصدير', 'high', 'أثر عالٍ'],
    ['HSE', 'تحديث اشتراطات السلامة في المستودعات', 'يؤثر على: المستودع الرئيسي', 'ok', 'ممتثل'],
    ['SECTOR', 'تعميم جديد على مزوّدي الخدمات الرقمية', 'يؤثر على: بوابة العملاء', 'mid', 'يحتاج مراجعة']
  ];
  var list = document.getElementById('alerts'), pi = 0;
  if (!reduce) setInterval(function () {
    var d = pool[pi++ % pool.length];
    var li = document.createElement('li');
    li.className = 'alert new';
    li.innerHTML = '<span class="src"></span><span class="t"><small></small></span><span class="pill"></span>';
    li.children[0].textContent = d[0];
    li.children[1].insertBefore(document.createTextNode(d[1]), li.children[1].firstChild);
    li.children[1].querySelector('small').textContent = d[2];
    li.children[2].className = 'pill ' + d[3];
    li.children[2].textContent = d[4];
    list.insertBefore(li, list.firstChild);
    while (list.children.length > 3) list.removeChild(list.lastChild);
  }, 4200);

  /* ---------- interactive prototype demo ---------- */
  var cases = [
    { src: 'NCA · ECC', title: 'تحديث على ضوابط إدارة الهويات والصلاحيات', date: 'مهلة الالتزام: 90 يومًا',
      sum: 'التحديث يشترط تفعيل التحقق متعدد العوامل لكل الحسابات ذات الصلاحيات العالية، ومراجعة الصلاحيات دوريًا.',
      impact: [['high', 'نظام الموارد البشرية'], ['high', 'بوابة الموردين'], ['mid', 'شبكة المصنع']],
      decision: 'غير ممتثل جزئيًا. يلزم تفعيل التحقق متعدد العوامل للحسابات الإدارية قبل نهاية المهلة.',
      plan: [['تفعيل التحقق متعدد العوامل للحسابات الإدارية', 'أمن المعلومات · أسبوعان'], ['جرد الصلاحيات العالية في الأنظمة الثلاثة', 'تقنية المعلومات · 3 أسابيع'], ['اعتماد إجراء مراجعة صلاحيات ربع سنوية', 'الامتثال · شهر']] },
    { src: 'SASO', title: 'لائحة فنية محدّثة لمنتجات الأجهزة الكهربائية', date: 'تاريخ النفاذ: بعد 6 أشهر',
      sum: 'اللائحة تضيف متطلبات اختبار وتوثيق جديدة قبل طرح المنتج، وتحدّث بيانات بطاقة المنتج.',
      impact: [['mid', 'خط الإنتاج A'], ['mid', 'خط الإنتاج C'], ['ok', 'التغليف']],
      decision: 'يحتاج مراجعة. منتجان يحتاجان شهادة مطابقة محدّثة قبل تاريخ النفاذ.',
      plan: [['حصر المنتجات المشمولة باللائحة', 'الجودة · أسبوع'], ['حجز اختبارات المطابقة لدى جهة معتمدة', 'الجودة · شهر'], ['تحديث بطاقات المنتجات', 'التسويق · شهران']] },
    { src: 'ENV · HSE', title: 'متطلبات تقارير الانبعاثات الصناعية', date: 'دورية التقرير: ربع سنوية',
      sum: 'توحيد نموذج تقارير الانبعاثات ورفعها إلكترونيًا كل ربع سنة.',
      impact: [['ok', 'موقع الجبيل'], ['ok', 'نظام الرصد البيئي']],
      decision: 'ممتثل. البيانات المطلوبة متوفرة، ويلزم فقط تحويلها للنموذج الجديد.',
      plan: [['ربط نظام الرصد بالنموذج الجديد', 'تقنية المعلومات · أسبوعان'], ['رفع أول تقرير بالنموذج الموحّد', 'البيئة والسلامة · نهاية الربع']] }
  ];
  var lvl = { high: 'أثر عالٍ', mid: 'يحتاج مراجعة', ok: 'ممتثل' };
  var dl = document.getElementById('demoList'), dout = document.getElementById('demoOut');
  function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
  function show(i) {
    var c = cases[i];
    Array.prototype.forEach.call(dl.children, function (b, k) { b.setAttribute('aria-selected', k === i ? 'true' : 'false'); b.tabIndex = k === i ? 0 : -1; });
    dout.classList.remove('fade'); void dout.offsetWidth; dout.classList.add('fade');
    dout.innerHTML =
      '<div class="d-meta"><span class="code">' + esc(c.src) + '</span><span>·</span><span>' + esc(c.date) + '</span><span class="tag-ex">مثال توضيحي</span></div>' +
      '<h3>' + esc(c.title) + '</h3>' +
      '<div class="d-block"><span class="d-label">الملخص</span><p>' + esc(c.sum) + '</p></div>' +
      '<div class="d-block"><span class="d-label">الأثر على الشركة</span><ul class="impact">' + c.impact.map(function (x) { return '<li class="' + x[0] + '">' + esc(x[1]) + ' · ' + lvl[x[0]] + '</li>'; }).join('') + '</ul></div>' +
      '<div class="d-block"><span class="d-label">القرار المقترح</span><p>' + esc(c.decision) + '</p></div>' +
      '<div class="d-block"><span class="d-label">خطة العمل</span><ol class="plan">' + c.plan.map(function (x, k) { return '<li><span class="p">P' + (k + 1) + '</span><span>' + esc(x[0]) + '</span><span class="who">' + esc(x[1]) + '</span></li>'; }).join('') + '</ol></div>';
  }
  cases.forEach(function (c, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'demo-tab'; b.id = 'demo-tab-' + i; b.setAttribute('role', 'tab');
    b.innerHTML = '<span class="src">' + esc(c.src) + '</span><span class="tt">' + esc(c.title) + '</span>';
    b.addEventListener('click', function () { show(i); });
    b.addEventListener('keydown', function (e) {
      var n = cases.length, j = e.key === 'ArrowDown' ? (i + 1) % n : e.key === 'ArrowUp' ? (i - 1 + n) % n : -1;
      if (j >= 0) { e.preventDefault(); show(j); dl.children[j].focus(); }
    });
    dl.appendChild(b);
  });
  show(0);

  /* ---------- 3D radar globe ---------- */
  if (!window.THREE) return;
  var canvas = document.getElementById('scene');
  var renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); }
  catch (e) { return; }
  document.querySelector('.fallback').style.opacity = '0.0';
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  var R = 2.4;
  var world = new THREE.Group(); scene.add(world);
  var globe = new THREE.Group(); world.add(globe);
  world.rotation.x = 0.35;

  function css(v) { return getComputedStyle(root).getPropertyValue(v).trim(); }
  function col(v) { return new THREE.Color(css(v) || '#2EE59D'); }

  // round glow sprite
  var sc = document.createElement('canvas'); sc.width = sc.height = 64;
  var sg = sc.getContext('2d'), grd = sg.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.35, 'rgba(255,255,255,0.8)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
  sg.fillStyle = grd; sg.fillRect(0, 0, 64, 64);
  var dotTex = new THREE.CanvasTexture(sc);

  // dense surface dots (fibonacci sphere)
  var N = 900, pos = new Float32Array(N * 3);
  for (var i = 0; i < N; i++) {
    var y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
    pos[i * 3] = Math.cos(th) * r * R; pos[i * 3 + 1] = y * R; pos[i * 3 + 2] = Math.sin(th) * r * R;
  }
  var dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  var dm = new THREE.PointsMaterial({ size: 0.045, map: dotTex, transparent: true, opacity: 0.55, depthWrite: false });
  globe.add(new THREE.Points(dg, dm));

  // wireframe shell
  var wm = new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0.07 });
  globe.add(new THREE.Mesh(new THREE.IcosahedronGeometry(R * 0.995, 3), wm));
  // inner core glow
  var cm = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.35 });
  globe.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.97, 48, 48), cm));

  // regulation nodes
  var M = 46, npos = new Float32Array(M * 3), ncol = new Float32Array(M * 3), nodes = [];
  for (var k = 0; k < M; k++) {
    var u = Math.random() * 2 - 1, a = Math.random() * Math.PI * 2, rr = Math.sqrt(1 - u * u);
    var v = new THREE.Vector3(Math.cos(a) * rr, u * 0.85, Math.sin(a) * rr).normalize().multiplyScalar(R * 1.01);
    npos.set([v.x, v.y, v.z], k * 3);
    var roll = Math.random();
    nodes.push({ v: v, kind: roll < 0.12 ? 'danger' : roll < 0.32 ? 'alert' : 'brand', heat: 0 });
  }
  var ng = new THREE.BufferGeometry();
  ng.setAttribute('position', new THREE.BufferAttribute(npos, 3));
  ng.setAttribute('color', new THREE.BufferAttribute(ncol, 3));
  var nm = new THREE.PointsMaterial({ size: 0.16, map: dotTex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  globe.add(new THREE.Points(ng, nm));

  // arcs between nodes
  var arcMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.35 });
  for (var j = 0; j < 14; j++) {
    var p1 = nodes[(j * 7) % M].v, p2 = nodes[(j * 11 + 5) % M].v;
    var mid = p1.clone().add(p2).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(R * (1.25 + p1.distanceTo(p2) * 0.12));
    var curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
    globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)), arcMat));
  }

  // radar sweep (half-disc rotating around the axis)
  var sweepGroup = new THREE.Group(); world.add(sweepGroup);
  var sweepMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.10, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
  var sweep = new THREE.Mesh(new THREE.CircleGeometry(R * 1.12, 64, -Math.PI / 2, Math.PI), sweepMat);
  sweepGroup.add(sweep);
  var edgeMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.8 });
  var edgePts = [];
  for (var e = 0; e <= 64; e++) { var t = -Math.PI / 2 + Math.PI * e / 64; edgePts.push(new THREE.Vector3(Math.cos(t) * R * 1.12, Math.sin(t) * R * 1.12, 0)); }
  sweepGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(edgePts), edgeMat));

  // orbit rings with satellites
  var rings = [], ringMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.28 });
  var satMat = new THREE.PointsMaterial({ size: 0.2, map: dotTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  [[3.15, 1.2, 0.3], [3.55, -0.5, 1.1], [3.9, 0.25, -0.8]].forEach(function (cfg, idx) {
    var g = new THREE.Group(); g.rotation.set(cfg[1], cfg[2], 0); world.add(g);
    var pts = []; for (var q = 0; q <= 128; q++) { var an = q / 128 * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(an) * cfg[0], 0, Math.sin(an) * cfg[0])); }
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), ringMat));
    var sgeo = new THREE.BufferGeometry(); sgeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3));
    var sat = new THREE.Points(sgeo, satMat); g.add(sat);
    rings.push({ r: cfg[0], sat: sat, speed: 0.25 + idx * 0.12, off: idx * 2 });
  });

  // floating dust
  var D = 260, dpos = new Float32Array(D * 3);
  for (var d = 0; d < D; d++) { dpos[d * 3] = (Math.random() - 0.5) * 22; dpos[d * 3 + 1] = (Math.random() - 0.5) * 14; dpos[d * 3 + 2] = (Math.random() - 0.5) * 10 - 2; }
  var dust = new THREE.BufferGeometry(); dust.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
  var dustMat = new THREE.PointsMaterial({ size: 0.04, map: dotTex, transparent: true, opacity: 0.5, depthWrite: false });
  var dustPts = new THREE.Points(dust, dustMat); scene.add(dustPts);

  // theme colors
  var C = {};
  function applyColors() {
    var light = isLight();
    C.brand = col('--brand'); C.accent = col('--accent'); C.alert = col('--alert'); C.danger = col('--danger');
    C.deep = col('--brand-deep'); C.ink = col('--ink');
    dm.color = C.accent; wm.color = C.brand; cm.color = light ? col('--surface-200') : col('--surface-100');
    cm.opacity = light ? 0.55 : 0.6;
    arcMat.color = C.accent; sweepMat.color = C.brand; edgeMat.color = C.brand;
    ringMat.color = C.accent; satMat.color = C.brand; dustMat.color = C.accent;
    nm.blending = sweepMat.blending = satMat.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
    sweepMat.opacity = light ? 0.08 : 0.10;
    [nm, sweepMat, satMat].forEach(function (m) { m.needsUpdate = true; });
  }
  applyColors();
  new MutationObserver(applyColors).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  var mq = window.matchMedia('(prefers-color-scheme: light)');
  if (mq.addEventListener) mq.addEventListener('change', function () { applyColors(); syncBtn(); });

  // layout
  var narrow = false;
  function resize() {
    var w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    narrow = w < 900;
    // RTL: copy on the right, globe on the left
    world.position.x = narrow ? 0 : -2.9;
    world.position.y = narrow ? 1.6 : 0;
    var s = narrow ? 0.62 : 1; world.scale.set(s, s, s);
  }
  window.addEventListener('resize', resize); resize();

  var mx = 0, my = 0, tx = 0, ty = 0;
  window.addEventListener('pointermove', function (ev) { tx = (ev.clientX / window.innerWidth - 0.5); ty = (ev.clientY / window.innerHeight - 0.5); });

  var tmp = new THREE.Vector3(), clock = new THREE.Clock(), elapsed = 0;
  function frame() {
    var dt = Math.min(clock.getDelta(), 0.05);
    if (!reduce) elapsed += dt;
    mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;

    globe.rotation.y = elapsed * 0.08;
    var sweepAng = elapsed * 0.9;
    sweepGroup.rotation.y = sweepAng;
    world.rotation.y = mx * 0.5; world.rotation.x = 0.35 + my * 0.3;

    // scroll: drift the globe back and fade the sweep
    var sc = Math.min(window.scrollY / 900, 1);
    camera.position.z = 9 + sc * 2.5;
    camera.position.y = -sc * 0.8;

    // node heat: brighten as the sweep passes
    for (var i = 0; i < M; i++) {
      var n = nodes[i];
      tmp.copy(n.v); globe.localToWorld(tmp); sweepGroup.worldToLocal(tmp);
      var ang = Math.atan2(-tmp.z, tmp.x); // angle from sweep plane
      var diff = ((ang % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      if (diff < 0.25 && tmp.x > 0) n.heat = 1;
      n.heat *= 0.985;
      var c = C[n.kind], b = 0.25 + n.heat * 0.9;
      ncol[i * 3] = c.r * b; ncol[i * 3 + 1] = c.g * b; ncol[i * 3 + 2] = c.b * b;
    }
    ng.attributes.color.needsUpdate = true;

    rings.forEach(function (rg) {
      var an = elapsed * rg.speed + rg.off, p = rg.sat.geometry.attributes.position;
      p.setXYZ(0, Math.cos(an) * rg.r, 0, Math.sin(an) * rg.r); p.needsUpdate = true;
    });
    dustPts.rotation.y = elapsed * 0.01;

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
