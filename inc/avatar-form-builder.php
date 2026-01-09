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
        add_action('admin_enqueue_scripts', [$this, 'enqueue_scripts']);
        add_action('wp_ajax_avanew_as_avatar_studio_export_submissions_csv', [$this, 'ajax_export_submissions_csv']);
    }
    
    public function enqueue_scripts($hook) {
        if ('avatar-studio_page_avatar-form-builder' !== $hook && 
            strpos($hook, 'avatar-form-submissions') === false) {
            return;
        }

        // Enqueue the CSS file
        wp_enqueue_style(
            'avatar-form-builder-css',
            plugin_dir_url(__FILE__) . '../assets/css/avatar-form-builder.css',
            array(),
            '1.0.6'
        );
        
        // Enqueue jQuery UI for drag and drop
        wp_enqueue_script('jquery');
        wp_enqueue_script('jquery-ui-core');
        wp_enqueue_script('jquery-ui-widget');
        wp_enqueue_script('jquery-ui-mouse');
        wp_enqueue_script('jquery-ui-draggable');
        wp_enqueue_script('jquery-ui-droppable');
        wp_enqueue_script('jquery-ui-sortable');

        // Enqueue the external JavaScript file for submissions page
        if (strpos($hook, 'avatar-form-submissions') !== false) {
            wp_enqueue_script(
                'avatar-form-submissions-js',
                plugin_dir_url(__FILE__) . '../assets/js/avatar-form-submissions.js',
                array('jquery'),
                '1.0.0',
                true
            );
            
            // Pass PHP variables to JavaScript
            wp_localize_script('avatar-form-submissions-js', 'avatarFormBuilder', [
                'ajax_url' => admin_url('admin-ajax.php'),
                'export_nonce' => wp_create_nonce('export_submissions_csv_action'),
                'form_id' => isset($_GET['form_id']) ? intval($_GET['form_id']) : 0,
                'total_pages' => isset($total_pages) ? $total_pages : 1
            ]);
        }
        
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
                        nonce: '<?php echo esc_js(wp_create_nonce('save_avatar_form')); ?>'
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
                        nonce: '<?php echo esc_js(wp_create_nonce('get_avatar_form')); ?>'
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
                            nonce: '<?php echo esc_js(wp_create_nonce('delete_avatar_form')); ?>'
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
            echo '<td><strong class="badge-primary" style="display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">ASF' . esc_html($form->id) . '</strong></td>';
            echo '<td><strong>' . esc_html($form->title) . '</strong></td>';
            echo '<td>' . esc_html($form->description ?: '—') . '</td>';
            echo '<td><span class="field-count-badge">' . esc_html($fields_count) . ' field' . ($fields_count !== 1 ? 's' : '') . '</span></td>';
            echo '<td><span class="badge-secondary" style="display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; background: #f3f4f6; color: #4b5563; border: 1px solid #d1d5db;">' . esc_html(date('m-d-Y H:i', strtotime($form->created_at))) . '</span></td>';
            echo '<td><span class="badge-secondary" style="display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; background: #f3f4f6; color: #4b5563; border: 1px solid #d1d5db;">' . esc_html(date('m-d-Y H:i', strtotime($form->updated_at))) . '</span></td>';
            echo '<td class="form-actions">';
            echo '<button class="form-action-btn edit-form-btn" data-id="' . esc_attr($form->id) . '" title="Edit Form">';
            echo 'Edit';
            echo '</button> ';
            
            echo '<a href="' . esc_url(admin_url('admin.php?page=avatar-form-submissions&form_id=' . $form->id)) . '" class="form-action-btn view-submissions-btn" title="View Submissions">';
            echo 'View Submissions';
            echo '</a> ';
            
            echo '<button class="form-action-btn delete-form-btn" data-id="' . esc_attr($form->id) . '" title="Delete Form">';
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
                    echo '<div class="notice notice-success is-dismissible"><p><strong>Success!</strong> ' . esc_html($deleted) . ' submissions deleted successfully.</p></div>';
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

    <script type="text/javascript">
    // Make functions globally available for inline onclick handlers
    window.copyToClipboard = function(text, button) {
        if (window.avatarFormSubmissions) {
            window.avatarFormSubmissions.copyToClipboard(text, button);
        }
    };
    
    window.jumpToPage = function() {
        if (window.avatarFormSubmissions) {
            window.avatarFormSubmissions.jumpToPage();
        }
    };
    
    window.toggleSelectAll = function(checkbox) {
        if (window.avatarFormSubmissions) {
            window.avatarFormSubmissions.toggleSelectAll(checkbox);
        }
    };
    
    window.updateBulkActions = function() {
        if (window.avatarFormSubmissions) {
            window.avatarFormSubmissions.updateBulkActions();
        }
    };
    
    window.clearSelection = function() {
        if (window.avatarFormSubmissions) {
            window.avatarFormSubmissions.clearSelection();
        }
    };
    
    window.showBulkDeleteModal = function() {
        if (window.avatarFormSubmissions) {
            window.avatarFormSubmissions.showBulkDeleteModal();
        }
    };
    
    window.closeBulkDeleteModal = function() {
        if (window.avatarFormSubmissions) {
            window.avatarFormSubmissions.closeBulkDeleteModal();
        }
    };
    
    window.confirmBulkDelete = function() {
        if (window.avatarFormSubmissions) {
            window.avatarFormSubmissions.confirmBulkDelete();
        }
    };
    
    window.exportSelectedSubmissions = function() {
        if (window.avatarFormSubmissions) {
            return window.avatarFormSubmissions.exportSelectedSubmissions();
        }
        return false;
    };
    
    window.exportAllSubmissions = function() {
        if (window.avatarFormSubmissions) {
            return window.avatarFormSubmissions.exportAllSubmissions();
        }
        return false;
    };
    
    window.expandField = function(fieldId, button) {
        if (window.avatarFormSubmissions) {
            window.avatarFormSubmissions.expandField(fieldId, button);
        }
    };
    
    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        // Ensure updateBulkActions runs on page load
        if (window.avatarFormSubmissions && window.avatarFormSubmissions.updateBulkActions) {
            window.avatarFormSubmissions.updateBulkActions();
        }
    });
    </script>

    <div class="avatar-user-info-wrapper">
        <!-- Back Navigation -->
        <div class="back-navigation">
            <a href="<?php echo esc_url(admin_url('admin.php?page=avatar-form-builder')); ?>" class="back-to-forms-btn">
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
                <div class="stat-value"><?php echo esc_html(number_format($total_items)); ?></div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Current Page</div>
                <div class="stat-value"><?php echo esc_html($paged); ?> / <?php echo esc_html(max(1, $total_pages)); ?></div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Records Per Page</div>
                <div class="stat-value"><?php echo esc_html($per_page); ?></div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Form Fields</div>
                <div class="stat-value"><?php echo esc_html(count($fields)); ?></div>
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
                            <input type="hidden" name="form_id" value="<?php echo esc_attr($form_id); ?>">
                            
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
                                    <a href="?page=avatar-form-submissions&form_id=<?php echo esc_attr($form_id); ?>" class="search-clear">
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
                                            <span id="field-<?php echo esc_attr($submission->id); ?>-<?php echo esc_attr(sanitize_title($field['label'])); ?>" 
                                                  class="field-value" 
                                                  data-full-value="<?php echo esc_attr($display_value); ?>"
                                                  title="<?php echo esc_attr($display_value); ?>">
                                                <?php echo esc_html(substr($display_value, 0, 50) . '...'); ?>
                                            </span>
                                            <button class="expand-field" 
                                                    onclick="expandField('field-<?php echo esc_attr($submission->id); ?>-<?php echo esc_attr(sanitize_title($field['label'])); ?>', this)">
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
                            <td colspan="<?php echo esc_attr(count($fields) + 5); ?>" class="table-empty">
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
                        Showing <strong><?php echo esc_html(number_format($offset + 1)); ?>-<?php echo esc_html(number_format(min($offset + $per_page, $total_items))); ?></strong> of <strong><?php echo esc_html(number_format($total_items)); ?></strong> records
                    </div>
                    
                    <div class="pagination-links">
                        <?php if ($paged > 1): ?>
                            <a href="<?php echo esc_url(avatar_filter_url(['paged'=>1])); ?>" class="page-btn">« First</a>
                            <a href="<?php echo esc_url(avatar_filter_url(['paged'=>$paged-1])); ?>" class="page-btn">‹ Previous</a>
                        <?php endif; ?>
                        
                        <span class="page-current">Page <?php echo esc_html($paged); ?> of <?php echo esc_html($total_pages); ?></span>
                        
                        <?php if ($paged < $total_pages): ?>
                            <a href="<?php echo esc_url(avatar_filter_url(['paged'=>$paged+1])); ?>" class="page-btn">Next ›</a>
                            <a href="<?php echo esc_url(avatar_filter_url(['paged'=>$total_pages])); ?>" class="page-btn">Last »</a>
                        <?php endif; ?>
                    </div>

                    <div class="page-jump-wrapper">
                        <span class="page-jump-label">Go to page:</span>
                        <input 
                            type="number" 
                            id="page-jump-input" 
                            class="page-jump-input" 
                            min="1" 
                            max="<?php echo esc_attr($total_pages); ?>" 
                            value="<?php echo esc_attr($paged); ?>"
                            placeholder="<?php echo esc_attr($paged); ?>"
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
        <input type="hidden" name="form_id" value="<?php echo esc_attr($form_id); ?>">
        <input type="hidden" name="bulk_delete" value="1">
        <input type="hidden" name="bulk_delete_nonce" value="<?php echo esc_attr(wp_create_nonce('bulk_delete_action')); ?>">
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
            'form_data' => wp_json_encode($form_data),
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
            'submission_data' => wp_json_encode($form_data),
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

    public function ajax_export_submissions_csv() {
        // Verify nonce
        if (!check_ajax_referer('export_submissions_csv_action', 'nonce', false)) {
            wp_die('Security check failed');
        }
        
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        
        $form_id = isset($_POST['form_id']) ? intval($_POST['form_id']) : 0;
        $export_all = isset($_POST['export_all']) && $_POST['export_all'] === '1';
        $selected_submissions = isset($_POST['selected_submissions']) ? $_POST['selected_submissions'] : [];
        
        // Call the existing export method
        $this->export_submissions_csv($form_id, [
            'export_type' => $export_all ? 'all' : 'selected',
            'selected_submissions' => $selected_submissions
        ]);
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