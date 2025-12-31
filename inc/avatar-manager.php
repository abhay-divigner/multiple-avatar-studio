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
        add_action('admin_post_save_default_avatar_thumbnail', array($this, 'handle_save_default_avatar_thumbnail'));
    }

    public function enqueue_admin_assets($hook)
    {
        if (strpos($hook, 'avatar_studio') !== false) {
            $plugin_dir = plugin_dir_url(__FILE__);
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
                    max-width: 1400px;
                    margin: 20px auto;
                    padding: 0 20px;
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
                    background: linear-gradient(135deg, #38b1c5 20%, #da922c 80%);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(56, 177, 197, 0.3);
                    color: #ffffff;
                }

                .button:before {
                    /* content: ''; */
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
                    color: #333;
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
                    color: #333;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                #close-modal-btn:hover {
                    background: #e5e7eb;
                    color: #374151;
                }

                /* Enhanced Expandable Table Styling */
                .avatar-table-wrapper {
                    background: white;
                    border: 2px solid transparent;
                    background-image: linear-gradient(white, white), linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                    background-origin: border-box;
                    background-clip: padding-box, border-box;
                    border-radius: 12px;
                    padding: 0;
                    margin: 20px 0;
                    box-shadow: 0 4px 15px rgba(56, 177, 197, 0.1);
                    transition: all 0.3s ease;
                }

                .avatar-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .avatar-table thead th {
                    background: linear-gradient(135deg, rgba(56, 177, 197, 0.1) 0%, rgba(218, 146, 44, 0.1) 100%);
                    color: #374151;
                    font-weight: 600;
                    padding: 16px 12px;
                    text-transform: uppercase;
                    font-size: 11px;
                    letter-spacing: 0.8px;
                    border-bottom: 2px solid #e5e7eb;
                    text-align: center;
                    white-space: nowrap;
                }

                .avatar-table tbody tr.main-row {
                    /* background: #ffffff; */
                    transition: all 0.2s ease;
                    /* border-bottom: 1px solid #f3f4f6; */
                    cursor: pointer;
                }

                .avatar-table tbody tr.main-row:hover {
                    background: linear-gradient(135deg, rgba(56, 177, 197, 0.03) 0%, rgba(218, 146, 44, 0.03) 100%);
                }

                .avatar-table tbody tr.main-row.expanded {
                    background: linear-gradient(135deg, rgba(56, 177, 197, 0.05) 0%, rgba(218, 146, 44, 0.05) 100%);
                    border-bottom: none;
                }

                .avatar-table tbody td {
                    padding: 16px 12px;
                    vertical-align: middle;
                    color: #1f2937;
                    font-size: 14px;
                    text-align: center;
                }

                /* Expand Icon */
                .expand-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    border-radius: 6px;
                    background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                    transition: all 0.3s ease;
                }

                .expand-icon i {
                    transition: transform 0.3s ease;
                    font-size: 16px;
                    background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    -webkit-text-fill-color: #ffffff;
                }

                .main-row.expanded .expand-icon {
                    background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                }

                .main-row.expanded .expand-icon i {
                    transform: rotate(180deg);
                    -webkit-text-fill-color: #ffffff;
                }

                /* Preview Image */
                .avatar-preview-img {
                    width: 60px;
                    height: 60px;
                    border-radius: 8px;
                    object-fit: cover;
                    border: 2px solid #e5e7eb;
                    transition: all 0.3s ease;
                }

                .avatar-preview-img:hover {
                    border-color: #38b1c5;
                    transform: scale(1.05);
                }

                /* Vendor Badge */
                .vendor-badge {
                    display: inline-block;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .vendor-badge.tavus {
                    background: linear-gradient(135deg, rgba(56, 177, 197, 0.15) 0%, rgba(56, 177, 197, 0.25) 100%);
                    color: #38b1c5;
                }

                .vendor-badge.heygen {
                    background: linear-gradient(135deg, rgba(218, 146, 44, 0.15) 0%, rgba(218, 146, 44, 0.25) 100%);
                    color: #da922c;
                }

                /* Expanded Details Row */
                .details-row {
                    display: none;
                    background: linear-gradient(135deg, rgba(56, 177, 197, 0.02) 0%, rgba(218, 146, 44, 0.02) 100%);
                    border-bottom: 1px solid #e5e7eb;
                }

                .details-row.visible {
                    display: table-row;
                }

                .details-content {
                    padding: 16px;
                    animation: expandDown 0.3s ease;
                }

                @keyframes expandDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .details-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .detail-item {
                    background: #ffffff;
                    padding: 16px;
                    border-radius: 8px;
                    border: 1px solid #c6c6c6;
                    transition: all 0.2s ease;
                }

                .detail-item:hover {
                    border-color: #c9c9c9;
                    box-shadow: 0 2px 8px rgba(56, 177, 197, 0.1);
                }

                .detail-item label {
                    display: block;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #333;
                    margin-bottom: 6px;
                }

                .detail-item .value {
                    font-size: 14px;
                    color: #1f2937;
                    word-break: break-word;
                }

                .shortcode-box {
                    background: #f9fafb;
                    padding: 4px;
                    border-radius: 4px;
                    font-family: monospace;
                    font-size: 13px;
                    color: #374151;
                    border: 1px dashed #d1d5db;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 8px;
                }

                .shortcode-box code {
                    flex: 1;
                    background: transparent;
                    padding: 0;
                }

                .copy-shortcode-btn {
                    background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                    border: none;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 11px;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                }

                .copy-shortcode-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(56, 177, 197, 0.3);
                }

                /* Action Buttons */
                .action-buttons {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .action-btn {
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    border: 1px solid;
                }

                .action-icon {
                    width: 16px;
                    height: 16px;
                }

                .action-btn.edit {
                    background: linear-gradient(135deg, rgba(56, 177, 197, 0.1) 0%, rgba(218, 146, 44, 0.1) 100%);
                    color: #38b1c5;
                    border-color: rgba(56, 177, 197, 0.3);
                }

                .action-btn.edit:hover {
                    background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                    color: white;
                    border-color: transparent;
                    transform: translateY(-2px);
                }

                .action-btn.copy {
                    background: rgba(59, 130, 246, 0.1);
                    color: #3b82f6;
                    border-color: rgba(59, 130, 246, 0.3);
                }

                .action-btn.copy:hover {
                    background: #3b82f6;
                    color: white;
                    border-color: transparent;
                    transform: translateY(-2px);
                }

                .action-btn.delete {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    border-color: rgba(239, 68, 68, 0.3);
                }

                .action-btn.delete:hover {
                    background: #ef4444;
                    color: white;
                    border-color: transparent;
                    transform: translateY(-2px);
                }

                /* ID Badge */
                .id-badge {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                    color: white;
                    font-weight: 600;
                    font-size: 13px;
                }

                /* Responsive Design */
                @media screen and (max-width: 1200px) {
                    .details-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media screen and (max-width: 782px) {
                    .wrap {
                        margin: 10px;
                    }
                    
                    .avatar-studio-header {
                        padding: 20px;
                    }
                    
                    .avatar-studio-header h1 {
                        font-size: 24px;
                    }
                    
                    .avatar-studio-content {
                        padding: 20px;
                        margin: 0 10px;
                    }
                    
                    .details-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .avatar-table thead th {
                        padding: 12px 8px;
                        font-size: 10px;
                    }
                    
                    .avatar-table tbody td {
                        padding: 12px 8px;
                        font-size: 13px;
                    }
                    
                    .avatar-preview-img {
                        width: 50px;
                        height: 50px;
                    }
                    
                    .action-buttons {
                        flex-direction: column;
                    }
                    
                    .action-btn {
                        width: 100%;
                        justify-content: center;
                    }
                    
                    .vendor-options {
                        grid-template-columns: 1fr;
                    }
                }

                @media screen and (max-width: 600px) {
                    .avatar-table thead th:nth-child(3),
                    .avatar-table tbody td:nth-child(3) {
                        display: none;
                    }
                    
                    .id-badge {
                        width: 28px;
                        height: 28px;
                        font-size: 12px;
                    }
                }

                /* Footer Fix */
                #wpfooter {
                    position: relative;
                }

                /* Empty State */
                .empty-state {
                    text-align: center;
                    padding: 32px;
                    color: #333;
                }

                .empty-state i {
                    font-size: 64px;
                    margin-bottom: 20px;
                    background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .empty-state h3 {
                    font-size: 20px;
                    margin: 0 0 10px 0;
                    color: #374151;
                }

                .empty-state p {
                    font-size: 14px;
                    margin: 0;
                }
            </style>
            
            <script>
            jQuery(document).ready(function($) {
                // Toggle expand/collapse on row click
                $('.avatar-table').on('click', '.main-row', function(e) {
                    // Don't toggle if clicking on action buttons
                    if ($(e.target).closest('.action-buttons').length > 0) {
                        return;
                    }
                    
                    var $row = $(this);
                    var $detailsRow = $row.next('.details-row');
                    
                    // Toggle current row
                    $row.toggleClass('expanded');
                    $detailsRow.toggleClass('visible');
                    
                    // Optional: Close other rows
                    // $('.main-row').not($row).removeClass('expanded');
                    // $('.details-row').not($detailsRow).removeClass('visible');
                });
                
                // Copy shortcode functionality
                $('.avatar-table').on('click', '.copy-shortcode-btn', function(e) {
                    e.stopPropagation();
                    var $btn = $(this);
                    var shortcode = $btn.data('shortcode');
                    
                    // Create temporary input
                    var $temp = $('<input>');
                    $('body').append($temp);
                    $temp.val(shortcode).select();
                    document.execCommand('copy');
                    $temp.remove();
                    
                    // Visual feedback
                    var originalText = $btn.text();
                    $btn.text('Copied!');
                    setTimeout(function() {
                        $btn.text(originalText);
                    }, 2000);
                });
            });
            </script>
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
        if (!empty($_GET['thumbnail_updated'])) {
            echo '<div class="notice notice-success is-dismissible"><p><strong>Success!</strong> Default avatar thumbnail updated successfully.</p></div>';
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
                        <img style="width: 100px" src="<?php echo get_site_url(); ?>/wp-content/plugins/AvatarStudio/assets/images/tavus_logo.png" alt="Tavus Logo">
                        </div>
                        <strong>Tavus</strong>
                    </a>
                    
                    <a href="<?php echo admin_url('admin.php?page=avatar_studio-add-avatar&vendor=heygen'); ?>" class="vendor-option">
                        <div class="vendor-icon">
                            <img style="width: 100px" src="<?php echo get_site_url(); ?>/wp-content/plugins/AvatarStudio/assets/images/heygen_logo.png" alt="Heygen Logo">
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

                // Media Library Upload for Default Avatar Thumbnail
                var mediaUploader;
                
                // Show/hide overlay on hover with smooth fade
                $('.avatar-preview-wrapper').on('mouseenter', function() {
                    $(this).find('.avatar-hover-overlay').css('opacity', '1');
                }).on('mouseleave', function() {
                    $(this).find('.avatar-hover-overlay').css('opacity', '0');
                });
                
                // Hover effect on action buttons
                $('.avatar-action-btn').on('mouseenter', function() {
                    $(this).css('transform', 'scale(1.1)');
                }).on('mouseleave', function() {
                    $(this).css('transform', 'scale(1)');
                });
                
                // Hover effect on placeholder
                $('#default-avatar-placeholder').on('mouseenter', function() {
                    $(this).css({
                        'background': '#e5e7eb',
                        'border-color': '#9ca3af'
                    });
                }).on('mouseleave', function() {
                    $(this).css({
                        'background': '#f3f4f6',
                        'border-color': '#d1d5db'
                    });
                });
                
                // Click on placeholder or edit button to upload
                $('#default-avatar-placeholder, #edit-avatar-btn').on('click', function(e) {
                    e.preventDefault();
                    openMediaUploader();
                });
                
                // Click on preview image to upload (when no overlay is shown)
                $('#default-avatar-preview').on('click', function(e) {
                    if ($(this).siblings('.avatar-hover-overlay').css('opacity') == '0') {
                        e.preventDefault();
                        openMediaUploader();
                    }
                });
                
                function openMediaUploader() {
                    if (mediaUploader) {
                        mediaUploader.open();
                        return;
                    }
                    
                    mediaUploader = wp.media({
                        title: 'Choose Default Avatar Thumbnail',
                        button: {
                            text: 'Use this image'
                        },
                        multiple: false,
                        library: {
                            type: 'image'
                        }
                    });
                    
                    mediaUploader.on('select', function() {
                        var attachment = mediaUploader.state().get('selection').first().toJSON();
                        $('#default-avatar-preview').attr('src', attachment.url).css('display', 'block');
                        $('#default-avatar-placeholder').hide();
                        $('#default-avatar-image-id').val(attachment.id);
                        $('.avatar-hover-overlay').css('display', 'flex');
                        
                        // Auto-save the image
                        $('#default-avatar-form').submit();
                    });
                    
                    mediaUploader.open();
                }
                
                $('#remove-avatar-btn').on('click', function(e) {
                    e.preventDefault();
                    $('#default-avatar-preview').attr('src', '').hide();
                    $('#default-avatar-placeholder').css('display', 'flex');
                    $('#default-avatar-image-id').val('');
                    $('.avatar-hover-overlay').css('display', 'none');
                    
                    // Auto-save the removal
                    $('#default-avatar-form').submit();
                });
            });
        </script>
        <?php

        // Get avatars from database
        $avatars = $wpdb->get_results("
            SELECT * FROM {$wpdb->prefix}avatar_studio_avatars 
            ORDER BY id DESC
        ");

        // Enhanced Avatar Table
        echo '<div class="avatar-table-wrapper">';
        
        if (empty($avatars)) {
            // Get saved default avatar thumbnail
            $default_avatar_id = get_option('avatar_studio_default_thumbnail', '');
            $default_avatar_url = '';
            if ($default_avatar_id) {
                $default_avatar_url = wp_get_attachment_url($default_avatar_id);
            }
            
            echo '<div class="empty-state" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 280px;">';
            
            // Upload Section
            echo '<form id="default-avatar-form" method="post" action="' . admin_url('admin-post.php') . '">';
            echo '<input type="hidden" name="action" value="save_default_avatar_thumbnail">';
            echo wp_nonce_field('save_default_avatar_thumbnail', 'avatar_thumbnail_nonce', true, false);
            echo '<input type="hidden" id="default-avatar-image-id" name="default_avatar_image_id" value="' . esc_attr($default_avatar_id) . '">';
            
            echo '<div class="default-avatar-upload" style="margin-bottom: 30px;">';
            echo '<div class="avatar-preview-wrapper" style="position: relative; display: inline-block;">';
            
            if ($default_avatar_url) {
                // Show image with hover overlay
                echo '<img id="default-avatar-preview" src="' . esc_url($default_avatar_url) . '" style="width: 160px; height: 160px; object-fit: cover; border-radius: 10px; display: block; cursor: pointer;" alt="Default Avatar">';
                echo '<div class="avatar-hover-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 160px; height: 160px; background: rgba(0,0,0,0.6); border-radius: 10px; opacity: 0; transition: opacity 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 12px;">';
                echo '<button type="button" class="avatar-action-btn" id="edit-avatar-btn" style="background: white; border: none; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease, box-shadow 0.2s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.15);" title="Change Image"><i class="bi bi-pencil" style="font-size: 18px; color: #333; margin: 0;"></i></button>';
                echo '<button type="button" class="avatar-action-btn" id="remove-avatar-btn" style="background: white; border: none; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease, box-shadow 0.2s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.15);" title="Remove Image"><i class="bi bi-trash" style="font-size: 18px; color: #dc2626; margin: 0;"></i></button>';
                echo '</div>';
            } else {
                // Show placeholder only
                echo '<div id="default-avatar-placeholder" style="width: 160px; height: 160px; background: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-direction: column; cursor: pointer; transition: all 0.2s ease;">';
                echo '<i class="bi bi-cloud-upload" style="font-size: 48px; color: #9ca3af; margin-bottom: 10px;"></i>';
                echo '<span style="color: #6b7280; font-size: 14px;">Click to upload your default Avatar image</span>';
                echo '</div>';
                echo '<img id="default-avatar-preview" src="" style="width: 160px; height: 160px; object-fit: cover; border-radius: 10px; display: none; cursor: pointer;" alt="Default Avatar">';
                echo '<div class="avatar-hover-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 160px; height: 160px; background: rgba(0,0,0,0.6); border-radius: 10px; opacity: 0; transition: opacity 0.2s ease; display: none; align-items: center; justify-content: center; gap: 12px;">';
                echo '<button type="button" class="avatar-action-btn" id="edit-avatar-btn" style="background: white; border: none; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease, box-shadow 0.2s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.15);" title="Change Image"><i class="bi bi-pencil" style="font-size: 18px; color: #333;"></i></button>';
                echo '<button type="button" class="avatar-action-btn" id="remove-avatar-btn" style="background: white; border: none; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease, box-shadow 0.2s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.15);" title="Remove Image"><i class="bi bi-trash" style="font-size: 18px; color: #dc2626;"></i></button>';
                echo '</div>';
            }
            
            echo '</div>';
            echo '</div>';
            echo '</form>';

            echo '<h3 style="margin: 0 0 10px 0;">No Avatars Yet</h3>';
            echo '<p style="margin: 0; color: #6b7280;">Create your first avatar to get started!</p>';
            echo '</div>';
        } else {
            echo '<table class="avatar-table">';
            echo '<thead>';
            echo '<tr>';
            echo '<th style="width: 60px;">ID</th>';
            echo '<th style="width: 100px;">Preview</th>';
            echo '<th style="width: 100px;">Vendor</th>';
            echo '<th style="width: 180px;">Avatar/Replica ID</th>';
            echo '<th style="width: 180px;">Knowledge/Persona ID</th>';
            echo '<th style="width: auto;">Actions</th>';
            echo '<th style="width: 50px;">See Details</th>';
            echo '</tr>';
            echo '</thead>';
            echo '<tbody>';
            
            foreach ($avatars as $avatar) {
                $shortcode = '[avatar_studio id="' . $avatar->id . '"]';
                $edit_url = admin_url('admin.php?page=avatar_studio-edit-avatar&id=' . $avatar->id);
                $delete_url = wp_nonce_url(admin_url('admin-post.php?action=delete_avatar&id=' . $avatar->id), 'delete_avatar_' . $avatar->id);
                $copy_url = wp_nonce_url(admin_url('admin-post.php?action=copy_avatar&id=' . $avatar->id), 'copy_avatar_' . $avatar->id);
                
                // Main Row
                echo '<tr class="main-row" data-id="' . $avatar->id . '">';
                
                // ID
                echo '<td><span class="id-badge">' . $avatar->id . '</span></td>';
                
                // Preview Image
                echo '<td>';
                if (!empty($avatar->preview_image)) {
                    echo '<img src="' . esc_url($avatar->preview_image) . '" alt="Preview" class="avatar-preview-img" />';
                } else {
                    echo '<div style="width:60px;height:60px;background:#f3f4f6;border-radius:8px;display:flex;align-items:center;justify-content:center;"><i class="bi bi-person-circle" style="font-size:32px;color:#d1d5db;"></i></div>';
                }
                echo '</td>';
                
                // Vendor Badge
                echo '<td>';
                echo '<span class="vendor-badge ' . strtolower($avatar->vendor) . '">' . esc_html(ucfirst($avatar->vendor)) . '</span>';
                echo '</td>';
                
                // Avatar/Replica ID
                echo '<td>';
                echo '<span style="font-family:monospace;font-size:12px;color:#333;">' . esc_html(substr($avatar->avatar_id, 0, 30)) . (strlen($avatar->avatar_id) > 30 ? '...' : '') . '</span>';
                echo '</td>';
                
                // Knowledge/Persona ID
                echo '<td>';
                if (!empty($avatar->knowledge_id)) {
                    echo '<span style="font-family:monospace;font-size:12px;color:#333;">' . esc_html(substr($avatar->knowledge_id, 0, 30)) . (strlen($avatar->knowledge_id) > 30 ? '...' : '') . '</span>';
                } else {
                    echo '<span style="color:#d1d5db;">—</span>';
                }
                echo '</td>';
                
                // Actions
                echo '<td>';
                echo '<div class="action-buttons">';
                echo '<a href="' . $edit_url . '" class="action-btn edit">';
                echo '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="action-icon">';
                echo '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>';
                echo '<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>';
                echo '</svg>';
                echo '</a>';
                echo '<a href="' . $copy_url . '" class="action-btn copy">';
                echo '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="action-icon">';
                echo '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>';
                echo '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>';
                echo '</svg>';
                echo '</a>';
                echo '<a href="' . $delete_url . '" class="action-btn delete">';
                echo '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="action-icon">';
                echo '<polyline points="3 6 5 6 21 6"></polyline>';
                echo '<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>';
                echo '</svg>';
                echo '</a>';
                echo '</div>';
                echo '</td>';

                // Expand Icon
                echo '<td>';
                echo '<span class="expand-icon">';
                echo '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block; width: 32px; height: 32px; padding: 2px;">';
                echo '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>';
                echo '<circle cx="12" cy="7" r="4"></circle>';
                echo '</svg>';
                echo '</span>';
                echo '</td>';
                
                echo '</tr>';
                
                // Details Row (Hidden by default)
                echo '<tr class="details-row">';
                echo '<td colspan="7">';
                echo '<div class="details-content">';
                
                echo '<div class="details-grid">';
                
                // Title
                echo '<div class="detail-item" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">';
                echo '<label>Title</label>';
                echo '<div class="value">' . (!empty($avatar->title) ? esc_html($avatar->title) : '<span style="color:#d1d5db;">Not set</span>') . '</div>';
                echo '</div>';

                // Avatar Name
                echo '<div class="detail-item" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">';
                echo '<label>Avatar Name</label>';
                echo '<div class="value">' . (!empty($avatar->avatar_name) ? esc_html($avatar->avatar_name) : '<span style="color:#d1d5db;">Not set</span>') . '</div>';
                echo '</div>';
                
                // Time Limit
                echo '<div class="detail-item" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">';
                echo '<label>Time Limit</label>';
                echo '<div class="value">' . esc_html($avatar->time_limit) . ' minutes</div>';
                echo '</div>';
                
                // Description
                if (!empty($avatar->description)) {
                    echo '<div class="detail-item" style="grid-column: span 2; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">';
                    echo '<label>Description</label>';
                    echo '<div class="value">' . esc_html($avatar->description) . '</div>';
                    echo '</div>';
                }

                // Shortcode Section
                echo '<div class="detail-item" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">';
                echo '<label>Shortcode</label>';
                echo '<div class="shortcode-box">';
                echo '<code>' . esc_html($shortcode) . '</code>';
                echo '<button class="copy-shortcode-btn" data-shortcode="' . esc_attr($shortcode) . '">Copy</button>';
                echo '</div>';
                echo '</div>';
                
                echo '</div>';
                
                echo '</div>';
                echo '</td>';
                echo '</tr>';
            }
            
            echo '</tbody>';
            echo '</table>';
        }
        
        echo '</div>';

        echo '</div>';
        echo '</div>';
    }

    // Add this handler function to save the default avatar thumbnail
    public function handle_save_default_avatar_thumbnail()
    {
        // Debug: Log that function was called
        error_log('Save avatar thumbnail function called');
        error_log('POST data: ' . print_r($_POST, true));
        
        // Verify nonce
        if (!isset($_POST['avatar_thumbnail_nonce']) || !wp_verify_nonce($_POST['avatar_thumbnail_nonce'], 'save_default_avatar_thumbnail')) {
            error_log('Nonce verification failed');
            wp_die('Security check failed');
        }

        // Check user capabilities
        if (!current_user_can('manage_options')) {
            error_log('User does not have manage_options capability');
            wp_die('Unauthorized access');
        }

        $image_id = isset($_POST['default_avatar_image_id']) ? intval($_POST['default_avatar_image_id']) : 0;
        error_log('Image ID to save: ' . $image_id);

        if ($image_id > 0) {
            $result = update_option('avatar_studio_default_thumbnail', $image_id);
            error_log('Update option result: ' . ($result ? 'success' : 'failed'));
        } else {
            $result = delete_option('avatar_studio_default_thumbnail');
            error_log('Delete option result: ' . ($result ? 'success' : 'failed'));
        }

        $redirect_url = add_query_arg('thumbnail_updated', '1', wp_get_referer());
        error_log('Redirecting to: ' . $redirect_url);
        
        wp_redirect($redirect_url);
        exit;
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
    
    // Get the next predicted ID
    $next_id = $wpdb->get_var("SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '{$wpdb->prefix}avatar_studio_avatars'");
    
    // If we can't get AUTO_INCREMENT, get the max ID and add 1
    if (!$next_id) {
        $max_id = $wpdb->get_var("SELECT MAX(id) FROM {$wpdb->prefix}avatar_studio_avatars");
        $next_id = $max_id ? $max_id + 1 : 1;
    }
    
    echo '<div class="wrap">';
    echo '<div class="avatar-studio-header">';
    echo '<h1>Create New Avatar - ' . ucfirst($vendor) . '</h1>';
    echo '<p>Configure your new ' . ucfirst($vendor) . ' avatar settings</p>';
    echo '</div>';

    echo '<div class="avatar-studio-content">';
    
    // BACK BUTTON + SHORTCODE IN SAME ROW
    $predicted_shortcode = '[avatar_studio id="' . $next_id . '"]';
    echo '<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; margin-bottom: 24px;">';
    
    // Back button on left
    echo '<div>';
    echo '<a href="' . admin_url('admin.php?page=avatar_studio-avatars') . '" class="button" id="back-to-avatar-btn">Back to Avatars</a>';
    echo '</div>';
    
    // Shortcode on right
    echo '<div style="display: flex; align-items: center; gap: 12px; padding: 12px 18px; flex-wrap: wrap; background: white; border: 1px solid transparent; background-image: linear-gradient(white, white), linear-gradient(135deg, #38b1c5 0%, #da922c 100%); background-origin: border-box; background-clip: padding-box, border-box; border-radius: 8px; box-shadow: 0 4px 15px rgba(56, 177, 197, 0.1);">';
    echo '<div style="display: flex; align-items: end; gap: 12px;">';
    echo '<div style="text-align: left;">';
    echo '<strong style="display: block; margin-bottom: 6px; color: #374151; font-size: 13px;">Shortcode</strong>';
    echo '<code style="background: #f8f9fa; padding: 8px 12px; border-radius: 4px; font-size: 13px; border: 1px solid #e5e7eb; font-weight: 600; color: #1f2937; line-height: 1; height: 28px; display: flex; align-items: center;">' . esc_html($predicted_shortcode) . '</code>';
    echo '</div>';
    echo '<button class="copy-shortcode-btn" data-shortcode="' . esc_attr($predicted_shortcode) . '" style="background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%); border: none; color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s ease; height: 45px; white-space: nowrap; display: flex; align-items: center;">Copy</button>';
    echo '</div>';
    echo '</div>';
    
    echo '</div>';
    // END BACK BUTTON + SHORTCODE ROW
    
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
    
    // BACK BUTTON + SHORTCODE IN SAME ROW
    $shortcode = '[avatar_studio id="' . $avatar->id . '"]';
    echo '<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; margin-bottom: 24px;">';
    
    // Back button on left
    echo '<div>';
    echo '<a href="' . admin_url('admin.php?page=avatar_studio-avatars') . '" class="button" id="back-to-avatar-btn">Back to Avatars</a>';
    echo '</div>';
    
    // Shortcode on right
    echo '<div style="display: flex; align-items: center; gap: 12px; padding: 12px 18px; flex-wrap: wrap; background: white; border: 1px solid transparent; background-image: linear-gradient(white, white), linear-gradient(135deg, #38b1c5 0%, #da922c 100%); background-origin: border-box; background-clip: padding-box, border-box; border-radius: 8px; box-shadow: 0 4px 15px rgba(56, 177, 197, 0.1);">';
    echo '<div style="display: flex; align-items: end; gap: 12px;">';
    echo '<div style="text-align: left;">';
    echo '<strong style="display: block; margin-bottom: 6px; color: #374151; font-size: 13px;">Shortcode</strong>';
    echo '<code style="background: #f8f9fa; padding: 8px 12px; border-radius: 4px; font-size: 13px; border: 1px solid #e5e7eb; font-weight: 600; color: #1f2937; line-height: 1; height: 28px; display: flex; align-items: center;">' . esc_html($shortcode) . '</code>';
    echo '</div>';
    echo '<button class="copy-shortcode-btn" data-shortcode="' . esc_attr($shortcode) . '" style="background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%); border: none; color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s ease; height: 45px; white-space: nowrap; display: flex; align-items: center;">Copy</button>';
    echo '</div>';
    echo '</div>';
    
    echo '</div>';
    // END BACK BUTTON + SHORTCODE ROW
    
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

        // Process headers array
        $headers_array = [];
        if (isset($_POST['headers']) && is_array($_POST['headers'])) {
            foreach ($_POST['headers'] as $header) {
                $key = isset($header['key']) ? (string) $header['key'] : '';
                $value = isset($header['value']) ? (string) $header['value'] : '';
                
                // Only add if both key and value are not empty
                if (!empty($key) && !empty($value)) {
                    $headers_array[] = [
                        'key' => $key,
                        'value' => $value
                    ];
                }
            }
        }
        
        // Convert to JSON
        $headers_json = !empty($headers_array) ? json_encode($headers_array) : null;

        // Process toast messages array
        $toast_messages_array = [];
        if (isset($_POST['toast_messages']) && is_array($_POST['toast_messages'])) {
            foreach ($_POST['toast_messages'] as $toast) {
                $message = isset($toast['message']) ? (string) $toast['message'] : '';
                $type = isset($toast['type']) ? (string) $toast['type'] : '';
                $time = isset($toast['time']) ? (string) $toast['time'] : 0;
                
                // Only add if message is not empty and time is valid
                if (!empty($message) && $time > 0) {
                    $toast_messages_array[] = [
                        'message' => sanitize_text_field($message),
                        'type' => sanitize_text_field($type),
                        'time' => $time
                    ];
                }
            }
        }

        // Sort by time ascending
        usort($toast_messages_array, function($a, $b) {
            return $a['time'] <=> $b['time'];
        });

        // Convert to JSON
        $toast_messages_json = !empty($toast_messages_array) ? json_encode($toast_messages_array) : null;

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
            'headers' => $headers_json,
            'toast_messages' => $toast_messages_json,
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
            'selected_form_id' => isset($_POST['selected_form_id']) ? intval($_POST['selected_form_id']) : 0,
            'instruction_title' => isset($_POST['instruction_title']) ? $_POST['instruction_title'] : '',
            'instruction' => isset($_POST['instruction']) ? wp_kses_post($_POST['instruction']) : '',
            'skip_instruction_video' => isset($_POST['skip_instruction_video']) ? intval($_POST['skip_instruction_video']) : 0,
            'instruction_enable' => isset($_POST['instruction_enable']) ? intval($_POST['instruction_enable']) : 0,
            'pages' => isset($_POST['pages']) ? json_encode($_POST['pages']) : null,
            'styles' => isset($_POST['styles']) ? json_encode($_POST['styles']) : null,
            'welcome_message' => isset($_POST['welcome_message']) ? json_encode($_POST['welcome_message']) : null,
            'start_button_label' => isset($_POST['start_button_label']) ? sanitize_text_field($_POST['start_button_label']) : 'Chat',
        ], ['id' => $id]);


        if ($_POST['vendor'] == "tavus" && empty($tavus_api_key)) {
            $tavus_api_key = $_POST['api_key'];
            update_option('avatar_studio_tavus_api_key', $tavus_api_key);
        }

        if ($_POST['vendor'] == "heygen" && empty($heygen_api_key)) {
            $heygen_api_key = $_POST['api_key'];
            update_option('avatar_studio_heygen_api_key', $heygen_api_key);
        }
        
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

        // Process headers array
        $headers_array = [];
        if (isset($_POST['headers']) && is_array($_POST['headers'])) {
            foreach ($_POST['headers'] as $header) {
                $key = isset($header['key']) ? (string) $header['key'] : '';
                $value = isset($header['value']) ? (string) $header['value'] : '';
                
                // Only add if both key and value are not empty
                if (!empty($key) && !empty($value)) {
                    $headers_array[] = [
                        'key' => $key,
                        'value' => $value
                    ];
                }
            }
        }
        
        // Convert to JSON
        $headers_json = !empty($headers_array) ? json_encode($headers_array) : null;

        // Process toast messages array
        $toast_messages_array = [];
        if (isset($_POST['toast_messages']) && is_array($_POST['toast_messages'])) {
            foreach ($_POST['toast_messages'] as $toast) {
                $message = isset($toast['message']) ? (string) $toast['message'] : '';
                $type = isset($toast['type']) ? (string) $toast['type'] : '';
                $time = isset($toast['time']) ? (string) $toast['time'] : 0;
                
                // Only add if message is not empty and time is valid
                if (!empty($message) && $time > 0) {
                    $toast_messages_array[] = [
                        'message' => sanitize_text_field($message),
                        'type' => sanitize_text_field($type),
                        'time' => $time
                    ];
                }
            }
        }

        // Sort by time ascending
        usort($toast_messages_array, function($a, $b) {
            return $a['time'] <=> $b['time'];
        });

        // Convert to JSON
        $toast_messages_json = !empty($toast_messages_array) ? json_encode($toast_messages_array) : null;

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
            'headers' => $headers_json,
            'toast_messages' => $toast_messages_json,
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
            'selected_form_id' => isset($_POST['selected_form_id']) ? intval($_POST['selected_form_id']) : 0,
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


        // API details (Tavus/Heygen) added at the Avatar level should feed to the main API screen and vice versa
        if ($_POST['vendor'] == "tavus" && empty($tavus_api_key)) {
            $tavus_api_key = $_POST['api_key'];
            update_option('avatar_studio_tavus_api_key', $tavus_api_key);
        }

        if ($_POST['vendor'] == "heygen" && empty($heygen_api_key)) {
            $heygen_api_key = $_POST['api_key'];
            update_option('avatar_studio_heygen_api_key', $heygen_api_key);
        }

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
            'headers' => isset($avatar->headers) ? $avatar->headers : null,
            'toast_messages' => isset($avatar->toast_messages) ? $avatar->toast_messages : null,
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
            'selected_form_id' => isset($avatar->selected_form_id) ? $avatar->selected_form_id : 0,
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