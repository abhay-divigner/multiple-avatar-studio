<?php

if (!defined('ABSPATH'))
    exit;

wp_enqueue_style(
    'avatar-form-styles',
    plugin_dir_url(__FILE__) . '../assets/css/avatar-form.css',
    array(),
    '1.0.0'
);

// Enqueue scripts
wp_enqueue_script(
    'avatar-form-admin',
    plugin_dir_url(__FILE__) . '../assets/js/avatar-form-admin.js',
    array('jquery', 'wp-color-picker'),
    '1.0.0',
    true // Load in footer
);

$previewImage = plugin_dir_url(__FILE__) . '../assets/images/preview.webp';

// Localize script to pass PHP variables to JavaScript
wp_localize_script('avatar-form-admin', 'avatarFormAdmin', array(
    'plugin_dir_url' => plugin_dir_url(__FILE__) . '../',
    'previewImage' => $previewImage
));

// Enqueue WordPress media uploader
wp_enqueue_media();


if ($avatar && !isset($avatar->selected_form_id)) {
    $avatar->selected_form_id = isset($avatar->selected_form_id) ? $avatar->selected_form_id : 0;
}

require_once plugin_dir_path(__FILE__) . 'avatar-form-builder.php';
$avatar = isset($avatar) ? $avatar : null;

global $avatar_vendor;
global $livekit_enable;

// Get vendor from URL if provided (tavus or heygen)
$get_vendor = (isset($_GET['vendor']) && ($_GET['vendor'] == 'tavus' || $_GET['vendor'] == 'heygen'))
                ? sanitize_text_field($_GET['vendor'])
                : null;

// Set final vendor: GET vendor OR avatar vendor OR default
$avatar_vendor = $get_vendor || ($avatar->vendor == "tavus") ? "tavus" : "heygen";

$all_pages = get_pages();
$previewImage = plugin_dir_url(__FILE__) . '../assets/images/preview.webp';
?>

<link rel="stylesheet" href="<?php echo esc_url(plugin_dir_url(__FILE__)); ?>../assets/css/fontawesome/css/all.min.css">


