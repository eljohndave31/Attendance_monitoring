// Reports & Exports JavaScript
class ReportsManager {
    constructor() {
        this.exports = this.loadExports();
        this.initialize();
    }

    initialize() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.initializeTimeUpdates();
            this.loadStatsData();
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
                userMenu.classList.toggle('show');
            });
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (userMenu && !e.target.closest('.user-dropdown')) {
                userMenu.classList.remove('show');
            }
        });

        // Export buttons
        document.getElementById('exportCSV').addEventListener('click', () => this.exportAsCSV());
        document.getElementById('exportPDF').addEventListener('click', () => this.exportAsPDF());
        document.getElementById('exportExcel').addEventListener('click', () => this.exportAsExcel());
        document.getElementById('printReport').addEventListener('click', () => this.printReport());

        // Preview buttons
        document.querySelectorAll('.preview-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchPreview(e.target.closest('.preview-btn')));
        });

        // Generate report button
        const generateReportBtn = document.getElementById('generateReportBtn');
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', () => this.generateReport());
        }

        // Refresh data button
        const refreshDataBtn = document.getElementById('refreshData');
        if (refreshDataBtn) {
            refreshDataBtn.addEventListener('click', () => this.refreshData());
        }

        // Clear history button
        const clearHistoryBtn = document.getElementById('clearHistory');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => this.clearExportHistory());
        }

        // Fullscreen toggle
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', this.toggleFullscreen);
        }
    }

    loadStatsData() {
        // Simulate loading stats
        setTimeout(() => {
            document.getElementById('csvCount').textContent = '24';
            document.getElementById('pdfCount').textContent = '18';
            document.getElementById('totalRecords').textContent = '1,245';
            document.getElementById('storageUsed').textContent = '156 MB';
        }, 500);
    }

    loadExportsHistory() {
        const exportsTableBody = document.getElementById('exportsTableBody');
        
        if (this.exports.length === 0) {
            exportsTableBody.innerHTML = `
                <tr class="empty-state">
                    <td colspan="7">
                        <div class="empty-content">
                            <i class="fas fa-inbox"></i>
                            <p>No exports yet. Generate your first report above!</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        exportsTableBody.innerHTML = this.exports.map((exp, index) => `
            <tr>
                <td>
                    <strong>${exp.name}</strong>
                </td>
                <td>${exp.type}</td>
                <td>
                    <span class="format-badge ${exp.format.toLowerCase()}">
                        ${exp.format}
                    </span>
                </td>
                <td>${exp.dateRange}</td>
                <td><span class="timestamp">${exp.generated}</span></td>
                <td><span class="file-size">${exp.size}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn" title="Download" onclick="reportsManager.downloadExport(${index})">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="action-btn" title="Share" onclick="reportsManager.shareExport(${index})">
                            <i class="fas fa-share"></i>
                        </button>
                        <button class="action-btn delete" title="Delete" onclick="reportsManager.deleteExport(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    exportAsCSV() {
        const reportType = document.getElementById('reportType').value;
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;
        const department = document.getElementById('department').value;

        if (!dateFrom || !dateTo) {
            this.showToast('Please select both from and to dates', 'warning');
            return;
        }

        this.showToast('Generating CSV export...', 'info');

        setTimeout(() => {
            const fileName = this.generateFileName('CSV');
            const newExport = {
                name: fileName,
                type: this.formatType(reportType),
                format: 'CSV',
                dateRange: `${dateFrom} to ${dateTo}`,
                generated: new Date().toLocaleString(),
                size: this.generateRandomSize()
            };

            this.exports.unshift(newExport);
            this.saveExports();
            this.loadExportsHistory();
            this.showToast(`CSV report exported successfully: ${fileName}`, 'success');
        }, 1500);
    }

    exportAsPDF() {
        const reportType = document.getElementById('reportType').value;
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;

        if (!dateFrom || !dateTo) {
            this.showToast('Please select both from and to dates', 'warning');
            return;
        }

        this.showToast('Generating PDF export...', 'info');

        setTimeout(() => {
            const fileName = this.generateFileName('PDF');
            const newExport = {
                name: fileName,
                type: this.formatType(reportType),
                format: 'PDF',
                dateRange: `${dateFrom} to ${dateTo}`,
                generated: new Date().toLocaleString(),
                size: this.generateRandomSize()
            };

            this.exports.unshift(newExport);
            this.saveExports();
            this.loadExportsHistory();
            this.showToast(`PDF report exported successfully: ${fileName}`, 'success');
        }, 2000);
    }

    exportAsExcel() {
        const reportType = document.getElementById('reportType').value;
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;

        if (!dateFrom || !dateTo) {
            this.showToast('Please select both from and to dates', 'warning');
            return;
        }

        this.showToast('Generating Excel export...', 'info');

        setTimeout(() => {
            const fileName = this.generateFileName('XLSX');
            const newExport = {
                name: fileName,
                type: this.formatType(reportType),
                format: 'Excel',
                dateRange: `${dateFrom} to ${dateTo}`,
                generated: new Date().toLocaleString(),
                size: this.generateRandomSize()
            };

            this.exports.unshift(newExport);
            this.saveExports();
            this.loadExportsHistory();
            this.showToast(`Excel report exported successfully: ${fileName}`, 'success');
        }, 1800);
    }

    printReport() {
        this.showToast('Opening print dialog...', 'info');
        
        setTimeout(() => {
            window.print();
        }, 500);
    }

    downloadExport(index) {
        const exp = this.exports[index];
        this.showToast(`Downloading ${exp.name}...`, 'info');
        
        // Simulate download
        setTimeout(() => {
            this.showToast(`${exp.name} downloaded successfully`, 'success');
        }, 1000);
    }

    shareExport(index) {
        const exp = this.exports[index];
        
        if (navigator.share) {
            navigator.share({
                title: 'Attendance Report',
                text: `Check out this attendance report: ${exp.name}`,
                url: window.location.href
            }).catch(err => console.log('Share error:', err));
        } else {
            this.showToast('Sharing: ' + exp.name, 'info');
        }
    }

    deleteExport(index) {
        const exp = this.exports[index];
        
        if (confirm(`Are you sure you want to delete "${exp.name}"?`)) {
            this.exports.splice(index, 1);
            this.saveExports();
            this.loadExportsHistory();
            this.showToast('Export deleted successfully', 'success');
        }
    }

    generateReport() {
        const reportType = document.getElementById('reportType').value;
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;

        if (!dateFrom || !dateTo) {
            this.showToast('Please select both from and to dates', 'warning');
            return;
        }

        this.showToast('Generating report preview...', 'info');
        
        setTimeout(() => {
            this.showToast('Report generated successfully', 'success');
        }, 1000);
    }

    refreshData() {
        this.showToast('Refreshing data...', 'info');
        
        setTimeout(() => {
            this.loadStatsData();
            this.showToast('Data refreshed successfully', 'success');
        }, 1500);
    }

    clearExportHistory() {
        if (confirm('Are you sure you want to clear all export history? This action cannot be undone.')) {
            this.exports = [];
            this.saveExports();
            this.loadExportsHistory();
            this.showToast('Export history cleared', 'success');
        }
    }

    switchPreview(btn) {
        // Remove active class from all buttons
        document.querySelectorAll('.preview-btn').forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');

        // Get preview type
        const previewType = btn.dataset.preview;

        // Hide all preview panes
        document.querySelectorAll('.preview-pane').forEach(pane => pane.classList.remove('active'));

        // Show selected preview pane
        const paneId = previewType === 'attendance' ? 'attendancePreview' : 
                      previewType === 'summary' ? 'summaryPreview' : 'chartsPreview';
        
        const pane = document.getElementById(paneId);
        if (pane) {
            pane.classList.add('active');
        }
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

    formatType(type) {
        const typeMap = {
            'attendance': 'Attendance Summary',
            'attendance-detail': 'Attendance Detail',
            'late-arrivals': 'Late Arrivals',
            'absent-employees': 'Absent Employees',
            'employee-summary': 'Employee Summary'
        };
        return typeMap[type] || type;
    }

    generateFileName(format) {
        const date = new Date().toISOString().split('T')[0];
        const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
        return `Report_${date}_${time}.${this.getExtension(format)}`;
    }

    getExtension(format) {
        const extensions = {
            'CSV': 'csv',
            'PDF': 'pdf',
            'XLSX': 'xlsx'
        };
        return extensions[format] || format.toLowerCase();
    }

    generateRandomSize() {
        const size = Math.floor(Math.random() * 500) + 50;
        return size > 1024 ? `${(size / 1024).toFixed(2)} MB` : `${size} KB`;
    }

    saveExports() {
        localStorage.setItem('exports', JSON.stringify(this.exports));
    }

    loadExports() {
        const saved = localStorage.getItem('exports');
        return saved ? JSON.parse(saved) : [];
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
            if (toast.parentNode) {
                toast.remove();
            }
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
        this.injectToastStyles();
        const toastContainer = document.getElementById('toastContainer') || this.createToastContainer();
        
        const welcomeToast = document.createElement('div');
        welcomeToast.className = 'toast toast-welcome';
        welcomeToast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">
                    <i class="fas fa-file-alt"></i>
                </div>
                <div class="toast-message">
                    <p class="toast-title">Welcome to <span class="logo-main">Atten<span class="text-highlight">dify</span></span> Reports!</p>
                </div>
            </div>
        `;
        
        toastContainer.appendChild(welcomeToast);
        
        // Auto-remove after 5 seconds
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
                padding: 0;
                margin-left: 12px;
            }

            .toast-close:hover {
                color: #666;
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

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                alert(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
}

// Initialize Reports Manager
const reportsManager = new ReportsManager();

// Helper function
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector;
}
