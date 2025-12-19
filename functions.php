<?php

// Hook into the WordPress dashboard setup
add_action('wp_dashboard_setup', 'register_avatar_studio_user_logs_dashboard_widget');

function register_avatar_studio_user_logs_dashboard_widget()
{
    wp_add_dashboard_widget(
        'avatar_studio_user_logs_dashboard_widget',      // Widget ID
        'Avatar Studio Visitor Stats',       // Widget Title
        'render_avatar_studio_user_logs_dashboard_widget' // Callback
    );
}

function render_avatar_studio_user_logs_dashboard_widget()
{
    global $wpdb;
    $table = $wpdb->prefix . 'avatar_studio_user_logs';

    // Total visits
    $total = (int) $wpdb->get_var("SELECT COUNT(*) FROM $table");

    // Unique visitors by IP
    $unique = (int) $wpdb->get_var("SELECT COUNT(DISTINCT ip_address) FROM $table");

    // Visits today
    $today = current_time('Y-m-d');
    $today_count = (int) $wpdb->get_var(
        $wpdb->prepare("SELECT COUNT(*) FROM $table WHERE DATE(timestamp) = %s", $today)
    );

    echo '<ul style="padding-left: 20px;">';
    echo '<li><strong>Total Visits:</strong> ' . number_format($total) . '</li>';
    echo '<li><strong>Unique Visitors:</strong> ' . number_format($unique) . '</li>';
    echo '<li><strong>Visits Today:</strong> ' . number_format($today_count) . '</li>';
    echo '</ul>';
}

// function arrayToCss($selector, $styles, $important = false)
// {
//     $user_agent = $_SERVER['HTTP_USER_AGENT'];
//     $is_mobile = preg_match('/Mobile|Android|iPhone|iPad/', $user_agent);
//     $cssProperties = [];

//     foreach ($styles as $property => $value) {
//         if (is_array($value) && in_array($property, ['border-radius', 'padding', 'margin'])) {
//             $top = isset($value['top']) && $value['top'] >= 0 ? $value['top'] . 'px' : '0';
//             $right = isset($value['right']) && $value['right'] >= 0 ? $value['right'] . 'px' : '0';
//             $bottom = isset($value['bottom']) && $value['bottom'] >= 0 ? $value['bottom'] . 'px' : '0';
//             $left = isset($value['left']) && $value['left'] >= 0 ? $value['left'] . 'px' : '0';

//             $importantSuffix = $important ? ' !important' : '';
//             if ($top || $right || $bottom || $left) {
//                 $cssProperties[] = "$property: $top $right $bottom $left$importantSuffix;";
//             }
//         } else if (is_array($value) && in_array($property, ['border'])) {
//             $borderWidth = isset($value['width']) ? $value['width'] . 'px' : '0';
//             $borderStyle = isset($value['style']) ? $value['style'] : 'solid';
//             $borderColor = isset($value['color']) ? $value['color'] : '#000';

//             $importantSuffix = $important ? ' !important' : '';
//             if (isset($value['width']) && $value['width'] >= 0) {
//                 $cssProperties[] = "$property: $borderWidth $borderStyle $borderColor$importantSuffix;";
//             }
//         } else if (is_array($value) && in_array($property, ['mini', 'medium', 'large'])) {

//             $width = $height = '';
//             if (isset($value['width']) && $value['width'] != '') {
//                 if (is_numeric($value['width'])) {
//                     $width = $value['width'] . 'px';
//                 } else {
//                     $width = $value['width'];
//                 }
//             }
//             if (isset($value['height']) && $value['height'] != '') {
//                 if (is_numeric($value['height'])) {
//                     $height = $value['height'] . 'px';
//                 } else {
//                     $height = $value['height'];
//                 }
//             }

//             $importantSuffix = $important ? ' !important' : '';
//             if ($width != '') {
//                 $cssProperties[] = "width: $width $importantSuffix;";
//             }
//             if ($height != '') {
//                 $cssProperties[] = "height: $height $importantSuffix;";
//             }

