<?php
if (!function_exists('wp_mail')) {
    require_once(ABSPATH . 'wp-includes/pluggable.php');
}


add_action('wp_ajax_nopriv_avatar_studio_heygenToken', 'handle_avatar_studio_heygenToken');
add_action('wp_ajax_avatar_studio_heygenToken', 'handle_avatar_studio_heygenToken');


function handle_avatar_studio_heygenToken()
{
    if (!avatar_studio_is_same_origin_request()) {
        wp_send_json_error('Unauthorized');
        wp_die();
    }
    
    global $wpdb;
    
    $heygen_api_key = esc_attr(get_option('avatar_studio_heygen_api_key'));

    // Get raw userInfo data from POST
    $user_info_raw = isset($_POST['userInfo']) ? wp_unslash($_POST['userInfo']) : '';

    // Initialize an empty array
    $user_info = [];

    // Check if it's a non-empty string and looks like JSON
    if (!empty($user_info_raw)) {
        if (is_string($user_info_raw)) {
            $decoded = json_decode($user_info_raw, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $user_info = $decoded;
            }
        } elseif (is_array($user_info_raw)) {
            $user_info = $user_info_raw;
        }
    }

    // Extract and sanitize values
    $country_code = isset($user_info['countryCode']) && $user_info['countryCode'] !== null
        ? sanitize_text_field($user_info['countryCode'])
        : '';

    $email = isset($user_info['email']) && $user_info['email'] !== null
        ? sanitize_email($user_info['email'])
        : '';

    $mobile = isset($user_info['mobile']) && $user_info['mobile'] !== null
        ? sanitize_text_field($user_info['mobile'])
        : '';

    $full_name = isset($user_info['fullName']) && $user_info['fullName'] !== null
        ? sanitize_text_field($user_info['fullName'])
        : '';
    
    // Get current time
    $current_time = current_time('mysql');

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, "https://api.heygen.com/v1/streaming.create_token");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "x-api-key: $heygen_api_key"
    ]);
    curl_setopt($ch, CURLOPT_POST, true);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if ($response === false) {
        $error = curl_error($ch);
        curl_close($ch);
        
        avatar_studio_log_error('HeyGen token creation failed', [
            'error' => $error,
            'function' => __FUNCTION__
        ]);
        
        wp_send_json_error($error);
        wp_die();
    }
    
    curl_close($ch);
    
    $data = json_decode($response, true);
    
    if ($http_code !== 200 || !isset($data['data']['token'])) {
        avatar_studio_log_error('HeyGen API returned error', [
            'http_code' => $http_code,
            'response' => $data,
            'function' => __FUNCTION__
        ]);
        
        wp_send_json_error(isset($data['message']) ? $data['message'] : 'Failed to create token');
        wp_die();
    }
    
    // Generate a session_id for HeyGen
    $session_id = uniqid('heygen_', true);
    
    // Log user info data for debugging
    avatar_studio_log_error('HeyGen - Processing user info', [
        'session_id' => $session_id,
        'has_country_code' => !empty($country_code),
        'has_email' => !empty($email),
        'has_mobile' => !empty($mobile),
        'has_full_name' => !empty($full_name),
        'level' => 'info',
        'function' => __FUNCTION__
    ]);
    
    // Store user info to database - Check if we have ANY user info
    if (!empty($country_code) || !empty($email) || !empty($mobile) || !empty($full_name)) {
        $user_info_data = [
            'country_code'   => $country_code,
            'email'          => $email,
            'mobile'         => $mobile,
            'full_name'      => $full_name,
            'conversation_id' => $session_id,
            'created_at'     => $current_time,
        ];

        $insert_result = $wpdb->insert(
            $wpdb->prefix . 'avatar_studio_user_info',
            $user_info_data,
            ['%s', '%s', '%s', '%s', '%s', '%s']
        );

        if ($wpdb->last_error) {
            avatar_studio_log_error('HeyGen - User Info Insert Error', [
                'session_id' => $session_id,
                'error' => $wpdb->last_error,
                'data' => $user_info_data,
                'function' => __FUNCTION__
            ]);
        } else {
            avatar_studio_log_error('HeyGen - User info inserted successfully', [
                'session_id' => $session_id,
                'insert_id' => $wpdb->insert_id,
                'level' => 'info',
                'function' => __FUNCTION__
            ]);
        }
    } else {
        avatar_studio_log_error('HeyGen - No user info to insert', [
            'session_id' => $session_id,
            'user_info_raw' => $user_info_raw,
            'level' => 'warning',
            'function' => __FUNCTION__
        ]);
    }

    // Store session information
    if (!empty($session_id)) {
        $table_name = $wpdb->prefix . 'avatar_studio_sessions';
        
        // Get page_id and avatar_studio_id
        $pageId = isset($_POST['page_id']) ? intval($_POST['page_id']) : 0;
        $avatar_studio_id = isset($_POST['avatar_studio_id']) ? intval($_POST['avatar_studio_id']) : 0;
        
        // Get avatar info
        $avatar = null;
        if ($avatar_studio_id) {
            $avatar = $wpdb->get_row($wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}avatar_studio_avatars WHERE id = %d",
                $avatar_studio_id
            ));
        } else if ($pageId) {
            $avatar = $wpdb->get_row($wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}avatar_studio_avatars WHERE JSON_CONTAINS(pages, '\"%d\"')",
                $pageId
            ));
        }

        // Prepare session data
        $session_data = [
            'session_id'  => sanitize_text_field($session_id),
            'avatar_id'   => (!empty($avatar) && !empty($avatar->id)) ? sanitize_text_field($avatar->id) : '',
            'user_id'     => get_current_user_id() ?: 0,
            'status'      => 'active',
            'created_at'  => $current_time,
        ];

        // Remove any empty values to prevent invalid insertions
        $session_data = array_filter($session_data, function($value) {
            return $value !== null && $value !== '';
        });

        $session_insert = $wpdb->insert(
            $table_name,
            $session_data,
            ['%s', '%s', '%d', '%s', '%s']
        );

        if ($wpdb->last_error) {
            avatar_studio_log_error('HeyGen - Session Insert Error', [
                'session_id' => $session_id,
                'error' => $wpdb->last_error,
                'data' => $session_data,
                'function' => __FUNCTION__
            ]);
        } else {
            avatar_studio_log_error('HeyGen - Session inserted successfully', [
                'session_id' => $session_id,
                'insert_id' => $wpdb->insert_id,
                'avatar_id' => $session_data['avatar_id'] ?? 'none',
                'level' => 'info',
                'function' => __FUNCTION__
            ]);
        }
    }
    
    $result = array();
    $result['code'] = $data['code'];
    $result['message'] = $data['message'];
    $result['token'] = isset($data['data']['token']) ? $data['data']['token'] : '';
    $result['session_id'] = $session_id; // Return session_id to frontend
    
    wp_send_json_success($result);
    wp_die();
}


