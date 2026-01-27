<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="landingpage.css">

</head>
<body>

<?php
session_start();
$loginError = $_SESSION['login_error'] ?? '';
$loginEmail = $_SESSION['login_email'] ?? '';
unset($_SESSION['login_error']);
unset($_SESSION['login_email']);
?>


    <!-- Navigation -->
    <nav class="navbar">
        <div class="logo">
            <i class="fas fa-qrcode"></i>
 <span class="logo-text">Atten<span class="logo-highlight">dify</span></span>        </div>
        
      <ul class="nav-links">
            <li><a href="#home" class="nav-link active">Home</a></li>
            <li><a href="#features" class="nav-link">Features</a></li>
            <li><a href="#how-it-works" class="nav-link">How It Works</a></li>
               <li><a href="#how-it-works" class="nav-link"></a></li>
        </ul>
        
        <div class="cta-nav">
            <button class="btn-outline" onclick="openLoginModal()">Login</button>
            <button class="btn-primary">Get Started</button>
        </div>
    </nav>

   
    <section id="home" class="hero">
        <div class="hero-content">
            <h1>Modern Employee Tracking with <span class="highlight">QR Code</span></h1>
            <p>
               Make workplace attendance easier with our secure QR-based system.
                Real-time monitoring, advanced security, and effortless management 
                for modern businesses.
            </p>
            
            <div class="hero-btns">
                <button class="btn-primary" onclick="openLoginModal()">
                    <i class="fas fa-sign-in-alt"></i> Admin Dashboard
                </button>
            </div>

            <!-- Hero Stats -->
            <div class="hero-stats">
                <div class="stat">
                    <div class="stat-number">99.9%</div>
                    <div class="stat-label">Accuracy Rate</div>
                </div>
               
                <div class="stat">
                    <div class="stat-number">24/7</div>
                    <div class="stat-label">Real-time Tracking</div>
                </div>
            </div>
        </div>
        
        <div class="animation-container">
            <div class="animation-bg"></div>
            
            <!-- Floating Illustrations -->
            <div class="floating-illustration qr-illustration">
                <div class="qr-icon">
                    <i class="fas fa-qrcode"></i>
                </div>
                <div class="qr-pulse"></div>
            </div>
            
            <div class="floating-illustration employee-illustration">
                <div class="employee-icon">
                    <i class="fas fa-user-check"></i>
                </div>
            </div>
            
            <div class="floating-illustration clock-illustration">
                <div class="clock-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="clock-hands">
                    <div class="hour-hand"></div>
                    <div class="minute-hand"></div>
                </div>
            </div>
            
            <div class="floating-illustration shield-illustration">
                <div class="shield-icon">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <div class="shield-glow"></div>
            </div>
            
            <div class="floating-illustration analytics-illustration">
                <div class="analytics-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="chart-bars">
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                </div>
            </div>

            <!-- Connection Lines -->
            <div class="connection-line line-1"></div>
            <div class="connection-line line-2"></div>
            <div class="connection-line line-3"></div>
            <div class="connection-line line-4"></div>
            
            <!-- Smartphone Model -->
            <div class="smartphone">
                <div class="smartphone-screen">
                    <div class="screen-content">
                        <div class="app-header">
                            <div class="app-title">QR Attendance</div>
                            <div class="battery">84%</div>
                        </div>
                        
                        <div class="scanning-area">
                            <div class="scan-box">
                                <div class="scan-frame">
                                    <div class="corner top-left"></div>
                                    <div class="corner top-right"></div>
                                    <div class="corner bottom-left"></div>
                                    <div class="corner bottom-right"></div>
                                    
                                    <!-- Animated QR Code -->
                                    <div class="qr-animation">
                                        <img src="qrcode.jpg" alt="QR Code" class="qr-code-image">
                                    </div>
                                    
                                    <div class="scan-line-horizontal"></div>
                                    <div class="scan-line-vertical"></div>
                                </div>
                                
                                <div class="scan-instruction">Position QR code within frame</div>
                            </div>
                            
                            <div class="scan-button">
                                <i class="fas fa-camera"></i> Scan QR Code
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="smartphone-frame">
                    <div class="speaker"></div>
                    <div class="power-button"></div>
                    <div class="volume-buttons">
                        <div class="volume-up"></div>
                        <div class="volume-down"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

  
