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
            null, // Hidden from sidebar
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
        if ($screen && (strpos($screen->id, 'avatar_studio-add-avatar') !== false || strpos($screen->id, 'avatar_studio-edit-avatar') !== false)) {
            echo '<style>
               #wpfooter{ position:relative;}
            </style>';
            echo '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"  />';
            // echo '<link rel="stylesheet" href="' . plugin_dir_url(__FILE__) . '../assets/css/style.css"  />';

        }
    }
    /**
     * avatar
     */
    public function render_avatars_page()
    {
        global $wpdb;


        if (!empty($_GET['updated'])) {
            echo '<div class="notice notice-success is-dismissible"><p>Avatar updated.</p></div>';
        }
        if (!empty($_GET['saved'])) {
            echo '<div class="notice notice-success is-dismissible"><p>Avatar saved.</p></div>';
        }
        if (!empty($_GET['deleted'])) {
            echo '<div class="notice notice-success is-dismissible"><p>Avatar deleted.</p></div>';
        }
        if (!empty($_GET['copied'])) {
            echo '<div class="notice notice-success is-dismissible"><p>Avatar Copied.</p></div>';
        }
        echo '<div class="wrap">';
        echo '<h1>Avatars</h1>';

        echo '<p><a href="' . admin_url('admin.php?page=avatar_studio-add-avatar') . '" class="button">Add Avatar</a></p>';
        // List existing
        echo '
        <style>
            th#id { width: 50px; }
            th#vendor { width: 80px; }
            th#time_limit { width: 80px; }
            th#preview_image { width: 100px; }
            th#avatar_name { width: 140px; }
            th#shortcode { width: 250px; word-break: break-word; }
            th#actions { width: 170px; word-break: break-word; }
        </style>
        ';
        require_once 'avatar-table.php';

        $table = new Avatar_Studio_avatars_Table();
        $table->prepare_items();

        echo '<form method="get">';
        echo '<input type="hidden" name="page" value="' . esc_attr($_REQUEST['page']) . '" />';
        $table->display();
        echo '</form>';


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
        if (!empty($_GET['avatar_deleted'])) {
            echo '<div class="notice notice-success is-dismissible"><p>Avatar deleted successfully.</p></div>';
        }

        echo '<p><a href="' . admin_url('admin.php?page=avatar_studio-avatars') . '" class="button">← Back to avatars</a></p>';

        echo '<h2>New Avatar</h2>';
        include 'avatar-form.php';

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
            wp_die('avatar not found.');
        }

        echo '<div class="wrap">';
        echo '<h1>Edit Avatar</h1>';
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
        ], [
            'id' => $id
        ]);

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
            exit;
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
        // Delete avatar
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
        $avatar = $wpdb->get_row($wpdb->prepare(" SELECT * FROM {$wpdb->prefix}avatar_studio_avatars WHERE id = %d ", $id));

        if (!$avatar) {
            wp_send_json_error(['message' => 'avatar not found'], 404);
        }

        $data = [
            'api_key' => isset($avatar->api_key) ? $avatar->api_key : '',
            'vendor' => isset($avatar->vendor) ? $avatar->vendor : '',
            'title' => isset($avatar->title) ? $avatar->title : '',
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
        } else {
            $id = $wpdb->insert_id;
            wp_redirect(admin_url('admin.php?page=avatar_studio-avatars&copied=1'));
        }
        wp_redirect(admin_url('admin.php?page=avatar_studio-avatars&copied=0'));
        exit;
    }


    public function getAvataravatars()
    {
        global $wpdb;

        // Optional: Add filtering logic here (e.g., based on query vars)
        $avatars = $wpdb->get_results("
            SELECT id, vendor, api_key, title, description,  avatar_id, knowledge_id, preview_image,thumbnail_mini,thumbnail_medium,thumbnail_large,active_thumbnail, avatar_name, time_limit, voice_emotion, pages, styles, open_on_desktop, show_on_mobile, livekit_enable,RAG_API_URL,deepgramKEY,welcome_message   
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

        $avatar = $wpdb->get_row($wpdb->prepare(" SELECT * FROM {$wpdb->prefix}avatar_studio_avatars WHERE id = %d ", $avatarID));

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
        // Allow iframe
        $allowed_tags['iframe'] = [
            'src' => true,
            'height' => true,
            'width' => true,
            'frameborder' => true,
            'allow' => true,
            'allowfullscreen' => true,
            'style' => true,
            'title' => true,
            'referrerpolicy' => true,
        ];

        // Allow script
        $allowed_tags['script'] = [
            'type' => true,
            'src' => true,
            'async' => true,
            'defer' => true,
            'crossorigin' => true,
            'integrity' => true,
        ];

        // Allow link rel="stylesheet"
        $allowed_tags['link'] = [
            'rel' => true,
            'href' => true,
            'type' => true,
            'media' => true,
            'integrity' => true,
            'crossorigin' => true,
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
