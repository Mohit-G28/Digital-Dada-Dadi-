<?php
include 'includes/db.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];
$success_msg = "";
$error_msg = "";

// Handle Profile Updates
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_profile') {
    $full_name = trim($_POST['full_name'] ?? '');
    $age = intval($_POST['age'] ?? 0);
    $gender = trim($_POST['gender'] ?? '');
    $mobile = trim($_POST['mobile_number'] ?? '');
    $address = trim($_POST['address'] ?? '');

    if (empty($full_name) || empty($age) || empty($gender) || empty($mobile) || empty($address)) {
        $error_msg = "Please fill in all details.";
    } elseif ($age < 60) {
        $error_msg = "You must be 60 years or older.";
    } elseif (!preg_match("/^[0-9]{10}$/", $mobile)) {
        $error_msg = "Please enter a valid 10-digit mobile number.";
    } else {
        try {
            $stmt = $pdo->prepare("UPDATE users SET full_name = ?, age = ?, gender = ?, mobile_number = ?, address = ? WHERE id = ?");
            $stmt->execute([$full_name, $age, $gender, $mobile, $address, $user_id]);
            
            // Update session values
            $_SESSION['user_name'] = $full_name;
            $_SESSION['user_age'] = $age;
            $_SESSION['user_gender'] = $gender;
            $_SESSION['user_mobile'] = $mobile;
            $_SESSION['user_address'] = $address;

            $success_msg = "Your profile has been updated successfully!";
        } catch (PDOException $e) {
            $error_msg = "Error updating profile: " . $e->getMessage();
        }
    }
}