<section id="features" class="features">
    <div class="section-header">
        <h2>Features</h2>
    </div>
    
    <div class="features-grid">
      
        <div class="feature-card">
            <div class="feature-icon">
                <i class="fas fa-qrcode"></i>
            </div>
            <h3>Dynamic QR Codes</h3>
            <p>Generate secure QR codes that auto-rotate every 1-5 minutes. Prevent screenshot reuse with expiring tokens.</p>
        </div>
        
        <div class="feature-card">
            <div class="feature-icon">
                <i class="fas fa-users"></i>
            </div>
            <h3>Employee Management</h3>
            <p>Add, edit, and manage employees. Set roles (admin/employee) and track employee status easily.</p>
        </div>
        
        
        <div class="feature-card">
            <div class="feature-icon">
                <i class="fas fa-exchange-alt"></i>
            </div>
            <h3>Auto In/Out Detection</h3>
            <p>System automatically detects first scan as Time-In, second scan as Time-Out. No manual switching needed.</p>
        </div>
        
        <div class="feature-card">
            <div class="feature-icon">
                <i class="fas fa-map-marker-alt"></i>
            </div>
            <h3>Location Validation</h3>
            <p>Optional GPS radius check ensures employees scan from the correct workplace location.</p>
        </div>
        
        
        <div class="feature-card">
            <div class="feature-icon">
                <i class="fas fa-shield-alt"></i>
            </div>
            <h3>Fraud Prevention</h3>
            <p>Token validation, device logging, and time window checks prevent cheating and remote scanning.</p>
        </div>
        
        <div class="feature-card">
            <div class="feature-icon">
                <i class="fas fa-file-export"></i>
            </div>
            <h3>Export Reports</h3>
            <p>Download attendance data as CSV/PDF for payroll processing. View detailed analytics and system logs.</p>
        </div>
    </div>
</section>


    <section id="how-it-works" class="how-it-works">
        <div class="section-header">
            <h2>How It Works</h2>

        </div>
        
        <div class="steps">
            <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                    <h3>Generate QR Code</h3>
                    <p>Create unique QR codes for each employee or department.</p>
                </div>
            </div>
            
            <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                    <h3>Scan with App</h3>
                    <p>Employees scan the QR code using our mobile app.</p>
                </div>
            </div>
            
            <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                    <h3>Track & Analyze</h3>
                    <p>Monitor attendance data in real-time through the dashboard.</p>
                </div>
            </div>
        </div>
    </section>

<!-- Footer -->
<footer class="footer">
    <div class="footer-container">
        <div class="footer-content">
            <!-- Footer Logo & About -->
            <div class="footer-section footer-about">
                <div class="footer-logo">
                    <i class="fas fa-qrcode"></i>
                    <span class="footer-logo-text">Atten<span class="logo-highlight">dify</span></span>
                </div>
                <p class="footer-description">Modern employee attendance tracking powered by secure QR codes. Real-time monitoring for efficient workforce management.</p>
                <div class="social-links">
                    <a href="#" title="Facebook"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" title="Twitter"><i class="fab fa-twitter"></i></a>
                    <a href="#" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                    <a href="#" title="Instagram"><i class="fab fa-instagram"></i></a>
                </div>
            </div>

            <!-- Quick Links -->
            <div class="footer-section">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#how-it-works">How It Works</a></li>
                    <li><a href="javascript:openLoginModal()">Admin Login</a></li>
                </ul>
            </div>

            <!-- Features -->
            <div class="footer-section">
                <h4>Features</h4>
                <ul>
                    <li><a href="#">QR Code Generation</a></li>
                    <li><a href="#">Employee Management</a></li>
                    <li><a href="#">Real-time Tracking</a></li>
                    <li><a href="#">Reports & Analytics</a></li>
                </ul>
            </div>

            <!-- Support -->
            <div class="footer-section">
                <h4>Support</h4>
                <ul>
                    <li><a href="#">Help Center</a></li>
                    <li><a href="#">Documentation</a></li>
                    <li><a href="#">Contact Us</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                </ul>
            </div>

            <!-- Contact Info -->
            <div class="footer-section">
                <h4>Contact</h4>
                <div class="contact-info">
                    <p><i class="fas fa-envelope"></i> <a href="mailto:support@attendify.com">support@attendify.com</a></p>
                    <p><i class="fas fa-phone"></i> <a href="tel:+1234567890">+1 (234) 567-890</a></p>
                    <p><i class="fas fa-map-marker-alt"></i> Skena Magay Tangke Talisay</p>
                </div>
            </div>
        </div>
    </div>
</footer>

 <!-- Login Modal -->
<div class="modal-overlay" id="loginModal">
    <div class="modal">
      
        <div class="modal-header">
            <i class="fas fa-shield-alt"></i>
            <div class="modal-header-content">
                <h2>Admin Login</h2>
            </div>
        </div>

        <div class="modal-body">
            <p class="modal-subtitle">Enter your credentials to access the admin dashboard</p>
            
            <!-- Server Error Display (from PHP) -->
            <?php if (!empty($loginError)): ?>
                <div class="server-error" role="alert">
                    <i class="fas fa-exclamation-circle"></i> 
                    <span><?php echo htmlspecialchars($loginError); ?></span>
                </div>
            <?php endif; ?>

            <form id="loginForm" class="login-form" method="POST" action="login.php" novalidate>
                <!-- EMAIL -->
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <div class="input-wrapper">
                        <input type="email" 
                               name="email" 
                               id="email" 
                               placeholder="admin@example.com" 
                               value="<?php echo htmlspecialchars($loginEmail); ?>"
                               required
                               aria-describedby="emailError">
                        <i class="fas fa-envelope input-icon"></i>
                    </div>
                    <!-- Email error will appear here -->
                    <span class="input-error" id="emailError" aria-live="polite"></span>
                </div>

                <!-- PASSWORD -->
                <div class="form-group">
                    <label for="password">Password</label>
                    <div class="password-input">
                        <div class="input-wrapper">
                            <input type="password" 
                                   name="password" 
                                   id="password" 
                                   placeholder="Enter your password" 
                                   required
                                   aria-describedby="passwordError">
                            <i class="fas fa-lock input-icon"></i>
                        </div>
                        <button type="button" class="toggle-password" id="togglePassword" aria-label="Show password">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <!-- Password error will appear here -->
                    <span class="input-error" id="passwordError" aria-live="polite"></span>
                </div>

                <button type="submit" class="btn-login" id="loginButton">
                    <i class="fas fa-sign-in-alt"></i> 
                    <span class="btn-text">Login to Dashboard</span>
                    <div class="spinner hidden" id="loginSpinner"></div>
                </button>
            </form>
        </div>

        <div class="modal-footer">
            <div class="security-notice">
                <i class="fas fa-lock"></i>
                <span>Your credentials are encrypted and secure</span>
            </div>
        </div>
    </div>
