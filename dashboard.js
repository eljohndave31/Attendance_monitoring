// Enhanced Dashboard JavaScript
class Dashboard {
    constructor() {
        this.qrState = {
            currentToken: null,
            expiryTime: null,
            qrInstance: null,
            countdownInterval: null,
            locationMap: {
                'office_main': 'Poblacion Ward II, Minglanilla',
                'office_second': 'Staca Tunghaan Minglanilla',
                'office_branch': 'Upper Pakigne Minglanilla',
                'remote': 'Remote Location'
            }
        };
        this.initialize();
    }

    initialize() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadDashboardView();
            this.setupEventListeners();
            this.initializeTimeUpdates();
            this.initializeDashboardEvents();
            this.showWelcomeToast();
        });
    }

    loadDashboardView() {
        const template = document.getElementById('dashboardView');
        const contentView = document.getElementById('contentView');
        
        if (template && contentView) {
            const clone = template.content.cloneNode(true);
            contentView.innerHTML = '';
            contentView.appendChild(clone);
            
            // Initialize dashboard-specific event listeners
            this.initializeDashboardEvents();
            
            // Load QR code after view is loaded
            setTimeout(() => {
                this.loadQRCode();
            }, 100);
        }
    }

    setupEventListeners() {
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
            
            if (!e.target.closest('.header-btn')) {
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.classList.remove('show');
                });
            }
        });

        // Fullscreen toggle
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', this.toggleFullscreen);
        }
    }

    initializeDashboardEvents() {
        // Refresh data button
        const refreshDataBtn = document.getElementById('refreshData');
        if (refreshDataBtn) {
            refreshDataBtn.addEventListener('click', () => this.refreshDashboardData());
        }

        // Quick action buttons
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // View all attendance
        const viewAllBtn = document.getElementById('viewAllAttendanceBtn');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => this.viewAllAttendance());
        }

        // QR Code Management buttons
        const refreshQRBtn = document.getElementById('refreshQRBtn');
        if (refreshQRBtn) {
            refreshQRBtn.addEventListener('click', () => this.loadQRCode());
        }

        const downloadQRBtn = document.getElementById('downloadQRBtn');
        if (downloadQRBtn) {
            downloadQRBtn.addEventListener('click', () => this.downloadQRCode());
        }

        const fullscreenQRBtn = document.getElementById('fullscreenQRBtn');
        if (fullscreenQRBtn) {
            fullscreenQRBtn.addEventListener('click', () => this.fullscreenQRCode());
        }

        const shareQRBtn = document.getElementById('shareQRBtn');
        if (shareQRBtn) {
            shareQRBtn.addEventListener('click', () => this.shareQRCode());
        }
    }

    initializeTimeUpdates() {
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
    }

    updateDateTime() {
        // Use simple Date object
        const now = new Date();
        
        // Update time
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
        
        // Update time period (AM/PM)
        const timePeriodElement = document.getElementById('timePeriod');
        if (timePeriodElement) {
            const period = now.getHours() >= 12 ? 'PM' : 'AM';
            timePeriodElement.textContent = period;
        }
        
        // Update date
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            dateElement.textContent = now.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
    }

    refreshDashboardData() {
        // Delegate to backend - implement in your PHP
    }

    updateDashboardStats(data) {
        // Update stats from backend data
        if (data.stats) {
            Object.keys(data.stats).forEach(key => {
                const element = document.querySelector(`[data-stat="${key}"]`);
                if (element) {
                    element.textContent = data.stats[key];
                }
            });
        }
    }

    viewAllAttendance() {
        // Delegate to backend - implement in your PHP
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error('Fullscreen error:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    showLoading() {
        const contentView = document.getElementById('contentView');
        if (contentView) {
            contentView.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Loading...</p>
                </div>
            `;
        }
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer') || this.createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        toast.innerHTML = `
            <i class="fas ${icons[type] || 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            toast.remove();
        }, 5000);
        
        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
    }

    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    showWelcomeToast() {
        injectToastStyles();
        const toastContainer = document.getElementById('toastContainer') || this.createToastContainer();
        
        const welcomeToast = document.createElement('div');
        welcomeToast.className = 'toast toast-welcome';
        welcomeToast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">
                    <i class="fas fa-smile"></i>
                </div>
                <div class="toast-message">
                    <p class="toast-title">Welcome to <span class="logo-main">Atten<span class="text-highlight">dify</span></span> Dashboard!</p>
                </div>
            </div>
        `;
        
        toastContainer.appendChild(welcomeToast);
        
        // Auto-remove after 6 seconds
        setTimeout(() => {
            welcomeToast.classList.add('fade-out');
            setTimeout(() => welcomeToast.remove(), 200);
        }, 5000);
    }

    // QR Code Management Functions
    async loadQRCode() {
        const qrContainer = document.getElementById('qrcode');
        const tokenDisplay = document.getElementById('qrTokenDisplay');
        const validUntilDisplay = document.getElementById('qrValidUntil');
        const activeQRToken = document.getElementById('activeQRToken');
        const qrExpiryCountdown = document.getElementById('qrExpiryCountdown');
        const qrStatusIndicator = document.querySelector('.qr-status-indicator');

        if (!qrContainer) return;

        try {
            const response = await fetch('./api/get-dashboard-qr.php');
            const data = await response.json();

            if (data.success && data.qr_data) {
                // Clear existing QR code
                qrContainer.innerHTML = '';

                // Create new QR code
                try {
                    this.qrState.qrInstance = new QRCode(qrContainer, {
                        text: data.qr_data,
                        width: 200,
                        height: 200,
                        colorDark: '#000000',
                        colorLight: '#ffffff',
                        correctLevel: QRCode.CorrectLevel.H
                    });

                    // Update token display
                    this.qrState.currentToken = data.token;
                    if (tokenDisplay) {
                        tokenDisplay.textContent = data.token;
                    }
                    if (activeQRToken) {
                        activeQRToken.textContent = data.token.substring(0, 7) + '...';
                    }

                    // Store timezone for date formatting
                    this.qrState.serverTimezone = data.timezone || 'Asia/Manila';
                    
                    // Parse the ISO 8601 date string from the API (UTC with Z suffix)
                    this.qrState.expiryTime = new Date(data.expires_at);
                    
                    // Use pre-formatted display time from API (already in Manila timezone)
                    if (validUntilDisplay && data.expires_at_display) {
                        validUntilDisplay.textContent = data.expires_at_display;
                    }
                    
                    this.startQRCountdown(validUntilDisplay, qrExpiryCountdown);

                    // Update location if available
                    const locationElement = document.getElementById('qrLocationDisplay');
                    if (locationElement && data.location_id) {
                        const locationText = this.qrState.locationMap[data.location_id] || data.location_id;
                        locationElement.textContent = locationText;
                    }

                    // Update stat card token
                    if (activeQRToken) {
                        activeQRToken.textContent = data.token.substring(0, 7) + '...';
                    }

                    // Hide the "No active QR code" indicator
                    if (qrStatusIndicator) {
                        qrStatusIndicator.style.display = 'none';
                    }

                } catch (error) {
                    console.error('Error creating QR code:', error);
                    qrContainer.innerHTML = '<p style="color: red;">Error generating QR code</p>';
                }
            } else {
                // No active QR code found
                qrContainer.innerHTML = '<p style="color: #999; padding: 20px;">No active QR code. Generate one from QR Generator.</p>';
                if (tokenDisplay) tokenDisplay.textContent = '--';
                if (validUntilDisplay) validUntilDisplay.textContent = '--';
                if (activeQRToken) activeQRToken.textContent = '--';
                if (qrExpiryCountdown) qrExpiryCountdown.textContent = '--';
                
                // Show the "No active QR code" indicator
                if (qrStatusIndicator) {
                    qrStatusIndicator.style.display = 'block';
                }
            }
        } catch (error) {
            console.error('Error loading QR code:', error);
            qrContainer.innerHTML = '<p style="color: red;">Error loading QR code</p>';
        }
    }

    startQRCountdown(validUntilElement, countdownElement) {
        // Clear existing interval
        if (this.qrState.countdownInterval) {
            clearInterval(this.qrState.countdownInterval);
        }

        const updateCountdown = () => {
            if (!this.qrState.expiryTime) return;

            const now = new Date();
            const diff = this.qrState.expiryTime - now;

            if (diff <= 0) {
                if (validUntilElement) {
                    validUntilElement.textContent = 'Expired';
                    validUntilElement.classList.add('expired');
                }
                if (countdownElement) {
                    countdownElement.textContent = '00:00';
                }
                clearInterval(this.qrState.countdownInterval);
                return;
            }

            // Format time remaining
            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            // Format expiry time using server timezone
            const expiryDate = new Date(this.qrState.expiryTime);
            const timeZone = this.qrState.serverTimezone || 'Asia/Manila';
            const expiryString = expiryDate.toLocaleTimeString('en-US', {
                timeZone: 'Asia/Manila',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });

            if (validUntilElement) {
                validUntilElement.textContent = expiryString;
                validUntilElement.classList.remove('expired');
            }
            if (countdownElement) {
                countdownElement.textContent = timeString;
            }
        };

        // Update immediately
        updateCountdown();

        // Update every second
        this.qrState.countdownInterval = setInterval(updateCountdown, 1000);
    }

    downloadQRCode() {
        const qrCanvas = document.querySelector('#qrcode canvas');
        if (qrCanvas) {
            const link = document.createElement('a');
            link.href = qrCanvas.toDataURL('image/png');
            link.download = `qr-${this.qrState.currentToken || 'code'}.png`;
            link.click();
            this.showToast('QR code downloaded successfully', 'success');
        } else {
            this.showToast('No QR code available to download', 'error');
        }
    }

    fullscreenQRCode() {
        const qrDisplay = document.getElementById('qrDisplay');
        if (qrDisplay) {
            if (!document.fullscreenElement) {
                qrDisplay.requestFullscreen().catch(err => {
                    console.error('Fullscreen error:', err);
                    this.showToast('Unable to enter fullscreen', 'error');
                });
            } else {
                document.exitFullscreen();
            }
        }
    }

    async shareQRCode() {
        const qrCanvas = document.querySelector('#qrcode canvas');
        if (!qrCanvas) {
            this.showToast('No QR code available to share', 'error');
            return;
        }

        try {
            // Convert canvas to blob
            qrCanvas.toBlob(async (blob) => {
                const file = new File([blob], `qr-${this.qrState.currentToken || 'code'}.png`, { type: 'image/png' });
                
                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            title: 'QR Code',
                            text: `QR Code Token: ${this.qrState.currentToken}`,
                            files: [file]
                        });
                        this.showToast('QR code shared successfully', 'success');
                    } catch (error) {
                        if (error.name !== 'AbortError') {
                            console.error('Share error:', error);
                            this.fallbackShareQRCode(qrCanvas);
                        }
                    }
                } else {
                    this.fallbackShareQRCode(qrCanvas);
                }
            }, 'image/png');
        } catch (error) {
            console.error('Share error:', error);
            this.fallbackShareQRCode(qrCanvas);
        }
    }

    fallbackShareQRCode(qrCanvas) {
        // Fallback: copy to clipboard or show download
        const dataURL = qrCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `qr-${this.qrState.currentToken || 'code'}.png`;
        link.click();
        this.showToast('QR code download started (sharing not supported)', 'info');
    }
}

// Initialize dashboard
new Dashboard();

if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector;
}

function injectToastStyles() {
    if (document.getElementById('toastStyles')) return;

    const style = document.createElement('style');
    style.id = 'toastStyles';
    style.innerHTML = `
        #toastContainer {
            position: fixed;
            top: 40px;
            right: 20px;
            z-index: 9999;
        }

        .toast {
            background: #ffffff;
            color: #4CAF50;
            min-width: 280px;
            padding: 12px;
            border-radius: 10px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
            animation: slideIn 0.4s ease;
        }

        .toast-welcome {
            border-left: 5px solid #4CAF50;
        }

        .toast-content {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .toast-icon {
            font-size: 16px;
            color: #4CAF50;
        }

        .toast-title {
            font-size: 14px;
            margin: 0;
        }

        .toast-close {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            color: #999;
        }

        .logo-main {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
            letter-spacing: -0.025em;
        }

        .text-highlight {
            color: var(--primary-blue);
            font-weight: 700;
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;

    document.head.appendChild(style);
}

// Scanner integration
document.addEventListener('DOMContentLoaded', function() {
    // Open scanner when clicking on "Scan to check-in"
    const scanOverlay = document.getElementById('scanOverlay');
    
    if (scanOverlay) {
        scanOverlay.addEventListener('click', function() {
            openScanner();
        });
    }
});

function openScanner() {
    // Option 1: Open scanner in a modal window
    const scannerWindow = window.open('scanner.php', 'scanner', 'width=600,height=700,resizable=yes');
    
    if (!scannerWindow) {
        alert('Please allow popups to open the scanner');
    }
    
    // Option 2: If you want to handle the response from scanner
    // Listen for messages from scanner window
    window.addEventListener('message', function(event) {
        if (event.data.type === 'qrScanned') {
            console.log('QR Code scanned:', event.data.qrCode);
            // Handle the scanned QR code
            updateDashboardWithQR(event.data.qrCode);
            scannerWindow.close();
        }
    });
}

function updateDashboardWithQR(qrCode) {
    console.log('Processing QR code:', qrCode);
    // Add logic here
}
