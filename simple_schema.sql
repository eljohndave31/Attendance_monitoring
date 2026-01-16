CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- Create Indexes for better query performance
CREATE INDEX idx_attendance_user_id ON attendance(user_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_users_email ON users(email);

-- Insert Sample Data

-- Insert Admin User (password: admin123 - pre-hashed with bcrypt)
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@test.com', '$2y$10$N9qo8uLOickgx2ZMRZoMye4/7JKvNdUjl1wPVVBx0eFCOhAr2/I6O', 'admin');

-- Insert Sample Users (password: user123 - pre-hashed with bcrypt)
INSERT INTO users (name, email, password, role) VALUES 
('John Doe', 'john@test.com', '$2y$10$bcyrOn0HvbuhLZlXlBMlZOH6RA3w3jVBPNxbIlqKBrIgGfD1D1E1C', 'user'),
('Jane Smith', 'jane@test.com', '$2y$10$bcyrOn0HvbuhLZlXlBMlZOH6RA3w3jVBPNxbIlqKBrIgGfD1D1E1C', 'user'),
('Bob Johnson', 'bob@test.com', '$2y$10$bcyrOn0HvbuhLZlXlBMlZOH6RA3w3jVBPNxbIlqKBrIgGfD1D1E1C', 'user'),
('Alice Brown', 'alice@test.com', '$2y$10$bcyrOn0HvbuhLZlXlBMlZOH6RA3w3jVBPNxbIlqKBrIgGfD1D1E1C', 'user'),
('Charlie Wilson', 'charlie@test.com', '$2y$10$bcyrOn0HvbuhLZlXlBMlZOH6RA3w3jVBPNxbIlqKBrIgGfD1D1E1C', 'user');

-- Insert Sample Attendance Records (for the current month)
INSERT INTO attendance (user_id, date, status) VALUES 
(2, CURRENT_DATE, 'present'),
(2, CURRENT_DATE - INTERVAL '1 day', 'present'),
(2, CURRENT_DATE - INTERVAL '2 days', 'absent'),
(2, CURRENT_DATE - INTERVAL '3 days', 'late'),
(2, CURRENT_DATE - INTERVAL '4 days', 'present'),
(3, CURRENT_DATE, 'present'),
(3, CURRENT_DATE - INTERVAL '1 day', 'late'),
(3, CURRENT_DATE - INTERVAL '2 days', 'present'),
(3, CURRENT_DATE - INTERVAL '3 days', 'present'),
(3, CURRENT_DATE - INTERVAL '4 days', 'absent'),
(4, CURRENT_DATE, 'present'),
(4, CURRENT_DATE - INTERVAL '1 day', 'present'),
(4, CURRENT_DATE - INTERVAL '2 days', 'present'),
(4, CURRENT_DATE - INTERVAL '3 days', 'present'),
(4, CURRENT_DATE - INTERVAL '4 days', 'late'),
(5, CURRENT_DATE, 'absent'),
(5, CURRENT_DATE - INTERVAL '1 day', 'present'),
(5, CURRENT_DATE - INTERVAL '2 days', 'present'),
(5, CURRENT_DATE - INTERVAL '3 days', 'absent'),
(5, CURRENT_DATE - INTERVAL '4 days', 'present'),
(6, CURRENT_DATE, 'present'),
(6, CURRENT_DATE - INTERVAL '1 day', 'present'),
(6, CURRENT_DATE - INTERVAL '2 days', 'late'),
(6, CURRENT_DATE - INTERVAL '3 days', 'present'),
(6, CURRENT_DATE - INTERVAL '4 days', 'present');

-- Note about passwords:
-- Demo credentials for testing:
-- Admin: admin@test.com / admin123
-- Users: john@test.com, jane@test.com, bob@test.com, alice@test.com, charlie@test.com / user123

