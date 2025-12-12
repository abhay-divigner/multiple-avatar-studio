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
global $instruction_enable;
global $skip_instruction_video;
global $instruction;
global $instruction_title;
global $start_button_label;
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
<link rel="stylesheet" crossorigin="anonymous" referrerpolicy="no-referrer"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
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
            <i class="bi bi-x-lg"></i>
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
                    <button type="button" id="startSession" class="startSession" chatOnly="<?php echo $chat_only; ?>"
                        videoEnable="<?php echo $video_enable; ?>" avatarContainerID="<?php echo $avatarContainerID; ?>"
                        aid="<?php echo $aID; ?>" kid="<?php echo $kID; ?>"
                        opening_text="<?php echo $opening_text['en'] ?? ''; ?>" <?php echo !$required_fields_complete ? ' disabled style="opacity:0.5;cursor:not-allowed;"' : '' ?>
                        style="<?php echo $disclaimer_enable || $instruction_enable ? ' display:none; ' : '' ?>">
                        <?php echo $start_button_label; ?></button>
                <?php } else if ($avatar_vendor == 'tavus') { ?>
                        <button type="button" id="startSession" class="startSession" chatOnly="<?php echo $chat_only; ?>" initial_message = "<?php echo $time_limit ?>"
                            videoEnable="<?php echo $video_enable; ?>" avatarContainerID="<?php echo $avatarContainerID; ?>"
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
                        <i class="bi bi-arrow-left-square"></i>
                    </div>
                    <div class="icon icon-hide" title="Close Transcript" style="display: none;">
                        <i class="bi bi-arrow-right-square"></i>
                    </div>

                </button>
            </div>
            <div class="chatBox-fullscreen position-absolute r-10 b-10">
                <div class="action-fullscreen">
                    <i class="bi bi-fullscreen" title="Fullscreen"></i>
                    <i class="bi bi-arrows-angle-contract" title="Exit Fullscreen" style="display:none;"></i>
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
                <i class="bi bi-chat-square-text"></i>
            </div>
            <div id="listeningIcon" class="listeningIcon ">
            </div>
            <?php if (!$chat_only) { ?>
                <button type="button" id="micToggler" class="micToggler">
                    <i id="micIcon" class="fa-solid fa-microphone"></i>
                </button>
            <?php } ?>
            <?php if ($video_enable) { ?>
                <button type="button" id="cameraToggler"
                    class="cameraToggler <?php echo ($avatar_vendor == 'heygen') ? 'hide ' : '' ?>">
                    <i id="cameraIcon" class="fa-solid fa-video"></i>
                </button>
            <?php } ?>
            <button type="button" id="endSession" class="endSession">
                <i class="fa-solid fa-phone" style="transform: rotate(135deg);   "></i>
            </button>

            <div class="action-view-transcript">
                <button type="button" id="transcriptToggleButton" class="transcriptToggleButton view-transcript-button"
                    aria-label="View Transcript button">
                    <div class="icon icon-view" title="View Transcript">
                        <i class="bi bi-arrow-left-square"></i>
                    </div>
                    <div class="icon icon-hide" title="Close Transcript" style="display: none;">
                        <i class="bi bi-arrow-right-square"></i>
                    </div>

                </button>
            </div>
            <button type="button" class="chatBox-fullscreen">
                <div class="action-fullscreen">
                    <i class="bi bi-fullscreen" title="Fullscreen"></i>
                    <i class="bi bi-arrows-angle-contract" title="Exit Fullscreen" style="display:none;"></i>
                </div>
            </button>
        </div>
        <?php if ($video_enable) { ?>
            <div class="videoContainer userVideoContainer">
                <video id="userVideo" class="hide" autoplay="" playsinline="" muted="">
                    <track kind="captions">
                </video>
            </div>
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
                    <div class="flex gap-10"><i class="bi bi-file-earmark-pdf"></i> Export</div>
                </button>
                <button type="button" id="sendTranscriptToEmail" class="exportTranscript" style="display:none;"
                    title="Send to Email">
                    <div class="flex gap-10"><i class="bi bi-envelope-arrow-up"></i> Send
                </button>
            </div>
        </div>
        <div id="voiceTranscript" style="height: 150px;">

        </div>
        <div class="actionContainer">
            <div class="textInput-wrapper">
                <input type="text" id="userInput" class="textInput" placeholder="Let’s chat!" />
                <div id="<?php echo $avatar_vendor == 'tavus' ? 'send-btn' : 'speakButton' ?>" class="speakButton">
                    <i class="bi bi-arrow-right-short"></i>
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
                <button type="button" id="closeDisclaimer" class="closeDisclaimer"><i class="fa fa-close"></i></button>
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
        <label for="fullName">Full Name</label>
        <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
        />
        <div id="nameError" class="error hide">
            Please enter your full name.
        </div>

        <label for="mobile">Mobile Number</label>
        <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }

        form {
            background: rgba(10, 10, 10, 0.7);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            padding: 48px;
            border-radius: 16px;
            width: 100%;
            max-width: 480px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        #userDetailsForm label {
            display: block;
            color: #e0e0e0;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 8px;
            letter-spacing: 0.3px;
        }

        input, select {
            width: 100%;
            padding: 8px;
            background: #191919;
            border: 1px solid #191919;
            border-radius: 8px;
            color: #fff;
            font-size: 15px;
            transition: all 0.3s ease;
            outline: none;
            margin-bottom: 24px;
        }

        #userDetailsForm input:focus, select:focus {
            border-color: #4a9eff;
            background: #1a1a1a;
            box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.1);
        }

        #userDetailsForm input::placeholder {
            color: #666;
        }

        #userDetailsForm input[type="number"]::-webkit-inner-spin-button,
        #userDetailsForm input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        #userDetailsForm input[type="number"] {
            -moz-appearance: textfield;
        }

        .phone-input-container {
            display: flex;
            gap: 12px;
            margin-bottom: 24px;
        }

        .country-select {
            width: 140px;
            flex-shrink: 0;
            margin-bottom: 0;
        }

        .phone-input-container input {
            flex: 1;
            margin-bottom: 0;
        }

        .error {
            color: #ff5252;
            font-size: 13px;
            margin-top: -18px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .error::before {
            content: "⚠";
            font-size: 14px;
        }

        .hide {
            display: none;
        }

        #buttons {
            display: flex;
            gap: 12px;
            margin-top: 32px;
        }

        #buttons button {
            flex: 1;
            padding: 14px 24px;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            letter-spacing: 0.3px;
        }

        #skipBtn {
            background: #191919;
            color: #999;
            border: 1px solid #2a2a2a;
        }

        #skipBtn:hover {
            background: #141414;
            color: #e0e0e0;
            border-color: #3a3a3a;
        }

        #nextBtn {
            background: linear-gradient(135deg, #4a9eff 0%, #3d7fcc 100%);
            color: #fff;
            box-shadow: 0 4px 16px rgba(74, 158, 255, 0.3);
        }

        #nextBtn:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(74, 158, 255, 0.4);
        }

        #nextBtn:active {
            transform: translateY(0);
        }

        @media (max-width: 480px) {
            form {
                padding: 32px 24px;
            }

            .phone-input-container {
                flex-direction: column;
            }

            .country-select {
                width: 100%;
            }
        }
    </style>

        <div class="phone-input-container">
            <select id="countryCode" name="countryCode" class="country-select">
                <option value="+1">USA +1</option>
                <option value="+44">UK +44</option>
                <option value="+91" selected>India +91</option>
                <option value="+61">AUS +61</option>
                <option value="+81">JPN +81</option>
                <option value="+49">GER +49</option>
                <option value="+33">FRA +33</option>
                <option value="+39">ITA +39</option>
                <option value="+86">CHN +86</option>
                <option value="+971">UAE +971</option>
                <option value="+92">PAK +92</option>
                <option value="+94">SL +94</option>
                <option value="+60">MAL +60</option>
                <option value="+65">SIN +65</option>
                <option value="+34">ESP +34</option>
                <option value="+7">RUS +7</option>
                <option value="+55">BRA +55</option>
                <option value="+27">SA +27</option>
                <option value="+82">KOR +82</option>
                <option value="+62">INDO +62</option>
            </select>

            <input
                type="number"
                id="mobile"
                name="mobile"
                placeholder="Enter mobile number"
                maxlength="10"
                oninput="limitLength(this, 10)"
            />
        </div>
        <div id="mobileError" class="error hide">
            Please enter a valid mobile number (10 digits).
        </div>

        <label for="email">Email</label>
        <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
        />
        <div id="emailError" class="error hide">
            Please enter a valid email address.
        </div>

        <div id="buttons">
            <button type="button" id="skipBtn">Skip</button>
            <button type="button" id="nextBtn">Next</button>
        </div>
    </form>
    <script>
        function limitLength(input, maxLength) {
            if (input.value.length > maxLength) {
                input.value = input.value.slice(0, maxLength);
            }
        }
    </script>
    </div>
