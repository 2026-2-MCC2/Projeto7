document.addEventListener('DOMContentLoaded', () => {
  // Menu Dropdown Header
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const menuHeaderSair = document.getElementById('menu-header-sair');

  function logout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'index.html';
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.site-header')) {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (menuHeaderSair) {
    menuHeaderSair.addEventListener('click', (event) => {
      event.preventDefault();
      logout();
    });
  }

  // Pesquisa e navegação de artigos
  const searchInput = document.querySelector('#help-search');
  const articles = [...document.querySelectorAll('.help-content article')];
  const links = [...document.querySelectorAll('.help-nav a[href^="#"]')];

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      articles.forEach(article => {
        article.hidden = query && !article.textContent.toLowerCase().includes(query);
      });
    });
  }

  links.forEach(link => {
    link.addEventListener('click', () => {
      links.forEach(item => item.classList.remove('active'));
      link.classList.add('active');
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const link = document.querySelector(`.help-nav a[href="#${entry.target.id}"]`);
      if (link) {
        links.forEach(item => item.classList.toggle('active', item === link));
      }
    });
  }, { rootMargin: '-20% 0px -65% 0px' });

  articles.forEach(article => observer.observe(article));
});