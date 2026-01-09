<?php

if (!defined('ABSPATH')) {
    exit;
}

if (!function_exists('wp_mail')) {
    require_once(ABSPATH . 'wp-includes/pluggable.php');
}


add_action('wp_ajax_nopriv_avanew_as_avatar_studio_heygenToken', 'handle_avatar_studio_heygenToken');
add_action('wp_ajax_avanew_as_avatar_studio_heygenToken', 'handle_avatar_studio_heygenToken');

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
    $toast_messages = [];

    if ( ! empty( $avatar->toast_messages ) ) {
        $decoded = json_decode( $avatar->toast_messages, true );

        if ( json_last_error() === JSON_ERROR_NONE && is_array( $decoded ) ) {
            $toast_messages = $decoded;
        }
    }

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

    // Replace CURL with WordPress HTTP API
    $response = wp_remote_post('https://api.heygen.com/v1/streaming.create_token', [
        'headers' => [
            'x-api-key' => $heygen_api_key
        ],
        'timeout' => 30,
    ]);

    if (is_wp_error($response)) {
        $error_message = $response->get_error_message();
        
        avatar_studio_log_error('HeyGen token creation failed', [
            'error' => $error_message,
            'function' => __FUNCTION__
        ]);
        
        wp_send_json_error($error_message);
        wp_die();
    }
    
    $http_code = wp_remote_retrieve_response_code($response);
    $body = wp_remote_retrieve_body($response);
    
    $data = [];

    if ( ! empty( $body ) ) {
        $decoded = json_decode( $body, true );

        if ( json_last_error() === JSON_ERROR_NONE && is_array( $decoded ) ) {
            $data = $decoded;
        }
    }

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


