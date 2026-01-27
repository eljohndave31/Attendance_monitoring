<?php
require '../config/supabase.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // GET employees
    case 'GET':
        $result = supabaseRequest('GET', 'employees?order=created_at.desc');
        
        if (isset($result['error'])) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => $result['error']]);
        } else {
            echo json_encode($result);
        }
        break;

    // ADD employee
    case 'POST':
        $inputData = file_get_contents("php://input");
        $data = json_decode($inputData, true);
        
        error_log('POST Data: ' . $inputData);
        
        if (!$data || !isset($data['full_name']) || !isset($data['email'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Missing required fields: full_name, email"]);
            break;
        }

        $payloadData = [
            "employee_id" => $data['employee_id'] ?? '',
            "full_name"   => $data['full_name'],
            "email"       => $data['email'],
            "phone"       => $data['phone'] ?? null,
            "department"  => $data['department'] ?? '',
            "position"    => $data['position'] ?? '',
            "status"      => $data['status'] ?? 'active',
            "join_date"   => $data['join_date'] ?? date('Y-m-d'),
            "address"     => $data['address'] ?? null
        ];

        $result = supabaseRequest('POST', 'employees', $payloadData);
        
        if (isset($result['error'])) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => $result['error'], "details" => $result]);
        } else {
            echo json_encode(["success" => true, "data" => $result]);
        }
        break;

    // UPDATE employee
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data || !isset($data['id'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Missing employee ID"]);
            break;
        }

        $result = supabaseRequest(
            'PATCH',
            'employees?id=eq.' . $data['id'],
            $data
        );

        if (isset($result['error'])) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => $result['error']]);
        } else {
            echo json_encode(["success" => true, "data" => $result]);
        }
        break;

    // DELETE employee
    case 'DELETE':
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Missing employee ID"]);
            break;
        }

        $result = supabaseRequest('DELETE', 'employees?id=eq.' . $id);
        
        if (isset($result['error'])) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => $result['error']]);
        } else {
            echo json_encode(["success" => true, "data" => $result]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "error" => "Invalid request method"]);
}
?>
