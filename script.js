document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const navDropdown = document.querySelector('.nav-dropdown');
  const dropdownToggle = document.querySelector('.dropdown-toggle');

  if (header) {
    header.addEventListener('focusin', () => {
      header.classList.remove('header-hidden');
    });
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
      if (header) header.classList.remove('header-hidden');

      if (!nav.classList.contains('open') && navDropdown) {
        navDropdown.classList.remove('open');
        if (dropdownToggle) dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('open');
        if (navDropdown) navDropdown.classList.remove('open');
        if (dropdownToggle) dropdownToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (navDropdown && dropdownToggle) {
    dropdownToggle.addEventListener('click', (event) => {
      if (window.innerWidth > 768) return;
      event.preventDefault();
      const isOpen = navDropdown.classList.contains('open');
      navDropdown.classList.toggle('open', !isOpen);
      dropdownToggle.setAttribute('aria-expanded', String(!isOpen));
    });

    document.addEventListener('click', (event) => {
      if (!navDropdown.contains(event.target)) {
        navDropdown.classList.remove('open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Scroll Progress Bar & Back to Top visibility
  const progress = document.getElementById('progress');
  const toTop = document.getElementById('toTop');
  let lastScrollY = window.scrollY;
  let directionDistance = 0;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    if (Math.sign(scrollDelta) === Math.sign(directionDistance)) {
      directionDistance += scrollDelta;
    } else {
      directionDistance = scrollDelta;
    }

    if (header) {
      const menuIsOpen = menuToggle?.getAttribute('aria-expanded') === 'true';
      const keyboardFocusInHeader = header.querySelector(':focus-visible');

      if (currentScrollY < 120 || menuIsOpen || keyboardFocusInHeader) {
        header.classList.remove('header-hidden');
        directionDistance = 0;
      } else if (directionDistance > 12) {
        header.classList.add('header-hidden');
        directionDistance = 0;
      } else if (directionDistance < -8) {
        header.classList.remove('header-hidden');
        directionDistance = 0;
      }
    }

    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollProgress = (window.scrollY / totalHeight) * 100;
    if (progress) progress.style.width = scrollProgress + '%';

    if (toTop) {
      if (window.scrollY > 400) {
        toTop.hidden = false;
      } else {
        toTop.hidden = true;
      }
    }
  }, { passive: true });

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const revealGroups = [
    '.hero-grid > *',
    '.stats-grid > *',
    '.about-frame > *',
    '.services-list > *',
    '.mission-grid > *',
    '.team-grid > *',
    '.contact-grid > *',
    '.footer-top > *',
    '.footer-bottom'
  ];

  revealGroups.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      element.classList.add('reveal');
      const siblings = Array.from(element.parentElement.children);
      const index = siblings.indexOf(element);
      element.style.setProperty('--reveal-delay', `${Math.min(index, 5) * 90}ms`);
    });
  });

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('motion-ready');

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
  }

  // Services Accordion Functionality
  const serviceHeads = document.querySelectorAll('.service-head');

  const setServiceState = (article, isOpen) => {
    if (!article) return;

    const head = article.querySelector('.service-head');
    const panel = article.querySelector('.service-panel');

    if (!head || !panel) return;

    article.classList.toggle('active', isOpen);
    head.setAttribute('aria-expanded', String(isOpen));
    panel.style.maxHeight = isOpen ? `${panel.scrollHeight}px` : '0px';
  };

  serviceHeads.forEach(head => {
    head.addEventListener('click', () => {
      const article = head.closest('.service');
      if (!article) return;

      const isOpen = article.classList.contains('active');

      document.querySelectorAll('.service').forEach(s => {
        const sHead = s.querySelector('.service-head');
        const sPanel = s.querySelector('.service-panel');

        if (!sHead || !sPanel) return;

        s.classList.remove('active');
        sHead.setAttribute('aria-expanded', 'false');
        sPanel.style.maxHeight = '0px';
      });

      if (!isOpen) {
        setServiceState(article, true);
      }
    });
  });

  // Open first service by default
  if (serviceHeads.length > 0) {
    const firstService = serviceHeads[0].closest('.service');
    if (firstService) {
      setServiceState(firstService, true);
    }
  }

  // Pre-fill Service Inquiry from buttons
  document.querySelectorAll('.enquire').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceName = btn.getAttribute('data-service');
      const msgBox = document.getElementById('message');
      if (msgBox) {
        msgBox.value = `Hello ARH Consulting, I would like to inquire about ${serviceName}.`;
      }
    });
  });

  // Contact Form Handling (WhatsApp Integration / Submission)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const formMessage = document.getElementById('formMessage');
      const hp = contactForm.querySelector('.hp').value;

      if (hp) return; // Honeypot spam check

      if (!name || !phone || !message) {
        formMessage.style.color = '#ef4444';
        formMessage.textContent = 'Please fill out all required fields.';
        return;
      }

      const whatsappNumber = contactForm.getAttribute('data-whatsapp') || '923159654816';
      const text = `Hello ARH Consulting,%0A%0AMy Name: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AEmail: ${encodeURIComponent(email || 'N/A')}%0AMessage: ${encodeURIComponent(message)}`;
      
      formMessage.style.color = '#10b981';
      formMessage.textContent = 'Redirecting to WhatsApp...';

      setTimeout(() => {
        window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
      }, 500);
    });
  }

  // Current Year Updater
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});