add_action('wp_ajax_nopriv_avanew_as_avatar_studio_tavusConversation', 'handle_avatar_studio_tavusConversation');
add_action('wp_ajax_avanew_as_avatar_studio_tavusConversation', 'handle_avatar_studio_tavusConversation');

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


    $opening_text   = [];
    $toast_messages = [];

    if ( ! empty( $avatar ) && ! empty( $avatar->welcome_message ) ) {
        $decoded = json_decode( $avatar->welcome_message, true );

        if ( json_last_error() === JSON_ERROR_NONE && is_array( $decoded ) ) {
            $opening_text = $decoded;
        }
    }

    if ( ! empty( $avatar ) && ! empty( $avatar->toast_messages ) ) {
        $decoded = json_decode( $avatar->toast_messages, true );

        if ( json_last_error() === JSON_ERROR_NONE && is_array( $decoded ) ) {
            $toast_messages = $decoded;
        }
    }


    $tavus_api_key = isset($avatar->api_key) ? $avatar->api_key : '';
    $local_avatar_id = isset($avatar->avatar_id) ? $avatar->avatar_id : '';
    $local_knowledge_id = isset($avatar->knowledge_id) ? $avatar->knowledge_id : '';
    $RAG_API_URL = isset($avatar->RAG_API_URL) ? $avatar->RAG_API_URL : '';
    $deepgramKEY = isset($avatar->deepgramKEY) ? $avatar->deepgramKEY : '';
    $livekit_enable = isset($avatar->livekit_enable) ? $avatar->livekit_enable : '';
    $headers = [];
    if ( ! empty( $avatar ) && ! empty( $avatar->headers ) ) {
        $decoded = json_decode( $avatar->headers, true );

        if ( json_last_error() === JSON_ERROR_NONE && is_array( $decoded ) ) {
            $headers = $decoded;
        }
    }
 
    if (empty($tavus_api_key) || empty($local_avatar_id) || empty($local_knowledge_id)) {
        wp_send_json_error(['message' => 'Avatar is not properly configured']);
        wp_die();
    }

    // Get language from AJAX request (fallback: 'en')
    $language = isset($_POST['language']) ? sanitize_text_field($_POST['language']) : 'english';
    $language_short = getLanguageShortName($language);

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

    // Prepare request data
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

    // Make HTTP request using WordPress HTTP API
    $response = wp_remote_post('https://tavusapi.com/v2/conversations', [
        'headers' => [
            "x-api-key" => $tavus_api_key,
            "Content-Type" => "application/json"
        ],
        'body' => wp_json_encode($data),
        'timeout' => 30,
        'sslverify' => true
    ]);

    // Handle HTTP request errors
    if (is_wp_error($response)) {
        echo wp_json_encode([
            "error" => $response->get_error_message()
        ]);
        wp_die();
    }

    $response_body = wp_remote_retrieve_body($response);
    $response_code = wp_remote_retrieve_response_code($response);

    // Check for HTTP errors but don't send JSON error - echo the response exactly as Tavus returns it
    if ($response_code !== 200) {
        echo $response_body; // Echo the error response directly
        wp_die();
    }

    // Store the raw response for later use
    $raw_response = $response_body;

    // Process Deepgram token if needed
    if ($RAG_API_URL !== '' && $deepgramKEY !== '' && $livekit_enable == 1) {
        $res = updateDeepgramToken($deepgramKEY, $RAG_API_URL);
        if ($res['status'] != 200) {
            echo wp_json_encode([
                "error" => $res['error'],
                "status" => $res['status']
            ]);
            wp_die(); 
        } else {
            // Add token into existing response
            $decoded = json_decode($raw_response, true);
            $decoded['deepgram_token'] = $res['token'];

            $raw_response = wp_json_encode($decoded);
        }
    }

    // Decode response to extract conversation_id
    $response_data = json_decode($raw_response, true);
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
    $response_array = [];

    if ( ! empty( $raw_response ) ) {
        $decoded = json_decode( $raw_response, true );

        if ( json_last_error() === JSON_ERROR_NONE && is_array( $decoded ) ) {
            $response_array = $decoded;
        }
    }

    $response_array['toast_messages'] = $toast_messages;

    if (!empty($toast_messages)) {
        error_log('Tavus - Adding toast messages to response: ' . count($toast_messages) . ' messages');
    }

    // Encode back to JSON and echo directly (matching the original curl version)
    $response = wp_json_encode($response_array);

    echo $response;
    wp_die();
}

function updateDeepgramToken($deepgramKEY, $RAG_API_URL) {
    global $deepgramToken;

    // Validate input before making API call
    if (empty($RAG_API_URL) || empty($deepgramKEY)) {
        return [
            "error" => "Missing API URL or API Key",
            "status" => 400
        ];
    }

    // Replace CURL with WordPress HTTP API
    $response = wp_remote_post('https://api.deepgram.com/v1/auth/grant', [
        'headers' => [
            "Authorization" => "Token " . $deepgramKEY,
            "Content-Type" => "application/json"
        ],
        'timeout' => 30,
    ]);

    // Check for WordPress HTTP error
    if (is_wp_error($response)) {
        error_log('Deepgram API WordPress error: ' . $response->get_error_message());
        
        return [
            'error'  => 'WordPress HTTP Error: ' . $response->get_error_message(),
            'status' => 500,
        ];
    }

    $httpCode = wp_remote_retrieve_response_code($response);
    $response_body = wp_remote_retrieve_body($response);

    // Handle non-200 status
    if ($httpCode !== 200) {
        error_log(sprintf(
            'Deepgram API error: HTTP %d — %s',
            $httpCode,
            $response_body
        ));

        $resTest = [];

        if (!empty($response_body)) {
            $decoded = json_decode($response_body, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $resTest = $decoded;
            }
        }

        return [
            'error'  => 'Deepgram API Error',
            'data'   => $resTest,
            'status' => $httpCode,
        ];
    }

    $data = [];
    if (!empty($response_body)) {
        $decoded = json_decode($response_body, true);

        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            $data = $decoded;
        }
    }

    if (empty($data['access_token'])) {
        error_log("No access_token in Deepgram response: " . $response_body);

        return [
            "error" => "No access_token in response",
            "status" => 500
        ];
    }

    //Update global token only
    $deepgramToken = $data['access_token'];

    return [
        "token" => $deepgramToken,
        "status" => 200
    ];
}



