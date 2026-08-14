<?php
include 'includes/header.php';
?>

<!-- 1. Hero Welcome Banner Section -->
<section class="hero-section">
    <div class="container hero-grid">
        <div class="hero-info">
            <div class="hero-badge">
                <i class="fa-solid fa-hands-holding-heart"></i> Supporting Our Beloved Elders
            </div>
            <h1 class="hero-title">Welcome to the <span>Digital Dada Dadi</span> Help Desk</h1>
            <p class="hero-lead">Dada, Dadi, Nana, Nani - we are here to support you! Whether you need help getting groceries, finding transport for a clinic visit, understanding your phone, or managing medical needs, we are just a click away.</p>
            
            <div class="hero-actions">
                <?php if (isset($_SESSION['user_id'])): ?>
                    <a href="request_help.php" class="btn btn-primary btn-large"><i class="fa-solid fa-hand-holding-hand"></i> Request Assistance Now</a>
                    <a href="dashboard.php" class="btn btn-secondary btn-large"><i class="fa-solid fa-circle-user"></i> Go to My Dashboard</a>
                <?php elseif (isset($_SESSION['admin_id'])): ?>
                    <a href="admin/dashboard.php" class="btn btn-primary btn-large"><i class="fa-solid fa-chart-line"></i> Go to Admin Panel</a>
                <?php else: ?>
                    <a href="register.php" class="btn btn-primary btn-large"><i class="fa-solid fa-user-plus"></i> Join Us (Register Free)</a>
                    <a href="login.php" class="btn btn-secondary btn-large"><i class="fa-solid fa-right-to-bracket"></i> Login to Your Account</a>
                <?php endif; ?>
            </div>
        </div>
        
        <div class="hero-visual">
            <div class="hero-visual-card">
                <i class="fa-solid fa-heart-pulse"></i>
                <h3>Need Quick Support?</h3>
                <p>Submit a request online or call our helper desk. We will match you with a verified, friendly volunteer in your neighborhood.</p>
                <div class="hero-phone-cta">
                    <p><i class="fa-solid fa-phone-flip"></i> Direct Elder Helpline Number</p>
                    <a href="tel:14567">14567</a>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- 2. Services Section -->
<section class="section-padding">
    <div class="container">
        <div class="section-header">
            <h2>How We Can Help You</h2>
            <p>Our dedicated team of volunteers provides free, caring assistance across five main service areas. Select what you need, and we will take care of the rest.</p>
        </div>
        
        <div class="grid-3">
            <!-- Medical Help -->
            <div class="card">
                <div class="card-icon"><i class="fa-solid fa-prescription-bottle-medical"></i></div>
                <h3>Medical & Medicine Support</h3>
                <p>Need someone to pick up your prescription medicines from the pharmacy or escort you to a doctor's checkup? We have volunteers ready to assist.</p>
                <span class="card-meta"><i class="fa-solid fa-check"></i> Medicine delivery & clinics</span>
            </div>

            <!-- Transport Help -->
            <div class="card">
                <div class="card-icon"><i class="fa-solid fa-car-side"></i></div>
                <h3>Transport Assistance</h3>
                <p>Want a ride to the bank, post office, local temple, or to visit a friend? Request transportation support, and a volunteer will accompany you safely.</p>
                <span class="card-meta"><i class="fa-solid fa-check"></i> Safe accompanied travel</span>
            </div>

            <!-- Grocery Help -->
            <div class="card">
                <div class="card-icon"><i class="fa-solid fa-basket-shopping"></i></div>
                <h3>Grocery & Daily Needs</h3>
                <p>No need to carry heavy bags. Let us know what groceries, fresh milk, vegetables, or household supplies you need, and they will be delivered to your doorstep.</p>
                <span class="card-meta"><i class="fa-solid fa-check"></i> Safe doorstep delivery</span>
            </div>

            <!-- Technical Help -->
            <div class="card">
                <div class="card-icon"><i class="fa-solid fa-mobile-screen-button"></i></div>
                <h3>Technical Guidance</h3>
                <p>Struggling to make online bill payments, use WhatsApp to video call family, or set up apps? Our youngsters will teach you step-by-step with patience.</p>
                <span class="card-meta"><i class="fa-solid fa-check"></i> Mobile, TV & internet help</span>
            </div>

            <!-- Emergency Help -->
            <div class="card" style="border-top: 5px solid var(--color-danger);">
                <div class="card-icon" style="background-color: #fee2e2; color: var(--color-danger);"><i class="fa-solid fa-circle-exclamation"></i></div>
                <h3>Emergency Volunteer Support</h3>
                <p>Faced with an urgent, non-life-threatening issue like water leaks, power outages, or feeling suddenly unwell? Raise an emergency request for prompt volunteer dispatch.</p>
                <span class="card-meta" style="color: var(--color-danger);"><i class="fa-solid fa-bolt"></i> High priority dispatch</span>
            </div>
        </div>
    </div>
