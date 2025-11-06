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
    add_submenu_page(
        'avatar_studio_main', 
        'User Info',
        'User Info',
        'manage_options',
        'avatar_studio_user_info',
        'avatar_studio_user_info_page'
    );

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
    // Handle Auto Export Settings Save
    if (isset($_POST['avatar_export_save_settings'])) {
        check_admin_referer('avatar_export_settings_nonce');
        update_option('avatar_auto_export_enabled', isset($_POST['avatar_auto_export_enabled']) ? 1 : 0);
        update_option('avatar_auto_export_interval', sanitize_text_field($_POST['avatar_auto_export_interval']));
        avatar_studio_schedule_cron(); // apply changes
        echo '<div class="updated"><p>Auto Export Settings saved!</p></div>';
    }

    $pages = get_pages();
    $export_enabled = get_option('avatar_auto_export_enabled', 1);
    $export_interval = get_option('avatar_auto_export_interval', 'every_5_minutes');
    ?>
    <div class="wrap">
        <h1>Plugin Settings</h1>
        <form method="post" action="options.php">
            <?php settings_fields('avatar_studio_main_settings_group'); ?>

            <table class="form-table">
                <tr valign="top">
                    <th scope="row">Enable</th>
                    <td>
                        <input 
                            type="checkbox" 
                            id="avatar_studio_enable" 
                            name="avatar_studio_enable" 
                            value="1" 
                            <?php checked(1, get_option('avatar_studio_enable'), true); ?> 
                        />
                        <label for="avatar_studio_enable">Enable Plugin Settings</label>
                    </td>
                </tr>
            </table>

            <h2>Tavus API Settings</h2>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row">Tavus API Key</th>
                    <td>
                        <div style="display:flex;align-items:center;gap:10px;">
                            <input 
                                type="password" 
                                id="avatar_studio_tavus_api_key" 
                                name="avatar_studio_tavus_api_key" 
                                value="<?php echo esc_attr(get_option('avatar_studio_tavus_api_key')); ?>" 
                                class="regular-text plugin-input"
                            />
                            <button type="button" class="button toggle-visibility" data-target="avatar_studio_tavus_api_key">Show</button>
                        </div>
                        <p class="description">
                            Enter your Tavus API key to fetch conversation transcripts.
                            Get it from <a href="https://platform.tavus.io" target="_blank">Tavus Platform</a>.
                        </p>
                    </td>
                </tr>
            </table>

            <table class="form-table">
                <tr valign="top">
                    <th scope="row">Enable Google Drive</th>
                    <td>
                        <input 
                            type="checkbox" 
                            id="avatar_studio_enable_google_drive" 
                            name="avatar_studio_enable_google_drive" 
                            value="1" 
                            <?php checked(1, get_option('avatar_studio_enable_google_drive'), true); ?> 
                            class="plugin-input"
                        />
                        <label for="avatar_studio_enable_google_drive">Enable Google Drive Integration</label>
                        <p class="description">Enable this to configure Google Drive settings</p>
                    </td>
                </tr>
            </table>

            <div id="google-drive-settings" style="display:none;">
                <h2>Google Drive Settings</h2>
                <p class="description">Configure Google OAuth credentials to enable transcript export to Google Drive.</p>
                <table class="form-table">
                    <tr valign="top">
                        <th scope="row">Google Client ID</th>
                        <td>
                            <input 
                                type="text" 
                                id="avatar_studio_google_client_id" 
                                name="avatar_studio_google_client_id" 
                                value="<?php echo esc_attr(get_option('avatar_studio_google_client_id')); ?>" 
                                class="regular-text plugin-input google-drive-input"
                            />
                            <p class="description">
                                Get this from <a href="https://console.cloud.google.com/apis/credentials" target="_blank">Google Cloud Console</a>.
                            </p>
                        </td>
                    </tr>

                    <tr valign="top">
                        <th scope="row">Google Client Secret</th>
                        <td>
                            <div style="display:flex;align-items:center;gap:10px;">
                                <input 
                                    type="password" 
                                    id="avatar_studio_google_client_secret" 
                                    name="avatar_studio_google_client_secret" 
                                    value="<?php echo esc_attr(get_option('avatar_studio_google_client_secret')); ?>" 
                                    class="regular-text plugin-input google-drive-input"
                                />
                                <button type="button" class="button toggle-visibility google-drive-toggle" data-target="avatar_studio_google_client_secret">Show</button>
                            </div>
                            <p class="description">OAuth 2.0 Client Secret from Google Cloud Console</p>
                        </td>
                    </tr>

                    <tr valign="top">
                        <th scope="row">Redirect URI</th>
                        <td>
                            <code style="background:#f0f0f1;padding:8px 12px;display:inline-block;border-radius:3px;">
                                <?php echo admin_url('admin.php?page=avatar_studio_sessions'); ?>
                            </code>
                            <p class="description">
                                <strong>Important:</strong> Add this exact URL to your "Authorized redirect URIs" in Google Cloud Console.
                            </p>
                        </td>
                    </tr>
                </table>

                <style>
                    .setup-instructions {
                        border-radius: 10px;
                        padding: 20px 0px;
                        max-width: 700px;
                        margin-top: 25px;
                        font-family: "Inter", Arial, sans-serif;
                        color: #1a202c;
                    }

                    .setup-instructions h3 {
                        font-size: 1rem;
                        margin-bottom: 25px;
                        font-weight: 800;
                    }

                    .setup-instructions ol {
                        counter-reset: step-counter;
                        list-style: none;
                        padding-left: 0px;
                    }

                    .setup-instructions li {
                        counter-increment: step-counter;
                        margin: 10px 0;
                        background: #e5e3ffff;
                        border: 1px solid #edf2f7;
                        border-radius: 8px;
                        padding: 12px 15px;
                        transition: all 0.2s ease-in-out;
                    }

                    .setup-instructions li::before {
                        content: counter(step-counter);
                        background: #2b6cb0;
                        color: #fff;
                        border-radius: 50%;
                        font-size: 0.9rem;
                        font-weight: bold;
                        width: 26px;
                        height: 26px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 10px;
                    }

                    .setup-instructions li:hover {
                        background: rgba(240, 245, 253, 1)ff;
                        transform: translateX(3px);
                    }

                    .setup-instructions a {
                        color: #2b6cb0;
                        text-decoration: none;
                        font-weight: 500;
                    }

                    .setup-instructions a:hover {
                        text-decoration: underline;
                    }
                </style>

                <div class="setup-instructions">
                    <h3>Setup Instructions for Google Drive</h3>
                    <ol>
                        <li>Go to <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a> and select your project (or create a new one).</li>
                        <li>Navigate to <a href="https://console.cloud.google.com/apis/library/drive.googleapis.com" target="_blank">API Library</a> and <strong>Enable the Google Drive API</strong>.</li>
                        <li>Then go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank">APIs & Services → Credentials</a>.</li>
                        <li>Create a new <strong>OAuth 2.0 Client ID</strong> (Application type: <em>Web application</em>).</li>
                        <li>Add the Redirect URI shown above to the <strong>Authorized redirect URIs</strong> list.</li>
                        <li>Copy your <strong>Client ID</strong> and <strong>Client Secret</strong> into the fields above.</li>
                        <li>Save your settings, then go to the <strong>Sessions</strong> page to connect your Google Drive.</li>
                    </ol>
                </div>
            </div>

            <?php submit_button(); ?>
        </form>

        <!-- Auto Export Settings Section -->
        <div id="auto-export-settings" style="display:none;">
            <hr style="margin: 40px 0; border: none; border-top: 2px solid #ddd;">
            
            <form method="post">
                <?php wp_nonce_field('avatar_export_settings_nonce'); ?>
                
                <h2>Auto Export Settings</h2>
                <p class="description">Configure automatic transcript export to Google Drive.</p>
                
                <table class="form-table">
                    <tr valign="top">
                        <th scope="row">Enable Auto Export</th>
                        <td>
                            <input 
                                type="checkbox" 
                                id="avatar_auto_export_enabled"
                                name="avatar_auto_export_enabled" 
                                value="1" 
                                <?php checked($export_enabled, 1); ?>
                                class="plugin-input auto-export-input"
                            >
                            <label for="avatar_auto_export_enabled">Automatically export all transcripts to Google Drive at scheduled intervals</label>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Export Interval</th>
                        <td>
                            <select 
                                name="avatar_auto_export_interval" 
                                id="avatar_auto_export_interval"
                                class="plugin-input auto-export-input"
                            >
                                <option value="every_5_minutes" <?php selected($export_interval, 'every_5_minutes'); ?>>Every 5 Minutes</option>
                                <option value="every_15_minutes" <?php selected($export_interval, 'every_15_minutes'); ?>>Every 15 Minutes</option>
                                <option value="hourly" <?php selected($export_interval, 'hourly'); ?>>Every Hour</option>
                                <option value="twicedaily" <?php selected($export_interval, 'twicedaily'); ?>>Twice Daily</option>
                                <option value="daily" <?php selected($export_interval, 'daily'); ?>>Daily</option>
                            </select>
                            <p class="description">Choose how often to automatically export transcripts.</p>
                        </td>
                    </tr>
                </table>
                
                <?php submit_button('Save Auto Export Settings', 'primary', 'avatar_export_save_settings'); ?>
            </form>
        </div>
    </div>

    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const enableCheckbox = document.getElementById("avatar_studio_enable");
            const enableGoogleDriveCheckbox = document.getElementById("avatar_studio_enable_google_drive");
            const googleDriveSettings = document.getElementById("google-drive-settings");
            const inputs = document.querySelectorAll(".plugin-input");
            const googleDriveInputs = document.querySelectorAll(".google-drive-input");
            const autoExportInputs = document.querySelectorAll(".auto-export-input");
            const toggleButtons = document.querySelectorAll(".toggle-visibility");
            const googleDriveToggleButtons = document.querySelectorAll(".google-drive-toggle");

            function toggleInputs() {
                const enabled = enableCheckbox.checked;
                inputs.forEach(input => {
                    if (!input.classList.contains('google-drive-input') && !input.classList.contains('auto-export-input')) {
                        input.disabled = !enabled;
                    }
                });
                
                // Enable/disable Google Drive checkbox based on main enable
                enableGoogleDriveCheckbox.disabled = !enabled;
                
                // Update Google Drive settings visibility
                toggleGoogleDriveSettings();
            }

            function toggleGoogleDriveSettings() {
                const mainEnabled = enableCheckbox.checked;
                const googleDriveEnabled = enableGoogleDriveCheckbox.checked;
                const shouldShow = mainEnabled && googleDriveEnabled;
                
                googleDriveSettings.style.display = shouldShow ? 'block' : 'none';
                
                // Enable/disable Google Drive inputs
                googleDriveInputs.forEach(input => input.disabled = !shouldShow);
                googleDriveToggleButtons.forEach(btn => btn.disabled = !shouldShow);
                
                // Show/hide auto export settings based on Google Drive being enabled
                toggleAutoExportSettings();
            }

            function toggleAutoExportSettings() {
                const mainEnabled = enableCheckbox.checked;
                const googleDriveEnabled = enableGoogleDriveCheckbox.checked;
                const shouldShow = mainEnabled && googleDriveEnabled;
                
                const autoExportSettings = document.getElementById("auto-export-settings");
                autoExportSettings.style.display = shouldShow ? 'block' : 'none';
                
                // Enable/disable auto export inputs
                autoExportInputs.forEach(input => input.disabled = !shouldShow);
            }

            // Initial state
            toggleInputs();
            toggleGoogleDriveSettings();
            toggleAutoExportSettings();

            enableCheckbox.addEventListener("change", toggleInputs);
            enableGoogleDriveCheckbox.addEventListener("change", toggleGoogleDriveSettings);

            // Visibility toggle for secrets
            toggleButtons.forEach(button => {
                button.addEventListener("click", function () {
                    const targetId = this.dataset.target;
                    const input = document.getElementById(targetId);
                    if (input.type === "password") {
                        input.type = "text";
                        this.textContent = "Hide";
                    } else {
                        input.type = "password";
                        this.textContent = "Show";
                    }
                });
            });
        });
    </script>

    <style>
        .toggle-visibility {
            font-size: 13px;
            line-height: 1.5;
            cursor: pointer;
        }
        #google-drive-settings {
            margin-top: 20px;
            padding: 20px;
            background: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
    </style>
    <?php
}