</div>
<script>
// Auto open modal if there's an error
document.addEventListener('DOMContentLoaded', function() {
    <?php if (!empty($loginError)): ?>
        openLoginModal();
    <?php endif; ?>
});

// Enhanced error display functions
function showError(input, errorSpan, message) {
    // Add invalid class to input
    input.classList.add('input-invalid');
    
    // Set error message
    errorSpan.textContent = message;
    errorSpan.classList.add('show');
    
    // Set ARIA attributes for accessibility
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorSpan.id);
    
    // Focus on the invalid input if it's the first error
    if (!document.querySelector('.input-invalid:not(:focus)')) {
        input.focus();
    }
}

function clearError(input, errorSpan) {
    // Remove invalid class from input
    input.classList.remove('input-invalid');
    
    // Clear error message
    errorSpan.textContent = '';
    errorSpan.classList.remove('show');
    
    // Remove ARIA attributes
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
}

function clearAllErrors() {
    const inputs = document.querySelectorAll('.form-group input');
    const errorSpans = document.querySelectorAll('.input-error');
    
    inputs.forEach(input => {
        input.classList.remove('input-invalid');
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
    });
    
    errorSpans.forEach(span => {
        span.textContent = '';
        span.classList.remove('show');
    });
}

function validateForm() {
    let isValid = true;
    
    // Clear previous errors
    clearAllErrors();
    
    // Email validation
    const email = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    
    if (email.value.trim() === '') {
        showError(email, emailError, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showError(email, emailError, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Password validation
    const password = document.getElementById('password');
    const passwordError = document.getElementById('passwordError');
    
    if (password.value.trim() === '') {
        showError(password, passwordError, 'Password is required');
        isValid = false;
    } else if (password.value.length < 6) {
        showError(password, passwordError, 'Password must be at least 6 characters');
        isValid = false;
    }
    
    return isValid;
}

// Real-time validation as user types
document.getElementById('email').addEventListener('input', function() {
    const emailError = document.getElementById('emailError');
    if (this.value.trim() === '') {
        showError(this, emailError, 'Email is required');
    } else if (!isValidEmail(this.value)) {
        showError(this, emailError, 'Please enter a valid email address');
    } else {
        clearError(this, emailError);
    }
});

document.getElementById('password').addEventListener('input', function() {
    const passwordError = document.getElementById('passwordError');
    if (this.value.trim() === '') {
        showError(this, passwordError, 'Password is required');
    } else if (this.value.length < 6) {
        showError(this, passwordError, 'Password must be at least 6 characters');
    } else {
        clearError(this, passwordError);
    }
});

// Clear errors when user starts typing in a field with error
document.getElementById('email').addEventListener('focus', function() {
    if (this.classList.contains('input-invalid')) {
        clearError(this, document.getElementById('emailError'));
    }
});

document.getElementById('password').addEventListener('focus', function() {
    if (this.classList.contains('input-invalid')) {
        clearError(this, document.getElementById('passwordError'));
    }
});

// Auto-open modal with error handling
document.addEventListener('DOMContentLoaded', function() {
    <?php if (!empty($loginError)): ?>
        openLoginModal();
        
        // If there's a server error, show it at the top and clear any input errors
        setTimeout(() => {
            clearAllErrors();
            
            // Optionally mark the inputs as invalid based on the error message
            const errorMsg = "<?php echo addslashes($loginError); ?>";
            const emailError = document.getElementById('emailError');
            const passwordError = document.getElementById('passwordError');
            
            if (errorMsg.toLowerCase().includes('email') || errorMsg.toLowerCase().includes('password')) {
                // Clear both fields to encourage retyping
                document.getElementById('email').value = '';
                document.getElementById('password').value = '';
                
                // Focus on email field
                document.getElementById('email').focus();
            }
        }, 100);
    <?php endif; ?>
});
</script>

    <script src="landingpage.js"></script>
</body>
</html>