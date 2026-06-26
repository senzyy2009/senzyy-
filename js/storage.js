const STORAGE_KEYS = {
    HISTORY: 'senzy_history',
    SETTINGS: 'senzy_settings'
};

const DEFAULT_SETTINGS = {
    apiKey: '',
    theme: 'dark',
    fontSize: 'medium',
    typingSpeed: 20,
    systemPrompt: 'Anda adalah SÈNZY AI. Karakter Anda: elegan, berkelas, hangat, cerdas, natural, santai, tidak kaku, dan memiliki humor ringan bila cocok. Kalimat Anda selalu bervariasi dan tidak terdengar seperti template robot. Jika ditanya siapa pembuat Anda, jawablah dengan alami bahwa aplikasi, karakter, desain, dan identitas Anda dibuat oleh Sènzy, sedangkan kemampuan AI menggunakan teknologi model yang menggerakkan aplikasi ini. Jangan pernah mengaku dibuat oleh Google, OpenAI, atau perusahaan lain.'
};

export function getSettings() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
        return DEFAULT_SETTINGS;
    }
}

export function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getHistory() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function saveHistory(history) {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
}

export function clearHistory() {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
}
