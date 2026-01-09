=== Interactive Avatar Studio by Avanew ===
Contributors: avanew
Tags: avatars, ai, automation, user management, pdf export
Requires at least: 6.0
Tested up to: 6.9
Requires PHP: 8.0.3
Stable tag: 1.0.6
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
 
Interactive Avatar Studio by Avanew helps site administrators manage avatar-based interactions, export session data, and organize reports using local processing and connected services.
 
== Description ==
 
**Interactive Avatar Studio by Avanew** is a WordPress plugin designed to manage and organize avatar-based interactions within the WordPress admin area.
 
The plugin provides tools for managing users and sessions, exporting conversation data, generating PDF reports, and optionally connecting external services when explicitly configured by an administrator.
 
It is intended for site owners, educators, and developers who work with AI-driven or interactive avatar systems and require structured session management and reporting.
 
== Key Features ==
 
= User and Session Management =
- Admin dashboard for managing users and avatar sessions.
- Search, filter, and paginate user records.
- View session metadata including IDs, timestamps, and status.
 
= Transcript and Report Export =
- Export conversation transcripts as PDF files.
- Bulk export support.
- Status indicators for completed, pending, or failed exports.
- Retry support for failed export actions.
 
= PDF Generation =
- Server-side PDF generation for transcripts and reports.
- PDF files are generated locally within the WordPress environment.
 
= Administrative Controls =
- Configurable export intervals.
- Clear status indicators for actions and processes.
- Access restricted to authorized users only.
 
== Installation ==
 
1. Upload the plugin files to the `/wp-content/plugins/interactive-avatar-studio` directory, or install the plugin through the WordPress Plugins screen.
2. Activate the plugin through the “Plugins” screen in WordPress.
3. Access the plugin from the WordPress admin menu.
4. Configure settings as needed from the plugin settings screens.
 
== Frequently Asked Questions ==
 
= Does this plugin work without external services? =
Yes. Core management features work within WordPress. External services are used only when explicitly configured by an administrator.
 
= Who can access the plugin features? =
Only administrators or users with appropriate capabilities can access and manage plugin features.
 
= Are PDFs generated externally? =
No. PDF files are generated locally on the server using a bundled library.
 
= Does the plugin track users? =
No tracking or analytics are performed unless an administrator explicitly initiates an action that requires data processing.
 
== Screenshots ==
 
1. Admin dashboard overview
2. User management table
3. Session management screen
4. Export status indicators
5. PDF export results
 
== External Services ==
 
This plugin connects to the Tavus API (https://tavus.io).
 
Purpose:
Used to retrieve avatar-related perception or messaging data when enabled by an administrator.
 
Data Sent:
User name and message content required for avatar-related processing.
 
When:
Only when an administrator or authorized user initiates avatar-related actions.
 
Privacy Policy:
https://tavus.io/privacy
 
This plugin may also connect to Google APIs (https://developers.google.com/drive).
 
Purpose:
Used to authenticate and store exported files in the site owner’s Google Drive when explicitly enabled.
 
Data Sent:
Authentication tokens and file metadata required for file storage operations.
 
When:
Only when an administrator connects a Google account or triggers an export action.
 
Privacy Policy:
https://policies.google.com/privacy
 
== Third-Party Libraries ==
 
This plugin bundles the TCPDF library for PDF generation.
 
Library Name: TCPDF  
Library Website: https://tcpdf.org/  
License: GNU LGPL v3 or later  
License URL: https://www.gnu.org/licenses/lgpl-3.0.html  
 
Purpose:
TCPDF is used exclusively to generate PDF files for transcripts and reports.
 
Data Handling:
- TCPDF runs entirely on the server.
- No user data is transmitted to external servers by TCPDF.
- No tracking, analytics, or telemetry is performed.
 
== Changelog ==
 
= 1.0.6 =
- Security hardening and sanitization improvements.
- Replaced external requests with WordPress HTTP API.
- Removed remote CDN dependencies.
- Improved export stability and error handling.
- Documentation and compliance updates.
 
= 1.0.6 =
- Initial release.
- User and session management.
- PDF export functionality.
 
== Upgrade Notice ==
 
= 1.0.6 =
This release includes security improvements and compliance updates. No user action is required after upgrading.
 
== License ==
 
This plugin is licensed under the GPLv2 or later.  
You are free to redistribute and modify it under the same license terms.
 
This plugin does not track users or collect analytics data unless explicitly initiated by an administrator.