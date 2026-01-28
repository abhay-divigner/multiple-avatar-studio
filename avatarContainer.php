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

// Prepare JavaScript configuration
$js_config = array(
    'avatar_vendor' => $avatar_vendor,
    'chat_only' => $chat_only,
    'video_enable' => $video_enable,
    'livekit_enable' => $livekit_enable,
    'avatarContainerID' => $avatarContainerID,
    'avatar_id' => $aID,
    'knowledge_id' => $kID,
    'opening_text' => $opening_text['en'] ?? '',
    'time_limit' => $time_limit,
    'required_fields_complete' => $required_fields_complete,
    'disclaimer_enable' => $disclaimer_enable,
    'instruction_enable' => $instruction_enable,
    'user_form_enable' => $user_form_enable,
    'form_id' => 0,
    'ajax_url' => admin_url('admin-ajax.php'),
    'instruction_section_exists' => false,
    'nonce' => wp_create_nonce('avatar_studio_nonce'),
    'styles' => $styles
);

// Get form ID
$form_id_to_use = 0;
if (isset($avatar) && isset($avatar->selected_form_id) && $avatar->selected_form_id > 0) {
    $form_id_to_use = intval($avatar->selected_form_id);
} elseif (isset($selected_form_id) && $selected_form_id > 0) {
    $form_id_to_use = $selected_form_id;
} elseif (isset($atts['form_id']) && $atts['form_id'] > 0) {
    $form_id_to_use = intval($atts['form_id']);
}
$js_config['form_id'] = $form_id_to_use;

// Enqueue scripts properly
function enqueue_avatar_studio_scripts($js_config) {
    // Enqueue Font Awesome
    wp_enqueue_style(
        'avatar-studio-fontawesome',
        plugin_dir_url(__FILE__) . 'assets/css/fontawesome/css/all.min.css',
        array(),
        '6.4.0'
    );
    
    // Enqueue configuration script
    wp_register_script(
        'avatar-studio-config',
        plugin_dir_url(__FILE__) . 'assets/js/avatar-studio-config.js',
        array(),
        '1.0.0',
        true
    );
    
    // Localize script to pass PHP variables to JavaScript
    wp_localize_script(
        'avatar-studio-config',
        'avatarStudioConfig',
        $js_config
    );
    
    // Enqueue the configuration script
    wp_enqueue_script('avatar-studio-config');
    
    // Enqueue main avatar container script
    wp_enqueue_script(
        'avatar-studio-container',
        plugin_dir_url(__FILE__) . 'assets/js/avatarContainer.js',
        array('avatar-studio-config'), // Make it dependent on config script
        '1.0.0',
        true
    );
}

// Call the function to enqueue scripts
enqueue_avatar_studio_scripts($js_config);
?>

<input type="hidden" name="CURRENT_TIMESTAMP" value="<?php echo esc_attr(time()); ?>">

