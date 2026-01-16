# Supabase Quick Start Cheat Sheet

## 🚀 Setup in 10 Minutes

### Step 1: Create Project (2 min)
```
1. Go to supabase.com
2. Sign in with GitHub/Google
3. New Project → name: "attendance-system"
4. Save password, choose region
5. Wait for initialization
```

### Step 2: Create Tables (3 min)
```
1. SQL Editor → New Query
2. Paste simple_schema.sql
3. Run → Tables created
```

### Step 3: Get Credentials (2 min)
```
1. Settings → Database → Copy Connection String
2. API → Copy Project URL
3. API → Copy Anon Key
4. API → Copy Service Role Key
```

### Step 4: Setup Backend (3 min)
```
1. Create .env file with credentials
2. npm install @supabase/supabase-js
3. Update backend config
4. npm start
```

---

## 📋 Connection Details

```
Supabase URL: https://xxxxx.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIs...
Service Key: eyJhbGciOiJIUzI1NiIs...
```

**Get these from:** Supabase Dashboard → Settings → API

---

## 🗂️ Database Structure

```
users
├── id (serial, primary key)
├── name (varchar 100)
├── email (varchar 100, unique)
├── password (varchar 255, hashed)
├── role (admin/user)
└── created_at (timestamp)

attendance
├── id (serial, primary key)
├── user_id (foreign key)
├── date (date)
├── status (present/absent/late)
└── created_at (timestamp)
```

---

## 🔑 Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@test.com | admin123 | Admin |
| john@test.com | user123 | User |
| jane@test.com | user123 | User |
| bob@test.com | user123 | User |
| alice@test.com | user123 | User |
| charlie@test.com | user123 | User |

---

## 💻 Backend Code Examples

### Install Client
```bash
npm install @supabase/supabase-js
```

### Initialize Supabase
```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
```

### Login Query
```javascript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('email', email)
  .single();
```

### Get Today's Attendance
```javascript
const { data, error } = await supabase
  .from('attendance')
  .select('*')
  .eq('date', new Date().toISOString().split('T')[0]);
```

### Record Attendance
```javascript
const { data, error } = await supabase
  .from('attendance')
  .insert([{ user_id: 2, date: '2026-01-16', status: 'present' }])
  .select();
```

### Update Attendance
```javascript
const { data, error } = await supabase
  .from('attendance')
  .update({ status: 'late' })
  .eq('user_id', 2)
  .eq('date', '2026-01-16');
```

### Delete Attendance
```javascript
const { error } = await supabase
  .from('attendance')
  .delete()
  .eq('id', 1);
```

---

## 🌐 Frontend Code

### Get Token from Login
```javascript
async function login(email, password) {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const result = await response.json();
  localStorage.setItem('token', result.data.token);
  return result;
}
```

### Fetch Attendance
```javascript
async function loadAttendance() {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3000/api/attendance/today', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const result = await response.json();
  return result.data;
}
```

---

## 🔒 Environment Variables

**.env**
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIs...
NODE_ENV=development
PORT=3000
JWT_SECRET=your_secret_key
```

**.env.example** (commit this)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
NODE_ENV=development
PORT=3000
JWT_SECRET=your_secret_key
```

---

## 🧪 Quick SQL Queries

### View All Users
```sql
SELECT * FROM users;
```

### View Today's Attendance
```sql
SELECT u.name, a.status
FROM attendance a
JOIN users u ON a.user_id = u.id
WHERE a.date = CURRENT_DATE;
```

### Get User Attendance History
```sql
SELECT date, status
FROM attendance
WHERE user_id = 2
ORDER BY date DESC
LIMIT 10;
```

### Attendance Summary
```sql
SELECT 
  u.name,
  COUNT(*) as total_days,
  SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present,
  SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent,
  SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) as late
FROM users u
LEFT JOIN attendance a ON u.id = a.user_id
WHERE MONTH(a.date) = MONTH(CURRENT_DATE)
GROUP BY u.id, u.name;
```

### Insert Test Attendance
```sql
INSERT INTO attendance (user_id, date, status)
VALUES (2, CURRENT_DATE, 'present');
```

---

## 🔗 Important URLs

**Dashboard:** `https://app.supabase.com`  
**Database:** `https://app.supabase.com/project/xxxxx/editor`  
**API Settings:** `https://app.supabase.com/project/xxxxx/settings/api`  
**Docs:** `https://supabase.com/docs`  

---

## ⚡ API Endpoints (Backend)

```
POST   /api/auth/login          Login user
GET    /api/attendance/today    Get today's records
POST   /api/attendance          Record attendance
GET    /api/attendance/user/:id Get user history
```

---

## ✅ Common Tasks

### Change Password Hash
```bash
npm install bcryptjs

const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('password', 10);
```

### Query with Joins
```javascript
const { data } = await supabase
  .from('attendance')
  .select(`
    id,
    date,
    status,
    users (id, name, email)
  `);
```

### Filter Results
```javascript
const { data } = await supabase
  .from('attendance')
  .select('*')
  .eq('status', 'present')
  .gte('date', '2026-01-01')
  .order('date', { ascending: false });
```

### Count Records
```javascript
const { count } = await supabase
  .from('attendance')
  .select('*', { count: 'exact', head: true });
```

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "relation not found" | Run CREATE TABLE statements |
| "permission denied" | Use Service Role Key for admin ops |
| "unique constraint" | Email/date already exists |
| "foreign key violation" | User must exist before attendance |
| "Connection refused" | Check Supabase URL & internet |

---

## 📊 Next Steps

1. ✅ Create Supabase account
2. ✅ Load schema
3. ✅ Get credentials
4. ✅ Setup backend
5. ✅ Test API
6. ✅ Connect frontend
7. ✅ Deploy

---

## 🎯 Full Setup Checklist

```
[ ] Create Supabase project
[ ] Run simple_schema.sql
[ ] Verify tables created
[ ] Get all API credentials
[ ] Create .env file
[ ] Install @supabase/supabase-js
[ ] Update backend config
[ ] Test API endpoints
[ ] Insert sample data
[ ] Connect frontend
[ ] Test login
[ ] Verify data display
[ ] Ready to deploy!
```

---

**For detailed guide, see:** [docs/SUPABASE_SETUP.md](SUPABASE_SETUP.md)

