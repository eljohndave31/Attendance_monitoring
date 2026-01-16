 // QR Generator State
        let qrState = {
            currentToken: null,
            expiryTime: null,
            refreshInterval: null,
            qrInstance: null,
            isGenerating: true,
            location: 'office_main'
        };

        // Generate random token
        function generateToken() {
            return 'QR-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        }

        // Create live QR code (payload as JSON)
        function createLiveQRCode() {
            const container = document.getElementById('liveQRCode');
            if (!container) return;

            const token = generateToken();
            const expiryMinutes = parseInt(document.getElementById('qrExpiry')?.value || '5');
            const locationId = document.getElementById('qrLocation')?.value || 'office_main';

            const generatedAt = new Date();
            const expiresAt = new Date(generatedAt.getTime() + expiryMinutes * 60000);

            // Build payload according to requested structure
            const payload = {
                token: token,
                generated_at: generatedAt.toISOString(),
                expires_at: expiresAt.toISOString(),
                location_id: locationId
            };

            // Save state
            qrState.currentToken = token;
            qrState.expiryTime = expiresAt;
            qrState.currentPayload = payload;

            // Clear previous QR
            container.innerHTML = '';

            // Create QR code with JSON payload string
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

            // Update live display
            updateLiveDisplay();
        }

        // Update live display info
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

            // Update countdown
            if (expiry && qrState.expiryTime) {
                updateCountdown(expiry, qrState.expiryTime);
            }
        }

        // Update countdown timer
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

        // Add QR history row
        function addQRHistory(token, generatedAtISO, expiresAtISO, location, scans = 0) {
            const historyTable = document.getElementById('qrHistory');
            if (!historyTable) return;

            const row = document.createElement('tr');
            const generatedDisplay = new Date(generatedAtISO).toLocaleString();
            const expiresDisplay = new Date(expiresAtISO).toLocaleString();

            row.innerHTML = `
                <td><code>${token}</code></td>
                <td>${generatedDisplay}</td>
                <td>${expiresDisplay}</td>
                <td>${location}</td>
                <td><span class="badge badge-info">${scans}</span></td>
                <td><span class="badge badge-success">Active</span></td>
            `;

            historyTable.insertBefore(row, historyTable.firstChild);

            // Keep only last 5 rows
            while (historyTable.children.length > 5) {
                historyTable.removeChild(historyTable.lastChild);
            }
        }

        // Setup QR Generator View
        function setupQRGeneratorView() {
            // Event listeners for form
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
                    const locationText = document.getElementById('qrLocation').options[document.getElementById('qrLocation').selectedIndex].text;
                    if (qrState.currentPayload) {
                        addQRHistory(qrState.currentPayload.token, qrState.currentPayload.generated_at, qrState.currentPayload.expires_at, locationText);
                    }
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

            // Auto-refresh QR code based on interval
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

            // Generate initial QR on view load
            createLiveQRCode();
            const locationText = document.getElementById('qrLocation')?.options[document.getElementById('qrLocation').selectedIndex]?.text;
            if (qrState.currentPayload) {
                addQRHistory(qrState.currentPayload.token, qrState.currentPayload.generated_at, qrState.currentPayload.expires_at, locationText || 'Office Main');
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const contentView = document.getElementById('contentView');
            const dashboardTpl = document.getElementById('dashboardView');
            const qrGeneratorTpl = document.getElementById('qrGeneratorView');
            const employeeManagementTpl = document.getElementById('employeeManagementView');
            const pageTitle = document.getElementById('pageTitle');
            const breadcrumb = document.getElementById('breadcrumb');

            // Employee Management Data Storage
            let employeesData = [];
            let currentPage = 1;
            const itemsPerPage = 10;

            // Sample employee data
            const sampleEmployees = [
                {
                    id: 'EMP001',
                    firstName: 'Cristian Lyle',
                    lastName: 'Dejan',
                    email: 'cristianlyle@company.com',
                    department: 'it',
                    position: 'Senior Developer',
                    phone: '+1234567890',
                    joinDate: '2022-01-15',
                    salary: 75000,
                    status: 'active',
                    address: 'taca Tunghaan Minglanilla'
                },
                {
                    id: 'EMP002',
                    firstName: 'Irish',
                    lastName: 'Revira',
                    email: 'Irishrevira@company.com',
                    department: 'hr',
                    position: 'HR Manager',
                    phone: '+1234567891',
                    joinDate: '2021-06-20',
                    salary: 65000,
                    status: 'active',
                    address: 'Tubod Minglanilla'
                },
            ];

            employeesData = [...sampleEmployees];

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
                const importBtn = document.getElementById('importEmployees');
                const prevPageBtn = document.getElementById('prevPage');
                const nextPageBtn = document.getElementById('nextPage');
                const selectAllCheckbox = document.querySelector('.select-all');

                // Load employees
                loadEmployeesList();

                // Open add employee modal
                addEmployeeBtn.addEventListener('click', () => {
                    document.getElementById('modalTitle').textContent = 'Add New Employee';
                    employeeForm.reset();
                    employeeForm.dataset.editing = 'false';
                    employeeForm.dataset.editId = '';
                    employeeModal.classList.add('show');
                });

                // Close modal
                closeModal.addEventListener('click', () => employeeModal.classList.remove('show'));
                cancelModal.addEventListener('click', () => employeeModal.classList.remove('show'));

                // Close modal on outside click
                employeeModal.addEventListener('click', (e) => {
                    if (e.target === employeeModal) {
                        employeeModal.classList.remove('show');
                    }
                });

                // Submit form
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

                    if (isEditing) {
                        const index = employeesData.findIndex(e => e.id === editId);
                        if (index > -1) {
                            employeesData[index] = employee;
                        }
                    } else {
                        employeesData.push(employee);
                    }

                    loadEmployeesList();
                    employeeModal.classList.remove('show');
                });

                // Search and filter
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

                // Export employees
                exportBtn.addEventListener('click', () => {
                    const csv = convertToCSV(employeesData);
                    downloadCSV(csv, 'employees.csv');
                });

                // Pagination
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

                // Select all checkbox
                selectAllCheckbox.addEventListener('change', (e) => {
                    const checkboxes = document.querySelectorAll('.data-table tbody input[type="checkbox"]');
                    checkboxes.forEach(cb => cb.checked = e.target.checked);
                });

                function loadEmployeesList() {
                    const searchTerm = employeeSearch.value.toLowerCase();
                    const department = departmentFilter.value;
                    const status = statusFilter.value;

                    let filtered = employeesData.filter(emp => {
                        const matchSearch = emp.firstName.toLowerCase().includes(searchTerm) ||
                            emp.lastName.toLowerCase().includes(searchTerm) ||
                            emp.id.toLowerCase().includes(searchTerm) ||
                            emp.email.toLowerCase().includes(searchTerm);
                        const matchDept = !department || emp.department === department;
                        const matchStatus = !status || emp.status === status;
                        return matchSearch && matchDept && matchStatus;
                    });

                    const totalPages = Math.ceil(filtered.length / itemsPerPage);
                    if (currentPage > totalPages && totalPages > 0) {
                        currentPage = totalPages;
                    }

                    const start = (currentPage - 1) * itemsPerPage;
                    const paged = filtered.slice(start, start + itemsPerPage);

                    const tbody = document.getElementById('employeesList');
                    tbody.innerHTML = '';

                    if (paged.length === 0) {
                        tbody.innerHTML = '<tr class="empty-state"><td colspan="9" style="text-align: center; padding: 40px;"><i class="fas fa-inbox" style="font-size: 48px; color: var(--border-color); margin-bottom: 10px;"></i><p>No employees found</p></td></tr>';
                    } else {
                        paged.forEach(emp => {
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

                        // Attach event listeners to action buttons
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

                    // Update pagination
                    prevPageBtn.disabled = currentPage === 1;
                    nextPageBtn.disabled = currentPage >= totalPages;
                    document.getElementById('pageNumber').textContent = `Page ${currentPage} of ${totalPages > 0 ? totalPages : 1}`;
                }

                function editEmployee(id) {
                    const emp = employeesData.find(e => e.id === id);
                    if (!emp) return;

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

                    employeeForm.dataset.editing = 'true';
                    employeeForm.dataset.editId = id;
                    employeeModal.classList.add('show');
                }

                function deleteEmployee(id) {
                    if (confirm('Are you sure you want to delete this employee?')) {
                        employeesData = employeesData.filter(e => e.id !== id);
                        loadEmployeesList();
                    }
                }

                function viewEmployee(id) {
                    const emp = employeesData.find(e => e.id === id);
                    if (!emp) return;
                    alert(`${emp.firstName} ${emp.lastName}\n${emp.email}\n${emp.position}`);
                }
            }

            function convertToCSV(data) {
                const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Department', 'Position', 'Phone', 'Join Date', 'Salary', 'Status'];
                const rows = data.map(emp => [
                    emp.id,
                    emp.firstName,
                    emp.lastName,
                    emp.email,
                    emp.department,
                    emp.position,
                    emp.phone,
                    emp.joinDate,
                    emp.salary,
                    emp.status
                ]);
                
                let csv = headers.join(',') + '\n';
                rows.forEach(row => {
                    csv += row.map(cell => `"${cell}"`).join(',') + '\n';
                });
                return csv;
            }

            function downloadCSV(csv, filename) {
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
            }

            // Load the main dashboard view by default
            loadTemplate(dashboardTpl);

            // Populate recent attendance sample data
            const recent = document.getElementById('recentAttendance');
            if (recent) {
                const sample = [
                    { time: '10:00 PM', name: 'Cristian Gwapo', status: 'Present' },
                    { time: '09:25 PM', name: 'Irish Revira', status: 'Late' },
                ];
                sample.forEach(s => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td>${s.time}</td><td>${s.name}</td><td>${s.status}</td><td><button class="btn-sm">View</button></td>`;
                    recent.appendChild(tr);
                });
            }

            // Update sidebar current time
            const nowEl = document.getElementById('currentTime');
            function updateTime() {
                if (nowEl) nowEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
            updateTime();
            setInterval(updateTime, 60000);

            // Navigation between template views
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
                    } else {
                        contentView.innerHTML = `<div class="card"><div class="card-body"><p>View: ${view} (not implemented)</p></div></div>`;
                        pageTitle.textContent = view.replace('-', ' ').toUpperCase();
                    }
                });
            });
        });