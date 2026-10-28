// YAYA Nails Studio · «Bijou»: el reel del ojo de gato se destapa a sangre, «YAYA» brilla en cromo y sube letra a letra;
// los trabajos se ven como un lookbook que se arrastra (con flechas, teclado y barra de progreso).
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const has = () => typeof gsap !== 'undefined' && !reduce;

  function hero() {
    if (!has()) return;
    gsap.fromTo('#hVid', { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' });
    gsap.fromTo('#hVid video', { scale: 1.3 }, { scale: 1, duration: 2.6, ease: 'expo.out' });
    gsap.fromTo('.name span', { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.6, ease: 'expo.out', stagger: .08, delay: .3 });
    gsap.to('#hVid video', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  function lookbook() {
    const tr = document.getElementById('track'), slides = [...tr.children], num = document.getElementById('cNum'), bar = document.getElementById('cBar');
    document.getElementById('cTot').textContent = String(slides.length).padStart(2, '0');
    const step = () => slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(tr).columnGap || 20);
    const go = (d) => tr.scrollBy({ left: d * step(), behavior: reduce ? 'auto' : 'smooth' });
    document.getElementById('cPrev').addEventListener('click', () => go(-1));
    document.getElementById('cNext').addEventListener('click', () => go(1));
    tr.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } });
    const upd = () => {
      const max = tr.scrollWidth - tr.clientWidth, p = max > 0 ? tr.scrollLeft / max : 0;
      bar.style.width = (12 + p * 88) + '%';
      num.textContent = String(Math.min(slides.length, Math.round(p * (slides.length - 1)) + 1)).padStart(2, '0');
    };
    tr.addEventListener('scroll', upd, { passive: true }); upd();
    // arrastrar con el ratón
    let down = false, x0 = 0, s0 = 0, moved = false;
    tr.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; x0 = e.clientX; s0 = tr.scrollLeft; tr.classList.add('drag'); });
    addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - x0; if (Math.abs(dx) > 4) moved = true; tr.scrollLeft = s0 - dx; });
    addEventListener('pointerup', () => {
      if (!down) return; down = false; tr.classList.remove('drag');
      if (moved) { const i = Math.round(tr.scrollLeft / step()); tr.scrollTo({ left: i * step(), behavior: reduce ? 'auto' : 'smooth' }); }
    });
    if (has()) gsap.fromTo(slides, { x: 120, opacity: 0 }, { x: 0, opacity: 1, duration: 1.4, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: tr, start: 'top 85%' } });
  }

  function init() { hero(); lookbook(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
