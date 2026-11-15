(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const $$ = (q, r = document) => [...r.querySelectorAll(q)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  const once = (els, fn, opts) => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        fn(e.target);
      });
    }, opts || { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
  };

  $$('.section-title').forEach((title) => {
    const words = title.textContent.trim().split(/\s+/);
    title.textContent = '';
    words.forEach((word, i) => {
      const mask = document.createElement('span');
      mask.className = 'word';
      const inner = document.createElement('span');
      inner.textContent = word;
      inner.style.setProperty('--i', i);
      mask.append(inner);
      title.append(mask, i < words.length - 1 ? ' ' : '');
    });
  });
  once($$('.section-title'), (el) => el.classList.add('in'));

  [
    ['.stack-group', '.stack-item'],
    ['.music-grid', '.music-item'],
    ['.trait-grid', '.trait-item'],
    ['.style-tags', '.style-tag'],
    ['.dream-list', '.dream-item'],
    ['.project-tags', 'span'],
    ['.repo-list', '.repo-row'],
    ['.contact-list', '.contact-row'],
    ['.footer-col', 'li']
  ].forEach(([rootQ, itemQ]) => {
    const roots = $$(rootQ);
    roots.forEach((root) => {
      $$(itemQ, root).forEach((item, i) => {
        item.classList.add('st');
        item.style.setProperty('--i', i);
      });
    });
    once(roots, (el) => el.classList.add('in'), { threshold: 0.05 });
  });

  const format = new Intl.NumberFormat('pt-BR');
  once($$('.stat-number'), (el) => {
    const match = el.textContent.trim().match(/^([\d.]+)(.*)$/);
    if (!match) return;
    const end = Number(match[1].replace(/\./g, ''));
    const suffix = match[2];
    const start = performance.now();
    const tick = (now) => {
      const t = clamp((now - start) / 1500, 0, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = format.format(Math.round(end * eased)) + (t === 1 ? suffix : '');
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });


  const mark = document.querySelector('.footer-mark');
  if (mark) {
    const letters = mark.textContent.trim();
    mark.textContent = '';
    [...letters].forEach((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch;
      span.style.setProperty('--i', i);
      mark.append(span);
    });
    once([mark], (el) => el.classList.add('in'));
  }

  once($$('.wallet'), (el) => el.classList.add('in'));


  const hero = document.querySelector('.welcome');
  const heroParts = $$('.welcome-title, .welcome-rows');
  setTimeout(() => heroParts.forEach((el) => { el.style.animation = 'none'; }), 1400);


  const rail = document.getElementById('albumRail');
  const albums = rail ? $$('.area-card', rail) : [];
  const flow = () => {
    const mid = rail.scrollLeft + rail.clientWidth / 2;
    albums.forEach((card) => {
      const d = clamp((card.offsetLeft + card.offsetWidth / 2 - mid) / card.offsetWidth, -1.4, 1.4);
      card.style.transform = `perspective(1000px) rotateY(${(-d * 24).toFixed(2)}deg) scale(${(1 - Math.abs(d) * 0.1).toFixed(3)})`;
      card.style.opacity = (1 - Math.abs(d) * 0.3).toFixed(3);
    });
  };

  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      const p = clamp(window.scrollY / hero.offsetHeight, 0, 1);
      heroParts.forEach((el, i) => {
        el.style.translate = `0 ${(p * (i ? 90 : 150)).toFixed(1)}px`;
        el.style.opacity = (1 - p * 1.4).toFixed(3);
      });
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  if (rail) {
    let flowQueued = false;
    rail.addEventListener('scroll', () => {
      if (flowQueued) return;
      flowQueued = true;
      requestAnimationFrame(() => { flowQueued = false; flow(); });
    }, { passive: true });
    window.addEventListener('resize', flow);
    flow();
  }

  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.project-card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const box = card.getBoundingClientRect();
        const x = (e.clientX - box.left) / box.width - 0.5;
        const y = (e.clientY - box.top) / box.height - 0.5;
        card.classList.add('tilting');
        card.style.transform = `perspective(1100px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg) translateY(-3px)`;
        card.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`);
        card.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`);
      });
      card.addEventListener('pointerleave', () => {
        card.classList.remove('tilting');
        card.style.transform = '';
      });
    });
  }
})();
