// employee-management.js

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadEmployeeManagementView();
    setupEventListeners();
    initializeTimeUpdates();
});

// -------------------- UI Event Listeners --------------------
function setupEventListeners() {
    // Sidebar navigation
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
        sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
    }

    // User menu dropdown
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userMenu = document.getElementById('userMenu');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', e => {
            e.stopPropagation();
            userMenu?.classList.toggle('show');
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', e => {
        if (!e.target.closest('.user-dropdown')) userMenu?.classList.remove('show');
    });

    // Fullscreen
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', togglePageFullscreen);

    // Search, Notifications, Refresh
    document.getElementById('searchBtn')?.addEventListener('click', () => {});
    document.getElementById('notificationsBtn')?.addEventListener('click', () => {});
    document.getElementById('refreshData')?.addEventListener('click', loadEmployees);
}

// -------------------- Load Employee Management View --------------------
function loadEmployeeManagementView() {
    const template = document.getElementById('employeeManagementView');
    const contentView = document.getElementById('contentView');

    if (!template || !contentView) return;

    contentView.innerHTML = '';
    contentView.appendChild(template.content.cloneNode(true));

    setupEmployeeManagement();
}

// -------------------- Employee Management Setup --------------------
function setupEmployeeManagement() {
    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const employeeForm = document.getElementById('employeeForm');
    const employeeModal = document.getElementById('employeeModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    if (addEmployeeBtn) {
        addEmployeeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openEmployeeModal();
        });
    }

    closeModalBtn?.addEventListener('click', closeEmployeeModal);
    cancelModalBtn?.addEventListener('click', closeEmployeeModal);
    cancelDeleteBtn?.addEventListener('click', closeDeleteConfirmation);
    confirmDeleteBtn?.addEventListener('click', confirmDelete);

    employeeForm?.addEventListener('submit', handleEmployeeFormSubmit);
    
    if (employeeModal) {
        employeeModal.addEventListener('click', e => { 
            if (e.target === employeeModal) closeEmployeeModal(); 
        });
    }

    document.getElementById('applyFiltersBtn')?.addEventListener('click', () => {
        console.log('Filters applied');
        loadEmployees();
    });

    document.getElementById('refreshEmployeesBtn')?.addEventListener('click', loadEmployees);
    document.getElementById('exportEmployeesBtn')?.addEventListener('click', exportEmployees);

    document.getElementById('prevPageBtn')?.addEventListener('click', () => console.log('Previous page'));
    document.getElementById('nextPageBtn')?.addEventListener('click', () => console.log('Next page'));

    // Load initial employees
    loadEmployees();
}

// -------------------- Load Employees from Backend --------------------
async function loadEmployees() {
    try {
        const res = await fetch('/Attendance_monitoring/api/employees.php');
        
        if (!res.ok) throw new Error('Failed to load employees - Status: ' + res.status);
        
        const employees = await res.json();

        const tbody = document.getElementById('employeeTableBody');
        if (!tbody) {
            return;
        }

        tbody.innerHTML = '';

        if (!employees || !employees.length) {
            tbody.innerHTML = `<tr><td colspan="8" class="empty-state">No employees found</td></tr>`;
            return;
        }

        employees.forEach(emp => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${emp.employee_id}</td>
                <td>${emp.full_name}</td>
                <td>${emp.email}</td>
                <td>${emp.department}</td>
                <td>${emp.position}</td>
                <td><span class="status-badge ${emp.status}">${emp.status}</span></td>
                <td>${emp.join_date}</td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button class="icon-btn edit" data-employee-id="${emp.id}" title="Edit">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="icon-btn delete" data-employee-id="${emp.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Add event listeners to newly created buttons
        document.querySelectorAll('.icon-btn.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const empId = btn.getAttribute('data-employee-id');
                const employee = employees.find(emp => emp.id == empId);
                if (employee) {
                    openEmployeeModal(employee);
                }
            });
        });

        document.querySelectorAll('.icon-btn.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const empId = btn.getAttribute('data-employee-id');
                const employee = employees.find(emp => emp.id == empId);
                if (employee) {
                    showDeleteConfirmation(empId, employee.full_name);
                }
            });
        });

    } catch (error) {
        showNotification('Failed to load employees: ' + error.message, 'error');
    }
}

