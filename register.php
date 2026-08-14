<?php
include 'includes/db.php';

$error_msg = "";
$success_msg = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $full_name = trim($_POST['full_name'] ?? '');
    $age = intval($_POST['age'] ?? 0);
    $gender = trim($_POST['gender'] ?? '');
    $mobile = trim($_POST['mobile_number'] ?? '');
    $address = trim($_POST['address'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    // Backend Validation
    if (empty($full_name) || empty($age) || empty($gender) || empty($mobile) || empty($address) || empty($email) || empty($password)) {
        $error_msg = "Please fill in all the required fields.";
    } elseif ($age < 60) {
        $error_msg = "To join as a senior citizen, you must be 60 years of age or older.";
    } elseif (!preg_match("/^[0-9]{10}$/", $mobile)) {
        $error_msg = "Please enter a valid 10-digit mobile number.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error_msg = "Please enter a valid email address.";
    } elseif (strlen($password) < 6) {
        $error_msg = "Password must be at least 6 characters long.";
    } elseif ($password !== $confirm_password) {
        $error_msg = "Passwords do not match.";
    } else {
        try {
            // Check if email already registered
            $check_stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $check_stmt->execute([$email]);
            if ($check_stmt->fetch()) {
                $error_msg = "This email is already registered. Please go to the Login page.";
            } else {
                // Hash Password
                $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                
                // Insert User Record
                $insert_stmt = $pdo->prepare("INSERT INTO users (full_name, age, gender, mobile_number, address, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)");
                $insert_stmt->execute([$full_name, $age, $gender, $mobile, $address, $email, $hashed_password]);
                
                // Set success message and redirect
                header("Location: login.php?registered=true");
                exit();
            }
        } catch (PDOException $e) {
            $error_msg = "System error: " . $e->getMessage();
        }
    }
}

include 'includes/header.php';
?>

<div class="container">
    <div class="form-container">
        <div class="form-title">
            <h1 style="font-size: 2.2rem;"><i class="fa-solid fa-user-plus"></i> Senior Registration</h1>
            <p>Dada, Dadi, Nana, Nani - join our family! Fill in your details below so we can assist you.</p>
        </div>

        <?php if (!empty($error_msg)): ?>
            <div style="padding: 15px; border-radius: var(--border-radius); margin-bottom: 20px; font-weight: 700; 
                        background-color: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5;">
                <i class="fa-solid fa-circle-exclamation"></i> <?php echo htmlspecialchars($error_msg); ?>
            </div>
        <?php endif; ?>

        <form action="register.php" method="POST" id="registerForm">
            
            <div class="form-group">
                <label for="reg_name">Full Name <span class="required">*</span></label>
                <input type="text" name="full_name" id="reg_name" class="form-control" placeholder="Enter your full name" value="<?php echo isset($_POST['full_name']) ? htmlspecialchars($_POST['full_name']) : ''; ?>" required>
                <div class="form-error"></div>
            </div>

            <div class="grid-3" style="grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="form-group">
                    <label for="reg_age">Age (Must be 60+) <span class="required">*</span></label>
                    <input type="number" name="age" id="reg_age" class="form-control" placeholder="Your age" min="60" max="120" value="<?php echo isset($_POST['age']) ? htmlspecialchars($_POST['age']) : ''; ?>" required>
                    <div class="form-error"></div>
                </div>

                <div class="form-group">
                    <label for="reg_gender">Gender <span class="required">*</span></label>
                    <select name="gender" id="reg_gender" class="form-control" required>
                        <option value="">Select Gender</option>
                        <option value="Male" <?php echo (isset($_POST['gender']) && $_POST['gender'] === 'Male') ? 'selected' : ''; ?>>Male</option>
                        <option value="Female" <?php echo (isset($_POST['gender']) && $_POST['gender'] === 'Female') ? 'selected' : ''; ?>>Female</option>
                        <option value="Other" <?php echo (isset($_POST['gender']) && $_POST['gender'] === 'Other') ? 'selected' : ''; ?>>Other</option>
                    </select>
                    <div class="form-error"></div>
                </div>
            </div>

            <div class="form-group">
                <label for="reg_mobile">Mobile Number (10 Digits) <span class="required">*</span></label>
                <input type="tel" name="mobile_number" id="reg_mobile" class="form-control" placeholder="e.g. 9876543210" pattern="[0-9]{10}" value="<?php echo isset($_POST['mobile_number']) ? htmlspecialchars($_POST['mobile_number']) : ''; ?>" required>
                <div class="form-error"></div>
            </div>

            <div class="form-group">
                <label for="reg_address">Home Address <span class="required">*</span></label>
                <textarea name="address" id="reg_address" class="form-control" placeholder="Please write your detailed address so volunteers can visit you..." required><?php echo isset($_POST['address']) ? htmlspecialchars($_POST['address']) : ''; ?></textarea>
                <div class="form-error"></div>
                <small class="form-hint">Mention house number, street name, landmarks, and city clearly.</small>
            </div>

            <div class="form-group">
                <label for="reg_email">Email Address <span class="required">*</span></label>
                <input type="email" name="email" id="reg_email" class="form-control" placeholder="name@email.com" value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>" required>
                <div class="form-error"></div>
            </div>

            <div class="grid-3" style="grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="form-group">
                    <label for="reg_password">Password <span class="required">*</span></label>
                    <input type="password" name="password" id="reg_password" class="form-control" placeholder="Min 6 characters" required>
                    <div class="form-error"></div>
                </div>

                <div class="form-group">
                    <label for="reg_confirm_password">Confirm Password <span class="required">*</span></label>
                    <input type="password" name="confirm_password" id="reg_confirm_password" class="form-control" placeholder="Re-type password" required>
                    <div class="form-error"></div>
                </div>
            </div>

            <button type="submit" class="btn btn-primary btn-large btn-full"><i class="fa-solid fa-user-check"></i> Complete Registration</button>
        </form>

        <p class="text-center" style="margin-top: 20px;">
            Already have an account? <a href="login.php"><strong>Click here to Login</strong></a>
        </p>
    </div>
</div>

<?php
include 'includes/footer.php';
?>
