// ===================
// main.js
// ===================

// ======= Design tokens for JS (for particles, etc) =======
const tokens = {
  colors: {
    bg: "#0B0B13",
    surface: "#121226",
    primary: "#7C3AED",
    primaryAlt: "#9B5CFA",
    neon: "#22D3EE",
    accent: "#A78BFA",
    text: "#EAEAFB",
    muted: "#9AA0B3",
    glow: "rgba(124,58,237,0.45)"
  }
};

// ======= Loader (Lottie + fallback) =======
const loader = document.getElementById('loader');
const lottieBot = document.getElementById('lottie-bot');
const loaderBar = document.getElementById('loader-bar');
let prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Loader: animação Lottie (ou fallback) + barra fake
function showLoader() {
  loader.removeAttribute('aria-hidden');
  if (window.lottie && lottieBot) {
    lottie.loadAnimation({
      container: lottieBot,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      // Use um Lottie de robô leve (ou substitua por um SVG animado)
      path: 'assets/bot-lottie.json', // Coloque um Lottie de robô aqui
      rendererSettings: { progressiveLoad: true }
    });
  } else {
    lottieBot.innerHTML = '<i class="fa-solid fa-robot fa-3x text-primary animate-bounce"></i>';
  }
  // Barra de progresso fake
  let progress = 0;
  const interval = setInterval(() => {
    progress += 2 + Math.random() * 6;
    loaderBar.style.width = Math.min(progress, 100) + '%';
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(hideLoader, 400);
    }
  }, 60);
}
function hideLoader() {
  loader.setAttribute('aria-hidden', 'true');
  setTimeout(() => loader.style.display = 'none', 600);
}

// Se reduce motion, pula loader
if (prefersReducedMotion) {
  loader.style.display = 'none';
} else {
  showLoader();
}

// ======= Smooth Scroll (Lenis) =======
let lenis;
function initLenis() {
  if (prefersReducedMotion) return;
  lenis = new Lenis({
    duration: 1.2,
    smooth: true,
    direction: 'vertical',
    gestureOrientation: 'vertical',
    smoothTouch: false
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}
window.addEventListener('DOMContentLoaded', initLenis);

// ======= Header: sticky, blur, scroll spy =======
const header = document.getElementById('header');
const navLinks = document.querySelectorAll('.nav-link');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const sc = window.scrollY;
  header.classList.toggle('shadow-soft', sc > 8);
  // Scroll spy
  let sections = ['hero','about','projects','skills','testimonials','contact'];
  let active = 'hero';
  for (let id of sections) {
    let el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top - 80 < 0) active = id;
  }
  navLinks.forEach(link => {
    link.classList.toggle('text-neon', link.getAttribute('href') === '#' + active);
    link.setAttribute('aria-current', link.getAttribute('href') === '#' + active ? 'page' : 'false');
  });
});

// ======= Mascote: Easter egg (B para piscar) =======
const botMascot = document.getElementById('bot-mascot');
if (botMascot) {
  botMascot.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'b') {
      botMascot.classList.add('animate-blink');
      setTimeout(() => botMascot.classList.remove('animate-blink'), 700);
    }
  });
}
// CSS para blink (adicione no styles.css):
// .animate-blink { animation: blink 0.7s; }
// @keyframes blink { 0%,100%{opacity:1} 40%,60%{opacity:0.2} }

// ======= Hero: animação de entrada + partículas =======
function heroEntryAnim() {
  if (prefersReducedMotion) return;
  gsap.fromTo('#hero h1', {opacity:0, y:24}, {opacity:1, y:0, duration:1, delay:0.1, ease:'power2.out'});
  gsap.fromTo('#hero .bg-surface', {opacity:0, y:16}, {opacity:1, y:0, duration:0.8, delay:0.5});
  gsap.fromTo('#hero p', {opacity:0, y:12}, {opacity:1, y:0, duration:0.7, delay:0.7});
  gsap.fromTo('#hero .btn-primary', {opacity:0, y:12}, {opacity:1, y:0, duration:0.7, delay:0.9});
  gsap.fromTo('#hero .btn-secondary', {opacity:0, y:12}, {opacity:1, y:0, duration:0.7, delay:1.1});
}
window.addEventListener('load', () => setTimeout(heroEntryAnim, 1200));

// tsParticles: fundo animado (hero, depoimentos, footer)
function loadParticles(id, color) {
  if (!window.tsParticles) return;
  tsParticles.load(id, {
    fullScreen: { enable: false },
    background: { color: { value: "transparent" } },
    particles: {
      number: { value: 32, density: { enable: true, area: 800 } },
      color: { value: color },
      shape: { type: "circle" },
      opacity: { value: 0.18 },
      size: { value: 2.5, random: { enable: true, minimumValue: 1 } },
      move: { enable: true, speed: 0.6, direction: "none", outModes: "out" }
    },
    interactivity: { events: { onHover: { enable: false } } }
  });
}
window.addEventListener('DOMContentLoaded', () => {
  loadParticles('particles-hero', tokens.colors.primary);
  loadParticles('particles-testimonials', tokens.colors.neon);
  loadParticles('particles-footer', tokens.colors.accent);
});

