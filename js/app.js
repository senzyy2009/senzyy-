import { initUI } from './ui.js';
import { initAI } from './ai.js';
import { initTikdown } from './tikdown.js';

document.addEventListener('DOMContentLoaded', () => {
    initUI();
    initAI();
    initTikdown();
});
