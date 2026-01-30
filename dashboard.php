<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard | Attendance System</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="dashboard.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
</head>
<body>
<?php
session_start();

if (!isset($_SESSION['admin'])) {
    header('Location: landingpage.php');
    exit;
}

if (isset($_SESSION['login_success'])) {
    echo '<div class="login-success-toast">' . $_SESSION['login_success'] . '</div>';
    unset($_SESSION['login_success']);
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
                        <h1 id="pageTitle">Dashboard Overview</h1>
                        <p class="page-subtitle" id="pageSubtitle">Welcome back! Here's what's happening today.</p>
                    </div>
                </div>
                
                <!-- Views will be loaded here -->
                <div class="content-view" id="contentView"></div>
            </main>
        </div>
    </div>

    <!-- Dashboard View Template -->
    <template id="dashboardView">
        <div class="dashboard-view">
            <!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card gradient-primary">
                    <div class="stat-content">
                        <div class="stat-icon-wrapper">
                            <i class="fas fa-user-check"></i>
                        </div>
                        <div class="stat-info">
                            <h3 class="stat-value">45</h3>
                            <p class="stat-label">Present Today</p>
                            <div class="stat-trend positive">
                                <i class="fas fa-arrow-up"></i>
                                <span>12% from yesterday</span>
                            </div>
                        </div>
                    </div>
                    <div class="stat-footer">
                        <a href="#" class="stat-link">View details <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
                
                <div class="stat-card gradient-success">
                    <div class="stat-content">
                        <div class="stat-icon-wrapper">
                            <i class="fas fa-qrcode"></i>
                        </div>
                        <div class="stat-info">
                            <h3 class="stat-value" id="activeQRToken">XYZ-789</h3>
                            <p class="stat-label">Active QR Token</p>
                            <div class="stat-countdown">
                                <i class="fas fa-clock"></i>
                                <span id="qrExpiryCountdown">04:30</span>
                            </div>
                        </div>
                    </div>
                    <div class="stat-footer">
                        <button class="stat-action" id="refreshQRBtn">
                            <i class="fas fa-sync-alt"></i> Refresh Token
                        </button>
                    </div>
                </div>
                
                <div class="stat-card gradient-warning">
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
                
                <div class="stat-card gradient-info">
                    <div class="stat-content">
                        <div class="stat-icon-wrapper">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-info">
                            <h3 class="stat-value">127</h3>
                            <p class="stat-label">Total Employees</p>
                            <div class="stat-trend positive">
                                <i class="fas fa-arrow-up"></i>
                                <span>3 new this week</span>
                            </div>
                        </div>
                    </div>
                    <div class="stat-footer">
                        <a href="#" class="stat-link">Manage <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>

            <!-- Main Content Area -->
            <div class="content-grid">
                <!-- Expanded Recent Attendance Section (First) -->
                <div class="content-card large">
                    <div class="card-header">
                        <div class="card-header-content">
                            <h3 class="card-title">Recent Attendance</h3>
                            <p class="card-subtitle">Last 10 check-ins with detailed information</p>
                        </div>
                        <div class="attendance-header-actions">
                            <button class="btn-icon-sm" id="exportAttendanceBtn">
                                <i class="fas fa-download"></i> Export
                            </button>
                            <button class="btn-icon-sm btn-primary" id="viewAllAttendanceBtn">
                                <i class="fas fa-list"></i> View All
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <!-- Attendance Filters -->
                        <div class="attendance-filters">
                            <div class="filter-group">
                                <span class="filter-label">Filter by:</span>
                                <button class="filter-btn active">All</button>
                                <button class="filter-btn">On Time</button>
                                <button class="filter-btn">Late</button>
                                <button class="filter-btn">Today</button>
                            </div>

                        </div>
                        
                        <!-- Attendance Table -->
                        <div class="table-container">
                            <table class="attendance-table">
                                <thead>
                                    <tr>
                                        <th>Employee</th>
                                        <th>Department</th>
                                        <th>Check-in Time</th>
                                        <th>Check-out Time</th>
                                        <th>Status</th>
                                        <th>Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div class="table-employee">
                                                <div class="employee-avatar">
                                                    <i class="fas fa-user"></i>
                                                </div>
                                                <div class="employee-info">
                                                    <span class="employee-name">Cristian Lyle Dejan</span>
                                                    <span class="employee-id">EMP-001</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>IT Support </td>
                                        <td>
                                            <div class="time-cell">
                                                <span class="time-value">8:05 AM</span>
                                                <span class="time-date">Today</span>
                                            </div>
                                        </td>
                                        <td>--</td>
                                        <td><span class="status-badge on-time">On Time</span></td>
                                        <td>--</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="table-employee">
                                                <div class="employee-avatar">
                                                    <i class="fas fa-user"></i>
                                                </div>
                                                <div class="employee-info">
                                                    <span class="employee-name">Irish Revira</span>
                                                    <span class="employee-id">EMP-002</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>Marketing</td>
                                        <td>
                                            <div class="time-cell">
                                                <span class="time-value">8:15 AM</span>
                                                <span class="time-date">Today</span>
                                            </div>
                                        </td>
                                        <td>--</td>
                                        <td><span class="status-badge late">Late</span></td>
                                        <td>--</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="table-employee">
                                                <div class="employee-avatar">
                                                    <i class="fas fa-user"></i>
                                                </div>
                                                <div class="employee-info">
                                                    <span class="employee-name">Shaira Tolentino</span>
                                                    <span class="employee-id">EMP-003</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>Design</td>
                                        <td>
                                            <div class="time-cell">
                                                <span class="time-value">7:55 AM</span>
                                                <span class="time-date">Today</span>
                                            </div>
                                        </td>
                                        <td>--</td>
                                        <td><span class="status-badge on-time">On Time</span></td>
                                        <td>--</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="table-employee">
                                                <div class="employee-avatar">
                                                    <i class="fas fa-user"></i>
                                                </div>
                                                <div class="employee-info">
                                                    <span class="employee-name">John Smith</span>
                                                    <span class="employee-id">EMP-004</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>Sales</td>
                                        <td>
                                            <div class="time-cell">
                                                <span class="time-value">9:00 AM</span>
                                                <span class="time-date">Today</span>
                                            </div>
                                        </td>
                                        <td>--</td>
                                        <td><span class="status-badge late">Late</span></td>
                                        <td>--</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="table-employee">
                                                <div class="employee-avatar">
                                                    <i class="fas fa-user"></i>
                                                </div>
                                                <div class="employee-info">
                                                    <span class="employee-name">Maria Garcia</span>
                                                    <span class="employee-id">EMP-005</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>HR</td>
                                        <td>
                                            <div class="time-cell">
                                                <span class="time-value">8:00 AM</span>
                                                <span class="time-date">Today</span>
                                            </div>
                                        </td>
                                        <td>--</td>
                                        <td><span class="status-badge on-time">On Time</span></td>
                                        <td>--</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <!-- Table Summary -->
                        <div class="table-summary">
                            <div class="summary-item">
                                <span class="summary-label">Total Records:</span>
                                <span class="summary-value">10</span>
                            </div>
                            <div class="summary-item">
                                <span class="summary-label">On Time:</span>
                                <span class="summary-value positive">7</span>
                            </div>
                            <div class="summary-item">
                                <span class="summary-label">Late:</span>
                                <span class="summary-value negative">3</span>
                            </div>
                            <div class="summary-item">
                                <span class="summary-label">Avg. Check-in:</span>
                                <span class="summary-value">8:07 AM</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Enhanced QR Code Management Section (Second) -->
                <div class="content-card">
                    <div class="card-header">
                        <div class="card-header-content">
                            <h3 class="card-title">QR Code Management</h3>
                            <p class="card-subtitle">Current session token and controls</p>
                        </div>
                        <button class="btn-icon-sm" id="generateQRBtn">
                            <a href="qr-generator.php" style="text-decoration: none;"><i class="fas fa-plus-circle"></i> Generate QR</a>
                        </button>
                    </div>
                    <div class="card-body qr-management-body">
                        <!-- QR Status Indicator -->
                        <div class="qr-status-indicator">
                            <div class="qr-status-label">
                                <i class="fas fa-circle status-inactive"></i>
                                <span>No active QR code</span>
                            </div>
                            <p class="qr-status-message">Generate one from QR Generator or use the button above.</p>
                        </div>
                        
                        <!-- QR Display Area -->
                        <div class="qr-display-wrapper">
                            <div class="qr-display-container">
                                <div class="qr-code-display" id="qrDisplay">
                                    <div class="qr-placeholder">
                                        <div class="qr-code" id="qrcode"></div>
                                        <div class="qr-overlay" id="scanOverlay">
                                            <div class="qr-overlay-content">
                                                <i class="fas fa-qrcode"></i>
                                                <p>Scan to check-in</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="qr-token-info">
                                        <div class="qr-token-details">
                                            <div class="qr-detail-item">
                                                <div class="detail-label">
                                                    <i class="fas fa-hashtag"></i>
                                                    <span>Token ID:</span>
                                                </div>
                                                <span class="detail-value" id="qrTokenDisplay">b3a78154a4fd366ed5ba9ca69fa0cb52</span>
                                            </div>
                                            <div class="qr-detail-item">
                                                <div class="detail-label">
                                                    <i class="fas fa-map-marker-alt"></i>
                                                    <span>Location:</span>
                                                </div>
                                                <span class="detail-value" id="qrLocationDisplay">Poblacion Ward II, Minglanilla</span>
                                            </div>
                                            <div class="qr-detail-item">
                                                <div class="detail-label">
                                                    <i class="fas fa-clock"></i>
                                                    <span>Valid Until:</span>
                                                </div>
                                                <span class="detail-valid" id="qrValidUntil">09:30:09 PM</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>

    <script src="dashboard.js"></script>
</body>
</html>