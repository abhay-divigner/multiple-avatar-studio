<?php

if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_enqueue_scripts', function ($hook) {

    wp_enqueue_script(
        'avatar-form-script',
        plugin_dir_url(__FILE__) . 'assets/js/chat-window-page.js',
        ['jquery', 'select2'],
        AvatarStudioVersion,
        true
    );
});


function enqueue_avatar_settings_scripts() {
    wp_enqueue_script(
        'avatar-settings',
        plugin_dir_url(__FILE__) . 'assets/js/avatar-settings.js',
        array('jquery'),
        '1.0.6',
        true
    );
}
add_action('admin_enqueue_scripts', 'enqueue_avatar_settings_scripts');

function avatar_studio_enqueue_dynamic_styles() {
    global $styles;
    
    // Only enqueue if we have styles to add
    if ($styles && is_array($styles)) {
        // Generate the CSS
        require_once(plugin_dir_path(__FILE__) . 'dynamic-styles.php');
        $dynamic_css = avatar_studio_generate_dynamic_css();
        
        // Add inline styles to WordPress
        wp_register_style('avatar-studio-dynamic', false);
        wp_enqueue_style('avatar-studio-dynamic');
        wp_add_inline_style('avatar-studio-dynamic', $dynamic_css);
    }
}
add_action('wp_enqueue_scripts', 'avatar_studio_enqueue_dynamic_styles');

function avatar_studio_admin_styles() {
    // Only load on our plugin's admin pages
    $current_page = isset($_GET['page']) ? $_GET['page'] : '';
    
    $our_pages = [
        'avatar_studio_main',
        'avatar_studio_sessions', 
        'avatar_studio_user_info'
    ];
    
    if (in_array($current_page, $our_pages)) {
        wp_enqueue_style(
            'avatar-studio-admin-css',
            plugin_dir_url(__FILE__) . 'assets/css/option.css',
            [], 
            '1.0.6' 
        );
    }
}
add_action('admin_enqueue_scripts', 'avatar_studio_admin_styles');

// enqueue-admin-scripts.php or add to your main plugin file
function avatar_studio_enqueue_admin_scripts($hook) {
    // Only load scripts on our plugin pages
    $plugin_pages = [
        'toplevel_page_avatar_studio_main',
        'avatar-studio_page_avatar_studio_sessions',
        'avatar-studio_page_avatar_studio_user_info',
        'avatar-studio_page_avatar_studio-avatars',
        'admin_page_avatar_studio-add-avatar',
        'admin_page_avatar_studio-edit-avatar'
    ];
    
    if (!in_array($hook, $plugin_pages)) {
        return;
    }
    
    $plugin_url = plugin_dir_url(__FILE__);
    
    // Enqueue common admin CSS
    wp_enqueue_style('avatar-studio-admin', $plugin_url . 'assets/css/option.css');

    // Load WordPress media library for image uploads
    if (function_exists('wp_enqueue_media')) {
        wp_enqueue_media();
    }
    
    // Enqueue based on page
    switch ($hook) {
        case 'toplevel_page_avatar_studio_main':
            wp_enqueue_script('avatar-studio-main-settings', $plugin_url . 'assets/js/admin-main-settings.js', ['jquery'], '1.0.6', true);
            break;
            
        case 'avatar-studio_page_avatar_studio_sessions':
            wp_enqueue_script('avatar-studio-sessions', $plugin_url . 'assets/js/admin-sessions.js', ['jquery'], '1.0.6', true);
            
            // Pass PHP variables to JavaScript
            wp_localize_script('avatar-studio-sessions', 'avatarStudioSessionsVars', [
                'total_pages' => $GLOBALS['total_pages'] ?? 0,
                'ajax_url' => admin_url('admin-ajax.php')
            ]);
            break;
            
        case 'avatar-studio_page_avatar_studio_user_info':
            wp_enqueue_script('avatar-studio-user-info', $plugin_url . 'assets/js/admin-user-info.js', ['jquery'], '1.0.6', true);
            
            // Pass PHP variables to JavaScript
            wp_localize_script('avatar-studio-user-info', 'avatarStudioUserInfoVars', [
                'total_pages' => $GLOBALS['total_pages'] ?? 0,
                'ajax_url' => admin_url('admin-ajax.php'),
                'export_nonce' => wp_create_nonce('export_csv_action')
            ]);
            break;

        case 'avatar-studio_page_avatar_studio-avatars':
            wp_enqueue_script('avatar-studio-avatars', $plugin_url . 'assets/js/admin-avatars.js', ['jquery'], '1.0.6', true);
            break;
            
        case 'admin_page_avatar_studio-add-avatar':
        case 'admin_page_avatar_studio-edit-avatar':
            wp_enqueue_script('avatar-studio-avatar-form', $plugin_url . 'assets/js/admin-avatar-form.js', ['jquery'], '1.0.6', true);
            break;
    }
}
add_action('admin_enqueue_scripts', 'avatar_studio_enqueue_admin_scripts');

