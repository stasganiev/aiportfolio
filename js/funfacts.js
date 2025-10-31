// ==========================================================================
// FUN FACTS ANIMATION & INTERACTION
// ==========================================================================

(function() {
  'use strict';

  const funfactCards = document.querySelectorAll('.funfact-card');
  
  if (funfactCards.length === 0) return;

  // Intersection Observer для появления карточек
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
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
  funfactCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(card);

    // Click handler для flip эффекта на мобильных
    card.addEventListener('click', function() {
      this.classList.toggle('flipped');
    });
  });

  // На desktop убираем flip при уходе курсора
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    funfactCards.forEach(card => {
      card.addEventListener('mouseleave', function() {
        // Убираем flipped класс при уходе курсора
        this.classList.remove('flipped');
      });
    });
  }

})();
