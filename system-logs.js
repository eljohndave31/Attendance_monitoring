// System Logs JavaScript
class SystemLogsManager {
    constructor() {
        this.filteredLogs = [];
        this.currentPage = 1;
        this.logsPerPage = 15;
        this.initialize();
    }

    initialize() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.initializeTimeUpdates();
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
        document.getElementById('filterBtn')?.addEventListener('click', () => this.applyFilters());
        document.getElementById('clearFilterBtn')?.addEventListener('click', () => this.clearFilters());

        // Pagination
        document.getElementById('prevPage')?.addEventListener('click', () => this.previousPage());
        document.getElementById('nextPage')?.addEventListener('click', () => this.nextPage());

        // Export and actions
        document.getElementById('exportLogsBtn')?.addEventListener('click', () => this.exportLogs());
        document.getElementById('clearAllLogs')?.addEventListener('click', () => this.clearAllLogs());
        document.getElementById('refreshData')?.addEventListener('click', () => this.loadLogsTable());
        document.getElementById('fullscreenBtn')?.addEventListener('click', () => this.toggleFullscreen());

        // Modal
        document.getElementById('closeModal')?.addEventListener('click', () => this.closeModal());
        document.getElementById('logDetailsModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'logDetailsModal') this.closeModal();
        });
    }

    applyFilters() {
        const filters = {
            level: document.getElementById('logLevel').value,
            action: document.getElementById('logAction').value,
            user: document.getElementById('logUser').value,
            search: document.getElementById('logSearch').value,
            dateFrom: document.getElementById('logDateFrom').value,
            dateTo: document.getElementById('logDateTo').value
        };

        fetch('../api/get-logs.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(filters)
        })
        .then(res => res.json())
        .then(data => {
            this.filteredLogs = data.logs || [];
            this.currentPage = 1;
            this.loadLogsTable();
            this.showToast('Filters applied', 'success');
        });
    }

    clearFilters() {
        document.getElementById('logLevel').value = '';
        document.getElementById('logAction').value = '';
        document.getElementById('logUser').value = '';
        document.getElementById('logSearch').value = '';
        document.getElementById('logDateFrom').value = '';
        document.getElementById('logDateTo').value = '';
        this.loadLogsTable();
        this.showToast('Filters cleared', 'info');
    }

    loadLogsTable() {
        fetch(`../api/get-logs.php?page=${this.currentPage}&limit=${this.logsPerPage}`)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('logsTableBody');
            if (!tbody) return;

            if (!data.logs || data.logs.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8">No logs found</td></tr>';
                return;
            }

            tbody.innerHTML = data.logs.map(log => `
                <tr>
                    <td>${log.timestamp}</td>
                    <td><span class="log-level ${log.level}">${log.level.toUpperCase()}</span></td>
                    <td>${log.user}</td>
                    <td><span class="action-badge">${log.action}</span></td>
                    <td>${log.module}</td>
                    <td title="${log.message}">${this.truncate(log.message, 30)}</td>
                    <td><span class="ip-address">${log.ip}</span></td>
                    <td>
                        <button class="action-btn" data-log-id="${log.id}" data-action="view">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn delete" data-log-id="${log.id}" data-action="delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');

            this.attachLogActions();
            document.getElementById('pageInfo').textContent = `Page ${this.currentPage} of ${data.total_pages}`;
        });
    }

    attachLogActions() {
        document.querySelectorAll('[data-action="view"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const logId = btn.getAttribute('data-log-id');
                fetch(`../api/get-log-details.php?id=${logId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) this.viewLogDetails(data.log);
                });
            });
        });

        document.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const logId = btn.getAttribute('data-log-id');
                if (confirm('Delete this log?')) {
                    fetch(`../api/delete-log.php?id=${logId}`, { method: 'DELETE' })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            this.showToast('Log deleted', 'success');
                            this.loadLogsTable();
                        }
                    });
                }
            });
        });
    }

    viewLogDetails(log) {
        const modalBody = document.getElementById('modalBody');
        if (!modalBody) return;

        modalBody.innerHTML = `
            <div class="detail-item"><span class="detail-label">Timestamp:</span><span>${log.timestamp}</span></div>
            <div class="detail-item"><span class="detail-label">Level:</span><span class="log-level ${log.level}">${log.level}</span></div>
            <div class="detail-item"><span class="detail-label">User:</span><span>${log.user}</span></div>
            <div class="detail-item"><span class="detail-label">Action:</span><span>${log.action}</span></div>
            <div class="detail-item"><span class="detail-label">Module:</span><span>${log.module}</span></div>
            <div class="detail-item"><span class="detail-label">Message:</span><span>${log.message}</span></div>
            <div class="detail-item"><span class="detail-label">IP:</span><span>${log.ip}</span></div>
        `;
        document.getElementById('logDetailsModal')?.classList.add('show');
    }

    closeModal() {
        document.getElementById('logDetailsModal')?.classList.remove('show');
    }

    loadActivityTimeline() {
        fetch('../api/get-recent-activity.php')
        .then(res => res.json())
        .then(data => {
            const timeline = document.getElementById('activityTimeline');
            if (!timeline || !data.logs) return;

            timeline.innerHTML = data.logs.map(log => `
                <div class="timeline-item ${log.level}">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <span class="timeline-action">${log.action}</span>
                            <span class="timeline-user">by ${log.user}</span>
                        </div>
                        <div class="timeline-message">${log.message}</div>
                        <div class="timeline-meta">
                            <span>${log.timestamp}</span> | <span>${log.module}</span> | <span>${log.ip}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        });
    }

    exportLogs() {
        this.showToast('Exporting logs...', 'info');
        window.location.href = '../api/export-logs.php';
    }

    clearAllLogs() {
        if (confirm('Clear all logs? This cannot be undone.')) {
            fetch('../api/clear-all-logs.php', { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.showToast('Logs cleared', 'success');
                    this.loadLogsTable();
                }
            });
        }
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadLogsTable();
        }
    }

    nextPage() {
        this.currentPage++;
        this.loadLogsTable();
    }

    truncate(text, length) {
        return text.length > length ? text.substring(0, length) + '...' : text;
    }

    initializeTimeUpdates() {
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
    }

    updateDateTime() {
        const now = new Date();
        document.getElementById('currentTime')?.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        });
        document.getElementById('currentDate')?.textContent = now.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => console.error(err));
        } else {
            document.exitFullscreen();
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer') || this.createToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
        
        toast.innerHTML = `
            <i class="fas ${icons[type]}"></i>
            <span>${message}</span>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        `;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
        toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
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
        const container = this.createToastContainer();
        const toast = document.createElement('div');
        toast.className = 'toast toast-welcome';
        toast.innerHTML = `<i class="fas fa-history"></i> <p>Welcome to Attendify System Logs!</p>`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }

    injectToastStyles() {
        if (document.getElementById('toastStyles')) return;
        const style = document.createElement('style');
        style.id = 'toastStyles';
        style.innerHTML = `
            #toastContainer { position: fixed; top: 40px; right: 20px; z-index: 9999; }
            .toast { background: #fff; padding: 12px 16px; border-radius: 10px; box-shadow: 0 8px 20px rgba(0,0,0,0.15); 
                     display: flex; align-items: center; gap: 12px; margin-bottom: 12px; animation: slideIn 0.4s ease; }
            .toast-success { border-left: 4px solid #4CAF50; color: #4CAF50; }
            .toast-error { border-left: 4px solid #ef4444; color: #ef4444; }
            .toast-close { background: none; border: none; cursor: pointer; color: #999; }
            @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        `;
        document.head.appendChild(style);
    }
}

// Initialize System Logs Manager
const systemLogsManager = new SystemLogsManager();

// Helper function
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector;
}
