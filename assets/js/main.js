/* Welwart Pharmaceuticals - Main JavaScript */

/* === LOADING SCREEN === */
document.body.style.overflow = 'hidden';
window.addEventListener('load', function () {
  setTimeout(function () {
    var loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      initHeroAnimations();
    }
  }, 2200);
});

/* === CUSTOM CURSOR === */
const cursor = document.getElementById("cursor");

let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  currentX += (mouseX - currentX) * 0.18;
  currentY += (mouseY - currentY) * 0.18;

  cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

  requestAnimationFrame(animateCursor);
}

animateCursor();

// Hover Effect
document.querySelectorAll("a, button, .why-card, .product-card, .segment-card").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursor.classList.add("cursor-hover");
  });

  el.addEventListener("mouseleave", () => {
    cursor.classList.remove("cursor-hover");
  });
});
/* === NAVBAR === */
var navbar = document.getElementById('navbar');
var navToggle = document.getElementById('navToggle');
var mobileNav = document.getElementById('mobileNav');
var mobileOverlay = document.getElementById('mobileOverlay');

window.addEventListener('scroll', function () {
  if (window.scrollY > 60) {
    navbar.classList.remove('transparent');
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.add('transparent');
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

if (navToggle) {
  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('open');
    mobileNav.classList.toggle('open');
    mobileOverlay.classList.toggle('open');
  });
}
if (mobileOverlay) {
  mobileOverlay.addEventListener('click', function () {
    navToggle.classList.remove('open');
    mobileNav.classList.remove('open');
    mobileOverlay.classList.remove('open');
  });
}
document.querySelectorAll('.mobile-nav a').forEach(function (a) {
  a.addEventListener('click', function () {
    navToggle.classList.remove('open');
    mobileNav.classList.remove('open');
    mobileOverlay.classList.remove('open');
  });
});

function updateActiveNav() {
  var sections = ['home', 'about', 'products', 'segments', 'quality', 'gallery', 'achievements', 'contact'];
  var navLinks = document.querySelectorAll('.nav-links a');
  var current = '';
  sections.forEach(function (id) {
    var el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 100) current = id;
  });
  navLinks.forEach(function (a) {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
}

/* === HERO CANVAS === */
var canvas = document.getElementById('hero-canvas');
var ctx = canvas ? canvas.getContext('2d') : null;
var particles = [];
var mouse = { x: null, y: null };

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function Particle() {
  this.reset();
}
Particle.prototype.reset = function () {
  this.x = Math.random() * (canvas ? canvas.width : 800);
  this.y = Math.random() * (canvas ? canvas.height : 600);
  this.size = Math.random() * 3 + 1;
  this.speedX = (Math.random() - 0.5) * 0.8;
  this.speedY = (Math.random() - 0.5) * 0.8;
  this.opacity = Math.random() * 0.6 + 0.1;
  this.color = Math.random() > 0.5 ? '#2563EB' : '#ffffff';
};
Particle.prototype.update = function () {
  this.x += this.speedX;
  this.y += this.speedY;
  if (mouse.x) {
    var dx = mouse.x - this.x, dy = mouse.y - this.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) { this.x -= dx * 0.02; this.y -= dy * 0.02; }
  }
  if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
};
Particle.prototype.draw = function () {
  ctx.save();
  ctx.globalAlpha = this.opacity;
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

function initParticles() {
  if (!canvas || !ctx) return;
  resizeCanvas();
  particles = [];
  var count = Math.min(120, Math.floor(canvas.width * canvas.height / 8000));
  for (var i = 0; i < count; i++) particles.push(new Particle());
}

function drawConnections() {
  if (!ctx) return;
  for (var i = 0; i < particles.length; i++) {
    for (var j = i + 1; j < particles.length; j++) {
      var dx = particles[i].x - particles[j].x;
      var dy = particles[i].y - particles[j].y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 100) * 0.15;
        ctx.strokeStyle = '#2563EB';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateCanvas() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(function (p) { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateCanvas);
}

window.addEventListener('resize', function () { resizeCanvas(); initParticles(); });
var heroEl = document.getElementById('hero');
if (heroEl) {
  heroEl.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
  heroEl.addEventListener('mouseleave', function () { mouse.x = null; mouse.y = null; });
}
initParticles();
animateCanvas();

/* === GSAP HERO ANIMATIONS === */
function initHeroAnimations() {
  if (typeof gsap === 'undefined') return;
  gsap.fromTo('#hero-badge', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });
  gsap.fromTo('#hero-title', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: 'power3.out' });
  gsap.fromTo('#hero-sub', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.6, ease: 'power3.out' });
  gsap.fromTo('#hero-actions', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.8, ease: 'power3.out' });
  gsap.fromTo('#hero-stats', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 1.0, ease: 'power3.out' });
  gsap.fromTo('#hero-float-card', { opacity: 0, x: 60, scale: 0.9 }, { opacity: 1, x: 0, scale: 1, duration: 1.2, delay: 0.6, ease: 'power3.out' });
}

