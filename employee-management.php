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
                <h2 id="modalTitle">Add New Employee</h2>
                <button class="modal-close" id="closeModalBtn">&times;</button>
            </div>
            <div class="modal-body">
                <form id="employeeForm">
                    <input type="hidden" id="employeeIdHidden">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="employeeId">Employee ID</label>
                            <input type="text" id="employeeId" class="form-control" placeholder="EMP001" readonly>
                        </div>
                        <div class="form-group">
                            <label for="employeeName">Full Name</label>
                            <input type="text" id="employeeName" class="form-control" placeholder="John Doe" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="employeeEmail">Email</label>
                            <input type="email" id="employeeEmail" class="form-control" placeholder="john@example.com" required>
                        </div>
                        <div class="form-group">
                            <label for="employeePhone">Phone</label>
                            <input type="tel" id="employeePhone" class="form-control" placeholder="+1 234 567 8900">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="employeeDepartment">Department</label>
                            <select id="employeeDepartment" class="form-control" required>
                                <option value="">Select Department</option>
                                <option value="admin">Administration</option>
                                <option value="it">IT</option>
                                <option value="hr">Human Resources</option>
                                <option value="sales">Sales</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="employeePosition">Position</label>
                            <input type="text" id="employeePosition" class="form-control" placeholder="Manager" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="employeeStatus">Status</label>
                            <select id="employeeStatus" class="form-control" required>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="leave">On Leave</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="employeeJoinDate">Join Date</label>
                            <input type="date" id="employeeJoinDate" class="form-control" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group" style="grid-column: 1 / -1;">
                            <label for="employeeAddress">Address</label>
                            <input type="text" id="employeeAddress" class="form-control" placeholder="123 Street Name">
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="btn-secondary" id="cancelModalBtn">Cancel</button>
                        <button type="submit" class="btn-primary">Save Employee</button>
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