// Fetch user requests
try {
    $stmt = $pdo->prepare("SELECT * FROM help_requests WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$user_id]);
    $requests = $stmt->fetchAll();
} catch (PDOException $e) {
    $error_msg = "Error fetching requests: " . $e->getMessage();
}

// Check for request creation alert
if (isset($_GET['request_created']) && $_GET['request_created'] === 'true') {
    $success_msg = "Help request submitted successfully! Our volunteers have been notified.";
}

include 'includes/header.php';
?>

<div class="container" style="padding: 40px 20px;">
    
    <div class="section-header" style="text-align: left; margin-bottom: 30px;">
        <h1>My Dashboard</h1>
        <p>Namaste, <strong class="profile-name"><?php echo htmlspecialchars($_SESSION['user_name']); ?></strong>! Welcome to your digital assistance desk. You can request new help or track your previous requests below.</p>
    </div>

    <!-- Alert Notices -->
    <?php if (!empty($success_msg)): ?>
        <div style="padding: 15px; border-radius: var(--border-radius); margin-bottom: 25px; font-weight: 700; 
                    background-color: #dcfce7; color: #15803d; border: 1px solid #bbf7d0;">
            <i class="fa-solid fa-circle-check"></i> <?php echo htmlspecialchars($success_msg); ?>
        </div>
    <?php endif; ?>
    <?php if (!empty($error_msg)): ?>
        <div style="padding: 15px; border-radius: var(--border-radius); margin-bottom: 25px; font-weight: 700; 
                    background-color: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5;">
            <i class="fa-solid fa-circle-exclamation"></i> <?php echo htmlspecialchars($error_msg); ?>
        </div>
    <?php endif; ?>

    <div class="dashboard-grid">
        <!-- Left: Profile Details -->
        <div>
            <div class="profile-card">
                <div class="profile-avatar"><i class="fa-solid fa-circle-user"></i></div>
                <div class="profile-name"><?php echo htmlspecialchars($_SESSION['user_name']); ?></div>
                <div class="profile-age" id="prof_age_badge">Senior Citizen | Age: <?php echo htmlspecialchars($_SESSION['user_age']); ?></div>
                
                <div class="profile-details">
                    <p>
                        <strong>Email Address:</strong>
                        <span id="prof_email_span"><?php echo htmlspecialchars($_SESSION['user_email']); ?></span>
                    </p>
                    <p>
                        <strong>Mobile Number:</strong>
                        <span id="prof_phone_span"><?php echo htmlspecialchars($_SESSION['user_mobile']); ?></span>
                    </p>
                    <p>
                        <strong>Gender:</strong>
                        <span id="prof_gender_span"><?php echo htmlspecialchars($_SESSION['user_gender']); ?></span>
                    </p>
                    <p>
                        <strong>Home Address:</strong>
                        <span id="prof_address_span"><?php echo nl2br(htmlspecialchars($_SESSION['user_address'])); ?></span>
                    </p>
                </div>

                <button onclick="toggleProfileEditForm()" class="btn btn-secondary btn-full" style="margin-top: 20px; font-size: 0.95rem;">
                    <i class="fa-solid fa-user-pen"></i> Edit Profile Details
                </button>
            </div>

            <!-- Profile Edit Form (Hidden by default) -->
            <div id="profileEditFormContainer" class="card" style="display: none; margin-top: 20px; padding: 20px; border-top: 4px solid var(--color-accent);">
                <h3 style="font-size: 1.2rem; margin-bottom: 15px;">Update Profile</h3>
                <form action="dashboard.php" method="POST">
                    <input type="hidden" name="action" value="update_profile">
                    
                    <div class="form-group" style="margin-bottom: 12px;">
                        <label for="prof_name" style="font-size: 0.9rem;">Full Name</label>
                        <input type="text" name="full_name" id="prof_name" class="form-control" style="padding: 8px 12px; font-size: 1rem; min-height: 38px;" value="<?php echo htmlspecialchars($_SESSION['user_name']); ?>" required>
                    </div>

                    <div class="grid-3" style="grid-template-columns: 1fr 1.2fr; gap: 10px; margin-bottom: 12px;">
                        <div class="form-group" style="margin-bottom: 0;">
                            <label for="prof_age" style="font-size: 0.9rem;">Age</label>
                            <input type="number" name="age" id="prof_age" class="form-control" style="padding: 8px 12px; font-size: 1rem; min-height: 38px;" value="<?php echo htmlspecialchars($_SESSION['user_age']); ?>" min="60" max="120" required>
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label for="prof_gender" style="font-size: 0.9rem;">Gender</label>
                            <select name="gender" id="prof_gender" class="form-control" style="padding: 8px 12px; font-size: 1rem; min-height: 38px;" required>
                                <option value="Male" <?php echo $_SESSION['user_gender'] === 'Male' ? 'selected' : ''; ?>>Male</option>
                                <option value="Female" <?php echo $_SESSION['user_gender'] === 'Female' ? 'selected' : ''; ?>>Female</option>
                                <option value="Other" <?php echo $_SESSION['user_gender'] === 'Other' ? 'selected' : ''; ?>>Other</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group" style="margin-bottom: 12px;">
                        <label for="prof_mobile" style="font-size: 0.9rem;">Mobile Number</label>
                        <input type="tel" name="mobile_number" id="prof_mobile" class="form-control" style="padding: 8px 12px; font-size: 1rem; min-height: 38px;" value="<?php echo htmlspecialchars($_SESSION['user_mobile']); ?>" pattern="[0-9]{10}" required>
                    </div>

                    <div class="form-group" style="margin-bottom: 12px;">
                        <label for="prof_address" style="font-size: 0.9rem;">Home Address</label>
                        <textarea name="address" id="prof_address" class="form-control" style="padding: 8px 12px; font-size: 1rem; min-height: 80px;" required><?php echo htmlspecialchars($_SESSION['user_address']); ?></textarea>
                    </div>

                    <div style="display: flex; gap: 10px;">
                        <button type="submit" class="btn btn-primary" style="flex: 1; font-size: 0.9rem; padding: 8px; min-height: 38px;">Save</button>
                        <button type="button" onclick="toggleProfileEditForm()" class="btn btn-outline-nav" style="flex: 1; font-size: 0.9rem; padding: 8px; min-height: 38px;">Cancel</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Right: Requests List & Action -->
        <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
                <h2 style="margin-bottom: 0;"><i class="fa-solid fa-list-check"></i> My Help Requests</h2>
                <a href="request_help.php" class="btn btn-primary"><i class="fa-solid fa-circle-plus"></i> Submit New Help Request</a>
            </div>

            <?php if (empty($requests)): ?>
                <div class="card text-center" style="padding: 40px; border-style: dashed; border-width: 2px;">
                    <i class="fa-solid fa-hand-holding-hand" style="font-size: 3rem; color: var(--color-text-light); margin-bottom: 15px;"></i>
                    <h3>No requests submitted yet</h3>
                    <p>Dada, Dadi, if you need help with medical visits, medicines, grocery shopping, bank trips, or mobile phone settings, please click the button above to request help.</p>
                    <a href="request_help.php" class="btn btn-secondary"><i class="fa-solid fa-hand-holding-hand"></i> Submit Your First Request</a>
                </div>
            <?php else: ?>
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Date Raised</th>
                                <th>Request Category</th>
                                <th>Description / Message</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($requests as $req): ?>
                                <tr>
                                    <td style="font-weight: 600; width: 140px; font-size: 0.95rem;">
                                        <?php echo date('d M Y, h:i A', strtotime($req['created_at'])); ?>
                                    </td>
                                    <td style="font-weight: 700; width: 180px;">
                                        <!-- Show distinct icons per service category -->
                                        <?php 
                                        $type = $req['request_type'];
                                        $icon = "fa-hand-holding";
                                        if ($type === "Medical") $icon = "fa-prescription-bottle-medical";
                                        if ($type === "Transport") $icon = "fa-car-side";
                                        if ($type === "Grocery") $icon = "fa-basket-shopping";
                                        if ($type === "Technical Help") $icon = "fa-mobile-screen-button";
                                        if ($type === "Emergency") $icon = "fa-circle-exclamation";
                                        ?>
                                        <i class="fa-solid <?php echo $icon; ?>" style="color: var(--color-primary); margin-right: 5px;"></i> 
                                        <?php echo htmlspecialchars($type); ?>
                                    </td>
                                    <td style="font-size: 1rem; line-height: 1.5; min-width: 250px;">
                                        <?php echo nl2br(htmlspecialchars($req['description'])); ?>
                                    </td>
                                    <td style="width: 140px;">
                                        <?php 
                                        $status = $req['status'];
                                        $badge_class = "pending";
                                        $status_icon = "fa-clock";
                                        
                                        if ($status === 'In Progress') {
                                            $badge_class = "in-progress";
                                            $status_icon = "fa-person-running";
                                        } elseif ($status === 'Completed') {
                                            $badge_class = "completed";
                                            $status_icon = "fa-circle-check";
                                        }
                                        ?>
                                        <span class="status-badge <?php echo $badge_class; ?>">
                                            <i class="fa-solid <?php echo $status_icon; ?>"></i>
                                            <?php echo htmlspecialchars($status); ?>
                                        </span>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<script>
// Toggle inline profile edit form
function toggleProfileEditForm() {
    const form = document.getElementById('profileEditFormContainer');
    if (form.style.display === 'none') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}
</script>

<?php
include 'includes/footer.php';
?>
