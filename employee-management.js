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

    // Setup photo upload handlers
    setupPhotoUploadHandlers();

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
            tbody.innerHTML = `<tr><td colspan="9" class="empty-state">No employees found</td></tr>`;
            return;
        }

        employees.forEach(emp => {
            const row = document.createElement('tr');
            const photoCell = emp.photo_url 
                ? `<img src="${emp.photo_url}" alt="${emp.full_name}" onerror="this.outerHTML='<i class=\'fas fa-user\'></i>'">`
                : `<i class="fas fa-user"></i>`;
            row.innerHTML = `
                <td>
                    <div class="employee-photo">
                        ${photoCell}
                    </div>
                </td>
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

// -------------------- Employee Modal Functions --------------------
function openEmployeeModal(employee = null) {
    const modal = document.getElementById('employeeModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalIcon = document.getElementById('modalIcon');
    const employeeForm = document.getElementById('employeeForm');
    const idHidden = document.getElementById('employeeIdHidden');
    const saveButtonText = document.getElementById('saveButtonText');

    if (!modal) {
        console.error('Employee modal not found');
        return;
    }

    // Reset photo preview first
    resetPhotoPreview();

    if (employee) {
        // Edit Mode
        modalTitle.textContent = 'Edit Employee';
        modalIcon.className = 'modal-icon fas fa-user-edit';
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
        
        // Load photo URL if exists
        if (employee.photo_url) {
            setPhotoPreview(employee.photo_url);
        }
        
        if (saveButtonText) saveButtonText.textContent = 'Update Employee';
    } else {
        // Add Mode
        modalTitle.textContent = 'Add New Employee';
        modalIcon.className = 'modal-icon fas fa-user-plus';
        idHidden.value = '';
        employeeForm.reset();
        document.getElementById('employeeId').value = 'EMP' + Math.floor(1000 + Math.random() * 9000);
        document.getElementById('employeeJoinDate').value = new Date().toISOString().split('T')[0];
        
        if (saveButtonText) saveButtonText.textContent = 'Save Employee';
    }

    // Show modal with animation
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Focus on first input field
    requestAnimationFrame(() => {
        const firstInput = document.getElementById('employeeName');
        if (firstInput) firstInput.focus();
    });
}

function closeEmployeeModal() {
    const modal = document.getElementById('employeeModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Reset form state asynchronously
        requestAnimationFrame(() => {
            const employeeForm = document.getElementById('employeeForm');
            if (employeeForm) employeeForm.reset();
            resetPhotoPreview();
            
            // Remove any error states
            document.querySelectorAll('.form-control.error').forEach(input => {
                input.classList.remove('error');
            });
        });
    }
}

// -------------------- Photo Upload Handlers --------------------
function setupPhotoUploadHandlers() {
    const photoInput = document.getElementById('employeePhoto');
    const removePhotoBtn = document.getElementById('removePhotoBtn');

    if (photoInput) {
        photoInput.addEventListener('change', handlePhotoChange);
    }

    if (removePhotoBtn) {
        removePhotoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resetPhotoPreview();
        });
        // Disable remove button by default
        removePhotoBtn.disabled = true;
    }
}

function handlePhotoChange(e) {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        showNotification('Photo size must be less than 5MB', 'error');
        e.target.value = '';
        return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
        showNotification('Please upload a valid image file (JPG, PNG, or GIF)', 'error');
        e.target.value = '';
        return;
    }

    // Read and preview the image
    const reader = new FileReader();
    reader.onload = (event) => {
        const photoPreview = document.getElementById('photoPreview');
        if (photoPreview) {
            photoPreview.innerHTML = `<img src="${event.target.result}" alt="Photo preview">`;
            photoPreview.classList.add('has-photo');
            photoPreview.dataset.photoData = event.target.result;
            photoPreview.dataset.hasPhoto = 'true';
        }
        
        // Enable remove button
        const removeBtn = document.getElementById('removePhotoBtn');
        if (removeBtn) removeBtn.disabled = false;
    };
    reader.readAsDataURL(file);
}

function resetPhotoPreview() {
    const photoPreview = document.getElementById('photoPreview');
    const photoInput = document.getElementById('employeePhoto');
    const removeBtn = document.getElementById('removePhotoBtn');
    
    if (photoPreview) {
        photoPreview.innerHTML = `<i class="fas fa-user-circle"></i><span>No photo</span>`;
        photoPreview.classList.remove('has-photo');
        photoPreview.dataset.hasPhoto = 'false';
        delete photoPreview.dataset.photoData;
        delete photoPreview.dataset.photoUrl;
    }
    
    if (photoInput) {
        photoInput.value = '';
    }
    
    if (removeBtn) {
        removeBtn.disabled = true;
    }
}

function setPhotoPreview(url) {
    const photoPreview = document.getElementById('photoPreview');
    const removeBtn = document.getElementById('removePhotoBtn');
    
    if (photoPreview && url) {
        photoPreview.innerHTML = `<img src="${url}" alt="Profile photo" onerror="this.outerHTML='<i class=\'fas fa-user-circle\'></i><span>No photo</span>'">`;
        photoPreview.classList.add('has-photo');
        photoPreview.dataset.photoUrl = url;
        photoPreview.dataset.hasPhoto = 'true';
    }
    
    if (removeBtn) {
        removeBtn.disabled = false;
    }
}

// -------------------- Employee Form Submit --------------------
async function handleEmployeeFormSubmit(e) {
    e.preventDefault();

    const idHidden = document.getElementById('employeeIdHidden').value;
    const photoPreview = document.getElementById('photoPreview');
    const saveBtn = document.getElementById('saveEmployeeBtn');
    
    // Add loading state
    if (saveBtn) {
        saveBtn.classList.add('loading');
        saveBtn.disabled = true;
    }
    
    // Get photo data if available
    let photoUrl = null;
    if (photoPreview && photoPreview.dataset.hasPhoto === 'true') {
        if (photoPreview.dataset.photoData) {
            try {
                photoUrl = await uploadPhoto(photoPreview.dataset.photoData);
            } catch (error) {
                showNotification('Failed to upload photo: ' + error.message, 'error');
                if (saveBtn) {
                    saveBtn.classList.remove('loading');
                    saveBtn.disabled = false;
                }
                return;
            }
        } else if (photoPreview.dataset.photoUrl) {
            photoUrl = photoPreview.dataset.photoUrl;
        }
    }

    const data = {
        employee_id: document.getElementById('employeeId').value,
        full_name: document.getElementById('employeeName').value,
        email: document.getElementById('employeeEmail').value,
        phone: document.getElementById('employeePhone').value,
        department: document.getElementById('employeeDepartment').value,
        position: document.getElementById('employeePosition').value,
        status: document.getElementById('employeeStatus').value,
        join_date: document.getElementById('employeeJoinDate').value,
        address: document.getElementById('employeeAddress').value,
        photo_url: photoUrl
    };

    if (!data.full_name || !data.email || !data.department || !data.position || !data.join_date) {
        showNotification('Please fill all required fields', 'error');
        if (saveBtn) {
            saveBtn.classList.remove('loading');
            saveBtn.disabled = false;
        }
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        if (saveBtn) {
            saveBtn.classList.remove('loading');
            saveBtn.disabled = false;
        }
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
    } finally {
        if (saveBtn) {
            saveBtn.classList.remove('loading');
            saveBtn.disabled = false;
        }
    }
}

// -------------------- Photo Upload to Server --------------------
async function uploadPhoto(base64Data) {
    const response = await fetch('/Attendance_monitoring/api/employees.php?upload_photo=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo_data: base64Data })
    });
    
    const result = await response.json();
    
    if (result.success && result.photo_url) {
        return result.photo_url;
    } else {
        throw new Error(result.error || 'Failed to upload photo');
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
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 400px;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// -------------------- Initialize Time Updates --------------------
function initializeTimeUpdates() {
    updateTime();
    setInterval(updateTime, 1000);
}

function updateTime() {
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        const now = new Date();
        currentDateElement.textContent = now.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

function togglePageFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Fullscreen not available:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

function exportEmployees() {
    showNotification('Export feature coming soon!', 'info');
}