<div class="avatar-form">
    <form id="avatarForm" method="post" action="<?php echo esc_url(admin_url('admin-post.php')) ?>">
    <?php 
    // Get the ID from URL or from avatar object
    $id = isset($_GET['id']) ? intval($_GET['id']) : ($avatar ? $avatar->id : 0);
    $is_edit = ($id > 0);
    wp_nonce_field($is_edit ? 'update_avatar' : 'save_avatar'); 
    ?>

    <input type="hidden" name="action" value="<?php echo $is_edit ? 'update_avatar' : 'save_avatar' ?>">
    <?php if ($is_edit) { ?>
        <input type="hidden" name="id" value="<?php echo esc_attr($id); ?>">
    <?php } ?>
        <div class="col sm-col-wrap">

            <!-- Avatar Configuration Section - Full Width with Grid Layout -->
            <div class="avatar-form-grid-section">
                <div class="avatar-form-grid-header">
                    <h2>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                            <path d="M2 17l10 5 10-5"/>
                            <path d="M2 12l10 5 10-5"/>
                        </svg>
                        Avatar Configuration
                    </h2>
                    <div id="edit-page-logo" class="form-grid single-column">
                        <div class="form-field">
                            <!-- <label for="vendor">Vendor</label> -->
                            <div class="vendor-display">

                                <?php if ($avatar && $avatar->vendor === 'tavus'): ?>
                                    <img src="<?php echo esc_url(get_site_url()); ?>/wp-content/plugins/InteractiveAvatarStudio/assets/images/tavus_full_logo.png" alt="Tavus Logo">
                                <?php elseif ($avatar && $avatar->vendor === 'heygen'): ?>
                                    <img src="<?php echo esc_url(get_site_url()); ?>/wp-content/plugins/InteractiveAvatarStudio/assets/images/heygen_full_logo.png" alt="Heygen Logo">
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="avatar-form-grid-body input-grid">
                    <!-- Hidden vendor input -->
                    <input type="hidden" name="vendor" value="<?php echo $avatar && $avatar->vendor ? esc_attr($avatar->vendor) : ''; ?>">
                    
                    <?php
                    // Get the global API keys from first file settings
                    $global_tavus_key = get_option('avatar_studio_tavus_api_key');
                    $global_heygen_key = get_option('avatar_studio_heygen_api_key');

                    // Determine which key to use based on vendor
                    $default_api_key = '';
                    if ($avatar && $avatar->vendor === 'tavus') {
                        $default_api_key = $global_tavus_key;
                    } elseif ($avatar && $avatar->vendor === 'heygen') {
                        $default_api_key = $global_heygen_key;
                    }

                    // Use avatar-specific key if exists, otherwise use global default
                    $current_api_key = $avatar && $avatar->api_key ? $avatar->api_key : $default_api_key;
                    ?>

                    <!-- Row 1: API Key + Title -->
                    <div class="form-grid">
                        <div class="form-field">
                        <label for="api_key">API Key *<p class="field-description">
                            <?php if (empty($avatar->api_key) && !empty($default_api_key)): ?>
                                <span style="color: #38b1c5;">✓ Using global <?php echo esc_html(ucfirst($avatar_vendor)); ?> API key</span>
                            <?php elseif (empty($avatar->api_key) && empty($default_api_key)): ?>
                                <span style="color: #da922c;">⚠ No global API key set. Please configure in Settings.</span>
                            <?php else: ?>
                                Using avatar-specific API key
                            <?php endif; ?>
                        </p></label>
                        <input type="text" name="api_key" id="api_key" placeholder="Enter your API Key here..." 
                            value="<?php echo esc_attr($current_api_key); ?>" required />
                    </div>
                        
                        <div class="form-field">
                            <label for="avatar_title">Title</label>
                            <input type="text" name="title" id="avatar_title" placeholder="Enter your title here..." 
                                value="<?php echo $avatar && $avatar->title ? esc_attr($avatar->title) : '' ?>" />
                        </div>
                    </div>
                    
                    <!-- Row 2: Avatar ID + Knowledge ID -->
                    <div class="form-grid">
                        <div class="form-field">
                            <label for="avatar_id">
                                <?php echo ($avatar && $avatar->vendor === 'tavus') ? 'Replica ID *' : 'Avatar ID *'; ?>
                            </label>
                            <input type="text" name="avatar_id" id="avatar_id"
                                value="<?php echo $avatar && $avatar->avatar_id ? esc_attr($avatar->avatar_id) : '' ?>" 
                                placeholder="<?php echo ($avatar && $avatar->vendor === 'tavus') ? 'Enter your Replica ID here...' : 'Enter your Avatar ID here...'; ?>" 
                                required />
                        </div>
                        
                        <div class="form-field">
                            <label for="knowledge_id">
                                <?php echo ($avatar && $avatar->vendor === 'tavus') ? 'Persona ID *' : 'Knowledge ID *'; ?>
                            </label>
                            <input type="text" name="knowledge_id" id="knowledge_id" 
                                value="<?php echo $avatar && $avatar->knowledge_id ? esc_attr($avatar->knowledge_id) : '' ?>" 
                                placeholder="<?php echo ($avatar && $avatar->vendor === 'tavus') ? 'Enter your Persona ID here...' : 'Enter your Knowledge ID here...'; ?>" 
                                required />
                        </div>
                    </div>

                    <!-- Row 3: Avatar Name (Full Width) -->
                    <div class="form-grid">
                        <div class="form-grid single-column">
                            <div class="form-field">
                                <label for="avatar_name">Avatar Name</label>
                                <input type="text" name="avatar_name" id="avatar_name" placeholder="Enter your avatar name here..." 
                                    value="<?php echo $avatar && $avatar->avatar_name ? esc_attr($avatar->avatar_name) : '' ?>" />
                            </div>
                        </div>      
                        
                        <div class="form-grid single-column">
                            <div class="form-field">
                                <label for="preview_image">Preview/Poster Image</label>
                                <div class="image-uploader-wrap">
                                    <img class="image-preview"
                                        src="<?php echo $avatar && $avatar->preview_image ? esc_attr($avatar->preview_image) : '' ?>"
                                        style="<?php echo ($avatar && $avatar->preview_image) ? 'display: block;' : 'display: none;'; ?>" />
                                    <div class="upload-controls">
                                        <input type="text" name="preview_image" id="preview_image" class="image-url"
                                            value="<?php echo $avatar && $avatar->preview_image ? esc_attr($avatar->preview_image) : '' ?>" 
                                            placeholder="Enter image URL or upload..." />
                                        <button type="button" class="button upload-image-btn" title="Upload Image">
                                            <span class="dashicons dashicons-upload"></span>
                                        </button>
                                        <button type="button" class="button remove-image-btn" title="Remove"
                                            style="<?php echo ($avatar && $avatar->preview_image) ? 'display: inline-flex;' : 'display: none;'; ?>">
                                            <span class="dashicons dashicons-no-alt"></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    
                    <!-- Row 6: Open on Desktop + Video Enable + Chat Only (Three Columns) -->
                    <div class="form-grid three-columns" style="margin-bottom: 40px;">
                        <div class="form-field">
                            <label>
                                Open on Desktop
                                <span class="tooltip-wrapper">
                                    <span class="tooltip-icon">?</span>
                                    <span class="tooltip-content">Auto-open chat on desktop devices</span>
                                </span>
                            </label>
                            <div class="radio-group">
                                <label class="radio-option">
                                    <input type="radio" name="open_on_desktop" id="open_on_desktop_yes" value="1" 
                                        <?php echo ($avatar && $avatar->open_on_desktop == 1) ? 'checked' : ''; ?>>
                                    <span>Yes</span>
                                </label>
                                <label class="radio-option">
                                    <input type="radio" name="open_on_desktop" id="open_on_desktop_no" value="0" 
                                        <?php echo (!$avatar || $avatar->open_on_desktop == 0) ? 'checked' : ''; ?>>
                                    <span>No</span>
                                </label>
                            </div>
                        </div>

                        <div class="form-field">
                            <label>
                                Chat Only
                                <span class="tooltip-wrapper">
                                    <span class="tooltip-icon">?</span>
                                    <span class="tooltip-content">Enable text-only chat without video</span>
                                </span>
                            </label>
                            <div class="radio-group">
                                <label class="radio-option">
                                    <input type="radio" name="chat_only" id="chat_only_yes" value="1" 
                                        <?php echo ($avatar && $avatar->chat_only == 1) ? 'checked' : ''; ?>>
                                    <span>Yes</span>
                                </label>
                                <label class="radio-option">
                                    <input type="radio" name="chat_only" id="chat_only_no" value="0" 
                                        <?php echo (!$avatar || $avatar->chat_only == 0) ? 'checked' : ''; ?>>
                                    <span>No</span>
                                </label>
                            </div>
                        </div>

                        <div class="form-field">
                            <label for="time_limit">
                                Time Limit (minutes) *
                                <span class="tooltip-wrapper">
                                    <span class="tooltip-icon">?</span>
                                    <span class="tooltip-content">Specify how many minutes the avatar chat session can run</span>
                                </span>
                            </label>
                            <input type="number" min="0" name="time_limit" id="time_limit" style="width: 160px;" 
                                value="<?php echo $avatar && $avatar->time_limit ? esc_attr($avatar->time_limit) : 60 ?>" required />
                            <p class="field-description">Avatar chat duration in minutes</p>
                        </div>

                    </div>
                    
                    <!-- Row 7: Chat Window Pages (Full Width) -->
                    <div class="form-grid" style="grid-template-columns: repeat(3, 1fr);">
                        <?php if ($avatar_vendor === 'tavus'): ?>
                            <div class="form-field">
                                <label>
                                    Video Enable
                                    <span class="tooltip-wrapper">
                                        <span class="tooltip-icon">?</span>
                                        <span class="tooltip-content">Enable video streaming for the avatar</span>
                                    </span>
                                </label>
                                <div class="radio-group">
                                    <label class="radio-option">
                                        <input type="radio" name="video_enable" id="video_enable_yes" value="1" 
                                            <?php echo ($avatar && $avatar->video_enable == 1) ? 'checked' : ''; ?>>
                                        <span>Yes</span>
                                    </label>
                                    <label class="radio-option">
                                        <input type="radio" name="video_enable" id="video_enable_no" value="0" 
                                            <?php echo (!$avatar || $avatar->video_enable == 0) ? 'checked' : ''; ?>>
                                        <span>No</span>
                                    </label>
                                </div>
                            </div>
                        <?php endif; ?>

                        <?php if ($avatar_vendor === 'heygen'): ?>
                            <div class="form-field voice-emotion-row">
                                <label for="voice_emotion" style="margin-bottom: 8px;">
                                    Voice Emotion
                                    <span class="tooltip-wrapper">
                                        <span class="tooltip-icon">?</span>
                                        <span class="tooltip-content">Select the emotional tone for the avatar's voice</span>
                                    </span>
                                </label>
                                <select name="voice_emotion" id="voice_emotion" style="width: 160px; height: 52px;">
                                    <option value="excited" <?php echo $avatar && $avatar->voice_emotion == 'excited' ? 'selected' : ''; ?>>Excited</option>
                                    <option value="serious" <?php echo $avatar && $avatar->voice_emotion == 'serious' ? 'selected' : ''; ?>>Serious</option>
                                    <option value="friendly" <?php echo $avatar && $avatar->voice_emotion == 'friendly' ? 'selected' : ''; ?>>Friendly</option>
                                    <option value="soothing" <?php echo $avatar && $avatar->voice_emotion == 'soothing' ? 'selected' : ''; ?>>Soothing</option>
                                    <option value="broadcaster" <?php echo $avatar && $avatar->voice_emotion == 'broadcaster' ? 'selected' : ''; ?>>Broadcaster</option>
                                </select>
                            </div>
                        <?php endif; ?>

                        <div class="form-grid single-column">
                            <div class="form-field">
                                <label for="chat_window_pages">
                                    Chat Window Pages
                                    <span class="tooltip-wrapper">
                                        <span class="tooltip-icon">?</span>
                                        <span class="tooltip-content">Select pages where chat widget will appear</span>
                                    </span>
                                </label>
                                <?php $pages = $avatar && $avatar->pages ? json_decode($avatar->pages, true) : []; ?>
                                <select name="pages[]" id="chat_window_pages" class="select2 full-width" multiple="multiple" data-placeholder="Select pages for chat widget...">
                                    <option value=""></option>
                                    <?php
                                    foreach ($all_pages as $val) {
                                        $selected = is_array($pages) && in_array($val->ID, $pages) ? 'selected="selected"' : '';
                                        echo '<option value="' . esc_attr($val->ID) . '" ' . esc_attr($selected) . '>' . esc_html($val->post_title) . '</option>';
                                    }
                                    ?>
                                </select>
                                <p class="field-description">Select pages where the avatar chat should appear</p>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div class="form-divider"></div>
                <div class="container">
                    <div class="boxed">
                        <h2>Custom RAG & API Settings</h2>
                        <!-- Tooltip for the section -->
                        <div class="tooltip" style="font-size: 13px; color: #666;">
                            <span style="font-weight: bold;">Advanced API Settings:</span> Configure custom RAG (Retrieval-Augmented Generation) endpoints and API integrations. LiveKit enables real-time audio/video streaming. Deepgram API key is required for browser compatibility.
                        </div>
                        <table class="form-table">
                            <tr>
                                <th>Enable LiveKit</th>
                                <td>
                                    <div class="toggle-wrapper">
                                        <input type="checkbox" name="livekit_enable" value="1" id="livekit_enable" 
                                            <?php echo $avatar && $avatar->livekit_enable ? 'checked' : ''; ?> />
                                        <label for="livekit_enable" class="toggle-label">Activate LiveKit integration</label>
                                    </div>
                                </td>
                            </tr>

                            <!-- Combined Row - Hidden when LiveKit is disabled -->
                            <tr id="api-settings-row" style="<?php echo ($avatar && !$avatar->livekit_enable) ? 'display: none;' : ''; ?>">
                                <th colspan="2">
                                    <div style="display: flex; gap: 20px; width: 100%;">
                                        <!-- RAG API URL -->
                                        <div style="flex: 1;">
                                            <label id="rag_label"><strong>Custom RAG API URL</strong></label><br>
                                            <small>Leave blank to use default knowledge base</small>
                                            <input type="url" name="RAG_API_URL" id="RAG_API_URL"
                                                value="<?php echo $avatar && $avatar->RAG_API_URL ? esc_attr($avatar->RAG_API_URL) : ''; ?>"
                                                placeholder="https://api.example.com/rag"
                                                style="width: 100%; margin-top: 12px;">
                                        </div>

                                        <!-- Deepgram Key -->
                                        <div style="flex: 1;">
                                            <label id="deepgram_label"><strong>Deepgram API Key</strong></label><br>
                                            <small>Required for cross-browser compatibility</small>
                                            <input type="text" name="deepgramKEY" id="deepgramKEY"
                                                value="<?php echo $avatar && $avatar->deepgramKEY ? esc_attr($avatar->deepgramKEY) : ''; ?>"
                                                placeholder="Enter your Deepgram API key"
                                                style="width: 100%; margin-top: 12px;">
                                        </div>
                                    </div>
                                </th>
                            </tr>

                            <!-- Headers Section - Hidden when LiveKit is disabled -->
                            <tr id="headers-section" style="<?php echo ($avatar && !$avatar->livekit_enable) ? 'display: none;' : ''; ?>">
                                <th colspan="2">
                                    <div class="headers-wrapper">
                                        <div class="headers-header">
                                            <label><strong><i class="dashicons dashicons-admin-generic" style="vertical-align: middle;"></i> Custom API Headers</strong></label>
                                            <span class="headers-info">
                                                <small>Headers to include with RAG API requests</small>
                                                <span class="tooltip-icon" title="Add authentication, content-type, or other custom headers that your RAG API requires">?</span>
                                            </span>
                                        </div>
                                        
                                        <div id="headers-container" class="headers-container">
                                            <?php
                                            // Decode existing headers or use empty array
                                            $headers = $avatar && $avatar->headers ? json_decode($avatar->headers, true) : [];
                                            if (empty($headers)) {
                                                // Add one empty row by default
                                                $headers = [['key' => '', 'value' => '']];
                                            }
                                            
                                            foreach ($headers as $index => $header):
                                            ?>
                                            <div class="header-row" data-index="<?php echo esc_attr($index); ?>">
                                                <div class="header-inputs">
                                                    <div class="header-input-group">
                                                        <span class="header-label">Key</span>
                                                        <input type="text" 
                                                            name="headers[<?php echo esc_attr($index); ?>][key]" 
                                                            placeholder="e.g., Authorization, X-API-Key, Content-Type"
                                                            value="<?php echo esc_attr($header['key'] ?? ''); ?>"
                                                            class="header-key">
                                                    </div>
                                                    <div class="header-input-group">
                                                        <span class="header-label">Value</span>
                                                        <input type="text" 
                                                            name="headers[<?php echo esc_attr($index); ?>][value]" 
                                                            placeholder="e.g., Bearer token_here, application/json"
                                                            value="<?php echo esc_attr($header['value'] ?? ''); ?>"
                                                            class="header-value">
                                                    </div>
                                                </div>
                                                <button type="button" class="button button-secondary remove-header" title="Remove this header">
                                                    <span class="dashicons dashicons-trash"></span>
                                                </button>
                                            </div>
                                            <?php endforeach; ?>
                                        </div>
                                        
                                        <div class="headers-footer">
                                            <button type="button" id="add-header" class="button button-primary">
                                                <span class="dashicons dashicons-plus-alt"></span> Add Header
                                            </button>
                                            <span class="headers-count" id="headers-count"><?php echo count($headers); ?> header(s) configured</span>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                        </table>
                    </div>
                    <div class="form-divider"></div>                
                        <div class="boxed">
                            <h2>Disclaimer</h2>
                            <!-- Tooltip for the section -->
                            <div class="tooltip" style="font-size: 13px; color: #666;">
                                <span style="font-weight: bold;">Info:</span> Configure a disclaimer that users must accept before interacting with the avatar. This is useful for compliance, terms of service, or privacy notices.
                            </div>
                            <table class="form-table">
                                <tr>
                                    <th>Enable Disclaimer</th>
                                    <td>
                                        <div class="toggle-wrapper">
                                            <input type="checkbox" name="disclaimer_enable" value="1" id="disclaimer_enable" 
                                                <?php echo $avatar && $avatar->disclaimer_enable ? 'checked' : ''; ?> 
                                                onchange="toggleDisclaimerFields(this.checked)" />
                                            <label for="disclaimer_enable" class="toggle-label">Show disclaimer to users</label>
                                        </div>
                                    </td>
                                </tr>

                                <!-- New Combined Row - Wrapped in a container with ID for toggling -->
                                <tr id="disclaimer_fields_row" style="<?php echo (!$avatar || !$avatar->disclaimer_enable) ? 'display: none;' : ''; ?>">
                                    <th colspan="2">
                                        <div style="display: flex; gap: 30px;">

                                            <!-- Heading -->
                                            <div style="flex: 1;">
                                                <label><strong>Heading*</strong></label><br>
                                                <input type="text" name="disclaimer_title" id="disclaimer_title"
                                                    value="<?php echo $avatar && $avatar->disclaimer_title ? esc_attr($avatar->disclaimer_title) : ''; ?>"
                                                    placeholder="e.g., Terms & Conditions"
                                                    style="width: 100%; margin-top: 5px;"
                                                    <?php echo ($avatar && $avatar->disclaimer_enable) ? 'required' : ''; ?>>
                                                <div id="disclaimer_title_error" style="color: red; font-size: 12px; display: none;">Heading is required when disclaimer is enabled.</div>
                                            </div>

                                            <!-- Disclaimer Content -->
                                            <div style="flex: 1;">
                                                <label><strong>Disclaimer Content*</strong></label><br>
                                                <div class="editor-wrapper" style="margin-top: 5px;">
                                                    <?php
                                                    $disclaimer_content = $avatar && $avatar->disclaimer ? $avatar->disclaimer : '';
                                                    $editor_id = 'disclaimer_editor';
                                                    $settings = array(
                                                        'textarea_name' => 'disclaimer',
                                                        'textarea_rows' => 10,
                                                        'media_buttons' => true,
                                                        'teeny' => false,
                                                        'quicktags' => true,
                                                        'wpautop' => true,
                                                        'editor_class' => ($avatar && $avatar->disclaimer_enable) ? 'required-editor' : ''
                                                    );
                                                    wp_editor($disclaimer_content, $editor_id, $settings);
                                                    ?>
                                                    <div id="disclaimer_content_error" style="color: red; font-size: 12px; display: none;">Content is required when disclaimer is enabled.</div>
                                                </div>
                                            </div>

                                        </div>
                                    </th>
                                </tr>

                            </table>
                        </div>

                    <div class="form-divider"></div>                
                    <div class="boxed">
                        <h2>User Form</h2>
                        <table class="form-table">
                            <tr>
                                <th>Enable User Form</th>
                                <td>
                                    <div class="toggle-wrapper">
                                        <input type="checkbox" name="user_form_enable" value="1" id="user_form_enable" 
                                            <?php echo $avatar && $avatar->user_form_enable ? 'checked' : ''; ?> 
                                            onchange="toggleFormSelection(this)" />
                                        <label for="user_form_enable" class="toggle-label">Collect user information before session</label>
                                    </div>
                                </td>
                            </tr>
                            <tr id="form_selection_row" style="display: <?php echo $avatar && $avatar->user_form_enable ? 'table-row' : 'none'; ?>;">
                                <th><label for="selected_form_id">Select Form</label></th>
                                <td>
                                    <select name="selected_form_id" id="selected_form_id" class="regular-text" 
                                        <?php echo $avatar && $avatar->user_form_enable ? 'required' : ''; ?>>
                                        <option value="0">-- Select a form --</option>
                                        <?php
                                        $form_builder = Avatar_Form_Builder::get_instance();
                                        $forms = $form_builder->get_all_forms();
                                        $selected_form_id = isset($avatar->selected_form_id) ? $avatar->selected_form_id : 0;

                                        foreach ($forms as $form) {
                                            echo '<option value="' . esc_attr($form->id) . '" '
                                                . selected($selected_form_id, $form->id, false) . '>'
                                                . esc_html($form->title) . ' (ID: ' . intval($form->id) . ')' . '</option>';
                                        }
                                        ?>
                                    </select>

                                    <p class="description">Select a form to show before the session starts</p>
                                    <p class="description">
                                        <a href="<?php echo esc_url(admin_url('admin.php?page=avatar-form-builder')); ?>" target="_blank">
                                            Manage forms in Form Builder →
                                        </a>
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <div class="form-divider"></div>
                    
                    <div class="boxed">
                        <h2>Video Instructions <span class="section-badge">(Optional)</span></h2>
                        <!-- Tooltip for the section -->
                        <div class="tooltip" style="font-size: 13px; color: #666;">
                            <span style="font-weight: bold;">Video Instructions:</span> Add instructional content to help users interact with your avatar. You can include video links, step-by-step guides, or usage tips. Enable the "Skip Video Instruction" option if you want to skip the instruction video.
                        </div>
                        <table class="form-table">
                            <!-- Row 1: Enable Video Instruction -->
                            <tr>
                                <th>Enable Video Instruction</th>
                                <td>
                                    <div class="toggle-wrapper">
                                        <input type="checkbox" name="instruction_enable" value="1" id="instruction_enable" 
                                            <?php echo $avatar && $avatar->instruction_enable ? 'checked' : ''; ?> 
                                            onchange="toggleInstructionFields(this.checked)" />
                                        <label for="instruction_enable" class="toggle-label">Show instructions to users</label>
                                    </div>
                                </td>
                            </tr>

                            <!-- Row 2: Skip Video Instruction - Hidden by default -->
                            <tr id="skip_instruction_row" style="<?php echo (!$avatar || !$avatar->instruction_enable) ? 'display: none;' : ''; ?>">
                                <th>Skip Video Instruction</th>
                                <td>
                                    <div class="toggle-wrapper">
                                        <input type="checkbox" name="skip_instruction_video" value="1" id="skip_instruction_video" 
                                            <?php echo $avatar && $avatar->skip_instruction_video ? 'checked' : ''; ?> />
                                        <label for="skip_instruction_video" class="toggle-label">Skip instruction video</label>
                                    </div>
                                </td>
                            </tr>

                            <!-- Row 3: Heading + Instruction Content - Hidden by default -->
                            <tr id="instruction_fields_row" style="<?php echo (!$avatar || !$avatar->instruction_enable) ? 'display: none;' : ''; ?>">
                                <th colspan="2">
                                    <div style="display: flex; gap: 30px;">

                                        <!-- Heading -->
                                        <div style="flex: 1;">
                                            <label><strong>Heading</strong></label><br>
                                            <input type="text" name="instruction_title" id="instruction_title"
                                                value="<?php echo $avatar && $avatar->instruction_title ? esc_attr($avatar->instruction_title) : ''; ?>" 
                                                placeholder="e.g., How to Use This Avatar"
                                                style="width: 100%; margin-top: 12px;"
                                                <?php echo ($avatar && $avatar->instruction_enable) ? 'required' : ''; ?>>
                                            <div id="instruction_title_error" style="color: red; font-size: 12px; display: none;">Heading is required when video instructions are enabled.</div>
                                        </div>

                                        <!-- Instruction Content -->
                                        <div style="flex: 1;">
                                            <label><strong>Instruction Content</strong></label><br>
                                            <div class="editor-wrapper" style="margin-top: 12px;">
                                                <?php
                                                $instruction_content = $avatar && $avatar->instruction ? wp_kses_post(wp_unslash($avatar->instruction)) : '';
                                                // $instruction_content = $avatar && $avatar->instruction ? $avatar->instruction : '';
                                                $editor_id = 'instruction_editor';
                                                $settings = array(
                                                    'textarea_name' => 'instruction',
                                                    'textarea_rows' => 10,
                                                    'media_buttons' => true,
                                                    'teeny' => false,
                                                    'quicktags' => true,
                                                    'wpautop' => true,
                                                    'editor_class' => ($avatar && $avatar->instruction_enable) ? 'required-editor' : ''
                                                );
                                                wp_editor($instruction_content, $editor_id, $settings);
                                                ?>
                                                <div id="instruction_content_error" style="color: red; font-size: 12px; display: none;">Content is required when video instructions are enabled.</div>
                                            </div>
                                        </div>

                                    </div>
                                </th>
                            </tr>

                        </table>
                    </div>

                    <div class="form-divider"></div>                
                    <div class="boxed mb-20">
                        <h2 style="display: flex; align-items: center; gap: 8px;">
                            Opening Texts / Welcome Messages
                        </h2><span>Customize the first message users see/listen when the session begins.</span>

                        <?php
                        $welcome_message = $avatar && $avatar->welcome_message ? json_decode($avatar->welcome_message, true) : [];
                        ?>
                        <div class="avatar_studio-tabs">
                            <div class="avatar_studio-tab-buttons">
                                <button type="button" class="tab-btn active" data-tab="en">🇬🇧 English</button>
                                <button type="button" class="tab-btn" data-tab="es">🇪🇸 Spanish</button>
                                <button type="button" class="tab-btn" data-tab="fr">🇫🇷 French</button>
                                <button type="button" class="tab-btn" data-tab="de">🇩🇪 German</button>
                            </div>

                            <div id="avatar_studio-tab-en" class="avatar_studio-tab-content active">
                                <label for="welcome_message_en"><strong>Welcome Message (En)</strong></label><br>
                                <input type="text" id="welcome_message_en" class="regular-text full-width"
                                    name="welcome_message[en]" value="<?php echo esc_attr($welcome_message['en'] ?? ''); ?>" placeholder="Hello! How can I assist you today?" />
                            </div>

                            <div id="avatar_studio-tab-es" class="avatar_studio-tab-content">
                                <label for="welcome_message_es"><strong>Welcome Message (Es)</strong></label><br>
                                <input type="text" id="welcome_message_es" class="regular-text full-width"
                                    name="welcome_message[es]" value="<?php echo esc_attr($welcome_message['es'] ?? ''); ?>" placeholder="¡Hola! ¿Cómo puedo ayudarte hoy?" />
                            </div>

                            <div id="avatar_studio-tab-fr" class="avatar_studio-tab-content">
                                <label for="welcome_message_fr"><strong>Welcome Message (Fr)</strong></label><br>
                                <input type="text" id="welcome_message_fr" class="regular-text full-width"
                                    name="welcome_message[fr]" value="<?php echo esc_attr($welcome_message['fr'] ?? ''); ?>" placeholder="Bonjour! Comment puis-je vous aider aujourd'hui?" />
                            </div>
                            <div id="avatar_studio-tab-de" class="avatar_studio-tab-content">
                                <label for="welcome_message_de"><strong>Welcome Message (De)</strong></label><br>
                                <input type="text" id="welcome_message_de" class="regular-text full-width"
                                    name="welcome_message[de]" value="<?php echo esc_attr($welcome_message['de'] ?? ''); ?>" placeholder="Hallo! Wie kann ich Ihnen heute helfen?" />
                            </div>
                        </div>
                    </div>

                    <!-- Add this after the Opening Texts / Welcome Messages section -->
                    <div class="form-divider"></div>                
                    <div class="boxed mb-20">
                        <h2 style="display: flex; align-items: center; gap: 8px;">
                            Manage Flash Notifications
                        </h2>
                        <span>Custom flash notifications that appear during the chat session at specified times.</span>
                        
                        <?php
                        $toast_messages = $avatar && $avatar->toast_messages ? json_decode($avatar->toast_messages, true) : [];
                        ?>
                        
                        <div id="toast-messages-wrapper" class="toast-messages-wrapper" style="margin-top: 20px;">
                            <div class="toast-messages-header">
                                <label><strong><i class="dashicons dashicons-megaphone" style="vertical-align: middle;"></i> Flash Messages Configuration</strong></label>
                                <span class="toast-messages-info">
                                    <small>Messages will appear as notifications during the chat session</small>
                                    <span class="tooltip-icon" title="Add messages that will pop up as toast notifications at specific times during the session">?</span>
                                </span>
                            </div>
                            
                            <div id="toast-messages-container" class="toast-messages-container">
                                <?php
                                if (empty($toast_messages)) {
                                    // Add one empty row by default
                                    $toast_messages = [['message' => '', 'type' => '', 'time' => '']];
                                }
                                
                                foreach ($toast_messages as $index => $toast):
                                ?>
                                <div class="toast-message-row" data-index="<?php echo esc_attr($index); ?>">
                                    <div class="toast-message-inputs">
                                        <div class="toast-input-group message-group">
                                            <span class="toast-label">Message</span>
                                            <input type="text" 
                                                name="toast_messages[<?php echo esc_attr($index); ?>][message]" 
                                                placeholder="Enter your message here..."
                                                value="<?php echo esc_attr($toast['message'] ?? ''); ?>"
                                                class="toast-message">
                                        </div>
                                        
                                        <div class="toast-input-group type-group">
                                            <span class="toast-label">Type</span>
                                            <select name="toast_messages[<?php echo esc_attr($index); ?>][type]" class="toast-type">
                                                <option value="" <?php echo empty($toast['type'] ?? '') ? 'selected' : ''; ?>>Select Type</option>
                                                <option value="success" <?php echo ($toast['type'] ?? '') == 'success' ? 'selected' : ''; ?>>Success</option>
                                                <option value="error" <?php echo ($toast['type'] ?? '') == 'error' ? 'selected' : ''; ?>>Error</option>
                                                <option value="warn" <?php echo ($toast['type'] ?? '') == 'warn' ? 'selected' : ''; ?>>Warning</option>
                                                <option value="info" <?php echo ($toast['type'] ?? '') == 'info' ? 'selected' : ''; ?>>Info</option>
                                            </select>
                                        </div>
                                        
                                        <div class="toast-input-group time-group">
                                            <span class="toast-label">Time (seconds)</span>
                                            <div class="time-input-wrapper">
                                                <input type="number" 
                                                    name="toast_messages[<?php echo esc_attr($index); ?>][time]" 
                                                    placeholder="Sec"
                                                    min="1"
                                                    value="<?php echo esc_attr($toast['time'] ?? ''); ?>"
                                                    class="toast-time">
                                            </div>
                                            <div class="toast-time-validation" style="display: none; color: #dc3545; font-size: 12px; margin-top: 4px;"></div>
                                        </div>
                                    </div>
                                    <button style="margin-top: 24px;" type="button" class="button button-secondary remove-toast-message" title="Remove this toast message">
                                        <span class="dashicons dashicons-trash"></span>
                                    </button>
                                </div>
                                <?php endforeach; ?>
                            </div>
                            
                            <div class="toast-messages-footer">
                                <button type="button" id="add-toast-message" class="button button-primary">
                                    <span class="dashicons dashicons-plus-alt"></span> Add Flash Message
                                </button>
                                <span class="toast-messages-count" id="toast-messages-count"><?php echo count($toast_messages); ?> message(s) configured</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="design-preview" class="col col-5 sm-col-10" style="display: flex;">


                <div class="boxed mb-20">

                <h2>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                            <line x1="8" y1="21" x2="16" y2="21"/>
                            <line x1="12" y1="17" x2="12" y2="21"/>
                        </svg>
                        Design Preview
                    </h2>
                    <?php
                    $styles = $avatar && $avatar->styles ? json_decode($avatar->styles, true) : [];
                    $switchButtonStyle = [];
                    $transcriptButtonStyle = [];
                    $fullscreenButtonStyle = [];
                    $closeButtonStyle = [];
                    $chatBoxStyle = $thumbnailStyle = $headingStyle = $chatStartButtonStyle = $chatEndButtonStyle = $micButtonStyle = $cameraButtonStyle = [];
                    foreach ($styles as $key => $style) {
                        if ($key == 'chatBox') {
                            $chatBoxStyle = $style;
                        } else if ($key == 'thumbnail') {
                            $thumbnailStyle = $style;
                        } else if ($key == 'heading') {
                            $headingStyle = $style;
                        } else if ($key == 'chat-start-button') {
                            $chatStartButtonStyle = $style;
                        } else if ($key == 'switch-button') {
                            $switchButtonStyle = $style;
                        } else if ($key == 'chat-end-button') {
                            $chatEndButtonStyle = $style;
                        } else if ($key == 'mic-button') {
                            $micButtonStyle = $style;
                        } else if ($key == 'transcript-button') {
                            $transcriptButtonStyle = $style;
                        } else if ($key == 'camera-button') {
                            $cameraButtonStyle = $style;
                        } else if ($key == 'fullscreen-button') {
                            $fullscreenButtonStyle = $style;
                        } else if ($key == 'close-button') {
                            $closeButtonStyle = $style;
                        }
                    }
                    ?>
                    <div id="chatBox-style">
                        <div class="avatar_studio-tabs">
                            <div class="avatar_studio-tab-buttons">
                                <button type="button" class="tab-btn active" data-tab="chatBox">Chat Box</button>
                                <button type="button" class="tab-btn " data-tab="thumbnail">Thumbnail</button>
                                <button type="button" class="tab-btn " data-tab="heading">Heading</button>
                                <button type="button" class="tab-btn " data-tab="buttons">Buttons</button>
                            </div>


                            <div id="avatar_studio-tab-chatBox" class="avatar_studio-tab-content active">
                                <div class="row chatBox">
                                    <div class="col col-4">
                                        <div class="style-wrapper">
                                            <label>Width:</label>
                                            <div class="input-controls">
                                                <input type="text" name="styles[chatBox][width]"
                                                    class="width-input width "
                                                    value="<?php echo (isset($chatBoxStyle['width'])) ? esc_attr($chatBoxStyle['width']) : 550; ?>" />

                                                <span class="clear-btn"
                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                             </div>
                                        </div>

                                        <div class="style-wrapper">
                                            <label>Height:</label>
                                            <div class="input-controls">
                                                <input type="text" name="styles[chatBox][height]"
                                                    class="height-input height "
                                                    value="<?php echo isset($chatBoxStyle['height']) ? esc_attr($chatBoxStyle['height']) : ''; ?>" />

                                                <span class="clear-btn"
                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                            </div>
                                        </div>

                                        <div class="style-wrapper">
                                            <label>Background:</label>
                                            <div class="input-controls">
                                                <div class="input-with-clear">
                                                    <input type="text" name="styles[chatBox][background]"
                                                        id="heading-background"
                                                        class="background gradient-color-picker"
                                                        data-alpha-enabled="true"
                                                        value="<?php echo isset($chatBoxStyle['background']) ? esc_attr($chatBoxStyle['background']) : ''; ?>"
                                                        placeholder="" />
                                                    <span class="clear-btn"
                                                        onclick="clearLCColorPicker(this)">&#x2715;</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class=" style-wrapper">
                                            <label>Font Color:</label>
                                            <div class="input-controls">
                                                <input type="text" name="styles[chatBox][color]" id="heading-color"
                                                    class="color color-picker"
                                                    value="<?php echo isset($chatBoxStyle['color']) ? esc_attr($chatBoxStyle['color']) : '#FFFFFF'; ?>" />
                                            </div>
                                        </div>




                                        <div class="style-wrapper">
                                            <label>Position:</label>
                                            <div class="input-controls">
                                                <?php $position = (isset($chatBoxStyle['position'])) ? $chatBoxStyle['position'] : 'absolute'; ?>
                                                <select name="styles[chatBox][position]" id="heading-position"
                                                    class="position-select position">
                                                    <option value="relative" <?php echo $position == 'relative' ? 'selected="selected"' : ''; ?>>
                                                        Relative</option>
                                                    <option value="absolute" <?php echo $position == 'absolute' ? 'selected="selected"' : ''; ?>>
                                                        Absolute</option>
                                                    <option value="fixed" <?php echo $position == 'fixed' ? 'selected="selected"' : ''; ?>>
                                                        Fixed</option>
                                                    <option value="sticky" <?php echo $position == 'sticky' ? 'selected="selected"' : ''; ?>>
                                                        Sticky</option>
                                                </select>
                                            </div>
                                        </div>


                                    </div>

                                    <div class="col ">

                                        <div class="style-wrapper">
                                            <label>Border :</label>
                                            <div class="row gap-0">
                                                <!-- Width -->
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[chatBox][border][width]"
                                                            id="heading-border-width" class="border-input border-width"
                                                            value="<?php echo isset($chatBoxStyle['border']['width']) ? esc_attr($chatBoxStyle['border']['width']) : '1'; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>

                                                <!-- Style -->
                                                <div class="col">
                                                    <select name="styles[chatBox][border][style]"
                                                        id="heading-border-style" class="border-style">
                                                        <?php
                                                        $styles = ['none', 'solid', 'dashed', 'dotted', 'double'];
                                                        $selected = isset($chatBoxStyle['border']['style']) ? $chatBoxStyle['border']['style'] : 'solid';
                                                        foreach ($styles as $style) {
                                                            echo '<option value="' . esc_attr($style) . '"' . selected($selected, $style, false) . '>' . esc_html($style) . '</option>';
                                                        }
                                                        ?>
                                                    </select>
                                                </div>

                                                <!-- Color -->
                                                <div class="col">
                                                    <input type="color" name="styles[chatBox][border][color]"
                                                        id="heading-border-color" class="border-color"
                                                        value="<?php echo isset($chatBoxStyle['border']['color']) ? esc_attr($chatBoxStyle['border']['color']) : '#000000'; ?>" />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="style-wrapper">
                                            <label>Border Radius (Top Right Bottom Left):</label>
                                            <div class="row gap-0">
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[chatBox][border-radius][top]"
                                                            class="border-radius-input border-radius-top"
                                                            value="<?php echo isset($chatBoxStyle['border-radius']['top']) ? esc_attr($chatBoxStyle['border-radius']['top']) : ''; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[chatBox][border-radius][right]"
                                                            class="border-radius-input border-radius-right"
                                                            value="<?php echo isset($chatBoxStyle['border-radius']['right']) ? esc_attr($chatBoxStyle['border-radius']['right']) : ''; ?>" />

                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[chatBox][border-radius][bottom]"
                                                            class="border-radius-input border-radius-bottom"
                                                            value="<?php echo isset($chatBoxStyle['border-radius']['bottom']) ? esc_attr($chatBoxStyle['border-radius']['bottom']) : ''; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[chatBox][border-radius][left]"
                                                            class="border-radius-input border-radius-left"
                                                            value="<?php echo isset($chatBoxStyle['border-radius']['left']) ? esc_attr($chatBoxStyle['border-radius']['left']) : ''; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="style-wrapper">
                                            <label>Padding (Top Right Bottom Left):</label>
                                            <div class="row gap-0">
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[chatBox][padding][top]"
                                                            id="heading-padding-top" class="padding-input padding-top"
                                                            value="<?php echo isset($chatBoxStyle['padding']['top']) ? esc_attr($chatBoxStyle['padding']['top']) : ''; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[chatBox][padding][right]"
                                                            id="heading-padding-right"
                                                            class="padding-input padding-right"
                                                            value="<?php echo isset($chatBoxStyle['padding']['right']) ? esc_attr($chatBoxStyle['padding']['right']) : ''; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[chatBox][padding][bottom]"
                                                            id="heading-padding-bottom"
                                                            class="padding-input padding-bottom"
                                                            value="<?php echo isset($chatBoxStyle['padding']['bottom']) ? esc_attr($chatBoxStyle['padding']['bottom']) : ''; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[chatBox][padding][left]"
                                                            id="heading-padding-left" class="padding-input padding-left"
                                                            value="<?php echo isset($chatBoxStyle['padding']['left']) ? esc_attr($chatBoxStyle['padding']['left']) : ''; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>


                            <div id="avatar_studio-tab-thumbnail" class="avatar_studio-tab-content  ">
                                <div class="active_thumbnail-row">

                                    <div class="style-wrapper">
                                        <label for="active_thumbnail">Active Thumbnail</label>
                                        <div class="input-controls">
                                            <select name="active_thumbnail" id="active_thumbnail" class=" ">
                                                <option value="mini" <?php echo $avatar && $avatar->active_thumbnail == 'mini' ? 'selected="selected"' : ''; ?>>
                                                    Mini </option>
                                                <option value="medium" <?php echo $avatar && $avatar->active_thumbnail == 'medium' ? 'selected="selected"' : ''; ?>>
                                                    Medium </option>
                                                <option value="large" <?php echo $avatar && $avatar->active_thumbnail == 'large' ? 'selected="selected"' : ''; ?>>
                                                    Large </option>
                                            </select>
                                        </div>
                                    </div>

                                </div>
                                <div class="row thumbnail">
                                    <div class="col col-5">
                                        <strong>Mini Thumbnail</strong>
                                        <hr>

                                        <div class="image-uploader-wrap">
                                            <img class="image-preview"
                                                src="<?php echo $avatar && $avatar->thumbnail_mini ? esc_attr($avatar->thumbnail_mini) : '' ?>"
                                                style="max-width: 200px; display: none;" />
                                            <div class="row gap-0">
                                                <input type="text" name="thumbnail_mini" id="thumbnail_mini"
                                                    class="regular-text image-url"
                                                    value="<?php echo $avatar && $avatar->thumbnail_mini ? esc_attr($avatar->thumbnail_mini) : '' ?>" />
                                                <button type="button" class="button upload-image-btn"
                                                    title="Upload Image">
                                                    <span class="dashicons dashicons-upload"></span>
                                                </button>
                                                <button type="button" class="button remove-image-btn " title="Remove"
                                                    style="display: none;">
                                                    <span class="dashicons dashicons-no-alt"></span>
                                                </button>
                                            </div>
                                        </div>
                                        <hr>
                                        <div class="row">
                                            <div class="style-wrapper">
                                                <label>Width:</label>
                                                <div class="input-controls">
                                                    <input type="text" name="styles[thumbnail][mini][width]"
                                                        class="width-input width "
                                                        value="<?php echo isset($thumbnailStyle['mini']['width']) ? esc_attr($thumbnailStyle['mini']['width']) : 80; ?>" />
                                                    <span class="clear-btn"
                                                        onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                </div>
                                            </div>

                                            <div class="style-wrapper">
                                                <label>Height:</label>
                                                <div class="input-controls">
                                                    <input type="text" name="styles[thumbnail][mini][height]"
                                                        class="height-input height "
                                                        value="<?php echo isset($thumbnailStyle['mini']['height']) ? esc_attr($thumbnailStyle['mini']['height']) : ''; ?>" />

                                                    <span class="clear-btn"
                                                        onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div class="col col-5">
                                        <strong>Medium Thumbnail</strong>

                                        <hr>

                                        <div class="image-uploader-wrap">
                                            <img class="image-preview"
                                                src="<?php echo $avatar && $avatar->thumbnail_medium ? esc_attr($avatar->thumbnail_medium) : '' ?>"
                                                style="max-width: 200px; display: none;" />
                                            <div class="row gap-0">
                                                <input type="text" name="thumbnail_medium" id="thumbnail_medium"
                                                    class="regular-text image-url"
                                                    value="<?php echo $avatar && $avatar->thumbnail_medium ? esc_attr($avatar->thumbnail_medium) : '' ?>" />
                                                <button type="button" class="button upload-image-btn"
                                                    title="Upload Image">
                                                    <span class="dashicons dashicons-upload"></span>
                                                </button>
                                                <button type="button" class="button remove-image-btn " title="Remove"
                                                    style="display: none;">
                                                    <span class="dashicons dashicons-no-alt"></span>
                                                </button>
                                            </div>
                                        </div>
                                        <hr>
                                        <div class="row">
                                            <div class="style-wrapper">
                                                <label>Width:</label>
                                                <div class="input-controls">
                                                    <input type="text" name="styles[thumbnail][medium][width]"
                                                        class="width-input width "
                                                        value="<?php echo isset($thumbnailStyle['medium']['width']) ? esc_attr($thumbnailStyle['medium']['width']) : 150; ?>" />
                                                    <span class="clear-btn"
                                                        onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                </div>
                                            </div>

                                            <div class="style-wrapper">
                                                <label>Height:</label>
                                                <div class="input-controls">
                                                    <input type="text" name="styles[thumbnail][medium][height]"
                                                        class="height-input height "
                                                        value="<?php echo isset($thumbnailStyle['medium']['height']) ? esc_attr($thumbnailStyle['medium']['height']) : ''; ?>" />

                                                    <span class="clear-btn"
                                                        onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                </div>
                                            </div>

                                        </div>

                                        <strong>Large Thumbnail</strong>
                                        <hr>
                                        <div class="image-uploader-wrap">
                                            <img class="image-preview"
                                                src="<?php echo $avatar && $avatar->thumbnail_large ? esc_attr($avatar->thumbnail_large) : '' ?>"
                                                style="max-width: 200px; display: none;" />
                                            <div class="row gap-0">
                                                <input type="text" name="thumbnail_large" id="thumbnail_large"
                                                    class="regular-text image-url"
                                                    value="<?php echo $avatar && $avatar->thumbnail_large ? esc_attr($avatar->thumbnail_large) : '' ?>" />
                                                <button type="button" class="button upload-image-btn"
                                                    title="Upload Image">
                                                    <span class="dashicons dashicons-upload"></span>
                                                </button>
                                                <button type="button" class="button remove-image-btn " title="Remove"
                                                    style="display: none;">
                                                    <span class="dashicons dashicons-no-alt"></span>
                                                </button>
                                            </div>
                                        </div>
                                        <hr>
                                        <div class="row">
                                            <div class="style-wrapper">
                                                <label>Width:</label>
                                                <div class="input-controls">
                                                    <input type="text" name="styles[thumbnail][large][width]"
                                                        class="width-input width "
                                                        value="<?php echo isset($thumbnailStyle['large']['width']) ? esc_attr($thumbnailStyle['large']['width']) : 200; ?>" />
                                                    <span class="clear-btn"
                                                        onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                </div>
                                            </div>

                                            <div class="style-wrapper">
                                                <label>Height:</label>
                                                <div class="input-controls">
                                                    <input type="text" name="styles[thumbnail][large][height]"
                                                        class="height-input height "
                                                        value="<?php echo isset($thumbnailStyle['large']['height']) ? esc_attr($thumbnailStyle['large']['height']) : ''; ?>" />

                                                    <span class="clear-btn"
                                                        onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div id="avatar_studio-tab-heading" class="avatar_studio-tab-content  ">
                                <div class="row heading">
                                    <div class="col col-5">
                                        <div class="style-wrapper">
                                            <label>Background:</label>
                                            <div class="input-controls">
                                                <div class="input-with-clear">
                                                   <input type="text" name="styles[heading][background]"
                                                        id="heading-background"
                                                        class="background gradient-color-picker"
                                                        data-alpha-enabled="true"
                                                        value="<?php echo isset($headingStyle['background']) ? esc_attr($headingStyle['background']) : ''; ?>"
                                                        placeholder="" />
                                                    <span class="clear-btn"
                                                        onclick="clearLCColorPicker(this)">&#x2715;</span>
                                                </div>
                                            </div>

                                        </div>
                                        <div class=" style-wrapper">
                                            <label>Font Color:</label>
                                            <div class="input-controls">
                                                <input type="text" name="styles[heading][color]" id="heading-color"
                                                    class="color color-picker"
                                                    value="<?php echo isset($headingStyle['color']) ? esc_attr($headingStyle['color']) : '#FFFFFF'; ?>" />
                                            </div>
                                        </div>




                                        <div class="style-wrapper">
                                            <label>Position:</label>
                                            <div class="input-controls">
                                                <?php $position = (isset($headingStyle['position'])) ? $headingStyle['position'] : 'absolute'; ?>
                                                <select name="styles[heading][position]" id="heading-position"
                                                    class="position-select position">
                                                    <option value="relative" <?php echo $position == 'relative' ? 'selected="selected"' : ''; ?>>
                                                        Relative</option>
                                                    <option value="absolute" <?php echo $position == 'absolute' ? 'selected="selected"' : ''; ?>>
                                                        Absolute</option>
                                                    <option value="fixed" <?php echo $position == 'fixed' ? 'selected="selected"' : ''; ?>>
                                                        Fixed</option>
                                                    <option value="sticky" <?php echo $position == 'sticky' ? 'selected="selected"' : ''; ?>>
                                                        Sticky</option>
                                                </select>
                                            </div>
                                        </div>


                                    </div>

                                    <div class="col col-5">
                                        <div class="style-wrapper">
                                            <label>Border :</label>
                                            <div class="row gap-0">
                                                <!-- Width -->
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[heading][border][width]"
                                                            id="heading-border-width" class="border-input border-width"
                                                            value="<?php echo isset($headingStyle['border']['width']) ? esc_attr($headingStyle['border']['width']) : '1'; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>

                                                <!-- Style -->
                                                <div class="col">
                                                    <select name="styles[heading][border][style]"
                                                        id="heading-border-style" class="border-style">
                                                        <?php
                                                        $styles = ['none', 'solid', 'dashed', 'dotted', 'double'];
                                                        $selected = isset($headingStyle['border']['style']) ? $headingStyle['border']['style'] : 'solid';
                                                        foreach ($styles as $style) {
                                                            echo '<option value="' . esc_attr($style) . '"' . selected($selected, $style, false) . '>' . esc_html($style) . '</option>';
                                                        }
                                                        ?>
                                                    </select>
                                                </div>

                                                <!-- Color -->
                                                <div class="col">
                                                    <input type="color" name="styles[heading][border][color]"
                                                        id="heading-border-color" class="border-color"
                                                        value="<?php echo isset($headingStyle['border']['color']) ? esc_attr($headingStyle['border']['color']) : '#000000'; ?>" />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="style-wrapper">
                                            <label>Border Radius (Top Right Bottom Left):</label>
                                            <div class="row gap-0">
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[heading][border-radius][top]"
                                                            class="border-radius-input border-radius-top"
                                                            value="<?php echo isset($headingStyle['border-radius']['top']) ? esc_attr($headingStyle['border-radius']['top']) : ''; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[heading][border-radius][right]"
                                                            class="border-radius-input border-radius-right"
                                                            value="<?php echo isset($headingStyle['border-radius']['right']) ? esc_attr($headingStyle['border-radius']['right']) : ''; ?>" />

                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[heading][border-radius][bottom]"
                                                            class="border-radius-input border-radius-bottom"
                                                            value="<?php echo isset($headingStyle['border-radius']['bottom']) ? esc_attr($headingStyle['border-radius']['bottom']) : ''; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[heading][border-radius][left]"
                                                            class="border-radius-input border-radius-left"
                                                            value="<?php echo isset($headingStyle['border-radius']['left']) ? esc_attr($headingStyle['border-radius']['left']) : ''; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="style-wrapper">
                                            <label>Padding (Top Right Bottom Left):</label>
                                            <div class="row gap-0">
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[heading][padding][top]"
                                                            id="heading-padding-top" class="padding-input padding-top"
                                                            value="<?php echo isset($headingStyle['padding']['top']) ? esc_attr($headingStyle['padding']['top']) : ''; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[heading][padding][right]"
                                                            id="heading-padding-right"
                                                            class="padding-input padding-right"
                                                            value="<?php echo isset($headingStyle['padding']['right']) ? esc_attr($headingStyle['padding']['right']) : ''; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[heading][padding][bottom]"
                                                            id="heading-padding-bottom"
                                                            class="padding-input padding-bottom"
                                                            value="<?php echo isset($headingStyle['padding']['bottom']) ? esc_attr($headingStyle['padding']['bottom']) : ''; ?>" />
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[heading][padding][left]"
                                                            id="heading-padding-left" class="padding-input padding-left"
                                                            value="<?php echo isset($headingStyle['padding']['left']) ? esc_attr($headingStyle['padding']['left']) : ''; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="style-wrapper">
                                            <label>Text Align:</label>
                                            <div class="input-controls">
                                                <?php $textAlign = (isset($headingStyle['text-align'])) ? $headingStyle['text-align'] : 'left'; ?>
                                                <select name="styles[heading][text-align]" id="heading-text-align"
                                                    class="text-align-select text-align">
                                                    <option value="left" <?php echo $textAlign == 'left' ? 'selected="selected"' : ''; ?>>
                                                        Left</option>
                                                    <option value="center" <?php echo $textAlign == 'center' ? 'selected="selected"' : ''; ?>>Center</option>
                                                    <option value="right" <?php echo $textAlign == 'right' ? 'selected="selected"' : ''; ?>>Right</option>
                                                    <option value="justify" <?php echo $textAlign == 'justify' ? 'selected="selected"' : ''; ?>>Justify</option>
                                                    <option value="start" <?php echo $textAlign == 'start' ? 'selected="selected"' : ''; ?>>Start</option>
                                                    <option value="end" <?php echo $textAlign == 'end' ? 'selected="selected"' : ''; ?>>
                                                        End</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="style-wrapper">
                                            <label>Font Size:</label>
                                            <div class="input-controls">
                                                <input type="number" min="0" name="styles[heading][font-size]"
                                                    class="font-size "
                                                    value="<?php echo isset($headingStyle['font-size']) ? esc_attr($headingStyle['font-size']) : 14; ?>" />
                                            </div>
                                        </div>

                                        <div class="style-wrapper">
                                            <label>Line height:</label>
                                            <div class="input-controls">
                                                <input type="number" min="0" name="styles[heading][line-height]"
                                                    class="line-height "
                                                    value="<?php echo isset($headingStyle['line-height']) ? esc_attr($headingStyle['line-height']) : ''; ?>" />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div id="avatar_studio-tab-buttons" class="avatar_studio-tab-content  ">
                                <!--Button Start  -->
                                <div class="avatar_studio-tabs">
                                    <div class="avatar_studio-tab-buttons">
                                        <button type="button" class="tab-btn active" data-tab="start-button">Start Button</button>
                                        <button type="button" class="tab-btn active" data-tab="switch-button" style="display: none;">Chat Mode Button</button>
                                        <button type="button" class="tab-btn" data-tab="mic-button" style="display: none;">Mic Button</button>
                                        <button type="button" class="tab-btn" data-tab="camera-button" style="display: none;">Camera Button</button>
                                        <button type="button" class="tab-btn" data-tab="end-button" style="display: none;">End Button</button>
                                        <button type="button" class="tab-btn" data-tab="transcript-button">Transcript Button</button>
                                        <button type="button" class="tab-btn" data-tab="fullscreen-button">Fullscreen Button</button>
                                        <button type="button" class="tab-btn" data-tab="close-button">Close Button</button>
                                    </div>

                                    <div id="avatar_studio-tab-start-button" class="avatar_studio-tab-content active">

                                        <div class="row chat-start-button">
                                            <div class="col col-5">
                                                <div class="style-wrapper">
                                                    <label>Button Label:</label>
                                                    <div class="input-controls">
                                                        <input type="text" name="start_button_label"
                                                            id="start_button_label" class=" "
                                                            value="<?php echo $avatar && $avatar->start_button_label ? esc_attr(stripslashes($avatar->start_button_label)) : ''; ?>" />
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Background:</label>
                                                    <div class="input-controls">
                                                        <div class="input-with-clear">
                                                            <input type="text"
                                                                name="styles[chat-start-button][background]"
                                                                class="background gradient-color-picker"
                                                                data-alpha-enabled="true"
                                                                value="<?php echo isset($chatStartButtonStyle['background']) ? esc_attr($chatStartButtonStyle['background']) : 'rgba(29, 78, 216, 0.5)'; ?>" />
                                                            <span class="clear-btn"
                                                                onclick="clearLCColorPicker(this)">&#x2715;</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Font Color:</label>
                                                    <div class="input-controls">
                                                        <input type="text" name="styles[chat-start-button][color]"
                                                            class="color color-picker"
                                                            value="<?php echo isset($chatStartButtonStyle['color']) ? esc_attr($chatStartButtonStyle['color']) : '#FFFFFF'; ?>" />
                                                    </div>
                                                </div>



                                            </div>

                                            <div class="col col-5">
                                                <div class="style-wrapper">
                                                    <label>Border :</label>
                                                    <div class="row gap-0">
                                                        <!-- Width -->
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[chat-start-button][border][width]"
                                                                    id="heading-border-width"
                                                                    class="border-input border-width"
                                                                    value="<?php echo isset($chatStartButtonStyle['border']['width']) ? esc_attr($chatStartButtonStyle['border']['width']) : '1'; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>

                                                        <!-- Style -->
                                                        <div class="col">
                                                            <select name="styles[chat-start-button][border][style]"
                                                                id="heading-border-style" class="border-style">
                                                                <?php
                                                                $styles = ['none', 'solid', 'dashed', 'dotted', 'double'];
                                                                $selected = isset($chatStartButtonStyle['border']['style']) ? $chatStartButtonStyle['border']['style'] : 'solid';
                                                                foreach ($styles as $style) {
                                                                    echo '<option value="' . esc_attr($style) . '"' . selected($selected, $style, false) . '>' . esc_html($style) . '</option>';
                                                                }
                                                                ?>
                                                            </select>
                                                        </div>
                                                                
                                                        <!-- Color -->
                                                        <div class="col">
                                                            <input type="color"
                                                                name="styles[chat-start-button][border][color]"
                                                                id="heading-border-color" class="border-color"
                                                                value="<?php echo isset($chatStartButtonStyle['border']['color']) ? esc_attr($chatStartButtonStyle['border']['color']) : '#000000'; ?>" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Border Radius (Top Right Bottom Left):</label>
                                                    <div class="row gap-0">
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[chat-start-button][border-radius][top]"
                                                                    class="border-radius-input border-radius-top"
                                                                    value="<?php echo isset($chatStartButtonStyle['border-radius']['top']) ? esc_attr($chatStartButtonStyle['border-radius']['top']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[chat-start-button][border-radius][right]"
                                                                    class="border-radius-input border-radius-right"
                                                                    value="<?php echo isset($chatStartButtonStyle['border-radius']['right']) ? esc_attr($chatStartButtonStyle['border-radius']['right']) : ''; ?>" />

                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[chat-start-button][border-radius][bottom]"
                                                                    class="border-radius-input border-radius-bottom"
                                                                    value="<?php echo isset($chatStartButtonStyle['border-radius']['bottom']) ? esc_attr($chatStartButtonStyle['border-radius']['bottom']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[chat-start-button][border-radius][left]"
                                                                    class="border-radius-input border-radius-left"
                                                                    value="<?php echo isset($chatStartButtonStyle['border-radius']['left']) ? esc_attr($chatStartButtonStyle['border-radius']['left']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Padding (Top Right Bottom Left):</label>
                                                    <div class="row gap-0">
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[chat-start-button][padding][top]"
                                                                    id="heading-padding-top"
                                                                    class="padding-input padding-top"
                                                                    value="<?php echo isset($chatStartButtonStyle['padding']['top']) ? esc_attr($chatStartButtonStyle['padding']['top']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[chat-start-button][padding][right]"
                                                                    id="heading-padding-right"
                                                                    class="padding-input padding-right"
                                                                    value="<?php echo isset($chatStartButtonStyle['padding']['right']) ? esc_attr($chatStartButtonStyle['padding']['right']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[chat-start-button][padding][bottom]"
                                                                    id="heading-padding-bottom"
                                                                    class="padding-input padding-bottom"
                                                                    value="<?php echo isset($chatStartButtonStyle['padding']['bottom']) ? esc_attr($chatStartButtonStyle['padding']['bottom']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[chat-start-button][padding][left]"
                                                                    id="heading-padding-left"
                                                                    class="padding-input padding-left"
                                                                    value="<?php echo isset($chatStartButtonStyle['padding']['left']) ? esc_attr($chatStartButtonStyle['padding']['left']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Text Align:</label>
                                                    <div class="input-controls">
                                                        <?php $textAlign = (isset($chatStartButtonStyle['text-align'])) ? $chatStartButtonStyle['text-align'] : 'left'; ?>
                                                        <select name="styles[chat-start-button][text-align]"
                                                            class="text-align-select text-align">
                                                            <option value="left" <?php echo $textAlign == 'left' ? 'selected="selected"' : ''; ?>>
                                                                Left</option>
                                                            <option value="center" <?php echo $textAlign == 'center' ? 'selected="selected"' : ''; ?>>Center</option>
                                                            <option value="right" <?php echo $textAlign == 'right' ? 'selected="selected"' : ''; ?>>Right</option>
                                                            <option value="justify" <?php echo $textAlign == 'justify' ? 'selected="selected"' : ''; ?>>Justify</option>
                                                            <option value="start" <?php echo $textAlign == 'start' ? 'selected="selected"' : ''; ?>>Start</option>
                                                            <option value="end" <?php echo $textAlign == 'end' ? 'selected="selected"' : ''; ?>>
                                                                End</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Font Size:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[chat-start-button][font-size]"
                                                            class="font-size "
                                                            value="<?php echo isset($chatStartButtonStyle['font-size']) ? esc_attr($chatStartButtonStyle['font-size']) : 14; ?>" />
                                                    </div>
                                                </div>

                                                <div class="style-wrapper">
                                                    <label>Line height:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[chat-start-button][line-height]"
                                                            class="line-height "
                                                            value="<?php echo isset($chatStartButtonStyle['line-height']) ? esc_attr($chatStartButtonStyle['line-height']) : ''; ?>" />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    <div id="avatar_studio-tab-switch-button" class="avatar_studio-tab-content">
                                        <div class="row switch-button">
                                            <div class="col col-5">
                                                <div class="style-wrapper">
                                                    <label>Background:</label>
                                                    <div class="input-controls">
                                                        <div class="input-with-clear">
                                                            <input type="text" name="styles[switch-button][background]"
                                                                class="background gradient-color-picker"
                                                                data-alpha-enabled="true"
                                                                value="<?php echo isset($switchButtonStyle['background']) ? esc_attr($switchButtonStyle['background']) : 'rgba(59, 130, 246, 0.5)'; ?>" />
                                                            <span class="clear-btn"
                                                                onclick="clearLCColorPicker(this)">&#x2715;</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Font Color:</label>
                                                    <div class="input-controls">
                                                        <input type="text" name="styles[switch-button][color]"
                                                            class="color color-picker"
                                                            value="<?php echo isset($switchButtonStyle['color']) ? esc_attr($switchButtonStyle['color']) : '#FFFFFF'; ?>" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col col-5">
                                                <div class="style-wrapper">
                                                    <label>Border :</label>
                                                    <div class="row gap-0">
                                                        <!-- Width -->
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[switch-button][border][width]"
                                                                    class="border-input border-width"
                                                                    value="<?php echo isset($switchButtonStyle['border']['width']) ? esc_attr($switchButtonStyle['border']['width']) : '1'; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>

                                                        <!-- Style -->
                                                        <div class="col">
                                                            <select name="styles[switch-button][border][style]"
                                                                class="border-style">
                                                                <?php
                                                                $styles = ['none', 'solid', 'dashed', 'dotted', 'double'];
                                                                $selected = isset($switchButtonStyle['border']['style']) ? $switchButtonStyle['border']['style'] : 'solid';
                                                                foreach ($styles as $style) {
                                                                    echo '<option value="' . esc_attr($style) . '"' . selected($selected, $style, false) . '>' . esc_html($style) . '</option>';
                                                                }
                                                                ?>
                                                            </select>
                                                        </div>

                                                        <!-- Color -->
                                                        <div class="col">
                                                            <input type="color"
                                                                name="styles[switch-button][border][color]"
                                                                class="border-color"
                                                                value="<?php echo isset($switchButtonStyle['border']['color']) ? esc_attr($switchButtonStyle['border']['color']) : '#000000'; ?>" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Border Radius (Top Right Bottom Left):</label>
                                                    <div class="row gap-0">
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[switch-button][border-radius][top]"
                                                                    class="border-radius-input border-radius-top"
                                                                    value="<?php echo isset($switchButtonStyle['border-radius']['top']) ? esc_attr($switchButtonStyle['border-radius']['top']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[switch-button][border-radius][right]"
                                                                    class="border-radius-input border-radius-right"
                                                                    value="<?php echo isset($switchButtonStyle['border-radius']['right']) ? esc_attr($switchButtonStyle['border-radius']['right']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[switch-button][border-radius][bottom]"
                                                                    class="border-radius-input border-radius-bottom"
                                                                    value="<?php echo isset($switchButtonStyle['border-radius']['bottom']) ? esc_attr($switchButtonStyle['border-radius']['bottom']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[switch-button][border-radius][left]"
                                                                    class="border-radius-input border-radius-left"
                                                                    value="<?php echo isset($switchButtonStyle['border-radius']['left']) ? esc_attr($switchButtonStyle['border-radius']['left']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Padding (Top Right Bottom Left):</label>
                                                    <div class="row gap-0">
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[switch-button][padding][top]"
                                                                    class="padding-input padding-top"
                                                                    value="<?php echo isset($switchButtonStyle['padding']['top']) ? esc_attr($switchButtonStyle['padding']['top']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[switch-button][padding][right]"
                                                                    class="padding-input padding-right"
                                                                    value="<?php echo isset($switchButtonStyle['padding']['right']) ? esc_attr($switchButtonStyle['padding']['right']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[switch-button][padding][bottom]"
                                                                    class="padding-input padding-bottom"
                                                                    value="<?php echo isset($switchButtonStyle['padding']['bottom']) ? esc_attr($switchButtonStyle['padding']['bottom']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[switch-button][padding][left]"
                                                                    class="padding-input padding-left"
                                                                    value="<?php echo isset($switchButtonStyle['padding']['left']) ? esc_attr($switchButtonStyle['padding']['left']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Text Align:</label>
                                                    <div class="input-controls">
                                                        <?php 
                                                        $textAlign = isset($switchButtonStyle['text-align']) ? $switchButtonStyle['text-align'] : 'center';
                                                        ?>
                                                        <select name="styles[switch-button][text-align]"
                                                            class="text-align-select text-align">
                                                            <option value="left" <?php echo $textAlign == 'left' ? 'selected="selected"' : ''; ?>>Left</option>
                                                            <option value="center" <?php echo $textAlign == 'center' ? 'selected="selected"' : ''; ?>>Center</option>
                                                            <option value="right" <?php echo $textAlign == 'right' ? 'selected="selected"' : ''; ?>>Right</option>
                                                            <option value="justify" <?php echo $textAlign == 'justify' ? 'selected="selected"' : ''; ?>>Justify</option>
                                                            <option value="start" <?php echo $textAlign == 'start' ? 'selected="selected"' : ''; ?>>Start</option>
                                                            <option value="end" <?php echo $textAlign == 'end' ? 'selected="selected"' : ''; ?>>End</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Font Size:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[switch-button][font-size]"
                                                            class="font-size"
                                                            value="<?php echo isset($switchButtonStyle['font-size']) ? esc_attr($switchButtonStyle['font-size']) : 14; ?>" />
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Line height:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[switch-button][line-height]"
                                                            class="line-height"
                                                            value="<?php echo isset($switchButtonStyle['line-height']) ? esc_attr($switchButtonStyle['line-height']) : ''; ?>" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div id="avatar_studio-tab-mic-button" class="avatar_studio-tab-content  ">

                                        <div class="row mic-button">
                                            <div class="col col-5">
                                                <div class="style-wrapper">
                                                    <label>Background:</label>
                                                    <div class="input-controls">

                                                        <div class="input-with-clear">
                                                            <input type="text" name="styles[mic-button][background]"
                                                                class="background gradient-color-picker"
                                                                data-alpha-enabled="true"
                                                                value="<?php echo isset($micButtonStyle['background']) ? esc_attr($micButtonStyle['background']) : '#EF4444'; ?>" />
                                                            <span class="clear-btn"
                                                                onclick="clearLCColorPicker(this)">&#x2715;</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Font Color:</label>
                                                    <div class="input-controls">
                                                        <input type="text" name="styles[mic-button][color]"
                                                            class="color color-picker"
                                                            value="<?php echo isset($micButtonStyle['color']) ? esc_attr($micButtonStyle['color']) : '#FFFFFF'; ?>" />
                                                    </div>
                                                </div>


                                            </div>

                                            <div class="col col-5">

                                                <div class="style-wrapper">
                                                    <label>Border :</label>
                                                    <div class="row gap-0">
                                                        <!-- Width -->
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[mic-button][border][width]"
                                                                    id="heading-border-width"
                                                                    class="border-input border-width"
                                                                    value="<?php echo isset($micButtonStyle['border']['width']) ? esc_attr($micButtonStyle['border']['width']) : '1'; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>

                                                        <!-- Style -->
                                                        <div class="col">
                                                            <select name="styles[mic-button][border][style]"
                                                                id="heading-border-style" class="border-style">
                                                                <?php
                                                                $styles = ['none', 'solid', 'dashed', 'dotted', 'double'];
                                                                $selected = isset($micButtonStyle['border']['style']) ? $micButtonStyle['border']['style'] : 'solid';
                                                                foreach ($styles as $style) {
                                                                    echo '<option value="' . esc_attr($style) . '"' . selected($selected, $style, false) . '>' . esc_html($style) . '</option>';
                                                                }
                                                                ?>
                                                            </select>
                                                        </div>

                                                        <!-- Color -->
                                                        <div class="col">
                                                            <input type="color" name="styles[mic-button][border][color]"
                                                                id="heading-border-color" class="border-color"
                                                                value="<?php echo isset($micButtonStyle['border']['color']) ? esc_attr($micButtonStyle['border']['color']) : '#000000'; ?>" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Border Radius (Top Right Bottom Left):</label>
                                                    <div class="row gap-0">
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[mic-button][border-radius][top]"
                                                                    class="border-radius-input border-radius-top"
                                                                    value="<?php echo isset($micButtonStyle['border-radius']['top']) ? esc_attr($micButtonStyle['border-radius']['top']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[mic-button][border-radius][right]"
                                                                    class="border-radius-input border-radius-right"
                                                                    value="<?php echo isset($micButtonStyle['border-radius']['right']) ? esc_attr($micButtonStyle['border-radius']['right']) : ''; ?>" />

                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[mic-button][border-radius][bottom]"
                                                                    class="border-radius-input border-radius-bottom"
                                                                    value="<?php echo isset($micButtonStyle['border-radius']['bottom']) ? esc_attr($micButtonStyle['border-radius']['bottom']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[mic-button][border-radius][left]"
                                                                    class="border-radius-input border-radius-left"
                                                                    value="<?php echo isset($micButtonStyle['border-radius']['left']) ? esc_attr($micButtonStyle['border-radius']['left']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Padding (Top Right Bottom Left):</label>
                                                    <div class="row gap-0">
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[mic-button][padding][top]"
                                                                    id="heading-padding-top"
                                                                    class="padding-input padding-top"
                                                                    value="<?php echo isset($micButtonStyle['padding']['top']) ? esc_attr($micButtonStyle['padding']['top']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[mic-button][padding][right]"
                                                                    id="heading-padding-right"
                                                                    class="padding-input padding-right"
                                                                    value="<?php echo isset($micButtonStyle['padding']['right']) ? esc_attr($micButtonStyle['padding']['right']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[mic-button][padding][bottom]"
                                                                    id="heading-padding-bottom"
                                                                    class="padding-input padding-bottom"
                                                                    value="<?php echo isset($micButtonStyle['padding']['bottom']) ? esc_attr($micButtonStyle['padding']['bottom']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[mic-button][padding][left]"
                                                                    id="heading-padding-left"
                                                                    class="padding-input padding-left"
                                                                    value="<?php echo isset($micButtonStyle['padding']['left']) ? esc_attr($micButtonStyle['padding']['left']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="style-wrapper">
                                                    <label>Text Align:</label>
                                                    <div class="input-controls">
                                                        <?php $textAlign = isset($micButtonStyle['text-align']) ? $micButtonStyle['text-align'] : 'left'; ?>
                                                        <select name="styles[mic-button][text-align]"
                                                            class="text-align-select text-align">
                                                            <option value="left" <?php selected($textAlign, 'left'); ?>>Left</option>
                                                            <option value="center" <?php selected($textAlign, 'center'); ?>>Center</option>
                                                            <option value="right" <?php selected($textAlign, 'right'); ?>>Right</option>
                                                            <option value="justify" <?php selected($textAlign, 'justify'); ?>>Justify</option>
                                                            <option value="start" <?php selected($textAlign, 'start'); ?>>Start</option>
                                                            <option value="end" <?php selected($textAlign, 'end'); ?>>End</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Font Size:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[mic-button][font-size]" class="font-size "
                                                            value="<?php echo isset($micButtonStyle['font-size']) ? esc_attr($micButtonStyle['font-size']) : 14; ?>" />
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Line height:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[mic-button][line-height]" class="line-height "
                                                            value="<?php echo isset($micButtonStyle['line-height']) ? esc_attr($micButtonStyle['line-height']) : ''; ?>" />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>

                                    <div id="avatar_studio-tab-camera-button" class="avatar_studio-tab-content">
                                        <div class="row camera-button">
                                            <div class="col col-5">
                                                <div class="style-wrapper">
                                                    <label>Background:</label>
                                                    <div class="input-controls">
                                                        <div class="input-with-clear">
                                                            <input type="text" name="styles[camera-button][background]"
                                                                class="background gradient-color-picker"
                                                                data-alpha-enabled="true"
                                                                value="<?php echo isset($cameraButtonStyle['background']) ? esc_attr($cameraButtonStyle['background']) : 'rgba(239, 68, 68, 0.5)'; ?>" />
                                                            <span class="clear-btn"
                                                                onclick="clearLCColorPicker(this)">&#x2715;</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Font Color:</label>
                                                    <div class="input-controls">
                                                        <input type="text" name="styles[camera-button][color]"
                                                            class="color color-picker"
                                                            value="<?php echo isset($cameraButtonStyle['color']) ? esc_attr($cameraButtonStyle['color']) : '#FFFFFF'; ?>" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col col-5">
                                                <div class="style-wrapper">
                                                    <label>Border :</label>
                                                    <div class="row gap-0">
                                                        <!-- Width -->
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[camera-button][border][width]"
                                                                    class="border-input border-width"
                                                                    value="<?php echo isset($cameraButtonStyle['border']['width']) ? esc_attr($cameraButtonStyle['border']['width']) : '1'; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>

                                                        <!-- Style -->
                                                        <div class="col">
                                                            <select name="styles[camera-button][border][style]"
                                                                class="border-style">
                                                                <?php
                                                                $styles = ['none', 'solid', 'dashed', 'dotted', 'double'];
                                                                $selected = isset($cameraButtonStyle['border']['style']) ? $cameraButtonStyle['border']['style'] : 'solid';
                                                                foreach ($styles as $style) {
                                                                    echo '<option value="' . esc_attr($style) . '"' . selected($selected, $style, false) . '>' . esc_html($style) . '</option>';
                                                                }
                                                                ?>
                                                            </select>
                                                        </div>

                                                        <!-- Color -->
                                                        <div class="col">
                                                            <input type="color"
                                                                name="styles[camera-button][border][color]"
                                                                class="border-color"
                                                                value="<?php echo isset($cameraButtonStyle['border']['color']) ? esc_attr($cameraButtonStyle['border']['color']) : '#000000'; ?>" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Border Radius (Top Right Bottom Left):</label>
                                                    <div class="row gap-0">
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[camera-button][border-radius][top]"
                                                                    class="border-radius-input border-radius-top"
                                                                    value="<?php echo isset($cameraButtonStyle['border-radius']['top']) ? esc_attr($cameraButtonStyle['border-radius']['top']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[camera-button][border-radius][right]"
                                                                    class="border-radius-input border-radius-right"
                                                                    value="<?php echo isset($cameraButtonStyle['border-radius']['right']) ? esc_attr($cameraButtonStyle['border-radius']['right']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[camera-button][border-radius][bottom]"
                                                                    class="border-radius-input border-radius-bottom"
                                                                    value="<?php echo isset($cameraButtonStyle['border-radius']['bottom']) ? esc_attr($cameraButtonStyle['border-radius']['bottom']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[camera-button][border-radius][left]"
                                                                    class="border-radius-input border-radius-left"
                                                                    value="<?php echo isset($cameraButtonStyle['border-radius']['left']) ? esc_attr($cameraButtonStyle['border-radius']['left']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Padding (Top Right Bottom Left):</label>
                                                    <div class="row gap-0">
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[camera-button][padding][top]"
                                                                    class="padding-input padding-top"
                                                                    value="<?php echo isset($cameraButtonStyle['padding']['top']) ? esc_attr($cameraButtonStyle['padding']['top']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[camera-button][padding][right]"
                                                                    class="padding-input padding-right"
                                                                    value="<?php echo isset($cameraButtonStyle['padding']['right']) ? esc_attr($cameraButtonStyle['padding']['right']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[camera-button][padding][bottom]"
                                                                    class="padding-input padding-bottom"
                                                                    value="<?php echo isset($cameraButtonStyle['padding']['bottom']) ? esc_attr($cameraButtonStyle['padding']['bottom']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[camera-button][padding][left]"
                                                                    class="padding-input padding-left"
                                                                    value="<?php echo isset($cameraButtonStyle['padding']['left']) ? esc_attr($cameraButtonStyle['padding']['left']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Text Align:</label>
                                                    <div class="input-controls">
                                                        <?php 
                                                        $textAlign = isset($cameraButtonStyle['text-align']) ? $cameraButtonStyle['text-align'] : 'center';
                                                        ?>
                                                        <select name="styles[camera-button][text-align]"
                                                            class="text-align-select text-align">
                                                            <option value="left" <?php selected($textAlign, 'left'); ?>>Left</option>
                                                            <option value="center" <?php selected($textAlign, 'center'); ?>>Center</option>
                                                            <option value="right" <?php selected($textAlign, 'right'); ?>>Right</option>
                                                            <option value="justify" <?php selected($textAlign, 'justify'); ?>>Justify</option>
                                                            <option value="start" <?php selected($textAlign, 'start'); ?>>Start</option>
                                                            <option value="end" <?php selected($textAlign, 'end'); ?>>End</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Font Size:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[camera-button][font-size]"
                                                            class="font-size"
                                                            value="<?php echo isset($cameraButtonStyle['font-size']) ? esc_attr($cameraButtonStyle['font-size']) : 14; ?>" />
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Line height:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[camera-button][line-height]"
                                                            class="line-height"
                                                            value="<?php echo isset($cameraButtonStyle['line-height']) ? esc_attr($cameraButtonStyle['line-height']) : ''; ?>" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div id="avatar_studio-tab-end-button" class="avatar_studio-tab-content">
                                        <div class="row chat-end-button">
                                            <div class="col col-5">
                                                <div class="style-wrapper">
                                                    <label>Background:</label>
                                                    <div class="input-controls">
                                                        <div class="input-with-clear">
                                                            <input type="text"
                                                                name="styles[chat-end-button][background]"
                                                                class="background gradient-color-picker"
                                                                data-alpha-enabled="true"
                                                                value="<?php echo isset($chatEndButtonStyle['background']) ? esc_attr($chatEndButtonStyle['background']) : '#1D4ED8'; ?>" />
                                                            <span class="clear-btn"
                                                                onclick="clearLCColorPicker(this)">&#x2715;</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Font Color:</label>
                                                    <div class="input-controls">
                                                        <input type="text" name="styles[chat-end-button][color]"
                                                            class="color color-picker"
                                                            value="<?php echo isset($chatEndButtonStyle['color']) ? esc_attr($chatEndButtonStyle['color']) : '#FFFFFF'; ?>" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col col-5">
                                                <div class="style-wrapper">
                                                    <label>Border :</label>
                                                    <div class="row gap-0">
                                                        <!-- Width -->
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[chat-end-button][border][width]"
                                                                    id="heading-border-width"
                                                                    class="border-input border-width"
                                                                    value="<?php echo isset($chatEndButtonStyle['border']['width']) ? esc_attr($chatEndButtonStyle['border']['width']) : '1'; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>

                                                        <!-- Style -->
                                                        <div class="col">
                                                            <select name="styles[chat-end-button][border][style]"
                                                                id="heading-border-style" class="border-style">
                                                                <?php
                                                                $styles = ['none', 'solid', 'dashed', 'dotted', 'double'];
                                                                $selected = isset($chatEndButtonStyle['border']['style']) ? $chatEndButtonStyle['border']['style'] : 'solid';
                                                                foreach ($styles as $style) {
                                                                    echo '<option value="' . esc_attr($style) . '"' . selected($selected, $style, false) . '>' . esc_html($style) . '</option>';
                                                                }
                                                                ?>
                                                            </select>
                                                        </div>

                                                        <!-- Color -->
                                                        <div class="col">
                                                            <input type="color"
                                                                name="styles[chat-end-button][border][color]"
                                                                id="heading-border-color" class="border-color"
                                                                value="<?php echo isset($chatEndButtonStyle['border']['color']) ? esc_attr($chatEndButtonStyle['border']['color']) : '#000000'; ?>" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Border Radius (Top Right Bottom Left):</label>
                                                    <div class="row gap-0">
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[chat-end-button][border-radius][top]"
                                                                    class="border-radius-input border-radius-top"
                                                                    value="<?php echo isset($chatEndButtonStyle['border-radius']['top']) ? esc_attr($chatEndButtonStyle['border-radius']['top']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[chat-end-button][border-radius][right]"
                                                                    class="border-radius-input border-radius-right"
                                                                    value="<?php echo isset($chatEndButtonStyle['border-radius']['right']) ? esc_attr($chatEndButtonStyle['border-radius']['right']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[chat-end-button][border-radius][bottom]"
                                                                    class="border-radius-input border-radius-bottom"
                                                                    value="<?php echo isset($chatEndButtonStyle['border-radius']['bottom']) ? esc_attr($chatEndButtonStyle['border-radius']['bottom']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[chat-end-button][border-radius][left]"
                                                                    class="border-radius-input border-radius-left"
                                                                    value="<?php echo isset($chatEndButtonStyle['border-radius']['left']) ? esc_attr($chatEndButtonStyle['border-radius']['left']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Padding (Top Right Bottom Left):</label>
                                                    <div class="row gap-0">
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[chat-end-button][padding][top]"
                                                                    id="heading-padding-top"
                                                                    class="padding-input padding-top"
                                                                    value="<?php echo isset($chatEndButtonStyle['padding']['top']) ? esc_attr($chatEndButtonStyle['padding']['top']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[chat-end-button][padding][right]"
                                                                    id="heading-padding-right"
                                                                    class="padding-input padding-right"
                                                                    value="<?php echo isset($chatEndButtonStyle['padding']['right']) ? esc_attr($chatEndButtonStyle['padding']['right']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[chat-end-button][padding][bottom]"
                                                                    id="heading-padding-bottom"
                                                                    class="padding-input padding-bottom"
                                                                    value="<?php echo isset($chatEndButtonStyle['padding']['bottom']) ? esc_attr($chatEndButtonStyle['padding']['bottom']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[chat-end-button][padding][left]"
                                                                    id="heading-padding-left"
                                                                    class="padding-input padding-left"
                                                                    value="<?php echo isset($chatEndButtonStyle['padding']['left']) ? esc_attr($chatEndButtonStyle['padding']['left']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Text Align:</label>
                                                    <div class="input-controls">
                                                        <?php $textAlign = isset($chatEndButtonStyle['text-align']) ? $chatEndButtonStyle['text-align'] : 'left'; ?>
                                                        <select name="styles[chat-end-button][text-align]"
                                                            class="text-align-select text-align">
                                                            <option value="left" <?php selected($textAlign, 'left'); ?>>Left</option>
                                                            <option value="center" <?php selected($textAlign, 'center'); ?>>Center</option>
                                                            <option value="right" <?php selected($textAlign, 'right'); ?>>Right</option>
                                                            <option value="justify" <?php selected($textAlign, 'justify'); ?>>Justify</option>
                                                            <option value="start" <?php selected($textAlign, 'start'); ?>>Start</option>
                                                            <option value="end" <?php selected($textAlign, 'end'); ?>>End</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Font Size:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[chat-end-button][font-size]" class="font-size"
                                                            value="<?php echo isset($chatEndButtonStyle['font-size']) ? esc_attr($chatEndButtonStyle['font-size']) : 14; ?>" />
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Line height:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[chat-end-button][line-height]"
                                                            class="line-height"
                                                            value="<?php echo isset($chatEndButtonStyle['line-height']) ? esc_attr($chatEndButtonStyle['line-height']) : ''; ?>" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div id="avatar_studio-tab-transcript-button" class="avatar_studio-tab-content">
                                        <div class="row transcript-button">
                                            <div class="col col-5">
                                                <div class="style-wrapper">
                                                    <label>Background:</label>
                                                    <div class="input-controls">
                                                        <div class="input-with-clear">
                                                            <input type="text" name="styles[transcript-button][background]"
                                                                class="background gradient-color-picker"
                                                                data-alpha-enabled="true"
                                                                value="<?php echo isset($transcriptButtonStyle['background']) ? esc_attr($transcriptButtonStyle['background']) : 'rgba(139, 92, 246, 0.5)'; ?>" />
                                                            <span class="clear-btn"
                                                                onclick="clearLCColorPicker(this)">&#x2715;</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Font Color:</label>
                                                    <div class="input-controls">
                                                        <input type="text" name="styles[transcript-button][color]"
                                                            class="color color-picker"
                                                            value="<?php echo isset($transcriptButtonStyle['color']) ? esc_attr($transcriptButtonStyle['color']) : '#FFFFFF'; ?>" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col col-5">
                                                <div class="style-wrapper">
                                                    <label>Border :</label>
                                                    <div class="row gap-0">
                                                        <!-- Width -->
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[transcript-button][border][width]"
                                                                    class="border-input border-width"
                                                                    value="<?php echo isset($transcriptButtonStyle['border']['width']) ? esc_attr($transcriptButtonStyle['border']['width']) : '1'; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>

                                                        <!-- Style -->
                                                        <div class="col">
                                                            <select name="styles[transcript-button][border][style]"
                                                                class="border-style">
                                                                <?php
                                                                $styles = ['none', 'solid', 'dashed', 'dotted', 'double'];
                                                                $selected = isset($transcriptButtonStyle['border']['style']) ? $transcriptButtonStyle['border']['style'] : 'solid';
                                                                foreach ($styles as $style) {
                                                                    echo '<option value="' . esc_attr($style) . '"' . selected($selected, $style, false) . '>' . esc_html($style) . '</option>';
                                                                }
                                                                ?>
                                                            </select>
                                                        </div>

                                                        <!-- Color -->
                                                        <div class="col">
                                                            <input type="color"
                                                                name="styles[transcript-button][border][color]"
                                                                class="border-color"
                                                                value="<?php echo isset($transcriptButtonStyle['border']['color']) ? esc_attr($transcriptButtonStyle['border']['color']) : '#000000'; ?>" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Border Radius:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[transcript-button][border-radius]"
                                                            class="border-radius-input"
                                                            value="<?php echo isset($transcriptButtonStyle['border-radius']) ? esc_attr($transcriptButtonStyle['border-radius']) : '8'; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Padding:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[transcript-button][padding]"
                                                            class="padding-input"
                                                            value="<?php echo isset($transcriptButtonStyle['padding']) ? esc_attr($transcriptButtonStyle['padding']) : '10'; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Font Size:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[transcript-button][font-size]"
                                                            class="font-size"
                                                            value="<?php echo isset($transcriptButtonStyle['font-size']) ? esc_attr($transcriptButtonStyle['font-size']) : '14'; ?>" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div id="avatar_studio-tab-camera-button" class="avatar_studio-tab-content">

                                        <div class="row camera-button">
                                            <div class="col col-5">
                                                <div class="style-wrapper">
                                                    <label>Background:</label>
                                                    <div class="input-controls">
                                                        <div class="input-with-clear">
                                                            <input type="text" name="styles[camera-button][background]"
                                                                class="background gradient-color-picker"
                                                                data-alpha-enabled="true"
                                                                value="<?php echo isset($cameraButtonStyle['background']) ? esc_attr($cameraButtonStyle['background']) : '#EF4444'; ?>" />
                                                            <span class="clear-btn"
                                                                onclick="clearLCColorPicker(this)">&#x2715;</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Font Color:</label>
                                                    <div class="input-controls">
                                                        <input type="text" name="styles[camera-button][color]"
                                                            class="color color-picker"
                                                            value="<?php echo isset($cameraButtonStyle['color']) ? esc_attr($cameraButtonStyle['color']) : '#FFFFFF'; ?>" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col col-5">
                                                <div class="style-wrapper">
                                                    <label>Border :</label>
                                                    <div class="row gap-0">
                                                        <!-- Width -->
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[camera-button][border][width]"
                                                                    id="heading-border-width"
                                                                    class="border-input border-width"
                                                                    value="<?php echo isset($cameraButtonStyle['border']['width']) ? esc_attr($cameraButtonStyle['border']['width']) : '1'; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>

                                                        <!-- Style -->
                                                        <div class="col">
                                                            <select name="styles[camera-button][border][style]"
                                                                id="heading-border-style" class="border-style">
                                                                <?php
                                                                $styles = ['none', 'solid', 'dashed', 'dotted', 'double'];
                                                                $selected = isset($cameraButtonStyle['border']['style']) ? $cameraButtonStyle['border']['style'] : 'solid';
                                                                foreach ($styles as $style) {
                                                                    echo '<option value="' . esc_attr($style) . '"' . selected($selected, $style, false) . '>' . esc_html($style) . '</option>';
                                                                }
                                                                ?>
                                                            </select>
                                                        </div>

                                                        <!-- Color -->
                                                        <div class="col">
                                                            <input type="color"
                                                                name="styles[camera-button][border][color]"
                                                                id="heading-border-color" class="border-color"
                                                                value="<?php echo isset($cameraButtonStyle['border']['color']) ? esc_attr($cameraButtonStyle['border']['color']) : '#000000'; ?>" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Border Radius (Top Right Bottom Left):</label>
                                                    <div class="row gap-0">
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[camera-button][border-radius][top]"
                                                                    class="border-radius-input border-radius-top"
                                                                    value="<?php echo isset($cameraButtonStyle['border-radius']['top']) ? esc_attr($cameraButtonStyle['border-radius']['top']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[camera-button][border-radius][right]"
                                                                    class="border-radius-input border-radius-right"
                                                                    value="<?php echo isset($cameraButtonStyle['border-radius']['right']) ? esc_attr($cameraButtonStyle['border-radius']['right']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[camera-button][border-radius][bottom]"
                                                                    class="border-radius-input border-radius-bottom"
                                                                    value="<?php echo isset($cameraButtonStyle['border-radius']['bottom']) ? esc_attr($cameraButtonStyle['border-radius']['bottom']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[camera-button][border-radius][left]"
                                                                    class="border-radius-input border-radius-left"
                                                                    value="<?php echo isset($cameraButtonStyle['border-radius']['left']) ? esc_attr($cameraButtonStyle['border-radius']['left']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Padding (Top Right Bottom Left):</label>
                                                    <div class="row gap-0">
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[camera-button][padding][top]"
                                                                    id="heading-padding-top"
                                                                    class="padding-input padding-top"
                                                                    value="<?php echo isset($cameraButtonStyle['padding']['top']) ? esc_attr($cameraButtonStyle['padding']['top']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[camera-button][padding][right]"
                                                                    id="heading-padding-right"
                                                                    class="padding-input padding-right"
                                                                    value="<?php echo isset($cameraButtonStyle['padding']['right']) ? esc_attr($cameraButtonStyle['padding']['right']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[camera-button][padding][bottom]"
                                                                    id="heading-padding-bottom"
                                                                    class="padding-input padding-bottom"
                                                                    value="<?php echo isset($cameraButtonStyle['padding']['bottom']) ? esc_attr($cameraButtonStyle['padding']['bottom']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[camera-button][padding][left]"
                                                                    id="heading-padding-left"
                                                                    class="padding-input padding-left"
                                                                    value="<?php echo isset($cameraButtonStyle['padding']['left']) ? esc_attr($cameraButtonStyle['padding']['left']) : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="style-wrapper">
                                                    <label>Text Align:</label>
                                                    <div class="input-controls">
                                                        <?php $textAlign = isset($cameraButtonStyle['text-align']) ? $cameraButtonStyle['text-align'] : 'left'; ?>
                                                        <select name="styles[camera-button][text-align]"
                                                            class="text-align-select text-align">
                                                            <option value="left" <?php selected($textAlign, 'left'); ?>>Left</option>
                                                            <option value="center" <?php selected($textAlign, 'center'); ?>>Center</option>
                                                            <option value="right" <?php selected($textAlign, 'right'); ?>>Right</option>
                                                            <option value="justify" <?php selected($textAlign, 'justify'); ?>>Justify</option>
                                                            <option value="start" <?php selected($textAlign, 'start'); ?>>Start</option>
                                                            <option value="end" <?php selected($textAlign, 'end'); ?>>End</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Font Size:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[camera-button][font-size]" class="font-size"
                                                            value="<?php echo isset($cameraButtonStyle['font-size']) ? esc_attr($cameraButtonStyle['font-size']) : 14; ?>" />
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Line height:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[camera-button][line-height]"
                                                            class="line-height"
                                                            value="<?php echo isset($cameraButtonStyle['line-height']) ? esc_attr($cameraButtonStyle['line-height']) : ''; ?>" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div id="avatar_studio-tab-close-button" class="avatar_studio-tab-content">
                                        <div class="row close-button">
                                            <div class="col col-5">
                                                <div class="style-wrapper">
                                                    <label>Background:</label>
                                                    <div class="input-controls">
                                                        <div class="input-with-clear">
                                                            <input type="text" name="styles[close-button][background]"
                                                                class="background gradient-color-picker"
                                                                data-alpha-enabled="true"
                                                                value="<?php echo isset($closeButtonStyle['background']) ? esc_attr($closeButtonStyle['background']) : 'rgba(220, 38, 38, 0.5)'; ?>" />
                                                            <span class="clear-btn"
                                                                onclick="clearLCColorPicker(this)">&#x2715;</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Font Color:</label>
                                                    <div class="input-controls">
                                                        <input type="text" name="styles[close-button][color]"
                                                            class="color color-picker"
                                                            value="<?php echo isset($closeButtonStyle['color']) ? esc_attr($closeButtonStyle['color']) : '#FFFFFF'; ?>" />
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Hover Background:</label>
                                                    <div class="input-controls">
                                                        <div class="input-with-clear">
                                                            <input type="text" name="styles[close-button][hover-background]"
                                                                class="background gradient-color-picker"
                                                                data-alpha-enabled="true"
                                                                value="<?php echo isset($closeButtonStyle['hover-background']) ? esc_attr($closeButtonStyle['hover-background']) : 'rgba(220, 38, 38, 0.8)'; ?>" />
                                                            <span class="clear-btn"
                                                                onclick="clearLCColorPicker(this)">&#x2715;</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col col-5">
                                                <div class="style-wrapper">
                                                    <label>Size (Width & Height):</label>
                                                    <div class="row gap-0">
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[close-button][size]"
                                                                    class="size-input"
                                                                    value="<?php echo isset($closeButtonStyle['size']) ? esc_attr($closeButtonStyle['size']) : '32'; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Border :</label>
                                                    <div class="row gap-0">
                                                        <!-- Width -->
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[close-button][border][width]"
                                                                    class="border-input border-width"
                                                                    value="<?php echo isset($closeButtonStyle['border']['width']) ? esc_attr($closeButtonStyle['border']['width']) : '1'; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>

                                                        <!-- Style -->
                                                        <div class="col">
                                                            <select name="styles[close-button][border][style]"
                                                                class="border-style">
                                                                <?php
                                                                $styles = ['none', 'solid', 'dashed', 'dotted', 'double'];
                                                                $selected = isset($closeButtonStyle['border']['style']) ? $closeButtonStyle['border']['style'] : 'solid';
                                                                foreach ($styles as $style) {
                                                                    echo '<option value="' . esc_attr($style) . '"' . selected($selected, $style, false) . '>' . esc_html($style) . '</option>';
                                                                }
                                                                ?>
                                                            </select>
                                                        </div>

                                                        <!-- Color -->
                                                        <div class="col">
                                                            <input type="color"
                                                                name="styles[close-button][border][color]"
                                                                class="border-color"
                                                                value="<?php echo isset($closeButtonStyle['border']['color']) ? esc_attr($closeButtonStyle['border']['color']) : '#000000'; ?>" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Border Radius:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[close-button][border-radius]"
                                                            class="border-radius-input"
                                                            value="<?php echo isset($closeButtonStyle['border-radius']) ? esc_attr($closeButtonStyle['border-radius']) : '50'; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Position (from top & right):</label>
                                                    <div class="row gap-0">
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[close-button][position-top]"
                                                                    class="position-input"
                                                                    placeholder="Top"
                                                                    value="<?php echo isset($closeButtonStyle['position-top']) ? esc_attr($closeButtonStyle['position-top']) : '10'; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[close-button][position-right]"
                                                                    class="position-input"
                                                                    placeholder="Right"
                                                                    value="<?php echo isset($closeButtonStyle['position-right']) ? esc_attr($closeButtonStyle['position-right']) : '10'; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Font Size (icon):</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[close-button][font-size]"
                                                            class="font-size"
                                                            value="<?php echo isset($closeButtonStyle['font-size']) ? esc_attr($closeButtonStyle['font-size']) : '16'; ?>" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div id="avatar_studio-tab-fullscreen-button" class="avatar_studio-tab-content">
                                        <div class="row fullscreen-button">
                                            <div class="col col-5">
                                                <div class="style-wrapper">
                                                    <label>Background:</label>
                                                    <div class="input-controls">
                                                        <div class="input-with-clear">
                                                            <input type="text" name="styles[fullscreen-button][background]"
                                                                class="background gradient-color-picker"
                                                                data-alpha-enabled="true"
                                                                value="<?php echo isset($fullscreenButtonStyle['background']) ? esc_attr($fullscreenButtonStyle['background']) : 'rgba(59, 130, 246, 0.5)'; ?>" />
                                                            <span class="clear-btn"
                                                                onclick="clearLCColorPicker(this)">&#x2715;</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Font Color:</label>
                                                    <div class="input-controls">
                                                        <input type="text" name="styles[fullscreen-button][color]"
                                                            class="color color-picker"
                                                            value="<?php echo isset($fullscreenButtonStyle['color']) ? esc_attr($fullscreenButtonStyle['color']) : '#FFFFFF'; ?>" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col col-5">
                                                <div class="style-wrapper">
                                                    <label>Border :</label>
                                                    <div class="row gap-0">
                                                        <!-- Width -->
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[fullscreen-button][border][width]"
                                                                    class="border-input border-width"
                                                                    value="<?php echo isset($fullscreenButtonStyle['border']['width']) ? esc_attr($fullscreenButtonStyle['border']['width']) : '0'; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>

                                                        <!-- Style -->
                                                        <div class="col">
                                                            <select name="styles[fullscreen-button][border][style]"
                                                                class="border-style">
                                                                <?php
                                                                $styles = ['none', 'solid', 'dashed', 'dotted', 'double'];
                                                                $selected = isset($fullscreenButtonStyle['border']['style']) ? $fullscreenButtonStyle['border']['style'] : 'solid';
                                                                foreach ($styles as $style) {
                                                                    echo '<option value="' . esc_attr($style) . '"' . selected($selected, $style, false) . '>' . esc_html($style) . '</option>';
                                                                }
                                                                ?>
                                                            </select>
                                                        </div>

                                                        <!-- Color -->
                                                        <div class="col">
                                                            <input type="color"
                                                                name="styles[fullscreen-button][border][color]"
                                                                class="border-color"
                                                                value="<?php echo isset($fullscreenButtonStyle['border']['color']) ? esc_attr($fullscreenButtonStyle['border']['color']) : '#000000'; ?>" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Border Radius:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[fullscreen-button][border-radius]"
                                                            class="border-radius-input"
                                                            value="<?php echo isset($fullscreenButtonStyle['border-radius']) ? esc_attr($fullscreenButtonStyle['border-radius']) : '50'; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Padding:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[fullscreen-button][padding]"
                                                            class="padding-input"
                                                            value="<?php echo isset($fullscreenButtonStyle['padding']) ? esc_attr($fullscreenButtonStyle['padding']) : '0'; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Font Size:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[fullscreen-button][font-size]"
                                                            class="font-size"
                                                            value="<?php echo isset($fullscreenButtonStyle['font-size']) ? esc_attr($fullscreenButtonStyle['font-size']) : '14'; ?>" />
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Icon Size:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[fullscreen-button][icon-size]"
                                                            class="icon-size"
                                                            value="<?php echo isset($fullscreenButtonStyle['icon-size']) ? esc_attr($fullscreenButtonStyle['icon-size']) : '16'; ?>" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="chatBox-preview-area" class="preview-area mb-20" style="margin-top: 60px;">
                    
                    <!-- Preview Mode Toggle -->
                    <div class="preview-mode-toggle">
                        <button type="button" class="preview-mode-btn active" data-mode="before">
                            Before Session
                        </button>
                        <button type="button" class="preview-mode-btn" data-mode="during">
                            During Session
                        </button>
                    </div>
                    
                    <!-- Preview Container -->
                    <div class="preview-container">
                        
                        <?php
                        global $avatar_studio_id;
                        global $livekit_enable;
                        global $avatar_vendor;
                        global $api_key;
                        global $chatBoxHeading;
                        global $video_enable;
                        $video_enable = $avatar ? $avatar->video_enable : 1;
                        global $chat_only;
                        global $avatar_id;
                        global $knowledge_id;
                        global $previewThumbnail;
                        global $previewImage;
                        global $avatar_name;
                        global $time_limit;
                        global $opening_text;
                        global $styles;
                        global $selected_form_id;
                        global $user_form_enable;
                        $chatBoxHeading = 'Chat with ' . ($avatar ? $avatar->avatar_name : 'Avatar Name') . '';
                        ?>
                        
                        <div id="chatBox" class="show preview-mode session-before">
                            <div id="chat-widget">
                                <input type="hidden" id="pageId" value="<?php echo esc_attr(get_the_ID()); ?>">
                                <input type="hidden" id="avatarStudioId" value="<?php echo esc_attr($avatar_studio_id); ?>">
                                <?php require(plugin_dir_path(__FILE__) . '../avatarContainer.php'); ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <?php
        submit_button(
            'Save',            // Button text
            'primary',         // Button class
            'submit_button',   // Name attribute
            false,             // Wrap (false = no <p> wrapper)
            array('id' => 'saveBtn') // ✅ Add your custom ID here
        );
        ?>
    </form>

