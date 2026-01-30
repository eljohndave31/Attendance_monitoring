<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Employee QR Scanner</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://unpkg.com/html5-qrcode"></script>
    <link rel="stylesheet" href="scanner.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="scanner-wrapper">
        <div class="scanner-header">
            <div class="header-left">
                <div class="scanner-icon">
                    <i class="fas fa-qrcode"></i>
                </div>
                <div>
                    <h1>Employee Attendance Scanner</h1>
                    <p class="subtitle">Point the camera at the QR code to check in</p>
                </div>
            </div>
            <button class="close-btn" onclick="window.close()">
                <i class="fas fa-times"></i>
            </button>
        </div>

        <div class="scanner-container">
            <div class="scanner-frame">
                <div id="scanner"></div>
                <div class="scanner-overlay">
                    <div class="scan-area"></div>
                    <div class="scan-line"></div>
                    <div class="corner top-left"></div>
                    <div class="corner top-right"></div>
                    <div class="corner bottom-left"></div>
                    <div class="corner bottom-right"></div>
                </div>
            </div>
            
            <div class="scanner-instructions">
                <div class="instruction-item">
                    <i class="fas fa-lightbulb"></i>
                    <span>Ensure good lighting</span>
                </div>
                <div class="instruction-item">
                    <i class="fas fa-hand-point-up"></i>
                    <span>Hold steady for 2-3 seconds</span>
                </div>
                <div class="instruction-item">
                    <i class="fas fa-qrcode"></i>
                    <span>Center QR code in frame</span>
                </div>
            </div>

            <div id="status" class="status">
                <div class="status-icon">
                    <i class="fas fa-search"></i>
                </div>
                <div class="status-content">
                    <h3>Ready to Scan</h3>
                    <p>Waiting for QR code detection...</p>
                </div>
            </div>

            <div class="scanner-controls">
                <button id="toggleCamera" class="btn btn-secondary">
                    <i class="fas fa-camera-rotate"></i>
                    Switch Camera
                </button>
                <button onclick="window.close()" class="btn btn-danger">
                    <i class="fas fa-times"></i>
                    Close Scanner
                </button>
            </div>
        </div>
        
        <div class="scanner-footer">
            <p><i class="fas fa-info-circle"></i> Scanner ID: SCAN-001 | Location: Upper Pakigne Minglanilla</p>
            <p class="footer-note">This scanner is connected to the main attendance system</p>
        </div>
    </div>

    <script src="scanner.js"></script>
</body>
</html>