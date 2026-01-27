// Enhanced Dashboard JavaScript
class Dashboard {
    constructor() {
        this.initialize();
    }

    initialize() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadDashboardView();
            this.setupEventListeners();
            this.initializeTimeUpdates();
            this.initializeQRCode();
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
        }
    }

    setupEventListeners() {
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

        // Search button
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', this.openSearch);
        }

        // Notifications button
        const notificationsBtn = document.getElementById('notificationsBtn');
        if (notificationsBtn) {
            notificationsBtn.addEventListener('click', this.showNotifications);
        }
    }

    initializeDashboardEvents() {
        // Refresh data button
        const refreshDataBtn = document.getElementById('refreshData');
        if (refreshDataBtn) {
            refreshDataBtn.addEventListener('click', this.refreshDashboardData);
        }

        // Quick action buttons
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // QR code buttons
        const qrButtons = [
            { id: 'generateQRBtn', action: this.generateQRCode },
            { id: 'refreshQRBtn', action: this.refreshQRCode },
            { id: 'downloadQRBtn', action: this.downloadQRCode },
            { id: 'fullscreenQRBtn', action: this.fullscreenQRCode },
            { id: 'shareQRBtn', action: this.shareQRCode }
        ];

        qrButtons.forEach(({ id, action }) => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', action.bind(this));
        });

        // View all attendance
        const viewAllBtn = document.getElementById('viewAllAttendanceBtn');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', this.viewAllAttendance);
        }
    }

    


    initializeTimeUpdates() {
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
    }

    updateDateTime() {
        const now = new Date();
        
        // Update time
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            timeElement.textContent = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
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
        
    
        // Update QR countdown
        this.updateQRCountdown();
    }

    updateQRCountdown() {
        const countdownElement = document.getElementById('qrExpiryCountdown');
        const validUntilElement = document.getElementById('qrValidUntil');
        
        if (countdownElement || validUntilElement) {
            // Simulate countdown - in real app, this would be based on actual expiration
            const expiryTime = new Date();
            expiryTime.setMinutes(expiryTime.getMinutes() + 30); // 30 minutes from now
            
            if (countdownElement) {
                const diff = expiryTime - new Date();
                const minutes = Math.floor(diff / 60000);
                const seconds = Math.floor((diff % 60000) / 1000);
                countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
            
            if (validUntilElement) {
                validUntilElement.textContent = expiryTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });
            }
        }
    }

    initializeQRCode() {
        const qrContainer = document.getElementById('qrcode');
        if (qrContainer && typeof QRCode !== 'undefined') {
            // Generate a unique token for the QR code
            const token = `ATTENDANCE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            // Update token display
            const tokenDisplay = document.getElementById('qrTokenDisplay');
            const activeToken = document.getElementById('activeQRToken');
            
            if (tokenDisplay) tokenDisplay.textContent = token;
            if (activeToken) activeToken.textContent = token.split('-')[2];
            
            // Generate QR code
            new QRCode(qrContainer, {
                text: JSON.stringify({
                    token: token,
                    timestamp: new Date().toISOString(),
                    location: 'Poblacion Ward II, Minglanilla'
                }),
                width: 180,
                height: 180,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        }
    }

   
    generateQRCode() {
        this.showToast('Generating new QR code...', 'info');
        
        // Simulate generation delay
        setTimeout(() => {
            this.initializeQRCode();
            this.showToast('New QR code generated successfully', 'success');
        }, 1000);
    }

    refreshQRCode() {
        this.showToast('Refreshing QR token...', 'info');
        
        setTimeout(() => {
            const qrContainer = document.getElementById('qrcode');
            if (qrContainer) qrContainer.innerHTML = '';
            
            this.initializeQRCode();
            this.showToast('QR token refreshed', 'success');
        }, 800);
    }

    downloadQRCode() {
        const qrElement = document.querySelector('.qr-code canvas');
        if (qrElement) {
            const link = document.createElement('a');
            link.download = `attendance-qr-${Date.now()}.png`;
            link.href = qrElement.toDataURL('image/png');
            link.click();
            this.showToast('QR code downloaded', 'success');
        }
    }

    fullscreenQRCode() {
        const qrDisplay = document.querySelector('.qr-display');
        if (qrDisplay) {
            if (!document.fullscreenElement) {
                qrDisplay.requestFullscreen().catch(err => {
                    this.showToast('Failed to enter fullscreen', 'error');
                });
            } else {
                document.exitFullscreen();
            }
        }
    }

    shareQRCode() {
        if (navigator.share) {
            navigator.share({
                title: 'Attendance QR Code',
                text: 'Scan this QR code to check-in',
                url: window.location.href
            }).then(() => {
                this.showToast('QR code shared successfully', 'success');
            }).catch(() => {
                this.showToast('Share cancelled', 'info');
            });
        } else {
            // Fallback: copy to clipboard
            const token = document.getElementById('qrTokenDisplay')?.textContent;
            if (token) {
                navigator.clipboard.writeText(token).then(() => {
                    this.showToast('Token copied to clipboard', 'success');
                });
            }
        }
    }

    
   


    runSystemCheck() {
        this.showToast('Running system diagnostics...', 'info');
        
        setTimeout(() => {
            this.showToast('System check completed. All systems operational.', 'success');
        }, 1500);
    }

    refreshDashboardData() {
        this.showToast('Refreshing dashboard data...', 'info');
        
        // Simulate data refresh
        setTimeout(() => {
            this.updateDashboardStats();
            this.showToast('Dashboard updated successfully', 'success');
        }, 1000);
    }

    updateDashboardStats() {
        // Simulate updating stats with random data
        const stats = ['Present Today', 'Late Arrivals', 'Total Employees'];
        
        stats.forEach(stat => {
            const element = document.querySelector(`.stat-label:contains(${stat})`)?.previousElementSibling;
            if (element) {
                const currentValue = parseInt(element.textContent);
                const newValue = currentValue + Math.floor(Math.random() * 3) - 1;
                element.textContent = Math.max(1, newValue);
            }
        });
    }

    viewAllAttendance() {
        this.showToast('Loading attendance records...', 'info');
        // In real app, navigate to attendance page
    }

    openSearch() {
        this.showToast('Opening search...', 'info');
        // In real app, open search modal
    }

    showNotifications() {
        this.showToast('You have 3 unread notifications', 'info');
        // In real app, show notifications dropdown
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                this.showToast('Failed to enter fullscreen mode', 'error');
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
        
        // Close button
        welcomeToast.querySelector('.toast-close').addEventListener('click', () => {
            welcomeToast.classList.add('fade-out');
            setTimeout(() => welcomeToast.remove(), 300);
        });
    }
}

// Initialize dashboard
new Dashboard();

// Helper function to check if element contains text
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
            min-width: 280;
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
