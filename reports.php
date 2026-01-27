<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reports & Exports | Attendance System</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="dashboard.css">
    <link rel="stylesheet" href="reports.css">
</head>
<body>
<?php
session_start();

if (!isset($_SESSION['admin'])) {
    header('Location: landingpage.php');
    exit;
}
?>

    <div id="dashboard" class="dashboard-container">
        <?php include 'components/header.php'; ?>

        <div class="dashboard-layout">
            <?php include 'components/sidebar.php'; ?>

            <!-- Main Content Area -->
            <main class="main-content" id="mainContent">
                <div class="content-header">
                    <div class="header-content">
                        <h1 id="pageTitle">Reports & Exports</h1>
                        <p class="page-subtitle" id="pageSubtitle">Generate and download attendance reports in various formats</p>
                    </div>
                    <div class="header-actions-right">
                        <button class="btn-icon" id="refreshData">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="btn-primary" id="generateReportBtn">
                            <i class="fas fa-download"></i> Generate Report
                        </button>
                    </div>
                </div>
                
                <!-- Reports Content -->
                <div class="reports-container">
                    <!-- Stats Overview -->
                    <div class="stats-grid reports-stats">
                        <div class="stat-card gradient-primary">
                            <div class="stat-content">
                                <div class="stat-icon-wrapper">
                                    <i class="fas fa-file-csv"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value" id="csvCount">0</div>
                                    <div class="stat-label">CSV Exports</div>
                                </div>
                            </div>
                            <div class="stat-footer">
                                <a href="#" class="stat-link">View all <i class="fas fa-arrow-right"></i></a>
                            </div>
                        </div>
                        
                        <div class="stat-card gradient-success">
                            <div class="stat-content">
                                <div class="stat-icon-wrapper">
                                    <i class="fas fa-file-pdf"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value" id="pdfCount">0</div>
                                    <div class="stat-label">PDF Reports</div>
                                </div>
                            </div>
                            <div class="stat-footer">
                                <a href="#" class="stat-link">View all <i class="fas fa-arrow-right"></i></a>
                            </div>
                        </div>
                        
                        <div class="stat-card gradient-warning">
                            <div class="stat-content">
                                <div class="stat-icon-wrapper">
                                    <i class="fas fa-calendar-alt"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value" id="totalRecords">0</div>
                                    <div class="stat-label">Total Records</div>
                                </div>
                            </div>
                            <div class="stat-footer">
                                <a href="#" class="stat-link">Details <i class="fas fa-arrow-right"></i></a>
                            </div>
                        </div>
                        
                        <div class="stat-card gradient-info">
                            <div class="stat-content">
                                <div class="stat-icon-wrapper">
                                    <i class="fas fa-database"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value" id="storageUsed">0 MB</div>
                                    <div class="stat-label">Storage Used</div>
                                </div>
                            </div>
                            <div class="stat-footer">
                                <a href="#" class="stat-link">Manage <i class="fas fa-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>

                    <!-- Export Options Section -->
                    <div class="reports-section">
                        <div class="section-header">
                            <h2 class="section-title"><i class="fas fa-download"></i> Export Options</h2>
                            <p class="section-subtitle">Select format and date range for your report</p>
                        </div>

                        <div class="export-filters">
                            <div class="filter-group">
                                <label for="reportType" class="filter-label">Report Type</label>
                                <select id="reportType" class="filter-select">
                                    <option value="attendance">Attendance Summary</option>
                                    <option value="attendance-detail">Attendance Detail</option>
                                    <option value="late-arrivals">Late Arrivals</option>
                                    <option value="absent-employees">Absent Employees</option>
                                    <option value="employee-summary">Employee Summary</option>
                                </select>
                            </div>

                            <div class="filter-group">
                                <label for="dateFrom" class="filter-label">From Date</label>
                                <input type="date" id="dateFrom" class="filter-input">
                            </div>

                            <div class="filter-group">
                                <label for="dateTo" class="filter-label">To Date</label>
                                <input type="date" id="dateTo" class="filter-input">
                            </div>

                            <div class="filter-group">
                                <label for="department" class="filter-label">Department</label>
                                <select id="department" class="filter-select">
                                    <option value="">All Departments</option>
                                    <option value="it">IT</option>
                                    <option value="hr">HR</option>
                                    <option value="sales">Sales</option>
                                    <option value="marketing">Marketing</option>
                                </select>
                            </div>
                        </div>

                        <div class="export-buttons">
                            <button class="btn-export csv" id="exportCSV">
                                <i class="fas fa-file-csv"></i>
                                <span>Export as CSV</span>
                            </button>
                            <button class="btn-export pdf" id="exportPDF">
                                <i class="fas fa-file-pdf"></i>
                                <span>Export as PDF</span>
                            </button>
                            <button class="btn-export excel" id="exportExcel">
                                <i class="fas fa-file-excel"></i>
                                <span>Export as Excel</span>
                            </button>
                            <button class="btn-export print" id="printReport">
                                <i class="fas fa-print"></i>
                                <span>Print Report</span>
                            </button>
                        </div>
                    </div>

                    <!-- Recent Exports Section -->
                    <div class="reports-section">
                        <div class="section-header">
                            <h2 class="section-title"><i class="fas fa-history"></i> Recent Exports</h2>
                            <button class="btn-icon-sm" id="clearHistory">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>

                        <div class="exports-table-wrapper">
                            <table class="exports-table">
                                <thead>
                                    <tr>
                                        <th>Report Name</th>
                                        <th>Type</th>
                                        <th>Format</th>
                                        <th>Date Range</th>
                                        <th>Generated</th>
                                        <th>Size</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="exportsTableBody">
                                    <tr class="empty-state">
                                        <td colspan="7">
                                            <div class="empty-content">
                                                <i class="fas fa-inbox"></i>
                                                <p>No exports yet. Generate your first report above!</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Report Preview Section -->
                    <div class="reports-section">
                        <div class="section-header">
                            <h2 class="section-title"><i class="fas fa-eye"></i> Report Preview</h2>
                        </div>

                        <div class="preview-container">
                            <div class="preview-controls">
                                <button class="preview-btn active" data-preview="attendance">
                                    <i class="fas fa-table"></i> Attendance
                                </button>
                                <button class="preview-btn" data-preview="summary">
                                    <i class="fas fa-chart-bar"></i> Summary
                                </button>
                                <button class="preview-btn" data-preview="charts">
                                    <i class="fas fa-chart-pie"></i> Charts
                                </button>
                            </div>

                            <div class="preview-content">
                                <div id="attendancePreview" class="preview-pane active">
                                    <table class="preview-table">
                                        <thead>
                                            <tr>
                                                <th>Employee Name</th>
                                                <th>Check In</th>
                                                <th>Check Out</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>John Doe</td>
                                                <td>08:30 AM</td>
                                                <td>05:00 PM</td>
                                                <td><span class="status-badge on-time">On Time</span></td>
                                            </tr>
                                            <tr>
                                                <td>Jane Smith</td>
                                                <td>09:15 AM</td>
                                                <td>05:30 PM</td>
                                                <td><span class="status-badge late">Late</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div id="summaryPreview" class="preview-pane">
                                    <div class="summary-stats">
                                        <div class="summary-stat">
                                            <span class="summary-label">Total Present</span>
                                            <span class="summary-value">85</span>
                                        </div>
                                        <div class="summary-stat">
                                            <span class="summary-label">Late Arrivals</span>
                                            <span class="summary-value">12</span>
                                        </div>
                                        <div class="summary-stat">
                                            <span class="summary-label">Absent</span>
                                            <span class="summary-value">3</span>
                                        </div>
                                        <div class="summary-stat">
                                            <span class="summary-label">Attendance Rate</span>
                                            <span class="summary-value">96.5%</span>
                                        </div>
                                    </div>
                                </div>

                                <div id="chartsPreview" class="preview-pane">
                                    <div class="charts-placeholder">
                                        <i class="fas fa-chart-pie"></i>
                                        <p>Chart visualization will appear here</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script src="reports.js"></script>
</body>
</html>
