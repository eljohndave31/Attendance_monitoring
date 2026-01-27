let qrState = {
    currentToken: null,
    expiryTime: null,
    refreshInterval: null,
    qrInstance: null,
    isGenerating: true,
    location: 'office_main'
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadQRGeneratorView();
    setupEventListeners();
    initializeTimeUpdates();
    loadQRHistory();
});

function setupEventListeners() {
    // Sidebar navigation - just update active state, let links work naturally
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            sidebarToggle.innerHTML = sidebar.classList.contains('collapsed') 
                ? '<i class="fas fa-bars"></i>'
                : '<i class="fas fa-times"></i>';
        });
    }

    // User menu dropdown
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userMenu = document.getElementById('userMenu');
    
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenu.classList.toggle('show');
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-dropdown')) {
            userMenu?.classList.remove('show');
        }
    });

    // Fullscreen toggle
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', togglePageFullscreen);
    }

    // Search button
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            console.log('Search clicked');
        });
    }

    // Notifications button
    const notificationsBtn = document.getElementById('notificationsBtn');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', () => {
            console.log('Notifications clicked');
        });
    }
}

function initializeTimeUpdates() {
    updateCurrentTime();
    setInterval(() => updateCurrentTime(), 1000);
}

function updateCurrentTime() {
    const now = new Date();
    
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        timeElement.textContent = timeString;
    }
    
    const timePeriodElement = document.getElementById('timePeriod');
    if (timePeriodElement) {
        const period = now.getHours() >= 12 ? 'PM' : 'AM';
        timePeriodElement.textContent = period;
    }
    
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
}

// Load QR Generator template
function loadQRGeneratorView() {
    const template = document.getElementById('qrGeneratorView');
    const contentView = document.getElementById('contentView');
    
    if (!template || !contentView) {
        console.error('Template or content view not found');
        return;
    }
    
    const clone = template.content.cloneNode(true);
    contentView.innerHTML = '';
    contentView.appendChild(clone);
    
    // Initialize after template is loaded
    setTimeout(() => {
        setupQRGeneratorView();
        loadQRHistory();
    }, 100);
}

