const preloader = document.getElementById('preloader');
window.addEventListener('load', () => {
  setTimeout(() => {
    preloader.style.opacity = '0';
    setTimeout(() => preloader.style.display = 'none', 420);
  }, 320);
});

const imageModal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');

function openModal(imgSrc) {
  modalImage.src = imgSrc;
  imageModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  imageModal.classList.remove('active');
  document.body.style.overflow = '';
  modalImage.src = '';
}
document.querySelectorAll('[data-modal-img]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const imgSrc = btn.getAttribute('data-modal-img');
    openModal(imgSrc);
  });
});

if(modalClose) {
  modalClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeModal();
  });
}

if(modalOverlay) {
  modalOverlay.addEventListener('click', closeModal);
}

document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && imageModal.classList.contains('active')) {
    closeModal();
  }
});

const menuToggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('primary-menu');
if(menuToggle){
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('show');
  });
}

const themeToggle = document.getElementById('theme-toggle');
function applyTheme(theme){
  if(theme === 'light') document.body.classList.add('light');
  else document.body.classList.remove('light');
  localStorage.setItem('lk_theme', theme);
}
const savedTheme = localStorage.getItem('lk_theme');
if(savedTheme) applyTheme(savedTheme);
else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) applyTheme('light');
if(themeToggle){
  const initIsLight = document.body.classList.contains('light');
  themeToggle.setAttribute('aria-pressed', String(initIsLight));
  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light');
    applyTheme(isLight ? 'dark' : 'light');
    themeToggle.setAttribute('aria-pressed', String(!isLight));
  });
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(reduceMotion) document.documentElement.style.scrollBehavior = 'auto';

(function(){
  const canvas = document.getElementById('particles');
  if(!canvas || reduceMotion) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const particles = [];
  const count = Math.min(120, Math.floor((w*h)/60000));
  function rnd(a,b){ return Math.random()*(b-a)+a; }
  function P(){ this.x=rnd(0,w); this.y=rnd(0,h); this.vx=rnd(-0.35,0.35); this.vy=rnd(-0.15,0.15); this.r=rnd(0.6,2.4); this.a=rnd(0.06,0.35); this.h=rnd(190,260); }
  for(let i=0;i<count;i++) particles.push(new P());
  addEventListener('resize', () => { w = canvas.width = innerWidth; h = canvas.height = innerHeight; });
  function draw(){
    ctx.clearRect(0,0,w,h);
    for(const p of particles){
      p.x += p.vx; p.y += p.vy;
      if(p.x < -10) p.x = w + 10;
      if(p.x > w + 10) p.x = -10;
      if(p.y < -10) p.y = h + 10;
      if(p.y > h + 10) p.y = -10;
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.h},85%,60%,${p.a})`;
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(r => obs.observe(r));
const form = document.getElementById('contact-form');
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const messageError = document.getElementById('message-error');
const successMsg = document.getElementById('success-message');
const whatsappLink = document.getElementById('whatsapp-link');

const CONTACT_EMAIL = 'lionelkeffass7@gmail.com';
const WHATSAPP_PHONE = '6285782490490';

function validateEmail(email){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

function buildWhatsAppHref(name = '', email = '', message = ''){
  const baseUrl = `https://wa.me/${WHATSAPP_PHONE}`;
  const text = `Halo Lionel, saya ${name || '[nama]'}\nEmail: ${email || '[email]'}\nPesan: ${message || '[pesan]'}`;
  return `${baseUrl}?text=${encodeURIComponent(text)}`;
}

function buildMailtoHref(name = '', email = '', message = ''){
  const subject = encodeURIComponent('Pesan dari portfolio Lionel');
  const body = encodeURIComponent(`Nama: ${name || '[nama]'}\nEmail: ${email || '[email]'}\n\nPesan:\n${message || '[pesan]'}`);
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

function openContactChannel(name = '', email = '', message = ''){
  const whatsappHref = buildWhatsAppHref(name, email, message);
  const mailtoHref = buildMailtoHref(name, email, message);

  const popup = window.open(whatsappHref, '_blank', 'noopener,noreferrer');
  if(popup){
    return { type: 'whatsapp', href: whatsappHref };
  }

  window.location.href = mailtoHref;
  return { type: 'mailto', href: mailtoHref };
}

function updateWhatsAppLink(){
  if(!whatsappLink) return;
  const name = document.getElementById('name')?.value.trim() || '';
  const email = document.getElementById('email')?.value.trim() || '';
  const message = document.getElementById('message')?.value.trim() || '';
  whatsappLink.href = buildWhatsAppHref(name, email, message);
}

['name','email','message'].forEach(id => {
  const input = document.getElementById(id);
  if(input){
    input.addEventListener('input', updateWhatsAppLink);
  }
});

updateWhatsAppLink();

if(form){
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    nameError.textContent=''; emailError.textContent=''; messageError.textContent=''; successMsg.textContent='';

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    let ok = true;
    if(!name){ nameError.textContent='Nama wajib diisi'; ok=false; }
    if(!validateEmail(email)){ emailError.textContent='Email tidak valid'; ok=false; }
    if(!message){ messageError.textContent='Pesan tidak boleh kosong'; ok=false; }
    if(!ok) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    if(submitBtn) submitBtn.disabled = true;

    try{
      openContactChannel(name, email, message);
      successMsg.textContent = 'Mengalihkan ke WhatsApp untuk melanjutkan chat...';
      form.reset();
      updateWhatsAppLink();
    } catch (err) {
      console.error('Gagal membuka channel kontak', err);
      successMsg.textContent = 'Tidak bisa membuka chat otomatis. Silakan klik tombol WhatsApp.';
    } finally {
      if(submitBtn) submitBtn.disabled = false;
    }
  });
}

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if(href.length > 1){
      e.preventDefault();
      const el = document.querySelector(href);
      if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
      if(menu.classList.contains('show')) menu.classList.remove('show');
    }
  });
});

const skipLink = document.querySelector('.skip-link');
if(skipLink){
  skipLink.addEventListener('click', (e)=>{
  
    const main = document.querySelector('main');
    if(main){
      setTimeout(()=> main.setAttribute('tabindex','-1') && main.focus(), 10);
    }
  });
}

document.addEventListener('keyup', e => {
  if(e.key === 'Escape' && menu.classList.contains('show')) menu.classList.remove('show');
} );