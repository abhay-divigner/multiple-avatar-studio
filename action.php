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
    
    // Get page_id and avatar_studio_id from POST
    $pageId = isset($_POST['page_id']) ? intval($_POST['page_id']) : 0;
    $avatar_studio_id = isset($_POST['avatar_studio_id']) ? intval($_POST['avatar_studio_id']) : 0;
    
    $heygen_api_key = esc_attr(get_option('avatar_studio_heygen_api_key'));

    // Get avatar info based on page_id or avatar_studio_id
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

    if (!$avatar) {
        wp_send_json_error(['message' => 'No avatar configured for this page']);
        wp_die();
    }

    // Get toast_messages from avatar
    $toast_messages = isset($avatar->toast_messages) ? json_decode($avatar->toast_messages, true) : [];

    // Get raw userInfo data from POST
    $user_info_raw = isset($_POST['userInfo']) ? wp_unslash($_POST['userInfo']) : '';

    // Get additional avatar configuration
    $RAG_API_URL = isset($avatar->RAG_API_URL) ? $avatar->RAG_API_URL : '';
    $deepgramKEY = isset($avatar->deepgramKEY) ? $avatar->deepgramKEY : '';
    $livekit_enable = isset($avatar->livekit_enable) ? $avatar->livekit_enable : '';

    // Initialize an empty array
    $user_info = [];

    // Check if it's a non-empty string and looks like JSON
    if (!empty($user_info_raw)) {
        if (is_string($user_info_raw)) {
            $user_info_raw = isset($user_info_raw) ? sanitize_text_field($user_info_raw) : '';
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
    $result['session_id'] = $session_id;
    $result['toast_messages'] = $toast_messages;

    // Add Deepgram token
    if ($RAG_API_URL !== '' && $deepgramKEY !== '' && $livekit_enable == 1) {
        $res = updateDeepgramToken($deepgramKEY, $RAG_API_URL);
        if ($res['status'] != 200) {
            avatar_studio_log_error('HeyGen - Deepgram token creation failed', [
                'session_id' => $session_id,
                'error' => $res['error'],
                'status' => $res['status'],
                'function' => __FUNCTION__
            ]);
            
            // Don't fail the entire request, just log the error
            $result['deepgram_error'] = $res['error'];
        } else {
            // Add token to the response
            $result['deepgram_token'] = $res['token'];
            
            avatar_studio_log_error('HeyGen - Deepgram token added successfully', [
                'session_id' => $session_id,
                'level' => 'info',
                'function' => __FUNCTION__
            ]);
        }
    }
    
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
    $toast_messages = isset($avatar->toast_messages) ? json_decode($avatar->toast_messages, true) : [];


    $tavus_api_key = isset($avatar->api_key) ? $avatar->api_key : '';
    $local_avatar_id = isset($avatar->avatar_id) ? $avatar->avatar_id : '';
    $local_knowledge_id = isset($avatar->knowledge_id) ? $avatar->knowledge_id : '';
    $RAG_API_URL = isset($avatar->RAG_API_URL) ? $avatar->RAG_API_URL : '';
    $deepgramKEY = isset($avatar->deepgramKEY) ? $avatar->deepgramKEY : '';
    $livekit_enable = isset($avatar->livekit_enable) ? $avatar->livekit_enable : '';
    $headers = isset($avatar->headers) ? json_decode($avatar->headers, true) : [];
 
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


    if ($RAG_API_URL !== '' && $deepgramKEY !== '' && $livekit_enable == 1) {
       $res = updateDeepgramToken($deepgramKEY, $RAG_API_URL);
       if ($res['status'] != 200) {
            echo wp_json_encode([
                "error" => $res['error'],
                "status" => $res['status']
            ]);
            exit; 
        } else {
            // Add token into existing response
            $decoded = json_decode($response, true);
            $decoded['deepgram_token'] = $res['token'];

            $response = json_encode($decoded);
        }
    }


    if ($response === false) {
        echo wp_json_encode([
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

        // Decode the response to add toast messages
        $response_array = json_decode($response, true);

        $response_array['toast_messages'] = $toast_messages;

        if (!empty($toast_messages)) {
            error_log('Tavus - Adding toast messages to response: ' . count($toast_messages) . ' messages');
        }

        // Encode back to JSON
        $response = json_encode($response_array);

        echo $response;
    }

    curl_close($ch);
    wp_die();
}



function updateDeepgramToken($deepgramKEY, $RAG_API_URL) {
    global $deepgramToken;

    // Validate input before making cURL call
    if (empty($RAG_API_URL) || empty($deepgramKEY)) {
        return [
            "error" => "Missing API URL or API Key",
            "status" => 400
        ];
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.deepgram.com/v1/auth/grant");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Token " . $deepgramKEY,
        "Content-Type: application/json"
    ]);

    // If you need to send a body (check Deepgram docs):
    // $data = json_encode(['scopes' => ['usage:write']]);
    // curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

    $response = curl_exec($ch);  // Actually execute the request
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // Handle non-200 status
    if ($httpCode !== 200) {
        error_log("Deepgram API error: HTTP $httpCode — $response");


        $resTest = json_decode($response, true);
        return [
            "error" => "Deepgram APIError: $resTest",
            "status" => $httpCode
        ];
    }

    $data = json_decode($response, true);

    if (empty($data['access_token'])) {
        error_log("No access_token in Deepgram response: " . $response);

        return [
            "error" => "No access_token in response",
            "status" => 500
        ];
    }

    // ⬅️ Update global token only
    $deepgramToken = $data['access_token'];

    return [
        "token" => $deepgramToken,
        "status" => 200
    ];
}



add_action('wp_ajax_askQuestion', 'handle_ask_question');
add_action('wp_ajax_nopriv_askQuestion', 'handle_ask_question');

function handle_ask_question() {
    try {
        // // Verify nonce for security (recommended)
        // if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'ask_question_nonce')) {
        //     wp_send_json_error(['message' => 'Security verification failed'], 403);
        //     wp_die();
        // }
        
        // Get and sanitize POST parameters
        $avatarID = isset($_POST['avatarID']) ? intval($_POST['avatarID']) : 0;
        $sessionID = isset($_POST['sessionID']) ? sanitize_text_field($_POST['sessionID']) : '';
        $language = isset($_POST['language']) ? sanitize_text_field($_POST['language']) : 'en';
        $query = isset($_POST['query']) ? sanitize_textarea_field($_POST['query']) : '';
        
        // Validate required fields
        if (empty($avatarID)) {
            throw new Exception('Avatar ID is required', 400);
        }
        
        if (empty($query)) {
            throw new Exception('Query cannot be empty', 400);
        }
        
        // Validate query length
        if (strlen($query) > 5000) {
            throw new Exception('Query exceeds maximum length of 5000 characters', 400);
        }
        
        global $wpdb;
        
        // Fetch avatar details
        $avatar = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}avatar_studio_avatars WHERE id = %d", 
            $avatarID
        ));
        
        if ($wpdb->last_error) {
            throw new Exception('Database query failed: ' . $wpdb->last_error, 500);
        }
        
        if (!$avatar) {
            throw new Exception('Avatar not found for the provided ID', 404);
        }
        
        // Extract and validate RAG API URL
        $RAG_API_URL = isset($avatar->RAG_API_URL) ? trim($avatar->RAG_API_URL) : '';
        
        if (empty($RAG_API_URL)) {
            throw new Exception('RAG API URL not configured for this avatar', 500);
        }
        
        // Validate URL format
        if (!filter_var($RAG_API_URL, FILTER_VALIDATE_URL)) {
            throw new Exception('Invalid RAG API URL format', 500);
        }
        
        // Parse headers from JSON
        $headers = ['Content-Type' => 'application/json'];
        
        if (isset($avatar->headers) && !empty($avatar->headers)) {
            try {
                $headers_array = json_decode($avatar->headers, true);
                
                if (!is_array($headers_array)) {
                    throw new Exception('Invalid headers format');
                }
                
                foreach ($headers_array as $header) {
                    if (isset($header['key']) && isset($header['value']) && !empty($header['key'])) {
                        $headers[$header['key']] = sanitize_text_field($header['value']);
                    }
                }
            } catch (Exception $e) {
                throw new Exception('Failed to parse avatar headers: ' . $e->getMessage(), 500);
            }
        }
        
        // Prepare request body
        $body = json_encode([
            'query' => $query,
            'lng' => $language,
            'sessionId' => $sessionID
        ]);
        
        if ($body === false) {
            throw new Exception('Failed to encode request body', 500);
        }
        
        // Make API call
        $response = wp_remote_post($RAG_API_URL, [
            'headers' => $headers,
            'body' => $body,
            'timeout' => 30,
            'sslverify' => true
        ]);
        
        // Check for WP errors
        if (is_wp_error($response)) {
            $error_message = $response->get_error_message();
            throw new Exception('API request failed: ' . $error_message, 500);
        }
        
        // Check HTTP status code
        $response_code = wp_remote_retrieve_response_code($response);
        if ($response_code < 200 || $response_code >= 300) {
            $response_body = wp_remote_retrieve_body($response);
            throw new Exception(
                'API returned error status ' . $response_code . ': ' . substr($response_body, 0, 200),
                $response_code
            );
        }
        
        // Parse response
        $response_body = wp_remote_retrieve_body($response);
        
        if (empty($response_body)) {
            throw new Exception('Empty response from RAG API', 500);
        }
        
        $response_data = json_decode($response_body, true);
        
        if ($response_data === null && json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception(
                'Failed to decode API response: ' . json_last_error_msg(),
                500
            );
        }
        
        // Send success response
        wp_send_json_success($response_data);
        
    } catch (Exception $e) {    
        // Get appropriate HTTP status code
        $status_code = $e->getCode() ?: 500;
        $status_code = ($status_code < 100) ? 500 : $status_code;
        
        // Send error response
        wp_send_json_error(
            [
                'message' => $e,
                'code' => $status_code
            ],
            $status_code
        );
    } finally {
        wp_die();
    }
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

    $transcript_data = isset($_POST['transcript_data']) ? 
    json_decode(stripslashes(sanitize_text_field($_POST['transcript_data'])), true) : 
    array();

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