// ======= Project Cards: flip 3D, modal =======
const projectData = {
  uwcloud: {
    title: "UW Cloud Apps",
    desc: "Plataforma de hospedagem Node.js com painéis de gestão e deploy simples.",
    problem: "Hospedar apps Node.js de forma fácil, com painéis e deploy rápido.",
    solution: "Painel intuitivo, deploy 1-click, monitoramento e integrações.",
    stack: "Node.js, MongoDB, Docker, Tailwind, APIs REST",
    github: "https://github.com/SzDevBR/incloud-inderux",
    demo: "#",
    screenshots: [
      "assets/uwcloud-1.png",
      "assets/uwcloud-2.png",
      "assets/uwcloud-3.png"
    ]
  },
  pdv: {
    title: "Sistema de Caixa & Pedidos",
    desc: "PDV leve com controle de estoque e relatórios.",
    problem: "Gerenciar vendas, estoque e pedidos de forma simples.",
    solution: "Interface rápida, relatórios, integração WhatsApp.",
    stack: "Node.js, Tailwind",
    github: "https://github.com/SzDevBR/crm-dandanburguer",
    demo: "#",
    screenshots: []
  },
  restaurantes: {
    title: "Ferramentas para Restaurantes",
    desc: "Integração de pedidos com WhatsApp e campanhas.",
    problem: "Automatizar pedidos e campanhas para restaurantes.",
    solution: "Pedidos via WhatsApp, campanhas automáticas.",
    stack: "Node.js, APIs, WhatsApp, Tailwind",
    github: "https://github.com/SzDevBR/crm-dandanburguer",
    demo: "#",
    screenshots: []
  }
};
// Flip 3D
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', () => card.classList.add('flipped'));
  card.addEventListener('mouseleave', () => card.classList.remove('flipped'));
  card.addEventListener('focus', () => card.classList.add('flipped'));
  card.addEventListener('blur', () => card.classList.remove('flipped'));
  card.addEventListener('click', openProjectModal);
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') openProjectModal.call(card, e);
  });
});
function openProjectModal(e) {
  const key = this.dataset.project;
  const data = projectData[key];
  if (!data) return;
  const modal = document.getElementById('project-modal');
  const body = document.getElementById('modal-body');
  // Modal content
  body.innerHTML = `
    <h3 id="modal-title" class="font-display text-2xl font-bold mb-2 text-primary">${data.title}</h3>
    <p class="mb-2 text-muted">${data.desc}</p>
    <ul class="mb-3 text-sm">
      <li><strong>Problema:</strong> ${data.problem}</li>
      <li><strong>Solução:</strong> ${data.solution}</li>
      <li><strong>Stack:</strong> ${data.stack}</li>
    </ul>
    <div class="flex gap-3 mb-4">
      <a href="${data.github}" target="_blank" rel="noopener" class="btn-secondary ripple" aria-label="Ver no GitHub">GitHub</a>
      <a href="${data.demo}" target="_blank" rel="noopener" class="btn-primary ripple" aria-label="Ver demonstração">Demonstração</a>
    </div>
    <div class="flex gap-2">
      ${data.screenshots.map(src => `<img src="${src}" alt="Screenshot de ${data.title}" class="rounded-lg shadow-soft w-20 h-14 object-cover" loading="lazy">`).join('')}
    </div>
  `;
  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.add('show');
    modal.querySelector('.modal-content').focus();
  }, 10);
  // Acessibilidade: foco, esc
  document.body.style.overflow = 'hidden';
  modal.setAttribute('tabindex', '-1');
  modal.focus();
}
document.getElementById('modal-close').addEventListener('click', closeProjectModal);
document.getElementById('project-modal').addEventListener('click', e => {
  if (e.target.id === 'project-modal') closeProjectModal();
});
document.addEventListener('keydown', e => {
  const modal = document.getElementById('project-modal');
  if (!modal.classList.contains('hidden') && e.key === 'Escape') closeProjectModal();
});
function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  modal.classList.remove('show');
  setTimeout(() => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }, 300);
}

// ======= Skills: tooltips, progress, expand on Enter =======
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      card.querySelector('.tooltip').style.opacity = 1;
      setTimeout(() => card.querySelector('.tooltip').style.opacity = 0, 2000);
    }
  });
});

