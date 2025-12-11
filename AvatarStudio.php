<?php

/**
 * Plugin Name: Avatar Studio
 * Plugin URI: https://divigner.com/avatar-studio
 * Description: Avatar Studio for your Interactive Avatar  
 * Version: 1.0.3 Custom RAG
 * Author: Avanew
 * Requires at least: 6.0
 * Tested up to: 6.8
 * Requires PHP: 8.0.3
 * Author URI: https://divigner.com
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * License: GPL2
 */

if (!defined('ABSPATH')) {
    exit;
}
define('AvatarStudioVersion', 1.02);

global $avatar_studio_id;
global $isAvatarStudioPage;
global $avatar_open_on_desktop;
global $livekit_enable;
global $video_enable;
global $chat_only;
global $avatar_vendor;
global $api_key;
global $chatBoxHeading;
global $homePageID;
global $pageId;
global $avatar_id;
global $knowledge_id;
global $previewThumbnail;
global $previewImage;
global $active_thumbnail;
global $avatar_name;
global $avatarContainerID;
global $time_limit;
global $styles;
global $start_button_label;

require_once 'option.php';
require_once 'functions.php';
require_once 'inc/avatar-manager.php';
require_once 'inc/avatar-questionnaire-manager.php';
require_once 'action.php';

function enqueue_avatar_studio_script()
{
    global $avatar_studio_id;
    global $isAvatarStudioPage;
    global $avatar_open_on_desktop;
    global $livekit_enable;
    global $video_enable;
    global $chat_only;
    global $avatar_vendor;
    global $api_key;
    global $chatBoxHeading;
    global $homePageID;
    global $pageId;
    global $avatar_id;
    global $knowledge_id;
    global $previewThumbnail;
    global $previewImage;
    global $active_thumbnail;
    global $avatar_name;
    global $avatarContainerID;
    global $time_limit;
    global $styles;
    global $disclaimer_enable;
    global $disclaimer;
    global $disclaimer_title;
    global $user_form_enable;
    global $instruction_enable;
    global $skip_instruction_video;
    global $instruction;
    global $instruction_title;
    global $start_button_label;


    $dir = plugin_dir_url(__FILE__);

    $avatar_studio_enable = get_option('avatar_studio_enable');
    $livekit_enable = false;
    $avatar_vendor = 'tavus';

    $homePageID = get_option('page_on_front');
    $pageId = get_the_ID();
    $isAvatarStudioPage = false;

    if ($avatar_studio_enable) {
        wp_enqueue_style('avatar_studio-style', $dir . '/assets/css/style.css', array(), AvatarStudioVersion, 'all');
        wp_enqueue_style('bootstrap-icon', 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css', array(), AvatarStudioVersion, 'all');
    }


    global $wpdb;
    $avatar = $wpdb->get_row($wpdb->prepare(" SELECT * FROM {$wpdb->prefix}avatar_studio_avatars WHERE JSON_CONTAINS(pages, '\"%d\"')   ", $pageId));

    if (!$avatar) {
        return;
    }
    if ($avatar->vendor) {
        $avatar_vendor = $avatar->vendor;
    }
    $avatar_studio_id = $avatar->id;
    $avatar_open_on_desktop = isset($avatar->open_on_desktop) ? $avatar->open_on_desktop : 0;
    $api_key = isset($avatar->api_key) ? $avatar->api_key : '';
    $chatBoxHeading = isset($avatar->title) ? $avatar->title : '';
    $opening_text = $avatar && $avatar->welcome_message ? json_decode($avatar->welcome_message, true) : [];
    $styles = $avatar && $avatar->styles ? json_decode($avatar->styles, true) : [];
    $time_limit = isset($avatar->time_limit) ? $avatar->time_limit : 60;
    $avatar_name = isset($avatar->avatar_name) ? $avatar->avatar_name : '';
    $avatar_id = isset($avatar->avatar_id) ? $avatar->avatar_id : '';
    $knowledge_id = isset($avatar->knowledge_id) ? $avatar->knowledge_id : '';
    $previewImage = isset($avatar->preview_image) ? $avatar->preview_image : '';
    $start_button_label = isset($avatar->start_button_label) ? stripslashes($avatar->start_button_label) : '';
    $active_thumbnail = isset($avatar->active_thumbnail) ? $avatar->active_thumbnail : 'medium';
    if ($active_thumbnail == 'mini') {
        $previewThumbnail = isset($avatar->thumbnail_mini) ? $avatar->thumbnail_mini : '';
    } else if ($active_thumbnail == 'medium') {
        $previewThumbnail = isset($avatar->thumbnail_medium) ? $avatar->thumbnail_medium : '';
    } else if ($active_thumbnail == 'large') {
        $previewThumbnail = isset($avatar->thumbnail_large) ? $avatar->thumbnail_large : '';
    }
    if ($previewThumbnail == '') {
        $previewThumbnail = $previewImage;
    }


    $disclaimer_enable = isset($avatar->disclaimer_enable) ? $avatar->disclaimer_enable : 0;
    $disclaimer_title = isset($avatar->disclaimer_title) ? stripslashes($avatar->disclaimer_title) : '';
    $disclaimer = isset($avatar->disclaimer) ? stripslashes($avatar->disclaimer) : '';
    $user_form_enable = isset($avatar->user_form_enable) ? $avatar->user_form_enable : 0;
    $instruction_enable = isset($avatar->instruction_enable) ? $avatar->instruction_enable : 0;
    $skip_instruction_video = isset($avatar->skip_instruction_video) ? $avatar->skip_instruction_video : 0;
    $instruction_title = isset($avatar->instruction_title) ? stripslashes($avatar->instruction_title) : '';
    $instruction = isset($avatar->instruction) ? stripslashes($avatar->instruction) : '';
    $chat_only = isset($avatar->chat_only) ? $avatar->chat_only : 0;
    $video_enable = isset($avatar->video_enable) ? $avatar->video_enable : 0;
    $voice_emotion = isset($avatar->voice_emotion) ? $avatar->voice_emotion : '';
    $livekit_enable = isset($avatar->livekit_enable) ? $avatar->livekit_enable : false;
    if ($avatar->pages && is_array(json_decode($avatar->pages, associative: true)) && in_array($pageId, json_decode($avatar->pages, true))) {
        $isAvatarStudioPage = true;
    }
    $PLUGIN_OPTIONS = [];
    $PLUGIN_OPTIONS['time_limit'] = $time_limit > 0 ? $time_limit : 300;
    $PLUGIN_OPTIONS['avatar_studio_enable'] = !!$avatar_studio_enable;
    $PLUGIN_OPTIONS['livekit_enable'] = !!$livekit_enable;
    $PLUGIN_OPTIONS['opening_text'] = $opening_text;
    $PLUGIN_OPTIONS['voice_emotion'] = $voice_emotion;
    $PLUGIN_OPTIONS['chat_only'] = $chat_only;
    $PLUGIN_OPTIONS['video_enable'] = $video_enable;
    $PLUGIN_OPTIONS['instruction_enable'] = $instruction_enable;
    $PLUGIN_OPTIONS['skip_instruction_video'] = $skip_instruction_video;
    $PLUGIN_OPTIONS['disclaimer_enable'] = $disclaimer_enable;
    $PLUGIN_OPTIONS['user_form_enable'] = $user_form_enable;

    if ($avatar_studio_enable && $isAvatarStudioPage) {

        $userAgent = $_SERVER['HTTP_USER_AGENT'];
        if (stripos($userAgent, 'Firefox') !== false && !$livekit_enable) {
            return '';
        }
        // if ($livekit_enable) {
        //     // Define the variables to pass
        //     $API_CONFIG = array(
        //         'serverUrl' => 'https://api.heygen.com',
        //     );
        //     $API_CONFIG['RAG_API_URL'] = isset($avatar->RAG_API_URL) ? $avatar->RAG_API_URL : '';
        //     $STT_CONFIG = array();
        //     $STT_CONFIG['deepgramKEY'] = isset($avatar->deepgramKEY) ? $avatar->deepgramKEY : '';

        //     // Pass them to the script

        //     wp_enqueue_script('avatar_studio-livekit', 'https://cdn.jsdelivr.net/npm/livekit-client/dist/livekit-client.umd.min.js', array('jquery'), AvatarStudioVersion, true);
        //     wp_enqueue_script('avatar_studio-audio-recorder', $dir . 'assets/js/audio-recorder.js', array('jquery'), AvatarStudioVersion, true);
        //     wp_enqueue_script('avatar_studio-livekit-script', $dir . 'assets/js/livekit-script.js', array('jquery'), AvatarStudioVersion, true);

        //     wp_localize_script('avatar_studio-livekit-script', 'API_CONFIG', $API_CONFIG);
        //     wp_localize_script('avatar_studio-audio-recorder', 'STT_CONFIG', $STT_CONFIG);
        // }
        wp_enqueue_script('avatar_studio-jspdf', 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', array('jquery'), AvatarStudioVersion, true);
        wp_enqueue_script('avatar_studio-script', $dir . 'assets/js/avatar_studio-script.js', array('jquery'), AvatarStudioVersion, true);
        wp_localize_script('avatar_studio-script', 'PLUGIN_OPTIONS', $PLUGIN_OPTIONS);

    }


}
add_action('wp_enqueue_scripts', 'enqueue_avatar_studio_script');


function enqueue_avatar_studio_admin_script($hook)
{


    if ('avatar-studio_page_avatar_studio-avatars' === $hook || 'admin_page_avatar_studio-add-avatar' === $hook || 'admin_page_avatar_studio-edit-avatar' === $hook) {
        wp_enqueue_media();


        wp_enqueue_style('select2', 'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css');
        wp_enqueue_script('select2', 'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js', array('jquery'), null, true);
        wp_add_inline_script('select2', '  jQuery(document).ready(function($) { $(".select2").select2();   }); ');

        wp_enqueue_style('wp-color-picker');
        wp_enqueue_script('wp-color-picker-alpha', plugins_url('assets/js/wp-color-picker-alpha.min.js', __FILE__), array('jquery', 'wp-color-picker'), AvatarStudioVersion, true);
        wp_enqueue_script('lc_color_picker', plugins_url('assets/js/lc_color_picker.min.js', __FILE__), array('jquery'), AvatarStudioVersion, true);

        wp_enqueue_script('admin-script', plugins_url('assets/js/admin-script.js', __FILE__), array('wp-color-picker'), AvatarStudioVersion, true);
        wp_enqueue_style('preview-style', plugins_url('assets/css/style.css', __FILE__));
        wp_enqueue_style('admin-style', plugins_url('assets/css/admin-style.css', __FILE__));

        $id = intval($_GET['id'] ?? 0);
        global $wpdb;
        $avatar = $wpdb->get_row($wpdb->prepare(" SELECT * FROM {$wpdb->prefix}avatar_studio_avatars WHERE id = %d ", $id));

        $PLUGIN_OPTIONS = [];
        $PLUGIN_OPTIONS['time_limit'] = $avatar && $avatar->time_limit ? esc_attr($avatar->time_limit) : 60;
        $PLUGIN_OPTIONS['avatar_studio_enable'] = true;
        $PLUGIN_OPTIONS['livekit_enable'] = $avatar && $avatar->livekit_enable ? $avatar->livekit_enable : false;
        $PLUGIN_OPTIONS['opening_text'] = $avatar && $avatar->welcome_message ? json_decode($avatar->welcome_message, true) : [];
        $PLUGIN_OPTIONS['voice_emotion'] = $avatar && $avatar->voice_emotion ? $avatar->voice_emotion : '';


        wp_enqueue_script('avatar_studio-script', plugins_url('assets/js/avatar_studio-script.js', __FILE__), array('jquery'), AvatarStudioVersion, true);
        wp_localize_script('avatar_studio-script', 'PLUGIN_OPTIONS', $PLUGIN_OPTIONS);
    }

}
add_action('admin_enqueue_scripts', 'enqueue_avatar_studio_admin_script');

function avatar_studio_chatBox()
{
    ob_start();
    require(plugin_dir_path(__FILE__) . 'chatBox.php');
    $output = ob_get_clean();
    return $output;
}

add_action('wp_footer', function () {


    global $livekit_enable, $avatar_vendor, $isAvatarStudioPage;
    $avatar_studio_enable = get_option('avatar_studio_enable');

    $userAgent = $_SERVER['HTTP_USER_AGENT'];
    if (stripos($userAgent, 'Firefox') !== false && !$livekit_enable) {
        return '';
    }
    if ($avatar_studio_enable && $isAvatarStudioPage && !post_password_required()) {
        // if (!$livekit_enable) {

            if ($avatar_vendor == 'tavus') {
                echo ' <script type="module" crossorigin src="' . plugin_dir_url(__FILE__) . 'assets/js/tavus.js?v=' . AvatarStudioVersion . '"></script>';
                echo ' <script crossorigin src="https://unpkg.com/@daily-co/daily-js"></script> ';

            } else {
                echo ' <script type="module" crossorigin src="' . plugin_dir_url(__FILE__) . 'assets/js/heygen.js?v=' . AvatarStudioVersion . '"></script>';
            }


        // }
        echo ' <input type="hidden" id="ajaxURL" value="' . admin_url('admin-ajax.php') . '" />';
        echo ' <input type="hidden" id="avatar_studio_nonce" value="' . wp_create_nonce('avatar_studio_nonce_action') . '" />';
        echo ' <input type="hidden" id="heygen_assets" value="' . plugin_dir_url(__FILE__) . 'assets " />';

        echo avatar_studio_chatBox();
    }
});


add_action('init', function () {
    $pageId = get_the_ID();
    if (is_page() && has_shortcode(get_post()->post_content, 'avatar_studio')) {
        /** Need to clear cache */
    }
});
add_action('wp_footer', function () {
    if (defined('DONOTCACHEPAGE') && DONOTCACHEPAGE === true) {
        echo '<!-- DONOTCACHEPAGE is active -->';
    }
});



register_activation_hook(__FILE__, 'create_avatar_studio_user_logs_table');
function create_avatar_studio_user_logs_table()
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'avatar_studio_user_logs';

    $charset_collate = $wpdb->get_charset_collate();

    $sql = " CREATE TABLE  IF NOT EXISTS $table_name (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        ip_address VARCHAR(100),
        user_agent TEXT,
        location VARCHAR(255),
        provider VARCHAR(50) DEFAULT 'heygen',
        token VARCHAR(300),
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}


register_activation_hook(__FILE__, 'create_avatar_studio_avaters_table');
function create_avatar_studio_avaters_table()
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'avatar_studio_avatars';

    $charset_collate = $wpdb->get_charset_collate();
    $sql = " CREATE TABLE  IF NOT EXISTS $table_name (
        id BIGINT AUTO_INCREMENT PRIMARY KEY, 
        vendor VARCHAR(30) NULL DEFAULT 'tavus',
        api_key VARCHAR(100) NULL,
        title VARCHAR(100) NULL,
        description VARCHAR(300) NULL,
        avatar_name VARCHAR(100) NULL,
        avatar_id VARCHAR(100) NULL,
        knowledge_id VARCHAR(100) NULL,
        preview_image VARCHAR(500) NULL,
        thumbnail_mini VARCHAR(500) NULL,
        thumbnail_medium VARCHAR(500) NULL,
        thumbnail_large VARCHAR(500) NULL,
        active_thumbnail VARCHAR(20) NULL DEFAULT 'medium',
        time_limit VARCHAR(60) NULL DEFAULT '300',
        open_on_desktop TINYINT NULL DEFAULT '0',
        show_on_mobile TINYINT NULL DEFAULT '1',
        livekit_enable TINYINT NULL DEFAULT '0',
        video_enable TINYINT NULL DEFAULT '0',
        chat_only TINYINT NULL DEFAULT '0',
        disclaimer_title VARCHAR(255) NULL,
        disclaimer TEXT NULL,
        disclaimer_enable  TINYINT NULL DEFAULT '0',
        user_form_enable TINYINT NULL DEFAULT '0',
        instruction_title VARCHAR(255) NULL,
        instruction TEXT NULL,
        skip_instruction_video  TINYINT NULL DEFAULT '0',
        instruction_enable  TINYINT NULL DEFAULT '0',
        RAG_API_URL VARCHAR(300) NULL,
        deepgramKEY VARCHAR(300) NULL,
        headers TEXT NULL,
        toast_messages LONGTEXT NULL,
        voice_emotion TEXT NULL,
        pages TEXT NULL,
        styles TEXT NULL, 
        welcome_message TEXT NULL, 
        start_button_label VARCHAR(100) NULL DEFAULT 'Chat',
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}



