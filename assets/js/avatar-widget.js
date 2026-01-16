// assets/js/avatar-widget.js

// Function to update voice transcript height based on fullscreen state
function updateTranscriptHeight() {
  const $voiceTranscript = jQuery("#voiceTranscript");
  const isFullscreen = jQuery(".bi-arrows-angle-contract").is(":visible");

  if (isFullscreen) {
    // Exit Fullscreen icon is visible - we're in fullscreen mode
    $voiceTranscript.css("height", "470px");
  } else {
    // Fullscreen icon is visible - we're in normal mode
    $voiceTranscript.css("height", "176px");
  }
}

// Desktop auto-open functionality
function checkDesktopVisitor() {
  return window.innerWidth > 768; // Simple desktop detection
}

// Initialize widget functions
function initAvatarWidget(avatar_open_on_desktop) {
  // Initial height set on page load
  updateTranscriptHeight();

  // Listen for fullscreen toggle clicks
  jQuery(document).on(
    "click",
    ".action-fullscreen, .chatBox-fullscreen",
    function () {
      // Use setTimeout to let the icons switch first
      setTimeout(updateTranscriptHeight, 50);
    }
  );

  // Also listen for the actual fullscreen change event
  jQuery(document).on(
    "fullscreenchange webkitfullscreenchange mozfullscreenchange msfullscreenchange",
    function () {
      updateTranscriptHeight();
    }
  );

  // Observer to watch for icon visibility changes (more reliable)
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "style"
      ) {
        const target = jQuery(mutation.target);
        if (
          target.hasClass("bi-fullscreen") ||
          target.hasClass("bi-arrows-angle-contract")
        ) {
          updateTranscriptHeight();
        }
      }
    });
  });

  // Start observing the fullscreen icons
  const fullscreenIcon = document.querySelector(".bi-fullscreen");
  const exitFullscreenIcon = document.querySelector(
    ".bi-arrows-angle-contract"
  );

  if (fullscreenIcon) {
    observer.observe(fullscreenIcon, {
      attributes: true,
      attributeFilter: ["style"],
    });
  }

  if (exitFullscreenIcon) {
    observer.observe(exitFullscreenIcon, {
      attributes: true,
      attributeFilter: ["style"],
    });
  }

  // Desktop auto-open if enabled
  if (avatar_open_on_desktop) {
    window.addEventListener("load", () => {
      var chatBox = document.getElementById("chatBox");
      const chatIcon = document.getElementById("chat-icon");
      if (checkDesktopVisitor() && !chatBox.classList.contains("show")) {
        chatBox.classList.add("show");
        chatIcon.classList.add("hide");
      }
    });
  }
}

// Export for use in other files if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    updateTranscriptHeight,
    checkDesktopVisitor,
    initAvatarWidget,
  };
}
