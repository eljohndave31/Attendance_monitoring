<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Attendance Monitor</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="attendance.css">
</head>
<body>

    <<div id="dashboard" class="dashboard-container">
        <?php include 'components/header.php'; ?>

        <div class="dashboard-layout">
            <?php include 'components/sidebar.php'; ?>

            <!-- Main Content Area -->
            <main class="main-content" id="mainContent">
                <div class="content-header">
                    <div class="header-content">
                        <h1 id="pageTitle">Attendance Monitor</h1>
                        <p class="page-subtitle" id="pageSubtitle">Real-time attendance tracking and monitoring</p>
                    </div>
                </div>
                
                <!-- Views will be loaded here -->
                <div class="content-view" id="contentView"></div>
            </main>
        </div>
    </div>

    <template id="attendanceMonitorView">
        <div class="attendance-monitor-view">
           <!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card gradient-primary" data-status="present">
                    <div class="stat-content">
                        <div class="stat-icon-wrapper">
                            <i class="fas fa-user-check"></i>
                        </div>
                        <div class="stat-info">
                            <h3 class="stat-value">45</h3>
                            <p class="stat-label">Present Today</p>
                            <div class="stat-trend positive">
                                <i class="fas fa-arrow-up"></i>
                                <span id="presentCount">12% from yesterday</span>
                            </div>
                        </div>
                    </div>
                    <div class="stat-footer">
                        <a href="#" class="stat-link">View list <i class="fas fa-arrow-right"></i></a>
                     </div>
                </div>
                
                <div class="stat-card gradient-success" data-status="on-time">
                    <div class="stat-content">
                        <div class="stat-icon-wrapper">
                            <i class="fas fa-qrcode"></i>
                        </div>
                        <div class="stat-info">
                            <h3 class="stat-value" id="activeQRToken">18</h3>
                            <p class="stat-label">On Time</p>
                            <div class="stat-countdown">
                                <i class="fas fa-clock"></i>
                                <!-- <span id="qrExpiryCountdown">04:30</span> -->
                            </div>
                        </div>
                    </div>
                    <div class="stat-footer">
                        <a href="#" class="stat-link">View list <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
                
                <div class="stat-card gradient-warning" data-status="late">
                    <div class="stat-content">
                        <div class="stat-icon-wrapper">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-info">
                            <h3 class="stat-value">3</h3>
                            <p class="stat-label">Late Arrivals</p>
                            <div class="stat-trend negative">
                                <i class="fas fa-arrow-down"></i>
                                <span>2% from yesterday</span>
                            </div>
                        </div>
                    </div>
                    <div class="stat-footer">
                        <a href="#" class="stat-link">View list <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>

                <div class="stat-card gradient-danger" data-status="absent">
                    <div class="stat-content">
                        <div class="stat-icon-wrapper">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-info">
                            <h3 class="stat-value">12</h3>
                            <p class="stat-label">Absent</p>
                            <div class="stat-trend positive">
                                <i class="fas fa-arrow-up"></i>
                                <span>3 new this week</span>
                            </div>
                        </div>
                    </div>
                    <div class="stat-footer">
                        <a href="#" class="stat-link">View list <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>

            <!-- Stats Details Panel -->
            <div class="card stats-details-card" id="statsDetailsPanel" style="display: none;">
                <div class="card-header">
                    <h3 id="detailsTitle">Present Today</h3>
                    <button class="close-details" id="closeDetails">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="card-body">
                    <div class="employees-list-header">
                        <div>Employee</div>
                        <div>Department</div>
                        <div>Check-in</div>
                        <div>Status</div>
                    </div>
                    <div id="employeesList">
                        <!-- Employees will be populated here -->
                    </div>
                </div>
            </div>

            <!-- Filters and Controls -->
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-filter"></i> Filter & Search</h3>
                </div>
                <div class="card-body">
                    <div class="filter-controls">
                        <div class="filter-group">
                            <label for="filterDate">Date</label>
                            <input type="date" id="filterDate" class="form-control">
                        </div>
                        
                        <div class="filter-group">
                            <label for="filterStatus">Status</label>
                            <select id="filterStatus" class="form-control">
                                <option value="">All Status</option>
                                <option value="present">Present</option>
                                <option value="late">Late</option>
                                <option value="absent">Absent</option>
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label for="filterDepartment">Department</label>
                            <select id="filterDepartment" class="form-control">
                                <option value="">All Departments</option>
                                <option value="admin">Administration</option>
                                <option value="it">IT</option>
                                <option value="hr">Human Resources</option>
                                <option value="sales">Sales</option>
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label for="searchEmployee">Search Name</label>
                            <input type="text" id="searchEmployee" class="form-control" placeholder="Search employee...">
                        </div>
                        
                        <div class="filter-actions">
                            <button class="btn-primary" id="applyFilters">
                                <i class="fas fa-filter"></i> Apply
                            </button>
                            <button class="btn-secondary" id="resetFilters">
                                <i class="fas fa-redo"></i> Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Real-time Attendance Table -->
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-list"></i> Live Attendance Records</h3>
                    <div class="header-actions">
                        <button class="btn-sm" id="exportBtn">
                            <i class="fas fa-download"></i> Export
                        </button>
                        <button class="btn-sm" id="refreshBtn">
                            <i class="fas fa-sync-alt"></i> Refresh
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Check-in</th>
                                    <th>Check-out</th>
                                    <th>Status</th>
                                    <th>Duration</th>
                                </tr>
                            </thead>
                            <tbody id="attendanceTableBody">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div class="pagination-container">
                <button class="btn-pagination" id="prevPage">
                    <i class="fas fa-chevron-left"></i> Previous
                </button>
                <span class="page-info" id="pageInfo">Page 1 of 1</span>
                <button class="btn-pagination" id="nextPage">
                    Next <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    </template>

    <script src="attendance.js"></script>
</body>
</html>
