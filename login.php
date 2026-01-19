<?php
// login.php
session_start();
$client = require __DIR__ . '/supabase.php';

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Fetch user from Supabase 'users' table
    $response = $client->from('users')
                       ->select('*')
                       ->eq('email', $email)
                       ->single()
                       ->execute();

    $user = $response->getData();

    if ($user) {
        // Verify hashed password
        if (password_verify($password, $user['password'])) {
            // Check if the role is admin
            if ($user['role'] === 'admin') {
                $_SESSION['admin'] = $user['email'];
                header('Location: dashboard.php'); // Redirect to admin dashboard
                exit;
            } else {
                $error = "You are not authorized as admin.";
            }
        } else {
            $error = "Invalid email or password.";
        }
    } else {
        $error = "Invalid email or password.";
    }
}

// Display error if exists (optional)
if ($error) {
    echo "<script>alert('{$error}'); window.location='login.html';</script>";
}
