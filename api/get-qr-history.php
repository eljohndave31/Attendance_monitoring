<?php
require '../config/timezone.php';
require '../config/supabase.php';
header('Content-Type: application/json');

// Set timezone to UTC for consistent comparison
date_default_timezone_set('UTC');
$storageTimezone = 'UTC';
$displayTimezone = 'Asia/Manila';

$rows = supabaseRequest(
    'GET',
    'qr_codes?order=generated_at.desc&limit=10'
);

// If error from supabase
if (isset($rows['error'])) {
    echo json_encode(['success' => false, 'error' => $rows['error']]);
    exit;
}

$history = [];
$now = new DateTime('now', new DateTimeZone($storageTimezone));

foreach ($rows as $row) {
    // Get the raw date strings from Supabase (stored in UTC)
    $rawGenerated = $row['generated_at'] ?? null;
    $rawExpires = $row['expires_at'] ?? null;
    
    if (!$rawGenerated || !$rawExpires) {
        continue;
    }
    
    // Parse dates - Supabase stores them in UTC
    try {
        // Parse as UTC (Supabase standard)
        $generatedAt = new DateTime($rawGenerated, new DateTimeZone($storageTimezone));
        $expiresAt = new DateTime($rawExpires, new DateTimeZone($storageTimezone));
    } catch (Exception $e) {
        error_log('Error parsing dates: ' . $e->getMessage());
        continue;
    }
    
    // Determine status using UTC timestamps
    $isExpired = $expiresAt->getTimestamp() <= $now->getTimestamp();
    $status = $isExpired ? 'Expired' : 'Active';
    
    // Update database if status changed
    if ($isExpired && $row['is_active']) {
        supabaseRequest(
            'PATCH',
            'qr_codes?token=eq.' . $row['token'],
            ['is_active' => false]
        );
    }

    // Format for display in Manila timezone
    $generatedAtManila = clone $generatedAt;
    $generatedAtManila->setTimezone(new DateTimeZone($displayTimezone));
    
    $expiresAtManila = clone $expiresAt;
    $expiresAtManila->setTimezone(new DateTimeZone($displayTimezone));

    // Format: 01/29/2026 12:45 AM
    $generatedFormatted = $generatedAtManila->format('m/d/Y h:i A');
    $expiredFormatted = $expiresAtManila->format('m/d/Y h:i A');

    $history[] = [
        "token" => $row['token'],
        "generated" => $generatedFormatted,
        "expired" => $expiredFormatted,
        "scans" => $row['scans'] ?? 0,
        "status" => $status
    ];
}

echo json_encode([
    "success" => true,
    "history" => $history,
    "timezone" => $displayTimezone
]);
?>

