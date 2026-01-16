<?php

if (!defined('ABSPATH')) {
    exit;
}
?>

<?php
define('DONOTCACHEPAGE', true);
global $avatar_open_on_desktop;
global $avatar_studio_id;
global $avatar_vendor;
global $avatar_id;
global $knowledge_id;
global $previewThumbnail;
global $previewImage;
global $active_thumbnail;
global $avatar_name;
global $styles;
global $avatarContainerID;
global $video_enable;
global $chat_only;

if ($previewImage == '') {
    $previewImage = plugin_dir_url(__FILE__) . '/assets/images/preview.webp';
}

if ($previewThumbnail == '') {
    $previewThumbnail = plugin_dir_url(__FILE__) . '/assets/images/preview.webp';
}

// Enqueue dynamic styles
avatar_studio_enqueue_dynamic_styles();

// Enqueue the scripts properly
function enqueue_avatar_widget_scripts($avatar_open_on_desktop) {
    // Enqueue jQuery if not already loaded
    wp_enqueue_script('jquery');
    
    // Enqueue the main widget script
    wp_enqueue_script(
        'avatar-widget-scripts',
        plugin_dir_url(__FILE__) . 'assets/js/avatar-widget.js',
        array('jquery'),
        '1.0.0',
        true
    );
    
    // Localize script to pass PHP variables to JavaScript
    wp_localize_script(
        'avatar-widget-scripts',
        'avatarWidgetConfig',
        array(
            'avatar_open_on_desktop' => $avatar_open_on_desktop,
            'nonce' => wp_create_nonce('avatar_widget_nonce')
        )
    );
    
    // Add initialization script
    wp_add_inline_script('avatar-widget-scripts', '
        jQuery(document).ready(function($) {
            initAvatarWidget(' . ($avatar_open_on_desktop ? 'true' : 'false') . ');
        });
    ');
}

// Call the function to enqueue scripts
enqueue_avatar_widget_scripts($avatar_open_on_desktop);
?>

<div id="chat-icon">
    <img src="<?php echo esc_url($previewThumbnail); ?>" alt="avatar_thumb" id="avatarThumbnail"
        class="<?php echo esc_attr('thumbnail-' . $active_thumbnail); ?>" />
</div>
<div id="chatBox" class=" <?php echo esc_attr(($chat_only) ? 'text_mode' : 'voice_mode'); ?>">
    <div id="chat-widget">
        <input type="hidden" id="avatarStudioId" value="<?php echo esc_attr($avatar_studio_id); ?>">
        <input type="hidden" id="pageId" value="<?php echo esc_attr(get_the_ID()); ?>">
        <?php
        require(plugin_dir_path(__FILE__) . 'avatarContainer.php'); ?>
    </div>
</div>