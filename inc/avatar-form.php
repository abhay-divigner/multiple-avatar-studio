<?php


if (!defined('ABSPATH'))
    exit;
$avatar = isset($avatar) ? $avatar : null;


$all_pages = get_pages();
$previewImage = plugin_dir_url(__FILE__) . '../assets/images/preview.webp';
?>

<link rel="stylesheet" crossorigin="anonymous" referrerpolicy="no-referrer" integrity="sha512-…your-integrity-hash…"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

<style>
/* Enhanced Avatar Form Styling */
.avatar-form {
    max-width: 100%;
    margin: 20px 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, sans-serif;
}

/* Collapsible Section Styles */
.collapsible-section {
    background: white;
    border: 2px solid transparent;
    background-image: 
        linear-gradient(white, white),
        linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
    background-origin: border-box;
    background-clip: padding-box, border-box;
    border-radius: 12px;
    margin-bottom: 24px;
    box-shadow: 0 4px 15px rgba(56, 177, 197, 0.1);
    transition: all 0.3s ease;
    overflow: hidden;
}

.collapsible-section:hover {
    box-shadow: 0 8px 25px rgba(56, 177, 197, 0.15);
}

.section-header {
    background: linear-gradient(135deg, rgba(56, 177, 197, 0.08) 0%, rgba(218, 146, 44, 0.08) 100%);
    padding: 20px 30px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    user-select: none;
}

.section-header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #38b1c5 0%, #da922c 100%);
}

.section-header h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: flex;
    align-items: center;
    gap: 12px;
}

.section-header .toggle-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(56, 177, 197, 0.15) 0%, rgba(218, 146, 44, 0.15) 100%);
    border-radius: 50%;
    transition: all 0.3s ease;
}

.section-header .toggle-icon svg {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
}

.collapsible-section.collapsed .toggle-icon svg {
    transform: rotate(-90deg);
}

.section-content {
    max-height: 5000px;
    opacity: 1;
    transition: all 0.3s ease;
    overflow: hidden;
}

.collapsible-section.collapsed .section-content {
    max-height: 0;
    opacity: 0;
    padding: 0;
}

.section-body {
    padding: 30px;
}

/* Design Preview Section - Full Width */
#design-preview-section {
    width: 100%;
}

#design-preview-section .preview-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

#design-preview-section .preview-avatar {
    display: flex;
    justify-content: center;
    padding: 20px;
    background: linear-gradient(135deg, rgba(56, 177, 197, 0.03) 0%, rgba(218, 146, 44, 0.03) 100%);
    border-radius: 12px;
    border: 2px dashed rgba(56, 177, 197, 0.2);
}

/* Vendor Section - Full Width */
#vendor-section .vendor-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
}

/* Form Table Enhancements */
.boxed {
    background: transparent;
    border: none;
    padding: 0;
    margin-bottom: 0;
}

.form-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
}

.form-table tr {
    border-bottom: 1px solid #f3f4f6;
}

.form-table tr:last-child {
    border-bottom: none;
}

.form-table th {
    padding: 16px 20px 16px 0;
    text-align: left;
    font-weight: 600;
    color: #334155;
    vertical-align: top;
    width: 200px;
    font-size: 14px;
}

.form-table td {
    padding: 16px 0;
}

.form-table label {
    font-weight: 600;
    color: #334155;
    font-size: 14px;
}

/* Input Enhancements */
.regular-text,
select,
textarea,
input[type="text"],
input[type="number"],
input[type="password"] {
    width: 100%;
    max-width: 100%;
    padding: 10px 14px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s ease;
    background: white;
}

.regular-text:focus,
select:focus,
textarea:focus,
input[type="text"]:focus,
input[type="number"]:focus,
input[type="password"]:focus {
    outline: none;
    border: 2px solid transparent;
    background-image: 
        linear-gradient(white, white),
        linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
    background-origin: border-box;
    background-clip: padding-box, border-box;
    box-shadow: 0 0 0 4px rgba(56, 177, 197, 0.1);
}

/* Tooltip Styles */
.tooltip-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.tooltip-icon {
    width: 18px;
    height: 18px;
    background: linear-gradient(135deg, rgba(56, 177, 197, 0.2) 0%, rgba(218, 146, 44, 0.2) 100%);
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: help;
    font-size: 12px;
    font-weight: 700;
    background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    border: 2px solid transparent;
    background-image: 
        linear-gradient(white, white),
        linear-gradient(135deg, rgba(56, 177, 197, 0.5) 0%, rgba(218, 146, 44, 0.5) 100%);
    background-origin: border-box;
    background-clip: text, border-box;
}

.tooltip-icon:hover + .tooltip-content {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.tooltip-content {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-5px);
    background: #1f2937;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 13px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    pointer-events: none;
    z-index: 1000;
    margin-bottom: 8px;
}

.tooltip-content::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #1f2937;
}

/* Radio Button Styling */
input[type="radio"] {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #d1d5db;
    border-radius: 50%;
    margin-right: 6px;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;
    vertical-align: middle;
}

input[type="radio"]:checked {
    border: 2px solid transparent;
    background-image: 
        linear-gradient(white, white),
        linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
    background-origin: border-box;
    background-clip: padding-box, border-box;
}

input[type="radio"]:checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
}

input[type="radio"]:hover {
    border-color: #38b1c5;
}

/* Checkbox Styling */
input[type="checkbox"] {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #d1d5db;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;
    vertical-align: middle;
}

input[type="checkbox"]:checked {
    background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
    border-color: transparent;
}

input[type="checkbox"]:checked::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 14px;
    font-weight: 700;
}

input[type="checkbox"]:hover {
    border-color: #38b1c5;
}

/* Select2 Enhancements */
.select2-container--default .select2-selection--multiple {
    border: 2px solid #e5e7eb !important;
    border-radius: 8px !important;
    min-height: 42px !important;
    padding: 4px !important;
}

