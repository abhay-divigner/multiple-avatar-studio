// assets/js/sessions-admin.js
(function ($) {
  "use strict";

  // Initialize when document is ready
  $(document).ready(function () {
    // Copy session ID functionality
    $(".copy-btn").on("click", function () {
      const sessionId = $(this).data("session-id");
      copyToClipboard(sessionId, this);
    });

    // Show user details functionality
    $(".btn-user-details").on("click", function () {
      const sessionId = $(this).data("session-id");
      showUserDetails(sessionId);
    });

    // Close modal functionality
    $("#closeUserDetailsModal").on("click", function () {
      closeUserDetails();
    });

    // Close modal when clicking outside
    $("#userDetailsModal").on("click", function (e) {
      if (e.target === this) {
        closeUserDetails();
      }
    });
  });

  // Copy to clipboard function
  function copyToClipboard(text, button) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text, button);
      return;
    }

    navigator.clipboard.writeText(text).then(
      function () {
        showCopySuccess(button);
      },
      function (err) {
        console.error("Could not copy text: ", err);
        fallbackCopyTextToClipboard(text, button);
      }
    );
  }

  // Fallback copy method for older browsers
  function fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        showCopySuccess(button);
      } else {
        alert("Failed to copy session ID");
      }
    } catch (err) {
      console.error("Fallback copy failed: ", err);
      alert("Failed to copy session ID");
    }

    document.body.removeChild(textArea);
  }

  // Show copy success feedback
  function showCopySuccess(button) {
    const originalHTML = $(button).html();
    const originalTitle = $(button).attr("title");

    $(button).html(
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    );
    $(button).attr("title", "Copied!");

    setTimeout(function () {
      $(button).html(originalHTML);
      $(button).attr("title", originalTitle);
    }, 2000);
  }

  // Show user details
  function showUserDetails(sessionId) {
    if (
      typeof avatarStudioSessionsData !== "undefined" &&
      avatarStudioSessionsData.user_data[sessionId]
    ) {
      const userData = avatarStudioSessionsData.user_data[sessionId];
      populateUserDetailsModal(userData);
      $("#userDetailsModal").fadeIn();
    } else {
      alert("User data not found for this session.");
    }
  }

  // Populate the user details modal
  function populateUserDetailsModal(userData) {
    const content = $("#userDetailsContent");
    content.empty();

    let html = '<div class="user-details-grid">';

    // Basic user info
    html += '<div class="detail-group">';
    html += "<h3>User Information</h3>";
    html += '<div class="detail-item">';
    html += '<span class="detail-label">Full Name:</span>';
    html +=
      '<span class="detail-value">' +
      escapeHtml(userData.full_name || "N/A") +
      "</span>";
    html += "</div>";
    html += '<div class="detail-item">';
    html += '<span class="detail-label">Email:</span>';
    html +=
      '<span class="detail-value">' +
      escapeHtml(userData.email || "N/A") +
      "</span>";
    html += "</div>";
    html += '<div class="detail-item">';
    html += '<span class="detail-label">Phone:</span>';
    html += '<span class="detail-value">';
    if (userData.mobile) {
      // Format phone number
      const cleanPhone = userData.mobile.replace(/\D/g, "");
      let formattedPhone = "+1 " + cleanPhone;
      if (cleanPhone.length === 10) {
        formattedPhone =
          "+1 (" +
          cleanPhone.substring(0, 3) +
          ") " +
          cleanPhone.substring(3, 6) +
          "-" +
          cleanPhone.substring(6, 10);
      }
      html += escapeHtml(formattedPhone);
    } else {
      html += "N/A";
    }
    html += "</span>";
    html += "</div>";
    html += '<div class="detail-item">';
    html += '<span class="detail-label">Country Code:</span>';
    html +=
      '<span class="detail-value">' +
      escapeHtml(userData.country_code || "N/A") +
      "</span>";
    html += "</div>";
    html += "</div>";

    // Session info
    html += '<div class="detail-group">';
    html += "<h3>Session Information</h3>";
    html += '<div class="detail-item">';
    html += '<span class="detail-label">Conversation ID:</span>';
    html +=
      '<span class="detail-value monospace">' +
      escapeHtml(userData.conversation_id || "N/A") +
      "</span>";
    html += "</div>";
    html += '<div class="detail-item">';
    html += '<span class="detail-label">Created:</span>';
    html += '<span class="detail-value">';
    if (userData.created_at) {
      const date = new Date(userData.created_at + " UTC");
      html += date.toLocaleString();
    } else {
      html += "N/A";
    }
    html += "</span>";
    html += "</div>";
    html += "</div>";

    // Form data if exists
    if (userData.form_data) {
      try {
        const formData = JSON.parse(userData.form_data);
        if (formData && Object.keys(formData).length > 0) {
          html += '<div class="detail-group">';
          html += "<h3>Additional Information</h3>";
          for (const key in formData) {
            if (formData.hasOwnProperty(key)) {
              html += '<div class="detail-item">';
              html +=
                '<span class="detail-label">' + escapeHtml(key) + ":</span>";
              html +=
                '<span class="detail-value">' +
                escapeHtml(formData[key]) +
                "</span>";
              html += "</div>";
            }
          }
          html += "</div>";
        }
      } catch (e) {
        console.error("Error parsing form data:", e);
      }
    }

    html += "</div>";

    content.html(html);
  }

  // Close user details modal
  function closeUserDetails() {
    $("#userDetailsModal").fadeOut();
  }

  // HTML escaping function
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Export functions for global use
  window.copyToClipboard = copyToClipboard;
  window.showUserDetails = showUserDetails;
  window.closeUserDetails = closeUserDetails;
})(jQuery);
