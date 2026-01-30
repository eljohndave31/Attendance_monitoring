<?php
require '../config/timezone.php';
require '../config/supabase.php';
header('Content-Type: application/json');

// Set timezone to UTC for consistent storage
date_default_timezone_set('UTC');
$timezone = 'UTC';
$displayTimezone = 'Asia/Manila';

$input = json_decode(file_get_contents("php://input"), true);

$expiryMinutes = intval($input['expiry_minutes'] ?? 5);
$locationId = $input['location_id'] ?? 'office_main';

// Create in Manila timezone, then convert to UTC for storage
$manilaNow = new DateTime('now', new DateTimeZone($displayTimezone));
$manilaExpires = clone $manilaNow;
$manilaExpires->modify("+$expiryMinutes minutes");

// Convert to UTC for storage in Supabase
$utcNow = clone $manilaNow;
$utcNow->setTimezone(new DateTimeZone($timezone));

$utcExpires = clone $manilaExpires;
$utcExpires->setTimezone(new DateTimeZone($timezone));

$token = bin2hex(random_bytes(16));

// Store in UTC format (Supabase standard)
$generatedAt = $utcNow->format('Y-m-d H:i:s');
$expiresAt = $utcExpires->format('Y-m-d H:i:s');

$qrPayload = [
    "token" => $token,
    "location_id" => $locationId,
    "generated_at" => $generatedAt,
    "expires_at" => $expiresAt
];

$qrData = json_encode($qrPayload);

// Save to Supabase - store in UTC
supabaseRequest('POST', 'qr_codes', [
    "token" => $token,
    "location_id" => $locationId,
    "qr_data" => $qrData,
    "generated_at" => $generatedAt,
    "expires_at" => $expiresAt,
    "is_active" => true
]);

// Format display times in Manila timezone
$generatedAtDisplay = $manilaNow->format('m/d/Y h:i A');
$expiresAtDisplay = $manilaExpires->format('m/d/Y h:i A');

echo json_encode([
    "success" => true,
    "token" => $token,
    "qr_data" => $qrData,
    "location_id" => $locationId,
    "generated_at" => $utcNow->format('c'),
    "expires_at" => $utcExpires->format('c'),
    "generated_at_display" => $generatedAtDisplay,
    "expires_at_display" => $expiresAtDisplay,
    "timezone" => $displayTimezone,
    "server_timestamp" => round($utcNow->getTimestamp() * 1000)
]);
?>