.select2-container--default.select2-container--focus .select2-selection--multiple {
    border: 2px solid transparent !important;
    background-image: 
        linear-gradient(white, white),
        linear-gradient(135deg, #38b1c5 0%, #da922c 100%) !important;
    background-origin: border-box !important;
    background-clip: padding-box, border-box !important;
    box-shadow: 0 0 0 4px rgba(56, 177, 197, 0.1) !important;
}

.select2-container--default .select2-selection--multiple .select2-selection__choice {
    background: linear-gradient(135deg, rgba(56, 177, 197, 0.1) 0%, rgba(218, 146, 44, 0.1) 100%) !important;
    border: 2px solid transparent !important;
    background-image: 
        linear-gradient(135deg, rgba(56, 177, 197, 0.1) 0%, rgba(218, 146, 44, 0.1) 100%),
        linear-gradient(135deg, rgba(56, 177, 197, 0.5) 0%, rgba(218, 146, 44, 0.5) 100%) !important;
    background-origin: border-box !important;
    background-clip: padding-box, border-box !important;
    border-radius: 6px !important;
    padding: 4px 8px !important;
    margin: 4px !important;
}

/* Image Uploader */
.image-uploader-wrap {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.image-uploader-wrap .row {
    display: flex;
    gap: 8px;
}

.image-uploader-wrap .image-preview {
    max-width: 200px;
    border-radius: 8px;
    border: 2px solid #e5e7eb;
    padding: 4px;
}

.image-uploader-wrap .button {
    padding: 8px 16px !important;
    border-radius: 6px !important;
    border: 2px solid #e5e7eb !important;
    background: white !important;
    transition: all 0.2s ease !important;
    height: auto !important;
}

.image-uploader-wrap .button:hover {
    border-color: #38b1c5 !important;
    background: linear-gradient(135deg, rgba(56, 177, 197, 0.05) 0%, rgba(218, 146, 44, 0.05) 100%) !important;
}

/* Tab System */
.avatar_studio-tabs {
    width: 100%;
}

.avatar_studio-tab-buttons {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.avatar_studio-tab-buttons .tab-btn {
    padding: 10px 20px;
    border: none;
    background: #f3f4f6;
    color: #6b7280;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.2s ease;
}

.avatar_studio-tab-buttons .tab-btn:hover {
    background: linear-gradient(135deg, rgba(56, 177, 197, 0.1) 0%, rgba(218, 146, 44, 0.1) 100%);
}

.avatar_studio-tab-buttons .tab-btn.active {
    background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(56, 177, 197, 0.3);
}

.avatar_studio-tab-content {
    display: none;
}

.avatar_studio-tab-content.active {
    display: block;
}

/* Style Wrapper */
.style-wrapper {
    margin-bottom: 16px;
}

.style-wrapper label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #334155;
    font-size: 13px;
}

.input-controls {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
}

.input-controls input,
.input-controls select {
    flex: 1;
}

.clear-btn {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: linear-gradient(135deg, rgba(56, 177, 197, 0.2) 0%, rgba(218, 146, 44, 0.2) 100%);
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: none;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 12px;
    color: #6b7280;
    transition: all 0.2s ease;
}

.clear-btn:hover {
    background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
    color: white;
}

/* Row and Column Grid */
.row {
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
}

.row.gap-0 {
    gap: 8px;
}

.col {
    flex: 1;
}

.col-4 {
    flex: 0 0 calc(40% - 12px);
}

.col-5 {
    flex: 0 0 calc(50% - 12px);
}

.col-10 {
    flex: 0 0 100%;
}

/* Editor Wrapper */
.editor-wrapper {
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
}

.editor-wrapper:focus-within {
    border: 2px solid transparent;
    background-image: 
        linear-gradient(white, white),
        linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
    background-origin: border-box;
    background-clip: padding-box, border-box;
    box-shadow: 0 0 0 4px rgba(56, 177, 197, 0.1);
}

/* Submit Button */
#saveBtn {
    background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%) !important;
    color: #fff !important;
    padding: 12px 32px !important;
    border-radius: 8px !important;
    border: none !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 4px 15px rgba(56, 177, 197, 0.4) !important;
    margin-top: 24px !important;
    position: relative !important;
    overflow: hidden !important;
}

#saveBtn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.5s ease;
}

#saveBtn:hover::before {
    left: 100%;
}

#saveBtn:hover {
    background: linear-gradient(135deg, #2a8b9a 0%, #c17d23 100%) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 20px rgba(56, 177, 197, 0.5) !important;
}

/* Vendor Logo Styling */
.vendor-logo-container {
    display: flex;
    align-items: center;
    gap: 12px;
}

.vendor-logo-container img {
    max-width: 80px;
    height: auto;
    border: 2px solid transparent;
    background-image: 
        linear-gradient(white, white),
        linear-gradient(135deg, rgba(56, 177, 197, 0.3) 0%, rgba(218, 146, 44, 0.3) 100%);
    background-origin: border-box;
    background-clip: padding-box, border-box;
    padding: 8px;
    border-radius: 8px;
}

/* Responsive Design */
@media (max-width: 1200px) {
    #vendor-section .vendor-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 782px) {
    .section-header {
        padding: 16px 20px;
    }
    
    .section-header h2 {
        font-size: 18px;
    }
    
    .section-body {
        padding: 20px;
    }
    
    .row {
        flex-direction: column;
        gap: 16px;
    }
    
    .col,
    .col-4,
    .col-5 {
        flex: 0 0 100%;
    }
    
    .form-table th,
    .form-table td {
        display: block;
        width: 100%;
        padding: 10px 0;
    }
    
    .form-table th {
        padding-bottom: 5px;
    }
    
    .avatar_studio-tab-buttons {
        flex-direction: column;
    }
    
    .avatar_studio-tab-buttons .tab-btn {
        width: 100%;
    }
    
    #vendor-section .vendor-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }
}

/* Description Text */
.form-table p {
    margin: 8px 0 0 0;
    color: #6b7280;
    font-size: 13px;
    line-height: 1.5;
}

/* Full Width Utility */
.full-width {
    width: 100% !important;
    max-width: 100% !important;
}

/* Smooth Transitions */
* {
    transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}

/* Focus Visible for Accessibility */
*:focus-visible {
    outline: 2px solid #38b1c5;
    outline-offset: 2px;
}

/* Small Columns for Better Mobile View */
.sm-col-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
}

.sm-col-10 {
    flex: 0 0 100%;
}

@media (min-width: 783px) {
    .sm-col-10 {
        flex: 0 0 calc(100% - 12px);
    }
}

/* Margin Bottom Utility */
.mb-20 {
    margin-bottom: 20px;
}

/* Active Thumbnail Row */
.active_thumbnail-row {
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 2px solid transparent;
    background-image: 
        linear-gradient(white, white),
        linear-gradient(90deg, rgba(56, 177, 197, 0.2) 0%, rgba(218, 146, 44, 0.2) 100%);
    background-origin: border-box;
    background-clip: padding-box, border-box;
    background-size: 100% 100%, 100% 2px;
    background-position: 0 0, 0 100%;
    background-repeat: no-repeat;
}
</style>

