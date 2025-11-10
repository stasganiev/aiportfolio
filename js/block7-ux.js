/* ===================================
   BLOCK 7: UX IMPROVEMENTS FUNCTIONALITY
   Language Switcher, Share Buttons, Tooltips
   =================================== */

// ========== Language Switcher ==========
function initLanguageSwitcher() {
    const languageToggle = document.getElementById('languageToggle');
    const languageDropdown = document.getElementById('languageDropdown');
    const languageOptions = document.querySelectorAll('.language-option');

    if (!languageToggle || !languageDropdown) return;

    // Toggle dropdown
    languageToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = languageToggle.getAttribute('aria-expanded') === 'true';
        languageToggle.setAttribute('aria-expanded', !isExpanded);
        languageDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-switcher')) {
            languageToggle.setAttribute('aria-expanded', 'false');
            languageDropdown.classList.remove('show');
        }
    });

    // Handle language selection (placeholder functionality)
    languageOptions.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.dataset.lang;
            const flag = option.dataset.flag;
            const langName = option.querySelector('.lang-name').textContent;

            // Update active state
            languageOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');

            // Update toggle button
            document.querySelector('.current-lang-flag').textContent = flag;
            document.querySelector('.current-lang-code').textContent = lang.toUpperCase();

            // Close dropdown
            languageToggle.setAttribute('aria-expanded', 'false');
            languageDropdown.classList.remove('show');

            // Show notification (since functionality is not implemented)
            showShareNotification(`Language switcher ready! ${langName} translation coming soon.`);
        });
    });

    // Keyboard navigation
    languageDropdown.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            languageToggle.setAttribute('aria-expanded', 'false');
            languageDropdown.classList.remove('show');
            languageToggle.focus();
        }
    });
}

// ========== Share Functionality ==========
function initShareButtons() {
    // Footer share buttons
    const footerShareButtons = document.querySelectorAll('.footer-share .share-btn');
    footerShareButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const shareType = btn.dataset.share;
            const url = window.location.href;
            const title = 'Check out Stas Ganiev\'s Portfolio - Frontend Developer';
            const description = 'Frontend Developer specializing in modern web development. JavaScript developer and 1C specialist based in Serbia.';

            handleShare(shareType, url, title, description);
        });
    });

    // Project share buttons
    const projectShareButtons = document.querySelectorAll('.project-share-btn');
    projectShareButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const shareType = btn.dataset.share;
            const url = btn.dataset.url;
            const projectTitle = btn.dataset.project || 'Project';
            const title = `${projectTitle} by Stas Ganiev`;
            const description = `Check out this project: ${projectTitle}`;

            handleShare(shareType, url, title, description);
        });
    });
}

function handleShare(type, url, title, description) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);

    switch(type) {
        case 'linkedin':
            window.open(
                `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
                '_blank',
                'width=600,height=600'
            );
            break;

        case 'facebook':
            window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
                '_blank',
                'width=600,height=600'
            );
            break;

        case 'twitter':
            window.open(
                `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
                '_blank',
                'width=600,height=400'
            );
            break;

        case 'copy':
            copyToClipboard(url);
            break;

        default:
            console.warn('Unknown share type:', type);
    }
}

function copyToClipboard(text) {
    // Modern API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showShareNotification('Link copied to clipboard!');
            })
            .catch(() => {
                fallbackCopyToClipboard(text);
            });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        showShareNotification('Link copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy:', err);
        showShareNotification('Failed to copy link. Please copy manually.');
    }

    document.body.removeChild(textArea);
}

function showShareNotification(message) {
    const notification = document.getElementById('shareNotification');
    if (!notification) return;

    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ========== Skill Tooltips ==========
function initSkillTooltips() {
    const skillsSection = document.querySelector('.skills-content');
    if (!skillsSection) return;

    // Get all skills categories
    const skillsCategories = skillsSection.querySelectorAll('.skills-category');
    
    skillsCategories.forEach(category => {
        const categoryTitle = category.querySelector('.category-title');
        if (!categoryTitle) return;
        
        // Only add tooltips for "Core Skills" category
        const categoryName = categoryTitle.textContent.trim();
        if (categoryName !== 'Core Skills') return;
        
        const skillCards = category.querySelectorAll('.skill-card');

        skillCards.forEach(card => {
            // Check if tooltip already exists
            if (card.querySelector('.skill-tooltip')) return;

            const skillTitle = card.querySelector('h4');
            if (!skillTitle) return;

            const tooltipText = skillTitle.textContent.trim();
            
            // Wrap the skill icon in a container for tooltip positioning
            const skillIcon = card.querySelector('.skill-icon');
            if (!skillIcon) return;

            // Create tooltip element
            const tooltip = document.createElement('div');
            tooltip.className = 'skill-tooltip';
            tooltip.textContent = tooltipText;
            tooltip.setAttribute('role', 'tooltip');

            // Add tooltip to the icon container
            skillIcon.style.position = 'relative';
            skillIcon.appendChild(tooltip);
        });
    });
}

// ========== Initialization ==========
document.addEventListener('DOMContentLoaded', () => {
    initLanguageSwitcher();
    initShareButtons();
    initSkillTooltips();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Close language dropdown when tab is hidden
        const languageToggle = document.getElementById('languageToggle');
        const languageDropdown = document.getElementById('languageDropdown');
        if (languageToggle && languageDropdown) {
            languageToggle.setAttribute('aria-expanded', 'false');
            languageDropdown.classList.remove('show');
        }
    }
});
