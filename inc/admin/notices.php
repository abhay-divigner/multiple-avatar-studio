<?php 
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
add_action( 'admin_notices', function () {
    if ( current_user_can( 'manage_options' ) && ! class_exists( 'TCPDF' ) ) {
        echo '<div class="notice notice-warning"><p>';
        esc_html_e(
            'PDF export requires TCPDF. Please install TCPDF via Composer or server library.',
            'interactive-avatar-studio'        );
        echo '</p></div>';
    }
});