<div class="avatarAndTranscriptWrapper">

    <div id="avatarContainer-<?php echo esc_attr($avatarContainerID); ?>" class="avatarContainer">
        <?php if ($chatBoxHeading) {
            echo '<div id="chatBox-heading">' . esc_html($chatBoxHeading) . '</div>';
        } ?>

        <div class="avatar_name">
            <?php echo esc_html($avatar_name); ?>
        </div>

        <div id="chatBox-close" title="Close Window">
            <i class="fa fa-times"></i>
        </div>

        <div id="notification-container" class="toast-notification-container">

        </div>

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
                    <button type="button" id="startSession" class="startSession" chatOnly="<?php echo esc_attr($chat_only); ?>"
                        videoEnable="<?php echo esc_attr($video_enable); ?>" avatarContainerID="<?php echo esc_attr($avatarContainerID); ?>" custom_rag_enable="<?php echo esc_attr($livekit_enable ? 'true' : 'false'); ?>"
                        aid="<?php echo esc_attr($aID); ?>" kid="<?php echo esc_attr($kID); ?>"
                        opening_text="<?php echo esc_attr($opening_text['en'] ?? ''); ?>" <?php echo !$required_fields_complete ? ' disabled style="opacity:0.5;cursor:not-allowed;"' : '' ?>
                        style="<?php echo esc_attr($disclaimer_enable || $instruction_enable ? ' display:none; ' : ''); ?>">
                        <?php echo esc_html($start_button_label); ?>
                    </button>
                <?php } else if ($avatar_vendor == 'tavus') { ?>
                        <button type="button" id="startSession" class="startSession" chatOnly="<?php echo esc_attr($chat_only); ?>" initial_message="<?php echo esc_attr($time_limit); ?>"
                            videoEnable="<?php echo esc_attr($video_enable); ?>" avatarContainerID="<?php echo esc_attr($avatarContainerID); ?>" custom_rag_enable="<?php echo esc_attr($livekit_enable ? 'true' : 'false'); ?>"
                            timer="<?php echo esc_attr($time_limit); ?>" opening_text="<?php echo esc_attr($opening_text['en'] ?? ''); ?>" <?php echo !$required_fields_complete ? ' disabled style="opacity:0.5;cursor:not-allowed;"' : '' ?>
                            style="<?php echo esc_attr($disclaimer_enable || $instruction_enable ? ' display:none; ' : ''); ?>">
                            <?php echo esc_html($start_button_label); ?>
                        </button>
                <?php } ?>
                <?php
                if ($disclaimer_enable) {
                    echo '<button type="button" class="disclaimer">' . esc_html($start_button_label) . '</button>';
                } else if ($instruction_enable) {
                    echo '<button type="button" class="instruction">' . esc_html($start_button_label) . '</button>';
                } else if ($disclaimer_enable) {
                    echo '<button type="button" class="userform">' . esc_html('Skip') . '</button>';
                    echo '<button type="button" class="userform">' . esc_html('Next') . '</button>';
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
            <video id="avatarVideo" class="avatarVideo" poster="<?php echo esc_url($previewImage); ?>" autoplay playsinline>
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

        </div>
        <?php if ($video_enable) { ?>
            <div class="videoContainer userVideoContainer" id="userVideoContainer" style="display: none;">
                <video id="userVideo" class="hide" autoplay="" playsinline="" muted="">
                    <track kind="captions">
                </video>
            </div>
        <?php } ?>

        <div class="streamingCountdown-container" id="streamingCountdown"></div>

        <div class="language-switcher" title="Change Language">
            <span class="lang-icon" onclick="toggleLanguageDropdown()">
                <span id="selectedLanguage" style="opacity: 0;">
                    <img draggable="false" class="emoji" alt="us"
                        src="https://s.w.org/images/core/emoji/16.0.1/svg/1f1fa-1f1f8.svg">
                </span>
            </span>

            <div class="dropdown" id="languageDropdown" style="display: none;">
                <!-- <a href="#" onclick="setLanguage('en', 'us', 'English')">
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
                </a> -->
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
                <input type="text" id="userInput" class="textInput" placeholder="Let's chat!" />
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
                <?php 
                if ($disclaimer_title != '') {
                    echo '<h3 class="disclaimer-title">' . esc_html($disclaimer_title) . '</h3>';
                }
                ?>
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
            if ($form_id_to_use > 0) {
                $form_builder = Avatar_Form_Builder::get_instance();
                $form = $form_builder->get_form_by_id($form_id_to_use);
                
                if ($form && !empty($form->form_data)) {
                    $form_data = json_decode($form->form_data, true);
                    
                    if ($form_data && is_array($form_data) && isset($form_data['fields']) && !empty($form_data['fields'])) {
                        
                        if (!empty($form_data['title'])) {
                            echo '<h3>' . esc_html($form_data['title']) . '</h3>';
                        }
                        
                        if (!empty($form_data['description'])) {
                            echo '<p class="form-description">' . esc_html($form_data['description']) . '</p>';
                        }
                        
                        echo '<div class="user-form-fields">';
                        
                        foreach ($form_data['fields'] as $field) {
                            $field_id = isset($field['field_id']) ? $field['field_id'] : $field['id'];
                            $field_name = $field_id;
                            $required_class = isset($field['required']) && $field['required'] ? 'required' : '';
                            $required_attr = isset($field['required']) && $field['required'] ? 'required' : '';
                            
                            echo '<div class="form-field ' . esc_attr($field['type']) . '-field ' . esc_attr($required_class) . '" data-field-id="' . esc_attr($field_id) . '" data-field-label="' . esc_attr($field['label']) . '">';
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
                                        ' . esc_attr($required_attr) . '>';
                                    break;
                                    
                                case 'textarea':
                                    echo '<textarea 
                                        id="' . esc_attr($field_name) . '" 
                                        name="' . esc_attr($field_name) . '" 
                                        placeholder="' . esc_attr($field['placeholder'] ?? '') . '" 
                                        rows="3" ' . esc_attr($required_attr) . '></textarea>';
                                    break;
                                    
                                case 'select':
                                    echo '<select 
                                        id="' . esc_attr($field_name) . '" 
                                        name="' . esc_attr($field_name) . '" ' . esc_attr($required_attr) . '
                                        class="' . ($field['enable_other'] ? 'has-other-option' : '') . '"
                                        data-field-id="' . esc_attr($field_name) . '">';
                                    echo '<option value="">' . esc_html($field['placeholder'] ?? 'Select an option') . '</option>';
                                    
                                    if (!empty($field['options'])) {
                                        foreach ($field['options'] as $option) {
                                            echo '<option value="' . esc_attr($option) . '">' . esc_html($option) . '</option>';
                                        }
                                    }
                                    
                                    // Add "Other" option
                                    if ($field['enable_other']) {
                                        echo '<option value="_other_">Other</option>';
                                    }
                                    
                                    echo '</select>';
                                    
                                    // Add "Other" text input
                                    if ($field['enable_other']) {
                                    echo '<div class="other-input-wrapper" id="' . esc_attr($field_name) . '_other_wrapper" style="display: none; margin-top: 10px;">';
                                    echo '<label for="' . esc_attr($field_name) . '_other">' . esc_html($field['other_field_label'] ?? 'Please specify:') . '</label>';
                                    echo '<textarea
                                            id="' . esc_attr($field_name) . '_other"
                                            name="' . esc_attr($field_name) . '_other"
                                            placeholder="' . esc_attr($field['other_field_placeholder'] ?? 'Enter your answer...') . '"
                                            class="other-text-input"
                                            rows="4"
                                            style="width: 100%; margin-top: 5px;"></textarea>';
                                    echo '</div>';
                                }

                                    break;
                                    
                                case 'radio':
                                        if (!empty($field['options'])) {
                                            foreach ($field['options'] as $index => $option) {
                                                $radio_id = $field_name . '_' . $index;
                                                echo '<div class="radio-option">';
                                                echo '<input type="radio" 
                                                    id="' . esc_attr($radio_id) . '" 
                                                    name="' . esc_attr($field_name) . '" 
                                                    value="' . esc_attr($option) . '" 
                                                    class="' . ($field['enable_other'] ? 'has-other-option' : '') . '"
                                                    data-field-id="' . esc_attr($field_name) . '"
                                                    ' . esc_attr($required_attr) . '>';
                                                echo '<label for="' . esc_attr($radio_id) . '">' . esc_html($option) . '</label>';
                                                echo '</div>';
                                            }
                                        }
                                        
                                        // Add "Other" radio option
                                        if ($field['enable_other']) {
                                            $other_radio_id = $field_name . '_other_radio';
                                            echo '<div class="radio-option other-radio-option">';
                                            echo '<input type="radio" 
                                                id="' . esc_attr($other_radio_id) . '" 
                                                name="' . esc_attr($field_name) . '" 
                                                value="_other_" 
                                                class="has-other-option"
                                                data-field-id="' . esc_attr($field_name) . '"
                                                ' . esc_attr($required_attr) . '>';
                                            echo '<label for="' . esc_attr($other_radio_id) . '">Other</label>';
                                            echo '</div>';
                                            
                                            // Add "Other" text input
                                            echo '<div class="other-input-wrapper" id="' . esc_attr($field_name) . '_other_wrapper" style="display: none; margin-top: 10px; margin-left: 20px;">';
                                            echo '<label for="' . esc_attr($field_name) . '_other">' . esc_html($field['other_field_label'] ?? 'Please specify:') . '</label>';
                                            echo '<textarea type="text" 
                                                id="' . esc_attr($field_name) . '_other" 
                                                name="' . esc_attr($field_name) . '_other" 
                                                placeholder="' . esc_attr($field['other_field_placeholder'] ?? 'Enter your answer...') . '" 
                                                class="other-text-input"
                                                style="width: 100%; margin-top: 5px;"></textarea>';
                                            echo '</div>';
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
                                                    value="' . esc_attr($option) . '" 
                                                    class="' . ($field['enable_other'] ? 'has-other-option' : '') . '"
                                                    data-field-id="' . esc_attr($field_name) . '">';
                                                echo '<label for="' . esc_attr($checkbox_id) . '">' . esc_html($option) . '</label>';
                                                echo '</div>';
                                            }
                                        }
                                        
                                        // Add "Other" checkbox option
                                        if ($field['enable_other']) {
                                            $other_checkbox_id = $field_name . '_other_checkbox';
                                            echo '<div class="checkbox-option other-checkbox-option">';
                                            echo '<input type="checkbox" 
                                                id="' . esc_attr($other_checkbox_id) . '" 
                                                name="' . esc_attr($field_name) . '[]" 
                                                value="_other_" 
                                                class="has-other-option"
                                                data-field-id="' . esc_attr($field_name) . '">';
                                            echo '<label for="' . esc_attr($other_checkbox_id) . '">Other</label>';
                                            echo '</div>';
                                            
                                            // Add "Other" text input
                                            echo '<div class="other-input-wrapper" id="' . esc_attr($field_name) . '_other_wrapper" style="display: none; margin-top: 10px; margin-left: 20px;">';
                                            echo '<label for="' . esc_attr($field_name) . '_other">' . esc_html($field['other_field_label'] ?? 'Please specify:') . '</label>';
                                            echo '<textarea type="text" 
                                                id="' . esc_attr($field_name) . '_other" 
                                                name="' . esc_attr($field_name) . '_other" 
                                                placeholder="' . esc_attr($field['other_field_placeholder'] ?? 'Enter your answer...') . '" 
                                                class="other-text-input"
                                                style="width: 100%; margin-top: 5px;"></textarea>';
                                            echo '</div>';
                                        }
                                        break;
                                    case 'other':
                                        $field_name_checkbox = $field_name . '[checkbox]';
                                        $field_name_textarea = $field_name . '[textarea]';
                                        $is_required = isset($field['required']) && $field['required'] ? 'true' : 'false';
                                        
                                        echo '<div class="form-field other-field">';
                                        // echo '<label class="field-main-label">' . esc_html($field['label']) . '</label>';
                                        
                                        echo '<div class="conditional-field-wrapper">';
                                        
                                        // Checkbox
                                        echo '<div class="conditional-checkbox">';
                                        echo '<label>';
                                        echo '<input type="checkbox" 
                                            name="' . esc_attr($field_name_checkbox) . '" 
                                            value="on" 
                                            class="conditional-checkbox-input"
                                            id="' . esc_attr($field_name) . '_checkbox"> ';
                                        echo esc_html($field['checkbox_label'] ?: 'Enable additional details');
                                        echo '</label>';
                                        echo '</div>';
                                        
                                        // Textarea (initially disabled)
                                        echo '<div class="other" id="' . esc_attr($field_name) . '_textarea_container" style="display: none;">';
                                        // echo '<label class="textarea-label" for="' . esc_attr($field_name) . '_textarea">' . 
                                        //     esc_html($field['textarea_label'] ?: 'Additional details') . '</label>';
                                        echo '<textarea 
                                            id="' . esc_attr($field_name) . '_textarea"
                                            name="' . esc_attr($field_name_textarea) . '" 
                                            placeholder="' . esc_attr($field['placeholder'] ?: 'Enter your details here...') . '" 
                                            rows="4" 
                                            class="other-input"
                                            data-required="' . esc_attr($is_required) . '"
                                            disabled></textarea>';
                                        echo '</div>';
                                        
                                        echo '</div>';
                                        echo '</div>';
                                        break;
                                    }
                            
                            echo '</div>';
                        }
                        
                        echo '</div>';
                        
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
<?php } ?>

<?php if ($instruction_enable) { ?>
    <div class="instruction-container" id="instruction">
        <div class="instruction-content">
            <div class="instruction-header">
                <?php echo $instruction_title != '' ? '<h3 class="instruction-title">' . esc_html($instruction_title) . '</h3>' : '' ?>
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
<script type="text/javascript">
jQuery(document).ready(function($) {
    console.log('Conditional textarea handler initialized');
    
    // Function to toggle textarea based on checkbox
    function toggleConditionalTextarea(checkbox) {
        var $checkbox = $(checkbox);
        var fieldName = $checkbox.attr('id').replace('_checkbox', '');
        var $textareaContainer = $('#' + fieldName + '_textarea_container');
        var $textarea = $('#' + fieldName + '_textarea');
        var isRequired = $textarea.data('required') === 'true';
        
        console.log('Checkbox changed:', $checkbox.is(':checked'), 'Field:', fieldName);
        
        if ($checkbox.is(':checked')) {
            // Show textarea container
            $textareaContainer.slideDown(300, function() {
                // Enable textarea
                $textarea.prop('disabled', false);
                if (isRequired) {
                    $textarea.prop('required', true);
                }
                console.log('Textarea enabled for:', fieldName);
            });
        } else {
            // Hide textarea container
            $textareaContainer.slideUp(300, function() {
                // Disable textarea
                $textarea.prop('disabled', true);
                $textarea.prop('required', false);
                $textarea.val(''); // Clear value
                console.log('Textarea disabled for:', fieldName);
            });
        }
    }
    
    // Handle checkbox change events
    $(document).on('change', '.conditional-checkbox-input', function() {
        console.log('Checkbox change event fired');
        toggleConditionalTextarea(this);
    });
    
    // Initialize on page load
    $('.conditional-checkbox-input').each(function() {
        console.log('Initializing checkbox:', $(this).attr('id'));
        // If checkbox is checked on page load, enable textarea
        if ($(this).is(':checked')) {
            toggleConditionalTextarea(this);
        }
    });
    
    // Debug function to check textarea state
    window.debugTextarea = function() {
        console.log('=== DEBUG TEXTAREA STATE ===');
        $('.other-input').each(function() {
            var $textarea = $(this);
            console.log('Textarea ID:', $textarea.attr('id'), 
                'Disabled:', $textarea.prop('disabled'),
                'Visible:', $textarea.is(':visible'),
                'Parent visible:', $textarea.closest('.other').is(':visible'));
        });
    };
    
});
</script>
<script type="text/javascript">
jQuery(document).ready(function($) {
    console.log('Initializing Other option handlers...');
    
    // Function to handle "Other" option selection
    function initializeOtherOptionHandlers() {
        console.log('Setting up Other option event listeners');
        
        // For dropdowns
        $(document).on('change', 'select.has-other-option', function() {
            const $select = $(this);
            const fieldId = $select.data('field-id');
            const $otherWrapper = $('#' + fieldId + '_other_wrapper');
            const $otherInput = $('#' + fieldId + '_other');
            
            console.log('Dropdown changed:', fieldId, 'Value:', $select.val());
            
            if ($select.val() === '_other_') {
                console.log('Other option selected, showing input');
                $otherWrapper.slideDown(300);
                $otherInput.prop('disabled', false).prop('required', true);
                $otherInput.focus();
            } else {
                console.log('Regular option selected, hiding input');
                $otherWrapper.slideUp(300);
                $otherInput.prop('disabled', true).prop('required', false);
                $otherInput.val('');
            }
        });
        
        // For radio buttons
        $(document).on('change', 'input[type="radio"].has-other-option', function() {
            const $radio = $(this);
            const fieldId = $radio.data('field-id');
            const $otherWrapper = $('#' + fieldId + '_other_wrapper');
            const $otherInput = $('#' + fieldId + '_other');
            
            console.log('Radio changed:', fieldId, 'Value:', $radio.val());
            
            if ($radio.val() === '_other_') {
                console.log('Other radio selected, showing input');
                $otherWrapper.slideDown(300);
                $otherInput.prop('disabled', false).prop('required', true);
                $otherInput.focus();
            } else {
                console.log('Regular radio selected, hiding input');
                $otherWrapper.slideUp(300);
                $otherInput.prop('disabled', true).prop('required', false);
                $otherInput.val('');
            }
        });
        
        // For checkboxes
        $(document).on('change', 'input[type="checkbox"].has-other-option', function() {
            const $checkbox = $(this);
            const fieldId = $checkbox.data('field-id');
            const $otherWrapper = $('#' + fieldId + '_other_wrapper');
            const $otherInput = $('#' + fieldId + '_other');
            
            console.log('Checkbox changed:', fieldId, 'Value:', $checkbox.val(), 'Checked:', $checkbox.is(':checked'));
            
            if ($checkbox.val() === '_other_' && $checkbox.is(':checked')) {
                console.log('Other checkbox checked, showing input');
                $otherWrapper.slideDown(300);
                $otherInput.prop('disabled', false);
                $otherInput.focus();
            } else if ($checkbox.val() === '_other_' && !$checkbox.is(':checked')) {
                console.log('Other checkbox unchecked, hiding input');
                $otherWrapper.slideUp(300);
                $otherInput.prop('disabled', true);
                $otherInput.val('');
            }
        });
        
        // Initialize on page load
        console.log('Initializing existing Other options on page load');
        
        // Dropdowns
        $('select.has-other-option').each(function() {
            const $select = $(this);
            const fieldId = $select.data('field-id');
            console.log('Checking dropdown:', fieldId, 'Value:', $select.val());
            
            if ($select.val() === '_other_') {
                $('#' + fieldId + '_other_wrapper').show();
                $('#' + fieldId + '_other').prop('disabled', false);
            }
        });
        
        // Radio buttons
        $('input[type="radio"].has-other-option:checked').each(function() {
            const $radio = $(this);
            const fieldId = $radio.data('field-id');
            console.log('Checking radio:', fieldId, 'Value:', $radio.val());
            
            if ($radio.val() === '_other_') {
                $('#' + fieldId + '_other_wrapper').show();
                $('#' + fieldId + '_other').prop('disabled', false);
            }
        });
        
        // Checkboxes
        $('input[type="checkbox"].has-other-option:checked').each(function() {
            const $checkbox = $(this);
            const fieldId = $checkbox.data('field-id');
            console.log('Checking checkbox:', fieldId, 'Value:', $checkbox.val());
            
            if ($checkbox.val() === '_other_') {
                $('#' + fieldId + '_other_wrapper').show();
                $('#' + fieldId + '_other').prop('disabled', false);
            }
        });
        
        console.log('Other option handlers initialized successfully');
    }
    
    // Call this function when the form is loaded
    initializeOtherOptionHandlers();
    
    // Also re-initialize when the user form is shown (in case it's loaded dynamically)
    $(document).on('click', '.userform, .instruction, .disclaimer', function() {
        console.log('Form shown, re-initializing Other option handlers');
        setTimeout(initializeOtherOptionHandlers, 500);
    });
    
    // Debug function to check Other option state
    window.debugOtherOptions = function() {
        console.log('=== DEBUG OTHER OPTIONS ===');
        
        $('.has-other-option').each(function() {
            const $el = $(this);
            const fieldId = $el.data('field-id');
            const $otherWrapper = $('#' + fieldId + '_other_wrapper');
            const $otherInput = $('#' + fieldId + '_other');
            
            console.log('Element:', $el.attr('id') || $el.attr('name'), 
                'Type:', $el.attr('type') || 'select',
                'Value:', $el.val(),
                'Checked:', $el.is(':checked'),
                'Other wrapper exists:', $otherWrapper.length > 0,
                'Other wrapper visible:', $otherWrapper.is(':visible'),
                'Other input disabled:', $otherInput.prop('disabled'));
        });
    };
    
    // Test function to manually show Other inputs
    window.showAllOtherInputs = function() {
        $('.other-input-wrapper').show();
        $('.other-text-input').prop('disabled', false);
        console.log('All Other inputs shown and enabled');
    };
});
</script>