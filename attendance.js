let attendanceState = {
    currentPage: 1,
    itemsPerPage: 10
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadAttendanceMonitorView();
    initializeNavigation();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
});

// Load Attendance Monitor View
function loadAttendanceMonitorView() {
    const template = document.getElementById('attendanceMonitorView');
    const contentView = document.getElementById('contentView');
    
    if (!template || !contentView) {
        console.error('Template or content view not found');
        return;
    }
    
    const clone = template.content.cloneNode(true);
    contentView.innerHTML = '';
    contentView.appendChild(clone);
    
    setTimeout(() => {
        setupAttendanceMonitor();
    }, 100);
}

// Setup Attendance Monitor UI
function setupAttendanceMonitor() {
    const applyFiltersBtn = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const refreshBtn = document.getElementById('refreshBtn');
    const exportBtn = document.getElementById('exportBtn');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            console.log('Filters applied');
        });
    }

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            document.getElementById('filterStatus').value = '';
            document.getElementById('filterDepartment').value = '';
            document.getElementById('searchEmployee').value = '';
            console.log('Filters reset');
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            console.log('Refresh attendance data');
        });
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            console.log('Export attendance data');
        });
    }

    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            console.log('Previous page');
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            console.log('Next page');
        });
    }
}

// Initialize Navigation
function initializeNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const view = this.getAttribute('data-view');
            handleNavigation(view);
        });
    });
    
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userMenu = document.getElementById('userMenu');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', function() {
            userMenu.classList.toggle('show');
        });
    }
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-dropdown')) {
            userMenu?.classList.remove('show');
        }
    });
    
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', togglePageFullscreen);
    }
}

// Handle Navigation
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
        window.location.href = 'dashboard.html';
    } else if (view === 'qr-generator') {
        window.location.href = 'qr-generator.html';
    } else if (view === 'employee-management') {
        window.location.href = 'employee-management.html';
    } else if (view === 'attendance-monitor') {
        loadAttendanceMonitorView();
    } else if (view === 'reports') {
        window.location.href = 'reports.html';
    } else if (view === 'settings') {
        window.location.href = 'settings.html';
    } else if (view === 'system-logs') {
        window.location.href = 'system-logs.html';
    }
}

// Update Current Time
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

// Toggle Page Fullscreen
function togglePageFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Action function stubs for button clicks in table
function viewDetails(id) {
    console.log('View details for:', id);
    // Backend will handle details view
}

function editRecord(id) {
    console.log('Edit record for:', id);
    // Backend will handle record edit
}