// Add AJAX handler for CSV export
add_action('wp_ajax_avatar_studio_export_csv', 'handle_avatar_studio_export_csv');
add_action('wp_ajax_nopriv_avatar_studio_export_csv', 'handle_avatar_studio_export_csv');

function handle_avatar_studio_export_csv() {
    // Verify nonce
    if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'export_csv_action')) {
        wp_die('Security check failed');
    }
    
    global $wpdb;
    $table_name = $wpdb->prefix . 'avatar_studio_user_info';
    
    // Build query based on export type
    if (isset($_POST['export_all']) && $_POST['export_all'] === '1') {
        // Export all users
        $export_query = "SELECT * FROM {$table_name} ORDER BY created_at DESC";
        $export_results = $wpdb->get_results($export_query);
        $filename_suffix = 'all-users';
    } else {
        // Export selected users
        if (!empty($_POST['selected_users'])) {
            $selected_users = array_map('intval', $_POST['selected_users']);
            $placeholders = implode(',', array_fill(0, count($selected_users), '%d'));
            
            $export_query = $wpdb->prepare(
                "SELECT * FROM {$table_name} WHERE id IN ($placeholders) ORDER BY created_at DESC",
                $selected_users
            );
            $export_results = $wpdb->get_results($export_query);
            $filename_suffix = 'selected-users';
        } else {
            wp_die('No users selected for export.');
        }
    }
    
    // Clear any previous output
    if (ob_get_level()) {
        ob_end_clean();
    }
    
    // Set headers for CSV download
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=avatar-studio-' . $filename_suffix . '-' . date('Y-m-d-H-i-s') . '.csv');
    header('Pragma: no-cache');
    header('Expires: 0');
    
    // Create output stream
    $output = fopen('php://output', 'w');
    
    // Add BOM for UTF-8
    fputs($output, "\xEF\xBB\xBF");
    
    // CSV headers
    fputcsv($output, [
        'ID',
        'Full Name', 
        'Email Address',
        'Phone Number',
        // 'Country Code',
        'Conversation ID',
        'Created At'
    ]);
    
    // Add data rows
    foreach ($export_results as $row) {
        $created_date = DateTime::createFromFormat('Y-m-d H:i:s', $row->created_at);
        $formatted_date = $created_date ? $created_date->format('m-d-Y H:i:s') : $row->created_at;
        
        $clean_phone = preg_replace('/[^0-9]/', '', $row->mobile);
        if (substr($clean_phone, 0, 1) === '1' && strlen($clean_phone) === 11) {
            $clean_phone = substr($clean_phone, 1);
        }
        if (strlen($clean_phone) === 10) {
            $formatted_phone = '+1 (' . substr($clean_phone, 0, 3) . ') ' . substr($clean_phone, 3, 3) . '-' . substr($clean_phone, 6, 4);
        } else {
            $formatted_phone = $row->mobile;
        }
        
        fputcsv($output, [
            'AS' . $row->id,
            $row->full_name,
            $row->email,
            $formatted_phone,
            // $row->country_code,
            $row->conversation_id,
            $formatted_date
        ]);
    }
    
    fclose($output);
    wp_die(); // Important for AJAX
}