add_action('wp_ajax_nopriv_avatar_studio_tavusConversation', 'handle_avatar_studio_tavusConversation');
add_action('wp_ajax_avatar_studio_tavusConversation', 'handle_avatar_studio_tavusConversation');

function handle_avatar_studio_tavusConversation()
{
    if (!avatar_studio_is_same_origin_request()) {
        wp_send_json_error('Unauthorized');
        wp_die();
    }
    $pageId = isset($_POST['page_id']) ? intval($_POST['page_id']) : 0;
    $avatar_studio_id = isset($_POST['avatar_studio_id']) ? intval($_POST['avatar_studio_id']) : 0;
    global $wpdb;
    if ($avatar_studio_id) {
        $avatar = $wpdb->get_row($wpdb->prepare(" SELECT * FROM {$wpdb->prefix}avatar_studio_avatars WHERE id = %d ", $avatar_studio_id));
    } else {
        $avatar = $wpdb->get_row($wpdb->prepare(" SELECT * FROM {$wpdb->prefix}avatar_studio_avatars WHERE JSON_CONTAINS(pages, '\"%d\"')   ", $pageId));
    }

    if (!$avatar) {
        wp_send_json_error(['message' => 'No avatar configured for this page']);
        wp_die();
    }


    $opening_text = $avatar && $avatar->welcome_message ? json_decode($avatar->welcome_message, true) : [];


    $tavus_api_key = isset($avatar->api_key) ? $avatar->api_key : '';
    $local_avatar_id = isset($avatar->avatar_id) ? $avatar->avatar_id : '';
    $local_knowledge_id = isset($avatar->knowledge_id) ? $avatar->knowledge_id : '';
    if (empty($tavus_api_key) || empty($local_avatar_id) || empty($local_knowledge_id)) {
        wp_send_json_error(['message' => 'Avatar is not properly configured']);
        wp_die();
    }

    // Get language from AJAX request (fallback: 'en')
    $language = isset($_POST['language']) ? sanitize_text_field($_POST['language']) : 'english';
    $language_short = getLanguageShortName($language);

    $ch = curl_init();
     
    // Get raw userInfo data from POST
    $user_info_raw = isset($_POST['userInfo']) ? wp_unslash($_POST['userInfo']) : '';

    // Initialize an empty array
    $user_info = [];

    // Check if it's a non-empty string and looks like JSON
    if (!empty($user_info_raw)) {
        if (is_string($user_info_raw)) {
            $decoded = json_decode($user_info_raw, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $user_info = $decoded;
            }
        } elseif (is_array($user_info_raw)) {
            $user_info = $user_info_raw;
        }
    }

    // Extract and sanitize values
    $country_code = isset($user_info['countryCode']) && $user_info['countryCode'] !== null
        ? sanitize_text_field($user_info['countryCode'])
        : '';

    $email = isset($user_info['email']) && $user_info['email'] !== null
        ? sanitize_email($user_info['email'])
        : '';

    $mobile = isset($user_info['mobile']) && $user_info['mobile'] !== null
        ? sanitize_text_field($user_info['mobile'])
        : '';

    $full_name = isset($user_info['fullName']) && $user_info['fullName'] !== null
        ? sanitize_text_field($user_info['fullName'])
        : '';
    // Get current time
    $current_time = current_time('mysql');

    curl_setopt($ch, CURLOPT_URL, "https://tavusapi.com/v2/conversations");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "x-api-key: $tavus_api_key",
        "Content-Type: application/json"
    ]);
    curl_setopt($ch, CURLOPT_POST, true);

    $data = [
        "replica_id" => $local_avatar_id,
        "persona_id" => $local_knowledge_id,
        "conversation_name" => "Interactive Avatar Session",
        "properties" => [
            "language" => $language,
        ],
    ];
    if ($opening_text && $language_short && isset($opening_text[$language_short])) {
        $data['custom_greeting'] = $opening_text[$language_short];
    }
    $payload = json_encode($data);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

    $response = curl_exec($ch);

    if ($response === false) {
        echo json_encode([
            "error" => curl_error($ch)
        ]);
    } else {
        // Decode response to extract conversation_id
        $response_data = json_decode($response, true);
        $conversation_id = isset($response_data['conversation_id']) ? sanitize_text_field($response_data['conversation_id']) : '';

        // Check if we have user info and store to WordPress database
        if (!empty($country_code) || !empty($email) || !empty($mobile) || !empty($full_name)) {
            global $wpdb;

            $user_info_data = [
                'country_code'   => $country_code,
                'email'          => $email,
                'mobile'         => $mobile,
                'full_name'      => $full_name,
                'conversation_id' => $conversation_id,
                'created_at'     => $current_time,
            ];

            $wpdb->insert(
                $wpdb->prefix . 'avatar_studio_user_info',
                $user_info_data,
                ['%s', '%s', '%s', '%s', '%s', '%s']
            );

            if ($wpdb->last_error) {
                error_log('Avatar Studio User Info Insert Error: ' . $wpdb->last_error);
            }
        }

         // Store session information
     if (!empty($conversation_id)) {
            global $wpdb;

            $table_name = $wpdb->prefix . 'avatar_studio_sessions';
            $current_time = current_time('mysql');

            // Prepare data only for columns that exist in schema
            $session_data = [
                'session_id'  => !empty($conversation_id) ? sanitize_text_field($conversation_id) : '',
                'avatar_id'   => !empty($avatar->id) ? sanitize_text_field($avatar->id) : '',
                'user_id'     => get_current_user_id() ?: 0,
                'status'      => 'active',
                'created_at'  => $current_time,
            ];

            // Remove any empty values to prevent invalid insertions
            $session_data = array_filter($session_data, function($value) {
                return $value !== null && $value !== '';
            });

            $wpdb->insert(
                $table_name,
                $session_data,
                ['%s', '%s', '%d', '%s', '%s']
            );

            if ($wpdb->last_error) {
                error_log('Avatar Studio Session Insert Error: ' . $wpdb->last_error);
            }
        }

        echo $response;
    }

    curl_close($ch);
    wp_die();
}



