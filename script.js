/* ===== LOADING SCREEN ===== */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelector('.loader').classList.add('hidden');
  }, 1200);
});

/* ===== CUSTOM CURSOR ===== */
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = mouseX - 4 + 'px';
  cursorDot.style.top = mouseY - 4 + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  cursorRing.style.left = ringX - 18 + 'px';
  cursorRing.style.top = ringY - 18 + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .filter-btn, .skill-card, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

/* ===== PARTICLE BACKGROUND ===== */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(91, 141, 238, ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(91, 141, 238, ${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ===== TYPING EFFECT ===== */
const typingEl = document.getElementById('typing-text');
const phrases = ['Full Stack Developer', 'UI/UX Enthusiast', 'React Specialist', 'Problem Solver', 'Open Source Contributor'];
let phraseIdx = 0, charIdx = 0, deleting = false;

function typeEffect() {
  const current = phrases[phraseIdx];
  if (deleting) {
    typingEl.textContent = current.substring(0, charIdx--);
    if (charIdx < 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(typeEffect, 400); return; }
  } else {
    typingEl.textContent = current.substring(0, charIdx++);
    if (charIdx > current.length) { deleting = true; setTimeout(typeEffect, 1800); return; }
  }
  setTimeout(typeEffect, deleting ? 40 : 80);
}
setTimeout(typeEffect, 1500);

/* ===== STICKY NAVBAR & ACTIVE SECTION ===== */
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

/* ===== MOBILE MENU ===== */
const hamburger = document.querySelector('.hamburger');
const navLinksContainer = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinksContainer.classList.toggle('open');
});

navLinksContainer.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinksContainer.classList.remove('open');
  });
});

/* ===== THEME TOGGLE ===== */
const themeBtn = document.getElementById('themeToggle');
const themeIcon = themeBtn.querySelector('span');

function setTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  themeIcon.textContent = dark ? '🌙' : '☀️';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

themeBtn.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  setTheme(!isDark);
});

// Load saved theme
const saved = localStorage.getItem('theme');
if (saved) setTheme(saved === 'dark');

/* ===== SCROLL REVEAL ===== */
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

reveals.forEach(el => revealObserver.observe(el));

/* ===== SKILL RING ANIMATION ===== */
const skillCards = document.querySelectorAll('.skill-card');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const ring = entry.target.querySelector('.ring-fill');
      const pct = entry.target.dataset.percent;
      if (ring) {
        const offset = 188.5 - (188.5 * pct / 100);
        ring.style.strokeDashoffset = offset;
      }
    }
  });
}, { threshold: 0.3 });

skillCards.forEach(el => skillObserver.observe(el));

/* ===== PROJECT FILTERING ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.tags.includes(filter)) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeUp .5s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ===== CONTRIBUTION GRAPH ===== */
const contribGrid = document.querySelector('.contrib-grid');
if (contribGrid) {
  for (let i = 0; i < 364; i++) {
    const cell = document.createElement('div');
    cell.className = 'contrib-cell';
    const r = Math.random();
    if (r > 0.7) cell.classList.add('l1');
    if (r > 0.82) cell.classList.add('l2');
    if (r > 0.9) cell.classList.add('l3');
    if (r > 0.96) cell.classList.add('l4');
    contribGrid.appendChild(cell);
  }
}

/* ===== JOURNEY BARS ===== */
const journeyCards = document.querySelectorAll('.journey-card');
const journeyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.journey-fill');
      if (fill) fill.style.width = fill.dataset.width;
    }
  });
}, { threshold: 0.3 });
journeyCards.forEach(el => journeyObserver.observe(el));

/* ===== CONTACT FORM VALIDATION ===== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('formName');
    const email = document.getElementById('formEmail');
    const msg = document.getElementById('formMessage');

    // Reset
    document.querySelectorAll('.form-group').forEach(g => g.classList.remove('invalid'));

    if (name.value.trim().length < 2) {
      name.closest('.form-group').classList.add('invalid');
      valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.closest('.form-group').classList.add('invalid');
      valid = false;
    }
    if (msg.value.trim().length < 10) {
      msg.closest('.form-group').classList.add('invalid');
      valid = false;
    }

    if (valid) {
      const status = document.querySelector('.form-status');
      status.classList.add('success');
      status.textContent = '✨ Message sent successfully! I\'ll get back to you soon.';
      contactForm.reset();
      setTimeout(() => status.classList.remove('success'), 5000);
    }
  });
}

/* ===== LAZY LOADING IMAGES ===== */
const lazyImages = document.querySelectorAll('img[data-src]');
const imgObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      imgObserver.unobserve(img);
    }
  });
});
lazyImages.forEach(img => imgObserver.observe(img));

/* ===== FADE UP ANIMATION KEYFRAME ===== */
const style = document.createElement('style');
style.textContent = `@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`;
document.head.appendChild(style);
