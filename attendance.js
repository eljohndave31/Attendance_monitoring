let attendanceState = {
    currentPage: 1,
    itemsPerPage: 5,
    selectedStatus: null,
    employees: {
        present: [
            { id: 'EMP001', name: 'John Doe', dept: 'IT', checkIn: '08:15 AM', checkOut: '05:30 PM', status: 'present' },
            { id: 'EMP002', name: 'Michael Brown', dept: 'IT', checkIn: '08:10 AM', checkOut: '05:45 PM', status: 'present' },
            { id: 'EMP003', name: 'Robert Johnson', dept: 'Sales', checkIn: '08:00 AM', checkOut: '05:00 PM', status: 'present' }
        ],
        'on-time': [
            { id: 'EMP001', name: 'John Doe', dept: 'IT', checkIn: '08:15 AM', checkOut: '05:30 PM', status: 'present' },
            { id: 'EMP003', name: 'Robert Johnson', dept: 'Sales', checkIn: '08:00 AM', checkOut: '05:00 PM', status: 'present' }
        ],
        late: [
            { id: 'EMP002', name: 'Jane Smith', dept: 'HR', checkIn: '09:30 AM', checkOut: '06:00 PM', status: 'late' },
            { id: 'EMP004', name: 'Lisa Anderson', dept: 'Finance', checkIn: '09:15 AM', checkOut: '05:45 PM', status: 'late' }
        ],
        absent: [
            { id: 'EMP005', name: 'Sarah Williams', dept: 'Finance', checkIn: '--', checkOut: '--', status: 'absent' },
            { id: 'EMP006', name: 'David Martinez', dept: 'Admin', checkIn: '--', checkOut: '--', status: 'absent' }
        ]
    },
    allAttendanceRecords: [
        { id: 'EMP001', name: 'John Doe', dept: 'IT', checkIn: '08:15 AM', checkOut: '05:30 PM', status: 'present', duration: '9h 15m' },
        { id: 'EMP002', name: 'Jane Smith', dept: 'HR', checkIn: '09:30 AM', checkOut: '06:00 PM', status: 'late', duration: '8h 30m' },
        { id: 'EMP003', name: 'Robert Johnson', dept: 'Sales', checkIn: '08:00 AM', checkOut: '05:00 PM', status: 'present', duration: '9h 0m' },
        { id: 'EMP004', name: 'Lisa Anderson', dept: 'Finance', checkIn: '09:15 AM', checkOut: '05:45 PM', status: 'late', duration: '8h 30m' },
        { id: 'EMP005', name: 'Sarah Williams', dept: 'Finance', checkIn: '--', checkOut: '--', status: 'absent', duration: '--' },
        { id: 'EMP006', name: 'David Martinez', dept: 'Admin', checkIn: '--', checkOut: '--', status: 'absent', duration: '--' },
        { id: 'EMP007', name: 'Michael Brown', dept: 'IT', checkIn: '08:10 AM', checkOut: '05:45 PM', status: 'present', duration: '9h 35m' },
        { id: 'EMP008', name: 'Emma Wilson', dept: 'Marketing', checkIn: '08:30 AM', checkOut: '05:15 PM', status: 'present', duration: '8h 45m' },
        { id: 'EMP009', name: 'James Thompson', dept: 'Operations', checkIn: '10:00 AM', checkOut: '06:30 PM', status: 'late', duration: '8h 30m' },
        { id: 'EMP010', name: 'Jessica Lee', dept: 'HR', checkIn: '08:05 AM', checkOut: '05:20 PM', status: 'present', duration: '9h 15m' },
        { id: 'EMP011', name: 'Christopher Clark', dept: 'IT', checkIn: '09:45 AM', checkOut: '06:00 PM', status: 'late', duration: '8h 15m' },
        { id: 'EMP012', name: 'Amanda White', dept: 'Sales', checkIn: '--', checkOut: '--', status: 'absent', duration: '--' }
    ]
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadAttendanceMonitorView();
    initializeTimeUpdates();
});

function setupEventListeners() {
    // Sidebar navigation - just update active state, let links work naturally
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    // User menu dropdown
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userMenu = document.getElementById('userMenu');
    
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenu.classList.toggle('show');
        });
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-dropdown')) {
            userMenu?.classList.remove('show');
        }
    });

    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', togglePageFullscreen);
    }
}
// Initialize Time Updates
function initializeTimeUpdates() {
    updateCurrentTime();
    setInterval(() => updateCurrentTime(), 1000);
}

