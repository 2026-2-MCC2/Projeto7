const searchInput = document.querySelector('#help-search');
const articles = [...document.querySelectorAll('.help-content article')];
const links = [...document.querySelectorAll('.help-nav a')];

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  articles.forEach(article => {
    article.hidden = query && !article.textContent.toLowerCase().includes(query);
  });
});

links.forEach(link => link.addEventListener('click', () => {
  links.forEach(item => item.classList.remove('active'));
  link.classList.add('active');
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const link = document.querySelector(`.help-nav a[href="#${entry.target.id}"]`);
    links.forEach(item => item.classList.toggle('active', item === link));
  });
}, { rootMargin: '-20% 0px -65% 0px' });

articles.forEach(article => observer.observe(article));
