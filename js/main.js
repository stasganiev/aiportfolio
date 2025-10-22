// ==========================================================================
// Theme Switcher
// ==========================================================================

const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);

// Update checkbox state
if (currentTheme === 'dark') {
  themeToggle.checked = true;
}

// Theme toggle function
themeToggle.addEventListener('change', function() {
  if (this.checked) {
    htmlElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    htmlElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
});

// ==========================================================================
// Mobile Menu Toggle
// ==========================================================================

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

mobileMenuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  
  // Toggle icon
  const icon = mobileMenuToggle.querySelector('span');
  if (navMenu.classList.contains('active')) {
    icon.textContent = '✕';
  } else {
    icon.textContent = '☰';
  }
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    const icon = mobileMenuToggle.querySelector('span');
    icon.textContent = '☰';
  });
});

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