</section>

<!-- 3. About the Project Section -->
<section class="section-padding section-bg-alt">
    <div class="container hero-grid">
        <div class="hero-visual" style="order: 2;">
            <div class="card" style="border-left: 6px solid var(--color-primary);">
                <h3>Why Digital Dada Dadi?</h3>
                <ul style="list-style: none; padding-left: 0; margin-top: 15px;">
                    <li style="margin-bottom: 12px; display: flex; gap: 10px; align-items: flex-start;">
                        <i class="fa-solid fa-check-double" style="color: var(--color-primary); margin-top: 5px;"></i>
                        <span><strong>100% Free & Verified:</strong> Every volunteer is strictly verified with background checks.</span>
                    </li>
                    <li style="margin-bottom: 12px; display: flex; gap: 10px; align-items: flex-start;">
                        <i class="fa-solid fa-check-double" style="color: var(--color-primary); margin-top: 5px;"></i>
                        <span><strong>Simple Interface:</strong> Larger buttons and text size adjustment tools specifically designed for elders.</span>
                    </li>
                    <li style="margin-bottom: 12px; display: flex; gap: 10px; align-items: flex-start;">
                        <i class="fa-solid fa-check-double" style="color: var(--color-primary); margin-top: 5px;"></i>
                        <span><strong>Real-time Status Tracking:</strong> Check status of your requests (Pending, In Progress, Completed).</span>
                    </li>
                </ul>
            </div>
        </div>
        
        <div class="hero-info" style="order: 1;">
            <h2>About Our Caring Initiative</h2>
            <p>Technology is moving fast, but we believe our seniors should never be left behind. The <strong>Digital Dada Dadi Help Management Desk</strong> acts as a bridges between generations, connecting young volunteers eager to assist with senior citizens residing in the community.</p>
            <p>Our desk ensures that every senior gets the comfort, security, and care they deserve at home. By utilizing simple forms, you can easily reach out to our team whenever you need help.</p>
            <a href="about.php" class="btn btn-outline-nav"><i class="fa-solid fa-circle-question"></i> Learn More About Our Mission</a>
        </div>
    </div>
</section>

<!-- 4. Testimonials Section -->
<section class="section-padding">
    <div class="container">
        <div class="section-header">
            <h2>Blessings from Our Elders</h2>
            <p>See what our beloved Dada-Dadis have to say about the assistance they received from our volunteer community.</p>
        </div>
        
        <div class="grid-3" style="margin-top: 30px;">
            <!-- Testimonial 1 -->
            <div class="testimonial-card">
                <p class="testimonial-text">"My daughter lives in another city. I was struggling with electricity bill payments. A volunteer named Amit came, sat with me, and explained how to pay online. Now I pay it myself! Bless him."</p>
                <div class="testimonial-author">
                    <div class="avatar-initials">RK</div>
                    <div>
                        <h4>Ramesh Kapoor</h4>
                        <span>Age: 72 | New Delhi</span>
                    </div>
                </div>
            </div>
            
            <!-- Testimonial 2 -->
            <div class="testimonial-card">
                <p class="testimonial-text">"I needed to go to the hospital for my regular eye checkup, but there was nobody to go with me. This service sent a volunteer who arranged the cab, accompanied me, and brought me back home safely."</p>
                <div class="testimonial-author">
                    <div class="avatar-initials">SD</div>
                    <div>
                        <h4>Savitri Devi</h4>
                        <span>Age: 68 | Dwarka</span>
                    </div>
                </div>
            </div>

            <!-- Testimonial 3 -->
            <div class="testimonial-card">
                <p class="testimonial-text">"Yesterday morning my knee pain was severe and I had run out of daily medicines. Within two hours of submitting a request here, a young boy delivered all the medicines to my door. Excellent support!"</p>
                <div class="testimonial-author">
                    <div class="avatar-initials">GS</div>
                    <div>
                        <h4>Gurcharan Singh</h4>
                        <span>Age: 79 | Rajouri Garden</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<?php
include 'includes/footer.php';
?>
