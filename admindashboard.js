// ==================== QR CODE MANAGEMENT ====================
let qrState = {
    currentToken: null,
    expiryTime: null,
    refreshInterval: null,
    qrInstance: null,
    isGenerating: true,
    location: 'office_main'
};

function generateToken() {
    return 'QR-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function createLiveQRCode() {
    const container = document.getElementById('liveQRCode');
    if (!container) return;

    const token = generateToken();
    const expiryMinutes = parseInt(document.getElementById('qrExpiry')?.value || '5');
    const locationId = document.getElementById('qrLocation')?.value || 'office_main';

    const generatedAt = new Date();
    const expiresAt = new Date(generatedAt.getTime() + expiryMinutes * 60000);

    const payload = {
        token: token,
        generated_at: generatedAt.toISOString(),
        expires_at: expiresAt.toISOString(),
        location_id: locationId
    };

    qrState.currentToken = token;
    qrState.expiryTime = expiresAt;
    qrState.currentPayload = payload;

    container.innerHTML = '';

    try {
        qrState.qrInstance = new QRCode(container, {
            text: JSON.stringify(payload),
            width: 250,
            height: 250,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    } catch (e) {
        console.error('Error creating QR code:', e);
    }

    updateLiveDisplay();
    saveQRToBackend(payload);
}

function updateLiveDisplay() {
    const token = document.getElementById('liveToken');
    const expiry = document.getElementById('liveExpiry');
    const location = document.getElementById('liveLocation');
    const generated = document.getElementById('liveGenerated');

    if (token) token.textContent = qrState.currentToken || '--';
    if (location) {
        const locationSelect = document.getElementById('qrLocation');
        const locationText = locationSelect?.options[locationSelect.selectedIndex]?.text || 'Office Main';
        location.textContent = locationText;
    }
    if (generated) {
        generated.textContent = qrState.currentPayload ? new Date(qrState.currentPayload.generated_at).toLocaleString() : '--';
    }

    if (expiry && qrState.expiryTime) {
        updateCountdown(expiry, qrState.expiryTime);
    }
}

function updateCountdown(element, expiryTime) {
    const update = () => {
        const now = new Date();
        const diff = expiryTime - now;

        if (diff <= 0) {
            element.textContent = '00:00';
            element.classList.add('expired');
            return;
        }

        element.classList.remove('expired');
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        element.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    update();
    const countdownInterval = setInterval(() => {
        if (!qrState.isGenerating) {
            clearInterval(countdownInterval);
            return;
        }
        update();
    }, 1000);
}

function saveQRToBackend(payload) {
    fetch('api/qr/save.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).catch(e => console.error('Failed to save QR:', e));
}

function setupQRGeneratorView() {
    const generateBtn = document.getElementById('generateQR');
    const pauseBtn = document.getElementById('pauseQR');
    const refreshLiveBtn = document.getElementById('refreshLiveQR');
    const downloadBtn = document.getElementById('downloadQR');
    const fullscreenBtn = document.getElementById('fullscreenQR');
    const autoRefreshCheckbox = document.getElementById('autoRefresh');
    const enableGPSCheckbox = document.getElementById('enableGPS');
    const gpsOptions = document.getElementById('gpsOptions');

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            qrState.isGenerating = true;
            createLiveQRCode();
            generateBtn.textContent = '✓ Generated';
            setTimeout(() => {
                generateBtn.innerHTML = '<i class="fas fa-qrcode"></i> Generate QR Code';
            }, 2000);
        });
    }

    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            qrState.isGenerating = !qrState.isGenerating;
            pauseBtn.textContent = qrState.isGenerating ? '⏸ Pause Generation' : '▶ Resume Generation';
            pauseBtn.classList.toggle('paused');
        });
    }

    if (refreshLiveBtn) {
        refreshLiveBtn.addEventListener('click', createLiveQRCode);
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const qrCanvas = document.querySelector('#liveQRCode canvas');
            if (qrCanvas) {
                const link = document.createElement('a');
                link.href = qrCanvas.toDataURL('image/png');
                link.download = `qr-${qrState.currentToken}.png`;
                link.click();
            }
        });
    }

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            const qrContainer = document.getElementById('liveQRCode');
            if (qrContainer.requestFullscreen) {
                qrContainer.requestFullscreen();
            } else if (qrContainer.webkitRequestFullscreen) {
                qrContainer.webkitRequestFullscreen();
            }
        });
    }

    if (enableGPSCheckbox && gpsOptions) {
        enableGPSCheckbox.addEventListener('change', () => {
            gpsOptions.style.display = enableGPSCheckbox.checked ? 'block' : 'none';
        });
    }

    if (autoRefreshCheckbox) {
        autoRefreshCheckbox.addEventListener('change', () => {
            if (autoRefreshCheckbox.checked) {
                const refreshMinutes = parseInt(document.getElementById('qrRefresh').value);
                if (qrState.refreshInterval) clearInterval(qrState.refreshInterval);
                qrState.refreshInterval = setInterval(() => {
                    if (qrState.isGenerating) createLiveQRCode();
                }, refreshMinutes * 60000);
            } else {
                if (qrState.refreshInterval) clearInterval(qrState.refreshInterval);
            }
        });
    }

    createLiveQRCode();
}

