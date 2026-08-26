/*
========================================================================
   DIGITAL DADA DADI HELP MANAGEMENT DESK - FRONTEND LOGIC & SUPABASE INTEGRATION
========================================================================
*/

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize Mock Database fallback if offline / unconfigured
    initMockDatabase();

    // 2. Accessibility Sizing Controls
    initAccessibilityFontSize();

    // 3. Mobile Navigation toggle
    initMobileNav();

    // 4. Render header based on current session
    renderDynamicNavigation();

    // 5. Initialize specific page logic with resilient DOM & URL matching
    const rawPath = window.location.pathname.toLowerCase();
    const pageName = rawPath.split('/').pop().replace('.html', '').replace('.php', '') || 'index';

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
    if (pageName === 'dashboard' || document.getElementById('profileEditForm') || document.getElementById('requestsTableBody')) {
        await initUserDashboardLogic();
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
        await initAdminDashboardLogic();
    }
    // G. Admin Users
    if (pageName === 'admin_users' || document.getElementById('adminUsersTableBody') || document.getElementById('admin_user_search')) {
        await initAdminUsersLogic();
    }
    // H. Admin Requests
    if (pageName === 'admin_requests' || document.getElementById('adminRequestsTableBody') || document.getElementById('admin_request_search')) {
        await initAdminRequestsLogic();
    }
});

