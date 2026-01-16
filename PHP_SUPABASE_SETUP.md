# PHP + Supabase PostgreSQL Setup Guide

## Step 1: Get Your Supabase Credentials

### From Supabase Dashboard:
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your project
3. Click **Settings** (bottom left) → **Database**
4. Copy your credentials:
   - **Host**: `db.<your-project-id>.supabase.co`
   - **Port**: `5432`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: Your database password (set during project creation)

**Example:**
```
Host: db.abcdefghijklmnop.supabase.co
Port: 5432
Database: postgres
User: postgres
Password: YourDatabasePassword123!
```

---

## Step 2: Create .env File

Create a file named `.env` in your backend folder:

```
c:\xampp\htdocs\Attendance monitoring\backend\.env
```

Add your credentials:

```env
SUPABASE_HOST=db.your-project-id.supabase.co
SUPABASE_PORT=5432
SUPABASE_DB=postgres
SUPABASE_USER=postgres
SUPABASE_PASSWORD=your-db-password
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

**DO NOT commit .env to Git!**

---

## Step 3: Create Connection File

Create `backend/config/database.php`:

```php
<?php
/**
 * Supabase PostgreSQL Connection
 */

// Load .env file
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            putenv(trim($key) . '=' . trim($value));
        }
    }
}

// Get credentials from environment
$host = getenv('SUPABASE_HOST');
$port = getenv('SUPABASE_PORT') ?: '5432';
$dbname = getenv('SUPABASE_DB') ?: 'postgres';
$user = getenv('SUPABASE_USER');
$password = getenv('SUPABASE_PASSWORD');

// Build connection string
$connString = "host=$host port=$port dbname=$dbname user=$user password=$password";

// Connect to Supabase PostgreSQL
$conn = pg_connect($connString);

// Check connection
if (!$conn) {
    die('Connection failed: ' . pg_last_error());
}

// Set UTF-8 encoding
pg_set_client_encoding($conn, 'UTF8');

echo "✓ Connected to Supabase successfully!";
?>
```

---

## Step 4: Test Connection

Create `backend/test-connection.php`:

```php
<?php
require_once __DIR__ . '/config/database.php';

echo "<h2>Supabase Connection Test</h2>";

