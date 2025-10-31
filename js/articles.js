// ==========================================================================
// ARTICLES ANIMATION
// ==========================================================================

(function() {
  'use strict';

  const articleCards = document.querySelectorAll('.article-card');
  
  if (articleCards.length === 0) return;

  // Intersection Observer для анимации при скролле
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Наблюдаем за каждой карточкой с задержкой
  articleCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.2}s`;
    observer.observe(card);
  });

})();
