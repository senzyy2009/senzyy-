export function initTikdown() {
    const input = document.getElementById('tikdown-input');
    const btn = document.getElementById('btn-fetch-tikdown');

    btn.addEventListener('click', () => handleFetch(input.value));
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleFetch(input.value);
    });

    // Action buttons
    document.getElementById('btn-dl-video').addEventListener('click', () => downloadMedia('hdplay', 'video_hd.mp4') || downloadMedia('play', 'video_no_watermark.mp4'));
    document.getElementById('btn-dl-audio').addEventListener('click', () => downloadMedia('music', 'audio.mp3'));
    
    document.getElementById('btn-copy-link').addEventListener('click', () => {
        if (!currentData) return;
        const url = getAbsoluteUrl(currentData.play);
        navigator.clipboard.writeText(url).then(() => {
            const btn = document.getElementById('btn-copy-link');
            const originalHtml = btn.innerHTML;
            btn.innerHTML = '<i data-lucide="check"></i> Copied!';
            if (window.lucide) window.lucide.createIcons();
            setTimeout(() => {
                btn.innerHTML = originalHtml;
                if (window.lucide) window.lucide.createIcons();
            }, 2000);
        });
    });

    document.getElementById('btn-share').addEventListener('click', () => {
        if (!currentData) return;
        const url = getAbsoluteUrl(currentData.play);
        if (navigator.share) {
            navigator.share({
                title: currentData.title,
                url: url
            }).catch(console.error);
        } else {
            alert('Sharing is not supported on this browser.');
        }
    });
}

let currentData = null;

async function handleFetch(url) {
    url = url.trim();
    if (!url) return;

    const errorEl = document.getElementById('tikdown-error');
    const resultEl = document.getElementById('tikdown-result');
    const loader = document.getElementById('tikdown-loader');
    const btnText = document.getElementById('tikdown-btn-text');
    const btn = document.getElementById('btn-fetch-tikdown');

    // Reset UI
    errorEl.classList.add('hidden');
    resultEl.classList.add('hidden');
    btn.disabled = true;
    loader.classList.remove('hidden');
    btnText.textContent = 'Fetching...';

    try {
        const response = await fetch("https://www.tikwm.com/api/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Accept": "application/json"
            },
            body: new URLSearchParams({
                url: url,
                count: "12",
                cursor: "0",
                web: "1",
                hd: "1"
            })
        });

        const data = await response.json();
        
        if (data.code === 0 && data.data) {
            currentData = data.data;
            showResult(currentData);
        } else {
            throw new Error(data.msg || "Failed to fetch TikTok data");
        }
    } catch (err) {
        errorEl.textContent = err.message || "Network error. Please try again.";
        errorEl.classList.remove('hidden');
    } finally {
        btn.disabled = false;
        loader.classList.add('hidden');
        btnText.textContent = 'Fetch';
    }
}

function getAbsoluteUrl(url) {
    if (!url) return '';
    if (url.startsWith('//')) {
        return 'https:' + url;
    }
    if (!url.startsWith('http')) {
        return 'https://www.tikwm.com' + (url.startsWith('/') ? '' : '/') + url;
    }
    return url;
}

function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 MB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showResult(data) {
    const coverUrl = data.cover || data.origin_cover || data.play;
    const avatarUrl = data.author ? data.author.avatar : '';
    document.getElementById('tikdown-cover').src = getAbsoluteUrl(coverUrl);
    document.getElementById('tikdown-avatar').src = getAbsoluteUrl(avatarUrl);
    document.getElementById('tikdown-nickname').textContent = data.author ? data.author.nickname : 'Unknown';
    document.getElementById('tikdown-title').textContent = data.title;
    
    // Stats
    document.getElementById('tikdown-duration').textContent = data.duration ? data.duration + 's' : 'N/A';
    document.getElementById('tikdown-size').textContent = data.size ? formatBytes(data.size) : 'Unknown';

    // Toggle Music button
    const btnMusic = document.getElementById('btn-dl-audio');
    if (data.music) {
        btnMusic.style.display = 'flex';
    } else {
        btnMusic.style.display = 'none';
    }

    document.getElementById('tikdown-result').classList.remove('hidden');
}

function downloadMedia(type, filename) {
    if (!currentData || !currentData[type]) return false;
    let url = getAbsoluteUrl(currentData[type]);
    
    // Add query params to hint download for browsers if possible, 
    // though tikwm usually forces download if dl=1 is passed.
    if (url.includes('?')) {
        url += '&dl=1';
    } else {
        url += '?dl=1';
    }
    
    // Create an invisible anchor to trigger download instead of just opening
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    return true;
}