register_activation_hook(__FILE__, 'create_avatar_studio_questionnaires_table');
function create_avatar_studio_questionnaires_table()
{
    global $wpdb;

    $charset_collate = $wpdb->get_charset_collate();
    $table_name = $wpdb->prefix . 'avatar_studio_questionnaires';

    $sql = " CREATE TABLE  IF NOT EXISTS $table_name (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        avatar_studio_id INTEGER NULL,
        title VARCHAR(100),
        description TEXT,
        renderOn INTEGER,
        isRequired TINYINT(1) DEFAULT 0,
        questionType VARCHAR(30),
        instructions VARCHAR(300),
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);

    $table_name = $wpdb->prefix . 'avatar_studio_questionnaires_to_options';

    $sql = " CREATE TABLE  IF NOT EXISTS $table_name (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        question_id INTEGER,
        option_title VARCHAR(100),
        note TEXT,
        isCorrect TINYINT(1) DEFAULT 0,
        instructions VARCHAR(300),
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    ) $charset_collate;";
    dbDelta($sql);


    $table_name = $wpdb->prefix . 'avatar_studio_questionnaires_answers';

    $sql = " CREATE TABLE  IF NOT EXISTS $table_name (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        question_id INTEGER,
        session_id VARCHAR(200),
        access_token TEXT,
        title VARCHAR(200),
        answer TEXT, 
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    ) $charset_collate;";
    dbDelta($sql);
}

