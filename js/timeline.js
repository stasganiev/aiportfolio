// ==========================================================================
// TIMELINE ANIMATION
// ==========================================================================

(function() {
  'use strict';

  const timelineItems = document.querySelectorAll('.timeline-item');
  
  if (timelineItems.length === 0) return;

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
        // Отключаем наблюдение после анимации
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Наблюдаем за каждым элементом timeline
  timelineItems.forEach((item, index) => {
    // Добавляем небольшую задержку для каскадной анимации
    item.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(item);
  });

})();
