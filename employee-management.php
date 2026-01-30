<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Management | Attendance System</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="employee-management.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
</head>
<body>

    <div id="dashboard" class="dashboard-container">
        <?php include 'components/header.php'; ?>

        <div class="dashboard-layout">
            <?php include 'components/sidebar.php'; ?>

            <main class="main-content" id="mainContent">
                <div class="content-header">
                    <div class="header-content">
                        <h1 id="pageTitle">Employee Management</h1>
                        <p class="page-subtitle">Manage employee records and information</p>
                    </div>
                    <div class="header-actions-right">
                        <button class="btn-icon" id="refreshData" title="Refresh">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </div>
                
                <div class="content-view" id="contentView"></div>
            </main>
        </div>
    </div>

    <!-- Employee Management Template -->
    <template id="employeeManagementView">
        <div class="employee-management-view">
            <!-- Header Section -->
            <div class="management-header">
                <div class="header-actions">
                    <button class="btn-primary" id="addEmployeeBtn">
                        <i class="fas fa-user-plus"></i> Add New Employee
                    </button>
                </div>
            </div>

            <!-- Filters Section -->
            <div class="card">
                <div class="card-header">
                    <h3>Filters & Search</h3>
                </div>
                <div class="card-body">
                    <div class="filters-container">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" id="searchInput" placeholder="Search by name or ID...">
                        </div>
                        
                        <div class="filter-group">
                            <select id="departmentFilter">
                                <option value="">All Departments</option>
                                <option value="admin">Administration</option>
                                <option value="it">IT</option>
                                <option value="hr">Human Resources</option>
                                <option value="sales">Sales</option>
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <select id="statusFilter">
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="leave">On Leave</option>
                            </select>
                        </div>

                        <div class="filter-group">
                            <button class="btn-secondary" id="applyFiltersBtn">
                                <i class="fas fa-filter"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Employees Table -->
            <div class="card">
                <div class="card-header">
                    <h3>Employees List</h3>
                    <div class="header-actions">
                        <button class="btn-sm" id="refreshEmployeesBtn">
                            <i class="fas fa-sync-alt"></i> Refresh
                        </button>
                        <button class="btn-sm" id="exportEmployeesBtn">
                            <i class="fas fa-download"></i> Export
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Photo</th>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Department</th>
                                    <th>Position</th>
                                    <th>Status</th>
                                    <th>Join Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="employeeTableBody">
                                <tr>
                                    <td colspan="8" class="empty-state">Loading employees...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div class="pagination">
                <button class="page-btn" id="prevPageBtn">
                    <i class="fas fa-chevron-left"></i> Previous
                </button>
                <span class="page-info" id="pageInfo">Page 1 of 1</span>
                <button class="page-btn" id="nextPageBtn">
                    Next <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    </template>
