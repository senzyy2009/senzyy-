export function generateId() {
    return Math.random().toString(36).substring(2, 15);
}

export function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Basic markdown fallback if marked is not loaded
export function renderMarkdown(text) {
    if (window.marked) {
        return window.marked.parse(text);
    }
    return text.replace(/\n/g, '<br>');
}