function avatar_studio_is_same_origin_request()
{
    if (!isset($_SERVER['HTTP_ORIGIN']) && !isset($_SERVER['HTTP_REFERER'])) {
        return false;
    }

    $origin = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'];
    $origin_host = parse_url($origin, PHP_URL_HOST);
    $site_host = parse_url(get_site_url(), PHP_URL_HOST);

    return $origin_host === $site_host;
}
add_action('wp_ajax_nopriv_insert_avatar_studio_user', 'insert_avatar_studio_user');
add_action('wp_ajax_insert_avatar_studio_user', 'insert_avatar_studio_user');
function insert_avatar_studio_user()
{
    if (!avatar_studio_is_same_origin_request()) {
        wp_send_json_error('Unauthorized');
        wp_die();
    }
    global $wpdb;
    $table_name = $wpdb->prefix . 'avatar_studio_user_logs';
    $token = isset($_POST['token']) ? sanitize_text_field($_POST['token']) : '';
    $provider = isset($_POST['provider']) ? sanitize_text_field($_POST['provider']) : 'heygen';
    $info = get_avatar_studio_user_ip_agent_info();

    $wpdb->insert(
        $table_name,
        [
            'ip_address' => $info['ip'],
            'user_agent' => $info['user_agent'],
            'location' => $info['location'],
            'provider' => $provider,
            'token' => $token,
            'timestamp' => $info['timestamp'],
        ]
    );
}

