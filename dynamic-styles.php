<?php
if (!defined('ABSPATH')) {
    exit;
}

// Generate dynamic CSS
function avatar_studio_generate_dynamic_css() {
    global $styles;
    
    ob_start();
    
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
            } else if ($key == 'switch-button') {
                echo arrayToCss('#switchInteractionMode', $style, true);
            } else if ($key == 'transcript-button') {
                echo arrayToCss('.transcriptToggleButton', $style, true);
            } else if ($key == 'fullscreen-button') {
                echo arrayToCss('.action-fullscreen', $style, true);
                echo arrayToCss('#fullscreen', $style, true);
            } else if ($key == 'close-button') {
                echo arrayToCss('#chatBox-close', $style, true);
                if (isset($style['hover-background']) && $style['hover-background']) {
                    echo '#chatBox-close:hover { background: ' . esc_attr($style['hover-background']) . ' !important; }' . "\n";
                }
            } else if ($key == 'toast-success') {
                echo generateToastCss('.notification.success', $style);
            } else if ($key == 'toast-error') {
                echo generateToastCss('.notification.error', $style);
            } else if ($key == 'toast-warning') {
                echo generateToastCss('.notification.warning', $style);
            } else if ($key == 'toast-info') {
                echo generateToastCss('.notification.info', $style);
            }
        }
    }
    
    return ob_get_clean();
}

// Helper function to generate toast notification CSS
function generateToastCss($selector, $style) {
    $css = '';
    
    if (!empty($style)) {
        $css .= $selector . " {\n";
        
        if (isset($style['background']) && $style['background']) {
            $css .= '    background: ' . esc_attr($style['background']) . " !important;\n";
        }
        
        if (isset($style['color']) && $style['color']) {
            $css .= '    color: ' . esc_attr($style['color']) . " !important;\n";
        }
        
        if (isset($style['border-color']) && $style['border-color']) {
            $borderWidth = isset($style['border-width']) && $style['border-width'] ? $style['border-width'] . 'px' : '1px';
            $css .= '    border: ' . $borderWidth . ' solid ' . esc_attr($style['border-color']) . " !important;\n";
        }
        
        if (isset($style['border-radius']) && $style['border-radius']) {
            $css .= '    border-radius: ' . esc_attr($style['border-radius']) . "px !important;\n";
        }
        
        if (isset($style['padding']) && $style['padding']) {
            $css .= '    padding: ' . esc_attr($style['padding']) . "px 16px !important;\n";
        }
        
        if (isset($style['font-size']) && $style['font-size']) {
            $css .= '    font-size: ' . esc_attr($style['font-size']) . "px !important;\n";
        }
        
        if (isset($style['box-shadow']) && $style['box-shadow']) {
            $css .= '    box-shadow: ' . esc_attr($style['box-shadow']) . " !important;\n";
        }
        
        $css .= "}\n\n";
        
        // Add gradient border effect for toasts if border-color is set
        if (isset($style['border-color']) && $style['border-color']) {
            $css .= $selector . "::after {\n";
            $css .= '    content: "" !important;' . "\n";
            $css .= '    position: absolute !important;' . "\n";
            $css .= '    inset: 0 !important;' . "\n";
            
            if (isset($style['border-radius']) && $style['border-radius']) {
                $css .= '    border-radius: ' . esc_attr($style['border-radius']) . "px !important;\n";
            }
            
            $css .= '    padding: 1px !important;' . "\n";
            $css .= '    background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1)) !important;' . "\n";
            $css .= '    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) !important;' . "\n";
            $css .= '    -webkit-mask-composite: xor !important;' . "\n";
            $css .= '    mask-composite: exclude !important;' . "\n";
            $css .= '    pointer-events: none !important;' . "\n";
            $css .= "}\n\n";
        }
        
        // Add hover effect for toasts
        $css .= $selector . ":hover {\n";
        $css .= '    transform: translateY(-2px) scale(1.02) !important;' . "\n";
        if (isset($style['box-shadow']) && $style['box-shadow']) {
            // Enhance the existing box shadow on hover
            $enhancedShadow = str_replace('0.25', '0.35', $style['box-shadow']);
            $css .= '    box-shadow: ' . esc_attr($enhancedShadow) . " !important;\n";
        }
        $css .= "}\n";
    }
    
    return $css;
}