function avatar_studio_frontend_styles() {
    // Load on frontend pages where shortcode is used
    if (!is_admin()) {
        wp_enqueue_style(
            'avatar-studio-frontend-css',
            plugin_dir_url(__FILE__) . 'assets/css/avatarContainer.css',
            [], // No dependencies
            '1.0.6'
        );
        
        // Also load fontawesome
        wp_enqueue_style(
            'avatar-studio-fontawesome',
            plugin_dir_url(__FILE__) . 'assets/css/fontawesome/css/all.min.css',
            [],
            '1.0.6'
        );
    }
}
add_action('wp_enqueue_scripts', 'avatar_studio_frontend_styles');

// Add this to your plugin's main file or a functions.php file in your plugin

function avatar_form_enqueue_styles($hook) {
    // Check if we're on the avatar form page
    if ($hook == 'toplevel_page_interactive-avatar-studio' || strpos($hook, 'page_avatar-form') !== false) {
        // Enqueue the external CSS file
        wp_enqueue_style(
            'avatar-form-styles',
            plugin_dir_url(__FILE__) . 'assets/css/avatar-form.css',
            array(),
            '1.0.6'
        );
    }
}
add_action('admin_enqueue_scripts', 'avatar_form_enqueue_styles');

// Hook into the WordPress dashboard setup
add_action('wp_dashboard_setup', 'register_avatar_studio_user_logs_dashboard_widget');

function register_avatar_studio_user_logs_dashboard_widget()
{
    wp_add_dashboard_widget(
        'avatar_studio_user_logs_dashboard_widget',      // Widget ID
        'Avatar Studio Visitor Stats',       // Widget Title
        'render_avatar_studio_user_logs_dashboard_widget' // Callback
    );
}

function render_avatar_studio_user_logs_dashboard_widget()
{
    global $wpdb;
    $table = $wpdb->prefix . 'avatar_studio_user_logs';

    // Total visits
    $total = (int) $wpdb->get_var("SELECT COUNT(*) FROM $table");

    // Unique visitors by IP
    $unique = (int) $wpdb->get_var("SELECT COUNT(DISTINCT ip_address) FROM $table");

    // Visits today
    $today = current_time('Y-m-d');
    $today_count = (int) $wpdb->get_var(
        $wpdb->prepare("SELECT COUNT(*) FROM $table WHERE DATE(timestamp) = %s", $today)
    );

    echo '<ul style="padding-left: 20px;">';
    echo '<li><strong>Total Visits:</strong> ' . number_format($total) . '</li>';
    echo '<li><strong>Unique Visitors:</strong> ' . number_format($unique) . '</li>';
    echo '<li><strong>Visits Today:</strong> ' . number_format($today_count) . '</li>';
    echo '</ul>';
}