</div>

<!-- <script>
    let plugin_dir_url = '<?php echo esc_url(plugin_dir_url(__FILE__)); ?>../';
    function isNumeric(value) {
        return value !== '' && value !== null && !isNaN(value) && isFinite(value);
    }

    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const avatar_studioTabs = e.target.closest('.avatar_studio-tabs');
            const tab = e.target.getAttribute('data-tab');

            avatar_studioTabs.querySelectorAll(':scope > .tab-btn').forEach(btn => btn.classList.remove('active'));

            // Hide all tab contents
            avatar_studioTabs.querySelectorAll(':scope > .avatar_studio-tab-content').forEach(content => content.classList.remove('active'));

            // Activate selected tab
            avatar_studioTabs.querySelector('#avatar_studio-tab-' + tab).classList.add('active');
            e.target.classList.add('active');
            
            // Update opening text for the selected language in preview
            const openingTexts = {
                en: document.getElementById('welcome_message_en')?.value || '',
                es: document.getElementById('welcome_message_es')?.value || '',
                fr: document.getElementById('welcome_message_fr')?.value || '',
                de: document.getElementById('welcome_message_de')?.value || ''
            };
            
            const startSessionBtn = document.getElementById('startSession');
            if (startSessionBtn) {
                const openingText = openingTexts[tab] || openingTexts.en;
                startSessionBtn.setAttribute('initial_message', openingText);
                startSessionBtn.setAttribute('opening_text', openingText);
            }
        });
    });

    function clearLCColorPicker(clearBtn) {
        const container = clearBtn.closest('.input-with-clear');
        const input = container.querySelector('input');

        const wrapper = input.closest('[data-for]');
        const preview = wrapper.querySelector('.lccp-preview');

        input.value = '';
        if (preview) {
            preview.style.background = 'transparent';
        }

        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);

        clearBtn.style.display = 'none';
    }
    function showChatBoxPreview(event) {
        if (event) {
            const container = event.target.closest('.input-controls');
            if (container) {
                const clearBtn = container.querySelector('.clear-btn');
                if (clearBtn) {
                    clearBtn.style.display = (event.target.value != '') ? 'block' : 'none';
                }
            }
        }




        const previewArea = document.getElementById('chatBox-preview-area');
        const previewImage = document.getElementById('previewImage');
        const avatarVideo = document.getElementById('avatarVideo');

        const chatBox = document.getElementById('chatBox');
        const chatBoxHeading = document.getElementById('chatBox-heading');
        const startSession = document.getElementById('startSession');
        const endSession = document.getElementById('endSession');
        const micToggler = document.getElementById('micToggler');
        const switchInteractionMode = document.getElementById('switchInteractionMode'); 
        const transcriptToggleButton = document.getElementsByClassName('transcriptToggleButton');



        const avatar_title = document.getElementById('avatar_title').value.trim();
        const preview_image = document.getElementById('preview_image').value.trim();
        if (previewImage) {
            previewImage.src = preview_image || '<?php echo esc_url($previewImage); ?>';
        }
        if (avatarVideo) {
            avatarVideo.setAttribute('poster', preview_image || '<?php echo esc_url($previewImage); ?>');
        }

        /**
         * Styles values
         */
        const chatBoxStyleEl = document.getElementById('chatBox-style');
        /**
         * Chat Box Styles
         */
        if (chatBox) {
            var chatBoxEl = chatBoxStyleEl.querySelector('.chatBox');

            var width = chatBoxEl.querySelector('.width').value.trim();
            var height = chatBoxEl.querySelector('.height').value.trim();
            var bg = chatBoxEl.querySelector('.background').value.trim();
            var borderWidth = chatBoxEl.querySelector('.border-width').value.trim();
            var borderStyle = chatBoxEl.querySelector('.border-style').value.trim();
            var borderColor = chatBoxEl.querySelector('.border-color').value.trim();

            var borderRadiusLeft = chatBoxEl.querySelector('.border-radius-left').value.trim();
            var borderRadiusTop = chatBoxEl.querySelector('.border-radius-top').value.trim();
            var borderRadiusRight = chatBoxEl.querySelector('.border-radius-right').value.trim();
            var borderRadiusBottom = chatBoxEl.querySelector('.border-radius-bottom').value.trim();

            var paddingLeft = chatBoxEl.querySelector('.padding-left').value.trim();
            var paddingTop = chatBoxEl.querySelector('.padding-top').value.trim();
            var paddingRight = chatBoxEl.querySelector('.padding-right').value.trim();
            var paddingBottom = chatBoxEl.querySelector('.padding-bottom').value.trim();

            if (width && width != '') {
                chatBox.style.setProperty("width", isNumeric(width) ? `${width}px` : (width || "550px"), "important");
            } else {
                chatBox.style.removeProperty("width");
            }
            if (height && height != '') {
                chatBox.style.setProperty("height", isNumeric(height) ? `${height}px` : (height || "360px"), "important");
            } else {
                chatBox.style.removeProperty("height");
            }
            if (bg && bg != '') {
                chatBox.style.setProperty("background", `${bg}`, "important");
            } else {
                chatBox.style.removeProperty("background");
            }
            if (borderWidth && borderWidth >= 0) {
                chatBox.style.setProperty("border", `${borderWidth || 0}px ${borderStyle || 'solid'} ${borderColor || 'transparent'}`, "important");
            } else {
                chatBox.style.removeProperty("border");
            }
            if ([borderRadiusTop, borderRadiusRight, borderRadiusBottom, borderRadiusLeft].some(p => isNumeric(p) && Number(p) >= 0)) {
                chatBox.style.setProperty("border-radius", `${borderRadiusTop || 0}px ${borderRadiusRight || 0}px ${borderRadiusBottom || 0}px ${borderRadiusLeft || 0}px`, "important");
            } else {
                chatBox.style.removeProperty("border-radius");
            }
            if ([paddingTop, paddingRight, paddingBottom, paddingLeft].some(p => isNumeric(p) && Number(p) >= 0)) {
                chatBox.style.setProperty("padding", `${paddingTop || 0}px ${paddingRight || 0}px ${paddingBottom || 0}px ${paddingLeft || 0}px`, "important");
            } else {
                chatBox.style.removeProperty("padding");
            }


        }
        /**
         * Heading Styles
         */

        if (chatBoxHeading) {
            var headingEl = chatBoxStyleEl.querySelector('.heading');
            var bg = headingEl.querySelector('.background').value.trim();
            var textColor = headingEl.querySelector('.color').value.trim();
            var position = headingEl.querySelector('.position').value.trim();
            var borderWidth = headingEl.querySelector('.border-width').value.trim();
            var borderStyle = headingEl.querySelector('.border-style').value.trim();
            var borderColor = headingEl.querySelector('.border-color').value.trim();
            var textAlign = headingEl.querySelector('.text-align').value.trim();
            var fontSize = headingEl.querySelector('.font-size').value.trim();
            var lineHeight = headingEl.querySelector('.line-height').value.trim();

            var borderRadiusLeft = headingEl.querySelector('.border-radius-left').value.trim();
            var borderRadiusTop = headingEl.querySelector('.border-radius-top').value.trim();
            var borderRadiusRight = headingEl.querySelector('.border-radius-right').value.trim();
            var borderRadiusBottom = headingEl.querySelector('.border-radius-bottom').value.trim();

            var paddingLeft = headingEl.querySelector('.padding-left').value.trim();
            var paddingTop = headingEl.querySelector('.padding-top').value.trim();
            var paddingRight = headingEl.querySelector('.padding-right').value.trim();
            var paddingBottom = headingEl.querySelector('.padding-bottom').value.trim();


            chatBoxHeading.textContent = avatar_title || '';
            chatBoxHeading.style.setProperty("position", `${position || 'relative'}`, "important");
            if (bg && bg != '') {
                chatBoxHeading.style.setProperty("background", `${bg}`, "important");
            } else {
                chatBoxHeading.style.removeProperty("background");
            }
            if (borderWidth && borderWidth >= 0) {
                chatBoxHeading.style.setProperty("border", `${borderWidth || 0}px ${borderStyle || 'solid'} ${borderColor || 'transparent'}`, "important");
            } else {
                chatBoxHeading.style.removeProperty("border");
            }
            console.log('RADIOUS', borderRadiusTop, borderRadiusRight, borderRadiusBottom, borderRadiusLeft, [borderRadiusTop, borderRadiusRight, borderRadiusBottom, borderRadiusLeft].some(p => isNumeric(p) && Number(p) >= 0));
            if ([borderRadiusTop, borderRadiusRight, borderRadiusBottom, borderRadiusLeft].some(p => isNumeric(p) && Number(p) >= 0)) {
                chatBoxHeading.style.setProperty("border-radius", `${borderRadiusTop || 0}px ${borderRadiusRight || 0}px ${borderRadiusBottom || 0}px ${borderRadiusLeft || 0}px`, "important");
            } else {
                chatBoxHeading.style.removeProperty("border-radius");
            }
            if ([paddingTop, paddingRight, paddingBottom, paddingLeft].some(p => isNumeric(p) && Number(p) >= 0)) {
                chatBoxHeading.style.setProperty("padding", `${paddingTop || 0}px ${paddingRight || 0}px ${paddingBottom || 0}px ${paddingLeft || 0}px`, "important");
            } else {
                chatBoxHeading.style.removeProperty("padding");
            }

            if (textColor && textColor != '') {
                chatBoxHeading.style.setProperty("color", `${textColor}`, "important");
            } else {
                chatBoxHeading.style.removeProperty("color");
            }
            if (textAlign && textAlign != '') {
                chatBoxHeading.style.setProperty("text-align", `${textAlign || 'left'}`, "important");
            } else {
                chatBoxHeading.style.removeProperty("text-align");
            }
            if (fontSize && fontSize != '') {
                chatBoxHeading.style.setProperty("font-size", `${fontSize || 14}px`, "important");
            } else {
                chatBoxHeading.style.removeProperty("font-size");
            }
            if (lineHeight && lineHeight != '') {
                chatBoxHeading.style.setProperty("line-height", `${lineHeight || 18}px`, "important");
            } else {
                chatBoxHeading.style.removeProperty("line-height");
            }


        }
        /**
         * Chat Start Button Styles
         */
        if (startSession) {
            var chatStartButtonEl = chatBoxStyleEl.querySelector('.chat-start-button');

            var bg = chatStartButtonEl.querySelector('.background').value.trim();
            var textColor = chatStartButtonEl.querySelector('.color').value.trim();
            var borderWidth = chatStartButtonEl.querySelector('.border-width').value.trim();
            var borderStyle = chatStartButtonEl.querySelector('.border-style').value.trim();
            var borderColor = chatStartButtonEl.querySelector('.border-color').value.trim();
            var textAlign = chatStartButtonEl.querySelector('.text-align').value.trim();
            var fontSize = chatStartButtonEl.querySelector('.font-size').value.trim();
            var lineHeight = chatStartButtonEl.querySelector('.line-height').value.trim();

            var borderRadiusLeft = chatStartButtonEl.querySelector('.border-radius-left').value.trim();
            var borderRadiusTop = chatStartButtonEl.querySelector('.border-radius-top').value.trim();
            var borderRadiusRight = chatStartButtonEl.querySelector('.border-radius-right').value.trim();
            var borderRadiusBottom = chatStartButtonEl.querySelector('.border-radius-bottom').value.trim();

            var paddingLeft = chatStartButtonEl.querySelector('.padding-left').value.trim();
            var paddingTop = chatStartButtonEl.querySelector('.padding-top').value.trim();
            var paddingRight = chatStartButtonEl.querySelector('.padding-right').value.trim();
            var paddingBottom = chatStartButtonEl.querySelector('.padding-bottom').value.trim();
            if (bg && bg != '') {
                startSession.style.setProperty("background", `${bg}`, "important");
            } else {
                startSession.style.removeProperty("background");
            }
            if (borderWidth && borderWidth >= 0) {
                startSession.style.setProperty("border", `${borderWidth || 0}px ${borderStyle || 'solid'} ${borderColor || 'transparent'}`, "important");
            } else {
                startSession.style.removeProperty("border");
            }
            if ([borderRadiusTop, borderRadiusRight, borderRadiusBottom, borderRadiusLeft].some(p => isNumeric(p) && Number(p) >= 0)) {
                startSession.style.setProperty("border-radius", `${borderRadiusTop || 0}px ${borderRadiusRight || 0}px ${borderRadiusBottom || 0}px ${borderRadiusLeft || 0}px`, "important");
            } else {
                startSession.style.removeProperty("border-radius");
            }
            if ([paddingTop, paddingRight, paddingBottom, paddingLeft].some(p => isNumeric(p) && Number(p) >= 0)) {
                startSession.style.setProperty("padding", `${paddingTop || 0}px ${paddingRight || 0}px ${paddingBottom || 0}px ${paddingLeft || 0}px`, "important");
            } else {
                startSession.style.removeProperty("padding");
            }

            if (textColor && textColor != '') {
                startSession.style.setProperty("color", `${textColor}`, "important");
            } else {
                startSession.style.removeProperty("color");
            }
            if (textAlign && textAlign != '') {
                startSession.style.setProperty("text-align", `${textAlign || 'left'}`, "important");
            } else {
                startSession.style.removeProperty("text-align");
            }
            if (fontSize && fontSize != '') {
                startSession.style.setProperty("font-size", `${fontSize || 14}px`, "important");
            } else {
                startSession.style.removeProperty("font-size");
            }
            if (lineHeight && lineHeight != '') {
                startSession.style.setProperty("line-height", `${lineHeight || 18}px`, "important");
            } else {
                startSession.style.removeProperty("line-height");
            }
        }
        
        /**
        * Switch Interaction Mode Button Styles
        */
        if (document.getElementById('switchInteractionMode')) {
            var switchButtonEl = chatBoxStyleEl.querySelector('.switch-button');
            
            if (switchButtonEl) {
                var bg = switchButtonEl.querySelector('.background')?.value.trim();
                var textColor = switchButtonEl.querySelector('.color')?.value.trim();
                var borderWidth = switchButtonEl.querySelector('.border-width')?.value.trim();
                var borderStyle = switchButtonEl.querySelector('.border-style')?.value.trim();
                var borderColor = switchButtonEl.querySelector('.border-color')?.value.trim();
                var textAlign = switchButtonEl.querySelector('.text-align')?.value.trim();
                var fontSize = switchButtonEl.querySelector('.font-size')?.value.trim();
                var lineHeight = switchButtonEl.querySelector('.line-height')?.value.trim();
                
                var borderRadiusLeft = switchButtonEl.querySelector('.border-radius-left')?.value.trim();
                var borderRadiusTop = switchButtonEl.querySelector('.border-radius-top')?.value.trim();
                var borderRadiusRight = switchButtonEl.querySelector('.border-radius-right')?.value.trim();
                var borderRadiusBottom = switchButtonEl.querySelector('.border-radius-bottom')?.value.trim();
                
                var paddingLeft = switchButtonEl.querySelector('.padding-left')?.value.trim();
                var paddingTop = switchButtonEl.querySelector('.padding-top')?.value.trim();
                var paddingRight = switchButtonEl.querySelector('.padding-right')?.value.trim();
                var paddingBottom = switchButtonEl.querySelector('.padding-bottom')?.value.trim();
                
                const switchBtn = document.getElementById('switchInteractionMode');
                
                if (bg && bg != '') {
                    switchBtn.style.setProperty("background", `${bg}`, "important");
                } else {
                    switchBtn.style.removeProperty("background");
                }
                
                if (borderWidth && borderWidth >= 0) {
                    switchBtn.style.setProperty("border", `${borderWidth || 0}px ${borderStyle || 'solid'} ${borderColor || 'transparent'}`, "important");
                } else {
                    switchBtn.style.removeProperty("border");
                }
                
                if ([borderRadiusTop, borderRadiusRight, borderRadiusBottom, borderRadiusLeft].some(p => isNumeric(p) && Number(p) >= 0)) {
                    switchBtn.style.setProperty("border-radius", `${borderRadiusTop || 0}px ${borderRadiusRight || 0}px ${borderRadiusBottom || 0}px ${borderRadiusLeft || 0}px`, "important");
                } else {
                    switchBtn.style.removeProperty("border-radius");
                }
                
                if ([paddingTop, paddingRight, paddingBottom, paddingLeft].some(p => isNumeric(p) && Number(p) >= 0)) {
                    switchBtn.style.setProperty("padding", `${paddingTop || 0}px ${paddingRight || 0}px ${paddingBottom || 0}px ${paddingLeft || 0}px`, "important");
                } else {
                    switchBtn.style.removeProperty("padding");
                }
                
                if (textColor && textColor != '') {
                    switchBtn.style.setProperty("color", `${textColor}`, "important");
                } else {
                    switchBtn.style.removeProperty("color");
                }
                
                if (textAlign && textAlign != '') {
                    switchBtn.style.setProperty("text-align", `${textAlign || 'center'}`, "important");
                } else {
                    switchBtn.style.removeProperty("text-align");
                }
                
                if (fontSize && fontSize != '') {
                    switchBtn.style.setProperty("font-size", `${fontSize || 14}px`, "important");
                } else {
                    switchBtn.style.removeProperty("font-size");
                }
                
                if (lineHeight && lineHeight != '') {
                    switchBtn.style.setProperty("line-height", `${lineHeight || 18}px`, "important");
                } else {
                    switchBtn.style.removeProperty("line-height");
                }
            }
        }

        /**
        * Camera Button Styles
        */
        if (document.getElementById('cameraToggler')) {
            var cameraButtonEl = chatBoxStyleEl.querySelector('.camera-button');
            
            if (cameraButtonEl) {
                var bg = cameraButtonEl.querySelector('.background')?.value.trim();
                var textColor = cameraButtonEl.querySelector('.color')?.value.trim();
                var borderWidth = cameraButtonEl.querySelector('.border-width')?.value.trim();
                var borderStyle = cameraButtonEl.querySelector('.border-style')?.value.trim();
                var borderColor = cameraButtonEl.querySelector('.border-color')?.value.trim();
                var textAlign = cameraButtonEl.querySelector('.text-align')?.value.trim();
                var fontSize = cameraButtonEl.querySelector('.font-size')?.value.trim();
                var lineHeight = cameraButtonEl.querySelector('.line-height')?.value.trim();
                
                var borderRadiusLeft = cameraButtonEl.querySelector('.border-radius-left')?.value.trim();
                var borderRadiusTop = cameraButtonEl.querySelector('.border-radius-top')?.value.trim();
                var borderRadiusRight = cameraButtonEl.querySelector('.border-radius-right')?.value.trim();
                var borderRadiusBottom = cameraButtonEl.querySelector('.border-radius-bottom')?.value.trim();
                
                var paddingLeft = cameraButtonEl.querySelector('.padding-left')?.value.trim();
                var paddingTop = cameraButtonEl.querySelector('.padding-top')?.value.trim();
                var paddingRight = cameraButtonEl.querySelector('.padding-right')?.value.trim();
                var paddingBottom = cameraButtonEl.querySelector('.padding-bottom')?.value.trim();
                
                const cameraBtn = document.getElementById('cameraToggler');
                
                if (bg && bg != '') {
                    cameraBtn.style.setProperty("background", `${bg}`, "important");
                } else {
                    cameraBtn.style.setProperty("background", "rgba(239, 68, 68, 0.5)", "important");
                }
                
                if (borderWidth && borderWidth >= 0) {
                    cameraBtn.style.setProperty("border", `${borderWidth || 0}px ${borderStyle || 'solid'} ${borderColor || 'transparent'}`, "important");
                } else {
                    cameraBtn.style.removeProperty("border");
                }
                
                if ([borderRadiusTop, borderRadiusRight, borderRadiusBottom, borderRadiusLeft].some(p => isNumeric(p) && Number(p) >= 0)) {
                    cameraBtn.style.setProperty("border-radius", `${borderRadiusTop || 0}px ${borderRadiusRight || 0}px ${borderRadiusBottom || 0}px ${borderRadiusLeft || 0}px`, "important");
                } else {
                    cameraBtn.style.removeProperty("border-radius");
                }
                
                if ([paddingTop, paddingRight, paddingBottom, paddingLeft].some(p => isNumeric(p) && Number(p) >= 0)) {
                    cameraBtn.style.setProperty("padding", `${paddingTop || 0}px ${paddingRight || 0}px ${paddingBottom || 0}px ${paddingLeft || 0}px`, "important");
                } else {
                    cameraBtn.style.removeProperty("padding");
                }
                
                if (textColor && textColor != '') {
                    cameraBtn.style.setProperty("color", `${textColor}`, "important");
                    // Also apply to the icon inside
                    const cameraIcon = cameraBtn.querySelector('#cameraIcon');
                    if (cameraIcon) {
                        cameraIcon.style.setProperty("color", `${textColor}`, "important");
                    }
                } else {
                    cameraBtn.style.setProperty("color", "#FFFFFF", "important");
                    const cameraIcon = cameraBtn.querySelector('#cameraIcon');
                    if (cameraIcon) {
                        cameraIcon.style.setProperty("color", "#FFFFFF", "important");
                    }
                }
                
                if (textAlign && textAlign != '') {
                    cameraBtn.style.setProperty("text-align", `${textAlign || 'center'}`, "important");
                } else {
                    cameraBtn.style.removeProperty("text-align");
                }
                
                if (fontSize && fontSize != '') {
                    cameraBtn.style.setProperty("font-size", `${fontSize || 14}px`, "important");
                    // Also apply to the icon
                    const cameraIcon = cameraBtn.querySelector('#cameraIcon');
                    if (cameraIcon) {
                        cameraIcon.style.setProperty("font-size", `${fontSize || 14}px`, "important");
                    }
                } else {
                    cameraBtn.style.removeProperty("font-size");
                }
                
                if (lineHeight && lineHeight != '') {
                    cameraBtn.style.setProperty("line-height", `${lineHeight || 18}px`, "important");
                } else {
                    cameraBtn.style.removeProperty("line-height");
                }
            }
        }

        /**
         * Chat End Button Styles
         */
        if (endSession) {
            var chatEndButtonEl = chatBoxStyleEl.querySelector('.chat-end-button');

            var bg = chatEndButtonEl.querySelector('.background').value.trim();
            var textColor = chatEndButtonEl.querySelector('.color').value.trim();
            var borderWidth = chatEndButtonEl.querySelector('.border-width').value.trim();
            var borderStyle = chatEndButtonEl.querySelector('.border-style').value.trim();
            var borderColor = chatEndButtonEl.querySelector('.border-color').value.trim();
            var textAlign = chatEndButtonEl.querySelector('.text-align').value.trim();
            var fontSize = chatEndButtonEl.querySelector('.font-size').value.trim();
            var lineHeight = chatEndButtonEl.querySelector('.line-height').value.trim();

            var borderRadiusLeft = chatEndButtonEl.querySelector('.border-radius-left').value.trim();
            var borderRadiusTop = chatEndButtonEl.querySelector('.border-radius-top').value.trim();
            var borderRadiusRight = chatEndButtonEl.querySelector('.border-radius-right').value.trim();
            var borderRadiusBottom = chatEndButtonEl.querySelector('.border-radius-bottom').value.trim();

            var paddingLeft = chatEndButtonEl.querySelector('.padding-left').value.trim();
            var paddingTop = chatEndButtonEl.querySelector('.padding-top').value.trim();
            var paddingRight = chatEndButtonEl.querySelector('.padding-right').value.trim();
            var paddingBottom = chatEndButtonEl.querySelector('.padding-bottom').value.trim();
            if (bg && bg != '') {
                endSession.style.setProperty("background", `${bg}`, "important");
            } else {
                endSession.style.removeProperty("background");
            }

            if (borderWidth && borderWidth >= 0) {
                endSession.style.setProperty("border", `${borderWidth || 0}px ${borderStyle || 'solid'} ${borderColor || 'transparent'}`, "important");
            } else {
                endSession.style.removeProperty("border");
            }
            if ([borderRadiusTop, borderRadiusRight, borderRadiusBottom, borderRadiusLeft].some(p => isNumeric(p) && Number(p) >= 0)) {
                endSession.style.setProperty("border-radius", `${borderRadiusTop || 0}px ${borderRadiusRight || 0}px ${borderRadiusBottom || 0}px ${borderRadiusLeft || 0}px`, "important");
            } else {
                endSession.style.removeProperty("border-radius");
            }
            if ([paddingTop, paddingRight, paddingBottom, paddingLeft].some(p => isNumeric(p) && Number(p) >= 0)) {
                endSession.style.setProperty("padding", `${paddingTop || 0}px ${paddingRight || 0}px ${paddingBottom || 0}px ${paddingLeft || 0}px`, "important");
            } else {
                endSession.style.removeProperty("padding");
            }
            if (textColor && textColor != '') {
                endSession.style.setProperty("color", `${textColor}`, "important");
            } else {
                endSession.style.removeProperty("color");
            }
            if (textAlign && textAlign != '') {
                endSession.style.setProperty("text-align", `${textAlign || 'left'}`, "important");
            } else {
                endSession.style.removeProperty("text-align");
            }
            if (fontSize && fontSize != '') {
                endSession.style.setProperty("font-size", `${fontSize || 14}px`, "important");
            } else {
                endSession.style.removeProperty("font-size");
            }
            if (lineHeight && lineHeight != '') {
                endSession.style.setProperty("line-height", `${lineHeight || 18}px`, "important");
            } else {
                endSession.style.removeProperty("line-height");
            }
        }

        /**
        * Transcript Toggle Button Styles - Apply to BOTH transcript buttons
        */
        const transcriptButtons = document.querySelectorAll('.transcriptToggleButton');
        if (transcriptButtons.length > 0) {
            var transcriptButtonEl = chatBoxStyleEl.querySelector('.transcript-button');
            
            if (transcriptButtonEl) {
                var bg = transcriptButtonEl.querySelector('.background')?.value.trim();
                var textColor = transcriptButtonEl.querySelector('.color')?.value.trim();
                var borderWidth = transcriptButtonEl.querySelector('.border-width')?.value.trim();
                var borderStyle = transcriptButtonEl.querySelector('.border-style')?.value.trim();
                var borderColor = transcriptButtonEl.querySelector('.border-color')?.value.trim();
                var borderRadius = transcriptButtonEl.querySelector('.border-radius-input')?.value.trim();
                var padding = transcriptButtonEl.querySelector('.padding-input')?.value.trim();
                var fontSize = transcriptButtonEl.querySelector('.font-size')?.value.trim();
                
                // Apply styles to ALL transcript buttons
                transcriptButtons.forEach(button => {
                    // Background
                    if (bg && bg != '') {
                        button.style.setProperty("background", `${bg}`, "important");
                    } else {
                        button.style.setProperty("background", "rgba(139, 92, 246, 0.5)", "important");
                    }
                    
                    // Border
                    if (borderWidth && borderWidth >= 0) {
                        button.style.setProperty("border", `${borderWidth || 1}px ${borderStyle || 'solid'} ${borderColor || '#000000'}`, "important");
                    } else {
                        button.style.setProperty("border", "1px solid #000000", "important");
                    }
                    
                    // Border radius
                    if (borderRadius && borderRadius >= 0) {
                        button.style.setProperty("border-radius", `${borderRadius}px`, "important");
                    } else {
                        button.style.setProperty("border-radius", "8px", "important");
                    }
                    
                    // Padding
                    if (padding && padding >= 0) {
                        button.style.setProperty("padding", `${padding}px`, "important");
                    } else {
                        button.style.setProperty("padding", "10px", "important");
                    }
                    
                    // Font color - apply to button AND icons
                    if (textColor && textColor != '') {
                        button.style.setProperty("color", `${textColor}`, "important");
                        // Apply to child icons too
                        const icons = button.querySelectorAll('i');
                        icons.forEach(icon => {
                            icon.style.setProperty("color", `${textColor}`, "important");
                        });
                    } else {
                        button.style.setProperty("color", "#FFFFFF", "important");
                        const icons = button.querySelectorAll('i');
                        icons.forEach(icon => {
                            icon.style.setProperty("color", "#FFFFFF", "important");
                        });
                    }
                    
                    // Font size - apply to button AND icons
                    if (fontSize && fontSize >= 0) {
                        button.style.setProperty("font-size", `${fontSize}px`, "important");
                        const icons = button.querySelectorAll('i');
                        icons.forEach(icon => {
                            icon.style.setProperty("font-size", `${fontSize}px`, "important");
                        });
                    } else {
                        button.style.setProperty("font-size", "14px", "important");
                        const icons = button.querySelectorAll('i');
                        icons.forEach(icon => {
                            icon.style.setProperty("font-size", "14px", "important");
                        });
                    }
                });
            }
        }

        /**
         * Chat Mute Button Styles
         */
        if (micToggler) {
            var micButtonEl = chatBoxStyleEl.querySelector('.mic-button');

            var bg = micButtonEl.querySelector('.background').value.trim();
            var textColor = micButtonEl.querySelector('.color').value.trim();
            var borderWidth = micButtonEl.querySelector('.border-width').value.trim();
            var borderStyle = micButtonEl.querySelector('.border-style').value.trim();
            var borderColor = micButtonEl.querySelector('.border-color').value.trim();
            var textAlign = micButtonEl.querySelector('.text-align').value.trim();
            var fontSize = micButtonEl.querySelector('.font-size').value.trim();
            var lineHeight = micButtonEl.querySelector('.line-height').value.trim();


            var borderRadiusLeft = micButtonEl.querySelector('.border-radius-left').value.trim();
            var borderRadiusTop = micButtonEl.querySelector('.border-radius-top').value.trim();
            var borderRadiusRight = micButtonEl.querySelector('.border-radius-right').value.trim();
            var borderRadiusBottom = micButtonEl.querySelector('.border-radius-bottom').value.trim();


            var paddingLeft = micButtonEl.querySelector('.padding-left').value.trim();
            var paddingTop = micButtonEl.querySelector('.padding-top').value.trim();
            var paddingRight = micButtonEl.querySelector('.padding-right').value.trim();
            var paddingBottom = micButtonEl.querySelector('.padding-bottom').value.trim();
            if (bg && bg != '') {
                micToggler.style.setProperty("background", `${bg}`, "important");
            } else {
                micToggler.style.removeProperty("background");
            }

            if (borderWidth && borderWidth >= 0) {
                micToggler.style.setProperty("border", `${borderWidth || 0}px ${borderStyle || 'solid'} ${borderColor || 'transparent'}`, "important");
            } else {
                micToggler.style.removeProperty("border");
            }
            if ([borderRadiusTop, borderRadiusRight, borderRadiusBottom, borderRadiusLeft].some(p => isNumeric(p) && Number(p) >= 0)) {
                micToggler.style.setProperty("border-radius", `${borderRadiusTop || 0}px ${borderRadiusRight || 0}px ${borderRadiusBottom || 0}px ${borderRadiusLeft || 0}px`, "important");
            } else {
                micToggler.style.removeProperty("border-radius");
            }
            if ([paddingTop, paddingRight, paddingBottom, paddingLeft].some(p => isNumeric(p) && Number(p) >= 0)) {
                micToggler.style.setProperty("padding", `${paddingTop || 0}px ${paddingRight || 0}px ${paddingBottom || 0}px ${paddingLeft || 0}px`, "important");
            } else {
                micToggler.style.removeProperty("padding");
            }

            if (textColor && textColor != '') {
                micToggler.style.setProperty("color", `${textColor}`, "important");
            } else {
                micToggler.style.removeProperty("color");
            }
            if (textAlign && textAlign != '') {
                micToggler.style.setProperty("text-align", `${textAlign || 'left'}`, "important");
            } else {
                micToggler.style.removeProperty("text-align");
            }
            if (fontSize && fontSize != '') {
                micToggler.style.setProperty("font-size", `${fontSize || 14}px`, "important");
            } else {
                micToggler.style.removeProperty("font-size");
            }
            if (lineHeight && lineHeight != '') {
                micToggler.style.setProperty("line-height", `${lineHeight || 18}px`, "important");
            } else {
                micToggler.style.removeProperty("line-height");
            }
        }

        /**
        * Fullscreen Button Styles
        */
        const fullscreenButtons = document.querySelectorAll('.action-fullscreen');
        if (fullscreenButtons.length > 0) {
            var fullscreenButtonEl = chatBoxStyleEl.querySelector('.fullscreen-button');
            
            if (fullscreenButtonEl) {
                var bg = fullscreenButtonEl.querySelector('.background')?.value.trim();
                var textColor = fullscreenButtonEl.querySelector('.color')?.value.trim();
                var borderWidth = fullscreenButtonEl.querySelector('.border-width')?.value.trim();
                var borderStyle = fullscreenButtonEl.querySelector('.border-style')?.value.trim();
                var borderColor = fullscreenButtonEl.querySelector('.border-color')?.value.trim();
                var borderRadius = fullscreenButtonEl.querySelector('.border-radius-input')?.value.trim();
                var padding = fullscreenButtonEl.querySelector('.padding-input')?.value.trim();
                var fontSize = fullscreenButtonEl.querySelector('.font-size')?.value.trim();
                var iconSize = fullscreenButtonEl.querySelector('.icon-size')?.value.trim();
                
                // Apply styles to all fullscreen buttons
                fullscreenButtons.forEach(button => {
                    // Background
                    if (bg && bg != '') {
                        button.style.setProperty("background", `${bg}`, "important");
                    } else {
                        button.style.setProperty("background", "rgba(59, 130, 246, 0.5)", "important");
                    }
                    
                    // Border
                    if (borderWidth && borderWidth >= 0) {
                        button.style.setProperty("border", `${borderWidth || 1}px ${borderStyle || 'solid'} ${borderColor || '#000000'}`, "important");
                    } else {
                        button.style.setProperty("border", "1px solid #000000", "important");
                    }
                    
                    // Border radius
                    if (borderRadius && borderRadius >= 0) {
                        button.style.setProperty("border-radius", `${borderRadius}px`, "important");
                    } else {
                        button.style.setProperty("border-radius", "8px", "important");
                    }
                    
                    // Padding
                    if (padding && padding >= 0) {
                        button.style.setProperty("padding", `${padding}px`, "important");
                    } else {
                        button.style.setProperty("padding", "10px", "important");
                    }
                    
                    // Font color - apply to button AND icons
                    if (textColor && textColor != '') {
                        button.style.setProperty("color", `${textColor}`, "important");
                        // Apply to child icons too
                        const icons = button.querySelectorAll('i');
                        icons.forEach(icon => {
                            icon.style.setProperty("color", `${textColor}`, "important");
                        });
                    } else {
                        button.style.setProperty("color", "#FFFFFF", "important");
                        const icons = button.querySelectorAll('i');
                        icons.forEach(icon => {
                            icon.style.setProperty("color", "#FFFFFF", "important");
                        });
                    }
                    
                    // Font size
                    if (fontSize && fontSize >= 0) {
                        button.style.setProperty("font-size", `${fontSize}px`, "important");
                    } else {
                        button.style.setProperty("font-size", "14px", "important");
                    }
                    
                    // Icon size - specifically for the icons inside
                    if (iconSize && iconSize >= 0) {
                        const icons = button.querySelectorAll('i');
                        icons.forEach(icon => {
                            icon.style.setProperty("font-size", `${iconSize}px`, "important");
                        });
                    } else {
                        const icons = button.querySelectorAll('i');
                        icons.forEach(icon => {
                            icon.style.setProperty("font-size", "16px", "important");
                        });
                    }
                });
            }
        }

        /**
        * Close Button Styles
        */
        if (document.getElementById('chatBox-close')) {
            var closeButtonEl = chatBoxStyleEl.querySelector('.close-button');
            
            if (closeButtonEl) {
                var bg = closeButtonEl.querySelector('input[name="styles[close-button][background]"]')?.value.trim();
                var hoverBg = closeButtonEl.querySelector('input[name="styles[close-button][hover-background]"]')?.value.trim();
                var textColor = closeButtonEl.querySelector('input[name="styles[close-button][color]"]')?.value.trim();
                var borderWidth = closeButtonEl.querySelector('input[name="styles[close-button][border][width]"]')?.value.trim();
                var borderStyle = closeButtonEl.querySelector('select[name="styles[close-button][border][style]"]')?.value.trim();
                var borderColor = closeButtonEl.querySelector('input[name="styles[close-button][border][color]"]')?.value.trim();
                var borderRadius = closeButtonEl.querySelector('input[name="styles[close-button][border-radius]"]')?.value.trim();
                var fontSize = closeButtonEl.querySelector('input[name="styles[close-button][font-size]"]')?.value.trim();
                var size = closeButtonEl.querySelector('input[name="styles[close-button][size]"]')?.value.trim();
                var positionTop = closeButtonEl.querySelector('input[name="styles[close-button][position-top]"]')?.value.trim();
                var positionRight = closeButtonEl.querySelector('input[name="styles[close-button][position-right]"]')?.value.trim();
                
                const closeBtn = document.getElementById('chatBox-close');
                
                // Background
                if (bg && bg != '') {
                    closeBtn.style.setProperty("background", `${bg}`, "important");
                } else {
                    closeBtn.style.setProperty("background", "rgba(220, 38, 38, 0.5)", "important");
                }
                
                // Add hover effect
                if (hoverBg && hoverBg != '') {
                    closeBtn.setAttribute('data-hover-bg', hoverBg);
                }
                
                // Size
                if (size && size >= 0) {
                    closeBtn.style.setProperty("width", `${size}px`, "important");
                    closeBtn.style.setProperty("height", `${size}px`, "important");
                    closeBtn.style.setProperty("min-width", `${size}px`, "important");
                    closeBtn.style.setProperty("min-height", `${size}px`, "important");
                } else {
                    closeBtn.style.setProperty("width", "32px", "important");
                    closeBtn.style.setProperty("height", "32px", "important");
                }
                
                // Border
                if (borderWidth && borderWidth >= 0) {
                    closeBtn.style.setProperty("border", `${borderWidth || 0}px ${borderStyle || 'solid'} ${borderColor || 'transparent'}`, "important");
                } else {
                    closeBtn.style.removeProperty("border");
                }
                
                // Border radius (make it circular by default)
                if (borderRadius && borderRadius >= 0) {
                    closeBtn.style.setProperty("border-radius", `${borderRadius}%`, "important");
                } else {
                    closeBtn.style.setProperty("border-radius", "50%", "important");
                }
                
                // Position
                if (positionTop && positionTop >= 0) {
                    closeBtn.style.setProperty("top", `${positionTop}px`, "important");
                } else {
                    closeBtn.style.setProperty("top", "10px", "important");
                }
                
                if (positionRight && positionRight >= 0) {
                    closeBtn.style.setProperty("right", `${positionRight}px`, "important");
                } else {
                    closeBtn.style.setProperty("right", "10px", "important");
                }
                
                // Font color (applies to icon)
                if (textColor && textColor != '') {
                    closeBtn.style.setProperty("color", `${textColor}`, "important");
                    const closeIcon = closeBtn.querySelector('i');
                    if (closeIcon) {
                        closeIcon.style.setProperty("color", `${textColor}`, "important");
                    }
                } else {
                    closeBtn.style.setProperty("color", "#FFFFFF", "important");
                    const closeIcon = closeBtn.querySelector('i');
                    if (closeIcon) {
                        closeIcon.style.setProperty("color", "#FFFFFF", "important");
                    }
                }
                
                // Font size (icon size)
                if (fontSize && fontSize >= 0) {
                    closeBtn.style.setProperty("font-size", `${fontSize}px`, "important");
                    const closeIcon = closeBtn.querySelector('i');
                    if (closeIcon) {
                        closeIcon.style.setProperty("font-size", `${fontSize}px`, "important");
                    }
                } else {
                    closeBtn.style.removeProperty("font-size");
                }
                
                // Update tooltip/title
                const closeButtonLabel = document.getElementById('close_button_label');
                if (closeButtonLabel) {
                    const label = closeButtonLabel.value.trim();
                    if (label) {
                        closeBtn.setAttribute('title', label);
                    } else {
                        closeBtn.setAttribute('title', 'Close Window');
                    }
                }
            }
        }

        // Add hover effect for close button
        document.addEventListener('mouseover', function(e) {
            const closeBtn = document.getElementById('chatBox-close');
            if (closeBtn && closeBtn.contains(e.target)) {
                const hoverBg = closeBtn.getAttribute('data-hover-bg');
                if (hoverBg) {
                    closeBtn.style.setProperty("background", hoverBg, "important");
                }
            }
        });

        document.addEventListener('mouseout', function(e) {
            const closeBtn = document.getElementById('chatBox-close');
            if (closeBtn && closeBtn.contains(e.target)) {
                const closeButtonEl = document.querySelector('.close-button');
                const bg = closeButtonEl?.querySelector('input[name="styles[close-button][background]"]')?.value.trim();
                if (bg) {
                    closeBtn.style.setProperty("background", bg, "important");
                } else {
                    closeBtn.style.setProperty("background", "rgba(220, 38, 38, 0.5)", "important");
                }
            }
        });

        // Update opening texts in preview
        const openingTexts = {
            en: document.getElementById('welcome_message_en')?.value || '',
            es: document.getElementById('welcome_message_es')?.value || '',
            fr: document.getElementById('welcome_message_fr')?.value || '',
            de: document.getElementById('welcome_message_de')?.value || ''
        };
        
        const startSessionBtn = document.getElementById('startSession');
        if (startSessionBtn) {
            // Get current language
            const currentLang = document.querySelector('.avatar_studio-tab-content.active')?.id?.replace('avatar_studio-tab-', '') || 'en';
            const openingText = openingTexts[currentLang] || openingTexts.en;
            
            // Update the attribute
            startSessionBtn.setAttribute('initial_message', openingText);
            startSessionBtn.setAttribute('opening_text', openingText);
        }



        // previewArea.appendChild(box);
    }

    document.addEventListener('DOMContentLoaded', () => {
        
        // Initial preview render
        showChatBoxPreview();

        // Update preview on input change
        document.querySelectorAll('#chatBox-style input, input#avatar_title,input#preview_image').forEach(input => {
            input.addEventListener('input', showChatBoxPreview);
            input.addEventListener('change', showChatBoxPreview);

            const container = input.closest('.input-controls');
            if (container) {
                const clearBtn = container.querySelector('.clear-btn');
                if (clearBtn) {
                    clearBtn.style.display = (input.value != '') ? 'block' : 'none';
                }
            }
        });

        document.querySelectorAll('#chatBox-style select').forEach(input => {
            input.addEventListener('change', showChatBoxPreview);
        });

        document.querySelectorAll('#chatBox-style input.gradient-color-picker').forEach(input => {
            new lc_color_picker(input, {
                no_input_mode: true,
                on_change: function (new_value, target_field) {
                    showChatBoxPreview();
                    const container = target_field.closest('.input-controls');
                    const clearBtn = container.querySelector('.clear-btn');
                    if (clearBtn) {
                        clearBtn.style.display = (input.value != '') ? 'block' : 'none';
                    }
                }
            });
            const container = input.closest('.input-controls');
            if (container) {
                const clearBtn = container.querySelector('.clear-btn');
                if (clearBtn) {
                    clearBtn.style.display = (input.value != '') ? 'block' : 'none';
                }
            }
        });


        jQuery('#chatBox-style .color-picker').wpColorPicker({
            change: function (event, ui) {
                showChatBoxPreview(event);
            },
            hide: function (event, ui) {
                showChatBoxPreview(event);
            }
        });
        // document.querySelectorAll('input[name="vendor"]').forEach(input => {
        //     input.addEventListener('change', (event) => {
        //         document.getElementById('avatarForm').submit();
        //     });
        // });




        let frame;
        let imageUploaderWrap;
        document.querySelectorAll('.upload-image-btn').forEach(function (uploadBtn) {
            uploadBtn.addEventListener('click', function (e) {
                e.preventDefault();

                imageUploaderWrap = e.target.closest('.image-uploader-wrap');

                // Reuse existing frame if open
                if (frame) {
                    frame.open();
                    return;
                }

                frame = wp.media({
                    title: 'Select or Upload an Image',
                    button: {
                        text: 'Use this image'
                    },
                    multiple: false
                });

                frame.on('select', function () {
                    const attachment = frame.state().get('selection').first().toJSON();
                    const imageInput = imageUploaderWrap.querySelector('.image-url');
                    const imagePreview = imageUploaderWrap.querySelector('.image-preview');
                    const removeBtn = imageUploaderWrap.querySelector('.remove-image-btn');
                    
                    imageInput.value = attachment.url;
                    imagePreview.src = attachment.url;
                    imagePreview.style.display = 'block';
                    removeBtn.style.display = 'inline-block';
                    
                    const event = new Event('change', { bubbles: true });
                    imageInput.dispatchEvent(event);
                });

                frame.open();
            });
        });

        // Find the remove button handler and add this line at the end:
        document.querySelectorAll('.remove-image-btn').forEach(function (removeBtn) {
            removeBtn.addEventListener('click', function (e) {
                e.preventDefault();
                
                imageUploaderWrap = e.target.closest('.image-uploader-wrap');
                const imageInput = imageUploaderWrap.querySelector('.image-url');
                const imagePreview = imageUploaderWrap.querySelector('.image-preview');

                imageInput.value = '';
                imagePreview.src = '';
                imagePreview.style.display = 'none';
                removeBtn.style.display = 'none';
                
                // ✅ ADD THIS to trigger change
                const event = new Event('change', { bubbles: true });
                imageInput.dispatchEvent(event);
            });
        });

    });

