# Attendance Monitoring System - Complete Workflow

## Project Structure

```
Attendance monitoring/
├── frontend/                    # Admin Web Dashboard
│   ├── pages/
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── employees.html
│   │   ├── attendance-report.html
│   │   └── qr-generator.html
│   ├── assets/
│   │   ├── css/
│   │   │   ├── login.css
│   │   │   ├── admindashboard.css
│   │   │   └── common.css
│   │   ├── js/
│   │   │   ├── login.js
│   │   │   ├── admindashboard.js
│   │   │   ├── dashboard.js
│   │   │   ├── qr-generator.js
│   │   │   ├── employee-manager.js
│   │   │   ├── attendance-monitor.js
│   │   │   └── api-client.js
│   │   └── images/
│   │       ├── logo.png
│   │       └── icons/
│   └── index.html               # Main entry point
│
├── backend/                     # Node.js/PHP REST API
│   ├── routes/
│   │   ├── auth.js             # Login, JWT
│   │   ├── qr.js               # QR generation & validation
│   │   ├── attendance.js        # Attendance records
│   │   ├── employees.js         # Employee management
│   │   └── reports.js           # Analytics & exports
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── qrController.js
│   │   ├── attendanceController.js
│   │   ├── employeeController.js
│   │   └── reportController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Attendance.js
│   │   ├── QRToken.js
│   │   └── Employee.js
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── utils/
│   │   ├── qrGenerator.js       # QR code logic
│   │   ├── tokenManager.js      # Token creation/validation
│   │   ├── emailService.js
│   │   └── validators.js
│   ├── config/
│   │   ├── database.js
│   │   ├── environment.js
│   │   └── jwt.js
│   ├── server.js / app.js       # Main entry
│   └── package.json
│
├── mobile-app/                  # React Native / Flutter
│   ├── src/
│   │   ├── screens/
│   │   │   ├── LoginScreen.js
│   │   │   ├── ScanQRScreen.js
│   │   │   ├── AttendanceHistoryScreen.js
│   │   │   └── ProfileScreen.js
│   │   ├── components/
│   │   │   ├── QRScanner.js
│   │   │   ├── AttendanceCard.js
│   │   │   └── LoadingIndicator.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── storage.js
│   │   │   └── gps.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── AttendanceContext.js
│   │   └── App.js
│   └── package.json
│
├── database/
│   ├── schema.sql               # Database tables
│   └── migrations.sql           # Update scripts
│
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── INSTALLATION.md
│   └── USER_GUIDE.md
│
├── .env.example
├── README.md
└── WORKFLOW.md                  # This file
```

---

## 1. Admin Workflow (Web Dashboard)

### Step 1: Admin Login
```
Admin Access → Login Page (login.html + login.js)
    ↓
Backend Validation (POST /api/auth/login)
    ↓
JWT Token Generated & Stored (localStorage)
    ↓
Redirect to Dashboard
```

**Files:**
- [frontend/pages/login.html](frontend/pages/login.html)
- [frontend/assets/js/login.js](frontend/assets/js/login.js)
- [backend/routes/auth.js](backend/routes/auth.js)
- [backend/controllers/authController.js](backend/controllers/authController.js)

---

### Step 2: QR Code Generation & Rotation
```
Admin Dashboard → Click "Generate QR Code"
    ↓
Select Location & Mode
    ↓
Backend API Call (POST /api/qr/generate)
    ↓
Generate Token with 1-5 min expiry
    ↓
Save to DB (QR_Tokens table)
    ↓
Display QR Code on Screen/Tablet
    ↓
Auto-rotate every X minutes
```

**Files:**
- [frontend/pages/qr-generator.html](frontend/pages/qr-generator.html)
- [frontend/assets/js/qr-generator.js](frontend/assets/js/qr-generator.js)
- [backend/routes/qr.js](backend/routes/qr.js)
- [backend/controllers/qrController.js](backend/controllers/qrController.js)
- [backend/utils/qrGenerator.js](backend/utils/qrGenerator.js)

---

### Step 3: Real-time Attendance Monitoring
```
Admin Dashboard → Attendance Monitoring Panel
    ↓
Live Feed Updates (WebSocket/Polling)
    ↓
Show Employee Check-In/Out
    ↓
Display Timestamps & Location
    ↓
Alert on Anomalies
```

**Files:**
- [frontend/pages/dashboard.html](frontend/pages/dashboard.html)
- [frontend/assets/js/attendance-monitor.js](frontend/assets/js/attendance-monitor.js)
- [backend/routes/attendance.js](backend/routes/attendance.js)

---

### Step 4: Employee Management
```
Admin Dashboard → Employee Management
    ↓
View/Add/Edit/Delete Employees
    ↓
Set Shift Schedules
    ↓
Activate/Deactivate Status
    ↓
Backend API Updates (CRUD operations)
```

