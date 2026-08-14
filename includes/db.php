<?php
// Database connection file using PDO
// Settings for XAMPP default installation

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
     // For security and elder-friendly design, display a friendly message instead of a raw stack trace
     die("<h3>System Notice</h3><p>We are currently experiencing issues connecting to the system. Please ensure your database is running in XAMPP (Apache and MySQL). Details: " . $e->getMessage() . "</p>");
}
?>