add_action('wp_ajax_avanew_as_askQuestion', 'handle_ask_question');
add_action('wp_ajax_nopriv_avanew_as_askQuestion', 'handle_ask_question');

function handle_ask_question() {
    try {
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
        $headers = [
            'Content-Type' => 'application/json',
        ];

        if ( ! empty( $avatar ) && ! empty( $avatar->headers ) ) {
            $headers_array = json_decode( $avatar->headers, true );

            if ( json_last_error() === JSON_ERROR_NONE && is_array( $headers_array ) ) {
                foreach ( $headers_array as $header ) {
                    if (
                        isset( $header['key'], $header['value'] ) &&
                        ! empty( $header['key'] )
                    ) {
                        $key   = sanitize_key( $header['key'] );
                        $value = sanitize_text_field( $header['value'] );

                        $headers[ $key ] = $value;
                    }
                }
            } else {
                error_log( 'Failed to parse avatar headers JSON' );
            }
        }
                
        // Prepare request body
        $body = wp_json_encode([
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
            
            $response_data = json_decode( wp_unslash( $response_body ), true );
            
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
add_action('wp_ajax_nopriv_avanew_as_insert_avatar_studio_user', 'insert_avatar_studio_user');
add_action('wp_ajax_avanew_as_insert_avatar_studio_user', 'insert_avatar_studio_user');
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
        // Retrieve and sanitize the response body
        $response_body = wp_remote_retrieve_body($response);
        $response_body = wp_strip_all_tags($response_body); // Remove HTML tags or scripts
        $response_body = trim($response_body); // Remove extra whitespace

        if (empty($response_body)) {
            throw new Exception('Empty response from API', 500);
        }

        // Decode JSON safely
        $data = json_decode($response_body, true);

        // Check for JSON errors
        if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Failed to decode API response: ' . json_last_error_msg(), 500);
        }

        // Sanitize each expected field before use
        $country    = isset($data['country']) ? sanitize_text_field($data['country']) : '';
        $regionName = isset($data['regionName']) ? sanitize_text_field($data['regionName']) : '';
        $city       = isset($data['city']) ? sanitize_text_field($data['city']) : '';

        // Build location string safely
        $location_parts = array_filter([$city, $regionName, $country]); // Remove empty parts
        $location = implode(', ', $location_parts);
    }

    return [
        'ip' => sanitize_text_field($ip),
        'user_agent' => sanitize_textarea_field($user_agent),
        'location' => sanitize_text_field($location),
        'timestamp' => $timestamp
    ];
}

add_action('wp_ajax_avanew_as_send_pdf_email', 'handle_send_avatar_studio_pdf_email');
add_action('wp_ajax_nopriv_avanew_as_send_pdf_email', 'handle_send_avatar_studio_pdf_email');
function handle_send_avatar_studio_pdf_email() {
    // Verify request origin
    if (!avatar_studio_is_same_origin_request()) {
        wp_send_json_error(['message' => 'Unauthorized']);
        wp_die();
    }

    // Check required POST fields
    if (empty($_POST['transcript_data']) || empty($_POST['to_email'])) {
        wp_send_json_error(['message' => 'Missing data']);
        wp_die();
    }

    // Sanitize email
    $to_email = sanitize_email($_POST['to_email']);
    if (!is_email($to_email)) {
        wp_send_json_error(['message' => 'Invalid email address']);
        wp_die();
    }

    // Sanitize and decode transcript JSON
    $raw_transcript = wp_strip_all_tags(stripslashes($_POST['transcript_data']));
    $transcript_data = json_decode($raw_transcript, true);

    if (!is_array($transcript_data) || empty($transcript_data)) {
        wp_send_json_error(['message' => 'Transcript data is invalid']);
        wp_die();
    }

    // Load TCPDF
    require_once plugin_dir_path(__FILE__) . 'lib/TCPDF/tcpdf.php';
    $pdf = new TCPDF();
    $pdf->AddPage();
    $pdf->SetFont('helvetica', '', 12);

    foreach ($transcript_data as $entry) {
        $speaker   = isset($entry['speaker']) ? sanitize_text_field($entry['speaker']) : '';
        $text      = isset($entry['text']) ? sanitize_textarea_field($entry['text']) : '';
        $timestamp = isset($entry['timestamp']) ? sanitize_text_field($entry['timestamp']) : '';

        $pdf->SetFont('helvetica', 'B', 12);
        $pdf->Cell(0, 6, $speaker . ':', 0, 1);
        $pdf->SetFont('helvetica', '', 10);
        $pdf->Cell(0, 6, $timestamp, 0, 1);
        $pdf->MultiCell(0, 6, $text, 0, 1);
        $pdf->Ln(2);
    }

    // Save PDF
    $upload_dir = wp_upload_dir();
    $file_path = $upload_dir['path'] . '/transcript_' . time() . '.pdf';
    $pdf->Output($file_path, 'F');

    // Prepare email
    $subject = 'Your Transcript PDF';
    $body = 'Please find attached the transcript PDF.';
    $headers = [
        'From: Heygen <' . get_option('admin_email') . '>',
        'Reply-To: ' . get_option('admin_email'),
        'Content-Type: text/html; charset=UTF-8'
    ];
    $attachments = [$file_path];

    // Send email
    try {
        $sent = wp_mail($to_email, $subject, $body, $headers, $attachments);

        // Delete the file after sending
        @unlink($file_path);

        if ($sent) {
            wp_send_json_success(['message' => 'Email sent successfully!']);
        } else {
            wp_send_json_error(['message' => 'Failed to send email.']);
        }
    } catch (Exception $e) {
        wp_send_json_error(['message' => 'Error sending email: ' . $e->getMessage()]);
    }

    wp_die();
}

/**
 * Tavus Start
 */

add_action('wp_ajax_nopriv_avanew_as_send_tavus_text_message', 'handle_send_tavus_text_message');
add_action('wp_ajax_avanew_as_send_tavus_text_message', 'handle_send_tavus_text_message');

function handle_send_tavus_text_message() {
    // Verify request origin
    if (!avatar_studio_is_same_origin_request()) {
        wp_send_json_error(['message' => 'Unauthorized']);
        wp_die();
    }

    // Validate required POST fields
    if (empty($_POST['session_id']) || empty(trim($_POST['session_id']))) {
        wp_send_json_error(['message' => 'Session ID is required']);
        wp_die();
    }

    if (empty($_POST['message']) || empty(trim($_POST['message']))) {
        wp_send_json_error(['message' => 'Message is required']);
        wp_die();
    }

    // Sanitize inputs
    $session_id = sanitize_text_field($_POST['session_id']);
    $message = sanitize_textarea_field($_POST['message']);

    // Get and validate Tavus API key
    $tavus_api_key = esc_attr(get_option('tavus_api_key'));
    if (empty($tavus_api_key)) {
        wp_send_json_error(['message' => 'Tavus API key not configured']);
        wp_die();
    }

    // Prepare request body
    $body = [
        'message_type' => 'conversation',
        'event_type' => 'conversation.respond',
        'conversation_id' => $session_id,
        'properties' => [
            'text' => $message
        ]
    ];

    // Replace cURL with WordPress HTTP API
    $response = wp_remote_post('https://api.tavus.io/v2/interactions/events', [
        'headers' => [
            'x-api-key' => $tavus_api_key,
            'Content-Type' => 'application/json'
        ],
        'body' => wp_json_encode($body),
        'timeout' => 30,
        'redirection' => 5,
        'sslverify' => false, // Consider true for production
    ]);

    // Handle WordPress HTTP errors
    if (is_wp_error($response)) {
        wp_send_json_error(['message' => 'HTTP request failed: ' . $response->get_error_message()]);
        wp_die();
    }

    // Get response data
    $response_code = wp_remote_retrieve_response_code($response);
    $response_body = wp_remote_retrieve_body($response);

    // Decode JSON response safely
    $data = json_decode($response_body, true);
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        wp_send_json_error(['message' => 'Failed to decode API response: ' . json_last_error_msg()]);
        wp_die();
    }

    // Check for HTTP errors
    if ($response_code < 200 || $response_code >= 300) {
        $error_message = isset($data['error']) ? sanitize_text_field($data['error']) : "API returned HTTP {$response_code}";
        wp_send_json_error(['message' => $error_message]);
        wp_die();
    }

    // Handle API errors in response body
    if (!empty($data['error'])) {
        wp_send_json_error(['message' => sanitize_text_field($data['error'])]);
        wp_die();
    }

    // Success response
    wp_send_json_success([
        'message' => 'Message sent successfully',
        'response' => $data,
        'http_code' => $response_code
    ]);

    wp_die();
}

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
add_action('wp_ajax_avanew_as_avatar_studio_export_csv', 'handle_avatar_studio_export_csv');
add_action('wp_ajax_nopriv_avanew_as_avatar_studio_export_csv', 'handle_avatar_studio_export_csv');

