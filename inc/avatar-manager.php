<?php

if (!defined('ABSPATH'))
    exit;

class avatarManager
{
    public function __construct()
    {
        add_action('admin_menu', [$this, 'add_admin_pages']);
        add_action('admin_post_save_avatar', [$this, 'handle_save_avatar']);
        add_action('admin_post_update_avatar', [$this, 'handle_update_avatar']);
        add_action('admin_post_delete_avatar', [$this, 'handle_delete_avatar']);
        add_action('admin_post_copy_avatar', [$this, 'handle_copy_avatar']);
        add_action('admin_head', [$this, 'add_custom_styles']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
    }

    public function enqueue_admin_assets($hook)
    {
        if (strpos($hook, 'avatar_studio') !== false) {
            wp_enqueue_style('bootstrap-icons', 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css');
        }
    }

    public function add_admin_pages()
    {
        $hook = add_submenu_page(
            'avatar_studio_main',
            'Avatars',
            'Avatars',
            'manage_options',
            'avatar_studio-avatars',
            [$this, 'render_avatars_page'],
        );
        add_action("load-$hook", [$this, 'avatar_studio_avatars_add_screen_options']);
        add_filter('set-screen-option', [$this, 'avatar_studio_avatars_set_screen_option'], 10, 3);

        add_submenu_page(
            null,
            'Manage Options',
            'Manage Options',
            'manage_options',
            'avatar_studio-add-avatar',
            [$this, 'render_avatar_settings_page']
        );
        
        add_submenu_page(
            null,
            'Edit Avatar',
            'Edit Avatar',
            'manage_options',
            'avatar_studio-edit-avatar',
            [$this, 'render_edit_avatar_settings_page']
        );
    }

    public function add_custom_styles()
    {
        $screen = get_current_screen();
        if ($screen && (strpos($screen->id, 'avatar_studio') !== false)) {
            ?>
            <style>
                /* Main Container Styling */
                .wrap {
                    background: #f8f9fa;
                    padding: 0 !important;
                    margin: 20px 20px 20px 0;
                }

                /* Header Section */
                .avatar-studio-header {
                    background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                    padding: 32px 40px;
                    margin: 0 0 30px 0;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(56, 177, 197, 0.15);
                }

                .avatar-studio-header h1 {
                    color: #ffffff;
                    font-size: 32px;
                    font-weight: 600;
                    margin: 0 0 12px 0;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .avatar-studio-header p {
                    color: rgba(255, 255, 255, 0.95);
                    font-size: 15px;
                    margin: 0;
                    font-weight: 400;
                }

                /* Content Wrapper */
                .avatar-studio-content {
                    background: #f9f9f9;
                    padding: 32px;
                    border-radius: 12px;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
                    margin: 0 20px;
                    border: 1px solid #ddd;
                }

                /* Button Styling */
                .button, .button-primary, #add-avatar-btn {
                    background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                    border: none;
                    color: #ffffff;
                    padding: 12px 28px;
                    border-radius: 8px;
                    font-weight: 500;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                    box-shadow: 0 2px 8px rgba(56, 177, 197, 0.2);
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }

                .button:hover, .button-primary:hover, #add-avatar-btn:hover {
                    background: linear-gradient(135deg, #38b1c5 20%, #da922c 8  0%);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(56, 177, 197, 0.3);
                    color: #ffffff;
                }

                .button:before {
                    content: '←';
                    font-weight: bold;
                }

                #add-avatar-btn:before {
                    content: '+';
                    font-size: 18px;
                    font-weight: bold;
                }

                #back-to-avatar-btn {
                    background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                    color: #fff;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                }

                #back-to-avatar-btn:hover {
                    background: linear-gradient(135deg, #38b1c5 10%, #da922c 90%);
                }

                /* Notice Styling */
                .notice {
                    border-left: 4px solid #38b1c5;
                    background: #ffffff;
                    border-radius: 8px;
                    padding: 16px 20px;
                    margin: 20px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }

                .notice-success {
                    border-left-color: #46b450;
                    background: #f0f9f1;
                }

                /* Modal Styling */
                #vendor-selection-modal {
                    display: none;
                    position: fixed;
                    z-index: 999999;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(4px);
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .modal-content-wrapper {
                    background: #ffffff;
                    margin: 8% auto;
                    padding: 48px;
                    max-width: 600px;
                    border-radius: 16px;
                    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
                    animation: slideUp 0.3s ease;
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

                .modal-content-wrapper h2 {
                    margin: 0 0 12px 0;
                    font-size: 28px;
                    line-height: 1;
                    font-weight: 600;
                    background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .modal-subtitle {
                    color: #6b7280;
                    font-size: 15px;
                    margin: 0 0 40px 0;
                }

                .vendor-options {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                    margin-bottom: 32px;
                }

                .vendor-option {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 24px;
                    border: 2px solid #e5e7eb;
                    border-radius: 12px;
                    text-decoration: none;
                    color: #374151;
                    transition: all 0.3s ease;
                    background: #ffffff;
                }

                .vendor-option:hover {
                    border-color: #38b1c5;
                    background: linear-gradient(135deg, rgba(56, 177, 197, 0.05) 0%, rgba(218, 146, 44, 0.05) 100%);
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(56, 177, 197, 0.15);
                }

                .vendor-icon {
                    font-size: 56px;
                    margin-bottom: 10px;
                    filter: grayscale(0.3);
                    transition: all 0.3s ease;
                }

                .vendor-option:hover .vendor-icon {
                    filter: grayscale(0);
                    transform: scale(1.1);
                }

                .vendor-option strong {
                    font-size: 20px;
                    font-weight: 600;
                    color: #1f2937;
                }

                #close-modal-btn {
                    width: 100%;
                    padding: 14px;
                    background: #f3f4f6;
                    border: none;
                    border-radius: 8px;
                    color: #6b7280;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                #close-modal-btn:hover {
                    background: #e5e7eb;
                    color: #374151;
                }

                /* Table Styling */
                .widefat {
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                    width: 100%;
                    display: block;
                    overflow-x: auto;
                    background: #ffffff;
                }

                .widefat table {
                    width: 100%;
                    min-width: 1200px;
                    border-collapse: collapse;
                    background: #ffffff;
                }

                .widefat thead th {
                    background: #f9fafb;
                    color: #374151;
                    font-weight: 600;
                    padding: 14px 16px;
                    text-transform: uppercase;
                    font-size: 11px;
                    letter-spacing: 0.8px;
                    border-bottom: 2px solid #e5e7eb;
                    white-space: nowrap;
                    text-align: left;
                    min-width: 200px;
                }

                .widefat tbody tr {
                    background: #ffffff;
                    transition: background-color 0.15s ease;
                    border-bottom: 1px solid #f3f4f6;
                }

                .widefat tbody tr:hover {
                    background: #f9fafb;
                }

                .widefat tbody td {
                    padding: 14px 16px;
                    vertical-align: middle;
                    color: #1f2937;
                    font-size: 14px;
                    line-height: 1.5;
                }

                /* Column Widths */
                th#id { width: 60px; min-width: 60px; }
                th#vendor { width: 90px; min-width: 90px; }
                th#time_limit { width: 90px; min-width: 90px; }
                th#preview_image { width: 120px; min-width: 100px; }
                th#avatar_name { width: 150px; min-width: 120px; }
                th#title { width: 200px; min-width: 150px; }
                th#shortcode { width: 280px; min-width: 250px; }
                th#actions { width: 200px; min-width: 180px; }

                /* Footer Fix */
                #wpfooter {
                    position: relative;
                }

                @media screen and (max-width: 782px) {
                    .wrap {
                        margin: 10px 10px 10px 0;
                    }
                    .avatar-studio-header {
                        padding: 20px;
                    }
                    .avatar-studio-content {
                        padding: 20px;
                        margin: 0 10px;
                    }
                }
            </style>
            <?php
        }
    }

    public function render_avatars_page()
    {
        global $wpdb;

        echo '<div class="wrap">';
        
        // Header Section
        echo '<div class="avatar-studio-header">';
        echo '<h1>Avatar Management</h1>';
        echo '<p>Create, manage, and deploy your AI avatars across your website</p>';
        echo '</div>';

        // Notices
        if (!empty($_GET['updated'])) {
            echo '<div class="notice notice-success is-dismissible"><p><strong>Success!</strong> Avatar updated successfully.</p></div>';
        }
        if (!empty($_GET['saved'])) {
            echo '<div class="notice notice-success is-dismissible"><p><strong>Success!</strong> Avatar saved successfully.</p></div>';
        }
        if (!empty($_GET['deleted'])) {
            echo '<div class="notice notice-success is-dismissible"><p><strong>Success!</strong> Avatar deleted successfully.</p></div>';
        }
        if (!empty($_GET['copied'])) {
            echo '<div class="notice notice-success is-dismissible"><p><strong>Success!</strong> Avatar duplicated successfully.</p></div>';
        }

        echo '<div class="avatar-studio-content">';
        
        // Add Avatar Button
        echo '<p style="margin-bottom: 24px;"><button type="button" id="add-avatar-btn" class="button-primary">Add New Avatar</button></p>';
        
        // Vendor Selection Modal
        ?>
        <div id="vendor-selection-modal">
            <div class="modal-content-wrapper">
                <h2>Select Avatar Platform</h2>
                <p class="modal-subtitle">Choose the AI platform you want to use for your avatar</p>
                
                <div class="vendor-options">
                    <a href="<?php echo admin_url('admin.php?page=avatar_studio-add-avatar&vendor=tavus'); ?>" class="vendor-option">
                        <div class="vendor-icon">
                        <img style="width: 100px" src="<?php echo get_site_url(); ?>/wp-content/plugins/AvatarStudio(v1.0.3)/assets/images/tavus_logo.png" alt="Tavus Logo">
                        </div>

                        <strong>Tavus</strong>
                    </a>
                    
                    <a href="<?php echo admin_url('admin.php?page=avatar_studio-add-avatar&vendor=heygen'); ?>" class="vendor-option">
                        <div class="vendor-icon">
                            <img style="width: 100px" src="<?php echo get_site_url(); ?>/wp-content/plugins/AvatarStudio(v1.0.3)/assets/images/heygen_logo.png" alt="Heygen Logo">
                        </div>
                        <strong>HeyGen</strong>
                    </a>
                </div>
                
                <button type="button" id="close-modal-btn">Cancel</button>
            </div>
        </div>
        
        <script>
            jQuery(document).ready(function($) {
                $('#add-avatar-btn').on('click', function() {
                    $('#vendor-selection-modal').fadeIn(300);
                });
                
                $('#close-modal-btn').on('click', function() {
                    $('#vendor-selection-modal').fadeOut(300);
                });
                
                $('#vendor-selection-modal').on('click', function(e) {
                    if (e.target.id === 'vendor-selection-modal') {
                        $(this).fadeOut(300);
                    }
                });
            });
        </script>
        <?php

        // Avatar Table
        require_once 'avatar-table.php';
        $table = new Avatar_Studio_Avatars_Table();
        $table->prepare_items();

        echo '<div class="table-responsive-wrapper">';
        echo '<form method="get">';
        echo '<input type="hidden" name="page" value="' . esc_attr($_REQUEST['page']) . '" />';
        $table->display();
        echo '</form>';
        echo '</div>';

        echo '</div>';
        echo '</div>';
    }

    function avatar_studio_avatars_add_screen_options()
    {
        add_screen_option('per_page', [
            'label' => 'Avatars per page',
            'default' => 20,
            'option' => 'avatars_per_page'
        ]);
    }

    function avatar_studio_avatars_set_screen_option($status, $option, $value)
    {
        if ($option === 'avatars_per_page') {
            return (int) $value;
        }
        return $status;
    }

    public function render_avatar_settings_page()
    {
        global $wpdb;
        
        $vendor = isset($_GET['vendor']) ? sanitize_text_field($_GET['vendor']) : '';
        
        if (empty($vendor) || !in_array($vendor, ['tavus', 'heygen'])) {
            wp_redirect(admin_url('admin.php?page=avatar_studio-avatars'));
            exit;
        }
        
        echo '<div class="wrap">';
        echo '<div class="avatar-studio-header">';
        echo '<h1>Create New Avatar - ' . ucfirst($vendor) . '</h1>';
        echo '<p>Configure your new ' . ucfirst($vendor) . ' avatar settings</p>';
        echo '</div>';

        echo '<div class="avatar-studio-content">';
        echo '<p><a href="' . admin_url('admin.php?page=avatar_studio-avatars') . '" class="button" id="back-to-avatar-btn">Back to Avatars</a></p>';
        
        $avatar = (object)['vendor' => $vendor];
        include 'avatar-form.php';

        echo '</div>';
        echo '</div>';
    }

    public function render_edit_avatar_settings_page()
    {
        global $wpdb;

        $id = intval($_GET['id'] ?? 0);

        $avatar = $wpdb->get_row($wpdb->prepare("
            SELECT * FROM {$wpdb->prefix}avatar_studio_avatars WHERE id = %d
        ", $id));

        if (!$avatar) {
            wp_die('Avatar not found.');
        }

        echo '<div class="wrap">';
        echo '<div class="avatar-studio-header">';
        echo '<h1>Edit Avatar - ' . ucfirst($avatar->vendor) . '</h1>';
        echo '<p>Modify settings for: ' . esc_html($avatar->title) . '</p>';
        echo '</div>';

        echo '<div class="avatar-studio-content">';
        echo '<p><a href="' . admin_url('admin.php?page=avatar_studio-avatars') . '" class="button" id="back-to-avatar-btn">Back to Avatars</a></p>';
        include 'avatar-form.php';
        echo '</div>';
        echo '</div>';
    }

    public function handle_update_avatar()
    {
        if (!current_user_can('manage_options') || !check_admin_referer('update_avatar')) {
            wp_die('Not allowed');
        }

        global $wpdb;
        $id = intval($_REQUEST['id']);

        $result = $wpdb->update("{$wpdb->prefix}avatar_studio_avatars", [
            'api_key' => sanitize_text_field($_POST['api_key']),
            'vendor' => sanitize_text_field($_POST['vendor']),
            'title' => sanitize_text_field($_POST['title']),
            'description' => isset($_POST['description']) ? sanitize_textarea_field($_POST['description']) : '',
            'avatar_id' => isset($_POST['avatar_id']) ? sanitize_textarea_field($_POST['avatar_id']) : '',
            'knowledge_id' => isset($_POST['knowledge_id']) ? sanitize_textarea_field($_POST['knowledge_id']) : '',
            'preview_image' => isset($_POST['preview_image']) ? sanitize_textarea_field($_POST['preview_image']) : '',
            'thumbnail_mini' => isset($_POST['thumbnail_mini']) ? sanitize_textarea_field($_POST['thumbnail_mini']) : '',
            'thumbnail_medium' => isset($_POST['thumbnail_medium']) ? sanitize_textarea_field($_POST['thumbnail_medium']) : '',
            'thumbnail_large' => isset($_POST['thumbnail_large']) ? sanitize_textarea_field($_POST['thumbnail_large']) : '',
            'active_thumbnail' => isset($_POST['active_thumbnail']) ? sanitize_textarea_field($_POST['active_thumbnail']) : 'medium',
            'avatar_name' => isset($_POST['avatar_name']) ? sanitize_textarea_field($_POST['avatar_name']) : '',
            'voice_emotion' => isset($_POST['voice_emotion']) ? sanitize_textarea_field($_POST['voice_emotion']) : '',
            'RAG_API_URL' => isset($_POST['RAG_API_URL']) ? sanitize_textarea_field($_POST['RAG_API_URL']) : '',
            'deepgramKEY' => isset($_POST['deepgramKEY']) ? sanitize_textarea_field($_POST['deepgramKEY']) : '',
            'time_limit' => isset($_POST['time_limit']) ? intval($_POST['time_limit']) : 60,
            'open_on_desktop' => isset($_POST['open_on_desktop']) ? intval($_POST['open_on_desktop']) : 0,
            'show_on_mobile' => isset($_POST['show_on_mobile']) ? intval($_POST['show_on_mobile']) : 0,
            'livekit_enable' => isset($_POST['livekit_enable']) ? intval($_POST['livekit_enable']) : 0,
            'video_enable' => isset($_POST['video_enable']) ? intval($_POST['video_enable']) : 0,
            'chat_only' => isset($_POST['chat_only']) ? intval($_POST['chat_only']) : 0,
            'disclaimer_title' => isset($_POST['disclaimer_title']) ? $_POST['disclaimer_title'] : '',
            'disclaimer' => isset($_POST['disclaimer']) ? $_POST['disclaimer'] : '',
            'disclaimer_enable' => isset($_POST['disclaimer_enable']) ? intval($_POST['disclaimer_enable']) : 0,
            'user_form_enable' => isset($_POST['user_form_enable']) ? intval($_POST['user_form_enable']) : 0,
            'instruction_title' => isset($_POST['instruction_title']) ? $_POST['instruction_title'] : '',
            'instruction' => isset($_POST['instruction']) ? wp_kses_post($_POST['instruction']) : '',
            'skip_instruction_video' => isset($_POST['skip_instruction_video']) ? intval($_POST['skip_instruction_video']) : 0,
            'instruction_enable' => isset($_POST['instruction_enable']) ? intval($_POST['instruction_enable']) : 0,
            'pages' => isset($_POST['pages']) ? json_encode($_POST['pages']) : null,
            'styles' => isset($_POST['styles']) ? json_encode($_POST['styles']) : null,
            'welcome_message' => isset($_POST['welcome_message']) ? json_encode($_POST['welcome_message']) : null,
            'start_button_label' => isset($_POST['start_button_label']) ? sanitize_text_field($_POST['start_button_label']) : 'Chat',
        ], ['id' => $id]);

        if ($result === false) {
            echo 'Update failed: ' . $wpdb->last_error;
        } else {
            $this->clearCache();
            wp_redirect(admin_url("admin.php?page=avatar_studio-edit-avatar&id=$id&updated=1"));
        }
        exit;
    }

    public function handle_save_avatar()
    {
        if (!current_user_can('manage_options') || !check_admin_referer('save_avatar')) {
            wp_die('Not allowed');
        }

        global $wpdb;

        $data = [
            'api_key' => sanitize_text_field($_POST['api_key']),
            'vendor' => sanitize_text_field($_POST['vendor']),
            'title' => sanitize_text_field($_POST['title']),
            'description' => isset($_POST['description']) ? sanitize_textarea_field($_POST['description']) : '',
            'avatar_id' => isset($_POST['avatar_id']) ? sanitize_textarea_field($_POST['avatar_id']) : '',
            'knowledge_id' => isset($_POST['knowledge_id']) ? sanitize_textarea_field($_POST['knowledge_id']) : '',
            'preview_image' => isset($_POST['preview_image']) ? sanitize_textarea_field($_POST['preview_image']) : '',
            'thumbnail_mini' => isset($_POST['thumbnail_mini']) ? sanitize_textarea_field($_POST['thumbnail_mini']) : '',
            'thumbnail_medium' => isset($_POST['thumbnail_medium']) ? sanitize_textarea_field($_POST['thumbnail_medium']) : '',
            'thumbnail_large' => isset($_POST['thumbnail_large']) ? sanitize_textarea_field($_POST['thumbnail_large']) : '',
            'active_thumbnail' => isset($_POST['active_thumbnail']) ? sanitize_textarea_field($_POST['active_thumbnail']) : 'medium',
            'avatar_name' => isset($_POST['avatar_name']) ? sanitize_textarea_field($_POST['avatar_name']) : '',
            'voice_emotion' => isset($_POST['voice_emotion']) ? sanitize_textarea_field($_POST['voice_emotion']) : '',
            'RAG_API_URL' => isset($_POST['RAG_API_URL']) ? sanitize_textarea_field($_POST['RAG_API_URL']) : '',
            'deepgramKEY' => isset($_POST['deepgramKEY']) ? sanitize_textarea_field($_POST['deepgramKEY']) : '',
            'time_limit' => isset($_POST['time_limit']) ? intval($_POST['time_limit']) : 60,
            'open_on_desktop' => isset($_POST['open_on_desktop']) ? intval($_POST['open_on_desktop']) : 0,
            'show_on_mobile' => isset($_POST['show_on_mobile']) ? intval($_POST['show_on_mobile']) : 0,
            'livekit_enable' => isset($_POST['livekit_enable']) ? intval($_POST['livekit_enable']) : 0,
            'video_enable' => isset($_POST['video_enable']) ? intval($_POST['video_enable']) : 0,
            'chat_only' => isset($_POST['chat_only']) ? intval($_POST['chat_only']) : 0,
            'disclaimer_title' => isset($_POST['disclaimer_title']) ? $_POST['disclaimer_title'] : '',
            'disclaimer' => isset($_POST['disclaimer']) ? $_POST['disclaimer'] : '',
            'disclaimer_enable' => isset($_POST['disclaimer_enable']) ? intval($_POST['disclaimer_enable']) : 0,
            'user_form_enable' => isset($_POST['user_form_enable']) ? intval($_POST['user_form_enable']) : 0,
            'instruction_title' => isset($_POST['instruction_title']) ? $_POST['instruction_title'] : '',
            'instruction' => isset($_POST['instruction']) ? wp_kses_post($_POST['instruction']) : '',
            'skip_instruction_video' => isset($_POST['skip_instruction_video']) ? intval($_POST['skip_instruction_video']) : 0,
            'instruction_enable' => isset($_POST['instruction_enable']) ? intval($_POST['instruction_enable']) : 0,
            'pages' => isset($_POST['pages']) ? json_encode($_POST['pages']) : null,
            'styles' => isset($_POST['styles']) ? json_encode($_POST['styles']) : null,
            'welcome_message' => isset($_POST['welcome_message']) ? json_encode($_POST['welcome_message']) : null,
            'start_button_label' => isset($_POST['start_button_label']) ? sanitize_text_field($_POST['start_button_label']) : 'Chat',
        ];
        
        $id = isset($_REQUEST['id']) ? intval($_REQUEST['id']) : 0;

        if ($id > 0) {
            // Update
            $result = $wpdb->update("{$wpdb->prefix}avatar_studio_avatars", $data, ['id' => $id]);
            if ($result === false) {
                echo 'Failed: ' . $wpdb->last_error;
            } else {
                $this->clearCache();
                wp_redirect(admin_url("admin.php?page=avatar_studio-edit-avatar&id=$id&updated=1"));
            }
        } else {
            // Insert new
            $result = $wpdb->insert("{$wpdb->prefix}avatar_studio_avatars", $data);
            if ($result === false) {
                echo 'Failed: ' . $wpdb->last_error;
            } else {
                $this->clearCache();
                $id = $wpdb->insert_id;
                wp_redirect(admin_url("admin.php?page=avatar_studio-edit-avatar&id=$id&saved=1"));
            }
        }
        exit;
    }

    public function handle_delete_avatar()
    {
        if (!current_user_can('manage_options')) {
            wp_die('Permission denied.');
        }

        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

        if (!$id || !check_admin_referer('delete_avatar_' . $id)) {
            wp_die('Invalid request.');
        }

        global $wpdb;
        $wpdb->delete("{$wpdb->prefix}avatar_studio_avatars", ['id' => $id]);

        wp_redirect(admin_url('admin.php?page=avatar_studio-avatars&deleted=1'));
        exit;
    }

    public function handle_copy_avatar()
    {
        if (!current_user_can('manage_options')) {
            wp_die('Permission denied.');
        }

        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

        if (!$id || !check_admin_referer('copy_avatar_' . $id)) {
            wp_die('Invalid request.');
        }

        global $wpdb;
        $avatar = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$wpdb->prefix}avatar_studio_avatars WHERE id = %d", $id));

        if (!$avatar) {
            wp_die('Avatar not found.');
        }

        $data = [
            'api_key' => isset($avatar->api_key) ? $avatar->api_key : '',
            'vendor' => isset($avatar->vendor) ? $avatar->vendor : '',
            'title' => isset($avatar->title) ? $avatar->title . ' (Copy)' : 'Copy',
            'description' => isset($avatar->description) ? $avatar->description : '',
            'avatar_id' => isset($avatar->avatar_id) ? $avatar->avatar_id : '',
            'knowledge_id' => isset($avatar->knowledge_id) ? $avatar->knowledge_id : '',
            'preview_image' => isset($avatar->preview_image) ? $avatar->preview_image : '',
            'thumbnail_mini' => isset($avatar->thumbnail_mini) ? $avatar->thumbnail_mini : '',
            'thumbnail_medium' => isset($avatar->thumbnail_medium) ? $avatar->thumbnail_medium : '',
            'thumbnail_large' => isset($avatar->thumbnail_large) ? $avatar->thumbnail_large : '',
            'active_thumbnail' => isset($avatar->active_thumbnail) ? $avatar->active_thumbnail : 'medium',
            'avatar_name' => isset($avatar->avatar_name) ? $avatar->avatar_name : '',
            'voice_emotion' => isset($avatar->voice_emotion) ? $avatar->voice_emotion : '',
            'RAG_API_URL' => isset($avatar->RAG_API_URL) ? $avatar->RAG_API_URL : '',
            'deepgramKEY' => isset($avatar->deepgramKEY) ? $avatar->deepgramKEY : '',
            'time_limit' => isset($avatar->time_limit) ? $avatar->time_limit : 60,
            'open_on_desktop' => isset($avatar->open_on_desktop) ? $avatar->open_on_desktop : 0,
            'show_on_mobile' => isset($avatar->show_on_mobile) ? $avatar->show_on_mobile : 0,
            'livekit_enable' => isset($avatar->livekit_enable) ? $avatar->livekit_enable : 0,
            'video_enable' => isset($avatar->video_enable) ? $avatar->video_enable : 0,
            'chat_only' => isset($avatar->chat_only) ? $avatar->chat_only : 0,
            'disclaimer_title' => isset($avatar->disclaimer_title) ? $avatar->disclaimer_title : '',
            'disclaimer' => isset($avatar->disclaimer) ? $avatar->disclaimer : '',
            'disclaimer_enable' => isset($avatar->disclaimer_enable) ? $avatar->disclaimer_enable : 0,
            'user_form_enable' => isset($avatar->user_form_enable) ? $avatar->user_form_enable : 0,
            'instruction_title' => isset($avatar->instruction_title) ? $avatar->instruction_title : '',
            'instruction' => isset($avatar->instruction) ? $avatar->instruction : '',
            'skip_instruction_video' => isset($avatar->skip_instruction_video) ? $avatar->skip_instruction_video : 0,
            'instruction_enable' => isset($avatar->instruction_enable) ? $avatar->instruction_enable : 0,
            'pages' => isset($avatar->pages) ? $avatar->pages : null,
            'styles' => isset($avatar->styles) ? $avatar->styles : null,
            'welcome_message' => isset($avatar->welcome_message) ? $avatar->welcome_message : null,
            'start_button_label' => isset($avatar->start_button_label) ? $avatar->start_button_label : 'Chat',
        ];
        
        $result = $wpdb->insert("{$wpdb->prefix}avatar_studio_avatars", $data);
        
        if ($result === false) {
            echo 'Failed: ' . $wpdb->last_error;
            wp_redirect(admin_url('admin.php?page=avatar_studio-avatars&copied=0'));
        } else {
            $new_id = $wpdb->insert_id;
            wp_redirect(admin_url('admin.php?page=avatar_studio-edit-avatar&id=' . $new_id . '&copied=1'));
        }
        
        exit;
    }

    public function getAvataravatars()
    {
        global $wpdb;

        $avatars = $wpdb->get_results("
            SELECT id, vendor, api_key, title, description, avatar_id, knowledge_id, preview_image, thumbnail_mini, thumbnail_medium, thumbnail_large, active_thumbnail, avatar_name, time_limit, voice_emotion, pages, styles, open_on_desktop, show_on_mobile, livekit_enable, RAG_API_URL, deepgramKEY, welcome_message   
            FROM {$wpdb->prefix}avatar_studio_avatars 
            ORDER BY title ASC
        ");

        wp_send_json_success($avatars);
    }

    public function getAvataravatar()
    {
        global $wpdb;

        $avatarID = isset($_REQUEST['id']) ? intval($_REQUEST['id']) : 0;

        if (!$avatarID) {
            wp_send_json_error(['message' => 'Missing avatar ID'], 400);
        }

        $avatar = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$wpdb->prefix}avatar_studio_avatars WHERE id = %d", $avatarID));

        if (!$avatar) {
            wp_send_json_error(['message' => 'avatar not found'], 404);
        }
        wp_send_json_success($avatar);
    }

    function clearCache()
    {
        setcookie('wpengine_cache_disable', '1', time() + 3600, '/');
        if (!defined('DONOTCACHEPAGE')) {
            define('DONOTCACHEPAGE', true);
        }

        if (function_exists('Elementor\Plugin')) {
            \Elementor\Plugin::$instance->files_manager->clear_cache();
            \Elementor\Plugin::$instance->files_manager->regenerate_css();
            delete_transient('elementor_css_files');
        }
        if (function_exists('wp_cache_flush')) {
            wp_cache_flush();
        }
    }
}

$avatarManager = new avatarManager();

add_filter('wp_kses_allowed_html', 'allow_custom_html_tags', 10, 2);
function allow_custom_html_tags($allowed_tags, $context)
{
    if ($context === 'post') {
        $allowed_tags['iframe'] = [
            'src' => true, 'height' => true, 'width' => true,
            'frameborder' => true, 'allow' => true, 'allowfullscreen' => true,
            'style' => true, 'title' => true, 'referrerpolicy' => true,
        ];
        $allowed_tags['script'] = [
            'type' => true, 'src' => true, 'async' => true,
            'defer' => true, 'crossorigin' => true, 'integrity' => true,
        ];
        $allowed_tags['link'] = [
            'rel' => true, 'href' => true, 'type' => true,
            'media' => true, 'integrity' => true, 'crossorigin' => true,
        ];
    }
    return $allowed_tags;
}

add_filter('tiny_mce_before_init', 'allow_custom_tags_in_editor');
function allow_custom_tags_in_editor($init)
{
    $extended = 'iframe[src|width|height|frameborder|allow|allowfullscreen|style|title|referrerpolicy],'
        . 'script[type|src|async|defer|crossorigin|integrity],'
        . 'link[rel|href|type|media|integrity|crossorigin]';

    $init['extended_valid_elements'] = $extended;
    $init['valid_children'] = '+body[iframe|script|link]';
    return $init;
}