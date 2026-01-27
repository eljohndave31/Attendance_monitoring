// System Logs JavaScript
class SystemLogsManager {
    constructor() {
        this.logs = this.generateSampleLogs();
        this.filteredLogs = [...this.logs];
        this.currentPage = 1;
        this.logsPerPage = 15;
        this.initialize();
    }

    initialize() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.initializeTimeUpdates();
            this.loadStatsData();
            this.loadLogsTable();
            this.loadActivityTimeline();
            this.showWelcomeToast();
        });
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
            if (userMenu && !e.target.closest('.user-dropdown')) {
                userMenu.classList.remove('show');
            }
        });

        // Filter buttons
        document.getElementById('filterBtn').addEventListener('click', () => this.applyFilters());
        document.getElementById('clearFilterBtn').addEventListener('click', () => this.clearFilters());

        // Pagination
        document.getElementById('prevPage').addEventListener('click', () => this.previousPage());
        document.getElementById('nextPage').addEventListener('click', () => this.nextPage());

        // Export logs
        document.getElementById('exportLogsBtn').addEventListener('click', () => this.exportLogs());

        // Clear logs
        document.getElementById('clearAllLogs').addEventListener('click', () => this.clearAllLogs());

        // Refresh data
        document.getElementById('refreshData').addEventListener('click', () => this.refreshData());

        // Modal close
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('closeModalBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('logDetailsModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('logDetailsModal')) {
                this.closeModal();
            }
        });

        // Fullscreen toggle
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', this.toggleFullscreen);
        }
    }

    generateSampleLogs() {
        const actions = ['Login', 'Logout', 'Create', 'Update', 'Delete', 'Export', 'View'];
        const modules = ['Authentication', 'Employee', 'Attendance', 'Reports', 'System'];
        const users = ['Admin', 'Manager1', 'Manager2', 'User1', 'User2'];
        const levels = ['info', 'success', 'warning', 'error'];
        const messages = [
            'User successfully logged in',
            'Attendance record updated',
            'Employee record created',
            'Report exported successfully',
            'System backup completed',
            'Configuration changed',
            'QR code generated',
            'Access denied - insufficient permissions'
        ];

        const logs = [];
        for (let i = 0; i < 50; i++) {
            const now = new Date();
            const logDate = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);

            logs.push({
                id: i + 1,
                timestamp: logDate.toLocaleString(),
                level: levels[Math.floor(Math.random() * levels.length)],
                user: users[Math.floor(Math.random() * users.length)],
                action: actions[Math.floor(Math.random() * actions.length)],
                module: modules[Math.floor(Math.random() * modules.length)],
                message: messages[Math.floor(Math.random() * messages.length)],
                ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                details: {
                    duration: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) + 'ms' : 'N/A',
                    status: 'Completed',
                    affectedRecords: Math.floor(Math.random() * 100)
                }
            });
        }

        return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    loadStatsData() {
        const totalLogs = this.logs.length;
        const successLogs = this.logs.filter(l => l.level === 'success').length;
        const warningLogs = this.logs.filter(l => l.level === 'warning').length;
        const errorLogs = this.logs.filter(l => l.level === 'error').length;

        document.getElementById('totalLogs').textContent = totalLogs;
        document.getElementById('successLogs').textContent = successLogs;
        document.getElementById('warningLogs').textContent = warningLogs;
        document.getElementById('errorLogs').textContent = errorLogs;
    }

    applyFilters() {
        const level = document.getElementById('logLevel').value;
        const action = document.getElementById('logAction').value;
        const user = document.getElementById('logUser').value.toLowerCase();
        const search = document.getElementById('logSearch').value.toLowerCase();
        const dateFrom = document.getElementById('logDateFrom').value;
        const dateTo = document.getElementById('logDateTo').value;

        this.filteredLogs = this.logs.filter(log => {
            const matchLevel = !level || log.level === level;
            const matchAction = !action || log.action.toLowerCase().includes(action.toLowerCase());
            const matchUser = !user || log.user.toLowerCase().includes(user);
            const matchSearch = !search || log.message.toLowerCase().includes(search) || log.module.toLowerCase().includes(search);

            let matchDateFrom = true;
            let matchDateTo = true;

            if (dateFrom) {
                matchDateFrom = new Date(log.timestamp) >= new Date(dateFrom);
            }

            if (dateTo) {
                matchDateTo = new Date(log.timestamp) <= new Date(dateTo + 'T23:59:59');
            }

            return matchLevel && matchAction && matchUser && matchSearch && matchDateFrom && matchDateTo;
        });

        this.currentPage = 1;
        this.loadLogsTable();
        this.showToast('Filters applied successfully', 'success');
    }

    clearFilters() {
        document.getElementById('logLevel').value = '';
        document.getElementById('logAction').value = '';
        document.getElementById('logUser').value = '';
        document.getElementById('logSearch').value = '';
        document.getElementById('logDateFrom').value = '';
        document.getElementById('logDateTo').value = '';

        this.filteredLogs = [...this.logs];
        this.currentPage = 1;
        this.loadLogsTable();
        this.showToast('Filters cleared', 'info');
    }

    loadLogsTable() {
        const logsTableBody = document.getElementById('logsTableBody');
        const startIndex = (this.currentPage - 1) * this.logsPerPage;
        const endIndex = startIndex + this.logsPerPage;
        const paginatedLogs = this.filteredLogs.slice(startIndex, endIndex);

        if (paginatedLogs.length === 0) {
            logsTableBody.innerHTML = `
                <tr class="empty-state">
                    <td colspan="8">
                        <div class="empty-content">
                            <i class="fas fa-inbox"></i>
                            <p>No logs found matching your filters.</p>
                        </div>
                    </td>
                </tr>
            `;
            this.updatePaginationInfo();
            return;
        }

        logsTableBody.innerHTML = paginatedLogs.map(log => `
            <tr>
                <td><span class="log-timestamp">${log.timestamp}</span></td>
                <td><span class="log-level ${log.level}">${log.level.charAt(0).toUpperCase() + log.level.slice(1)}</span></td>
                <td>${log.user}</td>
                <td><span class="action-badge">${log.action}</span></td>
                <td>${log.module}</td>
                <td title="${log.message}">${this.truncate(log.message, 30)}</td>
                <td><span class="ip-address">${log.ip}</span></td>
                <td>
                    <div class="log-actions">
                        <button class="action-btn" title="View Details" onclick="systemLogsManager.viewLogDetails(${log.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn delete" title="Delete" onclick="systemLogsManager.deleteLog(${log.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.updatePaginationInfo();
    }

    loadActivityTimeline() {
        const timeline = document.getElementById('activityTimeline');
        const recentLogs = this.logs.slice(0, 10);

        timeline.innerHTML = recentLogs.map(log => `
            <div class="timeline-item ${log.level}">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <span class="timeline-action">${log.action}</span>
                        <span class="timeline-user">by ${log.user}</span>
                    </div>
                    <div class="timeline-message">${log.message}</div>
                    <div class="timeline-meta">
                        <span><i class="fas fa-calendar"></i> ${log.timestamp}</span>
                        <span><i class="fas fa-cube"></i> ${log.module}</span>
                        <span><i class="fas fa-network-wired"></i> ${log.ip}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    viewLogDetails(logId) {
        const log = this.logs.find(l => l.id === logId);
        if (!log) return;

        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="detail-item">
                <span class="detail-label">Timestamp:</span>
                <span class="detail-value">${log.timestamp}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Level:</span>
                <span class="detail-value"><span class="log-level ${log.level}">${log.level.toUpperCase()}</span></span>
            </div>
            <div class="detail-item">
                <span class="detail-label">User:</span>
                <span class="detail-value">${log.user}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Action:</span>
                <span class="detail-value">${log.action}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Module:</span>
                <span class="detail-value">${log.module}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Message:</span>
                <span class="detail-value">${log.message}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">IP Address:</span>
                <span class="detail-value">${log.ip}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">${log.details.duration}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Affected Records:</span>
                <span class="detail-value">${log.details.affectedRecords}</span>
            </div>
        `;

        document.getElementById('logDetailsModal').classList.add('show');
    }

    closeModal() {
        document.getElementById('logDetailsModal').classList.remove('show');
    }

    deleteLog(logId) {
        if (confirm('Are you sure you want to delete this log entry?')) {
            this.logs = this.logs.filter(l => l.id !== logId);
            this.filteredLogs = this.filteredLogs.filter(l => l.id !== logId);
            this.loadLogsTable();
            this.loadActivityTimeline();
            this.loadStatsData();
            this.showToast('Log deleted successfully', 'success');
        }
    }

    clearAllLogs() {
        if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
            this.logs = [];
            this.filteredLogs = [];
            this.currentPage = 1;
            this.loadLogsTable();
            this.loadActivityTimeline();
            this.loadStatsData();
            this.showToast('All logs cleared', 'success');
        }
    }

    exportLogs() {
        this.showToast('Exporting logs...', 'info');

        setTimeout(() => {
            const csv = this.convertToCSV(this.filteredLogs);
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `system-logs-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            this.showToast('Logs exported successfully', 'success');
        }, 1000);
    }

    convertToCSV(logs) {
        const headers = ['Timestamp', 'Level', 'User', 'Action', 'Module', 'Message', 'IP Address'];
        const csvHeaders = headers.join(',');
        const csvRows = logs.map(log => [
            log.timestamp,
            log.level,
            log.user,
            log.action,
            log.module,
            `"${log.message}"`,
            log.ip
        ].join(','));

        return [csvHeaders, ...csvRows].join('\n');
    }

    refreshData() {
        this.showToast('Refreshing logs...', 'info');

        setTimeout(() => {
            this.loadStatsData();
            this.loadLogsTable();
            this.loadActivityTimeline();
            this.showToast('Logs refreshed successfully', 'success');
        }, 1000);
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadLogsTable();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredLogs.length / this.logsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.loadLogsTable();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    updatePaginationInfo() {
        const totalPages = Math.ceil(this.filteredLogs.length / this.logsPerPage);
        document.getElementById('pageInfo').textContent = `Page ${this.currentPage} of ${totalPages}`;

        document.getElementById('prevPage').disabled = this.currentPage <= 1;
        document.getElementById('nextPage').disabled = this.currentPage >= totalPages;
    }

    initializeTimeUpdates() {
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
    }

    updateDateTime() {
        const now = new Date();
        
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            timeElement.textContent = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
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

    truncate(text, length) {
        return text.length > length ? text.substring(0, length) + '...' : text;
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
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
        
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
        this.injectToastStyles();
        const toastContainer = document.getElementById('toastContainer') || this.createToastContainer();
        
        const welcomeToast = document.createElement('div');
        welcomeToast.className = 'toast toast-welcome';
        welcomeToast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">
                    <i class="fas fa-history"></i>
                </div>
                <div class="toast-message">
                    <p class="toast-title">Welcome to <span class="logo-main">Atten<span class="text-highlight">dify</span></span> System Logs!</p>
                </div>
            </div>
        `;
        
        toastContainer.appendChild(welcomeToast);
        
        setTimeout(() => {
            if (welcomeToast.parentNode) {
                welcomeToast.remove();
            }
        }, 5000);
    }

    injectToastStyles() {
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
                padding: 12px 16px;
                border-radius: 10px;
                box-shadow: 0 8px 20px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 12px;
                animation: slideIn 0.4s ease;
                border-left: 4px solid #4CAF50;
            }

            .toast-success {
                border-left-color: #4CAF50;
                color: #4CAF50;
            }

            .toast-error {
                border-left-color: #ef4444;
                color: #ef4444;
            }

            .toast-warning {
                border-left-color: #f59e0b;
                color: #f59e0b;
            }

            .toast-info {
                border-left-color: #3b82f6;
                color: #3b82f6;
            }

            .toast-welcome {
                border-left: 5px solid #4CAF50;
            }

            .toast-close {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 16px;
                color: #999;
                padding: 0;
                margin-left: 12px;
            }

            .toast-close:hover {
                color: #666;
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

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                alert(`Error: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
}

// Initialize System Logs Manager
const systemLogsManager = new SystemLogsManager();

// Helper function
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector;
}