// Sessions page
function avatar_studio_sessions_page()
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'avatar_studio_sessions';
    
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
    
    // Get sessions from database
    $sessions = $wpdb->get_results("SELECT * FROM {$table_name} ORDER BY created_at DESC");
    
    $google_connected = get_option('avatar_studio_google_access_token') ? true : false;
    ?>
    <div class="wrap">
        <h1>Avatar Sessions</h1>
        
        <!-- Google Drive Integration Section -->
      
<div class="card google-drive-card" style="max-width: 100%; margin-bottom: 20px; background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
        <svg width="32" height="32" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
            <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
            <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
            <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
            <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
            <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
            <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
        </svg>
        <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #1d2327;">Google Drive Integration</h2>
    </div>

    <?php if ($google_connected): ?>
        <!-- Connected State -->
        <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="10" fill="#10b981"/>
                    <path d="M6 10l2.5 2.5L14 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <strong style="color: #0c4a6e; font-size: 15px;">Google Drive Connected</strong>
            </div>
            <p style="margin: 0; color: #0c4a6e; font-size: 13px;">Your account is connected and ready to export transcripts.</p>
            <p style="margin-top: 10px; color: #0369a1; font-size: 12.5px; background: #e0f2fe; padding: 8px 10px; border-radius: 6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 6px;">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" stroke-width="2"/>
                <path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Please note: Google Drive exports (transcripts and perception analysis) may take a short while to appear after a session ends.
            </p>
        </div>

        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <form method="post" action="" style="margin: 0;">
                <?php wp_nonce_field('avatar_studio_export_transcripts'); ?>
                <button type="submit" name="export_transcripts" class="button button-primary" style="height: 40px; padding: 0 20px; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Export All Transcripts
                </button>
            </form>

            <a href="<?php echo wp_nonce_url(admin_url('admin-post.php?action=avatar_studio_disconnect_google'), 'avatar_studio_disconnect_google'); ?>" 
               class="button" 
               onclick="return confirm('Are you sure you want to disconnect Google Drive? You will need to reconnect to export transcripts again.');"
               style="height: 40px; padding: 0 20px; font-size: 14px; display: inline-flex; align-items: center; gap: 8px; color: #dc2626; border-color: #dc2626;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Disconnect
            </a>
        </div>

    <?php else: ?>
        <!-- Disconnected State -->
        <div style="text-align: center; padding: 20px 0;">
            <div style="background: #f3f4f6; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                <svg width="40" height="40" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                    <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                    <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
                    <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                    <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                    <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                    <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                </svg>
            </div>
            
            <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1d2327;">Connect Your Google Drive</h3>
            <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 14px; max-width: 400px; margin-left: auto; margin-right: auto;">
                Connect your Google Drive account to automatically export and backup conversation transcripts to your drive.
            </p>

            <a href="<?php echo avatar_studio_get_google_auth_url(); ?>" 
               class="button button-primary" 
               style="height: 44px; padding: 0 24px; font-size: 15px; display: inline-flex; align-items: center; gap: 10px; background: #4285f4; border-color: #4285f4; box-shadow: 0 2px 4px rgba(66, 133, 244, 0.3);">
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
                    <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
                </svg>
                Connect with Google
            </a>

            <p style="margin: 20px 0 0 0; color: #9ca3af; font-size: 12px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle; margin-right: 4px;">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                We only request access to create files in your Google Drive
            </p>
        </div>
    <?php endif; ?>
