# Quick Reference Guide - Attendance System

## 🚀 Getting Started (5 minutes)

### Essential Files to Know

```
WORKFLOW.md              ← Start here! Complete system workflow
README.md               ← Project overview and setup
PROJECT_STRUCTURE.md    ← File organization
API_DOCS.md            ← API reference
IMPLEMENTATION_GUIDE.md ← Step-by-step setup
```

---

## 🎯 System at a Glance

```
Admin (Web)           Employee (Mobile)       Backend (API)         Database (MySQL)
    │                      │                       │                     │
    ├─ Login               │                       │                     │
    │  └─► POST /auth      │                       │                     │
    │      ◄─ Token ◄──────┴───────────────────────┴─────────────────────┤
    │                      │                                              │
    ├─ Generate QR         │                                              │
    │  └─ POST /qr         │                                              │
    │     └─ Store token ─────────────────────────────────────────────────┤
    │     └─ Display       │                                              │
    │                      │                                              │
    ├─ Monitor Status      ├─ Scan QR                                     │
    │  ◄─ GET /attendance  │  └─ POST /attendance/scan                   │
    │  ◄─ WebSocket        │     └─ Validate token ──────────────────────┤
    │                      │     └─ Record time-in/out ─────────────────┬─┤
    │                      │     └─ Success ──► Display confirmation │
    │                      │                                          │
    │                      ├─ View History                            │
    │                      │  └─ GET /attendance/history ────────────────┤
    │                      │     ◄─ Display records                      │
    │                                                                     │
    ├─ View Reports                                                      │
    │  └─ GET /reports ──────────────────────────────────────────────────┤
    │     └─ Generate CSV/PDF ◄─────────────────────────────────────────┘
```

---

## 📱 Main Workflows (One-Page Reference)

### Admin: Display QR Code
1. Login → Authenticate
2. Click "Generate QR"
3. Select location & duration
4. Backend generates token + image
5. Display on screen
6. Auto-rotate every 5 minutes

### Employee: Scan QR Code
1. Open app → Login
2. Click "Scan QR Code"
3. Point camera at QR
4. Send token to backend
5. Backend validates:
   - Token not expired ✓
   - User is active ✓
   - Not already checked out ✓
6. Record time-in or time-out
7. Show confirmation

### Admin: Monitor Attendance
1. Open dashboard
2. View real-time stats
3. See employees checked in/out
4. Filter by department/status
5. Click employee for details

### Admin: View Reports
1. Select date range
2. Choose report type
3. Generate report
4. Export as CSV/PDF
5. Download file

---

## 🔑 Key Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/mobile-login` | Employee login |
| POST | `/api/qr/generate` | Create QR code |
| GET | `/api/qr/current` | Get active QR |
| POST | `/api/attendance/scan` | Record attendance |
| GET | `/api/attendance/today` | Today's status |
| GET | `/api/employees` | List employees |
| GET | `/api/reports/daily` | Daily report |

---

## 🗄️ Database Quick Map

| Table | Contains | Key Fields |
|-------|----------|-----------|
| users | Admin & employees | id, email, role, status |
| attendance | Check-in/out records | user_id, date, time_in, time_out |
| qr_tokens | Active QR codes | token, expires_at, is_active |
| admin_logs | Action audit trail | admin_id, action, description |
| qr_scan_logs | QR scan history | qr_token_id, user_id, timestamp |
| locations | Office locations | id, name, latitude, longitude |
| shifts | Work shifts | id, name, start_time, end_time |

---

## 🛠️ Setup Command Sequence

```bash
# 1. Database
mysql -u root -p < database/schema.sql

# 2. Backend
cd backend
npm install
npm install --save-dev nodemon
cp .env.example .env
npm run dev

# 3. Frontend
cd ../frontend
# Open index.html in browser

# 4. Mobile (Optional)
cd ../mobile-app
npm install
npx react-native start
```

---

## 🔐 Security Checklist

- [ ] QR codes expire after 5 minutes
- [ ] JWT tokens expire after 15 minutes
- [ ] Passwords hashed with bcryptjs
- [ ] HTTPS enabled (production)
- [ ] CORS configured
- [ ] Input validation on all endpoints
- [ ] Rate limiting enabled
- [ ] Admin actions logged
- [ ] SQL injection prevention
- [ ] XSS protection

---

## 📊 QR Code Lifecycle

```
T=0:00   Generate          ┌─────────────────┐
         └─► Save to DB    │  ACTIVE QR      │
                           │  Token: abc123  │
         Display on screen │  Expires: 5min  │
                           └─────────────────┘

T=0:30   Employee scans
         └─► Validate ✓
         └─► Record attendance

T=4:50   More scans happen
         └─► Still valid ✓

T=5:00   Expires          ┌─────────────────┐
         └─ Mark INACTIVE │ INACTIVE QR     │
         └─ Generate NEW  │ (Archived)      │
            token xyz...  └─────────────────┘
                          ┌─────────────────┐
                          │  NEW ACTIVE QR  │
                          │  Token: xyz789  │
                          │  Expires: 5min  │
                          └─────────────────┘

[Repeats continuously]
```

---

## ⚡ Time-In/Time-Out Logic

