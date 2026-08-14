<?php
include 'includes/db.php';

// If already logged in, redirect to respective dashboard
if (isset($_SESSION['user_id'])) {
    header("Location: dashboard.php");
    exit();
} elseif (isset($_SESSION['admin_id'])) {
    header("Location: admin/dashboard.php");
    exit();
}

$error_user = "";
$error_admin = "";
$registration_success = isset($_GET['registered']) && $_GET['registered'] === 'true';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $login_type = $_POST['login_type'] ?? '';

    if ($login_type === 'user') {
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        if (empty($email) || empty($password)) {
            $error_user = "Please fill in all details.";
        } else {
            try {
                $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
                $stmt->execute([$email]);
                $user = $stmt->fetch();

                if ($user && password_verify($password, $user['password'])) {
                    // Start Session
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['user_name'] = $user['full_name'];
                    $_SESSION['user_email'] = $user['email'];
                    $_SESSION['user_age'] = $user['age'];
                    $_SESSION['user_gender'] = $user['gender'];
                    $_SESSION['user_mobile'] = $user['mobile_number'];
                    $_SESSION['user_address'] = $user['address'];
                    
                    header("Location: dashboard.php");
                    exit();
                } else {
                    $error_user = "Invalid email or password. Please try again.";
                }
            } catch (PDOException $e) {
                $error_user = "System error: " . $e->getMessage();
            }
        }
    } elseif ($login_type === 'admin') {
        $username = trim($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';

        if (empty($username) || empty($password)) {
            $error_admin = "Please fill in all details.";
        } else {
            try {
                $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ?");
                $stmt->execute([$username]);
                $admin = $stmt->fetch();

                if ($admin && password_verify($password, $admin['password'])) {
                    // Start Session
                    $_SESSION['admin_id'] = $admin['id'];
                    $_SESSION['admin_username'] = $admin['username'];
                    $_SESSION['admin_name'] = $admin['full_name'];
                    
                    header("Location: admin/dashboard.php");
                    exit();
                } else {
                    $error_admin = "Invalid username or password. Please try again.";
                }
            } catch (PDOException $e) {
                $error_admin = "System error: " . $e->getMessage();
            }
        }
    }
}

include 'includes/header.php';
?>

<div class="container">
    <div class="form-container">
        <!-- Display registration success notice -->
        <?php if ($registration_success): ?>
            <div style="padding: 20px; border-radius: var(--border-radius); margin-bottom: 25px; font-weight: 700; 
                        background-color: #dcfce7; color: #15803d; border: 2px solid #bbf7d0; text-align: center;">
                <i class="fa-solid fa-circle-check" style="font-size: 1.8rem; display: block; margin-bottom: 8px;"></i>
                Congratulations, Dada/Dadi!<br>Your registration is complete. Please log in below.
            </div>
        <?php endif; ?>

        <div class="form-title">
            <h1 style="font-size: 2.2rem;"><i class="fa-solid fa-right-to-bracket"></i> Login Panel</h1>
            <p>Please select your login type below to enter the portal.</p>
        </div>

        <!-- Login Tabs (Toggle between User and Admin) -->
        <div class="login-tabs">
            <button type="button" class="tab-btn <?php echo ($error_admin === '') ? 'active' : ''; ?>" data-tab="seniorLogin">
                <i class="fa-solid fa-circle-user"></i> Senior Citizen
            </button>
            <button type="button" class="tab-btn <?php echo ($error_admin !== '') ? 'active' : ''; ?>" data-tab="adminLogin">
                <i class="fa-solid fa-user-shield"></i> Admin Staff
            </button>
        </div>

        <!-- A. Senior Citizen Login Form -->
        <div class="tab-content <?php echo ($error_admin === '') ? 'active' : ''; ?>" id="seniorLogin">
            <?php if (!empty($error_user)): ?>
                <div style="padding: 15px; border-radius: var(--border-radius); margin-bottom: 20px; font-weight: 700; 
                            background-color: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5;">
                    <i class="fa-solid fa-circle-exclamation"></i> <?php echo htmlspecialchars($error_user); ?>
                </div>
            <?php endif; ?>

            <form action="login.php" method="POST" id="userLoginForm">
                <input type="hidden" name="login_type" value="user">

                <div class="form-group">
                    <label for="usr_email">Your Registered Email <span class="required">*</span></label>
                    <input type="email" name="email" id="usr_email" class="form-control" placeholder="name@email.com" required>
                </div>

                <div class="form-group">
                    <label for="usr_password">Password <span class="required">*</span></label>
                    <input type="password" name="password" id="usr_password" class="form-control" placeholder="Enter your password" required>
                </div>

                <button type="submit" class="btn btn-primary btn-large btn-full"><i class="fa-solid fa-sign-in-alt"></i> Login as Senior</button>
            </form>

            <p class="text-center" style="margin-top: 20px; font-size: 1.05rem;">
                New to the platform? <a href="register.php"><strong>Register as Senior Citizen here</strong></a>
            </p>
        </div>

        <!-- B. Admin Staff Login Form -->
        <div class="tab-content <?php echo ($error_admin !== '') ? 'active' : ''; ?>" id="adminLogin">
            <?php if (!empty($error_admin)): ?>
                <div style="padding: 15px; border-radius: var(--border-radius); margin-bottom: 20px; font-weight: 700; 
                            background-color: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5;">
                    <i class="fa-solid fa-circle-exclamation"></i> <?php echo htmlspecialchars($error_admin); ?>
                </div>
            <?php endif; ?>

            <form action="login.php" method="POST" id="adminLoginForm">
                <input type="hidden" name="login_type" value="admin">

                <div class="form-group">
                    <label for="adm_username">Admin Username <span class="required">*</span></label>
                    <input type="text" name="username" id="adm_username" class="form-control" placeholder="Enter admin username" required>
                </div>

                <div class="form-group">
                    <label for="adm_password">Password <span class="required">*</span></label>
                    <input type="password" name="password" id="adm_password" class="form-control" placeholder="Enter admin password" required>
                </div>

                <button type="submit" class="btn btn-secondary btn-large btn-full"><i class="fa-solid fa-shield-halved"></i> Login as Admin</button>
            </form>
            <p class="text-center" style="margin-top: 20px; font-size: 0.9rem; color: var(--color-text-light);">
                Demo admin credentials: Username <code>admin</code> / Password <code>adminpassword123</code>
            </p>
        </div>

    </div>
</div>

<?php
include 'includes/footer.php';
?>