function generateToken() {
    return 'QR-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function createLiveQRCode() {
    const container = document.getElementById('liveQRCode');
    if (!container) return;

    const token = generateToken();
    const expiryMinutes = parseInt(document.getElementById('qrExpiry')?.value || '5');
    const locationId = document.getElementById('qrLocation')?.value || 'office_main';

    const generatedAt = new Date();
    const expiresAt = new Date(generatedAt.getTime() + expiryMinutes * 60000);

    const payload = {
        token: token,
        generated_at: generatedAt.toISOString(),
        expires_at: expiresAt.toISOString(),
        location_id: locationId
    };

    qrState.currentToken = token;
    qrState.expiryTime = expiresAt;
    qrState.currentPayload = payload;

    container.innerHTML = '';

    try {
        qrState.qrInstance = new QRCode(container, {
            text: JSON.stringify(payload),
            width: 250,
            height: 250,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    } catch (e) {
        console.error('Error creating QR code:', e);
    }

    updateLiveDisplay();
}

function updateLiveDisplay() {
    const token = document.getElementById('liveToken');
    const expiry = document.getElementById('liveExpiry');
    const location = document.getElementById('liveLocation');
    const generated = document.getElementById('liveGenerated');

    if (token) token.textContent = qrState.currentToken || '--';
    if (location) {
        const locationSelect = document.getElementById('qrLocation');
        const locationText = locationSelect?.options[locationSelect.selectedIndex]?.text || 'Office Main';
        location.textContent = locationText;
    }
    if (generated) {
        generated.textContent = qrState.currentPayload ? new Date(qrState.currentPayload.generated_at).toLocaleString() : '--';
    }

    if (expiry && qrState.expiryTime) {
        updateCountdown(expiry, qrState.expiryTime);
    }
}

function updateCountdown(element, expiryTime) {
    const update = () => {
        const now = new Date();
        const diff = expiryTime - now;

        if (diff <= 0) {
            element.textContent = '00:00';
            element.classList.add('expired');
            return;
        }

        element.classList.remove('expired');
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        element.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    update();
    const countdownInterval = setInterval(() => {
        if (!qrState.isGenerating) {
            clearInterval(countdownInterval);
            return;
        }
        update();
    }, 1000);
}

function loadQRHistory() {
    const historyBody = document.getElementById('qrHistory');
    if (!historyBody) return;
    
    const sampleHistory = [
        {
            token: 'abc123xyz789',
            generated: '10:30 AM',
            expired: '10:35 AM',
            scans: 45,
            status: 'Expired'
        },
        {
            token: 'def456uvw123',
            generated: '10:25 AM',
            expired: '10:30 AM',
            scans: 38,
            status: 'Expired'
        },
        {
            token: 'ghi789rst456',
            generated: '10:20 AM',
            expired: '10:25 AM',
            scans: 52,
            status: 'Expired'
        }
    ];
    
    historyBody.innerHTML = sampleHistory.map(item => `
        <tr>
            <td><code>${item.token}</code></td>
            <td>${item.generated}</td>
            <td>${item.expired}</td>
            <td>${item.scans}</td>
            <td><span class="badge-expired">${item.status}</span></td>
        </tr>
    `).join('');
}

function setupQRGeneratorView() {
    const generateBtn = document.getElementById('generateQR');
    const pauseBtn = document.getElementById('pauseQR');
    const refreshLiveBtn = document.getElementById('refreshLiveQR');
    const downloadBtn = document.getElementById('downloadQR');
    const fullscreenBtn = document.getElementById('fullscreenQR');
    const autoRefreshCheckbox = document.getElementById('autoRefresh');
    const enableGPSCheckbox = document.getElementById('enableGPS');
    const gpsOptions = document.getElementById('gpsOptions');

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            qrState.isGenerating = true;
            createLiveQRCode();
            generateBtn.textContent = '✓ Generated';
            setTimeout(() => {
                generateBtn.innerHTML = '<i class="fas fa-qrcode"></i> Generate QR Code';
            }, 2000);
        });
    }

    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            qrState.isGenerating = !qrState.isGenerating;
            pauseBtn.innerHTML = qrState.isGenerating 
                ? '<i class="fas fa-pause"></i> Pause' 
                : '<i class="fas fa-play"></i> Resume';
            pauseBtn.classList.toggle('paused');
        });
    }

    if (refreshLiveBtn) {
        refreshLiveBtn.addEventListener('click', createLiveQRCode);
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const qrCanvas = document.querySelector('#liveQRCode canvas');
            if (qrCanvas) {
                const link = document.createElement('a');
                link.href = qrCanvas.toDataURL('image/png');
                link.download = `qr-${qrState.currentToken}.png`;
                link.click();
            }
        });
    }

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            const qrContainer = document.getElementById('liveQRCode');
            if (qrContainer?.requestFullscreen) {
                qrContainer.requestFullscreen();
            }
        });
    }

    if (enableGPSCheckbox && gpsOptions) {
        enableGPSCheckbox.addEventListener('change', () => {
            gpsOptions.style.display = enableGPSCheckbox.checked ? 'block' : 'none';
        });
        gpsOptions.style.display = 'none';
    }

    if (autoRefreshCheckbox) {
        autoRefreshCheckbox.addEventListener('change', () => {
            if (autoRefreshCheckbox.checked) {
                const refreshMinutes = parseInt(document.getElementById('qrRefresh')?.value || '5');
                if (qrState.refreshInterval) clearInterval(qrState.refreshInterval);
                qrState.refreshInterval = setInterval(() => {
                    if (qrState.isGenerating) createLiveQRCode();
                }, refreshMinutes * 60000);
            } else {
                if (qrState.refreshInterval) clearInterval(qrState.refreshInterval);
            }
        });
    }

    createLiveQRCode();
}


function togglePageFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}