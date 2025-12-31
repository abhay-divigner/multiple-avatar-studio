<?php

if (!defined('ABSPATH')) {
    exit;
}
?>

<?php



global $avatar_vendor;
global $api_key;
global $chatBoxHeading;
global $video_enable;
global $livekit_enable;
global $chat_only;
global $avatar_id;
global $knowledge_id;
global $previewImage;
global $avatar_name;
global $time_limit;
global $opening_text;
global $disclaimer_enable;
global $disclaimer;
global $disclaimer_title;
global $user_form_enable;
global $custom_rag_enable;
global $instruction_enable;
global $skip_instruction_video;
global $instruction;
global $instruction_title;
global $start_button_label;
global $selected_form_id;
if (!isset($selected_form_id) && isset($avatar) && isset($avatar->selected_form_id)) {
    $selected_form_id = $avatar->selected_form_id;
}
$avatarContainerID = isset($avatarContainerID) ? $avatarContainerID : 'chatBox';

$avatar_name = (isset($avatar_name) && $avatar_name != '') ? $avatar_name : false;
$aID = (isset($avatar_id) && $avatar_id != '') ? $avatar_id : false;
$kID = (isset($knowledge_id) && $knowledge_id != '') ? $knowledge_id : false;



if ($previewImage == '') {
    $previewImage = plugin_dir_url(__FILE__) . '/assets/images/preview.webp';
}

$required_fields_complete = (!empty($previewImage));

global $wp_embed;
?>
<style>
    div#ea11y-root {
        display: none;
    }