<?php } ?>
<?php if ($instruction_enable) { ?>
    <div class="instruction-container" id="instruction">
        <div class="instruction-content">
            <div class="instruction-header">
                <?php echo $instruction_title != '' ? '<h3 class="instruction-title">' . $instruction_title . '</h3>' : '' ?>
                <button type="button" id="closeInstruction" class="closeInstruction"><i class="fa fa-close"></i></button>
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


<!-- Toast Notification Container -->
<div id="toast-notification-container" class="toast-notification-container" 
    style="position: fixed; top: 20px; right: 20px; z-index: 10000;">
</div>
<style>
.toast-notification-container {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 350px;
}

.toast-notification {
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    color: white;
    font-size: 14px;
    font-weight: 500;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    animation: slideIn 0.3s ease forwards;
}

.toast-notification.show {
    opacity: 1;
    transform: translateX(0);
}

.toast-notification.hide {
    opacity: 0;
    transform: translateX(100%);
}

.toast-notification.success {
    background-color: #198754;
    border-left: 4px solid #0f5132;
}

.toast-notification.error {
    background-color: #dc3545;
    border-left: 4px solid #842029;
}

.toast-notification.warning {
    background-color: #fd7e14;
    border-left: 4px solid #984c0c;
}

.toast-notification.info {
    background-color: #0dcaf0;
    border-left: 4px solid #087990;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>

<div id="notification-container" class="toast-notification-container" style="position: fixed; top: 20px; right: 20px; z-index: 10000;">

</div>
<style>
    .notification {
        color: red;
        padding: 10px;
        border: 1px solid red;
    }
    .success {
        color: green;
    }
    .error {
        color: red;
    }
    .warn {
        color: yellow;
    }
    .info {
        color: grey;
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