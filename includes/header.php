<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Calculate base path for links depending on whether the script is in /admin/
$base_path = "";
if (strpos($_SERVER['REQUEST_URI'], '/admin/') !== false) {
    $base_path = "../";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digital Dada Dadi - Help Management Desk for Seniors</title>
    <!-- Google Fonts for senior friendly readability -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Custom Style Sheet -->
    <link rel="stylesheet" href="<?php echo $base_path; ?>css/style.css">
</head>
<body>

    <!-- Accessibility Bar for Seniors -->
    <div class="accessibility-bar">
        <div class="container accessibility-content">
            <span class="accessibility-text"><i class="fa-solid fa-eye"></i> Text Size Control:</span>
            <div class="btn-group-accessibility">
                <button onclick="changeFontSize(-2)" title="Decrease font size" aria-label="Decrease font size" class="acc-btn">A-</button>
                <button onclick="resetFontSize()" title="Reset font size" aria-label="Reset font size" class="acc-btn active">Normal</button>
                <button onclick="changeFontSize(2)" title="Increase font size" aria-label="Increase font size" class="acc-btn">A+</button>
            </div>
            <div class="emergency-header-action">
                <a href="#emergencyModal" class="btn btn-emergency-header" onclick="openEmergencyModal()"><i class="fa-solid fa-circle-exclamation"></i> Emergency Numbers</a>
            </div>
        </div>
    </div>

    <!-- Main Navigation Header -->
    <header class="main-header">
        <div class="container nav-container">
            <a href="<?php echo $base_path; ?>index.php" class="logo">
                <span class="logo-icon"><i class="fa-solid fa-hands-holding-child"></i></span>
                <div class="logo-text">
                    <span class="logo-title">Digital Dada Dadi</span>
                    <span class="logo-subtitle">Help Management Desk</span>
                </div>
            </a>
            
            <button class="nav-toggle" id="navToggle" aria-label="Toggle Navigation menu">
                <i class="fa-solid fa-bars"></i>
            </button>

            <nav class="nav-menu" id="navMenu">
                <ul>
                    <?php if (isset($_SESSION['admin_id'])): ?>
                        <!-- Admin Navigation -->
                        <li><a href="<?php echo $base_path; ?>admin/dashboard.php"><i class="fa-solid fa-chart-line"></i> Dashboard</a></li>
                        <li><a href="<?php echo $base_path; ?>admin/manage_users.php"><i class="fa-solid fa-users"></i> Manage Seniors</a></li>
                        <li><a href="<?php echo $base_path; ?>admin/manage_requests.php"><i class="fa-solid fa-hand-holding-hand"></i> Manage Requests</a></li>
                        <li class="nav-user-badge">
                            <span class="badge"><i class="fa-solid fa-user-shield"></i> Admin: <?php echo htmlspecialchars($_SESSION['admin_name']); ?></span>
                        </li>
                        <li><a href="<?php echo $base_path; ?>logout.php" class="btn btn-nav-logout"><i class="fa-solid fa-right-from-bracket"></i> Logout</a></li>

                    <?php elseif (isset($_SESSION['user_id'])): ?>
                        <!-- User (Senior Citizen) Navigation -->
                        <li><a href="<?php echo $base_path; ?>index.php"><i class="fa-solid fa-house"></i> Home</a></li>
                        <li><a href="<?php echo $base_path; ?>dashboard.php"><i class="fa-solid fa-user-tag"></i> My Dashboard</a></li>
                        <li><a href="<?php echo $base_path; ?>request_help.php" class="btn btn-primary"><i class="fa-solid fa-hand-holding-hand"></i> Request Help</a></li>
                        <li><a href="<?php echo $base_path; ?>about.php"><i class="fa-solid fa-circle-info"></i> About Us</a></li>
                        <li><a href="<?php echo $base_path; ?>contact.php"><i class="fa-solid fa-envelope"></i> Contact</a></li>
                        <li class="nav-user-badge">
                            <span class="badge"><i class="fa-solid fa-circle-user"></i> Namaste, <?php echo htmlspecialchars(explode(' ', trim($_SESSION['user_name']))[0]); ?></span>
                        </li>
                        <li><a href="<?php echo $base_path; ?>logout.php" class="btn btn-outline-nav"><i class="fa-solid fa-right-from-bracket"></i> Logout</a></li>

                    <?php else: ?>
                        <!-- Guest Navigation -->
                        <li><a href="<?php echo $base_path; ?>index.php"><i class="fa-solid fa-house"></i> Home</a></li>
                        <li><a href="<?php echo $base_path; ?>about.php"><i class="fa-solid fa-circle-info"></i> About Us</a></li>
                        <li><a href="<?php echo $base_path; ?>contact.php"><i class="fa-solid fa-envelope"></i> Contact</a></li>
                        <li><a href="<?php echo $base_path; ?>login.php" class="btn btn-outline-nav"><i class="fa-solid fa-right-to-bracket"></i> Login</a></li>
                        <li><a href="<?php echo $base_path; ?>register.php" class="btn btn-primary"><i class="fa-solid fa-user-plus"></i> Join Us (Register)</a></li>
                    <?php endif; ?>
                </ul>
            </nav>
        </div>
    </header>

    <!-- Global Emergency Modal -->
    <div class="modal-overlay" id="emergencyModalOverlay" onclick="closeEmergencyModal()"></div>
    <div class="modal" id="emergencyModal" role="dialog" aria-modal="true" aria-labelledby="emergencyTitle">
        <div class="modal-header">
            <h2 id="emergencyTitle" class="emergency-title"><i class="fa-solid fa-phone-volume"></i> Emergency Contact Numbers</h2>
            <button class="modal-close" onclick="closeEmergencyModal()">&times;</button>
        </div>
        <div class="modal-body">
            <p class="emergency-instructions">Dada, Dadi, if you are in danger or have a medical emergency, call these numbers immediately. They are free to call at any time.</p>
            <div class="emergency-card-grid">
                <div class="emergency-card medical">
                    <span class="em-icon"><i class="fa-solid fa-truck-medical"></i></span>
                    <div class="em-details">
                        <h3>Ambulance</h3>
                        <a href="tel:102" class="em-num">102</a>
                    </div>
                </div>
                <div class="emergency-card police">
                    <span class="em-icon"><i class="fa-solid fa-shield-halved"></i></span>
                    <div class="em-details">
                        <h3>Police</h3>
                        <a href="tel:100" class="em-num">100</a>
                    </div>
                </div>
                <div class="emergency-card fire">
                    <span class="em-icon"><i class="fa-solid fa-fire-extinguisher"></i></span>
                    <div class="em-details">
                        <h3>Fire Station</h3>
                        <a href="tel:101" class="em-num">101</a>
                    </div>
                </div>
                <div class="emergency-card seniors">
                    <span class="em-icon"><i class="fa-solid fa-hands-holding"></i></span>
                    <div class="em-details">
                        <h3>Senior Helpline</h3>
                        <a href="tel:14567" class="em-num">14567</a>
                    </div>
                </div>
            </div>
            <div class="emergency-alert-desc">
                <p><strong>Need local volunteer assistance?</strong> If it is not life-threatening but you need quick help, log in and submit a <strong>"Help Request"</strong> with type <strong>"Emergency"</strong>, and our desk staff will reach out to you immediately.</p>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary btn-large" onclick="closeEmergencyModal()">Close</button>
        </div>
    </div>
    
    <!-- Toast notifications container -->
    <div id="toastContainer" class="toast-container"></div>

    <main class="main-content-area">
