    <?php
    // Hook into the admin_menu action to add the submenu page
    function avatar_studio_plugin_menu()
    {
        // Add a main menu page (only if it's needed)
        add_menu_page(
            'Avatar Studio',                // Page title
            'Avatar Studio',                // Menu title
            'manage_options',           // Capability required to view this page
            'avatar_studio_main',           // Menu slug
            'avatar_studio_main_page',      // Function to display content
            'dashicons-admin-generic',  // Icon for the menu
            6                           // Position in the menu
        );
        // add_submenu_page(
        //     'avatar_studio_main', 
        //     'User Info',
        //     'User Info',
        //     'manage_options',
        //     'avatar_studio_user_info',
        //     'avatar_studio_user_info_page'
        // );

        // Add Sessions submenu only if Google Drive is enabled
        if (get_option('avatar_studio_enable_google_drive') == '1') {
            add_submenu_page(
                'avatar_studio_main', 
                'Sessions',
                'Sessions',
                'manage_options',
                'avatar_studio_sessions',
                'avatar_studio_sessions_page'
            );
        }

        // Add Error Logs submenu
        // add_submenu_page(
        //     'avatar_studio_main', 
        //     'Error Logs',
        //     'Error Logs',
        //     'manage_options',
        //     'avatar_studio_error_logs',
        //     'avatar_studio_view_error_logs'
        // );

        // --- Add settings submenu ---
    add_action('admin_menu', function() {
        add_submenu_page(
            'options-general.php',
            'Avatar Export Settings',
            'Avatar Export Settings',
            'manage_options',
            'avatar-export-settings',
            'avatar_studio_render_settings_page'
        );
    });
    }
    add_action('admin_menu', 'avatar_studio_plugin_menu');

        function avatar_studio_main_page()
{
    $pages = get_pages();
    $export_enabled = get_option('avatar_auto_export_enabled', 1);
    $export_interval = get_option('avatar_auto_export_interval', 'every_5_minutes');
    
    // Get Tavus API key value
    $tavus_api_key = get_option('avatar_studio_tavus_api_key', '');
    $has_tavus_key = !empty($tavus_api_key);
    
    // Get current Google Drive enable status
    $google_drive_enabled = get_option('avatar_studio_enable_google_drive', 0);
    ?>
    <style>
    /* Add these new styles for the conditional sections */
    .conditional-section {
        transition: all 0.3s ease;
    }
    
    .conditional-section.disabled {
        opacity: 0.6;
        pointer-events: none;
    }
    
    .section-status {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        margin-left: 10px;
        background: #f1f5f9;
        color: #64748b;
    }
    
    .section-status.active {
        background: linear-gradient(135deg, rgba(56, 177, 197, 0.15) 0%, rgba(218, 146, 44, 0.15) 100%);
        color: #38b1c5;
    }
    
    .section-status.inactive {
        background: #f1f5f9;
        color: #94a3b8;
    }
    
    .section-status::before {
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        display: inline-block;
    }
    
    .section-status.active::before {
        background: #10b981;
        box-shadow: 0 0 6px rgba(16, 185, 129, 0.5);
    }
    
    .section-status.inactive::before {
        background: #94a3b8;
    }
    
    /* Existing styles remain the same */
    .avatar-studio-wrap {
        max-width: 1400px;
        margin: 20px auto;
        padding: 0 20px;
    }

    .avatar-studio-header {
        background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        color: white;
        padding: 32px 40px;
        border-radius: 12px;
        margin-bottom: 30px;
        box-shadow: 0 4px 20px rgba(56, 177, 197, 0.3);
        position: relative;
        overflow: hidden;
    }

    .avatar-studio-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
        pointer-events: none;
    }

    .avatar-studio-header h1 {
        font-size: 32px;
        font-weight: 700;
        margin: 0 0 8px 0;
        color: white;
        display: flex;
        align-items: center;
        gap: 12px;
        position: relative;
        z-index: 1;
    }

    .avatar-studio-header p {
        margin: 0;
        opacity: 0.9;
        font-size: 15px;
    }

    .avatar-studio-card {
        background: white;
        border: 2px solid transparent;
        background-image: 
            linear-gradient(white, white),
            linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        border-radius: 12px;
        padding: 0;
        margin: 20px 0;
        box-shadow: 0 4px 15px rgba(56, 177, 197, 0.1);
        transition: all 0.3s ease;
    }

    .avatar-studio-card:hover {
        box-shadow: 0 8px 25px rgba(56, 177, 197, 0.2);
        transform: translateY(-2px);
    }

    .card-header {
        padding: 20px 30px;
        border-bottom: 2px solid transparent;
        background: linear-gradient(135deg, rgba(56, 177, 197, 0.08) 0%, rgba(218, 146, 44, 0.08) 100%);
        border-radius: 10px 10px 0 0;
        position: relative;
        cursor: pointer;
        user-select: none;
    }

    .card-header.collapsible {
        cursor: pointer;
        display: flex;
    }

    .card-header.collapsible:hover {
        background: linear-gradient(135deg, rgba(56, 177, 197, 0.12) 0%, rgba(218, 146, 44, 0.12) 100%);
    }

    .card-header::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #38b1c5 0%, #da922c 100%);
    }

    .card-header h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #1e293b;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .card-header h2::before {
        content: '';
        width: 5px;
        height: 24px;
        background: linear-gradient(180deg, #38b1c5 0%, #da922c 100%);
        border-radius: 3px;
        box-shadow: 0 2px 8px rgba(56, 177, 197, 0.4);
    }

    /* Collapse Toggle Icon */
    .collapse-toggle {
        margin-left: auto;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        border-radius: 50%;
        color: white;
        font-size: 14px;
        font-weight: bold;
        transition: transform 0.3s ease;
        flex-shrink: 0;
    }

    .collapse-toggle.collapsed {
        transform: rotate(180deg);
    }

    .card-body.collapsed + .card-header::after,
    .card-header.collapsible:has(+ .card-body.collapsed)::after {
        opacity: 0;
        height: 0;
    }

    /* Fix for all card header borders */
    .card-header {
        position: relative;
        padding: 20px 30px;
        border-bottom: 2px solid transparent;
        background: linear-gradient(135deg, rgba(56, 177, 197, 0.08) 0%, rgba(218, 146, 44, 0.08) 100%);
        border-radius: 10px 10px 0 0;
        position: relative;
        cursor: pointer;
        user-select: none;
    }

    .card-header::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #38b1c5 0%, #da922c 100%);
        transition: all 0.3s ease;
    }

    /* Show border when NOT collapsed */
    .card-body:not(.collapsed) + .card-header::after,
    .card-header.collapsible:not(.collapsed-state)::after {
        opacity: 1;
        height: 2px;
    }

    /* Hide border when collapsed */
    .card-body.collapsed + .card-header::after,
    .card-header.collapsible.collapsed-state::after {
        opacity: 0;
        height: 0;
    }

    /* Remove the old conflicting rules */
    .card-header.collapsible:has(+ .card-body.collapsed)::after {
        /* Remove this rule entirely */
    }

    /* Alternative approach - add a class-based solution */
    .card-header.collapsed-state::after {
        opacity: 0;
        height: 0;
        transition: all 0.3s ease;
    }

    .card-body {
        padding: 30px;
        transition: all 0.3s ease;
        overflow: hidden;
    }

    .card-body.collapsed {
        max-height: 0;
        padding: 0 30px;
        opacity: 0;
    }

    .form-table {
        margin: 0;
        width: 100%;
    }

    .form-table th {
        padding: 15px 0;
        width: 180px;
        font-weight: 600;
        color: #333;
        vertical-align: top;
    }

    #api-key-config {
        width: 80px;
    }

    .form-table td {
        padding: 15px 0;
        width: auto;
    }

    .form-table tr {
        border-bottom: 1px solid #f1f5f9;
    }

    .form-table tr:last-child {
        border-bottom: none;
    }

    .plugin-input[type="text"],
    .plugin-input[type="password"],
    .plugin-input select {
        width: 100%;
        max-width: 600px;
        padding: 10px 14px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 14px;
        transition: all 0.2s ease;
        background: white;
        box-sizing: border-box;
    }

    .plugin-input[type="text"]:focus,
    .plugin-input[type="password"]:focus,
    .plugin-input select:focus {
        outline: none;
        border: 2px solid transparent;
        background-image: 
            linear-gradient(white, white),
            linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        box-shadow: 0 0 0 4px rgba(56, 177, 197, 0.1);
    }

    .input-wrapper {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        max-width: 600px;
    }

    .input-wrapper input {
        flex: 1;
        min-width: 0;
    }

    .toggle-visibility {
        padding: 10px 20px !important;
        background: #f8fafc !important;
        border: 1px solid #d1d5db !important;
        border-radius: 6px !important;
        color: #475569 !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        cursor: pointer;
        transition: all 0.2s ease;
        height: auto !important;
        white-space: nowrap;
        flex-shrink: 0;
    }

    .toggle-visibility:hover {
        background: linear-gradient(135deg, rgba(56, 177, 197, 0.1) 0%, rgba(218, 146, 44, 0.1) 100%) !important;
        border: 1px solid transparent !important;
        background-image: 
            linear-gradient(135deg, rgba(56, 177, 197, 0.1) 0%, rgba(218, 146, 44, 0.1) 100%),
            linear-gradient(135deg, #38b1c5 0%, #da922c 100%) !important;
        background-origin: border-box !important;
        background-clip: padding-box, border-box !important;
        color: #fff !important;
    }

    .description {
        margin: 8px 0 0 0 !important;
        color: #64748b !important;
        font-size: 13px !important;
        line-height: 1.5 !important;
    }

    .description a {
        background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-decoration: none;
        font-weight: 600;
        position: relative;
    }

    .description a::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -2px;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #38b1c5 0%, #da922c 100%);
        transition: width 0.3s ease;
    }

    .description a:hover::after {
        width: 100%;
    }

    /* Toggle Switch */
    .toggle-switch {
        position: relative;
        display: inline-block;
        width: 48px;
        height: 26px;
        margin-right: 10px;
    }

    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #cbd5e1;
        transition: 0.3s;
        border-radius: 34px;
    }

    .toggle-slider:before {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.3s;
        border-radius: 50%;
    }

    input:checked + .toggle-slider {
        background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        box-shadow: 0 2px 8px rgba(56, 177, 197, 0.4);
    }

    input:checked + .toggle-slider:before {
        transform: translateX(22px);
    }

    .toggle-label {
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .toggle-label span {
        font-weight: 500;
        color: #334155;
    }

    /* api-integration */

    .tavus-heygen-api {
        /* display: flex; */
        gap: 20px;
    }

    .tavus-heygen-api .avatar-studio-card {
        flex: 1;
        min-width: 0;
    }

    /* Code Display */
    .code-display {
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        color: #e2e8f0;
        padding: 16px 20px;
        border-radius: 8px;
        font-family: 'Monaco', 'Courier New', monospace;
        font-size: 13px;
        display: inline-block;
        max-width: 100%;
        overflow-x: auto;
        border: 2px solid transparent;
        background-image: 
            linear-gradient(135deg, #1e293b 0%, #0f172a 100%),
            linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        word-break: break-all;
    }

    /* Setup Instructions */
    .setup-instructions {
        background: linear-gradient(135deg, rgba(56, 177, 197, 0.08) 0%, rgba(218, 146, 44, 0.08) 100%);
        border: 2px solid transparent;
        background-image: 
            linear-gradient(135deg, rgba(56, 177, 197, 0.08) 0%, rgba(218, 146, 44, 0.08) 100%),
            linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        border-radius: 12px;
        padding: 25px 30px;
        margin-top: 30px;
    }

    .setup-instructions h3 {
        font-size: 16px;
        margin: 0 0 20px 0;
        font-weight: 600;
        background-clip: text;
        display: flex;
        align-items: center;
        gap: 8px;
        color: #fff;
    }

    .setup-instructions h3::before {
        content: '📋';
        font-size: 20px;
    }

    .setup-instructions ol {
        counter-reset: step-counter;
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .setup-instructions li {
        counter-increment: step-counter;
        /* margin: 12px 0; */
        background: white;
        border: 1px solid #d9f2f6;
        border-radius: 6px;
        padding: 14px 18px 14px 60px;
        position: relative;
        transition: all 0.2s ease;
        color: #334155;
        line-height: 1.6;
    }

    .setup-instructions li::before {
        content: counter(step-counter);
        position: absolute;
        left: 18px;
        top: 50%;
        transform: translateY(-50%);
        background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        color: white;
        border-radius: 50%;
                font-size: 14px;
        font-weight: 700;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(56, 177, 197, 0.3);
    }

    .setup-instructions li:hover {
        background: #f8fafc;
        transform: translateX(4px);
        border-color: #38b1c5;
    }

    .setup-instructions a {
        background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-decoration: none;
        font-weight: 600;
        position: relative;
    }

    .setup-instructions a::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -2px;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #38b1c5 0%, #da922c 100%);
        transition: width 0.3s ease;
    }

    .setup-instructions a:hover::after {
        width: 100%;
    }

    .setup-instructions strong {
        background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .two-col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }

    .two-col li {
        margin-bottom: 20px;
    }

    #second-col ol[start="5"] {
        counter-reset: my-counter 4;
    }

    #second-col ol[start="5"] > li {
        counter-increment: my-counter;
    }

    #second-col ol[start="5"] > li::before {
        content: counter(my-counter);
    }

    /* Dropdown-styling */
    .wp-core-ui select {
        font-size: 14px;
        line-height: 2;
        color: #2c3338;
        border-color: #c5c5c5;
        box-shadow: none;
        border-radius: 6px;
        padding: 6px 12px;
        min-height: 30px;
        max-width: 16rem;
        -webkit-appearance: none;
        background: #fff url(data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%206l5%205%205-5%202%201-7%207-7-7%202-1z%22%20fill%3D%22%23555%22%2F%3E%3C%2Fsvg%3E) no-repeat right 10px top 52%;
        background-size: 16px 16px;
        cursor: pointer;
        vertical-align: middle;
        }

    /* Submit Button */
    .button-primary {
        background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%) !important;
        border: none !important;
        padding: 12px 30px !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 15px rgba(56, 177, 197, 0.4) !important;
        transition: all 0.3s ease !important;
        height: auto !important;
        text-shadow: none !important;
        position: relative;
        overflow: hidden;
    }

    .button-primary::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        transition: left 0.5s ease;
    }

    .button-primary:hover::before {
        left: 100%;
    }

    .button-primary:hover {
        background: linear-gradient(135deg, #2a8b9a 0%, #c17d23 100%) !important;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(56, 177, 197, 0.5) !important;
    }

    /* Section Divider */
    .section-divider {
        margin: 40px 0;
        border: none;
        height: 2px;
        background: linear-gradient(90deg, transparent 0%, #38b1c5 25%, #da922c 75%, transparent 100%);
    }

    /* Alert Box */
    .alert-box {
        background: linear-gradient(135deg, rgba(218, 146, 44, 0.08) 0%, rgba(56, 177, 197, 0.08) 100%);
        border: 2px solid transparent;
        background-image: 
            linear-gradient(135deg, rgba(218, 146, 44, 0.08) 0%, rgba(56, 177, 197, 0.08) 100%),
            linear-gradient(135deg, #da922c 0%, #38b1c5 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        padding: 16px 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .alert-box::before {
        content: '⚠️';
        font-size: 20px;
        flex-shrink: 0;
    }

    .alert-box p {
        margin: 0;
        color: #fff;
        line-height: 1.5;
    }

    .alert-box strong {
        background-clip: text;
        color: #fff;
    }

    /* Grey Background Section */
    #google-drive-settings {
        margin-top: 20px;
        padding: 25px;
        background: #f9f9f9;
        border: 1px solid #ddd;
        background-origin: border-box;
        background-clip: padding-box, border-box;
        border-radius: 4px;
    }

    /* Auto Export Settings within Google Drive */
    .auto-export-section {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid rgba(56, 177, 197, 0.2);
    }

    .auto-export-section h3 {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        margin: 0 0 20px 0;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .auto-export-section h3::before {
        content: '⚡';
        font-size: 18px;
    }


    .masked {
        -webkit-text-security: disc; /* Chrome, Edge */
        text-security: disc;         /* Firefox (partial support) */
    }

    #wpbody-content {
        padding-bottom: 10px !important;
    }

    .footer-links {
        margin-top: 80px;
        padding: 20px 0;
        border-top: 2px solid transparent;
        background: linear-gradient(90deg, transparent 0%, rgba(56, 177, 197, 0.2) 50%, transparent 100%);
        text-align: center;
    }

    .footer-links-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 30px;
        flex-wrap: wrap;
    }

    .footer-link {
        display: flex;
        align-items: center;
        gap: 8px;
        text-decoration: none;
        color: #334155;
        font-weight: 500;
        font-size: 14px;
        transition: all 0.3s ease;
    }

    .footer-link:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(56, 177, 197, 0.3);
        color: #1e293b;
    }

    .footer-link .link-text {
        position: relative;
    }

    .footer-link .link-text::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -2px;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #38b1c5 0%, #da922c 100%);
        transition: width 0.3s ease;
    }

    .footer-link:hover .link-text::after {
        width: 100%;
    }

    /* Responsive */
    @media (max-width: 782px) {
        .avatar-studio-wrap {
            padding: 0 10px;
        }

        .avatar-studio-header {
            padding: 20px;
        }

        .card-body {
            padding: 20px;
        }

        .form-table th,
        .form-table td {
            display: block;
            width: 100% !important;
            padding: 10px 0;
        }

        .form-table th {
            padding-bottom: 5px;
        }

        .input-wrapper {
            max-width: 100%;
        }

        .plugin-input[type="text"],
        .plugin-input[type="password"],
        .plugin-input select {
            max-width: 100%;
        }

        .tavus-heygen-api {
            flex-direction: column;
        }
    }
    /* Responsive adjustments */
    @media (max-width: 782px) {
        .footer-links-container {
            flex-direction: column;
            gap: 15px;
        }
        
        .footer-link {
            width: 100%;
            max-width: 280px;
            justify-content: center;
        }
    }
    @media screen and (max-width: 1200px) {
        td > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
        }
    }
    
    @media screen and (max-width: 782px) {
        .form-table th {
            display: block;
            width: 100% !important;
            padding-bottom: 0;
        }
        
        .form-table td {
            display: block;
            width: 100%;
            padding-top: 8px;
        }
        
        td > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
        }
    }
</style>

<div class="avatar-studio-wrap">
<!-- Header -->
<div class="avatar-studio-header">
    <h1><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
        <circle cx="12" cy="12" r="3"/>
    </svg> Avatar Studio Settings</h1>
    <p>Configure your plugin settings, API keys, and integrations</p>
</div>

