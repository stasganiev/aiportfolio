// ==========================================================================
// Remove Preload Class to Enable Animations
// ==========================================================================

window.addEventListener('load', () => {
  document.body.classList.remove('preload');
});

// ==========================================================================
// Theme Switcher
// ==========================================================================
// NOTE: Theme switching is now handled by block8-advanced.js
// which includes auto-detection of system theme preference
// This code is kept commented for reference

/*
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);

// Theme toggle function
if (themeToggle) {
  themeToggle.addEventListener('click', function() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}
*/

// ==========================================================================
// Mobile Menu Toggle
// ==========================================================================

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const body = document.body;

if (mobileMenuToggle && navMenu) {
  // Toggle menu on button click
  mobileMenuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = navMenu.classList.contains('active');
    
    if (isActive) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      closeMenu();
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const isClickInsideMenu = navMenu.contains(e.target);
    const isClickOnToggle = mobileMenuToggle.contains(e.target);
    
    if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Prevent menu clicks from closing menu
  navMenu.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Helper functions
  function openMenu() {
    navMenu.classList.add('active');
    mobileMenuToggle.classList.add('active');
    body.style.overflow = 'hidden'; // Prevent scroll when menu open
  }

  function closeMenu() {
    navMenu.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
    body.style.overflow = ''; // Restore scroll
  }

  // Close menu on window resize if open
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}

// ==========================================================================
// Smooth Scroll
// ==========================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ==========================================================================
// Header Scroll Effect
// ==========================================================================

const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll <= 0) {
    header.classList.remove('scroll-up');
    return;
  }
  
  if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
    // Scroll Down
    header.classList.remove('scroll-up');
    header.classList.add('scroll-down');
  } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
    // Scroll Up
    header.classList.remove('scroll-down');
    header.classList.add('scroll-up');
  }
  lastScroll = currentScroll;
});

// ==========================================================================
// Scroll Animations with Intersection Observer
// ==========================================================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-up');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all sections and cards
const animateElements = document.querySelectorAll(
  '.section, .skill-category, .project-card, .highlight-card, .contact-method'
);

animateElements.forEach(element => {
  element.style.opacity = '0';
  observer.observe(element);
});

// ==========================================================================
// Typing Effect for Hero Subtitle
// ==========================================================================

function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Apply typing effect to hero subtitle
window.addEventListener('load', () => {
  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle) {
    const text = heroSubtitle.textContent;
    typeWriter(heroSubtitle, text, 80);
  }
});

// ==========================================================================
// Skill Progress Bars Animation
// ==========================================================================

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const skillCard = entry.target;
      const progressBar = skillCard.querySelector('.skill-progress');
      
      if (progressBar) {
        const progress = progressBar.getAttribute('data-progress');
        // Small delay for smoother effect
        setTimeout(() => {
          progressBar.style.width = progress + '%';
        }, 100);
      }
      
      skillObserver.unobserve(skillCard);
    }
  });
}, {
  threshold: 0.3
});

// Observe all skill cards
const skillCards = document.querySelectorAll('.skill-card');
skillCards.forEach(card => {
  skillObserver.observe(card);
});

// ==========================================================================
// Back to Top Button
// ==========================================================================

const backToTopButton = document.getElementById('backToTop');

if (backToTopButton) {
  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });

  // Scroll to top on click
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ==========================================================================
// Lazy Loading Images
// ==========================================================================

// Function to load image with WebP support
function loadImage(img) {
  const picture = img.parentElement;
  
  // Check if parent is a picture element with sources
  if (picture && picture.tagName === 'PICTURE') {
    const sources = picture.querySelectorAll('source[data-srcset]');
    
    // Load all source srcsets
    sources.forEach(source => {
      const srcset = source.getAttribute('data-srcset');
      if (srcset) {
        source.setAttribute('srcset', srcset);
        source.removeAttribute('data-srcset');
      }
    });
  }
  
  // Load the main image
  const src = img.getAttribute('data-src');
  if (src) {
    // Create a temporary image to preload
    const tempImg = new Image();
    tempImg.src = src;
    
    tempImg.onload = () => {
      img.src = src;
      img.classList.add('loaded');
      img.removeAttribute('data-src');
    };
    
    tempImg.onerror = () => {
      // Fallback: still load the image even if preload fails
      img.src = src;
      img.classList.add('loaded');
      img.removeAttribute('data-src');
    };
  }
}

const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      loadImage(img);
      imageObserver.unobserve(img);
    }
  });
}, {
  rootMargin: '50px'
});

lazyImages.forEach(img => {
  imageObserver.observe(img);
});

// ==========================================================================
// Enhanced Scroll Animations
// ==========================================================================

// Add fade-in-up animation to elements as they appear
const fadeElements = document.querySelectorAll('.fade-in, .fade-in-delay, .fade-in-delay-2, .slide-up');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(element => {
  // Set initial state
  element.style.opacity = '0';
  element.style.transform = 'translateY(30px)';
  element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  
  fadeObserver.observe(element);
});

// ==========================================================================
// Active Navigation Link on Scroll
// ==========================================================================

const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  const scrollPosition = window.pageYOffset + 100;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

// ==========================================================================
// Prevent Scroll Animations from Running on Page Load
// ==========================================================================

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});
