<?php
include '../includes/db.php';

// Check if admin is logged in
if (!isset($_SESSION['admin_id'])) {
    header("Location: ../login.php");
    exit();
}

$success_msg = "";
$error_msg = "";

// 1. Handle Status Update
if (isset($_POST['action']) && $_POST['action'] === 'update_status') {
    $request_id = intval($_POST['request_id']);
    $new_status = trim($_POST['status'] ?? '');
    
    if (in_array($new_status, ['Pending', 'In Progress', 'Completed'])) {
        try {
            $stmt = $pdo->prepare("UPDATE help_requests SET status = ? WHERE id = ?");
            $stmt->execute([$new_status, $request_id]);
            $success_msg = "Request status updated successfully to '$new_status'.";
        } catch (PDOException $e) {
            $error_msg = "Error updating status: " . $e->getMessage();
        }
    } else {
        $error_msg = "Invalid status selected.";
    }
}

// 2. Handle Delete Request Action
if (isset($_GET['delete_id'])) {
    $delete_id = intval($_GET['delete_id']);
    try {
        $stmt = $pdo->prepare("DELETE FROM help_requests WHERE id = ?");
        $stmt->execute([$delete_id]);
        $success_msg = "Help request deleted successfully.";
    } catch (PDOException $e) {
        $error_msg = "Error deleting request: " . $e->getMessage();
    }
}

// 3. Filters
$search_query = isset($_GET['search']) ? trim($_GET['search']) : '';
$status_filter = isset($_GET['status_filter']) ? trim($_GET['status_filter']) : '';
$type_filter = isset($_GET['type_filter']) ? trim($_GET['type_filter']) : '';

$requests = [];

try {
    // Build SQL dynamically based on filters
    $sql = "SELECT hr.*, u.full_name as senior_name, u.age as senior_age, u.mobile_number as senior_phone, u.address as senior_address 
            FROM help_requests hr 
            JOIN users u ON hr.user_id = u.id";
    
    $where_clauses = [];
    $params = [];

    if (!empty($search_query)) {
        $where_clauses[] = "(u.full_name LIKE ? OR hr.description LIKE ?)";
        $params[] = "%$search_query%";
        $params[] = "%$search_query%";
    }

    if (!empty($status_filter)) {
        $where_clauses[] = "hr.status = ?";
        $params[] = $status_filter;
    }

    if (!empty($type_filter)) {
        $where_clauses[] = "hr.request_type = ?";
        $params[] = $type_filter;
    }

    if (count($where_clauses) > 0) {
        $sql .= " WHERE " . implode(" AND ", $where_clauses);
    }

    $sql .= " ORDER BY hr.created_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $requests = $stmt->fetchAll();

} catch (PDOException $e) {
    $error_msg = "Error loading requests: " . $e->getMessage();
}

include '../includes/header.php';
?>