function arrayToCss($selector, $styles, $important = false)
{
    $baseCss = buildCssBlock($selector, $styles, $important);

    $mobileStyles = scaleStyles($styles, 0.8); // 20% smaller
    $mobileCss = buildCssBlock($selector, $mobileStyles, $important);

    $tabletStyles = scaleStyles($styles, 0.9); // 10% smaller
    $tabletCss = buildCssBlock($selector, $tabletStyles, $important);

    // Wrap mobile styles in media query
    $mediaQuery = "\n\n" . "@media (max-width: 767px) {\n$mobileCss\n}";
    $mediaQuery .= "\n\n" . "@media (min-width:768px) and (max-width: 935px) {\n$tabletCss\n}";

    return $baseCss . "\n\n" . $mediaQuery . "\n\n" . $mediaQuery;
}

function buildCssBlock($selector, $styles, $important = false)
{
    $cssProperties = [];
    $importantSuffix = $important ? ' !important' : '';

    foreach ($styles as $property => $value) {
        if (is_array($value) && in_array($property, ['border-radius', 'padding', 'margin'])) {
            $top = isValidCssValue($value['top'] ?? null) ? addPx($value['top']) : null;
            $right = isValidCssValue($value['right'] ?? null) ? addPx($value['right']) : null;
            $bottom = isValidCssValue($value['bottom'] ?? null) ? addPx($value['bottom']) : null;
            $left = isValidCssValue($value['left'] ?? null) ? addPx($value['left']) : null;

            if ($top !== null && $right !== null && $bottom !== null && $left !== null) {
                $cssProperties[] = "$property: $top $right $bottom $left$importantSuffix;";
            }
        } elseif (is_array($value) && $property === 'border') {
            $width = isValidCssValue($value['width'] ?? null) ? addPx($value['width']) : null;
            $style = isValidCssValue($value['style'] ?? null) ? $value['style'] : null;
            $color = isValidCssValue($value['color'] ?? null) ? $value['color'] : null;

            if ($width && $style && $color) {
                $cssProperties[] = "$property: $width $style $color$importantSuffix;";
            }
        } elseif (is_array($value) && in_array($property, ['mini', 'medium', 'large'])) {
            if (isValidCssValue($value['width'] ?? null)) {
                $cssProperties[] = "width: " . addPx($value['width']) . "$importantSuffix;";
            }
            if (isValidCssValue($value['height'] ?? null)) {
                $cssProperties[] = "height: " . addPx($value['height']) . "$importantSuffix;";
            }
        } elseif (is_numeric($value)) {
            $cssProp = str_replace('_', '-', $property);
            $cssProperties[] = "$cssProp: " . addPx($value) . "$importantSuffix;";
        } elseif (isValidCssValue($value)) {
            $cssProp = str_replace('_', '-', $property);
            $cssProperties[] = "$cssProp: $value$importantSuffix;";
        }
    }

    return "$selector {\n    " . implode("\n    ", $cssProperties) . "\n}";
}

function addPx($value)
{
    return is_numeric($value) ? $value . 'px' : $value;
}

function isValidCssValue($val)
{
    return $val !== null && $val !== '';
}

function scaleStyles($styles, $scale = 0.8)
{
    $scaled = [];

    foreach ($styles as $property => $value) {
        if (is_array($value)) {
            $scaled[$property] = scaleStyles($value, $scale); // recursive
        } elseif (is_numeric($value)) {
            $scaled[$property] = round($value * $scale, 2);
        } else {
            $scaled[$property] = $value;
        }
    }

    return $scaled;
}

/**
 * Generate dynamic CSS for avatar shortcode
 * This function is called when styles need to be generated
 */
