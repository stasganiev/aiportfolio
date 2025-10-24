// ==========================================================================
// CONTACT FORM HANDLER
// ==========================================================================

(function() {
  'use strict';

  // Initialize EmailJS
  // IMPORTANT: Replace with your actual EmailJS credentials
  const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Get from https://dashboard.emailjs.com/admin/account
  const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Get from https://dashboard.emailjs.com/admin
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Get from https://dashboard.emailjs.com/admin/templates

  // Initialize EmailJS when script loads
  emailjs.init(EMAILJS_PUBLIC_KEY);

  // DOM Elements
  const modal = document.getElementById('contactModal');
  const contactTriggers = document.querySelectorAll('.contact-trigger, .btn-secondary');
  const closeModalBtn = document.getElementById('closeModal');
  const closeSuccessBtn = document.getElementById('closeSuccess');
  const contactForm = document.getElementById('contactForm');
  const successMessage = document.getElementById('successMessage');

  // Open Modal
  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Reset form if it was previously submitted
    if (successMessage.classList.contains('active')) {
      resetForm();
    }
  }

  // Close Modal
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Small delay before resetting to allow animation to complete
    setTimeout(() => {
      if (!modal.classList.contains('active')) {
        resetForm();
      }
    }, 300);
  }

  // Reset Form
  function resetForm() {
    contactForm.classList.remove('hidden');
    successMessage.classList.remove('active');
    contactForm.reset();
    
    // Clear all error states
    const inputs = contactForm.querySelectorAll('.form-input, .form-select, .form-textarea');
    inputs.forEach(input => {
      input.classList.remove('error');
    });
    
    const errors = contactForm.querySelectorAll('.form-error');
    errors.forEach(error => {
      error.classList.remove('active');
      error.textContent = '';
    });
  }

  // Validate Email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Show Error
  function showError(input, message) {
    input.classList.add('error');
    const errorElement = input.parentElement.querySelector('.form-error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('active');
    }
  }

  // Clear Error
  function clearError(input) {
    input.classList.remove('error');
    const errorElement = input.parentElement.querySelector('.form-error');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('active');
    }
  }

  // Validate Form
  function validateForm(formData) {
    let isValid = true;
    
    // Validate Name
    const name = formData.get('name');
    const nameInput = document.getElementById('name');
    if (!name || name.trim().length < 2) {
      showError(nameInput, 'Please enter your full name');
      isValid = false;
    } else {
      clearError(nameInput);
    }
    
    // Validate Email
    const email = formData.get('email');
    const emailInput = document.getElementById('email');
    if (!email || !isValidEmail(email)) {
      showError(emailInput, 'Please enter a valid email address');
      isValid = false;
    } else {
      clearError(emailInput);
    }
    
    // Validate Subject
    const subject = formData.get('subject');
    const subjectSelect = document.getElementById('subject');
    if (!subject) {
      showError(subjectSelect, 'Please select a topic');
      isValid = false;
    } else {
      clearError(subjectSelect);
    }
    
    // Validate Message
    const message = formData.get('message');
    const messageTextarea = document.getElementById('message');
    if (!message || message.trim().length < 10) {
      showError(messageTextarea, 'Please enter a message (at least 10 characters)');
      isValid = false;
    } else {
      clearError(messageTextarea);
    }
    
    return isValid;
  }

  // Handle Form Submit
  async function handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    
    // Validate form
    if (!validateForm(formData)) {
      return;
    }
    
    // Get submit button
    const submitBtn = contactForm.querySelector('.btn-submit');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Prepare template parameters
    const templateParams = {
      from_name: formData.get('name'),
      from_email: formData.get('email'),
      company: formData.get('company') || 'Not specified',
      subject: formData.get('subject'),
      message: formData.get('message'),
      to_email: 'stas@ganiev.pro'
    };
    
    try {
      // Send email using EmailJS
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );
      
      // Show success message
      contactForm.classList.add('hidden');
      successMessage.classList.add('active');
      
      // Trigger confetti animation
      if (typeof triggerConfetti === 'function') {
        setTimeout(() => {
          triggerConfetti();
        }, 300);
      }
      
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Sorry, there was an error sending your message. Please try again or contact me directly at stas@ganiev.pro');
    } finally {
      // Reset button state
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  }

  // Event Listeners
  contactTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeModalBtn.addEventListener('click', closeModal);
  closeSuccessBtn.addEventListener('click', closeModal);

  // Close modal on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Form submit
  contactForm.addEventListener('submit', handleSubmit);

  // Real-time validation on input
  const inputs = contactForm.querySelectorAll('.form-input, .form-select, .form-textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      const formData = new FormData(contactForm);
      validateForm(formData);
    });
    
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        clearError(input);
      }
    });
  });

})();