<div class="avatar-form">
    <form id="avatarForm" method="post" action="<?php echo admin_url('admin-post.php') ?>">
        <?php $avatar ? wp_nonce_field('update_avatar') : wp_nonce_field('save_avatar'); ?>


        <input type="hidden" name="action" value="<?php echo $avatar ? 'update_avatar' : 'save_avatar' ?>">
        <?php if ($id) { ?>
            <input type="hidden" name="id" value="<?php echo $id; ?>">
        <?php } ?>
        <div class="row sm-col-wrap">

            <div class="col col-5 sm-col-10  ">
                <div class="boxed mb-20">
                    <table class="form-table ">
                        <tr>
                            <th><label for="vendor">Vendor</label></th>
                            <td>
                                <!-- Hidden input to store vendor value -->
                                <input type="hidden" name="vendor" value="<?php echo $avatar && $avatar->vendor ? esc_attr($avatar->vendor) : ''; ?>">
                                
                                <!-- Display vendor as read-only text -->
                                <!-- <strong style="text-transform: capitalize; font-size: 14px; color: #2271b1;">
                                    <?php echo $avatar && $avatar->vendor ? ucfirst(esc_html($avatar->vendor)) : ''; ?>
                                </strong> -->
                                
                                <?php if ($avatar && $avatar->vendor === 'tavus'): ?>
                                    <span style="margin-left: 10px;"><img style="width: 60px; margin-top: -21px;" src="<?php echo get_site_url(); ?>/wp-content/plugins/AvatarStudio(v1.0.3)/assets/images/tavus_logo.png" alt="Tavus Logo"></span>
                                <?php elseif ($avatar && $avatar->vendor === 'heygen'): ?>
                                    <span style="margin-left: 10px;"><img style="width: 60px; margin-top: -21px;" src="<?php echo get_site_url(); ?>/wp-content/plugins/AvatarStudio(v1.0.3)/assets/images/heygen_logo.png" alt="Heygen Logo"></span>
                                <?php endif; ?>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="api_key">API Key</label></th>
                            <td><input type="text" name="api_key" id="api_key" class="regular-text"
                                    value="<?php echo $avatar && $avatar->api_key ? esc_attr($avatar->api_key) : '' ?>"
                                    required />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="avatar_title">Title</label></th>
                            <td><input type="text" name="title" id="avatar_title" class="regular-text"
                                    value="<?php echo $avatar && $avatar->title ? esc_attr($avatar->title) : '' ?>" />
                            </td>
                        </tr>

                        <tr>
                            <th><label for="avatar_name">Avatar Name</label></th>
                            <td><input type="text" name="avatar_name" id="avatar_name" class="regular-text"
                                    value="<?php echo $avatar && $avatar->avatar_name ? esc_attr($avatar->avatar_name) : '' ?>" />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label for="avatar_id">
                                    <?php echo ($avatar && $avatar->vendor === 'tavus') ? 'Replica ID' : 'Avatar Id'; ?>
                                </label>
                            </th>
                            <td>
                                <input type="text" name="avatar_id" id="avatar_id" class="regular-text"
                                    value="<?php echo $avatar && $avatar->avatar_id ? esc_attr($avatar->avatar_id) : '' ?>"
                                    required />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label for="knowledge_id">
                                    <?php echo ($avatar && $avatar->vendor === 'tavus') ? 'Persona ID' : 'Knowledge ID'; ?>
                                </label>
                            </th>
                            <td>
                                <input type="text" name="knowledge_id" id="knowledge_id" class="regular-text"
                                    value="<?php echo $avatar && $avatar->knowledge_id ? esc_attr($avatar->knowledge_id) : '' ?>"
                                    required />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="preview_image">Preview/Poster Image</label></th>
                            <td>

                                <div class="image-uploader-wrap">
                                    <img class="image-preview"
                                        src="<?php echo $avatar && $avatar->preview_image ? esc_attr($avatar->preview_image) : '' ?>"
                                        style="max-width: 200px; display: none;" />
                                    <div class="row gap-0">
                                        <input type="text" name="preview_image" id="preview_image"
                                            class="regular-text image-url"
                                            value="<?php echo $avatar && $avatar->preview_image ? esc_attr($avatar->preview_image) : '' ?>" />

                                        <button type="button" class="button upload-image-btn" title="Upload Image">
                                            <span class="dashicons dashicons-upload"></span>
                                        </button>
                                        <button type="button" class="button remove-image-btn " title="Remove"
                                            style="display: none;">
                                            <span class="dashicons dashicons-no-alt"></span>
                                        </button>
                                    </div>
                                </div>

                            </td>

                        </tr>
                        <tr>
                            <th><label for="time_limit">Time Limit</label></th>
                            <td>
                                <input type="number" min="0" name="time_limit" id="time_limit" class="regular-text"
                                    style="width: 100px;"
                                    value="<?php echo $avatar && $avatar->time_limit ? esc_attr($avatar->time_limit) : 60 ?>"
                                    required />
                                <p>Avatar chat duration</p>
                            </td>
                        </tr>
                        <tr class="voice-emotion-row"
                            style=" <?php echo ($avatar && $avatar->vendor == 'tavus') ? 'display:none;' : ''; ?>;">
                            <th><label for="voice_emotion">Voice Emotion</label></th>
                            <td>
                                <select name="voice_emotion" id="voice_emotion" class=" ">
                                    <option value="excited" <?php echo $avatar && $avatar->voice_emotion == 'excited' ? 'selected="selected"' : ''; ?>>
                                        EXCITED </option>
                                    <option value="serious" <?php echo $avatar && $avatar->voice_emotion == 'serious' ? 'selected="selected"' : ''; ?>>
                                        SERIOUS </option>
                                    <option value="friendly" <?php echo $avatar && $avatar->voice_emotion == 'friendly' ? 'selected="selected"' : ''; ?>>
                                        FRIENDLY </option>
                                    <option value="soothing" <?php echo $avatar && $avatar->voice_emotion == 'soothing' ? 'selected="selected"' : ''; ?>>
                                        SOOTHING </option>
                                    <option value="broadcaster" <?php echo $avatar && $avatar->voice_emotion == 'broadcaster' ? 'selected="selected"' : ''; ?>>
                                        BROADCASTER </option>
                                </select>

                            </td>
                        </tr>
                        <tr>
                            <th><label for="open_on_desktop">Open on Desktop</label></th>
                            <td>
                                <input type="radio" name="open_on_desktop" id="open_on_desktop_yes" value="1" <?php echo $avatar && checked($avatar->open_on_desktop, 1, true) ?>> <label
                                    for="open_on_desktop_yes">Yes</label>
                                <input type="radio" name="open_on_desktop" id="open_on_desktop_no" value="0" <?php echo $avatar && checked($avatar->open_on_desktop, 0, true) ?>> <label
                                    for="open_on_desktop_no">No</label>

                            </td>
                        </tr>
                        <tr>
                            <th><label for="video_enable">Video enable</label></th>
                            <td>
                                <input type="radio" name="video_enable" id="video_enable_yes" value="1" <?php echo $avatar && checked($avatar->video_enable, 1, true) ?>> <label
                                    for="video_enable_yes">Yes</label>
                                <input type="radio" name="video_enable" id="video_enable_no" value="0" <?php echo $avatar && checked($avatar->video_enable, 0, true) ?>> <label
                                    for="video_enable_no">No</label>

                            </td>
                        </tr>
                        <tr>
                            <th><label for="chat_only">Chat only</label></th>
                            <td>
                                <input type="radio" name="chat_only" id="chat_only_yes" value="1" <?php echo $avatar && checked($avatar->chat_only, 1, true) ?>> <label for="chat_only_yes">Yes</label>
                                <input type="radio" name="chat_only" id="chat_only_no" value="0" <?php echo $avatar && checked($avatar->chat_only, 0, true) ?>> <label for="chat_only_no">No</label>

                            </td>
                        </tr>
                        <tr>
                            <td>

                            </td>
                        </tr>
                        <tr>
                            <th><label for="chat_window_pages">Chat Window Pages</label></th>
                            <td>
                                <?php
                                $pages = $avatar && $avatar->pages ? json_decode($avatar->pages, true) : [];

                                ?>
                                <select name="pages[]" id="chat_window_pages" class="select2 full-width"
                                    multiple="multiple">
                                    <?php
                                    foreach ($all_pages as $val) {
                                        $selected = is_array($pages) && in_array($val->ID, $pages) ? 'selected="selected"' : '';
                                        echo '<option value="' . $val->ID . '" ' . $selected . '>' . esc_html($val->post_title) . '</option>';
                                    }
                                    ?>
                                </select>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="boxed mb-20">
                    <!-- style=" <?php echo ($avatar && $avatar->vendor == 'tavus') ? 'display:none;' : ''; ?>;" -->

                    <table class="form-table">
                        <tr valign="top">
                            <th scope="row">Enable LiveKit</th>
                            <td>
                                <input type="checkbox" name="livekit_enable" value="1" <?php echo $avatar && checked($avatar->livekit_enable, 1, true) ?> />
                            </td>
                        </tr>
                        <tr valign="top">
                            <th scope="row">Custom RAG API URL <br><small>(leave it blank to work from heygen
                                    knowledge)</small>
                            </th>
                            <td>
                                <input type="text" name="RAG_API_URL" class="regular-text"
                                    value="<?php echo $avatar && $avatar->RAG_API_URL ? esc_attr($avatar->RAG_API_URL) : '' ?>" />
                            </td>
                        </tr>

                        <tr valign="top">
                            <th scope="row">Deepgram KEY <br><small>(Important to work on all browser)</small></th>
                            <td>
                                <input type="text" name="deepgramKEY" class="regular-text"
                                    value="<?php echo $avatar && $avatar->deepgramKEY ? esc_attr($avatar->deepgramKEY) : '' ?>" />
                            </td>
                        </tr>
                    </table>

                </div>

                <div class="boxed mb-20" style=" ">
                    <table class="form-table">
                        <tr valign="top">
                            <th scope="row">Enable Instruction</th>
                            <td>
                                <input type="checkbox" name="instruction_enable" value="1" <?php echo $avatar && checked($avatar->instruction_enable, 1, true) ?> />
                            </td>
                        </tr>
                        <tr valign="top">
                            <th scope="row">Skip instruction video</th>
                            <td>
                                <input type="checkbox" name="skip_instruction_video" value="1" <?php echo $avatar && checked($avatar->skip_instruction_video, 1, true) ?> />
                            </td>
                        </tr>
                        <tr valign="top">
                            <th scope="row">Heading</small>
                            </th>
                            <td>
                                <input type="text" name="instruction_title" class="regular-text"
                                    value="<?php echo $avatar && $avatar->instruction_title ? esc_attr($avatar->instruction_title) : '' ?>" />
                            </td>
                        </tr>

                        <tr valign="top">
                            <th scope="row">Instruction </th>
                            <td>
                                <div class="editor-wrapper">
                                    <?php
                                    // $instruction = $avatar && $avatar->instruction ? stripslashes($avatar->instruction) : '';
                                    $instruction = $avatar && $avatar->instruction ? wp_kses_post($avatar->instruction) : '';


                                    wp_editor($instruction, 'instruction', [
                                        'textarea_name' => 'instruction',
                                        'media_buttons' => true,
                                        'textarea_rows' => 12,
                                    ]);

                                    ?>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>

                <div class="boxed mb-20" style=" ">
                    <table class="form-table">
                        <tr valign="top">
                            <th scope="row">Enable User Form</th>
                            <td>
                                <input type="checkbox" name="user_form_enable" value="1" <?php echo $avatar && checked($avatar->user_form_enable, 1, true) ?> />
                            </td>
                        </tr>
                    </table>
                </div>


                <div class="boxed mb-20" style=" ">
                    <table class="form-table">
                        <tr valign="top">
                            <th scope="row">Enable Disclaimer</th>
                            <td>
                                <input type="checkbox" name="disclaimer_enable" value="1" <?php echo $avatar && checked($avatar->disclaimer_enable, 1, true) ?> />
                            </td>
                        </tr>
                        <tr valign="top">
                            <th scope="row">Heading</small>
                            </th>
                            <td>
                                <input type="text" name="disclaimer_title" class="regular-text"
                                    value="<?php echo $avatar && $avatar->disclaimer_title ? esc_attr($avatar->disclaimer_title) : '' ?>" />
                            </td>
                        </tr>
                        <tr valign="top">
                            <th scope="row">Disclaimer </th>
                            <td>
                                <div class="editor-wrapper">
                                    <?php
                                    $disclaimer = $avatar && $avatar->disclaimer ? stripslashes($avatar->disclaimer) : '';
                                    wp_editor($disclaimer, 'disclaimer', [
                                        'textarea_name' => 'disclaimer',
                                        'media_buttons' => true,
                                        'textarea_rows' => 12,
                                    ]);

                                    ?>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>


                <div class="boxed mb-20">
                    <h2>Opening Texts / Welcome Messages</h2>
                    <?php
                    $welcome_message = $avatar && $avatar->welcome_message ? json_decode($avatar->welcome_message, true) : [];
                    ?>
                    <div class="avatar_studio-tabs">
                        <div class="avatar_studio-tab-buttons">
                            <button type="button" class="tab-btn active" data-tab="en">English</button>
                            <button type="button" class="tab-btn" data-tab="es">Spanish</button>
                            <button type="button" class="tab-btn" data-tab="fr">French</button>
                            <button type="button" class="tab-btn" data-tab="de">German</button>
                        </div>

                        <div id="avatar_studio-tab-en" class="avatar_studio-tab-content active">
                            <label for="welcome_message_en"><strong>Welcome Message (En)</strong></label><br>
                            <input type="text" id="welcome_message_en" class="regular-text full-width"
                                name="welcome_message[en]" value="<?php echo $welcome_message['en'] ?? ''; ?>" />
                        </div>

                        <div id="avatar_studio-tab-es" class="avatar_studio-tab-content">
                            <label for="welcome_message_es"><strong>Welcome Message (Es)</strong></label><br>
                            <input type="text" id="welcome_message_es" class="regular-text full-width"
                                name="welcome_message[es]" value="<?php echo $welcome_message['es'] ?? ''; ?>" />
                        </div>

                        <div id="avatar_studio-tab-fr" class="avatar_studio-tab-content">
                            <label for="welcome_message_fr"><strong>Welcome Message (Fr)</strong></label><br>
                            <input type="text" id="welcome_message_fr" class="regular-text full-width"
                                name="welcome_message[fr]" value="<?php echo $welcome_message['fr'] ?? ''; ?>" />
                        </div>
                        <div id="avatar_studio-tab-de" class="avatar_studio-tab-content">
                            <label for="welcome_message_de"><strong>Welcome Message (De)</strong></label><br>
                            <input type="text" id="welcome_message_de" class="regular-text full-width"
                                name="welcome_message[de]" value="<?php echo $welcome_message['de'] ?? ''; ?>" />
                        </div>


                    </div>
                </div>
            </div>

            <div class="col col-5 sm-col-10 ">
                <div id="chatBox-preview-area" class="preview-area mb-20">
                    <h2>Design Preview</h2>
                    <?php
                    global $avatar_studio_id;
                    global $livekit_enable;
                    global $avatar_vendor;
                    global $api_key;
                    global $chatBoxHeading;
                    global $video_enable;
                    global $chat_only;
                    global $avatar_id;
                    global $knowledge_id;
                    global $previewThumbnail;
                    global $previewImage;
                    global $avatar_name;
                    global $time_limit;
                    global $opening_text;
                    global $styles;
                    $chatBoxHeading = 'Chat with ' . ($avatar ? $avatar->avatar_name : 'Avatar Name') . '';
                    ?>
                    <div id="chatBox" class="show"
                        style="position: relative;bottom: 0;right: 0;margin: auto;transform: none;">

                        <div id="chat-widget">
                            <input type="hidden" id="pageId" value="<?php echo get_the_ID(); ?>">
                            <input type="hidden" id="avatarStudioId" value="<?php echo $avatar_studio_id; ?>">
                            <?php
                            require(plugin_dir_path(__FILE__) . '../avatarContainer.php'); ?>
                        </div>

                    </div>
                </div>

                <div class="boxed mb-20">
                    <?php
                    $styles = $avatar && $avatar->styles ? json_decode($avatar->styles, true) : [];

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
                        } else if ($key == 'chat-end-button') {
                            $chatEndButtonStyle = $style;
                        } else if ($key == 'mic-button') {
                            $micButtonStyle = $style;
                        } else if ($key == 'camera-button') {
                            $cameraButtonStyle = $style;
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
                                                    value="<?php echo (isset($chatBoxStyle['width'])) ? $chatBoxStyle['width'] : 550; ?>" />

                                                <span class="clear-btn"
                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                            </div>
                                        </div>

                                        <div class="style-wrapper">
                                            <label>Height:</label>
                                            <div class="input-controls">
                                                <input type="text" name="styles[chatBox][height]"
                                                    class="height-input height "
                                                    value="<?php echo (isset($chatBoxStyle['height'])) ? $chatBoxStyle['height'] : ''; ?>" />

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
                                                        class="background  gradient-color-picker"
                                                        data-alpha-enabled="true"
                                                        value="<?php echo (isset($chatBoxStyle['background'])) ? $chatBoxStyle['background'] : ''; ?>"
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
                                                    value="<?php echo (isset($chatBoxStyle['color'])) ? $chatBoxStyle['color'] : '#FFFFFF'; ?>" />
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
                                                            value="<?php echo (isset($chatBoxStyle['border']['width'])) ? $chatBoxStyle['border']['width'] : '1'; ?>" />
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
                                                            echo "<option value=\"$style\"" . ($selected == $style ? ' selected' : '') . ">$style</option>";
                                                        }
                                                        ?>
                                                    </select>
                                                </div>

                                                <!-- Color -->
                                                <div class="col">
                                                    <input type="color" name="styles[chatBox][border][color]"
                                                        id="heading-border-color" class="border-color"
                                                        value="<?php echo (isset($chatBoxStyle['border']['color'])) ? $chatBoxStyle['border']['color'] : '#000000'; ?>" />
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
                                                            value="<?php echo isset($chatBoxStyle['border-radius']['top']) ? $chatBoxStyle['border-radius']['top'] : ''; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[chatBox][border-radius][right]"
                                                            class="border-radius-input border-radius-right"
                                                            value="<?php echo isset($chatBoxStyle['border-radius']['right']) ? $chatBoxStyle['border-radius']['right'] : ''; ?>" />

                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[chatBox][border-radius][bottom]"
                                                            class="border-radius-input border-radius-bottom"
                                                            value="<?php echo isset($chatBoxStyle['border-radius']['bottom']) ? $chatBoxStyle['border-radius']['bottom'] : ''; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[chatBox][border-radius][left]"
                                                            class="border-radius-input border-radius-left"
                                                            value="<?php echo isset($chatBoxStyle['border-radius']['left']) ? $chatBoxStyle['border-radius']['left'] : ''; ?>" />
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
                                                            value="<?php echo (isset($chatBoxStyle['padding']['top'])) ? $chatBoxStyle['padding']['top'] : ''; ?>" />
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
                                                            value="<?php echo (isset($chatBoxStyle['padding']['right'])) ? $chatBoxStyle['padding']['right'] : ''; ?>" />
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
                                                            value="<?php echo (isset($chatBoxStyle['padding']['bottom'])) ? $chatBoxStyle['padding']['bottom'] : ''; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[chatBox][padding][left]"
                                                            id="heading-padding-left" class="padding-input padding-left"
                                                            value="<?php echo (isset($chatBoxStyle['padding']['left'])) ? $chatBoxStyle['padding']['left'] : ''; ?>" />
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
                                                        value="<?php echo (isset($thumbnailStyle['mini']['width'])) ? $thumbnailStyle['mini']['width'] : 80; ?>" />
                                                    <span class="clear-btn"
                                                        onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                </div>
                                            </div>

                                            <div class="style-wrapper">
                                                <label>Height:</label>
                                                <div class="input-controls">
                                                    <input type="text" name="styles[thumbnail][mini][height]"
                                                        class="height-input height "
                                                        value="<?php echo (isset($thumbnailStyle['mini']['height'])) ? $thumbnailStyle['mini']['height'] : ''; ?>" />

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
                                                        value="<?php echo (isset($thumbnailStyle['medium']['width'])) ? $thumbnailStyle['medium']['width'] : 150; ?>" />
                                                    <span class="clear-btn"
                                                        onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                </div>
                                            </div>

                                            <div class="style-wrapper">
                                                <label>Height:</label>
                                                <div class="input-controls">
                                                    <input type="text" name="styles[thumbnail][medium][height]"
                                                        class="height-input height "
                                                        value="<?php echo (isset($thumbnailStyle['medium']['height'])) ? $thumbnailStyle['medium']['height'] : ''; ?>" />

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
                                                        value="<?php echo (isset($thumbnailStyle['large']['width'])) ? $thumbnailStyle['large']['width'] : 200; ?>" />
                                                    <span class="clear-btn"
                                                        onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                </div>
                                            </div>

                                            <div class="style-wrapper">
                                                <label>Height:</label>
                                                <div class="input-controls">
                                                    <input type="text" name="styles[thumbnail][large][height]"
                                                        class="height-input height "
                                                        value="<?php echo (isset($thumbnailStyle['large']['height'])) ? $thumbnailStyle['large']['height'] : ''; ?>" />

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
                                                        class="background  gradient-color-picker"
                                                        data-alpha-enabled="true"
                                                        value="<?php echo (isset($headingStyle['background'])) ? $headingStyle['background'] : ''; ?>"
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
                                                    value="<?php echo (isset($headingStyle['color'])) ? $headingStyle['color'] : '#FFFFFF'; ?>" />
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
                                                            value="<?php echo (isset($headingStyle['border']['width'])) ? $headingStyle['border']['width'] : '1'; ?>" />
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
                                                            echo "<option value=\"$style\"" . ($selected == $style ? ' selected' : '') . ">$style</option>";
                                                        }
                                                        ?>
                                                    </select>
                                                </div>

                                                <!-- Color -->
                                                <div class="col">
                                                    <input type="color" name="styles[heading][border][color]"
                                                        id="heading-border-color" class="border-color"
                                                        value="<?php echo (isset($headingStyle['border']['color'])) ? $headingStyle['border']['color'] : '#000000'; ?>" />
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
                                                            value="<?php echo isset($headingStyle['border-radius']['top']) ? $headingStyle['border-radius']['top'] : ''; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[heading][border-radius][right]"
                                                            class="border-radius-input border-radius-right"
                                                            value="<?php echo isset($headingStyle['border-radius']['right']) ? $headingStyle['border-radius']['right'] : ''; ?>" />

                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[heading][border-radius][bottom]"
                                                            class="border-radius-input border-radius-bottom"
                                                            value="<?php echo isset($headingStyle['border-radius']['bottom']) ? $headingStyle['border-radius']['bottom'] : ''; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[heading][border-radius][left]"
                                                            class="border-radius-input border-radius-left"
                                                            value="<?php echo isset($headingStyle['border-radius']['left']) ? $headingStyle['border-radius']['left'] : ''; ?>" />
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
                                                            value="<?php echo (isset($headingStyle['padding']['top'])) ? $headingStyle['padding']['top'] : ''; ?>" />
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
                                                            value="<?php echo (isset($headingStyle['padding']['right'])) ? $headingStyle['padding']['right'] : ''; ?>" />
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
                                                            value="<?php echo (isset($headingStyle['padding']['bottom'])) ? $headingStyle['padding']['bottom'] : ''; ?>" />
                                                        <span class="clear-btn"
                                                            onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[heading][padding][left]"
                                                            id="heading-padding-left" class="padding-input padding-left"
                                                            value="<?php echo (isset($headingStyle['padding']['left'])) ? $headingStyle['padding']['left'] : ''; ?>" />
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
                                                    value="<?php echo (isset($headingStyle['font-size'])) ? $headingStyle['font-size'] : 14; ?>" />
                                            </div>
                                        </div>

                                        <div class="style-wrapper">
                                            <label>Line height:</label>
                                            <div class="input-controls">
                                                <input type="number" min="0" name="styles[heading][line-height]"
                                                    class="line-height "
                                                    value="<?php echo (isset($headingStyle['line-height'])) ? $headingStyle['line-height'] : ''; ?>" />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div id="avatar_studio-tab-buttons" class="avatar_studio-tab-content  ">
                                <!--Button Start  -->
                                <div class="avatar_studio-tabs">
                                    <div class="avatar_studio-tab-buttons">
                                        <button type="button" class="tab-btn active" data-tab="start-button">Start
                                            Button</button>
                                        <button type="button" class="tab-btn" data-tab="end-button">End
                                            Button</button>
                                        <button type="button" class="tab-btn" data-tab="mic-button">Mic
                                            Button</button>
                                        <button type="button" class="tab-btn" data-tab="camera-button">Camera
                                            Button</button>
                                    </div>

                                    <div id="avatar_studio-tab-start-button" class="avatar_studio-tab-content active">

                                        <div class="row chat-start-button">
                                            <div class="col col-5">
                                                <div class="style-wrapper">
                                                    <label>Button Label:</label>
                                                    <div class="input-controls">
                                                        <input type="text" name="start_button_label"
                                                            id="start_button_label" class=" "
                                                            value="<?php echo $avatar && $avatar->start_button_label ? stripslashes($avatar->start_button_label) : ''; ?>" />
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Background:</label>
                                                    <div class="input-controls">
                                                        <div class="input-with-clear">
                                                            <input type="text"
                                                                name="styles[chat-start-button][background]"
                                                                class="background  gradient-color-picker"
                                                                data-alpha-enabled="true"
                                                                value="<?php echo (isset($chatStartButtonStyle['background'])) ? $chatStartButtonStyle['background'] : 'rgba(29, 78, 216, 0.5)'; ?>" />
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
                                                            value="<?php echo (isset($chatStartButtonStyle['color'])) ? $chatStartButtonStyle['color'] : '#FFFFFF'; ?>" />
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
                                                                    value="<?php echo (isset($chatStartButtonStyle['border']['width'])) ? $chatStartButtonStyle['border']['width'] : '1'; ?>" />
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
                                                                    echo "<option value=\"$style\"" . ($selected == $style ? ' selected' : '') . ">$style</option>";
                                                                }
                                                                ?>
                                                            </select>
                                                        </div>

                                                        <!-- Color -->
                                                        <div class="col">
                                                            <input type="color"
                                                                name="styles[chat-start-button][border][color]"
                                                                id="heading-border-color" class="border-color"
                                                                value="<?php echo (isset($chatStartButtonStyle['border']['color'])) ? $chatStartButtonStyle['border']['color'] : '#000000'; ?>" />
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
                                                                    value="<?php echo isset($chatStartButtonStyle['border-radius']['top']) ? $chatStartButtonStyle['border-radius']['top'] : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[chat-start-button][border-radius][right]"
                                                                    class="border-radius-input border-radius-right"
                                                                    value="<?php echo isset($chatStartButtonStyle['border-radius']['right']) ? $chatStartButtonStyle['border-radius']['right'] : ''; ?>" />

                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[chat-start-button][border-radius][bottom]"
                                                                    class="border-radius-input border-radius-bottom"
                                                                    value="<?php echo isset($chatStartButtonStyle['border-radius']['bottom']) ? $chatStartButtonStyle['border-radius']['bottom'] : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[chat-start-button][border-radius][left]"
                                                                    class="border-radius-input border-radius-left"
                                                                    value="<?php echo isset($chatStartButtonStyle['border-radius']['left']) ? $chatStartButtonStyle['border-radius']['left'] : ''; ?>" />
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
                                                                    value="<?php echo (isset($chatStartButtonStyle['padding']['top'])) ? $chatStartButtonStyle['padding']['top'] : ''; ?>" />
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
                                                                    value="<?php echo (isset($chatStartButtonStyle['padding']['right'])) ? $chatStartButtonStyle['padding']['right'] : ''; ?>" />
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
                                                                    value="<?php echo (isset($chatStartButtonStyle['padding']['bottom'])) ? $chatStartButtonStyle['padding']['bottom'] : ''; ?>" />
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
                                                                    value="<?php echo (isset($chatStartButtonStyle['padding']['left'])) ? $chatStartButtonStyle['padding']['left'] : ''; ?>" />
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
                                                            value="<?php echo (isset($chatStartButtonStyle['font-size'])) ? $chatStartButtonStyle['font-size'] : 14; ?>" />
                                                    </div>
                                                </div>

                                                <div class="style-wrapper">
                                                    <label>Line height:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[chat-start-button][line-height]"
                                                            class="line-height "
                                                            value="<?php echo (isset($chatStartButtonStyle['line-height'])) ? $chatStartButtonStyle['line-height'] : ''; ?>" />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div id="avatar_studio-tab-end-button" class="avatar_studio-tab-content  ">
                                        <div class="row chat-end-button">
                                            <div class="col col-5">
                                                <div class="style-wrapper">
                                                    <label>Background:</label>
                                                    <div class="input-controls">

                                                        <div class="input-with-clear">
                                                            <input type="text"
                                                                name="styles[chat-end-button][background]"
                                                                class="background  gradient-color-picker"
                                                                data-alpha-enabled="true"
                                                                value="<?php echo (isset($chatEndButtonStyle['background'])) ? $chatEndButtonStyle['background'] : '#1D4ED8'; ?>" />
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
                                                            value="<?php echo (isset($chatEndButtonStyle['color'])) ? $chatEndButtonStyle['color'] : '#FFFFFF'; ?>" />
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
                                                                    value="<?php echo (isset($chatEndButtonStyle['border']['width'])) ? $chatEndButtonStyle['border']['width'] : '1'; ?>" />
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
                                                                    echo "<option value=\"$style\"" . ($selected == $style ? ' selected' : '') . ">$style</option>";
                                                                }
                                                                ?>
                                                            </select>
                                                        </div>

                                                        <!-- Color -->
                                                        <div class="col">
                                                            <input type="color"
                                                                name="styles[chat-end-button][border][color]"
                                                                id="heading-border-color" class="border-color"
                                                                value="<?php echo (isset($chatEndButtonStyle['border']['color'])) ? $chatEndButtonStyle['border']['color'] : '#000000'; ?>" />
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
                                                                    value="<?php echo isset($chatEndButtonStyle['border-radius']['top']) ? $chatEndButtonStyle['border-radius']['top'] : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[chat-end-button][border-radius][right]"
                                                                    class="border-radius-input border-radius-right"
                                                                    value="<?php echo isset($chatEndButtonStyle['border-radius']['right']) ? $chatEndButtonStyle['border-radius']['right'] : ''; ?>" />

                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[chat-end-button][border-radius][bottom]"
                                                                    class="border-radius-input border-radius-bottom"
                                                                    value="<?php echo isset($chatEndButtonStyle['border-radius']['bottom']) ? $chatEndButtonStyle['border-radius']['bottom'] : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[chat-end-button][border-radius][left]"
                                                                    class="border-radius-input border-radius-left"
                                                                    value="<?php echo isset($chatEndButtonStyle['border-radius']['left']) ? $chatEndButtonStyle['border-radius']['left'] : ''; ?>" />
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
                                                                    value="<?php echo (isset($chatEndButtonStyle['padding']['top'])) ? $chatEndButtonStyle['padding']['top'] : ''; ?>" />
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
                                                                    value="<?php echo (isset($chatEndButtonStyle['padding']['right'])) ? $chatEndButtonStyle['padding']['right'] : ''; ?>" />
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
                                                                    value="<?php echo (isset($chatEndButtonStyle['padding']['bottom'])) ? $chatEndButtonStyle['padding']['bottom'] : ''; ?>" />
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
                                                                    value="<?php echo (isset($chatEndButtonStyle['padding']['left'])) ? $chatEndButtonStyle['padding']['left'] : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Text Align:</label>
                                                    <div class="input-controls">
                                                        <?php $textAlign = (isset($chatEndButtonStyle['text-align'])) ? $chatEndButtonStyle['text-align'] : 'left'; ?>
                                                        <select name="styles[chat-end-button][text-align]"
                                                            class="text-align-select text-align">
                                                            <option value="left" <?php echo $textAlign == 'left' ? 'selected="selected"' : ''; ?>> Left</option>
                                                            <option value="center" <?php echo $textAlign == 'center' ? 'selected="selected"' : ''; ?>>Center</option>
                                                            <option value="right" <?php echo $textAlign == 'right' ? 'selected="selected"' : ''; ?>>Right</option>
                                                            <option value="justify" <?php echo $textAlign == 'justify' ? 'selected="selected"' : ''; ?>>Justify</option>
                                                            <option value="start" <?php echo $textAlign == 'start' ? 'selected="selected"' : ''; ?>>Start</option>
                                                            <option value="end" <?php echo $textAlign == 'end' ? 'selected="selected"' : ''; ?>> End</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Font Size:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[chat-end-button][font-size]" class="font-size "
                                                            value="<?php echo (isset($chatEndButtonStyle['font-size'])) ? $chatEndButtonStyle['font-size'] : 14; ?>" />
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Line height:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[chat-end-button][line-height]"
                                                            class="line-height "
                                                            value="<?php echo (isset($chatEndButtonStyle['line-height'])) ? $chatEndButtonStyle['line-height'] : ''; ?>" />
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
                                                                class="background  gradient-color-picker"
                                                                data-alpha-enabled="true"
                                                                value="<?php echo (isset($micButtonStyle['background'])) ? $micButtonStyle['background'] : '#EF4444'; ?>" />
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
                                                            value="<?php echo (isset($micButtonStyle['color'])) ? $micButtonStyle['color'] : '#FFFFFF'; ?>" />
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
                                                                    value="<?php echo (isset($micButtonStyle['border']['width'])) ? $micButtonStyle['border']['width'] : '1'; ?>" />
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
                                                                    echo "<option value=\"$style\"" . ($selected == $style ? ' selected' : '') . ">$style</option>";
                                                                }
                                                                ?>
                                                            </select>
                                                        </div>

                                                        <!-- Color -->
                                                        <div class="col">
                                                            <input type="color" name="styles[mic-button][border][color]"
                                                                id="heading-border-color" class="border-color"
                                                                value="<?php echo (isset($micButtonStyle['border']['color'])) ? $micButtonStyle['border']['color'] : '#000000'; ?>" />
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
                                                                    value="<?php echo isset($micButtonStyle['border-radius']['top']) ? $micButtonStyle['border-radius']['top'] : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[mic-button][border-radius][right]"
                                                                    class="border-radius-input border-radius-right"
                                                                    value="<?php echo isset($micButtonStyle['border-radius']['right']) ? $micButtonStyle['border-radius']['right'] : ''; ?>" />

                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[mic-button][border-radius][bottom]"
                                                                    class="border-radius-input border-radius-bottom"
                                                                    value="<?php echo isset($micButtonStyle['border-radius']['bottom']) ? $micButtonStyle['border-radius']['bottom'] : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[mic-button][border-radius][left]"
                                                                    class="border-radius-input border-radius-left"
                                                                    value="<?php echo isset($micButtonStyle['border-radius']['left']) ? $micButtonStyle['border-radius']['left'] : ''; ?>" />
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
                                                                    value="<?php echo (isset($micButtonStyle['padding']['top'])) ? $micButtonStyle['padding']['top'] : ''; ?>" />
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
                                                                    value="<?php echo (isset($micButtonStyle['padding']['right'])) ? $micButtonStyle['padding']['right'] : ''; ?>" />
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
                                                                    value="<?php echo (isset($micButtonStyle['padding']['bottom'])) ? $micButtonStyle['padding']['bottom'] : ''; ?>" />
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
                                                                    value="<?php echo (isset($micButtonStyle['padding']['left'])) ? $micButtonStyle['padding']['left'] : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="style-wrapper">
                                                    <label>Text Align:</label>
                                                    <div class="input-controls">
                                                        <?php $textAlign = (isset($micButtonStyle['text-align'])) ? $micButtonStyle['text-align'] : 'left'; ?>
                                                        <select name="styles[mic-button][text-align]"
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
                                                            name="styles[mic-button][font-size]" class="font-size "
                                                            value="<?php echo (isset($micButtonStyle['font-size'])) ? $micButtonStyle['font-size'] : 14; ?>" />
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Line height:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[mic-button][line-height]" class="line-height "
                                                            value="<?php echo (isset($micButtonStyle['line-height'])) ? $micButtonStyle['line-height'] : ''; ?>" />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>

                                    <div id="avatar_studio-tab-camera-button" class="avatar_studio-tab-content  ">

                                        <div class="row camera-button">
                                            <div class="col col-5">
                                                <div class="style-wrapper">
                                                    <label>Background:</label>
                                                    <div class="input-controls">

                                                        <div class="input-with-clear">
                                                            <input type="text" name="styles[camera-button][background]"
                                                                class="background  gradient-color-picker"
                                                                data-alpha-enabled="true"
                                                                value="<?php echo (isset($cameraButtonStyle['background'])) ? $cameraButtonStyle['background'] : '#EF4444'; ?>" />
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
                                                            value="<?php echo (isset($cameraButtonStyle['color'])) ? $cameraButtonStyle['color'] : '#FFFFFF'; ?>" />
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
                                                                    value="<?php echo (isset($cameraButtonStyle['border']['width'])) ? $cameraButtonStyle['border']['width'] : '1'; ?>" />
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
                                                                    echo "<option value=\"$style\"" . ($selected == $style ? ' selected' : '') . ">$style</option>";
                                                                }
                                                                ?>
                                                            </select>
                                                        </div>

                                                        <!-- Color -->
                                                        <div class="col">
                                                            <input type="color"
                                                                name="styles[camera-button][border][color]"
                                                                id="heading-border-color" class="border-color"
                                                                value="<?php echo (isset($cameraButtonStyle['border']['color'])) ? $cameraButtonStyle['border']['color'] : '#000000'; ?>" />
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
                                                                    value="<?php echo isset($cameraButtonStyle['border-radius']['top']) ? $cameraButtonStyle['border-radius']['top'] : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[camera-button][border-radius][right]"
                                                                    class="border-radius-input border-radius-right"
                                                                    value="<?php echo isset($cameraButtonStyle['border-radius']['right']) ? $cameraButtonStyle['border-radius']['right'] : ''; ?>" />

                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[camera-button][border-radius][bottom]"
                                                                    class="border-radius-input border-radius-bottom"
                                                                    value="<?php echo isset($cameraButtonStyle['border-radius']['bottom']) ? $cameraButtonStyle['border-radius']['bottom'] : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="input-controls">
                                                                <input type="number" min="0"
                                                                    name="styles[camera-button][border-radius][left]"
                                                                    class="border-radius-input border-radius-left"
                                                                    value="<?php echo isset($cameraButtonStyle['border-radius']['left']) ? $cameraButtonStyle['border-radius']['left'] : ''; ?>" />
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
                                                                    value="<?php echo (isset($cameraButtonStyle['padding']['top'])) ? $cameraButtonStyle['padding']['top'] : ''; ?>" />
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
                                                                    value="<?php echo (isset($cameraButtonStyle['padding']['right'])) ? $cameraButtonStyle['padding']['right'] : ''; ?>" />
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
                                                                    value="<?php echo (isset($cameraButtonStyle['padding']['bottom'])) ? $cameraButtonStyle['padding']['bottom'] : ''; ?>" />
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
                                                                    value="<?php echo (isset($cameraButtonStyle['padding']['left'])) ? $cameraButtonStyle['padding']['left'] : ''; ?>" />
                                                                <span class="clear-btn"
                                                                    onclick="this.previousElementSibling.value=''; this.style.display='none';">&#x2715;</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="style-wrapper">
                                                    <label>Text Align:</label>
                                                    <div class="input-controls">
                                                        <?php $textAlign = (isset($cameraButtonStyle['text-align'])) ? $cameraButtonStyle['text-align'] : 'left'; ?>
                                                        <select name="styles[camera-button][text-align]"
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
                                                            name="styles[camera-button][font-size]" class="font-size "
                                                            value="<?php echo (isset($cameraButtonStyle['font-size'])) ? $cameraButtonStyle['font-size'] : 14; ?>" />
                                                    </div>
                                                </div>
                                                <div class="style-wrapper">
                                                    <label>Line height:</label>
                                                    <div class="input-controls">
                                                        <input type="number" min="0"
                                                            name="styles[camera-button][line-height]"
                                                            class="line-height "
                                                            value="<?php echo (isset($cameraButtonStyle['line-height'])) ? $cameraButtonStyle['line-height'] : ''; ?>" />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>

                                </div>
                                <!--Button End  -->
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
        <style>
            #saveBtn {
                background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
                color: #fff;
                padding: 6px 18px;
                border-radius: 6px;
                border: none;
            }
            #saveBtn:hover {
                background: linear-gradient(135deg, #38b1c5 10%, #da922c 90%);
            }
        </style>
    </form>