// Update Current Time
function updateCurrentTime() {
    const now = new Date();
    
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    }
    
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
}
// Load Attendance Monitor View
function loadAttendanceMonitorView() {
    const template = document.getElementById('attendanceMonitorView');
    const contentView = document.getElementById('contentView');
    
    if (!template || !contentView) return;
    
    const clone = template.content.cloneNode(true);
    contentView.innerHTML = '';
    contentView.appendChild(clone);
    
    setTimeout(setupAttendanceMonitor, 100);
}

function setupAttendanceMonitor() {
    setupStatCards();
    setupFilterControls();
    setupTableControls();
    loadAttendanceTable();
}

// Load Attendance Table
function loadAttendanceTable() {
    const tableBody = document.getElementById('attendanceTableBody');
    if (!tableBody) return;

    const startIndex = (attendanceState.currentPage - 1) * attendanceState.itemsPerPage;
    const endIndex = startIndex + attendanceState.itemsPerPage;
    const pageRecords = attendanceState.allAttendanceRecords.slice(startIndex, endIndex);

    tableBody.innerHTML = pageRecords.map(record => `
        <tr>
            <td><strong>${record.id}</strong></td>
            <td>${record.name}</td>
            <td>${record.dept}</td>
            <td>${record.checkIn}</td>
            <td>${record.checkOut}</td>
            <td>
                <span class="status-badge ${record.status === 'present' ? 'present' : record.status === 'late' ? 'late' : 'absent'}">
                    ${record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </span>
            </td>
            <td>${record.duration}</td>
        </tr>
    `).join('');

    updatePaginationInfo();
}

function updatePaginationInfo() {
    const totalPages = Math.ceil(attendanceState.allAttendanceRecords.length / attendanceState.itemsPerPage);
    document.getElementById('pageInfo').textContent = `Page ${attendanceState.currentPage} of ${totalPages}`;
    
    document.getElementById('prevPage').disabled = attendanceState.currentPage === 1;
    document.getElementById('nextPage').disabled = attendanceState.currentPage === totalPages;
}

// Setup Stat Cards with Click Handlers
function setupStatCards() {
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('click', function() {
            const status = this.getAttribute('data-status');
            showStatDetails(status);
        });
    });
}

function showStatDetails(status) {
    const panel = document.getElementById('statsDetailsPanel');
    const title = document.getElementById('detailsTitle');
    const employeesList = document.getElementById('employeesList');
    
    const titles = {
        present: 'Present Today',
        'on-time': 'On Time',
        late: 'Late Arrivals',
        absent: 'Absent'
    };
    
    title.textContent = titles[status] || 'Employees';
    const employees = attendanceState.employees[status] || [];
    
    employeesList.innerHTML = employees.map(emp => `
        <div class="employee-row">
            <div class="employee-name-cell">
                <div class="employee-avatar">${emp.name.charAt(0)}</div>
                <div class="employee-info">
                    <h4>${emp.name}</h4>
                    <p>${emp.id}</p>
                </div>
            </div>
            <div class="employee-cell">
                <span class="employee-dept">${emp.dept}</span>
            </div>
            <div class="employee-cell">
                <span class="employee-checkin">${emp.checkIn}</span>
            </div>
            <div class="employee-cell">
                <span class="employee-status ${emp.status}">${emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}</span>
            </div>
        </div>
    `).join('');
    
    panel.style.display = 'block';
}

// Close Details Panel
document.addEventListener('click', function(e) {
    if (e.target.closest('#closeDetails')) {
        document.getElementById('statsDetailsPanel').style.display = 'none';
    }
});

// Setup Filter Controls
function setupFilterControls() {
    document.getElementById('applyFilters')?.addEventListener('click', () => {
        console.log('Filters applied');
    });
    
    document.getElementById('resetFilters')?.addEventListener('click', () => {
        document.getElementById('filterStatus').value = '';
        document.getElementById('filterDepartment').value = '';
        document.getElementById('searchEmployee').value = '';
    });
}

// Setup Table Controls
function setupTableControls() {
    document.getElementById('prevPage')?.addEventListener('click', () => {
        if (attendanceState.currentPage > 1) {
            attendanceState.currentPage--;
            loadAttendanceTable();
        }
    });

    document.getElementById('nextPage')?.addEventListener('click', () => {
        const totalPages = Math.ceil(attendanceState.allAttendanceRecords.length / attendanceState.itemsPerPage);
        if (attendanceState.currentPage < totalPages) {
            attendanceState.currentPage++;
            loadAttendanceTable();
        }
    });

    document.getElementById('refreshBtn')?.addEventListener('click', () => {
        loadAttendanceTable();
        console.log('Table refreshed');
    });
    
    document.getElementById('exportBtn')?.addEventListener('click', () => {
        console.log('Exporting data');
    });
}


function togglePageFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}
