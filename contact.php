<?php
include 'includes/db.php';
include 'includes/header.php';

$message_status = "";
$message_type = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $msg = trim($_POST['message'] ?? '');
    
    if (!empty($name) && !empty($email) && !empty($msg)) {
        try {
            $stmt = $pdo->prepare("INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)");
            $stmt->execute([$name, $email, $msg]);
            $message_status = "Pranam! Thank you for writing to us. We have received your message and our team will get back to you shortly.";
            $message_type = "success";
        } catch (PDOException $e) {
            $message_status = "Sorry, we could not save your message right now. Please try again or call our helpline.";
            $message_type = "error";
        }
    } else {
        $message_status = "Please write your name, email, and message before submitting.";
        $message_type = "error";
    }
}
?>

<section class="section-padding">
    <div class="container">
        <div class="section-header">
            <h1>Contact Us</h1>
            <p>Have questions, want to volunteer, or need assistance? Reach out to us anytime!</p>
        </div>

        <div class="grid-3" style="grid-template-columns: 1fr 1.5fr; gap: 40px; align-items: start;">
            <!-- Address and details card -->
            <div class="card" style="border-top: 5px solid var(--color-accent);">
                <h3>Office Details</h3>
                <p style="margin-bottom: 25px;">You can visit us, write to us, or call us directly. We are always happy to speak with our elders.</p>
                
                <div class="footer-contact" style="color: var(--color-text-dark);">
                    <p style="color: var(--color-text-dark); margin-bottom: 20px;">
                        <i class="fa-solid fa-location-dot" style="font-size: 1.5rem; color: var(--color-primary);"></i>
                        <span><strong>Office Address:</strong><br>45, Seva Bhavan Road, Elder Care District, New Delhi, India 110001</span>
                    </p>
                    <p style="color: var(--color-text-dark); margin-bottom: 20px;">
                        <i class="fa-solid fa-phone" style="font-size: 1.5rem; color: var(--color-primary);"></i>
                        <span><strong>Phone Support:</strong><br>+91 11 2345 6789</span>
                    </p>
                    <p style="color: var(--color-text-dark); margin-bottom: 20px;">
                        <i class="fa-solid fa-envelope" style="font-size: 1.5rem; color: var(--color-primary);"></i>
                        <span><strong>Email Address:</strong><br>help@digitaldadadadi.org</span>
                    </p>
                    <p style="color: var(--color-text-dark); margin-bottom: 20px;">
                        <i class="fa-solid fa-phone-volume" style="font-size: 1.5rem; color: var(--color-danger);"></i>
                        <span><strong>National Elder Helpline:</strong><br><a href="tel:14567" style="color: var(--color-danger); font-size: 1.3rem; font-weight: 800;">14567</a> (Toll Free)</span>
                    </p>
                </div>
            </div>

            <!-- Contact Form -->
            <div class="card" style="padding: 30px;">
                <h3>Send Us a Message</h3>
                <p>Fill out the form below. If you are an elder needing immediate help, please use the "Emergency Numbers" or register and request help from your dashboard.</p>
                
                <?php if (!empty($message_status)): ?>
                    <div style="padding: 15px; border-radius: var(--border-radius); margin-bottom: 20px; font-weight: 700; 
                                background-color: <?php echo $message_type === 'success' ? '#dcfce7' : '#fee2e2'; ?>; 
                                color: <?php echo $message_type === 'success' ? '#15803d' : '#b91c1c'; ?>; 
                                border: 1px solid <?php echo $message_type === 'success' ? '#bbf7d0' : '#fca5a5'; ?>;">
                        <i class="fa-solid <?php echo $message_type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'; ?>"></i>
                        <?php echo htmlspecialchars($message_status); ?>
                    </div>
                <?php endif; ?>

                <form action="contact.php" method="POST" id="contactForm">
                    <div class="form-group">
                        <label for="con_name">Your Name <span class="required">*</span></label>
                        <input type="text" name="name" id="con_name" class="form-control" placeholder="Enter your full name" required>
                        <div class="form-error"></div>
                    </div>

                    <div class="form-group">
                        <label for="con_email">Your Email Address <span class="required">*</span></label>
                        <input type="email" name="email" id="con_email" class="form-control" placeholder="Enter email address" required>
                        <div class="form-error"></div>
                    </div>

                    <div class="form-group">
                        <label for="con_message">Message <span class="required">*</span></label>
                        <textarea name="message" id="con_message" class="form-control" placeholder="Type your message here..." required></textarea>
                        <div class="form-error"></div>
                    </div>

                    <button type="submit" class="btn btn-primary btn-large btn-full"><i class="fa-solid fa-paper-plane"></i> Send Message</button>
                </form>
            </div>
        </div>
    </div>
</section>

<?php
include 'includes/footer.php';
?>