function avatar_studio_generate_shortcode_css($styles) {
    if (!$styles || !is_array($styles)) {
        return '';
    }
    
    $css = '';
    
    foreach ($styles as $key => $style) {
        if ($key == 'chatBox') {
            $css .= arrayToCss('#chatBox', $style, true);
        } else if ($key == 'thumbnail') {
            $css .= arrayToCss('#avatarThumbnail', $style, true);
        } else if ($key == 'heading') {
            $css .= arrayToCss('#chatBox-heading', $style, true);
        } else if ($key == 'chat-start-button') {
            $css .= arrayToCss('#startSession', $style, true);
            $css .= arrayToCss('button.disclaimer', $style, true);
            $css .= arrayToCss('button.instruction', $style, true);
        } else if ($key == 'chat-end-button') {
            $css .= arrayToCss('#endSession', $style, true);
        } else if ($key == 'mic-button') {
            $css .= arrayToCss('#micToggler', $style, true);
        } else if ($key == 'camera-button') {
            $css .= arrayToCss('#cameraToggler', $style, true);
        } else if ($key == 'switch-button') {
            $css .= arrayToCss('#switchInteractionMode', $style, true);
        } else if ($key == 'transcript-button') {
            $css .= arrayToCss('.transcriptToggleButton', $style, true);
        } else if ($key == 'fullscreen-button') {
            $css .= arrayToCss('.action-fullscreen', $style, true);
            $css .= arrayToCss('#fullscreen', $style, true);
        } else if ($key == 'close-button') {
            $css .= arrayToCss('#chatBox-close', $style, true);
            if (isset($style['hover-background']) && $style['hover-background']) {
                $css .= '#chatBox-close:hover { background: ' . $style['hover-background'] . ' !important; }' . "\n";
            }
        } else if ($key == 'toast-success') {
            $css .= generateToastShortcodeCss('.notification.success', $style);
        } else if ($key == 'toast-error') {
            $css .= generateToastShortcodeCss('.notification.error', $style);
        } else if ($key == 'toast-warning') {
            $css .= generateToastShortcodeCss('.notification.warning', $style);
        } else if ($key == 'toast-info') {
            $css .= generateToastShortcodeCss('.notification.info', $style);
        }
    }
    
    return $css;
}

// Helper function to generate toast notification CSS for shortcode
function generateToastShortcodeCss($selector, $style) {
    $css = '';
    
    if (!empty($style)) {
        $css .= $selector . " {\n";
        
        if (isset($style['background']) && $style['background']) {
            $css .= '    background: ' . $style['background'] . " !important;\n";
        }
        
        if (isset($style['color']) && $style['color']) {
            $css .= '    color: ' . $style['color'] . " !important;\n";
        }
        
        if (isset($style['border-color']) && $style['border-color']) {
            $borderWidth = isset($style['border-width']) && $style['border-width'] ? $style['border-width'] . 'px' : '1px';
            $css .= '    border: ' . $borderWidth . ' solid ' . $style['border-color'] . " !important;\n";
        }
        
        if (isset($style['border-radius']) && $style['border-radius']) {
            $css .= '    border-radius: ' . $style['border-radius'] . "px !important;\n";
        }
        
        if (isset($style['padding']) && $style['padding']) {
            $css .= '    padding: ' . $style['padding'] . "px 16px !important;\n";
        }
        
        if (isset($style['font-size']) && $style['font-size']) {
            $css .= '    font-size: ' . $style['font-size'] . "px !important;\n";
        }
        
        if (isset($style['box-shadow']) && $style['box-shadow']) {
            $css .= '    box-shadow: ' . $style['box-shadow'] . " !important;\n";
        }
        
        $css .= "}\n\n";
        
        // Add gradient border effect for toasts if border-color is set
        if (isset($style['border-color']) && $style['border-color']) {
            $css .= $selector . "::after {\n";
            $css .= '    content: "" !important;' . "\n";
            $css .= '    position: absolute !important;' . "\n";
            $css .= '    inset: 0 !important;' . "\n";
            
            if (isset($style['border-radius']) && $style['border-radius']) {
                $css .= '    border-radius: ' . $style['border-radius'] . "px !important;\n";
            }
            
            $css .= '    padding: 1px !important;' . "\n";
            $css .= '    background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1)) !important;' . "\n";
            $css .= '    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) !important;' . "\n";
            $css .= '    -webkit-mask-composite: xor !important;' . "\n";
            $css .= '    mask-composite: exclude !important;' . "\n";
            $css .= '    pointer-events: none !important;' . "\n";
            $css .= "}\n\n";
        }
        
        // Add hover effect for toasts
        $css .= $selector . ":hover {\n";
        $css .= '    transform: translateY(-2px) scale(1.02) !important;' . "\n";
        if (isset($style['box-shadow']) && $style['box-shadow']) {
            // Enhance the existing box shadow on hover
            $enhancedShadow = str_replace('0.25', '0.35', $style['box-shadow']);
            $enhancedShadow = str_replace('0.1', '0.2', $enhancedShadow);
            $css .= '    box-shadow: ' . $enhancedShadow . " !important;\n";
        }
        $css .= "}\n\n";
    }
    
    return $css;
}

