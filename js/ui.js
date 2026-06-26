import { getSettings, saveSettings, clearHistory } from './storage.js';
import { renderChatHistory } from './ai.js';

let currentSettings = getSettings();

export function initUI() {
    // Mode Switching
    const btnAi = document.getElementById('btn-mode-ai');
    const btnTikdown = document.getElementById('btn-mode-tikdown');
    const viewAi = document.getElementById('view-ai');
    const viewTikdown = document.getElementById('view-tikdown');

    btnAi.addEventListener('click', () => {
        btnAi.classList.add('active');
        btnTikdown.classList.remove('active');
        viewAi.classList.remove('hidden');
        viewTikdown.classList.add('hidden');
    });

    btnTikdown.addEventListener('click', () => {
        btnTikdown.classList.add('active');
        btnAi.classList.remove('active');
        viewTikdown.classList.remove('hidden');
        viewAi.classList.add('hidden');
    });

    // Settings Modal
    const modal = document.getElementById('settings-modal');
    document.getElementById('btn-settings').addEventListener('click', () => {
        modal.classList.remove('hidden');
        loadSettingsToUI();
    });
    
    document.getElementById('btn-close-settings').addEventListener('click', () => {
        modal.classList.add('hidden');
        saveSettingsFromUI();
    });
    
    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            saveSettingsFromUI();
        }
    });

    // Save API Key explicit button
    const btnSaveApiKey = document.getElementById('btn-save-api-key');
    if (btnSaveApiKey) {
        btnSaveApiKey.addEventListener('click', () => {
            saveSettingsFromUI();
            const statusText = document.getElementById('api-key-status');
            const originalText = 'Stored locally. Required for AI to work.';
            statusText.textContent = 'API Key Saved Successfully!';
            statusText.style.color = '#4ade80'; // success green
            setTimeout(() => {
                statusText.textContent = originalText;
                statusText.style.color = '';
            }, 3000);
        });
    }

    // Theme & Font Size Toggles
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const group = e.target.closest('.toggle-group');
            group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Instantly apply theme preview
            if (e.target.dataset.theme) {
                applyTheme(e.target.dataset.theme);
            }
            if (e.target.dataset.size) {
                applyFontSize(e.target.dataset.size);
            }
        });
    });

    // Admin Mode Logic
    let logoClicks = 0;
    let logoTimer;
    document.getElementById('brand-logo').addEventListener('click', () => {
        logoClicks++;
        clearTimeout(logoTimer);
        logoTimer = setTimeout(() => logoClicks = 0, 2000);
        
        if (logoClicks >= 5) {
            logoClicks = 0;
            const pwd = prompt("Enter Admin Password:");
            if (pwd === "senzy" || pwd === "admin") {
                document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
                alert("Admin mode activated!");
            }
        }
    });

    // Prompt Masking
    const btnTogglePrompt = document.getElementById('btn-toggle-prompt');
    const promptInput = document.getElementById('setting-prompt');
    const promptMasked = document.getElementById('setting-prompt-masked');
    
    if (btnTogglePrompt) {
        btnTogglePrompt.addEventListener('click', () => {
            if (promptInput.style.display === 'none') {
                promptInput.style.display = 'block';
                promptMasked.style.display = 'none';
                btnTogglePrompt.textContent = 'Hide';
            } else {
                promptInput.style.display = 'none';
                promptMasked.style.display = 'block';
                btnTogglePrompt.textContent = 'Show';
            }
        });
    }
    
    // Range input live update
    document.getElementById('setting-speed').addEventListener('input', (e) => {
        document.getElementById('speed-value').textContent = e.target.value;
    });

    // Textarea Auto-resize
    const chatInput = document.getElementById('chat-input');
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        const sendBtn = document.getElementById('btn-send-chat');
        if (this.value.trim()) {
            sendBtn.classList.remove('disabled');
        } else {
            sendBtn.classList.add('disabled');
        }
    });

    // Clear Chat
    document.getElementById('btn-clear-chat').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear chat history?')) {
            clearHistory();
            renderChatHistory(); // Will re-render empty state
        }
    });

    // Initialize lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
    
    // Initial UI Application
    applyTheme(currentSettings.theme);
    applyFontSize(currentSettings.fontSize);
}

function loadSettingsToUI() {
    currentSettings = getSettings();
    document.getElementById('setting-api-key').value = currentSettings.apiKey || '';
    document.getElementById('setting-speed').value = currentSettings.typingSpeed;
    document.getElementById('speed-value').textContent = currentSettings.typingSpeed;
    document.getElementById('setting-prompt').value = currentSettings.systemPrompt;
    
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        if (btn.dataset.theme === currentSettings.theme) btn.classList.add('active');
        else if (btn.dataset.theme) btn.classList.remove('active');
        
        if (btn.dataset.size === currentSettings.fontSize) btn.classList.add('active');
        else if (btn.dataset.size) btn.classList.remove('active');
    });
}

function saveSettingsFromUI() {
    const activeTheme = document.querySelector('.toggle-btn[data-theme].active')?.dataset.theme || 'dark';
    const activeSize = document.querySelector('.toggle-btn[data-size].active')?.dataset.size || 'medium';
    
    currentSettings = {
        apiKey: document.getElementById('setting-api-key').value.trim(),
        theme: activeTheme,
        fontSize: activeSize,
        typingSpeed: parseInt(document.getElementById('setting-speed').value),
        systemPrompt: document.getElementById('setting-prompt').value.trim()
    };
    
    saveSettings(currentSettings);
    applyTheme(currentSettings.theme);
    applyFontSize(currentSettings.fontSize);
}

export function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('theme-light');
        document.body.classList.remove('theme-dark');
    } else {
        document.body.classList.add('theme-dark');
        document.body.classList.remove('theme-light');
    }
}

export function applyFontSize(size) {
    const container = document.getElementById('chat-container');
    container.style.fontSize = size === 'small' ? '0.875rem' : size === 'large' ? '1.125rem' : '1rem';
}
