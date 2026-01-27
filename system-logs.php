<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>System Logs | Attendance System</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="dashboard.css">
    <link rel="stylesheet" href="system-logs.css">
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
                        <h1 id="pageTitle">System Logs</h1>
                        <p class="page-subtitle" id="pageSubtitle">Monitor and track all system activities and events</p>
                    </div>
                    <div class="header-actions-right">
                        <button class="btn-icon" id="refreshData">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="btn-primary" id="exportLogsBtn">
                            <i class="fas fa-download"></i> Export Logs
                        </button>
                    </div>
                </div>
                
                <!-- System Logs Content -->
                <div class="logs-container">
                    <!-- Stats Overview -->
                    <div class="stats-grid logs-stats">
                        <div class="stat-card gradient-primary">
                            <div class="stat-content">
                                <div class="stat-icon-wrapper">
                                    <i class="fas fa-list"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value" id="totalLogs">0</div>
                                    <div class="stat-label">Total Logs</div>
                                </div>
                            </div>
                            <div class="stat-footer">
                                <a href="#" class="stat-link">View all <i class="fas fa-arrow-right"></i></a>
                            </div>
                        </div>
                        
                        <div class="stat-card gradient-success">
                            <div class="stat-content">
                                <div class="stat-icon-wrapper">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value" id="successLogs">0</div>
                                    <div class="stat-label">Success Events</div>
                                </div>
                            </div>
                            <div class="stat-footer">
                                <a href="#" class="stat-link">View all <i class="fas fa-arrow-right"></i></a>
                            </div>
                        </div>
                        
                        <div class="stat-card gradient-warning">
                            <div class="stat-content">
                                <div class="stat-icon-wrapper">
                                    <i class="fas fa-exclamation-triangle"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value" id="warningLogs">0</div>
                                    <div class="stat-label">Warning Events</div>
                                </div>
                            </div>
                            <div class="stat-footer">
                                <a href="#" class="stat-link">View all <i class="fas fa-arrow-right"></i></a>
                            </div>
                        </div>
                        
                        <div class="stat-card gradient-info">
                            <div class="stat-content">
                                <div class="stat-icon-wrapper">
                                    <i class="fas fa-exclamation-circle"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value" id="errorLogs">0</div>
                                    <div class="stat-label">Error Events</div>
                                </div>
                            </div>
                            <div class="stat-footer">
                                <a href="#" class="stat-link">Details <i class="fas fa-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>

                    <!-- Filters Section -->
                    <div class="logs-section">
                        <div class="section-header">
                            <h2 class="section-title"><i class="fas fa-filter"></i> Filter Logs</h2>
                        </div>

                        <div class="logs-filters">
                            <div class="filter-group">
                                <label for="logLevel" class="filter-label">Log Level</label>
                                <select id="logLevel" class="filter-select">
                                    <option value="">All Levels</option>
                                    <option value="info">Info</option>
                                    <option value="success">Success</option>
                                    <option value="warning">Warning</option>
                                    <option value="error">Error</option>
                                </select>
                            </div>

                            <div class="filter-group">
                                <label for="logAction" class="filter-label">Action Type</label>
                                <select id="logAction" class="filter-select">
                                    <option value="">All Actions</option>
                                    <option value="login">Login</option>
                                    <option value="logout">Logout</option>
                                    <option value="create">Create</option>
                                    <option value="update">Update</option>
                                    <option value="delete">Delete</option>
                                    <option value="export">Export</option>
                                </select>
                            </div>

                            <div class="filter-group">
                                <label for="logUser" class="filter-label">User</label>
                                <input type="text" id="logUser" class="filter-input" placeholder="Search by user...">
                            </div>

                            <div class="filter-group">
                                <label for="logDateFrom" class="filter-label">From Date</label>
                                <input type="date" id="logDateFrom" class="filter-input">
                            </div>

                            <div class="filter-group">
                                <label for="logDateTo" class="filter-label">To Date</label>
                                <input type="date" id="logDateTo" class="filter-input">
                            </div>

                            <div class="filter-group">
                                <label for="logSearch" class="filter-label">Search</label>
                                <input type="text" id="logSearch" class="filter-input" placeholder="Search logs...">
                            </div>
                        </div>

                        <div class="filter-actions">
                            <button class="btn-secondary" id="filterBtn">
                                <i class="fas fa-filter"></i> Apply Filters
                            </button>
                            <button class="btn-secondary" id="clearFilterBtn">
                                <i class="fas fa-times"></i> Clear Filters
                            </button>
                        </div>
                    </div>

                    <!-- Logs Table -->
                    <div class="logs-section">
                        <div class="section-header">
                            <h2 class="section-title"><i class="fas fa-list-ul"></i> System Logs</h2>
                            <button class="btn-icon-sm" id="clearAllLogs">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>

                        <div class="logs-table-wrapper">
                            <table class="logs-table">
                                <thead>
                                    <tr>
                                        <th>Timestamp</th>
                                        <th>Level</th>
                                        <th>User</th>
                                        <th>Action</th>
                                        <th>Module</th>
                                        <th>Message</th>
                                        <th>IP Address</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="logsTableBody">
                                    <tr class="empty-state">
                                        <td colspan="8">
                                            <div class="empty-content">
                                                <i class="fas fa-inbox"></i>
                                                <p>No logs found. System is running smoothly!</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="pagination">
                            <button class="pagination-btn" id="prevPage"><i class="fas fa-chevron-left"></i></button>
                            <div class="pagination-info">
                                <span id="pageInfo">Page 1 of 1</span>
                            </div>
                            <button class="pagination-btn" id="nextPage"><i class="fas fa-chevron-right"></i></button>
                        </div>
                    </div>

                    <!-- Log Details Modal -->
                    <div class="logs-section">
                        <div class="section-header">
                            <h2 class="section-title"><i class="fas fa-eye"></i> Recent Activity</h2>
                        </div>

                        <div class="activity-timeline" id="activityTimeline">
                            <!-- Timeline items will be inserted here -->
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- Log Details Modal -->
    <div class="modal" id="logDetailsModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Log Details</h2>
                <button class="modal-close" id="closeModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body" id="modalBody">
                <!-- Details will be inserted here -->
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" id="closeModalBtn">Close</button>
            </div>
        </div>
    </div>

    <script src="system-logs.js"></script>
</body>
</html>