</style>
<link rel="stylesheet" href="<?php echo plugin_dir_url(__FILE__); ?>assets/css/fontawesome/css/all.min.css">
<input type="hidden" name="CURRENT_TIMESTAMP" value="<?php echo time() ?>">
<div class="avatarAndTranscriptWrapper">

    <div id="avatarContainer-<?php echo $avatarContainerID; ?>" class="avatarContainer">
        <?php if ($chatBoxHeading) {
            echo '<div id="chatBox-heading">' . $chatBoxHeading . '</div>';
        } ?>

        <div class="avatar_name">
            <?php echo $avatar_name; ?>
        </div>

        <div id="chatBox-close" title="Close Window">
            <i class="fa fa-times"></i>
        </div>

        <div id="notification-container" class="toast-notification-container">

        </div>

        </style>

        <div class="welcomeContainer">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024"
                class=" loading-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z">
                </path>
            </svg>
            <div class="loadingText">
                Connecting..
            </div>
            <div class="chatBtnContainer">
                <?php if ($avatar_vendor == 'heygen') { ?>
                    <button type="button" id="startSession" class="startSession" chatOnly="<?php echo $chat_only; ?>"
                        videoEnable="<?php echo $video_enable; ?>" avatarContainerID="<?php echo $avatarContainerID; ?>" custom_rag_enable = <?php echo $livekit_enable ? 'true' : 'false'; ?>
                        aid="<?php echo $aID; ?>" kid="<?php echo $kID; ?>"
                        opening_text="<?php echo $opening_text['en'] ?? ''; ?>" <?php echo !$required_fields_complete ? ' disabled style="opacity:0.5;cursor:not-allowed;"' : '' ?>
                        style="<?php echo $disclaimer_enable || $instruction_enable ? ' display:none; ' : '' ?>">
                        <?php echo $start_button_label; ?></button>
                <?php } else if ($avatar_vendor == 'tavus') { ?>
                        <button type="button" id="startSession" class="startSession" chatOnly="<?php echo $chat_only; ?>" initial_message = "<?php echo $time_limit ?>"
                            videoEnable="<?php echo $video_enable; ?>" avatarContainerID="<?php echo $avatarContainerID; ?>" custom_rag_enable = <?php echo $livekit_enable ? 'true' : 'false'; ?>
                            timer="<?php echo $time_limit ?>" opening_text="<?php echo $opening_text['en'] ?? ''; ?>" <?php echo !$required_fields_complete ? ' disabled style="opacity:0.5;cursor:not-allowed;"' : '' ?>
                            style="<?php echo $disclaimer_enable || $instruction_enable ? ' display:none; ' : '' ?>"><?php echo $start_button_label; ?></button>
                <?php } ?>
                <?php
                if ($disclaimer_enable) {
                    echo '<button type="button" class="disclaimer" > ' . $start_button_label . ' </button>';
                } else if ($instruction_enable) {
                    echo '<button type="button" class="instruction" > ' . $start_button_label . ' </button>';
                } else if ($disclaimer_enable) {
                    echo '<button type="button" class="userform" > Skip </button>';
                    echo '<button type="button" class="userform" > Next </button>';
                }

                ?>

            </div>
            <div class="action-view-transcript position-absolute r-60 b-10">
                <button type="button" id="transcriptToggleButton" class="transcriptToggleButton view-transcript-button"
                    aria-label="View Transcript button">
                    <div class="icon icon-view" title="View Transcript">
                        <i class="fa fa-arrow-left"></i>
                    </div>
                    <div class="icon icon-hide" title="Close Transcript" style="display: none;">
                        <i class="fa fa-arrow-right"></i>
                    </div>

                </button>
            </div>
            <div id="fullscreen" class="chatBox-fullscreen position-absolute r-10 b-10">
                <div class="action-fullscreen">
                    <i class="fa fa-expand" title="Fullscreen"></i>
                    <i class="fa fa-compress" title="Exit Fullscreen" style="display:none;"></i>
                </div>
            </div>
        </div>  
        <div id="video_holder">
            <video id="avatarVideo" class="avatarVideo" poster="<?php echo $previewImage; ?>" autoplay playsinline>
                <track kind="captions" />
            </video>
        </div>
        <div id="avatarError"
            style="width: 100%;font-size: 13px;position: absolute; background: rgba(255,255,255,.8);color: red; text-align:center;">
        </div>

        <div class="actionContainer">

            <div id="switchInteractionMode" class="switchMode" title="Switch to Voice/Chat">
                <i class="fa fa-comment-alt"></i>
            </div>
            <div id="listeningIcon" class="listeningIcon ">
            </div>
            <?php if (!$chat_only) { ?>
                <button type="button" id="micToggler" class="micToggler">
                    <i id="micIcon" class="fa fa-microphone"></i>
                </button>
            <?php } ?>
            <?php if ($video_enable) { ?>
                <button type="button" id="cameraToggler" class="cameraToggler <?php echo ($avatar_vendor == 'heygen') ? 'hide ' : '' ?>">
                    <i id="cameraIcon" class="fa fa-video"></i>
                </button>
            <?php } ?>
            <button type="button" id="endSession" class="endSession">
                <i class="fa fa-phone-slash" style="transform: rotate(135deg);"></i>
            </button>

            <div class="action-view-transcript">
                <button type="button" id="transcriptToggleButton" class="transcriptToggleButton view-transcript-button"
                    aria-label="View Transcript button">
                    <div class="icon icon-view" title="View Transcript">
                        <i class="fa fa-arrow-left"></i>
                    </div>
                    <div class="icon icon-hide" title="Close Transcript" style="display: none;">
                        <i class="fa fa-arrow-right"></i>
                    </div>

                </button>
            </div>
            <div type="button" class="chatBox-fullscreen">
                <div class="action-fullscreen">
                    <i class="fa fa-expand" title="Fullscreen"></i>
                    <i class="fa fa-compress" title="Exit Fullscreen" style="display:none;"></i>
                </div>
            </div>
            <script>
            document.addEventListener('DOMContentLoaded', function() {
                // Get all fullscreen button containers
                const fullscreenContainers = document.querySelectorAll('.chatBox-fullscreen');
                
                // Function to toggle all icons
                function toggleAllFullscreenIcons() {
                    // Get all expand and compress icons
                    const allExpandIcons = document.querySelectorAll('.fa-expand');
                    const allCompressIcons = document.querySelectorAll('.fa-compress');
                    
                    // Check the state by looking at the first expand icon
                    const expandVisible = allExpandIcons[0] && allExpandIcons[0].style.display !== 'none';
                    
                    // Toggle all icons
                    if (expandVisible) {
                        // Switch all to compress icon
                        allExpandIcons.forEach(icon => icon.style.display = 'none');
                        allCompressIcons.forEach(icon => icon.style.display = 'inline-block');
                    } else {
                        // Switch all to expand icon
                        allExpandIcons.forEach(icon => icon.style.display = 'inline-block');
                        allCompressIcons.forEach(icon => icon.style.display = 'none');
                    }
                }
                
                // Add click event to each container
                fullscreenContainers.forEach(function(container) {
                    container.addEventListener('click', function(e) {
                        e.preventDefault();
                        toggleAllFullscreenIcons();
                    });
                });
            });
            </script>

        </div>
        <?php if ($video_enable) { ?>
            <?php
            $has_camera = true;
            ?>
            <div class="videoContainer userVideoContainer" id="userVideoContainer" style="display: none;">
                <video id="userVideo" class="hide" autoplay="" playsinline="" muted="">
                    <track kind="captions">
                </video>
            </div>
            
            <script>
            document.addEventListener('DOMContentLoaded', function() {
                // Check for camera availability when the page loads
                checkCameraAvailability();
                
                function checkCameraAvailability() {
                    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                        // Browser doesn't support media devices API
                        hideUserVideoContainer();
                        return;
                    }
                    
                    navigator.mediaDevices.enumerateDevices()
                        .then(function(devices) {
                            const hasVideoInput = devices.some(device => device.kind === 'videoinput');
                            
                            if (!hasVideoInput) {
                                // No camera detected
                                hideUserVideoContainer();
                            } else {
                                // Camera detected - show container (but keep video hidden initially)
                                document.getElementById('userVideoContainer').style.display = 'block';
                            }
                        })
                        .catch(function(err) {
                            console.error('Error checking camera availability:', err);
                            // On error, assume no camera to be safe
                            hideUserVideoContainer();
                        });
                }
                
                function hideUserVideoContainer() {
                    const userVideoContainer = document.getElementById('userVideoContainer');
                    if (userVideoContainer) {
                        userVideoContainer.style.display = 'none';
                    }
                }
            });
            </script>
        <?php } ?>

        <div class="streamingCountdown-container" id="streamingCountdown"></div>


        <div class="language-switcher" title="Change Language">
            <span class="lang-icon" onclick="toggleLanguageDropdown()">
                <span id="selectedLanguage">
                    <img draggable="false" class="emoji" alt="us"
                        src="https://s.w.org/images/core/emoji/16.0.1/svg/1f1fa-1f1f8.svg">
                </span>
                <script>
                    document.addEventListener('DOMContentLoaded', function () {
                        setLanguage('en', 'us', 'English');
                    });

                </script>

            </span>

            <div class="dropdown" id="languageDropdown" style="display: none;">
                <a href="#" onclick="setLanguage('en', 'us', 'English')">
                    <img draggable="false" class="emoji" alt="us"
                        src="https://s.w.org/images/core/emoji/16.0.1/svg/1f1fa-1f1f8.svg"> English
                </a>
                <a href="#" onclick="setLanguage('es', 'es', 'Español')">
                    <img draggable="false" class="emoji" alt="es"
                        src="https://s.w.org/images/core/emoji/16.0.1/svg/1f1ea-1f1f8.svg"> Español
                </a>
                <a href="#" onclick="setLanguage('fr', 'fr', 'Français')">
                    <img draggable="false" class="emoji" alt="fr"
                        src="https://s.w.org/images/core/emoji/16.0.1/svg/1f1eb-1f1f7.svg"> Français
                </a>
                <a href="#" onclick="setLanguage('de', 'de', 'Deutsch')">
                    <img draggable="false" class="emoji" alt="de"
                        src="https://s.w.org/images/core/emoji/16.0.1/svg/1f1e9-1f1ea.svg"> Deutsch
                </a>
            </div>
        </div>
    </div>

    <div id="transcriptContainer" class="transcriptContainer">
        <div class="transcript-inner">
            <div class="transcript-heading">
                <h4>Chat</h4>
                <button type="button" id="exportTranscriptToPDF" class="exportTranscript" style="display:none;"
                    title="Export to PDF">
                    <div class="flex gap-10"><i class="fa fa-file"></i>Export</div>
                </button>
                <button type="button" id="sendTranscriptToEmail" class="exportTranscript" style="display:none;"
                    title="Send to Email">
                    <div class="flex gap-10"><i class="fa fa-envelope"></i>Send</div>
                </button>
            </div>
        </div>
        <div id="voiceTranscript" style="height: 150px;">

        </div>
        <div class="actionContainer">
            <div class="textInput-wrapper">
                <input type="text" id="userInput" class="textInput" placeholder="Let’s chat!" />
                <div id="<?php echo $avatar_vendor == 'tavus' ? 'send-btn' : 'speakButton' ?>" class="speakButton">
                    <i class="fa fa-arrow-up"></i>
                </div>
            </div>
        </div>
    </div>