<!-- Add/Edit Employee Modal -->
<div id="employeeModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <div class="modal-title-container">
                <i class="modal-icon fas fa-user-plus" id="modalIcon"></i>
                <div>
                    <h2 id="modalTitle">Add New Employee</h2>
                    <p class="modal-subtitle" id="modalSubtitle">Fill in the employee details below</p>
                </div>
            </div>
            <button class="modal-close" id="closeModalBtn">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="employeeForm">
                <input type="hidden" id="employeeIdHidden">
                
                <!-- Basic Information Section -->
                <div class="form-section">
                    <div class="form-section-card">
                        <div class="section-header">
                            <i class="fas fa-info-circle"></i>
                            <div>
                                <h3>Basic Information</h3>
                                <p style="font-size: 12px; color: var(--text-tertiary); margin: 0;">Employee's personal details and identification</p>
                            </div>
                        </div>
                        <div class="form-row">
                            <!-- Profile Photo Upload -->
                            <div class="form-group photo-upload-group">
                                <label for="employeePhoto">
                                    <i class="fas fa-camera"></i>
                                    Profile Photo
                                </label>
                                <div class="photo-upload-container" id="photoUploadContainer">
                                    <div class="photo-preview" id="photoPreview">
                                        <i class="fas fa-user-circle"></i>
                                        <span>No photo</span>
                                    </div>
                                    <div class="photo-actions">
                                        <input type="file" id="employeePhoto" class="photo-input" accept="image/jpeg,image/png,image/gif,image/jpg" capture="environment">
                                        <label for="employeePhoto" class="btn-photo-upload">
                                            <i class="fas fa-upload"></i>
                                            <span>Upload Photo</span>
                                        </label>
                                        <button type="button" class="btn-photo-remove" id="removePhotoBtn" title="Remove photo" disabled>
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="input-hint">
                                    <i class="fas fa-info-circle"></i>
                                    JPG, PNG, GIF. Max 5MB. Recommended: 200x200px
                                </div>
                            </div>
                            <div class="form-group" style="flex: 1;">
                                <label for="employeeId">
                                    <i class="fas fa-fingerprint"></i>
                                    Employee ID
                                </label>
                                <div class="input-with-icon">
                                    <i class="input-icon fas fa-id-badge"></i>
                                    <input type="text" id="employeeId" class="form-control" placeholder="EMP001" readonly>
                                </div>
                                <div class="input-hint">
                                    <i class="fas fa-lightbulb"></i>
                                    Auto-generated unique identifier
                                </div>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group" style="flex: 1;">
                                <label for="employeeName">
                                    <i class="fas fa-user"></i>
                                    Full Name <span class="required">*</span>
                                </label>
                                <div class="input-with-icon">
                                    <i class="input-icon fas fa-user-circle"></i>
                                    <input type="text" id="employeeName" class="form-control" placeholder="e.g., John Michael Doe" required>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Contact Details Section -->
                <div class="form-section">
                    <div class="form-section-card">
                        <div class="section-header">
                            <i class="fas fa-address-card"></i>
                            <div>
                                <h3>Contact Details</h3>
                                <p style="font-size: 12px; color: var(--text-tertiary); margin: 0;">How to reach the employee</p>
                            </div>
                        </div>
                        <div class="form-row three-columns">
                            <div class="form-group">
                                <label for="employeeEmail">
                                    <i class="fas fa-envelope"></i>
                                    Email Address <span class="required">*</span>
                                </label>
                                <div class="input-with-icon">
                                    <i class="input-icon fas fa-at"></i>
                                    <input type="email" id="employeeEmail" class="form-control" placeholder="john.doe@company.com" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="employeePhone">
                                    <i class="fas fa-phone"></i>
                                    Phone Number
                                </label>
                                <div class="input-with-icon">
                                    <i class="input-icon fas fa-mobile-alt"></i>
                                    <input type="tel" id="employeePhone" class="form-control" placeholder="+1 (555) 000-0000">
                                </div>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group" style="flex: 1;">
                                <label for="employeeAddress">
                                    <i class="fas fa-map-marker-alt"></i>
                                    Full Address
                                </label>
                                <div class="input-with-icon">
                                    <i class="input-icon fas fa-home"></i>
                                    <input type="text" id="employeeAddress" class="form-control" placeholder="123 Main Street, City, State 12345">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Employment Details Section -->
                <div class="form-section">
                    <div class="form-section-card">
                        <div class="section-header">
                            <i class="fas fa-briefcase"></i>
                            <div>
                                <h3>Employment Details</h3>
                                <p style="font-size: 12px; color: var(--text-tertiary); margin: 0;">Job position and status information</p>
                            </div>
                        </div>
                        <div class="form-row three-columns">
                            <div class="form-group">
                                <label for="employeeDepartment">
                                    <i class="fas fa-building"></i>
                                    Department <span class="required">*</span>
                                </label>
                                <div class="select-with-icon">
                                    <i class="input-icon fas fa-sitemap"></i>
                                    <select id="employeeDepartment" class="form-control" required>
                                        <option value="">Select Department</option>
                                        <option value="admin">Administration</option>
                                        <option value="it">Information Technology</option>
                                        <option value="hr">Human Resources</option>
                                        <option value="sales">Sales & Marketing</option>
                                        <option value="finance">Finance</option>
                                        <option value="operations">Operations</option>
                                        <option value="customer_support">Customer Support</option>
                                        <option value="legal">Legal</option>
                                    </select>
                                    <i class="select-arrow fas fa-chevron-down"></i>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="employeePosition">
                                    <i class="fas fa-user-tie"></i>
                                    Position <span class="required">*</span>
                                </label>
                                <div class="input-with-icon">
                                    <i class="input-icon fas fa-briefcase"></i>
                                    <input type="text" id="employeePosition" class="form-control" placeholder="e.g., Senior Software Engineer" required>
                                </div>
                            </div>
                        </div>
                        <div class="form-row three-columns">
                            <div class="form-group">
                                <label for="employeeStatus">
                                    <i class="fas fa-user-check"></i>
                                    Status <span class="required">*</span>
                                </label>
                                <div class="select-with-icon">
                                    <i class="input-icon fas fa-circle"></i>
                                    <select id="employeeStatus" class="form-control" required>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="leave">On Leave</option>
                                        <option value="training">In Training</option>
                                        <option value="probation">Probation</option>
                                    </select>
                                    <i class="select-arrow fas fa-chevron-down"></i>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="employeeJoinDate">
                                    <i class="fas fa-calendar-alt"></i>
                                    Join Date <span class="required">*</span>
                                </label>
                                <div class="input-with-icon">
                                    <i class="input-icon fas fa-calendar-check"></i>
                                    <input type="date" id="employeeJoinDate" class="form-control" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="employeeEndDate">
                                    <i class="fas fa-calendar-times"></i>
                                    End Date
                                </label>
                                <div class="input-with-icon">
                                    <i class="input-icon fas fa-calendar-minus"></i>
                                    <input type="date" id="employeeEndDate" class="form-control">
                                </div>
                                <div class="input-hint">
                                    <i class="fas fa-info-circle"></i>
                                    Optional - for contracts or temporary positions
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" id="cancelModalBtn">
                        <i class="fas fa-times"></i>
                        Cancel
                    </button>
                    <button type="submit" class="btn-primary" id="saveEmployeeBtn">
                        <i class="fas fa-save"></i>
                        <span id="saveButtonText">Save Employee</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

    <!-- Delete Confirmation Modal -->
    <div id="deleteConfirmationModal" class="confirmation-modal">
        <div class="confirmation-content">
            <div class="confirmation-icon">
                <i class="fas fa-trash-alt"></i>
            </div>
            <h3 class="confirmation-title">Delete Employee?</h3>
            <p class="confirmation-message">Are you sure you want to delete this employee? This action cannot be undone.</p>
            <div class="confirmation-actions">
                <button class="btn-cancel-delete" id="cancelDeleteBtn">Cancel</button>
                <button class="btn-confirm-delete" id="confirmDeleteBtn">Delete</button>
            </div>
        </div>
    </div>

    <script src="employee-management.js"></script>
</body>
</html>
