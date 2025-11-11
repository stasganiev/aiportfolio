/* ===================================
   BLOCK 9: ACCESSIBILITY (A11Y) FUNCTIONALITY
   ARIA labels, Focus management, Reduced motion
   =================================== */

// ========== Add ARIA Labels to Sections ==========
function enhanceARIALabels() {
    // Add role="region" and aria-label to main sections
    const sections = [
        { selector: '#about', label: 'About Me' },
        { selector: '#skills', label: 'Skills and Technologies' },
        { selector: '#timeline', label: 'Career Timeline' },
        { selector: '#projects', label: 'Featured Projects' },
        { selector: '#articles', label: 'Latest Articles' },
        { selector: '#achievements', label: 'Achievements' },
        { selector: '#funfacts', label: 'Fun Facts' },
        { selector: '#contact', label: 'Contact Form' }
    ];

    sections.forEach(({ selector, label }) => {
        const section = document.querySelector(selector);
        if (section) {
            section.setAttribute('role', 'region');
            section.setAttribute('aria-label', label);
        }
    });

    // Add aria-label to footer
    const footer = document.querySelector('.footer');
    if (footer) {
        footer.setAttribute('role', 'contentinfo');
        footer.setAttribute('aria-label', 'Footer');
    }
}

// ========== Enhance Button Accessibility ==========
function enhanceButtonAccessibility() {
    // Add aria-label to buttons without text
    const backToTop = document.getElementById('backToTop');
    if (backToTop && !backToTop.getAttribute('aria-label')) {
        backToTop.setAttribute('aria-label', 'Scroll back to top');
    }

    // Enhance mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-controls', 'navigation');
        
        // Update aria-expanded on click
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }
}

// ========== Add Alt Text to Images ==========
function auditAltText() {
    const images = document.querySelectorAll('img');
    const missingAlt = [];

    images.forEach((img, index) => {
        if (!img.hasAttribute('alt')) {
            img.setAttribute('alt', '');
            missingAlt.push(`Image ${index + 1}: ${img.src}`);
        } else if (img.alt.trim() === '' && !img.hasAttribute('aria-hidden')) {
            // Decorative images should have aria-hidden
            if (img.closest('#particles-js') || img.classList.contains('decorative')) {
                img.setAttribute('aria-hidden', 'true');
            }
        }
    });

    // Log missing alt text in development
    if (missingAlt.length > 0 && window.location.hostname === 'localhost') {
        console.warn('Images with missing alt text:', missingAlt);
    }
}

// ========== Scroll Progress Accessibility ==========
function updateScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    if (!scrollProgress) return;

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        
        // Update aria-valuenow for screen readers
        scrollProgress.setAttribute('aria-valuenow', Math.round(scrolled));
    });
}

// ========== Keyboard Navigation Enhancements ==========
function enhanceKeyboardNavigation() {
    // Add keyboard shortcut to focus search/contact
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to focus contact button
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const contactTrigger = document.querySelector('.contact-trigger');
            if (contactTrigger) {
                contactTrigger.focus();
                contactTrigger.click();
            }
        }
    });

    // Improve focus trap for modal
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const closeBtn = document.getElementById('closeModal');
                if (closeBtn) closeBtn.click();
            }

            // Tab trap inside modal
            if (e.key === 'Tab') {
                const focusableElements = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
}

// ========== Reduced Motion Support ==========
function handleReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function applyReducedMotion(shouldReduce) {
        if (shouldReduce) {
            document.documentElement.classList.add('reduce-motion');
            
            // Disable particles.js if it exists
            if (window.pJSDom && window.pJSDom.length > 0) {
                window.pJSDom[0].pJS.fn.vendors.destroypJS();
            }
        } else {
            document.documentElement.classList.remove('reduce-motion');
        }
    }

    // Apply on load
    applyReducedMotion(prefersReducedMotion.matches);

    // Listen for changes
    prefersReducedMotion.addEventListener('change', (e) => {
        applyReducedMotion(e.matches);
    });
}

// ========== Announce Dynamic Content to Screen Readers ==========
function createLiveRegion() {
    // Create aria-live region for dynamic announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
}

function announce(message, priority = 'polite') {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
        liveRegion.setAttribute('aria-live', priority);
        liveRegion.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

// ========== Enhance Form Accessibility ==========
function enhanceFormAccessibility() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    // Add aria-required to required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.setAttribute('aria-required', 'true');
    });

    // Enhance error messages
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        const errorSpan = input.nextElementSibling;
        if (errorSpan && errorSpan.classList.contains('form-error')) {
            const errorId = `${input.id}-error`;
            errorSpan.id = errorId;
            input.setAttribute('aria-describedby', errorId);
        }
    });
}

// ========== Initialize All Accessibility Features ==========
function initAccessibility() {
    // Core enhancements
    enhanceARIALabels();
    enhanceButtonAccessibility();
    auditAltText();
    updateScrollProgress();
    enhanceKeyboardNavigation();
    handleReducedMotion();
    createLiveRegion();
    enhanceFormAccessibility();

    // Announce page is ready to screen readers
    setTimeout(() => {
        announce('Page loaded successfully');
    }, 500);
}

// ========== Integration with existing features ==========
// Override share notification to announce to screen readers
if (window.showShareNotification) {
    const originalShowShareNotification = window.showShareNotification;
    window.showShareNotification = function(message) {
        originalShowShareNotification(message);
        announce(message);
    };
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initAccessibility);

// Export announce function for use in other scripts
window.announceToScreenReader = announce;