</div>

<?php if ($disclaimer_enable) { ?>
    <div class="disclaimer-container" id="disclaimer">
        <div class="disclaimer-content">
            <div class="disclaimer-header">
                <?php echo $disclaimer_title != '' ? '<h3 class="disclaimer-title">' . $disclaimer_title . '</h3>' : '' ?>
                <button type="button" id="closeDisclaimer" class="closeDisclaimer"><i class="fa fa-times"></i></button>
            </div>
            <div class="disclaimer-body">
                <?php
                $disclaimer = $wp_embed->run_shortcode($disclaimer);
                $disclaimer = $wp_embed->autoembed($disclaimer);
                echo wpautop(do_shortcode($disclaimer));

                ?>
            </div>
            <div class="disclaimer-action">
                <button type="button" id="disclaimerAgree" class="submit-button">Agree</button>
            </div>
        </div>
    </div>
<?php } ?>
<?php if ($user_form_enable) { ?>
    <div class="instruction-container" id="userform">
        <form id="userDetailsForm" novalidate>
            
            <?php
            // Get the selected form ID from global or avatar object
            $form_id_to_use = 0;
            
            // First check if $avatar object exists and has selected_form_id
            if (isset($avatar) && isset($avatar->selected_form_id) && $avatar->selected_form_id > 0) {
                $form_id_to_use = intval($avatar->selected_form_id);
            } 
            // Then check the global $selected_form_id variable
            elseif (isset($selected_form_id) && $selected_form_id > 0) {
                $form_id_to_use = $selected_form_id;
            }
            // Also check if it's passed via shortcode attributes
            elseif (isset($atts['form_id']) && $atts['form_id'] > 0) {
                $form_id_to_use = intval($atts['form_id']);
            }
            
            if ($form_id_to_use > 0) {
                $form_builder = Avatar_Form_Builder::get_instance();
                $form = $form_builder->get_form_by_id($form_id_to_use);
                
                if ($form && !empty($form->form_data)) {
                    $form_data = json_decode($form->form_data, true);
                    
                    // Check if form_data is valid and has fields
                    if ($form_data && is_array($form_data) && isset($form_data['fields']) && !empty($form_data['fields'])) {
                        
                        // Display form title and description
                        if (!empty($form_data['title'])) {
                            echo '<h3>' . esc_html($form_data['title']) . '</h3>';
                        }
                        
                        if (!empty($form_data['description'])) {
                            echo '<p class="form-description">' . esc_html($form_data['description']) . '</p>';
                        }
                        
                        // Generate form fields
                        echo '<div class="user-form-fields">';
                        
                        foreach ($form_data['fields'] as $field) {
                            $field_id = 'field_' . uniqid();
                            $field_name = sanitize_title($field['label']) . '_' . $field_id;
                            $required_class = isset($field['required']) && $field['required'] ? 'required' : '';
                            $required_attr = isset($field['required']) && $field['required'] ? 'required' : '';
                            
                            echo '<div class="form-field ' . esc_attr($field['type']) . '-field ' . $required_class . '">';
                            echo '<label for="' . esc_attr($field_name) . '">' . esc_html($field['label']) . '</label>';
                            
                            switch ($field['type']) {
                                case 'text':
                                case 'email':
                                case 'number':
                                case 'tel':
                                case 'date':
                                    echo '<input type="' . esc_attr($field['type']) . '" 
                                           id="' . esc_attr($field_name) . '" 
                                           name="' . esc_attr($field_name) . '" 
                                           placeholder="' . esc_attr($field['placeholder'] ?? '') . '" 
                                           ' . $required_attr . '>';
                                    break;
                                    
                                case 'textarea':
                                    echo '<textarea 
                                           id="' . esc_attr($field_name) . '" 
                                           name="' . esc_attr($field_name) . '" 
                                           placeholder="' . esc_attr($field['placeholder'] ?? '') . '" 
                                           rows="3" ' . $required_attr . '></textarea>';
                                    break;
                                    
                                case 'select':
                                    echo '<select 
                                           id="' . esc_attr($field_name) . '" 
                                           name="' . esc_attr($field_name) . '" ' . $required_attr . '>';
                                    echo '<option value="">' . esc_html($field['placeholder'] ?? 'Select an option') . '</option>';
                                    
                                    if (!empty($field['options'])) {
                                        foreach ($field['options'] as $option) {
                                            echo '<option value="' . esc_attr($option) . '">' . esc_html($option) . '</option>';
                                        }
                                    }
                                    echo '</select>';
                                    break;
                                    
                                case 'radio':
                                    if (!empty($field['options'])) {
                                        foreach ($field['options'] as $index => $option) {
                                            $radio_id = $field_name . '_' . $index;
                                            echo '<div class="radio-option">';
                                            echo '<input type="radio" 
                                                   id="' . esc_attr($radio_id) . '" 
                                                   name="' . esc_attr($field_name) . '" 
                                                   value="' . esc_attr($option) . '" ' . $required_attr . '>';
                                            echo '<label for="' . esc_attr($radio_id) . '">' . esc_html($option) . '</label>';
                                            echo '</div>';
                                        }
                                    }
                                    break;
                                    
                                case 'checkbox':
                                    if (!empty($field['options'])) {
                                        foreach ($field['options'] as $index => $option) {
                                            $checkbox_id = $field_name . '_' . $index;
                                            echo '<div class="checkbox-option">';
                                            echo '<input type="checkbox" 
                                                   id="' . esc_attr($checkbox_id) . '" 
                                                   name="' . esc_attr($field_name) . '[]" 
                                                   value="' . esc_attr($option) . '">';
                                            echo '<label for="' . esc_attr($checkbox_id) . '">' . esc_html($option) . '</label>';
                                            echo '</div>';
                                        }
                                    }
                                    break;
                            }
                            
                            echo '</div>';
                        }
                        
                        echo '</div>'; // Close .user-form-fields
                        
                        // Add hidden inputs
                        echo '<input type="hidden" name="form_id" value="' . esc_attr($form_id_to_use) . '">';
                        echo '<input type="hidden" name="session_id" value="' . esc_attr(session_id()) . '">';
                        if (isset($avatar) && isset($avatar->id)) {
                            echo '<input type="hidden" name="avatar_studio_id" value="' . esc_attr($avatar->id) . '">';
                        }
                        
                    } else {
                        echo '<p class="error">Form has no fields configured.</p>';
                    }
                } else {
                    echo '<p class="error">Selected form not found or has no data.</p>';
                }
            } else {
                echo '<p class="error">No form selected.</p>';
            }
            ?>
            
            <div id="buttons">
                <button type="button" id="skipBtn">Skip</button>
                <button type="submit" id="nextBtn">Next</button>
            </div>
        </form>
    </div>
    
    <style>
    #userDetailsForm {
        background: white;
        padding: 30px;
        border-radius: 16px;
    }
    .userform {
        background: white;
        border-radius: 12px;
        padding: 24px;
        margin: 20px 0;
        box-shadow: 0 4px 15px rgba(56, 177, 197, 0.1);
    }
    
    .userform h3 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 24px;
        color: #2c3e50;
        background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .form-description {
        color: #666;
        margin-bottom: 20px;
        font-size: 14px;
        line-height: 1.5;
    }
    
    .user-form-fields {
        margin-bottom: 24px;
    }
    
    .form-field {
        margin-bottom: 20px;
    }
    
    .form-field label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #334155;
        font-size: 14px;
    }
    
    .form-field.required label::after {
        content: ' *';
        color: #ef4444;
    }
    
    .form-field input[type="text"],
    .form-field input[type="email"],
    .form-field input[type="number"],
    .form-field input[type="tel"],
    .form-field input[type="date"],
    .form-field select,
    .form-field textarea {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.2s ease;
        background: white;
    }
    
    .form-field input:focus,
    .form-field select:focus,
    .form-field textarea:focus {
        outline: none;
        border: 2px solid transparent;
        background-image: 
            linear-gradient(white, white),
            linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        box-shadow: 0 0 0 4px rgba(56, 177, 197, 0.1);
    }
    
    .form-field textarea {
        min-height: 100px;
        resize: vertical;
    }
    
    .radio-option,
    .checkbox-option {
        margin-bottom: 8px;
        display: flex;
        align-items: center;
    }
    
    .radio-option input[type="radio"],
    .checkbox-option input[type="checkbox"] {
        margin-right: 10px;
        width: 18px;
        height: 18px;
    }
    
    .radio-option label,
    .checkbox-option label {
        margin: 0;
        font-weight: normal;
        cursor: pointer;
    }
    
    #buttons {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
    }
    
    #skipBtn,
    #nextBtn {
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid transparent;
    }
    
    #skipBtn {
        background: white;
        border-color: #e5e7eb;
        color: #6b7280;
    }
    
    #skipBtn:hover {
        border-color: #d1d5db;
        background: #f9fafb;
    }
    
    #nextBtn {
        background: linear-gradient(135deg, #38b1c5 0%, #da922c 100%);
        color: white;
    }
    
    #nextBtn:hover {
        background: linear-gradient(135deg, #38b1c5 10%, #da922c 90%);
        box-shadow: 0 4px 12px rgba(56, 177, 197, 0.3);
    }
    
    .no-fields,
    .error {
        text-align: center;
        color: #6b7280;
        padding: 20px;
        background: #f9fafb;
        border-radius: 8px;
        margin: 20px 0;
    }
    
    .error {
        color: #ef4444;
        background: #fef2f2;
        border: 1px solid #fecaca;
    }
    </style>
    
   <script>
    jQuery(document).ready(function($) {
        // Store the instruction enable state in a variable for easy access
        const instructionEnabled = <?php echo $instruction_enable ? 'true' : 'false'; ?>;
        
        // Store form ID in a variable for easy access
        const currentFormId = <?php echo $form_id_to_use; ?>;
        
        // Check if instruction video section exists
        const instructionSectionExists = $('#instruction').length > 0;
        
        // Debug: Log initial state
        console.log('=== AVATAR FORM DEBUG ===');
        console.log('Form ID:', currentFormId);
        console.log('Instruction Enabled:', instructionEnabled);
        console.log('Instruction Section Exists:', instructionSectionExists);
        console.log('Form Container (#userform) found:', $('#userform').length);
        console.log('Form Container HTML:', $('#userform')[0] ? $('#userform')[0].outerHTML.substring(0, 100) + '...' : 'NOT FOUND');
        
        // Handle instruction agree button click
        $(document).on('click', '#instructionAgree', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            console.log('Instruction agree button clicked');
            
            // Hide instruction section
            $('#instruction').hide(300, function() {
                console.log('Instruction section hidden');
                startSession();
            });
        });
        
        // Form submission handler
        $('#userDetailsForm').on('submit', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            console.log('=== FORM SUBMIT TRIGGERED ===');
            
            // Clear previous error messages
            $('.error-message').remove();
            
            // Validate form
            let isValid = true;
            let firstErrorField = null;
            
            $('.form-field.required').each(function() {
                const $field = $(this);
                const $input = $field.find('input, select, textarea').first();
                const value = $input.val();
                
                // For checkboxes
                if ($input.is('[type="checkbox"]')) {
                    const name = $input.attr('name');
                    const checked = $(`input[name="${name}"]:checked`).length > 0;
                    if (!checked) {
                        isValid = false;
                        $field.addClass('error');
                        if (!firstErrorField) firstErrorField = $field;
                    } else {
                        $field.removeClass('error');
                    }
                } 
                // For radio buttons
                else if ($input.is('[type="radio"]')) {
                    const name = $input.attr('name');
                    const checked = $(`input[name="${name}"]:checked`).length > 0;
                    if (!checked) {
                        isValid = false;
                        $field.addClass('error');
                        if (!firstErrorField) firstErrorField = $field;
                    } else {
                        $field.removeClass('error');
                    }
                }
                // For other fields
                else if (!value || value.trim() === '') {
                    isValid = false;
                    $field.addClass('error');
                    if (!firstErrorField) firstErrorField = $field;
                } else {
                    $field.removeClass('error');
                }
            });
            
            // Show error if validation fails
            if (!isValid) {
                console.log('Form validation failed');
                $('#userDetailsForm').prepend('<div class="error-message" style="color: #ef4444; padding: 10px; margin-bottom: 15px; background: #fef2f2; border-radius: 6px; border: 1px solid #fecaca;">Please fill in all required fields marked with *</div>');
                
                // Scroll to first error field
                if (firstErrorField) {
                    $('html, body').animate({
                        scrollTop: firstErrorField.offset().top - 100
                    }, 500);
                }
                return false;
            }
            
            console.log('Form validation passed, hiding form...');
            
            // HIDE THE FORM IMMEDIATELY AND PERMANENTLY
            $('#userform').css({
                'opacity': '0',
                'height': '0',
                'overflow': 'hidden',
                'margin': '0',
                'padding': '0',
                'border': 'none',
                'visibility': 'hidden',
                'pointer-events': 'none',
                'position': 'absolute',
                'z-index': '-9999'
            }).hide().off();
            
            console.log('Form should be hidden now. Checking visibility:', $('#userform').is(':visible'));
            
            // Collect form data
            const formData = {};
            $('.form-field').each(function() {
                const $field = $(this);
                const label = $field.find('label').first().text().replace(' *', '').trim();
                const $input = $field.find('input, select, textarea').first();
                
                if (!$input.length || !label) return;
                
                // Handle checkboxes (multiple values)
                if ($input.is('[type="checkbox"]')) {
                    const name = $input.attr('name');
                    if (!name) return;
                    
                    const values = [];
                    $field.find(`input[name="${name}"]:checked`).each(function() {
                        values.push($(this).val());
                    });
                    formData[label] = values.length > 0 ? values : [];
                } 
                // Handle radio buttons (single value)
                else if ($input.is('[type="radio"]')) {
                    const name = $input.attr('name');
                    if (!name) return;
                    
                    const value = $field.find(`input[name="${name}"]:checked`).val();
                    formData[label] = value || '';
                }
                // Handle other input types
                else {
                    formData[label] = $input.val() || '';
                }
            });
            
            console.log('Form data collected:', formData);
            
            // Get session ID
            let sessionId = $('input[name="session_id"]').val();
            if (!sessionId) {
                sessionId = 'session_' + Date.now();
            }
            
            // Get avatar studio ID
            const avatarStudioId = $('input[name="avatar_studio_id"]').val() || 0;
            
            console.log('Submitting form via AJAX...');
            
            // Submit via AJAX
            $.ajax({
                url: '<?php echo admin_url("admin-ajax.php"); ?>',
                type: 'POST',
                data: {
                    action: 'submit_avatar_form',
                    form_id: currentFormId,
                    session_id: sessionId,
                    avatar_studio_id: avatarStudioId,
                    form_data: JSON.stringify(formData)
                },
                beforeSend: function() {
                    // Disable the button during submission
                    $('#nextBtn').prop('disabled', true);
                    console.log('AJAX request sent');
                },
                success: function(response) {
                    console.log('AJAX response received:', response);
                    
                    if (response.success) {
                        console.log('Form submitted successfully via AJAX');
                        
                        // Double-check form is hidden
                        $('#userform').hide();
                        
                        // Form is already hidden, now decide where to go next
                        if (instructionEnabled && instructionSectionExists) {
                            console.log('Redirecting to instruction section');
                            scrollToInstruction();
                        } else {
                            console.log('Starting session directly');
                            startSession();
                        }
                    } else {
                        // AJAX failed but form stays hidden
                        console.log('AJAX submission failed, form stays hidden');
                        // Show error in console only
                        console.error('Form submission error:', response.data);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('AJAX error:', error);
                    // AJAX network error but form stays hidden
                    console.log('AJAX network error, form stays hidden');
                },
                complete: function() {
                    // Re-enable button after AJAX completes (success or error)
                    $('#nextBtn').prop('disabled', false);
                    console.log('AJAX request complete');
                }
            });
            
            return false;
        });
        
        // Real-time validation
        $('.form-field.required input, .form-field.required select, .form-field.required textarea').on('blur change', function() {
            const $field = $(this).closest('.form-field');
            const $input = $field.find('input, select, textarea').first();
            const value = $input.val();
            
            if ($input.is('[type="checkbox"], [type="radio"]')) {
                const name = $input.attr('name');
                const checked = $(`input[name="${name}"]:checked`).length > 0;
                if (!checked) {
                    $field.addClass('error');
                } else {
                    $field.removeClass('error');
                    $('.error-message').remove();
                }
            } else if (!value || value.trim() === '') {
                $field.addClass('error');
            } else {
                $field.removeClass('error');
                $('.error-message').remove();
            }
        });
        
        // Function to scroll to instruction section
        function scrollToInstruction() {
            console.log('Scrolling to instruction section');
            
            const $instructionSection = $('#instruction');
            
            if ($instructionSection.length > 0) {
                // Show instruction section if hidden
                if ($instructionSection.is(':hidden')) {
                    $instructionSection.show();
                }
                
                // Briefly highlight the section
                $instructionSection.css({
                    'display': 'flex' 
                });
                
            } else {
                console.log('No instruction section found, starting session');
                startSession();
            }
        }
        
        // Function to start the session
        function startSession() {
            console.log('Starting session...');
            
            // Method 1: Trigger click on start session button
            if ($('#startSession').length > 0) {
                console.log('Found #startSession button, triggering click');
                $('#startSession').trigger('click');
            }
            // Method 2: Call startSession function if it exists
            else if (typeof window.startSession === 'function') {
                console.log('Calling window.startSession() function');
                window.startSession();
            }
            // Method 3: Try other common session start selectors
            else {
                const sessionTriggers = [
                    '#beginSession',
                    '.start-session',
                    '[data-start-session]',
                    '.session-start-btn',
                    '#start-session-btn'
                ];
                
                let sessionFound = false;
                for (const selector of sessionTriggers) {
                    if ($(selector).length > 0) {
                        console.log('Found session trigger:', selector);
                        $(selector).trigger('click');
                        sessionFound = true;
                        break;
                    }
                }
                
                // If no trigger found, log a message
                if (!sessionFound) {
                    console.log('No session start trigger found');
                }
            }
        }
        
        // Prevent any other code from showing the form
        // $(document).on('show hide slideDown slideUp fadeIn fadeOut', '#userform', function(e) {
        //     e.preventDefault();
        //     e.stopImmediatePropagation();
        //     console.log('Blocked attempt to change #userform visibility');
        //     return false;
        // });
    });
    </script>
