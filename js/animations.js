// ==========================================================================
// BLOCK 4: ADDITIONAL ANIMATIONS
// ==========================================================================

(function() {
  'use strict';

  // ==========================================================================
  // 1. PARALLAX EFFECT - Hero Section (DISABLED)
  // ==========================================================================

  // Parallax removed per user request

  // ==========================================================================
  // 2. SCROLL PROGRESS BAR
  // ==========================================================================

  const scrollProgress = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    if (!scrollProgress) return;

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.pageYOffset;
    const progress = (scrolled / documentHeight) * 100;

    scrollProgress.style.width = progress + '%';
  }

  // Throttle scroll progress for performance
  let progressTicking = false;
  window.addEventListener('scroll', () => {
    if (!progressTicking) {
      window.requestAnimationFrame(() => {
        updateScrollProgress();
        progressTicking = false;
      });
      progressTicking = true;
    }
  });

  // Initial update
  updateScrollProgress();

  // ==========================================================================
  // 3. RIPPLE EFFECT - Buttons
  // ==========================================================================

  function createRipple(event) {
    const button = event.currentTarget;
    
    // Don't create ripple if button is disabled
    if (button.disabled) return;

    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');

    // Remove old ripples
    const ripples = button.getElementsByClassName('ripple');
    if (ripples.length > 0) {
      ripples[0].remove();
    }

    button.appendChild(circle);
  }

  // Add ripple to all buttons
  const buttons = document.querySelectorAll('.btn, .contact-trigger, .mobile-menu-toggle');
  buttons.forEach(button => {
    button.addEventListener('click', createRipple);
  });

  // ==========================================================================
  // 4. PARTICLES.JS CONFIGURATION
  // ==========================================================================

  function initParticles() {
    if (typeof particlesJS === 'undefined') {
      console.warn('Particles.js not loaded');
      return;
    }

    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer) {
      console.warn('Particles container not found');
      return;
    }

    particlesJS('particles-js', {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: '#3b82f6' // Blue accent color
        },
        shape: {
          type: 'circle',
          stroke: {
            width: 0,
            color: '#000000'
          }
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: false, // Only dots, no lines
          distance: 150,
          color: '#3b82f6',
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'repulse'
          },
          onclick: {
            enable: false,
            mode: 'push'
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 400,
            line_linked: {
              opacity: 1
            }
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3
          },
          repulse: {
            distance: 100,
            duration: 0.4
          },
          push: {
            particles_nb: 4
          },
          remove: {
            particles_nb: 2
          }
        }
      },
      retina_detect: true
    });

    console.log('Particles.js initialized successfully');
  }

  // Initialize particles after a short delay to ensure DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initParticles, 100);
    });
  } else {
    setTimeout(initParticles, 100);
  }

  // ==========================================================================
  // 5. DISABLE HEAVY ANIMATIONS ON MOBILE
  // ==========================================================================

  function handleMobileAnimations() {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // Hide particles on mobile
      const particles = document.getElementById('particles-js');
      if (particles) {
        particles.style.display = 'none';
      }
    }
  }

  // Check on load and resize
  handleMobileAnimations();
  window.addEventListener('resize', handleMobileAnimations);

  // ==========================================================================
  // 6. PERFORMANCE MONITORING (Development only)
  // ==========================================================================

  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    let frameCount = 0;
    let lastTime = performance.now();
    
    function measureFPS() {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        console.log(`FPS: ${fps}`);
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    }
    
    // Uncomment to monitor FPS in console
    // measureFPS();
  }

})();
