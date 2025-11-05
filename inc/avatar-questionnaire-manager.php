<?php


if (!defined('ABSPATH'))
    exit;
class avatar_studio_questionnaire_Manager
{
    public function __construct()
    {
        add_action('admin_menu', [$this, 'add_admin_pages']);
        add_action('admin_post_save_questionnaire', [$this, 'handle_save_questionnaire']);
        add_action('admin_post_save_option', [$this, 'handle_save_option']);
        add_action('admin_post_update_option', [$this, 'handle_update_option']);
        add_action('admin_post_delete_questionnaire', [$this, 'handle_delete_questionnaire']);
        add_action('admin_post_delete_option', [$this, 'handle_delete_option']);

        add_action('admin_head', [$this, 'add_custom_styles']);
    }

    public function add_admin_pages()
    {
        // add_menu_page(
        //     'Avatar Questionnaires',
        //     'Avatar Questionnaires',
        //     'manage_options',
        //     'avatar-questionnaires',
        //     [$this, 'render_questionnaire_page'],
        //     'dashicons-format-status',
        //     26
        // );

        $hook = add_submenu_page(
            'avatar_studio_main',
            'Avatar Questionnaires',
            'Avatar Questionnaires',
            'manage_options',
            'avatar-questionnaires',
            [$this, 'render_questionnaire_page'],
        );
        add_action("load-$hook", [$this, 'avatar_studio_questionnaires_add_screen_options']);
        add_filter('set-screen-option', [$this, 'avatar_studio_questionnaires_set_screen_option'], 10, 3);


        $hook = add_submenu_page(
            'avatar_studio_main',
            'Questionnaire Answers',
            'Questionnaire Answers',
            'manage_options',
            'avatar-questionnaires-answers',
            [$this, 'render_questionnaire_answers_page'],
        );
        add_action("load-$hook", [$this, 'avatar_studio_questionnaire_answers_add_screen_options']);
        add_filter('set-screen-option', [$this, 'avatar_studio_questionnaire_answers_set_screen_option'], 10, 3);
        add_submenu_page(
            null, // Hidden from sidebar
            'Manage Options',
            'Manage Options',
            'manage_options',
            'avatar-questionnaire-options',
            [$this, 'render_options_page']
        );
        add_submenu_page(
            null,
            'Edit Option',
            'Edit Option',
            'manage_options',
            'avatar-edit-option',
            [$this, 'render_edit_option_page']
        );
    }
    public function add_custom_styles()
    {
        $screen = get_current_screen();
        if ($screen && (strpos($screen->id, 'avatar-questionnaires') !== false || strpos($screen->id, 'avatar-questionnaire-options') !== false)) {
            echo '<style>
            .avatar-questionnaire-form,
            .avatar-option-form {
                background: #fff;
                border: 1px solid #ccd0d4;
                padding: 20px;
                margin-bottom: 30px;
                border-radius: 6px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            }
            .avatar-questionnaire-form .form-table th,
            .avatar-option-form .form-table th {
                width: 180px;
                padding: 12px 10px;
            }
            .avatar-questionnaire-form .form-table td,
            .avatar-option-form .form-table td {
                padding: 12px 10px;
            }
            .avatar-questionnaire-form input[type="text"],
            .avatar-questionnaire-form input[type="number"],
            .avatar-questionnaire-form select,
            .avatar-questionnaire-form textarea,
            .avatar-option-form input[type="text"],
            .avatar-option-form textarea {
                width: 100%;
                max-width: 400px;
            }
            .avatar-option-form textarea {
                resize: vertical;
            }
            .avatar-option-form .button {
                margin-top: 10px;
            }
        </style>';
        }
    }
    /**
     * Questionnaire
     */
    public function render_questionnaire_page()
    {
        global $wpdb;


        $editing = isset($_GET['edit_id']);
        $edit_id = $editing ? intval($_GET['edit_id']) : 0;
        $avatar_studio_id = isset($_REQUEST['avatar_studio_id']) ? intval($_REQUEST['avatar_studio_id']) : 0;
        $questionnaire = null;

        if ($editing) {
            $questionnaire = $wpdb->get_row($wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}avatar_studio_questionnaires WHERE id = %d",
                $edit_id
            ));