/* === SCROLL REVEAL === */
function initScrollReveal() {
  var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var delay = parseFloat(el.style.transitionDelay || 0) * 1000;
        setTimeout(function () { el.classList.add('visible'); }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(function (el) { observer.observe(el); });
}
initScrollReveal();

/* === GSAP SCROLL ANIMATIONS === */
window.addEventListener('load', function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('.section-label, .section-title, .section-sub').forEach(function (el) {
    gsap.fromTo(el, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    });
  });

  gsap.utils.toArray('.stat-item').forEach(function (el, i) {
    gsap.fromTo(el, { opacity: 0, scale: 0.8 }, {
      opacity: 1, scale: 1, duration: 0.6, delay: i * 0.1, ease: 'back.out(1.5)',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    });
  });

  gsap.utils.toArray('.why-card').forEach(function (el, i) {
    gsap.fromTo(el, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.7, delay: i * 0.1, ease: 'power2.out',
      scrollTrigger: { trigger: '#why', start: 'top 75%', once: true }
    });
  });

  gsap.utils.toArray('.achievement-card').forEach(function (el, i) {
    gsap.fromTo(el, { opacity: 0, scale: 0.85 }, {
      opacity: 1, scale: 1, duration: 0.7, delay: i * 0.12, ease: 'back.out(1.5)',
      scrollTrigger: { trigger: '#achievements', start: 'top 80%', once: true }
    });
  });

  gsap.utils.toArray('.timeline-item').forEach(function (el, i) {
    gsap.fromTo(el, { opacity: 0, x: 30 }, {
      opacity: 1, x: 0, duration: 0.7, delay: i * 0.15, ease: 'power2.out',
      scrollTrigger: { trigger: '#quality', start: 'top 75%', once: true }
    });
  });

  gsap.utils.toArray('.segment-card').forEach(function (el, i) {
    gsap.fromTo(el, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.6, delay: i * 0.1, ease: 'power2.out',
      scrollTrigger: { trigger: '#segments', start: 'top 75%', once: true }
    });
  });
});

/* === ANIMATED COUNTERS === */
function animateCounter(el, target, duration) {
  var numEl = el.querySelector('.count-num') || el;
  var startTime = performance.now();
  function update(currentTime) {
    var elapsed = currentTime - startTime;
    var progress = Math.min(elapsed / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    numEl.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else numEl.textContent = target;
  }
  requestAnimationFrame(update);
}

function initCounters() {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-target'), 10);
        if (!isNaN(target)) { animateCounter(el, target, 2000); observer.unobserve(el); }
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(function (el) { observer.observe(el); });
}
initCounters();

/* === PRODUCT TABS === */
document.querySelectorAll('.tab-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    document.querySelectorAll('.product-panel').forEach(function (p) { p.classList.remove('active'); });
    var panel = document.getElementById('tab-' + btn.getAttribute('data-tab'));
    if (panel) panel.classList.add('active');
  });
});

/* === TESTIMONIALS SLIDER === */
(function () {
  var slider = document.getElementById('testimonialsSlider');
  var dotsContainer = document.getElementById('testimonialDots');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  if (!slider) return;

  var cards = slider.querySelectorAll('.testimonial-card');
  var current = 0;
  var auto;

  cards.forEach(function (_, i) {
    var dot = document.createElement('div');
    dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', function () { goTo(i); });
    dotsContainer.appendChild(dot);
  });

  function getVisible() {
    return window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  }

  function goTo(index) {
    var vis = getVisible();
    var max = Math.max(0, cards.length - vis);
    current = Math.max(0, Math.min(index, max));
    if (cards[0]) {
      var cardW = cards[0].offsetWidth + 24;
      slider.style.transform = 'translateX(-' + (current * cardW) + 'px)';
    }
    document.querySelectorAll('.testimonial-dot').forEach(function (d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', function () {
    goTo(current + 1 > cards.length - getVisible() ? 0 : current + 1);
    resetAuto();
  });

  function startAuto() {
    auto = setInterval(function () {
      goTo(current + 1 > cards.length - getVisible() ? 0 : current + 1);
    }, 4000);
  }
  function resetAuto() { clearInterval(auto); startAuto(); }
  startAuto();
  window.addEventListener('resize', function () { goTo(0); });
})();

/* === GALLERY LIGHTBOX === */
function openLightbox(el) {
  var img = el.querySelector('img');
  if (!img) return;
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightbox-img');
  if (!lb || !lbImg) return;
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  var lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
}

var lb = document.getElementById('lightbox');
if (lb) {
  lb.addEventListener('click', function (e) {
    if (e.target === lb) closeLightbox();
  });
}
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeLightbox();
});

/* === CONTACT FORM === */
function handleFormSubmit(e) {
  e.preventDefault();
  var btn = e.target.querySelector('[type=submit]');
  var success = document.getElementById('formSuccess');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(function () {
    if (success) success.style.display = 'block';
    e.target.reset();
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg,#10B981,#059669)';
    setTimeout(function () {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.style.background = '';
      btn.disabled = false;
      if (success) success.style.display = 'none';
    }, 5000);
  }, 1200);
}

/* === SMOOTH SCROLL === */
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      var offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

/* === 3D CARD TILT === */
document.querySelectorAll('.why-card').forEach(function (card) {
  card.addEventListener('mousemove', function (e) {
    var rect = card.getBoundingClientRect();
    var x = (e.clientX - rect.left) / rect.width - 0.5;
    var y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = 'translateY(-8px) scale(1.02) rotateX(' + (-y * 8) + 'deg) rotateY(' + (x * 8) + 'deg)';
  });
  card.addEventListener('mouseleave', function () {
    card.style.transform = '';
  });
});
