<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require __DIR__ . '/vendor/autoload.php';

use Supabase\CreateClient;

$supabaseUrl = 'https://cawfhjwvgesahkinlebv.supabase.co';
$supabaseKey = 'sb_secret_8wjtFL1dByqiO-KMsOpWEA_-epnEztA';
$supabase = createClient($supabaseUrl, $supabaseKey);

try {
    // Get active QR codes
    $activeQRs = $supabase->from('qr_codes')
        ->select('count')
        ->eq('status', 'active')
        ->execute();
    
    // Get today's scans
    $todayStart = (new DateTime())->setTime(0, 0, 0)->format('Y-m-d H:i:s');
    $todayEnd = (new DateTime())->setTime(23, 59, 59)->format('Y-m-d H:i:s');
    
    $todayScans = $supabase->from('attendance_logs')
        ->select('count')
        ->gte('scan_time', $todayStart)
        ->lte('scan_time', $todayEnd)
        ->execute();
    
    // Get active employees
    $activeEmployees = $supabase->from('employees')
        ->select('count')
        ->eq('status', 'active')
        ->execute();
    
    // Get recent attendance
    $recentAttendance = $supabase->from('attendance_logs')
        ->select('*, employees(first_name, last_name)')
        ->order('scan_time', 'desc')
        ->limit(10)
        ->execute();
    
    $response = [
        'success' => true,
        'stats' => [
            'active_qrs' => $activeQRs['data'][0]['count'] ?? 0,
            'today_scans' => $todayScans['data'][0]['count'] ?? 0,
            'active_employees' => $activeEmployees['data'][0]['count'] ?? 0,
            'recent_attendance' => $recentAttendance['data'] ?? []
        ]
    ];
    
} catch (Exception $e) {
    $response = [
        'success' => false,
        'message' => $e->getMessage()
    ];
}

echo json_encode($response);