// ==========================================================================
// CONFETTI ANIMATION
// ==========================================================================

(function() {
  'use strict';

  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  
  let confetti = [];
  let animationFrame;
  let isRunning = false;

  // Confetti particle class
  class Confetto {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height - canvas.height;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -20;
      this.w = Math.random() * 10 + 5;
      this.h = Math.random() * 5 + 3;
      this.vx = Math.random() * 4 - 2;
      this.vy = Math.random() * 3 + 2;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 10 - 5;
      
      // Random colors
      const colors = [
        '#3b82f6', // Blue
        '#ef4444', // Red
        '#10b981', // Green
        '#f59e0b', // Yellow
        '#8b5cf6', // Purple
        '#ec4899', // Pink
        '#06b6d4', // Cyan
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      
      // Gravity effect
      this.vy += 0.1;
      
      // Reset if out of bounds
      if (this.y > canvas.height + 20) {
        this.reset();
      }
      
      if (this.x > canvas.width + 20 || this.x < -20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
      ctx.restore();
    }
  }

  // Resize canvas to window size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Initialize confetti
  function initConfetti() {
    confetti = [];
    const count = 150; // Number of confetti pieces
    
    for (let i = 0; i < count; i++) {
      confetti.push(new Confetto());
    }
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    confetti.forEach(piece => {
      piece.update();
      piece.draw();
    });
    
    if (isRunning) {
      animationFrame = requestAnimationFrame(animate);
    }
  }

  // Start confetti
  function startConfetti() {
    if (isRunning) return;
    
    isRunning = true;
    resizeCanvas();
    initConfetti();
    animate();
    
    // Auto-stop after 5 seconds
    setTimeout(stopConfetti, 5000);
  }

  // Stop confetti
  function stopConfetti() {
    isRunning = false;
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    
    // Fade out
    const fadeOut = setInterval(() => {
      ctx.globalAlpha -= 0.05;
      if (ctx.globalAlpha <= 0) {
        clearInterval(fadeOut);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
      }
    }, 50);
  }

  // Expose trigger function globally
  window.triggerConfetti = startConfetti;

  // Handle window resize
  window.addEventListener('resize', () => {
    if (isRunning) {
      resizeCanvas();
    }
  });

})();
