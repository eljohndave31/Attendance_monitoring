<?php
require '../config/supabase.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents("php://input"), true);

if (!$input || empty($input['qr_data']) || empty($input['employee_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid scan data"
    ]);
    exit;
}

$employeeId = $input['employee_id'];
$qrJson = json_decode($input['qr_data'], true);

if (!$qrJson || empty($qrJson['token'])) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid QR format"
    ]);
    exit;
}

$token = $qrJson['token'];
$locationId = $qrJson['location_id'] ?? null;

//  CHECK IF QR EXISTS & IS ACTIVE

$qrResult = supabaseRequest(
    'GET',
    'qr_codes?token=eq.' . $token . '&limit=1'
);

if (count($qrResult) === 0) {
    echo json_encode([
        "success" => false,
        "message" => "QR code not found"
    ]);
    exit;
}

$qr = $qrResult[0];

/**
 * 2️⃣ CHECK EXPIRY
 */
if (strtotime($qr['expires_at']) < time()) {
    echo json_encode([
        "success" => false,
        "message" => "QR code expired"
    ]);
    exit;
}

if (!$qr['is_active']) {
    echo json_encode([
        "success" => false,
        "message" => "QR code inactive"
    ]);
    exit;
}

/**
 * 3️⃣ PREVENT MULTIPLE SCANS (PER EMPLOYEE)
 */
$alreadyScanned = supabaseRequest(
    'GET',
    'attendance_logs?employee_id=eq.' . $employeeId . '&qr_token=eq.' . $token . '&limit=1'
);

if (count($alreadyScanned) > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Attendance already recorded"
    ]);
    exit;
}

/**
 * 4️⃣ SAVE ATTENDANCE
 */
supabaseRequest('POST', 'attendance_logs', [
    "employee_id" => $employeeId,
    "qr_token" => $token,
    "location_id" => $locationId,
    "device_info" => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'
]);

/**
 * 5️⃣ INCREMENT QR SCAN COUNT
 */
supabaseRequest(
    'PATCH',
    'qr_codes?token=eq.' . $token,
    [
        "scans" => intval($qr['scans']) + 1
    ]
);

echo json_encode([
    "success" => true,
    "message" => "Attendance recorded successfully"
]);
