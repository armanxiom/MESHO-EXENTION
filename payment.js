// Payment Form Logic
const paymentForm = document.getElementById('payment-form');
const paymentFormContainer = document.getElementById('payment-form-container');
const successMessage = document.getElementById('success-message');
const screenshotInput = document.getElementById('screenshot');
const fileNameDisplay = document.getElementById('file-name-display');

// Handle Screenshot Upload Display
if (screenshotInput) {
  screenshotInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      fileNameDisplay.textContent = `Selected: ${file.name}`;
      fileNameDisplay.classList.add('text-yellow-400', 'font-bold');
    }
  });
}

// Handle Form Submission
if (paymentForm) {
  paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const txnId = document.getElementById('txn-id').value;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Verifying...';
    if (window.lucide) lucide.createIcons();

    // Save to localStorage for Admin Dashboard
    const submissions = JSON.parse(localStorage.getItem('payment_submissions') || '[]');
    submissions.push({
      id: Date.now(),
      name,
      email,
      txnId,
      status: 'pending',
      timestamp: new Date().toLocaleString()
    });
    localStorage.setItem('payment_submissions', JSON.stringify(submissions));

    // Simulate Payment Verification Submission
    setTimeout(() => {
      paymentFormContainer.classList.add('hidden');
      successMessage.classList.remove('hidden');
      
      window.scrollTo({
        top: successMessage.offsetTop - 100,
        behavior: 'smooth'
      });
    }, 1500);
  });
}

// Initialize Lucide icons
if (window.lucide) {
  lucide.createIcons();
}
