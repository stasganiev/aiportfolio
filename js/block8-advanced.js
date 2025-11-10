/* ===================================
   BLOCK 8: ADVANCED FEATURES (Simplified)
   Cookie Consent Banner & Dark Mode Auto
   =================================== */

// ========== Cookie Consent ==========
function initCookieConsent() {
    const cookieName = 'portfolio_cookie_consent';
    const cookieConsent = document.getElementById('cookieConsent');
    
    if (!cookieConsent) return;

    // Check if user already made a choice
    const consent = localStorage.getItem(cookieName);
    
    if (!consent) {
        // Show banner after a short delay
        setTimeout(() => {
            cookieConsent.classList.add('show');
        }, 1000);
    }

    // Accept button
    const acceptBtn = document.getElementById('acceptCookies');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem(cookieName, 'accepted');
            hideCookieBanner();
        });
    }

    // Decline button
    const declineBtn = document.getElementById('declineCookies');
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem(cookieName, 'declined');
            hideCookieBanner();
        });
    }

    function hideCookieBanner() {
        cookieConsent.classList.remove('show');
        // Remove from DOM after animation
        setTimeout(() => {
            cookieConsent.style.display = 'none';
        }, 400);
    }
}

// ========== Dark Mode Auto Detection ==========
function initDarkModeAuto() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const THEME_KEY = 'portfolio_theme';
    
    // Check for saved user preference
    const savedTheme = localStorage.getItem(THEME_KEY);
    
    if (savedTheme) {
        // User has manually chosen a theme - use it
        applyTheme(savedTheme);
    } else {
        // Auto-detect system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const autoTheme = prefersDark ? 'dark' : 'light';
        applyTheme(autoTheme);
    }

    // Listen for system theme changes
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', (e) => {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (!savedTheme) {
            // Only auto-switch if user hasn't manually chosen
            const newTheme = e.matches ? 'dark' : 'light';
            applyTheme(newTheme);
        }
    });

    // Theme toggle button click (manual override)
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Save manual preference
        localStorage.setItem(THEME_KEY, newTheme);
        applyTheme(newTheme);
    });

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }
}

// ========== Early Dark Mode Init ==========
// This runs before DOMContentLoaded to prevent flash
(function earlyDarkModeInit() {
    const THEME_KEY = 'portfolio_theme';
    const savedTheme = localStorage.getItem(THEME_KEY);
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        // Auto-detect
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const autoTheme = prefersDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', autoTheme);
    }
})();

// ========== Initialization ==========
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Dark Mode Auto
    initDarkModeAuto();
    
    // Initialize Cookie Consent
    initCookieConsent();
});