<form method="post" action="options.php">
    <?php 
    settings_fields('avatar_studio_main_settings_group');
    // REMOVE the register_setting calls from here - they're now in avatar_studio_register_settings()
        ?>

        <!-- Main Enable Setting -->
        <div class="avatar-studio-card">
            <div class="card-header">
                <h2>General Settings</h2>
            </div>
            <div class="card-body">
                <table class="form-table">
                    <tr valign="top">
                        <th style="line-height: 1.5;" scope="row">Plugin Status</th>
                        <td>
                            <label class="toggle-label">
                                <div class="toggle-switch">
                                    <input 
                                        type="checkbox" 
                                        id="avatar_studio_enable" 
                                        name="avatar_studio_enable" 
                                        value="1" 
                                        <?php checked(1, get_option('avatar_studio_enable'), true); ?> 
                                    />
                                    <span class="toggle-slider"></span>
                                </div>
                                <span>Enable Avatar Studio Plugin</span>
                            </label>
                            <p class="description">Toggle this to enable or disable all plugin functionality</p>
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- Tavus API Settings -->
        <div class="tavus-heygen-api">
            <div class="avatar-studio-card">
                <div class="card-header collapsible" data-target="tavus-api-body">
                    <h2>Tavus API Configuration</h2>
                    <span class="collapse-toggle">−</span>
                </div>
                <div class="card-body" id="tavus-api-body">
                    <table class="form-table">
                        <tr valign="top">
                            <th style="line-height: 3.3;" id="api-key-config" scope="row">API Key</th>
                            <td>
                                <div class="input-wrapper">
                                    <input 
                                        type="password" 
                                        id="avatar_studio_tavus_api_key" 
                                        name="avatar_studio_tavus_api_key" 
                                        value="<?php echo esc_attr($tavus_api_key); ?>" 
                                        class="plugin-input masked"
                                        placeholder="Enter your Tavus API key"
                                        autocomplete="off"
                                        autocorrect="off"
                                        autocapitalize="none"
                                    />
                                    <button type="button" class="button toggle-visibility" data-target="avatar_studio_tavus_api_key">Show</button>
                                </div>
                                <p class="description">
                                    Enter your Tavus API key to fetch conversation transcripts. 
                                    Get your API key from <a href="https://platform.tavus.io" target="_blank">Tavus Platform →</a>
                                </p>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

            <!-- Heygen API Settings -->
            <div class="avatar-studio-card">
                <div class="card-header collapsible" data-target="heygen-api-body">
                    <h2>Heygen API Configuration</h2>
                    <span class="collapse-toggle">−</span>
                </div>
                <div class="card-body" id="heygen-api-body">
                    <table class="form-table">
                        <tr valign="top">
                            <th style="line-height: 3.3;" id="api-key-config" scope="row">API Key</th>
                            <td>
                                <div class="input-wrapper">
                                    <input 
                                        type="text" 
                                        id="avatar_studio_heygen_api_key" 
                                        name="avatar_studio_heygen_api_key" 
                                        value="<?php echo esc_attr(get_option('avatar_studio_heygen_api_key')); ?>" 
                                        class="plugin-input masked"
                                        placeholder="Enter your Heygen API key"
                                        autocomplete="off"
                                        autocorrect="off"
                                        autocapitalize="none"
                                    />
                                    <button type="button" class="button toggle-visibility" data-target="avatar_studio_heygen_api_key">Show</button>
                                </div>
                                <p class="description">
                                    Enter your Heygen API key to fetch conversation data. 
                                    Get your API key from <a href="https://app.heygen.com" target="_blank">Heygen Platform →</a>
                                </p>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>

        <!-- Google Drive Integration -->
        <div class="avatar-studio-card conditional-section <?php echo !$has_tavus_key ? 'disabled' : ''; ?>" id="google-drive-section">
            <div class="card-header collapsible" data-target="google-drive-body">
                <h2>
                    Google Drive Integration (User Transcript - Tavus Only | Heygen Coming Soon!)
                    <span class="section-status <?php echo $has_tavus_key ? 'active' : 'inactive'; ?>">
                        <?php echo $has_tavus_key ? 'Tavus API Available' : 'Tavus API Required'; ?>
                    </span>
                </h2>
                <span class="collapse-toggle <?php echo !$has_tavus_key ? 'collapsed' : ''; ?>">−</span>
            </div>
            <div class="card-body <?php echo !$has_tavus_key ? 'collapsed' : ''; ?>" id="google-drive-body">
                <?php if (!$has_tavus_key): ?>
                <div class="alert-box">
                    <p>
                        <strong>Transcript Export requires Tavus API key.</strong> 
                        Please enter your Tavus API key above to enable user transcript export to Google Drive.
                    </p>
                </div>
                <?php endif; ?>
                

                <div style="display: flex; flex-direction: row; gap: 20px;">
  
                <!-- Purpose Description -->
                <div class="alert-box" style="flex: 1; background: linear-gradient(135deg, rgba(56, 177, 197, 0.1) 0%, rgba(218, 146, 44, 0.1) 100%); border-color: #38b1c5; margin-bottom: 25px;">
                    <p style="color: #1e293b;">
                    <strong style="color: #333;">Export Conversation Transcripts</strong><br>
                    This integration automatically exports user conversation transcripts from Tavus to Google Drive. 
                    Perfect for backup, analysis, or compliance purposes. Transcripts contain full conversation logs 
                    between users and your AI avatars.
                    </p>
                </div>

                <!-- Perception Analysis Note -->
                <div class="alert-box" style="flex: 1; background: linear-gradient(135deg, rgba(56, 177, 197, 0.1) 0%, rgba(218, 146, 44, 0.1) 100%); border-color: #38b1c5; margin-bottom: 25px;">
                    <p style="color: #1e293b;">
                    <strong style="color: #333;">Export Perception Analysis Data</strong><br>
                    Perception analysis reveals insights into user interactions with AI avatars by capturing emotions, engagement, and behavior. It helps understand user sentiment, improve avatar performance, and optimize conversations using emotion detection, engagement scores, attention metrics, and interaction quality indicators.
                    </p>
                </div>

                </div>

                
                <table class="form-table">
                    <tr valign="top">
                        <th style="line-height: 1.5;" scope="row">Enable Transcript Export</th>
                        <td>
                            <label class="toggle-label">
                                <div class="toggle-switch">
                                    <input 
                                        type="checkbox" 
                                        id="avatar_studio_enable_google_drive" 
                                        name="avatar_studio_enable_google_drive" 
                                        value="1" 
                                        <?php checked(1, $google_drive_enabled, true); ?> 
                                        class="plugin-input"
                                        <?php echo !$has_tavus_key ? 'disabled' : ''; ?>
                                    />
                                    <span class="toggle-slider"></span>
                                </div>
                                <span>Enable Google Drive Export</span>
                            </label>
                            <p class="description">Enable to automatically export user conversation transcripts to Google Drive</p>
                        </td>
                    </tr>
                </table>

                <div id="google-drive-settings" style="<?php echo !$google_drive_enabled ? 'display:none;' : ''; ?>">
                    <hr class="section-divider">
                    
                    <table class="form-table">
                        <!-- Client ID and Client Secret in One Row -->
                        <tr valign="top">
                            <th style="line-height: 3; width: 120px;" scope="row">OAuth Credentials</th>
                            <td>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                    <!-- Client ID -->
                                    <div>
                                        <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #1f2937;">Client ID</label>
                                        <input 
                                            type="text" 
                                            id="avatar_studio_google_client_id" 
                                            name="avatar_studio_google_client_id" 
                                            value="<?php echo esc_attr(get_option('avatar_studio_google_client_id')); ?>" 
                                            class="plugin-input google-drive-input"
                                            placeholder="Enter Google Client ID"
                                            style="width: 100%;"
                                            <?php echo !$has_tavus_key ? 'disabled' : ''; ?>
                                        />
                                        <p class="description" style="margin-top: 6px;">
                                            OAuth 2.0 Client ID from <a href="https://console.cloud.google.com/apis/credentials" target="_blank">Google Cloud Console →</a>
                                        </p>
                                    </div>

                                    <!-- Client Secret -->
                                    <div>
                                        <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #1f2937;">Client Secret</label>
                                        <div class="input-wrapper" style="display: flex; gap: 8px;">
                                            <input 
                                                type="password" 
                                                id="avatar_studio_google_client_secret" 
                                                name="avatar_studio_google_client_secret" 
                                                value="<?php echo esc_attr(get_option('avatar_studio_google_client_secret')); ?>" 
                                                class="plugin-input google-drive-input"
                                                placeholder="Enter Client Secret"
                                                style="flex: 1;"
                                                <?php echo !$has_tavus_key ? 'disabled' : ''; ?>
                                            />
                                            <button type="button" class="button toggle-visibility" data-target="avatar_studio_google_client_secret" style="white-space: nowrap;" <?php echo !$has_tavus_key ? 'disabled' : ''; ?>>Show</button>
                                        </div>
                                        <p class="description" style="margin-top: 6px;">OAuth 2.0 Client Secret from Google Cloud Console</p>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        <tr valign="top">
                            <th style="line-height: 3;" scope="row">Redirect URI</th>
                            <td>
                                <div class="code-display">
                                    <?php echo admin_url('admin.php?page=avatar_studio_sessions'); ?>
                                </div>
                                <div class="alert-box" style="margin-top: 12px;">
                                    <p>
                                        <strong>Important:</strong> Add this exact URL to your "Authorized redirect URIs" 
                                        in the Google Cloud Console to enable OAuth authentication for transcript export.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </table>

                    <div class="setup-instructions">
                        <h3>Setup Instructions for Transcript Export</h3>

                        <div class="two-col">
                            <div class="col">
                                <ol start="1">
                                    <li>Go to <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a> and select your project (or create a new one)</li>
                                    <li>Navigate to API Library and <strong>enable the Google Drive API</strong></li>
                                    <li>Go to APIs & Services → Credentials</li>
                                    <li>Create a new <strong>OAuth 2.0 Client ID</strong> (Web application)</li>
                                </ol>
                            </div>

                            <div id="second-col" class="col">
                                <ol start="5">
                                    <li>Add the Redirect URI shown above to your Authorized redirect URIs</li>
                                    <li>Copy your Client ID and Client Secret into the fields above</li>
                                    <li>Save your settings, then go to the Sessions page to connect Google Drive</li>
                                    <li><strong>User transcripts will automatically export</strong> to your connected Google Drive</li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    <!-- Auto Export Settings -->
                    <div class="auto-export-section">
                        <h3>Automated Transcript Export Settings</h3>
                        <p class="description" style="margin-bottom: 20px;">Configure automatic user transcript export to Google Drive at scheduled intervals.</p>
                        
                        <table class="form-table">
                            <!-- Auto Export and Export Frequency in One Row -->
                            <tr valign="top">
                                <th style="line-height: 1.5; width: 120px;" scope="row">Export Configuration</th>
                                <td>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start;">
                                        <!-- Auto Export Toggle -->
                                        <div>
                                            <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #1f2937;">Auto Export</label>
                                            <label class="toggle-label">
                                                <div class="toggle-switch">
                                                    <input 
                                                        type="checkbox" 
                                                        id="avatar_auto_export_enabled"
                                                        name="avatar_auto_export_enabled" 
                                                        value="1" 
                                                        <?php checked($export_enabled, 1); ?>
                                                        class="plugin-input auto-export-input"
                                                        <?php echo !$has_tavus_key ? 'disabled' : ''; ?>
                                                    />
                                                    <span class="toggle-slider"></span>
                                                </div>
                                                <span>Enable Automatic Transcript Export</span>
                                            </label>
                                            <p class="description" style="margin-top: 6px;">Automatically export all user conversation transcripts to Google Drive at scheduled intervals</p>
                                        </div>
                                        
                                        <!-- Export Frequency -->
                                        <div>
                                            <label for="avatar_auto_export_interval" style="display: block; font-weight: 600; margin-bottom: 8px; color: #1f2937;">Export Frequency</label>
                                            <select 
                                                name="avatar_auto_export_interval" 
                                                id="avatar_auto_export_interval"
                                                class="plugin-input auto-export-input"
                                                style="width: 100%;"
                                                <?php echo !$has_tavus_key ? 'disabled' : ''; ?>
                                            >
                                                <option value="every_5_minutes" <?php selected($export_interval, 'every_5_minutes'); ?>>Every 5 Minutes</option>
                                                <option value="every_15_minutes" <?php selected($export_interval, 'every_15_minutes'); ?>>Every 15 Minutes</option>
                                                <option value="hourly" <?php selected($export_interval, 'hourly'); ?>>Every Hour</option>
                                                <option value="twicedaily" <?php selected($export_interval, 'twicedaily'); ?>>Twice Daily</option>
                                                <option value="daily" <?php selected($export_interval, 'daily'); ?>>Daily</option>
                                            </select>
                                            <p class="description" style="margin-top: 6px;">Choose how often user transcripts should be automatically exported</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </table>
                        
                        <!-- Transcript Information -->
                        <!-- <div class="alert-box" style="margin-top: 20px; background: linear-gradient(135deg, rgba(56, 177, 197, 0.08) 0%, rgba(218, 146, 44, 0.08) 100%);">
                            <p style="color: #1e293b;">
                                <strong style="color: #333;">What gets exported?</strong><br>
                                Each exported transcript includes the complete conversation log between a user and your AI avatar, 
                                including timestamps, user messages, avatar responses, and metadata. Files are organized by date 
                                and session ID for easy reference.
                            </p>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>

        <?php submit_button('Save All Settings', 'primary', 'submit', false); ?>
    </form>

    <!-- Footer Links -->
    <div class="footer-links">
        <div class="footer-links-container">
            <a href="https://avanew.ai/privacy-policy/" target="_blank" class="footer-link">
                <span class="link-text">Privacy Policy</span>
            </a>
            
            <a href="https://avanew.ai/interactivestudio/terms-and-conditions/" target="_blank" class="footer-link">
                <span class="link-text">Terms of Service</span>
            </a>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function () {
    // Get Tavus API key input and Google Drive section
    const tavusApiKeyInput = document.getElementById('avatar_studio_tavus_api_key');
    const googleDriveSection = document.getElementById('google-drive-section');
    const googleDriveCheckbox = document.getElementById('avatar_studio_enable_google_drive');
    const googleDriveSettings = document.getElementById('google-drive-settings');
    
    // Function to check Tavus API key and toggle Google Drive section
    function toggleGoogleDriveSection() {
        const hasTavusKey = tavusApiKeyInput.value.trim() !== '';
        
        if (googleDriveSection) {
            if (hasTavusKey) {
                googleDriveSection.classList.remove('disabled');
                // Enable all inputs within Google Drive section
                document.querySelectorAll('#google-drive-section input, #google-drive-section select, #google-drive-section button').forEach(input => {
                    input.disabled = false;
                });
                // Auto-enable Google Drive if it was previously enabled
                
            } else {
                googleDriveSection.classList.add('disabled');
                // Disable all inputs within Google Drive section
                document.querySelectorAll('#google-drive-section input, #google-drive-section select, #google-drive-section button').forEach(input => {
                    input.disabled = true;
                });
                // Auto-disable Google Drive
                if (googleDriveCheckbox) {
                    googleDriveCheckbox.checked = false;
                    toggleGoogleDriveSettings();
                }
            }
        }
    }
    
    // Function to toggle Google Drive settings visibility
    function toggleGoogleDriveSettings() {
        if (googleDriveSettings && googleDriveCheckbox) {
            googleDriveSettings.style.display = googleDriveCheckbox.checked ? 'block' : 'none';
        }
    }
    
    // Initialize on page load
    toggleGoogleDriveSection();
    toggleGoogleDriveSettings();
    
    // Listen for changes in Tavus API key
    if (tavusApiKeyInput) {
        tavusApiKeyInput.addEventListener('input', toggleGoogleDriveSection);
        tavusApiKeyInput.addEventListener('change', toggleGoogleDriveSection);
    }
    
    // Listen for changes in Google Drive checkbox
    if (googleDriveCheckbox) {
        googleDriveCheckbox.addEventListener('change', toggleGoogleDriveSettings);
    }

    // Initialize collapsed states on page load
    document.querySelectorAll('.card-header.collapsible').forEach(function(header) {
        const targetId = header.getAttribute('data-target');
        const body = document.getElementById(targetId);
        const toggle = header.querySelector('.collapse-toggle');
        
        if (body && body.classList.contains('collapsed')) {
            header.classList.add('collapsed-state');
            if (toggle) {
                toggle.classList.add('collapsed');
            }
        }
    });

    // Handle expand/collapse functionality
    document.querySelectorAll('.card-header.collapsible').forEach(function(header) {
        header.addEventListener('click', function(e) {
            // Prevent collapse when clicking on child elements like toggles
            if (e.target.closest('.toggle-switch') || e.target.closest('.toggle-label')) {
                return;
            }
            
            // Don't allow collapsing if section is disabled
            if (this.closest('.conditional-section.disabled')) {
                return;
            }
            
            const targetId = this.getAttribute('data-target');
            const body = document.getElementById(targetId);
            const toggle = this.querySelector('.collapse-toggle');
            
            if (body && toggle) {
                body.classList.toggle('collapsed');
                toggle.classList.toggle('collapsed');
                this.classList.toggle('collapsed-state');
            }
        });
    });

    // Handle password visibility toggles
    document.querySelectorAll('.toggle-visibility').forEach(function (button) {
        button.addEventListener('click', function () {
            if (this.disabled) return;
            
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);

            if (!input) return;

            // Check current state
            const isMasked = input.classList.contains('masked') || input.type === 'password';
            
            if (isMasked) {
                // Show the content
                input.type = 'text';
                input.classList.remove('masked');
                this.textContent = 'Hide';
            } else {
                // Hide the content
                if (input.type === 'password') {
                    input.type = 'password';
                }
                input.classList.add('masked');
                this.textContent = 'Show';
            }
        });
    });

    // Handle main plugin enable/disable
    const enableCheckbox = document.getElementById('avatar_studio_enable');
    const allInputs = document.querySelectorAll('.plugin-input');
    const allToggleButtons = document.querySelectorAll('.toggle-visibility');

    function toggleAllInputs() {
        const enabled = enableCheckbox.checked;
        
        allInputs.forEach(input => {
            if (input.id !== 'avatar_studio_enable') {
                input.disabled = !enabled;
            }
        });
        
        allToggleButtons.forEach(btn => {
            btn.disabled = !enabled;
        });
        
        // Collapse/Expand API sections based on plugin state
        const apiSections = [
            { body: 'tavus-api-body', header: '[data-target="tavus-api-body"]' },
            { body: 'heygen-api-body', header: '[data-target="heygen-api-body"]' }
        ];
        
        apiSections.forEach(section => {
            const body = document.getElementById(section.body);
            const header = document.querySelector(section.header);
            
            if (body && header) {
                if (enabled) {
                    // Plugin enabled - expand API sections
                    body.classList.remove('collapsed');
                    header.classList.remove('collapsed-state');
                    header.querySelector('.collapse-toggle')?.classList.remove('collapsed');
                } else {
                    // Plugin disabled - collapse API sections
                    body.classList.add('collapsed');
                    header.classList.add('collapsed-state');
                    header.querySelector('.collapse-toggle')?.classList.add('collapsed');
                }
            }
        });
        
        // Re-check Google Drive settings
        if (enabled) {
            toggleGoogleDriveSection();
            toggleGoogleDriveSettings();
        } else {
            if (googleDriveSettings) {
                googleDriveSettings.style.display = 'none';
            }
        }
    }

    if (enableCheckbox) {
        toggleAllInputs(); // Initialize on page load
        enableCheckbox.addEventListener('change', toggleAllInputs);
}
});
</script>
<?php
}

    // Sessions page
    function avatar_studio_sessions_page()
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'avatar_studio_sessions';
    $user_info_table = $wpdb->prefix . 'avatar_studio_user_info';
    
    // Handle Google Drive authentication
    if (isset($_GET['code']) && isset($_GET['state']) && $_GET['state'] === 'avatar_studio_auth') {
        avatar_studio_handle_google_callback($_GET['code']);
    }
    
    // Handle export action
    if (isset($_POST['export_transcripts']) && check_admin_referer('avatar_studio_export_transcripts')) {
        avatar_studio_export_all_transcripts();
    }
    
    // Handle retry single export
    if (isset($_GET['retry_export']) && check_admin_referer('avatar_studio_retry_export_' . $_GET['retry_export'], 'nonce')) {
        avatar_studio_retry_export($_GET['retry_export']);
    }
    
    // Pagination setup
    $per_page = 10;
    $current_page = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;
    $offset = ($current_page - 1) * $per_page;
    
    // Get total count
    $total_sessions = $wpdb->get_var("SELECT COUNT(*) FROM {$table_name}");
    $total_pages = ceil($total_sessions / $per_page);
    
    // Get sessions from database with pagination
    $sessions = $wpdb->get_results($wpdb->prepare(
        "SELECT * FROM {$table_name} ORDER BY created_at DESC LIMIT %d OFFSET %d",
        $per_page,
        $offset
    ));
    
    $google_connected = get_option('avatar_studio_google_access_token') ? true : false;
    ?>
    <style>
    /* Add these new styles for pagination */
    .pagination-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        background: linear-gradient(135deg, rgba(56, 177, 197, 0.03) 0%, rgba(218, 146, 44, 0.03) 100%);
        border-top: 2px solid transparent;
        background-image: linear-gradient(135deg, rgba(56, 177, 197, 0.03) 0%, rgba(218, 146, 44, 0.03) 100%), linear-gradient(90deg, transparent 0%, #38b1c5 0%, #da922c 100%, transparent 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        gap: 20px;
    }

    .pagination-info {
        color: #fff;
        font-size: 14px;
        font-weight: 500;
    }

    .pagination-info strong {
        color: #fff;
        font-weight: 700;
    }

    .pagination-links {
        display: flex;
        gap: 8px;
        align-items: center;
        flex-wrap: wrap;
    }

    .page-btn {
        padding: 8px 14px;
        border-radius: 6px;
        background: #fff;
        color: #374151;
        text-decoration: none;
        transition: all 0.3s ease;
        border: 2px solid transparent;
        background-origin: border-box;
        background-clip: padding-box, border-box;
        font-weight: 600;
        font-size: 13px;
        white-space: nowrap;
    }

    .page-btn:hover {
        color: #333;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(56, 177, 197, 0.3);
    }

    .page-current {
        font-weight: 600;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 13px;
        background: transparent;
        color: #fff;
        border: 2px solid transparent;
    }

    .page-jump-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: #fff;
        border-radius: 8px;
        border: 2px solid transparent;
        background-origin: border-box;
        background-clip: padding-box, border-box;
    }

    .page-jump-label {
        font-size: 13px;
        color: #6b7280;
        font-weight: 600;
        white-space: nowrap;
    }

    .page-jump-input {
        width: 60px;
        padding: 6px 10px;
        border: 2px solid #e5e7eb;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        text-align: center;
        transition: all 0.2s ease;
        background: white;
    }

    .page-jump-input:focus {
        outline: none;
        border: 2px solid transparent;
        background-image: 
            linear-gradient(white, white),
            linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        box-shadow: 0 0 0 3px rgba(56, 177, 197, 0.1);
    }

    .page-jump-btn {
        padding: 6px 14px;
        border-radius: 6px;
        background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        color: white;
        border: none;
        font-weight: 600;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.3s ease;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(56, 177, 197, 0.3);
    }

    .page-jump-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(56, 177, 197, 0.4);
    }

    /* Update responsive styles */
    @media (max-width: 768px) {
        .pagination-wrapper {
            flex-direction: column;
            gap: 16px;
            padding: 16px;
        }

        .pagination-links {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
        }

        .page-jump-wrapper {
            width: 100%;
            justify-content: center;
        }
    }

    /* Rest of your existing CSS remains the same */
    /* Main Wrapper */
    .avatar-sessions-wrapper {
        max-width: 98%;
        margin: 20px 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, sans-serif;
    }

    /* Header */
    .avatar-sessions-header {
        background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        color: white;
        padding: 32px 40px;
        border-radius: 12px;
        margin-bottom: 24px;
        box-shadow: 0 4px 20px rgba(56, 177, 197, 0.3);
        position: relative;
        overflow: hidden;
    }

    .avatar-sessions-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
        pointer-events: none;
    }

    .avatar-sessions-header h1 {
        font-size: 32px;
        font-weight: 700;
        margin: 0 0 8px 0;
        color: white;
        display: flex;
        align-items: center;
        gap: 12px;
        position: relative;
        z-index: 1;
    }

    .avatar-sessions-header p {
        margin: 0;
        font-size: 15px;
        opacity: 0.95;
        color: white;
        position: relative;
        z-index: 1;
    }

    /* Google Drive Card */
    .google-drive-card {
        background: white;
        border: 2px solid transparent;
        background-image: 
            linear-gradient(white, white),
            linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        border-radius: 12px;
        padding: 32px;
        margin-bottom: 24px;
        box-shadow: 0 4px 15px rgba(56, 177, 197, 0.1);
        transition: all 0.3s ease;
    }

    .google-drive-card:hover {
        box-shadow: 0 8px 25px rgba(56, 177, 197, 0.15);
        transform: translateY(-2px);
    }

    .drive-header {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 24px;
        padding-bottom: 20px;
        border-bottom: 2px solid transparent;
        background-image: 
            linear-gradient(white, white),
            linear-gradient(90deg, #38b1c5 0%, #da922c 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        background-size: 100% 2px;
        background-position: 0 100%;
        background-repeat: no-repeat;
    }

    .drive-header h2 {
        margin: 0;
        font-size: 22px;
        line-height: 28px;
        font-weight: 700;
        background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    /* Connected State */
    .drive-row {
        display: flex;
        gap: 20px;
        align-items: stretch;
    }

    .drive-connected-state,
    .drive-actions {
        flex: 1;
    }

    .drive-actions {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    @media (max-width: 1024px) {
        .drive-row {
            flex-direction: column;
        }

        .drive-actions {
            align-items: flex-start;
            justify-content: flex-start;
            text-align: left;
        }
    }

    .drive-connected-state {
        background: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 24px;
    }

    .drive-status-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 10px;
    }

    .status-icon {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .drive-status-header strong {
        -webkit-background-clip: text;
        background-clip: text;
        font-size: 16px;
        font-weight: 700;
        color: #1e293b;
    }

    .drive-connected-state p {
        margin: 0;
        color: #1e293b;
        font-size: 14px;
        line-height: 1.6;
    }

    .drive-info-box {
        margin-top: 16px;
        display: flex;
        align-items: start;
        gap: 10px;
    }

    .drive-info-box svg {
        flex-shrink: 0;
        margin-top: 2px;
    }

    .drive-info-box p {
        margin: 0;
        color: #1e5dd1ff;
        font-size: 13px;
    }

    /* Disconnected State */
    .drive-disconnected-state {
        text-align: center;
        padding: 40px 20px;
    }

    .drive-icon-wrapper {
        background: linear-gradient(135deg, rgba(56, 177, 197, 0.1) 0%, rgba(218, 146, 44, 0.1) 100%);
        border: 3px solid transparent;
        background-image: 
            linear-gradient(135deg, rgba(56, 177, 197, 0.1) 0%, rgba(218, 146, 44, 0.1) 100%),
            linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        border-radius: 50%;
        width: 96px;
        height: 96px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 24px;
        box-shadow: 0 4px 20px rgba(56, 177, 197, 0.2);
    }

    .drive-disconnected-state h3 {
        margin: 0 0 12px 0;
        font-size: 20px;
        font-weight: 700;
        background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .drive-disconnected-state p {
        margin: 0 0 28px 0;
        color: #6b7280;
        font-size: 15px;
        max-width: 480px;
        margin-left: auto;
        margin-right: auto;
        line-height: 1.6;
    }

    /* Buttons */
    .drive-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }

    .btn-primary {
        background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 12px 24px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(56, 177, 197, 0.4);
        text-decoration: none;
        position: relative;
        overflow: hidden;
    }

    .btn-primary::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        transition: left 0.5s ease;
    }

    .btn-primary:hover::before {
        left: 100%;
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(56, 177, 197, 0.5);
        color: white;
        text-decoration: none;
    }

    .btn-google {
        background: linear-gradient(135deg, #4285f4 0%, #357ae8 100%);
        border: none;
        padding: 14px 28px;
        font-size: 15px;
        box-shadow: 0 4px 15px rgba(66, 133, 244, 0.4);
    }

    .btn-google:hover {
        background: linear-gradient(135deg, #357ae8 0%, #2a63c8 100%);
        box-shadow: 0 6px 20px rgba(66, 133, 244, 0.5);
    }

    .btn-disconnect {
        background: white;
        color: #dc2626;
        border: 2px solid transparent;
        background-image: 
            linear-gradient(white, white),
            linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        border-radius: 8px;
        padding: 10px 20px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        text-decoration: none;
    }

    .btn-disconnect:hover {
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        color: white;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
        text-decoration: none;
    }

    .drive-security-note {
        margin: 24px 0 0 0;
        color: #9ca3af;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
    }

    /* Sessions Section */
    .sessions-section {
        background: white;
        border: 2px solid transparent;
        background-image: 
            linear-gradient(white, white),
            linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(56, 177, 197, 0.1);
    }

    .sessions-header {
        background: linear-gradient(135deg, rgba(56, 177, 197, 0.08) 0%, rgba(218, 146, 44, 0.08) 100%);
        padding: 20px 28px;
        position: relative;
    }

    .sessions-header::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #38b1c5 0%, #da922c 100%);
    }

    .sessions-header h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    /* Table */
    .sessions-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
    }

    .sessions-table thead {
        background: linear-gradient(135deg, rgba(56, 177, 197, 0.05) 0%, rgba(218, 146, 44, 0.05) 100%);
    }

    .sessions-table th {
        padding: 16px 20px;
        text-align: center;
        font-size: 12px;
        font-weight: 700;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 2px solid transparent;
        background-image: 
            linear-gradient(135deg, rgba(56, 177, 197, 0.05) 0%, rgba(218, 146, 44, 0.05) 100%),
            linear-gradient(90deg, rgba(56, 177, 197, 0.3) 0%, rgba(218, 146, 44, 0.3) 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        background-size: 100% 100%, 100% 2px;
        background-position: 0 0, 0 100%;
        background-repeat: no-repeat;
        white-space: nowrap;
    }

    .sessions-table tbody tr {
        transition: all 0.3s ease;
        border-bottom: 1px solid #f3f4f6;
    }

    .sessions-table tbody tr:hover {
        background: linear-gradient(135deg, rgba(56, 177, 197, 0.03) 0%, rgba(218, 146, 44, 0.03) 100%);
        transform: scale(1.001);
    }

    .sessions-table tbody tr:last-child {
        border-bottom: none;
    }

    .sessions-table td {
        padding: 16px 20px;
        color: #374151;
        font-size: 14px;
        vertical-align: middle;
        text-align: center;
    }

    .sessions-table code {
        background: linear-gradient(135deg, rgba(56, 177, 197, 0.1) 0%, rgba(218, 146, 44, 0.1) 100%);
        border: 2px solid transparent;
        background-image: 
            linear-gradient(135deg, rgba(56, 177, 197, 0.1) 0%, rgba(218, 146, 44, 0.1) 100%),
            linear-gradient(135deg, rgba(56, 177, 197, 0.4) 0%, rgba(218, 146, 44, 0.4) 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        -webkit-background-clip: text;
        background-clip: text;
        font-weight: 600;
        font-family: 'Monaco', 'Courier New', monospace;
        color: royalblue;
    }

    /* Copy Button Styles */
    .copy-id-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .copy-btn {
        background: white;
        border: 2px solid transparent;
        background-image: 
            linear-gradient(white, white),
            linear-gradient(135deg, rgba(56, 177, 197, 0.5) 0%, rgba(218, 146, 44, 0.5) 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        border-radius: 4px;
        padding: 4px 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .copy-btn:hover {
        background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        transform: scale(1.05);
        box-shadow: 0 2px 8px rgba(56, 177, 197, 0.3);
    }

    .copy-btn:hover svg {
        stroke: white;
    }

    .copy-btn.copied {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    .copy-btn.copied svg {
        stroke: white;
    }

    /* Status Badges */
    .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 500;
        white-space: nowrap;
    }

    .status-completed {
        background: linear-gradient(135deg, rgba(56, 177, 197, 0.15) 0%, rgba(218, 146, 44, 0.15) 100%);
        border: 2px solid transparent;
        background-image: 
            linear-gradient(135deg, rgba(56, 177, 197, 0.15) 0%, rgba(218, 146, 44, 0.15) 100%),
            linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .status-pending {
        background: #fef3c7;
        color: #92400e;
    }

    .status-exported,
    .status-processed {
        background: linear-gradient(135deg, rgba(56, 177, 197, 0.15) 0%, rgba(218, 146, 44, 0.15) 100%);
        border: 2px solid transparent;
        background-image: 
            linear-gradient(135deg, rgba(56, 177, 197, 0.15) 0%, rgba(218, 146, 44, 0.15) 100%),
            linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        -webkit-background-clip: text;
        background-clip: text;
        color: green;
    }

    .status-failed {
        background: #fee2e2;
        color: #991b1b;
    }

    .status-not-exported,
    .status-not-processed {
        background: #f3f4f6;
        color: #6b7280;
    }

    .status-unavailable {
        background: #fef3c7;
        color: #991b1b;
    }

    /* Action Button */
    .btn-export {
        background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        color: white;
        border: none;
        border-radius: 6px;
        padding: 6px 12px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-block;
        box-shadow: 0 2px 8px rgba(56, 177, 197, 0.3);
    }

    .btn-export:hover:not(.disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(56, 177, 197, 0.4);
        color: white;
        text-decoration: none;
    }

    .btn-export:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(56, 177, 197, 0.4);
        color: white;
        text-decoration: none;
    }

    .btn-export.disabled {
        background: #e5e7eb;
        color: #9ca3af;
        filter: blur(0.5px);
        cursor: not-allowed;
        opacity: 0.5;
        pointer-events: none;
        box-shadow: none;
    }

    .btn-user-details {
        display: none !important;
        background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        color: #fff;
        border: none;
        border-radius: 6px;
        padding: 6px 12px;
        font-size: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-left: 2px;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        height: 38px;
        box-shadow: 0 2px 8px rgba(56, 177, 197, 0.3);
    }

    .btn-user-details svg {
        transition: transform 0.3s ease, stroke 0.3s ease;
    }

    .btn-user-details:hover {
        background: linear-gradient(135deg, #2a8b9a 0%, #c17d23 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(56, 177, 197, 0.4);
    }

    .btn-user-details:hover svg {
        transform: scale(1.1);
    }

    .btn-user-details:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(56, 177, 197, 0.3);
    }

    /* Different disabled states for visual feedback */
    .btn-export.disabled.drive-not-connected {
        background: linear-gradient(135deg, #cccccc 0%, #999999 100%);
        color: #666666;
    }

    .btn-export.disabled.time-restricted {
        background: linear-gradient(135deg, #ffd166 0%, #ffb347 100%);
        color: #333333;
    }

    .btn-export.disabled.already-exported {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: #ffffff;
        opacity: 0.7;
    }

    /* Modal Styles */
    .modal-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 999999;
        animation: fadeIn 0.2s ease;
    }

    .modal-overlay.active {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .modal-content {
        background: white;
        border: 3px solid transparent;
        background-image: 
            linear-gradient(white, white),
            linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        border-radius: 12px;
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(56, 177, 197, 0.3);
        animation: slideUp 0.3s ease;
        position: relative;
    }

    @keyframes slideUp {
        from {
            transform: translateY(30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .modal-header {
        background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        color: white;
        padding: 24px 32px;
        border-radius: 10px 10px 0 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        overflow: hidden;
    }

    .modal-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
        pointer-events: none;
    }

    .modal-header h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 10px;
        color: #fff;
        position: relative;
        z-index: 1;
    }

    .modal-close {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        position: relative;
        z-index: 1;
    }

    .modal-close:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.05);
    }

    .modal-body {
        padding: 32px;
    }

    .user-detail-row {
        margin-bottom: 15px;
        padding-bottom: 15px;
        border-bottom: 2px solid transparent;
        background-image: 
            linear-gradient(white, white),
            linear-gradient(90deg, rgba(56, 177, 197, 0.2) 0%, rgba(218, 146, 44, 0.2) 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        background-size: 100% 100%, 100% 2px;
        background-position: 0 0, 0 100%;
        background-repeat: no-repeat;
    }

    .user-detail-row:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }

    .user-detail-label {
        font-size: 12px;
        font-weight: 700;
        background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
    }

    .user-detail-value {
        font-size: 15px;
        color: #1f2937;
        font-weight: 500;
    }

    .user-detail-value.empty {
        color: #9ca3af;
        font-style: italic;
    }

    .no-user-data {
        text-align: center;
        padding: 40px 20px;
        color: #9ca3af;
    }

    .no-user-data svg {
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
        opacity: 0.5;
    }

    .no-user-data p {
        margin: 0;
        font-size: 15px;
        font-weight: 500;
    }

    /* Empty State */
    .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #9ca3af;
    }

    .empty-state-icon {
        font-size: 36px;
        margin-bottom: 16px;
        opacity: 0.5;
    }

    .empty-state p {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        color: #6b7280;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .avatar-sessions-wrapper {
            margin: 10px;
        }

        .avatar-sessions-header {
            padding: 24px;
        }

        .avatar-sessions-header h1 {
            font-size: 24px;
        }

        .google-drive-card {
            padding: 24px;
        }

        .drive-actions {
            flex-direction: column;
        }

        .drive-actions button,
        .drive-actions a {
            width: 100%;
            justify-content: center;
        }

        .sessions-section {
            overflow-x: auto;
        }

        .sessions-table {
            min-width: 1200px;
        }

        .modal-content {
            width: 95%;
            margin: 10px;
        }

        .modal-body {
            padding: 24px;
        }
    }
    </style>

    <div class="avatar-sessions-wrapper">
        <!-- Header -->
        <div class="avatar-sessions-header">
            <h1>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                Avatar Sessions
            </h1>
            <p>Manage your avatar conversations and export transcripts to Google Drive</p>
        </div>

        <!-- Google Drive Integration Card -->
        <div class="google-drive-card">
            <div class="drive-header">
                <svg width="40" height="40" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                    <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                    <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
                    <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                    <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                    <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                    <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                </svg>
                <h2>Google Drive Integration</h2>
            </div>

            <?php if ($google_connected): ?>
                <!-- Connected State -->
                <div class="drive-row">
                    <div class="drive-connected-state">
                        <div class="drive-status-header">
                            <div class="status-icon">
                                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 10l2.5 2.5L13 7" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <strong>Google Drive Connected</strong>
                        </div>
                        <p>Your account is connected and ready to export transcripts securely to your Google Drive.</p>
                        
                        <div class="drive-info-box">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#0369a1" stroke-width="2"/>
                                <path d="M12 16v-4M12 8h.01" stroke="#0369a1" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            <p>Please note: Google Drive exports (transcripts and perception analysis) may take a short while to appear after a session ends.</p>
                        </div>
                    </div>

                    <div class="drive-actions">
                        <form method="post" action="" style="margin: 0;">
                            <?php wp_nonce_field('avatar_studio_export_transcripts'); ?>
                            <button type="submit" name="export_transcripts" class="btn-primary">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                Export All Transcripts
                            </button>
                        </form>

                        <a href="<?php echo wp_nonce_url(admin_url('admin-post.php?action=avatar_studio_disconnect_google'), 'avatar_studio_disconnect_google'); ?>" 
                        class="btn-disconnect" 
                        onclick="return confirm('Are you sure you want to disconnect Google Drive? You will need to reconnect to export transcripts again.');">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Disconnect Drive
                        </a>
                    </div>
                </div>

            <?php else: ?>
                <!-- Disconnected State -->
                <div class="drive-disconnected-state">
                    <div class="drive-icon-wrapper">
                        <svg width="48" height="48" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                            <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                            <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
                            <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                            <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                            <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                            <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                        </svg>
                    </div>
                    
                    <h3>Connect Your Google Drive</h3>
                    <p>Connect your Google Drive account to automatically export and securely backup conversation transcripts and perception analysis to your drive.</p>

                    <a href="<?php echo avatar_studio_get_google_auth_url(); ?>" class="btn-primary btn-google">
                        <svg width="20" height="20" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="white"/>
                            <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="white" opacity="0.9"/>
                            <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="white" opacity="0.9"/>
                            <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="white"/>
                        </svg>
                        Connect with Google
                    </a>

                    <div class="drive-security-note">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        We only request access to create files in your Google Drive
                    </div>
                </div>
            <?php endif; ?>
        </div>

        <!-- Sessions Table -->
        <div class="sessions-section">
            <div class="sessions-header">
                <h2>Sessions Overview</h2>
            </div>

            <?php if (empty($sessions)): ?>
                <div class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <p>No sessions found yet. Your avatar conversations will appear here.</p>
                </div>
            <?php else: ?>
                <table class="sessions-table">
                    <thead>
                        <tr>
                            <th>Session ID</th>
                            <th>Avatar ID</th>
                            <th>User ID</th>
                            <th>Created</th>
                            <th>Duration</th>
                            <th>Status</th>
                            <th>Transcript</th>
                            <th>Perception</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($sessions as $session): ?>
                            <tr>
                                <td>
                                    <div class="copy-id-wrapper">
                                        <code><?php echo esc_html(substr($session->session_id, 0, 12)); ?>...</code>
                                        <button class="copy-btn" onclick="copyToClipboard('<?php echo esc_js($session->session_id); ?>', this)" title="Copy Session ID">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                                <td><?php echo esc_html($session->avatar_id); ?></td>
                                <td><?php echo esc_html($session->user_id); ?></td>
                                <td><?php echo esc_html(date('M j, Y g:i A', strtotime($session->created_at))); ?></td>
                                <td><?php echo esc_html($session->duration ?? 'N/A'); ?></td>
                                
                                <!-- Session Status -->
                                <td>
                                    <?php 
                                    $status_class = $session->status === 'completed' ? 'status-completed' : 'status-pending';
                                    $status_icon = $session->status === 'completed' 
                                        ? '<svg class="status-icon" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.2"/><path d="M6 10l2.5 2.5L14 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
                                        : '';
                                    ?>
                                    <span class="status-badge <?php echo $status_class; ?>">
                                        <?php echo $status_icon; ?>
                                        <?php echo esc_html(ucfirst($session->status)); ?>
                                    </span>
                                </td>

                                <!-- Transcript Status -->
                                <td>
                                    <?php
                                    $export_status = $session->export_status ?? 'not_exported';
                                    $export_class = 'status-' . str_replace('_', '-', $export_status);
                                    ?>
                                    <span class="status-badge <?php echo $export_class; ?>">
                                        <?php echo esc_html(ucfirst(str_replace('_', ' ', $export_status))); ?>
                                    </span>
                                </td>

                                <!-- Perception Status -->
                                <td>
                                    <?php
                                    $perception_status = $session->perception_status ?? 'not_processed';
                                    $perception_class = 'status-' . str_replace('_', '-', $perception_status);
                                    ?>
                                    <span class="status-badge <?php echo $perception_class; ?>">
                                        <?php echo esc_html(ucfirst(str_replace('_', ' ', $perception_status))); ?>
                                    </span>
                                </td>

                                <!-- Actions -->
                                <td>
                                    <?php 
                                    $btn_text = ($export_status === 'failed') ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" 
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                                        <path d="M3 3v5h5"></path>
                                    </svg>' : 'Export';
                                    
                                    // Check if one hour has passed
                                    $created_timestamp = strtotime($session->created_at);
                                    $current_timestamp = current_time('timestamp');
                                    $time_elapsed = $current_timestamp - $created_timestamp;
                                    $is_disabled = $time_elapsed < 3600;
                                    $remaining_minutes = $is_disabled ? ceil((3600 - $time_elapsed) / 60) : 0;
                                    
                                    // Determine if button should be enabled
                                    $is_export_enabled = $google_connected && $export_status !== 'exported';
                                    $is_fully_disabled = !$google_connected || $is_disabled || $export_status === 'exported';
                                    
                                    // Create appropriate title/tooltip
                                    if (!$google_connected) {
                                        $tooltip = 'Connect Google Drive to enable export';
                                    } elseif ($export_status === 'exported') {
                                        $tooltip = 'Already exported to Google Drive';
                                    } elseif ($is_disabled) {
                                        $tooltip = 'Export available in ' . $remaining_minutes . ' min';
                                    } else {
                                        $tooltip = 'Export to Google Drive';
                                    }
                                    ?>
                                    
                                    <!-- Export Button - Always visible but with different states -->
                                    <a href="<?php echo $is_export_enabled && !$is_disabled ? wp_nonce_url(admin_url('admin.php?page=avatar_studio_sessions&retry_export=' . $session->id), 'avatar_studio_retry_export_' . $session->id, 'nonce') : '#'; ?>" 
                                    class="btn-export <?php echo $is_fully_disabled ? 'disabled' : ''; ?>"
                                    title="<?php echo $tooltip; ?>"
                                    <?php if ($is_fully_disabled): ?>
                                        onclick="return false;"
                                        style="opacity: 0.5; filter: blur(0.5px); cursor: not-allowed;"
                                    <?php endif; ?>>
                                        <?php echo $btn_text; ?>
                                    </a>
                                    
                                    <!-- User Details Button -->
                                    <?php
                                    // Fetch user data based on session_id (conversation_id in user_info table)
                                    $user_data = $wpdb->get_row($wpdb->prepare(
                                        "SELECT * FROM {$user_info_table} WHERE conversation_id = %s",
                                        $session->session_id
                                    ));
                                    ?>
                                    <button class="btn-user-details" onclick="showUserDetails(<?php echo esc_attr($session->id); ?>)">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" 
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    </button>
                                    
                                    <!-- Hidden user data for JavaScript -->
                                    <script type="application/json" id="user-data-<?php echo esc_attr($session->id); ?>">
                                        <?php echo wp_json_encode($user_data); ?>
                                    </script>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>

                <!-- Pagination -->
                <div class="pagination-wrapper">
                    <div class="pagination-info">
                        Showing <strong><?php echo ($current_page - 1) * $per_page + 1; ?>-<?php echo min($current_page * $per_page, $total_sessions); ?></strong> of <strong><?php echo $total_sessions; ?></strong> records
                    </div>
                    
                    <div class="pagination-links">
                        <?php if ($current_page > 1): ?>
                            <a href="<?php echo add_query_arg('paged', 1); ?>" class="page-btn">« First</a>
                            <a href="<?php echo add_query_arg('paged', $current_page - 1); ?>" class="page-btn">‹ Previous</a>
                        <?php endif; ?>

                        <span class="page-current">Page <?php echo $current_page; ?> of <?php echo $total_pages; ?></span>

                        <?php if ($current_page < $total_pages): ?>
                            <a href="<?php echo add_query_arg('paged', $current_page + 1); ?>" class="page-btn">Next ›</a>
                            <a href="<?php echo add_query_arg('paged', $total_pages); ?>" class="page-btn">Last »</a>
                        <?php endif; ?>
                    </div>
                    <div class="page-jump-wrapper">
                            <span class="page-jump-label">Go to page:</span>
                            <input type="number" class="page-jump-input" id="pageJumpInput" min="1" max="<?php echo $total_pages; ?>" value="<?php echo $current_page; ?>">
                            <button class="page-jump-btn" onclick="jumpToPage()">Go</button>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- User Details Modal -->
    <div class="modal-overlay" id="userDetailsModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                    User Details
                </h2>
                <button class="modal-close" onclick="closeUserDetails()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body" id="userDetailsContent">
                <!-- Content will be populated by JavaScript -->
            </div>
        </div>
    </div>

    <script>
    function copyToClipboard(text, button) {
        // Create temporary textarea
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        
        // Select and copy
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        // Visual feedback
        button.classList.add('copied');
        
        // Reset after 2 seconds
        setTimeout(() => {
            button.classList.remove('copied');
        }, 2000);
    }

    function showUserDetails(sessionId) {
        const userData = document.getElementById('user-data-' + sessionId);
        const modal = document.getElementById('userDetailsModal');
        const content = document.getElementById('userDetailsContent');
        
        if (!userData) {
            content.innerHTML = '<div class="no-user-data"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><p>No user data available for this session</p></div>';
            modal.classList.add('active');
            return;
        }
        
        const data = JSON.parse(userData.textContent);
        
        if (!data) {
            content.innerHTML = '<div class="no-user-data"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><p>No user information found for this session</p></div>';
        } else {
            content.innerHTML = `
                <div class="user-detail-row">
                    <div class="user-detail-label">Full Name</div>
                    <div class="user-detail-value ${!data.full_name ? 'empty' : ''}">${data.full_name || 'Not provided'}</div>
                </div>
                <div class="user-detail-row">
                    <div class="user-detail-label">Email Address</div>
                    <div class="user-detail-value ${!data.email ? 'empty' : ''}">${data.email || 'Not provided'}</div>
                </div>
                <div class="user-detail-row">
                    <div class="user-detail-label">Mobile Number</div>
                    <div class="user-detail-value ${!data.mobile ? 'empty' : ''}">${data.mobile || 'Not provided'}</div>
                </div>
                <div class="user-detail-row">
                    <div class="user-detail-label">Country Code</div>
                    <div class="user-detail-value ${!data.country_code ? 'empty' : ''}">${data.country_code || 'Not provided'}</div>
                </div>
                <div class="user-detail-row">
                    <div class="user-detail-label">Conversation ID</div>
                    <div class="user-detail-value" style="display: flex; align-items: center; gap: 10px;">
                        <code style="flex: 1;">${data.conversation_id || 'N/A'}</code>
                        ${data.conversation_id ? `<button class="copy-btn" onclick="copyToClipboard('${data.conversation_id}', this)" title="Copy Conversation ID">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </button>` : ''}
                    </div>
                </div>
                <div class="user-detail-row">
                    <div class="user-detail-label">Created At</div>
                    <div class="user-detail-value">${data.created_at || 'N/A'}</div>
                </div>
            `;
        }
        
        modal.classList.add('active');
    }

    function closeUserDetails() {
        const modal = document.getElementById('userDetailsModal');
        modal.classList.remove('active');
    }

    function jumpToPage() {
        const pageInput = document.getElementById('pageJumpInput');
        const page = parseInt(pageInput.value);
        const totalPages = <?php echo $total_pages; ?>;
        
        if (page >= 1 && page <= totalPages) {
            const url = new URL(window.location.href);
            url.searchParams.set('paged', page);
            window.location.href = url.toString();
        } else {
            alert('Please enter a valid page number between 1 and ' + totalPages);
        }
    }

    // Handle Enter key in page jump input
    document.getElementById('pageJumpInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            jumpToPage();
        }
    });

    // Close modal when clicking outside
    document.getElementById('userDetailsModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeUserDetails();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeUserDetails();
        }
    });
    </script>
    <?php
}

    // Google Drive Authentication
    function avatar_studio_get_google_auth_url()
    {
        $client_id = get_option('avatar_studio_google_client_id');
        $redirect_uri = admin_url('admin.php?page=avatar_studio_sessions');
        
        $params = [
            'client_id' => $client_id,
            'redirect_uri' => $redirect_uri,
            'response_type' => 'code',
            'scope' => 'https://www.googleapis.com/auth/drive.file',
            'access_type' => 'offline',
            'state' => 'avatar_studio_auth',
            'prompt' => 'consent'
        ];
        
        return 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params);
    }

    function avatar_studio_handle_google_callback($code)
    {
        $client_id = get_option('avatar_studio_google_client_id');
        $client_secret = get_option('avatar_studio_google_client_secret');
        $redirect_uri = admin_url('admin.php?page=avatar_studio_sessions');
        
        $response = wp_remote_post('https://oauth2.googleapis.com/token', [
            'body' => [
                'code' => $code,
                'client_id' => $client_id,
                'client_secret' => $client_secret,
                'redirect_uri' => $redirect_uri,
                'grant_type' => 'authorization_code'
            ]
        ]);
        
        if (!is_wp_error($response)) {
            $body = json_decode(wp_remote_retrieve_body($response), true);
            if (isset($body['access_token'])) {
                update_option('avatar_studio_google_access_token', $body['access_token']);
                update_option('avatar_studio_google_refresh_token', $body['refresh_token'] ?? '');
                
                wp_redirect(admin_url('admin.php?page=avatar_studio_sessions&google_connected=1'));
                exit;
            }
        }
    }

    // Export functions
    function avatar_studio_export_all_transcripts()
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'avatar_studio_sessions';
        
        $sessions = $wpdb->get_results("SELECT * FROM {$table_name} WHERE export_status != 'exported' OR export_status IS NULL");
        
        $success_count = 0;
        $fail_count = 0;
        
        foreach ($sessions as $session) {
            $result = avatar_studio_export_transcript($session);
            if ($result) {
                $success_count++;
            } else {
                $fail_count++;
            }
        }
        
        add_settings_error(
            'avatar_studio_messages',
            'avatar_studio_export_result',
            "Export completed: {$success_count} successful, {$fail_count} failed",
            $fail_count === 0 ? 'success' : 'warning'
        );
    }

    function avatar_studio_retry_export($session_id)
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'avatar_studio_sessions';
        
        $session = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$table_name} WHERE id = %d", $session_id));
        
        if ($session) {
            $result = avatar_studio_export_transcript($session);
            
            $message = $result ? 'Transcript exported successfully!' : 'Export failed. Please try again.';
            $type = $result ? 'success' : 'error';
            
            add_settings_error('avatar_studio_messages', 'avatar_studio_retry_result', $message, $type);
        }
    }

    function avatar_studio_export_transcript($session)
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'avatar_studio_sessions';
    
    // Get avatar data to determine vendor
    $avatars_table = $wpdb->prefix . 'avatar_studio_avatars';
    $avatar_id = $session->avatar_id ?? 'unknown';
    
    // Get avatar vendor information
    $avatar_data = $wpdb->get_row($wpdb->prepare(
        "SELECT vendor FROM {$avatars_table} WHERE avatar_id = %s OR id = %s",
        $avatar_id,
        $avatar_id
    ));
    
    $vendor = $avatar_data->vendor ?? 'tavus'; // Default to tavus for backward compatibility
    
    // Fetch transcript and analysis based on vendor
    if ($vendor === 'heygen') {
        $transcript_api_res = avatar_studio_fetch_heygen_transcript($session->session_id);
    } else {
        $transcript_api_res = avatar_studio_fetch_tavus_transcript($session->session_id);
    }

    $transcript = $transcript_api_res['transcript'] ?? null;
    $analysis = $transcript_api_res['analysis'] ?? null;
    
    // Track success for both exports
    $uploadTranscriptStatus = false;
    $uploadAnalysisStatus = false;
    
    // Handle Transcript Export
    if ($transcript) {
        $uploadTranscriptStatus = avatar_studio_upload_to_google_drive($session, $transcript, $vendor);
        
        if ($uploadTranscriptStatus) {
            $wpdb->update(
                $table_name,
                [
                    'export_status' => 'exported', 
                    'exported_at' => current_time('mysql')
                ],
                ['id' => $session->id]
            );
        } else {
            $wpdb->update(
                $table_name,
                [
                    'export_status' => 'failed', 
                    'export_error' => 'Failed to upload transcript to Google Drive'
                ],
                ['id' => $session->id]
            );
        }
    } else {
        $wpdb->update(
            $table_name,
            [
                'export_status' => 'failed', 
                'export_error' => "Failed to fetch transcript from {$vendor}"
            ],
            ['id' => $session->id]
        );
    }

    // Handle Perception Analysis Export (only for vendors that support it)
    if ($analysis) {
        $uploadAnalysisStatus = avatar_studio_upload_analysis_to_google_drive($session, $analysis, $vendor);
        
        if ($uploadAnalysisStatus) {
            $wpdb->update(
                $table_name,
                [
                    'perception_status' => 'processed', 
                    'perception_updated_at' => current_time('mysql')
                ],
                ['id' => $session->id]
            );
        } else {
            $wpdb->update(
                $table_name,
                [
                    'perception_status' => 'failed', 
                    'perception_error' => 'Failed to upload perception analysis to Google Drive'
                ],
                ['id' => $session->id]
            );
        }
    } else {
        // Mark as unavailable if no analysis data
        $wpdb->update(
            $table_name,
            [
                'perception_status' => 'unavailable', 
                'perception_error' => "No perception analysis data available from {$vendor}",
                'perception_updated_at' => current_time('mysql')
            ],
            ['id' => $session->id]
        );
    }

    // Return true if at least one export succeeded
    return $uploadTranscriptStatus || $uploadAnalysisStatus;
}

    /**
     * Log errors to a custom log file
     */
    function avatar_studio_log_error($message, $context = [])
    {
        $upload_dir = wp_upload_dir();
        $log_dir = $upload_dir['basedir'] . '/avatar-studio-logs';
        
        // Create logs directory if it doesn't exist
        if (!file_exists($log_dir)) {
            wp_mkdir_p($log_dir);
            // Add .htaccess to protect log files
            file_put_contents($log_dir . '/.htaccess', 'Deny from all');
        }
        
        $log_file = $log_dir . '/error-log-' . date('Y-m-d') . '.log';
        
        $timestamp = date('Y-m-d H:i:s');
        $context_str = !empty($context) ? json_encode($context, JSON_PRETTY_PRINT) : '';
        
        $log_entry = "[{$timestamp}] {$message}";
        if ($context_str) {
            $log_entry .= "\nContext: {$context_str}";
        }
        $log_entry .= "\n" . str_repeat('-', 80) . "\n";
        
        error_log($log_entry, 3, $log_file);
    }

    function avatar_studio_fetch_tavus_transcript($session_id, $retry_count = 0)
    {
        $api_key = get_option('avatar_studio_tavus_api_key');
        
        if (!$api_key) {
            avatar_studio_log_error('Tavus API key not configured', [
                'session_id' => $session_id,
                'function' => __FUNCTION__
            ]);
            return false;
        }
        
        $url = "https://tavusapi.com/v2/conversations/{$session_id}?verbose=true";
        
        $response = wp_remote_get($url, [
            'headers' => [
                'x-api-key' => $api_key,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json'
            ],
            'timeout' => 60,
            'httpversion' => '1.1',
            'sslverify' => true,
            'blocking' => true,
            'compress' => true,
            'decompress' => true,
            'user-agent' => 'WordPress/Avatar-Studio-Plugin'
        ]);
        
        if (is_wp_error($response)) {
            $error_code = $response->get_error_code();
            $error_message = $response->get_error_message();
            
            // Retry logic for timeout errors (up to 2 retries)
            if ($error_code === 'http_request_failed' && $retry_count < 2) {
                avatar_studio_log_error('Tavus API request failed, retrying...', [
                    'session_id' => $session_id,
                    'url' => $url,
                    'error_message' => $error_message,
                    'error_code' => $error_code,
                    'retry_attempt' => $retry_count + 1,
                    'function' => __FUNCTION__
                ]);
                
                sleep(pow(2, $retry_count));
                return avatar_studio_fetch_tavus_transcript($session_id, $retry_count + 1);
            }
            
            avatar_studio_log_error('Tavus API request failed after retries', [
                'session_id' => $session_id,
                'url' => $url,
                'error_message' => $error_message,
                'error_code' => $error_code,
                'retry_count' => $retry_count,
                'function' => __FUNCTION__
            ]);
            return false;
        }
        
        $response_code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        
        if ($response_code !== 200) {
            avatar_studio_log_error('Tavus API returned error status', [
                'session_id' => $session_id,
                'url' => $url,
                'status_code' => $response_code,
                'response_body' => $body,
                'retry_count' => $retry_count,
                'function' => __FUNCTION__
            ]);
            return false;
        }
        
        $data = json_decode($body, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            avatar_studio_log_error('Failed to decode Tavus API response', [
                'session_id' => $session_id,
                'json_error' => json_last_error_msg(),
                'response_body' => substr($body, 0, 500),
                'function' => __FUNCTION__
            ]);
            return false;
        }
        
        // Extract transcript and analysis from events
        $transcript = null;
        $analysis = null;
        
        if (isset($data['events']) && is_array($data['events'])) {
            foreach ($data['events'] as $event) {
                // Look for transcription_ready event
                if (isset($event['event_type']) && 
                    $event['event_type'] === 'application.transcription_ready' &&
                    isset($event['properties']['transcript'])) {
                    
                    $transcript = $event['properties']['transcript'];
                }
                
                // Look for perception_analysis event
                if (isset($event['event_type']) && 
                    $event['event_type'] === 'application.perception_analysis' &&
                    isset($event['properties']['analysis'])) {
                    
                    $analysis = $event['properties']['analysis'];
                }
                
                // Break early if both are found
                if ($transcript !== null && $analysis !== null) {
                    break;
                }
            }
        }
        
        // If no transcript found in the expected location
        if ($transcript === null) {
            // Check if conversation just ended and transcript might not be ready yet
            if (isset($data['status']) && $data['status'] === 'ended' && $retry_count < 3) {
                avatar_studio_log_error('Transcript not ready yet, retrying...', [
                    'session_id' => $session_id,
                    'retry_attempt' => $retry_count + 1,
                    'level' => 'info',
                    'function' => __FUNCTION__
                ]);
                
                // Wait longer for transcript processing (5 seconds)
                sleep(5);
                return avatar_studio_fetch_tavus_transcript($session_id, $retry_count + 1);
            }
            
            avatar_studio_log_error('Transcript not found in Tavus API response', [
                'session_id' => $session_id,
                'available_keys' => array_keys($data),
                'events_count' => isset($data['events']) ? count($data['events']) : 0,
                'status' => $data['status'] ?? 'unknown',
                'function' => __FUNCTION__
            ]);
            return false;
        }
        
        // Prepare result object
        $result = [
            'transcript' => $transcript
        ];
        
        // Only add analysis if it's not null
        if ($analysis !== null) {
            $result['analysis'] = $analysis;
        }
        
        // Log successful fetch
        if ($retry_count > 0) {
            avatar_studio_log_error('Tavus data fetched successfully after retry', [
                'session_id' => $session_id,
                'retry_count' => $retry_count,
                'transcript_length' => is_array($transcript) ? count($transcript) : strlen($transcript),
                'has_analysis' => $analysis !== null,
                'level' => 'info',
                'function' => __FUNCTION__
            ]);
        }
        
        return $result;
    }

    /**
     * Fetch HeyGen conversation transcript and analysis
     * 
     * @param string $session_id The HeyGen session/conversation ID
     * @param int $retry_count Current retry attempt (internal use)
     * @return array|false Array containing transcript and analysis, or false on failure
     */
    function avatar_studio_fetch_heygen_transcript($session_id, $retry_count = 0)
{
    $api_key = get_option('avatar_studio_heygen_api_key');
    
    if (!$api_key) {
        avatar_studio_log_error('HeyGen API key not configured', [
            'session_id' => $session_id,
            'function' => __FUNCTION__
        ]);
        return false;
    }
    
    // HeyGen API endpoint for getting session data
    $url = "https://api.heygen.com/v1/streaming.get?session_id={$session_id}";
    
    avatar_studio_log_error('HeyGen - Fetching transcript', [
        'session_id' => $session_id,
        'url' => $url,
        'retry_count' => $retry_count,
        'level' => 'info',
        'function' => __FUNCTION__
    ]);
    
    $response = wp_remote_get($url, [
        'headers' => [
            'X-Api-Key' => $api_key,
            'Content-Type' => 'application/json',
            'Accept' => 'application/json'
        ],
        'timeout' => 60,
        'httpversion' => '1.1',
        'sslverify' => true,
        'blocking' => true,
        'compress' => true,
        'decompress' => true,
        'user-agent' => 'WordPress/Avatar-Studio-Plugin'
    ]);
    
    if (is_wp_error($response)) {
        $error_code = $response->get_error_code();
        $error_message = $response->get_error_message();
        
        // Retry logic for timeout errors (up to 2 retries)
        if ($error_code === 'http_request_failed' && $retry_count < 2) {
            avatar_studio_log_error('HeyGen API request failed, retrying...', [
                'session_id' => $session_id,
                'url' => $url,
                'error_message' => $error_message,
                'error_code' => $error_code,
                'retry_attempt' => $retry_count + 1,
                'function' => __FUNCTION__
            ]);
            
            sleep(pow(2, $retry_count));
            return avatar_studio_fetch_heygen_transcript($session_id, $retry_count + 1);
        }
        
        avatar_studio_log_error('HeyGen API request failed after retries', [
            'session_id' => $session_id,
            'url' => $url,
            'error_message' => $error_message,
            'error_code' => $error_code,
            'retry_count' => $retry_count,
            'function' => __FUNCTION__
        ]);
        return false;
    }
    
    $response_code = wp_remote_retrieve_response_code($response);
    $body = wp_remote_retrieve_body($response);
    
    avatar_studio_log_error('HeyGen API response received', [
        'session_id' => $session_id,
        'status_code' => $response_code,
        'body_length' => strlen($body),
        'level' => 'info',
        'function' => __FUNCTION__
    ]);
    
    if ($response_code !== 200) {
        avatar_studio_log_error('HeyGen API returned error status', [
            'session_id' => $session_id,
            'url' => $url,
            'status_code' => $response_code,
            'response_body' => substr($body, 0, 500),
            'retry_count' => $retry_count,
            'function' => __FUNCTION__
        ]);
        return false;
    }
    
    $data = json_decode($body, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        avatar_studio_log_error('Failed to decode HeyGen API response', [
            'session_id' => $session_id,
            'json_error' => json_last_error_msg(),
            'response_body' => substr($body, 0, 500),
            'function' => __FUNCTION__
        ]);
        return false;
    }
    
    // Log the structure of the response for debugging
    avatar_studio_log_error('HeyGen response structure', [
        'session_id' => $session_id,
        'available_keys' => array_keys($data),
        'data_keys' => isset($data['data']) ? array_keys($data['data']) : [],
        'level' => 'info',
        'function' => __FUNCTION__
    ]);
    
    // Extract transcript and analysis from response
    $transcript = null;
    $analysis = null;
    
    if (isset($data['data'])) {
        // Check for transcript in various possible locations
        if (isset($data['data']['transcript'])) {
            $transcript = $data['data']['transcript'];
        } elseif (isset($data['data']['conversation'])) {
            $transcript = $data['data']['conversation'];
        } elseif (isset($data['data']['messages'])) {
            $transcript = $data['data']['messages'];
        } elseif (isset($data['data']['chat_history'])) {
            $transcript = $data['data']['chat_history'];
        }
        
        // Check for analysis
        if (isset($data['data']['analysis'])) {
            $analysis = $data['data']['analysis'];
        } elseif (isset($data['data']['insights'])) {
            $analysis = $data['data']['insights'];
        }
    }
    
    // If no transcript found
    if ($transcript === null) {
        $status = $data['data']['status'] ?? $data['status'] ?? 'unknown';
        
        // If session ended but transcript not ready, retry
        if (in_array($status, ['ended', 'completed', 'finished']) && $retry_count < 3) {
            avatar_studio_log_error('HeyGen transcript not ready yet, retrying...', [
                'session_id' => $session_id,
                'retry_attempt' => $retry_count + 1,
                'status' => $status,
                'level' => 'info',
                'function' => __FUNCTION__
            ]);
            
            sleep(5); // Wait 5 seconds
            return avatar_studio_fetch_heygen_transcript($session_id, $retry_count + 1);
        }
        
        avatar_studio_log_error('HeyGen transcript not found in API response', [
            'session_id' => $session_id,
            'available_keys' => array_keys($data),
            'status' => $status,
            'data_keys' => isset($data['data']) ? array_keys($data['data']) : [],
            'full_response' => json_encode($data),
            'function' => __FUNCTION__
        ]);
        return false;
    }
    
    // Prepare result
    $result = [
        'transcript' => $transcript
    ];
    
    if ($analysis !== null) {
        $result['analysis'] = $analysis;
    }
    
    avatar_studio_log_error('HeyGen data fetched successfully', [
        'session_id' => $session_id,
        'retry_count' => $retry_count,
        'transcript_length' => is_array($transcript) ? count($transcript) : strlen($transcript),
        'has_analysis' => $analysis !== null,
        'level' => 'info',
        'function' => __FUNCTION__
    ]);
    
    return $result;
}


    /**
     * Generate transcript PDF using TCPDF with proper multi-page support
     */
    function avatar_studio_generate_pdf_simple($session, $transcript_text) {
        avatar_studio_log_error('Starting PDF generation with TCPDF', [
            'session_id' => $session->session_id,
            'transcript_count' => is_array($transcript_text) ? count($transcript_text) : 0
        ]);

        if (!is_array($transcript_text)) {
            avatar_studio_log_error('Invalid transcript data', ['session_id' => $session->session_id]);
            return false;
        }

        // Load TCPDF
        if (!class_exists('TCPDF')) {
            $tcpdf_path = plugin_dir_path(__FILE__) . 'lib/TCPDF/tcpdf.php';
            if (file_exists($tcpdf_path)) {
                require_once($tcpdf_path);
            } else {
                avatar_studio_log_error('TCPDF not found', ['path' => $tcpdf_path]);
                return false;
            }
        }

        // Remove duplicate messages
        $transcript_text = array_map("unserialize", array_unique(array_map("serialize", $transcript_text)));

        // Create new PDF document
        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

        // Set document information
        $pdf->SetCreator('Avatar Studio');
        $pdf->SetAuthor('Avatar Studio');
        $pdf->SetTitle('Transcript - ' . $session->session_id);
        $pdf->SetSubject('Conversation Transcript');

        // Set margins
        $pdf->SetMargins(15, 20, 15);
        $pdf->SetHeaderMargin(5);
        $pdf->SetFooterMargin(10);

        // Set auto page breaks
        $pdf->SetAutoPageBreak(TRUE, 15);

        // Add a page
        $pdf->AddPage();

        // Set font
        $pdf->SetFont('helvetica', '', 11);

        // Build HTML content
        $html = '<style>
            .header { 
                text-align: center; 
                border-bottom: 2px solid #333; 
                padding-bottom: 15px; 
                margin-bottom: 20px; 
            }
            .header h1 { 
                margin: 0 0 10px 0; 
                color: #333; 
                font-size: 20px;
                font-weight: bold;
            }
            .header p { 
                margin: 3px 0; 
                color: #666; 
                font-size: 11px;
            }
            .message-container {
                margin-bottom: 15px;
                page-break-inside: avoid;
            }
            .message-bubble {
                padding: 10px;
                border-radius: 8px;
                margin: 5px 0;
                display: inline-block;
                max-width: 85%;
            }
            .user-message {
                background-color: #dcf8c6;
                margin-left: 15%;
            }
            .assistant-message {
                background-color: #f1f0f0;
                margin-right: 15%;
            }
            .role {
                font-weight: bold;
                margin-bottom: 5px;
                font-size: 10px;
            }
            .user-role {
                color: #008000;
            }
            .assistant-role {
                color: #0064c8;
            }
            .content {
                font-size: 11px;
                line-height: 1.5;
                word-wrap: break-word;
            }
        </style>';

        // Header
        $html .= '<div class="header">
            <h1>Avatar Studio</h1>
            <p><strong>Session Transcript</strong></p>
            <p>Session ID: ' . htmlspecialchars($session->session_id) . '</p>
            <p>Generated: ' . date('F j, Y \a\t g:i A') . '</p>
        </div>';

        // Messages
        foreach ($transcript_text as $message) {
            $role = $message['role'] ?? 'unknown';
            $content = $message['content'] ?? '';

            if (empty(trim($content)) || !in_array($role, ['assistant', 'user'])) {
                continue;
            }

            $role_label = ucfirst($role);
            $message_class = ($role === 'user') ? 'user-message' : 'assistant-message';
            $role_class = ($role === 'user') ? 'user-role' : 'assistant-role';

            $html .= '<div class="message-container">';
            $html .= '<div class="message-bubble ' . $message_class . '">';
            $html .= '<div class="role ' . $role_class . '">' . htmlspecialchars($role_label) . ':</div>';
            $html .= '<div class="content">' . nl2br(htmlspecialchars($content)) . '</div>';
            $html .= '</div>';
            $html .= '</div>';
        }

        // Write HTML content
        $pdf->writeHTML($html, true, false, true, false, '');

        // Output PDF as string
        return $pdf->Output('', 'S');
    }

    /**
     * Generate perception analysis PDF with proper multi-page support
     */
    function avatar_studio_generate_analysis_pdf($session, $analysis_text) {
        avatar_studio_log_error('Starting analysis PDF generation', [
            'session_id' => $session->session_id,
            'analysis_length' => is_string($analysis_text) ? strlen($analysis_text) : 0
        ]);

        // Load TCPDF
        if (!class_exists('TCPDF')) {
            $tcpdf_path = plugin_dir_path(__FILE__) . 'lib/TCPDF/tcpdf.php';
            if (file_exists($tcpdf_path)) {
                require_once($tcpdf_path);
            } else {
                avatar_studio_log_error('TCPDF not found', ['path' => $tcpdf_path]);
                return false;
            }
        }

        // Create new PDF document
        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

        // Set document information
        $pdf->SetCreator('Avatar Studio');
        $pdf->SetAuthor('Avatar Studio');
        $pdf->SetTitle('Perception Analysis - ' . $session->session_id);
        $pdf->SetSubject('Perception Analysis Report');

        // Set margins
        $pdf->SetMargins(15, 20, 15);
        $pdf->SetHeaderMargin(5);
        $pdf->SetFooterMargin(10);

        // Set auto page breaks - CRITICAL for multi-page support
        $pdf->SetAutoPageBreak(TRUE, 15);

        // Add a page
        $pdf->AddPage();

        // Set font
        $pdf->SetFont('helvetica', '', 11);

        // Prepare analysis content
        if (is_array($analysis_text) || is_object($analysis_text)) {
            $analysis_content = json_encode($analysis_text, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        } else {
            $analysis_content = $analysis_text;
        }

        // Build HTML content
        $html = '<style>
            .header { 
                text-align: center; 
                border-bottom: 2px solid #4A90E2; 
                padding-bottom: 15px; 
                margin-bottom: 20px; 
            }
            .header h1 { 
                margin: 0 0 10px 0; 
                color: #4A90E2; 
                font-size: 20px;
                font-weight: bold;
            }
            .header h2 {
                margin: 10px 0;
                color: #2c3e50;
                font-size: 16px;
                font-weight: bold;
            }
            .header p { 
                margin: 3px 0; 
                color: #666; 
                font-size: 11px;
            }
            .content-section {
                margin-top: 20px;
            }
            .content-section h3 {
                color: #2c3e50;
                border-bottom: 1px solid #4A90E2;
                padding-bottom: 5px;
                margin-bottom: 10px;
                font-size: 14px;
            }
            .analysis-content {
                font-size: 11px;
                line-height: 1.6;
                white-space: pre-wrap;
                word-wrap: break-word;
                font-family: monospace;
                background-color: #f8f9fa;
                padding: 10px;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
            }
            .footer { 
                text-align: center; 
                color: #888; 
                font-size: 9px; 
                margin-top: 30px; 
                padding-top: 15px;
                border-top: 1px solid #ddd;
            }
        </style>';

        // Header
        $html .= '<div class="header">
            <h1>Avatar Studio</h1>
            <h2>Perception Analysis Report</h2>
            <p><strong>Session ID:</strong> ' . htmlspecialchars($session->session_id) . '</p>
            <p><strong>Generated:</strong> ' . date('F j, Y \a\t g:i A') . '</p>
        </div>';

        // Content section
        $html .= '<div class="content-section">';
        $html .= '<h3>Analysis Details</h3>';
        $html .= '<div class="analysis-content">' . htmlspecialchars($analysis_content) . '</div>';
        $html .= '</div>';

        // Footer
        $html .= '<div class="footer">
            This report was automatically generated by Avatar Studio.<br>
            All analysis data is confidential and should be handled according to your privacy policy.
        </div>';

        // Write HTML content
        $pdf->writeHTML($html, true, false, true, false, '');

        // Output PDF as string
        return $pdf->Output('', 'S');
    }


    /**
     * Get or create Google Drive folder by name
     */
    function avatar_studio_get_or_create_drive_folder($folder_name, $access_token, $parent_id = null) {
        // Build search query
        $query = "name='{$folder_name}' and mimeType='application/vnd.google-apps.folder' and trashed=false";
        if ($parent_id) {
            $query .= " and '{$parent_id}' in parents";
        }
        
        $search_params = http_build_query([
            'q' => $query,
            'fields' => 'files(id, name)'
        ]);
        $search_url = 'https://www.googleapis.com/drive/v3/files?' . $search_params;

        // --- SEARCH FOR FOLDER ---
        $response = wp_remote_get($search_url, [
            'headers' => ['Authorization' => 'Bearer ' . $access_token],
            'timeout' => 30
        ]);

        if (is_wp_error($response)) {
            avatar_studio_log_error('Google Drive folder search failed (Transport Error)', [
                'folder_name' => $folder_name, 
                'parent_id' => $parent_id,
                'error' => $response->get_error_message()
            ]);
            return null;
        }

        $status_code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        // Check for API errors like 401 (Unauthorized)
        if ($status_code !== 200) {
            avatar_studio_log_error('Google Drive folder search failed (API Error)', [
                'folder_name' => $folder_name, 
                'parent_id' => $parent_id,
                'status' => $status_code, 
                'api_response' => $data
            ]);
            return null;
        }

        // If folder exists, return its ID
        if (!empty($data['files'])) {
            return $data['files'][0]['id'];
        }

        // --- CREATE NEW FOLDER ---
        $folder_metadata = [
            'name' => $folder_name,
            'mimeType' => 'application/vnd.google-apps.folder'
        ];
        
        // Add parent folder if specified
        if ($parent_id) {
            $folder_metadata['parents'] = [$parent_id];
        }
        
        $create_response = wp_remote_post('https://www.googleapis.com/drive/v3/files', [
            'headers' => [
                'Authorization' => 'Bearer ' . $access_token,
                'Content-Type' => 'application/json'
            ],
            'body' => json_encode($folder_metadata),
            'timeout' => 30
        ]);

        if (is_wp_error($create_response)) {
            avatar_studio_log_error('Google Drive folder creation failed (Transport Error)', [
                'folder_name' => $folder_name,
                'parent_id' => $parent_id,
                'error' => $create_response->get_error_message()
            ]);
            return null;
        }
        
        $create_status_code = wp_remote_retrieve_response_code($create_response);
        $create_body = wp_remote_retrieve_body($create_response);
        $create_data = json_decode($create_body, true);

        // Check for API errors
        if ($create_status_code !== 200) {
            avatar_studio_log_error('Google Drive folder creation failed (API Error)', [
                'folder_name' => $folder_name,
                'parent_id' => $parent_id,
                'status' => $create_status_code, 
                'api_response' => $create_data
            ]);
            return null;
        }

        // Return the new folder ID
        return $create_data['id'] ?? null;
    }

    function avatar_studio_create_folder_hierarchy($avatar_name, $access_token, $vendor = 'tavus') {
    // Get base URL for root folder name
    $site_url = get_site_url();
    $parsed_url = parse_url($site_url);
    $root_folder_name = $parsed_url['host'] ?? 'avatar-studio';
    
    // 1. Get or create root folder (website name)
    $root_folder_id = avatar_studio_get_or_create_drive_folder($root_folder_name, $access_token);
    if (!$root_folder_id) {
        avatar_studio_log_error('Failed to create root folder', [
            'folder_name' => $root_folder_name,
            'avatar_name' => $avatar_name,
            'vendor' => $vendor
        ]);
        return false;
    }
    
    // 2. Get or create vendor folder (Tavus or HeyGen) inside root folder
    $vendor_folder_name = ucfirst(strtolower($vendor)); // 'Tavus' or 'Heygen'
    $vendor_folder_id = avatar_studio_get_or_create_drive_folder($vendor_folder_name, $access_token, $root_folder_id);
    if (!$vendor_folder_id) {
        avatar_studio_log_error('Failed to create vendor folder', [
            'vendor' => $vendor,
            'root_folder_id' => $root_folder_id
        ]);
        return false;
    }
    
    // 3. Get or create avatar name folder inside vendor folder
    $avatar_folder_id = avatar_studio_get_or_create_drive_folder($avatar_name, $access_token, $vendor_folder_id);
    if (!$avatar_folder_id) {
        avatar_studio_log_error('Failed to create avatar folder', [
            'avatar_name' => $avatar_name,
            'vendor' => $vendor,
            'vendor_folder_id' => $vendor_folder_id
        ]);
        return false;
    }
    
    // 4. Get or create "Transcripts" folder inside avatar folder
    $transcripts_folder_id = avatar_studio_get_or_create_drive_folder('Transcripts', $access_token, $avatar_folder_id);
    if (!$transcripts_folder_id) {
        avatar_studio_log_error('Failed to create Transcripts folder', [
            'avatar_name' => $avatar_name,
            'vendor' => $vendor,
            'avatar_folder_id' => $avatar_folder_id
        ]);
        return false;
    }
    
    // 5. Get or create "Perceptions" folder inside avatar folder
    $perceptions_folder_id = avatar_studio_get_or_create_drive_folder('Perceptions', $access_token, $avatar_folder_id);
    if (!$perceptions_folder_id) {
        avatar_studio_log_error('Failed to create Perceptions folder', [
            'avatar_name' => $avatar_name,
            'vendor' => $vendor,
            'avatar_folder_id' => $avatar_folder_id
        ]);
        return false;
    }
    
    return [
        'root_folder_id' => $root_folder_id,
        'vendor_folder_id' => $vendor_folder_id,
        'avatar_folder_id' => $avatar_folder_id,
        'transcripts_folder_id' => $transcripts_folder_id,
        'perceptions_folder_id' => $perceptions_folder_id
    ];
}

    /**
     * Upload transcript PDF to Google Drive
     */
    function avatar_studio_upload_to_google_drive($session, $transcript, $vendor = 'tavus') {
    avatar_studio_get_valid_google_token();
    
    $access_token = get_option('avatar_studio_google_access_token');
    
    if (!$access_token) {
        avatar_studio_log_error('Google Drive access token not found', [
            'session_id' => $session->session_id ?? 'unknown',
            'vendor' => $vendor,
            'function' => __FUNCTION__
        ]);
        return false;
    }
    
    if (!$transcript) {
        avatar_studio_log_error('No transcript found in API response', [
            'session_id' => $session->session_id ?? 'unknown',
            'vendor' => $vendor,
            'function' => __FUNCTION__
        ]);
        return false;
    }
    
    // Generate PDF
    try {
        $pdf_content = avatar_studio_generate_pdf_simple($session, $transcript);
    } catch (Exception $e) {
        avatar_studio_log_error('PDF generation failed', [
            'session_id' => $session->session_id ?? 'unknown',
            'vendor' => $vendor,
            'error' => $e->getMessage(),
            'function' => __FUNCTION__
        ]);
        return false;
    }
    
    // Get avatar name from avatar_id
    global $wpdb;
    $avatars_table = $wpdb->prefix . 'avatar_studio_avatars';
    $avatar_id = $session->avatar_id ?? 'unknown';
    
    // Try to get by avatar_id field first, then by id
    $avatar_data = $wpdb->get_row($wpdb->prepare(
        "SELECT id, avatar_name, vendor FROM {$avatars_table} WHERE avatar_id = %s",
        $avatar_id
    ));
    
    if (!$avatar_data) {
        $avatar_data = $wpdb->get_row($wpdb->prepare(
            "SELECT id, avatar_name, vendor FROM {$avatars_table} WHERE id = %s",
            $avatar_id
        ));
    }
    
    $avatar_name = $avatar_data->avatar_name ?? null;
    $avatar_vendor = $avatar_data->vendor ?? $vendor;
    
    // Sanitize avatar name for folder naming
    if ($avatar_name) {
        $avatar_name = preg_replace('/[<>:\"\/\\|?*]/', '_', $avatar_name);
        $avatar_name = trim($avatar_name);
    }
    
    // Fallback to avatar_id if name not found or empty
    if (empty($avatar_name)) {
        $avatar_name = $avatar_id;
    }
    
    // Create folder hierarchy using avatar name and vendor
    $folders = avatar_studio_create_folder_hierarchy($avatar_name, $access_token, $avatar_vendor);
    
    if (!$folders) {
        avatar_studio_log_error('Failed to create folder hierarchy', [
            'session_id' => $session->session_id ?? 'unknown',
            'avatar_name' => $avatar_name,
            'vendor' => $avatar_vendor,
            'function' => __FUNCTION__
        ]);
        return false;
    }
    
    // Use the transcripts folder for PDF upload
    $transcripts_folder_id = $folders['transcripts_folder_id'];
    
    // Prepare filename with vendor prefix
    $filename = "{$avatar_vendor}_transcript_{$session->session_id}_" . date('Y-m-d_H-i-s') . ".pdf";
    
    // Prepare multipart upload
    $boundary = wp_generate_password(24, false);
    
    $metadata = json_encode([
        'name' => $filename,
        'mimeType' => 'application/pdf',
        'parents' => [$transcripts_folder_id]
    ]);
    
    $body = "--{$boundary}\r\n";
    $body .= "Content-Type: application/json; charset=UTF-8\r\n\r\n";
    $body .= $metadata . "\r\n";
    $body .= "--{$boundary}\r\n";
    $body .= "Content-Type: application/pdf\r\n\r\n";
    $body .= $pdf_content . "\r\n";
    $body .= "--{$boundary}--";
    
    // Upload to Google Drive
    $response = wp_remote_post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', [
        'headers' => [
            'Authorization' => 'Bearer ' . $access_token,
            'Content-Type' => 'multipart/related; boundary=' . $boundary
        ],
        'body' => $body,
        'timeout' => 60
    ]);
    
    if (is_wp_error($response)) {
        avatar_studio_log_error('Google Drive upload request failed', [
            'session_id' => $session->session_id ?? 'unknown',
            'avatar_name' => $avatar_name,
            'vendor' => $avatar_vendor,
            'filename' => $filename,
            'error_message' => $response->get_error_message(),
            'error_code' => $response->get_error_code(),
            'function' => __FUNCTION__
        ]);
        return false;
    }
    
    $response_code = wp_remote_retrieve_response_code($response);
    $response_body = wp_remote_retrieve_body($response);
    
    if ($response_code !== 200) {
        avatar_studio_log_error('Google Drive upload failed', [
            'session_id' => $session->session_id ?? 'unknown',
            'avatar_name' => $avatar_name,
            'vendor' => $avatar_vendor,
            'filename' => $filename,
            'transcripts_folder_id' => $transcripts_folder_id,
            'status_code' => $response_code,
            'response_body' => $response_body,
            'function' => __FUNCTION__
        ]);
        return false;
    }
    
    // Log successful upload
    $upload_data = json_decode($response_body, true);
        avatar_studio_log_error('Google Drive PDF upload successful', [
            'session_id' => $session->session_id ?? 'unknown',
            'avatar_name' => $avatar_name,
            'vendor' => $avatar_vendor,
            'filename' => $filename,
            'folder_structure' => implode(' > ', [
                $folders['root_folder_id'],
                $folders['vendor_folder_id'],
                $folders['avatar_folder_id'],
                $folders['transcripts_folder_id']
            ]),
            'file_id' => $upload_data['id'] ?? 'unknown',
            'level' => 'info',
            'function' => __FUNCTION__
        ]);
        
        return true;
    }


    /**
     * Upload analysis PDF to Google Drive
     */
    function avatar_studio_upload_analysis_to_google_drive($session, $analysis, $vendor = 'tavus') {
    avatar_studio_get_valid_google_token();
    
    $access_token = get_option('avatar_studio_google_access_token');
    
    if (!$access_token) {
        avatar_studio_log_error('Google Drive access token not found', [
            'session_id' => $session->session_id ?? 'unknown',
            'vendor' => $vendor,
            'function' => __FUNCTION__
        ]);
        return false;
    }
    
    if (!$analysis) {
        avatar_studio_log_error('No analysis found in API response', [
            'session_id' => $session->session_id ?? 'unknown',
            'vendor' => $vendor,
            'function' => __FUNCTION__
        ]);
        return false;
    }
    
    // Generate PDF
    try {
        $pdf_content = avatar_studio_generate_analysis_pdf($session, $analysis);
    } catch (Exception $e) {
        avatar_studio_log_error('Analysis PDF generation failed', [
            'session_id' => $session->session_id ?? 'unknown',
            'vendor' => $vendor,
            'error' => $e->getMessage(),
            'function' => __FUNCTION__
        ]);
        return false;
    }
    
    // Get avatar name from avatar_id
    global $wpdb;
    $avatars_table = $wpdb->prefix . 'avatar_studio_avatars';
    $avatar_id = $session->avatar_id ?? 'unknown';
    
    // Try to get by avatar_id field first, then by id
    $avatar_data = $wpdb->get_row($wpdb->prepare(
        "SELECT id, avatar_name, vendor FROM {$avatars_table} WHERE avatar_id = %s",
        $avatar_id
    ));
    
    if (!$avatar_data) {
        $avatar_data = $wpdb->get_row($wpdb->prepare(
            "SELECT id, avatar_name, vendor FROM {$avatars_table} WHERE id = %s",
            $avatar_id
        ));
    }
    
    $avatar_name = $avatar_data->avatar_name ?? null;
    $avatar_vendor = $avatar_data->vendor ?? $vendor;
    
    // Sanitize avatar name for folder naming
    if ($avatar_name) {
        $avatar_name = preg_replace('/[<>:\"\/\\|?*]/', '_', $avatar_name);
        $avatar_name = trim($avatar_name);
    }
    
    // Fallback to avatar_id if name not found or empty
    if (empty($avatar_name)) {
        $avatar_name = $avatar_id;
    }
    
    // Create folder hierarchy using avatar name and vendor
    $folders = avatar_studio_create_folder_hierarchy($avatar_name, $access_token, $avatar_vendor);
    
    if (!$folders) {
        avatar_studio_log_error('Failed to create folder hierarchy for perception analysis', [
            'session_id' => $session->session_id ?? 'unknown',
            'avatar_name' => $avatar_name,
            'vendor' => $avatar_vendor,
            'function' => __FUNCTION__
        ]);
        return false;
    }
    
    // Use the perceptions folder for PDF upload
    $perceptions_folder_id = $folders['perceptions_folder_id'];
    
    // Prepare filename with vendor prefix
    $filename = "{$avatar_vendor}_perception_analysis_{$session->session_id}_" . date('Y-m-d_H-i-s') . ".pdf";
    
    // Prepare multipart upload
    $boundary = wp_generate_password(24, false);
    
    $metadata = json_encode([
        'name' => $filename,
        'mimeType' => 'application/pdf',
        'parents' => [$perceptions_folder_id]
    ]);
    
    $body = "--{$boundary}\r\n";
    $body .= "Content-Type: application/json; charset=UTF-8\r\n\r\n";
    $body .= $metadata . "\r\n";
    $body .= "--{$boundary}\r\n";
    $body .= "Content-Type: application/pdf\r\n\r\n";
    $body .= $pdf_content . "\r\n";
    $body .= "--{$boundary}--";
    
    // Upload to Google Drive
    $response = wp_remote_post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', [
        'headers' => [
            'Authorization' => 'Bearer ' . $access_token,
            'Content-Type' => 'multipart/related; boundary=' . $boundary
        ],
        'body' => $body,
        'timeout' => 60
    ]);
    
    if (is_wp_error($response)) {
        avatar_studio_log_error('Google Drive perception analysis upload request failed', [
            'session_id' => $session->session_id ?? 'unknown',
            'avatar_name' => $avatar_name,
            'vendor' => $avatar_vendor,
            'filename' => $filename,
            'error_message' => $response->get_error_message(),
            'error_code' => $response->get_error_code(),
            'function' => __FUNCTION__
        ]);
        return false;
    }
    
    $response_code = wp_remote_retrieve_response_code($response);
    $response_body = wp_remote_retrieve_body($response);
    
    if ($response_code !== 200) {
        avatar_studio_log_error('Google Drive perception analysis upload failed', [
            'session_id' => $session->session_id ?? 'unknown',
            'avatar_name' => $avatar_name,
            'vendor' => $avatar_vendor,
            'filename' => $filename,
            'perceptions_folder_id' => $perceptions_folder_id,
            'status_code' => $response_code,
            'response_body' => $response_body,
            'function' => __FUNCTION__
        ]);
        return false;
    }
    
    // Log successful upload
    $upload_data = json_decode($response_body, true);
    avatar_studio_log_error('Google Drive perception analysis PDF upload successful', [
        'session_id' => $session->session_id ?? 'unknown',
        'avatar_name' => $avatar_name,
        'vendor' => $avatar_vendor,
        'filename' => $filename,
        'folder_structure' => implode(' > ', [
            $folders['root_folder_id'],
            $folders['vendor_folder_id'],
            $folders['avatar_folder_id'],
            $folders['perceptions_folder_id']
        ]),
        'file_id' => $upload_data['id'] ?? 'unknown',
        'level' => 'info',
        'function' => __FUNCTION__
    ]);
    
    return true;
}

    /**
     * Helper function to refresh Google OAuth token
     */
    function avatar_studio_refresh_google_token()
    {
        $refresh_token = get_option('avatar_studio_google_refresh_token');
        $client_id = get_option('avatar_studio_google_client_id');
        $client_secret = get_option('avatar_studio_google_client_secret');
        if (!$refresh_token || !$client_id || !$client_secret) {
            avatar_studio_log_error('Cannot refresh Google token - missing credentials', [
                'has_refresh_token' => !empty($refresh_token),
                'has_client_id' => !empty($client_id),
                'has_client_secret' => !empty($client_secret),
                'function' => __FUNCTION__
            ]);
            return false;
        }
        $response = wp_remote_post('https://oauth2.googleapis.com/token', [
            'body' => [
                'client_id' => $client_id,
                'client_secret' => $client_secret,
                'refresh_token' => $refresh_token,
                'grant_type' => 'refresh_token'
            ],
            'timeout' => 30
        ]);
        if (is_wp_error($response)) {
            avatar_studio_log_error('Google token refresh failed', [
                'error_message' => $response->get_error_message(),
                'error_code' => $response->get_error_code(),
                'function' => __FUNCTION__
            ]);
            return false;
        }
        $status_code = wp_remote_retrieve_response_code($response);
        $body = json_decode(wp_remote_retrieve_body($response), true);
        // Check for error response
        if ($status_code !== 200 || isset($body['error'])) {
            avatar_studio_log_error('Google token refresh response invalid', [
                'status_code' => $status_code,
                'error' => $body['error'] ?? 'Unknown error',
                'error_description' => $body['error_description'] ?? '',
                'response_body' => wp_remote_retrieve_body($response),
                'function' => __FUNCTION__
            ]);
            // If refresh token is invalid, clear all tokens
            if (isset($body['error']) && in_array($body['error'], ['invalid_grant', 'invalid_client'])) {
                delete_option('avatar_studio_google_access_token');
                delete_option('avatar_studio_google_refresh_token');
                delete_option('avatar_studio_google_token_expires');
            }
            return false;
        }
        if (isset($body['access_token'])) {
            update_option('avatar_studio_google_access_token', $body['access_token']);
            // Expire 5 minutes early to prevent edge cases
            $expires_in = isset($body['expires_in']) ? (int)$body['expires_in'] - 300 : 3300;
            update_option('avatar_studio_google_token_expires', time() + $expires_in);
            avatar_studio_log_error('Google token refreshed successfully', [
                'expires_in' => $expires_in,
                'function' => __FUNCTION__
            ]);
            return true;
        }
        return false;
    }
    
    // Add this helper function to check and refresh token before API calls
    function avatar_studio_get_valid_google_token()
    {
        $access_token = get_option('avatar_studio_google_access_token');
        $token_expires = get_option('avatar_studio_google_token_expires');
        // Check if token is missing or expired
        if (!$access_token || !$token_expires || time() >= $token_expires) {
            if (!avatar_studio_refresh_google_token()) {
                return false;
            }
            $access_token = get_option('avatar_studio_google_access_token');
        }
        return $access_token;
    }

    /**
     * View error logs (add this to admin menu if needed)
     */
    function avatar_studio_view_error_logs()
    {
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        
        $upload_dir = wp_upload_dir();
        $log_dir = $upload_dir['basedir'] . '/avatar-studio-logs';
        
        echo '<div class="wrap">';
        echo '<h1>Avatar Studio Error Logs</h1>';
        
        if (!file_exists($log_dir)) {
            echo '<p>No logs found.</p>';
            echo '</div>';
            return;
        }
        
        $log_files = glob($log_dir . '/error-log-*.log');
        rsort($log_files); // Most recent first
        
        if (empty($log_files)) {
            echo '<p>No log files found.</p>';
            echo '</div>';
            return;
        }
        
        // Show today's log by default
        $selected_log = isset($_GET['logfile']) ? $_GET['logfile'] : basename($log_files[0]);
        
        echo '<form method="get">';
        $page = isset($_GET['page']) ? sanitize_text_field($_GET['page']) : '';
        echo '<input type="hidden" name="page" value="' . esc_attr($page) . '">';
        echo '<select name="logfile" onchange="this.form.submit()">';
        foreach ($log_files as $log_file) {
            $basename = basename($log_file);
            $selected = $basename === $selected_log ? 'selected' : '';
            echo '<option value="' . esc_attr($basename) . '" ' . $selected . '>' . esc_html($basename) . '</option>';
        }
        echo '</select>';
        echo '</form>';
        
        $log_content = file_get_contents($log_dir . '/' . $selected_log);
        echo '<pre style="background: #f5f5f5; padding: 15px; border: 1px solid #ddd; overflow-x: auto; max-height: 600px; overflow-y: auto;">';
        echo esc_html($log_content);
        echo '</pre>';
        
        echo '</div>';
    }

    // Disconnect Google Drive
    add_action('admin_post_avatar_studio_disconnect_google', 'avatar_studio_disconnect_google_handler');
    function avatar_studio_disconnect_google_handler()
    {
        check_admin_referer('avatar_studio_disconnect_google');
        
        delete_option('avatar_studio_google_access_token');
        delete_option('avatar_studio_google_refresh_token');
        
        wp_redirect(admin_url('admin.php?page=avatar_studio_sessions&google_disconnected=1'));
        exit;
    }


    // Register settings
    add_action('admin_init', 'avatar_studio_register_settings');
    function avatar_studio_register_settings()
{
    // Register all settings for the main settings group
    register_setting('avatar_studio_main_settings_group', 'avatar_studio_enable');
    register_setting('avatar_studio_main_settings_group', 'avatar_studio_tavus_api_key');
    register_setting('avatar_studio_main_settings_group', 'avatar_studio_heygen_api_key');
    register_setting('avatar_studio_main_settings_group', 'avatar_studio_enable_google_drive');
    register_setting('avatar_studio_main_settings_group', 'avatar_studio_google_client_id');
    register_setting('avatar_studio_main_settings_group', 'avatar_studio_google_client_secret');
    
    // Register the auto export settings
    register_setting('avatar_studio_main_settings_group', 'avatar_auto_export_enabled');
    register_setting('avatar_studio_main_settings_group', 'avatar_auto_export_interval');

    register_setting('avatar_studio_main_settings_group', 'avatar_studio_tavus_api_key', array(
        'sanitize_callback' => 'sanitize_text_field'
    ));
    
    register_setting('avatar_studio_main_settings_group', 'avatar_studio_heygen_api_key', array(
        'sanitize_callback' => 'sanitize_text_field'
    ));
    
    register_setting('avatar_studio_main_settings_group', 'avatar_studio_google_client_id', array(
        'sanitize_callback' => 'sanitize_text_field'
    ));
    
    register_setting('avatar_studio_main_settings_group', 'avatar_studio_google_client_secret', array(
        'sanitize_callback' => 'sanitize_text_field'
    ));
    
    register_setting('avatar_studio_main_settings_group', 'avatar_studio_enable_google_drive', array(
        'type' => 'boolean',
        'sanitize_callback' => function($value) {
            return $value ? 1 : 0;
        }
    ));
    
    register_setting('avatar_studio_main_settings_group', 'avatar_studio_enable', array(
        'type' => 'boolean',
        'sanitize_callback' => function($value) {
            return $value ? 1 : 0;
        }
    ));
}


    // Register plugin settings, sections, and fields
    function avatar_studio_settings_init()
    {
        register_setting('avatar_studio_main_settings_group', 'avatar_studio_enable', array(
            'type' => 'boolean',
            'sanitize_callback' => function($value) {
                return $value ? 1 : 0;
            }
        ));  
    }
    add_action('admin_init', 'avatar_studio_settings_init');
    ?>


    <?php
    function avatar_studio_user_info_page() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'avatar_studio_user_info';

    // Handle bulk delete action
    if (isset($_POST['bulk_delete']) && isset($_POST['bulk_delete_nonce'])) {
        if (wp_verify_nonce($_POST['bulk_delete_nonce'], 'bulk_delete_action')) {
            if (!empty($_POST['selected_users'])) {
                $selected_users = array_map('intval', $_POST['selected_users']);
                $placeholders = implode(',', array_fill(0, count($selected_users), '%d'));
                
                $deleted = $wpdb->query(
                    $wpdb->prepare(
                        "DELETE FROM {$table_name} WHERE id IN ($placeholders)",
                        $selected_users
                    )
                );
                
                if ($deleted) {
                    echo '<div class="notice notice-success is-dismissible"><p><strong>Success!</strong> ' . $deleted . ' users deleted successfully.</p></div>';
                } else {
                    echo '<div class="notice notice-error is-dismissible"><p><strong>Error!</strong> Failed to delete selected users.</p></div>';
                }
            }
        }
    }

    // Handle export CSV action
    // if (isset($_POST['export_csv']) && isset($_POST['export_csv_nonce'])) {
    //     if (wp_verify_nonce($_POST['export_csv_nonce'], 'export_csv_action')) {
    //         if (!empty($_POST['selected_users'])) {
    //             $selected_users = array_map('intval', $_POST['selected_users']);
    //             $placeholders = implode(',', array_fill(0, count($selected_users), '%d'));
                
    //             $export_query = $wpdb->prepare(
    //                 "SELECT * FROM {$table_name} WHERE id IN ($placeholders) ORDER BY created_at DESC",
    //                 $selected_users
    //             );
    //             $export_results = $wpdb->get_results($export_query);
                
    //             // Set headers for CSV download
    //             header('Content-Type: text/csv; charset=utf-8');
    //             header('Content-Disposition: attachment; filename=avatar-studio-users-' . date('Y-m-d-H-i-s') . '.csv');
                
    //             // Create output stream
    //             $output = fopen('php://output', 'w');
                
    //             // Add BOM for UTF-8
    //             fputs($output, $bom = (chr(0xEF) . chr(0xBB) . chr(0xBF)));
                
    //             // CSV headers
    //             fputcsv($output, [
    //                 'ID',
    //                 'Full Name', 
    //                 'Email Address',
    //                 'Phone Number',
    //                 'Conversation ID',
    //                 'Created At'
    //             ]);
                
    //             // Add data rows
    //             foreach ($export_results as $row) {
    //             // Format the date for CSV export
    //             $created_date = DateTime::createFromFormat('Y-m-d H:i:s', $row->created_at);
    //             $formatted_date = $created_date ? $created_date->format('m-d-Y H:i:s') : $row->created_at;
                
    //             // Format phone number in US format with country code
    //             $clean_phone = preg_replace('/[^0-9]/', '', $row->mobile);
    //             if (substr($clean_phone, 0, 1) === '1' && strlen($clean_phone) === 11) {
    //                 $clean_phone = substr($clean_phone, 1);
    //             }
    //             if (strlen($clean_phone) === 10) {
    //                 $formatted_phone = '+1 (' . substr($clean_phone, 0, 3) . ') ' . substr($clean_phone, 3, 3) . '-' . substr($clean_phone, 6, 4);
    //             } else {
    //                 $formatted_phone = '+1 ' . $clean_phone;
    //             }
                
    //             fputcsv($output, [
    //                 'AS' . $row->id,
    //                 $row->full_name,
    //                 $row->email,
    //                 $formatted_phone,
    //                 $row->conversation_id,
    //                 $formatted_date
    //             ]);
    //         }
                
    //             fclose($output);
    //             exit;
    //         }
    //     }
    // }

    $paged = isset($_GET['paged']) ? intval($_GET['paged']) : 1;
    $per_page = 10;
    $offset = ($paged - 1) * $per_page;

    $search = isset($_GET['s']) ? sanitize_text_field($_GET['s']) : '';

    $allowed_columns = ['id', 'full_name', 'email', 'mobile', 'country_code', 'created_at'];
    $orderby = (isset($_GET['orderby']) && in_array($_GET['orderby'], $allowed_columns)) ? $_GET['orderby'] : 'created_at';
    $order = (isset($_GET['order']) && strtolower($_GET['order']) === 'asc') ? 'ASC' : 'DESC';
    $new_order = ($order === 'ASC') ? 'desc' : 'asc';

    $where_sql = '';
    if (!empty($search)) {
        $where_sql = $wpdb->prepare(
            "WHERE full_name LIKE %s OR email LIKE %s OR mobile LIKE %s OR country_code LIKE %s OR CONCAT('+1 ', mobile) LIKE %s",
            '%' . $wpdb->esc_like($search) . '%',
            '%' . $wpdb->esc_like($search) . '%',
            '%' . $wpdb->esc_like($search) . '%',
            '%' . $wpdb->esc_like($search) . '%',
            '%' . $wpdb->esc_like($search) . '%'
        );
    }

    $total_items = $wpdb->get_var("SELECT COUNT(*) FROM {$table_name} {$where_sql}");
    $total_pages = ceil($total_items / $per_page);

    $data_query = $wpdb->prepare(
        "SELECT * FROM {$table_name} {$where_sql} ORDER BY {$orderby} {$order} LIMIT %d OFFSET %d",
        $per_page,
        $offset
    );
    $results = $wpdb->get_results($data_query);

    function avatar_filter_url($params = []) {
        $base_params = array_filter($_GET, function($key) {
            return $key !== 'paged';
        }, ARRAY_FILTER_USE_KEY);
        
        $query = array_merge($base_params, $params);
        return '?' . http_build_query($query);
    }
    ?>

    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #333;
        }

        .avatar-user-info-wrapper {
            max-width: 90%;
            margin: 20px auto;
        }

        .avatar-user-info-header {
            margin-bottom: 20px;
        }

        .avatar-user-info-header h1 {
            margin: 0 0 5px;
            font-size: 22px;
        }

        .avatar-table-section {
            border: 1px solid #ddd;
            background: #fff;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            text-align: left;
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }

        th a {
            color: #333;
            text-decoration: none;
        }

        th a:hover {
            text-decoration: underline;
        }

        .table-empty {
            text-align: center;
            padding: 20px;
            color: #666;
        }

        .pagination-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 15px;
        }

        .pagination-links a, 
        .pagination-links .button {
            padding: 6px 10px;
            border: 1px solid #ccc;
            background: #f5f5f5;
            text-decoration: none;
            color: #333;
            font-size: 13px;
        }

        .pagination-links a:hover {
            background: #f5f5f5;
            color: #333;
        }

        .stats-grid {
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
        }

        .stat-card {
            flex: 1;
            border: 1px solid #ddd;
            padding: 10px;
            background: #f9f9f9;
        }

        .stat-label {
            font-size: 12px;
            color: #666;
        }

        .stat-value {
            font-size: 18px;
            font-weight: bold;
        }

        .sort-icon {
            font-size: 10px;
        }
    </style>

    <style>
        /* Main Wrapper */
        .avatar-user-info-wrapper {
            max-width: 1400px;
            margin: 20px auto;
            padding: 0 20px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, sans-serif;
        }

        /* Header Section */
        .avatar-user-info-header {
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            color: white;
            padding: 32px 40px;
            border-radius: 12px;
            margin-bottom: 24px;
            box-shadow: 0 4px 20px rgba(56, 177, 197, 0.3);
            position: relative;
            overflow: hidden;
        }

        .avatar-user-info-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
            pointer-events: none;
        }

        .avatar-user-info-header h1 {
            font-size: 32px;
            font-weight: 700;
            margin: 0 0 8px 0;
            color: white;
            display: flex;
            align-items: center;
            gap: 12px;
            position: relative;
            z-index: 1;
        }

        .avatar-user-info-header p {
            margin: 0;
            font-size: 15px;
            opacity: 0.95;
            color: white;
            position: relative;
            z-index: 1;
        }

        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 24px;
        }

        .stat-card {
            background: white;
            border: 2px solid transparent;
            background-image: 
                linear-gradient(white, white),
                linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(56, 177, 197, 0.1);
            position: relative;
            overflow: hidden;
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #38b1c5 0%, #da922c 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(56, 177, 197, 0.2);
        }

        .stat-card:hover::before {
            opacity: 1;
        }

        .stat-label {
            font-size: 13px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .stat-value {
            font-size: 32px;
            line-height: 32px;
            font-weight: 700;
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        /* Search & Bulk Actions Section */
        .search-bulk-section {
            margin-bottom: 24px;
        }

        .search-bulk-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        @media (max-width: 1024px) {
            .search-bulk-grid {
                grid-template-columns: 1fr;
                gap: 15px;
            }
        }

        /* Bulk Actions Column */
        .bulk-actions-column {
            min-width: 0;
        }

        .bulk-actions-card {
            background: white;
            padding: 24px;
            border-radius: 12px;
            border: 2px solid transparent;
            background-image: 
                linear-gradient(white, white),
                linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            box-shadow: 0 4px 15px rgba(56, 177, 197, 0.1);
            height: -webkit-fill-available;
        }

        .bulk-actions-title {
            font-size: 16px;
            font-weight: 700;
            color: #374151;
            margin: 5px 0 16px 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .bulk-actions-title::before {
            content: '📁';
            font-size: 18px;
        }

        .select-all-control {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 16px;
            background: linear-gradient(135deg, rgba(56, 177, 197, 0.05) 0%, rgba(218, 146, 44, 0.05) 100%);
            border-radius: 8px;
            border: 1px solid rgba(56, 177, 197, 0.2);
        }

        .bulk-checkbox {
            transform: scale(1.3);
            cursor: pointer;
            accent-color: #38b1c5;
        }

        .bulk-checkbox-label {
            font-weight: 600;
            color: #374151;
            cursor: pointer;
            font-size: 14px;
        }

        .bulk-buttons {
            display: flex;
            align-items: center;
            gap: 8px;
            flex: 1;
            justify-content: flex-start;
            flex-wrap: wrap;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-5px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .selected-count {
            background: #fff;
            color: #da922c;
            border-radius: 6px;
            padding: 8px 10px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
            border: 1px solid #da922c;
            text-decoration: none;
        }

        .selected-count:hover {
            background: #da922c;
            color: #fff;
        }

        .button-bulk-delete {
            background: #fff;
            color: #dc2626;
            border-radius: 6px;
            padding: 8px 10px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
            border: 1px solid #dc2626;
            text-decoration: none;
        }

        .button-bulk-delete:hover {
            background: #dc2626;
            color: #fff;
        }

        .button-bulk-clear {
            background: #fff;
            color: #6b7280;
            border-radius: 6px;
            padding: 8px 10px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 2px;
            white-space: nowrap;
            border: 1px solid #6b7280;
            text-decoration: none;
        }

        .button-bulk-clear:hover {
            background: #6b7280;
            color: #fff;
        }

        .button-bulk-export {
            background: #fff;
            color: #059669;
            border-radius: 6px;
            padding: 8px 10px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
            border: 1px solid #059669;
            text-decoration: none;
        }

        .button-bulk-export:hover {
            background: #059669;
            color: #fff;
        }

        .button-bulk-export svg,
        .button-bulk-delete svg,
        .button-bulk-clear svg {
            width: 14px;
            height: 14px;
            flex-shrink: 0;
        }

        .button-bulk-export-all {
            background: #fff;
            color: #3b82f6;
            border-radius: 6px;
            padding: 8px 10px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
            border: 1px solid #3b82f6;
            text-decoration: none;
        }

        .button-bulk-export-all:hover {
            background: #3b82f6;
            color: #fff;
        }

        .button-bulk-export-all svg {
            width: 14px;
            height: 14px;
            flex-shrink: 0;
        }

        /* Search Column */
        .search-column {
            min-width: 0;
        }

        .search-card {
            background: white;
            padding: 24px;
            border-radius: 12px;
            border: 2px solid transparent;
            background-image: 
                linear-gradient(white, white),
                linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            box-shadow: 0 4px 15px rgba(56, 177, 197, 0.1);
            height: -webkit-fill-available;
        }

        .search-title {
            font-size: 16px;
            font-weight: 700;
            color: #374151;
            margin: 0 0 16px 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .search-title::before {
            content: '🔍';
            font-size: 16px;
        }

        .search-input-group {
            display: flex;
            gap: 10px;
            align-items: stretch;
        }

        .search-input-group input {
            background: white;
            border-radius: 8px;
            border: 2px solid transparent;
            background-image: linear-gradient(white, white), linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            box-shadow: 0 4px 15px rgba(56, 177, 197, 0.1);
        }

        .search-input-group input:active {
            background: white;
            border-radius: 8px;
            border: 2px solid transparent;
            background-image: linear-gradient(white, white), linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            box-shadow: 0 4px 15px rgba(56, 177, 197, 0.1);
        }

        .search-input-group input:focus {
            background: white;
            border-radius: 8px;
            border: 2px solid transparent;
            background-image: linear-gradient(white, white), linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            box-shadow: 0 4px 15px rgba(56, 177, 197, 0.1);
        }

        .search-input {
            flex: 1;
            padding: 12px 16px;
            border-radius: 8px;
            border: 2px solid #e5e7eb;
            font-size: 14px;
            transition: all 0.2s ease;
            background: #fafafa;
        }

        .search-input:focus {
            outline: none;
            border: 2px solid transparent;
            background-image: 
                linear-gradient(white, white),
                linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            box-shadow: 0 0 0 4px rgba(56, 177, 197, 0.1);
            background: white;
        }

        .search-button {
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            white-space: nowrap;
        }

        .search-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(56, 177, 197, 0.5);
        }

        .search-clear {
            background: white;
            color: #6b7280;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            padding: 12px 16px;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 6px;
            white-space: nowrap;
        }

        .search-clear:hover {
            background: #f9fafb;
            border-color: #9ca3af;
            text-decoration: none;
            color: #374151;
            transform: translateY(-1px);
        }

        /* Table Section */
        .avatar-table-section {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            border: 2px solid transparent;
            background-image: 
                linear-gradient(white, white),
                linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            box-shadow: 0 4px 15px rgba(56, 177, 197, 0.1);
        }

        .avatar-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            font-size: 14px;
        }

        .avatar-table thead {
            background: linear-gradient(135deg, rgba(56, 177, 197, 0.08) 0%, rgba(218, 146, 44, 0.08) 100%);
            position: relative;
        }

        .avatar-table thead::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, #38b1c5 0%, #da922c 100%);
        }

        .avatar-table th {
            color: #374151;
            padding: 16px 12px;
            font-weight: 700;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            white-space: nowrap;
            position: sticky;
            top: 0;
            background: linear-gradient(135deg, rgba(56, 177, 197, 0.08) 0%, rgba(218, 146, 44, 0.08) 100%);
            z-index: 10;
            border-bottom: 1px solid #e5e7eb;
        }

        .avatar-table th a {
            color: #374151;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            transition: all 0.2s ease;
            padding: 4px 0;
            font-size: 12px;
        }

        .avatar-table th a:hover {
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .sort-icon {
            font-size: 10px;
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: bold;
        }

        .avatar-table tbody tr {
            transition: all 0.3s ease;
            border-bottom: 1px solid #f3f4f6;
        }

        .avatar-table tbody tr:hover {
            background: linear-gradient(135deg, rgba(56, 177, 197, 0.03) 0%, rgba(218, 146, 44, 0.03) 100%);
            transform: scale(1.001);
        }

        .avatar-table tbody tr:last-child {
            border-bottom: none;
        }

        .avatar-table td {
            padding: 16px 12px;
            color: #1f2937;
            vertical-align: middle;
            border-bottom: 1px solid #f3f4f6;
        }

        /* Specific column alignments */
        .avatar-table th:nth-child(1), /* Checkbox column */
        .avatar-table td:nth-child(1) {
            width: 50px;
            text-align: center;
            padding: 16px 8px;
        }

        .avatar-table th:nth-child(2), /* ID column */
        .avatar-table td:nth-child(2) {
            width: 80px;
            text-align: center;
            padding: 16px 8px;
        }

        .avatar-table th:nth-child(3), /* Full Name column */
        .avatar-table td:nth-child(3) {
            text-align: center;
            min-width: 150px;
        }

        .avatar-table th:nth-child(4), /* Email column */
        .avatar-table td:nth-child(4) {
            text-align: center;
            min-width: 200px;
        }

        .avatar-table th:nth-child(5), /* Phone Number column */
        .avatar-table td:nth-child(5) {
            text-align: center;
            min-width: 140px;
        }

        .avatar-table th:nth-child(6), /* Conversation ID column */
        .avatar-table td:nth-child(6) {
            text-align: center;
            min-width: 200px;
            font-size: 12px;
        }

        .avatar-table th:nth-child(7), /* Created At column */
        .avatar-table td:nth-child(7) {
            width: 180px;
            text-align: center;
            padding: 16px 8px;
        }

        /* Center align checkbox cells */
        .avatar-table td:first-child {
            text-align: center;
        }

        /* ID column styling */
        .avatar-table td:nth-child(2) {
            font-weight: 600;
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-align: center;
        }

        /* Conversation ID wrapper alignment */
        .conversation-id-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        /* Copy button alignment */
        .copy-btn {
            padding: 4px 8px;
            border-radius: 4px;
            background: white;
            border: 2px solid transparent;
            background-image: 
                linear-gradient(white, white),
                linear-gradient(135deg, rgba(56, 177, 197, 0.5) 0%, rgba(218, 146, 44, 0.5) 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            color: #6b7280;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
            font-weight: 600;
        }

        .copy-btn:hover {
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            color: white;
            transform: scale(1.05);
            box-shadow: 0 2px 8px rgba(56, 177, 197, 0.3);
        }

        .copy-btn.copied {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
        }

        /* Badge alignment */
        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-align: center;
        }

        .badge-primary {
            background: linear-gradient(135deg, rgba(56, 177, 197, 0.15) 0%, rgba(218, 146, 44, 0.15) 100%);
            border: 2px solid transparent;
            background-image: 
                linear-gradient(135deg, rgba(56, 177, 197, 0.15) 0%, rgba(218, 146, 44, 0.15) 100%),
                linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        /* Empty state alignment */
        .table-empty {
            text-align: center;
            padding: 60px 20px !important;
            color: #9ca3af;
            font-size: 15px;
            font-weight: 500;
        }

        .table-empty::before {
            content: '📋';
            display: block;
            font-size: 48px;
            margin-bottom: 28px;
            opacity: 0.5;
        }

        /* Pagination */
        .pagination-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            background: linear-gradient(135deg, rgba(56, 177, 197, 0.03) 0%, rgba(218, 146, 44, 0.03) 100%);
            border-top: 2px solid transparent;
            background-image: 
                linear-gradient(135deg, rgba(56, 177, 197, 0.03) 0%, rgba(218, 146, 44, 0.03) 100%),
                linear-gradient(90deg, transparent 0%, #38b1c5 0%, #da922c 100%, transparent 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            gap: 20px;
        }

        .pagination-info {
            color: #fff;
            font-size: 14px;
            font-weight: 500;
        }

        .pagination-info strong {
            background-clip: text;
            font-weight: 900;
            color: #fff;
        }

        .pagination-links {
            display: flex;
            gap: 8px;
            align-items: center;
            flex-wrap: wrap;
        }

        .page-btn {
            padding: 8px 14px;
            border-radius: 6px;
            background: white;
            color: #374151;
            text-decoration: none;
            transition: all 0.3s ease;
            border: 2px solid transparent;
            background-image: 
                linear-gradient(white, white),
                linear-gradient(135deg, rgba(56, 177, 197, 0.3) 0%, rgba(218, 146, 44, 0.3) 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            font-weight: 600;
            font-size: 13px;
            white-space: nowrap;
        }

        .page-btn:hover {
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            color: white;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(56, 177, 197, 0.3);
        }

        .page-current {
            font-weight: 600;
            padding: 8px 16px;
            background: linear-gradient(135deg, rgba(56, 177, 197, 0.1) 0%, rgba(218, 146, 44, 0.1) 100%);
            border-radius: 6px;
            font-size: 13px;
            border: 2px solid transparent;
            background-image: 
                linear-gradient(135deg, rgba(56, 177, 197, 0.1) 0%, rgba(218, 146, 44, 0.1) 100%),
                linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            -webkit-background-clip: text;
            color: #fff;
        }

        /* Page Jump Section */
        .page-jump-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            background: white;
            border-radius: 8px;
            border: 2px solid transparent;
            background-image: 
                linear-gradient(white, white),
                linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
        }

        .page-jump-label {
            font-size: 13px;
            color: #6b7280;
            font-weight: 600;
            white-space: nowrap;
        }

        .page-jump-input {
            width: 60px;
            padding: 6px 10px;
            border: 2px solid #e5e7eb;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            text-align: center;
            transition: all 0.2s ease;
        }

        .page-jump-input:focus {
            outline: none;
            border: 2px solid transparent;
            background-image: 
                linear-gradient(white, white),
                linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            box-shadow: 0 0 0 3px rgba(56, 177, 197, 0.1);
        }

        .page-jump-btn {
            padding: 6px 14px;
            border-radius: 6px;
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            color: white;
            border: none;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
        }

        .page-jump-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(56, 177, 197, 0.4);
        }

        /* Copy Button for Conversation ID */
        .conversation-id-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .copy-btn {
            padding: 4px 8px;
            border-radius: 4px;
            background: white;
            border: 2px solid transparent;
            background-image: 
                linear-gradient(white, white),
                linear-gradient(135deg, rgba(56, 177, 197, 0.5) 0%, rgba(218, 146, 44, 0.5) 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            color: #6b7280;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
            font-weight: 600;
        }

        .copy-btn:hover {
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            color: white;
            transform: scale(1.05);
            box-shadow: 0 2px 8px rgba(56, 177, 197, 0.3);
        }

        .copy-btn.copied {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
        }

        /* Delete Modal Styles */
        .delete-modal {
            display: none;
            position: fixed;
            z-index: 9999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            animation: fadeIn 0.2s ease;
        }

        .delete-modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .delete-modal-content {
            background: white;
            padding: 32px;
            border-radius: 16px;
            max-width: 480px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            border: 2px solid transparent;
            background-image: 
                linear-gradient(white, white),
                linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            animation: slideUp 0.3s ease;
            position: relative;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideUp {
            from { 
                transform: translateY(30px);
                opacity: 0;
            }
            to { 
                transform: translateY(0);
                opacity: 1;
            }
        }

        .delete-modal-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
        }

        .delete-modal-icon {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }

        .delete-modal-title {
            font-size: 22px;
            font-weight: 700;
            color: #1f2937;
            margin: 0;
        }

        .delete-modal-body {
            margin-bottom: 24px;
        }

        .delete-modal-text {
            color: #6b7280;
            font-size: 15px;
            line-height: 1.6;
            margin: 0 0 16px 0;
        }

        .delete-user-details {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.05) 100%);
            padding: 16px;
            border-radius: 8px;
            border: 2px solid rgba(239, 68, 68, 0.2);
        }

        .delete-user-details p {
            margin: 8px 0;
            font-size: 14px;
            color: #374151;
        }

        .delete-user-details strong {
            color: #1f2937;
            font-weight: 600;
        }

        .delete-modal-footer {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }

        .modal-btn-cancel {
            padding: 12px 24px;
            border-radius: 8px;
            background: white;
            border: 2px solid #e5e7eb;
            color: #374151;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .modal-btn-cancel:hover {
            background: #f9fafb;
            border-color: #d1d5db;
            transform: translateY(-1px);
        }

        .modal-btn-delete {
            padding: 12px 24px;
            border-radius: 8px;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            border: none;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
        }

        .modal-btn-delete:hover {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
        }

        /* Checkbox styles */
        .user-checkbox {
            transform: scale(1.2);
            cursor: pointer;
            accent-color: #38b1c5;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
            .avatar-table {
                font-size: 13px;
            }

            .avatar-table th,
            .avatar-table td {
                padding: 12px 8px;
            }
            
            .avatar-table th:nth-child(1),
            .avatar-table td:nth-child(1) {
                padding: 12px 6px;
            }
            
            .avatar-table th:nth-child(2),
            .avatar-table td:nth-child(2) {
                padding: 12px 6px;
            }
            
            .avatar-table th:nth-child(7),
            .avatar-table td:nth-child(7) {
                padding: 12px 6px;
            }
        }

        @media (max-width: 768px) {

            .avatar-table-section {
                overflow-x: auto;
                border-radius: 8px;
            }

            .avatar-table {
                min-width: 800px;
            }
            
            .avatar-table th,
            .avatar-table td {
                padding: 12px 8px;
            }
            
            .conversation-id-wrapper {
                justify-content: flex-start;
            }

            .avatar-user-info-wrapper {
                margin: 10px;
            }

            .avatar-user-info-header {
                padding: 24px;
            }

            .avatar-user-info-header h1 {
                font-size: 24px;
            }

            .stats-grid {
                grid-template-columns: 1fr;
                gap: 12px;
            }

            .stat-card {
                padding: 20px;
            }

            .search-bulk-grid {
                grid-template-columns: 1fr;
            }
            
            .search-input-group {
                flex-direction: column;
            }

            .bulk-controls-row {
                flex-direction: column;
                gap: 12px;
                text-align: center;
            }
            
            .bulk-controls-row {
                display: flex;
                align-items: center;
                gap: 20px;
                padding: 16px;
                background: linear-gradient(135deg, rgba(56, 177, 197, 0.05) 0%, rgba(218, 146, 44, 0.05) 100%);
                border-radius: 8px;
                border: 1px solid rgba(56, 177, 197, 0.2);
            }

            .bulk-buttons {
                flex-wrap: wrap;
                justify-content: center;
                gap: 8px;
            }
            
            .button-bulk-export,
            .button-bulk-delete,
            .button-bulk-clear {
                font-size: 12px;
                padding: 6px 12px;
            }

            .select-all-control {
                justify-content: center;
            }

            .avatar-table-section {
                overflow-x: auto;
                border-radius: 8px;
            }

            .avatar-table {
                min-width: 800px;
            }

            .pagination-wrapper {
                flex-direction: column;
                gap: 16px;
                padding: 16px;
            }

            .pagination-links {
                width: 100%;
                justify-content: center;
                flex-wrap: wrap;
            }

            .page-jump-wrapper {
                width: 100%;
                justify-content: center;
            }
        }

        /* Loading State */
        .avatar-table tbody tr.loading {
            animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        /* Badge Styles for Better Data Display */
        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }

        .badge-primary {
            background: linear-gradient(135deg, rgba(56, 177, 197, 0.15) 0%, rgba(218, 146, 44, 0.15) 100%);
            border: 2px solid transparent;
            background-image: 
                linear-gradient(135deg, rgba(56, 177, 197, 0.15) 0%, rgba(218, 146, 44, 0.15) 100%),
                linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .badge-secondary {
            background: #f3f4f6;
            color: #4b5563;
        }

        /* Tooltip for long content */
        .truncate {
            max-width: 200px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    </style>

    <script>
        function copyConversationId(id, button) {
            navigator.clipboard.writeText(id).then(function() {
                const originalText = button.innerHTML;
                button.innerHTML = '✓ Copied';
                button.classList.add('copied');
                
                setTimeout(function() {
                    button.innerHTML = originalText;
                    button.classList.remove('copied');
                }, 2000);
            }).catch(function(err) {
                console.error('Failed to copy: ', err);
            });
        }

        function jumpToPage() {
            const pageInput = document.getElementById('page-jump-input');
            const pageNum = parseInt(pageInput.value);
            const totalPages = <?php echo $total_pages; ?>;
            
            if (pageNum >= 1 && pageNum <= totalPages) {
                const currentUrl = new URL(window.location.href);
                currentUrl.searchParams.set('paged', pageNum);
                window.location.href = currentUrl.toString();
            } else {
                alert('Please enter a valid page number between 1 and ' + totalPages);
            }
        }

        // Bulk selection functions
        function toggleSelectAll(checkbox) {
            const userCheckboxes = document.querySelectorAll('.user-checkbox');
            userCheckboxes.forEach(cb => {
                cb.checked = checkbox.checked;
            });
            updateBulkActions();
        }

        function updateBulkActions() {
            const selectedCheckboxes = document.querySelectorAll('.user-checkbox:checked');
            const selectedCount = document.getElementById('selected-count');
            
            selectedCount.textContent = selectedCheckboxes.length + ' selected';
            document.getElementById('select-all-checkbox').checked = selectedCheckboxes.length === document.querySelectorAll('.user-checkbox').length;
        }

        function clearSelection() {
            document.querySelectorAll('.user-checkbox').forEach(cb => {
                cb.checked = false;
            });
            document.getElementById('select-all-checkbox').checked = false;
            updateBulkActions();
        }

        // Bulk delete functions
        function showBulkDeleteModal() {
            const selectedCheckboxes = document.querySelectorAll('.user-checkbox:checked');
            document.getElementById('bulk-selected-count').textContent = selectedCheckboxes.length + ' user(s)';
            document.getElementById('bulk-delete-modal').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeBulkDeleteModal() {
            document.getElementById('bulk-delete-modal').classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        function confirmBulkDelete() {
            const selectedCheckboxes = document.querySelectorAll('.user-checkbox:checked');
            const container = document.getElementById('bulk-delete-users-container');
            container.innerHTML = '';
            
            selectedCheckboxes.forEach(checkbox => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'selected_users[]';
                input.value = checkbox.value;
                container.appendChild(input);
            });
            
            document.getElementById('bulk-delete-form').submit();
        }

        document.addEventListener('DOMContentLoaded', function() {
            const pageInput = document.getElementById('page-jump-input');
            if (pageInput) {
                pageInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        jumpToPage();
                    }
                });
            }

            // Close modal on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeBulkDeleteModal();
                }
            });

            // Close modal on backdrop click
            document.addEventListener('click', function(e) {
                if (e.target.id === 'bulk-delete-modal') {
                    closeBulkDeleteModal();
                }
            });
        });
        // Export Selected CSV function
        function exportSelectedUsers() {
            const selectedCheckboxes = document.querySelectorAll('.user-checkbox:checked');
            
            if (selectedCheckboxes.length === 0) {
                alert('Please select at least one user to export.');
                return false;
            }
            
            // Get selected user IDs
            const selectedUsers = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);
            
            // Show loading state
            const exportBtn = document.querySelector('.button-bulk-export');
            const originalText = exportBtn.innerHTML;
            exportBtn.innerHTML = '⏳ Exporting...';
            exportBtn.disabled = true;
            
            // Create a hidden form and submit it
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '<?php echo admin_url('admin-ajax.php'); ?>';
            form.style.display = 'none';
            
            // Add action
            const actionInput = document.createElement('input');
            actionInput.type = 'hidden';
            actionInput.name = 'action';
            actionInput.value = 'avatar_studio_export_csv';
            form.appendChild(actionInput);
            
            // Add nonce
            const nonceInput = document.createElement('input');
            nonceInput.type = 'hidden';
            nonceInput.name = 'nonce';
            nonceInput.value = '<?php echo wp_create_nonce('export_csv_action'); ?>';
            form.appendChild(nonceInput);
            
            // Add selected user IDs
            selectedUsers.forEach(userId => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'selected_users[]';
                input.value = userId;
                form.appendChild(input);
            });
            
            // Add form to document and submit
            document.body.appendChild(form);
            form.submit();
            
            // Remove form after submission and reset button
            setTimeout(() => {
                document.body.removeChild(form);
                exportBtn.innerHTML = originalText;
                exportBtn.disabled = false;
            }, 3000);
            
            return false;
        }

        // Export All CSV function
        function exportAllUsers() {
            // Show loading state
            const exportAllBtn = document.querySelector('.button-bulk-export-all');
            const originalText = exportAllBtn.innerHTML;
            exportAllBtn.innerHTML = '⏳ Exporting All...';
            exportAllBtn.disabled = true;
            
            // Create a hidden form and submit it
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '<?php echo admin_url('admin-ajax.php'); ?>';
            form.style.display = 'none';
            
            // Add action
            const actionInput = document.createElement('input');
            actionInput.type = 'hidden';
            actionInput.name = 'action';
            actionInput.value = 'avatar_studio_export_csv';
            form.appendChild(actionInput);
            
            // Add nonce
            const nonceInput = document.createElement('input');
            nonceInput.type = 'hidden';
            nonceInput.name = 'nonce';
            nonceInput.value = '<?php echo wp_create_nonce('export_csv_action'); ?>';
            form.appendChild(nonceInput);
            
            // Add export_all flag
            const exportAllInput = document.createElement('input');
            exportAllInput.type = 'hidden';
            exportAllInput.name = 'export_all';
            exportAllInput.value = '1';
            form.appendChild(exportAllInput);
            
            // Add form to document and submit
            document.body.appendChild(form);
            form.submit();
            
            // Remove form after submission and reset button
            setTimeout(() => {
                document.body.removeChild(form);
                exportAllBtn.innerHTML = originalText;
                exportAllBtn.disabled = false;
            }, 3000);
            
            return false;
        }
    </script>

    <div class="avatar-user-info-wrapper">
        <!-- Header -->
        <div class="avatar-user-info-header">
            <h1><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                Avatar Studio — User Info</h1>
            <p>Monitor and manage user interactions efficiently with real-time data insights.</p>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Total Users</div>
                <div class="stat-value"><?php echo number_format($total_items); ?></div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Current Page</div>
                <div class="stat-value"><?php echo $paged; ?> / <?php echo max(1, $total_pages); ?></div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Records Per Page</div>
                <div class="stat-value"><?php echo $per_page; ?></div>
            </div>
        </div>

        <!-- Search & Bulk Actions Section -->
        <div class="search-bulk-section">
            <div class="search-bulk-grid">

                <!-- Column 1: Search Bar -->
                <div class="search-column">
                    <div class="search-card">
                        <h3 class="search-title">Search Users</h3>
                        <form method="get" action="" class="search-form-wrapper">
                            <?php
                            if ( isset( $_GET['page'] ) ) {
                                $page = sanitize_text_field( wp_unslash( $_GET['page'] ) );
                                ?>
                                <input type="hidden" name="page" value="<?php echo esc_attr( $page ); ?>">
                            <?php } ?>
                            
                            <?php if (isset($_GET['orderby'])) : ?>
                                <input type="hidden" name="orderby" value="<?php echo esc_attr($_GET['orderby']); ?>">
                            <?php endif; ?>
                            <?php if (isset($_GET['order'])) : ?>
                                <input type="hidden" name="order" value="<?php echo esc_attr($_GET['order']); ?>">
                            <?php endif; ?>
                            
                            <div class="search-input-group">
                                <input 
                                    type="search" 
                                    name="s" 
                                    value="<?php echo esc_attr($search); ?>" 
                                    placeholder="Search by name, email, or mobile number..."
                                    class="search-input"
                                >
                                <button type="submit" class="search-button">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <path d="m21 21-4.3-4.3"></path>
                                    </svg>
                                    Search
                                </button>
                                <?php
                                $page = '';
                                if ( isset( $_GET['page'] ) ) {
                                    $page = sanitize_text_field( wp_unslash( $_GET['page'] ) );
                                }
                                ?>
                                <?php if ( ! empty( $search ) ) : ?>
                                    <a href="<?php echo esc_url( add_query_arg( 'page', $page ) ); ?>" class="search-clear">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                        Clear
                                    </a>
                                <?php endif; ?>

                            </div>
                        </form>
                    </div>
                </div>
                 <!-- Column 2: Bulk Actions -->
                <div class="bulk-actions-column">
                    <div class="bulk-actions-card">
                        <h3 class="bulk-actions-title">Bulk Actions</h3>
                        <div class="bulk-controls">
                            <div class="bulk-controls-row" style="display: flex; justify-content: space-between;">
                                <div class="bulk-buttons" id="bulk-buttons">
                                    <button style="border: none; padding: 0;">
                                        <span class="selected-count" id="selected-count">0 Selected</span>
                                    </button>    
                                    <button type="button" class="button-bulk-export" onclick="exportSelectedUsers()">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        Export Selected
                                    </button>
                                    <button type="button" class="button-bulk-export-all" onclick="exportAllUsers()">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        Export All
                                    </button>
                                    <button type="button" class="button-bulk-delete" onclick="showBulkDeleteModal()">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M3 6h18"></path>
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                        </svg>
                                        Delete
                                    </button>
                                    <button type="button" class="button-bulk-clear" onclick="clearSelection()">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Table Section -->
        <div class="avatar-table-section">
            <table class="avatar-table">
                <thead>
                    <tr>
                        <th>
                            <input style="width: 1.2rem; height: 1.2rem;" type="checkbox" id="select-all-checkbox" onchange="toggleSelectAll(this)">
                        </th>
                        <th>
                            <a href="<?php echo avatar_filter_url(['orderby'=>'id','order'=>$orderby==='id'?$new_order:'asc']); ?>">
                                ID
                                <?php if($orderby==='id'): ?>
                                    <span class="sort-icon"><?php echo $order==='ASC'?'▲':'▼'; ?></span>
                                <?php endif; ?>
                            </a>
                        </th>
                        <th>
                            <a href="<?php echo avatar_filter_url(['orderby'=>'full_name','order'=>$orderby==='full_name'?$new_order:'asc']); ?>">
                                Full Name
                                <?php if($orderby==='full_name'): ?>
                                    <span class="sort-icon"><?php echo $order==='ASC'?'▲':'▼'; ?></span>
                                <?php endif; ?>
                            </a>
                        </th>
                        <th>
                            <a href="<?php echo avatar_filter_url(['orderby'=>'email','order'=>$orderby==='email'?$new_order:'asc']); ?>">
                                Email Address
                                <?php if($orderby==='email'): ?>
                                    <span class="sort-icon"><?php echo $order==='ASC'?'▲':'▼'; ?></span>
                                <?php endif; ?>
                            </a>
                        </th>
                        <th>
                            <a href="<?php echo avatar_filter_url(['orderby'=>'mobile','order'=>$orderby==='mobile'?$new_order:'asc']); ?>">
                                Phone Number (US)
                                <?php if($orderby==='mobile'): ?>
                                    <span class="sort-icon"><?php echo $order==='ASC'?'▲':'▼'; ?></span>
                                <?php endif; ?>
                            </a>
                        </th>
                        <th>Conversation ID</th>
                        <th>
                            <a href="<?php echo avatar_filter_url(['orderby'=>'created_at','order'=>$orderby==='created_at'?$new_order:'desc']); ?>">
                                Created Date & Time
                                <?php if($orderby==='created_at'): ?>
                                    <span class="sort-icon"><?php echo $order==='ASC'?'▲':'▼'; ?></span>
                                <?php endif; ?>
                            </a>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($results) : ?>
                        <?php foreach ($results as $row) : ?>
                            <tr>
                                <td>
                                    <input type="checkbox" name="selected_users[]" value="<?php echo esc_attr($row->id); ?>" class="user-checkbox" onchange="updateBulkActions()">
                                </td>
                                <td><strong>AS<?php echo esc_html($row->id); ?></strong></td>
                                <td><?php echo esc_html($row->full_name); ?></td>
                                <td><?php echo esc_html($row->email); ?></td>
                                <td>
                                    <?php 
                                    // Format phone number in US format with country code: +1 (XXX) XXX-XXXX
                                    $phone_number = $row->mobile;
                                    
                                    // Remove all non-numeric characters
                                    $clean_phone = preg_replace('/[^0-9]/', '', $phone_number);
                                    
                                    // Remove leading 1 if present (US country code) to avoid duplication
                                    if (substr($clean_phone, 0, 1) === '1' && strlen($clean_phone) === 11) {
                                        $clean_phone = substr($clean_phone, 1);
                                    }
                                    
                                    // Format as +1 (XXX) XXX-XXXX if it's 10 digits
                                    if (strlen($clean_phone) === 10) {
                                        $formatted_phone = '+1 (' . substr($clean_phone, 0, 3) . ') ' . substr($clean_phone, 3, 3) . '-' . substr($clean_phone, 6, 4);
                                    } else {
                                        // Fallback: show original number with +1 prefix if not 10 digits
                                        $formatted_phone = '+1 ' . $clean_phone;
                                    }
                                    
                                    echo esc_html($formatted_phone);
                                    ?>
                                </td>
                                <td>
                                    <div class="conversation-id-wrapper">
                                        <span class="badge badge-primary truncate" title="<?php echo esc_attr($row->conversation_id); ?>">
                                            <?php echo esc_html($row->conversation_id); ?>
                                        </span>
                                        <button 
                                            class="copy-btn" 
                                            onclick="copyConversationId('<?php echo esc_js($row->conversation_id); ?>', this)"
                                            title="Copy to clipboard">
                                            📋
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <?php 
                                    // Convert the database date to MM-DD-YYYY HH:MM:SS format
                                    $created_date = DateTime::createFromFormat('Y-m-d H:i:s', $row->created_at);
                                    if ($created_date) {
                                        echo esc_html($created_date->format('m-d-Y H:i:s'));
                                    } else {
                                        // Fallback in case of date format issues
                                        echo esc_html($row->created_at);
                                    }
                                    ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else : ?>
                        <tr>
                            <td colspan="7" class="table-empty">
                                <?php echo !empty($search) ? 'No users found matching your search.' : 'No user records available yet.'; ?>
                            </td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>

            <!-- Pagination -->
            <?php if ($total_pages > 1) : ?>
                <div class="pagination-wrapper">
                    <div class="pagination-info">
                        Showing <strong><?php echo number_format($offset + 1); ?>-<?php echo number_format(min($offset + $per_page, $total_items)); ?></strong> of <strong><?php echo number_format($total_items); ?></strong> records
                    </div>
                    
                    <div class="pagination-links">
                        <?php if ($paged > 1): ?>
                            <a href="<?php echo avatar_filter_url(['paged'=>1]); ?>" class="page-btn">« First</a>
                            <a href="<?php echo avatar_filter_url(['paged'=>$paged-1]); ?>" class="page-btn">‹ Previous</a>
                        <?php endif; ?>
                        
                        <span class="page-current">Page <?php echo $paged; ?> of <?php echo $total_pages; ?></span>
                        
                        <?php if ($paged < $total_pages): ?>
                            <a href="<?php echo avatar_filter_url(['paged'=>$paged+1]); ?>" class="page-btn">Next ›</a>
                            <a href="<?php echo avatar_filter_url(['paged'=>$total_pages]); ?>" class="page-btn">Last »</a>
                        <?php endif; ?>
                    </div>

                    <div class="page-jump-wrapper">
                        <span class="page-jump-label">Go to page:</span>
                        <input 
                            type="number" 
                            id="page-jump-input" 
                            class="page-jump-input" 
                            min="1" 
                            max="<?php echo $total_pages; ?>" 
                            value="<?php echo $paged; ?>"
                            placeholder="<?php echo $paged; ?>"
                        >
                        <button class="page-jump-btn" onclick="jumpToPage()">Go</button>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- Bulk Delete Confirmation Modal -->
    <div id="bulk-delete-modal" class="delete-modal">
        <div class="delete-modal-content">
            <div class="delete-modal-header">
                <div class="delete-modal-icon">⚠️</div>
                <h2 class="delete-modal-title">Confirm Bulk Deletion</h2>
            </div>
            
            <div class="delete-modal-body">
                <p class="delete-modal-text" id="bulk-delete-message">
                    Are you sure you want to delete the selected users? This action cannot be undone.
                </p>
                
                <div class="delete-user-details">
                    <p><strong>Selected Users:</strong> <span id="bulk-selected-count"></span></p>
                    <p style="color: #dc2626; font-weight: 600;">This will permanently remove all selected user records.</p>
                </div>
            </div>
            
            <div class="delete-modal-footer">
                <button type="button" class="modal-btn-cancel" onclick="closeBulkDeleteModal()">
                    Cancel
                </button>
                <button type="button" class="modal-btn-delete" onclick="confirmBulkDelete()">
                    Delete Selected Users
                </button>
            </div>
        </div>
    </div>

    <!-- Bulk Delete Form -->
    <form id="bulk-delete-form" method="post" style="display: none;">
        <input type="hidden" name="bulk_delete" value="1">
        <input type="hidden" name="bulk_delete_nonce" value="<?php echo wp_create_nonce('bulk_delete_action'); ?>">
        <div id="bulk-delete-users-container"></div>
    </form>
    <!-- Export CSV Form -->
    <form id="export-csv-form" method="post" style="display: none;">
        <input type="hidden" name="export_csv" value="1">
        <input type="hidden" name="export_csv_nonce" value="<?php echo wp_create_nonce('export_csv_action'); ?>">
        <div id="export-users-container"></div>
    </form>
    <?php
}



