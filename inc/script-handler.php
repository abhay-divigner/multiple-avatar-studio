<?php
if (!defined('ABSPATH')) {
    exit;
}

class AvatarStudio_Script_Handler {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        // Add filter only once
        add_filter('script_loader_tag', array($this, 'add_module_attributes'), 10, 3);
    }
    
    public function add_module_attributes($tag, $handle, $src) {
        $module_scripts = array('avatar_studio-tavus', 'avatar_studio-heygen');
        
        if (in_array($handle, $module_scripts)) {
            // Parse the tag to add/modify attributes
            $tag = preg_replace(
                '/<script(.*?)>/',
                '<script type="module" crossorigin$1>',
                $tag
            );
        }
        
        return $tag;
    }
}

// Initialize
AvatarStudio_Script_Handler::get_instance();