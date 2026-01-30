<?php
// Set timezone based on system or explicit configuration
$userTimezone = 'Asia/Manila'; // Change this to match your timezone

// Verify timezone is valid
if (!in_array($userTimezone, timezone_identifiers_list())) {
    $userTimezone = 'UTC';
}

date_default_timezone_set($userTimezone);
?>
