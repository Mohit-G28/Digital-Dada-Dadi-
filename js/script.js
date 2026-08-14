/*
========================================================================
   DIGITAL DADA DADI HELP MANAGEMENT DESK - SIMULATED FRONTEND LOGIC
   Uses localStorage to simulate a database for a fully workable website.
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Mock Database
    initMockDatabase();

    // 2. Accessibility Sizing Controls
    initAccessibilityFontSize();

    // 3. Mobile Navigation toggle
    initMobileNav();

    // 4. Render header based on current session
    renderDynamicNavigation();

    // 5. Initialize specific page logic with resilient DOM & URL matching
    const rawPath = window.location.pathname.toLowerCase();
    const pageName = rawPath.split('/').pop().replace('.html', '') || 'index';

    // A. Login Page
    if (pageName === 'login' || document.getElementById('userLoginForm') || document.getElementById('adminLoginForm')) {
        initLoginTabs();
        initLoginLogic();
    }
    // B. Register Page
    if (pageName === 'register' || document.getElementById('registerForm')) {
        initRegisterLogic();
    }
    // C. Senior Citizen Dashboard
    if (pageName === 'dashboard' || document.getElementById('profileEditForm')) {
        initUserDashboardLogic();
    }
    // D. Help Request Form
    if (pageName === 'request_help' || document.getElementById('helpRequestForm')) {
        initRequestHelpLogic();
    }
    // E. Contact Page
    if (pageName === 'contact' || document.getElementById('contactForm')) {
        initContactLogic();
    }
    // F. Admin Dashboard
    if (pageName === 'admin_dashboard' || pageName === 'admin' || document.getElementById('metric_total_seniors')) {
        initAdminDashboardLogic();
    }
    // G. Admin Users
    if (pageName === 'admin_users' || document.getElementById('adminUsersTableBody') || document.getElementById('admin_user_search')) {
        initAdminUsersLogic();
    }
    // H. Admin Requests
    if (pageName === 'admin_requests' || document.getElementById('adminRequestsTableBody') || document.getElementById('admin_request_search')) {
        initAdminRequestsLogic();
    }
});

/* ---------------------------------------------------------
   1. MOCK DATABASE INITIALIZATION (localStorage)
------------------------------------------------------------ */
function initMockDatabase() {
    // Seed default users if empty
    if (!localStorage.getItem('dada_dadi_users')) {
        const defaultUsers = [
            {
                id: 1,
                full_name: "Ramesh Kapoor",
                age: 72,
                gender: "Male",
                mobile_number: "9876543210",
                address: "45, Seva Bhavan Road, New Delhi",
                email: "ramesh@email.com",
                password: "password123",
                created_at: new Date(Date.now() - 5*24*60*60*1000).toISOString()
            },
            {
                id: 2,
                full_name: "Savitri Devi",
                age: 68,
                gender: "Female",
                mobile_number: "9812345678",
                address: "12, Dwarka Sector 4, New Delhi",
                email: "savitri@email.com",
                password: "password123",
                created_at: new Date(Date.now() - 3*24*60*60*1000).toISOString()
            }
        ];
        localStorage.setItem('dada_dadi_users', JSON.stringify(defaultUsers));
    }

    // Seed default requests if empty
    if (!localStorage.getItem('dada_dadi_requests')) {
        const defaultRequests = [
            {
                id: 101,
                user_id: 1,
                request_type: "Grocery",
                description: "Need 2kg potatoes, 1kg sugar and a packet of tea delivered. Prefer morning delivery.",
                status: "Pending",
                created_at: new Date(Date.now() - 1*24*60*60*1000).toISOString()
            },
            {
                id: 102,
                user_id: 2,
                request_type: "Medical",
                description: "Need escort to Eye Hospital checkup tomorrow morning. Need help in booking taxi.",
                status: "Completed",
                created_at: new Date(Date.now() - 2*24*60*60*1000).toISOString()
            },
            {
                id: 103,
                user_id: 1,
                request_type: "Technical Help",
                description: "Electricity bill online payment setup guide needed.",
                status: "In Progress",
                created_at: new Date().toISOString()
            }
        ];
        localStorage.setItem('dada_dadi_requests', JSON.stringify(defaultRequests));
    }

    // Seed default contact messages if empty
    if (!localStorage.getItem('dada_dadi_messages')) {
        const defaultMessages = [
            {
                id: 1,
                name: "Amit Sharma",
                email: "amit@gmail.com",
                message: "I want to register as a volunteer for weekend sessions.",
                created_at: new Date().toISOString()
            }
        ];
        localStorage.setItem('dada_dadi_messages', JSON.stringify(defaultMessages));
    }
}

