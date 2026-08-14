<?php
include '../includes/db.php';

// Check if admin is logged in
if (!isset($_SESSION['admin_id'])) {
    header("Location: ../login.php");
    exit();
}

$success_msg = "";
$error_msg = "";

// 1. Handle Delete Action
if (isset($_GET['delete_id'])) {
    $delete_id = intval($_GET['delete_id']);
    try {
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$delete_id]);
        $success_msg = "Senior Citizen account deleted successfully.";
    } catch (PDOException $e) {
        $error_msg = "Error deleting account: " . $e->getMessage();
    }
}

// 2. Handle Edit Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'edit_user') {
    $user_id = intval($_POST['user_id']);
    $full_name = trim($_POST['full_name'] ?? '');
    $age = intval($_POST['age'] ?? 0);
    $gender = trim($_POST['gender'] ?? '');
    $mobile = trim($_POST['mobile_number'] ?? '');
    $address = trim($_POST['address'] ?? '');
    $email = trim($_POST['email'] ?? '');

    if (empty($full_name) || empty($age) || empty($gender) || empty($mobile) || empty($address) || empty($email)) {
        $error_msg = "Please fill in all details.";
    } else {
        try {
            // Check email uniqueness, excluding this user
            $check_stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
            $check_stmt->execute([$email, $user_id]);
            if ($check_stmt->fetch()) {
                $error_msg = "This email address is already assigned to another user.";
            } else {
                $stmt = $pdo->prepare("UPDATE users SET full_name = ?, age = ?, gender = ?, mobile_number = ?, address = ?, email = ? WHERE id = ?");
                $stmt->execute([$full_name, $age, $gender, $mobile, $address, $email, $user_id]);
                $success_msg = "Senior Citizen profile updated successfully.";
            }
        } catch (PDOException $e) {
            $error_msg = "Error updating user: " . $e->getMessage();
        }
    }
}

// 3. Fetch Users with Search & Filter
$search_query = isset($_GET['search']) ? trim($_GET['search']) : '';
$users = [];

try {
    if (!empty($search_query)) {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE full_name LIKE ? OR email LIKE ? OR mobile_number LIKE ? ORDER BY created_at DESC");
        $like_param = "%$search_query%";
        $stmt->execute([$like_param, $like_param, $like_param]);
    } else {
        $stmt = $pdo->query("SELECT * FROM users ORDER BY created_at DESC");
    }
    $users = $stmt->fetchAll();
} catch (PDOException $e) {
    $error_msg = "Error loading users: " . $e->getMessage();
}

// 4. Fetch specific user data if editing is triggered
$edit_user = null;
if (isset($_GET['edit_id'])) {
    $edit_id = intval($_GET['edit_id']);
    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$edit_id]);
        $edit_user = $stmt->fetch();
    } catch (PDOException $e) {
        $error_msg = "Error loading user profile: " . $e->getMessage();
    }
}

include '../includes/header.php';
?>

