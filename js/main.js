// YAYA Nails · «Ull de gat»: esmalte magnético dibujado en canvas; el cursor (o el dedo) es el imán que mueve la línea de luz
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LI = () => ({ es: 0, ca: 1, en: 2 }[document.documentElement.lang] || 0);
  const T = (es, ca, en) => [es, ca, en][LI()];
  const WA = 'https://wa.me/34614145848?text=';
  const COLORS = [
    { n: ['Azul noche', 'Blau nit', 'Midnight blue'], a: '#0d1640', b: '#8fb0ff' },
    { n: ['Burdeos', 'Bordeus', 'Burgundy'], a: '#3a0718', b: '#ff7a9a' },
    { n: ['Plata', 'Plata', 'Silver'], a: '#24262e', b: '#eef2ff' },
    { n: ['Rosa', 'Rosa', 'Pink'], a: '#6e3346', b: '#ffd1de' },
    { n: ['Esmeralda', 'Maragda', 'Emerald'], a: '#05291f', b: '#6bffd0' }
  ];
  let color = 0;
  const hex = (h, k) => { const n = parseInt(h.slice(1), 16); const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255; return `rgb(${Math.min(255, r * k) | 0},${Math.min(255, g * k) | 0},${Math.min(255, b * k) | 0})`; };

  // ---------- motor de ojo de gato ----------
  function catEye(cv, layout, host, fingers) {
    const g = cv.getContext('2d');
    let W = 0, H = 0, d = 1, mx = 0, my = 0, tx = 0, ty = 0, idle = true, lastMove = 0, vis = true;
    const glitter = Array.from({ length: 160 }, () => [Math.random() * 2 - 1, -Math.random(), Math.random() * 6.28, .4 + Math.random() * .9]);
    const size = () => { const r = cv.getBoundingClientRect(); d = Math.min(2, devicePixelRatio || 1); W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; g.setTransform(d, 0, 0, d, 0, 0); tx = mx = W * .75; ty = my = H * .3; };
    size(); new ResizeObserver(size).observe(cv);
    new IntersectionObserver(([e]) => (vis = e.isIntersecting)).observe(cv);
    const move = (e) => { const r = cv.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; idle = false; lastMove = performance.now(); };
    host.addEventListener('pointermove', move); host.addEventListener('pointerdown', move);

    function nailPath(w, h) {
      g.beginPath(); g.moveTo(-w / 2, 0); g.lineTo(-w / 2, -h * .55);
      g.bezierCurveTo(-w / 2, -h * .86, -w * .2, -h, 0, -h); g.bezierCurveTo(w * .2, -h, w / 2, -h * .86, w / 2, -h * .55);
      g.lineTo(w / 2, 0); g.quadraticCurveTo(0, h * .09, -w / 2, 0); g.closePath();
    }
    function nail(n, t) {
      const c = COLORS[color], cx = n.x * W, cy = n.y * H, w = n.w * Math.min(W, H * 1.25), h = w * n.k;
      g.save(); g.translate(cx, cy); g.rotate(n.r);
      if (fingers) { // dedo
        const fg = g.createLinearGradient(-w * .7, 0, w * .7, 0); fg.addColorStop(0, '#b98576'); fg.addColorStop(.5, '#e7c2b2'); fg.addColorStop(1, '#b07c6e');
        g.fillStyle = fg; g.beginPath(); g.roundRect(-w * .66, -h * .62, w * 1.32, h * 2.6, w * .62); g.fill();
      }
      // posición del imán en el sistema de la uña
      const dx = mx - cx, dy = my - cy, cs = Math.cos(-n.r), sn = Math.sin(-n.r);
      const lx = dx * cs - dy * sn, ly = dx * sn + dy * cs + h * .5;
      const dist = Math.hypot(lx, ly) || 1, nx = lx / dist, ny = ly / dist;
      nailPath(w, h);
      const base = g.createLinearGradient(-w / 2, 0, w / 2, 0);
      base.addColorStop(0, hex(c.a, .55)); base.addColorStop(.5, c.a); base.addColorStop(1, hex(c.a, .5));
      g.fillStyle = base; g.fill();
      g.save(); g.clip();
      // la línea de luz se acerca al imán
      const R = Math.max(w, h) * .6, off = Math.min(dist / (R * 5), .42);
      const ox = 0, oy = -h * .5;
      const lg = g.createLinearGradient(ox - nx * R, oy - ny * R, ox + nx * R, oy + ny * R);
      const p = .5 + off * .5, sw = .13 + .07 * (1 - off);
      lg.addColorStop(0, 'rgba(0,0,0,0)'); lg.addColorStop(Math.max(0, p - sw * 2.6), 'rgba(0,0,0,0)');
      lg.addColorStop(Math.max(0, p - sw), hex(c.b, .55)); lg.addColorStop(p, c.b); lg.addColorStop(Math.min(1, p + sw), hex(c.b, .55));
      lg.addColorStop(Math.min(1, p + sw * 2.6), 'rgba(0,0,0,0)'); lg.addColorStop(1, 'rgba(0,0,0,0)');
      g.globalCompositeOperation = "screen"; g.globalAlpha = 1; g.fillStyle = lg; g.fillRect(-w, -h * 1.2, w * 2, h * 1.5); g.globalAlpha = .45; g.fillRect(-w, -h * 1.2, w * 2, h * 1.5);
      // purpurina que se enciende cerca de la línea
      const bx = ox + nx * R * (p * 2 - 1), by = oy + ny * R * (p * 2 - 1);
      glitter.forEach(([gx, gy, ph, s]) => {
        const x = gx * w * .5, y = gy * h, dd = Math.abs((x - bx) * nx + (y - by) * ny) / (R * sw * 2);
        const a = Math.exp(-dd * dd) * (.5 + .5 * Math.sin(t * .006 + ph)); if (a < .05) return;
        g.globalAlpha = a; g.fillStyle = '#fff'; g.fillRect(x, y, s, s);
      });
      g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
      // brillo de gel
      const gl = g.createLinearGradient(-w * .4, -h, -w * .1, -h * .2); gl.addColorStop(0, 'rgba(255,255,255,.32)'); gl.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gl; g.beginPath(); g.ellipse(-w * .22, -h * .58, w * .08, h * .32, -.05, 0, 7); g.fill();
      g.restore();
      nailPath(w, h); g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 1; g.stroke();
      g.restore();
    }
    function frame(t) {
      if (idle || t - lastMove > 2600) { idle = true; tx = W * (.5 + Math.cos(t * .0007) * .42); ty = H * (.45 + Math.sin(t * .0009) * .35); }
      mx += (tx - mx) * .12; my += (ty - my) * .12;
      g.clearRect(0, 0, W, H);
      layout().forEach((n) => nail(n, t));
    }
    const api = { draw: () => frame(performance.now()) };
    if (reduce) { frame(0); return api; }
    const loop = (t) => { if (vis) frame(t); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
    return api;
  }

  function swatches(hand, hero) {
    const box = document.getElementById('sw'), wa = document.getElementById('waColor');
    const render = () => {
      box.innerHTML = COLORS.map((c, i) => `<button type="button" role="radio" aria-checked="${i === color}" data-i="${i}" style="--a:${c.a};--b:${c.b}"><i aria-hidden="true"></i>${c.n[LI()]}</button>`).join('');
      wa.href = WA + encodeURIComponent(T(`Hola Mary, me gustaría pedir cita para unas uñas efecto ojo de gato en ${COLORS[color].n[0].toLowerCase()}.`, `Hola Mary, voldria demanar hora per a unes ungles efecte ull de gat en ${COLORS[color].n[1].toLowerCase()}.`, `Hi Mary, I would like to book cat-eye nails in ${COLORS[color].n[2].toLowerCase()}.`));
    };
    box.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; color = +b.dataset.i; render(); hand.draw(); hero.draw(); });
    box.addEventListener('keydown', (e) => { if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return; color = (color + (e.key === 'ArrowRight' ? 1 : -1) + COLORS.length) % COLORS.length; render(); box.querySelector(`[data-i="${color}"]`).focus(); });
    document.addEventListener('langchange', render); render();
  }

  function wa() {
    const set = () => document.querySelectorAll('a.wa').forEach((a) => (a.href = WA + encodeURIComponent(T('Hola Mary, me gustaría pedir cita.', 'Hola Mary, voldria demanar hora.', 'Hi Mary, I would like to book an appointment.'))));
    document.addEventListener('langchange', set); set();
  }

  function header() {
    const top = document.querySelector('.top'); let last = 0;
    addEventListener('scroll', () => {
      const y = scrollY; top.classList.toggle('solid', y > 40);
      if (y > 600 && y > last + 4) top.classList.add('hide'); else if (y < last - 4) top.classList.remove('hide');
      last = y;
    }, { passive: true });
  }

  function motion() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.hero-k, .hero h1 span, .hero h1 em, .hero-p, .hero-cta, .hero-rate', { opacity: 0, y: 30, duration: 1.4, stagger: .09, ease: 'expo.out', delay: .2 });
    gsap.from('.hero-nail', { opacity: 0, y: 80, rotate: 8, duration: 1.8, ease: 'expo.out' });
    gsap.utils.toArray('h2.rv').forEach((h) => gsap.from(h, { opacity: 0, y: 40, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%' } }));
    gsap.utils.toArray('.gal figure').forEach((f, i) => gsap.from(f, { opacity: 0, y: 60, scale: .96, duration: 1.2, ease: 'expo.out', delay: (i % 4) * .06, scrollTrigger: { trigger: f, start: 'top 94%' } }));
    gsap.utils.toArray('.s-grid article, .rs blockquote, .hand, .mary figure').forEach((el, i) => gsap.from(el, { opacity: 0, y: 40, duration: 1.2, ease: 'expo.out', delay: (i % 4) * .06, scrollTrigger: { trigger: el, start: 'top 92%' } }));
  }

  function init() {
    // portada: una uña grande; la mano: cinco uñas
    const hero = catEye(document.getElementById('heroNail'), () => [{ x: .5, y: .6, w: .3, k: 1.9, r: .08 }], document.querySelector(".hero"), true);
    const hand = catEye(document.getElementById('hand'), () => [
      { x: .17, y: .74, w: .105, k: 1.55, r: -.32 }, { x: .35, y: .56, w: .118, k: 1.75, r: -.1 }, { x: .52, y: .5, w: .124, k: 1.8, r: .02 },
      { x: .69, y: .56, w: .118, k: 1.72, r: .14 }, { x: .85, y: .74, w: .1, k: 1.5, r: .34 }], document.querySelector('.hand'), true);
    swatches(hand, hero); wa(); header();
    if (!reduce && typeof gsap !== 'undefined') motion();
    document.fonts && document.fonts.ready.then(() => typeof ScrollTrigger !== 'undefined' && ScrollTrigger.refresh());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