// Add AJAX handler for Form Submissions CSV export
add_action('wp_ajax_avatar_studio_export_submissions_csv', 'handle_avatar_studio_export_submissions_csv');
add_action('wp_ajax_nopriv_avatar_studio_export_submissions_csv', 'handle_avatar_studio_export_submissions_csv');

function handle_avatar_studio_export_submissions_csv() {
    // Verify nonce
    if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'export_submissions_csv_action')) {
        wp_die('Security check failed');
    }
    
    global $wpdb;
    
    // Get form_id from POST
    $form_id = isset($_POST['form_id']) ? intval($_POST['form_id']) : 0;
    
    if (!$form_id) {
        wp_die('Form ID is required.');
    }
    
    // Get form details
    $form_table = $wpdb->prefix . 'avatar_forms';
    $submissions_table = $wpdb->prefix . 'avatar_form_submissions';
    
    $form = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM {$form_table} WHERE id = %d",
        $form_id
    ));
    
    if (!$form) {
        wp_die('Form not found.');
    }
    
    $form_data = json_decode($form->form_data, true);
    $fields = $form_data['fields'] ?? [];
    
    // Build query based on export type
    if (isset($_POST['export_all']) && $_POST['export_all'] === '1') {
        // Export all submissions for this form
        $export_query = $wpdb->prepare(
            "SELECT * FROM {$submissions_table} WHERE form_id = %d ORDER BY submitted_at DESC",
            $form_id
        );
        $export_results = $wpdb->get_results($export_query);
        $filename_suffix = 'all-submissions-form-' . $form_id;
    } else {
        // Export selected submissions
        if (!empty($_POST['selected_submissions'])) {
            $selected_submissions = array_map('intval', $_POST['selected_submissions']);
            $placeholders = implode(',', array_fill(0, count($selected_submissions), '%d'));
            
            $export_query = $wpdb->prepare(
                "SELECT * FROM {$submissions_table} WHERE form_id = %d AND id IN ($placeholders) ORDER BY submitted_at DESC",
                array_merge([$form_id], $selected_submissions)
            );
            $export_results = $wpdb->get_results($export_query);
            $filename_suffix = 'selected-submissions-form-' . $form_id;
        } else {
            wp_die('No submissions selected for export.');
        }
    }
    
    // Clear any previous output
    if (ob_get_level()) {
        ob_end_clean();
    }
    
    // Set headers for CSV download
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=form-submissions-' . $filename_suffix . '-' . date('Y-m-d-H-i-s') . '.csv');
    header('Pragma: no-cache');
    header('Expires: 0');
    
    // Create output stream
    $output = fopen('php://output', 'w');
    
    // Add BOM for UTF-8
    fputs($output, "\xEF\xBB\xBF");
    
    // Prepare CSV headers
    $headers = [
        'Submission ID',
        'Session ID', 
        'Avatar Studio ID'
    ];
    
    // Add form fields as headers
    foreach ($fields as $field) {
        $headers[] = $field['label'];
    }
    
    $headers[] = 'Submitted At';
    
    // Write headers
    fputcsv($output, $headers);
    
    // Add data rows
    foreach ($export_results as $row) {
        $data = json_decode($row->submission_data, true);
        
        $row_data = [
            'FS' . $row->id,
            $row->session_id,
            $row->avatar_studio_id ? 'AS' . $row->avatar_studio_id : 'N/A'
        ];
        
        // Add form field values
        foreach ($fields as $field) {
            $field_value = isset($data[$field['label']]) ? $data[$field['label']] : '';
            if (is_array($field_value)) {
                $field_value = implode(', ', $field_value);
            }
            $row_data[] = $field_value;
        }
        
        // Format date
        $submitted_date = DateTime::createFromFormat('Y-m-d H:i:s', $row->submitted_at);
        $formatted_date = $submitted_date ? $submitted_date->format('m-d-Y H:i:s') : $row->submitted_at;
        $row_data[] = $formatted_date;
        
        fputcsv($output, $row_data);
    }
    
    fclose($output);
    wp_die(); // Important for AJAX
}