try {
    // Test 1: Connection
    if ($conn) {
        echo "<p style='color: green;'>✓ Database connected</p>";
    } else {
        echo "<p style='color: red;'>✗ Connection failed</p>";
        exit;
    }

    // Test 2: Query tables
    $query = "SELECT table_name FROM information_schema.tables WHERE table_schema='public'";
    $result = pg_query($conn, $query);

    if ($result) {
        echo "<h3>Available Tables:</h3><ul>";
        while ($row = pg_fetch_assoc($result)) {
            echo "<li>" . $row['table_name'] . "</li>";
        }
        echo "</ul>";
    }

    // Test 3: Query users
    $query = "SELECT id, email, name FROM users LIMIT 5";
    $result = pg_query($conn, $query);

    if ($result) {
        echo "<h3>Sample Users:</h3>";
        echo "<table border='1'>";
        echo "<tr><th>ID</th><th>Email</th><th>Name</th></tr>";
        while ($row = pg_fetch_assoc($result)) {
            echo "<tr>";
            echo "<td>" . htmlspecialchars($row['id']) . "</td>";
            echo "<td>" . htmlspecialchars($row['email']) . "</td>";
            echo "<td>" . htmlspecialchars($row['name']) . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    }

    pg_close($conn);

} catch (Exception $e) {
    echo "<p style='color: red;'>Error: " . $e->getMessage() . "</p>";
}
?>
```

**Access it at:** `http://localhost/Attendance%20monitoring/backend/test-connection.php`

---

## Step 5: Create Database Class

Create `backend/config/Database.php`:

```php
<?php
/**
 * Database Wrapper Class
 * Simplifies PostgreSQL operations
 */

class Database {
    private $conn;

    public function __construct($connString) {
        $this->conn = pg_connect($connString);
        if (!$this->conn) {
            throw new Exception('Database connection failed: ' . pg_last_error());
        }
        pg_set_client_encoding($this->conn, 'UTF8');
    }

    /**
     * Execute query
     */
    public function query($sql, $params = []) {
        if (!empty($params)) {
            $result = pg_query_params($this->conn, $sql, $params);
        } else {
            $result = pg_query($this->conn, $sql);
        }

        if (!$result) {
            throw new Exception('Query failed: ' . pg_last_error($this->conn));
        }

        return $result;
    }

    /**
     * Fetch single row
     */
    public function fetchOne($sql, $params = []) {
        $result = $this->query($sql, $params);
        return pg_fetch_assoc($result);
    }

    /**
     * Fetch all rows
     */
    public function fetchAll($sql, $params = []) {
        $result = $this->query($sql, $params);
        $rows = [];
        while ($row = pg_fetch_assoc($result)) {
            $rows[] = $row;
        }
        return $rows;
    }

    /**
     * Insert data
     */
    public function insert($table, $data) {
        $columns = array_keys($data);
        $values = array_values($data);
        $placeholders = implode(',', array_map(fn($i) => '$' . ($i + 1), range(0, count($values) - 1)));

        $sql = "INSERT INTO $table (" . implode(',', $columns) . ") VALUES ($placeholders) RETURNING *";

        return $this->fetchOne($sql, $values);
    }

    /**
     * Update data
     */
    public function update($table, $data, $where, $whereValues = []) {
        $set = [];
        $values = array_values($data);
        
        foreach (array_keys($data) as $i => $col) {
            $set[] = "$col = $" . ($i + 1);
        }

        $sql = "UPDATE $table SET " . implode(',', $set) . " WHERE $where RETURNING *";
        
        return $this->fetchOne($sql, array_merge($values, $whereValues));
    }

    /**
     * Delete data
     */
    public function delete($table, $where, $params = []) {
        $sql = "DELETE FROM $table WHERE $where RETURNING *";
        return $this->fetchOne($sql, $params);
    }

    /**
     * Get connection
     */
    public function getConnection() {
        return $this->conn;
    }

    /**
     * Close connection
     */
    public function close() {
        pg_close($this->conn);
    }

    /**
     * Destructor
     */
    public function __destruct() {
        if ($this->conn) {
            pg_close($this->conn);
        }
    }
}
?>
```

---

## Step 6: Use in Your Controllers

Create `backend/controllers/userController.php`:

```php
<?php
header('Content-Type: application/json');

// Load environment
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            putenv(trim($key) . '=' . trim($value));
        }
    }
}

require_once __DIR__ . '/../config/Database.php';

try {
    // Create connection
    $host = getenv('SUPABASE_HOST');
    $port = getenv('SUPABASE_PORT') ?: '5432';
    $dbname = getenv('SUPABASE_DB') ?: 'postgres';
    $user = getenv('SUPABASE_USER');
    $password = getenv('SUPABASE_PASSWORD');

    $connString = "host=$host port=$port dbname=$dbname user=$user password=$password";
    $db = new Database($connString);

    // Get request method and action
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? '';

    // Get all users
    if ($action === 'list' && $method === 'GET') {
        $users = $db->fetchAll("SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC");
        echo json_encode(['success' => true, 'data' => $users]);
        exit;
    }

    // Get single user
    if ($action === 'get' && $method === 'GET') {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'User ID required']);
            exit;
        }

        $user = $db->fetchOne("SELECT id, email, name, role FROM users WHERE id = $1", [$id]);
        echo json_encode(['success' => true, 'data' => $user]);
        exit;
    }

    // Create user
    if ($action === 'create' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['email']) || empty($input['password']) || empty($input['name'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing required fields']);
            exit;
        }

        $passwordHash = password_hash($input['password'], PASSWORD_BCRYPT);
        $user = $db->insert('users', [
            'email' => $input['email'],
            'password_hash' => $passwordHash,
            'name' => $input['name'],
            'role' => $input['role'] ?? 'user'
        ]);

        http_response_code(201);
        echo json_encode(['success' => true, 'data' => $user]);
        exit;
    }

    // Update user
    if ($action === 'update' && $method === 'PATCH') {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'User ID required']);
            exit;
        }

        $user = $db->update('users', $input, 'id = $1', [$id]);
        echo json_encode(['success' => true, 'data' => $user]);
        exit;
    }

    // Delete user
    if ($action === 'delete' && $method === 'DELETE') {
        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'User ID required']);
            exit;
        }

        $db->delete('users', 'id = $1', [$id]);
        echo json_encode(['success' => true, 'message' => 'User deleted']);
        exit;
    }

    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Action not found']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
```

---

## Step 7: API Endpoints

### Get All Users
```
GET http://localhost/Attendance%20monitoring/backend/controllers/userController.php?action=list
```

### Get Single User
```
GET http://localhost/Attendance%20monitoring/backend/controllers/userController.php?action=get&id=1
```

### Create User
```
POST http://localhost/Attendance%20monitoring/backend/controllers/userController.php?action=create

Body:
{
  "email": "john@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "user"
}
```

### Update User
```
PATCH http://localhost/Attendance%20monitoring/backend/controllers/userController.php?action=update&id=1

Body:
{
  "name": "Jane Doe",
  "role": "admin"
}
```

### Delete User
```
DELETE http://localhost/Attendance%20monitoring/backend/controllers/userController.php?action=delete&id=1
```

---

## Step 8: Test with cURL

```bash
# Test connection
curl http://localhost/Attendance%20monitoring/backend/test-connection.php

# Get all users
curl http://localhost/Attendance%20monitoring/backend/controllers/userController.php?action=list

# Create user
curl -X POST http://localhost/Attendance%20monitoring/backend/controllers/userController.php?action=create \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Get single user
curl http://localhost/Attendance%20monitoring/backend/controllers/userController.php?action=get&id=1

# Update user
curl -X PATCH http://localhost/Attendance%20monitoring/backend/controllers/userController.php?action=update&id=1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'

# Delete user
curl -X DELETE http://localhost/Attendance%20monitoring/backend/controllers/userController.php?action=delete&id=1
```

---

## Troubleshooting

### Connection Failed
```
Error: Connection failed: could not translate host name to address
```
**Solution:** Verify `SUPABASE_HOST` is correct. Check Supabase Dashboard → Settings → Database

### Authentication Failed
```
Error: FATAL: password authentication failed for user "postgres"
```
**Solution:** Verify password is correct. Reset password in Supabase Dashboard if needed

### Table Not Found
```
Error: relation "users" does not exist
```
**Solution:** Make sure you've created tables using `simple_schema.sql` in Supabase SQL Editor

### SSL Connection Error
```
Error: SSL is required
```
**Solution:** Add to connection string:
```php
$connString = "host=$host port=$port dbname=$dbname user=$user password=$password sslmode=require";
```

---

## Security Best Practices

### 1. Never hardcode credentials
```php
// ❌ WRONG
$password = "YourPassword123";

// ✅ CORRECT
$password = getenv('SUPABASE_PASSWORD');
```

### 2. Use prepared statements
```php
// ❌ WRONG
$sql = "SELECT * FROM users WHERE email = '$email'";

// ✅ CORRECT
$sql = "SELECT * FROM users WHERE email = $1";
$db->fetchOne($sql, [$email]);
```

### 3. Hash passwords
```php
// ✅ CORRECT
$hash = password_hash($password, PASSWORD_BCRYPT);
if (password_verify($input, $hash)) { ... }
```

### 4. Validate input
```php
// ✅ CORRECT
if (empty($input['email']) || empty($input['password'])) {
    die('Missing required fields');
}
```

### 5. Use HTTPS only
Set in .htaccess or nginx:
```
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## File Structure

```
backend/
├── config/
│   ├── database.php      (Basic connection)
│   └── Database.php      (Class wrapper)
├── controllers/
│   ├── userController.php
│   ├── attendanceController.php
│   └── authController.php
├── .env                  (Credentials - DO NOT COMMIT)
├── .env.example          (Template - commit this)
└── test-connection.php   (Test file)
```

---

## Next Steps

1. ✅ Set up .env file with Supabase credentials
2. ✅ Create config/database.php
3. ✅ Run test-connection.php to verify
4. ✅ Create Database.php wrapper class
5. ✅ Build controllers using Database class
6. ✅ Create attendance controller
7. ✅ Set up authentication
8. ✅ Test all API endpoints

---

## Quick Reference

```php
// Connection
$db = new Database($connString);

// SELECT
$user = $db->fetchOne("SELECT * FROM users WHERE id = $1", [1]);
$users = $db->fetchAll("SELECT * FROM users");

// INSERT
$user = $db->insert('users', ['email' => 'user@test.com', 'name' => 'John']);

// UPDATE
$user = $db->update('users', ['name' => 'Jane'], 'id = $1', [1]);

// DELETE
$db->delete('users', 'id = $1', [1]);
```