<div class="container" style="padding: 40px 20px;">
    
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 15px;">
        <div class="section-header" style="text-align: left; margin: 0;">
            <h1>Manage Senior Citizens</h1>
            <p>View, update, or remove registered senior citizens from the database.</p>
        </div>
        <a href="dashboard.php" class="btn btn-outline-nav"><i class="fa-solid fa-arrow-left"></i> Back to Dashboard</a>
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

    <!-- User Edit Desk Form (shown when edit_id query is active) -->
    <?php if ($edit_user): ?>
        <div class="card" style="margin-bottom: 40px; border-top: 5px solid var(--color-accent); padding: 30px;">
            <h2 style="font-size: 1.5rem; margin-bottom: 20px;"><i class="fa-solid fa-user-pen"></i> Edit Senior Citizen Profile: <?php echo htmlspecialchars($edit_user['full_name']); ?></h2>
            <form action="manage_users.php" method="POST">
                <input type="hidden" name="action" value="edit_user">
                <input type="hidden" name="user_id" value="<?php echo $edit_user['id']; ?>">

                <div class="grid-3" style="grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="form-group">
                        <label for="edt_name">Full Name <span class="required">*</span></label>
                        <input type="text" name="full_name" id="edt_name" class="form-control" value="<?php echo htmlspecialchars($edit_user['full_name']); ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="edt_email">Email Address <span class="required">*</span></label>
                        <input type="email" name="email" id="edt_email" class="form-control" value="<?php echo htmlspecialchars($edit_user['email']); ?>" required>
                    </div>
                </div>

                <div class="grid-3" style="grid-template-columns: 1fr 1fr 1.2fr; gap: 20px;">
                    <div class="form-group">
                        <label for="edt_age">Age <span class="required">*</span></label>
                        <input type="number" name="age" id="edt_age" class="form-control" value="<?php echo htmlspecialchars($edit_user['age']); ?>" min="60" max="120" required>
                    </div>
                    <div class="form-group">
                        <label for="edt_gender">Gender <span class="required">*</span></label>
                        <select name="gender" id="edt_gender" class="form-control" required>
                            <option value="Male" <?php echo ($edit_user['gender'] === 'Male') ? 'selected' : ''; ?>>Male</option>
                            <option value="Female" <?php echo ($edit_user['gender'] === 'Female') ? 'selected' : ''; ?>>Female</option>
                            <option value="Other" <?php echo ($edit_user['gender'] === 'Other') ? 'selected' : ''; ?>>Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edt_phone">Mobile Number <span class="required">*</span></label>
                        <input type="tel" name="mobile_number" id="edt_phone" class="form-control" value="<?php echo htmlspecialchars($edit_user['mobile_number']); ?>" pattern="[0-9]{10}" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="edt_address">Home Address <span class="required">*</span></label>
                    <textarea name="address" id="edt_address" class="form-control" required><?php echo htmlspecialchars($edit_user['address']); ?></textarea>
                </div>

                <div style="display: flex; gap: 15px; margin-top: 15px;">
                    <button type="submit" class="btn btn-primary"><i class="fa-solid fa-save"></i> Save Profile Details</button>
                    <a href="manage_users.php" class="btn btn-outline-nav">Cancel Changes</a>
                </div>
            </form>
        </div>
    <?php endif; ?>

    <!-- Search / Search bar controls -->
    <div class="admin-controls-card">
        <form action="manage_users.php" method="GET" style="display: flex; width: 100%; gap: 15px; flex-wrap: wrap;">
            <input type="text" name="search" class="form-control search-input" placeholder="Search by name, email, or mobile number..." value="<?php echo htmlspecialchars($search_query); ?>">
            <button type="submit" class="btn btn-primary"><i class="fa-solid fa-magnifying-glass"></i> Search</button>
            <?php if (!empty($search_query)): ?>
                <a href="manage_users.php" class="btn btn-outline-nav"><i class="fa-solid fa-arrow-rotate-left"></i> Reset</a>
            <?php endif; ?>
        </form>
    </div>

    <!-- Users Table List -->
    <?php if (empty($users)): ?>
        <div class="card text-center" style="padding: 40px;">
            <p>No registered senior citizens match your search.</p>
        </div>
    <?php else: ?>
        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Senior Citizen</th>
                        <th>Age/Gender</th>
                        <th>Contact Details</th>
                        <th>Home Address</th>
                        <th>Registered Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($users as $u): ?>
                        <tr>
                            <td>
                                <strong style="font-size: 1.1rem; color: var(--color-primary-dark);"><?php echo htmlspecialchars($u['full_name']); ?></strong>
                            </td>
                            <td>
                                <span style="font-weight: 700;"><?php echo htmlspecialchars($u['age']); ?> Yrs</span> / <?php echo htmlspecialchars($u['gender']); ?>
                            </td>
                            <td style="font-size: 0.95rem;">
                                <i class="fa-solid fa-envelope" style="color: var(--color-text-light);"></i> <?php echo htmlspecialchars($u['email']); ?><br>
                                <i class="fa-solid fa-phone" style="color: var(--color-text-light);"></i> <?php echo htmlspecialchars($u['mobile_number']); ?>
                            </td>
                            <td style="font-size: 0.95rem; line-height: 1.4; max-width: 250px;">
                                <?php echo nl2br(htmlspecialchars($u['address'])); ?>
                            </td>
                            <td style="font-size: 0.9rem;">
                                <?php echo date('d M Y', strtotime($u['created_at'])); ?>
                            </td>
                            <td>
                                <div style="display: flex; gap: 8px;">
                                    <a href="manage_users.php?edit_id=<?php echo $u['id']; ?>" class="btn-action edit" title="Edit Senior Profile">
                                        <i class="fa-solid fa-user-pen"></i> Edit
                                    </a>
                                    <a href="manage_users.php?delete_id=<?php echo $u['id']; ?>" class="btn-action delete" onclick="return confirm('Are you sure you want to delete the profile of <?php echo htmlspecialchars($u['full_name']); ?>? All their service requests will also be permanently deleted.');" title="Delete Senior Profile">
                                        <i class="fa-solid fa-trash-can"></i> Delete
                                    </a>
                                </div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>

</div>

<?php
include '../includes/footer.php';
?>