// register_deactivation_hook(__FILE__, 'deactivate_avatar_studio');
function deactivate_avatar_studio()
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'avatar_studio_questionnaires_answers';
    $wpdb->query("DROP TABLE IF EXISTS $table_name");
    $table_name = $wpdb->prefix . 'avatar_studio_questionnaires_to_options';
    $wpdb->query("DROP TABLE IF EXISTS $table_name");
    $table_name = $wpdb->prefix . 'avatar_studio_questionnaires';
    $wpdb->query("DROP TABLE IF EXISTS $table_name");

    $table_name = $wpdb->prefix . 'avatar_studio_avatars';
    $wpdb->query("DROP TABLE IF EXISTS $table_name");

    // Clear cron jobs
    wp_clear_scheduled_hook('avatar_studio_export_cron_job');
}

function avatarStudioUpdateCheck()
{
    $installed_ver = get_option('avatarStudioVersion');

    if ($installed_ver != AvatarStudioVersion) {
        avatarStudioUpdateDatabase();
        update_option('avatarStudioVersion', AvatarStudioVersion);
    }
}
add_action('plugins_loaded', 'avatarStudioUpdateCheck');
function avatarStudioUpdateDatabase()
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'avatar_studio_avatars';
    
    // Check and add toast_messages column if it doesn't exist
    $column_exists = $wpdb->get_results($wpdb->prepare("SHOW COLUMNS FROM $table_name LIKE %s", 'toast_messages'));
    if (empty($column_exists)) {
        $wpdb->query("ALTER TABLE $table_name ADD COLUMN toast_messages LONGTEXT NULL DEFAULT NULL AFTER headers");
        error_log('Added toast_messages column to avatar_studio_avatars table');
    }
    
    // Check and add headers column if it doesn't exist
    $column_exists = $wpdb->get_results($wpdb->prepare("SHOW COLUMNS FROM $table_name LIKE %s", 'headers'));
    if (empty($column_exists)) {
        $wpdb->query("ALTER TABLE $table_name ADD COLUMN headers TEXT NULL DEFAULT NULL");
    }
    
    // Existing column checks...
    $column_exists = $wpdb->get_results($wpdb->prepare("SHOW COLUMNS FROM $table_name LIKE %s", 'disclaimer_title'));
    if (empty($column_exists)) {
        $wpdb->query("ALTER TABLE $table_name ADD COLUMN disclaimer_title VARCHAR(255) DEFAULT ''");
    }

    $column_exists = $wpdb->get_results($wpdb->prepare("SHOW COLUMNS FROM $table_name LIKE %s", 'instruction_title'));
    if (empty($column_exists)) {
        $wpdb->query("ALTER TABLE $table_name ADD COLUMN instruction_title VARCHAR(255) DEFAULT ''");
    }
    $column_exists = $wpdb->get_results($wpdb->prepare("SHOW COLUMNS FROM $table_name LIKE %s", 'start_button_label'));
    if (empty($column_exists)) {
        $wpdb->query("ALTER TABLE $table_name ADD COLUMN start_button_label VARCHAR(100) DEFAULT 'Chat'");
    }

    $column_exists = $wpdb->get_results($wpdb->prepare("SHOW COLUMNS FROM $table_name LIKE %s", 'skip_instruction_video'));
    if (empty($column_exists)) {
        $wpdb->query("ALTER TABLE $table_name ADD COLUMN skip_instruction_video TINYINT NULL DEFAULT '0'");
    }

    $column_exists = $wpdb->get_results($wpdb->prepare("SHOW COLUMNS FROM $table_name LIKE %s", 'user_form_enable'));
    if (empty($column_exists)) {
        $wpdb->query("ALTER TABLE $table_name ADD COLUMN user_form_enable TINYINT NULL DEFAULT '0'");
    }
}

