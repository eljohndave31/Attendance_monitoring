let qrState = {
    currentToken: null,
    expiryTime: null,
    refreshInterval: null,
    qrInstance: null,
    isGenerating: true,
    location: 'office_main',
    serverTimeDiff: 0,
    lastStatusChange: null,
    statusDebounceDelay: 500, // milliseconds
    countdownInterval: null,
    wasExpired: false
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadQRGeneratorView();
    setupEventListeners();
    initializeTimeUpdates();
    loadQRHistory();
});

function setupEventListeners() {
    // Sidebar navigation
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
    // Use server timezone for consistency
    const now = new Date();
    
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
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

function createLiveQRCode() {
    const container = document.getElementById('liveQRCode');
    if (!container) return;

    const expiryMinutes = parseInt(document.getElementById('qrExpiry')?.value || '5');
    const locationId = document.getElementById('qrLocation')?.value || 'office_main';

    // Call PHP backend to generate QR code
    fetch('./api/generate-qr.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            expiry_minutes: expiryMinutes,
            location_id: locationId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            qrState.currentToken = data.token;
            
            // Parse ISO 8601 date correctly (UTC with Z suffix)
            try {
                qrState.expiryTime = new Date(data.expires_at);
                if (isNaN(qrState.expiryTime.getTime())) {
                    throw new Error('Invalid expiry date');
                }
            } catch (e) {
                console.error('Error parsing expiry date:', data.expires_at, e);
                qrState.expiryTime = new Date(Date.now() + expiryMinutes * 60000);
            }
            
            qrState.currentPayload = data;
            qrState.lastStatusChange = Date.now();

            container.innerHTML = '';
            try {
                qrState.qrInstance = new QRCode(container, {
                    text: data.qr_data,
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
            loadQRHistory();
        } else {
            console.error('Error from backend:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
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
        if (qrState.currentPayload && qrState.currentPayload.generated_at) {
            try {
                const date = new Date(qrState.currentPayload.generated_at);
                
                if (isNaN(date.getTime())) {
                    generated.textContent = '--';
                } else {
                    generated.textContent = date.toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                    });
                }
            } catch (e) {
                console.error('Error parsing generated date:', e);
                generated.textContent = '--';
            }
        } else {
            generated.textContent = '--';
        }
    }

    if (expiry && qrState.expiryTime) {
        updateCountdown(expiry, qrState.expiryTime);
    }
}

function updateCountdown(element, expiryTime) {
    // Clear any existing countdown interval
    if (qrState.countdownInterval) {
        clearInterval(qrState.countdownInterval);
        qrState.countdownInterval = null;
    }
    
    const update = () => {
        const now = new Date();
        const diff = expiryTime - now;
        const timeSinceLastChange = Date.now() - (qrState.lastStatusChange || 0);
        const isExpired = diff <= 0;
        
        // Handle expiration with debounce
        if (isExpired && !qrState.wasExpired) {
            if (timeSinceLastChange > qrState.statusDebounceDelay) {
                element.textContent = '00:00';
                element.classList.add('expired');
                updateQRStatus('Expired');
                qrState.wasExpired = true;
                qrState.lastStatusChange = Date.now();
                loadQRHistory();
            }
            return;
        } 
        
        // Handle reactivation (if somehow timer went back)
        if (!isExpired && qrState.wasExpired) {
            if (timeSinceLastChange > qrState.statusDebounceDelay) {
                element.classList.remove('expired');
                updateQRStatus('Active');
                qrState.wasExpired = false;
                qrState.lastStatusChange = Date.now();
            }
        }

        // Update countdown display if not expired
        if (diff > 0) {
            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            element.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            
            // Ensure Active status is shown
            if (!qrState.wasExpired && !element.classList.contains('expired')) {
                element.classList.remove('expired');
            }
        }
    };

    update();
    qrState.countdownInterval = setInterval(() => {
        if (!qrState.isGenerating) {
            clearInterval(qrState.countdownInterval);
            qrState.countdownInterval = null;
            return;
        }
        update();
    }, 1000);
}

function updateQRStatus(status) {
    const statusBadge = document.getElementById('qrStatus');
    if (statusBadge) {
        statusBadge.textContent = status;
        statusBadge.classList.remove('active', 'expired');
        statusBadge.classList.add(status.toLowerCase());
    }
}

function loadQRHistory() {
    const historyBody = document.getElementById('qrHistory');
    if (!historyBody) return;
    
    // Fetch QR history from PHP backend
    fetch('./api/get-qr-history.php')
    .then(response => response.json())
    .then(data => {
        if (data.success && data.history) {
            historyBody.innerHTML = data.history.map(item => `
                <tr>
                    <td><code>${item.token}</code></td>
                    <td>${item.generated}</td>
                    <td>${item.expired}</td>
                    <td>${item.scans}</td>
                    <td><span class="badge-${item.status.toLowerCase()}">${item.status}</span></td>
                </tr>
            `).join('');
        }
    })
    .catch(error => console.error('Error loading history:', error));
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

