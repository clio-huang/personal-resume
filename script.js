// 页面交互和内容渲染。内容本身维护在 content.js 中。
document.addEventListener('DOMContentLoaded', () => {
  const data = window.portfolioData;
  if (!data) return;
  const createElement = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  document.querySelectorAll('[data-site-name]').forEach(el => el.textContent = data.site.name);
  document.querySelector('[data-site-title]').textContent = data.site.title;
  document.querySelector('[data-site-tagline]').textContent = data.site.tagline;
  document.title = `${data.site.name} - 个人作品集`;

  const contactItems = [
    ['地点', data.site.location],
    ['邮箱', `${data.site.email} / ${data.site.alternateEmail}`],
    ['电话', `${data.site.phone} / ${data.site.alternatePhone}`],
    ['地址', data.site.address]
  ];
  const renderContactItems = (target, items) => {
    target.replaceChildren(...items.map(([label, value], index) => {
      const item = createElement('li');
      item.append(createElement('strong', '', `${label}：`));
      if (label === '地点') item.append(document.createTextNode(value));
      else {
        const button = createElement('button', 'link-like', value);
        button.dataset.copy = value;
        item.append(button);
      }
      return item;
    }));
  };
  renderContactItems(document.querySelector('[data-contact-list]'), contactItems);
  renderContactItems(document.querySelector('[data-direct-contact]'), [contactItems[1], contactItems[2], contactItems[3]]);
  document.querySelectorAll('[data-social]').forEach(link => link.href = data.site[link.dataset.social]);

  const stats = [
    ['项目经验', data.projects.length],
    ['平台运营', 4],
    ['现场活动', 4]
  ];
  const statsTarget = document.querySelector('[data-hero-stats]');
  stats.forEach(([label, value]) => {
    const stat = createElement('div', 'hero-stat');
    stat.append(createElement('strong', '', value), createElement('span', '', label));
    statsTarget.append(stat);
  });

  const about = document.querySelector('[data-about]');
  const aboutCard = createElement('div', 'about-card reveal-up');
  aboutCard.append(createElement('h3', '', '简介'), createElement('p', '', data.about.intro));
  const facts = createElement('div', 'about-list reveal-up delay-1');
  facts.append(createElement('h3', '', '更多信息'));
  const factList = createElement('ul');
  data.about.facts.forEach(([label, value]) => {
    const item = createElement('li');
    item.append(createElement('strong', '', `${label}：`), document.createTextNode(value));
    factList.append(item);
  });
  facts.append(factList);
  about.append(aboutCard, facts);

  const skills = document.querySelector('[data-skills]');
  data.skills.forEach((group, index) => {
    const element = createElement('div', `skill-group reveal-up${index ? ` delay-${index}` : ''}`);
    element.append(createElement('h4', '', group.title));
    if (group.items) group.items.forEach(([name, value]) => {
      const skill = createElement('div', 'skill');
      const info = createElement('div', 'skill-info');
      info.append(createElement('span', '', name), createElement('span', 'muted', `${value}%`));
      const bar = createElement('div', 'skill-bar');
      const fill = createElement('div', 'skill-fill');
      fill.dataset.fill = value;
      bar.append(fill);
      skill.append(info, bar);
      element.append(skill);
    });
    else {
      const chips = createElement('ul', 'skill-chips');
      group.chips.forEach(chip => chips.append(createElement('li', '', chip)));
      element.append(chips);
    }
    skills.append(element);
  });

  const experience = document.querySelector('[data-experience]');
  data.experience.forEach(item => {
    const entry = createElement('article', 'timeline-item');
    const content = createElement('div', 'content');
    content.append(createElement('h4', '', item.role), createElement('p', 'muted', item.summary));
    const achievements = createElement('ul');
    item.achievements.forEach(achievement => achievements.append(createElement('li', '', achievement)));
    content.append(achievements);
    entry.append(createElement('div', 'time', item.period), content);
    experience.append(entry);
  });

  const education = document.querySelector('[data-education]');
  data.education.forEach(item => {
    const card = createElement('article', 'education-card reveal-up');
    card.append(createElement('span', 'education-period', item.period), createElement('h3', '', item.school), createElement('p', 'education-degree', item.degree), createElement('p', 'muted', item.major));
    if (item.detail) card.append(createElement('p', 'education-detail', item.detail));
    education.append(card);
  });

  const activities = document.querySelector('[data-activities]');
  data.activities.forEach(item => {
    const activity = createElement('article', 'activity-item reveal-up');
    activity.append(createElement('h3', '', item.title), createElement('p', 'muted', item.detail));
    activities.append(activity);
  });

  const awards = document.querySelector('[data-awards]');
  data.awards.forEach(item => awards.append(createElement('li', '', item)));

  const projects = document.querySelector('[data-projects]');
  data.projects.forEach((project, index) => {
    const card = createElement('article', `project-card reveal-up${index ? ` delay-${index}` : ''}`);
    const link = createElement('a', 'project-thumb');
    link.href = project.link;
    link.dataset.project = JSON.stringify(project);
    const overlay = createElement('div', 'project-overlay');
    overlay.append(createElement('h3', '', project.title), createElement('p', 'muted', project.category));
    link.append(overlay);
    card.append(link);
    projects.append(card);
  });

  const filters = document.querySelector('[data-project-filters]');
  const projectTags = [...new Set(data.projects.flatMap(project => project.tags))];
  ['全部', ...projectTags].forEach((tag, index) => {
    const filter = createElement('button', `filter-button${index === 0 ? ' active' : ''}`, tag);
    filter.type = 'button';
    filter.dataset.filter = tag;
    filter.setAttribute('aria-pressed', String(index === 0));
    filters.append(filter);
  });
  filters.addEventListener('click', event => {
    const button = event.target.closest('.filter-button');
    if (!button) return;
    const selected = button.dataset.filter;
    filters.querySelectorAll('.filter-button').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    projects.querySelectorAll('.project-card').forEach((card, index) => {
      const visible = selected === '全部' || data.projects[index].tags.includes(selected);
      card.classList.toggle('is-hidden', !visible);
    });
  });

  const showPage = () => document.body.classList.remove('preload');
  requestAnimationFrame(showPage);
  setTimeout(showPage, 250);
  document.getElementById('year').textContent = new Date().getFullYear();
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-nav');
  const themeToggle = document.querySelector('.theme-toggle');
  const storedTheme = localStorage.getItem('portfolio-theme');
  if (storedTheme === 'light') document.body.classList.add('light-theme');
  const updateThemeButton = () => {
    const light = document.body.classList.contains('light-theme');
    themeToggle.setAttribute('aria-pressed', String(light));
    themeToggle.querySelector('span').textContent = light ? '☾' : '☼';
  };
  updateThemeButton();
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    localStorage.setItem('portfolio-theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
    updateThemeButton();
  });
  navToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  const reveals = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-section');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
    entry.target.querySelectorAll('.skill-fill').forEach(fill => {
      setTimeout(() => fill.style.width = `${fill.dataset.fill || 0}%`, 120);
    });
  }), { threshold: 0.12 });
  reveals.forEach(element => observer.observe(element));

  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.hash === `#${entry.target.id}`);
    });
  }), { rootMargin: '-35% 0px -55% 0px' });
  document.querySelectorAll('main > section[id]').forEach(section => sectionObserver.observe(section));

  const modal = document.getElementById('project-modal');
  document.querySelectorAll('.project-thumb').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const project = JSON.parse(link.dataset.project || '{}');
    document.getElementById('modal-title').textContent = project.title || '项目';
    document.getElementById('modal-desc').textContent = project.desc || '';
    document.getElementById('modal-tags').replaceChildren(...(project.tags || []).map(tag => createElement('span', 'tag', tag)));
    document.getElementById('modal-link').href = project.link || '#';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }));
  const closeModal = () => {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  document.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });

  document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      const original = button.textContent;
      button.textContent = '已复制';
      setTimeout(() => button.textContent = original, 1500);
    } catch { alert(`请手动复制：${button.dataset.copy}`); }
  }));
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', event => {
    event.preventDefault();
    const button = contactForm.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = '发送中...';
    setTimeout(() => {
      button.disabled = false;
      button.textContent = '发送';
      alert('已模拟发送（请接入实际后端或第三方表单服务以实现真正提交）');
      contactForm.reset();
    }, 900);
  });
  document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
});