// ==================== EMPLOYEE MANAGEMENT ====================
let currentPage = 1;
const itemsPerPage = 10;

function setupEmployeeManagement() {
    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    const employeeModal = document.getElementById('employeeModal');
    const closeModal = document.getElementById('closeEmployeeModal');
    const cancelModal = document.getElementById('cancelEmployeeModal');
    const employeeForm = document.getElementById('employeeForm');
    const employeeSearch = document.getElementById('employeeSearch');
    const departmentFilter = document.getElementById('departmentFilter');
    const statusFilter = document.getElementById('statusFilter');
    const resetFilters = document.getElementById('resetFilters');
    const exportBtn = document.getElementById('exportEmployees');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const selectAllCheckbox = document.querySelector('.select-all');

    loadEmployeesList();

    addEmployeeBtn.addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = 'Add New Employee';
        employeeForm.reset();
        employeeForm.dataset.editing = 'false';
        employeeForm.dataset.editId = '';
        employeeModal.classList.add('show');
    });

    closeModal.addEventListener('click', () => employeeModal.classList.remove('show'));
    cancelModal.addEventListener('click', () => employeeModal.classList.remove('show'));

    employeeModal.addEventListener('click', (e) => {
        if (e.target === employeeModal) {
            employeeModal.classList.remove('show');
        }
    });

    employeeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const isEditing = employeeForm.dataset.editing === 'true';
        const editId = employeeForm.dataset.editId;

        const employee = {
            id: document.getElementById('employeeID').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            department: document.getElementById('department').value,
            position: document.getElementById('position').value,
            phone: document.getElementById('phone').value,
            joinDate: document.getElementById('joinDate').value,
            salary: parseFloat(document.getElementById('salary').value) || 0,
            status: document.getElementById('employeeStatus').value,
            address: document.getElementById('address').value,
            notes: document.getElementById('notes').value
        };

        const endpoint = isEditing ? 'api/employees/update.php' : 'api/employees/create.php';
        
        fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employee)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                loadEmployeesList();
                employeeModal.classList.remove('show');
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(e => console.error('Error:', e));
    });

    const filterEmployees = () => {
        currentPage = 1;
        loadEmployeesList();
    };

    employeeSearch.addEventListener('input', filterEmployees);
    departmentFilter.addEventListener('change', filterEmployees);
    statusFilter.addEventListener('change', filterEmployees);

    resetFilters.addEventListener('click', () => {
        employeeSearch.value = '';
        departmentFilter.value = '';
        statusFilter.value = '';
        currentPage = 1;
        loadEmployeesList();
    });

    exportBtn.addEventListener('click', () => {
        window.location.href = 'api/employees/export.php';
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadEmployeesList();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        currentPage++;
        loadEmployeesList();
    });

    selectAllCheckbox.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.data-table tbody input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = e.target.checked);
    });
}

function loadEmployeesList() {
    const searchTerm = document.getElementById('employeeSearch')?.value || '';
    const department = document.getElementById('departmentFilter')?.value || '';
    const status = document.getElementById('statusFilter')?.value || '';

    const params = new URLSearchParams({
        search: searchTerm,
        department: department,
        status: status,
        page: currentPage,
        limit: itemsPerPage
    });

    fetch(`api/employees/list.php?${params}`)
        .then(res => res.json())
        .then(data => {
            renderEmployeeTable(data.employees || []);
            updatePagination(data.totalPages || 1);
        })
        .catch(e => console.error('Error loading employees:', e));
}

