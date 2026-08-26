<?php
// Calculate base path for JavaScript script location depending on script directory
$base_path = "";
if (strpos($_SERVER['REQUEST_URI'], '/admin/') !== false) {
    $base_path = "../";
}
?>
    </main>

    <footer class="main-footer">
        <div class="container footer-grid">
            <div class="footer-brand">
                <a href="<?php echo $base_path; ?>index.php" class="footer-logo">
                    <span class="logo-icon"><i class="fa-solid fa-hands-holding-child"></i></span>
                    <span class="logo-text-footer">Digital Dada Dadi</span>
                </a>
                <p class="footer-tagline">Empowering and supporting our elders in the digital age. A helping hand for those who nurtured us.</p>
                <div class="footer-emergency-box">
                    <span class="em-label"><i class="fa-solid fa-phone"></i> Elder Helpline:</span>
                    <a href="tel:14567" class="em-link">14567</a>
                </div>
            </div>

            <div class="footer-links">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="<?php echo $base_path; ?>index.php"><i class="fa-solid fa-chevron-right"></i> Home</a></li>
                    <li><a href="<?php echo $base_path; ?>about.php"><i class="fa-solid fa-chevron-right"></i> About Us</a></li>
                    <li><a href="<?php echo $base_path; ?>contact.php"><i class="fa-solid fa-chevron-right"></i> Contact Page</a></li>
                    <?php if (!isset($_SESSION['user_id']) && !isset($_SESSION['admin_id'])): ?>
                        <li><a href="<?php echo $base_path; ?>login.php"><i class="fa-solid fa-chevron-right"></i> Login Panel</a></li>
                        <li><a href="<?php echo $base_path; ?>register.php"><i class="fa-solid fa-chevron-right"></i> Register as Senior</a></li>
                    <?php else: ?>
                        <li><a href="<?php echo $base_path; ?>logout.php"><i class="fa-solid fa-chevron-right"></i> Logout</a></li>
                    <?php endif; ?>
                </ul>
            </div>

            <div class="footer-contact">
                <h3>Our Office</h3>
                <p><i class="fa-solid fa-location-dot"></i> 45, Seva Bhavan Road, Elder Care District, New Delhi, India</p>
                <p><i class="fa-solid fa-phone"></i> +91 11 2345 6789</p>
                <p><i class="fa-solid fa-envelope"></i> help@digitaldadadadi.org</p>
            </div>
        </div>

        <div class="footer-bottom">
            <div class="container footer-bottom-flex">
                <p>&copy; <?php echo date('Y'); ?> Digital Dada Dadi Help Management Desk. All Rights Reserved.</p>
                <p class="designed-for-accessibility"><i class="fa-solid fa-wheelchair"></i> Designed for accessibility (WCAG compatible)</p>
            </div>
        </div>
    </footer>

    <!-- Supabase JS Client & Config -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="<?php echo $base_path; ?>js/supabase-config.js"></script>
    <!-- Main JavaScript File -->
    <script src="<?php echo $base_path; ?>js/script.js"></script>
</body>
</html>
