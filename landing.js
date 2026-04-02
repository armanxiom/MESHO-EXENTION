// Initialize Lucide icons
lucide.createIcons();

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    alert('Mobile menu functionality would go here. In a real app, this would toggle a slide-over menu.');
  });
}

// FAQ Accordion Logic
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const button = item.querySelector('button');
  const content = item.querySelector('.faq-content');
  
  button.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    
    // Close all other items
    faqItems.forEach(otherItem => {
      otherItem.classList.remove('active');
      otherItem.querySelector('.faq-content').classList.add('hidden');
    });
    
    // Toggle current item
    if (!isActive) {
      item.classList.add('active');
      content.classList.remove('hidden');
    }
  });
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Simple Scroll Animation Observer
const observerOptions = {
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.section, .stat-card, .faq-item').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});
