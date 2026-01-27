// Modal Functions
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Focus on email input for better UX
    setTimeout(() => {
        document.getElementById('email').focus();
    }, 300);
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
document.getElementById('loginModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeLoginModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('loginModal');
        if (modal.classList.contains('active')) {
            closeLoginModal();
        }
    }
});

// Toggle password visibility
document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

// Animation Control Functions
function startScanAnimation() {
    const scanLines = document.querySelectorAll('.scan-line-horizontal, .scan-line-vertical');
    const qrDots = document.querySelectorAll('.qr-dot');
    
    // Reset animations
    scanLines.forEach(line => {
        line.style.animationPlayState = 'running';
    });
    
    qrDots.forEach((dot, index) => {
        dot.style.animation = `dotAppear 0.5s ease-in-out infinite alternate ${index * 0.05}s`;
    });
}

function stopScanAnimation() {
    const scanLines = document.querySelectorAll('.scan-line-horizontal, .scan-line-vertical');
    const qrDots = document.querySelectorAll('.qr-dot');
    
    scanLines.forEach(line => {
        line.style.animationPlayState = 'paused';
    });
    
    qrDots.forEach(dot => {
        dot.style.animation = 'none';
    });
}


