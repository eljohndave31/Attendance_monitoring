<?php
require_once __DIR__ . '/../config/supabase.php';

$page = $_GET['page'] ?? 'landingpage';

$viewFile = __DIR__ . '/../app/views/' . $page . '.php';

if (!file_exists($viewFile)) {
    http_response_code(404);
    echo "Page not found";
    exit;
}

require __DIR__ . '/../app/layouts/header.php';
require __DIR__ . '/../app/layouts/sidebar.php';
require $viewFile;
