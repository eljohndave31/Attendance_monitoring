<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QR Generator | Attendance System</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="qr-generator.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
</head>
<body>
        <div id="dashboard" class="dashboard-container">
        <?php include 'components/header.php'; ?>

        <div class="dashboard-layout">
            <?php include 'components/sidebar.php'; ?>

            <!-- Main Content -->
            <main class="main-content" id="mainContent">
                <div class="content-header">
                    <h1 id="pageTitle">QR Generator</h1>
                    <div class="breadcrumb">
                        <span>Generate & Manage QR Codes</span>
                    </div>
                </div>
                
                <!-- Content View -->
                <div class="content-view" id="contentView"></div>
            </main>
        </div>
    </div>

    <!-- QR Generator Template -->
    <template id="qrGeneratorView">
        <div class="qr-generator-view">
            <div class="dashboard-grid">
                <!-- Configuration Panel -->
                <div class="config-panel card">
                    <div class="card-header">
                        <h3><i class="fas fa-cog"></i> QR Configuration</h3>
                    </div>
                    <div class="card-body">
                        <form id="qrConfigForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="qrLocation"><i class="fas fa-map-marker-alt"></i> Location</label>
                                    <select id="qrLocation" class="form-control">
                                        <option value="office_main">Poblacion Ward II, Minglanilla</option>
                                        <option value="office_second">Staca Tunghaan Minglanilla</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="qrRefresh"><i class="fas fa-sync-alt"></i> Refresh Interval</label>
                                    <select id="qrRefresh" class="form-control">
                                        <option value="1">1 minute</option>
                                        <option value="3">3 minutes</option>
                                        <option value="5" selected>5 minutes</option>
                                        <option value="10">10 minutes</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="qrExpiry"><i class="fas fa-clock"></i> Expiry Time</label>
                                    <select id="qrExpiry" class="form-control">
                                        <option value="1">1 minute</option>
                                        <option value="3">3 minutes</option>
                                        <option value="5" selected>5 minutes</option>
                                        <option value="10">10 minutes</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label><i class="fas fa-map-pin"></i> GPS Settings</label>
                                    <div class="checkbox-group">
                                        <label class="checkbox">
                                            <input type="checkbox" id="enableGPS">
                                            <span>Enable GPS Validation</span>
                                        </label>
                                        <div class="sub-option" id="gpsOptions">
                                            <label for="gpsRadius">Radius (meters)</label>
                                            <input type="number" id="gpsRadius" min="10" max="500" value="100" class="form-control">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="checkbox">
                                    <input type="checkbox" id="autoRefresh" checked>
                                    <span><i class="fas fa-robot"></i> Auto-refresh QR Code</span>
                                </label>
                            </div>
                            
                            <div class="form-actions">
                                <button type="button" class="btn-primary btn-large" id="generateQR">
                                    <i class="fas fa-qrcode"></i> Generate QR Code
                                </button>
                                <button type="button" class="btn-secondary" id="pauseQR">
                                    <i class="fas fa-pause"></i> Pause
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Live QR Display -->
                <div class="qr-display card">
                    <div class="card-header">
                        <h3><i class="fas fa-play-circle"></i> Live QR Display</h3>
                        <div class="qr-status">
                            <span class="status-badge active" id="qrStatus">Active</span>
                            <span class="countdown" id="liveExpiry">05:00</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="qr-container">
                            <div class="qr-code" id="liveQRCode">
                                <div class="qr-placeholder">
                                    <i class="fas fa-qrcode"></i>
                                    <p>Click Generate to Create QR Code</p>
                                </div>
                            </div>
                            
                            <div class="qr-details">
                                <div class="detail-item">
                                    <span class="detail-label"><i class="fas fa-key"></i> Token:</span>
                                    <code id="liveToken">--</code>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label"><i class="fas fa-map-marker-alt"></i> Location:</span>
                                    <span id="liveLocation">--</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label"><i class="fas fa-calendar"></i> Generated:</span>
                                    <span id="liveGenerated">--</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="qr-actions">
                            <button class="btn-secondary" id="refreshLiveQR">
                                <i class="fas fa-redo"></i> Refresh
                            </button>
                            <button class="btn-secondary" id="fullscreenQR">
                                <i class="fas fa-expand"></i> Fullscreen
                            </button>
                            <button class="btn-primary" id="downloadQR">
                                <i class="fas fa-download"></i> Download
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Stats Panel -->
                <div class="stats-panel card">
                    <div class="card-header">
                        <h3><i class="fas fa-chart-line"></i> QR Statistics</h3>
                    </div>
                    <div class="card-body">
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-qrcode"></i>
                                </div>
                                <div class="stat-info">
                                    <h4>Generated Today</h4>
                                    <p class="stat-value">24</p>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-mobile-alt"></i>
                                </div>
                                <div class="stat-info">
                                    <h4>Total Scans</h4>
                                    <p class="stat-value">1,245</p>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-users"></i>
                                </div>
                                <div class="stat-info">
                                    <h4>Active Users</h4>
                                    <p class="stat-value">89</p>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div class="stat-info">
                                    <h4>Avg. Scan Time</h4>
                                    <p class="stat-value">2.3s</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent QR Codes -->
                <div class="history-panel card">
                    <div class="card-header">
                        <h3><i class="fas fa-history"></i> Recent QR Codes</h3>
                        <button class="btn-sm" id="refreshHistory">
                            <i class="fas fa-sync-alt"></i> Refresh
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="table-container">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Token</th>
                                        <th>Generated</th>
                                        <th>Expired</th>
                                        <th>Scans</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody id="qrHistory"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>
    
    <script src="qr-generator.js"></script>
</body>
</html>