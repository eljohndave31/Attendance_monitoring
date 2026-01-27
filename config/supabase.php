<?php

function supabaseRequest($method, $endpoint, $data = null) {
    $SUPABASE_URL = 'https://cawfhjwvgesahkinlebv.supabase.co';
    $SUPABASE_KEY = 'sb_secret_8wjtFL1dByqiO-KMsOpWEA_-epnEztA'; 

    // Check if API key is set
    if ($SUPABASE_KEY === 'YOUR_SERVICE_ROLE_KEY' || empty($SUPABASE_KEY)) {
        error_log('ERROR: Supabase API key not configured');
        http_response_code(500);
        return ['error' => 'Supabase API key not configured. Please set SUPABASE_KEY in supabase.php'];
    }

    $url = $SUPABASE_URL . '/rest/v1/' . $endpoint;
    $ch = curl_init($url);

    $headers = [
        "apikey: $SUPABASE_KEY",
        "Authorization: Bearer $SUPABASE_KEY",
        "Content-Type: application/json"
    ];

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    if ($data) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
        error_log('CURL Error: ' . $curlError);
        return ['error' => 'Request failed: ' . $curlError];
    }

    error_log('Supabase Response [' . $httpCode . ']: ' . $response);

    if ($httpCode >= 400) {
        return ['error' => 'HTTP ' . $httpCode, 'details' => $response];
    }

    return json_decode($response, true);
}
?>