<?php } ?>
<style>

    /* Add to your existing CSS */
.error-message {
    color: #ef4444;
    padding: 10px;
    margin-bottom: 15px;
    background: #fef2f2;
    border-radius: 6px;
    border: 1px solid #fecaca;
    font-size: 14px;
}

.error-message:before {
    content: "⚠️ ";
    margin-right: 5px;
}
    /* Add to your existing CSS */
.instruction-container {
    /* background: white; */
    border-radius: 12px;
    padding: 24px;
    margin: 20px 0;
    box-shadow: 0 4px 15px rgba(56, 177, 197, 0.1);
}

#userform {
    display: none; /* Hidden by default, shown when needed */
}

/* Add these styles for form validation */
.form-field.error label {
    color: #ef4444 !important;
}

.form-field.error input,
.form-field.error select,
.form-field.error textarea {
    border-color: #ef4444 !important;
    background: #fef2f2 !important;
}
</style>
<?php if ($instruction_enable) { ?>
    <div class="instruction-container" id="instruction">
        <div class="instruction-content">
            <div class="instruction-header">
                <?php echo $instruction_title != '' ? '<h3 class="instruction-title">' . $instruction_title . '</h3>' : '' ?>
                <button type="button" id="closeInstruction" class="closeInstruction"><i class="fa fa-times"></i></button>
            </div>
            <div class="instruction-body">
                <?php

                $instruction = $wp_embed->run_shortcode($instruction);
                $instruction = $wp_embed->autoembed($instruction);
                echo wpautop(do_shortcode($instruction));

                ?>
            </div>
            <div class="instruction-action">
                <button type="button" id="instructionAgree" class="submit-button">Continue</button>
            </div>
        </div>
    </div>
<?php } ?>

