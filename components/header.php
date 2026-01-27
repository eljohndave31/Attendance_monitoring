<header class="dashboard-header">
    <div class="header-left">
        <div class="logo-small">
            <div class="logo-icon">
                <i class="fas fa-qrcode"></i>
            </div><span class="logo-text">Atten<span class="logo-highlight">dify</span></span>
        </div>
        <button class="sidebar-toggle" id="sidebarToggle">
            <i class="fas fa-bars"></i>
        </button>
    </div>
    
    <div class="header-right">
        <div class="header-actions">
            <div class="header-action-group">
                <button class="header-btn tooltip" id="searchBtn" data-tooltip="Search">
                    <i class="fas fa-search"></i>
                </button>
                <button class="header-btn tooltip" id="notificationsBtn" data-tooltip="Notifications">
                    <i class="fas fa-bell"></i>
                    <span class="badge">3</span>
                </button>
                <button class="header-btn tooltip" id="fullscreenBtn" data-tooltip="Fullscreen">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
            
            <div class="divider"></div>
            
            <div class="user-dropdown">
                <button class="user-btn" id="userMenuBtn">
                    <div class="user-avatar">
                        <i class="fas fa-user-shield"></i>
                    </div>
                    <div class="user-info">
                        <span class="user-name">Admin</span>
                        <span class="user-role">System Admin</span>
                    </div>
                    <i class="dropdown-icon fas fa-chevron-down"></i>
                </button>
                <div class="dropdown-menu" id="userMenu">
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-user-cog"></i>
                        <div class="dropdown-item-content">
                            <span>Profile</span>
                            <small>View your profile</small>
                        </div>
                    </a>
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-cog"></i>
                        <div class="dropdown-item-content">
                            <span>Settings</span>
                            <small>Configure preferences</small>
                        </div>
                    </a>
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-history"></i>
                        <div class="dropdown-item-content">
                            <span>Activity</span>
                            <small>View your activity</small>
                        </div>
                    </a>
                    <div class="divider"></div>
                    <a href="landingpage.php" class="dropdown-item logout">
                        <i class="fas fa-sign-out-alt"></i>
                        <div class="dropdown-item-content">
                            <span>Logout</span>
                            <small>End session</small>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>
</header>
