<?php
require __DIR__ . '/vendor/autoload.php';

use Supabase\CreateClient;

$supabaseUrl = 'https://cawfhjwvgesahkinlebv.supabase.co';
$supabaseKey = 'sb_secret_8wjtFL1dByqiO-KMsOpWEA_-epnEztA';


// $client = createClient($supabaseUrl, $supabaseKey);
$client = new CreateClient($supabaseUrl, $supabaseKey);


// Return the client for reuse in other files
return $client; 