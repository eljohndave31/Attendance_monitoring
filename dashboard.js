// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardView();
    initializeEventListeners();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
});

// Load dashboard view
function loadDashboardView() {
    const template = document.getElementById('dashboardView');
    const contentView = document.getElementById('contentView');
    const clone = template.content.cloneNode(true);
    contentView.innerHTML = '';
    contentView.appendChild(clone);
}

// Initialize event listeners
function initializeEventListeners() {
    // Sidebar navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const view = this.getAttribute('data-view');
            handleNavigation(view);
        });
    });
    
    // User menu dropdown
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userMenu = document.getElementById('userMenu');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', function() {
            userMenu.classList.toggle('show');
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-dropdown')) {
            userMenu?.classList.remove('show');
        }
    });
    
    // Quick action buttons
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            console.log('Quick action:', action);
        });
    });
    
    // Fullscreen button
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
}

// Handle navigation
function handleNavigation(view) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.querySelector(`[data-view="${view}"]`)?.classList.add('active');
    
    const titles = {
        'dashboard': 'Dashboard',
        'qr-generator': 'QR Generator',
        'employee-management': 'Employee Management',
        'attendance-monitor': 'Attendance Monitor',
        'reports': 'Reports',
        'settings': 'Settings',
        'system-logs': 'System Logs'
    };
    
    document.getElementById('pageTitle').textContent = titles[view] || 'Dashboard';
    
    // Navigate to different pages
    if (view === 'dashboard') {
        loadDashboardView();
    } else if (view === 'qr-generator') {
        window.location.href = 'qr-generator.html';
    } else if (view === 'employee-management') {
        window.location.href = 'employee-management.html';
    } else if (view === 'attendance-monitor') {
        window.location.href = 'attendance.html';
    } else if (view === 'reports') {
        window.location.href = 'reports.html';
    } else if (view === 'settings') {
        window.location.href = 'settings.html';
    } else if (view === 'system-logs') {
        window.location.href = 'system-logs.html';
    }
}

// Update current time
function updateCurrentTime() {
    const currentTimeElement = document.getElementById('currentTime');
    if (currentTimeElement) {
        const now = new Date();
        currentTimeElement.textContent = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    }
}

// Toggle fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}
