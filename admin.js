// Admin Dashboard Logic
const submissionsBody = document.getElementById('submissions-body');
const emptyState = document.getElementById('empty-state');
const refreshBtn = document.getElementById('refresh-btn');
const clearBtn = document.getElementById('clear-btn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const toastIcon = document.getElementById('toast-icon');

// Load submissions from localStorage
function loadSubmissions() {
  const submissions = JSON.parse(localStorage.getItem('payment_submissions') || '[]');
  
  if (submissions.length === 0) {
    submissionsBody.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  submissionsBody.innerHTML = submissions.map(sub => `
    <tr class="border-b border-zinc-800/50 animate-fade-in">
      <td class="px-6 py-4">
        <div class="font-bold">${sub.name}</div>
        <div class="text-xs text-zinc-500">${sub.email}</div>
        <div class="text-[10px] text-zinc-600 mt-1">${sub.timestamp}</div>
      </td>
      <td class="px-6 py-4 font-mono text-xs text-zinc-400">${sub.txnId}</td>
      <td class="px-6 py-4">
        <div class="screenshot-thumb" title="View Screenshot">
          <i data-lucide="image" class="w-4 h-4 text-zinc-500"></i>
        </div>
      </td>
      <td class="px-6 py-4">
        <span class="status-badge status-${sub.status}">${sub.status}</span>
      </td>
      <td class="px-6 py-4">
        <div class="flex gap-2">
          ${sub.status === 'pending' ? `
            <button onclick="approveSubmission(${sub.id})" class="bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-500 hover:text-white transition-all">
              Approve
            </button>
            <button onclick="rejectSubmission(${sub.id})" class="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all">
              Reject
            </button>
          ` : `
            <span class="text-xs text-zinc-600 italic">No actions</span>
          `}
        </div>
      </td>
    </tr>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

// Approve Submission
window.approveSubmission = (id) => {
  const submissions = JSON.parse(localStorage.getItem('payment_submissions') || '[]');
  const index = submissions.findIndex(s => s.id === id);
  
  if (index !== -1) {
    const customer = submissions[index];
    submissions[index].status = 'approved';
    localStorage.setItem('payment_submissions', JSON.stringify(submissions));
    
    // Simulate Email Sending
    const licenseKey = `MEESHO-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    showToast(`Email sent to ${customer.email} with License Key: ${licenseKey}`, 'success');
    
    loadSubmissions();
  }
};

// Reject Submission
window.rejectSubmission = (id) => {
  const submissions = JSON.parse(localStorage.getItem('payment_submissions') || '[]');
  const index = submissions.findIndex(s => s.id === id);
  
  if (index !== -1) {
    submissions[index].status = 'rejected';
    localStorage.setItem('payment_submissions', JSON.stringify(submissions));
    showToast('Payment submission rejected.', 'error');
    loadSubmissions();
  }
};

// Toast Notification
function showToast(message, type = 'success') {
  toastMessage.textContent = message;
  toastIcon.innerHTML = type === 'success' ? '<i data-lucide="check" class="w-4 h-4"></i>' : '<i data-lucide="x" class="w-4 h-4"></i>';
  toastIcon.className = `w-8 h-8 rounded-full flex items-center justify-center ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`;
  
  toast.classList.add('show');
  if (window.lucide) lucide.createIcons();
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// Refresh Button
refreshBtn.addEventListener('click', () => {
  refreshBtn.querySelector('i').classList.add('animate-spin');
  setTimeout(() => {
    loadSubmissions();
    refreshBtn.querySelector('i').classList.remove('animate-spin');
  }, 500);
});

// Clear All Button
clearBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all submissions?')) {
    localStorage.removeItem('payment_submissions');
    loadSubmissions();
    showToast('All submissions cleared.', 'success');
  }
});

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
  loadSubmissions();
  if (window.lucide) lucide.createIcons();
});