// Register table creation on plugin activation
register_activation_hook(__FILE__, 'avatar_studio_create_tables');

function avatar_studio_create_tables() {
    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();
    $table_name = $wpdb->prefix . 'avatar_studio_user_info';

    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        country_code varchar(10) NOT NULL,
        email varchar(100) NOT NULL,
        mobile varchar(20) NOT NULL,
        full_name varchar(100) NOT NULL,
        conversation_id varchar(50) NOT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}

add_action('admin_enqueue_scripts', function($hook_suffix) {
    wp_enqueue_style('wp-color-picker');
    wp_enqueue_script('wp-color-picker');
});


// Create database table on plugin activation
register_activation_hook(__FILE__, 'avatar_studio_create_sessions_table');
function avatar_studio_create_sessions_table()
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'avatar_studio_sessions';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE {$table_name} (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        session_id varchar(255) NOT NULL,
        avatar_id varchar(255) NOT NULL,
        user_id bigint(20) NOT NULL,
        status varchar(50) DEFAULT 'active',
        duration varchar(50),
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        export_status varchar(50) DEFAULT 'not_exported',
        export_error text,
        exported_at datetime,
        perception_status varchar(50) DEFAULT 'not_processed',
        perception_error text,
        perception_updated_at datetime,
        PRIMARY KEY (id),
        KEY session_id (session_id),
        KEY user_id (user_id)
    ) {$charset_collate};";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}