</script> -->

<!-- <script>
// Enhanced Preview JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const previewModeBtns = document.querySelectorAll('.preview-mode-btn');
    const thumbnailSizeOptions = document.querySelectorAll('.thumbnail-size-option');
    const chatBox = document.getElementById('chatBox');
    const previewStateIndicator = document.getElementById('previewStateIndicator');
    const previewThumbnail = document.getElementById('previewThumbnail');
    
    // Update start button label in preview
    const startButtonLabel = document.getElementById('start_button_label');
    const startSessionBtn = document.getElementById('startSession');
    
    if (startButtonLabel && startSessionBtn) {
        startButtonLabel.addEventListener('input', function() {
            const label = this.value.trim();
            startSessionBtn.textContent = label || 'Start Chat';
        });
    }
    
    // Preview Mode Toggle
    previewModeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.getAttribute('data-mode');
            
            // Update active button
            previewModeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Hide/show Chat Mode Button tab based on preview mode
            const chatModeBtn = document.querySelector('button[data-tab="switch-button"]');
            if (chatModeBtn) {
                if (mode === 'before') {
                    chatModeBtn.style.display = 'none';
                } else {
                    chatModeBtn.style.display = 'inline-block';
                }
            }
            const micBtn = document.querySelector('button[data-tab="mic-button"]');
            if (micBtn) {
                if (mode === 'before') {
                    micBtn.style.display = 'none';
                } else {
                    micBtn.style.display = 'inline-block';
                }
            }
            const cameraBtn = document.querySelector('button[data-tab="camera-button"]');
            if (cameraBtn) {
                if (mode === 'before') {
                    cameraBtn.style.display = 'none';
                } else {
                    cameraBtn.style.display = 'inline-block';
                }
            }
            const endBtn = document.querySelector('button[data-tab="end-button"]');
            if (endBtn) {
                if (mode === 'before') {
                    endBtn.style.display = 'none';
                } else {
                    endBtn.style.display = 'inline-block';
                }
            }
            const transcriptBtn = document.querySelector('button[data-tab="transcript-button"]');
            if (transcriptBtn) {
                if (mode === 'during') {
                    transcriptBtn.style.display = 'none';
                } else {
                    transcriptBtn.style.display = 'inline-block';
                }
            }
            const fullscreenBtn = document.querySelector('button[data-tab="fullscreen-button"]');
            if (fullscreenBtn) {
                if (mode === 'during') {
                    fullscreenBtn.style.display = 'none';
                } else {
                    fullscreenBtn.style.display = 'inline-block';
                }
            }
            const closeBtn = document.querySelector('button[data-tab="close-button"]');
            if (closeBtn) {
                if (mode === 'during') {
                    closeBtn.style.display = 'none';
                } else {
                    closeBtn.style.display = 'inline-block';
                }
            }
            const startBtn = document.querySelector('button[data-tab="start-button"]');
            if (startBtn) {
                if (mode === 'during') {
                    startBtn.style.display = 'none';
                } else {
                    startBtn.style.display = 'inline-block';
                }
            }
            
            // Update previsew state
            if (mode === 'before') {
                chatBox.classList.remove('session-during');
                chatBox.classList.add('session-before');
                previewStateIndicator.textContent = 'Before Session';
                previewStateIndicator.style.background = 'linear-gradient(135deg, #38b1c5 0%, #da922c 100%)';
                
                // Show welcome container with start button
                const welcomeContainer = chatBox.querySelector('.welcomeContainer');
                const videoHolder = chatBox.querySelector('#video_holder');
                const actionContainer = chatBox.querySelector('.actionContainer');
                
                if (welcomeContainer) welcomeContainer.style.display = 'block';
                if (videoHolder) videoHolder.style.display = 'flex';
                if (actionContainer) actionContainer.style.display = 'none';
                
            } else {
                chatBox.classList.remove('session-before');
                chatBox.classList.add('session-during');
                // previewStateIndicator.textContent = 'During Session';
                previewStateIndicator.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                
                // Show action controls (mic, end, transcript)
                const welcomeContainer = chatBox.querySelector('.welcomeContainer');
                const videoHolder = chatBox.querySelector('#video_holder');
                const actionContainer = chatBox.querySelector('.actionContainer');
                
                if (welcomeContainer) {
                    // Hide loading elements but keep structure
                    const loadingIcon = welcomeContainer.querySelector('.loading-icon');
                    const loadingText = welcomeContainer.querySelector('.loadingText');
                    if (loadingIcon) loadingIcon.style.display = 'none';
                    if (loadingText) loadingText.style.display = 'none';
                    welcomeContainer.style.display = 'block';
                }
                if (videoHolder) videoHolder.style.display = 'block';
                if (actionContainer) actionContainer.style.display = 'flex';
            }
            
            // Trigger preview update
            showChatBoxPreview();
        });
    });
    
    // Thumbnail Size Selection
    thumbnailSizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const size = this.getAttribute('data-size');
            const radio = this.querySelector('input[type="radio"]');
            
            // Update visual selection
            thumbnailSizeOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            radio.checked = true;
            
            // Update thumbnail size in preview
            if (previewThumbnail) {
                const thumbnailStyleEl = document.getElementById('chatBox-style');
                const thumbnailEl = thumbnailStyleEl.querySelector('.thumbnail');
                
                let width, height;
                if (size === 'mini') {
                    width = thumbnailEl.querySelector('input[name="styles[thumbnail][mini][width]"]').value || 80;
                    height = thumbnailEl.querySelector('input[name="styles[thumbnail][mini][height]"]').value || '';
                } else if (size === 'medium') {
                    width = thumbnailEl.querySelector('input[name="styles[thumbnail][medium][width]"]').value || 150;
                    height = thumbnailEl.querySelector('input[name="styles[thumbnail][medium][height]"]').value || '';
                } else if (size === 'large') {
                    width = thumbnailEl.querySelector('input[name="styles[thumbnail][large][width]"]').value || 200;
                    height = thumbnailEl.querySelector('input[name="styles[thumbnail][large][height]"]').value || '';
                }
                
                if (width) {
                    previewThumbnail.style.width = isNumeric(width) ? `${width}px` : width;
                }
                if (height) {
                    previewThumbnail.style.height = isNumeric(height) ? `${height}px` : height;
                }
            }
        });
    });
    
    // Initialize with default state
    showChatBoxPreview();
});

