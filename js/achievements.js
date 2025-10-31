// ==========================================================================
// ACHIEVEMENTS ANIMATION
// ==========================================================================

(function() {
  'use strict';

  const achievementItems = document.querySelectorAll('.achievement-item');
  
  if (achievementItems.length === 0) return;

  // Intersection Observer
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

  // Наблюдаем за каждым достижением
  achievementItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.15}s`;
    observer.observe(item);
  });

})();