// --- Register custom cron schedule (every 5 minutes) ---
add_filter('cron_schedules', function($schedules) {
    if (!isset($schedules['every_2_minutes'])) {
        $schedules['every_2_minutes'] = [
            'interval' => 2 * 60,
            'display'  => __('Every 2 Minutes')
        ];
    }
    return $schedules;
});

// --- Custom cron schedules ---
add_filter('cron_schedules', function($schedules) {
    $schedules['every_5_minutes'] = [
        'interval' => 5 * 60,
        'display'  => __('Every 5 Minutes')
    ];
    $schedules['every_15_minutes'] = [
        'interval' => 15 * 60,
        'display'  => __('Every 15 Minutes')
    ];
    $schedules['hourly'] = [
        'interval' => 60 * 60,
        'display'  => __('Every Hour')
    ];
    $schedules['twicedaily'] = [
        'interval' => 12 * 60 * 60,
        'display'  => __('Twice Daily')
    ];
    $schedules['daily'] = [
        'interval' => 24 * 60 * 60,
        'display'  => __('Daily')
    ];
    return $schedules;
});

// --- Schedule or clear cron depending on settings ---
function avatar_studio_schedule_cron() {
    $enabled = get_option('avatar_auto_export_enabled');
    $interval = get_option('avatar_auto_export_interval', 'every_5_minutes');

    wp_clear_scheduled_hook('avatar_studio_export_cron_job');

    if ($enabled) {
        if (!wp_next_scheduled('avatar_studio_export_cron_job')) {
            wp_schedule_event(time(), $interval, 'avatar_studio_export_cron_job');
        }
    }
}

// --- Register activation/deactivation hooks ---
register_activation_hook(__FILE__, function() {
    if (get_option('avatar_auto_export_enabled') === false) {
        update_option('avatar_auto_export_enabled', 1); // default enabled
    }
    if (get_option('avatar_auto_export_interval') === false) {
        update_option('avatar_auto_export_interval', 'every_5_minutes');
    }
    avatar_studio_schedule_cron();
});

register_deactivation_hook(__FILE__, function() {
    wp_clear_scheduled_hook('avatar_studio_export_cron_job');
});

add_action('avatar_studio_export_cron_job', 'avatar_studio_run_export_cron');
function avatar_studio_run_export_cron() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'avatar_studio_sessions';

    error_log('🔄 Running avatar_studio_export_cron at ' . current_time('mysql'));

    $sessions = $wpdb->get_results("SELECT * FROM $table_name WHERE export_status IS NULL OR export_status != 'exported'");

    if (!$sessions) {
        error_log('✅ No pending sessions to export.');
        return;
    }

    foreach ($sessions as $session) {
        avatar_studio_export_transcript($session);
    }

    error_log('✅ Exported ' . count($sessions) . ' sessions.');
}



?>