# Project Structure & File Organization

## Complete Directory Tree

```
📁 Attendance monitoring/
│
├─ 📁 frontend/                          # Admin Web Dashboard (HTML/CSS/JS)
│  ├─ 📁 pages/                          # HTML Pages
│  │  ├─ index.html                      # Main entry point
│  │  ├─ login.html                      # Admin login page
│  │  ├─ dashboard.html                  # Main admin dashboard
│  │  ├─ qr-generator.html               # QR code generator page
│  │  ├─ employees.html                  # Employee management
│  │  └─ attendance-report.html           # Reports & analytics
│  │
│  ├─ 📁 assets/
│  │  ├─ 📁 css/                         # Stylesheets
│  │  │  ├─ common.css                   # Global styles
│  │  │  ├─ login.css                    # Login page styles
│  │  │  ├─ admindashboard.css           # Dashboard styles
│  │  │  ├─ qr-generator.css             # QR generator styles
│  │  │  ├─ employees.css                # Employee page styles
│  │  │  └─ responsive.css               # Mobile responsive
│  │  │
│  │  ├─ 📁 js/                          # JavaScript Files
│  │  │  ├─ api-client.js                # Centralized API calls
│  │  │  ├─ login.js                     # Login logic
│  │  │  ├─ dashboard.js                 # Dashboard initialization
│  │  │  ├─ admindashboard.js            # Dashboard features
│  │  │  ├─ qr-generator.js              # QR code display & rotation
│  │  │  ├─ attendance-monitor.js        # Real-time attendance
│  │  │  ├─ employee-manager.js          # Employee CRUD
│  │  │  ├─ report-generator.js          # Reports & export
│  │  │  ├─ websocket.js                 # Real-time updates
│  │  │  ├─ storage.js                   # LocalStorage wrapper
│  │  │  └─ utils.js                     # Utility functions
│  │  │
│  │  └─ 📁 images/
│  │     ├─ logo.png
│  │     ├─ favicon.ico
│  │     └─ 📁 icons/
│  │        ├─ user-icon.svg
│  │        ├─ qr-icon.svg
│  │        └─ check-icon.svg
│  │
│  └─ package.json (if using build tools)
│
├─ 📁 backend/                           # Node.js/Express REST API
│  ├─ 📁 routes/                         # API Route Handlers
│  │  ├─ auth.js                         # Auth routes (login, logout, refresh)
│  │  ├─ qr.js                           # QR generation & validation routes
│  │  ├─ attendance.js                   # Attendance scanning & history
│  │  ├─ employees.js                    # Employee management routes
│  │  ├─ reports.js                      # Report generation routes
│  │  └─ logs.js                         # Audit logs routes
│  │
│  ├─ 📁 controllers/                    # Business Logic
│  │  ├─ authController.js               # Authentication logic
│  │  ├─ qrController.js                 # QR code logic
│  │  ├─ attendanceController.js         # Attendance processing
│  │  ├─ employeeController.js           # Employee operations
│  │  ├─ reportController.js             # Report generation
│  │  └─ logController.js                # Logging & audit
│  │
│  ├─ 📁 models/                         # Database Models
│  │  ├─ User.js                         # User model
│  │  ├─ Attendance.js                   # Attendance model
│  │  ├─ QRToken.js                      # QR token model
│  │  ├─ Employee.js                     # Employee extensions
│  │  ├─ AdminLog.js                     # Audit log model
│  │  └─ Shift.js                        # Shift scheduling
│  │
│  ├─ 📁 middleware/                     # Express Middleware
│  │  ├─ auth.js                         # JWT verification
│  │  ├─ errorHandler.js                 # Error handling
│  │  ├─ validation.js                   # Input validation
│  │  ├─ corsConfig.js                   # CORS setup
│  │  └─ requestLogger.js                # Request logging
│  │
│  ├─ 📁 utils/                          # Utility Functions
│  │  ├─ qrGenerator.js                  # QR code generation
│  │  ├─ tokenManager.js                 # Token creation & validation
│  │  ├─ emailService.js                 # Email notifications
│  │  ├─ pdfGenerator.js                 # PDF export
│  │  ├─ csvExporter.js                  # CSV export
│  │  ├─ gpsValidator.js                 # GPS radius check
│  │  ├─ deviceFingerprint.js            # Device identification
│  │  └─ validators.js                   # Data validators
│  │
│  ├─ 📁 config/                         # Configuration Files
│  │  ├─ database.js                     # MySQL connection
│  │  ├─ environment.js                  # Environment variables
│  │  ├─ jwt.js                          # JWT config
│  │  ├─ qr.js                           # QR settings
│  │  └─ email.js                        # Email config
│  │
│  ├─ 📁 logs/                           # Application Logs
│  │  ├─ errors.log
│  │  ├─ requests.log
│  │  └─ audit.log
│  │
│  ├─ server.js / app.js                 # Main entry point
│  ├─ package.json                       # Dependencies
│  ├─ .env                               # Environment variables
│  └─ .env.example                       # Example env file
│
├─ 📁 mobile-app/                        # React Native / Flutter App
│  ├─ 📁 src/
│  │  ├─ 📁 screens/                     # Screen Components
│  │  │  ├─ LoginScreen.js               # Employee login
│  │  │  ├─ ScanQRScreen.js              # QR scanner screen
│  │  │  ├─ AttendanceHistoryScreen.js   # History view
│  │  │  ├─ ProfileScreen.js             # User profile
│  │  │  └─ SplashScreen.js              # Loading screen
│  │  │
│  │  ├─ 📁 components/                  # Reusable Components
│  │  │  ├─ QRScanner.js                 # QR scanning component
│  │  │  ├─ AttendanceCard.js            # Attendance display
│  │  │  ├─ LoadingIndicator.js          # Loading spinner
│  │  │  ├─ Header.js                    # App header
│  │  │  ├─ BottomNav.js                 # Navigation bar
│  │  │  └─ Modal.js                     # Modal dialogs
│  │  │
│  │  ├─ 📁 services/                    # Business Logic
│  │  │  ├─ api.js                       # API client
│  │  │  ├─ storage.js                   # Local storage
│  │  │  ├─ gps.js                       # GPS service
│  │  │  ├─ camera.js                    # Camera permissions
│  │  │  ├─ notifications.js             # Push notifications
│  │  │  └─ sync.js                      # Offline sync
│  │  │
│  │  ├─ 📁 context/                     # React Context
│  │  │  ├─ AuthContext.js               # Auth state
│  │  │  ├─ AttendanceContext.js         # Attendance state
│  │  │  └─ AppContext.js                # Global state
│  │  │
│  │  ├─ 📁 hooks/                       # Custom Hooks
│  │  │  ├─ useAuth.js
│  │  │  ├─ useLocation.js
│  │  │  └─ useOfflineSync.js
│  │  │
│  │  ├─ 📁 constants/
│  │  │  ├─ colors.js
│  │  │  ├─ strings.js
│  │  │  └─ config.js
│  │  │
│  │  ├─ App.js                          # Main app component
│  │  ├─ index.js                        # Entry point
│  │  └─ Navigation.js                   # App navigation
│  │
│  ├─ android/                           # Android native code
│  ├─ ios/                               # iOS native code
│  ├─ package.json
│  ├─ app.json
│  └─ .env
│
├─ 📁 database/                          # Database Scripts
│  ├─ schema.sql                         # Database schema
│  ├─ seeders.sql                        # Sample data
│  ├─ migrations/
│  │  ├─ 001_create_users.sql
│  │  ├─ 002_create_attendance.sql
│  │  ├─ 003_create_qr_tokens.sql
│  │  └─ 004_create_logs.sql
│  └─ backups/
│     └─ attendance_backup_2026-01-16.sql
│
├─ 📁 docs/                              # Documentation
│  ├─ SETUP.md                           # Installation guide
│  ├─ API_DOCS.md                        # API reference
│  ├─ DATABASE_SCHEMA.md                 # DB documentation
│  ├─ SECURITY.md                        # Security guidelines
│  ├─ TROUBLESHOOTING.md                 # Troubleshooting guide
│  └─ USER_MANUAL.md                     # User guide
│
├─ 📁 tests/                             # Test Files
│  ├─ 📁 unit/
│  │  ├─ auth.test.js
│  │  ├─ qr.test.js
│  │  └─ attendance.test.js
│  ├─ 📁 integration/
│  │  └─ api.test.js
│  └─ 📁 e2e/
│     └─ user-flow.test.js
│
├─ WORKFLOW.md                           # This workflow document
├─ PROJECT_STRUCTURE.md                  # This file
├─ README.md                             # Project overview
├─ .gitignore                            # Git ignore rules
├─ docker-compose.yml                    # Docker setup (optional)
└─ .env.example                          # Example environment config

```