function get_avatar_studio_user_ip_agent_info()
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
    $timestamp = current_time('mysql');
    $location = 'Unknown';

    // Use ip-api.com to get location
    $response = wp_remote_get("http://ip-api.com/json/{$ip}?fields=country,regionName,city");

    if (!is_wp_error($response)) {
        $data = json_decode(wp_remote_retrieve_body($response), true);
        if (isset($data['country'], $data['regionName'], $data['city'])) {
            $location = $data['city'] . ', ' . $data['regionName'] . ', ' . $data['country'];
        }
    }

    return [
        'ip' => sanitize_text_field($ip),
        'user_agent' => sanitize_textarea_field($user_agent),
        'location' => sanitize_text_field($location),
        'timestamp' => $timestamp
    ];
}

add_action('wp_ajax_send_pdf_email', 'handle_send_avatar_studio_pdf_email');
add_action('wp_ajax_nopriv_send_pdf_email', 'handle_send_avatar_studio_pdf_email');
function handle_send_avatar_studio_pdf_email()
{
    if (!avatar_studio_is_same_origin_request()) {
        wp_send_json_error('Unauthorized');
        wp_die();
    }
    if (!isset($_POST['transcript_data'], $_POST['to_email'])) {
        wp_send_json_error(['message' => 'Missing data']);
    }

    $transcript_data = json_decode(stripslashes($_POST['transcript_data']), true);
    $to_email = sanitize_email($_POST['to_email']);

    if (!filter_var($to_email, FILTER_VALIDATE_EMAIL)) {
        wp_send_json_error(['message' => 'Invalid email address']);
    }

    if (empty($transcript_data) || !is_array($transcript_data)) {
        wp_send_json_error(['message' => 'Transcript data is invalid']);
    }

    // Generate PDF using TCPDF or FPDF 
    require_once plugin_dir_path(__FILE__) . 'lib/TCPDF/tcpdf.php';
    $pdf = new TCPDF();
    $pdf->AddPage();
    $pdf->SetFont('helvetica', '', 12);

    foreach ($transcript_data as $entry) {
        $speaker = $entry['speaker'] ?? '';
        $text = $entry['text'] ?? '';
        $timestamp = $entry['timestamp'] ?? '';

        $pdf->SetFont('helvetica', 'B', 12);
        $pdf->Cell(0, 6, $speaker . ':', 0, 1);
        $pdf->SetFont('helvetica', '', 10);
        $pdf->Cell(0, 6, $timestamp, 0, 1);
        $pdf->MultiCell(0, 6, $text, 0, 1);
        $pdf->Ln(2);
    }

    $upload_dir = wp_upload_dir();
    $file_path = $upload_dir['path'] . '/transcript_' . time() . '.pdf';
    $pdf->Output($file_path, 'F');

    // Send email
    $subject = 'Your Transcript PDF';
    $body = 'Please find attached the transcript PDF.';
    $headers = ['Content-Type: text/html; charset=UTF-8'];
    $attachments = [$file_path];


    // Use wp_mail to send the email
    if (!function_exists('wp_mail')) {
        require_once(ABSPATH . 'wp-includes/pluggable.php');
    }
    try {
        $headers[] = 'From: Heygen < ' . get_option('admin_email') . '>';
        $headers[] = 'Reply-To: ' . get_option('admin_email');
        $headers[] = 'Content-Type: text/html; charset=UTF-8';
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-Disposition: attachment; filename="' . basename($file_path) . '"';
        $headers[] = 'Content-Transfer-Encoding: base64';
        $headers[] = 'X-Mailer: PHP/' . phpversion();
        $headers[] = 'X-Content-Type-Options: nosniff';
        $headers[] = 'X-Priority: 3'; // Normal priority
        $headers[] = 'X-MSMail-Priority: Normal';
        $headers[] = 'X-Mailer: PHP/' . phpversion();
        $headers[] = 'X-Content-Type-Options: nosniff';
        $headers[] = 'X-Priority: 3';
        if (!function_exists('wp_mail')) {
            require_once(ABSPATH . 'wp-includes/pluggable.php');
        }
        $sent = wp_mail($to_email, $subject, $body, $headers, $attachments);

        // Delete the file after sending
        @unlink($file_path);

        if ($sent) {
            wp_send_json_success(['message' => 'Email sent successfully!']);
        } else {
            wp_send_json_error(['message' => 'Failed to send email.']);
        }
    } catch (Exception $e) {
        wp_send_json_error(['message' => 'Failed to set email headers: ' . $e->getMessage()]);
    }
    wp_die();
}