// In your save_avatar or update_avatar function, add:
function save_avatar_callback() {
    
    // Get form data
    $data = [
        'vendor' => sanitize_text_field($_POST['vendor']),
        'api_key' => sanitize_text_field($_POST['api_key']),
        'title' => sanitize_text_field($_POST['title']),
        'avatar_name' => sanitize_text_field($_POST['avatar_name']),
        'avatar_id' => sanitize_text_field($_POST['avatar_id']),
        'knowledge_id' => sanitize_text_field($_POST['knowledge_id']),
        'preview_image' => esc_url_raw($_POST['preview_image']),
        'thumbnail_mini' => esc_url_raw($_POST['thumbnail_mini']),
        'thumbnail_medium' => esc_url_raw($_POST['thumbnail_medium']),
        'thumbnail_large' => esc_url_raw($_POST['thumbnail_large']),
        'active_thumbnail' => sanitize_text_field($_POST['active_thumbnail']),
        'time_limit' => intval($_POST['time_limit']),
        'open_on_desktop' => isset($_POST['open_on_desktop']) ? 1 : 0,
        'livekit_enable' => isset($_POST['livekit_enable']) ? 1 : 0,
        'video_enable' => isset($_POST['video_enable']) ? 1 : 0,
        'chat_only' => isset($_POST['chat_only']) ? 1 : 0,
        'disclaimer_title' => sanitize_text_field($_POST['disclaimer_title']),
        'disclaimer' => wp_kses_post($_POST['disclaimer']),
        'disclaimer_enable' => isset($_POST['disclaimer_enable']) ? 1 : 0,
        'user_form_enable' => isset($_POST['user_form_enable']) ? 1 : 0,
        'selected_form_id' => isset($_POST['selected_form_id']) ? intval($_POST['selected_form_id']) : 0,        'instruction_title' => sanitize_text_field($_POST['instruction_title']),
        'instruction' => wp_kses_post($_POST['instruction']),
        'skip_instruction_video' => isset($_POST['skip_instruction_video']) ? 1 : 0,
        'instruction_enable' => isset($_POST['instruction_enable']) ? 1 : 0,
        'RAG_API_URL' => esc_url_raw($_POST['RAG_API_URL']),
        'deepgramKEY' => sanitize_text_field($_POST['deepgramKEY']),
        'voice_emotion' => sanitize_text_field($_POST['voice_emotion']),
        'pages' => json_encode(array_map('intval', $_POST['pages'])),
        'styles' => json_encode($_POST['styles']),
        'welcome_message' => json_encode($_POST['welcome_message']),
        'start_button_label' => sanitize_text_field($_POST['start_button_label'])
    ];
    
    global $wpdb;
    $table_name = $wpdb->prefix . 'avatar_studio_avatars';
    
    if (isset($_POST['id']) && intval($_POST['id']) > 0) {
        // UPDATE existing avatar
        $wpdb->update(
            $table_name,
            $data,
            ['id' => intval($_POST['id'])],
            [
                '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', 
                '%s', '%s', '%d', '%d', '%d', '%d', '%d', '%s', '%s', 
                '%d', '%d', '%d', '%s', '%s', '%d', '%d', '%s', '%s', 
                '%s', '%s', '%s', '%s'
            ], // ✅ Make sure format matches all fields
            ['%d']
        );
    } else {
        // INSERT new avatar
        $wpdb->insert(
            $table_name,
            $data,
            [
                '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', 
                '%s', '%s', '%d', '%d', '%d', '%d', '%d', '%s', '%s', 
                '%d', '%d', '%d', '%s', '%s', '%d', '%d', '%s', '%s', 
                '%s', '%s', '%s', '%s'
            ] // ✅ Make sure format matches all fields
        );
    }
    
    // Redirect or return success
    wp_redirect(admin_url('admin.php?page=avatar_studio-avatars'));
    exit;
}

add_action('admin_init', 'avatar_studio_force_check_database');
function avatar_studio_force_check_database() {
    // Run database update on every admin page load temporarily
    avatarStudioUpdateDatabase();
}
