<?php
session_start();

if (!isset($_SESSION['admin'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

require '../config/timezone.php';
require '../config/supabase.php';
header('Content-Type: application/json');

// Set timezone to UTC for consistent comparison
date_default_timezone_set('UTC');
$storageTimezone = 'UTC';
$displayTimezone = 'Asia/Manila';

// Fetch latest QR codes
$rows = supabaseRequest(
    'GET',
    'qr_codes?order=generated_at.desc&limit=10'
);

$now = new DateTime('now', new DateTimeZone($storageTimezone));
$activeQR = null;

// Find the first QR code that is actually not expired
foreach ($rows as $row) {
    try {
        // Parse as UTC (Supabase standard)
        $expiresAt = new DateTime($row['expires_at'], new DateTimeZone($storageTimezone));
    } catch (Exception $e) {
        error_log('Error parsing expires_at: ' . $e->getMessage());
        continue;
    }
    
    $expiresTimestamp = $expiresAt->getTimestamp();
    $nowTimestamp = $now->getTimestamp();
    
    if ($expiresTimestamp > $nowTimestamp) {
        $activeQR = $row;
        break;
    } else {
        if ($row['is_active']) {
            supabaseRequest(
                'PATCH',
                'qr_codes?token=eq.' . $row['token'],
                ['is_active' => false]
            );
        }
    }
}

if ($activeQR) {
    $qr = $activeQR;
    
    // Parse dates - stored in UTC in Supabase
    try {
        $generatedAt = new DateTime($qr['generated_at'], new DateTimeZone($storageTimezone));
        $expiresAt = new DateTime($qr['expires_at'], new DateTimeZone($storageTimezone));
    } catch (Exception $e) {
        error_log('Error parsing dates: ' . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Error parsing QR data']);
        exit;
    }
    
    // Format dates as ISO 8601 with explicit UTC offset
    $expiresAtFormatted = $expiresAt->format('Y-m-d\\TH:i:s');
    $expiresAtFormatted .= 'Z';
    
    $generatedAtFormatted = $generatedAt->format('Y-m-d\\TH:i:s');
    $generatedAtFormatted .= 'Z';
    
    // Format display times in Manila timezone
    $generatedAtManila = clone $generatedAt;
    $generatedAtManila->setTimezone(new DateTimeZone($displayTimezone));
    
    $expiresAtManila = clone $expiresAt;
    $expiresAtManila->setTimezone(new DateTimeZone($displayTimezone));
    
    echo json_encode([
        'success' => true,
        'token' => $qr['token'],
        'location_id' => $qr['location_id'],
        'qr_data' => $qr['qr_data'],
        'expires_at' => $expiresAtFormatted,
        'generated_at' => $generatedAtFormatted,
        'expires_at_display' => $expiresAtManila->format('m/d/Y h:i A'),
        'generated_at_display' => $generatedAtManila->format('m/d/Y h:i A'),
        'timezone' => $displayTimezone
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'No active QR code found'
    ]);
}
?>
