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

  try {
    document.querySelectorAll('[data-site-name]').forEach(el => {
      el.textContent = data.site.name;
    });

    const siteTitle = document.querySelector('[data-site-title]');
    const siteTagline = document.querySelector('[data-site-tagline]');
    if (siteTitle) siteTitle.textContent = data.site.title;
    if (siteTagline) siteTagline.textContent = data.site.tagline;
    document.title = `${data.site.name} - 个人作品集`;

    const contactItems = [
      ['地点', data.site.location],
      ['邮箱', `${data.site.email} / ${data.site.alternateEmail}`],
      ['电话', `${data.site.phone} / ${data.site.alternatePhone}`],
      ['地址', data.site.address]
    ];

    const renderContactItems = (target, items) => {
      target.replaceChildren(...items.map(([label, value]) => {
        const item = createElement('li');
        item.append(createElement('strong', '', `${label}：`));

        if (label === '地点') {
          item.append(document.createTextNode(value));
        } else {
          const button = createElement('button', 'link-like', value);
          button.type = 'button';
          button.dataset.copy = value;
          button.setAttribute('aria-label', `复制${label}信息`);
          item.append(button);
        }

        return item;
      }));
    };

    const contactList = document.querySelector('[data-contact-list]');
    const directContact = document.querySelector('[data-direct-contact]');
    if (contactList) renderContactItems(contactList, contactItems);
    if (directContact) renderContactItems(directContact, [contactItems[1], contactItems[2], contactItems[3]]);

    document.querySelectorAll('[data-social]').forEach(link => {
      const key = link.dataset.social;
      if (key && data.site[key]) link.href = data.site[key];
    });

    const stats = [
      ['项目经验', data.projects.length],
      ['平台运营', 4],
      ['现场活动', 4]
    ];
    const statsTarget = document.querySelector('[data-hero-stats]');
    if (statsTarget) {
      stats.forEach(([label, value]) => {
        const stat = createElement('div', 'hero-stat');
        stat.append(createElement('strong', '', value), createElement('span', '', label));
        statsTarget.append(stat);
      });
    }

    const about = document.querySelector('[data-about]');
    if (about) {
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
    }

    const skills = document.querySelector('[data-skills]');
    if (skills) {
      data.skills.forEach((group, index) => {
        const element = createElement('div', `skill-group reveal-up${index ? ` delay-${index}` : ''}`);
        element.append(createElement('h4', '', group.title));

        const cloud = createElement('div', 'skill-cloud');
        const items = group.items || (group.chips || []).map(chip => [chip, 90]);

        items.forEach(([name, value]) => {
          const strength = Math.min(Math.max(Math.round(value / 20), 1), 5);
          const chip = createElement('span', `skill-pill size-${strength}`, name);
          cloud.append(chip);
        });

        element.append(cloud);
        skills.append(element);
      });
    }

    const experience = document.querySelector('[data-experience]');
    if (experience) {
      data.experience.forEach(item => {
        const entry = createElement('article', 'timeline-item');
        const content = createElement('div', 'content');
        const role = createElement('h4', '', item.role);

        const scenario = createElement('p', 'experience-block');
        scenario.append(createElement('strong', '', '场景：'), document.createTextNode(item.summary));

        const action = createElement('p', 'experience-block');
        const actionText = item.achievements.join(' ');
        action.append(createElement('strong', '', '行动：'), document.createTextNode(actionText));

        const impact = createElement('p', 'experience-block');
        const impactText = item.role.includes('新媒体编辑')
          ? '通过内容策划、平台运营与跨平台分发，形成稳定的城市传播与用户互动机制。'
          : item.role.includes('导演助理')
            ? '为纪录片、展览与影视项目提供前期支持与现场协作，提升叙事表达与项目执行质量。'
            : '在现场执行与艺人协调中保障演出流程顺畅，推动项目顺利落地。';
        impact.append(createElement('strong', '', '影响：'), document.createTextNode(impactText));

        content.append(role, scenario, action, impact);
        entry.append(createElement('div', 'time', item.period), content);
        experience.append(entry);
      });
    }

    const education = document.querySelector('[data-education]');
    if (education) {
      data.education.forEach(item => {
        const card = createElement('article', 'education-card reveal-up');
        card.append(
          createElement('span', 'education-period', item.period),
          createElement('h3', '', item.school),
          createElement('p', 'education-degree', item.degree),
          createElement('p', 'muted', item.major)
        );

        if (item.detail) card.append(createElement('p', 'education-detail', item.detail));
        education.append(card);
      });
    }

    const activities = document.querySelector('[data-activities]');
    if (activities) {
      data.activities.forEach(item => {
        const activity = createElement('article', 'activity-item reveal-up');
        activity.append(createElement('h3', '', item.title), createElement('p', 'muted', item.detail));
        activities.append(activity);
      });
    }

    const awards = document.querySelector('[data-awards]');
    if (awards) {
      data.awards.forEach(item => awards.append(createElement('li', '', item)));
    }

    const projects = document.querySelector('[data-projects]');
    if (projects) {
      data.projects.forEach((project, index) => {
        const card = createElement('article', `project-card reveal-up${index ? ` delay-${index}` : ''}`);
        const cover = createElement('div', 'project-cover');

        if (project.image) {
          const image = createElement('img', 'project-cover-image');
          image.src = project.image;
          image.alt = project.title;
          image.loading = 'lazy';
          image.decoding = 'async';
          cover.append(image);
        }

        const badge = createElement('span', 'project-badge', project.category);
        const body = createElement('div', 'project-body');
        const title = createElement('h3', 'project-title', project.title);
        const tags = createElement('div', 'project-tags');

        (project.tags || []).slice(0, 3).forEach(tag => {
          tags.append(createElement('span', 'project-tag', tag));
        });

        const desc = createElement('p', 'project-desc', project.desc);
        const footer = createElement('div', 'project-footer');

        const detailButton = createElement('button', 'project-link', '详情');
        detailButton.type = 'button';
        detailButton.dataset.project = JSON.stringify(project);
        detailButton.setAttribute('aria-label', `查看${project.title}详情`);

        const externalLink = createElement('a', 'project-link secondary', '查看');
        externalLink.href = project.link || '#';
        externalLink.target = '_blank';
        externalLink.rel = 'noopener';
        externalLink.setAttribute('aria-label', `打开${project.title}`);

        footer.append(detailButton, externalLink);
        cover.append(badge);
        body.append(title, tags, desc);
        card.append(cover, body, footer);
        projects.append(card);
      });
    }

    const filters = document.querySelector('[data-project-filters]');
    if (filters) {
      const projectTags = [...new Set((data.projects || []).flatMap(project => project.tags || []))];
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

        const cards = document.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
          const visible = selected === '全部' || (data.projects[index]?.tags || []).includes(selected);
          card.classList.toggle('is-hidden', !visible);
        });
      });
    }

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('main-nav');
    const themeToggle = document.querySelector('.theme-toggle');

    if (themeToggle) {
      const storedTheme = localStorage.getItem('portfolio-theme');
      if (storedTheme === 'light') document.body.classList.add('light-theme');

      const updateThemeButton = () => {
        const light = document.body.classList.contains('light-theme');
        themeToggle.setAttribute('aria-pressed', String(light));
        const icon = themeToggle.querySelector('span');
        if (icon) icon.textContent = light ? '☾' : '☼';
      };

      updateThemeButton();
      themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        localStorage.setItem('portfolio-theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
        updateThemeButton();
      });
    }

    navToggle?.addEventListener('click', () => {
      const open = nav?.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    const reveals = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-section');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);

        entry.target.querySelectorAll('.skill-fill').forEach(fill => {
          setTimeout(() => {
            fill.style.width = `${fill.dataset.fill || 0}%`;
          }, 120);
        });
      });
    }, { threshold: 0.12 });

    reveals.forEach(element => observer.observe(element));

    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.toggle('active', link.hash === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });

    document.querySelectorAll('main > section[id]').forEach(section => sectionObserver.observe(section));

    const modal = document.getElementById('project-modal');
    const modalClose = document.querySelector('.modal-close');
    if (modal && modalClose) {
      document.querySelectorAll('.project-link').forEach(button => {
        button.addEventListener('click', event => {
          if (button.tagName.toLowerCase() === 'a') return;

          const project = JSON.parse(button.dataset.project || '{}');
          const modalTitle = document.getElementById('modal-title');
          const modalDesc = document.getElementById('modal-desc');
          const modalTags = document.getElementById('modal-tags');
          const modalLink = document.getElementById('modal-link');

          if (modalTitle) modalTitle.textContent = project.title || '项目';
          if (modalDesc) modalDesc.textContent = project.desc || '';
          if (modalTags) {
            modalTags.replaceChildren(...(project.tags || []).map(tag => createElement('span', 'tag', tag)));
          }
          if (modalLink) modalLink.href = project.link || '#';

          modal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
          modalClose.focus();
        });
      });

      const closeModal = () => {
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      };

      modalClose.addEventListener('click', closeModal);
      modalClose.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          closeModal();
        }
      });
      modal.addEventListener('click', event => {
        if (event.target === modal) closeModal();
      });
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
      });
    }

    document.querySelectorAll('[data-copy]').forEach(button => {
      button.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(button.dataset.copy);
          const original = button.textContent;
          button.textContent = '已复制';
          setTimeout(() => {
            button.textContent = original;
          }, 1500);
        } catch {
          alert(`请手动复制：${button.dataset.copy}`);
        }
      });
    });

    const contactForm = document.getElementById('contact-form');
    contactForm?.addEventListener('submit', event => {
      event.preventDefault();
      const button = contactForm.querySelector('button[type="submit"]');
      if (!button) return;

      button.disabled = true;
      button.textContent = '发送中...';
      setTimeout(() => {
        button.disabled = false;
        button.textContent = '发送';
        alert('已模拟发送（请接入实际后端或第三方表单服务以实现真正提交）');
        contactForm.reset();
      }, 900);
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (nav) nav.classList.remove('open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    const scrollCue = document.querySelector('.scroll-cue');
    if (scrollCue) {
      scrollCue.addEventListener('click', () => {
        const directorySection = document.querySelector('.directory-wrap');
        if (directorySection) {
          directorySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }

        const sections = [...document.querySelectorAll('main > section[id]')];
        const current = document.getElementById('home');
        const index = sections.indexOf(current);
        const nextSection = sections[index + 1];

        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    const showPage = () => document.body.classList.remove('preload');
    requestAnimationFrame(showPage);
    setTimeout(showPage, 250);
  } catch (error) {
    console.error('Render error:', error);
  }
});