<style>
    .toast-notification-container {
        display: flex;
        flex-direction: column;
        gap: 12px;
        position: absolute !important;
        z-index: 10000 !important;
        top: 60px;
        right: 20px;
    }
    
    .notification {
        padding: 12px 16px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 14px;
        font-size: 14px;
        font-weight: 500;
        animation: slideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        min-width: fit-content;
        max-width: 400px;
        cursor: pointer;
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
    }
    
    .notification::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        opacity: 0.6;
    }
    
    .notification::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 12px;
        padding: 1px;
        background: linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1));
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
    }
    
    .notification:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
    }
    
    /* Success Theme - Green */
    .notification.success {
        background: rgba(16, 185, 129, 0.15);
        color: #6ee7b7;
        border: 1px solid rgba(52, 211, 153, 0.3);
    }
    
    /* Error Theme - Red */
    .notification.error {
        background: rgba(239, 68, 68, 0.15);
        color: #ff4d4d;
        border: 1px solid rgba(248, 113, 113, 0.3);
        /* text-shadow: 0 0 10px rgba(239, 68, 68, 0.5); */
    }
    
    /* Warning Theme - Yellow */
    .notification.warn {
        background: rgba(234, 179, 8, 0.15) !important;
        color: #fde047 !important;
        border: 1px solid rgba(250, 204, 21, 0.3) !important;
    }

    /* Info Theme - Purple */
    .notification.info {
        background: rgba(139, 92, 246, 0.15);
        color: #c4b5fd;
        border: 1px solid rgba(167, 139, 250, 0.3);
    }
    
    /* Message Text */
    .notification-message {
        flex: 1;
        line-height: 1.5;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        word-wrap: break-word;
    }
    
    /* Animations */
    @keyframes slideIn {
        from {
            transform: translateX(450px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0) scale(1);
            opacity: 1;
        }
        to {
            transform: translateX(450px) scale(0.8);
            opacity: 0;
        }
    }
    
    .notification.removing {
        animation: slideOut 0.3s ease-in forwards;
    }
    
    /* Progress Bar */
    .notification-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 4px;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 0 0 12px 12px;
        animation: progress 5s linear forwards;
    }
    
    @keyframes progress {
        from {
            width: 100%;
        }
        to {
            width: 0%;
        }
    }
    
    /* Glow Effect */
    .notification.success {
        box-shadow: 0 8px 32px rgba(16, 185, 129, 0.25), 0 0 60px rgba(16, 185, 129, 0.1);
    }
    
    .notification.error {
        box-shadow: 0 8px 32px rgba(239, 68, 68, 0.25), 0 0 60px rgba(239, 68, 68, 0.1);
    }
    
    .notification.warn {
        box-shadow: 0 8px 32px rgba(234, 179, 8, 0.25), 0 0 60px rgba(234, 179, 8, 0.1);
    }
    
    .notification.info {
        box-shadow: 0 8px 32px rgba(139, 92, 246, 0.25), 0 0 60px rgba(139, 92, 246, 0.1);
    }
    
    /* Mobile Responsive */
    @media (max-width: 768px) {
        .toast-notification-container {
            right: 10px;
            left: 10px;
            max-width: none;
        }
        
        .notification {
            padding: 14px 16px;
            font-size: 13px;
            min-width: auto;
        }
        
        .notification-icon {
            width: 32px;
            height: 32px;
            font-size: 18px;
        }
    }
</style>

<!--    
    <div class="overlayQuestion-content">
        <div class="overlayQuestion-header">
            <h3 class="overlayQuestion-title">Ask a question</h3>
            <button type="button" id="closeOverlayQuestion" class="closeOverlayQuestion"><i
                    class="fa fa-close"></i></button>
        </div>
        <div class="overlayQuestion-body">

        </div>

        <div class="overlayQuestion-action">
            <button type="button" id="overlayQuestionSubmit" class="submit-button" value="Submit"></button>
        </div>

    </div>
</div> -->