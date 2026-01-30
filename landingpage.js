// Modal Functions
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    modal?.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('email')?.focus();
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal?.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
document.getElementById('loginModal')?.addEventListener('click', function(e) {
    if (e.target === this) closeLoginModal();
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLoginModal();
});

// Toggle password visibility
document.getElementById('togglePassword')?.addEventListener('click', function() {
    const input = document.getElementById('password');
    const icon = this.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
});