/**
 * Enqueue dynamic shortcode styles
 * This ensures styles are loaded properly when shortcode is used
 */
function avatar_studio_enqueue_shortcode_styles() {
    global $avatar_studio_shortcode_styles;
    
    if (!empty($avatar_studio_shortcode_styles)) {
        wp_register_style('avatar-studio-shortcode-dynamic', false);
        wp_enqueue_style('avatar-studio-shortcode-dynamic');
        wp_add_inline_style('avatar-studio-shortcode-dynamic', $avatar_studio_shortcode_styles);
    }
}
add_action('wp_footer', 'avatar_studio_enqueue_shortcode_styles', 100);

function avatar_studio_generate_modal_css($key, $style) {
    $css = '';
    
    if ($key === 'disclaimer' || $key === 'instruction') {
        $selector = $key === 'disclaimer' ? '.disclaimer-modal' : '.instruction-modal';
        
        // Background overlay
        if (isset($style['background'])) {
            $opacity = isset($style['opacity']) ? floatval($style['opacity']) : 0.9;
            $css .= $selector . " {\n";
            $css .= "    background: " . $style['background'] . " !important;\n";
            $css .= "    opacity: " . $opacity . " !important;\n";
            $css .= "}\n\n";
        }
        
        // Content container
        if (isset($style['content_background'])) {
            $css .= $selector . " .modal-content {\n";
            $css .= "    background: " . $style['content_background'] . " !important;\n";
            
            if (isset($style['border_radius'])) {
                $css .= "    border-radius: " . intval($style['border_radius']) . "px !important;\n";
            }
            
            $css .= "}\n\n";
        }
        
        // Heading styles
        if (isset($style['heading_color']) || isset($style['heading_size'])) {
            $css .= $selector . " .modal-heading,\n";
            $css .= $selector . " h2,\n";
            $css .= $selector . " h3 {\n";
            
            if (isset($style['heading_color'])) {
                $css .= "    color: " . $style['heading_color'] . " !important;\n";
            }
            
            if (isset($style['heading_size'])) {
                $css .= "    font-size: " . intval($style['heading_size']) . "px !important;\n";
            }
            
            $css .= "}\n\n";
        }
        
        // Content text styles
        if (isset($style['content_color']) || isset($style['content_size'])) {
            $css .= $selector . " .modal-text,\n";
            $css .= $selector . " p,\n";
            $css .= $selector . " .modal-content > div {\n";
            
            if (isset($style['content_color'])) {
                $css .= "    color: " . $style['content_color'] . " !important;\n";
            }
            
            if (isset($style['content_size'])) {
                $css .= "    font-size: " . intval($style['content_size']) . "px !important;\n";
            }
            
            $css .= "}\n\n";
        }
    }
    
    return $css;
}

