<?php

if (!class_exists('WP_List_Table')) {
    require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
}

class avatar_studio_questionnaire_Answers_Table extends WP_List_Table
{

    public function __construct()
    {
        parent::__construct([
            'singular' => 'answer',
            'plural'   => 'answers',
            'ajax'     => false,
        ]);

        $this->screen = get_current_screen(); // Required for column hiding
    }

    public function prepare_items()
    {
        global $wpdb;

        $per_page = $this->get_items_per_page('answers_per_page', 20);
        $paged = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;
        $offset = ($paged - 1) * $per_page;

        $orderby = isset($_GET['orderby']) ? sanitize_sql_orderby($_GET['orderby']) : 'id';
        $order = (isset($_GET['order']) && strtolower($_GET['order']) === 'asc') ? 'ASC' : 'DESC';

        // Whitelist sortable columns
        $sortable_columns = ['id', 'session_id', 'question_id', 'title', 'timestamp'];
        if (!in_array($orderby, $sortable_columns)) {
            $orderby = 'id';
        }

        $table = $wpdb->prefix . 'avatar_studio_questionnaires_answers';

        $total_items = $wpdb->get_var("SELECT COUNT(*) FROM $table");

        $query = $wpdb->prepare(
            "SELECT * FROM $table ORDER BY $orderby $order LIMIT %d OFFSET %d",
            $per_page,
            $offset
        );

        $this->items = $wpdb->get_results($query);

        $columns  = $this->get_columns();
        $hidden   = get_hidden_columns($this->screen);
        $sortable = $this->get_sortable_columns();
        $this->_column_headers = [$columns, $hidden, $sortable];

        $this->set_pagination_args([
            'total_items' => $total_items,
            'per_page'    => $per_page,
            'total_pages' => ceil($total_items / $per_page),
        ]);
    }

    public function get_columns()
    {
        return [
            'id'         => 'ID',
            'session_id' => 'Session',
            'question_id' => 'Question id',
            'title'      => 'Title',
            'answer'     => 'Answer',
            'timestamp'  => 'Time',
            'actions'    => 'Actions',
        ];
    }

    public function get_sortable_columns()
    {
        return [
            'id'        => ['id', false],
            'session_id' => ['Session id', false],
            'question_id' => ['Question id', false],
            'title'     => ['title', false],
            'timestamp' => ['timestamp', false],
        ];
    }

    public function column_default($item, $column_name)
    {
        switch ($column_name) {
            case 'id':
            case 'session_id':
                return esc_html($item->$column_name);
            case 'question_id':
                return esc_html($item->$column_name);
            case 'answer':
                $decoded = json_decode(stripslashes($item->answer), true);
                if (is_array($decoded)) {
                    $result = '';
                    $result .= '<ul style="margin:0;">';
                    foreach ($decoded as $item) {
                        $result .= '<li>' . esc_html($item) . '</li>';
                    }
                    $result .= '</ul>';
                    return $result;
                } else {
                    // return esc_html($item->answer);
                }
                break;
            case 'timestamp':
                return esc_html($item->$column_name);
            case 'title':
                return '<strong>' . esc_html($item->title) . '</strong>';
            case 'actions':
                return '';
            default:
                return print_r($item, true);
        }
    }
}