---

## File Organization by Responsibility

### Frontend Files

#### Authentication (`frontend/assets/js/login.js`)
- Handle login form submission
- Store JWT token
- Redirect to dashboard

#### Dashboard (`frontend/assets/js/admindashboard.js`)
- Initialize dashboard
- Load employee list
- Display metrics

#### QR Generator (`frontend/assets/js/qr-generator.js`)
- Generate QR code via API
- Display QR on screen
- Handle auto-rotation
- Handle manual refresh

#### Attendance Monitor (`frontend/assets/js/attendance-monitor.js`)
- Connect to WebSocket or polling
- Display real-time attendance
- Show check-in/out notifications
- Update live dashboard

#### Employee Manager (`frontend/assets/js/employee-manager.js`)
- Display employee list
- Add/edit/delete employees
- Search and filter
- Bulk operations

#### API Client (`frontend/assets/js/api-client.js`)
- Centralized API calls
- Handle authentication
- Manage headers
- Error handling

---

### Backend Files

#### Authentication (`backend/routes/auth.js` + `backend/controllers/authController.js`)
- Login endpoint
- Token refresh
- Logout
- Password reset

#### QR Management (`backend/routes/qr.js` + `backend/controllers/qrController.js`)
- Generate QR token
- Validate token
- Rotate QR
- Expire old tokens