// Session Helpers
function getCurrentSession() {
    const session = localStorage.getItem('dada_dadi_session');
    return session ? JSON.parse(session) : null;
}

function startSession(user, role) {
    const session = {
        id: user.id || 'admin',
        name: user.full_name,
        email: user.email || '',
        username: user.username || '',
        role: role,
        age: user.age || '',
        gender: user.gender || '',
        mobile: user.mobile_number || '',
        address: user.address || ''
    };
    localStorage.setItem('dada_dadi_session', JSON.stringify(session));
}

function destroySession() {
    localStorage.removeItem('dada_dadi_session');
    window.location.href = 'login.html';
}

/* ---------------------------------------------------------
   2. ACCESSIBILITY FONT SIZE CONTROLS
------------------------------------------------------------ */
let currentScale = 1.0;

function initAccessibilityFontSize() {
    const savedScale = localStorage.getItem('dada_dadi_font_scale');
    if (savedScale) {
        currentScale = parseFloat(savedScale);
        applyFontScale(currentScale);
    }
    updateAccessibilityActiveState();
}

function changeFontSize(direction) {
    if (direction > 0) {
        if (currentScale < 1.4) currentScale += 0.1;
    } else {
        if (currentScale > 0.8) currentScale -= 0.1;
    }
    localStorage.setItem('dada_dadi_font_scale', currentScale);
    applyFontScale(currentScale);
    updateAccessibilityActiveState();
    showToast(`Font size adjusted to ${Math.round(currentScale * 100)}%`, 'info');
}

function resetFontSize() {
    currentScale = 1.0;
    localStorage.setItem('dada_dadi_font_scale', currentScale);
    applyFontScale(currentScale);
    updateAccessibilityActiveState();
    showToast("Font size reset to normal", 'info');
}

function applyFontScale(scale) {
    document.documentElement.style.setProperty('--font-scale', scale);
}

function updateAccessibilityActiveState() {
    const btns = document.querySelectorAll('.btn-group-accessibility .acc-btn');
    if (btns.length === 0) return;
    btns.forEach(btn => btn.classList.remove('active'));
    if (currentScale === 1.0) btns[1].classList.add('active');
    else if (currentScale < 1.0) btns[0].classList.add('active');
    else btns[2].classList.add('active');
}

/* ---------------------------------------------------------
   3. MOBILE HAMBURGER MENU
------------------------------------------------------------ */
function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
    }
}

/* ---------------------------------------------------------
   4. DYNAMIC NAVIGATION RENDERING
------------------------------------------------------------ */
function renderDynamicNavigation() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;

    const session = getCurrentSession();
    let navHtml = '<ul>';

    // Logo adjustments
    const logo = document.querySelector('.logo');

    if (session && session.role === 'admin') {
        if (logo) logo.setAttribute('href', 'admin_dashboard.html');

        navHtml += `
            <li><a href="admin_dashboard.html"><i class="fa-solid fa-chart-line"></i> Dashboard</a></li>
            <li><a href="admin_users.html"><i class="fa-solid fa-users"></i> Manage Seniors</a></li>
            <li><a href="admin_requests.html"><i class="fa-solid fa-hand-holding-hand"></i> Manage Requests</a></li>
            <li class="nav-user-badge">
                <span class="badge"><i class="fa-solid fa-user-shield"></i> Admin: ${session.name}</span>
            </li>
            <li><button onclick="destroySession()" class="btn btn-btn-nav-logout" style="background-color:#fee2e2; color:#991b1b; padding:8px 16px; border:none; cursor:pointer; border-radius:8px; font-weight:700;"><i class="fa-solid fa-right-from-bracket"></i> Logout</button></li>
        `;
    } else if (session && session.role === 'user') {
        if (logo) logo.setAttribute('href', 'index.html');

        navHtml += `
            <li><a href="index.html"><i class="fa-solid fa-house"></i> Home</a></li>
            <li><a href="dashboard.html"><i class="fa-solid fa-user-tag"></i> My Dashboard</a></li>
            <li><a href="request_help.html" class="btn btn-primary" style="color:white;"><i class="fa-solid fa-hand-holding-hand"></i> Request Help</a></li>
            <li><a href="about.html"><i class="fa-solid fa-circle-info"></i> About Us</a></li>
            <li><a href="contact.html"><i class="fa-solid fa-envelope"></i> Contact</a></li>
            <li class="nav-user-badge">
                <span class="badge"><i class="fa-solid fa-circle-user"></i> Namaste, ${session.name.split(' ')[0]}</span>
            </li>
            <li><button onclick="destroySession()" class="btn btn-outline-nav" style="padding:8px 16px; font-weight:700; cursor:pointer;"><i class="fa-solid fa-right-from-bracket"></i> Logout</button></li>
        `;
    } else {
        if (logo) logo.setAttribute('href', 'index.html');

        navHtml += `
            <li><a href="index.html"><i class="fa-solid fa-house"></i> Home</a></li>
            <li><a href="about.html"><i class="fa-solid fa-circle-info"></i> About Us</a></li>
            <li><a href="contact.html"><i class="fa-solid fa-envelope"></i> Contact</a></li>
            <li><a href="login.html" class="btn btn-outline-nav"><i class="fa-solid fa-right-to-bracket"></i> Login</a></li>
            <li><a href="register.html" class="btn btn-primary" style="color:white;"><i class="fa-solid fa-user-plus"></i> Join Us (Register)</a></li>
        `;
    }

    navHtml += '</ul>';
    navMenu.innerHTML = navHtml;
}

