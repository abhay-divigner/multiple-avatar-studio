<?php


if (!defined('ABSPATH'))
    exit;
$avatar = isset($avatar) ? $avatar : null;

global $avatar_vendor;

// Get vendor from URL if provided (tavus or heygen)
$get_vendor = (isset($_GET['vendor']) && ($_GET['vendor'] == 'tavus' || $_GET['vendor'] == 'heygen'))
                ? sanitize_text_field($_GET['vendor'])
                : null;

// Set final vendor: GET vendor OR avatar vendor OR default
$avatar_vendor = $get_vendor || ($avatar->vendor == "tavus") ? "tavus" : "heygen";

$all_pages = get_pages();
$previewImage = plugin_dir_url(__FILE__) . '../assets/images/preview.webp';
?>

<link rel="stylesheet" crossorigin="anonymous" referrerpolicy="no-referrer" integrity="sha512-…your-integrity-hash…"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

<style>
    /* Full Width Form Section with Grid Layout */
.avatar-form-grid-section {
    width: 100%;
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
    overflow: hidden;
}

.avatar-form-grid-header {
    background: linear-gradient(135deg, rgba(56, 177, 197, 0.08) 0%, rgba(218, 146, 44, 0.08) 100%);
    padding: 20px;
    position: relative;
    display: flex;
    justify-content: space-between;
}

.avatar-form-grid-header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #38b1c5 0%, #da922c 100%);
}

.avatar-form-grid-header h2 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: flex;
    align-items: center;
    gap: 12px;
}

.avatar-form-grid-body {
    padding: 36px 36px 0 36px;
}

/* Grid Layout for Form Fields */
.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    margin-bottom: 30px;
}

.form-grid.single-column {
    grid-template-columns: 1fr;
}

.form-grid.three-columns {
    grid-template-columns: repeat(3, 1fr);
    /* margin-top: -16px; */

}

.input-grid {
    /* margin-bottom: 24px; */
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-field label {
    font-weight: 600;
    color: #334155;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
}

#edit-page-logo {
    margin-bottom: 0 !important;
}

.form-field input[type="text"],
.form-field input[type="number"],
.form-field input[type="password"],
.form-field select {
    width: 100%;
    padding: 10px 14px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s ease;
    background: white;
}

.form-field input:focus,
.form-field select:focus {
    outline: none;
    border: 2px solid transparent;
    background-image: 
        linear-gradient(white, white),
        linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
    background-origin: border-box;
    background-clip: padding-box, border-box;
    box-shadow: 0 0 0 4px rgba(56, 177, 197, 0.1);
}

.form-field .field-description {
    margin: 0;
    color: #6b7280;
    font-size: 13px;
    line-height: 1.5;
}

/* Tick-boxes */

input[type=checkbox]:checked::before {
    margin: -0.1275rem 0px 0 -0.15rem;
}

/* Vendor Display Styling */
/* .vendor-display {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    background: linear-gradient(135deg, rgba(56, 177, 197, 0.08) 0%, rgba(218, 146, 44, 0.08) 100%);
    border: 2px solid transparent;
    background-image: 
        linear-gradient(135deg, rgba(56, 177, 197, 0.08) 0%, rgba(218, 146, 44, 0.08) 100%),
        linear-gradient(135deg, rgba(56, 177, 197, 0.3) 0%, rgba(218, 146, 44, 0.3) 100%);
    background-origin: border-box;
    background-clip: padding-box, border-box;
    border-radius: 8px;
} */

.vendor-display strong {
    font-size: 15px;
    font-weight: 600;
    background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-transform: capitalize;
}

.vendor-display img {
    max-width: 100px;
    height: auto;
}

