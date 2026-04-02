// Meesho Autofill Tool - Content Script
let isCaptureMode = false;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'startCapture') {
    isCaptureMode = true;
    showNotification('Capture Mode: Active. Press Enter on any field.');
  } else if (msg.action === 'autofill') {
    autofillForm(msg.data);
  }
});

// Capture Logic: Listen for Enter key on inputs
document.addEventListener('keydown', (e) => {
  if (!isCaptureMode) return;
  
  if (e.key === 'Enter' && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
    e.preventDefault();
    
    const label = findLabel(e.target);
    const value = e.target.value;
    
    if (label && value) {
      chrome.runtime.sendMessage({
        action: 'fieldCaptured',
        label: label,
        value: value
      });
      
      e.target.style.borderColor = '#facc15';
      e.target.style.boxShadow = '0 0 5px rgba(250, 204, 21, 0.5)';
      showNotification(`Captured: ${label}`);
    }
  }
});

// Helper to find label for an input
function findLabel(el) {
  // 1. Check for aria-label
  if (el.getAttribute('aria-label')) return el.getAttribute('aria-label');
  
  // 2. Check for placeholder
  if (el.placeholder) return el.placeholder;
  
  // 3. Check for associated label element
  if (el.id) {
    const label = document.querySelector(`label[for="${el.id}"]`);
    if (label) return label.innerText.trim();
  }
  
  // 4. Check for parent label
  const parentLabel = el.closest('label');
  if (parentLabel) return parentLabel.innerText.trim();
  
  // 5. Check for preceding text/label
  const prev = el.previousElementSibling;
  if (prev && (prev.tagName === 'LABEL' || prev.tagName === 'SPAN')) {
    return prev.innerText.trim();
  }
  
  return el.name || el.id || 'unknown_field';
}

// Autofill Logic
async function autofillForm(data) {
  const inputs = document.querySelectorAll('input, textarea');
  
  for (const input of inputs) {
    const label = findLabel(input);
    if (data[label]) {
      input.value = data[label];
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      
      input.style.backgroundColor = 'rgba(250, 204, 21, 0.1)';
      input.style.border = '1px solid #facc15';
    }
  }
  
  showNotification('Autofill Complete!');
}

// Simple UI Notification
function showNotification(text) {
  let div = document.getElementById('meesho-autofill-notify');
  if (!div) {
    div = document.createElement('div');
    div.id = 'meesho-autofill-notify';
    div.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #000;
      color: #facc15;
      padding: 12px 20px;
      border-radius: 8px;
      border: 1px solid #facc15;
      font-family: sans-serif;
      font-weight: bold;
      z-index: 999999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      transition: opacity 0.3s;
    `;
    document.body.appendChild(div);
  }
  
  div.textContent = text;
  div.style.opacity = '1';
  
  setTimeout(() => {
    div.style.opacity = '0';
  }, 3000);
}
