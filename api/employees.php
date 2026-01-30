<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

ini_set('display_errors', 0);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/supabase.php';

$method = $_SERVER['REQUEST_METHOD'];

// Handle photo upload request
if (isset($_GET['upload_photo']) && $_GET['upload_photo'] === 'true') {
    $inputData = file_get_contents("php://input");
    $data = json_decode($inputData, true);
    
    if (!$data || !isset($data['photo_data'])) {
        echo json_encode(['success' => false, 'error' => 'No photo data provided']);
        exit;
    }
    
    $photoData = $data['photo_data'];
    
    // Decode base64 image data
    if (preg_match('/^data:image\/(\w+);base64,/', $photoData, $matches)) {
        $imageType = strtolower($matches[1]);
        $base64Data = substr($photoData, strpos($photoData, ',') + 1);
        $imageData = base64_decode($base64Data);
        
        if ($imageData === false) {
            echo json_encode(['success' => false, 'error' => 'Invalid image data']);
            exit;
        }
        
        // Validate image type
        $allowedTypes = ['jpeg', 'jpg', 'png', 'gif'];
        if (!in_array($imageType, $allowedTypes)) {
            echo json_encode(['success' => false, 'error' => 'Invalid image type. Allowed: JPEG, PNG, GIF']);
            exit;
        }
        
        // Create uploads directory if it doesn't exist
        $uploadDir = __DIR__ . '/../uploads/employees/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        // Generate unique filename
        $filename = 'employee_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $imageType;
        $filePath = $uploadDir . $filename;
        
        // Save the image
        if (file_put_contents($filePath, $imageData) === false) {
            echo json_encode(['success' => false, 'error' => 'Failed to save image']);
            exit;
        }
        
        // Return the URL (relative to web root)
        $photoUrl = '/Attendance_monitoring/uploads/employees/' . $filename;
        echo json_encode(['success' => true, 'photo_url' => $photoUrl]);
        exit;
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid image format']);
        exit;
    }
}

try {
    switch ($method) {
        // GET employees
        case 'GET':
            $result = supabaseRequest('GET', 'employees?order=created_at.desc');
            
            if (isset($result['error'])) {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => $result['error']]);
            } else {
                echo json_encode($result ?? []);
            }
            break;

        // ADD employee
        case 'POST':
            $inputData = file_get_contents("php://input");
            $data = json_decode($inputData, true);
            
            if (!$data || !isset($data['full_name']) || !isset($data['email'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Missing required fields: full_name, email']);
                break;
            }

            $payloadData = [
                'employee_id' => $data['employee_id'] ?? '',
                'full_name'   => $data['full_name'],
                'email'       => $data['email'],
                'phone'       => $data['phone'] ?? null,
                'department'  => $data['department'] ?? '',
                'position'    => $data['position'] ?? '',
                'status'      => $data['status'] ?? 'active',
                'join_date'   => $data['join_date'] ?? date('Y-m-d'),
                'address'     => $data['address'] ?? null,
                'photo_url'   => $data['photo_url'] ?? null
            ];

            $result = supabaseRequest('POST', 'employees', $payloadData);
            
            if (isset($result['error'])) {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => $result['error']]);
            } else {
                echo json_encode(['success' => true, 'data' => $result]);
            }
            break;

        // UPDATE employee
        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);

            if (!$data || !isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Missing employee ID']);
                break;
            }

            $updateData = [
                'employee_id' => $data['employee_id'] ?? null,
                'full_name'   => $data['full_name'] ?? null,
                'email'       => $data['email'] ?? null,
                'phone'       => $data['phone'] ?? null,
                'department'  => $data['department'] ?? null,
                'position'    => $data['position'] ?? null,
                'status'      => $data['status'] ?? null,
                'join_date'   => $data['join_date'] ?? null,
                'address'     => $data['address'] ?? null,
                'photo_url'   => $data['photo_url'] ?? null
            ];

            // Remove null values
            $updateData = array_filter($updateData, function($value) {
                return $value !== null;
            });

            $result = supabaseRequest('PATCH', 'employees?id=eq.' . $data['id'], $updateData);

            if (isset($result['error'])) {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => $result['error']]);
            } else {
                echo json_encode(['success' => true, 'data' => $result]);
            }
            break;

        // DELETE employee
        case 'DELETE':
            $id = $_GET['id'] ?? null;
            
            if (!$id) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Missing employee ID']);
                break;
            }

            $result = supabaseRequest('DELETE', 'employees?id=eq.' . $id);
            
            if (isset($result['error'])) {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => $result['error']]);
            } else {
                echo json_encode(['success' => true, 'data' => $result]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Invalid request method']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
exit;
?>