// shortcode
function avatar_studio_shortcode($atts)
{
    $atts = shortcode_atts([
        'id' => '',
    ], $atts, 'avatar_studio');
    
    $avatar_studio_enable = get_option('avatar_studio_enable');
    $avatar_studio_id = esc_html($atts['id']);

    if (empty($avatar_studio_id)) {
        return '<p>Error: Avatar ID is required. Use [avatar_studio id="1"]</p>';
    }

    global $wpdb;
    $avatar = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$wpdb->prefix}avatar_studio_avatars WHERE id = %d", $avatar_studio_id));
    
    if (!$avatar) {
        return '<p>Avatar not found.</p>';
    }

    // Set global variables (same as enqueue_avatar_studio_script)
    global $livekit_enable, $avatar_vendor, $api_key, $chatBoxHeading, $video_enable, $chat_only;
    global $homePageID, $pageId, $avatar_id, $knowledge_id, $previewThumbnail, $previewImage;
    global $active_thumbnail, $avatar_name, $time_limit, $styles;
    global $disclaimer_enable, $disclaimer, $disclaimer_title;
    global $user_form_enable, $instruction_enable, $skip_instruction_video;
    global $instruction, $instruction_title, $start_button_label, $selected_form_id;
    global $avatar_studio_shortcode_styles;

    $avatar_vendor = $avatar->vendor ?? 'tavus';
    $api_key = $avatar->api_key ?? '';
    $chatBoxHeading = $avatar->title ?? '';
    $opening_text = $avatar->welcome_message ? json_decode($avatar->welcome_message, true) : [];
    $styles = $avatar->styles ? json_decode($avatar->styles, true) : [];
    $time_limit = $avatar->time_limit ?? 60;
    $avatar_name = $avatar->avatar_name ?? '';
    $avatar_id = $avatar->avatar_id ?? '';
    $knowledge_id = $avatar->knowledge_id ?? '';
    $previewImage = $avatar->preview_image ?? '';
    $start_button_label = isset($avatar->start_button_label) ? stripslashes($avatar->start_button_label) : 'Chat';
    $active_thumbnail = $avatar->active_thumbnail ?? 'medium';
    
    // Set thumbnail based on active size
    if ($active_thumbnail == 'mini') {
        $previewThumbnail = $avatar->thumbnail_mini ?? '';
    } else if ($active_thumbnail == 'medium') {
        $previewThumbnail = $avatar->thumbnail_medium ?? '';
    } else if ($active_thumbnail == 'large') {
        $previewThumbnail = $avatar->thumbnail_large ?? '';
    }
    
    if (empty($previewThumbnail)) {
        $previewThumbnail = $previewImage;
    }

    // Set feature flags
    $disclaimer_enable = $avatar->disclaimer_enable ?? 0;
    $disclaimer_title = isset($avatar->disclaimer_title) ? stripslashes($avatar->disclaimer_title) : '';
    $disclaimer = isset($avatar->disclaimer) ? stripslashes($avatar->disclaimer) : '';
    $user_form_enable = $avatar->user_form_enable ?? 0;
    $selected_form_id = $avatar->selected_form_id ?? 0;
    $instruction_enable = $avatar->instruction_enable ?? 0;
    $skip_instruction_video = $avatar->skip_instruction_video ?? 0;
    $instruction_title = isset($avatar->instruction_title) ? stripslashes($avatar->instruction_title) : '';
    $instruction = isset($avatar->instruction) ? stripslashes($avatar->instruction) : '';
    $chat_only = $avatar->chat_only ?? 0;
    $video_enable = $avatar->video_enable ?? 0;
    $voice_emotion = $avatar->voice_emotion ?? '';
    $livekit_enable = $avatar->livekit_enable ?? false;

    // Prepare plugin options for JavaScript
    $PLUGIN_OPTIONS = [
        'time_limit' => $time_limit > 0 ? $time_limit : 300,
        'avatar_studio_enable' => !!$avatar_studio_enable,
        'livekit_enable' => !!$livekit_enable,
        'opening_text' => $opening_text,
        'voice_emotion' => $voice_emotion,
        'chat_only' => $chat_only,
        'video_enable' => $video_enable,
        'instruction_enable' => $instruction_enable,
        'skip_instruction_video' => $skip_instruction_video,
        'disclaimer_enable' => $disclaimer_enable,
        'user_form_enable' => $user_form_enable,
        'selected_form_id' => $selected_form_id,
    ];

    $plugin_dir = plugin_dir_url(__FILE__);
    
    // Enqueue all necessary scripts and styles
    wp_enqueue_style('avatar-studio-frontend-css', $plugin_dir . 'assets/css/avatarContainer.css', [], '1.0.6');
    wp_enqueue_style('avatar-studio-fontawesome', $plugin_dir . 'assets/css/fontawesome/css/all.min.css', [], '1.0.6');
    wp_enqueue_style('avatar_studio-style', $plugin_dir . 'assets/css/style.css', [], AvatarStudioVersion);
    
    // Enqueue jsPDF
    wp_enqueue_script('avatar_studio-jspdf', $plugin_dir . 'assets/js/jspdf/jspdf.umd.min.js', ['jquery'], '4.0.0', true);
    
    // Enqueue main script
    wp_enqueue_script('avatar_studio-script', $plugin_dir . 'assets/js/avatar_studio-script.js', ['jquery', 'avatar_studio-jspdf'], AvatarStudioVersion, true);
    wp_localize_script('avatar_studio-script', 'PLUGIN_OPTIONS', $PLUGIN_OPTIONS);

    // Enqueue vendor-specific scripts
    if ($avatar_vendor == 'tavus') {
        wp_enqueue_script('avatar_studio-tavus', $plugin_dir . 'assets/js/tavus.js', [], AvatarStudioVersion, true);
        wp_enqueue_script('daily-co', $plugin_dir . 'assets/js/daily-co.js', [], AvatarStudioVersion, true);
    } else {
        wp_enqueue_script('avatar_studio-heygen', $plugin_dir . 'assets/js/heygen.js', [], AvatarStudioVersion, true);
    }

    // Generate and enqueue dynamic CSS
    if ($styles && is_array($styles)) {
        $generated_css = avatar_studio_generate_shortcode_css($styles);
        if (!isset($avatar_studio_shortcode_styles)) {
            $avatar_studio_shortcode_styles = '';
        }
        $avatar_studio_shortcode_styles .= $generated_css;
        
        // Add inline styles immediately for shortcode
        wp_register_style('avatar-studio-shortcode-inline', false);
        wp_enqueue_style('avatar-studio-shortcode-inline');
        wp_add_inline_style('avatar-studio-shortcode-inline', $generated_css);
    }

    // Start output buffering
    ob_start();
    ?>
    <input type="hidden" id="ajaxURL" value="<?php echo esc_url(admin_url('admin-ajax.php')); ?>" />
    <input type="hidden" id="avatar_studio_nonce" value="<?php echo esc_attr(wp_create_nonce('avatar_studio_nonce_action')); ?>" />
    <input type="hidden" id="heygen_assets" value="<?php echo esc_attr($plugin_dir . 'assets'); ?>" />
    
    <div class="chatBox-shortCode">
        <div id="chatBox" class="<?php echo esc_attr($chat_only ? 'text_mode' : 'voice_mode'); ?>">
            <div id="chat-widget">
                <input type="hidden" id="avatarStudioId" value="<?php echo esc_attr($avatar_studio_id); ?>">
                <input type="hidden" id="pageId" value="<?php echo esc_attr(get_the_ID()); ?>">
                <?php
                // Include the avatar container file
                require(plugin_dir_path(__FILE__) . 'avatarContainer.php');
                ?>
            </div>
        </div>
    </div>
    <?php
    
    return ob_get_clean();
}
add_shortcode('avatar_studio', 'avatar_studio_shortcode');