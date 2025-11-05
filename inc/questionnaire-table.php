<?php

if (!class_exists('WP_List_Table')) {
    require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
}
class Avatar_Studio_Questionnaires_Table extends WP_List_Table
{

    public function __construct()
    {
        parent::__construct([
            'singular' => 'questionnaire',
            'plural' => 'questionnaires',
            'ajax' => false,
        ]);

        $this->screen = get_current_screen(); // Enables screen options
    }

    public function prepare_items()
    {
        global $wpdb;

        $per_page = $this->get_items_per_page('questionnaires_per_page', 20);
        $paged = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;
        $offset = ($paged - 1) * $per_page;

        $orderby = isset($_GET['orderby']) ? sanitize_sql_orderby($_GET['orderby']) : 'id';
        $order = (isset($_GET['order']) && strtolower($_GET['order']) === 'asc') ? 'ASC' : 'DESC';
        $avatar_studio_id = isset($_REQUEST['avatar_studio_id']) ? intval($_REQUEST['avatar_studio_id']) : 0;

        $sortable_columns = ['id', 'title', 'renderOn', 'questionType', 'timestamp'];
        if (!in_array($orderby, $sortable_columns)) {
            $orderby = 'id';
        }

        $table = $wpdb->prefix . 'avatar_studio_questionnaires';
        if ($avatar_studio_id > 0) {
            $total_items = $wpdb->get_var("SELECT COUNT(*) FROM $table WHERE avatar_studio_id = $avatar_studio_id");
            $query = $wpdb->prepare(
                "SELECT * FROM $table WHERE avatar_studio_id = $avatar_studio_id ORDER BY $orderby $order LIMIT %d OFFSET %d",
                $per_page,
                $offset
            );
        } else {
            $total_items = $wpdb->get_var("SELECT COUNT(*) FROM $table  ");
            $query = $wpdb->prepare(
                "SELECT * FROM $table ORDER BY $orderby $order LIMIT %d OFFSET %d",
                $per_page,
                $offset
            );
        }



        $this->items = $wpdb->get_results($query);

        $columns = $this->get_columns();
        $hidden = get_hidden_columns($this->screen);
        $sortable = $this->get_sortable_columns();
        $this->_column_headers = [$columns, $hidden, $sortable];

        $this->set_pagination_args([
            'total_items' => $total_items,
            'per_page' => $per_page,
            'total_pages' => ceil($total_items / $per_page),
        ]);
    }

    public function get_columns()
    {
        return [
            'id' => 'ID',
            'title_desc' => 'Title & Description',
            'renderOn' => 'Render On',
            'questionType' => 'Type',
            'instructions' => 'Instructions',
            'options' => 'Options',
            'actions' => 'Actions',
        ];
    }

    public function get_sortable_columns()
    {
        return [
            'id' => ['id', false],
            'title_desc' => ['title', false],
            'renderOn' => ['renderOn', false],
            'questionType' => ['questionType', false],
        ];
    }

    public function column_default($item, $column_name)
    {
        global $wpdb;

        switch ($column_name) {
            case 'id':
                return esc_html($item->id);
            case 'title_desc':
                return '<strong>' . esc_html($item->title) . '</strong><br><small>' . esc_html($item->description) . '</small>';
            case 'renderOn':
            case 'questionType':
            case 'instructions':
                return esc_html($item->$column_name);
            case 'options':
                $options = $wpdb->get_results(
                    $wpdb->prepare("SELECT * FROM {$wpdb->prefix}avatar_studio_questionnaires_to_options WHERE question_id = %d", $item->id)
                );
                $output = '<ul style="margin:0; padding-left:18px;">';
                foreach ($options as $opt) {
                    $correct = $opt->isCorrect ? ' <span style="color:green;">✔</span>' : '';
                    $instr = $opt->instructions ? "<em> - {$opt->instructions}</em>" : '';
                    $output .= '<li><strong>' . esc_html($opt->option_title) . "</strong>$correct$instr</li>";
                }
                $output .= '</ul>';
                return $output;

            case 'actions':
                $edit_url = esc_url(admin_url("admin.php?page=avatar-questionnaires&edit_id={$item->id}"));
                $options_url = esc_url(admin_url("admin.php?page=avatar-questionnaire-options&question_id={$item->id}"));
                $delete_url = wp_nonce_url(
                    admin_url("admin-post.php?action=delete_questionnaire&id={$item->id}"),
                    'delete_questionnaire_' . $item->id
                );
                return "<a href='{$edit_url}'>Edit</a> | <a href='{$options_url}'>Manage Options</a> | <a href='{$delete_url}' onclick=\"return confirm('Are you sure?');\">Delete</a>";

            default:
                return print_r($item, true);
        }
    }
}
