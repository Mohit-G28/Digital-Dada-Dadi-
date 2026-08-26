<?php
// Digital Dada Dadi Help Management Desk - Database Configuration
// Supports Supabase PostgreSQL REST Integration & PDO Fallback

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Supabase Configuration
define('SUPABASE_URL', getenv('SUPABASE_URL') ?: 'https://your-supabase-project-id.supabase.co');
define('SUPABASE_ANON_KEY', getenv('SUPABASE_ANON_KEY') ?: 'placeholderKey');

/**
 * Send HTTP Request to Supabase REST API (PostgREST)
 */
function supabase_request($endpoint, $method = 'GET', $data = null, $headers = []) {
    $url = rtrim(SUPABASE_URL, '/') . '/rest/v1/' . ltrim($endpoint, '/');
    
    $default_headers = [
        'apikey: ' . SUPABASE_ANON_KEY,
        'Authorization: Bearer ' . SUPABASE_ANON_KEY,
        'Content-Type: application/json',
        'Prefer: return=representation'
    ];
    
    $all_headers = array_merge($default_headers, $headers);
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, strtoupper($method));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $all_headers);
    
    if ($data !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, is_string($data) ? $data : json_encode($data));
    }
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'status' => $http_code,
        'data' => json_decode($response, true)
    ];
}

// MySQL PDO Optional Fallback
$pdo = null;
$host = 'localhost';
$db   = 'digital_dada_dadi';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // MySQL unavailable; system operates via Supabase JS SDK on deployed frontend
}
?>
