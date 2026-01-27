<?php
session_start();

// Prevent direct access if not POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: landingpage.php');
    exit;
}

// Validate and sanitize inputs
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$password = trim($_POST['password'] ?? '');

// Basic validation
if (empty($email) || empty($password)) {
    $_SESSION['login_error'] = 'Email and password are required.';
    $_SESSION['login_email'] = $email;
    header('Location: landingpage.php');
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $_SESSION['login_error'] = 'Please enter a valid email address.';
    $_SESSION['login_email'] = $email;
    header('Location: landingpage.php');
    exit;
}

// Store email for repopulating form
$_SESSION['login_email'] = $email;

$SUPABASE_URL = 'https://cawfhjwvgesahkinlebv.supabase.co';
$SUPABASE_ANONKEY = 'sb_publishable_33_zaVawObgAMvodXsxfVQ_lcCrAzKV';

/* AUTH LOGIN */
$authUrl = $SUPABASE_URL . '/auth/v1/token?grant_type=password';

$ch = curl_init($authUrl);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'apikey: ' . $SUPABASE_ANONKEY
    ],
    CURLOPT_POSTFIELDS => json_encode([
        'email' => $email,
        'password' => $password
    ]),
    CURLOPT_TIMEOUT => 10, // Add timeout for security
    CURLOPT_SSL_VERIFYPEER => true, // Verify SSL certificate
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Check for CURL errors
if ($curlError) {
    error_log("CURL Error: " . $curlError);
    $_SESSION['login_error'] = 'Connection error. Please try again.';
    header('Location: landingpage.php');
    exit;
}

$authData = json_decode($response, true);

// Handle authentication failure
// In your login.php file, this section handles errors:
if ($httpCode !== 200 || !isset($authData['access_token'])) {
    $errorMessage = 'Invalid email or password.'; // This is the default message
    
    if (isset($authData['error_description'])) {
        $errorMessage = $authData['error_description'];
    } elseif (isset($authData['message'])) {
        $errorMessage = $authData['message'];
    } elseif ($httpCode >= 500) {
        $errorMessage = 'Server error. Please try again later.';
    }
    
    $_SESSION['login_error'] = $errorMessage;   
    header('Location: landingpage.php');
    exit;
}
$accessToken = $authData['access_token'];

// CHECK ADMIN ROLE
$usersUrl = $SUPABASE_URL . '/rest/v1/users?email=eq.' . urlencode($email) . '&select=role';

$ch = curl_init($usersUrl);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'apikey: ' . $SUPABASE_ANONKEY,
        'Authorization: Bearer ' . $accessToken
    ],
    CURLOPT_TIMEOUT => 10,
    CURLOPT_SSL_VERIFYPEER => true,
]);

$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$userData = json_decode($result, true);

if (empty($userData) || !isset($userData[0]['role'])) {
    $_SESSION['login_error'] = 'User not found in database.';
    header('Location: landingpage.php');
    exit;
}

if ($userData[0]['role'] !== 'admin') {
    $_SESSION['login_error'] = 'Access denied. Admins only.';
    header('Location: landingpage.php');
    exit;
}

// Clear previous login error and email
unset($_SESSION['login_error']);
unset($_SESSION['login_email']);

// Regenerate session ID for security
session_regenerate_id(true);

// Set session variables
$_SESSION['admin'] = $email;
$_SESSION['token'] = $accessToken;
$_SESSION['user_id'] = $authData['user']['id'] ?? '';
$_SESSION['role'] = 'admin';
$_SESSION['login_time'] = time();

// Add some security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

header('Location: dashboard.php');
exit;
?>