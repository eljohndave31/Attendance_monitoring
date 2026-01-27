<?php
// Get current page filename to highlight active menu
$currentPage = basename($_SERVER['PHP_SELF']);
?>
<nav class="sidebar" id="sidebar">
    <div class="sidebar-header">
        <h3 class="sidebar-title">Navigation</h3>
    </div>
    
    <ul class="nav-menu">
        <li class="nav-item <?php echo ($currentPage == 'dashboard.php') ? 'active' : ''; ?>" data-view="dashboard">
            <a href="dashboard.php" class="nav-link">
                <i class="nav-icon fas fa-tachometer-alt"></i>
                <span class="nav-text">Dashboard</span>
            </a>
        </li>
        <li class="nav-item <?php echo ($currentPage == 'qr-generator.php') ? 'active' : ''; ?>" data-view="qr-generator">
            <a href="qr-generator.php" class="nav-link">
                <i class="nav-icon fas fa-qrcode"></i>
                <span class="nav-text">QR Generator</span>
            </a>
        </li>
        <li class="nav-item <?php echo ($currentPage == 'employee-management.php') ? 'active' : ''; ?>" data-view="employee-management">
            <a href="employee-management.php" class="nav-link">
                <i class="nav-icon fas fa-users"></i>
                <span class="nav-text">Employees</span>
                <span class="nav-badge new">New</span>
            </a>
        </li>
        <li class="nav-item <?php echo ($currentPage == 'attendance.php') ? 'active' : ''; ?>" data-view="attendance-monitor">
            <a href="attendance.php" class="nav-link">
                <i class="nav-icon fas fa-clipboard-check"></i>
                <span class="nav-text">Attendance Monitor</span>
            </a>
        </li>
        <li class="nav-item <?php echo ($currentPage == 'reports.php') ? 'active' : ''; ?>" data-view="reports">
            <a href="reports.php" class="nav-link">
                <i class="nav-icon fas fa-chart-bar"></i>
                <span class="nav-text">Reports</span>
            </a>
        </li>
        <li class="nav-item <?php echo ($currentPage == 'system-logs.php') ? 'active' : ''; ?>" data-view="system-logs">
            <a href="system-logs.php" class="nav-link">
                <i class="nav-icon fas fa-list-check"></i>
                <span class="nav-text">System Logs</span>
            </a>
        </li>
        
        <div class="menu-divider">
            <span>System</span>
        </div>
        
        <li class="nav-item <?php echo ($currentPage == 'settings.php') ? 'active' : ''; ?>" data-view="settings">
            <a href="settings.php" class="nav-link">
                <i class="nav-icon fas fa-cog"></i>
                <span class="nav-text">Settings</span>
            </a>
        </li>
        <li class="nav-item <?php echo ($currentPage == 'help.php') ? 'active' : ''; ?>" data-view="help">
            <a href="help.php" class="nav-link">
                <i class="nav-icon fas fa-circle-question"></i>
                <span class="nav-text">Help Center</span>
            </a>
        </li>
    </ul>
    
    <div class="sidebar-footer">
        <div class="system-status-card">
            <div class="status-header">
                <span class="status-indicator active"></span>
                <span class="status-text">System Status</span>
            </div>
            <div class="status-details">
                <div class="status-item">
                    <span class="status-label">Uptime</span>
                    <span class="status-value">99.8%</span>
                </div>
                <div class="status-item">
                    <span class="status-label">Users</span>
                    <span class="status-value">45</span>
                </div>
            </div>
        </div>
        <div class="current-time-display">
            <i class="fas fa-clock"></i>
            <div>
                <span id="currentTime">10:30 AM</span>
                <span id="currentDate">Jan 23, 2026</span>
            </div>
        </div>
    </div>
</nav>