**Files:**
- [frontend/pages/employees.html](frontend/pages/employees.html)
- [frontend/assets/js/employee-manager.js](frontend/assets/js/employee-manager.js)
- [backend/routes/employees.js](backend/routes/employees.js)

---

### Step 5: Reports & Exports
```
Admin Dashboard → Reports Section
    ↓
Select Date Range & Filters
    ↓
Backend Generates Report (POST /api/reports/generate)
    ↓
Export as CSV/PDF
    ↓
Download File
```

**Files:**
- [frontend/pages/attendance-report.html](frontend/pages/attendance-report.html)
- [backend/routes/reports.js](backend/routes/reports.js)
- [backend/controllers/reportController.js](backend/controllers/reportController.js)

---

## 2. Employee Mobile App Workflow

### Step 1: Employee Login
```
Mobile App → Login Screen
    ↓
Enter Credentials
    ↓
Backend Validation (POST /api/auth/mobile-login)
    ↓
JWT Token + Refresh Token Stored
    ↓
Navigate to Scanner Screen
```

**Files:**
- [mobile-app/src/screens/LoginScreen.js](mobile-app/src/screens/LoginScreen.js)
- [mobile-app/src/services/api.js](mobile-app/src/services/api.js)

---

### Step 2: QR Code Scanning
```
Mobile App → Tap "Scan QR"
    ↓
Request Camera Permission
    ↓
Open Camera with QR Scanner
    ↓
User Points Camera at QR Code
    ↓
QR Decoded → Extract Token
    ↓
Send to Backend (POST /api/attendance/scan)
```

**Files:**
- [mobile-app/src/screens/ScanQRScreen.js](mobile-app/src/screens/ScanQRScreen.js)
- [mobile-app/src/components/QRScanner.js](mobile-app/src/components/QRScanner.js)

---

### Step 3: Attendance Processing
```
Backend Receives QR Token
    ↓
Validate Token:
  - Check if expired
  - Check if active
  - Check location_id
    ↓
Validate Employee:
  - Check user status (active/inactive)
  - Check if already scanned today
    ↓
Determine Action:
  - First scan → Time-In
  - Second scan → Time-Out
    ↓
Save to Attendance Table
    ↓
Return Success Response
    ↓
Mobile App Shows Confirmation
    ↓
Update Attendance History
```

**Files:**
- [backend/routes/attendance.js](backend/routes/attendance.js)
- [backend/controllers/attendanceController.js](backend/controllers/attendanceController.js)
- [backend/utils/tokenManager.js](backend/utils/tokenManager.js)
- [mobile-app/src/services/api.js](mobile-app/src/services/api.js)

---

## 3. Backend API Endpoints

### Authentication
```
POST   /api/auth/login              → Admin login
POST   /api/auth/mobile-login       → Employee login
POST   /api/auth/refresh            → Refresh JWT token
POST   /api/auth/logout             → Logout
```

### QR Code Management
```
POST   /api/qr/generate             → Create new QR token
GET    /api/qr/current              → Get active QR code
GET    /api/qr/validate/:token      → Validate token
POST   /api/qr/rotate               → Force rotate QR
```

### Attendance
```
POST   /api/attendance/scan         → Process QR scan
GET    /api/attendance/today        → Get today's attendance
GET    /api/attendance/history      → Employee attendance history
GET    /api/attendance/report       → Generate report
POST   /api/attendance/override     → Admin override with logging
```

### Employee Management
```
GET    /api/employees               → List all employees
POST   /api/employees               → Create employee
GET    /api/employees/:id           → Get employee details
PUT    /api/employees/:id           → Update employee
DELETE /api/employees/:id           → Delete employee
```

### Reports
```
GET    /api/reports/daily           → Daily report
GET    /api/reports/monthly         → Monthly report
GET    /api/reports/export          → Export CSV/PDF
```

---

## 4. Database Schema