//         } else if (is_numeric($value) && in_array($property, ['border-radius', 'padding', 'margin', 'font-size', 'line-height', 'width', 'height'])) {
//             $cssProperty = str_replace('_', '-', $property);
//             $importantSuffix = $important ? ' !important' : '';
//             if ($value >= 0) {
//                 $cssProperties[] = "$cssProperty: $value" . 'px' . "$importantSuffix;";
//             }
//         } else {
//             $cssProperty = str_replace('_', '-', $property);
//             $importantSuffix = $important ? ' !important' : '';
//             if ($value != '') {
//                 $cssProperties[] = "$cssProperty: $value$importantSuffix;";
//             }
//         }
//     }

//     $cssString = $selector . " {\n    " . implode("\n    ", $cssProperties) . "\n}";

//     return $cssString;
// }


function arrayToCss($selector, $styles, $important = false)
{
    $baseCss = buildCssBlock($selector, $styles, $important);

    $mobileStyles = scaleStyles($styles, 0.8); // 20% smaller
    $mobileCss = buildCssBlock($selector, $mobileStyles, $important);

    $tabletStyles = scaleStyles($styles, 0.9); // 10% smaller
    $tabletCss = buildCssBlock($selector, $tabletStyles, $important);

    // Wrap mobile styles in media query
    $mediaQuery = "\n\n" . "@media (max-width: 767px) {\n$mobileCss\n}";
    $mediaQuery .= "\n\n" . "@media (min-width:768px) and (max-width: 935px) {\n$tabletCss\n}";

    return $baseCss . "\n\n" . $mediaQuery . "\n\n" . $mediaQuery;
}
function buildCssBlock($selector, $styles, $important = false)
{
    $cssProperties = [];
    $importantSuffix = $important ? ' !important' : '';

    foreach ($styles as $property => $value) {
        if (is_array($value) && in_array($property, ['border-radius', 'padding', 'margin'])) {
            $top = isValidCssValue($value['top'] ?? null) ? addPx($value['top']) : null;
            $right = isValidCssValue($value['right'] ?? null) ? addPx($value['right']) : null;
            $bottom = isValidCssValue($value['bottom'] ?? null) ? addPx($value['bottom']) : null;
            $left = isValidCssValue($value['left'] ?? null) ? addPx($value['left']) : null;

            if ($top !== null && $right !== null && $bottom !== null && $left !== null) {
                $cssProperties[] = "$property: $top $right $bottom $left$importantSuffix;";
            }
        } elseif (is_array($value) && $property === 'border') {
            $width = isValidCssValue($value['width'] ?? null) ? addPx($value['width']) : null;
            $style = isValidCssValue($value['style'] ?? null) ? $value['style'] : null;
            $color = isValidCssValue($value['color'] ?? null) ? $value['color'] : null;

            if ($width && $style && $color) {
                $cssProperties[] = "$property: $width $style $color$importantSuffix;";
            }
        } elseif (is_array($value) && in_array($property, ['mini', 'medium', 'large'])) {
            if (isValidCssValue($value['width'] ?? null)) {
                $cssProperties[] = "width: " . addPx($value['width']) . "$importantSuffix;";
            }
            if (isValidCssValue($value['height'] ?? null)) {
                $cssProperties[] = "height: " . addPx($value['height']) . "$importantSuffix;";
            }
        } elseif (is_numeric($value)) {
            $cssProp = str_replace('_', '-', $property);
            $cssProperties[] = "$cssProp: " . addPx($value) . "$importantSuffix;";
        } elseif (isValidCssValue($value)) {
            $cssProp = str_replace('_', '-', $property);
            $cssProperties[] = "$cssProp: $value$importantSuffix;";
        }
    }

    return "$selector {\n    " . implode("\n    ", $cssProperties) . "\n}";
}

function addPx($value)
{
    return is_numeric($value) ? $value . 'px' : $value;
}

function isValidCssValue($val)
{
    return $val !== null && $val !== '';
}
function scaleStyles($styles, $scale = 0.8)
{
    $scaled = [];

    foreach ($styles as $property => $value) {
        if (is_array($value)) {
            $scaled[$property] = scaleStyles($value, $scale); // recursive
        } elseif (is_numeric($value)) {
            $scaled[$property] = round($value * $scale, 2);
        } else {
            $scaled[$property] = $value;
        }
    }

    return $scaled;
}