```javascript
IF user has no attendance record for TODAY
    └─► ACTION = "TIME_IN"
        └─► Record time_in = NOW()
        └─► Message: "Welcome! Time In recorded"

ELSE IF user has time_in but NO time_out
    └─► ACTION = "TIME_OUT"
        └─► Update time_out = NOW()
        └─► Message: "Time Out recorded, Have a good day!"

ELSE IF user has both time_in AND time_out
    └─► ERROR = "Already checked out"
        └─► Message: "You already checked out today"
```

---

## 🚨 Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| QR_EXPIRED | Token older than 5min | Refresh QR code |
| INVALID_TOKEN | Token not in database | Generate new QR |
| ALREADY_CHECKED_OUT | Second scan same user | Wait for next day |
| USER_INACTIVE | Employee status inactive | Activate employee |
| NETWORK_ERROR | No internet connection | Enable offline queue |
| GPS_OUT_OF_RANGE | More than 50m from office | Move closer or override |

---

## 📝 Testing Sequence

### 1. Backend API (Use Postman)
```
POST /api/auth/login
    → Copy token from response

POST /api/qr/generate
    → Copy QR token

POST /api/attendance/scan
    → Send QR token
    → Should record time-in
    
POST /api/attendance/scan (again)
    → Should record time-out
```

### 2. Admin Dashboard
```
Open login.html
→ Login with admin credentials
→ Click "Generate QR"
→ See QR displayed
→ Check "Attendance Today"
→ Should see your test scan
```

### 3. Mobile App
```
Open app
→ Login with employee credentials
→ Click "Scan QR"
→ Scan QR from dashboard
→ Should see confirmation
→ Check "History"
→ Should see attendance record
```

---

## 📁 File Organization Cheat Sheet

```
backend/
├── server.js           ← Start here (npm start)
├── routes/
│   ├── auth.js         ← Login routes
│   ├── qr.js          ← QR routes
│   └── attendance.js   ← Scan routes
└── config/
    └── database.js     ← DB connection

frontend/
├── index.html          ← Main entry point
├── pages/
│   ├── login.html      ← Admin login
│   ├── dashboard.html  ← Main dashboard
│   └── qr-generator.html ← QR display
└── assets/
    ├── js/
    │   └── api-client.js ← API calls
    └── css/
        └── login.css    ← Styles

database/
└── schema.sql          ← Run this first!
```

---

## 🎓 Documentation Map

```
START HERE
    ↓
README.md (Overview)
    ↓
WORKFLOW.md (How system works)
    ↓
    ├─→ IMPLEMENTATION_GUIDE.md (Setup)
    ├─→ API_DOCS.md (Endpoints)
    ├─→ PROJECT_STRUCTURE.md (Organization)
    └─→ VISUAL_WORKFLOWS.md (Diagrams)
    
For specific topics:
• Database: database/schema.sql
• Security: docs/SECURITY.md
• Troubleshooting: docs/TROUBLESHOOTING.md
```

---

## ⏱️ Development Timeline Estimate

| Phase | Duration | Focus |
|-------|----------|-------|
| Phase 1 | 3-5 days | Backend foundation + DB |
| Phase 2 | 4-5 days | Core APIs + QR logic |
| Phase 3 | 4-5 days | Admin dashboard |
| Phase 4 | 4-5 days | Mobile app |
| Phase 5 | 3-5 days | Testing + deployment |
| **Total** | **4 weeks** | **Full system** |

---

## 💡 Pro Tips

1. **Start with Database**
   ```bash
   mysql -u root -p < database/schema.sql
   ```

2. **Test APIs First**
   - Use Postman to test endpoints
   - Copy Bearer token for authenticated requests
   - Check database after each test

3. **Frontend Development**
   - Start with login page
   - Move to dashboard
   - Then add features

4. **Mobile Later**
   - Get backend solid first
   - Then implement app
   - Test thoroughly before release

5. **Database Debugging**
   ```sql
   -- Check today's attendance
   SELECT * FROM attendance WHERE date = CURDATE();
   
   -- Check active QR codes
   SELECT * FROM qr_tokens WHERE is_active = TRUE AND expires_at > NOW();
   
   -- Check scan logs
   SELECT * FROM qr_scan_logs ORDER BY scan_timestamp DESC LIMIT 10;
   ```

---

## 🔗 Quick Links

- **Start Development:** `docs/IMPLEMENTATION_GUIDE.md`
- **API Endpoints:** `docs/API_DOCS.md`
- **Workflows:** `WORKFLOW.md`
- **Database:** `database/schema.sql`
- **File Structure:** `PROJECT_STRUCTURE.md`
- **Project Overview:** `README.md`

---

## ✅ Pre-Development Checklist

- [ ] Read README.md
- [ ] Read WORKFLOW.md
- [ ] Review PROJECT_STRUCTURE.md
- [ ] Check API_DOCS.md
- [ ] Review database/schema.sql
- [ ] Setup development environment
- [ ] Install dependencies
- [ ] Create database
- [ ] Create .env file
- [ ] Start backend server
- [ ] Test API health endpoint
- [ ] Open frontend in browser
- [ ] Proceed to development

---

**Key Takeaway:** Follow the workflows in order, test after each phase, and refer to the documentation when needed!

Good luck with development! 🚀