/* Radio Button Group */
.radio-group {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.radio-option {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.radio-option input[type="radio"] {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #d1d5db;
    border-radius: 50%;
    margin: 0;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;
}

.radio-option input[type="radio"]:checked {
    border: 2px solid transparent;
    background-image: 
        linear-gradient(white, white),
        linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
    background-origin: border-box;
    background-clip: padding-box, border-box;
}

.radio-option input[type="radio"]:checked::after {
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

.radio-option input[type="radio"]:hover {
    border-color: #38b1c5;
}

.radio-option label {
    margin: 0;
    cursor: pointer;
    font-size: 14px;
    color: #334155;
}

/* Image Uploader in Grid */
.form-field .image-uploader-wrap {
    display: flex;
    flex-direction: row;
    gap: 12px;
}

.form-field .image-uploader-wrap .image-preview {
    max-width: 88px;
    border-radius: 4px;
}

.form-field .image-uploader-wrap .upload-controls {
    display: flex;
    gap: 8px;
    max-width: 596px;
    width: 100%;
}

.form-field .image-uploader-wrap input[type="text"] {
    flex: 1;
}

.form-field .image-uploader-wrap .button {
    padding: 10px 16px !important;
    border-radius: 6px !important;
    border: 2px solid #e5e7eb !important;
    background: white !important;
    transition: all 0.2s ease !important;
    height: auto !important;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.form-field .image-uploader-wrap .button:hover {
    border-color: #dc2626 !important;
    background: linear-gradient(135deg, rgba(56, 177, 197, 0.05) 0%, rgba(218, 146, 44, 0.05) 100%) !important;
}

.form-field .image-uploader-wrap .upload-image-btn {
    border-color: #38b1c5 !important;
}

.form-field .image-uploader-wrap .upload-image-btn:hover {
    border-color: #38b1c5 !important;
}

.form-field .image-uploader-wrap .remove-image-btn {
    border-color: #dc2626 !important;
}

.form-field .image-uploader-wrap .remove-image-btn:hover {
    /* background: #dc2626 !important; */
    color: #dc2626 !important;
}

/* Select2 in Grid */
.form-field .select2-container {
    width: 100% !important;
}

.form-field .select2-container--default .select2-selection--multiple {
    border: 2px solid #e5e7eb !important;
    border-radius: 8px !important;
    min-height: 42px !important;
    padding: 4px !important;
}

.form-field .select2-container--default.select2-container--focus .select2-selection--multiple {
    border: 2px solid transparent !important;
    background-image: 
        linear-gradient(white, white),
        linear-gradient(135deg, #38b1c5 0%, #da922c 100%) !important;
    background-origin: border-box !important;
    background-clip: padding-box, border-box !important;
    box-shadow: 0 0 0 4px rgba(56, 177, 197, 0.1) !important;
}

/* Tooltip in Grid */
.form-field .tooltip-icon {
    width: 18px;
    height: 18px;
    background: transparent;
    border: 2px solid transparent;
    background-image: 
        linear-gradient(white, white),
        linear-gradient(135deg, rgba(56, 177, 197, 0.5) 0%, rgba(218, 146, 44, 0.5) 100%);
    background-origin: border-box;
    background-clip: padding-box, border-box;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: help;
    font-size: 12px;
    font-weight: 700;
    color: #38b1c5;
}

.form-field .tooltip-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
}

.form-field .tooltip-content {
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

.form-field .tooltip-content::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #1f2937;
}

.form-field .tooltip-icon:hover + .tooltip-content {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
}

/* Number Input Styling */
.form-field input[type="number"] {
    max-width: 150px;
}

/* Divider */
.form-divider {
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, #38b1c5 25%, #da922c 75%, transparent 100%);
    margin: 20px 0;
}

/* Responsive Design */
@media (max-width: 1200px) {
    .form-grid.three-columns {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 782px) {
    .avatar-form-grid-body {
        padding: 20px;
    }
    
    .form-grid,
    .form-grid.three-columns {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .radio-group {
        flex-direction: column;
        gap: 12px;
    }
    
    .form-field input[type="number"] {
        max-width: 100%;
    }
    
    .form-field .image-uploader-wrap .upload-controls {
        flex-direction: column;
    }
    
    .form-field .image-uploader-wrap input[type="text"] {
        width: 100%;
    }
}

/* Hide/Show based on conditions */
.voice-emotion-row {
    display: block;
}

.voice-emotion-row.hidden {
    display: none;
}
.avatar-form-grid-section .hidden {
    display: none !important;
}

.page-header {
    background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
    padding: 30px;
    border-radius: 16px;
    margin-bottom: 30px;
    box-shadow: 0 10px 40px rgba(56, 177, 197, 0.2);
}

.page-header h1 {
    color: white;
    font-size: 28px;
    font-weight: 600;
    margin: 0;
}

.boxed {
    background: white;
    border-radius: 12px;
    padding: 20px 30px;
    /* margin-bottom: 24px; */
}

.boxed h2 {
    /* color: #2c3e50; */
    font-size: 24px;
    font-weight: 700;
    /* margin-bottom: 24px; */
    padding-bottom: 12px;
    /* border-bottom: 2px solid #e9ecef; */
    background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
}

.form-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 12px;
}

.form-table tr {
    transition: background-color 0.2s;
}

.form-table th {
    text-align: left;
    /* padding: 12px 20px 0 0; */
    font-weight: 600;
    color: #495057;
    font-size: 14px;
    vertical-align: top;
    width: 18%;
}

.form-table th small {
    display: block;
    color: #6c757d;
    font-weight: 400;
    font-size: 12px;
    margin-top: 4px;
    line-height: 1.4;
}

.form-table td {
    padding: 8px 0;
    vertical-align: middle;
}

input[type="text"],
input[type="url"] {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s;
    background: #f8f9fa;
}

input[type="text"]:focus,
input[type="url"]:focus {
    outline: none;
    border-color: #38b1c5;
    background: white;
    box-shadow: 0 0 0 4px rgba(56, 177, 197, 0.1);
}

input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: #38b1c5;
}

.editor-wrapper {
    border: 2px solid #e9ecef;
    border-radius: 8px;
    padding: 16px;
    background: #f8f9fa;
    min-height: 200px;
    transition: border-color 0.3s;
}

.editor-wrapper:focus-within {
    border-color: #38b1c5;
    background: white;
}

.avatar_studio-tabs {
    margin-top: 34px;
}

.avatar_studio-tab-buttons {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 0;
}

.tab-btn {
    background: transparent;
    border: none;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 500;
    color: #6c757d;
    cursor: pointer;
    transition: all 0.3s;
    border-bottom: 3px solid transparent;
    position: relative;
    bottom: -2px;
}

.tab-btn:hover {
    color: #38b1c5;
    background: rgba(56, 177, 197, 0.05);
}

.tab-btn.active {
    color: #38b1c5;
    border-bottom-color: #38b1c5;
    font-weight: 600;
}

.avatar_studio-tab-content {
    display: none;
    padding: 24px;
    background: #f8f9fa;
    border-radius: 8px;
    animation: fadeIn 0.3s;
}

.avatar_studio-tab-content.active {
    display: block;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.avatar_studio-tab-content label {
    display: block;
    margin-bottom: 8px;
    color: #495057;
    font-weight: 600;
    font-size: 14px;
}

.full-width {
    width: 100%;
}

.section-badge {
    display: inline-block;
    /* background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%); */
    color: white;
    /* padding: 4px 12px; */
    /* border-radius: 12px; */
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    /* letter-spacing: 0.5px; */
    /* margin-left: 12px; */
}

.toggle-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
}

.toggle-label {
    font-size: 14px;
    color: #6c757d;
}

/* Main Container - Equal Width Columns */
.col.col-5.sm-col-10[style*="display: flex"] {
    display: flex !important;
    gap: 20px;
}

.col.col-5.sm-col-10[style*="display: flex"] > .boxed,
.col.col-5.sm-col-10[style*="display: flex"] > .preview-area {
    flex: 1;
    min-width: 0;
}

#streamingCountdown {
    display: none;
}

/* design-preview */

#design-preview {
    width: 100%;
    background: white;
    border: 2px solid transparent;
    background-image: linear-gradient(white, white), linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
    background-origin: border-box;
    background-clip: padding-box, border-box;
    border-radius: 12px;
    margin-bottom: 24px;
    box-shadow: 0 4px 15px rgba(56, 177, 197, 0.1);
    padding-top: 12px;
}

@media (max-width: 768px) {
    .form-table th,
    .form-table td {
        display: block;
        width: 100%;
        padding: 8px 0;
    }

    .form-table th {
        margin-bottom: 8px;
    }

    .tab-btn {
        padding: 10px 16px;
        font-size: 13px;
    }

    .boxed {
        padding: 20px;
    }
}

</style>


<div class="avatar-form">
    <form id="avatarForm" method="post" action="<?php echo admin_url('admin-post.php') ?>">
    <?php 
    // Get the ID from URL or from avatar object
    $id = isset($_GET['id']) ? intval($_GET['id']) : ($avatar ? $avatar->id : 0);
    $is_edit = ($id > 0);
    wp_nonce_field($is_edit ? 'update_avatar' : 'save_avatar'); 
    ?>

    <input type="hidden" name="action" value="<?php echo $is_edit ? 'update_avatar' : 'save_avatar' ?>">
    <?php if ($is_edit) { ?>
        <input type="hidden" name="id" value="<?php echo $id; ?>">
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
                                <!-- <strong><?php echo $avatar && $avatar->vendor ? ucfirst(esc_html($avatar->vendor)) : 'Not Selected'; ?></strong> -->
                                <?php if ($avatar && $avatar->vendor === 'tavus'): ?>
                                    <img src="<?php echo get_site_url(); ?>/wp-content/plugins/AvatarStudio/assets/images/tavus_full_logo.png" alt="Tavus Logo">
                                <?php elseif ($avatar && $avatar->vendor === 'heygen'): ?>
                                    <img src="<?php echo get_site_url(); ?>/wp-content/plugins/AvatarStudio/assets/images/heygen_full_logo.png" alt="Heygen Logo">
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
                                <span style="color: #38b1c5;">✓ Using global <?php echo ucfirst($avatar_vendor); ?> API key</span>
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

                    
                    <!-- <div class="form-divider"></div> -->
                    
                    <!-- Row 4: Time Limit + Voice Emotion -->
                    <!-- <div class="form-grid">
                        
                        <div class="form-field voice-emotion-row <?php echo ($avatar && $avatar->vendor == 'tavus') ? 'hidden' : ''; ?>">
                            <label for="voice_emotion">Voice Emotion</label>
                            <select name="voice_emotion" id="voice_emotion">
                                <option value="excited" <?php echo $avatar && $avatar->voice_emotion == 'excited' ? 'selected' : ''; ?>>Excited</option>
                                <option value="serious" <?php echo $avatar && $avatar->voice_emotion == 'serious' ? 'selected' : ''; ?>>Serious</option>
                                <option value="friendly" <?php echo $avatar && $avatar->voice_emotion == 'friendly' ? 'selected' : ''; ?>>Friendly</option>
                                <option value="soothing" <?php echo $avatar && $avatar->voice_emotion == 'soothing' ? 'selected' : ''; ?>>Soothing</option>
                                <option value="broadcaster" <?php echo $avatar && $avatar->voice_emotion == 'broadcaster' ? 'selected' : ''; ?>>Broadcaster</option>
                            </select>
                        </div>
                    </div> -->
                    
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

                    </div>
                    
                    <!-- Row 7: Chat Window Pages (Full Width) -->
                    <div class="form-grid" style="grid-template-columns: repeat(3, 1fr);">
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
                        <div class="form-grid single-column">
                            <div class="form-field">
                                <label for="chat_window_pages">
                                    Chat Window Pages *
                                    <span class="tooltip-wrapper">
                                        <span class="tooltip-icon">?</span>
                                        <span class="tooltip-content">Select pages where chat widget will appear</span>
                                    </span>
                                </label>
                                <?php $pages = $avatar && $avatar->pages ? json_decode($avatar->pages, true) : []; ?>
                                <select name="pages[]" id="chat_window_pages" class="select2 full-width" multiple="multiple" required data-placeholder="Select pages for chat widget...">
                                    <option value=""></option>
                                    <?php
                                    foreach ($all_pages as $val) {
                                        $selected = is_array($pages) && in_array($val->ID, $pages) ? 'selected="selected"' : '';
                                        echo '<option value="' . $val->ID . '" ' . $selected . '>' . esc_html($val->post_title) . '</option>';
                                    }
                                    ?>
                                </select>
                                <p class="field-description">Select pages where the avatar chat should appear</p>
                            </div>
                        </div>
                    </div>
                    <script>
                    jQuery(document).ready(function($) {
                        // Initialize Select2 with placeholder
                        $('#chat_window_pages').select2({
                            placeholder: "Select pages for chat widget...",
                            allowClear: true,
                            width: '100%'
                        });
                    });
                    </script>
                </div>
                <div class="form-divider"></div>
                <div class="container">
                    <div class="boxed">
                        <h2>LiveKit & API Settings</h2>
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

                            <!-- Combined Row -->
                            <tr>
                                <th colspan="2">
                                    <div style="display: flex; gap: 20px; width: 100%;">

                                        <!-- RAG API URL -->
                                        <div style="flex: 1;">
                                            <label id="rag_label"><strong>Custom RAG API URL</strong></label><br>
                                            <small>Leave blank to use HeyGen knowledge base</small>
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
                        </table>
                    </div>

                    <script>
                    document.addEventListener('DOMContentLoaded', function() {
                        const livekitToggle = document.getElementById('livekit_enable');
                        const ragInput = document.getElementById('RAG_API_URL');
                        const deepgramInput = document.getElementById('deepgramKEY');
                        const ragLabel = document.getElementById('rag_label');
                        const deepgramLabel = document.getElementById('deepgram_label');
                        
                        function toggleRequiredFields() {
                            if (livekitToggle.checked) {
                                ragInput.setAttribute('required', 'required');
                                deepgramInput.setAttribute('required', 'required');
                                ragLabel.innerHTML = '<strong>Custom RAG API URL <span style="color: black;">*</span></strong>';
                                deepgramLabel.innerHTML = '<strong>Deepgram API Key <span style="color: black;">*</span></strong>';
                            } else {
                                ragInput.removeAttribute('required');
                                deepgramInput.removeAttribute('required');
                                ragLabel.innerHTML = '<strong>Custom RAG API URL</strong>';
                                deepgramLabel.innerHTML = '<strong>Deepgram API Key</strong>';
                            }
                        }
                        
                        // Set initial state
                        toggleRequiredFields();
                        
                        // Update when checkbox changes
                        livekitToggle.addEventListener('change', toggleRequiredFields);
                    });
                    </script>
                    <div class="form-divider"></div>                
                        <div class="boxed">
                            <h2>Disclaimer</h2>
                            <table class="form-table">
                                <tr>
                                    <th>Enable Disclaimer</th>
                                    <td>
                                        <div class="toggle-wrapper">
                                            <input type="checkbox" name="disclaimer_enable" value="1" id="disclaimer_enable" 
                                                <?php echo $avatar && $avatar->disclaimer_enable ? 'checked' : ''; ?> />
                                            <label for="disclaimer_enable" class="toggle-label">Show disclaimer to users</label>
                                        </div>
                                    </td>
                                </tr>

                                <!-- New Combined Row -->
                                <tr>
                                    <th colspan="2">
                                        <div style="display: flex; gap: 30px;">

                                            <!-- Heading -->
                                            <div style="flex: 1;">
                                                <label><strong>Heading</strong></label><br>
                                                <input type="text" name="disclaimer_title"
                                                    value="<?php echo $avatar && $avatar->disclaimer_title ? esc_attr($avatar->disclaimer_title) : ''; ?>"
                                                    placeholder="e.g., Terms & Conditions"
                                                    style="width: 100%; margin-top: 5px;">
                                            </div>

                                            <!-- Disclaimer Content -->
                                            <div style="flex: 1;">
                                                <label><strong>Disclaimer Content</strong></label><br>
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
                                                        'wpautop' => true
                                                    );
                                                    wp_editor($disclaimer_content, $editor_id, $settings);
                                                    ?>
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
                                            <?php echo $avatar && $avatar->user_form_enable ? 'checked' : ''; ?> />
                                        <label for="user_form_enable" class="toggle-label">Collect user information before session</label>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <div class="form-divider"></div>
                    
                    <div class="boxed">
                        <h2>Video Instructions <span class="section-badge">(Optional)</span></h2>
                        <table class="form-table">

                            <!-- Row 1: Enable Instruction + Skip Instruction Video -->
                            <tr>
                                <th colspan="2">
                                    <div style="display: flex; gap: 30px;">

                                        <!-- Enable Instruction -->
                                        <div style="flex: 1;">
                                            <label><strong>Enable Video Instruction</strong></label><br>
                                            <div class="toggle-wrapper" style="margin-top: 12px;">
                                                <input type="checkbox" name="instruction_enable" value="1" id="instruction_enable" 
                                                    <?php echo $avatar && $avatar->instruction_enable ? 'checked' : ''; ?> />
                                                <label for="instruction_enable" class="toggle-label">Show instructions to users</label>
                                            </div>
                                        </div>

                                        <!-- Skip Instruction Video -->
                                        <div style="flex: 1;">
                                            <label><strong>Skip Video Instruction</strong></label><br>
                                            <div class="toggle-wrapper" style="margin-top: 12px;">
                                                <input type="checkbox" name="skip_instruction_video" value="1" id="skip_instruction_video" 
                                                    <?php echo $avatar && $avatar->skip_instruction_video ? 'checked' : ''; ?> />
                                                <label for="skip_instruction_video" class="toggle-label">Hide instruction video</label>
                                            </div>
                                        </div>

                                    </div>
                                </th>
                            </tr>

                            <!-- Row 2: Heading + Instruction Content -->
                            <tr>
                                <th colspan="2">
                                    <div style="display: flex; gap: 30px;">

                                        <!-- Heading -->
                                        <div style="flex: 1;">
                                            <label><strong>Heading</strong></label><br>
                                            <input type="text" name="instruction_title" 
                                                value="<?php echo $avatar && $avatar->instruction_title ? esc_attr($avatar->instruction_title) : ''; ?>" 
                                                placeholder="e.g., How to Use This Avatar"
                                                style="width: 100%; margin-top: 12px;">
                                        </div>

                                        <!-- Instruction Content -->
                                        <div style="flex: 1;">
                                            <label><strong>Instruction Content</strong></label><br>
                                            <div class="editor-wrapper" style="margin-top: 12px;">
                                                <?php
                                                $instruction_content = $avatar && $avatar->instruction ? $avatar->instruction : '';
                                                $editor_id = 'instruction_editor';
                                                $settings = array(
                                                    'textarea_name' => 'instruction',
                                                    'textarea_rows' => 10,
                                                    'media_buttons' => true,
                                                    'teeny' => false,
                                                    'quicktags' => true,
                                                    'wpautop' => true
                                                );
                                                wp_editor($instruction_content, $editor_id, $settings);
                                                ?>
                                            </div>
                                        </div>

                                    </div>
                                </th>
                            </tr>

                        </table>
                    </div>

                    <div class="form-divider"></div>                
                        <div class="boxed mb-20">
                        <h2>Opening Texts / Welcome Messages</h2>
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
                                    name="welcome_message[en]" value="<?php echo $welcome_message['en'] ?? ''; ?>" placeholder="Hello! How can I assist you today?" />
                            </div>

                            <div id="avatar_studio-tab-es" class="avatar_studio-tab-content">
                                <label for="welcome_message_es"><strong>Welcome Message (Es)</strong></label><br>
                                <input type="text" id="welcome_message_es" class="regular-text full-width"
                                    name="welcome_message[es]" value="<?php echo $welcome_message['es'] ?? ''; ?>" placeholder="¡Hola! ¿Cómo puedo ayudarte hoy?" />
                            </div>

                            <div id="avatar_studio-tab-fr" class="avatar_studio-tab-content">
                                <label for="welcome_message_fr"><strong>Welcome Message (Fr)</strong></label><br>
                                <input type="text" id="welcome_message_fr" class="regular-text full-width"
                                    name="welcome_message[fr]" value="<?php echo $welcome_message['fr'] ?? ''; ?>" placeholder="Bonjour! Comment puis-je vous aider aujourd'hui?" />
                            </div>
                            <div id="avatar_studio-tab-de" class="avatar_studio-tab-content">
                                <label for="welcome_message_de"><strong>Welcome Message (De)</strong></label><br>
                                <input type="text" id="welcome_message_de" class="regular-text full-width"
                                    name="welcome_message[de]" value="<?php echo $welcome_message['de'] ?? ''; ?>" placeholder="Hallo! Wie kann ich Ihnen heute helfen?" />
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
                                        <!-- <button type="button" class="tab-btn" data-tab="camera-button">Camera
                                            Button</button> -->
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
                        
                        <div id="chatBox" class="show preview-mode session-before">
                            <div id="chat-widget">
                                <input type="hidden" id="pageId" value="<?php echo get_the_ID(); ?>">
                                <input type="hidden" id="avatarStudioId" value="<?php echo $avatar_studio_id; ?>">
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


<style>
/* Enhanced Preview Area Styles */
.preview-area {
    /* background: #f8f9fa;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1); */
}

.preview-area h2 {
    color: #2c3e50;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 20px;
    background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* Preview Mode Toggle */
.preview-mode-toggle {
    display: flex;
    gap: 12px;
    margin-bottom: 10px;
    background: white;
    padding: 8px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.preview-mode-btn {
    flex: 1;
    padding: 12px 20px;
    border: 2px solid #e5e7eb;
    background: white;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.preview-mode-btn:hover {
    border-color: #38b1c5;
    color: #38b1c5;
}

.preview-mode-btn.active {
    background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
    border-color: transparent;
    color: white;
    font-weight: 600;
}

.preview-mode-btn i {
    font-size: 16px;
}

/* Fixed Preview Container */
.preview-container {
    background: white;
    border-radius: 8px;
    padding: 20px;
    min-height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}

#chatBox.preview-mode {
    position: relative !important;
    margin: 0 auto !important;
    transform: none !important;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
    left: 0%;
}


/* Session State Specific Styles */
/* Before Session Mode - Show only start button and thumbnail */
.preview-mode.session-before .chatBtnContainer {
    display: flex !important;
    flex-direction: column;
    gap: 12px;
    align-items: center;
}

.preview-mode.session-before #startSession {
    display: inline-flex !important;
}

.preview-mode.session-before .actionContainer,
.preview-mode.session-before #chatBox-close,
.preview-mode.session-before .action-view-transcript,
.preview-mode.session-before .chatBox-fullscreen,
.preview-mode.session-before .language-switcher,
.preview-mode.session-before .disclaimer,
.preview-mode.session-before .instruction,
.preview-mode.session-before .userform {
    display: none !important;
}

.preview-mode.session-before .welcomeContainer {
    display: flex !important;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
}

.preview-mode.session-before .loadingText {
    display: none !important;
}

.preview-mode.session-before .loading-icon {
    display: none !important;
}

/* During Session Mode - Show session controls */
.preview-mode.session-during .chatBtnContainer {
    display: none !important;
}

.preview-mode.session-during .actionContainer {
    display: flex !important;
    gap: 10px;
    align-items: center;
    justify-content: center;
}

.preview-mode.session-during #endSession,
.preview-mode.session-during #micToggler,
.preview-mode.session-during {
    display: inline-flex !important;
}

.transcriptToggleButton {
    display: none;
}

.preview-mode.session-during #cameraToggler {
    display: inline-flex !important;
}

.preview-mode.session-during #chatBox-close,
.preview-mode.session-during .chatBox-fullscreen,
.preview-mode.session-during .language-switcher,
.preview-mode.session-during #switchInteractionMode,
.preview-mode.session-during #listeningIcon {
    display: none !important;
}

/* Hide transcript container and user video in preview mode */
.preview-mode ~ #transcriptContainer,
.preview-mode .userVideoContainer {
    display: none !important;
}

/* Hide specific elements in both preview modes */
.preview-mode #chatBox-close,
.preview-mode .chatBox-fullscreen,
.preview-mode .language-switcher {
    display: none !important;
}

/* Show video in during session mode */
.preview-mode.session-during #video_holder {
    display: block !important;
}

.preview-mode.session-before #video_holder {
    display: flex !important;
    align-items: center;
    justify-content: center;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
    .preview-mode-toggle {
        flex-direction: column;
    }
    
    .thumbnail-size-options {
        flex-direction: column;
    }
}
</style>

<script>
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
            
            // Update preview state
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
</script>
<script>
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
</script>
<?php
// Add this hidden input to save the selected thumbnail size for preview
?>
<input type="hidden" name="preview_thumbnail_size" id="preview_thumbnail_size_hidden" value="mini">