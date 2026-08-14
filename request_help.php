<?php
include 'includes/db.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$error_msg = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $request_type = trim($_POST['request_type'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $user_id = $_SESSION['user_id'];

    if (empty($request_type) || empty($description)) {
        $error_msg = "Please choose a request type and write a description.";
    } else {
        try {
            $stmt = $pdo->prepare("INSERT INTO help_requests (user_id, request_type, description, status) VALUES (?, ?, ?, 'Pending')");
            $stmt->execute([$user_id, $request_type, $description]);
            
            // Redirect to dashboard with success query param
            header("Location: dashboard.php?request_created=true");
            exit();
        } catch (PDOException $e) {
            $error_msg = "Error submitting request: " . $e->getMessage();
        }
    }
}

include 'includes/header.php';
?>

<div class="container">
    <div class="form-container">
        <div class="form-title">
            <h1 style="font-size: 2.2rem;"><i class="fa-solid fa-hand-holding-hand"></i> Submit a Help Request</h1>
            <p>Dada, Dadi, tell us what you need. A coordinator will assign a volunteer to assist you as soon as possible.</p>
        </div>

        <?php if (!empty($error_msg)): ?>
            <div style="padding: 15px; border-radius: var(--border-radius); margin-bottom: 20px; font-weight: 700; 
                        background-color: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5;">
                <i class="fa-solid fa-circle-exclamation"></i> <?php echo htmlspecialchars($error_msg); ?>
            </div>
        <?php endif; ?>

        <form action="request_help.php" method="POST" id="helpRequestForm">
            <div class="form-group">
                <label for="req_type">What kind of help do you need? <span class="required">*</span></label>
                <select name="request_type" id="req_type" class="form-control" required style="font-size: 1.15rem; font-weight: 700;">
                    <option value="">-- Click to Select Request Type --</option>
                    <option value="Medical">Medical Support (Medicines / Clinic visit)</option>
                    <option value="Transport">Transport (Accompanied travel to Bank/Temple/Clinic)</option>
                    <option value="Grocery">Grocery Delivery (Supplies, milk, vegetables)</option>
                    <option value="Technical Help">Technical Guidance (Smartphone, bill payments)</option>
                    <option value="Emergency">Emergency (Immediate non-life-threatening help)</option>
                </select>
                <div class="form-error"></div>
            </div>

            <div class="form-group">
                <label for="req_description">Describe what you need in detail <span class="required">*</span></label>
                <textarea name="description" id="req_description" class="form-control" placeholder="Example: 'I need someone to go to SBI Bank Dwarka with me tomorrow at 11 AM.' or 'Please bring 2 liters of full-cream milk and a loaf of bread.'" required style="font-size: 1.1rem; min-height: 150px;"></textarea>
                <div class="form-error"></div>
                <small class="form-hint">Please include details like dates, times, item names, and specific instructions.</small>
            </div>

            <button type="submit" class="btn btn-primary btn-large btn-full"><i class="fa-solid fa-paper-plane"></i> Send Help Request</button>
        </form>

        <p class="text-center" style="margin-top: 20px;">
            <a href="dashboard.php"><i class="fa-solid fa-circle-arrow-left"></i> Go Back to My Dashboard</a>
        </p>
    </div>
</div>

<?php
include 'includes/footer.php';
?>