/* ---------------------------------------------------------
   5. EMERGENCY MODAL CONTROLS
------------------------------------------------------------ */
function openEmergencyModal() {
    const modal = document.getElementById('emergencyModal');
    const overlay = document.getElementById('emergencyModalOverlay');
    if (modal && overlay) {
        modal.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeEmergencyModal() {
    const modal = document.getElementById('emergencyModal');
    const overlay = document.getElementById('emergencyModalOverlay');
    if (modal && overlay) {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* ---------------------------------------------------------
   6. CLIENT-SIDE TOAST NOTIFICATIONS
------------------------------------------------------------ */
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'error') iconClass = 'fa-circle-exclamation';

    toast.innerHTML = `
        <i class="fa-solid ${iconClass}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s reverse forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}

/* ---------------------------------------------------------
   7. PAGE-SPECIFIC SIMULATION CONTROLLERS
------------------------------------------------------------ */

// A. LOGIN LOGIC
function initLoginTabs() {
    const tabs = document.querySelectorAll('.login-tabs .tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTabId = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const targetEl = document.getElementById(targetTabId);
            if (targetEl) targetEl.classList.add('active');
        });
    });

    // Support URL query parameter ?tab=admin or hash #admin
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('tab') === 'admin' || window.location.hash === '#admin') {
        const adminTab = document.querySelector('.login-tabs .tab-btn[data-tab="adminLogin"]');
        if (adminTab) {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            adminTab.classList.add('active');
            const adminEl = document.getElementById('adminLogin');
            if (adminEl) adminEl.classList.add('active');
        }
    }
}

function initLoginLogic() {
    // Check if registered URL parameter is present to show notice
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        const regAlert = document.getElementById('regSuccessAlert');
        if (regAlert) regAlert.style.display = 'block';
    }

    // Senior User Login Form Submit
    const userForm = document.getElementById('userLoginForm');
    if (userForm) {
        userForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('usr_email').value.trim();
            const password = document.getElementById('usr_password').value;

            const users = JSON.parse(localStorage.getItem('dada_dadi_users') || '[]');
            const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

            if (matchedUser) {
                startSession(matchedUser, 'user');
                showToast(`Namaste ${matchedUser.full_name}! Logging in...`, "success");
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 400);
            } else {
                showToast("Invalid credentials. Try: ramesh@email.com / password123", "error");
            }
        });
    }

    // Admin Login Form Submit
    const adminForm = document.getElementById('adminLoginForm');
    if (adminForm) {
        adminForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('adm_username');
            const passwordInput = document.getElementById('adm_password');
            if (!usernameInput || !passwordInput) return;

            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            if (username.toLowerCase() === 'admin' && password === 'adminpassword123') {
                const adminUser = { full_name: "Desk Administrator", username: "admin" };
                startSession(adminUser, 'admin');
                showToast("Admin login successful! Redirecting to Admin Desk...", "success");
                setTimeout(() => {
                    window.location.href = 'admin_dashboard.html';
                }, 400);
            } else {
                showToast("Invalid admin credentials! Demo Username: admin / Password: adminpassword123", "error");
            }
        });
    }
}

// B. REGISTER LOGIC
function initRegisterLogic() {
    const regForm = document.getElementById('registerForm');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const full_name = document.getElementById('reg_name').value.trim();
            const age = parseInt(document.getElementById('reg_age').value);
            const gender = document.getElementById('reg_gender').value;
            const mobile = document.getElementById('reg_mobile').value.trim();
            const address = document.getElementById('reg_address').value.trim();
            const email = document.getElementById('reg_email').value.trim();
            const password = document.getElementById('reg_password').value;

            // Form validations already running client side, let's append database simulated entry
            const users = JSON.parse(localStorage.getItem('dada_dadi_users') || '[]');
            if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                showToast("This email is already registered! Please use another.", "error");
                return;
            }

            const newUser = {
                id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
                full_name,
                age,
                gender,
                mobile_number: mobile,
                address,
                email,
                password,
                created_at: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('dada_dadi_users', JSON.stringify(users));

            window.location.href = 'login.html?registered=true';
        });
    }
}

// C. CONTACT PAGE LOGIC
function initContactLogic() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('con_name').value.trim();
            const email = document.getElementById('con_email').value.trim();
            const message = document.getElementById('con_message').value.trim();

            const messages = JSON.parse(localStorage.getItem('dada_dadi_messages') || '[]');
            const newMsg = {
                id: messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1,
                name,
                email,
                message,
                created_at: new Date().toISOString()
            };

            messages.push(newMsg);
            localStorage.setItem('dada_dadi_messages', JSON.stringify(messages));

            showToast("Pranam! We have saved your message and will review it soon.", "success");
            contactForm.reset();
        });
    }
}

// D. SENIOR CITIZEN USER DASHBOARD LOGIC
function initUserDashboardLogic() {
    const session = getCurrentSession();
    if (!session || session.role !== 'user') {
        window.location.href = 'login.html';
        return;
    }

    // Render alerts if returning from help request submission
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('request_created') === 'true') {
        const successAlert = document.getElementById('dashboardSuccessAlert');
        if (successAlert) {
            successAlert.style.display = 'block';
            successAlert.innerHTML = '<i class="fa-solid fa-circle-check"></i> Help request submitted successfully! Our volunteers have been notified.';
        }
    }

    // Bind profile values
    document.querySelectorAll('.profile-name').forEach(el => el.textContent = session.name);
    const ageEl = document.getElementById('prof_age_badge');
    if (ageEl) ageEl.textContent = `Senior Citizen | Age: ${session.age}`;

    const emailSpan = document.getElementById('prof_email_span');
    if (emailSpan) emailSpan.textContent = session.email;
    const phoneSpan = document.getElementById('prof_phone_span');
    if (phoneSpan) phoneSpan.textContent = session.mobile;
    const genderSpan = document.getElementById('prof_gender_span');
    if (genderSpan) genderSpan.textContent = session.gender;
    const addressSpan = document.getElementById('prof_address_span');
    if (addressSpan) addressSpan.innerHTML = session.address.replace(/\n/g, '<br>');

    // Bind Edit inputs
    document.getElementById('prof_name').value = session.name;
    document.getElementById('prof_age').value = session.age;
    document.getElementById('prof_gender').value = session.gender;
    document.getElementById('prof_mobile').value = session.mobile;
    document.getElementById('prof_address').value = session.address;

    // Render User Requests
    renderUserRequests(session.id);

    // Profile Save Form Submit handler
    const profileForm = document.getElementById('profileEditForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('prof_name').value.trim();
            const age = parseInt(document.getElementById('prof_age').value);
            const gender = document.getElementById('prof_gender').value;
            const mobile = document.getElementById('prof_mobile').value.trim();
            const address = document.getElementById('prof_address').value.trim();

            // Update user in users list
            const users = JSON.parse(localStorage.getItem('dada_dadi_users') || '[]');
            const idx = users.findIndex(u => u.id === session.id);
            if (idx !== -1) {
                users[idx].full_name = name;
                users[idx].age = age;
                users[idx].gender = gender;
                users[idx].mobile_number = mobile;
                users[idx].address = address;
                localStorage.setItem('dada_dadi_users', JSON.stringify(users));

                // Save new session values
                session.name = name;
                session.age = age;
                session.gender = gender;
                session.mobile = mobile;
                session.address = address;
                localStorage.setItem('dada_dadi_session', JSON.stringify(session));

                showToast("Your profile details updated successfully!", "success");
                toggleProfileEditForm();
                
                // Refresh dashboard text
                initUserDashboardLogic();
                renderDynamicNavigation();
            }
        });
    }
}

function renderUserRequests(userId) {
    const tableBody = document.getElementById('requestsTableBody');
    const emptyState = document.getElementById('emptyRequestsState');
    if (!tableBody) return;

    const allRequests = JSON.parse(localStorage.getItem('dada_dadi_requests') || '[]');
    const userRequests = allRequests.filter(r => r.user_id === userId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (userRequests.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        tableBody.closest('.table-responsive').style.display = 'none';
    } else {
        if (emptyState) emptyState.style.display = 'none';
        tableBody.closest('.table-responsive').style.display = 'block';

        let html = '';
        userRequests.forEach(req => {
            const dateStr = new Date(req.created_at).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            
            let icon = "fa-hand-holding";
            if (req.request_type === "Medical") icon = "fa-prescription-bottle-medical";
            else if (req.request_type === "Transport") icon = "fa-car-side";
            else if (req.request_type === "Grocery") icon = "fa-basket-shopping";
            else if (req.request_type === "Technical Help") icon = "fa-mobile-screen-button";
            else if (req.request_type === "Emergency") icon = "fa-circle-exclamation";

            let badge_class = "pending";
            let status_icon = "fa-clock";
            if (req.status === 'In Progress') {
                badge_class = "in-progress";
                status_icon = "fa-person-running";
            } else if (req.status === 'Completed') {
                badge_class = "completed";
                status_icon = "fa-circle-check";
            }

            html += `
                <tr>
                    <td style="font-weight: 600; width: 140px; font-size: 0.95rem;">${dateStr}</td>
                    <td style="font-weight: 700; width: 180px;">
                        <i class="fa-solid ${icon}" style="color: var(--color-primary); margin-right: 5px;"></i> 
                        ${req.request_type}
                    </td>
                    <td style="font-size: 1rem; line-height: 1.5; min-width: 250px;">${req.description.replace(/\n/g, '<br>')}</td>
                    <td style="width: 140px;">
                        <span class="status-badge ${badge_class}">
                            <i class="fa-solid ${status_icon}"></i>
                            ${req.status}
                        </span>
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    }
}

// E. REQUEST HELP SUBMISSION LOGIC
function initRequestHelpLogic() {
    const session = getCurrentSession();
    if (!session || session.role !== 'user') {
        window.location.href = 'login.html';
        return;
    }

    const helpForm = document.getElementById('helpRequestForm');
    if (helpForm) {
        helpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const type = document.getElementById('req_type').value;
            const description = document.getElementById('req_description').value.trim();

            const requests = JSON.parse(localStorage.getItem('dada_dadi_requests') || '[]');
            const newRequest = {
                id: requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 101,
                user_id: session.id,
                request_type: type,
                description: description,
                status: 'Pending',
                created_at: new Date().toISOString()
            };

            requests.push(newRequest);
            localStorage.setItem('dada_dadi_requests', JSON.stringify(requests));

            window.location.href = 'dashboard.html?request_created=true';
        });
    }
}

