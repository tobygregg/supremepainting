/* ============================================================
   Supreme Painting & Decorating — site behaviour
   Sections: header · mobile menu · hero paint · van · reveals
             process line · gallery + lightbox · quote form
   ============================================================ */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Footer year ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Header: goes solid once you scroll ---------- */
  const header = $('#site-header');
  const onScrollHeader = () => {
    const solid = window.scrollY > 24;
    header.classList.toggle('bg-ink/90', solid);
    header.classList.toggle('backdrop-blur-md', solid);
    header.classList.toggle('shadow-lift', solid);
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('#menu-btn');
  const menu = $('#mobile-menu');
  const setMenu = (open) => {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    $('#mb-top').style.transform = open ? 'translateY(4px) rotate(45deg)' : '';
    $('#mb-bot').style.transform = open ? 'translateY(-4px) rotate(-45deg)' : '';
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false); });

  /* ---------- Hero: headline rises, then the brush paints the swoosh ---------- */
  const hero = $('#hero');
  const paintSvg = $('#paint-svg');
  const paths = $$('.paint-path', paintSvg);
  const brush = $('#brush');
  const main = paths[0];
  const lengths = paths.map((p) => p.getTotalLength());
  paths.forEach((p, i) => { p.style.strokeDasharray = lengths[i]; p.style.strokeDashoffset = lengths[i]; });

  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const paint = () => {
    if (reduceMotion) {
      paths.forEach((p) => (p.style.strokeDashoffset = 0));
      paintSvg.classList.add('is-painted');
      return;
    }
    const DUR = 1400;
    let start;
    brush.setAttribute('opacity', '1');
    const frame = (now) => {
      start ??= now;
      const t = Math.min((now - start) / DUR, 1);
      const e = ease(t);
      paths.forEach((p, i) => (p.style.strokeDashoffset = lengths[i] * (1 - e)));
      const L = lengths[0] * e;
      const pt = main.getPointAtLength(L);
      const ahead = main.getPointAtLength(Math.min(L + 2, lengths[0]));
      const angle = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI;
      brush.setAttribute('transform', `translate(${pt.x} ${pt.y - 4}) rotate(${angle * 0.35})`);
      if (t < 1) return requestAnimationFrame(frame);
      // lift the brush off the wall and fade it out
      paintSvg.classList.add('is-painted');
      let liftStart;
      const lift = (n) => {
        liftStart ??= n;
        const k = Math.min((n - liftStart) / 500, 1);
        brush.setAttribute('transform', `translate(${pt.x + 10 * k} ${pt.y - 4 - 34 * ease(k)}) rotate(${angle * 0.35 - 8 * k})`);
        brush.setAttribute('opacity', String(1 - k));
        if (k < 1) requestAnimationFrame(lift);
      };
      requestAnimationFrame(lift);
    };
    requestAnimationFrame(frame);
  };

  const startHero = () => {
    hero.classList.add('is-loaded');
    setTimeout(paint, reduceMotion ? 0 : 550);
  };
  // wait for fonts so the headline doesn't jump mid-animation
  (document.fonts?.ready ?? Promise.resolve()).then(() => requestAnimationFrame(startHero));

  /* ---------- Van drives in once it's on screen ---------- */
  const van = $('#van');
  if (van) {
    if (reduceMotion) van.style.transform = 'none';
    else {
      const vo = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => van.classList.add('is-driving'), 1300);
          vo.disconnect();
        }
      }, { threshold: 0.2 });
      vo.observe(van.parentElement);
    }
  }

  /* ---------- Scroll reveals ---------- */
  const ro = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); ro.unobserve(en.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el) => (reduceMotion ? el.classList.add('is-in') : ro.observe(el)));

  /* ---------- Process: gold paint line fills as you scroll ---------- */
  const steps = $('#steps');
  const dots = $$('.step-dot', steps);
  const onScrollSteps = () => {
    const r = steps.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(Math.max((vh * 0.75 - r.top) / (r.height + vh * 0.15), 0), 1);
    steps.style.setProperty('--p', p.toFixed(3));
    dots.forEach((d, i) => {
      const on = p >= i / (dots.length - 1) - 0.02 || p === 1;
      d.classList.toggle('gold-fill', on);
      d.classList.toggle('!text-ink', on);
      d.classList.toggle('!border-gold-200', on);
    });
  };
  onScrollSteps();
  window.addEventListener('scroll', onScrollSteps, { passive: true });
  window.addEventListener('resize', onScrollSteps);

  /* ---------- Gallery filter ---------- */
  const items = $$('#gallery .g-item');
  $$('[data-filter]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      $$('[data-filter]').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      items.forEach((it) => {
        const show = f === 'all' || it.dataset.cat === f;
        it.classList.toggle('hidden', !show);
        if (show) {
          it.classList.add('is-in');
          it.animate?.([{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: reduceMotion ? 1 : 350, easing: 'ease-out' });
        }
      });
    });
  });

  /* ---------- Lightbox ---------- */
  const lb = $('#lightbox');
  const lbImg = $('#lb-img');
  const lbCap = $('#lb-cap');
  let current = 0;
  let lastFocus = null;
  const visibleButtons = () => items.filter((it) => !it.classList.contains('hidden')).map((it) => $('button', it));

  const show = (i) => {
    const list = visibleButtons();
    current = (i + list.length) % list.length;
    const b = list[current];
    lbImg.src = b.dataset.full;
    lbImg.alt = $('img', b).alt;
    lbCap.textContent = b.dataset.caption || '';
  };
  const openLb = (btn) => {
    lastFocus = btn;
    show(visibleButtons().indexOf(btn));
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('#lb-close').focus();
  };
  const closeLb = () => {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocus?.focus();
  };
  items.forEach((it) => $('button', it).addEventListener('click', (e) => openLb(e.currentTarget)));
  $('#lb-close').addEventListener('click', closeLb);
  $('#lb-prev').addEventListener('click', () => show(current - 1));
  $('#lb-next').addEventListener('click', () => show(current + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'Tab') { // keep focus inside the viewer
      const f = $$('button', lb);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
    }
  });
  // swipe on phones
  let x0 = null;
  lb.addEventListener('touchstart', (e) => (x0 = e.touches[0].clientX), { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    x0 = null;
  });

  /* ---------- Quote form (FormSubmit AJAX) ---------- */
  const form = $('#quote-form');
  const status = $('#form-status');
  const done = $('#form-done');
  const setStatus = (msg, ok) => {
    status.textContent = msg;
    status.classList.remove('hidden');
    status.className = `mt-5 rounded-xl px-4 py-3 text-sm ${ok ? 'bg-gold/15 text-gold-100' : 'bg-red-500/15 text-red-200'}`;
  };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus('Add your name, a valid email and a few words about the job, then send again.', false);
      return;
    }
    const btn = $('button[type=submit]', form);
    const label = $('.btn-label', btn);
    btn.disabled = true;
    label.textContent = 'Sending…';
    try {
      const endpoint = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === 'false') throw new Error(json.message || 'Send failed');
      form.classList.add('hidden');
      done.classList.remove('hidden');
      done.focus();
    } catch (err) {
      setStatus("That didn't send. Check your connection and try again, or email supremedecorltd@gmail.com directly.", false);
      btn.disabled = false;
      label.textContent = 'Send quote request';
    }
  });
})();
