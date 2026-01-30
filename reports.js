// Reports & Exports JavaScript
class ReportsManager {
    constructor() {
        this.initialize();
    }

    initialize() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.initializeTimeUpdates();
            this.loadExportsHistory();
            this.showWelcomeToast();
        });
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
            });
        }

        // User menu dropdown
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userMenu = document.getElementById('userMenu');
        if (userMenuBtn) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userMenu?.classList.toggle('show');
            });
        }

        document.addEventListener('click', (e) => {
            if (userMenu && !e.target.closest('.user-dropdown')) {
                userMenu.classList.remove('show');
            }
        });

        // Export buttons
        document.getElementById('exportCSV')?.addEventListener('click', () => this.handleExport('csv'));
        document.getElementById('exportPDF')?.addEventListener('click', () => this.handleExport('pdf'));
        document.getElementById('exportExcel')?.addEventListener('click', () => this.handleExport('excel'));
        document.getElementById('printReport')?.addEventListener('click', () => window.print());

        // Preview buttons
        document.querySelectorAll('.preview-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchPreview(e.target.closest('.preview-btn')));
        });

        // Action buttons
        document.getElementById('generateReportBtn')?.addEventListener('click', () => this.generateReport());
        document.getElementById('refreshData')?.addEventListener('click', () => this.refreshData());
        document.getElementById('clearHistory')?.addEventListener('click', () => this.clearExportHistory());
        document.getElementById('fullscreenBtn')?.addEventListener('click', () => this.toggleFullscreen());
    }

    handleExport(format) {
        const reportType = document.getElementById('reportType').value;
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;

        if (!dateFrom || !dateTo) {
            this.showToast('Please select both from and to dates', 'warning');
            return;
        }

        this.showToast(`Exporting ${format.toUpperCase()}...`, 'info');

        fetch('../api/export-report.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ report_type: reportType, date_from: dateFrom, date_to: dateTo, format: format })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                this.showToast(`${format.toUpperCase()} exported successfully`, 'success');
                this.loadExportsHistory();
            }
        })
        .catch(() => this.showToast('Export failed', 'error'));
    }

    loadExportsHistory() {
        const exportsTableBody = document.getElementById('exportsTableBody');
        if (!exportsTableBody) return;

        fetch('../api/get-exports.php')
        .then(res => res.json())
        .then(data => {
            if (!data.exports || data.exports.length === 0) {
                exportsTableBody.innerHTML = '<tr><td colspan="7"><p>No exports yet</p></td></tr>';
                return;
            }

            exportsTableBody.innerHTML = data.exports.map((exp, idx) => `
                <tr>
                    <td>${exp.name}</td>
                    <td>${exp.type}</td>
                    <td><span class="format-badge">${exp.format}</span></td>
                    <td>${exp.date_range}</td>
                    <td>${exp.generated}</td>
                    <td>${exp.size}</td>
                    <td>
                        <button class="action-btn" data-export-id="${exp.id}" data-action="download">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="action-btn delete" data-export-id="${exp.id}" data-action="delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');

            this.attachExportActions();
        });
    }

    attachExportActions() {
        document.querySelectorAll('[data-action="download"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const exportId = btn.getAttribute('data-export-id');
                window.location.href = `../api/download-export.php?id=${exportId}`;
            });
        });

        document.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const exportId = btn.getAttribute('data-export-id');
                if (confirm('Delete this export?')) {
                    fetch(`../api/delete-export.php?id=${exportId}`, { method: 'DELETE' })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            this.showToast('Export deleted', 'success');
                            this.loadExportsHistory();
                        }
                    });
                }
            });
        });
    }

    switchPreview(btn) {
        document.querySelectorAll('.preview-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const previewType = btn.dataset.preview;
        document.querySelectorAll('.preview-pane').forEach(pane => pane.classList.remove('active'));

        const paneId = previewType === 'attendance' ? 'attendancePreview' : 
                      previewType === 'summary' ? 'summaryPreview' : 'chartsPreview';
        document.getElementById(paneId)?.classList.add('active');
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

    generateReport() {
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;
        if (!dateFrom || !dateTo) {
            this.showToast('Please select dates', 'warning');
            return;
        }
        this.showToast('Generating report...', 'info');
    }

    refreshData() {
        this.showToast('Refreshing...', 'info');
        this.loadExportsHistory();
    }

    clearExportHistory() {
        if (confirm('Clear all export history?')) {
            fetch('../api/clear-exports.php', { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.showToast('History cleared', 'success');
                    this.loadExportsHistory();
                }
            });
        }
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
            <i class="fas ${icons[type] || 'fa-info-circle'}"></i>
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
        toast.innerHTML = `<i class="fas fa-file-alt"></i> <p>Welcome to Attendify Reports!</p>`;
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
            .toast-warning { border-left: 4px solid #f59e0b; color: #f59e0b; }
            .toast-info { border-left: 4px solid #3b82f6; color: #3b82f6; }
            .toast-close { background: none; border: none; cursor: pointer; color: #999; }
            @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        `;
        document.head.appendChild(style);
    }
}

const reportsManager = new ReportsManager();

// Helper function
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector;
}