// -------------------- Employee Modal --------------------
function openEmployeeModal(employee = null) {
    const modal = document.getElementById('employeeModal');
    const modalTitle = document.getElementById('modalTitle');
    const employeeForm = document.getElementById('employeeForm');
    const idHidden = document.getElementById('employeeIdHidden');

    if (!modal) {
        console.error('Employee modal not found');
        return;
    }

    if (employee) {
        modalTitle.textContent = 'Edit Employee';
        idHidden.value = employee.id || '';
        document.getElementById('employeeId').value = employee.employee_id || '';
        document.getElementById('employeeName').value = employee.full_name || '';
        document.getElementById('employeeEmail').value = employee.email || '';
        document.getElementById('employeePhone').value = employee.phone || '';
        document.getElementById('employeeDepartment').value = employee.department || '';
        document.getElementById('employeePosition').value = employee.position || '';
        document.getElementById('employeeStatus').value = employee.status || 'active';
        document.getElementById('employeeJoinDate').value = employee.join_date || '';
        document.getElementById('employeeAddress').value = employee.address || '';
    } else {
        modalTitle.textContent = 'Add New Employee';
        idHidden.value = '';
        employeeForm.reset();
        document.getElementById('employeeId').value = 'EMP-' + Date.now();
    }

    modal.classList.add('show');
}

function closeEmployeeModal() {
    const modal = document.getElementById('employeeModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// -------------------- Employee Form Submit --------------------
async function handleEmployeeFormSubmit(e) {
    e.preventDefault();

    const idHidden = document.getElementById('employeeIdHidden').value;
    const data = {
        employee_id: document.getElementById('employeeId').value,
        full_name: document.getElementById('employeeName').value,
        email: document.getElementById('employeeEmail').value,
        phone: document.getElementById('employeePhone').value,
        department: document.getElementById('employeeDepartment').value,
        position: document.getElementById('employeePosition').value,
        status: document.getElementById('employeeStatus').value,
        join_date: document.getElementById('employeeJoinDate').value,
        address: document.getElementById('employeeAddress').value
    };

    // Validation
    if (!data.full_name || !data.email || !data.department || !data.position || !data.join_date) {
        showNotification('Please fill all required fields', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    try {
        const method = idHidden ? 'PUT' : 'POST';
        if (idHidden) {
            data.id = idHidden;
        }

        const res = await fetch('/Attendance_monitoring/api/employees.php', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        
        if (result.success) {
            showNotification(idHidden ? 'Employee updated successfully!' : 'Employee created successfully!', 'success');
            closeEmployeeModal();
            loadEmployees();
        } else {
            showNotification(result.error || 'Failed to save employee', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error saving employee: ' + error.message, 'error');
    }
}

// -------------------- Delete Confirmation --------------------
let deleteEmployeeId = null;

function showDeleteConfirmation(id, name) {
    deleteEmployeeId = id;
    const modal = document.getElementById('deleteConfirmationModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeDeleteConfirmation() {
    const modal = document.getElementById('deleteConfirmationModal');
    if (modal) {
        modal.classList.remove('show');
    }
    deleteEmployeeId = null;
}

async function confirmDelete() {
    if (!deleteEmployeeId) return;

    try {
        const res = await fetch(`/Attendance_monitoring/api/employees.php?id=${deleteEmployeeId}`, { method: 'DELETE' });
        const result = await res.json();
        
        if (result.success) {
            showNotification('Employee deleted successfully!', 'success');
            closeDeleteConfirmation();
            loadEmployees();
        } else {
            showNotification(result.error || 'Failed to delete employee', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error deleting employee: ' + error.message, 'error');
    }
}

// -------------------- Notification System --------------------
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        border-radius: 4px;
        z-index: 10000;
        animation: slideIn 0.3s ease-in;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// -------------------- Export Employees (CSV) --------------------
function exportEmployees() {
    const rows = [['ID','Name','Email','Department','Position','Status','Join Date']];
    document.querySelectorAll('#employeeTableBody tr').forEach(tr => {
        const cols = Array.from(tr.querySelectorAll('td')).slice(0, -1).map(td => td.innerText);
        if (cols.length) rows.push(cols);
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "employees.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// -------------------- Time Updates --------------------
function initializeTimeUpdates() {
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
}

function updateCurrentTime() {
    const now = new Date();
    const timeEl = document.getElementById('currentTime');
    const dateEl = document.getElementById('currentDate');

    if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true });
    if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
}

// -------------------- Fullscreen Toggle --------------------
function togglePageFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.log(`Error: ${err.message}`));
    } else {
        document.exitFullscreen();
    }
}
