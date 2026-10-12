(function () {
  // Mobile menu
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('#links a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // Akure local time (Africa/Lagos)
  var clock = document.getElementById('clock');
  function tick() {
    try {
      clock.textContent = new Date().toLocaleTimeString('en-GB', {
        timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) { clock.textContent = ''; }
  }
  tick();
  setInterval(tick, 20000);

  // Hero: drifting network that is drawn toward the cursor
  var cv = document.getElementById('net');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W, H, dpr, pts = [], mouse = { x: -999, y: -999 };

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(90, W * H / 14000));
    pts = [];
    for (var i = 0; i < n; i++) {
      pts.push({ x: Math.random() * W, y: Math.random() * H,
                 vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 });
    }
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    var link = 130;
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      if (!reduce) {
        var dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 180 && d > 1) { p.vx += dx / d * .012; p.vy += dy / d * .012; }
        p.vx *= .99; p.vy *= .99;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, 6.283);
      ctx.fillStyle = 'rgba(56,189,248,.7)';
      ctx.fill();
      for (var j = i + 1; j < pts.length; j++) {
        var q = pts[j], ax = p.x - q.x, ay = p.y - q.y, dist = Math.sqrt(ax * ax + ay * ay);
        if (dist < link) {
          ctx.strokeStyle = 'rgba(56,189,248,' + (0.22 * (1 - dist / link)) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
    }
    if (!reduce) requestAnimationFrame(frame);
  }

  var hero = cv.parentElement;
  hero.addEventListener('pointermove', function (e) {
    var r = cv.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  hero.addEventListener('pointerleave', function () { mouse.x = mouse.y = -999; });
  window.addEventListener('resize', function () { size(); if (reduce) frame(); });
  size();
  frame();
})();
