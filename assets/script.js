(function () {
  // ── NAV TOGGLE ──
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    document.addEventListener('click', function (e) {
      if (!navToggle.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── ACTIVE NAV ──
  var fileName = window.location.pathname.split('/').pop() || 'index.html';
  var pageMap = {
    'index.html': 'home', '': 'home',
    'about.html': 'about',
    'skills.html': 'skills',
    'experience.html': 'experience',
    'projects.html': 'projects',
    'contact.html': 'contact'
  };
  document.querySelectorAll('.site-nav a[data-page]').forEach(function (link) {
    if (link.dataset.page === pageMap[fileName]) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // ── SCROLL REVEAL ──
  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      revealObs.observe(el);
    });
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ── ANIMATED COUNTERS ──
  function animateCounter(el) {
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || '';
    var prefix = el.dataset.prefix || '';
    var duration = 1600;
    var start = performance.now();
    function update(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = eased * target;
      el.textContent = prefix + (Number.isInteger(target) ? Math.round(current) : current.toFixed(0)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window) {
    var counterObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateCounter(e.target);
          counterObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(function (el) {
      counterObs.observe(el);
    });
  }

  // ── SKILL BARS ──
  if ('IntersectionObserver' in window) {
    var barObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var fill = e.target.querySelector('.skill-fill');
          if (fill) fill.style.width = fill.dataset.width;
          barObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.skill-bar-row').forEach(function (el) {
      barObs.observe(el);
    });
  } else {
    document.querySelectorAll('.skill-fill').forEach(function (fill) {
      fill.style.width = fill.dataset.width;
    });
  }

  // ── PROJECT FILTERS ──
  var filterBtns = document.querySelectorAll('.filter-btn');
  var projects = document.querySelectorAll('.project-detail');
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.dataset.filter;
        projects.forEach(function (proj) {
          if (filter === 'all' || proj.dataset.category === filter) {
            proj.style.display = '';
          } else {
            proj.style.display = 'none';
          }
        });
      });
    });
  }
  // ── CAROUSEL ──
  document.querySelectorAll('.carousel-outer').forEach(function (outer) {
    var track = outer.querySelector('.carousel-track');
    var items = outer.querySelectorAll('.carousel-item');
    var dots  = outer.querySelectorAll('.carousel-dot');
    var prev  = outer.querySelector('.carousel-prev');
    var next  = outer.querySelector('.carousel-next');
    if (!track || !items.length) return;
    var cur = 0, total = items.length, timer;

    function goTo(i) {
      cur = (i + total) % total;
      track.style.transform = 'translateX(-' + (cur * 100) + '%)';
      dots.forEach(function (d, idx) { d.classList.toggle('active', idx === cur); });
    }
    function startAuto() { timer = setInterval(function () { goTo(cur + 1); }, 4800); }
    function stopAuto()  { clearInterval(timer); }

    if (prev) prev.addEventListener('click', function () { stopAuto(); goTo(cur - 1); startAuto(); });
    if (next) next.addEventListener('click', function () { stopAuto(); goTo(cur + 1); startAuto(); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { stopAuto(); goTo(i); startAuto(); }); });

    // touch/swipe
    var touchX = 0;
    outer.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, {passive:true});
    outer.addEventListener('touchend', function (e) {
      var diff = touchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { stopAuto(); goTo(diff > 0 ? cur + 1 : cur - 1); startAuto(); }
    }, {passive:true});

    outer.addEventListener('mouseenter', stopAuto);
    outer.addEventListener('mouseleave', startAuto);
    goTo(0);
    startAuto();
  });
})();