function handle_avatar_studio_export_csv() {
    // Verify nonce
    if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'export_csv_action')) {
        wp_die('Security check failed');
    }
    
    global $wpdb;
    $table_name = $wpdb->prefix . 'avatar_studio_user_info';
    
    // Build query based on export type
    if (isset($_POST['export_all']) && $_POST['export_all'] === '1') {
        // Export all users - Use wpdb->prepare with safe SQL
        $export_query = $wpdb->prepare("SELECT * FROM %i ORDER BY created_at DESC", $table_name);
        $export_results = $wpdb->get_results($export_query);
        $filename_suffix = 'all-users';
    } else {
        // Export selected users
        if (!empty($_POST['selected_users'])) {
            $selected_users = array_map('intval', $_POST['selected_users']);
            
            // Create placeholders for the IN clause
            $placeholders = implode(',', array_fill(0, count($selected_users), '%d'));
            
            // Prepare the query properly
            $export_query = $wpdb->prepare(
                "SELECT * FROM %i WHERE id IN ($placeholders) ORDER BY created_at DESC",
                array_merge([$table_name], $selected_users)
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
            $row->conversation_id,
            $formatted_date
        ]);
    }
    
    fclose($output);
    wp_die(); // Important for AJAX
}

// Add AJAX handler for Form Submissions CSV export
add_action('wp_ajax_avanew_as_avatar_studio_export_submissions_csv', 'handle_avatar_studio_export_submissions_csv');
add_action('wp_ajax_nopriv_avanew_as_avatar_studio_export_submissions_csv', 'handle_avatar_studio_export_submissions_csv');

