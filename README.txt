=== Avatar Studio ===
Contributors: AvatarStudio
Tags: avatars, ai, google drive, automation, user management
Requires at least: 6.0
Tested up to: 6.8
Requires PHP: 8.0.3
Stable tag: 1.0.3
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

AI-powered multi-avatar management with Google Drive integration, automated exports, and advanced user insights.

== Description ==

**Avatar Studio** is a powerful WordPress plugin designed to automate, organize, and enhance your avatar-based interactions.  
It integrates with Google Drive for secure data backup, automatically exports conversation transcripts, tracks perception analyses via Tavus API, and provides an admin dashboard for managing user and session information.  

Built for creators, educators, and developers who use AI-driven avatars, Avatar Studio simplifies workflow management and provides deep visibility into all avatar conversations.

### ✨ Key Features

#### 1. Google Drive Integration
- Secure OAuth 2.0 authentication with Google.
- Automatic folder hierarchy: *Website → Avatar Name → Transcripts / Perceptions*.
- One-click connect/disconnect functionality.
- Persistent token refresh mechanism.
- Visual connection status indicator on the Sessions page.
- Automatic folder organization by avatar name.

#### 2. Automated Transcript Export
- Automatically exports conversation transcripts to Google Drive.
- Supports bulk export for all transcripts.
- Retry mechanism for failed exports.
- Configurable export intervals (5 mins, 15 mins, hourly, twice daily, daily).
- Professionally formatted PDF generation.
- Export status tracking: *Exported, Failed, Not Exported*.
- One-hour cooldown period before new exports are available.

#### 3. Perception Analysis Tracking
- Retrieve and export perception analysis data from the Tavus API.
- Dedicated “Perceptions” folder in Google Drive.
- Professionally designed perception reports (PDF).
- Status tracking: *Processed, Unavailable, Failed, Not Processed*.
- Automatic retry for failed exports.

#### 4. User Information Management
- Centralized dashboard for managing all user information.
- Search and filter by name, email, mobile, or country code.
- Sortable columns and pagination (10 items per page).
- Stats cards for total users and page overview.
- Responsive and clean interface.
- Displays: Full Name, Email, Mobile, Country Code, Conversation ID, Created At.

#### 5. Enhanced Sessions Management
- Dual status tracking for transcripts and perceptions.
- Color-coded indicators: **Green (success)**, **Red (failure)**, **Gray (pending)**.
- Retry buttons for individual exports.
- Cooldown countdown tooltips.
- Displays: Session ID, Avatar ID, User ID, Duration, and Status.
- Quick action buttons for managing sessions efficiently.

### 🐞 Bug Fixes (v1.0.3)
- Fixed Google token expiration handling.
- Resolved folder creation issues with special characters.
- Corrected timezone handling in exports.
- Fixed pagination errors in the user information table.
- Improved error handling for unavailable Tavus data.
- Resolved race conditions during concurrent export tasks.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/avatar-studio` directory, or install the plugin through the WordPress plugins screen directly.  
2. Activate the plugin through the ‘Plugins’ screen in WordPress.  
3. Navigate to **Avatar Studio → Settings** to connect your Google Drive account.  
4. Configure your export intervals, enable automated transcripts, and manage perception tracking from the dashboard.

== Frequently Asked Questions ==

= Does Avatar Studio require a Google account? =
Yes. You’ll need to connect a Google account to enable Drive integration and automatic transcript storage.

= Can I manually export transcripts? =
Yes. Along with automated exports, you can manually trigger exports for specific sessions from the admin panel.

= What happens if my Google token expires? =
The plugin includes a built-in token refresh system to ensure continuous connectivity.

= Is this plugin compatible with other AI or avatar plugins? =
Yes. Avatar Studio is designed to work independently and can integrate seamlessly into most AI/virtual avatar workflows.

== Screenshots ==

1. Avatar Studio Dashboard – Overview of users and sessions  
2. Google Drive Connection Panel  
3. Transcript Export Settings  
4. Perception Analysis Reports  
5. User Information Management Table  

== Changelog ==

= 1.0.3 =
* Added Google Drive integration with OAuth 2.0.
* Introduced automated transcript exports.
* Added perception analysis tracking with Tavus API.
* New user information management dashboard.
* Enhanced session visibility and control.
* Fixed token expiration, timezone, and pagination issues.
* Improved stability and error handling.

== Upgrade Notice ==

= 1.0.3 =
This version introduces Google Drive integration, perception tracking, and a full user management dashboard. Please reconnect your Google Drive account after updating.

== License ==

This plugin is licensed under the GPLv2 or later.  
You can redistribute it and/or modify it under the same license terms.