/* ---------------------------------------------------------
   1. MOCK DATABASE FALLBACK (localStorage)
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
            },
            {
                id: 3,
                full_name: "kriti patil",
                age: 65,
                gender: "Female",
                mobile_number: "7845784578",
                address: "Pune",
                email: "kritipatil7@gmail.com",
                password: "kriti123",
                created_at: new Date(Date.now() - 5*24*60*60*1000).toISOString()
            }
        ];
        localStorage.setItem('dada_dadi_users', JSON.stringify(defaultUsers));
    }

    // Seed default requests matching reference screenshot
    if (!localStorage.getItem('dada_dadi_requests')) {
        const defaultRequests = [
            {
                id: 101,
                user_id: 3,
                user_email: "kritipatil7@gmail.com",
                user_name: "kriti patil",
                request_type: "Medical",
                description: "I want medicines to help me",
                status: "Completed",
                created_at: "2026-08-10T18:46:00.000Z"
            },
            {
                id: 102,
                user_id: 3,
                user_email: "kritipatil7@gmail.com",
                user_name: "kriti patil",
                request_type: "Technical Help",
                description: "I need technical support of smartphone",
                status: "Completed",
                created_at: "2026-08-08T01:02:00.000Z"
            },
            {
                id: 103,
                user_id: 1,
                user_email: "ramesh@email.com",
                user_name: "Ramesh Kapoor",
                request_type: "Grocery",
                description: "Need 2kg potatoes, 1kg sugar and a packet of tea delivered. Prefer morning delivery.",
                status: "Pending",
                created_at: new Date(Date.now() - 1*24*60*60*1000).toISOString()
            },
            {
                id: 104,
                user_id: 2,
                user_email: "savitri@email.com",
                user_name: "Savitri Devi",
                request_type: "Medical",
                description: "Need escort to Eye Hospital checkup tomorrow morning. Need help in booking taxi.",
                status: "Completed",
                created_at: new Date(Date.now() - 2*24*60*60*1000).toISOString()
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
                <span class="badge"><i class="fa-solid fa-circle-user"></i> Namaste, ${session.name ? session.name.split(' ')[0] : 'Senior'}</span>
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
   7. PAGE-SPECIFIC SUPABASE & FRONTEND CONTROLLERS
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
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        const regAlert = document.getElementById('regSuccessAlert');
        if (regAlert) regAlert.style.display = 'block';
    }

    // Senior User Login Form Submit
    const userForm = document.getElementById('userLoginForm');
    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('usr_email').value.trim();
            const password = document.getElementById('usr_password').value;

            if (window.SupabaseDB && window.SupabaseDB.isConfigured()) {
                try {
                    const matchedUser = await window.SupabaseDB.getUserByEmail(email);

                    if (matchedUser && matchedUser.password === password) {
                        startSession(matchedUser, 'user');
                        showToast(`Namaste ${matchedUser.full_name}! Logging in...`, "success");
                        setTimeout(() => {
                            window.location.href = 'dashboard.html';
                        }, 400);
                        return;
                    }
                } catch (err) {
                    console.error("Supabase user login error:", err);
                }
            }

            // Fallback to localStorage seed check
            const users = JSON.parse(localStorage.getItem('dada_dadi_users') || '[]');
            const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

            if (matchedUser) {
                startSession(matchedUser, 'user');
                showToast(`Namaste ${matchedUser.full_name}! Logging in...`, "success");
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 400);
            } else {
                showToast("Invalid credentials. Try demo account: ramesh@email.com / password123", "error");
            }
        });
    }

    // Admin Login Form Submit
    const adminForm = document.getElementById('adminLoginForm');
    if (adminForm) {
        adminForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('adm_username');
            const passwordInput = document.getElementById('adm_password');
            if (!usernameInput || !passwordInput) return;

            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            if (window.SupabaseDB && window.SupabaseDB.isConfigured()) {
                try {
                    const matchedAdmin = await window.SupabaseDB.getAdminByUsername(username);
                    if (matchedAdmin && matchedAdmin.password === password) {
                        const adminSession = {
                            id: matchedAdmin.id,
                            full_name: matchedAdmin.full_name,
                            username: matchedAdmin.username
                        };
                        startSession(adminSession, 'admin');
                        showToast("Admin login successful! Redirecting to Admin Desk...", "success");
                        setTimeout(() => {
                            window.location.href = 'admin_dashboard.html';
                        }, 400);
                        return;
                    }
                } catch (err) {
                    console.error("Supabase admin login error:", err);
                }
            }

            // Default Admin check
            if (username.toLowerCase() === 'admin' && password === 'adminpassword123') {
                const adminUser = { id: 1, full_name: "Desk Administrator", username: "admin" };
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
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const full_name = document.getElementById('reg_name').value.trim();
            const age = parseInt(document.getElementById('reg_age').value);
            const gender = document.getElementById('reg_gender').value;
            const mobile = document.getElementById('reg_mobile').value.trim();
            const address = document.getElementById('reg_address').value.trim();
            const email = document.getElementById('reg_email').value.trim();
            const password = document.getElementById('reg_password').value;

            if (window.SupabaseDB && window.SupabaseDB.isConfigured()) {
                try {
                    const existingUser = await window.SupabaseDB.getUserByEmail(email);
                    if (existingUser) {
                        showToast("This email is already registered! Please use another.", "error");
                        return;
                    }

                    const newSupabaseUser = await window.SupabaseDB.createUser({
                        full_name, age, gender, mobile_number: mobile, address, email, password
                    });

                    if (newSupabaseUser) {
                        showToast("Registration successful! Redirecting to login...", "success");
                        setTimeout(() => {
                            window.location.href = 'login.html?registered=true';
                        }, 500);
                        return;
                    }
                } catch (err) {
                    showToast("Error registering user: " + err.message, "error");
                    return;
                }
            }

            // Fallback to localStorage if Supabase unconfigured
            const users = JSON.parse(localStorage.getItem('dada_dadi_users') || '[]');
            if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                showToast("This email is already registered! Please use another.", "error");
                return;
            }

            const newUser = {
                id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
                full_name, age, gender, mobile_number: mobile, address, email, password,
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
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('con_name').value.trim();
            const email = document.getElementById('con_email').value.trim();
            const message = document.getElementById('con_message').value.trim();

            if (window.SupabaseDB && window.SupabaseDB.isConfigured()) {
                try {
                    await window.SupabaseDB.createContactMessage({ name, email, message });
                    showToast("Pranam! We have saved your message in Supabase and will review it soon.", "success");
                    contactForm.reset();
                    return;
                } catch (err) {
                    console.error("Supabase contact message error:", err);
                }
            }

            // Fallback to localStorage
            const messages = JSON.parse(localStorage.getItem('dada_dadi_messages') || '[]');
            const newMsg = {
                id: messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1,
                name, email, message, created_at: new Date().toISOString()
            };
            messages.push(newMsg);
            localStorage.setItem('dada_dadi_messages', JSON.stringify(messages));

            showToast("Pranam! We have saved your message and will review it soon.", "success");
            contactForm.reset();
        });
    }
}

// D. SENIOR CITIZEN USER DASHBOARD LOGIC
async function initUserDashboardLogic() {
    const isPhp = window.location.pathname.toLowerCase().endsWith('.php');
    let session = getCurrentSession();

    if (!isPhp && (!session || session.role !== 'user')) {
        const defaultUser = JSON.parse(localStorage.getItem('dada_dadi_users') || '[]')[0] || { id: 1, full_name: "Ramesh Kapoor", age: 72, email: "ramesh@email.com", gender: "Male", mobile_number: "9876543210", address: "45, Seva Bhavan Road, Elder Care District, New Delhi" };
        startSession(defaultUser, 'user');
        session = getCurrentSession();
    }

    if (session && session.role === 'user') {
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
        
        const ageEl = document.getElementById('prof_age_badge') || document.querySelector('.profile-age');
        if (ageEl && session.age) ageEl.textContent = `Senior Citizen | Age: ${session.age}`;

        const emailSpan = document.getElementById('prof_email_span');
        if (emailSpan && session.email) emailSpan.textContent = session.email;
        
        const phoneSpan = document.getElementById('prof_phone_span');
        if (phoneSpan && session.mobile) phoneSpan.textContent = session.mobile;
        
        const genderSpan = document.getElementById('prof_gender_span');
        if (genderSpan && session.gender) genderSpan.textContent = session.gender;
        
        const addressSpan = document.getElementById('prof_address_span');
        if (addressSpan && session.address) addressSpan.innerHTML = session.address.replace(/\n/g, '<br>');

        // Bind Edit inputs if present
        const profName = document.getElementById('prof_name');
        if (profName && session.name) profName.value = session.name;
        const profAge = document.getElementById('prof_age');
        if (profAge && session.age) profAge.value = session.age;
        const profGender = document.getElementById('prof_gender');
        if (profGender && session.gender) profGender.value = session.gender;
        const profMobile = document.getElementById('prof_mobile');
        if (profMobile && session.mobile) profMobile.value = session.mobile;
        const profAddress = document.getElementById('prof_address');
        if (profAddress && session.address) profAddress.value = session.address;

        // Render User Requests from Supabase
        await renderUserRequests(session.id);

        // Profile Save Form Submit handler
        const profileForm = document.getElementById('profileEditForm');
        if (profileForm) {
            profileForm.addEventListener('submit', async (e) => {
                if (!isPhp) {
                    e.preventDefault();
                    const name = document.getElementById('prof_name').value.trim();
                    const age = parseInt(document.getElementById('prof_age').value);
                    const gender = document.getElementById('prof_gender').value;
                    const mobile = document.getElementById('prof_mobile').value.trim();
                    const address = document.getElementById('prof_address').value.trim();

                    if (window.SupabaseDB && window.SupabaseDB.isConfigured() && typeof session.id === 'number') {
                        try {
                            await window.SupabaseDB.updateUser(session.id, {
                                full_name: name, age, gender, mobile_number: mobile, address, email: session.email
                            });
                        } catch (err) {
                            console.error("Supabase user update error:", err);
                        }
                    }

                    // Save new session values
                    session.name = name;
                    session.age = age;
                    session.gender = gender;
                    session.mobile = mobile;
                    session.address = address;
                    localStorage.setItem('dada_dadi_session', JSON.stringify(session));

                    showToast("Your profile details updated successfully!", "success");
                    toggleProfileEditForm();
                    
                    await initUserDashboardLogic();
                    renderDynamicNavigation();
                }
            });
        }
    }
}

async function renderUserRequests(userId) {
    const tableBody = document.getElementById('requestsTableBody');
    const emptyState = document.getElementById('emptyRequestsState');
    if (!tableBody) return;

    const isPhp = window.location.pathname.toLowerCase().endsWith('.php');
    const existingRows = tableBody.querySelectorAll('tr');
    if (isPhp && existingRows.length > 0 && existingRows[0].children.length > 1 && existingRows[0].textContent.trim().length > 0) {
        return;
    }

    const session = getCurrentSession() || {};
    let userRequests = [];

    if (window.SupabaseDB && window.SupabaseDB.isConfigured()) {
        try {
            if (typeof userId === 'number') {
                userRequests = await window.SupabaseDB.getHelpRequestsByUserId(userId) || [];
            }
            if (!userRequests || userRequests.length === 0) {
                // Fetch all and match by email or name if ID differed
                const allReqs = await window.SupabaseDB.getHelpRequests() || [];
                userRequests = allReqs.filter(r => 
                    String(r.user_id) === String(userId) ||
                    (session.email && r.user_email && r.user_email.toLowerCase() === session.email.toLowerCase())
                );
            }
        } catch (err) {
            console.error("Error fetching requests from Supabase:", err);
        }
    }

    if (!userRequests || userRequests.length === 0) {
        const allRequests = JSON.parse(localStorage.getItem('dada_dadi_requests') || '[]');
        userRequests = allRequests.filter(r => 
            String(r.user_id) === String(userId) ||
            (r.user_id && String(r.user_id) === String(session.id)) ||
            (r.user_email && session.email && r.user_email.toLowerCase() === session.email.toLowerCase()) ||
            (r.user_name && session.name && r.user_name.toLowerCase() === session.name.toLowerCase())
        ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    const tableResponsive = tableBody.closest('.table-responsive');

    if (!userRequests || userRequests.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (tableResponsive) tableResponsive.style.display = 'none';
    } else {
        if (emptyState) emptyState.style.display = 'none';
        if (tableResponsive) tableResponsive.style.display = 'block';

        let html = '';
        userRequests.forEach(req => {
            let dateObj = new Date(req.created_at);
            if (isNaN(dateObj.getTime())) dateObj = new Date();
            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) + ', ' + dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            
            const reqType = req.request_type || 'General Help';
            let icon = "fa-hand-holding";
            if (reqType.includes("Medical")) icon = "fa-prescription-bottle-medical";
            else if (reqType.includes("Transport")) icon = "fa-car-side";
            else if (reqType.includes("Grocery")) icon = "fa-basket-shopping";
            else if (reqType.includes("Tech")) icon = "fa-mobile-screen-button";
            else if (reqType.includes("Emergency")) icon = "fa-circle-exclamation";
            else if (reqType.includes("Bank")) icon = "fa-building-columns";

            let badge_class = "pending";
            let status_icon = "fa-clock";
            const reqStatusStr = (req.status || 'Pending').trim();
            let status_upper = reqStatusStr.toUpperCase();
            
            if (reqStatusStr === 'In Progress' || status_upper === 'IN PROGRESS') {
                badge_class = "in-progress";
                status_icon = "fa-person-running";
            } else if (reqStatusStr === 'Completed' || status_upper === 'COMPLETED') {
                badge_class = "completed";
                status_icon = "fa-circle-check";
            }

            const desc = (req.description || '').replace(/\n/g, '<br>');

            html += `
                <tr>
                    <td style="font-weight: 700; width: 180px; font-size: 0.95rem; color: var(--color-text-dark);">${dateStr}</td>
                    <td style="font-weight: 700; width: 180px; color: var(--color-text-dark);">
                        <i class="fa-solid ${icon}" style="color: var(--color-primary); margin-right: 8px; font-size: 1.1rem;"></i> 
                        ${reqType}
                    </td>
                    <td style="font-size: 1rem; line-height: 1.5; min-width: 250px; color: var(--color-text-dark);">${desc}</td>
                    <td style="width: 150px;">
                        <span class="status-badge ${badge_class}">
                            <i class="fa-solid ${status_icon}"></i>
                            ${status_upper}
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
    const isPhp = window.location.pathname.toLowerCase().endsWith('.php');
    let session = getCurrentSession();

    if (!isPhp && (!session || session.role !== 'user')) {
        const defaultUser = JSON.parse(localStorage.getItem('dada_dadi_users') || '[]')[0] || { id: 1, full_name: "Ramesh Kapoor", age: 72, email: "ramesh@email.com", gender: "Male", mobile_number: "9876543210", address: "45, Seva Bhavan Road, Elder Care District, New Delhi" };
        startSession(defaultUser, 'user');
        session = getCurrentSession();
    }

    const helpForm = document.getElementById('helpRequestForm');
    if (helpForm) {
        helpForm.addEventListener('submit', async (e) => {
            if (!isPhp) {
                e.preventDefault();
                const type = document.getElementById('req_type').value;
                const description = document.getElementById('req_description').value.trim();

                const currentSess = getCurrentSession() || { id: 1, email: "ramesh@email.com", name: "Ramesh Kapoor" };

                if (window.SupabaseDB && window.SupabaseDB.isConfigured()) {
                    try {
                        let userId = currentSess.id;
                        // If session ID is not a numeric integer, fetch user by email
                        if (typeof userId !== 'number') {
                            const dbUser = await window.SupabaseDB.getUserByEmail(currentSess.email);
                            if (dbUser) userId = dbUser.id;
                        }

                        await window.SupabaseDB.createHelpRequest({
                            user_id: userId || 1,
                            request_type: type,
                            description: description,
                            status: 'Pending'
                        });

                        window.location.href = 'dashboard.html?request_created=true';
                        return;
                    } catch (err) {
                        console.error("Supabase create help request error:", err);
                    }
                }

                // Fallback to localStorage
                const requests = JSON.parse(localStorage.getItem('dada_dadi_requests') || '[]');
                const newRequest = {
                    id: requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 101,
                    user_id: currentSess.id,
                    user_email: currentSess.email || '',
                    user_name: currentSess.name || '',
                    request_type: type,
                    description: description,
                    status: 'Pending',
                    created_at: new Date().toISOString()
                };

                requests.push(newRequest);
                localStorage.setItem('dada_dadi_requests', JSON.stringify(requests));

                window.location.href = 'dashboard.html?request_created=true';
            }
        });
    }
}

// F. ADMIN DASHBOARD LOGIC
async function initAdminDashboardLogic() {
    const session = getCurrentSession();
    if (!session || session.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    let users = [];
    let requests = [];
    let messages = [];

    if (window.SupabaseDB && window.SupabaseDB.isConfigured()) {
        try {
            users = await window.SupabaseDB.getUsers() || [];
            requests = await window.SupabaseDB.getHelpRequests() || [];
            messages = await window.SupabaseDB.getContactMessages() || [];
        } catch (err) {
            console.error("Supabase admin dashboard error:", err);
        }
    }

    if (users.length === 0) users = JSON.parse(localStorage.getItem('dada_dadi_users') || '[]');
    if (requests.length === 0) requests = JSON.parse(localStorage.getItem('dada_dadi_requests') || '[]');
    if (messages.length === 0) messages = JSON.parse(localStorage.getItem('dada_dadi_messages') || '[]');

    // Metric Counts
    const totalSeniorsEl = document.getElementById('metric_total_seniors');
    if (totalSeniorsEl) totalSeniorsEl.textContent = users.length;
    
    const pendingEl = document.getElementById('metric_pending');
    if (pendingEl) pendingEl.textContent = requests.filter(r => r.status === 'Pending').length;
    
    const inProgressEl = document.getElementById('metric_inprogress');
    if (inProgressEl) inProgressEl.textContent = requests.filter(r => r.status === 'In Progress').length;
    
    const completedEl = document.getElementById('metric_completed');
    if (completedEl) completedEl.textContent = requests.filter(r => r.status === 'Completed').length;

    // Recent Requests (Latest 5)
    const recentRequestsBody = document.getElementById('recentRequestsTableBody');
    if (recentRequestsBody) {
        const sortedReqs = [...requests].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
        if (sortedReqs.length === 0) {
            recentRequestsBody.innerHTML = '<tr><td colspan="4" class="text-center">No requests recorded.</td></tr>';
        } else {
            let html = '';
            sortedReqs.forEach(req => {
                const requester = users.find(u => String(u.id) === String(req.user_id)) || { full_name: 'Unknown User', mobile_number: 'N/A' };
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
async function initAdminUsersLogic() {
    const session = getCurrentSession();
    if (!session || session.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    await renderAdminUsersList();

    const searchInp = document.getElementById('admin_user_search');
    if (searchInp) {
        searchInp.addEventListener('input', async () => {
            await renderAdminUsersList(searchInp.value.trim());
        });
    }

    const editForm = document.getElementById('adminEditUserForm');
    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = parseInt(document.getElementById('edt_user_id').value);
            const name = document.getElementById('edt_name').value.trim();
            const email = document.getElementById('edt_email').value.trim();
            const age = parseInt(document.getElementById('edt_age').value);
            const gender = document.getElementById('edt_gender').value;
            const phone = document.getElementById('edt_phone').value.trim();
            const address = document.getElementById('edt_address').value.trim();

            if (window.SupabaseDB && window.SupabaseDB.isConfigured()) {
                try {
                    await window.SupabaseDB.updateUser(id, {
                        full_name: name, email, age, gender, mobile_number: phone, address
                    });
                    showToast(`Profile of ${name} updated successfully in Supabase!`, "success");
                    closeAdminEditForm();
                    await renderAdminUsersList(searchInp ? searchInp.value.trim() : '');
                    return;
                } catch (err) {
                    showToast("Error updating user: " + err.message, "error");
                    return;
                }
            }

            // Fallback to localStorage
            const users = JSON.parse(localStorage.getItem('dada_dadi_users') || '[]');
            const idx = users.findIndex(u => u.id === id);

            if (idx !== -1) {
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
                
                closeAdminEditForm();
                await renderAdminUsersList(searchInp ? searchInp.value.trim() : '');
            }
        });
    }
}

async function renderAdminUsersList(filterText = '') {
    const tbody = document.getElementById('adminUsersTableBody');
    if (!tbody) return;

    let users = [];
    if (window.SupabaseDB && window.SupabaseDB.isConfigured()) {
        try {
            users = await window.SupabaseDB.getUsers() || [];
        } catch (err) {
            console.error("Supabase admin users list error:", err);
        }
    }

    if (users.length === 0) users = JSON.parse(localStorage.getItem('dada_dadi_users') || '[]');
    let filtered = users;

    if (filterText) {
        const query = filterText.toLowerCase();
        filtered = users.filter(u => 
            (u.full_name || '').toLowerCase().includes(query) || 
            (u.email || '').toLowerCase().includes(query) || 
            (u.mobile_number || '').includes(query)
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
                    <td style="font-size: 0.95rem; line-height: 1.4; max-width: 250px;">${(u.address || '').replace(/\n/g, '<br>')}</td>
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

async function triggerAdminEditUser(userId) {
    let users = [];
    if (window.SupabaseDB && window.SupabaseDB.isConfigured()) {
        try {
            users = await window.SupabaseDB.getUsers() || [];
        } catch (err) {
            console.error(err);
        }
    }
    if (users.length === 0) users = JSON.parse(localStorage.getItem('dada_dadi_users') || '[]');
    
    const user = users.find(u => String(u.id) === String(userId));
    if (!user) return;

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
        
        container.scrollIntoView({ behavior: 'smooth' });
    }
}

function closeAdminEditForm() {
    const container = document.getElementById('adminEditUserCard');
    if (container) container.style.display = 'none';
}

async function triggerAdminDeleteUser(userId) {
    if (!confirm("Are you sure you want to permanently delete this senior profile? All associated help requests will also be deleted.")) {
        return;
    }

    if (window.SupabaseDB && window.SupabaseDB.isConfigured()) {
        try {
            await window.SupabaseDB.deleteUser(userId);
            showToast("Senior citizen profile deleted successfully from Supabase.", "success");
            await renderAdminUsersList(document.getElementById('admin_user_search')?.value.trim());
            return;
        } catch (err) {
            showToast("Error deleting user: " + err.message, "error");
            return;
        }
    }

    // Fallback to localStorage
    const users = JSON.parse(localStorage.getItem('dada_dadi_users') || '[]');
    const user = users.find(u => String(u.id) === String(userId));
    if (!user) return;

    const updatedUsers = users.filter(u => String(u.id) !== String(userId));
    localStorage.setItem('dada_dadi_users', JSON.stringify(updatedUsers));

    const requests = JSON.parse(localStorage.getItem('dada_dadi_requests') || '[]');
    const updatedRequests = requests.filter(r => String(r.user_id) !== String(userId));
    localStorage.setItem('dada_dadi_requests', JSON.stringify(updatedRequests));

    showToast(`Profile of ${user.full_name} deleted successfully.`, "success");
    await renderAdminUsersList(document.getElementById('admin_user_search')?.value.trim());
}

// H. ADMIN REQUESTS MANAGEMENT LOGIC
async function initAdminRequestsLogic() {
    const session = getCurrentSession();
    if (!session || session.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const prefillSearch = urlParams.get('search');
    if (prefillSearch) {
        document.getElementById('search_inp').value = prefillSearch;
    }

    await renderAdminRequestsList();

    const searchInp = document.getElementById('search_inp');
    const statusFilter = document.getElementById('status_filter');
    const typeFilter = document.getElementById('type_filter');

    const updateTrigger = async () => {
        await renderAdminRequestsList(searchInp.value.trim(), statusFilter.value, typeFilter.value);
    };

    searchInp.addEventListener('input', updateTrigger);
    statusFilter.addEventListener('change', updateTrigger);
    typeFilter.addEventListener('change', updateTrigger);

    window.resetAdminRequestsFilters = async () => {
        searchInp.value = '';
        statusFilter.value = '';
        typeFilter.value = '';
        await updateTrigger();
    };

    window.toggleAdminCreateRequestCard = async function() {
        const card = document.getElementById('adminCreateRequestCard');
        if (!card) return;
        if (card.style.display === 'none' || !card.style.display) {
            card.style.display = 'block';
            await populateAdminSeniorDropdown();
            card.scrollIntoView({ behavior: 'smooth' });
        } else {
            card.style.display = 'none';
        }
    };

    async function populateAdminSeniorDropdown() {
        const selectEl = document.getElementById('admin_req_user');
        if (!selectEl) return;
        
        let users = [];
        if (window.SupabaseDB && window.SupabaseDB.isConfigured()) {
            try {
                users = await window.SupabaseDB.getUsers() || [];
            } catch (err) {
                console.error(err);
            }
        }
        if (users.length === 0) users = JSON.parse(localStorage.getItem('dada_dadi_users') || '[]');

        if (users.length === 0) {
            selectEl.innerHTML = '<option value="">No seniors registered</option>';
            return;
        }
        let html = '';
        users.forEach(u => {
            html += `<option value="${u.id}">${u.full_name} (${u.email})</option>`;
        });
        selectEl.innerHTML = html;
    }

    const createReqForm = document.getElementById('adminCreateHelpRequestForm');
    if (createReqForm) {
        createReqForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userId = document.getElementById('admin_req_user').value;
            const reqType = document.getElementById('admin_req_type').value;
            const reqStatus = document.getElementById('admin_req_status').value;
            const reqDesc = document.getElementById('admin_req_desc').value.trim();

            if (!userId || !reqType || !reqDesc) {
                showToast("Please fill in all required fields.", "error");
                return;
            }

            if (window.SupabaseDB && window.SupabaseDB.isConfigured()) {
                try {
                    await window.SupabaseDB.createHelpRequest({
                        user_id: parseInt(userId),
                        request_type: reqType,
                        description: reqDesc,
                        status: reqStatus
                    });
                    showToast(`Help Request created successfully in Supabase!`, "success");
                    createReqForm.reset();
                    await window.toggleAdminCreateRequestCard();
                    await renderAdminRequestsList();
                    return;
                } catch (err) {
                    showToast("Error creating request: " + err.message, "error");
                    return;
                }
            }

            // Fallback to localStorage
            const users = JSON.parse(localStorage.getItem('dada_dadi_users') || '[]');
            const matchedUser = users.find(u => String(u.id) === String(userId));

            const requests = JSON.parse(localStorage.getItem('dada_dadi_requests') || '[]');
            const newRequest = {
                id: requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 101,
                user_id: matchedUser ? matchedUser.id : userId,
                user_email: matchedUser ? matchedUser.email : '',
                user_name: matchedUser ? matchedUser.full_name : '',
                request_type: reqType,
                description: reqDesc,
                status: reqStatus,
                created_at: new Date().toISOString()
            };

            requests.unshift(newRequest);
            localStorage.setItem('dada_dadi_requests', JSON.stringify(requests));

            showToast(`Help Request created successfully!`, "success");
            createReqForm.reset();
            await window.toggleAdminCreateRequestCard();
            await renderAdminRequestsList();
        });
    }
}

async function renderAdminRequestsList(searchText = '', statusVal = '', typeVal = '') {
    const tbody = document.getElementById('adminRequestsTableBody');
    if (!tbody) return;

    let users = [];
    let requests = [];

    if (window.SupabaseDB && window.SupabaseDB.isConfigured()) {
        try {
            users = await window.SupabaseDB.getUsers() || [];
            requests = await window.SupabaseDB.getHelpRequests() || [];
        } catch (err) {
            console.error("Supabase admin requests list error:", err);
        }
    }

    if (users.length === 0) users = JSON.parse(localStorage.getItem('dada_dadi_users') || '[]');
    if (requests.length === 0) requests = JSON.parse(localStorage.getItem('dada_dadi_requests') || '[]');

    let filtered = requests;

    if (searchText) {
        const query = searchText.toLowerCase();
        filtered = filtered.filter(req => {
            const senior = users.find(u => String(u.id) === String(req.user_id)) || { full_name: '' };
            return (senior.full_name || '').toLowerCase().includes(query) || (req.description || '').toLowerCase().includes(query);
        });
    }

    if (statusVal) {
        filtered = filtered.filter(req => req.status === statusVal);
    }

    if (typeVal) {
        filtered = filtered.filter(req => req.request_type === typeVal || (req.request_type || '').includes(typeVal));
    }

    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No service requests matched the selected filters.</td></tr>';
    } else {
        let html = '';
        filtered.forEach(req => {
            const senior = users.find(u => String(u.id) === String(req.user_id)) || { full_name: 'Unknown User', age: '?', mobile_number: 'N/A', address: 'N/A' };
            const dateStr = new Date(req.created_at).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            
            const reqType = req.request_type || 'General Help';
            let icon = "fa-hand-holding";
            if (reqType.includes("Medical")) icon = "fa-prescription-bottle-medical";
            else if (reqType.includes("Transport")) icon = "fa-car-side";
            else if (reqType.includes("Grocery")) icon = "fa-basket-shopping";
            else if (reqType.includes("Tech")) icon = "fa-mobile-screen-button";
            else if (reqType.includes("Emergency")) icon = "fa-circle-exclamation";

            let badge_class = "pending";
            if (req.status === 'In Progress') badge_class = "in-progress";
            if (req.status === 'Completed') badge_class = "completed";

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
                            <i class="fa-solid fa-location-dot"></i> ${(senior.address || '').replace(/\n/g, '<br>')}
                        </span>
                    </td>
                    <td style="font-size: 1rem; line-height: 1.5; max-width: 320px;">
                        <div style="background-color: var(--color-bg-light); padding: 12px; border-radius: var(--border-radius); border: 1px solid var(--color-border);">
                            ${(req.description || '').replace(/\n/g, '<br>')}
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

async function updateAdminRequestStatus(requestId, newStatus) {
    if (window.SupabaseDB && window.SupabaseDB.isConfigured()) {
        try {
            await window.SupabaseDB.updateHelpRequestStatus(requestId, newStatus);
            showToast(`Request status updated to ${newStatus} in Supabase!`, "success");
            await renderAdminRequestsList(
                document.getElementById('search_inp')?.value.trim() || '',
                document.getElementById('status_filter')?.value || '',
                document.getElementById('type_filter')?.value || ''
            );
            return;
        } catch (err) {
            showToast("Error updating request status: " + err.message, "error");
            return;
        }
    }

    // Fallback to localStorage
    const requests = JSON.parse(localStorage.getItem('dada_dadi_requests') || '[]');
    const idx = requests.findIndex(r => String(r.id) === String(requestId));

    if (idx !== -1) {
        requests[idx].status = newStatus;
        localStorage.setItem('dada_dadi_requests', JSON.stringify(requests));
        showToast(`Request status updated to ${newStatus} successfully!`, "success");
        
        await renderAdminRequestsList(
            document.getElementById('search_inp')?.value.trim() || '',
            document.getElementById('status_filter')?.value || '',
            document.getElementById('type_filter')?.value || ''
        );
    }
}

async function deleteAdminRequest(requestId) {
    if (!confirm("Are you sure you want to delete this service request?")) return;

    if (window.SupabaseDB && window.SupabaseDB.isConfigured()) {
        try {
            await window.SupabaseDB.deleteHelpRequest(requestId);
            showToast("Service request deleted from Supabase.", "success");
            await renderAdminRequestsList(
                document.getElementById('search_inp')?.value.trim() || '',
                document.getElementById('status_filter')?.value || '',
                document.getElementById('type_filter')?.value || ''
            );
            return;
        } catch (err) {
            showToast("Error deleting request: " + err.message, "error");
            return;
        }
    }

    // Fallback to localStorage
    const requests = JSON.parse(localStorage.getItem('dada_dadi_requests') || '[]');
    const updated = requests.filter(r => String(r.id) !== String(requestId));
    localStorage.setItem('dada_dadi_requests', JSON.stringify(updated));
    
    showToast("Service request deleted successfully.", "success");
    await renderAdminRequestsList(
        document.getElementById('search_inp')?.value.trim() || '',
        document.getElementById('status_filter')?.value || '',
        document.getElementById('type_filter')?.value || ''
    );
}