function handle_avatar_studio_export_submissions_csv() {
    // Verify nonce
    if (empty($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'export_submissions_csv_action')) {
        wp_die('Security check failed');
    }

    global $wpdb;

    // Get form_id from POST and sanitize
    $form_id = isset($_POST['form_id']) ? intval($_POST['form_id']) : 0;
    if (!$form_id) {
        wp_die('Form ID is required.');
    }

    // Get form details
    $form_table = $wpdb->prefix . 'avatar_forms';
    $submissions_table = $wpdb->prefix . 'avatar_form_submissions';

    // FIXED: Use direct table names instead of %i placeholder
    $form = $wpdb->get_row(
        $wpdb->prepare("SELECT * FROM {$form_table} WHERE id = %d", $form_id)
    );

    if (!$form) {
        wp_die('Form not found.');
    }

    // Decode form JSON safely
    $form_data = json_decode($form->form_data, true);
    if (!is_array($form_data)) {
        wp_die('Invalid form data.');
    }

    $fields = $form_data['fields'] ?? [];

    // Build export query
    $export_results = [];
    $filename_suffix = 'form-' . $form_id;

    if (!empty($_POST['export_all']) && $_POST['export_all'] === '1') {
        // FIXED: Use direct table name
        $export_results = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM {$submissions_table} WHERE form_id = %d ORDER BY submitted_at DESC",
                $form_id
            )
        );
        $filename_suffix = 'all-submissions-form-' . $form_id;
    } elseif (!empty($_POST['selected_submissions']) && is_array($_POST['selected_submissions'])) {
        $selected_submissions = array_map('intval', $_POST['selected_submissions']);
        if (!empty($selected_submissions)) {
            $placeholders = implode(',', array_fill(0, count($selected_submissions), '%d'));
            
            // FIXED: Build query properly
            $query = $wpdb->prepare(
                "SELECT * FROM {$submissions_table} WHERE form_id = %d AND id IN ($placeholders) ORDER BY submitted_at DESC",
                array_merge([$form_id], $selected_submissions)
            );
            
            $export_results = $wpdb->get_results($query);
            $filename_suffix = 'selected-submissions-form-' . $form_id;
        } else {
            wp_die('No submissions selected for export.');
        }
    } else {
        wp_die('Invalid export request.');
    }

    // Clear any previous output
    if (ob_get_length()) {
        ob_end_clean();
    }

    // Set CSV headers
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=form-submissions-' . $filename_suffix . '-' . date('Y-m-d-H-i-s') . '.csv');
    header('Pragma: no-cache');
    header('Expires: 0');

    $output = fopen('php://output', 'w');

    // Add BOM for UTF-8
    fputs($output, "\xEF\xBB\xBF");

    // CSV headers
    $csv_headers = ['Submission ID', 'Session ID', 'Avatar Studio ID'];
    foreach ($fields as $field) {
        $csv_headers[] = !empty($field['label']) ? sanitize_text_field($field['label']) : 'Field';
    }
    $csv_headers[] = 'Submitted At';

    fputcsv($output, $csv_headers);

    // Write rows
    foreach ($export_results as $row) {
        $data = json_decode($row->submission_data, true);
        if (!is_array($data)) {
            $data = [];
        }

        $row_data = [
            'FS' . intval($row->id),
            sanitize_text_field($row->session_id),
            $row->avatar_studio_id ? 'AS' . intval($row->avatar_studio_id) : 'N/A'
        ];

        foreach ($fields as $field) {
            $field_label = !empty($field['label']) ? $field['label'] : '';
            $field_value = isset($data[$field_label]) ? $data[$field_label] : '';
            
            if (is_array($field_value)) {
                $field_value = implode(', ', array_map('sanitize_text_field', $field_value));
            } else {
                $field_value = sanitize_text_field($field_value);
            }
            $row_data[] = $field_value;
        }

        $submitted_date = DateTime::createFromFormat('Y-m-d H:i:s', $row->submitted_at);
        $row_data[] = $submitted_date ? $submitted_date->format('m-d-Y H:i:s') : sanitize_text_field($row->submitted_at);

        fputcsv($output, $row_data);
    }

    fclose($output);
    exit;
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
        'pages' => wp_json_encode(array_map('intval', $_POST['pages'])),
        'styles' => wp_json_encode($_POST['styles']),
        'welcome_message' => wp_json_encode($_POST['welcome_message']),
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
            ], //Make sure format matches all fields
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
            ] //Make sure format matches all fields
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
add_action('wp_head', function() {
    global $avatar; // Your avatar object containing styles
    
    if ($avatar && isset($avatar->styles)) {
        $styles = json_decode($avatar->styles, true);
        if ($styles) {
            echo '<style>' . avatar_studio_generate_dynamic_css() . '</style>';
        }
    }
});