### Users Table
```sql
id (INT, PRIMARY KEY)
name (VARCHAR 255)
email (VARCHAR 255, UNIQUE)
phone (VARCHAR 20)
role (ENUM: admin, employee)
password_hash (VARCHAR 255)
department (VARCHAR 100)
status (ENUM: active, inactive)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Attendance Table
```sql
id (INT, PRIMARY KEY)
user_id (INT, FOREIGN KEY)
date (DATE)
time_in (DATETIME)
time_out (DATETIME)
location (VARCHAR 100)
source (VARCHAR 50) = 'qr'
notes (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### QR_Tokens Table
```sql
id (INT, PRIMARY KEY)
token (VARCHAR 255, UNIQUE)
generated_at (DATETIME)
expires_at (DATETIME)
location_id (VARCHAR 100)
is_active (BOOLEAN) = TRUE
created_by (INT, FOREIGN KEY → Users)
created_at (TIMESTAMP)
```

### Admin_Logs Table (Audit)
```sql
id (INT, PRIMARY KEY)
admin_id (INT, FOREIGN KEY)
action (VARCHAR 100)
description (TEXT)
affected_user_id (INT)
created_at (TIMESTAMP)
```

---

## 5. QR Code Payload (JSON)

```json
{
  "token": "abc123xyz789def456",
  "generated_at": "2026-01-16T08:00:00Z",
  "expires_at": "2026-01-16T08:05:00Z",
  "location_id": "office_main",
  "issuer": "attendance-system"
}
```

---

## 6. Security Measures

### QR Code Level
- ✅ Auto-expires every 1–5 minutes
- ✅ One-time token validation
- ✅ Server-side validation required
- ✅ Prevents screenshot reuse

### Token Level
- ✅ JWT with expiration (15 min short-lived, 7 day refresh)
- ✅ HTTPS only
- ✅ Secure HttpOnly cookies or localStorage

### Scanning Level
- ✅ One scan per employee per time window (prevents duplicate)
- ✅ Optional GPS radius validation (50m default)
- ✅ Device fingerprinting (User-Agent, Device ID)
- ✅ IP logging

### Admin Level
- ✅ All admin actions logged (who, what, when)
- ✅ Admin override requires password confirmation
- ✅ Role-based access control

---

## 7. Implementation Phases

### Phase 1: Backend Setup (Week 1)
- [ ] Set up Node.js/Express server
- [ ] Configure MySQL database
- [ ] Implement Auth system (JWT)
- [ ] Create user & attendance models
- [ ] Build QR generation logic
- [ ] API endpoints for attendance scanning

### Phase 2: Admin Dashboard (Week 2-3)
- [ ] Login page & session management
- [ ] QR code generator & display
- [ ] Real-time attendance monitoring
- [ ] Employee management CRUD
- [ ] Basic reporting

### Phase 3: Mobile App (Week 3-4)
- [ ] Setup React Native/Flutter project
- [ ] Login screen
- [ ] QR scanner implementation
- [ ] Attendance submission
- [ ] History display

### Phase 4: Testing & Deployment (Week 4-5)
- [ ] Unit & integration tests
- [ ] Security audit
- [ ] Performance testing
- [ ] User acceptance testing
- [ ] Deploy to production

---

## 8. Development Checklist

### Backend
- [ ] Database schema created
- [ ] Models defined (User, Attendance, QRToken)
- [ ] Authentication middleware
- [ ] QR generation & validation
- [ ] Attendance logic (first scan = in, second = out)
- [ ] Reports generation
- [ ] Error handling & logging
- [ ] Rate limiting
- [ ] CORS configuration

### Frontend
- [ ] Login page & flow
- [ ] Dashboard layout
- [ ] QR generator component
- [ ] Real-time attendance display
- [ ] Employee management interface
- [ ] Reports & export functionality
- [ ] Responsive design
- [ ] API client (axios/fetch wrapper)

### Mobile App
- [ ] Login screen
- [ ] QR scanner (camera permissions)
- [ ] Attendance history view
- [ ] API communication
- [ ] Offline queue (optional)
- [ ] Push notifications (optional)

---

## 9. Key File Responsibilities

| File | Purpose |
|------|---------|
| `login.js` | Handle admin authentication |
| `qr-generator.js` | Display & manage QR code |
| `admindashboard.js` | Main dashboard logic |
| `attendance-monitor.js` | Real-time attendance feed |
| `api-client.js` | Centralized API calls |
| `authController.js` | Backend auth logic |
| `qrController.js` | QR token management |
| `attendanceController.js` | Attendance recording |
| `tokenManager.js` | Token generation & validation |

---

## 10. Testing Scenarios

### QR Scanning
- ✓ Valid QR scan → Time-In recorded
- ✓ Second QR scan same day → Time-Out recorded
- ✓ Expired QR → Error message
- ✓ Invalid employee → Error message
- ✓ GPS out of range → Warning/Error

### Admin Functions
- ✓ Generate QR → Displays correctly
- ✓ Auto-rotate → Updates every X mins
- ✓ Add employee → Appears in list
- ✓ Override attendance → Logged in audit
- ✓ Export report → Downloads CSV/PDF

---

## 11. Useful References

- **QR Code Generation**: `qrcode.js` or `qrcode-npm` library
- **Mobile Scanner**: `react-native-camera` or `expo-camera`
- **JWT Auth**: `jsonwebtoken` (Node.js)
- **Database ORM**: `sequelize` or `typeorm`
- **API Testing**: Postman / Insomnia
- **Password Hashing**: `bcryptjs`

