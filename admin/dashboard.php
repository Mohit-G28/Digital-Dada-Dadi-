<?php
include '../includes/db.php';

// Check if admin is logged in
if (!isset($_SESSION['admin_id'])) {
    header("Location: ../login.php");
    exit();
}

$error_msg = "";

// Fetch Statistics
$count_users = 0;
$count_pending = 0;
$count_inprogress = 0;
$count_completed = 0;

try {
    // 1. Total Seniors
    $stmt = $pdo->query("SELECT COUNT(*) FROM users");
    $count_users = $stmt->fetchColumn();

    // 2. Pending Requests
    $stmt = $pdo->query("SELECT COUNT(*) FROM help_requests WHERE status = 'Pending'");
    $count_pending = $stmt->fetchColumn();

    // 3. In Progress Requests
    $stmt = $pdo->query("SELECT COUNT(*) FROM help_requests WHERE status = 'In Progress'");
    $count_inprogress = $stmt->fetchColumn();

    // 4. Completed Requests
    $stmt = $pdo->query("SELECT COUNT(*) FROM help_requests WHERE status = 'Completed'");
    $count_completed = $stmt->fetchColumn();

    // Fetch Recent 5 Help Requests
    $stmt = $pdo->query("SELECT hr.*, u.full_name as senior_name, u.mobile_number as senior_phone 
                         FROM help_requests hr 
                         JOIN users u ON hr.user_id = u.id 
                         ORDER BY hr.created_at DESC LIMIT 5");
    $recent_requests = $stmt->fetchAll();

    // Fetch Recent 5 Contact Messages
    $stmt = $pdo->query("SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5");
    $recent_messages = $stmt->fetchAll();

} catch (PDOException $e) {
    $error_msg = "Database statistics load error: " . $e->getMessage();
}

include '../includes/header.php';
?>

<div class="container" style="padding: 40px 20px;">
    
    <div class="section-header" style="text-align: left; margin-bottom: 30px;">
        <h1>Admin Control Dashboard</h1>
        <p>Manage elder help requests, review contacts, update statuses, and coordinate field volunteers.</p>
    </div>

    <?php if (!empty($error_msg)): ?>
        <div style="padding: 15px; border-radius: var(--border-radius); margin-bottom: 25px; font-weight: 700; 
                    background-color: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5;">
            <i class="fa-solid fa-circle-exclamation"></i> <?php echo htmlspecialchars($error_msg); ?>
        </div>
    <?php endif; ?>

    <!-- Metrics Row -->
    <div class="metrics-row">
        <!-- Seniors Card -->
        <div class="metric-card users">
            <div>
                <div class="metric-num"><?php echo $count_users; ?></div>
                <div class="metric-title">Total Seniors</div>
            </div>
            <i class="fa-solid fa-users" style="font-size: 2.2rem; color: var(--color-primary);"></i>
        </div>

        <!-- Pending Card -->
        <div class="metric-card pending">
            <div>
                <div class="metric-num"><?php echo $count_pending; ?></div>
                <div class="metric-title">Pending Help</div>
            </div>
            <i class="fa-solid fa-clock" style="font-size: 2.2rem; color: var(--color-accent);"></i>
        </div>

        <!-- In Progress Card -->
        <div class="metric-card inprogress">
            <div>
                <div class="metric-num"><?php echo $count_inprogress; ?></div>
                <div class="metric-title">In Progress</div>
            </div>
            <i class="fa-solid fa-person-running" style="font-size: 2.2rem; color: var(--color-secondary);"></i>
        </div>

        <!-- Completed Card -->
        <div class="metric-card completed">
            <div>
                <div class="metric-num"><?php echo $count_completed; ?></div>
                <div class="metric-title">Completed Tasks</div>
            </div>
            <i class="fa-solid fa-circle-check" style="font-size: 2.2rem; color: var(--color-success);"></i>
        </div>
    </div>

    <!-- Quick Links Grid -->
    <div class="admin-controls-card" style="margin-bottom: 40px; justify-content: space-around; padding: 25px;">
        <span style="font-weight: 800; font-size: 1.15rem; color: var(--color-primary-dark);"><i class="fa-solid fa-gear"></i> Quick Actions Desk:</span>
        <a href="manage_requests.php" class="btn btn-primary"><i class="fa-solid fa-hand-holding-hand"></i> Process Help Requests</a>
        <a href="manage_users.php" class="btn btn-secondary"><i class="fa-solid fa-users-gear"></i> Manage Senior Profiles</a>
    </div>

    <!-- Details Sections -->
    <div class="grid-3" style="grid-template-columns: 1.8fr 1.2fr; gap: 30px; align-items: start;">
        
        <!-- Recent Requests -->
        <div>
            <h2><i class="fa-solid fa-clock-rotate-left"></i> Recent Help Requests</h2>
            
            <?php if (empty($recent_requests)): ?>
                <div class="card text-center" style="padding: 30px;">
                    <p>No help requests submitted yet.</p>
                </div>
            <?php else: ?>
                <div class="table-responsive" style="margin-top: 15px;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Senior</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($recent_requests as $req): ?>
                                <tr>
                                    <td>
                                        <strong><?php echo htmlspecialchars($req['senior_name']); ?></strong><br>
                                        <span style="font-size: 0.85rem; color: var(--color-text-light);"><?php echo htmlspecialchars($req['senior_phone']); ?></span>
                                    </td>
                                    <td>
                                        <span style="font-weight: 700;"><?php echo htmlspecialchars($req['request_type']); ?></span>
                                    </td>
                                    <td>
                                        <?php 
                                        $status = $req['status'];
                                        $badge_class = "pending";
                                        if ($status === 'In Progress') $badge_class = "in-progress";
                                        if ($status === 'Completed') $badge_class = "completed";
                                        ?>
                                        <span class="status-badge <?php echo $badge_class; ?>" style="padding: 3px 8px; font-size: 0.75rem;">
                                            <?php echo htmlspecialchars($status); ?>
                                        </span>
                                    </td>
                                    <td>
                                        <a href="manage_requests.php?search=<?php echo urlencode($req['senior_name']); ?>" class="btn-action edit">
                                            <i class="fa-solid fa-arrow-right"></i> Manage
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
                <div style="margin-top: 15px; text-align: right;">
                    <a href="manage_requests.php">View All Help Requests <i class="fa-solid fa-chevron-right"></i></a>
                </div>
            <?php endif; ?>
        </div>

        <!-- Recent Contact messages -->
        <div>
            <h2><i class="fa-solid fa-envelope-open-text"></i> Desk Inquiries</h2>
            
            <?php if (empty($recent_messages)): ?>
                <div class="card text-center" style="padding: 30px;">
                    <p>No inquiry messages received.</p>
                </div>
            <?php else: ?>
                <div style="display: flex; flex-direction: column; gap: 15px; margin-top: 15px;">
                    <?php foreach ($recent_messages as $msg): ?>
                        <div class="card" style="padding: 20px; font-size: 0.95rem; border-left: 4px solid var(--color-accent);">
                            <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 5px; font-size: 0.9rem;">
                                <span style="color: var(--color-primary-dark);"><?php echo htmlspecialchars($msg['name']); ?></span>
                                <span style="color: var(--color-text-light); font-size: 0.8rem; font-weight: 400;"><?php echo date('d M', strtotime($msg['created_at'])); ?></span>
                            </div>
                            <div style="font-size: 0.85rem; color: var(--color-text-light); margin-bottom: 8px;">
                                <i class="fa-solid fa-envelope"></i> <?php echo htmlspecialchars($msg['email']); ?>
                            </div>
                            <p style="margin-bottom: 0; font-style: italic; line-height: 1.4; color: var(--color-text-dark);">
                                "<?php echo htmlspecialchars($msg['message']); ?>"
                            </p>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>

    </div>

</div>

<?php
include '../includes/footer.php';
?>
