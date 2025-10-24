# 🚀 Portfolio Website - Stas Ganiev

Modern, responsive portfolio website showcasing frontend development skills with dark/light theme support, smooth animations, and working contact form.

## ✨ Features

- 🌓 **Dark/Light Theme** - Toggle between themes with smooth transitions
- 📱 **Fully Responsive** - Works seamlessly on all devices
- ✨ **Smooth Animations** - Scroll-triggered animations and hover effects
- 📧 **Working Contact Form** - EmailJS integration with validation and success animations
- 🎊 **Confetti Animation** - Celebratory animation on successful form submission
- 🎨 **Modern Design** - Clean, professional UI with gradient accents
- ⚡ **Fast Performance** - Vanilla JavaScript, no frameworks needed
- 🎯 **SEO Optimized** - Semantic HTML and meta tags
- ♿ **Accessible** - ARIA labels and keyboard navigation support

## 📂 Project Structure

```
ailanding/
├── css/
│   ├── normalize.css    # CSS reset for browser consistency
│   └── style.css        # Main styles with theme support + modal styles
├── js/
│   ├── main.js          # Core interactive features
│   ├── contact.js       # Contact form handler with EmailJS
│   └── confetti.js      # Confetti animation
├── img/                 # Images directory
├── index.html          # Main HTML file
├── BLOCK_3_CHANGES.md  # Changelog for contact form
├── EMAILJS_SETUP_GUIDE.md  # Detailed EmailJS setup instructions
├── QUICK_START_BLOCK_3.md  # Quick start guide
└── TESTING_BLOCK_3.md  # Testing checklist
```

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Variables
- **JavaScript ES6+** - Interactive features
- **EmailJS** - Email delivery service for contact form
- **CSS Grid & Flexbox** - Responsive layouts
- **CSS Animations** - Smooth transitions
- **Canvas API** - Confetti animation

## 🎨 Sections

1. **Hero** - Eye-catching introduction with call-to-action
2. **About** - Background and journey story with highlights
3. **Skills** - Organized skill categories with progress bars
4. **Projects** - Featured projects with live demos and GitHub links
5. **Contact** - Multiple contact methods + working form in modal

## 🚀 Getting Started

### Basic Setup (No Email)

1. Clone or download this repository
2. Open `index.html` in your browser
3. Everything works except email sending!

### Full Setup (With Email)

1. Follow steps above
2. **Setup EmailJS** (10 minutes):
   - Read `QUICK_START_BLOCK_3.md` for quick setup
   - Or `EMAILJS_SETUP_GUIDE.md` for detailed instructions
3. Update `js/contact.js` with your EmailJS credentials
4. Test the contact form!

## 📧 Contact Form Setup

The contact form uses **EmailJS** to send emails. To activate it:

1. **Register at EmailJS**: https://www.emailjs.com/
2. **Get your credentials**:
   - Public Key
   - Service ID
   - Template ID
3. **Update** `js/contact.js`:
   ```javascript
   const EMAILJS_PUBLIC_KEY = 'your_public_key';
   const EMAILJS_SERVICE_ID = 'your_service_id';
   const EMAILJS_TEMPLATE_ID = 'your_template_id';
   ```

**See detailed instructions**: `EMAILJS_SETUP_GUIDE.md`

## 💡 Customization

### Change Colors

Edit CSS variables in `css/style.css`:

```css
:root {
  --bg-accent: #3882f6;  /* Primary color */
  --text-accent: #3882f6; /* Accent color */
  /* ... more variables */
}
```

### Add Your Projects

Edit the projects section in `index.html`:

```html
<div class="project-card">
  <div class="project-image">🔢</div>
  <div class="project-content">
    <h3 class="project-title">Your Project</h3>
    <!-- ... -->
  </div>
</div>
```

### Update Contact Info

Modify the contact section in `index.html` with your details.

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

## 🌟 Key Features Explained

### Theme Switching
The theme preference is saved in localStorage, so it persists across visits.

### Scroll Animations
Uses Intersection Observer API for performant scroll-triggered animations.

### Mobile Menu
Responsive navigation that transforms into a hamburger menu on smaller screens.

## 📝 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Feel free to fork this project and customize it for your own portfolio!

## 📧 Contact

- Email: stas@ganiev.pro
- Telegram: [@stas_ganiev](https://t.me/stas_ganiev)
- LinkedIn: [Stanislav Ganiev](https://www.linkedin.com/in/stanislav-ganiev-73839516b/)

---

**Built with ❤️ by Stas Ganiev**