function renderEmployeeTable(employees) {
    const tbody = document.getElementById('employeesList');
    tbody.innerHTML = '';

    if (employees.length === 0) {
        tbody.innerHTML = '<tr class="empty-state"><td colspan="9" style="text-align: center; padding: 40px;"><i class="fas fa-inbox" style="font-size: 48px; color: var(--border-color); margin-bottom: 10px;"></i><p>No employees found</p></td></tr>';
        return;
    }

    employees.forEach(emp => {
        const tr = document.createElement('tr');
        const statusClass = emp.status === 'active' ? 'active' : emp.status === 'leave' ? 'leave' : 'inactive';
        tr.innerHTML = `
            <td><input type="checkbox" class="table-checkbox"></td>
            <td>${emp.id}</td>
            <td class="employee-name">${emp.firstName} ${emp.lastName}</td>
            <td>${emp.email}</td>
            <td>${emp.department.charAt(0).toUpperCase() + emp.department.slice(1)}</td>
            <td>${emp.position}</td>
            <td><span class="status-badge ${statusClass}">${emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}</span></td>
            <td>${new Date(emp.joinDate).toLocaleDateString()}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-view" data-id="${emp.id}"><i class="fas fa-eye"></i> View</button>
                    <button class="btn-edit" data-id="${emp.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn-delete" data-id="${emp.id}"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    attachEmployeeActionListeners();
}

function attachEmployeeActionListeners() {
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => editEmployee(e.target.closest('button').dataset.id));
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => deleteEmployee(e.target.closest('button').dataset.id));
    });

    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', (e) => viewEmployee(e.target.closest('button').dataset.id));
    });
}

function editEmployee(id) {
    fetch(`api/employees/get.php?id=${id}`)
        .then(res => res.json())
        .then(emp => {
            document.getElementById('modalTitle').textContent = 'Edit Employee';
            document.getElementById('firstName').value = emp.firstName;
            document.getElementById('lastName').value = emp.lastName;
            document.getElementById('employeeID').value = emp.id;
            document.getElementById('email').value = emp.email;
            document.getElementById('department').value = emp.department;
            document.getElementById('position').value = emp.position;
            document.getElementById('phone').value = emp.phone;
            document.getElementById('joinDate').value = emp.joinDate;
            document.getElementById('salary').value = emp.salary;
            document.getElementById('employeeStatus').value = emp.status;
            document.getElementById('address').value = emp.address;
            document.getElementById('notes').value = emp.notes || '';

            document.getElementById('employeeForm').dataset.editing = 'true';
            document.getElementById('employeeForm').dataset.editId = id;
            document.getElementById('employeeModal').classList.add('show');
        })
        .catch(e => console.error('Error loading employee:', e));
}

function deleteEmployee(id) {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    fetch(`api/employees/delete.php?id=${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                loadEmployeesList();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(e => console.error('Error deleting employee:', e));
}

function viewEmployee(id) {
    fetch(`api/employees/get.php?id=${id}`)
        .then(res => res.json())
        .then(emp => {
            alert(`${emp.firstName} ${emp.lastName}\n${emp.email}\n${emp.position}`);
        })
        .catch(e => console.error('Error:', e));
}

function updatePagination(totalPages) {
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage >= totalPages;
    
    const pageNumber = document.getElementById('pageNumber');
    if (pageNumber) pageNumber.textContent = `Page ${currentPage} of ${totalPages > 0 ? totalPages : 1}`;
}

// ==================== MAIN APP INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    const contentView = document.getElementById('contentView');
    const dashboardTpl = document.getElementById('dashboardView');
    const qrGeneratorTpl = document.getElementById('qrGeneratorView');
    const employeeManagementTpl = document.getElementById('employeeManagementView');
    const pageTitle = document.getElementById('pageTitle');
    const breadcrumb = document.getElementById('breadcrumb');

    function loadTemplate(tpl, viewName = 'Dashboard') {
        contentView.innerHTML = '';
        contentView.appendChild(tpl.content.cloneNode(true));
        pageTitle.textContent = viewName;
        breadcrumb.innerHTML = `<span>${viewName}</span>`;

        if (tpl === qrGeneratorTpl) {
            setTimeout(setupQRGeneratorView, 100);
        } else if (tpl === employeeManagementTpl) {
            setTimeout(setupEmployeeManagement, 100);
        }
    }

    loadTemplate(dashboardTpl);

    const recent = document.getElementById('recentAttendance');
    if (recent) {
        fetch('api/attendance/recent.php')
            .then(res => res.json())
            .then(data => {
                recent.innerHTML = '';
                (data.records || []).forEach(s => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td>${s.time}</td><td>${s.name}</td><td>${s.status}</td><td><button class="btn-sm">View</button></td>`;
                    recent.appendChild(tr);
                });
            })
            .catch(e => console.error('Error loading recent attendance:', e));
    }

    const nowEl = document.getElementById('currentTime');
    function updateTime() {
        if (nowEl) nowEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    updateTime();
    setInterval(updateTime, 60000);

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const view = item.dataset.view;
            
            if (view === 'dashboard') {
                loadTemplate(dashboardTpl, 'Dashboard');
            } else if (view === 'qr-generator') {
                loadTemplate(qrGeneratorTpl, 'QR Code Generator');
            } else if (view === 'employee-management') {
                loadTemplate(employeeManagementTpl, 'Employee Management');
            }
        });
    });
});