</div>

<script>
    let plugin_dir_url = '<?php echo plugin_dir_url(__FILE__); ?>../';
    function isNumeric(value) {
        return value !== '' && value !== null && !isNaN(value) && isFinite(value);
    }

    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const avatar_studioTabs = e.target.closest('.avatar_studio-tabs');
            const tab = e.target.getAttribute('data-tab');

            // Remove active class from all buttons
            avatar_studioTabs.querySelectorAll(':scope > .tab-btn').forEach(btn => btn.classList.remove('active'));

            // Hide all tab contents
            avatar_studioTabs.querySelectorAll(':scope > .avatar_studio-tab-content').forEach(content => content.classList.remove('active'));

            // Activate selected tab
            avatar_studioTabs.querySelector('#avatar_studio-tab-' + tab).classList.add('active');
            e.target.classList.add('active');
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



        const avatar_title = document.getElementById('avatar_title').value.trim();
        const preview_image = document.getElementById('preview_image').value.trim();
        if (previewImage) {
            previewImage.src = preview_image || '<?php echo $previewImage; ?>';
        }
        if (avatarVideo) {
            avatarVideo.setAttribute('poster', preview_image || '<?php echo $previewImage; ?>');
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
                });

                frame.open();
            });
        });

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
            });
        });

    });

</script>