/**
 * Tavus Start
 */

add_action('wp_ajax_nopriv_send_tavus_text_message', 'handle_send_tavus_text_message');
add_action('wp_ajax_send_tavus_text_message', 'handle_send_tavus_text_message');

function handle_send_tavus_text_message()
{
    if (!avatar_studio_is_same_origin_request()) {
        wp_send_json_error('Unauthorized');
        wp_die();
    }

    if (!isset($_POST['session_id']) || empty(trim($_POST['session_id']))) {
        wp_send_json_error(['message' => 'Session ID is required']);
        wp_die();
    }
    if (!isset($_POST['message']) || empty(trim($_POST['message']))) {
        wp_send_json_error(['message' => 'Message is required']);
        wp_die();
    }

    $session_id = sanitize_text_field($_POST['session_id']);
    $message = sanitize_textarea_field($_POST['message']);
    $tavus_api_key = esc_attr(get_option('tavus_api_key'));

    if (empty($tavus_api_key)) {
        wp_send_json_error(['message' => 'Tavus API key not configured']);
        wp_die();
    }

    $body = [
        "message_type" => "conversation",
        "event_type" => "conversation.respond",
        "conversation_id" => $session_id,
        "properties" => [
            "text" => $message
        ]
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.tavus.io/v2/interactions/events");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "x-api-key: $tavus_api_key",
        "Content-Type: application/json"
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, wp_json_encode($body));

    $response = curl_exec($ch);
    if ($response === false) {
        wp_send_json_error(['message' => curl_error($ch)]);
        wp_die();
    }
    curl_close($ch);

    $data = json_decode($response, true);
    if (isset($data['error'])) {
        wp_send_json_error(['message' => $data['error']]);
    } else {
        wp_send_json_success(['message' => 'Message sent successfully', 'response' => $data]);
    }
    wp_die();
}
/**
 * Tavus End
 */

add_action('wp_ajax_nopriv_get_avatar_studio_questionnaires', [$getavaterquestionnaireManager, 'getAvatarQuestionnaires']);
add_action('wp_ajax_get_avatar_studio_questionnaires', [$getavaterquestionnaireManager, 'getAvatarQuestionnaires']);
add_action('wp_ajax_nopriv_get_avatar_studio_questionnaire', [$getavaterquestionnaireManager, 'getAvatarQuestionnaire']);
add_action('wp_ajax_get_avatar_studio_questionnaire', [$getavaterquestionnaireManager, 'getAvatarQuestionnaire']);

add_action('wp_ajax_nopriv_post_user_answer', [$getavaterquestionnaireManager, 'postUserAnswer']);
add_action('wp_ajax_post_user_answer', [$getavaterquestionnaireManager, 'postUserAnswer']);




function getLanguageShortName($language)
{

    $languageMap = [
        "Spanish" => 'es',
        "French" => 'fr',
        "English" => 'en',
    ];
    if (isset($languageMap[$language])) {
        return $languageMap[$language];
    } else if (isset($languageMap[strtolower($language)])) {
        return $languageMap[strtolower($language)];
    } else {
        return "en";
    }
}
