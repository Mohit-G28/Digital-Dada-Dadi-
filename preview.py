import os
import re

def compile_php_to_html():
    print("Compiling PHP files to static HTML previews...")
    
    # Read include files
    with open("includes/header.php", "r", encoding="utf-8") as f:
        header_raw = f.read()
    with open("includes/footer.php", "r", encoding="utf-8") as f:
        footer_raw = f.read()

    # Pre-process header for Guest and User states
    # 1. Strip top PHP blocks
    header_body = re.sub(r"<\?php.*?\?>", "", header_raw, flags=re.DOTALL)
    
    # 2. Extract Nav configurations
    # Guest Nav Block
    guest_nav_match = re.search(r"<\?php else:\s*\?>(.*?)(?=<\?php endif;\s*\?>)", header_body, re.DOTALL)
    guest_nav = guest_nav_match.group(1) if guest_nav_match else ""
    
    # User Nav Block
    user_nav_match = re.search(r"<\?php elseif \(isset\(\$_SESSION\['user_id'\]\)\):\s*\?>(.*?)(?=<\?php else:)", header_body, re.DOTALL)
    user_nav = user_nav_match.group(1) if user_nav_match else ""

    # Admin Nav Block
    admin_nav_match = re.search(r"<\?php if \(isset\(\$_SESSION\['admin_id'\]\)\):\s*\?>(.*?)(?=<\?php elseif)", header_body, re.DOTALL)
    admin_nav = admin_nav_match.group(1) if admin_nav_match else ""

    # Replace user tags in User nav with mock senior citizen details
    user_nav = user_nav.replace("<?php echo htmlspecialchars(explode(' ', trim($_SESSION['user_name']))[0]); ?>", "Ramesh")
    admin_nav = admin_nav.replace("<?php echo htmlspecialchars($_SESSION['admin_name']); ?>", "Desk Administrator")

    # Replace PHP blocks in header structure
    header_template = re.sub(r"<nav class=\"nav-menu\".*?</nav>", 
                             '<nav class="nav-menu" id="navMenu"><ul>__NAV_PLACEHOLDER__</ul></nav>', 
                             header_body, flags=re.DOTALL)

    # Pre-process footer
    footer_body = re.sub(r"<\?php.*?\?>", "", footer_raw, flags=re.DOTALL)
    # Remove dynamic date PHP logic
    footer_body = footer_body.replace("<?php echo date('Y'); ?>", "2026")
    # Quick links state
    footer_links_match = re.search(r"<\?php if \(!isset\(\$_SESSION\['user_id'\]\).*?\?>(.*?)(?=<\?php else:)", footer_body, re.DOTALL)
    footer_guest_links = footer_links_match.group(1) if footer_links_match else ""
    footer_body = re.sub(r"<\?php if \(!isset\(\$_SESSION\['user_id'\].*?<\?php endif; \?>", footer_guest_links, footer_body, flags=re.DOTALL)

    # List of files to process
    files = [
        "index.php",
        "about.php",
        "contact.php",
        "register.php",
        "login.php",
        "request_help.php",
        "dashboard.php"
    ]

    for filename in files:
        with open(filename, "r", encoding="utf-8") as f:
            content = f.read()

        # Remove top database and redirect PHP blocks
        content = re.sub(r"^<\?php.*?(include 'includes/header.php';|include 'includes/db.php';\s*include 'includes/header.php';).*?\?>", "", content, flags=re.DOTALL)
        
        # Remove footer include at bottom
        content = re.sub(r"<\?php\s*include 'includes/footer.php';\s*\?>", "", content, flags=re.DOTALL)
        
        # Identify whether user is logged in based on page type
        if filename in ["dashboard.php", "request_help.php"]:
            nav_content = user_nav
        else:
            nav_content = guest_nav

        header_final = header_template.replace("__NAV_PLACEHOLDER__", nav_content)

        # Assemble the full HTML
        full_html = header_final + content + footer_body

        # Clean up any leftover PHP tags inside pages
        # A. Alerts checks
        full_html = re.sub(r"<\?php if \(!empty\(\$message_status\)\):.*?\?>.*?<\?php endif; \?>", "", full_html, flags=re.DOTALL)
        full_html = re.sub(r"<\?php if \(!empty\(\$success_msg\)\):.*?\?>.*?<\?php endif; \?>", "", full_html, flags=re.DOTALL)
        full_html = re.sub(r"<\?php if \(!empty\(\$error_msg\)\):.*?\?>.*?<\?php endif; \?>", "", full_html, flags=re.DOTALL)
        full_html = re.sub(r"<\?php if \(\$registration_success\):.*?\?>.*?<\?php endif; \?>", "", full_html, flags=re.DOTALL)
        full_html = re.sub(r"<\?php if \(!empty\(\$error_user\)\):.*?\?>.*?<\?php endif; \?>", "", full_html, flags=re.DOTALL)
        full_html = re.sub(r"<\?php if \(!empty\(\$error_admin\)\):.*?\?>.*?<\?php endif; \?>", "", full_html, flags=re.DOTALL)
        full_html = re.sub(r"<\?php echo \(\$error_admin === ''\) \? 'active' : ''; \?>", "active", full_html)
        full_html = re.sub(r"<\?php echo \(\$error_admin !== ''\) \? 'active' : ''; \?>", "", full_html)

        # B. User session displays (like user name)
        full_html = full_html.replace("<?php echo htmlspecialchars($_SESSION['user_name']); ?>", "Ramesh Kapoor")
        full_html = full_html.replace("<?php echo htmlspecialchars($_SESSION['user_age']); ?>", "72")
        full_html = full_html.replace("<?php echo htmlspecialchars($_SESSION['user_email']); ?>", "ramesh@email.com")
        full_html = full_html.replace("<?php echo htmlspecialchars($_SESSION['user_mobile']); ?>", "9876543210")
        full_html = full_html.replace("<?php echo htmlspecialchars($_SESSION['user_gender']); ?>", "Male")
        full_html = full_html.replace("<?php echo nl2br(htmlspecialchars($_SESSION['user_address'])); ?>", "45, Seva Bhavan Road, Elder Care District, New Delhi")
        
        # C. Mock requests in dashboard table
        mock_requests_html = """
            <div class="card text-center" id="emptyRequestsState" style="padding: 40px; border-style: dashed; border-width: 2px;">
                <i class="fa-solid fa-hand-holding-hand" style="font-size: 3rem; color: var(--color-text-light); margin-bottom: 15px;"></i>
                <h3>No requests submitted yet</h3>
                <p>Dada, Dadi, if you need help with medical visits, medicines, grocery shopping, bank trips, or mobile phone settings, please click the button above to request help.</p>
                <a href="request_help.html" class="btn btn-secondary"><i class="fa-solid fa-hand-holding-hand"></i> Submit Your First Request</a>
            </div>

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
                    <tbody id="requestsTableBody">
                    </tbody>
                </table>
            </div>
        """
        full_html = re.sub(r"<\?php if \(empty\(\$requests\)\):.*?<\?php endif; \?>", mock_requests_html, full_html, flags=re.DOTALL)

        # D. Links update (.php -> .html)
        full_html = re.sub(r'href="([^"]+)\.php"', r'href="\1.html"', full_html)
        full_html = re.sub(r'action="([^"]+)\.php"', r'action="\1.html"', full_html)
        
        # E. Clean up all POST & SESSION inline PHP echo conditions & remaining PHP blocks
        full_html = re.sub(r"<\?php\s+echo\s+isset\(\$_POST\[.*?\]\)\s*\?\s*htmlspecialchars\(\$_POST\[.*?\]\)\s*:\s*''\s*;\s*\?>", "", full_html)
        full_html = re.sub(r"<\?php\s+echo\s+\(isset\(\$_POST\[.*?\]\).*?\)\s*\?\s*'selected'\s*:\s*''\s*;\s*\?>", "", full_html)
        full_html = re.sub(r"<\?php\s+echo\s+\$_SESSION\[.*?\]\s*===\s*.*?\s*\?\s*'selected'\s*:\s*''\s*;\s*\?>", "", full_html)
        full_html = re.sub(r"<\?php.*?\?>", "", full_html, flags=re.DOTALL)

        # Write compile to html
        output_filename = filename.replace(".php", ".html")
        with open(output_filename, "w", encoding="utf-8") as f:
            f.write(full_html)
        
        print(f"Generated: {output_filename}")

    print("Success! Previews generated.")

if __name__ == "__main__":
    compile_php_to_html()
