const statusBox = document.getElementById('status');
const toggleCameraBtn = document.getElementById('toggleCamera');
let scanned = false;
let html5QrcodeScanner;

function updateStatus(type, message) {
    const statusIcon = statusBox.querySelector('.status-icon i');
    const statusTitle = statusBox.querySelector('.status-content h3');
    const statusText = statusBox.querySelector('.status-content p');
    
    // Reset classes
    statusBox.className = 'status';
    
    switch(type) {
        case 'success':
            statusBox.classList.add('success');
            statusIcon.className = 'fas fa-check-circle';
            statusTitle.textContent = 'Scan Successful!';
            break;
        case 'error':
            statusBox.classList.add('error');
            statusIcon.className = 'fas fa-exclamation-triangle';
            statusTitle.textContent = 'Scan Error';
            break;
        case 'scanning':
            statusIcon.className = 'fas fa-search';
            statusTitle.textContent = 'Ready to Scan';
            break;
        case 'processing':
            statusIcon.className = 'fas fa-spinner fa-spin';
            statusTitle.textContent = 'Processing...';
            break;
    }
    
    statusText.textContent = message;
}

function onScanSuccess(decodedText, decodedResult) {
    if (scanned) return;
    
    scanned = true;
    updateStatus('processing', 'Verifying QR code...');
    
    console.log(`QR Code detected: ${decodedText}`);
    
    // Send the scanned QR code back to parent window
    if (window.opener) {
        window.opener.postMessage({
            type: 'qrScanned',
            qrCode: decodedText
        }, window.location.origin);
    }
    
    // Show success message
    updateStatus('success', `Scanned: ${decodedText}`);
    
    // Reset after 3 seconds
    setTimeout(() => {
        scanned = false;
        updateStatus('scanning', 'Waiting for QR code detection...');
    }, 3000);
}

function onScanError(errorMessage) {
    console.log(`QR Code scan error = ${errorMessage}`);
    if (!scanned) {
        updateStatus('error', 'Unable to scan QR code');
        
        setTimeout(() => {
            updateStatus('scanning', 'Waiting for QR code detection...');
        }, 2000);
    }
}

function toggleCamera() {
    // This is a placeholder - you'll implement camera switching in PHP if needed
    alert('Camera switching would be handled by PHP backend if implemented');
}

document.addEventListener('DOMContentLoaded', function() {
    updateStatus('scanning', 'Initializing scanner...');
    
    html5QrcodeScanner = new Html5QrcodeScanner(
        "scanner",
        { 
            fps: 10, 
            qrbox: { 
                width: 220, 
                height: 220 
            }
        },
        false
    );
    
    html5QrcodeScanner.render(onScanSuccess, onScanError);
    
    // Add event listener for camera toggle button
    if (toggleCameraBtn) {
        toggleCameraBtn.addEventListener('click', toggleCamera);
    }
    
    // Handle window messages
    window.addEventListener('message', function(event) {
        if (event.data.type === 'resetScanner') {
            scanned = false;
            updateStatus('scanning', 'Ready to scan next employee');
        }
    });
});