// Your existing showChatBoxPreview function remains the same
// Just ensure it doesn't override the position styling we've added
</script> -->
<!-- <script>
// Copy shortcode functionality
jQuery(document).ready(function($) {
    $('.copy-shortcode-btn').on('click', function(e) {
        e.preventDefault();
        var $btn = $(this);
        var shortcode = $btn.data('shortcode');
        
        // Create temporary input
        var $temp = $('<input>');
        $('body').append($temp);
        $temp.val(shortcode).select();
        document.execCommand('copy');
        $temp.remove();
        
        // Visual feedback
        var originalText = $btn.text();
        $btn.text('Copied!');
        setTimeout(function() {
            $btn.text(originalText);
        }, 2000);
    });
});
</script> -->
<!-- <script>
jQuery(document).ready(function($) {
    // Monitor preview image changes
    $('#preview_image').on('change input', function() {
        const newImageUrl = $(this).val();
        
        // Update preview images immediately
        if (newImageUrl) {
            // Update poster image in video
            $('#avatarVideo').attr('poster', newImageUrl);
            
            // Update previewImage img if exists
            $('#previewImage').attr('src', newImageUrl);
            
            // Update the image preview in the form
            $(this).closest('.image-uploader-wrap').find('.image-preview').attr('src', newImageUrl).show();
            $(this).closest('.image-uploader-wrap').find('.remove-image-btn').show();
        } else {
            // Reset to default if empty
            const defaultImage = '<?php echo esc_url($previewImage); ?>';
            $('#avatarVideo').attr('poster', defaultImage);
            $('#previewImage').attr('src', defaultImage);
        }
    });
    
    // Handle image upload completion
    $('.upload-image-btn').on('click', function() {
        const wrapper = $(this).closest('.image-uploader-wrap');
        const inputField = wrapper.find('.image-url');
        
        // Store original frame select handler
        const originalFrameSelect = frame ? frame._events.select : null;
        
        // Override to trigger change after selection
        if (frame) {
            frame.off('select');
            frame.on('select', function() {
                const attachment = frame.state().get('selection').first().toJSON();
                inputField.val(attachment.url).trigger('change');
                wrapper.find('.image-preview').attr('src', attachment.url).show();
                wrapper.find('.remove-image-btn').show();
            });
        }
    });
    
    // Handle image removal
    $('.remove-image-btn').on('click', function() {
        const wrapper = $(this).closest('.image-uploader-wrap');
        wrapper.find('.image-url').val('').trigger('change');
    });
});
</script> -->
<?php
// Add this hidden input to save the selected thumbnail size for preview
?>
<input type="hidden" name="preview_thumbnail_size" id="preview_thumbnail_size_hidden" value="mini">