// ======= Depoimentos: slider acessível =======
const testimonials = [
  {
    name: "Carlos S.",
    text: "O Octávio entregou o sistema de caixa em tempo recorde. Suporte excelente e performance top!",
    avatar: "assets/avatar1.svg"
  },
  {
    name: "Ana R.",
    text: "A automação de pedidos via WhatsApp aumentou minhas vendas. Recomendo de olhos fechados.",
    avatar: "assets/avatar2.svg"
  },
  {
    name: "Lucas M.",
    text: "A UW Cloud Apps facilitou o deploy do meu app Node. Simples, rápido e seguro.",
    avatar: "assets/avatar3.svg"
  }
];
const slider = document.getElementById('testimonial-slider');
let currentSlide = 0, sliderInterval, isPaused = false;
function renderTestimonialSlides() {
  slider.innerHTML = testimonials.map((t, i) => `
    <div class="testimonial-slide${i===0?' active':''}" role="group" aria-roledescription="slide" aria-label="Depoimento de ${t.name}">
      <div class="flex items-center gap-4 mb-2">
        <img src="${t.avatar}" alt="Avatar de ${t.name}" class="w-12 h-12 rounded-full bg-surface" loading="lazy">
        <span class="font-semibold text-primary">${t.name}</span>
      </div>
      <blockquote class="text-lg text-accent">"${t.text}"</blockquote>
    </div>
  `).join('');
}
function showSlide(idx) {
  const slides = slider.querySelectorAll('.testimonial-slide');
  slides.forEach((s,i) => s.classList.toggle('active', i===idx));
  currentSlide = idx;
}
function nextSlide() { showSlide((currentSlide+1)%testimonials.length); }
function prevSlide() { showSlide((currentSlide-1+testimonials.length)%testimonials.length); }
document.getElementById('testimonial-next').onclick = () => { nextSlide(); resetSliderInterval(); };
document.getElementById('testimonial-prev').onclick = () => { prevSlide(); resetSliderInterval(); };
slider.addEventListener('mouseenter', () => { isPaused = true; });
slider.addEventListener('mouseleave', () => { isPaused = false; });
function startSliderInterval() {
  sliderInterval = setInterval(() => { if (!isPaused) nextSlide(); }, 6000);
}
function resetSliderInterval() {
  clearInterval(sliderInterval); startSliderInterval();
}
window.addEventListener('DOMContentLoaded', () => {
  renderTestimonialSlides();
  startSliderInterval();
});

// ======= Contato: validação, submit, confete =======
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  // Validação básica
  const name = this.name.value.trim();
  const email = this.email.value.trim();
  const message = this.message.value.trim();
  if (name.length < 2 || !/^[\w\s]+$/.test(name)) return showFormError("Nome inválido.");
  if (!/^[\w\.-]+@[\w\.-]+\.\w+$/.test(email)) return showFormError("Email inválido.");
  if (message.length < 5) return showFormError("Mensagem muito curta.");
  // Envia via AJAX para FormSubmit
  fetch(this.action, {
    method: "POST",
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ name, email, message, _captcha: "false", _next: window.location.href })
  }).then(() => {
    showFormSuccess("Mensagem enviada! Obrigado.");
    this.reset();
    confettiAnim();
  }).catch(() => showFormError("Erro ao enviar. Tente novamente."));
});
function showFormSuccess(msg) {
  formSuccess.textContent = msg;
  formSuccess.classList.remove('hidden');
  setTimeout(() => formSuccess.classList.add('hidden'), 4000);
}
function showFormError(msg) {
  formSuccess.textContent = msg;
  formSuccess.classList.remove('hidden');
  formSuccess.style.color = tokens.colors.primary;
  setTimeout(() => { formSuccess.classList.add('hidden'); formSuccess.style.color = ''; }, 3000);
}
// Confete animado (leve)
function confettiAnim() {
  if (prefersReducedMotion) return;
  for (let i=0; i<24; i++) {
    let c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = (Math.random()*100)+'%';
    c.style.background = [tokens.colors.primary, tokens.colors.neon, tokens.colors.accent][i%3];
    c.style.animationDelay = (Math.random()*0.5)+'s';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 1200);
  }
}
// CSS (adicione em styles.css):
// .confetti { position:fixed;top:60%;width:8px;height:16px;z-index:9999;opacity:0.8;border-radius:2px;pointer-events:none;animation:confetti-fall 1.2s cubic-bezier(.4,2,.3,1); }
// @keyframes confetti-fall { 0%{transform:translateY(0) rotate(0);} 100%{transform:translateY(120px) rotate(360deg);} }

// ======= Dark/Light Toggle =======
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    themeToggle.innerHTML = isDark
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  });
  // Persistência
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    themeToggle.innerHTML = saved === 'dark'
      ? '<i class="fa-solid fa-moon"></i>'
      : '<i class="fa-solid fa-sun"></i>';
  }
}

// ======= A11y: Tab para pular conteúdo =======
document.querySelector('a[href="#main-content"]').addEventListener('click', e => {
  document.getElementById('main-content').focus();
});

// ======= Reduce motion: desativa GSAP, animações =======
if (prefersReducedMotion) {
  document.body.classList.add('reduce-motion');
  if (window.gsap) window.gsap.globalTimeline.clear();
}