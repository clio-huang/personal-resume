// 小交互脚本：滚动 reveal、技能条动画、模态窗、复制功能、移动导航
document.addEventListener('DOMContentLoaded', () => {
  // Remove preload class after paint
  requestAnimationFrame(()=> document.body.classList.remove('preload'));

  // Update year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Simple mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-nav');
  navToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  // Smooth reveal on scroll using IntersectionObserver
  const reveals = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-section');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // trigger once
        obs.unobserve(entry.target);
        // If skill fills inside, animate
        entry.target.querySelectorAll?.('.skill-fill')?.forEach(el => {
          const val = el.dataset.fill || 0;
          setTimeout(()=> el.style.width = val + '%', 120);
        });
      }
    });
  }, {threshold: 0.12});
  reveals.forEach(r => obs.observe(r));

  // Project modal
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalTags = document.getElementById('modal-tags');
  const modalLink = document.getElementById('modal-link');

  document.querySelectorAll('.project-thumb').forEach(a => {
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const data = JSON.parse(a.getAttribute('data-project') || '{}');
      modalTitle.textContent = data.title || '项目';
      modalDesc.textContent = data.desc || '';
      modalTags.innerHTML = '';
      (data.tags || []).forEach(t=>{
        const span = document.createElement('span');
        span.textContent = t;
        span.className = 'tag';
        modalTags.appendChild(span);
      });
      modalLink.href = data.link || '#';
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal by close button or clicking backdrop
  document.querySelectorAll('.modal-close, #project-modal').forEach(el=>{
    el.addEventListener('click', (e)=>{
      // close when clicking the modal backdrop or the close button
      if (e.target.classList.contains('modal-close') || e.target.id === 'project-modal') {
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  });

  // Prevent clicks inside modal-card from closing
  document.querySelector('.modal-card')?.addEventListener('click', (e)=> e.stopPropagation());

  // Copy to clipboard for contact details
  document.querySelectorAll('[data-copy]').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const text = btn.getAttribute('data-copy');
      try {
        await navigator.clipboard.writeText(text);
        const old = btn.textContent;
        btn.textContent = '已复制';
        setTimeout(()=> btn.textContent = old, 1500);
      } catch (err) {
        // fallback: select and prompt
        alert('请手动复制：' + text);
      }
    });
  });

  // Contact form basic front-end feedback
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', (e)=>{
    e.preventDefault();
    // Basic demo: show a toast-like action
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = '发送中...';
    setTimeout(()=>{
      btn.disabled = false;
      btn.textContent = '发送';
      alert('已模拟发送（请接入实际后端或第三方表单服务以实现真正提交）');
      contactForm.reset();
    }, 900);
  });

  // Close mobile nav when a nav link is clicked (for single-page)
  document.querySelectorAll('.nav-link').forEach(link=>{
    link.addEventListener('click', ()=> {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Button hover micro-interaction: ripple (delegated)
  document.body.addEventListener('pointerdown', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.2;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255,255,255,0.08)';
    ripple.style.transform = 'scale(0)';
    ripple.style.transition = 'transform .6s var(--ease), opacity .6s var(--ease)';
    ripple.style.pointerEvents = 'none';
    btn.style.position = 'relative';
    btn.appendChild(ripple);
    requestAnimationFrame(()=> ripple.style.transform = 'scale(1)');
    setTimeout(()=> { ripple.style.opacity = '0'; setTimeout(()=> ripple.remove(), 600); }, 500);
  });
});
