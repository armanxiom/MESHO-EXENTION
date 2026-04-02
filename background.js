// Meesho Autofill Tool - Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Meesho Autofill Tool Installed');
});

// Simple message relay if needed
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'ping') {
    sendResponse({ status: 'ok' });
  }
});
