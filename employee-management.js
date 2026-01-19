// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadEmployeeManagementView();
    initializeNavigation();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
});

// Load Employee Management View
function loadEmployeeManagementView() {
    const template = document.getElementById('employeeManagementView');
    const contentView = document.getElementById('contentView');
    
    if (!template || !contentView) {
        console.error('Template or content view not found');
        return;
    }
    
    const clone = template.content.cloneNode(true);
    contentView.innerHTML = '';
    contentView.appendChild(clone);
    
    setTimeout(() => {
        setupEmployeeManagement();
    }, 100);
}

// Setup Employee Management UI
function setupEmployeeManagement() {
    // Modal controls
    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const employeeModal = document.getElementById('employeeModal');
    const employeeForm = document.getElementById('employeeForm');

    if (addEmployeeBtn) {
        addEmployeeBtn.addEventListener('click', openEmployeeModal);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeEmployeeModal);
    }

    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', closeEmployeeModal);
    }

    if (employeeForm) {
        employeeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Employee form submitted');
            closeEmployeeModal();
        });
    }

    // Click outside modal to close
    if (employeeModal) {
        employeeModal.addEventListener('click', (e) => {
            if (e.target === employeeModal) {
                closeEmployeeModal();
            }
        });
    }

    // Filter button
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            console.log('Filters applied');
        });
    }

    // Action buttons
    const refreshEmployeesBtn = document.getElementById('refreshEmployeesBtn');
    const exportEmployeesBtn = document.getElementById('exportEmployeesBtn');

    if (refreshEmployeesBtn) {
        refreshEmployeesBtn.addEventListener('click', () => {
            console.log('Refresh employees');
        });
    }

    if (exportEmployeesBtn) {
        exportEmployeesBtn.addEventListener('click', () => {
            console.log('Export employees');
        });
    }

    // Pagination
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');

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

// Open Employee Modal
function openEmployeeModal(employeeId = null) {
    const modal = document.getElementById('employeeModal');
    const modalTitle = document.getElementById('modalTitle');
    const employeeForm = document.getElementById('employeeForm');

    if (employeeId) {
        modalTitle.textContent = 'Edit Employee';
    } else {
        modalTitle.textContent = 'Add New Employee';
        employeeForm.reset();
    }

    modal.classList.add('show');
}

// Close Employee Modal
function closeEmployeeModal() {
    const modal = document.getElementById('employeeModal');
    modal.classList.remove('show');
}

// Employee Actions (UI only)
function viewEmployee(id) {
    console.log('View employee:', id);
}

function editEmployee(id) {
    console.log('Edit employee:', id);
    openEmployeeModal(id);
}

function deleteEmployee(id) {
    console.log('Delete employee:', id);
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
        loadEmployeeManagementView();
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