// F. ADMIN DASHBOARD LOGIC
function initAdminDashboardLogic() {
    const session = getCurrentSession();
    if (!session || session.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    const users = JSON.parse(localStorage.getItem('dada_dadi_users') || '[]');
    const requests = JSON.parse(localStorage.getItem('dada_dadi_requests') || '[]');
    const messages = JSON.parse(localStorage.getItem('dada_dadi_messages') || '[]');

    // Metric Counts
    document.getElementById('metric_total_seniors').textContent = users.length;
    document.getElementById('metric_pending').textContent = requests.filter(r => r.status === 'Pending').length;
    document.getElementById('metric_inprogress').textContent = requests.filter(r => r.status === 'In Progress').length;
    document.getElementById('metric_completed').textContent = requests.filter(r => r.status === 'Completed').length;

    // Recent Requests (Latest 5)
    const recentRequestsBody = document.getElementById('recentRequestsTableBody');
    if (recentRequestsBody) {
        const sortedReqs = [...requests].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
        if (sortedReqs.length === 0) {
            recentRequestsBody.innerHTML = '<tr><td colspan="4" class="text-center">No requests recorded.</td></tr>';
        } else {
            let html = '';
            sortedReqs.forEach(req => {
                const requester = users.find(u => u.id === req.user_id) || { full_name: 'Unknown User', mobile_number: 'N/A' };
                let badge_class = "pending";
                if (req.status === 'In Progress') badge_class = "in-progress";
                if (req.status === 'Completed') badge_class = "completed";

                html += `
                    <tr>
                        <td>
                            <strong>${requester.full_name}</strong><br>
                            <span style="font-size: 0.85rem; color: var(--color-text-light);">${requester.mobile_number}</span>
                        </td>
                        <td><span style="font-weight: 700;">${req.request_type}</span></td>
                        <td><span class="status-badge ${badge_class}" style="padding: 3px 8px; font-size: 0.75rem;">${req.status}</span></td>
                        <td>
                            <a href="admin_requests.html?search=${encodeURIComponent(requester.full_name)}" class="btn-action edit">
                                <i class="fa-solid fa-arrow-right"></i> Manage
                            </a>
                        </td>
                    </tr>
                `;
            });
            recentRequestsBody.innerHTML = html;
        }
    }

    // Recent Inquiry Messages
    const recentMessagesBody = document.getElementById('recentMessagesContainer');
    if (recentMessagesBody) {
        const sortedMsgs = [...messages].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
        if (sortedMsgs.length === 0) {
            recentMessagesBody.innerHTML = '<div class="card text-center" style="padding: 20px;"><p>No messages received.</p></div>';
        } else {
            let html = '';
            sortedMsgs.forEach(msg => {
                const dateStr = new Date(msg.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
                html += `
                    <div class="card" style="padding: 20px; font-size: 0.95rem; border-left: 4px solid var(--color-accent); margin-bottom:12px;">
                        <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 5px; font-size: 0.9rem;">
                            <span style="color: var(--color-primary-dark);">${msg.name}</span>
                            <span style="color: var(--color-text-light); font-size: 0.8rem; font-weight: 400;">${dateStr}</span>
                        </div>
                        <div style="font-size: 0.85rem; color: var(--color-text-light); margin-bottom: 8px;">
                            <i class="fa-solid fa-envelope"></i> ${msg.email}
                        </div>
                        <p style="margin-bottom: 0; font-style: italic; line-height: 1.4; color: var(--color-text-dark);">
                            "${msg.message}"
                        </p>
                    </div>
                `;
            });
            recentMessagesBody.innerHTML = html;
        }
    }
}

// G. ADMIN USER MANAGEMENT LOGIC
function initAdminUsersLogic() {
    const session = getCurrentSession();
    if (!session || session.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    // Bind list
    renderAdminUsersList();

    // Bind Search Input typing
    const searchInp = document.getElementById('admin_user_search');
    if (searchInp) {
        searchInp.addEventListener('input', () => {
            renderAdminUsersList(searchInp.value.trim());
        });
    }

    // Bind Edit form submit handler
    const editForm = document.getElementById('adminEditUserForm');
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = parseInt(document.getElementById('edt_user_id').value);
            const name = document.getElementById('edt_name').value.trim();
            const email = document.getElementById('edt_email').value.trim();
            const age = parseInt(document.getElementById('edt_age').value);
            const gender = document.getElementById('edt_gender').value;
            const phone = document.getElementById('edt_phone').value.trim();
            const address = document.getElementById('edt_address').value.trim();

            const users = JSON.parse(localStorage.getItem('dada_dadi_users') || '[]');
            const idx = users.findIndex(u => u.id === id);

            if (idx !== -1) {
                // Verify email unique
                if (users.some(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== id)) {
                    showToast("Email address is already in use by another senior profile.", "error");
                    return;
                }

                users[idx].full_name = name;
                users[idx].email = email;
                users[idx].age = age;
                users[idx].gender = gender;
                users[idx].mobile_number = phone;
                users[idx].address = address;

                localStorage.setItem('dada_dadi_users', JSON.stringify(users));
                showToast(`Profile of ${name} updated successfully!`, "success");
                
                // Hide edit box, refresh user table
                closeAdminEditForm();
                renderAdminUsersList(searchInp ? searchInp.value.trim() : '');
            }
        });
    }
}