            if (!$questionnaire) {
                echo '<div class="notice notice-error"><p>Invalid questionnaire ID.</p></div>';
                $editing = false;
            }
            if (!$avatar_studio_id && $questionnaire->avatar_studio_id) {
                $avatar_studio_id = $questionnaire->avatar_studio_id;
                $redirect_to = admin_url("admin.php?page=avatar-questionnaires&avatar_studio_id=$avatar_studio_id&edit_id=$edit_id");
                echo '<script>window.location.href = "' . $redirect_to . '";</script>';
                exit;
            }
        }

        if (!empty($_GET['updated'])) {
            echo '<div class="notice notice-success is-dismissible"><p>Questionnaire updated.</p></div>';
        }
        if (!empty($_GET['saved'])) {
            echo '<div class="notice notice-success is-dismissible"><p>Questionnaire saved.</p></div>';
        }
        if (!empty($_GET['deleted'])) {
            echo '<div class="notice notice-success is-dismissible"><p>Questionnaire deleted.</p></div>';
        }
        echo '<div class="wrap">';
        echo '<h1>Avatar Questionnaires</h1>';

        // New questionnaire form  
        echo '<h2>' . ($editing ? 'Edit Questionnaire' : 'Add New Questionnaire') . '</h2>';

        echo '<form method="post" action="' . admin_url('admin-post.php') . '" class="avatar-questionnaire-form">';
        wp_nonce_field('save_questionnaire');
        echo '<input type="hidden" name="action" value="save_questionnaire">';
        if ($editing)
            echo '<input type="hidden" name="edit_id" value="' . esc_attr($edit_id) . '">';
        echo '<input type="hidden" name="avatar_studio_id" value="' . esc_attr($avatar_studio_id) . '">';

        echo '<table class="form-table">
            <tr>
                <th><label for="title">Title</label></th>
                <td><input type="text" name="title" id="title" class="regular-text" value="' . esc_attr($questionnaire->title ?? '') . '" required></td>
            </tr>
            <tr>
                <th><label for="description">Description</label></th>
                <td><textarea name="description" id="description" class="large-text" rows="3">' . esc_textarea($questionnaire->description ?? '') . '</textarea></td>
            </tr>
            <tr>
                <th><label for="renderOn">Render On</label></th>
                <td><input type="number" name="renderOn" id="renderOn" class="small-text" value="' . esc_attr($questionnaire->renderOn ?? '') . '"></td>
            </tr>
            <tr>
                <th><label for="questionType">Question Type</label></th>
                <td>
                    <select name="questionType" id="questionType" required>
                        <option value="">Select type</option>
                        <option value="radio" ' . selected($questionnaire->questionType ?? '', 'radio', false) . '>Radio</option>
                        <option value="checkbox" ' . selected($questionnaire->questionType ?? '', 'checkbox', false) . '>Checkbox</option>
                        <option value="input" ' . selected($questionnaire->questionType ?? '', 'input', false) . '>Input</option>
                    </select>
                </td>
            </tr>
            <tr>
                <th><label for="instructions">Instructions</label></th>
                <td><input type="text" name="instructions" id="instructions" class="regular-text" value="' . esc_attr($questionnaire->instructions ?? '') . '"></td>
            </tr>
        </table>';

        submit_button($editing ? 'Update Questionnaire' : 'Save Questionnaire');
        echo '</form>';
        echo '<hr>';

        // List existing
        require_once 'questionnaire-table.php';
        echo '<h2>Avatar Questionnaires</h2>';

        $table = new Avatar_Studio_Questionnaires_Table();
        $table->prepare_items();

        echo '<form method="get">';
        echo '<input type="hidden" name="page" value="' . esc_attr($_REQUEST['page']) . '" />';
        $table->display();
        echo '</form>';


        echo '</div>';
    }
    function avatar_studio_questionnaires_add_screen_options()
    {
        add_screen_option('per_page', [
            'label' => 'Questionnaires per page',
            'default' => 20,
            'option' => 'questionnaires_per_page'
        ]);
    }

    function avatar_studio_questionnaires_set_screen_option($status, $option, $value)
    {
        if ($option === 'questionnaires_per_page') {
            return (int) $value;
        }
        return $status;
    }
    /**
     * Questionnaire answers
     */
    public function render_questionnaire_answers_page()
    {
        global $wpdb;


        if (!empty($_GET['updated'])) {
            echo '<div class="notice notice-success is-dismissible"><p>Questionnaire updated.</p></div>';
        }
        if (!empty($_GET['saved'])) {
            echo '<div class="notice notice-success is-dismissible"><p>Questionnaire saved.</p></div>';
        }
        if (!empty($_GET['deleted'])) {
            echo '<div class="notice notice-success is-dismissible"><p>Questionnaire deleted.</p></div>';
        }
        if (!empty($_GET['copied'])) {
            echo '<div class="notice notice-success is-dismissible"><p>Questionnaire Copied.</p></div>';
        }
        echo '<div class="wrap">';
        echo '<h1>Avatar Questionnaire Answers</h1>';

        require_once 'questionnaire-answers-table.php';
        $table = new avatar_studio_questionnaire_Answers_Table();
        $table->prepare_items();

        echo '<form method="get">';
        echo '<input type="hidden" name="page" value="' . esc_attr($_REQUEST['page']) . '" />';
        $table->display();
        echo '</form>';

        echo '</div>';
    }
    function avatar_studio_questionnaire_answers_add_screen_options()
    {
        $args = [
            'label' => 'Answers per page',
            'default' => 20,
            'option' => 'answers_per_page'
        ];
        add_screen_option('per_page', $args);
    }
    // Save screen options
    function avatar_studio_questionnaire_answers_set_screen_option($status, $option, $value)
    {
        if ($option === 'answers_per_page') {
            return (int) $value;
        }
        return $status;
    }
    public function handle_save_questionnaire()
    {
        if (!current_user_can('manage_options') || !check_admin_referer('save_questionnaire')) {
            wp_die('Not allowed');
        }

        global $wpdb;
        $avatar_studio_id = intval($_POST['avatar_studio_id']);
        $data = [
            'title' => sanitize_text_field($_POST['title']),
            'avatar_studio_id' => $avatar_studio_id,
            'description' => sanitize_textarea_field($_POST['description']),
            'renderOn' => intval($_POST['renderOn']),
            'questionType' => sanitize_text_field($_POST['questionType']),
            'instructions' => sanitize_text_field($_POST['instructions']),
        ];

        $edit_id = isset($_POST['edit_id']) ? intval($_POST['edit_id']) : 0;

        if ($edit_id > 0) {
            // Update
            $wpdb->update("{$wpdb->prefix}avatar_studio_questionnaires", $data, ['id' => $edit_id]);
            wp_redirect(admin_url("admin.php?page=avatar-questionnaires&avatar_studio_id=$avatar_studio_id&updated=1"));
        } else {
            // Insert new
            $wpdb->insert("{$wpdb->prefix}avatar_studio_questionnaires", $data);
            wp_redirect(admin_url("admin.php?page=avatar-questionnaires&avatar_studio_id=$avatar_studio_id&saved=1"));
        }

        exit;
    }

    public function handle_delete_questionnaire()
    {
        if (!current_user_can('manage_options')) {
            wp_die('Permission denied.');
        }

        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        $avatar_studio_id = isset($_REQUEST['avatar_studio_id']) ? intval($_REQUEST['avatar_studio_id']) : 0;

        if (!$id || !check_admin_referer('delete_questionnaire_' . $id)) {
            wp_die('Invalid request.');
        }

        global $wpdb;

        // Delete options first to avoid orphaned data
        $wpdb->delete("{$wpdb->prefix}avatar_studio_questionnaires_to_options", ['question_id' => $id]);

        // Delete questionnaire
        $wpdb->delete("{$wpdb->prefix}avatar_studio_questionnaires", ['id' => $id]);

        wp_redirect(admin_url("admin.php?page=avatar-questionnaires&avatar_studio_id=$avatar_studio_id&deleted=1"));
        exit;
    }

    public function render_options_page()
    {
        global $wpdb;
        if (!empty($_GET['option_deleted'])) {
            echo '<div class="notice notice-success is-dismissible"><p>Option deleted successfully.</p></div>';
        }
        $question_id = intval($_GET['question_id'] ?? 0);
        if (!$question_id)
            wp_die('No questionnaire selected.');

        $questionnaire = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$wpdb->prefix}avatar_studio_questionnaires WHERE id = %d", $question_id));
        if (!$questionnaire)
            wp_die('Questionnaire not found.');
        $avatar_studio_id = $questionnaire->avatar_studio_id;
        $options = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$wpdb->prefix}avatar_studio_questionnaires_to_options WHERE question_id = %d", $question_id));

        echo '<div class="wrap">';
        echo "<h1>Manage Options for: {$questionnaire->title}</h1>";
        echo '<p><a href="' . admin_url("admin.php?page=avatar-questionnaires&avatar_studio_id=$avatar_studio_id") . '" class="button">← Back to Questionnaires</a></p>';

        if (!empty($_GET['updated'])) {
            echo '<div class="updated notice is-dismissible"><p>Option updated successfully.</p></div>';
        }

        echo '<h2>Add New Option</h2>';
        echo '<div class="avatar-option-form">';
        echo '<form method="post" action="' . admin_url('admin-post.php') . '">';
        wp_nonce_field('save_option');
        echo '<input type="hidden" name="action" value="save_option">';
        echo '<input type="hidden" name="question_id" value="' . intval($question_id) . '">';

        echo '<table class="form-table">
            <tr>
                <th><label for="option_title">Option Title</label></th>
                <td><input type="text" name="option_title" id="option_title" class="regular-text" placeholder="e.g. Blue" required></td>
            </tr>
            <tr>
                <th><label for="note">Note</label></th>
                <td><textarea name="note" id="note" class="large-text" rows="3" placeholder="Optional note..."></textarea></td>
            </tr>
            <tr>
                <th><label for="instructions">Instructions</label></th>
                <td><input type="text" name="instructions" id="instructions" class="regular-text" placeholder="Instructions shown to user..."></td>
            </tr>
            <tr>
                <th><label for="isCorrect">Correct Answer?</label></th>
                <td><input type="checkbox" name="isCorrect" id="isCorrect" value="1"> <label for="isCorrect">Mark as correct</label></td>
            </tr>
        </table>';

        submit_button('Add Option');
        echo '</form>';
        echo '</div>';

        echo '<h2>Existing Options</h2>';
        echo '<table class="widefat"><thead>
            <tr><th>ID</th><th>Title</th><th>Correct</th><th>Instructions</th><th>Action</th></tr>
          </thead><tbody>';
        foreach ($options as $opt) {
            $edit_url = admin_url("admin.php?page=avatar-edit-option&option_id={$opt->id}&question_id={$question_id}");
            $delete_url = wp_nonce_url(
                admin_url("admin-post.php?action=delete_option&id={$opt->id}&question_id={$question_id}"),
                'delete_option_' . $opt->id
            );
            echo "<tr>
                <td>{$opt->id}</td>
                <td>{$opt->option_title}</td>
                <td>" . ($opt->isCorrect ? '✔' : '✘') . "</td>
                <td>{$opt->instructions}</td>
                <td>
                    <a href='{$edit_url}'>Edit</a> | 
                    <a href='{$delete_url}' onclick=\"return confirm('Delete this option?');\">Delete</a>
                </td>
            </tr>";
        }
        echo '</tbody></table>';

        echo '<p><a href="' . admin_url("admin.php?page=avatar-questionnaires&avatar_studio_id=$avatar_studio_id") . '" class="button">← Back to Questionnaires</a></p>';

        echo '</div>';
    }

    public function handle_save_option()
    {
        if (!current_user_can('manage_options') || !check_admin_referer('save_option')) {
            wp_die('Not allowed');
        }

        global $wpdb;

        $wpdb->insert("{$wpdb->prefix}avatar_studio_questionnaires_to_options", [
            'question_id' => intval($_POST['question_id']),
            'option_title' => sanitize_text_field($_POST['option_title']),
            'note' => sanitize_textarea_field($_POST['note']),
            'instructions' => sanitize_text_field($_POST['instructions']),
            'isCorrect' => isset($_POST['isCorrect']) ? 1 : 0,
            'timestamp' => current_time('mysql'),
        ]);

        $url = admin_url('admin.php?page=avatar-questionnaire-options&question_id=' . intval($_POST['question_id']));
        wp_redirect($url);
        exit;
    }
    public function render_edit_option_page()
    {
        global $wpdb;

        $option_id = intval($_GET['option_id'] ?? 0);
        $question_id = intval($_GET['question_id'] ?? 0);

        $option = $wpdb->get_row($wpdb->prepare("
        SELECT * FROM {$wpdb->prefix}avatar_studio_questionnaires_to_options WHERE id = %d
    ", $option_id));

        if (!$option) {
            wp_die('Option not found.');
        }

        echo '<div class="wrap">';
        echo '<h1>Edit Option</h1>';
        echo '<div class="avatar-option-form">';
        echo '<form method="post" action="' . admin_url('admin-post.php') . '">';
        wp_nonce_field('update_option');
        echo '<input type="hidden" name="action" value="update_option">';
        echo '<input type="hidden" name="option_id" value="' . $option_id . '">';
        echo '<input type="hidden" name="question_id" value="' . $question_id . '">';

        echo '<table class="form-table">
            <tr>
                <th><label for="option_title">Option Title</label></th>
                <td><input type="text" name="option_title" id="option_title" class="regular-text" value="' . esc_attr($option->option_title) . '" required></td>
            </tr>
            <tr>
                <th><label for="note">Note</label></th>
                <td><textarea name="note" id="note" class="large-text" rows="3">' . esc_textarea($option->note) . '</textarea></td>
            </tr>
            <tr>
                <th><label for="instructions">Instructions</label></th>
                <td><input type="text" name="instructions" id="instructions" class="regular-text" value="' . esc_attr($option->instructions) . '"></td>
            </tr>
            <tr>
                <th><label for="isCorrect">Correct Answer?</label></th>
                <td><input type="checkbox" name="isCorrect" id="isCorrect" value="1" ' . checked($option->isCorrect, 1, false) . '> <label for="isCorrect">Mark as correct</label></td>
            </tr>
        </table>';

        submit_button('Update Option');
        echo '</form>';
        echo '<p><a href="' . admin_url('admin.php?page=avatar-questionnaire-options&question_id=' . $question_id) . '" class="button">← Back to Questionnaire</a></p>';

        echo '</div>';
        echo '</div>';
    }

    public function handle_update_option()
    {
        if (!current_user_can('manage_options') || !check_admin_referer('update_option')) {
            wp_die('Not allowed');
        }

        global $wpdb;

        $option_id = intval($_POST['option_id']);
        $question_id = intval($_POST['question_id']);

        $wpdb->update("{$wpdb->prefix}avatar_studio_questionnaires_to_options", [
            'option_title' => sanitize_text_field($_POST['option_title']),
            'note' => sanitize_textarea_field($_POST['note']),
            'instructions' => sanitize_text_field($_POST['instructions']),
            'isCorrect' => isset($_POST['isCorrect']) ? 1 : 0,
        ], [
            'id' => $option_id
        ]);

        wp_redirect(admin_url("admin.php?page=avatar-questionnaire-options&question_id=$question_id&updated=1"));
        exit;
    }
    public function handle_delete_option()
    {
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized access.');
        }

        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        $question_id = isset($_GET['question_id']) ? intval($_GET['question_id']) : 0;

        if (!$id || !check_admin_referer('delete_option_' . $id)) {
            wp_die('Invalid request.');
        }

        global $wpdb;

        $wpdb->delete("{$wpdb->prefix}avatar_studio_questionnaires_to_options", ['id' => $id]);

        wp_redirect(admin_url("admin.php?page=avatar-questionnaire-options&question_id={$question_id}&option_deleted=1"));
        exit;
    }


    public function getAvatarQuestionnaires()
    {
        global $wpdb;

        $avatar_studio_id = isset($_REQUEST['avatar_studio_id']) ? intval($_REQUEST['avatar_studio_id']) : 0;
        // Optional: Add filtering logic here (e.g., based on query vars)
        $questionnaires = $wpdb->get_results("
        SELECT id, avatar_studio_id,title, description, renderOn, questionType, instructions 
        FROM {$wpdb->prefix}avatar_studio_questionnaires  WHERE avatar_studio_id = $avatar_studio_id
        ORDER BY renderOn ASC
    ");

        wp_send_json_success($questionnaires);
    }

    public function getAvatarQuestionnaire()
    {
        global $wpdb;

        $question_id = isset($_REQUEST['id']) ? intval($_REQUEST['id']) : 0;

        if (!$question_id) {
            wp_send_json_error(['message' => 'Missing questionnaire ID'], 400);
        }

        $questionnaire = $wpdb->get_row($wpdb->prepare("
        SELECT * FROM {$wpdb->prefix}avatar_studio_questionnaires WHERE id = %d
    ", $question_id));

        if (!$questionnaire) {
            wp_send_json_error(['message' => 'Questionnaire not found'], 404);
        }

        $options = $wpdb->get_results($wpdb->prepare("
        SELECT id, option_title, note, isCorrect, instructions 
        FROM {$wpdb->prefix}avatar_studio_questionnaires_to_options 
        WHERE question_id = %d
    ", $question_id));

        wp_send_json_success([
            'questionnaire' => $questionnaire,
            'options' => $options
        ]);
    }

    public function postUserAnswer()
    {

        $question_id = isset($_REQUEST['question_id']) ? intval($_REQUEST['question_id']) : '';
        $session_id = isset($_REQUEST['session_id']) ? sanitize_textarea_field($_REQUEST['session_id']) : '';
        $access_token = isset($_REQUEST['access_token']) ? sanitize_textarea_field($_REQUEST['access_token']) : '';
        $title = isset($_REQUEST['title']) ? sanitize_textarea_field($_REQUEST['title']) : '';
        $answer = isset($_REQUEST['answer']) ? sanitize_textarea_field($_REQUEST['answer']) : '';


        global $wpdb;

        $insert_result = $wpdb->insert("{$wpdb->prefix}avatar_studio_questionnaires_answers", [
            'question_id' => $question_id,
            'session_id' => $session_id,
            'access_token' => $access_token,
            'title' => $title,
            'answer' => $answer,
            'timestamp' => current_time('mysql'),
        ]);
        if ($insert_result === false) {
            wp_send_json_error(['message' => 'Insert failed', 'error' => $wpdb->last_error], 400);
        } else {
            wp_send_json_success([$wpdb->insert_id]);
        }
    }
}
$getavaterquestionnaireManager = new avatar_studio_questionnaire_Manager();
