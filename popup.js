// Meesho Autofill Tool - Popup Logic
let currentProfile = null;
let profiles = {};

// UI Elements
const loginScreen = document.getElementById('loginScreen');
const mainScreen = document.getElementById('mainScreen');
const licenseKeyInput = document.getElementById('licenseKey');
const loginBtn = document.getElementById('loginBtn');
const profileSelector = document.getElementById('profileSelector');
const statusText = document.getElementById('statusText');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  const data = await chrome.storage.local.get(['isLoggedIn', 'profiles', 'currentProfile']);
  
  if (data.isLoggedIn) {
    showMainScreen();
  }
  
  if (data.profiles) {
    profiles = data.profiles;
    updateProfileSelector();
  }
  
  if (data.currentProfile) {
    profileSelector.value = data.currentProfile;
    currentProfile = data.currentProfile;
  }
});

// Login Logic
loginBtn.addEventListener('click', () => {
  const key = licenseKeyInput.value.trim();
  if (key.length >= 8) {
    chrome.storage.local.set({ isLoggedIn: true });
    showMainScreen();
    showStatus('Login Successful');
  } else {
    showStatus('Invalid License Key', true);
  }
});

function showMainScreen() {
  loginScreen.classList.add('hidden');
  mainScreen.classList.remove('hidden');
}

// Profile Management
document.getElementById('newProfileBtn').addEventListener('click', () => {
  const name = prompt('Enter Profile Name:');
  if (name && !profiles[name]) {
    profiles[name] = {};
    saveProfiles();
    updateProfileSelector();
    profileSelector.value = name;
    currentProfile = name;
    showStatus(`Profile "${name}" created`);
  }
});

document.getElementById('deleteProfileBtn').addEventListener('click', () => {
  const name = profileSelector.value;
  if (name && confirm(`Delete profile "${name}"?`)) {
    delete profiles[name];
    saveProfiles();
    updateProfileSelector();
    showStatus('Profile deleted');
  }
});

profileSelector.addEventListener('change', (e) => {
  currentProfile = e.target.value;
  chrome.storage.local.set({ currentProfile });
});

function updateProfileSelector() {
  profileSelector.innerHTML = '<option value="">Select Profile</option>';
  Object.keys(profiles).forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    profileSelector.appendChild(opt);
  });
}

function saveProfiles() {
  chrome.storage.local.set({ profiles });
}

// Capture Logic
document.getElementById('captureBtn').addEventListener('click', async () => {
  if (!currentProfile) return showStatus('Select a profile first', true);
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: 'startCapture' });
  showStatus('Capture Mode Active (Press Enter on fields)');
});

// Autofill Logic
document.getElementById('autofillBtn').addEventListener('click', async () => {
  if (!currentProfile) return showStatus('Select a profile first', true);
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { 
    action: 'autofill', 
    data: profiles[currentProfile] 
  });
  showStatus('Autofilling fields...');
});

// Backup Logic
document.getElementById('exportBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(profiles)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `meesho_profiles_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  showStatus('Profiles exported');
});

document.getElementById('importBtn').addEventListener('click', () => {
  document.getElementById('importFile').click();
});

document.getElementById('importFile').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        profiles = { ...profiles, ...imported };
        saveProfiles();
        updateProfileSelector();
        showStatus('Profiles imported successfully');
      } catch (err) {
        showStatus('Invalid backup file', true);
      }
    };
    reader.readAsText(file);
  }
});

// Listen for captured data from content script
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'fieldCaptured' && currentProfile) {
    profiles[currentProfile][msg.label] = msg.value;
    saveProfiles();
    showStatus(`Captured: ${msg.label}`);
  }
});

function showStatus(text, isError = false) {
  statusText.textContent = text;
  statusText.style.color = isError ? '#ef4444' : '#facc15';
  setTimeout(() => {
    statusText.textContent = 'Ready';
    statusText.style.color = '#facc15';
  }, 3000);
}
