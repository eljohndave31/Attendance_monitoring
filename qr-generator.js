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
    initializeNavigation();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
});

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
            location: 'Poblacion Ward II',
            scans: 45,
            status: 'Expired'
        },
        {
            token: 'def456uvw123',
            generated: '10:25 AM',
            expired: '10:30 AM',
            location: 'Poblacion Ward II',
            scans: 38,
            status: 'Expired'
        },
        {
            token: 'ghi789rst456',
            generated: '10:20 AM',
            expired: '10:25 AM',
            location: 'Staca Tunghaan',
            scans: 52,
            status: 'Expired'
        }
    ];
    
    historyBody.innerHTML = sampleHistory.map(item => `
        <tr>
            <td><code>${item.token}</code></td>
            <td>${item.generated}</td>
            <td>${item.expired}</td>
            <td>${item.location}</td>
            <td>${item.scans}</td>
            <td><span class="badge badge-danger">${item.status}</span></td>
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
                ? '<i class="fas fa-pause"></i> Pause Generation' 
                : '<i class="fas fa-play"></i> Resume Generation';
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

    // Generate initial QR code
    createLiveQRCode();
}

// Initialize sidebar navigation
function initializeNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const view = this.getAttribute('data-view');
            handleNavigation(view);
        });
    });
    
    // User menu dropdown
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userMenu = document.getElementById('userMenu');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', function() {
            userMenu.classList.toggle('show');
        });
    }
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-dropdown')) {
            userMenu?.classList.remove('show');
        }
    });
    
    // Fullscreen button
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', togglePageFullscreen);
    }
}

function handleNavigation(view) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.querySelector(`[data-view="${view}"]`)?.classList.add('active');
    
    const titles = {
        'dashboard': 'Dashboard',
        'qr-generator': 'QR Generator',
        'employee-management': 'Employee Management',
        'attendance-monitor': 'Attendance Monitor',
        'reports': 'Reports',
        'settings': 'Settings',
        'system-logs': 'System Logs'
    };
    
    document.getElementById('pageTitle').textContent = titles[view] || 'Dashboard';
    
    // Navigate to different pages
    if (view === 'dashboard') {
        window.location.href = 'dashboard.html';
    } else if (view === 'qr-generator') {
        loadQRGeneratorView();
    } else if (view === 'employee-management') {
        window.location.href = 'employee-management.html';
    } else if (view === 'attendance-monitor') {
        window.location.href = 'attendance.html';
    } else if (view === 'reports') {
        window.location.href = 'reports.html';
    } else if (view === 'settings') {
        window.location.href = 'settings.html';
    } else if (view === 'system-logs') {
        window.location.href = 'system-logs.html';
    }
}

// Update current time
function updateCurrentTime() {
    const currentTimeElement = document.getElementById('currentTime');
    if (currentTimeElement) {
        const now = new Date();
        currentTimeElement.textContent = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    }
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