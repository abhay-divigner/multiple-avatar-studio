<?php

if (!defined('ABSPATH')) {
    exit;
}
?>

<?php
define('DONOTCACHEPAGE', true);
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");
global $avatar_open_on_desktop;
global $avatar_studio_id;
global $avatar_vendor;
global $avatar_id;
global $knowledge_id;
global $previewThumbnail;
global $previewImage;
global $active_thumbnail;
global $avatar_name;
global $styles;
global $avatarContainerID;
global $video_enable;
global $chat_only;


if ($previewImage == '') {
    $previewImage = plugin_dir_url(__FILE__) . '/assets/images/preview.webp';
}

if ($previewThumbnail == '') {
    $previewThumbnail = plugin_dir_url(__FILE__) . '/assets/images/preview.webp';
}

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
            }
        }
    }


    ?>


    /* #chat-widget .avatarContainer {
        <?php
        if ($avatar_studio_chat_box_border_color != '') {
            echo 'border-color: ' . $avatar_studio_chat_box_border_color . ' !important;';
        }
        ?>
    }

    */
</style>
<div id="chat-icon">
    <img src="<?php echo $previewThumbnail; ?>" alt="avatar_thumb" id="avatarThumbnail"
        class="<?php echo 'thumbnail-' . $active_thumbnail ?>" />
</div>
<div id="chatBox" class=" <?php echo ($chat_only) ? 'text_mode' : 'voice_mode' ?>">
    <div id="chat-widget">
        <input type="hidden" id="avatarStudioId" value="<?php echo $avatar_studio_id; ?>">
        <input type="hidden" id="pageId" value="<?php echo get_the_ID(); ?>">
        <?php
        require(plugin_dir_path(__FILE__) . 'avatarContainer.php'); ?>
    </div>
</div>
<?php if ($avatar_open_on_desktop) { ?>

    <script type="text/javascript">
        window.addEventListener('load', () => {
            var chatBox = document.getElementById('chatBox');
            const chatIcon = document.getElementById('chat-icon');
            if (checkDesktopVisitor() && !chatBox.classList.contains('show')) {
                chatBox.classList.add('show');
                chatIcon.classList.add('hide');
            }
        });
    </script>

<?php } ?>


<script type="text/javascript">
jQuery(document).ready(function($) {
    // Function to update voice transcript height based on fullscreen state
    function updateTranscriptHeight() {
        const $voiceTranscript = $('#voiceTranscript');
        const isFullscreen = $('.bi-arrows-angle-contract').is(':visible');
        
        if (isFullscreen) {
            // Exit Fullscreen icon is visible - we're in fullscreen mode
            $voiceTranscript.css('height', '470px');
        } else {
            // Fullscreen icon is visible - we're in normal mode
            $voiceTranscript.css('height', '176px');
        }
    }
    
    // Initial height set on page load
    updateTranscriptHeight();
    
    // Listen for fullscreen toggle clicks
    $(document).on('click', '.action-fullscreen, .chatBox-fullscreen', function() {
        // Use setTimeout to let the icons switch first
        setTimeout(updateTranscriptHeight, 50);
    });
    
    // Also listen for the actual fullscreen change event
    $(document).on('fullscreenchange webkitfullscreenchange mozfullscreenchange msfullscreenchange', function() {
        updateTranscriptHeight();
    });
    
    // Observer to watch for icon visibility changes (more reliable)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const target = $(mutation.target);
                if (target.hasClass('bi-fullscreen') || target.hasClass('bi-arrows-angle-contract')) {
                    updateTranscriptHeight();
                }
            }
        });
    });
    
    // Start observing the fullscreen icons
    const fullscreenIcon = document.querySelector('.bi-fullscreen');
    const exitFullscreenIcon = document.querySelector('.bi-arrows-angle-contract');
    
    if (fullscreenIcon) {
        observer.observe(fullscreenIcon, { attributes: true, attributeFilter: ['style'] });
    }
    
    if (exitFullscreenIcon) {
        observer.observe(exitFullscreenIcon, { attributes: true, attributeFilter: ['style'] });
    }
});
</script>