// shortcode
function avatar_studio_shortcode($atts)
{
    $atts = shortcode_atts([
        'id' => '',
    ], $atts, 'avatar_studio');
    $avatar_studio_enable = get_option('avatar_studio_enable');
    $avatar_studio_id = esc_html($atts['id']);

    global $livekit_enable;
    global $avatar_vendor;
    global $api_key;
    global $chatBoxHeading;
    global $video_enable;
    global $chat_only;
    global $homePageID;
    global $pageId;
    global $avatar_id;
    global $knowledge_id;
    global $previewThumbnail;
    global $previewImage;
    global $active_thumbnail;
    global $avatar_name;
    global $avatarContainerID;
    global $time_limit;
    global $styles;
    global $disclaimer_enable;
    global $disclaimer;
    global $disclaimer_title;
    global $user_form_enable;
    global $instruction_enable;
    global $skip_instruction_video;
    global $instruction;
    global $instruction_title;
    global $start_button_label;

    global $wpdb;
    $avatar = $wpdb->get_row($wpdb->prepare(" SELECT * FROM {$wpdb->prefix}avatar_studio_avatars WHERE id = %d ", $avatar_studio_id));
    if (!$avatar) {
        return 'NOT Found';
    }
    if ($avatar->vendor) {
        $avatar_vendor = $avatar->vendor;
    }
    $avatar_studio_id = $avatar->id;
    $avatar_open_on_desktop = isset($avatar->open_on_desktop) ? $avatar->open_on_desktop : 0;
    $api_key = isset($avatar->api_key) ? $avatar->api_key : '';
    $chatBoxHeading = isset($avatar->title) ? $avatar->title : '';
    $opening_text = $avatar && $avatar->welcome_message ? json_decode($avatar->welcome_message, true) : [];
    $styles = $avatar && $avatar->styles ? json_decode($avatar->styles, true) : [];
    $time_limit = isset($avatar->time_limit) ? $avatar->time_limit : 60;
    $avatar_name = isset($avatar->avatar_name) ? $avatar->avatar_name : '';
    $avatar_id = isset($avatar->avatar_id) ? $avatar->avatar_id : '';
    $knowledge_id = isset($avatar->knowledge_id) ? $avatar->knowledge_id : '';
    $previewImage = isset($avatar->preview_image) ? $avatar->preview_image : '';
    $start_button_label = isset($avatar->start_button_label) ? stripslashes($avatar->start_button_label) : '';
    $active_thumbnail = isset($avatar->active_thumbnail) ? $avatar->active_thumbnail : 'medium';


    if ($active_thumbnail == 'mini') {
        $previewThumbnail = isset($avatar->thumbnail_mini) ? $avatar->thumbnail_mini : '';
    } else if ($active_thumbnail == 'medium') {
        $previewThumbnail = isset($avatar->thumbnail_medium) ? $avatar->thumbnail_medium : '';
    } else if ($active_thumbnail == 'large') {
        $previewThumbnail = isset($avatar->thumbnail_large) ? $avatar->thumbnail_large : '';
    }
    if ($previewThumbnail == '') {
        $previewThumbnail = $previewImage;
    }



    $disclaimer_enable = isset($avatar->disclaimer_enable) ? $avatar->disclaimer_enable : 0;
    $disclaimer_title = isset($avatar->disclaimer_title) ? stripslashes($avatar->disclaimer_title) : '';
    $disclaimer = isset($avatar->disclaimer) ? stripslashes($avatar->disclaimer) : '';
    $user_form_enable = isset($avatar->user_form_enable) ? $avatar->user_form_enable : 0;
    $selected_form_id = isset($avatar->selected_form_id) ? $avatar->selected_form_id : 0;
    $PLUGIN_OPTIONS['selected_form_id'] = $selected_form_id;
    $sanitized_options = array_map( 'sanitize_text_field', (array) $PLUGIN_OPTIONS );
    wp_localize_script('div_as_main_script', 'DIV_AS_OPTIONS', $sanitized_options);

    
    $instruction_enable = isset($avatar->instruction_enable) ? $avatar->instruction_enable : 0;
    $skip_instruction_video = isset($avatar->skip_instruction_video) ? $avatar->skip_instruction_video : 0;
    $instruction_title = isset($avatar->instruction_title) ? stripslashes($avatar->instruction_title) : '';
    $instruction = isset($avatar->instruction) ? stripslashes($avatar->instruction) : '';

    $chat_only = isset($avatar->chat_only) ? $avatar->chat_only : 0;
    $video_enable = isset($avatar->video_enable) ? $avatar->video_enable : 0;

    $voice_emotion = isset($avatar->voice_emotion) ? $avatar->voice_emotion : '';
    $livekit_enable = isset($avatar->livekit_enable) ? $avatar->livekit_enable : false;

    $PLUGIN_OPTIONS = [];
    $PLUGIN_OPTIONS['time_limit'] = $time_limit > 0 ? $time_limit : 300;
    $PLUGIN_OPTIONS['avatar_studio_enable'] = !!$avatar_studio_enable;
    $PLUGIN_OPTIONS['livekit_enable'] = !!$livekit_enable;
    $PLUGIN_OPTIONS['opening_text'] = $opening_text;
    $PLUGIN_OPTIONS['voice_emotion'] = $voice_emotion;
    $PLUGIN_OPTIONS['chat_only'] = $chat_only;
    $PLUGIN_OPTIONS['video_enable'] = $video_enable;

    $PLUGIN_OPTIONS['instruction_enable'] = $instruction_enable;
    $PLUGIN_OPTIONS['skip_instruction_video'] = $skip_instruction_video;
    $PLUGIN_OPTIONS['disclaimer_enable'] = $disclaimer_enable;
    $PLUGIN_OPTIONS['user_form_enable'] = $user_form_enable;

    wp_enqueue_script('avatar_studio-jspdf', 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', array('jquery'), AvatarStudioVersion, true);

    wp_enqueue_script('avatar_studio-script', plugins_url('assets/js/avatar_studio-script.js', __FILE__), array('jquery'), AvatarStudioVersion, true);
    wp_localize_script('avatar_studio-script', 'PLUGIN_OPTIONS', $PLUGIN_OPTIONS);

    
    ob_start();

    // if (!$livekit_enable) {

        if ($avatar_vendor == 'tavus') {
            echo ' <script type="module" crossorigin src="' . plugin_dir_url(__FILE__) . 'assets/js/tavus.js?v=' . AvatarStudioVersion . '"></script>';
            echo ' <script crossorigin src="https://unpkg.com/@daily-co/daily-js"></script> ';

        } else {
            echo ' <script type="module" crossorigin src="' . plugin_dir_url(__FILE__) . 'assets/js/heygen.js?v=' . AvatarStudioVersion . '"></script>';
        }
    // }
    echo ' <input type="hidden" id="ajaxURL" value="' . admin_url('admin-ajax.php') . '" />';
    echo ' <input type="hidden" id="avatar_studio_nonce" value="' . wp_create_nonce('avatar_studio_nonce_action') . '" />';
    echo ' <input type="hidden" id="heygen_assets" value="' . plugin_dir_url(__FILE__) . 'assets " />';

    ?>
    <style>
        <?php
        if ($styles && is_array($styles)) {
            foreach ($styles as $key => $style) {
                if ($key == 'chatBox') {
                    echo arrayToCss('#chatBox', $style, true);
                } else if ($key == 'thumbnail') {
                    echo arrayToCss('#avatarThumbnail', $style, true);
                } else if ($key == 'heading') {
                    echo arrayToCss('#chatBox-heading', $style, true);
                } else if ($key == 'chat-start-button') {
                    echo arrayToCss('#startSession', $style, true);
                    echo arrayToCss('button.disclaimer', $style, true);
                    echo arrayToCss('button.instruction', $style, true);

                } else if ($key == 'chat-end-button') {
                    echo arrayToCss('#endSession', $style, true);
                } else if ($key == 'mic-button') {
                    echo arrayToCss('#micToggler', $style, true);
                } else if ($key == 'camera-button') {
                    echo arrayToCss('#cameraToggler', $style, true);
                }
            }
        }


        ?>
    </style>
    <div class="chatBox-shortCode">
        <div id="chatBox" class="   <?php echo ($chat_only) ? 'text_mode' : 'voice_mode' ?>" style=" ">
            <div id="chat-widget">
                <input type="hidden" id="avatarStudioId" value="<?php echo $avatar_studio_id; ?>">
                <input type="hidden" id="pageId" value="">
                <?php
                require(plugin_dir_path(__FILE__) . 'avatarContainer.php'); ?>
            </div>
        </div>
    </div>
    <?php
    $output = ob_get_clean();
    return $output;
}
add_shortcode('avatar_studio', 'avatar_studio_shortcode');


