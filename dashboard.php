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
 
    <<div id="dashboard" class="dashboard-container">
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
                    <div class="header-actions-right">
                        <button class="btn-icon" id="refreshData">
                            <i class="fas fa-sync-alt"></i>
                            <span>Refresh</span>
                        </button>
                        <button class="btn-primary" id="quickAction">
                            <i class="fas fa-plus"></i>
                            <span>New Action</span>
                        </button>
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
                <!-- QR Section -->
                <div class="content-card large">
                    <div class="card-header">
                        <div class="card-header-content">
                            <h3 class="card-title">QR Code Management</h3>
                            <p class="card-subtitle">Current session token and controls</p>
                        </div>
                        <!-- <div class="card-header-actions">
                            <button class="btn-icon-sm" id="generateQRBtn">
                                <i class="fas fa-plus"></i>
                                <span>Generate New</span>
                            </button>
                        </div> -->
                    </div>
                    <div class="card-body">
                        <div class="qr-section">
                            <div class="qr-display-container">
                                <div class="qr-display" id="qrDisplay">
                                    <div class="qr-placeholder">
                                        <div class="qr-code" id="qrcode"></div>
                                        <div class="qr-overlay">
                                            <div class="qr-overlay-content">
                                                <i class="fas fa-qrcode"></i>
                                                <p>Scan to check-in</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="qr-details">
                                        <div class="qr-detail-item">
                                            <span class="detail-label">Token ID:</span>
                                            <span class="detail-value" id="qrTokenDisplay">XYZ-789-ABC-123</span>
                                        </div>
                                        <div class="qr-detail-item">
                                            <span class="detail-label">Location:</span>
                                            <span class="detail-value">Poblacion Ward II, Minglanilla</span>
                                        </div>
                                        <div class="qr-detail-item">
                                            <span class="detail-label">Valid Until:</span>
                                            <span class="detail-value countdown" id="qrValidUntil">04:30 PM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="qr-controls">
                                <button class="btn-secondary" id="downloadQRBtn">
                                    <i class="fas fa-download"></i>
                                    <span>Download QR</span>
                                </button>
                                <button class="btn-secondary" id="fullscreenQRBtn">
                                    <i class="fas fa-expand"></i>
                                    <span>Fullscreen</span>
                                </button>
                                <button class="btn-primary" id="shareQRBtn">
                                    <i class="fas fa-share-alt"></i>
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="content-card">
                    <div class="card-header">
                        <div class="card-header-content">
                            <h3 class="card-title">Recent Attendance</h3>
                            <p class="card-subtitle">Last 10 check-ins</p>
                        </div>
                        <button class="btn-icon-sm" id="viewAllAttendanceBtn">
                            View All
                        </button>
                    </div>
                    <div class="card-body">
                        <table class="attendance-table">
                            <thead>
                                <tr>
                                    <th>Employee</th>
                                    <th>Check-in Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="table-employee">
                                            <div class="employee-avatar">
                                                <i class="fas fa-user"></i>
                                            </div>
                                            <span>Cristian Lyle Dejan</span>
                                        </div>
                                    </td>
                                    <td>8:05 AM</td>
                                    <td><span class="status-badge on-time">On Time</span></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="table-employee">
                                            <div class="employee-avatar">
                                                <i class="fas fa-user"></i>
                                            </div>
                                            <span>Irish Revira</span>
                                        </div>
                                    </td>
                                    <td>8:15 AM</td>
                                    <td><span class="status-badge late">Late</span></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="table-employee">
                                            <div class="employee-avatar">
                                                <i class="fas fa-user"></i>
                                            </div>
                                            <span>Shaira Tolentino</span>
                                        </div>
                                    </td>
                                    <td>7:55 AM</td>
                                    <td><span class="status-badge on-time">On Time</span></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="table-employee">
                                            <div class="employee-avatar">
                                                <i class="fas fa-user"></i>
                                            </div>
                                            <span>Cristian Lyle Dejan</span>
                                        </div>
                                    </td>
                                    <td>8:05 AM</td>
                                    <td><span class="status-badge on-time">On Time</span></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="table-employee">
                                            <div class="employee-avatar">
                                                <i class="fas fa-user"></i>
                                            </div>
                                            <span>Irish Revira</span>
                                        </div>
                                    </td>
                                    <td>8:15 AM</td>
                                    <td><span class="status-badge late">Late</span></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="table-employee">
                                            <div class="employee-avatar">
                                                <i class="fas fa-user"></i>
                                            </div>
                                            <span>Shaira Tolentino</span>
                                        </div>
                                    </td>
                                    <td>7:55 AM</td>
                                    <td><span class="status-badge on-time">On Time</span></td>
                                </tr>
                                
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Quick Stats -->
                <!-- <div class="content-card">
                    <div class="card-header">
                        <h3 class="card-title">Today's Stats</h3>
                    </div>
                    <div class="card-body">
                        <div class="stats-mini">
                            <div class="stat-mini">
                                <div class="stat-mini-icon present">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <div class="stat-mini-info">
                                    <span class="stat-mini-value">45</span>
                                    <span class="stat-mini-label">Present</span>
                                </div>
                            </div>
                            <div class="stat-mini">
                                <div class="stat-mini-icon absent">
                                    <i class="fas fa-times-circle"></i>
                                </div>
                                <div class="stat-mini-info">
                                    <span class="stat-mini-value">5</span>
                                    <span class="stat-mini-label">Absent</span>
                                </div>
                            </div>
                            <div class="stat-mini">
                                <div class="stat-mini-icon late">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div class="stat-mini-info">
                                    <span class="stat-mini-value">3</span>
                                    <span class="stat-mini-label">Late</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                Quick Actions
                <div class="content-card">
                    <div class="card-header">
                        <h3 class="card-title">Quick Actions</h3>
                    </div>
                    <div class="card-body">
                        <div class="quick-actions-grid">
                            <button class="quick-action" data-action="generate-qr">
                                <div class="quick-action-icon">
                                    <i class="fas fa-qrcode"></i>
                                </div>
                                <span class="quick-action-text">Generate QR</span>
                            </button>
                            <button class="quick-action" data-action="add-employee">
                                <div class="quick-action-icon">
                                    <i class="fas fa-user-plus"></i>
                                </div>
                                <span class="quick-action-text">Add Employee</span>
                            </button>
                            <button class="quick-action" data-action="daily-report">
                                <div class="quick-action-icon">
                                    <i class="fas fa-file-pdf"></i>
                                </div>
                                <span class="quick-action-text">Daily Report</span>
                            </button>
                            <button class="quick-action" data-action="system-check">
                                <div class="quick-action-icon">
                                    <i class="fas fa-shield-alt"></i>
                                </div>
                                <span class="quick-action-text">System Check</span>
                            </button>
                            <button class="quick-action" data-action="notifications">
                                <div class="quick-action-icon">
                                    <i class="fas fa-bell"></i>
                                </div>
                                <span class="quick-action-text">Notifications</span>
                            </button>
                            <button class="quick-action" data-action="settings">
                                <div class="quick-action-icon">
                                    <i class="fas fa-cog"></i>
                                </div>
                                <span class="quick-action-text">Settings</span>
                            </button>
                        </div>
                    </div>
                </div> -->
            </div>
        </div>
    </template>

    <script src="dashboard.js"></script>
</body>
</html>