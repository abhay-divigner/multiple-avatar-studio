<?php
if (!defined('ABSPATH')) {
    exit;
}

class Avatar_Form_Builder {
    private static $instance = null;
    private $table_name;
    private $submissions_table;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        global $wpdb;
        $this->table_name = $wpdb->prefix . 'avatar_forms';
        $this->submissions_table = $wpdb->prefix . 'avatar_form_submissions';
        
        $this->init_hooks();
        $this->create_tables();
    }
    
    private function create_tables() {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();
        
        // Forms table
        $sql1 = "CREATE TABLE IF NOT EXISTS {$this->table_name} (
            id INT(11) NOT NULL AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            form_data LONGTEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        // Submissions table
        $sql2 = "CREATE TABLE IF NOT EXISTS {$this->submissions_table} (
            id INT(11) NOT NULL AUTO_INCREMENT,
            form_id INT(11) NOT NULL,
            session_id VARCHAR(100),
            avatar_studio_id INT(11),
            submission_data LONGTEXT NOT NULL,
            submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY form_id (form_id),
            KEY session_id (session_id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql1);
        dbDelta($sql2);
    }
    
    private function init_hooks() {
        add_action('admin_menu', [$this, 'add_admin_pages']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_scripts']);
        add_action('wp_ajax_save_avatar_form', [$this, 'ajax_save_form']);
        add_action('wp_ajax_get_avatar_form', [$this, 'ajax_get_form']);
        add_action('wp_ajax_delete_avatar_form', [$this, 'ajax_delete_form']);
        add_action('wp_ajax_get_form_submissions', [$this, 'ajax_get_submissions']);
        add_action('wp_ajax_nopriv_submit_avatar_form', [$this, 'ajax_submit_form']);
        add_action('wp_ajax_submit_avatar_form', [$this, 'ajax_submit_form']);
    }
    
    public function enqueue_scripts($hook) {
        if ('avatar-studio_page_avatar-form-builder' !== $hook) {
            return;
        }
        
        // Enqueue jQuery UI for drag and drop
        wp_enqueue_script('jquery');
        wp_enqueue_script('jquery-ui-core');
        wp_enqueue_script('jquery-ui-widget');
        wp_enqueue_script('jquery-ui-mouse');
        wp_enqueue_script('jquery-ui-draggable');
        wp_enqueue_script('jquery-ui-droppable');
        wp_enqueue_script('jquery-ui-sortable');
        
        // Localize script for AJAX
        wp_localize_script('jquery', 'avatar_form_builder', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('avatar_form_builder_nonce')
        ]);
    }
    
    public function add_admin_pages() {
        add_submenu_page(
            'avatar_studio_main',
            'Form Builder',
            'Form Builder',
            'manage_options',
            'avatar-form-builder',
            [$this, 'render_form_builder_page']
        );
        
        add_submenu_page(
            null,
            'Form Submissions',
            'Form Submissions',
            'manage_options',
            'avatar-form-submissions',
            [$this, 'render_submissions_page']
        );
    }
    
    public function render_form_builder_page() {
        ?>
        <style>
            /* Main Wrapper */
            .avatar-form-builder-wrapper {
                max-width: 1400px;
                margin: 20px auto;
                padding: 0 20px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, sans-serif;
            }

            /* Header Section */
            .avatar-form-builder-header {
                background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                color: white;
                padding: 32px 40px;
                border-radius: 12px;
                margin-bottom: 24px;
                box-shadow: 0 4px 20px rgba(56, 177, 197, 0.3);
                position: relative;
                overflow: hidden;
            }

            .avatar-form-builder-header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
                pointer-events: none;
            }

            .avatar-form-builder-header h1 {
                font-size: 32px;
                font-weight: 700;
                margin: 0 0 8px 0;
                color: white;
                display: flex;
                align-items: center;
                gap: 12px;
                position: relative;
                z-index: 1;
            }

            .avatar-form-builder-header p {
                margin: 0;
                font-size: 15px;
                opacity: 0.95;
                color: white;
                position: relative;
                z-index: 1;
            }

            /* Create Form Button */
            .create-form-btn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 12px 24px;
                background: white;
                color: #374151;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 14px;
                transition: all 0.3s ease;
                border: 2px solid transparent;
                background-image: 
                    linear-gradient(white, white),
                    linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                background-origin: border-box;
                background-clip: padding-box, border-box;
                box-shadow: 0 4px 15px rgba(56, 177, 197, 0.1);
                cursor: pointer;
                margin-top: 15px;
            }

            .create-form-btn:hover {
                background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(56, 177, 197, 0.3);
                text-decoration: none;
            }

            .create-form-btn svg {
                width: 18px;
                height: 18px;
                transition: transform 0.3s ease;
            }

            .create-form-btn:hover svg {
                transform: scale(1.1);
            }

            /* Modal Styles */
            .avatar-modal {
                display: none;
                position: fixed;
                z-index: 9999;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(4px);
                animation: fadeIn 0.2s ease;
            }

            .avatar-modal.active {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .avatar-modal-content {
                background: white;
                padding: 32px;
                border-radius: 16px;
                max-width: 600px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                border: 2px solid transparent;
                background-image: 
                    linear-gradient(white, white),
                    linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                background-origin: border-box;
                background-clip: padding-box, border-box;
                animation: slideUp 0.3s ease;
                position: relative;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
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

            .avatar-modal-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 20px;
                padding-bottom: 16px;
                border-bottom: 2px solid #f3f4f6;
            }

            .avatar-modal-header h3 {
                font-size: 22px;
                font-weight: 700;
                color: #1f2937;
                margin: 0;
                flex: 1;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .avatar-modal-header h3::before {
                content: '📝';
                font-size: 24px;
            }

            .avatar-modal-close {
                color: #6b7280;
                font-size: 28px;
                font-weight: 700;
                cursor: pointer;
                line-height: 20px;
                transition: all 0.2s ease;
                padding: 5px;
                border-radius: 4px;
                background: #f9fafb;
            }

            .avatar-modal-close:hover {
                color: #dc2626;
                background: #fef2f2;
            }

            .avatar-modal-body {
                margin-bottom: 24px;
            }

            .avatar-modal-footer {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
            }

            /* Form Builder Container */
            .form-builder-container {
                background: white;
                border-radius: 12px;
                overflow: hidden;
                border: 2px solid transparent;
                background-image: 
                    linear-gradient(white, white),
                    linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                background-origin: border-box;
                background-clip: padding-box, border-box;
                box-shadow: 0 4px 15px rgba(56, 177, 197, 0.1);
                margin-top: 24px;
            }

            .form-builder-header {
                background: linear-gradient(135deg, rgba(56, 177, 197, 0.08) 0%, rgba(218, 146, 44, 0.08) 100%);
                padding: 24px 32px;
                border-bottom: 2px solid transparent;
                background-image: 
                    linear-gradient(135deg, rgba(56, 177, 197, 0.08) 0%, rgba(218, 146, 44, 0.08) 100%),
                    linear-gradient(90deg, #38b1c5 0%, #da922c 100%);
                background-origin: border-box;
                background-clip: padding-box, border-box;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .form-builder-header h2 {
                font-size: 24px;
                font-weight: 700;
                color: #fff;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .form-builder-header h2::before {
                content: '';
                font-size: 20px;
            }

            .builder-actions {
                display: flex;
                gap: 12px;
                align-items: center;
            }

            /* Form Builder Body */
            .form-builder-body {
                display: flex;
                min-height: 700px;
            }

            /* Left Panel - Form Fields */
            .form-fields-panel {
                width: 280px;
                padding: 24px;
                background: linear-gradient(135deg, rgba(56, 177, 197, 0.03) 0%, rgba(218, 146, 44, 0.03) 100%);
                border-right: 2px solid #f3f4f6;
            }

            .form-fields-panel h3 {
                font-size: 18px;
                font-weight: 700;
                color: #374151;
                margin: 0 0 12px 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .form-fields-panel h3::before {
                content: '🧩';
                font-size: 16px;
            }

            .form-fields-panel .description {
                color: #6b7280;
                font-size: 13px;
                margin: 0 0 20px 0;
                font-style: italic;
            }

            .field-list {
                display: grid;
                gap: 12px;
                margin-top: 15px;
            }

            .draggable-field {
                background: white;
                border: 2px solid transparent;
                background-image: 
                    linear-gradient(white, white),
                    linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                background-origin: border-box;
                background-clip: padding-box, border-box;
                padding: 14px 16px;
                border-radius: 8px;
                cursor: move;
                display: flex;
                align-items: center;
                gap: 12px;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(56, 177, 197, 0.1);
            }

            .draggable-field:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(56, 177, 197, 0.2);
            }

            .draggable-field.dragging {
                opacity: 0.5;
                transform: scale(0.95);
            }

            .draggable-field i {
                color: #38b1c5;
                font-size: 18px;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .draggable-field span {
                font-weight: 600;
                color: #374151;
                font-size: 14px;
            }

            /* Center Panel - Form Preview */
            .form-preview-panel {
                flex: 1;
                padding: 24px;
                border-right: 2px solid #f3f4f6;
                min-height: 600px;
            }

            .form-preview-panel h3 {
                font-size: 18px;
                font-weight: 700;
                color: #374151;
                margin: 0 0 20px 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .form-preview-panel h3::before {
                content: '👁️';
                font-size: 16px;
            }

            #fieldCount {
                font-size: 14px;
                font-weight: 600;
                background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-left: 8px;
            }

            .droppable-area {
                min-height: 500px;
                padding: 24px;
                background: #fff;
                border: 3px dashed #e5e7eb;
                border-radius: 12px;
                margin-top: 10px;
                transition: all 0.3s ease;
            }

            .droppable-active {
                border-color: #38b1c5;
                background: linear-gradient(135deg, rgba(56, 177, 197, 0.05) 0%, rgba(218, 146, 44, 0.05) 100%);
            }

            .droppable-hover {
                border-color: #da922c;
                background: linear-gradient(135deg, rgba(56, 177, 197, 0.1) 0%, rgba(218, 146, 44, 0.1) 100%);
                transform: scale(1.001);
            }

            /* Right Panel - Field Settings */
            .field-settings-panel {
                width: 320px;
                padding: 24px;
                background: linear-gradient(135deg, rgba(56, 177, 197, 0.03) 0%, rgba(218, 146, 44, 0.03) 100%);
            }

            .field-settings-panel h3 {
                font-size: 18px;
                font-weight: 700;
                color: #374151;
                margin: 0 0 20px 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .field-settings-panel h3::before {
                content: '⚙️';
                font-size: 16px;
            }

            /* Form Field Styles */
            .form-field {
                background: white;
                border: 2px solid #e5e7eb;
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 16px;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .form-field::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, #38b1c5 0%, #da922c 100%);
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .form-field:hover {
                border-color: #38b1c5;
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(56, 177, 197, 0.15);
            }

            .form-field:hover::before {
                opacity: 1;
            }

            .form-field.selected {
                border-color: #38b1c5;
                background: linear-gradient(135deg, rgba(56, 177, 197, 0.03) 0%, rgba(218, 146, 44, 0.03) 100%);
                box-shadow: 0 8px 25px rgba(56, 177, 197, 0.2);
            }

            .form-field.selected::before {
                opacity: 1;
            }

            .field-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 2px solid #f3f4f6;
            }

            .field-label {
                font-weight: 700;
                color: #374151;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 15px;
            }

            .field-label i {
                color: #38b1c5;
                font-size: 18px;
            }

            .field-actions {
                display: flex;
                gap: 8px;
            }

            .field-action-btn {
                width: 32px;
                height: 32px;
                border-radius: 6px;
                border: 2px solid #e5e7eb;
                background: white;
                color: #6b7280;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .field-action-btn:hover {
                transform: scale(1.1);
            }

            .field-action-btn.edit-field:hover {
                border-color: #38b1c5;
                color: #38b1c5;
                background: linear-gradient(135deg, rgba(56, 177, 197, 0.1) 0%, rgba(218, 146, 44, 0.1) 100%);
            }

            .field-action-btn.delete-field:hover {
                border-color: #dc2626;
                color: #dc2626;
                background: linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(185, 28, 28, 0.1) 100%);
            }

            .field-preview {
                margin-top: 15px;
            }

            .field-preview input,
            .field-preview textarea,
            .field-preview select {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 14px;
                color: #374151;
                background: #f9fafb;
                transition: all 0.2s ease;
            }

            .field-preview input:focus,
            .field-preview textarea:focus,
            .field-preview select:focus {
                outline: none;
                border-color: #38b1c5;
                background: white;
                box-shadow: 0 0 0 3px rgba(56, 177, 197, 0.1);
            }

            .radio-options,
            .checkbox-options {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .radio-options label,
            .checkbox-options label {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 12px;
                border-radius: 6px;
                background: #f9fafb;
                border: 2px solid #e5e7eb;
                transition: all 0.2s ease;
            }

            .radio-options label:hover,
            .checkbox-options label:hover {
                border-color: #38b1c5;
                background: white;
            }

            /* Sortable Placeholder */
            .sortable-placeholder {
                background: linear-gradient(135deg, rgba(56, 177, 197, 0.1) 0%, rgba(218, 146, 44, 0.1) 100%);
                border: 3px dashed #38b1c5;
                border-radius: 10px;
                margin-bottom: 16px;
                min-height: 100px;
                opacity: 0.7;
            }

            /* No Fields Message */
            #noFieldsMessage {
                text-align: center;
                padding: 60px 20px;
                color: #9ca3af;
                font-size: 16px;
                font-weight: 500;
            }

            #noFieldsMessage i {
                font-size: 64px;
                margin-bottom: 20px;
                opacity: 0.3;
                display: block;
            }

            #noFieldsMessage p {
                margin-top: -23px;
                color: #6b7280;
            }

            /* No Field Selected Message */
            .no-field-selected {
                text-align: center;
                padding: 40px 20px;
                color: #9ca3af;
                font-size: 15px;
                font-style: italic;
            }

            .no-field-selected::before {
                content: '👈';
                font-size: 32px;
                display: block;
                margin-bottom: 10px;
                opacity: 0.5;
            }

            /* Forms List Table */
            .forms-list-section {
                background: white;
                border-radius: 12px;
                overflow: hidden;
                border: 2px solid transparent;
                background-image: 
                    linear-gradient(white, white),
                    linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                background-origin: border-box;
                background-clip: padding-box, border-box;
                box-shadow: 0 4px 15px rgba(56, 177, 197, 0.1);
                margin-top: 24px;
            }

            .forms-table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                font-size: 14px;
            }

            .forms-table thead {
                background: linear-gradient(135deg, rgba(56, 177, 197, 0.08) 0%, rgba(218, 146, 44, 0.08) 100%);
                position: relative;
            }

            .forms-table thead::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, #38b1c5 0%, #da922c 100%);
            }

            .forms-table th {
                color: #374151;
                padding: 16px 12px;
                font-weight: 700;
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                white-space: nowrap;
                border-bottom: 1px solid #e5e7eb;
            }

            .forms-table tbody tr {
                transition: all 0.3s ease;
                border-bottom: 1px solid #f3f4f6;
            }

            .forms-table tbody tr:hover {
                background: linear-gradient(135deg, rgba(56, 177, 197, 0.03) 0%, rgba(218, 146, 44, 0.03) 100%);
                transform: scale(1.001);
            }

            .forms-table td {
                padding: 16px 12px;
                color: #1f2937;
                vertical-align: middle;
                text-align: center;
                border-bottom: 1px solid #f3f4f6;
            }

            .form-actions {
                display: flex;
                gap: 8px;
            }

            /* Make the table cell use flexbox for centering */
            .forms-table td.form-actions {
                display: flex;
                justify-content: center;
                text-align: center;
            }

            .form-action-btn {
                padding: 2px 10px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                border: 2px solid transparent;
                background-image: 
                    linear-gradient(white, white),
                    linear-gradient(135deg, rgba(56, 177, 197, 0.3) 0%, rgba(218, 146, 44, 0.3) 100%);
                background-origin: border-box;
                background-clip: padding-box, border-box;
            }

            .form-action-btn.edit-form-btn {
                color: #059669;
                border-color: #059669;
            }

            .form-action-btn.edit-form-btn:hover {
                background: linear-gradient(135deg, #059669 0%, #047857 100%);
                color: white;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
            }

            .form-action-btn.view-submissions-btn {
                color: #3b82f6;
                border-color: #3b82f6;
            }

            .form-action-btn.view-submissions-btn:hover {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            }

            .form-action-btn.delete-form-btn {
                color: #dc2626;
                border-color: #dc2626;
            }

            .form-action-btn.delete-form-btn:hover {
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                color: white;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
            }

            /* Badge for field count */
            .field-count-badge {
                display: inline-block;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
                background: linear-gradient(135deg, rgba(56, 177, 197, 0.15) 0%, rgba(218, 146, 44, 0.15) 100%);
                border: 2px solid transparent;
                background-image: 
                    linear-gradient(135deg, rgba(56, 177, 197, 0.15) 0%, rgba(218, 146, 44, 0.15) 100%),
                    linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                background-origin: border-box;
                background-clip: padding-box, border-box;
                background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            /* Empty state for forms list */
            .forms-empty-state {
                text-align: center;
                padding: 60px 20px;
                color: #9ca3af;
                font-size: 15px;
                font-weight: 500;
            }

            .forms-empty-state::before {
                content: '📝';
                display: block;
                font-size: 32px;
                margin-bottom: 16px;
                margin-top: 16px;
                opacity: 0.5;
            }

            /* Form Table Responsive */
            @media (max-width: 768px) {
                .form-builder-body {
                    flex-direction: column;
                }
                
                .form-fields-panel,
                .form-preview-panel,
                .field-settings-panel {
                    width: 100%;
                    border-right: none;
                    border-bottom: 2px solid #f3f4f6;
                }
                
                .form-actions {
                    flex-direction: column;
                }
                
                .form-action-btn {
                    width: 100%;
                    text-align: center;
                    margin-bottom: 4px;
                }
            }

            /* Button Styles */
            .button-gradient-primary {
                background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                color: white;
                border: none;
                border-radius: 8px;
                padding: 12px 24px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(56, 177, 197, 0.2);
            }

            .button-gradient-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(56, 177, 197, 0.4);
            }

            #saveForm {
                background: #fff;
                color: #38b1c5;
            }

            #saveForm:hover {
                background: #38b1c5;
                color: #fff;
            }

            #closeBuilder {
                background: #fff;
                color: grey;
            }

            #closeBuilder:hover {
                background: grey;
                color: #fff;
            }

            .button-gradient-secondary {
                background: white;
                color: #374151;
                border: 2px solid transparent;
                background-image: 
                    linear-gradient(white, white),
                    linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                background-origin: border-box;
                background-clip: padding-box, border-box;
                border-radius: 8px;
                padding: 12px 24px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .button-gradient-secondary:hover {
                background: linear-gradient(135deg, rgba(56, 177, 197, 0.1) 0%, rgba(218, 146, 44, 0.1) 100%);
                transform: translateY(-1px);
            }

            /* Form Table in Modal */
            .avatar-form-table {
                width: 100%;
            }

            .avatar-form-table th {
                text-align: left;
                padding: 12px 0;
                padding-right: 6px;
                font-weight: 600;
                color: #374151;
                font-size: 14px;
            }

            .avatar-form-table td {
                padding: 8px 0;
            }

            .avatar-form-table input,
            .avatar-form-table textarea {
                width: fit-content;
                padding: 12px 16px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.2s ease;
            }

            .avatar-form-table input:focus,
            .avatar-form-table textarea:focus {
                outline: none;
                border-color: #38b1c5;
                box-shadow: 0 0 0 3px rgba(56, 177, 197, 0.1);
            }
        </style>

        <div class="avatar-form-builder-wrapper">
            <!-- Header -->
            <div class="avatar-form-builder-header">
                <h1>
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <line x1="3" y1="9" x2="21" y2="9"/>
                        <line x1="9" y1="21" x2="9" y2="9"/>
                    </svg>
                    Form Builder
                </h1>
                <p>Create and manage forms with drag-and-drop interface</p>
                <button type="button" class="create-form-btn" id="createNewFormBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Create New Form
                </button>
            </div>

            <!-- Form Creation Modal -->
            <div id="formCreationModal" class="avatar-modal">
                <div class="avatar-modal-content">
                    <div class="avatar-modal-header">
                        <h3>Create New Form</h3>
                        <span class="avatar-modal-close">&times;</span>
                    </div>
                    <div class="avatar-modal-body">
                        <form id="newFormMeta">
                            <table class="avatar-form-table">
                                <tr>
                                    <th><label for="form_title">Form Title</label></th>
                                    <td>
                                        <input type="text" id="form_title" name="form_title" class="regular-text" required placeholder="Enter form title...">
                                    </td>
                                </tr>
                                <tr>
                                    <th><label for="form_description">Description</label></th>
                                    <td>
                                        <textarea id="form_description" name="form_description" class="large-text" rows="3" placeholder="Enter form description (optional)..."></textarea>
                                    </td>
                                </tr>
                            </table>
                        </form>
                    </div>
                    <div class="avatar-modal-footer">
                        <button type="button" class="button-gradient-secondary close-modal">Cancel</button>
                        <button type="button" class="button-gradient-primary" id="proceedToBuilder">Proceed to Form Builder</button>
                    </div>
                </div>
            </div>
            
            <!-- Form Builder Interface -->
            <div id="formBuilderInterface" style="display:none;">
                <div class="form-builder-container">
                    <div class="form-builder-header">
                        <h2 id="builderTitle"></h2>
                        <div class="builder-actions">
                            <button type="button" class="button-gradient-primary" id="saveForm">
                                Save Form
                            </button>
                            <button type="button" class="button-gradient-secondary" id="closeBuilder">
                                Close Builder
                            </button>
                        </div>
                    </div>
                    
                    <div class="form-builder-body">
                        <!-- Left Panel - Form Fields -->
                        <div class="form-fields-panel">
                            <h3>Form Fields</h3>
                            <p class="description">Drag fields to the form area</p>
                            <div class="field-list">
                                <div class="draggable-field" data-type="text">
                                    <i class="dashicons dashicons-editor-textcolor"></i>
                                    <span>Name</span>
                                </div>
                                <div class="draggable-field" data-type="email">
                                    <i class="dashicons dashicons-email"></i>
                                    <span>Email</span>
                                </div>
                                <div class="draggable-field" data-type="number">
                                    <i class="dashicons dashicons-editor-ol"></i>
                                    <span>Number</span>
                                </div>
                                <div class="draggable-field" data-type="tel">
                                    <i class="dashicons dashicons-phone"></i>
                                    <span>Phone</span>
                                </div>
                                <div class="draggable-field" data-type="textarea">
                                    <i class="dashicons dashicons-text"></i>
                                    <span>Text Area</span>
                                </div>
                                <div class="draggable-field" data-type="select">
                                    <i class="dashicons dashicons-menu"></i>
                                    <span>Dropdown</span>
                                </div>
                                <div class="draggable-field" data-type="radio">
                                    <i class="dashicons dashicons-marker"></i>
                                    <span>Radio Buttons</span>
                                </div>
                                <div class="draggable-field" data-type="checkbox">
                                    <i class="dashicons dashicons-yes"></i>
                                    <span>Checkboxes</span>
                                </div>
                                <div class="draggable-field" data-type="date">
                                    <i class="dashicons dashicons-calendar"></i>
                                    <span>Date Picker</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Center Panel - Form Preview -->
                        <div class="form-preview-panel">
                            <h3>Form Preview <span id="fieldCount">(0 fields)</span></h3>
                            <div id="formPreviewContainer" class="droppable-area">
                                <div id="noFieldsMessage" style="display: block;">
                                    <i class="dashicons dashicons-plus"></i>
                                    <p>Drag and drop fields here to start building your form</p>
                                </div>
                                <form id="previewForm"></form>
                            </div>
                        </div>
                        
                        <!-- Right Panel - Field Settings -->
                        <div class="field-settings-panel">
                            <h3>Field Settings</h3>
                            <div id="fieldSettings">
                                <p class="no-field-selected">Select a field to edit its settings.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Forms List -->
            <div id="formsListContainer">
                <div class="forms-list-section">
                    <table class="forms-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Fields</th>
                                <th>Created</th>
                                <th>Updated</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="formsList">
                            <?php $this->render_forms_list(); ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <script type="text/javascript">
        jQuery(document).ready(function($) {
            let currentFormId = null;
            let formFields = [];
            let formMeta = {};
            let selectedFieldId = null;
            
            // Show modal
            $('#createNewFormBtn').on('click', function() {
                resetFormBuilder();
                $('#formCreationModal').addClass('active');
            });
            
            // Close modal
            $('.avatar-modal-close, .close-modal').on('click', function() {
                $('#formCreationModal').removeClass('active');
            });
            
            // Proceed to builder
            $('#proceedToBuilder').on('click', function() {
                const title = $('#form_title').val().trim();
                const description = $('#form_description').val().trim();
                
                if (!title) {
                    alert('Please enter a form title');
                    return;
                }
                
                formMeta = { title, description };
                $('#formCreationModal').removeClass('active');
                $('#formsListContainer').hide();
                $('#formBuilderInterface').show();
                $('#builderTitle').text('Building: ' + formMeta.title);
                
                initDragAndDrop();
            });
            
            // Close builder
            $('#closeBuilder').on('click', function() {
                if (formFields.length > 0 && !confirm('Are you sure? Unsaved changes will be lost.')) {
                    return;
                }
                $('#formBuilderInterface').hide();
                $('#formsListContainer').show();
            });
            
            // Initialize drag and drop
            function initDragAndDrop() {
                // Make fields draggable
                $('.draggable-field').draggable({
                    helper: 'clone',
                    revert: 'invalid',
                    cursor: 'move',
                    zIndex: 100,
                    start: function(event, ui) {
                        $(this).addClass('dragging');
                    },
                    stop: function(event, ui) {
                        $(this).removeClass('dragging');
                    }
                });
                
                // Make preview area droppable
                $('#formPreviewContainer').droppable({
                    accept: '.draggable-field',
                    activeClass: 'droppable-active',
                    hoverClass: 'droppable-hover',
                    drop: function(event, ui) {
                        const fieldType = ui.draggable.data('type');
                        addFormField(fieldType);
                    }
                }).sortable({
                    items: '.form-field',
                    placeholder: 'sortable-placeholder',
                    cursor: 'move',
                    opacity: 0.7,
                    update: function() {
                        saveFieldOrder();
                    }
                });
            }
            
            function addFormField(type) {
                const fieldId = 'field_' + Date.now();
                const defaultLabel = type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1');
                
                const field = {
                    id: fieldId,
                    type: type,
                    label: defaultLabel,
                    required: false,
                    placeholder: '',
                    options: (type === 'select' || type === 'radio' || type === 'checkbox') ? ['Option 1', 'Option 2'] : []
                };
                
                formFields.push(field);
                updateFormPreview();
                updateFieldCount();
                $('#noFieldsMessage').hide();
                
                // Select the new field
                selectField(fieldId);
            }
            
            function updateFormPreview() {
                const $preview = $('#previewForm');
                $preview.empty();
                
                formFields.forEach((field, index) => {
                    const fieldHtml = generateFieldHtml(field, index);
                    $preview.append(fieldHtml);
                });
                
                // Make fields in preview selectable - FIXED VERSION
                $('.form-field').off('click').on('click', function(e) {
                    // Check if click is on delete button first
                    if ($(e.target).closest('.field-action-btn.delete-field').length) {
                        return;
                    }
                    
                    // Check if click is on edit button
                    if ($(e.target).closest('.field-action-btn.edit-field').length) {
                        const fieldId = $(this).attr('id');
                        // Don't select the field, just trigger edit
                        return;
                    }
                    
                    // Regular field selection
                    if (!$(e.target).closest('.field-actions').length) {
                        const fieldId = $(this).attr('id');
                        selectField(fieldId);
                    }
                });
                
                // Bind edit button click events separately - FIXED
                $('.edit-field').off('click').on('click', function(e) {
                    e.stopPropagation(); // Prevent field selection
                    const fieldId = $(this).data('id');
                    const field = formFields.find(f => f.id === fieldId);
                    
                    if (field) {
                        // Select the field first
                        $('.form-field').removeClass('selected');
                        $(`#${fieldId}`).addClass('selected');
                        selectedFieldId = fieldId;
                        
                        // Then show settings
                        showFieldSettings(field);
                        
                        // Scroll to settings panel
                        $('.field-settings-panel')[0].scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                        });
                    }
                });
                
                // Bind delete button click events - FIXED
                $('.delete-field').off('click').on('click', function(e) {
                    e.stopPropagation();
                    const fieldId = $(this).data('id');
                    
                    if (confirm('Are you sure you want to delete this field?')) {
                        formFields = formFields.filter(f => f.id !== fieldId);
                        updateFormPreview();
                        updateFieldCount();
                        
                        if (formFields.length === 0) {
                            $('#noFieldsMessage').show();
                            $('#fieldSettings').html('<p class="no-field-selected">Select a field to edit its settings.</p>');
                        } else if (selectedFieldId === fieldId) {
                            selectedFieldId = null;
                            $('#fieldSettings').html('<p class="no-field-selected">Select a field to edit its settings.</p>');
                        }
                    }
                });
            }

            // In the selectField() function, add scroll to settings:
            function selectField(fieldId) {
                $('.form-field').removeClass('selected');
                $(`#${fieldId}`).addClass('selected');
                selectedFieldId = fieldId;
                
                const field = formFields.find(f => f.id === fieldId);
                if (field) {
                    showFieldSettings(field);
                    
                    // Smooth scroll to settings panel
                    $('.field-settings-panel')[0].scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }
            }

            // Also update the saveForm AJAX call to include better error handling:
            
            function generateFieldHtml(field, index) {
                let html = `<div class="form-field" id="${field.id}" data-index="${index}">`;
                html += `<div class="field-header">`;
                html += `<span class="field-label"><i class="dashicons dashicons-${getFieldIcon(field.type)}"></i> ${field.label}</span>`;
                html += `<span class="field-actions">`;
                html += `<button type="button" class="field-action-btn edit-field" data-id="${field.id}" title="Edit field"><span class="dashicons dashicons-edit"></span></button>`;
                html += `<button type="button" class="field-action-btn delete-field" data-id="${field.id}" title="Delete field"><span class="dashicons dashicons-trash"></span></button>`;
                html += `</span></div><div class="field-preview">`;
                
                switch(field.type) {
                    case 'text':
                    case 'email':
                    case 'number':
                    case 'tel':
                    case 'date':
                        html += `<input type="${field.type}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} disabled>`;
                        break;
                    case 'textarea':
                        html += `<textarea placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} disabled rows="3"></textarea>`;
                        break;
                    case 'select':
                        html += `<select ${field.required ? 'required' : ''} disabled>`;
                        html += `<option value="">Select an option</option>`;
                        field.options.forEach(option => {
                            html += `<option>${option}</option>`;
                        });
                        html += `</select>`;
                        break;
                    case 'radio':
                        html += `<div class="radio-options">`;
                        field.options.forEach((option, i) => {
                            html += `<label>`;
                            html += `<input type="radio" name="${field.id}" value="${option}" ${field.required ? 'required' : ''} disabled> `;
                            html += `<span>${option}</span>`;
                            html += `</label>`;
                        });
                        html += `</div>`;
                        break;
                    case 'checkbox':
                        html += `<div class="checkbox-options">`;
                        field.options.forEach((option, i) => {
                            html += `<label>`;
                            html += `<input type="checkbox" value="${option}" ${field.required ? 'required' : ''} disabled> `;
                            html += `<span>${option}</span>`;
                            html += `</label>`;
                        });
                        html += `</div>`;
                        break;
                }
                
                html += `</div></div>`;
                return html;
            }
            
            function getFieldIcon(type) {
                const icons = {
                    'text': 'editor-textcolor',
                    'email': 'email',
                    'number': 'editor-ol',
                    'tel': 'phone',
                    'textarea': 'text',
                    'select': 'menu',
                    'radio': 'marker',
                    'checkbox': 'yes',
                    'date': 'calendar'
                };
                return icons[type] || 'admin-generic';
            }
            
            function selectField(fieldId) {
                $('.form-field').removeClass('selected');
                $(`#${fieldId}`).addClass('selected');
                selectedFieldId = fieldId;
                
                const field = formFields.find(f => f.id === fieldId);
                if (field) {
                    showFieldSettings(field);
                }
            }
            
            function showFieldSettings(field) {
                let settingsHtml = `
                    <form id="fieldSettingsForm">
                        <input type="hidden" name="field_id" value="${field.id}">
                        <table class="avatar-form-table">
                            <tr>
                                <th><label>Field Type</label></th>
                                <td><strong>${field.type}</strong></td>
                            </tr>
                            <tr>
                                <th><label for="field_label">Label</label></th>
                                <td><input type="text" id="field_label" name="label" value="${field.label}" class="regular-text"></td>
                            </tr>
                            <tr>
                                <th><label for="field_placeholder">Placeholder</label></th>
                                <td><input type="text" id="field_placeholder" name="placeholder" value="${field.placeholder}" class="regular-text"></td>
                            </tr>
                            <tr>
                                <th><label for="field_required">Required</label></th>
                                <td><input type="checkbox" id="field_required" name="required" ${field.required ? 'checked' : ''}></td>
                            </tr>
                `;
                
                if (['select', 'radio', 'checkbox'].includes(field.type)) {
                    settingsHtml += `
                        <tr>
                            <th><label>Options</label></th>
                            <td>
                                <div id="fieldOptions" style="margin-bottom:10px;">
                    `;
                    
                    field.options.forEach((option, index) => {
                        settingsHtml += `
                            <div class="option-row" style="display:flex;gap:10px;margin-bottom:5px;align-items:center;">
                                <input type="text" name="options[]" value="${option}" class="regular-text" style="flex:1;">
                                <button type="button" class="field-action-btn remove-option" ${field.options.length <= 2 ? 'disabled' : ''} title="Remove option"><span class="dashicons dashicons-no"></span></button>
                            </div>
                        `;
                    });
                    
                    settingsHtml += `
                                </div>
                                <button type="button" class="button-gradient-secondary add-option">Add Option</button>
                            </td>
                        </tr>
                    `;
                }
                
                settingsHtml += `
                        </table>
                        <div style="margin-top: 20px; display: flex; gap: 10px;">
                            <button type="button" class="button-gradient-primary update-field">Update Field</button>
                            <button type="button" class="button-gradient-secondary cancel-edit">Cancel</button>
                        </div>
                    </form>
                `;
                
                $('#fieldSettings').html(settingsHtml);
                $('.no-field-selected').hide();
                
                // Initialize option buttons
                $('.add-option').on('click', addOption);
                $('.remove-option').on('click', function() {
                    if ($(this).prop('disabled')) return;
                    $(this).closest('.option-row').remove();
                });
            }
            
            function addOption() {
                const html = `
                    <div class="option-row" style="display:flex;gap:10px;margin-bottom:5px;align-items:center;">
                        <input type="text" name="options[]" value="" class="regular-text" style="flex:1;">
                        <button type="button" class="field-action-btn remove-option" title="Remove option"><span class="dashicons dashicons-no"></span></button>
                    </div>
                `;
                $('#fieldOptions').append(html);
                
                // Rebind remove event
                $('#fieldOptions .remove-option:last').on('click', function() {
                    $(this).closest('.option-row').remove();
                });
            }
            
            // Update field
            $(document).on('click', '.update-field', function() {
                const fieldId = $('#fieldSettingsForm input[name="field_id"]').val();
                const field = formFields.find(f => f.id === fieldId);
                
                if (field) {
                    field.label = $('#field_label').val();
                    field.placeholder = $('#field_placeholder').val();
                    field.required = $('#field_required').is(':checked');
                    
                    if (['select', 'radio', 'checkbox'].includes(field.type)) {
                        const options = [];
                        $('#fieldSettingsForm input[name="options[]"]').each(function() {
                            const val = $(this).val().trim();
                            if (val) options.push(val);
                        });
                        field.options = options.length > 0 ? options : ['Option 1'];
                    }
                    
                    updateFormPreview();
                    selectField(fieldId);
                    
                    // Show success message
                    $('<div class="notice notice-success" style="margin: 10px 0; padding: 10px;">Field updated successfully!</div>')
                        .insertAfter($('#fieldSettingsForm'))
                        .delay(3000)
                        .fadeOut(500, function() { $(this).remove(); });
                }
            });
            
            $(document).on('click', '.cancel-edit', function() {
                if (selectedFieldId) {
                    selectField(selectedFieldId);
                }
            });
            
            // Delete field
            $(document).on('click', '.delete-field', function(e) {
                e.stopPropagation();
                const fieldId = $(this).data('id');
                
                if (confirm('Are you sure you want to delete this field?')) {
                    formFields = formFields.filter(f => f.id !== fieldId);
                    updateFormPreview();
                    updateFieldCount();
                    
                    if (formFields.length === 0) {
                        $('#noFieldsMessage').show();
                        $('#fieldSettings').html('<p class="no-field-selected">Select a field to edit its settings.</p>');
                    } else if (selectedFieldId === fieldId) {
                        selectedFieldId = null;
                        $('#fieldSettings').html('<p class="no-field-selected">Select a field to edit its settings.</p>');
                    }
                }
            });
            
            // Save field order
            function saveFieldOrder() {
                const newOrder = [];
                $('#previewForm .form-field').each(function(index) {
                    const fieldId = $(this).attr('id');
                    const field = formFields.find(f => f.id === fieldId);
                    if (field) {
                        newOrder.push(field);
                    }
                });
                formFields = newOrder;
            }
            
            function updateFieldCount() {
                $('#fieldCount').text('(' + formFields.length + ' fields)');
            }
            
            // Save form
            $('#saveForm').on('click', function() {
                if (formFields.length === 0) {
                    alert('Please add at least one field to the form.');
                    return;
                }
                
                const formData = {
                    title: formMeta.title,
                    description: formMeta.description,
                    fields: formFields,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                
                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'save_avatar_form',
                        form_id: currentFormId,
                        form_data: JSON.stringify(formData),
                        nonce: '<?php echo wp_create_nonce('save_avatar_form'); ?>'
                    },
                    beforeSend: function() {
                        $('#saveForm').prop('disabled', true).text('Saving...');
                    },
                    success: function(response) {
                        if (response.success) {
                            alert('Form saved successfully!');
                            currentFormId = response.data.id;
                            location.reload();
                        } else {
                            alert('Error saving form: ' + response.data);
                        }
                    },
                    error: function() {
                        alert('Network error. Please try again.');
                    },
                    complete: function() {
                        $('#saveForm').prop('disabled', false).text('Save Form');
                    }
                });
            });
            
            // Edit existing form
            $(document).on('click', '.edit-form-btn', function(e) {
                e.preventDefault();
                const formId = $(this).data('id');
                const $button = $(this);
                
                $.ajax({
                    url: ajaxurl,
                    type: 'GET',
                    data: {
                        action: 'get_avatar_form',
                        form_id: formId,
                        nonce: '<?php echo wp_create_nonce('get_avatar_form'); ?>'
                    },
                    beforeSend: function() {
                        // $button.prop('disabled', true).text('Loading...');
                    },
                    success: function(response) {
                        if (response.success) {
                            currentFormId = formId;
                            formMeta = {
                                title: response.data.title,
                                description: response.data.description
                            };
                            formFields = response.data.fields || [];
                            
                            // Populate modal
                            $('#form_title').val(formMeta.title);
                            $('#form_description').val(formMeta.description);
                            
                            // Show modal with different behavior
                            $('#formCreationModal').addClass('active');
                            
                            // Update proceed button for editing
                            $('#proceedToBuilder').off('click').on('click', function() {
                                const title = $('#form_title').val().trim();
                                const description = $('#form_description').val().trim();
                                
                                if (!title) {
                                    alert('Please enter a form title');
                                    return;
                                }
                                
                                formMeta = { title, description };
                                $('#formCreationModal').removeClass('active');
                                $('#formsListContainer').hide();
                                $('#formBuilderInterface').show();
                                $('#builderTitle').text('Editing: ' + formMeta.title);
                                
                                // Initialize with existing fields
                                initFormBuilderWithExistingFields();
                            });
                        } else {
                            alert('Error loading form: ' + response.data);
                            $button.prop('disabled', false).text('Edit');
                        }
                    },
                    error: function() {
                        alert('Network error. Please try again.');
                        $button.prop('disabled', false).text('Edit');
                    }
                });
            });

            function initFormBuilderWithExistingFields() {
                initDragAndDrop();
                updateFormPreview();
                updateFieldCount();
                
                if (formFields.length > 0) {
                    $('#noFieldsMessage').hide();
                    if (formFields.length > 0) {
                        selectField(formFields[0].id);
                    }
                } else {
                    $('#noFieldsMessage').show();
                }
            }

            // Delete form
            $(document).on('click', '.delete-form-btn', function(e) {
                e.preventDefault();
                const formId = $(this).data('id');
                
                if (confirm('Are you sure you want to delete this form? All submissions will also be deleted.')) {
                    $.ajax({
                        url: ajaxurl,
                        type: 'POST',
                        data: {
                            action: 'delete_avatar_form',
                            form_id: formId,
                            nonce: '<?php echo wp_create_nonce('delete_avatar_form'); ?>'
                        },
                        beforeSend: function() {
                            $(this).prop('disabled', true).text('Deleting...');
                        },
                        success: function(response) {
                            if (response.success) {
                                location.reload();
                            } else {
                                alert('Error deleting form');
                                $('.delete-form-btn').prop('disabled', false).text('Delete');
                            }
                        },
                        error: function() {
                            alert('Network error. Please try again.');
                            $('.delete-form-btn').prop('disabled', false).text('Delete');
                        }
                    });
                }
            });
            
            function resetFormBuilder() {
                formFields = [];
                formMeta = {};
                currentFormId = null;
                selectedFieldId = null;
                $('#form_title').val('');
                $('#form_description').val('');
                $('#previewForm').empty();
                $('#fieldSettings').html('<p class="no-field-selected">Select a field to edit its settings.</p>');
                $('#noFieldsMessage').show();
                updateFieldCount();
            }

            // Also make sure to update the render_forms_list() function to use the new badge style
            // and action button classes in the PHP part
        });
        </script>
        <?php
    }
    
    private function render_forms_list() {
        global $wpdb;
        $forms = $wpdb->get_results("SELECT * FROM {$this->table_name} ORDER BY updated_at DESC");
        
        if (empty($forms)) {
            echo '<tr><td colspan="7" class="forms-empty-state">No forms created yet.</td></tr>';
            return;
        }
        
        foreach ($forms as $form) {
            $form_data = json_decode($form->form_data, true);
            $fields_count = count($form_data['fields'] ?? []);
            
            echo '<tr>';
            echo '<td><strong class="badge-primary" style="display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">ASF' . $form->id . '</strong></td>';
            echo '<td><strong>' . esc_html($form->title) . '</strong></td>';
            echo '<td>' . esc_html($form->description ?: '—') . '</td>';
            echo '<td><span class="field-count-badge">' . $fields_count . ' field' . ($fields_count !== 1 ? 's' : '') . '</span></td>';
            echo '<td><span class="badge-secondary" style="display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; background: #f3f4f6; color: #4b5563; border: 1px solid #d1d5db;">' . date('m-d-Y H:i', strtotime($form->created_at)) . '</span></td>';
            echo '<td><span class="badge-secondary" style="display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; background: #f3f4f6; color: #4b5563; border: 1px solid #d1d5db;">' . date('m-d-Y H:i', strtotime($form->updated_at)) . '</span></td>';
            echo '<td class="form-actions">';
            echo '<button class="form-action-btn edit-form-btn" data-id="' . $form->id . '" title="Edit Form">';
            echo 'Edit';
            echo '</button> ';
            
            echo '<a href="' . admin_url('admin.php?page=avatar-form-submissions&form_id=' . $form->id) . '" class="form-action-btn view-submissions-btn" title="View Submissions">';
            echo 'View Submissions';
            echo '</a> ';
            
            echo '<button class="form-action-btn delete-form-btn" data-id="' . $form->id . '" title="Delete Form">';
            echo 'Delete';
            echo '</button>';
            echo '</td>';
            echo '</tr>';
        }
    }
    
    public function render_submissions_page() {
    $form_id = isset($_GET['form_id']) ? intval($_GET['form_id']) : 0;
    
    if (!$form_id) {
        echo '<div class="wrap"><div class="notice notice-error"><p>No form specified.</p></div></div>';
        return;
    }
    
    global $wpdb;
    $form = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM {$this->table_name} WHERE id = %d",
        $form_id
    ));
    
    if (!$form) {
        echo '<div class="wrap"><div class="notice notice-error"><p>Form not found.</p></div></div>';
        return;
    }
    
    // Handle bulk delete action
    if (isset($_POST['bulk_delete']) && isset($_POST['bulk_delete_nonce'])) {
        if (wp_verify_nonce($_POST['bulk_delete_nonce'], 'bulk_delete_action')) {
            if (!empty($_POST['selected_submissions'])) {
                $selected_submissions = array_map('intval', $_POST['selected_submissions']);
                $placeholders = implode(',', array_fill(0, count($selected_submissions), '%d'));
                
                $deleted = $wpdb->query(
                    $wpdb->prepare(
                        "DELETE FROM {$this->submissions_table} WHERE id IN ($placeholders)",
                        $selected_submissions
                    )
                );
                
                if ($deleted) {
                    echo '<div class="notice notice-success is-dismissible"><p><strong>Success!</strong> ' . $deleted . ' submissions deleted successfully.</p></div>';
                } else {
                    echo '<div class="notice notice-error is-dismissible"><p><strong>Error!</strong> Failed to delete selected submissions.</p></div>';
                }
            }
        }
    }
    
    // Pagination and filtering
    $paged = isset($_GET['paged']) ? intval($_GET['paged']) : 1;
    $per_page = 10;
    $offset = ($paged - 1) * $per_page;
    $search = isset($_GET['s']) ? sanitize_text_field($_GET['s']) : '';
    
    // Build WHERE clause for search
    $where_sql = "WHERE form_id = %d";
    $where_params = [$form_id];
    
    if (!empty($search)) {
        $where_sql .= " AND (session_id LIKE %s OR submission_data LIKE %s)";
        $search_term = '%' . $wpdb->esc_like($search) . '%';
        $where_params[] = $search_term;
        $where_params[] = $search_term;
    }
    
    // Get total items
    $total_items = $wpdb->get_var(
        $wpdb->prepare(
            "SELECT COUNT(*) FROM {$this->submissions_table} {$where_sql}",
            $where_params
        )
    );
    
    $total_pages = ceil($total_items / $per_page);
    
    // Get submissions with pagination
    $data_query = $wpdb->prepare(
        "SELECT * FROM {$this->submissions_table} {$where_sql} ORDER BY submitted_at DESC LIMIT %d OFFSET %d",
        array_merge($where_params, [$per_page, $offset])
    );
    $submissions = $wpdb->get_results($data_query);
    
    // Get form fields for column headers
    $form_data = json_decode($form->form_data, true);
    $fields = $form_data['fields'] ?? [];
    
    // Helper function for filter URLs
    function avatar_filter_url($params = []) {
        $base_params = array_filter($_GET, function($key) {
            return $key !== 'paged';
        }, ARRAY_FILTER_USE_KEY);
        
        $query = array_merge($base_params, $params);
        return '?' . http_build_query($query);
    }
    ?>
    
    <style>
        /* Badge Styles */
        .badge-primary {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 700;
            background: linear-gradient(135deg, rgba(56, 177, 197, 0.15) 0%, rgba(218, 146, 44, 0.15) 100%);
            border: 2px solid transparent;
            background-image: 
                linear-gradient(135deg, rgba(56, 177, 197, 0.15) 0%, rgba(218, 146, 44, 0.15) 100%),
                linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .badge-secondary {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            background: #f3f4f6;
            color: #4b5563;
            border: 1px solid #d1d5db;
            transition: all 0.2s ease;
        }

        .badge-secondary:hover {
            background: #e5e7eb;
            transform: translateY(-1px);
        }

        /* Field Count Badge */
        .field-count-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 700;
            background: linear-gradient(135deg, rgba(56, 177, 197, 0.15) 0%, rgba(218, 146, 44, 0.15) 100%);
            border: 2px solid transparent;
            background-image: 
                linear-gradient(135deg, rgba(56, 177, 197, 0.15) 0%, rgba(218, 146, 44, 0.15) 100%),
                linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        /* Empty State */
        .forms-empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #9ca3af;
            font-size: 15px;
            font-weight: 500;
        }

        .forms-empty-state::before {
            content: '📝';
            display: block;
            font-size: 32px;
            margin-bottom: 16px;
            margin-top: 16px;
            opacity: 0.5;
        }
        /* Consolidated CSS - No Duplicates */
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, sans-serif;
            font-size: 14px;
            color: #333;
        }

        /* Main Wrapper */
        .avatar-user-info-wrapper {
            max-width: 1400px;
            margin: 20px auto;
            padding: 0 20px;
        }

        /* Header Section */
        .avatar-user-info-header {
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            color: white;
            padding: 32px 40px;
            border-radius: 12px;
            margin-bottom: 24px;
            box-shadow: 0 4px 20px rgba(56, 177, 197, 0.3);
            position: relative;
            overflow: hidden;
        }

        .avatar-user-info-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
            pointer-events: none;
        }

        .avatar-user-info-header h1 {
            font-size: 32px;
            font-weight: 700;
            margin: 0 0 8px 0;
            color: white;
            display: flex;
            align-items: center;
            gap: 12px;
            position: relative;
            z-index: 1;
        }

        .avatar-user-info-header p {
            margin: 0;
            font-size: 15px;
            opacity: 0.95;
            color: white;
            position: relative;
            z-index: 1;
        }

        /* Back Button Styles */
        .back-navigation {
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }

        .back-to-forms-btn {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 12px 24px;
            background: white;
            color: #374151;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
            border: 2px solid transparent;
            background-image: 
                linear-gradient(white, white),
                linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            box-shadow: 0 4px 15px rgba(56, 177, 197, 0.1);
        }

        .back-to-forms-btn:hover {
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(56, 177, 197, 0.3);
            text-decoration: none;
        }

        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 24px;
        }

        .stat-card {
            background: white;
            border: 2px solid transparent;
            background-image: 
                linear-gradient(white, white),
                linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(56, 177, 197, 0.1);
            position: relative;
            overflow: hidden;
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #38b1c5 0%, #da922c 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(56, 177, 197, 0.2);
        }

        .stat-card:hover::before {
            opacity: 1;
        }

        .stat-label {
            font-size: 13px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .stat-value {
            font-size: 32px;
            line-height: 32px;
            font-weight: 700;
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        /* Search & Bulk Actions Section */
        .search-bulk-section {
            margin-bottom: 24px;
        }

        .search-bulk-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        @media (max-width: 1024px) {
            .search-bulk-grid {
                grid-template-columns: 1fr;
                gap: 15px;
            }
        }

        /* Bulk Actions Column */
        .bulk-actions-column {
            min-width: 0;
        }

        .bulk-actions-card {
            background: white;
            padding: 24px;
            border-radius: 12px;
            border: 2px solid transparent;
            background-image: 
                linear-gradient(white, white),
                linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            box-shadow: 0 4px 15px rgba(56, 177, 197, 0.1);
            height: -webkit-fill-available;
        }

        .bulk-actions-title {
            font-size: 16px;
            font-weight: 700;
            color: #374151;
            margin: 5px 0 16px 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .bulk-actions-title::before {
            content: '📁';
            font-size: 18px;
        }

        .select-all-control {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 16px;
            background: linear-gradient(135deg, rgba(56, 177, 197, 0.05) 0%, rgba(218, 146, 44, 0.05) 100%);
            border-radius: 8px;
            border: 1px solid rgba(56, 177, 197, 0.2);
        }

        .bulk-checkbox {
            transform: scale(1.3);
            cursor: pointer;
            accent-color: #38b1c5;
        }

        .bulk-checkbox-label {
            font-weight: 600;
            color: #374151;
            cursor: pointer;
            font-size: 14px;
        }

        .bulk-buttons {
            display: flex;
            align-items: center;
            gap: 8px;
            flex: 1;
            justify-content: flex-start;
            flex-wrap: wrap;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-5px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .selected-count {
            background: #fff;
            color: #da922c;
            border-radius: 6px;
            padding: 8px 10px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
            border: 1px solid #da922c;
            text-decoration: none;
        }

        .selected-count:hover {
            background: #da922c;
            color: #fff;
        }

        .button-bulk-delete {
            background: #fff;
            color: #dc2626;
            border-radius: 6px;
            padding: 8px 10px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
            border: 1px solid #dc2626;
            text-decoration: none;
        }

        .button-bulk-delete:hover {
            background: #dc2626;
            color: #fff;
        }

        .button-bulk-clear {
            background: #fff;
            color: #6b7280;
            border-radius: 6px;
            padding: 8px 10px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 2px;
            white-space: nowrap;
            border: 1px solid #6b7280;
            text-decoration: none;
        }

        .button-bulk-clear:hover {
            background: #6b7280;
            color: #fff;
        }

        .button-bulk-export {
            background: #fff;
            color: #059669;
            border-radius: 6px;
            padding: 8px 10px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
            border: 1px solid #059669;
            text-decoration: none;
        }

        .button-bulk-export:hover {
            background: #059669;
            color: #fff;
        }

        .button-bulk-export svg,
        .button-bulk-delete svg,
        .button-bulk-clear svg {
            width: 14px;
            height: 14px;
            flex-shrink: 0;
        }

        .button-bulk-export-all {
            background: #fff;
            color: #3b82f6;
            border-radius: 6px;
            padding: 8px 10px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
            border: 1px solid #3b82f6;
            text-decoration: none;
        }

        .button-bulk-export-all:hover {
            background: #3b82f6;
            color: #fff;
        }

        .button-bulk-export-all svg {
            width: 14px;
            height: 14px;
            flex-shrink: 0;
        }

        /* Search Column */
        .search-column {
            min-width: 0;
        }

        .search-card {
            background: white;
            padding: 24px;
            border-radius: 12px;
            border: 2px solid transparent;
            background-image: 
                linear-gradient(white, white),
                linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            box-shadow: 0 4px 15px rgba(56, 177, 197, 0.1);
            height: -webkit-fill-available;
        }

        .search-title {
            font-size: 16px;
            font-weight: 700;
            color: #374151;
            margin: 0 0 16px 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .search-title::before {
            content: '🔍';
            font-size: 16px;
        }

        .search-input-group {
            display: flex;
            gap: 10px;
            align-items: stretch;
        }

        .search-input-group input {
            background: white;
            border-radius: 8px;
            border: 2px solid transparent;
            background-image: linear-gradient(white, white), linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            box-shadow: 0 4px 15px rgba(56, 177, 197, 0.1);
        }

        .search-input {
            flex: 1;
            padding: 12px 16px;
            border-radius: 8px;
            border: 2px solid #e5e7eb;
            font-size: 14px;
            transition: all 0.2s ease;
            background: #fafafa;
        }

        .search-input:focus {
            outline: none;
            border: 2px solid transparent;
            background-image: 
                linear-gradient(white, white),
                linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            box-shadow: 0 0 0 4px rgba(56, 177, 197, 0.1);
            background: white;
        }

        .search-button {
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            white-space: nowrap;
        }

        .search-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(56, 177, 197, 0.5);
        }

        .search-clear {
            background: white;
            color: #6b7280;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            padding: 12px 16px;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 6px;
            white-space: nowrap;
        }

        .search-clear:hover {
            background: #f9fafb;
            border-color: #9ca3af;
            text-decoration: none;
            color: #374151;
            transform: translateY(-1px);
        }

        /* Table Section */
        .avatar-table-section {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            border: 2px solid transparent;
            background-image: 
                linear-gradient(white, white),
                linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            box-shadow: 0 4px 15px rgba(56, 177, 197, 0.1);
        }

        .avatar-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            font-size: 14px;
        }

        .avatar-table thead {
            background: linear-gradient(135deg, rgba(56, 177, 197, 0.08) 0%, rgba(218, 146, 44, 0.08) 100%);
            position: relative;
        }

        .avatar-table thead::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, #38b1c5 0%, #da922c 100%);
        }

        .avatar-table th {
            color: #374151;
            padding: 16px 12px;
            font-weight: 700;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            white-space: nowrap;
            position: sticky;
            top: 0;
            background: linear-gradient(135deg, rgba(56, 177, 197, 0.08) 0%, rgba(218, 146, 44, 0.08) 100%);
            z-index: 10;
            border-bottom: 1px solid #e5e7eb;
        }

        .avatar-table th a {
            color: #374151;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            transition: all 0.2s ease;
            padding: 4px 0;
            font-size: 12px;
        }

        .avatar-table th a:hover {
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .sort-icon {
            font-size: 10px;
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: bold;
        }

        .avatar-table tbody tr {
            transition: all 0.3s ease;
            border-bottom: 1px solid #f3f4f6;
        }

        .avatar-table tbody tr:hover {
            background: linear-gradient(135deg, rgba(56, 177, 197, 0.03) 0%, rgba(218, 146, 44, 0.03) 100%);
            transform: scale(1.001);
        }

        .avatar-table tbody tr:last-child {
            border-bottom: none;
        }

        .avatar-table td {
            padding: 16px 12px;
            color: #1f2937;
            vertical-align: middle;
            border-bottom: 1px solid #f3f4f6;
        }

        /* Specific column alignments */
        .avatar-table th:nth-child(1),
        .avatar-table td:nth-child(1) {
            width: 50px;
            text-align: center;
            padding: 16px 8px;
        }

        .avatar-table th:nth-child(2),
        .avatar-table td:nth-child(2) {
            width: 80px;
            text-align: center;
            padding: 16px 8px;
        }

        .avatar-table th:nth-child(3),
        .avatar-table td:nth-child(3) {
            text-align: center;
            min-width: 150px;
        }

        .avatar-table th:nth-child(4),
        .avatar-table td:nth-child(4) {
            text-align: center;
            min-width: 200px;
        }

        .avatar-table th:nth-child(5),
        .avatar-table td:nth-child(5) {
            text-align: center;
            min-width: 140px;
        }

        .avatar-table th:nth-child(6),
        .avatar-table td:nth-child(6) {
            text-align: center;
            min-width: 200px;
            font-size: 12px;
        }

        .avatar-table th:nth-child(7),
        .avatar-table td:nth-child(7) {
            width: 180px;
            text-align: center;
            padding: 16px 8px;
        }

        /* ID column styling */
        .avatar-table td:nth-child(2) {
            font-weight: 600;
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-align: center;
        }

        /* Conversation ID wrapper alignment */
        .conversation-id-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        /* Copy button alignment */
        .copy-btn {
            padding: 4px 8px;
            border-radius: 4px;
            background: white;
            border: 2px solid transparent;
            background-image: 
                linear-gradient(white, white),
                linear-gradient(135deg, rgba(56, 177, 197, 0.5) 0%, rgba(218, 146, 44, 0.5) 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            color: #6b7280;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
            font-weight: 600;
        }

        .copy-btn:hover {
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            color: white;
            transform: scale(1.05);
            box-shadow: 0 2px 8px rgba(56, 177, 197, 0.3);
        }

        .copy-btn.copied {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
        }

        /* Badge alignment */
        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-align: center;
        }

        .badge-primary {
            background: linear-gradient(135deg, rgba(56, 177, 197, 0.15) 0%, rgba(218, 146, 44, 0.15) 100%);
            border: 2px solid transparent;
            background-image: 
                linear-gradient(135deg, rgba(56, 177, 197, 0.15) 0%, rgba(218, 146, 44, 0.15) 100%),
                linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        /* Empty state alignment */
        .table-empty {
            text-align: center;
            padding: 60px 20px !important;
            color: #9ca3af;
            font-size: 15px;
            font-weight: 500;
        }

        .table-empty::before {
            content: '📋';
            display: block;
            font-size: 48px;
            margin-bottom: 28px;
            opacity: 0.5;
        }

        /* Pagination */
        .pagination-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            background: linear-gradient(135deg, rgba(56, 177, 197, 0.03) 0%, rgba(218, 146, 44, 0.03) 100%);
            border-top: 2px solid transparent;
            background-image: 
                linear-gradient(135deg, rgba(56, 177, 197, 0.03) 0%, rgba(218, 146, 44, 0.03) 100%),
                linear-gradient(90deg, transparent 0%, #38b1c5 0%, #da922c 100%, transparent 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            gap: 20px;
        }

        .pagination-info {
            color: #fff;
            font-size: 14px;
            font-weight: 500;
        }

        .pagination-info strong {
            background-clip: text;
            font-weight: 900;
            color: #fff;
        }

        .pagination-links {
            display: flex;
            gap: 8px;
            align-items: center;
            flex-wrap: wrap;
        }

        .page-btn {
            padding: 8px 14px;
            border-radius: 6px;
            background: white;
            color: #374151;
            text-decoration: none;
            transition: all 0.3s ease;
            border: 2px solid transparent;
            background-image: 
                linear-gradient(white, white),
                linear-gradient(135deg, rgba(56, 177, 197, 0.3) 0%, rgba(218, 146, 44, 0.3) 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            font-weight: 600;
            font-size: 13px;
            white-space: nowrap;
        }

        .page-btn:hover {
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            color: white;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(56, 177, 197, 0.3);
        }

        .page-current {
            font-weight: 600;
            padding: 8px 16px;
            background: linear-gradient(135deg, rgba(56, 177, 197, 0.1) 0%, rgba(218, 146, 44, 0.1) 100%);
            border-radius: 6px;
            font-size: 13px;
            border: 2px solid transparent;
            background-image: 
                linear-gradient(135deg, rgba(56, 177, 197, 0.1) 0%, rgba(218, 146, 44, 0.1) 100%),
                linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            -webkit-background-clip: text;
            color: #fff;
        }

        /* Page Jump Section */
        .page-jump-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            background: white;
            border-radius: 8px;
            border: 2px solid transparent;
            background-image: 
                linear-gradient(white, white),
                linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
        }

        .page-jump-label {
            font-size: 13px;
            color: #6b7280;
            font-weight: 600;
            white-space: nowrap;
        }

        .page-jump-input {
            width: 60px;
            padding: 6px 10px;
            border: 2px solid #e5e7eb;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            text-align: center;
            transition: all 0.2s ease;
        }

        .page-jump-input:focus {
            outline: none;
            border: 2px solid transparent;
            background-image: 
                linear-gradient(white, white),
                linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            box-shadow: 0 0 0 3px rgba(56, 177, 197, 0.1);
        }

        .page-jump-btn {
            padding: 6px 14px;
            border-radius: 6px;
            background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
            color: white;
            border: none;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
        }

        .page-jump-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(56, 177, 197, 0.4);
        }

        /* Additional styles for form submissions */
        .field-value {
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        .expand-field {
            background: none;
            border: none;
            color: #38b1c5;
            cursor: pointer;
            font-size: 12px;
            margin-left: 5px;
        }
        
        .field-full-value {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            padding: 10px;
            margin-top: 5px;
            font-size: 13px;
            word-break: break-word;
        }

        /* Checkbox styles */
        .user-checkbox {
            transform: scale(1.2);
            cursor: pointer;
            accent-color: #38b1c5;
        }

        /* Delete Modal Styles */
        .delete-modal {
            display: none;
            position: fixed;
            z-index: 9999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            animation: fadeIn 0.2s ease;
        }

        .delete-modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .delete-modal-content {
            background: white;
            padding: 32px;
            border-radius: 16px;
            max-width: 480px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            border: 2px solid transparent;
            background-image: 
                linear-gradient(white, white),
                linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            animation: slideUp 0.3s ease;
            position: relative;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
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

        .delete-modal-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
        }

        .delete-modal-icon {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }

        .delete-modal-title {
            font-size: 22px;
            font-weight: 700;
            color: #1f2937;
            margin: 0;
        }

        .delete-modal-body {
            margin-bottom: 24px;
        }

        .delete-modal-text {
            color: #6b7280;
            font-size: 15px;
            line-height: 1.6;
            margin: 0 0 16px 0;
        }

        .delete-user-details {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.05) 100%);
            padding: 16px;
            border-radius: 8px;
            border: 2px solid rgba(239, 68, 68, 0.2);
        }

        .delete-user-details p {
            margin: 8px 0;
            font-size: 14px;
            color: #374151;
        }

        .delete-user-details strong {
            color: #1f2937;
            font-weight: 600;
        }

        .delete-modal-footer {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }

        .modal-btn-cancel {
            padding: 12px 24px;
            border-radius: 8px;
            background: white;
            border: 2px solid #e5e7eb;
            color: #374151;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .modal-btn-cancel:hover {
            background: #f9fafb;
            border-color: #d1d5db;
            transform: translateY(-1px);
        }

        .modal-btn-delete {
            padding: 12px 24px;
            border-radius: 8px;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            border: none;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
        }

        .modal-btn-delete:hover {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
            .avatar-table {
                font-size: 13px;
            }

            .avatar-table th,
            .avatar-table td {
                padding: 12px 8px;
            }
            
            .avatar-table th:nth-child(1),
            .avatar-table td:nth-child(1) {
                padding: 12px 6px;
            }
            
            .avatar-table th:nth-child(2),
            .avatar-table td:nth-child(2) {
                padding: 12px 6px;
            }
            
            .avatar-table th:nth-child(7),
            .avatar-table td:nth-child(7) {
                padding: 12px 6px;
            }
        }

        @media (max-width: 768px) {
            .avatar-table-section {
                overflow-x: auto;
                border-radius: 8px;
            }

            .avatar-table {
                min-width: 800px;
            }
            
            .avatar-table th,
            .avatar-table td {
                padding: 12px 8px;
            }
            
            .conversation-id-wrapper {
                justify-content: flex-start;
            }

            .avatar-user-info-wrapper {
                margin: 10px;
            }

            .avatar-user-info-header {
                padding: 24px;
            }

            .avatar-user-info-header h1 {
                font-size: 24px;
            }

            .stats-grid {
                grid-template-columns: 1fr;
                gap: 12px;
            }

            .stat-card {
                padding: 20px;
            }

            .search-bulk-grid {
                grid-template-columns: 1fr;
            }
            
            .search-input-group {
                flex-direction: column;
            }

            .bulk-controls-row {
                display: flex;
                align-items: center;
                gap: 20px;
                padding: 16px;
                background: linear-gradient(135deg, rgba(56, 177, 197, 0.05) 0%, rgba(218, 146, 44, 0.05) 100%);
                border-radius: 8px;
                border: 1px solid rgba(56, 177, 197, 0.2);
            }

            .bulk-buttons {
                flex-wrap: wrap;
                justify-content: center;
                gap: 8px;
            }
            
            .button-bulk-export,
            .button-bulk-delete,
            .button-bulk-clear {
                font-size: 12px;
                padding: 6px 12px;
            }

            .select-all-control {
                justify-content: center;
            }

            .avatar-table-section {
                overflow-x: auto;
                border-radius: 8px;
            }

            .avatar-table {
                min-width: 800px;
            }

            .pagination-wrapper {
                flex-direction: column;
                gap: 16px;
                padding: 16px;
            }

            .pagination-links {
                width: 100%;
                justify-content: center;
                flex-wrap: wrap;
            }

            .page-jump-wrapper {
                width: 100%;
                justify-content: center;
            }
        }

        /* Loading State */
        .avatar-table tbody tr.loading {
            animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        /* Tooltip for long content */
        .truncate {
            max-width: 200px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    </style>

    <script>
        function copyToClipboard(text, button) {
            navigator.clipboard.writeText(text).then(function() {
                const originalText = button.innerHTML;
                button.innerHTML = '✓ Copied';
                button.classList.add('copied');
                
                setTimeout(function() {
                    button.innerHTML = originalText;
                    button.classList.remove('copied');
                }, 2000);
            }).catch(function(err) {
                console.error('Failed to copy: ', err);
            });
        }
        
        function jumpToPage() {
            const pageInput = document.getElementById('page-jump-input');
            const pageNum = parseInt(pageInput.value);
            const totalPages = <?php echo $total_pages; ?>;
            
            if (pageNum >= 1 && pageNum <= totalPages) {
                const currentUrl = new URL(window.location.href);
                currentUrl.searchParams.set('paged', pageNum);
                window.location.href = currentUrl.toString();
            } else {
                alert('Please enter a valid page number between 1 and ' + totalPages);
            }
        }
        
        // Bulk selection functions
        function toggleSelectAll(checkbox) {
            const submissionCheckboxes = document.querySelectorAll('.submission-checkbox');
            submissionCheckboxes.forEach(cb => {
                cb.checked = checkbox.checked;
            });
            updateBulkActions();
        }
        
        function updateBulkActions() {
            const selectedCheckboxes = document.querySelectorAll('.submission-checkbox:checked');
            const selectedCount = document.getElementById('selected-count');
            
            selectedCount.textContent = selectedCheckboxes.length + ' selected';
            document.getElementById('select-all-checkbox').checked = selectedCheckboxes.length === document.querySelectorAll('.submission-checkbox').length;
        }
        
        function clearSelection() {
            document.querySelectorAll('.submission-checkbox').forEach(cb => {
                cb.checked = false;
            });
            document.getElementById('select-all-checkbox').checked = false;
            updateBulkActions();
        }
        
        // Bulk delete functions
        function showBulkDeleteModal() {
            const selectedCheckboxes = document.querySelectorAll('.submission-checkbox:checked');
            document.getElementById('bulk-selected-count').textContent = selectedCheckboxes.length + ' submission(s)';
            document.getElementById('bulk-delete-modal').classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        function closeBulkDeleteModal() {
            document.getElementById('bulk-delete-modal').classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        function confirmBulkDelete() {
            const selectedCheckboxes = document.querySelectorAll('.submission-checkbox:checked');
            const container = document.getElementById('bulk-delete-submissions-container');
            container.innerHTML = '';
            
            selectedCheckboxes.forEach(checkbox => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'selected_submissions[]';
                input.value = checkbox.value;
                container.appendChild(input);
            });
            
            document.getElementById('bulk-delete-form').submit();
        }
        
        // Export Selected CSV function
        function exportSelectedSubmissions() {
            const selectedCheckboxes = document.querySelectorAll('.submission-checkbox:checked');
            
            if (selectedCheckboxes.length === 0) {
                alert('Please select at least one submission to export.');
                return false;
            }
            
            // Get selected submission IDs
            const selectedSubmissions = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);
            
            // Show loading state
            const exportBtn = document.querySelector('.button-bulk-export');
            const originalText = exportBtn.innerHTML;
            exportBtn.innerHTML = '⏳ Exporting...';
            exportBtn.disabled = true;
            
            // Create a hidden form and submit it via AJAX
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '<?php echo admin_url('admin-ajax.php'); ?>';
            form.style.display = 'none';
            
            // Add action
            const actionInput = document.createElement('input');
            actionInput.type = 'hidden';
            actionInput.name = 'action';
            actionInput.value = 'avatar_studio_export_submissions_csv';
            form.appendChild(actionInput);
            
            // Add nonce
            const nonceInput = document.createElement('input');
            nonceInput.type = 'hidden';
            nonceInput.name = 'nonce';
            nonceInput.value = '<?php echo wp_create_nonce('export_submissions_csv_action'); ?>';
            form.appendChild(nonceInput);
            
            // Add form_id
            const formIdInput = document.createElement('input');
            formIdInput.type = 'hidden';
            formIdInput.name = 'form_id';
            formIdInput.value = '<?php echo $form_id; ?>';
            form.appendChild(formIdInput);
            
            // Add selected submission IDs
            selectedSubmissions.forEach(submissionId => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'selected_submissions[]';
                input.value = submissionId;
                form.appendChild(input);
            });
            
            // Add form to document and submit
            document.body.appendChild(form);
            form.submit();
            
            // Remove form after submission and reset button
            setTimeout(() => {
                document.body.removeChild(form);
                exportBtn.innerHTML = originalText;
                exportBtn.disabled = false;
            }, 3000);
            
            return false;
        }
        
        // Export All CSV function
        function exportAllSubmissions() {
            // Show loading state
            const exportAllBtn = document.querySelector('.button-bulk-export-all');
            const originalText = exportAllBtn.innerHTML;
            exportAllBtn.innerHTML = '⏳ Exporting All...';
            exportAllBtn.disabled = true;
            
            // Create a hidden form and submit it via AJAX
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '<?php echo admin_url('admin-ajax.php'); ?>';
            form.style.display = 'none';
            
            // Add action
            const actionInput = document.createElement('input');
            actionInput.type = 'hidden';
            actionInput.name = 'action';
            actionInput.value = 'avatar_studio_export_submissions_csv';
            form.appendChild(actionInput);
            
            // Add nonce
            const nonceInput = document.createElement('input');
            nonceInput.type = 'hidden';
            nonceInput.name = 'nonce';
            nonceInput.value = '<?php echo wp_create_nonce('export_submissions_csv_action'); ?>';
            form.appendChild(nonceInput);
            
            // Add form_id
            const formIdInput = document.createElement('input');
            formIdInput.type = 'hidden';
            formIdInput.name = 'form_id';
            formIdInput.value = '<?php echo $form_id; ?>';
            form.appendChild(formIdInput);
            
            // Add export_all flag
            const exportAllInput = document.createElement('input');
            exportAllInput.type = 'hidden';
            exportAllInput.name = 'export_all';
            exportAllInput.value = '1';
            form.appendChild(exportAllInput);
            
            // Add form to document and submit
            document.body.appendChild(form);
            form.submit();
            
            // Remove form after submission and reset button
            setTimeout(() => {
                document.body.removeChild(form);
                exportAllBtn.innerHTML = originalText;
                exportAllBtn.disabled = false;
            }, 3000);
            
            return false;
        }

        // Field expansion
        function expandField(fieldId, button) {
            const fieldValue = document.getElementById(fieldId);
            const fullValue = fieldValue.getAttribute('data-full-value');
            
            if (button.innerHTML === '↗') {
                const fullDiv = document.createElement('div');
                fullDiv.className = 'field-full-value';
                fullDiv.textContent = fullValue;
                fieldValue.parentNode.appendChild(fullDiv);
                button.innerHTML = '↘';
            } else {
                const fullDiv = fieldValue.parentNode.querySelector('.field-full-value');
                if (fullDiv) {
                    fullDiv.remove();
                }
                button.innerHTML = '↗';
            }
        }
        
        document.addEventListener('DOMContentLoaded', function() {
            const pageInput = document.getElementById('page-jump-input');
            if (pageInput) {
                pageInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        jumpToPage();
                    }
                });
            }
            
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeBulkDeleteModal();
                }
            });
            
            document.addEventListener('click', function(e) {
                if (e.target.id === 'bulk-delete-modal') {
                    closeBulkDeleteModal();
                }
            });
        });
    </script>

    <div class="avatar-user-info-wrapper">
        <!-- Back Navigation -->
        <div class="back-navigation">
            <a href="<?php echo admin_url('admin.php?page=avatar-form-builder'); ?>" class="back-to-forms-btn">
                Back to Forms List
            </a>
        </div>

        <!-- Header -->
        <div class="avatar-user-info-header">
            <h1>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                Submissions for: <?php echo esc_html($form->title); ?>
            </h1>
            <p>View and manage form submissions with real-time data insights.</p>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Total Submissions</div>
                <div class="stat-value"><?php echo number_format($total_items); ?></div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Current Page</div>
                <div class="stat-value"><?php echo $paged; ?> / <?php echo max(1, $total_pages); ?></div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Records Per Page</div>
                <div class="stat-value"><?php echo $per_page; ?></div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Form Fields</div>
                <div class="stat-value"><?php echo count($fields); ?></div>
            </div>
        </div>

        <!-- Search & Bulk Actions Section -->
        <div class="search-bulk-section">
            <div class="search-bulk-grid">
                <!-- Column 1: Search Bar -->
                <div class="search-column">
                    <div class="search-card">
                        <h3 class="search-title">Search Submissions</h3>
                        <form method="get" action="" class="search-form-wrapper">
                            <input type="hidden" name="page" value="avatar-form-submissions">
                            <input type="hidden" name="form_id" value="<?php echo $form_id; ?>">
                            
                            <div class="search-input-group">
                                <input 
                                    type="search" 
                                    name="s" 
                                    value="<?php echo esc_attr($search); ?>" 
                                    placeholder="Search by any field value…"
                                    class="search-input"
                                >
                                <button type="submit" class="search-button">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <path d="m21 21-4.3-4.3"></path>
                                    </svg>
                                    Search
                                </button>
                                <?php if (!empty($search)) : ?>
                                    <a href="?page=avatar-form-submissions&form_id=<?php echo $form_id; ?>" class="search-clear">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                        Clear
                                    </a>
                                <?php endif; ?>
                            </div>
                        </form>
                    </div>
                </div>
                
                <!-- Column 2: Bulk Actions -->
                <div class="bulk-actions-column">
                    <div class="bulk-actions-card">
                        <h3 class="bulk-actions-title">Bulk Actions</h3>
                        <div class="bulk-controls">
                            <div class="bulk-controls-row" style="display: flex; justify-content: space-between;">
                                <div class="bulk-buttons" id="bulk-buttons">
                                    <button style="border: none; padding: 0;">
                                        <span class="selected-count" id="selected-count">0 Selected</span>
                                    </button>    
                                    <button type="button" class="button-bulk-export" onclick="exportSelectedSubmissions()">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        Export Selected
                                    </button>
                                    <button type="button" class="button-bulk-export-all" onclick="exportAllSubmissions()">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        Export All
                                    </button>
                                    <button type="button" class="button-bulk-delete" onclick="showBulkDeleteModal()">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M3 6h18"></path>
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                        </svg>
                                        Delete
                                    </button>
                                    <button type="button" class="button-bulk-clear" onclick="clearSelection()">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Table Section -->
        <div class="avatar-table-section">
            <table class="avatar-table">
                <thead>
                    <tr>
                        <th>
                            <input style="width: 1.1rem; height: 1.1rem;" type="checkbox" id="select-all-checkbox" onchange="toggleSelectAll(this)">
                        </th>
                        <th>ID</th>
                        <th>Session ID</th>
                        <?php foreach ($fields as $field): ?>
                            <th><?php echo esc_html($field['label']); ?></th>
                        <?php endforeach; ?>
                        <th>Submitted Date & Time</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($submissions) : ?>
                        <?php foreach ($submissions as $submission): 
                            $data = json_decode($submission->submission_data, true);
                        ?>
                            <tr>
                                <td>
                                    <input type="checkbox" name="selected_submissions[]" value="<?php echo esc_attr($submission->id); ?>" class="submission-checkbox" onchange="updateBulkActions()">
                                </td>
                                <td><strong>AS<?php echo esc_html($submission->id); ?></strong></td>
                                <td>
                                    <div class="conversation-id-wrapper">
                                        <span class="badge badge-primary truncate" title="<?php echo esc_attr($submission->session_id); ?>">
                                            <?php echo esc_html($submission->session_id); ?>
                                        </span>
                                        <button 
                                            class="copy-btn" 
                                            onclick="copyToClipboard('<?php echo esc_js($submission->session_id); ?>', this)"
                                            title="Copy to clipboard">
                                            📋
                                        </button>
                                    </div>
                                </td>
                                <?php foreach ($fields as $field): 
                                    $field_value = isset($data[$field['label']]) ? $data[$field['label']] : '';
                                    $display_value = is_array($field_value) ? implode(', ', $field_value) : $field_value;
                                ?>
                                    <td>
                                        <?php if (strlen($display_value) > 50): ?>
                                            <span id="field-<?php echo $submission->id; ?>-<?php echo sanitize_title($field['label']); ?>" 
                                                  class="field-value" 
                                                  data-full-value="<?php echo esc_attr($display_value); ?>"
                                                  title="<?php echo esc_attr($display_value); ?>">
                                                <?php echo esc_html(substr($display_value, 0, 50) . '...'); ?>
                                            </span>
                                            <button class="expand-field" 
                                                    onclick="expandField('field-<?php echo $submission->id; ?>-<?php echo sanitize_title($field['label']); ?>', this)">
                                                ↗
                                            </button>
                                        <?php else: ?>
                                            <span title="<?php echo esc_attr($display_value); ?>">
                                                <?php echo esc_html($display_value); ?>
                                            </span>
                                        <?php endif; ?>
                                    </td>
                                <?php endforeach; ?>
                                <td>
                                    <?php 
                                    $submitted_date = DateTime::createFromFormat('Y-m-d H:i:s', $submission->submitted_at);
                                    if ($submitted_date) {
                                        echo esc_html($submitted_date->format('m-d-Y H:i:s'));
                                    } else {
                                        echo esc_html($submission->submitted_at);
                                    }
                                    ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else : ?>
                        <tr>
                            <td colspan="<?php echo count($fields) + 5; ?>" class="table-empty">
                                <?php echo !empty($search) ? 'No submissions found matching your search.' : 'No submissions available yet.'; ?>
                            </td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>

            <!-- Pagination -->
            <?php if ($total_pages > 1) : ?>
                <div class="pagination-wrapper">
                    <div class="pagination-info">
                        Showing <strong><?php echo number_format($offset + 1); ?>-<?php echo number_format(min($offset + $per_page, $total_items)); ?></strong> of <strong><?php echo number_format($total_items); ?></strong> records
                    </div>
                    
                    <div class="pagination-links">
                        <?php if ($paged > 1): ?>
                            <a href="<?php echo avatar_filter_url(['paged'=>1]); ?>" class="page-btn">« First</a>
                            <a href="<?php echo avatar_filter_url(['paged'=>$paged-1]); ?>" class="page-btn">‹ Previous</a>
                        <?php endif; ?>
                        
                        <span class="page-current">Page <?php echo $paged; ?> of <?php echo $total_pages; ?></span>
                        
                        <?php if ($paged < $total_pages): ?>
                            <a href="<?php echo avatar_filter_url(['paged'=>$paged+1]); ?>" class="page-btn">Next ›</a>
                            <a href="<?php echo avatar_filter_url(['paged'=>$total_pages]); ?>" class="page-btn">Last »</a>
                        <?php endif; ?>
                    </div>

                    <div class="page-jump-wrapper">
                        <span class="page-jump-label">Go to page:</span>
                        <input 
                            type="number" 
                            id="page-jump-input" 
                            class="page-jump-input" 
                            min="1" 
                            max="<?php echo $total_pages; ?>" 
                            value="<?php echo $paged; ?>"
                            placeholder="<?php echo $paged; ?>"
                        >
                        <button class="page-jump-btn" onclick="jumpToPage()">Go</button>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- Bulk Delete Confirmation Modal -->
    <div id="bulk-delete-modal" class="delete-modal">
        <div class="delete-modal-content">
            <div class="delete-modal-header">
                <div class="delete-modal-icon">⚠️</div>
                <h2 class="delete-modal-title">Confirm Bulk Deletion</h2>
            </div>
            
            <div class="delete-modal-body">
                <p class="delete-modal-text" id="bulk-delete-message">
                    Are you sure you want to delete the selected submissions? This action cannot be undone.
                </p>
                
                <div class="delete-user-details">
                    <p><strong>Selected Submissions:</strong> <span id="bulk-selected-count"></span></p>
                    <p style="color: #dc2626; font-weight: 600;">This will permanently remove all selected submission records.</p>
                </div>
            </div>
            
            <div class="delete-modal-footer">
                <button type="button" class="modal-btn-cancel" onclick="closeBulkDeleteModal()">
                    Cancel
                </button>
                <button type="button" class="modal-btn-delete" onclick="confirmBulkDelete()">
                    Delete Selected Submissions
                </button>
            </div>
        </div>
    </div>

    <!-- Bulk Delete Form -->
    <form id="bulk-delete-form" method="post" style="display: none;">
        <input type="hidden" name="page" value="avatar-form-submissions">
        <input type="hidden" name="form_id" value="<?php echo $form_id; ?>">
        <input type="hidden" name="bulk_delete" value="1">
        <input type="hidden" name="bulk_delete_nonce" value="<?php echo wp_create_nonce('bulk_delete_action'); ?>">
        <div id="bulk-delete-submissions-container"></div>
    </form>
    
    <?php
}
    
    private function export_submissions_csv($form_id, $post_data) {
        global $wpdb;
        
        $form = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$this->table_name} WHERE id = %d",
            $form_id
        ));
        
        if (!$form) {
            wp_die('Form not found.');
        }
        
        $form_data = json_decode($form->form_data, true);
        $fields = $form_data['fields'] ?? [];
        
        // Build WHERE clause
        $where_sql = "WHERE form_id = %d";
        $where_params = [$form_id];
        
        // Check if exporting selected or all
        $export_type = isset($post_data['export_type']) ? $post_data['export_type'] : 'all';
        
        if ($export_type === 'selected' && !empty($post_data['selected_submissions'])) {
            $selected_ids = array_map('intval', $post_data['selected_submissions']);
            $placeholders = implode(',', array_fill(0, count($selected_ids), '%d'));
            $where_sql .= " AND id IN ($placeholders)";
            $where_params = array_merge($where_params, $selected_ids);
        }
        
        // Get submissions
        $submissions = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM {$this->submissions_table} {$where_sql} ORDER BY submitted_at DESC",
                $where_params
            )
        );
        
        // Set headers for CSV download
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=form-submissions-' . $form_id . '-' . date('Y-m-d-H-i-s') . '.csv');
        
        // Create output stream
        $output = fopen('php://output', 'w');
        
        // Add BOM for UTF-8
        fwrite($output, "\xEF\xBB\xBF");
        
        // Prepare headers
        $headers = ['Submission ID', 'Session ID', 'Avatar Studio ID'];
        foreach ($fields as $field) {
            $headers[] = $field['label'];
        }
        $headers[] = 'Submitted At';
        
        // Write headers
        fputcsv($output, $headers);
        
        // Write data rows
        foreach ($submissions as $submission) {
            $data = json_decode($submission->submission_data, true);
            
            $row = [
                'FS' . $submission->id,
                $submission->session_id,
                $submission->avatar_studio_id ? 'AS' . $submission->avatar_studio_id : 'N/A'
            ];
            
            foreach ($fields as $field) {
                $field_value = isset($data[$field['label']]) ? $data[$field['label']] : '';
                if (is_array($field_value)) {
                    $field_value = implode(', ', $field_value);
                }
                $row[] = $field_value;
            }
            
            $row[] = $submission->submitted_at;
            
            fputcsv($output, $row);
        }
        
        fclose($output);
        exit;
    }
    
    public function ajax_save_form() {
        // Verify nonce
        if (!check_ajax_referer('save_avatar_form', 'nonce', false)) {
            wp_send_json_error('Security check failed');
            return;
        }
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
            return;
        }
        
        global $wpdb;
        
        $form_id = isset($_POST['form_id']) ? intval($_POST['form_id']) : 0;
        $form_data_raw = isset($_POST['form_data']) ? wp_unslash($_POST['form_data']) : '';
        
        // Validate JSON
        $form_data = json_decode($form_data_raw, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            wp_send_json_error('Invalid JSON data: ' . json_last_error_msg());
            return;
        }
        
        if (empty($form_data['title'])) {
            wp_send_json_error('Form title is required');
            return;
        }
        
        // Ensure fields array exists
        if (!isset($form_data['fields']) || !is_array($form_data['fields'])) {
            $form_data['fields'] = [];
        }
        
        // Sanitize form data
        $data = [
            'title' => sanitize_text_field($form_data['title']),
            'description' => isset($form_data['description']) ? sanitize_textarea_field($form_data['description']) : '',
            'form_data' => json_encode($form_data),
            'updated_at' => current_time('mysql')
        ];
        
        try {
            if ($form_id > 0) {
                // Update existing form
                $result = $wpdb->update(
                    $this->table_name,
                    $data,
                    ['id' => $form_id],
                    ['%s', '%s', '%s', '%s'],
                    ['%d']
                );
                
                if ($result === false) {
                    throw new Exception($wpdb->last_error);
                }
                
                $id = $form_id;
            } else {
                // Insert new form
                $data['created_at'] = current_time('mysql');
                
                $result = $wpdb->insert(
                    $this->table_name,
                    $data,
                    ['%s', '%s', '%s', '%s', '%s']
                );
                
                if ($result === false) {
                    throw new Exception($wpdb->last_error);
                }
                
                $id = $wpdb->insert_id;
            }
            
            wp_send_json_success([
                'id' => $id,
                'message' => 'Form saved successfully',
                'title' => $data['title']
            ]);
            
        } catch (Exception $e) {
            wp_send_json_error('Database error: ' . $e->getMessage());
        }
    }
    
    public function ajax_get_form() {
        check_ajax_referer('get_avatar_form', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        
        $form_id = intval($_GET['form_id']);
        $form = $this->get_form_by_id($form_id);
        
        if ($form) {
            $form_data = json_decode($form->form_data, true);
            wp_send_json_success([
                'title' => $form->title,
                'description' => $form->description,
                'fields' => $form_data['fields'] ?? []
            ]);
        } else {
            wp_send_json_error('Form not found');
        }
    }
    
    public function ajax_delete_form() {
        check_ajax_referer('delete_avatar_form', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        
        global $wpdb;
        $form_id = intval($_POST['form_id']);
        
        $wpdb->delete($this->table_name, ['id' => $form_id]);
        $wpdb->delete($this->submissions_table, ['form_id' => $form_id]);
        
        wp_send_json_success();
    }
    
    public function ajax_submit_form() {
    // Allow both logged-in and non-logged-in users
    // Note: Nonce check is commented out for frontend submission
    
    // Debug log
    error_log('Avatar Form Submission - POST Data: ' . print_r($_POST, true));
    
    $form_id = isset($_POST['form_id']) ? intval($_POST['form_id']) : 0;
    $session_id = isset($_POST['session_id']) ? sanitize_text_field($_POST['session_id']) : '';
    $avatar_studio_id = isset($_POST['avatar_studio_id']) ? intval($_POST['avatar_studio_id']) : 0;
    $form_data_raw = isset($_POST['form_data']) ? $_POST['form_data'] : '';
    
    // Debug log
    error_log("Form ID: $form_id, Session ID: $session_id, Studio ID: $avatar_studio_id");
    
    // Validate form_id
    if ($form_id <= 0) {
        error_log('Avatar Form Submit Error - Invalid Form ID: ' . $form_id);
        wp_send_json_error('Invalid form ID. Please select a valid form.');
        return;
    }
    
    // Check if form exists
    $form_exists = $this->get_form_by_id($form_id);
    if (!$form_exists) {
        error_log('Avatar Form Submit Error - Form not found: ' . $form_id);
        wp_send_json_error('Form not found. Please select a valid form.');
        return;
    }
    
    // Parse JSON if it's a string
    $form_data = [];
    if (is_string($form_data_raw)) {
        $form_data = json_decode(stripslashes($form_data_raw), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            error_log('JSON Parse Error: ' . json_last_error_msg());
            // Try to decode without stripslashes
            $form_data = json_decode($form_data_raw, true);
        }
    } else {
        $form_data = $form_data_raw;
    }
    
    // Validate form data
    if (empty($form_data) || !is_array($form_data)) {
        error_log('Avatar Form Submit Error - Invalid form data format');
        error_log('Raw data: ' . print_r($form_data_raw, true));
        error_log('Parsed data: ' . print_r($form_data, true));
        wp_send_json_error('Invalid form data format.');
        return;
    }
    
    // Generate session ID if not provided
    if (empty($session_id)) {
        $session_id = 'session_' . time() . '_' . uniqid();
    }
    
    global $wpdb;
    
    // Insert submission
    $result = $wpdb->insert($this->submissions_table, [
        'form_id' => $form_id,
        'session_id' => $session_id,
        'avatar_studio_id' => $avatar_studio_id,
        'submission_data' => json_encode($form_data),
        'submitted_at' => current_time('mysql')
    ]);
    
    if ($result === false) {
        error_log('Avatar Form DB Error: ' . $wpdb->last_error);
        wp_send_json_error('Database error: ' . $wpdb->last_error);
    } else {
        error_log('Avatar Form Submitted Successfully - ID: ' . $wpdb->insert_id . ', Form ID: ' . $form_id);
        wp_send_json_success([
            'submission_id' => $wpdb->insert_id,
            'message' => 'Form submitted successfully'
        ]);
    }
}
    
    public function get_all_forms() {
        global $wpdb;
        return $wpdb->get_results("SELECT id, title FROM {$this->table_name} ORDER BY title");
    }
    
    public function get_form_by_id($form_id) {
        global $wpdb;
        return $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$this->table_name} WHERE id = %d",
            $form_id
        ));
    }
}

// Initialize the form builder
Avatar_Form_Builder::get_instance();