#### Attendance (`backend/routes/attendance.js` + `backend/controllers/attendanceController.js`)
- Process QR scan
- Validate employee status
- Record time-in/out
- Retrieve history

#### Employee Management (`backend/routes/employees.js` + `backend/controllers/employeeController.js`)
- CRUD operations
- Shift assignment
- Deactivation

#### Reports (`backend/routes/reports.js` + `backend/controllers/reportController.js`)
- Generate daily/monthly reports
- Export CSV/PDF
- Analytics calculations

---

### Mobile App Files

#### Login (`mobile-app/src/screens/LoginScreen.js`)
- Email/password input
- Authentication API call
- Token storage

#### QR Scanner (`mobile-app/src/screens/ScanQRScreen.js`)
- Camera permission request
- Scan QR code
- Parse QR data
- Submit to backend

#### Attendance History (`mobile-app/src/screens/AttendanceHistoryScreen.js`)
- Fetch attendance records
- Display in list
- Date filtering

#### API Service (`mobile-app/src/services/api.js`)
- HTTP client setup
- Interceptors for auth
- Error handling

---

## Development Tips

### Best Practices
1. **Separate concerns**: Logic in controllers, utilities, data in models
2. **DRY principle**: Use shared utils and components
3. **Consistent naming**: Use camelCase for JS, snake_case for DB
4. **Environment config**: Use `.env` for sensitive data
5. **Error handling**: Consistent error responses

### File Naming Conventions
- Routes: `featureName.js` (e.g., `auth.js`)
- Controllers: `featureNameController.js`
- Models: `FeatureName.js` (PascalCase)
- Utilities: `utilityName.js`
- Components: `ComponentName.js` (PascalCase)
- Screens: `ScreenName.js` (React Native)
- Styles: `featureName.css` or `FeatureName.module.css`

### Import Structure
```javascript
// External imports
import express from 'express';
import db from '../config/database';

// Internal imports
import { authMiddleware } from '../middleware/auth';
import { User } from '../models/User';
```

---

## Next Steps

1. **Create empty files** in each directory
2. **Set up git repository**
3. **Initialize backend** (Node.js + Express)
4. **Initialize frontend** (HTML/CSS structure)
5. **Initialize mobile** (React Native or Flutter)
6. **Create database schema**
7. **Build authentication system**
8. **Implement core features**