<div class="container" style="padding: 40px 20px;">
    
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 15px;">
        <div class="section-header" style="text-align: left; margin: 0;">
            <h1>Manage Help Requests</h1>
            <p>Monitor senior needs, coordinate response teams, and update progress states.</p>
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

    <!-- Search & Filter Desk -->
    <div class="admin-controls-card">
        <form action="manage_requests.php" method="GET" style="display: flex; width: 100%; gap: 15px; flex-wrap: wrap; align-items: flex-end;">
            
            <div style="flex: 2; min-width: 250px;">
                <label for="search" style="display: block; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--color-primary-dark); margin-bottom: 5px;">Search Text</label>
                <input type="text" name="search" id="search" class="form-control" style="padding: 8px 12px; font-size: 1rem; min-height: 38px;" placeholder="Search name or request content..." value="<?php echo htmlspecialchars($search_query); ?>">
            </div>

            <div style="flex: 1; min-width: 150px;">
                <label for="status_filter" style="display: block; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--color-primary-dark); margin-bottom: 5px;">Status</label>
                <select name="status_filter" id="status_filter" class="form-control" style="padding: 8px 12px; font-size: 1rem; min-height: 38px;">
                    <option value="">-- All Statuses --</option>
                    <option value="Pending" <?php echo ($status_filter === 'Pending') ? 'selected' : ''; ?>>Pending</option>
                    <option value="In Progress" <?php echo ($status_filter === 'In Progress') ? 'selected' : ''; ?>>In Progress</option>
                    <option value="Completed" <?php echo ($status_filter === 'Completed') ? 'selected' : ''; ?>>Completed</option>
                </select>
            </div>

            <div style="flex: 1; min-width: 150px;">
                <label for="type_filter" style="display: block; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--color-primary-dark); margin-bottom: 5px;">Help Category</label>
                <select name="type_filter" id="type_filter" class="form-control" style="padding: 8px 12px; font-size: 1rem; min-height: 38px;">
                    <option value="">-- All Categories --</option>
                    <option value="Medical" <?php echo ($type_filter === 'Medical') ? 'selected' : ''; ?>>Medical</option>
                    <option value="Transport" <?php echo ($type_filter === 'Transport') ? 'selected' : ''; ?>>Transport</option>
                    <option value="Grocery" <?php echo ($type_filter === 'Grocery') ? 'selected' : ''; ?>>Grocery</option>
                    <option value="Technical Help" <?php echo ($type_filter === 'Technical Help') ? 'selected' : ''; ?>>Technical Help</option>
                    <option value="Emergency" <?php echo ($type_filter === 'Emergency') ? 'selected' : ''; ?>>Emergency</option>
                </select>
            </div>

            <div style="display: flex; gap: 8px;">
                <button type="submit" class="btn btn-primary" style="padding: 8px 16px; font-size: 1rem; min-height: 38px;"><i class="fa-solid fa-filter"></i> Apply</button>
                <?php if (!empty($search_query) || !empty($status_filter) || !empty($type_filter)): ?>
                    <a href="manage_requests.php" class="btn btn-outline-nav" style="padding: 8px 16px; font-size: 1rem; min-height: 38px;"><i class="fa-solid fa-arrow-rotate-left"></i> Reset</a>
                <?php endif; ?>
            </div>
        </form>
    </div>

    <!-- Requests Table -->
    <?php if (empty($requests)): ?>
        <div class="card text-center" style="padding: 40px;">
            <p>No help requests match your filtering criteria.</p>
        </div>
    <?php else: ?>
        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Date & Category</th>
                        <th>Senior Details</th>
                        <th>Requirements / Description</th>
                        <th>Status Control</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($requests as $req): ?>
                        <tr <?php echo $req['request_type'] === 'Emergency' && $req['status'] !== 'Completed' ? 'style="background-color: #fff1f2; border-left: 5px solid var(--color-danger);"' : ''; ?>>
                            <td style="font-size: 0.95rem; width: 180px;">
                                <strong><?php echo date('d M Y, h:i A', strtotime($req['created_at'])); ?></strong><br>
                                <span style="font-weight: 700; color: <?php echo $req['request_type'] === 'Emergency' ? 'var(--color-danger)' : 'var(--color-primary-dark)'; ?>;">
                                    <?php 
                                    $type = $req['request_type'];
                                    $icon = "fa-hand-holding";
                                    if ($type === "Medical") $icon = "fa-prescription-bottle-medical";
                                    if ($type === "Transport") $icon = "fa-car-side";
                                    if ($type === "Grocery") $icon = "fa-basket-shopping";
                                    if ($type === "Technical Help") $icon = "fa-mobile-screen-button";
                                    if ($type === "Emergency") $icon = "fa-circle-exclamation";
                                    ?>
                                    <i class="fa-solid <?php echo $icon; ?>"></i> <?php echo htmlspecialchars($type); ?>
                                </span>
                            </td>
                            <td>
                                <strong style="font-size: 1.1rem; color: var(--color-primary-dark);"><?php echo htmlspecialchars($req['senior_name']); ?></strong> 
                                <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-accent-dark);">(Age: <?php echo htmlspecialchars($req['senior_age']); ?>)</span><br>
                                <span style="font-size: 0.95rem; font-weight: 600;"><i class="fa-solid fa-phone"></i> <?php echo htmlspecialchars($req['senior_phone']); ?></span><br>
                                <span style="font-size: 0.85rem; color: var(--color-text-light); line-height: 1.3; display: block; max-width: 200px;">
                                    <i class="fa-solid fa-location-dot"></i> <?php echo htmlspecialchars($req['senior_address']); ?>
                                </span>
                            </td>
                            <td style="font-size: 1rem; line-height: 1.5; max-width: 320px;">
                                <div style="background-color: var(--color-bg-light); padding: 12px; border-radius: var(--border-radius); border: 1px solid var(--color-border);">
                                    <?php echo nl2br(htmlspecialchars($req['description'])); ?>
                                </div>
                            </td>
                            <td style="width: 180px;">
                                <form action="manage_requests.php?<?php echo http_build_query($_GET); ?>" method="POST" style="display: flex; flex-direction: column; gap: 8px;">
                                    <input type="hidden" name="action" value="update_status">
                                    <input type="hidden" name="request_id" value="<?php echo $req['id']; ?>">
                                    
                                    <select name="status" class="form-control" style="padding: 6px 10px; font-size: 0.9rem; min-height: 34px; font-weight: 700;" onchange="this.form.submit()">
                                        <option value="Pending" <?php echo ($req['status'] === 'Pending') ? 'selected' : ''; ?>>Pending</option>
                                        <option value="In Progress" <?php echo ($req['status'] === 'In Progress') ? 'selected' : ''; ?>>In Progress</option>
                                        <option value="Completed" <?php echo ($req['status'] === 'Completed') ? 'selected' : ''; ?>>Completed</option>
                                    </select>
                                    
                                    <?php 
                                    $status = $req['status'];
                                    $badge_class = "pending";
                                    if ($status === 'In Progress') $badge_class = "in-progress";
                                    if ($status === 'Completed') $badge_class = "completed";
                                    ?>
                                    <span class="status-badge <?php echo $badge_class; ?>" style="justify-content: center; font-size: 0.8rem; padding: 4px;">
                                        Current: <?php echo htmlspecialchars($status); ?>
                                    </span>
                                </form>
                            </td>
                            <td style="width: 100px;">
                                <a href="manage_requests.php?delete_id=<?php echo $req['id']; ?>&<?php echo http_build_query($_GET); ?>" class="btn-action delete" onclick="return confirm('Are you sure you want to delete this help request?');" title="Delete Request">
                                    <i class="fa-solid fa-trash-can"></i> Delete
                                </a>
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