</div>

<style>
.google-drive-card .button:hover {
    transform: translateY(-1px);
    transition: all 0.2s ease;
}

.google-drive-card .button-primary:hover {
    box-shadow: 0 4px 8px rgba(66, 133, 244, 0.4);
}

.google-drive-card .button:not(.button-primary):hover {
    border-color: #dc2626;
    color: #dc2626;
}
</style>
        <!-- Sessions Table -->
        <h2>Sessions List</h2>
        <?php if (empty($sessions)): ?>
            <p>No sessions found.</p>
        <?php else: ?>
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>Session ID</th>
                        <th>Avatar ID</th>
                        <th>User ID</th>
                        <th>Created At</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Transcript Status</th>
                        <th>Perception Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($sessions as $session): ?>
                        <tr>
                            <td><code><?php echo esc_html($session->session_id); ?></code></td>
                            <td><?php echo esc_html($session->avatar_id); ?></td>
                            <td><?php echo esc_html($session->user_id); ?></td>
                            <td><?php echo esc_html($session->created_at); ?></td>
                            <td><?php echo esc_html($session->duration ?? 'N/A'); ?></td>
                            <td>
                                <span class="dashicons dashicons-<?php echo $session->status === 'completed' ? 'yes-alt' : 'clock'; ?>"></span>
                                <?php echo esc_html($session->status); ?>
                            </td>

                            <!-- Transcript Status -->
                            <td>
                                <?php
                                $export_status = $session->export_status ?? 'not_exported';
                                $status_colors = [
                                    'exported' => 'green',
                                    'failed' => 'red',
                                    'not_exported' => 'gray'
                                ];
                                $color = $status_colors[$export_status] ?? 'gray';
                                ?>
                                <span style="color: <?php echo $color; ?>;">
                                    <?php echo esc_html(ucfirst(str_replace('_', ' ', $export_status))); ?>
                                </span>
                            </td>

                            <!-- Perception Status -->
                            <td>
                                <?php
                                $perception_status = $session->perception_status ?? 'not_processed';
                                $perception_colors = [
                                    'processed' => 'green',
                                    'unavailable' => 'blue',
                                    'failed' => 'red',
                                    'not_processed' => 'gray'
                                ];
                                $perception_color = $perception_colors[$perception_status] ?? 'gray';
                                ?>
                                <span style="color: <?php echo $perception_color; ?>;">
                                    <?php echo esc_html(ucfirst(str_replace('_', ' ', $perception_status))); ?>
                                </span>
                            </td>

                           <td>
                        <?php if ($google_connected && in_array($export_status, ['failed', 'not_exported'])): 
                            $btn_text = [
                                'exported' => '',
                                'failed' => 'Retry Export',
                                'not_exported' => 'Export'
                            ];
                            
                            // Check if one hour has passed since conversation creation
                            $created_timestamp = strtotime($session->created_at);
                            $current_timestamp = current_time('timestamp');
                            $one_hour_in_seconds = 3600;
                            $time_elapsed = $current_timestamp - $created_timestamp;
                            $is_disabled = $time_elapsed < $one_hour_in_seconds;
                            
                            // Calculate remaining time for tooltip
                            $remaining_seconds = $one_hour_in_seconds - $time_elapsed;
                            $remaining_minutes = ceil($remaining_seconds / 60);
                        ?>
                            <a href="<?php echo wp_nonce_url(admin_url('admin.php?page=avatar_studio_sessions&retry_export=' . $session->id), 'avatar_studio_retry_export_' . $session->id, 'nonce'); ?>" 
                            class="button button-small <?php echo $is_disabled ? 'disabled' : ''; ?>"
                            <?php if ($is_disabled): ?>
                                style="pointer-events: none; opacity: 0.5; cursor: not-allowed;"
                                title="Export will be available in <?php echo $remaining_minutes; ?> minute<?php echo $remaining_minutes > 1 ? 's' : ''; ?>"
                                onclick="return false;"
                            <?php endif; ?>>
                                <?php echo $btn_text[$export_status] ?? 'Export'; ?>
                            </a>
                        <?php endif; ?>
                    </td>

                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </div>
    
    <style>
        .card {
            background: #fff;
            border: 1px solid #ccd0d4;
            padding: 20px;
            box-shadow: 0 1px 1px rgba(0,0,0,.04);
        }
    </style>
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
    
    // Fetch transcript and analysis from Tavus
    $transcript_api_res = avatar_studio_fetch_tavus_transcript($session->session_id);

    $transcript = $transcript_api_res['transcript'] ?? null;
    $analysis = $transcript_api_res['analysis'] ?? null;
    
    // Track success for both exports
    $uploadTranscriptStatus = false;
    $uploadAnalysisStatus = false;
    
    // Handle Transcript Export
    if ($transcript) {
        $uploadTranscriptStatus = avatar_studio_upload_to_google_drive($session, $transcript);
        
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
                'export_error' => 'Failed to fetch transcript from Tavus'
            ],
            ['id' => $session->id]
        );
    }

    // Handle Perception Analysis Export
    if ($analysis) {
        $uploadAnalysisStatus = avatar_studio_upload_analysis_to_google_drive($session, $analysis);
        
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
                'perception_error' => 'No perception analysis data available from Tavus',
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

function avatar_studio_create_folder_hierarchy($avatar_name, $access_token) {
    // Get base URL for root folder name
    $site_url = get_site_url();
    $parsed_url = parse_url($site_url);
    $root_folder_name = $parsed_url['host'] ?? 'avatar-studio';
    
    // 1. Get or create root folder (website name)
    $root_folder_id = avatar_studio_get_or_create_drive_folder($root_folder_name, $access_token);
    if (!$root_folder_id) {
        avatar_studio_log_error('Failed to create root folder', [
            'folder_name' => $root_folder_name,
            'avatar_name' => $avatar_name
        ]);
        return false;
    }
    
    // 2. Get or create avatar name folder inside root folder
    $avatar_folder_id = avatar_studio_get_or_create_drive_folder($avatar_name, $access_token, $root_folder_id);
    if (!$avatar_folder_id) {
        avatar_studio_log_error('Failed to create avatar folder', [
            'avatar_name' => $avatar_name,
            'root_folder_id' => $root_folder_id
        ]);
        return false;
    }
    
    // 3. Get or create "Transcripts" folder inside avatar folder
    $transcripts_folder_id = avatar_studio_get_or_create_drive_folder('Transcripts', $access_token, $avatar_folder_id);
    if (!$transcripts_folder_id) {
        avatar_studio_log_error('Failed to create Transcripts folder', [
            'avatar_name' => $avatar_name,
            'avatar_folder_id' => $avatar_folder_id
        ]);
        return false;
    }
    
    // 4. Get or create "Perceptions" folder inside avatar folder
    $perceptions_folder_id = avatar_studio_get_or_create_drive_folder('Perceptions', $access_token, $avatar_folder_id);
    if (!$perceptions_folder_id) {
        avatar_studio_log_error('Failed to create Perceptions folder', [
            'avatar_name' => $avatar_name,
            'avatar_folder_id' => $avatar_folder_id
        ]);
        return false;
    }
    
    return [
        'root_folder_id' => $root_folder_id,
        'avatar_folder_id' => $avatar_folder_id,
        'transcripts_folder_id' => $transcripts_folder_id,
        'perceptions_folder_id' => $perceptions_folder_id
    ];
}

/**
 * Upload transcript PDF to Google Drive
 */
function avatar_studio_upload_to_google_drive($session, $transcript) {
    avatar_studio_get_valid_google_token();
    
    $access_token = get_option('avatar_studio_google_access_token');
    
    if (!$access_token) {
        avatar_studio_log_error('Google Drive access token not found', [
            'session_id' => $session->session_id ?? 'unknown',
            'function' => __FUNCTION__
        ]);
        return false;
    }
    
    if (!$transcript) {
        avatar_studio_log_error('No transcript found in API response', [
            'session_id' => $session->session_id ?? 'unknown',
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
            'error' => $e->getMessage(),
            'function' => __FUNCTION__
        ]);
        return false;
    }
    
    // Get avatar name from avatar_id
    global $wpdb;
    $avatars_table = $wpdb->prefix . 'avatar_studio_avatars';
    $avatar_id = $session->avatar_id ?? 'unknown';
    
    // First, try to get by avatar_id field
    $avatar_data = $wpdb->get_row($wpdb->prepare(
        "SELECT id, avatar_name FROM {$avatars_table} WHERE avatar_id = %s",
        $avatar_id
    ));
    
    // If not found by avatar_id, try by id (primary key)
    if (!$avatar_data) {
        $avatar_data = $wpdb->get_row($wpdb->prepare(
            "SELECT id, avatar_name FROM {$avatars_table} WHERE id = %s",
            $avatar_id
        ));
    }
    
    $avatar_name = $avatar_data->avatar_name ?? null;
    
    // Sanitize avatar name for folder naming (remove special characters)
    if ($avatar_name) {
        // Remove or replace characters that aren't allowed in folder names
        $avatar_name = preg_replace('/[<>:\"\/\\|?*]/', '_', $avatar_name);
        $avatar_name = trim($avatar_name);
    }
    
    // Fallback to avatar_id if name not found or empty
    if (empty($avatar_name)) {
        $avatar_name = $avatar_id;
        avatar_studio_log_error('Avatar name not found or empty, using avatar_id', [
            'avatar_id' => $avatar_id,
            'session_id' => $session->session_id ?? 'unknown',
            'function' => __FUNCTION__
        ]);
    }
    
    avatar_studio_log_error('Using avatar name for folder', [
        'avatar_id' => $avatar_id,
        'avatar_name' => $avatar_name,
        'session_id' => $session->session_id ?? 'unknown',
        'level' => 'info',
        'function' => __FUNCTION__
    ]);
    
    // Create folder hierarchy using avatar name
    $folders = avatar_studio_create_folder_hierarchy($avatar_name, $access_token);
    
    if (!$folders) {
        avatar_studio_log_error('Failed to create folder hierarchy', [
            'session_id' => $session->session_id ?? 'unknown',
            'avatar_name' => $avatar_name,
            'function' => __FUNCTION__
        ]);
        return false;
    }
    
    // Use the transcripts folder for PDF upload
    $transcripts_folder_id = $folders['transcripts_folder_id'];
    
    // Prepare filename
    $filename = "transcript_{$session->session_id}_" . date('Y-m-d_H-i-s') . ".pdf";
    
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
        'filename' => $filename,
        'folder_structure' => implode(' > ', [
            $folders['root_folder_id'],
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
function avatar_studio_upload_analysis_to_google_drive($session, $analysis) {
    avatar_studio_get_valid_google_token();
    
    $access_token = get_option('avatar_studio_google_access_token');
    
    if (!$access_token) {
        avatar_studio_log_error('Google Drive access token not found', [
            'session_id' => $session->session_id ?? 'unknown',
            'function' => __FUNCTION__
        ]);
        return false;
    }
    
    if (!$analysis) {
        avatar_studio_log_error('No analysis found in API response', [
            'session_id' => $session->session_id ?? 'unknown',
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
            'error' => $e->getMessage(),
            'function' => __FUNCTION__
        ]);
        return false;
    }
    
    // Get avatar name from avatar_id
    global $wpdb;
    $avatars_table = $wpdb->prefix . 'avatar_studio_avatars';
    $avatar_id = $session->avatar_id ?? 'unknown';
    
    // First, try to get by avatar_id field
    $avatar_data = $wpdb->get_row($wpdb->prepare(
        "SELECT id, avatar_name FROM {$avatars_table} WHERE avatar_id = %s",
        $avatar_id
    ));
    
    // If not found by avatar_id, try by id (primary key)
    if (!$avatar_data) {
        $avatar_data = $wpdb->get_row($wpdb->prepare(
            "SELECT id, avatar_name FROM {$avatars_table} WHERE id = %s",
            $avatar_id
        ));
    }
    
    $avatar_name = $avatar_data->avatar_name ?? null;
    
    // Sanitize avatar name for folder naming (remove special characters)
    if ($avatar_name) {
        $avatar_name = preg_replace('/[<>:\"\/\\|?*]/', '_', $avatar_name);
        $avatar_name = trim($avatar_name);
    }
    
    // Fallback to avatar_id if name not found or empty
    if (empty($avatar_name)) {
        $avatar_name = $avatar_id;
        avatar_studio_log_error('Avatar name not found or empty, using avatar_id', [
            'avatar_id' => $avatar_id,
            'session_id' => $session->session_id ?? 'unknown',
            'function' => __FUNCTION__
        ]);
    }
    
    avatar_studio_log_error('Using avatar name for perception analysis folder', [
        'avatar_id' => $avatar_id,
        'avatar_name' => $avatar_name,
        'session_id' => $session->session_id ?? 'unknown',
        'level' => 'info',
        'function' => __FUNCTION__
    ]);
    
    // Create folder hierarchy using avatar name
    $folders = avatar_studio_create_folder_hierarchy($avatar_name, $access_token);
    
    if (!$folders) {
        avatar_studio_log_error('Failed to create folder hierarchy for perception analysis', [
            'session_id' => $session->session_id ?? 'unknown',
            'avatar_name' => $avatar_name,
            'function' => __FUNCTION__
        ]);
        return false;
    }
    
    // Use the perceptions folder for PDF upload
    $perceptions_folder_id = $folders['perceptions_folder_id'];
    
    avatar_studio_log_error('Perception folder ID retrieved', [
        'perceptions_folder_id' => $perceptions_folder_id,
        'session_id' => $session->session_id ?? 'unknown',
        'level' => 'info',
        'function' => __FUNCTION__
    ]);
    
    // Prepare filename
    $filename = "perception_analysis_{$session->session_id}_" . date('Y-m-d_H-i-s') . ".pdf";
    
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
        'filename' => $filename,
        'folder_structure' => implode(' > ', [
            $folders['root_folder_id'],
            $folders['avatar_folder_id'],
            $folders['perceptions_folder_id']
        ]),
        'file_id' => $upload_data['id'] ?? 'unknown',
        'level' => 'info',
        'function' => __FUNCTION__
    ]);
    
    return true;
}

foreach ($sessions as $session) {
    ?>
    <tr>
        <td><?php echo esc_html($session->session_id); ?></td>
        <td><?php echo esc_html($session->avatar_id); ?></td>

        <!-- ✅ Paste your action buttons block here -->
        <td>
            <?php 
            // Transcript Export Button
            if ($google_connected && in_array($export_status, ['failed', 'not_exported'])): 
                $btn_text = [
                    'exported' => '',
                    'failed' => 'Retry Export',
                    'not_exported' => 'Export'
                ];
                
                $created_timestamp = strtotime($session->created_at);
                $current_timestamp = current_time('timestamp');
                $one_hour_in_seconds = 3600;
                $time_elapsed = $current_timestamp - $created_timestamp;
                $is_disabled = $time_elapsed < $one_hour_in_seconds;
                
                $remaining_seconds = $one_hour_in_seconds - $time_elapsed;
                $remaining_minutes = ceil($remaining_seconds / 60);
            ?>
                <a href="<?php echo wp_nonce_url(admin_url('admin.php?page=avatar_studio_sessions&retry_export=' . $session->id), 'avatar_studio_retry_export_' . $session->id, 'nonce'); ?>" 
                class="button button-small <?php echo $is_disabled ? 'disabled' : ''; ?>"
                <?php if ($is_disabled): ?>
                    style="pointer-events: none; opacity: 0.5; cursor: not-allowed;"
                    title="Export will be available in <?php echo $remaining_minutes; ?> minute<?php echo $remaining_minutes > 1 ? 's' : ''; ?>"
                    onclick="return false;"
                <?php endif; ?>>
                    <?php echo $btn_text[$export_status] ?? 'Export'; ?>
                </a>
            <?php endif; ?>
            
            <?php 
            // Perception Export Button
            $perception_status = $session->perception_status ?? 'not_processed';
            if ($google_connected && in_array($perception_status, ['failed', 'not_processed', 'unavailable'])): 
                $perception_btn_text = [
                    'processed' => '',
                    'failed' => 'Retry Perception',
                    'not_processed' => 'Export Perception',
                    'unavailable' => 'Retry Perception'
                ];
                
                $is_disabled = $time_elapsed < $one_hour_in_seconds;
            ?>
                <a href="<?php echo wp_nonce_url(admin_url('admin.php?page=avatar_studio_sessions&retry_export=' . $session->id), 'avatar_studio_retry_export_' . $session->id, 'nonce'); ?>" 
                class="button button-small <?php echo $is_disabled ? 'disabled' : ''; ?>"
                <?php if ($is_disabled): ?>
                    style="pointer-events: none; opacity: 0.5; cursor: not-allowed; margin-left: 5px;"
                    title="Perception export will be available in <?php echo $remaining_minutes; ?> minute<?php echo $remaining_minutes > 1 ? 's' : ''; ?>"
                    onclick="return false;"
                <?php else: ?>
                    style="margin-left: 5px;"
                <?php endif; ?>>
                    <?php echo $perception_btn_text[$perception_status] ?? 'Export Perception'; ?>
                </a>
            <?php endif; ?>
        </td>
    </tr>
    <?php
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
    echo '<input type="hidden" name="page" value="' . esc_attr($_GET['page']) . '">';
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
    register_setting('avatar_studio_main_settings_group', 'avatar_studio_tavus_api_key');
    register_setting('avatar_studio_main_settings_group', 'avatar_studio_google_client_id');
    register_setting('avatar_studio_main_settings_group', 'avatar_studio_google_client_secret');
    register_setting('avatar_studio_main_settings_group', 'avatar_studio_enable_google_drive');
}


// Register plugin settings, sections, and fields
function avatar_studio_settings_init()
{
    register_setting('avatar_studio_main_settings_group', 'avatar_studio_enable');  
}
add_action('admin_init', 'avatar_studio_settings_init');
?>


<?php
function avatar_studio_user_info_page() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'avatar_studio_user_info';

    $paged = isset($_GET['paged']) ? intval($_GET['paged']) : 1;
    $per_page = 10;
    $offset = ($paged - 1) * $per_page;

    $search = isset($_GET['s']) ? sanitize_text_field($_GET['s']) : '';

    $allowed_columns = ['full_name','email','mobile','country_code'];
    $orderby = (isset($_GET['orderby']) && in_array($_GET['orderby'], $allowed_columns)) ? $_GET['orderby'] : 'created_at';
    $order = (isset($_GET['order']) && strtolower($_GET['order']) === 'asc') ? 'ASC' : 'DESC';
    $new_order = ($order === 'ASC') ? 'desc' : 'asc';

    $where_sql = '';
    if (!empty($search)) {
        $where_sql = $wpdb->prepare(
            "WHERE full_name LIKE %s OR email LIKE %s OR mobile LIKE %s OR country_code LIKE %s",
            '%' . $wpdb->esc_like($search) . '%',
            '%' . $wpdb->esc_like($search) . '%',
            '%' . $wpdb->esc_like($search) . '%',
            '%' . $wpdb->esc_like($search) . '%'
        );
    }

    $total_items = $wpdb->get_var("SELECT COUNT(*) FROM {$table_name} {$where_sql}");
    $total_pages = ceil($total_items / $per_page);

    $data_query = "SELECT * FROM {$table_name} {$where_sql} ORDER BY {$orderby} {$order} LIMIT %d OFFSET %d";
    $results = $wpdb->get_results($wpdb->prepare($data_query, $per_page, $offset));

    function avatar_filter_url($params = []) {
        $query = array_merge($_GET, $params);
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

    .avatar-search-section {
        background: #f9f9f9;
        padding: 10px;
        margin-bottom: 15px;
        border: 1px solid #ddd;
    }

    .search-form-wrapper {
        display: flex;
        gap: 10px;
    }

    .search-form-wrapper input[type="search"] {
        flex: 1;
        padding: 8px;
        border: 1px solid #ccc;
    }

    .search-form-wrapper input[type="submit"],
    .search-form-wrapper .button {
        padding: 8px 12px;
        border: 1px solid #ccc;
        background: #eee;
        cursor: pointer;
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
        background: #ddd;
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

<div class="avatar-user-info-wrapper">
    <div class="avatar-user-info-header">
        <h1>👤 Avatar Studio — User Info</h1>
        <p>Monitor and manage user interactions efficiently.</p>
    </div>

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
            <div class="stat-label">Per Page</div>
            <div class="stat-value"><?php echo $per_page; ?></div>
        </div>
    </div>

    <div class="avatar-search-section">
        <form method="get" class="search-form-wrapper">
            <input type="hidden" name="page" value="avatar-studio-user-info">
            <input type="search" name="s" value="<?php echo esc_attr($search); ?>" placeholder="🔍 Search by name, email, or mobile...">
            <button type="submit" class="button-primary">Search</button>
            <?php if (!empty($search)) : ?>
                <a href="?page=avatar-studio-user-info" class="button-secondary">Clear</a>
            <?php endif; ?>
        </form>
    </div>

    <div class="avatar-table-section">
        <table class="avatar-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>
                        <a href="<?php echo avatar_filter_url(['orderby'=>'full_name','order'=>$orderby==='full_name'?$new_order:'asc']); ?>">
                            Full Name <?php if($orderby==='full_name'): ?><span class="sort-icon"><?php echo $order==='ASC'?'▲':'▼'; ?></span><?php endif; ?>
                        </a>
                    </th>
                    <th>
                        <a href="<?php echo avatar_filter_url(['orderby'=>'email','order'=>$orderby==='email'?$new_order:'asc']); ?>">
                            Email <?php if($orderby==='email'): ?><span class="sort-icon"><?php echo $order==='ASC'?'▲':'▼'; ?></span><?php endif; ?>
                        </a>
                    </th>
                    <th>
                        <a href="<?php echo avatar_filter_url(['orderby'=>'mobile','order'=>$orderby==='mobile'?$new_order:'asc']); ?>">
                            Mobile <?php if($orderby==='mobile'): ?><span class="sort-icon"><?php echo $order==='ASC'?'▲':'▼'; ?></span><?php endif; ?>
                        </a>
                    </th>
                    <th>
                        <a href="<?php echo avatar_filter_url(['orderby'=>'country_code','order'=>$orderby==='country_code'?$new_order:'asc']); ?>">
                            Country Code <?php if($orderby==='country_code'): ?><span class="sort-icon"><?php echo $order==='ASC'?'▲':'▼'; ?></span><?php endif; ?>
                        </a>
                    </th>
                    <th>Conversation ID</th>
                    <th>Created At</th>
                </tr>
            </thead>
            <tbody>
                <?php if ($results) : ?>
                    <?php foreach ($results as $row) : ?>
                        <tr>
                            <td><?php echo esc_html($row->id); ?></td>
                            <td><?php echo esc_html($row->full_name); ?></td>
                            <td><?php echo esc_html($row->email); ?></td>
                            <td><?php echo esc_html($row->mobile); ?></td>
                            <td><?php echo esc_html($row->country_code); ?></td>
                            <td><?php echo esc_html($row->conversation_id); ?></td>
                            <td><?php echo esc_html($row->created_at); ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php else : ?>
                    <tr><td colspan="7" class="table-empty">No records found.</td></tr>
                <?php endif; ?>
            </tbody>
        </table>

        <?php if ($total_pages > 1) : ?>
            <div class="pagination-wrapper">
                <div class="pagination-info">
                    Showing <?php printf('%d-%d of %d', $offset+1, min($offset+$per_page,$total_items), $total_items); ?> records
                </div>
                <div class="pagination-links">
                    <?php if ($paged>1): ?>
                        <a href="<?php echo avatar_filter_url(['paged'=>1]); ?>" class="page-btn">« First</a>
                        <a href="<?php echo avatar_filter_url(['paged'=>$paged-1]); ?>" class="page-btn">‹ Prev</a>
                    <?php endif; ?>
                    <span class="page-current">Page <?php echo $paged; ?> of <?php echo $total_pages; ?></span>
                    <?php if ($paged<$total_pages): ?>
                        <a href="<?php echo avatar_filter_url(['paged'=>$paged+1]); ?>" class="page-btn">Next ›</a>
                        <a href="<?php echo avatar_filter_url(['paged'=>$total_pages]); ?>" class="page-btn">Last »</a>
                    <?php endif; ?>
                </div>
            </div>
        <?php endif; ?>
    </div>
</div>

<style>
.avatar-user-info-wrapper {
    font-family: "Inter", system-ui, sans-serif;
    padding: 24px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
}

.avatar-user-info-header h1 {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 4px;
    color: #1a1a1a;
}
.avatar-user-info-header p {
    color: #666;
    margin-bottom: 24px;
}

.stats-grid {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
}
.stat-card {
    flex: 1;
    padding: 16px;
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    text-align: center;
}
.stat-label {
    font-size: 0.85rem;
    color: #6b7280;
    margin-bottom: 4px;
}
.stat-value {
    font-size: 1.4rem;
    font-weight: 600;
    color: #111827;
}

.avatar-search-section {
    margin-bottom: 20px;
}
.search-form-wrapper {
    display: flex;
    gap: 10px;
}
.search-form-wrapper input[type="search"] {
    flex: 1;
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    font-size: 0.95rem;
}
.button-primary {
    background: #2563eb;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 10px 18px;
    cursor: pointer;
    transition: background 0.2s ease;
}
.button-primary:hover {
    background: #1d4ed8;
}
.button-secondary {
    background: #e5e7eb;
    padding: 10px 16px;
    border-radius: 8px;
    text-decoration: none;
    color: #111827;
    transition: background 0.2s ease;
}
.button-secondary:hover {
    background: #d1d5db;
}

.avatar-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
}
.avatar-table th {
    background: #f3f4f6;
    color: #374151;
    text-align: left;
    padding: 12px;
    border-bottom: 2px solid #e5e7eb;
}
.avatar-table td {
    padding: 10px 12px;
    border-bottom: 1px solid #e5e7eb;
    color: #111827;
}
.avatar-table tr:hover {
    background: #f9fafb;
}
.table-empty {
    text-align: center;
    padding: 16px;
    color: #9ca3af;
}

.pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
}
.pagination-info {
    color: #6b7280;
}
.pagination-links {
    display: flex;
    gap: 8px;
    align-items: center;
}
.page-btn {
    padding: 6px 12px;
    border-radius: 6px;
    background: #f3f4f6;
    color: #374151;
    text-decoration: none;
    transition: background 0.2s ease;
}
.page-btn:hover {
    background: #e5e7eb;
}
.page-current {
    font-weight: 500;
    color: #2563eb;
}

.sort-icon {
    font-size: 0.8rem;
    margin-left: 4px;
    color: #6b7280;
}
</style>
<?php
}
