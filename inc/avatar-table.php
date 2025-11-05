<?php

if (!class_exists('WP_List_Table')) {
    require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
}
class Avatar_Studio_Avatars_Table extends WP_List_Table
{

    public function __construct()
    {
        parent::__construct([
            'singular' => 'avatar',
            'plural' => 'avatars',
            'ajax' => false,
        ]);

        $this->screen = get_current_screen(); // Enables screen options
    }

    public function prepare_items()
    {
        global $wpdb;

        $per_page = $this->get_items_per_page('avatars_per_page', 20);
        $paged = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;
        $offset = ($paged - 1) * $per_page;

        $orderby = isset($_GET['orderby']) ? sanitize_sql_orderby($_GET['orderby']) : 'id';
        $order = (isset($_GET['order']) && strtolower($_GET['order']) === 'asc') ? 'ASC' : 'DESC';

        $sortable_columns = ['id', 'title', 'timestamp'];
        if (!in_array($orderby, $sortable_columns)) {
            $orderby = 'id';
        }

        $table = $wpdb->prefix . 'avatar_studio_avatars';
        $total_items = $wpdb->get_var("SELECT COUNT(*) FROM $table");

        $query = $wpdb->prepare(
            "SELECT * FROM $table ORDER BY $orderby $order LIMIT %d OFFSET %d",
            $per_page,
            $offset
        );

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
            'preview_image' => 'Preview Image',
            'vendor' => 'Vendor  ',
            'title' => 'Title  ',
            'avatar_name' => 'Avatar Name',
            'avatar_id' => 'Avatar/Replica ID',
            'knowledge_id' => 'Knowledge/Persona ID',
            'time_limit' => 'Time(s)',
            // 'api_key' => 'Key',
            'shortcode' => 'Shortcode',
            'actions' => 'Actions',
        ];
    }

    public function get_sortable_columns()
    {
        return [
            'id' => ['id', false],
            'vendor' => ['vendor', false],
            'title' => ['title', false],
            'avatar_name' => ['avatar_name', false],
            'avatar_id' => ['avatar_id', false],
            'knowledge_id' => ['knowledge_id', false],
            'time_limit' => ['time_limit', false],
            'api_key' => ['api_key', false],
        ];
    }

    public function column_default($item, $column_name)
    {
        global $wpdb;

        switch ($column_name) {
            case 'id':
                return esc_html($item->id);
            case 'title':
                return '<strong>' . esc_html($item->title) . '</strong><br><small>' . esc_html($item->description) . '</small>';
            case 'vendor':
            case 'avatar_name':
            case 'avatar_id':
            case 'knowledge_id':
            case 'time_limit':
            case 'api_key':
                return esc_html($item->$column_name);

            case 'shortcode':
                $html = '<div class="shortcode-copy-wrap">';
                $html .= '<code class="shortcode-text">[avatar_studio id="' . esc_html($item->id) . '" ]</code>';
                $html .= '<button class="copy-shortcode-btn" type="button">Copy</button>';
                $html .= '</div>';
                return $html;

            case 'preview_image':
                if ($item->preview_image) {
                    return '<img src="' . esc_url($item->preview_image) . '" alt="' . esc_attr($item->title) . '" style="max-width:100px;height:auto;">';
                } else {
                    return 'No Image';
                }
            case 'actions':
                $edit_url = esc_url(admin_url("admin.php?page=avatar_studio-edit-avatar&id={$item->id}"));
                $questionnaires_url = esc_url(admin_url("admin.php?page=avatar-questionnaires&avatar_studio_id={$item->id}"));
                $delete_url = wp_nonce_url(
                    admin_url("admin-post.php?action=delete_avatar&id={$item->id}"),
                    'delete_avatar_' . $item->id
                );
                $copy_url = wp_nonce_url(
                    admin_url("admin-post.php?action=copy_avatar&id={$item->id}"),
                    'copy_avatar_' . $item->id
                );
                return "<a href='{$copy_url}' onclick=\"return confirm('Are you sure ?');\">Duplicate</a> | <a href='{$edit_url}'>Edit</a> <br> <a href='{$questionnaires_url}'>Questionnaires</a> |  <a href='{$delete_url}' onclick=\"return confirm('Are you sure?');\">Delete</a> ";

            default:
                return print_r($item, true);
        }
    }
}