function renderAdminUsersList(filterText = '') {
    const tbody = document.getElementById('adminUsersTableBody');
    if (!tbody) return;

    const users = JSON.parse(localStorage.getItem('dada_dadi_users') || '[]');
    let filtered = users;

    if (filterText) {
        const query = filterText.toLowerCase();
        filtered = users.filter(u => 
            u.full_name.toLowerCase().includes(query) || 
            u.email.toLowerCase().includes(query) || 
            u.mobile_number.includes(query)
        );
    }

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No seniors matched your criteria.</td></tr>';
    } else {
        let html = '';
        filtered.forEach(u => {
            const dateStr = new Date(u.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
            html += `
                <tr>
                    <td><strong style="font-size: 1.1rem; color: var(--color-primary-dark);">${u.full_name}</strong></td>
                    <td><span style="font-weight: 700;">${u.age} Yrs</span> / ${u.gender}</td>
                    <td style="font-size: 0.95rem;">
                        <i class="fa-solid fa-envelope" style="color: var(--color-text-light);"></i> ${u.email}<br>
                        <i class="fa-solid fa-phone" style="color: var(--color-text-light);"></i> ${u.mobile_number}
                    </td>
                    <td style="font-size: 0.95rem; line-height: 1.4; max-width: 250px;">${u.address.replace(/\n/g, '<br>')}</td>
                    <td style="font-size: 0.9rem;">${dateStr}</td>
                    <td>
                        <div style="display: flex; gap: 8px;">
                            <button onclick="triggerAdminEditUser(${u.id})" class="btn-action edit" title="Edit Senior Profile">
                                <i class="fa-solid fa-user-pen"></i> Edit
                            </button>
                            <button onclick="triggerAdminDeleteUser(${u.id})" class="btn-action delete" title="Delete Profile">
                                <i class="fa-solid fa-trash-can"></i> Delete
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }
}

function triggerAdminEditUser(userId) {
    const users = JSON.parse(localStorage.getItem('dada_dadi_users') || '[]');
    const user = users.find(u => u.id === userId);
    if (!user) return;

    // Open edit box card, fill fields
    const container = document.getElementById('adminEditUserCard');
    if (container) {
        container.style.display = 'block';
        document.getElementById('edt_user_id').value = user.id;
        document.getElementById('edt_name').value = user.full_name;
        document.getElementById('edt_email').value = user.email;
        document.getElementById('edt_age').value = user.age;
        document.getElementById('edt_gender').value = user.gender;
        document.getElementById('edt_phone').value = user.mobile_number;
        document.getElementById('edt_address').value = user.address;
        
        // Scroll smoothly to edit form
        container.scrollIntoView({ behavior: 'smooth' });
    }
}

function closeAdminEditForm() {
    const container = document.getElementById('adminEditUserCard');
    if (container) container.style.display = 'none';
}

function triggerAdminDeleteUser(userId) {
    const users = JSON.parse(localStorage.getItem('dada_dadi_users') || '[]');
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (confirm(`Are you sure you want to permanently delete the profile of ${user.full_name}? All their submitted help requests will also be deleted.`)) {
        // Delete User
        const updatedUsers = users.filter(u => u.id !== userId);
        localStorage.setItem('dada_dadi_users', JSON.stringify(updatedUsers));

        // Delete associated requests
        const requests = JSON.parse(localStorage.getItem('dada_dadi_requests') || '[]');
        const updatedRequests = requests.filter(r => r.user_id !== userId);
        localStorage.setItem('dada_dadi_requests', JSON.stringify(updatedRequests));

        showToast(`Profile of ${user.full_name} deleted successfully.`, "success");
        renderAdminUsersList(document.getElementById('admin_user_search')?.value.trim());
        
        // If edit screen is showing deleted user, close it
        const editIdVal = document.getElementById('edt_user_id')?.value;
        if (editIdVal && parseInt(editIdVal) === userId) {
            closeAdminEditForm();
        }
    }
}

// H. ADMIN REQUESTS MANAGEMENT LOGIC
function initAdminRequestsLogic() {
    const session = getCurrentSession();
    if (!session || session.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    // Check if redirect query parameter contains search text
    const urlParams = new URLSearchParams(window.location.search);
    const prefillSearch = urlParams.get('search');
    if (prefillSearch) {
        document.getElementById('search_inp').value = prefillSearch;
    }

    // Render list
    renderAdminRequestsList();

    // Event listeners for filters
    const searchInp = document.getElementById('search_inp');
    const statusFilter = document.getElementById('status_filter');
    const typeFilter = document.getElementById('type_filter');

    const updateTrigger = () => {
        renderAdminRequestsList(searchInp.value.trim(), statusFilter.value, typeFilter.value);
    };

    searchInp.addEventListener('input', updateTrigger);
    statusFilter.addEventListener('change', updateTrigger);
    typeFilter.addEventListener('change', updateTrigger);

    // Reset filters action
    window.resetAdminRequestsFilters = () => {
        searchInp.value = '';
        statusFilter.value = '';
        typeFilter.value = '';
        updateTrigger();
    };
}

function renderAdminRequestsList(searchText = '', statusVal = '', typeVal = '') {
    const tbody = document.getElementById('adminRequestsTableBody');
    if (!tbody) return;

    const users = JSON.parse(localStorage.getItem('dada_dadi_users') || '[]');
    const requests = JSON.parse(localStorage.getItem('dada_dadi_requests') || '[]');

    let filtered = requests;

    // Apply filters
    if (searchText) {
        const query = searchText.toLowerCase();
        filtered = filtered.filter(req => {
            const senior = users.find(u => u.id === req.user_id) || { full_name: '' };
            return senior.full_name.toLowerCase().includes(query) || req.description.toLowerCase().includes(query);
        });
    }

    if (statusVal) {
        filtered = filtered.filter(req => req.status === statusVal);
    }

    if (typeVal) {
        filtered = filtered.filter(req => req.request_type === typeVal);
    }

    // Sort by latest first
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No service requests matches selected filters.</td></tr>';
    } else {
        let html = '';
        filtered.forEach(req => {
            const senior = users.find(u => u.id === req.user_id) || { full_name: 'Unknown User', age: '?', mobile_number: 'N/A', address: 'N/A' };
            const dateStr = new Date(req.created_at).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            
            // Icon
            let icon = "fa-hand-holding";
            if (req.request_type === "Medical") icon = "fa-prescription-bottle-medical";
            else if (req.request_type === "Transport") icon = "fa-car-side";
            else if (req.request_type === "Grocery") icon = "fa-basket-shopping";
            else if (req.request_type === "Technical Help") icon = "fa-mobile-screen-button";
            else if (req.request_type === "Emergency") icon = "fa-circle-exclamation";

            // Status details
            let badge_class = "pending";
            if (req.status === 'In Progress') badge_class = "in-progress";
            if (req.status === 'Completed') badge_class = "completed";

            // Emergency row highlight
            const isEmergencyHighlight = (req.request_type === 'Emergency' && req.status !== 'Completed') ? 
                'style="background-color: #fff1f2; border-left: 5px solid var(--color-danger);"' : '';

            html += `
                <tr ${isEmergencyHighlight}>
                    <td style="font-size: 0.95rem; width: 180px;">
                        <strong>${dateStr}</strong><br>
                        <span style="font-weight: 700; color: ${req.request_type === 'Emergency' ? 'var(--color-danger)' : 'var(--color-primary-dark)'};">
                            <i class="fa-solid ${icon}"></i> ${req.request_type}
                        </span>
                    </td>
                    <td>
                        <strong style="font-size: 1.1rem; color: var(--color-primary-dark);">${senior.full_name}</strong> 
                        <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-accent-dark);">(Age: ${senior.age})</span><br>
                        <span style="font-size: 0.95rem; font-weight: 600;"><i class="fa-solid fa-phone"></i> ${senior.mobile_number}</span><br>
                        <span style="font-size: 0.85rem; color: var(--color-text-light); line-height: 1.3; display: block; max-width: 200px;">
                            <i class="fa-solid fa-location-dot"></i> ${senior.address}
                        </span>
                    </td>
                    <td style="font-size: 1rem; line-height: 1.5; max-width: 320px;">
                        <div style="background-color: var(--color-bg-light); padding: 12px; border-radius: var(--border-radius); border: 1px solid var(--color-border);">
                            ${req.description.replace(/\n/g, '<br>')}
                        </div>
                    </td>
                    <td style="width: 180px;">
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <select onchange="updateAdminRequestStatus(${req.id}, this.value)" class="form-control" style="padding: 6px 10px; font-size: 0.9rem; min-height: 34px; font-weight: 700;">
                                <option value="Pending" ${req.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="In Progress" ${req.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                <option value="Completed" ${req.status === 'Completed' ? 'selected' : ''}>Completed</option>
                            </select>
                            <span class="status-badge ${badge_class}" style="justify-content: center; font-size: 0.8rem; padding: 4px;">
                                Current: ${req.status}
                            </span>
                        </div>
                    </td>
                    <td style="width: 100px;">
                        <button onclick="deleteAdminRequest(${req.id})" class="btn-action delete" title="Delete Request">
                            <i class="fa-solid fa-trash-can"></i> Delete
                        </button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }
}

function updateAdminRequestStatus(requestId, newStatus) {
    const requests = JSON.parse(localStorage.getItem('dada_dadi_requests') || '[]');
    const idx = requests.findIndex(r => r.id === requestId);

    if (idx !== -1) {
        requests[idx].status = newStatus;
        localStorage.setItem('dada_dadi_requests', JSON.stringify(requests));
        showToast(`Request status updated to ${newStatus} successfully!`, "success");
        
        // Refresh requests list
        renderAdminRequestsList(
            document.getElementById('search_inp').value.trim(),
            document.getElementById('status_filter').value,
            document.getElementById('type_filter').value
        );
    }
}

function deleteAdminRequest(requestId) {
    if (confirm("Are you sure you want to delete this service request?")) {
        const requests = JSON.parse(localStorage.getItem('dada_dadi_requests') || '[]');
        const updated = requests.filter(r => r.id !== requestId);
        localStorage.setItem('dada_dadi_requests', JSON.stringify(updated));
        
        showToast("Service request deleted successfully.", "success");
        
        // Refresh list
        renderAdminRequestsList(
            document.getElementById('search_inp').value.trim(),
            document.getElementById('status_filter').value,
            document.getElementById('type_filter').value
        );
    }
}
