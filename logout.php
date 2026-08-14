<?php
// Logout helper script to clear current sessions and redirect to main index
session_start();

// Unset all session variables
$_SESSION = array();

// Destroy session cookies if they exist
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Destroy session
session_destroy();

// Redirect back to login page
header("Location: login.php");
exit();
?>
